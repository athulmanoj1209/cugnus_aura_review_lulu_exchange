/**
 * Shared audit-plan model, mock data, and derived-metric helpers.
 *
 * This used to live only inside `audit-plan-list.component.ts`. It is now
 * extracted so `audit-overview-tab.component.ts` (the dashboard) can compute its
 * KPIs and charts from the SAME plans the list page shows, instead of a
 * second, unrelated set of hardcoded numbers (fake orgs like "Acme
 * Holdings", a fixed sub-division list, made-up chart values). One source of
 * truth → the dashboard and the list can never silently disagree.
 *
 * Placement: this file assumes it sits next to `company-org-data.ts` (i.e.
 * both `audit-plan-list.component.ts` and `audit-overview-tab.component.ts`
 * import it the same way the list component already imports
 * `ORG_STATIC_DATA`: `'../../audit-plan-data'`). Adjust the relative path in
 * both components if your real folder layout differs.
 *
 * CLIENT_MODE: `MOCK_PLANS` (below, after the audit-firm array) picks its
 * source once at module load based on CLIENT_MODE_VALUE — audit-firm builds
 * keep the hardcoded roster in this file; internal-audit builds get plans
 * generated from the DAR Exchange company/division/sub-division static seed
 * files instead, via `buildInternalAuditPlans()`. Every existing importer of
 * `MOCK_PLANS` (this component, the dashboard, the auditor pages) picks up
 * the right data automatically — see that function's own comment below.
 */

// NOTE: adjust these four import paths if this file doesn't sit next to
// config/Admin/apps the same way audit-plan-list.component.ts's own copies
// of these imports do (that file is one directory below this one, so each
// path here has one fewer `../` than its counterpart there).
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { ORG_STATIC_DATA } from '../../../organization/company/company-org-data';
import { COMPANIES_SEED } from '../../../organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import { SCOPE_JOB_SEED } from '@/app/features/audits/audit-plan/scope-job/data/scope-job-static.data';
import { ScopeJobStatuses } from '@/app/features/audits/audit-plan/scope-job/constants/scope-job.constants';
import type { ScopeJob as SeedScopeJob } from '@/app/features/audits/audit-plan/scope-job/models/scope-job.model';
import {
  AUDIT_PLAN_DATE_FORMAT_OPTIONS,
  AUDIT_PLAN_DATE_LOCALE,
  AUDIT_PLAN_MONTH_YEAR_FORMAT_OPTIONS,
  AuditPlanStatuses,
  InstanceStatuses,
  RISK_LEVEL_ORDER,
  RiskRatings,
  type AuditPlanStatus,
  type Frequency,
  type InstanceStatus,
  type RiskRating,
} from '../constants/audit-plan.constants';
import {
  AUDIT_PLAN_STATUS_PIE_CONFIG,
  UPCOMING_AUDIT_STATUS,
} from '../constants/audit-plan-labels.constants';
import { AUDIT_PLAN_EMPTY_VALUE } from '../constants/audit-plan-messages.constants';

/* ── Model ─────────────────────────────────────────────────────────────────
   A "plan" (one row in the list) is a company + division's whole audit plan
   for a year — it contains many sub-divisions, each with many audit scopes.
   This mirrors the real calendar system (models/audit-plan.ts /
   audit-plan.store.ts): Sub-Division -> AuditScope[] -> ScopeJob[] / months.
   Value sets live in ../constants; re-exported so existing importers keep working.
   ────────────────────────────────────────────────────────────────────────── */

export type { AuditPlanStatus, Frequency, InstanceStatus, RiskRating } from '../constants/audit-plan.constants';
export { PLAN_FREQ_LABELS as FREQ_LABELS, MONTHS as MONTH_LABELS } from '../constants/audit-plan-labels.constants';

export interface ScopeJob {
  /** short id, e.g. 'j1' — the displayed ref is `${scope.code}-${id.toUpperCase()}` */
  id: string;
  name: string;
  auditor?: string;
  hrs: number;
  status: InstanceStatus;
}

export interface AuditScope {
  id: string;
  code: string;
  name: string;
  freq: Frequency;
  auditor: string;
  risk: RiskRating;
  rfi: number;
  findings: number;
  /** one entry per calendar month (index 0 = Jan), null = not scheduled that month */
  months: (InstanceStatus | null)[];
  jobs: ScopeJob[];
}

export interface SubDivision {
  id: string;
  name: string;
  /** True when this entry is a whole division (its division is flagged `hasSubDivision: false`), not a sub-division. */
  isDivisionLevel?: boolean;
  scopes: AuditScope[];
}

export interface AuditPlan {
  id: string;
  /** Plan name — set in the sample data below, or user-entered via the create/edit drawer. */
  planName: string;
  organizationName: string;
  divisionName: string;
  status: AuditPlanStatus;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  subDivisions: SubDivision[];
  /** Drives the Activate/Deactivate action — omitted means active. */
  isActive?: boolean;
}

/* ── Mock data helpers ─────────────────────────────────────────────────── */

/** Recurrence step in months for a given frequency (weekly/bi-weekly still land once per scheduled month here). */
function stepFor(freq: Frequency): number {
  switch (freq) {
    case 'M': return 1;
    case 'Q': return 3;
    case 'HY': return 6;
    case 'Y': return 12;
    default:  return 1; // W / BW recur every month too, just with multiple runs inside it
  }
}

function genMonths(freq: Frequency, anchor: number, pattern: (InstanceStatus | null)[]): (InstanceStatus | null)[] {
  const step = stepFor(freq);
  const arr: (InstanceStatus | null)[] = Array(12).fill(null);
  let i = 0;
  for (let m = anchor % 12; m < 12; m += step) {
    arr[m] = pattern[i % pattern.length] ?? null;
    i++;
  }
  return arr;
}

/* ── Mock data (audit-firm client mode) ──────────────────────────────────── */
/* organizationName / divisionName below are real Company → Division pairs from
 * division-static-data.ts; sub-division names are that division's entries in
 * sub-division-static-data.ts (the source the scope form's Sub-Division
 * dropdown reads, so its Audit Plan dropdown can match on them). Used as
 * MOCK_PLANS' source only when CLIENT_MODE_VALUE is 'audit-firm' — see
 * buildInternalAuditPlans() below for the 'internal-audit' source, and the
 * exported `MOCK_PLANS` switch at the end of this section. */

