import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';

import {
  AuditDescriptionSelection,
  AuditJob,
  AuditScope,
  DescriptionItem,
  DescriptionKind,
  DescriptionTypeGroup,
  MOCK_SCOPES,
  SelectedDescription,
} from '@/app/features/audits/audit-report/audit-description-picker/models/audit-description.model';


/** Character length past which an item description gets a "View more" toggle. */
const DESCRIPTION_CLAMP = 100;

/**
 * Pick audit descriptions across a Scope → Job → Type → Description hierarchy.
 * Custom expandable rows (no p-tree) with native tri-state checkboxes,
 * matching the project's assignment-row / auditor-reassignment conventions.
 */
@Component({
  selector: 'app-audit-description-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-description-picker.component.html',
  styleUrls: ['./audit-description-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDescriptionPickerComponent {
  // ── Inputs ──────────────────────────────────────────────────────────────
  scopes = input<AuditScope[]>(MOCK_SCOPES);
  /** Optional description-kind filter, driven from the parent. */
  selectedKind = input<DescriptionKind | null>(null);
  title = input($localize`:@@audit.auditReport.addAuditDescriptions:Add audit descriptions`);
  subtitle = input($localize`:@@audit.auditReport.selectDescriptionsSubtitle:Select descriptions across scopes and jobs`);

  // ── Outputs ─────────────────────────────────────────────────────────────
  add = output<AuditDescriptionSelection>();

  private confirmSvc = inject(ConfirmDialogService);

  /** Flips true after a successful confirm; shown as a footer message. */
  added = signal(false);

  // ── View state ──────────────────────────────────────────────────────────
  search = signal('');
  /** Dropdown scope filter: 'all' or a specific scope id. */
  scopeFilter = signal<string | 'all'>('all');
  /** Dropdown type filter: 'all' or a specific kind. */
  typeFilter = signal<DescriptionKind | 'all'>('all');
  selectedIds = signal<Set<string>>(new Set());
  expandedScopes = signal<Set<string>>(new Set());
  expandedJobs = signal<Set<string>>(new Set());
  /** Type sections are open by default; ids here are collapsed. */
  collapsedTypes = signal<Set<string>>(new Set());
  /** Item ids whose full description is expanded. */
  expandedItems = signal<Set<string>>(new Set());

  selectAllLabel(): string {
    return this.allSelected() ? $localize`:@@common.clearAll:Clear all` : $localize`:@@common.selectAll:Select all`;
  }

  expandAllLabel(): string {
    return this.allExpanded() ? $localize`:@@common.collapseAll:Collapse All` : $localize`:@@common.expandAll:Expand All`;
  }

  selectAllInLabel(name: string): string {
    return $localize`:@@audit.auditReport.selectAllIn:Select all in ${name}:name:`;
  }

  scopeSummaryLabel(jobCount: number, descriptionCount: number): string {
    const jobs = jobCount === 1
      ? $localize`:@@audit.auditReport.oneJob:${jobCount}:count: job`
      : $localize`:@@audit.auditReport.jobsCount:${jobCount}:count: jobs`;

    const descriptions = descriptionCount === 1
      ? $localize`:@@audit.auditReport.oneDescription:${descriptionCount}:count: description`
      : $localize`:@@audit.auditReport.descriptionsCount:${descriptionCount}:count: descriptions`;

    return $localize`:@@audit.auditReport.scopeSummary:${jobs}:jobs: · ${descriptions}:descriptions:`;
  }

  selectedLabel(count: number): string {
    return $localize`:@@audit.auditReport.selectedCount:${count}:count: selected`;
  }

  jobSummaryLabel(typeCount: number, descriptionCount: number): string {
    const types = typeCount === 1
      ? $localize`:@@audit.auditReport.oneType:${typeCount}:count: type`
      : $localize`:@@audit.auditReport.typesCount:${typeCount}:count: types`;

    const descriptions = descriptionCount === 1
      ? $localize`:@@audit.auditReport.oneDescription:${descriptionCount}:count: description`
      : $localize`:@@audit.auditReport.descriptionsCount:${descriptionCount}:count: descriptions`;

    return $localize`:@@audit.auditReport.jobSummary:${types}:types: · ${descriptions}:descriptions:`;
  }

  selectAllTypeLabel(type: string): string {
    return $localize`:@@audit.auditReport.selectAllType:Select all ${type}:type:`;
  }

  selectItemLabel(title: string): string {
    return $localize`:@@audit.auditReport.selectItem:Select ${title}:title:`;
  }

  viewMoreLabel(expanded: boolean): string {
    return expanded
      ? $localize`:@@common.viewLess:View less`
      : $localize`:@@common.viewMore:View more`;
  }

  descriptionsSelectedLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.auditReport.oneDescriptionSelected:${count}:count: description selected`
      : $localize`:@@audit.auditReport.descriptionsSelected:${count}:count: descriptions selected`;
  }

  addDescriptionsConfirmMessage(count: number): string {
    return count === 1
      ? $localize`:@@audit.auditReport.addOneDescriptionConfirm:Add ${count}:count: selected description to this audit? Please review your selection before continuing.`
      : $localize`:@@audit.auditReport.addDescriptionsConfirm:Add ${count}:count: selected descriptions to this audit? Please review your selection before continuing.`;
  }

  /** Options for the scope-filter dropdown. */
  scopeOptions = computed(() =>
    this.scopes().map((s) => ({ value: s.id, label: s.name }))
  );

  /** Options for the type-filter dropdown, built from the kinds present. */
  kindOptions = computed(() => {
    const seen = new Map<DescriptionKind, string>();
    for (const scope of this.scopes()) {
      for (const job of scope.jobs) {
        for (const type of job.types) {
          if (!seen.has(type.kind)) seen.set(type.kind, type.label);
        }
      }
    }
    return [...seen.entries()].map(([value, label]) => ({ value, label }));
  });

  /** Dropdown wins; falls back to the selectedKind input. */
  private effectiveKind = computed<DescriptionKind | null>(() => {
    const f = this.typeFilter();
    return f !== 'all' ? f : this.selectedKind();
  });

  // ── Filtered view ─────────────────────────────────────────────────────────
  view = computed<AuditScope[]>(() => {
    const q = this.search().trim().toLowerCase();
    const kind = this.effectiveKind();
    const scopeId = this.scopeFilter();

    return this.scopes()
      .filter((scope) => scopeId === 'all' || scope.id === scopeId)
      .map((scope) => {
        const jobs = scope.jobs
          .map((job) => {
            const types = job.types
              .filter((t) => !kind || t.kind === kind)
              .map((type) => {
                const scopeHit = scope.name.toLowerCase().includes(q);
                const jobHit = job.name.toLowerCase().includes(q);
                const typeHit = type.label.toLowerCase().includes(q);
                const items =
                  !q || scopeHit || jobHit || typeHit
                    ? type.items
                    : type.items.filter(
                        (i) =>
                          i.title.toLowerCase().includes(q) ||
                          (i.description ?? '').toLowerCase().includes(q)
                      );
                return { ...type, items };
              })
              .filter((t) => t.items.length > 0);
            return { ...job, types };
          })
          .filter((j) => j.types.length > 0);
        return { ...scope, jobs };
      })
      .filter((s) => s.jobs.length > 0);
  });

  hasResults = computed(() => this.view().length > 0);

  // ── Id collectors ─────────────────────────────────────────────────────────
  typeItemIds = (type: DescriptionTypeGroup): string[] => type.items.map((i) => i.id);
  jobItemIds = (job: AuditJob): string[] =>
    job.types.flatMap((t) => this.typeItemIds(t));
  scopeItemIds = (scope: AuditScope): string[] =>
    scope.jobs.flatMap((j) => this.jobItemIds(j));

  private allVisibleIds = computed<string[]>(() =>
    this.view().flatMap((s) => this.scopeItemIds(s))
  );

  // ── Selection state helpers ─────────────────────────────────────────────────
  isItemChecked = (id: string): boolean => this.selectedIds().has(id);

  allChecked = (ids: string[]): boolean =>
    ids.length > 0 && ids.every((id) => this.selectedIds().has(id));

  someChecked = (ids: string[]): boolean => {
    const n = ids.filter((id) => this.selectedIds().has(id)).length;
    return n > 0 && n < ids.length;
  };

  selectedInScope = (scope: AuditScope): number =>
    this.scopeItemIds(scope).filter((id) => this.selectedIds().has(id)).length;

  selectedInJob = (job: AuditJob): number =>
    this.jobItemIds(job).filter((id) => this.selectedIds().has(id)).length;

  // ── Selection mutations ─────────────────────────────────────────────────────
  toggleItem(id: string, checked: boolean): void {
    this.toggleMany([id], checked);
  }

  toggleMany(ids: string[], checked: boolean): void {
    this.added.set(false);
    this.selectedIds.update((set) => {
      const next = new Set(set);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }

  allSelected = computed(() => this.allChecked(this.allVisibleIds()));

  toggleSelectAll(): void {
    this.toggleMany(this.allVisibleIds(), !this.allSelected());
  }

  clear(): void {
    this.selectedIds.set(new Set());
    this.added.set(false);
  }

  // ── Expand / collapse ─────────────────────────────────────────────────────
  isScopeOpen = (id: string): boolean => this.expandedScopes().has(id);
  isJobOpen = (id: string): boolean => this.expandedJobs().has(id);

  toggleScope(id: string): void {
    this.expandedScopes.update((s) => this.flip(s, id));
  }
  toggleJob(id: string): void {
    this.expandedJobs.update((s) => this.flip(s, id));
  }
  private flip(set: Set<string>, id: string): Set<string> {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }

  allExpanded = computed(() => {
    const scopes = this.view();
    return (
      scopes.length > 0 &&
      scopes.every((s) => this.expandedScopes().has(s.id)) &&
      scopes.every((s) => s.jobs.every((j) => this.expandedJobs().has(j.id)))
    );
  });

  toggleExpandAll(): void {
    if (this.allExpanded()) {
      this.expandedScopes.set(new Set());
      this.expandedJobs.set(new Set());
    } else {
      this.expandedScopes.set(new Set(this.view().map((s) => s.id)));
      this.expandedJobs.set(
        new Set(this.view().flatMap((s) => s.jobs.map((j) => j.id)))
      );
      this.collapsedTypes.set(new Set());
    }
  }

  // ── Collapsible type sections ────────────────────────────────────────────────
  isTypeOpen = (id: string): boolean => !this.collapsedTypes().has(id);
  toggleType(id: string): void {
    this.collapsedTypes.update((s) => this.flip(s, id));
  }

  /** Job completion notes show description only (no bold title). */
  private descriptionOnly = (kind: DescriptionKind): boolean =>
    kind === 'scopeJobCompletionNotes';

  showTitle = (type: DescriptionTypeGroup): boolean => !this.descriptionOnly(type.kind);

  /** The body text to render for an item under a given type. */
  bodyText = (type: DescriptionTypeGroup, item: DescriptionItem): string =>
    this.descriptionOnly(type.kind)
      ? item.description ?? item.title
      : item.description ?? '';

  // ── Item description "View more" ──────────────────────────────────────────────
  isLong = (text?: string): boolean => !!text && text.length > DESCRIPTION_CLAMP;
  isItemExpanded = (id: string): boolean => this.expandedItems().has(id);
  toggleItemExpand(id: string): void {
    this.expandedItems.update((s) => this.flip(s, id));
  }

  // ── Counts + emit ───────────────────────────────────────────────────────────
  selectedCount = computed(() => {
    let n = 0;
    for (const scope of this.scopes()) {
      for (const job of scope.jobs) {
        for (const type of job.types) {
          for (const item of type.items) {
            if (this.selectedIds().has(item.id)) n++;
          }
        }
      }
    }
    return n;
  });

  /** Build the grouped + flat JSON of everything currently selected. */
  buildPayload(): AuditDescriptionSelection {
    const selected = this.selectedIds();
    const flat: SelectedDescription[] = [];
    const scopeGroups: AuditDescriptionSelection['scopes'] = [];

    for (const scope of this.scopes()) {
      const jobGroups: (typeof scopeGroups)[number]['jobs'] = [];
      for (const job of scope.jobs) {
        const typeGroups: (typeof jobGroups)[number]['types'] = [];
        for (const type of job.types) {
          const items = type.items.filter((i) => selected.has(i.id));
          if (!items.length) continue;
          typeGroups.push({
            typeId: type.id, kind: type.kind, typeLabel: type.label, items,
          });
          for (const item of items) {
            flat.push({
              scopeId: scope.id, scopeName: scope.name,
              jobId: job.id, jobName: job.name,
              typeId: type.id, kind: type.kind, typeLabel: type.label, item,
            });
          }
        }
        if (typeGroups.length) {
          jobGroups.push({ jobId: job.id, jobName: job.name, types: typeGroups });
        }
      }
      if (jobGroups.length) {
        scopeGroups.push({ scopeId: scope.id, scopeName: scope.name, jobs: jobGroups });
      }
    }

    return { totalSelected: flat.length, scopes: scopeGroups, flat };
  }

  /** Confirm, then emit the JSON payload. */
  async emitSelection(): Promise<void> {
    if (this.selectedCount() === 0) return;

    const payload = this.buildPayload();

    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.auditReport.addDescriptions:Add Descriptions`,
      message: this.addDescriptionsConfirmMessage(payload.totalSelected),
      action: 'approve',
      confirmLabel: $localize`:@@audit.auditReport.yesAdd:Yes, Add`,
    });
    if (!confirmed) return;

    // JSON containing all selected data.
    console.log('Selected descriptions payload:', JSON.stringify(payload, null, 2));

    this.add.emit(payload);
    this.added.set(true);
  }

  // ── trackBy ─────────────────────────────────────────────────────────────────
  trackByScope = (_: number, s: AuditScope) => s.id;
  trackByJob = (_: number, j: AuditJob) => j.id;
  trackByType = (_: number, t: DescriptionTypeGroup) => t.id;
  trackByItem = (_: number, item: DescriptionItem) => item.id;
}