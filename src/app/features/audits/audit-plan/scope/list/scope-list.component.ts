import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { ScopeComponent } from '@/app/features/audits/audit-plan/scope/manage/scope.component';
import { ScopeProfileComponent } from '@/app/features/audits/audit-plan/scope/profile/scope-profile.component';
import type { ScopeDrawerData, ScopeDrawerResult, ScopeProfileDrawerData } from '../models/scope.model';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { AUDITOR_PROFILES } from '@/app/features/audits/organization/divisions/list/division-list.component';
import type { StaticScope, ScopeStatus } from '../models/scope-static-data.model';
import type { EnrichedScope, AuditorScopeRow } from '../models/scope-list.model';
import {
  AUDIT_SCOPE_STATIC_COMPANIES,
  findStaticScopeById,
  subScopesOf,
  upsertStaticScope,
  editStaticScope,
  setScopeStatus,
} from '../audit-scope-static-data';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { divisionAllowsSubDivisions, noSubDivisionMessage, resolveScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import { findAuditPlanForScope, periodLabel } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import {
  ScopeDrawerModes,
  ScopeLevels,
  ScopeRecordStatuses,
  ScopeViewModes,
  ScopeWorkflowStatuses,
  type ScopeLevel,
  type ScopeViewMode,
  SCOPE_DEFAULT_AVATAR,
  SCOPE_DEFAULT_PROGRESS,
  SCOPE_DRAWER,
  SCOPE_DUE_DATE_FORMAT,
  SCOPE_DUE_DATE_LOCALE,
  SCOPE_HIGH_RISK_NOT_STARTED_FILTER,
  SCOPE_LIST_PAGE_SIZE,
  SCOPE_LIST_QUERY_PARAMS,
  SCOPE_PROGRESS_BY_STATUS,
} from '../constants/scope.constants';
import {
  SCOPE_DEFAULT_PRIORITY,
  SCOPE_HIGH_RISK_DISPLAY_LEVELS,
  SCOPE_LEVEL_LABELS,
  SCOPE_RISK_RATING_DISPLAY,
  SCOPE_RISK_TO_PRIORITY,
  SCOPE_STATUS_FILTER_OPTIONS,
  SCOPE_WORKFLOW_STATUS_DEFAULT_SEVERITY,
  SCOPE_WORKFLOW_STATUS_SEVERITY,
} from '../constants/scope-labels.constants';
import { SCOPE_FILTER_CHIP_LABELS, scopeAuditorCountLabel } from '../constants/scope-labels.constants';


/** One scope/sub-scope as the scope list shows it, with its org context. */
interface ListedScope {
  scope: StaticScope;
  companyId: string;
  divisionCode: string;
  divisionName: string;
  /** null for a division-level scope. */
  subDivisionName: string | null;
}

/**
 * Every scope/sub-scope the scope list page actually shows — division-level
 * scopes included, leftover sub-division records under a division without
 * sub-divisions excluded. Same inclusion rules as ScopeListComponent.refreshScopes(),
 * so dashboard counts always match the list they navigate to.
 */
function listedStaticScopes(): ListedScope[] {
  const out: ListedScope[] = [];
  for (const companyRec of AUDIT_SCOPE_STATIC_COMPANIES) {
    for (const division of companyRec.divisions) {
      for (const scope of division.scopes ?? []) {
        if (division.hasSubDivision && scope.hasSubDivision !== false) continue;
        out.push({
          scope, companyId: companyRec.id, divisionCode: division.divisionCode,
          divisionName: division.divisionName, subDivisionName: null,
        });
      }
      if (!divisionAllowsSubDivisions(division.divisionCode, companyRec.id)) continue;
      for (const dept of division.subDivisions) {
        for (const scope of dept.scopes) {
          out.push({
            scope, companyId: companyRec.id, divisionCode: division.divisionCode,
            divisionName: division.divisionName, subDivisionName: dept.subDivisionName,
          });
        }
      }
    }
  }
  return out;
}

function isAssignedTo(scope: StaticScope, auditorId: string): boolean {
  return !!(scope.assignedAuditors?.includes(auditorId) || scope.assignedReviewers?.includes(auditorId));
}

function matchesLevel(scope: StaticScope, level: ScopeLevel): boolean {
  return (level === ScopeLevels.SubScope) === !!scope.parentScopeId;
}

/**
 * Count of scopes (or sub-scopes) where the given id is an assigned auditor
 * OR reviewer — used by the auditor overview's "Assigned Scopes"/"Assigned
 * Sub-scopes" KPI cards.
 */
export function countScopesForAuditor(auditorId: string, level: ScopeLevel): number {
  return listedStaticScopes()
    .filter(({ scope }) => matchesLevel(scope, level) && isAssignedTo(scope, auditorId))
    .length;
}

export function countScopesForTeam(auditorIds: readonly string[], level: ScopeLevel): number {
  const scopeIds = new Set<string>();
  for (const { scope } of listedStaticScopes()) {
    if (!matchesLevel(scope, level)) continue;
    if (auditorIds.some(id => isAssignedTo(scope, id))) scopeIds.add(scope.id);
  }
  return scopeIds.size;
}

/**
 * Count of scopes/sub-scopes (both levels combined) assigned to the given
 * auditor as auditor OR reviewer, matching an exact `workflowStatus` when
 * given (pass null for "Total", which doesn't filter by status). Used by
 * the auditor-my-audits-scopes tab's summary cards, so each card's count
 * always matches what the scope list shows when the card is
 * clicked with the same status passed as a query param.
 */
export function countScopesForAuditorByStatus(auditorId: string, status: ScopeStatus | null): number {
  return listedStaticScopes()
    .filter(({ scope }) => isAssignedTo(scope, auditorId) &&
      (status === null || (scope.workflowStatus ?? ScopeWorkflowStatuses.NotStarted) === status))
    .length;
}

/** Illustrative progress % derived from status (scopes have no real completion-% field). */
function progressForScopeStatus(status: ScopeStatus): number {
  return SCOPE_PROGRESS_BY_STATUS[status] ?? SCOPE_DEFAULT_PROGRESS;
}

/**
 * Every scope/sub-scope assigned to the given auditor, shaped for the
 * auditor-my-audits-scopes tab's "Assigned Scopes"/"Assigned Sub-scopes"
 * tables.
 */
export function getScopeRowsForAuditor(auditorId: string, level: ScopeLevel): AuditorScopeRow[] {
  const rows: AuditorScopeRow[] = [];
  for (const { scope, divisionName, subDivisionName } of listedStaticScopes()) {
    if (!matchesLevel(scope, level) || !isAssignedTo(scope, auditorId)) continue;
    const status = scope.workflowStatus ?? ScopeWorkflowStatuses.NotStarted;
    const parent = scope.parentScopeId ? findStaticScopeById(scope.parentScopeId) : undefined;
    rows.push({
      scope: scope.scopeName,
      audit: subDivisionName ?? divisionName,
      parentScopeName: parent?.scopeName,
      priority: SCOPE_RISK_TO_PRIORITY[scope.riskRating ?? ''] ?? SCOPE_DEFAULT_PRIORITY,
      status,
      progress: progressForScopeStatus(status),
      dueDate: scope.endDate
        ? new Date(scope.endDate).toLocaleDateString(SCOPE_DUE_DATE_LOCALE, SCOPE_DUE_DATE_FORMAT)
        : '—',
      scopeLevel: level,
    });
  }
  return rows;
}

@Component({
  selector: 'app-scope-list',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    PopoverModule,
    ButtonModule,
    AvatarModule,
    PaginatorModule,
    TooltipModule,
    TagModule,
    DividerModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './scope-list.component.html',
  styleUrl: './scope-list.component.scss',
})
export class ScopeListComponent implements OnInit {

  @ViewChild('filterPanel') filterPanel!: Popover;

  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  viewMode: ScopeViewMode = ScopeViewModes.Grid;
  Math = Math;

  // Exposed for the template.
  readonly ScopeViewModes = ScopeViewModes;
  readonly ScopeLevels = ScopeLevels;
  readonly scopeLevelLabels = SCOPE_LEVEL_LABELS;

  searchQuery = '';
  selectedCompanies: string[] = [];
  selectedDivisions: string[] = [];
  selectedSubDivisions: string[] = [];
  selectedAuditors: string[] = [];
  selectedStatuses: string[] = [];

  /** Status filter options. */
  readonly statusOptions = SCOPE_STATUS_FILTER_OPTIONS as { label: string; value: ScopeStatus }[];

  /** Set when arriving from the dashboard "High-Risk Scopes Not Started" card. */
  highRiskNotStartedOnly = false;

  /**
   * Auditor id passed via query param (e.g. from the "Assigned Scopes" /
   * "Assigned Sub-scopes" overview KPI cards). When set, the list is scoped
   * to items assigned to this auditor.
   */
  auditorId: string | null = null;
  teamAuditorIds: string[] = [];

  /**
   * Restricts the list to a single level when arriving from the overview cards:
   *  • 'scope'    → "Assigned Scopes"
   *  • 'subscope' → "Assigned Sub-scopes"
   */
  scopeLevelFilter: ScopeLevel | null = null;

  pageSize = SCOPE_LIST_PAGE_SIZE;
  firstIndex = 0;

  ngOnInit(): void {
    this.refreshScopes();

    this.route.queryParamMap.subscribe(params => {
      this.highRiskNotStartedOnly = params.get(SCOPE_LIST_QUERY_PARAMS.Filter) === SCOPE_HIGH_RISK_NOT_STARTED_FILTER;

      /* Allow deep-linking a status filter, e.g. ?status=Overdue */
      const status = params.get(SCOPE_LIST_QUERY_PARAMS.Status);
      if (status && this.statusOptions.some(o => o.value === status)) {
        this.selectedStatuses = [status];
      }

      /* Scope to a specific auditor (from the overview "Assigned Scopes/Sub-scopes" cards). */
      this.auditorId = params.get(SCOPE_LIST_QUERY_PARAMS.AuditorId);
      this.teamAuditorIds = (params.get('teamAuditorIds') ?? '').split(',').filter(Boolean);

      /* Restrict to scopes or sub-scopes when specified. */
      const scopeLevel = params.get(SCOPE_LIST_QUERY_PARAMS.ScopeLevel);
      this.scopeLevelFilter =
        scopeLevel === ScopeLevels.Scope || scopeLevel === ScopeLevels.SubScope ? scopeLevel : null;

      this.firstIndex = 0;
    });
  }

  /** Clears the high-risk quick filter and removes it from the URL. */
  clearHighRiskFilter(): void {
    this.highRiskNotStartedOnly = false;
    this.firstIndex = 0;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [SCOPE_LIST_QUERY_PARAMS.Filter]: null },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * A scope counts as "high-risk & not started" for the dashboard drill-down.
   * NOTE: heuristic fallback — replace with your real data when the scope model
   * carries an explicit risk rating / status.
   */
  private isHighRiskNotStarted(s: EnrichedScope): boolean {
    return !!s.riskRating && SCOPE_HIGH_RISK_DISPLAY_LEVELS.includes(s.riskRating) && s.started === false;
  }

  /**
   * Derives a display status. Prefers an explicit status on the raw scope,
   * otherwise infers from the started flag and the end date.
   * NOTE: heuristic — swap for your real status data when available.
   */
  private deriveStatus(started: boolean, endDate?: string, raw?: string): ScopeStatus {
    // Loose keyword match on free-text status values (heuristic).
    if (raw) {
      const r = raw.toLowerCase();
      if (r.includes('complete'))  return ScopeWorkflowStatuses.Completed;
      if (r.includes('overdue'))   return ScopeWorkflowStatuses.Overdue;
      if (r.includes('progress'))  return ScopeWorkflowStatuses.InProgress;
      if (r.includes('plan'))      return ScopeWorkflowStatuses.Planned;
      if (r.includes('not'))       return ScopeWorkflowStatuses.NotStarted;
    }
    if (!started) return ScopeWorkflowStatuses.NotStarted;
    const end = endDate ? new Date(endDate).getTime() : NaN;
    if (!isNaN(end) && end < Date.now()) return ScopeWorkflowStatuses.Overdue;
    return ScopeWorkflowStatuses.InProgress;
  }

  /** PrimeNG tag severity for a status badge. */
  statusSeverity(status?: ScopeStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    return SCOPE_WORKFLOW_STATUS_SEVERITY[status ?? ''] ?? SCOPE_WORKFLOW_STATUS_DEFAULT_SEVERITY;
  }

  get companyOptions() {
    return this.companyDataService.all
      .filter(c => !c.blocked)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  /** The REAL division list (division-static-data.ts), not this file's own
   *  scope-grouping wrapper array, so a division added via divisions.ts's Add
   *  Division flow appears here immediately, even before it has any scopes. */
  private get allStaticDivisions() {
    return DIVISION_STATIC_COMPANIES.flatMap(c => c.divisions);
  }

  get availableDivisionOptions() {
    const companies = this.selectedCompanies;
    const seen = new Set<string>();
    return this.allStaticDivisions
      .filter(b => companies.length === 0 || companies.includes(b.company))
      .filter(b => b.status === DivisionStatuses.Active && !this.companyDataService.isCompanyBlocked(b.company))
      .filter(b => { if (seen.has(b.divisionCode)) return false; seen.add(b.divisionCode); return true; })
      .map(b => ({ label: b.divisionName, value: b.divisionCode }));
  }

  /** Set when the selected divisions have no sub-divisions — disables the Sub-Division filter. */
  get subDivisionDisabledMessage(): string | null {
    return noSubDivisionMessage(this.selectedDivisions);
  }

  /** How many scopes (audit-scope-static-data.ts, the real scope source) exist
   *  for a given real division/sub-division, so the sub-division FILTER can keep its
   *  "only sub-divisions that already have scopes" restriction while sourcing
   *  the actual sub-division list from sub-division-static-data.ts. */
  private getScopeCountForSubDivision(divisionCode: string, subDivisionName: string): number {
    for (const company of AUDIT_SCOPE_STATIC_COMPANIES) {
      const division = company.divisions.find(b => b.divisionCode === divisionCode);
      const dept = division?.subDivisions.find(d => d.subDivisionName === subDivisionName);
      if (dept) return dept.scopes.length;
    }
    return 0;
  }

  get availableSubDivisionOptions() {
    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    const seen = new Set<string>();
    const opts: { label: string; value: string }[] = [];
    for (const c of SUB_DIVISION_STATIC_COMPANIES) {
      if (companies.length > 0 && !companies.includes(c.id)) continue;
      for (const b of c.divisions) {
        if (divisions.length > 0 && !divisions.includes(b.divisionCode)) continue;
        if (!divisionAllowsSubDivisions(b.divisionCode, c.id)) continue;
        for (const d of b.subDivisions) {
          if (seen.has(d.subDivisionName)) continue;
          if (d.status !== SubDivisionStatuses.Active) continue;
          if (this.getScopeCountForSubDivision(b.divisionCode, d.subDivisionName) > 0) {
            seen.add(d.subDivisionName);
            opts.push({ label: d.subDivisionName, value: d.subDivisionName });
          }
        }
      }
    }
    return opts;
  }

  /**
   * Distinct auditor names across all scopes, for the auditor filter.
   * Mirrors the evidence-list auditor filter (flat, filterable list).
   */
  get auditorOptions() {
    const set = new Set<string>();
    for (const s of this.allEnrichedScopes) {
      for (const name of s.auditorNames) if (name) set.add(name);
    }
    return Array.from(set).sort().map(name => ({ label: name, value: name }));
  }

  /** Maps AUDITOR_PROFILES keys (e.g. 'alice') to display names, for the auditor filter/list. */
  private auditorDisplayNames(ids: string[] | undefined): string[] {
    if (!ids) return [];
    return ids.map(id => AUDITOR_PROFILES[id]?.displayName ?? id);
  }

  /**
   * Mock high-risk, not-started scopes so the dashboard "High-Risk Scopes
   * Not Started" drill-down always has data to show.
   * NOTE: demo data — remove once real scopes carry riskRating/started.
   */
  private readonly mockHighRiskScopes: Omit<EnrichedScope, 'org'>[] = [
    {
      id: 'MOCK-9001', name: 'Cybersecurity Threat Assessment',
      description: 'End-to-end review of perimeter, endpoint and identity controls against the latest threat landscape.',
      avatarUrl: 'images/avatars/default-avatar.jpg', timePeriod: '2026-01-01 - 2026-03-31',
      auditors: '0 Auditors', auditorNames: [], budget: '$48,000', model: 'Full',
      company: 'Cygnus Aura', divisionCode: 'DXB-HQ', divisionName: 'Dubai HQ',
      subDivisionName: 'IT', scopeLevel: 'scope',
      riskRating: 'Critical', started: false, status: 'Not Started',
      createdAt: '2026-01-01T08:00:00.000Z',
    },
    {
      id: 'MOCK-9002', name: 'AML / CFT Sanctions Screening Review',
      description: 'Assessment of transaction monitoring and sanctions-screening effectiveness across high-risk jurisdictions.',
      avatarUrl: 'images/avatars/default-avatar.jpg', timePeriod: '2026-02-01 - 2026-04-30',
      auditors: '0 Auditors', auditorNames: [], budget: '$36,500', model: 'Thematic',
      company: 'Cygnus Aura', divisionCode: 'AUH-BR', divisionName: 'Abu Dhabi Division',
      subDivisionName: 'Compliance', scopeLevel: 'scope',
      riskRating: 'High', started: false, status: 'Not Started',
      createdAt: '2026-02-01T08:00:00.000Z',
    },
    {
      id: 'MOCK-9003', name: 'Treasury & Liquidity Risk Audit',
      description: 'Review of treasury controls, liquidity buffers and counterparty exposure limits.',
      avatarUrl: 'images/avatars/default-avatar.jpg', timePeriod: '2026-01-15 - 2026-03-15',
      auditors: '0 Auditors', auditorNames: [], budget: '$52,000', model: 'Full',
      company: 'Subsidiary Co.', divisionCode: 'RUH-BR', divisionName: 'Riyadh Division',
      subDivisionName: 'Finance', scopeLevel: 'scope',
      riskRating: 'Critical', started: false, status: 'Not Started',
      createdAt: '2026-01-15T08:00:00.000Z',
    },
    {
      id: 'MOCK-9004', name: 'Data Privacy Impact Assessment',
      description: 'PDPL/GDPR gap assessment for customer data processing across CRM and marketing platforms.',
      avatarUrl: 'images/avatars/default-avatar.jpg', timePeriod: '2026-03-01 - 2026-05-31',
      auditors: '0 Auditors', auditorNames: [], budget: '$29,000', model: 'Limited',
      company: 'Subsidiary Co.', divisionCode: 'SHJ-BR', divisionName: 'Sharjah Division',
      subDivisionName: 'Legal', scopeLevel: 'scope',
      riskRating: 'High', started: false, status: 'Not Started',
      createdAt: '2026-03-01T08:00:00.000Z',
    },
  ];

  // Cached rather than recomputed on every access — this getter used to walk the
  // entire AUDIT_SCOPE_STATIC_COMPANIES tree, build two Maps, and re-sort a fresh
  // array on every read. As a plain getter it re-ran on every Angular change-detection
  // cycle (read from auditorOptions and filteredScopes), the same anti-pattern that
  // caused an out-of-memory crash on the RFI Management pages. refreshScopes()
  // recomputes it only when the underlying static data can actually have changed
  // (init, add/edit scope, activate/deactivate).
  private _allEnrichedScopes: EnrichedScope[] = [];

  private get allEnrichedScopes(): EnrichedScope[] {
    return this._allEnrichedScopes;
  }

  private refreshScopes(): void {
    // const result: EnrichedScope[] = [...this.mockHighRiskScopes];
    const result: EnrichedScope[] = [];
    // Flatten every scope/sub-scope once (keyed by id) so a sub-scope's
    // parent can always be looked up, regardless of division/sub-division bucket.
    const allScopes: {
      scope: StaticScope; company: string; divisionCode: string; divisionName: string; subDivisionName: string | null;
    }[] = [];
    for (const companyRec of AUDIT_SCOPE_STATIC_COMPANIES) {
      for (const division of companyRec.divisions) {
        // Division-level scopes (sit directly under the division).
        for (const scope of division.scopes ?? []) {
          // Skip division-level scopes under a division that has sub-divisions — unless the
          // scope was explicitly added/edited at division level (`hasSubDivision: false`).
          if (division.hasSubDivision && scope.hasSubDivision !== false) continue;
          allScopes.push({
            scope, company: companyRec.id, divisionCode: division.divisionCode,
            divisionName: division.divisionName, subDivisionName: null,
          });
        }
        // Skip leftover sub-division records under a division that has no sub-divisions.
        if (!divisionAllowsSubDivisions(division.divisionCode, companyRec.id)) continue;
        for (const dept of division.subDivisions) {
          for (const scope of dept.scopes) {
            allScopes.push({
              scope, company: companyRec.id, divisionCode: division.divisionCode,
              divisionName: division.divisionName, subDivisionName: dept.subDivisionName,
            });
          }
        }
      }
    }
    const byId = new Map(allScopes.map(e => [e.scope.id, e]));
    const subScopeCounts = new Map<string, number>();
    for (const { scope } of allScopes) {
      if (scope.parentScopeId) {
        subScopeCounts.set(scope.parentScopeId, (subScopeCounts.get(scope.parentScopeId) ?? 0) + 1);
      }
    }

    const riskLabel: Record<string, EnrichedScope['riskRating']> = SCOPE_RISK_RATING_DISPLAY;

    for (const { scope, company, divisionCode, divisionName, subDivisionName } of allScopes) {
      const hours = scope.estimatedHours ?? 0;
      const rate = scope.hourlyRate ?? 0;
      const budget = hours && rate ? `$${(hours * rate).toLocaleString()}` : '—';
      const auditorCount = scope.assignedAuditors?.length ?? 0;
      const auditorNames = this.auditorDisplayNames(scope.assignedAuditors);
      const auditorIds = scope.assignedAuditors ?? [];
      const reviewerIds = scope.assignedReviewers ?? [];

      const started = scope.workflowStatus ? scope.workflowStatus !== ScopeWorkflowStatuses.NotStarted : auditorCount > 0;
      const status = scope.workflowStatus ?? this.deriveStatus(started, scope.endDate);
      const isSubscope = !!scope.parentScopeId;
      const parent = isSubscope ? byId.get(scope.parentScopeId!) : undefined;
      const org = resolveScopeOrgLabels(company, divisionCode, subDivisionName);
      const plan = findAuditPlanForScope(scope.auditPlanId, org.companyName, org.divisionName, subDivisionName);

      result.push({
        id: scope.id,
        name: scope.scopeName,
        description: scope.objective ?? '',
        avatarUrl: SCOPE_DEFAULT_AVATAR,
        timePeriod: `${scope.startDate} - ${scope.endDate}`,
        auditors: scopeAuditorCountLabel(auditorCount),
        auditorNames,
        auditorIds,
        reviewerIds,
        budget,
        model: scope.modeOfAudit,
        subScopeCount: !isSubscope ? (subScopeCounts.get(scope.id) || undefined) : undefined,
        company,
        divisionCode,
        divisionName,
        subDivisionName,
        org,
        scopeLevel: isSubscope ? ScopeLevels.SubScope : ScopeLevels.Scope,
        parentScopeName: isSubscope ? parent?.scope.scopeName : undefined,
        auditPlanName: plan?.planName,
        auditPlanPeriod: plan ? periodLabel(plan) : undefined,
        riskRating: scope.riskRating ? riskLabel[scope.riskRating] : undefined,
        started,
        status,
        createdAt: scope.createdAt,
      });
    }

    // Newest-first: a scope/sub-scope just added via the drawer gets the
    // current timestamp (see upsertStaticScope), so it always sorts to the top.
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this._allEnrichedScopes = result;
  }

  get filteredScopes(): EnrichedScope[] {
    const q = this.searchQuery.toLowerCase().trim();
    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    const depts = this.selectedSubDivisions;
    const auditors = this.selectedAuditors;
    const statuses = this.selectedStatuses;
    const auditorId = this.auditorId;
    const level = this.scopeLevelFilter;
    return this.allEnrichedScopes.filter(s => {
      if (this.highRiskNotStartedOnly && !this.isHighRiskNotStarted(s)) return false;
      if (level && s.scopeLevel !== level) return false;
      if (auditorId &&
          !(s.auditorIds?.includes(auditorId)) &&
          !(s.reviewerIds?.includes(auditorId)) &&
          !s.auditorNames.includes(auditorId.toLowerCase())) return false;
      if (!auditorId && this.teamAuditorIds.length &&
          !this.teamAuditorIds.some(id => s.auditorIds?.includes(id) || s.reviewerIds?.includes(id))) return false;
      if (companies?.length > 0 && !companies.includes(s.company)) return false;
      if (divisions?.length > 0 && !divisions.includes(s.divisionCode)) return false;
      // Division-level scopes have no sub-division, so a sub-division filter excludes them.
      if (depts?.length > 0 && (!s.subDivisionName || !depts.includes(s.subDivisionName))) return false;
      if (auditors?.length > 0 && !s.auditorNames.some(a => auditors.includes(a))) return false;
      if (statuses?.length > 0 && !statuses.includes(s.status ?? '')) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }

    /** Zero-based current page index, derived from firstIndex/pageSize for the shared pagination bar. */
  get currentPage(): number {
    return this.pageSize > 0 ? Math.floor(this.firstIndex / this.pageSize) : 0;
  }

  get pagedScopes(): EnrichedScope[] {
    return this.filteredScopes.slice(this.firstIndex, this.firstIndex + this.pageSize);
  }

  get lastIndex(): number {
    return Math.min(this.firstIndex + this.pageSize, this.filteredScopes.length);
  }

  setViewMode(mode: ScopeViewMode): void {
    this.viewMode = mode;
  }

  onSearch(): void { this.firstIndex = 0; }

  onPageChange(page: number): void {
    this.firstIndex = page * this.pageSize;
  }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.firstIndex = 0;
  }

  async onAddNewScope(): Promise<void> {
    const result = await this.drawer.open<ScopeDrawerResult, ScopeDrawerData>(
      ScopeComponent,
      {
        width: SCOPE_DRAWER.FormWidth,
        styleClass: SCOPE_DRAWER.StyleClass,
        data: { mode: ScopeDrawerModes.Add },
      },
    ).afterClosed;

    if (!result?.scope) return;
    const company = this.companyDataService.getById(result.scope.company);
    upsertStaticScope(result.scope.company, result.scope.divisionCode, result.scope.subDivisionName, result.scope, company ? {
      companyName: company.companyName,
      tag: company.tag,
      color: company.color,
    } : undefined);
    this.refreshScopes();
  }

  viewScope(enriched: EnrichedScope): void {
    const record = findStaticScopeById(enriched.id);
    if (!record) return;

    // `record` is the lighter static shape (audit-scope-static-data.ts), not the
    // original `Scope`/`SubScope` type this drawer is normally fed with — its
    // label/severity mappers use the same value domains so it renders correctly.
    // One shape difference the drawer DOES care about: it expects a scope's
    // sub-scopes nested as `scope.subScopes[]` (with `subScopeName`/`subScopeType`
    // fields), whereas our static data stores them as flat sibling records
    // linked via `parentScopeId` — adapt that here, at the call site, rather
    // than touching the (untouched) drawer itself.
    if (record.parentScopeId) {
      const parent = findStaticScopeById(record.parentScopeId);
      this.drawer.open(ScopeProfileComponent, {
        width: SCOPE_DRAWER.ProfileWidth,
        styleClass: SCOPE_DRAWER.StyleClass,
        data: {
          scope: parent ?? null,
          subscope: { ...record, subScopeName: record.scopeName, subScopeType: record.scopeType },
          parentName: parent?.scopeName,
        } as unknown as ScopeProfileDrawerData,
      });
      return;
    }

    const subScopes = subScopesOf(record.id).map(s => ({
      ...s, subScopeName: s.scopeName, subScopeType: s.scopeType,
    }));
    this.drawer.open(ScopeProfileComponent, {
      width: SCOPE_DRAWER.ProfileWidth,
      styleClass: SCOPE_DRAWER.StyleClass,
      data: { scope: { ...record, subScopes } } as unknown as ScopeProfileDrawerData,
    });
  }

  async editScope(enriched: EnrichedScope): Promise<void> {
    const scope = findStaticScopeById(enriched.id);
    if (!scope) return;

    const result = await this.drawer.open<ScopeDrawerResult, ScopeDrawerData>(
      ScopeComponent,
      {
        width: SCOPE_DRAWER.FormWidth,
        styleClass: SCOPE_DRAWER.StyleClass,
        data: { mode: ScopeDrawerModes.Edit, scope },
      },
    ).afterClosed;

    if (!result?.scopeUpdate) return;
    editStaticScope(enriched.id, result.scopeUpdate);
    this.refreshScopes();
  }

  onCompanyChange(): void {
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.firstIndex = 0;
  }

  onDivisionChange(): void {
    this.selectedSubDivisions = [];
    this.firstIndex = 0;
  }

  onSubDivisionChange(): void { this.firstIndex = 0; }

  onAuditorChange(): void { this.firstIndex = 0; }

  onStatusChange(): void { this.firstIndex = 0; }

  // p-multiselect's clear (×) button only emits `onClear`, not `onChange`, and
  // resets the model to `null` rather than `[]` — reset explicitly and cascade
  // the same way the corresponding onChange handler does.
  onCompanyClear(): void {
    this.selectedCompanies = [];
    this.onCompanyChange();
  }

  onDivisionClear(): void {
    this.selectedDivisions = [];
    this.onDivisionChange();
  }

  onSubDivisionClear(): void {
    this.selectedSubDivisions = [];
    this.onSubDivisionChange();
  }

  onAuditorClear(): void {
    this.selectedAuditors = [];
    this.onAuditorChange();
  }

  onStatusClear(): void {
    this.selectedStatuses = [];
    this.onStatusChange();
  }

  /* ── Popover filter helpers (mirrors evidence-list) ──────────────────────── */
  get hasActiveFilters(): boolean {
    return !!this.searchQuery.trim()
      || this.selectedCompanies?.length > 0
      || this.selectedDivisions?.length > 0
      || this.selectedSubDivisions?.length > 0
      || this.selectedAuditors?.length > 0
      || this.selectedStatuses?.length > 0;
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedCompanies.length)   count++;
    if (this.selectedDivisions?.length)    count++;
    if (this.selectedSubDivisions?.length) count++;
    if (this.selectedAuditors?.length)    count++;
    if (this.selectedStatuses?.length)    count++;
    return count;
  }

  get activeFilterChips(): { key: string; label: string }[] {
    const chips: { key: string; label: string }[] = [];
    const L = SCOPE_FILTER_CHIP_LABELS;
    if (this.selectedCompanies.length)
      chips.push({ key: 'companies',   label: `${L.companies}: ${this.selectedCompanies.length}` });
    if (this.selectedDivisions.length)
      chips.push({ key: 'divisions',    label: `${L.divisions}: ${this.selectedDivisions.length}` });
    if (this.selectedSubDivisions.length)
      chips.push({ key: 'subDivisions', label: `${L.subDivisions}: ${this.selectedSubDivisions.length}` });
    if (this.selectedAuditors.length)
      chips.push({ key: 'auditors',    label: `${L.auditors}: ${this.selectedAuditors.length}` });
    if (this.selectedStatuses.length)
      chips.push({ key: 'statuses',    label: `${L.statuses}: ${this.selectedStatuses.length}` });
    return chips;
  }

  removeFilter(key: string): void {
    switch (key) {
      case 'companies':   this.selectedCompanies = []; this.selectedDivisions = []; this.selectedSubDivisions = []; break;
      case 'divisions':    this.selectedDivisions = []; this.selectedSubDivisions = []; break;
      case 'subDivisions': this.selectedSubDivisions = []; break;
      case 'auditors':    this.selectedAuditors = []; break;
      case 'statuses':    this.selectedStatuses = []; break;
    }
    this.firstIndex = 0;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCompanies = [];
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.selectedAuditors = [];
    this.selectedStatuses = [];
    this.auditorId = null;
    this.scopeLevelFilter = null;
    this.firstIndex = 0;
  }

  /* ── Deactivate / activate ──────────────────────────────────────────────── */
  blockedIds = new Set<string>();
  showConfirmDialog = false;
  confirmTarget: { id: string; name: string } | null = null;

  // Real (static-data-backed) rows persist Activate/Deactivate on the actual
  // record; the dashboard's mock high-risk rows have no backing static record,
  // so they keep falling back to the local `blockedIds` Set as before.
  isBlocked(id: string): boolean {
    const scope = findStaticScopeById(id);
    return scope ? scope.status === ScopeRecordStatuses.Inactive : this.blockedIds.has(id);
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
    const { id } = this.confirmTarget;
    const scope = findStaticScopeById(id);
    if (scope) {
      setScopeStatus(id, scope.status === ScopeRecordStatuses.Inactive ? ScopeRecordStatuses.Active : ScopeRecordStatuses.Inactive);
      this.refreshScopes();
    } else if (this.blockedIds.has(id)) {
      this.blockedIds.delete(id);
    } else {
      this.blockedIds.add(id);
    }
    this.closeConfirm();
  }

  truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }
}
