import type { RfiStatus, ScopeStatus, UpcomingAuditStatus } from '../models/client-dashboard.model';

/** Personas supported by the client dashboard. */
export const ClientDashboardRoles = {
  Cfo: 'CFO',
  SubDivisionHead: 'SUB_DIVISION_HEAD'
} as const;
export type ClientDashboardRole = (typeof ClientDashboardRoles)[keyof typeof ClientDashboardRoles];

/** Dashboard chart/list grouping modes. */
export const ClientDashboardViewModes = {
  Division: 'division',
  SubDivision: 'subDivision'
} as const;
export type ClientDashboardViewMode = (typeof ClientDashboardViewModes)[keyof typeof ClientDashboardViewModes];

/** Stable dashboard tab indexes used by the tab buttons. */
export const CLIENT_DASHBOARD_TABS = {
  Overview: '0',
  Rfis: '1',
  Scope: '2',
  NotificationsReports: '3'
} as const;

export const CLIENT_DASHBOARD_ROUTES = {
  Rfi: ['/client/manage-client-rfi'],
  Scope: ['/client/scope-summary']
} as const;

export const CLIENT_DASHBOARD_PAGE_SIZE = 10;
export const CLIENT_DASHBOARD_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
export const CLIENT_DASHBOARD_PREVIEW_COUNT = 5;
export const CLIENT_DASHBOARD_DESCRIPTION_TRUNCATE_LENGTH = 80;
export const CLIENT_DASHBOARD_PERCENTAGE_MAX = 100;
export const CLIENT_DASHBOARD_EMPTY_VALUE = '—';

export const CLIENT_DASHBOARD_RFI_STATUS_COLORS: Record<string, string> = {
  Pending: '#FF9800',
  Overdue: '#EF4444',
  'Under Review': '#9E9E9E',
  Reopened: '#8B5CF6',
  Completed: '#4CAF50'
};

export const CLIENT_DASHBOARD_SCOPE_STATUS_SEVERITY: Record<string, 'danger' | 'warn' | 'success' | 'info' | 'secondary'> = {
  'On track': 'success',
  'In progress': 'info',
  'At risk': 'warn',
  Delayed: 'danger',
  Completed: 'success',
  'Not started': 'secondary',
  Pending: 'secondary',
  Overdue: 'danger',
  Planned: 'secondary'
};

export const CLIENT_DASHBOARD_UPCOMING_AUDIT_SEVERITY: Record<UpcomingAuditStatus, 'danger' | 'warn' | 'success' | 'info' | 'secondary'> = {
  'In Progress': 'info',
  Planned: 'secondary',
  Completed: 'success',
  Overdue: 'danger'
};

export const CLIENT_DASHBOARD_RFI_STATUSES: RfiStatus[] = ['Pending', 'Overdue', 'Under Review', 'Reopened', 'Completed'];
export const CLIENT_DASHBOARD_SCOPE_STATUSES: ScopeStatus[] = ['On track', 'In progress', 'At risk', 'Delayed', 'Completed', 'Not started', 'Pending', 'Overdue', 'Planned'];

