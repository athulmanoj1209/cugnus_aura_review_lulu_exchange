// Picks the scope-job seed for the active client.
//
// To add a new client's scope jobs:
//   1. Create scope-job-static-<client>.data.ts exporting a ScopeJob[] whose
//      company / division / subDivision / scope values match that client's org seeds.
//   2. Add it to SCOPE_JOBS_BY_INTERNAL_AUDIT_CLIENT below. Because the map is typed
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
import type { ScopeJob } from '../models/scope-job.model';
import { AUDIT_FIRM_SCOPE_JOBS } from './scope-job-static-audit-firm.data';
import { DAR_EXCHANGE_SCOPE_JOBS } from './scope-job-static-dar-exchange.data';
import { XYZ_BROADCAST_SCOPE_JOBS } from './scope-job-static-xyz-broadcast.data';
import { LULU_EXCHANGE_SCOPE_JOBS } from './scope-job-static-lulu-exchange.data';

const SCOPE_JOBS_BY_INTERNAL_AUDIT_CLIENT: Record<InternalAuditClientKey, ScopeJob[]> = {
  'dar-exchange': DAR_EXCHANGE_SCOPE_JOBS,
  'xyz-broadcast': XYZ_BROADCAST_SCOPE_JOBS,
  'lulu-exchange': LULU_EXCHANGE_SCOPE_JOBS,
};

export const SCOPE_JOB_SEED: ScopeJob[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? SCOPE_JOBS_BY_INTERNAL_AUDIT_CLIENT[INTERNAL_AUDIT_CLIENT_KEY_VALUE]
    : AUDIT_FIRM_SCOPE_JOBS;
