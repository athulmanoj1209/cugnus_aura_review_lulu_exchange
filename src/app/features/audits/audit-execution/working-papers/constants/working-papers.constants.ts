/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_WORKING_PAPERS) stay assignable to the
 * derived types below.
 */

export const WorkingPaperTypes = {
  LeadSchedule: 'lead_schedule',
  TestOfControls: 'test_of_controls',
  SubstantiveTest: 'substantive_test',
  AnalyticalReview: 'analytical_review',
  Reconciliation: 'reconciliation',
  Memo: 'memo',
  Confirmation: 'confirmation',
  Other: 'other',
} as const;
export type WorkingPaperType = typeof WorkingPaperTypes[keyof typeof WorkingPaperTypes];

export const WorkingPaperStatuses = {
  Draft: 'draft',
  InProgress: 'in_progress',
  Prepared: 'prepared',
  UnderReview: 'under_review',
  Reviewed: 'reviewed',
  Approved: 'approved',
  Reopened: 'reopened',
} as const;
export type WorkingPaperStatus = typeof WorkingPaperStatuses[keyof typeof WorkingPaperStatuses];

/** Status a new working paper starts in. */
export const WORKING_PAPER_DEFAULT_STATUS: WorkingPaperStatus = WorkingPaperStatuses.Draft;

/** Every status except Approved — "still pending" for the auditor dashboard. */
export const WORKING_PAPER_PENDING_STATUSES: WorkingPaperStatus[] = [
  WorkingPaperStatuses.Draft,
  WorkingPaperStatuses.InProgress,
  WorkingPaperStatuses.Prepared,
  WorkingPaperStatuses.UnderReview,
  WorkingPaperStatuses.Reviewed,
  WorkingPaperStatuses.Reopened,
];

export const WORKING_PAPER_ALL_STATUSES: WorkingPaperStatus[] = [
  ...WORKING_PAPER_PENDING_STATUSES,
  WorkingPaperStatuses.Approved,
];

export const RiskLevels = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type RiskLevel = typeof RiskLevels[keyof typeof RiskLevels];

/** Sort rank of each risk level (higher = riskier). */
export const RISK_LEVEL_RANK: Record<RiskLevel, number> = {
  [RiskLevels.High]: 3,
  [RiskLevels.Medium]: 2,
  [RiskLevels.Low]: 1,
};

/** Risk level preselected on the Add Working Paper drawer. */
export const WORKING_PAPER_DEFAULT_RISK: RiskLevel = RiskLevels.Medium;

/** Audit assertions a working paper can cover. */
export const AUDIT_ASSERTIONS = [
  'Existence', 'Occurrence', 'Completeness', 'Accuracy', 'Valuation',
  'Rights & Obligations', 'Cut-off', 'Classification', 'Presentation & Disclosure',
] as const;

export const WorkingPaperDrawerModes = {
  Create: 'create',
  Edit: 'edit',
  Approve: 'approve',
} as const;
export type WorkingPaperDrawerMode = typeof WorkingPaperDrawerModes[keyof typeof WorkingPaperDrawerModes];

export const WorkingPaperReviewActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type WorkingPaperReviewAction = typeof WorkingPaperReviewActions[keyof typeof WorkingPaperReviewActions];

/** Grid / list toggle on the Working Papers page. */
export const WorkingPaperViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type WorkingPaperViewMode = typeof WorkingPaperViewModes[keyof typeof WorkingPaperViewModes];

/** Sortable columns of the Working Papers list view. */
export const WorkingPaperSortColumns = {
  Id: 'id',
  Title: 'title',
  WpType: 'wpType',
  Scope: 'scope',
  RiskLevel: 'riskLevel',
  Status: 'status',
  PreparedBy: 'preparedBy',
  CreatedDate: 'createdDate',
  Files: 'files',
} as const;
export type WorkingPaperSortColumn = typeof WorkingPaperSortColumns[keyof typeof WorkingPaperSortColumns];

