/* ── Dropdown options & display labels for the audit team chart ─────────── */

export const AUDIT_TEAM_REGION_OPTIONS: { label: string; value: string | null }[] = [
  { label: $localize`:@@audit.auditTeam.allRegions:All Regions`, value: null },
  { label: $localize`:@@audit.auditTeam.unitedArabEmirates:United Arab Emirates`, value: 'AE' },
  { label: $localize`:@@audit.auditTeam.saudiArabia:Saudi Arabia`, value: 'SA' },
  { label: $localize`:@@audit.auditTeam.qatar:Qatar`, value: 'QA' },
  { label: $localize`:@@audit.auditTeam.bahrain:Bahrain`, value: 'BH' },
];

/** Display title (Audit Manager) → member-form designation code (audit-manager). */
export const DESIGNATION_CODE_BY_TITLE: Record<string, string> = {
  'CAE':                'audit-partner',
  'Audit Partner':      'audit-partner',
  'Audit Manager':      'audit-manager',
  'Senior Auditor':     'senior-auditor',
  'Auditor':            'auditor',
  'Junior Auditor':     'junior-auditor',
  'Staff Auditor':      'auditor',
  'Risk Officer':       'risk-officer',
  'Compliance Officer': 'compliance-officer',
  'Analyst':            'analyst',
};

/** Member-form designation code (audit-manager) → display title (Audit Manager). */
export const DESIGNATION_LABEL_BY_CODE: Record<string, string> = {
  'audit-partner': $localize`:@@audit.auditTeam.auditPartner:Audit Partner`,
  'audit-manager': $localize`:@@audit.auditTeam.auditManager:Audit Manager`,
  'senior-auditor': $localize`:@@audit.auditTeam.seniorAuditor:Senior Auditor`,
  'auditor': $localize`:@@audit.auditTeam.auditor:Auditor`,
  'junior-auditor': $localize`:@@audit.auditTeam.juniorAuditor:Junior Auditor`,
  'risk-officer': $localize`:@@audit.auditTeam.riskOfficer:Risk Officer`,
  'compliance-officer': $localize`:@@audit.auditTeam.complianceOfficer:Compliance Officer`,
  'analyst': $localize`:@@audit.auditTeam.analyst:Analyst`,
};

/** Labels for the block / unblock confirmation button, keyed by action. */
export const AUDIT_TEAM_BLOCK_CONFIRM_LABELS: Record<string, string> = {
  Activate: $localize`:@@audit.auditTeam.yesActivate:Yes, activate`,
  Deactivate: $localize`:@@audit.auditTeam.yesDeactivate:Yes, deactivate`,
};
