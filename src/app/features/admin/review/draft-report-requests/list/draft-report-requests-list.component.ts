import {
  Component, computed, inject, signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FilterModalComponent, FilterOption } from '@/app/shared/components/filter-modal/filter-modal.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
// Client-mode aware org data — same switch used by risk-register-list.
// component.ts / risk-approval-pending-list.component.ts / execution-approval-
// list.component.ts. When CLIENT_MODE_VALUE is 'internal-audit', the
// Company / Division / Sub-Division filter options are drawn from the
// single-company "DAR Exchange" *-indi-org static seed files instead of
// ORG_STATIC_DATA's multi-company audit-firm roster.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

/* ── Model ─────────────────────────────────────────────────────────
   Every report on this screen is, by definition, a draft — it was
   generated from a template and hasn't been submitted for review yet.
   `status` is a real, stored field on the report (not derived) —
   set by the author or the backend workflow, e.g. once a draft is
   fully filled out it gets marked 'submit-for-review'.
──────────────────────────────────────────────────────────────────── */
export type DraftReportStatus = 'in-progress' | 'awaiting-review' | 'reopened';

export interface DraftReport {
  id:           string;
  title:        string;
  reportType:   string;
  year:         number;
  auditArea:    string;
  templateName: string;
  status:       DraftReportStatus;
  completion:   number;
  preparedBy:   string;
  lastModified: Date;
  dueDate?:     Date;
  company:      string;
  division:     string;
  subDivision:  string;
  fileName:     string;
  fileSize:     string;
  version:      string;
}

/* ── Mock data (replace with API data) ────────────────────────────
   Wire `items` up to your report service, e.g.:
   this.reportService.getDraftReports().subscribe(list => this.items.set(list));
──────────────────────────────────────────────────────────────────── */
const MOCK: DraftReport[] = [
  {
    id: 'RPT-101', title: 'Q2 Internal Controls Review',
    reportType: 'Quarterly', year: 2026, auditArea: 'Finance', status: 'awaiting-review',
    templateName: 'Internal Audit Report Template', completion: 65,
    preparedBy: 'Athul Manoj', lastModified: new Date('2026-07-20'),
    dueDate: new Date('2026-08-05'),
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'Internal Audit',
    fileName: 'Q2-Internal-Controls-Review.docx', fileSize: '1.8 MB', version: 'v0.4',
  },
  {
    id: 'RPT-102', title: 'AML Compliance Assessment',
    reportType: 'Monthly', year: 2026, auditArea: 'Compliance', status: 'awaiting-review',
    templateName: 'Compliance Report Template', completion: 100,
    preparedBy: 'Sara Ahmed', lastModified: new Date('2026-07-22'),
    dueDate: new Date('2026-07-30'),
    company: 'Crowe UAE', division: 'Abu Dhabi', subDivision: 'Compliance',
    fileName: 'AML-Compliance-Assessment.docx', fileSize: '3.2 MB', version: 'v1.0',
  },
  {
    id: 'RPT-103', title: 'IT Vendor Risk Report',
    reportType: 'Quarterly', year: 2025, auditArea: 'IT / Cyber', status: 'reopened',
    templateName: 'Risk Assessment Report Template', completion: 40,
    preparedBy: 'John Smith', lastModified: new Date('2025-07-10'),
    dueDate: new Date('2025-07-25'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'IT',
    fileName: 'IT-Vendor-Risk-Report.docx', fileSize: '2.1 MB', version: 'v0.2',
  },
  {
    id: 'RPT-104', title: 'Data Privacy Gap Analysis',
    reportType: 'Monthly', year: 2026, auditArea: 'IT / Cyber', status: 'awaiting-review',
    templateName: 'Risk Assessment Report Template', completion: 15,
    preparedBy: 'Meenu AM', lastModified: new Date('2026-07-24'),
    dueDate: new Date('2026-08-15'),
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'IT',
    fileName: 'Data-Privacy-Gap-Analysis.docx', fileSize: '0.9 MB', version: 'v0.1',
  },
  {
    id: 'RPT-105', title: 'Year-End Financial Statement Audit',
    reportType: 'Yearly', year: 2025, auditArea: 'Financial', status: 'reopened',
    templateName: 'External Audit Report Template', completion: 80,
    preparedBy: 'Athul Manoj', lastModified: new Date('2025-12-27'),
    dueDate: new Date('2026-01-10'),
    company: 'Crowe KSA', division: 'Jeddah', subDivision: 'External Audit',
    fileName: 'Year-End-FS-Audit.docx', fileSize: '4.5 MB', version: 'v0.7',
  },
  {
    id: 'RPT-106', title: 'Client Complaints Review',
    reportType: 'Weekly', year: 2026, auditArea: 'Reputational', status: 'awaiting-review',
    templateName: 'Internal Audit Report Template', completion: 100,
    preparedBy: 'Sara Ahmed', lastModified: new Date('2026-07-18'),
    company: 'Crowe UAE', division: 'Sharjah', subDivision: 'Internal Audit',
    fileName: 'Client-Complaints-Review.docx', fileSize: '1.2 MB', version: 'v1.0',
  },
];

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-draft-reports-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, ReactiveFormsModule,
    ButtonModule, InputTextModule, TooltipModule,
    FilterModalComponent,

    DrawIconComponent,],
  templateUrl: './draft-report-requests-list.component.html',
  styleUrl: './draft-report-requests-list.component.scss',
})
export class DraftReportsListComponent {
  private readonly router = inject(Router);

