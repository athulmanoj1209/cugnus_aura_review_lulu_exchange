export const NextAuditCycleStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type NextAuditCycleStatus = typeof NextAuditCycleStatuses[keyof typeof NextAuditCycleStatuses];
export const NextAuditCycleModes = { Add: 'add', Edit: 'edit' } as const;
export type NextAuditCycleMode = typeof NextAuditCycleModes[keyof typeof NextAuditCycleModes];
export const NEXT_AUDIT_CYCLE_PAGE_SIZE = 10;
export const NEXT_AUDIT_CYCLE_NAME_MAX_LENGTH = 100;
export const NEXT_AUDIT_CYCLE_DESCRIPTION_MAX_LENGTH = 500;
