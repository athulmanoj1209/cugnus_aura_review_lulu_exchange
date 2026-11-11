import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { Router } from '@angular/router';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AgingAnalysisDetailComponent } from '@/app/features/admin/dashboard/com/aging-analysis-detail/aging-analysis-detail.component';
import { FindingsBySubdivisionDetailComponent } from '@/app/features/admin/dashboard/com/findings-by-subdivision-detail/findings-by-subdivision-detail.component';
import { AgingAnalysisDetailData, AgingBucket, FindingRow, FindingUnitPage, FindingsBySubdivisionDetailData } from '@/app/features/admin/dashboard/models/dashboard-finding.model';
import { DashboardByView } from '@/app/features/admin/dashboard/models/dashboard-common.model';
/* NOTE: adjust this path to wherever findings-profile.component.ts actually
 * lives in your project — assumed to be a sibling folder here, same as the
 * aging-analysis-detail / findings-by-subdivision-detail imports above. */
import { FindingsProfileComponent, FindingProfileData } from '@/app/features/audits/audit-execution/findings/profile/findings-profile.component';
import {
  MOCK_FINDINGS,
  getDistinctCompanies,
  getFindingKpiSummary,
  getOpenAgingCounts,
  getOpenSeverityBreakdown,
  FindingUnitStatusBreakdown,
  getFindingStatusBreakdownByUnit,
  isOpenStatusClass,
  toFindingRow,
} from '@/app/features/audits/audit-execution/findings/audit-finding-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutLegendItem, DonutStatusChartComponent } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { DASHBOARD_ROUTES } from '@/app/features/admin/dashboard/constants/dashboard.constants';
import { DASHBOARD_THEME_FALLBACK_COLORS } from '@/app/features/admin/dashboard/constants/dashboard-labels.constants';

/**
 * This dashboard used to carry its OWN separate mock dataset (`FindingRow[]`
 * with ids F001..F010, placeholder companies like "Acme Holdings") that had
 * nothing to do with the real Findings list page (`findings-list.component
 * .ts`, ids FND-001..012, real companies) — that's exactly why the "Open
 * Findings" KPI here said 4 while the list page it drills into, filtered to
 * Open, showed only 3 results. Every KPI card, chart, and the findings
 * table below are now derived from `MOCK_FINDINGS` in `finding-data.ts` —
 * the SAME data `findings-list.component.ts` reads — via `toFindingRow` and
 * the aggregation helpers there, so this page and the list it links to
 * can't drift apart again.
 */

