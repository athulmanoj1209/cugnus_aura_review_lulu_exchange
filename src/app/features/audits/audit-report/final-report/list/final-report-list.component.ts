import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { FilterModalComponent, FilterOption } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { FinalReportComponent } from '@/app/features/audits/audit-report/final-report/manage/final-report.component';
import { REPORT_TEMPLATES } from '@/app/features/audits/audit-report/report-template/list/report-template-list.component';
import { FinalReportProfileComponent } from '@/app/features/audits/audit-report/final-report/profile/final-report-profile.component';
import type { FinalReportDrawerData, FinalReportResult, FinalReportProfileDrawerData } from '../models/final-report.model';
import type { AuditType, ReportPeriod, ReportStatus } from '../models/final-report-static-data.model';
import type { AuditReportEntry } from '../models/final-report-list.model';
import {
  RAW_AUDIT_REPORTS_FLAT,
  REPORTS_LIST_COMPANY_LOOKUP,
} from '../reports-lists-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { ReportTemplateStatuses } from '@/app/features/audits/audit-report/report-template/constants/report-template.constants';
import {
  FINAL_REPORT_DEFAULT_COMPANY_COLOR,
  FINAL_REPORT_DRAWER,
  FINAL_REPORT_ID_PREFIX,
  FINAL_REPORT_ID_RANDOM,
  FINAL_REPORT_NEW_REPORT_DEFAULTS,
  FINAL_REPORT_PAGE_SIZE,
  FinalReportDrawerModes,
  FinalReportViewModes,
  MONTH_SHORT_NAMES,
  PERIOD_ZONE_FIRST_HALF,
  PERIOD_ZONE_HALF_YEAR_MONTHS,
  PERIOD_ZONE_HALVES,
  PERIOD_ZONE_PREFIXES,
  PERIOD_ZONE_QUARTER_MONTHS,
  PERIOD_ZONE_QUARTERS,
  PERIOD_ZONE_SECOND_HALF,
  ReportPeriods,
  ReportStatuses,
  type FinalReportViewMode,
} from '../constants/final-report.constants';
import {
  AUDIT_TYPE_LABELS,
  REPORT_PERIOD_LABELS,
  REPORT_PERIOD_OPTIONS,
  REPORT_STATUS_DEFAULT_SEVERITY,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_SEVERITY,
  FINAL_REPORT_NO_TEMPLATE_DESCRIPTION,
  finalReportFallbackTemplateName,
  finalReportTitle,
  monthPeriodZoneLabel,
  type ReportStatusSeverity,
} from '../constants/final-report-labels.constants';

// Report id follows "AUD-<division code>-<year>-<random 4-digit number>" - the
// same format used when a report is created via the Add Report drawer
// (see manage/final-report.component.ts) - generated once here rather than on every render
// so the mock list stays stable across the page's lifetime.
export function generateReportId(divisionCode: string, createdDate: string): string {
  const year = new Date(createdDate).getFullYear();
  const randomDigits = Math.floor(FINAL_REPORT_ID_RANDOM.Min + Math.random() * FINAL_REPORT_ID_RANDOM.Range);
  return `${FINAL_REPORT_ID_PREFIX}${divisionCode}-${year}-${randomDigits}`;
}

// Derives which specific slice of a reportPeriod a report falls into, from
// its date - e.g. a quarterly report created in March is 'Q1'. Yearly's only
// "slice" is the year itself, e.g. 'Y2025'.
export function derivePeriodZone(reportPeriod: ReportPeriod, dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth();
  switch (reportPeriod) {
    case ReportPeriods.Monthly: return `${PERIOD_ZONE_PREFIXES.Month}${month + 1}`;
    case ReportPeriods.Quarterly: return `${PERIOD_ZONE_PREFIXES.Quarter}${Math.floor(month / PERIOD_ZONE_QUARTER_MONTHS) + 1}`;
    case ReportPeriods.HalfYearly: return month < PERIOD_ZONE_HALF_YEAR_MONTHS ? PERIOD_ZONE_FIRST_HALF : PERIOD_ZONE_SECOND_HALF;
    case ReportPeriods.Yearly: return `${PERIOD_ZONE_PREFIXES.Year}${date.getFullYear()}`;
  }
}

