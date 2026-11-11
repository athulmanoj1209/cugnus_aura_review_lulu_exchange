/**
 * Shared audit-finding model, mock data, and derived-metric helpers.
 *
 * `findings-list.component.ts` (the Findings LIST) and
 * `audit-findings-tab.component.ts` (the Findings DASHBOARD) used to each carry
 * their own, completely separate mock dataset — different IDs (FND-001..012
 * vs F001..F010), different companies (real orgs vs placeholder "Acme
 * Holdings"/"Globex Ltd"), different counts. That's exactly why clicking the
 * dashboard's "Open Findings" KPI (which said 4) landed on the list page
 * pre-filtered to Open and showing a totally unrelated 3 results — the two
 * pages were never looking at the same data to begin with. This file is now
 * the single source both components read from, so a KPI card and the list
 * it drills into can't disagree again.
 *
 * Placement: `findings-list.component.ts` reaches `company-org-data.ts` via
 * `'../company-org-data'` and the finding types via
 * `'../../services/admin/audit-finding.service'`, and `audit-findings.
 * component.ts` reaches `findings-profile.component.ts` via the same
 * `'../finding-profile/...'` path `findings-list.component.ts` uses — so
 * this file assumes both components are siblings at that same folder depth,
 * and sits next to `company-org-data.ts` one level up from both. Both
 * components import it as `'../finding-data'`. Adjust the relative paths
 * below (and in both components) if your real folder layout differs.
 */

import { AuditFinding, FindingSeverity, FindingStatus } from './services/audit-finding.service';
// CLIENT_MODE_VALUE lives at the app-root config/ folder, a sibling of this
// file's own Admin/ folder (same depth company-data.service.ts sees it from
// its own services/ folder) — adjust this path if your layout differs.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '../../Org-data-internal-audit';
import { ORG_STATIC_DATA } from '../../organization/company/company-org-data';
import {
  ACTIVE_STATUSES,
  CLOSED_STATUSES,
  CRITICAL_HIGH_SEVERITIES,
  FindingStatuses,
  IN_PROGRESS_BUCKET_STATUSES,
  MS_PER_DAY,
  OVERDUE_STATUSES,
} from './constants/findings.constants';
import {
  FINDING_SEVERITY_LABELS,
  FINDING_STATUS_LABELS,
  OPEN_SEVERITY_PIE_SEVERITIES,
} from './constants/findings-labels.constants';
import { FINDING_EMPTY_VALUE, FINDING_UNASSIGNED_LABEL } from './constants/findings-messages.constants';

// Re-exported so existing importers of ACTIVE_STATUSES from this file keep working.
export { ACTIVE_STATUSES } from './constants/findings.constants';

/** Extends AuditFinding with rich profile fields for mock data */
export type RichAuditFinding = AuditFinding & {
  company?:       string;
  division?:      string;
  scope?:         string;
  subscope?:      string;
  taskId?:        string;
  risk?:          string;
  createdAt?:     Date;
  description?:   string;
  observationIds?: string[];
  /** Structural stand-in for findings-profile.component.ts's `FindingDocument`
   *  — kept as an inline shape here (rather than importing that type) so this
   *  file doesn't have to guess findings-profile.component.ts's path relative
   *  to its own folder; it matches the same fields either way. */
  documents?: { name: string; size: number; url?: string }[];
};

/** Date `offset` days from today (negative = past) — keeps the recent team
 *  findings below in the same aging buckets whenever the app is run. */
function daysFromToday(offset: number): Date {
  return new Date(Date.now() + offset * MS_PER_DAY);
}

/** Auditor-team members (see auditor-dashboard/data/audit-team.data.ts) the team findings are assigned to. */
const TEAM_AUDITORS = {
  alice: { fullName: 'Alice Johnson', avatarUrl: '', id: 'alice' },
  carol: { fullName: 'Carol White', avatarUrl: '', id: 'carol' },
  david: { fullName: 'David Lee', avatarUrl: '', id: 'david' },
  emma: { fullName: 'Emma Davis', avatarUrl: '', id: 'emma' },
};

