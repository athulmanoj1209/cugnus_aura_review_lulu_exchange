import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import type { RfiLibraryItem, RfiPriority, RfiCategory, RfiLibraryStatus } from '@/app/features/audits/libraries/rfi-library/models/rfi-library-list.model';
import type { ScopeLibraryItem } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { RfiLibraryDrawerData, RfiLibraryDrawerResult } from '@/app/features/audits/libraries/rfi-library/models/rfi-library.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import {
  rfiLibraryDivisionOptionsForCompany,
  rfiLibrarySubDivisionOptionsForDivision,
} from '@/app/features/audits/libraries/rfi-library/rfi-library-static-data';
import { divisionHasSubDivisions } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  RFI_LIBRARY_FORM_ID_PREFIX,
  RfiLibraryApprovalActions,
  RfiLibraryDrawerModes,
  RfiLibraryStatuses,
  type RfiLibraryDrawerMode,
} from '../constants/rfi-library.constants';
import { RFI_LIBRARY_CATEGORY_OPTIONS, RFI_LIBRARY_PRIORITY_OPTIONS, RFI_LIBRARY_DRAWER_TITLES } from '../constants/rfi-library-labels.constants';
import {
  RFI_LIBRARY_CONFIRM_DIALOGS,
  RFI_LIBRARY_TOAST_MESSAGES,
} from '../constants/rfi-library-messages.constants';

