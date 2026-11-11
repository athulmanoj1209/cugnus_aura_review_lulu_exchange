// Self-contained mock data for the Divisions page. Like sub-division-static-data.ts,
// this does NOT read `crowe_all_static_extended.json` at bootstrap — everything
// it renders is compiled into the bundle from here. Independently authored from
// sub-division-static-data.ts (same company roster, different division records).

import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { DIVISION_INDI_ORG_COMPANIES } from './division-static-indi-org.data';
import {
  DivisionAuditStatuses,
  DivisionStatuses,
  DIVISION_DEFAULT_COMPANY_COLOR,
} from './constants/division.constants';
import type {
  DivisionStatus,
  DivisionType,
  DivisionCountry,
  DivisionEmirateState,
  RiskRating,
  RiskStatus,
  AuditStatus,
  SectorActivity,
  SubDivisionStatus,
  StaticDivision,
  StaticCompany,
  CompanyMeta,
  DivisionEditableFields,
} from './models/division-static-data.model';

/* ── Shared option lists ──────────────────────────────────────────────────
 * Single source of truth for the Add/Edit Division form (manage/division.component.ts) and
 * the division profile drawer's label maps — both need the same value domains
 * as this file so a division's stored values always match a dropdown option
 * and always render a proper label.
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

export const DIVISION_TYPE_OPTIONS: { label: string; value: DivisionType }[] = [
  { label: 'Head Office', value: 'head_office' },
  { label: 'Branch', value: 'branch' },
  { label: 'Department', value: 'department' },
  { label: 'Representative Office', value: 'representative_office' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Factory', value: 'factory' },
  { label: 'Project Office', value: 'project_office' },
  { label: 'Subsidiary', value: 'subsidiary' },
];

export const DIVISION_STATUS_OPTIONS: { label: string; value: DivisionStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const CURRENCY_OPTIONS: { label: string; value: string }[] = [
  { label: 'AED – UAE Dirham', value: 'AED' },
  { label: 'SAR – Saudi Riyal', value: 'SAR' },
  { label: 'BHD – Bahraini Dinar', value: 'BHD' },
  { label: 'KWD – Kuwaiti Dinar', value: 'KWD' },
  { label: 'QAR – Qatari Riyal', value: 'QAR' },
  { label: 'OMR – Omani Rial', value: 'OMR' },
  { label: 'USD – US Dollar', value: 'USD' },
  { label: 'EUR – Euro', value: 'EUR' },
  { label: 'GBP – British Pound', value: 'GBP' },
  { label: 'JPY – Japanese Yen', value: 'JPY' },
  { label: 'INR – Indian Rupee', value: 'INR' },
  { label: 'EGP – Egyptian Pound', value: 'EGP' },
];

export const LICENSE_AUTHORITY_OPTIONS: { label: string; value: string }[] = [
  { label: 'DED – Dubai Economy & Tourism', value: 'ded' },
  { label: 'ADCCI – Abu Dhabi Chamber', value: 'adcci' },
  { label: 'SCCI – Sharjah Chamber', value: 'scci' },
  { label: 'DIFC Authority', value: 'difc' },
  { label: 'ADGM Authority', value: 'adgm' },
  { label: 'Ministry of Commerce (MoCI)', value: 'moci' },
];

export const DIVISION_COUNTRY_OPTIONS: { label: string; value: DivisionCountry }[] = [
  { label: 'United Arab Emirates', value: 'ae' },
  { label: 'Saudi Arabia', value: 'sa' },
  { label: 'Bahrain', value: 'bh' },
  { label: 'Kuwait', value: 'kw' },
];

// Grouped by country so the Add/Edit form can filter the emirate/state dropdown
// to whatever's valid for the selected country.
export const DIVISION_EMIRATE_OPTIONS: { label: string; value: DivisionEmirateState; country: DivisionCountry }[] = [
  { label: 'Dubai', value: 'dubai', country: 'ae' },
  { label: 'Abu Dhabi', value: 'abudhabi', country: 'ae' },
  { label: 'Sharjah', value: 'sharjah', country: 'ae' },
  { label: 'Fujairah', value: 'fujairah', country: 'ae' },
  { label: 'Ras Al Khaimah', value: 'rak', country: 'ae' },
  { label: 'Ajman', value: 'ajman', country: 'ae' },
  { label: 'Umm Al Quwain', value: 'ummalquwain', country: 'ae' },
  { label: 'Khorfakkan', value: 'khorfakkan', country: 'ae' },
  { label: 'Riyadh Province', value: 'riyadh', country: 'sa' },
  { label: 'Makkah Province', value: 'makkah', country: 'sa' },
  { label: 'Eastern Province', value: 'eastern', country: 'sa' },
  { label: 'Tabuk Province', value: 'tabuk', country: 'sa' },
  { label: 'Al Madinah Province', value: 'madinah', country: 'sa' },
  { label: 'Capital', value: 'capital', country: 'bh' },
  { label: 'Southern', value: 'southern', country: 'bh' },
  { label: 'Muharraq', value: 'muharraq', country: 'bh' },
  { label: 'Central', value: 'central', country: 'bh' },
  { label: 'Northern', value: 'northern', country: 'bh' },
  { label: 'Hawalli', value: 'hawalli', country: 'kw' },
  { label: 'Jahra', value: 'jahra', country: 'kw' },
  { label: 'Ahmadi', value: 'ahmadi', country: 'kw' },
  { label: 'Farwaniya', value: 'farwaniya', country: 'kw' },
  { label: 'Mubarak Al-Kabeer', value: 'mubarak', country: 'kw' },
];

export const RISK_RATING_OPTIONS: { label: string; value: RiskRating }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

export const RISK_STATUS_OPTIONS: { label: string; value: RiskStatus }[] = [
  { label: 'Open', value: 'open' },
  { label: 'Monitored', value: 'monitored' },
  { label: 'Closed', value: 'closed' },
];

export const AUDIT_STATUS_OPTIONS: { label: string; value: AuditStatus }[] = [
  { label: 'Not Planned', value: 'not_planned' },
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export const SECTOR_OPTIONS: { label: string; value: SectorActivity }[] = [
  { label: 'Professional Services', value: 'professional_services' },
  { label: 'Financial Services', value: 'financial_services' },
  { label: 'Retail & Trading', value: 'retail' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Construction', value: 'construction' },
  { label: 'Real Estate', value: 'real_estate' },
];

export const PARENT_NODE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Corporate HQ', value: 'corporate-hq' },
  { label: 'Finance Division', value: 'finance-div' },
  { label: 'Operations Division', value: 'ops-div' },
  { label: 'Technology Division', value: 'tech-div' },
];

export const SUB_DIVISION_STATUS_OPTIONS: { label: string; value: SubDivisionStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived / Disbanded', value: 'archived' },
  { label: 'Pending / Proposed', value: 'pending' },
  { label: 'Pending Approval', value: 'pending_approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export const PARENT_SUB_DIVISION_OPTIONS: { label: string; value: string }[] = [
  { label: 'Administration', value: 'admin' },
  { label: 'Finance', value: 'finance' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Operations', value: 'operations' },
  { label: 'Technology', value: 'technology' },
  { label: 'Legal', value: 'legal' },
  { label: 'Sales & Marketing', value: 'sales' },
  { label: 'Compliance', value: 'compliance' },
  { label: 'Audit', value: 'audit' },
  { label: 'Risk Management', value: 'risk' },
];

export const TIMEZONE_OPTIONS: { label: string; value: string }[] = [
  { label: 'UAE Time - Asia/Dubai (UTC+04:00)', value: 'Asia/Dubai' },
  { label: 'India Standard Time - Asia/Kolkata (UTC+05:30)', value: 'Asia/Kolkata' },
  { label: 'Saudi Arabia Time - Asia/Riyadh (UTC+03:00)', value: 'Asia/Riyadh' },
  { label: 'Qatar Time - Asia/Qatar (UTC+03:00)', value: 'Asia/Qatar' },
  { label: 'Oman Time - Asia/Muscat (UTC+04:00)', value: 'Asia/Muscat' },
  { label: 'Kuwait Time - Asia/Kuwait (UTC+03:00)', value: 'Asia/Kuwait' },
  { label: 'Bahrain Time - Asia/Bahrain (UTC+03:00)', value: 'Asia/Bahrain' },
  { label: 'UTC - Coordinated Universal Time', value: 'UTC' },
];

/* ── Companies ────────────────────────────────────────────────────────────
 * Same 8-company roster as sub-division-static-data.ts (same id/tag/color per
 * company, so a company reads identically across both pages), independently
 * authored division records — 10-12 divisions per company, mostly UAE with a
 * few per company in KSA/Bahrain/Kuwait.
 */
