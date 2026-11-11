import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { PanelModule } from 'primeng/panel';

import { QuestionareSection } from '@/app/features/audits/audit-execution/rfi/com/questionare-section/questionare-section.component';
import type { EnrichedRFI } from '@/app/features/audits/audit-execution/rfi/models/rfi-list.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { submitStaticRfiResponse } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { RfiClientDrawerData, UploadedFileEntry, StaticDoc } from '../models/rfi-client.model';
import {
  RFI_DOCUMENT_UPLOAD,
  RFI_DRAWER,
  RFI_REFERENCE_DOCS,
  RfiResponseStatuses,
  RfiStatuses,
} from '@/app/features/audits/audit-execution/rfi/constants/rfi.constants';
import {
  RFI_RESPONSE_STATUS_DEFAULT_SEVERITY,
  RFI_RESPONSE_STATUS_SEVERITY,
  RFI_STATUS_DEFAULT_SEVERITY,
  type TagSeverity,
} from '@/app/features/audits/audit-execution/rfi/constants/rfi-labels.constants';
import {
  RFI_CLIENT_DRAWER,
  RFI_CLIENT_IN_PROGRESS_STATUS,
  RFI_CLIENT_TABS,
  RfiClientResponseModes,
  type RfiClientResponseMode,
} from '../constants/rfi-client.constants';
import { RFI_CLIENT_STATUS_SEVERITY } from '../constants/rfi-client-labels.constants';

@Component({
  selector: 'app-rfi-client',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    MessageModule,
    PanelModule,
    TagModule,
    TextareaModule,
    FileUploadModule,
    ToastModule,
    TooltipModule,
    QuestionareSection,
    DrawIconComponent,
  ],
  providers: [MessageService],
  templateUrl: './rfi-client.component.html',
  styleUrl: './rfi-client.component.scss',
})
export class RfiClientComponent implements OnInit, OnDestroy {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as RfiClientDrawerData | null;

  rfi: EnrichedRFI = this.data!.rfi;
  currentUser: string = this.data?.currentUser ?? '';
  isViewOnly: boolean = this.data?.viewOnly ?? false;

  @ViewChild('questionareRef') questionareSection?: QuestionareSection;

  readonly RfiStatuses = RfiStatuses;
  readonly RfiClientResponseModes = RfiClientResponseModes;

  activeTabIndex: string | number | undefined = RFI_CLIENT_TABS.ViewRfi;
  responseMode: RfiClientResponseMode = RfiClientResponseModes.New;
  private readonly boundOnResize = (event: MouseEvent) => this.onResize(event);
  private readonly boundOnResizeEnd = () => this.onResizeEnd();
  private subs = new Subscription();

  readonly closeLabel = $localize`:@@common.close:Close`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly nextLabel = $localize`:@@common.next:Next`;
  readonly backLabel = $localize`:@@common.back:Back`;
  readonly submitResponseLabel = $localize`:@@client.rfi.submitResponse:Submit Response`;
  readonly resubmitResponseLabel = $localize`:@@client.rfi.resubmitResponse:Resubmit Response`;
  readonly openDocumentLabel = $localize`:@@common.openDocument:Open document in new tab`;
  readonly downloadDocumentLabel = $localize`:@@common.downloadDocument:Download document`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;
  readonly chooseFilesLabel = $localize`:@@common.chooseFiles:Choose Files`;
  readonly pendingReviewLabel = $localize`:@@common.pendingReview:Pending Review`;
  readonly acceptedLabel = $localize`:@@common.accepted:Accepted`;
  readonly rejectedLabel = $localize`:@@common.rejected:Rejected`;
  readonly awaitingReviewMessage = $localize`:@@client.rfi.awaitingReview:Your response is awaiting review by the auditor. You will be notified once a decision is made.`;
  readonly completedMessage = $localize`:@@client.rfi.completedMessage:Your response has been reviewed and accepted by the auditor. This RFI is now completed.`;
  readonly openNewTabLabel = $localize`:@@common.openNewTab:Open in new tab`;
  readonly downloadLabel = $localize`:@@common.download:Download`;
  readonly optionalNotesPlaceholder = $localize`:@@client.rfi.optionalNotesPlaceholder:Optional: add any additional notes or clarifications…`;
  readonly optionalContextPlaceholder = $localize`:@@client.rfi.optionalContextPlaceholder:Optional: add any additional context or clarifications…`;
  readonly noAnswerProvidedLabel = $localize`:@@client.rfi.noAnswerProvided:No answer provided`;
  readonly featureUnderDevelopmentMessage = $localize`:@@common.featureUnderDevelopment:This feature is under development`;

