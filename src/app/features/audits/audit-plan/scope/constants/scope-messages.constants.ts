/* ── User-facing text for the scope module ─────────────────────────────── */

export const SCOPE_INVALID_FIELD_MESSAGE = 'Invalid field.';

/** Validation messages for the Add/Edit scope form, keyed by control → error key. */
export const SCOPE_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  company: { required: 'Company / organization is required.' },
  division: { required: 'Division is required.' },
  subDivision: { required: 'Sub-division is required — this division has sub-divisions.' },
  auditPlan: { required: 'Audit plan is required.' },
  scopeName: {
    required: 'Scope name is required.',
    minlength: 'Scope name must be at least 2 characters.',
    maxlength: 'Scope name cannot exceed 200 characters.',
  },
  scopeType: { required: 'Scope type is required.' },
  linkedSubDivisions: { required: 'Please select at least one linked department.' },
  auditFrequency: { required: 'Audit frequency is required.' },
  modeOfAudit: { required: 'Mode of audit is required.' },
  samplingMethodology: { required: 'Sampling methodology is required.' },
  samplingSize: {
    required: 'Sampling size is required.',
    min: 'Sampling size must be at least 1.',
  },
  startDate: { required: 'Start date is required.' },
  endDate: {
    required: 'End date is required.',
    dateRangeInvalid: 'End date must be after start date.',
  },
  assignedAuditors: { required: 'Please assign at least one auditor.' },
  assignedReviewers: { required: 'Please assign at least one reviewer.' },
  objective: { maxlength: 'Objective cannot exceed 500 characters.' },
  estimatedHours: { min: 'Estimated hours must be at least 1.' },
};

/** Validation messages for the sub-scope rows of the scope form. */
export const SCOPE_SUBSCOPE_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  subScopeName: { required: 'Sub-scope name is required.' },
  subScopeType: { required: 'Sub-scope type is required.' },
  linkedSubDivisions: { required: 'Please select at least one sub-division.' },
  auditFrequency: { required: 'Audit frequency is required.' },
  modeOfAudit: { required: 'Mode of audit is required.' },
  samplingMethodology: { required: 'Sampling methodology is required.' },
  samplingSize: {
    required: 'Sampling size is required.',
    min: 'Sampling size must be at least 1.',
  },
  startDate: { required: 'Start date is required.' },
  endDate: { required: 'End date is required.' },
  assignedAuditors: { required: 'Please assign at least one auditor.' },
  objective: { maxlength: 'Objective cannot exceed 500 characters.' },
  estimatedHours: { min: 'Estimated hours must be at least 1.' },
};

/** Validation messages for the task form (com/scope-task). */
export const SCOPE_TASK_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  taskType: { required: 'Task type is required.' },
  taskName: {
    required: 'Task name is required.',
    minlength: 'Task name must be at least 2 characters.',
    maxlength: 'Task name cannot exceed 200 characters.',
  },
  status: { required: 'Status is required.' },
  objective: { maxlength: 'Objective cannot exceed 500 characters.' },
  assignedAuditor: { required: 'Please assign an auditor.' },
  startDate: { required: 'Start date is required.' },
  endDate: {
    required: 'End date is required.',
    endBeforeStart: 'End date must be after start date.',
  },
  controlRating: { required: 'Control rating is required.' },
  riskPriority: { required: 'Risk priority is required.' },
};

/* ── Toasts ───────────────────────────────────────────────────────────── */

export const SCOPE_TOAST_MESSAGES = {
  Added: 'Audit scope has been successfully added.',
  Updated: 'Audit scope has been successfully updated.',
  Approved: 'Audit scope have been successfully approved.',
  ApprovedTitle: 'Audit scope approved',
  Rejected: 'Audit scope have been rejected.',
  RejectedTitle: 'Audit scope rejected',
} as const;

/** In-drawer p-toast messages (MessageService) on the scope form. */
export const SCOPE_FORM_NOTICES = {
  ValidationSummary: 'Validation Error',
  FixBeforeProceeding: 'Please fix all highlighted fields before proceeding.',
  FixBeforeSubmitting: 'Please fix all highlighted fields before submitting.',
  TasksRequiredSummary: 'Tasks Required',
  TasksRequired: 'Please add at least one task before submitting.',
  InvalidFileTypeSummary: 'Invalid file type',
  invalidFileType: (fileName: string) => `${fileName} must be PDF, DOCX, JPG, PNG, or TXT.`,
  FileTooLargeSummary: 'File too large',
  fileTooLarge: (fileName: string, maxMb: number) => `${fileName} exceeds the ${maxMb} MB limit.`,
} as const;

/** In-drawer p-toast messages on the task form. */
export const SCOPE_TASK_NOTICES = {
  ValidationSummary: 'Validation Error',
  FixBeforeAdding: 'Please fix all highlighted fields before adding.',
  UpdatedSummary: 'Task Updated',
  updated: (taskName: unknown) => `"${taskName}" has been updated.`,
  AddedSummary: 'Task Added',
  added: (taskName: unknown) => `"${taskName}" added to the list.`,
} as const;

/* ── Dialogs & titles ─────────────────────────────────────────────────── */

export const SCOPE_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this audit scope?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this audit scope?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

 

/* ── Listing text ─────────────────────────────────────────────────────── */

