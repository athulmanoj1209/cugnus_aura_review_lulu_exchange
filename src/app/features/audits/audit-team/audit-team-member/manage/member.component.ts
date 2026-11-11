import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

// PrimeNG modules (v18+)
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import {
  firstErrorMessage,
  integerValidator,
  phoneValidator,
} from '@/app/shared/services/form-validators.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  ALL_EXPERTISE,
  MemberDrawerTypes,
  MemberFormModes,
  MemberFormTabs,
  MemberResultModes,
  type Expertise,
  type MemberFormMode,
  MEMBER_DEFAULT_AVATAR_URL,
  MEMBER_FIELD_LIMITS,
  MEMBER_LINK_CLOSE_DELAY_MS,
  MEMBER_LINK_SEARCH_DEBOUNCE_MS,
} from '../constants/audit-team-member.constants';
import {
  MEMBER_DESIGNATION_OPTIONS,
  type MemberOption,
} from '../constants/audit-team-member-labels.constants';
import {
  MEMBER_DRAWER_SUBTITLES,
  MEMBER_DRAWER_TITLES,
  MEMBER_SUBMIT_LABELS,
  MEMBER_TOAST_MESSAGES,
} from '../constants/audit-team-member-messages.constants';


// Global company data store (same one CompaniesListComponent and
// MembersListComponent's Company filter read from) — adjust this path if
// company-list/ isn't a sibling folder of add-member-modal/ in your tree.
//
// Division / sub-division options below now come from the shared
// company-org-data.ts file (the common Company -> Division -> Sub-Division
// static data referenced across pages) instead of local hardcoded lists,
// so they stay consistent with the organization pages and cascade correctly
// off the selected Company/Division. Adjust the
// '@/app/data/company-org-data' path if that file lives elsewhere in
// your tree.


/* ============================================================
 *  Models
 * ============================================================ */

// Re-exported so existing imports from this file keep working.
export { ALL_EXPERTISE };
export type { Expertise };

/** Form payload returned to the opener when "New Member" is submitted. */
export interface NewMemberFormModel {
  fullName: string | null;
  designation: string | null;
  yearsOfExperience: number | null;
  expertise: Expertise[];
  email: string | null;
  phone: string | null;
  teamsZoomId: string | null;
  company: string | null;
  division: string | null;
  assignedSubDivisions: string[];
  hourlyCostRate: number | null;
  assignedHours: number | null;
  totalCapacityHours: number | null;
  viewType?:string | null;
}

/** Returned to the opener when "Link Existing" is submitted. */
export interface LinkMemberResult {
  mode: typeof MemberResultModes.Link;
  memberId: string;
}

/** Returned to the opener when "Create New" is submitted. */
export interface CreateMemberResult {
  mode: typeof MemberResultModes.Create;
  member: NewMemberFormModel;
}

export type AddMemberResult = CreateMemberResult | LinkMemberResult;

/** Single existing member shown in the "Link Existing Member" list. */
export interface ExistingMember {
  id: string;
  name: string;
  designation: string;
  yearsOfExperience: number;
  expertise: string;
  workloadPct: number;
  avatarUrl?: string;
}

export interface AddMemberDrawerData {
  /** Pre-fill the New Member form. */
  existing?: Partial<NewMemberFormModel>;
  /** Optional list of members to choose from on the Link tab. */
  members?: ExistingMember[];
   type?:string | null;
   mode?: MemberFormMode;
}

type Option = MemberOption;

const L = MEMBER_FIELD_LIMITS;

/* ============================================================
 *  Component
 * ============================================================ */

