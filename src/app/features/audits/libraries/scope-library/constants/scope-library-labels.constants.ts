/* ── Display labels, tag severities & form options for scope library values ─
 * Text is kept exactly as it was inline in the components.
 */

import type { Framework, RiskCategory, ScopeLevel } from '../models/scope-library-list.model';

export type ScopeLibraryTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

/** Risk category badge colour. Unknown categories use SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY. */
export const SCOPE_LIBRARY_RISK_CATEGORY_SEVERITY: Record<string, ScopeLibraryTagSeverity> = {
  'Access Management': 'info',
  'Change Management': 'contrast',
  'Vendor Risk': 'warn',
  'Financial Risk': 'success',
  'Operational Risk': 'info',
  'Compliance Risk': 'danger',
  'IT General Controls': 'secondary',
  'Data Privacy': 'warn',
  'Business Continuity': 'success',
  'Fraud Risk': 'danger',
};
export const SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY: ScopeLibraryTagSeverity = 'secondary';

export const SCOPE_LIBRARY_STATUS_SEVERITY: Record<string, 'success' | 'warn' | 'danger'> = {
  pending_review: 'warn',
  approved: 'success',
  rejected: 'danger',
};

export const SCOPE_LIBRARY_STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

/* ── Add/Edit drawer ──────────────────────────────────────────────────── */

export const SCOPE_LIBRARY_RISK_CATEGORY_OPTIONS: { label: string; value: RiskCategory }[] = [
  { label: 'Access Management', value: 'Access Management' },
  { label: 'Change Management', value: 'Change Management' },
  { label: 'Vendor Risk', value: 'Vendor Risk' },
  { label: 'Financial Risk', value: 'Financial Risk' },
  { label: 'Operational Risk', value: 'Operational Risk' },
  { label: 'Compliance Risk', value: 'Compliance Risk' },
  { label: 'IT General Controls', value: 'IT General Controls' },
  { label: 'Data Privacy', value: 'Data Privacy' },
  { label: 'Business Continuity', value: 'Business Continuity' },
  { label: 'Fraud Risk', value: 'Fraud Risk' },
];

export const SCOPE_LIBRARY_FRAMEWORK_OPTIONS: { label: string; value: Framework }[] = [
  { label: 'COBIT', value: 'COBIT' },
  { label: 'ISO 27001', value: 'ISO 27001' },
  { label: 'NIST', value: 'NIST' },
  { label: 'COSO', value: 'COSO' },
  { label: 'SOX', value: 'SOX' },
  { label: 'PCI DSS', value: 'PCI DSS' },
];

export const SCOPE_LIBRARY_LEVEL_OPTIONS: { label: string; value: ScopeLevel }[] = [
  { label: 'Scope', value: 'scope' },
  { label: 'Sub Scope', value: 'subscope' },
];

export const SCOPE_LIBRARY_DRAWER_TITLES = { add: 'Add Scope Library', edit: 'Edit Scope Library' } as const;
