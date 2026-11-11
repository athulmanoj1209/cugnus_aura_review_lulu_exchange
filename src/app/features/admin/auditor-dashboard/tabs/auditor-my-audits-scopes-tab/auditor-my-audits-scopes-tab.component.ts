import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import { getAllPlansForAuditor } from '@/app/features/audits/audit-plan/audit-plan/list/audit-plan-list.component';
import {
  countScopesForAuditorByStatus,
  getScopeRowsForAuditor,
} from '@/app/features/audits/audit-plan/scope/list/scope-list.component';
import { getTaskRowsForAuditor } from '@/app/features/audits/audit-plan/scope-job/profile/scope-job-profile.component';
import { LayoutService } from '@/app/layout/service/layout.service';
import { ScopeSummaryCard } from '@/app/features/admin/auditor-dashboard/models/auditor-scope.model';
import { ScopeLevels, ScopeWorkflowStatuses } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AUDITOR_DASHBOARD_EMPTY_VALUE,
  AUDITOR_DASHBOARD_PAGE_SIZES,
  AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
  AUDITOR_DASHBOARD_ROUTES,
  AUDITOR_PROGRESS_THRESHOLDS,
  AUDITOR_TASK_ROW_VALUES,
  AuditorTaskFilters,
} from '../../constants/auditor-dashboard.constants';
import {
  DASHBOARD_COLORS,
  DASHBOARD_DEFAULT_SEVERITY,
  DASHBOARD_THEME_FALLBACKS,
  MOCK_SCOPE_TREND_DATA,
  PRIORITY_SEVERITY,
  SCOPE_STATUS_SEVERITY,
  type DashboardTagSeverity,
} from '../../constants/auditor-dashboard-labels.constants';

@Component({
  selector: 'app-auditor-my-audits-scopes-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, DonutStatusChartComponent, DrawIconComponent],
  templateUrl: './auditor-my-audits-scopes-tab.component.html',
  styleUrl: './auditor-my-audits-scopes-tab.component.scss',
})
export class AuditorMyAuditsScopesTabComponent implements OnInit {

