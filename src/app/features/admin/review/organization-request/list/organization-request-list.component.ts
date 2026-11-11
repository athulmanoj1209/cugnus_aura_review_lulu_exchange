import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FilterModalComponent } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { AddCompanyModalComponent } from '@/app/features/audits/organization/company/manage/company.component';
import type { AddCompanyDrawerData, CompanyFormModel } from '@/app/features/audits/organization/company/manage/company.component';
import { DivisionComponent } from '@/app/features/audits/organization/divisions/manage/division.component';
import type { DivisionDrawerData, DivisionDrawerResult } from '@/app/features/audits/organization/divisions/models/division.model';
import { setDivisionAuditStatus, DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SubDivisionComponent } from '@/app/features/audits/organization/sub-divisions/manage/sub-division.component';
import type { SubDivisionDrawerData, SubDivisionDrawerResult } from '@/app/features/audits/organization/sub-divisions/models/sub-division.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { setSubDivisionAuditStatus, SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { noSubDivisionMessage } from '@/app/shared/utils/no-sub-division-message';
import { deriveOrganizationRequests } from '../organization-request-static-data';
import type { OrgRequest, OrgRequestType, OrgRequestStatus, RiskLevel } from '../models/organization-request.model';
import { CompanyApprovalActions, CompanyDrawerTypes, CompanyOrgStatuses } from '@/app/features/audits/organization/company/constants/company.constants';
import {
  DivisionApprovalActions,
  DivisionAuditStatuses,
  DivisionDrawerModes,
  DivisionStatuses,
} from '@/app/features/audits/organization/divisions/constants/division.constants';
import {
  SubDivisionApprovalActions,
  SubDivisionAuditStatuses,
  SubDivisionDrawerModes,
  SubDivisionStatuses,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import {
  ORG_REQUEST_DEFAULT_SORT_COLUMN,
  ORG_REQUEST_DRAWER,
  ORG_REQUEST_EMPTY_VALUE,
  ORG_REQUEST_PAGE_SIZE,
  OrgRequestRiskLevels,
  OrgRequestSortDirections,
  OrgRequestStatuses,
  OrgRequestTypes,
  OrgRequestViewModes,
  type OrgRequestSortDirection,
  type OrgRequestViewMode,
} from '../constants/organization-request.constants';
import {
  ORG_REQUEST_SORT_ICONS,
  ORG_REQUEST_TYPE_DEFAULT_ICON,
  ORG_REQUEST_TYPE_ICONS,
} from '../constants/organization-request-labels.constants';

@Component({
  selector: 'app-organization-request-list',
  imports: [CommonModule, FormsModule, InputTextModule, TooltipModule, FilterModalComponent, PaginationBarComponent, DrawIconComponent],
  templateUrl: './organization-request-list.component.html',
  styleUrl: './organization-request-list.component.scss',
})
export class OrganizationRequestListComponent {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  readonly OrgRequestViewModes = OrgRequestViewModes;

  pageSize = ORG_REQUEST_PAGE_SIZE;

  readonly typeOptions = [
    { label: $localize`:@@common.company:Company`, value: OrgRequestTypes.Company },
    { label: $localize`:@@common.division:Division`, value: OrgRequestTypes.Division },
    { label: $localize`:@@common.subDivision:Sub-Division`, value: OrgRequestTypes.SubDivision }
  ];

  readonly riskOptions = [
    { label: $localize`:@@common.low:Low`, value: OrgRequestRiskLevels.Low },
    { label: $localize`:@@common.medium:Medium`, value: OrgRequestRiskLevels.Medium },
    { label: $localize`:@@common.high:High`, value: OrgRequestRiskLevels.High }
  ];

  readonly statusOptions = [
    { label: $localize`:@@common.pendingReview:Pending Review`, value: OrgRequestStatuses.PendingReview },
    { label: $localize`:@@common.rejected:Rejected`, value: OrgRequestStatuses.Rejected },
    { label: $localize`:@@common.approved:Approved`, value: OrgRequestStatuses.Approved }
  ];

  searchQuery         = signal('');
  selectedTypes       = signal<string[]>([]);
  selectedRisks       = signal<string[]>([]);
  selectedStatuses    = signal<string[]>([]);
  selectedCompanies   = signal<string[]>([]);
  selectedDivisions    = signal<string[]>([]);
  selectedSubDivisions = signal<string[]>([]);
  selectedCreatedBy   = signal<string[]>([]);
  viewMode    = signal<OrgRequestViewMode>(OrgRequestViewModes.Grid);
  sortColumn  = signal(ORG_REQUEST_DEFAULT_SORT_COLUMN);
  sortDir     = signal<OrgRequestSortDirection>(OrgRequestSortDirections.Asc);
  currentPage = signal(1);

  readonly allRequests = signal<OrgRequest[]>(deriveOrganizationRequests(this.companyDataService.all));

  /** Re-derives the queue from the live source records — call after any approve/reject. */
  private refresh(): void {
    this.allRequests.set(deriveOrganizationRequests(this.companyDataService.all));
  }

  /**
   * Normalizes the still-pending state for display/filtering: sub-divisions
   * store `pending_approval` (to avoid colliding with their pre-existing
   * `pending` status) while every other module uses `pending_review` — both
   * render as the same "Pending Review" chip/filter here. Divisions store an
   * approved division's audit status as `not_planned` rather than `approved`
   * — both render as the same "Approved" chip/filter here.
   */
  displayStatus(r: OrgRequest): 'pending_review' | 'approved' | 'rejected' {
    const status = r.status;
    if (status === OrgRequestStatuses.PendingApproval) return OrgRequestStatuses.PendingReview;
    if (status === OrgRequestStatuses.NotPlanned) return OrgRequestStatuses.Approved;
    return status;
  }

  /** Active (non-blocked) company names, used to exclude deactivated companies from companyOptions. */
  private readonly activeCompanyNames = computed(() =>
    new Set(this.companyDataService.all.filter(c => !c.blocked).map(c => c.companyName))
  );

  /** Active division names — own status active AND parent company not blocked. */
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

  /** Active sub-division names — own status active only, no ancestor cascade. */
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
    return [...new Set(this.allRequests().map(r => r.company).filter(v => v !== ORG_REQUEST_EMPTY_VALUE && active.has(v)))].sort()
      .map(v => ({ label: v, value: v }));
  });

  readonly divisionOptions = computed(() => {
    const active = this.activeDivisionNames();
    return [...new Set(this.allRequests().map(r => r.division).filter(v => v !== ORG_REQUEST_EMPTY_VALUE && active.has(v)))].sort()
      .map(v => ({ label: v, value: v }));
  });

  readonly subDivisionOptions = computed(() => {
    const active = this.activeSubDivisionNames();
    return [...new Set(this.allRequests().map(r => r.subDivision).filter(v => v !== ORG_REQUEST_EMPTY_VALUE && active.has(v)))].sort()
      .map(v => ({ label: v, value: v }));
  });

  /** Set when the selected divisions have no sub-divisions — disables the Sub-Division filter. */
  readonly subDivisionDisabledMessage = computed(() => noSubDivisionMessage(this.selectedDivisions()));

  readonly createdByOptions = computed(() =>
    [...new Set(this.allRequests().map(r => r.submittedBy).filter(v => v !== ORG_REQUEST_EMPTY_VALUE))].sort()
      .map(v => ({ label: v, value: v }))
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

    let result = this.allRequests().filter(r => {
      if (q && !r.id.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q) && !r.submittedBy.toLowerCase().includes(q)) return false;
      if (types.length       && !types.includes(r.type))                    return false;
      if (risks.length       && !risks.includes(r.risk))                    return false;
      if (statuses.length    && !statuses.includes(this.displayStatus(r)))  return false;
      if (companies.length   && !companies.includes(r.company))             return false;
      if (divisions.length    && !divisions.includes(r.division))               return false;
      if (subDivisions.length && !subDivisions.includes(r.subDivision))       return false;
      if (createdBy.length   && !createdBy.includes(r.submittedBy))        return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const av = (a as any)[col] ?? '';
      const bv = (b as any)[col] ?? '';
      return dir === OrgRequestSortDirections.Asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

    return result;
  });

  paginated = computed(() => {
    const page = this.currentPage();
    return this.filtered().slice((page - 1) * this.pageSize, page * this.pageSize);
  });

  totalPending     = computed(() => this.allRequests().length);
  companiesCount   = computed(() => this.allRequests().filter(r => r.type === OrgRequestTypes.Company).length);
  divisionsCount    = computed(() => this.allRequests().filter(r => r.type === OrgRequestTypes.Division).length);
  subDivisionsCount = computed(() => this.allRequests().filter(r => r.type === OrgRequestTypes.SubDivision).length);
  criticalCount    = computed(() => this.allRequests().filter(r => r.risk === OrgRequestRiskLevels.High).length);

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

  onSearch(q: string)        { this.searchQuery.set(q);         this.currentPage.set(1); }
  onTypes(v: string[])       { this.selectedTypes.set(v);       this.currentPage.set(1); }
  onRisks(v: string[])       { this.selectedRisks.set(v);       this.currentPage.set(1); }
  onStatuses(v: string[])    { this.selectedStatuses.set(v);    this.currentPage.set(1); }
  onCompanies(v: string[])   { this.selectedCompanies.set(v);   this.currentPage.set(1); }
  onDivisions(v: string[]) {
    this.selectedDivisions.set(v);
    if (noSubDivisionMessage(v)) this.selectedSubDivisions.set([]);
    this.currentPage.set(1);
  }
  onSubDivisions(v: string[]) { this.selectedSubDivisions.set(v); this.currentPage.set(1); }
  onCreatedBy(v: string[])   { this.selectedCreatedBy.set(v);   this.currentPage.set(1); }

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

  setViewMode(mode: OrgRequestViewMode) { this.viewMode.set(mode); this.currentPage.set(1); }

  onSort(col: string) {
    if (this.sortColumn() === col) {
      this.sortDir.set(this.sortDir() === OrgRequestSortDirections.Asc ? OrgRequestSortDirections.Desc : OrgRequestSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDir.set(OrgRequestSortDirections.Asc);
    }
  }

  sortIconFor(col: string): string {
    if (this.sortColumn() !== col) return ORG_REQUEST_SORT_ICONS.Unsorted;
    return this.sortDir() === OrgRequestSortDirections.Asc ? ORG_REQUEST_SORT_ICONS.Asc : ORG_REQUEST_SORT_ICONS.Desc;
  }

  onPageChange(page: number): void { this.currentPage.set(page + 1); }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.currentPage.set(1);
  }

  trackById(_: number, r: OrgRequest) { return r.id; }

  statusLabel(s: OrgRequestStatus): string {
    const map: Record<string, string> = {
      pending_review: $localize`:@@common.pendingReview:Pending Review`,
      pending_approval: $localize`:@@common.pendingReview:Pending Review`,
      rejected: $localize`:@@common.rejected:Rejected`,
      approved: $localize`:@@common.approved:Approved`,
      not_planned: $localize`:@@common.approved:Approved`,
    };
    return map[s] ?? s;
  }

  riskLabel(r: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      low: $localize`:@@common.low:Low`,
      medium: $localize`:@@common.medium:Medium`,
      high: $localize`:@@common.high:High`,
    };
    return map[r] ?? r;
  }

  typeIcon(type: OrgRequestType): string {
    return ORG_REQUEST_TYPE_ICONS[type] ?? ORG_REQUEST_TYPE_DEFAULT_ICON;
  }

  typeLabel(type: OrgRequestType): string {
    const map: Record<OrgRequestType, string> = {
      Company: $localize`:@@common.company:Company`,
      Division: $localize`:@@common.division:Division`,
      'Sub-Division': $localize`:@@common.subDivision:Sub-Division`,
    };
    return map[type];
  }

  async onView(r: OrgRequest): Promise<void> {
    if (r.type === OrgRequestTypes.Company) {
      const companyData: CompanyFormModel = { companyName: r.name };
      const ref = this.drawer.open<CompanyFormModel, AddCompanyDrawerData>(
        AddCompanyModalComponent,
        {
          width: ORG_REQUEST_DRAWER.CompanyWidth,
          styleClass: ORG_REQUEST_DRAWER.StyleClass,
          data: { existing: companyData, type: CompanyDrawerTypes.Edit, approvalMode: true, requestStatus: this.displayStatus(r) },
        },
      );
      const result = await ref.afterClosed;
      if (result?.approval) {
        this.companyDataService.setOrgStatus(r.id, result.approval.action === CompanyApprovalActions.Approve ? CompanyOrgStatuses.Approved : CompanyOrgStatuses.Rejected);
        this.refresh();
      }
    } else if (r.type === OrgRequestTypes.Division) {
      const divisionData = { ...(r.divisionPayload as Record<string, any> ?? {}), divisionName: r.name };
      const ref = this.drawer.open<DivisionDrawerResult, DivisionDrawerData>(
        DivisionComponent,
        {
          width: ORG_REQUEST_DRAWER.DivisionWidth,
          styleClass: ORG_REQUEST_DRAWER.StyleClass,
          data: { mode: DivisionDrawerModes.Edit, division: divisionData, approvalMode: true, requestStatus: this.displayStatus(r) },
        },
      );
      const result = await ref.afterClosed;
      if (result?.approval) {
        // A division's "approved" state is stored as `not_planned` (its audit
        // just hasn't been scheduled yet) — see displayStatus() above.
        setDivisionAuditStatus(r.id, result.approval.action === DivisionApprovalActions.Approve ? DivisionAuditStatuses.NotPlanned : DivisionAuditStatuses.Rejected);
        this.refresh();
      }
    } else {
      const subDivisionData = { ...(r.subDivisionPayload as Record<string, any> ?? {}), subDivisionName: r.name };
      const ref = this.drawer.open<SubDivisionDrawerResult, SubDivisionDrawerData>(
        SubDivisionComponent,
        {
          width: ORG_REQUEST_DRAWER.SubDivisionWidth,
          styleClass: ORG_REQUEST_DRAWER.StyleClass,
          data: { mode: SubDivisionDrawerModes.Edit, subDivision: subDivisionData as any, approvalMode: true, requestStatus: this.displayStatus(r) },
        },
      );
      const result = await ref.afterClosed;
      if (result?.approval) {
        setSubDivisionAuditStatus(r.id, result.approval.action === SubDivisionApprovalActions.Approve ? SubDivisionAuditStatuses.Approved : SubDivisionAuditStatuses.Rejected);
        this.refresh();
      }
    }
  }
}
