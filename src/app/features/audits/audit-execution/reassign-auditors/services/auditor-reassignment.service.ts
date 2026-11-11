import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AuditorUser, ReassignRequest, WorkloadItem } from '@/app/features/audits/audit-execution/reassign-auditors/models/auditor-reassignment.model';
import { ORG_STATIC_DATA, OrgCompany, OrgSubDivisionScope } from '@/app/features/audits/organization/company/company-org-data';
// TODO: point this at the actual path of companyorgdata.ts in your project
// (the comment at the top of that file suggests it's meant to be a single
// shared source used across Companies/Divisions/Sub-Divisions pages, the Add
// Member modal, filters, etc. — import it from wherever it ends up living,
// e.g. '../data/companyorgdata' or '../shared/data/companyorgdata').

import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import {
  AssignmentRoles,
  ID_SEQUENCE_START,
  MOCK_ITEMS_PER_AUDITOR,
  MOCK_WORKLOAD_OFFSET_STEP,
  REASSIGN_MOCK_LATENCY_MS,
  REASSIGNABLE_SCOPE_STATUS,
  type AssignmentRole,
} from '../constants/reassign-auditors.constants';
import {
  companyFallbackName,
  divisionFallbackName,
  mockJobName,
  subDivisionFallbackName,
} from '../constants/reassign-auditors-messages.constants';
// TODO: adjust this import path to wherever division-static-indi-org.data.ts
// actually lives in your project — divisionName (and, as a fallback,
// subDivisionName) for internal-audit workload rows is sourced from here
// rather than from SCOPE_INDI_ORG_COMPANIES's own division/sub-division
// nesting, per your note that division static data is the source of truth.


/**
 * Mock service. Swap each `of(...).pipe(delay())` for the real HttpClient call.
 * Endpoints assumed:
 *   GET  /auditors
 *   GET  /auditors/{id}/workload
 *   POST /assignments/reassign
 *        { assignmentIds, fromAuditorId, toAuditorId, effectiveFrom, effectiveTo, reason }
 *
 * Workload rows are now sourced from ORG_STATIC_DATA (the shared
 * Company -> Division -> Sub-division directory), instead of a separate,
 * hand-written "Crowe UAE / Crowe KSA" mock tree. This keeps the
 * auditor-reassignment screen's company/division/sub-division/scope labels
 * consistent with every other page that reads from ORG_STATIC_DATA, and
 * means real client data (Al Noor Jewellery, Zumurrud Diamonds, Falcon
 * Gulf Jewellery, Marwa Gold & Gems, …) shows up here too.
 *
 * EXCEPTION — CLIENT_MODE === 'internal-audit': there is no multi-client
 * roster in that mode (a single org audits itself), so both `getAuditors()`
 * and `getWorkload()` instead read the internal-audit static seed
 * (SCOPE_INDI_ORG_COMPANIES), whose scopes/tasks already carry real
 * `assignedAuditors` / `assignedReviewers` / `assignedAuditor` data — see
 * the "Internal-audit mode" section below.
 */
@Injectable({ providedIn: 'root' })
export class AuditorReassignmentService {
  private clientMode = inject(CLIENT_MODE);

  getAuditors(): Observable<AuditorUser[]> {
    if (this.clientMode === 'internal-audit') {
      return of(INDI_ORG_AUDITORS).pipe(delay(REASSIGN_MOCK_LATENCY_MS.Auditors));
    }
    // TODO: swap → this.http.get<AuditorUser[]>('/auditors')
    return of(MOCK_AUDITORS).pipe(delay(REASSIGN_MOCK_LATENCY_MS.Auditors));
  }

  getWorkload(auditorId: number): Observable<WorkloadItem[]> {
    if (this.clientMode === 'internal-audit') {
      return of(buildIndiOrgWorkload(auditorId)).pipe(delay(REASSIGN_MOCK_LATENCY_MS.Workload));
    }
    // TODO: swap → this.http.get<WorkloadItem[]>(`/auditors/${auditorId}/workload`)
    return of(buildMockWorkload(auditorId)).pipe(delay(REASSIGN_MOCK_LATENCY_MS.Workload));
  }

