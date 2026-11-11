import { Routes } from '@angular/router';

const followUpRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/follow-up-list.component').then((c) => c.FollowupListComponent),
        data: { breadcrumb: 'Follow Up' }
    },
    {
        path: 'details/:id',
        loadComponent: () => import('../audit-execution/findings/profile/findings-detail.component').then((c) => c.FindingDetailComponent),
        data: { breadcrumb: 'Follow-up Details' }
    }
];

export default followUpRoutes;
