import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { RfiDetailDrawer } from '../../com/rfi-detail-drawer/rfi-detail-drawer';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { RfiBySubDivisionDetailComponent } from '../../com/rfi-by-sub-division-detail/rfi-by-sub-division-detail.component';
import { SlaBySubDivisionDetailComponent } from '../../com/sla-by-sub-division-detail/sla-by-sub-division-detail.component';
import {
  DashboardRfiRow,
  RfiBySubDivisionDetailData,
  RfiDetail,
  RfiDetailDrawerData,
  RfiUnit,
  RfiUnitPage,
  SlaBySubDivisionDetailData,
} from '@/app/features/admin/dashboard/models/dashboard-rfi.model';
import { DashboardByView } from '@/app/features/admin/dashboard/models/dashboard-common.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { getAllEnrichedRfis, RFI_STATIC_COMPANIES } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import type { EnrichedStaticRfi } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';
import { LayoutService } from '@/app/layout/service/layout.service';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DASHBOARD_DRAWER, DASHBOARD_LIMITS, DASHBOARD_ROUTES } from '@/app/features/admin/dashboard/constants/dashboard.constants';
import { DASHBOARD_THEME_FALLBACK_COLORS as DashboardThemeFallbackColors } from '@/app/features/admin/dashboard/constants/dashboard-labels.constants';


@Component({
  selector: 'app-rfi-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, DividerModule, CardModule, DrawIconComponent, DonutStatusChartComponent],
  templateUrl: './rfi-tab.component.html',
  styleUrl: './rfi-tab.component.scss',
})
export class RfiTabComponent implements OnInit {

