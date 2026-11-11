import { Component, Input, LOCALE_ID, OnInit, computed, inject } from '@angular/core';
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
import { Evidence } from '@/app/features/audits/audit-execution/evidence/list/evidence-list.component';
import { Observation, type ObservationStatus } from '@/app/features/audits/audit-execution/observation/list/observation-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import { MOCK_FINDINGS, RichAuditFinding } from '@/app/features/audits/audit-execution/findings/audit-finding-data';
import { FindingStatus } from '@/app/features/audits/audit-execution/findings/services/audit-finding.service';
import { LayoutService } from '@/app/layout/service/layout.service';
import {
  PendingItem, type PendingStatus,
  getPendingItemsByType,
} from '@/app/features/admin/review/execution-requests/list/execution-requests-list.component';
import { ApprovalRow, SummaryCard } from '@/app/features/admin/auditor-dashboard/models/auditor-review.model';
import {
  AUDITOR_DASHBOARD_DATE_FORMAT,
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AUDITOR_DASHBOARD_DRAWER_WIDTHS,
  AUDITOR_DASHBOARD_EMPTY_VALUE,
  AUDITOR_DASHBOARD_PAGE_SIZES,
  AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
  AUDITOR_DASHBOARD_ROUTES,
  AUDITOR_PENDING_EVIDENCE_TYPE,
  AuditorApprovalRowTypes,
  AuditorFindingViews,
  AuditorPendingQueueStatuses,
  AuditorReviewBuckets,
  AuditorReviewTypes,
} from '../../constants/auditor-dashboard.constants';
import {
  APPROVAL_TYPE_SEVERITY,
  DASHBOARD_COLORS,
  DASHBOARD_DEFAULT_SEVERITY,
  DASHBOARD_THEME_FALLBACKS,
  PENDING_STATUS_LABELS,
  PENDING_TO_OBSERVATION_STATUS,
  REVIEW_STATUS_SEVERITY,
  type DashboardTagSeverity,
} from '../../constants/auditor-dashboard-labels.constants';

const C = DASHBOARD_COLORS;
const T = AuditorApprovalRowTypes;
const B = AuditorReviewBuckets;
const EMPTY = AUDITOR_DASHBOARD_EMPTY_VALUE;

/**
 * Findings that are actually awaiting a reviewer/approver action — matches
 * the '/findings?view=pending' drill-through in findings-list.component.ts
 * exactly, so this tab's counts never disagree with the list they open.
 * Excludes still-drafting findings ('open'/'rejected') and already-finalised
 * ones ('verified'/'closed').
 */
const FINDING_PENDING_REVIEW_STATUSES: FindingStatus[] = ['in-progress'];
const FINDING_PENDING_APPROVAL_STATUSES: FindingStatus[] = ['responded', 'escalated', 'overdue'];
const FINDING_REVIEW_STATUSES: FindingStatus[] = [...FINDING_PENDING_REVIEW_STATUSES, ...FINDING_PENDING_APPROVAL_STATUSES];

const PENDING_STATUS_LABEL = PENDING_STATUS_LABELS;

/** The pending-approvals queue statuses counted into each review bucket. */
const PENDING_REVIEW: PendingStatus = AuditorPendingQueueStatuses.PendingReview;
const PENDING_APPROVAL: PendingStatus = AuditorPendingQueueStatuses.PendingApproval;
const PENDING_SUBMITTED: PendingStatus = AuditorPendingQueueStatuses.Submitted;

@Component({
  selector: 'app-auditor-reviews-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, DonutStatusChartComponent, DrawIconComponent],
  templateUrl: './auditor-reviews-tab.component.html',
  styleUrl: './auditor-reviews-tab.component.scss',
})
export class AuditorReviewsTabComponent implements OnInit {

  @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  readonly PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.Reviews;

  private readonly drawer = inject(RightDrawerService);
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  private readonly locale = inject(LOCALE_ID);

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

  reviewsByTypeBarData: any;

