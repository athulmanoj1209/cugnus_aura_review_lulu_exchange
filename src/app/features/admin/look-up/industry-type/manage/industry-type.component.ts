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
import { IndustryType } from '@/app/features/admin/look-up/industry-type/models/industry-type.model';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

interface PendingEntry {
  name:        string;
  description: string;
  isActive:    boolean;
}

@Component({
  selector: 'app-industry-type-form',
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
  templateUrl: './industry-type.component.html',
  styleUrls:   ['./industry-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndustryTypeFormComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input() item: IndustryType | null = null;
  @Input() visible = false;

  @Output() save  = new EventEmitter<IndustryType[]>();
  @Output() close = new EventEmitter<void>();
   private readonly toast = inject(ToastService);

  form!: FormGroup;
  submitting  = signal(false);
  pendingList = signal<PendingEntry[]>([]);

  readonly pendingCount = computed(() => this.pendingList().length);

  readonly editTitle = $localize`:@@admin.industryType.editTitle:Edit Industry Type`;
  readonly addTitle = $localize`:@@admin.industryType.addTitle:Add Industry Type`;
  readonly editSubtitle = $localize`:@@admin.industryType.editSubtitle:Update industry classification details`;
  readonly addSubtitle = $localize`:@@admin.industryType.addSubtitle:Create a new industry classification`;
  readonly activeStatusHint = $localize`:@@admin.industryType.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.industryType.inactiveStatusHint:Inactive — hidden from selection lists.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get isEditMode(): boolean { return !!this.item?.id; }
  get nameLen():    number  { return this.form?.get('name')?.value?.length ?? 0; }
  get descLen():    number  { return this.form?.get('description')?.value?.length ?? 0; }

  get headerTitle(): string {
    return this.isEditMode ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.isEditMode ? this.editSubtitle : this.addSubtitle;
  }

  addMultipleLabel(count: number): string {
    return $localize`:@@admin.industryType.addMultiple:${count} Industry Types`;
  }

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  private updatedMessage(name: string): string {
    return $localize`:@@admin.industryType.updated:"${name}" has been successfully updated.`;
  }

  private addedMessage(name: string): string {
    return $localize`:@@admin.industryType.added:"${name}" has been successfully added.`;
  }

  private multipleAddedMessage(count: number): string {
    return $localize`:@@admin.industryType.multipleAdded:${count} industry types have been successfully added.`;
  }

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
        const payload: IndustryType = {
          id:          this.item!.id,
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   this.item!.createdAt,
          updatedAt:   new Date(),
        };
        this.submitting.set(false);
         this.toast.success(this.updatedMessage(v.name));
        this.save.emit([payload]);
      }, 400);

    } else if (this.pendingList().length > 0) {
      // Submit all staged items
      this.submitting.set(true);
      setTimeout(() => {
        const now = new Date();
        const payloads: IndustryType[] = this.pendingList().map(entry => ({
          id:          crypto.randomUUID(),
          name:        entry.name,
          description: entry.description || undefined,
          isActive:    entry.isActive,
          createdAt:   now,
          updatedAt:   now,
        }));
        this.submitting.set(false);
         this.toast.success(payloads.length > 1
            ? this.multipleAddedMessage(payloads.length)
            : this.addedMessage(payloads[0].name));
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
        const payload: IndustryType = {
          id:          crypto.randomUUID(),
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   now,
          updatedAt:   now,
        };
        this.submitting.set(false);
         this.toast.success(this.addedMessage(payload.name));
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