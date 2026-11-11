/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_REGULATIONS) stay assignable to the derived
 * types below. Values are stored as display text.
 */

export const RegulationStatuses = {
  Current: 'Current',
  Superseded: 'Superseded',
  Draft: 'Draft',
} as const;
export type RegulationStatus = typeof RegulationStatuses[keyof typeof RegulationStatuses];

export const RegulationAuthorities = {
  Cbuae: 'CBUAE',
  Dfsa: 'DFSA',
  Adgm: 'ADGM',
  Sca: 'SCA',
  Fsra: 'FSRA',
} as const;
export type RegulationAuthority = typeof RegulationAuthorities[keyof typeof RegulationAuthorities];

export const RegulationTypes = {
  Regulation: 'Regulation',
  Guidance: 'Guidance',
  RegulationBook: 'Regulation Book',
  Standard: 'Standard',
  Notice: 'Notice',
  Circular: 'Circular',
} as const;
export type RegulationType = typeof RegulationTypes[keyof typeof RegulationTypes];

/** Kinds of item that can link to a regulation (detail page "Where Used" tab). */
export const RegulationLinkTypes = {
  Scope: 'scope',
  Task: 'task',
  Finding: 'finding',
  Rfi: 'rfi',
} as const;

/** Grid / list toggle on the Regulation Library page. */
export const RegulationViewModes = {
  List: 'list',
  Grid: 'grid',
} as const;
export type RegulationViewMode = typeof RegulationViewModes[keyof typeof RegulationViewModes];

/** Detail page tabs (p-tabs values). */
export const RegulationDetailTabs = {
  Overview: '0',
  Metadata: '1',
  WhereUsed: '2',
  VersionHistory: '3',
} as const;

/** Drawer `type` passed when editing an existing regulation. */
export const REGULATION_EDIT_DRAWER_TYPE = 'Edit';

/* ── Routing ──────────────────────────────────────────────────────────── */

export const REGULATION_LIBRARY_ROUTES = {
  List: '/audits/libraries/regulations',
  Details: '/audits/libraries/regulation-details',
} as const;

/** Route param holding the regulation id on the detail page. */
export const REGULATION_ID_PARAM = 'id';

/* ── Configuration ────────────────────────────────────────────────────── */

export const REGULATION_DRAWER_WIDTH = '769px';

export const REGULATION_LIST_PAGE_SIZE = 5;

export const REGULATION_PAGE_SIZE_OPTIONS = [5, 10, 20];

/** Default sort field of the listing. */
export const REGULATION_DEFAULT_SORT = 'title';

/** Search box debounce on the listing. */
export const REGULATION_SEARCH_DEBOUNCE_MS = 250;

/** Max width of the filter overlay's select panels (appended to body). */
export const REGULATION_FILTER_PANEL_STYLE = { 'max-width': '260px' } as const;

/** Gap between the Filters button and its overlay. */
export const REGULATION_FILTER_OVERLAY_OFFSET_PX = 8;

export const REGULATION_FIELD_LIMITS = {
  TitleMin: 5,
} as const;

/** Attachment uploader on the Add / Edit Regulation drawer. */
export const REGULATION_UPLOAD = {
  Accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt',
  MaxSizeMB: 10,
} as const;

export const BYTES_PER_KB = 1024;
export const BYTES_PER_MB = 1024 * 1024;

/** List page dates: d/m/yyyy (en-GB). */
export const REGULATION_LIST_DATE = {
  Locale: 'en-GB',
  Options: { day: 'numeric', month: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
} as const;

/** Detail page dates: long "January 15, 2022" and short "1/15/2022" (en-US). */
export const REGULATION_DETAIL_DATE = {
  Locale: 'en-US',
  Long: { month: 'long', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
  Short: { month: 'numeric', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
} as const;

/**
 * ISO 3166-1 alpha-2 codes offered in the Country picker — labels are
 * resolved at runtime with Intl.DisplayNames.
 */
export const REGULATION_COUNTRY_CODES = [
  'AF','AL','DZ','AD','AO','AG','AR','AM','AU','AT','AZ','BS','BH','BD','BB',
  'BY','BE','BZ','BJ','BT','BO','BA','BW','BR','BN','BG','BF','BI','CV','KH',
  'CM','CA','CF','TD','CL','CN','CO','KM','CG','CD','CR','HR','CU','CY','CZ',
  'DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FJ','FI','FR',
  'GA','GM','GE','DE','GH','GR','GD','GT','GN','GW','GY','HT','HN','HU','IS',
  'IN','ID','IR','IQ','IE','IL','IT','JM','JP','JO','KZ','KE','KI','KP','KR',
  'KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MG','MW','MY','MV',
  'ML','MT','MH','MR','MU','MX','FM','MD','MC','MN','ME','MA','MZ','MM','NA',
  'NR','NP','NL','NZ','NI','NE','NG','MK','NO','OM','PK','PW','PA','PG','PY',
  'PE','PH','PL','PT','QA','RO','RU','RW','KN','LC','VC','WS','SM','ST','SA',
  'SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','SS','ES','LK','SD','SR',
  'SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TO','TT','TN','TR','TM','TV',
  'UG','UA','AE','GB','US','UY','UZ','VU','VE','VN','YE','ZM','ZW',
] as const;

/** Locale used for Intl.DisplayNames country labels. */
export const REGULATION_COUNTRY_DISPLAY_LOCALE = 'en';
