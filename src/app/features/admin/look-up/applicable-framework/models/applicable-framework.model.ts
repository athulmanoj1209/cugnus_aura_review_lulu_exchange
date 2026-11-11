export interface FrameworkEntry {
  name: string;
  code: string;
  description: string;
  version: string;
  issuingAuthority: string;
  status: 'active' | 'inactive';
}
