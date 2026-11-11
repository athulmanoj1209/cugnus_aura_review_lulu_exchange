import type { FindingProfileData } from '@/app/features/audits/audit-execution/findings/profile/findings-profile.component';
import type { Evidence } from '@/app/features/audits/audit-execution/evidence/list/evidence-list.component';
import type { Observation } from '@/app/features/audits/audit-execution/observation/list/observation-list.component';
import type { AuditorRiskLevels } from '../constants/auditor-dashboard.constants';

export interface FindingRow {
  finding: string; audit: string; scope: string; risk: string; status: string; owner: string;
  detail: FindingProfileData;
}

export interface EvidenceRow {
  evidence: string; scope: string; type: string; risk: string; status: string; dueDate: string;
  detail: Evidence;
}

export interface ObservationRow {
  observation: string; audit: string; scope: string; riskRating: string; status: string; createdDate: string;
  detail: Observation;
}

export interface FindingCard { label: string; value: string; icon: string; cardClass: string; view?: string; }
export interface ObservationCard { label: string; value: string; icon: string; cardClass: string; status?: string; riskBand?: typeof AuditorRiskLevels.High | typeof AuditorRiskLevels.Medium; }
export interface EvidenceCard { label: string; value: string; icon: string; cardClass: string; status?: string; }
