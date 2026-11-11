import type { EnrichedRFI } from '@/app/features/audits/audit-execution/rfi/models/rfi-list.model';

export interface RfiClientDrawerData {
  rfi: EnrichedRFI;
  currentUser?: string;
  viewOnly?: boolean;
}

export interface UploadedFileEntry {
  file: File;
  description: string;
}

export interface StaticDoc {
  name: string;
  url: string;
  description: string;
}
