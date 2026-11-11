import type { StaticCompany, StaticScope } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { MOCK_SCOPE_JOBS, ScopeJob as RealScopeJob } from '@/app/features/audits/audit-plan/scope-job/list/scope-job-list.component';
import { AuditScope, Department as SubDivision, Frequency, InstanceStatus, RiskRating, ScopeJob } from '../models/audit-plan.model';
import type { AuditPlan, AuditScope as PlanScope } from './audit-plan-data';
import { ScopeJobFrequencies, ScopeJobStatuses } from '@/app/features/audits/audit-plan/scope-job/constants/scope-job.constants';
import {
  AUDIT_PLAN_DEFAULT_SCOPE_DAY,
  AUDIT_PLAN_PLACEHOLDER_JOB_HOURS,
  AUDIT_PLAN_PLACEHOLDER_SCOPE_HOURS,
  CALENDAR_MAX_PLACEMENT_DAY,
  Frequencies,
  InstanceStatuses,
  MONTHS_PER_YEAR,
  RiskRatings,
} from '../constants/audit-plan.constants';
import { AUDIT_PLAN_EMPTY_VALUE, AUDIT_PLAN_FALLBACK_NAMES } from '../constants/audit-plan-messages.constants';

/**
 * Adapts a StaticCompany's real audit-scope records (Audit Scope
 * Management's data model — divisions → sub-divisions → StaticScope[]),
 * combined with the real per-period jobs the Scope Jobs page generates for
 * them (MOCK_SCOPE_JOBS), into the Sub-Division[]/AuditScope[] shape that the
 * Annual Overview / Calendar / Sub-Division View / Scope Detail / Execution
 * Log screens actually render.
 *
 * The Scope Jobs list is the source of truth here: which scopes appear at
 * all, which months they're scheduled in, and what status each month shows
 * all come from MOCK_SCOPE_JOBS (Scope Jobs already only generates jobs for
 * 'Approved' scopes) — not from a separate heuristic — so the Audit Plan and
 * Scope Jobs pages can never drift out of sync with each other.
 *
 * Used by AuditPlanService.getPlan() so a company with real scope data
 * (e.g. DAR Exchange under CLIENT_MODE 'internal-audit') shows its actual
 * audit plan instead of the generic multi-sub-division mock.
 */

function toInstanceStatus(status: RealScopeJob['status']): InstanceStatus {
  switch (status) {
    case ScopeJobStatuses.Completed:  return InstanceStatuses.Completed;
    case ScopeJobStatuses.InProgress: return InstanceStatuses.InProgress;
    case ScopeJobStatuses.Overdue:    return InstanceStatuses.Overdue;
    default:                          return InstanceStatuses.Planned; // 'pending'
  }
}

function toFrequency(auditFrequency: string): Frequency {
  switch (auditFrequency) {
    case ScopeJobFrequencies.Monthly:   return Frequencies.Monthly;
    case ScopeJobFrequencies.Quarterly: return Frequencies.Quarterly;
    case ScopeJobFrequencies.Annually:  return Frequencies.Yearly;
    default:                            return Frequencies.Quarterly; // unexpected value — safest visual default
  }
}

/** Scope-seed risk codes (lower-case) → RiskRating. */
function toRiskRating(risk: string | null | undefined): RiskRating {
  switch (risk) {
    case RiskRatings.High.toLowerCase(): return RiskRatings.High;
    case RiskRatings.Low.toLowerCase():  return RiskRatings.Low;
    default:                             return RiskRatings.Medium;
  }
}

/**
 * Builds the 12-slot `months` array straight from the scope's real jobs:
 * each job is ONE audit occurrence, so it marks only the single month it
 * starts in — not every month its engagement period spans. A quarterly
 * scope has 4 real jobs (one per quarter), so it lights up 4 months; an
 * annual scope has 1 real job, so it lights up 1 month; a monthly scope
 * has 12 real jobs, one per month, so all 12 light up.
 *
 * Filling every month between periodStart and periodEnd (e.g. all 3
 * months of a quarterly job's Jan–Mar window, or all 12 months of an
 * annual job's Jan–Dec window) made every scope look scheduled every
 * single month regardless of its real frequency — that's the Annual
 * Overview mismatch this fixes. The number of non-null months here should
 * always equal `jobs.length` for the scope.
 */
