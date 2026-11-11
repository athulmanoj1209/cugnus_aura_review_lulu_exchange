import { Routes } from '@angular/router';

const auditReportRoutes: Routes = [
    { path: '', redirectTo: 'reports-lists', pathMatch: 'full' },
    {
        path: 'report-templates',
        loadComponent: () => import('./report-template/list/report-template-list.component').then((c) => c.ReportTemplateListComponent),
        data: { breadcrumb: 'Report Templates' }
    },
    {
        path: 'reports-lists',
        loadComponent: () => import('./final-report/list/final-report-list.component').then((c) => c.FinalReportListComponent),
        data: { breadcrumb: 'Reports' }
    },
    {
        path: 'download-report',
        loadComponent: () => import('./download-report/list/download-report-list.component').then((c) => c.ReportDownloadComponent),
        data: { breadcrumb: 'Download Report' }
    },
    {
        path: 'upload-report',
        loadComponent: () => import('./upload-report/list/upload-report-list.component').then((c) => c.ReportUploadComponent),
        data: { breadcrumb: 'Upload Report' }
    },
    {
        path: 'audit-description-picker',
        loadComponent: () => import('./audit-description-picker/manage/audit-description-picker.component').then((c) => c.AuditDescriptionPickerComponent),
        data: { breadcrumb: 'Audit Description Picker' }
    }
];

export default auditReportRoutes;
