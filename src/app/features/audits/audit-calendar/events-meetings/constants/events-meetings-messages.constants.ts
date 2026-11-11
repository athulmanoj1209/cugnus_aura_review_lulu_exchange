/* ── User-facing text for the events & meetings module ───────────────── */

export const EVENT_TOAST_MESSAGES = {
  Added: 'New event has been successfully added.',
  Updated: 'Event details have been successfully updated.',
  ValidationError: 'Please fix the highlighted fields.',
  ValidationErrorTitle: 'Validation Error',
} as const;

export const EVENT_DRAWER_TITLES = {
  Add: 'Create New Event',
  Edit: 'Edit Event',
} as const;

export const EVENT_DRAWER_SUBTITLES = {
  Add: 'Fill in the details to create a new audit event or meeting.',
  Edit: 'Update the event details below.',
} as const;

export const EVENT_SUBMIT_LABELS = {
  Add: 'CREATE EVENT',
  Edit: 'SAVE CHANGES',
} as const;

/** Placeholder of the Location / Address field, by location type. */
export const EVENT_LOCATION_PLACEHOLDERS = {
  Virtual: 'Meeting link (https://…)',
  Physical: 'Location / Address',
} as const;

/** Label of the location detail on the event profile, by location type. */
export const EVENT_LOCATION_DETAIL_LABELS = {
  Virtual: 'Meeting Link',
  Physical: 'Address',
} as const;

export const EVENT_PROFILE_LOAD_ERROR = 'Failed to load event profile';

/** Shown in place of a missing value on the event profile. */
export const EVENT_EMPTY_VALUE = '—';

export const moreParticipantsLabel = (count: number): string => `+${count} more`;