function buildMonthsFromJobs(jobs: RealScopeJob[]): (InstanceStatus | null)[] {
  const months: (InstanceStatus | null)[] = Array(MONTHS_PER_YEAR).fill(null);
  for (const job of jobs) {
    months[job.periodStart.getMonth()] = toInstanceStatus(job.status);
  }
  return months;
}

/**
 * Day-of-month a scope's pill/instance lands on (calendar placement) —
 * taken from its first real job's period start when one exists, otherwise
 * falls back to the scope record's own startDate.
 */
function dayOfMonth(jobs: RealScopeJob[], fallbackDateStr: string | undefined): number {
  const source = jobs[0]?.periodStart ?? (fallbackDateStr ? new Date(fallbackDateStr) : undefined);
  const d = source ? source.getDate() : NaN;
  return Number.isFinite(d) ? Math.min(Math.max(d, 1), CALENDAR_MAX_PLACEMENT_DAY) : AUDIT_PLAN_DEFAULT_SCOPE_DAY;
}

/**
 * Builds the scope's jobs list directly from its real per-period jobs (one
 * per period — e.g. a quarterly scope gets up to 4). Falls back to a single
 * synthetic job only if a scope somehow has no real jobs, so clicking its
 * pill still opens the scope-job drawer instead of doing nothing
 * (AnnualOverviewComponent.openPill bails out when jobs[0] is missing).
 */
function buildJobs(scope: StaticScope, jobs: RealScopeJob[]): ScopeJob[] {
  if (jobs.length) {
    return jobs.map(job => ({
      id: job.id,
      name: job.title,
      // scope-job-list's ScopeJob doesn't track hours — this is a placeholder.
      auditor: job.assignedAuditors[0] ?? AUDIT_PLAN_FALLBACK_NAMES.Auditor,
      hrs: AUDIT_PLAN_PLACEHOLDER_JOB_HOURS,
    }));
  }
  return [{
    id: `${scope.id}-job`,
    name: scope.scopeName,
    auditor: scope.assignedAuditors[0] ?? AUDIT_PLAN_FALLBACK_NAMES.Auditor,
    hrs: scope.estimatedHours ?? AUDIT_PLAN_PLACEHOLDER_SCOPE_HOURS,
  }];
}

/**
 * NOTE — placeholders: neither the scope nor the job data tracks per-scope
 * RFI or findings counts, so both are 0 here. Wire these to real counts once
 * that data exists.
 */
function toAuditScope(scope: StaticScope, jobsByScopeId: Map<string, RealScopeJob[]>): AuditScope {
  const jobs = jobsByScopeId.get(scope.id) ?? [];
  return {
    id: scope.id,
    code: scope.id,
    name: scope.scopeName,
    freq: toFrequency(scope.auditFrequency),
    auditor: scope.assignedAuditors[0] ?? AUDIT_PLAN_FALLBACK_NAMES.Auditor,
    preparers: [...scope.assignedAuditors],
    reviewers: [...scope.assignedReviewers],
    risk: toRiskRating(scope.riskRating),
    rfi: 0,
    findings: 0,
    day: dayOfMonth(jobs, scope.startDate),
    months: jobs.length ? buildMonthsFromJobs(jobs) : Array(MONTHS_PER_YEAR).fill(null),
    jobs: buildJobs(scope, jobs),
  };
}

function slug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Flattens a company's divisions → sub-divisions → scopes into Sub-Division[],
 * grouped by sub-division name. Only scopes that have real jobs in
 * MOCK_SCOPE_JOBS are included — since Scope Jobs only generates jobs for
 * 'Approved' scopes, this is how "Approved-only" carries over here, straight
 * from the Scope Jobs data rather than a second, separately-maintained
 * filter. This also naturally drops SC-5000 (the AML/CFT Compliance parent
 * placeholder — 'Not Started', no jobs) while its sub-scopes stay if they
 * have jobs of their own.
 */
