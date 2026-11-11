/* ── Dropdown options, colours, icons & severities for regulation values ─ */

import {
  RegulationAuthorities,
  RegulationLinkTypes,
  RegulationStatuses,
  RegulationTypes,
  type RegulationAuthority,
  type RegulationStatus,
  type RegulationType,
} from './regulation-library.constants';

export interface RegulationOption<T = string> {
  label: string;
  value: T;
}

/* ── Dropdown options (values are display text) ───────────────────────── */

export const REGULATION_AUTHORITY_OPTIONS: RegulationOption<RegulationAuthority>[] =
  Object.values(RegulationAuthorities).map(v => ({ label: v, value: v }));

export const REGULATION_TYPE_OPTIONS: RegulationOption<RegulationType>[] =
  Object.values(RegulationTypes).map(v => ({ label: v, value: v }));

/** Status order on the listing filter. */
export const REGULATION_STATUS_FILTER_OPTIONS: RegulationOption<RegulationStatus>[] = [
  { label: RegulationStatuses.Current,    value: RegulationStatuses.Current    },
  { label: RegulationStatuses.Superseded, value: RegulationStatuses.Superseded },
  { label: RegulationStatuses.Draft,      value: RegulationStatuses.Draft      },
];

/** Status order on the Add / Edit drawer. */
export const REGULATION_STATUS_FORM_OPTIONS: RegulationOption<RegulationStatus>[] = [
  { label: RegulationStatuses.Current,    value: RegulationStatuses.Current    },
  { label: RegulationStatuses.Draft,      value: RegulationStatuses.Draft      },
  { label: RegulationStatuses.Superseded, value: RegulationStatuses.Superseded },
];

/** "All …" first option of each listing filter (value '' = no filter). */
export const REGULATION_FILTER_ALL_LABELS = {
  Authorities: 'All Authorities',
  Types: 'All Types',
  Statuses: 'All Statuses',
  Companies: 'All Companies',
  Divisions: 'All Divisions',
  SubDivisions: 'All Sub-Divisions',
} as const;

export const allOption = (label: string): RegulationOption => ({ label, value: '' });

/** Listing sort fields. */
export const REGULATION_SORT_OPTIONS = [
  { label: 'Title',          value: 'title'         },
  { label: 'Effective Date', value: 'effectiveDate' },
  { label: 'Authority',      value: 'authority'     },
  { label: 'Type',           value: 'type'          },
] as const;

/** Cross-reference picker on the Add / Edit drawer — mock until wired to the API. */
export const REGULATION_CROSS_REF_OPTIONS: RegulationOption[] = [
  { label: 'Conduct of Business Rulebook – DFSA-COB',                          value: 'DFSA-COB'         },
  { label: 'Risk-Based Approach Guidance for Virtual Assets – FATF-VA-RBA-2023', value: 'FATF-VA-RBA-2023' },
  { label: 'AML Module – DFSA-AML',                                             value: 'DFSA-AML'         },
  { label: 'Consumer Protection Standards – CBUAE/CP/2021/008',                value: 'CBUAE-CP-2021'    },
  { label: 'Markets Rules – DFSA-MKT',                                          value: 'DFSA-MKT'         },
  { label: 'Digital Assets Framework – ADGM-DAF-2023',                         value: 'ADGM-DAF-2023'    },
  { label: 'Corporate Governance Code – ADGM-CGC-2023',                        value: 'ADGM-CGC-2023'    },
];

/** Applicable-entity (scope) picker on the Add / Edit drawer. */
export const REGULATION_SCOPE_OPTIONS: RegulationOption[] = [
  { label: 'Banks',                     value: 'banks'             },
  { label: 'Insurance Companies',       value: 'insurance'         },
  { label: 'Investment Firms',          value: 'investment_firms'  },
  { label: 'Exchange Houses',           value: 'exchange_houses'   },
  { label: 'Payment Service Providers', value: 'psp'               },
  { label: 'Finance Companies',         value: 'finance_companies' },
  { label: 'Virtual Asset SPs',         value: 'vasp'              },
  { label: 'Listed Companies',          value: 'listed_companies'  },
  { label: 'Authorized Firms (DIFC)',   value: 'authorized_difc'   },
  { label: 'Registered Firms (ADGM)',   value: 'registered_adgm'   },
];

