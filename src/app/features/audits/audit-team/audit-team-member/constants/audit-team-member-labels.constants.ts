/* ── Dropdown options & display labels for audit team members ───────────── */

import type { MemberFilterKey, MemberSortOption } from './audit-team-member.constants';

export interface MemberOption {
  label: string;
  value: string;
}

/** Designation dropdown on the Add/Edit member form. */
export const MEMBER_DESIGNATION_OPTIONS: MemberOption[] = [
  { label: 'CAE', value: 'CAE' },
  { label: $localize`:@@audit.auditTeam.auditManager:Audit Manager`, value: 'audit-manager' },
  { label: $localize`:@@audit.auditTeam.seniorAuditor:Senior Auditor`, value: 'senior-auditor' },
  { label: $localize`:@@audit.auditTeam.staffAuditor:Staff Auditor`, value: 'staff-auditor' },
  { label: $localize`:@@audit.auditTeam.externalAuditor:External Auditor`, value: 'external-auditor' },
];

/** Sort dropdown on the members listing page. */
export const MEMBER_SORT_OPTIONS: { label: string; value: MemberSortOption }[] = [
  { label: $localize`:@@audit.auditTeam.sortNameAZ:Name (A–Z)`, value: 'name_asc' },
  { label: $localize`:@@audit.auditTeam.sortNameZA:Name (Z–A)`, value: 'name_desc' },
  { label: $localize`:@@audit.auditTeam.sortRecentlyAdded:Recently Added`, value: 'recent' },
  { label: $localize`:@@audit.auditTeam.sortExperienceHighLow:Experience (High→Low)`, value: 'experience' },
  { label: $localize`:@@audit.auditTeam.sortWorkloadHighLow:Workload (High→Low)`, value: 'workload' },
];

/** Designation code (audit-manager) → display label (Audit Manager). */
export const MEMBER_DESIGNATION_LABEL_BY_CODE: Record<string, string> = {
  'audit-partner':      'Audit Partner',
  'audit-manager':      'Audit Manager',
  'senior-auditor':     'Senior Auditor',
  'auditor':            'Auditor',
  'junior-auditor':     'Junior Auditor',
  'risk-officer':       'Risk Officer',
  'compliance-officer': 'Compliance Officer',
  'analyst':            'Analyst',
};

/** Display label (Audit Manager) → designation code (audit-manager). */
export const MEMBER_DESIGNATION_CODE_BY_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(MEMBER_DESIGNATION_LABEL_BY_CODE).map(([code, label]) => [label, code]),
);

/** Prefix of each active-filter chip on the members listing page. */
export const MEMBER_FILTER_CHIP_LABELS: Record<MemberFilterKey, string> = {
  companies: $localize`:@@common.company:Company`,
  divisions: $localize`:@@common.division:Division`,
  subDivisions: $localize`:@@common.subDivision:Sub-Division`,
  designations: $localize`:@@common.designation:Designation`,
};
