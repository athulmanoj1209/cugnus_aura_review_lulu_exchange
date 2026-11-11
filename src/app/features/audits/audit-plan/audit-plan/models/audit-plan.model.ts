/** ------------------------------------------------------------------
 *  Audit Plan — domain model
 *  Only depends on the module's constants: it is imported by service,
 *  store and every presentational component.
 * ------------------------------------------------------------------ */

import { Frequencies, InstanceStatuses, RUNS_PER_MONTH } from '../constants/audit-plan.constants';
import type { Frequency, InstanceStatus, RiskRating } from '../constants/audit-plan.constants';

// Value sets & static metadata live in ../constants; re-exported so existing importers keep working.
export type { Frequency, InstanceStatus, PlanView, RiskRating } from '../constants/audit-plan.constants';
export { FREQ_COLOR, FREQ_LABELS, MONTHS, STATUS_META } from '../constants/audit-plan-labels.constants';
export type { StatusMeta } from '../constants/audit-plan-labels.constants';

export interface ScopeJob {
  id: string;
  name: string;
  auditor: string;
  hrs: number;
  /**
   * For weekly/bi-weekly scopes: 1-based run this job belongs to
   * (e.g. run: 2 = executed in week/run 2 only).
   * Omit for jobs that repeat every run — and for M/Q/HY/Y scopes.
   */
  run?: number;
}

export interface AuditScope {
  id: string;
  code: string;
  name: string;
  freq: Frequency;
  auditor: string;
  /** team members who execute the audit work */
  preparers: string[];
  /** team members who review & sign off */
  reviewers: string[];
  risk: RiskRating;
  rfi: number;
  findings: number;
  /** planned start day-of-month (calendar placement) */
  day: number;
  /** index 0-11 = Jan-Dec; null = not scheduled */
  months: (InstanceStatus | null)[];
  jobs: ScopeJob[];
}

export interface Department {
  id: string;
  name: string;
  /** Company this department belongs to — used by the selector page filter */
  companyId?: string;
  /** True when this lane is a whole division (its division is flagged `hasSubDivision: false`), not a sub-division. */
  isDivisionLevel?: boolean;
  scopes: AuditScope[];
}

export interface PlanFilter {
  dept: string[];
  freq: Frequency[];
  status: InstanceStatus[];
  search: string;
}

/** reference to one audit instance (scope × month), optionally one job */
export interface InstanceRef {
  scopeId: string;
  monthIndex: number;
  jobId?: string;
}

