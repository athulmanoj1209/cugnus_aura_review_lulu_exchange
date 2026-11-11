import { Routes } from '@angular/router';

const auditsRoutes: Routes = [
    { path: '', redirectTo: 'audit-plan', pathMatch: 'full' },
    {
        path: 'organization',
        loadChildren: () => import('./organization/organization.routes'),
        data: { breadcrumb: 'Organization' }
    },
    {
        path: 'audit-team',
        loadChildren: () => import('./audit-team/audit-team.routes'),
        data: { breadcrumb: 'Audit Team' }
    },
    {
        path: 'audit-calendar',
        loadChildren: () => import('./audit-calendar/audit-calendar.routes'),
        data: { breadcrumb: 'Audit Calendar' }
    },
    {
        path: 'audit-plan',
        loadChildren: () => import('./audit-plan/audit-plan.routes'),
        data: { breadcrumb: 'Audit Plan' }
    },
    {
        path: 'audit-execution',
        loadChildren: () => import('./audit-execution/audit-execution.routes'),
        data: { breadcrumb: 'Audit Execution' }
    },
    {
        path: 'libraries',
        loadChildren: () => import('./libraries/libraries.routes'),
        data: { breadcrumb: 'Libraries' }
    },
    {
        path: 'follow-up',
        loadChildren: () => import('./follow-up/follow-up.routes'),
        data: { breadcrumb: 'Follow Up' }
    },
    {
        path: 'audit-report',
        loadChildren: () => import('./audit-report/audit-report.routes'),
        data: { breadcrumb: 'Audit Report' }
    }
];

export default auditsRoutes;
