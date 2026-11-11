import { signal } from '@angular/core';
import {
  Risk, RiskType, RiskFile, ControlEffectiveness, RiskStatus,
  calcInherent, calcResidualScore, calcResidualLevel,
} from './models/risk.model';
// PendingRisk.riskRating keeps the broader 'critical' | 'high' | 'medium' |
// 'low' union the Risk Approvals page's stat cards / filters / CSS
// (stat-card--critical, risk--critical, etc.) expect — ResidualLevel alone
// ('high' | 'medium' | 'low') has no 'critical' member, so comparisons like
// `i.riskRating === 'critical'` would be a type error against it.
import { RiskRating } from '@/app/features/audits/audit-execution/observation/list/observation-list.component';
import {
  CLIENT_MODE_VALUE, INTERNAL_AUDIT_CLIENT_KEY_VALUE, type InternalAuditClientKey,
} from '@/app/core/config/client-mode';
import { XYZ_BROADCAST_RISKS } from './risk-shared-xyz-data';
import { LULU_EXCHANGE_RISKS } from './risk-shared-lulu-data';
import { RiskResidualLevels } from './constants/risk.constants';
import { RISK_DEFAULT_CATEGORY_LABEL, RISK_TYPE_CATEGORY_LABELS } from './constants/risk-labels.constants';

/* ──────────────────────────────────────────────────────────────────────
 * Shared risk store
 * ──────────────────────────────────────────────────────────────────────
 * The Risk Register is the single source of truth for every risk in the
 * system. Risk Approvals (risk-approval-pending-list.component.ts) no
 * longer keeps its own, separate mock list of "pending" risks — it derives
 * its queue directly from this signal (risks whose status is 'open'), so
 * the two pages can never show different data for the same risk.
 *
 * Both risk-register-list.component.ts and risk-approval-pending-list.
 * component.ts import `risksStore` from here instead of declaring their
 * own local risk arrays. (NEW FILE — place it alongside company-org-data.ts,
 * i.e. one level up from both the risk-register-list/ and
 * risk-approval-pending-list/ folders. Adjust the './models/risk.model'
 * import path below if your project's models folder lives elsewhere.)
 * ──────────────────────────────────────────────────────────────────── */

/** Pending-approval queue item shape, as consumed by the Risk Approvals page. */
export interface PendingRisk {
  id:            string;
  title:         string;
  description:   string;
  riskRating:    RiskRating;
  category:      string;
  likelihood:    string;
  impact:        string;
  status:        RiskStatus;
  submittedBy:   string;
  submittedDate: Date;
  company:       string;
  division:      string;
  subDivision:   string;
  dueDate?:      Date;
}

/* ── Mock data (moved here from risk-register-list.component.ts so both
 *    pages share one array instead of keeping two out of sync) ──────── */

/**
 * Mock supporting files (risk register evidence).
 * `url` is undefined here, so the detail drawer shows them with the
 * download button disabled. Point `url` at a real/hosted file (or keep
 * the in-memory `file` blob from the add-risk upload) to enable download.
 */
function mockFiles(...specs: [name: string, sizeKb: number][]): RiskFile[] {
  return specs.map(([name, kb]) => ({ name, size: kb * 1024, url: 'images/avatars/default-avatar.jpg' }));
}

function makeRisk(
  id: string, type: RiskType, title: string, desc: string,
  company: string, branch: string, dept: string,
  impact: number, likelihood: number, ce: ControlEffectiveness,
  owner: string, status: RiskStatus, scopes: string[], findings: string[], obs: string[],
  files: RiskFile[] = [],
): Risk {
  const inherent = calcInherent(impact, likelihood);
  const residual = calcResidualScore(inherent, ce);
  return {
    id, riskType: type, title, description: desc,
    company, division: branch, subDivision: dept,
    impact, likelihood, inherentScore: inherent,
    keyControls: 'Documented policy in place. Quarterly review scheduled.',
    controlEffectiveness: ce, residualScore: residual,
    residualLevel: calcResidualLevel(residual),
    owner, dateIdentified: new Date('2025-01-10'),
    lastUpdated: new Date('2025-04-01'), status,
    linkedScopes: scopes, linkedFindings: findings, linkedObservations: obs,
    supportingFiles: files,
  };
}

