/* ── Tag severities, colours, display maps & mock data ────────────────────
 * Translated text ($localize) stays in the components; only the
 * non-translated mappings live here.
 */

import type { RfiStatus } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';
import type { PendingStatus } from '@/app/features/admin/review/execution-requests/list/execution-requests-list.component';
import type { ObservationStatus } from '@/app/features/audits/audit-execution/observation/list/observation-list.component';

export type DashboardTagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';
export const DASHBOARD_DEFAULT_SEVERITY: DashboardTagSeverity = 'secondary';

/* ── Chart colours ────────────────────────────────────────────────────── */

export const DASHBOARD_COLORS = {
  Red: '#ef4444',
  RedHover: '#dc2626',
  Amber: '#f59e0b',
  AmberHover: '#d97706',
  Green: '#22c55e',
  GreenHover: '#16a34a',
  Blue: '#3b82f6',
  BlueHover: '#2563eb',
  Slate: '#94a3b8',
  SlateHover: '#64748b',
  Gray: '#64748b',
  GrayHover: '#475569',
  Violet: '#8b5cf6',
  White: '#ffffff',
  BlueFill: 'rgba(59, 130, 246, 0.1)',
  HoverBand: 'rgba(148, 163, 184, 0.12)',
} as const;

/** Theme-aware (CSS variable) colours for inline-styled bars. */
export const DASHBOARD_THEME_COLORS = {
  Green: 'var(--p-green-500)',
  Blue: 'var(--p-blue-500)',
  Orange: 'var(--p-orange-500)',
} as const;

/** High / Medium / Low bar colours on the "by risk" charts. */
export const RISK_BAR_COLORS: string[] = [DASHBOARD_COLORS.Red, DASHBOARD_COLORS.Amber, DASHBOARD_COLORS.Green];

/** Fallbacks when a CSS theme variable can't be read (Chart.js needs real colours). */
export const DASHBOARD_THEME_FALLBACKS = {
  SurfaceCard: '#ffffff',
  SurfaceBorder: '#e2e8f0',
  Text: '#0f172a',
  TextSecondary: '#64748b',
} as const;

/* ── Tag severities ───────────────────────────────────────────────────── */

export const FINDING_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Draft': 'secondary', 'Submitted': 'info', 'Under Review': 'warn',
  'Approved': 'success', 'Rejected': 'danger', 'Sent to Client': 'info',
  'Management Response Received': 'success', 'Closed': 'secondary',
};

export const RISK_SEVERITY: Record<string, DashboardTagSeverity> = {
  Critical: 'danger', High: 'danger', Medium: 'warn', Low: 'success',
};

export const EVIDENCE_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Requested': 'info', 'Uploaded': 'info', 'Under Review': 'warn',
  'Rejected': 'danger', 'Accepted': 'success',
};

export const OBSERVATION_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Open': 'danger', 'Under Review': 'warn', 'Resolved': 'success',
};

export const COMMENT_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Pending': 'warn', 'In Progress': 'info', 'Resolved': 'success', 'Closed': 'secondary',
};

export const SCOPE_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Completed': 'success', 'In Progress': 'info', 'In Review': 'info',
  'Pending': 'secondary', 'Not Started': 'secondary', 'Overdue': 'danger',
};

export const PRIORITY_SEVERITY: Record<string, DashboardTagSeverity> = {
  High: 'danger', Medium: 'warn', Low: 'info',
};

export const WORKING_PAPER_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Draft': 'secondary', 'In Progress': 'info', 'Submitted': 'info',
  'Returned': 'warn', 'Approved': 'success',
};

export const REVIEWER_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Approved': 'success', 'Under Review': 'info', 'Pending': 'warn',
  'Returned': 'danger', '-': 'secondary',
};

export const RFI_LIST_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Draft': 'secondary', 'Sent': 'info', 'Client Responded': 'success',
  'Auditor Reviewed': 'success', 'Reopened': 'warn', 'Pending Client': 'info',
  'Overdue': 'danger', 'Closed': 'secondary',
};

export const APPROVAL_TYPE_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Evidence': 'info', 'Finding': 'danger', 'Observation': 'warn',
};

export const REVIEW_STATUS_SEVERITY: Record<string, DashboardTagSeverity> = {
  'Pending Review': 'info', 'Pending Approval': 'warn', 'Submitted': 'secondary',
};

/** Notification tone. */
export const NotificationTones = {
  Danger: 'danger',
  Warn: 'warn',
  Success: 'success',
  Info: 'info',
} as const;

export const NOTIFICATION_ICONS = {
  System: 'pi pi-bell',
  User: 'pi pi-user',
} as const;

/* ── Display labels (internal keys, also matched by the $localize switches) ─ */

/** RFI status → label on the "RFI List" table. */
export const RFI_LIST_STATUS_LABELS: Record<RfiStatus, string> = {
  pending: 'Pending Client',
  'under-review': 'Client Responded',
  overdue: 'Overdue',
  completed: 'Closed',
  reopened: 'Reopened',
};

