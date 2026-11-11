import type { FindingProfileData } from '@/app/features/audits/audit-execution/findings/profile/findings-profile.component';
import type { Evidence } from '@/app/features/audits/audit-execution/evidence/list/evidence-list.component';
import type { Observation } from '@/app/features/audits/audit-execution/observation/list/observation-list.component';
import type { AuditorApprovalRowTypes, AuditorReviewTypes } from '../constants/auditor-dashboard.constants';

export type ApprovalRowType = typeof AuditorApprovalRowTypes[keyof typeof AuditorApprovalRowTypes];
export type ReviewType = typeof AuditorReviewTypes[keyof typeof AuditorReviewTypes];

export interface ApprovalRow {
  item: string;
  type: ApprovalRowType;
  submittedOn: string;
  currentStage: string;
  status: string;
  evidenceDetail?: Evidence;
  findingDetail?: FindingProfileData;
  observationDetail?: Observation;
}

export interface SummaryCard {
  label: string;
  value: string;
  icon: string;
  cardClass: string;
  reviewType?: ReviewType;
}
