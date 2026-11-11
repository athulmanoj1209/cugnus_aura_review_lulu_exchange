import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { LayoutService } from '@/app/layout/service/layout.service';
import { StaffRow } from '@/app/features/admin/dashboard/models/dashboard-staff.model';

@Component({
  selector: 'app-audit-staff-performance-tab',
  standalone: true,
  imports: [CommonModule, ChartModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit-staff-performance-tab.component.html',
  styleUrls: ['./audit-staff-performance-tab.component.scss'],
})
export class AuditStaffPerformanceTabComponent {

  private readonly layoutService = inject(LayoutService);

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in light-mode-only hex at load time. */
  private readonly themeColors = computed(() => {
    this.layoutService.layoutConfig().darkTheme;
    const ds = getComputedStyle(document.documentElement);
    return {
      surfaceCard: ds.getPropertyValue('--surface-card').trim() || '#ffffff',
      surfaceBorder: ds.getPropertyValue('--surface-border').trim() || '#e2e8f0',
      text: ds.getPropertyValue('--text-color').trim() || '#0f172a',
      textSecondary: ds.getPropertyValue('--text-color-secondary').trim() || '#64748b',
    };
  });

  /* ── KPI ─────────────────────────────────────────────────────────────── */

  readonly kpis = [
    { label: $localize`:@@dashboard.staff.kpiTotalStaff:Total Staff`,          value: '6',   sub: $localize`:@@dashboard.staff.kpiActiveAuditors:Active auditors`,                         icon: 'pi pi-users',          variant: ''      },
    { label: $localize`:@@dashboard.staff.kpiAvgUtilization:Avg Utilization`,  value: '81%', sub: '↑ ' + $localize`:@@dashboard.staff.kpiChangeFromLastMonth:${'4%'}:change: from last month`, icon: 'pi pi-arrow-up-right', variant: 'green' },
    { label: $localize`:@@dashboard.staff.kpiAvgClosureRate:Avg Closure Rate`, value: '83%', sub: '↑ ' + $localize`:@@dashboard.staff.kpiChangeFromLastMonth:${'2%'}:change: from last month`, icon: 'pi pi-check-circle',   variant: 'green' },
    { label: $localize`:@@dashboard.staff.kpiTotalTasks:Total Tasks`,          value: '56',  sub: $localize`:@@dashboard.staff.kpiOfAssigned:of ${67}:assigned: assigned`,                   icon: 'pi pi-clipboard',      variant: ''      },
  ];

  /* ── Display labels (i18n) — display only; raw role values stay as data ── */

  private readonly roleDisplayLabels: Record<string, string> = {
    'Senior Auditor': $localize`:@@dashboard.staff.roleSeniorAuditor:Senior Auditor`,
    'Auditor': $localize`:@@dashboard.staff.roleAuditor:Auditor`,
    'Audit Manager': $localize`:@@dashboard.staff.roleAuditManager:Audit Manager`,
  };

  roleDisplay(role: string): string {
    return this.roleDisplayLabels[role] ?? role;
  }

  legendToggleAriaLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@dashboard.staff.legendShowAria:Show ${label}:label:`
      : $localize`:@@dashboard.staff.legendHideAria:Hide ${label}:label:`;
  }

  /* ── Chart: Staff Utilization (Horizontal Bar) ───────────────────────── */

  readonly staffNames = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Lisa Anderson'];

  readonly utilizationData = {
    labels: this.staffNames,
    datasets: [{
      label: $localize`:@@dashboard.staff.utilizationPct:Utilization %`,
      data: [85, 92, 78, 88, 75, 65],
      backgroundColor: '#4472C4',
      borderRadius: 4,
    }],
  };

  /** Highlights the hovered staff member's full row, matching the Risk Rating Distribution chart. */
  private readonly utilizationHoverBandPlugin = {
    id: 'utilizationHoverBand',
    beforeDatasetsDraw: (chart: any) => {
      const active = chart.getActiveElements();
      if (!active || !active.length) return;
      const { ctx, chartArea, scales } = chart;
      const yScale = scales['y'];
      const index = active[0].index;
      const bandHeight = yScale.height / yScale.ticks.length;
      const centerY = yScale.getPixelForTick(index);
      ctx.save();
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.fillRect(chartArea.left, centerY - bandHeight / 2, chartArea.right - chartArea.left, bandHeight);
      ctx.restore();
    },
  };

  readonly utilizationHoverBandPlugins = [this.utilizationHoverBandPlugin];

  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend —
   *  same treatment as the Audits by Department chart. */
  readonly utilizationLegend: DonutLegendItem[] = [{
    label: this.utilizationData.datasets[0].label,
    value: this.utilizationData.datasets[0].data.reduce((sum, n) => sum + n, 0),
    color: this.utilizationData.datasets[0].backgroundColor,
  }];

  /** Tracks which dataset the user has hidden via the legend. */
  utilizationHidden: boolean[] = this.utilizationLegend.map(() => false);

  @ViewChild('utilizationChart') private utilizationChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleUtilizationDataset(index: number): void {
    const chart = this.utilizationChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.utilizationHidden[index] = !this.utilizationHidden[index];
  }

  readonly hBarOptions = computed(() => {
    const c = this.themeColors();
    return {
      indexAxis: 'y' as const,
      plugins: {
        /* Built-in legend disabled — `utilizationLegend` renders the same
         * info as a custom HTML legend below the canvas instead. */
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index' as const,
          intersect: false,
          axis: 'y' as const,
          displayColors: false,
          backgroundColor: c.surfaceCard,
          borderColor: c.surfaceBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleColor: c.text,
          titleFont: { size: 12, weight: 'bold' as const },
          bodyColor: c.text,
          bodyFont: { size: 13, weight: 'bold' as const },
          caretSize: 6,
        },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'y' as const },
      scales: {
        x: { beginAtZero: true, max: 100, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 } } },
        y: { offset: true, grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      datasets: {
        bar: {
          barPercentage: 0.5,
          categoryPercentage: 0.45,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  /* ── Chart: Performance Comparison (Radar) ───────────────────────────── */

  readonly radarData = {
    labels: ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa'],
    datasets: [
      {
        label: $localize`:@@dashboard.staff.utilizationPct:Utilization %`,
        data: [85, 92, 78, 88, 75, 65],
        borderColor: '#4472C4',
        backgroundColor: 'rgba(68,114,196,0.2)',
        pointBackgroundColor: '#4472C4',
        fill: true,
      },
      {
        label: $localize`:@@dashboard.staff.closureRatePct:Closure Rate %`,
        data: [83.3, 86.7, 80, 84.6, 77.8, 87.5],
        borderColor: '#70AD47',
        backgroundColor: 'rgba(112,173,71,0.2)',
        pointBackgroundColor: '#70AD47',
        fill: true,
      },
    ],
  };

  readonly radarOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 }, padding: 16, color: c.textSecondary } },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { font: { size: 9 }, stepSize: 25, display: false },
          pointLabels: { font: { size: 10 }, color: c.textSecondary },
          grid: { color: c.surfaceBorder },
          angleLines: { color: c.surfaceBorder },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  /* ── Chart: Workload Distribution (Stacked Bar) ──────────────────────── */

  readonly workloadData = {
    labels: this.staffNames,
    datasets: [
      { label: $localize`:@@common.completed:Completed`, data: [10, 13, 8, 11, 7, 7], backgroundColor: '#70AD47', borderRadius: 4, borderSkipped: false },
      { label: $localize`:@@common.pending:Pending`,   data: [2,  2,  2,  2,  2, 1], backgroundColor: '#FFC000', borderRadius: 4, borderSkipped: false },
    ],
  };

  /** Highlights the hovered category's full column, matching the audit overview charts. */
  private readonly workloadHoverBandPlugin = {
    id: 'workloadHoverBand',
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

  /** Chart.js plugin: cuts a thin gap between adjacent stacked segments by
   *  painting a sliver of the card background over each segment boundary —
   *  same technique as `riskSegmentGapPlugin` on the Risk Rating
   *  Distribution chart, just oriented for a vertical (y-axis stacked) bar
   *  instead of a horizontal one. */
  private readonly workloadSegmentGapPlugin = {
    id: 'workloadSegmentGap',
    afterDatasetsDraw(chart: any): void {
      const { ctx, data } = chart;
      const gap = 3;
      for (let index = 0; index < data.labels.length; index++) {
        const visibleDatasetIndexes = data.datasets
          .map((_: any, di: number) => di)
          .filter((di: number) => data.datasets[di].data[index]);
        for (let k = 0; k < visibleDatasetIndexes.length - 1; k++) {
          const bar = chart.getDatasetMeta(visibleDatasetIndexes[k]).data[index];
          if (!bar) continue;
          const left = bar.x - bar.width / 2;
          ctx.save();
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-card').trim() || '#fff';
          ctx.fillRect(left, bar.y - gap / 2, bar.width, gap);
          ctx.restore();
        }
      }
    },
  };

  readonly workloadHoverBandPlugins = [this.workloadHoverBandPlugin, this.workloadSegmentGapPlugin];

  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend —
   *  same treatment as the Audits by Department chart. */
  readonly workloadLegend: DonutLegendItem[] = this.workloadData.datasets.map(ds => ({
    label: ds.label,
    value: ds.data.reduce((sum, n) => sum + n, 0),
    color: ds.backgroundColor,
  }));

  /** Tracks which dataset the user has hidden via the legend. */
  workloadHidden: boolean[] = this.workloadLegend.map(() => false);

  @ViewChild('workloadChart') private workloadChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleWorkloadDataset(index: number): void {
    const chart = this.workloadChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.workloadHidden[index] = !this.workloadHidden[index];
  }

  readonly stackedOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        /* Built-in legend disabled — `workloadLegend` renders the same info
         * as a custom HTML legend below the canvas instead. */
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index' as const,
          intersect: false,
          displayColors: false,
          backgroundColor: c.surfaceCard,
          borderColor: c.surfaceBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleColor: c.text,
          titleFont: { size: 12, weight: 'bold' as const },
          bodyColor: c.text,
          bodyFont: { size: 13, weight: 'bold' as const },
          caretSize: 6,
        },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'x' as const },
      scales: {
        x: { stacked: true, offset: true, grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
        y: { stacked: true, beginAtZero: true, max: 16, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, stepSize: 4 } },
      },
      datasets: {
        bar: {
          barPercentage: 0.35,
          categoryPercentage: 0.412,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  /* ── Chart: Utilization by Role (Dual-Axis Bar) ──────────────────────── */

  readonly roleData = {
    labels: ['Senior Auditor', 'Auditor', 'Audit Manager'].map(r => this.roleDisplay(r)),
    datasets: [
      { label: $localize`:@@dashboard.staff.staffCount:Staff Count`,             data: [3, 2, 1],          backgroundColor: '#4472C4', yAxisID: 'y',  borderRadius: 4 },
      { label: $localize`:@@dashboard.staff.avgUtilizationPct:Avg Utilization %`, data: [88.3, 76.5, 65],   backgroundColor: '#70AD47', yAxisID: 'y1', borderRadius: 4 },
    ],
  };

  /** Highlights the hovered category's full column, matching the audit overview charts. */
  private readonly roleHoverBandPlugin = {
    id: 'roleHoverBand',
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

  readonly roleHoverBandPlugins = [this.roleHoverBandPlugin];

  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend —
   *  same treatment as the Audits by Department chart. */
  readonly roleLegend: DonutLegendItem[] = this.roleData.datasets.map(ds => ({
    label: ds.label,
    value: ds.data.reduce((sum, n) => sum + n, 0),
    color: ds.backgroundColor,
  }));

  /** Tracks which dataset the user has hidden via the legend. */
  roleHidden: boolean[] = this.roleLegend.map(() => false);

  @ViewChild('roleChart') private roleChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleRoleDataset(index: number): void {
    const chart = this.roleChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.roleHidden[index] = !this.roleHidden[index];
  }

  readonly dualAxisOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        /* Built-in legend disabled — `roleLegend` renders the same info as a
         * custom HTML legend below the canvas instead. */
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index' as const,
          intersect: false,
          displayColors: false,
          backgroundColor: c.surfaceCard,
          borderColor: c.surfaceBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleColor: c.text,
          titleFont: { size: 12, weight: 'bold' as const },
          bodyColor: c.text,
          bodyFont: { size: 13, weight: 'bold' as const },
          caretSize: 6,
        },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'x' as const },
      scales: {
        y: {
          type: 'linear' as const,
          position: 'left' as const,
          beginAtZero: true,
          max: 3,
          grid: { color: c.surfaceBorder },
          ticks: { font: { size: 11 }, stepSize: 0.75 },
        },
        y1: {
          type: 'linear' as const,
          position: 'right' as const,
          beginAtZero: true,
          max: 100,
          grid: { drawOnChartArea: false },
          ticks: { font: { size: 11 }, stepSize: 25 },
        },
        x: { offset: true, grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      datasets: {
        bar: {
          barPercentage: 0.35,
          categoryPercentage: 0.412,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  /* ── Table ───────────────────────────────────────────────────────────── */

  readonly staffTable: StaffRow[] = [
    { name: 'John Smith',    role: 'Senior Auditor', utilization: 85, hours: '136/160', assigned: 12, completed: 10, closureRate: '83.3%' },
    { name: 'Sarah Johnson', role: 'Senior Auditor', utilization: 92, hours: '147/160', assigned: 15, completed: 13, closureRate: '86.7%' },
    { name: 'Michael Brown', role: 'Auditor',        utilization: 78, hours: '125/160', assigned: 10, completed: 8,  closureRate: '80.0%' },
    { name: 'Emily Davis',   role: 'Senior Auditor', utilization: 88, hours: '141/160', assigned: 13, completed: 11, closureRate: '84.6%' },
    { name: 'David Wilson',  role: 'Auditor',        utilization: 75, hours: '120/160', assigned: 9,  completed: 7,  closureRate: '77.8%' },
    { name: 'Lisa Anderson', role: 'Audit Manager',  utilization: 65, hours: '104/160', assigned: 8,  completed: 7,  closureRate: '87.5%' },
  ];

  utilTier(pct: number): 'low' | 'mid' | 'high' {
    if (pct >= 90) return 'high';
    if (pct >= 75) return 'mid';
    return 'low';
  }
}