const CYGNUS_AURA_RISKS: Risk[] = [
  makeRisk('RSK-001','financial','Unreconciled GL entries','General ledger accounts are not reconciled on a timely basis.',
    'Cygnus Aura','Dubai HQ','Finance',4,4,'moderate','Finance Manager','open',['Internal Audit'],['F-012'],['OBS-001'],
    mockFiles(['GL_Reconciliation_Review_Q1.xlsx', 342], ['Risk_Register_Extract_RSK001.pdf', 178])),
  makeRisk('RSK-002','it','Unauthorised system access','Lack of periodic access reviews allows terminated employees to retain access.',
    'Cygnus Aura','Dubai HQ','IT',5,3,'weak','IT Manager','open',['Internal Audit'],['F-005'],['OBS-002'],
    mockFiles(['User_Access_Review_Evidence.docx', 96], ['Terminated_Users_Report.xlsx', 214], ['Access_Policy_v3.pdf', 512])),
  makeRisk('RSK-003','compliance','Non-compliance with HR labour laws','HR policies have not been updated following 2024 regulatory amendments.',
    'Cygnus Aura','Abu Dhabi Branch','HR',3,4,'strong','HR Director','monitored',['External Audit'],['F-021'],['OBS-003'],
    mockFiles(['HR_Policy_Gap_Analysis.pdf', 267])),
  makeRisk('RSK-004','operational','Delayed security patching','Critical system patches are applied outside the 14-day SLA.',
    'Subsidiary Co.','Abu Dhabi Branch','IT',4,3,'moderate','IT Security Lead','open',['Internal Audit'],['F-034'],['OBS-004'],
    mockFiles(['Patch_SLA_Breach_Log.xlsx', 189], ['Vulnerability_Scan_Mar25.pdf', 954])),
  makeRisk('RSK-005','aml_cft','Inadequate vendor due diligence','Vendor contracts lack AML/CFT screening clauses.',
    'Subsidiary Co.','Sharjah Branch','Compliance',3,3,'strong','Compliance Officer','monitored',['Regulatory'],['F-008'],['OBS-005'],
    mockFiles(['Vendor_DD_Checklist.docx', 74])),
  makeRisk('RSK-006','reputational','Data breach from weak access controls','Customer data could be exposed due to insufficient access control policies.',
    'Cygnus Aura','Dubai HQ','IT',5,4,'weak','CISO','open',[],[],[],
    mockFiles(['Data_Classification_Matrix.xlsx', 156], ['Incident_Response_Plan.pdf', 730])),
  makeRisk('RSK-007','strategic','Over-reliance on single vendor','Critical infrastructure depends on a single cloud provider with no failover.',
    'Subsidiary Co.','Sharjah Branch','Operations',4,2,'moderate','COO','open',[],[],[]),
];

/**
 * Internal-audit mode mock risks — single-company "DAR Exchange" data.
 * company/branch/department values here are deliberately kept identical
 * (string-for-string) to COMPANIES_SEED / BRANCH_INDI_ORG_COMPANIES /
 * DEPARTMENT_INDI_ORG_COMPANIES (company-static-indi-org.data.ts,
 * branch-static-indi-org.data.ts, department-static-indi-org.data.ts) so
 * the Risk Register's Company/Division/Sub-Division filters actually match
 * these records. One risk per department, including both of OPS's nested
 * "BRANCH 1" / "BRANCH 2" departments.
 */
