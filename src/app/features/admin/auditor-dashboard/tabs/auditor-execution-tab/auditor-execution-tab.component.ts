import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { FindingsProfileComponent, FindingProfileData } from '@/app/features/audits/audit-execution/findings/profile/findings-profile.component';
import { EvidenceProfileComponent, EvidenceDetailDrawerData } from '@/app/features/audits/audit-execution/evidence/profile/evidence-profile.component';
import { ObservationProfileComponent, ObservationDetailDrawerData } from '@/app/features/audits/audit-execution/observation/profile/observation-profile.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import { LayoutService } from '@/app/layout/service/layout.service';
import {
  countFindingsForAuditorByDisplayStatus,
  countHighRiskFindingsForAuditor,
  countRepeatedFindingsForAuditor,
  getFindingsForAuditor,
} from '@/app/features/audits/audit-execution/findings/list/findings-list.component';
import {
  countEvidenceForAuditorByStatus,
  getEvidenceForAuditor,
} from '@/app/features/audits/audit-execution/evidence/list/evidence-list.component';
import {
  countObservationsForAuditorByDisplayStatus,
  countObservationsForAuditorByRiskBand,
  getObservationsForAuditor,
} from '@/app/features/audits/audit-execution/observation/list/observation-list.component';
import {
  EvidenceCard,
  EvidenceRow,
  FindingCard,
  FindingRow,
  ObservationCard,
  ObservationRow,
} from '@/app/features/admin/auditor-dashboard/models/auditor-execution.model';
import {
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AUDITOR_DASHBOARD_DRAWER_WIDTHS,
  AUDITOR_DASHBOARD_PAGE_SIZES,
  AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
  AUDITOR_DASHBOARD_ROUTES,
  AuditorEvidenceFilterStatuses,
  AuditorEvidenceStatuses,
  AuditorFindingStatuses,
  AuditorFindingViews,
  AuditorObservationStatuses,
  AuditorRiskLevels,
} from '../../constants/auditor-dashboard.constants';
import {
  COMMENT_STATUS_SEVERITY,
  DASHBOARD_COLORS,
  DASHBOARD_DEFAULT_SEVERITY,
  DASHBOARD_THEME_FALLBACKS,
  EVIDENCE_STATUS_SEVERITY,
  FINDING_STATUS_SEVERITY,
  OBSERVATION_STATUS_SEVERITY,
  RISK_BAR_COLORS,
  RISK_SEVERITY,
  type DashboardTagSeverity,
} from '../../constants/auditor-dashboard-labels.constants';
import { EXECUTION_CHART_DATASET_LABELS } from '../../constants/auditor-dashboard-messages.constants';

const C = DASHBOARD_COLORS;
const FS = AuditorFindingStatuses;
const ES = AuditorEvidenceStatuses;
const OS = AuditorObservationStatuses;
const R = AuditorRiskLevels;

@Component({
  selector: 'app-auditor-execution-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, DonutStatusChartComponent, DrawIconComponent],
  templateUrl: './auditor-execution-tab.component.html',
  styleUrl: './auditor-execution-tab.component.scss',
})
export class AuditorExecutionTabComponent implements OnInit {

  @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  readonly PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.Default;
  readonly PAGE_SIZE_OPTIONS = AUDITOR_DASHBOARD_PAGE_SIZES.DefaultOptions;
  readonly RiskLevels = AuditorRiskLevels;

  private readonly drawer = inject(RightDrawerService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);