const AUDIT_FIRM_DIVISION_COMPANIES: StaticCompany[] = [
  {
    "id": "al-noor-jewellery",
    "companyName": "Al Noor Jewellery Group",
    "tag": "ANJ",
    "color": "#b8860b",
    "industry": "jewelry",
    "divisions": [
      {
        "company": "al-noor-jewellery",
        "divisionName": "Dubai Head Office",
        "divisionCode": "ANJ-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 8,
        "operationalSince": "2010-01-01",
        "licenseNumber": "DED-2015-1000",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100000",
        "commercialRegistrationNumber": "CRN-200000",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "100 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10000",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "anj-br-01@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551000",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Mohammed Al Rashid",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "professional_services",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.sales@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661000",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 4,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gemology.quality.control@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661041",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-10T14:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Abu Dhabi Representative Office",
        "divisionCode": "ANJ-BR-02",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 15,
        "operationalSince": "2011-01-01",
        "licenseNumber": "ADCCI-2016-1013",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100001",
        "commercialRegistrationNumber": "CRN-200001",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "101 Sheikh Zayed Street",
        "addressLine2": "Suite 11",
        "postalCode": "10001",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "anj-br-02@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551037",
        "alternatePhone": "+971-50-1000053",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "pending_review",
        "submittedBy": "Fatima Al Zaabi",
        "submittedDate": "2026-06-10T09:30:00.000Z",
        "dueDate": "2026-07-01T00:00:00.000Z",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "financial_services",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gemology.quality.control@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661041",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "procurement.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661082",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661123",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-10T20:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Sharjah Warehouse",
        "divisionCode": "ANJ-BR-03",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 22,
        "operationalSince": "2012-01-01",
        "licenseNumber": "SCCI-2017-1026",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100002",
        "commercialRegistrationNumber": "CRN-200002",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "102 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10002",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "anj-br-03@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551074",
        "alternatePhone": "+971-50-1000106",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "retail",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "procurement.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661082",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661123",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-11T02:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Fujairah Factory",
        "divisionCode": "ANJ-BR-04",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 29,
        "operationalSince": "2013-01-01",
        "licenseNumber": "DIFC-2018-1039",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100003",
        "commercialRegistrationNumber": "CRN-200003",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "103 Corniche Street",
        "addressLine2": "Suite 13",
        "postalCode": "10003",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "anj-br-04@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551111",
        "alternatePhone": "+971-50-1000159",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661123",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661164",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661205",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-11T08:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Ras Al Khaimah Project Office",
        "divisionCode": "ANJ-BR-05",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 36,
        "operationalSince": "2014-01-01",
        "licenseNumber": "ADGM-2019-1052",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100004",
        "commercialRegistrationNumber": "CRN-200004",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "104 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10004",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "anj-br-05@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551148",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Ravi Kumar",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "technology",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661164",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661205",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-11T14:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Ajman Subsidiary",
        "divisionCode": "ANJ-BR-06",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 43,
        "operationalSince": "2015-01-01",
        "licenseNumber": "MOCI-2020-1065",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100005",
        "commercialRegistrationNumber": "CRN-200005",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "105 Industrial Area Street",
        "addressLine2": "Suite 15",
        "postalCode": "10005",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "anj-br-06@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551185",
        "alternatePhone": "+971-50-1000265",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "healthcare",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661205",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "retail.sales@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661246",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 22,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661287",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-11T20:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Umm Al Quwain Division",
        "divisionCode": "ANJ-BR-07",
        "divisionType": "department",
        "departmentType": "finance",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 50,
        "operationalSince": "2016-01-01",
        "licenseNumber": "DED-2021-1078",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100006",
        "commercialRegistrationNumber": "CRN-200006",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "106 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10006",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "anj-br-07@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551222",
        "alternatePhone": "+971-50-1000318",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "construction",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "retail.sales@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661246",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 22,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661287",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-12T02:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Khorfakkan Representative Office",
        "divisionCode": "ANJ-BR-08",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 57,
        "operationalSince": "2017-01-01",
        "licenseNumber": "ADCCI-2022-1091",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100007",
        "commercialRegistrationNumber": "CRN-200007",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "ae",
        "emirateState": "khorfakkan",
        "city": "Khorfakkan",
        "addressLine1": "107 Al Khaleej Street",
        "addressLine2": "Suite 17",
        "postalCode": "10007",
        "gpsCoordinates": "25.3400,56.3400",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "anj-br-08@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551259",
        "alternatePhone": "+971-50-1000371",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "real_estate",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661287",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661328",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661369",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-12T08:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Riyadh Warehouse",
        "divisionCode": "ANJ-BR-09",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 64,
        "operationalSince": "2018-01-01",
        "licenseNumber": "MOCI-2023-1104",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "SATRN100008",
        "commercialRegistrationNumber": "CRN-200008",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "sa",
        "emirateState": "riyadh",
        "city": "Riyadh",
        "addressLine1": "108 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10008",
        "gpsCoordinates": "24.7136,46.6753",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "anj-br-09@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551296",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Priya Sharma",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "professional_services",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661328",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661369",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-12T14:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Manama Factory",
        "divisionCode": "ANJ-BR-10",
        "divisionType": "factory",

        "departmentType": null,
        "status": "inactive",
        "currency": "BHD",
        "numberOfEmployees": 71,
        "operationalSince": "2019-01-01",
        "licenseNumber": "MOCI-2015-1117",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "BHTRN100009",
        "commercialRegistrationNumber": "CRN-200009",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "bh",
        "emirateState": "capital",
        "city": "Manama",
        "addressLine1": "109 Sheikh Zayed Street",
        "addressLine2": "Suite 19",
        "postalCode": "10009",
        "gpsCoordinates": "26.2285,50.5860",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "anj-br-10@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551333",
        "alternatePhone": "+971-50-1000477",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "financial_services",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661369",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "customer.service@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661410",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661451",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-12T20:00:00.000Z"
      },
      {
        "company": "al-noor-jewellery",
        "divisionName": "Hawalli Project Office",
        "divisionCode": "ANJ-BR-11",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 78,
        "operationalSince": "2020-01-01",
        "licenseNumber": "MOCI-2016-1130",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "KWTRN100010",
        "commercialRegistrationNumber": "CRN-200010",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Al Noor Jewellery Group LLC",
        "country": "kw",
        "emirateState": "hawalli",
        "city": "Hawalli",
        "addressLine1": "110 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10010",
        "gpsCoordinates": "29.3328,48.0263",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "anj-br-11@al-noor-jewellery.com",
        "contactPhone": "+971-4-2551370",
        "alternatePhone": "+971-50-1000530",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "retail",
        "parentDivision": "ANJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "customer.service@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661410",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "al-noor-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@al-noor-jewellery.com",
            "contactPhone": "+971-4-2661451",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ANJ-BR-11-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ANJ-BR-11-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ANJ-BR-11-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-13T02:00:00.000Z"
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
        "company": "zumurrud-diamonds",
        "divisionName": "Dubai Head Office",
        "divisionCode": "ZUM-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 85,
        "operationalSince": "2021-01-01",
        "licenseNumber": "MOCI-2017-1143",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100011",
        "commercialRegistrationNumber": "CRN-200011",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "111 Corniche Street",
        "addressLine2": "Suite 21",
        "postalCode": "10011",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "zum-br-01@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551407",
        "alternatePhone": "+971-50-1000583",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "manufacturing",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661451",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.sales@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661492",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 10,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661533",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-13T08:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Abu Dhabi Division",
        "divisionCode": "ZUM-BR-02",
        "divisionType": "department",
        "departmentType": "human-resources",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 92,
        "operationalSince": "2022-01-01",
        "licenseNumber": "DED-2018-1156",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100012",
        "commercialRegistrationNumber": "CRN-200012",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "112 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10012",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "zum-br-02@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551444",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Ahmed Al Mansoori",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "technology",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.sales@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661492",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 10,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661533",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-13T14:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Sharjah Representative Office",
        "divisionCode": "ZUM-BR-03",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 99,
        "operationalSince": "2023-01-01",
        "licenseNumber": "ADCCI-2019-1169",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100013",
        "commercialRegistrationNumber": "CRN-200013",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "113 Industrial Area Street",
        "addressLine2": "Suite 23",
        "postalCode": "10013",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "zum-br-03@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551481",
        "alternatePhone": "+971-50-1000689",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "approved",
        "submittedBy": "Sarah Johnson",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "healthcare",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661533",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661574",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 16,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "inventory.warehousing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661615",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-13T20:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Fujairah Warehouse",
        "divisionCode": "ZUM-BR-04",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 106,
        "operationalSince": "2010-01-01",
        "licenseNumber": "SCCI-2020-1182",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100014",
        "commercialRegistrationNumber": "CRN-200014",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "114 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10014",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "zum-br-04@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551518",
        "alternatePhone": "+971-50-1000742",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "construction",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661574",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 16,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "inventory.warehousing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661615",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-14T02:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Ras Al Khaimah Factory",
        "divisionCode": "ZUM-BR-05",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 113,
        "operationalSince": "2011-01-01",
        "licenseNumber": "DIFC-2021-1195",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100015",
        "commercialRegistrationNumber": "CRN-200015",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "115 Al Khaleej Street",
        "addressLine2": "Suite 25",
        "postalCode": "10015",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "zum-br-05@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551555",
        "alternatePhone": "+971-50-1000795",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "real_estate",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "inventory.warehousing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661615",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "customer.service@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661656",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "design.studio@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661697",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-14T08:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Ajman Project Office",
        "divisionCode": "ZUM-BR-06",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 120,
        "operationalSince": "2012-01-01",
        "licenseNumber": "ADGM-2022-1208",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100016",
        "commercialRegistrationNumber": "CRN-200016",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "116 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10016",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "zum-br-06@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551592",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "James Wilson",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "professional_services",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "customer.service@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661656",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "design.studio@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661697",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-14T14:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Umm Al Quwain Subsidiary",
        "divisionCode": "ZUM-BR-07",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 127,
        "operationalSince": "2013-01-01",
        "licenseNumber": "MOCI-2023-1221",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100017",
        "commercialRegistrationNumber": "CRN-200017",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "117 Sheikh Zayed Street",
        "addressLine2": "Suite 27",
        "postalCode": "10017",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "zum-br-07@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551629",
        "alternatePhone": "+971-50-1000901",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "financial_services",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "design.studio@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661697",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "retail.sales@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661738",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661779",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-14T20:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Jeddah Division",
        "divisionCode": "ZUM-BR-08",
        "divisionType": "department",
        "departmentType": "information-technology",
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 134,
        "operationalSince": "2014-01-01",
        "licenseNumber": "MOCI-2015-1234",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "SATRN100018",
        "commercialRegistrationNumber": "CRN-200018",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "sa",
        "emirateState": "makkah",
        "city": "Jeddah",
        "addressLine1": "118 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10018",
        "gpsCoordinates": "21.4858,39.1925",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "zum-br-08@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551666",
        "alternatePhone": "+971-50-1000954",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "retail",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "retail.sales@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661738",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661779",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-15T02:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Riffa Representative Office",
        "divisionCode": "ZUM-BR-09",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "BHD",
        "numberOfEmployees": 141,
        "operationalSince": "2015-01-01",
        "licenseNumber": "MOCI-2016-1247",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "BHTRN100019",
        "commercialRegistrationNumber": "CRN-200019",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "bh",
        "emirateState": "southern",
        "city": "Riffa",
        "addressLine1": "119 Corniche Street",
        "addressLine2": "Suite 29",
        "postalCode": "10019",
        "gpsCoordinates": "26.1300,50.5550",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "zum-br-09@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551703",
        "alternatePhone": "+971-50-1001007",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "gemology.quality.control@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661779",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "procurement.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661820",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 4,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "inventory.warehousing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661861",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-15T08:00:00.000Z"
      },
      {
        "company": "zumurrud-diamonds",
        "divisionName": "Jahra Warehouse",
        "divisionCode": "ZUM-BR-10",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 8,
        "operationalSince": "2016-01-01",
        "licenseNumber": "MOCI-2017-1260",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "KWTRN100020",
        "commercialRegistrationNumber": "CRN-200020",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Zumurrud Diamonds LLC LLC",
        "country": "kw",
        "emirateState": "jahra",
        "city": "Jahra",
        "addressLine1": "120 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10020",
        "gpsCoordinates": "29.3375,47.6581",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "zum-br-10@zumurrud-diamonds.com",
        "contactPhone": "+971-4-2551740",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Sarah Johnson",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "technology",
        "parentDivision": "ZUM-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "procurement.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661820",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 4,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "zumurrud-diamonds",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "inventory.warehousing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2661861",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "ZUM-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "ZUM-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "ZUM-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-15T14:00:00.000Z"
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
        "company": "falcon-gulf-jewellery",
        "divisionName": "Dubai Head Office",
        "divisionCode": "FGJ-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 15,
        "operationalSince": "2017-01-01",
        "licenseNumber": "DIFC-2018-1273",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100021",
        "commercialRegistrationNumber": "CRN-200021",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "121 Industrial Area Street",
        "addressLine2": "Suite 31",
        "postalCode": "10021",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "fgj-br-01@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551777",
        "alternatePhone": "+971-50-1001113",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "rejected",
        "submittedBy": "Omar Al Suwaidi",
        "submittedDate": "2026-05-22T11:15:00.000Z",
        "dueDate": null,
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "healthcare",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661861",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 7,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "customer.service@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661902",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661943",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-15T20:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Abu Dhabi Project Office",
        "divisionCode": "FGJ-BR-02",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 22,
        "operationalSince": "2018-01-01",
        "licenseNumber": "ADGM-2019-1286",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100022",
        "commercialRegistrationNumber": "CRN-200022",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "122 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10022",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "fgj-br-02@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551814",
        "alternatePhone": "+971-50-1001166",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "construction",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "customer.service@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661902",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661943",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-16T02:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Sharjah Subsidiary",
        "divisionCode": "FGJ-BR-03",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 29,
        "operationalSince": "2019-01-01",
        "licenseNumber": "MOCI-2020-1299",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100023",
        "commercialRegistrationNumber": "CRN-200023",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "123 Al Khaleej Street",
        "addressLine2": "Suite 33",
        "postalCode": "10023",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "fgj-br-03@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551851",
        "alternatePhone": "+971-50-1001219",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "real_estate",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661943",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "retail.sales@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661984",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 16,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662025",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-16T08:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Fujairah Division",
        "divisionCode": "FGJ-BR-04",
        "divisionType": "department",
        "departmentType": "operations",
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 36,
        "operationalSince": "2020-01-01",
        "licenseNumber": "DED-2021-1312",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100024",
        "commercialRegistrationNumber": "CRN-200024",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "124 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10024",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "fgj-br-04@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551888",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Fatima Al Zaabi",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "professional_services",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "retail.sales@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2661984",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 16,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662025",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-16T14:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Ras Al Khaimah Representative Office",
        "divisionCode": "FGJ-BR-05",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 43,
        "operationalSince": "2021-01-01",
        "licenseNumber": "ADCCI-2022-1325",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100025",
        "commercialRegistrationNumber": "CRN-200025",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "125 Sheikh Zayed Street",
        "addressLine2": "Suite 35",
        "postalCode": "10025",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "fgj-br-05@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551925",
        "alternatePhone": "+971-50-1001325",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "financial_services",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662025",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "procurement.sourcing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662066",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 22,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662107",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-16T20:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Ajman Warehouse",
        "divisionCode": "FGJ-BR-06",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 50,
        "operationalSince": "2022-01-01",
        "licenseNumber": "SCCI-2023-1338",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100026",
        "commercialRegistrationNumber": "CRN-200026",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "126 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10026",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "fgj-br-06@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551962",
        "alternatePhone": "+971-50-1001378",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "retail",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "procurement.sourcing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662066",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 22,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662107",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-17T02:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Umm Al Quwain Factory",
        "divisionCode": "FGJ-BR-07",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 57,
        "operationalSince": "2023-01-01",
        "licenseNumber": "DIFC-2015-1351",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100027",
        "commercialRegistrationNumber": "CRN-200027",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "127 Corniche Street",
        "addressLine2": "Suite 37",
        "postalCode": "10027",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "fgj-br-07@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2551999",
        "alternatePhone": "+971-50-1001431",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662107",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 25,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "customer.service@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662148",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2010-01-01",
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
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662189",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-17T08:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Khorfakkan Project Office",
        "divisionCode": "FGJ-BR-08",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 64,
        "operationalSince": "2010-01-01",
        "licenseNumber": "ADGM-2016-1364",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100028",
        "commercialRegistrationNumber": "CRN-200028",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "khorfakkan",
        "city": "Khorfakkan",
        "addressLine1": "128 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10028",
        "gpsCoordinates": "25.3400,56.3400",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "fgj-br-08@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2552036",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Mohammed Al Rashid",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "technology",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "customer.service@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662148",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2010-01-01",
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
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662189",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-17T14:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Dubai Subsidiary",
        "divisionCode": "FGJ-BR-09",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 71,
        "operationalSince": "2011-01-01",
        "licenseNumber": "MOCI-2017-1377",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100029",
        "commercialRegistrationNumber": "CRN-200029",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "129 Industrial Area Street",
        "addressLine2": "Suite 39",
        "postalCode": "10029",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "fgj-br-09@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2552073",
        "alternatePhone": "+971-50-1001537",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "healthcare",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "design.studio@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662189",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.sales@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662230",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 4,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662271",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-17T20:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Dammam Division",
        "divisionCode": "FGJ-BR-10",
        "divisionType": "department",
        "departmentType": "legal-compliance",
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 78,
        "operationalSince": "2012-01-01",
        "licenseNumber": "MOCI-2018-1390",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "SATRN100030",
        "commercialRegistrationNumber": "CRN-200030",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "sa",
        "emirateState": "eastern",
        "city": "Dammam",
        "addressLine1": "130 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10030",
        "gpsCoordinates": "26.4207,50.0888",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "fgj-br-10@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2552110",
        "alternatePhone": "+971-50-1001590",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "construction",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.sales@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662230",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 4,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662271",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-18T02:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Muharraq Representative Office",
        "divisionCode": "FGJ-BR-11",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "BHD",
        "numberOfEmployees": 85,
        "operationalSince": "2013-01-01",
        "licenseNumber": "MOCI-2019-1403",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "BHTRN100031",
        "commercialRegistrationNumber": "CRN-200031",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "bh",
        "emirateState": "muharraq",
        "city": "Muharraq",
        "addressLine1": "131 Al Khaleej Street",
        "addressLine2": "Suite 41",
        "postalCode": "10031",
        "gpsCoordinates": "26.2572,50.6119",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "fgj-br-11@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2552147",
        "alternatePhone": "+971-50-1001643",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "real_estate",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "gemology.quality.control@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662271",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement.sourcing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662312",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 10,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662353",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-11-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-11-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-11-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-18T08:00:00.000Z"
      },
      {
        "company": "falcon-gulf-jewellery",
        "divisionName": "Ahmadi Warehouse",
        "divisionCode": "FGJ-BR-12",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 92,
        "operationalSince": "2014-01-01",
        "licenseNumber": "MOCI-2020-1416",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "KWTRN100032",
        "commercialRegistrationNumber": "CRN-200032",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Falcon Gulf Jewellery Trading LLC",
        "country": "kw",
        "emirateState": "ahmadi",
        "city": "Ahmadi",
        "addressLine1": "132 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10032",
        "gpsCoordinates": "29.0769,48.0837",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "fgj-br-12@falcon-gulf-jewellery.com",
        "contactPhone": "+971-4-2552184",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Ravi Kumar",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "professional_services",
        "parentDivision": "FGJ-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement.sourcing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662312",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 10,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "falcon-gulf-jewellery",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2662353",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "FGJ-BR-12-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "FGJ-BR-12-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "FGJ-BR-12-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-18T14:00:00.000Z"
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
        "company": "marwa-gold-gems",
        "divisionName": "Dubai Head Office",
        "divisionCode": "MGG-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 99,
        "operationalSince": "2015-01-01",
        "licenseNumber": "DIFC-2021-1429",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100033",
        "commercialRegistrationNumber": "CRN-200033",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "133 Sheikh Zayed Street",
        "addressLine2": "Suite 43",
        "postalCode": "10033",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "mgg-br-01@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552221",
        "alternatePhone": "+971-50-1001749",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "financial_services",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "inventory.warehousing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662353",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 13,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "customer.service@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662394",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662435",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-18T20:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Abu Dhabi Project Office",
        "divisionCode": "MGG-BR-02",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 106,
        "operationalSince": "2016-01-01",
        "licenseNumber": "ADGM-2022-1442",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100034",
        "commercialRegistrationNumber": "CRN-200034",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "134 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10034",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "mgg-br-02@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552258",
        "alternatePhone": "+971-50-1001802",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "retail",
        "parentDivision": "MGG-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "customer.service@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662394",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662435",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-19T02:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Sharjah Subsidiary",
        "divisionCode": "MGG-BR-03",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 113,
        "operationalSince": "2017-01-01",
        "licenseNumber": "MOCI-2023-1455",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100035",
        "commercialRegistrationNumber": "CRN-200035",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "135 Corniche Street",
        "addressLine2": "Suite 45",
        "postalCode": "10035",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "mgg-br-03@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552295",
        "alternatePhone": "+971-50-1001855",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "MGG-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662435",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "retail.sales@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662476",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 22,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "gemology.quality.control@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662517",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-19T08:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Fujairah Division",
        "divisionCode": "MGG-BR-04",
        "divisionType": "department",
        "departmentType": "internal-audit",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 120,
        "operationalSince": "2018-01-01",
        "licenseNumber": "DED-2015-1468",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100036",
        "commercialRegistrationNumber": "CRN-200036",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "136 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10036",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "mgg-br-04@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552332",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Priya Sharma",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "technology",
        "parentDivision": "MGG-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "retail.sales@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662476",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 22,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "gemology.quality.control@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662517",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-19T14:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Ras Al Khaimah Representative Office",
        "divisionCode": "MGG-BR-05",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 127,
        "operationalSince": "2019-01-01",
        "licenseNumber": "ADCCI-2016-1481",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100037",
        "commercialRegistrationNumber": "CRN-200037",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "137 Industrial Area Street",
        "addressLine2": "Suite 47",
        "postalCode": "10037",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "mgg-br-05@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552369",
        "alternatePhone": "+971-50-1001961",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "healthcare",
        "parentDivision": "MGG-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "gemology.quality.control@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662517",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "procurement.sourcing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662558",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "inventory.warehousing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662599",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-19T20:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Ajman Warehouse",
        "divisionCode": "MGG-BR-06",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 134,
        "operationalSince": "2020-01-01",
        "licenseNumber": "SCCI-2017-1494",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100038",
        "commercialRegistrationNumber": "CRN-200038",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "138 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10038",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "mgg-br-06@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552406",
        "alternatePhone": "+971-50-1002014",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "construction",
        "parentDivision": "MGG-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "procurement.sourcing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662558",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "inventory.warehousing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662599",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-20T02:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Umm Al Quwain Factory",
        "divisionCode": "MGG-BR-07",
        "divisionType": "factory",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 141,
        "operationalSince": "2021-01-01",
        "licenseNumber": "DIFC-2018-1507",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100039",
        "commercialRegistrationNumber": "CRN-200039",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "139 Al Khaleej Street",
        "addressLine2": "Suite 49",
        "postalCode": "10039",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "mgg-br-07@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552443",
        "alternatePhone": "+971-50-1002067",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "real_estate",
        "parentDivision": "MGG-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "inventory.warehousing@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662599",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 31,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662640",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662681",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-20T08:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Tabuk Project Office",
        "divisionCode": "MGG-BR-08",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 8,
        "operationalSince": "2022-01-01",
        "licenseNumber": "MOCI-2019-1520",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "SATRN100040",
        "commercialRegistrationNumber": "CRN-200040",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "sa",
        "emirateState": "tabuk",
        "city": "Tabuk",
        "addressLine1": "140 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10040",
        "gpsCoordinates": "28.3835,36.5662",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "mgg-br-08@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552480",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Ahmed Al Mansoori",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "professional_services",
        "parentDivision": "MGG-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662640",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662681",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-20T14:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Isa Town Subsidiary",
        "divisionCode": "MGG-BR-09",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "BHD",
        "numberOfEmployees": 15,
        "operationalSince": "2023-01-01",
        "licenseNumber": "MOCI-2020-1533",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "BHTRN100041",
        "commercialRegistrationNumber": "CRN-200041",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "bh",
        "emirateState": "central",
        "city": "Isa Town",
        "addressLine1": "141 Sheikh Zayed Street",
        "addressLine2": "Suite 51",
        "postalCode": "10041",
        "gpsCoordinates": "26.1736,50.5478",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "mgg-br-09@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552517",
        "alternatePhone": "+971-50-1002173",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "financial_services",
        "parentDivision": "MGG-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "design.studio@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662681",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.sales@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662722",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 10,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gemology.quality.control@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662763",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-20T20:00:00.000Z"
      },
      {
        "company": "marwa-gold-gems",
        "divisionName": "Farwaniya Division",
        "divisionCode": "MGG-BR-10",
        "divisionType": "department",
        "departmentType": "risk-management",
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 22,
        "operationalSince": "2010-01-01",
        "licenseNumber": "MOCI-2021-1546",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "KWTRN100042",
        "commercialRegistrationNumber": "CRN-200042",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Marwa Gold & Gems LLC",
        "country": "kw",
        "emirateState": "farwaniya",
        "city": "Farwaniya",
        "addressLine1": "142 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10042",
        "gpsCoordinates": "29.2977,47.9391",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "mgg-br-10@marwa-gold-gems.com",
        "contactPhone": "+971-4-2552554",
        "alternatePhone": "+971-50-1002226",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "retail",
        "parentDivision": "MGG-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.sales@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662722",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 10,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "marwa-gold-gems",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gemology.quality.control@marwa-gold-gems.com",
            "contactPhone": "+971-4-2662763",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "MGG-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "MGG-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "MGG-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-21T02:00:00.000Z"
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
        "company": "kanz-al-emarat",
        "divisionName": "Dubai Head Office",
        "divisionCode": "KAE-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 29,
        "operationalSince": "2011-01-01",
        "licenseNumber": "ADCCI-2022-1559",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100043",
        "commercialRegistrationNumber": "CRN-200043",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "143 Corniche Street",
        "addressLine2": "Suite 53",
        "postalCode": "10043",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "kae-br-01@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552591",
        "alternatePhone": "+971-50-1002279",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "manufacturing",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gemology.quality.control@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662763",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "procurement.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662804",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 16,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662845",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-21T08:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Abu Dhabi Warehouse",
        "divisionCode": "KAE-BR-02",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 36,
        "operationalSince": "2012-01-01",
        "licenseNumber": "SCCI-2023-1572",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100044",
        "commercialRegistrationNumber": "CRN-200044",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "144 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10044",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "kae-br-02@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552628",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "James Wilson",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "technology",
        "parentDivision": "KAE-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "procurement.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662804",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 16,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662845",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-21T14:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Sharjah Factory",
        "divisionCode": "KAE-BR-03",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 43,
        "operationalSince": "2013-01-01",
        "licenseNumber": "DIFC-2015-1585",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100045",
        "commercialRegistrationNumber": "CRN-200045",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "145 Industrial Area Street",
        "addressLine2": "Suite 55",
        "postalCode": "10045",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "kae-br-03@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552665",
        "alternatePhone": "+971-50-1002385",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "healthcare",
        "parentDivision": "KAE-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662845",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 19,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662886",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662927",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-21T20:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Fujairah Project Office",
        "divisionCode": "KAE-BR-04",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 50,
        "operationalSince": "2014-01-01",
        "licenseNumber": "ADGM-2016-1598",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100046",
        "commercialRegistrationNumber": "CRN-200046",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "146 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10046",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "kae-br-04@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552702",
        "alternatePhone": "+971-50-1002438",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "construction",
        "parentDivision": "KAE-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662886",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662927",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-22T02:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Ras Al Khaimah Subsidiary",
        "divisionCode": "KAE-BR-05",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 57,
        "operationalSince": "2015-01-01",
        "licenseNumber": "MOCI-2017-1611",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100047",
        "commercialRegistrationNumber": "CRN-200047",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "147 Al Khaleej Street",
        "addressLine2": "Suite 57",
        "postalCode": "10047",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "kae-br-05@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552739",
        "alternatePhone": "+971-50-1002491",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "real_estate",
        "parentDivision": "KAE-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662927",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "retail.sales@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662968",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663009",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-22T08:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Ajman Division",
        "divisionCode": "KAE-BR-06",
        "divisionType": "department",
        "departmentType": "marketing-communications",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 64,
        "operationalSince": "2016-01-01",
        "licenseNumber": "DED-2018-1624",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100048",
        "commercialRegistrationNumber": "CRN-200048",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "148 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10048",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "kae-br-06@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552776",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Sarah Johnson",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "professional_services",
        "parentDivision": "KAE-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Retail Sales",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "retail.sales@kanz-al-emarat.com",
            "contactPhone": "+971-4-2662968",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663009",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-22T14:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Umm Al Quwain Representative Office",
        "divisionCode": "KAE-BR-07",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 71,
        "operationalSince": "2017-01-01",
        "licenseNumber": "ADCCI-2019-1637",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100049",
        "commercialRegistrationNumber": "CRN-200049",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "149 Sheikh Zayed Street",
        "addressLine2": "Suite 59",
        "postalCode": "10049",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "kae-br-07@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552813",
        "alternatePhone": "+971-50-1002597",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "financial_services",
        "parentDivision": "KAE-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "gemology.quality.control@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663009",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663050",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 4,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663091",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-22T20:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Khorfakkan Warehouse",
        "divisionCode": "KAE-BR-08",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 78,
        "operationalSince": "2018-01-01",
        "licenseNumber": "SCCI-2020-1650",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100050",
        "commercialRegistrationNumber": "CRN-200050",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "ae",
        "emirateState": "khorfakkan",
        "city": "Khorfakkan",
        "addressLine1": "150 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10050",
        "gpsCoordinates": "25.3400,56.3400",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "kae-br-08@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552850",
        "alternatePhone": "+971-50-1002650",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "retail",
        "parentDivision": "KAE-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement & Sourcing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663050",
            "description": "Procurement & Sourcing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 4,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663091",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-23T02:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Madinah Factory",
        "divisionCode": "KAE-BR-09",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 85,
        "operationalSince": "2019-01-01",
        "licenseNumber": "MOCI-2021-1663",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "SATRN100051",
        "commercialRegistrationNumber": "CRN-200051",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "sa",
        "emirateState": "madinah",
        "city": "Madinah",
        "addressLine1": "151 Corniche Street",
        "addressLine2": "Suite 11",
        "postalCode": "10051",
        "gpsCoordinates": "24.5247,39.5692",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "kae-br-09@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552887",
        "alternatePhone": "+971-50-1002703",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "KAE-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663091",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 7,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "customer.service@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663132",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663173",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-23T08:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Hamad Town Project Office",
        "divisionCode": "KAE-BR-10",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "BHD",
        "numberOfEmployees": 92,
        "operationalSince": "2020-01-01",
        "licenseNumber": "MOCI-2022-1676",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "BHTRN100052",
        "commercialRegistrationNumber": "CRN-200052",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "bh",
        "emirateState": "northern",
        "city": "Hamad Town",
        "addressLine1": "152 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10052",
        "gpsCoordinates": "26.1197,50.5074",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "kae-br-10@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552924",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Fatima Al Zaabi",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "technology",
        "parentDivision": "KAE-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "customer.service@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663132",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "subDivisional",
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
            ]
          },
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663173",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-23T14:00:00.000Z"
      },
      {
        "company": "kanz-al-emarat",
        "divisionName": "Mubarak Al-Kabeer Subsidiary",
        "divisionCode": "KAE-BR-11",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 99,
        "operationalSince": "2021-01-01",
        "licenseNumber": "MOCI-2023-1689",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "KWTRN100053",
        "commercialRegistrationNumber": "CRN-200053",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Kanz Al Emarat Jewellery LLC",
        "country": "kw",
        "emirateState": "mubarak",
        "city": "Mubarak Al-Kabeer",
        "addressLine1": "153 Industrial Area Street",
        "addressLine2": "Suite 13",
        "postalCode": "10053",
        "gpsCoordinates": "29.1875,48.0761",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "kae-br-11@kanz-al-emarat.com",
        "contactPhone": "+971-4-2552961",
        "alternatePhone": "+971-50-1002809",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "healthcare",
        "parentDivision": "KAE-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Design Studio",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "design.studio@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663173",
            "description": "Design Studio sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Retail Sales",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.sales@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663214",
            "description": "Retail Sales sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 16,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Gemology & Quality Control",
            "company": "kanz-al-emarat",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "gemology.quality.control@kanz-al-emarat.com",
            "contactPhone": "+971-4-2663255",
            "description": "Gemology & Quality Control sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "KAE-BR-11-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "KAE-BR-11-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "KAE-BR-11-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-23T20:00:00.000Z"
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
        "company": "desert-rose-retail",
        "divisionName": "Dubai Head Office",
        "divisionCode": "DRR-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 106,
        "operationalSince": "2022-01-01",
        "licenseNumber": "DED-2015-1702",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100054",
        "commercialRegistrationNumber": "CRN-200054",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "154 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10054",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "drr-br-01@desert-rose-retail.com",
        "contactPhone": "+971-4-2552998",
        "alternatePhone": "+971-50-1002862",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "construction",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663214",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 16,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663255",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-24T02:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Abu Dhabi Representative Office",
        "divisionCode": "DRR-BR-02",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 113,
        "operationalSince": "2023-01-01",
        "licenseNumber": "ADCCI-2016-1715",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100055",
        "commercialRegistrationNumber": "CRN-200055",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "155 Al Khaleej Street",
        "addressLine2": "Suite 15",
        "postalCode": "10055",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "drr-br-02@desert-rose-retail.com",
        "contactPhone": "+971-4-2553035",
        "alternatePhone": "+971-50-1002915",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "real_estate",
        "parentDivision": "DRR-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663255",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663296",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 22,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663337",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-24T08:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Sharjah Warehouse",
        "divisionCode": "DRR-BR-03",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 120,
        "operationalSince": "2010-01-01",
        "licenseNumber": "SCCI-2017-1728",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100056",
        "commercialRegistrationNumber": "CRN-200056",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "156 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10056",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "drr-br-03@desert-rose-retail.com",
        "contactPhone": "+971-4-2553072",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Mohammed Al Rashid",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "professional_services",
        "parentDivision": "DRR-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663296",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 22,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663337",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-24T14:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Fujairah Factory",
        "divisionCode": "DRR-BR-04",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 127,
        "operationalSince": "2011-01-01",
        "licenseNumber": "DIFC-2018-1741",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100057",
        "commercialRegistrationNumber": "CRN-200057",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "157 Sheikh Zayed Street",
        "addressLine2": "Suite 17",
        "postalCode": "10057",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "drr-br-04@desert-rose-retail.com",
        "contactPhone": "+971-4-2553109",
        "alternatePhone": "+971-50-1003021",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "financial_services",
        "parentDivision": "DRR-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663337",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 25,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663378",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663419",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-24T20:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Ras Al Khaimah Project Office",
        "divisionCode": "DRR-BR-05",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 134,
        "operationalSince": "2012-01-01",
        "licenseNumber": "ADGM-2019-1754",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100058",
        "commercialRegistrationNumber": "CRN-200058",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "158 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10058",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "drr-br-05@desert-rose-retail.com",
        "contactPhone": "+971-4-2553146",
        "alternatePhone": "+971-50-1003074",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "retail",
        "parentDivision": "DRR-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663378",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 28,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663419",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-25T02:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Ajman Subsidiary",
        "divisionCode": "DRR-BR-06",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 141,
        "operationalSince": "2013-01-01",
        "licenseNumber": "MOCI-2020-1767",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100059",
        "commercialRegistrationNumber": "CRN-200059",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "159 Corniche Street",
        "addressLine2": "Suite 19",
        "postalCode": "10059",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "drr-br-06@desert-rose-retail.com",
        "contactPhone": "+971-4-2553183",
        "alternatePhone": "+971-50-1003127",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "DRR-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663419",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663460",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 4,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663501",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-25T08:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Umm Al Quwain Division",
        "divisionCode": "DRR-BR-07",
        "divisionType": "department",
        "departmentType": "procurement-supply-chain",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 8,
        "operationalSince": "2014-01-01",
        "licenseNumber": "DED-2021-1780",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100060",
        "commercialRegistrationNumber": "CRN-200060",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "160 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10060",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "drr-br-07@desert-rose-retail.com",
        "contactPhone": "+971-4-2553220",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Ravi Kumar",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "technology",
        "parentDivision": "DRR-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663460",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 4,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663501",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-25T14:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Khorfakkan Representative Office",
        "divisionCode": "DRR-BR-08",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 15,
        "operationalSince": "2015-01-01",
        "licenseNumber": "ADCCI-2022-1793",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100061",
        "commercialRegistrationNumber": "CRN-200061",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "khorfakkan",
        "city": "Khorfakkan",
        "addressLine1": "161 Industrial Area Street",
        "addressLine2": "Suite 21",
        "postalCode": "10061",
        "gpsCoordinates": "25.3400,56.3400",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "drr-br-08@desert-rose-retail.com",
        "contactPhone": "+971-4-2553257",
        "alternatePhone": "+971-50-1003233",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "healthcare",
        "parentDivision": "DRR-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663501",
            "description": "Customer Service sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 7,
            "operationalSince": "2015-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663542",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 10,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663583",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-25T20:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Dubai Warehouse",
        "divisionCode": "DRR-BR-09",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 22,
        "operationalSince": "2016-01-01",
        "licenseNumber": "SCCI-2023-1806",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100062",
        "commercialRegistrationNumber": "CRN-200062",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "162 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10062",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "drr-br-09@desert-rose-retail.com",
        "contactPhone": "+971-4-2553294",
        "alternatePhone": "+971-50-1003286",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "construction",
        "parentDivision": "DRR-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663542",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 10,
            "operationalSince": "2016-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663583",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-26T02:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Riyadh Factory",
        "divisionCode": "DRR-BR-10",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 29,
        "operationalSince": "2017-01-01",
        "licenseNumber": "MOCI-2015-1819",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "SATRN100063",
        "commercialRegistrationNumber": "CRN-200063",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "sa",
        "emirateState": "riyadh",
        "city": "Riyadh",
        "addressLine1": "163 Al Khaleej Street",
        "addressLine2": "Suite 23",
        "postalCode": "10063",
        "gpsCoordinates": "24.7136,46.6753",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "drr-br-10@desert-rose-retail.com",
        "contactPhone": "+971-4-2553331",
        "alternatePhone": "+971-50-1003339",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "real_estate",
        "parentDivision": "DRR-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663583",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 13,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663624",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663665",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-26T08:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Manama Project Office",
        "divisionCode": "DRR-BR-11",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "BHD",
        "numberOfEmployees": 36,
        "operationalSince": "2018-01-01",
        "licenseNumber": "MOCI-2016-1832",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "BHTRN100064",
        "commercialRegistrationNumber": "CRN-200064",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "bh",
        "emirateState": "capital",
        "city": "Manama",
        "addressLine1": "164 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10064",
        "gpsCoordinates": "26.2285,50.5860",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "drr-br-11@desert-rose-retail.com",
        "contactPhone": "+971-4-2553368",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Priya Sharma",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "professional_services",
        "parentDivision": "DRR-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Sales & Marketing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663624",
            "description": "Sales & Marketing sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 16,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "independent",
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
            ]
          },
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663665",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-11-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-11-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-11-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-26T14:00:00.000Z"
      },
      {
        "company": "desert-rose-retail",
        "divisionName": "Hawalli Subsidiary",
        "divisionCode": "DRR-BR-12",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 43,
        "operationalSince": "2019-01-01",
        "licenseNumber": "MOCI-2017-1845",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "KWTRN100065",
        "commercialRegistrationNumber": "CRN-200065",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Desert Rose Retail Group LLC",
        "country": "kw",
        "emirateState": "hawalli",
        "city": "Hawalli",
        "addressLine1": "165 Sheikh Zayed Street",
        "addressLine2": "Suite 25",
        "postalCode": "10065",
        "gpsCoordinates": "29.3328,48.0263",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "drr-br-12@desert-rose-retail.com",
        "contactPhone": "+971-4-2553405",
        "alternatePhone": "+971-50-1003445",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "financial_services",
        "parentDivision": "DRR-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customer Service",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2663665",
            "description": "Customer Service sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Inventory & Warehousing",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2663706",
            "description": "Inventory & Warehousing sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 22,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Visual Merchandising",
            "company": "desert-rose-retail",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "visual.merchandising@desert-rose-retail.com",
            "contactPhone": "+971-4-2663747",
            "description": "Visual Merchandising sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "DRR-BR-12-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "DRR-BR-12-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "DRR-BR-12-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-26T20:00:00.000Z"
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
        "company": "gulf-horizon-logistics",
        "divisionName": "Dubai Head Office",
        "divisionCode": "GHL-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 50,
        "operationalSince": "2020-01-01",
        "licenseNumber": "DED-2018-1858",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100066",
        "commercialRegistrationNumber": "CRN-200066",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "166 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10066",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "ghl-br-01@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553442",
        "alternatePhone": "+971-50-1003498",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "retail",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Freight Forwarding",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "freight.forwarding@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663706",
            "description": "Freight Forwarding sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 22,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
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
            ]
          },
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663747",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-27T02:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Abu Dhabi Representative Office",
        "divisionCode": "GHL-BR-02",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 57,
        "operationalSince": "2021-01-01",
        "licenseNumber": "ADCCI-2019-1871",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100067",
        "commercialRegistrationNumber": "CRN-200067",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "167 Corniche Street",
        "addressLine2": "Suite 27",
        "postalCode": "10067",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "ghl-br-02@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553479",
        "alternatePhone": "+971-50-1003551",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "GHL-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663747",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 25,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Fleet Operations",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "fleet.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663788",
            "description": "Fleet Operations sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 28,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663829",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-27T08:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Sharjah Warehouse",
        "divisionCode": "GHL-BR-03",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 64,
        "operationalSince": "2022-01-01",
        "licenseNumber": "SCCI-2020-1884",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100068",
        "commercialRegistrationNumber": "CRN-200068",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "168 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10068",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "ghl-br-03@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553516",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Ahmed Al Mansoori",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "technology",
        "parentDivision": "GHL-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Fleet Operations",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "fleet.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663788",
            "description": "Fleet Operations sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 28,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663829",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-27T14:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Fujairah Factory",
        "divisionCode": "GHL-BR-04",
        "divisionType": "factory",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 71,
        "operationalSince": "2023-01-01",
        "licenseNumber": "DIFC-2021-1897",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100069",
        "commercialRegistrationNumber": "CRN-200069",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "169 Industrial Area Street",
        "addressLine2": "Suite 29",
        "postalCode": "10069",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "ghl-br-04@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553553",
        "alternatePhone": "+971-50-1003657",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "healthcare",
        "parentDivision": "GHL-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663829",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 31,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Freight Forwarding",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "freight.forwarding@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663870",
            "description": "Freight Forwarding sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663911",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-27T20:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Ras Al Khaimah Project Office",
        "divisionCode": "GHL-BR-05",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 78,
        "operationalSince": "2010-01-01",
        "licenseNumber": "ADGM-2022-1910",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100070",
        "commercialRegistrationNumber": "CRN-200070",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "170 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10070",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "ghl-br-05@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553590",
        "alternatePhone": "+971-50-1003710",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "construction",
        "parentDivision": "GHL-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Freight Forwarding",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "freight.forwarding@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663870",
            "description": "Freight Forwarding sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 4,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663911",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-28T02:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Ajman Subsidiary",
        "divisionCode": "GHL-BR-06",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 85,
        "operationalSince": "2011-01-01",
        "licenseNumber": "MOCI-2023-1923",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100071",
        "commercialRegistrationNumber": "CRN-200071",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "171 Al Khaleej Street",
        "addressLine2": "Suite 31",
        "postalCode": "10071",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "ghl-br-06@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553627",
        "alternatePhone": "+971-50-1003763",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "real_estate",
        "parentDivision": "GHL-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663911",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Fleet Operations",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "fleet.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663952",
            "description": "Fleet Operations sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663993",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-28T08:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Umm Al Quwain Division",
        "divisionCode": "GHL-BR-07",
        "divisionType": "department",
        "departmentType": "customer-service",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 92,
        "operationalSince": "2012-01-01",
        "licenseNumber": "DED-2015-1936",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100072",
        "commercialRegistrationNumber": "CRN-200072",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "172 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10072",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "ghl-br-07@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553664",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "James Wilson",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "professional_services",
        "parentDivision": "GHL-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Fleet Operations",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "fleet.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663952",
            "description": "Fleet Operations sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 10,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663993",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-28T14:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Jeddah Representative Office",
        "divisionCode": "GHL-BR-08",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "SAR",
        "numberOfEmployees": 99,
        "operationalSince": "2013-01-01",
        "licenseNumber": "MOCI-2016-1949",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "SATRN100073",
        "commercialRegistrationNumber": "CRN-200073",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "sa",
        "emirateState": "makkah",
        "city": "Jeddah",
        "addressLine1": "173 Sheikh Zayed Street",
        "addressLine2": "Suite 33",
        "postalCode": "10073",
        "gpsCoordinates": "21.4858,39.1925",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "ghl-br-08@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553701",
        "alternatePhone": "+971-50-1003869",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "financial_services",
        "parentDivision": "GHL-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2663993",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
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
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Freight Forwarding",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "freight.forwarding@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664034",
            "description": "Freight Forwarding sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 16,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664075",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-28T20:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Riffa Warehouse",
        "divisionCode": "GHL-BR-09",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "inactive",
        "currency": "BHD",
        "numberOfEmployees": 106,
        "operationalSince": "2014-01-01",
        "licenseNumber": "MOCI-2017-1962",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "BHTRN100074",
        "commercialRegistrationNumber": "CRN-200074",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "bh",
        "emirateState": "southern",
        "city": "Riffa",
        "addressLine1": "174 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10074",
        "gpsCoordinates": "26.1300,50.5550",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "ghl-br-09@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553738",
        "alternatePhone": "+971-50-1003922",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "retail",
        "parentDivision": "GHL-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Freight Forwarding",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "freight.forwarding@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664034",
            "description": "Freight Forwarding sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 16,
            "operationalSince": "2014-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664075",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-29T02:00:00.000Z"
      },
      {
        "company": "gulf-horizon-logistics",
        "divisionName": "Jahra Factory",
        "divisionCode": "GHL-BR-10",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 113,
        "operationalSince": "2015-01-01",
        "licenseNumber": "MOCI-2018-1975",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2022-04-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "KWTRN100075",
        "commercialRegistrationNumber": "CRN-200075",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Gulf Horizon Logistics LLC",
        "country": "kw",
        "emirateState": "jahra",
        "city": "Jahra",
        "addressLine1": "175 Corniche Street",
        "addressLine2": "Suite 35",
        "postalCode": "10075",
        "gpsCoordinates": "29.3375,47.6581",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "ghl-br-10@gulf-horizon-logistics.com",
        "contactPhone": "+971-4-2553775",
        "alternatePhone": "+971-50-1003975",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "completed",
        "lastAuditDate": "2023-04-01",
        "nextAuditDueDate": "2027-04-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "GHL-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Customs Clearance",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "customs.clearance@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664075",
            "description": "Customs Clearance sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 19,
            "operationalSince": "2015-01-01",
            "scopes": [
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
            ]
          },
          {
            "subDivisionName": "Fleet Operations",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "fleet.operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664116",
            "description": "Fleet Operations sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2016-01-01",
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
              }
            ]
          },
          {
            "subDivisionName": "Warehouse Management",
            "company": "gulf-horizon-logistics",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "warehouse.management@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2664157",
            "description": "Warehouse Management sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "GHL-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "GHL-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "GHL-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-29T08:00:00.000Z"
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
        "company": "al-waha-construction",
        "divisionName": "Dubai Head Office",
        "divisionCode": "AWC-BR-01",
        "divisionType": "head_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 120,
        "operationalSince": "2016-01-01",
        "licenseNumber": "ADGM-2019-1988",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-05-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100076",
        "commercialRegistrationNumber": "CRN-200076",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "dubai",
        "city": "Dubai",
        "addressLine1": "176 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10076",
        "gpsCoordinates": "25.2048,55.2708",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "awc-br-01@al-waha-construction.com",
        "contactPhone": "+971-4-2553812",
        "alternatePhone": "",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "not_planned",
        "submittedBy": "Sarah Johnson",
        "lastAuditDate": "2024-05-01",
        "nextAuditDueDate": "2026-05-01",
        "sectorActivity": "technology",
        "parentDivision": null,
        "parentNode": "corporate-hq",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Site Management",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "site.management@al-waha-construction.com",
            "contactPhone": "+971-4-2664116",
            "description": "Site Management sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 22,
            "operationalSince": "2016-01-01",
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
              }
            ]
          },
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664157",
            "description": "Procurement sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-01-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-01-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-01-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-29T14:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Abu Dhabi Subsidiary",
        "divisionCode": "AWC-BR-02",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 127,
        "operationalSince": "2017-01-01",
        "licenseNumber": "MOCI-2020-2001",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-06-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100077",
        "commercialRegistrationNumber": "CRN-200077",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "abudhabi",
        "city": "Abu Dhabi",
        "addressLine1": "177 Industrial Area Street",
        "addressLine2": "Suite 37",
        "postalCode": "10077",
        "gpsCoordinates": "24.4539,54.3773",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "awc-br-02@al-waha-construction.com",
        "contactPhone": "+971-4-2553849",
        "alternatePhone": "+971-50-1004081",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "planned",
        "lastAuditDate": "2025-06-01",
        "nextAuditDueDate": "2027-06-01",
        "sectorActivity": "healthcare",
        "parentDivision": "AWC-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664157",
            "description": "Procurement sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 25,
            "operationalSince": "2017-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "subDivisional",
                "auditFrequency": "quarterly",
                "riskRating": "high"
              },
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664198",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 28,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664239",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-02-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-02-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-02-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-29T20:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Sharjah Division",
        "divisionCode": "AWC-BR-03",
        "divisionType": "department",
        "departmentType": "executive-management",
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 134,
        "operationalSince": "2018-01-01",
        "licenseNumber": "DED-2021-2014",
        "licenseAuthority": "ded",
        "licenseIssueDate": "2019-07-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100078",
        "commercialRegistrationNumber": "CRN-200078",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "sharjah",
        "city": "Sharjah",
        "addressLine1": "178 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10078",
        "gpsCoordinates": "25.3463,55.4209",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "awc-br-03@al-waha-construction.com",
        "contactPhone": "+971-4-2553886",
        "alternatePhone": "+971-50-1004134",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "in_progress",
        "lastAuditDate": "2023-07-01",
        "nextAuditDueDate": "2026-07-01",
        "sectorActivity": "construction",
        "parentDivision": "AWC-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664198",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 28,
            "operationalSince": "2018-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
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
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664239",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-03-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-03-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-03-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-30T02:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Fujairah Representative Office",
        "divisionCode": "AWC-BR-04",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "inactive",
        "currency": "AED",
        "numberOfEmployees": 141,
        "operationalSince": "2019-01-01",
        "licenseNumber": "ADCCI-2022-2027",
        "licenseAuthority": "adcci",
        "licenseIssueDate": "2020-08-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100079",
        "commercialRegistrationNumber": "CRN-200079",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "fujairah",
        "city": "Fujairah",
        "addressLine1": "179 Al Khaleej Street",
        "addressLine2": "Suite 39",
        "postalCode": "10079",
        "gpsCoordinates": "25.1288,56.3265",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "awc-br-04@al-waha-construction.com",
        "contactPhone": "+971-4-2553923",
        "alternatePhone": "+971-50-1004187",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "completed",
        "lastAuditDate": "2024-08-01",
        "nextAuditDueDate": "2027-08-01",
        "sectorActivity": "real_estate",
        "parentDivision": "AWC-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664239",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 31,
            "operationalSince": "2019-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
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
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Site Management",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "site.management@al-waha-construction.com",
            "contactPhone": "+971-4-2664280",
            "description": "Site Management sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 4,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664321",
            "description": "Procurement sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-04-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-04-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-04-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-30T08:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Ras Al Khaimah Warehouse",
        "divisionCode": "AWC-BR-05",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 8,
        "operationalSince": "2020-01-01",
        "licenseNumber": "SCCI-2023-2040",
        "licenseAuthority": "scci",
        "licenseIssueDate": "2021-09-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100080",
        "commercialRegistrationNumber": "CRN-200080",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "rak",
        "city": "Ras Al Khaimah",
        "addressLine1": "180 Al Wasl Street",
        "addressLine2": "",
        "postalCode": "10080",
        "gpsCoordinates": "25.7895,55.9432",
        "divisionManager": "user-004",
        "primaryContactPerson": "user-006",
        "contactEmail": "awc-br-05@al-waha-construction.com",
        "contactPhone": "+971-4-2553960",
        "alternatePhone": "",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "not_planned",
        "submittedBy": "Fatima Al Zaabi",
        "lastAuditDate": "2025-09-01",
        "nextAuditDueDate": "2026-09-01",
        "sectorActivity": "professional_services",
        "parentDivision": "AWC-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Site Management",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "site.management@al-waha-construction.com",
            "contactPhone": "+971-4-2664280",
            "description": "Site Management sub-division.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 4,
            "operationalSince": "2020-01-01",
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664321",
            "description": "Procurement sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-05-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-05-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-05-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-30T14:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Ajman Factory",
        "divisionCode": "AWC-BR-06",
        "divisionType": "factory",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 15,
        "operationalSince": "2021-01-01",
        "licenseNumber": "DIFC-2015-2053",
        "licenseAuthority": "difc",
        "licenseIssueDate": "2022-10-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "AETRN100081",
        "commercialRegistrationNumber": "CRN-200081",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "ajman",
        "city": "Ajman",
        "addressLine1": "181 Sheikh Zayed Street",
        "addressLine2": "Suite 41",
        "postalCode": "10081",
        "gpsCoordinates": "25.4052,55.5136",
        "divisionManager": "user-005",
        "primaryContactPerson": "user-007",
        "contactEmail": "awc-br-06@al-waha-construction.com",
        "contactPhone": "+971-4-2553997",
        "alternatePhone": "+971-50-1004293",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "planned",
        "lastAuditDate": "2023-10-01",
        "nextAuditDueDate": "2027-10-01",
        "sectorActivity": "financial_services",
        "parentDivision": "AWC-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664321",
            "description": "Procurement sub-division.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 7,
            "operationalSince": "2021-01-01",
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low"
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664362",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664403",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-06-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-06-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-06-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-30T20:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Umm Al Quwain Project Office",
        "divisionCode": "AWC-BR-07",
        "divisionType": "project_office",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 22,
        "operationalSince": "2022-01-01",
        "licenseNumber": "ADGM-2016-2066",
        "licenseAuthority": "adgm",
        "licenseIssueDate": "2023-11-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "AETRN100082",
        "commercialRegistrationNumber": "CRN-200082",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "ummalquwain",
        "city": "Umm Al Quwain",
        "addressLine1": "182 King Fahd Street",
        "addressLine2": "",
        "postalCode": "10082",
        "gpsCoordinates": "25.5647,55.5534",
        "divisionManager": "user-006",
        "primaryContactPerson": "user-001",
        "contactEmail": "awc-br-07@al-waha-construction.com",
        "contactPhone": "+971-4-2554034",
        "alternatePhone": "+971-50-1004346",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "in_progress",
        "lastAuditDate": "2024-11-01",
        "nextAuditDueDate": "2026-11-01",
        "sectorActivity": "retail",
        "parentDivision": "AWC-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "archived",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664362",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 10,
            "operationalSince": "2022-01-01",
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "subDivisional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664403",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-07-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-07-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-07-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-31T02:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Khorfakkan Subsidiary",
        "divisionCode": "AWC-BR-08",
        "divisionType": "subsidiary",

        "departmentType": null,
        "status": "active",
        "currency": "AED",
        "numberOfEmployees": 29,
        "operationalSince": "2023-01-01",
        "licenseNumber": "MOCI-2017-2079",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2024-12-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "AETRN100083",
        "commercialRegistrationNumber": "CRN-200083",
        "divisionTimezone": "Asia/Dubai",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "ae",
        "emirateState": "khorfakkan",
        "city": "Khorfakkan",
        "addressLine1": "183 Corniche Street",
        "addressLine2": "Suite 43",
        "postalCode": "10083",
        "gpsCoordinates": "25.3400,56.3400",
        "divisionManager": "user-007",
        "primaryContactPerson": "user-002",
        "contactEmail": "awc-br-08@al-waha-construction.com",
        "contactPhone": "+971-4-2554071",
        "alternatePhone": "+971-50-1004399",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "completed",
        "lastAuditDate": "2025-12-01",
        "nextAuditDueDate": "2027-12-01",
        "sectorActivity": "manufacturing",
        "parentDivision": "AWC-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "pending",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664403",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high"
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Site Management",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "site.management@al-waha-construction.com",
            "contactPhone": "+971-4-2664444",
            "description": "Site Management sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 16,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664485",
            "description": "Procurement sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-08-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-08-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-08-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-31T08:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Dammam Division",
        "divisionCode": "AWC-BR-09",
        "divisionType": "department",
        "departmentType": "administration",
        "status": "inactive",
        "currency": "SAR",
        "numberOfEmployees": 36,
        "operationalSince": "2010-01-01",
        "licenseNumber": "MOCI-2018-2092",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2019-01-01",
        "licenseExpiryDate": "2025-05-01",
        "taxRegistrationNumber": "SATRN100084",
        "commercialRegistrationNumber": "CRN-200084",
        "divisionTimezone": "Asia/Riyadh",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "sa",
        "emirateState": "eastern",
        "city": "Dammam",
        "addressLine1": "184 Al Rashid Street",
        "addressLine2": "",
        "postalCode": "10084",
        "gpsCoordinates": "26.4207,50.0888",
        "divisionManager": "user-001",
        "primaryContactPerson": "user-003",
        "contactEmail": "awc-br-09@al-waha-construction.com",
        "contactPhone": "+971-4-2554108",
        "alternatePhone": "",
        "riskRating": "low",
        "riskStatus": "open",
        "auditStatus": "not_planned",
        "submittedBy": "Mohammed Al Rashid",
        "lastAuditDate": "2023-01-01",
        "nextAuditDueDate": "2026-01-01",
        "sectorActivity": "technology",
        "parentDivision": "AWC-BR-01",
        "parentNode": "finance-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Site Management",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "site.management@al-waha-construction.com",
            "contactPhone": "+971-4-2664444",
            "description": "Site Management sub-division.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 16,
            "operationalSince": "2010-01-01",
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664485",
            "description": "Procurement sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-09-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-09-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-09-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-31T14:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Muharraq Representative Office",
        "divisionCode": "AWC-BR-10",
        "divisionType": "representative_office",

        "departmentType": null,
        "status": "active",
        "currency": "BHD",
        "numberOfEmployees": 43,
        "operationalSince": "2011-01-01",
        "licenseNumber": "MOCI-2019-2105",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2020-02-01",
        "licenseExpiryDate": "2026-09-15",
        "taxRegistrationNumber": "BHTRN100085",
        "commercialRegistrationNumber": "CRN-200085",
        "divisionTimezone": "Asia/Bahrain",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "bh",
        "emirateState": "muharraq",
        "city": "Muharraq",
        "addressLine1": "185 Industrial Area Street",
        "addressLine2": "Suite 45",
        "postalCode": "10085",
        "gpsCoordinates": "26.2572,50.6119",
        "divisionManager": "user-002",
        "primaryContactPerson": "user-004",
        "contactEmail": "awc-br-10@al-waha-construction.com",
        "contactPhone": "+971-4-2554145",
        "alternatePhone": "+971-50-1004505",
        "riskRating": "medium",
        "riskStatus": "monitored",
        "auditStatus": "planned",
        "lastAuditDate": "2024-02-01",
        "nextAuditDueDate": "2027-02-01",
        "sectorActivity": "healthcare",
        "parentDivision": "AWC-BR-01",
        "parentNode": "ops-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Procurement",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "procurement@al-waha-construction.com",
            "contactPhone": "+971-4-2664485",
            "description": "Procurement sub-division.",
            "subDivisionHead": null,
            "numberOfEmployees": 19,
            "operationalSince": "2011-01-01",
            "scopes": [
              {
                "scopeName": "Health & Safety Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium"
              },
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664526",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 22,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664567",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 25,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-10-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-10-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-10-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-05-31T20:00:00.000Z"
      },
      {
        "company": "al-waha-construction",
        "divisionName": "Ahmadi Warehouse",
        "divisionCode": "AWC-BR-11",
        "divisionType": "warehouse",

        "departmentType": null,
        "status": "active",
        "currency": "KWD",
        "numberOfEmployees": 50,
        "operationalSince": "2012-01-01",
        "licenseNumber": "MOCI-2020-2118",
        "licenseAuthority": "moci",
        "licenseIssueDate": "2021-03-01",
        "licenseExpiryDate": "2028-03-01",
        "taxRegistrationNumber": "KWTRN100086",
        "commercialRegistrationNumber": "CRN-200086",
        "divisionTimezone": "Asia/Kuwait",
        "legalEntityName": "Al Waha Construction & Contracting LLC",
        "country": "kw",
        "emirateState": "ahmadi",
        "city": "Ahmadi",
        "addressLine1": "186 Business Bay Street",
        "addressLine2": "",
        "postalCode": "10086",
        "gpsCoordinates": "29.0769,48.0837",
        "divisionManager": "user-003",
        "primaryContactPerson": "user-005",
        "contactEmail": "awc-br-11@al-waha-construction.com",
        "contactPhone": "+971-4-2554182",
        "alternatePhone": "+971-50-1004558",
        "riskRating": "high",
        "riskStatus": "closed",
        "auditStatus": "in_progress",
        "lastAuditDate": "2025-03-01",
        "nextAuditDueDate": "2026-03-01",
        "sectorActivity": "construction",
        "parentDivision": "AWC-BR-01",
        "parentNode": "tech-div",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionName": "Health & Safety",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "health.safety@al-waha-construction.com",
            "contactPhone": "+971-4-2664526",
            "description": "Health & Safety sub-division.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 22,
            "operationalSince": "2012-01-01",
            "scopes": [
              {
                "scopeName": "Customs Compliance Review",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low"
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Project Engineering",
            "company": "al-waha-construction",
            "parentSubDivisions": [],
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "project.engineering@al-waha-construction.com",
            "contactPhone": "+971-4-2664567",
            "description": "Project Engineering sub-division.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 25,
            "operationalSince": "2013-01-01",
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "subDivisional",
                "auditFrequency": "monthly",
                "riskRating": "low"
              },
              {
                "scopeName": "Financial Statement Audit",
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
            ]
          }
        ],
        "tradeLicenseFile": {
          "name": "AWC-BR-11-trade-license.pdf",
          "url": "https://example.com/docs/trade-license.pdf"
        },
        "vatCertificateFile": {
          "name": "AWC-BR-11-vat-certificate.pdf",
          "url": "https://example.com/docs/vat-certificate.pdf"
        },
        "orgDocumentsFile": {
          "name": "AWC-BR-11-org-documents.pdf",
          "url": "https://example.com/docs/org-documents.pdf"
        },
        "createdAt": "2026-06-01T02:00:00.000Z"
      }
    ]
  }
];

