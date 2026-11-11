export interface OwnershipType {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SortOption {
  label: string;
  value: string;
}

export const OWNERSHIP_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',    value: 'name_asc'  },
  { label: 'Name (Z–A)',    value: 'name_desc' },
  { label: 'Newest First',  value: 'date_desc' },
  { label: 'Oldest First',  value: 'date_asc'  },
];

export const MOCK_OWNERSHIP_TYPES: OwnershipType[] = [
  { id: '1',  name: 'Sole Proprietorship',  code: 'SOLE',  description: 'Business owned and operated by a single individual.',             isActive: true,  createdAt: new Date('2024-01-10') },
  { id: '2',  name: 'Partnership',          code: 'PRTN',  description: 'Business owned by two or more individuals sharing profits.',       isActive: true,  createdAt: new Date('2024-01-15') },
  { id: '3',  name: 'Limited Liability Company', code: 'LLC', description: 'Hybrid structure with limited liability for owners.',          isActive: true,  createdAt: new Date('2024-02-01') },
  { id: '4',  name: 'Public Limited Company', code: 'PLC',  description: 'Company whose shares are traded on a public stock exchange.',     isActive: true,  createdAt: new Date('2024-02-10') },
  { id: '5',  name: 'Private Limited Company', code: 'PVT', description: 'Company with limited liability but shares not publicly traded.',  isActive: true,  createdAt: new Date('2024-03-05') },
  { id: '6',  name: 'Government Entity',    code: 'GOVT',  description: 'Entity owned or controlled by a government body.',                isActive: true,  createdAt: new Date('2024-03-20') },
  { id: '7',  name: 'Non-Profit Organisation', code: 'NPO', description: 'Organisation operating for a purpose other than profit.',        isActive: false, createdAt: new Date('2024-04-01') },
  { id: '8',  name: 'Joint Venture',        code: 'JV',    description: 'Business arrangement between two or more parties.',               isActive: true,  createdAt: new Date('2024-04-15') },
  { id: '9',  name: 'Cooperative',          code: 'COOP',  description: 'Organisation owned and operated by its members.',                 isActive: false, createdAt: new Date('2024-05-01') },
  { id: '10', name: 'Trust',                code: 'TRST',  description: 'Arrangement where assets are held by one party for another.',     isActive: true,  createdAt: new Date('2024-05-20') },
];