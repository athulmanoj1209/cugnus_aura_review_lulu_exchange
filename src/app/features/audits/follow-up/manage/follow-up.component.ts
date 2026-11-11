import { Component, inject, OnInit } from '@angular/core';
import { DRAWER_DATA, DrawerRef } from '../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

export interface AddFollowupDrawerData {
  existing?: Partial<FollowupFormModel> & { id?: string };
  mode?: 'create' | 'edit';
}

export interface FollowupFormModel {
  title: string;
  description?: string;
  finding?: string;
  severity?: string;
  recommendation?:string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface AddFollowupResult {
  mode: 'create' | 'edit';
  followupId?: string;
  form: FollowupFormModel;
}

export interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-followup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    TextareaModule,
  
    DrawIconComponent,],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss'
})
export class AddFollowupComponent implements OnInit {
  private readonly fb         = inject(FormBuilder);
  private readonly drawerRef  = inject(DrawerRef) as DrawerRef<AddFollowupResult, AddFollowupDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddFollowupDrawerData | null;

  readonly mode: 'create' | 'edit' = this.drawerData?.mode ?? 'create';
  readonly isEdit = this.mode === 'edit';

  readonly form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    finding:     ['', [Validators.required]],
    severity:    ['', [Validators.required]],
    recommendation:[''],
    startDate:   [null as Date | null, [Validators.required]],
    endDate:     [null as Date | null, [Validators.required]],
     company:       [''], branch: [''], department: [''],
  });
 readonly companyOptions: Option[] = [
      { label: 'Crowe UAE', value: 'crowe_uae' }, { label: 'Crowe Oman', value: 'crowe_oman' },
      { label: 'Crowe Saudi Arabia', value: 'crowe_saudi' }, { label: 'Crowe Qatar', value: 'crowe_qatar' },
    ];
    readonly branchOptions: Option[] = [
      { label: 'Dubai', value: 'dubai' }, { label: 'Abu Dhabi', value: 'abu_dhabi' },
      { label: 'Sharjah', value: 'sharjah' }, { label: 'Al Ain', value: 'al_ain' },
    ];
    readonly departmentOptions: Option[] = [
      { label: 'Internal Audit', value: 'internal_audit' }, { label: 'External Audit', value: 'external_audit' },
      { label: 'Regulatory', value: 'regulatory' }, { label: 'Risk Management', value: 'risk_management' },
      { label: 'IT', value: 'it' },
    ];
  readonly findingOptions: Option[] = [
    { label: 'Missing access controls',       value: 'missing_access_controls'   },
    { label: 'Unencrypted data at rest',      value: 'unencrypted_data'          },
    { label: 'Segregation of duties gap',     value: 'sod_gap'                   },
    { label: 'Outdated patch management',     value: 'patch_management'          },
    { label: 'Inadequate backup procedures',  value: 'backup_procedures'         },
  ];
readonly recommendationOptions: Option[] = [
    { label: 'Missing access controls',       value: 'missing_access_controls'   },
    { label: 'Unencrypted data at rest',      value: 'unencrypted_data'          },
    { label: 'Segregation of duties gap',     value: 'sod_gap'                   },
    { label: 'Outdated patch management',     value: 'patch_management'          },
    { label: 'Inadequate backup procedures',  value: 'backup_procedures'         },
  ];
  readonly severityOptions: Option[] = [
    { label: 'Critical', value: 'critical' },
    { label: 'High',     value: 'high'     },
    { label: 'Medium',   value: 'medium'   },
    { label: 'Low',      value: 'low'      },
  ];

  ngOnInit(): void {
    if (this.drawerData?.existing) {
      this.form.patchValue(this.drawerData.existing);
    }

    // End date must be >= start date
    this.form.get('startDate')!.valueChanges.subscribe(() => {
      this.form.get('endDate')!.updateValueAndValidity();
    });
  }

  onCancel(): void {
    this.drawerRef.close(null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.drawerRef.close({
      mode: this.mode,
      followupId: this.drawerData?.existing?.id,
      form: this.form.value as FollowupFormModel,
    });
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  getError(path: string, field?: string): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors, field);
  }

  get minEndDate(): Date | null {
    return this.form.get('startDate')!.value;
  }

  get headerTitle(): string {
    return this.isEdit ? 'Edit Follow-up' : 'Add Follow-up';
  }

  get headerSubtitle(): string {
    return this.isEdit
      ? 'Update follow-up details'
      : 'Track remediation progress for a finding';
  }

  get submitLabel(): string {
    return this.isEdit ? 'UPDATE FOLLOW-UP' : 'ADD FOLLOW-UP';
  }
}