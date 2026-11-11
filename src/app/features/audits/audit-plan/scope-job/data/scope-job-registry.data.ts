// Auditor / reviewer directory used to turn the ids on ScopeJob.assignedAuditors /
// assignedReviewers into display names and profile cards. Shared by every client seed.

import type { AuditorProfile, ReviewerProfile } from '../models/scope-job.model';

export const AUDITOR_REGISTRY: Record<string, AuditorProfile> = {
  alice: { id: 'alice', name: 'Alice Johnson', initials: 'AJ', role: 'Senior Auditor',   experienceYears: 8,  expertise: ['Finance', 'Internal Controls'],   workloadPct: 75 },
  bob:   { id: 'bob',   name: 'Bob Smith',     initials: 'BS', role: 'Audit Lead',        experienceYears: 12, expertise: ['IT Audit', 'Risk Management'],     workloadPct: 60 },
  carol: { id: 'carol', name: 'Carol White',   initials: 'CW', role: 'Auditor',           experienceYears: 4,  expertise: ['Compliance', 'Regulatory'],        workloadPct: 80 },
  david: { id: 'david', name: 'David Lee',     initials: 'DL', role: 'Senior Auditor',   experienceYears: 6,  expertise: ['HR Audit', 'Operational Risk'],    workloadPct: 55 },
  // Added alongside the DAR Exchange AML/CFT Compliance scope jobs (SC-5000),
  // so the Auditor filter shows a real name instead of the raw id "emma"
  // when CLIENT_MODE_VALUE === 'internal-audit'.
  emma:  { id: 'emma',  name: 'Emma Davis',    initials: 'ED', role: 'Compliance Auditor', experienceYears: 7,  expertise: ['AML/CFT', 'Compliance'],          workloadPct: 65 },
};

export const REVIEWER_REGISTRY: Record<string, ReviewerProfile> = {
  emma:  { id: 'emma',  name: 'Emma Davis',   initials: 'ED', role: 'Audit Manager',     experienceYears: 10, reviewsCompleted: 48, reviewsPending: 3 },
  frank: { id: 'frank', name: 'Frank Miller', initials: 'FM', role: 'Senior Reviewer',   experienceYears: 9,  reviewsCompleted: 35, reviewsPending: 2 },
  grace: { id: 'grace', name: 'Grace Wilson', initials: 'GW', role: 'Reviewer',          experienceYears: 5,  reviewsCompleted: 22, reviewsPending: 4 },
  henry: { id: 'henry', name: 'Henry Brown',  initials: 'HB', role: 'Senior Reviewer',   experienceYears: 11, reviewsCompleted: 60, reviewsPending: 1 },
};
