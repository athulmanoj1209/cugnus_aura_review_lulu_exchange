export interface RfiCategory {
  id:          string;
  name:        string;
  description?: string;
  isActive:    boolean;
  createdAt:   Date;
  updatedAt?:  Date;
}

export interface SortOption { label: string; value: string; }

export const RFI_CATEGORY_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_RFI_CATEGORIES: RfiCategory[] = [
  { id: '1', name: 'Financial Information', description: 'Requests related to financial statements, budgets, and accounting records.', isActive: true, createdAt: new Date('2024-01-10') },
  { id: '2', name: 'Policy & Procedure', description: 'Requests for internal policies, procedures, and operational guidelines.', isActive: true, createdAt: new Date('2024-01-10') },
  { id: '3', name: 'Contracts & Agreements', description: 'Requests for contracts, vendor agreements, and legal documents.', isActive: true, createdAt: new Date('2024-01-15') },
  { id: '4', name: 'IT Systems & Access', description: 'Requests related to system access logs, IT configurations, and software records.', isActive: true, createdAt: new Date('2024-01-15') },
  { id: '5', name: 'HR & Payroll', description: 'Requests for employee records, payroll data, and HR documentation.', isActive: true, createdAt: new Date('2024-02-01') },
  { id: '6', name: 'Compliance & Regulatory', description: 'Requests for regulatory filings, compliance certificates, and licences.', isActive: true, createdAt: new Date('2024-02-01') },
  { id: '7', name: 'Operational Records', description: 'Requests for operational reports, meeting minutes, and process records.', isActive: false, createdAt: new Date('2024-02-10') },
  { id: '8', name: 'General Correspondence', description: 'Miscellaneous communication and correspondence not covered by other categories.', isActive: true, createdAt: new Date('2024-03-01') },
];