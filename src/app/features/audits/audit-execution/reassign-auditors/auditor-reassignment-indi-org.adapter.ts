// app/data/auditor-reassignment-indi-org.adapter.ts
//
// Bridges the "Reassign Auditor Workload" feature to the internal-audit
// static seed data (SCOPE_INDI_ORG_COMPANIES) so that when CLIENT_MODE is
// 'internal-audit', the company → division → sub-division → scope tree shown
// for reassignment comes from the active internal-audit client's static seed
// (DAR Exchange / XYZ Broadcast, per INTERNAL_AUDIT_CLIENT_KEY_VALUE) instead
// of a live multi-company workload API.
//
// This file is the one actually wired into auditor-reassignment.component.ts
// (it imports buildIndiOrgAuditorOptions / buildIndiOrgWorkload from here,
// not from AuditorReassignmentService — the service's own internal-audit
// code paths are dead code; see the note near the bottom of this file).
//
// ── 2026-09-15 fixes ─────────────────────────────────────────────────────
// 1. Only 'Approved' scopes are eligible for reassignment (was: every
//    scope regardless of workflowStatus).
// 2. divisionName / companyName / subDivisionName / jobId are now populated —
//    divisionName resolved from DIVISION_INDI_ORG_COMPANIES by divisionCode,
//    the source of truth (was: pushJob() never set these fields at all, so
//    the UI rendered blank division names).
// 3. Job count per scope is now driven by the scope's `auditFrequency`
//    (annually → 1 job, quarterly → 4, monthly → 12), confirmed against
//    your expected total: this seed's 5 Approved scopes are SC-6501 (AML,
//    quarterly=4), SC-6701 (Consumer Protection sub-division, monthly=12), SC-5100
//    (Operations, annually=1), SC-5200 (Quality Check TMS, quarterly=4),
//    SC-5300 (Consumer Protection & Market Conduct, quarterly=4) → for
//    'bob' (in every scope's assignedAuditors) that's 4+12+1+4+4 = 25,
//    matching what you expect. This REPLACES the previous per-task
//    expansion (one job per entry in `scope.tasks[]`), which is why counts
//    were off before — SC-5100/5200/5300 each carry a large `tasks[]`
//    array (23/19/17 items) that was being expanded into one job per task
//    instead of one job per frequency occurrence. `tasks[]` is no longer
//    used for job-count purposes on this screen at all.
//    If some scopes should still expand per-task instead of per-frequency,
//    say which ones and I'll special-case them.
//
// ASSUMPTIONS MADE WITHOUT SEEING YOUR REAL CODE (please verify / adjust):
//
// 1. `WorkloadItem` shape now confirmed from models/auditor-reassignment.ts
//    you shared: companyId/divisionId/subDivisionId/jobId are `number`, not
//    string codes — this file now assigns each distinct company/division/
//    sub-division a stable sequential numeric id the same way
//    auditor-reassignment.service.ts's getFlattenedScopes()/
//    getIndiOrgAssignments() already do, instead of reusing divisionCode /
//    subDivisionName as the id (which used to violate the interface via an
//    `as unknown as WorkloadItem` cast).
//
// 2. Occurrence labels — quarterly jobs are suffixed "– Q1".."Q4" and
//    monthly jobs "– M1".."M12" in jobName so the 4 (or 12) rows per scope
//    aren't indistinguishable; annually stays a single unsuffixed job. Say
//    if you want different labels (e.g. actual calendar quarters/months).
//
// 3. Auditor identity — the static data only carries auditors as plain
//    login strings ('bob', 'emma', 'frank-chen'), not full user records,
//    and PendingReassign.toAuditorId / selectedAuditorId are typed as
//    `number` throughout the existing components. INDI_ORG_AUDITOR_DIRECTORY
//    below assigns each login a stable synthetic numeric id purely so the
//    existing picker/staging code keeps working unchanged. If your app
//    already maps these logins to real numeric user ids somewhere, replace
//    this directory with that mapping instead.
//
// 4. CLIENT_MODE — resolved: your client-mode.ts exports both
//    `CLIENT_MODE_VALUE` (a plain constant, read directly by the static seed
//    files since they're evaluated at import time, before DI exists) and
//    `CLIENT_MODE` (an InjectionToken provided from that same constant in
//    app.config.ts, for use in services/components via `inject()`). This
//    adapter only builds data — it doesn't gate on client mode itself; the
//    gating happens in auditor-reassignment.component.ts via
//    `inject(CLIENT_MODE)`, matching how the rest of the component already
//    uses `inject()`. Adjust the import path below to wherever client-mode.ts
//    actually lives in your project (I only received the file itself, not
//    its path).