/** Related-function picker on the Add / Edit drawer. */
export const REGULATION_RELATED_FUNCTION_OPTIONS: RegulationOption[] = [
  { label: 'Onboarding',             value: 'onboarding'      },
  { label: 'Screening',              value: 'screening'       },
  { label: 'Transaction Monitoring', value: 'transaction_mon' },
  { label: 'Compliance',             value: 'compliance'      },
  { label: 'Risk Management',        value: 'risk_management' },
  { label: 'Reporting',              value: 'reporting'       },
  { label: 'Customer Due Diligence', value: 'cdd'             },
  { label: 'Governance',             value: 'governance'      },
];

/* ── Colours & severities ─────────────────────────────────────────────── */

export const REGULATION_AUTHORITY_COLORS: Record<RegulationAuthority, string> = {
  [RegulationAuthorities.Cbuae]: '#1565C0',
  [RegulationAuthorities.Dfsa]: '#283593',
  [RegulationAuthorities.Adgm]: '#4527A0',
  [RegulationAuthorities.Sca]: '#00695C',
  [RegulationAuthorities.Fsra]: '#6A1B9A',
};
export const REGULATION_AUTHORITY_COLOR_DEFAULT = '#455A64';

export const REGULATION_TYPE_COLORS: Record<string, string> = {
  [RegulationTypes.Regulation]: '#0277BD',
  [RegulationTypes.Guidance]: '#00838F',
  [RegulationTypes.RegulationBook]: '#1565C0',
  [RegulationTypes.Standard]: '#2E7D32',
  [RegulationTypes.Notice]: '#E65100',
  [RegulationTypes.Circular]: '#558B2F',
};
export const REGULATION_TYPE_COLOR_DEFAULT = '#546E7A';

export const REGULATION_STATUS_SEVERITY = {
  [RegulationStatuses.Current]: 'success',
  [RegulationStatuses.Superseded]: 'warn',
  [RegulationStatuses.Draft]: 'info',
} as const satisfies Record<RegulationStatus, string>;

/** "Where Used" type badge class, by link type (lower-cased). */
export const REGULATION_LINK_TYPE_CLASSES: Record<string, string> = {
  [RegulationLinkTypes.Scope]: 'badge--scope',
  [RegulationLinkTypes.Task]: 'badge--task',
  [RegulationLinkTypes.Finding]: 'badge--finding',
  [RegulationLinkTypes.Rfi]: 'badge--rfi',
};
export const REGULATION_LINK_TYPE_CLASS_DEFAULT = 'badge--default';

/* ── Icons & classes ──────────────────────────────────────────────────── */

/** Activate / deactivate button icon on the list and grid. */
export const REGULATION_ACTIVE_ICONS = {
  Deactivate: 'pi pi-ban',
  Activate: 'pi pi-check-circle',
} as const;

/** Activate / deactivate footer button modifier class. */
export const REGULATION_ACTIVE_ACTION_CLASSES = {
  Deactivate: 'reg-library__footer-action--danger',
  Activate: 'reg-library__footer-action--success',
} as const;

/** Attachment icon by file extension on the Add / Edit drawer. */
export const REGULATION_FILE_ICONS: { ext: string[]; icon: string }[] = [
  { ext: ['.pdf'],          icon: 'pi pi-file-pdf'   },
  { ext: ['.doc', '.docx'], icon: 'pi pi-file-word'  },
  { ext: ['.xls', '.xlsx'], icon: 'pi pi-file-excel' },
];
export const REGULATION_FILE_ICON_DEFAULT = 'pi pi-file';
