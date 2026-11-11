import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { AuditorReassignmentService } from '../services/auditor-reassignment.service';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';

import {
  AuditorOption, CompanyGroup, PendingMap, PendingReassign, SelectionToggle, StageEvent, UnstageEvent,
  WorkloadItem, WorkloadSummary, buildCompanyGroups, toAuditorOption,
} from '../models/auditor-reassignment.model';
import { CompanyWorkloadPanelComponent } from '../com/company-workload-panel/company-workload-panel.component';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';

// CLIENT_MODE: when 'internal-audit', company/division/sub-division/scope data
// for reassignment comes from the static indi-org seed instead of the live
// workload API — see auditor-reassignment-indi-org.adapter.ts.
// NOTE: adjust these two import paths to match where client-mode.ts and the
// adapter actually live in your project — I only received the individual
// files, not their real locations.
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { buildIndiOrgAuditorOptions, buildIndiOrgWorkload } from '../auditor-reassignment-indi-org.adapter';
import {
  AssignmentRoles,
  REASSIGN_DATE_PICKER,
  ROLE_FILTER_ALL,
  SKELETON_BAR_COUNT,
  UNDO_TOAST_DURATION_MS,
  type RoleFilter,
} from '../constants/reassign-auditors.constants';
import { ROLE_FILTER_OPTIONS } from '../constants/reassign-auditors-labels.constants';
import {
  APPLYING_LABEL,
  REASSIGN_PLACEHOLDERS,
  REASSIGN_TOAST_MESSAGES,
  confirmReassignmentsLabel,
  formatDurationShort,
  reassignConfirmDialog,
} from '../constants/reassign-auditors-messages.constants';

