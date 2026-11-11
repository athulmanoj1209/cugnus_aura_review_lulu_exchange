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
import type { CategoryEntry } from '../models/risk-category.model';

import { RiskCategoryModes, RiskCategoryStatuses } from '../constants/risk-category.constants';

import { RISK_CATEGORY_ERROR_MESSAGES } from '../constants/risk-category-messages.constants';

@Component({
  selector: 'app-risk-category',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './risk-category.component.html',
  styleUrl: './risk-category.component.scss',
})
export class RiskCategoryComponent implements OnChanges {
  readonly errorMessages = RISK_CATEGORY_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: CategoryEntry | null = null;
  @Output() submitted = new EventEmitter<CategoryEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedCategories: CategoryEntry[] = [];
  readonly editTitle = $localize`:@@admin.riskCategory.editTitle:Edit Risk Category`;
  readonly addTitle = $localize`:@@admin.riskCategory.addTitle:Add Risk Category`;
  readonly editSubtitle = $localize`:@@admin.riskCategory.editSubtitle:Update the risk category details`;
  readonly addSubtitle = $localize`:@@admin.riskCategory.addSubtitle:Create a new risk category classification`;
  readonly activeStatusHint = $localize`:@@admin.riskCategory.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.riskCategory.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addRiskCategoryLabel = $localize`:@@admin.riskCategory.addRiskCategory:Add Risk Category`;

  get headerTitle(): string {
    return this.mode === RiskCategoryModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === RiskCategoryModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  statusLabel(status: string): string {
    return status === RiskCategoryStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === RiskCategoryModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === RiskCategoryStatuses.Active,
      });
      this.addedCategories = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedCategories = [];
    }
  }

  addCategory(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedCategories.push({
      name: this.nameControl.value.trim(),
      description: (this.descControl.value ?? '').trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    });
    this.entryForm.reset({ statusActive: true });
  }

  removeCategory(index: number): void { this.addedCategories.splice(index, 1); }

  submit(): void {
    if (this.mode === RiskCategoryModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([{
        name: this.nameControl.value.trim(),
        description: (this.descControl.value ?? '').trim(),
        status: this.statusControl.value ? 'active' : 'inactive',
      }]);
      this.reset();
    } else {
      if (this.addedCategories.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([{
          name: this.nameControl.value.trim(),
          description: (this.descControl.value ?? '').trim(),
          status: this.statusControl.value ? 'active' : 'inactive',
        }]);
      } else {
        this.submitted.emit([...this.addedCategories]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedCategories = [];
  }
}