/** Pending-approvals queue status → label on the Reviews tab. */
export const PENDING_STATUS_LABELS: Record<PendingStatus, string> = {
  pending_review: 'Pending Review',
  pending_approval: 'Pending Approval',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
};

/**
 * Pending-approvals queue status → closest Observation review status, so a
 * card sourced from that queue can still be opened in the Observation
 * drawer. ObservationStatus has no 'rejected' value, so a rejected pending
 * item falls back to 'draft' — sent back for rework, the same treatment
 * already given to the (oddly-named) 'submitted' PendingStatus.
 */
export const PENDING_TO_OBSERVATION_STATUS: Record<PendingStatus, ObservationStatus> = {
  pending_review: 'submitted',
  pending_approval: 'reviewed',
  submitted: 'draft',
  approved: 'approved',
  rejected: 'draft',
};

/* ── Overview tab: deadline type icons ────────────────────────────────── */

export const DEADLINE_TYPE_CONFIG: Record<string, { icon: string; cls: string }> = {
  'Working Paper':   { icon: 'pi pi-file-edit',           cls: 'type--working-paper' },
  'RFI Response':    { icon: 'pi pi-reply',               cls: 'type--rfi' },
  'Scope Testing':   { icon: 'pi pi-check-circle',        cls: 'type--scope' },
  'Evidence':        { icon: 'pi pi-paperclip',           cls: 'type--evidence' },
  'Finding':         { icon: 'pi pi-exclamation-circle',  cls: 'type--finding' },
  'Fieldwork':       { icon: 'pi pi-pencil',              cls: 'type--fieldwork' },
  'Review Comment':  { icon: 'pi pi-comment',             cls: 'type--review' },
  'Risk Assessment': { icon: 'pi pi-shield',              cls: 'type--risk' },
  'Audit Report':    { icon: 'pi pi-file',                cls: 'type--audit-report' },
  'Checklist':       { icon: 'pi pi-list-check',          cls: 'type--checklist' },
  'Meeting':         { icon: 'pi pi-users',               cls: 'type--meeting' },
};
export const DEADLINE_TYPE_DEFAULT_CONFIG = { icon: 'pi pi-tag', cls: 'type--default' };

/* ── Mock data (no backing data model yet) ────────────────────────────── */

/** Task Status donut values (Not Started, In Progress, Completed, Overdue, Blocked). */
export const MOCK_TASK_STATUS_COUNTS = {
  NotStarted: 3,
  InProgress: 8,
  Completed: 15,
  Overdue: 2,
  Blocked: 1,
} as const;

/** "Scopes Completed" trend, weeks 1–4. */
export const MOCK_SCOPE_TREND_DATA: number[] = [1, 1, 2, 0];

/** Upcoming deadlines list on the Overview tab. */
export const MOCK_AUDITOR_DEADLINES = [
  { item: 'Submit Working Paper',         audit: 'Procurement',         dueDate: 'Today',    priority: 'High',   type: 'Working Paper' },
  { item: 'Respond to Review Comment',    audit: 'HR Audit',            dueDate: 'Tomorrow', priority: 'High',   type: 'Review Comment' },
  { item: 'Complete Scope Testing',       audit: 'IT Audit',            dueDate: '3 Jul',    priority: 'Medium', type: 'Scope Testing' },
  { item: 'Upload Evidence Files',        audit: 'Procurement',         dueDate: '5 Jul',    priority: 'Medium', type: 'Evidence' },
  { item: 'Submit RFI Response',          audit: 'Finance Audit',       dueDate: '7 Jul',    priority: 'Low',    type: 'RFI Response' },
  { item: 'Finalize Fieldwork Notes',     audit: 'Operations Audit',    dueDate: '8 Jul',    priority: 'Medium', type: 'Fieldwork' },
  { item: 'Raise Draft Finding',          audit: 'IT Audit',            dueDate: '9 Jul',    priority: 'High',   type: 'Finding' },
  { item: 'Review Sub-scope Checklist',   audit: 'HR Audit',            dueDate: '10 Jul',   priority: 'Medium', type: 'Checklist' },
  { item: 'Respond to Evidence Request',  audit: 'Finance Audit',       dueDate: '11 Jul',   priority: 'High',   type: 'Evidence' },
  { item: 'Submit Interim Audit Report',  audit: 'Procurement',         dueDate: '14 Jul',   priority: 'Low',    type: 'Audit Report' },
  { item: 'Complete Walkthrough Testing', audit: 'Inventory Audit',     dueDate: '15 Jul',   priority: 'High',   type: 'Scope Testing' },
  { item: 'Close Pending RFI',            audit: 'Compliance Audit',    dueDate: '16 Jul',   priority: 'Medium', type: 'RFI Response' },
  { item: 'Update Risk Assessment',       audit: 'Cybersecurity Audit', dueDate: '17 Jul',   priority: 'High',   type: 'Risk Assessment' },
  { item: 'Submit Scope Completion',      audit: 'Payroll Audit',       dueDate: '18 Jul',   priority: 'Medium', type: 'Scope Testing' },
  { item: 'Attend Exit Meeting',          audit: 'Warehouse Audit',     dueDate: '19 Jul',   priority: 'Low',    type: 'Meeting' },
];
