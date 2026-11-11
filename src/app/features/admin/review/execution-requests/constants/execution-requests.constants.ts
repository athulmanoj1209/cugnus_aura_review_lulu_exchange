export const ExecutionRequestViewModes = { Grid: 'grid', List: 'list' } as const;
export type ExecutionRequestViewMode = (typeof ExecutionRequestViewModes)[keyof typeof ExecutionRequestViewModes];

export const EXECUTION_REQUEST_TYPES = {
  Observation: 'observation', Evidence: 'evidence', Recommendation: 'recommendation'
} as const;
export const EXECUTION_REQUEST_STATUSES = {
  PendingReview: 'pending_review', PendingApproval: 'pending_approval', Submitted: 'submitted', Approved: 'approved', Rejected: 'rejected'
} as const;
export const EXECUTION_REQUEST_RISK_RATINGS = {
  Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low'
} as const;
export const EXECUTION_REQUEST_PAGE_SIZE = 8;
export const EXECUTION_REQUEST_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

