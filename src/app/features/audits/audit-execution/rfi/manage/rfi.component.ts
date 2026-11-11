import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { blockBodyScroll } from 'primeng/dom';
import { QuestionareSection } from '@/app/features/audits/audit-execution/rfi/com/questionare-section/questionare-section.component';
import { MOCK_RFI_LIBRARY } from '@/app/features/audits/libraries/rfi-library/rfi-library-static-data';
import { MOCK_SCOPE_LIBRARY } from '@/app/features/audits/libraries/scope-library/scope-library-static-data';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import {
  rfiDivisionOptionsForCompany,
  rfiSubDivisionOptionsForDivision,
  rfiTopLevelScopeOptionsForSubDivision,
  rfiSubScopesOf,
  upsertStaticRfi,
} from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { divisionHasSubDivisions } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { RfiDrawerData, UploadedFileEntry } from '@/app/features/audits/audit-execution/rfi/models/rfi.model';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  RFI_DESCRIPTION_MAX_LENGTH,
  RFI_DESCRIPTION_MIN_LENGTH,
  RFI_DOCUMENT_UPLOAD,
  RFI_DRAWER,
  RFI_FORM_TABS,
  RFI_TITLE_MAX_LENGTH,
  RFI_TITLE_MIN_LENGTH,
  RfiSources,
  RfiViewerRoles,
  type RfiSource,
} from '../constants/rfi.constants';
import { RFI_OWNER_OPTIONS, RFI_SOURCE_OPTIONS, RFI_TAB_LABELS } from '../constants/rfi-labels.constants';
import {
  RFI_CONFIRM_DIALOGS,
  RFI_ERROR_MESSAGES,
  RFI_FORM_NOTICES,
  RFI_INVALID_FIELD_MESSAGE,
  RFI_TOAST_MESSAGES,
} from '../constants/rfi-messages.constants';

@Component({
  selector: 'app-rfi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DividerModule,
    InputTextModule,
    MessageModule,
    PanelModule,
    SelectModule,
    TagModule,
    TextareaModule,
    DatePickerModule,
    FileUploadModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    SelectButtonModule,
    QuestionareSection,
    DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './rfi.component.html',
  styleUrl: './rfi.component.scss',
})
export class RfiComponent implements OnInit, OnDestroy {
  private readonly drawerRef = inject(DrawerRef);
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly companyDataService = inject(CompanyDataService);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as RfiDrawerData | null;

  @ViewChild('questionareRef') questionareSection?: QuestionareSection;
  private readonly toast = inject(ToastService);

  // ── Current user — drives auditor vs client rendering ─────────────────────
  currentUser: string = this.data?.currentUser ?? RfiViewerRoles.Auditor;

  readonly RfiSources = RfiSources;

  // Label for tab 0
  get tab1Label(): string {
    return RFI_TAB_LABELS.Add;
  }

  rfiForm!: FormGroup;
  submitted = false;
  activeTabIndex: string | number | undefined = RFI_FORM_TABS.Details;
  drawerWidth: string = RFI_DRAWER.InitialWidth;
  private readonly boundOnResize = (event: MouseEvent) => this.onResize(event);
  private readonly boundOnResizeEnd = () => this.onResizeEnd();
  private subs = new Subscription();

  // ── Uploaded Files ──────────────────────────────────────────────────────────
  uploadedFiles: UploadedFileEntry[] = [];

  // ── Missing-description dialog state ──────────────────────────────────────
  showDescWarningDialog = false;
  emptyDescFileNames: string[] = [];

  readonly MAX_FILE_SIZE_MB = RFI_DOCUMENT_UPLOAD.MaxFileSizeMb;

  readonly ALLOWED_TYPES = RFI_DOCUMENT_UPLOAD.AllowedTypes;

  get companyOptions() {
    return this.companyDataService.all.map(c => ({ label: c.companyName, value: c.id }));
  }

  get filteredDivisionOptions() {
    const companyId = this.rfiForm?.get('company')?.value;
    return rfiDivisionOptionsForCompany(companyId);
  }

  get filteredSubDivisionOptions() {
    const companyId = this.rfiForm?.get('company')?.value;
    const divisionId = this.rfiForm?.get('division')?.value;
    return rfiSubDivisionOptionsForDivision(companyId, divisionId);
  }

