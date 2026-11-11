import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';

export interface DashboardDetailColumn {
  key: string;
  label: string;
  /** Right-aligns numeric columns. */
  numeric?: boolean;
  /** Appends '%' to the cell value. */
  percent?: boolean;
  /** Renders the cell as a status tag, coloured via `DashboardDetailDrawerData.tagSeverity`. */
  tag?: boolean;
}

export type DashboardDetailRow = Record<string, string | number>;

/** One bar series in the drawer's chart — reads `row[key]` from each row. */
export interface DashboardDetailSeries {
  key: string;
  label: string;
  color: string;
}

/** How the drawer charts its current page of rows. */
export interface DashboardDetailChart {
  /** Row field used as the bar's category label. */
  labelKey: string;
  /** Optional row field shown as a second label line (e.g. the parent division). */
  sublabelKey?: string;
  series: DashboardDetailSeries[];
  /** Horizontal bars (one row per item) — reads better for long names like scopes. */
  horizontal?: boolean;
  /** Value axis is a 0–100 percentage. */
  percent?: boolean;
  /** Single-series charts only: colours each bar by `row[key]` (e.g. a status) instead of the series colour. */
  colorBy?: { key: string; colors: Record<string, string> };
}

/** Payload handed to this drawer via `RightDrawerService.open(..., { data })`. */
export interface DashboardDetailDrawerData {
  title: string;
  subtitle: string;
  /** Plural noun for the pagination bar, e.g. 'sub-divisions' or 'scope items'. */
  entityLabel: string;
  chart: DashboardDetailChart;
  columns: DashboardDetailColumn[];
  rows: DashboardDetailRow[];
  /** Status → p-tag severity, for `tag` columns. */
  tagSeverity?: Record<string, 'danger' | 'warn' | 'success' | 'info' | 'secondary'>;
}

/**
 * "View all" drawer for the client dashboard's Audits / RFIs by Division / Sub-Division
 * charts and its Scope summary: the cards only preview their first few items, this charts
 * every item of the card's current view — one page at a time — with the same page as a
 * table underneath for exact values.
 */
@Component({
  selector: 'app-client-dashboard-detail-drawer',
  standalone: true,
  imports: [CommonModule, ChartModule, TagModule, PaginationBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './client-dashboard-detail.component.html',
  styleUrls: ['./client-dashboard-detail.component.scss'],
})
export class ClientDashboardDetailDrawerComponent {
  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as DashboardDetailDrawerData;

  /** 1-based page state; <app-pagination-bar> itself is 0-based. */
  page = 1;
  pageSize = 10;
  readonly pageSizeOptions = [10, 25, 50, 100];

  get pagedRows(): DashboardDetailRow[] {
    const start = (this.page - 1) * this.pageSize;
    return this.data.rows.slice(start, start + this.pageSize);
  }

  /* Rebuilt only when the page changes (not a getter) so p-chart doesn't re-render on every
   * change-detection pass. */
  chartData = this.buildChartData();

  readonly chartOptions = this.buildChartOptions();

  /** Horizontal charts grow with the number of bars on the page; vertical ones keep a fixed height. */
  get chartHeightPx(): number {
    return this.data.chart.horizontal ? Math.max(220, this.pagedRows.length * 34 + 60) : 320;
  }

  private buildChartData() {
    const { chart } = this.data;
    const rows = this.pagedRows;
    return {
      labels: rows.map(r => {
        const label = String(r[chart.labelKey]);
        const sub = chart.sublabelKey ? String(r[chart.sublabelKey] ?? '') : '';
        return sub && sub !== '—' ? [label, sub] : label;
      }),
      datasets: chart.series.map(s => ({
        label: s.label,
        data: rows.map(r => Number(r[s.key]) || 0),
        backgroundColor: chart.colorBy
          ? rows.map(r => chart.colorBy!.colors[String(r[chart.colorBy!.key])] ?? s.color)
          : s.color,
        borderRadius: 4,
        maxBarThickness: 40,
      })),
    };
  }

  private buildChartOptions() {
    const { chart } = this.data;
    const valueAxis = {
      beginAtZero: true,
      ...(chart.percent ? { max: 100 } : {}),
      grid: { color: '#f1f5f9' },
      ticks: {
        font: { size: 11 },
        precision: 0,
        ...(chart.percent ? { callback: (v: number | string) => `${v}%` } : {}),
      },
    };
    const categoryAxis = { grid: { display: false }, ticks: { font: { size: 11 } } };
    return {
      indexAxis: chart.horizontal ? ('y' as const) : ('x' as const),
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        // Several series need a key; a single (possibly status-coloured) series is named by the title.
        legend: {
          display: chart.series.length > 1,
          position: 'bottom' as const,
          labels: { boxWidth: 10, font: { size: 11 }, padding: 12 },
        },
        tooltip: {
          callbacks: {
            label: (item: any) => {
              const v = chart.horizontal ? item.parsed.x : item.parsed.y;
              return `${item.dataset.label}: ${v}${chart.percent ? '%' : ''}`;
            },
          },
        },
      },
      scales: chart.horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
    };
  }

  onPageChange(page: number): void {
    this.page = page + 1;
    this.chartData = this.buildChartData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 1;
    this.chartData = this.buildChartData();
  }

  close(): void {
    this.drawerRef.close();
  }
}
