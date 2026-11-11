// Self-contained mock data for the SubDivisions page. Unlike the rest of the
// app (see app.config.ts), this page does NOT read `crowe_all_static_extended.json`
// at bootstrap — everything it renders is compiled into the bundle from here.
//
// Hierarchy mirrors the shared model in `../divisions/list/division-list.component.ts`
// (Company → Division → SubDivision → Scope → SubScope) but only carries the
// fields sub-divisions.html actually renders.

import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from './sub-division-static-indi-org.data';
import {
  SubDivisionAuditStatuses,
  SubDivisionCompanyIndustries,
  SUB_DIVISION_DEFAULT_COMPANY_COLOR,
} from './constants/sub-division.constants';
import type {
  CompanyMeta,
  SubDivisionStatus,
  SubDivisionAuditStatus,
  SubDivisionType,
  StaticSubDivision,
  StaticCompany,
  SubDivisionEditableFields,
} from './models/sub-division-static-data.model';

/* ── Shared option lists ──────────────────────────────────────────────────
 * Single source of truth for the Add/Edit Sub-Division form (manage/sub-division.component.ts)
 * and the sub-division profile drawer — both need the same value domains as
 * this file so a sub-division's stored values always match a dropdown option.
 */
export const USER_OPTIONS: { label: string; value: string }[] = [
  { label: 'Ahmed Al Mansoori', value: 'user-001' },
  { label: 'Sarah Johnson', value: 'user-002' },
  { label: 'Mohammed Al Rashid', value: 'user-003' },
  { label: 'Priya Sharma', value: 'user-004' },
  { label: 'James Wilson', value: 'user-005' },
  { label: 'Fatima Al Zaabi', value: 'user-006' },
  { label: 'Ravi Kumar', value: 'user-007' },
];

export const SUB_DIVISION_TYPE_OPTIONS: { label: string; value: SubDivisionType }[] = [
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'human-resources' },
  { label: 'Information Technology', value: 'information-technology' },
  { label: 'Operations', value: 'operations' },
  { label: 'Legal & Compliance', value: 'legal-compliance' },
  { label: 'Internal Audit', value: 'internal-audit' },
  { label: 'Risk Management', value: 'risk-management' },
  { label: 'Marketing & Communications', value: 'marketing-communications' },
  { label: 'Procurement & Supply Chain', value: 'procurement-supply-chain' },
  { label: 'Customer Service', value: 'customer-service' },
  { label: 'Executive Management', value: 'executive-management' },
  { label: 'Administration', value: 'administration' },
];

/* ── Companies ────────────────────────────────────────────────────────────
 * 8 UAE audit-client companies, 5 of which (62.5%) are jewelry businesses,
 * so the sub-division list has real variety for the filters/search/pagination
 * on the page.
 */