  reassign(req: ReassignRequest): Observable<void> {
    // Dates are serialized to ISO for persistence (null → open-ended).
    const payload = {
      assignmentIds: req.assignmentIds,
      fromAuditorId: req.fromAuditorId,
      toAuditorId:   req.toAuditorId,
      effectiveFrom: req.fromDate ? req.fromDate.toISOString() : null,
      effectiveTo:   req.toDate   ? req.toDate.toISOString()   : null,
      reason:        req.reason ?? null,
    };
    // TODO: swap → this.http.post<void>('/assignments/reassign', payload)
    console.debug('[reassign] persisting', payload);
    return of(void 0).pipe(delay(REASSIGN_MOCK_LATENCY_MS.Reassign));
  }
}

// ── Mock auditors (audit-firm mode) ───────────────────────────────────────────

/** Auditor ids that intentionally have NO assignments (demo the empty state). */
const AUDITORS_WITHOUT_WORKLOAD = new Set<number>([7]);

const MOCK_AUDITORS: AuditorUser[] = [
  { id: 1, name: 'Ahmed Al Mansoori', email: 'ahmed.m@crowe.ae',  role: 'Senior Auditor' },
  { id: 2, name: 'Sara Al Hashimi',   email: 'sara.h@crowe.ae',   role: 'Audit Manager'  },
  { id: 3, name: 'Khalid Ibrahim',    email: 'khalid.i@crowe.ae', role: 'Senior Auditor' },
  { id: 4, name: 'Fatima Al Zaabi',   email: 'fatima.z@crowe.ae', role: 'Audit Partner'  },
  { id: 5, name: 'Omar Qassim',       email: 'omar.q@crowe.ae',   role: 'Audit Manager'  },
  { id: 6, name: 'Nour Al Rashed',    email: 'nour.r@crowe.ae',   role: 'Senior Auditor' },
  { id: 7, name: 'Layla Hassan',      email: 'layla.h@crowe.ae',  role: 'Junior Auditor' },
];

// ── Workload, built from ORG_STATIC_DATA (audit-firm mode) ─────────────────────

/** One auditable engagement scope, flattened from ORG_STATIC_DATA. */
interface AssignableScope {
  companyId: number;
  companyName: string;
  divisionId: number;
  divisionName: string;
  subDivisionId: number;
  subDivisionName: string;
  scopeValue: string;
  scopeLabel: string;
  role: AssignmentRole;
}

/** Turns "Financial Statement Audit" into "financial_statement_audit". */
function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

let _flattenedScopesCache: AssignableScope[] | null = null;

/**
 * Flattens ORG_STATIC_DATA's Company -> Division -> Sub-division -> Scope tree
 * into a flat list of assignable engagement scopes, computed once and
 * cached. Company/division/sub-division ids here are simple sequence numbers
 * (ORG_STATIC_DATA identifies those levels by string codes, e.g.
 * "ANJ-DXB-01", not numeric ids) — swap this numbering out once the real
 * API returns numeric ids for assignments.
 */
function getFlattenedScopes(): AssignableScope[] {
  if (_flattenedScopesCache) return _flattenedScopesCache;

  const flattened: AssignableScope[] = [];
  let companySeq = 0;
  let divisionSeq = 0;
  let subDivisionSeq = 0;

  for (const company of ORG_STATIC_DATA as OrgCompany[]) {
    companySeq += 1;
    const companyId = companySeq;

    for (const division of company.divisions) {
      divisionSeq += 1;
      const divisionId = divisionSeq;

      for (const subDivision of division.subDivisions) {
        subDivisionSeq += 1;
        const subDivisionId = subDivisionSeq;

        subDivision.scopes.forEach((scope: OrgSubDivisionScope, scopeIdx: number) => {
          flattened.push({
            companyId,
            companyName: company.companyName,
            divisionId,
            divisionName: division.divisionName,
            subDivisionId,
            subDivisionName: subDivision.subDivisionName,
            scopeValue: slugify(scope.scopeName),
            scopeLabel: scope.scopeName,
            role: scopeIdx % 2 === 0 ? AssignmentRoles.Preparer : AssignmentRoles.Reviewer,
          });
        });
      }
    }
  }

  _flattenedScopesCache = flattened;
  return flattened;
}

