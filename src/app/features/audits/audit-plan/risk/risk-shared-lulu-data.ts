import {
  Risk, RiskType, ControlEffectiveness, RiskStatus,
  calcInherent, calcResidualScore, calcResidualLevel,
} from '@/app/features/audits/audit-plan/risk/models/risk.model';

/* ── Lulu International Exchange ──────────────────────────────────────────
 * One risk per sub-division. Org structure:
 *   IT DEPT            -> SOFTWARE, HARDWARE, CYBER SECURITY
 *   RISK DEPT          -> (no sub-divisions; sub-division = division)
 *   FRAUD DEPT         -> (no sub-divisions; sub-division = division)
 *   BRANCH OPERATIONS  -> Branch 1, Branch 2
 * company / division / subDivision / scope strings match the Lulu evidence
 * seed (evidence-static-lulu-exchange.data.ts) so list filters line up.
 * Risk Rating -> impact/likelihood: High -> 4/4, Medium -> 3/3.
 * ──────────────────────────────────────────────────────────────────────── */
const LULU_COMPANY = 'Lulu International Exchange';

type LuluRiskRating = 'high' | 'medium';

interface LuluRiskSeed {
  code: string;
  division: string;
  subDivision: string;
  title: string;
  scope: string;
  riskType: RiskType;
  riskRating: LuluRiskRating;
  owner: string;
  description: string;
}

function makeLuluRisk(
  id: string, type: RiskType, title: string, desc: string,
  company: string, division: string, subDivision: string,
  impact: number, likelihood: number, ce: ControlEffectiveness,
  owner: string, status: RiskStatus, scopes: string[],
): Risk {
  const inherent = calcInherent(impact, likelihood);
  const residual = calcResidualScore(inherent, ce);
  return {
    id, riskType: type, title, description: desc,
    company, division, subDivision,
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

const LULU_RISK_SEEDS: LuluRiskSeed[] = [
  // ── IT DEPT ──
  { code: '001', division: 'IT DEPT', subDivision: 'SOFTWARE', title: 'Delayed security patching',
    scope: 'Information Technology / Cybersecurity', riskType: 'it', riskRating: 'high', owner: 'Software Lead',
    description: 'Critical application and server patches are not applied within the agreed SLA, leaving known vulnerabilities exploitable.' },
  { code: '002', division: 'IT DEPT', subDivision: 'HARDWARE', title: 'Unauthorised physical access to data centre',
    scope: 'Information Technology / Cybersecurity', riskType: 'operational', riskRating: 'medium', owner: 'Infrastructure Manager',
    description: 'Uncatalogued access cards, CCTV gaps, and unlocked cabinets may allow unauthorised physical access to critical hardware.' },
  { code: '003', division: 'IT DEPT', subDivision: 'CYBER SECURITY', title: 'Excessive privileged access rights',
    scope: 'Information Technology / Cybersecurity', riskType: 'it', riskRating: 'high', owner: 'CISO',
    description: 'Privileged and orphaned accounts are not reviewed periodically, allowing unauthorised access to core exchange systems.' },

  // ── RISK DEPT ──
  { code: '004', division: 'RISK DEPT', subDivision: 'RISK DEPT', title: 'Outdated operational risk register',
    scope: 'Risk Management / Business Continuity', riskType: 'strategic', riskRating: 'medium', owner: 'Head of Risk',
    description: 'Risk register entries are not reviewed regularly and some high-rated risks lack owners or mitigation actions.' },

  // ── FRAUD DEPT ──
  { code: '005', division: 'FRAUD DEPT', subDivision: 'FRAUD DEPT', title: 'AML alerts not reviewed within SLA',
    scope: 'AML/CFT Compliance', riskType: 'aml_cft', riskRating: 'high', owner: 'Fraud & AML Manager',
    description: 'High-priority transaction monitoring alerts are not reviewed within the required timeframe, risking missed suspicious transaction reports.' },

  // ── BRANCH OPERATIONS ──
  { code: '006', division: 'BRANCH OPERATIONS', subDivision: 'Branch 1', title: 'Purchase orders approved above authorisation limit',
    scope: 'Operations and Other Departments', riskType: 'financial', riskRating: 'medium', owner: 'Branch 1 Manager',
    description: 'Branch purchase orders are approved beyond delegated authority limits, exposing the company to unauthorised expenditure.' },
  { code: '007', division: 'BRANCH OPERATIONS', subDivision: 'Branch 2', title: 'Inadequate cash custody controls',
    scope: 'Branch Operations / Operational Controls', riskType: 'operational', riskRating: 'high', owner: 'Branch 2 Manager',
    description: 'Absence of dual-custodian controls and daily cash count sign-off at the branch may result in cash loss or misappropriation.' },
];

export const LULU_EXCHANGE_RISKS: Risk[] = LULU_RISK_SEEDS.map(seed => {
  const score = seed.riskRating === 'high' ? 4 : 3;
  // 'weak' keeps residual = inherent, so 4/4 -> 16 ('high') and 3/3 -> 9
  // ('medium') — the residualLevel matches the seed's riskRating.
  const ce: ControlEffectiveness = 'weak';
  return makeLuluRisk(
    `RSK-LULU-${seed.code}`, seed.riskType, seed.title, seed.description,
    LULU_COMPANY, seed.division, seed.subDivision,
    score, score, ce, seed.owner,
    seed.riskRating === 'high' ? 'open' : 'monitored',
    [seed.scope],
  );
});
