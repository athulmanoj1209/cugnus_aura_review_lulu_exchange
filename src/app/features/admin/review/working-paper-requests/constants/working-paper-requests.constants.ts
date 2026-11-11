export const WorkingPaperRequestViewModes = { Grid: 'grid', List: 'list' } as const;
export type WorkingPaperRequestViewMode = (typeof WorkingPaperRequestViewModes)[keyof typeof WorkingPaperRequestViewModes];

export const WORKING_PAPER_REQUEST_RISKS = {
  Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low'
} as const;
export const WORKING_PAPER_REQUEST_PAGE_SIZE = 8;
export const WORKING_PAPER_REQUEST_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