/**
 * Returns a deterministic, auditor-specific slice of engagement scopes
 * drawn from ORG_STATIC_DATA, so each auditor's demo workload reflects
 * real client companies/divisions/sub-divisions/scopes rather than one
 * fixed fictional list shared by everyone. Auditors flagged as having no
 * assignments still return an empty workload (demo the empty state).
 */
function buildMockWorkload(auditorId: number): WorkloadItem[] {
  if (AUDITORS_WITHOUT_WORKLOAD.has(auditorId)) return [];

  const pool = getFlattenedScopes();
  if (pool.length === 0) return [];

  const ITEMS_PER_AUDITOR = MOCK_ITEMS_PER_AUDITOR;
  const start = (auditorId * MOCK_WORKLOAD_OFFSET_STEP) % pool.length; // stable per-auditor offset into the pool

  let seq: number = ID_SEQUENCE_START.MockWorkload;
  const id = () => ++seq;

  const items: WorkloadItem[] = [];
  const count = Math.min(ITEMS_PER_AUDITOR, pool.length);
  for (let i = 0; i < count; i++) {
    const scope = pool[(start + i) % pool.length];
    items.push({
      assignmentId: id(),
      companyId: scope.companyId,
      companyName: scope.companyName,
      divisionId: scope.divisionId,
      divisionName: scope.divisionName,
      subDivisionId: scope.subDivisionId,
      subDivisionName: scope.subDivisionName,
      scopeValue: scope.scopeValue,
      scopeLabel: scope.scopeLabel,
      role: scope.role,
      jobId: id(),
      jobName: mockJobName(scope.scopeLabel, scope.subDivisionName),
    });
  }
  return items;
}

// ── Internal-audit mode: auditors + workload from the static indi-org seed ─────
//
// There's no multi-client roster to page through here — DAR Exchange audits
// itself — so instead of ORG_STATIC_DATA's slugified/round-robin-assigned
// scopes, this reads SCOPE_INDI_ORG_COMPANIES directly, including its real
// per-scope `assignedAuditors` / `assignedReviewers` and per-task
// `assignedAuditor`, rather than fabricating an assignment.
//
// Job granularity: scopes with populated `tasks[]` (currently only the 3
// AML/CFT sub-scopes SC-5001/5002/5003) produce one job per task; every
// other scope (`tasks: []`) produces a single job for the whole scope.

/**
 * The static seed only carries auditors as plain login strings
 * ('bob', 'emma', 'frank-chen'), not full user records. This is the
 * internal-audit roster's AuditorUser list — extend it if the seed data
 * grows more logins. Ids are a separate numeric range (100s) so they never
 * collide with MOCK_AUDITORS' ids (1–7).
 */
const INDI_ORG_AUDITORS: AuditorUser[] = [
  { id: 101, name: 'Bob',        email: 'bob@darexchange.example',        role: 'Preparer' },
  { id: 102, name: 'Emma',       email: 'emma@darexchange.example',       role: 'Preparer' },
  { id: 103, name: 'Frank Chen', email: 'frank.chen@darexchange.example', role: 'Reviewer' },
];

const INDI_ORG_LOGIN_BY_ID = new Map<number, string>(
  INDI_ORG_AUDITORS.map(a => [a.id, a.name === 'Frank Chen' ? 'frank-chen' : a.name.toLowerCase()]),
);

