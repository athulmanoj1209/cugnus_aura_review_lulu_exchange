/* ── Value sets ───────────────────────────────────────────────────────────
 * The workflow status values are owned by the company / division /
 * sub-division modules — this queue only collects them, so they are
 * referenced from those modules' constants instead of retyped here.
 */

import { CompanyOrgStatuses } from '@/app/features/audits/organization/company/constants/company.constants';
import { DivisionAuditStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionAuditStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';

/** Kind of record a request is for — stored as display text. */
export const OrgRequestTypes = {
  Company: 'Company',
  Division: 'Division',
  SubDivision: 'Sub-Division',
} as const;

/**
 * Every approval-workflow status a request can carry. Sub-divisions store
 * `pending_approval` and divisions store an approved division as
 * `not_planned` — see OrganizationRequestListComponent.displayStatus().
 */
export const OrgRequestStatuses = {
  PendingReview: CompanyOrgStatuses.PendingReview,
  PendingApproval: SubDivisionAuditStatuses.PendingApproval,
  Approved: CompanyOrgStatuses.Approved,
  Rejected: CompanyOrgStatuses.Rejected,
  NotPlanned: DivisionAuditStatuses.NotPlanned,
} as const;

/** The statuses that put a record in this queue. */
export const ORG_REQUEST_WORKFLOW_STATUSES: readonly string[] = Object.values(OrgRequestStatuses);

export const OrgRequestRiskLevels = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

/** Grid / list toggle on the queue. */
export const OrgRequestViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type OrgRequestViewMode = typeof OrgRequestViewModes[keyof typeof OrgRequestViewModes];

export const OrgRequestSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type OrgRequestSortDirection = typeof OrgRequestSortDirections[keyof typeof OrgRequestSortDirections];

/* ── Configuration ────────────────────────────────────────────────────── */

export const ORG_REQUEST_PAGE_SIZE = 8;
export const ORG_REQUEST_DEFAULT_SORT_COLUMN = 'id';

/** Placeholder for a field that doesn't apply (e.g. a company's division). */
export const ORG_REQUEST_EMPTY_VALUE = '—';

/** Risk used when a company has no risk rating. */
export const ORG_REQUEST_DEFAULT_RISK = OrgRequestRiskLevels.Low;

/** Widths the review drawers open at (these differ from the owning pages' own drawers). */
export const ORG_REQUEST_DRAWER = {
  CompanyWidth: '800px',
  DivisionWidth: '800px',
  SubDivisionWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;
