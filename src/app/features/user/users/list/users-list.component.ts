import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  startWith,
} from 'rxjs';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Popover, PopoverModule } from 'primeng/popover';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  User,
  UserFormModel,
  UserRole,
  UserService,
  UserStatus,
} from '@/app/features/user/users/services/users.service';
import {
  AddUserModalComponent,
  AddUserResult,
} from '../manage/users.component';
import {
  UserProfileComponent,
  UserProfileAction,
} from '../profile/users-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';

// Shared Company → Division → Sub-division static data — same file the Add User
// drawer (and every other Company/Division/Sub-division field in the app) now
// reads from. The Company/Division/Sub-division FILTER lists below used to be
// derived from whatever values happened to be present on the loaded users
// (this.usersData()) — so a company with zero users currently loaded simply
// never showed up as a filter option, and there was no cascading guarantee
// that a "Division" option actually belonged to the selected "Company". Both
// are now sourced from the full company-org-data.ts roster instead, cascading
// Division off selectedCompanies() and Sub-division off selectedCompanies() +
// selectedDivisions(), same pattern as the Regulation Library / Working
// Papers / Risk & Execution Approval filter panels.
//
// NOTE: reportsToFilterOptions is left untouched — "reports to" is genuinely
// user-specific (a manager's name), not organisational static data, so it
// still has to come from whichever users are actually loaded.
//
// CAVEAT: UserService may still return `company`/`subDivision` values on real
// User records that don't match company-org-data.ts's names exactly — the
// filters below will only match users whose `company`/`subDivision` fields
// already line up with ORG_STATIC_DATA — worth checking once UserService's
// real backing data is available.



type ViewMode = 'grid' | 'list';
type SortOption = 'name_asc' | 'name_desc' | 'recent' | 'last_login';

/**
 * User augmented with `reportsTo`, which the filters read; kept optional here
 * so the component compiles whether or not the base `User` model declares it.
 */
type UserOrg = User & { reportsTo?: string };

/** Company → Division → Sub-division roster the filter options read from —
 *  the static internal-audit org file in 'internal-audit' mode (the same
 *  roster UserService seeds each user's company/division/sub-division from),
 *  the multi-company roster otherwise. */
const ACTIVE_ORG_DATA =
  CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

