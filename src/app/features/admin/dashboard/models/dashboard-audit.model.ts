import type { OrgBreakdown } from './dashboard-common.model';

/** Payload handed to the risk detail drawer via `RightDrawerService.open(..., { data })`. */
export interface RiskDetailData {
  riskLevels: string[];
  orgBreakdown: OrgBreakdown[];
}

/** One drawer page: a division's division-level audits, or one sub-division's audits. */
export interface AuditUnitPage {
  name: string;
  kind: 'division' | 'subDivision';
  /** Parent division of a sub-division page. */
  division?: string;
}

/** Payload handed to the sub-division detail drawer via `RightDrawerService.open(..., { data })`. */
export interface SubdivisionDetailData {
  /** Division-level pages first, then sub-division pages. */
  pages: AuditUnitPage[];
  /** Page to open on; defaults to the first. */
  startIndex?: number;
  /** `counts[i]` is the company's audit count for `pages[i]`. */
  orgBreakdown: OrgBreakdown[];
}

export type AuditSortMode = 'count' | 'alpha';