  // ── Scope Options ("fresh" mode) — top-level scopes for the selected
  // company/division/sub-division, cascading from the RFI static data. With
  // no sub-division selected, the division's own division-level scopes. ─────────
  get scopes() {
    const companyId = this.rfiForm?.get('company')?.value;
    const divisionId = this.rfiForm?.get('division')?.value;
    if (!divisionId) return [];
    const subDivisionId = this.rfiForm?.get('subDivision')?.value;
    return rfiTopLevelScopeOptionsForSubDivision(companyId, divisionId, subDivisionId);
  }

  // ── Sub Scope Options ("fresh" mode) — sub-scopes of the selected scope ──
  get subScopes() {
    const scopeId = this.rfiForm?.get('auditScope')?.value;
    return rfiSubScopesOf(scopeId).map(s => ({ label: s.scopeName, value: s.id }));
  }

  fileDescriptionPlaceholder(fileName: string): string {
    return $localize`:@@audit.rfi.fileDescriptionPlaceholder:Add description for ${fileName}:fileName:…`;
  }

  // ── Owners ────────────────────────────────────────────────────────────────
  owners = RFI_OWNER_OPTIONS;

  // ── Library Mode ──────────────────────────────────────────────────────────
  rfiSource: RfiSource = RfiSources.Fresh;
  selectedLibraryRfiId: string | null = null;
  isDescriptionFromLibrary = false;
  libraryQuestions: string[] = [];

  rfiSourceOptions = RFI_SOURCE_OPTIONS;

  get libraryRfiOptions() {
    const scopeId = this.rfiForm?.get('auditScope')?.value;
    const subScopeId = this.rfiForm?.get('subScope')?.value;
    return MOCK_RFI_LIBRARY
      .filter(r => {
        if (subScopeId) return r.subScopeId === subScopeId;
        if (scopeId) return r.scopeId === scopeId;
        return true;
      })
      .map(r => ({ label: r.title, value: r.id }));
  }

  get activeScopeOptions() {
    if (this.rfiSource === RfiSources.Library) {
      const deptId = this.rfiForm?.get('subDivision')?.value;
      return MOCK_SCOPE_LIBRARY
        .filter(s => s.scopeLevel === ScopeLevels.Scope && (deptId ? s.subDivision === deptId : true))
        .map(s => ({ label: s.title, value: s.id }));
    }
    return this.scopes;
  }

  get activeSubScopeOptions() {
    if (this.rfiSource === RfiSources.Library) {
      const scopeId = this.rfiForm?.get('auditScope')?.value;
      if (!scopeId) return [];
      return MOCK_SCOPE_LIBRARY
        .filter(s => s.scopeLevel === ScopeLevels.SubScope && s.parentScopeId === scopeId)
        .map(s => ({ label: s.title, value: s.id }));
    }
    return this.subScopes;
  }

  // ── Cascade: company → division → sub-division → scope → rfi ─────────────────

  onCompanyChange(): void {
    this.rfiForm.patchValue({ division: null, subDivision: null });
    this.syncSubDivisionRequirement();
    this._resetScopeCascade();
  }

  onDivisionChange(): void {
    this.rfiForm.patchValue({ subDivision: null });
    this.syncSubDivisionRequirement();
    this._resetScopeCascade();
  }

  // ── Sub-Division requirement ──────────────────────────────────────────────
  // Mirrors the Add Audit Scope drawer: scopes live only under the leaf node, so
  // a division with sub-divisions (live `hasSubDivision` + at least one
  // sub-division) needs a sub-division before its scopes can be picked; a
  // division without any offers its own division-level scopes directly.

  /** The selected division has sub-divisions to pick from. */
  get selectedDivisionHasSubDivisions(): boolean {
    const v = this.rfiForm?.getRawValue();
    return !!v?.division && divisionHasSubDivisions(v.company, v.division);
  }

  /** Add-only drawer — required whenever the division has sub-divisions. */
  get isSubDivisionRequired(): boolean {
    return this.selectedDivisionHasSubDivisions;
  }

  /** Division chosen, plus a sub-division when one is required — the scope's owner is known. */
  get isScopeOwnerResolved(): boolean {
    const v = this.rfiForm?.getRawValue();
    return !!v?.division && (!!v.subDivision || !this.isSubDivisionRequired);
  }