const AUDIT_FIRM_SUB_DIVISION_COMPANIES: StaticCompany[] = [
  {
    "id": "al-noor-jewellery",
    "companyName": "Al Noor Jewellery Group",
    "tag": "ANJ",
    "color": "#b8860b",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "ANJ-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ANJ-BR-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "department",

            "departmentType": "finance",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.operations@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551000",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 8,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-23T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "department",

            "departmentType": "human-resources",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gold.diamond.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551037",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-23T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-01-D3",
            "subDivisionName": "Hallmarking & Certification",
            "subDivisionType": "head_office",

            "departmentType": null,
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Mohammed Al Rashid",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "hallmarking.certification@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551074",
            "description": "Hallmarking & Certification sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 18,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-24T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-01-D4",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "al-noor-jewellery",
            "status": "inactive",
            "auditStatus": "approved",
            "submittedBy": "Priya Sharma",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551111",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 23,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-24T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-01-D5",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "legal-compliance",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "James Wilson",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "finance.accounting@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551148",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 28,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-05-24T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ANJ-BR-02-D1",
            "subDivisionName": "Inventory & Warehouse",
            "subDivisionType": "branch",

            "departmentType": null,
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "inventory.warehouse@al-noor-jewellery.com",
            "contactPhone": "+971-4-2552295",
            "description": "Inventory & Warehouse sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 63,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-01T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-02-D2",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "human-resources",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "compliance.aml@al-noor-jewellery.com",
            "contactPhone": "+971-4-2552332",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 8,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-01T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-02-D3",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-005",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "human.resources@al-noor-jewellery.com",
            "contactPhone": "+971-4-2552369",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 13,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-01T20:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-03",
        "divisionName": "Sharjah Warehouse",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ANJ-BR-03-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "representative_office",

            "departmentType": null,
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.operations@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551185",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 33,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              }
            ],
            "createdAt": "2026-05-24T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-03-D2",
            "subDivisionName": "Loss Prevention & Security",
            "subDivisionType": "department",

            "departmentType": "risk-management",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "pending",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "loss.prevention.security@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551222",
            "description": "Loss Prevention & Security sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 38,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-03-D3",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "human.resources@al-noor-jewellery.com",
            "contactPhone": "+971-4-2552406",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 18,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-02T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-BR-03-D4",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "warehouse",

            "departmentType": null,
            "company": "al-noor-jewellery",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "it.systems@al-noor-jewellery.com",
            "contactPhone": "+971-4-2552443",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 23,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-02T08:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "zumurrud-diamonds",
    "companyName": "Zumurrud Diamonds LLC",
    "tag": "ZUM",
    "color": "#0e9488",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "ZUM-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ZUM-BR-01-D1",
            "subDivisionName": "Design & Merchandising",
            "subDivisionType": "department",

            "departmentType": "marketing-communications",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Ahmed Al Mansoori",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "design.merchandising@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551259",
            "description": "Design & Merchandising sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 43,
            "operationalSince": "2017-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "department",

            "departmentType": "procurement-supply-chain",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "approved",
            "submittedBy": "Sarah Johnson",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "gold.diamond.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551296",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 48,
            "operationalSince": "2018-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-01-D3",
            "subDivisionName": "E-Commerce",
            "subDivisionType": "factory",

            "departmentType": null,
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Mohammed Al Rashid",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "e.commerce@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551333",
            "description": "E-Commerce sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": null,
            "numberOfEmployees": 53,
            "operationalSince": "2019-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-25T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-01-D4",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "finance.accounting@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551370",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 58,
            "operationalSince": "2020-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-05-26T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-01-D5",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "internal-audit",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "compliance.aml@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552480",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-02T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-01-D6",
            "subDivisionName": "Human Resources",
            "subDivisionType": "project_office",

            "departmentType": null,
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-006",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "human.resources@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552517",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 33,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-02T20:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-02",
        "divisionName": "Abu Dhabi Division",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ZUM-BR-02-D1",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "department",

            "departmentType": "marketing-communications",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "it.systems@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552554",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 38,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-03T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-02-D2",
            "subDivisionName": "Procurement",
            "subDivisionType": "department",

            "departmentType": "procurement-supply-chain",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552591",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": null,
            "numberOfEmployees": 43,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-03T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-02-D3",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "subsidiary",

            "departmentType": null,
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "quality.assurance@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552628",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 48,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-03T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-03",
        "divisionName": "Sharjah Representative Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ZUM-BR-03-D1",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "quality.assurance@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552665",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 53,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-03T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-BR-03-D2",
            "subDivisionName": "Logistics",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "zumurrud-diamonds",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-003",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "logistics@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2552702",
            "description": "Logistics sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 58,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-04T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "falcon-gulf-jewellery",
    "companyName": "Falcon Gulf Jewellery Trading",
    "tag": "FGJ",
    "color": "#a13d63",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "FGJ-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "FGJ-BR-01-D1",
            "subDivisionName": "Procurement",
            "subDivisionType": "head_office",

            "departmentType": null,
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-006",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "procurement@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2552739",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 63,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-04T08:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-01-D2",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "department",

            "departmentType": "human-resources",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "quality.assurance@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2552776",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 8,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-04T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "FGJ-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "FGJ-BR-02-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-005",
            "submittedDate": "2026-08-05",
            "dueDate": null,
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "retail.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551407",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 63,
            "operationalSince": "2021-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              }
            ],
            "createdAt": "2026-05-26T08:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-02-D2",
            "subDivisionName": "Showroom Operations",
            "subDivisionType": "branch",

            "departmentType": null,
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "showroom.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551444",
            "description": "Showroom Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 8,
            "operationalSince": "2022-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T14:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-02-D3",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "department",

            "departmentType": "human-resources",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "approved",
            "submittedBy": "Ravi Kumar",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551481",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T20:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-02-D4",
            "subDivisionName": "Logistics",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "logistics@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2552813",
            "description": "Logistics sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-04T20:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-02-D5",
            "subDivisionName": "Customer Service",
            "subDivisionType": "representative_office",

            "departmentType": null,
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2552850",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 18,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-05T02:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "FGJ-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "FGJ-BR-03-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Ahmed Al Mansoori",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551518",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 18,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-27T02:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-BR-03-D2",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "falcon-gulf-jewellery",
            "status": "inactive",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "finance.accounting@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551555",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 23,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-27T08:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "marwa-gold-gems",
    "companyName": "Marwa Gold & Gems",
    "tag": "MGG",
    "color": "#c98a1a",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "MGG-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "MGG-BR-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "warehouse",

            "departmentType": null,
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.operations@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551592",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-05-27T14:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-01-D2",
            "subDivisionName": "Hallmarking & Certification",
            "subDivisionType": "department",

            "departmentType": "internal-audit",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Priya Sharma",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "hallmarking.certification@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551629",
            "description": "Hallmarking & Certification sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 33,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              }
            ],
            "createdAt": "2026-05-27T20:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-01-D3",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "risk-management",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "approved",
            "submittedBy": "James Wilson",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "human.resources@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551666",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 38,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T02:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-01-D4",
            "subDivisionName": "Customer Service",
            "subDivisionType": "factory",

            "departmentType": null,
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-007",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "customer.service@marwa-gold-gems.com",
            "contactPhone": "+971-4-2552887",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": null,
            "numberOfEmployees": 23,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-05T08:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "MGG-BR-02-D1",
            "subDivisionName": "Finance & Accounts",
            "subDivisionType": "department",

            "departmentType": "internal-audit",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "finance.accounts@marwa-gold-gems.com",
            "contactPhone": "+971-4-2552924",
            "description": "Finance & Accounts sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-05T14:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-02-D2",
            "subDivisionName": "Inventory & Warehouse",
            "subDivisionType": "department",

            "departmentType": "risk-management",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehouse@marwa-gold-gems.com",
            "contactPhone": "+971-4-2552961",
            "description": "Inventory & Warehouse sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": null,
            "numberOfEmployees": 33,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-05T20:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-02-D3",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "project_office",

            "departmentType": null,
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "compliance.aml@marwa-gold-gems.com",
            "contactPhone": "+971-4-2552998",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 38,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-06T02:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "MGG-BR-03-D1",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "procurement-supply-chain",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "compliance.aml@marwa-gold-gems.com",
            "contactPhone": "+971-4-2553035",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 43,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-06T08:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-BR-03-D2",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "customer-service",
            "company": "marwa-gold-gems",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "human.resources@marwa-gold-gems.com",
            "contactPhone": "+971-4-2553072",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": null,
            "numberOfEmployees": 48,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-06T14:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "kanz-al-emarat",
    "companyName": "Kanz Al Emarat Jewellery",
    "tag": "KAE",
    "color": "#7a1ac4",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "KAE-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "KAE-BR-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "subsidiary",

            "departmentType": null,
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.operations@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551703",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 43,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T08:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "department",

            "departmentType": "procurement-supply-chain",
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "gold.diamond.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551740",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 48,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T14:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-01-D3",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "customer-service",
            "company": "kanz-al-emarat",
            "status": "inactive",
            "auditStatus": "pending",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "finance.accounting@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551777",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 53,
            "operationalSince": "2017-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-28T20:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-01-D4",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "head_office",

            "departmentType": null,
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Johnson",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551814",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 58,
            "operationalSince": "2018-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-05-29T02:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-01-D5",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-004",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "compliance.aml@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553109",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 53,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-06T20:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "KAE-BR-02",
        "divisionName": "Abu Dhabi Warehouse",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "KAE-BR-02-D1",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "human.resources@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553146",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 58,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-07T02:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-02-D2",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "branch",

            "departmentType": null,
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "it.systems@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553183",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 63,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-07T08:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-02-D3",
            "subDivisionName": "Procurement",
            "subDivisionType": "department",

            "departmentType": "human-resources",
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "procurement@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553220",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 8,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-07T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "KAE-BR-03",
        "divisionName": "Sharjah Factory",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "KAE-BR-03-D1",
            "subDivisionName": "Procurement",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-005",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "procurement@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553257",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 13,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-07T20:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-BR-03-D2",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "representative_office",

            "departmentType": null,
            "company": "kanz-al-emarat",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-001",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "quality.assurance@kanz-al-emarat.com",
            "contactPhone": "+971-4-2553294",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 18,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-08T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "desert-rose-retail",
    "companyName": "Desert Rose Retail Group",
    "tag": "DRR",
    "color": "#1a9dc4",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "DRR-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "DRR-BR-01-D1",
            "subDivisionName": "Sales & Marketing",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "approved",
            "submittedBy": "Mohammed Al Rashid",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2551851",
            "description": "Sales & Marketing sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 63,
            "operationalSince": "2019-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              }
            ],
            "createdAt": "2026-05-29T08:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-01-D2",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "department",

            "departmentType": "finance",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Priya Sharma",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2551888",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 8,
            "operationalSince": "2020-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T14:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-01-D3",
            "subDivisionName": "Customer Service",
            "subDivisionType": "warehouse",

            "departmentType": null,
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2551925",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2021-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T20:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-01-D4",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "finance.accounting@desert-rose-retail.com",
            "contactPhone": "+971-4-2551962",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 18,
            "operationalSince": "2022-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-30T02:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-01-D5",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "department",

            "departmentType": "legal-compliance",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "it.systems@desert-rose-retail.com",
            "contactPhone": "+971-4-2553331",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 23,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-08T08:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-01-D6",
            "subDivisionName": "Procurement",
            "subDivisionType": "factory",

            "departmentType": null,
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement@desert-rose-retail.com",
            "contactPhone": "+971-4-2553368",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 28,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-08T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "DRR-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "DRR-BR-02-D1",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "department",

            "departmentType": "risk-management",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "quality.assurance@desert-rose-retail.com",
            "contactPhone": "+971-4-2553405",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 33,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-08T20:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-02-D2",
            "subDivisionName": "Logistics",
            "subDivisionType": "department",

            "departmentType": "marketing-communications",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "logistics@desert-rose-retail.com",
            "contactPhone": "+971-4-2553442",
            "description": "Logistics sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 38,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-09T02:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-02-D3",
            "subDivisionName": "Customer Service",
            "subDivisionType": "project_office",

            "departmentType": null,
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-005",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2553479",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 43,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-09T08:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "DRR-BR-03",
        "divisionName": "Sharjah Warehouse",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "DRR-BR-03-D1",
            "subDivisionName": "Customer Service",
            "subDivisionType": "department",

            "departmentType": "customer-service",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2553516",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 48,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-09T14:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-BR-03-D2",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "desert-rose-retail",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.operations@desert-rose-retail.com",
            "contactPhone": "+971-4-2553553",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 53,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-09T20:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "gulf-horizon-logistics",
    "companyName": "Gulf Horizon Logistics",
    "tag": "GHL",
    "color": "#4a4a4a",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "GHL-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "GHL-BR-01-D1",
            "subDivisionName": "Operations",
            "subDivisionType": "subsidiary",

            "departmentType": null,
            "company": "gulf-horizon-logistics",
            "status": "inactive",
            "auditStatus": "pending_approval",
            "submittedBy": "Ravi Kumar",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2551999",
            "description": "Operations sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 23,
            "operationalSince": "2023-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-30T08:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-01-D2",
            "subDivisionName": "Procurement & Supply Chain",
            "subDivisionType": "department",

            "departmentType": "legal-compliance",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "approved",
            "submittedBy": "Ahmed Al Mansoori",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement.supply.chain@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552036",
            "description": "Procurement & Supply Chain sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-05-30T14:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-01-D3",
            "subDivisionName": "Information Technology",
            "subDivisionType": "department",

            "departmentType": "internal-audit",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Sarah Johnson",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "information.technology@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552073",
            "description": "Information Technology sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": null,
            "numberOfEmployees": 33,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              }
            ],
            "createdAt": "2026-05-30T20:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-01-D4",
            "subDivisionName": "Human Resources",
            "subDivisionType": "head_office",

            "departmentType": null,
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "human.resources@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552110",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 38,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T02:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-01-D5",
            "subDivisionName": "Logistics",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "logistics@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553590",
            "description": "Logistics sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": null,
            "numberOfEmployees": 58,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-10T02:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-01-D6",
            "subDivisionName": "Customer Service",
            "subDivisionType": "department",

            "departmentType": "finance",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-006",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "customer.service@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553627",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 63,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-10T08:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "GHL-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "GHL-BR-02-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "branch",

            "departmentType": null,
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-002",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553664",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 8,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-10T14:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-02-D2",
            "subDivisionName": "Finance & Accounts",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "finance.accounts@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553701",
            "description": "Finance & Accounts sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-10T20:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-02-D3",
            "subDivisionName": "Inventory & Warehouse",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "inventory.warehouse@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553738",
            "description": "Inventory & Warehouse sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 18,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-11T02:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "GHL-BR-03",
        "divisionName": "Sharjah Warehouse",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "GHL-BR-03-D1",
            "subDivisionName": "Inventory & Warehouse",
            "subDivisionType": "representative_office",

            "departmentType": null,
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "inventory.warehouse@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553775",
            "description": "Inventory & Warehouse sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 23,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-11T08:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-BR-03-D2",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "internal-audit",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-003",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "compliance.aml@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2553812",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-11T14:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "al-waha-construction",
    "companyName": "Al Waha Construction & Contracting",
    "tag": "AWC",
    "color": "#8a5a1a",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "AWC-BR-01",
        "divisionName": "Dubai Head Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "AWC-BR-01-D1",
            "subDivisionName": "Operations",
            "subDivisionType": "department",

            "departmentType": "marketing-communications",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "operations@al-waha-construction.com",
            "contactPhone": "+971-4-2552147",
            "description": "Operations sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 43,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T08:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-01-D2",
            "subDivisionName": "Legal & Governance",
            "subDivisionType": "warehouse",

            "departmentType": null,
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "James Wilson",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "legal.governance@al-waha-construction.com",
            "contactPhone": "+971-4-2552184",
            "description": "Legal & Governance sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": null,
            "numberOfEmployees": 48,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T14:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-01-D3",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "department",

            "departmentType": "customer-service",
            "company": "al-waha-construction",
            "status": "inactive",
            "auditStatus": "approved",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "finance.accounting@al-waha-construction.com",
            "contactPhone": "+971-4-2552221",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 53,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              }
            ],
            "createdAt": "2026-05-31T20:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-01-D4",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "rejected",
            "submittedBy": "Ravi Kumar",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "quality.assurance@al-waha-construction.com",
            "contactPhone": "+971-4-2552258",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 58,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              }
            ],
            "createdAt": "2026-06-01T02:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-01-D5",
            "subDivisionName": "Inventory & Warehouse",
            "subDivisionType": "factory",

            "departmentType": null,
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-006",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehouse@al-waha-construction.com",
            "contactPhone": "+971-4-2553849",
            "description": "Inventory & Warehouse sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 33,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-11T20:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "AWC-BR-02",
        "divisionName": "Abu Dhabi Subsidiary",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "AWC-BR-02-D1",
            "subDivisionName": "Compliance & AML",
            "subDivisionType": "department",

            "departmentType": "marketing-communications",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "approved",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "compliance.aml@al-waha-construction.com",
            "contactPhone": "+971-4-2553886",
            "description": "Compliance & AML sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 38,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-12T02:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-02-D2",
            "subDivisionName": "Human Resources",
            "subDivisionType": "department",

            "departmentType": "procurement-supply-chain",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "rejected",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "human.resources@al-waha-construction.com",
            "contactPhone": "+971-4-2553923",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": null,
            "numberOfEmployees": 43,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-12T08:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-02-D3",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "project_office",

            "departmentType": null,
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "archived",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "it.systems@al-waha-construction.com",
            "contactPhone": "+971-4-2553960",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 48,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-12T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "AWC-BR-03",
        "divisionName": "Sharjah Division",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "AWC-BR-03-D1",
            "subDivisionName": "IT & Systems",
            "subDivisionType": "department",

            "departmentType": "executive-management",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "pending",
            "submittedBy": "user-007",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "it.systems@al-waha-construction.com",
            "contactPhone": "+971-4-2553997",
            "description": "IT & Systems sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 53,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-12T20:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-BR-03-D2",
            "subDivisionName": "Procurement",
            "subDivisionType": "department",

            "departmentType": "administration",
            "company": "al-waha-construction",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "user-003",
            "submittedDate": "2026-08-10",
            "dueDate": "2026-08-24",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2554034",
            "description": "Procurement sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 58,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "createdAt": "2026-06-13T02:00:00.000Z"
          }
        ]
      }
    ]
  }
];

