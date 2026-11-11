// Branch seed used when CLIENT_MODE_VALUE is 'internal-audit' — a single
// organisation (XYZ Broadcast) auditing itself, as opposed to the multi-company
// audit-firm roster in branch-static-data.ts. Same StaticCompany/StaticBranch
// shape and the same field set; only the mock data differs.
//
// XYZ Broadcast has a single branch, "Dubai", which nests 5 departments taken
// from the Media Company Internal Audit plan (Broadcasting / Television
// Operations, Newspaper / Publishing, Commercial / Advertising Sales,
// Commercial / Partnerships, Finance). `scopes` is left empty on every
// department for now. `parentBranch` is null since there is no head-office
// entry to point at.

import type { StaticCompany } from './models/division-static-data.model';

export const XYZ_BROADCAST_BRANCH_COMPANIES: StaticCompany[] = [
  {
    "id": "xyz-broadcast",
    "companyName": "XYZ Broadcast",
    "tag": "XYZ",
    "color": "#6a1b9a",
    "industry": "other",
    "divisions": [
      {
        "company": "xyz-broadcast",
        "divisionName": "Dubai",
        "divisionCode": "XYZ-BR-01",
        "divisionType": "branch",
        "departmentType": "Not Applicable",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 48,
        "operationalSince": "2012-01-01",
        "licenseNumber": "DED-2012-5501",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2021-01-01",
        "licenseExpiryDate": "2026-12-31",
        "taxRegistrationNumber": "AETRN550001",
        "commercialRegistrationNumber": "CRN-550001",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "XYZ Broadcast LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "Building 5, Dubai Media City",
        "addressLine2": "",
        "postalCode": "55100",
        "gpsCoordinates": "25.0930,55.1560",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-001",
        "contactEmail": "dubai@xyzbroadcast.example",
        "contactPhone": "+971 4 111 1101",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "submittedBy": "Sarah Thomas",
        "lastAuditDate": "2025-12-31",
        "nextAuditDueDate": "2026-03-31",
        "sectorActivity": "technology",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Broadcasting / Television Operations",
            "company": "xyz-broadcast",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Broadcast interruption, scheduling errors, unauthorized system access, transmission failure, or inadequate backup may disrupt services and affect audience trust.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 14,
            "operationalSince": "2012-01-01",
            "scopes": []
          },
          {
            "subDivisionName": "Newspaper / Publishing",
            "company": "xyz-broadcast",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Editorial or production errors, inaccurate circulation records, delayed publication, or weak distribution controls may cause financial and reputational impact.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "scopes": []
          },
          {
            "subDivisionName": "Commercial / Advertising Sales",
            "company": "xyz-broadcast",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Unbilled airtime, unauthorized discounts, incorrect rate application, or incomplete billing may result in significant revenue leakage.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 9,
            "operationalSince": "2012-01-01",
            "scopes": []
          },
          {
            "subDivisionName": "Commercial / Partnerships",
            "company": "xyz-broadcast",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Unapproved commercial terms, failure to deliver sponsorship commitments, or inaccurate billing may cause revenue loss and contractual disputes.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 6,
            "operationalSince": "2012-01-01",
            "scopes": []
          },
          {
            "subDivisionName": "Finance",
            "company": "xyz-broadcast",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "open",
            "primaryContactPerson": "user-008",
            "contactEmail": "info@xyzbroadcast.example",
            "contactPhone": "+971 4 111 1111",
            "description": "Incorrect accounting, weak reconciliations, inappropriate journal entries, or inaccurate financial reporting may cause material misstatement or loss.",
            "subDivisionHead": "user-008",
            "numberOfEmployees": 9,
            "operationalSince": "2012-01-01",
            "scopes": []
          }
        ],
        "tradeLicenseFile": { "name": "XYZ-BR-01-trade-license.pdf", "url": "https://example.com/docs/trade-license.pdf" },
        "vatCertificateFile": { "name": "XYZ-BR-01-vat-certificate.pdf", "url": "https://example.com/docs/vat-certificate.pdf" },
        "orgDocumentsFile": { "name": "XYZ-BR-01-org-documents.pdf", "url": "https://example.com/docs/org-documents.pdf" },
        "createdAt": "2026-01-02T09:00:00.000Z"
      }
    ]
  }
];
