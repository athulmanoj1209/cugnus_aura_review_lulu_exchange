/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_FINDINGS, the service's mock rows) stay
 * assignable to the derived types below.
 */

export const FindingSeverities = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type FindingSeverity = typeof FindingSeverities[keyof typeof FindingSeverities];

/** Sort rank of each severity (higher = more severe). */
export const FINDING_SEVERITY_RANK: Record<FindingSeverity, number> = {
  [FindingSeverities.Low]: 1,
  [FindingSeverities.Medium]: 2,
  [FindingSeverities.High]: 3,
  [FindingSeverities.Critical]: 4,
};

/** Severities counted as "Critical / High". */
export const CRITICAL_HIGH_SEVERITIES: FindingSeverity[] = [FindingSeverities.Critical, FindingSeverities.High];

/** Severity given to a new finding submitted without one. */
export const FINDING_DEFAULT_SEVERITY: FindingSeverity = FindingSeverities.Low;

export const FindingStatuses = {
  Open: 'open',
  InProgress: 'in-progress',
  Responded: 'responded',
  Verified: 'verified',
  Closed: 'closed',
  Overdue: 'overdue',
  Escalated: 'escalated',
  Rejected: 'rejected',
} as const;
export type FindingStatus = typeof FindingStatuses[keyof typeof FindingStatuses];

/**
 * Statuses that count as "still active / not yet resolved" — the BROAD sense
 * of "open": everything except `closed` and `rejected`.
 */
export const ACTIVE_STATUSES: FindingStatus[] = [
  FindingStatuses.Open,
  FindingStatuses.InProgress,
  FindingStatuses.Responded,
  FindingStatuses.Verified,
  FindingStatuses.Overdue,
  FindingStatuses.Escalated,
];

/** Resolved statuses — no further action pending. */
export const CLOSED_STATUSES: FindingStatus[] = [FindingStatuses.Closed, FindingStatuses.Rejected];

/** Past-due statuses (overdue, or auto-escalated after the SLA breach). */
export const OVERDUE_STATUSES: FindingStatus[] = [FindingStatuses.Overdue, FindingStatuses.Escalated];

/** Statuses grouped into the dashboard's "In Progress" bucket. */
export const IN_PROGRESS_BUCKET_STATUSES: FindingStatus[] = [
  FindingStatuses.InProgress,
  FindingStatuses.Responded,
  FindingStatuses.Verified,
];

/** Lifecycle state of an audit follow-up plan (the engagement that groups findings). */
export const PlanStatuses = {
  Draft: 'draft',
  InProgress: 'in-progress',
  Completed: 'completed',
  OnHold: 'on-hold',
  Cancelled: 'cancelled',
} as const;
export type PlanStatus = typeof PlanStatuses[keyof typeof PlanStatuses];

/** Pill colour tier of an escalation-policy rule. */
export const EscalationTiers = {
  Reminder: 'reminder',
  Warning: 'warning',
  Alert: 'alert',
} as const;
export type EscalationTier = typeof EscalationTiers[keyof typeof EscalationTiers];

/** Status values of the Add / Edit Finding form (display-cased, unlike FindingStatus). */
export const FindingFormStatuses = {
  Open: 'Open',
  Closed: 'Closed',
  Overdue: 'Overdue',
  Repeated: 'Repeated',
  InProgress: 'In-progress',
  Escalated: 'Escalated',
} as const;
export type FindingFormStatus = typeof FindingFormStatuses[keyof typeof FindingFormStatuses];

export const FindingDrawerModes = {
  Create: 'create',
  Edit: 'edit',
} as const;
export type FindingDrawerMode = typeof FindingDrawerModes[keyof typeof FindingDrawerModes];

/** Grid / list toggle on the Findings page. */
export const FindingViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type FindingViewMode = typeof FindingViewModes[keyof typeof FindingViewModes];

/** Sortable columns of the Findings list view. */
export const FindingSortColumns = {
  Id: 'id',
  Title: 'title',
  Subdivision: 'subdivision',
  Severity: 'severity',
  Status: 'status',
  DueDate: 'dueDate',
  Owner: 'owner',
} as const;
export type FindingSortColumn = typeof FindingSortColumns[keyof typeof FindingSortColumns];

export const FindingSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type FindingSortDirection = typeof FindingSortDirections[keyof typeof FindingSortDirections];

/** Keys of the active-filter chips on the Findings page. */
export const FindingFilterKeys = {
  Severities: 'severities',
  Statuses: 'statuses',
  Subdivisions: 'subdivisions',
  Companies: 'companies',
  Divisions: 'divisions',
  Scopes: 'scopes',
  Subscopes: 'subscopes',
  Auditors: 'auditors',
  Repeated: 'repeated',
  Date: 'date',
} as const;
export type FindingFilterKey = typeof FindingFilterKeys[keyof typeof FindingFilterKeys];

