/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (scope-library-static-*.ts) stay assignable to the
 * derived types in models/scope-library-list.model.ts.
 *
 * Scope vs sub-scope level ('scope' / 'subscope') is owned by the scope
 * module — use ScopeLevels from
 * '@/app/features/audits/audit-plan/scope/constants/scope.constants'.
 */

/** Review status of a scope library item. */
export const ScopeLibraryStatuses = {
  PendingReview: 'pending_review',
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

/** Risk category values are stored as display text. */
export const ScopeLibraryRiskCategories = {
  AccessManagement: 'Access Management',
  ChangeManagement: 'Change Management',
  VendorRisk: 'Vendor Risk',
  FinancialRisk: 'Financial Risk',
  OperationalRisk: 'Operational Risk',
  ComplianceRisk: 'Compliance Risk',
  ItGeneralControls: 'IT General Controls',
  DataPrivacy: 'Data Privacy',
  BusinessContinuity: 'Business Continuity',
  FraudRisk: 'Fraud Risk',
} as const;

export const ScopeLibraryFrameworks = {
  Cobit: 'COBIT',
  Iso27001: 'ISO 27001',
  Nist: 'NIST',
  Coso: 'COSO',
  Sox: 'SOX',
  PciDss: 'PCI DSS',
} as const;

/** Mode the Add/Edit scope library drawer opens in. */
export const ScopeLibraryDrawerModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type ScopeLibraryDrawerMode = typeof ScopeLibraryDrawerModes[keyof typeof ScopeLibraryDrawerModes];

export const ScopeLibraryApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type ScopeLibraryApprovalAction = typeof ScopeLibraryApprovalActions[keyof typeof ScopeLibraryApprovalActions];

/** Grid / list toggle on the scope library listing page. */
export const ScopeLibraryViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type ScopeLibraryViewMode = typeof ScopeLibraryViewModes[keyof typeof ScopeLibraryViewModes];

/* ── Configuration ────────────────────────────────────────────────────── */

export const SCOPE_LIBRARY_DRAWER = {
  FormWidth: '640px',
  ProfileWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;

export const SCOPE_LIBRARY_PAGE_SIZE = 6;

/** Objective truncation on the listing cards / rows. */
export const SCOPE_LIBRARY_OBJECTIVE_TRUNCATE = {
  Grid: 110,
  List: 70,
} as const;

/** Delay (ms) before the drawer closes after an approve/reject, so the in-drawer toast is seen. */
export const SCOPE_LIBRARY_APPROVAL_CLOSE_DELAY_MS = 1200;

/** Id given to an item saved from the drawer: `sl-new-<slugified title>`. */
export const SCOPE_LIBRARY_FORM_ID_PREFIX = 'sl-new-';

/** Fallback id when an item reaches upsertScopeLibraryItem without one: `SL-<timestamp>`. */
export const SCOPE_LIBRARY_ID_PREFIX = 'SL-';
