/* ── User-facing text for the recommendation module ───────────────────── */

export const RECOMMENDATION_TOAST_MESSAGES = {
  Approved: 'The recommendation has been approved successfully.',
  ApprovedTitle: 'Recommendation Approved',
  Rejected: 'The recommendation has been rejected and the submitter notified.',
  RejectedTitle: 'Recommendation Rejected',
  Created: 'New recommendation has been successfully added.',
  CreatedTitle: 'Recommendation Created',
  Updated: 'Recommendation details have been successfully updated.',
  UpdatedTitle: 'Recommendation Updated',
} as const;

export const RECOMMENDATION_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this recommendation? This action cannot be undone.',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this recommendation? The submitter will be notified.',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** Add / Edit / Review Recommendation drawer header copy, by mode. */
export const RECOMMENDATION_DRAWER_HEADERS = {
  Create: { Title: 'Add Recommendation', Subtitle: 'Define a remediation action for an audit observation' },
  Edit: { Title: 'Edit Recommendation', Subtitle: 'Update recommendation details' },
  Approve: { Title: 'Review Recommendation', Subtitle: 'Edit recommendation details, add your notes and approve or reject' },
} as const;

export const RECOMMENDATION_SUBMIT_LABELS = {
  Create: 'ADD RECOMMENDATION',
  Edit: 'Save Changes',
} as const;

export const RECOMMENDATION_FORM_ERRORS = {
  ApproverNotesRequired: 'Approver notes are required when rejecting a recommendation.',
} as const;

export const RECOMMENDATION_FORM_PLACEHOLDERS = {
  Division: 'Select division',
  CompanyFirst: 'Select a company first',
  SubDivision: 'Select sub-division',
  DivisionFirst: 'Select a division first',
  NoSubDivisions: 'No sub-divisions for this division',
} as const;

export const RECOMMENDATION_SUB_DIVISION_FILTER_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** Activate / deactivate tooltips on the list and grid. */
export const RECOMMENDATION_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;

/* ── Profile drawer due-date wording ──────────────────────────────────── */

export const RECOMMENDATION_DUE_LABELS = {
  Overdue: 'Overdue',
  PastDue: 'Past Due',
  DaysRemaining: 'Days Remaining',
} as const;

export const daysLabel = (days: number): string => `${days}d`;

export const overdueByLabel = (days: number): string => `Overdue by ${days}d`;
