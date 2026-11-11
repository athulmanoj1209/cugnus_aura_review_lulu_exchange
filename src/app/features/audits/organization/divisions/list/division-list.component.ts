import { Component, OnInit, inject } from '@angular/core';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DivisionComponent } from '@/app/features/audits/organization/divisions/manage/division.component';
import { DivisionProfileComponent } from '@/app/features/audits/organization/divisions/profile/division-profile.component';
import type { DivisionDrawerData, DivisionDrawerResult, DivisionProfileDrawerData } from '../models/division.model';
import type { StaticDivision } from '../models/division-static-data.model';
import type { Division, PersonnelProfile, ReviewerProfile } from '../models/division-list.model';
import {
  DIVISION_STATIC_COMPANIES,
  upsertStaticDivision,
  editStaticDivision,
  setDivisionStatus,
} from '../division-static-data';
import {
  DivisionDrawerModes,
  DivisionStatuses,
  DivisionViewModes,
  type DivisionViewMode,
  DIVISION_DEFAULT_COMPANY_COLOR,
  DIVISION_DRAWER,
  DIVISION_LIST_PAGE_SIZE,
  DIVISION_SAMPLE_DOCUMENT,
} from '../constants/division.constants';
import {
  DIVISION_AUDIT_STATUS_LABELS,
  DIVISION_AUDIT_STATUS_SEVERITY,
  DIVISION_RISK_RATING_SEVERITY,
  DIVISION_STATUS_LABELS,
  DIVISION_TYPE_LABELS,
} from '../constants/division-labels.constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

export const AUDITOR_PROFILES: Record<string, PersonnelProfile> = {
  alice: { id: 'alice', displayName: 'Alice Johnson', role: 'Senior Auditor', experienceYears: 8, expertise: ['Financial Audit', 'IFRS', 'Risk Assessment'], workload: 72, totalAudits: 24, completedAudits: 18 },
  bob: { id: 'bob', displayName: 'Bob Smith', role: 'Internal Auditor', experienceYears: 5, expertise: ['Internal Controls', 'SOX Compliance', 'IT Audit'], workload: 58, totalAudits: 30, completedAudits: 20 },
  carol: { id: 'carol', displayName: 'Carol White', role: 'Audit Manager', experienceYears: 12, expertise: ['AML Compliance', 'Regulatory Review', 'Banking'], workload: 85, totalAudits: 25, completedAudits: 18 },
  david: { id: 'david', displayName: 'David Lee', role: 'Audit Specialist', experienceYears: 6, expertise: ['External Audit', 'SOCPA', 'Assurance'], workload: 45, totalAudits: 29, completedAudits: 23 },
  emma: { id: 'emma', displayName: 'Emma Clarke', role: 'Compliance Auditor', experienceYears: 7, expertise: ['Compliance Audit', 'CBUAE Regulations', 'KYC/AML'], workload: 68, totalAudits: 21, completedAudits: 16 },
  felix: { id: 'felix', displayName: 'Felix Rahman', role: 'IT Auditor', experienceYears: 9, expertise: ['IT General Controls', 'Cybersecurity', 'Data Privacy'], workload: 55, totalAudits: 18, completedAudits: 14 },
  grace: { id: 'grace', displayName: 'Grace Kim', role: 'Risk Auditor', experienceYears: 4, expertise: ['Operational Risk', 'Basel III', 'Market Risk'], workload: 62, totalAudits: 15, completedAudits: 11 },
  henry: { id: 'henry', displayName: 'Henry Patel', role: 'Senior Auditor', experienceYears: 11, expertise: ['Credit Risk', 'Liquidity Audit', 'IFRS 9'], workload: 79, totalAudits: 32, completedAudits: 27 },
  irene: { id: 'irene', displayName: 'Irene Torres', role: 'Audit Associate', experienceYears: 3, expertise: ['Substantive Testing', 'Work Papers', 'Sampling'], workload: 40, totalAudits: 12, completedAudits: 9 },
  james: { id: 'james', displayName: 'James Malik', role: 'External Auditor', experienceYears: 8, expertise: ['External Audit', 'Financial Statements', 'ISA'], workload: 74, totalAudits: 28, completedAudits: 22 },
  karen: { id: 'karen', displayName: 'Karen Osei', role: 'Audit Manager', experienceYears: 13, expertise: ['Portfolio Audit', 'Regulatory Capital', 'ICAAP'], workload: 88, totalAudits: 36, completedAudits: 30 },
  liam: { id: 'liam', displayName: 'Liam Chen', role: 'Forensic Auditor', experienceYears: 6, expertise: ['Forensic Accounting', 'Fraud Detection', 'Litigation'], workload: 60, totalAudits: 17, completedAudits: 13 },
  mia: { id: 'mia', displayName: 'Mia Santos', role: 'Junior Auditor', experienceYears: 2, expertise: ['Analytical Review', 'Bank Reconciliation', 'CAATs'], workload: 35, totalAudits: 8, completedAudits: 5 },
};

