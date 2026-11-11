// Scope-job seed for the 'xyz-broadcast' internal-audit client.
// Generated from XYZ Broadcast's Approved scopes in
// audit-scope-static-xyz-org.data.ts, same as the DAR Exchange seed.

import { XYZ_BROADCAST_SCOPE_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-xyz-org.data';
import { SCOPE_JOB_ID_PREFIX } from '../constants/scope-job.constants';
import type { ScopeJob } from '../models/scope-job.model';
import { jobsForApprovedScopes } from './scope-job-generator';

export const XYZ_BROADCAST_SCOPE_JOBS: ScopeJob[] =
  jobsForApprovedScopes(XYZ_BROADCAST_SCOPE_COMPANIES, SCOPE_JOB_ID_PREFIX);
