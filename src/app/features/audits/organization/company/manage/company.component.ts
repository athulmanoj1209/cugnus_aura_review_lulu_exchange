import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG modules (v18+)
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DrawerRef, DRAWER_DATA } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import {
  firstErrorMessage,
  futureDateValidator,
  integerValidator,
  notFutureDateValidator,
  phoneValidator,
  urlValidator,textValidator
} from '@/app/shared/services/form-validators.service';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { OrgStatus } from '@/app/features/audits/organization/company/models/company.model';
import { ORG_STATUS_OPTIONS } from '@/app/features/audits/organization/company/company-static-data';
import {
  CompanyApprovalActions,
  CompanyDrawerTypes,
  CompanyOrgStatuses,
  type CompanyApprovalAction,
  COMPANY_FIELD_LIMITS,
  COMPANY_FORM_FIRST_TAB,
  COMPANY_FORM_LAST_TAB,
  COMPANY_FORM_TAB_GROUPS,
} from '../constants/company.constants';
import {
  COMPANY_AUDIT_CYCLE_OPTIONS,
  COMPANY_COUNTRY_OPTIONS,
  COMPANY_CURRENCY_OPTIONS,
  COMPANY_ENTITY_TYPE_OPTIONS,
  COMPANY_OWNERSHIP_TYPE_OPTIONS,
  COMPANY_REGION_OPTIONS,
  COMPANY_REG_INDUSTRY_OPTIONS,
  COMPANY_RISK_OWNER_OPTIONS,
  COMPANY_RISK_RATING_OPTIONS,
  COMPANY_TURNOVER_BRACKET_OPTIONS,
  type CompanyOption,
} from '../constants/company-labels.constants';
import {
  COMPANY_CONFIRM_DIALOGS,
  COMPANY_DRAWER_TITLES,
  COMPANY_TOAST_MESSAGES,
} from '../constants/company-messages.constants';

/**
 * Form payload exchanged with the opener.
 * Flat shape — internally we group by tab in the reactive form,
 * then flatten before emitting on close.
 */
export interface CompanyFormModel {
  // --- Basic Information --------------------------------------------------
  companyName?: string | null;
  tradeLegalRegNumber?: string | null;
  dateOfIncorporation?: Date | null;
  countryOfIncorporation?: string | null;
  regionEmirate?: string | null;
  city?: string | null;
  industrySector?: string | null;
  typeOfEntity?: string | null;
  ownershipType?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  parentCompany?: string | null;
  groupAffiliation?: string | null;
  notes?: string | null;
  orgStatus?: OrgStatus | null;

  // --- Regulatory ---------------------------------------------------------
  isRegulated?: boolean | null;
  regIndustry?: string | null;
  regulatoryLicenseNumber?: string | null;
  licenseExpiryDate?: Date | null;
  regulatoryNotes?: string | null;

  // --- Financial & Operational -------------------------------------------
  currencyAccount?: string | null;
  annualTurnoverBracket?: string | null;
  numberOfEmployees?: number | null;
  numberOfSubDivisionsLocations?: number | null;
  fiscalYearStart?: string | null;
  treasuryFunctionsPresent?: boolean | null;
  cashHandlingInvolved?: boolean | null;

  // --- Risk & Audit ------------------------------------------------------
  riskRating?: string | null;
  riskOwner?: string | null;
  lastAuditDate?: Date | null;
  nextPlannedAuditCycle?: string | null;
  residualRiskScore?: number | null;
  riskNotes?: string | null;

  viewType?:string | null;
  approval?: { action: CompanyApprovalAction; notes: string };
}

export interface AddCompanyDrawerData {
  existing?: CompanyFormModel;
  type?:string | null;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
}

const L = COMPANY_FIELD_LIMITS;

