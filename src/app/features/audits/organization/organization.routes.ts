import { Routes } from '@angular/router';

const organizationRoutes: Routes = [
    { path: '', redirectTo: 'company', pathMatch: 'full' },
    {
        path: 'company',
        loadComponent: () => import('./company/list/company-list.component').then((c) => c.CompaniesListComponent),
        data: { breadcrumb: 'Company' }
    },
    {
        path: 'divisions',
        loadComponent: () => import('./divisions/list/division-list.component').then((c) => c.DivisionListComponent),
        data: { breadcrumb: 'Divisions' }
    },
    {
        path: 'sub-divisions',
        loadComponent: () => import('./sub-divisions/list/sub-division-list.component').then((c) => c.SubDivisionListComponent),
        data: { breadcrumb: 'Sub-Divisions' }
    },
    {
        path: 'client-org-chart',
        loadComponent: () => import('./client-org-chart/list/client-org-chart.component').then((c) => c.ClientOrgChartComponent),
        data: { breadcrumb: 'Client Org Chart' }
    }
];

export default organizationRoutes;