/**
 * The live division roster every consumer imports. Which seed backs it depends
 * on CLIENT_MODE_VALUE: the multi-company audit-firm roster above, or the
 * single-org DAR Exchange seed in division-static-indi-org.data.ts. Read at
 * module scope (not via DI) because this array is imported directly by ~25
 * modules and mutated in place by the helpers below — it has to be the right
 * array before any of them evaluate.
 */
export const DIVISION_STATIC_COMPANIES: StaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? DIVISION_INDI_ORG_COMPANIES
    : AUDIT_FIRM_DIVISION_COMPANIES;

/* ── Mutations ────────────────────────────────────────────────────────────
 * There's no backend behind this page — the Add/Edit Division drawer writes
 * straight into this in-memory array so divisions.html reflects
 * additions/edits immediately. Same approach as sub-division-static-data.ts:
 * add just pushes; edit merges in place unless the division moved company.
 */
/**
 * Adds a brand-new `division` under `companyId`. Always stamps a fresh
 * `createdAt` here (ignoring anything the caller passed), so a newly-added
 * division always sorts to the top of the newest-first list. Also always
 * starts the division at `auditStatus: 'pending_review'` regardless of what
 * the Add Division form's Audit Status field was set to — every new division
 * has to clear the Organization Requests approval queue before it's
 * considered live.
 */
