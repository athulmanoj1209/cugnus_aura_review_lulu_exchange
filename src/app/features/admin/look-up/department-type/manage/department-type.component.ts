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
import type { DepartmentTypeEntry } from '../models/department-type.model';

import { DepartmentTypeModes, DepartmentTypeStatuses } from '../constants/department-type.constants';

import { DEPARTMENT_TYPE_ERROR_MESSAGES } from '../constants/department-type-messages.constants';

@Component({
  selector: 'app-department-type',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './department-type.component.html',
  styleUrl: './department-type.component.scss',
})
export class DepartmentTypeComponent implements OnChanges {
  readonly errorMessages = DEPARTMENT_TYPE_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: DepartmentTypeEntry | null = null;
  @Output() submitted = new EventEmitter<DepartmentTypeEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedEntries: DepartmentTypeEntry[] = [];

  readonly editTitle = $localize`:@@admin.departmentType.editTitle:Edit Department Type`;
  readonly addTitle = $localize`:@@admin.departmentType.addTitle:Add Department Type`;
  readonly editSubtitle = $localize`:@@admin.departmentType.editSubtitle:Update the department type details`;
  readonly addSubtitle = $localize`:@@admin.departmentType.addSubtitle:Create a new department type classification`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly addToListLabel = $localize`:@@admin.departmentType.addToList:+ Add to List`;
  readonly addDepartmentTypeLabel = $localize`:@@admin.departmentType.addDepartmentType:Add Department Type`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly activeStatusHint = $localize`:@@admin.departmentType.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.departmentType.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get headerTitle(): string {
    return this.mode === DepartmentTypeModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === DepartmentTypeModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  get submitLabel(): string {
    return this.mode === DepartmentTypeModes.Edit ? this.saveChangesLabel : this.addDepartmentTypeLabel;
  }

  statusLabel(status: 'active' | 'inactive'): string {
    return status === DepartmentTypeStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === DepartmentTypeModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === DepartmentTypeStatuses.Active,
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
    if (this.mode === DepartmentTypeModes.Edit) {
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
