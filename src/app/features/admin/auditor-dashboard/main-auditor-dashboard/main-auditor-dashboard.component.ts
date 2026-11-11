import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuditorOverviewTabComponent } from '../tabs/auditor-overview-tab/auditor-overview-tab.component';
import { AuditorMyAuditsScopesTabComponent } from '../tabs/auditor-my-audits-scopes-tab/auditor-my-audits-scopes-tab.component';
import { AuditorWorkingPapersRfisTabComponent } from '../tabs/auditor-working-papers-rfis-tab/auditor-working-papers-rfis-tab.component';
import { AuditorExecutionTabComponent } from '../tabs/auditor-execution-tab/auditor-execution-tab.component';
import { AuditorReviewsTabComponent } from '../tabs/auditor-reviews-tab/auditor-reviews-tab.component';
import { AuditorTeamOverviewTabComponent } from '../tabs/auditor-team-overview-tab/auditor-team-overview-tab.component';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import {
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AuditorDashboardTabs,
  type AuditorDashboardTab,
} from '../constants/auditor-dashboard.constants';

@Component({
  selector: 'app-main-auditor-dashboard',
  imports: [
    NgClass,
    AuditorOverviewTabComponent,
    AuditorMyAuditsScopesTabComponent,
    AuditorWorkingPapersRfisTabComponent,
    AuditorExecutionTabComponent,
    AuditorReviewsTabComponent,
    AuditorTeamOverviewTabComponent,
  ],
  templateUrl: './main-auditor-dashboard.component.html',
  styleUrl: './main-auditor-dashboard.component.scss',
})
export class MainAuditorDashboard {
  /** Hardcoded for now — the dashboard is scoped to this one auditor until real auth is wired in. */
  readonly currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  readonly AuditorDashboardTabs = AuditorDashboardTabs;

  activeTab: string = AuditorDashboardTabs.Overview;

  tabs: { id: AuditorDashboardTab; label: string; icon: string }[] = [
    { id: AuditorDashboardTabs.Overview,        label: $localize`:@@admin.auditorDashboard.overview:Overview`,                icon: 'pi pi-home' },
        { id: AuditorDashboardTabs.TeamOverview,    label: $localize`:@@admin.auditorDashboard.teamOverview:Team Overview`,       icon: 'pi pi-users' },
    { id: AuditorDashboardTabs.ScopeManagement, label: $localize`:@@admin.auditorDashboard.myAuditsScopes:My Audits & Scopes`,      icon: 'pi pi-list' },
    { id: AuditorDashboardTabs.WorkingPapers,   label: $localize`:@@admin.auditorDashboard.workingPapersRfis:Working Papers & RFIs`,   icon: 'pi pi-file' },
    { id: AuditorDashboardTabs.Execution,       label: $localize`:@@admin.auditorDashboard.execution:Execution`,               icon: 'pi pi-play-circle' },
    { id: AuditorDashboardTabs.Reviews,         label: $localize`:@@admin.auditorDashboard.reviews:Reviews`,                 icon: 'pi pi-check-circle' },
  ];
}
