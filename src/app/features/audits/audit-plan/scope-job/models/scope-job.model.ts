import type {
  ScopeJobFrequency,
  ScopeJobModeOfAudit,
  ScopeJobStatus,
} from '../constants/scope-job.constants';
import type { ScopeTask } from '../../scope-task/models/scope-task.model';

export type AuditFrequency = ScopeJobFrequency;
export type JobStatus = ScopeJobStatus;
export type ModeOfAudit = ScopeJobModeOfAudit;

export interface ScopeJob {
  id: string;
  title: string;       // e.g. "Financial Controls Review — Jan 2025"
  scopeId: string;
  scopeName: string;
  /** Company name — must match a companyName in the active client's org seed for the filters to match. */
  company: string;
  division: string;
  subDivision: string | null; // null = division-level scope
  auditFrequency: AuditFrequency;
  modeOfAudit: ModeOfAudit;
  periodLabel: string;   // e.g. "Jan 2025", "Q1 2025", "FY 2025"
  periodStart: Date;
  periodEnd: Date;
  assignedAuditors: string[];
  assignedReviewers: string[];
  status: JobStatus;
  createdDate: Date;
  isActive: boolean;
  objective?: string;
  subscopes?: string[];
  /** Hand-written tasks for this job — when set, generateTasksForJob() returns
   *  these instead of generating tasks from the period (see TEAM_CURRENT_CYCLE_JOB). */
  seedTasks?: ScopeTask[];
}

/* ── Auditor / Reviewer profile types ──────────────────────────────────────── */

export interface AuditorProfile {
  id:              string;
  name:            string;
  initials:        string;
  role:            string;
  experienceYears: number;
  expertise:       string[];
  workloadPct:     number;
}

export interface ReviewerProfile {
  id:               string;
  name:             string;
  initials:         string;
  role:             string;
  experienceYears:  number;
  reviewsCompleted: number;
  reviewsPending:   number;
}
