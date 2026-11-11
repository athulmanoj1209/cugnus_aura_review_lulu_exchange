import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

/* Adjust this path to wherever drawer-ref.ts actually lives relative to this
   file — mirrors the pattern used by events-meetings-profile.component.ts. */
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import type {
  AuditPlan,
  AuditPlanStatus,
  AuditScope,
  SubDivision,
  Frequency,
  InstanceStatus,
  RiskRating,
  ScopeJob,
} from '../../list/audit-plan-list.component';
import { FREQ_LABELS, MONTH_LABELS } from '../../list/audit-plan-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  AUDIT_PLAN_DATE_FORMAT_OPTIONS,
  AUDIT_PLAN_DATE_LOCALE,
  AUDIT_PLAN_FINDING_REF_BASE,
  AUDIT_PLAN_VIEW_PAGINATION,
  INSTANCE_STATUS_SEVERITY,
  InstanceStatuses,
  MONTHS_PER_QUARTER,
  MONTHS_PER_YEAR,
  MS_PER_DAY,
  QUARTER_INDEXES,
  QUARTER_MONTH_OFFSETS,
} from '../../constants/audit-plan.constants';
import {
  AUDIT_PLAN_CARET_ICONS,
  AUDIT_PLAN_STATUS_CHIP_CLASS,
  AUDIT_PLAN_STATUS_CHIP_CLASS_DEFAULT,
  AUDIT_PLAN_STATUS_HERO_BADGE,
  AUDIT_PLAN_STATUS_HERO_BADGE_DEFAULT,
  AUDIT_PLAN_STATUS_LABELS,
  STATUS_META,
} from '../../constants/audit-plan-labels.constants';
import { jobRef, notScheduledTooltip, planDurationLabel } from '../../constants/audit-plan-messages.constants';

/* ── local view models (precomputed so the template stays logic-free) ── */
interface PillVM {
  monthIndex: number;
  label: string;
  status: InstanceStatus | null;
  mark: string;
  tooltip: string;
}
interface ScopeVM { scope: AuditScope; quarters: PillVM[][]; }
interface SubDivisionCardVM {
  subDivision: SubDivision;
  scopes: ScopeVM[];
  instances: number;
  pct: number;
  rollup: (InstanceStatus | null)[];
}

/** Priority used when rolling several scopes' status up into one sub-division track cell. */
const SEVERITY = INSTANCE_STATUS_SEVERITY;

@Component({
  selector: 'app-audit-plan-view',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, PaginatorModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit-plan-view.component.html',
  styleUrls: ['./audit-plan-view.component.scss'],
})
export class AuditPlanViewComponent {

  /** Drawer wiring — optional so the component also works embedded / in tests. */
  private readonly drawerRef = inject(DrawerRef, { optional: true }) as DrawerRef<AuditPlan> | null;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as AuditPlan | null;

  readonly plan = signal<AuditPlan | null>(this.drawerData);
  readonly p = computed(() => this.plan());

  readonly months = MONTH_LABELS;
  readonly meta = STATUS_META;
  readonly freqLabels = FREQ_LABELS;
  readonly quarters = QUARTER_INDEXES;
  readonly caretIcons = AUDIT_PLAN_CARET_ICONS;
  readonly findingRefBase = AUDIT_PLAN_FINDING_REF_BASE;
  readonly rowsPerPageOptions = [...AUDIT_PLAN_VIEW_PAGINATION.RowsPerPageOptions];

  /** collapsed sub-division ids — all expanded by default */
  readonly collapsed = signal<ReadonlySet<string>>(new Set());
  /** scope ids currently showing their job list inline */
  readonly expandedScopes = signal<ReadonlySet<string>>(new Set());

