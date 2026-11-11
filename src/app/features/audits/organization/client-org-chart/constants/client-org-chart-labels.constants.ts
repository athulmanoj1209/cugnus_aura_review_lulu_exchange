/* ── Display labels, tag severities & filter options for the org chart ────
 * Text is kept exactly as it was inline in the component — some labels
 * differ slightly from other modules on purpose (e.g. 'SubDivisional',
 * 'Rep. Office'), so they are kept here rather than imported.
 */

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/* ── Filters ──────────────────────────────────────────────────────────── */

export const ORG_CHART_COUNTRY_OPTIONS: { label: string; value: string | null }[] = [
  { label: 'All Regions', value: null },
  { label: 'United Arab Emirates', value: 'ae' },
  { label: 'Saudi Arabia', value: 'sa' },
  { label: 'Bahrain', value: 'bh' },
  { label: 'Kuwait', value: 'kw' },
];

/* ── Node labels ──────────────────────────────────────────────────────── */

export const ORG_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

export const ORG_SCOPE_TYPE_LABELS: Record<string, string> = {
  subDivisional: 'SubDivisional',
  functional: 'Functional',
  independent: 'Independent',
};

export const ORG_AUDIT_FREQUENCY_LABELS: Record<string, string> = {
  quarterly: 'Quarterly',
  annually: 'Annually',
  monthly: 'Monthly',
};

export const ORG_MODE_OF_AUDIT_LABELS: Record<string, string> = {
  full: 'Full',
  limited: 'Limited',
  thematic: 'Thematic',
  'follow-up': 'Follow-up',
  continuous: 'Continuous',
};

export const ORG_DIVISION_TYPE_LABELS: Record<string, string> = {
  head_office: 'Head Office',
  division: 'Division',
  branch: 'Branch',
  department: 'Department',
  representative_office: 'Rep. Office',
  warehouse: 'Warehouse',
  factory: 'Factory',
  project_office: 'Project Office',
  subsidiary: 'Subsidiary',
};

export const ORG_AUDIT_STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  planned: 'Planned',
  not_planned: 'Not Planned',
};

export const ORG_AUDIT_STATUS_SEVERITY: Record<string, TagSeverity> = {
  completed: 'success',
  in_progress: 'info',
  planned: 'warn',
  not_planned: 'secondary',
};

export const ORG_RISK_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  monitored: 'Monitored',
};

export const ORG_EMIRATE_STATE_LABELS: Record<string, string> = {
  dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah',
  fujairah: 'Fujairah', rak: 'Ras Al Khaimah', ajman: 'Ajman',
  ummalquwain: 'Umm Al Quwain', khorfakkan: 'Khorfakkan',
  riyadh: 'Riyadh Province', makkah: 'Makkah Province',
  eastern: 'Eastern Province', tabuk: 'Tabuk Province', madinah: 'Al Madinah Province',
  capital: 'Capital', southern: 'Southern', muharraq: 'Muharraq',
  central: 'Central', northern: 'Northern',
  hawalli: 'Hawalli', jahra: 'Jahra', ahmadi: 'Ahmadi',
  farwaniya: 'Farwaniya', mubarak: 'Mubarak Al-Kabeer',
};

/* ── Company profile drawer (built from the company record) ───────────── */

/** Keys are upper-case here — company records store the incorporation country as 'AE', 'SA'… */
export const ORG_COMPANY_COUNTRY_LABELS: Record<string, string> = {
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  BH: 'Bahrain',
  KW: 'Kuwait',
};

export const ORG_COMPANY_REGION_LABELS: Record<string, string> = {
  dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah', fujairah: 'Fujairah',
  rak: 'Ras Al Khaimah', ajman: 'Ajman', riyadh: 'Riyadh Province', makkah: 'Makkah Province',
  eastern: 'Eastern Province', tabuk: 'Tabuk Province', madinah: 'Al Madinah Province',
  capital: 'Capital', central: 'Central', hawalli: 'Hawalli',
};

export const ORG_COMPANY_OWNERSHIP_LABELS: Record<string, string> = {
  private: 'Private',
  public: 'Public',
  government: 'Government',
  family: 'Family-Owned',
  'joint-venture': 'Joint Venture',
  foreign: 'Foreign-Owned',
};

export const ORG_TOGGLE_ACTIONS = { Activate: 'Activate', Deactivate: 'Deactivate' } as const;
export type OrgToggleAction = typeof ORG_TOGGLE_ACTIONS[keyof typeof ORG_TOGGLE_ACTIONS];
export const ORG_DIVISION_SCOPES_LABEL = 'Division Scopes';
export const ORG_COMPANY_NODE_SUBTITLE = 'Organization';
export const orgEmployeesSubtitle = (count: number | null | undefined): string => `${count ?? 0} employees`;
