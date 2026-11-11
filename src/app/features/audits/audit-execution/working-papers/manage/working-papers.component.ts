import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { WorkingPaperFile } from '../list/working-papers-list.component';
import { ORG_STATIC_DATA, ScopeSource } from '../../../organization/company/company-org-data';

import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '../../../Org-data-internal-audit';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  WORKING_PAPER_DEFAULT_RISK,
  WORKING_PAPER_DEFAULT_STATUS,
  WORKING_PAPER_FIELD_LIMITS,
  WORKING_PAPER_FILE_SIZE_BASE,
  WORKING_PAPER_FILE_SIZE_UNITS,
  WORKING_PAPER_UPLOAD,
  WorkingPaperDrawerModes,
  WorkingPaperReviewActions,
  type WorkingPaperDrawerMode,
  type WorkingPaperReviewAction,
} from '../constants/working-papers.constants';
import {
  AUDIT_ASSERTION_OPTIONS,
  RISK_LEVEL_OPTIONS,
  WORKING_PAPER_DRAWER_ICONS,
  WORKING_PAPER_FILE_ICON_DEFAULT,
  WORKING_PAPER_FILE_ICONS,
  WORKING_PAPER_FINDING_OPTIONS,
  WORKING_PAPER_STATUS_OPTIONS,
  WORKING_PAPER_TYPE_OPTIONS,
} from '../constants/working-papers-labels.constants';
import {
  WORKING_PAPER_CONFIRM_DIALOGS,
  WORKING_PAPER_DRAWER_HEADERS,
  WORKING_PAPER_FORM_ERRORS,
  WORKING_PAPER_FORM_PLACEHOLDERS,
  WORKING_PAPER_SUBMIT_LABELS,
  WORKING_PAPER_TOAST_MESSAGES,
} from '../constants/working-papers-messages.constants';

// NOTE: adjust the four import paths above (client-mode / *-indi-org.data)
// if they don't actually sit one level up from this component in your
// project — I only had the bare files to go on, not their real folder, so
// I matched the existing '../company-org-data' pattern.

// Common Company -> Division -> Sub-Division static data — the same file the
// Companies/Members pages and the Add Evidence / Add Observation / Add
// Finding / Add Recommendation drawers read from — instead of the previous
// id-based CompanyDataService lookup (for Company) plus static Dubai/Abu
// Dhabi/... division and Internal Audit/... sub-division/scope placeholder
// lists (for Division/Sub-Division/Scope/Subscope). Option *values* are the
// real company/division/sub-division/scope/subscope *names* (matching
// WorkingPaper.company/division/subDivision/scope/subscope, which are plain
// display-name strings, not ids/codes), and each level cascades off
// whatever is currently selected upstream — see WorkingPaperListComponent
// for the matching filter-panel wiring.
//
// When CLIENT_MODE_VALUE is 'internal-audit', ORG_STATIC_DATA (the
// multi-company audit-firm tree) is swapped out for a tree built by joining
// the three internal-audit seed files instead:
//   - COMPANIES_SEED                  → the company itself (DAR Exchange)
//   - DIVISION_INDI_ORG_COMPANIES     → that company's divisions
//   - SUB_DIVISION_INDI_ORG_COMPANIES → each division's sub-divisions and
//     their scopes, matched to its division by divisionCode (the seed files
//     document a 1:1 division ↔ sub-division-wrapper pairing)
// The joined tree is shaped to match ORG_STATIC_DATA, so every computed
// option below reads from RESOLVED_ORG_DATA without caring which client
// mode produced it. NOTE: this branching only lives here for now — the
// Companies/Members/Add Evidence/Add Observation/Add Finding/Add
// Recommendation screens mentioned above still read ORG_STATIC_DATA
// directly, so they won't pick up internal-audit data until the same
// CLIENT_MODE check is added to company-org-data.ts itself (I don't have
// that file to edit here).

/** Minimal shape the cascading Company/Division/Sub-Division/Scope/Subscope
 *  selects below actually need. ORG_STATIC_DATA's real exported type (from
 *  company-org-data.ts, which we don't have here) almost certainly carries
 *  more fields than this — that's fine, it's only read through this
 *  narrower view via the `as unknown as OrgCompany[]` cast below. Giving
 *  RESOLVED_ORG_DATA a real element type (instead of `any`) is what lets
 *  TypeScript infer the `.map()`/`.find()`/`.sort()` callback parameter
 *  types below instead of erroring under `noImplicitAny`. */