export const WorkingPaperSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type WorkingPaperSortDirection = typeof WorkingPaperSortDirections[keyof typeof WorkingPaperSortDirections];

/** Keys of the active-filter chips on the Working Papers page. */
export const WorkingPaperFilterKeys = {
  Types: 'types',
  Statuses: 'statuses',
  Risks: 'risks',
  Scopes: 'scopes',
  Tasks: 'tasks',
  Companies: 'companies',
  Divisions: 'divisions',
  SubDivisions: 'subDivisions',
  Preparers: 'preparers',
  Date: 'date',
} as const;
export type WorkingPaperFilterKey = typeof WorkingPaperFilterKeys[keyof typeof WorkingPaperFilterKeys];

/** Activate / deactivate action shown in the Working Papers confirmation dialog. */
export const WorkingPaperBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type WorkingPaperBlockAction = typeof WorkingPaperBlockActions[keyof typeof WorkingPaperBlockActions];

/* ── Dashboard drill-downs ────────────────────────────────────────────────
 * `?status=<key>` presets the Status filter when arriving from a dashboard
 * summary card; any other value (or none) selects every status. */

export const WORKING_PAPER_STATUS_PRESETS: Record<string, WorkingPaperStatus[]> = {
  pending: WORKING_PAPER_PENDING_STATUSES,
  [WorkingPaperStatuses.Draft]: [WorkingPaperStatuses.Draft],
  [WorkingPaperStatuses.UnderReview]: [WorkingPaperStatuses.UnderReview],
  [WorkingPaperStatuses.Reopened]: [WorkingPaperStatuses.Reopened],
  [WorkingPaperStatuses.Approved]: [WorkingPaperStatuses.Approved],
};

export const WORKING_PAPER_QUERY_PARAMS = {
  Status: 'status',
  AuditorId: 'auditorId',
  OpenAdd: 'openAdd',
} as const;

/** Value of `?openAdd=` that opens the Add Working Paper drawer straight away. */
export const WORKING_PAPER_OPEN_ADD_FLAG = 'true';

/* ── Configuration ────────────────────────────────────────────────────── */

export const WORKING_PAPER_DRAWER_WIDTH = '720px';

export const WORKING_PAPER_LIST_PAGE_SIZE = 8;

/** File pills shown on a row / card before the "+N more" pill. */
export const WORKING_PAPER_FILE_PREVIEW_COUNT = {
  List: 2,
  Grid: 3,
} as const;

/**
 * Working paper ids follow a letter + hundreds scheme (A-100, B-200, …):
 * each new id adds ID_STEP, and the letter is 'A' + (number ÷ ID_STEP) − 1.
 */
export const WORKING_PAPER_ID_STEP = 100;
export const WORKING_PAPER_ID_LETTER_BASE = 64; // char code before 'A'

export const WORKING_PAPER_FIELD_LIMITS = {
  TitleMin: 2,
  TitleMax: 150,
  ObjectiveMax: 1000,
  ProceduresMax: 2000,
  ConclusionMax: 1000,
  NotesMax: 1000,
  ReviewerNotesMax: 1000,
  ReviewerNotesMin: 1,
} as const;

/** Supporting-documents uploader on the Add / Edit Working Paper drawer. */
export const WORKING_PAPER_UPLOAD = {
  Accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg',
  MaxFileSizeBytes: 10_000_000,
} as const;

/** formatFileSize(): 1024-based units. */
export const WORKING_PAPER_FILE_SIZE_BASE = 1024;
export const WORKING_PAPER_FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

export const WORKING_PAPER_DATE_LOCALE = 'en-GB';

export const WORKING_PAPER_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

/** TODO: replace with the real signed-in user once an auth/session service is wired in. */
export const WORKING_PAPER_CURRENT_USER_NAME = 'Athul Manoj';