@Component({
  selector: 'app-rfi-library',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DividerModule,
    TagModule,
    TooltipModule,
    ToastModule,
    DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './rfi-library.component.html',
  styleUrl: './rfi-library.component.scss',
})
export class RfiLibraryComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<RfiLibraryDrawerResult, RfiLibraryDrawerData>;
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as RfiLibraryDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);

  readonly RfiLibraryDrawerModes = RfiLibraryDrawerModes;

  readonly mode: RfiLibraryDrawerMode = this.data?.mode ?? RfiLibraryDrawerModes.Add;
  readonly approvalMode: boolean = this.data?.approvalMode ?? false;
  readonly requestStatus: string = this.data?.requestStatus ?? RfiLibraryStatuses.PendingReview;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === RfiLibraryStatuses.PendingReview;
  rfiItem: RfiLibraryItem | null = this.data?.rfiItem ?? null;
  allScopes: ScopeLibraryItem[] = this.data?.allScopes ?? [];

  /* ── Reactive form ─── */
  form = new FormGroup({
    company: new FormControl<string | null>(null, [Validators.required]),
    division: new FormControl<string | null>(null, [Validators.required]),
    // Required (add mode) when the division has sub-divisions; empty means the
    // RFI uses the division's own scopes. See syncSubDivisionRequirement().
    subDivision: new FormControl<string | null>(null),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl<RfiPriority | null>(null, [Validators.required]),
    category: new FormControl<RfiCategory | null>(null, [Validators.required]),
    // Optional — an RFI library item doesn't have to be linked to a scope.
    scopeId: new FormControl(''),
    subScopeId: new FormControl(''),
    tagInput: new FormControl(''),
    questionInput: new FormControl(''),
    approverNotes: new FormControl(''),
  });

  tags: string[] = [];
  questions: string[] = [];
  submitted = false;
  approvalNotesSubmitted = false;

  /* ── Company / Division / Sub-Division options — sourced from
   * rfi-library-static-data.ts so this drawer's cascade matches the real
   * companies/divisions/sub-divisions used across the app. ─── */
  get companyOptions() {
    const currentId = this.form.get('company')?.value;
    return this.companyDataService.all
      .filter(c => !c.blocked || c.id === currentId)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  get filteredDivisionOptions() {
    const companyId = this.form.get('company')?.value;
    return rfiLibraryDivisionOptionsForCompany(companyId, {
      companyBlocked: companyId ? this.companyDataService.isCompanyBlocked(companyId) : false,
      includeDivisionCode: this.form.get('division')?.value,
    });
  }

  get filteredSubDivisionOptions() {
    return rfiLibrarySubDivisionOptionsForDivision(this.form.get('company')?.value, this.form.get('division')?.value, {
      includeSubDivisionName: this.form.get('subDivision')?.value,
    });
  }

  onCompanyChange(): void {
    this.form.patchValue({ division: null, subDivision: null, scopeId: '', subScopeId: '' });
    this.syncSubDivisionRequirement();
  }

  onDivisionChange(): void {
    this.form.patchValue({ subDivision: null, scopeId: '', subScopeId: '' });
    this.syncSubDivisionRequirement();
  }

  onSubDivisionChange(): void {
    // The scope list depends on the owner — a previously-picked scope no longer applies.
    this.form.patchValue({ scopeId: '', subScopeId: '' });
  }

  /* ── Sub-Division requirement ───────────────────────────────────────────
   * Mirrors the Add Audit Scope drawer: scopes live only under the leaf node —
   * a division with sub-divisions (live `hasSubDivision` + at least one
   * sub-division) needs a sub-division before its scopes can be picked; a
   * division without any offers its own division-level scopes. Enforced in
   * add mode only — existing items keep their placement on edit. ─── */

  /** The selected division has sub-divisions to pick from. */
  get selectedDivisionHasSubDivisions(): boolean {
    const v = this.form.getRawValue();
    return !!v.division && divisionHasSubDivisions(v.company, v.division);
  }

  get isSubDivisionRequired(): boolean {
    return this.mode === RfiLibraryDrawerModes.Add && this.selectedDivisionHasSubDivisions;
  }

  /** Division chosen, plus a sub-division when one is required — the scope's owner is known. */
  get isScopeOwnerResolved(): boolean {
    const v = this.form.getRawValue();
    return !!v.division && (!!v.subDivision || !this.isSubDivisionRequired);
  }

  private syncSubDivisionRequirement(): void {
    const ctrl = this.form.get('subDivision')!;
    if (this.isSubDivisionRequired) {
      ctrl.setValidators(Validators.required);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  /** Scope library item belongs to the same company / division / sub-division (or division level) as this form. */
  private isSameOwner(s: ScopeLibraryItem): boolean {
    const v = this.form.getRawValue();
    return s.company === v.company && s.division === v.division && (s.subDivision || '') === (v.subDivision || '');
  }

  /* ── Options ─── */
  readonly priorityOptions: { label: string; value: RfiPriority; icon: string }[] = RFI_LIBRARY_PRIORITY_OPTIONS;

  readonly categoryOptions: { label: string; value: RfiCategory; icon: string }[] = RFI_LIBRARY_CATEGORY_OPTIONS;

  /* Scopes are the top-level items under the same owner (division or
   * sub-division) — the current pick stays listed so an edit doesn't drop it;
   * subscopes are children filtered by selected scopeId */
  get scopeOptions(): { label: string; value: string }[] {
    const currentId = this.form.get('scopeId')?.value;
    return this.allScopes
      .filter(s => s.scopeLevel === ScopeLevels.Scope && (this.isSameOwner(s) || s.id === currentId))
      .map(s => ({ label: s.title, value: s.id }));
  }

  get subScopeOptions(): { label: string; value: string }[] {
    const scopeId = this.form.get('scopeId')!.value;
    if (!scopeId) return [];
    return this.allScopes
      .filter(s => s.scopeLevel === ScopeLevels.SubScope && s.parentScopeId === scopeId)
      .map(s => ({ label: s.title, value: s.id }));
  }

  get hasSubScopes(): boolean {
    return this.subScopeOptions.length > 0;
  }

  get drawerTitle(): string {
    return RFI_LIBRARY_DRAWER_TITLES[this.mode];
  }

  private get selectedScopeTitle(): string {
    return this.allScopes.find(s => s.id === this.form.get('scopeId')!.value)?.title ?? '';
  }

  private get selectedSubScopeTitle(): string {
    const subScopeId = this.form.get('subScopeId')!.value;
    return this.allScopes.find(s => s.id === subScopeId)?.title ?? '';
  }

  /* ── Lifecycle ─── */
  ngOnInit(): void {
    if (this.mode === RfiLibraryDrawerModes.Edit && this.rfiItem) {
      this.populateForm();
    } else {
      this.resetForm();
    }
  }

  /* ── Tag handlers ─── */
  addTag(): void {
    const t = (this.form.get('tagInput')!.value ?? '').trim();
    if (t && !this.tags.includes(t)) {
      this.tags = [...this.tags, t];
    }
    this.form.get('tagInput')!.setValue('');
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  /* ── Question handlers ─── */
  addQuestion(): void {
    const q = (this.form.get('questionInput')!.value ?? '').trim();
    if (q) {
      this.questions = [...this.questions, q];
    }
    this.form.get('questionInput')!.setValue('');
  }

  removeQuestion(index: number): void {
    this.questions = this.questions.filter((_, i) => i !== index);
  }

  onQuestionKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addQuestion();
    }
  }

  /* ── Scope handler ─── */
  onScopeChange(): void {
    this.form.get('subScopeId')!.setValue('');
  }

  /* ── Validation ─── */
  isInvalid(field: string): boolean {
    if (!this.submitted) return false;
    const ctrl = this.form.get(field);
    return ctrl ? ctrl.invalid : false;
  }

  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !this.form.get('approverNotes')?.value?.trim();
  }

  /* ── Approval actions ─── */
  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...RFI_LIBRARY_CONFIRM_DIALOGS.Approve,
      action: 'approve',
    });
    if (ok) {
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'RFI Approved',
      //   detail: 'The RFI library item has been approved successfully.',
      // });
      const result: RfiLibraryDrawerResult = {
        approval: { action: RfiLibraryApprovalActions.Approve, notes: this.form.get('approverNotes')!.value ?? '' },
      };
      this.drawerRef.close(result);
       this.toast.success(RFI_LIBRARY_TOAST_MESSAGES.Approved, RFI_LIBRARY_TOAST_MESSAGES.ApprovedTitle);
      
     // setTimeout(() => this.drawerRef.close(result), 1200);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = this.form.get('approverNotes')!.value?.trim() ?? '';
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...RFI_LIBRARY_CONFIRM_DIALOGS.Reject,
      action: 'reject',
    });
    if (ok) {
        const result: RfiLibraryDrawerResult = {
        approval: { action: RfiLibraryApprovalActions.Reject, notes },
      };
      this.drawerRef.close(result);
      this.toast.error(RFI_LIBRARY_TOAST_MESSAGES.Rejected, RFI_LIBRARY_TOAST_MESSAGES.RejectedTitle);
      // this.messageService.add({
      //   severity: 'success',
      //   summary: 'RFI Rejected',
      //   detail: 'The RFI library item has been rejected and the submitter notified.',
      // });
    
      //setTimeout(() => this.drawerRef.close(result), 1200);
    }
  }

  /* ── Submit / cancel ─── */
  onSubmit(): void {
    this.submitted = true;
    const v = this.form.value;
    if (!v.company || !v.division || (this.isSubDivisionRequired && !v.subDivision) || !v.title?.trim() || !v.description?.trim() || !v.priority || !v.category) return;

    const subScopeId = v.scopeId ? (v.subScopeId ?? '') : '';

    const item: RfiLibraryItem = {
      id: this.rfiItem?.id ?? `${RFI_LIBRARY_FORM_ID_PREFIX}${v.title!.trim().replace(/\s+/g, '-').toLowerCase()}`,
      company: v.company!,
      division: v.division!,
      // '' = division-level item (the division has no sub-divisions).
      subDivision: v.subDivision || '',
      title: v.title!.trim(),
      description: v.description!.trim(),
      category: v.category as RfiCategory,
      priority: v.priority as RfiPriority,
      tags: [...this.tags],
      questions: [...this.questions],
      // No scope picked ⇒ null (and no sub-scope, which hangs off the scope).
      scopeId: v.scopeId || null,
      scopeTitle: v.scopeId ? this.selectedScopeTitle : undefined,
      status: (this.mode === RfiLibraryDrawerModes.Edit
        ? (this.rfiItem?.status ?? RfiLibraryStatuses.PendingReview)
        : RfiLibraryStatuses.PendingReview) as RfiLibraryStatus,
      createdAt: this.rfiItem?.createdAt ?? new Date().toISOString(),
      ...(subScopeId ? { subScopeId, subScopeTitle: this.selectedSubScopeTitle } : {}),
    };
    this.drawerRef.close({ saved: item });
var msg=this.mode === RfiLibraryDrawerModes.Edit
        ? RFI_LIBRARY_TOAST_MESSAGES.Updated
        : RFI_LIBRARY_TOAST_MESSAGES.Added;
this.toast.success(msg);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: this.mode === 'edit' ? 'RFI Updated' : 'RFI Added',
    //   detail: this.mode === 'edit'
    //     ? 'RFI library item has been successfully updated.'
    //     : 'New RFI library item has been successfully added.',
    // });
   // setTimeout(() => this.drawerRef.close({ saved: item }), 1200);
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.submitted = false;
    this.drawerRef.close(null);
  }

  private populateForm(): void {
    const r = this.rfiItem!;
    this.form.patchValue({
      company: r.company,
      division: r.division,
      subDivision: r.subDivision,
      title: r.title,
      description: r.description,
      priority: r.priority,
      category: r.category,
      scopeId: r.scopeId ?? '',
      subScopeId: r.subScopeId ?? '',
      tagInput: '',
      questionInput: '',
    });
    this.tags = [...r.tags];
    this.questions = [...(r.questions ?? [])];
  }

  private resetForm(): void {
    this.form.reset({
      company: null,
      division: null,
      subDivision: null,
      title: '',
      description: '',
      priority: null,
      category: null,
      scopeId: '',
      subScopeId: '',
      tagInput: '',
      questionInput: '',
    });
    this.tags = [];
    this.questions = [];
    this.submitted = false;
  }
}