@Component({
  selector: 'app-users-list',
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
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {

  @ViewChild('filterPanel') filterPanel!: Popover;

  private readonly fb          = inject(FormBuilder);
  private readonly drawer      = inject(RightDrawerService);
  private readonly destroyRef  = inject(DestroyRef);
  private readonly userService = inject(UserService);

  /* ---------------- Filters (reactive form: search + sort) ---------------- */
  readonly filters = this.fb.group({
    search:  [''],
    sortBy:  ['name_asc' as SortOption],
  });

  /* ---------------- Filters (popover panel: signal-based) ---------------- */
  readonly selectedRoles        = signal<UserRole[]>([]);
  readonly selectedStatuses     = signal<UserStatus[]>([]);
  readonly selectedCompanies    = signal<string[]>([]);
  readonly selectedDivisions    = signal<string[]>([]);
  readonly selectedSubDivisions = signal<string[]>([]);
  readonly selectedReportsTo    = signal<string[]>([]);

  private readonly filtersSignal: Signal<typeof this.filters.value>;

  /**
   * Backing store for the visible user list. Deliberately a plain writable
   * signal we .set() ourselves on every fetch — NOT toSignal(getAll()) —
   * because UserService.getAll() returns a one-shot snapshot Observable
   * (of(list).pipe(delay(150))) that completes after a single emission.
   * A toSignal() subscription taken once at construction would freeze on
   * that first snapshot forever; refresh() calling getAll() again would
   * fetch the current (mutated) store correctly, but there'd be nowhere
   * to put the result. Setting it here is what makes a newly
   * created/edited user actually show up in the list.
   */
  private readonly usersDataSignal = signal<User[]>([]);
  private readonly usersData: Signal<User[]> = this.usersDataSignal.asReadonly();
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  /* ---------------- Page-level state ---------------- */
  readonly viewMode    = signal<ViewMode>('grid');
  readonly currentPage = signal(1);
  readonly pageSize    = signal(10);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  readonly loadingUserId = signal<string | null>(null);

  /* ---------------- Data ---------------- */

  readonly filteredUsers = computed<User[]>(() => {
    const all = this.usersData();
    const f   = this.filtersSignal();

    let result = [...all];

    const q = (f?.search ?? '').trim().toLowerCase();
    if (q) {
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.subDivision ?? '').toLowerCase().includes(q),
      );
    }

    const roles = this.selectedRoles();
    if (roles.length) result = result.filter(u => roles.includes(u.role));

    const statuses = this.selectedStatuses();
    if (statuses.length) result = result.filter(u => statuses.includes(u.status));

    const companies = this.selectedCompanies();
    if (companies.length) result = result.filter(u => !!u.company && companies.includes(u.company));

    const divisions = this.selectedDivisions();
    if (divisions.length) result = result.filter(u => !!u.division && divisions.includes(u.division));

    const subDivisions = this.effectiveSubDivisions();
    if (subDivisions.length) result = result.filter(u => !!u.subDivision && subDivisions.includes(u.subDivision));

    const reportsTo = this.selectedReportsTo();
    if (reportsTo.length) result = result.filter(u => {
      const r = (u as UserOrg).reportsTo;
      return !!r && reportsTo.includes(r);
    });

    switch (f?.sortBy ?? 'name_asc') {
      case 'name_asc':
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'name_desc':
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'recent':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'last_login':
        result.sort((a, b) =>
          (b.lastLoginAt?.getTime() ?? 0) - (a.lastLoginAt?.getTime() ?? 0),
        );
        break;
    }

    return result;
  });

  readonly pagedUsers = computed<User[]>(() => {
    const filtered = this.filteredUsers();
    const size     = this.pageSize();
    const start    = (this.currentPage() - 1) * size;
    return filtered.slice(start, start + size);
  });

  readonly totalCount = computed(() => this.filteredUsers().length);

  /* ---------------- Dropdown options ---------------- */
  readonly sortOptions = [
    { label: $localize`:@@user.sortNameAsc:Name (A–Z)`, value: 'name_asc' },
    { label: $localize`:@@user.sortNameDesc:Name (Z–A)`, value: 'name_desc' },
    { label: $localize`:@@user.sortRecentlyAdded:Recently Added`, value: 'recent' },
  ];

  readonly roleFilterOptions = [
    { label: $localize`:@@common.admin:Admin`, value: 'admin' },
    { label: $localize`:@@common.manager:Manager`, value: 'manager' },
    { label: $localize`:@@common.auditor:Auditor`, value: 'auditor' },
    { label: $localize`:@@common.viewer:Viewer`, value: 'viewer' },
  ];

  readonly statusFilterOptions: { label: string; value: UserStatus }[] = [
    { label: $localize`:@@common.active:Active`,      value: 'active'    },
    { label: $localize`:@@common.pending:Pending`,     value: 'pending'   },
    { label: $localize`:@@common.suspended:Suspended`,   value: 'suspended' },
  ];

  /** True when this build is running in single-company "internal audit" mode. */
  readonly isInternalAuditMode = CLIENT_MODE_VALUE === 'internal-audit';

  /* Company/Division/Sub-Division filter options — sourced from the shared
   * company-org-data.ts roster (see import comment above), cascading the
   * same way the Regulation Library / Working Papers / Approval filter
   * panels do. */
  readonly companyFilterOptions = computed<{ label: string; value: string }[]>(() =>
    ACTIVE_ORG_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /* ACTIVE_ORG_DATA already switches to the internal-audit org in
   * 'internal-audit' mode, so one code path covers both modes. */
  readonly divisionFilterOptions = computed<{ label: string; value: string }[]>(() => {
    const selectedCompanies = this.selectedCompanies();
    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(d => d.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  readonly subDivisionFilterOptions = computed<{ label: string; value: string }[]>(() => {
    const selectedCompanies = this.selectedCompanies();
    const selectedDivisions = this.selectedDivisions();
    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    // Divisions flagged hasSubDivision:false still carry a subDivisions array
    // in the seed data, so skip them explicitly.
    const divisions = companies.flatMap(c => c.divisions)
      .filter(d => d.hasSubDivision !== false)
      .filter(d => !selectedDivisions.length || selectedDivisions.includes(d.divisionName));
    const names = new Set(divisions.flatMap(d => d.subDivisions).map(sd => sd.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /* Sub-Division filter is hidden only when every selected Division (looked
   * up in the selected Companies, or all of ACTIVE_ORG_DATA) is flagged
   * hasSubDivision:false. Unknown divisions count as having sub-divisions. */
  readonly subDivisionFilterVisible = computed<boolean>(() => {
    const selectedDivisions = this.selectedDivisions();
    if (!selectedDivisions.length) return true;
    const selectedCompanies = this.selectedCompanies();
    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const divisions = companies.flatMap(c => c.divisions);
    return selectedDivisions.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  /** Sub-Division selection actually applied — ignored while the filter is hidden. */
  private readonly effectiveSubDivisions = computed<string[]>(() =>
    this.subDivisionFilterVisible() ? this.selectedSubDivisions() : [],
  );

  /* "Reports To" stays derived from the loaded users themselves — it's a
   * manager's name, not organisational static data. */
  readonly reportsToFilterOptions = computed(() => {
    const companies    = this.selectedCompanies();
    const divisions    = this.selectedDivisions();
    const subDivisions = this.effectiveSubDivisions();
    let list = this.usersData() as UserOrg[];
    if (companies.length)    list = list.filter(u => !!u.company    && companies.includes(u.company));
    if (divisions.length)    list = list.filter(u => !!u.division   && divisions.includes(u.division));
    if (subDivisions.length) list = list.filter(u => !!u.subDivision && subDivisions.includes(u.subDivision));
    const set = new Set(list.map(u => u.reportsTo).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /* ---------------- Active filter count / chips ---------------- */
  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedRoles().length)        n++;
    if (this.selectedStatuses().length)     n++;
    if (this.selectedCompanies().length)    n++;
    if (this.selectedDivisions().length)    n++;
    if (this.selectedSubDivisions().length) n++;
    if (this.selectedReportsTo().length)    n++;
    return n;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: string; label: string }[] = [];
    if (this.selectedRoles().length)        chips.push({ key: 'roles',        label: $localize`:@@user.activeRoleFilter:Role: ${this.selectedRoles().length}`       });
    if (this.selectedStatuses().length)     chips.push({ key: 'statuses',     label: $localize`:@@user.activeStatusFilter:Status: ${this.selectedStatuses().length}`   });
    if (this.selectedCompanies().length)    chips.push({ key: 'companies',    label: $localize`:@@user.activeCompanyFilter:Company: ${this.selectedCompanies().length}` });
    if (this.selectedDivisions().length)    chips.push({ key: 'divisions',    label: $localize`:@@user.activeDivisionFilter:Division: ${this.selectedDivisions().length}`   });
    if (this.selectedSubDivisions().length) chips.push({ key: 'subDivisions', label: $localize`:@@user.activeSubDivisionFilter:Sub-Division: ${this.selectedSubDivisions().length}`  });
    if (this.selectedReportsTo().length)    chips.push({ key: 'reportsTo',    label: $localize`:@@user.activeReportsToFilter:Reports To: ${this.selectedReportsTo().length}` });
    return chips;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.selectedRoles().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedReportsTo().length,
  );

  /* ---------------- Constructor ---------------- */
  constructor() {
    this.filtersSignal = toSignal(
      this.filters.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged((a, b) =>
          a.search === b.search &&
          a.sortBy === b.sortBy,
        ),
        startWith(this.filters.value),
      ),
      { initialValue: this.filters.value },
    );
    this.userService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => this.usersDataSignal.set(users));
    this.filters.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.currentPage.set(1));
  }

  /* ---------------- Filter handlers (popover) ---------------- */
  onRolesChange(v: UserRole[]): void       { this.selectedRoles.set(v ?? []);       this.currentPage.set(1); }
  onStatusesChange(v: UserStatus[]): void  { this.selectedStatuses.set(v ?? []);    this.currentPage.set(1); }
  onCompaniesChange(v: string[]): void     { this.selectedCompanies.set(v ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedReportsTo.set([]); this.currentPage.set(1); }
  onDivisionsChange(v: string[]): void     { this.selectedDivisions.set(v ?? []);    this.selectedSubDivisions.set([]); this.selectedReportsTo.set([]); this.currentPage.set(1); }
  onSubDivisionsChange(v: string[]): void  { this.selectedSubDivisions.set(v ?? []); this.selectedReportsTo.set([]); this.currentPage.set(1); }
  onReportsToChange(v: string[]): void     { this.selectedReportsTo.set(v ?? []);   this.currentPage.set(1); }

  removeFilter(key: string): void {
    switch (key) {
      case 'roles':        this.selectedRoles.set([]);        break;
      case 'statuses':     this.selectedStatuses.set([]);     break;
      case 'companies':    this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedReportsTo.set([]); break;
      case 'divisions':    this.selectedDivisions.set([]);    this.selectedSubDivisions.set([]); this.selectedReportsTo.set([]); break;
      case 'subDivisions': this.selectedSubDivisions.set([]); this.selectedReportsTo.set([]); break;
      case 'reportsTo':    this.selectedReportsTo.set([]);    break;
    }
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.selectedRoles.set([]);
    this.selectedStatuses.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedReportsTo.set([]);
    this.currentPage.set(1);
  }

  /* ---------------- View mode + pagination ---------------- */
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

  /* ---------------- Actions ---------------- */
  async openAddUser(): Promise<void> {
    const ref = this.drawer.open<AddUserResult>(AddUserModalComponent, {
      width: '640px',
      data: { mode: 'create' },
    });
    const result = await ref.afterClosed;
    if (!result || result.mode !== 'create') return;

    await firstValueFrom(this.userService.create(result.form));
    if (result.form.sendInvitation && result.form.status === 'pending') {
      this.userService.sendInvitation('new-user-id').subscribe();
    }
    this.refresh();
  }

  async editUser(user: User): Promise<void> {
    const ref = this.drawer.open<AddUserResult>(AddUserModalComponent, {
      width: '640px',
      data: {
        mode: 'edit',
        existing: {
          id:               user.id,
          fullName:         user.fullName,
          email:            user.email,
          phone:            user.phone,
          role:             user.role,
          // Company/Division must be patched before Sub-division — the drawer's
          // form.patchValue() applies keys in this object's own property
          // order, and Company/Division cascade-reset Sub-division via
          // valueChanges subscriptions set up before patchValue() runs.
          company:          user.company,
          division:         user.division,
          subDivision:      user.subDivision,
          status:           user.status,
          twoFactorEnabled: !!user.twoFactorEnabled,
        },
      },
    });
    const result = await ref.afterClosed;
    if (!result || result.mode !== 'edit' || !result.userId) return;

    await firstValueFrom(this.userService.update(result.userId, result.form));
    this.refresh();
  }

  async viewUser(user: User): Promise<void> {
    if (this.loadingUserId()) return;
    this.loadingUserId.set(user.id);

    let full: User;
    try {
      const fetched = await firstValueFrom(this.userService.getById(user.id));
      if (!fetched) return;
      full = fetched;
    } catch (err) {
      console.error('Failed to load user', err);
      return;
    } finally {
      this.loadingUserId.set(null);
    }

    const ref = this.drawer.open<UserProfileAction, User>(
      UserProfileComponent,
      { width: '760px', data: full },
    );
    const action = await ref.afterClosed;
    if (!action) return;

    switch (action.kind) {
      case 'edit':
        this.editUser(full);
        break;
      case 'toggle-status':
        await firstValueFrom(this.userService.setStatus(action.userId, action.nextStatus));
        this.refresh();
        break;
      case 'resend-invitation':
        await firstValueFrom(this.userService.sendInvitation(action.userId));
        break;
      case 'reset-password':
        console.log('Reset password (stub) for user', action.userId);
        break;
      case 'delete':
        this.openConfirmation(full);
        break;
    }
  }

  /* ---------------- Confirm dialog (activate / deactivate) -------------- */
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<'Activate' | 'Deactivate'>('Deactivate');
  readonly confirmationTarget  = signal<User | null>(null);

  openConfirmation(user: User): void {
    this.confirmationAction.set(user.status === 'active' ? 'Deactivate' : 'Activate');
    this.confirmationTarget.set(user);
    this.displayConfirmation.set(true);
  }

  /** Kept for profile-drawer "delete" action — reuses the same confirm flow. */
  openDeleteConfirmation(user: User): void {
    this.openConfirmation(user);
  }

  async confirmToggleBlocked(): Promise<void> {
    const u = this.confirmationTarget();
    if (!u) return;
    const nextStatus: UserStatus = u.status === 'active' ? 'suspended' : 'active';
    await firstValueFrom(this.userService.setStatus(u.id, nextStatus));
    this.closeConfirmation();
    this.refresh();
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.confirmationTarget.set(null);
  }

  /* ---------------- Helpers ---------------- */
  isInactive(user: User): boolean {
    return user.status === 'suspended' || user.status === 'deleted';
  }

  private refresh(): void {
    this.userService.getAll().subscribe(users => this.usersDataSignal.set(users));
  }

  trackById = (_: number, u: User) => u.id;

  roleLabel(role: UserRole): string     { return ROLE_LABEL[role]; }
  statusLabel(status: UserStatus): string { return STATUS_LABEL[status]; }

  lastLoginRelative(d?: Date): string {
    if (!d) return $localize`:@@common.never:Never`;
    const date = d instanceof Date ? d : new Date(d);
    const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
    if (mins < 1) return $localize`:@@common.justNow:Just now`;
    if (mins < 60)   return $localize`:@@common.minutesAgo:${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)    return $localize`:@@common.hoursAgo:${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30)   return $localize`:@@common.daysAgo:${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return $localize`:@@common.monthsAgo:${months}mo ago`;
    return $localize`:@@common.yearsAgo:${Math.floor(months / 12)}y ago`;
  }

  subDivisionPlaceholder(): string {
    return this.subDivisionFilterVisible()
      ? $localize`:@@user.allSubDivisions:All sub-divisions`
      : $localize`:@@user.noSubDivisions:No sub-divisions for this division`;
  }
}

/* ============================================================
 *  Display dictionaries
 * ============================================================ */
const ROLE_LABEL: Record<UserRole, string> = {
  admin: $localize`:@@common.admin:Admin`,
  manager: $localize`:@@common.manager:Manager`,
  auditor: $localize`:@@common.auditor:Auditor`,
  viewer: $localize`:@@common.viewer:Viewer`,
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: $localize`:@@common.active:Active`,
  pending: $localize`:@@common.pending:Pending`,
  suspended: $localize`:@@common.suspended:Suspended`,
  deleted: $localize`:@@common.deleted:Deleted`,
};