export const REVIEWER_PROFILES: Record<string, ReviewerProfile> = {
  'eve-martinez': { id: 'eve-martinez', displayName: 'Eve Martinez', role: 'Quality Reviewer', experienceYears: 10, expertise: ['Quality Assurance', 'IFRS', 'Audit Standards'], workload: 65, totalReviews: 24, completedReviews: 18 },
  'frank-chen': { id: 'frank-chen', displayName: 'Frank Chen', role: 'Senior Reviewer', experienceYears: 15, expertise: ['Risk Management', 'Compliance Review', 'Basel III'], workload: 78, totalReviews: 31, completedReviews: 25 },
  'george-hassan': { id: 'george-hassan', displayName: 'George Hassan', role: 'Compliance Reviewer', experienceYears: 11, expertise: ['AML Compliance', 'Regulatory Review', 'CBUAE'], workload: 72, totalReviews: 28, completedReviews: 22 },
  'helen-park': { id: 'helen-park', displayName: 'Helen Park', role: 'Senior Reviewer', experienceYears: 9, expertise: ['Internal Controls', 'Credit Review', 'ISA Standards'], workload: 60, totalReviews: 19, completedReviews: 15 },
  'ivan-rossi': { id: 'ivan-rossi', displayName: 'Ivan Rossi', role: 'Risk Reviewer', experienceYears: 8, expertise: ['Market Risk', 'Liquidity Risk', 'Stress Testing'], workload: 55, totalReviews: 16, completedReviews: 12 },
  'julia-ahmed': { id: 'julia-ahmed', displayName: 'Julia Ahmed', role: 'Quality Reviewer', experienceYears: 7, expertise: ['IFRS 9', 'Credit Impairment', 'Financial Reporting'], workload: 63, totalReviews: 14, completedReviews: 10 },
  'kevin-tan': { id: 'kevin-tan', displayName: 'Kevin Tan', role: 'Audit Supervisor', experienceYears: 12, expertise: ['Portfolio Review', 'Capital Adequacy', 'Pillar II'], workload: 80, totalReviews: 33, completedReviews: 27 },
  'lisa-kim': { id: 'lisa-kim', displayName: 'Lisa Kim', role: 'Senior Reviewer', experienceYears: 6, expertise: ['Investment Audit', 'Securities Review', 'IFRS 7'], workload: 58, totalReviews: 13, completedReviews: 10 },
  'michael-rao': { id: 'michael-rao', displayName: 'Michael Rao', role: 'Compliance Manager', experienceYears: 14, expertise: ['Compliance Framework', 'Regulatory Capital', 'ICAAP'], workload: 84, totalReviews: 38, completedReviews: 32 },
  'nina-costa': { id: 'nina-costa', displayName: 'Nina Costa', role: 'QA Specialist', experienceYears: 5, expertise: ['Quality Control', 'Work Paper Review', 'Audit Standards'], workload: 48, totalReviews: 11, completedReviews: 8 },
  'omar-sheikh': { id: 'omar-sheikh', displayName: 'Omar Sheikh', role: 'Risk Reviewer', experienceYears: 9, expertise: ['Operational Risk', 'Liquidity Oversight', 'Stress Tests'], workload: 70, totalReviews: 22, completedReviews: 18 },
  'priya-nair': { id: 'priya-nair', displayName: 'Priya Nair', role: 'Audit Reviewer', experienceYears: 6, expertise: ['Credit Approval', 'Loan Review', 'NPL Analysis'], workload: 56, totalReviews: 15, completedReviews: 11 },
  'rachel-wu': { id: 'rachel-wu', displayName: 'Rachel Wu', role: 'Senior QA Reviewer', experienceYears: 10, expertise: ['Financial Instruments', 'Collateral Review', 'IFRS 13'], workload: 67, totalReviews: 26, completedReviews: 20 },
  alice: { id: 'alice', displayName: 'Alice Johnson', role: 'Peer Reviewer', experienceYears: 8, expertise: ['Financial Audit', 'IFRS', 'Risk Assessment'], workload: 72, totalReviews: 16, completedReviews: 14 },
  bob: { id: 'bob', displayName: 'Bob Smith', role: 'QA Reviewer', experienceYears: 5, expertise: ['Internal Controls', 'SOX Compliance', 'IT Audit'], workload: 60, totalReviews: 12, completedReviews: 9 },
};

