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
import { AreaOfExpertise } from '@/app/features/admin/look-up/areas-of-expertise/models/areas-of-expertise.model';  // ← adjust path
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

interface PendingEntry {
  name:        string;
  description: string;
  isActive:    boolean;
}

@Component({
  selector: 'app-area-of-expertise-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToggleSwitchModule,
    ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './areas-of-expertise.component.html',
  styleUrls:   ['./areas-of-expertise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaOfExpertiseFormComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);

  @Input() item: AreaOfExpertise | null = null;
  @Input() visible = false;

  @Output() save  = new EventEmitter<AreaOfExpertise[]>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  submitting  = signal(false);
  pendingList = signal<PendingEntry[]>([]);

  readonly editTitle = $localize`:@@admin.areaOfExpertise.editTitle:Edit Area of Expertise`;
  readonly addTitle = $localize`:@@admin.areaOfExpertise.addTitle:Add Area of Expertise`;
  readonly editSubtitle = $localize`:@@admin.areaOfExpertise.editSubtitle:Update expertise details`;
  readonly addSubtitle = $localize`:@@admin.areaOfExpertise.addSubtitle:Create a new area of expertise`;
  readonly activeStatusHint = $localize`:@@admin.areaOfExpertise.activeStatusHint:Active — visible in dropdowns and reports.`;
  readonly inactiveStatusHint = $localize`:@@admin.areaOfExpertise.inactiveStatusHint:Inactive — hidden from selection lists.`;

  readonly pendingCount = computed(() => this.pendingList().length);

  get isEditMode(): boolean { return !!this.item?.id; }
  get nameLen():    number  { return this.form?.get('name')?.value?.length ?? 0; }
  get descLen():    number  { return this.form?.get('description')?.value?.length ?? 0; }

  private updatedSuccessMessage(name: string): string {
    return $localize`:@@admin.areaOfExpertise.updatedSuccess:"${name}" has been successfully updated.`;
  }

  private addedSuccessMessage(name: string): string {
    return $localize`:@@admin.areaOfExpertise.addedSuccess:"${name}" has been successfully added.`;
  }

  private multipleAddedSuccessMessage(count: number): string {
    return $localize`:@@admin.areaOfExpertise.multipleAddedSuccess:${count} areas of expertise have been successfully added.`;
  }

  readonly submitButtonLabel = computed(() => {
    if (this.isEditMode) { return $localize`:@@common.saveChanges:Save Changes`; }
    const count = this.pendingCount();

    return count > 1
      ? $localize`:@@admin.areaOfExpertise.addMultiple:${count} Areas of Expertise`
      : $localize`:@@admin.areaOfExpertise.addArea:Add Area of Expertise`;
  });

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
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
        const payload: AreaOfExpertise = {
          id:          this.item!.id,
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   this.item!.createdAt,
          updatedAt:   new Date(),
        };
        this.submitting.set(false);
         this.toast.success(this.updatedSuccessMessage(payload.name));
               this.save.emit([payload]);
      }, 400);

    } else if (this.pendingList().length > 0) {
      this.submitting.set(true);
      setTimeout(() => {
        const now = new Date();
        const payloads: AreaOfExpertise[] = this.pendingList().map(entry => ({
          id:          crypto.randomUUID(),
          name:        entry.name,
          description: entry.description || undefined,
          isActive:    entry.isActive,
          createdAt:   now,
          updatedAt:   now,
        }));
        this.submitting.set(false);
        this.toast.success(payloads.length > 1
            ? this.multipleAddedSuccessMessage(payloads.length)
            : this.addedSuccessMessage(payloads[0].name));

        
        this.save.emit(payloads);
      }, 400);

    } else {
      this.form.markAllAsTouched();
      if (this.form.invalid) return;

      this.submitting.set(true);
      setTimeout(() => {
        const v = this.form.getRawValue();
        const now = new Date();
        const payload: AreaOfExpertise = {
          id:          crypto.randomUUID(),
          name:        v.name.trim(),
          description: v.description?.trim() || undefined,
          isActive:    v.isActive,
          createdAt:   now,
          updatedAt:   now,
        };
        this.submitting.set(false);
         this.toast.success(this.addedSuccessMessage(payload.name));
       
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