import type { ScopeLibraryItem } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { RfiLibraryItem } from '@/app/features/audits/libraries/rfi-library/models/rfi-library-list.model';

import type { LibRequestRiskLevels, LibRequestStatuses, LibRequestTypes } from '../constants/library-request.constants';

export type LibRequestType = typeof LibRequestTypes[keyof typeof LibRequestTypes];
export type LibRequestStatus = typeof LibRequestStatuses[keyof typeof LibRequestStatuses];
export type RiskLevel = typeof LibRequestRiskLevels[keyof typeof LibRequestRiskLevels];

export interface LibRequestRecord {
  id: string;
  name: string;
  type: LibRequestType;
  /** Display labels used by the requests list/filters. */
  company: string;
  division: string;
  subDivision: string;
  category: string;
  risk: RiskLevel;
  status: LibRequestStatus;
  submittedBy: string;
  submittedDate: string;
  parentEntity: string;
  /** Full ScopeLibraryItem record — present for type === 'Scope' | 'Subscope'. */
  scopePayload?: ScopeLibraryItem;
  /** Full RfiLibraryItem record — present for type === 'RFI'. */
  rfiPayload?: RfiLibraryItem;
}

export type LibRequest = LibRequestRecord;
