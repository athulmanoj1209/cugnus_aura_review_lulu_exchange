/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (sub-division-static-data.ts) stay assignable to
 * the derived types in models/sub-division-static-data.model.ts.
 *
 * `subDivisionType` uses the Division Type domain — compare it against
 * `DivisionTypes` from divisions/constants/division.constants.ts.
 */

/** Active/inactive lifecycle status. */
export const SubDivisionStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

/** Approval-workflow status, separate from the active/inactive `status`. */
export const SubDivisionAuditStatuses = {
  Archived: 'archived',
  Pending: 'pending',
  PendingApproval: 'pending_approval',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export const SubDivisionRiskRatings = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export const SubDivisionRiskStatuses = {
  Open: 'open',
  Closed: 'closed',
  Monitored: 'monitored',
} as const;

export const SubDivisionCompanyIndustries = {
  AuditFirm: 'audit-firm',
  Jewelry: 'jewelry',
  Other: 'other',
} as const;

/** Status of the approval request this drawer was opened for (Organization Requests). */
export const SUB_DIVISION_REQUEST_PENDING_REVIEW = 'pending_review';

/** Mode the Add/Edit sub-division drawer opens in. */
export const SubDivisionDrawerModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type SubDivisionDrawerMode = typeof SubDivisionDrawerModes[keyof typeof SubDivisionDrawerModes];

export const SubDivisionApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type SubDivisionApprovalAction = typeof SubDivisionApprovalActions[keyof typeof SubDivisionApprovalActions];

/** Grid / list toggle on the sub-divisions listing page. */
export const SubDivisionViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type SubDivisionViewMode = typeof SubDivisionViewModes[keyof typeof SubDivisionViewModes];

/** Node types in the profile's audit-scope tree. */
export const SubDivisionScopeNodeTypes = {
  Scope: 'scope',
  SubScope: 'subscope',
} as const;
export type SubDivisionScopeNodeType = typeof SubDivisionScopeNodeTypes[keyof typeof SubDivisionScopeNodeTypes];

/* ── Configuration ────────────────────────────────────────────────────── */

/** CSS class on the profile drawer panel — also used to find it when resizing. */
export const SUB_DIVISION_PROFILE_DRAWER_CLASS = 'sub-division-profile-drawer';

export const SUB_DIVISION_DRAWER = {
  FormWidth: '700px',
  ProfileWidth: '820px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
  ProfileStyleClass: `${SUB_DIVISION_PROFILE_DRAWER_CLASS} rounded-tl-[35px] rounded-bl-[35px]`,
} as const;

/** Drag-to-resize limits for the profile drawer, in px. */
export const SUB_DIVISION_PROFILE_RESIZE = {
  MinWidth: 300,
  MaxWidth: 1200,
} as const;

export const SUB_DIVISION_LIST_PAGE_SIZE = 6;

/** Scopes per page in the profile's audit-scope tree. */
export const SUB_DIVISION_SCOPE_PAGE_SIZE = 6;

/** Fallback company badge colour when the company has none. */
export const SUB_DIVISION_DEFAULT_COMPANY_COLOR = '#102e70';
