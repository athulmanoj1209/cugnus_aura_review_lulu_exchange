/* ── Dropdown options, display labels & icons for recommendation values
 * The label maps used across the list / profile / drawer screens are derived
 * from the dropdown options below, so a code always resolves to the same text
 * everywhere.
 */

import {
  RecommendationPriorities,
  RecommendationSortDirections,
  RecommendationStatuses,
  type RecommendationPriority,
  type RecommendationSortDirection,
  type RecommendationStatus,
} from './recommendation.constants';

export interface RecommendationOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: RecommendationOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const RECOMMENDATION_PRIORITY_OPTIONS: RecommendationOption<RecommendationPriority>[] = [
  { label: 'Critical', value: RecommendationPriorities.Critical },
  { label: 'High',     value: RecommendationPriorities.High     },
  { label: 'Medium',   value: RecommendationPriorities.Medium   },
  { label: 'Low',      value: RecommendationPriorities.Low      },
];

export const RECOMMENDATION_STATUS_OPTIONS: RecommendationOption<RecommendationStatus>[] = [
  { label: 'Open',        value: RecommendationStatuses.Open        },
  { label: 'In Progress', value: RecommendationStatuses.InProgress  },
  { label: 'Implemented', value: RecommendationStatuses.Implemented },
  { label: 'Verified',    value: RecommendationStatuses.Verified    },
  { label: 'Closed',      value: RecommendationStatuses.Closed      },
];

/** Linked-finding picker on the Add / Edit Recommendation drawer — mock until wired to the API. */
export const RECOMMENDATION_FINDING_OPTIONS: RecommendationOption[] = [
  { label: 'F-005 — Missing access controls',   value: 'F-005' },
  { label: 'F-008 — Segregation of duties gap', value: 'F-008' },
  { label: 'F-012 — Unreconciled bank entries', value: 'F-012' },
  { label: 'F-021 — Outdated HR policies',      value: 'F-021' },
  { label: 'F-034 — Outdated patch management', value: 'F-034' },
];

/** Assignee picker on the Add / Edit Recommendation drawer. */
export const RECOMMENDATION_ASSIGNEE_OPTIONS: RecommendationOption[] = [
  { label: 'Finance Manager',    value: 'Finance Manager'    },
  { label: 'IT Manager',         value: 'IT Manager'         },
  { label: 'IT Security Lead',   value: 'IT Security Lead'   },
  { label: 'HR Director',        value: 'HR Director'        },
  { label: 'Legal Counsel',      value: 'Legal Counsel'      },
  { label: 'Operations Lead',    value: 'Operations Lead'    },
  { label: 'Compliance Officer', value: 'Compliance Officer' },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const RECOMMENDATION_PRIORITY_LABELS = toLabelMap(RECOMMENDATION_PRIORITY_OPTIONS);

export const RECOMMENDATION_STATUS_LABELS = toLabelMap(RECOMMENDATION_STATUS_OPTIONS);

/* ── Icons ────────────────────────────────────────────────────────────── */

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const RECOMMENDATION_SORT_ICONS = {
  Unsorted: '',
  [RecommendationSortDirections.Asc]: 'pi-arrow-up',
  [RecommendationSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | RecommendationSortDirection, string>;

/** Activate / deactivate button icon on the list and grid. */
export const RECOMMENDATION_ACTIVE_ICONS = {
  Deactivate: 'pi pi-ban',
  Activate: 'pi pi-check-circle',
} as const;

/** Due-date icon (bare class for <i>, full class for <app-draw-icon>). */
export const RECOMMENDATION_DUE_ICONS = {
  Overdue: 'pi-exclamation-triangle',
  OnTime: 'pi-calendar',
  OverdueFull: 'pi pi-exclamation-triangle',
  OnTimeFull: 'pi pi-calendar',
} as const;

/** Header icon of the Add / Edit / Review Recommendation drawer. */
export const RECOMMENDATION_DRAWER_ICONS = {
  Approve: 'pi-shield',
  Default: 'pi-check-square',
} as const;

/** Profile drawer "days remaining" stat icon tint. */
export const RECOMMENDATION_DUE_STAT_CLASSES = {
  Overdue: 'stat-ic--red',
  OnTime: 'stat-ic--mint',
} as const;
