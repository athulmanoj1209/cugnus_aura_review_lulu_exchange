/* ── User-facing text for the findings module ─────────────────────────── */

export const FINDING_TOAST_MESSAGES = {
  Created: 'New finding has been successfully added.',
  CreatedTitle: 'Finding Created',
  Updated: 'Finding details have been successfully updated.',
  UpdatedTitle: 'Finding Updated',
} as const;

/** Add / Edit Finding drawer copy, by mode. */
export const FINDING_DRAWER_HEADERS = {
  Create: { Title: 'Add New Finding', Subtitle: 'Provision platform access for a new finding', Submit: 'ADD FINDING' },
  Edit: { Title: 'Edit Finding', Subtitle: 'Update finding details', Submit: 'Save Changes' },
} as const;

export const FINDING_FORM_PLACEHOLDERS = {
  Division: 'Select division',
  CompanyFirst: 'Select a company first',
  Subdivision: 'Select subdivision',
  DivisionFirst: 'Select a division first',
  NoSubdivisions: 'No subdivisions for this division',
  Scope: 'Select scope',
  SubdivisionFirst: 'Select a subdivision first',
  Subscope: 'Select subscope',
  ScopeFirst: 'Select a scope first',
  NoSubscopes: 'No sub-scopes for this scope',
  Task: 'Select task',
} as const;

export const FINDING_SUB_DIVISION_FILTER_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** Activate / deactivate tooltips & aria-labels on the list and grid. */
export const FINDING_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
  ActivateAria: 'Activate finding',
  DeactivateAria: 'Deactivate finding',
} as const;

/** Shown when a value (e.g. scope, owner, severity) is missing. */
export const FINDING_EMPTY_VALUE = '—';

/** Fallback company / division name for findings without one. */
export const FINDING_UNASSIGNED_LABEL = 'Unassigned';

export const filterChipLabel = (prefix: string, count: number): string => `${prefix}: ${count}`;

export const previousOccurrenceTooltip = (id: string): string => `Previous: ${id}`;
export const REPEATED_FINDING_TOOLTIP = 'Repeated finding';

/* ── Overdue side card ────────────────────────────────────────────────── */

export const NO_OVERDUE_FINDINGS = 'No overdue findings';

export const dueOnLabel = (date: string): string => `Due ${date}`;

export const dueRangeLabel = (from: string, to: string): string => `Due ${from} – ${to}`;
