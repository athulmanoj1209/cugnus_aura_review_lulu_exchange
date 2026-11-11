import { Routes } from '@angular/router';

const auditTeamRoutes: Routes = [
    { path: '', redirectTo: 'member', pathMatch: 'full' },
    {
        path: 'member',
        loadComponent: () => import('./audit-team-member/list/member-list.component').then((c) => c.MembersListComponent),
        data: { breadcrumb: 'Members' }
    },
    {
        path: 'audit-team-chart',
        loadComponent: () => import('./audit-team-chart/list/audit-team-chart.component').then((c) => c.AuditTeamChartComponent),
        data: { breadcrumb: 'Audit Team Chart' }
    }
];

export default auditTeamRoutes;
