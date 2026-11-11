import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartModule, UIChart } from 'primeng/chart';
import { LayoutService } from '@/app/layout/service/layout.service';

/* TODO: point this at the real path to RightDrawerService in your project. */


import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AuditsBySubDivisionDetailComponent } from '@/app/features/admin/dashboard/com/audits-by-subdivision-detail/audits-by-subdivision-detail.component';
import { AuditsByRiskDetailComponent } from '@/app/features/admin/dashboard/com/audits-by-risk-detail/audits-by-risk-detail.component';
import { AuditUnitPage, RiskDetailData, SubdivisionDetailData as SubDivisionDetailData } from '@/app/features/admin/dashboard/models/dashboard-audit.model';
import { DashboardByView } from '@/app/features/admin/dashboard/models/dashboard-common.model';
import {
  MOCK_PLANS,
  OrgBreakdown,
  UpcomingAuditEntry,
  AuditUnit,
  getAuditsByAuditUnit,
  getAuditsByRisk,
  getKpiSummary,
  getStatusDistribution,
  getUpcomingAudits,
} from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import { getAllStaticScopes } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutLegendItem, DonutStatusChartComponent } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { UpcomingAudit } from '@/app/features/client/client-dashboard/models/client-dashboard.model';
/* TODO: point this at the real path to audit-scope-static-data.ts in your project
 * (the same file scope/list/scope-list.component.ts imports it from). */


/**
 * All KPI/chart data on this page is now DERIVED from `MOCK_PLANS` — the
 * exact same audit-plan rows the Audit Plan List page shows — via the
 * aggregation helpers in `audit-plan-data.ts`. Previously this component
 * had its own, entirely separate hardcoded dataset (fake orgs like "Acme
 * Holdings" / "Globex Ltd", a fixed sub-division list, made-up chart values)
 * that had no relationship to the real plan data at all. Swap `MOCK_PLANS`
 * for a real API result later and every number here updates automatically —
 * none of the aggregation logic needs to change.
 *
 * NOTE ON NAMING: `SubDivisionDetailData` is a local alias of
 * `SubdivisionDetailData` (models/dashboard-audit.model.ts), so
 * every local property/method in this file uses the same "SubDivision"
 * casing.
 */

