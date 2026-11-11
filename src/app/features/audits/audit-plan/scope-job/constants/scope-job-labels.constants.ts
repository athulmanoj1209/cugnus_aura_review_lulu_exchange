/* ── Dropdown options, display labels, icons & severities for scope-job values
 * The label maps used across the list / profile / edit / status-update
 * screens are derived from the dropdown options below, so a code always
 * resolves to the same text everywhere.
 */

import {
  ScopeJobControlRatings,
  ScopeJobFilterKeys,
  ScopeJobFrequencies,
  ScopeJobModesOfAudit,
  ScopeJobOverallRatings,
  ScopeJobSortDirections,
  ScopeJobStatuses,
  ScopeTaskPriorities,
  ScopeTaskStatuses,
  SubScopeRisks,
  type ScopeJobControlRating,
  type ScopeJobFilterKey,
  type ScopeJobFrequency,
  type ScopeJobModeOfAudit,
  type ScopeJobOverallRating,
  type ScopeJobSortDirection,
  type ScopeJobStatus,
  type ScopeTaskPriority,
  type ScopeTaskStatus,
  type SubScopeRisk,
} from './scope-job.constants';

export type ScopeJobTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

export interface ScopeJobOption<T = string> {
  label: string;
  value: T;
}

/** Card option (status / rating pickers) with a description and icon. */
export interface ScopeJobCardOption<T = string> extends ScopeJobOption<T> {
  desc: string;
  icon: string;
}

