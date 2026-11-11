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
import type { OwnerEntry } from '../models/risk-owner.model';

import { RiskOwnerModes, RiskOwnerStatuses } from '../constants/risk-owner.constants';

import { RISK_OWNER_ERROR_MESSAGES } from '../constants/risk-owner-messages.constants';

@Component({
  selector: 'app-risk-owner',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './risk-owner.component.html',
  styleUrl: './risk-owner.component.scss',
})
export class RiskOwnerComponent implements OnChanges {
  readonly errorMessages = RISK_OWNER_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: OwnerEntry | null = null;
  @Output() submitted = new EventEmitter<OwnerEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedOwners: OwnerEntry[] = [];

  readonly editTitle = $localize`:@@admin.riskOwner.editTitle:Edit Risk Owner Role`;
  readonly addTitle = $localize`:@@admin.riskOwner.addTitle:Add Risk Owner Role`;
  readonly editSubtitle = $localize`:@@admin.riskOwner.editSubtitle:Update the risk owner role details`;
  readonly addSubtitle = $localize`:@@admin.riskOwner.addSubtitle:Create a new risk owner role`;
  readonly activeStatusHint = $localize`:@@admin.riskOwner.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.riskOwner.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addRiskOwnerLabel = $localize`:@@admin.riskOwner.addRiskOwnerRole:Add Risk Owner Role`;

  get headerTitle(): string {
    return this.mode === RiskOwnerModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === RiskOwnerModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  statusLabel(status: string): string {
    return status === RiskOwnerStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === RiskOwnerModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === RiskOwnerStatuses.Active,
      });
      this.addedOwners = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedOwners = [];
    }
  }

  addOwner(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedOwners.push({
      name: this.nameControl.value.trim(),
      description: (this.descControl.value ?? '').trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeOwner(index: number): void { this.addedOwners.splice(index, 1); }

  submit(): void {
    if (this.mode === RiskOwnerModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        name: this.nameControl.value.trim(),
        description: (this.descControl.value ?? '').trim(),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedOwners.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          name: this.nameControl.value.trim(),
          description: (this.descControl.value ?? '').trim(),
          status: this.statusControl.value ? 'active' : 'inactive',
        }]);
      } else {
        this.submitted.emit([...this.addedOwners]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedOwners = [];
  }
}
