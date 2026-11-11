/* ── Dropdown options, display labels, CSS classes & icons for audit-plan values
 * The label maps used across the list / view / calendar screens are derived
 * from the dropdown options below, so a code always resolves to the same
 * text everywhere.
 */

import {
  AuditPlanFilterKeys,
  AuditPlanSortDirections,
  AuditPlanStatuses,
  Frequencies,
  InstanceStatuses,
  PlanViews,
  type AuditPlanFilterKey,
  type AuditPlanSortDirection,
  type AuditPlanStatus,
  type Frequency,
  type InstanceStatus,
  type PlanView,
} from './audit-plan.constants';

export interface AuditPlanOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: AuditPlanOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Months & days ────────────────────────────────────────────────────── */

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const DAY_OF_WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const AUDIT_PLAN_STATUS_OPTIONS: AuditPlanOption<AuditPlanStatus>[] = [
  { label: 'Draft',       value: AuditPlanStatuses.Draft      },
  { label: 'Planned',     value: AuditPlanStatuses.Planned    },
  { label: 'In Progress', value: AuditPlanStatuses.InProgress },
  { label: 'Overdue',     value: AuditPlanStatuses.Overdue    },
  { label: 'Completed',   value: AuditPlanStatuses.Completed  },
  { label: 'On Hold',     value: AuditPlanStatuses.OnHold     },
  { label: 'Cancelled',   value: AuditPlanStatuses.Cancelled  },
];

