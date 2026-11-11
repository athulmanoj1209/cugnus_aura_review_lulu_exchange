// Helpers the per-client scope-job seeds use to expand a scope definition into
// one ScopeJob per audit period (month / quarter / year).

import type { StaticCompany } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import {
  ScopeJobFrequencies,
  ScopeJobStatuses,
  SCOPE_JOB_DATE_LOCALE,
  SCOPE_JOB_ID_PAD_LENGTH,
  SCOPE_JOB_MOCK_OVERDUE_RATIO,
} from '../constants/scope-job.constants';
import type { AuditFrequency, JobStatus, ModeOfAudit, ScopeJob } from '../models/scope-job.model';

function monthLabel(d: Date): string {
  return d.toLocaleString(SCOPE_JOB_DATE_LOCALE, { month: 'short', year: 'numeric' });
}

function quarterLabel(d: Date): string {
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

/** Date `offset` days from today (negative = past). */
export function daysFromToday(offset: number): Date {
  return new Date(Date.now() + offset * 86_400_000);
}

/** Generate scope jobs from a parent scope definition. */
export function generateJobs(
  scopeId: string,
  scopeName: string,
  company: string,
  division: string,
  subDivision: string | null,
  frequency: AuditFrequency,
  modeOfAudit: ModeOfAudit,
  startDate: Date,
  endDate: Date,
  auditors: string[],
  reviewers: string[],
  idPrefix: string,
  idStart: number,
  objective?: string,
  subscopes?: string[],
): ScopeJob[] {
  const jobs: ScopeJob[] = [];
  const now = new Date();

  let cursor = new Date(startDate);
  let idx = idStart;

  while (cursor <= endDate) {
    const periodStart = new Date(cursor);
    let periodEnd: Date;
    let periodLabel: string;

    if (frequency === ScopeJobFrequencies.Monthly) {
      periodEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0); // last day of month
      periodLabel = monthLabel(periodStart);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    } else if (frequency === ScopeJobFrequencies.Quarterly) {
      const q = Math.floor(cursor.getMonth() / 3);
      periodEnd = new Date(cursor.getFullYear(), (q + 1) * 3, 0);
      periodLabel = quarterLabel(periodStart);
      cursor = new Date(cursor.getFullYear(), (q + 1) * 3, 1);
    } else {
      // annually
      periodEnd = new Date(cursor.getFullYear(), 11, 31);
      periodLabel = `FY ${cursor.getFullYear()}`;
      cursor = new Date(cursor.getFullYear() + 1, 0, 1);
    }

    if (periodStart > endDate) break;
    if (periodEnd > endDate) periodEnd = new Date(endDate);

    let status: JobStatus;
    if (periodEnd < now) {
      status = Math.random() > SCOPE_JOB_MOCK_OVERDUE_RATIO ? ScopeJobStatuses.Completed : ScopeJobStatuses.Overdue;
    } else if (periodStart <= now && periodEnd >= now) {
      status = ScopeJobStatuses.InProgress;
    } else {
      status = ScopeJobStatuses.Pending;
    }

    jobs.push({
      id: `${idPrefix}-${String(idx).padStart(SCOPE_JOB_ID_PAD_LENGTH, '0')}`,
      title: `${scopeName} — ${periodLabel}`,
      scopeId,
      scopeName,
      company,
      division,
      subDivision,
      auditFrequency: frequency,
      modeOfAudit,
      periodLabel,
      periodStart,
      periodEnd,
      assignedAuditors: auditors,
      assignedReviewers: reviewers,
      status,
      createdDate: new Date(startDate),
      isActive: true,
      ...(objective ? { objective } : {}),
      ...(subscopes ? { subscopes } : {}),
    });

    idx++;
  }

  return jobs;
}

/**
 * Builds ScopeJob[] for every scope across the given companies whose
 * workflowStatus is literally 'Approved' — a scope still Not Started /
 * Planned / Pending Review / Rejected isn't on the plan yet, and one already
 * past Approved into In Progress / Completed / Overdue doesn't get new scope
 * jobs generated here either. This mirrors the same 'Approved' filter the
 * Audit Plan's adapter uses, so Scope Jobs and Audit Plan always agree on
 * which scopes are "live" for the year.
 *
 * Jobs run across the full fiscal year (1 Jan – 31 Dec of the scope's own
 * start-date year) at the scope's own auditFrequency.
 */
export function jobsForApprovedScopes(companies: StaticCompany[], idPrefix: string): ScopeJob[] {
  const jobs: ScopeJob[] = [];
  // Sub-division scopes first, then division-level scopes (divisions with no
  // sub-divisions keep their scopes on division.scopes), deduped by id.
  const seen = new Set<string>();
  const allScopes = companies.flatMap(company =>
    company.divisions.flatMap(division =>
      [...division.subDivisions.flatMap(subDivision => subDivision.scopes), ...(division.scopes ?? [])]
        .filter(scope => !seen.has(scope.id) && !!seen.add(scope.id))
        .map(scope => ({ scope, company, divisionName: division.divisionName })),
    ),
  );
  const subscopeNamesOf = (scopeId: string) =>
    allScopes.filter(s => s.scope.parentScopeId === scopeId).map(s => s.scope.scopeName);

  let block = 0;
  for (const { scope, company, divisionName } of allScopes) {
    if (scope.workflowStatus !== 'Approved') continue;

    const year = scope.startDate ? new Date(scope.startDate).getFullYear() : new Date().getFullYear();
    const subscopes = subscopeNamesOf(scope.id);
    block += 1;

    jobs.push(...generateJobs(
      scope.id,
      scope.scopeName,
      company.companyName,
      divisionName,
      scope.subDivisionName,
      scope.auditFrequency,
      scope.modeOfAudit,
      new Date(year, 0, 1),
      new Date(year, 11, 31),
      scope.assignedAuditors,
      scope.assignedReviewers,
      idPrefix,
      block * 100 + 1,
      scope.objective,
      subscopes.length ? subscopes : undefined,
    ));
  }

  return jobs;
}
