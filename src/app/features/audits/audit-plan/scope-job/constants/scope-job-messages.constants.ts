/* ── User-facing text for the scope-job module ────────────────────────── */

export const SCOPE_JOB_TOAST_MESSAGES = {
  ValidationError: 'Please fix highlighted fields.',
  ValidationErrorTitle: 'Validation Error',
  Saved: 'Scope job updated successfully.',
  SavedTitle: 'Saved',
  TaskAddedTitle: 'Task Added',
  TaskUpdatedTitle: 'Task Updated',
  TaskRemoved: 'Task has been removed.',
  TaskRemovedTitle: 'Task Removed',
  StatusUpdatedTitle: 'Status Updated',
} as const;

export const taskAddedMessage = (title: string): string => `"${title}" has been added.`;

export const taskUpdatedMessage = (title: string): string => `"${title}" has been updated.`;

export const taskStatusUpdatedMessage = (status: string): string =>
  `Task status updated to "${status.replace('_', ' ')}".`;

export const statusUpdatedMessage = (target: string, statusLabel: string): string =>
  `${target} status set to "${statusLabel}".`;

/** Edit Scope Job drawer — task panel. */
export const SCOPE_JOB_TASK_FORM_TITLES = {
  Edit: 'Edit Task',
  New: 'New Task',
} as const;

export const SCOPE_JOB_TASK_FORM_LABELS = {
  AddTask: 'Add New Task',
  Cancel: 'Cancel',
  SaveTask: 'Save Task',
  UpdateTask: 'Update Task',
} as const;

export const SCOPE_JOB_ACTIVE_LABELS = {
  Active: 'Active',
  Inactive: 'Inactive',
} as const;

/** Status-update drawer copy, by target. */
export const SCOPE_JOB_STATUS_UPDATE_LABELS = {
  Job: { Chip: 'Job Status Update', Target: 'Job', Submit: 'Update Job Status' },
  Task: { Chip: 'Task Status Update', Target: 'Task', Submit: 'Update Task Status' },
} as const;

export const SCOPE_JOB_UNKNOWN_TASK_TITLE = 'Unknown Task';

export const SCOPE_JOB_STATUS_UPDATE_ERRORS = {
  NoteRequired: 'Note is required.',
  AuditOverviewRequired: 'Audit Overview is required when marking status as Completed.',
  TimeSpentRequired: 'Time spent is required when completing.',
} as const;

export const maxCharactersMessage = (max: number): string => `Maximum ${max} characters.`;

export const minTimeSpentMessage = (min: number): string => `Please enter a valid value (min ${min} hours).`;

export const taskTitleLengthMessage = (min: number, max: number): string =>
  `Title is required (${min}–${max} characters).`;

/** Relative due-date wording on the auditor dashboard's "My Tasks" table. */
export const SCOPE_TASK_DUE_LABELS = {
  Today: 'Today',
  Tomorrow: 'Tomorrow',
} as const;

export const SCOPE_JOB_SUB_DIVISION_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** "1 task" / "3 tasks", "1 day" / "2 days", … */
export const pluralize = (count: number, word: string): string =>
  `${word}${count === 1 ? '' : 's'}`;
