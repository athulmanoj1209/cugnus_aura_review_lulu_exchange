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
import type { StatusEntry } from '../models/risk-status.model';

import { RiskStatusModes, RiskStatusStatuses } from '../constants/risk-status.constants';

import { RISK_STATUS_ERROR_MESSAGES } from '../constants/risk-status-messages.constants';

@Component({
  selector: 'app-risk-status',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './risk-status.component.html',
  styleUrl: './risk-status.component.scss',
})
export class RiskStatusComponent implements OnChanges {
  readonly errorMessages = RISK_STATUS_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: StatusEntry | null = null;
  @Output() submitted = new EventEmitter<StatusEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedStatuses: StatusEntry[] = [];
  readonly editTitle = $localize`:@@admin.riskStatus.editTitle:Edit Risk Status`;
  readonly addTitle = $localize`:@@admin.riskStatus.addTitle:Add Risk Status`;
  readonly editSubtitle = $localize`:@@admin.riskStatus.editSubtitle:Update the risk status details`;
  readonly addSubtitle = $localize`:@@admin.riskStatus.addSubtitle:Create a new risk status classification`;
  readonly activeStatusHint = $localize`:@@admin.riskStatus.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.riskStatus.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addRiskStatusLabel = $localize`:@@admin.riskStatus.addRiskStatus:Add Risk Status`;

  get headerTitle(): string {
    return this.mode === RiskStatusModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === RiskStatusModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  statusLabel(status: string): string {
    return status === RiskStatusStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === RiskStatusModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === RiskStatusStatuses.Active,
      });
      this.addedStatuses = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedStatuses = [];
    }
  }

  addStatus(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedStatuses.push({
      name: this.nameControl.value.trim(),
      description: (this.descControl.value ?? '').trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeStatus(index: number): void { this.addedStatuses.splice(index, 1); }

  submit(): void {
    if (this.mode === RiskStatusModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        name: this.nameControl.value.trim(),
        description: (this.descControl.value ?? '').trim(),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedStatuses.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          name: this.nameControl.value.trim(),
          description: (this.descControl.value ?? '').trim(),
          status: this.statusControl.value ? 'active' : 'inactive',
        }]);
      } else {
        this.submitted.emit([...this.addedStatuses]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedStatuses = [];
  }
}
