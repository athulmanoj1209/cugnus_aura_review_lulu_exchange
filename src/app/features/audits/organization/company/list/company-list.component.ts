import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { Division } from '@/app/features/audits/organization/divisions/models/division-list.model';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  AddCompanyModalComponent,
  CompanyFormModel,
} from '../manage/company.component';
import {  CompanyProfileComponent, CompanyProfileData } from '../profile/company-profile.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

// Global company data store — see company-data.service.ts.
// Every component that needs company data injects this service instead of
// importing a local copy, so all screens read/write the same store.

import { Company as CompanyRecord, OrgStatus } from '../models/company.model';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import {
  CompanyBlockActions,
  CompanyDrawerTypes,
  CompanySortOptions,
  CompanyViewModes,
  type CompanySortOption,
  type CompanyViewMode,
  COMPANY_DEFAULT_CREATED_AT,
  COMPANY_DEFAULT_NAME,
  COMPANY_DRAWER,
  COMPANY_LIST_PAGE_SIZE,
  COMPANY_ORG_CHART_ROUTE,
  COMPANY_PAGE_SIZE_OPTIONS,
  COMPANY_SEARCH_DEBOUNCE_MS,
} from '../constants/company.constants';
import {
  COMPANY_AUDIT_CYCLE_LABELS,
  COMPANY_COUNTRY_LABELS,
  COMPANY_ORG_STATUS_LABELS,
  COMPANY_ORG_STATUS_SEVERITY,
  COMPANY_OWNERSHIP_LABELS,
  COMPANY_REGION_LABELS,
  COMPANY_RISK_OWNER_LABELS,
  COMPANY_SORT_OPTIONS,
} from '../constants/company-labels.constants';
import {
  COMPANY_PRIMARY_CONTACT_ROLE,
  COMPANY_PROFILE_LOAD_ERROR,
} from '../constants/company-messages.constants';

/**
 * Domain model for the list view. Distinct from the form payload —
 * the form returns CompanyFormModel; we convert into Company before
 * inserting into our list.
 */
export interface Company {
  id: string;
  name: string;
  entityType: string;         // e.g. "LLC"
  industry: string;           // e.g. "Construction & Real Estate"
  location: string;           // e.g. "United Arab Emirates"
  primaryContact: {
    name: string;
    phone: string;
    avatarUrl?: string;
  };
  blocked: boolean;
  createdAt: Date;
  orgStatus?: OrgStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;
  /**
   * Full source record from the global CompanyDataService (populated when
   * hydrated from the shared store, or from the Add/Edit Company form).
   * The list view only needs the lean fields above, but keeping the full
   * record around lets the profile drawer — and re-opening the Edit form —
   * show every field the form actually captures (registration no.,
   * address, regulatory, financial, risk & audit) instead of just the
   * list-display subset.
   */
  raw?: CompanyRecord;
}

type ViewMode = CompanyViewMode;
type SortOption = CompanySortOption;

