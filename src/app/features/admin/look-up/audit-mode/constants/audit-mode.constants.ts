/** Values and UI configuration owned by the audit-mode lookup module. */
export const AuditModeStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type AuditModeStatus = typeof AuditModeStatuses[keyof typeof AuditModeStatuses];

export const AuditModeModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type AuditModeMode = typeof AuditModeModes[keyof typeof AuditModeModes];

export const AuditModeSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type AuditModeSortDirection = typeof AuditModeSortDirections[keyof typeof AuditModeSortDirections];

export const AUDIT_MODE_PAGE_SIZE = 10;
export const AUDIT_MODE_DESCRIPTION_MAX_LENGTH = 500;
