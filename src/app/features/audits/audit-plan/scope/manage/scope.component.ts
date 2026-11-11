import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScopeTaskComponent } from '@/app/features/audits/audit-plan/scope/com/scope-task/scope-task.component';
import { SubScope } from '@/app/features/audits/organization/divisions/models/division-list.model';
import { MOCK_SCOPE_LIBRARY } from '@/app/features/audits/libraries/scope-library/scope-library-static-data';
import type { StaticScope, ScopeTask } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import type { ScopeDrawerData } from '@/app/features/audits/audit-plan/scope/models/scope.model';
import {
  divisionOptionsForCompany,
  subDivisionOptionsForDivision,
  topLevelScopeOptionsForSubDivision,
  subDivisionCodesForDivision,
  divisionHasSubDivisions,
  SCOPE_TYPE_OPTIONS,
  AUDIT_FREQUENCY_OPTIONS,
  MODE_OF_AUDIT_OPTIONS,
  SAMPLING_METHODOLOGY_OPTIONS,
  RISK_RATING_OPTIONS,
  HOURLY_RATE_OPTIONS,
  AUDITOR_OPTIONS,
  REVIEWER_OPTIONS,
} from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { MOCK_PLANS, periodLabel } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import type { AuditPlan } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  ScopeApprovalActions,
  ScopeDrawerModes,
  ScopeLevels,
  ScopeRecordStatuses,
  ScopeSamplingMethodologies,
  ScopeSources,
  type ScopeDrawerMode,
  type ScopeLevel,
  type ScopeSource,
  SCOPE_DETAILS_TAB_REQUIRED_FIELDS,
  SCOPE_EVIDENCE_UPLOAD,
  SCOPE_FORM_TABS,
  SCOPE_MOCK_RISK_REGISTER,
  SCOPE_NAME_MAX_LENGTH,
  SCOPE_NAME_MIN_LENGTH,
  SCOPE_OBJECTIVE_MAX_LENGTH,
  SCOPE_REQUEST_PENDING_REVIEW,
} from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_LIBRARY_LEVEL_LABELS,
  SCOPE_SOURCE_OPTIONS,
  SCOPE_SUBSCOPE_TYPE_LABELS,
} from '@/app/features/audits/audit-plan/scope/constants/scope-labels.constants';
import {
  SCOPE_CONFIRM_DIALOGS,
  SCOPE_ERROR_MESSAGES,
  SCOPE_FORM_NOTICES,
  SCOPE_INVALID_FIELD_MESSAGE,
  SCOPE_SUBSCOPE_ERROR_MESSAGES,
  SCOPE_TOAST_MESSAGES,
} from '@/app/features/audits/audit-plan/scope/constants/scope-messages.constants';
import {
  SCOPE_DRAWER_ADD_SUBTITLE,
  SCOPE_DRAWER_TITLES,
  subScopeFallbackName,
} from '@/app/features/audits/audit-plan/scope/constants/scope-labels.constants';

@Component({
  selector: 'app-scope',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    TabsModule,
    TextareaModule,
    DatePickerModule,
    FileUploadModule,
    ToastModule,
    InputNumberModule,
    AccordionModule,
    TagModule,
    SelectButtonModule,
    ScopeTaskComponent,
    DrawIconComponent,
  ],
  providers: [MessageService],
  templateUrl: './scope.component.html',
  styleUrl: './scope.component.scss',
})
export class ScopeComponent implements OnInit, OnDestroy {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as ScopeDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly companyDataService = inject(CompanyDataService);
   private readonly toast = inject(ToastService);

  @ViewChild(ScopeTaskComponent) taskAuditRef!: ScopeTaskComponent;

  mode: ScopeDrawerMode = this.data?.mode ?? ScopeDrawerModes.Add;
  readonly approvalMode: boolean = this.data?.approvalMode ?? false;
  readonly requestStatus: string = this.data?.requestStatus ?? SCOPE_REQUEST_PENDING_REVIEW;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === SCOPE_REQUEST_PENDING_REVIEW;

  // Exposed for the template.
  readonly ScopeDrawerModes = ScopeDrawerModes;
  readonly ScopeSources = ScopeSources;
  readonly ScopeLevels = ScopeLevels;
  readonly libraryLevelLabels = SCOPE_LIBRARY_LEVEL_LABELS;
  readonly SCOPE_OBJECTIVE_MAX_LENGTH = SCOPE_OBJECTIVE_MAX_LENGTH;
  scope: StaticScope | null = this.data?.scope ?? null;
  initialTab = this.data?.initialTab ?? 0;
  subScopeIndex: number | null = this.data?.subScopeIndex ?? null;