const AUDIT_FIRM_MOCK_PLANS: AuditPlan[] = [
  {
    id: 'AP-001',
    planName: 'FY2026–2027 Audit Plan – Dubai Head Office',
    organizationName: 'Al Waha Construction & Contracting',
    divisionName: 'Dubai Head Office',
    status: 'overdue',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2027-12-31'),
    description: 'FY2026–2027 audit plan for the Dubai Head Office division, covering Finance & Accounting and Legal & Governance.',
    subDivisions: [
      {
        id: 'd-fin', name: 'Finance & Accounting',
        scopes: [
          {
            id: 's-fin-01', code: 'FIN-01', name: 'Governance', freq: 'Q', auditor: 'A. Rahman',
            risk: 'High', rfi: 3, findings: 2,
            months: [null, 'completed', null, 'completed', null, null, 'inprog', null, null, 'planned', null, null],
            jobs: [
              { id: 'j1', name: 'Board & committee minutes review', auditor: 'A. Rahman', hrs: 8, status: 'completed' },
              { id: 'j2', name: 'Delegation of authority check',    auditor: 'S. Lee',     hrs: 6, status: 'inprog'    },
              { id: 'j3', name: 'Policy approval matrix testing',   auditor: 'A. Rahman',  hrs: 4, status: 'planned'   },
            ],
          },
          {
            id: 's-fin-02', code: 'FIN-02', name: 'Internal controls', freq: 'M', auditor: 'S. Lee',
            risk: 'Medium', rfi: 1, findings: 0,
            months: ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'inprog', 'planned', 'planned', 'planned', 'planned', 'planned'],
            jobs: [
              { id: 'j1', name: 'Control self-assessment walkthrough', auditor: 'S. Lee', hrs: 5, status: 'inprog' },
            ],
          },
          {
            id: 's-fin-03', code: 'FIN-03', name: 'Income & expenditure', freq: 'Q', auditor: 'A. Rahman',
            risk: 'Low', rfi: 0, findings: 0,
            months: [null, 'completed', null, null, null, 'completed', null, null, 'planned', null, null, null],
            jobs: [
              { id: 'j1', name: 'Revenue cut-off testing', auditor: 'A. Rahman', hrs: 6, status: 'planned' },
            ],
          },
          {
            id: 's-fin-04', code: 'FIN-04', name: 'Budget evaluation', freq: 'HY', auditor: 'S. Lee',
            risk: 'Medium', rfi: 0, findings: 1,
            months: [null, null, 'completed', null, null, null, null, null, 'planned', null, null, null],
            jobs: [
              { id: 'j1', name: 'Budget vs actual variance review', auditor: 'S. Lee', hrs: 7, status: 'planned' },
            ],
          },
          {
            id: 's-fin-05', code: 'FIN-05', name: 'Cash count verification', freq: 'W', auditor: 'S. Lee',
            risk: 'High', rfi: 2, findings: 1,
            months: ['completed', 'completed', 'completed', 'completed', 'overdue', 'completed', 'inprog', 'planned', 'planned', 'planned', 'planned', 'planned'],
            jobs: [
              { id: 'j1', name: 'Surprise cash count', auditor: 'S. Lee', hrs: 3, status: 'inprog' },
            ],
          },
        ],
      },
      {
        id: 'd-legal', name: 'Legal & Governance',
        scopes: [
          {
            id: 's-aml-01', code: 'AML-01', name: 'Regulatory compliance', freq: 'M', auditor: 'M. Khan',
            risk: 'High', rfi: 2, findings: 1,
            months: ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'inprog', 'planned', 'planned', 'planned', 'planned', 'planned'],
            jobs: [
              { id: 'j1', name: 'Sanctions list screening check', auditor: 'M. Khan', hrs: 4, status: 'inprog' },
            ],
          },
          {
            id: 's-aml-02', code: 'AML-02', name: 'Transaction monitoring', freq: 'W', auditor: 'M. Khan',
            risk: 'High', rfi: 1, findings: 0,
            months: ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'inprog', 'planned', 'planned', 'planned', 'planned', 'planned'],
            jobs: [
              { id: 'j1', name: 'High-risk transaction sampling', auditor: 'M. Khan', hrs: 5, status: 'inprog' },
            ],
          },
          {
            id: 's-aml-03', code: 'AML-03', name: 'Sanctions screening', freq: 'Q', auditor: 'M. Khan',
            risk: 'Medium', rfi: 0, findings: 0,
            months: [null, 'completed', null, 'planned', null, null, 'planned', null, null, 'planned', null, null],
            jobs: [
              { id: 'j1', name: 'Watchlist update reconciliation', auditor: 'M. Khan', hrs: 3, status: 'planned' },
            ],
          },
        ],
      },
    ],
  },
  singleScopePlan('AP-002', 'ITGC Review 2026–2027 – Dubai Head Office', 'Gulf Horizon Logistics', 'Dubai Head Office', 'planned', '2026-04-01', '2027-05-15',
    'Information Technology', 'IT General Controls', 'Y', 'Ivan Magalhaes', 'Medium', 2, 0),
  singleScopePlan('AP-003', 'Corporate Tax Compliance Audit 2026–2027 – Sharjah Subsidiary', 'Falcon Gulf Jewellery Trading', 'Sharjah Subsidiary', 'completed', '2026-02-01', '2027-01-20',
    'Finance & Accounting', 'Corporate Tax Compliance', 'Y', 'Stephen Shaw', 'Low', 0, 0),
  singleScopePlan('AP-004', 'AML / CFT Review 2026–2027 – Dubai Head Office', 'Al Waha Construction & Contracting', 'Dubai Head Office', 'in_progress', '2026-02-01', '2027-06-30',
    'Legal & Governance', 'AML / CFT Sanctions Screening Review', 'HY', 'Bob Smith', 'High', 4, 1),
  singleScopePlan('AP-005', 'HR & Payroll Audit 2026–2027 – Dubai Head Office', 'Gulf Horizon Logistics', 'Dubai Head Office', 'on_hold', '2026-03-10', '2027-04-30',
    'Human Resources', 'HR & Payroll', 'Y', 'Amy Elsner', 'Medium', 1, 0),
  singleScopePlan('AP-006', 'Data Privacy Assessment 2026–2027 – Dubai Head Office', 'Marwa Gold & Gems', 'Dubai Head Office', 'draft', '2026-04-01', '2027-07-15',
    'Retail Operations', 'Data Privacy', 'Y', 'Reem Al Dosari', 'Medium', 0, 0),
  singleScopePlan('AP-007', 'E-Commerce ITGC Monitoring 2026–2027', 'Zumurrud Diamonds LLC', 'Dubai Head Office', 'in_progress', '2026-01-01', '2027-12-31',
    'E-Commerce', 'IT General Controls', 'M', 'Bob Smith', 'Low', 1, 0),
  singleScopePlan('AP-008', 'Inventory Operational Risk Review 2026–2027', 'Desert Rose Retail Group', 'Dubai Head Office', 'overdue', '2026-04-01', '2027-06-30',
    'Inventory & Warehousing', 'Operational Risk', 'Q', 'Michael Chen', 'High', 3, 2),
  // One scope per frequency, so Al Noor's Annual Overview exercises W/BW/M/Q/HY/Y.
  // Credit Risk stays first — it's the plan's display name in auditor rows.
  {
    id: 'AP-009',
    planName: 'FY2026–2027 Audit Plan – Dubai Head Office',
    organizationName: 'Al Noor Jewellery Group',
    divisionName: 'Dubai Head Office',
    status: 'completed',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2027-12-31'),
    description: 'FY2026–2027 audit plan for the Dubai Head Office Retail Operations sub-division covering every audit frequency.',
    subDivisions: [
      {
        id: 'd-AP-009', name: 'Retail Operations',
        scopes: [
          {
            id: 's-anj-hy', code: 'ANJ-HY', name: 'Credit Risk', freq: 'HY', auditor: 'Anna Fali',
            risk: 'Medium', rfi: 0, findings: 0,
            months: genMonths('HY', 0, ['completed']),
            jobs: [{ id: 'j1', name: 'Customer credit limit review', auditor: 'Anna Fali', hrs: 6, status: 'completed' }],
          },
          {
            id: 's-anj-w', code: 'ANJ-W', name: 'Cash Count Verification', freq: 'W', auditor: 'Anna Fali',
            risk: 'High', rfi: 1, findings: 1,
            months: genMonths('W', 0, ['completed']),
            jobs: [
              { id: 'j1', name: 'Surprise till cash count', auditor: 'Anna Fali', hrs: 2, status: 'completed' },
              { id: 'j2', name: 'Safe & vault balance check', auditor: 'John Smith', hrs: 2, status: 'completed' },
            ],
          },
          {
            id: 's-anj-bw', code: 'ANJ-BW', name: 'Gold Stock Reconciliation', freq: 'BW', auditor: 'John Smith',
            risk: 'High', rfi: 1, findings: 0,
            months: genMonths('BW', 0, ['completed']),
            jobs: [{ id: 'j1', name: 'Physical vs book gold weight reconciliation', auditor: 'John Smith', hrs: 4, status: 'completed' }],
          },
          {
            id: 's-anj-m', code: 'ANJ-M', name: 'AML / KYC Compliance Review', freq: 'M', auditor: 'Amy Elsner',
            risk: 'High', rfi: 2, findings: 1,
            months: genMonths('M', 0, ['completed']),
            jobs: [{ id: 'j1', name: 'High-value cash sale KYC sampling', auditor: 'Amy Elsner', hrs: 5, status: 'completed' }],
          },
          {
            id: 's-anj-q', code: 'ANJ-Q', name: 'Financial Statement Audit', freq: 'Q', auditor: 'Anna Fali',
            risk: 'Low', rfi: 0, findings: 0,
            months: genMonths('Q', 0, ['completed']),
            jobs: [{ id: 'j1', name: 'Quarterly ledger & cut-off review', auditor: 'Anna Fali', hrs: 8, status: 'completed' }],
          },
          {
            id: 's-anj-y', code: 'ANJ-Y', name: 'Statutory Audit', freq: 'Y', auditor: 'John Smith',
            risk: 'Medium', rfi: 0, findings: 0,
            months: genMonths('Y', 11, ['completed']),
            jobs: [{ id: 'j1', name: 'Year-end statutory audit support', auditor: 'John Smith', hrs: 16, status: 'completed' }],
          },
        ],
      },
    ],
  },
  singleScopePlan('AP-010', 'Statutory Audit 2026–2027 – Dubai Head Office', 'Kanz Al Emarat Jewellery', 'Dubai Head Office', 'cancelled', '2026-02-01', '2027-05-31',
    'Finance & Accounting', 'Statutory Audit', 'Y', 'John Smith', 'Low', 0, 0),
  singleScopePlan('AP-011', 'Procurement Audit 2026–2027 – Dubai Head Office', 'Gulf Horizon Logistics', 'Dubai Head Office', 'planned', '2026-05-01', '2027-05-30',
    'Procurement & Supply Chain', 'Procurement', 'Y', 'Amy Elsner', 'Medium', 1, 0),
  singleScopePlan('AP-012', 'Financial Controls Review 2026–2027 – Dubai Head Office', 'Desert Rose Retail Group', 'Dubai Head Office', 'in_progress', '2026-04-01', '2027-06-30',
    'Finance & Accounting', 'Financial Controls', 'Q', 'Bob Smith', 'Medium', 1, 0),

  // One plan per division for every seed scope (audit-scope-static-data.ts) not
  // already under a plan above — lanes are those scopes' real sub-divisions, and
  // each scope carries the plan's id as its `auditPlanId`.
  divisionPlan('AP-013', 'Al Noor Jewellery Group', 'Dubai Head Office', 'in_progress', [
    ['Finance & Accounting', [['SC-0003', 'Financial Statement Audit', 'Q', 'David Lee', 'Low'], ['SC-0004', 'Accounts Payable & Receivable Review', 'Y', 'Emma Clarke', 'Medium']]],
  ]),
  divisionPlan('AP-014', 'Al Noor Jewellery Group', 'Abu Dhabi Representative Office', 'planned', [
    ['Inventory & Warehouse', [['SC-0005', 'Inventory Valuation & Stock Audit', 'M', 'Felix Rahman', 'High'], ['SC-0007', 'Warehouse Controls Review', 'Y', 'Henry Patel', 'Medium']]],
    ['Compliance & AML', [['SC-0008', 'AML / CFT Compliance Review', 'M', 'Irene Torres', 'High']]],
    ['Human Resources', [['SC-0009', 'Payroll & HR Compliance Audit', 'Q', 'James Malik', 'Low'], ['SC-0010', 'Employee Benefits Review', 'Y', 'Karen Osei', 'Medium']]],
  ]),
  divisionPlan('AP-015', 'Al Noor Jewellery Group', 'Sharjah Warehouse', 'in_progress', [
    ['Human Resources', [['SC-0012', 'Payroll & HR Compliance Audit', 'Q', 'Mia Santos', 'Low']]],
    ['IT & Systems', [['SC-0013', 'IT General Controls Audit', 'Y', 'Alice Johnson', 'Medium'], ['SC-0014', 'Cybersecurity Risk Assessment', 'M', 'Bob Smith', 'High']]],
  ]),
  divisionPlan('AP-016', 'Zumurrud Diamonds LLC', 'Dubai Head Office', 'planned', [
    ['Compliance & AML', [['SC-0015', 'AML / CFT Compliance Review', 'Q', 'Carol White', 'Low'], ['SC-0017', 'Regulatory Reporting Audit', 'M', 'Emma Clarke', 'High']]],
    ['Human Resources', [['SC-0018', 'Payroll & HR Compliance Audit', 'Q', 'Felix Rahman', 'Low']]],
  ]),
  divisionPlan('AP-017', 'Zumurrud Diamonds LLC', 'Abu Dhabi Division', 'in_progress', [
    ['IT & Systems', [['SC-0019', 'IT General Controls Audit', 'Y', 'Grace Kim', 'Medium']]],
    ['Procurement', [['SC-0020', 'Vendor Management & Procurement Audit', 'M', 'Henry Patel', 'High'], ['SC-0022', 'Purchase Order Controls Review', 'Y', 'James Malik', 'Medium']]],
    ['Quality Assurance', [['SC-0023', 'Quality Management System Audit', 'M', 'Karen Osei', 'High']]],
  ]),
  divisionPlan('AP-018', 'Zumurrud Diamonds LLC', 'Sharjah Representative Office', 'planned', [
    ['Quality Assurance', [['SC-0024', 'Quality Management System Audit', 'Q', 'Liam Chen', 'Low'], ['SC-0025', 'Product Compliance Review', 'Y', 'Mia Santos', 'Medium']]],
    ['Logistics', [['SC-0027', 'Supply Chain & Logistics Audit', 'Q', 'Bob Smith', 'Low']]],
  ]),
  divisionPlan('AP-019', 'Falcon Gulf Jewellery Trading', 'Dubai Head Office', 'in_progress', [
    ['Procurement', [['SC-0028', 'Vendor Management & Procurement Audit', 'Y', 'Carol White', 'Medium']]],
    ['Quality Assurance', [['SC-0029', 'Quality Management System Audit', 'M', 'David Lee', 'High'], ['SC-0030', 'Product Compliance Review', 'Q', 'Emma Clarke', 'Low']]],
  ]),
  divisionPlan('AP-020', 'Falcon Gulf Jewellery Trading', 'Abu Dhabi Project Office', 'planned', [
    ['Logistics', [['SC-0032', 'Supply Chain & Logistics Audit', 'M', 'Grace Kim', 'High'], ['SC-0033', 'Fleet & Distribution Controls Review', 'Q', 'Henry Patel', 'Low']]],
    ['Customer Service', [['SC-0034', 'Customer Complaints Handling Review', 'Y', 'Irene Torres', 'Medium']]],
    ['Retail Operations', [['SC-0035', 'Point-of-Sale Controls Audit', 'M', 'James Malik', 'High'], ['SC-0037', 'Cash Handling & Till Reconciliation Review', 'Y', 'Liam Chen', 'Medium']]],
  ]),
  divisionPlan('AP-021', 'Falcon Gulf Jewellery Trading', 'Sharjah Subsidiary', 'in_progress', [
    ['Retail Operations', [['SC-0038', 'Point-of-Sale Controls Audit', 'M', 'Mia Santos', 'High']]],
  ]),
  divisionPlan('AP-022', 'Marwa Gold & Gems', 'Dubai Head Office', 'planned', [
    ['Customer Service', [['SC-0042', 'Customer Complaints Handling Review', 'Q', 'David Lee', 'Low'], ['SC-0043', 'Service Level Agreement Audit', 'Y', 'Emma Clarke', 'Medium']]],
  ]),
  divisionPlan('AP-023', 'Marwa Gold & Gems', 'Abu Dhabi Project Office', 'in_progress', [
    ['Finance & Accounts', [['SC-0045', 'Financial Statement Audit', 'Q', 'Grace Kim', 'Low']]],
    ['Inventory & Warehouse', [['SC-0047', 'Inventory Valuation & Stock Audit', 'M', 'Irene Torres', 'High'], ['SC-0048', 'Warehouse Controls Review', 'Q', 'James Malik', 'Low']]],
    ['Compliance & AML', [['SC-0049', 'AML / CFT Compliance Review', 'Y', 'Karen Osei', 'Medium']]],
  ]),
  divisionPlan('AP-024', 'Marwa Gold & Gems', 'Sharjah Subsidiary', 'planned', [
    ['Compliance & AML', [['SC-0050', 'AML / CFT Compliance Review', 'M', 'Liam Chen', 'High'], ['SC-0052', 'Regulatory Reporting Audit', 'Y', 'Alice Johnson', 'Medium']]],
    ['Human Resources', [['SC-0053', 'Payroll & HR Compliance Audit', 'M', 'Bob Smith', 'High']]],
  ]),
  divisionPlan('AP-025', 'Kanz Al Emarat Jewellery', 'Dubai Head Office', 'in_progress', [
    ['Inventory & Warehousing', [['SC-0054', 'Inventory Valuation & Stock Audit', 'Q', 'Carol White', 'Low']]],
    ['Compliance & AML', [['SC-0055', 'AML / CFT Compliance Review', 'Y', 'David Lee', 'Medium'], ['SC-0057', 'Regulatory Reporting Audit', 'Q', 'Felix Rahman', 'Low']]],
  ]),
  divisionPlan('AP-026', 'Kanz Al Emarat Jewellery', 'Abu Dhabi Warehouse', 'planned', [
    ['Human Resources', [['SC-0058', 'Payroll & HR Compliance Audit', 'Y', 'Grace Kim', 'Medium'], ['SC-0059', 'Employee Benefits Review', 'M', 'Henry Patel', 'High']]],
    ['IT & Systems', [['SC-0060', 'IT General Controls Audit', 'Q', 'Irene Torres', 'Low']]],
    ['Procurement', [['SC-0062', 'Vendor Management & Procurement Audit', 'M', 'Karen Osei', 'High'], ['SC-0063', 'Purchase Order Controls Review', 'Q', 'Liam Chen', 'Low']]],
  ]),
  divisionPlan('AP-027', 'Kanz Al Emarat Jewellery', 'Sharjah Factory', 'in_progress', [
    ['Procurement', [['SC-0064', 'Vendor Management & Procurement Audit', 'Y', 'Mia Santos', 'Medium']]],
    ['Quality Assurance', [['SC-0065', 'Quality Management System Audit', 'M', 'Alice Johnson', 'High'], ['SC-0067', 'Product Compliance Review', 'Y', 'Carol White', 'Medium']]],
  ]),
  divisionPlan('AP-028', 'Desert Rose Retail Group', 'Dubai Head Office', 'planned', [
    ['IT & Systems', [['SC-0068', 'IT General Controls Audit', 'M', 'David Lee', 'High'], ['SC-0069', 'Cybersecurity Risk Assessment', 'Q', 'Emma Clarke', 'Low']]],
    ['Procurement', [['SC-0070', 'Vendor Management & Procurement Audit', 'Y', 'Felix Rahman', 'Medium']]],
  ]),
  divisionPlan('AP-029', 'Desert Rose Retail Group', 'Abu Dhabi Representative Office', 'in_progress', [
    ['Quality Assurance', [['SC-0072', 'Quality Management System Audit', 'Q', 'Henry Patel', 'Low']]],
    ['Logistics', [['SC-0073', 'Supply Chain & Logistics Audit', 'Y', 'Irene Torres', 'Medium'], ['SC-0074', 'Fleet & Distribution Controls Review', 'M', 'James Malik', 'High']]],
    ['Customer Service', [['SC-0075', 'Customer Complaints Handling Review', 'Q', 'Karen Osei', 'Low']]],
  ]),
  divisionPlan('AP-030', 'Desert Rose Retail Group', 'Sharjah Warehouse', 'planned', [
    ['Customer Service', [['SC-0077', 'Customer Complaints Handling Review', 'M', 'Mia Santos', 'High'], ['SC-0078', 'Service Level Agreement Audit', 'Q', 'Alice Johnson', 'Low']]],
    ['Retail Operations', [['SC-0079', 'Point-of-Sale Controls Audit', 'Y', 'Bob Smith', 'Medium']]],
  ]),
  divisionPlan('AP-031', 'Gulf Horizon Logistics', 'Dubai Head Office', 'in_progress', [
    ['Logistics', [['SC-0080', 'Supply Chain & Logistics Audit', 'M', 'Carol White', 'High']]],
    ['Customer Service', [['SC-0082', 'Customer Complaints Handling Review', 'Y', 'Emma Clarke', 'Medium'], ['SC-0083', 'Service Level Agreement Audit', 'M', 'Felix Rahman', 'High']]],
  ]),
  divisionPlan('AP-032', 'Gulf Horizon Logistics', 'Abu Dhabi Representative Office', 'planned', [
    ['Retail Operations', [['SC-0084', 'Point-of-Sale Controls Audit', 'Q', 'Grace Kim', 'Low'], ['SC-0085', 'Cash Handling & Till Reconciliation Review', 'Y', 'Henry Patel', 'Medium']]],
    ['Finance & Accounts', [['SC-0087', 'Financial Statement Audit', 'Q', 'James Malik', 'Low']]],
    ['Inventory & Warehouse', [['SC-0088', 'Inventory Valuation & Stock Audit', 'Y', 'Karen Osei', 'Medium'], ['SC-0089', 'Warehouse Controls Review', 'M', 'Liam Chen', 'High']]],
  ]),
  divisionPlan('AP-033', 'Gulf Horizon Logistics', 'Sharjah Warehouse', 'in_progress', [
    ['Inventory & Warehouse', [['SC-0090', 'Inventory Valuation & Stock Audit', 'Q', 'Mia Santos', 'Low']]],
    ['Compliance & AML', [['SC-0092', 'AML / CFT Compliance Review', 'M', 'Bob Smith', 'High'], ['SC-0093', 'Regulatory Reporting Audit', 'Q', 'Carol White', 'Low']]],
  ]),
  divisionPlan('AP-034', 'Al Waha Construction & Contracting', 'Dubai Head Office', 'planned', [
    ['Inventory & Warehouse', [['SC-0097', 'Inventory Valuation & Stock Audit', 'Y', 'Grace Kim', 'Medium']]],
  ]),
  divisionPlan('AP-035', 'Al Waha Construction & Contracting', 'Abu Dhabi Subsidiary', 'in_progress', [
    ['Compliance & AML', [['SC-0098', 'AML / CFT Compliance Review', 'M', 'Henry Patel', 'High']]],
    ['Human Resources', [['SC-0099', 'Payroll & HR Compliance Audit', 'Q', 'Irene Torres', 'Low'], ['SC-0100', 'Employee Benefits Review', 'Y', 'James Malik', 'Medium']]],
    ['IT & Systems', [['SC-0102', 'IT General Controls Audit', 'Q', 'Liam Chen', 'Low']]],
  ]),
  divisionPlan('AP-036', 'Al Waha Construction & Contracting', 'Sharjah Division', 'planned', [
    ['IT & Systems', [['SC-0103', 'IT General Controls Audit', 'Y', 'Mia Santos', 'Medium'], ['SC-0104', 'Cybersecurity Risk Assessment', 'M', 'Alice Johnson', 'High']]],
    ['Procurement', [['SC-0105', 'Vendor Management & Procurement Audit', 'Q', 'Bob Smith', 'Low']]],
  ]),
];

