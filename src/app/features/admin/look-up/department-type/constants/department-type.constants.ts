/** Values and UI configuration owned by the department-type lookup module. */
export const DepartmentTypeStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type DepartmentTypeStatus = typeof DepartmentTypeStatuses[keyof typeof DepartmentTypeStatuses];

export const DepartmentTypeModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type DepartmentTypeMode = typeof DepartmentTypeModes[keyof typeof DepartmentTypeModes];

export const DepartmentTypeSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type DepartmentTypeSortDirection = typeof DepartmentTypeSortDirections[keyof typeof DepartmentTypeSortDirections];

export const DEPARTMENT_TYPE_PAGE_SIZE = 10;
export const DEPARTMENT_TYPE_DESCRIPTION_MAX_LENGTH = 500;
