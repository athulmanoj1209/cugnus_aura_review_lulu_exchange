import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';

import { AuditPlanHeader } from '../models/audit-plan.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { ORG_STATIC_DATA, OrgOption } from '@/app/features/audits/organization/company/company-org-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import {
  AUDIT_PLAN_FIELD_LIMITS,
  AUDIT_PLAN_PERIOD_MONTHS,
  AUDIT_PLAN_SUBMIT_DELAY_MS,
  MONTHS_PER_YEAR,
} from '../constants/audit-plan.constants';
import {
  AUDIT_PLAN_FORM_ERRORS,
  AUDIT_PLAN_FORM_HEADERS,
  AUDIT_PLAN_FORM_PLACEHOLDERS,
  AUDIT_PLAN_SUB_DIVISION_PLACEHOLDERS,
  AUDIT_PLAN_TOAST_MESSAGES,
  maxCharactersMessage,
} from '../constants/audit-plan-messages.constants';

// ── CLIENT_MODE / client-key aware Company → Division → Sub-Division source ──
// Same switch as the Audit Plan list filters: audit-firm builds read the
// multi-company ORG_STATIC_DATA roster; internal-audit builds read the
// per-client seeds (COMPANIES_SEED / DIVISION_INDI_ORG_COMPANIES /
// SUB_DIVISION_INDI_ORG_COMPANIES), which already switch on
// INTERNAL_AUDIT_CLIENT_KEY_VALUE (dar-exchange / xyz-broadcast / lulu-exchange).

interface PlanSourceSubDivision { subDivisionCode: string; subDivisionName: string; }
interface PlanSourceDivision { divisionCode: string; divisionName: string; }
interface PlanSourceDivisionWithSubs extends PlanSourceDivision {
  hasSubDivision?: boolean;
  subDivisions?: PlanSourceSubDivision[];
}
export interface PlanSourceCompany<D extends PlanSourceDivision = PlanSourceDivision> {
  id: string;
  companyName: string;
  divisions: D[];
}

const IS_INTERNAL_AUDIT = CLIENT_MODE_VALUE === 'internal-audit';

/** Companies offered in the Company dropdown. */
export function planCompanySource(): { id: string; companyName: string }[] {
  return IS_INTERNAL_AUDIT ? COMPANIES_SEED : ORG_STATIC_DATA;
}

/** Company → Division source (used for the Division dropdown and name/code lookups). */
export function planDivisionSource(): PlanSourceCompany[] {
  return IS_INTERNAL_AUDIT ? DIVISION_INDI_ORG_COMPANIES : ORG_STATIC_DATA;
}

/** Company → Division → Sub-Division source (used for the Sub-Division dropdown). */
export function planSubDivisionSource(): PlanSourceCompany<PlanSourceDivisionWithSubs>[] {
  return IS_INTERNAL_AUDIT ? SUB_DIVISION_INDI_ORG_COMPANIES : ORG_STATIC_DATA;
}

// ── Custom Validators ─────────────────────────────────────────────────────────

function periodToAfterFromValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get('periodFrom')?.value as Date | null;
    const to   = group.get('periodTo')?.value as Date | null;
    if (!from || !to) return null;
    return endOfMonth(to) < startOfMonth(from) ? { periodToBeforeFrom: true } : null;
  };
}

/** Required To month: exactly 12 months inclusive of From (e.g. Jan 2026 → Dec 2026). Returns that month's last day. */
function maxPeriodTo(from: Date): Date {
  return new Date(from.getFullYear(), from.getMonth() + AUDIT_PLAN_PERIOD_MONTHS, 0);
}

function periodWithinOneYearValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get('periodFrom')?.value as Date | null;
    const to   = group.get('periodTo')?.value as Date | null;
    if (!from || !to) return null;
    const months = (to.getFullYear() - from.getFullYear()) * MONTHS_PER_YEAR + (to.getMonth() - from.getMonth());
    return months >= 0 && months !== AUDIT_PLAN_PERIOD_MONTHS - 1 ? { periodNotOneYear: true } : null;
  };
}

const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth   = (d: Date): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0);

