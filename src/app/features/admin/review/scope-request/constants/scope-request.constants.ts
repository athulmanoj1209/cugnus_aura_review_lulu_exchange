/* ── Value sets ───────────────────────────────────────────────────────────
 * The scope's own workflow / risk values are owned by the scope module
 * (audit-plan/scope/constants) — referenced from there, not retyped here.
 */

import { SCOPE_REQUEST_PENDING_REVIEW, ScopeRiskRatings } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';

/** Scope vs sub-scope request — stored as display text. */
export const ScopeRequestTypes = {
  Scope: 'Scope',
  Subscope: 'Subscope',
} as const;

/** Queue status (snake_case) — mapped to/from the scope's Title Case workflowStatus in scope-request-static-data.ts. */
export const ScopeRequestStatuses = {
  PendingReview: SCOPE_REQUEST_PENDING_REVIEW,
  Approved: 'approved',
  Rejected: 'rejected',
} as const;

export const ScopeRequestRiskLevels = {
  Low: ScopeRiskRatings.Low,
  Medium: ScopeRiskRatings.Medium,
  High: ScopeRiskRatings.High,
} as const;

/** Grid / list toggle on the queue. */
export const ScopeRequestViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type ScopeRequestViewMode = typeof ScopeRequestViewModes[keyof typeof ScopeRequestViewModes];

export const ScopeRequestSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type ScopeRequestSortDirection = typeof ScopeRequestSortDirections[keyof typeof ScopeRequestSortDirections];

/* ── Configuration ────────────────────────────────────────────────────── */

export const SCOPE_REQUEST_PAGE_SIZE = 8;
export const SCOPE_REQUEST_DEFAULT_SORT_COLUMN = 'id';

/** Placeholder for a field that doesn't apply (division-level scope's sub-division, no parent, …). */
export const SCOPE_REQUEST_EMPTY_VALUE = '—';

/** Risk used when a scope has no risk rating. */
export const SCOPE_REQUEST_DEFAULT_RISK = ScopeRequestRiskLevels.Low;

/** Width the review drawer opens at (the Scope page's own form drawer is 700px). */
export const SCOPE_REQUEST_DRAWER = {
  Width: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;
