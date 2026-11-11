/** View modes supported by the CFO/client-head audit team chart. */
export const ClientHeadAuditTeamChartViewModes = {
  Chart: 'chart',
  List: 'list'
} as const;
export type ClientHeadAuditTeamChartViewMode =
  (typeof ClientHeadAuditTeamChartViewModes)[keyof typeof ClientHeadAuditTeamChartViewModes];

export const CLIENT_HEAD_AUDIT_TEAM_CHART_ZOOM = {
  Min: 0.25,
  Max: 3,
  Step: 0.1,
  Initial: 0.7,
  Reset: 0.6
} as const;

export const CLIENT_HEAD_AUDIT_TEAM_CHART_FILTER_DEFAULTS = {
  Division: null,
  SubDivision: null,
  Scope: null
} as const;

