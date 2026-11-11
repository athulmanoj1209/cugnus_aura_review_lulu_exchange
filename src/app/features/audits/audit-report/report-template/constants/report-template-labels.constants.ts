/* ── Display labels, tag severities & form options for report templates ──
 * Text is kept exactly as it was inline in the components.
 */

/** Placeholder shown when a value is missing. */
export const REPORT_EMPTY_LABEL = '—';

export const REPORT_TEMPLATE_STATUS_LABELS = {
  active: $localize`:@@common.active:Active`,
  inactive: $localize`:@@common.inactive:Inactive`,
} as const;

export const REPORT_TEMPLATE_STATUS_SEVERITY = {
  active: 'success',
  inactive: 'secondary',
} as const;

/**
 * Industry code → label on the listing / profile drawers (also used by the
 * final-report profile drawer).
 */
export const REPORT_INDUSTRY_LABELS: Record<string, string> = {
  banking: $localize`:@@audit.reportTemplate.industryBankingFinance:Banking & Finance`,
  real_estate: $localize`:@@audit.reportTemplate.industryRealEstate:Real Estate`,
  retail: $localize`:@@audit.reportTemplate.industryRetailTrading:Retail & Trading`,
  manufacturing: $localize`:@@audit.reportTemplate.industryManufacturing:Manufacturing`,
  technology: $localize`:@@audit.reportTemplate.industryTechnology:Technology`,
  healthcare: $localize`:@@audit.reportTemplate.industryHealthcare:Healthcare`,
  construction: $localize`:@@audit.reportTemplate.industryConstruction:Construction`,
  professional_services: $localize`:@@audit.reportTemplate.industryProfessionalServices:Professional Services`,
};

/**
 * Company id → label / colour on the template and final-report profile
 * drawers. These keys are legacy demo ids that no current seed company uses,
 * so in practice the drawers fall back to the raw id / default colour.
 */
export const REPORT_PROFILE_COMPANY_LABELS: Record<string, string> = {
  'crowe-uae': 'Crowe UAE',
  'crowe-ksa': 'Crowe KSA',
  'crowe-bahrain': 'Crowe Bahrain',
  'crowe-kuwait': 'Crowe Kuwait',
};

export const REPORT_PROFILE_COMPANY_COLORS: Record<string, string> = {
  'crowe-uae': '#1a6fc4',
  'crowe-ksa': '#2d8a4e',
  'crowe-bahrain': '#c47a1a',
  'crowe-kuwait': '#8a1ac4',
};

/* ── Add/Edit dialog ──────────────────────────────────────────────────── */

/**
 * Industry Type dropdown. Kept local to this dialog rather than pulled from
 * the Industry Type master list (admin-managed CRUD data for a different
 * screen) — the backend just wants a plain string.
 */
export const REPORT_TEMPLATE_INDUSTRY_TYPE_OPTIONS: string[] = [
  'Banking',
  'Financial Services',
  'Professional Services',
  'Insurance',
  'Healthcare',
  'Manufacturing',
  'Retail & E-Commerce',
  'Information Technology',
  'Real Estate',
  'Energy & Utilities',
  'Telecommunications',
  'Construction',
  'Trade',
  'Hospitality',
  'Education',
  'Government',
  'Other',
];

/**
 * The seed templates store industryType as a snake_case code (e.g.
 * 'professional_services'), not one of the option labels above — this maps
 * the code onto its option so editing an existing template preselects it.
 */
export const REPORT_TEMPLATE_INDUSTRY_CODE_TO_OPTION: Record<string, string> = {
  banking: 'Banking',
  professional_services: 'Professional Services',
  insurance: 'Insurance',
  healthcare: 'Healthcare',
  manufacturing: 'Manufacturing',
  retail: 'Retail & E-Commerce',
  technology: 'Information Technology',
  real_estate: 'Real Estate',
  energy: 'Energy & Utilities',
  telecommunications: 'Telecommunications',
  construction: 'Construction',
  trade: 'Trade',
  hospitality: 'Hospitality',
  education: 'Education',
  government: 'Government',
};
