export const RiskRequestViewModes = { Grid: 'grid', List: 'list' } as const;
export type RiskRequestViewMode = (typeof RiskRequestViewModes)[keyof typeof RiskRequestViewModes];

export const RISK_REQUEST_RATINGS = {
  Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low'
} as const;
export const RISK_REQUEST_PAGE_SIZE = 8;
export const RISK_REQUEST_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

