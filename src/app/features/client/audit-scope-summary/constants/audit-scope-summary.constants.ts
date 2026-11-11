import type { ScopeStatus } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';

/** Roles available in the client audit-scope summary. */
export const ClientScopeRoles = {
    Cfo: 'cfo',
    SubDivisionHead: 'sub-division-head'
} as const;
export type ClientRole = (typeof ClientScopeRoles)[keyof typeof ClientScopeRoles];

/** Display statuses used by the client audit-scope summary. */
export const ClientScopeStatuses = {
    NotStarted: 'not-started',
    Planned: 'planned',
    InProgress: 'in-progress',
    Overdue: 'overdue',
    Completed: 'completed'
} as const;
export type ClientScopeStatus = (typeof ClientScopeStatuses)[keyof typeof ClientScopeStatuses];

/** Grid/list toggle values used by the client audit-scope summary. */
export const ClientScopeViewModes = {
    Grid: 'grid',
    List: 'list'
} as const;
export type ClientScopeViewMode = (typeof ClientScopeViewModes)[keyof typeof ClientScopeViewModes];

/** Query-string keys used when opening the page from a dashboard card. */
export const AUDIT_SCOPE_SUMMARY_QUERY_PARAMS = {
    Role: 'role',
    SubDivision: 'sub-division',
    Status: 'status'
} as const;

/** Scope workflow statuses mapped to the client-facing status vocabulary. */
export const AUDIT_SCOPE_SUMMARY_WORKFLOW_STATUS_MAP: Record<ScopeStatus, ClientScopeStatus> = {
    'Not Started': ClientScopeStatuses.NotStarted,
    Planned: ClientScopeStatuses.Planned,
    'In Progress': ClientScopeStatuses.InProgress,
    Overdue: ClientScopeStatuses.Overdue,
    Completed: ClientScopeStatuses.Completed,
    'Pending Review': ClientScopeStatuses.InProgress,
    Approved: ClientScopeStatuses.Completed,
    Rejected: ClientScopeStatuses.NotStarted
};

export const AUDIT_SCOPE_SUMMARY_DEFAULT_WORKFLOW_STATUS: ScopeStatus = 'Not Started';

/* Configuration */

export const AUDIT_SCOPE_SUMMARY_DRAWER = {
    Width: '600px',
    StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]'
} as const;

export const AUDIT_SCOPE_SUMMARY_PAGE_SIZE = 10;
export const AUDIT_SCOPE_SUMMARY_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
export const AUDIT_SCOPE_SUMMARY_SUBSCOPE_PAGE_SIZE = 4;
export const AUDIT_SCOPE_SUMMARY_MAX_VISIBLE_AUDITORS = 2;
export const AUDIT_SCOPE_SUMMARY_INITIALS_LENGTH = 2;

export const AUDIT_SCOPE_SUMMARY_OBJECTIVE_TRUNCATE = {
    List: 60,
    Grid: 100
} as const;

export const AUDIT_SCOPE_SUMMARY_DATE_LOCALE = 'en-GB';
export const AUDIT_SCOPE_SUMMARY_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
};

export const AUDIT_SCOPE_SUMMARY_DAYS_IN_MS = 24 * 60 * 60 * 1000;
export const AUDIT_SCOPE_SUMMARY_EMPTY_VALUE = '—';
