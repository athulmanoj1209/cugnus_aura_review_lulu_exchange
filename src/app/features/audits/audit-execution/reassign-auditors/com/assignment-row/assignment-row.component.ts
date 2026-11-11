import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import {
  AuditorOption, PendingMap, PendingReassign, ScopeGroup, SelectionToggle, StageEvent, UnstageEvent, WorkloadItem,
} from '../../models/auditor-reassignment.model';
import {
  AssignmentRoles,
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  REASSIGN_DATE_PICKER,
  SCOPE_PICKER_TARGET,
  STAGED_DATE_FORMAT_OPTIONS,
  type PickerTarget,
} from '../../constants/reassign-auditors.constants';
import { ASSIGNMENT_ROLE_LABELS } from '../../constants/reassign-auditors-labels.constants';
import {
  OPEN_DATE_LABEL,
  REASSIGN_PICKER_HINTS,
  REASSIGN_PLACEHOLDERS,
  SOME_JOBS_STAGED,
  formatDurationShort,
  stagedHint,
} from '../../constants/reassign-auditors-messages.constants';

/** One scope group: scope header + expandable jobs. Picking a target + dates STAGES a
 *  reassignment (chip shown); the actual commit happens via the single footer button. */
@Component({
  selector: 'app-assignment-row',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, DatePickerModule],
  templateUrl: './assignment-row.component.html',
  styleUrls: ['./assignment-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentRowComponent {
  scope         = input.required<ScopeGroup>();
  targetOptions = input.required<AuditorOption[]>();
  fromAuditor   = input<AuditorOption | null>(null);
  pending       = input<PendingMap>(new Map());        // assignmentId → staged plan
  bulkMode      = input(false);
  selectedIds   = input<Set<number>>(new Set());
  busyIds       = input<Set<number>>(new Set());

  stage    = output<StageEvent>();
  unstage  = output<UnstageEvent>();
  toggle   = output<SelectionToggle>();

  // ── Template constants ──────────────────────────────────────────────────────
  readonly AssignmentRoles   = AssignmentRoles;
  readonly SCOPE_TARGET      = SCOPE_PICKER_TARGET;
  readonly roleLabels        = ASSIGNMENT_ROLE_LABELS;
  readonly datePicker        = REASSIGN_DATE_PICKER;
  readonly placeholders      = REASSIGN_PLACEHOLDERS;
  readonly requiredHint      = REASSIGN_PICKER_HINTS.Required;
  readonly someJobsStaged    = SOME_JOBS_STAGED;
  readonly stagedHint        = stagedHint;

  expanded  = signal(false);
  /** which picker is open: 'scope', a jobId, or null */
  pickerFor = signal<PickerTarget | null>(null);
  // in-progress picker values
  pickValue = signal<number | null>(null);
  pickFrom  = signal<Date | null>(null);
  pickTo    = signal<Date | null>(null);

  readonly collapseJobsLabel = $localize`:@@audit.assignment.collapseJobs:Collapse jobs`;
  readonly expandJobsLabel = $localize`:@@audit.assignment.expandJobs:Expand jobs`;

  selectScopeAriaLabel(scope: string): string {
    return $localize`:@@audit.assignment.selectScope:Select ${scope}:scope:`;
  }

  jobsCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.assignment.oneJob:${count}:count: job`
      : $localize`:@@audit.assignment.jobsCount:${count}:count: jobs`;
  }

  selectJobAriaLabel(jobName: string): string {
    return $localize`:@@audit.assignment.selectJob:Select ${jobName}:jobName:`;
  }

  stagedMessage(count: number): string {
    return count > 1
      ? $localize`:@@audit.assignment.jobsStaged:${count}:count: jobs staged · applied on Confirm`
      : $localize`:@@audit.assignment.jobStaged:This job is staged · applied on Confirm`;
  }

  roleLabel(role: string): string {
    switch (role?.toLowerCase()) {
      case 'preparer': return $localize`:@@common.preparer:Preparer`;
      case 'reviewer': return $localize`:@@common.reviewer:Reviewer`;
      default: return role;
    }
  }

  periodDurationLabel(): string {
    const days = this.periodDays();
    const hours = this.periodHours();
    const minutes = this.periodMinutes();

    if (!days && !hours && !minutes) { return $localize`:@@audit.assignment.lessThanMinute:Less than a minute`; }
    const parts: string[] = [];

    if (days) {
      parts.push(
        days === 1
          ? $localize`:@@audit.assignment.oneDay:${days}:count: day`
          : $localize`:@@audit.assignment.days:${days}:count: days`
      );
    }

    if (hours) {
      parts.push(
        hours === 1
          ? $localize`:@@audit.assignment.oneHour:${hours}:count: hour`
          : $localize`:@@audit.assignment.hours:${hours}:count: hours`
      );
    }

    if (minutes && !days) {
      parts.push(
        $localize`:@@audit.assignment.minutes:${minutes}:count: min`
      );
    }

    return parts.join(' ');
  }

  // ── selection state ─────────────────────────────────────────────────────────
  scopeChecked = computed(() => this.scope().assignmentIds.every(id => this.selectedIds().has(id)));
  scopeIndeterminate = computed(() => {
    const ids = this.scope().assignmentIds;
    const n = ids.filter(id => this.selectedIds().has(id)).length;
    return n > 0 && n < ids.length;
  });
  isJobChecked = (id: number) => this.selectedIds().has(id);
  isBusy = (id: number) => this.busyIds().has(id);
  scopeBusy = computed(() => this.scope().assignmentIds.some(id => this.busyIds().has(id)));

  toggleScope(checked: boolean) { this.toggle.emit({ ids: this.scope().assignmentIds, checked }); }
  toggleJob(item: WorkloadItem, checked: boolean) { this.toggle.emit({ ids: [item.assignmentId], checked }); }

  // ── staged state ────────────────────────────────────────────────────────────
  optOf = (id: number | null | undefined) => (id == null ? undefined : this.targetOptions().find(o => o.value === id));

  /** the plan if the whole scope is staged to a single auditor, else null */
  scopePending = computed<PendingReassign | null>(() => {
    const p = this.pending();
    const ids = this.scope().assignmentIds;
    const plans = ids.map(id => p.get(id)).filter((v): v is PendingReassign => v != null);
    if (plans.length === ids.length && new Set(plans.map(pl => pl.toAuditorId)).size === 1) return plans[0];
    return null;
  });
  /** true when some (but not all/uniform) jobs of the scope are staged */
  scopePartial = computed(() => {
    const p = this.pending();
    const ids = this.scope().assignmentIds;
    const n = ids.filter(id => p.has(id)).length;
    return n > 0 && this.scopePending() == null;
  });
  jobStaged = (id: number): PendingReassign | null => this.pending().get(id) ?? null;

  /** short display for a Date */
  fmtDate = (d: Date | null): string =>
    !d ? OPEN_DATE_LABEL : d.toLocaleString(undefined, STAGED_DATE_FORMAT_OPTIONS);

  // ── Reassignment period duration (From ↔ To) ────────────────────────────────
  /** Raw ms between the chosen From/To, or null if either is unset */
  private periodMs = computed<number | null>(() => {
    const f = this.pickFrom();
    const t = this.pickTo();
    if (!f || !t) return null;
    return new Date(t).getTime() - new Date(f).getTime();
  });

  /** True once both dates are set and To is after From */
  periodValid = computed(() => {
    const ms = this.periodMs();
    return ms !== null && ms > 0;
  });

  periodDays = computed(() => {
    const ms = this.periodMs();
    return ms && ms > 0 ? Math.floor(ms / MS_PER_DAY) : 0;
  });

  periodHours = computed(() => {
    const ms = this.periodMs();
    return ms && ms > 0 ? Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR) : 0;
  });

  periodMinutes = computed(() => {
    const ms = this.periodMs();
    return ms && ms > 0 ? Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE) : 0;
  });

  /** Compact chip label, e.g. "1d 22h" or "3h 30m" */
  periodShort = computed(() => formatDurationShort(this.periodMs()));

  // ── picker ──────────────────────────────────────────────────────────────────
  openPicker(target: PickerTarget) {
    this.pickerFor.set(target);
    const cur = target === SCOPE_PICKER_TARGET ? this.scopePending() : this.jobStaged(target);
    this.pickValue.set(cur?.toAuditorId ?? null);
    this.pickFrom.set(cur?.fromDate ?? null);
    this.pickTo.set(cur?.toDate ?? null);
    if (target === SCOPE_PICKER_TARGET) this.expanded.set(true);
  }
  closePicker() { this.pickerFor.set(null); }

  // stage/update on any change (target is required before it stages)
  onPickTarget(target: PickerTarget, to: number | null) { this.pickValue.set(to); this.emitStage(target); }
  onPickFrom(target: PickerTarget, v: Date | null)      { this.pickFrom.set(v ?? null); this.emitStage(target); }
  onPickTo(target: PickerTarget, v: Date | null)        { this.pickTo.set(v ?? null); this.emitStage(target); }

  /** true once auditor + both dates are chosen (period is mandatory) */
  pickComplete = computed(() => this.pickValue() != null && this.pickFrom() != null && this.pickTo() != null);

  private emitStage(target: PickerTarget) {
    const to = this.pickValue();
    const from = this.pickFrom();
    const till = this.pickTo();
    const ids = target === SCOPE_PICKER_TARGET ? this.scope().assignmentIds : [target];
    if (to != null && from != null && till != null) {
      // complete → stage
      this.stage.emit({ assignmentIds: ids, toAuditorId: to, fromDate: from, toDate: till });
    } else {
      // incomplete → make sure it isn't left staged
      this.unstage.emit({ assignmentIds: ids });
    }
  }

  clearScope() { this.unstage.emit({ assignmentIds: this.scope().assignmentIds }); this.pickerFor.set(null); }
  clearJob(id: number) { this.unstage.emit({ assignmentIds: [id] }); this.pickerFor.set(null); }

  trackByJob = (_: number, job: WorkloadItem) => job.assignmentId;
}