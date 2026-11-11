/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK in observation-list.component.ts) stay
 * assignable to the derived types below.
 */

export const RiskRatings = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type RiskRating = typeof RiskRatings[keyof typeof RiskRatings];

/** Sort rank of each rating (higher = more severe). */
export const RISK_RATING_RANK: Record<RiskRating, number> = {
  [RiskRatings.Low]: 1,
  [RiskRatings.Medium]: 2,
  [RiskRatings.High]: 3,
  [RiskRatings.Critical]: 4,
};

export const ObservationStatuses = {
  Draft: 'draft',
  Submitted: 'submitted',
  Reviewed: 'reviewed',
  Approved: 'approved',
} as const;
export type ObservationStatus = typeof ObservationStatuses[keyof typeof ObservationStatuses];

/** Status given to a new observation (the form has no Status control). */
export const OBSERVATION_DEFAULT_STATUS: ObservationStatus = ObservationStatuses.Draft;

/** Risk bands used by the auditor dashboard's "High / Medium Risk" cards. */
export const ObservationRiskBands = {
  High: 'High',
  Medium: 'Medium',
} as const;
export type ObservationRiskBand = typeof ObservationRiskBands[keyof typeof ObservationRiskBands];

/** Ratings that fall in each risk band ('High' folds critical + high; 'Medium' is exact). */
export const OBSERVATION_RISK_BAND_RATINGS: Record<ObservationRiskBand, RiskRating[]> = {
  [ObservationRiskBands.High]: [RiskRatings.High, RiskRatings.Critical],
  [ObservationRiskBands.Medium]: [RiskRatings.Medium],
};

export const ObservationDrawerModes = {
  Create: 'create',
  Edit: 'edit',
  Approve: 'approve',
} as const;
export type ObservationDrawerMode = typeof ObservationDrawerModes[keyof typeof ObservationDrawerModes];

export const ObservationApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type ObservationApprovalAction = typeof ObservationApprovalActions[keyof typeof ObservationApprovalActions];

/** Grid / list toggle on the Observations page. */
export const ObservationViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type ObservationViewMode = typeof ObservationViewModes[keyof typeof ObservationViewModes];

/** Sortable columns of the Observations list view. */
export const ObservationSortColumns = {
  Id: 'id',
  Title: 'title',
  RiskRating: 'riskRating',
  Scope: 'scope',
  Status: 'status',
  CreatedDate: 'createdDate',
} as const;
export type ObservationSortColumn = typeof ObservationSortColumns[keyof typeof ObservationSortColumns];

export const ObservationSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type ObservationSortDirection = typeof ObservationSortDirections[keyof typeof ObservationSortDirections];

/** Activate / deactivate action shown in the Observations confirmation dialog. */
export const ObservationBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type ObservationBlockAction = typeof ObservationBlockActions[keyof typeof ObservationBlockActions];

/** Query params the dashboard cards navigate to the list with (?status=…&auditorId=…&riskBand=…). */
export const OBSERVATION_QUERY_PARAMS = {
  AuditorId: 'auditorId',
  Status: 'status',
  RiskBand: 'riskBand',
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const OBSERVATION_DRAWER_WIDTH = '720px';

export const OBSERVATION_LIST_PAGE_SIZE = 8;

/** Prefix + zero-padded number of generated observation ids (OBS-001). */
export const OBSERVATION_ID_PREFIX = 'OBS-';
export const OBSERVATION_ID_PAD_LENGTH = 3;

export const OBSERVATION_FIELD_LIMITS = {
  TitleMin: 2,
  TitleMax: 200,
  DescriptionMax: 2000,
  ApproverNotesMin: 1,
} as const;

export const OBSERVATION_DATE_LOCALE = 'en-GB';

export const OBSERVATION_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

/** TODO: replace with the real signed-in user once an auth/session service is wired in. */
export const OBSERVATION_CURRENT_USER_NAME = 'Athul Manoj';

/** Fields of the Pending Approvals item mirrored from a newly added observation. */
export const OBSERVATION_PENDING_ITEM_DEFAULTS = {
  Type: 'observation',
  Status: 'pending_review',
} as const;
