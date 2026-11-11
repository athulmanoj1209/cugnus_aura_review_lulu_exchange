import { Routes } from '@angular/router';

const auditCalendarRoutes: Routes = [
    { path: '', redirectTo: 'events-meetings', pathMatch: 'full' },
    {
        path: 'events-meetings',
        loadComponent: () => import('./events-meetings/list/events-meetings-list.component').then((c) => c.EventMeetingListComponent),
        data: { breadcrumb: 'Events & Meetings' }
    },
    {
        path: 'notifications',
        loadComponent: () => import('./notifications/manage/notifications.components').then((c) => c.Notifications),
        data: { breadcrumb: 'Notifications' }
    }
];

export default auditCalendarRoutes;