  private readonly drawer = inject(RightDrawerService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in light-mode-only hex at load time. */
  private readonly themeColors = computed(() => {
    this.layoutService.layoutConfig().darkTheme;
    const ds = getComputedStyle(document.documentElement);
    return {
      surfaceCard: ds.getPropertyValue('--surface-card').trim() || DashboardThemeFallbackColors.SurfaceCard,
      surfaceBorder: ds.getPropertyValue('--surface-border').trim() || DashboardThemeFallbackColors.SurfaceBorder,
      text: ds.getPropertyValue('--text-color').trim() || DashboardThemeFallbackColors.Text,
      textSecondary: ds.getPropertyValue('--text-color-secondary').trim() || DashboardThemeFallbackColors.TextSecondary,
    };
  });

  /* Must match the RFI Management route used by its query-param filters. */
  private readonly rfiRoute = DASHBOARD_ROUTES.Rfi;

  private readonly allRfis: EnrichedStaticRfi[] = getAllEnrichedRfis();

  /* These cards intentionally use the exact same status vocabulary and source
   * as RFI Management: total, pending, overdue, under review, completed, reopened. */
  get statCards() {
    const s = this.computeStatusCounts();
    return [
      { label: $localize`:@@dashboard.rfi.totalRfis:Total RFIs`, value: String(this.allRfis.length), sub: '', subClass: '', icon: 'pi pi-copy',              cardClass: '',               status: '' },
      { label: this.statusLabel('pending'),      value: String(s.pending),           sub: '', subClass: '', icon: 'pi pi-clock',             cardClass: 'stat--warning', status: 'pending' },
      { label: this.statusLabel('overdue'),      value: String(s.overdue),           sub: '', subClass: '', icon: 'pi pi-exclamation-triangle', cardClass: 'stat--orange', status: 'overdue' },
      { label: this.statusLabel('under-review'), value: String(s.underReview),       sub: '', subClass: '', icon: 'pi pi-eye',               cardClass: '',               status: 'under-review' },
      { label: this.statusLabel('completed'),    value: String(s.completed),         sub: '', subClass: '', icon: 'pi pi-check-circle',      cardClass: 'stat--success', status: 'completed' },
      { label: this.statusLabel('reopened'),     value: String(s.reopened),          sub: '', subClass: '', icon: 'pi pi-refresh',            cardClass: 'stat--danger',  status: 'reopened' },
    ];
  }

  /** Accessible name for a clickable stat card. */
  viewCardLabel(label: string): string {
    return $localize`:@@dashboard.rfi.viewCard:View ${label}:label:`;
  }

  /** Accessible name for a legend entry that toggles its dataset. */
  legendToggleLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@dashboard.rfi.legendShow:Show ${label}:label:`
      : $localize`:@@dashboard.rfi.legendHide:Hide ${label}:label:`;
  }

  private computeStatusCounts() {
    return {
      pending: this.allRfis.filter(r => r.status === 'pending').length,
      overdue: this.allRfis.filter(r => r.status === 'overdue').length,
      underReview: this.allRfis.filter(r => r.status === 'under-review').length,
      completed: this.allRfis.filter(r => r.status === 'completed').length,
      reopened: this.allRfis.filter(r => r.status === 'reopened').length,
    };
  }

  /** Redirects to the RFI management page, optionally pre-filtered by status. */
  goToRfiManagement(status: string): void {
    this.router.navigate([this.rfiRoute], {
      queryParams: status ? { status } : {},
    });
  }

  statusLegend: DonutLegendItem[] = [];

  /* ── "RFIs by Sub-Division" / "SLA Compliance by Sub-Division" chart data,
   * computed live from the canonical RFI source (see `initCharts` below) rather than
   * hand-typed, so each preview and its detail drawer can never disagree
   * with each other. */
  rfiByOrgData: any;

  readonly rfiByOrgOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { display: false } },
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      maintainAspectRatio: false,
      scales: {
        x: { stacked: false, offset: true, grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { stacked: false, beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      },
      datasets: {
        bar: {
          /* categoryPercentage raised while barPercentage lowered — opens
           * the gap between the Open/Overdue/Escalated/Closed bars within
           * an organization's group while keeping them slim. */
          barPercentage: 0.5,
          categoryPercentage: 0.5,
        },
      },
    };
  });
  slaByOrgData: any;

  readonly slaByOrgOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { display: false } },
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      maintainAspectRatio: false,
      scales: {
        x: { offset: true, grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          beginAtZero: true, max: 100,
          ticks: { callback: (v: any) => v + '%', font: { size: 11 } },
          grid: { color: c.surfaceBorder },
        }
      },
      datasets: {
        bar: {
          barPercentage: 0.5,
          categoryPercentage: 0.25,
        },
      },
    };
  });

  /** Custom legends rendered below their canvases (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legends —
   *  same treatment as the Audits by Sub-Division chart. */
  rfiByOrgLegend: DonutLegendItem[] = [];
  slaByOrgLegend: DonutLegendItem[] = [];

  /** Tracks which dataset (status) the user has hidden via the RFIs by
   *  Sub-Division legend. */
  rfiByOrgHidden: boolean[] = [];

  @ViewChild('rfiByOrgChart') private rfiByOrgChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleRfiByOrgDataset(index: number): void {
    const chart = this.rfiByOrgChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.rfiByOrgHidden[index] = !this.rfiByOrgHidden[index];
  }

  /** Highlights the hovered organization's full column, matching the Risk Rating Distribution / Audits by Sub-Division charts. */
  private readonly rfiByOrgHoverBandPlugin = {
    id: 'rfiByOrgHoverBand',
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

  readonly rfiByOrgChartPlugins = [this.rfiByOrgHoverBandPlugin];

  /** Highlights the hovered organization's whole column — same treatment
   *  as `rfiByOrgHoverBandPlugin` above, for the SLA Compliance chart. */
  private readonly slaByOrgHoverBandPlugin = {
    id: 'slaByOrgHoverBand',
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

  readonly slaByOrgChartPlugins = [this.slaByOrgHoverBandPlugin];

  /**
   * companyName here is sourced from COMPANIES_SEED (company-static-indi-org.data.ts
   * — the same seed CompanyDataService reads, matched by id) rather than this
   * RFI seed's own `companyName` field, so a company's name always agrees with
   * what the Company module actually shows for the active org instead of the
   * two seed files silently drifting apart (see Org-data-internal-audit.ts for
   * the same fix applied to Audits/Findings).
   */
  private readonly companyNameFromSeedById = new Map(COMPANIES_SEED.map(c => [c.id, c.companyName]));

  /** Canonical organization/sub-divisions source used by RFI Management. */
  readonly companies = RFI_STATIC_COMPANIES.map(c => this.companyNameFromSeedById.get(c.id) ?? c.companyName);

  /* ── Division | Sub-Division toggle ─────────────────────────────────────
   * Some divisions are audited as a whole (their RFIs sit on division-level
   * scopes), others per sub-division. Each chart card has a "View by"
   * toggle that splits the RFIs between the two — each RFI shows up in
   * exactly one view:
   *  - Division: only division-level RFIs.
   *  - Sub-Division (default): only sub-division RFIs, labelled with a
   *    second line naming the parent division.
   * Units come from the canonical RFI directory (not just the RFIs that
   * happen to exist), sub-divisions keyed by their division too. */
  readonly rfiByViews: { key: DashboardByView; label: string }[] = [
    { key: 'division', label: $localize`:@@common.division:Division` },
    { key: 'subDivision', label: $localize`:@@common.subDivision:Sub-Division` },
  ];

  rfiByView: DashboardByView = 'subDivision';
  slaByView: DashboardByView = 'subDivision';

  private readonly units: Record<DashboardByView, RfiUnit[]> = this.buildUnits();

  private buildUnits(): Record<DashboardByView, RfiUnit[]> {
    const byDivision = new Map<string, RfiUnit[]>();
    const add = (u: RfiUnit) => {
      const list = byDivision.get(u.division) ?? [];
      byDivision.set(u.division, list);
      if (!list.some(x => x.subDivision === u.subDivision)) list.push(u);
    };
    for (const c of RFI_STATIC_COMPANIES) {
      for (const d of c.divisions) {
        if (d.scopes.length) add({ division: d.divisionName, subDivision: null });
        for (const s of d.subDivisions) add({ division: d.divisionName, subDivision: s.subDivisionName });
      }
    }
    const all = [...byDivision.values()].flat();
    return {
      division: all.filter(u => u.subDivision === null),
      subDivision: all.filter(u => u.subDivision !== null),
    };
  }

  /** RFIs that sit exactly on this unit. */
  private recordsIn(u: RfiUnit): EnrichedStaticRfi[] {
    return this.allRfis.filter(r => r.divisionName === u.division && (r.subDivisionLabel || null) === u.subDivision);
  }

  /** Division name, or a two-line sub-division / parent-division label. */
  private unitLabel(u: RfiUnit): string | string[] {
    return u.subDivision === null ? u.division : [u.subDivision, `↳ ${u.division}`];
  }

  rfiByViewLabel(view: DashboardByView): string {
    return this.rfiByViews.find(v => v.key === view)!.label;
  }

  /** Every unit of the RFIs chart's current view (the preview only charts the first few). */
  get rfiUnits(): RfiUnit[] {
    return this.units[this.rfiByView];
  }

  get slaUnits(): RfiUnit[] {
    return this.units[this.slaByView];
  }

  setRfiByView(view: DashboardByView): void {
    this.rfiByView = view;
    this.buildRfiByUnitChart();
  }

  setSlaByView(view: DashboardByView): void {
    this.slaByView = view;
    this.buildSlaByUnitChart();
  }

  private readonly companyNameById = new Map(
    RFI_STATIC_COMPANIES.map(c => [c.id, this.companyNameFromSeedById.get(c.id) ?? c.companyName]),
  );

  private readonly maxPreviewDepartments = DASHBOARD_LIMITS.PreviewDepartments;

  /** Dashboard table rows are adapted from the same canonical RFI records. */
  readonly allRfiDetails: DashboardRfiRow[] = this.allRfis.map(r => this.toDetailRow(r));
  /** Full dashboard table source: all canonical RFIs, not only alert statuses. */
  readonly rfiRecords: DashboardRfiRow[] = this.allRfiDetails;

  private toDetailRow(r: EnrichedStaticRfi): DashboardRfiRow {
    return {
      id: `RFI${String(r.id).padStart(3, '0')}`,
      description: r.description,
      subDivision: r.subDivisionLabel,
      division: r.divisionName,
      company: this.companyNameById.get(r.company) ?? r.company,
      status: r.status,
      dueDate: r.dueDate.toISOString().slice(0, 10),
      responseDate: r.response?.submittedAt ?? '-',
      sla: r.status === 'overdue' ? 'Breach' : 'Met',
      priority: r.status === 'overdue' ? 'High' : 'Medium',
      submittedBy: r.ownerLabel,
      submissionDate: r.createdAt.toISOString().slice(0, 10),
      assignedTo: r.ownerLabel,
      category: r.subDivisionLabel,
      slaTargetDays: 5,
      notes: r.description,
      escalationReason: r.status === 'reopened' ? $localize`:@@dashboard.rfi.reopenedEscalationReason:RFI was reopened for additional support.` : undefined,
      escalatedTo: undefined,
    };
  }

  statusLabel(status: EnrichedStaticRfi['status']): string {
    switch (status) {
      case 'pending': return $localize`:@@common.pending:Pending`;
      case 'overdue': return $localize`:@@common.overdue:Overdue`;
      case 'under-review': return $localize`:@@common.underReview:Under Review`;
      case 'completed': return $localize`:@@common.completed:Completed`;
      case 'reopened': return $localize`:@@common.reopened:Reopened`;
      default: {
        const raw: string = status;
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      }
    }
  }

  /** Adapt canonical dashboard statuses to the legacy drawer component's status union. */
  private toDrawerDetail(r: DashboardRfiRow): RfiDetail {
    const drawerStatus: RfiDetail['status'] =
      r.status === 'completed' ? 'Closed' :
      r.status === 'overdue' ? 'Overdue' :
      r.status === 'reopened' ? 'Escalated' :
      'Open';

    return { ...r, status: drawerStatus };
  }

  /** True when the preview is actually hiding units. */
  get hasMoreOrgData(): boolean {
    return this.rfiUnits.length > this.maxPreviewDepartments;
  }

  /** Same check, reused for the SLA Compliance preview card. */
  get hasMoreSlaData(): boolean {
    return this.slaUnits.length > this.maxPreviewDepartments;
  }

  ngOnInit(): void {
    this.initCharts();
    this.verifyDataIntegrity();
  }

  /** Drawer pages, split the same way as the charts' toggle: division-level
   *  units first, then sub-divisions — so each RFI appears on exactly one page. */
  private readonly unitPages: RfiUnitPage[] = [
    ...this.units.division.map((u): RfiUnitPage => ({ name: u.division, kind: 'division', division: u.division, subDivision: null })),
    ...this.units.subDivision.map((u): RfiUnitPage => ({ name: u.subDivision!, kind: 'subDivision', division: u.division, subDivision: u.subDivision })),
  ];

  /** First drawer page of the kind a chart's toggle is currently showing. */
  private startPageFor(view: DashboardByView): number {
    return Math.max(0, this.unitPages.findIndex(p => p.kind === view));
  }

  /**
   * Opens the full "RFIs by Division / Sub-Division" breakdown — every
   * organization, every unit — in a right-side drawer. The overview chart
   * itself only ever shows the first 3 units as a minimal preview.
   */
  openRfiByDeptDetail(): void {
    this.drawer.open<void, RfiBySubDivisionDetailData>(RfiBySubDivisionDetailComponent, {
      width: DASHBOARD_DRAWER.StandardWidth,
      data: {
        pages: this.unitPages,
        startIndex: this.startPageFor(this.rfiByView),
        companies: this.companies,
        records: this.allRfiDetails.map(r => this.toDrawerDetail(r)),
      },
    });
  }

  /**
   * Opens the full "SLA Compliance by Division / Sub-Division" breakdown —
   * every organization's compliance %, every unit — in a right-side drawer.
   * The overview chart itself only ever shows the first 3 units as a
   * minimal preview.
   */
  openSlaByDeptDetail(): void {
    this.drawer.open<void, SlaBySubDivisionDetailData>(SlaBySubDivisionDetailComponent, {
      width: DASHBOARD_DRAWER.StandardWidth,
      data: {
        pages: this.unitPages,
        startIndex: this.startPageFor(this.slaByView),
        companies: this.companies,
        records: this.allRfiDetails.map(r => this.toDrawerDetail(r)),
      },
    });
  }

  openDrawer(rfi: DashboardRfiRow): void {
    this.drawer.open(RfiDetailDrawer, {
      width: DASHBOARD_DRAWER.DetailWidth,
      styleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
      data: { rfi: this.toDrawerDetail(rfi) } as RfiDetailDrawerData,
    });
  }

  /** Status counts per unit — shared by the RFIs chart and `verifyDataIntegrity()`. */
  private statusCountsFor(units: RfiUnit[]) {
    return units.map(unit => {
      const unitRecords = this.recordsIn(unit);
      return {
        unit,
        pending: unitRecords.filter(r => r.status === 'pending').length,
        overdue: unitRecords.filter(r => r.status === 'overdue').length,
        underReview: unitRecords.filter(r => r.status === 'under-review').length,
        completed: unitRecords.filter(r => r.status === 'completed').length,
        reopened: unitRecords.filter(r => r.status === 'reopened').length,
      };
    });
  }

  private initCharts(): void {
    const statusCounts = this.computeStatusCounts();
    this.statusLegend = [
      { label: this.statusLabel('pending'),      value: statusCounts.pending,     color: '#3b82f6' },
      { label: this.statusLabel('overdue'),      value: statusCounts.overdue,     color: '#22c55e' },
      { label: this.statusLabel('under-review'), value: statusCounts.underReview, color: '#ef4444' },
      { label: this.statusLabel('completed'),    value: statusCounts.completed,   color: '#f59e0b' },
      { label: this.statusLabel('reopened'),     value: statusCounts.reopened,    color: '#94a3b8' },
    ];

    this.buildRfiByUnitChart();
    this.buildSlaByUnitChart();
  }

  /* Unit-wise, grouped by status — same "3 major buckets in the preview,
   * everything in the detail drawer" MINIMUM-view pattern used for Audits /
   * Findings by Division / Sub-Division. Organization is the pagination axis
   * one level down, inside the drawer opened by clicking this chart (see
   * `openRfiByDeptDetail`). Status colors match `statusLegend` above and the
   * `getStatusSeverity` p-tag colors in the table, so a status reads the
   * same everywhere on this page. */
  private buildRfiByUnitChart(): void {
    const preview = this.statusCountsFor(this.rfiUnits.slice(0, this.maxPreviewDepartments));

    const barSpacing = { borderRadius: 4 };
    this.rfiByOrgData = {
      labels: preview.map(d => this.unitLabel(d.unit)),
      datasets: [
        { label: this.statusLabel('pending'),      data: preview.map(d => d.pending),      backgroundColor: '#f59e0b', ...barSpacing },
        { label: this.statusLabel('overdue'),      data: preview.map(d => d.overdue),      backgroundColor: '#ef4444', ...barSpacing },
        { label: this.statusLabel('under-review'), data: preview.map(d => d.underReview), backgroundColor: '#64748b', ...barSpacing },
        { label: this.statusLabel('completed'),    data: preview.map(d => d.completed),    backgroundColor: '#22c55e', ...barSpacing },
        { label: this.statusLabel('reopened'),     data: preview.map(d => d.reopened),     backgroundColor: '#dc2626', ...barSpacing },
      ]
    };
    /* Built-in legend disabled — `rfiByOrgLegend` renders the same info as
     * a custom HTML legend below the canvas instead, same treatment as the
     * Audits by Division / Sub-Division chart. */
    this.rfiByOrgLegend = this.rfiByOrgData.datasets.map((ds: any) => ({
      label: ds.label,
      value: ds.data.reduce((sum: number, n: number) => sum + n, 0),
      color: ds.backgroundColor,
    }));
    this.rfiByOrgHidden = this.rfiByOrgLegend.map(() => false);
  }

  /* Unit-wise, same MINIMUM-view pattern as RFIs by Division / Sub-Division:
   * only the first 3 units show here, and organization is the pagination
   * axis one level down in the drawer opened by clicking this chart (see
   * `openSlaByDeptDetail`). Compliance is computed straight from the
   * canonical `completed` status count rather than hand-typed, so this
   * preview and the detail drawer can never disagree. 100% compliant reads
   * green, anything under reads red. */
  private buildSlaByUnitChart(): void {
    const preview = this.slaUnits.slice(0, this.maxPreviewDepartments).map(unit => {
      const unitRecords = this.recordsIn(unit);
      const met = unitRecords.filter(r => r.status === 'completed').length;
      return {
        unit,
        // No RFIs yet reads as 0% here (same convention as a raw zero count
        // elsewhere on this page).
        compliance: unitRecords.length ? Math.round((met / unitRecords.length) * 100) : 0,
      };
    });

    this.slaByOrgData = {
      labels: preview.map(d => this.unitLabel(d.unit)),
      datasets: [{
        label: $localize`:@@dashboard.rfi.slaCompliancePercent:SLA Compliance %`,
        data: preview.map(d => d.compliance),
        backgroundColor: preview.map(d => d.compliance === 100 ? '#22c55e' : '#ef4444'),
        borderRadius: 4,
      }]
    };
    /* Built-in legend disabled — `slaByOrgLegend` is a static color key
     * instead (this chart is a single dataset colored per-bar by threshold,
     * not per-dataset, so there's no dataset to toggle per legend entry). */
    this.slaByOrgLegend = [
      { label: $localize`:@@dashboard.rfi.legendFullyCompliant:100% Compliant`, value: preview.filter(d => d.compliance === 100).length, color: '#22c55e' },
      { label: $localize`:@@dashboard.rfi.legendBelowTarget:Below Target`,     value: preview.filter(d => d.compliance < 100).length,   color: '#ef4444' },
    ];
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      pending: 'warn',
      overdue: 'danger',
      'under-review': 'secondary',
      completed: 'success',
      reopened: 'danger',
      Pending: 'warn',
      Overdue: 'danger',
      'Under Review': 'secondary',
      Completed: 'success',
      Reopened: 'danger',
      Open: 'info',
      Closed: 'success',
      Escalated: 'warn',
    };
    return map[status] ?? 'secondary';
  }

  isAlertRow(rfi: DashboardRfiRow): boolean {
    return rfi.status === 'overdue' || rfi.status === 'reopened';
  }

  /**
   * One-time sanity check (this component's data is a static field, not a
   * reactive signal, so a single post-`initCharts()` check is enough): re-
   * derives a couple of totals independently and warns loudly in the
   * console the moment one stops matching what the stat cards / charts
   * actually display — exactly the kind of silent drift that had "SLA
   * Compliance" showing 75% against real data that works out to 38%.
   */
  private verifyDataIntegrity(): void {
    const s = this.computeStatusCounts();
    const total = this.allRfis.length;
    const statusSum = s.pending + s.overdue + s.underReview + s.completed + s.reopened;
    if (statusSum !== total) {
      console.warn(
        `[RfiTabComponent] Status counts sum to ${statusSum} but there are ${total} RFI records.`,
      );
    }

    // The Division / Sub-Division views split the RFIs between them, so
    // together they must cover every RFI exactly once.
    const unitSum = this.statusCountsFor([...this.units.division, ...this.units.subDivision]).reduce(
      (sum, d) => sum + d.pending + d.overdue + d.underReview + d.completed + d.reopened,
      0,
    );
    if (unitSum !== total) {
      console.warn(
        `[RfiTabComponent] Division / Sub-Division breakdown totals to ${unitSum} across both views but there are ${total} RFI records.`,
      );
    }
  }
}
