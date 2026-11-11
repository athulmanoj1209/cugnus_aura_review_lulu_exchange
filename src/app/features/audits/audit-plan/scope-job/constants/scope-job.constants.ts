/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_SCOPE_JOBS, the scope static data the jobs
 * are generated from) stay assignable to the derived types below.
 */

export const ScopeJobStatuses = {
  Pending: 'pending',
  InProgress: 'in_progress',
  Completed: 'completed',
  Overdue: 'overdue',
} as const;
export type ScopeJobStatus = typeof ScopeJobStatuses[keyof typeof ScopeJobStatuses];

export const ScopeJobFrequencies = {
  Monthly: 'monthly',
  Quarterly: 'quarterly',
  Annually: 'annually',
} as const;
export type ScopeJobFrequency = typeof ScopeJobFrequencies[keyof typeof ScopeJobFrequencies];

export const ScopeJobModesOfAudit = {
  Full: 'full',
  Limited: 'limited',
  Thematic: 'thematic',
  FollowUp: 'follow-up',
  Continuous: 'continuous',
} as const;
export type ScopeJobModeOfAudit = typeof ScopeJobModesOfAudit[keyof typeof ScopeJobModesOfAudit];

export const ScopeTaskStatuses = {
  Open: 'open',
  InProgress: 'in_progress',
  Completed: 'completed',
  Overdue: 'overdue',
} as const;
export type ScopeTaskStatus = typeof ScopeTaskStatuses[keyof typeof ScopeTaskStatuses];

export const ScopeTaskPriorities = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;
export type ScopeTaskPriority = typeof ScopeTaskPriorities[keyof typeof ScopeTaskPriorities];

/** Control rating recorded on a task. */
export const ScopeJobControlRatings = {
  Strong: 'strong',
  Moderate: 'moderate',
  Weak: 'weak',
} as const;
export type ScopeJobControlRating = typeof ScopeJobControlRatings[keyof typeof ScopeJobControlRatings];

/** Overall rating captured when a job / task is marked completed. */
export const ScopeJobOverallRatings = {
  Satisfactory: 'satisfactory',
  NeedsImprovement: 'needs_improvement',
  Unsatisfactory: 'unsatisfactory',
} as const;
export type ScopeJobOverallRating = typeof ScopeJobOverallRatings[keyof typeof ScopeJobOverallRatings];

/** What the status-update drawer is updating. */
export const ScopeJobStatusUpdateTargets = {
  Job: 'job',
  Task: 'task',
} as const;
export type ScopeJobStatusUpdateTarget = typeof ScopeJobStatusUpdateTargets[keyof typeof ScopeJobStatusUpdateTargets];

/** `type` of the result the status-update drawer closes with. */
export const SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE = 'status-update';

export const SubScopeRisks = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type SubScopeRisk = typeof SubScopeRisks[keyof typeof SubScopeRisks];

/** Grid / list toggle on the Scope Jobs page. */
export const ScopeJobViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type ScopeJobViewMode = typeof ScopeJobViewModes[keyof typeof ScopeJobViewModes];

/** Sortable columns of the Scope Jobs list view. */
export const ScopeJobSortColumns = {
  Id: 'id',
  Title: 'title',
  ScopeName: 'scopeName',
  PeriodStart: 'periodStart',
  PeriodEnd: 'periodEnd',
  Status: 'status',
  Company: 'company',
  SubDivision: 'subDivision',
  CreatedDate: 'createdDate',
} as const;
export type ScopeJobSortColumn = typeof ScopeJobSortColumns[keyof typeof ScopeJobSortColumns];

export const ScopeJobSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type ScopeJobSortDirection = typeof ScopeJobSortDirections[keyof typeof ScopeJobSortDirections];

/** Keys of the active-filter chips on the Scope Jobs page. */
export const ScopeJobFilterKeys = {
  Scopes: 'scopes',
  Statuses: 'statuses',
  Frequencies: 'frequencies',
  Companies: 'companies',
  Divisions: 'divisions',
  SubDivisions: 'subDivisions',
  Auditors: 'auditors',
  Period: 'period',
} as const;
export type ScopeJobFilterKey = typeof ScopeJobFilterKeys[keyof typeof ScopeJobFilterKeys];

/** Activate / deactivate action shown in the Scope Jobs confirmation dialog. */
export const ScopeJobBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type ScopeJobBlockAction = typeof ScopeJobBlockActions[keyof typeof ScopeJobBlockActions];

/* ── Configuration ────────────────────────────────────────────────────── */

export const SCOPE_JOB_DRAWER = {
  Profile: { width: '720px', styleClass: 'scope-job-profile-drawer' },
  Edit: { width: '680px', styleClass: 'edit-scope-job-drawer' },
  JobStatusUpdate: { width: '480px', styleClass: 'status-update-drawer' },
  TaskStatusUpdate: { width: '600px', styleClass: 'status-update-drawer' },
} as const;

export const SCOPE_JOB_LIST_PAGE_SIZE = 10;

export const SCOPE_JOB_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

/** Rows per page of the task list (profile + edit drawers). */
export const SCOPE_JOB_TASK_PAGE_SIZE = 5;

/** Auditors / reviewers per page on the profile drawer. */
export const SCOPE_JOB_PERSON_PAGE_SIZE = 3;

/** Auditor avatars shown before the "+N" bubble, per list view. */
export const SCOPE_JOB_AVATAR_STACK_MAX = {
  List: 3,
  Grid: 4,
} as const;

/** Up to this many pages the task pager shows every page number (no ellipsis). */
export const SCOPE_JOB_PAGER_MAX_FULL_PAGES = 7;

/** Prefix + zero-padded number of generated scope-job ids (SJ-001). */
export const SCOPE_JOB_ID_PREFIX = 'SJ';
export const SCOPE_JOB_ID_PAD_LENGTH = 3;

/** Task ids are `<job id>-T<nn>`. */
export const SCOPE_TASK_ID_INFIX = '-T';
export const SCOPE_TASK_ID_PAD_LENGTH = 2;

/** Mock task generation: each job gets Min + (seed % Variants) tasks (4, 5 or 6). */
export const SCOPE_JOB_MOCK_TASK_COUNT = {
  Min: 4,
  Variants: 3,
} as const;

/** Mock job generation: share of past periods marked overdue instead of completed. */
export const SCOPE_JOB_MOCK_OVERDUE_RATIO = 0.3;

/** Length / range limits for the scope-job forms. */
export const SCOPE_JOB_FIELD_LIMITS = {
  CompletionNoteMax: 500,
  TaskTitleMin: 3,
  TaskTitleMax: 120,
  TaskObjectiveMax: 500,
  StatusNoteMax: 1000,
  AuditOverviewMax: 2000,
  TimeSpentHoursMin: 0.1,
  TimeSpentHoursMax: 99999,
} as const;

/** Locale used for every date shown in the module. */
export const SCOPE_JOB_DATE_LOCALE = 'en-GB';

export const MS_PER_DAY = 86_400_000;
export const MS_PER_HOUR = 3_600_000;
export const MS_PER_MINUTE = 60_000;

/** Category shown for every sub-scope on the profile drawer. */
export const SUBSCOPE_DEFAULT_CATEGORY = 'Departmental';

/** Org used for scope jobs opened from the audit plan — replace with the session's org. */
export const SCOPE_JOB_DEFAULT_ORG = {
  company: 'Crowe UAE',
  division: 'Dubai',
} as const;

/** Auditor shown on the status-update note when the job has none assigned. */
export const SCOPE_JOB_DEFAULT_AUDITOR_ID = 'alice';
