import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { Popover, PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { RfiComponent } from '@/app/features/audits/audit-execution/rfi/manage/rfi.component';
import { RfiProfileComponent } from '@/app/features/audits/audit-execution/rfi/profile/rfi-profile.component';
import type { EnrichedRFI } from '../models/rfi-list.model';
import type { RfiDrawerData, RfiProfileDrawerData } from '../models/rfi.model';
import type { RfiFilterSubScope, RfiFilterScope, RfiFilterSubDivision, RfiRow } from '../models/rfi-list.model';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { getAllEnrichedRfis, setStaticRfiStatus } from '../rfi-static-data';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { AUDIT_SCOPE_STATIC_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { divisionAllowsSubDivisions, noSubDivisionMessage, resolveScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import {
  RFI_DRAWER,
  RFI_FILTER_OPTION_ID_SEEDS,
  RFI_LIST_PAGE_SIZE,
  RFI_LIST_QUERY_PARAMS,
  RFI_OPEN_ADD_TRUE,
  RfiRecordStatuses,
  RfiStatuses,
  RfiViewerRoles,
  RfiViewModes,
  type RfiViewMode,
} from '../constants/rfi.constants';
import {
  RFI_KPI_CARDS,
  RFI_STATUS_DEFAULT_LABEL,
  RFI_STATUS_DEFAULT_SEVERITY,
  RFI_STATUS_FILTER_OPTIONS,
  RFI_STATUS_LABELS,
  RFI_STATUS_SEVERITY,
  RFI_FILTER_CHIP_LABELS,
  type TagSeverity,
} from '../constants/rfi-labels.constants';

@Component({
  selector: 'app-rfi-list',
  imports: [
    CommonModule,
    SelectModule, ButtonModule, FormsModule,
    MultiSelectModule, PopoverModule, TagModule, TooltipModule, DatePipe, InputTextModule,
    ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent
  ],
  templateUrl: './rfi-list.component.html',
  styleUrl: './rfi-list.component.scss',
})
export class RfiListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly route  = inject(ActivatedRoute);

  @ViewChild('filterPanel') filterPanel!: Popover;

  readonly RfiViewModes = RfiViewModes;

  viewMode: RfiViewMode = RfiViewModes.Grid;

  searchQuery = '';
  pageSize = RFI_LIST_PAGE_SIZE;
  /** Zero-based current page index. */
  currentPage = 0;

  // ── Auditor filters ──────────────────────────────────────────────────
  selectedCompanies: string[] = [];
  selectedDivisions: string[] = [];
  selectedSubDivisions: RfiFilterSubDivision[] = [];
  selectedScopes: RfiFilterScope[] = [];
  selectedSubScopes: RfiFilterSubScope[] = [];
  selectedStatuses: string[] = [];
  selectedOwners: string[] = [];

  /**
   * Auditor id passed via query param (e.g. from the "Pending RFI Responses"
   * overview KPI card). When set, the list is scoped to RFIs belonging to this
   * auditor. Matches an RFI's auditor id(s) first, then falls back to the owner
   * value / label.
   */
  auditorId: string | null = null;
  teamAuditorIds: string[] = [];

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly activateRfiLabel = $localize`:@@audit.rfi.activateRfi:Activate RFI`;
  readonly deactivateRfiLabel = $localize`:@@audit.rfi.deactivateRfi:Deactivate RFI`;

  rfiBasisLevelLabel(hasSubDivision: boolean): string {
    return hasSubDivision
      ? $localize`:@@audit.rfi.subDivisionLevel:Sub-Division level`
      : $localize`:@@audit.rfi.divisionLevel:Division level`;
  }

  rfiBasisLabel(hasSubDivision: boolean): string {
    return hasSubDivision
      ? $localize`:@@common.subDivision:Sub-Division`
      : $localize`:@@common.division:Division`;
  }

    readonly statusOptions = RFI_STATUS_FILTER_OPTIONS;

  get companyOptions() {
    return this.companyDataService.all.map(c => ({ label: c.companyName, value: c.id }));
  }

  /** The REAL division list (division-static-data.ts), not this file's own
   *  RFI-grouping wrapper array, so a division added via divisions.ts's Add
   *  Division flow appears here immediately, even before it has any RFIs. */
  get availableDivisionOptions() {
    const companies = this.selectedCompanies;
    const seen = new Set<string>();
    return DIVISION_STATIC_COMPANIES
      .filter(c => companies.length === 0 || companies.includes(c.id))
      .flatMap(c => c.divisions)
      .filter(b => { if (seen.has(b.divisionCode)) return false; seen.add(b.divisionCode); return true; })
      .map(b => ({ label: b.divisionName, value: b.divisionCode }));
  }

  // Build sub-division/scope/subScope options for the auditor filters — sub-divisions
  // from the REAL sub-division list (sub-division-static-data.ts) and scopes/sub-scopes
  // from the REAL scope list (audit-scope-static-data.ts), cross-referenced by
  // divisionCode/subDivisionName, so newly added sub-divisions/scopes appear here
  // immediately even before an RFI has been attached to them. Scopes/sub-scopes
  // are a flat `scopes[]` per sub-division, differentiated by `parentScopeId`
  // (null = top-level scope, set = sub-scope of that scope).
  get subDivisions(): RfiFilterSubDivision[] {
    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    const deptMap = new Map<string, RfiFilterSubDivision>();
    let dId = RFI_FILTER_OPTION_ID_SEEDS.SubDivision,
      sId = RFI_FILTER_OPTION_ID_SEEDS.SubDivisionScope,
      ssId = RFI_FILTER_OPTION_ID_SEEDS.SubDivisionSubScope;
    for (const company of SUB_DIVISION_STATIC_COMPANIES) {
      if (companies.length > 0 && !companies.includes(company.id)) continue;
      for (const b of company.divisions) {
        if (divisions.length > 0 && !divisions.includes(b.divisionCode)) continue;
        if (!divisionAllowsSubDivisions(b.divisionCode, company.id)) continue;
        for (const d of b.subDivisions) {
          const key = d.subDivisionName;
          if (!deptMap.has(key)) {
            deptMap.set(key, { id: dId++, label: d.subDivisionName, value: d.subDivisionName, owners: [], scopes: [] });
          }
          const dept = deptMap.get(key)!;
          const scopes = AUDIT_SCOPE_STATIC_COMPANIES
            .find(c => c.id === company.id)?.divisions
            .find(sb => sb.divisionCode === b.divisionCode)?.subDivisions
            .find(sd => sd.subDivisionName === d.subDivisionName)?.scopes ?? [];
          const topLevelScopes = scopes.filter(s => s.parentScopeId === null);
          for (const s of topLevelScopes) {
            let scopeEntry = dept.scopes.find(x => x.label === s.scopeName);
            if (!scopeEntry) {
              scopeEntry = { id: sId++, label: s.scopeName, value: s.scopeName, subScopes: [] };
              dept.scopes.push(scopeEntry);
            }
            for (const ss of scopes.filter(x => x.parentScopeId === s.id)) {
              if (!scopeEntry.subScopes.find(x => x.label === ss.scopeName)) {
                scopeEntry.subScopes.push({ id: ssId++, label: ss.scopeName, value: ss.scopeName });
              }
            }
          }
        }
      }
    }
    return Array.from(deptMap.values());
  }

  /** Set when the selected divisions have no sub-divisions — disables the Sub-Division filter. */
  get subDivisionDisabledMessage(): string | null {
    return noSubDivisionMessage(this.selectedDivisions);
  }

  /** Scope filter options: the selected sub-divisions' scopes when any are picked;
   *  otherwise every scope (division-level + sub-division) under the selected
   *  divisions — or under all divisions of the selected companies when no division
   *  is picked — from the REAL scope list (audit-scope-static-data.ts). */
  get availableScopes(): RfiFilterScope[] {
    const map = new Map<string, RfiFilterScope>();
    if (this.selectedSubDivisions.length > 0) {
      for (const dept of this.selectedSubDivisions) {
        for (const scope of dept.scopes) map.set(scope.value, scope);
      }
      return Array.from(map.values());
    }

    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    // Cached per company/division selection — this getter runs on every change-detection
    // pass and walks the whole scope tree (see the _allDivisionRFIs note below).
    const cacheKey = `${companies.join('|')}::${divisions.join('|')}`;
    if (this._scopeOptionsCache?.key === cacheKey) return this._scopeOptionsCache.scopes;
    let sId = RFI_FILTER_OPTION_ID_SEEDS.Scope, ssId = RFI_FILTER_OPTION_ID_SEEDS.SubScope;
    for (const company of AUDIT_SCOPE_STATIC_COMPANIES) {
      if (companies.length > 0 && !companies.includes(company.id)) continue;
      for (const b of company.divisions) {
        if (divisions.length > 0 && !divisions.includes(b.divisionCode)) continue;
        // A division without sub-divisions contributes only its own division-level scopes.
        const subDivisionScopes = divisionAllowsSubDivisions(b.divisionCode, company.id)
          ? b.subDivisions.map(sd => sd.scopes)
          : [];
        for (const scopes of [b.scopes ?? [], ...subDivisionScopes]) {
          for (const s of scopes.filter(x => x.parentScopeId === null)) {
            let scopeEntry = map.get(s.scopeName);
            if (!scopeEntry) {
              scopeEntry = { id: sId++, label: s.scopeName, value: s.scopeName, subScopes: [] };
              map.set(s.scopeName, scopeEntry);
            }
            for (const ss of scopes.filter(x => x.parentScopeId === s.id)) {
              if (!scopeEntry.subScopes.find(x => x.label === ss.scopeName)) {
                scopeEntry.subScopes.push({ id: ssId++, label: ss.scopeName, value: ss.scopeName });
              }
            }
          }
        }
      }
    }
    const scopes = Array.from(map.values());
    this._scopeOptionsCache = { key: cacheKey, scopes };
    return scopes;
  }

  private _scopeOptionsCache: { key: string; scopes: RfiFilterScope[] } | null = null;

  get availableSubScopes(): RfiFilterSubScope[] {
    const map = new Map<string, RfiFilterSubScope>();
    const source = this.selectedScopes.length ? this.selectedScopes : this.availableScopes;
    for (const scope of source) {
      for (const sub of scope.subScopes) map.set(sub.value, sub);
    }
    return Array.from(map.values());
  }

  /** Distinct owners across all RFIs, for the Owner filter. */
  get ownerOptions(): { label: string; value: string }[] {
    const map = new Map<string, string>();
    for (const r of this.allDivisionRFIs) {
      if (r.ownerValue) map.set(r.ownerValue, r.ownerLabel || r.ownerValue);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ label, value }));
  }

  // ── Flat RFI list derived from the RFI static data — newest-first ───────────────────
  // Cached rather than recomputed on every access: getAllEnrichedRfis() walks the entire
  // (large) RFI static-data tree and allocates a fresh array + Date objects every call. As
  // a plain getter this used to re-run on every Angular change-detection cycle — and it's
  // read from several other getters (stat counts, filteredRfis, findRfiById) plus once per
  // rendered card (isBlocked) — so a single render pass could trigger dozens of full tree
  // walks, and with CD firing on every mouse move (the Add RFI drawer's resize handle uses
  // a document:mousemove listener), that compounded fast enough to crash the tab with an
  // out-of-memory error. refreshRfis() recomputes it only when the underlying static data
  // can actually have changed (init, add/edit, activate/deactivate).
  private _allDivisionRFIs: RfiRow[] = [];

  private refreshRfis(): void {
    // Drop RFIs filed under sub-divisions of a division that has no sub-divisions
    // (leftover seed records), and division-level RFIs under a division that has
    // sub-divisions — unless the RFI was explicitly added at division level
    // (`hasSubDivision: false`). The list, stat cards and filters all read this.
    this._allDivisionRFIs = getAllEnrichedRfis()
      .filter(r => r.subDivisionValue
        ? divisionAllowsSubDivisions(r.divisionCode, r.company)
        : !divisionAllowsSubDivisions(r.divisionCode, r.company) || r.hasSubDivision === false)
      .map(r => ({ ...r, org: resolveScopeOrgLabels(r.company, r.divisionCode, r.subDivisionLabel) }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this._scopeOptionsCache = null;
  }

  private get allDivisionRFIs(): RfiRow[] {
    return this._allDivisionRFIs;
  }

  // ── Stat row (matches the Audit Dashboard's kpi-grid card model) ────────
  get rfiKpis() {
    return [
      { ...RFI_KPI_CARDS.Total,       value: String(this.totalCount) },
      { ...RFI_KPI_CARDS.Pending,     value: String(this.pendingCount) },
      { ...RFI_KPI_CARDS.Overdue,     value: String(this.overdueCount) },
      { ...RFI_KPI_CARDS.UnderReview, value: String(this.underReviewCount) },
      { ...RFI_KPI_CARDS.Completed,   value: String(this.completedCount) },
      { ...RFI_KPI_CARDS.Reopened,    value: String(this.reopenedCount) },
    ];
  }

  // ── Stat counts (based on all RFIs, no filters) ──────────────────────────
  get totalCount()       { return this.allDivisionRFIs.length; }
  get completedCount()   { return this.allDivisionRFIs.filter(r => r.status === RfiStatuses.Completed).length; }
  get pendingCount()     { return this.allDivisionRFIs.filter(r => r.status === RfiStatuses.Pending).length; }
  get overdueCount()     { return this.allDivisionRFIs.filter(r => r.status === RfiStatuses.Overdue).length; }
  get underReviewCount() { return this.allDivisionRFIs.filter(r => r.status === RfiStatuses.UnderReview).length; }
  get reopenedCount()    { return this.allDivisionRFIs.filter(r => r.status === RfiStatuses.Reopened).length; }

  /** True when the given RFI is assigned to the deep-linked auditor (not merely owned by them). */
  private matchesAuditor(r: EnrichedRFI, auditorId: string): boolean {
    return r.auditorId === auditorId
      || (r.auditorIds?.includes(auditorId) ?? false);
  }

  get filteredRfis(): RfiRow[] {
    const q = this.searchQuery.toLowerCase().trim();
    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    const depts = this.selectedSubDivisions.map(d => d.value);
    const scopes = this.selectedScopes.map(s => s.value);
    const subScopes = this.selectedSubScopes.map(ss => ss.value);
    const statuses = this.selectedStatuses;
    const owners = this.selectedOwners;
    const auditorId = this.auditorId;
    const teamAuditorIds = this.teamAuditorIds;

    return this.allDivisionRFIs.filter(r => {
      if (auditorId && !this.matchesAuditor(r, auditorId)) return false;
      if (!auditorId && teamAuditorIds.length && !(r.auditorIds ?? []).some(id => teamAuditorIds.includes(id))) return false;
      if (companies.length > 0 && !companies.includes(r.company)) return false;
      if (divisions.length > 0 && !divisions.includes(r.divisionCode)) return false;
      if (depts.length > 0 && !depts.includes(r.subDivisionValue)) return false;
      if (scopes.length > 0 && (!r.scopeValue || !scopes.includes(r.scopeValue))) return false;
      if (subScopes.length > 0 && (!r.subScopeValue || !subScopes.includes(r.subScopeValue))) return false;
      if (statuses.length > 0 && !statuses.includes(r.status)) return false;
      if (owners.length > 0 && !owners.includes(r.ownerValue)) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  private get firstIndex(): number {
    return this.currentPage * this.pageSize;
  }

  get pagedRfis(): RfiRow[] {
    return this.filteredRfis.slice(this.firstIndex, this.firstIndex + this.pageSize);
  }

  ngOnInit(): void {
    this.refreshRfis();

    // Pre-filter when navigated from an RFI dashboard card
    // (e.g. /rfi-management?status=pending&auditorId=...)
    this.route.queryParamMap.subscribe(params => {
      const status = params.get(RFI_LIST_QUERY_PARAMS.Status);
      const valid = this.statusOptions.some(o => o.value === status);
      this.selectedStatuses = valid && status ? [status] : [];

      // Scope to a specific auditor (from the overview "Pending RFI Responses" card).
      this.auditorId = params.get(RFI_LIST_QUERY_PARAMS.AuditorId);
      this.teamAuditorIds = (params.get('teamAuditorIds') ?? '').split(',').filter(Boolean);

      this.currentPage = 0;

      // Arriving from the "Send RFI" quick action — open the Add RFI drawer
      // immediately so the auditor can create one right away.
      if (params.get(RFI_LIST_QUERY_PARAMS.OpenAdd) === RFI_OPEN_ADD_TRUE) this.onAddNewRfi();
    });
  }

  setViewMode(mode: RfiViewMode): void {
    this.viewMode = mode;
  }

  onCompanyChange(): void {
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.selectedSubScopes = [];
  }

  onDivisionChange(): void {
    this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.selectedSubScopes = [];
  }

  onSubDivisionsChange(): void {
    this.selectedScopes = [];
    this.selectedSubScopes = [];
  }

  onScopesChange(): void {
    this.selectedSubScopes = [];
  }

  onSearch(): void { this.currentPage = 0; }

  /* ── Popover filter helpers (mirrors Evidence Repository filter panel) ───── */
  get hasActiveFilters(): boolean {
    return !!this.searchQuery.trim()
      || this.selectedCompanies.length > 0
      || this.selectedDivisions.length > 0
      || this.selectedSubDivisions.length > 0
      || this.selectedScopes.length > 0
      || this.selectedSubScopes.length > 0
      || this.selectedOwners.length > 0
      || this.selectedStatuses.length > 0;
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedCompanies.length)   count++;
    if (this.selectedDivisions.length)    count++;
    if (this.selectedSubDivisions.length) count++;
    if (this.selectedScopes.length)      count++;
    if (this.selectedSubScopes.length)   count++;
    if (this.selectedOwners.length)      count++;
    if (this.selectedStatuses.length)    count++;
    return count;
  }

  get activeFilterChips(): { key: string; label: string }[] {
    const chips: { key: string; label: string }[] = [];
    if (this.selectedCompanies.length)
      chips.push({ key: 'companies',   label: `${RFI_FILTER_CHIP_LABELS.companies}: ${this.selectedCompanies.length}` });
    if (this.selectedDivisions.length)
      chips.push({ key: 'divisions',    label: `${RFI_FILTER_CHIP_LABELS.divisions}: ${this.selectedDivisions.length}` });
    if (this.selectedSubDivisions.length)
      chips.push({ key: 'subDivisions', label: `${RFI_FILTER_CHIP_LABELS.subDivisions}: ${this.selectedSubDivisions.length}` });
    if (this.selectedScopes.length)
      chips.push({ key: 'scopes',      label: `${RFI_FILTER_CHIP_LABELS.scopes}: ${this.selectedScopes.length}` });
    if (this.selectedSubScopes.length)
      chips.push({ key: 'subScopes',   label: `${RFI_FILTER_CHIP_LABELS.subScopes}: ${this.selectedSubScopes.length}` });
    if (this.selectedOwners.length)
      chips.push({ key: 'owners',      label: `${RFI_FILTER_CHIP_LABELS.owners}: ${this.selectedOwners.length}` });
    if (this.selectedStatuses.length)
      chips.push({ key: 'statuses',    label: `${RFI_FILTER_CHIP_LABELS.statuses}: ${this.selectedStatuses.length}` });
    return chips;
  }

  removeFilter(key: string): void {
    switch (key) {
      case 'companies':   this.selectedCompanies = []; this.selectedDivisions = []; this.selectedSubDivisions = []; this.selectedScopes = []; this.selectedSubScopes = []; break;
      case 'divisions':    this.selectedDivisions = []; this.selectedSubDivisions = []; this.selectedScopes = []; this.selectedSubScopes = []; break;
      case 'subDivisions': this.selectedSubDivisions = []; this.selectedScopes = []; this.selectedSubScopes = []; break;
      case 'scopes':      this.selectedScopes = []; this.selectedSubScopes = []; break;
      case 'subScopes':   this.selectedSubScopes = []; break;
      case 'owners':      this.selectedOwners = []; break;
      case 'statuses':    this.selectedStatuses = []; break;
    }
    this.currentPage = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCompanies = [];
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.selectedSubScopes = [];
    this.selectedOwners = [];
    this.selectedStatuses = [];
    this.currentPage = 0;
  }

  onOwnerChange(): void { this.currentPage = 0; }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.currentPage = 0;
  }

  async viewRfi(rfi: EnrichedRFI): Promise<void> {
    // if (rfi.recordStatus === 'inactive') return;
    await this.drawer.open(RfiProfileComponent, {
      width: RFI_DRAWER.ProfileWidth,
      styleClass: RFI_DRAWER.StyleClass,
      data: { rfi, currentUser: RfiViewerRoles.Auditor } as RfiProfileDrawerData,
    }).afterClosed;
    this.refreshRfis();
  }

  async onAddNewRfi(): Promise<void> {
    await this.drawer.open(RfiComponent, {
      width: RFI_DRAWER.FormWidth,
      styleClass: RFI_DRAWER.StyleClass,
      data: { currentUser: RfiViewerRoles.Auditor } as RfiDrawerData,
    }).afterClosed;
    this.refreshRfis();
  }

  rfiCardClass(rfi: EnrichedRFI): string {
    return `rfi-card rfi-card--${rfi.status}`;
  }

  statusSeverity(status: string): TagSeverity {
    return RFI_STATUS_SEVERITY[status] ?? RFI_STATUS_DEFAULT_SEVERITY;
  }

  statusLabel(status: string): string {
    return RFI_STATUS_LABELS[status] ?? RFI_STATUS_DEFAULT_LABEL;
  }

  truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }

  /* ── Deactivate / activate ──────────────────────────────────────────────── */
  showConfirmDialog = false;
  confirmTarget: { id: string; name: string } | null = null;

  private findRfiById(id: string): EnrichedRFI | undefined {
    return this.allDivisionRFIs.find(r => r.id.toString() === id);
  }

  isBlocked(id: string): boolean {
    return this.findRfiById(id)?.recordStatus === RfiRecordStatuses.Inactive;
  }

  openConfirm(id: string, name: string): void {
    this.confirmTarget = { id, name };
    this.showConfirmDialog = true;
  }

  closeConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmTarget = null;
  }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const rfi = this.findRfiById(this.confirmTarget.id);
    if (rfi) {
      setStaticRfiStatus(rfi.id, rfi.recordStatus === RfiRecordStatuses.Inactive ? RfiRecordStatuses.Active : RfiRecordStatuses.Inactive);
      this.refreshRfis();
    }
    this.closeConfirm();
  }
}
