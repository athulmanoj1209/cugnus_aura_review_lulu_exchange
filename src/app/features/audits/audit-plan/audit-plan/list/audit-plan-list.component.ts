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
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { ActivatedRoute, Router } from '@angular/router';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AuditPlanViewComponent } from '../com/audit-plan-view/audit-plan-view.component';
import { AuditPlanFormComponent } from '../manage/audit-plan.component/audit-plan.component';
import { AuditPlanHeader } from '../models/audit-plan.model';
import { AuditPlanListStore } from '../services/audit-plan-list.store';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import {
  AuditPlan,
  AuditPlanStatus,
  MOCK_PLANS,
  periodLabel as getPeriodLabel,
  planTitle as getPlanTitle,
  planYear as getPlanYear,
  planHasAuditor,
} from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';

// ── CLIENT_MODE-aware Organization/Division/Sub-Division option sources ────────
// Same switch every *-data.service.ts already makes off CLIENT_MODE_VALUE
// (see client-mode.ts): audit-firm builds keep reading the existing
// multi-company ORG_STATIC_DATA roster for all three filters, while
// internal-audit builds (single company auditing itself) read Organization
// names from the company seed, Division names from the division seed, and
// Sub-Division names from the sub-division seed — each is its own file because
// each one trims/keeps a different subset of the full roster (see the header
// comments in those three files).
//
// NOTE: adjust these three import paths (and the client-mode import) if they
// don't sit next to this component the same way `company-org-data` does —
// same caveat audit-plan-data.ts already calls out for its own import.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import {
  AUDIT_PLAN_DATE_FORMAT_OPTIONS,
  AUDIT_PLAN_DATE_LOCALE,
  AUDIT_PLAN_DRAWER_WIDTH,
  AUDIT_PLAN_ID_PAD_LENGTH,
  AUDIT_PLAN_ID_PREFIX,
  AUDIT_PLAN_LIST_PAGE_SIZE,
  AUDIT_PLAN_MOCK_PROGRESS,
  AUDIT_PLAN_QUERY_PARAMS,
  AUDIT_PLAN_SUB_DIVISION_PREVIEW_COUNT,
  AuditPlanBlockActions,
  AuditPlanFilterKeys,
  AuditPlanSortColumns,
  AuditPlanSortDirections,
  AuditPlanStatuses,
  AuditPlanViewModes,
  type AuditPlanFilterKey,
  type AuditPlanSortColumn,
  type AuditPlanSortDirection,
  type AuditPlanViewMode,
} from '../constants/audit-plan.constants';
import {
  AUDIT_PLAN_ACTIVE_ICONS,
  AUDIT_PLAN_FILTER_CHIP_LABELS,
  AUDIT_PLAN_SORT_ICONS,
  AUDIT_PLAN_STATUS_OPTIONS,
  AUDITOR_PLAN_PHASE_LABELS,
  AUDITOR_PLAN_STATUS_LABELS,
} from '../constants/audit-plan-labels.constants';
import {
  AUDIT_PLAN_ACTIVE_LABELS,
  AUDIT_PLAN_EMPTY_VALUE,
  AUDIT_PLAN_NO_RESULTS,
  AUDIT_PLAN_SUB_DIVISION_PLACEHOLDERS,
  DIVISION_LEVEL_LABEL,
  auditPlanActiveConfirmDialog,
  auditPlanActiveToggledMessage,
  filterChipLabel,
  orgDivisionLabel,
  pageRangeLabel,
} from '../constants/audit-plan-messages.constants';

// Re-export the model types from here too: other files in the app (e.g.
// AuditPlanViewComponent, which this component opens with `data: p`) very
// likely import `AuditPlan`/`Sub-Division`/`AuditScope`/etc. from
// './audit-plan-list.component' the way this file used to define them
// locally. Keeping these re-exports means moving the model into
// `audit-plan-data.ts` doesn't break those imports.
export type {
  AuditPlan,
  AuditPlanStatus,
  RiskRating,
  InstanceStatus,
  Frequency,
  ScopeJob,
  AuditScope,
  SubDivision
} from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
export { FREQ_LABELS, MONTH_LABELS } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';

