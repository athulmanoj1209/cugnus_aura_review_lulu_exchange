import type { ScopeLibraryItem } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { RfiLibraryItem } from './rfi-library-list.model';
import type { RfiLibraryApprovalAction, RfiLibraryDrawerMode } from '../constants/rfi-library.constants';

export interface RfiLibraryDrawerData {
  mode: RfiLibraryDrawerMode;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
  rfiItem?: RfiLibraryItem | null;
  allScopes: ScopeLibraryItem[];
}

export interface RfiLibraryDrawerResult {
  saved?: RfiLibraryItem;
  approval?: { action: RfiLibraryApprovalAction; notes: string };
}

export interface RfiLibraryProfileDrawerData {
  rfiItem: RfiLibraryItem;
}
