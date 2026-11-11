import { Routes } from '@angular/router';

const librariesRoutes: Routes = [
    { path: '', redirectTo: 'regulations', pathMatch: 'full' },
    {
        path: 'regulations',
        loadComponent: () => import('./regulation-library/list/regulation-library-list.component').then((c) => c.RegulationLibraryComponent),
        data: { breadcrumb: 'Regulations' }
    },
    {
        path: 'regulation-details/:id',
        loadComponent: () => import('./regulation-library/profile/regulation-library-profile.component').then((c) => c.RegulationDetailComponent),
        data: { breadcrumb: 'Regulation Details' }
    },
    {
        path: 'audit-scope-library',
        loadComponent: () => import('./scope-library/list/scope-library-list.component').then((c) => c.ScopeLibraryListComponent),
        data: { breadcrumb: 'Audit Scope Library' }
    },
    {
        path: 'rfi-management-library',
        loadComponent: () => import('./rfi-library/list/rfi-library-list.component').then((c) => c.RfiLibraryListComponent),
        data: { breadcrumb: 'RFI Management Library' }
    }
];

export default librariesRoutes;