@Component({
  selector: 'app-division-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    PaginatorModule,
    TagModule,
    TooltipModule,
    DividerModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './division-list.component.html',
  styleUrl: './division-list.component.scss',
})
export class DivisionListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  searchQuery = '';
  selectedCompanies: string[] = [];
  currentPage = 0;
  PAGE_SIZE = DIVISION_LIST_PAGE_SIZE;
  viewMode: DivisionViewMode = DivisionViewModes.Grid;

  // Exposed for the template.
  readonly DivisionStatuses = DivisionStatuses;
  readonly DivisionViewModes = DivisionViewModes;
  readonly divisionStatusLabels = DIVISION_STATUS_LABELS;

  get companyFilterOptions() {
    return this.companyDataService.all
      .filter(c => !c.blocked)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  readonly FILE_URL = DIVISION_SAMPLE_DOCUMENT.Url;
  readonly FILE_NAME = DIVISION_SAMPLE_DOCUMENT.FileName;

  // Kept for the 9 other pages (client-org-chart, audit-plan, rfi-management*,
  // scope-list, company-list) that still read the JSON-backed `DivisionListComponent.ALL`/
  // `DivisionListComponent.ALL_DIVISIONS` — this page no longer uses either, it's fully self-contained
  // via division-static-data.ts instead.
  static ALL: any[] = [];

  static get ALL_DIVISIONS(): Division[] {
    return DivisionListComponent.ALL.filter(Boolean).flatMap((c: any) => c.divisions ?? []);
  }

  private get allDivisions(): (StaticDivision & { company: string })[] {
    return DIVISION_STATIC_COMPANIES.flatMap(c => c.divisions);
  }

  /** Today as `YYYY-MM-DD`, for comparing against license expiry dates in the template. */
  readonly todayIso = new Date().toISOString().slice(0, 10);

  filteredDivisions: StaticDivision[] = [];
  pagedDivisions: StaticDivision[] = [];

  readonly divisionTypeMap = DIVISION_TYPE_LABELS;

  readonly riskRatingSeverity = DIVISION_RISK_RATING_SEVERITY;

  readonly auditStatusSeverity = DIVISION_AUDIT_STATUS_SEVERITY;

  readonly auditStatusLabel = DIVISION_AUDIT_STATUS_LABELS;

  Math = Math;

  ngOnInit(): void {
    this.applyFilters();
  }

  setViewMode(mode: DivisionViewMode): void {
    this.viewMode = mode;
  }

  async addNewDivision(): Promise<void> {
    const result = await this.drawer.open<DivisionDrawerResult, DivisionDrawerData>(DivisionComponent, {
      width: DIVISION_DRAWER.FormWidth,
      styleClass: DIVISION_DRAWER.StyleClass,
      data: { mode: DivisionDrawerModes.Add },
    }).afterClosed;

    if (!result?.division) return;
    const company = this.companyDataService.getById(result.division.company);
    upsertStaticDivision(result.division.company, result.division, company ? {
      companyName: company.companyName,
      tag: company.tag,
      color: company.color,
      industry: company.industry,
    } : undefined);
    this.applyFilters();
  }

  viewDivision(division: StaticDivision): void {
    this.drawer.open(DivisionProfileComponent, {
      width: DIVISION_DRAWER.ProfileWidth,
      styleClass: DIVISION_DRAWER.StyleClass,
      // `division` is the lighter static shape (division-static-data.ts), not the original
      // `Division` type this drawer is normally fed with — its label/severity mappers use
      // the same value domains so it renders correctly regardless.
      data: { division } as unknown as DivisionProfileDrawerData,
    });
  }

  async editDivision(division: StaticDivision): Promise<void> {
    const result = await this.drawer.open<DivisionDrawerResult, DivisionDrawerData>(DivisionComponent, {
      width: DIVISION_DRAWER.FormWidth,
      styleClass: DIVISION_DRAWER.StyleClass,
      data: { mode: DivisionDrawerModes.Edit, division },
    }).afterClosed;

    if (!result?.divisionUpdate) return;
    editStaticDivision(division.divisionCode, result.divisionUpdate);
    this.applyFilters();
  }

  /* ── Deactivate / activate ──────────────────────────────────────────────── */
  showConfirmDialog = false;
  confirmTarget: StaticDivision | null = null;

  isBlocked(status: string): boolean {
    return status !== DivisionStatuses.Active;
  }

  openConfirm(division: StaticDivision): void {
    this.confirmTarget = division;
    this.showConfirmDialog = true;
  }

  closeConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmTarget = null;
  }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    setDivisionStatus(this.confirmTarget.divisionCode, this.isBlocked(this.confirmTarget.status) ? DivisionStatuses.Active : DivisionStatuses.Inactive);
    this.closeConfirm();
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onCompanyFilter(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  // p-multiselect's clear (×) button only emits `onClear`, not `onChange`, and
  // resets the model to `null` rather than `[]` — reset explicitly and re-apply.
  onCompanyFilterClear(): void {
    this.selectedCompanies = [];
    this.onCompanyFilter();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }

  onRowsChange(rows: number): void {
    this.PAGE_SIZE = rows;
    this.currentPage = 0;
    this.updatePage();
  }

  private applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredDivisions = this.allDivisions.filter(b => {
      const matchesSearch = !query ||
        b.divisionName.toLowerCase().includes(query) ||
        b.divisionCode.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.contactEmail.toLowerCase().includes(query);
      const matchesCompany = !this.selectedCompanies.length ||
        this.selectedCompanies.includes(b.company);
      return matchesSearch && matchesCompany;
    });
    // Newest-first: a division just added via the drawer gets the current
    // timestamp (see upsertStaticDivision), so it always sorts to the top.
    this.filteredDivisions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.updatePage();
  }

  private updatePage(): void {
    const start = this.currentPage * this.PAGE_SIZE;
    this.pagedDivisions = this.filteredDivisions.slice(start, start + this.PAGE_SIZE);
  }

  getCompanyLabel(val: string): string {
    return DIVISION_STATIC_COMPANIES.find(c => c.id === val)?.companyName ?? val;
  }

  getCompanyTag(val: string): string {
    return DIVISION_STATIC_COMPANIES.find(c => c.id === val)?.tag ?? val.toUpperCase();
  }

  getCompanyColor(val: string): string {
    return DIVISION_STATIC_COMPANIES.find(c => c.id === val)?.color ?? DIVISION_DEFAULT_COMPANY_COLOR;
  }
}
