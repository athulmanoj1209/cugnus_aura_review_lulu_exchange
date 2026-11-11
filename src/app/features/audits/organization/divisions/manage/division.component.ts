import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import {
  DIVISION_TYPE_OPTIONS,
  DIVISION_STATUS_OPTIONS,
  CURRENCY_OPTIONS,
  LICENSE_AUTHORITY_OPTIONS,
  DIVISION_COUNTRY_OPTIONS,
  DIVISION_EMIRATE_OPTIONS,
  USER_OPTIONS,
  RISK_RATING_OPTIONS,
  RISK_STATUS_OPTIONS,
  AUDIT_STATUS_OPTIONS,
  SECTOR_OPTIONS,
  PARENT_NODE_OPTIONS,
  SUB_DIVISION_STATUS_OPTIONS,
  PARENT_SUB_DIVISION_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/app/features/audits/organization/divisions/division-static-data';
import type { DivisionEditableFields, DivisionCountry } from '@/app/features/audits/organization/divisions/models/division-static-data.model';
import type { DivisionDrawerData, DivisionDrawerResult } from '@/app/features/audits/organization/divisions/models/division.model';
import {
  DivisionApprovalActions,
  DivisionAuditStatuses,
  DivisionDocTypes,
  DivisionDrawerModes,
  DivisionTypes,
  type DivisionDocType,
  type DivisionDrawerMode,
  DIVISION_CODE_FALLBACK_PREFIX,
  DIVISION_FORM_LAST_TAB,
  DIVISION_NAME_MAX_LENGTH,
  DIVISION_TAB_FIELDS,
} from '@/app/features/audits/organization/divisions/constants/division.constants';
import {
  DIVISION_CONFIRM_DIALOGS,
  DIVISION_ERROR_MESSAGES,
  DIVISION_INVALID_FIELD_MESSAGE,
  DIVISION_SUB_DIVISION_ERROR_MESSAGES,
  DIVISION_TOAST_MESSAGES,
} from '@/app/features/audits/organization/divisions/constants/division-messages.constants';
import {
  DIVISION_DRAWER_SUBTITLES,
  DIVISION_DRAWER_TITLES,
  subDivisionFallbackName,
} from '@/app/features/audits/organization/divisions/constants/division-labels.constants';
import { SUB_DIVISION_TYPE_OPTIONS } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

@Component({
  selector: 'app-division',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TextareaModule,
    ButtonModule,
    ToastModule,
    TabsModule,
    InputNumberModule,
    AccordionModule,
    DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './division.component.html',
  styleUrl: './division.component.scss',
})
export class DivisionComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<DivisionDrawerResult, DivisionDrawerData>;
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as DivisionDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);
  private readonly companyDataService = inject(CompanyDataService);

  mode: DivisionDrawerMode = this.data?.mode ?? DivisionDrawerModes.Add;
  division: any = this.data?.division ?? null;
  initialTab: number = this.data?.initialTab ?? 0;
  readonly approvalMode: boolean = this.data?.approvalMode ?? false;
  readonly requestStatus: string = this.data?.requestStatus ?? DivisionAuditStatuses.PendingReview;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === DivisionAuditStatuses.PendingReview;

  divisionForm!: FormGroup;
  submitted = false;
  activeTabIndex: any = 0;
  approvalNotesSubmitted = false;
  readonly LAST_TAB = DIVISION_FORM_LAST_TAB;
  expandedDeptKey: any = null;

  // Exposed for the template.
  readonly DivisionDrawerModes = DivisionDrawerModes;
  readonly DivisionTypes = DivisionTypes;
  readonly DivisionDocTypes = DivisionDocTypes;
  readonly DIVISION_NAME_MAX_LENGTH = DIVISION_NAME_MAX_LENGTH;

  // ── Division-level options ──────────────────────────────────────────────────

  get companyOptions() {
    const currentId = this.divisionForm?.get('company')?.value;
    return this.companyDataService.all
      .filter(c => !c.blocked || c.id === currentId)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  divisionTypeOptions = DIVISION_TYPE_OPTIONS;

  /** Same options as the Sub-Division Type dropdown in sub-divisions/manage/sub-division.component. */
  departmentTypeOptions = SUB_DIVISION_TYPE_OPTIONS;

  statusOptions = DIVISION_STATUS_OPTIONS;

  currencyOptions = CURRENCY_OPTIONS;

  licenseAuthorityOptions = LICENSE_AUTHORITY_OPTIONS;

  countryOptions = DIVISION_COUNTRY_OPTIONS;

  /** Filtered to the currently-selected country so e.g. a KSA division can pick a KSA province. */
  get emirateOptions(): { label: string; value: string; country: DivisionCountry }[] {
    const country = this.divisionForm?.get('country')?.value as DivisionCountry | null;
    return country ? DIVISION_EMIRATE_OPTIONS.filter(e => e.country === country) : DIVISION_EMIRATE_OPTIONS;
  }

  userOptions = USER_OPTIONS;

  riskRatingOptions = RISK_RATING_OPTIONS;

  riskStatusOptions = RISK_STATUS_OPTIONS;

  auditStatusOptions = AUDIT_STATUS_OPTIONS;

  sectorOptions = SECTOR_OPTIONS;

  parentNodeOptions = PARENT_NODE_OPTIONS;

  hasSubDivisionOptions: { label: string; value: boolean }[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  // ── Sub-Division-level options ────────────────────────────────────────────

  deptStatusOptions = SUB_DIVISION_STATUS_OPTIONS;

  staticParentDeptOptions = PARENT_SUB_DIVISION_OPTIONS;

  timezoneOptions = TIMEZONE_OPTIONS;

  // ── File state ────────────────────────────────────────────────────────────

  tradeLicenseFile: File | null = null;
  vatCertificateFile: File | null = null;
  orgDocumentsFile: File | null = null;

  existingTradeLicenseFile: { name: string; url: string } | null = null;
  existingVatCertificateFile: { name: string; url: string } | null = null;
  existingOrgDocumentsFile: { name: string; url: string } | null = null;

  // ── Error messages ────────────────────────────────────────────────────────

  divisionErrorMessages = DIVISION_ERROR_MESSAGES;

  deptErrorMessages = DIVISION_SUB_DIVISION_ERROR_MESSAGES;

  private readonly tabFieldMap = DIVISION_TAB_FIELDS;

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.buildForm();
    if ((this.mode === DivisionDrawerModes.View || this.mode === DivisionDrawerModes.Edit) && this.division) {
      this.populateForm();
    } else if (this.mode === DivisionDrawerModes.Add) {
      this.divisionForm.enable();
      while (this.subDivisionsArray.length) this.subDivisionsArray.removeAt(0);
      this.divisionForm.reset();
      this.syncDepartmentTypeState();
      this.existingTradeLicenseFile = null;
      this.existingVatCertificateFile = null;
      this.existingOrgDocumentsFile = null;
    }
    this.activeTabIndex = this.initialTab;
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get f() {
    return this.divisionForm.controls;
  }

  get divisionNameLength(): number {
    return this.f['divisionName']?.value?.length ?? 0;
  }

  get subDivisionsArray(): FormArray {
    return this.divisionForm.get('subDivisions') as FormArray;
  }

  get currentDivisionName(): string {
    return this.divisionForm?.get('divisionName')?.value ?? '';
  }

  // ── Division field helpers ──────────────────────────────────────────────────

  isFieldInvalid(name: string): boolean {
    const ctrl = this.divisionForm.get(name);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  isExpiryInvalid(): boolean {
    const expiryCtrl = this.divisionForm.get('licenseExpiryDate');
    const hasFormError = !!this.divisionForm.errors?.['expiryBeforeIssue'];
    return (
      hasFormError &&
      !!(expiryCtrl?.touched || (this.submitted && this.activeTabIndex === 1))
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.divisionForm.get(controlName);
    if (!control || !control.errors) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    return this.divisionErrorMessages[controlName]?.[firstErrorKey] || DIVISION_INVALID_FIELD_MESSAGE;
  }

  generateDivisionCode(): void {
    const company: string = this.divisionForm.get('company')?.value ?? DIVISION_CODE_FALLBACK_PREFIX;
    const prefix = company.substring(0, 3).toUpperCase();
    const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.divisionForm.get('divisionCode')?.setValue(code);
    this.divisionForm.get('divisionCode')?.markAsTouched();
  }

  // ── Sub-Division helpers ──────────────────────────────────────────────────

  getDeptGroup(index: number): FormGroup {
    return this.subDivisionsArray.at(index) as FormGroup;
  }

  getDeptName(index: number): string {
    return this.getDeptGroup(index).get('subDivisionName')?.value?.trim() || subDivisionFallbackName(index);
  }

  getDeptStatus(index: number): string {
    return this.getDeptGroup(index).get('status')?.value ?? '';
  }

  getDeptStatusLabel(index: number): string {
    const val = this.getDeptStatus(index);
    return this.deptStatusOptions.find(o => o.value === val)?.label ?? '';
  }

  getDeptCompany(index: number): string {
    const val = this.getDeptGroup(index).get('company')?.value;
    return this.companyOptions.find(o => o.value === val)?.label ?? '';
  }

  getParentDeptOptions(currentIndex: number): { label: string; value: string }[] {
    const fromList = this.subDivisionsArray.controls
      .map((ctrl, i) => ({ ctrl, i }))
      .filter(({ i }) => i !== currentIndex)
      .map(({ ctrl, i }) => ({
        label: ctrl.get('subDivisionName')?.value?.trim() || subDivisionFallbackName(i),
        value: `dept_${i}`,
      }));
    return [...this.staticParentDeptOptions, ...fromList];
  }

  getDeptFieldInvalid(deptIndex: number, fieldName: string): boolean {
    const ctrl = this.getDeptGroup(deptIndex).get(fieldName);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  getDeptErrorMessage(deptIndex: number, controlName: string): string {
    const control = this.getDeptGroup(deptIndex).get(controlName);
    if (!control || !control.errors) return '';
    const firstErrorKey = Object.keys(control.errors)[0];
    return this.deptErrorMessages[controlName]?.[firstErrorKey] || DIVISION_INVALID_FIELD_MESSAGE;
  }

  addSubDivision(): void {
    const deptGroup = this.fb.group({
      subDivisionName: ['', Validators.required],
      company: [this.divisionForm.get('company')?.value ?? null, Validators.required],
      parentSubDivisions: [[]],
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
    });
    this.subDivisionsArray.push(deptGroup);
    this.expandedDeptKey = `dept-${this.subDivisionsArray.length - 1}`;
  }

  removeSubDivision(index: number, event: Event): void {
    event.stopPropagation();
    this.subDivisionsArray.removeAt(index);
    if (this.expandedDeptKey === `dept-${index}`) {
      this.expandedDeptKey = null;
    }
  }

  // ── Navigation & submit ───────────────────────────────────────────────────

  goToNextTab(): void {
    this.submitted = true;
    const fields = this.tabFieldMap[this.activeTabIndex] ?? [];
    fields.forEach(field => this.divisionForm.get(field)?.markAsTouched());

    if (!this.isTabValid(this.activeTabIndex)) return;

    if (this.activeTabIndex < this.LAST_TAB) {
      this.activeTabIndex++;
      this.submitted = false;
    }
  }

  private formatDate(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private buildDivisionPayload(): DivisionEditableFields {
    const v = this.divisionForm.value;
    return {
      company: v.company,
      divisionName: v.divisionName,
      divisionCode: v.divisionCode,
      divisionType: v.divisionType,
      departmentType: v.divisionType === DivisionTypes.Department ? v.departmentType ?? null : null,
      status: v.status,
      hasSubDivision: v.hasSubDivision,
      currency: v.currency ?? '',
      numberOfEmployees: v.numberOfEmployees ?? null,
      operationalSince: this.formatDate(v.operationalSince),
      licenseNumber: v.licenseNumber,
      licenseAuthority: v.licenseAuthority,
      licenseIssueDate: this.formatDate(v.licenseIssueDate),
      licenseExpiryDate: this.formatDate(v.licenseExpiryDate),
      taxRegistrationNumber: v.taxRegistrationNumber ?? '',
      commercialRegistrationNumber: v.commercialRegistrationNumber ?? '',
      divisionTimezone: v.divisionTimezone,
      country: v.country,
      emirateState: v.emirateState,
      city: v.city,
      addressLine1: v.addressLine1,
      addressLine2: v.addressLine2 ?? '',
      postalCode: v.postalCode ?? '',
      gpsCoordinates: v.gpsCoordinates ?? '',
      divisionManager: v.divisionManager,
      primaryContactPerson: v.primaryContactPerson,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
      alternatePhone: v.alternatePhone ?? '',
      riskRating: v.riskRating,
      riskStatus: v.riskStatus,
      auditStatus: v.auditStatus,
      lastAuditDate: this.formatDate(v.lastAuditDate),
      nextAuditDueDate: this.formatDate(v.nextAuditDueDate),
      sectorActivity: v.sectorActivity,
      parentNode: v.parentNode,
    };
  }

  private buildDocFile(file: File | null, existing: { name: string; url: string } | null): { name: string; url: string } {
    if (file) return { name: file.name, url: URL.createObjectURL(file) };
    return existing ?? { name: '', url: '' };
  }

  onSubmit(): void {
    console.log("Submitting division form");
    this.submitted = true;
    this.divisionForm.markAllAsTouched();

    // if (this.divisionForm.invalid) {
    //   for (let i = 0; i <= this.LAST_TAB; i++) {
    //     if (!this.isTabValid(i)) {
    //       this.activeTabIndex = i;
    //       break;
    //     }
    //   }
    //   return;
    // }

    if (this.divisionForm.invalid) {
      console.log('Form-level errors:', this.divisionForm.errors);

      Object.entries(this.divisionForm.controls).forEach(([name, control]) => {
        if (control.invalid) {
          console.log(`Invalid field: ${name}`, {
            errors: control.errors,
            value: control.value,
          });
        }
      });

      return;
    }

    const fields = this.buildDivisionPayload();
    const division = {
      ...fields,
      legalEntityName: `${this.companyOptions.find(c => c.value === fields.company)?.label ?? fields.company} LLC`,
      parentDivision: null,
      subDivisions: [],
      tradeLicenseFile: this.buildDocFile(this.tradeLicenseFile, null),
      vatCertificateFile: this.buildDocFile(this.vatCertificateFile, null),
      orgDocumentsFile: this.buildDocFile(this.orgDocumentsFile, null),
    };

    this.drawerRef.close({ division });
    this.toast.success(DIVISION_TOAST_MESSAGES.Added);
  }

  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !(this.divisionForm.get('approverNotes')?.value?.trim());
  }

  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...DIVISION_CONFIRM_DIALOGS.Approve,
      action: DivisionApprovalActions.Approve,
    });
    if (ok) {
      this.drawerRef.close({
        approval: { action: DivisionApprovalActions.Approve, notes: this.divisionForm.get('approverNotes')!.value ?? '' },
      });
      this.toast.success(DIVISION_TOAST_MESSAGES.Approved, DIVISION_TOAST_MESSAGES.ApprovedTitle);
      //   this.messageService.add({
      //   severity: 'success',
      //   summary: 'Division Approved',
      //   detail: 'Division has been successfully approved.',
      // });
      //    setTimeout(() =>this.drawerRef.close({
      //     approval: { action: 'approve', notes: this.divisionForm.get('approverNotes')!.value ?? '' },
      //   }),1500);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = (this.divisionForm.get('approverNotes')!.value ?? '').trim();
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...DIVISION_CONFIRM_DIALOGS.Reject,
      action: DivisionApprovalActions.Reject,
    });
    if (ok) {
      this.drawerRef.close({ approval: { action: DivisionApprovalActions.Reject, notes } })
      this.toast.error(DIVISION_TOAST_MESSAGES.Rejected, DIVISION_TOAST_MESSAGES.RejectedTitle);
      //   this.messageService.add({
      //   severity: 'error',
      //   summary: 'Division Rejected',
      //   detail: 'Division has been  rejected.',
      // });
      // setTimeout(() =>this.drawerRef.close({ approval: { action: 'reject', notes } }),1500);
    }
  }

  onClose(): void {
    this.activeTabIndex = 0;
    this.submitted = false;
    this.expandedDeptKey = null;
    this.tradeLicenseFile = null;
    this.vatCertificateFile = null;
    this.orgDocumentsFile = null;
    this.existingTradeLicenseFile = null;
    this.existingVatCertificateFile = null;
    this.existingOrgDocumentsFile = null;
    if (this.divisionForm) {
      this.divisionForm.enable();
      while (this.subDivisionsArray.length) {
        this.subDivisionsArray.removeAt(0);
      }
      this.divisionForm.reset();
    }
    this.drawerRef.close(null);
  }

  onFileChange(event: Event, type: DivisionDocType): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.setFile(type, file);
    input.value = '';
  }

  removeFile(type: DivisionDocType): void {
    this.setFile(type, null);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  clearExistingFile(type: DivisionDocType): void {
    if (type === DivisionDocTypes.Trade) this.existingTradeLicenseFile = null;
    else if (type === DivisionDocTypes.Vat) this.existingVatCertificateFile = null;
    else this.existingOrgDocumentsFile = null;
  }

  get isViewMode(): boolean { return this.mode === DivisionDrawerModes.View; }

  get drawerTitle(): string {
    return DIVISION_DRAWER_TITLES[this.mode];
  }

  get drawerSubtitle(): string {
    return DIVISION_DRAWER_SUBTITLES[this.mode];
  }

  onSave(): void {
    this.submitted = true;
    this.divisionForm.markAllAsTouched();
    if (this.divisionForm.invalid) {
      for (let i = 0; i <= this.LAST_TAB; i++) {
        if (!this.isTabValid(i)) { this.activeTabIndex = i; break; }
      }
      return;
    }

    const divisionUpdate = this.buildDivisionPayload();
    this.drawerRef.close({ divisionUpdate });
    this.toast.success(DIVISION_TOAST_MESSAGES.Updated);
  }

  private populateForm(): void {
    if (!this.division || !this.divisionForm) return;
    const b = this.division;

    while (this.subDivisionsArray.length) this.subDivisionsArray.removeAt(0);

    this.divisionForm.patchValue({
      company: b.company,
      divisionName: b.divisionName,
      divisionCode: b.divisionCode,
      divisionType: b.divisionType,
      departmentType: b.departmentType ?? null,
      status: b.status,
      hasSubDivision: b.hasSubDivision,
      currency: b.currency ?? null,
      licenseNumber: b.licenseNumber,
      licenseAuthority: b.licenseAuthority,
      licenseIssueDate: b.licenseIssueDate ? new Date(b.licenseIssueDate) : null,
      licenseExpiryDate: b.licenseExpiryDate ? new Date(b.licenseExpiryDate) : null,
      taxRegistrationNumber: b.taxRegistrationNumber,
      commercialRegistrationNumber: b.commercialRegistrationNumber,
      country: b.country,
      emirateState: b.emirateState,
      city: b.city,
      divisionTimezone: b.divisionTimezone,
      addressLine1: b.addressLine1,
      addressLine2: b.addressLine2,
      postalCode: b.postalCode,
      gpsCoordinates: b.gpsCoordinates,
      divisionManager: b.divisionManager,
      primaryContactPerson: b.primaryContactPerson,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone,
      alternatePhone: b.alternatePhone,
      riskRating: b.riskRating,
      riskStatus: b.riskStatus,
      auditStatus: b.auditStatus,
      lastAuditDate: b.lastAuditDate ? new Date(b.lastAuditDate) : null,
      nextAuditDueDate: b.nextAuditDueDate ? new Date(b.nextAuditDueDate) : null,
      sectorActivity: b.sectorActivity,
      parentNode: b.parentNode,
      numberOfEmployees: b.numberOfEmployees,
      operationalSince: b.operationalSince ? new Date(b.operationalSince) : null,
    });

    if (b.subDivisions?.length) {
      b.subDivisions.forEach((dept: any) => {
        const deptGroup = this.fb.group({
          subDivisionName: [dept.subDivisionName, Validators.required],
          company: [dept.company, Validators.required],
          parentSubDivisions: [dept.parentSubDivisions ?? []],
          status: [dept.status, Validators.required],
          riskRating: [dept.riskRating, Validators.required],
          riskStatus: [dept.riskStatus, Validators.required],
          primaryContactPerson: [dept.primaryContactPerson, Validators.required],
          contactEmail: [dept.contactEmail, [Validators.required, Validators.email]],
          contactPhone: [dept.contactPhone, Validators.required],
          description: [dept.description ?? ''],
          subDivisionHead: [dept.subDivisionHead],
          numberOfEmployees: [dept.numberOfEmployees],
          operationalSince: [dept.operationalSince ? new Date(dept.operationalSince) : null],
        });
        this.subDivisionsArray.push(deptGroup);
      });
      this.expandedDeptKey = 'dept-0';
    }

    this.existingTradeLicenseFile = b.tradeLicenseFile ?? null;
    this.existingVatCertificateFile = b.vatCertificateFile ?? null;
    this.existingOrgDocumentsFile = b.orgDocumentsFile ?? null;
    this.tradeLicenseFile = null;
    this.vatCertificateFile = null;
    this.orgDocumentsFile = null;

    if (this.mode === DivisionDrawerModes.View) {
      this.divisionForm.disable();
    } else {
      this.divisionForm.enable();
      this.syncDepartmentTypeState();
    }
  }

  private setFile(type: DivisionDocType, file: File | null): void {
    if (type === DivisionDocTypes.Trade) this.tradeLicenseFile = file;
    else if (type === DivisionDocTypes.Vat) this.vatCertificateFile = file;
    else this.orgDocumentsFile = file;
  }

  private isTabValid(tabIndex: number): boolean {
    if (tabIndex === 6) {
      return this.subDivisionsArray.valid;
    }
    const fields = this.tabFieldMap[tabIndex] ?? [];
    const fieldsValid = fields.every(field => {
      const ctrl = this.divisionForm.get(field);
      return ctrl ? ctrl.valid : true;
    });
    if (tabIndex === 1 && this.divisionForm.errors?.['expiryBeforeIssue']) {
      return false;
    }
    return fieldsValid;
  }

  private buildForm(): void {
    this.divisionForm = this.fb.group(
      {
        // Tab A – Division Information
        company: [null, Validators.required],
        divisionName: ['', [Validators.required, Validators.maxLength(DIVISION_NAME_MAX_LENGTH)]],
        divisionCode: ['', Validators.required],
        divisionType: [null, Validators.required],
        departmentType: [{ value: null, disabled: true }],
        status: [null, Validators.required],
        hasSubDivision: [null, Validators.required],
        currency: [null],
        numberOfEmployees: [null],
        operationalSince: [null],

        // Tab B – Registration & Legal
        licenseNumber: ['', Validators.required],
        licenseAuthority: [null, Validators.required],
        licenseIssueDate: [null],
        licenseExpiryDate: [null],
        taxRegistrationNumber: [''],
        commercialRegistrationNumber: [''],
        divisionTimezone: [null, Validators.required],
        // Tab C – Location
        country: [null, Validators.required],
        emirateState: [null, Validators.required],
        city: ['', Validators.required],
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        postalCode: [''],
        gpsCoordinates: [''],

        // Tab D – Contact
        divisionManager: [null, Validators.required],
        primaryContactPerson: [null, Validators.required],
        contactEmail: ['', [Validators.required, Validators.email]],
        contactPhone: ['', Validators.required],
        alternatePhone: [''],

        // Tab E – Audit & Risk
        riskRating: [null, Validators.required],
        riskStatus: [null, Validators.required],
        auditStatus: [null, Validators.required],
        lastAuditDate: [null],
        nextAuditDueDate: [null],
        sectorActivity: [null, Validators.required],

        // Tab F – Org Structure
        parentNode: [null],

        // Tab G – Sub-Divisions (FormArray)
        subDivisions: this.fb.array([]),

        // Approval
        approverNotes: [''],
      },
      { validators: this.licenseExpiryValidator }
    );
  }

  // Bound to the Country `p-select`'s (onChange) — fires only on genuine user
  // interaction, unlike `country.valueChanges` (which would also fire while
  // `populateForm()` patches in an existing division's values, wiping out the
  // emirate/state we'd just set).
  onCountryChange(): void {
    this.divisionForm.get('emirateState')?.setValue(null);
  }

  // Bound to the Division Type `p-select`'s (onChange) — same reasoning as
  // onCountryChange: a user switching away from Department clears the stale value.
  onDivisionTypeChange(): void {
    if (this.divisionForm.get('divisionType')?.value !== DivisionTypes.Department) {
      this.divisionForm.get('departmentType')?.setValue(null);
    }
    this.syncDepartmentTypeState();
  }

  /** Department Type is only enabled (and required) when Division Type is Department. */
  private syncDepartmentTypeState(): void {
    const ctrl = this.divisionForm.get('departmentType');
    if (!ctrl) return;
    if (this.divisionForm.get('divisionType')?.value === DivisionTypes.Department) {
      ctrl.setValidators(Validators.required);
      ctrl.enable({ emitEvent: false });
    } else {
      ctrl.clearValidators();
      ctrl.disable({ emitEvent: false });
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  private licenseExpiryValidator(group: AbstractControl): ValidationErrors | null {
    const issueDate = group.get('licenseIssueDate')?.value;
    const expiryDate = group.get('licenseExpiryDate')?.value;
    if (issueDate && expiryDate && new Date(expiryDate) < new Date(issueDate)) {
      return { expiryBeforeIssue: true };
    }
    return null;
  }
}
