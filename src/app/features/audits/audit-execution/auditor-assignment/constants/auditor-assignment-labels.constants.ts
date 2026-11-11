/* ── Display labels for auditor-assignment values ─────────────────────── */

import { AssignmentFormControls, AssignmentTypes, type AssignmentType } from './auditor-assignment.constants';

/** Full month names used in generated monthly job labels. */
export const MONTH_FULL_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  [AssignmentTypes.Preparer]: 'Preparer',
  [AssignmentTypes.Reviewer]: 'Reviewer',
};

/** Field names used in "<field> is required" messages. */
export const ASSIGNMENT_FIELD_LABELS = {
  [AssignmentFormControls.Company]: 'Company',
  [AssignmentFormControls.Division]: 'Division',
  [AssignmentFormControls.Subdivision]: 'Subdivision',
  [AssignmentFormControls.Scope]: 'Audit Scope',
  [AssignmentFormControls.Job]: 'Job',
  [AssignmentFormControls.EstimatedStart]: 'Estimated start',
  [AssignmentFormControls.EstimatedEnd]: 'Estimated end',
} as const;
