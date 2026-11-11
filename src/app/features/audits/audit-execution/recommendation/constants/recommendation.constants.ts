/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK in recommendation-list.component.ts) stay
 * assignable to the derived types below.
 */

export const RecommendationPriorities = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type RecommendationPriority = typeof RecommendationPriorities[keyof typeof RecommendationPriorities];

/** Sort rank of each priority (higher = more urgent). */
export const RECOMMENDATION_PRIORITY_RANK: Record<RecommendationPriority, number> = {
  [RecommendationPriorities.Low]: 1,
  [RecommendationPriorities.Medium]: 2,
  [RecommendationPriorities.High]: 3,
  [RecommendationPriorities.Critical]: 4,
};

export const RecommendationStatuses = {
  Open: 'open',
  InProgress: 'in-progress',
  Implemented: 'implemented',
  Verified: 'verified',
  Closed: 'closed',
} as const;
export type RecommendationStatus = typeof RecommendationStatuses[keyof typeof RecommendationStatuses];

/** Status a new recommendation starts in. */
export const RECOMMENDATION_DEFAULT_STATUS: RecommendationStatus = RecommendationStatuses.Open;

/** Statuses that can no longer be overdue (the action is done). */
export const RECOMMENDATION_RESOLVED_STATUSES: RecommendationStatus[] = [
  RecommendationStatuses.Closed,
  RecommendationStatuses.Verified,
];

/** True when the due date has passed and the recommendation isn't resolved yet. */
export function isRecommendationOverdue(r: { dueDate: Date; status: RecommendationStatus }): boolean {
  return r.dueDate < new Date() && !RECOMMENDATION_RESOLVED_STATUSES.includes(r.status);
}

export const RecommendationDrawerModes = {
  Create: 'create',
  Edit: 'edit',
  Approve: 'approve',
} as const;
export type RecommendationDrawerMode = typeof RecommendationDrawerModes[keyof typeof RecommendationDrawerModes];

export const RecommendationApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type RecommendationApprovalAction = typeof RecommendationApprovalActions[keyof typeof RecommendationApprovalActions];

/** Grid / list toggle on the Recommendations page. */
export const RecommendationViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type RecommendationViewMode = typeof RecommendationViewModes[keyof typeof RecommendationViewModes];

/** Sortable columns of the Recommendations list view. */
export const RecommendationSortColumns = {
  Id: 'id',
  Title: 'title',
  Priority: 'priority',
  Status: 'status',
  AssignedTo: 'assignedTo',
  DueDate: 'dueDate',
} as const;
export type RecommendationSortColumn = typeof RecommendationSortColumns[keyof typeof RecommendationSortColumns];

export const RecommendationSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RecommendationSortDirection = typeof RecommendationSortDirections[keyof typeof RecommendationSortDirections];

/** Activate / deactivate action shown in the Recommendations confirmation dialog. */
export const RecommendationBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type RecommendationBlockAction = typeof RecommendationBlockActions[keyof typeof RecommendationBlockActions];

/* ── Configuration ────────────────────────────────────────────────────── */

export const RECOMMENDATION_DRAWER_WIDTH = '720px';

export const RECOMMENDATION_LIST_PAGE_SIZE = 8;

export const RECOMMENDATION_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

/** Prefix + zero-padded number of generated recommendation ids (REC-001). */
export const RECOMMENDATION_ID_PREFIX = 'REC-';
export const RECOMMENDATION_ID_PAD_LENGTH = 3;

export const RECOMMENDATION_FIELD_LIMITS = {
  TitleMin: 2,
  TitleMax: 200,
  DescriptionMax: 2000,
  ApproverNotesMin: 1,
} as const;

export const RECOMMENDATION_DUE_DATE_FORMAT = 'dd/mm/yy';

export const MS_PER_DAY = 86_400_000;

/**
 * Stand-in for whoever submitted a recommendation (it has no "raised by"
 * field) — used only for the Pending Approvals bridge.
 * TODO: replace with the real signed-in user once an auth/session service is wired in.
 */
export const RECOMMENDATION_CURRENT_USER_NAME = 'Athul Manoj';

/** Fields of the Pending Approvals item mirrored from a newly added recommendation. */
export const RECOMMENDATION_PENDING_ITEM_DEFAULTS = {
  Type: 'recommendation',
  Status: 'pending_review',
} as const;