import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';

// TODO: adjust this import path to wherever division-static-indi-org.data.ts
// actually lives in your project — same caveat as the SCOPE_INDI_ORG_COMPANIES
// import above, I only received the individual files, not their real paths.
// divisionName for internal-audit workload rows is sourced from here (per your
// note that division static data is the source of truth), NOT from
// SCOPE_INDI_ORG_COMPANIES's own division objects' divisionName field, even
// though those also happen to carry one.
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';

import { INTERNAL_AUDIT_CLIENT_KEY_VALUE, type InternalAuditClientKey } from '@/app/core/config/client-mode';

// Adjust this import path if your real model file lives elsewhere.
import type { AssignmentRole, AuditorOption, WorkloadItem } from './models/auditor-reassignment.model';
import { type ScopeJobFrequency } from '@/app/features/audits/audit-plan/scope-job/constants/scope-job.constants';
import {
  AssignmentRoles,
  DEFAULT_JOB_COUNT,
  FREQUENCY_JOB_COUNT,
  FREQUENCY_JOB_SUFFIXES,
  ID_SEQUENCE_START,
  INITIALS_WORD_COUNT,
  REASSIGNABLE_SCOPE_STATUS,
} from './constants/reassign-auditors.constants';
import {
  companyFallbackName,
  jobOccurrenceSuffix,
  subDivisionFallbackName,
} from './constants/reassign-auditors-messages.constants';

// ── Auditor directory (static-data logins → pickable AuditorOption) ──────────

interface IndiOrgAuditor {
  id: number;
  login: string;
  label: string;
  role: string;
  email: string;
}

/**
 * One auditor directory per internal-audit client. Logins must match that
 * client's scope seed (assignedAuditors / assignedReviewers in
 * audit-scope-static-indi-org.data.ts / audit-scope-static-xyz-org.data.ts),
 * otherwise the picked auditor's workload comes back empty. Ids are kept in
 * separate ranges per client so they never collide.
 */
const AUDITOR_DIRECTORY_BY_CLIENT: Record<InternalAuditClientKey, IndiOrgAuditor[]> = {
  'dar-exchange': [
    { id: 9001, login: 'bob', label: 'Bob', role: 'Preparer', email: 'bob@darexchange.example' },
    { id: 9002, login: 'emma', label: 'Emma', role: 'Preparer', email: 'emma@darexchange.example' },
    { id: 9003, login: 'frank-chen', label: 'Frank Chen', role: 'Reviewer', email: 'frank.chen@darexchange.example' },
  ],
  'xyz-broadcast': [
    { id: 9101, login: 'bob', label: 'Bob', role: 'Preparer', email: 'bob@xyzbroadcast.example' },
    { id: 9102, login: 'emma', label: 'Emma', role: 'Preparer', email: 'emma@xyzbroadcast.example' },
    { id: 9103, login: 'frank-chen', label: 'Frank Chen', role: 'Reviewer', email: 'frank@xyzbroadcast.example' },
  ],
  'lulu-exchange': [
    { id: 9201, login: 'bob', label: 'Bob', role: 'Preparer', email: 'bob@luluexchange.example' },
    { id: 9202, login: 'emma', label: 'Emma', role: 'Preparer', email: 'emma@luluexchange.example' },
    { id: 9203, login: 'frank-chen', label: 'Frank Chen', role: 'Reviewer', email: 'frank.chen@luluexchange.example' },
  ],
  // 'dar-exchangess': [
  //   { id: 9001, login: 'bob', label: 'Bob', role: 'Preparer', email: 'bob@darexchange.example' },
  //   { id: 9002, login: 'emma', label: 'Emma', role: 'Preparer', email: 'emma@darexchange.example' },
  //   { id: 9003, login: 'frank-chen', label: 'Frank Chen', role: 'Reviewer', email: 'frank.chen@darexchange.example' },
  // ],
};

