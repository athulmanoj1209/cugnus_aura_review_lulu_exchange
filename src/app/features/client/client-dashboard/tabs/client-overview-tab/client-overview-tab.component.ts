import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { LayoutService } from '@/app/layout/service/layout.service';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import {
  ClientDashboardDetailDrawerComponent,
  DashboardDetailDrawerData,
  DashboardDetailRow,
} from '../../com/client-dashboard-detail/client-dashboard-detail.component';
import { KpiCard, ScopeItem, UpcomingAudit } from '../../models/client-dashboard.model';

interface CalendarDay {
  day: number | null;
  audits: UpcomingAudit[];
}

/** Which unit the "Audits by …" view groups by. */
type UnitView = 'division' | 'subDivision';

/** Where a scope sits: on a division itself, or on one sub-division of a division. */
interface DashboardUnit {
  division: string;
  /** null for a division-level unit. */
  subDivision: string | null;
}

/** Distinct units in first-appearance order, sub-divisions grouped by their division. */
function distinctUnits(units: DashboardUnit[]): DashboardUnit[] {
  const byDivision = new Map<string, DashboardUnit[]>();
  for (const u of units) {
    const list = byDivision.get(u.division) ?? [];
    byDivision.set(u.division, list);
    if (!list.some(x => x.subDivision === u.subDivision)) list.push(u);
  }
  return [...byDivision.values()].flat();
}

/** Division name, or a two-line sub-division / parent-division chart label. */
function unitLabel(u: DashboardUnit): string | string[] {
  return u.subDivision === null ? u.division : [u.subDivision, `↳ ${u.division}`];
}

/** Unit name + its parent division (blank for a division-level unit). */
function unitCells(u: DashboardUnit): DashboardDetailRow {
  return u.subDivision === null
    ? { unit: u.division, division: '—' }
    : { unit: u.subDivision, division: u.division };
}

function viewNoun(view: UnitView, plural = false): string {
  return view === 'division' ? (plural ? 'divisions' : 'division') : (plural ? 'sub-divisions' : 'sub-division');
}

const AUDIT_STATUS_COLORS = ['#4169E1', '#9E9E9E', '#4CAF50', '#EF4444'];

