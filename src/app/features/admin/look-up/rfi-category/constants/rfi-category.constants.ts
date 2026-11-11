export const RfiCategoryStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type RfiCategoryStatus = typeof RfiCategoryStatuses[keyof typeof RfiCategoryStatuses];
export const RfiCategoryModes = { Add: 'add', Edit: 'edit' } as const;
export type RfiCategoryMode = typeof RfiCategoryModes[keyof typeof RfiCategoryModes];
export const RFI_CATEGORY_PAGE_SIZE = 10;
export const RFI_CATEGORY_NAME_MAX_LENGTH = 100;
export const RFI_CATEGORY_DESCRIPTION_MAX_LENGTH = 500;
