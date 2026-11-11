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
import type { AuditModeEntry } from '../models/audit-mode.model';

import { AuditModeModes, AuditModeStatuses } from '../constants/audit-mode.constants';

import { AUDIT_MODE_ERROR_MESSAGES } from '../constants/audit-mode-messages.constants';

@Component({
  selector: 'app-audit-mode',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, TooltipModule, DividerModule, TagModule, ToggleSwitchModule, DrawIconComponent],
  templateUrl: './audit-mode.component.html',
  styleUrl: './audit-mode.component.scss',
})
export class AuditModeComponent implements OnChanges {
  readonly errorMessages = AUDIT_MODE_ERROR_MESSAGES;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() editItem: AuditModeEntry | null = null;
  @Output() submitted = new EventEmitter<AuditModeEntry[]>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  entryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    statusActive: [true],
  });

  addedEntries: AuditModeEntry[] = [];

  readonly editTitle = $localize`:@@admin.auditMode.editTitle:Edit Audit Mode`;
  readonly addTitle = $localize`:@@admin.auditMode.addTitle:Add Audit Mode`;
  readonly editSubtitle = $localize`:@@admin.auditMode.editSubtitle:Update the audit mode details`;
  readonly addSubtitle = $localize`:@@admin.auditMode.addSubtitle:Create a new audit delivery mode`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly addToListLabel = $localize`:@@admin.auditMode.addToList:+ Add to List`;
  readonly addAuditModeLabel = $localize`:@@admin.auditMode.addAuditMode:Add Audit Mode`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly activeStatusHint = $localize`:@@admin.auditMode.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.auditMode.inactiveStatusHint:Inactive — hidden from dropdowns and reports.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get headerTitle(): string {
    return this.mode === AuditModeModes.Edit ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.mode === AuditModeModes.Edit ? this.editSubtitle : this.addSubtitle;
  }

  get submitLabel(): string {
    return this.mode === AuditModeModes.Edit ? this.saveChangesLabel : this.addAuditModeLabel;
  }

  statusLabel(status: 'active' | 'inactive'): string {
    return status === AuditModeStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get nameControl() { return this.entryForm.get('name')!; }
  get descControl() { return this.entryForm.get('description')!; }
  get statusControl() { return this.entryForm.get('statusActive')!; }
  get nameInvalid(): boolean { return this.nameControl.invalid && this.nameControl.touched; }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode === AuditModeModes.Edit && this.editItem) {
      this.entryForm.patchValue({
        name: this.editItem.name,
        description: this.editItem.description,
        statusActive: this.editItem.status === AuditModeStatuses.Active,
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
    if (this.mode === AuditModeModes.Edit) {
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
