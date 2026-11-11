import { Injectable, inject } from '@angular/core';

// ── ADJUST these two imports to your project paths ────────────────────────────
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';


// ── audit-plan feature model (adjust path) ────────────────────────────────────
import {
  AuditScope, Frequency, InstanceStatus, MONTHS,
  ScopeJob as PlanJob, runsPerMonth,
} from '../../audit-plan/models/audit-plan.model';
import { ScopeJobProfileComponent, ScopeJobProfileDrawerData } from '../profile/scope-job-profile.component';
import {
  ScopeJobFrequencies,
  ScopeJobModesOfAudit,
  ScopeJobStatuses,
  type ScopeJobFrequency,
  type ScopeJobModeOfAudit,
  type ScopeJobStatus,
  SCOPE_JOB_DEFAULT_ORG,
  SCOPE_JOB_DRAWER,
} from '../constants/scope-job.constants';

/* ------------------------------------------------------------------
 * Local copies of the drawer's types (structurally identical to the
 * ScopeJob in scope-job-list.component). Declared here so this service
 * needs NO import from scope-job-list — TypeScript's structural typing
 * makes the mapped object assignable to the drawer's ScopeJob.
 * ------------------------------------------------------------------ */
type JobStatus = ScopeJobStatus;
type AuditFrequency = ScopeJobFrequency;
type ModeOfAudit = ScopeJobModeOfAudit;

interface DrawerScopeJob {
  id: string;
  title: string;
  scopeId: string;
  scopeName: string;
  company: string;
  division: string;
  subDivision: string;
  auditFrequency: AuditFrequency;
  modeOfAudit: ModeOfAudit;
  periodLabel: string;
  periodStart: Date;
  periodEnd: Date;
  assignedAuditors: string[];
  assignedReviewers: string[];
  status: JobStatus;
  createdDate: Date;
  isActive: boolean;
  objective?: string;
  subscopes?: string[];
}

/** Everything the mapper needs to build a drawer payload from plan data. */
export interface PlanJobRef {
  deptName: string;
  scope: AuditScope;
  job: PlanJob;
  monthIndex: number;
  year: number;
  /** the instance/run status the user clicked (job-level if you have it) */
  status: InstanceStatus;
  /** 1-based run for weekly/bi-weekly chips; omit for monthly+ */
  run?: number;
}

/* plan status → drawer JobStatus */
const STATUS_MAP: Record<InstanceStatus, JobStatus> = {
  planned: ScopeJobStatuses.Pending,
  inprog: ScopeJobStatuses.InProgress,
  completed: ScopeJobStatuses.Completed,
  overdue: ScopeJobStatuses.Overdue,
};

/* plan frequency → drawer AuditFrequency (drawer only knows 3 cadences) */
const FREQ_MAP: Record<Frequency, AuditFrequency> = {
  W: ScopeJobFrequencies.Monthly, BW: ScopeJobFrequencies.Monthly, M: ScopeJobFrequencies.Monthly,
  Q: ScopeJobFrequencies.Quarterly, HY: ScopeJobFrequencies.Annually, Y: ScopeJobFrequencies.Annually,
};

/* org defaults — replace with real values from your session/user context */
const ORG = SCOPE_JOB_DEFAULT_ORG;

/** Pure mapper — unit-testable without the drawer. */
export function mapPlanJobToScopeJob(ref: PlanJobRef): DrawerScopeJob {
  const { deptName, scope, job, monthIndex, year, status, run } = ref;
  const nRuns = runsPerMonth(scope.freq);
  const monthLabel = `${MONTHS[monthIndex]} ${year}`;

  // Period: the whole month for M/Q/HY/Y; the specific week/fortnight for W/BW runs
  let periodStart: Date;
  let periodEnd: Date;
  let periodLabel = monthLabel;
  if (run !== undefined && nRuns > 1) {
    const step = scope.freq === 'W' ? 7 : 14;
    const startDay = Math.min(scope.day, 28) + (run - 1) * step;
    periodStart = new Date(year, monthIndex, startDay);
    periodEnd = new Date(year, monthIndex, Math.min(
      startDay + step - 1, new Date(year, monthIndex + 1, 0).getDate()));
    periodLabel = `${MONTHS[monthIndex]} ${year} · ${scope.freq === 'W' ? 'Wk' : 'Run'} ${run}/${nRuns}`;
  } else {
    periodStart = new Date(year, monthIndex, 1);
    periodEnd = new Date(year, monthIndex + 1, 0); // last day of month
  }

  return {
    id: `${scope.code}-${job.id.toUpperCase()}`,
    title: `${job.name} — ${periodLabel}`,
    scopeId: scope.code,
    scopeName: scope.name,
    company: ORG.company,
    division: ORG.division,
    subDivision: deptName,
    auditFrequency: FREQ_MAP[scope.freq],
    modeOfAudit: ScopeJobModesOfAudit.Full,
    periodLabel,
    periodStart,
    periodEnd,
    // plan model stores display names; the drawer's registry lookup falls back to the raw string
    assignedAuditors: [job.auditor],
    assignedReviewers: (scope as { reviewers?: string[] }).reviewers ?? [scope.auditor],
    status: STATUS_MAP[status],
    createdDate: new Date(year, 0, 1),
    isActive: true,
    objective:
      `${job.name} for ${scope.name} (${scope.code}) — ${deptName}. ` +
      `Estimated effort: ${job.hrs}h. Lead auditor: ${scope.auditor}.`,
    // sibling procedures of the same scope displayed as sub-scopes
    subscopes: scope.jobs.filter(j => j.id !== job.id).map(j => j.name),
  };
}

/**
 * Opens the ScopeJobProfile drawer for a job clicked anywhere in the audit plan
 * (calendar chip, scope-detail job row, execution-log row).
 */
@Injectable({ providedIn: 'root' })
export class ScopeJobDrawerService {
  private readonly drawer = inject(RightDrawerService);

  openFromPlan(ref: PlanJobRef): void {
    const job = mapPlanJobToScopeJob(ref);
    this.drawer.open<ScopeJobProfileComponent, ScopeJobProfileDrawerData>(
      ScopeJobProfileComponent,
      { ...SCOPE_JOB_DRAWER.Profile, data: { job } },
    );
  }
}