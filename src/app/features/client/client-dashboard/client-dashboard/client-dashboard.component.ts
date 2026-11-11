import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { ClientOverviewTabComponent } from '../tabs/client-overview-tab/client-overview-tab.component';
import { ClientRfisTabComponent } from '../tabs/client-rfis-tab/client-rfis-tab.component';
import { ClientScopeTabComponent } from '../tabs/client-scope-tab/client-scope-tab.component';
import { ClientNotificationsReportsTabComponent } from '../tabs/client-notifications-reports-tab/client-notifications-reports-tab.component';

import {
  UserRole,
  KpiCard,
  ScopeItem,
  ScopeStats,
  RfiItem,
  RfiStatus,
  RfiBreakdown,
  AuditNotification,
  ReportItem,
  UpcomingAudit,
} from '../models/client-dashboard.model';

// Live RFI source — the same in-memory store rfi-client-list.component.ts reads via this exact
// function. Calling it fresh (in loadRfiData() below) rather than snapshotting numbers means
// an RFI an auditor adds via the Add RFI drawer (which calls upsertStaticRfi() on this same
// store) shows up here the next time the dashboard loads or the Refresh button is clicked —
// there's no push/observable layer in this app, so it isn't live while the page just sits open.
import { getAllEnrichedRfis } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';

import { ClientScope, getAllClientScopes } from '../../audit-scope-summary/list/scope-summary-list.component';


// Tells the Sub-Division Head persona below which sub-division to represent. NOTE: this import path is
// a best guess ('@/app/core/client-mode') — point it at wherever client-mode.ts actually lives
// in this project (same file the static seed files and app.config.ts's CLIENT_MODE provider
// both read CLIENT_MODE_VALUE from) if it differs.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';

// The internal-audit sub-division seed (single org, DAR Exchange) — read here so the Sub-Division Head
// persona's HR sub-division name below always matches whatever the Sub-Divisions page itself shows
// for CLIENT_MODE_VALUE === 'internal-audit', instead of a separately hardcoded label that could
// drift out of sync with this seed. NOTE: this import path is a best guess — point it at wherever
// sub-division-static-indi-org.data.ts actually lives (it sits next to sub-division-static-data.ts,
// per that file's own `import type { StaticCompany } from './sub-division-static-data'`).
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { EnrichedStaticRfi } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';

// Live scope source — the same in-memory store audit-scope-summary.component.ts's own
// ngOnInit() reads (`getAllClientScopes()` was added there to expose it). Calling it fresh (in
// loadScopeData() below) means a scope added/updated on that page is reflected here too, on
// the same "reloads on load/role-change/Refresh" cadence as the RFI data above.

/**
 * Returns the first sub-division's real display name in the internal-audit seed (sub-division-
 * static-indi-org.data.ts) — the first company's first division's first sub-division — rather than
 * assuming a fixed hardcoded label, since SUB_DIVISION_INDI_ORG_COMPANIES could grow/reorder.
 * Returns undefined only if the seed has no sub-divisions at all.
 */
function firstIndiOrgSubDivisionName(): string | undefined {
  for (const company of SUB_DIVISION_INDI_ORG_COMPANIES) {
    for (const division of company.divisions) {
      if (division.subDivisions.length) return division.subDivisions[0].subDivisionName;
    }
  }
  return undefined;
}

