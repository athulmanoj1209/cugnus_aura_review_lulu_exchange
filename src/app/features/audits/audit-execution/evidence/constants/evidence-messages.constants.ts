/* ── User-facing text for the evidence module ─────────────────────────── */

export const EVIDENCE_TOAST_MESSAGES = {
  Approved: 'The evidence has been approved successfully.',
  ApprovedTitle: 'Evidence Approved',
  Rejected: 'The evidence has been rejected.',
  RejectedTitle: 'Evidence Rejected',
  Updated: 'Evidence details have been successfully updated.',
  Added: 'New evidence has been successfully added.',
} as const;

export const EVIDENCE_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this evidence? This action cannot be undone.',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this evidence? The submitter will be notified.',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** Add / Edit / Review Evidence drawer header copy, by mode. */
export const EVIDENCE_DRAWER_HEADERS = {
  Create: { Title: 'Add Evidence', Subtitle: 'Attach supporting documents to a finding' },
  Edit: { Title: 'Edit Evidence', Subtitle: 'Update evidence details' },
  Approve: { Title: 'Review Evidence', Subtitle: 'Edit evidence details, add your notes and approve or reject' },
} as const;

export const EVIDENCE_SUBMIT_LABELS = {
  Create: 'ADD EVIDENCE',
  Edit: 'Save Changes',
} as const;

export const EVIDENCE_FORM_ERRORS = {
  ApproverNotesRequired: 'Approver notes are required when rejecting evidence.',
} as const;

export const EVIDENCE_SUB_DIVISION_PLACEHOLDERS = {
  All: 'All sub-divisions',
  Select: 'Select sub-division',
  None: 'No sub-divisions for this division',
} as const;

export const EVIDENCE_TASK_PLACEHOLDERS = {
  Select: 'Select task',
  ScopeFirst: 'Select a scope first',
} as const;

export const filterChipLabel = (prefix: string, count: number): string => `${prefix}: ${count}`;

export const taskFilterOptionLabel = (taskId: string, taskTitle: string): string => `${taskId} — ${taskTitle}`;