/** Frequency wording on the calendar views (Annual Overview, calendar, scope detail, …). */
export const FREQUENCY_OPTIONS: AuditPlanOption<Frequency>[] = [
  { label: 'Weekly',      value: Frequencies.Weekly     },
  { label: 'Bi-weekly',   value: Frequencies.BiWeekly   },
  { label: 'Monthly',     value: Frequencies.Monthly    },
  { label: 'Quarterly',   value: Frequencies.Quarterly  },
  { label: 'Half-yearly', value: Frequencies.HalfYearly },
  { label: 'Yearly',      value: Frequencies.Yearly     },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const AUDIT_PLAN_STATUS_LABELS = toLabelMap(AUDIT_PLAN_STATUS_OPTIONS);

export const FREQ_LABELS = toLabelMap(FREQUENCY_OPTIONS);

/** Frequency wording on the plan list / plan-view drawer / dashboard. */
export const PLAN_FREQ_LABELS: Record<Frequency, string> = {
  ...FREQ_LABELS,
  [Frequencies.BiWeekly]: 'Bi-Weekly',
  [Frequencies.HalfYearly]: 'Half-Yearly',
};

/** Saturated accent per frequency (stripes, chip borders). */
export const FREQ_COLOR: Record<Frequency, string> = {
  [Frequencies.Weekly]: '#7A5AF8',
  [Frequencies.BiWeekly]: '#D6409F',
  [Frequencies.Monthly]: '#12A594',
  [Frequencies.Quarterly]: '#3E63DD',
  [Frequencies.HalfYearly]: '#AD7F58',
  [Frequencies.Yearly]: '#64748B',
};

export interface StatusMeta {
  label: string;
  mark: string;
  /** css class suffix, e.g. 'completed' -> .st-completed */
  cls: InstanceStatus;
}

export const STATUS_META: Record<InstanceStatus, StatusMeta> = {
  [InstanceStatuses.Completed]:  { label: 'Completed',   mark: '✓', cls: InstanceStatuses.Completed  },
  [InstanceStatuses.InProgress]: { label: 'In progress', mark: '…', cls: InstanceStatuses.InProgress },
  [InstanceStatuses.Planned]:    { label: 'Planned',     mark: '',  cls: InstanceStatuses.Planned    },
  [InstanceStatuses.Overdue]:    { label: 'Overdue',     mark: '!', cls: InstanceStatuses.Overdue    },
};

/** Mark shown for a job/instance whose status has none (planned). */
export const STATUS_MARK_FALLBACK = '▸';

/** Mark shown in an unscheduled (ghost) month. */
export const UNSCHEDULED_MARK = '·';

/** Plan status wording on the auditor dashboard ("My Assigned Audits"). */
export const AUDITOR_PLAN_STATUS_LABELS: Record<AuditPlanStatus, string> = {
  [AuditPlanStatuses.Draft]: 'Not Started',
  [AuditPlanStatuses.Planned]: 'Not Started',
  [AuditPlanStatuses.InProgress]: 'In Progress',
  [AuditPlanStatuses.Overdue]: 'Overdue',
  [AuditPlanStatuses.Completed]: 'Completed',
  [AuditPlanStatuses.OnHold]: 'Pending',
  [AuditPlanStatuses.Cancelled]: 'Cancelled',
};

/** Audit phase shown on the auditor dashboard, by plan status. */
export const AUDITOR_PLAN_PHASE_LABELS: Record<AuditPlanStatus, string> = {
  [AuditPlanStatuses.Draft]: 'Planning',
  [AuditPlanStatuses.Planned]: 'Planning',
  [AuditPlanStatuses.InProgress]: 'Fieldwork',
  [AuditPlanStatuses.Overdue]: 'Fieldwork',
  [AuditPlanStatuses.Completed]: 'Reporting',
  [AuditPlanStatuses.OnHold]: 'Fieldwork',
  [AuditPlanStatuses.Cancelled]: 'Cancelled',
};

/** Prefix of each active-filter chip on the Audit Plans page. */
export const AUDIT_PLAN_FILTER_CHIP_LABELS: Record<AuditPlanFilterKey, string> = {
  [AuditPlanFilterKeys.Organizations]: 'Company',
  [AuditPlanFilterKeys.Divisions]: 'Division',
  [AuditPlanFilterKeys.SubDivisions]: 'Sub-Division',
  [AuditPlanFilterKeys.Statuses]: 'Status',
  [AuditPlanFilterKeys.Years]: 'Year',
};

/** Level tabs of the Audit Plan page. */
export const PLAN_LEVEL_TABS: { id: PlanView; num: number; label: string }[] = [
  { id: PlanViews.Annual,      num: 1, label: 'Annual Overview'   },
  { id: PlanViews.Calendar,    num: 2, label: 'Month Calendar'    },
  { id: PlanViews.Departments, num: 3, label: 'Sub-Division View' },
  { id: PlanViews.Scope,       num: 4, label: 'Scope Detail'      },
  { id: PlanViews.Log,         num: 5, label: 'Execution Log'     },
];

/** Chart config of the dashboard's plan-status pie (fixed order + colour). */
export const AUDIT_PLAN_STATUS_PIE_CONFIG: { key: AuditPlanStatus; label: string; color: string }[] = [
  { key: AuditPlanStatuses.InProgress, label: 'In Progress', color: '#2a78d6' },
  { key: AuditPlanStatuses.Planned,    label: 'Planned',     color: '#898781' },
  { key: AuditPlanStatuses.Completed,  label: 'Completed',   color: '#0ca30c' },
  { key: AuditPlanStatuses.Overdue,    label: 'Overdue',     color: '#d03b3b' },
  { key: AuditPlanStatuses.OnHold,     label: 'On Hold',     color: '#fab219' },
  { key: AuditPlanStatuses.Cancelled,  label: 'Cancelled',   color: '#ec835a' },
  { key: AuditPlanStatuses.Draft,      label: 'Draft',       color: '#4a3aa7' },
];

/* ── CSS classes ──────────────────────────────────────────────────────── */

/** Plan-view drawer hero badge, by plan status. */
export const AUDIT_PLAN_STATUS_HERO_BADGE: Record<AuditPlanStatus, string> = {
  [AuditPlanStatuses.Draft]: 'badge--grey',
  [AuditPlanStatuses.Planned]: 'badge--blue',
  [AuditPlanStatuses.InProgress]: 'badge--amber',
  [AuditPlanStatuses.Overdue]: 'badge--red',
  [AuditPlanStatuses.Completed]: 'badge--green',
  [AuditPlanStatuses.OnHold]: 'badge--orange',
  [AuditPlanStatuses.Cancelled]: 'badge--grey',
};
export const AUDIT_PLAN_STATUS_HERO_BADGE_DEFAULT = 'badge--blue';

/** Plan-view drawer status chip, by plan status. */
export const AUDIT_PLAN_STATUS_CHIP_CLASS: Record<AuditPlanStatus, string> = {
  [AuditPlanStatuses.Draft]: 'status-chip--draft',
  [AuditPlanStatuses.Planned]: 'status-chip--planned',
  [AuditPlanStatuses.InProgress]: 'status-chip--in-progress',
  [AuditPlanStatuses.Overdue]: 'status-chip--overdue',
  [AuditPlanStatuses.Completed]: 'status-chip--completed',
  [AuditPlanStatuses.OnHold]: 'status-chip--on-hold',
  [AuditPlanStatuses.Cancelled]: 'status-chip--cancelled',
};
export const AUDIT_PLAN_STATUS_CHIP_CLASS_DEFAULT = 'status-chip--draft';

/** Upcoming-audits table: status text + class of a planned instance. */
export const UPCOMING_AUDIT_STATUS = {
  Label: 'Planned',
  Class: InstanceStatuses.Planned,
} as const;

/* ── Theme-token palettes (inline styles, theme-reactive) ─────────────────
 * Reference the stc-x / st-x-bg / st-x-tx tokens declared on the audit-plan
 * shell host, so these follow the light/dark theme. */

export const STATUS_SOLID_VARS: Record<InstanceStatus, string> = {
  [InstanceStatuses.Completed]: 'var(--stc-completed)',
  [InstanceStatuses.Planned]: 'var(--stc-planned)',
  [InstanceStatuses.InProgress]: 'var(--stc-inprog)',
  [InstanceStatuses.Overdue]: 'var(--stc-overdue)',
};

export const STATUS_BG_VARS: Record<InstanceStatus, string> = {
  [InstanceStatuses.Completed]: 'var(--st-completed-bg)',
  [InstanceStatuses.Planned]: 'var(--st-planned-bg)',
  [InstanceStatuses.InProgress]: 'var(--st-inprog-bg)',
  [InstanceStatuses.Overdue]: 'var(--st-overdue-bg)',
};

export const STATUS_TX_VARS: Record<InstanceStatus, string> = {
  [InstanceStatuses.Completed]: 'var(--st-completed-tx)',
  [InstanceStatuses.Planned]: 'var(--st-planned-tx)',
  [InstanceStatuses.InProgress]: 'var(--st-inprog-tx)',
  [InstanceStatuses.Overdue]: 'var(--st-overdue-tx)',
};

/** Solid tokens with light-palette fallbacks (sub-division mini-calendar borders). */
export const STATUS_BORDER_VARS: Record<InstanceStatus, string> = {
  [InstanceStatuses.Completed]: 'var(--stc-completed, #B9D89A)',
  [InstanceStatuses.Planned]: 'var(--stc-planned, #A8CBEF)',
  [InstanceStatuses.InProgress]: 'var(--stc-inprog, #F0CE9A)',
  [InstanceStatuses.Overdue]: 'var(--stc-overdue, #F0AFAF)',
};

/* ── Icons ────────────────────────────────────────────────────────────── */

/** Sort-arrow icon classes of the list view's column headers ('' when unsorted). */
export const AUDIT_PLAN_SORT_ICONS = {
  Unsorted: '',
  [AuditPlanSortDirections.Asc]: 'pi-arrow-up',
  [AuditPlanSortDirections.Desc]: 'pi-arrow-down',
} as const satisfies Record<'Unsorted' | AuditPlanSortDirection, string>;

/** Activate / deactivate button icon on the list and grid. */
export const AUDIT_PLAN_ACTIVE_ICONS = {
  Deactivate: 'pi pi-ban',
  Activate: 'pi pi-check-circle',
} as const;

/** Scope job-list toggle caret on the plan-view drawer. */
export const AUDIT_PLAN_CARET_ICONS = {
  Open: 'pi-chevron-down',
  Closed: 'pi-chevron-right',
} as const;
