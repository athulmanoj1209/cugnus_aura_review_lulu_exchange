import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { RfiClientComponent } from '@/app/features/client/rfi-client/manage/rfi-client.component';
import type { RfiClientDrawerData } from '@/app/features/client/rfi-client/models/rfi-client.model';
import type { EnrichedRFI } from '@/app/features/audits/audit-execution/rfi/models/rfi-list.model';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { RFI_STATIC_COMPANIES, getAllEnrichedRfis } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import type { SimulatedHead } from '../models/rfi-client-list.model';
import { RfiRecordStatuses, RfiStatuses } from '@/app/features/audits/audit-execution/rfi/constants/rfi.constants';
import {
  RFI_STATUS_DEFAULT_SEVERITY,
  RFI_STATUS_SEVERITY,
  type TagSeverity,
} from '@/app/features/audits/audit-execution/rfi/constants/rfi-labels.constants';
import {
  RFI_CLIENT_DRAWER,
  RFI_CLIENT_LIST_PAGE_SIZE,
  RFI_CLIENT_LIST_QUERY_PARAMS,
  RfiClientHeadKinds,
  RfiClientUserRoles,
  RfiClientViewModes,
  type RfiClientUserRole,
  type RfiClientViewMode,
} from '../constants/rfi-client.constants';

const asDivision = (name: string): SimulatedHead => ({ kind: RfiClientHeadKinds.Division, name });
const asSubDivision = (name: string): SimulatedHead => ({ kind: RfiClientHeadKinds.SubDivision, name });

