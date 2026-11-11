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
import type { FrequencyEntry } from '../models/audit-frequency.model';

import { AuditFrequencyModes, AuditFrequencyStatuses } from '../constants/audit-frequency.constants';

import { AUDIT_FREQUENCY_ERROR_MESSAGES } from '../constants/audit-frequency-messages.constants';

@Component({
  selector: 'app-audit-frequency',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './audit-frequency.component.html',
  styleUrl: './audit-frequency.component.scss',
})
export class AuditFrequencyComponent implements OnChanges {
  readonly errorMessages = AUDIT_FREQUENCY_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: FrequencyEntry | null = null;
  @Output() submitted = new EventEmitter<FrequencyEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedEntries: FrequencyEntry[] = [];

  readonly editTitle = $localize`:@@admin.auditFrequency.editTitle:Edit Audit Frequency`;
  readonly addTitle = $localize`:@@admin.auditFrequency.addTitle:Add Audit Frequency`;
  readonly editSubtitle = $localize`:@@admin.auditFrequency.editSubtitle:Update the audit frequency details`;
  readonly addSubtitle = $localize`:@@admin.auditFrequency.addSubtitle:Create a new audit frequency schedule`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly addToListLabel = $localize`:@@admin.auditFrequency.addToList:+ Add to List`;
  readonly addAuditFrequencyLabel = $localize`:@@admin.auditFrequency.addAuditFrequency:Add Audit Frequency`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly activeStatusHint = $localize`:@@admin.auditFrequency.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.auditFrequency.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get headerTitle(): string {
    return this.mode === AuditFrequencyModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === AuditFrequencyModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  get submitLabel(): string {
    return this.mode === AuditFrequencyModes.Edit ? this.saveChangesLabel : this.addAuditFrequencyLabel;
  }

  statusLabel(status: 'active' | 'inactive'): string {
    return status === AuditFrequencyStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === AuditFrequencyModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === AuditFrequencyStatuses.Active,
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
    if (this.mode === AuditFrequencyModes.Edit) {
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
