import type { PersonnelProfile, ReviewerProfile } from '@/app/features/audits/organization/divisions/models/division-list.model';
import type { StaticSubDivision, SubDivisionEditableFields } from './sub-division-static-data.model';
import type {
  SubDivisionApprovalAction,
  SubDivisionDrawerMode,
  SubDivisionScopeNodeType,
} from '../constants/sub-division.constants';

export interface ProfileSubScope {
  subScopeName: string;
  auditFrequency?: string;
  riskRating?: string;
  assignedAuditors?: string[];
  assignedReviewers?: string[];
  startDate: string;
  endDate: string;
}

export interface ProfileScope {
  scopeName: string;
  scopeType?: string;
  auditFrequency?: string;
  riskRating?: string;
  assignedAuditors?: string[];
  assignedReviewers?: string[];
  startDate: string;
  endDate: string;
  subScopes?: ProfileSubScope[];
}

export type ProfileSubDivision = Omit<StaticSubDivision, 'scopes'> & { scopes?: ProfileScope[] };

export interface ScopeAssignment {
  name: string;
  type: SubDivisionScopeNodeType;
  parentScope?: string;
  startDate: string;
  endDate: string;
}

export interface AuditorInfo extends PersonnelProfile {
  assignedItems: ScopeAssignment[];
}

export interface ReviewerInfo extends ReviewerProfile {
  reviewItems: ScopeAssignment[];
}

export interface FlatScopeItem {
  name: string;
  type: SubDivisionScopeNodeType;
  parentScopeName?: string;
  scopeType?: string;
  auditFrequency?: string;
  riskRating?: string;
  subScopeCount?: number;
}

export interface SubDivisionFormSubDivision extends StaticSubDivision {
  divisionCode: string;
}

export interface SubDivisionDrawerData {
  mode: SubDivisionDrawerMode;
  subDivision?: SubDivisionFormSubDivision | null;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
}

export interface SubDivisionDrawerResult {
  approval?: { action: SubDivisionApprovalAction; notes: string };
  /**
   * 'add' mode: the brand-new sub-division to insert. `auditStatus` is
   * excluded — the form has no control for it; upsertStaticSubDivision()
   * always starts a new sub-division at `'pending_approval'`.
   */
  subDivision?: Omit<SubDivisionFormSubDivision, 'createdAt' | 'auditStatus'>;
  /** 'edit' mode: only the fields the form edits, merged into the existing record. */
  subDivisionUpdate?: SubDivisionEditableFields;
  /** 'edit' mode: the sub-division's code before this edit, to find the record being updated. */
  previousSubDivisionCode?: string;
}

export interface SubDivisionProfileDrawerData {
  subDivision: ProfileSubDivision;
  divisionName?: string;
}
