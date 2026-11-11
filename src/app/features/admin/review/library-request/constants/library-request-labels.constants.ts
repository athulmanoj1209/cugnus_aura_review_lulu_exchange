/* ── Icons & risk mapping for library request values ──────────────────────
 * Display text on this page is translated with $localize (i18n ids), so it
 * stays in the component; only the non-translated mappings live here.
 */

import type { RiskCategory } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { RiskLevel } from '../models/library-request.model';

/** Type icon on the cards / rows. Unknown types use LIB_REQUEST_TYPE_DEFAULT_ICON. */
export const LIB_REQUEST_TYPE_ICONS: Record<string, string> = {
  Scope: 'pi-folder',
  Subscope: 'pi-file-check',
  RFI: 'pi-envelope',
};
export const LIB_REQUEST_TYPE_DEFAULT_ICON = 'pi-tag';

/** Sort indicator on the list-view column headers. */
export const LIB_REQUEST_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  Asc: 'pi-sort-amount-up-alt',
  Desc: 'pi-sort-amount-down-alt',
} as const;

/**
 * ScopeLibraryItem carries no severity/risk field of its own (unlike
 * divisions/sub-divisions/scopes) — this maps its `riskCategory` to a
 * reasonable display risk so the queue can still show/filter a Risk column
 * for scope & sub-scope items.
 */
export const LIB_REQUEST_RISK_BY_CATEGORY: Record<RiskCategory, RiskLevel> = {
  'Financial Risk': 'high',
  'Fraud Risk': 'high',
  'IT General Controls': 'high',
  'Compliance Risk': 'high',
  'Access Management': 'medium',
  'Change Management': 'medium',
  'Vendor Risk': 'medium',
  'Data Privacy': 'medium',
  'Operational Risk': 'medium',
  'Business Continuity': 'low',
};
