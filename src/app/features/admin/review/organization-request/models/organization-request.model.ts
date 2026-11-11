import type { OrgRequestRiskLevels, OrgRequestStatuses, OrgRequestTypes } from '../constants/organization-request.constants';

export type OrgRequestType = typeof OrgRequestTypes[keyof typeof OrgRequestTypes];
// Sub-Divisions store 'pending_approval' instead of 'pending_review' (to avoid
// colliding with their pre-existing 'pending' status) — both mean the same
// thing here: awaiting reviewer decision. Divisions similarly store an
// approved division's audit status as 'not_planned' (its audit simply hasn't
// been scheduled yet, which is the same real-world state as "approved and
// not yet acted on") rather than a separate 'approved' value — both mean
// the same thing here too.
export type OrgRequestStatus = typeof OrgRequestStatuses[keyof typeof OrgRequestStatuses];
export type RiskLevel = typeof OrgRequestRiskLevels[keyof typeof OrgRequestRiskLevels];

export interface OrgRequestRecord {
  id: string;
  name: string;
  type: OrgRequestType;
  /** Display labels used by the requests list/filters (company/division/sub-division names). */
  company: string;
  division: string;
  subDivision: string;
  risk: RiskLevel;
  status: OrgRequestStatus;
  submittedBy: string;
  submittedDate: string;
  location: string;
  parentEntity: string;
  /** Full Add Company drawer payload — present only for type === 'Company'. */
  companyPayload?: Record<string, unknown>;
  /** Full Add Division drawer payload — present only for type === 'Division'. */
  divisionPayload?: Record<string, unknown>;
  /** Full Add Sub-Division drawer payload — present only for type === 'Sub-Division'. */
  subDivisionPayload?: Record<string, unknown>;
}

export type OrgRequest = OrgRequestRecord;