/**
 * The live sub-division roster every consumer imports. Which seed backs it
 * depends on CLIENT_MODE_VALUE: the multi-company audit-firm roster above, or
 * the single-org DAR Exchange seed in sub-division-static-indi-org.data.ts.
 * Read at module scope (not via DI) for the same reason as
 * DIVISION_STATIC_COMPANIES in division-static-data.ts — this array is imported
 * directly and mutated in place by the helpers below.
 */
export const SUB_DIVISION_STATIC_COMPANIES: StaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? SUB_DIVISION_INDI_ORG_COMPANIES
    : AUDIT_FIRM_SUB_DIVISION_COMPANIES;

/* ── Mutations ────────────────────────────────────────────────────────────
 * There's no backend behind this page — the Add/Edit SubDivision drawer
 * writes straight into this in-memory array so sub-divisions.html reflects
 * additions/edits immediately. Add and edit are separate operations: adding
 * appends a brand-new sub-division; editing only touches the fields the form
 * actually exposes, so it can't clobber data the form doesn't manage
 * (scopes, parentSubDivisions) and it edits in place instead of
 * remove-then-append, so the row doesn't jump to the bottom of its division.
 */

/**
 * Adds a brand-new `sub-division` under `companyId`/`divisionCode`. Always stamps
 * a fresh `createdAt` here (ignoring anything the caller passed), so a
 * newly-added sub-division always sorts to the top of the newest-first list.
 * Also always starts the sub-division at `auditStatus: 'pending_approval'` —
 * the Add SubDivision form has no control for it, so every new sub-division
 * has to clear the Organization Requests approval queue before it's
 * considered live (mirrors `upsertStaticDivision` in division-static-data.ts).
 */
