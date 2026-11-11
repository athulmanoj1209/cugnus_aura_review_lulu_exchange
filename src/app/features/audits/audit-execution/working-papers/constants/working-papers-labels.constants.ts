/* ── Dropdown options, display labels & icons for working-paper values
 * The label maps used across the list / profile / drawer screens are derived
 * from the dropdown options below, so a code always resolves to the same text
 * everywhere.
 */

import {
  AUDIT_ASSERTIONS,
  RiskLevels,
  WorkingPaperFilterKeys,
  WorkingPaperSortDirections,
  WorkingPaperStatuses,
  WorkingPaperTypes,
  type RiskLevel,
  type WorkingPaperFilterKey,
  type WorkingPaperSortDirection,
  type WorkingPaperStatus,
  type WorkingPaperType,
} from './working-papers.constants';

export interface WorkingPaperOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: WorkingPaperOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const WORKING_PAPER_TYPE_OPTIONS: WorkingPaperOption<WorkingPaperType>[] = [
  { label: 'Lead Schedule',     value: WorkingPaperTypes.LeadSchedule     },
  { label: 'Test of Controls',  value: WorkingPaperTypes.TestOfControls   },
  { label: 'Substantive Test',  value: WorkingPaperTypes.SubstantiveTest  },
  { label: 'Analytical Review', value: WorkingPaperTypes.AnalyticalReview },
  { label: 'Reconciliation',    value: WorkingPaperTypes.Reconciliation   },
  { label: 'Memorandum',        value: WorkingPaperTypes.Memo             },
  { label: 'Confirmation',      value: WorkingPaperTypes.Confirmation     },
  { label: 'Other',             value: WorkingPaperTypes.Other            },
];

export const WORKING_PAPER_STATUS_OPTIONS: WorkingPaperOption<WorkingPaperStatus>[] = [
  { label: 'Draft',        value: WorkingPaperStatuses.Draft       },
  { label: 'In Progress',  value: WorkingPaperStatuses.InProgress  },
  { label: 'Prepared',     value: WorkingPaperStatuses.Prepared    },
  { label: 'Under Review', value: WorkingPaperStatuses.UnderReview },
  { label: 'Reviewed',     value: WorkingPaperStatuses.Reviewed    },
  { label: 'Approved',     value: WorkingPaperStatuses.Approved    },
  { label: 'Reopened',     value: WorkingPaperStatuses.Reopened    },
];

export const RISK_LEVEL_OPTIONS: WorkingPaperOption<RiskLevel>[] = [
  { label: 'High',   value: RiskLevels.High   },
  { label: 'Medium', value: RiskLevels.Medium },
  { label: 'Low',    value: RiskLevels.Low    },
];

export const AUDIT_ASSERTION_OPTIONS: WorkingPaperOption[] = AUDIT_ASSERTIONS.map(a => ({ label: a, value: a }));

/** Linked-finding picker on the Add / Edit drawer (finding id → title) — mock until wired to the API. */
export const WORKING_PAPER_FINDING_TITLES: Record<string, string> = {
  'F-005': 'Revenue recognised before delivery',
  'F-008': 'Unrecorded supplier invoices',
  'F-009': 'Excessive privileged access rights',
  'F-012': 'Unreconciled bank entries',
  'F-017': 'Count sheets not sequentially controlled',
  'F-021': 'Manual overrides not approved',
  'F-028': 'Low confirmation response rate',
  'F-034': 'Depreciation rates inconsistent',
  'F-045': 'Deferred tax liability understated',
  'F-051': 'Undisclosed related party transaction',
  'F-062': 'Provision not updated for 6+ months',
  'F-071': 'Cash flow forecast overly optimistic',
};

export const WORKING_PAPER_FINDING_OPTIONS: WorkingPaperOption[] =
  Object.entries(WORKING_PAPER_FINDING_TITLES).map(([id, title]) => ({ label: `${id} — ${title}`, value: id }));

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const WORKING_PAPER_TYPE_LABELS = toLabelMap(WORKING_PAPER_TYPE_OPTIONS);

export const WORKING_PAPER_STATUS_LABELS = toLabelMap(WORKING_PAPER_STATUS_OPTIONS);

export const RISK_LEVEL_LABELS = toLabelMap(RISK_LEVEL_OPTIONS);

/** Status / reviewer-status wording on the auditor dashboard's "Working Papers" table. */
export const AUDITOR_WORKING_PAPER_STATUS_LABELS: Record<WorkingPaperStatus, { status: string; reviewerStatus: string }> = {
  [WorkingPaperStatuses.Draft]: { status: 'Draft', reviewerStatus: '-' },
  [WorkingPaperStatuses.InProgress]: { status: 'In Progress', reviewerStatus: '-' },
  [WorkingPaperStatuses.Prepared]: { status: 'Submitted', reviewerStatus: 'Pending' },
  [WorkingPaperStatuses.UnderReview]: { status: 'Submitted', reviewerStatus: 'Under Review' },
  [WorkingPaperStatuses.Reviewed]: { status: 'Submitted', reviewerStatus: 'Approved' },
  [WorkingPaperStatuses.Approved]: { status: 'Approved', reviewerStatus: 'Approved' },
  [WorkingPaperStatuses.Reopened]: { status: 'Returned', reviewerStatus: 'Returned' },
};

/** Prefix of each active-filter chip on the Working Papers page ('Date range' is the whole label). */
export const WORKING_PAPER_FILTER_CHIP_LABELS: Record<WorkingPaperFilterKey, string> = {
  [WorkingPaperFilterKeys.Types]: 'Type',
  [WorkingPaperFilterKeys.Statuses]: 'Status',
  [WorkingPaperFilterKeys.Risks]: 'Risk',
  [WorkingPaperFilterKeys.Scopes]: 'Area',
  [WorkingPaperFilterKeys.Tasks]: 'Task',
  [WorkingPaperFilterKeys.Companies]: 'Company',
  [WorkingPaperFilterKeys.Divisions]: 'Division',
  [WorkingPaperFilterKeys.SubDivisions]: 'Sub-Division',
  [WorkingPaperFilterKeys.Preparers]: 'Preparer',
  [WorkingPaperFilterKeys.Date]: 'Date range',
};

/* ── Icons ────────────────────────────────────────────────────────────── */

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const WORKING_PAPER_SORT_ICONS = {
  Unsorted: '',
  [WorkingPaperSortDirections.Asc]: 'pi-arrow-up',
  [WorkingPaperSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | WorkingPaperSortDirection, string>;

/** Activate / deactivate button icon on the list and grid. */
export const WORKING_PAPER_ACTIVE_ICONS = {
  Deactivate: 'pi pi-ban',
  Activate: 'pi pi-check-circle',
} as const;

/** File extension → PrimeIcons class of the file pills / file lists. */
export const WORKING_PAPER_FILE_ICONS: Record<string, string> = {
  pdf: 'pi-file-pdf',
  doc: 'pi-file-word',
  docx: 'pi-file-word',
  xls: 'pi-file-excel',
  xlsx: 'pi-file-excel',
  csv: 'pi-file-excel',
  png: 'pi-image',
  jpg: 'pi-image',
  jpeg: 'pi-image',
  gif: 'pi-image',
  zip: 'pi-folder',
  rar: 'pi-folder',
};

export const WORKING_PAPER_FILE_ICON_DEFAULT = 'pi-file';

/** Header icon of the Add / Edit / Review Working Paper drawer. */
export const WORKING_PAPER_DRAWER_ICONS = {
  Approve: 'pi-verified',
  Default: 'pi-file-edit',
} as const;
