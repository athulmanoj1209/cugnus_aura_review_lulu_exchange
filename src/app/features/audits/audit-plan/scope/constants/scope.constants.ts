/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (audit-scope-static-data.ts) stay assignable to
 * the derived types in models/scope-static-data.model.ts.
 */

/** Drives the Activate/Deactivate action — independent of the workflow status. */
export const ScopeRecordStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

/** Drives the list's status badge. Stored as display text (with spaces). */
export const ScopeWorkflowStatuses = {
  NotStarted: 'Not Started',
  Planned: 'Planned',
  InProgress: 'In Progress',
  Overdue: 'Overdue',
  Completed: 'Completed',
  PendingReview: 'Pending Review',
  Approved: 'Approved',
  Rejected: 'Rejected',
} as const;

export const ScopeTypes = {
  SubDivisional: 'subDivisional',
  Functional: 'functional',
  Independent: 'independent',
} as const;

export const ScopeAuditFrequencies = {
  Quarterly: 'quarterly',
  Annually: 'annually',
  Monthly: 'monthly',
} as const;

export const ScopeModesOfAudit = {
  Full: 'full',
  Limited: 'limited',
  Thematic: 'thematic',
  FollowUp: 'follow-up',
  Continuous: 'continuous',
} as const;

export const ScopeSamplingMethodologies = {
  Random: 'random',
  RiskBased: 'risk-based',
  Judgmental: 'judgmental',
} as const;

export const ScopeRiskRatings = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

/** A task's status inside a scope (Tasks tab). */
export const ScopeTaskStatuses = {
  NotStarted: 'not-started',
  InProgress: 'in-progress',
  Completed: 'completed',
  Overdue: 'overdue',
} as const;

/** Whether a record is a top-level scope or a sub-scope. */
export const ScopeLevels = {
  Scope: 'scope',
  SubScope: 'subscope',
} as const;
export type ScopeLevel = typeof ScopeLevels[keyof typeof ScopeLevels];

/** Mode the Add/Edit/View scope drawer opens in. */
export const ScopeDrawerModes = {
  Add: 'add',
  View: 'view',
  Edit: 'edit',
} as const;
export type ScopeDrawerMode = typeof ScopeDrawerModes[keyof typeof ScopeDrawerModes];

export const ScopeApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type ScopeApprovalAction = typeof ScopeApprovalActions[keyof typeof ScopeApprovalActions];

/** Grid / list toggle on the scope listing page. */
export const ScopeViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type ScopeViewMode = typeof ScopeViewModes[keyof typeof ScopeViewModes];

/** "Create New Scope" vs "From Scope Library" on the Add Scope form. */
export const ScopeSources = {
  Fresh: 'fresh',
  Library: 'library',
} as const;
export type ScopeSource = typeof ScopeSources[keyof typeof ScopeSources];

/** "New RFI" vs "From RFI Library" on the task form. */
export const ScopeTaskRfiSources = {
  New: 'new',
  Library: 'library',
} as const;

/** Status of the approval request this drawer was opened for (Scope Requests). */
export const SCOPE_REQUEST_PENDING_REVIEW = 'pending_review';

/* ── Listing deep-link query params ───────────────────────────────────── */

export const SCOPE_LIST_QUERY_PARAMS = {
  Filter: 'filter',
  Status: 'status',
  AuditorId: 'auditorId',
  ScopeLevel: 'scopeLevel',
} as const;

/** `?filter=` value set by the dashboard "High-Risk Scopes Not Started" card. */
export const SCOPE_HIGH_RISK_NOT_STARTED_FILTER = 'high-risk-not-started';

/* ── Configuration ────────────────────────────────────────────────────── */

export const SCOPE_DRAWER = {
  FormWidth: '700px',
  ProfileWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;

export const SCOPE_LIST_PAGE_SIZE = 6;

/** Sub-scopes per page on the scope profile drawer. */
export const SCOPE_SUBSCOPE_PAGE_SIZE = 4;

export const SCOPE_NAME_MIN_LENGTH = 2;
export const SCOPE_NAME_MAX_LENGTH = 200;
export const SCOPE_OBJECTIVE_MAX_LENGTH = 500;

export const SCOPE_TASK_NAME_MIN_LENGTH = 2;
export const SCOPE_TASK_NAME_MAX_LENGTH = 200;
export const SCOPE_TASK_OBJECTIVE_MAX_LENGTH = 500;

/** Tabs of the Add/Edit scope drawer (Details & Sampling / Regulations tabs are hidden). */
export const SCOPE_FORM_TABS = {
  Details: 0,
  Tasks: 1,
} as const;

/** Controls checked on the Details tab before "Next" is allowed. */
export const SCOPE_DETAILS_TAB_REQUIRED_FIELDS = [
  'company', 'division', 'subDivision', 'auditPlan', 'scopeName', 'scopeType',
  'linkedSubDivisions', 'auditFrequency', 'modeOfAudit',
  'samplingMethodology', 'samplingSize', 'startDate', 'endDate',
  'assignedAuditors', 'assignedReviewers',
];

export const SCOPE_EVIDENCE_UPLOAD = {
  MaxFileSizeMb: 50,
  AllowedTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'text/plain',
  ],
} as const;

/** Generated scope ids look like SC-0001. */
export const SCOPE_ID_PREFIX = 'SC-';
export const SCOPE_ID_DIGITS = 4;

/** Generated task ids look like TSK-<base36 timestamp>. */
export const SCOPE_TASK_ID_PREFIX = 'TSK-';

export const SCOPE_DEFAULT_AVATAR = 'images/avatars/default-avatar.jpg';

/** Fallback company badge colour when the company has none. */
export const SCOPE_DEFAULT_COMPANY_COLOR = '#102e70';

/** Due-date format on the auditor "Assigned Scopes" tables. */
export const SCOPE_DUE_DATE_LOCALE = 'en-GB';
export const SCOPE_DUE_DATE_FORMAT: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

/**
 * Illustrative progress % per workflow status (scopes have no real completion-% field).
 * Statuses not listed here (In Progress, Pending Review, …) use SCOPE_DEFAULT_PROGRESS.
 */
export const SCOPE_PROGRESS_BY_STATUS: Record<string, number> = {
  'Completed': 100,
  'Not Started': 0,
  'Planned': 0,
  'Overdue': 40,
};
export const SCOPE_DEFAULT_PROGRESS = 60;

/**
 * Simulated risk register: Risk Reference ID → risk rating, used to auto-fill the
 * scope's Risk Rating. Replace with a real API call in production.
 */
export const SCOPE_MOCK_RISK_REGISTER: Record<string, string> = {
  'RR-001': 'high',
  'RR-002': 'medium',
  'RR-003': 'low',
};
