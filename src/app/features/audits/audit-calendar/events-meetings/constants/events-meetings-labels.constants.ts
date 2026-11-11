/* ── Dropdown options, display labels & badge classes for event values ── */

import { EventType, LocationType } from '../models/events-meeting.model';
import {
  EventAttachmentTypes,
  EventSortOptions,
  EVENT_TIME_SLOT_MINUTES,
  type EventSortOption,
} from './events-meetings.constants';

export interface EventOption {
  label: string;
  value: string;
}

export interface EventSortOptionItem {
  label: string;
  value: EventSortOption;
}

/* ── Dropdown options ─────────────────────────────────────────────────── */

/** Sort dropdown on the events listing page. */
export const EVENT_SORT_OPTIONS: EventSortOptionItem[] = [
  { label: 'Date (Newest)', value: EventSortOptions.DateDesc },
  { label: 'Date (Oldest)', value: EventSortOptions.DateAsc },
  { label: 'Title A–Z', value: EventSortOptions.TitleAsc },
  { label: 'Title Z–A', value: EventSortOptions.TitleDesc },
  { label: 'Event Type', value: EventSortOptions.Type },
];

/** Sort applied by clicking the DATE column header in list view. */
export const EVENT_DATE_COLUMN_SORT: EventSortOptionItem = {
  label: 'Date',
  value: EventSortOptions.DateDesc,
};

export const EVENT_TYPE_OPTIONS: EventOption[] = Object.values(EventType).map(v => ({
  label: v,
  value: v,
}));

export const EVENT_LOCATION_TYPE_OPTIONS: EventOption[] = Object.values(LocationType).map(v => ({
  label: v,
  value: v,
}));

export const EVENT_ATTACHMENT_TYPE_OPTIONS: EventOption[] = Object.values(EventAttachmentTypes).map(v => ({
  label: v,
  value: v,
}));

/** Start / End Time dropdown options (HH:mm, every EVENT_TIME_SLOT_MINUTES). */
export const EVENT_TIME_OPTIONS: EventOption[] = Array.from(
  { length: (24 * 60) / EVENT_TIME_SLOT_MINUTES },
  (_, i) => {
    const mins = i * EVENT_TIME_SLOT_MINUTES;
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return { label: `${h}:${m}`, value: `${h}:${m}` };
  },
);

/* ── Event type badge (profile) ───────────────────────────────────────── */

export const EVENT_TYPE_BADGE_CLASS: Record<EventType, string> = {
  [EventType.Meeting]: 'badge--blue',
  [EventType.SiteVisit]: 'badge--green',
  [EventType.RFIIssued]: 'badge--amber',
  [EventType.EvidenceSubmission]: 'badge--teal',
  [EventType.FindingCreationUpdate]: 'badge--red',
  [EventType.MOM]: 'badge--purple',
};

export const EVENT_TYPE_BADGE_DEFAULT_CLASS = 'badge--blue';
