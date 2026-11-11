import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AuditScope, Department as SubDivision, Frequency, InstanceRef, InstanceStatus, MONTHS,
  PlanFilter, PlanView, jobStatus, jobsForRun, runsPerMonth, runStatuses,
} from '../models/audit-plan.model';
import { AuditPlanService } from '../services/audit-plan.service';
import {
  CALENDAR_MAX_PLACEMENT_DAY,
  Frequencies,
  InstanceStatuses,
  MONTHS_PER_YEAR,
  PlanViews,
  RUN_STEP_DAYS,
} from '../constants/audit-plan.constants';
import { divisionLaneOptionLabel } from '../constants/audit-plan-messages.constants';

/* ---------- view models (precomputed → zero function calls in templates) ---------- */

export interface HeatCellVM {
  monthIndex: number;
  status: InstanceStatus | null;
  /** length > 1 only for W / BW scopes */
  runs: InstanceStatus[];
}
export interface HeatScopeRowVM { scope: AuditScope; subDivisionId: string; cells: HeatCellVM[]; }
export interface HeatSubDivisionRowVM { subDivision: SubDivision; rollup: (InstanceStatus | null)[]; scopeRows: HeatScopeRowVM[]; }

export interface CalendarChipVM {
  scope: AuditScope;
  subDivisionName: string;
  job: AuditScope['jobs'][number];
  /** job-level status, derived from the run's status */
  status: InstanceStatus;
  run: number | null;
  totalRuns: number;
}
export interface CalendarDayVM { day: number | null; isToday: boolean; chips: CalendarChipVM[]; }

export interface SubDivisionCardVM { subDivision: SubDivision; pct: number; scopes: AuditScope[]; }

export interface LogRowVM {
  subDivisionName: string; scope: AuditScope; job: AuditScope['jobs'][number];
  monthIndex: number; monthLabel: string; status: InstanceStatus; runs: number;
}

export interface KpiVM { total: number; completed: number; inprog: number; planned: number; overdue: number; }

/**
 * Feature store — provided at the AuditPlanComponent level so each
 * instance of the page owns isolated state. All derived data is
 * memoised through computed(); components render signals directly
 * under OnPush, so change detection is minimal.
 */
@Injectable()
export class AuditPlanStore {
  private readonly api = inject(AuditPlanService);
  private readonly destroyRef = inject(DestroyRef);

  /* ---------------- core state ---------------- */
  readonly year = signal(new Date().getFullYear());
  readonly view = signal<PlanView>(PlanViews.Annual);
  readonly currentMonth = signal(new Date().getMonth());
  readonly activeSubDivisionId = signal<string | null>(null);
  readonly activeScopeId = signal<string | null>(null);
  /** non-null → instance dialog open */
  readonly instanceRef = signal<InstanceRef | null>(null);
  readonly logMonthFilter = signal<number | null>(null);
  readonly loading = signal(false);

  private readonly subDivisions = signal<SubDivision[]>([]);
  private readonly filter = signal<PlanFilter>({ dept: [], freq: [], status: [], search: '' });

  /* ---------------- derived: filtering ---------------- */
  readonly filteredSubDivisions = computed<SubDivision[]>(() => {
    // p-multiselect's clear icon can write null into controls — never trust the arrays
    const subDivision = this.filter().dept ?? [];
    const freq = this.filter().freq ?? [];
    const status = this.filter().status ?? [];
    const q = (this.filter().search ?? '').trim().toLowerCase();
    return this.subDivisions()
      .map(d => ({
        ...d,
        scopes: d.scopes.filter(s => {
          if (subDivision.length && !subDivision.includes(d.id)) return false;
          if (freq.length && !freq.includes(s.freq)) return false;
          if (status.length && !status.some(st => s.months.includes(st))) return false;
          if (q && !(`${s.name} ${s.code} ${s.auditor}`.toLowerCase().includes(q))) return false;
          return true;
        }),
      }))
      .filter(d => d.scopes.length > 0);
  });

  readonly subDivisionOptions = computed(() =>
    this.subDivisions().map(d => ({ label: d.isDivisionLevel ? divisionLaneOptionLabel(d.name) : d.name, value: d.id })));