  readonly items    = signal<DraftReport[]>(MOCK);
  readonly viewMode = signal<'grid' | 'list'>('grid');

  // ── Reactive search control ─────────────────────────────────────
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly search = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  // ── Filter state (multi-select arrays) ───────────────────────────
  // Order mirrors the desired dropdown order:
  // report type, year, status, prepared by, company, division, sub-division.
  readonly filterReportTypes = signal<string[]>([]);
  readonly filterYears       = signal<string[]>([]);
  readonly filterStatuses    = signal<string[]>([]);
  readonly filterPreparedBys = signal<string[]>([]);
  readonly filterCompanies   = signal<string[]>([]);
  readonly filterDivisions   = signal<string[]>([]);
  readonly filterSubDivisions = signal<string[]>([]);

  // ── Static options ────────────────────────────────────────────────
  readonly reportTypeOptions: FilterOption[] = [
    { label: $localize`:@@admin.draftReportRequests.weekly:Weekly`,    value: 'Weekly' },
    { label: $localize`:@@admin.draftReportRequests.monthly:Monthly`,   value: 'Monthly' },
    { label: $localize`:@@admin.draftReportRequests.quarterly:Quarterly`, value: 'Quarterly' },
    { label: $localize`:@@admin.draftReportRequests.yearly:Yearly`,    value: 'Yearly' },
  ];
  readonly statusOptions: FilterOption[] = [
    // { label: 'In Progress',   value: 'in-progress' },
    // Values must match the stored DraftReportStatus, otherwise the filter
    // never matches (the old 'Awaiting Review' value did not).
    { label: $localize`:@@admin.draftReportRequests.awaitingReview:Awaiting Review`, value: 'awaiting-review' },
    { label: $localize`:@@common.reopened:Reopened`,        value: 'reopened' },
  ];
  /** True when this build is running in single-company "internal audit" mode. */
  readonly isInternalAuditMode = CLIENT_MODE_VALUE === 'internal-audit';

