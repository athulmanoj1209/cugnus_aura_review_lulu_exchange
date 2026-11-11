import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { FilterModalComponent, FilterOption } from '@/app/shared/components/filter-modal/filter-modal.component';
import {
  WorkingPapersComponent,
  AddWorkingPaperDrawerData,
  AddWorkingPaperResult,
} from '@/app/features/audits/audit-execution/working-papers/manage/working-papers.component';
import { RiskLevel, WorkingPaperStatus, WorkingPaperType } from '@/app/features/audits/audit-execution/working-papers/list/working-papers-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT, internalAuditOrgFieldsFor } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

// Shared Company → Division → Sub-Division static data — the same file every
// other list/drawer in the app now reads from (Working Papers, Risk
// Approvals, Pending Approvals, Regulation Library, etc.) instead of the
// hardcoded "Crowe UAE"/"Crowe KSA"/"Crowe Oman"/"Crowe Qatar" company list
// and unrelated Dubai/Abu Dhabi/Riyadh/Doha/Sharjah division + generic
// Internal Audit/External Audit/Risk Management/IT sub-division lists this
// page used to have. Company/Division/Sub-Division option *values* are the
// real display NAMES from company-org-data.ts, matching how
// ReviewWorkingPaper.company/division/subDivision are plain display-name
// strings. Division/Sub-Division cascade off whichever Companies/Divisions
// are currently checked in the (multi-select) Filters modal.


/* ── Model ─────────────────────────────────────────────────────── */
export interface ReviewWorkingPaper {
  id:           string;
  title:        string;
  wpType:       WorkingPaperType;
  scope:        string;
  subscope:     string;
  assertion:    string;
  riskLevel:    RiskLevel;
  status:       WorkingPaperStatus;
  findingId:    string;
  preparedBy:   string;
  preparedDate: Date;
  company:      string;
  division:     string;
  subDivision:  string;
  objective?:   string;
  conclusion?:  string;
  dueDate?:     Date;
}