// Resolved once at module load — this is 'HR Dept' per sub-division-static-indi-org.data.ts's
// DAR-BR-04 entry today (its first sub-division). Falls back to the literal 'HR Dept' only if the
// seed ever ends up with no sub-divisions at all, so this dashboard never silently ends up with
// `undefined` as a filter value.
const INDI_ORG_HR_SUB_DIVISION_NAME = firstIndiOrgSubDivisionName() ?? 'HR Dept';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeModule,
    ButtonModule,
    TooltipModule,
    SelectModule,
    DrawIconComponent,
    ClientOverviewTabComponent,
    ClientRfisTabComponent,
    ClientScopeTabComponent,
    ClientNotificationsReportsTabComponent,
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDashboardComponent implements OnInit, OnChanges {
  @Input() role: UserRole = 'CFO';
   // @Input() role: UserRole = 'SUB_DIVISION_HEAD';

  isCfo = true;

  // Exposes CLIENT_MODE_VALUE to the template (a template can't reference an imported const
  // directly) — gates the Sub-Division Head sub-division picker below, internal-audit mode only.
  readonly isInternalAudit = CLIENT_MODE_VALUE === 'internal-audit';
  readonly executiveDashboardLabel = $localize`:@@client.clientDashboard.executiveDashboard:Executive Dashboard`;
  readonly myAuditDashboardLabel = $localize`:@@client.clientDashboard.myAuditDashboard:My Audit Dashboard`;
  readonly organisationAuditOverviewLabel = $localize`:@@client.clientDashboard.organisationAuditOverview:Organisation-wide audit overview`;
  readonly itSecurityAssessmentLabel = $localize`:@@client.clientDashboard.itSecurityAssessment:IT Security Assessment`;
  readonly totalRfisLabel = $localize`:@@client.clientDashboard.totalRfis:Total RFIs`;
  readonly overdueLabel = $localize`:@@common.overdue:Overdue`;
  readonly exclCompletedLabel = $localize`:@@client.clientDashboard.excludingCompleted:Excl. completed`;
  readonly awaitingResponseLabel = $localize`:@@client.clientDashboard.awaitingResponse:Awaiting response`;
  readonly actionRequiredLabel = $localize`:@@client.clientDashboard.actionRequired:Action required`;
  readonly withAuditorLabel = $localize`:@@client.clientDashboard.withAuditor:With the auditor`;
  readonly acceptedLabel = $localize`:@@common.accepted:Accepted`;
  readonly needsResubmissionLabel = $localize`:@@client.clientDashboard.needsResubmission:Needs resubmission`;
  readonly pendingLabel = $localize`:@@common.pending:Pending`;
  readonly underReviewLabel = $localize`:@@common.underReview:Under Review`;
  readonly completedLabel = $localize`:@@common.completed:Completed`;
  readonly reopenedLabel = $localize`:@@common.reopened:Reopened`;

  // Sub-Division Head "Viewing as" sub-division picker (internal-audit mode only) — which of
  // SUB_DIVISION_INDI_ORG_COMPANIES' sub-divisions this persona currently represents. `null` until
  // first set (see loadSubDivisionHeadData()), at which point it defaults to INDI_ORG_HR_SUB_DIVISION_NAME.
  selectedSubDivision: string | null = null;

  /** Sub-Division picker options for the internal-audit Sub-Division Head view — every sub-division
   *  in the internal-audit sub-division seed. */
  get subDivisionOptions(): { label: string; value: string }[] {
    return SUB_DIVISION_INDI_ORG_COMPANIES.flatMap((company) =>
      company.divisions.flatMap((division) => division.subDivisions),
    ).map((subDivision) => ({ label: subDivision.subDivisionName, value: subDivision.subDivisionName }));
  }

  /** Sub-Division Head sub-division picker changed — reloads RFIs/scopes/KPIs scoped to the newly
   *  selected sub-division only. */
  onSubDivisionChange(): void {
    this.loadSubDivisionHeadData();
    this.cdr.markForCheck();
  }

  // ── Main data (passed down to the tab components) ────────────────────────
  kpis: KpiCard[] = [];
  rfiKpis: KpiCard[] = [];
  scopes: ScopeItem[] = [];
  scopeStats: ScopeStats = { total: 0, completed: 0, onTrack: 0, atRisk: 0, avgProgress: 0 };
  rfis: RfiItem[] = [];
  notifications: AuditNotification[] = [];
  reports: ReportItem[] = [];
  upcomingAudits: UpcomingAudit[] = [];

  /** Every live RFI (unscoped) — the RFIs tab builds its "RFIs by …" chart from it. */
  allRfis: EnrichedStaticRfi[] = [];
  /** Sub-division the RFI data is scoped to; null for the CFO (unscoped) view. */
  rfiSubDivision: string | null = null;

  // Maps rfi-static-data.ts's lowercase-hyphen status vocabulary to this dashboard's
  // Title Case labels (same 5 statuses, just different casing/spacing conventions).
  private readonly STATUS_LABEL_MAP: Record<EnrichedStaticRfi['status'], RfiStatus> = {
    pending: 'Pending',
    overdue: 'Overdue',
    'under-review': 'Under Review',
    reopened: 'Reopened',
    completed: 'Completed',
  };

  // Maps audit-scope-summary.component.ts's status vocabulary ('not-started' | 'planned' |
  // 'in-progress' | 'overdue' | 'completed') to this dashboard's ScopeStatus labels.
  private readonly SCOPE_STATUS_LABEL_MAP: Record<ClientScope['status'], 'Not started' | 'Planned' | 'In progress' | 'Overdue' | 'Completed'> = {
    'not-started': 'Not started',
    planned: 'Planned',
    'in-progress': 'In progress',
    overdue: 'Overdue',
    completed: 'Completed',
  };

  // Mirrors audit-scope-summary.component.ts's own `subDivisionLabels` map exactly (now the
  // real, already-human-readable sub-division names — no more short-code translation needed),
  // so a scope's `linkedSubDivisions` render identically on this dashboard as they do on that
  // page.
  private readonly SCOPE_SUB_DIVISION_LABEL_MAP: Record<string, string> = {
    'Finance & Accounts': 'Finance & Accounts',
    'Retail Operations': 'Retail Operations',
    'Inventory & Warehouse': 'Inventory & Warehouse',
    'Compliance & AML': 'Compliance & AML',
    'Human Resources': 'Human Resources',
    'IT & Systems': 'IT & Systems',
    'Procurement': 'Procurement',
    'Quality Assurance': 'Quality Assurance',
    'Logistics': 'Logistics',
    'Customer Service': 'Customer Service',
  };

  // ── Navigation targets ───────────────────────────────────────────────────
  // NOTE: adjust these paths to match your app routing if they differ.
  private readonly RFI_ROUTE   = ['/client/manage-client-rfi'];
  private readonly SCOPE_ROUTE = ['/client/scope-summary'];

  private readonly kpiNav: Record<string, { path: string[]; status?: string }> = {
    // Overview tab
    totalOpenRfis: { path: this.RFI_ROUTE },                  // full list, no filter
    pendingRfis: { path: this.RFI_ROUTE, status: 'pending' },
    myOpenRfis: { path: this.RFI_ROUTE, status: 'pending' },
    // RFIs tab
    totalRfis: { path: this.RFI_ROUTE },                        // full list, no filter
    pending: { path: this.RFI_ROUTE, status: 'pending' },
    overdue: { path: this.RFI_ROUTE, status: 'overdue' },
    underReview: { path: this.RFI_ROUTE, status: 'under-review' },
    reopened: { path: this.RFI_ROUTE, status: 'reopened' },
    // 'SLA Compliance' intentionally omitted — metric only, not a filterable list
  };

  /** Flags each KPI card that has a navigation target, so the tabs can render it as clickable. */
  private withNav(kpis: KpiCard[]): KpiCard[] {
    return kpis.map((kpi) => ({ ...kpi, clickable: !!this.kpiNav[kpi.label] }));
  }

  // Sub-division used for the Sub-Division Head persona's RFI pool (rfi-static-data.ts's
  // `subDivisionValue`). NOTE: rfi-client-list.component.ts's own shipped default is
  // 'Human Resources' (its `sub-division` field), not this — change this constant if the
  // Sub-Division Head persona should line up with that page's default instead of Finance & Accounts
  // (which is what this dashboard's Scope tab is currently built around, per audit-scope-
  // summary.component.ts's "Finance" filtered view).
  //
  // Exception: when this build is running in 'internal-audit' CLIENT_MODE (single-company
  // internal-audit client, per client-mode.ts), the Sub-Division Head persona represents HR — using
  // INDI_ORG_HR_SUB_DIVISION_NAME, the real sub-division name read from sub-division-static-
  // indi-org.data.ts (currently 'HR Dept', its DAR-BR-04 entry) rather than a separately hardcoded
  // 'Human Resources' label that could drift out of sync with that seed. NOTE: this only lines
  // up rfi-static-data.ts's filtering correctly if that file's own internal-audit RFI records
  // use this same 'HR Dept' subDivisionValue string — check that if Sub-Division Head RFIs come up empty.
  private get SUB_DIVISION_HEAD_SUB_DIVISION(): string {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      return this.selectedSubDivision ?? INDI_ORG_HR_SUB_DIVISION_NAME;
    }
    return 'Finance & Accounts';
  }

  // Sub-division used for the Sub-Division Head persona's Scope pool. Mirrors SUB_DIVISION_HEAD_SUB_DIVISION
  // above (same 'internal-audit' → INDI_ORG_HR_SUB_DIVISION_NAME override) — audit-scope-summary.
  // component.ts's data source moved from its own short sub-division codes ('finance') to the
  // real auditscopestaticdata.ts vocabulary, which uses the identical full sub-division names
  // rfi-static-data.ts already used. Kept as a separate constant (rather than reusing
  // SUB_DIVISION_HEAD_SUB_DIVISION directly) only because the two source pages are independent and could
  // diverge again later; change both together if you change which sub-division this persona
  // represents. NOTE: this only lines up audit-scope-summary.component.ts's filtering correctly
  // if that internal-audit scope data's `linkedSubDivisions` also uses 'HR Dept' — check that if
  // the Sub-Division Head Scope tab comes up empty.
  private get SUB_DIVISION_HEAD_SCOPE_SUB_DIVISION(): string {
    return this.SUB_DIVISION_HEAD_SUB_DIVISION;
  }

  /** Drives the custom .tab-bar/.tab-btn navigation — each tab body is its own component
   * under ../tabs. Replaces PrimeNG's <p-tabs>, which fought CSS overrides for its
   * tablist/tabpanel background no matter how the styles were applied. */
  activeTab: '0' | '1' | '2' | '3' = '0';

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

  /**
   * Query params that tell rfi-client-list.component.ts which role/sub-division to open as.
   * Explicit for BOTH roles (not just CFO) — leaving it to that page's own defaults for Sub-Division
   * Head was the bug: its default sub-division ('Human Resources') doesn't match this
   * dashboard's Sub-Division Head persona (SUB_DIVISION_HEAD_SUB_DIVISION, 'Finance & Accounts'), so a Sub-Division
   * Head click would land on the wrong sub-division's RFIs (or, before `role` was added at
   * all, silently on whatever that page's default role happened to be).
   */
  private rfiRoleQueryParams(): Record<string, string> {
    return this.isCfo
      ? { role: 'cfo' }
      : { role: 'subDivision', 'sub-division': this.SUB_DIVISION_HEAD_SUB_DIVISION };
  }

  /**
   * Query params that tell audit-scope-summary.component.ts which role/sub-division to open
   * as. Explicit for BOTH roles — that page's `role`/`userSubDivision` are `@Input()`s that
   * only get a value when a parent template binds them directly; reached via
   * `router.navigate()` (as every click here does) they're never set, so the page always
   * fell back to its 'cfo' default regardless of who clicked. This is the fix for that
   * "Sub-Division Head clicks land in admin/CFO mode" bug. Mirrors that destination page's own
   * `role`/`sub-division` query keys (sub-division terminology, matching rfi-management-
   * client.ts's `role`/`sub-division` keys).
   */
  private scopeRoleQueryParams(): Record<string, string> {
    return this.isCfo
      ? { role: 'cfo' }
      : { role: 'sub-division-head', 'sub-division': this.SUB_DIVISION_HEAD_SCOPE_SUB_DIVISION };
  }

  /**
   * Navigate to the target component for a clicked KPI card. Every RFI KPI on this
   * dashboard is scoped to the current role (CFO = every company pooled; Sub-Division Head =
   * SUB_DIVISION_HEAD_SUB_DIVISION only — see loadRfiData()), so the destination page needs to open
   * in the matching view via rfiRoleQueryParams() above rather than whatever it defaults to.
   */
  onKpiClick(kpi: KpiCard): void {
    const nav = this.kpiNav[kpi.key];
    if (!nav) return;
    const queryParams: Record<string, string> = { ...this.rfiRoleQueryParams() };
    if (nav.status) queryParams['status'] = nav.status;
    this.router.navigate(nav.path, { queryParams });
  }

  /**
   * Navigate to the audit scope summary, optionally filtered by status (see
   * scopeRoleQueryParams() above for the role/sub-division part). Called with no `status`
   * argument for the cards that don't correspond to a single status filter on that page
   * ("Total items", "Avg. completion") — those open the full, unfiltered list for the role.
   */
  goToScopeSummary(status?: string): void {
    const queryParams: Record<string, string> = { ...this.scopeRoleQueryParams() };
    if (status) queryParams['status'] = status;
    this.router.navigate(this.SCOPE_ROUTE, { queryParams });
  }

  /**
   * "View all" on the RFIs tab's table — same destination and role/sub-division scoping as the
   * "Total open RFIs"/"Total RFIs" KPI cards (full list, no status filter).
   */
  viewAllRfis(): void {
    this.router.navigate(this.RFI_ROUTE, { queryParams: this.rfiRoleQueryParams() });
  }

  /**
   * Header "Refresh" action — re-pulls RFI counts live from rfi-static-data.ts via
   * loadDataForRole()/loadRfiData(), so any RFI an auditor has added or updated since this
   * page loaded (e.g. through the Add RFI drawer) shows up in the KPI cards and charts.
   * This app has no push/observable data layer, so counts otherwise only refresh on
   * ngOnInit/ngOnChanges — this button is the manual "pull fresh data now" action, the same
   * role rfi-client-list.component.ts's own refreshRfis() plays after its edit drawer closes.
   */
  onRefresh(): void {
    this.loadDataForRole();
    this.cdr.markForCheck();
  }

  /**
   * "Viewing as" toggle in the header — lets this dashboard flip between the CFO and
   * Sub-Division Head views in-page, the same way audit-scope-summary.component.ts's own role
   * switcher works. `role` is technically an `@Input()` (so a host page can still fix it), but
   * mutating it here and re-running loadDataForRole() is exactly what ngOnChanges() already does
   * when a host changes that input — this just gives the same effect a first-class in-page action.
   */
  setRole(role: UserRole): void {
    if (this.role === role) return;
    this.role = role;
    this.loadDataForRole();
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.loadDataForRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && !changes['role'].firstChange) {
      this.loadDataForRole();
      this.cdr.markForCheck();
    }
  }

  private loadDataForRole(): void {
    this.isCfo = this.role === 'CFO';
    this.isCfo ? this.loadCfoData() : this.loadSubDivisionHeadData();
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * True RFI status breakdown for the current role, computed LIVE each time loadRfiData()
   * runs (on init, on role change, and on Refresh) by calling rfi-static-data.ts's real
   * `getAllEnrichedRfis()` directly — NOT from `rfis` below, which is only a small "most
   * urgent, one per status" preview of that same pool for the RFIs tab's table (the "View all"
   * button links to the full RFI Management page). Because it's recomputed from the live
   * store rather than snapshotted, an RFI an auditor adds elsewhere in the app is reflected
   * here the next time this runs. CFO = every RFI across all 8 client companies, matching
   * rfi-client-list.component.ts's own (company-unscoped) CFO view. Sub-Division Head = the
   * SUB_DIVISION_HEAD_SUB_DIVISION sub-division, pooled across every company that has one — same
   * sub-division-head filter behaviour as that page.
   */
  rfiBreakdown: RfiBreakdown = { pending: 0, overdue: 0, underReview: 0, reopened: 0, completed: 0 };

  /** Total open (non-completed) RFIs for the current role — pending + overdue + under-review + reopened. */
  get rfiOpenTotal(): number {
    const b = this.rfiBreakdown;
    return b.pending + b.overdue + b.underReview + b.reopened;
  }

  get overdueRfiCount(): number {
    return this.rfiBreakdown.overdue;
  }

  /** Count of reports still in 'draft' status, derived from `reports` so it can't drift out of sync. */
  get draftReportCount(): number {
    return this.reports.filter((r) => r.status === 'draft').length;
  }

  // ── Live RFI data (dynamic — reads rfi-static-data.ts directly) ────────────

  /** Counts a pool of enriched RFIs into the dashboard's 5-status breakdown shape. */
  private computeRfiBreakdown(pool: EnrichedStaticRfi[]): RfiBreakdown {
    return {
      pending: pool.filter((r) => r.status === 'pending').length,
      overdue: pool.filter((r) => r.status === 'overdue').length,
      underReview: pool.filter((r) => r.status === 'under-review').length,
      reopened: pool.filter((r) => r.status === 'reopened').length,
      completed: pool.filter((r) => r.status === 'completed').length,
    };
  }

  /** Maps one live rfi-static-data.ts record onto this dashboard's RfiItem shape. */
  private toRfiItem(r: EnrichedStaticRfi): RfiItem {
    return {
      id: `RFI-${r.id}`,
      title: r.title,
      subDivision: r.subDivisionLabel || r.subDivisionLabel,
      dueDate: r.dueDate,
      assignee: r.ownerLabel,
      status: this.STATUS_LABEL_MAP[r.status],
    };
  }

  /**
   * A small "most urgent, one per open status" preview of the live pool for the RFIs tab's
   * table — the earliest-due record in each of Overdue/Pending/Under Review/Reopened.
   * Skips a status entirely if the pool currently has none in it, rather than assuming
   * exactly 4 rows the way the old hardcoded preview did.
   */
  private buildRfiPreview(pool: EnrichedStaticRfi[]): RfiItem[] {
    const openStatuses: EnrichedStaticRfi['status'][] = ['overdue', 'pending', 'under-review', 'reopened'];
    const preview: RfiItem[] = [];
    for (const status of openStatuses) {
      const earliest = pool
        .filter((r) => r.status === status)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];
      if (earliest) preview.push(this.toRfiItem(earliest));
    }
    return preview;
  }

  /**
   * Loads all RFI-derived dashboard state (rfiBreakdown, the `rfis` preview, and the inputs the
   * RFIs tab builds its charts from) live from rfi-static-data.ts's getAllEnrichedRfis().
   * `subDivision === null` means CFO/unscoped (every company, every unit); otherwise scoped to
   * that one subDivisionValue, pooled across every company that has it — matching
   * rfi-client-list.component.ts's own roleRFIs scoping exactly.
   */
  private loadRfiData(subDivision: string | null): void {
    // Copied so the RFIs tab always sees a new reference (and rebuilds its charts) on reload.
    const allRfis = [...getAllEnrichedRfis()];
    const pool = subDivision === null ? allRfis : allRfis.filter((r) => r.subDivisionValue === subDivision);

    this.rfiBreakdown = this.computeRfiBreakdown(pool);
    this.rfis = this.buildRfiPreview(pool);
    this.allRfis = allRfis;
    this.rfiSubDivision = subDivision;
  }

  // ── Live scope data (dynamic — reads audit-scope-summary.component.ts directly) ─────────

  /** Maps one live audit-scope-summary.component.ts record onto this dashboard's ScopeItem shape. */
  private toScopeItem(s: ClientScope): ScopeItem {
    // Source data bug: a scope can be 'completed' with progressPercent still 0 (see s-008 in
    // that file) — that page never renders a progress bar so it never shows, but this one
    // does, so it's normalized to 100% here rather than pairing a "Completed" tag with an
    // empty bar. See the original hardcoded version of this dashboard for the same call.
    const progress = s.status === 'completed' ? 100 : (s.progressPercent ?? 0);
    return {
      name: s.scopeName,
      progress,
      status: this.SCOPE_STATUS_LABEL_MAP[s.status],
      subDivision: s.linkedSubDivisions.map((d) => this.SCOPE_SUB_DIVISION_LABEL_MAP[d] ?? d).join(' / '),
      division: s.divisionName ?? s.division,
      divisionLevel: s.subDivisionName === null,
      ownSubDivision: s.subDivisionName ?? undefined,
    };
  }

  /**
   * Loads `this.scopes` live from audit-scope-summary.component.ts's getAllClientScopes().
   * Only top-level scopes are included (`scopeLevel === 'scope'`) — sub-scopes are excluded
   * here exactly as that page's own `applyFilters()` excludes them from its top-level list.
   * `subDivisionKey === null` means CFO/unscoped (every top-level scope); otherwise scoped to
   * whichever of that record's `linkedSubDivisions` names matches (e.g. 'Finance & Accounts') —
   * the same restriction that page's own sub-division-head view applies.
   */
  private loadScopeData(subDivisionKey: string | null): void {
    const topLevel = getAllClientScopes().filter((s) => s.scopeLevel === 'scope');
    const pool = subDivisionKey === null ? topLevel : topLevel.filter((s) => s.linkedSubDivisions.includes(subDivisionKey));
    this.scopes = pool.map((s) => this.toScopeItem(s));
    this.scopeStats = this.computeScopeStats(this.scopes);
  }

  /** Scope summary counts — feeds both the Scope tab's stat cards and the scope KPIs below. */
  private computeScopeStats(scopes: ScopeItem[]): ScopeStats {
    const total = scopes.length;
    const completed = scopes.filter(s => s.status === 'Completed').length;
    const onTrack  = scopes.filter(s => ['On track', 'In progress'].includes(s.status)).length;
    // 'Overdue' counts as at-risk (self-evidently); 'Planned' is grouped with 'Not started' here
    // too, mirroring audit-scope-summary.component.ts's own notStartedCount roll-up.
    const atRisk   = scopes.filter(s => ['At risk', 'Delayed', 'Not started', 'Pending', 'Overdue', 'Planned'].includes(s.status)).length;
    const avgProgress = total
      ? Math.round(scopes.reduce((acc, s) => acc + s.progress, 0) / total)
      : 0;
    return { total, completed, onTrack, atRisk, avgProgress };
  }

  // ── CFO data ──────────────────────────────────────────────────────────────

  private loadCfoData(): void {
    this.upcomingAudits = [
      { name: 'IT Security Assessment',   subDivision: 'IT',          assignee: 'Sarah Johnson', date: new Date('2026-01-15'), status: 'In Progress' },
      { name: 'HR Compliance Audit',      subDivision: 'HR',          assignee: 'Michael Brown', date: new Date('2026-01-20'), status: 'In Progress' },
      { name: 'Procurement Process Review', subDivision: 'Procurement', assignee: 'Emily Davis', date: new Date('2026-02-10'), status: 'Planned' },
      { name: 'Customer Data Privacy',    subDivision: 'IT',          assignee: 'Sarah Johnson', date: new Date('2026-02-20'), status: 'Planned' },
      { name: 'Vendor Management Audit',  subDivision: 'Procurement', assignee: 'Emily Davis',  date: new Date('2026-01-25'), status: 'In Progress' },
    ];

    // Scope data (this.scopes) is loaded live from audit-scope-summary.component.ts via
    // loadScopeData() — see that method for details. `null` = CFO/unscoped, i.e. every
    // top-level scope (matching that page's own CFO view).
    this.loadScopeData(null);

    // RFI-derived state is loaded live from rfi-static-data.ts via loadRfiData() — see that
    // method for details. `null` = CFO/unscoped, i.e. every RFI across all 8 client companies
    // (matching rfi-client-list.component.ts's own company-unscoped CFO view).
    this.loadRfiData(null);

    this.notifications = [
      {
        title: 'RFI #108 overdue — Operations',
        description: 'RFI #108 requesting the fixed asset register for FY2025 was due on 18 Jun 2026 and has not been responded to. The Operations sub-division head has been notified. Immediate action is required to avoid further delays to the audit fieldwork schedule.',
        date: new Date('2026-06-23T09:02:00'),
        severity: 'danger',
        read: false,
      },
      {
        title: 'Draft report ready for review',
        description: 'The Finance Audit draft report has been uploaded and is available for your review.',
        date: new Date('2026-06-22T15:45:00'),
        severity: 'info',
        read: false,
      },
      {
        title: 'IT Security fieldwork starts Monday',
        description: 'The IT Security Assessment fieldwork is scheduled to begin on Monday 29 Jun 2026. The audit team will require access to the server room and network monitoring tools. Please ensure the IT sub-division head is available for the opening meeting at 9:00 AM. A detailed agenda has been shared separately.',
        date: new Date('2026-06-22T11:00:00'),
        severity: 'warn',
        read: false,
      },
      {
        title: 'HR scope document uploaded',
        description: 'The HR Compliance scope document has been uploaded by Michael Brown.',
        date: new Date('2026-06-20T10:00:00'),
        severity: 'secondary',
        read: true,
      },
    ];

    this.reports = [
      { name: 'Finance Audit — Draft Report',      uploadedDate: new Date('2026-06-21'), fileSize: '2.4 MB', status: 'draft' },
      { name: 'Procurement Final Report',           uploadedDate: new Date('2026-06-10'), fileSize: '1.8 MB', status: 'final' },
      { name: 'IT Security — Management Letter',   uploadedDate: new Date('2026-05-30'), fileSize: '890 KB', status: 'final' },
    ];

    // ── KPIs — derived from scope stats/rfiBreakdown above so they can never drift out of sync ──
    this.kpis = [
      {
        key: 'totalOpenRfis',
        label: $localize`:@@client.clientDashboard.totalOpenRfis:Total open RFIs`,
        value: this.rfiOpenTotal,
        sub: $localize`:@@client.clientDashboard.overdueCount:${this.overdueRfiCount} overdue`,
        subColor: 'danger',
        icon: 'pi pi-file-edit',
      },
      {
        key: 'pendingRfis',
        label: $localize`:@@client.clientDashboard.pendingRfis:Pending RFIs`,
        value: this.rfiBreakdown.pending,
        sub: $localize`:@@client.clientDashboard.averageFourDays:Avg. 4 days`,
        subColor: 'warning',
        icon: 'pi pi-clock',
      },
      {
        key: 'scopesInProgress',
        label: $localize`:@@client.clientDashboard.scopesInProgress:Scopes in progress`,
        value: `${this.scopeStats.onTrack}/${this.scopeStats.total}`,
        sub: $localize`:@@client.clientDashboard.completedPercentage:${this.scopeStats.avgProgress}% complete`,
        subColor: 'muted',
        icon: 'pi pi-list-check',
      },
      {
        key: 'reportsAvailable',
        label: $localize`:@@client.clientDashboard.reportsAvailable:Reports available`,
        value: this.reports.length,
        sub: $localize`:@@client.clientDashboard.draftCount:${this.draftReportCount} drafts`,
        subColor: 'muted',
        icon: 'pi pi-file-pdf',
      },
    ];

    // Mirrors rfi-client-list.component.ts's own 6 stat cards (Total/Pending/Overdue/Under
    // Review/Completed/Reopened) so the two pages always tell the same story.
    this.rfiKpis = [
      {
        key: 'totalRfis',
        label: this.totalRfisLabel,
        value: this.rfiOpenTotal,
        sub: this.exclCompletedLabel,
        subColor: 'muted',
        icon: 'pi pi-folder-open',
      },
      {
        key: 'pending',
        label: this.pendingLabel,
        value: this.rfiBreakdown.pending,
        sub: this.awaitingResponseLabel,
        subColor: 'warning',
        icon: 'pi pi-clock',
      },
      {
        key: 'overdue',
        label: this.overdueLabel,
        value: this.rfiBreakdown.overdue,
        sub: this.actionRequiredLabel,
        subColor: 'danger',
        icon: 'pi pi-exclamation-circle',
      },
      {
        key: 'underReview',
        label: this.underReviewLabel,
        value: this.rfiBreakdown.underReview,
        sub: this.withAuditorLabel,
        subColor: 'muted',
        icon: 'pi pi-eye',
      },
      {
        key: 'completed',
        label: this.completedLabel,
        value: this.rfiBreakdown.completed,
        sub: this.acceptedLabel,
        subColor: 'success',
        icon: 'pi pi-check-circle',
      },
      {
        key: 'reopened',
        label: this.reopenedLabel,
        value: this.rfiBreakdown.reopened,
        sub: this.needsResubmissionLabel,
        subColor: 'warning',
        icon: 'pi pi-refresh',
      },
    ];
  }

  // ── Sub-Division Head data ─────────────────────────────────────────────────

  private loadSubDivisionHeadData(): void {
    // Defaults the sub-division picker to HR Dept on first entry into this view — subsequent
    // calls (Refresh, tab switches) leave whatever the user already picked untouched.
    if (CLIENT_MODE_VALUE === 'internal-audit' && !this.selectedSubDivision) {
      this.selectedSubDivision = INDI_ORG_HR_SUB_DIVISION_NAME;
    }

    this.upcomingAudits = [
      { name: 'IT Security Assessment',    subDivision: 'IT', assignee: 'Sarah Johnson', date: new Date('2026-01-15'), status: 'In Progress' },
      { name: 'Network Security Audit',    subDivision: 'IT', assignee: 'Raj Mehta',     date: new Date('2026-02-01'), status: 'Planned' },
      { name: 'Vendor Management Audit',   subDivision: 'IT', assignee: 'Emily Davis',   date: new Date('2026-01-25'), status: 'In Progress' },
    ];

    // Scope data (this.scopes) is loaded live from audit-scope-summary.component.ts via
    // loadScopeData() — see that method for details. Scoped to SUB_DIVISION_HEAD_SCOPE_SUB_DIVISION,
    // matching that page's own sub-division-head view.
    this.loadScopeData(this.SUB_DIVISION_HEAD_SCOPE_SUB_DIVISION);

    // RFI-derived state is loaded live from rfi-static-data.ts via loadRfiData() — see that
    // method for details. Scoped to SUB_DIVISION_HEAD_SUB_DIVISION, pooled across every company
    // that has it (matching rfi-client-list.component.ts's own sub-division-head filter, which
    // isn't company-scoped either).
    this.loadRfiData(this.SUB_DIVISION_HEAD_SUB_DIVISION);

    this.notifications = [
      {
        title: 'RFI #108 overdue — action needed',
        description: 'Your response to RFI #108 (Fixed asset register FY2025) was due on 18 Jun 2026. Please submit the required documents immediately to avoid blocking the audit timeline. Contact the audit team if you need an extension.',
        date: new Date('2026-06-23T09:02:00'),
        severity: 'danger',
        read: false,
      },
      {
        title: 'Message from Sarah Johnson',
        description: 'Sarah Johnson has sent you a message regarding the vendor security contracts scope.',
        date: new Date('2026-06-23T08:30:00'),
        severity: 'info',
        read: false,
      },
      {
        title: 'Fieldwork visit confirmed — Jun 30',
        description: 'The on-site fieldwork visit for the IT Security Assessment has been confirmed for 30 Jun 2026. The audit team will arrive at 9:00 AM. Please ensure all relevant personnel are available and system access is provisioned in advance.',
        date: new Date('2026-06-21T10:00:00'),
        severity: 'warn',
        read: false,
      },
      {
        title: 'RFI #115 marked as received',
        description: 'Your submission for RFI #115 (IT access control log) has been acknowledged by the audit team.',
        date: new Date('2026-06-20T14:00:00'),
        severity: 'secondary',
        read: true,
      },
    ];

    this.reports = [
      { name: 'IT Security — Interim Findings',      uploadedDate: new Date('2026-06-21'), fileSize: '1.2 MB', status: 'draft' },
      { name: 'Access Control Review Report',         uploadedDate: new Date('2026-06-10'), fileSize: '980 KB', status: 'final' },
      { name: 'Network Security — Management Letter', uploadedDate: new Date('2026-05-30'), fileSize: '640 KB', status: 'final' },
    ];

    // ── KPIs — derived from scope stats/rfiBreakdown above so they can never drift out of sync ──
    this.kpis = [
      {
        key: 'myOpenRfis',
        label: $localize`:@@client.clientDashboard.myOpenRfis:My open RFIs`,
        value: this.rfiOpenTotal,
        sub: $localize`:@@client.clientDashboard.overdueCount:${this.overdueRfiCount} overdue`,
        subColor: 'danger',
        icon: 'pi pi-file-edit',
      },
      {
        key: 'pendingRfis',
        label: $localize`:@@client.clientDashboard.pendingRfis:Pending RFIs`,
        value: this.rfiBreakdown.pending,
        sub: $localize`:@@client.clientDashboard.awaitingResponse:Awaiting response`,
        subColor: 'warning',
        icon: 'pi pi-clock',
      },
      {
        key: 'myScopeProgress',
        label: $localize`:@@client.clientDashboard.myScopeProgress:My scope progress`,
        value: `${this.scopeStats.avgProgress}%`,
        sub: $localize`:@@common.atRisk:At risk`,
        subColor: 'warning',
        icon: 'pi pi-list-check',
      },
      {
        key: 'unreadNotifications',
        label: $localize`:@@client.clientDashboard.unreadNotifications:Unread notifications`,
        value: this.unreadCount,
        sub: $localize`:@@client.clientDashboard.fromAuditTeam:From audit team`,
        subColor: 'muted',
        icon: 'pi pi-bell',
      },
    ];

    this.rfiKpis = [
      {
        key: 'totalRfis',
        label: $localize`:@@client.clientDashboard.totalRfis:Total RFIs`,
        value: this.rfiOpenTotal,
        sub: $localize`:@@client.clientDashboard.excludingCompleted:Excl. completed`,
        subColor: 'muted',
        icon: 'pi pi-folder-open',
      },
      {
        key: 'pending',
        label: $localize`:@@common.pending:Pending`,
        value: this.rfiBreakdown.pending,
        sub: $localize`:@@client.clientDashboard.awaitingResponse:Awaiting response`,
        subColor: 'warning',
        icon: 'pi pi-clock',
      },
      {
        key: 'overdue',
        label: $localize`:@@common.overdue:Overdue`,
        value: this.rfiBreakdown.overdue,
        sub: $localize`:@@client.clientDashboard.actionRequired:Action required`,
        subColor: 'danger',
        icon: 'pi pi-exclamation-circle',
      },
      {
        key: 'underReview',
        label: $localize`:@@common.underReview:Under Review`,
        value: this.rfiBreakdown.underReview,
        sub: $localize`:@@client.clientDashboard.withAuditor:With the auditor`,
        subColor: 'muted',
        icon: 'pi pi-eye',
      },
      {
        key: 'completed',
        label: $localize`:@@common.completed:Completed`,
        value: this.rfiBreakdown.completed,
        sub: $localize`:@@common.accepted:Accepted`,
        subColor: 'success',
        icon: 'pi pi-check-circle',
      },
      {
        key: 'reopened',
        label: $localize`:@@common.reopened:Reopened`,
        value: this.rfiBreakdown.reopened,
        sub: $localize`:@@client.clientDashboard.needsResubmission:Needs resubmission`,
        subColor: 'warning',
        icon: 'pi pi-refresh',
      },
    ];
  }
}