  /**
   * Company filter options.
   *
   * Internal-audit mode: every company defined in COMPANIES_SEED
   * (company-static-indi-org.data.ts) — the full single-company org
   * directory, not just the multi-company audit-firm roster.
   *
   * Audit-firm mode (unchanged): sourced from company-org-data.ts — the
   * same shared static-data file every other Company filter/drawer in the
   * app reads from. Value is the company's display NAME (matching
   * DraftReport.company).
   */
  readonly companyOptions = computed<FilterOption[]>(() => {
    if (this.isInternalAuditMode) {
      return COMPANIES_SEED
        .map(c => ({ label: c.companyName, value: c.companyName }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return ORG_STATIC_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /**
   * Division narrows to whatever Companies are currently checked in the
   * Filters modal (all divisions, across every company, when none are
   * checked yet).
   *
   * Internal-audit mode: pulled from DIVISION_INDI_ORG_COMPANIES
   * (division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly divisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : DIVISION_INDI_ORG_COMPANIES;
      const names = new Set(companies.flatMap(c => c.divisions).map(b => b.divisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ORG_STATIC_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(b => b.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * Sub-Division narrows to whatever Companies/Divisions are currently
   * checked.
   *
   * Internal-audit mode: pulled from SUB_DIVISION_INDI_ORG_COMPANIES
   * (sub-division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly subDivisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();
    const selectedDivisions = this.filterDivisions();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : SUB_DIVISION_INDI_ORG_COMPANIES;
      const divisions = companies.flatMap(c => c.divisions)
        .filter(b => !selectedDivisions.length || selectedDivisions.includes(b.divisionName));
      const names = new Set(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ORG_STATIC_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(b => !selectedDivisions.length || selectedDivisions.includes(b.divisionName));
    const names = new Set(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  // ── Dynamic options ───────────────────────────────────────────────
  readonly yearOptions = computed<FilterOption[]>(() =>
    [...new Set(this.items().map(i => i.year))]
      .sort((a, b) => b - a)
      .map(y => ({ label: String(y), value: String(y) })),
  );
  readonly preparerOptions = computed<FilterOption[]>(() =>
    [...new Set(this.items().map(i => i.preparedBy))].sort()
      .map(v => ({ label: v, value: v })),
  );

  // ── Stats (read straight from the stored status field) ────────────
  readonly stats = computed(() => {
    const all = this.items();
    return {
      total:    all.length,
      ready:    all.filter(i => i.status === 'awaiting-review').length,
      reopened: all.filter(i => i.status === 'reopened').length,
    };
  });

  // ── Filtered list ─────────────────────────────────────────────────
  readonly filtered = computed(() => {
    let list = this.items();
    const q = this.search().trim().toLowerCase();
    if (q) list = list.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.preparedBy.toLowerCase().includes(q),
    );
    const reportTypes  = this.filterReportTypes();
    const years         = this.filterYears();
    const statuses      = this.filterStatuses();
    const preparedBys   = this.filterPreparedBys();
    const companies     = this.filterCompanies();
    const divisions     = this.filterDivisions();
    const subDivisions  = this.filterSubDivisions();

    if (reportTypes.length)  list = list.filter(i => reportTypes.includes(i.reportType));
    if (years.length)        list = list.filter(i => years.includes(String(i.year)));
    if (statuses.length)     list = list.filter(i => statuses.includes(i.status));
    if (preparedBys.length)  list = list.filter(i => preparedBys.includes(i.preparedBy));
    if (companies.length)    list = list.filter(i => companies.includes(i.company));
    if (divisions.length)    list = list.filter(i => divisions.includes(i.division));
    if (subDivisions.length) list = list.filter(i => subDivisions.includes(i.subDivision));
    return list;
  });

  readonly hasFilters = computed(() =>
    !!this.search().trim() ||
    this.filterReportTypes().length > 0 ||
    this.filterYears().length > 0 ||
    this.filterStatuses().length > 0 ||
    this.filterPreparedBys().length > 0 ||
    this.filterCompanies().length > 0 ||
    this.filterDivisions().length > 0 ||
    this.filterSubDivisions().length > 0,
  );

  // ── Actions ───────────────────────────────────────────────────────
  clearAll(): void {
    this.searchControl.setValue('');
    this.filterReportTypes.set([]);
    this.filterYears.set([]);
    this.filterStatuses.set([]);
    this.filterPreparedBys.set([]);
    this.filterCompanies.set([]);
    this.filterDivisions.set([]);
    this.filterSubDivisions.set([]);
  }

  /** Opens the draft report so the author can keep working on it. */
  reviewReport(item: DraftReport): void {
    // TODO: replace with the actual report editor route for this app
    this.router.navigate(['/audit/reports', item.id, 'review']);
  }

  /** Downloads the report file. Replace the mock blob with a real API call, e.g.:
   *  this.reportService.download(item.id).subscribe(blob => saveAs(blob, item.fileName));
   */
  downloadReport(item: DraftReport): void {
    const blob = new Blob([`Draft report placeholder: ${item.title} (${item.version})`], {
      type: 'application/octet-stream',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /** Submits a completed draft for review, removing it from this list.
   *  Only enabled once `status` is 'submit-for-review'.
   */
  submitForReview(item: DraftReport): void {
    if (item.status !== 'awaiting-review') return;
    // TODO: replace with the actual submit-for-review API call, e.g.:
    // this.reportService.submitForReview(item.id).subscribe(() => ...);
    this.items.update(list => list.filter(i => i.id !== item.id));
  }

  /* ── Helpers ──────────────────────────────────────────────────── */
  statusLabel(status: DraftReportStatus): string {
    const map: Record<DraftReportStatus, string> = {
      'in-progress': $localize`:@@common.inProgress:In Progress`,
      'awaiting-review': $localize`:@@admin.draftReportRequests.submitForReview:Submit for Review`,
      reopened: $localize`:@@common.reopened:Reopened`,
    };
    return map[status];
  }
  reportTypeIcon(type: string): string {
    const map: Record<string, string> = {
      Weekly: 'pi-calendar',
      Monthly: 'pi-calendar-plus',
      Quarterly: 'pi-history',
      Yearly: 'pi-calendar-times',
    };
    return map[type] ?? 'pi-file';
  }
  trackById = (_: number, i: DraftReport) => i.id;
}