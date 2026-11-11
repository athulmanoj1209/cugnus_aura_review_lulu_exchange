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
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import type {
  ScopeLibraryItem,
  RiskCategory,
  Framework,
  ScopeLevel,
  ScopeLibraryStatus,
} from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { ScopeLibraryDrawerData, ScopeLibraryDrawerResult } from '@/app/features/audits/libraries/scope-library/models/scope-library.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import {
  scopeLibraryDivisionOptionsForCompany,
  scopeLibrarySubDivisionOptionsForDivision,
} from '@/app/features/audits/libraries/scope-library/scope-library-static-data';
import { divisionHasSubDivisions } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_LIBRARY_APPROVAL_CLOSE_DELAY_MS,
  SCOPE_LIBRARY_FORM_ID_PREFIX,
  ScopeLibraryApprovalActions,
  ScopeLibraryDrawerModes,
  ScopeLibraryStatuses,
  type ScopeLibraryDrawerMode,
} from '../constants/scope-library.constants';
import {
  SCOPE_LIBRARY_FRAMEWORK_OPTIONS,
  SCOPE_LIBRARY_LEVEL_OPTIONS,
  SCOPE_LIBRARY_RISK_CATEGORY_OPTIONS,
  SCOPE_LIBRARY_DRAWER_TITLES,
} from '../constants/scope-library-labels.constants';
import {
  SCOPE_LIBRARY_APPROVAL_NOTICES,
  SCOPE_LIBRARY_CONFIRM_DIALOGS,
  SCOPE_LIBRARY_TOAST_MESSAGES,
} from '../constants/scope-library-messages.constants';

