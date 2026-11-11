export const DraftReportRequestViewModes = { Grid: 'grid', List: 'list' } as const;
export type DraftReportRequestViewMode = (typeof DraftReportRequestViewModes)[keyof typeof DraftReportRequestViewModes];

export const DRAFT_REPORT_REQUEST_STATUSES = {
  InProgress: 'in-progress',
  AwaitingReview: 'awaiting-review',
  Reopened: 'reopened'
} as const;
export const DRAFT_REPORT_REQUEST_PAGE_SIZE = 8;
export const DRAFT_REPORT_REQUEST_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];
export const DRAFT_REPORT_REQUEST_ROUTE = ['/audit/reports'] as const;

