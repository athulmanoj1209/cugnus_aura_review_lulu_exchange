import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FilterModalComponent } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { ScopeComponent } from '@/app/features/audits/audit-plan/scope/manage/scope.component';
import type { ScopeDrawerData, ScopeDrawerResult } from '@/app/features/audits/audit-plan/scope/models/scope.model';
import { setScopeWorkflowStatus, AUDIT_SCOPE_STATIC_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { noSubDivisionMessage } from '@/app/shared/utils/no-sub-division-message';
import { deriveScopeRequests, toScopeWorkflowStatus } from '../scope-request-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { ScopeRequest, ScopeRequestType, ScopeRequestStatus, RiskLevel } from '../models/scope-request.model';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import {
  SCOPE_FORM_TABS,
  ScopeApprovalActions,
  ScopeDrawerModes,
} from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_REQUEST_DEFAULT_SORT_COLUMN,
  SCOPE_REQUEST_DRAWER,
  SCOPE_REQUEST_EMPTY_VALUE,
  SCOPE_REQUEST_PAGE_SIZE,
  ScopeRequestRiskLevels,
  ScopeRequestSortDirections,
  ScopeRequestStatuses,
  ScopeRequestTypes,
  ScopeRequestViewModes,
  type ScopeRequestSortDirection,
  type ScopeRequestViewMode,
} from '../constants/scope-request.constants';
import {
  SCOPE_REQUEST_SORT_ICONS,
  SCOPE_REQUEST_TYPE_DEFAULT_ICON,
  SCOPE_REQUEST_TYPE_ICONS,
} from '../constants/scope-request-labels.constants';

@Component({
  selector: 'app-scope-request-list',
  imports: [CommonModule, FormsModule, InputTextModule, TooltipModule, FilterModalComponent, PaginationBarComponent, DrawIconComponent],
  templateUrl: './scope-request-list.component.html',
  styleUrl: './scope-request-list.component.scss',
})
export class ScopeRequestListComponent {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  readonly ScopeRequestViewModes = ScopeRequestViewModes;
  readonly ScopeRequestTypes = ScopeRequestTypes;
  readonly EMPTY_VALUE = SCOPE_REQUEST_EMPTY_VALUE;

  pageSize = SCOPE_REQUEST_PAGE_SIZE;

  readonly typeOptions = [
    { label: $localize`:@@common.scope:Scope`, value: ScopeRequestTypes.Scope },
    { label: $localize`:@@common.subscope:Subscope`, value: ScopeRequestTypes.Subscope }
  ];

  readonly riskOptions = [
    { label: $localize`:@@common.low:Low`, value: ScopeRequestRiskLevels.Low },
    { label: $localize`:@@common.medium:Medium`, value: ScopeRequestRiskLevels.Medium },
    { label: $localize`:@@common.high:High`, value: ScopeRequestRiskLevels.High }
  ];

  readonly statusOptions = [
    { label: $localize`:@@common.pendingReview:Pending Review`, value: ScopeRequestStatuses.PendingReview },
    { label: $localize`:@@common.rejected:Rejected`, value: ScopeRequestStatuses.Rejected },
    { label: $localize`:@@common.approved:Approved`, value: ScopeRequestStatuses.Approved }
  ];

  searchQuery         = signal('');
  selectedTypes       = signal<string[]>([]);
  selectedRisks       = signal<string[]>([]);
  selectedStatuses    = signal<string[]>([]);
  selectedCompanies   = signal<string[]>([]);
  selectedDivisions    = signal<string[]>([]);
  selectedSubDivisions = signal<string[]>([]);
  selectedCreatedBy   = signal<string[]>([]);
  viewMode    = signal<ScopeRequestViewMode>(ScopeRequestViewModes.Grid);
  sortColumn  = signal(SCOPE_REQUEST_DEFAULT_SORT_COLUMN);
  sortDir     = signal<ScopeRequestSortDirection>(ScopeRequestSortDirections.Asc);
  currentPage = signal(1);

  readonly ALL_REQUESTS = signal<ScopeRequest[]>(deriveScopeRequests());
  readonly divisionLabel = $localize`:@@common.division:Division`;
  readonly subDivisionLabel = $localize`:@@common.subDivision:Sub-Division`;

  /** Re-derives the queue from the live source records — call after any approve/reject. */
  private refresh(): void {
    this.ALL_REQUESTS.set(deriveScopeRequests());
  }