  private syncSubDivisionRequirement(): void {
    const ctrl = this.rfiForm.get('subDivision');
    if (!ctrl) return;
    if (this.isSubDivisionRequired) {
      ctrl.setValidators(Validators.required);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  onSubDivisionChange(): void {
    this._resetScopeCascade();
  }

  private _resetScopeCascade(): void {
    // The scope list depends on division/sub-division in both modes, so a
    // previously-picked scope no longer belongs to the new selection.
    this.rfiForm.patchValue({ auditScope: null, subScope: null });
    if (this.rfiSource !== RfiSources.Library) return;
    this.rfiForm.patchValue({ title: '', description: '', additionalDescription: '' });
    this.selectedLibraryRfiId = null;
    this.isDescriptionFromLibrary = false;
    this.libraryQuestions = [];
  }

  onRfiSourceChange(): void {
    this.selectedLibraryRfiId = null;
    this.isDescriptionFromLibrary = false;
    this.libraryQuestions = [];
    this.rfiForm.patchValue({ company: null, division: null, subDivision: null, auditScope: null, subScope: null, title: '', description: '' });
    if (this.rfiSource === RfiSources.Fresh) {
      this.rfiForm.get('title')?.setValidators([
        Validators.required, Validators.minLength(RFI_TITLE_MIN_LENGTH), Validators.maxLength(RFI_TITLE_MAX_LENGTH),
      ]);
      this.rfiForm.get('subScope')?.setValidators([Validators.required]);
    } else {
      this.rfiForm.get('title')?.setValidators([Validators.required]);
      this.rfiForm.get('subScope')?.clearValidators();
    }
    this.rfiForm.get('title')?.updateValueAndValidity();
    this.rfiForm.get('subScope')?.updateValueAndValidity();
    this.syncSubDivisionRequirement();
  }

  onLibraryRfiSelect(rfiId: string | null): void {
    if (!rfiId) {
      this.isDescriptionFromLibrary = false;
      this.libraryQuestions = [];
      this.rfiForm.patchValue({ title: '', description: '', additionalDescription: '' });
      return;
    }
    const item = MOCK_RFI_LIBRARY.find(r => r.id === rfiId);
    if (!item) return;
    this.rfiForm.patchValue({
      title: item.title,
      description: item.description,
      additionalDescription: '',
    });
    this.isDescriptionFromLibrary = true;
    this.libraryQuestions = [...(item.questions ?? [])];
  }

  onLibraryAuditScopeChange(): void {
    if (this.rfiSource === RfiSources.Library) {
      this.selectedLibraryRfiId = null;
      this.isDescriptionFromLibrary = false;
      this.libraryQuestions = [];
      this.rfiForm.patchValue({ subScope: null, title: '', description: '', additionalDescription: '' });
    }
  }

  onLibrarySubScopeChange(): void {
    if (this.rfiSource === RfiSources.Library) {
      this.selectedLibraryRfiId = null;
      this.isDescriptionFromLibrary = false;
      this.libraryQuestions = [];
      this.rfiForm.patchValue({ title: '', description: '', additionalDescription: '' });
    }
  }

  // ── Error Messages ─────────────────────────────────────────────────────────
  rfiFormErrorMessages: Record<string, Record<string, string>> = RFI_ERROR_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  // ── Scope label for questionnaire tab ──────────────────────────────────────
  get selectedScopeLabel(): string {
    const match = this.scopes.find(s => s.value === this.rfiForm.get('auditScope')?.value);
    return match?.label ?? '';
  }

  // ── Sub-scope label for questionnaire tab ──────────────────────────────────
  get selectedSubScopeLabel(): string {
    const match = this.subScopes.find(s => s.value === this.rfiForm.get('subScope')?.value);
    return match?.label ?? '';
  }

  // ── Error Message ──────────────────────────────────────────────────────────
  getErrorMessage(controlName: string): string {
    const control = this.rfiForm.get(controlName);
    if (!control || !control.errors) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    return this.rfiFormErrorMessages[controlName]?.[firstErrorKey] || RFI_INVALID_FIELD_MESSAGE;
  }

  // ── Field Validation ───────────────────────────────────────────────────────
  isFieldInvalid(name: string): boolean {
    const ctrl = this.rfiForm.get(name);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  // ── Form Builder ───────────────────────────────────────────────────────────
  private buildForm(): void {
    this.rfiForm = this.fb.group({
      company: [null, Validators.required],
      division: [null, Validators.required],
      // Required when the division has sub-divisions (see syncSubDivisionRequirement());
      // no sub-division ⇒ the RFI goes on one of the division's own (division-level) scopes.
      subDivision: [null],
      auditScope: [null, Validators.required],
      subScope: [null],
      title: ['', [Validators.required, Validators.minLength(RFI_TITLE_MIN_LENGTH), Validators.maxLength(RFI_TITLE_MAX_LENGTH)]],
      description: ['', [Validators.required, Validators.minLength(RFI_DESCRIPTION_MIN_LENGTH), Validators.maxLength(RFI_DESCRIPTION_MAX_LENGTH)]],
      additionalDescription: [''],
      dueDate: [null, [Validators.required, this.dueDateValidator]],
      owner: [null, Validators.required],
      documents: [[], Validators.required],
    });
  }

  // ── Due Date Validator ─────────────────────────────────────────────────────
  dueDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today ? { dueDateInvalid: true } : null;
  }

  // ── File Upload ────────────────────────────────────────────────────────────
  onFileSelect(event: { files: File[] }): void {
    for (const file of event.files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.messageService.add({
          severity: 'warn', summary: RFI_FORM_NOTICES.InvalidFileTypeSummary,
          detail: RFI_FORM_NOTICES.invalidFileType(file.name),
        });
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.messageService.add({
          severity: 'warn', summary: RFI_FORM_NOTICES.FileTooLargeSummary,
          detail: RFI_FORM_NOTICES.fileTooLarge(file.name, this.MAX_FILE_SIZE_MB),
        });
        continue;
      }
      const alreadyAdded = this.uploadedFiles.some(
        e => e.file.name === file.name && e.file.size === file.size
      );
      if (!alreadyAdded) {
        this.uploadedFiles.push({ file, description: '' });
      }
    }
    this.syncDocumentsControl();
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.syncDocumentsControl();
  }

  private syncDocumentsControl(): void {
    this.rfiForm.patchValue({ documents: this.uploadedFiles.map(e => e.file) });
    this.rfiForm.get('documents')?.updateValueAndValidity();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  resolveFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'pdf') return 'pi pi-file-pdf';
    if (['doc', 'docx'].includes(ext)) return 'pi pi-file-word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'pi pi-file-excel';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'pi pi-image';
    return 'pi pi-file';
  }