/** [scope id in audit-scope-static-data.ts, scope name, frequency, auditor, risk] — top-level scopes only; sub-scopes share their parent's plan. */
type PlanScopeSeed = [string, string, Frequency, string, RiskRating];

/** Builds an FY2026–2027 plan for a whole division whose sub-division lanes hold
 *  the real seed scopes filed under them (see the AP-013+ rows above). */
function divisionPlan(
  id: string, org: string, division: string, status: AuditPlanStatus,
  lanes: [subDivisionName: string, scopes: PlanScopeSeed[]][],
): AuditPlan {
  const baseStatus = instanceStatusForPlanStatus(status);
  return {
    id,
    planName: `FY2026–2027 Divisional Audit Plan – ${division}`,
    organizationName: org,
    divisionName: division,
    status,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2027-12-31'),
    description: `FY2026–2027 audit plan for ${division} (${org}), covering ${lanes.map(([name]) => name).join(', ')}.`,
    subDivisions: lanes.map(([name, scopes], i) => ({
      id: `d-${id}-${i + 1}`,
      name,
      scopes: scopes.map(([scopeId, scopeName, freq, auditor, risk]) => ({
        id: `s-${scopeId}`, code: scopeId, name: scopeName, freq, auditor, risk, rfi: 0, findings: 0,
        months: genMonths(freq, 0, [baseStatus]),
        jobs: [{ id: 'j1', name: `${scopeName} — primary procedure`, auditor, hrs: 6, status: baseStatus }],
      })),
    })),
  };
}

