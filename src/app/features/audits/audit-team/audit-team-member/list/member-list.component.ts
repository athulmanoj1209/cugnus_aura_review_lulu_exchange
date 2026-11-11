import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Popover, PopoverModule } from 'primeng/popover';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  AddMemberModalComponent,
  AddMemberResult,
  ExistingMember,
  NewMemberFormModel,
} from '../manage/member.component';
import { MemberProfileAction, MemberProfileComponent, MemberProfileData } from '../profile/member-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// Shared Company -> Division -> Sub-Division directory (same source the Add
// Member modal and the other list filters use): the internal-audit org's
// static seed when CLIENT_MODE_VALUE is 'internal-audit', otherwise the
// multi-company ORG_STATIC_DATA roster.
import { ORG_STATIC_DATA, OrgCompany } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import {
  MemberBlockActions,
  MemberFilterKeys,
  MemberFormModes,
  MemberResultModes,
  MemberSortOptions,
  MemberViewModes,
  MemberWorkloadTiers,
  type MemberBlockAction,
  type MemberSortOption,
  type MemberViewMode,
  type MemberWorkloadTier,
  MEMBER_DEFAULT_AVATAR_URL,
  MEMBER_DEFAULT_NAME,
  MEMBER_DRAWER,
  MEMBER_LIST_PAGE_SIZE,
  MEMBER_PAGE_SIZE_OPTIONS,
  MEMBER_PLACEHOLDER_AVATAR_URL,
  MEMBER_SEARCH_DEBOUNCE_MS,
  MEMBER_WORKLOAD_THRESHOLDS,
} from '../constants/audit-team-member.constants';
import {
  MEMBER_DESIGNATION_CODE_BY_LABEL,
  MEMBER_DESIGNATION_LABEL_BY_CODE,
  MEMBER_FILTER_CHIP_LABELS,
  MEMBER_SORT_OPTIONS,
} from '../constants/audit-team-member-labels.constants';
import { memberFilterChipLabel } from '../constants/audit-team-member-messages.constants';


export interface Member {
  id: string;
  name: string;
  designation: string;
  yearsOfExperience: number;
  expertise: string;
  email: string;
  phone: string;
  workloadPct: number;
  hourlyCostRate: number;
  assignedHours: number;
  totalCapacityHours: number;
  avatarUrl?: string;
  blocked: boolean;
  createdAt: Date;

  // Extended profile fields
  subDivision?: string;
  company?: string;
  division?: string;
  region?: string;
  teamsZoomId?: string;
  assignedSubDivisions?: string[];
  reportsTo?: { id: string; name: string; title: string; avatarUrl?: string };
  directReports?: Array<{ id: string; name: string; title: string; avatarUrl?: string }>;
}

const ORG_DATA: OrgCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

/** One {company, division, sub-division} triple per sub-division in ORG_DATA
 *  (a division flagged `hasSubDivision: false`, or without sub-divisions,
 *  contributes one entry with no sub-division), cycled across MOCK_MEMBERS
 *  so every member carries org values that exist in the
 *  Company/Division/Sub-Division filters instead of the placeholder names
 *  baked into MOCK_MEMBERS ("Crowe UAE", "Dubai HQ", ...). */
const ORG_UNITS = ORG_DATA.flatMap(c =>
  c.divisions.flatMap(dv =>
    (dv.hasSubDivision !== false && dv.subDivisions?.length ? dv.subDivisions.map(sd => sd.subDivisionName) : [undefined])
      .map(subDivision => ({ company: c.companyName, division: dv.divisionName, subDivision })),
  ),
);

function withOrgFields(members: Member[]): Member[] {
  if (!ORG_UNITS.length) return members;
  return members.map((m, i) => ({ ...m, ...ORG_UNITS[i % ORG_UNITS.length] }));
}