/* ── Mock data (working papers awaiting review) ─────────────────── */
// `company`/`division`/`subDivision` below are now real NAMES from
// company-org-data.ts instead of the previous "Crowe UAE"/"Dubai"/
// "Internal Audit"-style placeholders, which don't exist anywhere in the
// real division/sub-division roster. These IDs (A-100, B-200, H-800, D-400,
// I-900, F-600) also appear in working-papers-list.component.ts's own mock
// data — since they represent the same underlying working papers at a
// different point in their review lifecycle, each one here is given the
// exact same company/division/subDivision triple as its counterpart there,
// so a working paper's org assignment stays consistent across both pages.
const MOCK_REVIEW_QUEUE: ReviewWorkingPaper[] = [
  {
    id: 'A-100', title: 'Cash & Bank — Lead Schedule', wpType: 'lead_schedule',
    scope: 'Internal Audit', subscope: 'Financial Controls', assertion: 'Existence',
    riskLevel: 'medium', status: 'under_review', findingId: 'F-012',
    preparedBy: 'Athul Manoj', preparedDate: new Date('2025-04-01'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Retail Operations',
    objective: 'Confirm existence and accuracy of cash and bank balances at period end.',
    conclusion: 'Balances agree except 14 unreconciled entries (F-012).',
    dueDate: new Date('2025-06-30'),
  },
  {
    id: 'B-200', title: 'Revenue — Substantive Testing', wpType: 'substantive_test',
    scope: 'External Audit', subscope: 'Statutory Audit', assertion: 'Occurrence',
    riskLevel: 'high', status: 'under_review', findingId: 'F-005',
    preparedBy: 'Sara Ahmed', preparedDate: new Date('2025-04-05'),
    company: 'Al Noor Jewellery Group', division: 'Sharjah Showroom', subDivision: 'Retail Operations',
    objective: 'Test revenue cut-off around period end.',
    conclusion: 'Three transactions recognised prior to delivery (F-005).',
  },
  {
    id: 'H-800', title: 'IT General Controls — Access Testing', wpType: 'test_of_controls',
    scope: 'IT', subscope: 'IT Controls', assertion: 'Accuracy',
    riskLevel: 'high', status: 'prepared', findingId: 'F-009',
    preparedBy: 'Ioni Bowcher', preparedDate: new Date('2025-04-09'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Inventory & Warehousing',
    objective: 'Test logical access provisioning and SoD controls.',
    dueDate: new Date('2025-07-15'),
  },
  {
    id: 'D-400', title: 'Accounts Payable — Reconciliation', wpType: 'reconciliation',
    scope: 'External Audit', subscope: 'Statutory Audit', assertion: 'Completeness',
    riskLevel: 'low', status: 'prepared', findingId: 'F-008',
    preparedBy: 'Meenu AM', preparedDate: new Date('2025-04-12'),
    company: 'Falcon Gulf Jewellery Trading', division: 'Al Ain Branch', subDivision: 'Finance & Accounting',
    objective: 'Reconcile supplier statements to the AP ledger.',
  },
  {
    id: 'I-900', title: 'Corporate Tax — Substantive Testing', wpType: 'substantive_test',
    scope: 'External Audit', subscope: 'Tax Audit', assertion: 'Valuation',
    riskLevel: 'high', status: 'under_review', findingId: 'F-045',
    preparedBy: 'Stephen Shaw', preparedDate: new Date('2025-04-15'),
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom', subDivision: 'Retail Operations',
    objective: 'Recompute the current and deferred tax provision.',
    dueDate: new Date('2025-07-20'),
  },
  {
    id: 'F-600', title: 'Inventory — Physical Count Memo', wpType: 'memo',
    scope: 'Internal Audit', subscope: 'Operational Review', assertion: 'Existence',
    riskLevel: 'medium', status: 'prepared', findingId: 'F-017',
    preparedBy: 'Amy Elsner', preparedDate: new Date('2025-04-18'),
    company: 'Falcon Gulf Jewellery Trading', division: 'Abu Dhabi Corniche Showroom', subDivision: 'Inventory & Warehousing',
    objective: 'Document attendance at the year-end physical inventory count.',
  },
];

/**
 * Shared, module-level signal backing this queue — same pattern as
 * `pendingItemsStore` in execution-approval-list.component.ts. Wrapping the
 * mock array in a signal here (rather than leaving it a fresh local signal
 * on the component) means a working paper freshly submitted elsewhere — via
 * WorkingPaperListComponent's "+ New Working Paper" flow — can be pushed in
 * from *outside* this component via `addReviewWorkingPaper()` below and
 * shows up here right away. This is a deliberately lightweight, temporary,
 * client-only bridge between mock stores — nothing here is persisted to a
 * real backend yet.
 */
const reviewQueueStore = signal<ReviewWorkingPaper[]>(
  CLIENT_MODE_VALUE === 'internal-audit'
    // The audit-firm names above aren't in the internal-audit org the
    // review drawer lists, so its Company/Division/Sub-Division/Scope selects
    // came up blank — reassign from the active org, keyed by id so each
    // paper matches its counterpart in working-papers-list.component.ts.
    ? MOCK_REVIEW_QUEUE.map(w => {
        const org = internalAuditOrgFieldsFor(w.id);
        return org
          ? { ...w, company: org.company, division: org.branch, subDivision: org.department, scope: org.scope, subscope: org.subscope }
          : w;
      })
    : MOCK_REVIEW_QUEUE,
);

/** Company → Division → Sub-Division roster the filters read from — the
 *  internal-audit org in that mode, matching the drawer and the items. */
const ACTIVE_ORG_DATA =
  CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

/**
 * Pushes a new working paper onto the shared review queue (newest first).
 * Called unconditionally whenever a working paper is added — same as the
 * Evidence/Observation/Recommendation bridges — regardless of its status.
 * If you'd rather only show papers genuinely ready for review, gate the
 * call site (WorkingPaperListComponent.openAdd()) on
 * `newPaper.status === 'prepared' || newPaper.status === 'under_review'`,
 * but only once the Add form reliably submits a real status value — an
 * earlier version had that gate and it silently blocked every new paper
 * from ever reaching this queue.
 */
export function addReviewWorkingPaper(item: ReviewWorkingPaper): void {
  reviewQueueStore.update(list => [item, ...list]);
}

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-working-paper-review-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, FormsModule,
    ButtonModule, InputTextModule, TooltipModule,
    FilterModalComponent, DrawIconComponent,
  ],
  templateUrl: './working-paper-requests-list.component.html',
  styleUrl: './working-paper-requests-list.component.scss',
})
export class WorkingPaperReviewListComponent {
  private readonly drawer = inject(RightDrawerService);

