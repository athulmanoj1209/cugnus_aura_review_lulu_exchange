import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA, ScopeSource, toTaskOptions } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';

import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

// ── CLIENT_MODE-driven data source ──────────────────────────────────────
// When CLIENT_MODE_VALUE is 'internal-audit', Company/Division/Sub-Division/
// Scope/Sub-scope no longer come from the shared multi-company
// company-org-data.ts (ORG_STATIC_DATA) — they come from the dedicated
// single-organisation (DAR Exchange) "*-indi-org.data.ts" seed files:
//   - Company      -> company-static-indi-org.data.ts   (COMPANIES_SEED)
//   - Division     -> division-static-indi-org.data.ts     (DIVISION_INDI_ORG_COMPANIES)
//   - Sub-Division -> sub-division-static-indi-org.data.ts (SUB_DIVISION_INDI_ORG_COMPANIES)
//   - Scope/Subscope/Task -> audit-scope-static-indi-org.data.ts (SCOPE_INDI_ORG_COMPANIES)
// Any other CLIENT_MODE_VALUE (e.g. 'audit-firm') keeps using the existing
// ORG_STATIC_DATA source exactly as before.
//
// NOTE: adjust the import paths below ('../../client-mode',
// '../../data/company-static-indi-org.data', etc.) to match where these
// files actually live in the project — they were supplied as loose files,
// so the paths here are best-guess placeholders, same as the existing
// '@/app/data/company-org-data' note above.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES as SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import type { StaticScope } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import {
  EVIDENCE_FIELD_LIMITS,
  EVIDENCE_FILE_SIZE_BASE,
  EVIDENCE_FILE_SIZE_UNITS,
  EVIDENCE_UPLOAD,
  EvidenceApprovalActions,
  EvidenceDrawerModes,
  type EvidenceApprovalAction,
  type EvidenceDrawerMode,
} from '../constants/evidence.constants';
import {
  EVIDENCE_DRAWER_ICONS,
  EVIDENCE_FILE_ICON_DEFAULT,
  EVIDENCE_FILE_ICONS,
  EVIDENCE_TYPE_OPTIONS,
} from '../constants/evidence-labels.constants';
import {
  EVIDENCE_CONFIRM_DIALOGS,
  EVIDENCE_DRAWER_HEADERS,
  EVIDENCE_FORM_ERRORS,
  EVIDENCE_SUB_DIVISION_PLACEHOLDERS,
  EVIDENCE_SUBMIT_LABELS,
  EVIDENCE_TASK_PLACEHOLDERS,
  EVIDENCE_TOAST_MESSAGES,
} from '../constants/evidence-messages.constants';

// Company / Division / Sub-Division options below come from the shared
// company-org-data.ts file (the same common Company -> Division -> Sub-Division
// static data used by the Add Member modal, Members list, Companies list,
// Add Risk drawer, Risk Register, Scope Jobs and Evidence Repository
// filters) instead of a hardcoded CompanyDataService lookup + static
// division/sub-division lists. evidence-list.component.ts maps this form's
// division / subDivision fields onto the Evidence model at the drawer
// boundary (see openEdit()/addEvidenceFromResult()/updateEvidenceFromResult()
// there). The Evidence company / division / sub-division values are plain
// display-name strings (not ids/codes), so the option *values* here are
// the company/division/sub-division *names* themselves — that keeps everything
// created here consistent with the Evidence Repository's filters, which
// also match on name. Adjust the '@/app/data/company-org-data' path if
// that file lives elsewhere.
//
// Task options come from the same company-org-data.ts file's
// toTaskOptions() helper: each Scope/Sub-scope in that dataset now carries
// its own `tasks[]`, so selecting a different Scope always changes the
// Task dropdown (previously this used a separate scope-requests dataset
// that only happened to share a name with a couple of real scopes, so most
// selections silently fell back to one fixed list).
//
// ...unless CLIENT_MODE_VALUE is 'internal-audit' — see the block above and
// the `isInternalAudit` code paths below, where all five of those fields are
// instead sourced from the *-indi-org.data.ts files.