  // ── Tab 0 → Next ───────────────────────────────────────────────────────────
  onNextTab(): void {
    this.submitted = true;

    if (this.rfiSource === RfiSources.Library && !this.selectedLibraryRfiId) {
      this.messageService.add({
        severity: 'error', summary: RFI_FORM_NOTICES.RfiRequiredSummary,
        detail: RFI_FORM_NOTICES.RfiRequired,
      });
      return;
    }

    this.rfiForm.markAllAsTouched();

    if (this.rfiForm.invalid) {
      this.messageService.add({
        severity: 'error', summary: RFI_FORM_NOTICES.ValidationSummary,
        detail: RFI_FORM_NOTICES.FixBeforeProceeding,
      });
      return;
    }

    // Check uploaded file descriptions
    this.emptyDescFileNames = this.uploadedFiles
      .filter(e => !e.description.trim())
      .map(e => e.file.name);

    if (this.emptyDescFileNames.length > 0) {
      this.showDescWarningDialog = true;
      return;
    }

    this.activeTabIndex = RFI_FORM_TABS.Questionnaire;
    this.submitted = false;
  }

  // ── Add RFI from questionnaire tab ─────────────────────────────────────────
  async onAddRfi(): Promise<void> {
    const rows = this.questionareSection?.rows ?? [];
    const nonEmptyRows = rows.filter(r => r.questionText.trim());

    // Validate: every question must have a due date
    const missingDueDates = nonEmptyRows.filter(r => !r.dueDate);
    if (missingDueDates.length > 0) {
      this.messageService.add({
        severity: 'error', summary: RFI_FORM_NOTICES.MissingDueDateSummary,
        detail: RFI_FORM_NOTICES.missingDueDates(missingDueDates.length),
      });
      return;
    }

    // Validate: no question due date should exceed the RFI due date
    const rfiDueDate = this.rfiForm.get('dueDate')?.value;
    if (rfiDueDate && nonEmptyRows.length > 0) {
      const rfiDate = new Date(rfiDueDate);
      rfiDate.setHours(0, 0, 0, 0);
      const laterRows = nonEmptyRows.filter(r => {
        if (!r.dueDate) return false;
        const qDate = new Date(r.dueDate);
        qDate.setHours(0, 0, 0, 0);
        return qDate > rfiDate;
      });
      if (laterRows.length > 0) {
        this.messageService.add({
          severity: 'error', summary: RFI_FORM_NOTICES.DueDateConflictSummary,
          detail: RFI_FORM_NOTICES.DueDateConflict,
        });
        return;
      }
    }

    // If no questions filled — confirm proceed without questionnaire
    if (nonEmptyRows.length === 0) {
      const ok = await this.confirmSvc.confirm({
        ...RFI_CONFIRM_DIALOGS.NoQuestionnaire,
        action: 'warning',
      });
      if (!ok) return;
    }

    this.submitForm();
  }