  /** Active (non-blocked) company names, cross-referenced from AUDIT_SCOPE_STATIC_COMPANIES's own id via CompanyDataService. */
  private readonly activeCompanyNames = computed(() => {
    const names = new Set<string>();
    for (const company of AUDIT_SCOPE_STATIC_COMPANIES) {
      if (!this.companyDataService.isCompanyBlocked(company.id)) names.add(company.companyName);
    }
    return names;
  });

  /** Active division names — own status active AND parent company not blocked, matched by division name (this module carries no division codes). */
  private readonly activeDivisionNames = computed(() => {
    const names = new Set<string>();
    for (const company of DIVISION_STATIC_COMPANIES) {
      if (this.companyDataService.isCompanyBlocked(company.id)) continue;
      for (const division of company.divisions) {
        if (division.status === DivisionStatuses.Active) names.add(division.divisionName);
      }
    }
    return names;
  });

  /** Active sub-division names — own status active only, matched by sub-division name. */
  private readonly activeSubDivisionNames = computed(() => {
    const names = new Set<string>();
    for (const company of SUB_DIVISION_STATIC_COMPANIES) {
      for (const division of company.divisions) {
        for (const dept of division.subDivisions) {
          if (dept.status === SubDivisionStatuses.Active) names.add(dept.subDivisionName);
        }
      }
    }
    return names;
  });

  readonly companyOptions = computed(() => {
    const active = this.activeCompanyNames();
    return [...new Set(this.ALL_REQUESTS().map(r => r.company).filter(v => active.has(v)))].sort().map(v => ({ label: v, value: v }));
  });

  readonly divisionOptions = computed(() => {
    const active = this.activeDivisionNames();
    return [...new Set(this.ALL_REQUESTS().map(r => r.division).filter(v => active.has(v)))].sort().map(v => ({ label: v, value: v }));
  });

  readonly subDivisionOptions = computed(() => {
    const active = this.activeSubDivisionNames();
    return [...new Set(this.ALL_REQUESTS().map(r => r.subDivision).filter(v => active.has(v)))].sort().map(v => ({ label: v, value: v }));
  });

  /** Set when the selected divisions have no sub-divisions — disables the Sub-Division filter. */
  readonly subDivisionDisabledMessage = computed(() => noSubDivisionMessage(this.selectedDivisions()));

  readonly createdByOptions = computed(() =>
    [...new Set(this.ALL_REQUESTS().map(r => r.submittedBy))].sort().map(v => ({ label: v, value: v }))
  );

  filtered = computed(() => {
    const q           = this.searchQuery().toLowerCase();
    const types       = this.selectedTypes();
    const risks       = this.selectedRisks();
    const statuses    = this.selectedStatuses();
    const companies   = this.selectedCompanies();
    const divisions    = this.selectedDivisions();
    const subDivisions = this.selectedSubDivisions();
    const createdBy   = this.selectedCreatedBy();
    const col = this.sortColumn();
    const dir = this.sortDir();

    let result = this.ALL_REQUESTS().filter(r => {
      if (q && !r.id.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q) && !r.submittedBy.toLowerCase().includes(q)) return false;
      if (types.length       && !types.includes(r.type))           return false;
      if (risks.length       && !risks.includes(r.risk))           return false;
      if (statuses.length    && !statuses.includes(r.status))      return false;
      if (companies.length   && !companies.includes(r.company))    return false;
      if (divisions.length    && !divisions.includes(r.division))      return false;
      if (subDivisions.length && !subDivisions.includes(r.subDivision)) return false;
      if (createdBy.length   && !createdBy.includes(r.submittedBy)) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const av = (a as any)[col] ?? '';
      const bv = (b as any)[col] ?? '';
      return dir === ScopeRequestSortDirections.Asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

    return result;
  });

  paginated = computed(() => {
    const page = this.currentPage();
    return this.filtered().slice((page - 1) * this.pageSize, page * this.pageSize);
  });

  totalPending     = computed(() => this.ALL_REQUESTS().length);
  scopesCount      = computed(() => this.ALL_REQUESTS().filter(r => r.type === ScopeRequestTypes.Scope).length);
  subscopesCount   = computed(() => this.ALL_REQUESTS().filter(r => r.type === ScopeRequestTypes.Subscope).length);
  // Division-level requests carry subDivision '—' — not a sub-division, so not counted.
  subDivisionsCount = computed(() => new Set(this.ALL_REQUESTS().map(r => r.subDivision).filter(v => v !== SCOPE_REQUEST_EMPTY_VALUE)).size);
  criticalCount    = computed(() => this.ALL_REQUESTS().filter(r => r.risk === ScopeRequestRiskLevels.High).length);

  hasFilters = computed(() =>
    !!this.searchQuery()
    || !!this.selectedTypes().length
    || !!this.selectedRisks().length
    || !!this.selectedStatuses().length
    || !!this.selectedCompanies().length
    || !!this.selectedDivisions().length
    || !!this.selectedSubDivisions().length
    || !!this.selectedCreatedBy().length
  );

  onSearch(q: string)            { this.searchQuery.set(q);            this.currentPage.set(1); }
  onTypes(v: string[])           { this.selectedTypes.set(v);          this.currentPage.set(1); }
  onRisks(v: string[])           { this.selectedRisks.set(v);          this.currentPage.set(1); }
  onStatuses(v: string[])        { this.selectedStatuses.set(v);       this.currentPage.set(1); }
  onCompanies(v: string[])       { this.selectedCompanies.set(v);      this.currentPage.set(1); }
  onDivisions(v: string[]) {
    this.selectedDivisions.set(v);
    if (noSubDivisionMessage(v)) this.selectedSubDivisions.set([]);
    this.currentPage.set(1);
  }
  onSubDivisions(v: string[])     { this.selectedSubDivisions.set(v);    this.currentPage.set(1); }
  onCreatedBy(v: string[])       { this.selectedCreatedBy.set(v);      this.currentPage.set(1); }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedTypes.set([]);
    this.selectedRisks.set([]);
    this.selectedStatuses.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedCreatedBy.set([]);
    this.currentPage.set(1);
  }