  toggleSubDivision(id: string): void {
    this.collapsed.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  isSubDivisionOpen(id: string): boolean { return !this.collapsed().has(id); }

  toggleScopeJobs(id: string): void {
    this.expandedScopes.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  isScopeOpen(id: string): boolean { return this.expandedScopes().has(id); }

  /* ── Plan-level title / dates ── */
  readonly planTitle = computed(() => this.plan()?.planName ?? '');

  /** Distinct frequencies in use across every scope in this plan, for the Basic Information row. */
  readonly planFrequencies = computed<Frequency[]>(() => {
    const pl = this.plan();
    if (!pl) return [];
    const set = new Set<Frequency>();
    for (const d of pl.subDivisions) for (const s of d.scopes) set.add(s.freq);
    return Array.from(set);
  });

  readonly durationLabel = computed<string | null>(() => {
    const pl = this.plan();
    if (!pl?.startDate || !pl?.endDate) return null;
    const days = Math.round(
      (new Date(pl.endDate).getTime() - new Date(pl.startDate).getTime()) / MS_PER_DAY,
    );
    return planDurationLabel(days);
  });

  formatDateOnly(d: Date | string): string {
    return new Date(d).toLocaleDateString(AUDIT_PLAN_DATE_LOCALE, AUDIT_PLAN_DATE_FORMAT_OPTIONS);
  }

  statusLabel(s: AuditPlanStatus): string { return AUDIT_PLAN_STATUS_LABELS[s] ?? s; }
  heroBadgeClass(s: AuditPlanStatus): string { return AUDIT_PLAN_STATUS_HERO_BADGE[s] ?? AUDIT_PLAN_STATUS_HERO_BADGE_DEFAULT; }
  statusChipClass(s: AuditPlanStatus): string {
    return `status-chip ${AUDIT_PLAN_STATUS_CHIP_CLASS[s] ?? AUDIT_PLAN_STATUS_CHIP_CLASS_DEFAULT}`;
  }

  /* ── Plan-wide scope KPI strip (mirrors AuditPlanStore.scopeStats) ── */
  readonly scopeStats = computed(() => {
    const acc = { total: 0, completed: 0, inprog: 0, planned: 0, overdue: 0 };
    const pl = this.plan();
    if (!pl) return acc;
    for (const d of pl.subDivisions) {
      for (const s of d.scopes) {
        acc.total++;
        const m = s.months.filter((x): x is InstanceStatus => x !== null);
        if (m.includes(InstanceStatuses.Overdue)) acc.overdue++;
        else if (m.includes(InstanceStatuses.InProgress)) acc.inprog++;
        else if (m.length > 0 && m.every(x => x === InstanceStatuses.Completed)) acc.completed++;
        else acc.planned++;
      }
    }
    return acc;
  });

  /* ── Sub-Division cards (rollup track + scope quarter-pills) ── */
  readonly subDivisionCards = computed<SubDivisionCardVM[]>(() => {
    const pl = this.plan();
    if (!pl) return [];
    return pl.subDivisions.map(subDivision => {
      let instances = 0, done = 0;
      const rollup: (InstanceStatus | null)[] = Array(MONTHS_PER_YEAR).fill(null);
      const scopes: ScopeVM[] = subDivision.scopes.map(scope => {
        scope.months.forEach((m, mi) => {
          if (!m) return;
          instances++;
          if (m === InstanceStatuses.Completed) done++;
          const cur = rollup[mi];
          if (!cur || SEVERITY[m] > SEVERITY[cur]) rollup[mi] = m;
        });
        const qs = this.quarters.map(q => QUARTER_MONTH_OFFSETS.map(k => this.buildPill(scope, q * MONTHS_PER_QUARTER + k)));
        return { scope, quarters: qs };
      });
      return {
        subDivision, scopes, instances,
        pct: instances ? Math.round((done / instances) * 100) : 0,
        rollup,
      };
    });
  });

  /* ── Sub-Division pagination (default 2 per page) ── */
  readonly subDivisionFirst = signal(0);
  readonly subDivisionRows  = signal<number>(AUDIT_PLAN_VIEW_PAGINATION.Rows);

  /** clamp so filter/data changes never leave us on an empty page */
  readonly subDivisionFirstClamped = computed(() => {
    const total = this.subDivisionCards().length;
    const rows = this.subDivisionRows();
    return Math.min(this.subDivisionFirst(), Math.max(0, Math.floor((total - 1) / rows) * rows));
  });

  readonly pagedSubDivisionCards = computed<SubDivisionCardVM[]>(() => {
    const first = this.subDivisionFirstClamped();
    return this.subDivisionCards().slice(first, first + this.subDivisionRows());
  });

  onSubDivisionPage(e: PaginatorState): void {
    this.subDivisionFirst.set(e.first ?? 0);
    this.subDivisionRows.set(e.rows ?? AUDIT_PLAN_VIEW_PAGINATION.Rows);
  }

  private buildPill(scope: AuditScope, monthIndex: number): PillVM {
    const status = scope.months[monthIndex];
    return {
      monthIndex,
      label: MONTH_LABELS[monthIndex],
      status,
      mark: status ? STATUS_META[status].mark : '',
      tooltip: status
        ? `${scope.name} · ${MONTH_LABELS[monthIndex]} · ${STATUS_META[status].label} · ${FREQ_LABELS[scope.freq]}`
        : notScheduledTooltip(MONTH_LABELS[monthIndex]),
    };
  }

  /* ── Scope-level helpers ── */
  riskClass(r: RiskRating): string { return `risk-badge risk-badge--${r}`; }
  freqBadgeClass(f: Frequency): string { return `fq-badge fq-badge--${f}`; }
  freqStripeClass(f: Frequency): string { return `stripe stripe--${f}`; }

  jobRef(scope: AuditScope, job: ScopeJob): string {
    return jobRef(scope.code, job.id);
  }
  instanceLabel(s: InstanceStatus): string { return this.meta[s].label; }
  instanceClass(s: InstanceStatus): string { return `tag st-${s}`; }

  /** F-101, F-102, … placeholder refs — swap for real finding records once wired to the API. */
  findingsArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  onClose(): void {
    this.drawerRef?.close(null);
  }
}