/** Builds a plan with a single sub-division/single scope — used for the mock rows
 *  that don't need a rich multi-sub-division example (AP-001 has the full one). */
function singleScopePlan(
  id: string, planName: string, org: string, division: string, status: AuditPlanStatus,
  start: string, end: string, subDivisionName: string, scopeName: string,
  freq: Frequency, auditor: string, risk: RiskRating, rfi: number, findings: number,
): AuditPlan {
  const anchor = new Date(start).getMonth();
  const baseStatus = instanceStatusForPlanStatus(status);
  const code = `${subDivisionName.slice(0, 3).toUpperCase()}-01`;
  return {
    id, planName, organizationName: org, divisionName: division, status,
    startDate: new Date(start), endDate: new Date(end),
    subDivisions: [{
      id: `d-${id}`, name: subDivisionName,
      scopes: [{
        id: `s-${id}`, code, name: scopeName, freq, auditor, risk, rfi, findings,
        months: genMonths(freq, anchor, [baseStatus]),
        jobs: [{ id: 'j1', name: `${scopeName} — primary procedure`, auditor, hrs: 6, status: baseStatus }],
      }],
    }],
  };
}

/* ── Mock data (internal-audit client mode) ──────────────────────────────
 * When CLIENT_MODE_VALUE is 'internal-audit' the app is a single
 * organisation auditing itself, so the plan list (and everything derived
 * from MOCK_PLANS — the dashboard KPIs/charts, the auditor pages) should
 * show DAR Exchange's own company/division/sub-division structure instead of
 * the audit-firm roster above. buildInternalAuditPlans() generates one
 * AuditPlan per division (matching the "a plan is a company + division's whole
 * audit plan" model at the top of this file) from the same
 * COMPANIES_SEED / DIVISION_INDI_ORG_COMPANIES / SUB_DIVISION_INDI_ORG_COMPANIES
 * static seeds that audit-plan-list.component.ts already reads for this
 * list's Organization/Division/Sub-Division filter options (see that
 * component's divisionSourceCompanies() / subDivisionSourceCompanies()) — so
 * the generated rows and the filter dropdowns always agree.
 *
 * Sub-Divisions/scopes are taken from the matching divisionCode entry in
 * SUB_DIVISION_INDI_ORG_COMPANIES (the canonical sub-division/scope source —
 * same one the Sub-Division filter cascades off), falling back to the
 * division's own nested `sub-divisions` if no matching entry exists there.
 * None of the seed files carry per-scope RFI/findings/job-calendar data, so
 * those are filled in with reasonable placeholders (0 for RFI/findings, one
 * synthetic job per scope) the same way singleScopePlan() above fills in a
 * single-scope plan.
 *
 * Plan-level `status` used to come from each division's own `auditStatus`
 * seed field (falling back to 'completed' on repeat cycles) — but every
 * division in DIVISION_INDI_ORG_COMPANIES happens to carry `auditStatus:
 * "planned"`, so that produced a list that was almost entirely
 * "Planned"/"Completed" and never showed the other statuses the
 * audit-firm list demonstrates (Draft, Overdue, On Hold, Cancelled, In
 * Progress). To keep both client modes exercising the same status
 * vocabulary with the same distribution, `buildInternalAuditPlans()` now
 * assigns plan i the exact same `status` as `AUDIT_FIRM_MOCK_PLANS[i]` —
 * same count (already guaranteed via `targetCount`), same statuses,
 * index-for-index, just attached to DAR Exchange's own org/division/
 * sub-division rows instead of the audit-firm roster's.
 *
 * `auditor` is mirrored the exact same way, for the exact same reason: it
 * used to come from the seed division's own `submittedBy`/`divisionManager`
 * field, which meant an audit-firm-mode auditor name (e.g. "Bob Smith" —
 * AUDIT_FIRM_MOCK_PLANS assigns him exactly 3 scopes, one apiece on
 * AP-004/AP-007/AP-012) never matched anything in internal-audit mode's
 * data — `planHasAuditor()` would find that auditor's plans in one client
 * mode and silently find none in the other, even though both modes are
 * supposed to represent the same underlying roster of auditors.
 *
 * `buildInternalAuditPlans()` now assigns plan i's generated scopes the
 * SAME auditor names, in the SAME order, as `AUDIT_FIRM_MOCK_PLANS[i]`'s own
 * scopes (see `auditorsForFirmPlan()` below) — scope 0 gets the firm plan's
 * scope-0 auditor, scope 1 gets its scope-1 auditor, and so on. This is
 * capped, not cycled: a generated sub-division with MORE scopes than the firm
 * plan had gets a fallback auditor for the extras rather than repeating a
 * firm-plan name, so an auditor's total scope count across the whole
 * generated dataset can never exceed what the firm roster actually gives
 * them — "Bob Smith" ends up with exactly 3 scopes in internal-audit mode
 * too, not more. A generated sub-division with FEWER scopes than the firm
 * plan simply doesn't use that plan's later auditor names at all. Either
 * way, an auditor's name — and any `?auditorId=` link built from it —
 * resolves to the same plan positions in both client modes.
 */