/* ── Mock data (audit-firm / multi-company mode) ──────────────────── */
const AUDIT_FIRM_MOCK_FINDINGS: RichAuditFinding[] = [
  {
    id: 'FND-001', title: 'Segregation of duties not enforced in AP module',
    assignedAuditor: TEAM_AUDITORS.alice,
    subDivision: 'Finance & Accounting', severity: 'critical', status: 'overdue',
    dueDate: new Date('2026-03-15'), daysOverdue: 88,
    flaggedForEscalation: true, isRepeated: true, previousOccurrenceId: 'FND-OLD-001',
    financialImpact: 150000,
    owner: { fullName: 'Sarah Mitchell', avatarUrl: '', id: 'USER#123' },
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-001',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-01-10'),
    description:
      'The accounts payable module does not enforce segregation of duties. ' +
      'A single user can create vendors, post invoices, and approve payments without secondary authorisation. ' +
      'This was observed in three separate transactions totalling AED 550,000 during the review period.',
    observationIds: ['EV-001', 'EV-004'],
    documents: [
      { name: 'ap-access-report.xlsx', size: 521_000, url: 'images/avatars/default-avatar.jpg' },
      { name: 'transaction-log-q1.pdf', size: 189_400 },
      { name: 'remediation-plan.docx', size: 74_200 },
    ],
  },
  {
    id: 'FND-002', title: 'Vendor master file changes lack dual approval',
    assignedAuditor: TEAM_AUDITORS.carol,
    subDivision: 'Procurement & Supply Chain', severity: 'high', status: 'in-progress',
    dueDate: new Date('2026-06-30'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 75000,
    owner: { fullName: 'James Okafor', avatarUrl: '', id: 'USER#124' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-004',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-02-05'),
    description:
      'Changes to the vendor master file (bank details, address, payment terms) can be made by a single procurement user with no secondary approval workflow. ' +
      'This exposes the organisation to fraudulent redirections of vendor payments.',
    observationIds: ['EV-004'],
    documents: [
      { name: 'vendor-master-changes-log.xlsx', size: 312_000 },
      { name: 'procurement-policy-v3.pdf', size: 245_000 },
    ],
  },
  {
    id: 'FND-003', title: 'Password policy non-compliant on legacy ERP',
    subDivision: 'Information Technology', severity: 'high', status: 'open',
    dueDate: new Date('2026-06-20'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: true, previousOccurrenceId: 'FND-OLD-003',
    financialImpact: 0,
    owner: { fullName: 'Priya Nair', avatarUrl: '', id: 'USER#125' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'External Audit', subscope: 'Statutory Audit', taskId: 'TSK-002',
    risk: 'IT TAX risks',
    createdAt: new Date('2026-02-18'),
    description:
      'The legacy ERP system (v6.2) enforces a minimum password length of only 6 characters with no complexity requirements and no account lockout after failed attempts. ' +
      'This is a repeat finding from the FY2024 audit. No remediation has been implemented.',
    observationIds: ['EV-002', 'EV-005'],
    documents: [
      { name: 'erp-password-policy-screenshot.pdf', size: 98_000 },
      { name: 'it-security-baseline.docx', size: 156_000 },
      { name: 'previous-finding-FND-OLD-003.pdf', size: 201_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },
  {
    id: 'FND-004', title: 'Bank reconciliations delayed beyond 30 days',
    assignedAuditor: TEAM_AUDITORS.david,
    subDivision: 'Finance & Accounting', severity: 'medium', status: 'responded',
    dueDate: new Date('2026-07-10'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 20000,
    owner: { fullName: 'Carlos Mendez', avatarUrl: '', id: 'USER#126' },
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio',
    scope: 'Risk Management', subscope: 'Operational Risk', taskId: 'TSK-001',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-02-22'),
    description:
      'Bank reconciliations for 4 of the 7 accounts reviewed were not performed within the required 30-day period. ' +
      'The longest delay observed was 67 days for the AED current account ending 4821. ' +
      'Management has acknowledged the issue and cited staffing shortages as the root cause.',
    observationIds: ['EV-001'],
    documents: [
      { name: 'bank-reconciliation-summary.xlsx', size: 438_000 },
      { name: 'management-response-letter.pdf', size: 112_000 },
    ],
  },
  {
    id: 'FND-005', title: 'Fixed asset register not updated quarterly',
    assignedAuditor: TEAM_AUDITORS.emma,
    subDivision: 'Finance & Accounting', severity: 'medium', status: 'verified',
    dueDate: new Date('2026-05-31'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'Aisha Rahman', avatarUrl: '', id: 'USER#127' },
    company: 'Desert Rose Retail Group', division: 'Dubai Mall Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-003',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-01-28'),
    description:
      'The fixed asset register has not been updated with the Q3 and Q4 2025 additions. ' +
      'A total of 23 new assets (valued at AED 1.2M) were identified in the physical count that are absent from the register. ' +
      'This affects the accuracy of depreciation calculations and the balance sheet.',
    observationIds: ['EV-001', 'EV-003'],
    documents: [
      { name: 'fixed-asset-register-v2.xlsx', size: 682_000 },
      { name: 'physical-count-report.pdf', size: 320_000 },
    ],
  },
  {
    id: 'FND-006', title: 'Privileged access reviews overdue by 2 quarters',
    assignedAuditor: TEAM_AUDITORS.carol,
    subDivision: 'Information Technology', severity: 'critical', status: 'escalated',
    dueDate: new Date('2026-02-28'), daysOverdue: 103,
    flaggedForEscalation: true, isRepeated: false,
    financialImpact: 200000,
    owner: { fullName: 'David Chen', avatarUrl: '', id: 'USER#128' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Regulatory', subscope: 'AML / CFT', taskId: 'TSK-002',
    risk: 'IT TAX risks',
    createdAt: new Date('2025-12-01'),
    description:
      'Quarterly privileged access reviews have not been conducted for two consecutive quarters (Q3 and Q4 2025). ' +
      '14 former employees retain active system administrator accounts. ' +
      '3 accounts have logged activity in the last 30 days. ' +
      'This presents a critical insider threat risk and regulatory non-compliance.',
    observationIds: ['EV-002', 'EV-005'],
    documents: [
      { name: 'privileged-access-audit-log.xlsx', size: 504_000 },
      { name: 'terminated-employees-list.pdf', size: 88_000 },
      { name: 'access-review-policy.docx', size: 134_000 },
      { name: 'escalation-memo.pdf', size: 65_000 },
    ],
  },
  {
    id: 'FND-007', title: 'Travel & expense claims missing receipts > AED 500',
    assignedAuditor: TEAM_AUDITORS.alice,
    subDivision: 'Human Resources', severity: 'low', status: 'closed',
    dueDate: new Date('2026-04-30'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 8500,
    owner: { fullName: 'Fatima Al Zaabi', avatarUrl: '', id: 'USER#129' },
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-003',
    risk: 'Risk in Human Resources',
    createdAt: new Date('2026-01-15'),
    description:
      '18 out of 62 travel and expense claims reviewed (29%) were missing original receipts for items exceeding AED 500. ' +
      'The total unsupported expenditure amounts to AED 8,500. ' +
      'The HR expense policy requires original receipts for all claims above AED 200.',
    observationIds: ['EV-003'],
    documents: [
      { name: 'expense-claims-sample.xlsx', size: 218_000 },
      { name: 'hr-expense-policy-2025.pdf', size: 175_000 },
    ],
  },
  {
    id: 'FND-008', title: 'Contract management system access not role-based',
    assignedAuditor: TEAM_AUDITORS.david,
    subDivision: 'Legal & Governance', severity: 'high', status: 'in-progress',
    dueDate: new Date('2026-07-25'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 50000,
    owner: { fullName: 'Omar Al Hashimi', avatarUrl: '', id: 'USER#130' },
    company: 'Al Waha Construction & Contracting', division: 'Dubai Investment Park Office',
    scope: 'Regulatory', subscope: 'Data Privacy', taskId: 'TSK-004',
    risk: 'IT TAX risks',
    createdAt: new Date('2026-02-10'),
    description:
      'The contract management system grants all Legal department users full read/write/delete access to all contracts, ' +
      'including confidential M&A and litigation documents. ' +
      'Role-based access control has not been implemented, contrary to the data classification policy.',
    observationIds: ['EV-002', 'EV-004'],
    documents: [
      { name: 'contract-system-user-list.xlsx', size: 195_000 },
      { name: 'data-classification-policy.pdf', size: 220_000 },
      { name: 'rbac-gap-analysis.docx', size: 88_000 },
    ],
  },
  {
    id: 'FND-009', title: 'Payroll changes not reviewed by line managers',
    subDivision: 'Human Resources', severity: 'critical', status: 'open',
    dueDate: new Date('2026-06-15'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 300000,
    owner: { fullName: 'Lena Hoffmann', avatarUrl: '', id: 'USER#131' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Risk Management', subscope: 'Operational Risk', taskId: 'TSK-003',
    risk: 'Risk in Human Resources',
    createdAt: new Date('2026-03-02'),
    description:
      'Payroll changes (salary adjustments, allowances, new joiners) processed during Q1 2026 were not reviewed or approved by the relevant line managers before payroll run. ' +
      '37 changes totalling AED 300,000 in additional payroll costs were processed solely by HR without secondary authorisation.',
    observationIds: ['EV-003'],
    documents: [
      { name: 'payroll-change-log-q1-2026.xlsx', size: 760_000 },
      { name: 'payroll-approval-policy.pdf', size: 145_000 },
      { name: 'hr-interview-notes.docx', size: 56_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },
  {
    id: 'FND-010', title: 'Disaster recovery plan not tested in 18 months',
    assignedAuditor: TEAM_AUDITORS.emma,
    subDivision: 'Information Technology', severity: 'high', status: 'open',
    dueDate: new Date('2026-08-01'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: true, previousOccurrenceId: 'FND-OLD-010',
    financialImpact: 0,
    owner: { fullName: 'Priya Nair', avatarUrl: '', id: 'USER#125' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'External Audit', subscope: 'Statutory Audit', taskId: 'TSK-005',
    risk: 'IT TAX risks',
    createdAt: new Date('2026-03-10'),
    description:
      'The disaster recovery plan has not been tested since December 2024 (18 months). ' +
      'The last test identified 4 critical gaps which were documented but not fully resolved. ' +
      'Regulatory requirements mandate annual DR testing. This is a repeated finding from FY2024.',
    observationIds: ['EV-002', 'EV-005'],
    documents: [
      { name: 'dr-plan-v4.docx', size: 412_000 },
      { name: 'last-dr-test-report-dec2024.pdf', size: 298_000 },
      { name: 'gap-remediation-tracker.xlsx', size: 174_000 },
    ],
  },
  {
    id: 'FND-011', title: 'Inventory count variances not investigated timely',
    assignedAuditor: TEAM_AUDITORS.alice,
    subDivision: 'Operations', severity: 'medium', status: 'in-progress',
    dueDate: new Date('2026-07-05'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 45000,
    owner: { fullName: 'Marcus Johnson', avatarUrl: '', id: 'USER#132' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-004',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-02-28'),
    description:
      'Inventory count variances exceeding AED 1,000 identified during the Q4 2025 physical count have not been investigated. ' +
      '12 variance items totalling AED 45,000 remain unexplained after 90 days. ' +
      'The inventory policy requires investigation within 30 days.',
    observationIds: ['EV-001', 'EV-004'],
    documents: [
      { name: 'inventory-variance-report-q4.xlsx', size: 530_000 },
      { name: 'physical-count-sheets.pdf', size: 870_000 },
    ],
  },
  {
    id: 'FND-012', title: 'Journal entry approval controls bypassed',
    assignedAuditor: TEAM_AUDITORS.david,
    subDivision: 'Finance & Accounting', severity: 'critical', status: 'overdue',
    dueDate: new Date('2026-04-01'), daysOverdue: 71,
    flaggedForEscalation: true, isRepeated: false,
    financialImpact: 500000,
    owner: { fullName: 'Sarah Mitchell', avatarUrl: '', id: 'USER#123' },
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom',
    scope: 'Risk Management', subscope: 'Credit Risk', taskId: 'TSK-001',
    risk: 'Risk related to accounts',
    createdAt: new Date('2025-12-15'),
    description:
      'A system configuration error introduced in the November 2025 upgrade allows journal entries above AED 50,000 to be posted without the mandatory second-level approval. ' +
      '23 journal entries totalling AED 500,000 were posted in this manner between November 2025 and January 2026. ' +
      '5 entries have been flagged as potentially fictitious pending further investigation.',
    observationIds: ['EV-001', 'EV-002'],
    documents: [
      { name: 'je-bypass-evidence.xlsx',          size: 622_000 },
      { name: 'system-config-change-log.pdf',      size: 178_000 },
      { name: 'flagged-entries-analysis.xlsx',     size: 294_000 },
      { name: 'forensic-review-memo.docx',         size: 105_000 },
    ],
  },
  {
    id: 'FND-013', title: 'Overtime approvals recorded after payroll cutoff',
    subDivision: 'Human Resources', severity: 'medium', status: 'in-progress',
    dueDate: new Date('2026-07-18'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 12000,
    owner: { fullName: 'Fatima Al Zaabi', avatarUrl: '', id: 'USER#129' },
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-006',
    risk: 'Risk in Human Resources',
    createdAt: new Date('2026-03-05'),
    description:
      'Overtime approvals for 9 of 40 sampled timesheets were recorded by the line manager after the payroll cutoff date, ' +
      'meaning the hours were paid before formal sign-off was obtained. Remediation is in progress with a revised approval workflow.',
    observationIds: ['EV-003'],
    documents: [
      { name: 'overtime-approval-sample.xlsx', size: 164_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },
  {
    id: 'FND-014', title: 'Visitor log retention shorter than policy requires',
    subDivision: 'Operations', severity: 'low', status: 'escalated',
    dueDate: new Date('2026-05-20'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'Marcus Johnson', avatarUrl: '', id: 'USER#132' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-006',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-03-08'),
    description:
      'Warehouse visitor logs are retained for 60 days, short of the 12-month minimum set by the facilities security policy. ' +
      'Sent to the site security lead for review pending a retention-schedule update.',
    observationIds: ['EV-004'],
    documents: [
      { name: 'visitor-log-retention-review.xlsx', size: 58_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },
  {
    id: 'FND-015', title: 'Supplier onboarding checklist missing tax-status check',
    subDivision: 'Procurement & Supply Chain', severity: 'medium', status: 'verified',
    dueDate: new Date('2026-04-12'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 5000,
    owner: { fullName: 'James Okafor', avatarUrl: '', id: 'USER#124' },
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-006',
    risk: 'Risk related to accounts',
    createdAt: new Date('2026-01-20'),
    description:
      'The supplier onboarding checklist did not require verification of tax registration status before activation. ' +
      'Procurement has since added the check and management has confirmed remediation is complete and verified.',
    observationIds: ['EV-004'],
    documents: [
      { name: 'onboarding-checklist-v2.pdf', size: 96_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },
  {
    id: 'FND-016', title: 'Petty cash float count sheet unsigned',
    subDivision: 'Finance & Accounting', severity: 'low', status: 'closed',
    dueDate: new Date('2026-02-10'), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 1200,
    owner: { fullName: 'Aisha Rahman', avatarUrl: '', id: 'USER#127' },
    company: 'Desert Rose Retail Group', division: 'Dubai Mall Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-006',
    risk: 'Risk related to accounts',
    createdAt: new Date('2025-12-20'),
    description:
      'The weekly petty cash float count sheet for the store was not signed off by the branch manager on 2 occasions. ' +
      'Corrective action was taken and the finding was closed after a follow-up count confirmed no variance.',
    observationIds: ['EV-001'],
    documents: [
      { name: 'petty-cash-count-log.xlsx', size: 42_000 },
    ],
    assignedAuditor: { fullName: 'Bob Smith', avatarUrl: '', id: 'bob' },
  },

  /* ── Recent auditor-team findings ─────────────────────────────────────
   * Dated relative to today (daysFromToday) so the team overview's
   * "Findings Aging" chart always has findings in the 0–7, 8–30 and 31–60
   * day buckets — the older findings above all sit in 60+.
   * ──────────────────────────────────────────────────────────────────── */
  {
    id: 'FND-017', title: 'Customer credit limits overridden without approval',
    assignedAuditor: TEAM_AUDITORS.alice,
    subDivision: 'Finance & Accounting', severity: 'high', status: 'open',
    dueDate: daysFromToday(25), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 85000,
    owner: { fullName: 'Sarah Mitchell', avatarUrl: '', id: 'USER#123' },
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-001',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-3),
    description:
      'Sales staff were able to override customer credit limits at order entry without a documented approval from the credit controller. ' +
      '11 overrides were identified in the sample period, 4 of which relate to customers already past due.',
    observationIds: ['EV-001'],
    documents: [
      { name: 'credit-limit-override-log.xlsx', size: 133_000 },
    ],
  },
  {
    id: 'FND-018', title: 'Goods received notes raised after invoice posting',
    assignedAuditor: TEAM_AUDITORS.carol,
    subDivision: 'Procurement & Supply Chain', severity: 'medium', status: 'open',
    dueDate: daysFromToday(30), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 18000,
    owner: { fullName: 'James Okafor', avatarUrl: '', id: 'USER#124' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-004',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-5),
    description:
      'In 7 of 30 sampled purchases the goods received note was created after the supplier invoice had been posted, ' +
      'undermining the three-way match control.',
    observationIds: ['EV-004'],
    documents: [
      { name: 'grn-invoice-timing-sample.xlsx', size: 97_000 },
    ],
  },
  {
    id: 'FND-019', title: 'Shared login used on warehouse scanning terminals',
    assignedAuditor: TEAM_AUDITORS.emma,
    subDivision: 'Operations', severity: 'low', status: 'open',
    dueDate: daysFromToday(40), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'Marcus Johnson', avatarUrl: '', id: 'USER#132' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-006',
    risk: 'IT TAX risks',
    createdAt: daysFromToday(-1),
    description:
      'Handheld scanning terminals in the warehouse are operated under one shared login, so stock movements cannot be traced to an individual operator.',
    observationIds: ['EV-002'],
    documents: [],
  },
  {
    id: 'FND-020', title: 'Unreconciled suspense account balance above AED 250,000',
    assignedAuditor: TEAM_AUDITORS.david,
    subDivision: 'Finance & Accounting', severity: 'critical', status: 'in-progress',
    dueDate: daysFromToday(10), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 250000,
    owner: { fullName: 'Aisha Rahman', avatarUrl: '', id: 'USER#127' },
    company: 'Desert Rose Retail Group', division: 'Dubai Mall Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-003',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-12),
    description:
      'The general ledger suspense account carries an unreconciled balance of AED 250,000 accumulated over three months. ' +
      'Finance has started clearing the items; remediation is in progress.',
    observationIds: ['EV-001'],
    documents: [
      { name: 'suspense-account-ageing.xlsx', size: 211_000 },
    ],
  },
  {
    id: 'FND-021', title: 'Leaver access not revoked within 24 hours',
    assignedAuditor: TEAM_AUDITORS.emma,
    subDivision: 'Information Technology', severity: 'medium', status: 'responded',
    dueDate: daysFromToday(15), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'David Chen', avatarUrl: '', id: 'USER#128' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Regulatory', subscope: 'Data Privacy', taskId: 'TSK-002',
    risk: 'IT TAX risks',
    createdAt: daysFromToday(-20),
    description:
      'Network access for 6 of 15 leavers in the review period was revoked between 3 and 9 days after their last working day, ' +
      'against a 24-hour policy requirement. Management has responded with a revised HR-to-IT notification process.',
    observationIds: ['EV-002', 'EV-005'],
    documents: [
      { name: 'leaver-access-review.xlsx', size: 76_000 },
    ],
  },
  {
    id: 'FND-022', title: 'Training records incomplete for mandatory compliance courses',
    assignedAuditor: TEAM_AUDITORS.carol,
    subDivision: 'Human Resources', severity: 'low', status: 'in-progress',
    dueDate: daysFromToday(20), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'Fatima Al Zaabi', avatarUrl: '', id: 'USER#129' },
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-006',
    risk: 'Risk in Human Resources',
    createdAt: daysFromToday(-26),
    description:
      'Completion records for the annual anti-money-laundering course were missing for 14% of staff in scope.',
    observationIds: ['EV-003'],
    documents: [],
  },
  {
    id: 'FND-023', title: 'Discount approvals exceed delegated authority limits',
    assignedAuditor: TEAM_AUDITORS.alice,
    subDivision: 'Finance & Accounting', severity: 'high', status: 'open',
    dueDate: daysFromToday(5), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 64000,
    owner: { fullName: 'Carlos Mendez', avatarUrl: '', id: 'USER#126' },
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio',
    scope: 'Risk Management', subscope: 'Operational Risk', taskId: 'TSK-001',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-40),
    description:
      'Store managers approved sales discounts of up to 35%, above their 15% delegated authority, on 9 transactions totalling AED 64,000.',
    observationIds: ['EV-001'],
    documents: [
      { name: 'discount-approval-sample.xlsx', size: 88_000 },
    ],
  },
  {
    id: 'FND-024', title: 'Duplicate vendor records in master file',
    assignedAuditor: TEAM_AUDITORS.david,
    subDivision: 'Procurement & Supply Chain', severity: 'medium', status: 'rejected',
    dueDate: daysFromToday(-10), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 0,
    owner: { fullName: 'James Okafor', avatarUrl: '', id: 'USER#124' },
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ',
    scope: 'Internal Audit', subscope: 'Operational Review', taskId: 'TSK-004',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-45),
    description:
      'Suspected duplicate vendor records were raised for review; management evidenced that the records belong to separate legal entities and the finding was rejected.',
    observationIds: ['EV-004'],
    documents: [],
  },
  {
    id: 'FND-025', title: 'Cash-in-transit handover not dual-signed',
    assignedAuditor: TEAM_AUDITORS.carol,
    subDivision: 'Operations', severity: 'low', status: 'verified',
    dueDate: daysFromToday(-5), daysOverdue: undefined,
    flaggedForEscalation: false, isRepeated: false,
    financialImpact: 3000,
    owner: { fullName: 'Marcus Johnson', avatarUrl: '', id: 'USER#132' },
    company: 'Desert Rose Retail Group', division: 'Dubai Mall Flagship',
    scope: 'Internal Audit', subscope: 'Financial Controls', taskId: 'TSK-003',
    risk: 'Risk related to accounts',
    createdAt: daysFromToday(-52),
    description:
      'Cash-in-transit handover sheets were signed by only the store cashier on 5 occasions. A dual-signature step has been added and verified by audit.',
    observationIds: ['EV-001'],
    documents: [],
  },
];

/* ── Mock data (internal-audit mode) ───────────────────────────────────────
 * Same findings as AUDIT_FIRM_MOCK_FINDINGS above (same ids, titles,
 * severities, statuses, dates, owners, descriptions, documents, etc.) — only
 * `company` / `branch` (division) / `department` (sub-division) / `scope` / `subscope` are overwritten
 * with real combos cycled from the ACTIVE internal-audit org's own directory
 * (ORG_STATIC_DATA_INTERNAL_AUDIT — see adapters/Org-data-internal-audit.ts),
 * so a KPI card, the findings list, and the finding-profile drawer all agree
 * with each other AND with the Company/Division/Sub-Division/Scope/Sub-Scope
 * filter dropdowns, for WHICHEVER org INTERNAL_AUDIT_CLIENT_KEY_VALUE picks
 * (DAR Exchange or XYZ Broadcast) — same reasoning as
 * observation-list.component.ts's internalAuditOrgFields()/
 * INTERNAL_AUDIT_SCOPE_COMBOS. This replaces the old DAR_DEPARTMENT_MAP,
 * which hardcoded DAR Exchange's company/division/sub-division names directly —
 * so switching INTERNAL_AUDIT_CLIENT_KEY_VALUE to 'xyz-broadcast' still left
 * every finding showing 'DAR Exchange' and its old division names instead of
 * XYZ Broadcast's real sub-divisions.
 * ────────────────────────────────────────────────────────────────────── */

interface OrgAssignmentCombo {
  company: string;
  division: string;
  subDivision: string;
  scope: string;
  subscope?: string;
}

/**
 * Flattens ORG_STATIC_DATA_INTERNAL_AUDIT into one {company, division,
 * subDivision, scope, subscope} combo per real top-level scope/sub-scope
 * pair — a scope with no sub-scopes yields one combo with subscope:
 * undefined; one with sub-scopes yields one combo per sub-scope instead.
 * Mirrors observation-list.component.ts's flattenScopeCombos().
 */
function flattenOrgAssignmentCombos(companies: typeof ORG_STATIC_DATA_INTERNAL_AUDIT): OrgAssignmentCombo[] {
  const combos: OrgAssignmentCombo[] = [];
  companies.forEach(company => company.divisions.forEach(division => division.subDivisions.forEach(subDivision => {
    subDivision.scopes.forEach(scope => {
      if (scope.subScopes?.length) {
        scope.subScopes.forEach(sub => combos.push({
          company: company.companyName, division: division.divisionName, subDivision: subDivision.subDivisionName,
          scope: scope.scopeName, subscope: sub.subScopeName,
        }));
      } else {
        combos.push({
          company: company.companyName, division: division.divisionName, subDivision: subDivision.subDivisionName,
          scope: scope.scopeName,
        });
      }
    });
  })));
  return combos;
}

const INTERNAL_AUDIT_ASSIGNMENT_COMBOS: OrgAssignmentCombo[] =
  CLIENT_MODE_VALUE === 'internal-audit' ? flattenOrgAssignmentCombos(ORG_STATIC_DATA_INTERNAL_AUDIT) : [];

function toInternalAuditFinding(f: RichAuditFinding, index: number): RichAuditFinding {
  if (INTERNAL_AUDIT_ASSIGNMENT_COMBOS.length === 0) return f;
  const assignment = INTERNAL_AUDIT_ASSIGNMENT_COMBOS[index % INTERNAL_AUDIT_ASSIGNMENT_COMBOS.length];
  return {
    ...f,
    company: assignment.company,
    division: assignment.division,
    subDivision: assignment.subDivision,
    scope: assignment.scope,
    subscope: assignment.subscope,
  };
}

const INTERNAL_AUDIT_MOCK_FINDINGS: RichAuditFinding[] = AUDIT_FIRM_MOCK_FINDINGS.map(toInternalAuditFinding);

/**
 * The array every consumer (`findings-list.component.ts`,
 * `audit-findings-tab.component.ts`) actually imports. Switches the same way
 * `CompanyDataService` switches `COMPANIES_SEED` — 'internal-audit' gets
 * the records above remapped onto the active org's real directory,
 * everything else keeps the original multi-company audit-firm mock data.
 * This is a plain data file
 * (not an injectable service), so it reads the exported CLIENT_MODE_VALUE
 * constant directly at module-load time rather than injecting the
 * CLIENT_MODE token.
 */
export const MOCK_FINDINGS: RichAuditFinding[] =
  CLIENT_MODE_VALUE === 'internal-audit' ? INTERNAL_AUDIT_MOCK_FINDINGS : AUDIT_FIRM_MOCK_FINDINGS;

/* ── Shared display helpers ───────────────────────────────────────────── */

export function severityLabel(s: FindingSeverity): string {
  return FINDING_SEVERITY_LABELS[s] ?? s;
}

export function statusLabel(s: FindingStatus): string {
  return FINDING_STATUS_LABELS[s] ?? s;
}

/**
 * Days a finding has been outstanding: the real `daysOverdue` figure for
 * overdue/escalated findings, or days elapsed since it was raised
 * (`createdAt`) otherwise. Used for both a findings table's "Age (days)"
 * column and an aging-bucket chart, so the two are never computed two
 * different ways.
 *
 * Note: the mock findings' `createdAt`/`dueDate` values assume "today" is
 * sometime around Q1–Q2 2026 — if the real current date is later than that,
 * every open finding's computed age will skew high (toward the oldest
 * bucket) until real data replaces these mock rows. Same caveat as
 * `audit-plan-data.ts`'s "upcoming audits" helper.
 */
export function findingAgeDays(f: RichAuditFinding, now: Date = new Date()): number {
  if (f.daysOverdue !== undefined) return f.daysOverdue;
  if (!f.createdAt) return 0;
  return Math.max(0, Math.floor((now.getTime() - f.createdAt.getTime()) / MS_PER_DAY));
}

/* ── Dashboard aggregation helpers ────────────────────────────────────────
   Everything below reads `MOCK_FINDINGS` (or whatever finding array is
   passed in — swap the argument for a real API result later) and reduces it
   into the shapes the Audit Findings dashboard's KPI cards / charts need.
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Statuses that count as "still active / not yet resolved" for KPI-level
 * cards and charts (Open Findings count, severity pie, aging chart, etc).
 * This is the BROAD sense of "open" — everything except `closed` and
 * `rejected`. It's deliberately different from the single literal status
 * value `'open'` (one specific status among eight): a finding that's
 * `in-progress`, `responded`, `verified`, `overdue`, or `escalated` hasn't
 * been closed out yet either, and KPI cards/charts that claim to summarise
 * "open findings" need to include them or they under-count and disagree
 * with what a user can see by eye in the findings list (e.g. 3 medium-
 * severity findings sitting in `responded`/`verified`/`in-progress` used to
 * vanish from the "Open Findings by Severity" pie entirely under the old,
 * narrower `status === 'open'` filter).
 *
 * ACTIVE_STATUSES itself now lives in ./constants/findings.constants.ts and is
 * re-exported above.
 */

export function isOpenFinding(f: RichAuditFinding): boolean {
  return !CLOSED_STATUSES.includes(f.status);
}

/** Same broad "open" test as `isOpenFinding`, applied to a display row's
 *  already-stringified `statusClass` (which holds the same `FindingStatus`
 *  value) — used where a component only has the flattened `FindingRowLike`
 *  shape, not the original `RichAuditFinding`. */
export function isOpenStatusClass(statusClass: string): boolean {
  return !(CLOSED_STATUSES as string[]).includes(statusClass);
}

/**
 * The NARROW "open" test — exactly the literal `'open'` status, not the
 * broader "not yet closed" set `isOpenFinding` covers. Used by the Audit
 * Findings *dashboard*'s "Open Findings" KPI and the severity pie / aging
 * chart / "Critical-High Open" count it feeds, so those numbers agree with
 * the "Findings by Sub-Division" chart's own `status === 'open'` bucket (see
 * `getSubDivisionStatusBreakdown` below) instead of silently folding in-progress/
 * overdue/escalated findings into "open" the way the findings LIST page's
 * Open/Closed side-stat intentionally does via `isOpenFinding`.
 */
export function isStrictlyOpenFinding(f: RichAuditFinding): boolean {
  return f.status === FindingStatuses.Open;
}

export interface FindingKpiSummary {
  total: number;
  open: number;
  closed: number;
  overdue: number;
  repeated: number;
  criticalHighOpen: number;
  closureRatePct: number;
}

export function getFindingKpiSummary(findings: RichAuditFinding[]): FindingKpiSummary {
  const total    = findings.length;
  const open     = findings.filter(isStrictlyOpenFinding).length;
  const closed   = findings.filter(f => CLOSED_STATUSES.includes(f.status)).length;
  const overdue  = findings.filter(f => OVERDUE_STATUSES.includes(f.status)).length;
  const repeated = findings.filter(f => f.isRepeated).length;
  // Broad "open" on purpose (see `isOpenFinding`) — unlike the "Open Findings"
  // KPI above, "Critical/High Open" means any not-yet-closed critical/high
  // finding (risk still outstanding), so overdue/in-progress/etc. count too.
  const criticalHighOpen = findings.filter(
    f => isOpenFinding(f) && CRITICAL_HIGH_SEVERITIES.includes(f.severity),
  ).length;
  return {
    total, open, closed, overdue, repeated, criticalHighOpen,
    closureRatePct: total ? Math.round((closed / total) * 100) : 0,
  };
}

/** Severity breakdown of OPEN findings only (narrow `status === 'open'`
 *  sense — see `isStrictlyOpenFinding`), in the fixed Critical/High/Medium
 *  order the pie's legend swatches use. A Low-severity open finding, if one
 *  ever appears, won't get its own slice — same constraint the legend
 *  already had (it only defines 3 swatches). */
export function getOpenSeverityBreakdown(findings: RichAuditFinding[]): { labels: string[]; data: number[] } {
  const open = findings.filter(isStrictlyOpenFinding);
  return {
    labels: OPEN_SEVERITY_PIE_SEVERITIES.map(s => FINDING_SEVERITY_LABELS[s]),
    data: OPEN_SEVERITY_PIE_SEVERITIES.map(s => open.filter(f => f.severity === s).length),
  };
}

/** Buckets OPEN findings (narrow `status === 'open'` sense — see
 *  `isStrictlyOpenFinding`) by `findingAgeDays` into the given boundaries
 *  (only `min`/`max` are read, so this accepts the host component's own
 *  `AgingBucket` type without this file needing to import it). */
export function getOpenAgingCounts(
  findings: RichAuditFinding[],
  buckets: { min: number; max: number | null }[],
  now: Date = new Date(),
): number[] {
  const open = findings.filter(isStrictlyOpenFinding);
  return buckets.map(b => open.filter(f => {
    const age = findingAgeDays(f, now);
    return age >= b.min && (b.max === null || age <= b.max);
  }).length);
}

export function getDistinctCompanies(findings: RichAuditFinding[]): string[] {
  const seen: string[] = [];
  for (const f of findings) if (f.company && !seen.includes(f.company)) seen.push(f.company);
  return seen;
}

export function getDistinctSubDivisions(findings: RichAuditFinding[]): string[] {
  const seen: string[] = [];
  for (const f of findings) if (!seen.includes(f.subDivision)) seen.push(f.subDivision);
  return seen;
}

export interface SubDivisionStatusBreakdown {
  subDivision: string;
  open: number;
  overdue: number;
  closed: number;
  inProgress: number;
}

/** The level a finding was raised at: a whole division (when the division has
 *  no sub-divisions) or one sub-division of a division. */
export interface FindingUnit {
  division: string;
  /** null when the finding sits on the division itself. */
  subDivision: string | null;
}

/** Divisions flagged `hasSubDivision: false` in the active org directory,
 *  keyed `company\u0000division` — audited (and so raising findings) as a whole. */
const DIVISION_LEVEL_KEYS = new Set(
  (CLIENT_MODE_VALUE === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA)
    .flatMap(c => c.divisions
      .filter(d => d.hasSubDivision === false)
      .map(d => `${c.companyName}\u0000${d.divisionName}`)),
);

/**
 * Where a finding actually sits. A finding on a division flagged
 * `hasSubDivision: false` (or with no sub-division recorded) belongs to the
 * division itself — any `subDivision` it still carries is ignored, same rule
 * `withDivisionLevel` applies to audit plans in audit-plan-data.ts.
 */
export function getFindingUnit(f: { company?: string; division?: string; subDivision?: string | null }): FindingUnit {
  const division = f.division || FINDING_UNASSIGNED_LABEL;
  const divisionLevel = !f.subDivision || DIVISION_LEVEL_KEYS.has(`${f.company ?? ''}\u0000${division}`);
  return { division, subDivision: divisionLevel ? null : f.subDivision! };
}

/** Same 4 display buckets as `getSubDivisionStatusBreakdown` (see its doc comment). */
function bucketStatuses(findings: RichAuditFinding[]): Omit<SubDivisionStatusBreakdown, 'subDivision'> {
  return {
    open:       findings.filter(f => f.status === FindingStatuses.Open).length,
    overdue:    findings.filter(f => OVERDUE_STATUSES.includes(f.status)).length,
    closed:     findings.filter(f => CLOSED_STATUSES.includes(f.status)).length,
    inProgress: findings.filter(f => IN_PROGRESS_BUCKET_STATUSES.includes(f.status)).length,
  };
}

export interface FindingUnitStatusBreakdown extends Omit<SubDivisionStatusBreakdown, 'subDivision'> {
  unit: FindingUnit;
}

/**
 * Per-unit finding counts in the same 4 status buckets, for either view of
 * the "Findings by …" chart. The two views split the findings between them —
 * each finding lands in exactly one (see `getFindingUnit`):
 *  - 'division': only division-level findings — one entry per division
 *    audited as a whole (no sub-divisions).
 *  - 'subDivision': only sub-division findings — one entry per sub-division,
 *    keyed by its division too, so same-named sub-divisions of different
 *    divisions never merge.
 * Units keep first-appearance order, sub-divisions grouped by division.
 */
export function getFindingStatusBreakdownByUnit(
  findings: RichAuditFinding[],
  view: 'division' | 'subDivision',
): FindingUnitStatusBreakdown[] {
  const inView = findings
    .map(f => ({ f, u: getFindingUnit(f) }))
    .filter(({ u }) => (view === 'division') === (u.subDivision === null));

  const unitsByDivision = new Map<string, FindingUnit[]>();
  for (const { u } of inView) {
    const list = unitsByDivision.get(u.division) ?? [];
    unitsByDivision.set(u.division, list);
    if (!list.some(x => x.subDivision === u.subDivision)) list.push(u);
  }
  const units = [...unitsByDivision.values()].flat();

  return units.map(unit => ({
    unit,
    ...bucketStatuses(inView
      .filter(({ u }) => u.division === unit.division && u.subDivision === unit.subDivision)
      .map(({ f }) => f)),
  }));
}

/**
 * Per-sub-division finding counts bucketed into 4 DISPLAY buckets — Open /
 * Overdue / Closed / In Progress. This is a coarser grouping than the KPI
 * summary's exact predicates: the other `FindingStatus` values not covered
 * by "open" / "overdue-or-escalated" / "closed" (namely in-progress,
 * responded, verified, and rejected) all have to land somewhere for this
 * chart's stacked bar to actually sum to the true total, so they're grouped
 * into "In Progress" (with `rejected` folded into "Closed" — no further
 * action pending, same as a closed finding). This bucketing exists ONLY for
 * this chart's segments; it doesn't change what counts as "open" or
 * "closed" for `getFindingKpiSummary`.
 */
export function getSubDivisionStatusBreakdown(findings: RichAuditFinding[], subDivisions: string[]): SubDivisionStatusBreakdown[] {
  return subDivisions.map(subDivision => {
    const subDivisionFindings = findings.filter(f => f.subDivision === subDivision);
    return { subDivision, ...bucketStatuses(subDivisionFindings) };
  });
}

/** Flat display shape `audit-findings-tab.component.ts`'s table/KPI cards
 *  expect (mirrors that component's own local `FindingRow` interface — kept
 *  here, next to the data it maps, instead of duplicated per caller). */
export interface FindingRowLike {
  id: string;
  finding: string;
  company: string;
  division?: string;
  scope: string;
  subscope?: string;
  subDivision: string;
  severity: string;
  severityClass: string;
  status: string;
  statusClass: string;
  dueDate: string;
  ageDays: number;
  repeated: boolean;
}

export function toFindingRow(f: RichAuditFinding, now: Date = new Date()): FindingRowLike {
  return {
    id: f.id,
    finding: f.title,
    company: f.company ?? FINDING_UNASSIGNED_LABEL,
    division: f.division,
    scope: f.scope ?? FINDING_EMPTY_VALUE,
    subscope: f.subscope,
    subDivision: f.subDivision,
    severity: severityLabel(f.severity),
    severityClass: f.severity,
    status: statusLabel(f.status),
    statusClass: f.status,
    dueDate: f.dueDate.toISOString().slice(0, 10),
    ageDays: findingAgeDays(f, now),
    repeated: f.isRepeated ?? false,
  };
}