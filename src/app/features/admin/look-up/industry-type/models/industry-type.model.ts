// =============================================================================
//  industry-type.model.ts
//  Place in:  src/app/Admin/models/industry-type.model.ts  (adjust as needed)
// =============================================================================

export interface IndustryType {
  id:          string;
  name:        string;        // e.g. "Financial Services"
  code?:       string;        // short identifier, e.g. "FIN"
  description?: string;
  isActive:    boolean;
  createdAt:   Date;
  updatedAt?:  Date;
}

// ── Sort options ───────────────────────────────────────────────────────────────

export interface SortOption {
  label: string;
  value: string;
}

export const INDUSTRY_SORT_OPTIONS: SortOption[] = [
  { label: 'Name A–Z',       value: 'name_asc'   },
  { label: 'Name Z–A',       value: 'name_desc'  },
  { label: 'Newest First',   value: 'date_desc'  },
  { label: 'Oldest First',   value: 'date_asc'   },
];

// ── Mock data ──────────────────────────────────────────────────────────────────

export const MOCK_INDUSTRY_TYPES: IndustryType[] = [
  { id: 'it-001', name: 'Financial Services',    code: 'FIN',  isActive: true,  createdAt: new Date('2025-01-10'), description: 'Banks, insurance, investment firms' },
  { id: 'it-002', name: 'Healthcare',             code: 'HLT',  isActive: true,  createdAt: new Date('2025-01-15'), description: 'Hospitals, pharma, medical devices' },
  { id: 'it-003', name: 'Manufacturing',          code: 'MFG',  isActive: true,  createdAt: new Date('2025-02-01') },
  { id: 'it-004', name: 'Retail & E-Commerce',   code: 'RET',  isActive: true,  createdAt: new Date('2025-02-12') },
  { id: 'it-005', name: 'Information Technology', code: 'IT',   isActive: true,  createdAt: new Date('2025-03-05'), description: 'Software, IT services, data centers' },
  { id: 'it-006', name: 'Real Estate',            code: 'RE',   isActive: false, createdAt: new Date('2025-03-18') },
  { id: 'it-007', name: 'Energy & Utilities',     code: 'ENG',  isActive: true,  createdAt: new Date('2025-04-02'), description: 'Oil, gas, electricity, water' },
  { id: 'it-008', name: 'Telecommunications',     code: 'TEL',  isActive: true,  createdAt: new Date('2025-04-20') },
  { id: 'it-009', name: 'Construction',           code: 'CON',  isActive: false, createdAt: new Date('2025-05-01') },
  { id: 'it-010', name: 'Education',              code: 'EDU',  isActive: true,  createdAt: new Date('2025-05-14') },
];