import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

import { DrawerRef, DRAWER_DATA } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { AuditEvent, EventType, LinkedEntity, LocationType } from '../models/events-meeting.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { EVENT_DATE_LOCALE, EVENT_ID_PREFIX } from '../constants/events-meetings.constants';
import {
  EVENT_TYPE_BADGE_CLASS,
  EVENT_TYPE_BADGE_DEFAULT_CLASS,
} from '../constants/events-meetings-labels.constants';
import {
  EVENT_EMPTY_VALUE,
  EVENT_LOCATION_DETAIL_LABELS,
} from '../constants/events-meetings-messages.constants';

@Component({
  selector: 'app-event-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, TagModule, DividerModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events-meetings-profile.component.html',
  styleUrls: ['./events-meetings-profile.component.scss'],
})
export class EventProfileComponent {

  /** Drawer wiring — optional so the component also works embedded. */
  private readonly drawerRef = inject(DrawerRef, { optional: true }) as DrawerRef<AuditEvent> | null;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AuditEvent | null;

  readonly event = signal<AuditEvent | null>(this.drawerData);

  readonly e = computed(() => this.event());

  readonly LocationType = LocationType;
  readonly EventType = EventType;

  // Exposed for the template.
  readonly eventIdPrefix = EVENT_ID_PREFIX;
  readonly emptyValue = EVENT_EMPTY_VALUE;
  readonly locationDetailLabels = EVENT_LOCATION_DETAIL_LABELS;

  eventTypeLabel(type: EventType): string {
    const map: Record<EventType, string> = {
      [EventType.Meeting]: $localize`:@@audit.eventMeeting.typeMeeting:Meeting`,
      [EventType.SiteVisit]: $localize`:@@audit.eventMeeting.typeSiteVisit:Site Visit`,
      [EventType.RFIIssued]: $localize`:@@audit.eventMeeting.typeRfiIssued:RFI Issued/Responded`,
      [EventType.EvidenceSubmission]: $localize`:@@audit.eventMeeting.typeEvidenceSubmission:Evidence Submission`,
      [EventType.FindingCreationUpdate]: $localize`:@@audit.eventMeeting.typeFindingCreationUpdate:Finding Creation/Update`,
      [EventType.MOM]: $localize`:@@audit.eventMeeting.typeMom:MOM`,
    };
    return map[type];
  }

  locationTypeLabel(type: LocationType): string {
    const map: Record<LocationType, string> = {
      [LocationType.Physical]: $localize`:@@audit.eventMeeting.locationPhysical:Physical`,
      [LocationType.Virtual]: $localize`:@@audit.eventMeeting.locationVirtual:Virtual`,
    };
    return map[type];
  }

  linkedEntityTypeLabel(type: LinkedEntity['type']): string {
    const map: Record<LinkedEntity['type'], string> = {
      Scope: $localize`:@@common.scope:Scope`,
      Task: $localize`:@@audit.eventMeeting.task:Task`,
      RFI: $localize`:@@common.rfi:RFI`,
      Finding: $localize`:@@audit.eventMeeting.finding:Finding`,
    };
    return map[type];
  }

  /** Initials fallback for organizer avatar. */
  readonly organizerInitials = computed(() => {
    const name = this.event()?.organizer?.name ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join('');
  });

  /** Badge style per event type. */
  typeBadgeClass = computed<string>(() => {
    const type = this.event()?.eventType;
    return (type && EVENT_TYPE_BADGE_CLASS[type]) || EVENT_TYPE_BADGE_DEFAULT_CLASS;
  });

  /** Duration in minutes between start and end. */
  readonly durationLabel = computed<string | null>(() => {
    const ev = this.event();
    if (!ev?.startDateTime || !ev?.endDateTime) return null;
    const mins = Math.round(
      (new Date(ev.endDateTime).getTime() - new Date(ev.startDateTime).getTime()) / 60000
    );
    if (mins < 60) return $localize`:@@audit.eventMeeting.durationMinutes:${mins}:minutes: min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? $localize`:@@audit.eventMeeting.durationHoursMinutes:${h}:hours:h ${m}:minutes:m` : $localize`:@@audit.eventMeeting.durationHours:${h}:hours:h`;
  });

  formatDateTime(d: Date | string): string {
    const dt = new Date(d);
    return dt.toLocaleString(EVENT_DATE_LOCALE, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  }

  formatDateOnly(d: Date | string): string {
    return new Date(d).toLocaleDateString(EVENT_DATE_LOCALE, {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  /** Initials for any participant name — safe for template calls. */
  participantInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }

  /** Human-readable file size from bytes. */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  onClose(): void {
    this.drawerRef?.close(null);
  }

}