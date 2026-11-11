import {
  Component,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import {
  AuditEvent,
  EventType,
  LocationType,
  MOCK_PARTICIPANTS,
} from '../models/events-meeting.model';
import {
  EventBlockActions,
  EventSortOptions,
  EventViewModes,
  type EventBlockAction,
  type EventViewMode,
  EVENT_DATE_LOCALE,
  EVENT_DRAWER,
  EVENT_ID_PREFIX,
  EVENT_LIST_PAGE_SIZE,
  EVENT_PAGE_SIZE_OPTIONS,
  EVENT_PARTICIPANTS_PREVIEW_COUNT,
} from '../constants/events-meetings.constants';
import {
  EVENT_DATE_COLUMN_SORT,
  EVENT_SORT_OPTIONS,
  type EventSortOptionItem,
} from '../constants/events-meetings-labels.constants';
import {
  EVENT_PROFILE_LOAD_ERROR,
  moreParticipantsLabel,
} from '../constants/events-meetings-messages.constants';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { EventProfileComponent } from '../profile/events-meetings-profile.component';
import { EmFormComponent } from '../manage/events-meetings.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';


/** Local extension — adds isActive without touching the shared model. */
type AuditEventItem = AuditEvent & { isActive: boolean };

@Component({
  selector: 'app-em-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent,
  ],
  templateUrl: './events-meetings-list.component.html',
  styleUrls: ['./events-meetings-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventMeetingListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly drawer = inject(RightDrawerService);

  readonly pageSize    = signal(EVENT_LIST_PAGE_SIZE);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = EVENT_PAGE_SIZE_OPTIONS;

  // ── State ─────────────────────────────────────────────────────────────────
  events           = signal<AuditEventItem[]>([]);
  searchQuery      = signal('');
  selectedSort     = signal<EventSortOptionItem | null>(null);
  selectedOrganizer = signal<string | null>(null);
  viewMode         = signal<EventViewMode>(EventViewModes.Grid);

  loadingEventId = signal<string | null>(null);

  readonly sortOptions  = EVENT_SORT_OPTIONS;
  readonly LocationType = LocationType;

  // Exposed for the template.
  readonly EventViewModes             = EventViewModes;
  readonly EventBlockActions          = EventBlockActions;
  readonly dateColumnSort             = EVENT_DATE_COLUMN_SORT;
  readonly eventIdPrefix              = EVENT_ID_PREFIX;
  readonly participantsPreviewCount   = EVENT_PARTICIPANTS_PREVIEW_COUNT;
  readonly moreParticipantsLabel      = moreParticipantsLabel;

  /** Organizer filter options come from the same participant directory used
   *  for the Organizer / Participants fields on the create/edit event form. */
  readonly organizerOptions = MOCK_PARTICIPANTS.map(p => ({ label: p.name, value: p.name }));

  // ── Confirm dialog ─────────────────────────────────────────────────────────
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<EventBlockAction>(EventBlockActions.Deactivate);
  readonly confirmationTarget  = signal<AuditEventItem | null>(null);

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

  filteredEvents = computed(() => {
    let list = [...this.events()];
    const q  = this.searchQuery().toLowerCase().trim();

    if (q) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.organizer.name.toLowerCase().includes(q),
      );
    }

    const organizer = this.selectedOrganizer();
    if (organizer) {
      list = list.filter(e => e.organizer.name === organizer);
    }

    const sort = this.selectedSort();
    if (sort) {
      list.sort((a, b) => {
        switch (sort.value) {
          case EventSortOptions.DateDesc:  return +new Date(b.startDateTime) - +new Date(a.startDateTime);
          case EventSortOptions.DateAsc:   return +new Date(a.startDateTime) - +new Date(b.startDateTime);
          case EventSortOptions.TitleAsc:  return a.title.localeCompare(b.title);
          case EventSortOptions.TitleDesc: return b.title.localeCompare(a.title);
          case EventSortOptions.Type:      return a.eventType.localeCompare(b.eventType);
          default:           return 0;
        }
      });
    }
    return list;
  });

  /** The current page slice. */
  readonly pagedEvents = computed(() => {
    const filtered = this.filteredEvents();
    const size = this.pageSize();
    const start = (this.currentPage() - 1) * size;
    return filtered.slice(start, start + size);
  });

  ngOnInit(): void { this.loadEvents(); }

  loadEvents(): void {
    this.events.set([
      {
        id: 'ev-1',
        title: 'Compliance Review Session',
        description: 'Review of regulatory compliance requirements and assessment of the current control environment across all business units.',
        eventType: EventType.Meeting,
        organizer: { id: 'u1', name: 'Athul Manoj', email: 'athul.manoj@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(0, 4),
        startDateTime: new Date('2026-01-23T13:00'),
        endDateTime:   new Date('2026-01-23T15:00'),
        locationType:  LocationType.Virtual,
        locationDetail: 'https://zoom.us/j/compliance-review',
        linkedEntities: [
          { id: 'le-1', type: 'Scope', label: 'Annual Financial Audit' },
          { id: 'le-2', type: 'RFI',   label: 'RFI-2026-001: VAT Reconciliation' },
        ],
        attachments: [
          { id: 'att-1', name: 'compliance-checklist-2026.pdf', size: 204800, type: 'Agenda' },
          { id: 'att-2', name: 'meeting-agenda.docx',           size: 45056,  type: 'MoM'    },
        ],
        createdAt: new Date('2026-01-10T09:00'),
        updatedAt: new Date('2026-01-20T14:30'),
        isActive: true,
      },
      {
        id: 'ev-2',
        title: 'Dubai HQ Site Inspection',
        description: 'On-site walkthrough of the Dubai headquarters to assess physical controls, access management, and documentation practices.',
        eventType: EventType.SiteVisit,
        organizer: { id: 'u2', name: 'Sarah Al-Rashidi', email: 'sarah.alrashidi@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(1, 3),
        startDateTime: new Date('2026-02-05T09:00'),
        endDateTime:   new Date('2026-02-05T12:00'),
        locationType:  LocationType.Physical,
        locationDetail: 'Crowe Dubai HQ, Floor 12, DIFC, Dubai',
        linkedEntities: [{ id: 'le-3', type: 'Scope', label: 'IT Security Baseline Audit' }],
        attachments: [{ id: 'att-3', name: 'site-inspection-report.pdf', size: 512000, type: 'Photos' }],
        createdAt: new Date('2026-01-28T11:00'),
        updatedAt: new Date('2026-02-01T08:15'),
        isActive: true,
      },
      {
        id: 'ev-3',
        title: 'RFI Issued: AP Transaction Sample',
        description: 'Formal request for information issued to the Finance department regarding accounts payable transaction samples for Q3 2025.',
        eventType: EventType.RFIIssued,
        organizer: { id: 'u3', name: 'James Okafor', email: 'james.okafor@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(0, 1),
        startDateTime: new Date('2026-02-10T10:00'),
        endDateTime:   new Date('2026-02-10T10:30'),
        locationType:  LocationType.Virtual,
        locationDetail: 'https://teams.microsoft.com/l/meetup-join/rfi-ap',
        linkedEntities: [
          { id: 'le-4', type: 'Scope',   label: 'Accounts Payable Review' },
          { id: 'le-5', type: 'Finding', label: 'FIN-2025-008: Duplicate Payments' },
        ],
        createdAt: new Date('2026-02-08T09:30'),
        updatedAt: new Date('2026-02-09T16:00'),
        isActive: true,
      },
      {
        id: 'ev-4',
        title: 'Evidence Handover: VAT Filing Records',
        description: 'Submission of VAT filing documentation and supporting schedules for the period Jan–Sep 2025 as requested by the audit team.',
        eventType: EventType.EvidenceSubmission,
        organizer: { id: 'u4', name: 'Nadia Hussain', email: 'nadia.hussain@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(0, 3),
        startDateTime: new Date('2026-02-18T14:00'),
        endDateTime:   new Date('2026-02-18T15:30'),
        locationType:  LocationType.Physical,
        locationDetail: 'Abu Dhabi Office, Meeting Room B3, Al Maryah Island',
        linkedEntities: [{ id: 'le-6', type: 'Scope', label: 'VAT Compliance Audit' }],
        attachments: [
          { id: 'att-4', name: 'vat-return-q1-2025.xlsx',   size: 98304,   type: 'Evidence' },
          { id: 'att-5', name: 'vat-return-q2-2025.xlsx',   size: 102400,  type: 'Evidence' },
          { id: 'att-6', name: 'vat-supporting-ledger.pdf', size: 1048576, type: 'Evidence' },
        ],
        createdAt: new Date('2026-02-12T10:00'),
        updatedAt: new Date('2026-02-17T17:45'),
        isActive: true,
      },
      {
        id: 'ev-5',
        title: 'Finding Review: AML Controls Gap',
        description: 'Internal walkthrough to review and finalise the AML controls gap finding before issuing to the client for management response.',
        eventType: EventType.FindingCreationUpdate,
        organizer: { id: 'u1', name: 'Athul Manoj', email: 'athul.manoj@crowe.ae' },
        participants: MOCK_PARTICIPANTS,
        startDateTime: new Date('2026-03-03T11:00'),
        endDateTime:   new Date('2026-03-03T12:00'),
        locationType:  LocationType.Virtual,
        locationDetail: 'https://zoom.us/j/finding-review-aml',
        linkedEntities: [
          { id: 'le-7', type: 'Scope',   label: 'AML Controls Audit' },
          { id: 'le-8', type: 'Finding', label: 'FIN-2026-002: Incomplete STR Filings' },
        ],
        attachments: [{ id: 'att-7', name: 'aml-gap-analysis.pdf', size: 307200, type: 'Agenda' }],
        createdAt: new Date('2026-02-25T08:00'),
        updatedAt: new Date('2026-03-01T12:00'),
        isActive: true,
      },
      {
        id: 'ev-6',
        title: 'Minutes of Meeting: HR Policy Audit Kickoff',
        description: 'Formal kickoff meeting for the HR Policy Compliance Review.',
        eventType: EventType.MOM,
        organizer: { id: 'u2', name: 'Sarah Al-Rashidi', email: 'sarah.alrashidi@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(2, 4),
        startDateTime: new Date('2026-03-10T09:30'),
        endDateTime:   new Date('2026-03-10T10:30'),
        locationType:  LocationType.Physical,
        locationDetail: 'Dubai HQ, Boardroom 3A, DIFC',
        linkedEntities: [{ id: 'le-9', type: 'Scope', label: 'HR Policy Compliance Review' }],
        attachments: [{ id: 'att-8', name: 'mom-hr-audit-kickoff.pdf', size: 153600, type: 'MoM' }],
        createdAt: new Date('2026-03-10T11:00'),
        updatedAt: new Date('2026-03-11T09:00'),
        isActive: true,
      },
      {
        id: 'ev-7',
        title: 'IT Security Audit Planning Session',
        description: 'Pre-audit planning call to align on testing methodology, access requirements, and key milestones.',
        eventType: EventType.Meeting,
        organizer: { id: 'u3', name: 'James Okafor', email: 'james.okafor@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(1, 3),
        startDateTime: new Date('2026-03-15T15:00'),
        endDateTime:   new Date('2026-03-15T16:00'),
        locationType:  LocationType.Virtual,
        locationDetail: 'https://teams.microsoft.com/l/meetup-join/it-audit-plan',
        linkedEntities: [{ id: 'le-10', type: 'Scope', label: 'IT Security Baseline Audit' }],
        createdAt: new Date('2026-03-08T10:00'),
        updatedAt: new Date('2026-03-08T10:00'),
        isActive: true,
      },
      {
        id: 'ev-8',
        title: 'RFI Issued: Regulatory Filings 2025',
        description: 'Request for UAE Central Bank regulatory filings and internal compliance reports for the period under review.',
        eventType: EventType.RFIIssued,
        organizer: { id: 'u4', name: 'Nadia Hussain', email: 'nadia.hussain@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(3, 4),
        startDateTime: new Date('2026-03-20T10:00'),
        endDateTime:   new Date('2026-03-20T10:30'),
        locationType:  LocationType.Physical,
        locationDetail: 'Abu Dhabi Regulator Office, Level 5',
        linkedEntities: [{ id: 'le-11', type: 'Scope', label: 'Regulatory Compliance Review' }],
        attachments: [
          { id: 'att-9',  name: 'rfi-letter-regulatory.pdf',  size: 81920,  type: 'MoM'      },
          { id: 'att-10', name: 'prior-year-filings-ref.pdf', size: 204800, type: 'Evidence' },
        ],
        createdAt: new Date('2026-03-17T14:00'),
        updatedAt: new Date('2026-03-18T09:30'),
        isActive: true,
      },
      {
        id: 'ev-9',
        title: 'Sharjah Branch Walkthrough',
        description: 'Unannounced walkthrough of Sharjah branch operations to review cash handling procedures, inventory records, and operational controls.',
        eventType: EventType.SiteVisit,
        organizer: { id: 'u1', name: 'Athul Manoj', email: 'athul.manoj@crowe.ae' },
        participants: MOCK_PARTICIPANTS.slice(0, 3),
        startDateTime: new Date('2026-04-02T08:30'),
        endDateTime:   new Date('2026-04-02T11:30'),
        locationType:  LocationType.Physical,
        locationDetail: 'Crowe Sharjah Branch, Al Khan District, Sharjah',
        attachments: [{ id: 'att-11', name: 'sharjah-walkthrough-notes.pdf', size: 245760, type: 'Photos' }],
        createdAt: new Date('2026-03-25T11:00'),
        updatedAt: new Date('2026-03-28T16:00'),
        isActive: true,
      },
    ]);
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  goToAdd(): void {
    const ref = this.drawer.open(EmFormComponent, { data: null, width: EVENT_DRAWER.FormWidth });
    ref.afterClosed.then((raw: unknown) => {
      const result = raw as AuditEvent | null | undefined;
      if (!result) return;

      // Newly created event — add it to the top of the (in-memory) list
      // so it shows up immediately without a page refresh / API round-trip.
      const newItem: AuditEventItem = { ...result, isActive: true };
      this.events.update(list => [newItem, ...list]);

      // Jump back to page 1 so the just-added event is visible.
      this.currentPage.set(1);
    });
  }

  goToEdit(event: AuditEventItem, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    const ref = this.drawer.open(EmFormComponent, { data: event, width: EVENT_DRAWER.FormWidth });
    ref.afterClosed.then((raw: unknown) => {
      const result = raw as AuditEvent | null | undefined;
      if (!result) return;

      // Merge the edited fields back into the existing list item,
      // preserving isActive (the form payload doesn't carry that flag).
      this.events.update(list =>
        list.map(e => (e.id === result.id ? { ...e, ...result } : e)),
      );
    });
  }

  async goToDetail(event: AuditEventItem): Promise<void> {
    if (this.loadingEventId()) return;
    this.loadingEventId.set(event.id);

    let profile: AuditEventItem;
    try {
      await new Promise(r => setTimeout(r, 0));
      profile = { ...event };
    } catch (err) {
      console.error(EVENT_PROFILE_LOAD_ERROR, err);
      return;
    } finally {
      this.loadingEventId.set(null);
    }

    this.drawer.open(EventProfileComponent, { data: profile, width: EVENT_DRAWER.ProfileWidth });
  }

  // ── Confirm dialog (activate / deactivate) ─────────────────────────────────
  openConfirmation(event: AuditEventItem, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    this.confirmationAction.set(event.isActive ? EventBlockActions.Deactivate : EventBlockActions.Activate);
    this.confirmationTarget.set(event);
    this.displayConfirmation.set(true);
  }

  confirmToggleBlocked(): void {
    const target = this.confirmationTarget();
    if (!target) return;
    this.events.update(list =>
      list.map(e => e.id === target.id ? { ...e, isActive: !e.isActive } : e),
    );
    this.closeConfirmation();
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.confirmationTarget.set(null);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  onSearch(val: string): void                { this.searchQuery.set(val); this.currentPage.set(1); }
  onSortChange(opt: EventSortOptionItem | null): void { this.selectedSort.set(opt); }
  onOrganizerChange(val: string | null): void { this.selectedOrganizer.set(val); this.currentPage.set(1); }
  setView(mode: EventViewMode): void         { this.viewMode.set(mode); }

  /** <app-pagination-bar> emits a zero-based page index. */
  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  /** Called when the "items per page" dropdown changes. Resets to page 1
   *  so the visible slice stays consistent with the new page size. */
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(start: Date, end: Date): string {
    const d         = new Date(start);
    const dateStr   = d.toLocaleDateString(EVENT_DATE_LOCALE, { day: '2-digit', month: 'short', year: 'numeric' });
    const startTime = d.toLocaleTimeString(EVENT_DATE_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
    const endTime   = new Date(end).toLocaleTimeString(EVENT_DATE_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dateStr} ${startTime} - ${endTime}`;
  }

  expandedParticipants = signal<Set<string>>(new Set());

  toggleParticipants(id: string): void {
    this.expandedParticipants.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  trackById(_: number, e: AuditEventItem): string { return e.id; }
}