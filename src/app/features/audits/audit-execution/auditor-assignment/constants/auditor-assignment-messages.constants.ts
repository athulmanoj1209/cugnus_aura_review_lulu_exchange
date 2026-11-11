/* ── User-facing text for the auditor-assignment module ───────────────── */

import { AssignmentTypes, type AssignmentType } from './auditor-assignment.constants';

export const AUDITOR_ASSIGNMENT_TOAST_MESSAGES = {
  Assigned: 'Auditors assigned successfully.',
} as const;

export const AUDITOR_ASSIGNMENT_CONFIRM_DIALOG = {
  title: 'Confirm Assignment',
  message: 'Are you sure you want to save these assignments? The submitter will be notified.',
  confirmLabel: 'Yes, Proceed',
  action: 'approve',
} as const;

export const requiredFieldMessage = (label: string): string => `${label} is required`;

export const AUDITOR_ASSIGNMENT_FORM_ERRORS = {
  DateRange: 'End must be after the start date & time',
} as const;

/** Placeholder of the auditor picker on a new row, by assignment type. */
export const AUDITOR_PICKER_PLACEHOLDERS: Record<AssignmentType, string> = {
  [AssignmentTypes.Preparer]: 'Choose preparer...',
  [AssignmentTypes.Reviewer]: 'Choose reviewer...',
};

export const ESTIMATION_PICKER_PLACEHOLDER = 'dd/mm/yyyy hh:mm AM';

/* ── Generated job labels ─────────────────────────────────────────────── */

export const monthlyJobLabel = (scopeName: string, month: string): string => `${scopeName} – ${month} Review`;

export const quarterlyJobLabel = (scopeName: string, quarter: number): string => `${scopeName} – Q${quarter} Review`;

export const annualJobLabel = (scopeName: string): string => `${scopeName} – Annual Audit`;