  // Backed by the shared module-level store above (not a fresh local
  // signal) so items added from outside this component — e.g. a new
  // Working Paper submitted for review — are reflected here too.
  readonly items    = reviewQueueStore;
  readonly viewMode = signal<'grid' | 'list'>('grid');
  readonly search   = signal('');

  /**
   * IDs currently mid-way through the approve/reject flow: their status has
   * already been updated in `items`, but they're kept around (styled via
   * `.is-removing` in the template) for a brief moment so the reviewer sees
   * the new status before the card/row fades out of this pending-review
   * list. Purely a client-side/UI affordance for now — nothing is persisted
   * to a backend yet.
   */
  readonly removingIds = signal<Set<string>>(new Set());

  /** How long (ms) a reviewed item lingers, showing its new status, before
   *  being removed from the pending list. */
  private static readonly REMOVE_DELAY_MS = 900;

  // ── Filter state ──────────────────────────────────────────────
  // Named to match <app-filter-modal>'s [selectedDivisions]/[selectedSubDivisions]
  // inputs and (divisionsChange)/(subDivisionsChange) outputs.
  readonly filterTypes        = signal<string[]>([]);
  readonly filterRisks        = signal<string[]>([]);
  readonly filterCompanies    = signal<string[]>([]);
  readonly filterDivisions    = signal<string[]>([]);
  readonly filterSubDivisions = signal<string[]>([]);
  readonly filterPreparers    = signal<string[]>([]);

  // ── Static options ────────────────────────────────────────────
  readonly typeOptions: FilterOption[] = [
    { label: $localize`:@@admin.workingPaperRequests.leadSchedule:Lead Schedule`, value: 'lead_schedule' },
    { label: $localize`:@@admin.workingPaperRequests.testOfControls:Test of Controls`, value: 'test_of_controls' },
    { label: $localize`:@@admin.workingPaperRequests.substantiveTest:Substantive Test`, value: 'substantive_test' },
    { label: $localize`:@@admin.workingPaperRequests.analyticalReview:Analytical Review`, value: 'analytical_review' },
    { label: $localize`:@@admin.workingPaperRequests.reconciliation:Reconciliation`, value: 'reconciliation' },
    { label: $localize`:@@admin.workingPaperRequests.memorandum:Memorandum`, value: 'memo' },
    { label: $localize`:@@admin.workingPaperRequests.confirmation:Confirmation`, value: 'confirmation' },
    { label: $localize`:@@common.other:Other`, value: 'other' }
  ];
  readonly riskOptions: FilterOption[] = [
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' }
  ];

  /** True when this build is running in single-company "internal audit" mode. */
  readonly isInternalAuditMode = CLIENT_MODE_VALUE === 'internal-audit';

