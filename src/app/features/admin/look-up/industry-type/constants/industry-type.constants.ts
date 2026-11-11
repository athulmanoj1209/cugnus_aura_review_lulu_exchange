export const IndustryTypeStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type IndustryTypeStatus = typeof IndustryTypeStatuses[keyof typeof IndustryTypeStatuses];
export const IndustryTypeModes = { Add: 'add', Edit: 'edit' } as const;
export type IndustryTypeMode = typeof IndustryTypeModes[keyof typeof IndustryTypeModes];
export const INDUSTRY_TYPE_PAGE_SIZE = 10;
export const INDUSTRY_TYPE_NAME_MAX_LENGTH = 100;
export const INDUSTRY_TYPE_DESCRIPTION_MAX_LENGTH = 500;