/** The active client's directory, picked by INTERNAL_AUDIT_CLIENT_KEY_VALUE. */
const INDI_ORG_AUDITOR_DIRECTORY: IndiOrgAuditor[] = AUDITOR_DIRECTORY_BY_CLIENT[INTERNAL_AUDIT_CLIENT_KEY_VALUE];

function initialsOf(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, INITIALS_WORD_COUNT)
    .toUpperCase();
}

/** Build the auditor picker options directly from the internal-audit static seed's auditor logins. */
export function buildIndiOrgAuditorOptions(): AuditorOption[] {
  return INDI_ORG_AUDITOR_DIRECTORY.map(a => ({
    value: a.id,
    label: a.label,
    initials: initialsOf(a.label),
    role: a.role,
    email: a.email,
  }));
}

function loginForAuditorId(auditorId: number): string | undefined {
  return INDI_ORG_AUDITOR_DIRECTORY.find(a => a.id === auditorId)?.login;
}

// ── Division display names: sourced from DIVISION_INDI_ORG_COMPANIES ───────────
//
// divisionCode → divisionName, built once from DIVISION_INDI_ORG_COMPANIES
// (division static data) — the source of truth for division display names
// here, mirroring getIndiOrgDivisionNameLookup() in auditor-reassignment.service.ts.

let _divisionNameByCodeCache: Map<string, string> | null = null;
const _warnedMissingDivision = new Set<string>();

function getDivisionNameLookup(): Map<string, string> {
  if (_divisionNameByCodeCache) return _divisionNameByCodeCache;

  const map = new Map<string, string>();
  for (const company of DIVISION_INDI_ORG_COMPANIES) {
    for (const division of company.divisions) {
      map.set(division.divisionCode, division.divisionName);
    }
  }
  _divisionNameByCodeCache = map;
  return map;
}

// ── Frequency → job-occurrence count ────────────────────────────────────────
//
// Confirmed rule: a scope generates one job per occurrence of its audit
// frequency, independent of PERIOD_START/PERIOD_END and independent of
// whatever `scope.tasks[]` happens to contain. The counts and occurrence
// suffixes (FREQUENCY_JOB_COUNT / FREQUENCY_JOB_SUFFIXES) live in
// ./constants/reassign-auditors.constants.ts.

type AuditFrequency = ScopeJobFrequency;

// ── Flattened (scope × occurrence × role × login) rows ──────────────────────

interface IndiOrgWorkloadRow {
  companyId: number;       companyName: string;
  divisionId: number;      divisionName: string;
  subDivisionId: number;   subDivisionName: string;
  scopeValue: string;      scopeLabel: string;
  jobName: string;
  /** Stable identity for this exact job occurrence — used to key assignmentId/jobId, never the display name. */
  jobKey: string;
  role: AssignmentRole;
  login: string;
}

let _rowsCache: IndiOrgWorkloadRow[] | null = null;

/**
 * Flattens SCOPE_INDI_ORG_COMPANIES into one row per (login × scope ×
 * frequency-occurrence × role), computed once and cached. Only Approved
 * scopes are included. Company/division/sub-division nesting is only used to
 * REACH each scope — every StaticScope record also carries its own
 * `divisionCode` and `subDivisionName` directly, and those own fields are what
 * get used for division/sub-division identity, per your instruction that
 * division static data (DIVISION_INDI_ORG_COMPANIES) is the source of truth
 * for names.
 */
