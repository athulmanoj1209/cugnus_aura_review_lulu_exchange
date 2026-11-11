// ── Shared models for the Auditor Reassignment feature ──────────────────────────

import { INITIALS_WORD_COUNT, type AssignmentRole } from '../constants/reassign-auditors.constants';

// Value set lives in ../constants; re-exported so existing importers keep working.
export type { AssignmentRole } from '../constants/reassign-auditors.constants';

export interface AuditorUser {
  id: number; name: string; email: string; role: string;
}

export interface AuditorOption {
  label: string; value: number; role: string; email: string; initials: string;
}

/** One job-level assignment currently held by the selected auditor (flat, from API). */
export interface WorkloadItem {
  assignmentId: number;                 // db id of the (auditor × job × role) record
  companyId: number;      companyName: string;
  divisionId: number;     divisionName: string;
  subDivisionId: number;  subDivisionName: string;
  scopeValue: string;     scopeLabel: string;
  jobId: number;          jobName: string;
  role: AssignmentRole;
}

// ── Grouped view models (built client-side from WorkloadItem[]) ─────────────────

export interface ScopeGroup {
  key: string;
  scopeValue: string; scopeLabel: string;
  role: AssignmentRole;
  jobs: WorkloadItem[];
  assignmentIds: number[];              // every job under this scope (for scope-level reassign)
}

export interface SubDivisionGroup {
  key: string;
  divisionName: string; subDivisionName: string;
  scopes: ScopeGroup[];
}

export interface CompanyGroup {
  companyId: number; companyName: string;
  divisionCount: number;
  itemCount: number;
  subDivisions: SubDivisionGroup[];
}

export interface WorkloadSummary {
  companies: number; scopes: number; jobs: number;
  asPreparer: number; asReviewer: number;
}

// ── Staging model ───────────────────────────────────────────────────────────────

/** A staged reassignment: who it moves to, and the effective date range. */
export interface PendingReassign {
  toAuditorId: number;
  fromDate: Date | null;   // effective-from (null = open)
  toDate: Date | null;     // effective-to   (null = open)
}

/** Staged reassignments: assignmentId → plan. */
export type PendingMap = Map<number, PendingReassign>;

export interface ReassignRequest {
  assignmentIds: number[];
  fromAuditorId: number;
  toAuditorId: number;
  fromDate?: Date | null;   // serialize to ISO at the API boundary
  toDate?: Date | null;
  reason?: string;
}

/** Emitted by a row when the user picks/updates a target auditor or the dates (staged). */
export interface StageEvent {
  assignmentIds: number[];
  toAuditorId: number;
  fromDate: Date | null;
  toDate: Date | null;
}

/** Emitted by a row when the user clears a staged reassignment. */
export interface UnstageEvent {
  assignmentIds: number[];
}

export interface SelectionToggle {
  ids: number[];
  checked: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

export function toAuditorOption(u: AuditorUser): AuditorOption {
  return {
    label: u.name, value: u.id, role: u.role, email: u.email,
    initials: u.name.split(' ').slice(0, INITIALS_WORD_COUNT).map(w => w[0]).join('').toUpperCase(),
  };
}

/** Flat workload → Company → (Division·SubDivision) → Scope(+role) → Jobs. */
export function buildCompanyGroups(items: WorkloadItem[]): CompanyGroup[] {
  const companies = new Map<number, CompanyGroup>();

  for (const it of items) {
    let company = companies.get(it.companyId);
    if (!company) {
      company = { companyId: it.companyId, companyName: it.companyName, divisionCount: 0, itemCount: 0, subDivisions: [] };
      companies.set(it.companyId, company);
    }
    company.itemCount++;

    const subDivKey = `${it.divisionId}:${it.subDivisionId}`;
    let subDivision = company.subDivisions.find(d => d.key === subDivKey);
    if (!subDivision) {
      subDivision = { key: subDivKey, divisionName: it.divisionName, subDivisionName: it.subDivisionName, scopes: [] };
      company.subDivisions.push(subDivision);
    }

    const scopeKey = `${subDivKey}:${it.scopeValue}:${it.role}`;
    let scope = subDivision.scopes.find(s => s.key === scopeKey);
    if (!scope) {
      scope = { key: scopeKey, scopeValue: it.scopeValue, scopeLabel: it.scopeLabel, role: it.role, jobs: [], assignmentIds: [] };
      subDivision.scopes.push(scope);
    }
    scope.jobs.push(it);
    scope.assignmentIds.push(it.assignmentId);
  }

  for (const c of companies.values()) {
    c.divisionCount = new Set(c.subDivisions.map(d => d.key.split(':')[0])).size;
  }
  return [...companies.values()];
}