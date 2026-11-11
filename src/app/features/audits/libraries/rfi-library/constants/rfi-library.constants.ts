/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (rfi-library-static-*.ts) stay assignable to the
 * derived types in models/rfi-library-list.model.ts.
 */

/** Review status of an RFI library item. */
export const RfiLibraryStatuses = {
  PendingReview: 'pending_review',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export const RfiLibraryPriorities = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;

/** Category values are stored as display text. */
export const RfiLibraryCategories = {
  EvidenceDocumentRequests: 'Evidence & Document Requests',
  ProcessControlWalkthroughs: 'Process & Control Walkthroughs',
  PolicyComplianceVerification: 'Policy & Compliance Verification',
  SystemItLogicInquiries: 'System & IT Logic Inquiries',
} as const;

/** Mode the Add/Edit RFI library drawer opens in. */
export const RfiLibraryDrawerModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type RfiLibraryDrawerMode = typeof RfiLibraryDrawerModes[keyof typeof RfiLibraryDrawerModes];

export const RfiLibraryApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type RfiLibraryApprovalAction = typeof RfiLibraryApprovalActions[keyof typeof RfiLibraryApprovalActions];

/** Grid / list toggle on the RFI library listing page. */
export const RfiLibraryViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type RfiLibraryViewMode = typeof RfiLibraryViewModes[keyof typeof RfiLibraryViewModes];

/* ── Configuration ────────────────────────────────────────────────────── */

export const RFI_LIBRARY_DRAWER = {
  FormWidth: '640px',
  ProfileWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;

export const RFI_LIBRARY_PAGE_SIZE = 6;

/** Description truncation on the listing cards / rows. */
export const RFI_LIBRARY_DESCRIPTION_TRUNCATE = {
  Grid: 100,
  List: 65,
} as const;

/** Id given to an item saved from the drawer: `rfi-<slugified title>`. */
export const RFI_LIBRARY_FORM_ID_PREFIX = 'rfi-';

/** Fallback id when an item reaches upsertRfiLibraryItem without one: `RFI-L-<timestamp>`. */
export const RFI_LIBRARY_ID_PREFIX = 'RFI-L-';
