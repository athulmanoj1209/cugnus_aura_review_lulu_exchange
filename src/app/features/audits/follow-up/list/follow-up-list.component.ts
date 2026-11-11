import {
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG modules (v18+)
import { ButtonModule } from 'primeng/button';

import {
  AuditFinding,
  AuditFindingService,
  AuditFollowupPlan,
  FindingSeverity,
  FindingStatus,
  PlanStatus,
} from '../../audit-execution/findings/services/audit-finding.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { Popover, PopoverModule } from 'primeng/popover';
import { FindingsComponent } from '@/app/features/audits/audit-execution/findings/manage/findings.component';
import { AddCompanyModalComponent } from '../../organization/company/manage/company.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AddFollowupComponent, AddFollowupDrawerData } from '../manage/follow-up.component';
import { FollowupDetailComponent, FollowupDetailDrawerData } from '../profile/follow-up-profile.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CLIENT_MODE } from '../../../../core/config/client-mode';
import { ORG_STATIC_DATA } from '../../organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '../../Org-data-internal-audit';


type TabKey = 'overview' | 'findings';
type SortColumn =
  | 'id' | 'title' | 'department' | 'severity' | 'status' | 'dueDate' | 'owner';
type PlanSortColumn =
  | 'id' | 'title' | 'department' | 'severity' | 'status' | 'startDate' | 'endDate';
type SortDir = 'asc' | 'desc';

/** Temporary local extensions until company/branch are added to the service interfaces. */
type FindingWithOrg    = AuditFinding      & { company?: string; division?: string };
type PlanWithOrg       = AuditFollowupPlan & { company?: string; branch?: string };

@Component({
  selector: 'app-follow-up-audit-management',
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
    PaginatorModule,
    TooltipModule,
    PopoverModule,
  
    DrawIconComponent,],
  templateUrl: './follow-up-list.component.html',
  styleUrls: ['./follow-up-list.component.scss'],
})
export class FollowupListComponent implements OnInit {

  @ViewChild('overviewPanel')  overviewPanel!: Popover;
  @ViewChild('findingsPanel')  findingsPanel!: Popover;

  private readonly service    = inject(AuditFindingService);
  private readonly router     = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly drawer     = inject(RightDrawerService);
  private readonly clientMode = inject(CLIENT_MODE);
  private readonly location   = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /**
   * Active org directory, used only to read each division's `hasSubDivision`
   * flag — ORG_STATIC_DATA_INTERNAL_AUDIT in 'internal-audit' mode, otherwise
   * the multi-company ORG_STATIC_DATA roster (same pattern as Findings list).
   */
  private readonly orgData =
    this.clientMode === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

  /** Org divisions named `division`, optionally restricted to the given companies. */
  private orgDivisionsNamed(division: string, companyFilter: string[]) {
    return this.orgData
      .filter(c => !companyFilter.length || companyFilter.includes(c.companyName))
      .flatMap(c => c.divisions)
      .filter(d => d.divisionName === division);
  }

  /** True when `division` is known and flagged `hasSubDivision: false` (unknown = has sub-divisions). */
  private isDivisionWithoutSubDivisions(division: string | undefined, companyFilter: string[]): boolean {
    if (!division) return false;
    const matches = this.orgDivisionsNamed(division, companyFilter);
    return !!matches.length && matches.every(d => d.hasSubDivision === false);
  }

  /** False only when at least one division is selected and every one lacks sub-divisions. */
  private selectionHasSubDivisions(companyFilter: string[], divisionFilter: string[]): boolean {
    return !divisionFilter.length ||
      divisionFilter.some(name => !this.isDivisionWithoutSubDivisions(name, companyFilter));
  }

  /* ---------------- UI state ---------------- */

  readonly tab       = signal<TabKey>('overview');
  readonly findings  = signal<AuditFinding[]>([]);
  readonly plans     = signal<AuditFollowupPlan[]>([]);
  readonly loading   = signal(true);
  readonly loadingId = signal<string | null>(null);

  /* ============================================================
   *  FINDINGS TAB — filter / sort / pagination state
   * ============================================================ */

  readonly searchQuery         = signal('');
  readonly selectedSeverities  = signal<FindingSeverity[]>([]);
  readonly selectedStatuses    = signal<FindingStatus[]>([]);
  readonly selectedDepartments = signal<string[]>([]);
  readonly selectedCompanies   = signal<string[]>([]);
  readonly selectedBranches    = signal<string[]>([]);
  readonly dateRange           = signal<(Date | null)[] | null>(null);

