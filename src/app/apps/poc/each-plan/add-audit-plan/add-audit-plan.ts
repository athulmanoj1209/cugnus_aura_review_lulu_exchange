import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
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
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

export interface AddAuditPlanDrawerData {
  mode?: 'add' | 'edit';
}

@Component({
  selector: 'app-add-audit-plan',
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
    CheckboxModule,
    ToastModule,
    TabsModule,
  
    DrawIconComponent,],
  providers: [MessageService],
  templateUrl: './add-audit-plan.html',
  styleUrl: './add-audit-plan.scss',
})
export class AddAuditPlan implements OnInit {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as AddAuditPlanDrawerData | null;

  auditPlanForm!: FormGroup;
  submitted = false;

  activeTabIndex: any = 0;

  auditFrequencyOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  planOwnerOptions = [
    { label: 'Audit Manager', value: 'audit-manager' },
    { label: 'Chief Audit Executive', value: 'cae' },
  ];

  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Deactivated', value: 'deactivated' },
  ];

  scopeCoverageOptions = [
    { label: 'Finance Audit', value: 'finance-audit', budget: 10000 },
    { label: 'IT Audit', value: 'it-audit', budget: 15000 },
    { label: 'Operations Audit', value: 'operations-audit', budget: 12000 },
  ];

  scopeItems = [
    {
      id: 'fin-ctrl-q1-2026-a',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-b',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-c',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-d',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-e',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-f',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-g',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
    {
      id: 'fin-ctrl-q1-2026-h',
      title: 'Financial Controls Audit - Q1 2026',
      description: 'To assess the effectiveness of financial controls and ensure compliance with corporate policies.',
      timePeriod: 'Jan 15, 2026 - Mar 31, 2026',
      auditors: '2 Auditors',
      budget: '$18,000',
      model: 'Full',
    },
  ];

  departmentOptions = [
    { label: 'Finance', value: 'finance' },
    { label: 'IT', value: 'it' },
    { label: 'Operations', value: 'operations' },
    { label: 'HR', value: 'hr' },
  ];

  departmentItems = [
    { id: 'fin', label: 'Finance (FIN)' },
    { id: 'ops', label: 'Operations (OPS)' },
    { id: 'its', label: 'IT Security (ITS)' },
    { id: 'hr',  label: 'Human Resources (HR)' },
    { id: 'com', label: 'Compliance (COM)' },
    { id: 'sal', label: 'Sales (SAL)' },
    { id: 'pro', label: 'Procurement (PRO)' },
    { id: 'leg', label: 'Legal (LEG)' },
  ];

  auditPlanErrorMessages: Record<string, Record<string, string>> = {
    planName: { required: 'Plan name is required.' },
    auditFrequency: { required: 'Audit frequency is required.' },
    startDate: {
      required: 'Start date is required.',
      startDateInvalid: 'Start date cannot be in the past.',
    },
    endDate: {
      required: 'End date is required.',
      endBeforeStart: 'End date must be after start date.',
    },
    planOwner: { required: 'Plan owner is required.' },
    scopeCoverage: { required: 'Please select at least one scope.' },
    departmentsCovered: { required: 'Please select at least one department.' },
    objectives: { maxlength: 'Objectives cannot exceed 500 characters.' },
    status: { required: 'Status is required.' },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  get f() {
    return this.auditPlanForm.controls;
  }

  get objectivesLength(): number {
    return this.f['objectives']?.value?.length ?? 0;
  }

  get computedBudget(): string {
    const selectedIds: string[] = this.auditPlanForm.get('scopeCoverage')?.value ?? [];
    const total = this.scopeItems
      .filter(s => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + (parseInt(s.budget.replace(/[^0-9]/g, ''), 10) || 0), 0);
    return `$${total.toLocaleString()}`;
  }

  isSelected(id: string): boolean {
    const vals: string[] = this.auditPlanForm.get('scopeCoverage')?.value ?? [];
    return vals.includes(id);
  }

  selectScope(id: string): void {
    const ctrl = this.auditPlanForm.get('scopeCoverage');
    const current: string[] = [...(ctrl?.value ?? [])];
    const index = current.indexOf(id);
    if (index === -1) {
      ctrl?.setValue([...current, id]);
    } else {
      ctrl?.setValue(current.filter(v => v !== id));
    }
  }

  isDeptSelected(id: string): boolean {
    const vals: string[] = this.auditPlanForm.get('departmentsCovered')?.value ?? [];
    return vals.includes(id);
  }

  toggleDept(id: string): void {
    const ctrl = this.auditPlanForm.get('departmentsCovered');
    const current: string[] = [...(ctrl?.value ?? [])];
    const index = current.indexOf(id);
    if (index === -1) {
      ctrl?.setValue([...current, id]);
    } else {
      ctrl?.setValue(current.filter(v => v !== id));
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.auditPlanForm.get(controlName);

    if (!control || !control.errors) return '';

    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];

    return this.auditPlanErrorMessages[controlName]?.[firstErrorKey] || 'Invalid field.';
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.auditPlanForm.get(name);

    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  goToNextTab(): void {
    if (this.activeTabIndex === 0) {
      this.submitted = true;
      this.auditPlanForm.markAllAsTouched();

      const requiredFields = [
        'planId',
        'version',
        'planName',
        'auditFrequency',
        'startDate',
        'endDate',
        'planOwner',
        'objectives',
        // 'scopeCoverage',
        // 'departmentsCovered',
        'status',
      ];

      const firstPageValid = requiredFields.every(field => {
        const ctrl = this.auditPlanForm.get(field);
        return ctrl ? ctrl.valid : true;
      }) && !this.auditPlanForm.errors;

      if (!firstPageValid) {
        return;
      }
    }

    if (this.activeTabIndex < 3) {
      this.activeTabIndex++;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.auditPlanForm.markAllAsTouched();

    if (this.auditPlanForm.invalid) {
      this.activeTabIndex = 0;
      return;
    }

    console.log(this.auditPlanForm.value);
    this.onClose();
  }

  onClose(): void {
    this.activeTabIndex = 0;
    this.submitted = false;
    this.drawerRef.close(null);
  }

  private buildForm(): void {
    const autoId = `BHIMA-${Math.floor(1000 + Math.random() * 9000)}`;

    this.auditPlanForm = this.fb.group(
      {
        planId: [autoId],
        version: ['v1'],
        planName: ['', Validators.required],
        auditFrequency: [null, Validators.required],
        startDate: [null, [Validators.required, this.startDateValidator]],
        endDate: [null, Validators.required],
        planOwner: [null, Validators.required],
        objectives: ['', Validators.maxLength(500)],
        scopeCoverage: [[], Validators.required],
        departmentsCovered: [[], Validators.required],
        status: [null, Validators.required],
      },
      {
        validators: this.dateRangeValidator,
      }
    );
  }

  startDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today ? { startDateInvalid: true } : null;
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { endBeforeStart: true };
    }

    return null;
  }
}