  setViewMode(mode: ScopeRequestViewMode) { this.viewMode.set(mode); this.currentPage.set(1); }

  onSort(col: string) {
    if (this.sortColumn() === col) {
      this.sortDir.set(this.sortDir() === ScopeRequestSortDirections.Asc ? ScopeRequestSortDirections.Desc : ScopeRequestSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDir.set(ScopeRequestSortDirections.Asc);
    }
  }

  sortIconFor(col: string): string {
    if (this.sortColumn() !== col) return SCOPE_REQUEST_SORT_ICONS.Unsorted;
    return this.sortDir() === ScopeRequestSortDirections.Asc ? SCOPE_REQUEST_SORT_ICONS.Asc : SCOPE_REQUEST_SORT_ICONS.Desc;
  }

  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.currentPage.set(1);
  }

  statusLabel(s: ScopeRequestStatus): string {
    const map: Record<string, string> = {
      pending_review: $localize`:@@common.pendingReview:Pending Review`,
      rejected: $localize`:@@common.rejected:Rejected`,
      approved: $localize`:@@common.approved:Approved`,
    };
    return map[s] ?? s;
  }

  riskLabel(r: RiskLevel): string {
    const map: Record<string, string> = { 
      low: $localize`:@@common.low:Low`,
      medium: $localize`:@@common.medium:Medium`,
      high: $localize`:@@common.high:High`,
     };
    return map[r] ?? r;
  }

  typeIcon(type: ScopeRequestType): string {
    return SCOPE_REQUEST_TYPE_ICONS[type] ?? SCOPE_REQUEST_TYPE_DEFAULT_ICON;
  }

  typeLabel(type: ScopeRequestType): string {
    const map: Record<ScopeRequestType, string> = {
      Scope: $localize`:@@common.scope:Scope`,
      Subscope: $localize`:@@common.subscope:Subscope`,
    };

    return map[type];
  }

  isOverdue(r: ScopeRequest): boolean {
    if (!r.dueDate) return false;
    return new Date(r.dueDate) < new Date();
  }

  async onView(r: ScopeRequest): Promise<void> {
  
    const ref = this.drawer.open<ScopeDrawerResult, ScopeDrawerData>(
      ScopeComponent,
      {
        width: SCOPE_REQUEST_DRAWER.Width,
        styleClass: SCOPE_REQUEST_DRAWER.StyleClass,
        data: { mode: ScopeDrawerModes.Edit, approvalMode: true, requestStatus: r.status, scope: r.scopePayload, initialTab: SCOPE_FORM_TABS.Details },
      },
    );
    const result = await ref.afterClosed;
    if (result?.approval) {
      const newStatus = result.approval.action === ScopeApprovalActions.Approve ? ScopeRequestStatuses.Approved : ScopeRequestStatuses.Rejected;
      setScopeWorkflowStatus(r.id, toScopeWorkflowStatus(newStatus));
      this.refresh();
    }
  }
}