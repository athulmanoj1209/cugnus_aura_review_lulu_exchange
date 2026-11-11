/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (division-static-data.ts) stay assignable to the
 * derived types in models/division-static-data.model.ts.
 */

export const DivisionStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

export const DivisionTypes = {
  HeadOffice: 'head_office',
  Branch: 'branch',
  Department: 'department',
  RepresentativeOffice: 'representative_office',
  Warehouse: 'warehouse',
  Factory: 'factory',
  ProjectOffice: 'project_office',
  Subsidiary: 'subsidiary',
} as const;

export const DivisionRiskRatings = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export const DivisionRiskStatuses = {
  Open: 'open',
  Monitored: 'monitored',
  Closed: 'closed',
} as const;

export const DivisionAuditStatuses = {
  NotPlanned: 'not_planned',
  Planned: 'planned',
  InProgress: 'in_progress',
  Completed: 'completed',
  PendingReview: 'pending_review',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

/** Mode the Add/Edit/View division drawer opens in. */
export const DivisionDrawerModes = {
  Add: 'add',
  View: 'view',
  Edit: 'edit',
} as const;
export type DivisionDrawerMode = typeof DivisionDrawerModes[keyof typeof DivisionDrawerModes];

export const DivisionApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type DivisionApprovalAction = typeof DivisionApprovalActions[keyof typeof DivisionApprovalActions];

/** Grid / list toggle on the divisions listing page. */
export const DivisionViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type DivisionViewMode = typeof DivisionViewModes[keyof typeof DivisionViewModes];

/** The three document upload slots on the division form. */
export const DivisionDocTypes = {
  Trade: 'trade',
  Vat: 'vat',
  Org: 'org',
} as const;
export type DivisionDocType = typeof DivisionDocTypes[keyof typeof DivisionDocTypes];

/** Tone of the license-expiry badge on the division profile. */
export const LicenseExpiryTones = {
  Ok: 'ok',
  Warn: 'warn',
  Expired: 'expired',
} as const;
export type LicenseExpiryTone = typeof LicenseExpiryTones[keyof typeof LicenseExpiryTones];

/* ── Configuration ────────────────────────────────────────────────────── */

export const DIVISION_DRAWER = {
  FormWidth: '700px',
  ProfileWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;

export const DIVISION_LIST_PAGE_SIZE = 6;

export const DIVISION_NAME_MAX_LENGTH = 150;

/** Index of the last tab in the division form (Org Structure). */
export const DIVISION_FORM_LAST_TAB = 5;

/** Form controls validated per tab before "Next" is allowed. */
export const DIVISION_TAB_FIELDS: Record<number, string[]> = {
  0: ['company', 'divisionName', 'divisionCode', 'divisionType', 'departmentType', 'status', 'hasSubDivision'],
  1: ['licenseNumber', 'licenseAuthority'],
  2: ['country', 'emirateState', 'city', 'addressLine1'],
  3: ['divisionManager', 'primaryContactPerson', 'contactEmail', 'contactPhone'],
  4: ['riskRating', 'riskStatus', 'auditStatus', 'sectorActivity'],
  5: ['parentNode'],
};

/** Prefix used by "Generate code" when no company is selected yet. */
export const DIVISION_CODE_FALLBACK_PREFIX = 'BR';

/** Fallback company badge colour when the company has none. */
export const DIVISION_DEFAULT_COMPANY_COLOR = '#102e70';

/** A license expiring within this many days shows the warning tone. */
export const LICENSE_EXPIRY_WARN_DAYS = 60;

/** Placeholder document every division card links to until real uploads exist. */
export const DIVISION_SAMPLE_DOCUMENT = {
  Url: 'http://localhost:5251/uploads/Audit_Theory_BRD.docx',
  FileName: 'Audit_Theory_BRD.docx',
} as const;
