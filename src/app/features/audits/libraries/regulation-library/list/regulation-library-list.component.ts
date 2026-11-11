import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';

// PrimeNG
import { InputTextModule }       from 'primeng/inputtext';
import { ButtonModule }          from 'primeng/button';
import { SelectModule }          from 'primeng/select';
import { TagModule }             from 'primeng/tag';
import { ChipModule }            from 'primeng/chip';
import { BadgeModule }           from 'primeng/badge';
import { TooltipModule }         from 'primeng/tooltip';
import { InputGroupModule }      from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PaginatorModule }       from 'primeng/paginator';
import { ConfirmDialogModule }   from 'primeng/confirmdialog';
import { ConfirmationService }   from 'primeng/api';

import {
  Regulation,
  RegulationAuthority,
  RegulationStatus,
  RegulationType,
  MOCK_REGULATIONS,
} from '@/app/features/audits/libraries/regulation-library/models/regulation-library.model';
import { RegulationAddComponent } from '../manage/regulation-library.component';
import { CrossReference, RegulationDetail, VersionHistoryItem, WhereUsedItem } from '../profile/regulation-library-profile.component';
import { Router } from '@angular/router';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
// Same CLIENT_MODE_VALUE constant the other static seed files (e.g.
// division-static-data.ts) read at module-eval time.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// The internal-audit org-structure seed files (same family as
// client-mode.ts's sibling seeds) — used below to source the Company /
// Division / Sub-Division filter *options* from the real DAR Exchange org
// structure when CLIENT_MODE_VALUE is 'internal-audit', instead of from
// company-org-data.ts's multi-company audit-firm ORG_STATIC_DATA.
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';


/**
 * Only when this build's client mode is 'internal-audit' (single-company
 * DAR Exchange seed) do the Company/Division/Sub-Division filter dropdowns
 * below read their *options* from the real DAR Exchange org structure in
 * the *-indi-org.data.ts seed files, instead of from company-org-data.ts's
 * multi-company ORG_STATIC_DATA (which is what 'audit-firm' mode keeps
 * using, since that taxonomy doesn't apply across arbitrary client
 * companies).
 */
const IS_INTERNAL_AUDIT_CLIENT = CLIENT_MODE_VALUE === 'internal-audit';

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

const ORG_COMPANY_NAMES = COMPANIES_SEED.map(c => c.companyName);

/** All Division names in the DAR org seed, optionally scoped to a company name. */
function orgDivisionNames(companyName: string): string[] {
  const companies = companyName
    ? DIVISION_INDI_ORG_COMPANIES.filter(c => c.companyName === companyName)
    : DIVISION_INDI_ORG_COMPANIES;
  return uniqueSorted(companies.flatMap(c => c.divisions.map(d => d.divisionName)));
}

/** All Sub-Division names in the DAR org seed, optionally scoped to company + division names. */
function orgSubDivisionNames(companyName: string, divisionName: string): string[] {
  const companies = companyName
    ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => c.companyName === companyName)
    : SUB_DIVISION_INDI_ORG_COMPANIES;
  const divisions = companies
    .flatMap(c => c.divisions)
    .filter(d => d.hasSubDivision !== false)
    .filter(d => !divisionName || d.divisionName === divisionName);
  return uniqueSorted(divisions.flatMap(d => d.subDivisions.map((s: { subDivisionName: string }) => s.subDivisionName)));
}

/** True when the named Division (in the same org directory the Division
 *  filter options come from, scoped to companyName if given) is flagged
 *  `hasSubDivision: false`. Unknown divisions count as having sub-divisions. */
function divisionHasNoSubDivision(companyName: string, divisionName: string): boolean {
  const divisions: { divisionName: string; hasSubDivision?: boolean }[] = IS_INTERNAL_AUDIT_CLIENT
    ? (companyName ? DIVISION_INDI_ORG_COMPANIES.filter(c => c.companyName === companyName) : DIVISION_INDI_ORG_COMPANIES)
        .flatMap(c => c.divisions)
    : (companyName ? ORG_STATIC_DATA.filter(c => c.companyName === companyName) : ORG_STATIC_DATA)
        .flatMap(c => c.divisions);
  const matches = divisions.filter(d => d.divisionName === divisionName);
  return !!matches.length && matches.every(d => d.hasSubDivision === false);
}

