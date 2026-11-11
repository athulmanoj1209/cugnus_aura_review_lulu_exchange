import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { HourlyRateEntry } from '../models/hourly-rate.model';

import { HourlyRateModes, HourlyRateStatuses } from '../constants/hourly-rate.constants';

import { HOURLY_RATE_ERROR_MESSAGES } from '../constants/hourly-rate-messages.constants';

@Component({
  selector: 'app-hourly-rate',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './hourly-rate.component.html',
  styleUrl: './hourly-rate.component.scss',
})
export class HourlyRateComponent implements OnChanges {
  readonly errorMessages = HOURLY_RATE_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: HourlyRateEntry | null = null;
  @Output() submitted = new EventEmitter<HourlyRateEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  readonly editTitle = $localize`:@@admin.hourlyRate.editTitle:Edit Hourly Rate`;
  readonly addTitle = $localize`:@@admin.hourlyRate.addTitle:Add Hourly Rate`;
  readonly editSubtitle = $localize`:@@admin.hourlyRate.editSubtitle:Update the hourly rate details`;
  readonly addSubtitle = $localize`:@@admin.hourlyRate.addSubtitle:Create a new staff hourly rate`;
  readonly activeStatusHint = $localize`:@@admin.hourlyRate.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.hourlyRate.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  entryForm: FormGroup = this.fb.group({
    rate: [null, [Validators.required, Validators.min(0.01)]],
    statusActive: [true],
  });

  addedEntries: HourlyRateEntry[] = [];

  get headerTitle(): string {
    return this.mode === HourlyRateModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === HourlyRateModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  get submitLabel(): string {
    return this.mode === HourlyRateModes.Edit ? $localize`:@@common.saveChanges:Save Changes` : $localize`:@@admin.hourlyRate.addHourlyRate:Add Hourly Rate`;
  }

  statusLabel(status: 'active' | 'inactive'): string {
    return status === HourlyRateStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get rateControl() { return this.entryForm.get('rate')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get rateInvalid(): boolean { return this.rateControl.invalid && this.rateControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === HourlyRateModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        rate: this.editItem.rate,
        statusActive: this.editItem.status === HourlyRateStatuses.Active,
      });
      this.addedEntries = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedEntries = [];
    }
  }

  addEntry(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedEntries.push({
      rate: Number(this.rateControl.value),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeEntry(index: number): void { this.addedEntries.splice(index, 1); }

  submit(): void {
    if (this.mode === HourlyRateModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        rate: Number(this.rateControl.value),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedEntries.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          rate: Number(this.rateControl.value),
          status: this.statusControl.value ? 'active' : 'inactive',
        }]);
      } else {
        this.submitted.emit([...this.addedEntries]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedEntries = [];
  }
}
