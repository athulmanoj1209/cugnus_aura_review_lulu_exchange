import {
  Risk, RiskType, ControlEffectiveness, RiskStatus,
  calcInherent, calcResidualScore, calcResidualLevel,
} from '@/app/features/audits/audit-plan/risk/models/risk.model';
import { XYZ_BROADCAST_SUB_DIVISION_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-xyz-broadcast.data';

/* ── XYZ Broadcast ────────────────────────────────────────────────────────
 * One risk per department, sourced from the "Media Company Internal Audit"
 * master data sheet's "Department Risks" column. Risk Rating -> impact/
 * likelihood follows this file's own scoreToBand bands (High -> 4/4,
 * Medium -> 3/3); riskType is picked per department by category.
 * ──────────────────────────────────────────────────────────────────────── */
type XyzRiskRating = 'high' | 'medium';
interface XyzDepartmentSeed {
  code: string;
  name: string;
  riskRating: XyzRiskRating;
  auditFrequency: 'monthly' | 'quarterly';
  scopeName: string;
  subScopes: string[];
}
function makeXyzRisk(
  id: string, type: RiskType, title: string, desc: string,
  company: string, division: string, dept: string,
  impact: number, likelihood: number, ce: ControlEffectiveness,
  owner: string, status: RiskStatus, scopes: string[],
): Risk {
  const inherent = calcInherent(impact, likelihood);
  const residual = calcResidualScore(inherent, ce);
  return {
    id, riskType: type, title, description: desc,
    company, division, subDivision: dept,
    impact, likelihood, inherentScore: inherent,
    keyControls: 'Documented policy in place. Quarterly review scheduled.',
    controlEffectiveness: ce, residualScore: residual,
    residualLevel: calcResidualLevel(residual),
    owner, dateIdentified: new Date('2025-01-10'),
    lastUpdated: new Date('2025-04-01'), status,
    linkedScopes: scopes, linkedFindings: [], linkedObservations: [],
    supportingFiles: [],
  };
}

interface XyzRiskSeed {
  code: string;
  scope: string;
  riskType: RiskType;
  riskRating: 'high' | 'medium';
  description: string;
}

const XYZ_RISK_SEEDS: XyzRiskSeed[] = [
  { code: '001', scope: 'Broadcasting Operations', riskType: 'operational', riskRating: 'high', description: 'Broadcast interruption, scheduling errors, unauthorized system access, transmission failure, or inadequate backup may disrupt services and affect audience trust.' },
  { code: '002', scope: 'Radio Operations', riskType: 'operational', riskRating: 'high', description: 'Transmission failure, programming errors, equipment outages, or insufficient backup arrangements may interrupt radio services and create compliance or reputational exposure.' },
  { code: '003', scope: 'Newspaper & Publishing', riskType: 'operational', riskRating: 'medium', description: 'Editorial or production errors, inaccurate circulation records, delayed publication, or weak distribution controls may cause financial and reputational impact.' },
  { code: '004', scope: 'Editorial Governance & Newsroom', riskType: 'compliance', riskRating: 'high', description: 'Inaccurate or insufficiently verified content, weak approval controls, or delayed corrections may create legal, regulatory, and reputational exposure.' },
  { code: '005', scope: 'Content Governance & Compliance', riskType: 'compliance', riskRating: 'high', description: 'Broadcast or published content may breach internal standards, applicable media requirements, or approval rules, resulting in sanctions or reputational damage.' },
  { code: '006', scope: 'Content Rights & Intellectual Property', riskType: 'compliance', riskRating: 'high', description: 'Expired, restricted, or unauthorized use of third-party content may lead to copyright disputes, financial loss, takedowns, or legal claims.' },
  { code: '007', scope: 'Advertising & Commercial Revenue', riskType: 'financial', riskRating: 'high', description: 'Unbilled airtime, unauthorized discounts, incorrect rate application, or incomplete billing may result in significant revenue leakage.' },
  { code: '008', scope: 'Sponsorship & Commercial Partnerships', riskType: 'financial', riskRating: 'medium', description: 'Unapproved commercial terms, failure to deliver sponsorship commitments, or inaccurate billing may cause revenue loss and contractual disputes.' },
  { code: '009', scope: 'Subscription & Circulation', riskType: 'financial', riskRating: 'medium', description: 'Inaccurate subscription, circulation, returns, or complimentary-copy records may distort revenue and performance reporting.' },
  { code: '010', scope: 'Digital Media & OTT Platforms', riskType: 'it', riskRating: 'high', description: 'Platform outages, unauthorized content changes, weak access controls, or unreliable digital services may cause service disruption and reputational damage.' },
  { code: '011', scope: 'Social Media Governance', riskType: 'reputational', riskRating: 'high', description: 'Compromised accounts, unauthorized posts, poor approval controls, or impersonation may cause rapid reputational and information-security damage.' },
  { code: '012', scope: 'Cybersecurity', riskType: 'it', riskRating: 'high', description: 'Cyberattack, ransomware, unauthorized access, data loss, or compromise of broadcasting and corporate systems may materially disrupt operations.' },
  { code: '013', scope: 'Business Continuity & Disaster Recovery', riskType: 'operational', riskRating: 'high', description: 'Inadequate recovery plans or untested backup arrangements may prevent timely restoration of critical broadcasting, radio, publishing, and digital services.' },
  { code: '014', scope: 'Media Asset Management', riskType: 'operational', riskRating: 'medium', description: 'Loss, theft, misuse, inaccurate recording, or poor maintenance of high-value media equipment may result in financial loss and service disruption.' },
  { code: '015', scope: 'Production Management', riskType: 'financial', riskRating: 'medium', description: 'Production cost overruns, weak approvals, unauthorized expenditure, vendor issues, or delayed delivery may impact budget, quality, and schedules.' },
  { code: '016', scope: 'Finance & Financial Reporting', riskType: 'financial', riskRating: 'high', description: 'Incorrect accounting, weak reconciliations, inappropriate journal entries, or inaccurate financial reporting may cause material misstatement or loss.' },
  { code: '017', scope: 'Procurement & Vendor Management', riskType: 'financial', riskRating: 'medium', description: 'Weak sourcing, conflicts of interest, non-competitive procurement, duplicate payments, or inadequate vendor due diligence may cause financial and compliance exposure.' },
  { code: '018', scope: 'Contract Management', riskType: 'compliance', riskRating: 'medium', description: 'Expired contracts, missing approvals, unclear obligations, or weak renewal monitoring may create legal, operational, and financial exposure.' },
  { code: '019', scope: 'Human Resources & Payroll', riskType: 'operational', riskRating: 'medium', description: 'Incorrect payroll, unauthorized employee changes, weak onboarding/offboarding, or inappropriate access retention may lead to financial loss and control breaches.' },
  { code: '020', scope: 'Legal & Regulatory Compliance', riskType: 'compliance', riskRating: 'high', description: 'Failure to identify, monitor, or comply with applicable obligations, licenses, and regulatory requirements may result in penalties or restrictions.' },
  { code: '021', scope: 'Data Privacy & Information Governance', riskType: 'compliance', riskRating: 'high', description: 'Unauthorized use, retention, disclosure, or loss of personal information may result in regulatory, legal, and reputational consequences.' },
  { code: '022', scope: 'Records & Media Archive Management', riskType: 'operational', riskRating: 'medium', description: 'Loss, unauthorized alteration, poor retention, or inability to retrieve media and business records may affect legal evidence and operational continuity.' },
  { code: '023', scope: 'Reputation & Brand Risk', riskType: 'reputational', riskRating: 'high', description: 'Negative media, impersonation, misinformation, or delayed crisis response may damage the organization’s reputation and stakeholder confidence.' },
  { code: '024', scope: 'Fraud Risk Management', riskType: 'financial', riskRating: 'high', description: 'Fraud involving advertising, procurement, payroll, expenses, vendors, or discounts may cause financial loss and reputational damage.' },
  { code: '025', scope: 'Corporate Governance', riskType: 'strategic', riskRating: 'medium', description: 'Weak oversight, unclear delegation, policy gaps, conflicts of interest, or ineffective committee governance may impair accountability and decision-making.' },
  { code: '026', scope: 'Enterprise Risk Management', riskType: 'strategic', riskRating: 'medium', description: 'Incomplete risk identification, weak KRI monitoring, ineffective mitigation, or overdue actions may leave material risks unmanaged.' },
  { code: '027', scope: 'Third-Party & Outsourcing Risk', riskType: 'operational', riskRating: 'medium', description: 'Critical third parties may fail to meet security, continuity, performance, compliance, or contractual requirements, disrupting media operations.' },
];
const XYZ_DEPARTMENTS: XyzDepartmentSeed[] = [
  { code: 'D01', name: 'Broadcasting / Television Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Broadcasting Operations', subScopes: ['Transmission & Playout', 'Studio & Control Room Access'] },
  { code: 'D02', name: 'Radio Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Radio Operations', subScopes: ['Programming & Scheduling', 'Transmission & Equipment'] },
  { code: 'D03', name: 'Newspaper / Publishing', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Newspaper & Publishing', subScopes: ['Editorial-to-Publication Workflow', 'Print Production & Distribution'] },
  { code: 'D04', name: 'Editorial / Newsroom', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Editorial Governance & Newsroom', subScopes: ['Editorial Approval', 'Fact Checking & Source Verification', 'Corrections & Retractions'] },
  { code: 'D05', name: 'Content Compliance / Editorial Governance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Content Governance & Compliance', subScopes: ['Content Review', 'Complaints Handling'] },
  { code: 'D06', name: 'Content Acquisition / Legal', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Content Rights & Intellectual Property', subScopes: ['Licensing & Usage Rights', 'Licence Expiry & Restrictions'] },
  { code: 'D07', name: 'Commercial / Advertising Sales', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Advertising & Commercial Revenue', subScopes: ['Ad Booking to Broadcast/Publication', 'Rate Cards & Discounts', 'Revenue Completeness'] },
  { code: 'D08', name: 'Commercial / Partnerships', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Sponsorship & Commercial Partnerships', subScopes: ['Contractual Obligations'] },
  { code: 'D09', name: 'Circulation / Subscription', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Subscription & Circulation', subScopes: ['Subscription Revenue'] },
  { code: 'D10', name: 'Digital Media / Technology', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Digital Media & OTT Platforms', subScopes: ['Publishing Access', 'Availability & Change Management'] },
  { code: 'D11', name: 'Digital / Corporate Communications', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Social Media Governance', subScopes: ['Account Security', 'Posting & Approval'] },
  { code: 'D12', name: 'Information Technology / Information Security', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Cybersecurity', subScopes: ['Identity & Access Management', 'Vulnerability & Incident Management'] },
  { code: 'D13', name: 'Business Continuity / IT / Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Business Continuity & Disaster Recovery', subScopes: ['Broadcast Continuity', 'IT Disaster Recovery'] },
  { code: 'D14', name: 'Operations / Asset Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Media Asset Management', subScopes: ['Asset Custody', 'Maintenance & Disposal'] },
  { code: 'D15', name: 'Content Production', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Production Management', subScopes: ['Production Budgeting', 'External Crew & Vendors'] },
  { code: 'D16', name: 'Finance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Finance & Financial Reporting', subScopes: ['Revenue & Receivables', 'General Ledger & Close'] },
  { code: 'D17', name: 'Procurement / Supply Chain', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Procurement & Vendor Management', subScopes: ['Sourcing & Tendering', 'Vendor Due Diligence'] },
  { code: 'D18', name: 'Legal / Contract Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Contract Management', subScopes: ['Contract Lifecycle'] },
  { code: 'D19', name: 'Human Resources', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Human Resources & Payroll', subScopes: ['Payroll & Allowances', 'Freelancers & Talent'] },
  { code: 'D20', name: 'Legal / Compliance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Legal & Regulatory Compliance', subScopes: ['Licences & Regulatory Obligations'] },
  { code: 'D21', name: 'Information Governance / Compliance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Data Privacy & Information Governance', subScopes: ['Personal Data Handling'] },
  { code: 'D22', name: 'Records / Archive Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Records & Media Archive Management', subScopes: ['Archive Completeness & Retrieval'] },
  { code: 'D23', name: 'Corporate Communications / Brand Protection', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Reputation & Brand Risk', subScopes: ['Negative Media & Brand Monitoring'] },
  { code: 'D24', name: 'Risk / Internal Control / Finance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Fraud Risk Management', subScopes: ['Fraud Risk Assessment', 'Revenue & Vendor Analytics'] },
  { code: 'D25', name: 'Corporate Governance / Board Secretariat', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Corporate Governance', subScopes: ['Delegation & Committees'] },
  { code: 'D26', name: 'Risk Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Enterprise Risk Management', subScopes: ['Risk Register & KRIs', 'Risk Assessment & Controls'] },
  { code: 'D27', name: 'Procurement / Risk / Vendor Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Third-Party & Outsourcing Risk', subScopes: ['Critical Third Parties'] },
];
export const XYZ_BROADCAST_RISKS: Risk[] = XYZ_RISK_SEEDS.map((seed, i) => {
  const department = XYZ_DEPARTMENTS[i].name;
  const score = seed.riskRating === 'high' ? 4 : 3;
  // 'weak' keeps the full inherent score as the residual score: 4/4 -> 16
  // (calcResidualLevel bands >14 as 'high') and 3/3 -> 9 (bands 7-14 as
  // 'medium'). Any stronger control effectiveness knocks the score down a
  // band (e.g. 'moderate' on 3/3 -> residual 6, which bands as 'low'), so
  // no seed's riskRating ever matched its resulting residualLevel.
  const ce: ControlEffectiveness = 'weak';
  return makeXyzRisk(
    `RSK-XYZ-${seed.code}`, seed.riskType, `${department} risk`, seed.description,
    'XYZ Broadcast', 'Dubai', department,
    score, score, ce, `${department} Lead`,
    seed.riskRating === 'high' ? 'open' : 'monitored',
    [seed.scope],
  );
});
