/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_EVIDENCE, the Pending Approvals mock store)
 * stay assignable to the derived types below.
 */

export const EvidenceTypes = {
  Document: 'document',
  Screenshot: 'screenshot',
  InterviewNotes: 'interview_notes',
  SystemLog: 'system_log',
  Email: 'email',
  PhysicalInspection: 'physical_inspection',
  Other: 'other',
} as const;
export type EvidenceType = typeof EvidenceTypes[keyof typeof EvidenceTypes];

/** Review workflow status — separate from `isActive` (record activation). */
export const EvidenceReviewStatuses = {
  Requested: 'requested',
  Uploaded: 'uploaded',
  UnderReview: 'under_review',
  Accepted: 'accepted',
  Rejected: 'rejected',
} as const;
export type EvidenceReviewStatus = typeof EvidenceReviewStatuses[keyof typeof EvidenceReviewStatuses];

/** Status assumed for records without one — every legacy record represents uploaded evidence. */
export const EVIDENCE_DEFAULT_REVIEW_STATUS: EvidenceReviewStatus = EvidenceReviewStatuses.Uploaded;

export const EvidenceRisks = {
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
} as const;
export type EvidenceRisk = typeof EvidenceRisks[keyof typeof EvidenceRisks];

/** Risk shown on the auditor dashboard when a record has none. */
export const EVIDENCE_DEFAULT_RISK: EvidenceRisk = EvidenceRisks.Medium;

/** What the Add / Edit / Review Evidence drawer is opened for. */
export const EvidenceDrawerModes = {
  Create: 'create',
  Edit: 'edit',
  Approve: 'approve',
} as const;
export type EvidenceDrawerMode = typeof EvidenceDrawerModes[keyof typeof EvidenceDrawerModes];

/** Decision taken in the drawer's approve mode. */
export const EvidenceApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type EvidenceApprovalAction = typeof EvidenceApprovalActions[keyof typeof EvidenceApprovalActions];

/** Grid / list toggle on the Evidence Repository page. */
export const EvidenceViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type EvidenceViewMode = typeof EvidenceViewModes[keyof typeof EvidenceViewModes];

/** Sortable columns of the Evidence Repository list view. */
export const EvidenceSortColumns = {
  Id: 'id',
  Title: 'title',
  EvidenceType: 'evidenceType',
  Scope: 'scope',
  FindingId: 'findingId',
  CreatedDate: 'createdDate',
  Files: 'files',
} as const;
export type EvidenceSortColumn = typeof EvidenceSortColumns[keyof typeof EvidenceSortColumns];

export const EvidenceSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type EvidenceSortDirection = typeof EvidenceSortDirections[keyof typeof EvidenceSortDirections];

/** Keys of the active-filter chips on the Evidence Repository page. */
export const EvidenceFilterKeys = {
  Types: 'types',
  Scopes: 'scopes',
  Tasks: 'tasks',
  Companies: 'companies',
  Divisions: 'divisions',
  SubDivisions: 'subdivisions',
  Auditors: 'auditors',
  Date: 'date',
} as const;
export type EvidenceFilterKey = typeof EvidenceFilterKeys[keyof typeof EvidenceFilterKeys];

/** Activate / deactivate action shown in the Evidence confirmation dialog. */
export const EvidenceBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type EvidenceBlockAction = typeof EvidenceBlockActions[keyof typeof EvidenceBlockActions];

/** Query params the dashboard cards navigate to the list with (?status=…&auditorId=…). */
export const EVIDENCE_QUERY_PARAMS = {
  AuditorId: 'auditorId',
  Status: 'status',
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const EVIDENCE_DRAWER_WIDTH = '720px';

export const EVIDENCE_LIST_PAGE_SIZE = 8;

export const EVIDENCE_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

/** File pills shown on a row / card before the "+N more" pill. */
export const EVIDENCE_FILE_PREVIEW_COUNT = {
  List: 2,
  Grid: 3,
} as const;

/** Prefix + zero-padded number of generated evidence ids (EV-001). */
export const EVIDENCE_ID_PREFIX = 'EV-';
export const EVIDENCE_ID_PAD_LENGTH = 3;

/** Length limits for the Add / Edit Evidence form. */
export const EVIDENCE_FIELD_LIMITS = {
  TitleMin: 2,
  TitleMax: 150,
  DescriptionMax: 1000,
  ApproverNotesMin: 1,
} as const;

/** Supporting-documents uploader on the Add / Edit Evidence drawer. */
export const EVIDENCE_UPLOAD = {
  Accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg',
  MaxFileSizeBytes: 10_000_000,
} as const;

/** formatFileSize(): 1024-based units. */
export const EVIDENCE_FILE_SIZE_BASE = 1024;
export const EVIDENCE_FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Locale used for every date the module formats in code. */
export const EVIDENCE_DATE_LOCALE = 'en-GB';

export const EVIDENCE_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

/** TODO: replace with the real signed-in user once an auth/session service is wired in. */
export const EVIDENCE_CURRENT_USER_NAME = 'You';

/**
 * Fields of the Pending Approvals item mirrored from a newly added evidence
 * record. Risk defaults to 'medium' since Add Evidence doesn't collect one yet.
 */
export const EVIDENCE_PENDING_ITEM_DEFAULTS = {
  Type: 'evidence',
  Status: 'pending_review',
  RiskRating: 'medium',
} as const;