export function mapStaticCompanyToSubDivisions(company: StaticCompany): SubDivision[] {
  const jobsByScopeId = new Map<string, RealScopeJob[]>();
  for (const job of MOCK_SCOPE_JOBS) {
    const list = jobsByScopeId.get(job.scopeId) ?? [];
    list.push(job);
    jobsByScopeId.set(job.scopeId, list);
  }
  const hasJobs = (s: StaticScope) => (jobsByScopeId.get(s.id)?.length ?? 0) > 0;

  // Divisions flagged hasSubDivision:false (division seed) are planned as one
  // division-level lane instead of per sub-division.
  const noSubDivisionCodes = new Set(
    DIVISION_INDI_ORG_COMPANIES.find(c => c.id === company.id)?.divisions
      .filter(b => b.hasSubDivision === false)
      .map(b => b.divisionCode) ?? [],
  );

  const lanes = new Map<string, { name: string; isDivisionLevel: boolean; scopes: StaticScope[] }>();
  const addScope = (key: string, name: string, isDivisionLevel: boolean, s: StaticScope) => {
    const lane = lanes.get(key) ?? { name, isDivisionLevel, scopes: [] };
    if (!lane.scopes.some(x => x.id === s.id)) lane.scopes.push(s);
    lanes.set(key, lane);
  };

  for (const division of company.divisions) {
    if (noSubDivisionCodes.has(division.divisionCode)) {
      // Division-level scopes plus any still nested under leftover sub-divisions, deduped by id.
      const scopes = [...division.scopes, ...division.subDivisions.flatMap(d => d.scopes)];
      for (const s of scopes.filter(hasJobs)) addScope(slug(division.divisionCode), division.divisionName, true, s);
      continue;
    }
    for (const s of division.subDivisions.flatMap(d => d.scopes).filter(hasJobs)) {
      const deptKey = s.subDivisionName ?? AUDIT_PLAN_EMPTY_VALUE; // '—' = division-level scope
      addScope(slug(deptKey), deptKey, false, s);
    }
  }

  return Array.from(lanes.entries()).map(([id, lane]) => ({
    id,
    name: lane.name,
    companyId: company.id,
    isDivisionLevel: lane.isDivisionLevel,
    scopes: lane.scopes.map(s => toAuditScope(s, jobsByScopeId)),
  }));
}
/**
 * Audit-firm mode: builds a company's Annual Overview lanes from the plan
 * list's own mock plans (MOCK_PLANS, already filtered to that company), so
 * the overview shows exactly what the list shows. A division-level plan
 * (division flagged `hasSubDivision: false`) becomes one division lane; other
 * plans' sub-divisions are grouped per division + sub-division. Scope ids are
 * prefixed with the plan id so they stay unique across plans.
 */
export function mapPlansToSubDivisions(plans: AuditPlan[], companyId: string): SubDivision[] {
  const lanes = new Map<string, SubDivision>();
  for (const plan of plans) {
    for (const d of plan.subDivisions) {
      const key = d.isDivisionLevel ? `div:${d.id}` : `${plan.divisionName}::${d.name}`;
      const lane = lanes.get(key) ?? {
        id: slug(key),
        name: d.name,
        companyId,
        isDivisionLevel: !!d.isDivisionLevel,
        scopes: [],
      };
      lane.scopes.push(...d.scopes.map(s => planScopeToAuditScope(plan.id, s)));
      lanes.set(key, lane);
    }
  }
  return Array.from(lanes.values());
}

/** Plan-list scope → Annual Overview scope. The plan mock has no team/day data, so the lead auditor is the only preparer and day 15 is a placeholder. */
function planScopeToAuditScope(planId: string, s: PlanScope): AuditScope {
  return {
    id: `${planId}-${s.id}`,
    code: s.code,
    name: s.name,
    freq: s.freq,
    auditor: s.auditor,
    preparers: [s.auditor],
    reviewers: [],
    risk: s.risk,
    rfi: s.rfi,
    findings: s.findings,
    day: AUDIT_PLAN_DEFAULT_SCOPE_DAY,
    months: [...s.months],
    jobs: s.jobs.map(j => ({ id: j.id, name: j.name, auditor: j.auditor ?? s.auditor, hrs: j.hrs })),
  };
}
