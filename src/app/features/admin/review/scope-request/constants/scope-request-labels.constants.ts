/* ── Icons & status mapping for scope request values ──────────────────────
 * Display text on this page is translated with $localize (i18n ids), so it
 * stays in the component; only the non-translated mappings live here.
 */

import { ScopeWorkflowStatuses } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import type { ScopeRequestStatus } from '../models/scope-request.model';

/** Type icon on the cards / rows. Unknown types use SCOPE_REQUEST_TYPE_DEFAULT_ICON. */
export const SCOPE_REQUEST_TYPE_ICONS: Record<string, string> = {
  Scope: 'pi-folder',
  Subscope: 'pi-file-check',
};
export const SCOPE_REQUEST_TYPE_DEFAULT_ICON = 'pi-tag';

/** Sort indicator on the list-view column headers. */
export const SCOPE_REQUEST_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  Asc: 'pi-sort-amount-up-alt',
  Desc: 'pi-sort-amount-down-alt',
} as const;

/**
 * Scope workflowStatus (Title Case) → queue status. 'Not Started' is included
 * alongside 'Approved' — an approved scope's audit simply hasn't started
 * yet, which is the same real-world state as "approved and not yet acted on"
 * (mirrors division-static-data.ts's not_planned/approved equivalence), so
 * any scope already sitting at 'Not Started' (freshly approved or
 * pre-existing) shows up in the queue too. Any other workflowStatus keeps
 * the scope out of the queue.
 */
export const SCOPE_REQUEST_STATUS_BY_WORKFLOW: Record<string, ScopeRequestStatus> = {
  [ScopeWorkflowStatuses.PendingReview]: 'pending_review',
  [ScopeWorkflowStatuses.Approved]: 'approved',
  [ScopeWorkflowStatuses.NotStarted]: 'approved',
  [ScopeWorkflowStatuses.Rejected]: 'rejected',
};
