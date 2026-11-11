export interface ComplianceScopeDetail {
  name: string;
  regulation: string;
  coverage: number;
  status: 'Mapped' | 'Partial' | 'Not Mapped';
  nextRenewal: string;
  // Drawer-specific fields
  description: string;
  owner: string;
  auditor: string;
  lastAssessmentDate: string;
  controlsMapped: number;
  totalControls: number;
  gaps: string[];
  requirements: string[];
}
