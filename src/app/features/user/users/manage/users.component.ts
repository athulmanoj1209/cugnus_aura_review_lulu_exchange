import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

// PrimeNG modules (v18+)
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import {
  firstErrorMessage,
  phoneValidator,
  usernameValidator,
} from '@/app/shared/services/form-validators.service';
import { UserFormModel, UserRole, UserStatus } from '@/app/features/user/users/services/users.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

// Shared Company → Division → Sub-division static data — the same file every
// other Add-X drawer in the app now reads from (Recommendations, Working
// Papers, Regulation Library, etc.) instead of the CompanyDataService
// (id-keyed) lookup this drawer used to have for Company, and instead of
// the Division/Sub-division fields' previous static lists. Those previous
// lists had their labels and values mismatched — Division options read
// "ABC Branch"/"XYZ"/"PQR solutions" but submitted values of
// 'Internal Audit'/'External Audit'/'Regulatory' (sub-division-shaped
// strings), and Sub-division was a generic, unrelated list ("Executive",
// "IT Audit", "Risk", ...) — neither matched any real division/sub-division
// name. Company/Division/Sub-division option *values* are now the real
// display NAMES from company-org-data.ts, and Division/Sub-division cascade
// off whichever Company/Division is currently selected.


/** Lightweight DTO for the Reports-To picker. */
export interface ManagerOption {
  id: string;
  fullName: string;
  designation?: string;
}

/* ============================================================
 *  Drawer data & result
 * ============================================================ */

export interface AddUserDrawerData {
  /** Pre-fill the form when editing. */
  existing?: Partial<UserFormModel> & { id?: string };
  /** Default 'create'. 'edit' renames the header + submit button and
   *  hides the invitation toggle (already provisioned). */
  mode?: 'create' | 'edit';
  /** Pool of users available in the Reports-To picker. */
  managers?: ManagerOption[];
}

export interface AddUserResult {
  mode: 'create' | 'edit';
  /** Echoed back on edit so the caller knows which user to patch. */
  userId?: string;
  form: UserFormModel;
}

interface Option<T = string> { label: string; value: T; }

/* ============================================================
 *  Component
 * ============================================================ */

/** Company → Division → Sub-division roster the selects read from — the
 *  static internal-audit org file in 'internal-audit' mode, the
 *  multi-company roster otherwise. */
