/** View modes supported by the department-head audit team chart. */
export const DeptHeadAuditTeamChartViewModes = {
  Chart: 'chart',
  List: 'list'
} as const;
export type DeptHeadAuditTeamChartViewMode =
  (typeof DeptHeadAuditTeamChartViewModes)[keyof typeof DeptHeadAuditTeamChartViewModes];

export const DEPT_HEAD_AUDIT_TEAM_CHART_ZOOM = {
  Min: 0.25,
  Max: 3,
  Step: 0.1,
  Initial: 0.7,
  Reset: 0.6
} as const;

export const DEPT_HEAD_AUDIT_TEAM_CHART_DEFAULTS = {
  ExternalAuditDivision: 'DXB',
  ExternalAuditSubDivision: 'Finance',
  InternalAuditSubDivision: 'Finance',
  DarExchangeDivision: 'DAR-BR-03',
  XyzBroadcastDivision: 'XYZ-BR-01'
} as const;

