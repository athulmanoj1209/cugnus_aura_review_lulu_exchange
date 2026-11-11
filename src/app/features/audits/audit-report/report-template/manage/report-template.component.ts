import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { environment } from '@/app/environments/environment';
import { REPORT_TEMPLATE_STATIC_COMPANIES, REPORT_COMPANY_LOOKUP } from '@/app/features/audits/audit-report/report-template/report-template-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import type { ReportTemplateStatus } from '../models/report-template-static-data.model';
import {
  ParsingStatus,
  REPORT_EDITOR_ROUTE,
  REPORT_TEMPLATE_FILE_EXTENSION,
  REPORT_TEMPLATE_ID_PREFIX,
  REPORT_TEMPLATE_MAX_FILE_SIZE_BYTES,
  REPORT_TEMPLATE_SSE_EVENT,
  REPORT_TEMPLATE_UPLOAD_ACCEPTED_STATUS,
  REPORT_TEMPLATE_UPLOAD_FIELDS,
  REPORT_TEMPLATE_UPLOAD_PATH,
  REPORT_TEMPLATE_USAGE_CHECK_DELAY_MS,
  ReportTemplateDialogModes,
  ReportTemplateStatuses,
  ReportTemplateUploadPhases,
  type ReportTemplateDialogMode,
  type ReportTemplateUploadPhase,
} from '../constants/report-template.constants';
import {
  REPORT_TEMPLATE_INDUSTRY_CODE_TO_OPTION,
  REPORT_TEMPLATE_INDUSTRY_TYPE_OPTIONS,
} from '../constants/report-template-labels.constants';
import { REPORT_TEMPLATE_FILE_ERRORS, REPORT_TEMPLATE_UPLOAD_ERRORS } from '../constants/report-template-messages.constants';

// The seed templates store industryType as a snake_case code (e.g.
// 'professional_services'), not one of the option labels - without this
// lookup, editing an existing template leaves the Industry Type select blank
// because the raw code never matches an option string.
function normalizeIndustryType(value: string | null | undefined): string {
  if (!value) return '';
  return REPORT_TEMPLATE_INDUSTRY_CODE_TO_OPTION[value] ?? value;
}

export interface CompanyOption {
  label: string;
  value: string;
}

export interface DivisionOption {
  label: string;
  value: string;
  industryType: string;
}

// Structurally compatible with report-template-list.component.ts's ReportTemplate - kept
// as its own type here so this shared dialog doesn't import from an apps/
// feature module. isUsed gates whether the template file can be replaced
// in edit mode (see attemptUnlockFile()/saveChanges() below).
export interface EditReportTemplateData {
  id: string;
  /** Backend-issued numeric id from POST /Audit/upload-template - null for a
   *  template that was never actually uploaded (kept as-is through edit mode),
   *  set from the SSE "Completed" notification's templateId in
   *  emitCreatedTemplate() below for a freshly created one. */
  templateId: number | null;
  companyId: string;
  divisionName: string;
  divisionCode: string;
  templateName: string;
  templateDescription: string;
  industryType: string;
  templateFileName: string;
  status: ReportTemplateStatus;
  isUsed: boolean;
}

// Real company/division roster from report-template-static-data.ts (itself an
// independently-authored copy of divisions/division-static-data.ts) - drives
// both the Company/Division selects and the Industry Type auto-selection.
// Companies/divisions that don't have this yet (e.g. newly created via the
// Organization module) are unioned in from the canonical sources at render
// time in the component below (see companyOptions/divisionOptions getters) so
// they're selectable too, just without an Industry Type to auto-fill.
const LOCAL_COMPANY_OPTIONS: CompanyOption[] = REPORT_COMPANY_LOOKUP.map(c => ({ label: c.label, value: c.id }));

const LOCAL_DIVISION_OPTIONS_BY_COMPANY: Record<string, DivisionOption[]> = Object.fromEntries(
  REPORT_TEMPLATE_STATIC_COMPANIES.map(co => [
    co.id,
    co.divisions.map(b => ({
      label: b.divisionName,
      value: b.divisionCode,
      industryType: normalizeIndustryType(b.industryType),
    })),
  ]),
);

// Shape of the 202 body returned by POST /Audit/upload-template
// (AURA.ViewModels.UploadTemplateAcceptedViewModel). The backend currently
// serializes as camelCase, but both casings are tolerated defensively.
export interface UploadTemplateAcceptedViewModel {
  templateId: number;
  uploadTemplateEventsPath: string;
  message: string;
}

// Shape of each SSE "notifications" event payload (AURA.Program.TemplateParseNotification).
export interface TemplateParseNotification {
  templateId: number;
  message: string;
  parsingStatus: number;
  createdAt: string;
}

