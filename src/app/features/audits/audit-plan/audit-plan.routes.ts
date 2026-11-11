import { Routes } from '@angular/router';

const auditPlanRoutes: Routes = [
    { path: '', redirectTo: 'audit-plan-selector', pathMatch: 'full' },
    {
        path: 'risks',
        loadComponent: () => import('./risk/list/risk-list.component').then((c) => c.RiskRegisterListComponent),
        data: { breadcrumb: 'Risks' }
    },
    {
        path: 'audit-scope',
        loadComponent: () => import('./scope/list/scope-list.component').then((c) => c.ScopeListComponent),
        data: { breadcrumb: 'Audit Scope Management' }
    },
    {
        path: 'scope-jobs',
        loadComponent: () => import('./scope-job/list/scope-job-list.component').then((c) => c.ScopeJobListComponent),
        data: { breadcrumb: 'Scope Jobs' }
    },
    {
        path: 'scope-task',
        loadComponent: () => import('./scope-task/list/scope-task-list.component').then((c) => c.ScopeTaskListComponent),
        data: { breadcrumb: 'Scope Task' }
    },
    {
        path: 'audit-plan',
        loadComponent: () => import('./audit-plan/com/audit-plan/audit-plan.component').then((c) => c.AuditPlanComponent),
        data: { breadcrumb: 'Audit Plan' }
    },
    {
        path: 'audit-plan-selector',
        loadComponent: () => import('./audit-plan/com/audit-plan-selector/audit-plan-selector.component').then((c) => c.AuditPlanSelectorComponent),
        data: { breadcrumb: 'Audit Plan Selector' }
    },
    {
        path: 'audit-plan-list',
        loadComponent: () => import('./audit-plan/list/audit-plan-list.component').then((c) => c.AuditPlanListComponent),
        data: { breadcrumb: 'Audit Plan List' }
    }
];

export default auditPlanRoutes;