// Common Company -> Division -> Sub-Division static data — the same file the
// Companies/Members pages and the Evidence/Observations/Findings/
// Recommendations/Working Papers list filters and their Add drawers read
// from — instead of the hardcoded placeholder lists this used to have
// ("Emirates NBD"/"Dubai Main"/"Compliance", etc.). Filter option *values*
// are the real company/division/sub-division *names*, and Division/
// Sub-Division narrow to whatever's currently selected in the (staged)
// filter form — see the company/division valueChanges subscriptions in
// ngOnInit below.
//
// NOTE: the Regulation model (models/regulation-library.ts, not part of
// this rewiring) is assumed to already carry optional `company`/`division`/
// `subDivision` string fields — AddRegulationComponent's submitted result
// already includes them and is merged straight into `allRegulations`
// elsewhere in this file. If that model doesn't yet declare those fields,
// add `company?: string; division?: string; subDivision?: string;` to the
// `Regulation` interface so the filtering below type-checks without the
// `as any` cast. The MOCK_REGULATIONS seed data in that file was NOT
// touched here (it lives outside the files provided for this change) — any
// existing mock records without real company/division/sub-division values
// simply won't match the Company/Division/Sub-Division filters until edited
// through the Add/Edit form, the same way newly-created regulations will.

interface FilterOption { label: string; value: string; }
interface SortOption   { label: string; value: keyof Regulation; }

export type ViewMode = 'list' | 'grid';

@Component({
  selector: 'app-regulation-library',
  templateUrl: './regulation-library-list.component.html',
  styleUrls: ['./regulation-library-list.component.scss'],
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TagModule,
    ChipModule,
    BadgeModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
    PaginatorModule,
    ConfirmDialogModule,
  
    DrawIconComponent,],
  providers: [ConfirmationService],
})
export class RegulationLibraryComponent implements OnInit, OnDestroy {

  // ── Forms ─────────────────────────────────────────────────────────────────────
  searchForm!: FormGroup;   // reactive — search + sort only
  filterForm!: FormGroup;   // staged — only applied on "Apply Filters"

  selectedRegulation: RegulationDetail | null = null;

  // ── Applied filter values (what's actually filtering the list) ────────────────
  appliedFilters = {
    authority: '', type: '', status: '',
    company: '', division: '', subDivision: '',
  };

  // ── View mode ─────────────────────────────────────────────────────────────────
   readonly viewMode = signal<'list' | 'grid'>('grid');

  // ── Filter overlay ────────────────────────────────────────────────────────────
  showFilterPanel = false;
  overlayStyle: { [key: string]: string } = {};

  @ViewChild('filterBtn', { read: ElementRef }) filterBtnRef!: ElementRef;

  // ── Data ─────────────────────────────────────────────────────────────────────
  allRegulations: Regulation[] = MOCK_REGULATIONS;
  filteredRegulations: Regulation[] = [];

  // ── Pagination ────────────────────────────────────────────────────────────────
  pageSize        = 5;
  currentPage     = 0;
  pageSizeOptions = [5, 10, 20];
  pagedRegulations: Regulation[] = [];

  // ── Dropdown options ──────────────────────────────────────────────────────────
  authorityOptions: FilterOption[] = [
    { label: 'All Authorities', value: '' },
    { label: 'CBUAE',          value: 'CBUAE' },
    { label: 'DFSA',           value: 'DFSA'  },
    { label: 'ADGM',           value: 'ADGM'  },
    { label: 'SCA',            value: 'SCA'   },
    { label: 'FSRA',           value: 'FSRA'  },
  ];

  typeOptions: FilterOption[] = [
    { label: 'All Types',       value: '' },
    { label: 'Regulation',      value: 'Regulation'      },
    { label: 'Guidance',        value: 'Guidance'        },
    { label: 'Regulation Book', value: 'Regulation Book' },
    { label: 'Standard',        value: 'Standard'        },
    { label: 'Notice',          value: 'Notice'          },
    { label: 'Circular',        value: 'Circular'        },
  ];

  statusOptions: FilterOption[] = [
    { label: 'All Statuses', value: ''           },
    { label: 'Current',      value: 'Current'    },
    { label: 'Superseded',   value: 'Superseded' },
    { label: 'Draft',        value: 'Draft'      },
  ];

