/** Values and UI configuration owned by the audit-frequency lookup module. */
export const AuditFrequencyStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type AuditFrequencyStatus = typeof AuditFrequencyStatuses[keyof typeof AuditFrequencyStatuses];

export const AuditFrequencyModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type AuditFrequencyMode = typeof AuditFrequencyModes[keyof typeof AuditFrequencyModes];

export const AuditFrequencySortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type AuditFrequencySortDirection = typeof AuditFrequencySortDirections[keyof typeof AuditFrequencySortDirections];

export const AUDIT_FREQUENCY_PAGE_SIZE = 10;
export const AUDIT_FREQUENCY_DESCRIPTION_MAX_LENGTH = 500;