  /* ---------------- derived: scope-level KPI strip ---------------- */
  readonly scopeStats = computed<KpiVM>(() => {
    const acc: KpiVM = { total: 0, completed: 0, inprog: 0, planned: 0, overdue: 0 };
    for (const d of this.filteredSubDivisions())
      for (const s of d.scopes) {
        acc.total++;
        const m = s.months.filter((x): x is InstanceStatus => x !== null);
        if (m.includes(InstanceStatuses.Overdue)) acc.overdue++;
        else if (m.includes(InstanceStatuses.InProgress)) acc.inprog++;
        else if (m.length > 0 && m.every(x => x === InstanceStatuses.Completed)) acc.completed++;
        else acc.planned++;
      }
    return acc;
  });

  /* ---------------- derived: KPI strip (run-level counts) ---------------- */
  readonly kpis = computed<KpiVM>(() => {
    const acc: KpiVM = { total: 0, completed: 0, inprog: 0, planned: 0, overdue: 0 };
    for (const d of this.filteredSubDivisions())
      for (const s of d.scopes)
        for (const m of s.months)
          if (m) for (const r of runStatuses(m, runsPerMonth(s.freq))) { acc[r]++; acc.total++; }
    return acc;
  });

  /* ---------------- derived: L1 annual heat-map ---------------- */
  readonly heatRows = computed<HeatSubDivisionRowVM[]>(() =>
    this.filteredSubDivisions().map(subDivision => ({
      subDivision,
      rollup: MONTHS.map((_, mi) => subDivision.scopes.find(s => s.months[mi])?.months[mi] ?? null),
      scopeRows: subDivision.scopes.map(scope => ({
        scope,
        subDivisionId: subDivision.id,
        cells: scope.months.map((status, monthIndex) => ({
          monthIndex,
          status,
          runs: status ? runStatuses(status, runsPerMonth(scope.freq)) : [],
        })),
      })),
    })));

  /* ---------------- derived: L2 month calendar ---------------- */
  readonly calendarDays = computed<CalendarDayVM[]>(() => {
    const year = this.year(), mi = this.currentMonth();
    const firstDow = new Date(year, mi, 1).getDay();
    const daysInMonth = new Date(year, mi + 1, 0).getDate();
    const today = new Date();

    const byDay = new Map<number, CalendarChipVM[]>();
    for (const d of this.filteredSubDivisions())
      for (const s of d.scopes) {
        const st = s.months[mi];
        if (!st) continue;
        const n = runsPerMonth(s.freq);
        const runs = runStatuses(st, n);
        const step = s.freq === Frequencies.Weekly ? RUN_STEP_DAYS[Frequencies.Weekly] : RUN_STEP_DAYS[Frequencies.BiWeekly];
        runs.forEach((rst, ri) => {
          const day = Math.min(s.day, CALENDAR_MAX_PLACEMENT_DAY) + (n > 1 ? ri * step : 0);
          if (day > daysInMonth) return;
          const list = byDay.get(day) ?? [];
          // only the jobs belonging to this run (run-specific + repeating)
          jobsForRun(s, ri).forEach((job, ji) => list.push({
            scope: s, subDivisionName: d.name, job,
            // run-specific job = the run's status; repeating job = derived from index
            status: job.run !== undefined ? rst : jobStatus(rst, ji),
            run: n > 1 ? ri + 1 : null, totalRuns: n,
          }));
          byDay.set(day, list);
        });
      }

    const cells: CalendarDayVM[] = [];
    for (let i = 0; i < firstDow; i++) cells.push({ day: null, isToday: false, chips: [] });
    for (let day = 1; day <= daysInMonth; day++)
      cells.push({
        day,
        isToday: today.getFullYear() === year && today.getMonth() === mi && today.getDate() === day,
        chips: byDay.get(day) ?? [],
      });
    // pad the final week so the grid is always complete rows of 7
    while (cells.length % 7 !== 0) cells.push({ day: null, isToday: false, chips: [] });
    return cells;
  });

  /* ---------------- derived: L3 sub-division cards ---------------- */
  readonly subDivisionCards = computed<SubDivisionCardVM[]>(() =>
    this.filteredSubDivisions().map(subDivision => {
      let total = 0, done = 0;
      for (const s of subDivision.scopes) {
        total += s.months.filter(Boolean).length;
        done += s.months.filter(m => m === InstanceStatuses.Completed).length;
      }
      return { subDivision, scopes: subDivision.scopes, pct: total ? Math.round((done / total) * 100) : 0 };
    }));

  /* ---------------- derived: L4 selected scope ---------------- */
  readonly selectedScope = computed(() => {
    const id = this.activeScopeId();
    if (!id) return null;
    for (const d of this.subDivisions()) {
      const scope = d.scopes.find(s => s.id === id);
      if (scope) return { subDivision: d, scope };
    }
    return null;
  });

