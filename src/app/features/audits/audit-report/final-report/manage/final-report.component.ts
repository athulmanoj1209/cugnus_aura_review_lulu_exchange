import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';

import { AUDITOR_PROFILES } from '@/app/features/audits/organization/divisions/list/division-list.component';
import { REPORT_TEMPLATES } from '@/app/features/audits/audit-report/report-template/list/report-template-list.component';
import { REPORT_COMPANY_LOOKUP } from '@/app/features/audits/audit-report/report-template/report-template-static-data';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import type { SelectOption } from '@/app/shared/models/select-option.model';
import type { FinalReportDrawerData, FinalReportEditData, FinalReportResult } from '@/app/features/audits/audit-report/final-report/models/final-report.model';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import {
  REPORT_EDITOR_ROUTE,
  ReportTemplateStatuses,
} from '@/app/features/audits/audit-report/report-template/constants/report-template.constants';
import {
  FINAL_REPORT_ID_PREFIX,
  FINAL_REPORT_ID_RANDOM,
  FINAL_REPORT_PLACEHOLDER_REPORT_ID,
  FinalReportDrawerModes,
  MONTH_SHORT_NAMES,
  PERIOD_ZONE_HALVES,
  PERIOD_ZONE_PREFIXES,
  PERIOD_ZONE_QUARTERS,
  ReportPeriods,
} from '../constants/final-report.constants';
import { AUDIT_TYPE_OPTIONS, REPORT_PERIOD_OPTIONS, monthPeriodZoneLabel } from '../constants/final-report-labels.constants';
import { FINAL_REPORT_ERROR_MESSAGES } from '../constants/final-report-messages.constants';

// Real company roster from report-template-static-data.ts, so this stays
// one identity space with REPORT_TEMPLATES's companyId/divisionCode values.
// Companies with no report templates yet (e.g. newly created via the
// Organization module) are unioned in from CompanyDataService at render time
// in the component below (see companyOptions getter).
const LOCAL_COMPANY_OPTIONS: SelectOption[] = REPORT_COMPANY_LOOKUP.map(c => ({ label: c.label, value: c.id }));

