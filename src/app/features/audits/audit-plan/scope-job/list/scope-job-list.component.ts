import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { ScopeJobProfileComponent, ScopeJobProfileDrawerData } from '../profile/scope-job-profile.component';
import { EditScopeJobComponent, EditScopeJobDrawerData } from '../manage/scope-job.component';
import { StatusUpdateDrawerComponent, StatusUpdateDrawerData, StatusUpdateResult } from '../com/scope-job-status-update/scope-job-status-update.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// Company / Division / Sub-Division filter options come from the shared static
// org directory (same source as the sibling list pages) instead of being
// scraped off the job records — ORG_STATIC_DATA_INTERNAL_AUDIT in
// 'internal-audit' client mode, otherwise ORG_STATIC_DATA. See `orgData` below.
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import {
  ScopeJobBlockActions,
  ScopeJobFilterKeys,
  ScopeJobSortColumns,
  ScopeJobSortDirections,
  ScopeJobStatuses,
  ScopeJobStatusUpdateTargets,
  ScopeJobViewModes,
  type ScopeJobBlockAction,
  type ScopeJobFilterKey,
  type ScopeJobSortColumn,
  type ScopeJobSortDirection,
  type ScopeJobViewMode,
  SCOPE_JOB_AVATAR_STACK_MAX,
  SCOPE_JOB_DRAWER,
  SCOPE_JOB_LIST_PAGE_SIZE,
  SCOPE_JOB_PAGE_SIZE_OPTIONS,
} from '../constants/scope-job.constants';
import {
  SCOPE_JOB_FILTER_CHIP_LABELS,
  SCOPE_JOB_FREQUENCY_LABELS,
  SCOPE_JOB_FREQUENCY_OPTIONS,
  SCOPE_JOB_SORT_ICONS,
  SCOPE_JOB_STATUS_LABELS,
  SCOPE_JOB_STATUS_OPTIONS,
  SCOPE_JOB_STATUS_SEVERITY,
  type ScopeJobTagSeverity,
} from '../constants/scope-job-labels.constants';
import { SCOPE_JOB_SUB_DIVISION_PLACEHOLDERS } from '../constants/scope-job-messages.constants';
import type { AuditFrequency, JobStatus, ScopeJob } from '../models/scope-job.model';
import { AUDITOR_REGISTRY } from '../data/scope-job-registry.data';
import { SCOPE_JOB_SEED } from '../data/scope-job-static.data';

/* ── Model & seed data ─────────────────────────────────────────────────────
 * The ScopeJob model lives in ../models/, the auditor / reviewer registries
 * and the per-client seed rows live in ../data/. scope-job-static.data.ts
 * picks the active client's rows (SCOPE_JOB_SEED) from
 * CLIENT_MODE_VALUE / INTERNAL_AUDIT_CLIENT_KEY_VALUE. ── */

// Re-exported so existing consumers importing them from this file keep working.
export type {
  AuditFrequency,
  JobStatus,
  ModeOfAudit,
  ScopeJob,
  AuditorProfile,
  ReviewerProfile,
} from '../models/scope-job.model';
export { AUDITOR_REGISTRY, REVIEWER_REGISTRY } from '../data/scope-job-registry.data';

type SortColumn = ScopeJobSortColumn;
type SortDir = ScopeJobSortDirection;

/** The live scope-job roster every consumer of this file gets. */
export const MOCK_SCOPE_JOBS: ScopeJob[] = SCOPE_JOB_SEED;