  /** Company filter options — sourced from the internal-audit DAR Exchange
   *  seed (COMPANIES_SEED) when CLIENT_MODE_VALUE is 'internal-audit',
   *  otherwise from company-org-data.ts's multi-company ORG_STATIC_DATA
   *  (not a hardcoded bank list) — same as every other list page's Company
   *  filter this session. */
  companyOptions: FilterOption[] = [
    { label: 'All Companies', value: '' },
    ...(IS_INTERNAL_AUDIT_CLIENT
      ? uniqueSorted(ORG_COMPANY_NAMES).map(v => ({ label: v, value: v }))
      : ORG_STATIC_DATA
          .map(c => ({ label: c.companyName, value: c.companyName }))
          .sort((a, b) => a.label.localeCompare(b.label))),
  ];

  /** Division/Sub-Division options narrow to whatever's currently selected
   *  in the (staged) filterForm — populated by updateDivisionOptions()/
   *  updateSubDivisionOptions() below, called once at startup and again on
   *  every company/division valueChanges. */
  divisionOptions: FilterOption[] = [];
  subDivisionOptions: FilterOption[] = [];

  /** Mirrors the staged filterForm's Company/Division (kept in sync by the
   *  valueChanges subscriptions in ngOnInit) so subDivisionFilterVisible can
   *  be a computed signal. */
  private readonly draftCompany  = signal('');
  private readonly draftDivision = signal('');

  /** Disables the Sub-Division field when the selected Division is flagged
   *  `hasSubDivision: false`. */
  readonly subDivisionFilterVisible = computed(() =>
    !this.draftDivision() || !divisionHasNoSubDivision(this.draftCompany(), this.draftDivision()),
  );

  sortOptions: SortOption[] = [
    { label: 'Title',          value: 'title'         },
    { label: 'Effective Date', value: 'effectiveDate' },
    { label: 'Authority',      value: 'authority'     },
    { label: 'Type',           value: 'type'          },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private drawer: RightDrawerService,
    private confirmationService: ConfirmationService,
    private elRef: ElementRef,
    private location: Location,
  ) {}

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.buildForms();
    this.updateDivisionOptions('');
    this.updateSubDivisionOptions('', '');
    this.applyFilters();

    // Only search + sort are reactive
    this.searchForm.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    // Company/Division narrow the downstream Division/Sub-Division option
    // lists — changing an upstream field invalidates whatever was
    // previously selected below it (it belonged to the old company/
    // division's org tree).
    this.filterForm.get('company')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((companyName: string) => {
        this.filterForm.patchValue({ division: '', subDivision: '' }, { emitEvent: false });
        this.draftCompany.set(companyName ?? '');
        this.draftDivision.set('');
        this.syncSubDivisionControl();
        this.updateDivisionOptions(companyName);
        this.updateSubDivisionOptions(companyName, '');
      });

