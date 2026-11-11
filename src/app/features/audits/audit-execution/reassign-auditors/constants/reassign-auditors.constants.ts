/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * in the mock / seed workload stay assignable to the derived types below.
 */

import { ScopeJobFrequencies, type ScopeJobFrequency } from '@/app/features/audits/audit-plan/scope-job/constants/scope-job.constants';

/** Role an auditor holds on a job. */
export const AssignmentRoles = {
  Preparer: 'preparer',
  Reviewer: 'reviewer',
} as const;
export type AssignmentRole = typeof AssignmentRoles[keyof typeof AssignmentRoles];

/** Role filter value meaning "no role filter". */
export const ROLE_FILTER_ALL = 'all';
export type RoleFilter = typeof ROLE_FILTER_ALL | AssignmentRole;

/** Picker target meaning "the whole scope" (otherwise it's a job's assignment id). */
export const SCOPE_PICKER_TARGET = 'scope';
export type PickerTarget = typeof SCOPE_PICKER_TARGET | number;

/** Only scopes in this workflow status can be reassigned (internal-audit seed). */
export const REASSIGNABLE_SCOPE_STATUS = 'Approved';

/* ── Generated jobs (internal-audit seed) ─────────────────────────────────
 * A scope generates one job per occurrence of its audit frequency. */

export const FREQUENCY_JOB_COUNT: Record<ScopeJobFrequency, number> = {
  [ScopeJobFrequencies.Annually]: 1,
  [ScopeJobFrequencies.Quarterly]: 4,
  [ScopeJobFrequencies.Monthly]: 12,
};

/** Suffix labels for each occurrence; `null` (annually) means a single unlabelled job. */
export const FREQUENCY_JOB_SUFFIXES: Record<ScopeJobFrequency, string[] | null> = {
  [ScopeJobFrequencies.Annually]: null,
  [ScopeJobFrequencies.Quarterly]: ['Q1', 'Q2', 'Q3', 'Q4'],
  [ScopeJobFrequencies.Monthly]: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
};

/** Jobs generated for a scope with no (or an unknown) audit frequency. */
export const DEFAULT_JOB_COUNT = 1;

/* ── Configuration ────────────────────────────────────────────────────── */

export const MS_PER_DAY = 86_400_000;
export const MS_PER_HOUR = 3_600_000;
export const MS_PER_MINUTE = 60_000;

/** Undo toast auto-dismiss delay. */
export const UNDO_TOAST_DURATION_MS = 6000;

/** Simulated latency of the mock service calls. */
export const REASSIGN_MOCK_LATENCY_MS = {
  Auditors: 300,
  Workload: 500,
  Reassign: 400,
} as const;

/** Mock workload (audit-firm mode): jobs per auditor, and the per-auditor offset into the scope pool. */
export const MOCK_ITEMS_PER_AUDITOR = 8;
export const MOCK_WORKLOAD_OFFSET_STEP = 3;

/** Starting points of the separate id spaces used by the mock / seed workloads. */
export const ID_SEQUENCE_START = {
  MockWorkload: 1000,
  ServiceIndiOrg: 5000,
  AdapterIndiOrg: 1,
} as const;

/** Words of a name used for avatar initials. */
export const INITIALS_WORD_COUNT = 2;

/** Effective-period date-time pickers. */
export const REASSIGN_DATE_PICKER = {
  DateFormat: 'dd M yy',
  HourFormat: '24',
} as const;

/** Staged-chip date display. */
export const STAGED_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

/** Skeleton bars shown while a workload loads. */
export const SKELETON_BAR_COUNT = 3;
