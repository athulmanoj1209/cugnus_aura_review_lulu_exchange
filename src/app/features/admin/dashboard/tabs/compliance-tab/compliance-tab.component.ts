import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ComplianceDetailDrawer } from '../../com/compliance-detail-drawer/compliance-detail-drawer';
import { ComplianceScopeDetail } from '@/app/features/admin/dashboard/models/dashboard-compliance.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
  selector: 'app-compliance-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, ProgressBarModule, CardModule, ComplianceDetailDrawer, DrawIconComponent, DonutStatusChartComponent],
  templateUrl: './compliance-tab.component.html',
  styleUrl: './compliance-tab.component.scss',
})
export class ComplianceTabComponent implements OnInit {

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

  statCards = [
    { label: $localize`:@@dashboard.compliance.totalComplianceScopes:Total Compliance Scopes`, value: '7',   sub: $localize`:@@dashboard.compliance.fullyMappedSub:${3}:count: fully mapped`,          subClass: 'sub-gray',  icon: 'pi pi-copy',                 cardClass: '' },
    { label: $localize`:@@dashboard.compliance.avgCoverage:Avg Coverage`,                       value: '74%', sub: $localize`:@@dashboard.compliance.fromLastMonthSub:↑ ${5}:percent:% from last month`, subClass: 'sub-green', icon: 'pi pi-shield',               cardClass: 'stat--warning' },
    { label: $localize`:@@dashboard.compliance.notMappedCard:Not Mapped`,                       value: '1',   sub: '',                                                                                 subClass: '',          icon: 'pi pi-exclamation-triangle', cardClass: 'stat--danger' },
    { label: $localize`:@@dashboard.compliance.upcomingRenewals:Upcoming Renewals`,             value: '0',   sub: $localize`:@@dashboard.compliance.within90DaysSub:Within ${90}:days: days`,          subClass: 'sub-gray',  icon: 'pi pi-calendar',             cardClass: '' },
  ];

  readonly mappingLegend = [
    { label: $localize`:@@common.mapped:Mapped`, value: 43, color: '#22c55e' },
    { label: $localize`:@@common.partial:Partial`, value: 43, color: '#f59e0b' },
    { label: $localize`:@@common.notMapped:Not Mapped`, value: 14, color: '#ef4444' },
  ];

  coverageChartData: any;

