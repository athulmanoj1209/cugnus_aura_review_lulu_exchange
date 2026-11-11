import { Routes } from '@angular/router';

const reviewRoutes: Routes = [
    { path: '', redirectTo: 'organization-requests', pathMatch: 'full' },
    {
        path: 'organization-requests',
        loadComponent: () => import('./organization-request/list/organization-request-list.component').then((c) => c.OrganizationRequestListComponent),
        data: { breadcrumb: 'Organization Requests' }
    },
    {
        path: 'scope-requests',
        loadComponent: () => import('./scope-request/list/scope-request-list.component').then((c) => c.ScopeRequestListComponent),
        data: { breadcrumb: 'Scope Requests' }
    },
    {
        path: 'risk-approval-list',
        loadComponent: () => import('./risk-requests/list/risk-requests-list.component').then((c) => c.RiskPendingApprovalsComponent),
        data: { breadcrumb: 'Risk Requests' }
    },
    {
        path: 'approval-list',
        loadComponent: () => import('./execution-requests/list/execution-requests-list.component').then((c) => c.ExecutionApprovalListComponent),
        data: { breadcrumb: 'Execution Requests' }
    },
    {
        path: 'library-requests',
        loadComponent: () => import('./library-request/list/library-request-list.component').then((c) => c.LibraryRequestListComponent),
        data: { breadcrumb: 'Library Requests' }
    },
    {
        path: 'draft-reports',
        loadComponent: () => import('./draft-report-requests/list/draft-report-requests-list.component').then((c) => c.DraftReportsListComponent),
        data: { breadcrumb: 'Draft Reports' }
    },
    {
        path: 'working-papers',
        loadComponent: () => import('./working-paper-requests/list/working-paper-requests-list.component').then((c) => c.WorkingPaperReviewListComponent),
        data: { breadcrumb: 'Working Papers' }
    }
];

export default reviewRoutes;
