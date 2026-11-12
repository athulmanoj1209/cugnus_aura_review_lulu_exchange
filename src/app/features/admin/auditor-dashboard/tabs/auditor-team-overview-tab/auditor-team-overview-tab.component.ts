import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { AUDIT_TEAM } from '../../data/audit-team.data';
import { countActivePlansForTeam, getActivePlansForTeam } from '@/app/features/audits/audit-plan/audit-plan/list/audit-plan-list.component';
import { countScopesForTeam } from '@/app/features/audits/audit-plan/scope/list/scope-list.component';
import { countTasksForTeam, getTeamAuditWorkload, getTeamTaskAging, getTeamTaskStatusCounts } from '@/app/features/audits/audit-plan/scope-task/list/scope-task-list.component';
import { countPendingRfisForTeam, getTeamRfiResponseFunnel } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { countOpenFindingsForTeam, countRepeatedFindingsForTeam, getTeamFindingAging, getTeamFindingSeverityCounts, getTeamFindingStatusCounts, TeamFindingCount } from '@/app/features/audits/audit-execution/findings/list/findings-list.component';
import { FINDING_SEVERITY_COLORS } from '@/app/features/audits/audit-execution/findings/constants/findings-labels.constants';
import { countPendingWorkingPapersForTeam } from '@/app/features/audits/audit-execution/working-papers/list/working-papers-list.component';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import { RfiStatuses } from '@/app/features/audits/audit-execution/rfi/constants/rfi.constants';
import {
    AUDIT_PLAN_IN_PROGRESS_STATUS,
    AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
    AUDITOR_DASHBOARD_PAGE_SIZES,
    AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
    AUDITOR_DASHBOARD_ROUTES,
    AUDITOR_PROGRESS_THRESHOLDS,
    AUDITOR_TASK_LIST_STATUS_PARAMS,
    AUDITOR_TEAM_QUERY_SEPARATORS,
    AUDITOR_TEAM_TASK_AGING_THRESHOLDS,
    AuditorFindingViews,
    AuditorKpiActions,
    AuditorTaskCountBuckets,
    AuditorWorkingPaperStatuses,
} from '../../constants/auditor-dashboard.constants';
import { DASHBOARD_COLORS, DASHBOARD_THEME_COLORS } from '../../constants/auditor-dashboard-labels.constants';
import { CurrentAuditor } from '../../models/current-auditor.model';

type AuditorKpiAction = typeof AuditorKpiActions[keyof typeof AuditorKpiActions];

interface TeamKpiCard {
    label: string;
    value: number | string;
    icon: string;
    cardClass: string;
    action: AuditorKpiAction;
}

@Component({
    selector: 'app-auditor-team-overview-tab',
    standalone: true,
    imports: [CommonModule, PaginatorModule, DonutStatusChartComponent, DrawIconComponent],
    templateUrl: './auditor-team-overview-tab.component.html',
    styleUrl: './auditor-team-overview-tab.component.scss',
})
export class AuditorTeamOverviewTabComponent implements OnChanges {
    private readonly router = inject(Router);
    @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

    /* Team findings charts — built once per team change (not getters), so the
       donut's [legend] input isn't handed a new array on every change-detection pass. */
    teamFindingSeverity: DonutLegendItem[] = [];
    teamFindingStatus: (TeamFindingCount & { key: string })[] = [];
    teamFindingStatusMax = 0;
    teamFindingAging: (TeamFindingCount & { key: string })[] = [];
    teamFindingAgingTotal = 0;
    teamFindingAgingMax = 0;

