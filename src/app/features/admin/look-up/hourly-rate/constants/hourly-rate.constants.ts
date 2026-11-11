/** Values and UI configuration owned by the hourly-rate lookup module. */
export const HourlyRateStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type HourlyRateStatus = typeof HourlyRateStatuses[keyof typeof HourlyRateStatuses];

export const HourlyRateModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type HourlyRateMode = typeof HourlyRateModes[keyof typeof HourlyRateModes];

export const HourlyRateSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type HourlyRateSortDirection = typeof HourlyRateSortDirections[keyof typeof HourlyRateSortDirections];

export const HOURLY_RATE_PAGE_SIZE = 10;
export const HOURLY_RATE_DESCRIPTION_MAX_LENGTH = 500;
