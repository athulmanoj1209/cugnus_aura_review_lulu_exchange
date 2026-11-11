/** Values and UI configuration owned by the applicable-framework lookup module. */
export const ApplicableFrameworkStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type ApplicableFrameworkStatus = typeof ApplicableFrameworkStatuses[keyof typeof ApplicableFrameworkStatuses];

export const ApplicableFrameworkModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type ApplicableFrameworkMode = typeof ApplicableFrameworkModes[keyof typeof ApplicableFrameworkModes];

export const ApplicableFrameworkSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type ApplicableFrameworkSortDirection = typeof ApplicableFrameworkSortDirections[keyof typeof ApplicableFrameworkSortDirections];

export const APPLICABLE_FRAMEWORK_PAGE_SIZE = 10;
export const APPLICABLE_FRAMEWORK_DESCRIPTION_MAX_LENGTH = 500;
