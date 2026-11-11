import type { ClientScopeStatus } from './audit-scope-summary.constants';
import { ClientScopeStatuses } from './audit-scope-summary.constants';

export interface AuditScopeSummaryOption<T = string> {
    label: string;
    value: T;
}

export type AuditScopeSummaryTagSeverity = 'success' | 'info' | 'danger' | 'secondary';

export const AUDIT_SCOPE_SUMMARY_SELECT_DIVISION_FIRST_LABEL = 'Select a division first';
export const AUDIT_SCOPE_SUMMARY_SCOPES_ENTITY_LABEL = 'scopes';

export const AUDIT_SCOPE_SUMMARY_STATUS_OPTIONS: AuditScopeSummaryOption<ClientScopeStatus>[] = [
    { label: 'Not Started', value: ClientScopeStatuses.NotStarted },
    { label: 'Planned', value: ClientScopeStatuses.Planned },
    { label: 'In Progress', value: ClientScopeStatuses.InProgress },
    { label: 'Overdue', value: ClientScopeStatuses.Overdue },
    { label: 'Completed', value: ClientScopeStatuses.Completed }
];

export const AUDIT_SCOPE_SUMMARY_FREQUENCY_OPTIONS: AuditScopeSummaryOption[] = [
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Annually', value: 'annually' },
    { label: 'Monthly', value: 'monthly' }
];

export const AUDIT_SCOPE_SUMMARY_STATUS_LABELS: Record<ClientScopeStatus, string> = {
    [ClientScopeStatuses.NotStarted]: 'Not Started',
    [ClientScopeStatuses.Planned]: 'Planned',
    [ClientScopeStatuses.InProgress]: 'In Progress',
    [ClientScopeStatuses.Overdue]: 'Overdue',
    [ClientScopeStatuses.Completed]: 'Completed'
};

export const AUDIT_SCOPE_SUMMARY_STATUS_SEVERITY: Record<ClientScopeStatus, AuditScopeSummaryTagSeverity> = {
    [ClientScopeStatuses.NotStarted]: 'secondary',
    [ClientScopeStatuses.Planned]: 'secondary',
    [ClientScopeStatuses.InProgress]: 'info',
    [ClientScopeStatuses.Overdue]: 'danger',
    [ClientScopeStatuses.Completed]: 'success'
};
export const AUDIT_SCOPE_SUMMARY_DEFAULT_STATUS_SEVERITY: AuditScopeSummaryTagSeverity = 'secondary';

export const AUDIT_SCOPE_SUMMARY_FREQUENCY_LABELS: Record<string, string> = {
    quarterly: 'Quarterly',
    annually: 'Annually',
    monthly: 'Monthly'
};

export const AUDIT_SCOPE_SUMMARY_MODE_LABELS: Record<string, string> = {
    full: 'Full',
    limited: 'Limited',
    thematic: 'Thematic',
    'follow-up': 'Follow-up',
    continuous: 'Continuous'
};

export const AUDIT_SCOPE_SUMMARY_SCOPE_TYPE_LABELS: Record<string, string> = {
    departmental: 'Departmental',
    functional: 'Functional',
    independent: 'Independent',
    'sub-divisional': 'Sub-Divisional'
};

export const AUDIT_SCOPE_SUMMARY_METHODOLOGY_LABELS: Record<string, string> = {
    'risk-based': 'Risk-Based',
    random: 'Random',
    judgmental: 'Judgmental',
    systematic: 'Systematic',
    stratified: 'Stratified'
};

export const AUDIT_SCOPE_SUMMARY_RISK_LABELS: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
};

export const AUDIT_SCOPE_SUMMARY_RISK_CLASSES: Record<string, string> = {
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high'
};

export const AUDIT_SCOPE_SUMMARY_RISK_SEVERITY: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
    low: 'success',
    medium: 'warn',
    high: 'danger'
};

export const AUDIT_SCOPE_SUMMARY_SUB_DIVISION_LABELS: Record<string, string> = {
    'Finance & Accounts': 'Finance & Accounts',
    'Finance & Accounting': 'Finance & Accounting',
    'Retail Operations': 'Retail Operations',
    'Inventory & Warehouse': 'Inventory & Warehouse',
    'Inventory & Warehousing': 'Inventory & Warehousing',
    'Compliance & AML': 'Compliance & AML',
    'Human Resources': 'Human Resources',
    'IT & Systems': 'IT & Systems',
    Procurement: 'Procurement',
    'Quality Assurance': 'Quality Assurance',
    Logistics: 'Logistics',
    'Customer Service': 'Customer Service'
};

export const AUDIT_SCOPE_SUMMARY_AUDITOR_LABELS: Record<string, string> = {
    alice: 'Alice Johnson',
    bob: 'Bob Smith',
    carol: 'Carol White',
    david: 'David Lee',
    emma: 'Emma Clarke',
    felix: 'Felix Rahman',
    grace: 'Grace Kim',
    henry: 'Henry Patel',
    irene: 'Irene Thomas',
    james: 'James Wilson',
    karen: 'Karen Osei',
    liam: 'Liam George',
    mia: 'Mia Fernandes'
};

export type AuditScopeSummaryCardKey = 'total' | 'inprogress' | 'notstarted' | 'overdue' | 'completed';

export const AUDIT_SCOPE_SUMMARY_CARD_DEFINITIONS: Record<AuditScopeSummaryCardKey, { label: string; icon: string }> = {
    total: {
        label: 'Total Scopes',
        icon: 'pi pi-folder-open'
    },
    inprogress: {
        label: 'In Progress',
        icon: 'pi pi-history'
    },
    notstarted: {
        label: 'Not Started',
        icon: 'pi pi-clock'
    },
    overdue: {
        label: 'Overdue',
        icon: 'pi pi-exclamation-triangle'
    },
    completed: {
        label: 'Completed',
        icon: 'pi pi-check-circle'
    }
};

export const AUDIT_SCOPE_SUMMARY_PROFILE_LABELS = {
    Scope: 'Scope',
    SubScope: 'Sub-Scope',
    Close: 'Close',
    AuditorsSubtitle: 'Auditors responsible for this scope',
    ReviewersSubtitle: 'Assigned reviewers for this scope'
} as const;
