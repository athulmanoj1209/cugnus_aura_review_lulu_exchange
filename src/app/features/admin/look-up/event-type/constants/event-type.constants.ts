export const EventTypeStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type EventTypeStatus = typeof EventTypeStatuses[keyof typeof EventTypeStatuses];
export const EventTypeModes = { Add: 'add', Edit: 'edit' } as const;
export type EventTypeMode = typeof EventTypeModes[keyof typeof EventTypeModes];
export const EVENT_TYPE_PAGE_SIZE = 10;
export const EVENT_TYPE_NAME_MAX_LENGTH = 100;
export const EVENT_TYPE_DESCRIPTION_MAX_LENGTH = 500;
