/** Values and UI configuration owned by the scope-type lookup module. */
export const ScopeTypeStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type ScopeTypeStatus = typeof ScopeTypeStatuses[keyof typeof ScopeTypeStatuses];

export const ScopeTypeModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type ScopeTypeMode = typeof ScopeTypeModes[keyof typeof ScopeTypeModes];

export const ScopeTypeSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type ScopeTypeSortDirection = typeof ScopeTypeSortDirections[keyof typeof ScopeTypeSortDirections];

export const SCOPE_TYPE_PAGE_SIZE = 10;
export const SCOPE_TYPE_DESCRIPTION_MAX_LENGTH = 500;
