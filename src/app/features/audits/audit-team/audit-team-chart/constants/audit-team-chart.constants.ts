/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * in the mock tree stay assignable to the derived types below.
 */

/** Logical role of a team member — used for drag & drop validation. */
export const AuditRoles = {
  CAE: 'CAE',
  AuditManager: 'AuditManager',
  SeniorAuditor: 'SeniorAuditor',
  StaffAuditor: 'StaffAuditor',
} as const;
export type AuditRole = typeof AuditRoles[keyof typeof AuditRoles];

/** Color "tier" used for the colored badge on the top-right of each card. */
export const RiskTiers = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type RiskTier = typeof RiskTiers[keyof typeof RiskTiers];

/** Tier of the workload bar on each card / list row. */
export const WorkloadTiers = {
  Low: 'low',
  Mid: 'mid',
  High: 'high',
} as const;
export type WorkloadTier = typeof WorkloadTiers[keyof typeof WorkloadTiers];

/** Chart / list toggle on the audit team chart page. */
export const AuditTeamChartViewModes = {
  Chart: 'chart',
  List: 'list',
} as const;
export type AuditTeamChartViewMode = typeof AuditTeamChartViewModes[keyof typeof AuditTeamChartViewModes];

/** Block / unblock action shown in the confirmation dialog. */
export const AuditTeamBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type AuditTeamBlockAction = typeof AuditTeamBlockActions[keyof typeof AuditTeamBlockActions];

/** Mode the Add/Edit member drawer is opened in from the chart. */
export const AuditTeamMemberDrawerModes = {
  Edit: 'edit',
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const AUDIT_TEAM_CHART_DRAWER = {
  ProfileWidth: '760px',
  MemberFormWidth: '769px',
} as const;

export const AUDIT_TEAM_CHART_SEARCH_DEBOUNCE_MS = 200;

/** Workload % at or above which the bar shows the given tier. */
export const WORKLOAD_THRESHOLDS = {
  High: 80,
  Mid: 50,
} as const;

/** Mousedown targets that must keep working while Pan Mode is on. */
export const PAN_IGNORE_SELECTOR = 'button, input, a, .p-select, .p-node-toggler';

/** CSS hooks used by the grab-to-pan highlight. */
export const NODE_CARD_SELECTOR = '.node-card';
export const NODE_CARD_PAN_HIGHLIGHT_CLASS = 'node-card--pan-highlight';

export const DEFAULT_MEMBER_AVATAR_URL = 'images/avatars/default-avatar.jpg';