/** Rejects months before the current month. */
function notPastMonthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as Date | null;
    if (!value) return null;
    return startOfMonth(value) < startOfMonth(new Date()) ? { pastMonth: true } : null;
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-audit-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TooltipModule,
    DrawIconComponent,
  ],
  templateUrl: './audit-plan.component.html',
  styleUrls: ['./audit-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPlanFormComponent implements OnInit, OnDestroy {

  // ── Drawer wiring ─────────────────────────────────────────────────────────
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AuditPlanHeader>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AuditPlanHeader | null;

  // ── Services ──────────────────────────────────────────────────────────────
  private readonly fb    = inject(FormBuilder);
  private readonly cdr   = inject(ChangeDetectorRef);
  private readonly toast = inject(ToastService);

  // ── State ─────────────────────────────────────────────────────────────────
  form!: FormGroup;
  readonly isEditMode = computed(() => !!this.drawerData?.id);
  submitting = signal(false);
  readonly currentMonthStart = startOfMonth(new Date());
  /**
   * Cached (not a getter): a fresh Date on every change-detection pass makes the
   * PrimeNG datepicker rebuild its panel, swallowing the first click on the year view.
   */
  periodToMaxDate: Date | null = null;

  // ── Template constants ────────────────────────────────────────────────────
  readonly planNameMax             = AUDIT_PLAN_FIELD_LIMITS.PlanNameMax;
  readonly planNameMaxMessage      = maxCharactersMessage(AUDIT_PLAN_FIELD_LIMITS.PlanNameMax);
  readonly errors                  = AUDIT_PLAN_FORM_ERRORS;
  readonly placeholders            = AUDIT_PLAN_FORM_PLACEHOLDERS;
  readonly subDivisionPlaceholders = AUDIT_PLAN_SUB_DIVISION_PLACEHOLDERS;
  readonly header = computed(() => this.isEditMode() ? AUDIT_PLAN_FORM_HEADERS.Edit : AUDIT_PLAN_FORM_HEADERS.Create);

  // ── Options ───────────────────────────────────────────────────────────────
  readonly companyOptions: OrgOption[] = planCompanySource()
    .map(c => ({ label: c.companyName, value: c.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  divisionOptions: OrgOption[] = [];
  subDivisionOptions: OrgOption[] = [];

  private readonly destroy$ = new Subject<void>();

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    this.watchCompany();
    this.watchDivision();
    this.watchPeriodFrom();
    if (this.drawerData) this.patchForm(this.drawerData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group(
      {
        companyId:    [null, [Validators.required]],
        divisionCode: [{ value: null, disabled: true }, [Validators.required]],
        subDivisionCodes: [{ value: [], disabled: true }],
        planName:    ['', [Validators.required, Validators.maxLength(AUDIT_PLAN_FIELD_LIMITS.PlanNameMax)]],
        // Past months only blocked on create, so existing plans with past periods can still be edited.
        periodFrom:   [null, this.isEditMode() ? [Validators.required] : [Validators.required, notPastMonthValidator()]],
        periodTo:     [null, [Validators.required]],
      },
      { validators: [periodToAfterFromValidator(), periodWithinOneYearValidator()] }
    );
  }

  /** Division list depends on the selected company; reset division whenever company changes. */
  private watchCompany(): void {
    this.form.get('companyId')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((companyId: string | null) => {
        this.loadDivisions(companyId);
        this.form.get('divisionCode')!.reset(null);
        this.cdr.markForCheck();
      });
  }

  private loadDivisions(companyId: string | null): void {
    const company = planDivisionSource().find(c => c.id === companyId);
    this.divisionOptions = (company?.divisions ?? []).map(d => ({
      label: d.divisionName,
      value: d.divisionCode,
    }));
    const division = this.form.get('divisionCode')!;
    if (company) division.enable({ emitEvent: false });
    else division.disable({ emitEvent: false });
  }

  /** Sub-division list depends on the selected division; reset sub-divisions whenever division changes. */
  private watchDivision(): void {
    this.form.get('divisionCode')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((divisionCode: string | null) => {
        this.loadSubDivisions(divisionCode);
        this.form.get('subDivisionCodes')!.reset([]);
        this.cdr.markForCheck();
      });
  }

  /** Recompute the To max date only when From changes, keeping a stable reference for the datepicker. */
  private watchPeriodFrom(): void {
    this.form.get('periodFrom')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((from: Date | null) => {
        this.periodToMaxDate = from ? maxPeriodTo(from) : null;
        this.cdr.markForCheck();
      });
  }

  private loadSubDivisions(divisionCode: string | null): void {
    const company  = planSubDivisionSource().find(c => c.id === this.form.get('companyId')!.value);
    const division = company?.divisions.find(d => d.divisionCode === divisionCode);
    // Divisions flagged hasSubDivision:false can still carry a subDivisions array in the seeds.
    const subDivisionList = division?.hasSubDivision === false ? [] : (division?.subDivisions ?? []);
    this.subDivisionOptions = subDivisionList.map(s => ({
      label: s.subDivisionName,
      value: s.subDivisionCode,
    }));
    const subDivisions = this.form.get('subDivisionCodes')!;
    if (this.subDivisionOptions.length) subDivisions.enable({ emitEvent: false });
    else subDivisions.disable({ emitEvent: false });
  }

  private patchForm(plan: AuditPlanHeader): void {
    // Company first (triggers division load + reset), then division (triggers sub-division load + reset), then the rest.
    this.form.patchValue({ companyId: plan.companyId });
    this.form.patchValue({ divisionCode: plan.divisionCode });
    this.form.patchValue({
      subDivisionCodes: plan.subDivisionCodes ?? [],
      planName:    plan.planName,
      periodFrom:   plan.periodFrom ? new Date(plan.periodFrom) : null,
      periodTo:     plan.periodTo   ? new Date(plan.periodTo)   : null,
    });
  }

  // ── Submit / Cancel ───────────────────────────────────────────────────────

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.error(AUDIT_PLAN_TOAST_MESSAGES.ValidationError, AUDIT_PLAN_TOAST_MESSAGES.ValidationErrorTitle);
      return;
    }

    this.submitting.set(true);

    setTimeout(() => {
      const v = this.form.getRawValue();

      const payload: AuditPlanHeader = {
        id:           this.drawerData?.id ?? crypto.randomUUID(),
        companyId:    v.companyId,
        divisionCode: v.divisionCode,
        subDivisionCodes: v.subDivisionCodes ?? [],
        planName:    v.planName.trim(),
        periodFrom:   startOfMonth(v.periodFrom),
        periodTo:     endOfMonth(v.periodTo),
        createdAt:    this.drawerData?.createdAt ?? new Date(),
        updatedAt:    new Date(),
      };
      this.drawerRef.close(payload);
      this.toast.success(
        this.isEditMode()
          ? AUDIT_PLAN_TOAST_MESSAGES.Updated
          : AUDIT_PLAN_TOAST_MESSAGES.Created
      );

      this.submitting.set(false);
      this.cdr.markForCheck();
    }, AUDIT_PLAN_SUBMIT_DELAY_MS);
  }

  cancel(): void {
    this.drawerRef.close(null);
  }

  // ── Validation helpers ────────────────────────────────────────────────────


  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  groupError(key: string): boolean {
    return !!(
      this.form.hasError(key) &&
      (this.form.get('periodFrom')?.touched || this.form.get('periodTo')?.touched)
    );
  }
}
