import { Routes } from '@angular/router';

const auditExecutionRoutes: Routes = [
    { path: '', redirectTo: 'manage-rfi', pathMatch: 'full' },
    {
        path: 'manage-rfi',
        loadComponent: () => import('./rfi/list/rfi-list.component').then((c) => c.RfiListComponent),
        data: { breadcrumb: 'RFI Management' }
    },
    {
        path: 'evidence-list',
        loadComponent: () => import('./evidence/list/evidence-list.component').then((c) => c.EvidenceListComponent),
        data: { breadcrumb: 'Evidence' }
    },
    {
        path: 'observation-list',
        loadComponent: () => import('./observation/list/observation-list.component').then((c) => c.ObservationListComponent),
        data: { breadcrumb: 'Observations' }
    },
    {
        path: 'findings',
        loadComponent: () => import('./findings/list/findings-list.component').then((c) => c.FindingsListComponent),
        data: { breadcrumb: 'Findings' }
    },
    {
        path: 'recommendation-list',
        loadComponent: () => import('./recommendation/list/recommendation-list.component').then((c) => c.RecommendationListComponent),
        data: { breadcrumb: 'Recommendations' }
    },
    {
        path: 'working-papers',
        loadComponent: () => import('./working-papers/list/working-papers-list.component').then((c) => c.WorkingPaperListComponent),
        data: { breadcrumb: 'Working Papers' }
    },
    {
        path: 'assign-auditors',
        loadComponent: () => import('./auditor-assignment/manage/auditor-assignment.component').then((c) => c.AuditorAssignmentComponent),
        data: { breadcrumb: 'Assign Auditors' }
    },
    {
        path: 'reassign-auditors',
        loadComponent: () => import('./reassign-auditors/manage/reassign-auditors.component').then((c) => c.AuditorReassignmentComponent),
        data: { breadcrumb: 'Reassign Auditors' }
    }
];

export default auditExecutionRoutes;
