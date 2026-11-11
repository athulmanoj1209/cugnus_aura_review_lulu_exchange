/* ── Dropdown options, display labels & icons for evidence values
 * The type label map used across the list / profile screens is derived from
 * the dropdown options below, so a code always resolves to the same text
 * everywhere.
 */

import {
  EvidenceFilterKeys,
  EvidenceReviewStatuses,
  EvidenceSortDirections,
  EvidenceTypes,
  type EvidenceFilterKey,
  type EvidenceReviewStatus,
  type EvidenceSortDirection,
  type EvidenceType,
} from './evidence.constants';

export interface EvidenceOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: EvidenceOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const EVIDENCE_TYPE_OPTIONS: EvidenceOption<EvidenceType>[] = [
  { label: 'Document',            value: EvidenceTypes.Document           },
  { label: 'Screenshot',          value: EvidenceTypes.Screenshot         },
  { label: 'Interview Notes',     value: EvidenceTypes.InterviewNotes     },
  { label: 'System Log',          value: EvidenceTypes.SystemLog          },
  { label: 'Email',               value: EvidenceTypes.Email              },
  { label: 'Physical Inspection', value: EvidenceTypes.PhysicalInspection },
  { label: 'Other',               value: EvidenceTypes.Other              },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const EVIDENCE_TYPE_LABELS = toLabelMap(EVIDENCE_TYPE_OPTIONS);

/** Type wording on the auditor dashboard's "My Evidences" table. */
export const EVIDENCE_TYPE_DASHBOARD_LABELS: Record<EvidenceType, string> = {
  ...EVIDENCE_TYPE_LABELS,
  [EvidenceTypes.SystemLog]: 'Log File',
};

export const EVIDENCE_REVIEW_STATUS_LABELS: Record<EvidenceReviewStatus, string> = {
  [EvidenceReviewStatuses.Requested]: 'Requested',
  [EvidenceReviewStatuses.Uploaded]: 'Uploaded',
  [EvidenceReviewStatuses.UnderReview]: 'Under Review',
  [EvidenceReviewStatuses.Accepted]: 'Accepted',
  [EvidenceReviewStatuses.Rejected]: 'Rejected',
};

/** Prefix of each active-filter chip on the Evidence Repository page. */
export const EVIDENCE_FILTER_CHIP_LABELS: Record<EvidenceFilterKey, string> = {
  [EvidenceFilterKeys.Types]: 'Type',
  [EvidenceFilterKeys.Scopes]: 'Scope',
  [EvidenceFilterKeys.Tasks]: 'Task',
  [EvidenceFilterKeys.Companies]: 'Company',
  [EvidenceFilterKeys.Divisions]: 'Division',
  [EvidenceFilterKeys.SubDivisions]: 'Sub-Division',
  [EvidenceFilterKeys.Auditors]: 'Auditor',
  [EvidenceFilterKeys.Date]: 'Date range',
};

/** Task id → title, for evidence created from the drawer. */
export const EVIDENCE_TASK_TITLES: Record<string, string> = {
  'TSK-001': 'Review payment controls',
  'TSK-002': 'User access audit',
  'TSK-003': 'HR compliance review',
  'TSK-004': 'Vendor due diligence',
  'TSK-005': 'Patch compliance check',
};

/* ── Icons ────────────────────────────────────────────────────────────── */

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const EVIDENCE_SORT_ICONS = {
  Unsorted: '',
  [EvidenceSortDirections.Asc]: 'pi-arrow-up',
  [EvidenceSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | EvidenceSortDirection, string>;

/** File extension → PrimeIcons class of the file pills / file lists. */
export const EVIDENCE_FILE_ICONS: Record<string, string> = {
  pdf: 'pi-file-pdf',
  doc: 'pi-file-word',
  docx: 'pi-file-word',
  xls: 'pi-file-excel',
  xlsx: 'pi-file-excel',
  png: 'pi-image',
  jpg: 'pi-image',
  jpeg: 'pi-image',
  gif: 'pi-image',
  zip: 'pi-folder',
  rar: 'pi-folder',
};

export const EVIDENCE_FILE_ICON_DEFAULT = 'pi-file';

/** Header icon of the Add / Edit / Review Evidence drawer. */
export const EVIDENCE_DRAWER_ICONS = {
  Approve: 'pi-shield',
  Default: 'pi-folder-open',
} as const;
