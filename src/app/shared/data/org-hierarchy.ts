export const ALL_COMPANIES = [
  { label: 'Crowe UAE', value: 'crowe-uae' },
  { label: 'Crowe India', value: 'crowe-india' },
  { label: 'Crowe US', value: 'crowe-us' },
  { label: 'Crowe UK', value: 'crowe-uk' },
];

export const ALL_BRANCHES = [
  { label: 'Dubai', value: 'dubai', companyId: 'crowe-uae' },
  { label: 'Abu Dhabi', value: 'abu-dhabi', companyId: 'crowe-uae' },
  { label: 'Sharjah', value: 'sharjah', companyId: 'crowe-uae' },
  { label: 'Mumbai', value: 'mumbai', companyId: 'crowe-india' },
  { label: 'Delhi', value: 'delhi', companyId: 'crowe-india' },
  { label: 'Bangalore', value: 'bangalore', companyId: 'crowe-india' },
  { label: 'New York', value: 'new-york', companyId: 'crowe-us' },
  { label: 'Chicago', value: 'chicago', companyId: 'crowe-us' },
  { label: 'London', value: 'london', companyId: 'crowe-uk' },
  { label: 'Manchester', value: 'manchester', companyId: 'crowe-uk' },
];

export const ALL_DEPARTMENTS = [
  { label: 'Finance', value: 'finance', branchIds: ['dubai', 'abu-dhabi', 'sharjah', 'mumbai', 'delhi', 'new-york', 'chicago', 'london', 'manchester'] },
  { label: 'IT', value: 'it', branchIds: ['dubai', 'mumbai', 'bangalore', 'new-york', 'london'] },
  { label: 'HR', value: 'hr', branchIds: ['dubai', 'abu-dhabi', 'mumbai', 'manchester'] },
  { label: 'Operations', value: 'operations', branchIds: ['dubai', 'sharjah', 'bangalore', 'chicago', 'manchester'] },
  { label: 'Legal', value: 'legal', branchIds: ['dubai', 'new-york', 'london'] },
  { label: 'Compliance', value: 'compliance', branchIds: ['dubai', 'abu-dhabi', 'delhi', 'new-york', 'london'] },
];

// Maps department → scope library IDs relevant to that department
export const DEPARTMENT_SCOPE_IDS: Record<string, string[]> = {
  'finance':    ['sl-004', 'sl-008'],
  'it':         ['sl-001', 'sl-002', 'sl-005'],
  'hr':         ['sl-009', 'sl-010'],
  'operations': ['sl-003', 'sl-009'],
  'legal':      ['sl-006', 'sl-010'],
  'compliance': ['sl-006', 'sl-008', 'sl-010'],
};
