import type { EvidenceReviewStatus, EvidenceRisk, EvidenceType } from '../constants/evidence.constants';

export interface EvidenceFile {
  name: string;
  size: number;
  url?: string;
  file?: File;
}

export interface Evidence {
  id: string;
  title: string;
  evidenceType: EvidenceType;
  scope: string;
  subscope: string;
  taskId: string;
  taskTitle: string;
  /** Not every evidence item is tied to a logged finding yet (e.g. one just added via "New Evidence"). */
  findingId?: string;
  findingTitle?: string;
  createdDate: Date;
  files: EvidenceFile[];
  description?: string;
  uploadedBy?: string;
  /** Company name — must match a companyName in the active client's org seed for the filters to match. */
  company?: string;
  /** Division name (UI label "Division"). */
  branch?: string;
  /** Sub-Division name (UI label "Sub-Division"). */
  department?: string;
  isActive?: boolean;
  /** Defaults to 'uploaded' when absent — every legacy record here already represents uploaded evidence. */
  status?: EvidenceReviewStatus;
  risk?: EvidenceRisk;
}
