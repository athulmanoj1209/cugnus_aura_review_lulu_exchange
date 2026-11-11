import { Routes } from '@angular/router';

const lookUpRoutes: Routes = [
    { path: '', redirectTo: 'industry-type', pathMatch: 'full' },
    {
        path: 'industry-type',
        loadComponent: () => import('./industry-type/list/industry-type-list.component').then((c) => c.IndustryTypeListComponent),
        data: { breadcrumb: 'Industry Type' }
    },
    {
        path: 'ownership-type',
        loadComponent: () => import('./ownership-type/list/ownership-type-list.component').then((c) => c.OwnershipTypeListComponent),
        data: { breadcrumb: 'Ownership Type' }
    },
    {
        path: 'entity-type',
        loadComponent: () => import('./entity-type/list/entity-type-list.component').then((c) => c.EntityTypeListComponent),
        data: { breadcrumb: 'Entity Type' }
    },
    {
        path: 'revenue-bracket',
        loadComponent: () => import('./revenue-bracket/list/revenue-bracket-list.component').then((c) => c.RevenueBracketListComponent),
        data: { breadcrumb: 'Revenue Bracket' }
    },
    {
        path: 'next-audit-cycle',
        loadComponent: () => import('./next-audit-cycle/list/next-audit-cycle-list.component').then((c) => c.NextAuditCycleListComponent),
        data: { breadcrumb: 'Next Audit Cycle' }
    },
    {
        path: 'areas-of-expertise',
        loadComponent: () => import('./areas-of-expertise/list/areas-of-expertise-list.component').then((c) => c.AreaOfExpertiseListComponent),
        data: { breadcrumb: 'Areas Of Expertise' }
    },
    {
        path: 'evidence-type',
        loadComponent: () => import('./evidence-type/list/evidence-type-list.component').then((c) => c.EvidenceTypeListComponent),
        data: { breadcrumb: 'Evidence Type' }
    },
    {
        path: 'related-functions',
        loadComponent: () => import('./related-functions/list/related-functions-list.component').then((c) => c.RelatedFunctionListComponent),
        data: { breadcrumb: 'Related Functions' }
    },
    {
        path: 'rfi-category',
        loadComponent: () => import('./rfi-category/list/rfi-category-list.component').then((c) => c.RfiCategoryListComponent),
        data: { breadcrumb: 'RFI Category' }
    },
    {
        path: 'risk-ratings',
        loadComponent: () => import('./risk-rating/list/risk-rating-list.component').then((c) => c.RiskRatingListComponent),
        data: { breadcrumb: 'Risk Ratings' }
    },
    {
        path: 'risk-statuses',
        loadComponent: () => import('./risk-status/list/risk-status-list.component').then((c) => c.RiskStatusListComponent),
        data: { breadcrumb: 'Risk Statuses' }
    },
    {
        path: 'risk-categories',
        loadComponent: () => import('./risk-category/list/risk-category-list.component').then((c) => c.RiskCategoryListComponent),
        data: { breadcrumb: 'Risk Categories' }
    },
    {
        path: 'risk-owners',
        loadComponent: () => import('./risk-owner/list/risk-owner-list.component').then((c) => c.RiskOwnerListComponent),
        data: { breadcrumb: 'Risk Owners' }
    },
    {
        path: 'audit-frequencies',
        loadComponent: () => import('./audit-frequency/list/audit-frequency-list.component').then((c) => c.AuditFrequencyListComponent),
        data: { breadcrumb: 'Audit Frequencies' }
    },
    {
        path: 'audit-modes',
        loadComponent: () => import('./audit-mode/list/audit-mode-list.component').then((c) => c.AuditModeListComponent),
        data: { breadcrumb: 'Audit Modes' }
    },
    {
        path: 'scope-types',
        loadComponent: () => import('./scope-type/list/scope-type-list.component').then((c) => c.ScopeTypeListComponent),
        data: { breadcrumb: 'Scope Types' }
    },
    {
        path: 'sampling-methodologies',
        loadComponent: () => import('./sampling-methodology/list/sampling-methodology-list.component').then((c) => c.SamplingMethodologyListComponent),
        data: { breadcrumb: 'Sampling Methodologies' }
    },
    {
        path: 'hourly-rates',
        loadComponent: () => import('./hourly-rate/list/hourly-rate-list.component').then((c) => c.HourlyRateListComponent),
        data: { breadcrumb: 'Hourly Rates' }
    },
    {
        path: 'applicable-frameworks',
        loadComponent: () => import('./applicable-framework/list/applicable-framework-list.component').then((c) => c.ApplicableFrameworkListComponent),
        data: { breadcrumb: 'Applicable Frameworks' }
    },
    {
        path: 'department-type',
        loadComponent: () => import('./department-type/list/department-type-list.component').then((c) => c.DepartmentTypeListComponent),
        data: { breadcrumb: 'Department Type' }
    }
];

export default lookUpRoutes;