type SeedScope = {
  /** Scope id in the audit-scope seed — set when the scope has generated scope jobs. */
  id?: string;
  scopeName?: string;
  auditFrequency?: string;
  riskRating?: string;
};

type SeedSubDivision = {
  subDivisionCode?: string;
  subDivisionName?: string;
  scopes?: SeedScope[];
};

/** Seed `auditFrequency` string (e.g. 'quarterly') → Frequency letter code. Defaults to yearly for anything missing/unrecognised. */
function freqFromAuditFrequency(freq: string | undefined): Frequency {
  switch (freq) {
    case 'weekly':      return 'W';
    case 'bi-weekly':   return 'BW';
    case 'monthly':     return 'M';
    case 'quarterly':   return 'Q';
    case 'half-yearly': return 'HY';
    case 'annually':    return 'Y';
    default:            return 'Y';
  }
}

/** Seed `riskRating` string (e.g. 'high') → RiskRating. Defaults to Medium for anything missing/unrecognised. */
function riskFromRiskRating(risk: string | undefined): RiskRating {
  switch (risk) {
    case 'high':   return 'High';
    case 'medium': return 'Medium';
    case 'low':    return 'Low';
    default:       return 'Medium';
  }
}

/** Same status collapse singleScopePlan() uses above, reused so a generated plan's scopes/jobs/months agree with its own plan-level status. */
function instanceStatusForPlanStatus(status: AuditPlanStatus): InstanceStatus {
  if (status === AuditPlanStatuses.Overdue) return InstanceStatuses.Overdue;
  if (status === AuditPlanStatuses.Completed) return InstanceStatuses.Completed;
  if (status === AuditPlanStatuses.InProgress) return InstanceStatuses.InProgress;
  return InstanceStatuses.Planned;
}

/** Every scope's auditor across a firm plan's sub-divisions, in appearance
 *  order (sub-division order, then scope order within each sub-division) — e.g.
 *  AP-001 → ['A. Rahman','S. Lee','A. Rahman','S. Lee','S. Lee','M. Khan',
 *  'M. Khan','M. Khan'] (8 scopes), AP-004 → ['Bob Smith'] (1 scope). Used
 *  by buildSeedSubDivision() below to mirror this exact list — index for
 *  index, capped rather than cycled — onto the generated sub-division's own
 *  scopes; see the "auditor is mirrored the exact same way [as status]"
 *  comment above for why this replaced deriving auditor from the seed
 *  division's own submittedBy/divisionManager field. */
function auditorsForFirmPlan(firmPlan: AuditPlan): string[] {
  const auditors = firmPlan.subDivisions.flatMap(d => d.scopes.map(s => s.auditor));
  return auditors.length ? auditors : ['Unassigned'];
}

/** The active client's generated scope jobs, grouped by scope id. */
const SCOPE_JOBS_BY_SCOPE_ID: Map<string, SeedScopeJob[]> = SCOPE_JOB_SEED.reduce((map, job) => {
  const list = map.get(job.scopeId) ?? [];
  list.push(job);
  return map.set(job.scopeId, list);
}, new Map<string, SeedScopeJob[]>());

function instanceStatusForJob(status: SeedScopeJob['status']): InstanceStatus {
  switch (status) {
    case ScopeJobStatuses.Completed:  return InstanceStatuses.Completed;
    case ScopeJobStatuses.InProgress: return InstanceStatuses.InProgress;
    case ScopeJobStatuses.Overdue:    return InstanceStatuses.Overdue;
    default:                          return InstanceStatuses.Planned;
  }
}

/** 12-slot months array from a scope's jobs in `year` — one slot per job, in
 *  the month its period starts (same rule as audit-plan-scope-adapter.ts), so
 *  the plan's job count always equals the Scope Jobs page's count. Null when
 *  the scope has no jobs in that year (e.g. a later plan cycle). */
function monthsFromScopeJobs(scopeId: string | undefined, year: number): (InstanceStatus | null)[] | null {
  const jobs = (scopeId ? SCOPE_JOBS_BY_SCOPE_ID.get(scopeId) ?? [] : [])
    .filter(j => j.periodStart.getFullYear() === year);
  if (!jobs.length) return null;
  const months: (InstanceStatus | null)[] = Array(12).fill(null);
  for (const job of jobs) months[job.periodStart.getMonth()] = instanceStatusForJob(job.status);
  return months;
}

function buildSeedScope(seed: SeedScope, subDivisionCode: string, index: number, auditor: string, baseStatus: InstanceStatus, anchorMonth: number, year: number): AuditScope {
  const freq = freqFromAuditFrequency(seed.auditFrequency);
  const name = seed.scopeName ?? `Scope ${index + 1}`;
  return {
    id: seed.id ? `s-${seed.id}` : `s-${subDivisionCode}-${index + 1}`,
    code: seed.id ?? `${subDivisionCode}-S${index + 1}`,
    name,
    freq,
    auditor,
    risk: riskFromRiskRating(seed.riskRating),
    rfi: 0,
    findings: 0,
    months: monthsFromScopeJobs(seed.id, year) ?? genMonths(freq, anchorMonth, [baseStatus]),
    jobs: [{ id: 'j1', name: `${name} — primary procedure`, auditor, hrs: 6, status: baseStatus }],
  };
}

