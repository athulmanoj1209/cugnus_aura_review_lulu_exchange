import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { SamplingMethodologyEntry } from '../models/sampling-methodology.model';

import { SamplingMethodologyModes, SamplingMethodologyStatuses } from '../constants/sampling-methodology.constants';

import { SAMPLING_METHODOLOGY_ERROR_MESSAGES } from '../constants/sampling-methodology-messages.constants';

@Component({
  selector: 'app-sampling-methodology',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './sampling-methodology.component.html',
  styleUrl: './sampling-methodology.component.scss',
})
export class SamplingMethodologyComponent implements OnChanges {
  readonly errorMessages = SAMPLING_METHODOLOGY_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: SamplingMethodologyEntry | null = null;
  @Output() submitted = new EventEmitter<SamplingMethodologyEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedEntries: SamplingMethodologyEntry[] = [];
  readonly editTitle = $localize`:@@admin.samplingMethodology.editTitle:Edit Sampling Methodology`;
  readonly addTitle = $localize`:@@admin.samplingMethodology.addTitle:Add Sampling Methodology`;
  readonly editSubtitle = $localize`:@@admin.samplingMethodology.editSubtitle:Update the sampling methodology details`;
  readonly addSubtitle = $localize`:@@admin.samplingMethodology.addSubtitle:Create a new sampling methodology`;
  readonly activeStatusHint = $localize`:@@admin.samplingMethodology.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.samplingMethodology.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addSamplingMethodologyLabel = $localize`:@@admin.samplingMethodology.addSamplingMethodology:Add Sampling Methodology`;

  get headerTitle(): string {
    return this.mode === SamplingMethodologyModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === SamplingMethodologyModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  statusLabel(status: string): string {
    return status === SamplingMethodologyStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === SamplingMethodologyModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === SamplingMethodologyStatuses.Active,
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
      name: this.nameControl.value.trim(),
      description: (this.descControl.value ?? '').trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeEntry(index: number): void { this.addedEntries.splice(index, 1); }

  submit(): void {
    if (this.mode === SamplingMethodologyModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        name: this.nameControl.value.trim(),
        description: (this.descControl.value ?? '').trim(),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedEntries.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          name: this.nameControl.value.trim(),
          description: (this.descControl.value ?? '').trim(),
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
