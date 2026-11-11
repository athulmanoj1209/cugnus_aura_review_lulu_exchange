// Self-contained static data for the Reports Lists module
// (reports-lists.ts) -- an independently-authored copy of the same
// company/division roster used in divisions/division-static-data.ts (same 8
// companies -- ids/tags/colors -- same division codes/names/sector
// activities), extended with the audit report records that used to live in
// reports-lists.ts's own RAW_REPORTS array (same reportTitle/auditType/
// status/dates/template content, only the companyId/divisionCode/divisionName
// were fake before). Audit reports are nested under the division they belong
// to, not the company, mirroring how sub-division-static-data.ts nests
// sub-divisions under divisions.
//
// Uses the exact same company/division identity space as
// report-template-static-data.ts (same ids/division codes) so a report's
// company/division always cascades to the same real template options.

import { CLIENT_MODE_VALUE } from "@/app/core/config/client-mode";
import { StaticCompany } from "@/app/features/audits/organization/client-org-chart/models/client-org-chart-static-data.model";
import { REPORTS_LIST_STATIC_INDI_ORG_COMPANIES } from "./report-lists-static-indi-org-data";
import type { AuditReportRecord, ReportsListStaticCompany, CompanyLookupEntry } from "./models/final-report-static-data.model";

export const REPORTS_LIST_STATIC_AUDIT_FIRM_COMPANIES: ReportsListStaticCompany[] = [
  {
    "id": "al-noor-jewellery",
    "companyName": "Al Noor Jewellery Group",
    "tag": "ANJ",
    "color": "#b8860b",
    "divisions": [
      {
        "divisionCode": "ANJ-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "professional_services",
        "auditReports": [
          {
            "createdAt": "2023-01-01T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
            "reportTitle": "Internal Audit Summary - Q1 2025",
            "auditType": "internal",
            "status": "approved",
            "createdDate": "2025-01-05",
            "updatedDate": "2025-02-10",
            "leadAuditor": "Alice Johnson",
            "reportPeriod": "quarterly",
            "publishedByName": "Mona Al Bloushi",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Eve Martinez",
            "reviewerRole": "Quality Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Internal Audit Summary Template",
              "templateDescription": "Standard summary report covering scope, findings, and recommendations for internal audit engagements.",
              "industryType": "professional_services",
              "templateFileName": "IA_Summary_Report_Template_v3.docx",
              "submittedByName": "Ahmed Al Farsi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-02T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
            "reportTitle": "Regulatory Compliance Review",
            "auditType": "external",
            "status": "in_review",
            "createdDate": "2025-04-02",
            "updatedDate": "2025-04-18",
            "leadAuditor": "Bob Smith",
            "reportPeriod": "half_yearly",
            "publishedByName": "Rashid Al Marri",
            "publishedByRole": "Compliance Associate",
            "reviewerName": "Frank Chen",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Internal Audit Summary Template",
              "templateDescription": "Standard summary report covering scope, findings, and recommendations for internal audit engagements.",
              "industryType": "professional_services",
              "templateFileName": "IA_Summary_Report_Template_v3.docx",
              "submittedByName": "Ahmed Al Farsi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "banking",
        "auditReports": [
          {
            "createdAt": "2023-01-03T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
            "reportTitle": "Regulatory Risk Assessment",
            "auditType": "financial",
            "status": "draft",
            "createdDate": "2025-03-01",
            "updatedDate": "2025-03-01",
            "leadAuditor": "Carol White",
            "reportPeriod": "yearly",
            "publishedByName": "Aisha Al Nuaimi",
            "publishedByRole": "Risk Associate",
            "reviewerName": "Ivan Rossi",
            "reviewerRole": "Risk Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Regulatory Risk Assessment Template",
              "templateDescription": "Assessment report evaluating regulatory risk exposure across banking operations and controls.",
              "industryType": "banking",
              "templateFileName": "Regulatory_Risk_Assessment_v1.docx",
              "submittedByName": "Omar Khalid",
              "submittedByRole": "Compliance Officer",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-04T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
            "reportTitle": "AML Findings Report",
            "auditType": "financial",
            "status": "reopened",
            "createdDate": "2024-11-15",
            "updatedDate": "2025-01-22",
            "leadAuditor": "David Lee",
            "reportPeriod": "half_yearly",
            "publishedByName": "Saeed Al Kaabi",
            "publishedByRole": "Compliance Associate",
            "reviewerName": "George Hassan",
            "reviewerRole": "Compliance Reviewer",
            "template": {
              "templateId": null,
              "templateName": "HR & Payroll Compliance Audit Template",
              "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
              "industryType": "banking",
              "templateFileName": "HR_Payroll_Compliance_Audit_Template.docx",
              "submittedByName": "Salma Al Dhaheri",
              "submittedByRole": "Compliance Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "retail",
        "auditReports": [
          {
            "createdAt": "2023-01-05T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
            "reportTitle": "Inventory & Stock Audit",
            "auditType": "internal",
            "status": "approved",
            "createdDate": "2025-02-10",
            "updatedDate": "2025-03-05",
            "leadAuditor": "Emma Clarke",
            "reportPeriod": "monthly",
            "publishedByName": "Noor Al Shamsi",
            "publishedByRole": "Audit Associate",
            "reviewerName": "Helen Park",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Inventory & Stock Audit Template",
              "templateDescription": "Audit report covering stock counts, valuation accuracy, and inventory control effectiveness.",
              "industryType": "retail",
              "templateFileName": "Inventory_Stock_Audit_Template.docx",
              "submittedByName": "Yousef Al Hammadi",
              "submittedByRole": "Internal Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-06T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
            "reportTitle": "Retail Sales Reconciliation",
            "auditType": "financial",
            "status": "in_review",
            "createdDate": "2025-05-01",
            "updatedDate": "2025-05-14",
            "leadAuditor": "Felix Rahman",
            "reportPeriod": "monthly",
            "publishedByName": "Khalifa Al Falasi",
            "publishedByRole": "Audit Associate",
            "reviewerName": "Lisa Kim",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Retail Sales Reconciliation Template",
              "templateDescription": "Reconciliation report matching point-of-sale records against ledger entries and cash deposits.",
              "industryType": "retail",
              "templateFileName": "Retail_Sales_Reconciliation_Template.docx",
              "submittedByName": "Mariam Al Suwaidi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-08",
        "divisionName": "Khorfakkan Representative Office",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-09",
        "divisionName": "Riyadh Warehouse",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-10",
        "divisionName": "Manama Factory",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "ANJ-BR-11",
        "divisionName": "Hawalli Project Office",
        "industryType": "retail",
        "auditReports": []
      }
    ]
  },
  {
    "id": "zumurrud-diamonds",
    "companyName": "Zumurrud Diamonds LLC",
    "tag": "ZUM",
    "color": "#0e9488",
    "divisions": [
      {
        "divisionCode": "ZUM-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "manufacturing",
        "auditReports": [
          {
            "createdAt": "2023-01-07T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "reportTitle": "Project Cost Audit",
            "auditType": "financial",
            "status": "approved",
            "createdDate": "2025-01-20",
            "updatedDate": "2025-02-25",
            "leadAuditor": "Grace Kim",
            "reportPeriod": "quarterly",
            "publishedByName": "Sultan Al Harbi",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Kevin Tan",
            "reviewerRole": "Audit Supervisor",
            "template": {
              "templateId": null,
              "templateName": "Project Cost Audit Template",
              "templateDescription": "Report assessing project cost control, budget variance, and contractor billing accuracy.",
              "industryType": "construction",
              "templateFileName": "Project_Cost_Audit_Template_v2.docx",
              "submittedByName": "Faisal Al Otaibi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-08T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "reportTitle": "Site Safety Compliance Report",
            "auditType": "safety",
            "status": "draft",
            "createdDate": "2025-04-10",
            "updatedDate": "2025-04-10",
            "leadAuditor": "Henry Patel",
            "reportPeriod": "yearly",
            "publishedByName": "Bandar Al Shehri",
            "publishedByRole": "Safety Coordinator",
            "reviewerName": "Omar Sheikh",
            "reviewerRole": "Risk Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Financial Statement Audit Template",
              "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
              "industryType": "construction",
              "templateFileName": "Financial_Statement_Audit_Template_KSA.docx",
              "submittedByName": "Bandar Al Otaibi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-02",
        "divisionName": "Abu Dhabi Division",
        "industryType": "technology",
        "auditReports": [
          {
            "createdAt": "2023-01-09T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Abu Dhabi Division",
            "divisionCode": "ZUM-BR-02",
            "reportTitle": "Patient Data Governance Audit",
            "auditType": "internal",
            "status": "in_review",
            "createdDate": "2025-03-18",
            "updatedDate": "2025-04-02",
            "leadAuditor": "Irene Torres",
            "reportPeriod": "half_yearly",
            "publishedByName": "Lama Al Zahrani",
            "publishedByRole": "Compliance Associate",
            "reviewerName": "Julia Ahmed",
            "reviewerRole": "Quality Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Patient Data Governance Audit Template",
              "templateDescription": "Audit report examining patient data handling, access controls, and privacy governance.",
              "industryType": "healthcare",
              "templateFileName": "Patient_Data_Governance_Template.docx",
              "submittedByName": "Huda Al Ghamdi",
              "submittedByRole": "Compliance Officer",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-03",
        "divisionName": "Sharjah Representative Office",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-04",
        "divisionName": "Fujairah Warehouse",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-05",
        "divisionName": "Ras Al Khaimah Factory",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-06",
        "divisionName": "Ajman Project Office",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-07",
        "divisionName": "Umm Al Quwain Subsidiary",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-08",
        "divisionName": "Jeddah Division",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-09",
        "divisionName": "Riffa Representative Office",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "ZUM-BR-10",
        "divisionName": "Jahra Warehouse",
        "industryType": "technology",
        "auditReports": []
      }
    ]
  },
  {
    "id": "falcon-gulf-jewellery",
    "companyName": "Falcon Gulf Jewellery Trading",
    "tag": "FGJ",
    "color": "#a13d63",
    "divisions": [
      {
        "divisionCode": "FGJ-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "healthcare",
        "auditReports": [
          {
            "createdAt": "2023-01-10T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "reportTitle": "Basel III Capital Adequacy Report",
            "auditType": "financial",
            "status": "approved",
            "createdDate": "2025-01-08",
            "updatedDate": "2025-02-01",
            "leadAuditor": "James Malik",
            "reportPeriod": "yearly",
            "publishedByName": "Fahad Al Mannai",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Michael Rao",
            "reviewerRole": "Compliance Manager",
            "template": {
              "templateId": null,
              "templateName": "Basel III Capital Adequacy Template",
              "templateDescription": "Report evaluating capital adequacy ratios and Basel III regulatory alignment.",
              "industryType": "banking",
              "templateFileName": "Basel_III_Capital_Adequacy_Template.docx",
              "submittedByName": "Khalid Al Khalifa",
              "submittedByRole": "Audit Manager",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-11T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "reportTitle": "Liquidity Risk Report",
            "auditType": "financial",
            "status": "reopened",
            "createdDate": "2024-12-01",
            "updatedDate": "2025-01-15",
            "leadAuditor": "Karen Osei",
            "reportPeriod": "quarterly",
            "publishedByName": "Noor Al Ansari",
            "publishedByRole": "Risk Associate",
            "reviewerName": "Rachel Wu",
            "reviewerRole": "Senior QA Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Tax Compliance Review Template",
              "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
              "industryType": "banking",
              "templateFileName": "Tax_Compliance_Review_Template_BHR.docx",
              "submittedByName": "Ali Al Khalifa",
              "submittedByRole": "Tax Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "FGJ-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-04",
        "divisionName": "Fujairah Division",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-05",
        "divisionName": "Ras Al Khaimah Representative Office",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-06",
        "divisionName": "Ajman Warehouse",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-07",
        "divisionName": "Umm Al Quwain Factory",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-08",
        "divisionName": "Khorfakkan Project Office",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-09",
        "divisionName": "Dubai Subsidiary",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-10",
        "divisionName": "Dammam Division",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-11",
        "divisionName": "Muharraq Representative Office",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "FGJ-BR-12",
        "divisionName": "Ahmadi Warehouse",
        "industryType": "professional_services",
        "auditReports": []
      }
    ]
  },
  {
    "id": "marwa-gold-gems",
    "companyName": "Marwa Gold & Gems",
    "tag": "MGG",
    "color": "#c98a1a",
    "divisions": [
      {
        "divisionCode": "MGG-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "banking",
        "auditReports": [
          {
            "createdAt": "2023-01-12T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "reportTitle": "IT General Controls Audit",
            "auditType": "internal",
            "status": "in_review",
            "createdDate": "2025-02-14",
            "updatedDate": "2025-03-01",
            "leadAuditor": "Liam Chen",
            "reportPeriod": "monthly",
            "publishedByName": "Dana Al Rashidi",
            "publishedByRole": "IT Audit Associate",
            "reviewerName": "Nina Costa",
            "reviewerRole": "QA Specialist",
            "template": {
              "templateId": null,
              "templateName": "IT General Controls Audit Template",
              "templateDescription": "Audit report reviewing access management, change control, and IT operations governance.",
              "industryType": "technology",
              "templateFileName": "ITGC_Audit_Report_Template_v2.docx",
              "submittedByName": "Abdullah Al Sabah",
              "submittedByRole": "IT Audit Lead",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-13T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "reportTitle": "Cybersecurity Risk Assessment",
            "auditType": "external",
            "status": "draft",
            "createdDate": "2025-05-05",
            "updatedDate": "2025-05-05",
            "leadAuditor": "Mia Santos",
            "reportPeriod": "quarterly",
            "publishedByName": "Yousef Al Ajmi",
            "publishedByRole": "Security Associate",
            "reviewerName": "Priya Nair",
            "reviewerRole": "Audit Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Cybersecurity Risk Assessment Template",
              "templateDescription": "Assessment report identifying cybersecurity vulnerabilities and mitigation priorities.",
              "industryType": "technology",
              "templateFileName": "Cybersecurity_Risk_Assessment_Template.docx",
              "submittedByName": "Noura Al Mutairi",
              "submittedByRole": "Security Analyst",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-04",
        "divisionName": "Fujairah Division",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-05",
        "divisionName": "Ras Al Khaimah Representative Office",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-06",
        "divisionName": "Ajman Warehouse",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-07",
        "divisionName": "Umm Al Quwain Factory",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-08",
        "divisionName": "Tabuk Project Office",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-09",
        "divisionName": "Isa Town Subsidiary",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "MGG-BR-10",
        "divisionName": "Farwaniya Division",
        "industryType": "retail",
        "auditReports": []
      }
    ]
  },
  {
    "id": "kanz-al-emarat",
    "companyName": "Kanz Al Emarat Jewellery",
    "tag": "KAE",
    "color": "#7a1ac4",
    "divisions": [
      {
        "divisionCode": "KAE-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-02",
        "divisionName": "Abu Dhabi Warehouse",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-03",
        "divisionName": "Sharjah Factory",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-04",
        "divisionName": "Fujairah Project Office",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-05",
        "divisionName": "Ras Al Khaimah Subsidiary",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-06",
        "divisionName": "Ajman Division",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-07",
        "divisionName": "Umm Al Quwain Representative Office",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-08",
        "divisionName": "Khorfakkan Warehouse",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-09",
        "divisionName": "Madinah Factory",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-10",
        "divisionName": "Hamad Town Project Office",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "KAE-BR-11",
        "divisionName": "Mubarak Al-Kabeer Subsidiary",
        "industryType": "healthcare",
        "auditReports": []
      }
    ]
  },
  {
    "id": "desert-rose-retail",
    "companyName": "Desert Rose Retail Group",
    "tag": "DRR",
    "color": "#1a9dc4",
    "divisions": [
      {
        "divisionCode": "DRR-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-08",
        "divisionName": "Khorfakkan Representative Office",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-09",
        "divisionName": "Dubai Warehouse",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-10",
        "divisionName": "Riyadh Factory",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-11",
        "divisionName": "Manama Project Office",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "DRR-BR-12",
        "divisionName": "Hawalli Subsidiary",
        "industryType": "banking",
        "auditReports": []
      }
    ]
  },
  {
    "id": "gulf-horizon-logistics",
    "companyName": "Gulf Horizon Logistics",
    "tag": "GHL",
    "color": "#4a4a4a",
    "divisions": [
      {
        "divisionCode": "GHL-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-08",
        "divisionName": "Jeddah Representative Office",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-09",
        "divisionName": "Riffa Warehouse",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "GHL-BR-10",
        "divisionName": "Jahra Factory",
        "industryType": "manufacturing",
        "auditReports": []
      }
    ]
  },
  {
    "id": "al-waha-construction",
    "companyName": "Al Waha Construction & Contracting",
    "tag": "AWC",
    "color": "#8a5a1a",
    "divisions": [
      {
        "divisionCode": "AWC-BR-01",
        "divisionName": "Dubai Head Office",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-02",
        "divisionName": "Abu Dhabi Subsidiary",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-03",
        "divisionName": "Sharjah Division",
        "industryType": "construction",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-04",
        "divisionName": "Fujairah Representative Office",
        "industryType": "real_estate",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-05",
        "divisionName": "Ras Al Khaimah Warehouse",
        "industryType": "professional_services",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-06",
        "divisionName": "Ajman Factory",
        "industryType": "banking",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-07",
        "divisionName": "Umm Al Quwain Project Office",
        "industryType": "retail",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-08",
        "divisionName": "Khorfakkan Subsidiary",
        "industryType": "manufacturing",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-09",
        "divisionName": "Dammam Division",
        "industryType": "technology",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-10",
        "divisionName": "Muharraq Representative Office",
        "industryType": "healthcare",
        "auditReports": []
      },
      {
        "divisionCode": "AWC-BR-11",
        "divisionName": "Ahmadi Warehouse",
        "industryType": "construction",
        "auditReports": []
      }
    ]
  }
];

export const REPORTS_LIST_STATIC_COMPANIES: ReportsListStaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? REPORTS_LIST_STATIC_INDI_ORG_COMPANIES
    : REPORTS_LIST_STATIC_AUDIT_FIRM_COMPANIES;


/** Flattened view over the tree above — the raw seed reports-lists.ts stamps ids/periodZone onto. */
export const RAW_AUDIT_REPORTS_FLAT: AuditReportRecord[] = REPORTS_LIST_STATIC_COMPANIES.flatMap(c =>
  c.divisions.flatMap(b => b.auditReports),
);

/**
 * Adds a freshly-generated report into the shared static data. Always
 * appends to `RAW_AUDIT_REPORTS_FLAT` (what actually needs to happen for the
 * report to show up) and, best-effort, also into the matching division's
 * `auditReports` in the authoritative nested tree when that division can be
 * found — a generated report isn't required to resolve to a real seed
 * company/division the way a template's home division is, so this never fails
 * to add the record just because that lookup comes up empty. Mirrors
 * `upsertStaticReportTemplate` in report-template-static-data.ts.
 */
export function upsertStaticAuditReport(
  companyId: string,
  divisionCode: string,
  fallbackDivisionName: string,
  fields: Omit<AuditReportRecord, 'companyId' | 'divisionCode' | 'divisionName' | 'createdAt'>,
): AuditReportRecord {
  const division = REPORTS_LIST_STATIC_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode);

  const record: AuditReportRecord = {
    ...fields,
    companyId,
    divisionCode,
    divisionName: division?.divisionName ?? fallbackDivisionName,
    createdAt: new Date().toISOString(),
  };

  division?.auditReports.push(record);
  RAW_AUDIT_REPORTS_FLAT.push(record);
  return record;
}

export const REPORTS_LIST_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORTS_LIST_STATIC_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
