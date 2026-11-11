import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ChartModule, UIChart } from 'primeng/chart';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { LayoutService } from '@/app/layout/service/layout.service';

import {
  ClientDashboardDetailDrawerComponent,
  DashboardDetailDrawerData,
  DashboardDetailRow,
} from '../../com/client-dashboard-detail/client-dashboard-detail.component';
import { KpiCard, RfiBreakdown, RfiItem, RfiStatus } from '../../models/client-dashboard.model';
import { EnrichedStaticRfi } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';

/** Which unit the "RFIs by …" view groups by. */
type UnitView = 'division' | 'subDivision';

/** Where an RFI sits: on a division itself, or on one sub-division of a division. */
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
  if (view === 'division') {
    return plural ? $localize`:@@common.divisions:divisions` : $localize`:@@client.clientRfis.divisionLower:division`;
  }
  return plural ? $localize`:@@common.subDivisions:sub-divisions` : $localize`:@@client.clientRfis.subDivisionLower:sub-division`;
}

// Same 5 colors rfi-client-list.component.scss uses for its own stat cards, so the donut
// here reads as the same palette as the full RFI Management page.
const RFI_STATUS_COLOR_MAP: Record<string, string> = {
  Pending: '#f59e0b',
  Overdue: '#ef4444',
  'Under Review': '#6366f1',
  Reopened: '#f97316',
  Completed: '#10b981',
};

const SUB_DIVISION_BAR_COLORS = { total: '#4169E1', open: '#FF9800', overdue: '#EF4444' };