@Component({
  selector: 'app-scope-library',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    DividerModule,
    ToastModule,
    DrawIconComponent,
  ],
  providers: [MessageService],
  templateUrl: './scope-library.component.html',
  styleUrl: './scope-library.component.scss',
})
export class ScopeLibraryComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef) as DrawerRef<ScopeLibraryDrawerResult, ScopeLibraryDrawerData>;
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as ScopeLibraryDrawerData | null;
  private readonly confirmSvc = inject(ConfirmDialogService);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);

  readonly ScopeLibraryDrawerModes = ScopeLibraryDrawerModes;
  readonly ScopeLevels = ScopeLevels;

  readonly mode: ScopeLibraryDrawerMode = this.data?.mode ?? ScopeLibraryDrawerModes.Add;
  readonly approvalMode: boolean = this.data?.approvalMode ?? false;
  readonly requestStatus: string = this.data?.requestStatus ?? ScopeLibraryStatuses.PendingReview;
  readonly canDecide: boolean = this.approvalMode && this.requestStatus === ScopeLibraryStatuses.PendingReview;
  scopeItem: ScopeLibraryItem | null = this.data?.scopeItem ?? null;
  allScopes: ScopeLibraryItem[] = this.data?.allScopes ?? [];

  /* ── Reactive form ─── */
  form = new FormGroup({
    company: new FormControl<string | null>(null, [Validators.required]),
    division: new FormControl<string | null>(null, [Validators.required]),
    // Required (add mode) when the division has sub-divisions; empty means the
    // item sits directly under the division. See syncSubDivisionRequirement().
    subDivision: new FormControl<string | null>(null),
    title: new FormControl('', [Validators.required]),
    objective: new FormControl('', [Validators.required]),
    scopeLevel: new FormControl<ScopeLevel>(ScopeLevels.Scope, [Validators.required]),
    parentScopeId: new FormControl(''),
    selectedSubScopeIds: new FormControl<string[]>([]),
    riskCategory: new FormControl<RiskCategory | null>(null, [Validators.required]),
    applicableFrameworks: new FormControl<Framework[]>([], [Validators.required]),
    approverNotes: new FormControl(''),
  });

  submitted = false;
  approvalNotesSubmitted = false;

  /* ── Company / Division / Sub-Division options — sourced from
   * scope-library-static-data.ts so this drawer's cascade matches the
   * real companies/divisions/sub-divisions used across the app. ─── */
  get companyOptions() {
    const currentId = this.form.get('company')?.value;
    return this.companyDataService.all
      .filter(c => !c.blocked || c.id === currentId)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  get filteredDivisionOptions() {
    const companyId = this.form.get('company')?.value;
    return scopeLibraryDivisionOptionsForCompany(companyId, {
      companyBlocked: companyId ? this.companyDataService.isCompanyBlocked(companyId) : false,
      includeDivisionCode: this.form.get('division')?.value,
    });
  }

  get filteredSubDivisionOptions() {
    return scopeLibrarySubDivisionOptionsForDivision(this.form.get('company')?.value, this.form.get('division')?.value, {
      includeSubDivisionName: this.form.get('subDivision')?.value,
    });
  }

  onCompanyChange(): void {
    this.form.patchValue({ division: null, subDivision: null, parentScopeId: '', selectedSubScopeIds: [] });
    this.syncSubDivisionRequirement();
  }

  onDivisionChange(): void {
    this.form.patchValue({ subDivision: null, parentScopeId: '', selectedSubScopeIds: [] });
    this.syncSubDivisionRequirement();
  }

  onSubDivisionChange(): void {
    // Parent / sub-scope links belong to the old owner — clear them.
    this.form.patchValue({ parentScopeId: '', selectedSubScopeIds: [] });
  }

  /* ── Sub-Division requirement ───────────────────────────────────────────
   * Mirrors the Add Audit Scope drawer: items live only under the leaf node —
   * a division with sub-divisions (live `hasSubDivision` + at least one
   * sub-division) takes them under a sub-division; a division without any
   * takes them directly. Enforced in add mode only — existing items keep
   * their placement on edit. ─── */

  /** The selected division has sub-divisions to pick from. */
  get selectedDivisionHasSubDivisions(): boolean {
    const v = this.form.getRawValue();
    return !!v.division && divisionHasSubDivisions(v.company, v.division);
  }

  get isSubDivisionRequired(): boolean {
    return this.mode === ScopeLibraryDrawerModes.Add && this.selectedDivisionHasSubDivisions;
  }

  /** Division chosen, plus a sub-division when one is required — the item's owner is known. */
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

  /** Library item belongs to the same company / division / sub-division (or division level) as this form. */
  private isSameOwner(s: ScopeLibraryItem): boolean {
    const v = this.form.getRawValue();
    return s.company === v.company && s.division === v.division && (s.subDivision || '') === (v.subDivision || '');
  }

  /* ── Options ─── */
  readonly riskCategoryOptions: { label: string; value: RiskCategory }[] = SCOPE_LIBRARY_RISK_CATEGORY_OPTIONS;

  readonly frameworkOptions: { label: string; value: Framework }[] = SCOPE_LIBRARY_FRAMEWORK_OPTIONS;

  readonly scopeLevelOptions: { label: string; value: ScopeLevel }[] = SCOPE_LIBRARY_LEVEL_OPTIONS;

  /* ── Dynamic option getters ─── */
  // Both pickers are limited to library items under the same owner (division or
  // sub-division) as this item; already-linked ids stay listed so an edit
  // doesn't silently drop them.
  get parentScopeOptions(): { label: string; value: string }[] {
    const editId = this.scopeItem?.id;
    const currentId = this.form.get('parentScopeId')?.value;
    return this.allScopes
      .filter(s => s.scopeLevel === ScopeLevels.Scope && s.id !== editId && (this.isSameOwner(s) || s.id === currentId))
      .map(s => ({ label: s.title, value: s.id }));
  }

  get subScopeOptions(): { label: string; value: string }[] {
    const editId = this.scopeItem?.id;
    const linkedIds = this.form.get('selectedSubScopeIds')?.value ?? [];
    return this.allScopes
      .filter(s => s.scopeLevel === ScopeLevels.SubScope && s.id !== editId && (this.isSameOwner(s) || linkedIds.includes(s.id)))
      .map(s => ({ label: s.title, value: s.id }));
  }

  get drawerTitle(): string {
    return SCOPE_LIBRARY_DRAWER_TITLES[this.mode];
  }

  get scopeLevel(): ScopeLevel {
    return this.form.get('scopeLevel')!.value as ScopeLevel;
  }

  /* ── Validation helpers ─── */
  isInvalid(field: string): boolean {
    if (!this.submitted) return false;
    const ctrl = this.form.get(field);
    if (!ctrl) return false;
    if (field === 'parentScopeId') {
      return this.scopeLevel === ScopeLevels.SubScope && !ctrl.value;
    }
    if (field === 'applicableFrameworks') {
      return !(ctrl.value as Framework[])?.length;
    }
    return ctrl.invalid;
  }

  isInvalidApproverNotes(): boolean {
    if (!this.approvalNotesSubmitted) return false;
    return !this.form.get('approverNotes')?.value?.trim();
  }

  /* ── Lifecycle ─── */
  ngOnInit(): void {
    if (this.mode === ScopeLibraryDrawerModes.Edit && this.scopeItem) {
      this.populateForm();
    } else {
      this.resetForm();
    }
  }

  /* ── Field handlers ─── */
  onScopeLevelChange(): void {
    this.form.patchValue({ parentScopeId: '', selectedSubScopeIds: [] });
  }

  /* ── Approval actions ─── */
  async onApprove(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...SCOPE_LIBRARY_CONFIRM_DIALOGS.Approve,
      action: 'approve',
    });
    if (ok) {
      this.messageService.add({
        severity: 'success',
        summary: SCOPE_LIBRARY_APPROVAL_NOTICES.ApprovedSummary,
        detail: SCOPE_LIBRARY_APPROVAL_NOTICES.Approved,
      });
      const result: ScopeLibraryDrawerResult = {
        approval: { action: ScopeLibraryApprovalActions.Approve, notes: this.form.get('approverNotes')!.value ?? '' },
      };
      setTimeout(() => this.drawerRef.close(result), SCOPE_LIBRARY_APPROVAL_CLOSE_DELAY_MS);
    }
  }

  async onReject(): Promise<void> {
    this.approvalNotesSubmitted = true;
    const notes = this.form.get('approverNotes')!.value?.trim() ?? '';
    if (!notes) return;
    const ok = await this.confirmSvc.confirm({
      ...SCOPE_LIBRARY_CONFIRM_DIALOGS.Reject,
      action: 'reject',
    });
    if (ok) {
      this.messageService.add({
        severity: 'success',
        summary: SCOPE_LIBRARY_APPROVAL_NOTICES.RejectedSummary,
        detail: SCOPE_LIBRARY_APPROVAL_NOTICES.Rejected,
      });
      const result: ScopeLibraryDrawerResult = {
        approval: { action: ScopeLibraryApprovalActions.Reject, notes },
      };
      setTimeout(() => this.drawerRef.close(result), SCOPE_LIBRARY_APPROVAL_CLOSE_DELAY_MS);
    }
  }

  /* ── Submit / cancel ─── */
  onSubmit(): void {
    this.submitted = true;
    const v = this.form.value;

    if (!v.company || !v.division || (this.isSubDivisionRequired && !v.subDivision) || !v.title?.trim() || !v.objective?.trim() || !v.riskCategory || !v.applicableFrameworks?.length) return;
    if (this.scopeLevel === ScopeLevels.SubScope && !v.parentScopeId) return;

    const parent = this.allScopes.find(s => s.id === v.parentScopeId);
    const subScopeRefs = (v.selectedSubScopeIds ?? [])
      .map(id => this.allScopes.find(s => s.id === id))
      .filter((s): s is ScopeLibraryItem => s != null)
      .map(s => ({ id: s.id, title: s.title }));

    // Status is not user-editable from this form: new items start pending_review,
    // and edits (including edits opened from the approval/review flow) preserve
    // whatever status the item already had — status transitions happen via the
    // separate approve/reject review flow, not here.
    const status: ScopeLibraryStatus = this.mode === ScopeLibraryDrawerModes.Edit
      ? (this.scopeItem?.status ?? ScopeLibraryStatuses.PendingReview)
      : ScopeLibraryStatuses.PendingReview;

    const item: ScopeLibraryItem = {
      id: this.scopeItem?.id ?? `${SCOPE_LIBRARY_FORM_ID_PREFIX}${v.title!.trim().replace(/\s+/g, '-').toLowerCase()}`,
      company: v.company!,
      division: v.division!,
      // '' = division-level item (the division has no sub-divisions).
      subDivision: v.subDivision || '',
      title: v.title!.trim(),
      objective: v.objective!.trim(),
      scopeLevel: this.scopeLevel,
      riskCategory: v.riskCategory as RiskCategory,
      applicableFrameworks: [...(v.applicableFrameworks as Framework[])],
      status,
      createdAt: this.scopeItem?.createdAt ?? new Date().toISOString(),
      ...(this.scopeLevel === ScopeLevels.SubScope && v.parentScopeId
        ? { parentScopeId: v.parentScopeId, parentScopeTitle: parent?.title }
        : {}),
      ...(this.scopeLevel === ScopeLevels.Scope && subScopeRefs.length
        ? { subScopes: subScopeRefs }
        : {}),
    };

    // this.messageService.add({
    //   severity: 'success',
    //   summary: this.mode === 'edit' ? 'Scope Item Updated' : 'Scope Item Added',
    //   detail: this.mode === 'edit'
    //     ? 'Scope library item has been successfully updated.'
    //     : 'New scope library item has been successfully added.',
    // });
     this.drawerRef.close({ saved: item });
     var msg=this.mode === ScopeLibraryDrawerModes.Edit
        ? SCOPE_LIBRARY_TOAST_MESSAGES.Updated
        : SCOPE_LIBRARY_TOAST_MESSAGES.Added;

    this.toast.success(msg);
    
  }

  onCancel(): void {
    this.close();
  }

  private close(): void {
    this.submitted = false;
    this.drawerRef.close(null);
  }

  private populateForm(): void {
    const s = this.scopeItem!;
    this.form.patchValue({
      company: s.company,
      division: s.division,
      subDivision: s.subDivision,
      title: s.title,
      objective: s.objective,
      scopeLevel: s.scopeLevel,
      parentScopeId: s.parentScopeId ?? '',
      selectedSubScopeIds: s.subScopes?.map(sub => sub.id) ?? [],
      riskCategory: s.riskCategory,
      applicableFrameworks: [...s.applicableFrameworks],
    });
  }

  private resetForm(): void {
    this.form.reset({
      company: null,
      division: null,
      subDivision: null,
      title: '',
      objective: '',
      scopeLevel: ScopeLevels.Scope,
      parentScopeId: '',
      selectedSubScopeIds: [],
      riskCategory: null,
      applicableFrameworks: [],
    });
    this.submitted = false;
  }
}
