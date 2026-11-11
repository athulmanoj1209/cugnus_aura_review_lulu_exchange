export const CLIENT_DASHBOARD_LABELS = {
  Division: 'Division',
  SubDivision: 'Sub-Division',
  ViewAll: 'View all',
  TotalRfis: 'Total RFIs',
  Open: 'Open',
  Overdue: 'Overdue',
  Pending: 'Pending',
  UnderReview: 'Under Review',
  Reopened: 'Reopened',
  Completed: 'Completed',
  Final: 'Final',
  Draft: 'Draft',
  Scope: 'Scope',
  Progress: 'Progress',
  Status: 'Status',
  ScopeItems: 'scope items',
  Divisions: 'divisions',
  SubDivisions: 'sub-divisions'
} as const;

export const CLIENT_DASHBOARD_RFI_STATUS_LABELS: Record<string, string> = {
  Pending: 'Pending',
  Overdue: 'Overdue',
  'Under Review': 'Under Review',
  Reopened: 'Reopened',
  Completed: 'Completed'
};

export const CLIENT_DASHBOARD_REPORT_STATUS_LABELS = {
  draft: 'Draft',
  final: 'Final'
} as const;