export function upsertStaticSubDivision(
  companyId: string,
  divisionCode: string,
  subDivision: Omit<StaticSubDivision, 'createdAt' | 'auditStatus'>,
  companyMeta?: CompanyMeta,
): void {
  // A division flagged hasSubDivision: false can't take sub-divisions.
  const realDivision = DIVISION_STATIC_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode);
  if (!realDivision?.hasSubDivision) return;

  let company = SUB_DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    company = {
      id: companyId,
      companyName: companyMeta?.companyName ?? companyId,
      tag: companyMeta?.tag ?? companyId.slice(0, 3).toUpperCase(),
      color: companyMeta?.color ?? SUB_DIVISION_DEFAULT_COMPANY_COLOR,
      industry: companyMeta?.industry === SubDivisionCompanyIndustries.Jewelry ? SubDivisionCompanyIndustries.Jewelry
        : companyMeta?.industry === SubDivisionCompanyIndustries.AuditFirm ? SubDivisionCompanyIndustries.AuditFirm
        : SubDivisionCompanyIndustries.Other,
      divisions: [],
    };
    SUB_DIVISION_STATIC_COMPANIES.push(company);
  }
  let division = company.divisions.find(b => b.divisionCode === divisionCode);
  if (!division) {
    division = {
      divisionCode,
      divisionName: realDivision.divisionName,
      hasSubDivision: realDivision.hasSubDivision,
      subDivisions: [],
    };
    company.divisions.push(division);
  }
  division.subDivisions.push({ ...subDivision, auditStatus: SubDivisionAuditStatuses.PendingApproval, createdAt: new Date().toISOString() });
}

