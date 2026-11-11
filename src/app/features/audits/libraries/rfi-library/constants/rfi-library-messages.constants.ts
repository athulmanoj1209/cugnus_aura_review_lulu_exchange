/* ── User-facing text for the RFI library module ──────────────────────── */

export const RFI_LIBRARY_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this RFI library item?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this RFI library item?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

export const RFI_LIBRARY_TOAST_MESSAGES = {
  Approved: 'The RFI library item has been approved successfully.',
  ApprovedTitle: 'RFI Approved',
  Rejected: 'The RFI library item has been rejected and the submitter notified.',
  RejectedTitle: 'RFI Rejected',
  Added: 'New RFI library item has been successfully added.',
  Updated: ' RFI library item has been successfully updated.',
} as const;
