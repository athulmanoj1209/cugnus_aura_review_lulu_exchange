/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (AUDIT_PLAN_MOCK, MOCK_PLANS) stay assignable to
 * the derived types below.
 */

/** Status of one scheduled audit instance (scope × month) on the calendar views. */
export const InstanceStatuses = {
  Completed: 'completed',
  InProgress: 'inprog',
  Planned: 'planned',
  Overdue: 'overdue',
} as const;
export type InstanceStatus = typeof InstanceStatuses[keyof typeof InstanceStatuses];

/** Display / legend order of instance statuses. */
export const INSTANCE_STATUS_ORDER = [
  InstanceStatuses.Completed,
  InstanceStatuses.InProgress,
  InstanceStatuses.Planned,
  InstanceStatuses.Overdue,
] as const;

/** Priority used when rolling several scopes' status up into one track cell. */
export const INSTANCE_STATUS_SEVERITY: Record<InstanceStatus, number> = {
  [InstanceStatuses.Overdue]: 3,
  [InstanceStatuses.InProgress]: 2,
  [InstanceStatuses.Planned]: 1,
  [InstanceStatuses.Completed]: 0,
};

export const Frequencies = {
  Weekly: 'W',
  BiWeekly: 'BW',
  Monthly: 'M',
  Quarterly: 'Q',
  HalfYearly: 'HY',
  Yearly: 'Y',
} as const;
export type Frequency = typeof Frequencies[keyof typeof Frequencies];

export const FREQUENCY_ORDER = [
  Frequencies.Weekly,
  Frequencies.BiWeekly,
  Frequencies.Monthly,
  Frequencies.Quarterly,
  Frequencies.HalfYearly,
  Frequencies.Yearly,
] as const;

/** Runs per month: Weekly = 4, Bi-weekly = 2, everything else = 1. */
export const RUNS_PER_MONTH = {
  [Frequencies.Weekly]: 4,
  [Frequencies.BiWeekly]: 2,
  Default: 1,
} as const;

/** Days between runs on the month calendar. */
export const RUN_STEP_DAYS = {
  [Frequencies.Weekly]: 7,
  [Frequencies.BiWeekly]: 14,
} as const;

export const RiskRatings = {
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
} as const;
export type RiskRating = typeof RiskRatings[keyof typeof RiskRatings];

/** Highest risk first. */
export const RISK_LEVEL_ORDER: RiskRating[] = [RiskRatings.High, RiskRatings.Medium, RiskRatings.Low];

/** Level tabs of the Audit Plan page. */
export const PlanViews = {
  Annual: 'annual',
  Calendar: 'calendar',
  Departments: 'departments',
  Scope: 'scope',
  Log: 'log',
} as const;
export type PlanView = typeof PlanViews[keyof typeof PlanViews];

/** Status of a whole audit plan (one row of the Audit Plans list). */
export const AuditPlanStatuses = {
  Draft: 'draft',
  Planned: 'planned',
  InProgress: 'in_progress',
  Overdue: 'overdue',
  Completed: 'completed',
  OnHold: 'on_hold',
  Cancelled: 'cancelled',
} as const;
export type AuditPlanStatus = typeof AuditPlanStatuses[keyof typeof AuditPlanStatuses];

/** Pill colouring on the Annual Overview. */
export const AuditPlanColorModes = {
  Status: 'status',
  Freq: 'freq',
} as const;
export type AuditPlanColorMode = typeof AuditPlanColorModes[keyof typeof AuditPlanColorModes];

/** Grid / list toggle on the Audit Plans page. */
export const AuditPlanViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type AuditPlanViewMode = typeof AuditPlanViewModes[keyof typeof AuditPlanViewModes];

/** Sortable columns of the Audit Plans list view. */
export const AuditPlanSortColumns = {
  OrganizationName: 'organizationName',
  DivisionName: 'divisionName',
} as const;
export type AuditPlanSortColumn = typeof AuditPlanSortColumns[keyof typeof AuditPlanSortColumns];

export const AuditPlanSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type AuditPlanSortDirection = typeof AuditPlanSortDirections[keyof typeof AuditPlanSortDirections];

/** Keys of the active-filter chips on the Audit Plans page. */
export const AuditPlanFilterKeys = {
  Organizations: 'organizations',
  Divisions: 'divisions',
  SubDivisions: 'subDivisions',
  Statuses: 'statuses',
  Years: 'years',
} as const;
export type AuditPlanFilterKey = typeof AuditPlanFilterKeys[keyof typeof AuditPlanFilterKeys];

/** Activate / deactivate action of the Audit Plans confirmation dialog. */
export const AuditPlanBlockActions = {
  Activate: 'activate',
  Deactivate: 'deactivate',
} as const;
export type AuditPlanBlockAction = typeof AuditPlanBlockActions[keyof typeof AuditPlanBlockActions];