// Shared Company → Division → Sub-Division static data — the same file every
// other Company/Division/Sub-Division filter in the app now reads from. The
// Company/Division/Sub-Division filter option lists below used to be *derived*
// from whatever values happened to be present on MOCK_PLANS itself (fake
// names like "Crowe UAE" / "Crowe KSA" / "Crowe Qatar" / "Crowe Oman" with
// divisions "Dubai" / "Riyadh" / "Doha" / "Muscat" / "Sharjah" / "Jeddah" /
// "Abu Dhabi", and sub-division names like "Finance / Accounts", "AML / CFT
// Compliance", "IT", "HR", "Risk", "Procurement" — none of which exist
// anywhere in company-org-data.ts). Options now come from the real roster,
// cascading Division off selectedOrganizations() and Sub-Division off
// selectedOrganizations() + selectedDivisions(), same pattern as every other
// filter panel in the app. MOCK_PLANS' organizationName/divisionName/
// sub-division names below have also been remapped to real triples so the
// filters actually match rows.
//
// The plan model (types), MOCK_PLANS data, and the planYear/planTitle/
// periodLabel helpers now live in `audit-plan-data.ts` — shared with
// `audit-overview-tab.component.ts` so the dashboard's KPIs and charts are
// always computed from these exact same rows instead of a second,
// independently-hardcoded dataset. `planHasAuditor` (used below to scope
// the list to a single auditor, e.g. from the overview's "My Active
// Audits" KPI card) lives there too, for the same reason.
//
// The auditor-aggregation helpers just below (countActivePlansForAuditor,
// getActivePlansForAuditor, getAllPlansForAuditor) stayed here rather than
// moving to audit-plan-data.ts — auditor-overview-tab.component.ts and
// auditor-my-audits-scopes-tab.component.ts both import them from this component file,
// so they need to keep being exported from here.

/** Deterministic (id-seeded) illustrative progress percentage, since plans don't carry a real % field. */
function progressForPlan(p: AuditPlan): number {
  const seed = p.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return AUDIT_PLAN_MOCK_PROGRESS.Min + (seed % AUDIT_PLAN_MOCK_PROGRESS.Spread); // 30–89%
}

/** Count of in-progress plans assigned to the given auditor — used by the auditor overview KPI card. */
export function countActivePlansForAuditor(auditorName: string): number {
  return MOCK_PLANS.filter(p => p.status === AuditPlanStatuses.InProgress && planHasAuditor(p, auditorName)).length;
}

export function countActivePlansForTeam(auditorNames: readonly string[]): number {
  return MOCK_PLANS.filter(plan =>
    plan.status === AuditPlanStatuses.InProgress && auditorNames.some(name => planHasAuditor(plan, name)),
  ).length;
}

/**
 * The auditor's in-progress plans, as {name, progress} — same scope as
 * countActivePlansForAuditor() above. Used by the auditor overview's
 * "Audit Progress" widget, so it always lists exactly the plans counted
 * by the "My Active Audits" KPI card.
 */
export function getActivePlansForAuditor(auditorName: string): { name: string; progress: number }[] {
  return MOCK_PLANS
    .filter(p => p.status === AuditPlanStatuses.InProgress && planHasAuditor(p, auditorName))
    .map(p => ({
      name: p.subDivisions[0]?.scopes[0]?.name ?? orgDivisionLabel(p.organizationName, p.divisionName),
      progress: progressForPlan(p),
    }));
}

export function getActivePlansForTeam(auditorNames: readonly string[]): { id: string; name: string; progress: number }[] {
  const team = new Set(auditorNames);
  return MOCK_PLANS
    .filter(plan => plan.status === AuditPlanStatuses.InProgress && auditorNames.some(name => planHasAuditor(plan, name)))
    .map(plan => ({
      id: plan.id,
      name: plan.subDivisions[0]?.scopes[0]?.name ?? orgDivisionLabel(plan.organizationName, plan.divisionName),
      progress: progressForPlan(plan),
    }))
    .filter((plan, index, plans) => plans.findIndex(candidate => candidate.id === plan.id) === index);
}