@Component({
  selector: 'app-rfi-client-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    DatePipe,
    InputTextModule,
    MultiSelectModule,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './rfi-client-list.component.html',
  styleUrl: './rfi-client-list.component.scss',
})
export class RfiClientListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly cfoSubtitleLabel = $localize`:@@client.rfiList.cfoSubtitle:View and respond to RFIs across all sub-divisions`;
  readonly rfisEntityLabel = $localize`:@@common.rfis:RFIs`;
  readonly divisionsSelectedLabel = $localize`:@@common.selectedDivisions:{0} divisions`;
  readonly subDivisionsSelectedLabel = $localize`:@@common.selectedSubDivisions:{0} sub-divisions`;
  readonly scopesSelectedLabel = $localize`:@@common.selectedScopes:{0} scopes`;
  readonly subScopesSelectedLabel = $localize`:@@common.selectedSubScopes:{0} sub-scopes`;
  readonly statusesSelectedLabel = $localize`:@@common.selectedStatuses:{0} statuses`;
  readonly divisionLabel = $localize`:@@client.rfiList.divisionView:Division`;
  readonly subDivisionLabel = $localize`:@@client.rfiList.subDivisionView:Sub-Division`;

  readonly RfiClientViewModes = RfiClientViewModes;
  readonly RfiClientUserRoles = RfiClientUserRoles;

  viewMode: RfiClientViewMode = RfiClientViewModes.Grid;
  Math = Math;

  // ── Role switch ────────────────────────────────────────────────────────────
  // Toggled live from the header's Admin / Sub-Division Head switch (see setRole()).
  userRole: RfiClientUserRole = RfiClientUserRoles.SubDivision;

  // ── Head simulation (used when userRole === 'subDivision') ──────────────────
  // Uncomment EXACTLY ONE `head = …` line across BOTH lists below — either a
  // sub-division or a division, never both (two uncommented lines won't compile).
  //  • asSubDivision(x) → only that sub-division's RFIs.
  //  • asDivision(x)    → every RFI in that division: the division-level ones
  //                       (scopes directly under the division) plus all of its
  //                       sub-divisions'.
  // RFI_STATIC_COMPANIES (rfi-static-data.ts) switches its whole tree on
  // CLIENT_MODE_VALUE, so only the group matching the active mode actually
  // resolves any RFIs — the audit-firm roster when CLIENT_MODE_VALUE is
  // 'audit-firm', the internal-audit (indi-org) roster when it's 'internal-audit'.

  // Sub-divisions — audit-firm roster
  // head = asSubDivision('Retail Operations');
  // head = asSubDivision('Finance & Accounts');
  // head = asSubDivision('Inventory & Warehouse');
  // head = asSubDivision('Compliance & AML');
  // head = asSubDivision('Human Resources');
  // head = asSubDivision('IT & Systems');
  // head = asSubDivision('Procurement');
  // head = asSubDivision('Quality Assurance');
  // head = asSubDivision('Logistics');
  // head = asSubDivision('Customer Service');
  // Sub-divisions — internal-audit (indi-org) roster, see rfi-static-indi.data.ts
  // head = asSubDivision('HR Dept');
  // head = asSubDivision('Finance');
  // head = asSubDivision('IT');
  // head = asSubDivision('BRANCH 1');
  head = asSubDivision('BRANCH 2');
  // head = asSubDivision('AML');
  // head = asSubDivision('RISK');
  // head = asSubDivision('CONSUMER PROTECTION');

  // Divisions — audit-firm roster
  // head = asDivision('Dubai Division');
  // head = asDivision('Abu Dhabi Division');
  // head = asDivision('Sharjah Division');
  // Divisions — internal-audit (indi-org) roster, see rfi-static-indi.data.ts
  // head = asDivision('HR Dept');
  // head = asDivision('IT');
  // head = asDivision('OPS');
  // head = asDivision('RISK');

  /** The simulated division, or null when simulating a sub-division. */
  get division(): string | null {
    return this.head.kind === RfiClientHeadKinds.Division ? this.head.name : null;
  }

  /** The simulated sub-division, or null when simulating a division. */
  get subDivision(): string | null {
    return this.head.kind === RfiClientHeadKinds.SubDivision ? this.head.name : null;
  }

  /** Who the page is scoped to in the head role. */
  get currentHolder(): string {
    return this.head.name;
  }

  /** CFO and division heads see RFIs from several sub-divisions, so cards/rows show which one. */
  get showHolderLabel(): boolean {
    return this.userRole === RfiClientUserRoles.Cfo || (this.userRole === RfiClientUserRoles.SubDivision && !!this.division);
  }

  get divisionSubtitleLabel(): string {
    return $localize`:@@client.rfiList.divisionSubtitle:View and respond to RFIs for the ${this.division} division and its sub-divisions`;
  }

  get subDivisionSubtitleLabel(): string {
    return $localize`:@@client.rfiList.subDivisionSubtitle:View and respond to RFIs for the ${this.subDivision} sub-division`;
  }

  // ── Filters ───────────────────────────────────────────────────────────────
  searchQuery = '';
  selectedStatuses: string[] = [];

  // CFO-only cascading filters
  selectedDivisions: string[] = [];
  selectedDeptValues: string[] = [];
  selectedScopeValues: string[] = [];
  selectedSubScopeValues: string[] = [];

  pageSize = RFI_CLIENT_LIST_PAGE_SIZE;
  firstIndex = 0;

  readonly statusOptions = [
    { label: $localize`:@@common.pending:Pending`,      value: RfiStatuses.Pending },
    { label: $localize`:@@common.overdue:Overdue`,      value: RfiStatuses.Overdue },
    { label: $localize`:@@common.underReview:Under Review`, value: RfiStatuses.UnderReview },
    { label: $localize`:@@common.reopened:Reopened`,     value: RfiStatuses.Reopened },
  ];

  // ── Division options for CFO ─────────────────────────────────────────────────
  get divisionOptions() {
    const seen = new Set<string>();
    return RFI_STATIC_COMPANIES
      .flatMap(c => c.divisions)
      .filter(b => { if (seen.has(b.divisionCode)) return false; seen.add(b.divisionCode); return true; })
      .map(b => ({ label: b.divisionName, value: b.divisionCode }));
  }

  // ── Sub-Division options filtered by selected divisions ───────────────────────
  get deptOptions() {
    const seen = new Set<string>();
    return RFI_STATIC_COMPANIES
      .flatMap(c => c.divisions)
      .filter(b => this.selectedDivisions.length === 0 || this.selectedDivisions.includes(b.divisionCode))
      .flatMap(b => b.subDivisions)
      .filter(d => { if (seen.has(d.subDivisionName)) return false; seen.add(d.subDivisionName); return true; })
      .map(d => ({ label: d.subDivisionName, value: d.subDivisionName }));
  }

  // ── Scope holders matching the selected divisions/sub-divisions ─────────────
  // Each division's own (division-level) scopes count only while no sub-division
  // is selected — same rule as filteredRfis, where a division-level RFI has an
  // empty subDivisionValue and so drops out once a sub-division is picked.
  private get filteredScopeContainers() {
    return RFI_STATIC_COMPANIES
      .flatMap(c => c.divisions)
      .filter(b => this.selectedDivisions.length === 0 || this.selectedDivisions.includes(b.divisionCode))
      .flatMap(b => [
        ...(this.selectedDeptValues.length === 0 ? [b] : []),
        ...b.subDivisions.filter(d => this.selectedDeptValues.length === 0 || this.selectedDeptValues.includes(d.subDivisionName)),
      ]);
  }

  // ── Scope options filtered by selected sub-divisions (top-level scopes only) ─
  get scopeOptions() {
    const seen = new Set<string>();
    return this.filteredScopeContainers
      .flatMap(d => d.scopes.filter(s => s.parentScopeId === null))
      .filter(s => { if (seen.has(s.scopeName)) return false; seen.add(s.scopeName); return true; })
      .map(s => ({ label: s.scopeName, value: s.scopeName }));
  }

  // ── Sub-scope options filtered by selected scopes ──────────────────────────
  get subScopeOptions() {
    const seen = new Set<string>();
    return this.filteredScopeContainers
      .flatMap(d => {
        const topLevel = d.scopes.filter(s => s.parentScopeId === null
          && (this.selectedScopeValues.length === 0 || this.selectedScopeValues.includes(s.scopeName)));
        return topLevel.flatMap(s => d.scopes.filter(ss => ss.parentScopeId === s.id));
      })
      .filter(ss => { if (seen.has(ss.scopeName)) return false; seen.add(ss.scopeName); return true; })
      .map(ss => ({ label: ss.scopeName, value: ss.scopeName }));
  }

  // ── Raw flat RFI list from the RFI static data — newest-first ───────────────
  // Cached rather than recomputed on every access — see rfi-list.component.ts's
  // allDivisionRFIs for the full rationale (unmemoized full-tree walk + CD storm
  // from the drawer's mousemove resize handle = out-of-memory crash).
  // refreshRfis() recomputes it only when the underlying static data changes.
  private _allDivisionRFIs: EnrichedRFI[] = [];

  private refreshRfis(): void {
    this._allDivisionRFIs = getAllEnrichedRfis().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private get allDivisionRFIs(): EnrichedRFI[] {
    return this._allDivisionRFIs;
  }

  // ── Role-scoped RFI pool for stat counts (no search/status filter) ─────────
  private get roleRFIs(): EnrichedRFI[] {
    if (this.userRole === RfiClientUserRoles.Cfo) return this.allDivisionRFIs;
    return this.allDivisionRFIs.filter(r => this.matchesHolder(r));
  }

  // Division head: every RFI in the division (division-level + sub-division-level).
  // Sub-division head: only their sub-division's RFIs.
  private matchesHolder(r: EnrichedRFI): boolean {
    if (this.division) return r.divisionName === this.division;
    return r.subDivisionValue === this.subDivision;
  }

  // ── Stat counts ────────────────────────────────────────────────────────────
  // `filteredRfis` below unconditionally hides completed RFIs from the grid/list — they're
  // not offered in `statusOptions` either, since filtering "by completed" would always show
  // nothing. So "Total RFIs" must exclude them too, otherwise it counts RFIs that no filter
  // combination could ever surface in the table (the same "headline number doesn't match the
  // rows below it" issue as the dashboard's KPI cards). `completedCount` stays informational.
  get totalCount()       { return this.roleRFIs.filter(r => r.status !== RfiStatuses.Completed).length; }
  get completedCount()   { return this.roleRFIs.filter(r => r.status === RfiStatuses.Completed).length; }
  get pendingCount()     { return this.roleRFIs.filter(r => r.status === RfiStatuses.Pending).length; }
  get overdueCount()     { return this.roleRFIs.filter(r => r.status === RfiStatuses.Overdue).length; }
  get underReviewCount() { return this.roleRFIs.filter(r => r.status === RfiStatuses.UnderReview).length; }
  get reopenedCount()    { return this.roleRFIs.filter(r => r.status === RfiStatuses.Reopened).length; }

  // ── Filtered list ──────────────────────────────────────────────────────────
  get filteredRfis(): EnrichedRFI[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.allDivisionRFIs.filter(r => {
      // Completed RFIs are not shown in the client view
      if (r.status === RfiStatuses.Completed) return false;

      // Division / Sub-Division head: only their division or sub-division
      if (this.userRole === RfiClientUserRoles.SubDivision && !this.matchesHolder(r)) return false;

      // CFO cascading filters
      if (this.userRole === RfiClientUserRoles.Cfo) {
        if (this.selectedDivisions.length > 0 && !this.selectedDivisions.includes(r.divisionCode)) return false;
        if (this.selectedDeptValues.length > 0 && !this.selectedDeptValues.includes(r.subDivisionValue)) return false;
        if (this.selectedScopeValues.length > 0 && (!r.scopeValue || !this.selectedScopeValues.includes(r.scopeValue))) return false;
        if (this.selectedSubScopeValues.length > 0 && (!r.subScopeValue || !this.selectedSubScopeValues.includes(r.subScopeValue))) return false;
      }

      // Status filter (both roles)
      if (this.selectedStatuses.length > 0 && !this.selectedStatuses.includes(r.status)) return false;

      // Search
      if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;

      return true;
    });
  }

  get pagedRfis(): EnrichedRFI[] {
    return this.filteredRfis.slice(this.firstIndex, this.firstIndex + this.pageSize);
  }

  /** Zero-based current page index, derived from firstIndex/pageSize for app-pagination-bar. */
  get currentPage(): number {
    return Math.floor(this.firstIndex / this.pageSize);
  }

  ngOnInit(): void {
    // Subscribed, not a one-time `route.snapshot` read: the dashboard's CFO and Dept Head
    // cards both navigate to this SAME route (only role/sub-division/status query params
    // differ), so Angular reuses this component instance across those clicks rather than
    // destroying/recreating it — a one-time snapshot read in ngOnInit would only ever see
    // the params from whichever card was clicked FIRST, silently keeping stale role/
    // sub-division on every click after that (the dashboard-vs-this-page count mismatch).
    // Subscribing to queryParamMap re-runs this block on every such navigation instead.
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.refreshRfis();

        // Switch to the CFO (pooled, company-unscoped) view when linked here from a
        // CFO-facing KPI card on the client dashboard (e.g. "Total open RFIs") — those cards
        // summarize the pooled total across all companies, so this page needs to land on the
        // same view rather than falling back to whatever `sub-division` default is set above.
        const role = params.get(RFI_CLIENT_LIST_QUERY_PARAMS.Role);
        if (role === RfiClientUserRoles.Cfo || role === RfiClientUserRoles.SubDivision) {
          this.userRole = role;
        }

        // Let a Dept Head KPI card override which sub-division this page opens scoped to,
        // since this component's own `sub-division` field above defaults to 'Human Resources'
        // — without this, a Dept Head click from a dashboard persona built around a
        // different sub-division (e.g. Finance & Accounts) would land here still showing
        // Human Resources's RFIs.
        const subDivision = params.get(RFI_CLIENT_LIST_QUERY_PARAMS.SubDivision);
        if (subDivision) {
          this.head = asSubDivision(subDivision);
        }

        // Same override for a division head (takes precedence over `sub-division`).
        const division = params.get(RFI_CLIENT_LIST_QUERY_PARAMS.Division);
        if (division) {
          this.head = asDivision(division);
        }

        // Pre-apply a status filter passed via query param (e.g. from the dashboard KPI
        // cards) — reset it when a fresh navigation doesn't carry one, so a prior visit's
        // filter doesn't linger on this reused instance either.
        const status = params.get(RFI_CLIENT_LIST_QUERY_PARAMS.Status);
        this.selectedStatuses = status && this.statusOptions.some((o) => o.value === status) ? [status] : [];
        this.firstIndex = 0;
      });
  }

  setViewMode(mode: RfiClientViewMode): void { this.viewMode = mode; }

  setRole(role: RfiClientUserRole): void {
    if (this.userRole === role) return;
    this.userRole = role;
    this.firstIndex = 0;
  }

  onDivisionChange(): void {
    this.selectedDeptValues = [];
    this.selectedScopeValues = [];
    this.selectedSubScopeValues = [];
    this.firstIndex = 0;
  }

  onDeptChange(): void {
    this.selectedScopeValues = [];
    this.selectedSubScopeValues = [];
    this.firstIndex = 0;
  }

  onScopeChange(): void {
    this.selectedSubScopeValues = [];
    this.firstIndex = 0;
  }

  onSearch(): void { this.firstIndex = 0; }
  onFilterChange(): void { this.firstIndex = 0; }

  onPageChange(page: number): void {
    this.firstIndex = page * this.pageSize;
  }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.firstIndex = 0;
  }

  async viewRfi(rfi: EnrichedRFI): Promise<void> {
    if (rfi.recordStatus === RfiRecordStatuses.Inactive) return;
    await this.drawer.open(RfiClientComponent, {
      width: RFI_CLIENT_DRAWER.Width,
      styleClass: RFI_CLIENT_DRAWER.StyleClass,
      data: { rfi, currentUser: this.currentHolder, viewOnly: this.userRole === RfiClientUserRoles.Cfo } as RfiClientDrawerData,
    }).afterClosed;
    this.refreshRfis();
  }

  rfiCardClass(rfi: EnrichedRFI): string {
    return `rfi-card rfi-card--${rfi.status}`;
  }

  /** Deactivated by the auditor (rfi-list.component.html) — blocks the client from opening/responding. */
  isBlocked(rfi: EnrichedRFI): boolean {
    return rfi.recordStatus === RfiRecordStatuses.Inactive;
  }

  statusSeverity(status: string): TagSeverity {
    return RFI_STATUS_SEVERITY[status] ?? RFI_STATUS_DEFAULT_SEVERITY;
  }

  statusLabel(status: string): string {
    switch (status) {
      case RfiStatuses.Completed:
        return $localize`:@@common.completed:Completed`;
      case RfiStatuses.UnderReview:
        return $localize`:@@common.underReview:Under Review`;
      case RfiStatuses.Overdue:
        return $localize`:@@common.overdue:Overdue`;
      case RfiStatuses.Reopened:
        return $localize`:@@common.reopened:Reopened`;
      default:
        return $localize`:@@common.pending:Pending`;
    }
  }

  truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }
}