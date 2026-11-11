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
import { EvidenceType } from '@/app/features/admin/look-up/evidence-type/models/evidence-type.model';  // ← adjust path
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

interface PendingEntry {
  name:        string;
  description: string;
  isActive:    boolean;
}

@Component({
  selector: 'app-evidence-type-form',
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
  templateUrl: './evidence-type.component.html',
  styleUrls:   ['./evidence-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvidenceTypeFormComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);

  @Input() item: EvidenceType | null = null;
  @Input() visible = false;

  @Output() save  = new EventEmitter<EvidenceType[]>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  submitting  = signal(false);
  pendingList = signal<PendingEntry[]>([]);
    private readonly toast = inject(ToastService);

  readonly pendingCount = computed(() => this.pendingList().length);

  readonly editTitle = $localize`:@@admin.evidenceType.editTitle:Edit Evidence Type`;
  readonly addTitle = $localize`:@@admin.evidenceType.addTitle:Add Evidence Type`;
  readonly editSubtitle = $localize`:@@admin.evidenceType.editSubtitle:Update evidence type details`;
  readonly addSubtitle = $localize`:@@admin.evidenceType.addSubtitle:Create a new type of evidence`;
  readonly activeStatusHint = $localize`:@@admin.evidenceType.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.evidenceType.inactiveStatusHint:Inactive — hidden from selection lists.`;
  readonly removeLabel = $localize`:@@common.remove:Remove`;

  get headerTitle(): string {
    return this.isEditMode ? this.editTitle : this.addTitle;
  }

  get headerSubtitle(): string {
    return this.isEditMode ? this.editSubtitle : this.addSubtitle;
  }

  addMultipleLabel(count: number): string {
    return $localize`:@@admin.evidenceType.addMultiple:${count} Evidence Types`;
  }

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  private updatedMessage(name: string): string {
    return $localize`:@@admin.evidenceType.updated:"${name}" has been successfully updated.`;
  }

  private addedMessage(name: string): string {
    return $localize`:@@admin.evidenceType.added:"${name}" has been successfully added.`;
  }

  private multipleAddedMessage(count: number): string {
    return $localize`:@@admin.evidenceType.multipleAdded:${count} evidence types have been successfully added.`;
  }

  get isEditMode(): boolean { return !!this.item?.id; }
  get nameLen():    number  { return this.form?.get('name')?.value?.length ?? 0; }
  get descLen():    number  { return this.form?.get('description')?.value?.length ?? 0; }

  ngOnInit(): void { if (!this.form) this.initForm(); }
  ngOnChanges(): void { if (this.visible) this.initForm(); }

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
        const payload: EvidenceType = {
          id: this.item!.id, name: v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive: v.isActive, createdAt: this.item!.createdAt, updatedAt: new Date(),
        };
        this.submitting.set(false);
         this.toast.success(this.updatedMessage(payload.name));
        this.save.emit([payload]);
      }, 400);

    } else if (this.pendingList().length > 0) {
      this.submitting.set(true);
      setTimeout(() => {
        const now = new Date();
        const payloads: EvidenceType[] = this.pendingList().map(e => ({
          id: crypto.randomUUID(), name: e.name,
          description: e.description || undefined,
          isActive: e.isActive, createdAt: now, updatedAt: now,
        }));
        this.submitting.set(false);
         this.toast.success(payloads.length > 1
          ? this.multipleAddedMessage(payloads.length)
          : this.addedMessage(payloads[0].name));
        this.save.emit(payloads);
      }, 400);

    } else {
      this.form.markAllAsTouched();
      if (this.form.invalid) return;
      this.submitting.set(true);
      setTimeout(() => {
        const v = this.form.getRawValue();
        const now = new Date();
        const payload: EvidenceType = {
          id: crypto.randomUUID(), name: v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive: v.isActive, createdAt: now, updatedAt: now,
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