/** Status values of Audit Scope Management (matches ScopeListComponent.statusOptions). */
export const ScopeManagementStatuses = {
  NotStarted: 'Not Started',
  Planned: 'Planned',
  InProgress: 'In Progress',
  Overdue: 'Overdue',
  Completed: 'Completed',
} as const;
export type ScopeManagementStatus = typeof ScopeManagementStatuses[keyof typeof ScopeManagementStatuses];

/* ── Routing ──────────────────────────────────────────────────────────── */

export const AUDIT_PLAN_ROUTES = {
  Plan: '/audits/audit-plan/audit-plan',
  PlanList: '/audits/audit-plan/audit-plan-list',
  ScopeManagement: '/audits/audit-plan/audit-scope',
  ScopeJobs: '/audits/audit-plan/scope-jobs',
} as const;

export const AUDIT_PLAN_QUERY_PARAMS = {
  Status: 'status',
  AuditorId: 'auditorId',
  Company: 'company',
  CompanyName: 'companyName',
  Plan: 'plan',
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const AUDIT_PLAN_DRAWER_WIDTH = '720px';

export const AUDIT_PLAN_LIST_PAGE_SIZE = 8;

/** Sub-division pills shown on a row / card before the "+N" pill. */
export const AUDIT_PLAN_SUB_DIVISION_PREVIEW_COUNT = 2;

/** Prefix + zero-padded number of generated plan ids (AP-001). */
export const AUDIT_PLAN_ID_PREFIX = 'AP-';
export const AUDIT_PLAN_ID_PAD_LENGTH = 3;

export const AUDIT_PLAN_FIELD_LIMITS = {
  PlanNameMax: 200,
} as const;

/** A plan covers exactly this many months (inclusive of From). */
export const AUDIT_PLAN_PERIOD_MONTHS = 12;

/** Simulated save latency of the create / edit drawer. */
export const AUDIT_PLAN_SUBMIT_DELAY_MS = 800;

/** Simulated API latency of AuditPlanService.getPlan(). */
export const AUDIT_PLAN_MOCK_LATENCY_MS = 200;

export const MONTHS_PER_YEAR = 12;
export const MONTHS_PER_QUARTER = 3;
export const QUARTERS_PER_YEAR = 4;

/** Quarter indexes 0–3 (Q1–Q4). */
export const QUARTER_INDEXES = [0, 1, 2, 3];

/** Month offsets within a quarter. */
export const QUARTER_MONTH_OFFSETS = [0, 1, 2];

export const MS_PER_DAY = 86_400_000;
export const DAYS_PER_MONTH = 30;

/** Locale used for every date the module formats in code. */
export const AUDIT_PLAN_DATE_LOCALE = 'en-GB';

export const AUDIT_PLAN_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

export const AUDIT_PLAN_MONTH_YEAR_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  year: 'numeric',
};

/** Plan-view drawer: sub-division cards per page. */
export const AUDIT_PLAN_VIEW_PAGINATION = {
  Rows: 2,
  RowsPerPageOptions: [2, 3, 5],
} as const;

/** Annual Overview: sub-division lanes per page, scopes per lane page. */
export const ANNUAL_OVERVIEW_PAGINATION = {
  SubDivisionRows: 3,
  SubDivisionRowsPerPageOptions: [2, 3, 5, 10],
  ScopeRows: 5,
} as const;

export const EXECUTION_LOG_PAGINATION = {
  Rows: 25,
  RowsPerPageOptions: [25, 50, 100],
} as const;

/** Month calendar: job chips shown per day before "+N more". */
export const CALENDAR_MAX_CHIPS = 3;

/** Month calendar: latest start day a scope is placed on (keeps every month valid). */
export const CALENDAR_MAX_PLACEMENT_DAY = 28;

/** Calendar placement day used when a scope has no dated job. */
export const AUDIT_PLAN_DEFAULT_SCOPE_DAY = 15;

/** Placeholder estimated hours for jobs whose source data doesn't track them. */
export const AUDIT_PLAN_PLACEHOLDER_JOB_HOURS = 8;
export const AUDIT_PLAN_PLACEHOLDER_SCOPE_HOURS = 40;

/** Placeholder finding refs start after this number (F-101, F-102, …). */
export const AUDIT_PLAN_FINDING_REF_BASE = 100;

/** Plan-view progress shown for plans that carry no real %. */
export const AUDIT_PLAN_MOCK_PROGRESS = {
  Min: 30,
  Spread: 60,
  Complete: 100,
  NotStarted: 0,
} as const;

/** localStorage key of the Audit Plan page's dark-theme toggle. */
export const AUDIT_PLAN_DARK_THEME_STORAGE_KEY = 'audit-plan.dark-theme';
export const AUDIT_PLAN_STORAGE_FLAG = { On: '1', Off: '0' } as const;

/** Top-bar glyph when no company name is available. */
export const AUDIT_PLAN_DEFAULT_INITIALS = 'AP';

/** Words of the company name used for the top-bar initials. */
export const AUDIT_PLAN_INITIALS_WORD_COUNT = 2;

/** Search box debounce on the Audit Plan page. */
export const AUDIT_PLAN_SEARCH_DEBOUNCE_MS = 250;