@Component({
  selector: 'app-final-report',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DividerModule,
    DrawIconComponent
  ],
  templateUrl: './final-report.component.html',
  styleUrl: './final-report.component.scss',
})
export class FinalReportComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<FinalReportResult, FinalReportDrawerData>;
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as FinalReportDrawerData | null;
  private readonly companyDataService = inject(CompanyDataService);

  reportId = FINAL_REPORT_PLACEHOLDER_REPORT_ID;

  readonly editReportLabel = $localize`:@@audit.auditReport.editReport:Edit Report`;
  readonly addNewReportLabel = $localize`:@@audit.auditReport.addNewReport:Add New Report`;
  readonly editReportSubtitle = $localize`:@@audit.auditReport.editReportSubtitle:Update the details of this audit report`;
  readonly addReportSubtitle = $localize`:@@audit.auditReport.addReportSubtitle:Fill in the details to create a new audit report`;
  readonly selectTimePeriodLabel = $localize`:@@audit.auditReport.selectTimePeriod:Select time period`;
  readonly selectReportPeriodFirstLabel = $localize`:@@audit.auditReport.selectReportPeriodFirst:Select a report period first`;
  readonly updateLabel = $localize`:@@common.update:Update`;
  readonly submitLabel = $localize`:@@common.submit:Submit`;

  get companyOptions(): SelectOption[] {
    const seen = new Set<string>();
    const options: SelectOption[] = [...LOCAL_COMPANY_OPTIONS];
    options.forEach(o => seen.add(o.value));
    for (const c of this.companyDataService.all) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        options.push({ label: c.companyName, value: c.id });
      }
    }
    // Deactivated companies are excluded, except the one already selected on
    // the form (so editing a report under a since-blocked company doesn't
    // blank the field).
    const currentId = this.form?.get('companyId')?.value;
    return options.filter(o => !this.companyDataService.isCompanyBlocked(o.value) || o.value === currentId);
  }
  readonly auditTypeOptions = AUDIT_TYPE_OPTIONS;
  readonly reportPeriodOptions = REPORT_PERIOD_OPTIONS;

  readonly leadAuditorOptions: SelectOption[] = Object.values(AUDITOR_PROFILES).map(a => ({
    label: a.displayName,
    value: a.id,
  }));

  form!: FormGroup;
  submitted = false;

  get isEditMode(): boolean {
    return this.data?.mode === FinalReportDrawerModes.Edit;
  }

  // Division and Template options are both sourced from REPORT_TEMPLATES so
  // their divisionCode values share one identity space and cascade correctly.
  get divisionOptions(): SelectOption[] {
    const company = this.form?.get('companyId')?.value;
    const seen = new Set<string>();
    const options: SelectOption[] = [];
    for (const t of REPORT_TEMPLATES) {
      if (company && t.companyId !== company) continue;
      if (seen.has(t.divisionCode)) continue;
      seen.add(t.divisionCode);
      options.push({ label: t.divisionName, value: t.divisionCode });
    }
    // A newly created division (e.g. via the Divisions module) has no report
    // templates yet - still offer it once a company is selected.
    let canonicalCompany: typeof DIVISION_STATIC_COMPANIES[number] | undefined;
    if (company) {
      canonicalCompany = DIVISION_STATIC_COMPANIES.find(co => co.id === company);
      if (canonicalCompany) {
        for (const b of canonicalCompany.divisions) {
          if (seen.has(b.divisionCode)) continue;
          seen.add(b.divisionCode);
          options.push({ label: b.divisionName, value: b.divisionCode });
        }
      }
    }

    // Deactivated divisions (or any division under a deactivated company) are
    // excluded, except the division already selected on the form.
    const companyBlocked = company ? this.companyDataService.isCompanyBlocked(company) : false;
    const currentDivisionCode = this.form?.get('divisionCode')?.value;
    return options.filter(o => {
      if (o.value === currentDivisionCode) return true;
      const division = canonicalCompany?.divisions.find(b => b.divisionCode === o.value);
      return division ? division.status === DivisionStatuses.Active && !companyBlocked : true;
    });
  }

  /** Whether the specific-timeperiod field applies - hidden until a report type is selected. */
  get periodZoneVisible(): boolean {
    const period = this.form?.get('reportPeriod')?.value;
    return !!period;
  }

  /** The single 'Yxxxx' option for a yearly report, derived from the selected Report Year. */
  private get yearlyPeriodZoneOption(): SelectOption {
    const reportYear: Date | null = this.form?.get('reportYear')?.value;
    const year = reportYear ? new Date(reportYear).getFullYear() : new Date().getFullYear();
    return { label: `${year}`, value: `${PERIOD_ZONE_PREFIXES.Year}${year}` };
  }

  /** Options for the specific-timeperiod field, cascaded from the chosen report period. */
  get periodZoneOptions(): SelectOption[] {
    const period = this.form?.get('reportPeriod')?.value;
    if (period === ReportPeriods.Monthly) {
      return MONTH_SHORT_NAMES.map((m, i) => {
        const zone = `${PERIOD_ZONE_PREFIXES.Month}${i + 1}`;
        return { label: monthPeriodZoneLabel(zone, m), value: zone };
      });
    }
    if (period === ReportPeriods.Quarterly) {
      return PERIOD_ZONE_QUARTERS.map(q => ({ label: q, value: q }));
    }
    if (period === ReportPeriods.HalfYearly) {
      return PERIOD_ZONE_HALVES.map(h => ({ label: h, value: h }));
    }
    if (period === ReportPeriods.Yearly) {
      return [this.yearlyPeriodZoneOption];
    }
    return [];
  }

  get templateOptions(): SelectOption[] {
    const company = this.form?.get('companyId')?.value;
    const division = this.form?.get('divisionCode')?.value;
    return REPORT_TEMPLATES
      .filter(t => t.status === ReportTemplateStatuses.Active)
      .filter(t => !company || t.companyId === company)
      .filter(t => !division || t.divisionCode === division)
      .map(t => ({ label: t.templateName, value: t.id }));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      companyId: [null, Validators.required],
      divisionCode: [{ value: null, disabled: true }, Validators.required],
      auditType: [null, Validators.required],
      reportId: [{ value: '', disabled: true }],
      reportYear: [new Date(), Validators.required],
      reportPeriod: [null, Validators.required],
      periodZone: [{ value: null, disabled: true }],
      leadAuditorId: [null, Validators.required],
      templateId: [null],
    });

    this.form.get('companyId')?.valueChanges.subscribe(company => {
      const divisionCtrl = this.form.get('divisionCode')!;
      divisionCtrl.setValue(null);
      company ? divisionCtrl.enable() : divisionCtrl.disable();
      this.form.get('templateId')?.setValue(null);
      this.updateReportId();
    });

    this.form.get('divisionCode')?.valueChanges.subscribe(() => {
      this.form.get('templateId')?.setValue(null);
      this.updateReportId();
    });

    this.form.get('reportYear')?.valueChanges.subscribe(() => {
      this.updateReportId();
      if (this.form.get('reportPeriod')?.value === ReportPeriods.Yearly) {
        this.form.get('periodZone')?.setValue(this.yearlyPeriodZoneOption.value);
      }
    });

    this.form.get('reportPeriod')?.valueChanges.subscribe(period => {
      const zoneCtrl = this.form.get('periodZone')!;
      zoneCtrl.setValue(period === ReportPeriods.Yearly ? this.yearlyPeriodZoneOption.value : null);
      if (period) {
        zoneCtrl.enable();
        zoneCtrl.setValidators(Validators.required);
      } else {
        zoneCtrl.disable();
        zoneCtrl.clearValidators();
      }
      zoneCtrl.updateValueAndValidity();
    });

    if (this.isEditMode && this.data?.report) {
      this.prefillForEdit(this.data.report);
    }
  }

  private prefillForEdit(report: FinalReportEditData): void {
    const auditor = Object.values(AUDITOR_PROFILES).find(a => a.displayName === report.leadAuditor);
    // Match by the report's own backend templateId when it has one - a generated
    // report's stored templateFileName is the *generated output* file's name, not
    // the original template's, so matching by file name there is unreliable (either
    // finds nothing, or coincidentally matches an unrelated template).
    const template = report.templateId != null
      ? REPORT_TEMPLATES.find(t => t.templateId === report.templateId)
      : report.templateFileName
        ? REPORT_TEMPLATES.find(t => t.templateFileName === report.templateFileName)
        : undefined;
    // Key order drives the cascading valueChanges subscriptions above (company
    // enables division, reportPeriod enables periodZone) - each must patch before
    // the field it unlocks.
    this.form.patchValue({
      companyId: report.companyId,
      divisionCode: report.divisionCode,
      auditType: report.auditType,
      reportYear: new Date(new Date(report.createdDate).getFullYear(), 0, 1),
      reportPeriod: report.reportPeriod,
      periodZone: report.periodZone,
      leadAuditorId: auditor?.id ?? null,
      templateId: template?.id ?? null,
    });
    this.form.get('reportId')?.setValue(report.id);
  }

  private updateReportId(): void {
    if (this.isEditMode) return;
    const divisionCode = this.form.get('divisionCode')?.value;
    if (!divisionCode) {
      this.form.get('reportId')?.setValue('');
      return;
    }
    const reportYear: Date | null = this.form.get('reportYear')?.value;
    const year = reportYear ? new Date(reportYear).getFullYear() : new Date().getFullYear();
    const randomDigits = Math.floor(FINAL_REPORT_ID_RANDOM.Min + Math.random() * FINAL_REPORT_ID_RANDOM.Range);
    this.form.get('reportId')?.setValue(`${FINAL_REPORT_ID_PREFIX}${divisionCode}-${year}-${randomDigits}`);
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  getErrorMessage(name: string): string {
    const ctrl = this.form.get(name);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return FINAL_REPORT_ERROR_MESSAGES.Required;
    return FINAL_REPORT_ERROR_MESSAGES.Invalid;
  }

  onClose(): void {
    this.drawerRef.close(null);
  }

  onViewReport(): void {
    this.drawerRef.close(null);
    // Same routing rule as onSubmit() below: the form's templateId is the
    // selected template's static `id` (e.g. 'RPT-001') - route to its real
    // backend templateId when it has one, otherwise fall back to the existing
    // placeholder reportId.
    const selectedTemplateId = this.form.get('templateId')?.value;
    const selectedTemplate = REPORT_TEMPLATES.find(t => t.id === selectedTemplateId);
    console.log("selectedTemplate", selectedTemplate);
    const routeId = selectedTemplate?.templateId ?? this.reportId;
    this.router.navigate([REPORT_EDITOR_ROUTE], { queryParams: { id: routeId } });
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const division = this.divisionOptions.find(b => b.value === v.divisionCode);
    const auditor = this.leadAuditorOptions.find(a => a.value === v.leadAuditorId);

    this.drawerRef.close({
      companyId: v.companyId,
      divisionCode: v.divisionCode,
      divisionName: division?.label ?? '',
      auditType: v.auditType,
      reportId: v.reportId,
      reportYear: v.reportYear ? new Date(v.reportYear).getFullYear() : new Date().getFullYear(),
      reportPeriod: v.reportPeriod,
      periodZone: v.periodZone ?? '',
      leadAuditorId: v.leadAuditorId,
      leadAuditor: auditor?.label ?? '',
      templateId: v.templateId,
    });

    if (!this.isEditMode) {
      // v.templateId is the selected template's static `id` (e.g. 'RPT-001') -
      // look up its record for the real backend `templateId`. Static/seeded
      // templates carry `templateId: null` (never actually uploaded), so those
      // fall back to the existing placeholder reportId; a template created via
      // the real upload flow (see emitCreatedTemplate() in report-template/manage/report-template.component.ts)
      // has a real backend templateId and routes to that instead.
      const selectedTemplate = REPORT_TEMPLATES.find(t => t.id === v.templateId);
      const routeId = selectedTemplate?.templateId ?? this.reportId;
      this.router.navigate([REPORT_EDITOR_ROUTE], { queryParams: { id: routeId } });
    }
  }
}
