import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: any[] = [
        // {
        //     label: 'Dashboards',
        //     icon: 'pi pi-home',
        //     path: '/dashboards',
        //     // visible: false,
        //     items: [
        //         {
        //             label: 'E-Commerce',
        //             icon: 'pi pi-fw pi-home',
        //             routerLink: ['/']
        //         },
        //         {
        //             label: 'Audit',
        //             icon: 'pi pi-fw pi-home',
        //             routerLink: ['/audit-details']
        //         },
        //         {
        //             label: 'Banking',
        //             icon: 'pi pi-fw pi-image',
        //             routerLink: ['/dashboard-banking']
        //         }
        //     ]
        // },
        // {
        //     label: 'Apps',
        //     icon: 'pi pi-th-large',
        //     path: '/apps',
        //     items: [
        //         {
        //             label: 'CMS',
        //             icon: 'pi pi-fw pi-comment',
        //             path: '/apps/cms',
        //             items: [
        //                 {
        //                     label: 'Detail',
        //                     icon: 'pi pi-fw pi-list',
        //                     routerLink: ['/apps/cms/detail']
        //                 },
        //                 {
        //                     label: 'Detail-2',
        //                     icon: 'pi pi-fw pi-list',
        //                     routerLink: ['/apps/cms/detail2']
        //                 },
        //                 {
        //                     label: 'List',
        //                     icon: 'pi pi-fw pi-image',
        //                     routerLink: ['/apps/cms/list']
        //                 },
        //                 {
        //                     label: 'Edit',
        //                     icon: 'pi pi-fw pi-pencil',
        //                     routerLink: ['/apps/cms/edit']
        //                 }
        //             ]
        //         },

        //         {
        //             label: 'Chat',
        //             icon: 'pi pi-fw pi-comments',
        //             routerLink: ['/apps/chat']
        //         },
        //         {
        //             label: 'Files',
        //             icon: 'pi pi-fw pi-folder',
        //             routerLink: ['/apps/files']
        //         },
        //         {
        //             label: 'Mail',
        //             icon: 'pi pi-fw pi-envelope',
        //             routerLink: ['/apps/mail/inbox']
        //         },
        //         {
        //             label: 'Task List',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/tasklist']
        //         },dashboard-main
        //         {
        //             label: 'Create Transaction',dashboard-main
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/create-transaction']
        //         },
        //         {
        //             label: 'Application Request',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/application-request']
        //         },
        //         {
        //             label: 'Add Methods',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/add-methods']
        //         },
        //         {
        //             label: 'Add Scope',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/audit-scope']
        //         },
        //         {
        //             label: 'RFI Management',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/manage-rfi']
        //         },
        //         {
        //             label: 'Audit Plan',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/apps/audit-plan']
        //         }
        //     ]
        // },
        // {
        //     label: 'UI Kit',
        //     icon: 'pi pi-fw pi-star-fill',
        //     path: '/uikit',
        //     items: [
        //         {
        //             label: 'Form Layout',
        //             icon: 'pi pi-fw pi-id-card',
        //             routerLink: ['/uikit/formlayout']
        //         },
        //         {
        //             label: 'Input',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/uikit/input']
        //         },

        //         {
        //             label: 'Button',
        //             icon: 'pi pi-fw pi-box',
        //             routerLink: ['/uikit/button']
        //         },
        //         {
        //             label: 'Table',
        //             icon: 'pi pi-fw pi-table',
        //             routerLink: ['/uikit/table']
        //         },
        //         {
        //             label: 'List',
        //             icon: 'pi pi-fw pi-list',
        //             routerLink: ['/uikit/list']
        //         },
        //         {
        //             label: 'Tree',
        //             icon: 'pi pi-fw pi-share-alt',
        //             routerLink: ['/uikit/tree']
        //         },
        //         {
        //             label: 'Panel',
        //             icon: 'pi pi-fw pi-tablet',
        //             routerLink: ['/uikit/panel']
        //         },
        //         {
        //             label: 'Overlay',
        //             icon: 'pi pi-fw pi-clone',
        //             routerLink: ['/uikit/overlay']
        //         },
        //         {
        //             label: 'Media',
        //             icon: 'pi pi-fw pi-image',
        //             routerLink: ['/uikit/media']
        //         },
        //         {
        //             label: 'Menu',
        //             icon: 'pi pi-fw pi-bars',
        //             routerLink: ['/uikit/menu'],
        //             routerLinkActiveOptions: {
        //                 paths: 'subset',
        //                 queryParams: 'ignored',
        //                 matrixParams: 'ignored',
        //                 fragment: 'ignored'
        //             }
        //         },
        //         {
        //             label: 'Message',
        //             icon: 'pi pi-fw pi-comment',
        //             routerLink: ['/uikit/message']
        //         },
        //         {
        //             label: 'File',
        //             icon: 'pi pi-fw pi-file',
        //             routerLink: ['/uikit/file']
        //         },
        //         {
        //             label: 'Chart',
        //             icon: 'pi pi-fw pi-chart-bar',
        //             routerLink: ['/uikit/charts']
        //         },
        //         {
        //             label: 'Misc',
        //             icon: 'pi pi-fw pi-circle-off',
        //             routerLink: ['/uikit/misc']
        //         }
        //     ]
        // },
        // {
        //     label: 'Prime Blocks',
        //     icon: 'pi pi-fw pi-prime',
        //     path: '/blocks',
        //     items: [
        //         {
        //             label: 'Free Blocks',
        //             icon: 'pi pi-fw pi-eye',
        //             routerLink: ['/blocks']
        //         },
        //         {
        //             label: 'All Blocks',
        //             icon: 'pi pi-fw pi-globe',
        //             url: ['https://primeblocks.org'],
        //             target: '_blank'
        //         }
        //     ]
        // },
        // {
        //     label: 'Utilities',
        //     icon: 'pi pi-fw pi-compass',
        //     path: '/utilities',
        //     items: [
        //         {
        //             label: 'Figma',
        //             icon: 'pi pi-fw pi-pencil',
        //             url: ['https://www.figma.com/file/zQOW0XBXdCTqODzEOqwBtt/Preview-%7C-Apollo-2022?node-id=335%3A21768&t=urYI89V3PLNAZEJG-1/'],
        //             target: '_blank'
        //         }
        //     ]
        // },
        // {
        //     label: 'Pages',
        //     icon: 'pi pi-fw pi-briefcase',
        //     path: '/pages',
        //     items: [
        //         {
        //             label: 'Landing',
        //             icon: 'pi pi-fw pi-globe',
        //             routerLink: ['/landing']
        //         },
        //         {
        //             label: 'Auth',
        //             icon: 'pi pi-fw pi-user',
        //             path: '/auth',
        //             items: [
        //                 {
        //                     label: 'Login',
        //                     icon: 'pi pi-fw pi-sign-in',
        //                     routerLink: ['/auth/login']
        //                 },
        //                 {
        //                     label: 'Error',
        //                     icon: 'pi pi-fw pi-times-circle',
        //                     routerLink: ['/auth/error']
        //                 },
        //                 {
        //                     label: 'Access Denied',
        //                     icon: 'pi pi-fw pi-lock',
        //                     routerLink: ['/auth/access']
        //                 },
        //                 {
        //                     label: 'Register',
        //                     icon: 'pi pi-fw pi-user-plus',
        //                     routerLink: ['/auth/register']
        //                 },
        //                 {
        //                     label: 'Forgot Password',
        //                     icon: 'pi pi-fw pi-question',
        //                     routerLink: ['/auth/forgotpassword']
        //                 },
        //                 {
        //                     label: 'New Password',
        //                     icon: 'pi pi-fw pi-cog',
        //                     routerLink: ['/auth/newpassword']
        //                 },
        //                 {
        //                     label: 'Verification',
        //                     icon: 'pi pi-fw pi-envelope',
        //                     routerLink: ['/auth/verification']
        //                 },
        //                 {
        //                     label: 'Lock Screen',
        //                     icon: 'pi pi-fw pi-eye-slash',
        //                     routerLink: ['/auth/lockscreen']
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Crud',
        //             icon: 'pi pi-fw pi-pencil',
        //             routerLink: ['/pages/crud']
        //         },

        //         {
        //             label: 'Invoice',
        //             icon: 'pi pi-fw pi-dollar',
        //             routerLink: ['/pages/invoice']
        //         },
        //         {
        //             label: 'About Us',
        //             icon: 'pi pi-fw pi-user',
        //             routerLink: ['/pages/aboutus']
        //         },
        //         {
        //             label: 'Help',
        //             icon: 'pi pi-fw pi-question-circle',
        //             routerLink: ['/pages/help']
        //         },
        //         {
        //             label: 'Not Found',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             routerLink: ['/pages/notfound']
        //         },
        //         {
        //             label: 'Empty',
        //             icon: 'pi pi-fw pi-circle-off',
        //             routerLink: ['/pages/empty']
        //         },
        //         {
        //             label: 'FAQ',
        //             icon: 'pi pi-fw pi-question',
        //             routerLink: ['/pages/faq']
        //         },
        //         {
        //             label: 'Contact Us',
        //             icon: 'pi pi-fw pi-phone',
        //             routerLink: ['/pages/contact']
        //         }
        //     ]
        // },
        // {
        //     label: 'E-Commerce',
        //     icon: 'pi pi-fw pi-wallet',
        //     path: '/ecommerce',
        //     items: [
        //         {
        //             label: 'Product Overview',
        //             icon: 'pi pi-fw pi-image',
        //             routerLink: ['ecommerce/product-overview']
        //         },
        //         {
        //             label: 'Product List',
        //             icon: 'pi pi-fw pi-list',
        //             routerLink: ['ecommerce/product-list']
        //         },
        //         {
        //             label: 'New Product',
        //             icon: 'pi pi-fw pi-plus',
        //             routerLink: ['ecommerce/new-product']
        //         },
        //         {
        //             label: 'Shopping Cart',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             routerLink: ['ecommerce/shopping-cart']
        //         },
        //         {
        //             label: 'Checkout Form',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['ecommerce/checkout-form']
        //         },
        //         {
        //             label: 'Order History',
        //             icon: 'pi pi-fw pi-history',
        //             routerLink: ['ecommerce/order-history']
        //         },
        //         {
        //             label: 'Order Summary',
        //             icon: 'pi pi-fw pi-file',
        //             routerLink: ['ecommerce/order-summary']
        //         }
        //     ]
        // },
        // {
        //     label: 'User Management',
        //     icon: 'pi pi-fw pi-user',
        //     path: '/profile',
        //     items: [
        //         {
        //             label: 'List',
        //             icon: 'pi pi-fw pi-list',
        //             routerLink: ['profile/list']
        //         },
        //         {
        //             label: 'Create',
        //             icon: 'pi pi-fw pi-plus',
        //             routerLink: ['profile/create']
        //         }
        //     ]
        // },
        // {
        //     label: 'Hierarchy',
        //     icon: 'pi pi-fw pi-align-left',
        //     path: '/hierarchy',
        //     items: [
        //         {
        //             label: 'Submenu 1',
        //             icon: 'pi pi-fw pi-align-left',
        //             path: '/hierarchy/submenu_1',
        //             items: [
        //                 {
        //                     label: 'Submenu 1.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/hierarchy/submenu_1/submenu_1_1',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.3',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 1.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/hierarchy/submenu_1/submenu_1_2',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Submenu 2',
        //             icon: 'pi pi-fw pi-align-left',
        //             path: '/hierarchy/submenu_2',
        //             items: [
        //                 {
        //                     label: 'Submenu 2.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/hierarchy/submenu_2/submenu_2_1',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 2.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 2.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/hierarchy/submenu_2/submenu_2_2',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // {
        //     label: 'Start',
        //     icon: 'pi pi-fw pi-download',
        //     path: '/start',
        //     items: [
        //         {
        //             label: 'Buy Now',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             url: ['https://www.primefaces.org/store']
        //         },
        //         {
        //             label: 'Documentation',
        //             icon: 'pi pi-fw pi-info-circle',
        //             routerLink: ['/documentation']
        //         }
        //     ]
        // }
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/admin/dashboard']
        },
        {
            label: 'Auditor Dashboard',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/admin/auditor-dashboard']
        },
        {
            label: 'Organization',
            icon: 'pi pi-fw pi-building',
            items: [
                {
                    label: 'Company',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/audits/organization/company']
                },
                {
                    label: 'Divisions',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/audits/organization/divisions']
                },
                {
                    label: 'Sub-Divisions',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/audits/organization/sub-divisions']
                },
                {
                    label: 'Client Org Chart',
                    icon: 'pi pi-fw pi-share-alt',
                    routerLink: ['/audits/organization/client-org-chart']
                }
            ]
        },
        {
            label: 'Audit Team',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Audit Team Member',
                    icon: 'pi pi-fw pi-user',
                    routerLink: ['/audits/audit-team/member']
                },
                {
                    label: 'Audit Team Chart',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/audits/audit-team/audit-team-chart']
                }
            ]
        },
        {
            label: 'Audit Calendar',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Events & Meetings',
                    icon: 'pi pi-fw pi-calendar-clock',
                    routerLink: ['/audits/audit-calendar/events-meetings']
                },
                {
                    label: 'Notifications',
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/audits/audit-calendar/notifications']
                }
            ]
        },
        {
            label: 'Audit Plan',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Risks',
                    icon: 'pi pi-fw pi-exclamation-triangle',
                    routerLink: ['/audits/audit-plan/risks']
                },
                {
                    label: 'Audit Scope',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/audits/audit-plan/audit-scope']
                },
                 {
                    label: 'Scope Jobs',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/audits/audit-plan/scope-jobs']
                },
                {
                    label: 'Audit Plan',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/audits/audit-plan/audit-plan-selector']
                },
                
                // {
                //     label: 'View Plan',
                //     icon: 'pi pi-fw pi-calendar',
                //     routerLink: ['/apps/audit-plan']
                // },
                
                // {
                //     label: 'Audit Report',
                //     icon: 'pi pi-fw pi-question-circle',
                //     routerLink: ['/apps/audit-reports']
                // },
                // {
                //     label: 'Add Audit Report',
                //     icon: 'pi pi-fw pi-question-circle',
                //     routerLink: ['/apps/add-report']
                // },
               
            ]
        },
        {
            label: 'Audit Execution',
            icon: 'pi pi-fw pi-play',
            items: [
                {
                    label: 'RFI Management',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/audits/audit-execution/manage-rfi']
                },
                {
                    label: 'Evidence',
                    icon: 'pi pi-fw pi-file-check',
                    routerLink: ['/audits/audit-execution/evidence-list']
                },
                {
                    label: 'Observation',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/audits/audit-execution/observation-list']
                },
                {
                    label: 'Findings',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/audits/audit-execution/findings']
                },
                {
                    label: 'Recommendation',
                    icon: 'pi pi-fw pi-thumbs-up',
                    routerLink: ['/audits/audit-execution/recommendation-list']
                },

                {
                    label: 'Working papers',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/audits/audit-execution/working-papers']
                },
                {
                    label: 'Assign Auditors',
                    icon: 'pi pi-fw pi-thumbs-up',
                    routerLink: ['/audits/audit-execution/assign-auditors']
                },
                {
                    label: 'Re-assign Auditors',
                    icon: 'pi pi-fw pi-thumbs-up',
                    routerLink: ['/audits/audit-execution/reassign-auditors']
                }
            ]
        },
        {
            label: 'Libraries',
            icon: 'pi pi-fw pi-book',
            items: [
                {
                    label: 'Regulation Library',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/audits/libraries/regulations']
                },
                {
                    label: 'Audit Scope Library',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['/audits/libraries/audit-scope-library']
                },
                {
                    label: 'RFI Management Library',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/audits/libraries/rfi-management-library']
                },
            ]
        },
        {
            label: 'Follow Up',
            icon: 'pi pi-fw pi-refresh',
            items: [
                {
                    label: 'Follow Up',
                    icon: 'pi pi-fw pi-refresh',
                    routerLink: ['/audits/follow-up']
                }
            ]
        },
        {
            label: 'Look Up',
            icon: 'pi pi-fw pi-refresh',
            items: [
                {
                    label: 'Industry type',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/industry-type']
                }
                ,
                {
                    label: 'Ownership type',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/ownership-type']
                },
                {
                    label: 'Entity type',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/entity-type']
                },
                {
                    label: 'Revenue Bracket',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/revenue-bracket']
                }
                ,
                {
                    label: 'Next Audit Cycle',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/next-audit-cycle']
                }
                ,
                {
                    label: 'Areas Of Expertise',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/areas-of-expertise']
                }
                ,
                {
                    label: 'Evidence Type',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/evidence-type']
                }
                ,
                {
                    label: 'Related Functions',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/related-functions']
                }
                ,
                {
                    label: 'RFI Category',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/admin/look-up/rfi-category']
                },
                {
                    label: 'Risk Rating',
                    icon: 'pi pi-fw pi-shield',
                    routerLink: ['/admin/look-up/risk-ratings']
                },
                {
                    label: 'Risk Status',
                    icon: 'pi pi-fw pi-info-circle',
                    routerLink: ['/admin/look-up/risk-statuses']
                },
                {
                    label: 'Risk Category',
                    icon: 'pi pi-fw pi-tags',
                    routerLink: ['/admin/look-up/risk-categories']
                },
                {
                    label: 'Risk Owner',
                    icon: 'pi pi-fw pi-id-card',
                    routerLink: ['/admin/look-up/risk-owners']
                },
                {
                    label: 'Audit Frequency',
                    icon: 'pi pi-fw pi-clock',
                    routerLink: ['/admin/look-up/audit-frequencies']
                },
                {
                    label: 'Audit Mode',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/admin/look-up/audit-modes']
                },
                {
                    label: 'Scope Type',
                    icon: 'pi pi-fw pi-th-large',
                    routerLink: ['/admin/look-up/scope-types']
                },
                {
                    label: 'Sampling Methodology',
                    icon: 'pi pi-fw pi-chart-scatter',
                    routerLink: ['/admin/look-up/sampling-methodologies']
                },
                {
                    label: 'Hourly Rates',
                    icon: 'pi pi-fw pi-dollar',
                    routerLink: ['/admin/look-up/hourly-rates']
                },
                {
                    label: 'Applicable Frameworks',
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/admin/look-up/applicable-frameworks']
                },
                {
                    label: 'Department Type',
                    icon: 'pi pi-fw pi-book',
                    routerLink: ['/admin/look-up/department-type']
                },
            ]
        },
        {
            label: 'Review',
            icon: 'pi pi-fw pi-requests',
            items: [
                {
                    label: 'Organization Requests',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/admin/review/organization-requests']
                },
                {
                    label: 'scope Requests',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/admin/review/scope-requests']
                },
                {
                    label: 'Risk Requests',
                    icon: 'pi pi-fw pi-thumbs-up',
                    routerLink: ['/admin/review/risk-approval-list']
                },
                {
                    label: 'Execution Requests',
                    icon: 'pi pi-fw pi-thumbs-up',
                    routerLink: ['/admin/review/approval-list']
                },
                {
                    label: 'Library Requests',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/admin/review/library-requests']
                },
                {
                    label: 'Draft Reports',
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/admin/review/draft-reports']
                }
                ,
                {
                    label: ' Working papers ',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/admin/review/working-papers']
                }
            ]
        },
        {
            label: 'Audit Report',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Templates',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/audits/audit-report/report-templates']
                },
                // {
                //     label: 'Select Audit Results',
                //     icon: 'pi pi-fw pi-question-circle',
                //     routerLink: ['/audits/audit-report/audit-description-picker']
                // },
                {
                    label: 'Generate Report',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/audits/audit-report/reports-lists']
                },
                {
                    label: 'Download Report',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/audits/audit-report/download-report']
                },
                {
                    label: 'Upload Report',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/audits/audit-report/upload-report']
                },
            ]
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/user/user-list']
                },
                {
                    label: 'Roles',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/user/role']
                }
            ]
        },
        {
            label: 'Client',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/client/client-dashboard']
                },
                {
                    label: 'Scope-summary',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/client/scope-summary']
                },
                {
                    label: 'RFI Management',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/client/manage-client-rfi']
                },
                {
                    label: 'Admin Audit Team Chart',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/client/cfo-audit-team-chart']
                },


                {
                    label: 'Dept Audit Team Chart',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/client/dept-head-audit-team-chart']
                }
            ]
        }
    ];
}
