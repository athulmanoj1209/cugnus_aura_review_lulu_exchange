import { Routes } from '@angular/router';
import { AppLayout } from '@/app/layout/components/app.layout';
// import { Landing } from '@/app/apps/pages/landing/landing';
// import { Notfound } from '@/app/apps/pages/notfound/notfound';
import { DashboardMain } from './features/admin/dashboard/dashboard-main/dashboard-main.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: DashboardMain,
                data: { breadcrumb: 'Dashboard' }
            },
            {
                path: 'admin',
                loadChildren: () => import('@/app/features/admin/admin.routes'),
                data: { breadcrumb: 'Admin' }
            },
            {
                path: 'audits',
                loadChildren: () => import('@/app/features/audits/audits.routes'),
                data: { breadcrumb: 'Audits' }
            },
            {
                path: 'user',
                loadChildren: () => import('@/app/features/user/user.routes'),
                data: { breadcrumb: 'User Management' }
            },
            {
                path: 'client',
                loadChildren: () => import('@/app/features/client/client.routes'),
                data: { breadcrumb: 'Client' }
            },
            {
                path: 'findings',
                loadComponent: () => import('./features/audits/audit-execution/findings/list/findings-list.component').then((c) => c.FindingsListComponent),
                data: { breadcrumb: 'Findings' }
            },
            {
                path: 'assign-auditors',
                loadComponent: () => import('./features/audits/audit-execution/auditor-assignment/manage/auditor-assignment.component').then((c) => c.AuditorAssignmentComponent),
                data: { breadcrumb: 'Review Risks' }
            },
            {
                path: 'events-meetings',
                loadComponent: () => import('./features/audits/audit-calendar/events-meetings/list/events-meetings-list.component').then((c) => c.EventMeetingListComponent),
                data: { breadcrumb: 'Events & Meetings' }
            },
            {
                path: 'industry-type',
                loadComponent: () => import('./features/admin/look-up/industry-type/list/industry-type-list.component').then((c) => c.IndustryTypeListComponent),
                data: { breadcrumb: 'Industry type' }
            }
            ,
            {
                path: 'ownership-type',
                loadComponent: () => import('./features/admin/look-up/ownership-type/list/ownership-type-list.component').then((c) => c.OwnershipTypeListComponent),
                data: { breadcrumb: 'Industry type' }
            }
            ,
            {
                path: 'entity-type',
                loadComponent: () => import('./features/admin/look-up/entity-type/list/entity-type-list.component').then((c) => c.EntityTypeListComponent),
                data: { breadcrumb: 'Entity type' }
            },

            {
                path: 'revenue-bracket',
                loadComponent: () => import('./features/admin/look-up/revenue-bracket/list/revenue-bracket-list.component').then((c) => c.RevenueBracketListComponent),
                data: { breadcrumb: 'Revenue Bracket' }
            },
            {
                path: 'next audit cycle',
                loadComponent: () => import('./features/admin/look-up/next-audit-cycle/list/next-audit-cycle-list.component').then((c) => c.NextAuditCycleListComponent),
                data: { breadcrumb: 'Revenue Bracket' }
            }
            ,
            {
                path: 'areas of expertise',
                loadComponent: () => import('./features/admin/look-up/areas-of-expertise/list/areas-of-expertise-list.component').then((c) => c.AreaOfExpertiseListComponent),
                data: { breadcrumb: 'Revenue Bracket' }
            }
            ,
            {
                path: 'evidence type',
                loadComponent: () => import('./features/admin/look-up/evidence-type/list/evidence-type-list.component').then((c) => c.EvidenceTypeListComponent),
                data: { breadcrumb: 'Evidence Type' }
            }
            ,
            {
                path: 'related functions',
                loadComponent: () => import('./features/admin/look-up/related-functions/list/related-functions-list.component').then((c) => c.RelatedFunctionListComponent),
                data: { breadcrumb: 'Related Functions' }
            }
            ,
            {
                path: 'rfi category',
                loadComponent: () => import('./features/admin/look-up/rfi-category/list/rfi-category-list.component').then((c) => c.RfiCategoryListComponent),
                data: { breadcrumb: 'RFI Category' }
            },
            {
                path: 'risk-ratings',
                loadComponent: () => import('./features/admin/look-up/risk-rating/list/risk-rating-list.component').then((c) => c.RiskRatingListComponent),
                data: { breadcrumb: 'Risk Ratings' }
            },
            {
                path: 'risk-statuses',
                loadComponent: () => import('./features/admin/look-up/risk-status/list/risk-status-list.component').then((c) => c.RiskStatusListComponent),
                data: { breadcrumb: 'Risk Statuses' }
            },
            {
                path: 'risk-categories',
                loadComponent: () => import('./features/admin/look-up/risk-category/list/risk-category-list.component').then((c) => c.RiskCategoryListComponent),
                data: { breadcrumb: 'Risk Categories' }
            },
            {
                path: 'risk-owners',
                loadComponent: () => import('./features/admin/look-up/risk-owner/list/risk-owner-list.component').then((c) => c.RiskOwnerListComponent),
                data: { breadcrumb: 'Risk Owners' }
            },
            {
                path: 'audit-frequencies',
                loadComponent: () => import('./features/admin/look-up/audit-frequency/list/audit-frequency-list.component').then((c) => c.AuditFrequencyListComponent),
                data: { breadcrumb: 'Audit Frequencies' }
            },
            {
                path: 'audit-modes',
                loadComponent: () => import('./features/admin/look-up/audit-mode/list/audit-mode-list.component').then((c) => c.AuditModeListComponent),
                data: { breadcrumb: 'Audit Modes' }
            },
            {
                path: 'scope-types',
                loadComponent: () => import('./features/admin/look-up/scope-type/list/scope-type-list.component').then((c) => c.ScopeTypeListComponent),
                data: { breadcrumb: 'Scope Types' }
            },
            {
                path: 'sampling-methodologies',
                loadComponent: () => import('./features/admin/look-up/sampling-methodology/list/sampling-methodology-list.component').then((c) => c.SamplingMethodologyListComponent),
                data: { breadcrumb: 'Sampling Methodologies' }
            },
            {
                path: 'hourly-rates',
                loadComponent: () => import('./features/admin/look-up/hourly-rate/list/hourly-rate-list.component').then((c) => c.HourlyRateListComponent),
                data: { breadcrumb: 'Hourly Rates' }
            },
            {
                path: 'applicable-frameworks',
                loadComponent: () => import('./features/admin/look-up/applicable-framework/list/applicable-framework-list.component').then((c) => c.ApplicableFrameworkListComponent),
                data: { breadcrumb: 'Applicable Frameworks' }
            },
            {
                path: 'department-type',
                loadComponent: () => import('./features/admin/look-up/department-type/list/department-type-list.component').then((c) => c.DepartmentTypeListComponent),
                data: { breadcrumb: 'department-type' }
            },
            {
                path: 'scope-jobs',
                loadComponent: () => import('./features/audits/audit-plan/scope-job/list/scope-job-list.component').then((c) => c.ScopeJobListComponent),
                data: { breadcrumb: 'Sope Jobs' }
            },
            {
                path: 'reassign-auditors',
                loadComponent: () => import('./features/audits/audit-execution/reassign-auditors/manage/reassign-auditors.component').then((c) => c.AuditorReassignmentComponent),
                data: { breadcrumb: 'Reassign Auditors' }
            },
            {
                path: 'audit-plan',
                loadComponent: () => import('./features/audits/audit-plan/audit-plan/com/audit-plan/audit-plan.component').then((c) => c.AuditPlanComponent),
                data: { breadcrumb: 'Audit plan ' }
            }
            ,
            {
                path: 'audit-plan-selector',
                loadComponent: () => import('./features/audits/audit-plan/audit-plan/com/audit-plan-selector/audit-plan-selector.component').then((c) => c.AuditPlanSelectorComponent),
                data: { breadcrumb: 'Audit Plan Selectors' }
            },
            {
                path: 'audit-plan-list',
                loadComponent: () => import('./features/audits/audit-plan/audit-plan/list/audit-plan-list.component').then((c) => c.AuditPlanListComponent),
                data: { breadcrumb: 'Audit Plan Selectors' }
            },
            {
                path: 'download-report',
                loadComponent: () => import('./features/audits/audit-report/download-report/list/download-report-list.component').then((c) => c.ReportDownloadComponent),
                data: { breadcrumb: 'Working Papers' }
            }
            ,
            {
                path: 'upload-report',
                loadComponent: () => import('./features/audits/audit-report/upload-report/list/upload-report-list.component').then((c) => c.ReportUploadComponent),
                data: { breadcrumb: 'Working Papers' }
            }
            ,
            {
                path: 'draft-reports',
                loadComponent: () => import('./features/admin/review/draft-report-requests/list/draft-report-requests-list.component').then((c) => c.DraftReportsListComponent),
                data: { breadcrumb: 'Draft report list' }
            }
            , {
                path: 'audit-description-picker',
                loadComponent: () => import('./features/audits/audit-report/audit-description-picker/manage/audit-description-picker.component').then((c) => c.AuditDescriptionPickerComponent),
                data: { breadcrumb: 'Audit Description Picker' }
            },
            {
                path: 'working-papers',
                loadComponent: () => import('./features/audits/audit-execution/working-papers/list/working-papers-list.component').then((c) => c.WorkingPaperListComponent),
                data: { breadcrumb: 'Working Papers' }
            }
            ,
            {
                path: 'review-working-papers',
                loadComponent: () => import('./features/admin/review/working-paper-requests/list/working-paper-requests-list.component').then((c) => c.WorkingPaperReviewListComponent),
                data: { breadcrumb: 'Working Papers' }
            },
            {
                path: 'audit-scope',
                loadComponent: () => import('./features/audits/audit-plan/scope/list/scope-list.component').then((c) => c.ScopeListComponent),
                data: { breadcrumb: 'Audit Scope Management' }
            },
            {
                path: 'organization-requests',
                loadComponent: () => import('./features/admin/review/organization-request/list/organization-request-list.component').then((c) => c.OrganizationRequestListComponent),
                data: { breadcrumb: 'Organization Requests' }
            },
            {
                path: 'library-requests',
                loadComponent: () => import('./features/admin/review/library-request/list/library-request-list.component').then((c) => c.LibraryRequestListComponent),
                data: { breadcrumb: 'Library Requests' }
            },
            {
                path: 'scope-requests',
                loadComponent: () => import('./features/admin/review/scope-request/list/scope-request-list.component').then((c) => c.ScopeRequestListComponent),
                data: { breadcrumb: 'Scope Requests' }
            },
            {
                path: 'divisions',
                loadComponent: () => import('./features/audits/organization/divisions/list/division-list.component').then((c) => c.DivisionListComponent),
                data: { breadcrumb: 'Divisions' }
            },
            {
                path: 'sub-divisions',
                loadComponent: () => import('./features/audits/organization/sub-divisions/list/sub-division-list.component').then((c) => c.SubDivisionListComponent),
                data: { breadcrumb: 'Sub-Divisions' }
            },
            {
                path: 'client-org-chart',
                loadComponent: () => import('./features/audits/organization/client-org-chart/list/client-org-chart.component').then((c) => c.ClientOrgChartComponent),
                data: { breadcrumb: 'Client Org Chart' }
            },
            {
                path: 'manage-rfi',
                loadComponent: () => import('./features/audits/audit-execution/rfi/list/rfi-list.component').then((c) => c.RfiListComponent),
                data: { breadcrumb: 'Audit Scope Management' }
            },
            {
                path: 'audit-scope-library',
                loadComponent: () => import('./features/audits/libraries/scope-library/list/scope-library-list.component').then((c) => c.ScopeLibraryListComponent),
                data: { breadcrumb: 'Audit Scope Library' }
            },
            {
                path: 'rfi-management-library',
                loadComponent: () => import('./features/audits/libraries/rfi-library/list/rfi-library-list.component').then((c) => c.RfiLibraryListComponent),
                data: { breadcrumb: 'RFI Management Library' }
            },
            {
                path: 'report-templates',
                loadComponent: () => import('./features/audits/audit-report/report-template/list/report-template-list.component').then(c => c.ReportTemplateListComponent),
                data: { breadcrumb: 'report-templates' }
            },
            {
                path: 'reports-lists',
                loadComponent: () => import('./features/audits/audit-report/final-report/list/final-report-list.component').then(c => c.FinalReportListComponent),
                data: { breadcrumb: 'reports-lists' }
            },
            {
                path: 'dashboard-main',
                component: DashboardMain,
                data: { breadcrumb: 'Dashboard' }
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/audits/audit-calendar/notifications/manage/notifications.components').then(c => c.Notifications),
                data: { breadcrumb: 'notifications' }
            },
            {
                path: 'login',
                loadComponent: () => import('./apps/pages/auth/login/login.component').then(c => c.Login)
            },
            {
                path: 'create-transaction',
                loadComponent: () => import('./apps/poc/create-transaction/create-transaction').then(c => c.CreateTransaction),
                data: { breadcrumb: 'create-transaction' }
            },
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        loadChildren: () => import('@/app/apps/pages/auth/auth.routes')
    },
    { path: '**', redirectTo: '/notfound' }
];
