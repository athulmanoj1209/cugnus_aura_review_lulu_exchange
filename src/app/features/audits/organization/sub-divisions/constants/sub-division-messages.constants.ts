/* ── User-facing text for the sub-divisions module ─────────────────────── */

export const SUB_DIVISION_ERROR_MESSAGES = {
  Required: 'This field is required.',
  Email: 'Please enter a valid email address.',
  Invalid: 'Invalid value.',
} as const;

export const SUB_DIVISION_TOAST_MESSAGES = {
  Added: 'New sub-division has been successfully added.',
  Updated: 'Sub-Division has been successfully updated.',
  Approved: 'Sub-Division has been approved.',
  ApprovedTitle: 'Sub-Division Approved',
  Rejected: 'Sub-Division has been rejected.',
  RejectedTitle: 'Sub-Division Rejected',
} as const;

export const SUB_DIVISION_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this sub-division?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this sub-division?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