export function upsertStaticDivision(
  companyId: string,
  division: Omit<StaticDivision, 'createdAt'>,
  companyMeta?: CompanyMeta,
): void {
  let company = DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    company = {
      id: companyId,
      companyName: companyMeta?.companyName ?? companyId,
      tag: companyMeta?.tag ?? companyId.slice(0, 3).toUpperCase(),
      color: companyMeta?.color ?? DIVISION_DEFAULT_COMPANY_COLOR,
      industry: companyMeta?.industry === 'jewelry' ? 'jewelry' : 'other',
      divisions: [],
    };
    DIVISION_STATIC_COMPANIES.push(company);
  }
  company.divisions.push({ ...division, auditStatus: DivisionAuditStatuses.PendingReview, createdAt: new Date().toISOString() });
}

/**
 * Updates the division previously identified by `previousDivisionCode`, merging
 * in `updates` (the form's fields) onto the existing record — file fields
 * (`tradeLicenseFile`/etc.) are left untouched since the form manages those
 * separately. If `updates.company` still matches the division's current
 * company, it's replaced in place (keeping its position in that company's
 * division list); otherwise it's moved to the new company's division list.
 */
export function editStaticDivision(previousDivisionCode: string, updates: DivisionEditableFields): void {
  for (const company of DIVISION_STATIC_COMPANIES) {
    const idx = company.divisions.findIndex(b => b.divisionCode === previousDivisionCode);
    if (idx === -1) continue;

    const merged: StaticDivision = { ...company.divisions[idx], ...updates };
    const targetCompany = DIVISION_STATIC_COMPANIES.find(c => c.id === updates.company);
    if (!targetCompany) return;

    if (targetCompany === company) {
      company.divisions[idx] = merged;
    } else {
      company.divisions.splice(idx, 1);
      targetCompany.divisions.push(merged);
    }
    return;
  }
}

