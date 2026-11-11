/* ── Display labels, tag severities & form options for sub-division values ─
 * Keys are the stored values from sub-division.constants.ts. Text is kept
 * exactly as it was inline in the components.
 */

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/* ── Form dropdown options (manage/sub-division.component) ───────────── */

export const SUB_DIVISION_FORM_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const SUB_DIVISION_RISK_RATING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

export const SUB_DIVISION_RISK_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Open', value: 'open' },
  { label: 'Monitored', value: 'monitored' },
  { label: 'Closed', value: 'closed' },
];

/* ── Status ───────────────────────────────────────────────────────────── */

export const SUB_DIVISION_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
  pending: 'Pending',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const SUB_DIVISION_STATUS_SEVERITY: Record<string, TagSeverity> = {
  active: 'success',
  pending: 'warn',
  pending_approval: 'warn',
  approved: 'success',
  rejected: 'danger',
  inactive: 'secondary',
  archived: 'secondary',
};

/** Approval-workflow status labels — used on the profile drawer. */
export const SUB_DIVISION_AUDIT_STATUS_LABELS: Record<string, string> = {
  archived: 'Archived',
  pending: 'Pending',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const SUB_DIVISION_AUDIT_STATUS_SEVERITY: Record<string, TagSeverity> = {
  archived: 'secondary',
  pending: 'info',
  pending_approval: 'warn',
  approved: 'success',
  rejected: 'danger',
};

/* ── Risk ─────────────────────────────────────────────────────────────── */

export const SUB_DIVISION_RISK_RATING_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const SUB_DIVISION_RISK_RATING_SEVERITY: Record<string, TagSeverity> = {
  low: 'success',
  medium: 'warn',
  high: 'danger',
};

export const SUB_DIVISION_RISK_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  monitored: 'Monitored',
};

export const SUB_DIVISION_RISK_STATUS_SEVERITY: Record<string, TagSeverity> = {
  open: 'danger',
  monitored: 'warn',
  closed: 'success',
};

/* ── Department type (when Sub-Division Type is Department) ───────────── */

/** Includes 'compliance' / 'consumer-protection', which exist in seed data but not in the dropdown. */
export const SUB_DIVISION_DEPARTMENT_TYPE_LABELS: Record<string, string> = {
  'finance': 'Finance',
  'human-resources': 'Human Resources',
  'information-technology': 'Information Technology',
  'operations': 'Operations',
  'legal-compliance': 'Legal & Compliance',
  'internal-audit': 'Internal Audit',
  'risk-management': 'Risk Management',
  'marketing-communications': 'Marketing & Communications',
  'procurement-supply-chain': 'Procurement & Supply Chain',
  'customer-service': 'Customer Service',
  'executive-management': 'Executive Management',
  'administration': 'Administration',
  'compliance': 'Compliance',
  'consumer-protection': 'Consumer Protection',
};

/* ── Scopes shown on the profile drawer ───────────────────────────────── */

export const SUB_DIVISION_SCOPE_TYPE_LABELS: Record<string, string> = {
  subDivisional: 'Sub-Divisional',
  functional: 'Functional',
  independent: 'Independent',
};

export const SUB_DIVISION_AUDIT_FREQUENCY_LABELS: Record<string, string> = {
  quarterly: 'Quarterly',
  annually: 'Annually',
  monthly: 'Monthly',
};

export const SUB_DIVISION_AUDIT_FREQUENCY_SEVERITY: Record<string, TagSeverity> = {
  monthly: 'success',
  quarterly: 'info',
  annually: 'warn',
};

export const SUB_DIVISION_DRAWER_TITLES = { add: 'Add New Sub-Division', edit: 'Edit Sub-Division' } as const;
export const SUB_DIVISION_DRAWER_SUBTITLES = { add: 'Fill in the details to create a new sub-division', edit: 'Update the sub-division information below' } as const;
export const SUB_DIVISION_SUBMIT_LABELS = { add: 'Submit', edit: 'Save Changes' } as const;
export const SUB_DIVISION_CARD_STATUS_FALLBACK = 'Pending';