/**
 * Updates the sub-division previously identified by `previousSubDivisionCode`,
 * merging in only `updates` (the form's fields) — `scopes`/`parentSubDivisions`
 * on the existing record are left untouched. If `updates.company`/`divisionCode`
 * still point at the sub-division's current division, it's replaced in place
 * (keeping its position); otherwise it's moved to the new division.
 */
export function editStaticSubDivision(previousSubDivisionCode: string, updates: SubDivisionEditableFields): void {
  for (const company of SUB_DIVISION_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      const idx = division.subDivisions.findIndex(d => d.subDivisionCode === previousSubDivisionCode);
      if (idx === -1) continue;

      const { divisionCode: targetDivisionCode, ...fields } = updates;
      const merged: StaticSubDivision = { ...division.subDivisions[idx], ...fields };

      const targetDivision = SUB_DIVISION_STATIC_COMPANIES
        .find(c => c.id === updates.company)?.divisions
        .find(b => b.divisionCode === targetDivisionCode);
      if (!targetDivision) return;

      if (targetDivision === division) {
        division.subDivisions[idx] = merged;
      } else {
        division.subDivisions.splice(idx, 1);
        targetDivision.subDivisions.push(merged);
      }
      return;
    }
  }
}

/** Sets a sub-division's `status` in place (used by the Activate/Deactivate action). */
export function setSubDivisionStatus(subDivisionCode: string, status: SubDivisionStatus): void {
  for (const company of SUB_DIVISION_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      const subDivision = division.subDivisions.find(d => d.subDivisionCode === subDivisionCode);
      if (subDivision) {
        subDivision.status = status;
        return;
      }
    }
  }
}

/** Sets a sub-division's `auditStatus` in place (used by the Organization Requests approve/reject action). */
export function setSubDivisionAuditStatus(subDivisionCode: string, auditStatus: SubDivisionAuditStatus): void {
  for (const company of SUB_DIVISION_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      const subDivision = division.subDivisions.find(d => d.subDivisionCode === subDivisionCode);
      if (subDivision) {
        subDivision.auditStatus = auditStatus;
        return;
      }
    }
  }
}
