import type { ScopeJobControlRating, ScopeTaskPriority, ScopeTaskStatus } from '../../scope-job/constants/scope-job.constants';
export type ChecklistItemStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'not_applicable';

export interface ScopeTask {
    id: string;
    title: string;
    objective?: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    startDate?: Date;
    endDate?: Date;
    status: ScopeTaskStatus;
    priority: ScopeTaskPriority;
    checklistItems?: string[];
    checklistStatuses?: ChecklistItemStatus[];
    controlRating?: ScopeJobControlRating;
    tags?: string[];
}

export interface ScopeTaskProfileDrawerData { task: ScopeTask; }

export type TaskSortKey = 'id' | 'title' | 'status' | 'checklist' | 'auditor' | 'timeframe' | 'controlRating' | 'priority' | 'tags';
