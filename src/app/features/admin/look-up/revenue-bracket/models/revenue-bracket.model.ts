export interface RevenueBracket {
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

export const REVENUE_BRACKET_SORT_OPTIONS: SortOption[] = [
  { label: 'Name (A–Z)',   value: 'name_asc'  },
  { label: 'Name (Z–A)',   value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc'  },
];

export const MOCK_REVENUE_BRACKETS: RevenueBracket[] = [
  { id: '1',  name: 'Below $1 Million',          description: 'Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.Annual revenue under $1 million.',                          isActive: true,  createdAt: new Date('2024-01-10') },
  { id: '2',  name: '$1M – $10 Million',          description: 'Annual revenue between $1M and $10M.',                     isActive: true,  createdAt: new Date('2024-01-18') },
  { id: '3',  name: '$10M – $50 Million',         description: 'Annual revenue between $10M and $50M.',                    isActive: true,  createdAt: new Date('2024-02-05') },
  { id: '4',  name: '$50M – $100 Million',        description: 'Annual revenue between $50M and $100M.',                   isActive: true,  createdAt: new Date('2024-02-14') },
  { id: '5',  name: '$100M – $500 Million',       description: 'Annual revenue between $100M and $500M.',                  isActive: true,  createdAt: new Date('2024-03-01') },
  { id: '6',  name: '$500M – $1 Billion',         description: 'Annual revenue between $500M and $1 billion.',             isActive: true,  createdAt: new Date('2024-03-12') },
  { id: '7',  name: 'Above $1 Billion',           description: 'Annual revenue exceeding $1 billion.',                     isActive: true,  createdAt: new Date('2024-04-03') },
  { id: '8',  name: 'Not Disclosed',              description: 'Revenue information not publicly available.',               isActive: false, createdAt: new Date('2024-04-20') },
];