interface OrgSubScope { subScopeName: string; }
interface OrgScope { scopeName: string; subScopes?: OrgSubScope[]; }
interface OrgSubDivision { subDivisionName: string; scopes: OrgScope[]; }
interface OrgDivision { divisionName: string; subDivisions: OrgSubDivision[]; }
interface OrgCompany { companyName: string; divisions: OrgDivision[]; }

/** Builds the internal-audit Company → Division → Sub-Division → Scope
 *  tree (see comment above), joining the three internal-audit seed files.
 *  Cast to OrgCompany[] at the end since company-org-data.ts isn't
 *  available here to match its exported element type structurally — this
 *  is seed/mock data plumbing only. */
function buildInternalAuditOrgData(): OrgCompany[] {
  return COMPANIES_SEED.map(company => {
    const divisionCompany = DIVISION_INDI_ORG_COMPANIES.find(c => c.id === company.id);
    const subDivisionCompany = SUB_DIVISION_INDI_ORG_COMPANIES.find(c => c.id === company.id);

    const divisions = (divisionCompany?.divisions ?? []).map(division=> {
      const subDivisionEntry = subDivisionCompany?.divisions.find(
        d => d.divisionCode === division.divisionCode,
      );
      return {
        ...division,
        subDivisions: subDivisionEntry?.subDivisions ?? division.subDivisions ?? [],
      };
    });

    return { ...company, divisions };
  }) as unknown as OrgCompany[];
}

const RESOLVED_ORG_DATA: OrgCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? buildInternalAuditOrgData()
    : (ORG_STATIC_DATA as unknown as OrgCompany[]);


/* ── Types ─────────────────────────────────────────────────────────────── */

export interface AddWorkingPaperDrawerData {
  mode?: WorkingPaperDrawerMode;
  existing?: Partial<WorkingPaperFormModel> & {
    id?: string;
    description?: string;
    files?: WorkingPaperFile[];
  };
}

export interface WorkingPaperFormModel {
  title: string;
  wpType: string;
  scope: string;
  subscope: string;
  findingId: string;
  assertion: string;
  riskLevel: string;
  status: string;
  company: string;
  division: string;
  subDivision: string | null;
  objective?: string;
  procedures?: string;
  conclusion?: string;
  notes?: string;
  reviewerNotes?: string;
  documents?: File[];
}

export interface AddWorkingPaperResult {
  mode: WorkingPaperDrawerMode;
  workingPaperId?: string;
  form: WorkingPaperFormModel;
  /** Existing files still attached (edit mode). */
  keptFiles?: WorkingPaperFile[];
  /** Newly uploaded files. */
  newFiles: File[];
  /** Set in approve/review mode. */
  reviewAction?: WorkingPaperReviewAction;
}

export interface Option { label: string; value: string; }

