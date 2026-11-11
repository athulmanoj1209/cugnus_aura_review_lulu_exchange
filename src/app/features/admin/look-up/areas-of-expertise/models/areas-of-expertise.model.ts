export interface AreaOfExpertise {
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

export const AREA_OF_EXPERTISE_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_AREAS_OF_EXPERTISE: AreaOfExpertise[] = [
  {
    id: '1',
    name: 'Financial Audit',
    description: 'Examination of financial statements and records for accuracy and compliance.',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'IT & Cybersecurity Audit',
    description: 'Assessment of IT infrastructure, systems, and cybersecurity controls.',
    isActive: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Compliance Audit',
    description: 'Verification of adherence to regulatory requirements and internal policies.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Risk Management',
    description: 'Evaluation of risk identification, assessment, and mitigation processes.',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Internal Controls',
    description: 'Review of controls designed to ensure operational efficiency and reliability.',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    name: 'Operational Audit',
    description: 'Evaluation of operational processes and procedures for efficiency.',
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '7',
    name: 'Tax Audit',
    description: 'Review of tax compliance, filings, and related financial obligations.',
    isActive: false,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: '8',
    name: 'Environmental & Sustainability Audit',
    description: 'Assessment of environmental impact, ESG compliance, and sustainability practices.',
    isActive: true,
    createdAt: new Date('2024-03-01'),
  },
];