  @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  readonly PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.Default;
  readonly SUB_SCOPES_PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.SubScopes;
  readonly TASK_ROW_VALUES = AUDITOR_TASK_ROW_VALUES;

  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);

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

  // NOTE: 'All' never equals the chip key AuditorTaskFilters.All ('all'), so no chip is
  // highlighted on load (the list still shows every task) — kept as-is, flagged.
  taskFilter = 'All';
  readonly taskFilterOptions = [
    { key: AuditorTaskFilters.All, label: $localize`:@@common.all:All` },
    { key: AuditorTaskFilters.DueToday, label: $localize`:@@common.dueToday:Due Today` },
    { key: AuditorTaskFilters.HighPriority, label: $localize`:@@common.highPriority:High Priority` },
    { key: AuditorTaskFilters.Overdue, label: $localize`:@@common.overdue:Overdue` },
    { key: AuditorTaskFilters.Completed, label: $localize`:@@common.completed:Completed` },
  ];

  readonly scopeStatusLegend: DonutLegendItem[] = [
    { label: $localize`:@@common.completed:Completed`,   value: countScopesForAuditorByStatus(this.currentAuditor.id, ScopeWorkflowStatuses.Completed), color: DASHBOARD_COLORS.Green },
    { label: $localize`:@@common.inProgress:In Progress`, value: countScopesForAuditorByStatus(this.currentAuditor.id, ScopeWorkflowStatuses.InProgress), color: DASHBOARD_COLORS.Blue },
    { label: $localize`:@@common.pending:Pending`,     value: countScopesForAuditorByStatus(this.currentAuditor.id, ScopeWorkflowStatuses.PendingReview), color: DASHBOARD_COLORS.Slate },
    { label: $localize`:@@common.overdue:Overdue`,     value: countScopesForAuditorByStatus(this.currentAuditor.id, ScopeWorkflowStatuses.Overdue), color: DASHBOARD_COLORS.Red },
  ];

  scopeTrendChartData: any;

  readonly scopeTrendChartOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 12 }, color: c.textSecondary } } },
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: c.surfaceBorder } },
      }
    };
  });

  get scopeSummaryCards(): ScopeSummaryCard[] {
    const id = this.currentAuditor.id;
    return [
      { label: $localize`:@@admin.auditorMyAuditsScopes.totalScopes:Total Scopes`,   value: String(countScopesForAuditorByStatus(id, null)),               icon: 'pi pi-list',                cardClass: '' },
      { label: $localize`:@@common.completed:Completed`,      value: String(countScopesForAuditorByStatus(id, ScopeWorkflowStatuses.Completed)),  icon: 'pi pi-check-circle',        cardClass: 'stat--success', status: ScopeWorkflowStatuses.Completed },
      { label: $localize`:@@common.inProgress:In Progress`,    value: String(countScopesForAuditorByStatus(id, ScopeWorkflowStatuses.InProgress)), icon: 'pi pi-spinner',             cardClass: '',              status: ScopeWorkflowStatuses.InProgress },
      { label: $localize`:@@common.notStarted:Not Started`,    value: String(countScopesForAuditorByStatus(id, ScopeWorkflowStatuses.NotStarted)), icon: 'pi pi-clock',               cardClass: '',              status: ScopeWorkflowStatuses.NotStarted },
      { label: $localize`:@@admin.auditorMyAuditsScopes.overdueScopes:Overdue Scopes`, value: String(countScopesForAuditorByStatus(id, ScopeWorkflowStatuses.Overdue)), icon: 'pi pi-exclamation-triangle', cardClass: 'stat--danger', status: ScopeWorkflowStatuses.Overdue },
    ];
  }

  /** Clicking a summary card opens Scope Management pre-filtered to this auditor (and status, unless it's "Total Scopes"). */
  onScopeCardClick(card: ScopeSummaryCard): void {
    this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditScope], {
      queryParams: {
        [QP.AuditorId]: this.currentAuditor.id,
        ...(card.status ? { [QP.Status]: card.status } : {}),
      },
    });
  }

  /** Every plan (any status) assigned to this auditor. */
  get myAudits() {
    return getAllPlansForAuditor(this.currentAuditor.name);
  }

  get assignedScopes() {
    return getScopeRowsForAuditor(this.currentAuditor.id, ScopeLevels.Scope);
  }

  get assignedSubScopes() {
    return getScopeRowsForAuditor(this.currentAuditor.id, ScopeLevels.SubScope).map(r => ({
      subScope: r.scope,
      parentScope: r.parentScopeName ?? AUDITOR_DASHBOARD_EMPTY_VALUE,
      status: r.status,
      dueDate: r.dueDate,
    }));
  }

  get allTasks() {
    return getTaskRowsForAuditor(this.currentAuditor.id);
  }

  get filteredTasks() {
    const v = AUDITOR_TASK_ROW_VALUES;
    if (this.taskFilter === AuditorTaskFilters.DueToday)      return this.allTasks.filter(t => t.dueDate === v.DueToday);
    if (this.taskFilter === AuditorTaskFilters.HighPriority)  return this.allTasks.filter(t => t.priority === v.HighPriority);
    if (this.taskFilter === AuditorTaskFilters.Overdue)       return this.allTasks.filter(t => t.status === v.Overdue);
    if (this.taskFilter === AuditorTaskFilters.Completed)     return this.allTasks.filter(t => t.status === v.Completed);
    return this.allTasks;
  }

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    this.scopeTrendChartData = {
      labels: [
        $localize`:@@admin.auditorMyAuditsScopes.week1:Week 1`,
        $localize`:@@admin.auditorMyAuditsScopes.week2:Week 2`,
        $localize`:@@admin.auditorMyAuditsScopes.week3:Week 3`,
        $localize`:@@admin.auditorMyAuditsScopes.week4:Week 4`,
      ],
      datasets: [{
        label: $localize`:@@admin.auditorMyAuditsScopes.scopesCompleted:Scopes Completed`,
        data: MOCK_SCOPE_TREND_DATA,
        borderColor: DASHBOARD_COLORS.Blue,
        backgroundColor: DASHBOARD_COLORS.BlueFill,
        tension: 0.4, fill: true,
        pointBackgroundColor: DASHBOARD_COLORS.Blue,
        pointBorderColor: DASHBOARD_COLORS.White,
        pointBorderWidth: 2,
        pointRadius: 5,
      }]
    };
  }

  getStatusSeverity(status: string): DashboardTagSeverity {
    return SCOPE_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getPrioritySeverity(priority: string): DashboardTagSeverity {
    return PRIORITY_SEVERITY[priority] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getProgressColor(progress: number): string {
    const t = AUDITOR_PROGRESS_THRESHOLDS.Scopes;
    if (progress >= t.Good) return DASHBOARD_COLORS.Green;
    if (progress >= t.Fair) return DASHBOARD_COLORS.Amber;
    return DASHBOARD_COLORS.Red;
  }

  isAlertRow(status: string): boolean {
    return status === ScopeWorkflowStatuses.Overdue;
  }
}
