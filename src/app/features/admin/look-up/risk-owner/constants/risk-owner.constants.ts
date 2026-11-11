/** Values and UI configuration owned by the risk-owner lookup module. */
export const RiskOwnerStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type RiskOwnerStatus = typeof RiskOwnerStatuses[keyof typeof RiskOwnerStatuses];

export const RiskOwnerModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type RiskOwnerMode = typeof RiskOwnerModes[keyof typeof RiskOwnerModes];

export const RiskOwnerSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RiskOwnerSortDirection = typeof RiskOwnerSortDirections[keyof typeof RiskOwnerSortDirections];

export const RISK_OWNER_PAGE_SIZE = 10;
export const RISK_OWNER_DESCRIPTION_MAX_LENGTH = 500;
