import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { ToastModule } from 'primeng/toast';

import {
  RiskType, ControlEffectiveness, RiskStatus, ResidualLevel,
  calcInherent, calcResidualScore, calcResidualLevel,
} from '../models/risk.model';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA } from '../../../organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '../../../Org-data-internal-audit';
import { CLIENT_MODE } from '../../../../../core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  RiskApprovalActions,
  RiskDrawerModes,
  RiskStatuses,
  type RiskApprovalAction,
  type RiskDrawerMode,
  RISK_DOCUMENT_UPLOAD,
  RISK_FIELD_LIMITS,
} from '../constants/risk.constants';
import {
  RISK_CONTROL_EFFECTIVENESS_OPTIONS,
  RISK_FORM_STATUS_OPTIONS,
  RISK_OWNER_OPTIONS,
  RISK_SCALE_OPTIONS,
  RISK_TYPE_OPTIONS,
  riskFileIcon,
} from '../constants/risk-labels.constants';
import {
  RISK_CONFIRM_DIALOGS,
  RISK_DRAWER_SUBTITLES,
  RISK_DRAWER_TITLES,
  RISK_SUB_DIVISION_PLACEHOLDERS,
  RISK_SUBMIT_LABELS,
  RISK_TOAST_MESSAGES,
} from '../constants/risk-messages.constants';

// Company / Division / Sub-Division options below come from the shared
// company-org-data.ts file (the same common Company -> Division -> Sub-Division
// static data used by the Add Member modal, Members list, Companies list
// and the Risk Register filters) instead of a hardcoded CompanyDataService
// lookup + static sub-division list. Risk.company / Risk.division /
// Risk.subDivision are plain display-name strings (not ids/codes), so the
// option *values* here are the company/division/sub-division *names*
// themselves — that keeps everything a user creates here consistent with
// the Risk Register's filters, which also match on name. Adjust the
// '@/app/data/company-org-data' path if that file lives elsewhere.


export interface AddRiskDrawerData {
  mode?: RiskDrawerMode;
  existing?: Partial<RiskFormModel> & { id?: string };
}

export interface RiskFormModel {
  riskType:             RiskType;
  title:                string;
  description:          string;
  subDivision:          string;
  impact:               number;
  likelihood:           number;
  keyControls?:         string;
  controlEffectiveness: ControlEffectiveness;
  owner:                string;
  dateIdentified:       Date | null;
  status:               RiskStatus;
  documents?:           File[];
  company:              string;
  division:             string;
  approverNotes?:       string;
}

export interface AddRiskResult {
  mode:            RiskDrawerMode;
  riskId?:         string;
  form:            RiskFormModel;
  approvalAction?: RiskApprovalAction;
}

export interface Option { label: string; value: string | number; }

@Component({
  selector: 'app-add-risk',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, SelectModule,
    MultiSelectModule, DatePickerModule, TextareaModule, FileUploadModule,ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './risk.component.html',
  styleUrl: './risk.component.scss',
})
export class AddRiskComponent implements OnInit {
  private readonly fb         = inject(FormBuilder);
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AddRiskResult, AddRiskDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddRiskDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
   private readonly messageService = inject(MessageService);
   private readonly toast = inject(ToastService);
  private readonly clientMode = inject(CLIENT_MODE);

  /**
   * Active Company -> Division -> Sub-division directory — the internal-audit
   * org's own static seed when CLIENT_MODE is 'internal-audit', otherwise
   * the multi-company ORG_STATIC_DATA roster.
   */
  private readonly orgData =
    this.clientMode === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

  readonly mode      = this.drawerData?.mode ?? RiskDrawerModes.Create;
  readonly isEdit    = this.mode === RiskDrawerModes.Edit;
  readonly isApprove = this.mode === RiskDrawerModes.Approve;

  readonly form = this.fb.group({
    riskType:             ['' as RiskType,            [Validators.required]],
    title:                ['',                         [Validators.required, Validators.maxLength(RISK_FIELD_LIMITS.TitleMax)]],
    description:          ['',                         [Validators.required, Validators.maxLength(RISK_FIELD_LIMITS.DescriptionMax)]],
    subDivision:          ['' as string | null,        [Validators.required]],
    impact:               [null as number | null,      [Validators.required]],
    likelihood:           [null as number | null,      [Validators.required]],
    keyControls:          ['',                         [Validators.maxLength(RISK_FIELD_LIMITS.KeyControlsMax)]],
    controlEffectiveness: ['' as ControlEffectiveness, [Validators.required]],
    owner:                ['',                         [Validators.required]],
    dateIdentified:       [null as Date | null,        [Validators.required]],
    status:               [RiskStatuses.Open as RiskStatus, [Validators.required]],
    company:              ['', [Validators.required]],
    division:             ['', [Validators.required]],
    approverNotes:        [''],   // only used in approve mode
  });

