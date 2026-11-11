export interface ApplicableFrameworkItem {
  id: number;
  name: string;
  code: string;
  description: string;
  version: string;
  issuingAuthority: string;
  createdOn: string;
  status: 'active' | 'inactive';
}
