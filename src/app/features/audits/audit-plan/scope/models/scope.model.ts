import type { Scope, SubScope } from '@/app/features/audits/organization/divisions/models/division-list.model';
import type { StaticScope } from './scope-static-data.model';
import type { ScopeApprovalAction, ScopeDrawerMode } from '../constants/scope.constants';

export interface ScopeDrawerData {
  mode: ScopeDrawerMode;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
  scope?: any | null;
  initialTab?: number;
  subScopeIndex?: number;
  availableScopeOptions?: { label: string; value: string }[];
}

export interface ScopeDrawerResult {
  saved?: any;
  /** New scope/sub-scope built from the form (add mode). */
  scope?: Omit<StaticScope, 'id'>;
  /** Updated fields for the scope/sub-scope being edited (edit mode). */
  scopeUpdate?: Omit<StaticScope, 'id'>;
  approval?: { action: ScopeApprovalAction; notes: string };
}

export interface ScopeProfileDrawerData {
  scope: Scope | null;
  subscope?: SubScope | null;
  parentName?: string;
}
