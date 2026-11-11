import { ScopeJobControlRatings, ScopeTaskPriorities, ScopeTaskStatuses } from '../../scope-job/constants/scope-job.constants';

export { ScopeJobControlRatings, ScopeTaskPriorities, ScopeTaskStatuses };
export type { ScopeJobControlRating, ScopeTaskPriority, ScopeTaskStatus } from '../../scope-job/constants/scope-job.constants';

export const SCOPE_TASK_LIST_PAGE_SIZE = 10;
export const SCOPE_TASK_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
export const SCOPE_TASK_ID_SEPARATOR = '-T';

export const SCOPE_TASK_CHECKLIST_ITEMS = [
    'Verify authorization controls', 'Review access logs', 'Test password policies',
    'Check segregation of duties', 'Validate data retention', 'Confirm backup procedures',
    'Review audit trail', 'Verify user access rights', 'Test change management', 'Review incident reports',
] as const;

export const SCOPE_TASK_TAGS = ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk', 'Core Control', 'Evidence Review'] as const;