  readonly sortColumn    = signal<SortColumn | null>('dueDate');
  readonly sortDirection = signal<SortDir>('asc');

  readonly pageSize    = 10;
  readonly currentPage = signal(1);

  /* Filter option lists */
  readonly severityFilterOptions: { label: string; value: FindingSeverity }[] = [
    { label: 'Critical', value: 'critical' },
    { label: 'High',     value: 'high'     },
    { label: 'Medium',   value: 'medium'   },
    { label: 'Low',      value: 'low'      },
  ];

  readonly statusFilterOptions: { label: string; value: FindingStatus }[] = [
    { label: 'Open',        value: 'open'        },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Responded',   value: 'responded'   },
    { label: 'Verified',    value: 'verified'    },
    { label: 'Closed',      value: 'closed'      },
    { label: 'Overdue',     value: 'overdue'     },
    { label: 'Escalated',   value: 'escalated'   },
    { label: 'Rejected',    value: 'rejected'    },
  ];

  readonly departmentFilterOptions = computed(() => {
    // Skip rows under divisions flagged `hasSubDivision: false`.
    const list = (this.findings() as FindingWithOrg[])
      .filter(f => !this.isDivisionWithoutSubDivisions(f.division, f.company ? [f.company] : []));
    const set = new Set(list.map(f => f.subDivision));
    return Array.from(set).sort().map(d => ({ label: d, value: d }));
  });

  /** Sub-Division filter is hidden when every selected division has no sub-divisions. */
  readonly subDivisionFilterVisible = computed(() =>
    this.selectionHasSubDivisions(this.selectedCompanies(), this.selectedBranches()),
  );