/**
 * `firmAuditors[i]` (from `auditorsForFirmPlan()`) becomes generated scope
 * i's auditor, for as many scopes as `firmAuditors` actually has. Any
 * generated scope beyond that — this seed sub-division has more scopes than
 * the firm plan did — falls back to `fallbackAuditor` instead of wrapping
 * back around to `firmAuditors[0]`, which is what keeps a firm-plan
 * auditor's total scope count from inflating past what the firm roster
 * actually assigns them (see the module-level comment above).
 */
function buildSeedSubDivision(seed: SeedSubDivision, firmAuditors: string[], fallbackAuditor: string, baseStatus: InstanceStatus, anchorMonth: number, year: number): SubDivision {
  const name = seed.subDivisionName ?? 'Sub-Division';
  const subDivisionCode = seed.subDivisionCode ?? name;
  return {
    id: subDivisionCode,
    name,
    scopes: (seed.scopes ?? []).map((s, i) =>
      buildSeedScope(s, subDivisionCode, i, firmAuditors[i] ?? fallbackAuditor, baseStatus, anchorMonth, year)),
  };
}

type SeedCompany = (typeof COMPANIES_SEED)[number];
type SeedDivision = (typeof DIVISION_INDI_ORG_COMPANIES)[number]['divisions'][number];

/** One plan-worthy (company, division, sub-division) triple — the unit a generated internal-audit plan is built from. One sub-division per plan mirrors how most of the audit-firm mock rows above (AP-002…AP-012) are single-sub-division plans too. */
interface PlanEntry {
  company: SeedCompany;
  division: SeedDivision;
  subDivision: SeedSubDivision;
  /** True for a division flagged `hasSubDivision: false` — the plan is built on the division itself (see divisionLevelSeed()). */
  isDivisionLevel?: boolean;
}

/** First year of a generated plan's two-year period (cycle 0). */
const PLAN_START_YEAR = 2026;

function buildPlanFromEntry(entry: PlanEntry, cycle: number, status: AuditPlanStatus, firmAuditors: string[]): AuditPlan {
  const { company, division, subDivision, isDivisionLevel } = entry;

  // `status` and `firmAuditors` are both passed in by buildInternalAuditPlans()
  // below — they're AUDIT_FIRM_MOCK_PLANS[i].status / auditorsForFirmPlan(
  // AUDIT_FIRM_MOCK_PLANS[i]) for this plan's position in the list, not
  // derived from the division/cycle, so both client modes show the same
  // status, and the same per-scope auditor names (capped to the firm plan's
  // own scope count — see buildSeedSubDivision()), at the same list position.
  // `cycle` still only affects the id suffix and how far the start/end dates
  // are shifted forward (an extra lap through the entries stands in for a
  // later audit cycle of the same sub-division).
  const baseStatus = instanceStatusForPlanStatus(status);

  // Two-year period from 1 Jan PLAN_START_YEAR (+1 per cycle) — the same
  // FY2026–2027 window as the audit-firm plans, so every internal-audit seed
  // scope's timeframe sits inside its cycle-0 plan.
  const startYear = PLAN_START_YEAR + cycle;
  const startDate = new Date(startYear, 0, 1);
  const endDate = new Date(startYear + 1, 11, 31);
  const anchorMonth = startDate ? startDate.getMonth() : 0;

  // Only used for a generated scope beyond firmAuditors' length — see
  // buildSeedSubDivision()'s comment. Same placeholder the old
  // submittedBy/divisionManager derivation used as its primary source; here
  // it's strictly an overflow fallback.
  const fallbackAuditor = division.submittedBy || division.divisionManager || 'Unassigned';

  const subDivisionName = subDivision.subDivisionName ?? 'Sub-Division';
  const subDivisionCode = subDivision.subDivisionCode ?? subDivisionName;
  // Division-level plans are keyed on the division alone — there's no sub-division to add.
  const baseId = isDivisionLevel ? division.divisionCode : `${division.divisionCode}__${subDivisionCode}`;
  const id = cycle === 0 ? baseId : `${baseId}__C${cycle}`;
  const subject = isDivisionLevel ? division.divisionName : `${subDivisionName} — ${division.divisionName}`;

  const year = (startDate ?? endDate)?.getFullYear();

  return {
    id,
    planName: `${subject} Audit Plan${year ? ` ${year}` : ''}`,
    organizationName: company.companyName,
    divisionName: division.divisionName,
    status,
    startDate,
    endDate,
    description: `Internal audit plan for ${subject} (${company.companyName})${cycle > 0 ? `, later cycle` : ''}.`,
    subDivisions: [{
      ...buildSeedSubDivision(subDivision, firmAuditors, fallbackAuditor, baseStatus, anchorMonth, startYear),
      isDivisionLevel,
    }],
  };
}

/**
 * Generates internal-audit plans from the static seed files, one per
 * (division, sub-division) pair, then cycles back through that list — each
 * extra pass representing a later audit cycle for the same sub-division
 * (see buildPlanFromEntry) — until the count matches AUDIT_FIRM_MOCK_PLANS
 * above. This keeps the list (and every KPI/chart derived from MOCK_PLANS)
 * the same size in both client modes; only the underlying rows differ. If
 * the audit-firm roster's length ever changes, this follows automatically —
 * nothing here is a hardcoded count.
 *
 * Plan i's `status` is taken directly from `AUDIT_FIRM_MOCK_PLANS[i].status`
 * (not from the seed division's own `auditStatus`), so the internal-audit
 * list always reproduces the exact same statuses, in the same positions,
 * as the audit-firm list — both modes exercise every status
 * (Draft/Planned/In Progress/Overdue/Completed/On Hold/Cancelled) in
 * identical proportion, just attributed to DAR Exchange's own
 * org/division/sub-division rows. Plan i's scopes get their `auditor` mirrored
 * the same way, via `auditorsForFirmPlan(AUDIT_FIRM_MOCK_PLANS[i])` (not the
 * seed division's own `submittedBy`/`divisionManager`) — capped to that firm
 * plan's own scope count, so an auditor's total scope count (e.g. "Bob
 * Smith"'s 3 scopes across AP-004/AP-007/AP-012) is identical in both client
 * modes and resolves the same way via `planHasAuditor()`/`?auditorId=`.
 */
/** A plan's scopes come from the audit-scope seed (SCOPE_INDI_ORG_COMPANIES),
 *  keeping only scopes that have generated scope jobs — i.e. the Approved
 *  scopes the Scope Jobs page lists — so the Audit Plan's Scope / Scope Job
 *  summaries match Audit Scope Management and the Scope Jobs page. The
 *  sub-division seed's own `scopes` are generic placeholders and are not used.
 *  `subDivisionName: null` → a division-level plan: the division's own scopes
 *  plus any still nested under its sub-divisions. Deduped by id. */
function approvedSeedScopes(companyId: string, divisionCode: string, subDivisionName: string | null): SeedScope[] {
  const scopeDivision = SCOPE_INDI_ORG_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode);
  if (!scopeDivision) return [];
  const source = subDivisionName === null
    ? [...(scopeDivision.scopes ?? []), ...scopeDivision.subDivisions.flatMap(d => d.scopes)]
    : scopeDivision.subDivisions.find(d => d.subDivisionName === subDivisionName)?.scopes ?? [];
  const seen = new Set<string>();
  return source
    .filter(s => SCOPE_JOBS_BY_SCOPE_ID.has(s.id) && !seen.has(s.id) && !!seen.add(s.id))
    .map(s => ({ id: s.id, scopeName: s.scopeName, auditFrequency: s.auditFrequency, riskRating: s.riskRating ?? undefined }));
}

/** Seed for a division flagged `hasSubDivision: false`, shaped like a
 *  sub-division seed so buildSeedSubDivision() can build it unchanged — code
 *  and name are the division's own. */
function divisionLevelSeed(companyId: string, division: SeedDivision): SeedSubDivision {
  return {
    subDivisionCode: division.divisionCode,
    subDivisionName: division.divisionName,
    scopes: approvedSeedScopes(companyId, division.divisionCode, null),
  };
}