  uploadedFiles: File[] = [];

  /* Live-computed score previews */
  readonly inherentScore = signal<number | null>(null);
  readonly residualScore = signal<number | null>(null);
  readonly residualLevel = signal<ResidualLevel | null>(null);

  readonly riskTypeOptions: Option[] = RISK_TYPE_OPTIONS;

  readonly scaleOptions: Option[] = RISK_SCALE_OPTIONS;

  readonly ceOptions: Option[] = RISK_CONTROL_EFFECTIVENESS_OPTIONS;

  readonly ownerOptions: Option[] = RISK_OWNER_OPTIONS;

  readonly statusOptions: Option[] = RISK_FORM_STATUS_OPTIONS;

  // Exposed for the template.
  readonly documentUpload          = RISK_DOCUMENT_UPLOAD;
  readonly subDivisionPlaceholders = RISK_SUB_DIVISION_PLACEHOLDERS;

  /**
   * Every company in the shared org-data store, sourced from the common
   * company-org-data.ts file instead of the hardcoded placeholder list
   * this used to have ("ABC Electronics", "XYZ", ...). The option value
   * is the company *name* (Risk.company is a plain display string, not an
   * id) so it matches what the Risk Register's Company filter expects.
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.orgData
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
    const company = this.orgData.find(c => c.companyName === companyName);
    if (!company) return [];
    return company.divisions
      .map(b => ({ label: b.divisionName, value: b.divisionName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Division record for the given company + division names, or undefined. */
  private findDivision(companyName: string | null, divisionName: string | null) {
    const company = this.orgData.find(c => c.companyName === companyName);
    return company?.divisions.find(d => d.divisionName === divisionName);
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
    const required = this.divisionHasSubDivision();
    if (required !== ctrl.hasValidator(Validators.required)) {
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
  });

