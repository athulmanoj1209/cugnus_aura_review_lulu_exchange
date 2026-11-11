/** Values and UI configuration owned by the risk-status lookup module. */
export const RiskStatusStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type RiskStatusStatus = typeof RiskStatusStatuses[keyof typeof RiskStatusStatuses];

export const RiskStatusModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type RiskStatusMode = typeof RiskStatusModes[keyof typeof RiskStatusModes];

export const RiskStatusSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RiskStatusSortDirection = typeof RiskStatusSortDirections[keyof typeof RiskStatusSortDirections];

export const RISK_STATUS_PAGE_SIZE = 10;
export const RISK_STATUS_DESCRIPTION_MAX_LENGTH = 500;