const toLabelMap = <T extends string>(options: ScopeJobOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const SCOPE_JOB_STATUS_OPTIONS: ScopeJobOption<ScopeJobStatus>[] = [
  { label: 'Pending',     value: ScopeJobStatuses.Pending    },
  { label: 'In Progress', value: ScopeJobStatuses.InProgress },
  { label: 'Completed',   value: ScopeJobStatuses.Completed  },
  { label: 'Overdue',     value: ScopeJobStatuses.Overdue    },
];

export const SCOPE_JOB_FREQUENCY_OPTIONS: ScopeJobOption<ScopeJobFrequency>[] = [
  { label: 'Monthly',   value: ScopeJobFrequencies.Monthly   },
  { label: 'Quarterly', value: ScopeJobFrequencies.Quarterly },
  { label: 'Annually',  value: ScopeJobFrequencies.Annually  },
];

export const SCOPE_JOB_MODE_OF_AUDIT_OPTIONS: ScopeJobOption<ScopeJobModeOfAudit>[] = [
  { label: 'Full',       value: ScopeJobModesOfAudit.Full       },
  { label: 'Limited',    value: ScopeJobModesOfAudit.Limited    },
  { label: 'Thematic',   value: ScopeJobModesOfAudit.Thematic   },
  { label: 'Follow-up',  value: ScopeJobModesOfAudit.FollowUp   },
  { label: 'Continuous', value: ScopeJobModesOfAudit.Continuous },
];

export const SCOPE_TASK_STATUS_OPTIONS: ScopeJobOption<ScopeTaskStatus>[] = [
  { label: 'Open',        value: ScopeTaskStatuses.Open       },
  { label: 'In Progress', value: ScopeTaskStatuses.InProgress },
  { label: 'Completed',   value: ScopeTaskStatuses.Completed  },
  { label: 'Overdue',     value: ScopeTaskStatuses.Overdue    },
];

export const SCOPE_TASK_PRIORITY_OPTIONS: ScopeJobOption<ScopeTaskPriority>[] = [
  { label: 'Low',      value: ScopeTaskPriorities.Low      },
  { label: 'Medium',   value: ScopeTaskPriorities.Medium   },
  { label: 'High',     value: ScopeTaskPriorities.High     },
  { label: 'Critical', value: ScopeTaskPriorities.Critical },
];

export const SCOPE_JOB_CONTROL_RATING_OPTIONS: (ScopeJobOption<ScopeJobControlRating> & { icon: string })[] = [
  { label: 'Strong',   value: ScopeJobControlRatings.Strong,   icon: 'pi-shield'               },
  { label: 'Moderate', value: ScopeJobControlRatings.Moderate, icon: 'pi-minus-circle'         },
  { label: 'Weak',     value: ScopeJobControlRatings.Weak,     icon: 'pi-exclamation-triangle' },
];

export const SCOPE_JOB_CHECKLIST_ITEM_OPTIONS: ScopeJobOption[] = [
  { label: 'Verify authorization controls', value: 'auth_controls'      },
  { label: 'Review access logs',            value: 'access_logs'        },
  { label: 'Test password policies',        value: 'password_policies'  },
  { label: 'Check segregation of duties',   value: 'segregation_duties' },
  { label: 'Validate data retention',       value: 'data_retention'     },
  { label: 'Confirm backup procedures',     value: 'backup_procedures'  },
  { label: 'Review audit trail',            value: 'audit_trail'        },
  { label: 'Verify user access rights',     value: 'user_access'        },
  { label: 'Test change management',        value: 'change_mgmt'        },
  { label: 'Review incident reports',       value: 'incident_reports'   },
];

/** Auditor / reviewer pickers on the Edit Scope Job drawer. */
export const SCOPE_JOB_PERSON_OPTIONS: ScopeJobOption[] = [
  { label: 'Alice Johnson', value: 'alice' },
  { label: 'Bob Smith',     value: 'bob'   },
  { label: 'Carol White',   value: 'carol' },
  { label: 'David Lee',     value: 'david' },
  { label: 'Emma Davis',    value: 'emma'  },
  { label: 'Frank Miller',  value: 'frank' },
  { label: 'Grace Wilson',  value: 'grace' },
  { label: 'Henry Brown',   value: 'henry' },
];

/** Status cards on the status-update drawer (job target). */
export const SCOPE_JOB_STATUS_UPDATE_OPTIONS: ScopeJobCardOption<ScopeJobStatus>[] = [
  { value: ScopeJobStatuses.Pending,    label: 'Pending',     desc: 'Not yet started',            icon: 'pi-clock'              },
  { value: ScopeJobStatuses.InProgress, label: 'In Progress', desc: 'Currently being worked on',  icon: 'pi-spin pi-spinner'    },
  { value: ScopeJobStatuses.Completed,  label: 'Completed',   desc: 'All tasks finished',          icon: 'pi-check-circle'       },
  { value: ScopeJobStatuses.Overdue,    label: 'Overdue',     desc: 'Past deadline, needs action', icon: 'pi-exclamation-circle' },
];

/** Status cards on the status-update drawer (task target). */
export const SCOPE_TASK_STATUS_UPDATE_OPTIONS: ScopeJobCardOption<ScopeTaskStatus>[] = [
  { value: ScopeTaskStatuses.Open,       label: 'Open',        desc: 'Task is queued',  icon: 'pi-circle'             },
  { value: ScopeTaskStatuses.InProgress, label: 'In Progress', desc: 'Being worked on', icon: 'pi-spin pi-spinner'    },
  { value: ScopeTaskStatuses.Completed,  label: 'Completed',   desc: 'Task is finished', icon: 'pi-check-circle'      },
  { value: ScopeTaskStatuses.Overdue,    label: 'Overdue',     desc: 'Past due date',   icon: 'pi-exclamation-circle' },
];

export const SCOPE_JOB_OVERALL_RATING_OPTIONS: ScopeJobCardOption<ScopeJobOverallRating>[] = [
  { value: ScopeJobOverallRatings.Satisfactory,     label: 'Satisfactory',      desc: 'Audit met all expectations',           icon: 'pi-check-circle'       },
  { value: ScopeJobOverallRatings.NeedsImprovement, label: 'Needs Improvement', desc: 'Some areas require further attention', icon: 'pi-exclamation-circle' },
  { value: ScopeJobOverallRatings.Unsatisfactory,   label: 'Unsatisfactory',    desc: 'Did not meet required standards',      icon: 'pi-times-circle'       },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const SCOPE_JOB_STATUS_LABELS = toLabelMap(SCOPE_JOB_STATUS_OPTIONS);

export const SCOPE_JOB_FREQUENCY_LABELS = toLabelMap(SCOPE_JOB_FREQUENCY_OPTIONS);

export const SCOPE_JOB_MODE_OF_AUDIT_LABELS = toLabelMap(SCOPE_JOB_MODE_OF_AUDIT_OPTIONS);

export const SCOPE_TASK_STATUS_LABELS = toLabelMap(SCOPE_TASK_STATUS_OPTIONS);

export const SCOPE_TASK_PRIORITY_LABELS = toLabelMap(SCOPE_TASK_PRIORITY_OPTIONS);

export const SCOPE_JOB_CONTROL_RATING_LABELS = toLabelMap(SCOPE_JOB_CONTROL_RATING_OPTIONS);

/** Auditor / reviewer id → display name. */
export const SCOPE_JOB_PERSON_NAMES: Record<string, string> = toLabelMap(SCOPE_JOB_PERSON_OPTIONS);

export const SUBSCOPE_RISK_LABELS: Record<SubScopeRisk, string> = {
  [SubScopeRisks.High]: 'High',
  [SubScopeRisks.Medium]: 'Medium',
  [SubScopeRisks.Low]: 'Low',
};

/** Task status wording on the auditor dashboard's "My Tasks" table. */
export const SCOPE_TASK_DASHBOARD_STATUS_LABELS: Record<ScopeTaskStatus, string> = {
  open: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
};

/** Prefix of each active-filter chip on the Scope Jobs page. */
export const SCOPE_JOB_FILTER_CHIP_LABELS: Record<ScopeJobFilterKey, string> = {
  [ScopeJobFilterKeys.Scopes]: 'Scope',
  [ScopeJobFilterKeys.Statuses]: 'Status',
  [ScopeJobFilterKeys.Frequencies]: 'Frequency',
  [ScopeJobFilterKeys.Companies]: 'Company',
  [ScopeJobFilterKeys.Divisions]: 'Division',
  [ScopeJobFilterKeys.SubDivisions]: 'Sub-Division',
  [ScopeJobFilterKeys.Auditors]: 'Auditor',
  [ScopeJobFilterKeys.Period]: 'Period range',
};

/** Fallback role shown on the profile drawer's personnel cards. */
export const SCOPE_JOB_DEFAULT_ROLES = {
  Auditor: 'Auditor',
  Reviewer: 'Reviewer',
} as const;

/* ── Severities & icons ───────────────────────────────────────────────── */

export const SCOPE_JOB_STATUS_SEVERITY: Record<ScopeJobStatus, ScopeJobTagSeverity> = {
  pending: 'secondary',
  in_progress: 'info',
  completed: 'success',
  overdue: 'danger',
};

export const SCOPE_TASK_STATUS_ICONS: Record<ScopeTaskStatus, string> = {
  open: 'pi-circle',
  in_progress: 'pi-spin pi-spinner',
  completed: 'pi-check-circle',
  overdue: 'pi-exclamation-circle',
};

export const SCOPE_JOB_CONTROL_RATING_ICONS: Record<ScopeJobControlRating, string> =
  Object.fromEntries(SCOPE_JOB_CONTROL_RATING_OPTIONS.map(o => [o.value, o.icon])) as Record<ScopeJobControlRating, string>;

/** Sort-arrow icon classes of the list view's column headers. */
export const SCOPE_JOB_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  [ScopeJobSortDirections.Asc]: 'pi-sort-amount-up',
  [ScopeJobSortDirections.Desc]: 'pi-sort-amount-down',
} as const satisfies Record<'Unsorted' | ScopeJobSortDirection, string>;

/* ── Mock task templates ──────────────────────────────────────────────── */

/** Tasks generated for every scope job (first N, see SCOPE_JOB_MOCK_TASK_COUNT). */
export const SCOPE_TASK_TEMPLATES: { title: string; description: string; priority: ScopeTaskPriority }[] = [
  { title: 'Planning & Scoping',       description: 'Define audit scope, objectives, and risk areas for the period.',       priority: 'high'   },
  { title: 'Risk Assessment',          description: 'Identify and evaluate inherent and control risks.',                    priority: 'high'   },
  { title: 'Control Walkthrough',      description: 'Walk through key internal controls with process owners.',              priority: 'medium' },
  { title: 'Fieldwork Execution',      description: 'Perform substantive testing and evidence collection.',                 priority: 'high'   },
  { title: 'Evidence Documentation',   description: 'Document all working papers and audit evidence in the repository.',    priority: 'medium' },
  { title: 'Control Testing',          description: 'Test design and operating effectiveness of selected controls.',        priority: 'medium' },
  { title: 'Draft Report Preparation', description: 'Prepare draft findings, recommendations, and management responses.',  priority: 'medium' },
  { title: 'Management Review',        description: 'Obtain management sign-off on draft findings and action plans.',      priority: 'low'    },
  { title: 'Final Report Issuance',    description: 'Issue the final audit report to relevant stakeholders.',               priority: 'low'    },
  { title: 'Follow-up & Closure',      description: 'Track implementation of management action plans and close findings.', priority: 'low'    },
];
