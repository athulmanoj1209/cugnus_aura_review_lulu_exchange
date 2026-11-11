/* ── Auditor dashboard ────────────────────────────────────────────────────
 * Scope and RFI values come from those modules' constants
 * (ScopeLevels / ScopeWorkflowStatuses / RfiStatuses). The values below for
 * findings, evidence, observations, working papers, tasks and audit plans
 * belong to modules that don't have a constants/ folder yet — they live here
 * until those modules are converted, then should move to their owners.
 */

import type { CurrentAuditor } from '../models/current-auditor.model';

/** Hardcoded for now — the dashboard is scoped to this one auditor until real auth is wired in. */
export const AUDITOR_DASHBOARD_DEFAULT_AUDITOR: CurrentAuditor = { id: 'bob', name: 'Bob Smith' };

export const AuditorDashboardTabs = {
  Overview: 'overview',
  ScopeManagement: 'scope-management',
  WorkingPapers: 'working-papers',
  Execution: 'execution',
  Reviews: 'reviews',
  TeamOverview: 'team-overview',
} as const;
export type AuditorDashboardTab = typeof AuditorDashboardTabs[keyof typeof AuditorDashboardTabs];

/* ── Drill-through routes & query params ──────────────────────────────── */

export const AUDITOR_DASHBOARD_ROUTES = {
  AuditPlanList: '/audits/audit-plan/audit-plan-list',
  AuditScope: '/audits/audit-plan/audit-scope',
  ScopeTask: '/audits/audit-plan/scope-task',
  ManageRfi: '/audits/audit-execution/manage-rfi',
  WorkingPapers: '/audits/audit-execution/working-papers',
  Findings: '/audits/audit-execution/findings',
  ObservationList: '/audits/audit-execution/observation-list',
  EvidenceList: '/audits/audit-execution/evidence-list',
  ApprovalList: '/admin/review/approval-list',
} as const;

export const AUDITOR_DASHBOARD_QUERY_PARAMS = {
  AuditorId: 'auditorId',
  Status: 'status',
  View: 'view',
  ScopeLevel: 'scopeLevel',
  RiskBand: 'riskBand',
  OpenAdd: 'openAdd',
  Type: 'type',
  TeamAuditorIds: 'teamAuditorIds',
  TeamAuditorNames: 'teamAuditorNames',
} as const;

/** Separators used to join the team's ids / names into the team query params. */
export const AUDITOR_TEAM_QUERY_SEPARATORS = {
  Ids: ',',
  Names: '|',
} as const;

/** `?openAdd=` value that opens the target list's Add drawer. */
export const AUDITOR_DASHBOARD_OPEN_ADD_TRUE = 'true';

/* ── Overview tab actions ─────────────────────────────────────────────── */

export const AuditorKpiActions = {
  ActiveAudits: 'active-audits',
  AssignedScopes: 'assigned-scopes',
  AssignedSubScopes: 'assigned-subscopes',
  PendingRfi: 'pending-rfi',
  WorkingPapersPending: 'working-papers-pending',
  OpenFindings: 'open-findings',
  RepeatedFindings: 'repeated-findings',
  OpenTasks: 'open-tasks',
  TasksDueToday: 'tasks-due-today',
  OverdueTasks: 'overdue-tasks',
} as const;

export const AuditorQuickActions = {
  OpenAssignedAudit: 'open-assigned-audit',
  RaiseFinding: 'raise-finding',
  SendRfi: 'send-rfi',
  UploadWorkingPaper: 'upload-working-paper',
} as const;

/* ── Values of other modules used for counting / filtering ────────────── */

/** Audit plan status the "My Active Audits" drill-through filters on. */
export const AUDIT_PLAN_IN_PROGRESS_STATUS = 'in_progress';

/** Finding display statuses (countFindingsForAuditorByDisplayStatus / table rows). */
export const AuditorFindingStatuses = {
  Draft: 'Draft',
  Submitted: 'Submitted',
  UnderReview: 'Under Review',
  Approved: 'Approved',
  Closed: 'Closed',
} as const;

/** `?view=` values on the findings list. */
export const AuditorFindingViews = {
  Draft: 'draft',
  Submitted: 'submitted',
  UnderReview: 'under-review',
  Approved: 'approved',
  MyClosed: 'my-closed',
  HighRisk: 'high-risk',
  Open: 'open',
  Pending: 'pending',
  Repeated: 'repeated',
} as const;

/** Display risk levels on findings / evidence / observation rows. */
export const AuditorRiskLevels = {
  Critical: 'Critical',
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
} as const;

/** Observation display statuses. */
export const AuditorObservationStatuses = {
  Open: 'Open',
  UnderReview: 'Under Review',
  Resolved: 'Resolved',
} as const;

/** Evidence display statuses (counting / table rows). */
export const AuditorEvidenceStatuses = {
  Requested: 'Requested',
  Uploaded: 'Uploaded',
  UnderReview: 'Under Review',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
} as const;

/** `?status=` values on the evidence list. */
export const AuditorEvidenceFilterStatuses = {
  Requested: 'requested',
  Uploaded: 'uploaded',
  UnderReview: 'under_review',
  Accepted: 'accepted',
  Rejected: 'rejected',
} as const;

