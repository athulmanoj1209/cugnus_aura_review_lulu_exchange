import {
  Component, computed, HostListener, inject, OnInit, signal,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { RecommendationComponent, AddRecommendationDrawerData, AddRecommendationResult } from '../manage/recommendation.component';
import { RecommendationProfileComponent, RecommendationDetailDrawerData } from '../profile/recommendation-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { ORG_STATIC_DATA } from '../../../organization/company/company-org-data';
import { COMPANIES_SEED } from '../../../organization/company/company-static-indi-org.data';

import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// Internal-audit-mode Division/Sub-Division static data — the single-org
// (DAR Exchange) seed used instead of ORG_STATIC_DATA when
// CLIENT_MODE_VALUE === 'internal-audit'. NOTE: adjust these two import
// paths if division-static-indi-org.data.ts / sub-division-static-indi-org.data.ts
// don't live next to company-org-data.ts in your tree.
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
// Temporary, client-only bridge into the Pending Approvals queue (see
// execution-approval-list.component.ts) — adjust this relative path if that
// component lives somewhere else in your tree; it's assumed to be a sibling
// folder of this one, same as add-recommendation/.
import { addPendingItem, PendingItem } from '@/app/features/admin/review/execution-requests/list/execution-requests-list.component';
import {
  RECOMMENDATION_CURRENT_USER_NAME,
  RECOMMENDATION_DRAWER_WIDTH,
  RECOMMENDATION_ID_PAD_LENGTH,
  RECOMMENDATION_ID_PREFIX,
  RECOMMENDATION_LIST_PAGE_SIZE,
  RECOMMENDATION_PAGE_SIZE_OPTIONS,
  RECOMMENDATION_PENDING_ITEM_DEFAULTS,
  RECOMMENDATION_PRIORITY_RANK,
  RecommendationBlockActions,
  RecommendationDrawerModes,
  RecommendationSortColumns,
  RecommendationSortDirections,
  RecommendationViewModes,
  isRecommendationOverdue,
  type RecommendationBlockAction,
  type RecommendationPriority,
  type RecommendationSortColumn,
  type RecommendationSortDirection,
  type RecommendationStatus,
  type RecommendationViewMode,
} from '../constants/recommendation.constants';
import {
  RECOMMENDATION_ACTIVE_ICONS,
  RECOMMENDATION_DUE_ICONS,
  RECOMMENDATION_PRIORITY_LABELS,
  RECOMMENDATION_PRIORITY_OPTIONS,
  RECOMMENDATION_SORT_ICONS,
  RECOMMENDATION_STATUS_LABELS,
  RECOMMENDATION_STATUS_OPTIONS,
} from '../constants/recommendation-labels.constants';
import {
  RECOMMENDATION_ACTIVE_LABELS,
  RECOMMENDATION_SUB_DIVISION_FILTER_PLACEHOLDERS,
} from '../constants/recommendation-messages.constants';
// Common Company -> Division -> Sub-Division static data — the same file
// the Companies/Members pages and the Evidence/Observations/Findings list
// filters and their Add drawers read from — instead of deriving the
// Company/Division/Sub-Division filter options from whatever happens to be
// present in the (placeholder) mock recommendations below. Filter option
// *values* are the real company/division/sub-division *names* (matching
// Recommendation.company/division/subDivision, which are plain display-name
// strings, not ids/codes), and Division/Sub-Division cascade off whatever is
// currently selected in the filter draft, same as every other list page.
// In internal-audit mode this same cascading logic reads from
// DIVISION_INDI_ORG_COMPANIES / SUB_DIVISION_INDI_ORG_COMPANIES instead —
// the single-org (DAR Exchange) seed — rather than from ORG_STATIC_DATA.


/* ── Model ─────────────────────────────────────────────────────── */
// Value sets live in ../constants; re-exported so existing importers keep working.
export type { RecommendationPriority, RecommendationStatus } from '../constants/recommendation.constants';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  observationId: string;
  observationTitle: string;
  findingId: string;
  assignedTo: string;
  dueDate: Date;
  createdDate: Date;
  company: string;
  division: string;
  subDivision: string;
  isActive?: boolean;
}

interface FilterDraft {
  priority:    string;
  status:      string;
  company:     string;
  division:    string[];
  subDivision: string[];
  auditor:     string;
}

