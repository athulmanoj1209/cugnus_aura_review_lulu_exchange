/** Values and UI configuration owned by the risk-category lookup module. */
export const RiskCategoryStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type RiskCategoryStatus = typeof RiskCategoryStatuses[keyof typeof RiskCategoryStatuses];

export const RiskCategoryModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type RiskCategoryMode = typeof RiskCategoryModes[keyof typeof RiskCategoryModes];

export const RiskCategorySortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RiskCategorySortDirection = typeof RiskCategorySortDirections[keyof typeof RiskCategorySortDirections];

export const RISK_CATEGORY_PAGE_SIZE = 10;
export const RISK_CATEGORY_DESCRIPTION_MAX_LENGTH = 500;
