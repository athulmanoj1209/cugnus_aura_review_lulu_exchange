import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import {
  SUB_DIVISION_TYPE_OPTIONS,
  USER_OPTIONS,
} from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import type { SubDivisionEditableFields, StaticSubDivision } from '@/app/features/audits/organization/sub-divisions/models/sub-division-static-data.model';
import type {
  SubDivisionFormSubDivision,
  SubDivisionDrawerData,
  SubDivisionDrawerResult,
} from '@/app/features/audits/organization/sub-divisions/models/sub-division.model';
import { DIVISION_STATIC_COMPANIES, DIVISION_TYPE_OPTIONS } from '@/app/features/audits/organization/divisions/division-static-data';
import { DivisionStatuses, DivisionTypes } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  SubDivisionApprovalActions,
  SubDivisionDrawerModes,
  type SubDivisionDrawerMode,
  SUB_DIVISION_REQUEST_PENDING_REVIEW,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import {
  SUB_DIVISION_FORM_STATUS_OPTIONS,
  SUB_DIVISION_RISK_RATING_OPTIONS,
  SUB_DIVISION_RISK_STATUS_OPTIONS,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division-labels.constants';
import {
  SUB_DIVISION_CONFIRM_DIALOGS,
  SUB_DIVISION_ERROR_MESSAGES,
  SUB_DIVISION_TOAST_MESSAGES,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division-messages.constants';
import {
  SUB_DIVISION_DRAWER_SUBTITLES,
  SUB_DIVISION_DRAWER_TITLES,
  SUB_DIVISION_SUBMIT_LABELS,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division-labels.constants';

@Component({
  selector: 'app-sub-division',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    InputNumberModule,
    DividerModule,
    DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './sub-division.component.html',
  styleUrl: './sub-division.component.scss',
})
export class SubDivisionComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<SubDivisionDrawerResult, SubDivisionDrawerData>;
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as SubDivisionDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);
  private readonly companyDataService = inject(CompanyDataService);

  mode: SubDivisionDrawerMode = this.data?.mode ?? SubDivisionDrawerModes.Add;
  subDivision: SubDivisionFormSubDivision | null = this.data?.subDivision ?? null;
  readonly approvalMode: boolean = this.data?.approvalMode ?? false;
  readonly requestStatus: string = this.data?.requestStatus ?? SUB_DIVISION_REQUEST_PENDING_REVIEW;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === SUB_DIVISION_REQUEST_PENDING_REVIEW;

  // Exposed for the template.
  readonly DivisionTypes = DivisionTypes;

  form!: FormGroup;
  submitted = false;
  approvalNotesSubmitted = false;

  get companyOptions(): { label: string; value: string }[] {
    const currentId = this.form?.get('company')?.value;
    return this.companyDataService.all
      .filter(c => !c.blocked || c.id === currentId)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  readonly userOptions = USER_OPTIONS;

  readonly statusOptions = SUB_DIVISION_FORM_STATUS_OPTIONS;

  /** Same options as the Division Type dropdown in divisions/manage/division.component. */
  readonly subDivisionTypeOptions = DIVISION_TYPE_OPTIONS;

  readonly departmentTypeOptions = SUB_DIVISION_TYPE_OPTIONS;

  readonly riskRatingOptions = SUB_DIVISION_RISK_RATING_OPTIONS;

  readonly riskStatusOptions = SUB_DIVISION_RISK_STATUS_OPTIONS;

  get divisionOptions(): { label: string; value: string }[] {
    const company = this.form?.get('company')?.value;
    const currentDivisionCode = this.form?.get('divisionCode')?.value;
    const companyBlocked = company ? this.companyDataService.isCompanyBlocked(company) : false;
    return DIVISION_STATIC_COMPANIES
      .filter(c => !company || c.id === company)
      .flatMap(c => c.divisions)
      // Only divisions flagged hasSubDivision can take sub-divisions.
      .filter(b => (b.status === DivisionStatuses.Active && b.hasSubDivision && !companyBlocked) || b.divisionCode === currentDivisionCode)
      .map(b => ({ label: b.divisionName, value: b.divisionCode }));
  }

  get drawerTitle(): string {
    return SUB_DIVISION_DRAWER_TITLES[this.mode];
  }

  get drawerSubtitle(): string {
    return SUB_DIVISION_DRAWER_SUBTITLES[this.mode];
  }

  get submitLabel(): string {
    return SUB_DIVISION_SUBMIT_LABELS[this.mode];
  }

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.buildForm();
    if (this.mode === SubDivisionDrawerModes.Edit && this.subDivision) {
      this.populateForm();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      company: [null, Validators.required],
      divisionCode: [null, Validators.required],
      subDivisionCode: ['', Validators.required],
      subDivisionName: ['', Validators.required],
      subDivisionType: [null, Validators.required],
      departmentType: [{ value: null, disabled: true }],
      status: [null, Validators.required],
      riskRating: [null, Validators.required],
      riskStatus: [null, Validators.required],
      primaryContactPerson: [null, Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      description: [''],
      subDivisionHead: [null],
      numberOfEmployees: [null],
      operationalSince: [null],
      approverNotes: [''],
    });

    this.form.get('company')?.valueChanges.subscribe(() => {
      this.form.get('divisionCode')?.setValue(null);
    });
  }

  private populateForm(): void {
    const d = this.subDivision!;
    this.form.patchValue({
      company: d.company,
      divisionCode: d.divisionCode,
      subDivisionCode: d.subDivisionCode,
      subDivisionName: d.subDivisionName,
      subDivisionType: d.subDivisionType,
      departmentType: d.departmentType ?? null,
      status: d.status,
      riskRating: d.riskRating,
      riskStatus: d.riskStatus,
      primaryContactPerson: d.primaryContactPerson,
      contactEmail: d.contactEmail,
      contactPhone: d.contactPhone,
      description: d.description,
      subDivisionHead: d.subDivisionHead,
      numberOfEmployees: d.numberOfEmployees,
      operationalSince: d.operationalSince ? new Date(d.operationalSince) : null,
    });
    this.syncDepartmentTypeState();
    this.submitted = false;
  }

  // Bound to the Sub-Division Type `p-select`'s (onChange) — a user switching away
  // from Department clears the stale department type.
  onSubDivisionTypeChange(): void {
    if (this.form.get('subDivisionType')?.value !== DivisionTypes.Department) {
      this.form.get('departmentType')?.setValue(null);
    }
    this.syncDepartmentTypeState();
  }

  /** Department Type is only enabled (and required) when Sub-Division Type is Department. */
  private syncDepartmentTypeState(): void {
    const ctrl = this.form.get('departmentType');
    if (!ctrl) return;
    if (this.form.get('subDivisionType')?.value === DivisionTypes.Department) {
      ctrl.setValidators(Validators.required);
      ctrl.enable({ emitEvent: false });
    } else {
      ctrl.clearValidators();
      ctrl.disable({ emitEvent: false });
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  getErrorMessage(name: string): string {
    const ctrl = this.form.get(name);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return SUB_DIVISION_ERROR_MESSAGES.Required;
    if (ctrl.errors['email']) return SUB_DIVISION_ERROR_MESSAGES.Email;
    return SUB_DIVISION_ERROR_MESSAGES.Invalid;
  }

  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !(this.form.get('approverNotes')?.value?.trim());
  }

  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...SUB_DIVISION_CONFIRM_DIALOGS.Approve,
      action: SubDivisionApprovalActions.Approve,
    });
    if (ok) {
      this.drawerRef.close({
        approval: { action: SubDivisionApprovalActions.Approve, notes: this.form.get('approverNotes')!.value ?? '' },
      });
      this.toast.success(SUB_DIVISION_TOAST_MESSAGES.Approved, SUB_DIVISION_TOAST_MESSAGES.ApprovedTitle);
      //   this.messageService.add({
      //   severity: 'error',
      //   summary: 'Sub-Division Approved',
      //   detail: 'Sub-Division has been approved.',
      // });
      //  setTimeout(() =>  this.drawerRef.close({
      //     approval: { action: 'approve', notes: this.form.get('approverNotes')!.value ?? '' },
      //   }),1500);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = (this.form.get('approverNotes')!.value ?? '').trim();
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...SUB_DIVISION_CONFIRM_DIALOGS.Reject,
      action: SubDivisionApprovalActions.Reject,
    });
    if (ok) {
      this.toast.error(SUB_DIVISION_TOAST_MESSAGES.Rejected, SUB_DIVISION_TOAST_MESSAGES.RejectedTitle);
      this.drawerRef.close({ approval: { action: SubDivisionApprovalActions.Reject, notes } })
      //   this.messageService.add({
      //   severity: 'error',
      //   summary: 'Sub-Division Rejected',
      //   detail: 'Sub-Division has been rejected.',
      // });
      //    setTimeout(() =>this.drawerRef.close({ approval: { action: 'reject', notes } }),1500);
    }
  }

  onClose(): void {
    this.form.reset();
    this.submitted = false;
    this.drawerRef.close(null);
  }

  private formatOperationalSince(value: Date | string | null): string | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return null;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${date.getFullYear()}-${month}-01`;
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.value;
    const formFields: SubDivisionEditableFields = {
      subDivisionCode: v.subDivisionCode,
      subDivisionName: v.subDivisionName,
      subDivisionType: v.subDivisionType,
      departmentType: v.subDivisionType === DivisionTypes.Department ? v.departmentType ?? null : null,
      company: v.company,
      divisionCode: v.divisionCode,
      status: v.status,
      riskRating: v.riskRating,
      riskStatus: v.riskStatus,
      primaryContactPerson: v.primaryContactPerson,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
      description: v.description ?? '',
      subDivisionHead: v.subDivisionHead ?? null,
      numberOfEmployees: v.numberOfEmployees ?? null,
      operationalSince: this.formatOperationalSince(v.operationalSince),
    };

    if (this.mode === SubDivisionDrawerModes.Edit) {
      this.drawerRef.close({
        subDivisionUpdate: formFields,
        previousSubDivisionCode: this.subDivision?.subDivisionCode,
      });
    } else {
      const subDivision: Omit<SubDivisionFormSubDivision, 'createdAt' | 'auditStatus'> = {
        ...formFields,
        parentSubDivisions: [],
        scopes: undefined,
      };
      this.drawerRef.close({ subDivision });
    }

    const msg = this.mode === SubDivisionDrawerModes.Edit
      ? SUB_DIVISION_TOAST_MESSAGES.Updated
      : SUB_DIVISION_TOAST_MESSAGES.Added;
    this.toast.success(msg);
  }
}
