/** Shared value sets and configuration for the admin dashboard. */
export const DashboardViews = {
  Division: 'division',
  SubDivision: 'subDivision',
} as const;
export type DashboardView = typeof DashboardViews[keyof typeof DashboardViews];

export const DashboardRiskLevels = {
  Critical: 'Critical',
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
} as const;

export const DashboardRfiStatuses = {
  Pending: 'pending',
  Overdue: 'overdue',
  UnderReview: 'under-review',
  Completed: 'completed',
  Reopened: 'reopened',
} as const;

export const DashboardFindingSortModes = {
  Age: 'age',
  Severity: 'severity',
  Company: 'company',
  Alpha: 'alpha',
} as const;

export const DASHBOARD_LIMITS = {
  PreviewUnits: 3,
  PreviewDepartments: 3,
  UpcomingAudits: 5,
  ChartHeight: 260,
  FullCompliance: 100,
} as const;

export const DASHBOARD_DRAWER = {
  StandardWidth: '860px',
  DetailWidth: '720px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
} as const;

export const DASHBOARD_ROUTES = {
  Findings: '/audits/audit-execution/findings',
  Rfi: '/audits/audit-execution/manage-rfi',
  Scope: '/audits/audit-plan/audit-scope',
  Plan: '/audits/audit-plan/audit-plan-list',
} as const;