    this.filterForm.get('division')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((divisionName: string) => {
        this.filterForm.patchValue({ subDivision: '' }, { emitEvent: false });
        this.draftDivision.set(divisionName ?? '');
        this.syncSubDivisionControl();
        this.updateSubDivisionOptions(this.filterForm.get('company')!.value, divisionName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Form setup ────────────────────────────────────────────────────────────────
  private buildForms(): void {
    this.searchForm = this.fb.group({
      search: [''],
      sortBy: ['title'],
    });

    this.filterForm = this.fb.group({
      authority:   [''],
      type:        [''],
      status:      [''],
      company:     [''],
      division:    [''],
      subDivision: [''],
    });
  }

  /** Narrows divisionOptions to the given Company's real divisions (or every
   *  division, deduped by name, when no Company is given). In
   *  'internal-audit' mode this reads from the DAR Exchange org seed
   *  (DIVISION_INDI_ORG_COMPANIES) instead of ORG_STATIC_DATA. */
  private updateDivisionOptions(companyName: string): void {
    const names = IS_INTERNAL_AUDIT_CLIENT
      ? orgDivisionNames(companyName)
      : (() => {
          const companies = companyName
            ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
            : ORG_STATIC_DATA;
          return uniqueSorted(companies.flatMap(c => c.divisions).map(b => b.divisionName));
        })();
    this.divisionOptions = [
      { label: 'All Divisions', value: '' },
      ...names.map(v => ({ label: v, value: v })),
    ];
  }

  /** Narrows subDivisionOptions to the given Company + Division's real
   *  sub-divisions (or every sub-division under whatever's selected so
   *  far). In 'internal-audit' mode this reads from the DAR Exchange org
   *  seed (SUB_DIVISION_INDI_ORG_COMPANIES) instead of ORG_STATIC_DATA. */
  private updateSubDivisionOptions(companyName: string, divisionName: string): void {
    const names = IS_INTERNAL_AUDIT_CLIENT
      ? orgSubDivisionNames(companyName, divisionName)
      : (() => {
          const companies = companyName
            ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
            : ORG_STATIC_DATA;
          const divisions = companies.flatMap(c => c.divisions)
            .filter(b => b.hasSubDivision !== false)
            .filter(b => !divisionName || b.divisionName === divisionName);
          return uniqueSorted(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
        })();
    this.subDivisionOptions = [
      { label: 'All Sub-Divisions', value: '' },
      ...names.map(v => ({ label: v, value: v })),
    ];
  }

  // ── Filter overlay actions ────────────────────────────────────────────────────
  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
    if (this.showFilterPanel && this.filterBtnRef) {
      const rect = this.filterBtnRef.nativeElement.getBoundingClientRect();
      this.overlayStyle = {
        top:   `${rect.bottom + 8}px`,
        right:  `${window.innerWidth - rect.right}px`,
      };
    }
  }

  applyFilterOverlay(): void {
    this.appliedFilters = { ...this.filterForm.value };
    // A disabled Sub-Division field can't leave a stale selection applied.
    if (!this.subDivisionFilterVisible()) this.appliedFilters.subDivision = '';
    this.showFilterPanel = false;
    this.applyFilters();
  }

  resetFilterOverlay(): void {
    this.filterForm.reset({
      authority: '', type: '', status: '',
      company: '', division: '', subDivision: '',
    });
    this.appliedFilters = {
      authority: '', type: '', status: '',
      company: '', division: '', subDivision: '',
    };
    this.draftCompany.set('');
    this.draftDivision.set('');
    this.syncSubDivisionControl();
    this.updateDivisionOptions('');
    this.updateSubDivisionOptions('', '');
    this.showFilterPanel = false;
    this.applyFilters();
  }

  /** Disables the Sub-Division control when the staged Division is flagged
   *  `hasSubDivision: false` (instead of hiding the field). */
  private syncSubDivisionControl(): void {
    const control = this.filterForm.get('subDivision')!;
    if (this.subDivisionFilterVisible()) control.enable({ emitEvent: false });
    else control.disable({ emitEvent: false });
  }

  // Close overlay on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showFilterPanel &&
        !this.elRef.nativeElement.querySelector('.reg-library__filter-overlay-wrap')
          ?.contains(event.target as Node)) {
      this.showFilterPanel = false;
    }
  }

  // ── Filtering / Sorting / Paging ──────────────────────────────────────────────
  applyFilters(): void {
    const { search, sortBy } = this.searchForm.value;
    const { authority, type, status, company, division, subDivision } = this.appliedFilters;
    const term = (search ?? '').toLowerCase().trim();

    let result = this.allRegulations.filter((reg) => {
      const matchesSearch =
        !term ||
        reg.title.toLowerCase().includes(term) ||
        reg.reference.toLowerCase().includes(term) ||
        reg.description.toLowerCase().includes(term) ||
        reg.tags.some((t) => t.toLowerCase().includes(term));

      // `company`/`division`/`subDivision` are cast via `as any` here
      // because the Regulation model wasn't part of this rewiring — see the
      // NOTE at the top of this file. Drop the cast once those fields are
      // formally declared on the interface.
      const r = reg as any;
      return (
        matchesSearch &&
        (!authority    || reg.authority === authority) &&
        (!type         || reg.type      === type) &&
        (!status       || reg.status    === status) &&
        (!company      || r.company     === company) &&
        (!division     || r.division    === division) &&
        (!subDivision  || r.subDivision === subDivision)
      );
    });

    result = result.sort((a, b) => {
      const key  = sortBy as keyof Regulation;
      const aVal = String(a[key] ?? '').toLowerCase();
      const bVal = String(b[key] ?? '').toLowerCase();
      return aVal.localeCompare(bVal);
    });

    this.filteredRegulations = result;
    this.currentPage = 0;
    this.updatePage();
  }

  private updatePage(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedRegulations = this.filteredRegulations.slice(start, start + this.pageSize);
  }

  onPageChange(event: { first?: number; rows?: number }): void {
    const first = event.first ?? 0;
    const rows  = event.rows  ?? this.pageSize;
    this.pageSize    = rows;
    this.currentPage = Math.floor(first / rows);
    this.updatePage();
  }

  // ── View mode ─────────────────────────────────────────────────────────────────
 setViewMode(m: 'list' | 'grid'): void { this.viewMode.set(m); }

  // ── Card actions ──────────────────────────────────────────────────────────────
  viewDetail(reg: Regulation, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/audits/libraries/regulation-details', reg.id]);
  }

  async openAddDrawer(): Promise<void> {
    const ref = this.drawer.open<Regulation | null>(RegulationAddComponent, {
      width: '769px',
      data: {},
    });
    const result = await ref.afterClosed;
    if (!result) return;
    this.allRegulations = [{ ...result, id: Date.now().toString() }, ...this.allRegulations];
    this.applyFilters();
  }

  async editRegulation(reg: Regulation, event: Event): Promise<void> {
    event.stopPropagation();
    const ref = this.drawer.open<Regulation | null>(RegulationAddComponent, {
      width: '769px',
      data: { existing: reg, type: 'Edit' },
    });
    const result = await ref.afterClosed;
    if (!result) return;
    this.allRegulations = this.allRegulations.map((r) =>
      r.id === reg.id ? { ...r, ...result } : r,
    );
    this.applyFilters();
  }

  toggleActive(reg: Regulation, event: Event): void {
    event.stopPropagation();
    const activating = reg.status !== 'Current';

    this.confirmationService.confirm({
      message: `Are you sure you want to <strong>${activating ? 'activate' : 'deactivate'} ${reg.reference}</strong>?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: activating ? '✓ Yes, Activate' : '✓ Yes, Deactivate',
      rejectLabel: '✕ No',
      acceptButtonStyleClass: activating
        ? 'confirm-btn confirm-btn--accept confirm-btn--success'
        : 'confirm-btn confirm-btn--accept confirm-btn--danger',
      rejectButtonStyleClass: 'confirm-btn confirm-btn--reject',
      accept: () => {
        const newStatus: RegulationStatus = activating ? 'Current' : 'Superseded';
        this.allRegulations = this.allRegulations.map((r) =>
          r.id === reg.id ? { ...r, status: newStatus } : r,
        );
        this.applyFilters();
      },
    });
  }

  isActive(reg: Regulation): boolean { return reg.status === 'Current'; }

  downloadRegulation(reg: Regulation, event: Event): void {
    event.stopPropagation();
    console.log('Download:', reg.reference);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────
  get activeFilterCount(): number {
    return Object.values(this.appliedFilters).filter(Boolean).length;
  }

  get totalCount(): number     { return this.allRegulations.length; }
  get filteredCount(): number  { return this.filteredRegulations.length; }
  get pageRangeStart(): number { return this.filteredCount === 0 ? 0 : this.currentPage * this.pageSize + 1; }
  get pageRangeEnd(): number   { return Math.min((this.currentPage + 1) * this.pageSize, this.filteredCount); }
  get searchValue(): string    { return this.searchForm.get('search')?.value ?? ''; }
  get sortByValue(): string    { return this.searchForm.get('sortBy')?.value ?? ''; }

  // ── Display helpers ───────────────────────────────────────────────────────────
  statusSeverity(status: RegulationStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null | undefined {
    const map = { Current: 'success', Superseded: 'warn', Draft: 'info' } as const;
    return map[status];
  }

  authorityColor(authority: RegulationAuthority): string {
    const map: Record<RegulationAuthority, string> = {
      CBUAE: '#1565C0', DFSA: '#283593', ADGM: '#4527A0', SCA: '#00695C', FSRA: '#6A1B9A',
    };
    return map[authority] ?? '#455A64';
  }

  typeColor(type: RegulationType): string {
    const map: Record<string, string> = {
      Regulation: '#0277BD', Guidance: '#00838F', 'Regulation Book': '#1565C0',
      Standard: '#2E7D32', Notice: '#E65100', Circular: '#558B2F',
    };
    return map[type] ?? '#546E7A';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'numeric', year: 'numeric',
    });
  }

  trackById(_index: number, reg: Regulation): string { return reg.id; }
}