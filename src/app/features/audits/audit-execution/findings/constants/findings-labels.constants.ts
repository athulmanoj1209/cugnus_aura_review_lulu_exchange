/* ── Dropdown options, display labels, colours & icons for finding values
 * The label maps used across the list / profile / detail / dashboard screens
 * are derived from the dropdown options below, so a code always resolves to
 * the same text everywhere.
 */

import {
  FindingFilterKeys,
  FindingSeverities,
  FindingSortDirections,
  FindingStatuses,
  type FindingFilterKey,
  type FindingSeverity,
  type FindingSortDirection,
  type FindingStatus,
} from './findings.constants';

export interface FindingOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: FindingOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const FINDING_SEVERITY_OPTIONS: FindingOption<FindingSeverity>[] = [
  { label: 'Critical', value: FindingSeverities.Critical },
  { label: 'High',     value: FindingSeverities.High     },
  { label: 'Medium',   value: FindingSeverities.Medium   },
  { label: 'Low',      value: FindingSeverities.Low      },
];

export const FINDING_STATUS_OPTIONS: FindingOption<FindingStatus>[] = [
  { label: 'Open',        value: FindingStatuses.Open       },
  { label: 'In Progress', value: FindingStatuses.InProgress },
  { label: 'Responded',   value: FindingStatuses.Responded  },
  { label: 'Verified',    value: FindingStatuses.Verified   },
  { label: 'Closed',      value: FindingStatuses.Closed     },
  { label: 'Overdue',     value: FindingStatuses.Overdue    },
  { label: 'Escalated',   value: FindingStatuses.Escalated  },
  { label: 'Rejected',    value: FindingStatuses.Rejected   },
];

/** Risk categories on the Add / Edit Finding drawer (code → stored display label). */
export const FINDING_RISK_OPTIONS: FindingOption[] = [
  { label: 'Risk related to accounts', value: 'finance' },
  { label: 'Risk in Human Resources',  value: 'hr'      },
  { label: 'IT TAX risks',             value: 'it'      },
];

/** Linked-observation picker on the Add / Edit Finding drawer — mock until wired to the API. */
export const FINDING_OBSERVATION_OPTIONS: FindingOption[] = [
  { label: 'EV-001 — Bank Reconciliation Q1',   value: 'EV-001' },
  { label: 'EV-002 — IT Access Control Review', value: 'EV-002' },
  { label: 'EV-003 — HR Policy Document',       value: 'EV-003' },
  { label: 'EV-004 — Vendor Contract Audit',    value: 'EV-004' },
  { label: 'EV-005 — Patch Management Logs',    value: 'EV-005' },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const FINDING_SEVERITY_LABELS = toLabelMap(FINDING_SEVERITY_OPTIONS);

export const FINDING_STATUS_LABELS = toLabelMap(FINDING_STATUS_OPTIONS);

/** Risk code → label, and the reverse (label stored on the finding → form code). */
export const FINDING_RISK_LABELS: Record<string, string> = toLabelMap(FINDING_RISK_OPTIONS);
export const FINDING_RISK_VALUES: Record<string, string> =
  Object.fromEntries(FINDING_RISK_OPTIONS.map(o => [o.label, o.value]));

/** Status wording on the auditor-execution tab's "My Findings" cards/table. */
export const AUDITOR_FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  [FindingStatuses.Open]: 'Draft',
  [FindingStatuses.Rejected]: 'Draft',
  [FindingStatuses.InProgress]: 'Submitted',
  [FindingStatuses.Responded]: 'Under Review',
  [FindingStatuses.Escalated]: 'Under Review',
  [FindingStatuses.Overdue]: 'Under Review',
  [FindingStatuses.Verified]: 'Approved',
  [FindingStatuses.Closed]: 'Closed',
};

/** Severity → High / Medium / Low risk wording on the auditor dashboard. */
export const FINDING_SEVERITY_RISK_LABELS: Record<FindingSeverity, 'High' | 'Medium' | 'Low'> = {
  [FindingSeverities.Critical]: 'High',
  [FindingSeverities.High]: 'High',
  [FindingSeverities.Medium]: 'Medium',
  [FindingSeverities.Low]: 'Low',
};

/** Severities (and their labels) on the dashboard's "Open Findings by Severity" pie. */
export const OPEN_SEVERITY_PIE_SEVERITIES: FindingSeverity[] = [
  FindingSeverities.Critical,
  FindingSeverities.High,
  FindingSeverities.Medium,
];

/** Prefix of each active-filter chip on the Findings page ('Repeated' / 'Date range' are the whole label). */
export const FINDING_FILTER_CHIP_LABELS: Record<FindingFilterKey, string> = {
  [FindingFilterKeys.Severities]: 'Severity',
  [FindingFilterKeys.Statuses]: 'Status',
  [FindingFilterKeys.Subdivisions]: 'Sub-Division',
  [FindingFilterKeys.Companies]: 'Company',
  [FindingFilterKeys.Divisions]: 'Division',
  [FindingFilterKeys.Scopes]: 'Scope',
  [FindingFilterKeys.Subscopes]: 'Sub-scope',
  [FindingFilterKeys.Auditors]: 'Auditor',
  [FindingFilterKeys.Repeated]: 'Repeated',
  [FindingFilterKeys.Date]: 'Date range',
};

/* ── Colours & icons ──────────────────────────────────────────────────── */

export const FINDING_SEVERITY_COLORS: Record<FindingSeverity, string> = {
  [FindingSeverities.Critical]: '#ef4444',
  [FindingSeverities.High]: '#f97316',
  [FindingSeverities.Medium]: '#f59e0b',
  [FindingSeverities.Low]: '#94a3b8',
};

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const FINDING_SORT_ICONS = {
  Unsorted: '',
  [FindingSortDirections.Asc]: 'pi-arrow-up',
  [FindingSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | FindingSortDirection, string>;

/** Activate / deactivate button icons (list rows use the bare class, grid cards the full one). */
export const FINDING_ACTIVE_ICONS = {
  Deactivate: 'pi-ban',
  Activate: 'pi-check-circle',
  DeactivateFull: 'pi pi-ban',
  ActivateFull: 'pi pi-check-circle',
} as const;

export const FINDING_LOADING_ICON = 'pi-spin pi-spinner';
export const FINDING_VIEW_ICON = 'pi-eye';

/** Profile drawer document icons, by file extension. */
export const FINDING_DOCUMENT_ICONS: Record<string, string> = {
  pdf: 'pi pi-file-pdf',
  xls: 'pi pi-file-excel',
  xlsx: 'pi pi-file-excel',
  doc: 'pi pi-file-word',
  docx: 'pi pi-file-word',
};
export const FINDING_DOCUMENT_ICON_DEFAULT = 'pi pi-file';

/** Detail page evidence icons, by file type. */
export const FINDING_EVIDENCE_ICONS: Record<string, string> = {
  pdf: 'pi-file-pdf',
  xls: 'pi-file-excel',
  xlsx: 'pi-file-excel',
  csv: 'pi-file-excel',
  doc: 'pi-file-word',
  docx: 'pi-file-word',
  png: 'pi-image',
  jpg: 'pi-image',
  jpeg: 'pi-image',
  gif: 'pi-image',
  svg: 'pi-image',
  zip: 'pi-folder',
  rar: 'pi-folder',
  '7z': 'pi-folder',
};
export const FINDING_EVIDENCE_ICON_DEFAULT = 'pi-file';
