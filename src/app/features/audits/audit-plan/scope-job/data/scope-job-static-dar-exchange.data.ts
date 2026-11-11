// Scope-job seed for the 'dar-exchange' internal-audit client.
// Generated from DAR Exchange's real, currently-Approved scopes in
// audit-scope-static-indi-org.data.ts instead of being hand-written, so this
// list stays in sync with what Audit Scope Management shows as approved.

import { DAR_EXCHANGE_SCOPE_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import { SCOPE_JOB_ID_PREFIX } from '../constants/scope-job.constants';
import type { ScopeJob } from '../models/scope-job.model';
import { jobsForApprovedScopes } from './scope-job-generator';

export const DAR_EXCHANGE_SCOPE_JOBS: ScopeJob[] =
  jobsForApprovedScopes(DAR_EXCHANGE_SCOPE_COMPANIES, SCOPE_JOB_ID_PREFIX);
