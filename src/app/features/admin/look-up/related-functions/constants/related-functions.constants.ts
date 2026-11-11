export const RelatedFunctionsStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type RelatedFunctionsStatus = typeof RelatedFunctionsStatuses[keyof typeof RelatedFunctionsStatuses];
export const RelatedFunctionsModes = { Add: 'add', Edit: 'edit' } as const;
export type RelatedFunctionsMode = typeof RelatedFunctionsModes[keyof typeof RelatedFunctionsModes];
export const RELATED_FUNCTIONS_PAGE_SIZE = 10;
export const RELATED_FUNCTIONS_NAME_MAX_LENGTH = 100;
export const RELATED_FUNCTIONS_DESCRIPTION_MAX_LENGTH = 500;