interface IndiOrgAssignment {
  companyId: number;       companyName: string;
  divisionId: number;      divisionName: string;
  subDivisionId: number;   subDivisionName: string;
  scopeValue: string;      scopeLabel: string;
  jobName: string;
  /** Stable identity for this exact job (task id, or the scope id for a scope-level job) — used to key assignmentId/jobId, never the display name (two jobs can share a name). */
  jobKey: string;
  role: AssignmentRole;
  login: string;
}

let _indiOrgAssignmentsCache: IndiOrgAssignment[] | null = null;

/** Have we already warned about a given missing-field key? (avoid console spam) */
const _indiOrgWarnedOnce = new Set<string>();
function warnOnce(key: string, msg: string): void {
  if (_indiOrgWarnedOnce.has(key)) return;
  _indiOrgWarnedOnce.add(key);
  console.warn(msg);
}

// ── Division display names: sourced from DIVISION_INDI_ORG_COMPANIES ───────────

let _indiOrgDivisionNameCache: Map<string, string> | null = null;

/**
 * divisionCode → divisionName, built once from DIVISION_INDI_ORG_COMPANIES
 * (division static data) — the source of truth for division display names here.
 */
function getIndiOrgDivisionNameLookup(): Map<string, string> {
  if (_indiOrgDivisionNameCache) return _indiOrgDivisionNameCache;

  const map = new Map<string, string>();
  for (const company of DIVISION_INDI_ORG_COMPANIES) {
    for (const division of company.divisions) {
      map.set(division.divisionCode, division.divisionName);
    }
  }
  _indiOrgDivisionNameCache = map;
  return map;
}

/**
 * Flattens SCOPE_INDI_ORG_COMPANIES into one row per (login x job x role),
 * computed once and cached, mirroring getFlattenedScopes() above but
 * reading the seed's real assignment fields instead of fabricating one.
 *
 * Company/division/sub-division nesting in SCOPE_INDI_ORG_COMPANIES is only
 * used to REACH each scope — every StaticScope record also carries its own
 * `divisionCode` and `subDivisionName` directly (see makeScope /
 * makeDepartmentScope in that file), and those own fields are what's used
 * here, per your instruction: scope name/sub-division from the scope static
 * data itself, division name looked up from the division static data
 * (DIVISION_INDI_ORG_COMPANIES) by that divisionCode. This is more reliable
 * than trusting the wrapping division/sub-division objects' own name fields.
 *
 * Only scopes with `workflowStatus === 'Approved'` are included — everything
 * still Not Started / In Progress / Overdue / Completed is excluded from
 * the reassignment screen entirely.
 */
