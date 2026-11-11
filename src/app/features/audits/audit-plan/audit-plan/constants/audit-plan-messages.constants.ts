/* ── User-facing text for the audit-plan module ───────────────────────── */

import { DAYS_PER_MONTH, Frequencies, type Frequency } from './audit-plan.constants';

export const AUDIT_PLAN_TOAST_MESSAGES = {
  ValidationError: 'Please fix the highlighted fields.',
  ValidationErrorTitle: 'Validation Error',
  Created: 'New audit plan has been successfully added.',
  Updated: 'Audit plan has been successfully updated.',
} as const;

export const auditPlanActiveToggledMessage = (activate: boolean): string =>
  `Audit plan has been successfully ${activate ? 'activated' : 'deactivated'}.`;

export const auditPlanActiveConfirmDialog = (activate: boolean, planTitle: string) => ({
  title: activate ? 'Confirm Activate' : 'Confirm Deactivate',
  message: `Are you sure you want to ${activate ? 'activate' : 'deactivate'} "${planTitle}"?`,
  confirmLabel: activate ? 'Yes, Activate' : 'Yes, Deactivate',
});

/** Activate / deactivate tooltips & aria-labels on the list and grid. */
export const AUDIT_PLAN_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;

/** Create / Edit Audit Plan drawer copy, by mode. */
export const AUDIT_PLAN_FORM_HEADERS = {
  Create: { Title: 'Create New Audit Plan', Subtitle: 'Fill in the details to create a new audit plan.', Submit: 'Create Plan' },
  Edit: { Title: 'Edit Audit Plan', Subtitle: 'Update the audit plan details below.', Submit: 'Save Changes' },
} as const;

export const AUDIT_PLAN_FORM_ERRORS = {
  CompanyRequired: 'Company is required.',
  DivisionRequired: 'Division is required.',
  PlanNameRequired: 'Plan name is required.',
  FromRequired: 'From date is required.',
  FromPastMonth: 'From month cannot be in the past.',
  ToRequired: 'To date is required.',
  ToBeforeFrom: 'To month must be on or after From month.',
  NotOneYear: 'Time period must be exactly one year (12 months).',
} as const;

export const maxCharactersMessage = (max: number): string => `Maximum ${max} characters.`;

export const AUDIT_PLAN_FORM_PLACEHOLDERS = {
  Division: 'Division',
  CompanyFirst: 'Select a company first',
  DivisionFirst: 'Select a division first',
  SubDivisionOptional: 'Sub-Division (optional)',
} as const;

export const AUDIT_PLAN_SUB_DIVISION_PLACEHOLDERS = {
  All: 'All sub-divisions',
  None: 'No sub-divisions for this division',
} as const;

/** Shown in place of a sub-division name for a division-level lane. */
export const DIVISION_LEVEL_LABEL = 'Division-level';

/** Shown when a value (e.g. a date or sub-division) is missing. */
export const AUDIT_PLAN_EMPTY_VALUE = '—';

/** Fallback names for seed records missing one. */
export const AUDIT_PLAN_FALLBACK_NAMES = {
  Auditor: 'Unassigned',
  SubDivision: 'Sub-Division',
} as const;

/* ── List page ────────────────────────────────────────────────────────── */

export const filterChipLabel = (prefix: string, count: number): string => `${prefix}: ${count}`;

export const AUDIT_PLAN_NO_RESULTS = 'No results';

export const pageRangeLabel = (start: number, end: number, total: number): string =>
  `Showing ${start}–${end} of ${total}`;

/** Plan name used when a plan has no scopes to name it after. */
export const orgDivisionLabel = (organization: string, division: string): string =>
  `${organization} — ${division}`;

/* ── Audit Plan page ──────────────────────────────────────────────────── */

export const AUDIT_PLAN_PLATFORM_LABEL = 'Audit Platform';

export const auditPlanHeaderLabel = (companyName: string): string =>
  companyName ? `${companyName} · ${AUDIT_PLAN_PLATFORM_LABEL}` : AUDIT_PLAN_PLATFORM_LABEL;

/** Sub-division filter option label for a division-level lane. */
export const divisionLaneOptionLabel = (name: string): string => `${name} (Division)`;

/* ── Plan-view drawer ─────────────────────────────────────────────────── */

export const planDurationLabel = (days: number): string => {
  if (days < 1) return '< 1 day';
  if (days === 1) return '1 day';
  if (days < DAYS_PER_MONTH) return `${days} days`;
  const m = Math.round(days / DAYS_PER_MONTH);
  return m === 1 ? '1 month' : `${m} months`;
};

/* ── Tooltips & run labels ────────────────────────────────────────────── */

export const NOT_SCHEDULED_SUFFIX = ' — not scheduled';

export const notScheduledTooltip = (month: string): string => `${month}${NOT_SCHEDULED_SUFFIX}`;

/** Short run label: 'Wk' for weekly scopes, 'Run' otherwise. */
export const runShortLabel = (freq: Frequency): string => (freq === Frequencies.Weekly ? 'Wk' : 'Run');

/** Long run label: 'Week' for weekly scopes, 'Run' otherwise. */
export const runLongLabel = (freq: Frequency): string => (freq === Frequencies.Weekly ? 'Week' : 'Run');

/** Calendar chip run badge: 'W' for weekly scopes, 'R' otherwise. */
export const runBadgeLabel = (freq: Frequency): string => (freq === Frequencies.Weekly ? 'W' : 'R');

/** Scope-detail tooltip body when a run has no jobs. */
export const NO_JOBS_ASSIGNED_HTML = '<i>No jobs assigned</i>';

/** Displayed job reference: `<scope code>-<JOB ID>`. */
export const jobRef = (scopeCode: string, jobId: string): string => `${scopeCode}-${jobId.toUpperCase()}`;

/** Month calendar: "Show less" / "+N more" toggle. */
export const CALENDAR_SHOW_LESS = 'Show less';
export const calendarMoreLabel = (count: number): string => `+${count} more`;
