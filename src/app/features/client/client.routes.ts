import { Routes } from '@angular/router';

const clientRoutes: Routes = [
    { path: '', redirectTo: 'client-dashboard', pathMatch: 'full' },
    {
        path: 'client-dashboard',
        loadComponent: () => import('./client-dashboard/client-dashboard/client-dashboard.component').then((c) => c.ClientDashboardComponent),
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'scope-summary',
        loadComponent: () => import('./audit-scope-summary/list/scope-summary-list.component').then((c) => c.AuditScopeSummaryComponent),
        data: { breadcrumb: 'Scope Summary' }
    },
    {
        path: 'manage-client-rfi',
        loadComponent: () => import('./rfi-client/list/rfi-client-list.component').then((c) => c.RfiClientListComponent),
        data: { breadcrumb: 'RFI Management' }
    },
    {
        path: 'cfo-audit-team-chart',
        loadComponent: () => import('./client-head-audit-team-chart/list/client-head-audit-team-chart.component').then((c) => c.CfoAuditTeamChartComponent),
        data: { breadcrumb: 'Audit Team Chart' }
    },
    {
        path: 'dept-head-audit-team-chart',
        loadComponent: () => import('./dept-head-audit-team-chart/list/dept-head-audit-team-chart.component').then((c) => c.DeptHeadAuditTeamChartComponent),
        data: { breadcrumb: 'Audit Team Chart' }
    }
];

export default clientRoutes;
