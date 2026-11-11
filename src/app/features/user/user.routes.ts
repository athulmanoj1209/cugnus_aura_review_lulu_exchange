import { Routes } from '@angular/router';

const userRoutes: Routes = [
    { path: '', redirectTo: 'user-list', pathMatch: 'full' },
    {
        path: 'user-list',
        loadComponent: () => import('./users/list/users-list.component').then((c) => c.UsersListComponent),
        data: { breadcrumb: 'Users' }
    },
    {
        path: 'role',
        loadComponent: () => import('./role-permissions/manage/role-permissions.component').then((c) => c.RolePermissionsComponent),
        data: { breadcrumb: 'Roles' }
    }
];

export default userRoutes;