@Component({
  selector: 'app-add-member-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabsModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    InputNumberModule,MultiSelectModule,
    ToastModule,DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class AddMemberModalComponent implements OnInit {

  private readonly drawerRef = inject(DrawerRef) as DrawerRef<AddMemberResult, AddMemberDrawerData>;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AddMemberDrawerData | null;
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly toast = inject(ToastService);
  private readonly companyData = inject(CompanyDataService);
  private readonly clientMode = inject(CLIENT_MODE);

  /**
   * Active Company -> Division -> Sub-division directory — the internal-audit
   * org's own static seed when CLIENT_MODE is 'internal-audit', otherwise
   * the multi-company ORG_STATIC_DATA roster. Mirrors the company switch
   * CompanyDataService already makes, so division/sub-division options always
   * belong to the companies shown in the Company dropdown.
   */
  private readonly orgData =
    this.clientMode === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

  /** Currently active tab (string for PrimeNG v18 Tabs). */
  activeTabIndex: string = MemberFormTabs.Create;

readonly mode: MemberFormMode = this.drawerData?.mode ?? MemberFormModes.Create;
  readonly isEdit: boolean = this.mode === MemberFormModes.Edit;

  // Exposed for the template.
  readonly MemberFormTabs = MemberFormTabs;
  readonly MemberDrawerTypes = MemberDrawerTypes;
  readonly submitLabels = MEMBER_SUBMIT_LABELS;

  readonly selectSubDivisionsLabel = $localize`:@@audit.auditTeam.selectSubDivisions:Select Sub-Divisions`;
  readonly noSubDivisionsForDivisionLabel = $localize`:@@audit.auditTeam.noSubDivisionsForDivision:No sub-divisions for this division`;

  experienceLongLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYearExperienceLong:${years}:years: year exp.`
      : $localize`:@@audit.auditTeam.yearsExperienceLong:${years}:years: years exp.`;
  }

  /** Header title — changes with active tab and edit/create mode. */
  get headerTitle(): string {
    if (this.isEdit) return MEMBER_DRAWER_TITLES.Edit;
    return this.activeTabIndex === MemberFormTabs.Link
      ? MEMBER_DRAWER_TITLES.Link
      : MEMBER_DRAWER_TITLES.Create;
  }

  /** Header subtitle — changes with active tab and edit/create mode. */
  get headerSubtitle(): string {
    if (this.isEdit) return MEMBER_DRAWER_SUBTITLES.Edit;
    return this.activeTabIndex === MemberFormTabs.Link
      ? MEMBER_DRAWER_SUBTITLES.Link
      : MEMBER_DRAWER_SUBTITLES.Create;
  }


  /** Available expertise options (rendered as a checkbox grid). */
  readonly expertiseList = ALL_EXPERTISE;

  /** Local UI state for the "Assigned Sub-Divisions" inline-add input. */
 // readonly subDivisionInput = new FormControl<string>('', { nonNullable: true });

  /* ---------------- Create New Member form ---------------- */
  readonly form = this.fb.group({
    create: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(L.FullNameMin), Validators.maxLength(L.FullNameMax)]],
      designation: [null as string | null, [Validators.required]],
      yearsOfExperience: [
        null as number | null,
        [Validators.required, Validators.min(L.YearsOfExperienceMin), Validators.max(L.YearsOfExperienceMax), integerValidator],
      ],
      expertise: this.fb.array<FormControl<boolean>>(
        ALL_EXPERTISE.map(() => this.fb.nonNullable.control(false)),
      ),
      email: ['', [Validators.required, Validators.email, Validators.maxLength(L.EmailMax)]],
      phone: ['', [Validators.required, phoneValidator]],
      teamsZoomId: ['', [Validators.maxLength(L.TeamsZoomIdMax)]],
      assignedSubDivisions: [[] as string[]],
      hourlyCostRate: [
        null as number | null,
        [Validators.required, Validators.min(L.HourlyCostRateMin), Validators.max(L.HourlyCostRateMax)],
      ],
      assignedHours: [
        null as number | null,
        [Validators.required,Validators.min(L.HoursMin), Validators.max(L.HoursMax), integerValidator],
      ],
      totalCapacityHours: [
        null as number | null,
        [Validators.required,Validators.min(L.HoursMin), Validators.max(L.HoursMax), integerValidator],
      ],
       viewType: [''],
       company: [''], division: [''],
    }),
    link: this.fb.group({
      selectedMemberId: [null as string | null, Validators.required],
      search: [''],
    }),

  });

  /* ---------------- Dropdown options ---------------------- */
  /**
   * Sourced from the shared CompanyDataService — the same store
   * CompaniesListComponent and MembersListComponent's Company filter
   * read from — instead of a hardcoded static list. Stays in sync
   * automatically if companies are added/renamed on the Companies page.
   */
  readonly companyOptions = computed<Option[]>(() =>
    this.companyData.companies()
      .map(c => ({ label: c.companyName, value: c.id }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Selected Company / Division, as signals — plumbed through valueChanges
   * (same pattern as searchSignal below) so divisionOptions/subDivisionOptions
   * recompute live as the user picks a company/division, instead of being
   * static hardcoded lists.
   */
  private readonly selectedCompanyId = toSignal(
    this.form.controls.create.controls.company.valueChanges.pipe(startWith(this.form.controls.create.controls.company.value)),
    { initialValue: this.form.controls.create.controls.company.value },
  );

  private readonly selectedDivisionCode = toSignal(
    this.form.controls.create.controls.division.valueChanges.pipe(startWith(this.form.controls.create.controls.division.value)),
    { initialValue: this.form.controls.create.controls.division.value },
  );

  /** Divisions for the selected company, sourced from the common org data file. */
  readonly divisionOptions = computed<Option[]>(() => {
    const companyId = this.selectedCompanyId();
    if (!companyId) return [];
    const company = this.orgData.find(c => c.id === companyId);
    return (company?.divisions ?? [])
      .map(b => ({ label: b.divisionName, value: b.divisionCode }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /** The selected division in the common org data file, if any. */
  private readonly selectedDivision = computed(() => {
    const companyId = this.selectedCompanyId();
    const divisionCode = this.selectedDivisionCode();
    if (!companyId || !divisionCode) return undefined;
    return this.orgData
      .find(c => c.id === companyId)
      ?.divisions.find(b => b.divisionCode === divisionCode);
  });

  /**
   * False when the selected division is flagged `hasSubDivision: false` —
   * the Assigned Sub-Divisions field is then hidden, left empty and not validated.
   */
  readonly divisionHasSubDivision = computed(() => this.selectedDivision()?.hasSubDivision !== false);

  /** Sub-Divisions are required only once a division with sub-divisions is selected. */
  readonly subDivisionRequired = computed(() => !!this.selectedDivision() && this.divisionHasSubDivision());

  /** Sub-divisions for the selected company + division, sourced from the common org data file. */
  readonly subDivisionOptions = computed<Option[]>(() => {
    const division = this.selectedDivision();
    if (!division || division.hasSubDivision === false) return [];
    return division.subDivisions
      .map(d => ({ label: d.subDivisionName, value: d.subDivisionCode }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  private readonly subDivisionValidatorEffect = effect(() => {
    const ctrl = this.form.controls.create.controls.assignedSubDivisions;
    const required = this.subDivisionRequired();
    if (required !== ctrl.hasValidator(Validators.required)) {
      ctrl.setValidators(required ? [Validators.required] : []);
      ctrl.updateValueAndValidity({ emitEvent: false });
    }
  });

  readonly designations: Option[] = MEMBER_DESIGNATION_OPTIONS;

  /* ---------------- Existing members list ----------------- */

  private readonly DEFAULT_AVATAR = MEMBER_DEFAULT_AVATAR_URL;

  /** Full pool of selectable existing members. */
  readonly members = signal<ExistingMember[]>([]);

  /**
   * Search text → signal. Plumbed through valueChanges so we get
   * debouncing and distinct emissions just like the companies list.
   */
  private readonly searchSignal = toSignal(
    this.form.controls.link.controls.search.valueChanges.pipe(
      debounceTime(MEMBER_LINK_SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      startWith(''),
    ),
    { initialValue: '' },
  );

  /** Members filtered by the live search box. */
  readonly filteredMembers = computed(() => {
    const term = (this.searchSignal() ?? '').toLowerCase().trim();
    const list = this.members();
    if (!term) return list;
    return list.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.designation.toLowerCase().includes(term) ||
      m.expertise.toLowerCase().includes(term),
    );
  });

  /* ---------------- Init ---------------------------------- */
  ngOnInit(): void {
    // Seed the existing-members list. Caller-provided list wins; otherwise
    // fall back to a deterministic mock list so the UI is never empty.
    this.members.set(this.drawerData?.members ?? this.buildMockMembers());


    // Hydrate the create form from any pre-filled values.
    const seed = this.drawerData?.existing;
    if (seed) {
      // Default from the actual mode ('edit' keeps the action buttons visible);
      // drawerData.type can still override this explicitly if provided.
      var type: string = this.isEdit ? MemberDrawerTypes.Edit : MemberDrawerTypes.View;
      if (this.drawerData?.type)
      {
        type=this.drawerData?.type;
      }
      const create = this.form.controls.create;
      create.patchValue({
        fullName: seed.fullName ?? null,
        designation: seed.designation ?? null,
        yearsOfExperience: seed.yearsOfExperience ?? null,
        email: seed.email ?? null,
        phone: seed.phone ?? null,
        teamsZoomId: seed.teamsZoomId ?? null,
        hourlyCostRate: seed.hourlyCostRate ?? null,
        assignedHours: seed.assignedHours ?? null,
        totalCapacityHours: seed.totalCapacityHours ?? null,
        company: seed.company ?? null,
        division: seed.division ?? null,
        viewType:type
      });

      // assignedSubDivisions depends on company + division options being
      // populated first (both patched above), so seed it after.
      if (seed.assignedSubDivisions?.length) {
        create.patchValue({ assignedSubDivisions: seed.assignedSubDivisions });
      }

      // Expertise array
      if (seed.expertise?.length) {
        this.expertiseArray.controls.forEach((c, i) => {
          c.setValue(seed.expertise!.includes(ALL_EXPERTISE[i]));
        });
      }

      // Assigned sub-divisions array
      // if (seed.assignedSubDivisions?.length) {
      //   const subDivisions = this.assignedSubDivisionsArray;
      //   subDivisions.clear();
      //   seed.assignedSubDivisions.forEach(d =>
      //     subDivisions.push(this.fb.nonNullable.control(d)),
      //   );
      // }
    }

    // Switching tabs swaps which controls actually drive validity.
    // Disable the inactive tab's required fields so the "Add" button
    // reflects the right state.
    this.applyTabValidation(MemberFormTabs.Create);
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {/* no-op, here for future cross-field rules */});

    // Changing the company invalidates the previously selected division and
    // any sub-divisions picked under the old company/division; changing the
    // division (within the same company) invalidates just the sub-divisions.
    this.form.controls.create.controls.company.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.create.patchValue(
          { division: null, assignedSubDivisions: [] },
          { emitEvent: false },
        );
      });

    this.form.controls.create.controls.division.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.create.patchValue(
          { assignedSubDivisions: [] },
          { emitEvent: false },
        );
      });
  }

  /* ---------------- Tab switching ------------------------- */

  onTabChange(value: string | number | undefined): void {
    const idx = String(value);
    this.activeTabIndex = idx;
    this.applyTabValidation(idx);
  }

  private applyTabValidation(idx: string): void {
    // Only the active tab's group should block submission.
    if (idx === MemberFormTabs.Create) {
      this.form.controls.create.enable({ emitEvent: false });
      this.form.controls.link.disable({ emitEvent: false });
    } else {
      this.form.controls.create.disable({ emitEvent: false });
      this.form.controls.link.enable({ emitEvent: false });
    }
  }

  /* ---------------- Form array helpers -------------------- */

  get expertiseArray(): FormArray<FormControl<boolean>> {
    return this.form.controls.create.controls.expertise as FormArray<FormControl<boolean>>;
  }

  // get assignedSubDivisionsArray(): FormArray<FormControl<string>> {
  //   return this.form.controls.create.controls.assignedSubDivisions as FormArray<FormControl<string>>;
  // }

  /** The chosen expertise labels (derived from the boolean FormArray). */
  selectedExpertise(): Expertise[] {
    return this.expertiseArray.controls
      .map((c, i) => (c.value ? ALL_EXPERTISE[i] : null))
      .filter((x): x is Expertise => x !== null);
  }



  /* ---------------- Existing-member selection ------------- */

  selectMember(id: string): void {
    this.form.controls.link.controls.selectedMemberId.setValue(id);
  }

  isMemberSelected(id: string): boolean {
    return this.form.controls.link.controls.selectedMemberId.value === id;
  }

  /* ---------------- Error helpers ------------------------- */

  getError(path: string,field : string  | undefined): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors,field);
  }

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  /* ---------------- Submit / cancel ----------------------- */

  onCancel(): void {
    this.drawerRef.close(null);
  }

  onSubmit(): void {
    if (this.activeTabIndex === MemberFormTabs.Create) {
      const group = this.form.controls.create;
      if (group.invalid) {
        group.markAllAsTouched();
        return;
      }
      const v = group.getRawValue();
      const result: CreateMemberResult = {
        mode: MemberResultModes.Create,
        member: {
          fullName: v.fullName,
          designation: v.designation,
          yearsOfExperience: v.yearsOfExperience,
          expertise: this.selectedExpertise(),
          email: v.email,
          phone: v.phone,
          teamsZoomId: v.teamsZoomId,
          company: v.company || null,
          division: v.division || null,
          assignedSubDivisions: v.assignedSubDivisions ?? [],
          hourlyCostRate: v.hourlyCostRate,
          assignedHours: v.assignedHours,
          totalCapacityHours: v.totalCapacityHours,
        },
      };
      this.drawerRef.close(result);
      var msg="";
    msg=this.isEdit
          ? MEMBER_TOAST_MESSAGES.Updated
          : MEMBER_TOAST_MESSAGES.Added;
       this.toast.success(msg);
      // this.messageService.add({
      //   severity: 'success',
      //   summary: this.isEdit ? 'Member Updated' : 'Member Added',
      //   detail: this.isEdit
      //     ? 'Member details have been successfully updated.'
      //     : 'New member has been successfully added.',
      // });
      // setTimeout(() => this.drawerRef.close(result), 1500);
      return;
    }

    // Link existing
    const linkGroup = this.form.controls.link;
    if (linkGroup.controls.selectedMemberId.invalid) {
      linkGroup.controls.selectedMemberId.markAsTouched();
      return;
    }
    this.messageService.add({
      severity: 'success',
      summary: MEMBER_TOAST_MESSAGES.LinkedTitle,
      detail: MEMBER_TOAST_MESSAGES.Linked,
    });
    const linkResult: LinkMemberResult = {
      mode: MemberResultModes.Link,
      memberId: linkGroup.controls.selectedMemberId.value!,
    };
    setTimeout(() => this.drawerRef.close(linkResult), MEMBER_LINK_CLOSE_DELAY_MS);
  }

  /* ---------------- Mock data ----------------------------- */

  private buildMockMembers(): ExistingMember[] {
    const avatars = [
      'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
      'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png',
    ];
    return [
      { id: 'm1', name: 'Michael Chen',  designation: 'Audit Manager',  yearsOfExperience: 10, expertise: 'AML, Treasury', workloadPct: 80, avatarUrl: avatars[0] },
      { id: 'm2', name: 'Amy Elsner',    designation: 'Senior Auditor', yearsOfExperience: 7,  expertise: 'Finance, HR',   workloadPct: 65, avatarUrl: avatars[1] },
      { id: 'm3', name: 'Asiya Javayant',designation: 'Auditor',        yearsOfExperience: 4,  expertise: 'IT, Operations',workloadPct: 45, avatarUrl: avatars[2] },
      { id: 'm4', name: 'Ioni Bowcher',  designation: 'Risk Officer',   yearsOfExperience: 9,  expertise: 'AML, Compliance',workloadPct: 90, avatarUrl: avatars[3] },
      { id: 'm5', name: 'Xu Xuefeng',    designation: 'Analyst',        yearsOfExperience: 3,  expertise: 'Finance, IT',   workloadPct: 30, avatarUrl: avatars[4] },
    ];
  }

  /** Fallback avatar for image error handler in the template. */
  onAvatarError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img && img.src !== this.DEFAULT_AVATAR) {
      img.src = this.DEFAULT_AVATAR;
    }
  }
}