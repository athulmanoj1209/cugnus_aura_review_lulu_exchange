// Department seed used when CLIENT_MODE_VALUE is 'internal-audit' — a single
// organisation (XYZ Broadcast) auditing itself, as opposed to the multi-company
// audit-firm roster in department-static-data.ts. Same StaticCompany/
// StaticBranch/StaticDepartment shape and field set; only the mock data
// differs.
//
// One branch-wrapper entry per branch in branch-static-xyz-broadcast.data.ts
// (XYZ-BR-01 Dubai), so every branch shown on the Branches page also has a
// matching entry here. Its 5 departments mirror that branch's own nested
// departments (Broadcasting / Television Operations, Newspaper / Publishing,
// Commercial / Advertising Sales, Commercial / Partnerships, Finance), taken
// from the Media Company Internal Audit plan. Each department's `scopes`
// mirrors its top-level scope and sub-scopes in
// audit-scope-static-xyz-org.data.ts — keep the two in sync.

import type { StaticCompany } from './models/sub-division-static-data.model';

export const XYZ_BROADCAST_SUB_DIVISION_COMPANIES: StaticCompany[] = [
  {
    "id": "xyz-broadcast",
    "companyName": "XYZ Broadcast",
    "tag": "XYZ",
    "color": "#6a1b9a",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "XYZ-BR-01",
        "divisionName": "Dubai",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "XYZ-BR-01-D1",
            "subDivisionName": "Broadcasting / Television Operations",
            "subDivisionType": "department",
            "departmentType": "Not Applicable",
            "company": "xyz-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Thomas",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Broadcast interruption, scheduling errors, unauthorized system access, transmission failure, or inadequate backup may disrupt services and affect audience trust.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 14,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Broadcasting Operations", "scopeType": "subDivisional", "auditFrequency": "monthly", "riskRating": "high",
                "subScopes": [
                  { "subScopeName": "Transmission & Playout", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" },
                  { "subScopeName": "Studio & Control Room Access", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" }
                ]
              }
            ],
            "createdAt": "2026-01-02T09:00:00.000Z"
          },
          {
            "subDivisionCode": "XYZ-BR-01-D2",
            "subDivisionName": "Newspaper / Publishing",
            "subDivisionType": "department",
            "departmentType": "Not Applicable",
            "company": "xyz-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Thomas",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Editorial or production errors, inaccurate circulation records, delayed publication, or weak distribution controls may cause financial and reputational impact.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Newspaper & Publishing", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "medium",
                "subScopes": [
                  { "subScopeName": "Editorial-to-Publication Workflow", "subScopeType": "controls", "auditFrequency": "quarterly", "riskRating": "medium" },
                  { "subScopeName": "Print Production & Distribution", "subScopeType": "controls", "auditFrequency": "quarterly", "riskRating": "medium" }
                ]
              }
            ],
            "createdAt": "2026-01-02T09:00:00.000Z"
          },
          {
            "subDivisionCode": "XYZ-BR-01-D3",
            "subDivisionName": "Commercial / Advertising Sales",
            "subDivisionType": "department",
            "departmentType": "marketing-communications",
            "company": "xyz-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Thomas",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Unbilled airtime, unauthorized discounts, incorrect rate application, or incomplete billing may result in significant revenue leakage.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 9,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Advertising & Commercial Revenue", "scopeType": "subDivisional", "auditFrequency": "monthly", "riskRating": "high",
                "subScopes": [
                  { "subScopeName": "Ad Booking to Broadcast/Publication", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" },
                  { "subScopeName": "Rate Cards & Discounts", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" }
                ]
              }
            ],
            "createdAt": "2026-01-02T09:00:00.000Z"
          },
          {
            "subDivisionCode": "XYZ-BR-01-D4",
            "subDivisionName": "Commercial / Partnerships",
            "subDivisionType": "department",
            "departmentType": "marketing-communications",
            "company": "xyz-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Thomas",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Unapproved commercial terms, failure to deliver sponsorship commitments, or inaccurate billing may cause revenue loss and contractual disputes.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 6,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Sponsorship & Commercial Partnerships", "scopeType": "subDivisional", "auditFrequency": "quarterly", "riskRating": "medium",
                "subScopes": [
                  { "subScopeName": "Contractual Obligations", "subScopeType": "controls", "auditFrequency": "quarterly", "riskRating": "medium" }
                ]
              }
            ],
            "createdAt": "2026-01-02T09:00:00.000Z"
          },
          {
            "subDivisionCode": "XYZ-BR-01-D5",
            "subDivisionName": "Finance",
            "subDivisionType": "department",
            "departmentType": "finance",
            "company": "xyz-broadcast",
            "status": "active",
            "auditStatus": "pending_approval",
            "submittedBy": "Sarah Thomas",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-008",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Incorrect accounting, weak reconciliations, inappropriate journal entries, or inaccurate financial reporting may cause material misstatement or loss.",
            "subDivisionHead": "user-008",
            "numberOfEmployees": 9,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Finance & Financial Reporting", "scopeType": "subDivisional", "auditFrequency": "monthly", "riskRating": "high",
                "subScopes": [
                  { "subScopeName": "Revenue & Receivables", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" },
                  { "subScopeName": "General Ledger & Close", "subScopeType": "controls", "auditFrequency": "monthly", "riskRating": "high" }
                ]
              }
            ],
            "createdAt": "2026-01-02T09:00:00.000Z"
          }
        ]
      }
    ]
  }
];