@Component({
  selector: 'app-auditor-reassignment',
  standalone: true,
  imports: [BackButtonComponent, CommonModule, FormsModule, SelectModule, DatePickerModule, CompanyWorkloadPanelComponent],
  templateUrl: './reassign-auditors.component.html',
  styleUrls: ['./reassign-auditors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditorReassignmentComponent implements OnInit {
  private svc        = inject(AuditorReassignmentService);
  private confirmSvc = inject(ConfirmDialogService);
  /** 'audit-firm' | 'internal-audit' — decides whether workload/auditor data comes from the live API or the static indi-org seed. */
  private clientMode = inject(CLIENT_MODE);
  private get isInternalAudit(): boolean { return this.clientMode === 'internal-audit'; }


  auditorOptions    = signal<AuditorOption[]>([]);
  selectedAuditorId = signal<number | null>(null);

  private workload = signal<WorkloadItem[]>([]);
  loading  = signal(false);
  busyIds  = signal<Set<number>>(new Set());

  readonly skeletonBars = Array.from({ length: SKELETON_BAR_COUNT }, (_, i) => i + 1);   // stable ref for the loading *ngFor

  // ── Template constants ────────────────────────────────────────────────────────
  readonly datePicker   = REASSIGN_DATE_PICKER;
  readonly placeholders = REASSIGN_PLACEHOLDERS;
  readonly applyingLabel = APPLYING_LABEL;
  readonly confirmLabel  = confirmReassignmentsLabel;

  // ── Filters / view ────────────────────────────────────────────────────────────
  search      = signal('');
  roleFilter  = signal<RoleFilter>(ROLE_FILTER_ALL);
  bulkMode    = signal(false);
  selectedIds = signal<Set<number>>(new Set());

  confirmReassignmentLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.assignment.confirmReassignment:Confirm reassignment`
      : $localize`:@@audit.assignment.confirmReassignments:Confirm reassignments`;
  }

  selectedCountLabel(count: number): string {
    return $localize`:@@audit.assignment.selectedCount:${count}:count: selected`;
  }

  reassignmentsStagedLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.assignment.reassignmentStaged:reassignment staged`
      : $localize`:@@audit.assignment.reassignmentsStaged:reassignments staged`;
  }

  roleLabel(role: string): string {
    switch (role?.toLowerCase()) {
      case 'preparer': return $localize`:@@common.preparer:Preparer`;
      case 'reviewer': return $localize`:@@common.reviewer:Reviewer`;
      default: return role;
    }
  }

  reassignmentSuccessLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.assignment.oneReassignmentSuccess:Successfully reassigned 1 task`
      : $localize`:@@audit.assignment.reassignmentsSuccess:Successfully reassigned ${count}:count: tasks`;
  }

  readonly roleFilterOptions = [
    { label: $localize`:@@common.allRoles:All roles`, value: 'all' },
    { label: $localize`:@@common.preparer:Preparer`, value: 'preparer' },
    { label: $localize`:@@common.reviewer:Reviewer`, value: 'reviewer' },
  ];

  // ── Staging (single-commit model) ──────────────────────────────────────────────
  pending      = signal<PendingMap>(new Map());   // assignmentId → { toAuditorId, fromDate, toDate }
  globalReason = signal('');
  applying     = signal(false);

  // bulk stage target + shared reassignment period
  bulkTargetId = signal<number | null>(null);
  bulkFrom     = signal<Date | null>(null);
  bulkTo       = signal<Date | null>(null);

  // ── Bulk reassignment period duration (From ↔ To) ───────────────────────────────
  private bulkPeriodMs = computed<number | null>(() => {
    const f = this.bulkFrom();
    const t = this.bulkTo();
    if (!f || !t) return null;
    return new Date(t).getTime() - new Date(f).getTime();
  });

  /** True once both bulk dates are set and To is after From */
  bulkPeriodValid = computed(() => {
    const ms = this.bulkPeriodMs();
    return ms !== null && ms > 0;
  });

  /** Compact label, e.g. "1d 22h" or "3h 30m" */
  bulkPeriodShort = computed(() => formatDurationShort(this.bulkPeriodMs()));

  // ── Undo toast ──────────────────────────────────────────────────────────────
  toast = signal<{ msg: string; undo?: () => void } | null>(null);
  private toastTimer: any;

  // ── Derived ─────────────────────────────────────────────────────────────────
  selectedAuditor = computed(() => this.auditorOptions().find(a => a.value === this.selectedAuditorId()) ?? null);

  /** Can't reassign to the current auditor. */
  targetOptions = computed(() => this.auditorOptions().filter(a => a.value !== this.selectedAuditorId()));

  private filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const role = this.roleFilter();
    return this.workload().filter(w => {
      if (role !== ROLE_FILTER_ALL && w.role !== role) return false;
      if (q && !`${w.scopeLabel} ${w.jobName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  companyGroups = computed(() => buildCompanyGroups(this.filtered()));

  summary = computed<WorkloadSummary>(() => {
    const items = this.workload();
    return {
      companies:  new Set(items.map(i => i.companyId)).size,
      scopes:     new Set(items.map(i => `${i.companyId}:${i.divisionId}:${i.subDivisionId}:${i.scopeValue}:${i.role}`)).size,
      jobs:       items.length,
      asPreparer: items.filter(i => i.role === AssignmentRoles.Preparer).length,
      asReviewer: items.filter(i => i.role === AssignmentRoles.Reviewer).length,
    };
  });
private readonly toastModal = inject(ToastService);

  selectedCount = computed(() => this.selectedIds().size);
  pendingCount  = computed(() => this.pending().size);
  hasWorkload   = computed(() => this.workload().length > 0);

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    if (this.isInternalAudit) {
      // Internal-audit mode: auditor picker is built from the static
      // indi-org seed's auditor logins rather than the live user roster.
      this.auditorOptions.set(buildIndiOrgAuditorOptions());
      return;
    }
    this.svc.getAuditors().subscribe(users => this.auditorOptions.set(users.map(toAuditorOption)));
  }

  onAuditorChange(id: number | null): void {
    this.selectedAuditorId.set(id);
    this.resetSelection();
    this.clearPending();
    this.workload.set([]);
    if (id == null) return;

    if (this.isInternalAudit) {
      // Internal-audit mode: company/division/sub-division/scope workload comes
      // straight from the static indi-org seed — no API round-trip, so no
      // loading state is needed.
      this.workload.set(buildIndiOrgWorkload(id));
      return;
    }

    this.loading.set(true);
    this.svc.getWorkload(id).pipe(finalize(() => this.loading.set(false)))
      .subscribe(items => this.workload.set(items));
  }

  // ── Filter / view ───────────────────────────────────────────────────────────
  toggleBulk(): void {
    this.bulkMode.update(b => !b);
    if (!this.bulkMode()) this.resetSelection();
  }

  // ── Selection ─────────────────────────────────────────────────────────────────
  onToggle(ev: SelectionToggle): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      ev.ids.forEach(id => ev.checked ? next.add(id) : next.delete(id));
      return next;
    });
  }

  private resetSelection(): void {
    this.selectedIds.set(new Set());
    this.bulkTargetId.set(null);
    this.bulkFrom.set(null);
    this.bulkTo.set(null);
  }

  /** "Reassign all to…" — flips into bulk mode with everything selected. */
  selectAllForHandover(): void {
    this.bulkMode.set(true);
    this.selectedIds.set(new Set(this.filtered().map(w => w.assignmentId)));
  }

  // ── Staging ─────────────────────────────────────────────────────────────────
  onStage(ev: StageEvent): void {
    this.pending.update(m => {
      const next = new Map(m);
      ev.assignmentIds.forEach(id =>
        next.set(id, { toAuditorId: ev.toAuditorId, fromDate: ev.fromDate, toDate: ev.toDate }));
      return next;
    });
  }

  onUnstage(ev: UnstageEvent): void {
    this.pending.update(m => {
      const next = new Map(m);
      ev.assignmentIds.forEach(id => next.delete(id));
      return next;
    });
  }

  /** True once a bulk target + full period are chosen (period is mandatory). */
  bulkComplete = computed(() =>
    this.bulkTargetId() != null && this.bulkFrom() != null && this.bulkTo() != null && this.selectedCount() > 0);

  /** Bulk-select → stage all selected rows to the chosen target + shared date range. */
  onBulkStage(): void {
    const to = this.bulkTargetId();
    const from = this.bulkFrom();
    const till = this.bulkTo();
    if (to == null || from == null || till == null || this.selectedCount() === 0) return;
    const ids = [...this.selectedIds()];
    this.pending.update(m => {
      const next = new Map(m);
      ids.forEach(id => next.set(id, { toAuditorId: to, fromDate: from, toDate: till }));
      return next;
    });
    this.resetSelection();
  }

  clearPending(): void {
    this.pending.set(new Map());
    this.globalReason.set('');
  }

  // ── Single commit ─────────────────────────────────────────────────────────────
  async confirmAll(): Promise<void> {
    const from = this.selectedAuditorId();
    if (from == null || this.pendingCount() === 0) return;

    const count = this.pendingCount();
    const auditor = this.selectedAuditor()?.label ?? '';
    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.assignment.confirmReassignmentsTitle:Confirm Reassignments`,
      message: $localize`:@@audit.assignment.confirmReassignmentsMessage:Apply ${count}:count: reassignment(s) from ${auditor}:auditor:? Affected auditors will be notified.`,
      action: 'approve',
      confirmLabel: $localize`:@@audit.assignment.yesApply:Yes, Apply`,
    });
    if (!confirmed) return;
 this.toastModal.success(this.reassignmentSuccessLabel(this.pendingCount()));

    const entries = [...this.pending().entries()];              // [assignmentId, plan]
    const ids = entries.map(([id]) => id);
    const removed = this.workload().filter(w => ids.includes(w.assignmentId));

    // one service call per distinct (target + date-range) plan
    const groups = groupByPlan(entries);
    const calls = groups.map(g => this.svc.reassign({
      assignmentIds: g.ids, fromAuditorId: from, toAuditorId: g.toAuditorId,
      fromDate: g.fromDate, toDate: g.toDate, reason: this.globalReason() || undefined,
    }));

    this.applying.set(true);
    this.setBusy(ids, true);

    forkJoin(calls).pipe(finalize(() => { this.applying.set(false); this.setBusy(ids, false); }))
      .subscribe({
        next: () => {
          this.workload.update(list => list.filter(w => !ids.includes(w.assignmentId)));
          this.clearPending();
          this.resetSelection();
          //this.showToast(`Reassigned ${ids.length} item(s)`, () => this.undoAll(removed, from, entries));
        },
        // TODO: on error keep pending + workload; surface a failure toast
      });
  }

  private undoAll(items: WorkloadItem[], originalFrom: number, entries: [number, PendingReassign][]): void {
    const groups = groupByPlan(entries);
    const calls = groups.map(g =>
      this.svc.reassign({ assignmentIds: g.ids, fromAuditorId: g.toAuditorId, toAuditorId: originalFrom }));
    forkJoin(calls).subscribe(() => {
      this.workload.update(list => [...items, ...list]);
      this.toast.set(null);
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  private setBusy(ids: number[], busy: boolean): void {
    this.busyIds.update(set => {
      const next = new Set(set);
      ids.forEach(id => busy ? next.add(id) : next.delete(id));
      return next;
    });
  }

  private showToast(msg: string, undo?: () => void): void {
    clearTimeout(this.toastTimer);
    this.toast.set({ msg, undo });
    this.toastTimer = setTimeout(() => this.toast.set(null), UNDO_TOAST_DURATION_MS);
  }

  dismissToast(): void { clearTimeout(this.toastTimer); this.toast.set(null); }

  trackByCompany = (_: number, c: CompanyGroup) => c.companyId;
}

interface PlanGroup { toAuditorId: number; fromDate: Date | null; toDate: Date | null; ids: number[]; }

/** Group [assignmentId, plan] pairs by target + date range so each becomes one call. */
function groupByPlan(entries: [number, PendingReassign][]): PlanGroup[] {
  const map = new Map<string, PlanGroup>();
  for (const [aid, p] of entries) {
    const key = `${p.toAuditorId}|${p.fromDate?.getTime() ?? ''}|${p.toDate?.getTime() ?? ''}`;
    let g = map.get(key);
    if (!g) {
      g = { toAuditorId: p.toAuditorId, fromDate: p.fromDate, toDate: p.toDate, ids: [] };
      map.set(key, g);
    }
    g.ids.push(aid);
  }
  return [...map.values()];
}
