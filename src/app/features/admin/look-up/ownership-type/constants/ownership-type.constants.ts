export const OwnershipTypeStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type OwnershipTypeStatus = typeof OwnershipTypeStatuses[keyof typeof OwnershipTypeStatuses];
export const OwnershipTypeModes = { Add: 'add', Edit: 'edit' } as const;
export type OwnershipTypeMode = typeof OwnershipTypeModes[keyof typeof OwnershipTypeModes];
export const OWNERSHIP_TYPE_PAGE_SIZE = 10;
export const OWNERSHIP_TYPE_NAME_MAX_LENGTH = 100;
export const OWNERSHIP_TYPE_DESCRIPTION_MAX_LENGTH = 500;
