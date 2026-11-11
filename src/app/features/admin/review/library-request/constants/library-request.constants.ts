/* ── Value sets ───────────────────────────────────────────────────────────
 * Status values are owned by the scope / RFI library modules (both use the
 * same three) — referenced from their constants instead of retyped here.
 */

import { ScopeLibraryStatuses } from '@/app/features/audits/libraries/scope-library/constants/scope-library.constants';
import { RfiLibraryPriorities } from '@/app/features/audits/libraries/rfi-library/constants/rfi-library.constants';

/** Kind of library item a request is for — stored as display text. */
export const LibRequestTypes = {
  Scope: 'Scope',
  Subscope: 'Subscope',
  Rfi: 'RFI',
} as const;

export const LibRequestStatuses = {
  PendingReview: ScopeLibraryStatuses.PendingReview,
  Approved: ScopeLibraryStatuses.Approved,
  Rejected: ScopeLibraryStatuses.Rejected,
} as const;

/** The statuses that put an item in this queue. */
export const LIB_REQUEST_WORKFLOW_STATUSES: readonly string[] = Object.values(LibRequestStatuses);

/** Risk shown on the queue — an RFI's priority, or a scope's risk category mapped to one. */
export const LibRequestRiskLevels = {
  Low: RfiLibraryPriorities.Low,
  Medium: RfiLibraryPriorities.Medium,
  High: RfiLibraryPriorities.High,
  Critical: RfiLibraryPriorities.Critical,
} as const;

/** Grid / list toggle on the queue. */
export const LibRequestViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type LibRequestViewMode = typeof LibRequestViewModes[keyof typeof LibRequestViewModes];

export const LibRequestSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type LibRequestSortDirection = typeof LibRequestSortDirections[keyof typeof LibRequestSortDirections];

/* ── Configuration ────────────────────────────────────────────────────── */

export const LIB_REQUEST_PAGE_SIZE = 8;
export const LIB_REQUEST_DEFAULT_SORT_COLUMN = 'id';

/** Placeholder for a field that doesn't apply (no submitter, no parent, …). */
export const LIB_REQUEST_EMPTY_VALUE = '—';

/** Risk used when a scope's risk category isn't in LIB_REQUEST_RISK_BY_CATEGORY. */
export const LIB_REQUEST_DEFAULT_RISK = LibRequestRiskLevels.Medium;
