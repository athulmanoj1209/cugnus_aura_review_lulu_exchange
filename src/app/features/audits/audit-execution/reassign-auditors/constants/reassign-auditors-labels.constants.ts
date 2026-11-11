/* ── Dropdown options & display labels for reassignment values ────────── */

import { AssignmentRoles, ROLE_FILTER_ALL, type AssignmentRole, type RoleFilter } from './reassign-auditors.constants';

export const ASSIGNMENT_ROLE_LABELS: Record<AssignmentRole, string> = {
  [AssignmentRoles.Preparer]: 'Preparer',
  [AssignmentRoles.Reviewer]: 'Reviewer',
};

export const ROLE_FILTER_OPTIONS: { label: string; value: RoleFilter }[] = [
  { label: 'All roles', value: ROLE_FILTER_ALL },
  { label: ASSIGNMENT_ROLE_LABELS[AssignmentRoles.Preparer], value: AssignmentRoles.Preparer },
  { label: ASSIGNMENT_ROLE_LABELS[AssignmentRoles.Reviewer], value: AssignmentRoles.Reviewer },
];