  ngOnInit(): void {
    const recalc = () => {
      const impact     = this.form.get('impact')!.value as number | null;
      const likelihood = this.form.get('likelihood')!.value as number | null;
      const ce         = this.form.get('controlEffectiveness')!.value as ControlEffectiveness | null;

      if (impact && likelihood) {
        const inherent = calcInherent(impact, likelihood);
        this.inherentScore.set(inherent);
        if (ce) {
          const residual = calcResidualScore(inherent, ce);
          this.residualScore.set(residual);
          this.residualLevel.set(calcResidualLevel(residual));
        } else {
          this.residualScore.set(null);
          this.residualLevel.set(null);
        }
      } else {
        this.inherentScore.set(null);
        this.residualScore.set(null);
        this.residualLevel.set(null);
      }
    };

    this.form.get('impact')!.valueChanges.subscribe(recalc);
    this.form.get('likelihood')!.valueChanges.subscribe(recalc);
    this.form.get('controlEffectiveness')!.valueChanges.subscribe(recalc);

    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing as any);
      recalc();
    }

    // Changing the company invalidates the previously selected division and
    // sub-division; changing the division (within the same company)
    // invalidates just the sub-division. Registered *after* the seed
    // hydration above so pre-filling company/division/sub-division together
    // (edit/approve mode) doesn't get wiped out by these resets.
    this.form.get('company')!.valueChanges.subscribe(() => {
      this.form.patchValue({ division: '', subDivision: '' }, { emitEvent: false });
    });
    this.form.get('division')!.valueChanges.subscribe(divisionName => {
      // Divisions flagged hasSubDivision: false have no Sub-Division — store null.
      const hasSubDivision = this.findDivision(this.form.controls.company.value, divisionName)?.hasSubDivision !== false;
      this.form.patchValue({ subDivision: hasSubDivision ? '' : null }, { emitEvent: false });
    });
  }

  /* ── Approve / Reject ─────────────────────────────────────────── */
  async onApprove(): Promise<void> {
    const confirmed = await this.confirmSvc.confirm({
      ...RISK_CONFIRM_DIALOGS.Approve,
      action:       RiskApprovalActions.Approve,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode:           RiskDrawerModes.Approve,
      riskId:         this.drawerData?.existing?.id,
      form:           this.form.getRawValue() as unknown as RiskFormModel,
      approvalAction: RiskApprovalActions.Approve,
    })
    this.toast.success(RISK_TOAST_MESSAGES.Approved, RISK_TOAST_MESSAGES.ApprovedTitle);
    //  this.messageService.add({
    //   severity: 'success',
    //   summary: 'Risk Approved',
    //   detail: 'Risk has been successfully approved.',
    // });
    // setTimeout(() =>this.drawerRef.close({
    //   mode:           'approve',
    //   riskId:         this.drawerData?.existing?.id,
    //   form:           this.form.getRawValue() as unknown as RiskFormModel,
    //   approvalAction: 'approve',
    // }),1500);
  }

  async onReject(): Promise<void> {
    const notes = this.form.get('approverNotes')!;
    notes.setValidators([Validators.required, Validators.minLength(1)]);
    notes.updateValueAndValidity();
    notes.markAsTouched();
    if (!notes.value?.trim()) return;   // show inline error, stop

    const confirmed = await this.confirmSvc.confirm({
      ...RISK_CONFIRM_DIALOGS.Reject,
      action:       RiskApprovalActions.Reject,
    });
    if (!confirmed) return;
    this.drawerRef.close({
      mode:           RiskDrawerModes.Approve,
      riskId:         this.drawerData?.existing?.id,
      form:           this.form.getRawValue() as unknown as RiskFormModel,
      approvalAction: RiskApprovalActions.Reject,
    });
    this.toast.error(RISK_TOAST_MESSAGES.Rejected, RISK_TOAST_MESSAGES.RejectedTitle);
    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Risk Rejected',
    //   detail: 'Risk has been  rejected.',
    // });
    // setTimeout(() =>
    // this.drawerRef.close({
    //   mode:           'approve',
    //   riskId:         this.drawerData?.existing?.id,
    //   form:           this.form.getRawValue() as unknown as RiskFormModel,
    //   approvalAction: 'reject',
    // }),1500);
  }

  /* ── File upload ──────────────────────────────────────────────── */
  onFilesSelected(event: FileSelectEvent): void {
    const incoming = Array.from(event.files as FileList | File[]);
    const existing = new Set(this.uploadedFiles.map(f => `${f.name}_${f.size}`));
    this.uploadedFiles = [...this.uploadedFiles, ...incoming.filter(f => !existing.has(`${f.name}_${f.size}`))];
  }
  removeFile(i: number): void { this.uploadedFiles.splice(i, 1); }
  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024, s = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
  }
  fileIcon(name: string): string {
    return riskFileIcon(name);
  }

  /* ── Create / Edit ────────────────────────────────────────────── */
  isInvalid(p: string): boolean { const c = this.form.get(p); return !!c && c.touched && c.invalid; }
  getError(p: string, f?: string): string | null {
    const c = this.form.get(p);
    if (!c || !c.touched) return null;
    return firstErrorMessage(c.errors, f);
  }

  onCancel(): void { this.drawerRef.close(null); }
  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const result: AddRiskResult = {
      mode:   this.mode,
      riskId: this.drawerData?.existing?.id,
      form:   { ...(this.form.value as RiskFormModel), documents: this.uploadedFiles },
    };
    this.drawerRef.close(result)
    var msg= this.isEdit
        ? RISK_TOAST_MESSAGES.Updated
        : RISK_TOAST_MESSAGES.Added;
    this.toast.success(msg);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: this.isEdit ? 'Risk Updated' : 'Risk Created',
    //   detail: this.isEdit
    //     ? 'Risk details have been successfully updated.'
    //     : 'New risk has been successfully added to the register.',
    // });

   // setTimeout(() => this.drawerRef.close(result), 1200);

  }

  /* ── Labels ───────────────────────────────────────────────────── */
  get headerTitle() {
    if (this.isApprove) return RISK_DRAWER_TITLES.Review;
    return this.isEdit ? RISK_DRAWER_TITLES.Edit : RISK_DRAWER_TITLES.Add;
  }
  get headerSubtitle() {
    if (this.isApprove) return RISK_DRAWER_SUBTITLES.Review;
    return this.isEdit ? RISK_DRAWER_SUBTITLES.Edit : RISK_DRAWER_SUBTITLES.Add;
  }
  get submitLabel() { return this.isEdit ? RISK_SUBMIT_LABELS.Edit : RISK_SUBMIT_LABELS.Add; }
}

export type { RiskStatus };