/**
 * Task options for a Scope/Sub-scope coming from the *-indi-org.data.ts
 * "internal-audit" dataset (audit-scope-static-indi-org.data.ts).
 *
 * Unlike company-org-data.ts's shape (a Scope object with its own `tasks[]`
 * plus a `subScopes[]` array, each sub-scope carrying its own `tasks[]`),
 * this dataset stores every scope AND sub-scope as a flat sibling
 * `StaticScope` record in the same `scopes[]` array: a top-level scope has
 * `parentScopeId: null`, and a sub-scope has `parentScopeId` set to its
 * parent's `id` (e.g. 'SC-5000'). Each of those StaticScope records — top
 * level or sub-scope — carries its own `tasks: ScopeTask[]` directly.
 *
 * So: find the selected top-level scope by name, then if a sub-scope name
 * is also selected, find that sub-scope among the records whose
 * `parentScopeId` equals the parent's `id` and use its tasks; otherwise use
 * the top-level scope's own tasks (only scopes with no sub-scopes carry
 * tasks directly, e.g. SC-5100/SC-5200/SC-5300).
 */
function toIndiOrgTaskOptions(
  scopes: StaticScope[],
  scopeName: string | null | undefined,
  subscopeName: string | null | undefined,
): Option[] {
  const parent = scopes.find(s => s.parentScopeId === null && s.scopeName === scopeName);
  if (!parent) return [];

  const source = subscopeName
    ? scopes.find(s => s.parentScopeId === parent.id && s.scopeName === subscopeName)
    : parent;

  return (source?.tasks ?? [])
    .map(t => ({ label: t.taskName, value: t.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
}


export interface AddEvidenceDrawerData {
  mode?: EvidenceDrawerMode;
  existing?: Partial<EvidenceFormModel> & { id?: string };
}
export interface EvidenceFormModel {
  title: string; evidenceType: string; scope: string; subscope: string;
  taskId: string; description?: string; documents?: File[];
  company: string; division: string;
  subDivision: string | null; approverNotes?: string;
}
export interface AddEvidenceResult {
  mode: EvidenceDrawerMode;
  evidenceId?: string; form: EvidenceFormModel; approvalAction?: EvidenceApprovalAction;
}
export interface Option { label: string; value: string; }

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
            SelectModule, TextareaModule, FileUploadModule, ToastModule,DrawIconComponent],
  providers: [MessageService],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss',
})
export class EvidenceComponent implements OnInit {
  private readonly fb         = inject(FormBuilder);
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AddEvidenceResult, AddEvidenceDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddEvidenceDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);

  readonly mode      = this.drawerData?.mode ?? EvidenceDrawerModes.Create;
  readonly isEdit    = this.mode === EvidenceDrawerModes.Edit;
  readonly isApprove = this.mode === EvidenceDrawerModes.Approve;

  /* ── Template constants ── */
  readonly upload                  = EVIDENCE_UPLOAD;
  readonly drawerIcons             = EVIDENCE_DRAWER_ICONS;
  readonly formErrors              = EVIDENCE_FORM_ERRORS;
  readonly subDivisionPlaceholders = EVIDENCE_SUB_DIVISION_PLACEHOLDERS;
  readonly taskPlaceholders        = EVIDENCE_TASK_PLACEHOLDERS;

  readonly selectSubDivisionLabel = $localize`:@@audit.evidence.selectSubDivision:Select sub-division`;
  readonly noSubDivisionsLabel = $localize`:@@audit.evidence.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly selectScopeFirstLabel = $localize`:@@audit.evidence.selectScopeFirst:Select a scope first`;
  readonly selectTaskLabel = $localize`:@@audit.evidence.selectTask:Select task`;
  readonly titleLabel = $localize`:@@common.title:Title`;
  readonly evidenceTypeLabel = $localize`:@@audit.evidence.evidenceType:Evidence Type`;
  readonly subDivisionLabel = $localize`:@@common.subDivision:Sub-Division`;
  readonly scopeLabel = $localize`:@@common.scope:Scope`;
  readonly subScopeLabel = $localize`:@@common.subScope:Sub-Scope`;
  readonly taskLabel = $localize`:@@audit.evidence.task:Task`;
  readonly descriptionLabel = $localize`:@@common.description:Description`;

  /** True when this build is running for a single self-auditing organisation
   *  (CLIENT_MODE_VALUE === 'internal-audit') — in that case Company /
   *  Division / Sub-Division / Scope / Sub-scope are sourced from the
   *  dedicated *-indi-org.data.ts seed files instead of ORG_STATIC_DATA. */
  readonly isInternalAudit = CLIENT_MODE_VALUE === 'internal-audit';

  readonly form = this.fb.group({
    title:         ['', [Validators.required, Validators.minLength(EVIDENCE_FIELD_LIMITS.TitleMin), Validators.maxLength(EVIDENCE_FIELD_LIMITS.TitleMax)]],
    evidenceType:  ['', [Validators.required]],
    scope:         ['', [Validators.required]],
    subscope:      ['', [Validators.required]],
    taskId:        ['', [Validators.required]],
    description:   ['', [Validators.maxLength(EVIDENCE_FIELD_LIMITS.DescriptionMax)]],
    company:       [''], division: [''], subDivision: [''],
    approverNotes: [''],
  });

  uploadedFiles: File[] = [];

  readonly evidenceTypeOptions: Option[] = [
    { label: $localize`:@@audit.evidence.typeDocument:Document`, value: 'document' },
    { label: $localize`:@@audit.evidence.typeScreenshot:Screenshot`, value: 'screenshot' },
    { label: $localize`:@@audit.evidence.typeInterviewNotes:Interview Notes`, value: 'interview_notes' },
    { label: $localize`:@@audit.evidence.typeSystemLog:System Log`, value: 'system_log' },
    { label: $localize`:@@audit.evidence.typeEmail:Email`, value: 'email' },
    { label: $localize`:@@audit.evidence.typePhysicalInspection:Physical Inspection`, value: 'physical_inspection' },
    { label: $localize`:@@audit.evidence.typeOther:Other`, value: 'other' },
  ];
  /**
   * ORG_STATIC_DATA_INTERNAL_AUDIT (the active internal-audit org's own
   * static seed) when CLIENT_MODE_VALUE is 'internal-audit', otherwise the
   * multi-company ORG_STATIC_DATA roster — same switch add-working-paper /
   * add-recommendation / add-finding use, so Company/Division/Sub-Division (and
   * the Scope/Subscope/Task cascade below) match the active client mode.
   */
  readonly orgData = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA,
  );

  /**
   * Every company in the shared org-data store, sourced from the common
   * company-org-data.ts file instead of the hardcoded placeholder list
   * this used to have ("Crowe UAE", "Crowe Oman", ...). The option value
   * is the company *name* (Evidence.company is a plain display string,
   * not an id) so it matches what the Evidence Repository's Company
   * filter expects.
   *
   * In 'internal-audit' mode this instead lists the single self-auditing
   * organisation from company-static-indi-org.data.ts's COMPANIES_SEED.
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.orgData()
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Selected Company / Division, as signals — plumbed through valueChanges
   * so divisionOptions/subDivisionOptions recompute live as the user picks
   * a company/division, instead of being static hardcoded lists.
   */
  private readonly selectedCompanyName = toSignal(
    this.form.controls.company.valueChanges.pipe(startWith(this.form.controls.company.value)),
    { initialValue: this.form.controls.company.value },
  );

  /** Selected Division. */
  private readonly selectedDivisionName = toSignal(
    this.form.controls.division.valueChanges.pipe(startWith(this.form.controls.division.value)),
    { initialValue: this.form.controls.division.value },
  );

  /**
   * Division options for the selected company.
   * Sourced from the common org data file, or — in 'internal-audit' mode —
   * from division-static-indi-org.data.ts's DIVISION_INDI_ORG_COMPANIES.
   */
  readonly divisionOptions = computed<Option[]>(() => {
    const companyName = this.selectedCompanyName();
    const company = this.orgData().find(c => c.companyName === companyName);
    if (!company) return [];
    return company.divisions
      .map(d => ({ label: d.divisionName, value: d.divisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Division record for the given company + division names, or undefined. */
  private findDivision(companyName: string | null, divisionName: string | null) {
    const company = this.orgData().find(c => c.companyName === companyName);
    return company?.divisions.find(d => d.divisionName === divisionName);
  }

  /**
   * False when the selected division is flagged `hasSubDivision: false` —
   * Sub-Division is then left empty (null) and not validated.
   */
  readonly divisionHasSubDivision = computed(() =>
    this.findDivision(this.selectedCompanyName(), this.selectedDivisionName())?.hasSubDivision !== false,
  );

  /** "Sub-Division" options for the selected company + division, sourced from the common org data file. */
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

  /** Selected Sub-Division. */
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
   * this instead of the old flat, hardcoded scope list.
   *
   * Only used in the non-'internal-audit' code path — see
   * `selectedIndiOrgScopes` below for the 'internal-audit' equivalent.
   */
  private readonly selectedSubDivision = computed(() => {
    const companyName     = this.selectedCompanyName();
    const divisionName    = this.selectedDivisionName();
    const subDivisionName = this.selectedSubDivisionName();
    const company  = this.orgData().find(c => c.companyName === companyName);
    const division = company?.divisions.find(d => d.divisionName === divisionName);
    return division?.subDivisions.find(s => s.subDivisionName === subDivisionName) ?? null;
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

  /**
   * 'internal-audit' equivalent of `selectedSubDivision`: the flat StaticScope[]
   * (top-level scopes + sub-scopes) for the selected company/division/
   * sub-division in audit-scope-static-indi-org.data.ts.
   */
  private readonly selectedIndiOrgScopes = computed<StaticScope[]>(() => {
    const company     = SCOPE_INDI_ORG_COMPANIES.find(c => c.companyName === this.selectedCompanyName());
    const division    = company?.divisions.find(d => d.divisionName === this.selectedDivisionName());
    const subDivision = division?.subDivisions.find(s => s.subDivisionName === this.selectedSubDivisionName());
    return subDivision?.scopes ?? [];
  });

  /**
   * Scopes for the selected sub-division, sourced from the common org data
   * file — replaces the old static 5-item scope list ('Internal Audit',
   * 'External Audit', 'Regulatory', 'Risk Management', 'IT') which wasn't
   * tied to company-org-data.ts at all.
   *
   * In 'internal-audit' mode, sourced instead from
   * audit-scope-static-indi-org.data.ts — only the top-level records
   * (`parentScopeId === null`) count as "Scope" here; their children are
   * the "Subscope" options below.
   */
  readonly scopeOptions = computed<Option[]>(() => {
    if (this.isInternalAudit) {
      return this.selectedIndiOrgScopes()
        .filter(s => s.parentScopeId === null)
        .map(s => ({ label: s.scopeName, value: s.scopeName }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    return (this.scopeSource()?.scopes ?? [])
      .map(s => ({ label: s.scopeName, value: s.scopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /**
   * Sub-scopes for the selected sub-division + scope. Not every scope has
   * sub-scopes defined in the shared data — when none exist, Subscope
   * becomes optional instead of blocking submission on a field with zero
   * selectable options (see the effect below).
   *
   * In 'internal-audit' mode, sub-scopes are the StaticScope records whose
   * `parentScopeId` equals the selected top-level scope's `id`.
   */
  readonly subscopeOptions = computed<Option[]>(() => {
    if (this.isInternalAudit) {
      const scopeName = this.selectedScopeName();
      const scopes = this.selectedIndiOrgScopes();
      const parent = scopes.find(s => s.parentScopeId === null && s.scopeName === scopeName);
      if (!parent) return [];
      return scopes
        .filter(s => s.parentScopeId === parent.id)
        .map(s => ({ label: s.scopeName, value: s.scopeName }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    const scopeName = this.selectedScopeName();
    const scope = this.scopeSource()?.scopes?.find(s => s.scopeName === scopeName);
    return (scope?.subScopes ?? [])
      .map(s => ({ label: s.subScopeName, value: s.subScopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
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
   * In 'internal-audit' mode, the same rule is applied over the flat
   * StaticScope[] from audit-scope-static-indi-org.data.ts via
   * toIndiOrgTaskOptions() (see above).
   */
  readonly taskOptions = computed<Option[]>(() => {
    if (this.isInternalAudit) {
      return toIndiOrgTaskOptions(this.selectedIndiOrgScopes(), this.selectedScopeName(), this.selectedSubscopeName());
    }
    return toTaskOptions(this.scopeSource(), this.selectedScopeName(), this.selectedSubscopeName());
  });

  ngOnInit(): void {
    // Changing company/division/sub-division invalidates whatever's
    // selected below it — Scope/Subscope are sourced per-sub-division from
    // the shared company-org-data.ts file (Company -> Division -> Sub-Division
    // -> Scope -> Sub-scope), so a sub-division change invalidates scope +
    // subscope too, same as a company change invalidates division +
    // sub-division. This mirrors the pre-existing scope -> subscope -> task
    // reset chain below it. (Applies the same way in 'internal-audit' mode,
    // since Company -> Division -> Sub-Division -> Scope -> Sub-scope is
    // still a strict cascade there, just sourced from the *-indi-org files.)
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

    // FormGroup.patchValue() applies each key of the passed object in
    // that object's own property order, and the caller
    // (evidence-list.component.ts) always lists company before division
    // before subDivision before scope before subscope before taskId in
    // `existing` — so seeding an existing record all at once still lands
    // on the right values everywhere (each reset above fires first, then
    // the real value for that key is patched in right after, in
    // dependency order).
    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing as any);
    }
  }

  async onApprove(): Promise<void> {
    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.evidence.confirmApproval:Confirm Approval`,
      message: $localize`:@@audit.evidence.confirmApprovalMessage:Are you sure you want to approve this evidence? This action cannot be undone.`,
      action: 'approve',
      confirmLabel: $localize`:@@audit.evidence.yesApprove:Yes, Approve`,
    });
    if (!confirmed) return;
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Evidence Approved',
    //   detail: 'The evidence has been approved successfully.',
    // });
    const result: AddEvidenceResult = {
      mode: EvidenceDrawerModes.Approve, evidenceId: this.drawerData?.existing?.id,
      form: { ...(this.form.getRawValue() as unknown as EvidenceFormModel), documents: this.uploadedFiles },
      approvalAction: EvidenceApprovalActions.Approve,
    };
    this.drawerRef.close(result);
   // setTimeout(() => this.drawerRef.close(result), 1200);
    this.toast.success(
      $localize`:@@audit.evidence.approvedSuccess:The evidence has been approved successfully.`,
      $localize`:@@audit.evidence.evidenceApproved:Evidence Approved`
    );
  }

  async onReject(): Promise<void> {
    const notes = this.form.get('approverNotes')!;
    notes.setValidators([Validators.required, Validators.minLength(EVIDENCE_FIELD_LIMITS.ApproverNotesMin)]);
    notes.updateValueAndValidity();
    notes.markAsTouched();
    if (!notes.value?.trim()) return;

    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.evidence.confirmRejection:Confirm Rejection`,
      message: $localize`:@@audit.evidence.confirmRejectionMessage:Are you sure you want to reject this evidence? The submitter will be notified.`,
      action: 'reject',
      confirmLabel: $localize`:@@audit.evidence.yesReject:Yes, Reject`,
    });
    if (!confirmed) return;

     const result: AddEvidenceResult = {
      mode: EvidenceDrawerModes.Approve, evidenceId: this.drawerData?.existing?.id,
      form: { ...(this.form.getRawValue() as unknown as EvidenceFormModel), documents: this.uploadedFiles },
      approvalAction: EvidenceApprovalActions.Reject,
    };
     this.drawerRef.close(result)
    this.toast.error(
      $localize`:@@audit.evidence.rejectedMessage:The evidence has been rejected.`,
      $localize`:@@audit.evidence.evidenceRejected:Evidence Rejected`
    );
  //  this.messageService.add({
  //     severity: 'success',
  //     summary: 'Evidence Rejected',
  //     detail: 'The evidence has been rejected and the submitter notified.',
  //   });
  //   setTimeout(() => this.drawerRef.close(result), 1200);
  }

  onFilesSelected(event: FileSelectEvent): void {
    const incoming = Array.from(event.files as FileList | File[]);
    const existing = new Set(this.uploadedFiles.map(f => `${f.name}_${f.size}`));
    this.uploadedFiles = [...this.uploadedFiles, ...incoming.filter(f => !existing.has(`${f.name}_${f.size}`))];
  }
  removeFile(index: number): void { this.uploadedFiles.splice(index, 1); }
  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${EVIDENCE_FILE_SIZE_UNITS[0]}`;
    const k = EVIDENCE_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${EVIDENCE_FILE_SIZE_UNITS[i]}`;
  }
  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return EVIDENCE_FILE_ICONS[ext] ?? EVIDENCE_FILE_ICON_DEFAULT;
  }

  isInvalid(path: string): boolean { const c = this.form.get(path); return !!c && c.touched && c.invalid; }
  getError(path: string, field?: string): string | null {
    const c = this.form.get(path); if (!c || !c.touched) return null; return firstErrorMessage(c.errors, field);
  }
  onCancel(): void { this.drawerRef.close(null); }
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const result: AddEvidenceResult = {
      mode: this.mode, evidenceId: this.drawerData?.existing?.id,
      form: { ...(this.form.value as unknown as EvidenceFormModel), documents: this.uploadedFiles },
    };
    this.drawerRef.close(result);
    const msg = this.isEdit
      ? $localize`:@@audit.evidence.updatedSuccess:Evidence details have been successfully updated.`
      : $localize`:@@audit.evidence.addedSuccess:New evidence has been successfully added.`;

    this.toast.success(msg);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: this.isEdit ? 'Evidence Updated' : 'Evidence Added',
    //   detail: this.isEdit
    //     ? 'Evidence details have been successfully updated.'
    //     : 'New evidence has been successfully added.',
    // });

    // setTimeout(() => this.drawerRef.close(result), 1200);
  }

  get headerTitle(): string {
    return this.isApprove
      ? $localize`:@@audit.evidence.reviewEvidence:Review Evidence`
      : this.isEdit
        ? $localize`:@@audit.evidence.editEvidence:Edit Evidence`
        : $localize`:@@audit.evidence.addEvidence:Add Evidence`;
  }
  get headerSubtitle(): string {
    return this.isApprove
      ? $localize`:@@audit.evidence.reviewSubtitle:Edit evidence details, add your notes and approve or reject`
      : this.isEdit
        ? $localize`:@@audit.evidence.editSubtitle:Update evidence details`
        : $localize`:@@audit.evidence.addSubtitle:Attach supporting documents to a finding`;
  }
  get submitLabel(): string {
    return this.isEdit
      ? $localize`:@@audit.evidence.saveChanges:Save Changes`
      : $localize`:@@audit.evidence.addEvidenceUppercase:ADD EVIDENCE`;
  }
}