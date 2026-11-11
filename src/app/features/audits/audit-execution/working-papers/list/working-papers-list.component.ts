import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { WorkingPapersComponent, AddWorkingPaperDrawerData, AddWorkingPaperResult } from '../manage/working-papers.component';
import { WorkingPapersProfileComponent, WorkingPaperDetailDrawerData } from '../profile/working-papers-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';



import { internalAuditOrgFieldsFor, ORG_STATIC_DATA_INTERNAL_AUDIT } from '../../../Org-data-internal-audit';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
// Temporary, client-only bridge into the Working Paper Review queue (see
// working-paper-review-list.component.ts) — adjust this relative path if
// that component lives somewhere else in your tree; it's assumed to be a
// sibling folder of this one, same as add-working-paper/.
import { addReviewWorkingPaper, ReviewWorkingPaper } from '@/app/features/admin/review/working-paper-requests/list/working-paper-requests-list.component';

// Which client this build is running for — decides whether Company/Division/
// Sub-Division filter options (and the mock working papers' own company/
// division/subDivision values) are sourced from the multi-company audit-firm
// org data (company-org-data.ts) or from the single-company internal-audit
// seed files below. NOTE: adjust these three import paths if
// client-mode.ts / company-static-indi-org.data.ts / division-static-indi-org.data.ts /
// sub-division-static-indi-org.data.ts don't live one directory up from this
// component in your actual project layout.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { ORG_STATIC_DATA } from '../../../organization/company/company-org-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import {
  RISK_LEVEL_RANK,
  WORKING_PAPER_ALL_STATUSES,
  WORKING_PAPER_CURRENT_USER_NAME,
  WORKING_PAPER_DATE_FORMAT_OPTIONS,
  WORKING_PAPER_DATE_LOCALE,
  WORKING_PAPER_DEFAULT_STATUS,
  WORKING_PAPER_DRAWER_WIDTH,
  WORKING_PAPER_FILE_PREVIEW_COUNT,
  WORKING_PAPER_FILE_SIZE_BASE,
  WORKING_PAPER_FILE_SIZE_UNITS,
  WORKING_PAPER_ID_LETTER_BASE,
  WORKING_PAPER_ID_STEP,
  WORKING_PAPER_LIST_PAGE_SIZE,
  WORKING_PAPER_OPEN_ADD_FLAG,
  WORKING_PAPER_QUERY_PARAMS,
  WORKING_PAPER_STATUS_PRESETS,
  WorkingPaperBlockActions,
  WorkingPaperDrawerModes,
  WorkingPaperFilterKeys,
  WorkingPaperSortColumns,
  WorkingPaperSortDirections,
  WorkingPaperStatuses,
  WorkingPaperViewModes,
  type RiskLevel,
  type WorkingPaperBlockAction,
  type WorkingPaperFilterKey,
  type WorkingPaperSortColumn,
  type WorkingPaperSortDirection,
  type WorkingPaperStatus,
  type WorkingPaperType,
  type WorkingPaperViewMode,
} from '../constants/working-papers.constants';
import {
  AUDITOR_WORKING_PAPER_STATUS_LABELS,
  RISK_LEVEL_LABELS,
  RISK_LEVEL_OPTIONS,
  WORKING_PAPER_ACTIVE_ICONS,
  WORKING_PAPER_FILE_ICON_DEFAULT,
  WORKING_PAPER_FILE_ICONS,
  WORKING_PAPER_FILTER_CHIP_LABELS,
  WORKING_PAPER_FINDING_TITLES,
  WORKING_PAPER_SORT_ICONS,
  WORKING_PAPER_STATUS_LABELS,
  WORKING_PAPER_STATUS_OPTIONS,
  WORKING_PAPER_TYPE_LABELS,
  WORKING_PAPER_TYPE_OPTIONS,
} from '../constants/working-papers-labels.constants';
import {
  WORKING_PAPER_ACTIVE_LABELS,
  WORKING_PAPER_EMPTY_VALUE,
  WORKING_PAPER_NO_RESULTS,
  WORKING_PAPER_SUB_DIVISION_FILTER_PLACEHOLDERS,
  auditorPaperLabel,
  filterChipLabel,
  pageRangeLabel,
  taskFilterOptionLabel,
} from '../constants/working-papers-messages.constants';

// Common Company -> Division -> Sub-Division static data — the same file the
// Companies/Members pages and the Evidence/Observations/Findings/
// Recommendations list filters and their Add drawers read from — instead of
// deriving the Company/Division/Sub-Division filter options from whatever
// happened to be present in the (placeholder "Crowe UAE"/"Dubai"/"Internal
// Audit"-style) mock working papers below. Filter option *values* are the
// real company/division/subDivision *names* (matching WorkingPaper.company/
// division/subDivision, which are plain display-name strings, not ids/codes),
// and Division/Sub-Division cascade off whatever Company/Division is currently
// selected — same pattern as FindingsListComponent's multi-select filters.
// "Audit Area" (scope) and its sub-area (subscope) are also cascaded off
// company-org-data.ts now (see WorkingPapersComponent) — the Area filter
// below (scopeFilterOptions) still derives from whatever's on the working
// papers themselves, which now holds real per-division scope names.
//
// When CLIENT_MODE_VALUE is 'internal-audit', Company/Division/Sub-Division
// filter options are instead sourced from company-static-indi-org.data.ts /
// division-static-indi-org.data.ts / sub-division-static-indi-org.data.ts
// respectively (the single-company DAR Exchange seed) — everything else is
// unchanged.


/* ── Model ─────────────────────────────────────────────────────────────── */

export interface WorkingPaperFile {
  name: string;
  size: number;
  url?: string;
  file?: File;
}

// Value sets live in ../constants; re-exported so existing importers keep working.
export type { RiskLevel, WorkingPaperStatus, WorkingPaperType } from '../constants/working-papers.constants';

export interface WorkingPaper {
  id: string;                 // Working paper reference / index (e.g. A-100)
  title: string;
  wpType: WorkingPaperType;
  scope: string;              // Audit area
  subscope: string;           // Sub-area
  assertion: string;          // Audit assertion covered
  riskLevel: RiskLevel;
  status: WorkingPaperStatus;
  taskId: string;
  taskTitle: string;
  findingId: string;
  findingTitle: string;
  preparedBy: string;
  preparedDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
  createdDate: Date;
  files: WorkingPaperFile[];
  objective?: string;
  conclusion?: string;
  description?: string;
  company?: string;
  division?: string;
  subDivision?: string;
  isActive?: boolean;
}

type SortColumn = WorkingPaperSortColumn;
type SortDir = WorkingPaperSortDirection;

// The single company seeded for the active internal-audit org (DAR Exchange,
// XYZ Broadcast, ...) — see INTERNAL_AUDIT_CLIENT_KEY_VALUE in client-mode.ts.
const INTERNAL_AUDIT_COMPANY_NAME = COMPANIES_SEED[0]?.companyName ?? '';

