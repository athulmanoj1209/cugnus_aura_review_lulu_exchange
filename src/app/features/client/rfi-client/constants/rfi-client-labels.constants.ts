/* ── Tag severities for client RFI values ─────────────────────────────────
 * Display text on this module is translated with $localize (i18n ids), so it
 * stays in the components; only the non-translated mappings live here.
 */

import {
  RFI_STATUS_SEVERITY,
  type TagSeverity,
} from '@/app/features/audits/audit-execution/rfi/constants/rfi-labels.constants';
import { RFI_CLIENT_IN_PROGRESS_STATUS } from './rfi-client.constants';

/** Status badge colour on the client drawer — the RFI map plus the client-only 'in-progress'. */
export const RFI_CLIENT_STATUS_SEVERITY: Record<string, TagSeverity> = {
  ...RFI_STATUS_SEVERITY,
  [RFI_CLIENT_IN_PROGRESS_STATUS]: 'info',
};