function getIndiOrgAssignments(): IndiOrgAssignment[] {
  if (_indiOrgAssignmentsCache) return _indiOrgAssignmentsCache;

  const flattened: IndiOrgAssignment[] = [];
  const divisionNameByCode = getIndiOrgDivisionNameLookup();

  let companySeq = 0;
  const divisionIdByCode = new Map<string, number>();
  const subDivisionIdByKey = new Map<string, number>();
  let nextDivisionId = 0;
  let nextSubDivisionId = 0;

  for (const company of SCOPE_INDI_ORG_COMPANIES) {
    companySeq += 1;
    const companyId = companySeq;
    const companyName = company.companyName || company.tag || companyFallbackName(companyId);

    for (const division of company.divisions) {
      for (const subDivision of division.subDivisions) {
        for (const scope of subDivision.scopes) {
          if (scope.workflowStatus !== REASSIGNABLE_SCOPE_STATUS) continue;

          // Scope's OWN divisionCode/subDivisionName — set directly on every
          // StaticScope record, independent of where it's nested.
          const divisionCode = scope.divisionCode;
          const subDivisionName = scope.subDivisionName || subDivisionFallbackName(divisionCode);

          if (!divisionIdByCode.has(divisionCode)) divisionIdByCode.set(divisionCode, ++nextDivisionId);
          const divisionId = divisionIdByCode.get(divisionCode)!;

          const subDivisionKey = `${divisionCode}::${subDivisionName}`;
          if (!subDivisionIdByKey.has(subDivisionKey)) subDivisionIdByKey.set(subDivisionKey, ++nextSubDivisionId);
          const subDivisionId = subDivisionIdByKey.get(subDivisionKey)!;

          const divisionName = divisionNameByCode.get(divisionCode) || divisionCode || divisionFallbackName(divisionId);
          if (!divisionNameByCode.has(divisionCode)) {
            warnOnce(`division:${divisionCode}`,
              `[auditor-reassignment] scope "${scope.id}" has divisionCode "${divisionCode}", which was not found in DIVISION_INDI_ORG_COMPANIES — falling back to "${divisionName}". Check for a divisionCode mismatch between audit-scope-static-indi-org.data.ts and division-static-indi-org.data.ts.`);
          }

          const pushRow = (login: string, role: AssignmentRole, jobName: string, jobKey: string) => {
            flattened.push({
              companyId, companyName,
              divisionId, divisionName,
              subDivisionId, subDivisionName,
              scopeValue: scope.id, scopeLabel: scope.scopeName,
              jobName, jobKey, role, login,
            });
          };

          if (scope.tasks && scope.tasks.length > 0) {
            for (const task of scope.tasks) {
              // Tasks don't carry their own preparer/reviewer distinction in
              // the static data — treated as preparer work. jobKey uses the
              // task's own id (not its display name) so two tasks that
              // happen to share a name never collide into one job.
              if (task.assignedAuditor) pushRow(task.assignedAuditor, AssignmentRoles.Preparer, task.taskName, `task:${task.id}`);
            }
          } else {
            (scope.assignedAuditors ?? []).forEach(login =>
              pushRow(login, AssignmentRoles.Preparer, scope.scopeName, `scope:${scope.id}:${AssignmentRoles.Preparer}:${login}`));
            (scope.assignedReviewers ?? []).forEach(login =>
              pushRow(login, AssignmentRoles.Reviewer, scope.scopeName, `scope:${scope.id}:${AssignmentRoles.Reviewer}:${login}`));
          }
        }
      }
    }
  }

  _indiOrgAssignmentsCache = flattened;
  return flattened;
}

// Stable assignmentId/jobId per (row) so re-selecting the same auditor keeps
// the same ids (staging/busy state is keyed by these numbers).
const _indiOrgIdCache = new Map<string, { assignmentId: number; jobId: number }>();
let _indiOrgIdSeq: number = ID_SEQUENCE_START.ServiceIndiOrg; // separate id space from buildMockWorkload's 1000+ range

function buildIndiOrgWorkload(auditorId: number): WorkloadItem[] {
  const login = INDI_ORG_LOGIN_BY_ID.get(auditorId);
  if (!login) return [];

  return getIndiOrgAssignments()
    .filter(row => row.login === login)
    .map(row => {
      // Keyed by jobKey (task id / scope id), NOT jobName — two distinct
      // jobs that happen to share a display name must still get distinct
      // assignmentId/jobId, or they'd silently collapse into one entry and
      // undercount the scope's "N jobs" total.
      const key = row.jobKey;
      let ids = _indiOrgIdCache.get(key);
      if (!ids) {
        ids = { assignmentId: ++_indiOrgIdSeq, jobId: ++_indiOrgIdSeq };
        _indiOrgIdCache.set(key, ids);
      }
      return {
        assignmentId: ids.assignmentId,
        companyId: row.companyId, companyName: row.companyName,
        divisionId: row.divisionId, divisionName: row.divisionName,
        subDivisionId: row.subDivisionId, subDivisionName: row.subDivisionName,
        scopeValue: row.scopeValue, scopeLabel: row.scopeLabel,
        jobId: ids.jobId, jobName: row.jobName,
        role: row.role,
      };
    });
}