  activeTabIndex = 0;
  submitted = false;
  approvalNotesSubmitted = false;
  expandedSubScopeKey: any = null;

  /** Optional caller-provided parent scopes retained for backwards compatibility. */
  availableScopeOptions = this.data?.availableScopeOptions ?? [];

  // ── Scope Library Mode ────────────────────────────────────────────────────
  scopeSource: ScopeSource = ScopeSources.Fresh;
  selectedLibraryScopeId: string | null = null;
  selectedLibraryScopeLevel: ScopeLevel | null = null;

  scopeSourceOptions = SCOPE_SOURCE_OPTIONS;

  // Filtered by sub-division selection when in library mode
  get libraryScopeOptions() {
    const deptId = this.scopeSource === ScopeSources.Library ? this.scopeForm?.get('subDivision')?.value : null;
    return MOCK_SCOPE_LIBRARY
      .filter(s => deptId ? s.subDivision === deptId : true)
      .map(s => ({
        label: s.title,
        value: s.id,
        scopeLevel: s.scopeLevel,
      }));
  }

  get libraryParentScopeOptions() {
    return MOCK_SCOPE_LIBRARY
      .filter(s => s.scopeLevel === ScopeLevels.Scope)
      .map(s => ({ label: s.title, value: s.id }));
  }

  /**
   * Real, sub-division-scoped Parent Scope options for the "fresh" flow — only
   * top-level scopes in the exact company/division/sub-division selected, so a
   * sub-scope can only ever attach to a real scope in the same sub-division.
   * Excludes the scope currently being edited (a scope can't be its own parent).
   */
  get freshParentScopeOptions() {
    const v = this.scopeForm?.value;
    if (!v) return [];
    return topLevelScopeOptionsForSubDivision(v.company, v.division, v.subDivision, this.scope?.id, {
      includeScopeId: v.parentScope,
    });
  }

  get activeParentScopeOptions() {
    // debugger;
    return this.scopeSource === ScopeSources.Library
      ? this.libraryParentScopeOptions
      : (this.availableScopeOptions.length ? this.availableScopeOptions : this.freshParentScopeOptions);
  }

  get isLibraryParentRequired(): boolean {
    return this.scopeSource === ScopeSources.Library && this.selectedLibraryScopeLevel === ScopeLevels.SubScope;
  }

  // ── Cascade: company → division → sub-division → scope library ───────────────

  onCompanyChange(): void {
    this.scopeForm.patchValue({ division: null, subDivision: null, parentScope: null, auditPlan: null });
    this._resetLibraryScopeSelection();
    this.syncSubDivisionRequirement();
    this.syncLinkedDepartments();
  }

  onDivisionChange(): void {
    // The scope's owner changed — a Parent Scope from the old division/
    // sub-division no longer applies.
    this.scopeForm.patchValue({ subDivision: null, parentScope: null, auditPlan: null });
    this._resetLibraryScopeSelection();
    this.syncSubDivisionRequirement();
    this.syncLinkedDepartments();
  }

  // ── Sub-Division requirement ──────────────────────────────────────────────
  // Scopes are created only under the leaf node: a division with sub-divisions
  // (live `hasSubDivision` + at least one sub-division) takes scopes under a
  // sub-division; a division without any takes them directly. Enforced in add
  // mode only — existing division-level scopes keep their placement on edit.

  /** The selected division has sub-divisions to pick from. */
  get selectedDivisionHasSubDivisions(): boolean {
    const v = this.scopeForm?.getRawValue();
    return !!v?.division && divisionHasSubDivisions(v.company, v.division);
  }

  get isSubDivisionRequired(): boolean {
    return this.mode === ScopeDrawerModes.Add && this.selectedDivisionHasSubDivisions;
  }

  /** Division chosen, plus a sub-division when one is required — the scope's owner is known. */
  get isScopeOwnerResolved(): boolean {
    const v = this.scopeForm?.getRawValue();
    return !!v?.division && (!!v.subDivision || !this.isSubDivisionRequired); // if the division is selected and subdivision is selected or subdivision is not required.
  }

