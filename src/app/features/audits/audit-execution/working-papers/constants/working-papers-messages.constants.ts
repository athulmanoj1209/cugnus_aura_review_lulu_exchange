/* ── User-facing text for the working-papers module ───────────────────── */

export const WORKING_PAPER_TOAST_MESSAGES = {
  Created: 'New working paper has been successfully added.',
  Updated: 'Working paper details have been successfully updated.',
} as const;

export const WORKING_PAPER_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this working paper? This action cannot be undone.',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this working paper? The preparer will be notified.',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** Add / Edit / Review Working Paper drawer header copy, by mode. */
export const WORKING_PAPER_DRAWER_HEADERS = {
  Create: { Title: 'Add Working Paper', Subtitle: 'Create an audit working paper and attach evidence' },
  Edit: { Title: 'Edit Working Paper', Subtitle: 'Update working paper details' },
  Approve: { Title: 'Review Working Paper', Subtitle: 'Review the working paper, add your notes and approve or reject' },
} as const;

export const WORKING_PAPER_SUBMIT_LABELS = {
  Create: 'ADD WORKING PAPER',
  Edit: 'Save Changes',
} as const;

export const WORKING_PAPER_FORM_ERRORS = {
  ReviewerNotesRequired: 'Reviewer notes are required when rejecting a working paper.',
} as const;

export const WORKING_PAPER_FORM_PLACEHOLDERS = {
  Division: 'Select division',
  CompanyFirst: 'Select a company first',
  SubDivision: 'Select sub-division',
  DivisionFirst: 'Select a division first',
  NoSubDivisions: 'No sub-divisions for this division',
  Scope: 'Select scope',
  SubDivisionFirst: 'Select a sub-division first',
  Subscope: 'Select subscope',
  ScopeFirst: 'Select a scope first',
  NoSubscopes: 'No sub-scopes for this scope',
} as const;

export const WORKING_PAPER_SUB_DIVISION_FILTER_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** Activate / deactivate tooltips on the list and grid. */
export const WORKING_PAPER_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;

/** Shown when a value (e.g. a date or reviewer) is missing. */
export const WORKING_PAPER_EMPTY_VALUE = '—';

export const WORKING_PAPER_NO_RESULTS = 'No results';

export const pageRangeLabel = (start: number, end: number, total: number): string =>
  `Showing ${start}–${end} of ${total}`;

export const filterChipLabel = (prefix: string, count: number): string => `${prefix}: ${count}`;

export const taskFilterOptionLabel = (taskId: string, taskTitle: string): string => `${taskId} — ${taskTitle}`;

/** Auditor-dashboard paper label: `<ref>: <title>`. */
export const auditorPaperLabel = (id: string, title: string): string => `${id}: ${title}`;
