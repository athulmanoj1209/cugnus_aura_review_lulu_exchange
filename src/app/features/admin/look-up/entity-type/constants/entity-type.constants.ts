export const EntityTypeStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type EntityTypeStatus = typeof EntityTypeStatuses[keyof typeof EntityTypeStatuses];
export const EntityTypeModes = { Add: 'add', Edit: 'edit' } as const;
export type EntityTypeMode = typeof EntityTypeModes[keyof typeof EntityTypeModes];
export const ENTITY_TYPE_PAGE_SIZE = 10;
export const ENTITY_TYPE_NAME_MAX_LENGTH = 100;
export const ENTITY_TYPE_DESCRIPTION_MAX_LENGTH = 500;
