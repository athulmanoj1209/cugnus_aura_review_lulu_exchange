export interface NextAuditCycle {
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

export const NEXT_AUDIT_CYCLE_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',    value: 'name_asc'  },
  { label: 'Name (Z–A)',    value: 'name_desc' },
  { label: 'Newest First',  value: 'date_desc' },
  { label: 'Oldest First',  value: 'date_asc'  },
];

export const MOCK_NEXT_AUDIT_CYCLES: NextAuditCycle[] = [
  {
    id: '1',
    name: 'Q1 – January to March',
    description: 'First quarter audit cycle covering January through March.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    name: 'Q2 – April to June',
    description: 'Second quarter audit cycle covering April through June.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Q3 – July to September',
    description: 'Third quarter audit cycle covering July through September.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Q4 – October to December',
    description: 'Fourth quarter audit cycle covering October through December.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Semi-Annual (H1)',
    description: 'First half of the year audit cycle.',
    isActive: true,
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '6',
    name: 'Semi-Annual (H2)',
    description: 'Second half of the year audit cycle.',
    isActive: false,
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '7',
    name: 'Annual',
    description: 'Full year comprehensive audit cycle.',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];