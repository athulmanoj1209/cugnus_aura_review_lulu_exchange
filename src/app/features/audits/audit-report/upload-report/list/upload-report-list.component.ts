import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, of, finalize } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from 'primeng/api';

// TODO: swap the mock data/calls in this file for a real service, e.g.:
// import { ReportUploadService } from '@/app/services/reports/report-upload.service';

import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';

// ── Types ───────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'auditor';
export type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export interface SelectOption { label: string; value: number | string; }
export interface ReportTypeOption { label: string; value: ReportType; }
export interface PeriodOption { label: string; value: string; }
/** A month header with its weeks nested inside, used for the grouped weekly period select. */
export interface PeriodGroupOption { label: string; items: PeriodOption[]; }

export interface ReportListItem {
  id: number;
  name: string;
  divisionLabel: string;
  divisionId: number | string;
  companyId: number | string;
  reportType: ReportType;
  period: string;      // e.g. 'M3', 'Q2', 'H1', '' for yearly
  year: number;
  lastUpdated: Date;
  fileType: 'PDF' | 'XLSX';
  fileSizeKb: number;
}

@Component({
  selector: 'app-report-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, PaginatorModule, DialogModule, SharedModule],
  templateUrl: './upload-report-list.component.html',
  styleUrls: ['./upload-report-list.component.scss'],
})
export class ReportUploadComponent implements OnInit, OnDestroy {

  /** Set by the host/route/auth-guard. TODO: replace with this.auth.currentUser.role */
  @Input() userRole: UserRole = 'admin';

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  uploadForm!: FormGroup;

  companyOptions: SelectOption[]    = this.buildCompanyOptions();
  divisionOptions: SelectOption[]   = [];
  yearOptions: SelectOption[]       = [];
  periodOptions: (PeriodOption | PeriodGroupOption)[] = [];

  reportTypeOptions: ReportTypeOption[] = [
    { label: $localize`:@@audit.auditReport.weekly:Weekly`, value: 'weekly' },
    { label: $localize`:@@audit.auditReport.monthly:Monthly`, value: 'monthly' },
    { label: $localize`:@@audit.auditReport.quarterly:Quarterly`, value: 'quarterly' },
    { label: $localize`:@@audit.auditReport.halfYearly:Half Yearly`, value: 'half_yearly' },
    { label: $localize`:@@audit.auditReport.yearly:Yearly`, value: 'yearly' },
  ];

  /** Full report list, loaded once on init. Filters only narrow this down client-side. */
  allReports: ReportListItem[] = [];
  filteredReports: ReportListItem[] = [];
  pagedReports: ReportListItem[] = [];
  loadingReports = false;

  first = 0;
  rows = 10;
  rowsPerPageOptions = [5, 10, 20];

  // ── Upload modal state ──────────────────────────────────────────────────
  uploadModalVisible = false;
  uploading = false;
  isDragging = false;
  selectedReportForUpload: ReportListItem | null = null;
  selectedFileName: string | null = null;

  // TODO: replace with the auditor's actual company/scope from AuthService
  private readonly auditorCompanyId: number | string =
    CLIENT_MODE_VALUE === 'internal-audit' ? (COMPANIES_SEED[0]?.id ?? '') : 1;

  private allDivisions: { id: number | string; companyId: number | string; name: string }[] =
    this.buildAllDivisions();

  private destroy$ = new Subject<void>();

  readonly clickToClearLabel = $localize`:@@audit.auditReport.clickToClear:Click to clear`;

  constructor(private fb: FormBuilder) {}