const ACTIVE_ORG_DATA =
  CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
    RadioButtonModule,
    ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class AddUserModalComponent implements OnInit {

  private readonly drawerRef = inject(DrawerRef) as DrawerRef<AddUserResult, AddUserDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddUserDrawerData | null;
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  readonly mode: 'create' | 'edit' = this.drawerData?.mode ?? 'create';
  readonly isEdit: boolean = this.mode === 'edit';

  /* ---------------- Form ---------------- */
  readonly form = this.fb.group({
    fullName:     ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    email:        ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    phone:        ['', [phoneValidator]],
    role:         [null as UserRole | null, [Validators.required]],
    status:       ['active' as UserStatus, [Validators.required]],
    twoFactorEnabled: [false],
    sendInvitation:   [true],

    // ---- New extended fields ----------------------------------
    designation:  ['', [Validators.maxLength(120)]],
    employeeId:   ['', [Validators.maxLength(50)]],
    joiningDate:  [null as Date | null],
    location:     [null as string | null],
    expertise:    [[] as string[]],
    reportsToId:  [null as string | null],
   // username: ['',[Validators.required,]]
     username:     ['', [Validators.required, Validators.maxLength(50), usernameValidator]],
     company:         [''], division: [''], subDivision: [null as string | null],
  });

  /* ---------------- Dropdown options ---------------- */

  readonly roles: Option<UserRole>[] = [
    { label: $localize`:@@common.administrator:Administrator`, value: 'admin' },
    { label: $localize`:@@common.manager:Manager`, value: 'manager' },
    { label: $localize`:@@common.auditor:Auditor`, value: 'auditor' },
    { label: $localize`:@@common.viewer:Viewer`, value: 'viewer' },
  ];

  readonly statuses: Option<UserStatus>[] = [
    { label: $localize`:@@common.active:Active`, value: 'active' },
    { label: $localize`:@@common.pendingInvitation:Pending Invitation`, value: 'pending' },
    { label: $localize`:@@common.suspended:Suspended`, value: 'suspended' },
  ];

  /** Areas of expertise — same enum as the audit-member modal. */
  readonly expertiseOptions: Option[] = [
    { label: $localize`:@@common.aml:AML`, value: 'AML' },
    { label: $localize`:@@common.it:IT`, value: 'IT' },
    { label: $localize`:@@common.treasury:Treasury`, value: 'Treasury' },
    { label: $localize`:@@common.finance:Finance`, value: 'Finance' },
    { label: $localize`:@@common.hr:HR`, value: 'HR' },
    { label: $localize`:@@common.operations:Operations`, value: 'Operations' },
  ];

  /** Office locations / branches. Edit to match your org's network. */
  readonly locationOptions: Option[] = [
    { label: 'Dubai HQ',          value: 'Dubai HQ'          },
    { label: 'Abu Dhabi Branch',  value: 'Abu Dhabi Branch'  },
    { label: 'Sharjah Office',    value: 'Sharjah Office'    },
    { label: 'Riyadh Branch',     value: 'Riyadh Branch'     },
    { label: 'Doha Office',       value: 'Doha Office'       },
    { label: 'Muscat Office',     value: 'Muscat Office'     },
    { label: 'Manama Office',     value: 'Manama Office'     },
    { label: 'Remote',            value: 'Remote'            },
  ];

  readonly fieldLabels = {
    fullName: $localize`:@@common.fullName:Full Name`,
    email: $localize`:@@common.email:Email`,
    phone: $localize`:@@common.phone:Phone`,
    role: $localize`:@@common.role:Role`,
    company: $localize`:@@common.company:Company`,
    division: $localize`:@@common.division:Division`,
    designation: $localize`:@@common.designation:Designation`,
    employeeId: $localize`:@@common.employeeId:Employee ID`,
    username: $localize`:@@common.username:User name`,
  };

  /** Tracks the live Company/Division value so Division/Sub-division can cascade
   *  off it — same toSignal()+computed() pattern used by every other
   *  Add-X drawer whose `form` is a class-field initializer (this one, add-
   *  recommendation, add-working-paper). */
  private readonly selectedCompanyName = toSignal(
    this.form.controls.company.valueChanges.pipe(startWith(this.form.controls.company.value)),
    { initialValue: this.form.controls.company.value },
  );
  private readonly selectedDivisionName = toSignal(
    this.form.controls.division.valueChanges.pipe(startWith(this.form.controls.division.value)),
    { initialValue: this.form.controls.division.value },
  );

  /**
   * Sourced from company-org-data.ts — the same shared static-data file
   * every other Company filter/drawer in the app now reads from — instead
   * of the CompanyDataService (id-keyed) lookup this used to have. Value
   * is the company's display NAME.
   */
  readonly companyOptions = computed<Option[]>(() =>
    ACTIVE_ORG_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Division narrows to the selected Company's real divisions (or every
   *  division, deduped by name, when no Company is selected yet) — replacing
   *  the old "ABC Branch"/"XYZ"/"PQR solutions" placeholder list. */
  readonly divisionOptions = computed<Option[]>(() => {
    const companyName = this.selectedCompanyName();
    const companies = companyName
      ? ACTIVE_ORG_DATA.filter(c => c.companyName === companyName)
      : ACTIVE_ORG_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(b => b.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * False when the selected division is flagged `hasSubDivision: false` —
   * Sub-Division is then left empty (null) and the select is disabled.
   */
  readonly divisionHasSubDivision = computed(() => {
    const companyName  = this.selectedCompanyName();
    const divisionName = this.selectedDivisionName();
    if (!companyName || !divisionName) return true;
    const division = ACTIVE_ORG_DATA
      .find(c => c.companyName === companyName)?.divisions
      .find(d => d.divisionName === divisionName);
    return division?.hasSubDivision !== false;
  });

  /** Sub-division narrows to the selected Company + Division — replacing the
   *  old generic Executive/Audit/IT Audit/Risk/Compliance/Finance/External
   *  list, which didn't match any real sub-division name. */
  readonly subDivisionOptions = computed<Option[]>(() => {
    if (!this.divisionHasSubDivision()) return [];
    const companyName  = this.selectedCompanyName();
    const divisionName = this.selectedDivisionName();
    const companies = companyName
      ? ACTIVE_ORG_DATA.filter(c => c.companyName === companyName)
      : ACTIVE_ORG_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(b => !divisionName || b.divisionName === divisionName);
    const names = new Set(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /** Manager picker — built from drawerData.managers, minus the user
   *  being edited (you can't report to yourself). */
  readonly managerOptions: ManagerOption[] = (() => {
    const all = this.drawerData?.managers ?? [];
    const selfId = this.drawerData?.existing?.id;
    return all.filter(m => m.id !== selfId);
  })();

  /* ---------------- Header / submit copy ---------------- */

  get headerTitle(): string {
    return this.isEdit ? $localize`:@@user.form.editTitle:Edit User` : $localize`:@@user.form.addTitle:Add New User`;
  }

  get headerSubtitle(): string {
    return this.isEdit
      ? $localize`:@@user.form.editSubtitle:Update access and account details`
      : $localize`:@@user.form.addSubtitle:Provision platform access for a new user`;
  }

  get submitLabel(): string {
    return this.isEdit ? $localize`:@@common.saveChanges:Save Changes` : $localize`:@@user.form.addUser:Add User`;
  }

  /* ---------------- Init / lifecycle ---------------- */

  ngOnInit(): void {
    // Company change → reset & re-derive Division and Sub-division.
    this.form.controls.company.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.division.setValue('', { emitEvent: false });
        this.form.controls.subDivision.setValue(null, { emitEvent: false });
      });

    // Division change → reset & re-derive Sub-division.
    this.form.controls.division.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.subDivision.setValue(null, { emitEvent: false });
      });

    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing);
    }

    // Default 2FA on for admin/manager roles, off for others.
    // Only auto-toggle when creating; editing should respect the existing value.
    if (!this.isEdit) {
      this.form.controls.role.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(role => {
          if (role === 'admin' || role === 'manager') {
            this.form.controls.twoFactorEnabled.setValue(true, { emitEvent: false });
          }
        });

      // If status flips off "pending", clear sendInvitation
      this.form.controls.status.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(status => {
          if (status !== 'pending') {
            this.form.controls.sendInvitation.setValue(false, { emitEvent: false });
          }
        });
    } else {
      // Editing — invitation toggle is meaningless once provisioned
      this.form.controls.sendInvitation.setValue(false, { emitEvent: false });
    }
  }

  /* ---------------- Error helpers ---------------- */

  getError(path: string,field : string  | undefined): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors,field);
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  /* ---------------- Submit / cancel ---------------- */

  onCancel(): void {
    this.drawerRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: UserFormModel = {
      fullName:         raw.fullName!,
      email:            raw.email!,
      phone:            raw.phone || undefined,
      role:             raw.role!,
      subDivision:      raw.subDivision || undefined,
      status:           raw.status!,
      twoFactorEnabled: !!raw.twoFactorEnabled,
      sendInvitation:   !!raw.sendInvitation,

      // ---- new fields ----
      designation:      raw.designation || undefined,
      employeeId:       raw.employeeId  || undefined,
      joiningDate:      raw.joiningDate ?? null,
      location:         raw.location    || undefined,
      expertise:        raw.expertise   || [],
      reportsToId:      raw.reportsToId ?? null,
      company: raw.company,
      division: raw.division
    };

    // this.messageService.add({
    //   severity: 'success',
    //   summary: this.isEdit ? 'User Updated' : 'User Added',
    //   detail: this.isEdit
    //     ? 'User details have been successfully updated.'
    //     : 'New user has been successfully added.',
    // });

    // Fire the toast BEFORE closing the drawer. drawerRef.close() tears this
    // component down immediately (taking its own <p-toast> with it), so a
    // toast.success() call placed after close() never has anywhere left to
    // render — that was the bug. toast.success() itself is fire-and-forget
    // against a shared/root toast outlet, so there's no need to delay the
    // close afterward.
    const msg = this.isEdit
      ? $localize`:@@user.form.userUpdated:User details have been successfully updated.`
      : $localize`:@@user.form.userAdded:New user has been successfully added.`;
    this.toast.success(msg);

    this.drawerRef.close({
      mode: this.mode,
      userId: this.drawerData?.existing?.id,
      form: payload,
    });
  }

  divisionPlaceholder(): string {
    return this.form.get('company')?.value
      ? $localize`:@@user.form.selectDivision:Select division`
      : $localize`:@@user.form.selectCompanyFirst:Select a company first`;
  }

  subDivisionPlaceholder(): string {
    if (!this.form.get('division')?.value) {
      return $localize`:@@user.form.selectDivisionFirst:Select a division first`;
    }

    return this.divisionHasSubDivision()
      ? $localize`:@@user.form.selectSubDivision:Select sub-division`
      : $localize`:@@user.form.noSubDivision:No sub-division`;
  }
}