function progressForPlanStatus(p: AuditPlan): number {
  if (p.status === AuditPlanStatuses.Completed) return AUDIT_PLAN_MOCK_PROGRESS.Complete;
  if (p.status === AuditPlanStatuses.Draft || p.status === AuditPlanStatuses.Planned || p.status === AuditPlanStatuses.Cancelled)
    return AUDIT_PLAN_MOCK_PROGRESS.NotStarted;
  return progressForPlan(p);
}

function formatPlanDate(d?: Date): string {
  if (!d) return AUDIT_PLAN_EMPTY_VALUE;
  return new Date(d).toLocaleDateString(AUDIT_PLAN_DATE_LOCALE, AUDIT_PLAN_DATE_FORMAT_OPTIONS);
}

export interface AuditorPlanRow {
  audit: string;
  subDivision: string;
  phase: string;
  progress: number;
  dueDate: string;
  status: string;
}

/**
 * Every plan (any status) assigned to the given auditor — used by the
 * auditor dashboard's "My Assigned Audits" table.
 */
export function getAllPlansForAuditor(auditorName: string): AuditorPlanRow[] {
  return MOCK_PLANS
    .filter(p => planHasAuditor(p, auditorName))
    .map(p => ({
      audit: p.subDivisions[0]?.scopes[0]?.name ?? orgDivisionLabel(p.organizationName, p.divisionName),
      subDivision: p.subDivisions[0] && !p.subDivisions[0].isDivisionLevel ? p.subDivisions[0].name : AUDIT_PLAN_EMPTY_VALUE,
      phase: AUDITOR_PLAN_PHASE_LABELS[p.status],
      progress: progressForPlanStatus(p),
      dueDate: formatPlanDate(p.endDate),
      status: AUDITOR_PLAN_STATUS_LABELS[p.status],
    }));
}

/**
 * Minimal shape the Division/Sub-Division filter-option computeds actually need,
 * independent of which per-mode seed supplies the data. `divisionSourceCompanies()`
 * and `subDivisionSourceCompanies()` below pick between two structurally-similar
 * but nominally distinct company/division/sub-division type hierarchies — the
 * multi-company `ORG_STATIC_DATA` roster (Company/OrgDivision/OrgSubDivision from
 * company-org-data.ts) vs. the single-company indi-org seeds (StaticCompany/
 * StaticDivision/StaticSubDivision). Left untyped, TS infers those methods'
 * return type as a union of the two concrete array types (e.g.
 * `StaticDivision[] | OrgDivision[]`), and calling `.filter()`/`.flatMap()` on
 * that union breaks down (TS2322/TS18046) because the two element types
 * disagree on unrelated fields like `subDivisionType`. Declaring the return
 * type as this narrower common shape sidesteps that: both concrete arrays
 * are structurally assignable to it since assigning a variable (not an
 * object literal) skips excess-property checks.
 */
interface FilterSourceSubDivision {
  subDivisionName: string;
}
interface FilterSourceDivision {
  divisionName: string;
  hasSubDivision?: boolean;
  subDivisions: FilterSourceSubDivision[];
}
interface FilterSourceCompany {
  companyName: string;
  divisions: FilterSourceDivision[];
}