@Component({
  selector: 'app-client-rfis-tab',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, ChartModule, DonutStatusChartComponent, DrawIconComponent],
  templateUrl: './client-rfis-tab.component.html',
  styleUrls: ['./client-rfis-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientRfisTabComponent implements OnChanges {
  @Input() isCfo = true;
  @Input() kpis: KpiCard[] = [];
  /** "Most urgent, one per open status" preview of the role's RFI pool. */
  @Input() rfis: RfiItem[] = [];
  @Input() rfiBreakdown: RfiBreakdown = { pending: 0, overdue: 0, underReview: 0, reopened: 0, completed: 0 };
  /** Every live RFI (unscoped) — the "RFIs by …" chart is built from this. */
  @Input() allRfis: EnrichedStaticRfi[] = [];
  /** The Sub-Division Head's sub-division; null for the CFO (unscoped) view. */
  @Input() subDivision: string | null = null;

  @Output() kpiClick = new EventEmitter<KpiCard>();
  @Output() viewAll = new EventEmitter<void>();

  // The RFIs chart shows only its first PREVIEW_COUNT units; "View all" opens
  // ClientDashboardDetailDrawerComponent, which lists every unit with pagination.
  readonly PREVIEW_COUNT = 5;

  readonly divisionLabel = $localize`:@@client.clientDashboard.divisionLower:division`
  readonly divisionViewLabel = $localize`:@@client.clientDashboard.divisionView:Division`;
  readonly subDivisionViewLabel = $localize`:@@client.clientDashboard.subDivisionView:Sub-Division`;
  readonly allOpenRfisLabel = $localize`:@@client.clientDashboard.allOpenRfis:All open RFIs`;
  readonly myRfisLabel = $localize`:@@client.clientDashboard.myRfis:My RFIs`;
  readonly viewAllLabel = $localize`:@@common.viewAll:View all`;
  readonly showLabel = $localize`:@@common.show:Show`;
  readonly hideLabel = $localize`:@@common.hide:Hide`;
  readonly totalRfisLabel = $localize`:@@client.clientDashboard.totalRfis:Total RFIs`;
  readonly openLabel = $localize`:@@common.open:Open`;
  readonly overdueLabel = $localize`:@@common.overdue:Overdue`;
  readonly openVsOverdueLabel = $localize`:@@client.clientDashboard.openVsOverdue:open vs overdue`;

  readonly unitViews: { key: UnitView; label: string }[] = [
    { key: 'division', label: this.divisionViewLabel },
    { key: 'subDivision', label: this.subDivisionViewLabel },
  ];

  // Matches rfi-client-list.component.ts's own statusSeverity()/statusLabel() — the real RFI
  // pool (rfi-static-data.ts) only ever uses these 5 statuses.
  readonly rfiSeverity: Record<string, 'danger' | 'warn' | 'success' | 'info' | 'secondary'> = {
    Overdue: 'danger',
    Pending: 'warn',
    'Under Review': 'secondary',
    Reopened: 'danger',
    Completed: 'success',
  };

  rfiStatusLegend: DonutLegendItem[] = [];

  // ── RFIs by Division / Sub-Division (CFO view) ──────────────────────────
  // Division: only division-level RFIs. Sub-Division (default): only
  // sub-division ones, labelled with their parent division.
  rfisByView: UnitView = 'subDivision';

  /** Every unit of the chart's current view, with its counts — the chart plots
   *  the first PREVIEW_COUNT, the "View all" drawer lists them all. */
  rfiUnitRows: { unit: DashboardUnit; total: number; open: number; overdue: number }[] = [];

  rfisBySubDivisionChartData: any;
  rfisBySubDivisionChartOptions: any;
  /** Highlights the hovered unit's full column. */
  private readonly rfisBySubDivisionHoverBandPlugin = {
    id: 'rfisBySubDivisionHoverBand',
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

  readonly rfisBySubDivisionHoverBandPlugins = [this.rfisBySubDivisionHoverBandPlugin];

  /* Built-in legend disabled — `rfisBySubDivisionLegend` renders the same info as a
   * custom HTML legend below the canvas instead, styled to match the RFI
   * status distribution donut's legend. */
  rfisBySubDivisionLegend: DonutLegendItem[] = [];
  rfisBySubDivisionHidden: boolean[] = [];

  @ViewChild('rfisBySubDivisionChart') private rfisBySubDivisionChartRef?: UIChart;

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
    if (changes['rfiBreakdown']) {
      this.rfiStatusLegend = this.buildRfiStatusLegend();
    }
    if (changes['allRfis'] || changes['subDivision']) {
      this.buildRfisChart();
    }
  }

  /** Total open (non-completed) RFIs — pending + overdue + under-review + reopened. */
  get rfiOpenTotal(): number {
    const b = this.rfiBreakdown;
    return b.pending + b.overdue + b.underReview + b.reopened;
  }

  rfisByLabel(view: UnitView): string {
    return view === 'division'
      ? $localize`:@@client.clientDashboard.rfisByDivision:RFIs by division`
      : $localize`:@@client.clientDashboard.rfisBySubDivision:RFIs by sub-division`;
  }

  topPreviewLabel(top: number, total: number): string {
    return $localize`:@@client.auditTeamChart.topPreview:top ${top} of ${total}`;
  }

  noRfisLabel(view: UnitView): string {
    return view === 'division'
      ? $localize`:@@client.clientDashboard.noDivisionLevelRfis:No division-level RFIs`
      : $localize`:@@client.clientDashboard.noSubDivisionRfis:No sub-division RFIs`;
  }

  legendVisibilityLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@common.showItem:Show ${label}`
      : $localize`:@@common.hideItem:Hide ${label}`;
  }

  rfiStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      Pending: $localize`:@@common.pending:Pending`,
      Overdue: $localize`:@@common.overdue:Overdue`,
      'Under Review': $localize`:@@common.underReview:Under Review`,
      Reopened: $localize`:@@common.reopened:Reopened`,
      Completed: $localize`:@@common.completed:Completed`,
    };

    return labels[status] ?? status;
  }

  onKpiClick(kpi: KpiCard): void {
    if (kpi.clickable) this.kpiClick.emit(kpi);
  }

  openRfi(rfi: RfiItem): void {
    console.log('Opening RFI:', rfi.id);
  }

  setRfisByView(view: UnitView): void {
    this.rfisByView = view;
    this.buildRfisByUnitChart();
  }

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleRfisBySubDivisionDataset(index: number): void {
    const chart = this.rfisBySubDivisionChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.rfisBySubDivisionHidden[index] = !this.rfisBySubDivisionHidden[index];
  }

  openRfisDetail(): void {
    const noun = viewNoun(this.rfisByView);
    this.drawer.open<void, DashboardDetailDrawerData>(ClientDashboardDetailDrawerComponent, {
      width: '760px',
      data: {
        title: this.rfisByLabel(this.rfisByView),
        subtitle: `${this.rfiUnitRows.length} ${viewNoun(this.rfisByView, true)} · ${this.openVsOverdueLabel}`,
        entityLabel: viewNoun(this.rfisByView, true),
        chart: {
          labelKey: 'unit',
          sublabelKey: 'division',
          series: [
            { key: 'total',   label: this.totalRfisLabel, color: SUB_DIVISION_BAR_COLORS.total },
            { key: 'open',    label: this.openLabel,       color: SUB_DIVISION_BAR_COLORS.open },
            { key: 'overdue', label: this.overdueLabel,    color: SUB_DIVISION_BAR_COLORS.overdue },
          ],
        },
        columns: [
          { key: 'unit', label: this.unitViews.find(v => v.key === this.rfisByView)!.label },
          ...(this.rfisByView === 'subDivision' ? [{ key: 'division', label: this.divisionLabel }] : []),
          { key: 'total', label: this.totalRfisLabel, numeric: true },
          { key: 'open', label: this.openLabel, numeric: true },
          { key: 'overdue', label: this.overdueLabel, numeric: true },
        ],
        rows: this.rfiUnitRows.map(r => ({ ...unitCells(r.unit), total: r.total, open: r.open, overdue: r.overdue })),
      },
    });
  }

  private initChartOptions(): void {
    const ds = getComputedStyle(document.documentElement);
    const surfaceCard = ds.getPropertyValue('--surface-card').trim() || '#ffffff';
    const surfaceBorder = ds.getPropertyValue('--surface-border').trim() || '#e2e8f0';
    const text = ds.getPropertyValue('--text-color').trim() || '#0f172a';

    this.rfisBySubDivisionChartOptions = {
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

  private buildRfiStatusLegend(): DonutLegendItem[] {
    const b = this.rfiBreakdown;
    const statuses: RfiStatus[] = ['Pending', 'Overdue', 'Under Review', 'Reopened', 'Completed'];
    const values = [b.pending, b.overdue, b.underReview, b.reopened, b.completed];
    return statuses.map((status, i) => ({ label: this.rfiStatusLabel(status), value: values[i], color: RFI_STATUS_COLOR_MAP[status] }));
  }

  /** Where an RFI sits — `subDivisionLabel` is '' for a division-level RFI. */
  private rfiUnit(r: EnrichedStaticRfi): DashboardUnit {
    return { division: r.divisionName, subDivision: r.subDivisionLabel || null };
  }

  private buildRfisChart(): void {
    if (this.subDivision === null) {
      this.buildRfisByUnitChart();
      return;
    }
    // Sub-Division Head: one bar for its own sub-division. Not currently rendered (the card is
    // CFO-only — see the `@if (isCfo)` gate in the template) but kept correct for later.
    const pool = this.allRfis.filter((r) => r.subDivisionValue === this.subDivision);
    this.rfisBySubDivisionChartData = {
      labels: [this.subDivision],
      datasets: [
        { label: this.totalRfisLabel, data: [pool.filter((r) => r.status !== 'completed').length], backgroundColor: SUB_DIVISION_BAR_COLORS.total, borderRadius: 3 },
        { label: this.openLabel, data: [pool.filter((r) => r.status !== 'completed' && r.status !== 'overdue').length], backgroundColor: SUB_DIVISION_BAR_COLORS.open, borderRadius: 3 },
        { label: this.overdueLabel, data: [pool.filter((r) => r.status === 'overdue').length], backgroundColor: SUB_DIVISION_BAR_COLORS.overdue, borderRadius: 3 },
      ],
    };
    this.refreshRfisBySubDivisionLegend();
  }

  /**
   * CFO-only "RFIs by Division / Sub-Division" chart, computed from the full (unscoped) RFI
   * pool and split by the card's toggle (`rfisByView`): division-level RFIs or sub-division RFIs
   * only. Units are derived from whatever currently exists in the live data, so a new unit
   * showing up in the store is picked up too. Only the first PREVIEW_COUNT units are charted —
   * "View all" (openRfisDetail) lists every one. Bars: Total(open)/Open(non-overdue)/Overdue.
   */
  private buildRfisByUnitChart(): void {
    const units = distinctUnits(this.allRfis.map((r) => this.rfiUnit(r)))
      .filter((u) => (u.subDivision === null) === (this.rfisByView === 'division'));
    this.rfiUnitRows = units.map((unit) => {
      const inUnit = this.allRfis.filter((r) => {
        const ru = this.rfiUnit(r);
        return ru.division === unit.division && ru.subDivision === unit.subDivision;
      });
      const total = inUnit.filter((r) => r.status !== 'completed').length;
      const overdue = inUnit.filter((r) => r.status === 'overdue').length;
      return { unit, total, open: total - overdue, overdue };
    });

    const preview = this.rfiUnitRows.slice(0, this.PREVIEW_COUNT);
    this.rfisBySubDivisionChartData = {
      labels: preview.map((r) => unitLabel(r.unit)),
      datasets: [
        { label:  this.totalRfisLabel, data: preview.map((r) => r.total),   backgroundColor: SUB_DIVISION_BAR_COLORS.total,   borderRadius: 3 },
        { label:  this.openLabel,       data: preview.map((r) => r.open),    backgroundColor: SUB_DIVISION_BAR_COLORS.open,    borderRadius: 3 },
        { label: this.overdueLabel,    data: preview.map((r) => r.overdue), backgroundColor: SUB_DIVISION_BAR_COLORS.overdue, borderRadius: 3 },
      ],
    };
    this.refreshRfisBySubDivisionLegend();
  }

  /** Legend totals always follow whatever `rfisBySubDivisionChartData` currently plots. */
  private refreshRfisBySubDivisionLegend(): void {
    this.rfisBySubDivisionLegend = this.rfisBySubDivisionChartData.datasets.map((ds: any) => ({
      label: ds.label,
      value: ds.data.reduce((sum: number, n: number) => sum + n, 0),
      color: ds.backgroundColor,
    }));
    this.rfisBySubDivisionHidden = this.rfisBySubDivisionLegend.map(() => false);
  }
}
