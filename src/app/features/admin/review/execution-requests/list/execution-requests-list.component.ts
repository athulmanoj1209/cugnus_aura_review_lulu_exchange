import {
  Component, OnInit, computed, inject, signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { ObservationComponent, AddObservationDrawerData } from '@/app/features/audits/audit-execution/observation/manage/observation.component';
import { EvidenceComponent, AddEvidenceDrawerData } from '@/app/features/audits/audit-execution/evidence/manage/evidence.component';
import { RecommendationComponent, AddRecommendationDrawerData } from '@/app/features/audits/audit-execution/recommendation/manage/recommendation.component';
import { FilterModalComponent, FilterOption } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

// Client-mode aware org data — same switch used by risk-register-list.
// component.ts / risk-approval-pending-list.component.ts. When
// CLIENT_MODE_VALUE is 'internal-audit', the Company / Division /
// Sub-Division filter options are drawn from the single-company "DAR
// Exchange" *-indi-org static seed files instead of ORG_STATIC_DATA's
// multi-company audit-firm roster.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

// Shared Company → Division → Sub-Division static data — the same file every
// other list/drawer in the app now reads from (Recommendations, Working
// Papers, Assign Auditors, Regulation Library, Risk Approvals, etc.)
// instead of the CompanyDataService (id-keyed) lookup this page used to
// have. Company/Division/Sub-Division option *values* are the real display
// NAMES from company-org-data.ts, matching how PendingItem.company/division/
// subDivision are plain display-name strings, not ids/codes. Division/
// Sub-Division cascade off whichever Companies/Divisions are currently
// checked in the (multi-select) Filters modal — see the computed()s below.
//
// NOTE: the shared <app-filter-modal> component itself (filter-modal.ts/
// html/scss) was not part of the files uploaded for this change, so it
// couldn't be inspected here — same caveat as the Risk Approvals page.


/* ── Types ──────────────────────────────────────────────────────── */
export type PendingItemType = 'observation' | 'evidence' | 'recommendation';
export type PendingStatus   = 'pending_review' | 'pending_approval' | 'submitted' | 'approved' | 'rejected';
export type RiskRating      = 'critical' | 'high' | 'medium' | 'low';

export interface PendingItem {
  id: string;
  title: string;
  type: PendingItemType;
  status: PendingStatus;
  riskRating: RiskRating;
  description: string;
  submittedBy: string;
  submittedDate: Date;
  company: string;
  division: string;
  subDivision: string;
  dueDate?: Date;
  linkedId?: string;
  scope?: string;
  subscope?: string;
}

/* ── Mock data ──────────────────────────────────────────────────── */
// `company`/`division`/`subDivision` below are now real NAMES from
// company-org-data.ts (e.g. 'Gulf Horizon Logistics' / 'Jebel Ali Free
// Zone HQ' / 'Information Technology') instead of the previous
// CompanyDataService id ('al-noor-jewellery') paired with free-text
// division/sub-division placeholders ('Dubai', 'IT', 'HR', 'Legal') that
// don't exist anywhere in the real division/sub-division roster — so the
// Company/Division/Sub-Division filters (now sourced from the same file)
// actually match these records. Each triple was checked against
// company-org-data.ts to make sure that exact company → division →
// sub-division combination really exists, and picked to stay close to each
// item's original sub-division where a real equivalent exists (e.g. every
// "IT"-themed item now sits under Gulf Horizon Logistics, the one company
// with a real "Information Technology" sub-division; "HR" → Marwa Gold &
// Gems' real "Human Resources" sub-division; "Legal"/"Compliance" → Al Waha
// Construction & Contracting's "Legal & Governance").
const MOCK: PendingItem[] = [
  {
    id: 'OBS-001', type: 'observation', status: 'pending_approval', riskRating: 'critical',
    title: 'Lack of segregation of duties in payment approval',
    description: 'The same individual has access to both create and approve payments, increasing fraud risk.',
    submittedBy: 'Athul Manoj', submittedDate: new Date('2025-03-10'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Finance & Accounting',
    dueDate: new Date('2025-04-01'), linkedId: 'F-008',
  },
  {
    id: 'EV-002', type: 'evidence', status: 'pending_review', riskRating: 'high',
    title: 'User access log — March 2025',
    description: 'Exported access log showing all login events for the finance module in March 2025.',
    submittedBy: 'Sara Ahmed', submittedDate: new Date('2025-03-15'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    dueDate: new Date('2025-04-10'), linkedId: 'OBS-001',
  },
  {
    id: 'REC-003', type: 'recommendation', status: 'pending_approval', riskRating: 'medium',
    title: 'Update HR policy to reflect 2024 labour law amendments',
    description: 'HR policy document should be revised and re-approved to align with 2024 labour law changes.',
    submittedBy: 'John Smith', submittedDate: new Date('2025-03-20'),
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk', subDivision: 'Human Resources',
    dueDate: new Date('2025-05-31'), linkedId: 'F-021',
  },
  {
    id: 'EV-004', type: 'evidence', status: 'submitted', riskRating: 'high',
    title: 'Patch deployment report — Q1 2025',
    description: 'Report showing average patch deployment timeline of 45 days, exceeding the 14-day SLA.',
    submittedBy: 'Athul Manoj', submittedDate: new Date('2025-04-01'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    linkedId: 'OBS-004',
  },
  {
    id: 'REC-005', type: 'recommendation', status: 'pending_review', riskRating: 'low',
    title: 'Add automatic renewal clauses to vendor contracts',
    description: 'Standard contract templates should include renewal and termination notice clauses.',
    submittedBy: 'Meenu AM', submittedDate: new Date('2025-04-05'),
    company: 'Al Waha Construction & Contracting', division: 'Dubai Investment Park Office', subDivision: 'Legal & Governance',
    dueDate: new Date('2025-06-30'),
  },
  {
    id: 'OBS-006', type: 'observation', status: 'pending_review', riskRating: 'high',
    title: 'Backup restoration not tested in last 12 months',
    description: 'Disaster recovery procedures require quarterly backup restoration tests.',
    submittedBy: 'Sara Ahmed', submittedDate: new Date('2025-04-08'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    dueDate: new Date('2025-04-30'), linkedId: 'F-012',
  },
  {
    id: 'EV-007', type: 'evidence', status: 'pending_approval', riskRating: 'medium',
    title: 'AML transaction screening output — Feb 2025',
    description: 'Screening results from the AML engine for February 2025 transactions.',
    submittedBy: 'John Smith', submittedDate: new Date('2025-04-11'),
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom', subDivision: 'Finance & Accounting',
    linkedId: 'OBS-003',
  },
  {
    id: 'REC-008', type: 'recommendation', status: 'pending_approval', riskRating: 'critical',
    title: 'Implement real-time fraud detection on payment gateway',
    description: 'Deploy ML-based fraud detection to flag anomalous payment patterns in real time.',
    submittedBy: 'Athul Manoj', submittedDate: new Date('2025-04-14'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Finance & Accounting',
    dueDate: new Date('2025-05-15'), linkedId: 'F-008',
  },

  // ── Added from Evidence Repository (3 items), Observations currently
  // 'submitted' (all 4), and Recommendations currently 'open' (both) — see
  // evidence-list.component.ts / observation-list.component.ts /
  // recommendation-list.component.ts. Each is still a separate mock store
  // (same temporary bridge caveat as addPendingItem() below), so these are
  // hand-copied snapshots of those records rather than a live join; ids are
  // reused as-is since they're unique across this MOCK array.

  // -- Evidence (3) --------------------------------------------------------
  {
    id: 'EV-014', type: 'evidence', status: 'pending_review', riskRating: 'high',
    title: 'Privileged Access Sample — Screenshots',
    description: 'Screenshots of the IAM console showing the sampled privileged accounts and their last login timestamps.',
    submittedBy: 'Bob Smith', submittedDate: new Date('2026-06-11'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'IT',
    linkedId: 'F-078',
  },
  {
    id: 'EV-015', type: 'evidence', status: 'pending_approval', riskRating: 'medium',
    title: 'Fixed Asset Additions — Purchase Invoices',
    description: 'Purchase invoices for the sampled fixed asset additions, submitted for review against the capitalisation policy.',
    submittedBy: 'Bob Smith', submittedDate: new Date('2026-06-15'),
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'External Audit',
    linkedId: 'F-081',
  },
  {
    id: 'EV-017', type: 'evidence', status: 'rejected', riskRating: 'high',
    title: 'PO Approval Matrix — Superseded Version',
    description: 'The submitted PO approval matrix was superseded by a newer authorisation policy; rejected pending resubmission of the current version.',
    submittedBy: 'Bob Smith', submittedDate: new Date('2026-06-29'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'Procurement',
    linkedId: 'F-091',
  },

  // -- Observations, status: 'submitted' (4) -------------------------------
  {
    id: 'OBS-005', type: 'observation', status: 'pending_review', riskRating: 'low',
    title: 'Vendor contracts missing AML screening and renewal clauses',
    description: 'A sample of 20 vendor contracts reviewed against the AML/CFT policy revealed that 12 contracts do not include mandatory sanctions-screening provisions or automatic annual renewal triggers.',
    submittedBy: 'Meenu AM', submittedDate: new Date('2025-04-05'),
    company: 'Al Waha Construction & Contracting', division: 'Dubai Investment Park Office', subDivision: 'Legal & Governance',
    dueDate: new Date('2025-05-05'),
  },
  {
    id: 'OBS-008', type: 'observation', status: 'pending_review', riskRating: 'high',
    title: 'Transfer pricing documentation incomplete for intercompany transactions',
    description: 'A review of the tax audit file revealed that intercompany transfer pricing documentation does not comply with OECD guidelines for 8 out of 15 transactions tested.',
    submittedBy: 'Ravi Shankar', submittedDate: new Date('2025-04-20'),
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio', subDivision: 'Finance & Accounting',
    dueDate: new Date('2025-05-20'),
  },
  {
    id: 'OBS-011', type: 'observation', status: 'pending_review', riskRating: 'medium',
    title: 'Health and safety incident reporting process not consistently followed',
    description: 'A review of health and safety records across three operational sites found that only 34% of workplace incidents were formally reported within the required 24-hour window.',
    submittedBy: 'Layla Hassan', submittedDate: new Date('2025-05-08'),
    company: 'Falcon Gulf Jewellery Trading', division: 'Al Ain Branch', subDivision: 'Retail Operations',
    dueDate: new Date('2025-06-08'),
  },
  {
    id: 'OBS-014', type: 'observation', status: 'pending_review', riskRating: 'critical',
    title: 'Orphaned privileged IT accounts identified',
    description: 'Sample testing of privileged account listings identified 3 accounts belonging to employees who left the organisation more than 60 days prior, still holding active elevated access.',
    submittedBy: 'Bob Smith', submittedDate: new Date('2026-06-12'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'IT',
    dueDate: new Date('2026-07-12'), linkedId: 'F-078',
  },

  // -- Recommendations, status: 'open' (2) ---------------------------------
  {
    id: 'REC-002', type: 'recommendation', status: 'pending_review', riskRating: 'high',
    title: 'Conduct quarterly user access review',
    description: 'Schedule a formal review of all system user accounts every quarter.',
    submittedBy: 'IT Manager', submittedDate: new Date('2025-03-16'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    dueDate: new Date('2025-07-15'), linkedId: 'F-005',
  },
  {
    id: 'REC-004', type: 'recommendation', status: 'pending_review', riskRating: 'high',
    title: 'Reduce patch deployment window to 14 days',
    description: 'Establish a formal patch management SLA of 14 days for critical patches.',
    submittedBy: 'IT Security Lead', submittedDate: new Date('2025-04-02'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Hallmarking & Certification',
    dueDate: new Date('2025-08-01'), linkedId: 'F-034',
  },
];

/**
 * Shared, module-level signal backing this queue — a plain array (`MOCK`)
 * can be read from anywhere, but writes to it wouldn't trigger change
 * detection in whichever component instance is currently on screen. Wrapping
 * it in a signal here means a new item pushed in from *outside* this
 * component (via `addPendingItem()` below — e.g. from EvidenceListComponent
 * right after a new Evidence is submitted) shows up immediately both in this
 * page's own list and in every other reader of `getPendingItemsByType` /
 * `countPendingItemsByType` (e.g. the auditor dashboard's Reviews tab).
 * This is a deliberately lightweight, temporary, client-only bridge between
 * mock stores — nothing here is persisted to a real backend yet.
 */
/* ── Internal-audit mode ─────────────────────────────────────────────
 * The MOCK names above belong to the multi-company ORG_STATIC_DATA roster,
 * which the add-observation/evidence/recommendation drawers don't list in
 * 'internal-audit' mode — so their Company/Division/Sub-Division selects came
 * up blank on View. Same fix as audit-finding-data.ts: keep every item
 * as-is but cycle its org fields through the ACTIVE internal-audit org's
 * real company/division/sub-division/scope/sub-scope combos. */
const ACTIVE_ORG_DATA =
  CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

type OrgCombo = Pick<PendingItem, 'company' | 'division' | 'subDivision' | 'scope' | 'subscope'>;

const INTERNAL_AUDIT_ORG_COMBOS: OrgCombo[] = CLIENT_MODE_VALUE !== 'internal-audit' ? [] :
  ORG_STATIC_DATA_INTERNAL_AUDIT.flatMap(c => c.divisions.flatMap(dv => dv.subDivisions.flatMap(d => {
    const base = { company: c.companyName, division: dv.divisionName, subDivision: d.subDivisionName };
    if (!d.scopes?.length) return [base];
    return d.scopes.flatMap(sc => sc.subScopes?.length
      ? sc.subScopes.map(sub => ({ ...base, scope: sc.scopeName, subscope: sub.subScopeName }))
      : [{ ...base, scope: sc.scopeName }]);
  })));

const SEED_ITEMS: PendingItem[] = INTERNAL_AUDIT_ORG_COMBOS.length
  ? MOCK.map((item, i) => ({ ...item, ...INTERNAL_AUDIT_ORG_COMBOS[i % INTERNAL_AUDIT_ORG_COMBOS.length] }))
  : MOCK;

const pendingItemsStore = signal<PendingItem[]>(SEED_ITEMS);

/** All pending items of a given type — lets other pages (e.g. the auditor
 *  dashboard's Reviews tab) source their Observation/Evidence review data
 *  from this same queue instead of keeping a second, disconnected mock. */
export function getPendingItemsByType(type: PendingItemType): PendingItem[] {
  return pendingItemsStore().filter(i => i.type === type);
}

/** Count of pending items of a given type — see {@link getPendingItemsByType}. */
export function countPendingItemsByType(type: PendingItemType): number {
  return pendingItemsStore().filter(i => i.type === type).length;
}

/**
 * Pushes a new item onto the shared pending-approvals queue (newest first).
 * Call this from wherever a new Observation/Evidence/Recommendation is
 * created — e.g. EvidenceListComponent's "+ New Evidence" flow — so it shows
 * up here awaiting review without keeping a second, disconnected mock.
 */
export function addPendingItem(item: PendingItem): void {
  pendingItemsStore.update(list => [item, ...list]);
}

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, FormsModule,
    ButtonModule, InputTextModule, TooltipModule,
    FilterModalComponent, PaginationBarComponent,DrawIconComponent
  ],
  templateUrl: './execution-requests-list.component.html',
  styleUrl:    './execution-requests-list.component.scss',
})
export class ExecutionApprovalListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly route = inject(ActivatedRoute);

  // Backed by the shared module-level store above (not a fresh local signal)
  // so items added from outside this component — e.g. a new Evidence
  // submitted from the Evidence Repository — are reflected here too.
  readonly items       = pendingItemsStore;
  readonly viewMode    = signal<'grid' | 'list'>('grid');
  readonly searchQuery = signal('');

  /**
   * IDs currently mid-way through the approve/reject flow: their status has
   * already been updated in `items`, but they're kept around (styled via
   * `.is-removing` in the template) for a brief moment so the reviewer sees
   * the new status before the card/row fades out of this pending queue.
   * Purely a client-side/UI affordance for now — nothing is persisted to a
   * backend yet. Same pattern as WorkingPaperReviewListComponent.
   */
  readonly removingIds = signal<Set<string>>(new Set());

  /** How long (ms) a reviewed item lingers, showing its new status, before
   *  being removed from the pending queue. */
  private static readonly REMOVE_DELAY_MS = 900;

  // ── Pagination ─────────────────────────────────────────────────────────────
  readonly pageSize    = signal(8);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = [8, 25, 50, 100];

  // ── Filter state (arrays — multi-select) ──────────────────────────────────
  readonly filterTypes        = signal<string[]>([]);
  readonly filterStatuses     = signal<string[]>([]);
  readonly filterCompanies     = signal<string[]>([]);
  readonly filterDivisions     = signal<string[]>([]);
  readonly filterSubDivisions  = signal<string[]>([]);
  readonly filterSubmittedBys  = signal<string[]>([]);

  /**
   * Pre-applies the Type filter when navigated here from a dashboard stat
   * card, e.g. /approval-list?type=observation (see the auditor dashboard's
   * Reviews tab).
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      if (type) {
        this.filterTypes.set([type]);
        this.currentPage.set(1);
      }
    });
  }

  // ── Static options (no "All …" sentinel — multi-select uses empty array) ──
  readonly typeOptions: FilterOption[] = [
    { label: $localize`:@@admin.executionRequests.observation:Observation`,    value: 'observation' },
    { label: $localize`:@@admin.executionRequests.evidence:Evidence`,       value: 'evidence' },
    { label: $localize`:@@admin.executionRequests.recommendation:Recommendation`, value: 'recommendation' },
  ];
  readonly statusOptions: FilterOption[] = [
    { label: $localize`:@@common.pendingReview:Pending Review`,   value: 'pending_review' },
    { label: $localize`:@@admin.executionRequests.pendingApproval:Pending Approval`, value: 'pending_approval' },
    { label: $localize`:@@common.submitted:Submitted`,        value: 'submitted' },
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
   * PendingItem.company).
   */
  readonly companyOptions = computed<FilterOption[]>(() =>
    ACTIVE_ORG_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label))
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
      const names = new Set(companies.flatMap(c => c.divisions).map(dv => dv.divisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(dv => dv.divisionName));
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
        .filter(dv => dv.hasSubDivision !== false)
        .filter(dv => !selectedDivisions.length || selectedDivisions.includes(dv.divisionName));
      const names = new Set(divisions.flatMap(dv => dv.subDivisions).map(d => d.subDivisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ACTIVE_ORG_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ACTIVE_ORG_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(dv => dv.hasSubDivision !== false)
      .filter(dv => !selectedDivisions.length || selectedDivisions.includes(dv.divisionName));
    const names = new Set(divisions.flatMap(dv => dv.subDivisions).map(d => d.subDivisionName));
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

  readonly submitterOptions = computed<FilterOption[]>(() =>
    [...new Set(this.items().map(i => i.submittedBy))].sort().map(v => ({ label: v, value: v }))
  );

  // ── Summary counts ────────────────────────────────────────────────────────
  readonly counts = computed(() => {
    const all = this.items();
    return {
      total:           all.length,
      observations:    all.filter(i => i.type === 'observation').length,
      evidences:       all.filter(i => i.type === 'evidence').length,
      recommendations: all.filter(i => i.type === 'recommendation').length,
    };
  });

  // ── Filtered list ─────────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    let list = this.items();
    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.submittedBy.toLowerCase().includes(q),
    );
    const types        = this.filterTypes();
    const statuses     = this.filterStatuses();
    const companies    = this.filterCompanies();
    const divisions    = this.filterDivisions();
    const subDivisions = this.subDivisionEnabled() ? this.filterSubDivisions() : [];
    const submittedBys = this.filterSubmittedBys();

    if (types.length)        list = list.filter(i => types.includes(i.type));
    if (statuses.length)     list = list.filter(i => statuses.includes(i.status));
    if (companies.length)    list = list.filter(i => companies.includes(i.company));
    if (divisions.length)    list = list.filter(i => divisions.includes(i.division));
    if (subDivisions.length) list = list.filter(i => subDivisions.includes(i.subDivision));
    if (submittedBys.length) list = list.filter(i => submittedBys.includes(i.submittedBy));
    return list;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    this.filterTypes().length > 0 ||
    this.filterStatuses().length > 0 ||
    this.filterCompanies().length > 0 ||
    this.filterDivisions().length > 0 ||
    this.filterSubDivisions().length > 0 ||
    this.filterSubmittedBys().length > 0
  );

  /** The current page slice. */
  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * size, page * size);
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  setView(m: 'grid' | 'list') { this.viewMode.set(m); }
  onSearch(q: string)         { this.searchQuery.set(q); this.currentPage.set(1); }

  onTypesChange(v: string[])        { this.filterTypes.set(v ?? []);        this.currentPage.set(1); }
  onStatusesChange(v: string[])     { this.filterStatuses.set(v ?? []);     this.currentPage.set(1); }
  onCompaniesChange(v: string[])     { this.filterCompanies.set(v ?? []);     this.currentPage.set(1); }
  onDivisionsChange(v: string[])     { this.filterDivisions.set(v ?? []);     this.currentPage.set(1); }
  onSubDivisionsChange(v: string[])  { this.filterSubDivisions.set(v ?? []);  this.currentPage.set(1); }
  onSubmittedBysChange(v: string[])  { this.filterSubmittedBys.set(v ?? []);  this.currentPage.set(1); }

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

  clearAll(): void {
    this.searchQuery.set('');
    this.filterTypes.set([]);
    this.filterStatuses.set([]);
    this.filterCompanies.set([]);
    this.filterDivisions.set([]);
    this.filterSubDivisions.set([]);
    this.filterSubmittedBys.set([]);
    this.currentPage.set(1);
  }

  async openDetail(item: PendingItem): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ref: any;

    // The drawers' company -> division -> sub-division reset subscriptions fire
    // during patchValue in key order, so these three must stay first and in
    // this order or the later reset blanks the earlier value.
    const org = { company: item.company, division: item.division, subDivision: item.subDivision };
    // Scope/subscope are reset when sub-division changes, so they go after it.
    const scopes = { scope: item.scope ?? '', subscope: item.subscope ?? '' };

    if (item.type === 'observation') {
      ref = this.drawer.open<ObservationComponent, AddObservationDrawerData>(
        ObservationComponent, {
          width: '720px',
          data: { mode: 'approve', existing: { ...org, ...scopes, id: item.id, title: item.title, description: item.description,
            riskRating: item.riskRating, taskId: '', evidenceIds: [], status: 'approved' } },
        },
      );
    } else if (item.type === 'evidence') {
      ref = this.drawer.open<EvidenceComponent, AddEvidenceDrawerData>(
        EvidenceComponent,
        { width: '720px', data: { mode: 'approve', existing: { ...org, ...scopes, id: item.id, title: item.title, description: item.description } } },
      );
    } else if (item.type === 'recommendation') {
      ref = this.drawer.open<RecommendationComponent, AddRecommendationDrawerData>(
        RecommendationComponent, {
          width: '720px',
          data: { mode: 'approve', existing: { ...org, id: item.id, title: item.title, description: item.description,
            priority: 'medium', status: 'verified', findingId: item.linkedId ?? '', assignedTo: item.submittedBy } },
        },
      );
    }

    if (!ref) return;

    // ObservationComponent / EvidenceComponent / RecommendationComponent
    // all close their drawer with `approvalAction` (and `form.approverNotes`) —
    // not `reviewAction`/`reviewerNotes` (that naming is only what
    // WorkingPapersComponent uses for the working-paper review drawer).
    const result = (await ref.afterClosed) as
      { approvalAction?: 'approve' | 'reject'; form?: { approverNotes?: string } } | null;
    if (!result?.approvalAction) return;

    // 1. Reflect the reviewer's decision on the item's status right away.
    const newStatus: PendingStatus = result.approvalAction === 'approve' ? 'approved' : 'rejected';
    this.items.update(list =>
      list.map(i => (i.id === item.id ? { ...i, status: newStatus } : i)),
    );

    // 2. Mark it as removing so the card/row can show that updated status
    //    briefly (see `.is-removing` styling) before it's taken out of this
    //    pending-approvals queue.
    this.removingIds.update(ids => new Set(ids).add(item.id));

    console.info('[stub]', item.type, item.id, result.approvalAction, result.form?.approverNotes);

    // 3. After the brief delay, actually drop it from the pending list — it
    //    no longer needs review/approval. This only removes it from this
    //    screen's local (mock) state; it isn't a persisted delete.
    setTimeout(() => {
      this.items.update(list => list.filter(i => i.id !== item.id));
      this.removingIds.update(ids => {
        const next = new Set(ids);
        next.delete(item.id);
        return next;
      });
    }, ExecutionApprovalListComponent.REMOVE_DELAY_MS);
  }

  typeLabel(t: PendingItemType): string {
    const map: Record<PendingItemType, string> = {
      observation: $localize`:@@admin.executionRequests.observation:Observation`,
      evidence: $localize`:@@admin.executionRequests.evidence:Evidence`,
      recommendation: $localize`:@@admin.executionRequests.recommendation:Recommendation`,
    };
    return map[t];
  }
  statusLabel(s: PendingStatus): string {
    const map: Record<PendingStatus, string> = {
      pending_review: $localize`:@@common.pendingReview:Pending Review`,
      pending_approval: $localize`:@@admin.executionRequests.pendingApproval:Pending Approval`,
      submitted: $localize`:@@common.submitted:Submitted`,
      approved: $localize`:@@common.approved:Approved`,
      rejected: $localize`:@@common.rejected:Rejected`,
    };
    return map[s];
  }
  riskLabel(r: RiskRating): string {
    const map: Record<RiskRating, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };
    return map[r];
  }
  isOverdue(d?: Date): boolean     { return !!d && d < new Date(); }

  trackById = (_: number, i: PendingItem) => i.id;
}