  readonly coverageChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          axis: 'y',
          displayColors: false,
          backgroundColor: c.surfaceCard,
          borderColor: c.surfaceBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleColor: c.text,
          titleFont: { size: 12, weight: 'bold' },
          bodyColor: c.text,
          bodyFont: { size: 13, weight: 'bold' },
          caretSize: 6,
        },
      },
      interaction: { mode: 'index', intersect: false, axis: 'y' },
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true, max: 100, ticks: { callback: (v: any) => v + '%', font: { size: 11 } }, grid: { color: c.surfaceBorder } },
        y: { offset: true, grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      datasets: {
        bar: {
          barPercentage: 0.5,
          categoryPercentage: 0.45,
        },
      },
    };
  });

  /** Custom legends rendered below their canvases (styled like the donut
   *  chart's legend) instead of Chart.js's built-in in-canvas legends —
   *  same treatment as the Audits by Department chart. */
  coverageLegend: DonutLegendItem[] = [];
  scopesPerRegLegend: DonutLegendItem[] = [];

  /** Tracks which dataset the user has hidden via the Scopes per Regulation
   *  legend. */
  scopesPerRegHidden: boolean[] = [];

  @ViewChild('scopesPerRegChart') private scopesPerRegChartRef?: UIChart;

  /** Toggles a dataset's visibility when its legend entry is clicked. */
  toggleScopesPerRegDataset(index: number): void {
    const chart = this.scopesPerRegChartRef?.chart;
    if (!chart) return;
    chart.setDatasetVisibility(index, !chart.isDatasetVisible(index));
    chart.update();
    this.scopesPerRegHidden[index] = !this.scopesPerRegHidden[index];
  }

  /** Highlights the hovered category's full row, matching the Risk Rating Distribution chart. */
  private readonly coverageHoverBandPlugin = {
    id: 'coverageHoverBand',
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

  readonly coverageHoverBandPlugins = [this.coverageHoverBandPlugin];

  /** Raw per-regulation coverage values, kept separate from
   *  `coverageChartData` so hidden tiers can be restored (their bars are
   *  set to `null` in the chart data, not deleted from the source). */
  private coverageValues: number[] = [];

  /** Each bar's actual displayed color, in the same order as
   *  `coverageValues` — hiding is keyed off this (what the user sees),
   *  not off a recomputed value tier, so a bar always hides with the
   *  legend entry whose color it actually matches on screen. */
  private coverageColors: string[] = [];

  /** Tracks which coverage tier (Full/Partial/Not Mapped) the user has
   *  hidden via the Coverage by Regulation legend. Unlike a normal
   *  per-dataset toggle, this chart has a single dataset colored per-bar by
   *  tier, so hiding a tier means nulling out just the bars in that tier
   *  rather than calling `setDatasetVisibility`. */
  coverageHidden: boolean[] = [false, false, false];

  @ViewChild('coverageChart') private coverageChartRef?: UIChart;

  /** Toggles a coverage tier's bars on/off when its legend entry is clicked. */
  toggleCoverageTier(index: number): void {
    const chart = this.coverageChartRef?.chart;
    if (!chart) return;
    this.coverageHidden[index] = !this.coverageHidden[index];
    chart.data.datasets[0].data = this.coverageValues.map((v, i) => {
      const tierIndex = this.coverageLegend.findIndex(t => t.color === this.coverageColors[i]);
      return this.coverageHidden[tierIndex] ? null : v;
    });
    chart.update();
  }
  radarChartData: any;

  readonly radarChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true, max: 100,
          ticks: { stepSize: 25, font: { size: 10 }, backdropColor: 'transparent' },
          grid: { color: c.surfaceBorder }, angleLines: { color: c.surfaceBorder },
          pointLabels: { font: { size: 11 }, color: c.textSecondary },
        }
      }
    };
  });

  scopesPerRegChartData: any;

  readonly scopesPerRegChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          displayColors: false,
          backgroundColor: c.surfaceCard,
          borderColor: c.surfaceBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleColor: c.text,
          titleFont: { size: 12, weight: 'bold' },
          bodyColor: c.text,
          bodyFont: { size: 13, weight: 'bold' },
          caretSize: 6,
        },
      },
      interaction: { mode: 'index', intersect: false, axis: 'x' },
      maintainAspectRatio: false,
      scales: {
        x: { offset: true, grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      },
      datasets: {
        bar: {
          barPercentage: 0.35,
          categoryPercentage: 0.412,
        },
      },
    };
  });

  // Drawer state
  drawerVisible = false;
  selectedScope: ComplianceScopeDetail | null = null;

  readonly regulations = ['SOX 404', 'ISO 27001', 'GDPR', 'OSHA Standards', 'AML/KYC', 'EPA Regulations', 'COSO Framework'];

  complianceScopes: ComplianceScopeDetail[] = [
    {
      name: 'Financial Controls Review', regulation: 'SOX 404', coverage: 100, status: 'Mapped', nextRenewal: '2026-12-31',
      description: 'Comprehensive review of financial controls covering revenue recognition, expense management, and internal approval workflows.',
      owner: 'Rachel Kim', auditor: 'Sarah Johnson', lastAssessmentDate: '2026-01-15',
      controlsMapped: 12, totalControls: 12,
      requirements: ['Section 302 — CEO/CFO Certification', 'Section 404 — Management Assessment', 'IT General Controls Review', 'Access Control Verification'],
      gaps: [],
    },
    {
      name: 'IT Security Assessment', regulation: 'ISO 27001', coverage: 85, status: 'Partial', nextRenewal: '2026-06-30',
      description: 'Assessment of information security management system covering data protection, access management, and incident response.',
      owner: 'James Lee', auditor: 'Michael Brown', lastAssessmentDate: '2026-01-10',
      controlsMapped: 17, totalControls: 20,
      requirements: ['A.9 — Access Control', 'A.12 — Operations Security', 'A.16 — Incident Management', 'A.18 — Compliance'],
      gaps: ['Patch management policy not fully documented', 'Encryption standard not applied to all data-at-rest', 'Security awareness training completion below 80%'],
    },
    {
      name: 'Customer Data Privacy', regulation: 'GDPR', coverage: 100, status: 'Mapped', nextRenewal: '2026-05-25',
      description: 'Full GDPR compliance mapping covering data subject rights, lawful basis for processing, and breach notification procedures.',
      owner: 'Linda Chen', auditor: 'Emily Davis', lastAssessmentDate: '2026-01-08',
      controlsMapped: 8, totalControls: 8,
      requirements: ['Article 13/14 — Privacy Notices', 'Article 17 — Right to Erasure', 'Article 25 — Data Protection by Design', 'Article 33 — Breach Notification'],
      gaps: [],
    },
    {
      name: 'HR Compliance Audit', regulation: 'OSHA Standards', coverage: 75, status: 'Partial', nextRenewal: '2026-08-15',
      description: 'Workplace safety and health compliance audit against OSHA 29 CFR standards for office and operational environments.',
      owner: 'Anna White', auditor: 'Tom Wilson', lastAssessmentDate: '2025-12-20',
      controlsMapped: 9, totalControls: 12,
      requirements: ['29 CFR 1910.132 — PPE Standards', '29 CFR 1910.147 — Control of Hazardous Energy', '29 CFR 1904 — Recordkeeping', '29 CFR 1910.38 — Emergency Action Plans'],
      gaps: ['Emergency action plan not updated for new office floor', 'Hazardous energy control procedure missing for 2 equipment types'],
    },
    {
      name: 'Anti-Money Laundering', regulation: 'AML/KYC', coverage: 0, status: 'Not Mapped', nextRenewal: '2026-09-30',
      description: 'AML/KYC program compliance mapping for customer due diligence, suspicious activity monitoring, and regulatory reporting obligations.',
      owner: 'David Clark', auditor: 'Rachel Kim', lastAssessmentDate: '-',
      controlsMapped: 0, totalControls: 10,
      requirements: ['Customer Due Diligence (CDD)', 'Enhanced Due Diligence (EDD)', 'Suspicious Activity Reporting', 'Transaction Monitoring Program'],
      gaps: ['No AML program documentation found', 'KYC procedures not established', 'SAR filing process undefined', 'Transaction monitoring system not implemented', 'Staff AML training not conducted'],
    },
    {
      name: 'Environmental Compliance', regulation: 'EPA Regulations', coverage: 60, status: 'Partial', nextRenewal: '-',
      description: 'Environmental compliance scope covering waste management, emissions tracking, and EPA reporting obligations.',
      owner: 'Tom Wilson', auditor: 'Anna White', lastAssessmentDate: '2025-11-30',
      controlsMapped: 6, totalControls: 10,
      requirements: ['40 CFR Part 262 — Hazardous Waste Generator', '40 CFR Part 98 — GHG Reporting', 'Spill Prevention Plan', 'Air Emissions Monitoring'],
      gaps: ['GHG reporting methodology not documented', 'Spill prevention plan requires update', 'Emissions monitoring data incomplete for Q3'],
    },
    {
      name: 'Risk Management Review', regulation: 'COSO Framework', coverage: 100, status: 'Mapped', nextRenewal: '-',
      description: 'Enterprise risk management framework alignment with COSO ERM 2017 covering risk identification, assessment, response, and monitoring.',
      owner: 'Sarah Johnson', auditor: 'James Lee', lastAssessmentDate: '2026-01-20',
      controlsMapped: 15, totalControls: 15,
      requirements: ['Component 1 — Governance & Culture', 'Component 2 — Strategy & Objective-Setting', 'Component 3 — Performance', 'Component 4 — Review & Revision', 'Component 5 — Information & Communication'],
      gaps: [],
    },
  ];

  ngOnInit(): void {
    this.initCharts();
  }

  openDrawer(scope: ComplianceScopeDetail): void {
    this.selectedScope = scope;
    this.drawerVisible = true;
  }

  private initCharts(): void {
    this.coverageValues = [100, 85, 100, 75, 0, 60, 100];
    this.coverageColors = ['#22c55e', '#22c55e', '#22c55e', '#f59e0b', '#ef4444', '#f59e0b', '#22c55e'];
    this.coverageChartData = {
      labels: this.regulations,
      datasets: [{
        label: $localize`:@@dashboard.compliance.coveragePercentDataset:Coverage %`,
        data: this.coverageValues,
        backgroundColor: this.coverageColors,
        borderRadius: 4,
      }]
    };
    /* Built-in legend disabled — `coverageLegend` renders as a clickable
     * tier key instead (this chart is a single dataset colored per-bar by
     * coverage tier, so `toggleCoverageTier` nulls out a tier's bars rather
     * than toggling a whole dataset). */
    this.coverageLegend = [
      { label: $localize`:@@dashboard.compliance.tierFullCoverage:Full Coverage`, value: this.coverageValues.filter(v => v === 100).length, color: '#22c55e' },
      { label: $localize`:@@dashboard.compliance.tierPartial:Partial`,           value: this.coverageValues.filter(v => v > 0 && v < 100).length, color: '#f59e0b' },
      { label: $localize`:@@dashboard.compliance.tierNotMapped:Not Mapped`,      value: this.coverageValues.filter(v => v === 0).length, color: '#ef4444' },
    ];
    this.radarChartData = {
      labels: ['SOX 404', 'ISO 27001', 'GDPR', 'OSHA Standards', 'AML/KYC', 'EPA Regulations', 'COSO Framework'],
      datasets: [{
        label: $localize`:@@dashboard.compliance.coveragePercentDataset:Coverage %`,
        data: [100, 85, 100, 75, 0, 60, 100],
        backgroundColor: 'rgba(34, 197, 94, 0.20)',
        borderColor: '#22c55e',
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 2,
      }]
    };
    this.scopesPerRegChartData = {
      labels: this.regulations,
      datasets: [{
        label: $localize`:@@dashboard.compliance.numberOfScopesDataset:Number of Scopes`,
        data: [1, 1, 1, 1, 1, 1, 1],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      }]
    };
    /* Built-in legend disabled — `scopesPerRegLegend` renders the same info
     * as a custom HTML legend below the canvas instead. */
    this.scopesPerRegLegend = this.scopesPerRegChartData.datasets.map((ds: any) => ({
      label: ds.label,
      value: ds.data.reduce((sum: number, n: number) => sum + n, 0),
      color: ds.backgroundColor,
    }));
    this.scopesPerRegHidden = this.scopesPerRegLegend.map(() => false);
  }

  /** Highlights the hovered category's full column, matching the audit overview charts. */
  private readonly scopesPerRegHoverBandPlugin = {
    id: 'scopesPerRegHoverBand',
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

  readonly scopesPerRegHoverBandPlugins = [this.scopesPerRegHoverBandPlugin];

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
      Mapped: 'success', Partial: 'warn', 'Not Mapped': 'danger',
    };
    return map[status] ?? 'secondary';
  }

  /** Translated display text for a scope status — severity lookups stay on the raw value. */
  statusText(status: string): string {
    switch (status) {
      case 'Mapped': return $localize`:@@common.mapped:Mapped`;
      case 'Partial': return $localize`:@@common.partial:Partial`;
      case 'Not Mapped': return $localize`:@@common.notMapped:Not Mapped`;
      default: return status;
    }
  }

  /** Accessible label for a legend toggle ("Show X" / "Hide X"). */
  legendToggleLabel(hidden: boolean, label: string): string {
    return hidden
      ? $localize`:@@dashboard.compliance.showItem:Show ${label}:label:`
      : $localize`:@@dashboard.compliance.hideItem:Hide ${label}:label:`;
  }

  getCoverageBarClass(coverage: number): string {
    if (coverage === 0) return 'bar-zero';
    if (coverage < 75) return 'bar-partial';
    return 'bar-full';
  }

  isAlertRow(scope: ComplianceScopeDetail): boolean {
    return scope.status === 'Not Mapped';
  }
}
