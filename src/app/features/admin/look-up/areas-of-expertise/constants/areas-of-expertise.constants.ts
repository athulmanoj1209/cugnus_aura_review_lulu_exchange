export const AreasOfExpertiseStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type AreasOfExpertiseStatus = typeof AreasOfExpertiseStatuses[keyof typeof AreasOfExpertiseStatuses];
export const AreasOfExpertiseModes = { Add: 'add', Edit: 'edit' } as const;
export type AreasOfExpertiseMode = typeof AreasOfExpertiseModes[keyof typeof AreasOfExpertiseModes];
export const AREAS_OF_EXPERTISE_PAGE_SIZE = 10;
export const AREAS_OF_EXPERTISE_NAME_MAX_LENGTH = 100;
export const AREAS_OF_EXPERTISE_DESCRIPTION_MAX_LENGTH = 500;
