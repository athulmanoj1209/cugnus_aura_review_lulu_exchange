/* ── Dropdown options, display labels & icons for observation values
 * The label maps used across the list / profile / drawer screens are derived
 * from the dropdown options below, so a code always resolves to the same text
 * everywhere.
 */

import {
  ObservationSortDirections,
  ObservationStatuses,
  RiskRatings,
  type ObservationSortDirection,
  type ObservationStatus,
  type RiskRating,
} from './observation.constants';

export interface ObservationOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: ObservationOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const RISK_RATING_OPTIONS: ObservationOption<RiskRating>[] = [
  { label: 'Critical', value: RiskRatings.Critical },
  { label: 'High',     value: RiskRatings.High     },
  { label: 'Medium',   value: RiskRatings.Medium   },
  { label: 'Low',      value: RiskRatings.Low      },
];

export const OBSERVATION_STATUS_OPTIONS: ObservationOption<ObservationStatus>[] = [
  { label: 'Draft',     value: ObservationStatuses.Draft     },
  { label: 'Submitted', value: ObservationStatuses.Submitted },
  { label: 'Reviewed',  value: ObservationStatuses.Reviewed  },
  { label: 'Approved',  value: ObservationStatuses.Approved  },
];

/** Linked-evidence picker on the Add / Edit Observation drawer — mock until wired to the API. */
export const OBSERVATION_EVIDENCE_OPTIONS: ObservationOption[] = [
  { label: 'EV-001 — Bank Reconciliation Q1',   value: 'EV-001' },
  { label: 'EV-002 — IT Access Control Review', value: 'EV-002' },
  { label: 'EV-003 — HR Policy Document',       value: 'EV-003' },
  { label: 'EV-004 — Vendor Contract Audit',    value: 'EV-004' },
  { label: 'EV-005 — Patch Management Logs',    value: 'EV-005' },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const RISK_RATING_LABELS = toLabelMap(RISK_RATING_OPTIONS) as Record<RiskRating, 'Critical' | 'High' | 'Medium' | 'Low'>;

export const OBSERVATION_STATUS_LABELS = toLabelMap(OBSERVATION_STATUS_OPTIONS);

/** Status wording on the auditor-execution tab's "My Observations" cards/table. */
export const AUDITOR_OBSERVATION_STATUS_LABELS: Record<ObservationStatus, string> = {
  [ObservationStatuses.Draft]: 'Open',
  [ObservationStatuses.Submitted]: 'Open',
  [ObservationStatuses.Reviewed]: 'Under Review',
  [ObservationStatuses.Approved]: 'Resolved',
};

/* ── Icons ────────────────────────────────────────────────────────────── */

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const OBSERVATION_SORT_ICONS = {
  Unsorted: '',
  [ObservationSortDirections.Asc]: 'pi-arrow-up',
  [ObservationSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | ObservationSortDirection, string>;

/** Activate / deactivate button icon on the list and grid. */
export const OBSERVATION_ACTIVE_ICONS = {
  Deactivate: 'pi pi-ban',
  Activate: 'pi pi-check-circle',
} as const;

/** Header icon of the Add / Edit / Review Observation drawer. */
export const OBSERVATION_DRAWER_ICONS = {
  Approve: 'pi-shield',
  Default: 'pi-eye',
} as const;
