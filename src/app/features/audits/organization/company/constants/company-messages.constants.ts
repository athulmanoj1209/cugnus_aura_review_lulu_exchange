/* ── User-facing text for the company module ──────────────────────────── */

export const COMPANY_TOAST_MESSAGES = {
  Added: 'New company has been successfully added.',
  Updated: 'Company details have been successfully updated.',
  Approved: 'Company details have been successfully approved.',
  ApprovedTitle: 'Company Request Approved',
  Rejected: 'Company details have been rejected.',
  RejectedTitle: 'Company Request Rejected',
} as const;

export const COMPANY_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this company?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this company?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

export const COMPANY_DRAWER_TITLES = {
  Review: 'Review Company',
  Edit: 'Edit Company',
  Add: 'Add Company',
} as const;

/** Role shown under the primary contact on the company profile. */
export const COMPANY_PRIMARY_CONTACT_ROLE = 'Primary Contact';

export const COMPANY_PROFILE_LOAD_ERROR = 'Failed to load company profile';

export const licenseExpiredLabel = (days: number): string => `Expired ${days} days ago`;
export const licenseExpiresInLabel = (days: number): string => `Expires in ${days} days`;
