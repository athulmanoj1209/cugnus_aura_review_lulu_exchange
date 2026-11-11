import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AuditPlanStore } from '../audit-plan.store';
import {
  AuditScope, FREQ_LABELS, InstanceStatus, MONTHS, STATUS_META,
  runsPerMonth, runStatuses,
} from '../../models/audit-plan.model';
// same drawer adapter used by scope-detail / calendar / log
import { ScopeJobDrawerService } from '../../../scope-job/services/scope-job.service';
import {
  ANNUAL_OVERVIEW_PAGINATION,
  AuditPlanColorModes,
  FREQUENCY_ORDER,
  INSTANCE_STATUS_ORDER,
  InstanceStatuses,
  MONTHS_PER_QUARTER,
  QUARTER_INDEXES,
  QUARTER_MONTH_OFFSETS,
  type AuditPlanColorMode,
} from '../../constants/audit-plan.constants';
import { notScheduledTooltip } from '../../constants/audit-plan-messages.constants';

/* ---------- local view models (precomputed, template stays logic-free) ---------- */
interface PillVM {
  monthIndex: number;
  monthLabel: string;
  status: InstanceStatus | null;
  mark: string;
  runs: InstanceStatus[];
  tooltip: string;
}
interface LaneScopeVM { scope: AuditScope; quarters: PillVM[][]; }
interface LaneSubDivisionVM {
  id: string; name: string;
  isDivisionLevel: boolean;
  scopes: LaneScopeVM[];
  rollup: (InstanceStatus | null)[];
  pct: number;
  instances: number;
}
interface PagedLaneVM extends LaneSubDivisionVM {
  /** scopes visible on the sub-division's current page */
  visibleScopes: LaneScopeVM[];
  scopeFirst: number;
}

type ColorMode = AuditPlanColorMode;

@Component({
  selector: 'ap-annual-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipModule, PaginatorModule],
  templateUrl: './annual-overview.component.html',
  styleUrl: './annual-overview.component.scss',
})
export class AnnualOverviewComponent {
  readonly store = inject(AuditPlanStore);
  private readonly jobDrawer = inject(ScopeJobDrawerService);
  readonly meta = STATUS_META;
  readonly freqLabels = FREQ_LABELS;
  readonly statusKeys = INSTANCE_STATUS_ORDER;
  readonly freqKeys = FREQUENCY_ORDER;
  readonly quarters = QUARTER_INDEXES;
  readonly ColorModes = AuditPlanColorModes;
  readonly subDivisionRowsPerPageOptions = [...ANNUAL_OVERVIEW_PAGINATION.SubDivisionRowsPerPageOptions];

  /** 'status' or 'freq' (default) pill colouring */
  readonly colorMode = signal<ColorMode>(AuditPlanColorModes.Freq);
  /** collapsed sub-division ids (all expanded by default) */
  readonly collapsed = signal<ReadonlySet<string>>(new Set());

  /** pill click → scope-job profile drawer for that month (leads with the first job) */
  openPill(subDivisionName: string, scope: AuditScope, p: PillVM): void {
    if (!p.status) return;
    const job = scope.jobs[0];
    if (!job) return;
    this.jobDrawer.openFromPlan({
      deptName: subDivisionName,
      scope,
      job,
      monthIndex: p.monthIndex,
      year: this.store.year(),
      status: p.status,
    });
  }

  /** W/BW run strip click → drawer scoped to that run (its own job + status + week window) */
  openPillRun(subDivisionName: string, scope: AuditScope, p: PillVM, ri: number): void {
    const job = scope.jobs.find(j => (j as { run?: number }).run === ri + 1)
      ?? scope.jobs.find(j => (j as { run?: number }).run === undefined)
      ?? scope.jobs[0];
    if (!job) return;
    this.jobDrawer.openFromPlan({
      deptName: subDivisionName,
      scope,
      job,
      monthIndex: p.monthIndex,
      year: this.store.year(),
      status: p.runs[ri],
      run: ri + 1,
    });
  }