const DAR_EXCHANGE_RISKS: Risk[] = [
  makeRisk('RSK-001','financial','Unreconciled GL entries','General ledger accounts are not reconciled on a timely basis.',
    'DAR Exchange','Finance','Finance',4,4,'moderate','Finance Manager','open',['Internal Audit'],['F-012'],['OBS-001'],
    mockFiles(['GL_Reconciliation_Review_Q1.xlsx', 342], ['Risk_Register_Extract_RSK001.pdf', 178])),
  makeRisk('RSK-002','it','Unauthorised system access','Lack of periodic access reviews allows terminated employees to retain access.',
    'DAR Exchange','IT','IT',5,3,'weak','IT Manager','open',['Internal Audit'],['F-005'],['OBS-002'],
    mockFiles(['User_Access_Review_Evidence.docx', 96], ['Terminated_Users_Report.xlsx', 214], ['Access_Policy_v3.pdf', 512])),
  makeRisk('RSK-003','compliance','Non-compliance with HR labour laws','HR policies have not been updated following 2024 regulatory amendments.',
    'DAR Exchange','HR Dept','HR Dept',3,4,'strong','HR Director','monitored',['External Audit'],['F-021'],['OBS-003'],
    mockFiles(['HR_Policy_Gap_Analysis.pdf', 267])),
  makeRisk('RSK-004','operational','Delayed transaction processing at branch operations','Branch-level transactions are not processed within agreed turnaround times.',
    'DAR Exchange','OPS','BRANCH 1',4,3,'moderate','Operations Manager','open',['Internal Audit'],['F-034'],['OBS-004'],
    mockFiles(['Turnaround_Time_Log.xlsx', 189])),
  makeRisk('RSK-005','aml_cft','Inadequate vendor due diligence','Vendor contracts lack AML/CFT screening clauses.',
    'DAR Exchange','AML','AML',3,3,'strong','Compliance Officer','monitored',['Regulatory'],['F-008'],['OBS-005'],
    mockFiles(['Vendor_DD_Checklist.docx', 74])),
  makeRisk('RSK-006','reputational','Data breach from weak access controls','Customer data could be exposed due to insufficient access control policies.',
    'DAR Exchange','IT','IT',5,4,'weak','CISO','open',[],[],[],
    mockFiles(['Data_Classification_Matrix.xlsx', 156], ['Incident_Response_Plan.pdf', 730])),
  makeRisk('RSK-007','strategic','Over-reliance on single vendor','Critical infrastructure depends on a single cloud provider with no failover.',
    'DAR Exchange','RISK','RISK',4,2,'moderate','Head of Risk','open',[],[],[]),
  makeRisk('RSK-008','other','Delayed customer complaint resolution','Customer complaints are not resolved within the published SLA.',
    'DAR Exchange','CONSUMER PROTECTION','CONSUMER PROTECTION',3,3,'moderate','Consumer Protection Officer','monitored',[],[],[]),
  makeRisk('RSK-009','operational','Cash handling discrepancies at counter operations','Periodic cash counts have revealed unexplained variances at branch counters.',
    'DAR Exchange','OPS','BRANCH 2',4,3,'weak','Branch Operations Lead','open',['Internal Audit'],[],[]),
];

/**
 * One risk seed per internal-audit client. Typed as a Record so the build
 * fails if a key is added to InternalAuditClientKey without a seed here.
 */
const RISKS_BY_INTERNAL_AUDIT_CLIENT: Record<InternalAuditClientKey, Risk[]> = {
  'dar-exchange': DAR_EXCHANGE_RISKS,
  'xyz-broadcast': XYZ_BROADCAST_RISKS,
  'lulu-exchange': LULU_EXCHANGE_RISKS,
};

const MOCK_RISKS: Risk[] =
  CLIENT_MODE_VALUE !== 'internal-audit'
    ? CYGNUS_AURA_RISKS
    : RISKS_BY_INTERNAL_AUDIT_CLIENT[INTERNAL_AUDIT_CLIENT_KEY_VALUE];

/**
 * Module-level shared store (client-only — no backend). Holding this
 * outside any one component's class means the Risk Register (create /
 * edit / deactivate) and the Risk Approvals queue always read and write
 * the exact same data.
 */
export const risksStore = signal<Risk[]>(MOCK_RISKS);

/* ── Register Risk → Approvals PendingRisk mapping ─────────────────── */

/** Risk.riskType → Risk Approvals' "category" label (see RISK_TYPE_CATEGORY_LABELS). */
export function riskTypeToCategory(t: RiskType): string {
  return RISK_TYPE_CATEGORY_LABELS[t] ?? RISK_DEFAULT_CATEGORY_LABEL;
}

/**
 * Risk.impact/likelihood are 1–5 numeric scores; Risk Approvals'
 * PendingRisk.impact/likelihood are word bands. Threshold picked to
 * roughly mirror the original mock data (1–2 low, 3 medium, 4–5 high).
 */
export function scoreToBand(n: number): 'low' | 'medium' | 'high' {
  return n <= 2 ? RiskResidualLevels.Low : n === 3 ? RiskResidualLevels.Medium : RiskResidualLevels.High;
}

/** Builds a Risk Approvals queue entry from a Risk Register record. */
export function toPendingRisk(risk: Risk): PendingRisk {
  return {
    id: risk.id,
    title: risk.title,
    description: risk.description,
    // residualLevel ('high'|'medium'|'low') is the register's only rating
    // tier — there is no separate "critical" band on this side.
    riskRating: risk.residualLevel,
    category: riskTypeToCategory(risk.riskType),
    likelihood: scoreToBand(risk.likelihood),
    impact: scoreToBand(risk.impact),
    status: risk.status,
    // Risk has no separate "submitter" field — owner is the closest analog.
    submittedBy: risk.owner,
    // "Submitted date" ≈ when the risk was identified.
    submittedDate: risk.dateIdentified,
    company: risk.company,
    division: risk.division,
    subDivision: risk.subDivision,
  };
}
