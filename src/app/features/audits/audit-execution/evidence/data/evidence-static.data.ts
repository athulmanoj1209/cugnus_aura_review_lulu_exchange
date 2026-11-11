// Picks the evidence seed for the active client.
//
// To add a new client's evidence:
//   1. Create evidence-static-<client>.data.ts exporting an Evidence[] whose
//      company / branch / department / scope values match that client's org seeds.
//   2. Add it to EVIDENCE_BY_INTERNAL_AUDIT_CLIENT below. Because the map is typed
//      Record<InternalAuditClientKey, ...>, the build fails if a client key in
//      client-mode.ts has no entry here.
//
// Evaluated at import time (like the other *-static data files), so it reads the
// CLIENT_MODE_VALUE / INTERNAL_AUDIT_CLIENT_KEY_VALUE constants directly.

import {
  CLIENT_MODE_VALUE,
  INTERNAL_AUDIT_CLIENT_KEY_VALUE,
  type InternalAuditClientKey,
} from '@/app/core/config/client-mode';
import type { Evidence } from '../models/evidence.model';
import { AUDIT_FIRM_EVIDENCE } from './evidence-static-audit-firm.data';
import { DAR_EXCHANGE_EVIDENCE } from './evidence-static-dar-exchange.data';
import { XYZ_BROADCAST_EVIDENCE } from './evidence-static-xyz-broadcast.data';
import { LULU_EXCHANGE_EVIDENCE } from './evidence-static-lulu-exchange.data';

const EVIDENCE_BY_INTERNAL_AUDIT_CLIENT: Record<InternalAuditClientKey, Evidence[]> = {
  'dar-exchange': DAR_EXCHANGE_EVIDENCE,
  'xyz-broadcast': XYZ_BROADCAST_EVIDENCE,
  'lulu-exchange': LULU_EXCHANGE_EVIDENCE,
};

export const EVIDENCE_SEED: Evidence[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? EVIDENCE_BY_INTERNAL_AUDIT_CLIENT[INTERNAL_AUDIT_CLIENT_KEY_VALUE]
    : AUDIT_FIRM_EVIDENCE;