@Component({
  selector: 'app-report-template',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    FileUploadModule,
    MessageModule,
    DrawIconComponent
  ],
  templateUrl: './report-template.component.html',
  styleUrl: './report-template.component.scss',
})
export class ReportTemplateComponent implements OnInit, OnDestroy {
  @Input() mode: ReportTemplateDialogMode = ReportTemplateDialogModes.Create;
  @Input() editTemplate: EditReportTemplateData | null = null;
  @Output() saved = new EventEmitter<EditReportTemplateData>();
  @Output() created = new EventEmitter<EditReportTemplateData>();
  @Output() processingStarted = new EventEmitter<boolean>();

  private readonly companyDataService = inject(CompanyDataService);

  readonly ParsingStatus = ParsingStatus;
  readonly ReportTemplateDialogModes = ReportTemplateDialogModes;
  readonly ReportTemplateUploadPhases = ReportTemplateUploadPhases;
  readonly FILE_EXTENSION = REPORT_TEMPLATE_FILE_EXTENSION;
  readonly MAX_FILE_SIZE_BYTES = REPORT_TEMPLATE_MAX_FILE_SIZE_BYTES;
  readonly industryTypeOptions = REPORT_TEMPLATE_INDUSTRY_TYPE_OPTIONS;

  get companyOptions(): CompanyOption[] {
    const seen = new Set<string>();
    const options: CompanyOption[] = [...LOCAL_COMPANY_OPTIONS];
    options.forEach(o => seen.add(o.value));
    for (const c of this.companyDataService.all) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        options.push({ label: c.companyName, value: c.id });
      }
    }
    // Deactivated companies are excluded, except the one already selected on
    // the form (so editing a template under a since-blocked company doesn't
    // blank the field).
    const currentId = this.uploadForm?.get('company')?.value;
    return options.filter(o => !this.companyDataService.isCompanyBlocked(o.value) || o.value === currentId);
  }

  private readonly uploadUrl = `${environment.apiBaseUrl}${REPORT_TEMPLATE_UPLOAD_PATH}`;

  private eventSource: EventSource | null = null;

  uploadForm!: FormGroup;

  // Edit mode only - the file starts locked (see the __file-locked block in
  // report-template.component.html); attemptUnlockFile() flips this once the usage
  // check clears.
  fileUnlocked = signal(false);
  checkingUsage = signal(false);

  phase = signal<ReportTemplateUploadPhase>(ReportTemplateUploadPhases.Form);
  submitted = false;

  selectedFile = signal<File | null>(null);
  fileError = signal<string | null>(null);

  uploading = signal(false);
  errorMessage = signal<string | null>(null);

  accepted = signal<UploadTemplateAcceptedViewModel | null>(null);
  notifications = signal<TemplateParseNotification[]>([]);
  sseConnectionError = signal(false);

  readonly activeLabel = $localize`:@@common.active:Active`;
  readonly inactiveLabel = $localize`:@@common.inactive:Inactive`;

  // The most recently received notification decides the overall outcome -
  // every earlier one is just a step along the way (see report-template.component.html).
  readonly firstFailedNotification = computed<TemplateParseNotification | null>(() => {
    const list = this.notifications();
    // return list.length ? list[list.length - 1] : null;
    return list.find(notification => notification.parsingStatus === ParsingStatus.Failed) || null;
  });

  readonly parsingFinished = computed(() => {
    const status = this.firstFailedNotification()?.parsingStatus;
    return status === ParsingStatus.Completed || status === ParsingStatus.Failed;
  });

  readonly parsingFailed = computed(() => this.firstFailedNotification()?.parsingStatus === ParsingStatus.Failed);

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const template = this.mode === ReportTemplateDialogModes.Edit ? this.editTemplate : null;

    console.log("to be edited template", template);
    this.uploadForm = this.fb.group({
      company: [template?.companyId ?? '', Validators.required],
      division: [template?.divisionCode ?? '', Validators.required],
      templateName: [template?.templateName ?? '', Validators.required],
      templateDescription: [template?.templateDescription ?? ''],
      industryType: [normalizeIndustryType(template?.industryType), Validators.required],
      isActive: [template ? template.status === ReportTemplateStatuses.Active : true],
    });
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }

  isFieldInvalid(name: string): boolean {
    const control = this.uploadForm.get(name);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  get divisionOptions(): DivisionOption[] {
    const companyId = this.uploadForm.get('company')?.value;
    if (!companyId) return [];

    const seen = new Set<string>();
    const options: DivisionOption[] = (LOCAL_DIVISION_OPTIONS_BY_COMPANY[companyId] ?? []).slice();
    options.forEach(o => seen.add(o.value));

    // Divisions that have no report templates yet (e.g. newly created via the
    // Divisions module) are still selectable here - just with no Industry Type
    // to auto-fill, since that taxonomy only exists on the report-templates side.
    const canonicalCompany = DIVISION_STATIC_COMPANIES.find(co => co.id === companyId);
    if (canonicalCompany) {
      for (const b of canonicalCompany.divisions) {
        if (!seen.has(b.divisionCode)) {
          seen.add(b.divisionCode);
          options.push({ label: b.divisionName, value: b.divisionCode, industryType: '' });
        }
      }
    }

    // Deactivated divisions (or any division under a deactivated company) are
    // excluded, except the division already selected on the form.
    const companyBlocked = this.companyDataService.isCompanyBlocked(companyId);
    const currentDivisionCode = this.uploadForm?.get('division')?.value;
    return options.filter(o => {
      if (o.value === currentDivisionCode) return true;
      const division = canonicalCompany?.divisions.find(b => b.divisionCode === o.value);
      return division ? division.status === DivisionStatuses.Active && !companyBlocked : true;
    });
  }

  onCompanyChange(): void {
    this.uploadForm.patchValue({ division: '', industryType: '' });
  }

  onDivisionChange(): void {
    const divisionCode = this.uploadForm.get('division')?.value;
    const match = this.divisionOptions.find(b => b.value === divisionCode);
    if (match) {
      this.uploadForm.patchValue({ industryType: match.industryType });
    }
  }

  toggleStatus(): void {
    this.uploadForm.patchValue({ isActive: !this.uploadForm.value.isActive });
  }

  // Re-checks right before unlocking rather than trusting whatever isUsed
  // value the list happened to load with - a report could start using this
  // template at any point after that list was fetched.
  // TODO: replace this local check with a real backend call once one
  // exists, e.g. GET /Audit/report-templates/{id}/usage -> { isUsed }.
  attemptUnlockFile(): void {
    if (!this.editTemplate) {
      return;
    }

    this.checkingUsage.set(true);
    this.fileError.set(null);

    setTimeout(() => {
      this.checkingUsage.set(false);

      if (this.editTemplate?.isUsed) {
        this.fileError.set(REPORT_TEMPLATE_FILE_ERRORS.InUse);
        return;
      }

      this.fileUnlocked.set(true);
    }, REPORT_TEMPLATE_USAGE_CHECK_DELAY_MS);
  }

  onFileSelected(event: FileSelectEvent): void {
    const file = (event.files as FileList | File[])[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(REPORT_TEMPLATE_FILE_EXTENSION)) {
      this.fileError.set(REPORT_TEMPLATE_FILE_ERRORS.DocxOnly);
      this.selectedFile.set(null);
      return;
    }

    this.fileError.set(null);
    this.selectedFile.set(file);
  }

  uploadTemplate(): void {
    this.submitted = true;

    if (!this.selectedFile()) {
      this.fileError.set(REPORT_TEMPLATE_FILE_ERRORS.FileRequired);
    }

    if (this.uploadForm.invalid || !this.selectedFile() || this.uploading()) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    this.uploading.set(true);
    this.errorMessage.set(null);

    const fields = REPORT_TEMPLATE_UPLOAD_FIELDS;
    const formData = new FormData();
    formData.append(fields.File, this.selectedFile()!, this.selectedFile()!.name);
    formData.append(fields.CompanyId, this.uploadForm.value.company);
    formData.append(fields.DivisionCode, this.uploadForm.value.division);
    formData.append(fields.TemplateName, this.uploadForm.value.templateName);
    if (this.uploadForm.value.templateDescription) {
      formData.append(fields.TemplateDescription, this.uploadForm.value.templateDescription);
    }
    formData.append(fields.IndustryType, this.uploadForm.value.industryType);
    formData.append(fields.IsActive, String(this.uploadForm.value.isActive));

    this.http.post(this.uploadUrl, formData, { observe: 'response' }).subscribe({
      next: (response) => {
        this.uploading.set(false);

        if (response.status === REPORT_TEMPLATE_UPLOAD_ACCEPTED_STATUS && response.body) {
          const accepted = this.normalizeAccepted(response.body);
          this.accepted.set(accepted);
          this.phase.set(ReportTemplateUploadPhases.Processing);
          this.processingStarted.emit(true);
          this.connectToEvents(accepted.uploadTemplateEventsPath);
        } else {
          this.errorMessage.set(REPORT_TEMPLATE_UPLOAD_ERRORS.UnexpectedResponse);
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.errorMessage.set(
          err?.error?.errorMessage ?? err?.error?.message ?? err?.error ?? REPORT_TEMPLATE_UPLOAD_ERRORS.UploadFailed,
        );
      },
    });
  }

  onSubmit(): void {
    if (this.mode === ReportTemplateDialogModes.Edit) {
      this.saveChanges();
    } else {
      this.uploadTemplate();
    }
  }

  saveChanges(): void {
    this.submitted = true;

    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    if (!this.editTemplate) {
      return;
    }

    const v = this.uploadForm.value;
    this.saved.emit({
      ...this.editTemplate,
      companyId: v.company,
      divisionCode: v.division,
      divisionName: this.divisionOptions.find(b => b.value === v.division)?.label ?? this.editTemplate.divisionName,
      templateName: v.templateName,
      templateDescription: v.templateDescription,
      industryType: v.industryType,
      status: v.isActive ? ReportTemplateStatuses.Active : ReportTemplateStatuses.Inactive,
      templateFileName: this.selectedFile()?.name ?? this.editTemplate.templateFileName,
    });
  }

  onNotificationClick(notification: TemplateParseNotification): void {
    if (notification.parsingStatus === ParsingStatus.Completed) {
      this.router.navigate([REPORT_EDITOR_ROUTE], { queryParams: { id: notification.templateId } });
    }
  }

  private connectToEvents(path: string): void {
    const origin = new URL(environment.apiBaseUrl).origin;
    const cleanPath = path.replace(/^\/+/, '');
    const eventsUrl = `${origin}/${cleanPath}`;

    // This opens a live connection to the backend SSE endpoint.
    // It allows the backend to keep sending messages to the frontend without the frontend repeatedly calling the API.
    this.eventSource = new EventSource(eventsUrl);

    //This tells the frontend to listen for SSE events named notifications.
    // Whenever the backend sends a notifications event, this code will run.
    this.eventSource.addEventListener(REPORT_TEMPLATE_SSE_EVENT, (event: MessageEvent) => {
      this.sseConnectionError.set(false);

      try {
        const raw = JSON.parse(event.data);
        const notification = this.normalizeNotification(raw);
        this.notifications.update((list) =>
          [...list, notification].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        );

        // The backend closes its side of the stream right after the final
        // Completed notification (its per-job channel is single-use and gone
        // by then) - close our end too, deliberately, so the browser's
        // EventSource does not treat that server-initiated close as a
        // dropped connection and auto-reconnect to a channel that will never
        // exist again. Failed notifications are per-placeholder progress
        // reports, not terminal - parsing keeps going and still ends in a
        // Completed notification, so the stream must stay open for those.
        if (notification.parsingStatus === ParsingStatus.Completed) {
          this.eventSource?.close();
          console.log("template created:", notification.templateId);  
          this.emitCreatedTemplate(notification.templateId);
        }
      } catch {
        // Malformed SSE payload - drop it silently rather than crashing the dialog.
      }
    });

    this.eventSource.onerror = () => {
      this.sseConnectionError.set(true);
    };
  }

  // The SSE "Completed" notification only carries `templateId` - the richer
  // create-time data still sits in `uploadForm`/`selectedFile()` (never reset
  // during the upload -> processing -> completion flow), so it's assembled
  // here rather than trusting the notification payload to have it.
  private emitCreatedTemplate(templateId: number): void {
    const v = this.uploadForm.value;
    this.created.emit({
      id: `${REPORT_TEMPLATE_ID_PREFIX}${templateId}`,
      templateId,
      companyId: v.company,
      divisionCode: v.division,
      divisionName: this.divisionOptions.find(b => b.value === v.division)?.label ?? '',
      templateName: v.templateName,
      templateDescription: v.templateDescription,
      industryType: v.industryType,
      status: v.isActive ? ReportTemplateStatuses.Active : ReportTemplateStatuses.Inactive,
      templateFileName: this.selectedFile()?.name ?? '',
      isUsed: false,
    });
  }

  private normalizeAccepted(raw: any): UploadTemplateAcceptedViewModel {
    return {
      templateId: raw.templateId ?? raw.TemplateId,
      uploadTemplateEventsPath: raw.uploadTemplateEventsPath ?? raw.UploadTemplateEventsPath,
      message: raw.message ?? raw.Message,
    };
  }

  private normalizeNotification(raw: any): TemplateParseNotification {
    return {
      templateId: raw.templateId ?? raw.TemplateId,
      message: raw.message ?? raw.Message,
      parsingStatus: raw.parsingStatus ?? raw.ParsingStatus,
      createdAt: raw.createdAt ?? raw.CreatedAt,
    };
  }
}
