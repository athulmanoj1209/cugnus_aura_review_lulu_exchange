/* ── User-facing text for the divisions module ─────────────────────────── */

export const DIVISION_INVALID_FIELD_MESSAGE = 'Invalid field.';

/** Validation messages for the division form, keyed by control → error key. */
export const DIVISION_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  company: { required: 'Company is required.' },
  divisionName: {
    required: 'Division name is required.',
    maxlength: 'Division name cannot exceed 150 characters.',
    divisionNameNotUnique: 'Division name already exists for this company.',
  },
  divisionCode: {
    required: 'Division code is required.',
    divisionCodeNotUnique: 'Division code already exists.',
  },
  divisionType: { required: 'Division type is required.' },
  departmentType: { required: 'Department type is required.' },
  status: { required: 'Status is required.' },
  hasSubDivision: { required: 'Please choose whether this division has sub-divisions.' },
  licenseNumber: {
    required: 'License number is required.',
    licenseNotUnique: 'License number already exists for this company.',
  },
  licenseAuthority: { required: 'License authority is required.' },
  country: { required: 'Country is required.' },
  emirateState: { required: 'Emirate / State is required.' },
  city: { required: 'City is required.' },
  addressLine1: { required: 'Address Line 1 is required.' },
  divisionManager: { required: 'Division manager is required.' },
  primaryContactPerson: { required: 'Primary contact person is required.' },
  contactEmail: {
    required: 'Contact email is required.',
    email: 'Please enter a valid email address.',
  },
  contactPhone: { required: 'Contact phone is required.' },
  riskRating: { required: 'Risk rating is required.' },
  riskStatus: { required: 'Risk status is required.' },
  auditStatus: { required: 'Audit status is required.' },
  sectorActivity: { required: 'Sector / Business activity is required.' },
  parentNode: { required: 'Parent node is required.' },
};

/** Validation messages for the nested sub-division rows of the division form. */
export const DIVISION_SUB_DIVISION_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  subDivisionName: { required: 'Sub-Division name is required.' },
  company: { required: 'Company is required.' },
  status: { required: 'Status is required.' },
  riskRating: { required: 'Risk rating is required.' },
  riskStatus: { required: 'Risk status is required.' },
  primaryContactPerson: { required: 'Primary contact person is required.' },
  contactEmail: {
    required: 'Contact email is required.',
    email: 'Please enter a valid email address.',
  },
  contactPhone: { required: 'Contact phone is required.' },
};

export const DIVISION_TOAST_MESSAGES = {
  Added: 'New division has been successfully added.',
  Updated: 'Division has been successfully updated.',
  Approved: 'Division has been successfully approved.',
  ApprovedTitle: 'Division Approved',
  Rejected: 'Division has been  rejected.',
  RejectedTitle: 'Division Rejected',
} as const;

export const DIVISION_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this division?',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this division?',
    confirmLabel: 'Yes, Reject',
  },
} as const;

