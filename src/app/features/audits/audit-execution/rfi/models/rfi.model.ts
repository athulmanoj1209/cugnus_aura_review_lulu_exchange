import type { EnrichedRFI } from './rfi-list.model';

export interface RfiDrawerData {
  currentUser?: string;
}

export interface RfiProfileDrawerData {
  rfi: EnrichedRFI;
  currentUser?: string;
}

// ── Per-file upload entry (Add RFI) ───────────────────────────────────────────
export interface UploadedFileEntry {
  file: File;
  description: string;
}

// ── Static backend document entry (View RFI) ──────────────────────────────────
export interface StaticDoc {
  name: string;
  url: string;
  description: string;
}