type SortColumn = RecommendationSortColumn;
type SortDir    = RecommendationSortDirection;

// The single company seeded for the active internal-audit org (DAR Exchange,
// XYZ Broadcast, ...) — see INTERNAL_AUDIT_CLIENT_KEY_VALUE in client-mode.ts.
const INTERNAL_AUDIT_COMPANY_NAME = COMPANIES_SEED[0]?.companyName ?? '';

const recommendationCompanyName = (company: string): string =>
  CLIENT_MODE_VALUE === 'internal-audit' ? INTERNAL_AUDIT_COMPANY_NAME : company;

// Division -> sub-division names, sourced from the real per-org sub-division
// catalog (sub-division-static-indi-org.data.ts) rather than scraped off the
// mock recommendations below, so the Sub-Division filter always offers the
// full canonical list for the active internal-audit org (DAR Exchange / XYZ
// Broadcast), same reasoning as INTERNAL_AUDIT_COMPANY_NAME above.
// Divisions flagged `hasSubDivision: false` are skipped — their (still
// non-empty) subDivisions arrays must not be offered in the filter.
const INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION = new Map<string, string[]>(
  SUB_DIVISION_INDI_ORG_COMPANIES.flatMap(c =>
    c.divisions.filter(dv => dv.hasSubDivision !== false).map(dv => [dv.divisionName, dv.subDivisions.map(sd => sd.subDivisionName)] as [string, string[]]),
  ),
);
const INTERNAL_AUDIT_SUB_DIVISION_NAMES = Array.from(
  new Set(Array.from(INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION.values()).flat()),
).sort((a, b) => a.localeCompare(b));

interface OrgDivisionSubDivisionCombo {
  divisionName: string;
  subDivisionName: string;
}

/**
 * One {division, sub-division} combo per real sub-division in the active
 * internal-audit org's catalog (sub-division-static-indi-org.data.ts), cycled
 * across the MOCK recommendations below in 'internal-audit' mode — same
 * approach observation-list.component.ts's INTERNAL_AUDIT_SCOPE_COMBOS uses,
 * so the list's Division/Sub-Division columns (and cells) show real org values
 * instead of the audit-firm placeholder division/sub-division names baked into
 * MOCK, which don't exist in DAR Exchange's/XYZ Broadcast's real catalog.
 */
const INTERNAL_AUDIT_DIVISION_SUB_DIVISION_COMBOS: OrgDivisionSubDivisionCombo[] =
  SUB_DIVISION_INDI_ORG_COMPANIES.flatMap(c =>
    c.divisions.flatMap(dv => dv.subDivisions.map(sd => ({ divisionName: dv.divisionName, subDivisionName: sd.subDivisionName }))),
  );

function recommendationOrgFields(index: number, r: Recommendation): Pick<Recommendation, 'company' | 'division' | 'subDivision'> {
  if (CLIENT_MODE_VALUE !== 'internal-audit' || INTERNAL_AUDIT_DIVISION_SUB_DIVISION_COMBOS.length === 0) {
    return { company: r.company, division: r.division, subDivision: r.subDivision };
  }
  const combo = INTERNAL_AUDIT_DIVISION_SUB_DIVISION_COMBOS[index % INTERNAL_AUDIT_DIVISION_SUB_DIVISION_COMBOS.length];
  return { company: INTERNAL_AUDIT_COMPANY_NAME, division: combo.divisionName, subDivision: combo.subDivisionName };
}

