import type { ScopeRequestRiskLevels, ScopeRequestStatuses, ScopeRequestTypes } from '../constants/scope-request.constants';

export type ScopeRequestType = typeof ScopeRequestTypes[keyof typeof ScopeRequestTypes];
export type ScopeRequestStatus = typeof ScopeRequestStatuses[keyof typeof ScopeRequestStatuses];
export type RiskLevel = typeof ScopeRequestRiskLevels[keyof typeof ScopeRequestRiskLevels];

export interface ScopeRequestRecord {
  id: string;
  name: string;
  type: ScopeRequestType;
  /** Display labels used by the requests list/filters. */
  company: string;
  division: string;
  subDivision: string;
  risk: RiskLevel;
  status: ScopeRequestStatus;
  submittedBy: string;
  submittedDate: string;
  dueDate: string | null;
  parentEntity: string;
  /** Full StaticScope record — everything the Add/Edit Audit Scope drawer needs. */
  scopePayload: Record<string, unknown>;
}

export type ScopeRequest = ScopeRequestRecord;