interface FilterForm {
  search: string;
  sortBy: SortOption;
}

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    TagModule,
    PaginationBarComponent,DrawIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompaniesListComponent {

  private readonly fb = inject(FormBuilder);
  private readonly drawer = inject(RightDrawerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly companyData = inject(CompanyDataService);
   readonly loadingCompanyId = signal<string | null>(null);


  // ---------------- Filter form (reactive) ----------------
  readonly filters = this.fb.group({
    search: [''],
    sortBy: [CompanySortOptions.NameAsc as SortOption],
  });

  /** Debounced + de-duped form value as a signal. */
  private readonly filtersSignal = toSignal(
    this.filters.valueChanges.pipe(
      debounceTime(COMPANY_SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(
        (a, b) => a.search === b.search && a.sortBy === b.sortBy,
      ),
      startWith(this.filters.value),
    ),
    { initialValue: this.filters.value },
  );

  // ---------------- Page-level state ----------------
  readonly viewMode = signal<ViewMode>(CompanyViewModes.Grid);
  readonly currentPage = signal(1);
  readonly pageSize = signal(COMPANY_LIST_PAGE_SIZE);

  // Exposed for the template.
  readonly CompanyViewModes = CompanyViewModes;
  readonly CompanyBlockActions = CompanyBlockActions;

  // ---------------- Data ----------------
  /**
   * Source of truth is CompanyDataService (global, DI-injected) — this is
   * just the list-view projection of it. Because it's a computed() driven
   * by the service's signal, any mutation made here (or from any other
   * component sharing the service) is reflected automatically.
   */
  private readonly companiesData = computed<Company[]>(() =>
    this.companyData.companies().map(c => this.toListCompany(c)),
  );

  /** Filtered + sorted view. */
  readonly filteredCompanies = computed<Company[]>(() => {
    const all = this.companiesData();
    const { search, sortBy } = this.filtersSignal() ?? {};

    let result = [...all];

    const q = (search ?? '').trim().toLowerCase();
    if (q) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.entityType.toLowerCase().includes(q),
      );
    }

    switch (sortBy ?? CompanySortOptions.NameAsc) {
      case CompanySortOptions.NameAsc:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case CompanySortOptions.NameDesc:
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case CompanySortOptions.Recent:
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
          }

    return result;
  });

  /** The current page slice. */
  readonly pagedCompanies = computed<Company[]>(() => {
    const filtered = this.filteredCompanies();
    const size = this.pageSize();
    const start = (this.currentPage() - 1) * size;
    return filtered.slice(start, start + size);
  });

  readonly totalCount = computed(() => this.filteredCompanies().length);

  // ---------------- Dropdown options ----------------
  readonly sortOptions: { label: string; value: SortOption }[] = COMPANY_SORT_OPTIONS;

  /** Options for the "items per page" dropdown in <app-pagination-bar>. */
  readonly pageSizeOptions: number[] = COMPANY_PAGE_SIZE_OPTIONS;

  // ---------------- Approval status chip (orgStatus) ----------------
  readonly orgStatusLabel = COMPANY_ORG_STATUS_LABELS;

  readonly orgStatusSeverity = COMPANY_ORG_STATUS_SEVERITY;

  // ---------------- Constructor / setup ----------------
  constructor() {
    // Reset to page 1 whenever filters change
    this.filters.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.currentPage.set(1));
  }

  // ---------------- Actions ----------------
  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

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

  async openAddCompany(): Promise<void> {
    const ref = this.drawer.open<CompanyFormModel>(AddCompanyModalComponent, {
     // ariaLabel: 'Add new company',
      width: COMPANY_DRAWER.FormWidth,
    });
    const result = await ref.afterClosed;
    if (result) {
      this.companyData.add(this.toCompanyRecord(result));
    }
  }

  async editCompany(company: Company): Promise<void> {
    const ref = this.drawer.open<CompanyFormModel>(AddCompanyModalComponent, {
     // ariaLabel: `Edit ${company.name}`,
      data: { existing: this.toFormModel(company),type: CompanyDrawerTypes.Edit },
       width: COMPANY_DRAWER.FormWidth,
    });
    const result = await ref.afterClosed;
    if (result) {
      this.companyData.update(
        company.id,
        this.toCompanyRecord(result, company.id, company.raw),
      );
    }
  }

