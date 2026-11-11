export interface EvidenceType {
  id:          string;
  name:        string;
  description?: string;
  isActive:    boolean;
  createdAt:   Date;
  updatedAt?:  Date;
}

export interface SortOption {
  label: string;
  value: string;
}

export const EVIDENCE_TYPE_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_EVIDENCE_TYPES: EvidenceType[] = [
  {
    id: '1',
    name: 'Document',
    description: 'Written records, reports, policies, or procedures supporting audit findings.',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Screenshot',
    description: 'Captured screen images demonstrating system states or user actions.',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Email Correspondence',
    description: 'Email threads and communications relevant to the audit scope.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Interview Notes',
    description: 'Notes and transcripts from interviews conducted during the audit.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'System Log',
    description: 'System-generated logs and audit trails from IT systems.',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    name: 'Financial Record',
    description: 'Financial statements, ledgers, and transaction records.',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '7',
    name: 'Physical Inspection Report',
    description: 'Reports from on-site physical inspections and observations.',
    isActive: true,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '8',
    name: 'Third-Party Confirmation',
    description: 'Confirmations and certifications received from external parties.',
    isActive: false,
    createdAt: new Date('2024-03-01'),
  },
];