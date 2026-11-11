/* ── Display labels, tag severities & form options for scope values ──────
 * Text is kept exactly as it was inline in the components — some labels
 * differ between screens on purpose (e.g. 'SubDivisional' on the sub-scope
 * accordion vs 'Sub-Divisional' on the profile), so each keeps its own map.
 */

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/* ── Listing ──────────────────────────────────────────────────────────── */

export const SCOPE_STATUS_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'Not Started', value: 'Not Started' },
  { label: 'Planned', value: 'Planned' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

/** Status badge colour. Anything not listed (Not Started) uses SCOPE_WORKFLOW_STATUS_DEFAULT_SEVERITY. */
export const SCOPE_WORKFLOW_STATUS_SEVERITY: Record<string, TagSeverity> = {
  'Completed': 'success',
  'In Progress': 'info',
  'Overdue': 'danger',
  'Planned': 'secondary',
  'Pending Review': 'warn',
  'Approved': 'success',
  'Rejected': 'danger',
};
export const SCOPE_WORKFLOW_STATUS_DEFAULT_SEVERITY: TagSeverity = 'warn';

/** Risk rating → the capitalised form EnrichedScope.riskRating uses. */
export const SCOPE_RISK_RATING_DISPLAY: Record<string, 'Low' | 'Medium' | 'High'> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

/** Display risk levels that count as "high risk" for the dashboard "High-Risk / Not Started" filter. */
export const SCOPE_HIGH_RISK_DISPLAY_LEVELS: readonly string[] = ['High', 'Critical'];

/** Risk rating → priority text on the auditor "Assigned Scopes" tables (unknown → Medium). */
export const SCOPE_RISK_TO_PRIORITY: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
export const SCOPE_DEFAULT_PRIORITY = 'Medium';

/** Level badge on the listing cards / rows. */
export const SCOPE_LEVEL_LABELS: Record<string, string> = {
  scope: 'Scope',
  subscope: 'Sub Scope',
};

/** Level badge on the Scope Library dropdown (Add Scope form). */
export const SCOPE_LIBRARY_LEVEL_LABELS: Record<string, string> = {
  scope: 'Scope',
  subscope: 'Sub-scope',
};

/* ── Add/Edit scope form ──────────────────────────────────────────────── */

export const SCOPE_SOURCE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Create New Scope', value: 'fresh' },
  { label: 'From Scope Library', value: 'library' },
];

/** Type label on the sub-scope accordion headers. */
export const SCOPE_SUBSCOPE_TYPE_LABELS: Record<string, string> = {
  subDivisional: 'SubDivisional',
  functional: 'Functional',
  independent: 'Independent',
};

/* ── Profile drawer ───────────────────────────────────────────────────── */

export const SCOPE_TYPE_LABELS: Record<string, string> = {
  subDivisional: 'Sub-Divisional',
  departmental: 'Departmental',
  functional: 'Functional',
  independent: 'Independent',
};

export const SCOPE_AUDIT_FREQUENCY_LABELS: Record<string, string> = {
  quarterly: 'Quarterly',
  annually: 'Annually',
  monthly: 'Monthly',
};

export const SCOPE_MODE_OF_AUDIT_LABELS: Record<string, string> = {
  full: 'Full',
  limited: 'Limited',
  thematic: 'Thematic',
  'follow-up': 'Follow-up',
  continuous: 'Continuous',
};

export const SCOPE_SAMPLING_METHODOLOGY_LABELS: Record<string, string> = {
  'risk-based': 'Risk-Based',
  random: 'Random',
  judgmental: 'Judgmental',
  systematic: 'Systematic',
  stratified: 'Stratified',
};

export const SCOPE_RISK_RATING_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

/* ── Task form (com/scope-task) ───────────────────────────────────────── */

export const SCOPE_TASK_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Not Started', value: 'not-started' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
];
export const SCOPE_TASK_DEFAULT_STATUS_LABEL = 'Not Started';

export const SCOPE_TASK_TYPE_OPTIONS = [
  { label: 'Scope-related', value: 'scope', icon: 'pi-link' },
  { label: 'Independent', value: 'independent', icon: 'pi-flag' },
];

export const SCOPE_TASK_RFI_SOURCE_OPTIONS = [
  { label: 'New RFI', value: 'new', icon: 'pi-plus-circle' },
  { label: 'From RFI Library', value: 'library', icon: 'pi-book' },
];

export const SCOPE_TASK_CONTROL_RATING_OPTIONS = [
  { label: 'Strong', value: 'strong', icon: 'pi-shield' },
  { label: 'Moderate', value: 'moderate', icon: 'pi-minus-circle' },
  { label: 'Weak', value: 'weak', icon: 'pi-exclamation-triangle' },
];

export const SCOPE_TASK_RISK_PRIORITY_OPTIONS = [
  { label: 'Critical Risk', value: 'critical' },
  { label: 'High Risk', value: 'high' },
  { label: 'Medium Risk', value: 'medium' },
  { label: 'Low Risk', value: 'low' },
];

export const SCOPE_TASK_CHECKLIST_OPTIONS = [
  { label: 'Verify authorization controls', value: 'auth_controls' },
  { label: 'Review access logs', value: 'access_logs' },
  { label: 'Test password policies', value: 'password_policy' },
  { label: 'Check segregation of duties', value: 'seg_duties' },
  { label: 'Validate data retention', value: 'data_retention' },
  { label: 'Confirm backup procedures', value: 'backup_procedures' },
  { label: 'Assess incident response', value: 'incident_response' },
];

/** Mock RFI library entries — replace with the real RFI library when wired up. */
export const SCOPE_TASK_RFI_LIBRARY_OPTIONS = [
  { label: 'RFI-001 — Financial Records Q1', value: 'rfi_001' },
  { label: 'RFI-002 — IT Access Review', value: 'rfi_002' },
  { label: 'RFI-003 — Vendor Contracts', value: 'rfi_003' },
  { label: 'RFI-004 — HR Policy Compliance', value: 'rfi_004' },
];

/** Mock auditor list for the task form — note these ids match AUDITOR_PROFILES keys. */
export const SCOPE_TASK_AUDITOR_OPTIONS = [
  { label: 'Alice Johnson', value: 'alice' },
  { label: 'Bob Smith', value: 'bob' },
  { label: 'Carol White', value: 'carol' },
  { label: 'David Lee', value: 'david' },
];

export const SCOPE_DRAWER_TITLES = { review: 'Review Audit Scope', add: 'Add Audit Scope', edit: 'Edit Audit Scope', view: 'View Audit Scope' } as const;
export const SCOPE_DRAWER_ADD_SUBTITLE = 'Fill in the details to create a new audit scope';
export const scopeAuditorCountLabel = (count: number): string => `${count} Auditor${count !== 1 ? 's' : ''}`;
export const SCOPE_FILTER_CHIP_LABELS = { companies: 'Company', divisions: 'Division', subDivisions: 'Dept', auditors: 'Auditor', statuses: 'Status' } as const;
export const subScopeFallbackName = (index: number): string => 'Sub-Scope ' + (index + 1);