  readonly companyFilterOptions = computed(() => {
    const set = new Set((this.findings() as FindingWithOrg[]).map(f => f.company).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  readonly branchFilterOptions = computed(() => {
    const companies = this.selectedCompanies();
    const list = (this.findings() as FindingWithOrg[]);
    const filtered = companies.length ? list.filter(f => f.company && companies.includes(f.company!)) : list;
    const set = new Set(filtered.map(f => f.division).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /* Derived: filtered + sorted */
  readonly filteredFindings = computed(() => {
    let list = this.findings();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(f =>
      f.id.toLowerCase().includes(q) || f.title.toLowerCase().includes(q),
    );

    const sevs = this.selectedSeverities();
    if (sevs.length) list = list.filter(f => sevs.includes(f.severity));

    const stats = this.selectedStatuses();
    if (stats.length) list = list.filter(f => stats.includes(f.status));

    const depts = this.selectedDepartments();
    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    if (depts.length && this.subDivisionFilterVisible()) list = list.filter(f => depts.includes(f.subDivision));

    const companies = this.selectedCompanies();
    if (companies.length) list = list.filter(f => (f as FindingWithOrg).company && companies.includes((f as FindingWithOrg).company!));

    const branches = this.selectedBranches();
    if (branches.length) list = list.filter(f => (f as FindingWithOrg).division && branches.includes((f as FindingWithOrg).division!));

    const range = this.dateRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to   = range[1]?.getTime();
      list = list.filter(f => {
        const due = f.dueDate.getTime();
        if (from !== undefined && due < from) return false;
        if (to   !== undefined && due > to)   return false;
        return true;
      });
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
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

  readonly paginatedFindings = computed(() => {
    const all = this.filteredFindings();
    const maxPage = Math.max(1, Math.ceil(all.length / this.pageSize));
    const page = Math.min(this.currentPage(), maxPage);
    const start = (page - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  readonly pageRangeLabel = computed(() => {
    const total = this.filteredFindings().length;
    if (total === 0) return 'Showing 0 of 0 entries';
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end   = Math.min(start + this.pageSize - 1, total);
    return `Showing ${start} to ${end} of ${total} entries`;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedSeverities().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedDepartments().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedBranches().length ||
    !!(this.dateRange()?.[0] || this.dateRange()?.[1]),
  );

  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedSeverities().length)  n++;
    if (this.selectedStatuses().length)    n++;
    if (this.selectedDepartments().length) n++;
    if (this.selectedCompanies().length)   n++;
    if (this.selectedBranches().length)    n++;
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) n++;
    return n;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: string; label: string }[] = [];
    if (this.selectedSeverities().length)  chips.push({ key: 'severities',  label: `Severity: ${this.selectedSeverities().length}`  });
    if (this.selectedStatuses().length)    chips.push({ key: 'statuses',    label: `Status: ${this.selectedStatuses().length}`      });
    if (this.selectedDepartments().length) chips.push({ key: 'departments', label: `Sub-Division: ${this.selectedDepartments().length}`     });
    if (this.selectedCompanies().length)   chips.push({ key: 'companies',   label: `Company: ${this.selectedCompanies().length}`    });
    if (this.selectedBranches().length)    chips.push({ key: 'branches',    label: `Division: ${this.selectedBranches().length}`      });
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) chips.push({ key: 'date', label: 'Date range' });
    return chips;
  });

  removeFilter(key: string): void {
    switch (key) {
      case 'severities':  this.selectedSeverities.set([]);  break;
      case 'statuses':    this.selectedStatuses.set([]);    break;
      case 'departments': this.selectedDepartments.set([]); break;
      case 'companies':   this.selectedCompanies.set([]);   this.selectedBranches.set([]); this.selectedDepartments.set([]); break;
      case 'branches':    this.selectedBranches.set([]);    this.selectedDepartments.set([]); break;
      case 'date':        this.dateRange.set(null);         break;
    }
    this.currentPage.set(1);
  }

  readonly counts = computed(() => {
    const list = this.filteredFindings();
    return {
      critical: list.filter(f => f.severity === 'critical').length,
      high:     list.filter(f => f.severity === 'high').length,
      medium:   list.filter(f => f.severity === 'medium').length,
      low:      list.filter(f => f.severity === 'low').length,
    };
  });

  readonly sideStats = computed(() => {
    const list   = this.filteredFindings();
    const closed = list.filter(f => f.status === 'closed').length;
    const aged30 = list.filter(f => (f.daysOverdue ?? 0) > 0 && (f.daysOverdue ?? 0) < 30).length;
    const impact = list.reduce((sum, f) => sum + (f.financialImpact ?? 0), 0);
    return {
      openCount:      list.filter(f => f.status === 'open' || f.status === 'in-progress').length,
      overdueCount:   list.filter(f => f.status === 'overdue' || f.status === 'escalated').length,
      closureRate:    list.length ? Math.round((closed / list.length) * 100) : 0,
      closedCount:    closed,
      totalCount:     list.length,
      repeatedImpact: impact,
      criticalHigh:   list.filter(f => f.severity === 'critical' || f.severity === 'high').length,
      autoEscalated:  list.filter(f => f.flaggedForEscalation).length,
      aged30,
    };
  });

  /* ============================================================
   *  OVERVIEW TAB — filter / sort / pagination state
   * ============================================================ */

  readonly planSearchQuery         = signal('');
  readonly planSelectedSeverities  = signal<FindingSeverity[]>([]);
  readonly planSelectedStatuses    = signal<PlanStatus[]>([]);
  readonly planSelectedDepartments = signal<string[]>([]);
  readonly planSelectedCompanies   = signal<string[]>([]);
  readonly planSelectedBranches    = signal<string[]>([]);
  readonly planDateRange           = signal<(Date | null)[] | null>(null);

  readonly planSortColumn    = signal<PlanSortColumn | null>('startDate');
  readonly planSortDirection = signal<SortDir>('desc');

  readonly planPageSize    = 10;
  readonly planCurrentPage = signal(1);

  readonly planViewMode = signal<'list' | 'grid'>('grid');

  readonly planStatusFilterOptions: { label: string; value: PlanStatus }[] = [
    { label: 'Draft',       value: 'draft'       },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed',   value: 'completed'   },
    { label: 'On Hold',     value: 'on-hold'     },
    { label: 'Cancelled',   value: 'cancelled'   },
  ];

  readonly planDepartmentFilterOptions = computed(() => {
    // Skip plans under divisions flagged `hasSubDivision: false`.
    const list = (this.plans() as PlanWithOrg[])
      .filter(p => !this.isDivisionWithoutSubDivisions(p.branch, p.company ? [p.company] : []));
    const set = new Set(list.map(p => p.department));
    return Array.from(set).sort().map(d => ({ label: d, value: d }));
  });

  /** Plans Sub-Division filter is hidden when every selected division has no sub-divisions. */
  readonly planSubDivisionFilterVisible = computed(() =>
    this.selectionHasSubDivisions(this.planSelectedCompanies(), this.planSelectedBranches()),
  );

  readonly planCompanyFilterOptions = computed(() => {
    const set = new Set((this.plans() as PlanWithOrg[]).map(p => p.company).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  readonly planBranchFilterOptions = computed(() => {
    const companies = this.planSelectedCompanies();
    const list = (this.plans() as PlanWithOrg[]);
    const filtered = companies.length ? list.filter(p => p.company && companies.includes(p.company!)) : list;
    const set = new Set(filtered.map(p => p.branch).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  readonly filteredPlans = computed(() => {
    let list = this.plans();

    const q = this.planSearchQuery().trim().toLowerCase();
    if (q) list = list.filter(p =>
      p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q),
    );

    const sevs = this.planSelectedSeverities();
    if (sevs.length) list = list.filter(p => sevs.includes(p.severity));

    const stats = this.planSelectedStatuses();
    if (stats.length) list = list.filter(p => stats.includes(p.status));

    const depts = this.planSelectedDepartments();
    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    if (depts.length && this.planSubDivisionFilterVisible()) list = list.filter(p => depts.includes(p.department));

    const companies = this.planSelectedCompanies();
    if (companies.length) list = list.filter(p => (p as PlanWithOrg).company && companies.includes((p as PlanWithOrg).company!));

    const branches = this.planSelectedBranches();
    if (branches.length) list = list.filter(p => (p as PlanWithOrg).branch && branches.includes((p as PlanWithOrg).branch!));

    const range = this.planDateRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to   = range[1]?.getTime();
      list = list.filter(p => {
        const start = p.startDate.getTime();
        if (from !== undefined && start < from) return false;
        if (to   !== undefined && start > to)   return false;
        return true;
      });
    }

    const col = this.planSortColumn();
    if (col) {
      const dir = this.planSortDirection() === 'asc' ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.planSortValue(a, col);
        const bv = this.planSortValue(b, col);
        if (av < bv) return -1 * dir;
        if (av > bv) return  1 * dir;
        return 0;
      });
    }

    return list;
  });

  readonly paginatedPlans = computed(() => {
    const all = this.filteredPlans();
    const maxPage = Math.max(1, Math.ceil(all.length / this.planPageSize));
    const page = Math.min(this.planCurrentPage(), maxPage);
    const start = (page - 1) * this.planPageSize;
    return all.slice(start, start + this.planPageSize);
  });

  readonly planPageRangeLabel = computed(() => {
    const total = this.filteredPlans().length;
    if (total === 0) return 'Showing 0 of 0 plans';
    const start = (this.planCurrentPage() - 1) * this.planPageSize + 1;
    const end   = Math.min(start + this.planPageSize - 1, total);
    return `Showing ${start} to ${end} of ${total} plans`;
  });

  readonly hasActivePlanFilters = computed(() =>
    !!this.planSearchQuery().trim() ||
    !!this.planSelectedSeverities().length ||
    !!this.planSelectedStatuses().length ||
    !!this.planSelectedDepartments().length ||
    !!this.planSelectedCompanies().length ||
    !!this.planSelectedBranches().length ||
    !!(this.planDateRange()?.[0] || this.planDateRange()?.[1]),
  );

  readonly planActiveFilterCount = computed(() => {
    let n = 0;
    if (this.planSelectedSeverities().length)  n++;
    if (this.planSelectedStatuses().length)    n++;
    if (this.planSelectedDepartments().length) n++;
    if (this.planSelectedCompanies().length)   n++;
    if (this.planSelectedBranches().length)    n++;
    if (this.planDateRange()?.[0] || this.planDateRange()?.[1]) n++;
    return n;
  });

  readonly planActiveFilterChips = computed(() => {
    const chips: { key: string; label: string }[] = [];
    if (this.planSelectedSeverities().length)  chips.push({ key: 'severities',  label: `Severity: ${this.planSelectedSeverities().length}`  });
    if (this.planSelectedStatuses().length)    chips.push({ key: 'statuses',    label: `Status: ${this.planSelectedStatuses().length}`      });
    if (this.planSelectedDepartments().length) chips.push({ key: 'departments', label: `Sub-Division: ${this.planSelectedDepartments().length}`     });
    if (this.planSelectedCompanies().length)   chips.push({ key: 'companies',   label: `Company: ${this.planSelectedCompanies().length}`    });
    if (this.planSelectedBranches().length)    chips.push({ key: 'branches',    label: `Division: ${this.planSelectedBranches().length}`      });
    if (this.planDateRange()?.[0] || this.planDateRange()?.[1]) chips.push({ key: 'date', label: 'Date range' });
    return chips;
  });

  removePlanFilter(key: string): void {
    switch (key) {
      case 'severities':  this.planSelectedSeverities.set([]);  break;
      case 'statuses':    this.planSelectedStatuses.set([]);    break;
      case 'departments': this.planSelectedDepartments.set([]); break;
      case 'companies':   this.planSelectedCompanies.set([]);   this.planSelectedBranches.set([]); this.planSelectedDepartments.set([]); break;
      case 'branches':    this.planSelectedBranches.set([]);    this.planSelectedDepartments.set([]); break;
      case 'date':        this.planDateRange.set(null);         break;
    }
    this.planCurrentPage.set(1);
  }

  /* ---------------- Lifecycle ---------------- */

  ngOnInit(): void {
    this.service.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => {
        this.findings.set(list);
        this.loading.set(false);
      });

    this.service.getAllPlans()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(list => this.plans.set(list));
  }

  /* ---------------- Tabs ---------------- */

  setTab(t: TabKey): void { this.tab.set(t); }

  /* ---------------- Findings filter handlers ---------------- */

  onSearchChange(q: string): void          { this.searchQuery.set(q);              this.currentPage.set(1); }
  onSeveritiesChange(v: FindingSeverity[]): void { this.selectedSeverities.set(v ?? []);  this.currentPage.set(1); }
  onStatusesChange(v: FindingStatus[]): void     { this.selectedStatuses.set(v ?? []);    this.currentPage.set(1); }
  onDepartmentsChange(v: string[]): void         { this.selectedDepartments.set(v ?? []); this.currentPage.set(1); }
  onDateRangeChange(r: (Date | null)[] | null): void { this.dateRange.set(r); this.currentPage.set(1); }

  onCompaniesChange(v: string[]): void {
    this.selectedCompanies.set(v ?? []);
    this.selectedBranches.set([]);
    this.selectedDepartments.set([]);
    this.currentPage.set(1);
  }

  onBranchesChange(v: string[]): void {
    this.selectedBranches.set(v ?? []);
    this.selectedDepartments.set([]);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedSeverities.set([]);
    this.selectedStatuses.set([]);
    this.selectedDepartments.set([]);
    this.selectedCompanies.set([]);
    this.selectedBranches.set([]);
    this.dateRange.set(null);
    this.currentPage.set(1);
  }

  /* ---------------- Plans filter handlers ---------------- */

  onPlanSearchChange(q: string): void             { this.planSearchQuery.set(q);              this.planCurrentPage.set(1); }
  onPlanSeveritiesChange(v: FindingSeverity[]): void   { this.planSelectedSeverities.set(v ?? []);  this.planCurrentPage.set(1); }
  onPlanStatusesChange(v: PlanStatus[]): void          { this.planSelectedStatuses.set(v ?? []);    this.planCurrentPage.set(1); }
  onPlanDepartmentsChange(v: string[]): void           { this.planSelectedDepartments.set(v ?? []); this.planCurrentPage.set(1); }
  onPlanDateRangeChange(r: (Date | null)[] | null): void { this.planDateRange.set(r); this.planCurrentPage.set(1); }

  onPlanCompaniesChange(v: string[]): void {
    this.planSelectedCompanies.set(v ?? []);
    this.planSelectedBranches.set([]);
    this.planSelectedDepartments.set([]);
    this.planCurrentPage.set(1);
  }

  onPlanBranchesChange(v: string[]): void {
    this.planSelectedBranches.set(v ?? []);
    this.planSelectedDepartments.set([]);
    this.planCurrentPage.set(1);
  }

  clearPlanFilters(): void {
    this.planSearchQuery.set('');
    this.planSelectedSeverities.set([]);
    this.planSelectedStatuses.set([]);
    this.planSelectedDepartments.set([]);
    this.planSelectedCompanies.set([]);
    this.planSelectedBranches.set([]);
    this.planDateRange.set(null);
    this.planCurrentPage.set(1);
  }

  /* ---------------- Sort handlers ---------------- */

  onSort(col: SortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set('asc');
    }
  }

  sortIconFor(col: SortColumn): string {
    if (this.sortColumn() !== col) return '';
    return this.sortDirection() === 'asc' ? 'pi-arrow-up' : 'pi-arrow-down';
  }

  private sortValue(f: AuditFinding, col: SortColumn): string | number {
    switch (col) {
      case 'id':         return parseInt(f.id.replace(/\D/g, ''), 10) || 0;
      case 'title':      return f.title.toLowerCase();
      case 'department': return f.subDivision.toLowerCase();
      case 'severity':   return ({ low: 1, medium: 2, high: 3, critical: 4 } as const)[f.severity];
      case 'status':     return f.status;
      case 'dueDate':    return f.dueDate.getTime();
      case 'owner':      return f.owner.fullName.toLowerCase();
    }
  }

  onPlanSort(col: PlanSortColumn): void {
    if (this.planSortColumn() === col) {
      this.planSortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.planSortColumn.set(col);
      this.planSortDirection.set('asc');
    }
  }

  planSortIconFor(col: PlanSortColumn): string {
    if (this.planSortColumn() !== col) return '';
    return this.planSortDirection() === 'asc' ? 'pi-arrow-up' : 'pi-arrow-down';
  }

  private planSortValue(p: AuditFollowupPlan, col: PlanSortColumn): string | number {
    switch (col) {
      case 'id':         return parseInt(p.id.replace(/\D/g, ''), 10) || 0;
      case 'title':      return p.title.toLowerCase();
      case 'department': return p.department.toLowerCase();
      case 'severity':   return ({ low: 1, medium: 2, high: 3, critical: 4 } as const)[p.severity];
      case 'status':     return p.status;
      case 'startDate':  return p.startDate.getTime();
      case 'endDate':    return p.endDate.getTime();
    }
  }

  /* ---------------- Pagination handlers ---------------- */

  onPageChange(event: PaginatorState): void {
    if (event.page !== undefined) this.currentPage.set(event.page + 1);
  }

  onPlanPageChange(event: PaginatorState): void {
    if (event.page !== undefined) this.planCurrentPage.set(event.page + 1);
  }

  setPlanViewMode(mode: 'list' | 'grid'): void { this.planViewMode.set(mode); }

  /* ---------------- Actions ---------------- */

  exportPdf(): void   { console.info('[stub] export pdf'); }
  exportExcel(): void { console.info('[stub] export excel'); }

  viewFinding(f: AuditFinding): void {
    this.loadingId.set(f.id);
    this.router.navigate(['/audits/follow-up/details', f.id])
      .catch(() => this.loadingId.set(null));
  }

  viewPreviousOccurrence(f: AuditFinding): void {
    if (!f.previousOccurrenceId) return;
    this.router.navigate(['/audits/follow-up/details', f.previousOccurrenceId]);
  }

  async openAddFollowup(): Promise<void> {
    const ref = this.drawer.open<AddFollowupComponent, AddFollowupDrawerData>(
      AddFollowupComponent,
      { width: '720px', data: { mode: 'create' } },
    );
    const result = await ref.afterClosed;
    if (result) console.info('[stub] followup created', result.form);
  }

  async editPlan(p: AuditFollowupPlan): Promise<void> {
    const ref = this.drawer.open<AddFollowupComponent, AddFollowupDrawerData>(
      AddFollowupComponent,
      {
        width: '720px',
        data: {
          mode: 'edit',
          existing: {
            id:        p.id,
            title:     p.title,
            severity:  p.severity,
            startDate: p.startDate,
            endDate:   p.endDate,
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (result) console.info('[stub] followup updated', p.id, result.form);
  }

  viewPlan(p: AuditFollowupPlan): void {
    this.drawer.open<FollowupDetailComponent, FollowupDetailDrawerData>(
      FollowupDetailComponent,
      { width: '520px', data: { plan: p } },
    );
  }

  async openAddFinding(): Promise<void> {
    const ref = this.drawer.open<FindingsComponent>(FindingsComponent, { width: '720px' });
    await ref.afterClosed;
  }

  /* ---------------- Display helpers ---------------- */

  severityLabel(s: FindingSeverity): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  statusLabel(s: FindingStatus): string {
    return s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1);
  }

  planStatusLabel(s: PlanStatus): string {
    switch (s) {
      case 'in-progress': return 'In Progress';
      case 'on-hold':     return 'On Hold';
      default:            return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  initials(name: string): string {
    return name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  trackById = (_: number, f: AuditFinding) => f.id;
}