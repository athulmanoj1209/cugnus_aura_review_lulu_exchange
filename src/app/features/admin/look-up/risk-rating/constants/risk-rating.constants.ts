/** Values and UI configuration owned by the risk-rating lookup module. */
export const RiskRatingStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type RiskRatingStatus = typeof RiskRatingStatuses[keyof typeof RiskRatingStatuses];

export const RiskRatingModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type RiskRatingMode = typeof RiskRatingModes[keyof typeof RiskRatingModes];

export const RiskRatingSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RiskRatingSortDirection = typeof RiskRatingSortDirections[keyof typeof RiskRatingSortDirections];

export const RISK_RATING_PAGE_SIZE = 10;
export const RISK_RATING_DESCRIPTION_MAX_LENGTH = 500;
