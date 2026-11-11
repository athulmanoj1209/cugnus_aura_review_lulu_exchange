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
import { UppercaseDirective } from '@/app/shared/directives/uppercase.directive';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import type { FrameworkEntry } from '../models/applicable-framework.model';

import { ApplicableFrameworkModes, ApplicableFrameworkStatuses } from '../constants/applicable-framework.constants';

import { APPLICABLE_FRAMEWORK_ERROR_MESSAGES } from '../constants/applicable-framework-messages.constants';

@Component({
  selector: 'app-applicable-framework',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, UppercaseDirective, DrawIconComponent],
  templateUrl: './applicable-framework.component.html',
  styleUrl: './applicable-framework.component.scss',
})
export class ApplicableFrameworkComponent implements OnChanges {
  readonly errorMessages = APPLICABLE_FRAMEWORK_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: FrameworkEntry | null = null;
  @Output() submitted = new EventEmitter<FrameworkEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_-]+$/)]],
    description: [''],
    version: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s._-]+$/)]],
    issuingAuthority: ['', [Validators.required]],
    statusActive: [true],
  });

  addedEntries: FrameworkEntry[] = [];

  readonly editTitle = $localize`:@@admin.applicableFramework.editTitle:Edit Framework`;
  readonly addTitle = $localize`:@@admin.applicableFramework.addTitle:Add Applicable Framework`;
  readonly editSubtitle = $localize`:@@admin.applicableFramework.editSubtitle:Update the framework details`;
  readonly addSubtitle = $localize`:@@admin.applicableFramework.addSubtitle:Register a new regulatory or professional framework`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly addToListLabel = $localize`:@@admin.applicableFramework.addToList:+ Add to List`;
  readonly addFrameworkLabel = $localize`:@@admin.applicableFramework.addFramework:Add Framework`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly activeStatusHint = $localize`:@@admin.applicableFramework.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.applicableFramework.inactiveStatusHint:Inactive — hidden from dropdowns and reports`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get nameControl() { return this.entryForm.get('name')!; }
  get codeControl() { return this.entryForm.get('code')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get versionControl() { return this.entryForm.get('version')!; }
  get authorityControl() { return this.entryForm.get('issuingAuthority')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }

  get nameInvalid() { return this.nameControl.invalid && this.nameControl.touched; }
  get codeInvalid() { return this.codeControl.invalid && this.codeControl.touched; }
  get versionInvalid() { return this.versionControl.invalid && this.versionControl.touched; }
  get authorityInvalid() { return this.authorityControl.invalid && this.authorityControl.touched; }

  onNameBlur(): void { this.nameControl.setValue((this.nameControl.value ?? '').trim()); }
  onVersionBlur(): void { this.versionControl.setValue((this.versionControl.value ?? '').trim()); }
  onAuthorityBlur(): void { this.authorityControl.setValue((this.authorityControl.value ?? '').trim()); }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === ApplicableFrameworkModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        code: this.editItem.code,
        description: this.editItem.description,
        version: this.editItem.version,
        issuingAuthority: this.editItem.issuingAuthority,
        statusActive: this.editItem.status === ApplicableFrameworkStatuses.Active,
      });
      this.addedEntries = [];
    } else if (changes['mode']?.currentValue === 'add') {
      this.entryForm.reset({ statusActive: true });
      this.addedEntries = [];
    }
  }

  addEntry(): void {
    if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
    this.addedEntries.push(this.buildEntry());
    this.entryForm.reset({ statusActive: true });
  }

  removeEntry(index: number): void { this.addedEntries.splice(index, 1); }

  submit(): void {
    if (this.mode === ApplicableFrameworkModes.Edit) {
      if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
      this.submitted.emit([this.buildEntry()]);
      this.reset();
    } else {
      if (this.addedEntries.length === 0) {
        if (this.entryForm.invalid) { this.entryForm.markAllAsTouched(); return; }
        this.submitted.emit([this.buildEntry()]);
      } else {
        this.submitted.emit([...this.addedEntries]);
      }
      this.reset();
    }
  }

  cancel(): void { this.reset(); this.cancelled.emit(); }

  private buildEntry(): FrameworkEntry {
    return {
      name: this.nameControl.value.trim(),
      code: this.codeControl.value.trim().toUpperCase(),
      description: (this.descControl.value ?? '').trim(),
      version: this.versionControl.value.trim(),
      issuingAuthority: this.authorityControl.value.trim(),
      status: this.statusControl.value ? 'active' : 'inactive',
    };
  }

  private reset(): void {
    this.entryForm.reset({ statusActive: true });
    this.addedEntries = [];
  }

  get headerTitle(): string {
    return this.mode === ApplicableFrameworkModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === ApplicableFrameworkModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  get submitLabel(): string {
    return this.mode === ApplicableFrameworkModes.Edit ? this.saveChangesLabel : this.addFrameworkLabel;
  }

  statusLabel(status: 'active' | 'inactive'): string {
    return status === ApplicableFrameworkStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }
}