const RAW_REPORTS: Array<Omit<AuditReportEntry, 'id' | 'periodZone'>> = RAW_AUDIT_REPORTS_FLAT;

export const AUDIT_REPORTS: AuditReportEntry[] = RAW_REPORTS.map(entry => ({
  ...entry,
  id: generateReportId(entry.divisionCode, entry.createdDate),
  periodZone: derivePeriodZone(entry.reportPeriod, entry.createdDate),
}));

@Component({
  selector: 'app-final-report-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    DividerModule,
    ConfirmActionDialogComponent,
    FilterModalComponent,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './final-report-list.component.html',
  styleUrl: './final-report-list.component.scss',
})
export class FinalReportListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  constructor(private router: Router) {}

  readonly FinalReportViewModes = FinalReportViewModes;

  viewMode: FinalReportViewMode = FinalReportViewModes.Grid;

  /* ── Filter state ─────────────────────────────── */
  searchQuery = '';
  selectedCompanies: string[] = [];
  selectedDivisionCodes: string[] = [];
  selectedReportPeriods: string[] = [];
  selectedYears: string[] = [];
  selectedPeriodZones: string[] = [];
  currentPage = 0;
  PAGE_SIZE = FINAL_REPORT_PAGE_SIZE;

  readonly reportTypeFilterLabel = $localize`:@@audit.auditReport.reportTypeUppercase:REPORT TYPE`;
  readonly periodFilterLabel = $localize`:@@audit.auditReport.periodUppercase:PERIOD`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  /* ── Options ─────────────────────────────────── */
  get companyFilterOptions(): FilterOption[] {
    const seen = new Set<string>();
    const options: FilterOption[] = [];
    for (const r of AUDIT_REPORTS) {
      if (!seen.has(r.companyId)) {
        seen.add(r.companyId);
        options.push({ label: this.getCompanyLabel(r.companyId), value: r.companyId });
      }
    }
    // Include companies that don't have any reports yet (e.g. newly created
    // via the Organization module) so they're still selectable here.
    for (const c of this.companyDataService.all) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        options.push({ label: c.companyName, value: c.id });
      }
    }
    // Deactivated companies shouldn't be offered as a filter option.
    return options.filter(o => !this.companyDataService.isCompanyBlocked(o.value));
  }

  get divisionFilterOptions(): FilterOption[] {
    const seen = new Set<string>();
    const options: FilterOption[] = [];
    for (const r of AUDIT_REPORTS) {
      if (this.selectedCompanies.length && !this.selectedCompanies.includes(r.companyId)) continue;
      if (!seen.has(r.divisionCode)) {
        seen.add(r.divisionCode);
        options.push({ label: r.divisionName, value: r.divisionCode });
      }
    }
    // Same reasoning as companyFilterOptions - a newly created division has no
    // reports yet, but should still show up as a filter option.
    for (const co of DIVISION_STATIC_COMPANIES) {
      if (this.selectedCompanies.length && !this.selectedCompanies.includes(co.id)) continue;
      for (const b of co.divisions) {
        if (!seen.has(b.divisionCode)) {
          seen.add(b.divisionCode);
          options.push({ label: b.divisionName, value: b.divisionCode });
        }
      }
    }
    // Deactivated divisions (or divisions under a deactivated company) shouldn't
    // be offered as a filter option.
    return options.filter(o => this.isDivisionActive(o.value));
  }

  /** True if the real division record is active and its parent company isn't blocked. */
  private isDivisionActive(divisionCode: string): boolean {
    for (const co of DIVISION_STATIC_COMPANIES) {
      const division = co.divisions.find(b => b.divisionCode === divisionCode);
      if (division) {
        return division.status === DivisionStatuses.Active && !this.companyDataService.isCompanyBlocked(co.id);
      }
    }
    return true;
  }

  readonly reportPeriodFilterOptions: FilterOption[] = REPORT_PERIOD_OPTIONS;

  /** Whether the specific-period field applies - hidden until a report period type is selected. */
  get periodZoneVisible(): boolean {
    return this.selectedReportPeriods.length > 0;
  }

  /** Options for the specific-period field, cascaded from the chosen report period type(s). */
  get periodZoneOptions(): FilterOption[] {
    const options: FilterOption[] = [];
    if (this.selectedReportPeriods.includes(ReportPeriods.Monthly)) {
      MONTH_SHORT_NAMES.forEach((m, i) => {
        const zone = `${PERIOD_ZONE_PREFIXES.Month}${i + 1}`;
        options.push({ label: monthPeriodZoneLabel(zone, m), value: zone });
      });
    }
    if (this.selectedReportPeriods.includes(ReportPeriods.Quarterly)) {
      PERIOD_ZONE_QUARTERS.forEach(q => options.push({ label: q, value: q }));
    }
    if (this.selectedReportPeriods.includes(ReportPeriods.HalfYearly)) {
      PERIOD_ZONE_HALVES.forEach(h => options.push({ label: h, value: h }));
    }
    if (this.selectedReportPeriods.includes(ReportPeriods.Yearly)) {
      const years = new Set<number>();
      for (const r of AUDIT_REPORTS) {
        if (r.reportPeriod === ReportPeriods.Yearly) years.add(new Date(r.createdDate).getFullYear());
      }
      Array.from(years).sort((a, b) => b - a).forEach(y => options.push({ label: `${y}`, value: `${PERIOD_ZONE_PREFIXES.Year}${y}` }));
    }
    return options;
  }

  get yearFilterOptions(): FilterOption[] {
    const years = new Set<number>();
    for (const r of AUDIT_REPORTS) {
      years.add(new Date(r.createdDate).getFullYear());
    }
    return Array.from(years)
      .sort((a, b) => b - a)
      .map(y => ({ label: `${y}`, value: `${y}` }));
  }

  /* ── Data ─────────────────────────────────────── */
  filteredReports: AuditReportEntry[] = [];
  pagedReports: AuditReportEntry[] = [];

  /* ── Lookup maps — sourced from the real company roster in
   * reports-lists-static-data.ts. ─────────────────────────────── */
  readonly companyLookup = REPORTS_LIST_COMPANY_LOOKUP;

  readonly auditTypeLabelMap = AUDIT_TYPE_LABELS;

  readonly reportPeriodLabelMap = REPORT_PERIOD_LABELS;

  readonly statusLabelMap = REPORT_STATUS_LABELS;

  readonly statusSeverityMap = REPORT_STATUS_SEVERITY;

  /* ── Lifecycle ───────────────────────────────── */
  ngOnInit(): void {
    this.applyFilters();
  }

  /* ── Actions ─────────────────────────────────── */
  setViewMode(mode: FinalReportViewMode): void {
    this.viewMode = mode;
  }

  async addNewReport(): Promise<void> {
    const result = await this.drawer.open<FinalReportResult, FinalReportDrawerData>(FinalReportComponent, {
      width: FINAL_REPORT_DRAWER.FormWidth,
      styleClass: FINAL_REPORT_DRAWER.StyleClass,
      data: { mode: FinalReportDrawerModes.Add },
    }).afterClosed;

    if (!result) return;

    const chosenTemplate = result.templateId
      ? REPORT_TEMPLATES.find(t => t.id === result.templateId)
      : undefined;

    const today = new Date().toISOString().slice(0, 10);
    AUDIT_REPORTS.unshift({
      id: result.reportId,
      companyId: result.companyId,
      divisionName: result.divisionName,
      divisionCode: result.divisionCode,
      createdAt: new Date().toISOString(),
      reportTitle: finalReportTitle(this.getAuditTypeLabel(result.auditType), result.divisionName),
      auditType: result.auditType,
      status: ReportStatuses.Draft,
      createdDate: today,
      updatedDate: today,
      leadAuditor: result.leadAuditor,
      reportPeriod: result.reportPeriod,
      periodZone: result.periodZone || derivePeriodZone(result.reportPeriod, today),
      publishedByName: result.leadAuditor,
      publishedByRole: FINAL_REPORT_NEW_REPORT_DEFAULTS.PublishedByRole,
      reviewerName: FINAL_REPORT_NEW_REPORT_DEFAULTS.ReviewerName,
      reviewerRole: FINAL_REPORT_NEW_REPORT_DEFAULTS.ReviewerRole,
      template: chosenTemplate
        ? {
            templateId: chosenTemplate.templateId,
            templateName: chosenTemplate.templateName,
            templateDescription: chosenTemplate.templateDescription,
            industryType: chosenTemplate.industryType,
            templateFileName: chosenTemplate.templateFileName,
            submittedByName: chosenTemplate.submittedByName,
            submittedByRole: chosenTemplate.submittedByRole,
            status: chosenTemplate.status,
          }
        : {
            templateId: null,
            templateName: finalReportFallbackTemplateName(this.getAuditTypeLabel(result.auditType)),
            templateDescription: FINAL_REPORT_NO_TEMPLATE_DESCRIPTION,
            industryType: '',
            templateFileName: FINAL_REPORT_NEW_REPORT_DEFAULTS.FallbackTemplateFileName,
            submittedByName: result.leadAuditor,
            submittedByRole: FINAL_REPORT_NEW_REPORT_DEFAULTS.FallbackTemplateSubmitterRole,
            status: ReportTemplateStatuses.Active,
          },
    });

    this.currentPage = 0;
    this.applyFilters();
  }

  async editReport(rep: AuditReportEntry): Promise<void> {
    const result = await this.drawer.open<FinalReportResult, FinalReportDrawerData>(FinalReportComponent, {
      width: FINAL_REPORT_DRAWER.FormWidth,
      styleClass: FINAL_REPORT_DRAWER.StyleClass,
      data: {
        mode: FinalReportDrawerModes.Edit,
        report: {
          id: rep.id,
          companyId: rep.companyId,
          divisionCode: rep.divisionCode,
          auditType: rep.auditType,
          createdDate: rep.createdDate,
          reportPeriod: rep.reportPeriod,
          periodZone: rep.periodZone,
          leadAuditor: rep.leadAuditor,
          templateId: rep.template.templateId,
          templateFileName: rep.template.templateFileName,
        },
      },
    }).afterClosed;

    if (!result) return;

    const target = AUDIT_REPORTS.find(r => r.id === rep.id);
    if (!target) return;

    const chosenTemplate = result.templateId
      ? REPORT_TEMPLATES.find(t => t.id === result.templateId)
      : undefined;

    target.companyId = result.companyId;
    target.divisionName = result.divisionName;
    target.divisionCode = result.divisionCode;
    target.auditType = result.auditType;
    target.reportTitle = finalReportTitle(this.getAuditTypeLabel(result.auditType), result.divisionName);
    target.reportPeriod = result.reportPeriod;
    target.periodZone = result.periodZone || derivePeriodZone(result.reportPeriod, target.createdDate);
    target.leadAuditor = result.leadAuditor;
    target.updatedDate = new Date().toISOString().slice(0, 10);
    if (chosenTemplate) {
      target.template = {
        templateId: chosenTemplate.templateId,
        templateName: chosenTemplate.templateName,
        templateDescription: chosenTemplate.templateDescription,
        industryType: chosenTemplate.industryType,
        templateFileName: chosenTemplate.templateFileName,
        submittedByName: chosenTemplate.submittedByName,
        submittedByRole: chosenTemplate.submittedByRole,
        status: chosenTemplate.status,
      };
    }

    this.applyFilters();
  }

  viewReport(rep: AuditReportEntry): void {
    this.drawer.open<null, FinalReportProfileDrawerData>(FinalReportProfileComponent, {
      width: FINAL_REPORT_DRAWER.ProfileWidth,
      styleClass: FINAL_REPORT_DRAWER.ProfileStyleClass,
      data: { report: rep },
    });
  }

  /* ── Activate / deactivate ───────────────────────────────────────────────── */
  blockedIds = new Set<string>();
  showConfirmDialog = false;
  confirmTarget: { id: string; name: string } | null = null;

  isBlocked(id: string): boolean {
    return this.blockedIds.has(id);
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
    if (this.blockedIds.has(this.confirmTarget.id)) {
      this.blockedIds.delete(this.confirmTarget.id);
    } else {
      this.blockedIds.add(this.confirmTarget.id);
    }
    this.closeConfirm();
  }

  /* ── Filters ─────────────────────────────────── */
  onCompanyFilter(companies: string[]): void {
    this.selectedCompanies = companies;
    this.selectedDivisionCodes = this.selectedDivisionCodes.filter(code =>
      this.divisionFilterOptions.some(o => o.value === code)
    );
    this.currentPage = 0;
    this.applyFilters();
  }

  onDivisionFilter(divisions: string[]): void {
    this.selectedDivisionCodes = divisions;
    this.currentPage = 0;
    this.applyFilters();
  }

  onReportPeriodFilter(periods: string[]): void {
    this.selectedReportPeriods = periods;
    this.selectedPeriodZones = this.selectedPeriodZones.filter(z =>
      this.periodZoneOptions.some(o => o.value === z)
    );
    this.currentPage = 0;
    this.applyFilters();
  }

  onPeriodZoneFilter(zones: string[]): void {
    this.selectedPeriodZones = zones;
    this.currentPage = 0;
    this.applyFilters();
  }

  onYearFilter(years: string[]): void {
    this.selectedYears = years;
    this.currentPage = 0;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onFiltersCleared(): void {
    this.selectedCompanies = [];
    this.selectedDivisionCodes = [];
    this.selectedReportPeriods = [];
    this.selectedYears = [];
    this.selectedPeriodZones = [];
    this.currentPage = 0;
    this.applyFilters();
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
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredReports = AUDIT_REPORTS.filter(r => {
      if (this.selectedCompanies.length && !this.selectedCompanies.includes(r.companyId)) return false;
      if (this.selectedDivisionCodes.length && !this.selectedDivisionCodes.includes(r.divisionCode)) return false;
      if (this.selectedReportPeriods.length && !this.selectedReportPeriods.includes(r.reportPeriod)) return false;
      if (this.selectedPeriodZones.length && !this.selectedPeriodZones.includes(r.periodZone)) return false;
      if (this.selectedYears.length && !this.selectedYears.includes(`${new Date(r.createdDate).getFullYear()}`)) return false;
      if (q && !r.reportTitle.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.updatePage();
  }

  private updatePage(): void {
    const start = this.currentPage * this.PAGE_SIZE;
    this.pagedReports = this.filteredReports.slice(start, start + this.PAGE_SIZE);
  }

  /* ── Display helpers ─────────────────────────── */
  getCompanyLabel(val: string): string {
    return this.companyLookup.find(c => c.id === val)?.label ?? val;
  }

  getCompanyTag(val: string): string {
    return this.companyLookup.find(c => c.id === val)?.tag ?? val.toUpperCase();
  }

  getCompanyColor(val: string): string {
    return this.companyLookup.find(c => c.id === val)?.color ?? FINAL_REPORT_DEFAULT_COMPANY_COLOR;
  }

  getAuditTypeLabel(val: AuditType): string {
    return this.auditTypeLabelMap[val] ?? val;
  }

  getReportPeriodLabel(val: ReportPeriod): string {
    return this.reportPeriodLabelMap[val] ?? val;
  }

  getStatusLabel(val: ReportStatus): string {
    return this.statusLabelMap[val] ?? val;
  }

  getStatusSeverity(val: ReportStatus): ReportStatusSeverity {
    return this.statusSeverityMap[val] ?? REPORT_STATUS_DEFAULT_SEVERITY;
  }
}