function buildInternalAuditPlans(): AuditPlan[] {
  const subDivisionCompaniesById = new Map(SUB_DIVISION_INDI_ORG_COMPANIES.map(c => [c.id, c]));
  const entries: PlanEntry[] = [];

  for (const company of COMPANIES_SEED) {
    const divisionCompany = DIVISION_INDI_ORG_COMPANIES.find(c => c.id === company.id);
    if (!divisionCompany) continue;
    const subDivisionCompany = subDivisionCompaniesById.get(company.id);

    for (const division of divisionCompany.divisions) {
      // No sub-divisions → one plan for the whole division. Its seed still
      // carries a subDivisions array, so it must be skipped explicitly.
      if (division.hasSubDivision === false) {
        entries.push({ company, division, subDivision: divisionLevelSeed(company.id, division), isDivisionLevel: true });
        continue;
      }
      const subDivisionSourceDivision = subDivisionCompany?.divisions.find(b => b.divisionCode === division.divisionCode);
      const subDivisionSeeds: SeedSubDivision[] = subDivisionSourceDivision?.subDivisions ?? division.subDivisions ?? [];
      for (const subDivision of subDivisionSeeds) {
        const scopes = approvedSeedScopes(company.id, division.divisionCode, subDivision.subDivisionName ?? null);
        entries.push({ company, division, subDivision: { ...subDivision, scopes } });
      }
    }
  }

  if (entries.length === 0) return [];

  const targetCount = AUDIT_FIRM_MOCK_PLANS.length;
  const plans: AuditPlan[] = [];
  for (let i = 0; i < targetCount; i++) {
    const cycle = Math.floor(i / entries.length);
    const status = AUDIT_FIRM_MOCK_PLANS[i].status;
    const firmAuditors = auditorsForFirmPlan(AUDIT_FIRM_MOCK_PLANS[i]);
    plans.push(buildPlanFromEntry(entries[i % entries.length], cycle, status, firmAuditors));
  }

  return plans;
}

/** The plans the whole app (this list, the overview dashboard, the auditor
 *  pages) actually reads — audit-firm builds get the hardcoded roster above,
 *  internal-audit builds get DAR Exchange's own structure generated from the
 *  static seed files. Computed once at module load, same as every other
 *  CLIENT_MODE_VALUE switch in this app. */
export const MOCK_PLANS: AuditPlan[] =
  CLIENT_MODE_VALUE === 'internal-audit' ? buildInternalAuditPlans() : AUDIT_FIRM_MOCK_PLANS.map(withDivisionLevel);

/** The plan a scope belongs to: its own `auditPlanId` when set, otherwise the
 *  first plan for its company/division names (and sub-division, when it has
 *  one) — the fallback covers the internal-audit seeds, whose plans are
 *  generated and so can't be referenced by a hardcoded id. */
export function findAuditPlanForScope(
  auditPlanId: string | null | undefined,
  organizationName: string,
  divisionName: string,
  subDivisionName: string | null | undefined,
): AuditPlan | undefined {
  if (auditPlanId) return MOCK_PLANS.find(p => p.id === auditPlanId);
  return MOCK_PLANS.find(p =>
    p.organizationName === organizationName &&
    p.divisionName === divisionName &&
    (!subDivisionName || p.subDivisions.some(d => d.name === subDivisionName)));
}

/** Audit-firm plans whose division is flagged `hasSubDivision: false` in
 *  ORG_STATIC_DATA (none of the plans above, currently) are
 *  planned on the division itself: their sub-division lanes collapse into one
 *  division-level lane. Scope order is kept, so auditorsForFirmPlan() is
 *  unaffected. */
function withDivisionLevel(plan: AuditPlan): AuditPlan {
  const division = ORG_STATIC_DATA
    .find(c => c.companyName === plan.organizationName)?.divisions
    .find(b => b.divisionName === plan.divisionName);
  if (!division || division.hasSubDivision !== false) return plan;
  return {
    ...plan,
    subDivisions: [{
      id: division.divisionCode,
      name: division.divisionName,
      isDivisionLevel: true,
      scopes: plan.subDivisions.flatMap(d => d.scopes),
    }],
  };
}

/* ── Plan-level display helpers (shared by list + dashboard) ────────────── */

export function planYear(p: AuditPlan): number {
  const d = p.startDate ?? p.endDate;
  return d ? new Date(d).getFullYear() : new Date().getFullYear();
}

export function planTitle(p: AuditPlan): string {
  return p.planName;
}

function formatDate(d?: Date): string {
  if (!d) return AUDIT_PLAN_EMPTY_VALUE;
  return new Date(d).toLocaleDateString(AUDIT_PLAN_DATE_LOCALE, AUDIT_PLAN_DATE_FORMAT_OPTIONS);
}

export function periodLabel(p: AuditPlan): string {
  return `${formatDate(p.startDate)} – ${formatDate(p.endDate)}`;
}

/** True when any scope or job anywhere in the plan is assigned to the given
 *  auditor (by display name). Used by the plan list to scope its table to a
 *  single auditor (e.g. via an `?auditorId=` query param coming from the
 *  overview dashboard's "My Active Audits" KPI card), and by the dashboard
 *  helpers below for the same auditor-scoped views. */
export function planHasAuditor(p: AuditPlan, auditorName: string): boolean {
  return p.subDivisions.some(d =>
    d.scopes.some(s => s.auditor === auditorName || s.jobs.some(j => j.auditor === auditorName)),
  );
}

// countActivePlansForAuditor / getActivePlansForAuditor / getAllPlansForAuditor
// (and the AuditorPlanRow shape they return) live in audit-plan-list.component.ts
// instead of here — auditor-overview-tab.component.ts and auditor-my-audits-scopes-tab.component.ts both
// import them from that component file, so they need to keep being exported
// from there, the same way the findings-list component keeps its own
// auditor-aggregation helpers rather than moving them into audit-finding-data.ts.

/* ── Dashboard aggregation helpers ────────────────────────────────────────
   Everything below reads MOCK_PLANS (or whatever plan array is passed in —
   swap the argument for a real API result later, the math doesn't change)
   and reduces it into the shapes the KPI cards / charts / drawers need. This
   replaces `audit-overview-tab.component.ts`'s old hardcoded `auditsByOrgSubDivision`,
   `auditsByOrgRisk`, `auditStatusData`, `upcomingAudits`, and `kpis` arrays.
   ────────────────────────────────────────────────────────────────────────── */

export interface OrgBreakdown {
  org: string;
  counts: number[];
}

export interface KpiSummary {
  totalAudits: number;
  inProgressCount: number;
  completedCount: number;
  completionRatePct: number;
  overdueCount: number;
  highRiskNotStartedCount: number;
}

export interface UpcomingAuditEntry {
  name: string;
  subDivision: string;
  auditor: string;
  date: string;
  status: string;
  statusClass: string;
}

/** Distinct organizations, in first-appearance order (keeps chart legends stable run-to-run). */
export function getDistinctOrganizations(plans: AuditPlan[]): string[] {
  const seen: string[] = [];
  for (const p of plans) if (!seen.includes(p.organizationName)) seen.push(p.organizationName);
  return seen;
}

/** Distinct sub-division names actually in use across the plans, first-appearance order. */
export function getDistinctSubDivisions(plans: AuditPlan[]): string[] {
  const seen: string[] = [];
  for (const p of plans) for (const d of p.subDivisions) if (!seen.includes(d.name)) seen.push(d.name);
  return seen;
}

/**
 * KPI card values. "Total Audits" and "Overdue Audits" are counted at the
 * plan level (one plan = one company+division's whole-year audit engagement —
 * matches what the KPI's click-through filters on the plan list). "High-Risk
 * Scopes Not Started" is counted at the scope level: a High-risk scope where
 * every one of its jobs is still 'planned' (nothing completed, in progress,
 * or overdue yet).
 */
export function getKpiSummary(plans: AuditPlan[]): KpiSummary {
  const totalAudits = plans.length;
  const inProgressCount = plans.filter(p => p.status === AuditPlanStatuses.InProgress).length;
  const completedCount = plans.filter(p => p.status === AuditPlanStatuses.Completed).length;
  const overdueCount = plans.filter(p => p.status === AuditPlanStatuses.Overdue).length;
  const completionRatePct = totalAudits ? Math.round((completedCount / totalAudits) * 100) : 0;

  let highRiskNotStartedCount = 0;
  for (const p of plans) {
    for (const d of p.subDivisions) {
      for (const s of d.scopes) {
        if (s.risk === RiskRatings.High && s.jobs.length > 0 && s.jobs.every(j => j.status === InstanceStatuses.Planned)) {
          highRiskNotStartedCount++;
        }
      }
    }
  }

  return { totalAudits, inProgressCount, completedCount, completionRatePct, overdueCount, highRiskNotStartedCount };
}

/** Fixed display order + color for the plan-status pie (AUDIT_PLAN_STATUS_PIE_CONFIG).
 *  Colors mix the status palette (good/warning/serious/critical) for the
 *  semantically loaded states with two neutral categorical hues for the inert
 *  ones (Draft, Planned) — see the dataviz color-formula notes referenced in
 *  the overview component. */
const STATUS_PIE_CONFIG = AUDIT_PLAN_STATUS_PIE_CONFIG;