/** Working-paper statuses (counting / `?status=` on the working-papers list). */
export const AuditorWorkingPaperStatuses = {
  Draft: 'draft',
  UnderReview: 'under_review',
  Reopened: 'reopened',
  Approved: 'approved',
  Pending: 'pending',
} as const;

/** Buckets for countTasksForAuditor(). */
export const AuditorTaskCountBuckets = {
  Open: 'open',
  InProgress: 'in_progress',
  DueToday: 'due-today',
  Overdue: 'overdue',
} as const;

/** `?status=` values the task KPI cards send to the scope-task list. */
export const AUDITOR_TASK_LIST_STATUS_PARAMS = {
  OpenAndInProgress: `${AuditorTaskCountBuckets.Open},${AuditorTaskCountBuckets.InProgress}`,
  DueToday: AuditorTaskCountBuckets.DueToday,
  Overdue: AuditorTaskCountBuckets.Overdue,
} as const;

/** Task filter chips on the My Audits & Scopes tab. */
export const AuditorTaskFilters = {
  All: 'all',
  DueToday: 'due-today',
  HighPriority: 'high-priority',
  Overdue: 'overdue',
  Completed: 'completed',
} as const;

/** Values on a task row the filters match against. */
export const AUDITOR_TASK_ROW_VALUES = {
  DueToday: 'Today',
  DueTomorrow: 'Tomorrow',
  HighPriority: 'High',
  Overdue: 'Overdue',
  Completed: 'Completed',
} as const;

/** Review queue types (Reviews tab cards). */
export const AuditorReviewTypes = {
  Finding: 'finding',
  Observation: 'observation',
  Evidence: 'evidence',
} as const;

/** Approval-workflow row types (Reviews tab table). */
export const AuditorApprovalRowTypes = {
  Finding: 'Finding',
  Observation: 'Observation',
  Evidence: 'Evidence',
} as const;

/** Review buckets shown on the Reviews tab. */
export const AuditorReviewBuckets = {
  PendingReview: 'Pending Review',
  PendingApproval: 'Pending Approval',
  Submitted: 'Submitted',
} as const;

/** Pending-approvals queue statuses (execution-requests PendingStatus) counted into the review buckets. */
export const AuditorPendingQueueStatuses = {
  PendingReview: 'pending_review',
  PendingApproval: 'pending_approval',
  Submitted: 'submitted',
} as const;

/** Evidence type stamped on a pending evidence item mapped into the Evidence drawer. */
export const AUDITOR_PENDING_EVIDENCE_TYPE = 'document';

/* ── Notifications (Overview tab) ─────────────────────────────────────── */

export const AUDITOR_NOTIFICATION_FILTER = {
  Audience: 'auditor',
  Status: 'active',
  SystemSender: 'system',
} as const;

/** Subject keywords that decide a notification's tone. */
export const AUDITOR_NOTIFICATION_KEYWORDS = {
  Danger: ['overdue', 'high-risk'],
  Warn: ['pending', 'required', 'reminder'],
  Success: ['approved', 'submitted', 'ready', 'scheduled'],
} as const;

/** Thresholds for the "x min / hrs / days / months ago" label. */
export const TIME_AGO = {
  MsPerMinute: 60000,
  MinutesPerHour: 60,
  HoursPerDay: 24,
  DaysPerMonth: 30,
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

/** Widths of the record drawers opened from the dashboard tables. */
export const AUDITOR_DASHBOARD_DRAWER_WIDTHS = {
  Finding: '760px',
  Evidence: '720px',
  Observation: '720px',
  WorkingPaper: '720px',
} as const;

/** Rows per page on the dashboard tables / paginators. */
export const AUDITOR_DASHBOARD_PAGE_SIZES = {
  Default: 5,
  DefaultOptions: [5, 10] as number[],
  SubScopes: 6,
  Deadlines: 8,
  Reviews: 10,
  Notifications: 4,
  AuditProgress: 5,
  TeamWorkload: 3,
} as const;

/** Progress-bar colour thresholds (%). */
export const AUDITOR_PROGRESS_THRESHOLDS = {
  /** My Audits & Scopes tab. */
  Scopes: { Good: 70, Fair: 30 },
  /** Overview tab. */
  Overview: { Good: 70, Fair: 40 },
  /** Team Overview tab — Audit Progress bars. */
  TeamAuditProgress: { Good: 75, Fair: 45 },
  /** Team Overview tab — Workload Distribution completion bars. */
  TeamWorkload: { Good: 75, Fair: 40 },
} as const;

/** Team Overview "Task Aging" — a bucket starting at/after these day counts is coloured warning / danger. */
export const AUDITOR_TEAM_TASK_AGING_THRESHOLDS = {
  Warning: 15,
  Danger: 31,
} as const;

/** RFI numbers on the RFI List table look like RFI-007. */
export const AUDITOR_RFI_NO_PREFIX = 'RFI-';
export const AUDITOR_RFI_NO_DIGITS = 3;

/** Date format on the dashboard tables. */
export const AUDITOR_DASHBOARD_DATE_FORMAT: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

/** Placeholder for a missing value. */
export const AUDITOR_DASHBOARD_EMPTY_VALUE = '—';