  readonly highLabel = $localize`:@@common.high:High`;
  readonly mediumLabel = $localize`:@@common.medium:Medium`;
  readonly lowLabel = $localize`:@@common.low:Low`;
  readonly draftLabel = $localize`:@@common.draft:Draft`;
  readonly submittedLabel = $localize`:@@common.submitted:Submitted`;
  readonly underReviewLabel = $localize`:@@common.underReview:Under Review`;
  readonly approvedLabel = $localize`:@@common.approved:Approved`;
  readonly closedLabel = $localize`:@@common.closed:Closed`;
  readonly repeatedLabel = $localize`:@@common.repeated:Repeated`;
  readonly requestedLabel = $localize`:@@common.requested:Requested`;
  readonly uploadedLabel = $localize`:@@common.uploaded:Uploaded`;
  readonly acceptedLabel = $localize`:@@common.accepted:Accepted`;
  readonly rejectedLabel = $localize`:@@common.rejected:Rejected`;
  readonly openLabel = $localize`:@@common.open:Open`;
  readonly resolvedLabel = $localize`:@@common.resolved:Resolved`;
  readonly findingsLabel = $localize`:@@admin.auditorExecution.findings:Findings`;
  readonly evidencesLabel = $localize`:@@admin.auditorExecution.evidences:Evidences`;
  readonly observationsLabel = $localize`:@@admin.auditorExecution.observations:Observations`;

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in light-mode-only hex at load time. */
  private readonly themeColors = computed(() => {
    this.layoutService.layoutConfig().darkTheme;
    const ds = getComputedStyle(document.documentElement);
    return {
      surfaceCard: ds.getPropertyValue('--surface-card').trim() || DASHBOARD_THEME_FALLBACKS.SurfaceCard,
      surfaceBorder: ds.getPropertyValue('--surface-border').trim() || DASHBOARD_THEME_FALLBACKS.SurfaceBorder,
      text: ds.getPropertyValue('--text-color').trim() || DASHBOARD_THEME_FALLBACKS.Text,
      textSecondary: ds.getPropertyValue('--text-color-secondary').trim() || DASHBOARD_THEME_FALLBACKS.TextSecondary,
    };
  });

  findingsSummaryCards: FindingCard[] = [
    { label: $localize`:@@admin.auditorExecution.draftFindings:Draft Findings`,     value: String(countFindingsForAuditorByDisplayStatus(this.currentAuditor.id, FS.Draft)), icon: 'pi pi-pencil',             cardClass: '', view: AuditorFindingViews.Draft },
    { label: $localize`:@@common.submitted:Submitted`,          value: String(countFindingsForAuditorByDisplayStatus(this.currentAuditor.id, FS.Submitted)), icon: 'pi pi-send',               cardClass: 'stat--info', view: AuditorFindingViews.Submitted },
    { label: $localize`:@@common.underReview:Under Review`,       value: String(countFindingsForAuditorByDisplayStatus(this.currentAuditor.id, FS.UnderReview)), icon: 'pi pi-search',             cardClass: 'stat--warning', view: AuditorFindingViews.UnderReview },
    { label: $localize`:@@common.approved:Approved`,           value: String(countFindingsForAuditorByDisplayStatus(this.currentAuditor.id, FS.Approved)), icon: 'pi pi-check-circle',       cardClass: 'stat--success', view: AuditorFindingViews.Approved },
    { label: $localize`:@@common.closed:Closed`,             value: String(countFindingsForAuditorByDisplayStatus(this.currentAuditor.id, FS.Closed)), icon: 'pi pi-times-circle',       cardClass: '', view: AuditorFindingViews.MyClosed },
    { label: $localize`:@@admin.auditorExecution.highRiskFindings:High Risk Findings`, value: String(countHighRiskFindingsForAuditor(this.currentAuditor.id)), icon: 'pi pi-exclamation-circle', cardClass: 'stat--danger', view: AuditorFindingViews.HighRisk },
    { label: $localize`:@@admin.auditorExecution.repeatedFindings:Repeated Findings`, value: String(countRepeatedFindingsForAuditor(this.currentAuditor.id)), icon: 'pi pi-replay', cardClass: 'stat--warning', view: AuditorFindingViews.Repeated },
  ];

  observationSummaryCards: ObservationCard[] = [
    { label: $localize`:@@admin.auditorExecution.totalObservations:Total Observations`, value: String(countObservationsForAuditorByDisplayStatus(this.currentAuditor.name, null)), icon: 'pi pi-eye',               cardClass: '' },
    { label: $localize`:@@common.open:Open`,               value: String(countObservationsForAuditorByDisplayStatus(this.currentAuditor.name, OS.Open)), icon: 'pi pi-folder-open',        cardClass: 'stat--danger', status: OS.Open },
    { label: $localize`:@@common.underReview:Under Review`,       value: String(countObservationsForAuditorByDisplayStatus(this.currentAuditor.name, OS.UnderReview)), icon: 'pi pi-search',             cardClass: 'stat--warning', status: OS.UnderReview },
    { label: $localize`:@@common.resolved:Resolved`,           value: String(countObservationsForAuditorByDisplayStatus(this.currentAuditor.name, OS.Resolved)), icon: 'pi pi-check-circle',       cardClass: 'stat--success', status: OS.Resolved },
    { label: $localize`:@@common.highRisk:High Risk`,          value: String(countObservationsForAuditorByRiskBand(this.currentAuditor.name, R.High)), icon: 'pi pi-exclamation-circle', cardClass: 'stat--danger', riskBand: R.High },
    { label: $localize`:@@common.mediumRisk:Medium Risk`,        value: String(countObservationsForAuditorByRiskBand(this.currentAuditor.name, R.Medium)), icon: 'pi pi-info-circle',        cardClass: 'stat--warning', riskBand: R.Medium },
  ];