/* ── Mock data ──────────────────────────────────────────────────── */
// company/division/subDivision below are real (company, division,
// subDivision) triples verified to exist together in company-org-data.ts —
// the previous seed data used invented placeholder names ("ABC Electronics",
// "XYZ", ...) that don't exist anywhere in that file, which meant the
// Company/Division/Sub-Division filters would always come up empty once
// wired to real data.
const MOCK: Recommendation[] = [
  {
    id: 'REC-001', title: 'Implement dual-authorisation for payment approvals',
    description: 'Introduce a maker-checker control so no single user can both create and approve payments above AED 5,000.',
    priority: 'critical', status: 'in-progress',
    observationId: 'OBS-001', observationTitle: 'Lack of segregation of duties in payment approval',
    findingId: 'F-008', assignedTo: 'Finance Manager',
    dueDate: new Date('2025-06-30'), createdDate: new Date('2025-03-12'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Finance & Accounting',
    isActive: true,
  },
  {
    id: 'REC-002', title: 'Conduct quarterly user access review',
    description: 'Schedule a formal review of all system user accounts every quarter.',
    priority: 'high', status: 'open',
    observationId: 'OBS-002', observationTitle: 'Outdated user access list not reviewed quarterly',
    findingId: 'F-005', assignedTo: 'IT Manager',
    dueDate: new Date('2025-07-15'), createdDate: new Date('2025-03-16'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    isActive: true,
  },
  {
    id: 'REC-003', title: 'Update HR policy to reflect 2024 labour law amendments',
    description: 'Revise the HR policy document to incorporate all changes mandated by the 2024 amendments.',
    priority: 'medium', status: 'implemented',
    observationId: 'OBS-003', observationTitle: 'HR policy document not updated per regulatory changes',
    findingId: 'F-021', assignedTo: 'HR Director',
    dueDate: new Date('2025-05-31'), createdDate: new Date('2025-03-22'),
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk', subDivision: 'Human Resources',
    isActive: true,
  },
  {
    id: 'REC-004', title: 'Reduce patch deployment window to 14 days',
    description: 'Establish a formal patch management SLA of 14 days for critical patches.',
    priority: 'high', status: 'open',
    observationId: 'OBS-004', observationTitle: 'Patch deployment delayed beyond acceptable SLA',
    findingId: 'F-034', assignedTo: 'IT Security Lead',
    dueDate: new Date('2025-08-01'), createdDate: new Date('2025-04-02'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Hallmarking & Certification',
    isActive: true,
  },
  {
    id: 'REC-005', title: 'Standardise vendor contract template with renewal clauses',
    description: 'Develop a standard contract template including auto-renewal and penalty clauses.',
    priority: 'low', status: 'verified',
    observationId: 'OBS-005', observationTitle: 'Vendor contracts missing renewal clauses',
    findingId: 'F-008', assignedTo: 'Legal Counsel',
    dueDate: new Date('2025-06-01'), createdDate: new Date('2025-04-06'),
    company: 'Al Waha Construction & Contracting', division: 'Dubai Investment Park Office', subDivision: 'Legal & Governance',
    isActive: true,
  },
];

const EMPTY_DRAFT = (): FilterDraft => ({
  priority: '', status: '', company: '', division: [], subDivision: [], auditor: '',
});

/**
 * Recommendation has no "raised by" field of its own (only `assignedTo`,
 * the person responsible for implementing it) — this is a stand-in for
 * whoever submitted it, used only for the Pending Approvals bridge below.
 */
const CURRENT_USER_NAME = RECOMMENDATION_CURRENT_USER_NAME;

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-recommendation-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, FormsModule,
    ButtonModule, InputTextModule, MultiSelectModule,
    TooltipModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,DrawIconComponent
  ],
  templateUrl: './recommendation-list.component.html',
  styleUrl: './recommendation-list.component.scss',
})
export class RecommendationListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly router   = inject(Router);
  private readonly location = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  readonly recommendations = signal<Recommendation[]>(
    MOCK.map((recommendation, index) => ({
      ...recommendation,
      ...recommendationOrgFields(index, recommendation),
    })),
  );
  readonly viewMode        = signal<RecommendationViewMode>(RecommendationViewModes.Grid);

  /* ── Template constants ────────────────────────────────────────── */
  readonly RecommendationViewModes   = RecommendationViewModes;
  readonly RecommendationSortColumns = RecommendationSortColumns;
  readonly activeLabels              = RECOMMENDATION_ACTIVE_LABELS;
  readonly activeIcons               = RECOMMENDATION_ACTIVE_ICONS;
  readonly dueIcons                  = RECOMMENDATION_DUE_ICONS;
  readonly subDivisionPlaceholders   = RECOMMENDATION_SUB_DIVISION_FILTER_PLACEHOLDERS;
  readonly showFilter      = signal(false);

  readonly searchQuery = signal('');

  readonly activeFilters = signal<FilterDraft>(EMPTY_DRAFT());
  /** Draft filter state while the floating panel is open. A signal (rather
   *  than a plain object) so companyOptions/divisionOptions/subDivisionOptions
   *  below can cascade live as the user picks Company/Division, the same
   *  pattern used in ObservationListComponent/FindingsListComponent. */
  readonly draft = signal<FilterDraft>(EMPTY_DRAFT());

  readonly sortColumn    = signal<SortColumn | null>(RecommendationSortColumns.DueDate);
  readonly sortDirection = signal<SortDir>(RecommendationSortDirections.Asc);
  readonly pageSize      = signal(RECOMMENDATION_LIST_PAGE_SIZE);
  readonly currentPage   = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = RECOMMENDATION_PAGE_SIZE_OPTIONS;

  /* ── Confirm dialog ────────────────────────────────────────────── */
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<RecommendationBlockAction>(RecommendationBlockActions.Deactivate);
  readonly confirmationTarget  = signal<Recommendation | null>(null);

  readonly allSubDivisionsLabel = $localize`:@@audit.recommendations.allSubDivisions:All sub-divisions`;
  readonly noSubDivisionsLabel = $localize`:@@audit.recommendations.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly activateRecommendationLabel = $localize`:@@audit.recommendations.activateRecommendation:Activate recommendation`;
  readonly deactivateRecommendationLabel = $localize`:@@audit.recommendations.deactivateRecommendation:Deactivate recommendation`;

  /* ── Static option lists ──────────────────────────────────────── */
  readonly priorityOptions = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];

  readonly statusOptions = [
    { label: $localize`:@@common.open:Open`, value: 'open' },
    { label: $localize`:@@common.inProgress:In Progress`, value: 'in-progress' },
    { label: $localize`:@@audit.recommendations.statusImplemented:Implemented`, value: 'implemented' },
    { label: $localize`:@@audit.recommendations.statusVerified:Verified`, value: 'verified' },
    { label: $localize`:@@common.closed:Closed`, value: 'closed' },
  ];

  /** Company filter options, sourced from company-org-data.ts (not derived
   *  from whatever's in the mock recommendations, so the list is complete
   *  and stable regardless of what data happens to exist). */
  readonly companyOptions = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit'
      ? [{ label: INTERNAL_AUDIT_COMPANY_NAME, value: INTERNAL_AUDIT_COMPANY_NAME }]
      : ORG_STATIC_DATA
          .map(c => ({ label: c.companyName, value: c.companyName }))
          .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Division options narrow to the selected Company's divisions (or every
   *  division, deduped by name, when no Company is selected yet).
   *  In internal-audit mode these come from DIVISION_INDI_ORG_COMPANIES
   *  (the DAR Exchange-only seed) instead of ORG_STATIC_DATA — there's
   *  only ever one company in that mode, so there's nothing to narrow by. */
  readonly divisionOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const names = new Set(
        DIVISION_INDI_ORG_COMPANIES.flatMap(c => c.divisions).map(dv => dv.divisionName),
      );
      return [...names].map(v => ({ label: v, value: v })).sort((a, b) => a.label.localeCompare(b.label));
    }

    const companyName = this.draft().company;
    const companies = companyName
      ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
      : ORG_STATIC_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(dv => dv.divisionName));
    return [...names].map(v => ({ label: v, value: v })).sort((a, b) => a.label.localeCompare(b.label));
  });

  /** Sub-Division options narrow to the selected Company + Division (or
   *  every sub-division under whatever's selected so far, deduped by name).
   *  In internal-audit mode these come from SUB_DIVISION_INDI_ORG_COMPANIES
   *  (the DAR Exchange-only seed), cascading off the selected Division only —
   *  again, there's only one company in that mode. */
  readonly subDivisionOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const divisionNames = this.draft().division;
      const names = divisionNames.length
        ? divisionNames.flatMap(name => INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION.get(name) ?? [])
        : INTERNAL_AUDIT_SUB_DIVISION_NAMES;
      return [...new Set(names)].sort((a, b) => a.localeCompare(b)).map(v => ({ label: v, value: v }));
    }

    const { company: companyName, division: divisionNames } = this.draft();
    const companies = companyName
      ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
      : ORG_STATIC_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(dv => dv.hasSubDivision !== false)
      .filter(dv => !divisionNames.length || divisionNames.includes(dv.divisionName));
    const names = new Set(divisions.flatMap(dv => dv.subDivisions).map(sd => sd.subDivisionName));
    return [...names].map(v => ({ label: v, value: v })).sort((a, b) => a.label.localeCompare(b.label));
  });

  /** False only when every selected Division (looked up in the same org
   *  directory divisionOptions reads from) is flagged `hasSubDivision:
   *  false` — the Sub-Division field is then disabled. No Division selected,
   *  or a Division not found in the directory, keeps it enabled. */
  readonly subDivisionFilterVisible = computed(() => {
    const { company: companyName, division: divisionNames } = this.draft();
    if (!divisionNames.length) return true;
    const divisions: { divisionName: string; hasSubDivision?: boolean }[] =
      CLIENT_MODE_VALUE === 'internal-audit'
        ? DIVISION_INDI_ORG_COMPANIES.flatMap(c => c.divisions)
        : (companyName ? ORG_STATIC_DATA.filter(c => c.companyName === companyName) : ORG_STATIC_DATA)
            .flatMap(c => c.divisions);
    return divisionNames.some(name => {
      const matches = divisions.filter(dv => dv.divisionName === name);
      return !matches.length || matches.some(dv => dv.hasSubDivision !== false);
    });
  });

  /** Assigned To isn't part of company-org-data.ts (it's a user/role, not
   *  an org unit), so this stays derived from whatever's on the mock
   *  recommendations, as before. */
  readonly auditorOptions = computed(() =>
    [...new Set(this.recommendations().map(r => r.assignedTo))].sort().map(v => ({ label: v, value: v })),
  );

  /* ── Computed filtered/paginated lists ────────────────────────── */
  readonly filtered = computed(() => {
    let list = this.recommendations();
    const q  = this.searchQuery().trim().toLowerCase();
    const af = this.activeFilters();

    if (q) list = list.filter(r =>
      r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.assignedTo.toLowerCase().includes(q),
    );
    if (af.priority)   list = list.filter(r => r.priority   === af.priority);
    if (af.status)     list = list.filter(r => r.status     === af.status);
    if (af.company)    list = list.filter(r => r.company    === af.company);
    if (af.division.length)    list = list.filter(r => af.division.includes(r.division));
    if (af.subDivision.length) list = list.filter(r => af.subDivision.includes(r.subDivision));
    if (af.auditor)    list = list.filter(r => r.assignedTo === af.auditor);

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === RecommendationSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortVal(a, col), bv = this.sortVal(b, col);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const p    = Math.min(this.currentPage(), max);
    return all.slice((p - 1) * size, p * size);
  });

  readonly hasFilters = computed(() => {
    const af = this.activeFilters();
    return !!this.searchQuery().trim() ||
      !!af.priority || !!af.status || !!af.company || !!af.division.length || !!af.subDivision.length || !!af.auditor;
  });

  get overdueCount() {
    return this.recommendations().filter(isRecommendationOverdue).length;
  }

  ngOnInit(): void { /* load from service */ }

  /* ── Filter panel ─────────────────────────────────────────────── */
  toggleFilter(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.showFilter()) this.draft.set({ ...this.activeFilters() });
    this.showFilter.update(v => !v);
  }

  onFilterPanelClick(e: MouseEvent): void { e.stopPropagation(); }

  /** Generic setter for the plain (non-cascading) filter fields — Priority,
   *  Status, Auditor. */
  setDraft<K extends keyof FilterDraft>(key: K, value: FilterDraft[K]): void {
    this.draft.update(d => ({ ...d, [key]: value }));
  }

  /** Changing Company invalidates any previously selected Division/Sub-
   *  Division (they belonged to the old company's org tree), so both are
   *  cleared. */
  onDraftCompanyChange(value: string): void {
    this.draft.update(d => ({ ...d, company: value, division: [], subDivision: [] }));
  }

  /** Changing Division invalidates any previously selected Sub-Division. */
  onDraftDivisionChange(value: string[]): void {
    this.draft.update(d => ({ ...d, division: value ?? [], subDivision: [] }));
  }

  applyFilters(): void {
    // A disabled Sub-Division field can't leave a stale selection applied.
    const draft = this.draft();
    this.activeFilters.set({ ...draft, subDivision: this.subDivisionFilterVisible() ? draft.subDivision : [] });
    this.currentPage.set(1);
    this.showFilter.set(false);
  }

  resetFilters(): void {
    this.draft.set(EMPTY_DRAFT());
    this.activeFilters.set(EMPTY_DRAFT());
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.showFilter.set(false);
  }

  clearAll(): void { this.resetFilters(); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    // The Division/Sub-Division multiselect overlays are appended to <body>,
    // so clicks inside them (or on options they re-render away) must not
    // close the filter panel.
    const target = e.target as HTMLElement | null;
    if (target && (!target.isConnected || target.closest('.p-multiselect-overlay, .p-overlay'))) return;
    this.showFilter.set(false);
  }

  /* ── Search / sort / page ─────────────────────────────────────── */
  onSearch(q: string): void { this.searchQuery.set(q); this.currentPage.set(1); }

  onSort(col: SortColumn): void {
    this.sortColumn() === col
      ? this.sortDirection.update(d =>
          d === RecommendationSortDirections.Asc ? RecommendationSortDirections.Desc : RecommendationSortDirections.Asc)
      : (this.sortColumn.set(col), this.sortDirection.set(RecommendationSortDirections.Asc));
  }
  sortIcon(col: SortColumn): string {
    return this.sortColumn() !== col ? RECOMMENDATION_SORT_ICONS.Unsorted : RECOMMENDATION_SORT_ICONS[this.sortDirection()];
  }
  private sortVal(r: Recommendation, col: SortColumn): string | number {
    switch (col) {
      case RecommendationSortColumns.Id:         return parseInt(r.id.replace(/\D/g, ''), 10) || 0;
      case RecommendationSortColumns.Title:      return r.title.toLowerCase();
      case RecommendationSortColumns.Priority:   return RECOMMENDATION_PRIORITY_RANK[r.priority];
      case RecommendationSortColumns.Status:     return r.status;
      case RecommendationSortColumns.AssignedTo: return r.assignedTo.toLowerCase();
      case RecommendationSortColumns.DueDate:    return r.dueDate.getTime();
    }
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

  setView(m: RecommendationViewMode): void { this.viewMode.set(m); }

  isOverdue(r: Recommendation): boolean {
    return isRecommendationOverdue(r);
  }

  /* ── Drawer actions ───────────────────────────────────────────── */

  /** Next sequential REC-### id based on the highest one currently in the list. */
  private nextRecommendationId(): string {
    const max = this.recommendations().reduce((m, r) => {
      const n = parseInt(r.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    return `${RECOMMENDATION_ID_PREFIX}${(max + 1).toString().padStart(RECOMMENDATION_ID_PAD_LENGTH, '0')}`;
  }

  async openAdd(): Promise<void> {
    const ref = this.drawer.open<AddRecommendationResult, AddRecommendationDrawerData>(
      RecommendationComponent, { width: RECOMMENDATION_DRAWER_WIDTH, data: { mode: RecommendationDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const f = result.form;
    const newRecommendation: Recommendation = {
      id: this.nextRecommendationId(),
      title: f.title,
      description: f.description,
      priority: f.priority,
      status: f.status,
      // No Observation selector exists in this form (only "Linked Finding"),
      // so a new recommendation can't be tied to one here.
      observationId: '',
      observationTitle: '',
      findingId: f.findingId,
      assignedTo: f.assignedTo,
      dueDate: f.dueDate ?? new Date(),
      createdDate: new Date(),
      // RecommendationComponent now speaks in the same real
      // company/division/sub-division *names* as this list (both read from
      // company-org-data.ts), so no code -> label translation is needed.
      company: recommendationCompanyName(f.company ?? ''),
      division: f.division ?? '',
      subDivision: f.subDivision ?? '',
      isActive: true,
    };

    // New entries appear first so they're immediately visible.
    this.recommendations.update(list => [newRecommendation, ...list]);
    this.currentPage.set(1);

    // Temporary bridge: also surface this freshly submitted recommendation
    // in the Pending Approvals queue, awaiting review — the two lists are
    // still separate mock stores, so this just mirrors the essentials
    // across. Recommendation.priority and PendingItem.riskRating share the
    // same 'critical' | 'high' | 'medium' | 'low' union, so it carries
    // straight through.
    const pendingItem: PendingItem = {
      id: newRecommendation.id,
      type: RECOMMENDATION_PENDING_ITEM_DEFAULTS.Type,
      status: RECOMMENDATION_PENDING_ITEM_DEFAULTS.Status,
      riskRating: newRecommendation.priority,
      title: newRecommendation.title,
      description: newRecommendation.description ?? '',
      submittedBy: CURRENT_USER_NAME,
      submittedDate: newRecommendation.createdDate,
      company: newRecommendation.company ?? '',
      division: newRecommendation.division ?? '',
      subDivision: newRecommendation.subDivision ?? '',
      dueDate: newRecommendation.dueDate,
      linkedId: newRecommendation.findingId || undefined,
    };
    addPendingItem(pendingItem);
  }

  async openEdit(r: Recommendation): Promise<void> {
    const ref = this.drawer.open<AddRecommendationResult, AddRecommendationDrawerData>(
      RecommendationComponent, {
        width: RECOMMENDATION_DRAWER_WIDTH,
        data: {
          mode: RecommendationDrawerModes.Edit,
          existing: {
            // Company/Division/Sub-Division are listed first, ahead of
            // every other field, because RecommendationComponent's
            // ngOnInit() resets Division/Sub-Division whenever
            // Company/Division changes. FormGroup.patchValue() applies keys
            // in *this object's* own property order — if Sub-Division were
            // listed before Company/Division, the later company/division
            // keys would fire the reset AFTER sub-division had already been
            // set, silently blanking it.
            id: r.id,
            company: r.company,
            division: r.division,
            subDivision: r.subDivision,
            title: r.title, description: r.description,
            priority: r.priority, status: r.status,
            // Pre-fill the "Linked Finding" select — the old code passed
            // `observationId`, a key the form has no control for, so this
            // field always loaded blank (and being required, could block
            // re-submission until the user manually reselected a finding).
            findingId: r.findingId,
            assignedTo: r.assignedTo, dueDate: r.dueDate,
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const f = result.form;
    this.recommendations.update(list =>
      list.map(item => item.id !== r.id ? item : {
        ...item,
        title: f.title,
        description: f.description,
        priority: f.priority,
        status: f.status,
        findingId: f.findingId,
        assignedTo: f.assignedTo,
        dueDate: f.dueDate ?? item.dueDate,
        company: recommendationCompanyName(f.company ?? item.company),
        division: f.division ?? item.division,
        subDivision: f.subDivision === null ? '' : (f.subDivision ?? item.subDivision),
      }),
    );
  }

  openView(r: Recommendation): void {
    this.drawer.open<RecommendationProfileComponent, RecommendationDetailDrawerData>(
      RecommendationProfileComponent, { width: RECOMMENDATION_DRAWER_WIDTH, data: { recommendation: r } },
    );
  }

  /* ── Confirm dialog ───────────────────────────────────────────── */
  openConfirmation(r: Recommendation): void {
    this.confirmationAction.set(r.isActive !== false ? RecommendationBlockActions.Deactivate : RecommendationBlockActions.Activate);
    this.confirmationTarget.set(r);
    this.displayConfirmation.set(true);
  }

  confirmToggleBlocked(): void {
    const target = this.confirmationTarget();
    if (!target) return;
    this.recommendations.update(list =>
      list.map(r => r.id === target.id ? { ...r, isActive: !r.isActive } : r),
    );
    this.closeConfirmation();
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.confirmationTarget.set(null);
  }

  /* ── Labels ───────────────────────────────────────────────────── */
  priorityLabel(p: RecommendationPriority): string {
    const labels: Record<RecommendationPriority, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };

    return labels[p];
  }
  statusLabel(s: RecommendationStatus): string {
    const labels: Record<RecommendationStatus, string> = {
      open: $localize`:@@common.open:Open`,
      'in-progress': $localize`:@@common.inProgress:In Progress`,
      implemented: $localize`:@@audit.recommendations.statusImplemented:Implemented`,
      verified: $localize`:@@audit.recommendations.statusVerified:Verified`,
      closed: $localize`:@@common.closed:Closed`,
    };

    return labels[s];
  }

  trackById = (_: number, r: Recommendation) => r.id;
}