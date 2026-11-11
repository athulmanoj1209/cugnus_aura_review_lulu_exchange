import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { RiskRating, ObservationStatus } from '../list/observation-list.component';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ORG_STATIC_DATA, ScopeSource, toTaskOptions } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  OBSERVATION_FIELD_LIMITS,
  ObservationApprovalActions,
  ObservationDrawerModes,
  type ObservationApprovalAction,
  type ObservationDrawerMode,
} from '../constants/observation.constants';
import {
  OBSERVATION_DRAWER_ICONS,
  OBSERVATION_EVIDENCE_OPTIONS,
  OBSERVATION_STATUS_OPTIONS,
  RISK_RATING_OPTIONS,
} from '../constants/observation-labels.constants';
import {
  OBSERVATION_CONFIRM_DIALOGS,
  OBSERVATION_DRAWER_HEADERS,
  OBSERVATION_FORM_ERRORS,
  OBSERVATION_FORM_PLACEHOLDERS,
  OBSERVATION_SUBMIT_LABELS,
} from '../constants/observation-messages.constants';

// Company / Division / Sub-Division (and now Scope / Subscope) options below
// come from the shared company-org-data.ts file (the same common
// Company -> Division -> Sub-Division -> Scope -> Sub-scope static data used
// by the Add Member modal, Members list, Companies list, Add Risk drawer,
// Risk Register, Scope Jobs, Evidence Repository filters and the Add
// Evidence drawer) instead of the old hardcoded crowe_uae/dubai/
// internal_audit-style codes and the flat 5-category scope list.
// Observation.company / Observation.division / Observation.subDivision are
// plain display-name strings (not ids/codes), so the option *values* here
// are the company/division/sub-division *names* themselves — matching what
// the Observations list's filters expect (see observation-list.component.ts).
// Adjust the '@/app/data/company-org-data' path if that file lives
// elsewhere.
//
// Task options come from the same company-org-data.ts file's
// toTaskOptions() helper: each Scope/Sub-scope in that dataset now carries
// its own `tasks[]`, so selecting a different Scope always changes the
// Task dropdown (previously this used a separate scope-requests dataset
// that only happened to share a name with a couple of real scopes, so most
// selections silently fell back to one fixed list — same fix as the Add
// Evidence drawer).



export interface AddObservationDrawerData {
  mode?: ObservationDrawerMode;
  existing?: Partial<ObservationFormModel> & { id?: string };
}
export interface ObservationFormModel {
  title:         string;
  description:   string;
  riskRating:    RiskRating;
  scope:         string;
  subscope:      string;
  taskId:        string;
  evidenceIds:   string[];
  /** No Status control exists in this form (see template) — always undefined at
   *  runtime. Consumers should default it (e.g. 'draft' on create, keep existing on edit). */
  status?:        ObservationStatus;
  approverNotes?: string;
  /** Collected by the form but not modelled above previously — added so callers can
   *  read them off `AddObservationResult.form` without a cast. */
  company?:      string;
  division?:     string;
  subDivision?:  string | null;
}
export interface AddObservationResult {
  mode:             ObservationDrawerMode;
  observationId?:   string;
  form:             ObservationFormModel;
  approvalAction?:  ObservationApprovalAction;
}
export interface Option { label: string; value: string; }

@Component({
  selector: 'app-observation',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, SelectModule, MultiSelectModule, TextareaModule,DrawIconComponent
  ],
  templateUrl: './observation.component.html',
  styleUrl: './observation.component.scss',
})
export class ObservationComponent implements OnInit {
  private readonly fb          = inject(FormBuilder);
  private readonly drawerRef   = inject(DrawerRef) as DrawerRef<AddObservationResult, AddObservationDrawerData>;
  private readonly drawerData  = inject(DRAWER_DATA, { optional: true }) as AddObservationDrawerData | null;
  private readonly confirmSvc  = inject(ConfirmDialogService);

  readonly mode      = this.drawerData?.mode ?? 'create';
  readonly isEdit    = this.mode === 'edit';
  readonly isApprove = this.mode === 'approve';

