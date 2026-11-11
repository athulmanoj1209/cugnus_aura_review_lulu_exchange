import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';

import {
  FREQ_LABELS, InstanceStatus, MONTHS, STATUS_META, jobStatus, runsPerMonth, runStatuses,
} from '../../models/audit-plan.model';
import { AuditPlanStore } from '../audit-plan.store';
// adjust to wherever you placed the drawer adapter
import { ScopeJobDrawerService } from '../../../scope-job/services/scope-job.service';
import { InstanceStatuses, PlanViews } from '../../constants/audit-plan.constants';
import {
  STATUS_BG_VARS,
  STATUS_MARK_FALLBACK,
  STATUS_SOLID_VARS,
  STATUS_TX_VARS,
  UNSCHEDULED_MARK,
} from '../../constants/audit-plan-labels.constants';
import {
  NO_JOBS_ASSIGNED_HTML,
  jobRef,
  notScheduledTooltip,
  runShortLabel,
} from '../../constants/audit-plan-messages.constants';

@Component({
  selector: 'ap-scope-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, ProgressBarModule, TooltipModule],
  templateUrl: './scope-detail.component.html',
  styleUrl: './scope-detail.component.scss',
})
export class ScopeDetailComponent {
  readonly store = inject(AuditPlanStore);
  private readonly jobDrawer = inject(ScopeJobDrawerService);
  readonly months = MONTHS;
  readonly meta = STATUS_META;
  readonly freqLabels = FREQ_LABELS;
  readonly PlanViews = PlanViews;
  readonly markFallback = STATUS_MARK_FALLBACK;
  readonly unscheduledMark = UNSCHEDULED_MARK;
  readonly jobRef = jobRef;
  readonly runShortLabel = runShortLabel;

  /** job row click → scope-job profile drawer */
  openJob(j: { job: { id: string; name: string; auditor: string; hrs: number; run?: number }; status: InstanceStatus }): void {
    const v = this.vm();
    if (!v) return;
    this.jobDrawer.openFromPlan({
      deptName: v.subDivision.name,
      scope: v.scope,
      job: j.job,
      monthIndex: v.focusMonth,
      year: this.store.year(),
      status: j.status,
      run: j.job.run,
    });
  }

  /** month cell click → drawer for that month's instance (leads with the first job) */
  openMonth(m: { monthIndex: number; status: InstanceStatus | null }): void {
    const v = this.vm();
    if (!v || !m.status) return;
    const job = v.scope.jobs[0];
    if (!job) return;
    this.jobDrawer.openFromPlan({
      deptName: v.subDivision.name,
      scope: v.scope,
      job,
      monthIndex: m.monthIndex,     // the clicked month — NOT focusMonth
      year: this.store.year(),
      status: m.status,
    });
  }

  /** W/BW run sliver click → drawer scoped to that run (its own job + status + week window) */
  openRun(m: { monthIndex: number; runs: InstanceStatus[] }, ri: number): void {
    const v = this.vm();
    if (!v) return;
    // run-specific job for this run, else the first repeating job
    const job = v.scope.jobs.find(j => (j as { run?: number }).run === ri + 1)
      ?? v.scope.jobs.find(j => (j as { run?: number }).run === undefined)
      ?? v.scope.jobs[0];
    if (!job) return;
    this.jobDrawer.openFromPlan({
      deptName: v.subDivision.name,
      scope: v.scope,
      job,
      monthIndex: m.monthIndex,
      year: this.store.year(),
      status: m.runs[ri],
      run: ri + 1,
    });
  }

  /** "today" ring only when viewing the current fiscal year */
  isCurrentMonth(monthIndex: number): boolean {
    const now = new Date();
    return this.store.year() === now.getFullYear() && monthIndex === now.getMonth();
  }

  /* inline-style palettes for the monthly strip — immune to CSS specificity/encapsulation.
   *  Reference the stc-x and st-x-bg / st-x-tx theme tokens (declared on the audit-plan shell host)
   *  so these stay theme-reactive instead of being frozen to a fixed light palette. */
  readonly runSolid = STATUS_SOLID_VARS;
  readonly cellBg = STATUS_BG_VARS;
  readonly cellTx = STATUS_TX_VARS;

  /** full view-model in one computed — the template stays logic-free */
  readonly vm = computed(() => {
    const found = this.store.selectedScope();
    if (!found) return null;
    const { subDivision, scope } = found;
    const total = scope.months.filter(Boolean).length;
    const done = scope.months.filter(m => m === InstanceStatuses.Completed).length;
    const firstMonth = Math.max(0, scope.months.findIndex(Boolean));
    const curMi = scope.months.findIndex(m => m === InstanceStatuses.InProgress || m === InstanceStatuses.Overdue);
    const focusMonth = curMi > -1 ? curMi : firstMonth;
    const focusStatus = scope.months[focusMonth];

    const nRuns = runsPerMonth(scope.freq);
    const focusRuns = focusStatus ? runStatuses(focusStatus, nRuns) : [];

    /** jobs executed in a given run: run-specific (job.run === ri+1) + repeating (no run) */
    const jobsInRun = (ri: number) =>
      scope.jobs.filter(j => (j as { run?: number }).run === undefined || (j as { run?: number }).run === ri + 1);

    /** job titles with per-job status marks for ONE run, one per line (HTML for the tooltip) */
    const jobLinesForRun = (st: InstanceStatus, ri: number): string =>
      jobsInRun(ri)
        .map((job, ji) => `${STATUS_META[(job as { run?: number }).run !== undefined ? st : jobStatus(st, ji)].mark || STATUS_MARK_FALLBACK} ${job.name}`)
        .join('<br>') || NO_JOBS_ASSIGNED_HTML;
    /** all jobs for single-run months */
    const jobLinesAll = (st: InstanceStatus): string =>
      scope.jobs
        .map((job, ji) => `${STATUS_META[jobStatus(st, ji)].mark || STATUS_MARK_FALLBACK} ${job.name}`)
        .join('<br>');

    return {
      subDivision, scope, total, done, firstMonth, focusMonth,
      pct: total ? Math.round((done / total) * 100) : 0,
      jobs: scope.jobs.map((job, ji) => ({
        job,
        status: !focusStatus ? InstanceStatuses.Planned
          // run-specific job: status of its own run in the focus month
          : job.run !== undefined && nRuns > 1 ? focusRuns[job.run - 1] ?? focusStatus
          : jobStatus(focusStatus, ji),
      })),
      cells: scope.months.map((status, monthIndex) => {
        const runs = status ? runStatuses(status, nRuns) : [];
        return {
          monthIndex, status, runs,
          tooltip: status
            ? `<b>${MONTHS[monthIndex]} · ${STATUS_META[status].label}</b>${jobLinesAll(status)}`
            : notScheduledTooltip(MONTHS[monthIndex]),
          // each run's tooltip lists only that run's jobs (run-specific + repeating)
          runTooltips: runs.map((r, ri) =>
            `<b>${runShortLabel(scope.freq)} ${ri + 1} · ${STATUS_META[r].label}</b>${jobLinesForRun(r, ri)}`),
        };
      }),
    };
  });
}