  /* ---------------- derived: L5 execution log (job-level rows) ---------------- */
  readonly logRows = computed<LogRowVM[]>(() => {
    const mF = this.logMonthFilter();
    const rows: LogRowVM[] = [];
    for (const d of this.filteredSubDivisions())
      for (const s of d.scopes)
        s.months.forEach((st, mi) => {
          if (!st || (mF !== null && mF !== mi)) return;
          const n = runsPerMonth(s.freq);
          const perRun = runStatuses(st, n);
          s.jobs.forEach((job, ji) => rows.push({
            subDivisionName: d.name, scope: s, job, monthIndex: mi,
            monthLabel: `${MONTHS[mi]} ${this.year()}`,
            // run-specific job takes its own run's status
            status: job.run !== undefined && n > 1 ? perRun[job.run - 1] ?? st : jobStatus(st, ji),
            runs: n,
          }));
        });
    return rows;
  });

  readonly logCounts = computed(() => {
    const c: Record<InstanceStatus, number> = { completed: 0, inprog: 0, planned: 0, overdue: 0 };
    for (const r of this.logRows()) c[r.status]++;
    return c;
  });

  /* ---------------- derived: instance dialog ---------------- */
  readonly instanceVM = computed(() => {
    const ref = this.instanceRef();
    if (!ref) return null;
    const found = this.findScope(ref.scopeId);
    if (!found) return null;
    const st = found.scope.months[ref.monthIndex];
    if (!st) return null;
    const n = runsPerMonth(found.scope.freq);
    const perRun = runStatuses(st, n);
    const jobs = found.scope.jobs.map((job, ji) => ({
      job,
      status: job.run !== undefined && n > 1 ? perRun[job.run - 1] ?? st : jobStatus(st, ji),
    }));
    return {
      ...found,
      monthIndex: ref.monthIndex,
      monthLabel: `${MONTHS[ref.monthIndex]} ${this.year()}`,
      status: st,
      runs: runStatuses(st, runsPerMonth(found.scope.freq)),
      jobs,
      selectedJob: ref.jobId ? jobs.find(j => j.job.id === ref.jobId) ?? null : null,
    };
  });

  /* ---------------- actions ---------------- */
  /** remembered so changeYear() reloads the same company */
  private companyId?: string;
  /** audit plan picked from the plan dropdown (null → whole company) */
  readonly planId = signal<string | null>(null);

  /** Switch to a single audit plan and reload its data. */
  loadPlan(planId: string | null, year = this.year()): void {
    this.planId.set(planId);
    this.activeScopeId.set(null);
    this.activeSubDivisionId.set(null);
    this.instanceRef.set(null);
    this.loadYear(year);
  }

  loadYear(year: number, companyId?: string): void {
    if (companyId !== undefined) this.companyId = companyId;
    this.year.set(year);
    this.loading.set(true);
    this.api.getPlan(year, this.companyId, this.planId() ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: subDivisions => { this.subDivisions.set(subDivisions); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  setFilter(patch: Partial<PlanFilter>): void {
    this.filter.update(f => ({ ...f, ...patch }));
  }

  changeYear(delta: number): void { this.loadYear(this.year() + delta); }

  drillToMonth(monthIndex: number): void {
    this.currentMonth.set(Math.max(0, monthIndex));
    this.view.set(PlanViews.Calendar);
  }
  shiftMonth(delta: number): void {
    this.currentMonth.update(m => (m + delta + MONTHS_PER_YEAR) % MONTHS_PER_YEAR);
  }
  drillToSubDivision(subDivisionId: string): void {
    this.activeSubDivisionId.set(subDivisionId);
    this.view.set(PlanViews.Departments);
  }
  drillToScope(scopeId: string): void {
    this.activeScopeId.set(scopeId);
    const found = this.findScope(scopeId);
    if (found) this.activeSubDivisionId.set(found.subDivision.id);
    this.view.set(PlanViews.Scope);
  }
  openInstance(ref: InstanceRef): void { this.instanceRef.set(ref); }
  closeInstance(): void { this.instanceRef.set(null); }

  private findScope(id: string): { subDivision: SubDivision; scope: AuditScope } | null {
    for (const d of this.subDivisions()) {
      const scope = d.scopes.find(s => s.id === id);
      if (scope) return { subDivision: d, scope };
    }
    return null;
  }
}