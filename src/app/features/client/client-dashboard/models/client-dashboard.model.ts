export type UserRole = 'CFO' | 'SUB_DIVISION_HEAD';

// 'Under Review' | 'Reopened' | 'Completed' added to match the real RFI statuses used by
// rfi-static-data.ts / rfi-client-list.component.ts, which client-dashboard.component.ts now
// mirrors. 'Submitted' | 'Draft' | 'Not started' are kept in case other RfiItem producers
// still rely on them — only additive here to avoid breaking code outside this component.
export type RfiStatus = 'Overdue' | 'Pending' | 'Submitted' | 'Draft' | 'Not started' | 'Under Review' | 'Reopened' | 'Completed';
// 'Overdue' | 'Planned' added additively to match audit-scope-summary.component.ts's real
// 5-value workflow status vocabulary now that this dashboard's Scope tab reads live scope data
// (previously only 3 of these ever occurred in practice).
export type ScopeStatus = 'On track' | 'In progress' | 'At risk' | 'Delayed' | 'Completed' | 'Not started' | 'Pending' | 'Overdue' | 'Planned';
export type NotifSeverity = 'danger' | 'warn' | 'info' | 'secondary';
export type AvatarColor = 'blue' | 'teal' | 'amber';

export interface KpiCard {
  key: string;
  label: string;
  value: string | number;
  sub: string;
  subColor: 'danger' | 'warning' | 'success' | 'muted';
  icon: string;
  /** True when clicking the card navigates to a filtered detail list. */
  clickable?: boolean;
}

/** Scope summary counts for the current role. */
export interface ScopeStats {
  total: number;
  completed: number;
  onTrack: number;
  atRisk: number;
  avgProgress: number;
}

/** The dashboard's 5-status RFI breakdown for the current role. */
export interface RfiBreakdown {
  pending: number;
  overdue: number;
  underReview: number;
  reopened: number;
  completed: number;
}

export interface ScopeItem {
  name: string;
  progress: number;
  status: ScopeStatus;
  subDivision?: string;
  /** Division the scope belongs to (display name). */
  division?: string;
  /** True for a division-level scope — it sits directly under its division, not under a sub-division. */
  divisionLevel?: boolean;
  /** The sub-division the scope sits under; unset for a division-level scope. */
  ownSubDivision?: string;
}

export interface RfiItem {
  id: string;
  title: string;
  subDivision: string;
  dueDate: Date;
  assignee: string;
  status: RfiStatus;
}

export interface AuditNotification {
  title: string;
  description: string;
  date: Date;
  severity: NotifSeverity;
  read: boolean;
}

export type UpcomingAuditStatus = 'In Progress' | 'Planned' | 'Completed' | 'Overdue';

export interface UpcomingAudit {
  name: string;
  subDivision: string;
  assignee: string;
  date: Date;
  status: UpcomingAuditStatus;
}

export interface ReportItem {
  name: string;
  uploadedDate: Date;
  fileSize: string;
  status: 'draft' | 'final';
}

export interface Message {
  sender: string;
  initials: string;
  text: string;
  time: string;
  unread: boolean;
  avatarColor: AvatarColor;
}