  proceedAnyway(): void {
    this.showDescWarningDialog = false;
    this.activeTabIndex = RFI_FORM_TABS.Questionnaire;
    this.submitted = false;
  }

  // PrimeNG's p-dialog releases the shared body scroll-lock (`p-overflow-hidden`
  // + its scrollbar-width padding compensation) whenever it finishes closing,
  // with no awareness that the drawer hosting it (`p-drawer [blockScroll]`) is
  // still open and still needs scroll blocked. That drops the page's real
  // scrollbar back in — and its padding compensation out — mid-transition,
  // which is the actual cause of the visual shake (not the tab switch itself).
  // Re-apply the lock the instant the dialog reports it's hidden.
  onDescWarningDialogHide(): void {
    blockBodyScroll();
  }

  private submitForm(): void {
    const questionnaireData = (this.questionareSection?.rows ?? []).map(r => ({
      question: r.questionText,
      answer: r.answerText,
      dueDate: r.dueDate,
    }));

    const payload = { ...this.rfiForm.value, uploadedFiles: this.uploadedFiles, questionnaire: questionnaireData };

    console.log('Add RFI Payload:', payload);

    // Persist into the shared RFI static data so it shows up immediately in
    // both rfi-list.component.html and rfi-client-list.component.html — they both
    // read from the same in-memory tree.
    this.persistNewRfi(questionnaireData);

    this.onClose();
    this.toast.success(RFI_TOAST_MESSAGES.Added);

    this.resetForm();
  }

  /**
   * Writes a freshly-submitted RFI into the shared static data
   * (rfi-static-data.ts). In fresh mode `auditScope`/`subScope` hold real
   * scope ids (resolved via findStaticScopeById); in library mode they hold
   * Scope Library ids (`sl-*`/`ssl-*`), so `fromLibrary` makes upsertStaticRfi
   * resolve them via findStaticScopeByLibraryId instead (match by name). If a
   * library scope has no real counterpart, `upsertStaticRfi` no-ops (returns
   * undefined) rather than throwing.
   */
  private persistNewRfi(questionnaire: { question: string; answer?: string; dueDate?: Date | string | null }[]): void {
    const v = this.rfiForm.value;
    const toIso = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : (d as string | null | undefined) ?? undefined);
    const ownerLabel = this.owners.find(o => o.value === v.owner)?.label ?? v.owner;

    const company = this.companyDataService.getById(v.company);
    upsertStaticRfi(v.company, v.division, v.subDivision || null, v.auditScope, v.subScope || null, {
      title: v.title,
      description: v.description,
      dueDate: toIso(v.dueDate)!,
      ownerValue: v.owner,
      ownerLabel,
      questionnaire: questionnaire.map(q => ({ ...q, dueDate: toIso(q.dueDate) ?? null })),
    }, company ? {
      companyName: company.companyName,
      tag: company.tag,
      color: company.color,
    } : undefined, this.rfiSource === RfiSources.Library);
  }

  private resetForm(): void {
    this.submitted = false;
    this.showDescWarningDialog = false;
    this.emptyDescFileNames = [];
    this.rfiSource = RfiSources.Fresh;
    this.selectedLibraryRfiId = null;
    this.isDescriptionFromLibrary = false;
    this.libraryQuestions = [];

    this.subs.unsubscribe();
    this.subs = new Subscription();

    this.buildForm();
    this.uploadedFiles = [];
  }

  onClose(): void {
    this.buildForm();
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
      this.drawerWidth = `${newWidth}px`;
      const panel = document.querySelector(RFI_DRAWER.PanelSelector) as HTMLElement | null;
      if (panel) panel.style.width = this.drawerWidth;
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
