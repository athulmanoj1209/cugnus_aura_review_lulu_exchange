import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ORG_STATIC_DATA, ScopeSource, toTaskOptions } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { MOCK_PLANS } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';

// ---------------------------------------------------------------------------
// Client-mode aware Company / Division / Subdivision data.
//
// TODO: adjust these 4 import paths to match where the files actually live
// in the project — they're placeholders based on the uploaded snippets.
//
// - CLIENT_MODE_VALUE tells us whether this build is running for an
//   audit firm ('audit-firm') or for a single org auditing itself
//   ('internal-audit'). See client-mode.ts.
// - When CLIENT_MODE_VALUE is 'internal-audit', Company/Division/Subdivision
//   options are sourced from the *-indi-org seed files below instead of the
//   shared ORG_STATIC_DATA (which is the audit-firm dataset). Scope /
//   Sub-scope / Task keep exactly the same lookup logic as before — they
//   just now read off whichever subdivision record the active mode
//   resolved to.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import {
  FINDING_FIELD_LIMITS,
  FINDING_FILE_SIZE_BASE,
  FINDING_FILE_SIZE_UNITS,
  FINDING_SUBMIT_CLOSE_DELAY_MS,
  FINDING_UPLOAD,
  FindingDrawerModes,
  FindingFormStatuses,
  type FindingDrawerMode,
  type FindingFormStatus,
} from '../constants/findings.constants';
import {
  FINDING_OBSERVATION_OPTIONS,
  FINDING_RISK_OPTIONS,
  FINDING_SEVERITY_OPTIONS,
} from '../constants/findings-labels.constants';
import {
  FINDING_DRAWER_HEADERS,
  FINDING_FORM_PLACEHOLDERS,
  FINDING_TOAST_MESSAGES,
} from '../constants/findings-messages.constants';

// Company / Division / Subdivision (and now Scope / Subscope) options below
// come from the shared company-org-data.ts file (the same common
// Company -> Division -> Subdivision -> Scope -> Sub-scope static data used by
// the Add Member modal, Members list, Companies list, Add Risk drawer, Risk
// Register, Scope Jobs, Evidence Repository filters, Findings filters, and
// the Add Evidence / Add Observation drawers) instead of the previous
// CompanyDataService (id-based, company-only) lookup plus static
// dubai/abu_dhabi-style division codes and a flat 4-category scope list.
// AuditFinding.company / .division / .subdivision are plain display-name
// strings (not ids/codes), so the option *values* here are the
// company/division/subdivision *names* themselves — matching what the
// Findings list's filters expect (see findings-list.component.ts).
// Adjust the '@/app/data/company-org-data' path if that file lives
// elsewhere.
//
// Task options come from the same company-org-data.ts file's
// toTaskOptions() helper: each Scope/Sub-scope in that dataset carries its
// own `tasks[]`, so selecting a different Scope always changes the Task
// dropdown (same approach as the Add Evidence / Add Observation drawers —
// this previously used a fixed 5-item list unrelated to Scope at all).



export interface AddFindingDrawerData {
  existing?: Partial<FindingFormModel> & { id?: string };
  mode?: FindingDrawerMode;
}

export type FindingStatus = FindingFormStatus;

export interface FindingFormModel {
  title: string;
  severity?: string;
  subdivision?: string | null;
  observationIds?:string[];
  scope?: string;
  subscope?: string;
  /** No Status control exists in this form (see template) — always defaults
   *  to 'Open' at runtime regardless of the finding's actual status. */
  status: FindingStatus;
  dueDate?: Date | null;
  description?: string;
  documents?: File[];
  risk?:string;
  company:string;
  division:string;
  /** Collected by the form (see `taskId` control below) but previously
   *  missing from this interface — added so callers can read it off
   *  `AddFindingResult.form` without a cast. */
  taskId?: string;
  isRepeated?: boolean;
  repeatedScope?: string;
  repeatedSubscope?: string;
  repeatedTaskId?: string;
}

export interface AddFindingResult {
  mode: FindingDrawerMode;
  userId?: string;
  form: FindingFormModel;
}

export interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-findings',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    TextareaModule,
    FileUploadModule,MultiSelectModule,
    ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './findings.component.html',
  styleUrl: './findings.component.scss'
})
export class FindingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<AddFindingResult, AddFindingDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddFindingDrawerData | null;
  private readonly messageService = inject(MessageService);
  private readonly clientMode = inject(CLIENT_MODE);

  /**
   * Active Company -> Division -> Sub-division -> Scope -> Sub-scope directory —
   * ORG_STATIC_DATA_INTERNAL_AUDIT (the active internal-audit org's own
   * static seed) when CLIENT_MODE is 'internal-audit', otherwise the
   * multi-company ORG_STATIC_DATA roster. Same CLIENT_MODE ? … : … pattern
   * findings-list.component.ts's `orgData` computed already uses, so this
   * drawer's Company/Division/Sub-division/Scope/Sub-scope options always match
   * what the Findings list's own filters offer instead of unconditionally
   * showing the audit-firm roster even in internal-audit mode.
   */
  readonly orgData = computed(() =>
    this.clientMode === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA,
  );

  readonly mode: FindingDrawerMode = this.drawerData?.mode ?? FindingDrawerModes.Create;
  readonly isEdit: boolean = this.mode === FindingDrawerModes.Edit;

  /* ── Template constants ── */
  readonly placeholders = FINDING_FORM_PLACEHOLDERS;
  readonly upload       = FINDING_UPLOAD;

  /** True when this build is running in internal-audit client mode — see client-mode.ts. */
  readonly isInternalAudit = CLIENT_MODE_VALUE === 'internal-audit';

  readonly form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(FINDING_FIELD_LIMITS.TitleMin), Validators.maxLength(FINDING_FIELD_LIMITS.TitleMax)]],
    severity:    ['', [Validators.required]],
    subdivision: ['', [Validators.required]],
    scope:       ['', [Validators.required]],
    subscope:    ['', [Validators.required]],
    status:      [FindingFormStatuses.Open as FindingStatus, [Validators.required]],
    dueDate:     [null as Date | null],
    description: ['', [Validators.maxLength(FINDING_FIELD_LIMITS.DescriptionMax)]],
    observationIds:[[] as string[]],
    taskId:[''],
    risk:[''],
     company:[''],
  division:[''],
    isRepeated: [false],
    repeatedScope: [''],
    repeatedSubscope: [''],
    repeatedTaskId: [''],
  //subdivision:[''],
  });

  /** Holds uploaded File objects — not part of the reactive form value */
  uploadedFiles: File[] = [];

  readonly selectDivisionLabel = $localize`:@@audit.findings.selectDivision:Select division`;
  readonly selectCompanyFirstLabel = $localize`:@@audit.findings.selectCompanyFirst:Select a company first`;
  readonly selectDivisionFirstLabel = $localize`:@@audit.findings.selectDivisionFirst:Select a division first`;
  readonly selectSubDivisionLabel = $localize`:@@audit.findings.selectSubDivision:Select sub-division`;
  readonly noSubDivisionsLabel = $localize`:@@audit.findings.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly selectScopeLabel = $localize`:@@audit.findings.selectScope:Select scope`;
  readonly selectSubDivisionFirstLabel = $localize`:@@audit.findings.selectSubDivisionFirst:Select a sub-division first`;
  readonly selectScopeFirstLabel = $localize`:@@audit.findings.selectScopeFirst:Select a scope first`;
  readonly selectSubScopeLabel = $localize`:@@audit.findings.selectSubScope:Select sub-scope`;
  readonly noSubScopesLabel = $localize`:@@audit.findings.noSubScopesForScope:No sub-scopes for this scope`;
  readonly selectTaskLabel = $localize`:@@audit.findings.selectTask:Select task`;
  readonly titleLabel = $localize`:@@common.title:Title`;
  readonly companyLabel = $localize`:@@common.company:Company`;
  readonly divisionLabel = $localize`:@@common.division:Division`;
  readonly subDivisionLabel = $localize`:@@common.subDivision:Sub-Division`;
  readonly scopeLabel = $localize`:@@common.scope:Scope`;
  readonly subScopeLabel = $localize`:@@common.subScope:Sub-Scope`;
  readonly taskLabel = $localize`:@@audit.findings.task:Task`;
  readonly severityLabel = $localize`:@@common.severity:Severity`;
  readonly riskLabel = $localize`:@@audit.findings.risk:Risk`;
  readonly descriptionLabel = $localize`:@@common.description:Description`;

  readonly severityOptions: Option[] = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];

  /**
   * Every company in the shared org-data store, sourced from the common
   * company-org-data.ts file instead of the id-based CompanyDataService
   * lookup this used to have. The option value is the company *name*
   * (AuditFinding.company is a plain display string, not an id) so it
   * matches what the Findings list's Company filter expects.
   *
   * In internal-audit client mode, companies come from COMPANIES_SEED
   * (company-static-indi-org.data.ts) instead — see CLIENT_MODE_VALUE above.
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.orgData()
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Selected Company / Division, as signals — plumbed through valueChanges
   * so divisionOptions/subdivisionOptions recompute live as the user picks a
   * company/division, instead of being static hardcoded lists.
   */
  private readonly selectedCompanyName = toSignal(
    this.form.controls.company.valueChanges.pipe(startWith(this.form.controls.company.value)),
    { initialValue: this.form.controls.company.value },
  );

  private readonly selectedDivisionName = toSignal(
    this.form.controls.division.valueChanges.pipe(startWith(this.form.controls.division.value)),
    { initialValue: this.form.controls.division.value },
  );

  /**
   * Divisions for the selected company.
   *
   * Internal-audit mode: sourced from DIVISION_INDI_ORG_COMPANIES
   * (division-static-indi-org.data.ts). Otherwise: sourced from the
   * shared ORG_STATIC_DATA, unchanged from before.
   */
  readonly divisionOptions = computed<Option[]>(() => {
    const companyName = this.selectedCompanyName();
    const company = this.orgData().find(c => c.companyName === companyName);
    if (!company) return [];
    return company.divisions
      .map(b => ({ label: b.divisionName, value: b.divisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Division record for the given company + division names, or undefined. */
  private findDivision(companyName: string | null, divisionName: string | null) {
    const company = this.orgData().find(c => c.companyName === companyName);
    return company?.divisions.find(b => b.divisionName === divisionName);
  }

  /**
   * False when the selected division is flagged `hasSubDivision: false` —
   * Subdivision is then left empty (null) and not validated.
   */
  readonly divisionHasSubDivision = computed(() =>
    this.findDivision(this.selectedCompanyName(), this.selectedDivisionName())?.hasSubDivision !== false,
  );

  /** Sub-divisions for the selected company + division, sourced from the common org data file. */
  readonly subdivisionOptions = computed<Option[]>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (!division || division.hasSubDivision === false) return [];
    return division.subDivisions
      .map(d => ({ label: d.subDivisionName, value: d.subDivisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Subdivision is required unless the selected division is flagged `hasSubDivision: false`. */
  private readonly subdivisionValidatorEffect = effect(() => {
    const ctrl = this.form.get('subdivision');
    if (!ctrl) return;
    const required = this.divisionHasSubDivision();
    if (required !== ctrl.hasValidator(Validators.required)) {
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
  });

  private readonly selectedSubdivisionName = toSignal(
    this.form.controls.subdivision.valueChanges.pipe(startWith(this.form.controls.subdivision.value)),
    { initialValue: this.form.controls.subdivision.value },
  );

  private readonly selectedScopeName = toSignal(
    this.form.controls.scope.valueChanges.pipe(startWith(this.form.controls.scope.value)),
    { initialValue: this.form.controls.scope.value },
  );

  /**
   * The Subdivision record matching the currently selected
   * company/division/subdivision names, or null. Scope -> Sub-scope live
   * nested under Subdivision in whichever dataset is active for the current
   * client mode (ORG_STATIC_DATA for audit-firm, SUB_DIVISION_INDI_ORG_COMPANIES
   * for internal-audit — see companyOptions/divisionOptions/subdivisionOptions
   * above), so Scope/Subscope below cascade off this exactly as before.
   */
  private readonly selectedSubDivision = computed(() => {
    const companyName     = this.selectedCompanyName();
    const divisionName    = this.selectedDivisionName();
    const subDivisionName = this.selectedSubdivisionName();
    const company = this.orgData().find(c => c.companyName === companyName);
    const division = company?.divisions.find(b => b.divisionName === divisionName);
    return division?.subDivisions.find(d => d.subDivisionName === subDivisionName) ?? null;
  });

  /**
   * Where Scope / Sub-scope / Task options come from: the division itself
   * when it's flagged `hasSubDivision: false` (its own `scopes`), otherwise
   * the selected subdivision.
   */
  private readonly scopeSource = computed<ScopeSource | null>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (division?.hasSubDivision === false) return division;
    return this.selectedSubDivision();
  });

  /** Scope is pickable once a subdivision is chosen — or straight after the division when it has no subdivisions. */
  readonly scopeSelectable = computed(() => !!this.scopeSource());

  /**
   * Scopes for the selected subdivision, sourced from the common org data
   * file — replaces the old static 4-item scope list ('Internal Audit',
   * 'External Audit', 'Regulatory', 'Risk Management') which wasn't tied to
   * company-org-data.ts at all.
   */
  readonly scopeOptions = computed<Option[]>(() => {
    return (this.scopeSource()?.scopes ?? [])
      .map(s => ({ label: s.scopeName, value: s.scopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /**
   * Sub-scopes for the selected subdivision + scope. Not every scope has
   * sub-scopes defined in the shared data — when none exist, Subscope
   * becomes optional instead of blocking submission on a field with zero
   * selectable options (see the effect below).
   */
  readonly subscopeOptions = computed<Option[]>(() => {
    const scopeName = this.selectedScopeName();
    const scope = this.scopeSource()?.scopes?.find(s => s.scopeName === scopeName);
    return ((scope as any)?.subScopes ?? [])
      .map((s: any) => ({ label: s.subScopeName, value: s.subScopeName }))
      .sort((a: Option, b: Option) => a.label.localeCompare(b.label));
  });

  /** Subscope is only required when the selected scope actually has sub-scopes to pick from. */
  private readonly subscopeValidatorEffect = effect(() => {
    const ctrl = this.form.get('subscope');
    if (!ctrl) return;
    const required = this.subscopeOptions().length > 0;
    if (required !== ctrl.hasValidator(Validators.required)) {
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
  });

  private readonly selectedSubscopeName = toSignal(
    this.form.controls.subscope.valueChanges.pipe(startWith(this.form.controls.subscope.value)),
    { initialValue: this.form.controls.subscope.value },
  );

  /**
   * Task options for the selected Scope (and, once picked, Sub-scope),
   * sourced from each Scope/Sub-scope's own `tasks[]` in company-org-data.ts
   * via toTaskOptions(). Every real Scope/Sub-scope in that dataset carries
   * its own distinct task list, so switching Scope always changes the Task
   * dropdown — a Sub-scope's tasks take priority over its parent Scope's
   * once a Sub-scope is picked.
   *
   * Note: the internal-audit seed files (division/sub-division-static-indi-org)
   * don't currently carry `tasks[]` on their scopes, so taskOptions will come
   * back empty for internal-audit mode until that data is added there.
   */
  readonly taskOptions = computed<Option[]>(() =>
    toTaskOptions(this.scopeSource(), this.selectedScopeName(), this.selectedSubscopeName()),
  );

  private readonly selectedRepeatedScopeName = toSignal(
    this.form.controls.repeatedScope.valueChanges.pipe(startWith(this.form.controls.repeatedScope.value)),
    { initialValue: this.form.controls.repeatedScope.value },
  );

  private readonly selectedRepeatedSubscopeName = toSignal(
    this.form.controls.repeatedSubscope.valueChanges.pipe(startWith(this.form.controls.repeatedSubscope.value)),
    { initialValue: this.form.controls.repeatedSubscope.value },
  );

  /** Scope records available to the repeated-finding reference. */
  private readonly repeatedScopeRecords = computed(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (!division) return [];
    if (division.hasSubDivision === false || this.selectedSubDivision()) {
      return this.scopeSource()?.scopes ?? [];
    }
    return division.subDivisions.flatMap(subDivision => subDivision.scopes);
  });

  readonly repeatedScopeOptions = computed<Option[]>(() =>
    this.repeatedScopeRecords()
      .map(scope => ({ label: scope.scopeName, value: scope.scopeName }))
      .filter((option, index, options) => options.findIndex(item => item.value === option.value) === index)
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  readonly repeatedSubscopeOptions = computed<Option[]>(() => {
    const scope = this.repeatedScopeRecords().find(s => s.scopeName === this.selectedRepeatedScopeName());
    return ((scope as any)?.subScopes ?? [])
      .map((s: any) => ({ label: s.subScopeName, value: s.subScopeName }))
      .sort((a: Option, b: Option) => a.label.localeCompare(b.label));
  });

  readonly repeatedTaskOptions = computed<Option[]>(() =>
    Array.from(new Map(
      MOCK_PLANS
        .filter(plan => plan.organizationName === this.selectedCompanyName())
        .map(plan => [plan.id, plan.planName]),
    ).entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  private readonly repeatedValidatorEffect = effect(() => {
    const required = !!this.form.controls.isRepeated.value;
    for (const name of ['repeatedScope', 'repeatedTaskId']) {
      const ctrl = this.form.get(name)!;
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
    const subscope = this.form.controls.repeatedSubscope;
    subscope.setValidators(required && this.repeatedSubscopeOptions().length ? [Validators.required] : []);
    subscope.updateValueAndValidity({ emitEvent: false });
  });

  readonly riskOptions: Option[] = FINDING_RISK_OPTIONS;
  readonly observationOptions: Option[] = FINDING_OBSERVATION_OPTIONS;
  ngOnInit(): void {
    // Changing company/division/subdivision invalidates whatever's selected
    // below it — Scope/Subscope are sourced per-subdivision from the shared
    // company-org-data.ts file (Company -> Division -> Subdivision -> Scope ->
    // Sub-scope), so a subdivision change invalidates scope + subscope too,
    // same as a company change invalidates division + subdivision.
    this.form.get('company')!.valueChanges.subscribe(() => {
      this.form.patchValue({ division: '', subdivision: '', scope: '', subscope: '', repeatedScope: '', repeatedSubscope: '', repeatedTaskId: '' }, { emitEvent: false });
    });
    this.form.get('division')!.valueChanges.subscribe(divisionName => {
      // Divisions flagged hasSubDivision: false have no Subdivision — store null.
      const hasSubDivision = this.findDivision(this.form.controls.company.value, divisionName)?.hasSubDivision !== false;
      this.form.patchValue({ subdivision: hasSubDivision ? '' : null, scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('subdivision')!.valueChanges.subscribe(() => {
      this.form.patchValue({ scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('scope')!.valueChanges.subscribe(() => {
      this.form.get('subscope')!.setValue('', { emitEvent: false });
    });
    this.form.get('subscope')!.valueChanges.subscribe(() => {
      // taskOptions (above) recomputes its own list reactively whenever
      // Scope/Subscope changes — this just clears any previously-picked
      // Task so a stale selection from the old Scope/Subscope can't be
      // submitted.
      this.form.get('taskId')!.setValue('', { emitEvent: false });
    });
    this.form.get('isRepeated')!.valueChanges.subscribe(isRepeated => {
      if (!isRepeated) {
        this.form.patchValue({ repeatedScope: '', repeatedSubscope: '', repeatedTaskId: '' }, { emitEvent: false });
      }
    });
    this.form.get('repeatedScope')!.valueChanges.subscribe(() => {
      this.form.patchValue({ repeatedSubscope: '', repeatedTaskId: '' }, { emitEvent: false });
    });
    this.form.get('repeatedSubscope')!.valueChanges.subscribe(() => {
      this.form.get('repeatedTaskId')!.setValue('', { emitEvent: false });
    });

    // FormGroup.patchValue() applies each key of the passed object in that
    // object's own property order, and the caller
    // (findings-list.component.ts's onEditFinding()) always lists company
    // before division before subdivision before scope before subscope before
    // taskId in `existing` — so seeding an existing record all at once
    // still lands on the right values everywhere (each reset above fires
    // first, then the real value for that key is patched in right after,
    // in dependency order). Getting this order wrong once silently blanked
    // Scope/Subscope on edit for evidence-list.component.ts's openEdit().
    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing);
    }
  }

  onFilesSelected(event: FileSelectEvent): void {
    const incoming = Array.from(event.files as FileList | File[]);
    const existing = new Set(this.uploadedFiles.map(f => `${f.name}_${f.size}`));
    const newFiles = incoming.filter(f => !existing.has(`${f.name}_${f.size}`));
    this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return `0 ${FINDING_FILE_SIZE_UNITS[0]}`;
    const k = FINDING_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${FINDING_FILE_SIZE_UNITS[i]}`;
  }

  onCancel(): void {
    this.drawerRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: this.isEdit
        ? $localize`:@@audit.findings.findingUpdated:Finding Updated`
        : $localize`:@@audit.findings.findingCreated:Finding Created`,
      detail: this.isEdit
        ? $localize`:@@audit.findings.updatedSuccess:Finding details have been successfully updated.`
        : $localize`:@@audit.findings.addedSuccess:New finding has been successfully added.`,
    });
    const result: AddFindingResult = {
      mode: this.mode,
      userId: this.drawerData?.existing?.id,
      form: { ...(this.form.value as FindingFormModel), documents: this.uploadedFiles },
    };
    setTimeout(() => this.drawerRef.close(result), FINDING_SUBMIT_CLOSE_DELAY_MS);
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  getError(path: string, field?: string): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors, field);
  }

  private get header() {
    return this.isEdit ? FINDING_DRAWER_HEADERS.Edit : FINDING_DRAWER_HEADERS.Create;
  }

  get headerTitle(): string {
    return this.isEdit
      ? $localize`:@@audit.findings.editFinding:Edit Finding`
      : $localize`:@@audit.findings.addNewFinding:Add New Finding`;
  }

  get headerSubtitle(): string {
    return this.isEdit
      ? $localize`:@@audit.findings.updateFindingDetails:Update finding details`
      : $localize`:@@audit.findings.addFindingSubtitle:Provision platform access for a new finding`;
  }

  get submitLabel(): string {
    return this.isEdit
      ? $localize`:@@audit.findings.saveChanges:Save Changes`
      : $localize`:@@audit.findings.addFindingUppercase:ADD FINDING`;
  }
}
