import type { ScopeLibraryItem } from './scope-library-list.model';
import type { ScopeLibraryApprovalAction, ScopeLibraryDrawerMode } from '../constants/scope-library.constants';

export interface ScopeLibraryDrawerData {
  mode: ScopeLibraryDrawerMode;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
  scopeItem?: ScopeLibraryItem | null;
  allScopes: ScopeLibraryItem[];
}

export interface ScopeLibraryDrawerResult {
  saved?: ScopeLibraryItem;
  approval?: { action: ScopeLibraryApprovalAction; notes: string };
}

export interface ScopeLibraryProfileDrawerData {
  scopeItem: ScopeLibraryItem;
}