/* ── Component ─────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-working-papers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule,
            SelectModule, TextareaModule, FileUploadModule,DrawIconComponent],
  templateUrl: './working-papers.component.html',
  styleUrl: './working-papers.component.scss',
})
export class WorkingPapersComponent implements OnInit {
  private readonly fb         = inject(FormBuilder);
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AddWorkingPaperResult, AddWorkingPaperDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddWorkingPaperDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly toast      = inject(ToastService);

  readonly mode      = this.drawerData?.mode ?? WorkingPaperDrawerModes.Create;
  readonly isEdit    = this.mode === WorkingPaperDrawerModes.Edit;
  readonly isApprove = this.mode === WorkingPaperDrawerModes.Approve;

  /* ── Template constants ── */
  readonly drawerIcons  = WORKING_PAPER_DRAWER_ICONS;
  readonly placeholders = WORKING_PAPER_FORM_PLACEHOLDERS;
  readonly formErrors   = WORKING_PAPER_FORM_ERRORS;
  readonly upload       = WORKING_PAPER_UPLOAD;

  readonly form = this.fb.group({
    title:      ['', [Validators.required, Validators.minLength(WORKING_PAPER_FIELD_LIMITS.TitleMin), Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.TitleMax)]],
    wpType:     ['', [Validators.required]],
    scope:      ['', [Validators.required]],
    subscope:   [''],
    findingId:  [''],
    assertion:  ['', [Validators.required]],
    riskLevel:  [WORKING_PAPER_DEFAULT_RISK as string, [Validators.required]],
    status:     [WORKING_PAPER_DEFAULT_STATUS as string, [Validators.required]],
    company:    [''],
    division:    [''],
    subDivision: [''],
    objective:  ['', [Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.ObjectiveMax)]],
    procedures: ['', [Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.ProceduresMax)]],
    conclusion: ['', [Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.ConclusionMax)]],
    notes:      ['', [Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.NotesMax)]],
    reviewerNotes: ['', [Validators.maxLength(WORKING_PAPER_FIELD_LIMITS.ReviewerNotesMax)]],
  });

  uploadedFiles: File[] = [];
  existingFiles: WorkingPaperFile[] = [];

  readonly selectDivisionLabel = $localize`:@@audit.workingPapers.selectDivision:Select division`;
  readonly selectCompanyFirstLabel = $localize`:@@audit.workingPapers.selectCompanyFirst:Select a company first`;
  readonly selectDivisionFirstLabel = $localize`:@@audit.workingPapers.selectDivisionFirst:Select a division first`;
  readonly selectSubDivisionLabel = $localize`:@@audit.workingPapers.selectSubDivision:Select sub-division`;
  readonly noSubDivisionsLabel = $localize`:@@audit.workingPapers.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly selectScopeLabel = $localize`:@@audit.workingPapers.selectScope:Select scope`;
  readonly selectSubDivisionFirstLabel = $localize`:@@audit.workingPapers.selectSubDivisionFirst:Select a sub-division first`;
  readonly selectScopeFirstLabel = $localize`:@@audit.workingPapers.selectScopeFirst:Select a scope first`;
  readonly selectSubScopeLabel = $localize`:@@audit.workingPapers.selectSubScope:Select sub-scope`;
  readonly noSubScopesLabel = $localize`:@@audit.workingPapers.noSubScopesForScope:No sub-scopes for this scope`;

  /* ── Options ── */
  readonly wpTypeOptions: Option[] = [
    { label: $localize`:@@audit.workingPapers.leadSchedule:Lead Schedule`, value: 'lead_schedule' },
    { label: $localize`:@@audit.workingPapers.testOfControls:Test of Controls`, value: 'test_of_controls' },
    { label: $localize`:@@audit.workingPapers.substantiveTest:Substantive Test`, value: 'substantive_test' },
    { label: $localize`:@@audit.workingPapers.analyticalReview:Analytical Review`, value: 'analytical_review' },
    { label: $localize`:@@audit.workingPapers.reconciliation:Reconciliation`, value: 'reconciliation' },
    { label: $localize`:@@audit.workingPapers.memorandum:Memorandum`, value: 'memo' },
    { label: $localize`:@@audit.workingPapers.confirmation:Confirmation`, value: 'confirmation' },
    { label: $localize`:@@common.other:Other`, value: 'other' },
  ];
  readonly findingOptions: Option[] = [
    { label: 'F-005 — Revenue recognised before delivery', value: 'F-005' },
    { label: 'F-008 — Unrecorded supplier invoices',        value: 'F-008' },
    { label: 'F-009 — Excessive privileged access rights',  value: 'F-009' },
    { label: 'F-012 — Unreconciled bank entries',           value: 'F-012' },
    { label: 'F-017 — Count sheets not sequentially controlled', value: 'F-017' },
    { label: 'F-021 — Manual overrides not approved',       value: 'F-021' },
    { label: 'F-028 — Low confirmation response rate',      value: 'F-028' },
    { label: 'F-034 — Depreciation rates inconsistent',     value: 'F-034' },
    { label: 'F-045 — Deferred tax liability understated',  value: 'F-045' },
    { label: 'F-051 — Undisclosed related party transaction', value: 'F-051' },
    { label: 'F-062 — Provision not updated for 6+ months', value: 'F-062' },
    { label: 'F-071 — Cash flow forecast overly optimistic', value: 'F-071' },
  ];
  readonly assertionOptions: Option[] = [
    { label: $localize`:@@audit.workingPapers.assertionExistence:Existence`, value: 'Existence' },
    { label: $localize`:@@audit.workingPapers.assertionOccurrence:Occurrence`, value: 'Occurrence' },
    { label: $localize`:@@audit.workingPapers.assertionCompleteness:Completeness`, value: 'Completeness' },
    { label: $localize`:@@audit.workingPapers.assertionAccuracy:Accuracy`, value: 'Accuracy' },
    { label: $localize`:@@audit.workingPapers.assertionValuation:Valuation`, value: 'Valuation' },
    { label: $localize`:@@audit.workingPapers.assertionRightsObligations:Rights & Obligations`, value: 'Rights & Obligations' },
    { label: $localize`:@@audit.workingPapers.assertionCutOff:Cut-off`, value: 'Cut-off' },
    { label: $localize`:@@audit.workingPapers.assertionClassification:Classification`, value: 'Classification' },
    { label: $localize`:@@audit.workingPapers.assertionPresentationDisclosure:Presentation & Disclosure`, value: 'Presentation & Disclosure' },
  ];
  readonly riskOptions: Option[] = [
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];
  readonly statusOptions: Option[] = [
    { label: $localize`:@@audit.workingPapers.draft:Draft`, value: 'draft' },
    { label: $localize`:@@audit.workingPapers.inProgress:In Progress`, value: 'in_progress' },
    { label: $localize`:@@audit.workingPapers.prepared:Prepared`, value: 'prepared' },
    { label: $localize`:@@audit.workingPapers.underReview:Under Review`, value: 'under_review' },
    { label: $localize`:@@audit.workingPapers.reviewed:Reviewed`, value: 'reviewed' },
    { label: $localize`:@@audit.workingPapers.approved:Approved`, value: 'approved' },
    { label: $localize`:@@audit.workingPapers.reopened:Reopened`, value: 'reopened' },
  ];

  /** Selected Company/Division/Sub-Division/Scope names, tracked as signals
   *  so Division/Sub-Division/Scope/Subscope options below cascade live as
   *  the user picks upstream values — same toSignal pattern used in
   *  ObservationComponent/FindingsComponent/RecommendationComponent. */
  private readonly selectedCompanyName = toSignal(
    this.form.get('company')!.valueChanges.pipe(startWith(this.form.get('company')!.value)),
    { initialValue: this.form.get('company')!.value },
  );
  private readonly selectedDivisionName = toSignal(
    this.form.get('division')!.valueChanges.pipe(startWith(this.form.get('division')!.value)),
    { initialValue: this.form.get('division')!.value },
  );
  private readonly selectedSubDivisionName = toSignal(
    this.form.get('subDivision')!.valueChanges.pipe(startWith(this.form.get('subDivision')!.value)),
    { initialValue: this.form.get('subDivision')!.value },
  );
  private readonly selectedScopeName = toSignal(
    this.form.get('scope')!.valueChanges.pipe(startWith(this.form.get('scope')!.value)),
    { initialValue: this.form.get('scope')!.value },
  );

  /**
   * ORG_STATIC_DATA_INTERNAL_AUDIT (the active internal-audit org's own
   * static seed, built from sub-division-static-indi-org.data.ts) when
   * CLIENT_MODE_VALUE is 'internal-audit', otherwise the multi-company
   * ORG_STATIC_DATA roster — same CLIENT_MODE ? … : … switch
   * findings.component.ts's/recommendation.component.ts's `orgData`
   * computed already use, so this drawer's Company/Division/Sub-Division/Scope/
   * Subscope options always match the active client mode instead of
   * unconditionally showing the audit-firm roster.
   */
  readonly orgData = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA,
  );

  /**
   * Sourced from company-org-data.ts — the same file the Companies page,
   * Members list Company filter, and Add Member / Add Risk / Add Evidence /
   * Add Observation / Add Finding / Add Recommendation forms read from —
   * instead of the hardcoded placeholder list this used to have ("Crowe
   * UAE", "Crowe KSA", "Crowe Qatar", "Crowe Oman").
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.orgData()
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Narrows to the selected Company's divisions — empty until a Company is
   *  chosen, replacing the old static Dubai/Abu Dhabi/Sharjah/Riyadh/Doha/
   *  Muscat list. */
  readonly divisionOptions = computed<Option[]>(() => {
    const companyName = this.selectedCompanyName();
    const company = this.orgData().find(c => c.companyName === companyName);
    const divisions = company ? company.divisions : [];
    return divisions
      .map(d => ({ label: d.divisionName, value: d.divisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Narrows to the selected Company + Division's sub-divisions — empty
   *  until a Division is chosen, replacing the old static Internal
   *  Audit/External Audit/Regulatory/Risk Management/IT list. */
  readonly subDivisionOptions = computed<Option[]>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (!division || division.hasSubDivision === false) return [];
    return division.subDivisions
      .map(sd => ({ label: sd.subDivisionName, value: sd.subDivisionName }))
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

  /** Narrows to the selected Sub-Division's own audit scopes — replaces the
   *  old static Internal Audit/External Audit/Regulatory/Risk Management/
   *  IT list (which wasn't derived from the org tree at all). */
  private readonly selectedSubDivision = computed(() => {
    const companyName = this.selectedCompanyName();
    const divisionName = this.selectedDivisionName();
    const subDivisionName = this.selectedSubDivisionName();
    const company = this.orgData().find(c => c.companyName === companyName);
    const division = company?.divisions.find(d => d.divisionName === divisionName);
    return division?.subDivisions.find(sd => sd.subDivisionName === subDivisionName);
  });

  /**
   * Where Scope / Sub-scope options come from: the division itself when it's
   * flagged `hasSubDivision: false` (its own `scopes`), otherwise the
   * selected sub-division.
   */
  private readonly scopeSource = computed<ScopeSource | null>(() => {
    const division = this.findDivision(this.selectedCompanyName(), this.selectedDivisionName());
    if (division?.hasSubDivision === false) return division;
    return this.selectedSubDivision() ?? null;
  });

  /** Scope is pickable once a sub-division is chosen — or straight after the division when it has no sub-divisions. */
  readonly scopeSelectable = computed(() => !!this.scopeSource());

  readonly scopeOptions = computed<Option[]>(() =>
    (this.scopeSource()?.scopes ?? [])
      .map(s => ({ label: s.scopeName, value: s.scopeName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Empty when the selected Scope has no sub-scopes defined — Subscope
   *  becomes optional in that case (see subscopeValidatorEffect below). */
  readonly subscopeOptions = computed<Option[]>(() => {
    const scopeName = this.selectedScopeName();
    const scope = this.scopeSource()?.scopes?.find(s => s.scopeName === scopeName);
    return (scope?.subScopes ?? [])
      .map(s => ({ label: s.subScopeName, value: s.subScopeName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Subscope is only required when the selected Scope actually has
   *  sub-scopes defined — some scopes (e.g. "Procurement Audit") don't. */
  private readonly subscopeValidatorEffect = effect(() => {
    const required = this.subscopeOptions().length > 0;
    const control = this.form.get('subscope')!;
    control.setValidators(required ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  });

  ngOnInit(): void {
    // Cascade resets: changing an upstream field invalidates everything
    // downstream of it (they belonged to the old selection's org tree).
    this.form.get('company')!.valueChanges.subscribe(() => {
      this.form.patchValue({ division: '', subDivision: '', scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('division')!.valueChanges.subscribe(divisionName => {
      // Divisions flagged hasSubDivision: false have no Sub-Division — store null.
      const hasSubDivision = this.findDivision(this.form.get('company')!.value, divisionName)?.hasSubDivision !== false;
      this.form.patchValue({ subDivision: hasSubDivision ? '' : null, scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('subDivision')!.valueChanges.subscribe(() => {
      this.form.patchValue({ scope: '', subscope: '' }, { emitEvent: false });
    });
    this.form.get('scope')!.valueChanges.subscribe(() => {
      this.form.get('subscope')!.setValue('', { emitEvent: false });
    });

    if (this.drawerData?.existing) {
      const ex = this.drawerData.existing as any;
      this.form.patchValue(ex);
      // Map the record's `description` onto the Notes field when not already set.
      if (ex.description && !ex.notes) this.form.get('notes')!.setValue(ex.description);
      this.existingFiles = ex.files ?? [];
    }
  }

  /* ── File handling ── */
  onFilesSelected(event: FileSelectEvent): void {
    const incoming = Array.from(event.files as FileList | File[]);
    const existing = new Set(this.uploadedFiles.map(f => `${f.name}_${f.size}`));
    this.uploadedFiles = [...this.uploadedFiles, ...incoming.filter(f => !existing.has(`${f.name}_${f.size}`))];
  }
  removeFile(index: number): void { this.uploadedFiles.splice(index, 1); }
  removeExistingFile(index: number): void { this.existingFiles.splice(index, 1); }
  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${WORKING_PAPER_FILE_SIZE_UNITS[0]}`;
    const k = WORKING_PAPER_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${WORKING_PAPER_FILE_SIZE_UNITS[i]}`;
  }
  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return WORKING_PAPER_FILE_ICONS[ext] ?? WORKING_PAPER_FILE_ICON_DEFAULT;
  }

  /* ── Validation helpers ── */
  isInvalid(path: string): boolean { const c = this.form.get(path); return !!c && c.touched && c.invalid; }
  getError(path: string, field?: string): string | null {
    const c = this.form.get(path); if (!c || !c.touched) return null; return firstErrorMessage(c.errors, field);
  }

  /* ── Actions ── */
  onCancel(): void { this.drawerRef.close(null); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.drawerRef.close({
      mode: this.mode,
      workingPaperId: this.drawerData?.existing?.id,
      form: { ...(this.form.value as unknown as WorkingPaperFormModel), documents: this.uploadedFiles },
      keptFiles: this.isEdit ? this.existingFiles : undefined,
      newFiles: this.uploadedFiles,
    });
    const msg = this.isEdit
      ? $localize`:@@audit.workingPapers.updatedSuccessfully:Working paper details have been successfully updated.`
      : $localize`:@@audit.workingPapers.addedSuccessfully:New working paper has been successfully added.`;
    this.toast.success(msg);
  }

  /* ── Review (approve mode) actions ── */
  async onApprove(): Promise<void> {
    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.workingPapers.confirmApproval:Confirm Approval`,
      message: $localize`:@@audit.workingPapers.confirmApprovalMessage:Are you sure you want to approve this working paper? This action cannot be undone.`,
      action: 'approve',
      confirmLabel: $localize`:@@audit.workingPapers.yesApprove:Yes, Approve`,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode: WorkingPaperDrawerModes.Approve,
      workingPaperId: this.drawerData?.existing?.id,
      form: { ...(this.form.getRawValue() as unknown as WorkingPaperFormModel), documents: this.uploadedFiles },
      newFiles: this.uploadedFiles,
      reviewAction: WorkingPaperReviewActions.Approve,
    });
  }

  async onReject(): Promise<void> {
    const notes = this.form.get('reviewerNotes')!;
    notes.setValidators([Validators.required, Validators.minLength(WORKING_PAPER_FIELD_LIMITS.ReviewerNotesMin)]);
    notes.updateValueAndValidity();
    notes.markAsTouched();
    if (!notes.value?.trim()) return;

    const confirmed = await this.confirmSvc.confirm({
      title: $localize`:@@audit.workingPapers.confirmRejection:Confirm Rejection`,
      message: $localize`:@@audit.workingPapers.confirmRejectionMessage:Are you sure you want to reject this working paper? The preparer will be notified.`,
      action: 'reject',
      confirmLabel: $localize`:@@audit.workingPapers.yesReject:Yes, Reject`,
      cancelLabel: $localize`:@@common.cancel:Cancel`,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode: WorkingPaperDrawerModes.Approve,
      workingPaperId: this.drawerData?.existing?.id,
      form: { ...(this.form.getRawValue() as unknown as WorkingPaperFormModel), documents: this.uploadedFiles },
      newFiles: this.uploadedFiles,
      reviewAction: WorkingPaperReviewActions.Reject,
    });
  }

  get headerTitle(): string {
    if (this.isApprove) {
      return $localize`:@@audit.workingPapers.reviewWorkingPaper:Review Working Paper`;
    }

    if (this.isEdit) {
      return $localize`:@@audit.workingPapers.editWorkingPaper:Edit Working Paper`;
    }

    return $localize`:@@audit.workingPapers.addWorkingPaper:Add Working Paper`;
  }
  get headerSubtitle(): string {
    if (this.isApprove) {
      return $localize`:@@audit.workingPapers.reviewSubtitle:Review the working paper, add your notes and approve or reject`;
    }

    if (this.isEdit) {
      return $localize`:@@audit.workingPapers.editSubtitle:Update working paper details`;
    }

    return $localize`:@@audit.workingPapers.addSubtitle:Create an audit working paper and attach evidence`;
  }
  get submitLabel(): string {
    return this.isEdit
      ? $localize`:@@common.saveChanges:Save Changes`
      : $localize`:@@audit.workingPapers.addWorkingPaperUppercase:ADD WORKING PAPER`;
  }
}