@Component({
  selector: 'app-audit-overview-tab',
  standalone: true,
  imports: [CommonModule, ChartModule, DrawIconComponent, DonutStatusChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit-overview-tab.component.html',
  styleUrls: ['./audit-overview-tab.component.scss'],
})
export class AuditOverviewTabComponent {

  private readonly router = inject(Router);
  private readonly drawer = inject(RightDrawerService);
  private readonly layoutService = inject(LayoutService);
  private readonly locale = inject(LOCALE_ID);

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

  /* NOTE: adjust to the real route paths where these pages are registered. */
  private readonly scopeRoute = '/audits/audit-plan/audit-scope';
  private readonly planRoute  = '/audits/audit-plan/audit-plan-list';

  /** The plan set this whole dashboard is derived from. Swap for a real API
   *  result once one exists — everything below recomputes from this array. */
  private readonly plans = MOCK_PLANS;

  /* ── KPI ─────────────────────────────────────────────────────────────── */
  /* Cards with an `action` flag are clickable and route elsewhere:
   *  - Total Audits     → audit plan list (all statuses)
   *  - Overdue Audits   → audit plan list filtered to overdue
   *  - High-Risk Scopes → scope page pre-filtered
   *
   * Values come from `getKpiSummary(plans)`:
   *  - Total Audits: count of audit plans (company+division+year engagements).
   *  - Completion Rate: completed plans ÷ total plans. The sub-line reports
   *    the raw counts rather than a "vs last month" delta — the mock data
   *    has no prior period to compare against, and fabricating a trend
   *    would be misleading on a compliance dashboard.
   *  - Overdue Audits: see getKpiSummary's doc comment for exactly what
   *    counts as "not started".
   *
   *  - High-Risk Scopes Not Started is the ONE exception: it does NOT come
   *    from `getKpiSummary`/`plans`. That card links to the Audit Scope
   *    Management page's "high-risk-not-started" filter, and that page
   *    filters `AUDIT_SCOPE_STATIC_COMPANIES` (audit-scope-static-data.ts) —
   *    a completely separate, independently-authored mock dataset from
   *    `MOCK_PLANS`. Deriving the card's number from `plans` therefore showed
   *    a count with no relationship to what the drill-down actually lists
   *    (e.g. the card read 0 while the filtered list had 7 rows). Computed
   *    below straight from the same static scope records instead, using the
   *    identical "High risk & not started" rule as
   *    `scope-list.component.ts`'s `isHighRiskNotStarted`, so the two can
   *    never drift apart again. */
  private readonly kpiSummary = getKpiSummary(this.plans);

  private readonly highRiskNotStartedScopeCount = getAllStaticScopes().filter(scope => {
    if (scope.riskRating !== 'high') return false;
    const auditorCount = scope.assignedAuditors?.length ?? 0;
    const started = scope.workflowStatus
      ? scope.workflowStatus !== 'Not Started'
      : auditorCount > 0;
    return !started;
  }).length;

  readonly kpis = [
    {
      label: $localize`:@@dashboard.overview.kpiTotalAudits:Total Audits`, value: String(this.kpiSummary.totalAudits),
      sub: $localize`:@@dashboard.overview.kpiInProgressSub:${this.kpiSummary.inProgressCount}:count: in progress`,
      icon: 'pi pi-copy', variant: '', action: 'total-audits',
    },
    {
      label: $localize`:@@dashboard.overview.kpiCompletionRate:Completion Rate`, value: `${this.kpiSummary.completionRatePct}%`,
      sub: $localize`:@@dashboard.overview.kpiPlansCompletedSub:${this.kpiSummary.completedCount}:completed: of ${this.kpiSummary.totalAudits}:total: plans completed`,
      icon: 'pi pi-arrow-up-right', variant: 'green', action: '',
    },
    {
      label: $localize`:@@dashboard.overview.kpiOverdueAudits:Overdue Audits`, value: String(this.kpiSummary.overdueCount),
      sub: '', icon: 'pi pi-exclamation-triangle', variant: 'red', action: 'overdue-audits',
    },
    {
      label: $localize`:@@dashboard.overview.kpiHighRiskScopesNotStarted:High-Risk Scopes Not Started`, value: String(this.highRiskNotStartedScopeCount),
      sub: '', icon: 'pi pi-clock', variant: 'yellow', action: 'high-risk-scopes',
    },
  ];

  /** aria-label for a clickable KPI card. */
  kpiAriaLabel(label: string): string {
    return $localize`:@@dashboard.overview.kpiViewAriaLabel:View ${label}:label:`;
  }

  /** aria-label for a chart legend entry that shows/hides its dataset. */
  legendToggleAriaLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@dashboard.overview.legendShowAriaLabel:Show ${label}:label:`
      : $localize`:@@dashboard.overview.legendHideAriaLabel:Hide ${label}:label:`;
  }

  /** Display-only translation of the plan-status labels produced by
   *  `getStatusDistribution` / `getUpcomingAudits` (raw values are kept for
   *  any lookups). Unknown values fall through unchanged. */
  private statusDisplayLabel(label: string): string {
    switch (label) {
      case 'In Progress': return $localize`:@@common.inProgress:In Progress`;
      case 'Planned':     return $localize`:@@common.planned:Planned`;
      case 'Completed':   return $localize`:@@common.completed:Completed`;
      case 'Overdue':     return $localize`:@@common.overdue:Overdue`;
      case 'On Hold':     return $localize`:@@common.onHold:On Hold`;
      case 'Cancelled':   return $localize`:@@common.cancelled:Cancelled`;
      case 'Draft':       return $localize`:@@common.draft:Draft`;
      default:            return label;
    }
  }

  /** Display-only translation of a risk-level key ('High' / 'Medium' / 'Low'). */
  private riskDisplayLabel(risk: string): string {
    switch (risk) {
      case 'Critical': return $localize`:@@common.critical:Critical`;
      case 'High': return $localize`:@@common.high:High`;
      case 'Medium': return $localize`:@@common.medium:Medium`;
      case 'Low': return $localize`:@@common.low:Low`;
      default: return risk;
    }
  }

  /** Display label for an upcoming-audit entry's status. */
  upcomingStatusLabel(status: string): string {
    return this.statusDisplayLabel(status);
  }

  /** Tooltip for a calendar dot: "<audit name> — <status>". */
  upcomingDotTitle(a: UpcomingAuditEntry): string {
    const status = this.statusDisplayLabel(a.status);
    return $localize`:@@dashboard.overview.calendarDotTitle:${a.name}:name: — ${status}:status:`;
  }

  /* ── Chart: Audit Status Distribution (Pie) ─────────────────────────── */
  /* Categories + colors come from `getStatusDistribution` — only statuses
   * that actually occur in the data are shown, in a fixed order. Colors mix
   * the dataviz skill's reserved status palette (good/warning/serious/
   * critical) for the semantically loaded states — Completed/Overdue/On
   * Hold/Cancelled — with two neutral categorical hues for the inert ones
   * (In Progress, Planned), validated for adjacent-pair CVD separation. */

  private readonly statusDistribution = getStatusDistribution(this.plans);

  /** Derived straight from `statusDistribution` — previously this was a
   *  hand-typed placeholder array (38 / 25 / 25 / 13, summing to 101) that
   *  had no relationship to the real plan data, so the donut never matched
   *  the actual audit count (12 across `MOCK_PLANS`). Mapping over
   *  `statusDistribution.labels` keeps the legend numbers, colors, and the
   *  donut itself all reading from the same source, the same way
   *  `subDivisionLegend` / `riskLegend` already do for the other charts. */
  readonly auditStatusLegend: DonutLegendItem[] = this.statusDistribution.labels.map((label, i) => ({
    label: this.statusDisplayLabel(label),
    value: this.statusDistribution.data[i],
    color: this.statusDistribution.colors[i],
  }));

  readonly auditStatusData = {
    labels: this.statusDistribution.labels.map(label => this.statusDisplayLabel(label)),
    datasets: [{
      data: this.statusDistribution.data,
      backgroundColor: this.statusDistribution.colors,
      hoverOffset: 4,
    }],
  };

  readonly pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 12, font: { size: 11 }, padding: 16 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  /* ── Chart: Audits by Division | Sub-Division, grouped by organization (Bar) ── */
  /* Grouped so that each unit shows one bar per organization side by side —
   * with several organizations in the system, a single aggregated bar per
   * unit made it impossible to tell which org an audit count came from.
   * Counts are audit PLANS (not the individual scopes under a unit — that
   * previously double-counted sub-divisions with more than one scope).
   *
   * Some divisions have no sub-divisions and are audited as a whole, others
   * are audited per sub-division. The "View by" toggle splits the audits
   * between the two — each plan shows up in exactly one view
   * (`getAuditsByAuditUnit` decides which):
   *  - Division: only division-level audits — divisions with no
   *    sub-divisions (e.g. Deira Gold Souk Flagship).
   *  - Sub-Division (default): only sub-division audits, labelled with a second line
   *    naming the parent division.
   *
   * The overview card only ever shows a MINIMUM preview — the top 3 units by
   * audit count and the top 3 companies within them (see `maxPreviewOrgs` / `maxPreviewUnits`
   * below). The full breakdown — every division-level and sub-division
   * audit, across every company — is only shown in the detailed drawer
   * opened by clicking the chart (see `openUnitDetail`). Colors are the
   * dataviz skill's validated 8-hue categorical order (adjacent-pair CVD-safe
   * in both modes) — cycling only if more than 8 organizations are ever
   * added. */

  private readonly subDivisionChartColors = [
    '#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948',
  ];

  readonly auditsByViews: { key: DashboardByView; label: string }[] = [
    { key: 'division', label: $localize`:@@common.division:Division` },
    { key: 'subDivision', label: $localize`:@@common.subDivision:Sub-Division` },
  ];

  private readonly auditUnitBreakdown = getAuditsByAuditUnit(this.plans);

  /** Keeps only the units (and their count columns) of one kind, and only the
   *  companies that have an audit among them — so the 3-company preview
   *  isn't spent on companies with nothing to show in this view. */
  private unitsWhere(keep: (u: AuditUnit) => boolean): { units: AuditUnit[]; breakdown: OrgBreakdown[] } {
    const { units, breakdown } = this.auditUnitBreakdown;
    const indexes = units.map((u, i) => (keep(u) ? i : -1)).filter(i => i >= 0);
    return {
      units: indexes.map(i => units[i]),
      breakdown: breakdown
        .map(o => ({ org: o.org, counts: indexes.map(i => o.counts[i]) }))
        .filter(o => o.counts.some(n => n > 0)),
    };
  }

  private readonly unitBreakdowns: Record<DashboardByView, { units: AuditUnit[]; breakdown: OrgBreakdown[] }> = {
    division: this.unitsWhere(u => u.subDivision === null),
    subDivision: this.unitsWhere(u => u.subDivision !== null),
  };

  /** How many companies / units the overview preview chart shows. */
  private readonly maxPreviewOrgs = 3;
  private readonly maxPreviewUnits = 3;

  auditsByView: DashboardByView = 'subDivision';

  /* Rebuilt by `setAuditsByView` — plain fields rather than getters so
   * p-chart only re-renders when the view actually changes. */
  units: AuditUnit[] = [];
  auditsByOrgUnit: OrgBreakdown[] = [];
  /** True when the preview is actually hiding companies or units. */
  hasMoreUnitData = false;
  auditsByUnitData: { labels: (string | string[])[]; datasets: object[] } = { labels: [], datasets: [] };
  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend. */
  unitLegend: DonutLegendItem[] = [];
  /** Tracks which dataset (org) the user has hidden via the legend. */
  unitHidden: boolean[] = [];

  get auditsByViewLabel(): string {
    return this.auditsByViews.find(v => v.key === this.auditsByView)!.label;
  }

  setAuditsByView(view: DashboardByView): void {
    this.auditsByView = view;
    const { units, breakdown } = this.unitBreakdowns[view];
    this.units = units;
    this.auditsByOrgUnit = breakdown;

    /* "Top N": the units with the most audits across all companies (ties keep
     * their original order), then the companies with the most audits within
     * those units — so no previewed company shows up with only empty bars. */
    const unitTotal = (i: number) => breakdown.reduce((sum, o) => sum + o.counts[i], 0);
    const topUnitIndexes = units
      .map((_, i) => i)
      .sort((a, b) => unitTotal(b) - unitTotal(a))
      .slice(0, this.maxPreviewUnits);

    const orgsInTopUnits = breakdown
      .map(orgData => ({ org: orgData.org, counts: topUnitIndexes.map(i => orgData.counts[i]) }))
      .filter(orgData => orgData.counts.some(n => n > 0));
    const previewOrgs = [...orgsInTopUnits]
      .sort((a, b) => b.counts.reduce((s, n) => s + n, 0) - a.counts.reduce((s, n) => s + n, 0))
      .slice(0, this.maxPreviewOrgs);

    this.hasMoreUnitData = breakdown.length > previewOrgs.length || units.length > topUnitIndexes.length;
    this.auditsByUnitData = {
      /* Division view: division names. Sub-Division view: two-line labels —
       * the sub-division, then its parent division. */
      labels: topUnitIndexes.map(i => units[i]).map(u =>
        u.subDivision === null ? u.division : [u.subDivision, `↳ ${u.division}`]),
      datasets: previewOrgs.map((orgData, i) => ({
        label: orgData.org,
        data: orgData.counts,
        backgroundColor: this.subDivisionChartColors[i % this.subDivisionChartColors.length],
        borderRadius: 4,
      })),
    };
    this.unitLegend = previewOrgs.map((orgData, i) => ({
      label: orgData.org,
      value: orgData.counts.reduce((sum, n) => sum + n, 0),
      color: this.subDivisionChartColors[i % this.subDivisionChartColors.length],
    }));
    this.unitHidden = this.unitLegend.map(() => false);
  }

  @ViewChild('unitChart') private unitChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleUnitDataset(index: number): void {
    const chart = this.unitChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.unitHidden[index] = !this.unitHidden[index];
  }

  /** Chart.js plugin: highlights the hovered sub-division's whole column with a
   *  soft vertical band behind the bars — same treatment as
   *  `riskHoverBandPlugin` on the Risk Rating Distribution chart, just
   *  oriented for a vertical (x-axis category) bar chart instead of a
   *  horizontal one. */
  private readonly subDivisionHoverBandPlugin = {
    id: 'subDivisionHoverBand',
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

  readonly subDivisionChartPlugins = [this.subDivisionHoverBandPlugin];

  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        /* Built-in legend disabled — `subDivisionLegend` renders the same info as a
         * custom HTML legend below the canvas instead. */
        legend: { display: false },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'x' as const },
      scales: {
        y: { beginAtZero: true, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, precision: 0 } },
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

  /* ── Chart: Risk Rating Distribution, stacked by organization (Bar) ──── */
  /* Same problem as Audits by Sub-Division: a single bar per risk level
   * couldn't show which organization the audits came from. Each risk-level
   * row is now one stacked bar, segmented by org — segment counts are drawn
   * directly on the segment (skipped if the segment is too narrow to fit
   * one), and the x-axis is hidden since the axis scale added noise without
   * helping readability. Reuses the same org → color mapping as the
   * sub-division chart (`subDivisionChartColors`) so an organization's color
   * stays consistent across the whole dashboard.
   *
   * `getAuditsByRisk` counts audit plans per risk rating (High/Medium/Low —
   * the model has no "Critical" tier, unlike the old hardcoded 4-level
   * placeholder) per organization, each plan rated by its highest-risk scope.
   *
   * Same MINIMUM-preview pattern as Audits by Sub-Division: this stacked bar
   * only ever renders the top `maxPreviewOrgs` companies by audit count (see
   * `previewOrgRisk` below) — a stacked bar with 8+ segments per row would
   * be just as congested as the grouped chart was. The full breakdown
   * across every company and risk level is only shown in the detailed
   * drawer opened by clicking the chart (see `openRiskDetail`). */

  private readonly riskBreakdown = getAuditsByRisk(this.plans);

  readonly riskLevels = this.riskBreakdown.riskLevels;
  readonly auditsByOrgRisk = this.riskBreakdown.breakdown;

  private readonly rankedOrgRisk = this.auditsByOrgRisk
    .filter(o => o.counts.some(n => n > 0))
    .sort((a, b) => b.counts.reduce((s, n) => s + n, 0) - a.counts.reduce((s, n) => s + n, 0));

  /** Top companies by audit count, shown individually in the preview. */
  readonly previewRiskOrgCount = Math.min(this.maxPreviewOrgs, this.rankedOrgRisk.length);

  /** True when the preview is actually hiding companies. */
  readonly hasMoreRiskData = this.auditsByOrgRisk.length > this.previewRiskOrgCount;

  /* The top companies, plus one neutral "Others" segment summing every
   * remaining company — so each risk row (and the chart as a whole) still
   * totals every audit, instead of silently dropping the companies outside
   * the preview (which left whole risk levels empty). */
  private readonly previewOrgRisk: (OrgBreakdown & { color: string })[] = (() => {
    const top = this.rankedOrgRisk.slice(0, this.previewRiskOrgCount).map((o, i) => ({
      ...o, color: this.subDivisionChartColors[i % this.subDivisionChartColors.length],
    }));
    const rest = this.rankedOrgRisk.slice(this.previewRiskOrgCount);
    if (!rest.length) return top;
    const counts = this.riskLevels.map((_, ri) => rest.reduce((sum, o) => sum + o.counts[ri], 0));
    return [...top, { org: $localize`:@@dashboard.overview.othersSegment:Others (${rest.length}:count:)`, counts, color: '#94a3b8' }];
  })();

  readonly riskRatingData = {
    labels: this.riskLevels.map(risk => this.riskDisplayLabel(risk)),
    datasets: this.previewOrgRisk.map(orgData => ({
      label: orgData.org,
      data: orgData.counts,
      backgroundColor: orgData.color,
      borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 6, bottomRight: 6 },
      borderWidth: 0,
      borderColor: '#ffffff',
      borderSkipped: false,
      stack: 'risk',
    })),
  };

  /** Custom legend rendered below the canvas (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legend. */
  readonly riskLegend: DonutLegendItem[] = this.previewOrgRisk.map(orgData => ({
    label: orgData.org,
    value: orgData.counts.reduce((sum, n) => sum + n, 0),
    color: orgData.color,
  }));

  /** Tracks which dataset (org) the user has hidden via the legend. */
  riskHidden: boolean[] = this.riskLegend.map(() => false);

  @ViewChild('riskChart') private riskChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleRiskDataset(index: number): void {
    const chart = this.riskChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.riskHidden[index] = !this.riskHidden[index];
  }

  /** Chart.js plugin: draws each stacked segment's value centered within it,
   *  skipping segments too narrow to hold a readable label. */
  private readonly riskSegmentLabelPlugin = {
    id: 'riskSegmentLabel',
    afterDatasetsDraw(chart: any): void {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset: any, di: number) => {
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((bar: any, i: number) => {
          const value = dataset.data[i];
          if (!value) return;
          const segmentWidth = Math.abs(bar.x - bar.base);
          if (segmentWidth < 18) return;
          const centerX = (bar.x + bar.base) / 2;
          ctx.save();
          ctx.font = "700 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
          ctx.fillStyle = '#fff';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(value, centerX, bar.y);
          ctx.restore();
        });
      });
    },
  };

  /** Highlights the hovered organization's full row, matching the Staff Utilization chart. */
  private readonly riskHoverBandPlugin = {
    id: 'riskHoverBand',
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

  /** Chart.js plugin: cuts a thin gap between adjacent stacked segments by
   *  painting a sliver of the card background over each segment boundary —
   *  used instead of a border so the segments themselves stay borderless.
   *  Gaps are drawn between actually-touching (non-zero) segments — a
   *  zero-value dataset renders no bar, so it's skipped when finding each
   *  segment's real neighbor rather than just looking at the next index. */
  private readonly riskSegmentGapPlugin = {
    id: 'riskSegmentGap',
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
          const top = bar.y - bar.height / 2;
          ctx.save();
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-card').trim() || '#fff';
          ctx.fillRect(bar.x - gap / 2, top, gap, bar.height);
          ctx.restore();
        }
      }
    },
  };

  readonly riskChartPlugins = [this.riskHoverBandPlugin, this.riskSegmentGapPlugin, this.riskSegmentLabelPlugin];

  readonly hBarOptions = computed(() => {
    const c = this.themeColors();
    return {
      indexAxis: 'y' as const,
      plugins: {
        /* Built-in legend disabled — `riskLegend` renders the same info as a
         * custom HTML legend below the canvas instead. */
        legend: { display: false },
      },
      interaction: { mode: 'index' as const, intersect: false, axis: 'y' as const },
      hover: { mode: 'index' as const, intersect: false, axis: 'y' as const },
      layout: { padding: { right: 8 } },
      scales: {
        x: { display: false, stacked: true, beginAtZero: true },
        y: { stacked: true, grid: { display: false }, ticks: { font: { size: 11, weight: '600' as const }, color: c.text } },
      },
      datasets: {
        bar: {
          barPercentage: 0.85,
          categoryPercentage: 0.412,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  /* ── Upcoming Audits list ────────────────────────────────────────────── */
  /* The next 5 scope-months across every plan that are scheduled ('planned')
   * but not yet started, nearest first — see `getUpcomingAudits`'s doc
   * comment for the caveat about the mock calendars' year vs. "today". */

  readonly upcomingAudits: UpcomingAuditEntry[] = getUpcomingAudits(this.plans, 5);

  constructor() {
    this.setAuditsByView(this.auditsByView);
  }


  /* ── Upcoming Audits: list / calendar view toggle ────────────────────── */
  readonly weekDayLabels = [
    $localize`:@@dashboard.overview.weekdaySun:Sun`,
    $localize`:@@dashboard.overview.weekdayMon:Mon`,
    $localize`:@@dashboard.overview.weekdayTue:Tue`,
    $localize`:@@dashboard.overview.weekdayWed:Wed`,
    $localize`:@@dashboard.overview.weekdayThu:Thu`,
    $localize`:@@dashboard.overview.weekdayFri:Fri`,
    $localize`:@@dashboard.overview.weekdaySat:Sat`,
  ];
  upcomingView: 'list' | 'calendar' = 'list';

  private readonly firstUpcomingDate = this.parseIsoDate(this.upcomingAudits[0]?.date);
  calendarYear = this.firstUpcomingDate.getFullYear();
  calendarMonth = this.firstUpcomingDate.getMonth();

  setUpcomingView(view: 'list' | 'calendar'): void {
    this.upcomingView = view;
  }

  private parseIsoDate(iso?: string): Date {
    if (!iso) return new Date();

    // Expect a "YYYY-MM-DD" prefix, but tolerate a trailing time/offset
    // (e.g. "2026-03-15T00:00:00-04:00") — a plain iso.split('-') breaks on
    // those because a negative UTC offset introduces extra '-' characters,
    // which previously produced NaN pieces and rendered as "Invalid Date".
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (isoMatch) {
      const [, y, m, d] = isoMatch.map(Number) as unknown as number[];
      const parsed = new Date(y, m - 1, d);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Fall back to native parsing for any other format, and finally to
    // "today" rather than ever surfacing an Invalid Date to the calendar.
    const fallback = new Date(iso);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
  }

  get calendarMonthLabel(): string {
    return new Date(this.calendarYear, this.calendarMonth, 1)
      .toLocaleDateString(this.locale, { month: 'long', year: 'numeric' });
  }

  get calendarDays(): { day: number | null; audits: UpcomingAuditEntry[] }[] {
  const firstOfMonth = new Date(this.calendarYear, this.calendarMonth, 1);
  const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
  const days: { day: number | null; audits: UpcomingAuditEntry[] }[] = [];

  for (let i = 0; i < firstOfMonth.getDay(); i++) {
    days.push({ day: null, audits: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const audits = this.upcomingAudits.filter(a => {
      const date = this.parseIsoDate(a.date);
      return date.getFullYear() === this.calendarYear &&
        date.getMonth() === this.calendarMonth &&
        date.getDate() === d;
    });
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

  /* ── Card → redirect handlers ────────────────────────────────────────── */

  /**
   * Handles a KPI card click. Total Audits and Overdue Audits route to the
   * audit plan list (Overdue applies a status filter via query param);
   * High-Risk Scopes routes to the scope page pre-filtered.
   */
  onKpiClick(action: string): void {
    switch (action) {
      case 'total-audits':
        this.router.navigate([this.planRoute]);
        break;
      case 'overdue-audits':
        this.router.navigate([this.planRoute], {
          queryParams: { status: 'overdue' },
        });
        break;
      case 'high-risk-scopes':
        this.router.navigate([this.scopeRoute], {
          queryParams: { filter: 'high-risk-not-started' },
        });
        break;
    }
  }

  /**
   * Opens the full "Audits by Division / Sub-Division" breakdown in a
   * right-side drawer: a page per division-level audit unit (divisions with
   * no sub-divisions), then a page per sub-division — every company on every
   * page. Same split as the chart's toggle, so each audit appears on exactly
   * one page. The overview chart itself only ever shows the first 3
   * companies / 3 units as a minimal preview.
   */
  openUnitDetail(): void {
    const { units, breakdown } = this.auditUnitBreakdown;
    const order = [
      ...units.map((u, i) => i).filter(i => units[i].subDivision === null),
      ...units.map((u, i) => i).filter(i => units[i].subDivision !== null),
    ];
    const pages: AuditUnitPage[] = order.map(i => {
      const u = units[i];
      return u.subDivision === null
        ? { name: u.division, kind: 'division' }
        : { name: u.subDivision, kind: 'subDivision', division: u.division };
    });

    this.drawer.open<void, SubDivisionDetailData>(AuditsBySubDivisionDetailComponent, {
      width: '820px',
      data: {
        pages,
        // Land on the first page of the kind the chart is currently showing.
        startIndex: Math.max(0, pages.findIndex(p =>
          this.auditsByView === 'division' ? p.kind === 'division' : p.kind === 'subDivision')),
        orgBreakdown: breakdown.map(o => ({ org: o.org, counts: order.map(i => o.counts[i]) })),
      },
    });
  }

  /**
   * Opens the full "Risk Rating Distribution" breakdown (every company,
   * every risk level) in a right-side drawer — same drill-down pattern as
   * `openUnitDetail`. The overview chart itself only ever shows the
   * first 3 companies as a minimal preview.
   */
  openRiskDetail(): void {
    this.drawer.open<void, RiskDetailData>(AuditsByRiskDetailComponent, {
      width: '820px',
      data: {
        riskLevels: this.riskLevels,
        orgBreakdown: this.auditsByOrgRisk,
      },
    });
  }
}
