/* ── Display labels & tag severities for division values ─────────────────
 * Keys are the stored values from division.constants.ts. Text is kept exactly
 * as it was inline in the components (e.g. the profile uses the short
 * 'Rep. Office' / 'UAE' forms, the listing uses the full ones).
 */

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

export const DIVISION_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

/** Full labels — used on the listing page. */
export const DIVISION_TYPE_LABELS: Record<string, string> = {
  head_office: 'Head Office',
  branch: 'Branch',
  department: 'Department',
  representative_office: 'Representative Office',
  warehouse: 'Warehouse',
  factory: 'Factory',
  project_office: 'Project Office',
  subsidiary: 'Subsidiary',
};

/** Short labels — used on the profile drawer. */
export const DIVISION_TYPE_SHORT_LABELS: Record<string, string> = {
  ...DIVISION_TYPE_LABELS,
  representative_office: 'Rep. Office',
};

export const DIVISION_COUNTRY_SHORT_LABELS: Record<string, string> = {
  ae: 'UAE',
  sa: 'Saudi Arabia',
  bh: 'Bahrain',
  kw: 'Kuwait',
};

export const DIVISION_EMIRATE_LABELS: Record<string, string> = {
  dubai: 'Dubai', abudhabi: 'Abu Dhabi', sharjah: 'Sharjah', fujairah: 'Fujairah',
  rak: 'Ras Al Khaimah', ajman: 'Ajman', ummalquwain: 'Umm Al Quwain', khorfakkan: 'Khorfakkan',
  riyadh: 'Riyadh Province', makkah: 'Makkah Province', eastern: 'Eastern Province',
  tabuk: 'Tabuk Province', madinah: 'Al Madinah Province',
  capital: 'Capital', southern: 'Southern', muharraq: 'Muharraq',
  central: 'Central', northern: 'Northern',
  hawalli: 'Hawalli', jahra: 'Jahra', ahmadi: 'Ahmadi', farwaniya: 'Farwaniya',
  mubarak: 'Mubarak Al-Kabeer',
};

export const DIVISION_RISK_RATING_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const DIVISION_RISK_RATING_SEVERITY: Record<string, TagSeverity> = {
  low: 'success',
  medium: 'warn',
  high: 'danger',
};

export const DIVISION_RISK_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closed: 'Closed',
  monitored: 'Monitored',
};

export const DIVISION_AUDIT_STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  planned: 'Planned',
  not_planned: 'Not Planned',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const DIVISION_AUDIT_STATUS_SEVERITY: Record<string, TagSeverity> = {
  completed: 'success',
  in_progress: 'info',
  planned: 'warn',
  not_planned: 'secondary',
  pending_review: 'warn',
  approved: 'success',
  rejected: 'danger',
};

export const DIVISION_SECTOR_LABELS: Record<string, string> = {
  professional_services: 'Professional Services',
  financial_services: 'Financial Services',
  retail: 'Retail',
  manufacturing: 'Manufacturing',
  technology: 'Technology',
  healthcare: 'Healthcare',
};

export const DIVISION_DRAWER_TITLES = { view: 'View Division Details', edit: 'Update Company Division', add: 'Add Company Division' } as const;
export const DIVISION_DRAWER_SUBTITLES = { view: 'Read-only view of all division information', edit: 'Edit and update division details below', add: 'Fill in the details below to create a new division' } as const;
export const subDivisionFallbackName = (index: number): string => `Sub-Division ${index + 1}`;