  readonly reviewsByTypeBarOptions = computed(() => {
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
      datasets: {
        bar: {
          barPercentage: 0.35,
          categoryPercentage: 0.412,
        },
      },
    };
  });

  reviewStatusBarData: any;

  readonly reviewStatusBarOptions = computed(() => {
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
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
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

  reviewStatusLegend: DonutLegendItem[] = [];
  reviewsByTypeLegend: DonutLegendItem[] = [];


  
  /** Highlights the hovered category's full column, matching the Audits by Department chart. */
  private readonly reviewsByTypeHoverBandPlugin = {
    id: 'reviewsByTypeHoverBand',
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

  readonly reviewsByTypeHoverBandPlugins = [this.reviewsByTypeHoverBandPlugin];

  /** Highlights the hovered category's full column, matching the Audits by Department chart. */
  private readonly reviewStatusHoverBandPlugin = {
    id: 'reviewStatusHoverBand',
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

  readonly reviewStatusHoverBandPlugins = [this.reviewStatusHoverBandPlugin];
  /**
   * Stat cards, charts and the workflow table are all built ONCE here (not
   * as template getters) so p-table gets a stable `[value]` array reference
   * — a getter re-evaluated on every change-detection tick fed p-table a
   * brand-new array every cycle, which reset its internal state on the fly
   * and made the row "view" button's click silently fail to open a drawer.
   */
  summaryCards: SummaryCard[] = [];
  approvalWorkflow: ApprovalRow[] = [];

  ngOnInit(): void {
    const reviewFindings = MOCK_FINDINGS.filter(f => FINDING_REVIEW_STATUSES.includes(f.status));
    const reviewObservations = getPendingItemsByType(AuditorReviewTypes.Observation);
    const reviewEvidence = getPendingItemsByType(AuditorReviewTypes.Evidence);

    const findingsCount = reviewFindings.length;
    const observationCount = reviewObservations.length;
    const evidenceCount = reviewEvidence.length;

    this.summaryCards = [
      { label: $localize`:@@admin.auditorReviews.totalPendingReviews:Total Pending Reviews`, value: String(findingsCount + observationCount + evidenceCount), icon: 'pi pi-inbox', cardClass: '' },
      { label: $localize`:@@admin.auditorReviews.findingsReviews:Findings Reviews`, value: String(findingsCount), icon: 'pi pi-exclamation-circle', cardClass: 'stat--danger', reviewType: AuditorReviewTypes.Finding },
      { label: $localize`:@@admin.auditorReviews.observationReviews:Observation Reviews`, value: String(observationCount), icon: 'pi pi-eye', cardClass: 'stat--warning', reviewType: AuditorReviewTypes.Observation },
      { label: $localize`:@@admin.auditorReviews.evidenceReviews:Evidence Reviews`, value: String(evidenceCount), icon: 'pi pi-paperclip', cardClass: 'stat--info', reviewType: AuditorReviewTypes.Evidence },
    ];

    const findingRows: ApprovalRow[] = reviewFindings.map(f => {
      const bucket = FINDING_PENDING_REVIEW_STATUSES.includes(f.status) ? B.PendingReview : B.PendingApproval;
      return {
        item: $localize`:@@admin.auditorReviews.findingItem:Finding: ${f.title}:FINDING_TITLE:`,
        type: T.Finding,
        submittedOn: f.createdAt ? this.formatDate(f.createdAt) : EMPTY,
        currentStage: bucket,
        status: bucket,
        findingDetail: this.toFindingProfileData(f),
      };
    });

    const observationRows: ApprovalRow[] = reviewObservations.map(i => ({
      item: $localize`:@@admin.auditorReviews.observationItem:Observation: ${i.title}:OBSERVATION_TITLE:`,
      type: T.Observation,
      submittedOn: this.formatDate(i.submittedDate),
      currentStage: PENDING_STATUS_LABEL[i.status],
      status: PENDING_STATUS_LABEL[i.status],
      observationDetail: this.toObservationDetail(i),
    }));

    const evidenceRows: ApprovalRow[] = reviewEvidence.map(i => ({
      item: $localize`:@@admin.auditorReviews.evidenceItem:Evidence: ${i.title}:EVIDENCE_TITLE:`,
      type: T.Evidence,
      submittedOn: this.formatDate(i.submittedDate),
      currentStage: PENDING_STATUS_LABEL[i.status],
      status: PENDING_STATUS_LABEL[i.status],
      evidenceDetail: this.toEvidenceDetail(i),
    }));

    this.approvalWorkflow = [...findingRows, ...observationRows, ...evidenceRows];

    const typeLabels = [$localize`:@@common.finding:Finding`, $localize`:@@common.observation:Observation`, $localize`:@@common.evidence:Evidence`];
    const reviewsLabel = $localize`:@@admin.auditorReviews.reviews:Reviews`;
    const typeColors = [C.Blue, C.Red, C.Amber];
    const typeData = [findingsCount, observationCount, evidenceCount];

    this.reviewsByTypeBarData = {
      labels: typeLabels,
      datasets: [{ label: reviewsLabel, data: typeData, backgroundColor: typeColors, borderRadius: 6 }]
    };
    this.reviewsByTypeLegend = typeLabels.map((label, i) => ({ label, value: typeData[i], color: typeColors[i] }));

    const statusLabels = [$localize`:@@common.pendingReview:Pending Review`, $localize`:@@common.pendingApproval:Pending Approval`, $localize`:@@common.submitted:Submitted`];
    const statusColors = [C.Blue, C.Amber, C.Slate];
    const statusData = [
      reviewFindings.filter(f => FINDING_PENDING_REVIEW_STATUSES.includes(f.status)).length
      + reviewObservations.filter(i => i.status === PENDING_REVIEW).length
      + reviewEvidence.filter(i => i.status === PENDING_REVIEW).length,
      reviewFindings.filter(f => FINDING_PENDING_APPROVAL_STATUSES.includes(f.status)).length
      + reviewObservations.filter(i => i.status === PENDING_APPROVAL).length
      + reviewEvidence.filter(i => i.status === PENDING_APPROVAL).length,
      reviewObservations.filter(i => i.status === PENDING_SUBMITTED).length
      + reviewEvidence.filter(i => i.status === PENDING_SUBMITTED).length,
    ];

    this.reviewStatusBarData = {
      labels: statusLabels,
      datasets: [{ label: $localize`:@@admin.auditorReviews.reviews:Reviews`, data: statusData, backgroundColor: statusColors, borderRadius: 6 }]
    };
    this.reviewStatusLegend = statusLabels.map((label, i) => ({ label, value: statusData[i], color: statusColors[i] }));
  }

  onSummaryCardClick(card: SummaryCard): void {
    if (card.reviewType === AuditorReviewTypes.Finding) {
      this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], { queryParams: { [QP.View]: AuditorFindingViews.Pending } });
    } else if (card.reviewType === AuditorReviewTypes.Observation || card.reviewType === AuditorReviewTypes.Evidence) {
      this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ApprovalList], { queryParams: { [QP.Type]: card.reviewType } });
    } else {
      this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ApprovalList]);
    }
  }

  private formatDate(d: Date): string {
    return new Intl.DateTimeFormat(this.locale, AUDITOR_DASHBOARD_DATE_FORMAT).format(d);
  }

  private toFindingProfileData(f: RichAuditFinding): FindingProfileData {
    return {
      id: f.id, title: f.title, severity: f.severity, status: f.status,
      subDivision: f.subDivision, scope: f.scope, subscope: f.subscope,
      taskId: f.taskId, company: f.company, division: f.division, risk: f.risk,
      dueDate: f.dueDate, createdAt: f.createdAt, owner: f.owner,
      description: f.description, observationIds: f.observationIds,
      documents: f.documents, financialImpact: f.financialImpact,
      isRepeated: f.isRepeated, flaggedForEscalation: f.flaggedForEscalation,
      daysOverdue: f.daysOverdue,
    };
  }

  /** Best-effort mapping — PendingItem doesn't carry every field the
   *  Observation model does (scope/subscope/task/finding linkage), so those
   *  fall back to placeholders until the pending-approvals queue tracks them. */
  private toObservationDetail(i: PendingItem): Observation {
    return {
      id: i.id, title: i.title, description: i.description, riskRating: i.riskRating,
      scope: EMPTY, subscope: EMPTY, taskId: i.linkedId ?? EMPTY,
      findingTitle: i.linkedId ?? EMPTY, evidenceIds: [],
      status: PENDING_TO_OBSERVATION_STATUS[i.status],
      auditor: i.submittedBy, createdDate: i.submittedDate,
      company: i.company, division: i.division, subDivision: i.subDivision,
    };
  }

  /** Same best-effort mapping as {@link toObservationDetail}, for the Evidence model. */
  private toEvidenceDetail(i: PendingItem): Evidence {
    return {
      id: i.id, title: i.title, evidenceType: AUDITOR_PENDING_EVIDENCE_TYPE,
      scope: EMPTY, subscope: EMPTY, taskId: i.linkedId ?? EMPTY,
      taskTitle: EMPTY, findingId: i.linkedId ?? '', findingTitle: EMPTY,
      createdDate: i.submittedDate, files: [],
      description: i.description, uploadedBy: i.submittedBy,
      company: i.company, branch: i.division, department: i.subDivision,
    };
  }

  openApprovalDrawer(row: ApprovalRow): void {
    if (row.type === T.Evidence && row.evidenceDetail) {
      this.drawer.open<EvidenceProfileComponent, EvidenceDetailDrawerData>(
        EvidenceProfileComponent,
        { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Evidence, data: { evidence: row.evidenceDetail } },
      );
    } else if (row.type === T.Finding && row.findingDetail) {
      this.drawer.open<FindingsProfileComponent, FindingProfileData>(
        FindingsProfileComponent,
        { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Finding, data: row.findingDetail },
      );
    } else if (row.type === T.Observation && row.observationDetail) {
      this.drawer.open<ObservationProfileComponent, ObservationDetailDrawerData>(
        ObservationProfileComponent,
        { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.Observation, data: { observation: row.observationDetail } },
      );
    }
  }

  getApprovalTypeSeverity(type: string): DashboardTagSeverity {
    return APPROVAL_TYPE_SEVERITY[type] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getReviewStatusSeverity(status: string): DashboardTagSeverity {
    return REVIEW_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  reviewStatusLabel(status: string): string {
    switch (status) {
      case PENDING_STATUS_LABEL.pending_review:
        return $localize`:@@common.pendingReview:Pending Review`;
      case PENDING_STATUS_LABEL.pending_approval:
        return $localize`:@@common.pendingApproval:Pending Approval`;
      case PENDING_STATUS_LABEL.submitted:
        return $localize`:@@common.submitted:Submitted`;
      case PENDING_STATUS_LABEL.approved:
        return $localize`:@@common.approved:Approved`;
      case PENDING_STATUS_LABEL.rejected:
        return $localize`:@@common.rejected:Rejected`;
      default:
        return status;
    }
  }

  reviewTypeLabel(type: string): string {
    switch (type) {
      case T.Finding:
        return $localize`:@@common.finding:Finding`;
      case T.Observation:
        return $localize`:@@common.observation:Observation`;
      case T.Evidence:
        return $localize`:@@common.evidence:Evidence`;
      default:
        return type;
    }
  }
}