    constructor() { this.buildTeamFindingCharts(); }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentAuditor']) this.buildTeamFindingCharts();
    }

    private buildTeamFindingCharts(): void {
        const ids = this.teamIds;
        this.teamFindingSeverity = getTeamFindingSeverityCounts(ids).map(item => ({ label: item.label, value: item.count, color: FINDING_SEVERITY_COLORS[item.severity] }));
        this.teamFindingStatus = getTeamFindingStatusCounts(ids);
        this.teamFindingStatusMax = Math.max(0, ...this.teamFindingStatus.map(item => item.count));
        this.teamFindingAging = getTeamFindingAging(ids);
        this.teamFindingAgingTotal = this.teamFindingAging.reduce((total, bucket) => total + bucket.count, 0);
        this.teamFindingAgingMax = Math.max(0, ...this.teamFindingAging.map(bucket => bucket.count));
    }
    readonly team = AUDIT_TEAM;
    get teamMembers() { return this.team.members.filter(member => member.id !== this.currentAuditor.id); }
    get teamLead() { return this.teamMembers.find(member => member.id === this.team.leadId); }
    get teamIds() { return this.teamMembers.map(member => member.id); }
    get teamNames() { return this.teamMembers.map(member => member.name); }
    get teamQuery() {
        return {
            [QP.TeamAuditorIds]: this.teamIds.join(AUDITOR_TEAM_QUERY_SEPARATORS.Ids),
            [QP.TeamAuditorNames]: this.teamNames.join(AUDITOR_TEAM_QUERY_SEPARATORS.Names),
        };
    }
    get kpiCards(): TeamKpiCard[] {
        const ids = this.teamIds;
        const names = this.teamNames;
        return [
            { label: $localize`:@@admin.auditorOverview.activeAudits:Active Audits`, value: countActivePlansForTeam(names), icon: 'pi pi-briefcase', cardClass: '', action: AuditorKpiActions.ActiveAudits },
            { label: $localize`:@@admin.auditorOverview.assignedScopes:Assigned Scopes`, value: countScopesForTeam(ids, ScopeLevels.Scope), icon: 'pi pi-list', cardClass: '', action: AuditorKpiActions.AssignedScopes },
            { label: $localize`:@@admin.auditorOverview.assignedSubScopes:Assigned Sub-scopes`, value: countScopesForTeam(ids, ScopeLevels.SubScope), icon: 'pi pi-sitemap', cardClass: '', action: AuditorKpiActions.AssignedSubScopes },
            { label: $localize`:@@admin.auditorOverview.openTasks:Open Tasks`, value: countTasksForTeam(ids, AuditorTaskCountBuckets.Open) + countTasksForTeam(ids, AuditorTaskCountBuckets.InProgress), icon: 'pi pi-check-square', cardClass: '', action: AuditorKpiActions.OpenTasks },
            { label: $localize`:@@admin.auditorOverview.tasksDueToday:Tasks Due Today`, value: countTasksForTeam(ids, AuditorTaskCountBuckets.DueToday), icon: 'pi pi-calendar', cardClass: 'stat--warning', action: AuditorKpiActions.TasksDueToday },
            { label: $localize`:@@admin.auditorOverview.overdueTasks:Overdue Tasks`, value: countTasksForTeam(ids, AuditorTaskCountBuckets.Overdue), icon: 'pi pi-exclamation-triangle', cardClass: 'stat--danger', action: AuditorKpiActions.OverdueTasks },
            { label: $localize`:@@admin.auditorOverview.pendingRfiResponses:Pending RFI Responses`, value: countPendingRfisForTeam(ids), icon: 'pi pi-file', cardClass: 'stat--warning', action: AuditorKpiActions.PendingRfi },
            { label: $localize`:@@admin.auditorOverview.openFindings:Open Findings`, value: countOpenFindingsForTeam(ids), icon: 'pi pi-exclamation-circle', cardClass: 'stat--danger', action: AuditorKpiActions.OpenFindings },
            { label: $localize`:@@admin.auditorOverview.repeatedFindings:Repeated Findings`, value: countRepeatedFindingsForTeam(ids), icon: 'pi pi-replay', cardClass: 'stat--orange', action: AuditorKpiActions.RepeatedFindings },
            { label: $localize`:@@admin.auditorOverview.workingPapersPending:Working Papers Pending`, value: countPendingWorkingPapersForTeam(names), icon: 'pi pi-file-edit', cardClass: '', action: AuditorKpiActions.WorkingPapersPending },
        ];
    }

    get teamWorkDistribution(): DonutLegendItem[] {
        return [
            { label: $localize`:@@admin.auditorOverview.activeAudits:Active Audits`, value: countActivePlansForTeam(this.teamNames), color: DASHBOARD_COLORS.Blue },
            { label: $localize`:@@admin.auditorOverview.assignedScopes:Assigned Scopes`, value: countScopesForTeam(this.teamIds, ScopeLevels.Scope), color: DASHBOARD_COLORS.Green },
            { label: $localize`:@@admin.auditorOverview.subScopes:Sub-scopes`, value: countScopesForTeam(this.teamIds, ScopeLevels.SubScope), color: DASHBOARD_COLORS.Amber },
            { label: $localize`:@@admin.auditorOverview.openFindings:Open Findings`, value: countOpenFindingsForTeam(this.teamIds), color: DASHBOARD_COLORS.Red },
            { label: $localize`:@@admin.auditorOverview.pendingRfis:Pending RFIs`, value: countPendingRfisForTeam(this.teamIds), color: DASHBOARD_COLORS.Violet },
        ];
    }

    get teamTaskStatus(): DonutLegendItem[] {
        const counts = getTeamTaskStatusCounts(this.teamIds);
        return [
            { label: $localize`:@@common.open:Open`, value: counts.open, color: DASHBOARD_COLORS.Slate },
            { label: $localize`:@@common.inProgress:In Progress`, value: counts.inProgress, color: DASHBOARD_COLORS.Blue },
            { label: $localize`:@@common.completed:Completed`, value: counts.completed, color: DASHBOARD_COLORS.Green },
            { label: $localize`:@@common.overdue:Overdue`, value: counts.overdue, color: DASHBOARD_COLORS.Red },
            { label: $localize`:@@common.dueToday:Due Today`, value: counts.dueToday, color: DASHBOARD_COLORS.Amber },
        ];
    }

    get teamAuditWorkload() { return getTeamAuditWorkload(this.teamIds); }
    workloadFirst = 0;
    readonly workloadRows = AUDITOR_DASHBOARD_PAGE_SIZES.TeamWorkload;
    get pagedTeamAuditWorkload() { return this.teamAuditWorkload.slice(this.workloadFirst, this.workloadFirst + this.workloadRows); }
    onWorkloadPageChange(event: { first?: number }): void { this.workloadFirst = event.first ?? 0; }

    /** Workload Distribution completion-bar fill class. */
    workloadFillClass(completion: number): string {
        const t = AUDITOR_PROGRESS_THRESHOLDS.TeamWorkload;
        if (completion >= t.Good) return 'team-workload-row__fill--complete';
        if (completion >= t.Fair) return 'team-workload-row__fill--progress';
        return 'team-workload-row__fill--pending';
    }

    get teamTaskAging() { return getTeamTaskAging(this.teamIds); }
    get teamTaskAgingTotal() { return this.teamTaskAging.reduce((total, bucket) => total + bucket.taskCount, 0); }

    /** Task Aging bar fill class, by the bucket's starting day count. */
    taskAgingFillClass(minDays: number): string {
        const t = AUDITOR_TEAM_TASK_AGING_THRESHOLDS;
        if (minDays >= t.Danger) return 'team-aging-row__fill--danger';
        if (minDays >= t.Warning) return 'team-aging-row__fill--warning';
        return 'team-aging-row__fill--normal';
    }

    get teamRfiResponseFunnel() { return getTeamRfiResponseFunnel(this.teamIds); }
    get teamRfiFunnelStages() {
        const funnel = this.teamRfiResponseFunnel;
        return [
            { label: $localize`:@@admin.auditorTeamOverview.rfisRaised:RFIs Raised`, value: funnel.raised, className: 'rfi-funnel__bar--raised' },
            { label: $localize`:@@admin.auditorTeamOverview.responsesReceived:Responses Received`, value: funnel.received, className: 'rfi-funnel__bar--received' },
            { label: $localize`:@@admin.auditorTeamOverview.responsesUnderReview:Responses Under Review`, value: funnel.underReview, className: 'rfi-funnel__bar--review' },
            { label: $localize`:@@admin.auditorTeamOverview.responsesAccepted:Responses Accepted`, value: funnel.accepted, className: 'rfi-funnel__bar--accepted' },
        ];
    }

    auditFirst = 0;
    readonly auditRows = AUDITOR_DASHBOARD_PAGE_SIZES.AuditProgress;
    get teamAuditProgress() { return getActivePlansForTeam(this.teamNames); }
    get pagedTeamAuditProgress() { return this.teamAuditProgress.slice(this.auditFirst, this.auditFirst + this.auditRows); }
    onAuditPageChange(event: { first?: number }): void { this.auditFirst = event.first ?? 0; }
    progressColor(progress: number): string {
        const t = AUDITOR_PROGRESS_THRESHOLDS.TeamAuditProgress;
        if (progress >= t.Good) return DASHBOARD_THEME_COLORS.Green;
        if (progress >= t.Fair) return DASHBOARD_THEME_COLORS.Blue;
        return DASHBOARD_THEME_COLORS.Orange;
    }

    onKpiClick(card: TeamKpiCard): void {
        const team = this.teamQuery;
        switch (card.action) {
            case AuditorKpiActions.ActiveAudits:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditPlanList], { queryParams: { ...team, [QP.Status]: AUDIT_PLAN_IN_PROGRESS_STATUS } });
                break;
            case AuditorKpiActions.AssignedScopes:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditScope], { queryParams: { ...team, [QP.ScopeLevel]: ScopeLevels.Scope } });
                break;
            case AuditorKpiActions.AssignedSubScopes:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.AuditScope], { queryParams: { ...team, [QP.ScopeLevel]: ScopeLevels.SubScope } });
                break;
            case AuditorKpiActions.OpenTasks:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { ...team, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.OpenAndInProgress } });
                break;
            case AuditorKpiActions.TasksDueToday:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { ...team, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.DueToday } });
                break;
            case AuditorKpiActions.OverdueTasks:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ScopeTask], { queryParams: { ...team, [QP.Status]: AUDITOR_TASK_LIST_STATUS_PARAMS.Overdue } });
                break;
            case AuditorKpiActions.PendingRfi:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.ManageRfi], { queryParams: { ...team, [QP.Status]: RfiStatuses.Pending } });
                break;
            case AuditorKpiActions.OpenFindings:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], { queryParams: { ...team, [QP.View]: AuditorFindingViews.Open } });
                break;
            case AuditorKpiActions.RepeatedFindings:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.Findings], { queryParams: { ...team, [QP.View]: AuditorFindingViews.Repeated } });
                break;
            case AuditorKpiActions.WorkingPapersPending:
                this.router.navigate([AUDITOR_DASHBOARD_ROUTES.WorkingPapers], { queryParams: { ...team, [QP.Status]: AuditorWorkingPaperStatuses.Pending } });
                break;
        }
    }
}
