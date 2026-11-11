import { Component, Input, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import { countActivePlansForAuditor, getActivePlansForAuditor } from '@/app/features/audits/audit-plan/audit-plan/list/audit-plan-list.component';
import { countScopesForAuditor } from '@/app/features/audits/audit-plan/scope/list/scope-list.component';
import { getAllEnrichedRfis } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { countOpenFindingsForAuditor, countRepeatedFindingsForAuditor } from '@/app/features/audits/audit-execution/findings/list/findings-list.component';
import { countPendingWorkingPapersForAuditor } from '@/app/features/audits/audit-execution/working-papers/list/working-papers-list.component';
import { countTasksForAuditor } from '@/app/features/audits/audit-plan/scope-task/list/scope-task-list.component';
import { MOCK_NOTIFICATIONS, NotificationItem } from '@/app/features/audits/audit-calendar/notifications/manage/notifications.components';
import {  DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { KpiCard } from '@/app/features/admin/auditor-dashboard/models/auditor-overview.model';
import { RfiStatuses } from '@/app/features/audits/audit-execution/rfi/constants/rfi.constants';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  AUDIT_PLAN_IN_PROGRESS_STATUS,
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AUDITOR_DASHBOARD_OPEN_ADD_TRUE,
  AUDITOR_DASHBOARD_PAGE_SIZES,
  AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
  AUDITOR_DASHBOARD_ROUTES,
  AUDITOR_NOTIFICATION_FILTER,
  AUDITOR_NOTIFICATION_KEYWORDS,
  AUDITOR_PROGRESS_THRESHOLDS,
  AUDITOR_TASK_LIST_STATUS_PARAMS,
  AUDITOR_TASK_ROW_VALUES,
  AuditorFindingViews,
  AuditorKpiActions,
  AuditorQuickActions,
  AuditorTaskCountBuckets,
  AuditorWorkingPaperStatuses,
  TIME_AGO,
} from '../../constants/auditor-dashboard.constants';
import {
  DASHBOARD_COLORS,
  DASHBOARD_DEFAULT_SEVERITY,
  DEADLINE_TYPE_CONFIG,
  DEADLINE_TYPE_DEFAULT_CONFIG,
  MOCK_AUDITOR_DEADLINES,
  MOCK_TASK_STATUS_COUNTS,
  NOTIFICATION_ICONS,
  NotificationTones,
  PRIORITY_SEVERITY,
  type DashboardTagSeverity,
} from '../../constants/auditor-dashboard-labels.constants';

@Component({
  selector: 'app-auditor-overview-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, PaginatorModule, DrawIconComponent, DonutStatusChartComponent],
  templateUrl: './auditor-overview-tab.component.html',
  styleUrl: './auditor-overview-tab.component.scss',
})
export class AuditorOverviewTabComponent {

  private readonly router = inject(Router);

  /** The auditor this dashboard is scoped to — hardcoded by the parent dashboard for now. */
  @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  readonly TASK_ROW_VALUES = AUDITOR_TASK_ROW_VALUES;
  readonly DEADLINES_PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.Deadlines;

  /**
   * Stat cards for the current auditor — each one drills down into a
   * filtered list.
   */
  get kpiCards(): KpiCard[] {
    const { id, name } = this.currentAuditor;
    return [
      { label: $localize`:@@admin.auditorOverview.myActiveAudits:My Active Audits`,        value: String(countActivePlansForAuditor(name)),                    icon: 'pi pi-briefcase',           cardClass: '', action: AuditorKpiActions.ActiveAudits },
      { label: $localize`:@@admin.auditorOverview.assignedScopes:Assigned Scopes`,        value: String(countScopesForAuditor(id, ScopeLevels.Scope)),        icon: 'pi pi-list',                cardClass: '', action: AuditorKpiActions.AssignedScopes },
      { label: $localize`:@@admin.auditorOverview.assignedSubScopes:Assigned Sub-scopes`,     value: String(countScopesForAuditor(id, ScopeLevels.SubScope)),     icon: 'pi pi-sitemap',             cardClass: '', action: AuditorKpiActions.AssignedSubScopes },
      { label: $localize`:@@admin.auditorOverview.openTasks:Open Tasks`,              value: String(countTasksForAuditor(id, AuditorTaskCountBuckets.Open) + countTasksForAuditor(id, AuditorTaskCountBuckets.InProgress)), icon: 'pi pi-check-square',        cardClass: '', action: AuditorKpiActions.OpenTasks },
      { label: $localize`:@@admin.auditorOverview.tasksDueToday:Tasks Due Today`,         value: String(countTasksForAuditor(id, AuditorTaskCountBuckets.DueToday)), icon: 'pi pi-calendar',            cardClass: 'stat--warning', action: AuditorKpiActions.TasksDueToday },
      { label: $localize`:@@admin.auditorOverview.overdueTasks:Overdue Tasks`,          value: String(countTasksForAuditor(id, AuditorTaskCountBuckets.Overdue)),  icon: 'pi pi-exclamation-triangle', cardClass: 'stat--danger', action: AuditorKpiActions.OverdueTasks },
      { label: $localize`:@@admin.auditorOverview.pendingRfiResponses:Pending RFI Responses`,   value: String(this.pendingRfiCount()),                              icon: 'pi pi-file',                cardClass: 'stat--warning', action: AuditorKpiActions.PendingRfi },
      { label: $localize`:@@admin.auditorOverview.openFindings:Open Findings`,           value: String(countOpenFindingsForAuditor(id)),                     icon: 'pi pi-exclamation-circle',  cardClass: 'stat--danger', action: AuditorKpiActions.OpenFindings },
      { label: $localize`:@@admin.auditorOverview.repeatedFindings:Repeated Findings`,   value: String(countRepeatedFindingsForAuditor(id)),                 icon: 'pi pi-replay',              cardClass: 'stat--orange', action: AuditorKpiActions.RepeatedFindings },
      { label: $localize`:@@admin.auditorOverview.workingPapersPending:Working Papers Pending`,  value: String(countPendingWorkingPapersForAuditor(name)),           icon: 'pi pi-file-edit',           cardClass: '', action: AuditorKpiActions.WorkingPapersPending },
    ];
  }

  private pendingRfiCount(): number {
    const id = this.currentAuditor.id;
    return getAllEnrichedRfis().filter(r => r.auditorIds?.includes(id) && r.status === RfiStatuses.Pending).length;
  }


  readonly workDistLegend: DonutLegendItem[] = [
    { label: $localize`:@@admin.auditorOverview.activeAudits:Active Audits`,   value: countActivePlansForAuditor(this.currentAuditor.name),  color: DASHBOARD_COLORS.Blue },
    { label: $localize`:@@admin.auditorOverview.assignedScopes:Assigned Scopes`, value: countScopesForAuditor(this.currentAuditor.id, ScopeLevels.Scope),  color: DASHBOARD_COLORS.Green },
    { label: $localize`:@@admin.auditorOverview.subScopes:Sub-scopes`,      value: countScopesForAuditor(this.currentAuditor.id, ScopeLevels.SubScope), color: DASHBOARD_COLORS.Amber },
    { label: $localize`:@@admin.auditorOverview.openFindings:Open Findings`,   value: countOpenFindingsForAuditor(this.currentAuditor.id),   color: DASHBOARD_COLORS.Red },
    { label: $localize`:@@admin.auditorOverview.pendingRfis:Pending RFIs`,    value: this.pendingRfiCount(),            color: DASHBOARD_COLORS.Violet },
  ];

  readonly taskStatusLegend: DonutLegendItem[] = [
    { label: $localize`:@@common.notStarted:Not Started`, value: MOCK_TASK_STATUS_COUNTS.NotStarted, color: DASHBOARD_COLORS.Slate },
    { label: $localize`:@@common.inProgress:In Progress`, value: MOCK_TASK_STATUS_COUNTS.InProgress, color: DASHBOARD_COLORS.Blue },
    { label: $localize`:@@common.completed:Completed`, value: MOCK_TASK_STATUS_COUNTS.Completed, color: DASHBOARD_COLORS.Green },
    { label: $localize`:@@common.overdue:Overdue`, value: MOCK_TASK_STATUS_COUNTS.Overdue, color: DASHBOARD_COLORS.Red },
    { label: $localize`:@@common.blocked:Blocked`, value: MOCK_TASK_STATUS_COUNTS.Blocked, color: DASHBOARD_COLORS.Amber },
  ];

  /** Same scope as the "My Active Audits" KPI card — the auditor's in-progress plans. */
  get auditProgress() {
    return getActivePlansForAuditor(this.currentAuditor.name);
  }

  deadlines = MOCK_AUDITOR_DEADLINES;

  /** Sourced from the shared notifications mock data, scoped to this auditor's portal. */
  get notifications() {
    return MOCK_NOTIFICATIONS
      .filter(n => n.audience === AUDITOR_NOTIFICATION_FILTER.Audience && n.status === AUDITOR_NOTIFICATION_FILTER.Status)
      .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
      .map(n => ({
        icon: n.senderType === AUDITOR_NOTIFICATION_FILTER.SystemSender ? NOTIFICATION_ICONS.System : NOTIFICATION_ICONS.User,
        text: n.subject,
        time: this.timeAgo(n.dateTime),
        type: this.notifType(n),
      }));
  }

  private timeAgo(dateTime: string): string {
    const then = new Date(dateTime.replace(' ', 'T')).getTime();
    const minutes = Math.floor((Date.now() - then) / TIME_AGO.MsPerMinute);
    if (minutes < 1) { return $localize`:@@common.justNow:Just now`; }
    if (minutes < TIME_AGO.MinutesPerHour) { return $localize`:@@admin.auditorOverview.minutesAgo:${minutes} min ago`; }
    const hours = Math.floor(minutes / TIME_AGO.MinutesPerHour);
    if (hours < TIME_AGO.HoursPerDay) { return hours === 1 ? $localize`:@@common.hourAgo:${hours} hr ago` : $localize`:@@admin.auditorOverview.hoursAgo:${hours} hrs ago`; }
    const days = Math.floor(hours / TIME_AGO.HoursPerDay);
    if (days === 1) { return $localize`:@@common.yesterday:Yesterday`; }
    if (days < TIME_AGO.DaysPerMonth) { return $localize`:@@admin.auditorOverview.daysAgo:${days} days ago`; }
    const months = Math.floor(days / TIME_AGO.DaysPerMonth);
    return months === 1 ? $localize`:@@common.monthAgo:${months} month ago` : $localize`:@@admin.auditorOverview.monthsAgo:${months} months ago`;
  }

  private notifType(n: NotificationItem): 'info' | 'warn' | 'success' | 'danger' {
    const s = n.subject.toLowerCase();
    const has = (words: readonly string[]) => words.some(w => s.includes(w));
    if (has(AUDITOR_NOTIFICATION_KEYWORDS.Danger)) return NotificationTones.Danger;
    if (has(AUDITOR_NOTIFICATION_KEYWORDS.Warn)) return NotificationTones.Warn;
    if (has(AUDITOR_NOTIFICATION_KEYWORDS.Success)) return NotificationTones.Success;
    return NotificationTones.Info;
  }

  quickActions = [
    { label: $localize`:@@admin.auditorOverview.openAssignedAudit:Open Assigned Audit`,  icon: 'pi pi-folder-open',       severity: 'primary',   action: AuditorQuickActions.OpenAssignedAudit },
    { label: $localize`:@@admin.auditorOverview.raiseFinding:Raise Finding`,        icon: 'pi pi-exclamation-circle', severity: 'danger',    action: AuditorQuickActions.RaiseFinding },
    { label: $localize`:@@admin.auditorOverview.sendRfi:Send RFI`,             icon: 'pi pi-send',               severity: 'info',      action: AuditorQuickActions.SendRfi },
    { label: $localize`:@@admin.auditorOverview.uploadWorkingPaper:Upload Working Paper`, icon: 'pi pi-upload',             severity: 'secondary', action: AuditorQuickActions.UploadWorkingPaper },
  ];

  // Notification paginator
  notifFirst = 0;
  notifRows: number = AUDITOR_DASHBOARD_PAGE_SIZES.Notifications;

  get pagedNotifications() {
    return this.notifications.slice(this.notifFirst, this.notifFirst + this.notifRows);
  }

  onNotifPageChange(event: any): void {
    this.notifFirst = event.first ?? 0;
  }

  // Audit progress paginator
  auditFirst = 0;
  auditRows: number = AUDITOR_DASHBOARD_PAGE_SIZES.AuditProgress;

  get pagedAuditProgress() {
    return this.auditProgress.slice(this.auditFirst, this.auditFirst + this.auditRows);
  }

  onAuditPageChange(event: any): void {
    this.auditFirst = event.first ?? 0;
  }

  /**
   * Handles clicks on KPI cards.
   *  • "My Active Audits"       → audit plan list, in-progress plans for the auditor.
   *  • "Assigned Scopes"        → scope management, scopes assigned to the auditor.
   *  • "Assigned Sub-scopes"    → scope management, sub-scopes assigned to the auditor.
   *  • "Pending RFI Responses"  → RFI management, pending RFIs for the auditor.
   */
  onKpiClick(card: KpiCard): void {
    const { id, name } = this.currentAuditor;
    
    switch (card.action) {
      case AuditorKpiActions.ActiveAudits:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditPlanList], {
          queryParams: {
            [QP.Status]: AUDIT_PLAN_IN_PROGRESS_STATUS,
            [QP.AuditorId]: name,
          },
        });
        break;

      case AuditorKpiActions.AssignedScopes:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditScope], {
          queryParams: {
            [QP.AuditorId]: id,
            [QP.ScopeLevel]: ScopeLevels.Scope,
          },
        });
        break;

      case AuditorKpiActions.AssignedSubScopes:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditScope], {
          queryParams: {
            [QP.AuditorId]: id,
            [QP.ScopeLevel]: ScopeLevels.SubScope,
          },
        });
        break;

      case AuditorKpiActions.PendingRfi:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ManageRfi], {
          queryParams: {
            [QP.Status]: RfiStatuses.Pending,
            [QP.AuditorId]: id,
          },
        });
        break;

      case AuditorKpiActions.WorkingPapersPending:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.WorkingPapers], {
          queryParams: {
            [QP.Status]: AuditorWorkingPaperStatuses.Pending,
            [QP.AuditorId]: name,
          },
        });
        break;

      case AuditorKpiActions.OpenFindings:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], {
          queryParams: {
            [QP.View]: AuditorFindingViews.Open,
            [QP.AuditorId]: id,
          },
        });
        break;

      case AuditorKpiActions.RepeatedFindings:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], {
          queryParams: {
            [QP.View]: AuditorFindingViews.Repeated,
            [QP.AuditorId]: id,
          },
        });
        break;

      case AuditorKpiActions.OpenTasks:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { [QP.AuditorId]: id, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.OpenAndInProgress } });
        break;

      case AuditorKpiActions.TasksDueToday:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { [QP.AuditorId]: id, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.DueToday } });
        break;

      case AuditorKpiActions.OverdueTasks:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { [QP.AuditorId]: id, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.Overdue } });
        break;
    }
  }

  /**
   * Handles clicks on the Quick Actions buttons.
   *  • "Open Assigned Audit"  → same destination as the "My Active Audits" KPI card.
   *  • "Raise Finding"        → Findings list, with the Add Finding drawer opened.
   *  • "Send RFI"             → RFI Management list, with the Add RFI drawer opened.
   *  • "Upload Working Paper" → Working Papers list, with the Add Working Paper drawer opened.
   */
  onQuickAction(action?: string): void {
    const { id, name } = this.currentAuditor;
    switch (action) {
      case AuditorQuickActions.OpenAssignedAudit:
        this.onKpiClick({ label: $localize`:@@admin.auditorOverview.myActiveAudits:My Active Audits`, value: '', icon: '', cardClass: '', action: AuditorKpiActions.ActiveAudits });
        break;

      case AuditorQuickActions.RaiseFinding:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], {
          queryParams: {
            [QP.AuditorId]: id,
            [QP.OpenAdd]: AUDITOR_DASHBOARD_OPEN_ADD_TRUE,
          },
        });
        break;

      case AuditorQuickActions.SendRfi:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ManageRfi], {
          queryParams: {
            [QP.AuditorId]: id,
            [QP.OpenAdd]: AUDITOR_DASHBOARD_OPEN_ADD_TRUE,
          },
        });
        break;

      case AuditorQuickActions.UploadWorkingPaper:
        this.router.navigate([AUDITOR_DASHBOARD_ROUTES.WorkingPapers], {
          queryParams: {
            [QP.AuditorId]: name,
            [QP.OpenAdd]: AUDITOR_DASHBOARD_OPEN_ADD_TRUE,
          },
        });
        break;
    }
  }

  /**
   * Both charts below are built from the exact same helper calls used for
   * the KPI cards (see kpiCards() and pendingRfiCount() above), so their
   * slices always add up to what the stat cards show.
   */
  

  getPrioritySeverity(priority: string): DashboardTagSeverity {
    return PRIORITY_SEVERITY[priority] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getTypeConfig(type: string): { icon: string; cls: string } {
    return DEADLINE_TYPE_CONFIG[type] ?? DEADLINE_TYPE_DEFAULT_CONFIG;
  }

  getProgressColor(progress: number): string {
    const t = AUDITOR_PROGRESS_THRESHOLDS.Overview;
    if (progress >= t.Good) return DASHBOARD_COLORS.Green;
    if (progress >= t.Fair) return DASHBOARD_COLORS.Amber;
    return DASHBOARD_COLORS.Red;
  }
}