export function getStatusDistribution(plans: AuditPlan[]): { labels: string[]; data: number[]; colors: string[] } {
  const counts = new Map<AuditPlanStatus, number>();
  for (const p of plans) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);

  // Only show statuses that actually occur, in the fixed order above.
  const present = STATUS_PIE_CONFIG.filter(c => (counts.get(c.key) ?? 0) > 0);
  return {
    labels: present.map(c => c.label),
    data: present.map(c => counts.get(c.key) ?? 0),
    colors: present.map(c => c.color),
  };
}

/**
 * Number of AUDITS (plans) per sub-division, one row per organization — matches
 * how "audits" are counted everywhere else (the plan list, the "Total
 * Audits" KPI: `plans.length`). A plan is counted once for each of its own
 * sub-divisions, so summing this chart's counts can exceed the plan total only
 * when a plan spans more than one sub-division (e.g. AP-001) — it can never
 * inflate further by a sub-division's scope count the way a scope-count tally
 * would.
 *
 * A division flagged `hasSubDivision: false` is planned on the division
 * itself, so it shows up here as an entry named after the division;
 * `isDivisionLevel[i]` is true for those entries so the chart can label them.
 */
export function getAuditsBySubDivision(plans: AuditPlan[]): { subDivisions: string[]; isDivisionLevel: boolean[]; breakdown: OrgBreakdown[] } {
  const subDivisions = getDistinctSubDivisions(plans);
  const orgs = getDistinctOrganizations(plans);

  const breakdown: OrgBreakdown[] = orgs.map(org => ({ org, counts: subDivisions.map(() => 0) }));
  const isDivisionLevel = subDivisions.map(() => false);
  const orgIndex = new Map(orgs.map((o, i) => [o, i]));
  const subDivisionIndex = new Map(subDivisions.map((d, i) => [d, i]));

  for (const p of plans) {
    const oi = orgIndex.get(p.organizationName)!;
    for (const d of p.subDivisions) {
      const di = subDivisionIndex.get(d.name)!;
      breakdown[oi].counts[di] += 1;
      if (d.isDivisionLevel || d.name === p.divisionName) isDivisionLevel[di] = true;
    }
  }

  return { subDivisions, isDivisionLevel, breakdown };
}

/**
 * Number of AUDITS (plans) per division, one row per organization. A plan
 * covers exactly one division (company + division + year), so each plan is
 * counted once — every division appears here whether or not it has
 * sub-divisions, and the counts always sum to the Total Audits KPI.
 */
export function getAuditsByDivision(plans: AuditPlan[]): { divisions: string[]; breakdown: OrgBreakdown[] } {
  const divisions: string[] = [];
  for (const p of plans) if (!divisions.includes(p.divisionName)) divisions.push(p.divisionName);
  const orgs = getDistinctOrganizations(plans);

  const breakdown: OrgBreakdown[] = orgs.map(org => ({ org, counts: divisions.map(() => 0) }));
  const orgIndex = new Map(orgs.map((o, i) => [o, i]));
  const divisionIndex = new Map(divisions.map((d, i) => [d, i]));

  for (const p of plans) {
    breakdown[orgIndex.get(p.organizationName)!].counts[divisionIndex.get(p.divisionName)!] += 1;
  }

  return { divisions, breakdown };
}

/** The level an audit was actually carried out at: a whole division (when the
 *  division has no sub-divisions) or one sub-division of a division. */
export interface AuditUnit {
  division: string;
  /** null when the audit was done on the division itself. */
  subDivision: string | null;
}

/**
 * Number of AUDITS (plans) per audit unit, one row per organization. Some
 * divisions have no sub-divisions and are audited as a whole, others are
 * audited per sub-division — each plan is counted on the unit it was actually
 * planned on. Sub-divisions are keyed by their parent division too, so two
 * divisions with a same-named sub-division never merge. Units are grouped by
 * division (first-appearance order), so a division's sub-divisions sit next
 * to each other.
 */
export function getAuditsByAuditUnit(plans: AuditPlan[]): { units: AuditUnit[]; breakdown: OrgBreakdown[] } {
  const unitsByDivision = new Map<string, AuditUnit[]>();
  const unitKey = (u: AuditUnit) => `${u.division}\u0000${u.subDivision ?? ''}`;
  const planUnits = (p: AuditPlan): AuditUnit[] =>
    p.subDivisions.map(d => ({
      division: p.divisionName,
      subDivision: d.isDivisionLevel || d.name === p.divisionName ? null : d.name,
    }));

  for (const p of plans) {
    const list = unitsByDivision.get(p.divisionName) ?? [];
    unitsByDivision.set(p.divisionName, list);
    for (const u of planUnits(p)) {
      if (!list.some(x => x.subDivision === u.subDivision)) list.push(u);
    }
  }
  // Division-level unit first within its division, then sub-divisions.
  const units = [...unitsByDivision.values()].flatMap(list =>
    [...list].sort((a, b) => Number(a.subDivision !== null) - Number(b.subDivision !== null)),
  );

  const orgs = getDistinctOrganizations(plans);
  const breakdown: OrgBreakdown[] = orgs.map(org => ({ org, counts: units.map(() => 0) }));
  const orgIndex = new Map(orgs.map((o, i) => [o, i]));
  const unitIndex = new Map(units.map((u, i) => [unitKey(u), i]));

  for (const p of plans) {
    const oi = orgIndex.get(p.organizationName)!;
    const seen = new Set<number>();
    for (const u of planUnits(p)) {
      const ui = unitIndex.get(unitKey(u))!;
      if (seen.has(ui)) continue;
      seen.add(ui);
      breakdown[oi].counts[ui] += 1;
    }
  }

  return { units, breakdown };
}

const RISK_LEVELS: RiskRating[] = RISK_LEVEL_ORDER;

/**
 * Number of AUDITS (plans) per risk rating, one row per organization — same
 * unit as the "Total Audits" KPI, so the counts sum to `plans.length`. A plan
 * has no risk rating of its own, so it is rated by its highest-risk scope
 * (High > Medium > Low). Counting scopes instead inflated the total — a
 * multi-scope plan like AP-001 was counted 8 times. A plan with no scopes
 * can't be rated and is left out.
 */
export function getAuditsByRisk(plans: AuditPlan[]): { riskLevels: RiskRating[]; breakdown: OrgBreakdown[] } {
  const orgs = getDistinctOrganizations(plans);
  const breakdown: OrgBreakdown[] = orgs.map(org => ({ org, counts: RISK_LEVELS.map(() => 0) }));
  const orgIndex = new Map(orgs.map((o, i) => [o, i]));
  const riskIndex = new Map(RISK_LEVELS.map((r, i) => [r, i]));

  for (const p of plans) {
    const scopeRiskIndexes = p.subDivisions.flatMap(d => d.scopes.map(s => riskIndex.get(s.risk)!));
    if (!scopeRiskIndexes.length) continue;
    // RISK_LEVELS is ordered highest first, so the smallest index is the highest risk.
    breakdown[orgIndex.get(p.organizationName)!].counts[Math.min(...scopeRiskIndexes)]++;
  }

  return { riskLevels: RISK_LEVELS, breakdown };
}

/**
 * Next-scheduled audits: every scope-month marked 'planned' (i.e. scheduled
 * but not yet started), across every plan, sorted to the nearest first.
 *
 * Note: the mock plans' calendars sit in 2024/2025 while "today" may be
 * later than that — so "upcoming" here means "next on each plan's own
 * calendar," not "after today's real-world date." Once this reads from a
 * live API the plans themselves will carry the current year and a literal
 * `>= today` filter can be added here.
 */
export function getUpcomingAudits(plans: AuditPlan[], limit = 5): UpcomingAuditEntry[] {
  const entries: { date: Date; entry: UpcomingAuditEntry }[] = [];

  for (const p of plans) {
    const year = planYear(p);
    for (const d of p.subDivisions) {
      for (const s of d.scopes) {
        s.months.forEach((status, monthIndex) => {
          if (status !== InstanceStatuses.Planned) return;
          const date = new Date(year, monthIndex, 1);
          entries.push({
            date,
            entry: {
              name: s.name,
              subDivision: `${p.organizationName} · ${d.name}`,
              auditor: s.auditor,
              date: date.toLocaleDateString(AUDIT_PLAN_DATE_LOCALE, AUDIT_PLAN_MONTH_YEAR_FORMAT_OPTIONS),
              status: UPCOMING_AUDIT_STATUS.Label,
              statusClass: UPCOMING_AUDIT_STATUS.Class,
            },
          });
        });
      }
    }
  }

  entries.sort((a, b) => a.date.getTime() - b.date.getTime());
  return entries.slice(0, limit).map(e => e.entry);
}