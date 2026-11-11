/** Which unit the "Audits / Findings / RFIs by …" charts group records by. */
export type DashboardByView = 'division' | 'subDivision';

export interface OrgBreakdown {
  org: string;
  counts: number[];
}

export interface CompanyRow {
  org: string;
  count: number;
}