@Component({
  selector: 'app-audit-findings-tab',
  standalone: true,
  imports: [CommonModule, ChartModule, DrawIconComponent, DonutStatusChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit-findings-tab.component.html',
  styleUrls: ['./audit-findings-tab.component.scss'],
})
export class AuditFindingsTabComponent {
  private readonly router = inject(Router);
  private readonly drawer = inject(RightDrawerService);
  private readonly layoutService = inject(LayoutService);

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in light-mode-only hex at load time. */
  private readonly themeColors = computed(() => {
    this.layoutService.layoutConfig().darkTheme;
    const ds = getComputedStyle(document.documentElement);
    return {
      surfaceCard: ds.getPropertyValue('--surface-card').trim() || DASHBOARD_THEME_FALLBACK_COLORS.SurfaceCard,
      surfaceBorder: ds.getPropertyValue('--surface-border').trim() || DASHBOARD_THEME_FALLBACK_COLORS.SurfaceBorder,
      text: ds.getPropertyValue('--text-color').trim() || DASHBOARD_THEME_FALLBACK_COLORS.Text,
      textSecondary: ds.getPropertyValue('--text-color-secondary').trim() || DASHBOARD_THEME_FALLBACK_COLORS.TextSecondary,
    };
  });

  /* NOTE: adjust to the real route path where the findings list is registered. */
  private readonly findingsRoute = DASHBOARD_ROUTES.Findings;

  constructor() {
    // This component's data is a static field, not a reactive signal, so
    // there's no ongoing recompute to hook a check into — a one-time check
    // at construction is enough. See `verifyDataIntegrity()`'s doc comment.
    this.setFindingsByView(this.findingsByView);
    this.verifyDataIntegrity();
  }

  findingdetails(row: FindingRow): void {
    this.drawer.open<void, FindingProfileData>(FindingsProfileComponent, {
      width: '620px',
      data: {
        id: row.id,
        title: row.finding,
        severity: row.severityClass as FindingProfileData['severity'],
        status: row.statusClass,
        subDivision: row.subDivision,
        scope: row.scope,
        subscope: row.subscope,
        company: row.company,
        division: row.division,
        dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
        // TODO: wire up the real owner once the API exposes one per finding.
        owner: { fullName: $localize`:@@dashboard.findings.unassigned:Unassigned` },
        isRepeated: row.repeated,
        daysOverdue: row.statusClass === 'overdue' ? row.ageDays : undefined,
      },
    });
  }

  /** Redirects to the findings list, pre-filtered to the clicked KPI's slice. */
  goToFindings(view: string): void {
    if (!view) return;
    this.router.navigate([this.findingsRoute], { queryParams: { view } });
  }

  /* ── Display labels (i18n) ───────────────────────────────────────────── */

  private readonly severityDisplayLabels: Record<string, string> = {
    critical: $localize`:@@common.critical:Critical`,
    high: $localize`:@@common.high:High`,
    medium: $localize`:@@common.medium:Medium`,
    low: $localize`:@@common.low:Low`,
  };

  private readonly statusDisplayLabels: Record<string, string> = {
    open: $localize`:@@common.open:Open`,
    overdue: $localize`:@@common.overdue:Overdue`,
    'in-progress': $localize`:@@common.inProgress:In Progress`,
    responded: $localize`:@@common.responded:Responded`,
    verified: $localize`:@@common.verified:Verified`,
    closed: $localize`:@@common.closed:Closed`,
    escalated: $localize`:@@common.escalated:Escalated`,
    rejected: $localize`:@@common.rejected:Rejected`,
  };

  /** Display-only translation of a severity key/label; class lookups keep using the raw value. */
  severityDisplay(severity: string): string {
    return this.severityDisplayLabels[severity.toLowerCase()] ?? severity;
  }

  /** Display-only translation of a status key; class lookups keep using the raw value. */
  statusDisplay(statusClass: string, fallback: string): string {
    return this.statusDisplayLabels[statusClass] ?? fallback;
  }

  viewKpiAriaLabel(label: string): string {
    return $localize`:@@dashboard.findings.viewKpiAria:View ${label}:label:`;
  }

  legendToggleAriaLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@dashboard.findings.legendShowAria:Show ${label}:label:`
      : $localize`:@@dashboard.findings.legendHideAria:Hide ${label}:label:`;
  }

  /* ── Source data ─────────────────────────────────────────────────────── */

  /** Every company actually present in the shared finding data
   *  (previously a fixed placeholder list unrelated to any finding). */
  readonly companies    = getDistinctCompanies(MOCK_FINDINGS);

  /** All 12 findings, mapped to this component's flat display shape. Every
   *  KPI card, chart, and the table below derives from this one array. */
  readonly findings: FindingRow[] = MOCK_FINDINGS.map(f => toFindingRow(f));

  /** The bottom table's own heading reads "Critical & High Severity Open
   *  Findings" — it used to render the unfiltered `findings` (every
   *  severity, every status) instead. Filtered here so the table actually
   *  matches what it claims, and lines up with the "Critical/High Open" KPI
   *  card above (both count the same findings — broad "not yet closed"
   *  sense, same as the KPI's `criticalHighOpen`). This is deliberately
   *  broader than the "Open Findings" KPI's narrow `status === 'open'`
   *  count above (`stats.open`) — "Critical/High Open" means any
   *  outstanding critical/high finding, overdue or in-progress included. */
  readonly tableFindings = this.findings.filter(
    f => isOpenStatusClass(f.statusClass) && (f.severityClass === 'critical' || f.severityClass === 'high'),
  );

  private readonly stats = getFindingKpiSummary(MOCK_FINDINGS);

  /* ── KPI ─────────────────────────────────────────────────────────────── */

  readonly kpis = [
    { label: $localize`:@@dashboard.findings.kpiOpenFindings:Open Findings`,           value: String(this.stats.open),             sub: $localize`:@@dashboard.findings.kpiTotalSub:${this.stats.total}:total: total`,                                          icon: 'pi pi-info-circle',            variant: 'yellow', view: 'open'               },
    { label: $localize`:@@dashboard.findings.kpiClosureRate:Closure Rate`,             value: `${this.stats.closureRatePct}%`,     sub: $localize`:@@dashboard.findings.kpiClosedOfTotalSub:${this.stats.closed}:closed: of ${this.stats.total}:total: closed`, icon: 'pi pi-info-circle',            variant: 'green',  view: 'closed'             },
    { label: $localize`:@@dashboard.findings.kpiOverdueFindings:Overdue Findings`,     value: String(this.stats.overdue),          sub: '',                                                                                                                       icon: 'pi pi-info-circle',            variant: 'red',    view: 'overdue'            },
    { label: $localize`:@@dashboard.findings.kpiRepeatedFindings:Repeated Findings`,   value: String(this.stats.repeated),         sub: '',                                                                                                                       icon: 'pi pi-arrow-right-arrow-left', variant: 'red',    view: 'repeated'           },
    { label: $localize`:@@dashboard.findings.kpiCriticalHighOpen:Critical/High Open`, value: String(this.stats.criticalHighOpen), sub: '',                                                                                                                       icon: 'pi pi-exclamation-triangle',   variant: 'red',    view: 'critical-high-open' },
  ];

  /* ── Chart: Open Findings by Severity (Pie) ──────────────────────────── */

  private readonly severityBreakdown = getOpenSeverityBreakdown(MOCK_FINDINGS);

  readonly severityData = {
    labels: this.severityBreakdown.labels,
    datasets: [{
      data: this.severityBreakdown.data,
      backgroundColor: ['#C00000', '#ED7D31', '#FFC000'],
      hoverOffset: 4,
    }],
  };

  /** Derived from `severityBreakdown`/`severityData` instead of a hand-typed
   *  `{Critical: 2, High: 2, Medium: 2}` array that happened to look
   *  plausible but had no relationship to the real open findings — same fix
   *  as the Audit Overview donut's status legend. Reading `label`/`value`
   *  from `severityBreakdown` and the color from `severityData`'s own
   *  `backgroundColor` (by the same index) keeps the legend and the pie
   *  slices permanently in sync, including if a severity has zero open
   *  findings and drops out of the breakdown entirely. */
  readonly severityLegend: DonutLegendItem[] = this.severityBreakdown.labels.map((label, i) => ({
    label: this.severityDisplay(label),
    value: this.severityBreakdown.data[i],
    color: this.severityData.datasets[0].backgroundColor[i],
  }));

  readonly pieOptions = {
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  /* ── Chart: Aging Analysis (Bar) ─────────────────────────────────────── */
  /* Clicking the chart opens a right-drawer breakdown, paginated by age
   * bucket (see `openAgingDetail`). `agingBuckets` defines the boundaries
   * once, shared with the detail drawer, so the two never disagree about
   * where a finding lands — and `getOpenAgingCounts` (finding-data.ts) now
   * actually buckets through those same boundaries instead of a separately
   * hand-typed array, matching the card title's "Open Findings" scope. */

  readonly agingBuckets: AgingBucket[] = [
    { label: $localize`:@@dashboard.findings.agingUnder30:< 30 days`,  min: 0,  max: 29 },
    { label: $localize`:@@dashboard.findings.aging31to60:31-60 days`, min: 30, max: 60 },
    { label: $localize`:@@dashboard.findings.agingOver60:> 60 days`,  min: 61, max: null },
  ];

  readonly agingData = {
    labels: this.agingBuckets.map(b => b.label),
    datasets: [{
      label: $localize`:@@dashboard.findings.numberOfFindings:Number of Findings`,
      data: getOpenAgingCounts(MOCK_FINDINGS, this.agingBuckets),
      backgroundColor: '#ED7D31',
      borderRadius: 4,
    }],
  };

  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend —
   *  same treatment as the Audits by Sub-Division chart. */
  readonly agingLegend: DonutLegendItem[] = [{
    label: this.agingData.datasets[0].label,
    value: this.agingData.datasets[0].data.reduce((sum, n) => sum + n, 0),
    color: this.agingData.datasets[0].backgroundColor,
  }];

  /** Tracks which dataset the user has hidden via the legend. */
  agingHidden: boolean[] = this.agingLegend.map(() => false);

  @ViewChild('agingChart') private agingChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleAgingDataset(index: number): void {
    const chart = this.agingChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.agingHidden[index] = !this.agingHidden[index];
  }

  /** Chart.js plugin: highlights the hovered bucket's whole column with a
   *  soft vertical band behind the bar — same treatment as the
   *  hover-band plugin on the Audits by Sub-Division chart. */
  private readonly agingHoverBandPlugin = {
    id: 'agingHoverBand',
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

  readonly agingChartPlugins = [this.agingHoverBandPlugin];

  readonly agingOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        /* Built-in legend disabled — `agingLegend` renders the same info as a
         * custom HTML legend below the canvas instead. */
        legend: { display: false },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'x' as const },
      scales: {
        y: { beginAtZero: true, max: 8, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, stepSize: 2 } },
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

  /* ── Chart: Findings by Division | Sub-Division, by status ───────────────
   * Bars are units, one bar per status — same "3 major buckets in the
   * preview, everything in the detail drawer" MINIMUM-view pattern used for
   * Audits by Division / Sub-Division on the overview page.
   *
   * Some divisions have no sub-divisions (findings are raised on the
   * division itself), others are audited per sub-division. The "View by"
   * toggle — same as the overview's audits chart — splits the findings
   * between the two, so each finding shows up in exactly one view (see
   * `getFindingUnit`):
   *  - Division: only division-level findings — divisions with no
   *    sub-divisions (e.g. Deira Gold Souk Flagship).
   *  - Sub-Division (default): only sub-division findings, labelled with a second line
   *    naming the parent division.
   *
   * `getFindingStatusBreakdownByUnit` (audit-finding-data.ts) buckets every
   * finding into exactly one of 4 segments — Open / Overdue / Closed / In
   * Progress — so the segments always sum to the true total per unit. */

  readonly findingsByViews: { key: DashboardByView; label: string }[] = [
    { key: 'division', label: $localize`:@@common.division:Division` },
    { key: 'subDivision', label: $localize`:@@common.subDivision:Sub-Division` },
  ];

  private readonly maxPreviewUnits = 3;

  private readonly unitStatusCounts: Record<DashboardByView, FindingUnitStatusBreakdown[]> = {
    division: getFindingStatusBreakdownByUnit(MOCK_FINDINGS, 'division'),
    subDivision: getFindingStatusBreakdownByUnit(MOCK_FINDINGS, 'subDivision'),
  };

  findingsByView: DashboardByView = 'subDivision';

  /* Rebuilt by `setFindingsByView` — plain fields rather than getters so
   * p-chart only re-renders when the view actually changes. */
  /** Every unit of the current view (the preview only charts the first few). */
  findingUnits: FindingUnitStatusBreakdown[] = [];
  /** True when the preview is actually hiding units. */
  hasMoreOrgData = false;
  findingsByOrgData: {
    labels: (string | string[])[];
    datasets: { label: string; data: number[]; backgroundColor: string; [key: string]: unknown }[];
  } = { labels: [], datasets: [] };
  findingsLegend: DonutLegendItem[] = [];
  /** Tracks which dataset the user has hidden via the legend. */
  findingsHidden: boolean[] = [];

  get findingsByViewLabel(): string {
    return this.findingsByViews.find(v => v.key === this.findingsByView)!.label;
  }

  setFindingsByView(view: DashboardByView): void {
    this.findingsByView = view;
    this.findingUnits = this.unitStatusCounts[view];
    this.hasMoreOrgData = this.findingUnits.length > this.maxPreviewUnits;

    const preview = this.findingUnits.slice(0, this.maxPreviewUnits);
    const bar = { borderRadius: 4, maxBarThickness: 56, categoryPercentage: 0.55, barPercentage: 0.9 };
    this.findingsByOrgData = {
      /* Division view: division names. Sub-Division view: two-line labels —
       * the sub-division, then its parent division. */
      labels: preview.map(({ unit: u }) =>
        u.subDivision === null ? u.division : [u.subDivision, `↳ ${u.division}`]),
      datasets: [
        { label: this.statusDisplayLabels['open'],        data: preview.map(d => d.open),       backgroundColor: '#FFC000', ...bar },
        { label: this.statusDisplayLabels['overdue'],     data: preview.map(d => d.overdue),    backgroundColor: '#FF5050', ...bar },
        { label: this.statusDisplayLabels['in-progress'], data: preview.map(d => d.inProgress), backgroundColor: '#4472C4', ...bar },
        { label: this.statusDisplayLabels['closed'],      data: preview.map(d => d.closed),     backgroundColor: '#70AD47', ...bar },
      ],
    };
    this.findingsLegend = this.findingsByOrgData.datasets.map(ds => ({
      label: ds.label,
      value: ds.data.reduce((sum, n) => sum + n, 0),
      color: ds.backgroundColor,
    }));
    this.findingsHidden = this.findingsLegend.map(() => false);
  }

  @ViewChild('findingsChart') private findingsChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleFindingsDataset(index: number): void {
    const chart = this.findingsChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.findingsHidden[index] = !this.findingsHidden[index];
  }


  /** Grouped (not stacked) — each company gets one bar per status, so every
   *  status stays independently readable at a glance instead of being read
   *  off segment heights within a single bar. */
  readonly orgStatusOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        /* Built-in legend disabled — `findingsLegend` renders the same info
         * as a custom HTML legend below the canvas instead. */
        legend: { display: false },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'x' as const },
      scales: {
        /* Keep the two-line unit labels horizontal instead of letting Chart.js tilt them. */
        x: { stacked: false, offset: true, grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, minRotation: 0, autoSkip: false } },
        y: { stacked: false, beginAtZero: true, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, precision: 0 } },
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

  /* ── Chart → drawer handlers ───────────────────────────────────────────── */

  /**
   * Opens the full "Findings by Division / Sub-Division" breakdown in a
   * right-side drawer: a page per division with division-level findings
   * (no sub-divisions), then a page per sub-division — every company, every
   * status. Same split as the chart's toggle, so each finding appears on
   * exactly one page. The overview chart itself only ever shows the first 3
   * units as a minimal preview.
   */
  openFindingsBySubdivisionDetail(): void {
    const pages: FindingUnitPage[] = [
      ...this.unitStatusCounts.division.map(({ unit: u }): FindingUnitPage =>
        ({ name: u.division, kind: 'division', division: u.division, subDivision: null })),
      ...this.unitStatusCounts.subDivision.map(({ unit: u }): FindingUnitPage =>
        ({ name: u.subDivision!, kind: 'subDivision', division: u.division, subDivision: u.subDivision })),
    ];

    this.drawer.open<void, FindingsBySubdivisionDetailData>(FindingsBySubdivisionDetailComponent, {
      width: '860px',
      data: {
        pages,
        // Land on the first page of the kind the chart is currently showing.
        startIndex: Math.max(0, pages.findIndex(p =>
          this.findingsByView === 'division' ? p.kind === 'division' : p.kind === 'subDivision')),
        companies: this.companies,
        findings: this.findings,
      },
    });
  }

  /**
   * Opens the full "Aging Analysis" breakdown — every finding in every age
   * bucket — in a right-side drawer.
   */
  openAgingDetail(): void {
    this.drawer.open<void, AgingAnalysisDetailData>(AgingAnalysisDetailComponent, {
      width: '820px',
      data: {
        buckets: this.agingBuckets,
        companies: this.companies,
        findings: this.findings,
      },
    });
  }

  /**
   * One-time sanity check: re-derives a few totals independently and
   * confirms they match what the KPI cards / charts actually display. Won't
   * catch a *design* choice to show something different from the shared
   * data, but it will catch the next hardcoded number that silently stops
   * matching it — which is exactly how this dashboard ended up disagreeing
   * with the findings list in the first place.
   */
  private verifyDataIntegrity(): void {
    const pieSum = this.severityData.datasets[0].data.reduce((a, b) => a + b, 0);
    if (pieSum !== this.stats.open) {
      console.warn(
        `[AuditFindings] "Open Findings by Severity" pie sums to ${pieSum} but there are ${this.stats.open} open findings.`,
      );
    }

    const agingSum = this.agingData.datasets[0].data.reduce((a, b) => a + b, 0);
    if (agingSum !== this.stats.open) {
      console.warn(
        `[AuditFindings] "Aging Analysis" bars sum to ${agingSum} but there are ${this.stats.open} open findings.`,
      );
    }

    // The two views split the findings between them, so together they cover every finding once.
    const unitSum = this.findingsByViews
      .flatMap(view => this.unitStatusCounts[view.key])
      .reduce((s, d) => s + d.open + d.overdue + d.closed + d.inProgress, 0);
    if (unitSum !== this.stats.total) {
      console.warn(
        `[AuditFindings] "Findings by Division / Sub-Division" totals to ${unitSum} across both views ` +
        `but there are ${this.stats.total} findings.`,
      );
    }

    if (this.tableFindings.length !== this.stats.criticalHighOpen) {
      console.warn(
        `[AuditFindings] The findings table shows ${this.tableFindings.length} rows but the "Critical/High Open" ` +
        `KPI says ${this.stats.criticalHighOpen} — they're supposed to be the same set.`,
      );
    }

    // Note: `criticalHighOpen` is NOT checked against `stats.open` here —
    // they intentionally use different "open" senses (broad "not yet
    // closed" vs. the narrow `status === 'open'` the KPI card shows), so
    // `criticalHighOpen` can legitimately exceed `stats.open`.
    if (this.stats.open > this.stats.total) {
      console.warn('[AuditFindings] A KPI count exceeds a set it should be a subset of.');
    }
  }
}
