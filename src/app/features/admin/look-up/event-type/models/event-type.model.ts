export interface EventType {
  id:           string;
  name:         string;
  description?: string;
  isActive:     boolean;
  createdAt:    Date;
  updatedAt?:   Date;
}

export interface SortOption { label: string; value: string; }

export const EVENT_TYPE_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_EVENT_TYPES: EventType[] = [
  { id: '1', name: 'Internal Audit',          description: 'Planned internal audit conducted by the internal audit team.',            isActive: true,  createdAt: new Date('2024-01-10') },
  { id: '2', name: 'External Audit',           description: 'Audit performed by an external or third-party audit firm.',               isActive: true,  createdAt: new Date('2024-01-10') },
  { id: '3', name: 'Regulatory Review',        description: 'Review conducted by a regulatory authority or government body.',          isActive: true,  createdAt: new Date('2024-01-15') },
  { id: '4', name: 'Risk Assessment',          description: 'Structured evaluation of potential risks affecting the organisation.',    isActive: true,  createdAt: new Date('2024-01-15') },
  { id: '5', name: 'Compliance Review',        description: 'Assessment of adherence to internal policies and external regulations.',  isActive: true,  createdAt: new Date('2024-02-01') },
  { id: '6', name: 'Follow-Up Review',         description: 'Follow-up audit to verify implementation of prior audit findings.',      isActive: true,  createdAt: new Date('2024-02-01') },
  { id: '7', name: 'Special Investigation',    description: 'Ad-hoc investigation triggered by a specific incident or concern.',      isActive: false, createdAt: new Date('2024-02-10') },
  { id: '8', name: 'Management Self-Assessment', description: 'Self-evaluation performed by management on controls and processes.',   isActive: true,  createdAt: new Date('2024-03-01') },
];