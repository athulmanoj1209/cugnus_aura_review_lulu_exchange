import type { Division } from './division-list.model';
import type { DivisionEditableFields } from './division-static-data.model';
import type { DivisionApprovalAction, DivisionDrawerMode } from '../constants/division.constants';

export interface DivisionDrawerData {
  mode: DivisionDrawerMode;
  division?: any | null;
  initialTab?: number;
  approvalMode?: boolean;
  /** Current workflow status of the request being reviewed — approve/reject controls only show when this is 'pending_review'. */
  requestStatus?: string;
}

export interface DivisionDrawerResult {
  /** 'add' mode: the brand-new division to insert. */
  division?: any;
  /** 'edit' mode: only the fields the form edits, merged into the existing record. */
  divisionUpdate?: DivisionEditableFields;
  approval?: { action: DivisionApprovalAction; notes: string };
}

export interface DivisionProfileDrawerData {
  division: Division;
}