// Division -> sub-division names, sourced from the real per-org sub-division
// catalog (sub-division-static-data.ts) rather than scraped off the
// mock working papers below, so the Sub-Division filter always offers the
// full canonical list for the active internal-audit org (DAR Exchange / XYZ
// Broadcast), same reasoning as INTERNAL_AUDIT_COMPANY_NAME above.
// Divisions flagged hasSubDivision:false are skipped — they still carry a
// subDivisions array in the seed, but it must not be offered as options.
const INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION = new Map<string, string[]>(
  SUB_DIVISION_STATIC_COMPANIES.flatMap(c =>
    c.divisions.filter(b => b.hasSubDivision !== false).map(b => [b.divisionName, b.subDivisions.map(d => d.subDivisionName)] as [string, string[]]),
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
 * internal-audit org's catalog, cycled across the MOCK_WORKING_PAPERS below
 * in 'internal-audit' mode — same approach observation-list.component.ts's
 * INTERNAL_AUDIT_SCOPE_COMBOS / recommendation-list.component.ts's
 * INTERNAL_AUDIT_BRANCH_DEPT_COMBOS use, so this list's Company/Division/
 * Sub-Division columns (and filters) show real org values instead of the
 * audit-firm placeholder names baked into MOCK_WORKING_PAPERS, which don't
 * exist in DAR Exchange's/XYZ Broadcast's real catalog.
 */
const INTERNAL_AUDIT_DIVISION_COMBOS: OrgDivisionSubDivisionCombo[] =
  SUB_DIVISION_INDI_ORG_COMPANIES.flatMap(c =>
    c.divisions.flatMap(b => b.subDivisions.map(d => ({ divisionName: b.divisionName, subDivisionName: d.subDivisionName }))),
  );

function workingPaperOrgFields(index: number, w: WorkingPaper): Pick<WorkingPaper, 'company' | 'division' | 'subDivision' | 'scope' | 'subscope'> {
  if (CLIENT_MODE_VALUE !== 'internal-audit' || INTERNAL_AUDIT_DIVISION_COMBOS.length === 0) {
    return { company: w.company, division: w.division, subDivision: w.subDivision, scope: w.scope, subscope: w.subscope };
  }
  // Keyed by id (not index) so the Working Paper Review queue, which seeds
  // some of these same papers, assigns each one the identical org values —
  // scope/subscope included, since the audit-firm ones baked into
  // MOCK_WORKING_PAPERS don't exist under the internal-audit sub-divisions
  // and left the edit drawer's Scope/Subscope selects blank.
  const org = internalAuditOrgFieldsFor(w.id);
  if (org) return { company: org.company, division: org.branch, subDivision: org.department, scope: org.scope, subscope: org.subscope };
  const combo = INTERNAL_AUDIT_DIVISION_COMBOS[index % INTERNAL_AUDIT_DIVISION_COMBOS.length];
  return { company: INTERNAL_AUDIT_COMPANY_NAME, division: combo.divisionName, subDivision: combo.subDivisionName, scope: w.scope, subscope: w.subscope };
}

/* ── Mock data ──────────────────────────────────────────────────────────── */
// company/division/subDivision/scope/subscope below are real values verified
// to exist together (as one sub-division's own scope + sub-scope) in
// company-org-data.ts — the previous seed data used invented placeholder
// names ("Crowe UAE", "Dubai", "Internal Audit", "Cash & Bank", "Financial
// Controls", ...) that don't exist anywhere in that file, which meant the
// Company/Division/Sub-Division filters (and the Add drawer's Scope/Subscope
// cascade) would always come up empty once wired to real data.

const MOCK_WORKING_PAPERS: WorkingPaper[] = [
  {
    id: 'A-100',
    title: 'Cash & Bank — Lead Schedule',
    wpType: 'lead_schedule',
    scope: 'Financial Statement Audit', subscope: 'Cash & Bank Testing',
    assertion: 'Existence', riskLevel: 'medium', status: 'reviewed',
    taskId: 'TSK-001', taskTitle: 'Review payment controls',
    findingId: 'F-012', findingTitle: 'Unreconciled bank entries',
    preparedBy: 'Athul Manoj', preparedDate: new Date('2025-01-14'),
    reviewedBy: 'Sara Ahmed', reviewedDate: new Date('2025-01-18'),
    createdDate: new Date('2025-01-15'), isActive: true,
    objective: 'Confirm the existence and accuracy of cash and bank balances at period end and agree to the general ledger.',
    conclusion: 'Balances agree to the GL and bank confirmations except for 14 unreconciled entries totalling AED 87,430, referred to F-012.',
    description: 'Lead schedule summarising all active bank accounts with tie-out to confirmations and the trial balance.',
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Retail Operations',
    files: [
      { name: 'cash-lead-schedule.xlsx', size: 145000 },
      { name: 'bank-confirmations.pdf', size: 210000 },
      { name: 'reconciliation-workings.xlsx', size: 87000 },
    ],
  },
  {
    id: 'B-200',
    title: 'Revenue — Substantive Testing',
    wpType: 'substantive_test',
    scope: 'Revenue Recognition Review', subscope: '',
    assertion: 'Occurrence', riskLevel: 'high', status: 'under_review',
    taskId: 'TSK-002', taskTitle: 'Revenue cut-off testing',
    findingId: 'F-005', findingTitle: 'Revenue recognised before delivery',
    preparedBy: 'Sara Ahmed', preparedDate: new Date('2025-02-02'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-02-03'), isActive: true,
    objective: 'Test a sample of revenue transactions around period end to confirm they are recorded in the correct period.',
    conclusion: 'Three transactions totalling AED 1.2M were recognised prior to delivery; recommend adjustment (see F-005).',
    description: 'Substantive detail testing of 40 revenue samples with supporting delivery notes and invoices.',
    company: 'Al Noor Jewellery Group', division: 'Sharjah Showroom', subDivision: 'Retail Operations',
    files: [
      { name: 'revenue-sample-testing.xlsx', size: 320000 },
      { name: 'invoice-support-pack.pdf', size: 298000 },
      { name: 'cutoff-analysis.xlsx', size: 120000 },
    ],
  },
  {
    id: 'C-300',
    title: 'Payroll — Test of Controls',
    wpType: 'test_of_controls',
    scope: 'Payroll Audit', subscope: 'Sampling & Substantive Testing',
    assertion: 'Accuracy', riskLevel: 'medium', status: 'approved',
    taskId: 'TSK-010', taskTitle: 'Payroll controls walkthrough',
    findingId: 'F-021', findingTitle: 'Manual overrides not approved',
    preparedBy: 'John Smith', preparedDate: new Date('2025-02-17'),
    reviewedBy: 'Amy Elsner', reviewedDate: new Date('2025-02-20'),
    createdDate: new Date('2025-02-18'), isActive: false,
    objective: 'Assess the operating effectiveness of payroll authorisation and change-management controls.',
    conclusion: 'Controls operating effectively except manual salary overrides lacked secondary approval (F-021).',
    description: 'Test of controls covering 25 payroll runs and 15 master-data change requests.',
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk', subDivision: 'Retail Operations',
    files: [
      { name: 'payroll-toc-matrix.xlsx', size: 134000 },
      { name: 'change-request-sample.pdf', size: 92000 },
      { name: 'walkthrough-notes.docx', size: 54000 },
    ],
  },
  {
    id: 'D-400',
    title: 'Accounts Payable — Reconciliation',
    wpType: 'reconciliation',
    scope: 'Procurement Audit', subscope: '',
    assertion: 'Completeness', riskLevel: 'low', status: 'prepared',
    taskId: 'TSK-020', taskTitle: 'AP supplier statement recon',
    findingId: 'F-008', findingTitle: 'Unrecorded supplier invoices',
    preparedBy: 'Meenu AM', preparedDate: new Date('2025-02-28'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-03-01'), isActive: true,
    objective: 'Reconcile supplier statements to the AP ledger to test for completeness of liabilities.',
    conclusion: 'Identified AED 210,000 of unrecorded invoices across three suppliers (F-008).',
    description: 'Supplier statement reconciliation for the top 20 vendors by spend.',
    company: 'Falcon Gulf Jewellery Trading', division: 'Al Ain Branch', subDivision: 'Finance & Accounting',
    files: [
      { name: 'ap-reconciliation.xlsx', size: 78000 },
      { name: 'supplier-statements.pdf', size: 210000 },
      { name: 'unrecorded-invoices.xlsx', size: 43000 },
      { name: 'ap-ageing.pdf', size: 180000 },
    ],
  },
  {
    id: 'E-500',
    title: 'Fixed Assets — Analytical Review',
    wpType: 'analytical_review',
    scope: 'Fixed Assets Verification', subscope: 'Control Design Assessment',
    assertion: 'Valuation', riskLevel: 'medium', status: 'in_progress',
    taskId: 'TSK-005', taskTitle: 'Depreciation analytics',
    findingId: 'F-034', findingTitle: 'Depreciation rates inconsistent',
    preparedBy: 'Athul Manoj', preparedDate: new Date('2025-03-11'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-03-12'), isActive: true,
    objective: 'Perform analytical procedures over depreciation charges and additions to identify anomalies.',
    conclusion: 'Depreciation rates for two asset classes deviate from policy; further testing required (F-034).',
    description: 'Analytical review of the fixed asset register with expectation modelling of the depreciation charge.',
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio', subDivision: 'Design & Merchandising',
    files: [
      { name: 'fa-analytics.xlsx', size: 43000 },
      { name: 'depreciation-model.xlsx', size: 41000 },
      { name: 'fa-register-export.csv', size: 39000 },
      { name: 'analytics-summary.pdf', size: 178000 },
    ],
  },
  {
    id: 'F-600',
    title: 'Inventory — Physical Count Memo',
    wpType: 'memo',
    scope: 'Inventory Verification', subscope: 'Data Analytics Testing',
    assertion: 'Existence', riskLevel: 'high', status: 'draft',
    taskId: 'TSK-030', taskTitle: 'Year-end stock count attendance',
    findingId: 'F-017', findingTitle: 'Count sheets not sequentially controlled',
    preparedBy: 'Amy Elsner', preparedDate: new Date('2025-03-24'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-03-25'), isActive: true,
    objective: 'Document observations from attendance at the year-end physical inventory count.',
    conclusion: 'Count process broadly satisfactory; count sheets were not pre-numbered (F-017).',
    description: 'Memorandum recording the auditor’s attendance, test counts, and control observations.',
    company: 'Falcon Gulf Jewellery Trading', division: 'Abu Dhabi Corniche Showroom', subDivision: 'Inventory & Warehousing',
    files: [
      { name: 'stock-count-memo.pdf', size: 135000 },
      { name: 'test-count-sheets.xlsx', size: 88000 },
    ],
  },
  {
    id: 'G-700',
    title: 'Receivables — Confirmation Control',
    wpType: 'confirmation',
    scope: 'Related Party Transactions Review', subscope: '',
    assertion: 'Rights & Obligations', riskLevel: 'medium', status: 'reviewed',
    taskId: 'TSK-040', taskTitle: 'Debtor circularisation',
    findingId: 'F-028', findingTitle: 'Low confirmation response rate',
    preparedBy: 'Ivan Magalhaes', preparedDate: new Date('2025-04-01'),
    reviewedBy: 'Stephen Shaw', reviewedDate: new Date('2025-04-04'),
    createdDate: new Date('2025-04-02'), isActive: true,
    objective: 'Control the debtor confirmation process and evaluate responses and alternative procedures.',
    conclusion: 'Response rate 62%; alternative procedures performed on non-responders with no exceptions (F-028).',
    description: 'Confirmation control schedule tracking dispatch, responses, and reconciling items.',
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio', subDivision: 'E-Commerce',
    files: [
      { name: 'confirmation-control.xlsx', size: 312000 },
      { name: 'signed-confirmations.pdf', size: 890000 },
      { name: 'alt-procedures.xlsx', size: 64000 },
    ],
  },
  {
    id: 'H-800',
    title: 'IT General Controls — Access Testing',
    wpType: 'test_of_controls',
    scope: 'IT General Controls Audit', subscope: '',
    assertion: 'Accuracy', riskLevel: 'high', status: 'reopened',
    taskId: 'TSK-021', taskTitle: 'User access review',
    findingId: 'F-009', findingTitle: 'Excessive privileged access rights',
    preparedBy: 'Ioni Bowcher', preparedDate: new Date('2025-04-09'),
    reviewedBy: 'Michael Chen', reviewedDate: new Date('2025-04-12'),
    createdDate: new Date('2025-04-10'), isActive: true,
    objective: 'Test logical access provisioning, de-provisioning, and segregation-of-duties controls.',
    conclusion: 'Reopened following identification of 22 super-user accounts pending remediation (F-009).',
    description: 'ITGC access control test with review of joiner/mover/leaver samples and SoD conflicts.',
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Inventory & Warehousing',
    files: [
      { name: 'itgc-access-testing.xlsx', size: 440000 },
      { name: 'sod-conflict-report.pdf', size: 210000 },
      { name: 'jml-sample.xlsx', size: 56000 },
    ],
  },
  {
    id: 'I-900',
    title: 'Corporate Tax — Substantive Testing',
    wpType: 'substantive_test',
    scope: 'Financial Statement Audit', subscope: 'Cash & Bank Testing',
    assertion: 'Valuation', riskLevel: 'high', status: 'under_review',
    taskId: 'TSK-011', taskTitle: 'Corporate tax compliance review',
    findingId: 'F-045', findingTitle: 'Deferred tax liability understated',
    preparedBy: 'Stephen Shaw', preparedDate: new Date('2025-04-17'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-04-18'), isActive: false,
    objective: 'Recompute the current and deferred tax provision and agree to supporting schedules.',
    conclusion: 'Deferred tax on property revaluations understated by SAR 1.2M (F-045).',
    description: 'Substantive recalculation of the tax charge with reconciliation to the audited P&L.',
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom', subDivision: 'Retail Operations',
    files: [
      { name: 'tax-testing.xlsx', size: 320000 },
      { name: 'deferred-tax-schedule.xlsx', size: 145000 },
      { name: 'tax-recon.pdf', size: 230000 },
    ],
  },
  {
    id: 'J-1000',
    title: 'Provisions — Analytical Review',
    wpType: 'analytical_review',
    scope: 'Internal Controls Review', subscope: '',
    assertion: 'Completeness', riskLevel: 'medium', status: 'prepared',
    taskId: 'TSK-050', taskTitle: 'Provisions adequacy review',
    findingId: 'F-062', findingTitle: 'Provision not updated for 6+ months',
    preparedBy: 'Michael Chen', preparedDate: new Date('2025-05-04'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-05-05'), isActive: true,
    objective: 'Assess the adequacy and completeness of provisions and accruals at period end.',
    conclusion: 'Legal provision not reassessed in over 180 days; management to update (F-062).',
    description: 'Analytical review of movements in provisions with corroboration to underlying evidence.',
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom', subDivision: 'Finance & Accounting',
    files: [
      { name: 'provisions-review.xlsx', size: 275000 },
      { name: 'legal-letters.pdf', size: 95000 },
    ],
  },
  {
    id: 'K-1100',
    title: 'Related Parties — Confirmation',
    wpType: 'confirmation',
    scope: 'Related Party Transactions Review', subscope: '',
    assertion: 'Presentation & Disclosure', riskLevel: 'low', status: 'reviewed',
    taskId: 'TSK-022', taskTitle: 'Related party disclosures',
    findingId: 'F-051', findingTitle: 'Undisclosed related party transaction',
    preparedBy: 'Reem Al Dosari', preparedDate: new Date('2025-05-18'),
    reviewedBy: 'Anna Fali', reviewedDate: new Date('2025-05-21'),
    createdDate: new Date('2025-05-19'), isActive: true,
    objective: 'Confirm the completeness of related party disclosures with directors and management.',
    conclusion: 'One director loan of AED 350k not disclosed; recommend disclosure (F-051).',
    description: 'Related party confirmation schedule with director representations.',
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk', subDivision: 'Hallmarking & Certification',
    files: [
      { name: 'rp-confirmations.pdf', size: 415000 },
      { name: 'director-reps.pdf', size: 32000 },
      { name: 'rp-schedule.xlsx', size: 148000 },
    ],
  },
  {
    id: 'L-1200',
    title: 'Going Concern — Assessment Memo',
    wpType: 'memo',
    scope: 'Revenue Recognition Review', subscope: '',
    assertion: 'Presentation & Disclosure', riskLevel: 'high', status: 'in_progress',
    taskId: 'TSK-051', taskTitle: 'Going concern evaluation',
    findingId: 'F-071', findingTitle: 'Cash flow forecast overly optimistic',
    preparedBy: 'Anna Fali', preparedDate: new Date('2025-06-01'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-06-02'), isActive: true,
    objective: 'Evaluate management’s going concern assessment and the reasonableness of cash flow forecasts.',
    conclusion: 'Forecast assumptions considered optimistic; sensitivity analysis requested (F-071).',
    description: 'Going concern memorandum documenting the assessment and audit conclusion.',
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Operations',
    files: [
      { name: 'going-concern-memo.pdf', size: 520000 },
      { name: 'cashflow-forecast.xlsx', size: 190000 },
      { name: 'sensitivity-analysis.docx', size: 73000 },
    ],
  },
  {
    id: 'M-1300',
    title: 'IT Access Controls — Sample Testing',
    wpType: 'test_of_controls',
    scope: 'IT Controls', subscope: 'IT General Controls',
    assertion: 'Accuracy', riskLevel: 'medium', status: 'in_progress',
    taskId: 'TSK-052', taskTitle: 'Privileged access review',
    findingId: 'F-078', findingTitle: 'Orphaned accounts identified',
    preparedBy: 'Bob Smith', preparedDate: new Date('2025-06-10'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-06-11'), isActive: true,
    objective: 'Test provisioning and de-provisioning of privileged IT accounts for a sample of joiners/leavers.',
    conclusion: 'Testing in progress; 3 orphaned accounts identified so far pending disablement (F-078).',
    description: 'Sample-based test of controls over privileged account lifecycle management.',
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'IT',
    files: [
      { name: 'privileged-access-sample.xlsx', size: 210000 },
      { name: 'jml-tracker.xlsx', size: 68000 },
    ],
  },
  {
    id: 'N-1400',
    title: 'Fixed Assets — Additions Testing',
    wpType: 'substantive_test',
    scope: 'Fixed Assets', subscope: 'Financial Controls',
    assertion: 'Existence', riskLevel: 'medium', status: 'under_review',
    taskId: 'TSK-053', taskTitle: 'Fixed asset additions verification',
    findingId: 'F-081', findingTitle: 'Capitalisation policy applied inconsistently',
    preparedBy: 'Ivan Magalhaes', preparedDate: new Date('2025-06-14'),
    reviewedBy: 'Bob Smith', reviewedDate: undefined,
    createdDate: new Date('2025-06-15'), isActive: true,
    objective: 'Vouch a sample of fixed asset additions to supporting invoices and confirm correct capitalisation.',
    conclusion: 'Two additions were expensed rather than capitalised, inconsistent with policy (F-081).',
    description: 'Substantive testing of fixed asset additions with supporting purchase documentation.',
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'External Audit',
    files: [
      { name: 'fa-additions-testing.xlsx', size: 185000 },
      { name: 'purchase-invoices.pdf', size: 240000 },
    ],
  },
  {
    id: 'O-1500',
    title: 'Treasury — Cash Flow Forecast Review',
    wpType: 'analytical_review',
    scope: 'Treasury Operations', subscope: 'Cash Management',
    assertion: 'Completeness', riskLevel: 'medium', status: 'draft',
    taskId: 'TSK-054', taskTitle: 'Cash flow forecast validation',
    findingId: 'F-085', findingTitle: 'Forecast variance exceeds threshold',
    preparedBy: 'Bob Smith', preparedDate: new Date('2025-06-20'),
    reviewedBy: undefined, reviewedDate: undefined,
    createdDate: new Date('2025-06-21'), isActive: true,
    objective: 'Review the treasury cash flow forecast methodology and validate key assumptions against actuals.',
    conclusion: 'Draft in progress; initial variance analysis shows a 12% deviation requiring further investigation.',
    description: 'Draft working paper documenting the cash flow forecast review procedures performed to date.',
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'Treasury',
    files: [
      { name: 'cashflow-forecast-draft.xlsx', size: 165000 },
    ],
  },
  {
    id: 'P-1600',
    title: 'Expense Reimbursement — Compliance Testing',
    wpType: 'test_of_controls',
    scope: 'Expense Management', subscope: 'Operational Review',
    assertion: 'Accuracy', riskLevel: 'low', status: 'approved',
    taskId: 'TSK-055', taskTitle: 'Expense claims compliance testing',
    findingId: 'F-088', findingTitle: 'Minor policy deviations in travel claims',
    preparedBy: 'Bob Smith', preparedDate: new Date('2025-06-25'),
    reviewedBy: 'Sara Ahmed', reviewedDate: new Date('2025-06-28'),
    createdDate: new Date('2025-06-26'), isActive: true,
    objective: 'Test a sample of employee expense reimbursement claims for compliance with the travel and expense policy.',
    conclusion: 'Testing complete; 2 of 40 claims sampled had minor documentation gaps, not deemed material.',
    description: 'Compliance test of expense reimbursement claims against the approved policy thresholds.',
    company: 'Crowe UAE', division: 'Abu Dhabi', subDivision: 'Finance',
    files: [
      { name: 'expense-claims-sample.xlsx', size: 132000 },
      { name: 'travel-policy-v2.pdf', size: 88000 },
    ],
  },
  {
    id: 'Q-1700',
    title: 'Procurement — Purchase Order Approval Testing',
    wpType: 'test_of_controls',
    scope: 'Procurement', subscope: 'Purchase Order Controls',
    assertion: 'Occurrence', riskLevel: 'high', status: 'reopened',
    taskId: 'TSK-056', taskTitle: 'PO approval matrix testing',
    findingId: 'F-091', findingTitle: 'Purchase orders approved above authorisation limit',
    preparedBy: 'Michael Chen', preparedDate: new Date('2025-06-29'),
    reviewedBy: 'Bob Smith', reviewedDate: new Date('2025-07-02'),
    createdDate: new Date('2025-06-30'), isActive: true,
    objective: 'Test purchase order approvals against the delegated authority matrix for a sample of high-value orders.',
    conclusion: 'Reopened — 3 purchase orders were approved above the delegated authority limit; additional testing requested.',
    description: 'Test of controls over purchase order approval limits, reopened pending additional sample testing.',
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'Procurement',
    files: [
      { name: 'po-approval-matrix.xlsx', size: 175000 },
      { name: 'authorisation-limits.pdf', size: 64000 },
    ],
  },
];

/** Count of not-yet-approved working papers where the given name is the preparer or reviewer. */
export function countPendingWorkingPapersForAuditor(auditorName: string): number {
  return MOCK_WORKING_PAPERS.filter(w =>
    w.status !== WorkingPaperStatuses.Approved && (w.preparedBy === auditorName || w.reviewedBy === auditorName),
  ).length;
}

export function countPendingWorkingPapersForTeam(auditorNames: readonly string[]): number {
  const team = new Set(auditorNames);
  return new Set(MOCK_WORKING_PAPERS.filter(w => w.status !== WorkingPaperStatuses.Approved && (team.has(w.preparedBy ?? '') || team.has(w.reviewedBy ?? ''))).map(w => w.id)).size;
}

/**
 * Count of working papers where the given name is the preparer or reviewer,
 * matching an exact status when given (pass null for "Total"). Used by the
 * auditor-working-papers-rfis tab's summary cards, so each card's count
 * always matches what this list shows when the card is clicked with the
 * same status passed as a query param.
 */
export function countWorkingPapersForAuditorByStatus(auditorName: string, status: WorkingPaperStatus | null): number {
  return MOCK_WORKING_PAPERS.filter(w =>
    (w.preparedBy === auditorName || w.reviewedBy === auditorName) &&
    (status === null || w.status === status),
  ).length;
}

export interface AuditorWorkingPaperRow {
  paper: string;
  scope: string;
  status: string;
  reviewerStatus: string;
  lastUpdated: string;
  detail: WorkingPaper;
}

const WP_STATUS_DISPLAY: Record<WorkingPaperStatus, { status: string; reviewerStatus: string }> = {
  draft: { status: $localize`:@@audit.workingPapers.draft:Draft`, reviewerStatus: '-' },
  in_progress: { status: $localize`:@@audit.workingPapers.inProgress:In Progress`, reviewerStatus: '-' },
  prepared: { status: $localize`:@@audit.workingPapers.submitted:Submitted`, reviewerStatus: $localize`:@@common.pending:Pending` },
  under_review: { status: $localize`:@@audit.workingPapers.submitted:Submitted`, reviewerStatus: $localize`:@@audit.workingPapers.underReview:Under Review` },
  reviewed: { status: $localize`:@@audit.workingPapers.submitted:Submitted`, reviewerStatus: $localize`:@@audit.workingPapers.approved:Approved` },
  approved: { status: $localize`:@@audit.workingPapers.approved:Approved`, reviewerStatus: $localize`:@@audit.workingPapers.approved:Approved` },
  reopened: { status: $localize`:@@audit.workingPapers.returned:Returned`, reviewerStatus: $localize`:@@audit.workingPapers.returned:Returned` },
};

function formatWpDate(d?: Date): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Every working paper where the given name is the preparer or reviewer,
 * shaped for the auditor-working-papers-rfis tab's "Working Papers" table.
 */
export function getWorkingPapersForAuditor(auditorName: string): AuditorWorkingPaperRow[] {
  return MOCK_WORKING_PAPERS
    .filter(w => w.preparedBy === auditorName || w.reviewedBy === auditorName)
    .map(w => ({
      paper: auditorPaperLabel(w.id, w.title),
      scope: w.scope,
      ...WP_STATUS_DISPLAY[w.status],
      lastUpdated: formatWpDate(w.reviewedDate ?? w.preparedDate),
      detail: w,
    }));
}

/* Finding titles keyed by id — the same map WorkingPapersComponent.findingOptions
   is built from, used to resolve findingTitle when only a findingId comes back from the form. */
const FINDING_TITLES = WORKING_PAPER_FINDING_TITLES;

/* ── Component ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-working-paper-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    DatePickerModule,
    PaginatorModule,
    TooltipModule,
    TagModule,
    PopoverModule,
    ConfirmActionDialogComponent, DrawIconComponent
  ],
  templateUrl: './working-papers-list.component.html',
  styleUrl: './working-papers-list.component.scss',
})
export class WorkingPaperListComponent implements OnInit {
  @ViewChild('filterPanel') filterPanel!: Popover;
  @ViewChild('filesPopover') filesPopover!: Popover;

  private readonly drawer = inject(RightDrawerService);
  private readonly downloader = inject(FileDownloadService);
  private readonly route = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly location = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /** True when this build is running in internal-audit (single-company) mode —
   *  Company/Division/Sub-Division filter options are then sourced from the
   *  *-indi-org static seed files instead of company-org-data.ts. */
  private readonly isInternalAudit = CLIENT_MODE_VALUE === 'internal-audit';

  /* ── Data ── */
  readonly workingPapers = signal<WorkingPaper[]>(
    MOCK_WORKING_PAPERS.map((w, index) => ({ ...w, ...workingPaperOrgFields(index, w) })),
  );

  /* ── View mode ── */
  readonly viewMode = signal<WorkingPaperViewMode>(WorkingPaperViewModes.Grid);

  /* ── Template constants ── */
  readonly WorkingPaperViewModes   = WorkingPaperViewModes;
  readonly WorkingPaperSortColumns = WorkingPaperSortColumns;
  readonly activeLabels            = WORKING_PAPER_ACTIVE_LABELS;
  readonly activeIcons             = WORKING_PAPER_ACTIVE_ICONS;
  readonly filePreviewCount        = WORKING_PAPER_FILE_PREVIEW_COUNT;
  readonly subDivisionPlaceholders = WORKING_PAPER_SUB_DIVISION_FILTER_PLACEHOLDERS;
  readonly emptyValue              = WORKING_PAPER_EMPTY_VALUE;

  /* ── Filters ── */
  readonly searchQuery = signal('');
  readonly selectedFindings = signal<string[]>([]);
  readonly selectedTypes = signal<WorkingPaperType[]>([]);
  readonly selectedStatuses = signal<WorkingPaperStatus[]>([]);
  readonly selectedRisks = signal<RiskLevel[]>([]);
  readonly selectedScopes = signal<string[]>([]);
  readonly selectedTasks = signal<string[]>([]);
  readonly selectedCompanies = signal<string[]>([]);
  readonly selectedDivisions = signal<string[]>([]);
  readonly selectedSubDivisions = signal<string[]>([]);
  readonly selectedPreparers = signal<string[]>([]);
  /** Scope to a specific auditor by name (from the overview "Working Papers Pending" card) — matches preparer OR reviewer. */
  readonly auditorIdFilter = signal<string | null>(null);
  readonly teamAuditorNames = signal<string[]>([]);
  readonly dateRange = signal<(Date | null)[] | null>(null);

  /* ── Sort ── */
  readonly sortColumn = signal<SortColumn | null>(WorkingPaperSortColumns.CreatedDate);
  readonly sortDirection = signal<SortDir>(WorkingPaperSortDirections.Desc);

  /* ── Pagination ── */
  readonly pageSize = WORKING_PAPER_LIST_PAGE_SIZE;
  readonly currentPage = signal(1);

  /* ── Files popover ── */
  readonly moreFilesPaper = signal<WorkingPaper | null>(null);

  /* ── Confirmation dialog ── */
  readonly displayConfirmation = signal(false);
  readonly confirmationAction = signal<WorkingPaperBlockAction>(WorkingPaperBlockActions.Deactivate);
  private readonly pendingPaper = signal<WorkingPaper | null>(null);
  readonly confirmationTarget = this.pendingPaper;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly dateRangeFilterLabel = $localize`:@@audit.workingPapers.dateRange:Date range`;

  /* ── Filter options ── */
  readonly typeOptions: { label: string; value: WorkingPaperType }[] = [
    { label: $localize`:@@audit.workingPapers.leadSchedule:Lead Schedule`, value: 'lead_schedule' },
    { label: $localize`:@@audit.workingPapers.testOfControls:Test of Controls`, value: 'test_of_controls' },
    { label: $localize`:@@audit.workingPapers.substantiveTest:Substantive Test`, value: 'substantive_test' },
    { label: $localize`:@@audit.workingPapers.analyticalReview:Analytical Review`, value: 'analytical_review' },
    { label: $localize`:@@audit.workingPapers.reconciliation:Reconciliation`, value: 'reconciliation' },
    { label: $localize`:@@audit.workingPapers.memorandum:Memorandum`, value: 'memo' },
    { label: $localize`:@@audit.workingPapers.confirmation:Confirmation`, value: 'confirmation' },
    { label: $localize`:@@common.other:Other`, value: 'other' },
  ];

  readonly statusOptions: { label: string; value: WorkingPaperStatus }[] = [
    { label: $localize`:@@audit.workingPapers.draft:Draft`, value: 'draft' },
    { label: $localize`:@@audit.workingPapers.inProgress:In Progress`, value: 'in_progress' },
    { label: $localize`:@@audit.workingPapers.prepared:Prepared`, value: 'prepared' },
    { label: $localize`:@@audit.workingPapers.underReview:Under Review`, value: 'under_review' },
    { label: $localize`:@@audit.workingPapers.reviewed:Reviewed`, value: 'reviewed' },
    { label: $localize`:@@audit.workingPapers.approved:Approved`, value: 'approved' },
    { label: $localize`:@@audit.workingPapers.reopened:Reopened`, value: 'reopened' },
  ];

  readonly riskOptions: { label: string; value: RiskLevel }[] = [
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];

  get subDivisionFilterPlaceholder(): string {
    return this.subDivisionFilterVisible()
      ? $localize`:@@audit.workingPapers.allSubDivisions:All sub-divisions`
      : $localize`:@@audit.workingPapers.noSubDivisionsForDivision:No sub-divisions for this division`;
  }

  fileDownloadTooltip(name: string, size: number): string {
    const formattedSize = this.formatFileSize(size);

    return $localize`:@@audit.workingPapers.fileDownloadTooltip:${name}:fileName: · ${formattedSize}:fileSize: — click to download`;
  }

  moreFilesLabel(count: number): string {
    return $localize`:@@audit.workingPapers.moreFiles:${count}:count: more`;
  }

  fileNameDownloadTooltip(name: string): string {
    return $localize`:@@audit.workingPapers.fileNameDownloadTooltip:${name}:fileName: — click to download`;
  }

  typeFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.typeFilter:Type: ${count}:count:`;
  }

  statusFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.statusFilter:Status: ${count}:count:`;
  }

  riskFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.riskFilter:Risk: ${count}:count:`;
  }

  areaFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.areaFilter:Area: ${count}:count:`;
  }

  taskFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.taskFilter:Task: ${count}:count:`;
  }

  companyFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.companyFilter:Company: ${count}:count:`;
  }

  divisionFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.divisionFilter:Division: ${count}:count:`;
  }

  subDivisionFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.subDivisionFilter:Sub-Division: ${count}:count:`;
  }

  preparerFilterLabel(count: number): string {
    return $localize`:@@audit.workingPapers.preparerFilter:Preparer: ${count}:count:`;
  }

  /** "Audit Area" filter — still derived from whatever's on the working
   *  papers themselves (like Task/Preparer below), which now holds real
   *  per-division scope names from company-org-data.ts instead of the
   *  old invented ones ("Cash & Bank", "Revenue", ...). */
  readonly scopeFilterOptions = computed(() => {
    const set = new Set(this.workingPapers().map(w => w.scope));
    return Array.from(set).sort().map(s => ({ label: s, value: s }));
  });

  readonly taskFilterOptions = computed(() => {
    const map = new Map<string, string>();
    this.workingPapers().forEach(w => map.set(w.taskId, w.taskTitle));
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, label]) => ({ label: taskFilterOptionLabel(value, label), value }));
  });

  /** Company filter options, sourced from company-org-data.ts (not derived
   *  from whatever's in the mock working papers), same as
   *  FindingsListComponent's Company filter. In 'internal-audit' mode this
   *  is always the single active org (DAR Exchange / XYZ Broadcast). */
  readonly companyFilterOptions = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit'
      ? [{ label: INTERNAL_AUDIT_COMPANY_NAME, value: INTERNAL_AUDIT_COMPANY_NAME }]
      : ORG_STATIC_DATA
          .map(c => ({ label: c.companyName, value: c.companyName }))
          .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Division options narrow to the selected Company(ies)' divisions (or every
   *  division, deduped by name, when no Company is selected yet). */
  readonly divisionFilterOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const names = new Set(this.workingPapers().map(w => w.division).filter(Boolean) as string[]);
      return [...names].sort((a, b) => a.localeCompare(b)).map(v => ({ label: v, value: v }));
    }

    const companies = this.selectedCompanies();
    if (this.isInternalAudit) {
      const orgCompanies = companies.length
        ? DIVISION_INDI_ORG_COMPANIES.filter(c => companies.includes(c.companyName))
        : DIVISION_INDI_ORG_COMPANIES;
      const names = new Set(orgCompanies.flatMap(c => c.divisions).map(d => d.divisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }
    const orgCompanies = companies.length
      ? ORG_STATIC_DATA.filter(c => companies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const names = new Set(orgCompanies.flatMap(c => c.divisions).map(d => d.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /** Sub-Division options narrow to the selected Company(ies) + Division(s). */
  readonly subDivisionFilterOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const divisions = this.selectedDivisions();
      const names = divisions.length
        ? divisions.flatMap(d => INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION.get(d) ?? [])
        : INTERNAL_AUDIT_SUB_DIVISION_NAMES;
      return [...new Set(names)].sort((a, b) => a.localeCompare(b)).map(v => ({ label: v, value: v }));
    }

    const companies = this.selectedCompanies();
    const divisions = this.selectedDivisions();
    if (this.isInternalAudit) {
      const orgCompanies = companies.length
        ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => companies.includes(c.companyName))
        : SUB_DIVISION_INDI_ORG_COMPANIES;
      const orgDivisions = orgCompanies.flatMap(c => c.divisions)
        .filter(d => d.hasSubDivision !== false)
        .filter(d => !divisions.length || divisions.includes(d.divisionName));
      const names = new Set(orgDivisions.flatMap(d => d.subDivisions).map(sd => sd.subDivisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }
    const orgCompanies = companies.length
      ? ORG_STATIC_DATA.filter(c => companies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const orgDivisions = orgCompanies.flatMap(c => c.divisions)
      .filter(d => d.hasSubDivision !== false)
      .filter(d => !divisions.length || divisions.includes(d.divisionName));
    const names = new Set(orgDivisions.flatMap(d => d.subDivisions).map(sd => sd.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /** Sub-Division filter is hidden only when every selected Division is
   *  flagged hasSubDivision:false. In 'internal-audit' mode the Division
   *  options come off the working papers themselves, so the flag is looked
   *  up in ORG_STATIC_DATA_INTERNAL_AUDIT (whose company names match the
   *  papers'); otherwise in ORG_STATIC_DATA. Unknown divisions count as
   *  having sub-divisions. */
  readonly subDivisionFilterVisible = computed(() => {
    const divisions = this.selectedDivisions();
    if (!divisions.length) return true;
    const companies = this.selectedCompanies();
    const source = CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;
    const orgCompanies = companies.length
      ? source.filter(c => companies.includes(c.companyName))
      : source;
    const orgDivisions = orgCompanies.flatMap(c => c.divisions);
    return divisions.some(name => {
      const matches = orgDivisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  readonly preparerFilterOptions = computed(() => {
    const set = new Set(this.workingPapers().map(w => w.preparedBy).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /* ── Active filter count & chips ── */
  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedTypes().length) count++;
    if (this.selectedStatuses().length) count++;
    if (this.selectedRisks().length) count++;
    if (this.selectedScopes().length) count++;
    if (this.selectedTasks().length) count++;
    if (this.selectedCompanies().length) count++;
    if (this.selectedDivisions().length) count++;
    if (this.selectedSubDivisions().length) count++;
    if (this.selectedPreparers().length) count++;
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) count++;
    return count;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: WorkingPaperFilterKey; label: string }[] = [];

    if (this.selectedTypes().length) {
      chips.push({ key: 'types', label: this.typeFilterLabel(this.selectedTypes().length) });
    }
    if (this.selectedStatuses().length) {
      chips.push({ key: 'statuses', label: this.statusFilterLabel(this.selectedStatuses().length) });
    }
    if (this.selectedRisks().length) {
      chips.push({ key: 'risks', label: this.riskFilterLabel(this.selectedRisks().length) });
    }
    if (this.selectedScopes().length) {
      chips.push({ key: 'scopes', label: this.areaFilterLabel(this.selectedScopes().length) });
    }
    if (this.selectedTasks().length) {
      chips.push({ key: 'tasks', label: this.taskFilterLabel(this.selectedTasks().length) });
    }
    if (this.selectedCompanies().length) {
      chips.push({ key: 'companies', label: this.companyFilterLabel(this.selectedCompanies().length) });
    }
    if (this.selectedDivisions().length) {
      chips.push({ key: 'divisions', label: this.divisionFilterLabel(this.selectedDivisions().length) });
    }
    if (this.selectedSubDivisions().length) {
      chips.push({ key: 'subDivisions', label: this.subDivisionFilterLabel(this.selectedSubDivisions().length) });
    }
    if (this.selectedPreparers().length) {
      chips.push({ key: 'preparers', label: this.preparerFilterLabel(this.selectedPreparers().length) });
    }
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) {
      chips.push({ key: 'date', label: this.dateRangeFilterLabel });
    }
    return chips;
  });

  removeFilter(key: WorkingPaperFilterKey): void {
    switch (key) {
      case WorkingPaperFilterKeys.Types: this.selectedTypes.set([]); break;
      case WorkingPaperFilterKeys.Statuses: this.selectedStatuses.set([]); break;
      case WorkingPaperFilterKeys.Risks: this.selectedRisks.set([]); break;
      case WorkingPaperFilterKeys.Scopes: this.selectedScopes.set([]); break;
      case WorkingPaperFilterKeys.Tasks: this.selectedTasks.set([]); break;
      case WorkingPaperFilterKeys.Companies: this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case WorkingPaperFilterKeys.Divisions: this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case WorkingPaperFilterKeys.SubDivisions: this.selectedSubDivisions.set([]); break;
      case WorkingPaperFilterKeys.Preparers: this.selectedPreparers.set([]); break;
      case WorkingPaperFilterKeys.Date: this.dateRange.set(null); break;
    }
    this.currentPage.set(1);
  }

  /* ── Derived: filtered + sorted list ── */
  readonly filtered = computed(() => {
    let list = this.workingPapers();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(w =>
      w.id.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.findingId.toLowerCase().includes(q),
    );

    const findings = this.selectedFindings();
    if (findings.length) list = list.filter(w => findings.includes(w.findingId));

    const types = this.selectedTypes();
    if (types.length) list = list.filter(w => types.includes(w.wpType));

    const statuses = this.selectedStatuses();
    if (statuses.length) list = list.filter(w => statuses.includes(w.status));

    const risks = this.selectedRisks();
    if (risks.length) list = list.filter(w => risks.includes(w.riskLevel));

    const scopes = this.selectedScopes();
    if (scopes.length) list = list.filter(w => scopes.includes(w.scope));

    const tasks = this.selectedTasks();
    if (tasks.length) list = list.filter(w => tasks.includes(w.taskId));

    const companies = this.selectedCompanies();
    if (companies.length) list = list.filter(w => w.company && companies.includes(w.company));

    const divisions = this.selectedDivisions();
    if (divisions.length) list = list.filter(w => w.division && divisions.includes(w.division));

    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    const subDivisions = this.subDivisionFilterVisible() ? this.selectedSubDivisions() : [];
    if (subDivisions.length) list = list.filter(w => w.subDivision && subDivisions.includes(w.subDivision));

    const preparers = this.selectedPreparers();
    if (preparers.length) list = list.filter(w => w.preparedBy && preparers.includes(w.preparedBy));

    const auditorId = this.auditorIdFilter();
    if (auditorId) list = list.filter(w => w.preparedBy === auditorId || w.reviewedBy === auditorId);
    else if (this.teamAuditorNames().length) list = list.filter(w => this.teamAuditorNames().includes(w.preparedBy) || this.teamAuditorNames().includes(w.reviewedBy ?? ''));

    const range = this.dateRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to = range[1]?.getTime();
      list = list.filter(w => {
        const t = w.createdDate.getTime();
        if (from !== undefined && t < from) return false;
        if (to !== undefined && t > to) return false;
        return true;
      });
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === WorkingPaperSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortValue(a, col);
        const bv = this.sortValue(b, col);
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all = this.filtered();
    const max = Math.max(1, Math.ceil(all.length / this.pageSize));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * this.pageSize, page * this.pageSize);
  });

  readonly pageRangeLabel = computed(() => {
    const total = this.filtered().length;
    if (!total) { return $localize`:@@common.noResults:No results`; }
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return $localize`:@@audit.workingPapers.pageRange:Showing ${start}:start:–${end}:end: of ${total}:total:`;
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedFindings().length ||
    !!this.selectedTypes().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedRisks().length ||
    !!this.selectedScopes().length ||
    !!this.selectedTasks().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedPreparers().length ||
    !!(this.dateRange()?.[0] || this.dateRange()?.[1]),
  );

  ngOnInit(): void {
    this.applyQueryParams();
  }

  /**
   * Pre-applies filters when navigated from a dashboard summary card,
   * e.g. /apps/working-papers?status=under_review&auditorId=Athul%20Manoj
   */
  private applyQueryParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const status = params.get(WORKING_PAPER_QUERY_PARAMS.Status);
      console.log("working paper status:", status);
      const auditorId = params.get(WORKING_PAPER_QUERY_PARAMS.AuditorId);
      // Known dashboard presets (WORKING_PAPER_STATUS_PRESETS) narrow the
      // Status filter; anything else selects every status.
      const preset = status ? WORKING_PAPER_STATUS_PRESETS[status] : undefined;
      this.selectedStatuses.set([...(preset ?? WORKING_PAPER_ALL_STATUSES)]);
      this.auditorIdFilter.set(auditorId);   // matches preparedBy OR reviewedBy
      this.teamAuditorNames.set((params.get('teamAuditorNames') ?? '').split('|').filter(Boolean));
      if (status || auditorId) this.currentPage.set(1);

      // Arriving from the "Upload Working Paper" quick action — open the Add
      // Working Paper drawer immediately so the auditor can create one right away.
      if (params.get(WORKING_PAPER_QUERY_PARAMS.OpenAdd) === WORKING_PAPER_OPEN_ADD_FLAG) this.openAdd();
    });
  }

  /* ── Filter handlers ── */
  onSearchChange(q: string) { this.searchQuery.set(q); this.currentPage.set(1); }
  onFindingsChange(v: string[]) { this.selectedFindings.set(v ?? []); this.currentPage.set(1); }
  onTypesChange(v: WorkingPaperType[]) { this.selectedTypes.set(v ?? []); this.currentPage.set(1); }
  onStatusesChange(v: WorkingPaperStatus[]) { this.selectedStatuses.set(v ?? []); this.currentPage.set(1); }
  onRisksChange(v: RiskLevel[]) { this.selectedRisks.set(v ?? []); this.currentPage.set(1); }
  onScopesChange(v: string[]) { this.selectedScopes.set(v ?? []); this.currentPage.set(1); }
  onTasksChange(v: string[]) { this.selectedTasks.set(v ?? []); this.currentPage.set(1); }
  onCompaniesChange(v: string[]) { this.selectedCompanies.set(v ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onDivisionsChange(v: string[]) { this.selectedDivisions.set(v ?? []); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  onSubDivisionsChange(v: string[]) { this.selectedSubDivisions.set(v ?? []); this.currentPage.set(1); }
  onPreparersChange(v: string[]) { this.selectedPreparers.set(v ?? []); this.currentPage.set(1); }
  onDateRangeChange(r: (Date | null)[] | null) { this.dateRange.set(r); this.currentPage.set(1); }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedFindings.set([]);
    this.selectedTypes.set([]);
    this.selectedStatuses.set([]);
    this.selectedRisks.set([]);
    this.selectedScopes.set([]);
    this.selectedTasks.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedPreparers.set([]);
    this.dateRange.set(null);
    this.currentPage.set(1);
  }

  /* ── Sort ── */
  onSort(col: SortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d =>
        d === WorkingPaperSortDirections.Asc ? WorkingPaperSortDirections.Desc : WorkingPaperSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set(WorkingPaperSortDirections.Asc);
    }
  }
  sortIconFor(col: SortColumn): string {
    if (this.sortColumn() !== col) return WORKING_PAPER_SORT_ICONS.Unsorted;
    return WORKING_PAPER_SORT_ICONS[this.sortDirection()];
  }
  private sortValue(w: WorkingPaper, col: SortColumn): string | number {
    switch (col) {
      case WorkingPaperSortColumns.Id: return w.id.toLowerCase();
      case WorkingPaperSortColumns.Title: return w.title.toLowerCase();
      case WorkingPaperSortColumns.WpType: return w.wpType;
      case WorkingPaperSortColumns.Scope: return w.scope.toLowerCase();
      case WorkingPaperSortColumns.RiskLevel: return RISK_LEVEL_RANK[w.riskLevel];
      case WorkingPaperSortColumns.Status: return w.status;
      case WorkingPaperSortColumns.PreparedBy: return w.preparedBy.toLowerCase();
      case WorkingPaperSortColumns.CreatedDate: return w.createdDate.getTime();
      case WorkingPaperSortColumns.Files: return w.files.length;
    }
  }

  typeLabel(t: WorkingPaperType): string {
    return WORKING_PAPER_TYPE_LABELS[t] ?? t;
  }
  statusLabel(s: WorkingPaperStatus): string {
    return WORKING_PAPER_STATUS_LABELS[s] ?? s;
  }
  riskLabel(r: RiskLevel): string {
    return RISK_LEVEL_LABELS[r] ?? r;
  }

  /* ── Pagination ── */
  onPageChange(ev: PaginatorState): void {
    if (ev.page !== undefined) this.currentPage.set(ev.page + 1);
  }

  setViewMode(m: WorkingPaperViewMode): void { this.viewMode.set(m); }

  /* ── Id / file helpers ── */
  private nextWorkingPaperId(): string {
    // Ids follow a letter+hundreds scheme (A-100, B-200, ... L-1200); the
    // letter is derived from the numeric suffix ÷ 100, so it keeps stepping
    // in lockstep with the number as new working papers are added.
    const max = this.workingPapers().reduce((m, w) => {
      const n = parseInt(w.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const next = max + WORKING_PAPER_ID_STEP;
    const letter = String.fromCharCode(WORKING_PAPER_ID_LETTER_BASE + Math.round(next / WORKING_PAPER_ID_STEP));
    return `${letter}-${next}`;
  }

  private toWorkingPaperFiles(kept: WorkingPaperFile[] = [], newFiles: File[] = []): WorkingPaperFile[] {
    return [...kept, ...newFiles.map(file => ({ name: file.name, size: file.size, file }))];
  }

  /* ── Actions ── */
  async openAdd(): Promise<void> {
    const ref = this.drawer.open<AddWorkingPaperResult, AddWorkingPaperDrawerData>(
      WorkingPapersComponent,
      { width: WORKING_PAPER_DRAWER_WIDTH, data: { mode: WorkingPaperDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (!result) return;
    const f = result.form;
    const newPaper: WorkingPaper = {
      id: this.nextWorkingPaperId(),
      title: f.title,
      wpType: f.wpType as WorkingPaperType,
      scope: f.scope,
      subscope: f.subscope,
      assertion: f.assertion,
      riskLevel: f.riskLevel as RiskLevel,
      // Falls back to 'draft' if the Add form's create mode doesn't actually
      // submit a status (this was the reason a freshly added paper wasn't
      // reaching the Working Paper Review queue below — status came back
      // undefined, so it never matched the gate that used to be here).
      status: (f.status as WorkingPaperStatus) ?? WORKING_PAPER_DEFAULT_STATUS,
      // No Task selector on the form yet, so a new working paper isn't linked to a task.
      taskId: '',
      taskTitle: '',
      findingId: f.findingId ?? '',
      findingTitle: FINDING_TITLES[f.findingId ?? ''] ?? '',
      preparedBy: WORKING_PAPER_CURRENT_USER_NAME,
      preparedDate: new Date(),
      reviewedBy: undefined,
      reviewedDate: undefined,
      createdDate: new Date(),
      files: this.toWorkingPaperFiles([], result.newFiles),
      objective: f.objective,
      conclusion: f.conclusion,
      description: f.notes,
      // WorkingPapersComponent now speaks in the same real company/
      // division/subDivision *names* as this list used to (both read from
      // company-org-data.ts) — previously the Add form's Company dropdown
      // actually submitted a CompanyDataService *id* here while everything
      // else on this page compared against company *names*, so a working
      // paper created via the form would silently fail to match any
      // Company filter. That's fixed as a side effect of this rewiring.
      company: f.company,
      division: f.division,
      subDivision: f.subDivision??undefined,
      isActive: true,
    };
    this.workingPapers.update(list => [newPaper, ...list]);
    this.currentPage.set(1);

    // Temporary bridge: also surface this working paper in the Working
    // Paper Review queue, same as the Evidence/Observation/Recommendation
    // bridges — always fires on add, regardless of status. (An earlier
    // version only bridged when status was 'prepared'/'under_review', but
    // the Add form's create mode doesn't reliably submit a status, so that
    // gate silently blocked every new paper from ever showing up here.)
    //
    const reviewItem: ReviewWorkingPaper = {
      id: newPaper.id,
      title: newPaper.title,
      wpType: newPaper.wpType,
      scope: newPaper.scope,
      subscope: newPaper.subscope,
      assertion: newPaper.assertion,
      riskLevel: newPaper.riskLevel,
      status: newPaper.status,
      findingId: newPaper.findingId,
      preparedBy: newPaper.preparedBy,
      preparedDate: newPaper.preparedDate,
      company: newPaper.company ?? '',
      division: newPaper.division ?? '',
      subDivision: newPaper.subDivision ?? '',
      objective: newPaper.objective,
      conclusion: newPaper.conclusion,
    };
    addReviewWorkingPaper(reviewItem);
  }

  async openEdit(w: WorkingPaper): Promise<void> {
    const ref = this.drawer.open<AddWorkingPaperResult, AddWorkingPaperDrawerData>(
      WorkingPapersComponent,
      {
        width: WORKING_PAPER_DRAWER_WIDTH,
        data: {
          mode: WorkingPaperDrawerModes.Edit,
          existing: {
            // Company/Division/Sub-Division/Scope/Subscope are listed first, in
            // dependency order, because WorkingPapersComponent's
            // ngOnInit() resets each downstream field (Division/Sub-Division/
            // Scope/Subscope) whenever an upstream one changes.
            // FormGroup.patchValue() applies keys in *this object's* own
            // property order — the underlying WorkingPaper record declares
            // scope/subscope BEFORE company/division/subDivision, so passing
            // `existing: w` directly (as this used to) would let the later
            // company/division/subDivision keys fire their resets AFTER
            // scope/subscope had already been set, silently blanking them
            // on every edit.
            id: w.id,
            company: w.company,
            division: w.division,
            subDivision: w.subDivision,
            scope: w.scope,
            subscope: w.subscope,
            title: w.title,
            wpType: w.wpType,
            findingId: w.findingId,
            assertion: w.assertion,
            riskLevel: w.riskLevel,
            status: w.status,
            objective: w.objective,
            conclusion: w.conclusion,
            notes: w.description,
            description: w.description,
            files: w.files,
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (!result) return;
    const f = result.form;
    this.workingPapers.update(list => list.map(item => {
      if (item.id !== w.id) return item;
      return {
        ...item,
        title: f.title,
        wpType: f.wpType as WorkingPaperType,
        scope: f.scope,
        subscope: f.subscope,
        assertion: f.assertion,
        riskLevel: f.riskLevel as RiskLevel,
        status: f.status as WorkingPaperStatus,
        findingId: f.findingId ?? item.findingId,
        findingTitle: f.findingId ? (FINDING_TITLES[f.findingId] ?? item.findingTitle) : item.findingTitle,
        objective: f.objective,
        conclusion: f.conclusion,
        description: f.notes,
        company: f.company,
        division: f.division,
        subDivision: f.subDivision??undefined,
        files: this.toWorkingPaperFiles(result.keptFiles ?? [], result.newFiles),
      };
    }));
  }

  openView(w: WorkingPaper): void {
    this.drawer.open<WorkingPapersProfileComponent, WorkingPaperDetailDrawerData>(
      WorkingPapersProfileComponent,
      { width: WORKING_PAPER_DRAWER_WIDTH, data: { workingPaper: w } },
    );
  }

  /* ── Activate / Deactivate ── */
  openConfirmation(paper: WorkingPaper): void {
    this.pendingPaper.set(paper);
    this.confirmationAction.set(paper.isActive ? WorkingPaperBlockActions.Deactivate : WorkingPaperBlockActions.Activate);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.pendingPaper.set(null);
  }

  confirmToggleBlocked(): void {
    const w = this.pendingPaper();
    if (w) {
      this.workingPapers.update(list =>
        list.map(c => c.id === w.id ? { ...c, isActive: !c.isActive } : c)
      );
    }
    this.closeConfirmation();
  }

  /* ── Files popover ── */
  showMoreFiles(w: WorkingPaper, event: MouseEvent): void {
    this.moreFilesPaper.set(w);
    this.filesPopover.toggle(event);
  }

  /* ── Helpers ── */
  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${WORKING_PAPER_FILE_SIZE_UNITS[0]}`;
    const k = WORKING_PAPER_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${WORKING_PAPER_FILE_SIZE_UNITS[i]}`;
  }

  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return WORKING_PAPER_FILE_ICONS[ext] ?? WORKING_PAPER_FILE_ICON_DEFAULT;
  }

  downloadFile(f: WorkingPaperFile): void {
    const source = f.file ?? f.url;
    if (source) this.downloader.download(source, f.name);
  }

  trackById = (_: number, w: WorkingPaper) => w.id;
}