  /**
   * Company filter options.
   *
   * Internal-audit mode: every company defined in COMPANIES_SEED
   * (company-static-indi-org.data.ts) — the full single-company org
   * directory, not just the multi-company audit-firm roster.
   *
   * Audit-firm mode (unchanged): sourced from company-org-data.ts — the
   * same shared static-data file every other Company filter/drawer in the
   * app reads from. Value is the company's display NAME (matching
   * ReviewWorkingPaper.company).
   */
  readonly companyOptions = computed<FilterOption[]>(() =>
    ACTIVE_ORG_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Division narrows to whatever Companies are currently checked in the
   * Filters modal (all divisions, across every company, when none are
   * checked yet).
   *
   * Internal-audit mode: pulled from DIVISION_INDI_ORG_COMPANIES
   * (division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly divisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : DIVISION_INDI_ORG_COMPANIES;
      const names = new Set(companies.flatMap(c => c.divisions).map(b => b.divisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(d => d.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * Sub-Division narrows to whatever Companies/Divisions are currently
   * checked.
   *
   * Internal-audit mode: pulled from SUB_DIVISION_INDI_ORG_COMPANIES
   * (sub-division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly subDivisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();
    const selectedDivisions = this.filterDivisions();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : SUB_DIVISION_INDI_ORG_COMPANIES;
      const divisions = companies.flatMap(c => c.divisions)
        .filter(b => b.hasSubDivision !== false)
        .filter(b => !selectedDivisions.length || selectedDivisions.includes(b.divisionName));
      const names = new Set(divisions.flatMap(b => b.subDivisions).map(d => d.subDivisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(d => d.hasSubDivision !== false)
      .filter(d => !selectedDivisions.length || selectedDivisions.includes(d.divisionName));
    const names = new Set(divisions.flatMap(d => d.subDivisions).map(sd => sd.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * Sub-Division is disabled only when every selected Division (looked up in
   * the selected Companies, or all companies) is flagged hasSubDivision:false.
   * Such divisions still carry a subDivisions array in the seed data, so it
   * must not be offered. Unknown divisions count as having sub-divisions.
   */
  readonly subDivisionEnabled = computed<boolean>(() => {
    const selectedDivisions = this.filterDivisions();
    if (!selectedDivisions.length) return true;
    const selectedCompanies = this.filterCompanies();
    const source: { companyName: string; divisions: { divisionName: string; hasSubDivision?: boolean }[] }[] =
      this.isInternalAuditMode ? SUB_DIVISION_INDI_ORG_COMPANIES : ACTIVE_ORG_DATA;
    const companies = selectedCompanies.length
      ? source.filter(c => selectedCompanies.includes(c.companyName))
      : source;
    const divisions = companies.flatMap(c => c.divisions);
    return selectedDivisions.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  readonly preparerOptions = computed<FilterOption[]>(() =>
    [...new Set(this.items().map(i => i.preparedBy))].sort()
      .map(v => ({ label: v, value: v }))
  );

  // ── Stats ─────────────────────────────────────────────────────
  readonly stats = computed(() => {
    const all = this.items();
    return {
      total:       all.length,
      high:        all.filter(i => i.riskLevel === 'high').length,
      medium:      all.filter(i => i.riskLevel === 'medium').length,
      low:         all.filter(i => i.riskLevel === 'low').length,
      underReview: all.filter(i => i.status === 'under_review').length,
    };
  });

  // ── Filtered list ─────────────────────────────────────────────
  readonly filtered = computed(() => {
    let list = this.items();
    const q = this.search().trim().toLowerCase();
    if (q) list = list.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.preparedBy.toLowerCase().includes(q),
    );
    const types        = this.filterTypes();
    const risks        = this.filterRisks();
    const companies    = this.filterCompanies();
    const divisions    = this.filterDivisions();
    const subDivisions = this.subDivisionEnabled() ? this.filterSubDivisions() : [];
    const preparers    = this.filterPreparers();

    if (types.length)        list = list.filter(i => types.includes(i.wpType));
    if (risks.length)        list = list.filter(i => risks.includes(i.riskLevel));
    if (companies.length)    list = list.filter(i => companies.includes(i.company));
    if (divisions.length)    list = list.filter(i => divisions.includes(i.division));
    if (subDivisions.length) list = list.filter(i => subDivisions.includes(i.subDivision));
    if (preparers.length)    list = list.filter(i => preparers.includes(i.preparedBy));
    return list;
  });

  readonly hasFilters = computed(() =>
    !!this.search().trim() ||
    this.filterTypes().length > 0 ||
    this.filterRisks().length > 0 ||
    this.filterCompanies().length > 0 ||
    this.filterDivisions().length > 0 ||
    this.filterSubDivisions().length > 0 ||
    this.filterPreparers().length > 0
  );

  // ── Actions ───────────────────────────────────────────────────
  clearAll(): void {
    this.search.set('');
    this.filterTypes.set([]);
    this.filterRisks.set([]);
    this.filterCompanies.set([]);
    this.filterDivisions.set([]);
    this.filterSubDivisions.set([]);
    this.filterPreparers.set([]);
  }

  async openReview(item: ReviewWorkingPaper): Promise<void> {
    const ref = this.drawer.open<WorkingPapersComponent, AddWorkingPaperDrawerData>(
      WorkingPapersComponent, {
        width: '800px',
        data: {
          mode: 'approve',
          existing: {
            // Company → Division → Sub-Division → Scope → Subscope first, in
            // dependency order: the drawer resets each downstream field when
            // an upstream one changes, and patchValue applies keys in this
            // object's order — listing scope before company blanked it.
            company: item.company, division: item.division, subDivision: item.subDivision,
            scope: item.scope, subscope: item.subscope,
            id: item.id, title: item.title, wpType: item.wpType, findingId: item.findingId,
            assertion: item.assertion, riskLevel: item.riskLevel, status: item.status,
            objective: item.objective, conclusion: item.conclusion,
          },
        },
      },
    );
    const result = (await ref.afterClosed) as unknown as AddWorkingPaperResult | null;
    if (result?.reviewAction) {
      // 1. Reflect the reviewer's decision on the item's status right away —
      //    'approved' or, for a rejection, 'reopened' (sent back for rework).
      const newStatus: WorkingPaperStatus = result.reviewAction === 'approve' ? 'approved' : 'reopened';
      this.items.update(list =>
        list.map(i => (i.id === item.id ? { ...i, status: newStatus } : i)),
      );

      // 2. Mark it as removing so the card/row can show that updated status
      //    briefly (see `.is-removing` styling) before it's taken out of
      //    this pending-review list.
      this.removingIds.update(ids => new Set(ids).add(item.id));

      console.info('[stub] working paper', item.id, result.reviewAction, result.form.reviewerNotes);

      // 3. After the brief delay, actually drop it from the pending list —
      //    it's no longer awaiting review. This only removes it from this
      //    screen's local (mock) state; it isn't a persisted delete.
      setTimeout(() => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        this.removingIds.update(ids => {
          const next = new Set(ids);
          next.delete(item.id);
          return next;
        });
      }, WorkingPaperReviewListComponent.REMOVE_DELAY_MS);
    }
  }

  /* ── Helpers ──────────────────────────────────────────────────── */
  riskLabel(r: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      low: $localize`:@@common.low:Low`,
      medium: $localize`:@@common.medium:Medium`,
      high: $localize`:@@common.high:High`,
    };
    return map[r];
  }

  statusLabel(s: WorkingPaperStatus): string {
    const map: Record<WorkingPaperStatus, string> = {
      draft: $localize`:@@common.draft:Draft`,
      in_progress: $localize`:@@common.inProgress:In Progress`,
      prepared: $localize`:@@admin.workingPaperRequests.prepared:Prepared`,
      under_review: $localize`:@@admin.workingPaperRequests.underReview:Under Review`,
      reviewed: $localize`:@@admin.workingPaperRequests.reviewed:Reviewed`,
      approved: $localize`:@@common.approved:Approved`,
      reopened: $localize`:@@common.reopened:Reopened`,
    };
    return map[s] ?? s;
  }

  typeLabel(t: WorkingPaperType): string {
    const map: Record<WorkingPaperType, string> = {
      lead_schedule: $localize`:@@admin.workingPaperRequests.leadSchedule:Lead Schedule`,
      test_of_controls: $localize`:@@admin.workingPaperRequests.testOfControls:Test of Controls`,
      substantive_test: $localize`:@@admin.workingPaperRequests.substantiveTest:Substantive Test`,
      analytical_review: $localize`:@@admin.workingPaperRequests.analyticalReview:Analytical Review`,
      reconciliation: $localize`:@@admin.workingPaperRequests.reconciliation:Reconciliation`,
      memo: $localize`:@@admin.workingPaperRequests.memorandum:Memorandum`,
      confirmation: $localize`:@@admin.workingPaperRequests.confirmation:Confirmation`,
      other: $localize`:@@common.other:Other`,
    };
    return map[t] ?? t;
  }

  typeIcon(t: WorkingPaperType): string {
    const map: Record<WorkingPaperType, string> = {
      lead_schedule: 'pi-list', test_of_controls: 'pi-verified',
      substantive_test: 'pi-search', analytical_review: 'pi-chart-line',
      reconciliation: 'pi-sync', memo: 'pi-file-edit',
      confirmation: 'pi-envelope', other: 'pi-file',
    };
    return map[t] ?? 'pi-file';
  }

  trackById = (_: number, i: ReviewWorkingPaper) => i.id;
}