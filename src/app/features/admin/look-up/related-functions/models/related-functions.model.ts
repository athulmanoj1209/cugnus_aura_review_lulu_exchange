export interface RelatedFunction {
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

export const RELATED_FUNCTION_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_RELATED_FUNCTIONS: RelatedFunction[] = [
  { id: '1', name: 'Finance & Accounting', description: 'Functions related to financial reporting, accounting, and treasury management.', isActive: true, createdAt: new Date('2024-01-10') },
  { id: '2', name: 'Human Resources', description: 'Functions covering recruitment, payroll, employee management, and compliance.', isActive: true, createdAt: new Date('2024-01-10') },
  { id: '3', name: 'Information Technology', description: 'IT operations, infrastructure, software development, and cybersecurity functions.', isActive: true, createdAt: new Date('2024-01-15') },
  { id: '4', name: 'Procurement & Supply Chain', description: 'Vendor management, purchasing, logistics, and supply chain operations.', isActive: true, createdAt: new Date('2024-01-15') },
  { id: '5', name: 'Legal & Compliance', description: 'Legal advisory, regulatory compliance, and risk management functions.', isActive: true, createdAt: new Date('2024-02-01') },
  { id: '6', name: 'Operations', description: 'Core business operations, process management, and service delivery.', isActive: true, createdAt: new Date('2024-02-01') },
  { id: '7', name: 'Sales & Marketing', description: 'Revenue generation, customer acquisition, and marketing activities.', isActive: false, createdAt: new Date('2024-02-10') },
  { id: '8', name: 'Internal Audit', description: 'Independent assurance and advisory function within the organization.', isActive: true, createdAt: new Date('2024-03-01') },
];