/* ── Component ──────────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-scope-job-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    DatePickerModule,
    TooltipModule,
    TagModule,
    PopoverModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,

    DrawIconComponent,],
  templateUrl: './scope-job-list.component.html',
  styleUrl: './scope-job-list.component.scss',
})
export class ScopeJobListComponent implements OnInit {
  @ViewChild('filterPanel') filterPanel!: Popover;

  private readonly drawer = inject(RightDrawerService);
  private readonly route  = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly location = inject(Location);

  /* ── Data ── */
  readonly jobs = signal<ScopeJob[]>(MOCK_SCOPE_JOBS);

  /* ── View mode ── */
  readonly viewMode = signal<ScopeJobViewMode>(ScopeJobViewModes.Grid);

  // Exposed for the template.
  readonly ScopeJobViewModes       = ScopeJobViewModes;
  readonly ScopeJobSortColumns     = ScopeJobSortColumns;
  readonly ScopeJobBlockActions    = ScopeJobBlockActions;
  readonly subDivisionPlaceholders = SCOPE_JOB_SUB_DIVISION_PLACEHOLDERS;
  readonly avatarStackMax          = SCOPE_JOB_AVATAR_STACK_MAX;

  /* ── Filters ── */
  readonly searchQuery          = signal('');
  readonly selectedScopes       = signal<string[]>([]);
  readonly selectedStatuses     = signal<JobStatus[]>([]);
  readonly selectedFrequencies  = signal<AuditFrequency[]>([]);
  readonly selectedCompanies    = signal<string[]>([]);
  readonly selectedDivisions     = signal<string[]>([]);
  readonly selectedSubDivisions  = signal<string[]>([]);
  readonly selectedAuditors     = signal<string[]>([]);
  readonly periodRange          = signal<(Date | null)[] | null>(null);

  /* ── Sort ── */
  readonly sortColumn    = signal<SortColumn | null>(ScopeJobSortColumns.PeriodStart);
  readonly sortDirection = signal<SortDir>(ScopeJobSortDirections.Asc);

  /* ── Pagination ── */
  readonly pageSize    = signal(SCOPE_JOB_LIST_PAGE_SIZE);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = SCOPE_JOB_PAGE_SIZE_OPTIONS;

  /* ── Confirmation dialog ── */
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<ScopeJobBlockAction>(ScopeJobBlockActions.Deactivate);
  private readonly pendingJob  = signal<ScopeJob | null>(null);
  readonly confirmationTarget  = this.pendingJob;

  /* ── Static filter options ── */
  readonly statusOptions    = SCOPE_JOB_STATUS_OPTIONS;

  readonly frequencyOptions = SCOPE_JOB_FREQUENCY_OPTIONS;

  /* ── Dynamic filter options (derived from data) ── */
  readonly scopeFilterOptions = computed(() => {
    const map = new Map<string, string>();
    this.jobs().forEach(j => map.set(j.scopeId, j.scopeName));
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ label: `${value} — ${label}`, value }));
  });

  /** Org directory for the current client mode — source of the org filters below. */
  readonly orgData = CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

  /** The selected companies, or every company when none is selected. */
  private scopedCompanies(names: string[]) {
    return names.length ? this.orgData.filter(c => names.includes(c.companyName)) : this.orgData;
  }

  /** Every company in the org directory. Values are company names (matching `j.company`). */
  readonly companyFilterOptions = computed(() =>
    this.orgData
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Divisions of the selected companies (or all). Values are division names (matching `j.division`). */
  readonly divisionFilterOptions = computed(() => {
    const set = new Set(
      this.scopedCompanies(this.selectedCompanies()).flatMap(c => c.divisions.map(d => d.divisionName)),
    );
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /** Sub-Divisions of the selected companies + divisions (or all). Divisions
   *  flagged `hasSubDivision: false` contribute none. Values are sub-division
   *  names (matching `j.subDivision`). */
  readonly subDivisionFilterOptions = computed(() => {
    const divisions = this.selectedDivisions();
    const set = new Set(
      this.scopedCompanies(this.selectedCompanies())
        .flatMap(c => c.divisions)
        .filter(d => d.hasSubDivision !== false)
        .filter(d => !divisions.length || divisions.includes(d.divisionName))
        .flatMap(d => d.subDivisions.map(sd => sd.subDivisionName)),
    );
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /** False only when at least one Division is selected and every selected
   *  Division is flagged `hasSubDivision: false` — the Sub-Division field is
   *  then hidden (and its selection ignored). Unknown divisions count as
   *  having sub-divisions. */
  readonly subDivisionFilterVisible = computed(() => {
    const selected = this.selectedDivisions();
    if (!selected.length) return true;
    const divisions = this.scopedCompanies(this.selectedCompanies()).flatMap(c => c.divisions);
    return selected.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  readonly auditorFilterOptions = computed(() => {
    const set = new Set(this.jobs().flatMap(j => j.assignedAuditors));
    return Array.from(set)
      .map(id => ({ label: AUDITOR_REGISTRY[id]?.name ?? id, value: id }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /* ── Active filter count & chips ── */
  readonly activeFilterCount = computed(() => {
    let c = 0;
    if (this.selectedScopes().length)       c++;
    if (this.selectedStatuses().length)     c++;
    if (this.selectedFrequencies().length)  c++;
    if (this.selectedCompanies().length)    c++;
    if (this.selectedDivisions().length)     c++;
    if (this.selectedSubDivisions().length)  c++;
    if (this.selectedAuditors().length)     c++;
    if (this.periodRange()?.[0] || this.periodRange()?.[1]) c++;
    return c;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: ScopeJobFilterKey; label: string }[] = [];
    const add = (key: ScopeJobFilterKey, count: number) => {
      if (count) chips.push({ key, label: `${SCOPE_JOB_FILTER_CHIP_LABELS[key]}: ${count}` });
    };
    add(ScopeJobFilterKeys.Scopes,       this.selectedScopes().length);
    add(ScopeJobFilterKeys.Statuses,     this.selectedStatuses().length);
    add(ScopeJobFilterKeys.Frequencies,  this.selectedFrequencies().length);
    add(ScopeJobFilterKeys.Companies,    this.selectedCompanies().length);
    add(ScopeJobFilterKeys.Divisions,    this.selectedDivisions().length);
    add(ScopeJobFilterKeys.SubDivisions, this.selectedSubDivisions().length);
    add(ScopeJobFilterKeys.Auditors,     this.selectedAuditors().length);
    if (this.periodRange()?.[0] || this.periodRange()?.[1])
      chips.push({ key: ScopeJobFilterKeys.Period, label: SCOPE_JOB_FILTER_CHIP_LABELS[ScopeJobFilterKeys.Period] });
    return chips;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedScopes().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedFrequencies().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedAuditors().length ||
    !!(this.periodRange()?.[0] || this.periodRange()?.[1]),
  );

  removeFilter(key: ScopeJobFilterKey): void {
    switch (key) {
      case ScopeJobFilterKeys.Scopes:       this.selectedScopes.set([]);       break;
      case ScopeJobFilterKeys.Statuses:     this.selectedStatuses.set([]);     break;
      case ScopeJobFilterKeys.Frequencies:  this.selectedFrequencies.set([]);  break;
      case ScopeJobFilterKeys.Companies:    this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case ScopeJobFilterKeys.Divisions:    this.selectedDivisions.set([]);     this.selectedSubDivisions.set([]); break;
      case ScopeJobFilterKeys.SubDivisions: this.selectedSubDivisions.set([]);  break;
      case ScopeJobFilterKeys.Auditors:     this.selectedAuditors.set([]);     break;
      case ScopeJobFilterKeys.Period:       this.periodRange.set(null);        break;
    }
    this.currentPage.set(1);
  }

  /* ── Derived: filtered + sorted list ── */
  readonly filtered = computed(() => {
    let list = this.jobs();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(j =>
      j.id.toLowerCase().includes(q) ||
      j.title.toLowerCase().includes(q) ||
      j.scopeName.toLowerCase().includes(q) ||
      j.scopeId.toLowerCase().includes(q) ||
      j.periodLabel.toLowerCase().includes(q),
    );

    const scopes = this.selectedScopes();
    if (scopes.length) list = list.filter(j => scopes.includes(j.scopeId));

    const statuses = this.selectedStatuses();
    if (statuses.length) list = list.filter(j => statuses.includes(j.status));

    const freqs = this.selectedFrequencies();
    if (freqs.length) list = list.filter(j => freqs.includes(j.auditFrequency));

    const companies = this.selectedCompanies();
    if (companies.length) list = list.filter(j => companies.includes(j.company));

    const divisions = this.selectedDivisions();
    if (divisions.length) list = list.filter(j => divisions.includes(j.division));

    const subDivisions = this.selectedSubDivisions();
    // Ignored while the Sub-Division field is hidden, so it can't stay applied.
    if (subDivisions.length && this.subDivisionFilterVisible()) list = list.filter(j => j.subDivision ? subDivisions.includes(j.subDivision) : []);

    const auditors = this.selectedAuditors();
    if (auditors.length) list = list.filter(j => j.assignedAuditors.some(a => auditors.includes(a)));

    const range = this.periodRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to   = range[1]?.getTime();
      list = list.filter(j => {
        const t = j.periodStart.getTime();
        if (from !== undefined && t < from) return false;
        if (to   !== undefined && t > to)   return false;
        return true;
      });
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === ScopeJobSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortValue(a, col);
        const bv = this.sortValue(b, col);
        if (av < bv) return -1 * dir;
        if (av > bv) return  1 * dir;
        return 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * size, page * size);
  });

  /* ── Summary stats ── */
  readonly stats = computed(() => {
    const all = this.jobs();
    return {
      total:      all.length,
      pending:    all.filter(j => j.status === ScopeJobStatuses.Pending).length,
      inProgress: all.filter(j => j.status === ScopeJobStatuses.InProgress).length,
      completed:  all.filter(j => j.status === ScopeJobStatuses.Completed).length,
      overdue:    all.filter(j => j.status === ScopeJobStatuses.Overdue).length,
    };
  });

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  ngOnInit(): void {
    /* load from service here */

    /* Pre-select a status filter passed via query param
       (e.g. from the Audit Plan "Scope Job Summary" cards). */
    const status = this.route.snapshot.queryParamMap.get('status');
    if (status && this.statusOptions.some(o => o.value === status)) {
      this.selectedStatuses.set([status as JobStatus]);
    }
  }

  /* ── Filter event handlers ── */
  onSearchChange(q: string)                    { this.searchQuery.set(q);                  this.currentPage.set(1); }
  onScopesChange(v: string[])                  { this.selectedScopes.set(v ?? []);         this.currentPage.set(1); }
  onStatusesChange(v: JobStatus[])             { this.selectedStatuses.set(v ?? []);       this.currentPage.set(1); }
  onFrequenciesChange(v: AuditFrequency[])     { this.selectedFrequencies.set(v ?? []);    this.currentPage.set(1); }
  onCompaniesChange(v: string[])               { this.selectedCompanies.set(v ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onDivisionsChange(v: string[])                { this.selectedDivisions.set(v ?? []);       this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onSubDivisionsChange(v: string[])             { this.selectedSubDivisions.set(v ?? []);    this.currentPage.set(1); }
  onAuditorsChange(v: string[])                { this.selectedAuditors.set(v ?? []);       this.currentPage.set(1); }
  onPeriodRangeChange(r: (Date | null)[] | null) { this.periodRange.set(r);                this.currentPage.set(1); }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedScopes.set([]);
    this.selectedStatuses.set([]);
    this.selectedFrequencies.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedAuditors.set([]);
    this.periodRange.set(null);
    this.currentPage.set(1);
  }

  /* ── Sort ── */
  onSort(col: SortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d => d === ScopeJobSortDirections.Asc ? ScopeJobSortDirections.Desc : ScopeJobSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set(ScopeJobSortDirections.Asc);
    }
    this.currentPage.set(1);
  }

  setViewMode(m: ScopeJobViewMode): void { this.viewMode.set(m); }

  /* ── Label helpers ── */
  statusLabel(s: JobStatus): string {
    return SCOPE_JOB_STATUS_LABELS[s];
  }

  statusSeverity(s: JobStatus): ScopeJobTagSeverity {
    return SCOPE_JOB_STATUS_SEVERITY[s];
  }

  frequencyLabel(f: AuditFrequency): string {
    return SCOPE_JOB_FREQUENCY_LABELS[f];
  }

  /* ── TrackBy ── */
  trackById(_: number, j: ScopeJob): string { return j.id; }

  /* ── Sort helpers ── */
  sortValue(j: ScopeJob, col: SortColumn): string | number {
    switch (col) {
      case ScopeJobSortColumns.Id:          return j.id;
      case ScopeJobSortColumns.Title:       return j.title.toLowerCase();
      case ScopeJobSortColumns.ScopeName:   return j.scopeName.toLowerCase();
      case ScopeJobSortColumns.PeriodStart: return j.periodStart.getTime();
      case ScopeJobSortColumns.PeriodEnd:   return j.periodEnd.getTime();
      case ScopeJobSortColumns.Status:      return j.status;
      case ScopeJobSortColumns.Company:     return j.company.toLowerCase();
      case ScopeJobSortColumns.SubDivision: return j?.subDivision ? j?.subDivision?.toLowerCase() : '';
      case ScopeJobSortColumns.CreatedDate: return j.createdDate.getTime();
      default:                              return '';
    }
  }

  sortIconFor(col: SortColumn): Record<string, boolean> {
    const active = this.sortColumn() === col;
    const asc    = this.sortDirection() === ScopeJobSortDirections.Asc;
    return {
      [SCOPE_JOB_SORT_ICONS.Unsorted]: !active,
      [SCOPE_JOB_SORT_ICONS.asc]:      active && asc,
      [SCOPE_JOB_SORT_ICONS.desc]:     active && !asc,
    };
  }

  /* ── Drawers ── */
  openProfile(job: ScopeJob): void {
    this.drawer.open<ScopeJobProfileComponent, ScopeJobProfileDrawerData>(
      ScopeJobProfileComponent,
      { ...SCOPE_JOB_DRAWER.Profile, data: { job } },
    );
  }

  editJob(job: ScopeJob): void {
    this.drawer.open<EditScopeJobComponent, EditScopeJobDrawerData>(
      EditScopeJobComponent, {
        ...SCOPE_JOB_DRAWER.Edit,
        data: { job },
      },
    );
  }

  openStatusUpdate(job: ScopeJob): void {
    this.drawer.open<StatusUpdateDrawerComponent, StatusUpdateDrawerData>(
      StatusUpdateDrawerComponent,
      {
        ...SCOPE_JOB_DRAWER.JobStatusUpdate,
        data: { target: ScopeJobStatusUpdateTargets.Job, job },
      },
    );
  }

  /* ── Confirmation dialog (activate / deactivate) ── */
  openConfirmation(job: ScopeJob): void {
    this.pendingJob.set(job);
    this.confirmationAction.set(job.isActive ? ScopeJobBlockActions.Deactivate : ScopeJobBlockActions.Activate);
    this.displayConfirmation.set(true);
  }

  onConfirmAction(): void {
    const job = this.pendingJob();
    if (job) {
      this.jobs.update(list =>
        list.map(j => j.id === job.id ? { ...j, isActive: !j.isActive } : j),
      );
    }
    this.displayConfirmation.set(false);
    this.pendingJob.set(null);
  }

  onCancelAction(): void {
    this.displayConfirmation.set(false);
    this.pendingJob.set(null);
  }

  /** <app-pagination-bar> emits a zero-based page index. */
  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  /** Called when the "items per page" dropdown changes. Resets to page 1
   *  so the visible slice stays consistent with the new page size. */
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}