async viewCompany(company: Company): Promise<void> {
  if (this.loadingCompanyId()) return;                       // dedupe double clicks
  this.loadingCompanyId.set(company.id);

  let profile: CompanyProfileData;
  try {
    // Build the profile from the row that was actually clicked.
    // Swap this for a real backend call when one is available, e.g.:
    // const fetched = await firstValueFrom(this.companiesApi.getById(company.id));
    const fetched = this.companyToProfile(company);
    if (!fetched) return;                                    // 404
    profile = fetched;
  } catch (err) {
    console.error(COMPANY_PROFILE_LOAD_ERROR, err);
    return;
  } finally {
    this.loadingCompanyId.set(null);
  }

  this.drawer.open(CompanyProfileComponent, { data: profile, width: COMPANY_DRAWER.ProfileWidth });
}


  /**
   * Maps the lean list model — enriched with the full source record in
   * `raw` when available — onto every field the profile drawer can show.
   */
  private companyToProfile(company: Company): CompanyProfileData {
    const r = company.raw;

    return {
      id:            company.id,
      name:          company.name,
      logoUrl:       undefined,
      entityType:    r?.typeOfEntity ?? company.entityType,
      industry:      r?.industrySector ?? company.industry,
      ownershipType: r?.ownershipType ? this.lookupOwnershipLabel(r.ownershipType) : undefined,
      blocked:       company.blocked,

      // ---- Location -----------------------------------------------
      country: r?.countryOfIncorporation ? this.lookupCountryLabel(r.countryOfIncorporation) : company.location,
      region:  r?.regionEmirate ? this.lookupRegionLabel(r.regionEmirate) : undefined,
      city:    r?.city ?? undefined,
      address: r?.address ?? undefined,

      // ---- Contact ---------------------------------------------------
      email:   r?.email ?? undefined,
      phone:   r?.phone ?? company.primaryContact.phone,
      website: r?.website ?? undefined,

      // ---- Registration ------------------------------------------------
      tradeLegalRegNumber: r?.tradeLegalRegNumber ?? undefined,
      dateOfIncorporation: r?.dateOfIncorporation ?? undefined,
      parentCompany:       r?.parentCompany ?? undefined,
      groupAffiliation:    r?.groupAffiliation ?? undefined,
      notes:               r?.notes ?? undefined,

      // ---- Regulatory --------------------------------------------------
      isRegulated:             r?.isRegulated ?? undefined,
      regIndustry:             r?.regIndustry ?? undefined,
      regulatoryLicenseNumber: r?.regulatoryLicenseNumber ?? undefined,
      licenseExpiryDate:       r?.licenseExpiryDate ?? undefined,
      regulatoryNotes:         r?.regulatoryNotes ?? undefined,

      // ---- Financial & Operational ---------------------------------
      currencyAccount:              r?.currencyAccount ?? undefined,
      annualTurnoverBracket:        r?.annualTurnoverBracket ?? undefined,
      numberOfEmployees:            r?.numberOfEmployees ?? undefined,
      numberOfSubDivisionsLocations: r?.numberOfSubDivisionsLocations ?? undefined,
      fiscalYearStart:              r?.fiscalYearStart ?? undefined,
      treasuryFunctionsPresent:     r?.treasuryFunctionsPresent ?? undefined,
      cashHandlingInvolved:         r?.cashHandlingInvolved ?? undefined,

      // ---- Risk & Audit ----------------------------------------------
      riskRating:            r?.riskRating ?? undefined,
      riskOwner:             r?.riskOwner ? this.lookupRiskOwnerLabel(r.riskOwner) : undefined,
      lastAuditDate:         r?.lastAuditDate ?? undefined,
      nextPlannedAuditCycle: r?.nextPlannedAuditCycle ? this.lookupAuditCycleLabel(r.nextPlannedAuditCycle) : undefined,
      residualRiskScore:     r?.residualRiskScore ?? undefined,
      riskNotes:             r?.riskNotes ?? undefined,

      primaryContact: company.primaryContact
        ? {
            name:      company.primaryContact.name,
            phone:     company.primaryContact.phone,
            avatarUrl: company.primaryContact.avatarUrl,
            role:      COMPANY_PRIMARY_CONTACT_ROLE,
          }
        : undefined,
    };
  }


  toggleBlocked(company: Company): void {
    this.companyData.toggleBlocked(company.id);
  }

  trackById = (_: number, c: Company) => c.id;

  // ---------------- Helpers ----------------

  /**
   * Maps a shared-store record (CompanyDataService) onto the lean
   * list-view model. This replaces the old module-level `MOCK_COMPANIES`
   * constant — it has to be an instance method now since the source data
   * comes from an injected service rather than a static import.
   */
  private toListCompany(c: CompanyRecord): Company {
    return {
      id: c.id,
      name: c.companyName,
      entityType: c.typeOfEntity ?? '',
      // Fall back to the seed's own `industry` (e.g. "jewelry") when the
      // richer `industrySector` profile field hasn't been filled in yet.
      industry: c.industrySector ?? c.industry ?? '',
      location: this.lookupCountryLabel(c.countryOfIncorporation ?? ''),
      primaryContact: {
        name: c.email ?? '',
        phone: c.phone ?? '',
      },
      blocked: c.blocked ?? false,
      createdAt: new Date(c.dateOfIncorporation ?? COMPANY_DEFAULT_CREATED_AT),
      orgStatus: c.orgStatus,
      submittedBy: c.submittedBy,
      submittedDate: c.submittedDate,
      dueDate: c.dueDate,
      raw: c,
    };
  }

  /**
   * Builds a shared-store record from the Add/Edit Company form payload.
   * - When adding, `existingId`/`base` are omitted: a fresh id is minted.
   * - When editing, pass the company's own id and its current raw record
   *   so `blocked` (and any other store-only state) is preserved instead
   *   of being wiped out by the profile-only edit.
   */
  private toCompanyRecord(
    form: CompanyFormModel,
    existingId?: string,
    base?: CompanyRecord,
  ): CompanyRecord {
    return {
      ...form,
      id: existingId ?? crypto.randomUUID(),
      companyName: form.companyName ?? COMPANY_DEFAULT_NAME,
      blocked: base?.blocked ?? false,
    } as CompanyRecord;
  }

  private toFormModel(company: Company): CompanyFormModel {
    const r = company.raw;
    if (r) {
      // The stored source record already mirrors the form's field names —
      // pass it straight through so every tab (Regulatory, Financial,
      // Risk & Audit) re-hydrates, not just Basic Information.
      return {
        companyName: r.companyName ?? company.name,
        orgStatus: r.orgStatus,
        tradeLegalRegNumber: r.tradeLegalRegNumber,
        dateOfIncorporation: r.dateOfIncorporation ? new Date(r.dateOfIncorporation) : null,
        countryOfIncorporation: r.countryOfIncorporation,
        regionEmirate: r.regionEmirate,
        city: r.city,
        industrySector: r.industrySector,
        typeOfEntity: r.typeOfEntity,
        ownershipType: r.ownershipType,
        address: r.address,
        email: r.email,
        phone: r.phone,
        website: r.website,
        parentCompany: r.parentCompany,
        groupAffiliation: r.groupAffiliation,
        notes: r.notes,
        isRegulated: r.isRegulated,
        regIndustry: r.regIndustry,
        regulatoryLicenseNumber: r.regulatoryLicenseNumber,
        licenseExpiryDate: r.licenseExpiryDate ? new Date(r.licenseExpiryDate) : null,
        regulatoryNotes: r.regulatoryNotes,
        currencyAccount: r.currencyAccount,
        annualTurnoverBracket: r.annualTurnoverBracket,
        numberOfEmployees: r.numberOfEmployees,
        numberOfSubDivisionsLocations: r.numberOfSubDivisionsLocations,
        fiscalYearStart: r.fiscalYearStart,
        treasuryFunctionsPresent: r.treasuryFunctionsPresent,
        cashHandlingInvolved: r.cashHandlingInvolved,
        riskRating: r.riskRating,
        riskOwner: r.riskOwner,
        lastAuditDate: r.lastAuditDate ? new Date(r.lastAuditDate) : null,
        nextPlannedAuditCycle: r.nextPlannedAuditCycle,
        residualRiskScore: r.residualRiskScore,
        riskNotes: r.riskNotes,
      };
    }

    // Fallback — no source record yet, only the lean list fields are known.
    return {
      companyName: company.name,
      typeOfEntity: company.entityType,
      industrySector: company.industry,
      countryOfIncorporation: company.location,
      phone: company.primaryContact.phone,
    };
  }

  /** Resolve dropdown codes back to human labels (see company-labels.constants.ts). */
  private lookupCountryLabel(code: string): string {
    return COMPANY_COUNTRY_LABELS[code] ?? code;
  }

  private lookupRegionLabel(code: string): string {
    return COMPANY_REGION_LABELS[code] ?? code;
  }

  private lookupOwnershipLabel(code: string): string {
    return COMPANY_OWNERSHIP_LABELS[code] ?? code;
  }

  private lookupRiskOwnerLabel(code: string): string {
    return COMPANY_RISK_OWNER_LABELS[code] ?? code;
  }

  private lookupAuditCycleLabel(code: string): string {
    return COMPANY_AUDIT_CYCLE_LABELS[code] ?? code;
  }

  readonly displayConfirmation = signal(false);
  private readonly pendingCompany = signal<Company | null>(null);

  /** True label for the confirm button — "Block" or "Unblock". */
  readonly confirmationAction = computed(() =>
    this.pendingCompany()?.blocked ? CompanyBlockActions.Activate : CompanyBlockActions.Deactivate,
  );

  readonly confirmationTarget = computed(() => this.pendingCompany());

  openConfirmation(company: Company): void {
    this.pendingCompany.set(company);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.pendingCompany.set(null);
  }

  /** Called when the user clicks "Yes" — toggles, then closes. */
  confirmToggleBlocked(): void {
    const c = this.pendingCompany();
    if (c) this.toggleBlocked(c);
    this.closeConfirmation();
  }

  viewOrgChart(company: Company): void {
    this.router.navigate([COMPANY_ORG_CHART_ROUTE], { queryParams: { company: company.id } });
  }

}
