/** Values and UI configuration owned by the sampling-methodology lookup module. */
export const SamplingMethodologyStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type SamplingMethodologyStatus = typeof SamplingMethodologyStatuses[keyof typeof SamplingMethodologyStatuses];

export const SamplingMethodologyModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type SamplingMethodologyMode = typeof SamplingMethodologyModes[keyof typeof SamplingMethodologyModes];

export const SamplingMethodologySortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type SamplingMethodologySortDirection = typeof SamplingMethodologySortDirections[keyof typeof SamplingMethodologySortDirections];

export const SAMPLING_METHODOLOGY_PAGE_SIZE = 10;
export const SAMPLING_METHODOLOGY_DESCRIPTION_MAX_LENGTH = 500;