/* ── Component ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-audit-plan-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    TooltipModule,
    TagModule,
    PopoverModule,DrawIconComponent
  ],
  templateUrl: './audit-plan-list.component.html',
  styleUrl: './audit-plan-list.component.scss',
})
export class AuditPlanListComponent implements OnInit {
  @ViewChild('filterPanel') filterPanel!: Popover;
  @ViewChild('subDivisionsPopover') subDivisionsPopover!: Popover;

  private readonly drawer     = inject(RightDrawerService);
  private readonly route      = inject(ActivatedRoute);
  private readonly router     = inject(Router);
  private readonly location   = inject(Location);
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly toast      = inject(ToastService);

  /* ── Data ── shared with the Audit Plan page (its plan dropdown) */
  readonly plans = inject(AuditPlanListStore).plans;

  /* ── View mode ── */
  readonly viewMode = signal<AuditPlanViewMode>(AuditPlanViewModes.Grid);

  /* ── Template constants ── */
  readonly AuditPlanViewModes      = AuditPlanViewModes;
  readonly AuditPlanSortColumns    = AuditPlanSortColumns;
  readonly activeLabels            = AUDIT_PLAN_ACTIVE_LABELS;
  readonly activeIcons             = AUDIT_PLAN_ACTIVE_ICONS;
  readonly subDivisionPlaceholders = AUDIT_PLAN_SUB_DIVISION_PLACEHOLDERS;
  readonly subDivisionPreviewCount = AUDIT_PLAN_SUB_DIVISION_PREVIEW_COUNT;
  readonly divisionLevelLabel      = DIVISION_LEVEL_LABEL;

  /* ── Filters ── */
  readonly searchQuery         = signal('');
  readonly selectedOrganizations = signal<string[]>([]);
  readonly selectedDivisions      = signal<string[]>([]);
  readonly selectedSubDivisions   = signal<string[]>([]);
  readonly selectedStatuses      = signal<AuditPlanStatus[]>([]);
  readonly selectedYears         = signal<number[]>([]);

  /** Scope to a specific auditor (from the overview "My Active Audits" card) — matches display name. */
  readonly auditorId = signal<string | null>(null);
  readonly teamAuditorNames = signal<string[]>([]);

  /* ── Sort ── */
  readonly sortColumn    = signal<AuditPlanSortColumn | null>(null);
  readonly sortDirection = signal<AuditPlanSortDirection>(AuditPlanSortDirections.Asc);

  /* ── Pagination ── */
  readonly pageSize    = AUDIT_PLAN_LIST_PAGE_SIZE;
  readonly currentPage = signal(1);

  /* ── Popovers ── */
  readonly moreSubDivisionsPlan = signal<AuditPlan | null>(null);

  /* ── Filter options ── */
  readonly statusOptions = AUDIT_PLAN_STATUS_OPTIONS;

  /**
   * Division/Sub-Division cascading source, switched by CLIENT_MODE_VALUE —
   * 'internal-audit' builds cascade off the division/sub-division indi-org seeds
   * (single company, DAR Exchange) instead of the multi-company
   * ORG_STATIC_DATA roster. Only the *name* lookups switch here; MOCK_PLANS
   * rows and everything else about the list are unaffected.
   */
  private divisionSourceCompanies(): FilterSourceCompany[] {
    return CLIENT_MODE_VALUE === 'internal-audit' ? DIVISION_INDI_ORG_COMPANIES : ORG_STATIC_DATA;
  }

  private subDivisionSourceCompanies(): FilterSourceCompany[] {
    return CLIENT_MODE_VALUE === 'internal-audit' ? SUB_DIVISION_INDI_ORG_COMPANIES : ORG_STATIC_DATA;
  }

  /** Sourced from company-org-data.ts (see import comment above) — replacing
   *  the previous "derive from whatever's on MOCK_PLANS" approach, which
   *  only ever showed companies that already had a mock row.
   *
   *  In 'internal-audit' mode, Organization names instead come from
   *  COMPANIES_SEED (company-static-indi-org.data.ts) — the single-company
   *  seed used by CompanyDataService for that client mode. */
  readonly organizationFilterOptions = computed<{ label: string; value: string }[]>(() => {
    const names = CLIENT_MODE_VALUE === 'internal-audit'
      ? COMPANIES_SEED.map(c => c.companyName)
      : ORG_STATIC_DATA.map(c => c.companyName);
    return names
      .map(label => ({ label, value: label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  readonly divisionFilterOptions = computed<{ label: string; value: string }[]>(() => {
    const orgs = this.selectedOrganizations();
    const source = this.divisionSourceCompanies();
    const companies = orgs.length
      ? source.filter(c => orgs.includes(c.companyName))
      : source;
    const names = new Set(companies.flatMap(c => c.divisions).map(b => b.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  readonly subDivisionFilterOptions = computed<{ label: string; value: string }[]>(() => {
    const orgs      = this.selectedOrganizations();
    const divisions  = this.selectedDivisions();
    const source    = this.subDivisionSourceCompanies();
    const companies = orgs.length
      ? source.filter(c => orgs.includes(c.companyName))
      : source;
    // Divisions flagged hasSubDivision:false still carry a subDivisions array
    // in the seed data, so skip them explicitly.
    const divisionList = companies.flatMap(c => c.divisions)
      .filter(b => b.hasSubDivision !== false)
      .filter(b => !divisions.length || divisions.includes(b.divisionName));
    const names = new Set(divisionList.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /** Linked Sub-Division filter is hidden only when every selected Division
   *  (looked up in the same source the Division options use) is flagged
   *  hasSubDivision:false. Unknown divisions count as having sub-divisions. */
  readonly subDivisionFilterVisible = computed<boolean>(() => {
    const divisions = this.selectedDivisions();
    if (!divisions.length) return true;
    const orgs      = this.selectedOrganizations();
    const source    = this.divisionSourceCompanies();
    const companies = orgs.length
      ? source.filter(c => orgs.includes(c.companyName))
      : source;
    const divisionList = companies.flatMap(c => c.divisions);
    return divisions.some(name => {
      const matches = divisionList.filter(b => b.divisionName === name);
      return !matches.length || matches.some(b => b.hasSubDivision !== false);
    });
  });

  readonly yearFilterOptions = computed(() => {
    const set = new Set(this.plans().map(p => this.planYear(p)));
    return Array.from(set).sort((a, b) => b - a).map(v => ({ label: String(v), value: v }));
  });

  /* ── Active filter count & chips ── */
  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedOrganizations().length) count++;
    if (this.selectedDivisions().length)      count++;
    if (this.selectedSubDivisions().length)   count++;
    if (this.selectedStatuses().length)      count++;
    if (this.selectedYears().length)         count++;
    return count;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: AuditPlanFilterKey; label: string }[] = [];
    const push = (key: AuditPlanFilterKey, count: number) =>
      chips.push({ key, label: filterChipLabel(AUDIT_PLAN_FILTER_CHIP_LABELS[key], count) });
    if (this.selectedOrganizations().length) push(AuditPlanFilterKeys.Organizations, this.selectedOrganizations().length);
    if (this.selectedDivisions().length)     push(AuditPlanFilterKeys.Divisions,     this.selectedDivisions().length);
    if (this.selectedSubDivisions().length)  push(AuditPlanFilterKeys.SubDivisions,  this.selectedSubDivisions().length);
    if (this.selectedStatuses().length)      push(AuditPlanFilterKeys.Statuses,      this.selectedStatuses().length);
    if (this.selectedYears().length)         push(AuditPlanFilterKeys.Years,         this.selectedYears().length);
    return chips;
  });

  removeFilter(key: AuditPlanFilterKey): void {
    switch (key) {
      case AuditPlanFilterKeys.Organizations: this.selectedOrganizations.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case AuditPlanFilterKeys.Divisions:     this.selectedDivisions.set([]);      this.selectedSubDivisions.set([]); break;
      case AuditPlanFilterKeys.SubDivisions:  this.selectedSubDivisions.set([]);   break;
      case AuditPlanFilterKeys.Statuses:      this.selectedStatuses.set([]);      break;
      case AuditPlanFilterKeys.Years:         this.selectedYears.set([]);         break;
    }
    this.currentPage.set(1);
  }

  /* ── Derived: filtered + sorted list ── */
  readonly filtered = computed(() => {
    let list = this.plans();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.organizationName.toLowerCase().includes(q) ||
      p.divisionName.toLowerCase().includes(q) ||
      p.subDivisions.some(d => d.name.toLowerCase().includes(q)) ||
      this.planTitle(p).toLowerCase().includes(q),
    );

    const orgs = this.selectedOrganizations();
    if (orgs.length) list = list.filter(p => orgs.includes(p.organizationName));

    const divisions = this.selectedDivisions();
    if (divisions.length) list = list.filter(p => divisions.includes(p.divisionName));

    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    const subDivisions = this.subDivisionFilterVisible() ? this.selectedSubDivisions() : [];
    // Division-level lanes carry the division's name, so they must not match a sub-division of the same name.
    if (subDivisions.length) list = list.filter(p => p.subDivisions.some(d => !d.isDivisionLevel && subDivisions.includes(d.name)));

    const statuses = this.selectedStatuses();
    if (statuses.length) list = list.filter(p => statuses.includes(p.status));

    const years = this.selectedYears();
    if (years.length) list = list.filter(p => years.includes(this.planYear(p)));

    const auditorId = this.auditorId();
    const teamAuditors = this.teamAuditorNames();
    if (auditorId) list = list.filter(p => planHasAuditor(p, auditorId));
    else if (teamAuditors.length) list = list.filter(p => teamAuditors.some(name => planHasAuditor(p, name)));

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === AuditPlanSortDirections.Asc ? 1 : -1;
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
    const max  = Math.max(1, Math.ceil(all.length / this.pageSize));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * this.pageSize, page * this.pageSize);
  });

  readonly pageRangeLabel = computed(() => {
    const total = this.filtered().length;
    if (!total) return AUDIT_PLAN_NO_RESULTS;
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end   = Math.min(start + this.pageSize - 1, total);
    return pageRangeLabel(start, end, total);
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedOrganizations().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedYears().length,
  );

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  ngOnInit(): void {
    /* load from service here */

    /* Apply status filter passed via query param (e.g. from the overview KPI cards). */
    const status = this.route.snapshot.queryParamMap.get(AUDIT_PLAN_QUERY_PARAMS.Status);
    if (status && this.statusOptions.some(o => o.value === status)) {
      this.selectedStatuses.set([status as AuditPlanStatus]);
    }

    /* Apply auditor filter passed via query param (e.g. from the overview "My Active Audits" card). */
    this.auditorId.set(this.route.snapshot.queryParamMap.get(AUDIT_PLAN_QUERY_PARAMS.AuditorId));
    this.teamAuditorNames.set((this.route.snapshot.queryParamMap.get('teamAuditorNames') ?? '').split('|').filter(Boolean));
  }

  /* ── Filter handlers ── */
  onSearchChange(q: string)          { this.searchQuery.set(q);                 this.currentPage.set(1); }
  onOrganizationsChange(v: string[]) { this.selectedOrganizations.set(v ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onDivisionsChange(v: string[])      { this.selectedDivisions.set(v ?? []);      this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onSubDivisionsChange(v: string[])   { this.selectedSubDivisions.set(v ?? []);   this.currentPage.set(1); }
  onStatusesChange(v: AuditPlanStatus[]) { this.selectedStatuses.set(v ?? []);  this.currentPage.set(1); }
  onYearsChange(v: number[])         { this.selectedYears.set(v ?? []);         this.currentPage.set(1); }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedOrganizations.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedStatuses.set([]);
    this.selectedYears.set([]);
    this.currentPage.set(1);
  }

  /* ── Sort ── */
  onSort(col: AuditPlanSortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d =>
        d === AuditPlanSortDirections.Asc ? AuditPlanSortDirections.Desc : AuditPlanSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set(AuditPlanSortDirections.Asc);
    }
  }
  sortIconFor(col: AuditPlanSortColumn): string {
    if (this.sortColumn() !== col) return AUDIT_PLAN_SORT_ICONS.Unsorted;
    return AUDIT_PLAN_SORT_ICONS[this.sortDirection()];
  }
  private sortValue(p: AuditPlan, col: AuditPlanSortColumn): string | number {
    switch (col) {
      case AuditPlanSortColumns.OrganizationName: return p.organizationName.toLowerCase();
      case AuditPlanSortColumns.DivisionName:     return p.divisionName.toLowerCase();
    }
  }

  /* ── Title / year / period helpers — delegate to the shared data module so
   *    the list and the dashboard always compute these identically. ── */
  planYear(p: AuditPlan): number {
    return getPlanYear(p);
  }

  planTitle(p: AuditPlan): string {
    return getPlanTitle(p);
  }

  periodLabel(p: AuditPlan): string {
    return getPeriodLabel(p);
  }

  /* ── Pagination ── */
  onPageChange(ev: PaginatorState): void {
    if (ev.page !== undefined) this.currentPage.set(ev.page + 1);
  }

  setViewMode(m: AuditPlanViewMode): void { this.viewMode.set(m); }

  /* ── Actions ── */
  openView(p: AuditPlan): void {
    this.drawer.open(AuditPlanViewComponent, { data: p, width: AUDIT_PLAN_DRAWER_WIDTH });
  }

  openCreate(): void {
    const ref = this.drawer.open(AuditPlanFormComponent, { data: null, width: AUDIT_PLAN_DRAWER_WIDTH });
    ref.afterClosed.then((raw: unknown) => {
      const result = raw as AuditPlanHeader | null | undefined;
      if (!result) return;

      // Newly created plan — add it to the top of the (in-memory) list.
      const newPlan: AuditPlan = {
        ...this.fromHeader(result),
        id: this.nextPlanId(),
        status: AuditPlanStatuses.Draft,
        subDivisions: [],
      };
      this.plans.update(list => [newPlan, ...list]);
      this.currentPage.set(1);
    });
  }

  openEdit(p: AuditPlan, domEvent?: MouseEvent): void {
    domEvent?.stopPropagation();
    const ref = this.drawer.open(AuditPlanFormComponent, { data: this.toHeader(p), width: AUDIT_PLAN_DRAWER_WIDTH });
    ref.afterClosed.then((raw: unknown) => {
      const result = raw as AuditPlanHeader | null | undefined;
      if (!result) return;

      // Merge edited header fields back, preserving status / sub-divisions.
      this.plans.update(list =>
        list.map(x => (x.id === p.id ? { ...x, ...this.fromHeader(result) } : x)),
      );
    });
  }

  /* ── Deactivate / activate ── */
  isPlanActive(p: AuditPlan): boolean {
    return p.isActive !== false;
  }

  async toggleActive(p: AuditPlan, domEvent?: MouseEvent): Promise<void> {
    domEvent?.stopPropagation();
    const activate = !this.isPlanActive(p);
    const ok = await this.confirmSvc.confirm({
      ...auditPlanActiveConfirmDialog(activate, this.planTitle(p)),
      action: activate ? AuditPlanBlockActions.Activate : AuditPlanBlockActions.Deactivate,
    });
    if (!ok) return;

    this.plans.update(list => list.map(x => (x.id === p.id ? { ...x, isActive: activate } : x)));
    this.toast.success(auditPlanActiveToggledMessage(activate));
  }

  /** List row → drawer form data (form works off company id / division code). */
  private toHeader(p: AuditPlan): AuditPlanHeader {
    const company  = ORG_STATIC_DATA.find(c => c.companyName === p.organizationName);
    const division = company?.divisions.find(d => d.divisionName === p.divisionName);
    return {
      id:           p.id,
      companyId:    company?.id ?? '',
      divisionCode: division?.divisionCode ?? '',
      planName:     this.planTitle(p),
      periodFrom:   p.startDate!,
      periodTo:     p.endDate!,
    };
  }

  /** Drawer result → list row header fields (names resolved back from the org roster). */
  private fromHeader(h: AuditPlanHeader): Pick<AuditPlan, 'planName' | 'organizationName' | 'divisionName' | 'startDate' | 'endDate'> {
    const company  = ORG_STATIC_DATA.find(c => c.id === h.companyId);
    const division = company?.divisions.find(d => d.divisionCode === h.divisionCode);
    return {
      planName:         h.planName,
      organizationName: company?.companyName ?? '',
      divisionName:     division?.divisionName ?? '',
      startDate:        h.periodFrom,
      endDate:          h.periodTo,
    };
  }

  private nextPlanId(): string {
    const max = this.plans().reduce((m, p) => {
      const n = p.id.startsWith(AUDIT_PLAN_ID_PREFIX) ? Number(p.id.slice(AUDIT_PLAN_ID_PREFIX.length)) : Number(p.id);
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);
    return `${AUDIT_PLAN_ID_PREFIX}${String(max + 1).padStart(AUDIT_PLAN_ID_PAD_LENGTH, '0')}`;
  }

  /* ── Popovers ── */
  showMoreSubDivisions(p: AuditPlan, event: MouseEvent): void {
    this.moreSubDivisionsPlan.set(p);
    this.subDivisionsPopover.toggle(event);
  }

  trackById = (_: number, p: AuditPlan) => p.id;
}
