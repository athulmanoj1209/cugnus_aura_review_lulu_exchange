/* ── User-facing text for the observation module ──────────────────────── */

export const OBSERVATION_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this observation? This action cannot be undone.',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this observation? The submitter will be notified.',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** Add / Edit / Review Observation drawer header copy, by mode. */
export const OBSERVATION_DRAWER_HEADERS = {
  Create: { Title: 'Add Observation', Subtitle: 'Record an auditor observation linked to evidence' },
  Edit: { Title: 'Edit Observation', Subtitle: 'Update observation details' },
  Approve: { Title: 'Review Observation', Subtitle: 'Edit observation details, add your notes and approve or reject' },
} as const;

export const OBSERVATION_SUBMIT_LABELS = {
  Create: 'ADD OBSERVATION',
  Edit: 'UPDATE OBSERVATION',
} as const;

export const OBSERVATION_FORM_ERRORS = {
  ApproverNotesRequired: 'Approver notes are required when rejecting an observation.',
} as const;

export const OBSERVATION_FORM_PLACEHOLDERS = {
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
  Task: 'Select task',
} as const;

export const OBSERVATION_SUB_DIVISION_FILTER_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** Activate / deactivate tooltips on the list and grid. */
export const OBSERVATION_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;

export const OBSERVATION_NO_RESULTS = 'No results';

export const pageRangeLabel = (start: number, end: number, total: number): string =>
  `Showing ${start}–${end} of ${total}`;