  readonly selectDivisionLabel = $localize`:@@audit.observations.selectDivision:Select division`;
  readonly selectCompanyFirstLabel = $localize`:@@audit.observations.selectCompanyFirst:Select a company first`;
  readonly selectDivisionFirstLabel = $localize`:@@audit.observations.selectDivisionFirst:Select a division first`;
  readonly selectSubDivisionLabel = $localize`:@@audit.observations.selectSubDivision:Select sub-division`;
  readonly noSubDivisionsLabel = $localize`:@@audit.observations.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly selectScopeLabel = $localize`:@@audit.observations.selectScope:Select scope`;
  readonly selectSubDivisionFirstLabel = $localize`:@@audit.observations.selectSubDivisionFirst:Select a sub-division first`;
  readonly selectScopeFirstLabel = $localize`:@@audit.observations.selectScopeFirst:Select a scope first`;
  readonly selectSubScopeLabel = $localize`:@@audit.observations.selectSubScope:Select sub-scope`;
  readonly noSubScopesLabel = $localize`:@@audit.observations.noSubScopesForScope:No sub-scopes for this scope`;
  readonly selectTaskLabel = $localize`:@@audit.observations.selectTask:Select task`;
  readonly titleLabel = $localize`:@@common.title:Title`;
  readonly subDivisionLabel = $localize`:@@common.subDivision:Sub-Division`;
  readonly scopeLabel = $localize`:@@common.scope:Scope`;
  readonly subScopeLabel = $localize`:@@common.subScope:Sub-Scope`;
  readonly taskLabel = $localize`:@@audit.findings.task:Task`;
  readonly riskRatingLabel = $localize`:@@audit.observations.riskRating:Risk Rating`;
  readonly notesLabel = $localize`:@@audit.observations.notes:Notes`;
  readonly drawerIcons = OBSERVATION_DRAWER_ICONS;
  readonly placeholders = OBSERVATION_FORM_PLACEHOLDERS;
  readonly formErrors = OBSERVATION_FORM_ERRORS;

  readonly form = this.fb.group({
    title:         ['', [Validators.required, Validators.minLength(OBSERVATION_FIELD_LIMITS.TitleMin), Validators.maxLength(OBSERVATION_FIELD_LIMITS.TitleMax)]],
    description:   ['', [Validators.required, Validators.maxLength(OBSERVATION_FIELD_LIMITS.DescriptionMax)]],
    riskRating:    ['' as RiskRating, [Validators.required]],
    scope:         ['', [Validators.required]],
    subscope:      ['', [Validators.required]],
    evidenceIds:   [[] as string[]],
    taskId:        ['', [Validators.required]],
    approverNotes: [''],   // only used in approve mode
    company:       [''], division: [''], subDivision: [''],
  });

  /**
   * ORG_STATIC_DATA_INTERNAL_AUDIT (the active internal-audit org's own
   * static seed) when CLIENT_MODE_VALUE is 'internal-audit', otherwise the
   * multi-company ORG_STATIC_DATA roster — same switch add-working-paper /
   * add-recommendation / add-finding use, so Company/Division/Sub-division (and
   * the Scope/Subscope/Task cascade below) match the active client mode.
   */
  readonly orgData = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA,
  );

  /**
   * Every company in the shared org-data store, sourced from the common
   * company-org-data.ts file instead of the hardcoded placeholder list
   * this used to have ("Crowe UAE", "Crowe Oman", ...). The option value
   * is the company *name* (Observation.company is a plain display string,
   * not an id) so it matches what the Observations list's Company filter
   * expects.
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.orgData()
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Selected Company / Division, as signals — plumbed through valueChanges
   * so divisionOptions/subDivisionOptions recompute live as the user picks a
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

  /** Divisions for the selected company, sourced from the common org data file. */
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
   * Sub-Division is then left empty (null) and not validated.
   */
  readonly divisionHasSubDivision = computed(() =>
    this.findDivision(this.selectedCompanyName(), this.selectedDivisionName())?.hasSubDivision !== false,
  );

  /** Sub-divisions for the selected company + division, sourced from the common org data file. */
  readonly subDivisionOptions = computed<Option[]>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (!division || division.hasSubDivision === false) return [];
    return division.subDivisions
      .map(d => ({ label: d.subDivisionName, value: d.subDivisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Sub-Division is only required when the selected division actually has sub-divisions to pick from. */
  private readonly subDivisionValidatorEffect = effect(() => {
    const ctrl = this.form.get('subDivision');
    if (!ctrl) return;
    const required = this.subDivisionOptions().length > 0;
    if (required !== ctrl.hasValidator(Validators.required)) {
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
  });

  private readonly selectedSubDivisionName = toSignal(
    this.form.controls.subDivision.valueChanges.pipe(startWith(this.form.controls.subDivision.value)),
    { initialValue: this.form.controls.subDivision.value },
  );

  private readonly selectedScopeName = toSignal(
    this.form.controls.scope.valueChanges.pipe(startWith(this.form.controls.scope.value)),
    { initialValue: this.form.controls.scope.value },
  );

  /**
   * The Sub-Division record matching the currently selected
   * company/division/sub-division names, or null. Scope -> Sub-scope live
   * nested under Sub-Division in company-org-data.ts (Company -> Division ->
   * Sub-Division -> Scope -> Sub-scope), so Scope/Subscope below cascade off
   * this instead of the old flat, hardcoded scope/subscope lists.
   */
  private readonly selectedSubDivision = computed(() => {
    const companyName     = this.selectedCompanyName();
    const divisionName    = this.selectedDivisionName();
    const subDivisionName = this.selectedSubDivisionName();
    const company = this.orgData().find(c => c.companyName === companyName);
    const division = company?.divisions.find(b => b.divisionName === divisionName);
    return division?.subDivisions.find(d => d.subDivisionName === subDivisionName) ?? null;
  });

  /**
   * Where Scope / Sub-scope / Task options come from: the division itself
   * when it's flagged `hasSubDivision: false` (its own `scopes`), otherwise
   * the selected sub-division.
   */
  private readonly scopeSource = computed<ScopeSource | null>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (division?.hasSubDivision === false) return division;
    return this.selectedSubDivision();
  });

  /** Scope is pickable once a sub-division is chosen — or straight after the division when it has no sub-divisions. */
  readonly scopeSelectable = computed(() => !!this.scopeSource());

  /**
   * Scopes for the selected sub-division, sourced from the common org data
   * file — replaces the old static 5-item scope list ('Internal Audit',
   * 'External Audit', 'Regulatory', 'Risk Management', 'IT') which wasn't
   * tied to company-org-data.ts at all.
   */
  readonly scopeOptions = computed<Option[]>(() => {
    return (this.scopeSource()?.scopes ?? [])
      .map(s => ({ label: s.scopeName, value: s.scopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /**
   * Sub-scopes for the selected sub-division + scope. Not every scope has
   * sub-scopes defined in the shared data — when none exist, Subscope
   * becomes optional instead of blocking submission on a field with zero
   * selectable options (see the effect below).
   */
  readonly subscopeOptions = computed<Option[]>(() => {
    const scopeName = this.selectedScopeName();
    const scope = this.scopeSource()?.scopes?.find(s => s.scopeName === scopeName);
    return (scope?.subScopes ?? [])
      .map(s => ({ label: s.subScopeName, value: s.subScopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
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
   */
  readonly taskOptions = computed<Option[]>(() =>
    toTaskOptions(this.scopeSource(), this.selectedScopeName(), this.selectedSubscopeName()),
  );

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

  readonly riskOptions: Option[] = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];
  readonly statusOptions: Option[] = [
    { label: 'Draft',     value: 'draft'     },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Reviewed',  value: 'reviewed'  },
    { label: 'Approved',  value: 'approved'  },
  ];
  readonly evidenceOptions: Option[] = [
    { label: 'EV-001 — Bank Reconciliation Q1',   value: 'EV-001' },
    { label: 'EV-002 — IT Access Control Review',  value: 'EV-002' },
    { label: 'EV-003 — HR Policy Document',        value: 'EV-003' },
    { label: 'EV-004 — Vendor Contract Audit',     value: 'EV-004' },
    { label: 'EV-005 — Patch Management Logs',     value: 'EV-005' },
  ];
  ngOnInit(): void {
    // Changing company/division/subDivision invalidates whatever's selected
    // below it — Scope/Subscope are sourced per-sub-division from the shared
    // company-org-data.ts file (Company -> Division -> Sub-Division -> Scope
    // -> Sub-scope), so a sub-division change invalidates scope + subscope
    // too, same as a company change invalidates division + subDivision.
    this.form.get('company')!.valueChanges.subscribe(() => {
      this.form.patchValue({ division: '', subDivision: '', scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('division')!.valueChanges.subscribe(divisionName => {
      // Divisions flagged hasSubDivision: false have no Sub-Division — store null.
      const hasSubDivision = this.findDivision(this.form.controls.company.value, divisionName)?.hasSubDivision !== false;
      this.form.patchValue({ subDivision: hasSubDivision ? '' : null, scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('subDivision')!.valueChanges.subscribe(() => {
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

    // FormGroup.patchValue() applies each key of the passed object in that
    // object's own property order, and the caller
    // (observation-list.component.ts's openEdit()) always lists company
    // before division before subDivision before scope before subscope before
    // taskId in `existing` — so seeding an existing record all at once
    // still lands on the right values everywhere (each reset above fires
    // first, then the real value for that key is patched in right after,
    // in dependency order). If a future caller passes `existing` in a
    // different order, a dependency listed after its dependent field would
    // have its reset fire *after* the real value was set, silently
    // blanking it — this bit once for evidence-list.component.ts's
    // openEdit() before its ordering was fixed.
    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing as any);
    }
  }

  /* ── Approve / Reject ────────────────────────────────────────── */
  async onApprove(): Promise<void> {
    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.observations.confirmApproval:Confirm Approval`,
      message: $localize`:@@audit.observations.confirmApprovalMessage:Are you sure you want to approve this observation? This action cannot be undone.`,
      action: 'approve',
      confirmLabel: $localize`:@@audit.observations.yesApprove:Yes, Approve`,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode:           ObservationDrawerModes.Approve,
      observationId:  this.drawerData?.existing?.id,
      form:           this.form.getRawValue() as unknown as ObservationFormModel,
      approvalAction: ObservationApprovalActions.Approve,
    });
  }

  async onReject(): Promise<void> {
    const notes = this.form.get('approverNotes')!;
    notes.setValidators([Validators.required, Validators.minLength(OBSERVATION_FIELD_LIMITS.ApproverNotesMin)]);
    notes.updateValueAndValidity();
    notes.markAsTouched();
    if (!notes.value?.trim()) return;   // show inline validation error, stop

    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.observations.confirmRejection:Confirm Rejection`,
      message: $localize`:@@audit.observations.confirmRejectionMessage:Are you sure you want to reject this observation? The submitter will be notified.`,
      action: 'reject',
      confirmLabel: $localize`:@@audit.observations.yesReject:Yes, Reject`,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode:           ObservationDrawerModes.Approve,
      observationId:  this.drawerData?.existing?.id,
      form:           this.form.getRawValue() as unknown as ObservationFormModel,
      approvalAction: ObservationApprovalActions.Reject,
    });
  }

  /* ── Create / Edit ───────────────────────────────────────────── */
  isInvalid(path: string): boolean {
    const c = this.form.get(path);
    return !!c && c.touched && c.invalid;
  }
  getError(path: string, field?: string): string | null {
    const c = this.form.get(path);
    if (!c || !c.touched) return null;
    return firstErrorMessage(c.errors, field);
  }

  onCancel(): void { this.drawerRef.close(null); }
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.drawerRef.close({
      mode: this.mode,
      observationId: this.drawerData?.existing?.id,
      form: this.form.value as unknown as ObservationFormModel,
    });
  }

  /* ── Computed labels ─────────────────────────────────────────── */
  get headerTitle(): string {
    if (this.isApprove) {
      return $localize`:@@audit.observations.reviewObservation:Review Observation`;
    }

    return this.isEdit
      ? $localize`:@@audit.observations.editObservation:Edit Observation`
      : $localize`:@@audit.observations.addObservation:Add Observation`;
  }
  get headerSubtitle(): string {
    if (this.isApprove) {
      return $localize`:@@audit.observations.reviewObservationSubtitle:Edit observation details, add your notes and approve or reject`;
    }

    return this.isEdit
      ? $localize`:@@audit.observations.editObservationSubtitle:Update observation details`
      : $localize`:@@audit.observations.addObservationSubtitle:Record an auditor observation linked to evidence`;
  }
  get submitLabel(): string {
    return this.isEdit
      ? $localize`:@@audit.observations.updateObservationUppercase:UPDATE OBSERVATION`
      : $localize`:@@audit.observations.addObservationUppercase:ADD OBSERVATION`;
  }

}
