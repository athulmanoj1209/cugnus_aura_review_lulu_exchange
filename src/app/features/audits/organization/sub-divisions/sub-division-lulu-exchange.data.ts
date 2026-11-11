// Sub-division seed used when CLIENT_MODE_VALUE is 'internal-audit' and
// INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a single organisation
// (Lulu International Exchange) auditing itself. Same StaticCompany/
// StaticDivision/StaticSubDivision shape and field set as the DAR Exchange
// seed in sub-division-static-indi-org.data.ts; only the mock data differs.
//
// One division-wrapper entry per division in division-lulu-exchange.data.ts:
// IT DEPT (SOFTWARE / HARDWARE / CYBER SECURITY), RISK DEPT and FRAUD DEPT
// (no sub-divisions), BRANCH OPERATIONS (Branch 1 / Branch 2).
//
// Scopes / sub-scopes mirror audit-scope-static-lulu-org.data.ts: sub-division
// scopes sit on each sub-division; RISK DEPT and FRAUD DEPT (no sub-divisions)
// carry their scopes directly on the division wrapper (`scopes`).

import type { StaticCompany } from './models/sub-division-static-data.model';

export const LULU_EXCHANGE_SUB_DIVISION_COMPANIES: StaticCompany[] = [
  {
    "id": "lulu-international-exchange",
    "companyName": "Lulu International Exchange",
    "tag": "LULU",
    "color": "#0b6e75",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "LULU-BR-14",
        "divisionName": "IT DEPT",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "LULU-BR-14-D1",
            "subDivisionName": "SOFTWARE",
            "subDivisionType": "department",
            "departmentType": "information-technology",
            "company": "lulu-international-exchange",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "James Wilson",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@luluexchange.example",
            "contactPhone": "+971 4 000 0000",
            "description": "Lulu International Exchange department.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 6,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Information Technology / Software Applications", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" }
            ],
            "createdAt": "2026-01-03T09:00:00.000Z"
          },
          {
            "subDivisionCode": "LULU-BR-14-D2",
            "subDivisionName": "HARDWARE",
            "subDivisionType": "department",
            "departmentType": "information-technology",
            "company": "lulu-international-exchange",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "James Wilson",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@luluexchange.example",
            "contactPhone": "+971 4 000 0000",
            "description": "Lulu International Exchange department.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 6,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "IT Infrastructure / Hardware & Data Centre", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-03T09:00:00.000Z"
          },
          {
            "subDivisionCode": "LULU-BR-14-D3",
            "subDivisionName": "CYBER SECURITY",
            "subDivisionType": "department",
            "departmentType": "information-technology",
            "company": "lulu-international-exchange",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "James Wilson",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@luluexchange.example",
            "contactPhone": "+971 4 000 0000",
            "description": "Lulu International Exchange department.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 6,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Cybersecurity / Information Security", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" }
            ],
            "createdAt": "2026-01-03T09:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "LULU-BR-06",
        "divisionName": "RISK DEPT",
        "hasSubDivision": false,
        "subDivisions": [],
        "scopes": [
          { "scopeName": "Risk Management / Business Continuity", "scopeType": "functional", "auditFrequency": "monthly", "riskRating": "high" }
        ]
      },
      {
        "divisionCode": "LULU-BR-05",
        "divisionName": "FRAUD DEPT",
        "hasSubDivision": false,
        "subDivisions": [],
        "scopes": [
          { "scopeName": "Fraud Risk Management / Anti-Fraud Controls", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" }
        ]
      },
      {
        "divisionCode": "LULU-BR-12",
        "divisionName": "BRANCH OPERATIONS",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "LULU-BR-12-D1",
            "subDivisionName": "Branch 1",
            "subDivisionType": "department",
            "departmentType": "operations",
            "company": "lulu-international-exchange",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Fatima Al Zaabi",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "info@luluexchange.example",
            "contactPhone": "+971 4 000 0000",
            "description": "Lulu International Exchange department.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 5,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Administration / Outsourcing of Functions", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "medium" }
            ],
            "createdAt": "2026-01-05T09:00:00.000Z"
          },
          {
            "subDivisionCode": "LULU-BR-12-D2",
            "subDivisionName": "Branch 2",
            "subDivisionType": "department",
            "departmentType": "operations",
            "company": "lulu-international-exchange",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Ahmed Al Mansoori",
            "riskRating": "high",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "info@luluexchange.example",
            "contactPhone": "+971 4 000 0000",
            "description": "Lulu International Exchange department.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 11,
            "operationalSince": "2009-01-01",
            "parentSubDivisions": [],
            "scopes": [
              { "scopeName": "Branch Operations / Operational Controls", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
              {
                "scopeName": "AML/CFT Compliance", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "high",
                "subScopes": [
                  { "subScopeName": "Policy, Governance & Training", "subScopeType": "functional", "auditFrequency": "annually", "riskRating": "high" },
                  { "subScopeName": "Transaction Monitoring, Screening & Risk Assessment", "subScopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" },
                  { "subScopeName": "Compliance Reporting & Oversight", "subScopeType": "functional", "auditFrequency": "quarterly", "riskRating": "medium" }
                ]
              },
              { "scopeName": "Operations and Other subDivisions", "scopeType": "functional", "auditFrequency": "annually", "riskRating": "medium" },
              { "scopeName": "Quality Check — Transaction Monitoring and Sanction Screening Alert Management", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" },
              { "scopeName": "Consumer Protection and Market Conduct", "scopeType": "functional", "auditFrequency": "quarterly", "riskRating": "high" }
            ],
            "createdAt": "2026-01-05T09:00:00.000Z"
          }
        ]
      }
    ]
  }
];