  private syncSubDivisionRequirement(): void {
    const ctrl = this.scopeForm.get('subDivision');
    if (!ctrl || this.isViewMode) return;
    if (this.isSubDivisionRequired) {
      ctrl.setValidators(Validators.required);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  onSubDivisionChange(): void {
    // A previously-selected Parent Scope belongs to the old owner (division or
    // sub-division) — clear it so a sub-scope can't end up attached to a scope
    // elsewhere. (Library mode already resets it separately.)
    this.scopeForm.patchValue({ parentScope: null, auditPlan: null });
    this._resetLibraryScopeSelection();
    this.syncLinkedDepartments();
  }

  // ── Audit Plan ────────────────────────────────────────────────────────────
  // Plans (audit-plan-data.ts) carry names, not ids — matched on the selected
  // company/division names, and on the sub-division when one is picked. The
  // chosen plan's period bounds the scope's Timeframe (see dateRangeValidator).

  get auditPlanOptions(): { label: string; value: string }[] {
    const v = this.scopeForm?.getRawValue();
    if (!v?.company || !v.division) return [];
    const companyName = this.companyDataService.all.find(c => c.id === v.company)?.companyName;
    const divisionName = divisionOptionsForCompany(v.company, { includeDivisionCode: v.division })
      .find(o => o.value === v.division)?.label;
    return MOCK_PLANS
      .filter(p => p.organizationName === companyName && p.divisionName === divisionName)
      .filter(p => !v.subDivision || p.subDivisions.some(d => d.name === v.subDivision) || p.id === v.auditPlan)
      .map(p => ({ label: `${p.planName} (${periodLabel(p)})`, value: p.id }));
  }

  get selectedAuditPlan(): AuditPlan | null {
    const id = this.scopeForm?.get('auditPlan')?.value;
    return id ? MOCK_PLANS.find(p => p.id === id) ?? null : null;
  }

  /**
   * The selected plan's period, bound to the date pickers' [minDate]/[maxDate].
   * Kept as fields (refreshed on auditPlan changes, see buildForm) rather than
   * getters: a getter returns a new Date every change-detection pass, and each
   * new reference makes p-datepicker rebuild its month view — which breaks
   * month navigation (and throws NG0100 in dev mode).
   */
  planMinDate: Date | null = null;
  planMaxDate: Date | null = null;

  private syncPlanBounds(planId: string | null | undefined): void {
    const { min, max } = this.planBounds(planId);
    this.planMinDate = min;
    this.planMaxDate = max;
  }

  /** The plan's period as whole days — start from 00:00, end through 23:59 (the date pickers carry a time). */
  private planBounds(planId: string | null | undefined): { min: Date | null; max: Date | null } {
    const plan = planId ? MOCK_PLANS.find(p => p.id === planId) : undefined;
    const min = plan?.startDate ? new Date(plan.startDate) : null;
    const max = plan?.endDate ? new Date(plan.endDate) : null;
    min?.setHours(0, 0, 0, 0);
    max?.setHours(23, 59, 59, 999);
    return { min, max };
  }

  // ── Linked Departments (`linkedSubDivisions`) ─────────────────────────────
  // A scope is created under its sub-division when one is picked, otherwise
  // directly under its division (any Division Type):
  //  - division-level: pick from the division's sub-divisions;
  //  - sub-division-level: pre-selected (and locked) to that sub-division.

  get linkedDepartmentOptions(): { label: string; value: string }[] {
    const v = this.scopeForm?.getRawValue();
    if (!v?.division) return [];
    if (v.subDivision) return [{ label: v.subDivision, value: v.subDivision }];
    return subDivisionOptionsForDivision(v.company, v.division);
  }

  /** Selectable (and required) only for a division-level scope whose division has sub-divisions. */
  get isLinkedDepartmentsSelectable(): boolean {
    const v = this.scopeForm?.getRawValue();
    return !!v?.division && !v.subDivision && this.linkedDepartmentOptions.length > 0;
  }

  private syncLinkedDepartments(): void {
    const ctrl = this.scopeForm.get('linkedSubDivisions');
    if (!ctrl || this.isViewMode) return;
    const v = this.scopeForm.getRawValue();
    if (v.subDivision) {
      ctrl.clearValidators();
      ctrl.setValue([v.subDivision], { emitEvent: false });
      ctrl.disable({ emitEvent: false });
    } else if (this.isLinkedDepartmentsSelectable) {
      const allowed = this.linkedDepartmentOptions.map(o => o.value);
      ctrl.setValidators(Validators.required);
      ctrl.setValue((v.linkedSubDivisions ?? []).filter((n: string) => allowed.includes(n)), { emitEvent: false });
      ctrl.enable({ emitEvent: false });
    } else {
      ctrl.clearValidators();
      ctrl.setValue([], { emitEvent: false });
      ctrl.disable({ emitEvent: false });
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  private _resetLibraryScopeSelection(): void {
    if (this.scopeSource !== ScopeSources.Library) return;
    this.selectedLibraryScopeId = null;
    this.selectedLibraryScopeLevel = null;
    this.scopeForm.patchValue({ scopeName: '', objective: '', parentScope: null });
    this.scopeForm.get('parentScope')?.clearValidators();
    this.scopeForm.get('parentScope')?.updateValueAndValidity();
  }

  onScopeSourceChange(): void {
    this.selectedLibraryScopeId = null;
    this.selectedLibraryScopeLevel = null;
    this.scopeForm.patchValue({ company: null, division: null, subDivision: null, auditPlan: null, scopeName: '', objective: '', parentScope: null });
    this.scopeForm.get('parentScope')?.clearValidators();
    this.scopeForm.get('parentScope')?.updateValueAndValidity();
    this.syncSubDivisionRequirement();
    this.syncLinkedDepartments();
  }

  onLibraryScopeSelect(scopeId: string | null): void {
    if (!scopeId) {
      this.selectedLibraryScopeLevel = null;
      this.scopeForm.patchValue({ scopeName: '', objective: '', parentScope: null });
      this.scopeForm.get('parentScope')?.clearValidators();
      this.scopeForm.get('parentScope')?.updateValueAndValidity();
      return;
    }
    const scope = MOCK_SCOPE_LIBRARY.find(s => s.id === scopeId);
    if (!scope) return;

    this.selectedLibraryScopeLevel = scope.scopeLevel as ScopeLevel;

    if (scope.scopeLevel === ScopeLevels.SubScope) {
      this.scopeForm.get('parentScope')?.setValidators([Validators.required]);
    } else {
      this.scopeForm.get('parentScope')?.clearValidators();
    }
    this.scopeForm.get('parentScope')?.updateValueAndValidity();

    this.scopeForm.patchValue({
      scopeName: scope.title,
      objective: scope.objective ?? '',
      parentScope: scope.parentScopeId ?? null,
    });
  }

  scopeForm!: FormGroup;
  private subs = new Subscription();

  // ── Evidence ──────────────────────────────────────────────────────────────
  evidenceFiles: File[] = [];
  readonly MAX_FILE_SIZE_MB = SCOPE_EVIDENCE_UPLOAD.MaxFileSizeMb;
  readonly ALLOWED_TYPES: readonly string[] = SCOPE_EVIDENCE_UPLOAD.AllowedTypes;

  // ── Options ──────────────────────────────────────────────────────────────
  // Single source of truth is audit-scope-static-data.ts (real companies/
  // divisions/sub-divisions/auditors/reviewers) — previously these came from
  // the disconnected org-hierarchy.ts + small hardcoded lists whose ids
  // didn't even match AUDITOR_PROFILES/REVIEWER_PROFILES.
  get companyOptions() {
    const currentId = this.scopeForm?.get('company')?.value;
    return this.companyDataService.all
      .filter(c => !c.blocked || c.id === currentId)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  get filteredDivisionOptions() {
    const companyId = this.scopeForm?.get('company')?.value;
    return divisionOptionsForCompany(companyId, {
      companyBlocked: companyId ? this.companyDataService.isCompanyBlocked(companyId) : false,
      includeDivisionCode: this.scopeForm?.get('division')?.value,
    });
  }

  get filteredSubDivisionOptions() {
    const v = this.scopeForm?.value;
    return subDivisionOptionsForDivision(v?.company, v?.division, { includeSubDivisionName: v?.subDivision });
  }

  scopeTypeOptions = SCOPE_TYPE_OPTIONS;
  auditFrequencyOptions = AUDIT_FREQUENCY_OPTIONS;
  modeOfAuditOptions = MODE_OF_AUDIT_OPTIONS;
  methodologyOptions = SAMPLING_METHODOLOGY_OPTIONS;
  auditorOptions = AUDITOR_OPTIONS;
  reviewerOptions = REVIEWER_OPTIONS;
  hourlyRateOptions = HOURLY_RATE_OPTIONS;
  riskRatingOptions = RISK_RATING_OPTIONS;

  // Simulated risk register — replace with real API call in production
  private riskRegister = SCOPE_MOCK_RISK_REGISTER;

  auditFormErrorMessages = SCOPE_ERROR_MESSAGES;

  subScopeErrorMessages = SCOPE_SUBSCOPE_ERROR_MESSAGES;

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.buildForm();
    if ((this.mode === ScopeDrawerModes.Edit || this.mode === ScopeDrawerModes.View) && this.scope) {
      this.populateForm();
    } else if (this.mode === ScopeDrawerModes.Add) {
      this.resetForm();
    }
  }

  // ── Getters ───────────────────────────────────────────────────────────────
  get f() {
    return this.scopeForm.controls;
  }

  get isViewMode(): boolean {
    return this.mode === ScopeDrawerModes.View;
  }

  get drawerTitle(): string {
    if (this.approvalMode) return SCOPE_DRAWER_TITLES.review;
    return SCOPE_DRAWER_TITLES[this.mode];
  }

  get drawerSubtitle(): string {
    if ((this.mode === ScopeDrawerModes.Edit || this.mode === ScopeDrawerModes.View) && this.scope) {
      return this.scope.scopeName;
    }
    return SCOPE_DRAWER_ADD_SUBTITLE;
  }

  get isJudgmental(): boolean {
    return this.f['samplingMethodology']?.value === ScopeSamplingMethodologies.Judgmental;
  }

  get computedBudget(): string {
    const hours = this.scopeForm?.get('estimatedHours')?.value ?? 0;
    const rate = this.scopeForm?.get('hourlyRate')?.value ?? 0;
    return hours && rate ? `$${(hours * rate).toLocaleString()}` : '';
  }

  get objectiveLength(): number {
    return this.f['objective']?.value?.length ?? 0;
  }

  get subScopesArray(): FormArray {
    return this.scopeForm.get('subScopes') as FormArray;
  }

  // ── Sub-scope helpers ─────────────────────────────────────────────────────
  buildSubScopeGroup(data?: Partial<SubScope>): FormGroup {
    return this.fb.group({
      subScopeName: [data?.subScopeName ?? '', Validators.required],
      subScopeType: [data?.subScopeType ?? null, Validators.required],
      linkedSubDivisions: [data?.linkedSubDivisions ?? [], Validators.required],
      auditFrequency: [data?.auditFrequency ?? null, Validators.required],
      modeOfAudit: [data?.modeOfAudit ?? null, Validators.required],
      samplingMethodology: [data?.samplingMethodology ?? null, Validators.required],
      samplingSize: [data?.samplingSize ?? null, [Validators.required, Validators.min(1)]],
      startDate: [data?.startDate ?? null, Validators.required],
      endDate: [data?.endDate ?? null, Validators.required],
      assignedAuditors: [data?.assignedAuditors ?? [], Validators.required],
      parentScope: [data?.parentScope ?? null],
      objective: [data?.objective ?? '', Validators.maxLength(SCOPE_OBJECTIVE_MAX_LENGTH)],
      justificationForSampling: [data?.justificationForSampling ?? ''],
      estimatedHours: [data?.estimatedHours ?? null, Validators.min(1)],
      hourlyRate: [data?.hourlyRate ?? null],
      riskReferenceId: [data?.riskReferenceId ?? ''],
      riskRating: [data?.riskRating ?? null],
      completionNote: [data?.completionNote ?? ''],
    });
  }

  getSubScopeGroup(i: number): FormGroup {
    return this.subScopesArray.at(i) as FormGroup;
  }

  getSubScopeName(i: number): string {
    return this.getSubScopeGroup(i).get('subScopeName')?.value?.trim() || subScopeFallbackName(i);
  }

  getSubScopeType(i: number): string {
    const val = this.getSubScopeGroup(i).get('subScopeType')?.value;
    return SCOPE_SUBSCOPE_TYPE_LABELS[val] ?? (val ?? '');
  }

  getSubScopeFieldInvalid(i: number, field: string): boolean {
    const ctrl = this.getSubScopeGroup(i).get(field);
    return !!ctrl && ctrl.invalid && (this.submitted || ctrl.touched);
  }

  getSubScopeErrorMessage(i: number, field: string): string {
    const ctrl = this.getSubScopeGroup(i).get(field);
    if (!ctrl || !ctrl.errors) return '';
    const firstErrorKey = Object.keys(ctrl.errors)[0];
    return this.subScopeErrorMessages[field]?.[firstErrorKey] || SCOPE_INVALID_FIELD_MESSAGE;
  }

  addSubScope(): void {
    const group = this.buildSubScopeGroup();
    this.subScopesArray.push(group);
    this.expandedSubScopeKey = 'ss-' + (this.subScopesArray.length - 1);
  }

  removeSubScope(i: number, ev: Event): void {
    ev.stopPropagation();
    this.subScopesArray.removeAt(i);
    this.expandedSubScopeKey = null;
  }

  // ── Error helpers ─────────────────────────────────────────────────────────
  getErrorMessage(controlName: string): string {
    const control = this.scopeForm.get(controlName);
    if (!control || !control.errors) return '';
    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];
    return this.auditFormErrorMessages[controlName]?.[firstErrorKey] || SCOPE_INVALID_FIELD_MESSAGE;
  }

  isFieldInvalid(name: any): boolean {
    const ctrl = this.scopeForm.get(name);
    return !!ctrl && ctrl.invalid && (this.submitted || ctrl.touched);
  }

  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !this.scopeForm.get('approverNotes')?.value?.trim();
  }

  // ── Form builder ──────────────────────────────────────────────────────────
  private buildForm(): void {
    this.scopeForm = this.fb.group(
      {
        company: [null, Validators.required],
        division: [null, Validators.required],
        // Required (add mode) when the division has sub-divisions; empty means
        // the scope sits directly under the division. See syncSubDivisionRequirement().
        subDivision: [null],
        // Required for new scopes only — existing scopes predate the field.
        auditPlan: [null, this.mode === ScopeDrawerModes.Add ? Validators.required : null],
        scopeName: ['',[Validators.required, Validators.minLength(SCOPE_NAME_MIN_LENGTH), Validators.maxLength(SCOPE_NAME_MAX_LENGTH)]],
        scopeType: [null, Validators.required],
        // Validators/enabled state managed by syncLinkedDepartments().
        linkedSubDivisions: [{ value: [], disabled: true }],
        auditFrequency: [null, Validators.required],
        modeOfAudit: [null, Validators.required],
        samplingMethodology: [null, Validators.required],
        samplingSize: [null, [Validators.required, Validators.min(1)]],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        assignedAuditors: [[], Validators.required],
        assignedReviewers: [[], Validators.required],
        parentScope: [null],
        objective: ['', Validators.maxLength(SCOPE_OBJECTIVE_MAX_LENGTH)],
        justificationForSampling: [''],
        estimatedHours: [null, Validators.min(1)],
        hourlyRate: [null],
        riskReferenceId: [''],
        riskRating: [null],
        completionNote: [''],
        approverNotes: [''],
        subScopes: this.fb.array([]),
      },
      { validators: this.dateRangeValidator.bind(this) }
    );

    this.subs.add(
      this.scopeForm.get('samplingMethodology')!.valueChanges.subscribe(val => {
        const ctrl = this.scopeForm.get('justificationForSampling')!;
        if (val === ScopeSamplingMethodologies.Judgmental) {
          ctrl.setValidators([Validators.required]);
        } else {
          ctrl.clearValidators();
          ctrl.setValue('');
        }
        ctrl.updateValueAndValidity();
      })
    );

    this.syncPlanBounds(null);
    this.subs.add(
      this.scopeForm.get('auditPlan')!.valueChanges.subscribe(val => this.syncPlanBounds(val))
    );

    this.subs.add(
      this.scopeForm.get('riskReferenceId')!.valueChanges.subscribe(val => {
        const key = (val ?? '').trim().toUpperCase();
        const rating = this.riskRegister[key] ?? null;
        this.scopeForm.get('riskRating')?.setValue(rating, { emitEvent: false });
      })
    );
  }

  private populateForm(): void {
    if (!this.scope) return;
    const s = this.scope;

    this.scopeForm.patchValue({
      company: s.company ?? null,
      division: s.divisionCode ?? null,
      subDivision: s.subDivisionName ?? null,
      auditPlan: s.auditPlanId ?? null,
      scopeName: s.scopeName,
      scopeType: s.scopeType,
      linkedSubDivisions: s.linkedSubDivisions,
      auditFrequency: s.auditFrequency,
      modeOfAudit: s.modeOfAudit,
      samplingMethodology: s.samplingMethodology,
      samplingSize: s.samplingSize,
      startDate: s.startDate ? new Date(s.startDate) : null,
      endDate: s.endDate ? new Date(s.endDate) : null,
      assignedAuditors: s.assignedAuditors,
      assignedReviewers: s.assignedReviewers ?? [],
      parentScope: (s as any).parentScopeId ?? null,
      objective: s.objective ?? '',
      justificationForSampling: s.justificationForSampling ?? '',
      estimatedHours: s.estimatedHours ?? null,
      hourlyRate: s.hourlyRate ?? null,
      riskReferenceId: s.riskReferenceId ?? '',
      riskRating: s.riskRating ?? null,
      completionNote: s.completionNote ?? '',
    });

    // The Sub-Scopes accordion (tab 1) has no template — this FormArray is
    // never rendered/edited; clear it defensively on every populate.
    while (this.subScopesArray.length) {
      this.subScopesArray.removeAt(0);
    }

    if (this.isViewMode) {
      this.scopeForm.disable();
    } else {
      this.scopeForm.enable();
      this.syncSubDivisionRequirement();
      this.syncLinkedDepartments();
    }

    this.activeTabIndex = this.initialTab ?? SCOPE_FORM_TABS.Details;
    if (this.subScopeIndex !== null && this.subScopeIndex !== undefined && this.subScopeIndex >= 0) {
      this.expandedSubScopeKey = 'ss-' + this.subScopeIndex;
    } else {
      this.expandedSubScopeKey = null;
    }
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    const errors: ValidationErrors = {};
    if (start && end && new Date(end) <= new Date(start)) {
      errors['endBeforeStart'] = true;
    }
    // The scope's Timeframe must sit inside the selected audit plan's period.
    const { min, max } = this.planBounds(group.get('auditPlan')?.value);
    if (start && min && new Date(start) < min) {
      errors['startBeforePlanStart'] = true;
    }
    if (end && max && new Date(end) > max) {
      errors['endAfterPlanEnd'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }


  // ── Evidence upload ───────────────────────────────────────────────────────
  onEvidenceSelect(event: { files: File[] }): void {
    for (const file of event.files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.messageService.add({
          severity: 'warn',
          summary: SCOPE_FORM_NOTICES.InvalidFileTypeSummary,
          detail: SCOPE_FORM_NOTICES.invalidFileType(file.name),
        });
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.messageService.add({
          severity: 'warn',
          summary: SCOPE_FORM_NOTICES.FileTooLargeSummary,
          detail: SCOPE_FORM_NOTICES.fileTooLarge(file.name, this.MAX_FILE_SIZE_MB),
        });
        continue;
      }
      this.evidenceFiles.push(file);
    }
  }

  removeEvidence(index: number): void {
    this.evidenceFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Tab navigation ────────────────────────────────────────────────────────
  private readonly tab0RequiredFields = SCOPE_DETAILS_TAB_REQUIRED_FIELDS;

  goToNextTab(): void {
    if (this.activeTabIndex === SCOPE_FORM_TABS.Details) {
      const fieldsToValidate = [...this.tab0RequiredFields];
      if (this.isJudgmental) fieldsToValidate.push('justificationForSampling');
      if (this.isLibraryParentRequired) fieldsToValidate.push('parentScope');

      fieldsToValidate.forEach(f => this.scopeForm.get(f)?.markAsTouched());

      // `!invalid` rather than `valid` — a disabled control (e.g. Linked Departments when not applicable) is neither.
      const fieldsValid = fieldsToValidate.every(f => !this.scopeForm.get(f)?.invalid);
      const formErrors = this.scopeForm.errors;
      const dateRangeValid = !formErrors?.['endBeforeStart'] && !formErrors?.['startBeforePlanStart'] && !formErrors?.['endAfterPlanEnd'];

      if (!fieldsValid || !dateRangeValid) {
        this.messageService.add({
          severity: 'error',
          summary: SCOPE_FORM_NOTICES.ValidationSummary,
          detail: SCOPE_FORM_NOTICES.FixBeforeProceeding,
        });
        return;
      }
    }

    // Details & Sampling / Regulations & Audit Trail tabs are hidden — Tasks
    // (tab 1) is now the last tab, and it submits instead of advancing further.
    this.activeTabIndex = Math.min(this.activeTabIndex + 1, SCOPE_FORM_TABS.Tasks);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  onClose(): void {
    this.drawerRef.close(null);
  }

  onCancel(): void {
    this.resetForm();
    this.onClose();
  }

  // ── Approval actions ──────────────────────────────────────────────────────
  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...SCOPE_CONFIRM_DIALOGS.Approve,
      action: ScopeApprovalActions.Approve,
    });
    if (ok) {
      this.drawerRef.close({
        approval: { action: ScopeApprovalActions.Approve, notes: this.scopeForm.get('approverNotes')!.value ?? '' },
      });
      this.toast.success(SCOPE_TOAST_MESSAGES.Approved, SCOPE_TOAST_MESSAGES.ApprovedTitle);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = this.scopeForm.get('approverNotes')!.value?.trim() ?? '';
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...SCOPE_CONFIRM_DIALOGS.Reject,
      action: ScopeApprovalActions.Reject,
    });
    if (ok) {
      this.drawerRef.close({
        approval: { action: ScopeApprovalActions.Reject, notes },
      });
      this.toast.error(SCOPE_TOAST_MESSAGES.Rejected, SCOPE_TOAST_MESSAGES.RejectedTitle);
    }
  }

  private formatDate(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }

  /**
   * Builds the fields the static-data mutation helpers expect, straight off
   * the current \`scopeForm\` value. Whether this becomes a top-level scope or
   * a sub-scope is entirely determined by \`parentScope\` — no separate
   * add-scope vs. add-sub-scope path exists.
   */
  private buildScopePayload(): Omit<StaticScope, 'id'> {
    const v = this.scopeForm.value;
    const subDivisionName: string | null = v.subDivision || null;
    return {
      company: v.company,
      divisionCode: v.division,
      subDivisionName,
      // Division-level scope → linked to all of its division's sub-divisions; sub-division scope → null.
      subDivisionsInfo: subDivisionName ? null : subDivisionCodesForDivision(v.company, v.division),
      parentScopeId: v.parentScope || null,
      auditPlanId: v.auditPlan || null,
      scopeName: v.scopeName,
      scopeType: v.scopeType,
      // Raw value — the control is disabled (but pre-filled) for a sub-division scope.
      linkedSubDivisions: this.scopeForm.getRawValue().linkedSubDivisions ?? [],
      auditFrequency: v.auditFrequency,
      modeOfAudit: v.modeOfAudit,
      samplingMethodology: v.samplingMethodology,
      samplingSize: v.samplingSize,
      startDate: this.formatDate(v.startDate),
      endDate: this.formatDate(v.endDate),
      assignedAuditors: v.assignedAuditors,
      assignedReviewers: v.assignedReviewers,
      objective: v.objective,
      justificationForSampling: v.justificationForSampling,
      estimatedHours: v.estimatedHours,
      hourlyRate: v.hourlyRate,
      riskReferenceId: v.riskReferenceId,
      riskRating: v.riskRating,
      completionNote: v.completionNote,
      status: (this.scope as StaticScope | null)?.status ?? ScopeRecordStatuses.Active,
      workflowStatus: (this.scope as StaticScope | null)?.workflowStatus,
      // Preserved on edit; ignored (and re-stamped with the real current
      // time) by `upsertStaticScope` on add, so a new scope always sorts
      // to the top of the newest-first list.
      createdAt: (this.scope as StaticScope | null)?.createdAt ?? new Date().toISOString(),
      // ScopeTaskComponent manages its own tasks array (seeded via [initialTasks]
      // from this.scope.tasks) — read it back here at submit time.
      tasks: (this.taskAuditRef?.tasks ?? []) as unknown as ScopeTask[],
    };
  }

  onAddScope(): void {
    this.submitted = true;
    this.scopeForm.markAllAsTouched();

    if (this.scopeForm.invalid) {
      this.activeTabIndex = SCOPE_FORM_TABS.Details;
      this.messageService.add({
        severity: 'error',
        summary: SCOPE_FORM_NOTICES.ValidationSummary,
        detail: SCOPE_FORM_NOTICES.FixBeforeSubmitting,
      });
      return;
    }

    if (!this.taskAuditRef?.tasks?.length) {
      this.activeTabIndex = SCOPE_FORM_TABS.Tasks;
      this.messageService.add({
        severity: 'warn',
        summary: SCOPE_FORM_NOTICES.TasksRequiredSummary,
        detail: SCOPE_FORM_NOTICES.TasksRequired,
      });
      return;
    }

    const scope = this.buildScopePayload();
    this.toast.success(SCOPE_TOAST_MESSAGES.Added);
    this.resetForm();
    this.drawerRef.close({ scope });
  }

  onSave(): void {
    this.submitted = true;
    this.scopeForm.markAllAsTouched();

    if (this.scopeForm.invalid) {
      this.activeTabIndex = SCOPE_FORM_TABS.Details;
      this.messageService.add({
        severity: 'error',
        summary: SCOPE_FORM_NOTICES.ValidationSummary,
        detail: SCOPE_FORM_NOTICES.FixBeforeSubmitting,
      });
      return;
    }

    const scopeUpdate = this.buildScopePayload();
    this.toast.success(SCOPE_TOAST_MESSAGES.Updated);
    this.resetForm();
    this.drawerRef.close({ scopeUpdate });
  }

  private resetForm(): void {
    this.submitted = false;
    this.scopeSource = ScopeSources.Fresh;
    this.selectedLibraryScopeId = null;
    this.selectedLibraryScopeLevel = null;
    this.subs.unsubscribe();
    this.subs = new Subscription();
    this.buildForm();
    while (this.subScopesArray.length) {
      this.subScopesArray.removeAt(0);
    }
    this.evidenceFiles = [];
    this.activeTabIndex = SCOPE_FORM_TABS.Details;
    this.expandedSubScopeKey = null;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