@Component({
  selector: 'app-add-company-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    DrawIconComponent,
  ],
  providers: [MessageService],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class AddCompanyModalComponent implements OnInit {

  private readonly drawerRef = inject(DrawerRef) as DrawerRef<CompanyFormModel, AddCompanyDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddCompanyDrawerData | null;
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly messageService = inject(MessageService);
 private readonly toast = inject(ToastService);
  /** Currently active tab (string for PrimeNG v18 Tabs). */
  activeTabIndex: string = '0';
  readonly approvalMode: boolean = this.drawerData?.approvalMode ?? false;
  readonly requestStatus: string = this.drawerData?.requestStatus ?? CompanyOrgStatuses.PendingReview;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === CompanyOrgStatuses.PendingReview;
  approvalNotesSubmitted = false;
  typeOfAction=false;

  // Exposed for the template.
  readonly CompanyDrawerTypes = CompanyDrawerTypes;
  readonly FIRST_TAB = COMPANY_FORM_FIRST_TAB;
  readonly LAST_TAB = COMPANY_FORM_LAST_TAB;

  readonly orgStatusOptions = ORG_STATUS_OPTIONS;

  /**
   * Reactive form, nested by tab so each tab has its own validity.
   * We flatten on submit to match the flat CompanyFormModel API.
   */
  readonly form = this.fb.group({
    basic: this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(L.CompanyNameMin), Validators.maxLength(L.CompanyNameMax),textValidator]],
      tradeLegalRegNumber: ['', [Validators.required,Validators.maxLength(L.TradeLegalRegNumberMax)]],
      dateOfIncorporation: [null as Date | null, [Validators.required,notFutureDateValidator]],
      countryOfIncorporation: [null as string | null],
      regionEmirate: [null as string | null],
      city: ['', [Validators.maxLength(L.CityMax)]],
      industrySector: [null as string | null],
      typeOfEntity: [null as string | null],
      ownershipType: [null as string | null],
      address: ['', [Validators.maxLength(L.AddressMax)]],
      email: ['', [Validators.email, Validators.maxLength(L.EmailMax)]],
      phone: ['', [phoneValidator]],
      website: ['', [urlValidator, Validators.maxLength(L.WebsiteMax)]],
      parentCompany: ['', [Validators.maxLength(L.ParentCompanyMax)]],
      groupAffiliation: ['', [Validators.maxLength(L.GroupAffiliationMax)]],
      notes: ['', [Validators.maxLength(L.NotesMax)]],
      orgStatus: [CompanyOrgStatuses.PendingReview as OrgStatus | null],
    }),
    regulatory: this.fb.group({
      isRegulated: [false],
      regIndustry: [null as string | null],
      regulatoryLicenseNumber: ['', [Validators.required,Validators.maxLength(L.RegulatoryLicenseNumberMax)]],
      licenseExpiryDate: [null as Date | null,[Validators.required]],
      regulatoryNotes: ['', [Validators.maxLength(L.RegulatoryNotesMax)]],
    }),
    financial: this.fb.group({
      currencyAccount: [null as string | null, Validators.required],
      annualTurnoverBracket: [null as string | null],
      numberOfEmployees: [null as number | null, [Validators.min(L.EmployeesMin), Validators.max(L.EmployeesMax), integerValidator]],
      numberOfSubDivisionsLocations: [null as number | null, [Validators.min(L.SubDivisionsLocationsMin), Validators.max(L.SubDivisionsLocationsMax), integerValidator]],
      fiscalYearStart: ['', [Validators.maxLength(L.FiscalYearStartMax)]],
      treasuryFunctionsPresent: [false],
      cashHandlingInvolved: [false],
    }),
    risk: this.fb.group({
      riskRating: [null as string | null, Validators.required],
      riskOwner: [null as string | null],
      lastAuditDate: [null as Date | null, [notFutureDateValidator]],
      nextPlannedAuditCycle: [null as string | null],
      residualRiskScore: [null as number | null, [Validators.min(L.ResidualRiskScoreMin), Validators.max(L.ResidualRiskScoreMax)]],
      riskNotes: ['', [Validators.maxLength(L.RiskNotesMax)]],
    }),
    viewType: [''],
    approverNotes: [''],
  });

  // ---------------------------------------------------------------------
  // Dropdown options
  // ---------------------------------------------------------------------

  readonly countries: CompanyOption[] = COMPANY_COUNTRY_OPTIONS;
  readonly regions: CompanyOption[] = COMPANY_REGION_OPTIONS;
  readonly industries: CompanyOption[] = COMPANY_REG_INDUSTRY_OPTIONS;
  readonly entityTypes: CompanyOption[] = COMPANY_ENTITY_TYPE_OPTIONS;
  readonly ownershipTypes: CompanyOption[] = COMPANY_OWNERSHIP_TYPE_OPTIONS;
  readonly currencies: CompanyOption[] = COMPANY_CURRENCY_OPTIONS;
  readonly turnoverBrackets: CompanyOption[] = COMPANY_TURNOVER_BRACKET_OPTIONS;
  readonly riskRatings: CompanyOption[] = COMPANY_RISK_RATING_OPTIONS;
  readonly riskOwners: CompanyOption[] = COMPANY_RISK_OWNER_OPTIONS;
  readonly auditCycles: CompanyOption[] = COMPANY_AUDIT_CYCLE_OPTIONS;


  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  ngOnInit(): void {
    // Hydrate from existing company if the caller passed one
    if (this.drawerData?.existing) {
     var type: string = CompanyDrawerTypes.View;
      if (this.drawerData?.type)
      {
        type=this.drawerData?.type;
        console.log("type",this.drawerData?.type)
      }
      this.form.patchValue({
        basic: this.drawerData.existing,
        regulatory: this.drawerData.existing,
        financial: this.drawerData.existing,
        risk: this.drawerData.existing,
        viewType:type
      });
    
    this.typeOfAction=true;
    }
    // Conditional validation — license fields are only required when
    // the company is regulated.
    this.form.controls.regulatory.controls.isRegulated.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isRegulated => this.applyRegulatoryValidators(!!isRegulated));

    this.applyRegulatoryValidators(
      !!this.form.controls.regulatory.controls.isRegulated.value,
    );
  }

  private applyRegulatoryValidators(isRegulated: boolean): void {
    const reg = this.form.controls.regulatory;
    const licenseNum = reg.controls.regulatoryLicenseNumber;
    const expiryDate = reg.controls.licenseExpiryDate;

    if (isRegulated) {
      licenseNum.setValidators([Validators.required, Validators.maxLength(L.RegulatoryLicenseNumberMax)]);
      expiryDate.setValidators([Validators.required, futureDateValidator]);
    } else {
      licenseNum.setValidators([Validators.maxLength(L.RegulatoryLicenseNumberMax)]);
      expiryDate.setValidators([]);
    }

    licenseNum.updateValueAndValidity({ emitEvent: false });
    expiryDate.updateValueAndValidity({ emitEvent: false });
  }

  // ---------------------------------------------------------------------
  // Tab navigation
  // ---------------------------------------------------------------------
  private readonly TAB_GROUPS = COMPANY_FORM_TAB_GROUPS;
  private readonly TAB_COUNT = this.TAB_GROUPS.length;

  next(): void {
    const i = Number(this.activeTabIndex);
    if (i >= this.TAB_COUNT - 1) return;

    // Mark current tab's controls touched so errors show if the user
    // tries to advance with bad input.
    const current = this.form.get(this.TAB_GROUPS[i]) as FormGroup;
   console.log('next',i);
    if (current.invalid) {
       
      current.markAllAsTouched();
      return;
    }
    this.activeTabIndex = String(i + 1);
  }

  previous(): void {
    const i = Number(this.activeTabIndex);
    if (i > 0) this.activeTabIndex = String(i - 1);
  }

  /** Is the currently-shown tab valid? */
  get currentTabIsValid(): boolean {
    const groupName = this.TAB_GROUPS[Number(this.activeTabIndex)];
    return (this.form.get(groupName) as FormGroup).valid;
  }

  // ---------------------------------------------------------------------
  // Error helpers used by the template
  // ---------------------------------------------------------------------

  /** Returns the first validation error message for the control, or null. */
 getError(path: string,field : string  | undefined): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors,field);
  }
  /** True when the control has been touched AND is currently invalid. */
  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
   // console.log('valid',!!ctrl?.invalid);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  // ---------------------------------------------------------------------
  // Approval actions
  // ---------------------------------------------------------------------
  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !(this.form.get('approverNotes')?.value?.trim());
  }

  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...COMPANY_CONFIRM_DIALOGS.Approve,
      action: CompanyApprovalActions.Approve,
    });
    if (ok) {
      this.drawerRef.close({
        approval: { action: CompanyApprovalActions.Approve, notes: this.form.get('approverNotes')!.value ?? '' },
      });
       this.toast.success(COMPANY_TOAST_MESSAGES.Approved, COMPANY_TOAST_MESSAGES.ApprovedTitle);
    //   this.messageService.add({
    //   severity: 'success',
    //   summary: 'Company Request Approved',
    //   detail:
    //    'Company details have been successfully approved.'
       
    // });
    //setTimeout(() => this.drawerRef.close(result), 1500);
    //  setTimeout(() => this.drawerRef.close({
    //     approval: { action: 'approve', notes: this.form.get('approverNotes')!.value ?? '' },
    //   }),1500);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = (this.form.get('approverNotes')!.value ?? '').trim();
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...COMPANY_CONFIRM_DIALOGS.Reject,
      action: CompanyApprovalActions.Reject,
    });
    if (ok) {
      this.drawerRef.close({ approval: { action: CompanyApprovalActions.Reject, notes } })
       this.toast.error(COMPANY_TOAST_MESSAGES.Rejected, COMPANY_TOAST_MESSAGES.RejectedTitle);
    //    this.messageService.add({
    //   severity: 'error',
    //   summary: 'Company Request Rejected',
    //   detail:
    //    'Company details have been rejected.'
       
    // });
    //   setTimeout(() =>this.drawerRef.close({ approval: { action: 'reject', notes } }),1500);
    }
  }

  // ---------------------------------------------------------------------
  // Submit / cancel
  // ---------------------------------------------------------------------
  onCancel(): void {
    this.drawerRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Jump to the first tab that has an error.
      const firstBadIdx = this.TAB_GROUPS.findIndex(
        g => (this.form.get(g) as FormGroup).invalid,
      );
      if (firstBadIdx >= 0) this.activeTabIndex = String(firstBadIdx);
      return;
    }

    const v = this.form.getRawValue();
    const result: CompanyFormModel = {
      ...v.basic,
      ...v.regulatory,
      ...v.financial,
      ...v.risk,
    };

    const isEdit = !!this.form.get('viewType')?.value;
    this.typeOfAction=isEdit;
    this.drawerRef.close(result);
    //setTimeout(() => this.drawerRef.close(result), 1500);
    var msg="";
    msg=isEdit
            ? COMPANY_TOAST_MESSAGES.Updated
            : COMPANY_TOAST_MESSAGES.Added;
    this.toast.success(msg);

    // this.messageService.add({
    //   severity: 'success',
    //   summary: isEdit ? 'Company Updated' : 'Company Created',
    //   detail: isEdit
    //     ? 'Company details have been successfully updated.'
    //     : 'New company has been successfully added.',
    // });

  }
 
 get headerTitle(): string {
  if (this.approvalMode) return COMPANY_DRAWER_TITLES.Review;
  return this.typeOfAction ? COMPANY_DRAWER_TITLES.Edit : COMPANY_DRAWER_TITLES.Add;
}
}