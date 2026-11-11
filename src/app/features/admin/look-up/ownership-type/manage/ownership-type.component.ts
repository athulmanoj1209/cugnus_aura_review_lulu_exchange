import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { OwnershipType } from '@/app/features/admin/look-up/ownership-type/models/ownership-type.model';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

interface PendingEntry {
  name:        string;
  description: string;
  isActive:    boolean;
}

@Component({
  selector: 'app-ownership-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,DrawIconComponent
  ],
  templateUrl: './ownership-type.component.html',
  styleUrls:   ['./ownership-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnershipTypeFormComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input() item: OwnershipType | null = null;
  @Input() visible = false;

  @Output() save  = new EventEmitter<OwnershipType[]>();
  @Output() close = new EventEmitter<void>();
  private readonly toast = inject(ToastService);

  form!: FormGroup;
  submitting  = signal(false);
  pendingList = signal<PendingEntry[]>([]);

  readonly pendingCount = computed(() => this.pendingList().length);

  readonly closeLabel = $localize`:@@common.close:Close`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;
  readonly editTitle = $localize`:@@admin.ownershipType.editTitle:Edit Ownership Type`;
  readonly addTitle = $localize`:@@admin.ownershipType.addTitle:Add Ownership Type`;
  readonly editSubtitle = $localize`:@@admin.ownershipType.editSubtitle:Update ownership classification details`;
  readonly addSubtitle = $localize`:@@admin.ownershipType.addSubtitle:Create a new ownership classification`;
  readonly activeStatusHint = $localize`:@@admin.ownershipType.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.ownershipType.inactiveStatusHint:Inactive — hidden from selection lists.`;
  readonly addToListLabel = $localize`:@@common.addToList:Add to List`;
  readonly pendingSubmissionLabel = $localize`:@@common.pendingSubmission:Pending Submission`;
  readonly saveChangesLabel = $localize`:@@common.saveChanges:Save Changes`;
  readonly addOwnershipTypeLabel = $localize`:@@admin.ownershipType.addOwnershipType:Add Ownership Type`;

  get headerTitle(): string {
    return this.isEditMode ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.isEditMode ? this.editSubtitle : this.addSubtitle;
  }

  addMultipleLabel(count: number): string {
    return $localize`:@@admin.ownershipType.addMultiple:${count} Ownership Types`;
  }

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get isEditMode(): boolean { return !!this.item?.id; }
  get nameLen():    number  { return this.form?.get('name')?.value?.length ?? 0; }
  get descLen():    number  { return this.form?.get('description')?.value?.length ?? 0; }

  ngOnInit(): void {
    if (!this.form) this.initForm();
  }

  ngOnChanges(): void {
    if (this.visible) this.initForm();
  }

  private initForm(): void {
    this.submitting.set(false);
    this.pendingList.set([]);

    this.form = this.fb.group({
      name:        [this.item?.name        ?? '', [Validators.required, Validators.maxLength(100)]],
      description: [this.item?.description ?? '', [Validators.maxLength(500)]],
      isActive:    [this.item?.isActive    ?? true],
    });
  }

  /** Stage current form entry into the pending list (add mode only) */
  addToList(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.pendingList.update(list => [
      ...list,
      { name: v.name.trim(), description: v.description?.trim() || '', isActive: v.isActive },
    ]);

    this.form.reset({ name: '', description: '', isActive: true });
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  removePending(i: number): void {
    this.pendingList.update(list => list.filter((_, idx) => idx !== i));
  }

  submit(): void {
    if (this.isEditMode) {
      this.form.markAllAsTouched();
      if (this.form.invalid) return;

      this.submitting.set(true);
      setTimeout(() => {
        const v = this.form.getRawValue();
        const payload: OwnershipType = {
          id:          this.item!.id,
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   this.item!.createdAt,
          updatedAt:   new Date(),
        };
        this.submitting.set(false);
         this.toast.success(`"${v.name}" has been successfully updated.`);
        this.save.emit([payload]);
      }, 400);

    } else if (this.pendingList().length > 0) {
      // Submit all staged items
      this.submitting.set(true);
      setTimeout(() => {
        const now = new Date();
        const payloads: OwnershipType[] = this.pendingList().map(entry => ({
          id:          crypto.randomUUID(),
          name:        entry.name,
          description: entry.description || undefined,
          isActive:    entry.isActive,
          createdAt:   now,
          updatedAt:   now,
        }));
        this.submitting.set(false);
        this.toast.success(payloads.length > 1
            ? `${payloads.length} areas of expertise have been successfully added.`
            : `"${payloads[0].name}" has been successfully added.`);
        this.save.emit(payloads);
      }, 400);

    } else {
      // No staged items — submit current form directly (single entry)
      this.form.markAllAsTouched();
      if (this.form.invalid) return;

      this.submitting.set(true);
      setTimeout(() => {
        const v = this.form.getRawValue();
        const now = new Date();
        const payload: OwnershipType = {
          id:          crypto.randomUUID(),
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   now,
          updatedAt:   now,
        };
        this.submitting.set(false);
         this.toast.success(`"${payload.name}" has been successfully added.`);
        this.save.emit([payload]);
      }, 400);
    }
  }

  onClose(): void { this.close.emit(); }

  invalid(field: string): boolean {
    const c = this.form?.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }
}