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
import type { RatingEntry } from '../models/risk-rating.model';

import { RiskRatingModes, RiskRatingStatuses } from '../constants/risk-rating.constants';

import { RISK_RATING_ERROR_MESSAGES } from '../constants/risk-rating-messages.constants';

@Component({
  selector: 'app-risk-rating',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './risk-rating.component.html',
  styleUrl: './risk-rating.component.scss',
})
export class RiskRatingComponent implements OnChanges {
  readonly errorMessages = RISK_RATING_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: RatingEntry | null = null;
  @Output() submitted = new EventEmitter<RatingEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedRatings: RatingEntry[] = [];

  readonly editTitle = $localize`:@@admin.riskRating.editTitle:Edit Risk Rating`;
  readonly addTitle = $localize`:@@admin.riskRating.addTitle:Add Risk Rating`;
  readonly editSubtitle = $localize`:@@admin.riskRating.editSubtitle:Update the risk rating details`;
  readonly addSubtitle = $localize`:@@admin.riskRating.addSubtitle:Create a new risk rating classification`;
  readonly activeStatusHint = $localize`:@@admin.riskRating.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.riskRating.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addRiskRatingLabel = $localize`:@@admin.riskRating.addRiskRating:Add Risk Rating`;

  get headerTitle(): string {
    return this.mode === RiskRatingModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === RiskRatingModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  statusLabel(status: string): string {
    return status === RiskRatingStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === RiskRatingModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === RiskRatingStatuses.Active,
      });
      this.addedRatings = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedRatings = [];
    }
  }

  addRating(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedRatings.push({
      name: this.nameControl.value.trim(),
      description: (this.descControl.value ?? '').trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeRating(index: number): void { this.addedRatings.splice(index, 1); }

  submit(): void {
    if (this.mode === RiskRatingModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        name: this.nameControl.value.trim(),
        description: (this.descControl.value ?? '').trim(),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedRatings.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          name: this.nameControl.value.trim(),
          description: (this.descControl.value ?? '').trim(),
          status: this.statusControl.value ? 'active' : 'inactive',
        }]);
      } else {
        this.submitted.emit([...this.addedRatings]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedRatings = [];
  }
}