  // ── Static data (company/division) ───────────────────────────────────────
  /**
   * In 'internal-audit' mode there's a single organisation (DAR Exchange), so
   * company/division options come from the same static seeds the rest of the
   * app reads for that mode (company-static-indi-org.data.ts /
   * division-static-indi-org.data.ts) instead of this file's audit-firm mocks.
   */
  private buildCompanyOptions(): SelectOption[] {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      return COMPANIES_SEED.map(c => ({ label: c.companyName, value: c.id }));
    }
    return [
      { label: 'Crowe UAE',     value: 1 },
      { label: 'Crowe KSA',     value: 2 },
      { label: 'Crowe Bahrain', value: 3 },
    ];
  }

  private buildAllDivisions(): { id: number | string; companyId: number | string; name: string }[] {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      return DIVISION_INDI_ORG_COMPANIES.flatMap(company =>
        company.divisions.map(b => ({ id: b.divisionCode, companyId: company.id, name: b.divisionName }))
      );
    }
    return [
      { id: 1, companyId: 1, name: 'Dubai' },
      { id: 2, companyId: 1, name: 'Abu Dhabi' },
      { id: 3, companyId: 2, name: 'Riyadh' },
      { id: 4, companyId: 2, name: 'Jeddah' },
      { id: 5, companyId: 3, name: 'Manama' },
    ];
  }

  // ── Derived flags ─────────────────────────────────────────────────────────
  get isAdmin(): boolean { return this.userRole === 'admin'; }

  get selectedReportType(): ReportType | null { return this.form?.get('reportType')?.value ?? null; }

  get periodZoneVisible(): boolean {
    return !!this.selectedReportType && this.selectedReportType !== 'yearly';
  }

  get hasResults(): boolean { return this.filteredReports.length > 0; }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.yearOptions = this.buildYearOptions();

    // All filter fields are optional — every one of them just narrows the
    // already-loaded report list, none of them gate whether it loads.
    this.form = this.fb.group({
      company:    [null],
      division:   [null],
      reportType: [null],
      year:       [null],
      periodZone: [null],
    });

    this.uploadForm = this.fb.group({
      file:    [null, Validators.required],
      remarks: [''],
    });

    this.divisionOptions = this.divisionOptionsFor(this.isAdmin ? null : this.auditorCompanyId);

    if (this.isAdmin) {
      this.form.get('company')!.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((id: number | string | null) => {
          this.divisionOptions = this.divisionOptionsFor(id);
          // Drop the chosen division if it doesn't belong to the newly selected company.
          const divisionCtrl = this.form.get('division')!;
          if (id && divisionCtrl.value != null &&
              !this.allDivisions.some(b => b.id === divisionCtrl.value && b.companyId === id)) {
            divisionCtrl.setValue(null, { emitEvent: false });
          }
          this.applyFilters();
        });
    }

    this.form.get('division')!.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.form.get('reportType')!.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type: ReportType | null) => {
        this.periodOptions = type ? this.buildPeriodOptions(type, this.form.get('year')!.value) : [];
        this.form.get('periodZone')!.setValue(null, { emitEvent: false });
        this.applyFilters();
      });

    this.form.get('year')!.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((year: number | null) => {
        const type: ReportType | null = this.form.get('reportType')!.value;
        if (type) { this.periodOptions = this.buildPeriodOptions(type, year); }
        this.applyFilters();
      });

    this.form.get('periodZone')!.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.loadAllReports();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  // ── Report type / period zone ────────────────────────────────────────────
  /** Pills act as a toggleable filter — clicking the active one clears it back to "all". */
  selectReportType(type: ReportType): void {
    const ctrl = this.form.get('reportType')!;
    ctrl.setValue(ctrl.value === type ? null : type);
    ctrl.markAsTouched();
  }

  private buildPeriodOptions(type: ReportType, year: number | null): (PeriodOption | PeriodGroupOption)[] {
    switch (type) {
      case 'weekly':
        return this.buildWeeklyGroups(year ?? new Date().getFullYear());
      case 'monthly': {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months.map((m, i) => ({ label: `M${i + 1} · ${m}`, value: `M${i + 1}` }));
      }
      case 'quarterly':
        return ['Q1', 'Q2', 'Q3', 'Q4'].map(q => ({ label: q, value: q }));
      case 'half_yearly':
        return ['H1', 'H2'].map(h => ({ label: h, value: h }));
      default:
        return [];
    }
  }

  /** Builds W1, W2, ... grouped under their month, e.g. January → [W1 (Jan 1 - Jan 7), W2 (Jan 8 - Jan 14), ...]. */
  private buildWeeklyGroups(year: number): PeriodGroupOption[] {
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December',
    ];
    const groups: PeriodGroupOption[] = monthNames.map(label => ({ label, items: [] }));

    const yearEnd = new Date(year, 11, 31);
    const cursor = new Date(year, 0, 1);
    let weekNum = 1;

    while (cursor.getFullYear() === year) {
      const weekStart = new Date(cursor);
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const clampedEnd = weekEnd > yearEnd ? yearEnd : weekEnd;

      groups[weekStart.getMonth()].items.push({
        label: `W${weekNum} (${this.formatShortDate(weekStart)} - ${this.formatShortDate(clampedEnd)})`,
        value: `W${weekNum}`,
      });

      cursor.setDate(cursor.getDate() + 7);
      weekNum++;
    }

    return groups.filter(g => g.items.length > 0);
  }

  private formatShortDate(d: Date): string {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  private buildYearOptions(): SelectOption[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - i).map(y => ({ label: `${y}`, value: y }));
  }

  // ── Report list ───────────────────────────────────────────────────────────
  private divisionOptionsFor(companyId: number | string | null): SelectOption[] {
    const divisions = companyId == null
      ? this.allDivisions
      : this.allDivisions.filter(b => b.companyId === companyId);
    return divisions.map(b => ({ label: b.name, value: b.id }));
  }

  /** Loads the full report list once. Filters never re-fetch — they only narrow this down. */
  private loadAllReports(): void {
    this.loadingReports = true;
    // TODO: swap → this.reportSvc.getReports() and load the complete list the
    // same way — filtering below should stay client-side unless the dataset
    // grows large enough to need server-side filtering/paging instead.
    of(this.mockAllReports())
      .pipe(finalize(() => (this.loadingReports = false)))
      .subscribe(list => {
        this.allReports = list;
        this.applyFilters();
      });
  }

  /** Builds the full mock report set, scoped to the divisions this user can see. */
  private mockAllReports(): ReportListItem[] {
    const divisions = this.isAdmin
      ? this.allDivisions
      : this.allDivisions.filter(b => b.companyId === this.auditorCompanyId);

    const reports: ReportListItem[] = [];
    let seq = 0;

    divisions.forEach(division => {
      this.reportTypeOptions.forEach(({ value: reportType }) => {
        this.yearOptions.forEach(({ value: year }) => {
          this.periodValuesFor(reportType, year as number).forEach(period => {
            seq++;
            const updated = new Date();
            updated.setDate(updated.getDate() - (seq % 60));
            reports.push({
              id: seq,
              name: `${division.name} ${this.reportTypeLabel(reportType)} Report${period ? ' ' + period : ''} ${year}`,
              divisionLabel: division.name,
              divisionId: division.id,
              companyId: division.companyId,
              reportType,
              period,
              year: year as number,
              lastUpdated: updated,
              fileType: (seq % 2 === 1 ? 'PDF' : 'XLSX') as 'PDF' | 'XLSX',
              fileSizeKb: 180 + (seq % 40) * 12,
            });
          });
        });
      });
    });

    return reports;
  }

  /** Flattens buildPeriodOptions into raw values, sampled down for weekly so the mock list stays sane. */
  private periodValuesFor(type: ReportType, year: number): string[] {
    if (type === 'yearly') return [''];

    const flat: string[] = [];
    this.buildPeriodOptions(type, year).forEach(opt => {
      'items' in opt ? flat.push(...opt.items.map(i => i.value)) : flat.push((opt as PeriodOption).value);
    });

    const max = type === 'weekly' ? 6 : flat.length;
    if (flat.length <= max) return flat;
    const step = Math.ceil(flat.length / max);
    return flat.filter((_, i) => i % step === 0);
  }

  /** Applies every currently-set filter to the full list — none of them trigger a reload. */
  private applyFilters(): void {
    const companyId = this.form.get('company')?.value ?? null;
    const divisionId = this.form.get('division')!.value;
    const reportType: ReportType | null = this.form.get('reportType')!.value;
    const year = this.form.get('year')!.value;
    const periodZone = this.form.get('periodZone')!.value;

    this.filteredReports = this.allReports.filter(r =>
      (companyId == null || r.companyId === companyId) &&
      (divisionId == null || r.divisionId === divisionId) &&
      (reportType == null || r.reportType === reportType) &&
      (year == null || r.year === year) &&
      (periodZone == null || r.period === periodZone)
    );

    this.first = 0;
    this.updatePagedReports();
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    this.updatePagedReports();
  }

  private updatePagedReports(): void {
    this.pagedReports = this.filteredReports.slice(this.first, this.first + this.rows);
  }

  reportTypeLabel(type: ReportType): string {
    return this.reportTypeOptions.find(o => o.value === type)?.label ?? type;
  }

  periodLabel(report: ReportListItem): string {
    return report.period ? `${report.period} ${report.year}` : `${report.year}`;
  }

  // ── Upload modal ──────────────────────────────────────────────────────────
  openUploadModal(report: ReportListItem): void {
    this.selectedReportForUpload = report;
    this.selectedFileName = null;
    this.isDragging = false;
    this.uploadForm.reset({ file: null, remarks: '' });
    this.uploadModalVisible = true;
  }

  closeUploadModal(): void {
    this.uploadModalVisible = false;
    this.selectedReportForUpload = null;
  }

  triggerFileBrowse(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.setFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0] ?? null;
    this.setFile(file);
  }

  private setFile(file: File | null): void {
    this.uploadForm.patchValue({ file });
    this.uploadForm.get('file')!.markAsTouched();
    this.selectedFileName = file?.name ?? null;
  }

  submitUpload(): void {
    this.uploadForm.markAllAsTouched();
    if (this.uploadForm.invalid || !this.selectedReportForUpload) return;

    this.uploading = true;
    const { file, remarks } = this.uploadForm.value;
    // TODO: swap → this.reportSvc.upload(this.selectedReportForUpload.id, { file, remarks })
    of(void 0).pipe(finalize(() => (this.uploading = false)))
      .subscribe(() => {
        if (this.selectedReportForUpload) {
          this.selectedReportForUpload.lastUpdated = new Date();
        }
        this.closeUploadModal();
      });
  }

  isUploadInvalid(controlName: string): boolean {
    const ctrl = this.uploadForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.form.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  getError(controlName: string, label: string): string | null {
    if (!this.isInvalid(controlName)) return null;
    const errors = this.form.get(controlName)!.errors;
    if (errors?.['required']) return `${label} is required`;
    return `${label} is invalid`;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  onReset(): void {
    this.form.reset();
    this.rows = 10;
    this.periodOptions = [];
    this.divisionOptions = this.divisionOptionsFor(this.isAdmin ? null : this.auditorCompanyId);
    this.applyFilters();
  }
}