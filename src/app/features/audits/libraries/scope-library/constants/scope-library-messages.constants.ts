/* ── User-facing text for the scope library module ────────────────────── */

export const SCOPE_LIBRARY_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this library item?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this library item?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** In-drawer p-toast messages (MessageService) after approve / reject. */
export const SCOPE_LIBRARY_APPROVAL_NOTICES = {
  ApprovedSummary: 'Scope Item Approved',
  Approved: 'The scope library item has been approved successfully.',
  RejectedSummary: 'Scope Item Rejected',
  Rejected: 'The scope library item has been rejected and the submitter notified.',
} as const;

export const SCOPE_LIBRARY_TOAST_MESSAGES = {
  Added: 'New scope library item has been successfully added.',
  Updated: 'Scope library item has been successfully updated.',
} as const;
