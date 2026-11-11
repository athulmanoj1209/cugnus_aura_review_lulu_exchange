import type { EventLinkedEntityType } from '../constants/events-meetings.constants';

// ─── Enums ─────────────────────────────────────────────────────────────────

export enum EventType {
  Meeting = 'Meeting',
  SiteVisit = 'Site Visit',
  RFIIssued = 'RFI Issued/Responded',
  EvidenceSubmission = 'Evidence Submission',
  FindingCreationUpdate = 'Finding Creation/Update',
  MOM = 'MOM',
}

export enum LocationType {
  Physical = 'Physical',
  Virtual = 'Virtual',
}

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface EventAttachment {
  id: string;
  name: string;
  size: number;
  type: string; // EventAttachmentType for seeded files, MIME type for uploads
  url?: string;
  file?: File;
}

export interface LinkedEntity {
  id: string;
  label: string;
  type: EventLinkedEntityType;
}

export interface AuditEvent {
  id: string;                        // system-generated UUID
  title: string;                     // required, max 200 chars
  description?: string;              // max 1000 chars
  eventType: EventType;              // required
  linkedEntities?: LinkedEntity[];   // mandatory for system-generated events
  organizer: Participant;            // auto-filled from session
  participants: Participant[];       // multi-select
  startDateTime: Date;               // required
  endDateTime: Date;                 // required
  locationType: LocationType;        // required
  locationDetail?: string;           // address or virtual link
  attachments?: EventAttachment[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'u1', name: 'Michael Chen', email: 'michael.chen@example.com' },
  { id: 'u2', name: 'Lisa Anderson', email: 'lisa.anderson@example.com' },
  { id: 'u3', name: 'David Martinez', email: 'david.martinez@example.com' },
  { id: 'u4', name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
  { id: 'u5', name: 'James Wilson', email: 'james.wilson@example.com' },
  { id: 'u6', name: 'Emily Davis', email: 'emily.davis@example.com' },
];

export const MOCK_LINKED_ENTITIES: LinkedEntity[] = [
  { id: 'sc1', label: 'Scope – IT General Controls', type: 'Scope' },
  { id: 'sc2', label: 'Scope – Financial Reporting', type: 'Scope' },
  { id: 't1',  label: 'Task – Access Review Q1', type: 'Task' },
  { id: 'r1',  label: 'RFI – Vendor Contracts', type: 'RFI' },
  { id: 'f1',  label: 'Finding – Segregation of Duties', type: 'Finding' },
];