  /** full quarter-lane view model, memoised on filters/data */
  readonly lanes = computed<LaneSubDivisionVM[]>(() =>
    this.store.filteredSubDivisions().map(subDivision => {
      let instances = 0, done = 0;
      const scopes = subDivision.scopes.map(scope => {
        const quarters: PillVM[][] = this.quarters.map(q =>
          QUARTER_MONTH_OFFSETS.map(k => this.buildPill(scope, q * MONTHS_PER_QUARTER + k)));
        instances += scope.months.filter(Boolean).length;
        done += scope.months.filter(m => m === InstanceStatuses.Completed).length;
        return { scope, quarters };
      });
      return {
        id: subDivision.id, name: subDivision.name, isDivisionLevel: !!subDivision.isDivisionLevel, scopes, instances,
        pct: instances ? Math.round((done / instances) * 100) : 0,
        rollup: MONTHS.map((_, mi) => subDivision.scopes.find(s => s.months[mi])?.months[mi] ?? null),
      };
    }));

  /* ---------------- pagination ---------------- */
  readonly subDivisionFirst = signal(0);
  readonly subDivisionRows = signal<number>(ANNUAL_OVERVIEW_PAGINATION.SubDivisionRows);
  readonly scopeRowsPerPage = ANNUAL_OVERVIEW_PAGINATION.ScopeRows;
  /** per-sub-division scope page offsets */
  private readonly scopeOffsets = signal<Record<string, number>>({});

  /** clamp so filter changes never leave us on an empty page */
  readonly subDivisionFirstClamped = computed(() => {
    const total = this.lanes().length, rows = this.subDivisionRows();
    return Math.min(this.subDivisionFirst(), Math.max(0, Math.floor((total - 1) / rows) * rows));
  });

  /** sub-divisions of the current page, each with its visible scope slice */
  readonly pagedLanes = computed<PagedLaneVM[]>(() => {
    const first = this.subDivisionFirstClamped();
    const offsets = this.scopeOffsets();
    return this.lanes().slice(first, first + this.subDivisionRows()).map(subDivision => {
      const raw = offsets[subDivision.id] ?? 0;
      const scopeFirst = raw >= subDivision.scopes.length ? 0 : raw;
      return {
        ...subDivision,
        scopeFirst,
        visibleScopes: subDivision.scopes.slice(scopeFirst, scopeFirst + this.scopeRowsPerPage),
      };
    });
  });

  onSubDivisionPage(e: PaginatorState): void {
    this.subDivisionFirst.set(e.first ?? 0);
    this.subDivisionRows.set(e.rows ?? ANNUAL_OVERVIEW_PAGINATION.SubDivisionRows);
  }

  onScopePage(subDivisionId: string, e: PaginatorState): void {
    this.scopeOffsets.update(m => ({ ...m, [subDivisionId]: e.first ?? 0 }));
  }

  toggle(subDivisionId: string): void {
    this.collapsed.update(set => {
      const next = new Set(set);
      next.has(subDivisionId) ? next.delete(subDivisionId) : next.add(subDivisionId);
      return next;
    });
  }

  quarterMonths(q: number): { mi: number; label: string }[] {
    return QUARTER_MONTH_OFFSETS.map(k => {
      const mi = q * MONTHS_PER_QUARTER + k;
      return { mi, label: MONTHS[mi] };
    });
  }

  private buildPill(scope: AuditScope, monthIndex: number): PillVM {
    const status = scope.months[monthIndex];
    const n = runsPerMonth(scope.freq);
    return {
      monthIndex,
      monthLabel: MONTHS[monthIndex],
      status,
      mark: status ? STATUS_META[status].mark : '',
      runs: status && n > 1 ? runStatuses(status, n) : [],
      tooltip: status
        ? `${scope.name} · ${MONTHS[monthIndex]} · ${STATUS_META[status].label}` +
          (n > 1 ? ` · ${n} runs` : '') + ` · ${FREQ_LABELS[scope.freq]}`
        : notScheduledTooltip(MONTHS[monthIndex]),
    };
  }
}