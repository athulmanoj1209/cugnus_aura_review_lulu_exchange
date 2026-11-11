export const RevenueBracketStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type RevenueBracketStatus = typeof RevenueBracketStatuses[keyof typeof RevenueBracketStatuses];
export const RevenueBracketModes = { Add: 'add', Edit: 'edit' } as const;
export type RevenueBracketMode = typeof RevenueBracketModes[keyof typeof RevenueBracketModes];
export const REVENUE_BRACKET_PAGE_SIZE = 10;
export const REVENUE_BRACKET_NAME_MAX_LENGTH = 100;
export const REVENUE_BRACKET_DESCRIPTION_MAX_LENGTH = 500;