  responseForm!: FormGroup;
  responseSubmitted = false;
  responseFiles: UploadedFileEntry[] = [];

  staticDocs: StaticDoc[] = [
    {
      ...RFI_REFERENCE_DOCS.AuditTheory,
      description: $localize`:@@client.rfi.auditTheoryDocument:Business Requirements Document detailing audit theory and engagement methodology`,
    },
    {
      ...RFI_REFERENCE_DOCS.AuraBrd,
      description: $localize`:@@client.rfi.auraDocument:Cygnus AURA platform Business Requirements Document — January 2026 release baseline`,
    },
  ];

  readonly MAX_FILE_SIZE_MB = RFI_DOCUMENT_UPLOAD.MaxFileSizeMb;
  readonly ALLOWED_TYPES = RFI_DOCUMENT_UPLOAD.AllowedTypes;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.buildResponseForm();
    this.responseMode = this.rfi.response ? RfiClientResponseModes.View : RfiClientResponseModes.New;
  }

  onResubmitResponse(): void {
    this.responseMode = RfiClientResponseModes.Resubmit;
    this.buildResponseForm();
  }

  onCancelResubmit(): void {
    this.responseMode = RfiClientResponseModes.View;
    this.buildResponseForm();
  }

  private buildResponseForm(): void {
    this.responseForm = this.fb.group({
      responseText: ['', Validators.required],
      explanationNotes: [''],
    });
    this.responseSubmitted = false;
    this.responseFiles = [];
  }

  isResponseFieldInvalid(name: string): boolean {
    const ctrl = this.responseForm.get(name);
    return !!(ctrl && ctrl.invalid && (this.responseSubmitted || ctrl.touched));
  }

  statusSeverity(status: string): TagSeverity {
    return RFI_CLIENT_STATUS_SEVERITY[status] ?? RFI_STATUS_DEFAULT_SEVERITY;
  }

  statusLabel(status: string): string {
    switch (status) {
      case RFI_CLIENT_IN_PROGRESS_STATUS:
        return $localize`:@@client.rfi.statusInProgress:In Progress`;
      case RfiStatuses.Completed:
        return $localize`:@@client.rfi.statusCompleted:Completed`;
      case RfiStatuses.UnderReview:
        return $localize`:@@client.rfi.statusUnderReview:Under Review`;
      case RfiStatuses.Overdue:
        return $localize`:@@client.rfi.statusOverdue:Overdue`;
      case RfiStatuses.Reopened:
        return $localize`:@@client.rfi.statusReopened:Reopened`;
      default:
        return $localize`:@@client.rfi.statusPending:Pending`;
    }
  }

  responseSeverity(status: string): TagSeverity {
    return RFI_RESPONSE_STATUS_SEVERITY[status] ?? RFI_RESPONSE_STATUS_DEFAULT_SEVERITY;
  }

  responseStatusLabel(status: string): string {
    switch (status) {
      case RfiResponseStatuses.Accepted:
        return $localize`:@@common.accepted:Accepted`;
      case RfiResponseStatuses.Rejected:
        return $localize`:@@common.rejected:Rejected`;
      default:
        return $localize`:@@common.pendingReview:Pending Review`;
    }
  }

  onResponseFileSelect(event: { files: File[] }): void {
    for (const file of event.files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.messageService.add({
          severity: 'warn', 
          summary: $localize`:@@common.invalidFileType:Invalid File Type`,
          detail: this.invalidFileTypeMessage(file.name),
        });
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.messageService.add({
          severity: 'warn', 
          summary: $localize`:@@common.fileTooLarge:File Too Large`,
          detail: this.fileTooLargeMessage(file.name),
        });
        continue;
      }
      const alreadyAdded = this.responseFiles.some(
        e => e.file.name === file.name && e.file.size === file.size
      );
      if (!alreadyAdded) {
        this.responseFiles.push({ file, description: '' });
      }
    }
  }

  questionCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@client.rfi.oneQuestion:1 Question`
      : $localize`:@@client.rfi.multipleQuestions:${count} Questions`;
  }

  fileDescriptionPlaceholder(fileName: string): string {
    return $localize`:@@client.rfi.fileDescriptionPlaceholder:Add description for ${fileName}…`;
  }
  responseNumberLabel(index: number): string {
    return $localize`:@@client.rfi.responseNumber:Response #${index}`;
  }

  responseHistoryMessage(count: number): string {
    return count === 1
      ? $localize`:@@client.rfi.onePreviousResponse:This RFI has 1 previous response that was rejected before the current submission.`
      : $localize`:@@client.rfi.multiplePreviousResponses:This RFI has ${count} previous responses that were rejected before the current submission.`;
  }

  private invalidFileTypeMessage(fileName: string): string {
    return $localize`:@@client.rfi.invalidFileType:${fileName} is not a supported file type.`;
  }

  private fileTooLargeMessage(fileName: string): string {
    return $localize`:@@client.rfi.fileTooLarge:${fileName} exceeds the 50 MB limit.`;
  }

  private answersRequiredMessage(count: number): string {
    return count === 1
      ? $localize`:@@client.rfi.oneAnswerRequired:1 question is missing an answer. Please answer all questions before submitting.`
      : $localize`:@@client.rfi.multipleAnswersRequired:${count} questions are missing answers. Please answer all questions before submitting.`;
  }

  private responseSuccessMessage(isResend: boolean): {
    summary: string;
    detail: string;
  } {
    return isResend
      ? {
        summary: $localize`:@@client.rfi.responseResent:Response Re-sent`,
        detail: $localize`:@@client.rfi.responseResentMessage:Your updated response has been re-sent to the auditor.`,
      }
      : {
        summary: $localize`:@@client.rfi.responseSubmitted:Response Submitted`,
        detail: $localize`:@@client.rfi.responseSubmittedMessage:Your response has been submitted successfully.`,
      };
  }

  removeResponseFile(index: number): void {
    this.responseFiles.splice(index, 1);
  }

  onEditResponse(): void {
    this.responseMode = RfiClientResponseModes.Edit;
    if (this.rfi?.response) {
      this.responseForm.patchValue({
        responseText: this.rfi.response.responseText,
        explanationNotes: this.rfi.response.explanationNotes ?? '',
      });
    }
  }

  onClearAndNewResponse(): void {
    this.responseMode = RfiClientResponseModes.New;
    this.buildResponseForm();
  }

  onCancelEdit(): void {
    this.responseMode = RfiClientResponseModes.View;
    this.buildResponseForm();
  }

  onNextToQuestionnaire(): void {
    this.responseSubmitted = true;
    this.responseForm.markAllAsTouched();

    if (this.responseForm.invalid) {
      this.messageService.add({
        severity: 'error', 
        summary: $localize`:@@common.validationError:Validation Error`,
        detail: $localize`:@@client.rfi.responseRequired:Response text is required.`,
      });
      return;
    }

    this.activeTabIndex = RFI_CLIENT_TABS.Questionnaire;
    this.responseSubmitted = false;
  }

  onSubmitResponse(): void {
    // Validate questionnaire: every question must have an answer
    const rows = this.questionareSection?.rows ?? [];
    const questionsWithText = rows.filter(r => r.questionText.trim());
    const unanswered = questionsWithText.filter(r => !r.answerText.trim());

    if (questionsWithText.length > 0 && unanswered.length > 0) {
      this.messageService.add({
        severity: 'error', 
        summary: $localize`:@@client.rfi.answersRequired:Answers Required`,
        detail: this.answersRequiredMessage(unanswered.length),
      });
      return;
    }

    this.responseSubmitted = true;
    this.responseForm.markAllAsTouched();

    if (this.responseForm.invalid) {
      this.messageService.add({
        severity: 'error', 
        summary: $localize`:@@common.validationError:Validation Error`,
        detail: $localize`:@@client.rfi.responseRequired:Response text is required.`,
      });
      return;
    }

    const isResend = this.responseMode === RfiClientResponseModes.Edit || this.responseMode === RfiClientResponseModes.Resubmit;
    const questionnaireData = (this.questionareSection?.rows ?? []).map(r => ({
      question: r.questionText,
      answer: r.answerText,
      dueDate: r.dueDate,
    }));

    console.log(isResend ? 'Re-send Response Payload:' : 'New Response Payload:', {
      ...this.responseForm.value,
      responseFiles: this.responseFiles,
      rfiId: this.rfi?.id,
      questionnaire: questionnaireData,
    });

    // Persist into the shared RFI static data — moves the RFI to
    // 'under-review' and records the response + questionnaire answers, so
    // both rfi-list.component.html and rfi-client-list.component.html reflect it
    // immediately (they both read the same in-memory tree).
    submitStaticRfiResponse(
      this.rfi.id,
      {
        responseText: this.responseForm.value.responseText,
        explanationNotes: this.responseForm.value.explanationNotes || undefined,
        responseDocs: this.responseFiles.map(f => ({ name: f.file.name, url: '', description: f.description })),
        submittedAt: new Date().toISOString(),
      },
      questionnaireData,
    );

    const successMessage = this.responseSuccessMessage(isResend);

    this.messageService.add({
      severity: 'success',
      summary: successMessage.summary,
      detail: successMessage.detail,
    });

    this.onClose();
  }

  // These docs are served by the real backend (`http://localhost:5251/uploads/...`),
  // not through HttpClient, so the global error interceptor can't catch a failure
  // here — check reachability ourselves before opening/downloading.
  private async isDocReachable(url: string): Promise<boolean> {
    try {
      await fetch(url, { method: 'HEAD' });
      return true;
    } catch {
      return false;
    }
  }

  async openDoc(url: string): Promise<void> {
    if (!(await this.isDocReachable(url))) {
      this.messageService.add({ severity: 'warn', summary: '', detail: this.featureUnderDevelopmentMessage });
      return;
    }
    window.open(url, '_blank');
  }

  async downloadDoc(doc: StaticDoc): Promise<void> {
    if (!(await this.isDocReachable(doc.url))) {
      this.messageService.add({ severity: 'warn', summary: '', detail: this.featureUnderDevelopmentMessage });
      return;
    }
    const a = document.createElement('a');
    a.href = doc.url;
    a.download = doc.name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  resolveFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'pdf')                                       return 'pi pi-file-pdf';
    if (['doc', 'docx'].includes(ext))                       return 'pi pi-file-word';
    if (['xls', 'xlsx', 'csv'].includes(ext))                return 'pi pi-file-excel';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'pi pi-image';
    return 'pi pi-file';
  }

  onClose(): void {
    this.subs.unsubscribe();
    this.drawerRef.close(null);
  }

  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    document.addEventListener('mousemove', this.boundOnResize);
    document.addEventListener('mouseup', this.boundOnResizeEnd);
  }

  private onResize(event: MouseEvent): void {
    const newWidth = window.innerWidth - event.clientX;
    if (newWidth >= RFI_DRAWER.ResizeMinWidth && newWidth <= RFI_DRAWER.ResizeMaxWidth) {
      const panel = document.querySelector(RFI_CLIENT_DRAWER.PanelSelector) as HTMLElement | null;
      if (panel) panel.style.width = `${newWidth}px`;
    }
  }

  private onResizeEnd(): void {
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundOnResizeEnd);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundOnResizeEnd);
  }
}
