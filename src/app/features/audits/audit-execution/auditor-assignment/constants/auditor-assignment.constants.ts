/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * in the mock assignments stay assignable to the derived types below.
 */

/** Role an auditor is assigned to on a scope. */
export const AssignmentTypes = {
  Preparer: 'preparer',
  Reviewer: 'reviewer',
} as const;
export type AssignmentType = typeof AssignmentTypes[keyof typeof AssignmentTypes];

/** Form control names of the Assign Auditors form. */
export const AssignmentFormControls = {
  Company: 'company',
  Division: 'division',
  Subdivision: 'subdivision',
  Scope: 'scope',
  Job: 'job',
  EstimatedStart: 'estimatedStart',
  EstimatedEnd: 'estimatedEnd',
  Preparers: 'preparers',
  Reviewers: 'reviewers',
  AuditorId: 'auditorId',
} as const;
export type AssignmentFormControl = typeof AssignmentFormControls[keyof typeof AssignmentFormControls];

/** Cascade order: changing one control resets every control after it. */
export const ASSIGNMENT_CASCADE_CHAIN: AssignmentFormControl[] = [
  AssignmentFormControls.Division,
  AssignmentFormControls.Subdivision,
  AssignmentFormControls.Scope,
  AssignmentFormControls.Job,
];

/** Job time-estimation controls, enabled only once a job is chosen. */
export const ASSIGNMENT_ESTIMATION_CONTROLS: AssignmentFormControl[] = [
  AssignmentFormControls.EstimatedStart,
  AssignmentFormControls.EstimatedEnd,
];

/** Error key set by jobDateRangeValidator when end is not after start. */
export const DATE_RANGE_ERROR_KEY = 'dateRange';

/* ── Generated job values ─────────────────────────────────────────────────
 * Job option values are `<scope name>::<period>` — e.g. 'Cash::M3', 'Cash::Q2',
 * 'Cash::ANNUAL'. */

export const JOB_VALUE_SEPARATOR = '::';

export const JOB_PERIOD_CODES = {
  MonthPrefix: 'M',
  QuarterPrefix: 'Q',
  Annual: 'ANNUAL',
} as const;

export const QUARTER_NUMBERS = [1, 2, 3, 4];

/* ── Configuration ────────────────────────────────────────────────────── */

/** Words of the auditor's name used for the avatar initials. */
export const AUDITOR_INITIALS_WORD_COUNT = 2;

/** Estimated start / end date-time pickers. */
export const ESTIMATION_PICKER = {
  DateFormat: 'dd/mm/yy',
  HourFormat: '12',
  StepMinute: 5,
} as const;

export const MS_PER_MINUTE = 60_000;
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 1440;

/** Back-end endpoints used by AuditorAssignmentService. */
export const AUDITOR_ASSIGNMENT_API = {
  Assignments: '/api/auditor-assignments',
  Users: '/api/users',
  AuditorsPath: 'auditors',
} as const;
