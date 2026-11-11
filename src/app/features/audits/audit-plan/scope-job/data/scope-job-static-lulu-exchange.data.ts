// Scope-job seed for the 'lulu-exchange' internal-audit client.
// Generated from Lulu International Exchange's Approved scopes in
// audit-scope-static-lulu-org.data.ts instead of being hand-written, so the
// job scopeIds always match the scope seed (the Audit Plan adapter drops any
// scope with no matching job) and this list stays in sync with what Audit
// Scope Management shows as approved.

import { LULU_EXCHANGE_SCOPE_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-lulu-org.data';
import { SCOPE_JOB_ID_PREFIX } from '../constants/scope-job.constants';
import type { ScopeJob } from '../models/scope-job.model';
import { jobsForApprovedScopes } from './scope-job-generator';

export const LULU_EXCHANGE_SCOPE_JOBS: ScopeJob[] =
  jobsForApprovedScopes(LULU_EXCHANGE_SCOPE_COMPANIES, SCOPE_JOB_ID_PREFIX);