@Component({
  selector: 'app-client-overview-tab',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, ChartModule, DonutStatusChartComponent, DrawIconComponent],
  templateUrl: './client-overview-tab.component.html',
  styleUrls: ['./client-overview-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOverviewTabComponent implements OnChanges {
  @Input() isCfo = true;
  @Input() kpis: KpiCard[] = [];
  @Input() scopes: ScopeItem[] = [];
  @Input() upcomingAudits: UpcomingAudit[] = [];

  @Output() kpiClick = new EventEmitter<KpiCard>();

  // The Audits chart shows only its first PREVIEW_COUNT units; "View all" opens
  // ClientDashboardDetailDrawerComponent, which lists every unit with pagination.
  readonly PREVIEW_COUNT = 5;
  readonly allSubDivisionsLabel = $localize`:@@client.auditTeamChart.allSubDivisions:All sub-divisions`;
  readonly itSecurityAssessmentLabel = $localize`:@@client.clientDashboard.itSecurityAssessment:IT Security Assessment`;
  readonly viewAllLabel = $localize`:@@common.viewAll:View all`;
  readonly scheduledLabel = $localize`:@@client.auditTeamChart.scheduled:scheduled`;
  readonly sundayLabel = $localize`:@@common.sunday:Sun`;
  readonly mondayLabel = $localize`:@@common.monday:Mon`;
  readonly tuesdayLabel = $localize`:@@common.tuesday:Tue`;
  readonly wednesdayLabel = $localize`:@@common.wednesday:Wed`;
  readonly thursdayLabel = $localize`:@@common.thursday:Thu`;
  readonly fridayLabel = $localize`:@@common.friday:Fri`;
  readonly saturdayLabel = $localize`:@@common.saturday:Sat`;

  readonly unitViews: { key: UnitView; label: string }[] = [
    { key: 'division', label: $localize`:@@common.division:Division` },
    { key: 'subDivision', label: $localize`:@@common.subDivision:Sub-Division` },
  ];

  readonly upcomingAuditSeverity: Record<string, 'danger' | 'warn' | 'success' | 'info' | 'secondary'> = {
    'In Progress': 'info',
    Planned: 'secondary',
    Completed: 'success',
    Overdue: 'danger',
  };

  // ── Audit status donut ───────────────────────────────────────────────────
  auditStatusLegend: DonutLegendItem[] = [];

  // ── Audits by Division / Sub-Division ────────────────────────────────────
  // Division: only division-level scopes. Sub-Division (default): only
  // sub-division ones, labelled with their parent division.
  auditsByView: UnitView = 'subDivision';

  /** Every unit of the chart's current view, with its counts — the chart plots
   *  the first PREVIEW_COUNT, the "View all" drawer lists them all. */
  auditUnitRows: { unit: DashboardUnit; engagements: number }[] = [];

  auditsBySubDivisionChartData: any;
  auditsBySubDivisionChartOptions: any;

  auditsByLabel(view: UnitView): string {
    return view === 'division'
      ? $localize`:@@client.auditTeamChart.auditsByDivision:Audits by division`
      : $localize`:@@client.auditTeamChart.auditsBySubDivision:Audits by sub-division`;
  }

  totalEngagementsPerLabel(view: UnitView): string {
    return view === 'division'
      ? $localize`:@@client.auditTeamChart.totalEngagementsPerDivision:Total engagements per division`
      : $localize`:@@client.auditTeamChart.totalEngagementsPerSubDivision:Total engagements per sub-division`;
  }

  topPreviewLabel(top: number, total: number): string {
    return $localize`:@@client.auditTeamChart.topPreview:top ${top} of ${total}`;
  }

  noAuditsLabel(view: UnitView): string {
    return view === 'division'
      ? $localize`:@@client.auditTeamChart.noDivisionAudits:No division-level audits`
      : $localize`:@@client.auditTeamChart.noSubDivisionAudits:No sub-division audits`;
  }

  /** Highlights the hovered category's full column. */
  private readonly auditsBySubDivisionHoverBandPlugin = {
    id: 'auditsBySubDivisionHoverBand',
    beforeDatasetsDraw: (chart: any) => {
      const active = chart.getActiveElements();
      if (!active || !active.length) return;
      const { ctx, chartArea, scales } = chart;
      const xScale = scales['x'];
      const index = active[0].index;
      const bandWidth = xScale.width / xScale.ticks.length;
      const centerX = xScale.getPixelForTick(index);
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.fillRect(centerX - bandWidth / 2, chartArea.top, bandWidth, chartArea.bottom - chartArea.top);
      ctx.restore();
    },
  };

  readonly auditsBySubDivisionHoverBandPlugins = [this.auditsBySubDivisionHoverBandPlugin];

  // ── Upcoming Audits: list / calendar view toggle ────────────────────────
  readonly weekDayLabels = [
    this.sundayLabel,
    this.mondayLabel,
    this.tuesdayLabel,
    this.wednesdayLabel,
    this.thursdayLabel,
    this.fridayLabel,
    this.saturdayLabel,
  ];
  upcomingView: 'list' | 'calendar' = 'list';
  calendarYear = new Date().getFullYear();
  calendarMonth = new Date().getMonth();

  private readonly drawer = inject(RightDrawerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly layoutService = inject(LayoutService);

  constructor() {
    /** Re-builds the Chart.js options whenever dark mode toggles — they read
     *  CSS theme variables via getComputedStyle, which Chart.js can't
     *  consume directly, so they must be rebuilt on every theme change. */
    effect(() => {
      this.layoutService.layoutConfig().darkTheme;
      this.initChartOptions();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scopes']) {
      this.auditStatusLegend = this.buildAuditStatusLegend();
      this.auditsBySubDivisionChartData = this.buildAuditsBySubDivisionChartData();
    }
    if (changes['upcomingAudits']) {
      this.resetUpcomingCalendar();
    }
  }

  onKpiClick(kpi: KpiCard): void {
    if (kpi.clickable) this.kpiClick.emit(kpi);
  }

  // ── Audits by Division / Sub-Division ────────────────────────────────────

  setAuditsByView(view: UnitView): void {
    this.auditsByView = view;
    this.auditsBySubDivisionChartData = this.buildAuditsBySubDivisionChartData();
  }

  openAuditsDetail(): void {
    const noun = viewNoun(this.auditsByView);
    const total = this.auditUnitRows.reduce((s, r) => s + r.engagements, 0);
    this.drawer.open<void, DashboardDetailDrawerData>(ClientDashboardDetailDrawerComponent, {
      width: '720px',
      data: {
        title: `Audits by ${noun}`,
        subtitle: `${this.auditUnitRows.length} ${viewNoun(this.auditsByView, true)} · ${total} engagements`,
        entityLabel: viewNoun(this.auditsByView, true),
        chart: {
          labelKey: 'unit',
          sublabelKey: 'division',
          series: [{ key: 'engagements', label: 'Engagements', color: '#4169E1' }],
        },
        columns: [
          { key: 'unit', label: this.unitViews.find(v => v.key === this.auditsByView)!.label },
          ...(this.auditsByView === 'subDivision' ? [{ key: 'division', label: 'Division' }] : []),
          { key: 'engagements', label: 'Engagements', numeric: true },
        ],
        rows: this.auditUnitRows.map(r => ({ ...unitCells(r.unit), engagements: r.engagements })),
      },
    });
  }

  private initChartOptions(): void {
    const ds = getComputedStyle(document.documentElement);
    const surfaceCard = ds.getPropertyValue('--surface-card').trim() || '#ffffff';
    const surfaceBorder = ds.getPropertyValue('--surface-border').trim() || '#e2e8f0';
    const text = ds.getPropertyValue('--text-color').trim() || '#0f172a';

    this.auditsBySubDivisionChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: surfaceCard,
          titleColor: text,
          bodyColor: text,
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 10,
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: surfaceBorder } },
      },
      datasets: {
        bar: {
          barPercentage: 0.35,
          categoryPercentage: 0.412,
        },
      },
    };
  }

  /**
   * "Audit status distribution" donut legend. For CLIENT_MODE_VALUE === 'internal-audit',
   * counts come from `scopes` (the same live top-level scopes the Scope tab counts) grouped by
   * ScopeItem.status. `Not started` has no bucket of its own in this 4-slice donut, so it's
   * folded into `Planned` (both mean "hasn't begun"), matching how the Scope tab's atRisk stat
   * already groups the two together.
   *
   * For 'audit-firm' mode, the original hardcoded placeholder is kept — no equivalent
   * audit-firm scope-status seed was provided to derive it from here.
   */
  private buildAuditStatusLegend(): DonutLegendItem[] {
    const labels = ['In Progress', 'Planned', 'Completed', 'Overdue'];
    let values = [3, 2, 2, 1];
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const counts = { 'In Progress': 0, Planned: 0, Completed: 0, Overdue: 0 };
      for (const scope of this.scopes) {
        switch (scope.status) {
          case 'In progress':   counts['In Progress'] += 1; break;
          case 'Not started':
          case 'Planned':       counts.Planned += 1; break;
          case 'Completed':     counts.Completed += 1; break;
          case 'Overdue':       counts.Overdue += 1; break;
        }
      }
      values = [counts['In Progress'], counts.Planned, counts.Completed, counts.Overdue];
    }
    return labels.map((label, i) => ({ label, value: values[i], color: AUDIT_STATUS_COLORS[i] }));
  }

  /**
   * "Audits by Division / Sub-Division" bar chart data. The bar height is the count of
   * `scopes` on each unit, split by the card's toggle (`auditsByView`): division-level scopes
   * (sitting directly under a division with no sub-division) or sub-division scopes only — so
   * each engagement shows up in exactly one view. Sub-divisions are keyed by their division
   * too, so same-named sub-divisions of different divisions never merge.
   */
  private buildAuditsBySubDivisionChartData() {
    const unitOf = (s: ScopeItem): DashboardUnit => ({
      division: s.division ?? 'Unassigned',
      subDivision: s.divisionLevel ? null : (s.ownSubDivision ?? null),
    });
    const units = distinctUnits(this.scopes.map(unitOf))
      .filter((u) => (u.subDivision === null) === (this.auditsByView === 'division'));
    this.auditUnitRows = units.map((unit) => ({
      unit,
      engagements: this.scopes.filter((s) => {
        const su = unitOf(s);
        return su.division === unit.division && su.subDivision === unit.subDivision;
      }).length,
    }));
    // Only the first PREVIEW_COUNT units are charted — "View all" (openAuditsDetail) lists every one.
    const preview = this.auditUnitRows.slice(0, this.PREVIEW_COUNT);
    return {
      labels: preview.map((r) => unitLabel(r.unit)),
      datasets: [{
        label: 'Engagements',
        data: preview.map((r) => r.engagements),
        backgroundColor: '#4169E1',
        borderRadius: 4,
      }],
    };
  }

  // ── Upcoming Audits: list / calendar view toggle ────────────────────────

  setUpcomingView(view: 'list' | 'calendar'): void {
    this.upcomingView = view;
  }

  get calendarMonthLabel(): string {
    return new Date(this.calendarYear, this.calendarMonth, 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarDays(): CalendarDay[] {
    const firstOfMonth = new Date(this.calendarYear, this.calendarMonth, 1);
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
    const days: CalendarDay[] = [];

    for (let i = 0; i < firstOfMonth.getDay(); i++) {
      days.push({ day: null, audits: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const audits = this.upcomingAudits.filter(a =>
        a.date.getFullYear() === this.calendarYear &&
        a.date.getMonth() === this.calendarMonth &&
        a.date.getDate() === d,
      );
      days.push({ day: d, audits });
    }
    return days;
  }

  prevMonth(): void {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
  }

  nextMonth(): void {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
  }

  /** Jumps the calendar to the month of the first upcoming audit whenever the audit list (re)loads. */
  private resetUpcomingCalendar(): void {
    const first = this.upcomingAudits[0]?.date ?? new Date();
    this.calendarYear = first.getFullYear();
    this.calendarMonth = first.getMonth();
  }
}