/** Activate / deactivate action of the Findings confirmation dialog. */
export const FindingBlockActions = {
  Activate: 'activate',
  Deactivate: 'deactivate',
} as const;
export type FindingBlockAction = typeof FindingBlockActions[keyof typeof FindingBlockActions];

/** Tabs of the routable Finding Detail page. */
export const FindingDetailTabs = {
  Overview: 'overview',
  Evidence: 'evidence',
  History: 'history',
  Escalation: 'escalation',
} as const;
export type FindingDetailTab = typeof FindingDetailTabs[keyof typeof FindingDetailTabs];

/* ── Dashboard drill-downs ────────────────────────────────────────────────
 * `?view=<key>` presets the Findings list's filters when arriving from a
 * dashboard KPI card. Each preset starts from cleared severity / status /
 * repeated filters and then applies only what it lists. */

export interface FindingViewPreset {
  statuses?: FindingStatus[];
  severities?: FindingSeverity[];
  repeatedOnly?: boolean;
}

export const FINDING_VIEW_PRESETS: Record<string, FindingViewPreset> = {
  'open':               { statuses: [FindingStatuses.Open] },
  'closed':             { statuses: CLOSED_STATUSES },
  'overdue':            { statuses: OVERDUE_STATUSES },
  'repeated':           { repeatedOnly: true },
  'critical-high-open': { severities: CRITICAL_HIGH_SEVERITIES, statuses: ACTIVE_STATUSES },

  // auditor-execution "My Findings" cards (display-status buckets)
  'draft':              { statuses: [FindingStatuses.Open, FindingStatuses.Rejected] },
  'submitted':          { statuses: [FindingStatuses.InProgress] },
  'under-review':       { statuses: [FindingStatuses.Responded, FindingStatuses.Escalated, FindingStatuses.Overdue] },
  'approved':           { statuses: [FindingStatuses.Verified] },
  'my-closed':          { statuses: [FindingStatuses.Closed] },

  // auditor-reviews "Findings Reviews" card — everything awaiting a
  // reviewer/approver action, excluding drafts and finalised findings.
  'pending':            { statuses: [FindingStatuses.InProgress, FindingStatuses.Responded, FindingStatuses.Escalated, FindingStatuses.Overdue] },
  'high-risk':          { severities: CRITICAL_HIGH_SEVERITIES },
};

export const FINDING_QUERY_PARAMS = {
  View: 'view',
  AuditorId: 'auditorId',
  OpenAdd: 'openAdd',
  Id: 'id',
} as const;

/** Value of `?openAdd=` that opens the Add Finding drawer straight away. */
export const FINDING_OPEN_ADD_FLAG = 'true';

/** List route the detail page falls back to when there's no browser history. */
export const FINDINGS_LIST_ROUTE = '/audits/follow-up';

/* ── Configuration ────────────────────────────────────────────────────── */

export const FINDING_DRAWER_WIDTH = {
  Form: '720px',
  Profile: '760px',
} as const;

export const FINDING_LIST_PAGE_SIZE = 10;

export const FINDING_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

/** Prefix + zero-padded number of generated finding ids (FND-001). */
export const FINDING_ID_PREFIX = 'FND-';
export const FINDING_ID_PAD_LENGTH = 3;

export const FINDING_FIELD_LIMITS = {
  TitleMin: 2,
  TitleMax: 150,
  DescriptionMax: 1000,
} as const;

/** Supporting-documents uploader on the Add / Edit Finding drawer. */
export const FINDING_UPLOAD = {
  Accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg',
  MaxFileSizeBytes: 10_000_000,
} as const;

/** Delay before the drawer closes, so the success toast is visible. */
export const FINDING_SUBMIT_CLOSE_DELAY_MS = 1200;

/** formatFileSize(): 1024-based units. */
export const FINDING_FILE_SIZE_BASE = 1024;
export const FINDING_FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** "Aging Analysis" card: overdue findings younger than this many days. */
export const FINDING_AGING_DAYS = 30;

export const MS_PER_DAY = 86_400_000;

/** Words of a name used for avatar initials. */
export const FINDING_INITIALS_WORD_COUNT = 2;

export const FINDING_DATE_LOCALE = 'en-GB';

/** Overdue card due-date range, e.g. "Due 5 Feb 2026 – 3 Mar 2026". */
export const FINDING_DUE_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

/** TODO: replace with the real signed-in user once an auth/session service is wired in. */
export const FINDING_CURRENT_USER_OWNER = {
  fullName: 'Athul Manoj',
  avatarUrl: '',
  id: 'current-user',
} as const;
