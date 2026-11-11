/* ── Dropdown options, display labels & tag severities for company values ─
 * The label maps used by the listing/profile are derived from the dropdown
 * options below, so a code always resolves to the same text the user picked
 * in the Add/Edit Company form.
 */

import type { CompanySortOption } from './company.constants';

export type CompanyTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

export interface CompanyOption {
  label: string;
  value: string;
}

const toLabelMap = (options: CompanyOption[]): Record<string, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label]));

/* ── Dropdown options (Add/Edit Company form) ─────────────────────────── */

export const COMPANY_COUNTRY_OPTIONS: CompanyOption[] = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Brazil', value: 'BR' },
  { label: 'Brunei', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Cambodia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Costa Rica', value: 'CR' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Egypt', value: 'EG' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Germany', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Greece', value: 'GR' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Japan', value: 'JP' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Lebanon', value: 'LB' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Maldives', value: 'MV' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Norway', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russia', value: 'RU' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Singapore', value: 'SG' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'Vietnam', value: 'VN' },
];

export const COMPANY_REGION_OPTIONS: CompanyOption[] = [
  { label: 'Abu Dhabi', value: 'AUH' },
  { label: 'Al Ain', value: 'AAN' },

  { label: 'Dubai', value: 'DXB' },
  { label: 'Jebel Ali', value: 'JEA' },
  { label: 'Hatta', value: 'HTA' },

  { label: 'Sharjah', value: 'SHJ' },
  { label: 'Khor Fakkan', value: 'KFK' },
  { label: 'Kalba', value: 'KLB' },
  { label: 'Dibba Al Hisn', value: 'DBH' },

  { label: 'Ajman', value: 'AJM' },
  { label: 'Masfout', value: 'MSF' },
  { label: 'Manama', value: 'MNM' },

  { label: 'Ras Al Khaimah', value: 'RAK' },
  { label: 'Al Hamra', value: 'HAM' },

  { label: 'Fujairah', value: 'FUJ' },
  { label: 'Dibba Al Fujairah', value: 'DBF' },

  { label: 'Umm Al Quwain', value: 'UAQ' },
  { label: 'Falaj Al Mualla', value: 'FLJ' },
];

/** Regulators listed under "Regulatory Industry". */
export const COMPANY_REG_INDUSTRY_OPTIONS: CompanyOption[] = [
  { label: 'CBUAE', value: 'CBUAE' },
  { label: 'DFSA', value: 'DFSA' },
  { label: 'ADGM', value: 'ADGM' },
  { label: 'ESCA', value: 'ESCA' },
  { label: 'MOE', value: 'MOE' },
  { label: 'Other', value: 'Other' },
];

export const COMPANY_ENTITY_TYPE_OPTIONS: CompanyOption[] = [
  { label: 'LLC', value: 'LLC' },
  { label: 'Branch', value: 'Branch' },
  { label: 'Public Co.', value: 'Public Co.' },
  { label: 'Partnership', value: 'Partnership' },
];

export const COMPANY_OWNERSHIP_TYPE_OPTIONS: CompanyOption[] = [
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' },
  { label: 'Government', value: 'government' },
  { label: 'Family-Owned', value: 'family' },
  { label: 'Joint Venture', value: 'joint-venture' },
  { label: 'Foreign-Owned', value: 'foreign' },
];

export const COMPANY_CURRENCY_OPTIONS: CompanyOption[] = [
  { label: 'AED – UAE Dirham', value: 'AED' },
  { label: 'USD – US Dollar', value: 'USD' },
  { label: 'EUR – Euro', value: 'EUR' },
  { label: 'GBP – British Pound', value: 'GBP' },
  { label: 'SAR – Saudi Riyal', value: 'SAR' },
  { label: 'QAR – Qatari Riyal', value: 'QAR' },
  { label: 'INR – Indian Rupee', value: 'INR' },
];

export const COMPANY_TURNOVER_BRACKET_OPTIONS: CompanyOption[] = [
  { label: 'pre-set ranges', value: 'pre-set ranges' },
  { label: 'configurable', value: 'configurable' },
];

export const COMPANY_RISK_RATING_OPTIONS: CompanyOption[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export const COMPANY_RISK_OWNER_OPTIONS: CompanyOption[] = [
  { label: 'Audit Partner', value: 'audit-partner' },
  { label: 'Audit Manager', value: 'audit-manager' },
  { label: 'Risk Officer', value: 'risk-officer' },
  { label: 'Compliance Officer', value: 'compliance-officer' },
  { label: 'CFO', value: 'cfo' },
];

export const COMPANY_AUDIT_CYCLE_OPTIONS: CompanyOption[] = [
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Semi-Annual', value: 'semi-annual' },
  { label: 'Annual', value: 'annual' },
  { label: 'Bi-Annual', value: 'bi-annual' },
  { label: 'Ad-hoc', value: 'ad-hoc' },
];

/** Sort dropdown on the companies listing page. */
export const COMPANY_SORT_OPTIONS: { label: string; value: CompanySortOption }[] = [
  { label: 'Name (A–Z)', value: 'name_asc' },
  { label: 'Name (Z–A)', value: 'name_desc' },
  { label: 'Recently Added', value: 'recent' },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const COMPANY_COUNTRY_LABELS: Record<string, string> = {
  ...toLabelMap(COMPANY_COUNTRY_OPTIONS),
  UK: 'United Kingdom',
};

export const COMPANY_REGION_LABELS = toLabelMap(COMPANY_REGION_OPTIONS);

export const COMPANY_OWNERSHIP_LABELS = toLabelMap(COMPANY_OWNERSHIP_TYPE_OPTIONS);

export const COMPANY_RISK_OWNER_LABELS = toLabelMap(COMPANY_RISK_OWNER_OPTIONS);

export const COMPANY_AUDIT_CYCLE_LABELS = toLabelMap(COMPANY_AUDIT_CYCLE_OPTIONS);

/* ── Approval status chip (orgStatus) ─────────────────────────────────── */

export const COMPANY_ORG_STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const COMPANY_ORG_STATUS_SEVERITY: Record<string, CompanyTagSeverity> = {
  pending_review: 'warn',
  approved: 'success',
  rejected: 'danger',
};
