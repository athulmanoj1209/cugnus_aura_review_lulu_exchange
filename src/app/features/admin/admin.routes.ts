import { Routes } from '@angular/router';

const adminRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard-main/dashboard-main.component').then((c) => c.DashboardMain),
        data: { breadcrumb: 'Dashboard' }
    },
    {
        path: 'auditor-dashboard',
        loadComponent: () => import('./auditor-dashboard/main-auditor-dashboard/main-auditor-dashboard.component').then((c) => c.MainAuditorDashboard),
        data: { breadcrumb: 'Auditor Dashboard' }
    },
    {
        path: 'look-up',
        loadChildren: () => import('./look-up/look-up.routes'),
        data: { breadcrumb: 'Look Up' }
    },
    {
        path: 'review',
        loadChildren: () => import('./review/review.routes'),
        data: { breadcrumb: 'Review' }
    }
];

export default adminRoutes;
