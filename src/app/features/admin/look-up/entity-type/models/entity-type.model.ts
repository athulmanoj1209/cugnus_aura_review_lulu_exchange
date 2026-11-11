export interface EntityType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SortOption {
  label: string;
  value: string;
}

export const ENTITY_TYPE_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_ENTITY_TYPES: EntityType[] = [
  { id: '1',  name: 'Corporate',              description: 'Legally incorporated business entity.',                          isActive: true,  createdAt: new Date('2024-01-10') },
  { id: '2',  name: 'Government',             description: 'Entity owned or controlled by a government body.',               isActive: true,  createdAt: new Date('2024-01-18') },
  { id: '3',  name: 'Non-Governmental Organisation', description: 'Non-profit entity operating independently of government.', isActive: true,  createdAt: new Date('2024-02-05') },
  { id: '4',  name: 'Financial Institution',  description: 'Banks, insurance companies, and investment firms.',              isActive: true,  createdAt: new Date('2024-02-14') },
  { id: '5',  name: 'Regulatory Body',        description: 'Authority overseeing compliance within an industry.',            isActive: true,  createdAt: new Date('2024-03-01') },
  { id: '6',  name: 'Subsidiary',             description: 'Company controlled by a parent/holding company.',                isActive: true,  createdAt: new Date('2024-03-12') },
  { id: '7',  name: 'Joint Venture',          description: 'Business arrangement between two or more parties.',              isActive: false, createdAt: new Date('2024-04-03') },
  { id: '8',  name: 'Trust',                  description: 'Entity holding assets on behalf of beneficiaries.',              isActive: true,  createdAt: new Date('2024-04-20') },
  { id: '9',  name: 'Cooperative',            description: 'Member-owned and democratically controlled organisation.',       isActive: false, createdAt: new Date('2024-05-08') },
  { id: '10', name: 'Special Purpose Vehicle', description: 'Entity created for a specific, limited purpose.',               isActive: true,  createdAt: new Date('2024-05-22') },
];