/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (events-meetings-list.component.ts) stay
 * assignable to the derived types in models/events-meeting.model.ts.
 */

import type { Participant } from '../models/events-meeting.model';

/** Kind of record an event can be linked to (Scope / Task / RFI / Finding). */
export const EventLinkedEntityTypes = {
  Scope: 'Scope',
  Task: 'Task',
  RFI: 'RFI',
  Finding: 'Finding',
} as const;
export type EventLinkedEntityType = typeof EventLinkedEntityTypes[keyof typeof EventLinkedEntityTypes];

export const EventAttachmentTypes = {
  Agenda: 'Agenda',
  MoM: 'MoM',
  Photos: 'Photos',
  Evidence: 'Evidence',
} as const;
export type EventAttachmentType = typeof EventAttachmentTypes[keyof typeof EventAttachmentTypes];

/** Grid / list toggle on the events listing page. */
export const EventViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type EventViewMode = typeof EventViewModes[keyof typeof EventViewModes];

/** Sort options on the events listing page. */
export const EventSortOptions = {
  DateDesc: 'date_desc',
  DateAsc: 'date_asc',
  TitleAsc: 'title_asc',
  TitleDesc: 'title_desc',
  Type: 'type',
} as const;
export type EventSortOption = typeof EventSortOptions[keyof typeof EventSortOptions];

/** Activate / deactivate action shown in the listing's confirmation dialog. */
export const EventBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type EventBlockAction = typeof EventBlockActions[keyof typeof EventBlockActions];

/* ── Configuration ────────────────────────────────────────────────────── */

export const EVENT_DRAWER = {
  FormWidth: '720px',
  ProfileWidth: '720px',
} as const;

export const EVENT_LIST_PAGE_SIZE = 8;

export const EVENT_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

/** Participants shown in a list row before the "+N more" pill. */
export const EVENT_PARTICIPANTS_PREVIEW_COUNT = 2;

/** Length limits for the event form controls. */
export const EVENT_FIELD_LIMITS = {
  TitleMax: 200,
  DescriptionMax: 1000,
} as const;

/** Largest file accepted by the "Related Documents" upload. */
export const EVENT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Step between the options of the Start / End Time dropdowns. */
export const EVENT_TIME_SLOT_MINUTES = 15;

/** Simulated save latency of the event form. */
export const EVENT_SUBMIT_DELAY_MS = 800;

/** Locale used for every date / time shown in the module. */
export const EVENT_DATE_LOCALE = 'en-GB';

/** Prefix of the display ID shown for an event (EV-001, EV-A1B2…). */
export const EVENT_ID_PREFIX = 'EV-';

/** Prefix of the ids generated for scope options built from the org data. */
export const EVENT_SCOPE_OPTION_ID_PREFIX = 'scope-';

/** Organizer used when the form is saved without one. */
export const EVENT_DEFAULT_ORGANIZER: Participant = {
  id: 'current',
  name: 'Athul Manoj',
  email: 'athul.manoj@crowe.ae',
};