type ViewMode = MemberViewMode;
type SortOption = MemberSortOption;

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    ButtonModule,
    TooltipModule,
    PopoverModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,

    DrawIconComponent,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MembersListComponent {

  @ViewChild('filterPanel') filterPanel!: Popover;

  private readonly fb         = inject(FormBuilder);
  private readonly drawer     = inject(RightDrawerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router     = inject(Router);
  private readonly location   = inject(Location);

  // ---------------- Filter form (search + sort) ----------------
  readonly filters = this.fb.group({
    search: [''],
    sortBy: [MemberSortOptions.NameAsc as SortOption],
  });

  // ---------------- Filters (popover panel: signal-based) ----------------
  readonly selectedCompanies     = signal<string[]>([]);
  readonly selectedDivisions     = signal<string[]>([]);
  readonly selectedSubDivisions  = signal<string[]>([]);
  readonly selectedDesignations  = signal<string[]>([]);

  private readonly filtersSignal = toSignal(
    this.filters.valueChanges.pipe(
      debounceTime(MEMBER_SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(
        (a, b) => a.search === b.search && a.sortBy === b.sortBy,
      ),
      startWith(this.filters.value),
    ),
    { initialValue: this.filters.value },
  );

  // ---------------- Page-level state ----------------
  readonly viewMode    = signal<ViewMode>(MemberViewModes.Grid);
  readonly currentPage = signal(1);
  readonly pageSize    = signal(MEMBER_LIST_PAGE_SIZE);

  /** Options for the "items per page" dropdown in <app-pagination-bar>. */
  readonly pageSizeOptions: number[] = MEMBER_PAGE_SIZE_OPTIONS;

  // Exposed for the template.
  readonly MemberViewModes = MemberViewModes;
  readonly MemberBlockActions = MemberBlockActions;

  // ---------------- Data ----------------
  private readonly membersData = signal<Member[]>(withOrgFields(MOCK_MEMBERS));

  readonly allSubDivisionsLabel = $localize`:@@audit.auditTeam.allSubDivisions:All sub-divisions`;
  readonly noSubDivisionsLabel = $localize`:@@audit.auditTeam.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly membersLabel = $localize`:@@audit.auditTeam.members:members`;

  experienceShortLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYearExperienceShort:${years}:years: yr exp.`
      : $localize`:@@audit.auditTeam.yearsExperienceShort:${years}:years: yrs exp.`;
  }

  experienceYearsLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYearShort:${years}:years: yr`
      : $localize`:@@audit.auditTeam.yearsShort:${years}:years: yrs`;
  }
  readonly filteredMembers = computed<Member[]>(() => {
    const all            = this.membersData();
    const { search, sortBy } = this.filtersSignal() ?? {};

    let result = [...all];

    const q = (search ?? '').trim().toLowerCase();
    if (q) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.expertise.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
      );
    }

    // Company / Division / Sub-Division filters.
    //
    // The filter *options* come from the static ORG_DATA directory (see the
    // computed *FilterOptions below), not from the member records, so both
    // sides are normalized (trim + lowercase) before comparing — a member
    // saved as "dar exchange " still matches the "DAR Exchange" option.
    const companies = this.selectedCompanies();
    if (companies.length) {
      const normCompanies = companies.map(MembersListComponent.normalize);
      result = result.filter(m => !!m.company && normCompanies.includes(MembersListComponent.normalize(m.company)));
    }

    const divisions = this.selectedDivisions();
    if (divisions.length) {
      const normDivisions = divisions.map(MembersListComponent.normalize);
      result = result.filter(m => !!m.division && normDivisions.includes(MembersListComponent.normalize(m.division)));
    }

    const subDivisions = this.selectedSubDivisions();
    if (subDivisions.length) {
      const normSubDivisions = subDivisions.map(MembersListComponent.normalize);
      result = result.filter(m => !!m.subDivision && normSubDivisions.includes(MembersListComponent.normalize(m.subDivision)));
    }

    const designations = this.selectedDesignations();
    if (designations.length) result = result.filter(m => designations.includes(m.designation));

    switch (sortBy ?? MemberSortOptions.NameAsc) {
      case MemberSortOptions.NameAsc:    result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case MemberSortOptions.NameDesc:   result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case MemberSortOptions.Recent:     result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break;
      case MemberSortOptions.Experience: result.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience); break;
      case MemberSortOptions.Workload:   result.sort((a, b) => b.workloadPct - a.workloadPct); break;
    }

    return result;
  });

  readonly pagedMembers = computed<Member[]>(() => {
    const filtered = this.filteredMembers();
    const size     = this.pageSize();
    const start    = (this.currentPage() - 1) * size;
    return filtered.slice(start, start + size);
  });

  readonly totalCount = computed(() => this.filteredMembers().length);

  // ---------------- Dropdown options ----------------
  readonly sortOptions: { label: string; value: SortOption }[] = MEMBER_SORT_OPTIONS;

  readonly defaultAvatar = MEMBER_DEFAULT_AVATAR_URL;

  // ---------------- Dynamic filter options ----------------

  /**
   * true when this build is running for a single self-auditing org (see
   * client-mode.ts). Not private — the template reads it directly to decide
   * whether to show the Company/Division/Sub-Division line on each member.
   */
  readonly isInternalAudit = CLIENT_MODE_VALUE === 'internal-audit';

  private static toOptions(values: Iterable<string>): { label: string; value: string }[] {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b)).map(v => ({ label: v, value: v }));
  }

  /**
   * Case/whitespace-insensitive key used to compare a value picked from the
   * filter UI (built from the static ORG_DATA directory) against a value
   * stored on a member record — see the comment in `filteredMembers` above.
   */
  private static normalize(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase();
  }

  /** ORG_DATA companies, narrowed to the selected company names (all when none selected). */
  private static orgCompanies(companyFilter: string[]): OrgCompany[] {
    if (!companyFilter.length) return ORG_DATA;
    const norm = companyFilter.map(MembersListComponent.normalize);
    return ORG_DATA.filter(c => norm.includes(MembersListComponent.normalize(c.companyName)));
  }

  // Company / Division / Sub-Division options all come from the static
  // ORG_DATA directory (not the member records), cascading Company ->
  // Division -> Sub-Division like the other list filters.
  readonly companyFilterOptions = computed(() =>
    MembersListComponent.toOptions(ORG_DATA.map(c => c.companyName)),
  );

  readonly divisionFilterOptions = computed(() =>
    MembersListComponent.toOptions(
      MembersListComponent.orgCompanies(this.selectedCompanies()).flatMap(c => c.divisions.map(dv => dv.divisionName)),
    ),
  );

  /** ORG_DATA divisions under the selected companies, narrowed to the selected division names. */
  private readonly selectedOrgDivisions = computed(() => {
    const normDivisions = this.selectedDivisions().map(MembersListComponent.normalize);
    return MembersListComponent.orgCompanies(this.selectedCompanies())
      .flatMap(c => c.divisions)
      .filter(dv => !normDivisions.length || normDivisions.includes(MembersListComponent.normalize(dv.divisionName)));
  });

  /**
   * False when every selected division is flagged `hasSubDivision: false` —
   * the Sub-Division filter is then hidden, since there's nothing to pick.
   */
  readonly subDivisionFilterVisible = computed(() =>
    !this.selectedDivisions().length ||
    !this.selectedOrgDivisions().length ||
    this.selectedOrgDivisions().some(dv => dv.hasSubDivision !== false),
  );

  readonly subDivisionFilterOptions = computed(() =>
    MembersListComponent.toOptions(
      this.selectedOrgDivisions()
        .filter(dv => dv.hasSubDivision !== false)
        .flatMap(dv => dv.subDivisions.map(sd => sd.subDivisionName)),
    ),
  );

  readonly designationFilterOptions = computed(() => {
    const set = new Set(this.membersData().map(m => m.designation).filter(Boolean));
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  // ---------------- Active filter count / chips ----------------
  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedCompanies().length)     n++;
    if (this.selectedDivisions().length)     n++;
    if (this.selectedSubDivisions().length)  n++;
    if (this.selectedDesignations().length)  n++;
    return n;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: string; label: string }[] = [];
    const counts: [string, number][] = [
      [MemberFilterKeys.Companies,    this.selectedCompanies().length],
      [MemberFilterKeys.Divisions,    this.selectedDivisions().length],
      [MemberFilterKeys.SubDivisions, this.selectedSubDivisions().length],
      [MemberFilterKeys.Designations, this.selectedDesignations().length],
    ];
    for (const [key, count] of counts) {
      if (count) chips.push({ key, label: memberFilterChipLabel(MEMBER_FILTER_CHIP_LABELS[key as keyof typeof MEMBER_FILTER_CHIP_LABELS], count) });
    }
    return chips;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedDesignations().length,
  );

  // ---------------- Constructor ----------------
  constructor() {
    this.filters.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.currentPage.set(1));
  }

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  // ---------------- Filter handlers (popover) ----------------
  onCompaniesChange(v: string[]): void     { this.selectedCompanies.set(v ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onDivisionsChange(v: string[]): void     { this.selectedDivisions.set(v ?? []); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onSubDivisionsChange(v: string[]): void  { this.selectedSubDivisions.set(v ?? []); this.currentPage.set(1); }
  onDesignationsChange(v: string[]): void  { this.selectedDesignations.set(v ?? []); this.currentPage.set(1); }

  removeFilter(key: string): void {
    switch (key) {
      case MemberFilterKeys.Companies:    this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case MemberFilterKeys.Divisions:    this.selectedDivisions.set([]);  this.selectedSubDivisions.set([]); break;
      case MemberFilterKeys.SubDivisions: this.selectedSubDivisions.set([]); break;
      case MemberFilterKeys.Designations: this.selectedDesignations.set([]); break;
    }
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedDesignations.set([]);
    this.currentPage.set(1);
  }

  // ---------------- View / pagination ----------------
  setViewMode(mode: ViewMode): void { this.viewMode.set(mode); }

  /** <app-pagination-bar> emits a zero-based page index. */
  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  /** Called when the "items per page" dropdown changes. Resets to page 1
   *  so the visible slice stays consistent with the new page size. */
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  // ---------------- CRUD actions ----------------
  private toExistingMemberDtos(): ExistingMember[] {
    return this.membersData().map(m => ({
      id:                m.id,
      name:              m.name,
      designation:       m.designation,
      yearsOfExperience: m.yearsOfExperience,
      expertise:         m.expertise,
      workloadPct:       m.workloadPct,
      avatarUrl:         m.avatarUrl,
    }));
  }

  async openAddMember(): Promise<void> {
    const ref    = this.drawer.open<AddMemberResult>(AddMemberModalComponent, {
      width: MEMBER_DRAWER.FormWidth,
      data: { members: this.toExistingMemberDtos() },
    });
    const result = await ref.afterClosed;
    if (!result) return;

    if (result.mode === MemberResultModes.Create) {
      this.membersData.update(list => [this.toMember(result.member), ...list]);
    } else {
      console.log('Linked existing member:', result.memberId);
    }
  }

  async editMember(member: Member): Promise<void> {
    const ref    = this.drawer.open<AddMemberResult>(AddMemberModalComponent, {
      width: MEMBER_DRAWER.FormWidth,
      data: { existing: this.toFormModel(member), members: this.toExistingMemberDtos(), mode: MemberFormModes.Edit },
    });
    const result = await ref.afterClosed;
    if (!result || result.mode !== MemberResultModes.Create) return;

    this.membersData.update(list =>
      list.map(m => m.id === member.id ? { ...m, ...this.toMember(result.member), id: m.id } : m),
    );
  }

  private auditMemberToProfile(member: Member): MemberProfileData {
    return {
      id:                 member.id,
      name:               member.name,
      title:              member.designation,
      avatarUrl:          member.avatarUrl,
      subDivision:         member.subDivision,
      region:             member.region,
      yearsOfExperience:  member.yearsOfExperience,
      expertise:          member.expertise ? member.expertise.split(',').map(s => s.trim()) : [],
      workloadPct:        member.workloadPct,
      hourlyCostRate:     member.hourlyCostRate,
      assignedHours:      member.assignedHours,
      totalCapacityHours: member.totalCapacityHours,
      blocked:            !!member.blocked,
      email:              member.email || undefined,
      phone:              member.phone || undefined,
      teamsZoomId:        member.teamsZoomId,
      assignedSubDivisions: member.assignedSubDivisions,
      reportsTo:          member.reportsTo,
      directReports:      member.directReports,
      joinedAt:           member.createdAt,
    };
  }

  async viewMember(member: Member, ev: Event): Promise<void> {
    ev.stopPropagation();
    this.drawer.open<MemberProfileAction, MemberProfileData>(
      MemberProfileComponent,
      { width: MEMBER_DRAWER.ProfileWidth, data: this.auditMemberToProfile(member) },
    );
  }

  toggleBlocked(member: Member): void {
    this.membersData.update(list =>
      list.map(m => m.id === member.id ? { ...m, blocked: !m.blocked } : m),
    );
  }

  // ---------------- Confirm dialog (activate / deactivate) ----------------
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<MemberBlockAction>(MemberBlockActions.Deactivate);
  readonly confirmationTarget  = signal<Member | null>(null);

  openConfirmation(member: Member): void {
    this.confirmationAction.set(member.blocked ? MemberBlockActions.Activate : MemberBlockActions.Deactivate);
    this.confirmationTarget.set(member);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.confirmationTarget.set(null);
  }

  confirmToggleBlocked(): void {
    const m = this.confirmationTarget();
    if (m) this.toggleBlocked(m);
    this.closeConfirmation();
  }

  trackById = (_: number, m: Member) => m.id;

  workloadTier(pct: number): MemberWorkloadTier {
    if (pct >= MEMBER_WORKLOAD_THRESHOLDS.High) return MemberWorkloadTiers.High;
    if (pct >= MEMBER_WORKLOAD_THRESHOLDS.Mid) return MemberWorkloadTiers.Mid;
    return MemberWorkloadTiers.Low;
  }

  onAvatarError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img && img.src !== this.defaultAvatar) img.src = this.defaultAvatar;
  }

  // ---------------- Helpers ----------------
  private toMember(form: NewMemberFormModel): Member {
    return {
      id:                crypto.randomUUID(),
      name:              form.fullName ?? MEMBER_DEFAULT_NAME,
      designation:       this.lookupDesignationLabel(form.designation ?? ''),
      yearsOfExperience: form.yearsOfExperience ?? 0,
      expertise:         (form.expertise ?? []).join(', '),
      email:             form.email ?? '',
      phone:             form.phone ?? '',
      workloadPct:       form.totalCapacityHours
        ? Math.min(100, Math.round(((form.assignedHours ?? 0) / form.totalCapacityHours) * 100))
        : 0,
      hourlyCostRate:    form.hourlyCostRate ?? 0,
      assignedHours:     form.assignedHours ?? 0,
      totalCapacityHours: form.totalCapacityHours ?? 0,
      avatarUrl:         this.defaultAvatar,
      blocked:           false,
      createdAt:         new Date(),
    };
  }

  private toFormModel(member: Member): Partial<NewMemberFormModel> {
    return {
      fullName:           member.name,
      designation:        this.lookupDesignationCode(member.designation),
      yearsOfExperience:  member.yearsOfExperience,
      email:              member.email,
      phone:              member.phone,
      hourlyCostRate:     member.hourlyCostRate,
      assignedHours:      member.assignedHours,
      totalCapacityHours: member.totalCapacityHours,
    };
  }

  private lookupDesignationLabel(code: string): string {
    return MEMBER_DESIGNATION_LABEL_BY_CODE[code] ?? code;
  }

  private lookupDesignationCode(label: string): string {
    return MEMBER_DESIGNATION_CODE_BY_LABEL[label] ?? label;
  }
}

/* =====================================================================
 * Mock dataset — enriched to exercise every profile panel
 * ===================================================================== */
const AV = (_name: string) => MEMBER_PLACEHOLDER_AVATAR_URL;

const MOCK_MEMBERS: Member[] = [
  {
    id: '1', name: 'Michael Chen', designation: 'Audit Manager',
    yearsOfExperience: 10, expertise: 'AML, Treasury, Financial Crime',
    email: 'michael.chen@cygnus.ae', phone: '+971 50 110 0022',
    teamsZoomId: 'michael.chen',
    workloadPct: 80, hourlyCostRate: 120, assignedHours: 160, totalCapacityHours: 200,
    avatarUrl: AV('onyamalimba'), blocked: false, createdAt: new Date('2024-11-12'),
    subDivision: 'Financial Audit', region: 'UAE – Dubai',
    company: 'Crowe UAE', division: 'Dubai HQ',
    assignedSubDivisions: ['Finance', 'Treasury', 'AML'],
    reportsTo: { id: '6', name: 'Stephen Shaw', title: 'Audit Partner', avatarUrl: AV('stephenshaw') },
    directReports: [
      { id: '2', name: 'Amy Elsner',     title: 'Senior Auditor', avatarUrl: AV('amyelsner') },
      { id: '3', name: 'Asiya Javayant', title: 'Auditor',        avatarUrl: AV('asiyajavayant') },
      { id: '9', name: 'Elwin Sharvill', title: 'Junior Auditor', avatarUrl: AV('elwinsharvill') },
    ],
  },
  {
    id: '2', name: 'Amy Elsner', designation: 'Senior Auditor',
    yearsOfExperience: 7, expertise: 'Finance, HR, Payroll',
    email: 'amy.elsner@cygnus.ae', phone: '+971 55 222 3344',
    teamsZoomId: 'amy.elsner',
    workloadPct: 65, hourlyCostRate: 95, assignedHours: 130, totalCapacityHours: 200,
    avatarUrl: AV('amyelsner'), blocked: false, createdAt: new Date('2024-12-01'),
    subDivision: 'Financial Audit', region: 'UAE – Abu Dhabi',
    company: 'Crowe UAE', division: 'Abu Dhabi Branch',
    assignedSubDivisions: ['Finance', 'HR'],
    reportsTo: { id: '1', name: 'Michael Chen', title: 'Audit Manager', avatarUrl: AV('onyamalimba') },
  },
  {
    id: '3', name: 'Asiya Javayant', designation: 'Auditor',
    yearsOfExperience: 4, expertise: 'IT, Operations',
    email: 'asiya.j@cygnus.ae', phone: '+971 56 999 8877',
    workloadPct: 45, hourlyCostRate: 75, assignedHours: 90, totalCapacityHours: 200,
    avatarUrl: AV('asiyajavayant'), blocked: false, createdAt: new Date('2025-01-09'),
    subDivision: 'IT Audit', region: 'UAE – Dubai',
    company: 'Crowe UAE', division: 'Dubai HQ',
    assignedSubDivisions: ['IT', 'Operations'],
    reportsTo: { id: '1', name: 'Michael Chen', title: 'Audit Manager', avatarUrl: AV('onyamalimba') },
  },
  {
    id: '4', name: 'Ioni Bowcher', designation: 'Risk Officer',
    yearsOfExperience: 9, expertise: 'AML, Compliance, Regulatory',
    email: 'ioni.b@cygnus.ae', phone: '+971 50 411 5566',
    teamsZoomId: 'ioni.bowcher',
    workloadPct: 90, hourlyCostRate: 110, assignedHours: 180, totalCapacityHours: 200,
    avatarUrl: AV('ionibowcher'), blocked: false, createdAt: new Date('2025-02-18'),
    subDivision: 'Risk & Compliance', region: 'UAE – Sharjah',
    company: 'Crowe UAE', division: 'Sharjah Branch',
    assignedSubDivisions: ['AML', 'Compliance', 'Legal'],
    reportsTo: { id: '6', name: 'Stephen Shaw', title: 'Audit Partner', avatarUrl: AV('stephenshaw') },
    directReports: [
      { id: '7', name: 'Anna Fali', title: 'Compliance Officer', avatarUrl: AV('annafali') },
    ],
  },
  {
    id: '5', name: 'Xu Xuefeng', designation: 'Analyst',
    yearsOfExperience: 3, expertise: 'Finance, IT',
    email: 'xu.x@cygnus.ae', phone: '+971 55 100 2030',
    workloadPct: 30, hourlyCostRate: 65, assignedHours: 60, totalCapacityHours: 200,
    avatarUrl: AV('xuxuefeng'), blocked: false, createdAt: new Date('2025-03-22'),
    subDivision: 'Financial Audit', region: 'UAE – Dubai',
    company: 'Crowe UAE', division: 'Dubai HQ',
    assignedSubDivisions: ['Finance'],
    reportsTo: { id: '2', name: 'Amy Elsner', title: 'Senior Auditor', avatarUrl: AV('amyelsner') },
  },
  {
    id: '6', name: 'Stephen Shaw', designation: 'Audit Partner',
    yearsOfExperience: 15, expertise: 'Treasury, Finance, Strategy, Governance',
    email: 'stephen.s@cygnus.ae', phone: '+966 50 555 6677',
    teamsZoomId: 'stephen.shaw',
    workloadPct: 70, hourlyCostRate: 180, assignedHours: 140, totalCapacityHours: 200,
    avatarUrl: AV('stephenshaw'), blocked: false, createdAt: new Date('2025-04-05'),
    subDivision: 'Executive Audit', region: 'KSA – Riyadh',
    company: 'Crowe KSA', division: 'Riyadh Branch',
    assignedSubDivisions: ['Finance', 'Treasury', 'Risk & Compliance', 'IT Audit'],
    directReports: [
      { id: '1',  name: 'Michael Chen',  title: 'Audit Manager',  avatarUrl: AV('onyamalimba') },
      { id: '4',  name: 'Ioni Bowcher',  title: 'Risk Officer',   avatarUrl: AV('ionibowcher') },
      { id: '11', name: 'Onyama Limba',  title: 'Risk Officer',   avatarUrl: AV('onyamalimba') },
    ],
  },
  {
    id: '7', name: 'Anna Fali', designation: 'Compliance Officer',
    yearsOfExperience: 6, expertise: 'HR, Operations, Policy',
    email: 'anna.f@cygnus.ae', phone: '+974 33 220 1100',
    teamsZoomId: 'anna.fali',
    workloadPct: 55, hourlyCostRate: 90, assignedHours: 110, totalCapacityHours: 200,
    avatarUrl: AV('annafali'), blocked: true, createdAt: new Date('2025-06-14'),
    subDivision: 'Risk & Compliance', region: 'Qatar – Doha',
    company: 'Crowe Qatar', division: 'Doha Office',
    assignedSubDivisions: ['HR', 'Operations'],
    reportsTo: { id: '4', name: 'Ioni Bowcher', title: 'Risk Officer', avatarUrl: AV('ionibowcher') },
  },
  {
    id: '8', name: 'Bernardo Dominic', designation: 'Senior Auditor',
    yearsOfExperience: 8, expertise: 'AML, IT, Cybersecurity',
    email: 'bernardo.d@cygnus.ae', phone: '+965 99 888 7766',
    teamsZoomId: 'bernardo.dominic',
    workloadPct: 85, hourlyCostRate: 105, assignedHours: 170, totalCapacityHours: 200,
    avatarUrl: AV('bernardodominic'), blocked: false, createdAt: new Date('2025-07-30'),
    subDivision: 'IT Audit', region: 'Kuwait – Kuwait City',
    company: 'Crowe Kuwait', division: 'Kuwait City Office',
    assignedSubDivisions: ['IT', 'AML'],
    reportsTo: { id: '6', name: 'Stephen Shaw', title: 'Audit Partner', avatarUrl: AV('stephenshaw') },
    directReports: [
      { id: '10', name: 'Ivan Magalhaes', title: 'Auditor', avatarUrl: AV('ivanmagalhaes') },
    ],
  },
  {
    id: '9', name: 'Elwin Sharvill', designation: 'Junior Auditor',
    yearsOfExperience: 2, expertise: 'Finance',
    email: 'elwin.s@cygnus.ae', phone: '+973 36 770 4433',
    workloadPct: 40, hourlyCostRate: 55, assignedHours: 80, totalCapacityHours: 200,
    avatarUrl: AV('elwinsharvill'), blocked: false, createdAt: new Date('2025-08-19'),
    subDivision: 'Financial Audit', region: 'Bahrain – Manama',
    company: 'Crowe Bahrain', division: 'Manama Office',
    assignedSubDivisions: ['Finance'],
    reportsTo: { id: '1', name: 'Michael Chen', title: 'Audit Manager', avatarUrl: AV('onyamalimba') },
  },
  {
    id: '10', name: 'Ivan Magalhaes', designation: 'Auditor',
    yearsOfExperience: 5, expertise: 'IT, Operations',
    email: 'ivan.m@cygnus.ae', phone: '+968 92 113 2233',
    workloadPct: 60, hourlyCostRate: 80, assignedHours: 120, totalCapacityHours: 200,
    avatarUrl: AV('ivanmagalhaes'), blocked: false, createdAt: new Date('2025-09-08'),
    subDivision: 'IT Audit', region: 'Oman – Muscat',
    company: 'Crowe Oman', division: 'Muscat Office',
    assignedSubDivisions: ['IT', 'Operations'],
    reportsTo: { id: '8', name: 'Bernardo Dominic', title: 'Senior Auditor', avatarUrl: AV('bernardodominic') },
  },
  {
    id: '11', name: 'Onyama Limba', designation: 'Risk Officer',
    yearsOfExperience: 11, expertise: 'AML, Treasury, HR',
    email: 'onyama.l@cygnus.ae', phone: '+966 54 322 1100',
    teamsZoomId: 'onyama.limba',
    workloadPct: 95, hourlyCostRate: 125, assignedHours: 190, totalCapacityHours: 200,
    avatarUrl: AV('onyamalimba'), blocked: false, createdAt: new Date('2026-01-15'),
    subDivision: 'Risk & Compliance', region: 'KSA – Jeddah',
    company: 'Crowe KSA', division: 'Jeddah Branch',
    assignedSubDivisions: ['AML', 'Treasury', 'HR'],
    reportsTo: { id: '6', name: 'Stephen Shaw', title: 'Audit Partner', avatarUrl: AV('stephenshaw') },
    directReports: [
      { id: '12', name: 'Reem Al Dosari', title: 'Analyst', avatarUrl: AV('amyelsner') },
    ],
  },
  {
    id: '12', name: 'Reem Al Dosari', designation: 'Analyst',
    yearsOfExperience: 4, expertise: 'Operations, IT',
    email: 'reem.d@cygnus.ae', phone: '+966 56 778 9900',
    workloadPct: 35, hourlyCostRate: 70, assignedHours: 70, totalCapacityHours: 200,
    avatarUrl: AV('amyelsner'), blocked: false, createdAt: new Date('2026-03-22'),
    subDivision: 'Risk & Compliance', region: 'KSA – Riyadh',
    company: 'Crowe KSA', division: 'Riyadh Branch',
    assignedSubDivisions: ['Operations', 'IT'],
    reportsTo: { id: '11', name: 'Onyama Limba', title: 'Risk Officer', avatarUrl: AV('onyamalimba') },
  },
];