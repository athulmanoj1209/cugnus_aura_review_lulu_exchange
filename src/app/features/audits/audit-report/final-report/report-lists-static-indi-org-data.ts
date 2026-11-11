// Internal-audit (indi-org) seed variant of the Reports Lists static data --
// the same shape as reports-lists-static-data.ts, selected by CLIENT_MODE_VALUE
// there. Uses the exact same company/division identity space as
// report-template-static-ind.data.ts (same ids/division codes) so a report's
// company/division always cascades to the same real template options.

import { INTERNAL_AUDIT_CLIENT_KEY_VALUE } from "@/app/core/config/client-mode";
import { REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES } from "./report-lists-static-xyz-broadcast.data";
import { LULU_EXCHANGE_REPORTS_LIST_COMPANIES } from "./report-lists-static-lulu-exchange.data";
import type { AuditReportRecord, ReportsListStaticCompany, CompanyLookupEntry } from "./models/final-report-static-data.model";

const DAR_EXCHANGE_REPORTS_LIST_COMPANIES: ReportsListStaticCompany[] = [
  {
    "id": "abc-broadcast",
    "companyName": "ABC Broadcast",
    "tag": "ABC",
    "color": "#0b6e75",
    "divisions": [
      {
        "divisionCode": "ABC-BR-04",
        "divisionName": "HR Dept",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-01T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
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
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
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
          },
          {
            "createdAt": "2023-01-14T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
            "reportTitle": "HR Policy & Payroll Compliance Review 2026",
            "auditType": "internal",
            "status": "draft",
            "createdDate": "2026-01-15",
            "updatedDate": "2026-02-02",
            "leadAuditor": "Sara Al Naqbi",
            "reportPeriod": "quarterly",
            "publishedByName": "Huda Al Marri",
            "publishedByRole": "HR Audit Associate",
            "reviewerName": "Talal Yousef",
            "reviewerRole": "Senior Reviewer",
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
        "divisionCode": "ABC-BR-03",
        "divisionName": "Finance",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-03T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
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
              "templateName": "Vendor & Procurement Audit Template",
              "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
              "industryType": "professional_services",
              "templateFileName": "Vendor_Procurement_Audit_Template.docx",
              "submittedByName": "Hamdan Al Shamsi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-04T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
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
            "createdAt": "2023-01-15T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
            "reportTitle": "Annual AML Compliance Audit 2026",
            "auditType": "financial",
            "status": "approved",
            "createdDate": "2026-02-10",
            "updatedDate": "2026-03-05",
            "leadAuditor": "Yara Haddad",
            "reportPeriod": "yearly",
            "publishedByName": "Salim Al Kindi",
            "publishedByRole": "Compliance Associate",
            "reviewerName": "Nabil Farouk",
            "reviewerRole": "Compliance Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Financial Statement Audit Template",
              "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
              "industryType": "manufacturing",
              "templateFileName": "Financial_Statement_Audit_Template.docx",
              "submittedByName": "Noora Al Kaabi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-14",
        "divisionName": "IT",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-05T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
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
              "templateName": "HR & Payroll Compliance Audit Template",
              "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
              "industryType": "banking",
              "templateFileName": "HR_Payroll_Compliance_Audit_Template.docx",
              "submittedByName": "Salma Al Dhaheri",
              "submittedByRole": "Compliance Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-06T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
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
              "templateName": "IT Security Controls Audit Template",
              "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
              "industryType": "banking",
              "templateFileName": "IT_Security_Controls_Audit_Template.docx",
              "submittedByName": "Rashid Al Mazrouei",
              "submittedByRole": "IT Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-16T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
            "reportTitle": "IT Security Posture Assessment 2026",
            "auditType": "external",
            "status": "in_review",
            "createdDate": "2026-03-05",
            "updatedDate": "2026-03-22",
            "leadAuditor": "Marcus Webb",
            "reportPeriod": "half_yearly",
            "publishedByName": "Reem Al Falasi",
            "publishedByRole": "IT Audit Associate",
            "reviewerName": "Sven Lindqvist",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "IT Security Controls Audit Template",
              "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
              "industryType": "banking",
              "templateFileName": "IT_Security_Controls_Audit_Template.docx",
              "submittedByName": "Rashid Al Mazrouei",
              "submittedByRole": "IT Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-12",
        "divisionName": "OPS",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-07T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
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
              "templateName": "Retail Sales Reconciliation Template",
              "templateDescription": "Reconciliation report matching point-of-sale records against ledger entries and cash deposits.",
              "industryType": "retail",
              "templateFileName": "Retail_Sales_Reconciliation_Template.docx",
              "submittedByName": "Mariam Al Suwaidi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-08T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
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
              "templateName": "Tax Compliance Review Template",
              "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
              "industryType": "retail",
              "templateFileName": "Tax_Compliance_Review_Template.docx",
              "submittedByName": "Aysha Al Marzooqi",
              "submittedByRole": "Tax Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-17T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
            "reportTitle": "Vendor Due Diligence Audit 2026",
            "auditType": "internal",
            "status": "draft",
            "createdDate": "2026-04-01",
            "updatedDate": "2026-04-01",
            "leadAuditor": "Ziad Mansour",
            "reportPeriod": "quarterly",
            "publishedByName": "Fatima Al Qassimi",
            "publishedByRole": "Audit Associate",
            "reviewerName": "Diego Alvarez",
            "reviewerRole": "Audit Supervisor",
            "template": {
              "templateId": null,
              "templateName": "Vendor & Procurement Audit Template",
              "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
              "industryType": "professional_services",
              "templateFileName": "Vendor_Procurement_Audit_Template.docx",
              "submittedByName": "Hamdan Al Shamsi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-05",
        "divisionName": "AML",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-09T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
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
              "templateName": "Environmental Compliance Audit Template",
              "templateDescription": "Compliance report evaluating environmental controls, waste handling, and emissions monitoring practices.",
              "industryType": "manufacturing",
              "templateFileName": "Environmental_Compliance_Audit_Template.docx",
              "submittedByName": "Khalid Al Ameri",
              "submittedByRole": "Environmental Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-10T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
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
              "templateName": "Financial Statement Audit Template",
              "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
              "industryType": "manufacturing",
              "templateFileName": "Financial_Statement_Audit_Template.docx",
              "submittedByName": "Noora Al Kaabi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-18T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
            "reportTitle": "Sanctions Screening Effectiveness Review 2026",
            "auditType": "financial",
            "status": "in_review",
            "createdDate": "2026-02-20",
            "updatedDate": "2026-03-10",
            "leadAuditor": "Noura Al Hosani",
            "reportPeriod": "half_yearly",
            "publishedByName": "Bilal Rahman",
            "publishedByRole": "Compliance Associate",
            "reviewerName": "Layla Nasser",
            "reviewerRole": "Compliance Reviewer",
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
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-06",
        "divisionName": "RISK",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-11T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
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
              "templateName": "Free Zone Trade Compliance Template",
              "templateDescription": "Audit report reviewing free zone trade licensing, customs compliance, and import-export documentation.",
              "industryType": "trade",
              "templateFileName": "Free_Zone_Trade_Compliance_Template.docx",
              "submittedByName": "Mariam Al Nuaimi",
              "submittedByRole": "Trade Compliance Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-12T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
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
              "templateName": "Fixed Assets Verification Template",
              "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
              "industryType": "trade",
              "templateFileName": "Fixed_Assets_Verification_Template_v2.docx",
              "submittedByName": "Obaid Al Zaabi",
              "submittedByRole": "Audit Associate",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-19T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
            "reportTitle": "Enterprise Risk Management Review 2026",
            "auditType": "internal",
            "status": "approved",
            "createdDate": "2026-05-12",
            "updatedDate": "2026-06-01",
            "leadAuditor": "Petra Nowak",
            "reportPeriod": "yearly",
            "publishedByName": "Khalid Al Suwaidi",
            "publishedByRole": "Risk Associate",
            "reviewerName": "Amina Toure",
            "reviewerRole": "Senior QA Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Fixed Assets Verification Template",
              "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
              "industryType": "trade",
              "templateFileName": "Fixed_Assets_Verification_Template_v2.docx",
              "submittedByName": "Obaid Al Zaabi",
              "submittedByRole": "Audit Associate",
              "status": "active"
            }
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-07",
        "divisionName": "CONSUMER PROTECTION",
        "industryType": "financial_services",
        "auditReports": [
          {
            "createdAt": "2023-01-13T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "CONSUMER PROTECTION",
            "divisionCode": "ABC-BR-07",
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
              "templateName": "Vendor & Procurement Audit Template",
              "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
              "industryType": "trade",
              "templateFileName": "Vendor_Procurement_Audit_Template_v2.docx",
              "submittedByName": "Shamma Al Suwaidi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2023-01-20T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "CONSUMER PROTECTION",
            "divisionCode": "ABC-BR-07",
            "reportTitle": "Customer Complaints Handling Audit 2026",
            "auditType": "external",
            "status": "draft",
            "createdDate": "2026-06-18",
            "updatedDate": "2026-06-18",
            "leadAuditor": "Farah Idris",
            "reportPeriod": "monthly",
            "publishedByName": "Waleed Al Amiri",
            "publishedByRole": "Consumer Protection Associate",
            "reviewerName": "Grace Effiong",
            "reviewerRole": "Audit Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Vendor & Procurement Audit Template",
              "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
              "industryType": "trade",
              "templateFileName": "Vendor_Procurement_Audit_Template_v2.docx",
              "submittedByName": "Shamma Al Suwaidi",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          }
        ]
      }
    ]
  }
];

export const REPORTS_LIST_STATIC_INDI_ORG_COMPANIES: ReportsListStaticCompany[] =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? LULU_EXCHANGE_REPORTS_LIST_COMPANIES
  : DAR_EXCHANGE_REPORTS_LIST_COMPANIES;


/** Flattened view over the tree above — the raw seed reports-lists.ts stamps ids/periodZone onto. */
export const RAW_AUDIT_REPORTS_FLAT: AuditReportRecord[] = REPORTS_LIST_STATIC_INDI_ORG_COMPANIES.flatMap(c =>
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
  const division = REPORTS_LIST_STATIC_INDI_ORG_COMPANIES
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

export const REPORTS_LIST_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORTS_LIST_STATIC_INDI_ORG_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