/** Sets a division's `status` in place (used by the Activate/Deactivate action). */
export function setDivisionStatus(divisionCode: string, status: DivisionStatus): void {
  for (const company of DIVISION_STATIC_COMPANIES) {
    const division = company.divisions.find(b => b.divisionCode === divisionCode);
    if (division) {
      division.status = status;
      return;
    }
  }
}

export function setDivisionAuditStatus(divisionCode: string, status: AuditStatus): void {
  for (const company of DIVISION_STATIC_COMPANIES) {
    const division = company.divisions.find(b => b.divisionCode === divisionCode);
    if (division) {
      division.auditStatus = status;
      return;
    }
  }
}

/**
 * Forces every division under `companyId` to `status: 'inactive'` — called by
 * `CompanyDataService.toggleBlocked()` when a company is deactivated, so
 * deactivating a company at the top level cascades down to its divisions
 * (divisions.html and client-org-chart.component.html both read this same
 * array, so the effect is visible on both immediately). Deliberately
 * one-directional: reactivating a company does NOT auto-reactivate its
 * divisions, since some may have been independently deactivated beforehand
 * for their own reasons — only division/subDivision/scope activate/deactivate
 * stays fully independent otherwise, this is the one intentional exception.
 */
export function deactivateAllDivisionsForCompany(companyId: string): void {
  const company = DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) return;
  for (const division of company.divisions) {
    division.status = DivisionStatuses.Inactive;
  }
}
