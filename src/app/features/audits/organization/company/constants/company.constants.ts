/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (company-static-data.ts) stay assignable to the
 * derived types in models/company.model.ts.
 */

export const CompanyOrgStatuses = {
  PendingReview: 'pending_review',
  Rejected: 'rejected',
  Approved: 'approved',
} as const;

export const CompanyRiskRatings = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

/** `type` passed in the drawer data / `viewType` form control of the Add/Edit company drawer. */
export const CompanyDrawerTypes = {
  View: 'View',
  Edit: 'Edit',
} as const;
export type CompanyDrawerType = typeof CompanyDrawerTypes[keyof typeof CompanyDrawerTypes];

export const CompanyApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type CompanyApprovalAction = typeof CompanyApprovalActions[keyof typeof CompanyApprovalActions];

/** Grid / list toggle on the companies listing page. */
export const CompanyViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type CompanyViewMode = typeof CompanyViewModes[keyof typeof CompanyViewModes];

/** Sort options on the companies listing page. */
export const CompanySortOptions = {
  NameAsc: 'name_asc',
  NameDesc: 'name_desc',
  Recent: 'recent',
  Location: 'location',
} as const;
export type CompanySortOption = typeof CompanySortOptions[keyof typeof CompanySortOptions];

/** Block / unblock action shown in the listing's confirmation dialog. */
export const CompanyBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type CompanyBlockAction = typeof CompanyBlockActions[keyof typeof CompanyBlockActions];

/** Tone of the license-expiry badge on the company profile. */
export const CompanyLicenseExpiryTones = {
  Ok: 'ok',
  Warn: 'warn',
  Expired: 'expired',
} as const;
export type CompanyLicenseExpiryTone = typeof CompanyLicenseExpiryTones[keyof typeof CompanyLicenseExpiryTones];

/** Fields on the company profile that have a copy-to-clipboard button. */
export const CompanyCopyFields = {
  Email: 'email',
  Phone: 'phone',
  Website: 'website',
  Reg: 'reg',
} as const;
export type CompanyCopyField = typeof CompanyCopyFields[keyof typeof CompanyCopyFields];

/* ── Configuration ────────────────────────────────────────────────────── */

export const COMPANY_DRAWER = {
  FormWidth: '720px',
  ProfileWidth: '820px',
} as const;

export const COMPANY_LIST_PAGE_SIZE = 10;

export const COMPANY_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

export const COMPANY_SEARCH_DEBOUNCE_MS = 200;

/** Form groups of the company form, in tab order (tab index = array index). */
export const COMPANY_FORM_TAB_GROUPS = ['basic', 'regulatory', 'financial', 'risk'] as const;

/** First / last tab of the company form (PrimeNG v18 Tabs use string values). */
export const COMPANY_FORM_FIRST_TAB = '0';
export const COMPANY_FORM_LAST_TAB = String(COMPANY_FORM_TAB_GROUPS.length - 1);

/** Length / range limits for the company form controls. */
export const COMPANY_FIELD_LIMITS = {
  CompanyNameMin: 2,
  CompanyNameMax: 200,
  TradeLegalRegNumberMax: 50,
  CityMax: 100,
  AddressMax: 255,
  EmailMax: 200,
  WebsiteMax: 300,
  ParentCompanyMax: 200,
  GroupAffiliationMax: 200,
  NotesMax: 500,
  RegulatoryLicenseNumberMax: 100,
  RegulatoryNotesMax: 1000,
  EmployeesMin: 0,
  EmployeesMax: 1_000_000,
  SubDivisionsLocationsMin: 0,
  SubDivisionsLocationsMax: 100_000,
  FiscalYearStartMax: 50,
  ResidualRiskScoreMin: 0,
  ResidualRiskScoreMax: 10,
  RiskNotesMax: 500,
} as const;

/** A license expiring within this many days shows the warning tone. */
export const COMPANY_LICENSE_EXPIRY_WARN_DAYS = 60;

/** How long the "copied" tick stays on a profile field. */
export const COMPANY_COPY_FEEDBACK_MS = 1200;

/** Name given to a company saved without one. */
export const COMPANY_DEFAULT_NAME = 'Untitled company';

/** Created-at fallback for companies with no date of incorporation. */
export const COMPANY_DEFAULT_CREATED_AT = '2020-01-01';

export const COMPANY_ORG_CHART_ROUTE = '/audits/organization/client-org-chart';