/** Audit plan header — created / edited via the manage drawer */
export interface AuditPlanHeader {
  id: string;
  companyId: string;
  divisionCode: string;
  /** Optional — empty / omitted means the plan covers the whole division. */
  subDivisionCodes?: string[];
  planName: string;
  periodFrom: Date;
  periodTo: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ---------------- pure domain helpers ---------------- */

/** Weekly = 4 runs/month, Bi-weekly = 2, everything else = 1 */
export function runsPerMonth(freq: Frequency): number {
  return freq === Frequencies.Weekly ? RUNS_PER_MONTH[Frequencies.Weekly]
    : freq === Frequencies.BiWeekly ? RUNS_PER_MONTH[Frequencies.BiWeekly]
    : RUNS_PER_MONTH.Default;
}

/** Derive per-run statuses from the month's overall status. */
export function runStatuses(st: InstanceStatus, n: number): InstanceStatus[] {
  if (n === 1) return [st];
  if (st === InstanceStatuses.InProgress) {
    const k = Math.floor(n / 2);
    return Array.from({ length: n }, (_, i) =>
      (i < k ? InstanceStatuses.Completed : i === k ? InstanceStatuses.InProgress : InstanceStatuses.Planned));
  }
  if (st === InstanceStatuses.Overdue) {
    return Array.from({ length: n }, (_, i) => (i === n - 1 ? InstanceStatuses.Overdue : InstanceStatuses.Completed));
  }
  return Array<InstanceStatus>(n).fill(st);
}

/** Derive a job's status from its scope-instance status and job index. */
export function jobStatus(scopeSt: InstanceStatus, ji: number): InstanceStatus {
  if (scopeSt === InstanceStatuses.InProgress)
    return ji === 0 ? InstanceStatuses.Completed : ji === 1 ? InstanceStatuses.InProgress : InstanceStatuses.Planned;
  if (scopeSt === InstanceStatuses.Overdue) return ji === 0 ? InstanceStatuses.Overdue : InstanceStatuses.Planned;
  return scopeSt;
}

/** Jobs executed in a given run (0-based index): run-specific jobs + jobs that repeat every run. */
export function jobsForRun(scope: AuditScope, runIndex: number): ScopeJob[] {
  return scope.jobs.filter(j => j.run === undefined || j.run === runIndex + 1);
}




type ScopeSeed = Omit<AuditScope, 'preparers' | 'reviewers'>;
type DeptSeed = Omit<Department, 'scopes'> & { scopes: ScopeSeed[] };
 
const BASE: DeptSeed[] = [
  {
    id: 'fin', name: 'Finance / Accounts',
    scopes: [
      { id: 's1', code: 'FIN-01', name: 'Governance', freq: 'Q', auditor: 'A. Rahman', risk: 'High', rfi: 3, findings: 2, day: 9,
        months: [null,'completed',null,'completed',null,null,'inprog',null,null,'planned',null,null],
        jobs: [
          { id: 'j1', name: 'Board & committee minutes review', auditor: 'A. Rahman', hrs: 8 },
          { id: 'j2', name: 'Delegation of authority check', auditor: 'S. Lee', hrs: 6 },
          { id: 'j3', name: 'Policy approval matrix testing', auditor: 'A. Rahman', hrs: 4 },
        ] },
      { id: 's2', code: 'FIN-02', name: 'Internal controls', freq: 'M', auditor: 'S. Lee', risk: 'Medium', rfi: 2, findings: 1, day: 3,
        months: ['completed','completed','completed','completed','completed','completed','inprog','planned','planned','planned','planned','planned'],
        jobs: [
          { id: 'j4', name: 'Control design walkthrough', auditor: 'S. Lee', hrs: 6 },
          { id: 'j5', name: 'Sample-based control testing', auditor: 'A. Rahman', hrs: 10 },
          { id: 'j6', name: 'Exception follow-up', auditor: 'S. Lee', hrs: 3 },
        ] },
      { id: 's3', code: 'FIN-03', name: 'Income & expenditure', freq: 'Q', auditor: 'A. Rahman', risk: 'Medium', rfi: 1, findings: 0, day: 15,
        months: [null,'completed',null,null,null,'completed',null,null,'planned',null,null,null],
        jobs: [
          { id: 'j7', name: 'Revenue cut-off testing', auditor: 'A. Rahman', hrs: 8 },
          { id: 'j8', name: 'Expense vouching & approvals', auditor: 'S. Lee', hrs: 8 },
        ] },
      { id: 's4', code: 'FIN-04', name: 'Budget evaluation', freq: 'HY', auditor: 'S. Lee', risk: 'Low', rfi: 1, findings: 0, day: 22,
        months: [null,null,'completed',null,null,null,null,null,'planned',null,null,null],
        jobs: [
          { id: 'j9', name: 'Budget variance analysis', auditor: 'S. Lee', hrs: 6 },
          { id: 'j10', name: 'Forecast reasonableness review', auditor: 'A. Rahman', hrs: 5 },
        ] },
      { id: 's14', code: 'FIN-05', name: 'Cash count verification', freq: 'W', auditor: 'S. Lee', risk: 'Medium', rfi: 0, findings: 1, day: 2,
        months: ['completed','completed','completed','completed','overdue','completed','inprog','planned','planned','planned','planned','planned'],
        jobs: [
          // one distinct procedure per week (run 1-4)
          { id: 'j32', name: 'Vault & teller cash count', auditor: 'S. Lee', hrs: 2, run: 1 },
          { id: 'j33', name: 'Denomination reconciliation', auditor: 'A. Rahman', hrs: 1, run: 2 },
          { id: 'j36', name: 'ATM cash balancing', auditor: 'S. Lee', hrs: 2, run: 3 },
          { id: 'j37', name: 'Petty cash spot check', auditor: 'K. Menon', hrs: 1, run: 4 },
        ] },
    ],
  },
  {
    id: 'aml', name: 'AML CFT Compliance',
    scopes: [
      { id: 's5', code: 'AML-01', name: 'Regulatory compliance', freq: 'M', auditor: 'M. Khan', risk: 'High', rfi: 4, findings: 3, day: 5,
        months: ['completed','completed','completed','completed','completed','completed','inprog','planned','planned','planned','planned','planned'],
        jobs: [
          { id: 'j11', name: 'CBUAE returns verification', auditor: 'M. Khan', hrs: 6 },
          { id: 'j12', name: 'Regulatory breach register review', auditor: 'P. Nair', hrs: 4 },
          { id: 'j13', name: 'Staff training compliance check', auditor: 'M. Khan', hrs: 3 },
        ] },
      { id: 's6', code: 'AML-02', name: 'TMS & sanctions check', freq: 'Q', auditor: 'M. Khan', risk: 'High', rfi: 2, findings: 2, day: 12,
        months: ['completed',null,null,'completed',null,null,'inprog',null,null,'planned',null,null],
        jobs: [
          { id: 'j14', name: 'Alert disposition sampling', auditor: 'M. Khan', hrs: 10 },
          { id: 'j15', name: 'Sanctions list update verification', auditor: 'P. Nair', hrs: 4 },
        ] },
      { id: 's7', code: 'AML-03', name: 'General compliance', freq: 'M', auditor: 'P. Nair', risk: 'Medium', rfi: 2, findings: 1, day: 18,
        months: ['completed','completed','completed','overdue','completed','completed','planned','planned','planned','planned','planned','planned'],
        jobs: [
          { id: 'j16', name: 'KYC file review', auditor: 'P. Nair', hrs: 8 },
          { id: 'j17', name: 'Periodic refresh tracking', auditor: 'M. Khan', hrs: 4 },
        ] },
    ],
  },
  {
    id: 'it', name: 'IT / Administration',
    scopes: [
      { id: 's8', code: 'IT-01', name: 'System audit', freq: 'Q', auditor: 'D. Tan', risk: 'High', rfi: 3, findings: 2, day: 7,
        months: ['completed',null,null,'completed',null,null,'inprog',null,null,'planned',null,null],
        jobs: [
          { id: 'j18', name: 'User access rights review', auditor: 'D. Tan', hrs: 8 },
          { id: 'j19', name: 'Change management log check', auditor: 'J. Park', hrs: 6 },
          { id: 'j20', name: 'Backup & restore test', auditor: 'D. Tan', hrs: 5 },
        ] },
      { id: 's9', code: 'IT-02', name: 'Quality assurance', freq: 'HY', auditor: 'D. Tan', risk: 'Medium', rfi: 1, findings: 0, day: 20,
        months: [null,null,'completed',null,null,null,null,null,'planned',null,null,null],
        jobs: [
          { id: 'j21', name: 'SLA compliance check', auditor: 'D. Tan', hrs: 5 },
          { id: 'j22', name: 'Process quality sampling', auditor: 'J. Park', hrs: 6 },
        ] },
      { id: 's10', code: 'IT-03', name: 'Performance evaluation', freq: 'Y', auditor: 'J. Park', risk: 'Low', rfi: 1, findings: 0, day: 25,
        months: [null,null,null,null,null,'completed',null,null,null,null,null,null],
        jobs: [
          { id: 'j23', name: 'KPI validation', auditor: 'J. Park', hrs: 6 },
          { id: 'j24', name: 'Appraisal process review', auditor: 'D. Tan', hrs: 4 },
        ] },
    ],
  },
  {
    id: 'ops', name: 'Operations & Other',
    scopes: [
      { id: 's11', code: 'OPS-01', name: 'Customer service', freq: 'Q', auditor: 'R. Ahmed', risk: 'Medium', rfi: 2, findings: 1, day: 10,
        months: ['completed',null,null,'completed',null,null,'inprog',null,null,'planned',null,null],
        jobs: [
          { id: 'j25', name: 'Complaint register review', auditor: 'R. Ahmed', hrs: 5 },
          { id: 'j26', name: 'Mystery shopping results check', auditor: 'F. Cruz', hrs: 4 },
        ] },
      { id: 's12', code: 'OPS-02', name: 'Treasury dealings', freq: 'M', auditor: 'R. Ahmed', risk: 'High', rfi: 3, findings: 2, day: 14,
        months: ['completed','completed','completed','completed','completed','inprog','planned','planned','planned','planned','planned','planned'],
        jobs: [
          { id: 'j27', name: 'Deal confirmation matching', auditor: 'R. Ahmed', hrs: 8 },
          { id: 'j28', name: 'Limit breach review', auditor: 'F. Cruz', hrs: 5 },
          { id: 'j29', name: 'Portfolio revaluation check', auditor: 'R. Ahmed', hrs: 6 },
        ] },
      { id: 's13', code: 'OPS-03', name: 'Follow-up audit', freq: 'Q', auditor: 'F. Cruz', risk: 'Medium', rfi: 1, findings: 1, day: 27,
        months: ['completed',null,null,'overdue',null,null,'planned',null,null,'planned',null,null],
        jobs: [
          { id: 'j30', name: 'Prior findings verification', auditor: 'F. Cruz', hrs: 6 },
          { id: 'j31', name: 'Action plan status tracking', auditor: 'R. Ahmed', hrs: 4 },
        ] },
      { id: 's15', code: 'OPS-04', name: 'Branch security walkthrough', freq: 'BW', auditor: 'F. Cruz', risk: 'Low', rfi: 1, findings: 0, day: 6,
        months: ['completed','completed','completed','completed','completed','completed','inprog','planned','planned','planned','planned','planned'],
        jobs: [
          // one distinct procedure per bi-weekly run
          { id: 'j34', name: 'Physical access checkpoint review', auditor: 'F. Cruz', hrs: 2, run: 1 },
          { id: 'j35', name: 'CCTV & alarm functionality check', auditor: 'R. Ahmed', hrs: 2, run: 2 },
        ] },
    ],
  },
];
 
/** preparer / reviewer assignments per scope */
const TEAM: Record<string, { preparers: string[]; reviewers: string[] }> = {
  s1:  { preparers: ['S. Lee', 'K. Menon'],    reviewers: ['A. Rahman'] },
  s2:  { preparers: ['A. Rahman'],             reviewers: ['S. Lee', 'V. Pillai'] },
  s3:  { preparers: ['S. Lee'],                reviewers: ['A. Rahman'] },
  s4:  { preparers: ['A. Rahman', 'K. Menon'], reviewers: ['S. Lee'] },
  s14: { preparers: ['K. Menon'],              reviewers: ['S. Lee'] },
  s5:  { preparers: ['P. Nair', 'T. Iqbal'],   reviewers: ['M. Khan'] },
  s6:  { preparers: ['P. Nair'],               reviewers: ['M. Khan', 'V. Pillai'] },
  s7:  { preparers: ['T. Iqbal'],              reviewers: ['P. Nair'] },
  s8:  { preparers: ['J. Park', 'L. Wong'],    reviewers: ['D. Tan'] },
  s9:  { preparers: ['J. Park'],               reviewers: ['D. Tan'] },
  s10: { preparers: ['L. Wong'],               reviewers: ['J. Park'] },
  s11: { preparers: ['F. Cruz'],               reviewers: ['R. Ahmed'] },
  s12: { preparers: ['F. Cruz', 'N. Das'],     reviewers: ['R. Ahmed', 'V. Pillai'] },
  s13: { preparers: ['N. Das'],                reviewers: ['F. Cruz'] },
  s15: { preparers: ['N. Das'],                reviewers: ['R. Ahmed'] },
};
 
/** Sample FY-2026 plan. Replace with API payload — shape is identical. */
export const AUDIT_PLAN_MOCK: Department[] = BASE.map(dept => ({
  ...dept,
  scopes: dept.scopes.map(scope => ({
    ...scope,
    ...(TEAM[scope.id] ?? { preparers: [scope.auditor], reviewers: [] }),
  })),
}));
 
/* ------------------------------------------------------------------
 * Company-wise plans. Keys match the `company` query param sent by
 * the selector page (audit-plan-selector COMPANIES ids). Unknown or
 * missing companyId falls back to the full plan.
 * Replace with per-company API payloads later.
 * ------------------------------------------------------------------ */
const pick = (...deptIds: string[]): Department[] =>
  AUDIT_PLAN_MOCK.filter(d => deptIds.includes(d.id));
 
export const AUDIT_PLAN_MOCK_BY_COMPANY: Record<string, Department[]> = {
  'crowe-uae':       AUDIT_PLAN_MOCK,                 // head office — full plan
  'crowe-ksa':       pick('fin', 'aml', 'ops'),
  'crowe-bahrain':   pick('fin', 'it'),
  'crowe-kuwait':    pick('aml', 'ops'),
  'crowe-qatar':     pick('fin', 'ops'),
  'crowe-oman':      pick('it', 'ops'),
  'crowe-egypt':     pick('fin', 'aml'),
  'crowe-jordan':    pick('aml', 'it'),
  'crowe-lebanon':   pick('fin'),
  'crowe-india':     AUDIT_PLAN_MOCK,
  'crowe-pakistan':  pick('fin', 'it', 'ops'),
  'crowe-singapore': pick('aml', 'it', 'ops'),
};
 