function getIndiOrgWorkloadRows(): IndiOrgWorkloadRow[] {
  if (_rowsCache) return _rowsCache;

  const rows: IndiOrgWorkloadRow[] = [];
  const divisionNameByCode = getDivisionNameLookup();

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
          // Only approved scopes are eligible for reassignment.
          if (scope.workflowStatus !== REASSIGNABLE_SCOPE_STATUS) continue;

          const divisionCode = scope.divisionCode || division.divisionCode;
          const subDivisionName = scope.subDivisionName || subDivision.subDivisionName || subDivisionFallbackName(divisionCode);

          if (!divisionIdByCode.has(divisionCode)) divisionIdByCode.set(divisionCode, ++nextDivisionId);
          const divisionId = divisionIdByCode.get(divisionCode)!;

          const subDivisionKey = `${divisionCode}::${subDivisionName}`;
          if (!subDivisionIdByKey.has(subDivisionKey)) subDivisionIdByKey.set(subDivisionKey, ++nextSubDivisionId);
          const subDivisionId = subDivisionIdByKey.get(subDivisionKey)!;

          const divisionName = divisionNameByCode.get(divisionCode) || divisionCode;
          if (!divisionNameByCode.has(divisionCode) && !_warnedMissingDivision.has(divisionCode)) {
            _warnedMissingDivision.add(divisionCode);
            console.warn(
              `[auditor-reassignment-indi-org.adapter] scope "${scope.id}" has divisionCode "${divisionCode}", ` +
              `which was not found in DIVISION_INDI_ORG_COMPANIES — falling back to "${divisionName}". Check for a ` +
              `divisionCode mismatch between audit-scope-static-indi-org.data.ts and division-static-indi-org.data.ts.`,
            );
          }

          const frequency = scope.auditFrequency as AuditFrequency;
          const occurrences = FREQUENCY_JOB_COUNT[frequency] ?? DEFAULT_JOB_COUNT;
          const labels = FREQUENCY_JOB_SUFFIXES[frequency] ?? null;

          const pushOccurrences = (logins: string[] | undefined, role: AssignmentRole) => {
            (logins ?? []).forEach(login => {
              for (let i = 0; i < occurrences; i++) {
                const suffix = labels ? jobOccurrenceSuffix(labels[i]) : '';
                rows.push({
                  companyId, companyName,
                  divisionId, divisionName,
                  subDivisionId, subDivisionName,
                  scopeValue: scope.id, scopeLabel: scope.scopeName,
                  jobName: `${scope.scopeName}${suffix}`,
                  jobKey: `scope:${scope.id}:${role}:${login}:${i}`,
                  role, login,
                });
              }
            });
          };

          pushOccurrences(scope.assignedAuditors, AssignmentRoles.Preparer);
          pushOccurrences(scope.assignedReviewers, AssignmentRoles.Reviewer);
        }
      }
    }
  }

  _rowsCache = rows;
  return rows;
}

// Stable assignmentId/jobId per jobKey so re-selecting the same auditor keeps
// the same ids (staging/busy state is keyed by these numbers).
const _idCache = new Map<string, { assignmentId: number; jobId: number }>();
let _idSeq: number = ID_SEQUENCE_START.AdapterIndiOrg;
function idsFor(key: string): { assignmentId: number; jobId: number } {
  let ids = _idCache.get(key);
  if (!ids) {
    ids = { assignmentId: _idSeq++, jobId: _idSeq++ };
    _idCache.set(key, ids);
  }
  return ids;
}

/**
 * Build one auditor's full workload (as preparer AND reviewer) from the
 * internal-audit static seed. Only Approved scopes are included, and each
 * contributes one job per audit-frequency occurrence (annually → 1,
 * quarterly → 4, monthly → 12) for every login listed in that scope's
 * `assignedAuditors` (preparer) / `assignedReviewers` (reviewer).
 */
export function buildIndiOrgWorkload(auditorId: number): WorkloadItem[] {
  const login = loginForAuditorId(auditorId);
  if (!login) return [];

  return getIndiOrgWorkloadRows()
    .filter(row => row.login === login)
    .map(row => {
      const ids = idsFor(row.jobKey);
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

// ── Note: duplicate logic in auditor-reassignment.service.ts ───────────────
//
// AuditorReassignmentService.getAuditors() / getWorkload() already have their
// own 'internal-audit' code paths (INDI_ORG_AUDITORS / buildIndiOrgWorkload
// defined inside that file), but AuditorReassignmentComponent never calls
// them in internal-audit mode — ngOnInit() and onAuditorChange() call
// buildIndiOrgAuditorOptions() / buildIndiOrgWorkload() from THIS file
// instead, so the service-side implementation is dead code, and now also
// out of date with the frequency-based job-count rule above. Worth deleting
// one of the two once you've confirmed this fix works, so the logic only
// lives in one place.