  evidenceSummaryCards: EvidenceCard[] = [
    { label: $localize`:@@admin.auditorExecution.totalEvidences:Total Evidences`, value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, null)), icon: 'pi pi-paperclip',    cardClass: '' },
    { label: $localize`:@@common.requested:Requested`,       value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, ES.Requested)), icon: 'pi pi-send',          cardClass: 'stat--info', status: AuditorEvidenceFilterStatuses.Requested },
    { label: $localize`:@@common.uploaded:Uploaded`,        value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, ES.Uploaded)), icon: 'pi pi-upload',        cardClass: 'stat--info', status: AuditorEvidenceFilterStatuses.Uploaded },
    { label: $localize`:@@common.underReview:Under Review`,    value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, ES.UnderReview)), icon: 'pi pi-search',        cardClass: 'stat--warning', status: AuditorEvidenceFilterStatuses.UnderReview },
    { label: $localize`:@@common.accepted:Accepted`,        value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, ES.Accepted)), icon: 'pi pi-check-circle',  cardClass: 'stat--success', status: AuditorEvidenceFilterStatuses.Accepted },
    { label: $localize`:@@common.rejected:Rejected`,        value: String(countEvidenceForAuditorByStatus(this.currentAuditor.name, ES.Rejected)), icon: 'pi pi-times-circle',  cardClass: 'stat--danger', status: AuditorEvidenceFilterStatuses.Rejected },
  ];

  onFindingCardClick(card: FindingCard): void {
    this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], {
      queryParams: { [QP.AuditorId]: this.currentAuditor.id, ...(card.view ? { [QP.View]: card.view } : {}) },
    });
  }

  onObservationCardClick(card: ObservationCard): void {
    this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ObservationList], {
      queryParams: {
        [QP.AuditorId]: this.currentAuditor.name,
        ...(card.status ? { [QP.Status]: card.status } : {}),
        ...(card.riskBand ? { [QP.RiskBand]: card.riskBand } : {}),
      },
    });
  }

  onEvidenceCardClick(card: EvidenceCard): void {
    this.router.navigate([AUDITOR_DASHBOARD_ROUTES.EvidenceList], {
      queryParams: { [QP.AuditorId]: this.currentAuditor.name, ...(card.status ? { [QP.Status]: card.status } : {}) },
    });
  }

  findingsByRiskChartData: any;

  readonly findingsByRiskChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
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
      interaction: { mode: 'index' as const, intersect: false },
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      },
      datasets: { bar: { barPercentage: 0.35, categoryPercentage: 0.412 } },
    };
  });

  findingsStatusChartData: any;
  findingsStatusChartOptions: any;
  evidencesByRiskChartData: any;

  readonly evidencesByRiskChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      },
      datasets: { bar: { barPercentage: 0.35, categoryPercentage: 0.412 } },
    };
  });

  evidencesStatusChartData: any;
  evidencesStatusChartOptions: any;
  observationsByRiskChartData: any;

  readonly observationsByRiskChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      },
      datasets: { bar: { barPercentage: 0.35, categoryPercentage: 0.412 } },
    };
  });

  observationsStatusChartData: any;
  observationsStatusChartOptions: any;

  findingsStatusLegend: DonutLegendItem[] = [];
  evidencesStatusLegend: DonutLegendItem[] = [];
  observationsStatusLegend: DonutLegendItem[] = [];

   /** Highlights the hovered category's full column, matching the Audits by Department chart. */
  private readonly findingsByRiskHoverBandPlugin = {
    id: 'findingsByRiskHoverBand',
    beforeDatasetsDraw: (chart: any) => {
      const active = chart.getActiveElements();
      if (!active || !active.length) return;
      const { ctx, chartArea, scales } = chart;
      const xScale = scales['x'];
      const index = active[0].index;
      const bandWidth = xScale.width / xScale.ticks.length;
      const centerX = xScale.getPixelForTick(index);
      ctx.save();
      ctx.fillStyle = C.HoverBand;
      ctx.fillRect(centerX - bandWidth / 2, chartArea.top, bandWidth, chartArea.bottom - chartArea.top);
      ctx.restore();
    },
  };

  readonly findingsByRiskHoverBandPlugins = [this.findingsByRiskHoverBandPlugin];

  // Computed once (not as getters) — a getter bound directly to p-table's
  // [value] re-runs and returns a brand-new array of brand-new row objects
  // on every change-detection cycle, which makes the table tear down and
  // rebuild its rows constantly and can drop a real click on the "view"
  // button mid-render. See findings-list/evidence-list/observation-list
  // for the underlying data.
  myFindings: FindingRow[] = [];
  myEvidences: EvidenceRow[] = [];
  myObservations: ObservationRow[] = [];

  ngOnInit(): void {
    this.myFindings = getFindingsForAuditor(this.currentAuditor.id);
    this.myEvidences = getEvidenceForAuditor(this.currentAuditor.name);
    this.myObservations = getObservationsForAuditor(this.currentAuditor.name);
    this.initCharts();
  }

  openFindingsDrawer(row: FindingRow): void {
    this.drawer.open<FindingsProfileComponent, FindingProfileData>(
      FindingsProfileComponent,
      { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Finding, data: row.detail },
    );
  }

  openEvidencesDrawer(row: EvidenceRow): void {
    this.drawer.open<EvidenceProfileComponent, EvidenceDetailDrawerData>(
      EvidenceProfileComponent,
      { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Evidence, data: { evidence: row.detail } },
    );
  }

  openObservationsDrawer(row: ObservationRow): void {
    this.drawer.open<ObservationProfileComponent, ObservationDetailDrawerData>(
      ObservationProfileComponent,
      { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Observation, data: { observation: row.detail } },
    );
  }

  /**
   * Every chart below counts straight from the same row arrays (myFindings/
   * myEvidences/myObservations) used by the tables and, for the shared
   * buckets, the same helper calls used by the summary cards — so slices
   * always add up to what the cards and tables show.
   */
  private initCharts(): void {
    const findings = this.myFindings;
    const evidences = this.myEvidences;
    const observations = this.myObservations;

    const countBy = <T>(rows: T[], key: keyof T, value: string) => rows.filter(r => r[key] === value).length;

    this.findingsByRiskChartData = {
      labels: [this.highLabel, this.mediumLabel, this.lowLabel],
      datasets: [{
        label: EXECUTION_CHART_DATASET_LABELS.Findings,
        data: [countBy(findings, 'risk', R.High), countBy(findings, 'risk', R.Medium), countBy(findings, 'risk', R.Low)],
        backgroundColor: RISK_BAR_COLORS,
        borderRadius: 6,
      }]
    };
    this.findingsStatusChartData = {
      labels: [this.draftLabel, this.submittedLabel, this.underReviewLabel, this.approvedLabel, this.closedLabel],
      datasets: [{
        data: [
          countBy(findings, 'status', FS.Draft),
          countBy(findings, 'status', FS.Submitted),
          countBy(findings, 'status', FS.UnderReview),
          countBy(findings, 'status', FS.Approved),
          countBy(findings, 'status', FS.Closed),
        ],
        backgroundColor: [C.Slate, C.Blue, C.Amber, C.Green, C.Gray],
        hoverBackgroundColor: [C.SlateHover, C.BlueHover, C.AmberHover, C.GreenHover, C.GrayHover],
        borderWidth: 2, borderColor: C.White,
      }]
    };
    this.findingsStatusChartOptions = {
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 12 } } } },
      maintainAspectRatio: false, cutout: '60%',
    };
    this.findingsStatusLegend = [
      { label: this.draftLabel,        value: countBy(findings, 'status', FS.Draft),       color: C.Slate },
      { label: this.submittedLabel,    value: countBy(findings, 'status', FS.Submitted),   color: C.Blue },
      { label: this.underReviewLabel, value: countBy(findings, 'status', FS.UnderReview), color: C.Amber },
      { label: this.approvedLabel,     value: countBy(findings, 'status', FS.Approved),    color: C.Green },
      { label: this.closedLabel,       value: countBy(findings, 'status', FS.Closed),      color: C.Gray },
      // Repeated is a flag, not a status — these findings are also in one of the status slices above.
      { label: this.repeatedLabel,     value: findings.filter(f => f.detail.isRepeated).length, color: C.Violet },
    ];

    this.evidencesByRiskChartData = {
      labels: [this.highLabel, this.mediumLabel, this.lowLabel],
      datasets: [{
        label: EXECUTION_CHART_DATASET_LABELS.Evidences,
        data: [countBy(evidences, 'risk', R.High), countBy(evidences, 'risk', R.Medium), countBy(evidences, 'risk', R.Low)],
        backgroundColor: RISK_BAR_COLORS,
        borderRadius: 6,
      }]
    };
    this.evidencesStatusChartData = {
      labels: [this.requestedLabel, this.uploadedLabel, this.underReviewLabel, this.acceptedLabel, this.rejectedLabel],
      datasets: [{
        data: [
          countBy(evidences, 'status', ES.Requested),
          countBy(evidences, 'status', ES.Uploaded),
          countBy(evidences, 'status', ES.UnderReview),
          countBy(evidences, 'status', ES.Accepted),
          countBy(evidences, 'status', ES.Rejected),
        ],
        backgroundColor: [C.Blue, C.Slate, C.Amber, C.Green, C.Red],
        hoverBackgroundColor: [C.BlueHover, C.SlateHover, C.AmberHover, C.GreenHover, C.RedHover],
        borderWidth: 2, borderColor: C.White,
      }]
    };
    this.evidencesStatusChartOptions = {
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } } },
      maintainAspectRatio: false, cutout: '60%',
    };
    this.evidencesStatusLegend = [
      { label: this.requestedLabel,    value: countBy(evidences, 'status', ES.Requested),   color: C.Blue },
      { label: this.uploadedLabel,     value: countBy(evidences, 'status', ES.Uploaded),    color: C.Slate },
      { label: this.underReviewLabel, value: countBy(evidences, 'status', ES.UnderReview), color: C.Amber },
      { label: this.acceptedLabel,     value: countBy(evidences, 'status', ES.Accepted),    color: C.Green },
      { label: this.rejectedLabel,     value: countBy(evidences, 'status', ES.Rejected),    color: C.Red },
    ];

    this.observationsByRiskChartData = {
      labels: [this.highLabel, this.mediumLabel, this.lowLabel],
      datasets: [{
        label: EXECUTION_CHART_DATASET_LABELS.Observations,
        data: [
          observations.filter(o => o.riskRating === R.High || o.riskRating === R.Critical).length,
          countBy(observations, 'riskRating', R.Medium),
          countBy(observations, 'riskRating', R.Low),
        ],
        backgroundColor: RISK_BAR_COLORS,
        borderRadius: 6,
      }]
    };
    this.observationsStatusChartData = {
      labels: [this.openLabel, this.underReviewLabel, this.resolvedLabel],
      datasets: [{
        data: [
          countBy(observations, 'status', OS.Open),
          countBy(observations, 'status', OS.UnderReview),
          countBy(observations, 'status', OS.Resolved),
        ],
        backgroundColor: [C.Red, C.Amber, C.Green],
        hoverBackgroundColor: [C.RedHover, C.AmberHover, C.GreenHover],
        borderWidth: 2, borderColor: C.White,
      }]
    };
    this.observationsStatusChartOptions = {
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } } },
      maintainAspectRatio: false, cutout: '60%',
    };
    this.observationsStatusLegend = [
      { label: this.openLabel,         value: countBy(observations, 'status', OS.Open),        color: C.Red },
      { label: this.underReviewLabel, value: countBy(observations, 'status', OS.UnderReview), color: C.Amber },
      { label: this.resolvedLabel,     value: countBy(observations, 'status', OS.Resolved),    color: C.Green },
    ];

  }

  getFindingStatusSeverity(status: string): DashboardTagSeverity {
    return FINDING_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getRiskSeverity(risk: string): DashboardTagSeverity {
    return RISK_SEVERITY[risk] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getEvidenceStatusSeverity(status: string): DashboardTagSeverity {
    return EVIDENCE_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getObservationRiskSeverity(risk: string): DashboardTagSeverity {
    return RISK_SEVERITY[risk] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getObservationStatusSeverity(status: string): DashboardTagSeverity {
    return OBSERVATION_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getCommentStatusSeverity(status: string): DashboardTagSeverity {
    return COMMENT_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  isHighRiskRow(risk: string): boolean {
    return risk === R.High || risk === R.Critical;
  }
}
