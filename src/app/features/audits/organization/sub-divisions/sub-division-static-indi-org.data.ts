// Department seed used when CLIENT_MODE_VALUE is 'internal-audit' — a single
// organisation (DAR Exchange) auditing itself, as opposed to the multi-company
// audit-firm roster in department-static-data.ts. Same StaticCompany/
// StaticBranch/StaticDepartment shape and field set; only the mock data
// differs, and (per the field-swap this module was given) `branchName`
// carries a report department label.
//
// One branch-wrapper entry per branch in branch-static-indi-org.data.ts
// (DAR-BR-04 HR Dept, DAR-BR-03 Finance, DAR-BR-14 IT, DAR-BR-12 Treasury
// Dealings / Branch Operations), so every branch shown on the Branches page
// also has a matching entry here. HR Dept and IT reuse the same simple
// 4-scope sub-division content already present in division-static-indi-org.data.ts's
// own nested sub-divisions for those two divisions; Finance and Treasury
// Dealings / Division Operations keep their original richer scope/sub-scope
// content (the 2 richest-scope entries originally trimmed from the full
// 16-sub-division set), and their nested `subDivisionName` stays "BRANCH 1" /
// "BRANCH 2" per that original trim.

import type { StaticCompany } from './models/sub-division-static-data.model';
import { INTERNAL_AUDIT_CLIENT_KEY_VALUE } from '@/app/core/config/client-mode';
import { XYZ_BROADCAST_SUB_DIVISION_COMPANIES } from './sub-division-static-xyz-broadcast.data';
import { LULU_EXCHANGE_SUB_DIVISION_COMPANIES } from './sub-division-lulu-exchange.data';

export const DAR_EXCHANGE_SUB_DIVISION_COMPANIES: StaticCompany[] = [
  {
    "id": "abc-broadcast",
    "companyName": "ABC Broadcast",
    "tag": "ABC",
    "color": "#0b6e75",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "ABC-BR-04",
        "divisionName": "HR Dept",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-04-D1",
            "subDivisionName": "HR Dept",
            "subDivisionType": "department",
            "departmentType": "human-resources",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 5,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "medium" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "low" }
            ],
            "createdAt": "2026-01-13T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-03",
        "divisionName": "Finance",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-03-D1",
            "subDivisionName": "Finance",
            "subDivisionType": "department",

            "departmentType": "finance",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Priya Sharma",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 9,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-14T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-14",
        "divisionName": "IT",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-14-D1",
            "subDivisionName": "IT",
            "subDivisionType": "department",

            "departmentType": "information-technology",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "James Wilson",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 6,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-03T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-12",
        "divisionName": "OPS",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-12-D1",
            "subDivisionName": "BRANCH 1",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 5,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "medium" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "low" }
            ],
            "createdAt": "2026-01-05T09:00:00.000Z"
          },
          {
            "subDivisionCode": "ABC-BR-12-D2",
            "subDivisionName": "BRANCH 2",
            "subDivisionType": "department",

            "departmentType": "operations",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Ahmed Al Mansoori",
            "riskRating": "high",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 11,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "TOT Quality", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "General Security", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-05T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-05",
        "divisionName": "AML",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-05-D1",
            "subDivisionName": "AML",
            "subDivisionType": "department",

            "departmentType": "compliance",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Ravi Kumar",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 7,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-06T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-06",
        "divisionName": "RISK",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-06-D1",
            "subDivisionName": "RISK",
            "subDivisionType": "department",

            "departmentType": "risk-management",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Rajeev Nanda",
            "riskRating": "high",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-008",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-008",
            "numberOfEmployees": 6,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-07T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-07",
        "divisionName": "CONSUMER PROTECTION",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ABC-BR-07-D1",
            "subDivisionName": "CONSUMER PROTECTION",
            "subDivisionType": "department",

            "departmentType": "consumer-protection",
            "company": "abc-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Johnson",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-009",
            "contactEmail": "info@abcbroadcast.example",
            "contactPhone": "+971 4 000 0000",
            "description": "ABC Broadcast department.",
            "subDivisionHead": "user-009",
            "numberOfEmployees": 5,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Governance", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "Internal Controls", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "medium" },
              { "scopeName": "General Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Follow-up Audit", "scopeType": "independent", "auditFrequency": "quarterly", "riskRating": "low" }
            ],
            "createdAt": "2026-01-08T09:00:00.000Z"
          }
        ]
      }
    ]
  }
];


/**
 * The active internal-audit org's department roster, picked by
 * INTERNAL_AUDIT_CLIENT_KEY_VALUE — same switch branch-static-indi-org.data.ts
 * (BRANCH_INDI_ORG_COMPANIES) and audit-scope-static-indi-org.data.ts
 * (SCOPE_INDI_ORG_COMPANIES) already make, so every consumer (audit findings,
 * observations, recommendations, working papers, ...) shows the active
 * client's own company/branch/department names.
 */
export const SUB_DIVISION_INDI_ORG_COMPANIES: StaticCompany[] =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? XYZ_BROADCAST_SUB_DIVISION_COMPANIES
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? LULU_EXCHANGE_SUB_DIVISION_COMPANIES
  : DAR_EXCHANGE_SUB_DIVISION_COMPANIES;