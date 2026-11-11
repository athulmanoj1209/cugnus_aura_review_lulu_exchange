// Self-contained static data for the Report Templates module
// (list/report-template-list.component.ts) -- an independently-authored copy of the same
// company/division roster used in divisions/division-static-data.ts (same 8
// companies -- ids/tags/colors -- same division codes/names/sector
// activities), extended with the report template records that used to live
// in report-template-list.component.ts's own REPORT_TEMPLATES array (same title/
// description/industryType/submittedBy/status content, only the
// companyId/divisionCode/divisionName were fake before). Report templates are
// nested under the division they belong to, not the company, mirroring how
// sub-division-static-data.ts nests sub-divisions under divisions.

import { INTERNAL_AUDIT_CLIENT_KEY_VALUE } from '@/app/core/config/client-mode';
import { REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES } from './report-template-static-xyz-broadcast.data';
import { LULU_EXCHANGE_REPORT_TEMPLATE_COMPANIES } from './report-template-static-lulu-exchange.data';
import type { ReportTemplateRecord, ReportTemplateStaticCompany, CompanyLookupEntry } from './models/report-template-static-data.model';
import { REPORT_TEMPLATE_NEW_SUBMITTER } from './constants/report-template.constants';

const DAR_EXCHANGE_REPORT_TEMPLATE_COMPANIES: ReportTemplateStaticCompany[] = [
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
        "reportTemplates": [
          {
            "id": "RPT-001",
            "templateId": null,
            "createdAt": "2023-01-02T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
            "templateName": "Internal Audit Summary Template",
            "templateDescription": "Standard summary report covering scope, findings, and recommendations for internal audit engagements.",
            "industryType": "professional_services",
            "templateFileName": "IA_Summary_Report_Template_v3.docx",
            "submittedByName": "Ahmed Al Farsi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-002",
            "templateId": null,
            "createdAt": "2023-01-03T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
            "templateName": "Quarterly Compliance Template",
            "templateDescription": "Quarterly compliance status report tracking regulatory obligations and remediation progress.",
            "industryType": "professional_services",
            "templateFileName": "Quarterly_Compliance_Template_v2.docx",
            "submittedByName": "Sara Al Mansoori",
            "submittedByRole": "Audit Manager",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-022",
            "templateId": null,
            "createdAt": "2023-01-23T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "HR Dept",
            "divisionCode": "ABC-BR-04",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "professional_services",
            "templateFileName": "Fixed_Assets_Verification_Template.docx",
            "submittedByName": "Layla Al Suwaidi",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-03",
        "divisionName": "Finance",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-023",
            "templateId": null,
            "createdAt": "2023-01-24T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "professional_services",
            "templateFileName": "Vendor_Procurement_Audit_Template.docx",
            "submittedByName": "Hamdan Al Shamsi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-003",
            "templateId": null,
            "createdAt": "2023-01-04T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
            "templateName": "Regulatory Risk Assessment Template",
            "templateDescription": "Assessment report evaluating regulatory risk exposure across banking operations and controls.",
            "industryType": "banking",
            "templateFileName": "Regulatory_Risk_Assessment_v1.docx",
            "submittedByName": "Omar Khalid",
            "submittedByRole": "Compliance Officer",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-004",
            "templateId": null,
            "createdAt": "2023-01-05T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "Finance",
            "divisionCode": "ABC-BR-03",
            "templateName": "AML Audit Findings Template",
            "templateDescription": "Findings report documenting anti-money laundering control gaps and corrective actions.",
            "industryType": "banking",
            "templateFileName": "AML_Audit_Findings_Template.docx",
            "submittedByName": "Fatima Al Zaabi",
            "submittedByRole": "Risk Analyst",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-14",
        "divisionName": "IT",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-024",
            "templateId": null,
            "createdAt": "2023-01-25T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "banking",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template.docx",
            "submittedByName": "Salma Al Dhaheri",
            "submittedByRole": "Compliance Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-025",
            "templateId": null,
            "createdAt": "2023-01-26T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
            "templateName": "IT Security Controls Audit Template",
            "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
            "industryType": "banking",
            "templateFileName": "IT_Security_Controls_Audit_Template.docx",
            "submittedByName": "Rashid Al Mazrouei",
            "submittedByRole": "IT Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-005",
            "templateId": null,
            "createdAt": "2023-01-06T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "IT",
            "divisionCode": "ABC-BR-14",
            "templateName": "Inventory & Stock Audit Template",
            "templateDescription": "Audit report covering stock counts, valuation accuracy, and inventory control effectiveness.",
            "industryType": "retail",
            "templateFileName": "Inventory_Stock_Audit_Template.docx",
            "submittedByName": "Yousef Al Hammadi",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-12",
        "divisionName": "OPS",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-013",
            "templateId": null,
            "createdAt": "2023-01-14T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
            "templateName": "Retail Sales Reconciliation Template",
            "templateDescription": "Reconciliation report matching point-of-sale records against ledger entries and cash deposits.",
            "industryType": "retail",
            "templateFileName": "Retail_Sales_Reconciliation_Template.docx",
            "submittedByName": "Mariam Al Suwaidi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-026",
            "templateId": null,
            "createdAt": "2023-01-27T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
            "templateName": "Tax Compliance Review Template",
            "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
            "industryType": "retail",
            "templateFileName": "Tax_Compliance_Review_Template.docx",
            "submittedByName": "Aysha Al Marzooqi",
            "submittedByRole": "Tax Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-027",
            "templateId": null,
            "createdAt": "2023-01-28T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "OPS",
            "divisionCode": "ABC-BR-12",
            "templateName": "Related Party Transactions Review Template",
            "templateDescription": "Review report examining disclosure and pricing of related party transactions for regulatory alignment.",
            "industryType": "retail",
            "templateFileName": "Related_Party_Transactions_Review_Template.docx",
            "submittedByName": "Sultan Al Kaabi",
            "submittedByRole": "Audit Manager",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-05",
        "divisionName": "AML",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-015",
            "templateId": null,
            "createdAt": "2023-01-16T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
            "templateName": "Environmental Compliance Audit Template",
            "templateDescription": "Compliance report evaluating environmental controls, waste handling, and emissions monitoring practices.",
            "industryType": "manufacturing",
            "templateFileName": "Environmental_Compliance_Audit_Template.docx",
            "submittedByName": "Khalid Al Ameri",
            "submittedByRole": "Environmental Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-028",
            "templateId": null,
            "createdAt": "2023-01-29T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
            "templateName": "Financial Statement Audit Template",
            "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
            "industryType": "manufacturing",
            "templateFileName": "Financial_Statement_Audit_Template.docx",
            "submittedByName": "Noora Al Kaabi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-029",
            "templateId": null,
            "createdAt": "2023-01-30T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "AML",
            "divisionCode": "ABC-BR-05",
            "templateName": "Internal Controls Assessment Template",
            "templateDescription": "Assessment report evaluating the design and operating effectiveness of key internal controls.",
            "industryType": "manufacturing",
            "templateFileName": "Internal_Controls_Assessment_Template.docx",
            "submittedByName": "Marwan Al Ameri",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-06",
        "divisionName": "RISK",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-030",
            "templateId": null,
            "createdAt": "2023-01-31T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "manufacturing",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template_v2.docx",
            "submittedByName": "Hessa Al Neyadi",
            "submittedByRole": "Compliance Auditor",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-016",
            "templateId": null,
            "createdAt": "2023-01-17T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
            "templateName": "Free Zone Trade Compliance Template",
            "templateDescription": "Audit report reviewing free zone trade licensing, customs compliance, and import-export documentation.",
            "industryType": "trade",
            "templateFileName": "Free_Zone_Trade_Compliance_Template.docx",
            "submittedByName": "Mariam Al Nuaimi",
            "submittedByRole": "Trade Compliance Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-031",
            "templateId": null,
            "createdAt": "2023-02-01T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "RISK",
            "divisionCode": "ABC-BR-06",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "trade",
            "templateFileName": "Fixed_Assets_Verification_Template_v2.docx",
            "submittedByName": "Obaid Al Zaabi",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ABC-BR-07",
        "divisionName": "CONSUMER PROTECTION",
        "industryType": "financial_services",
        "reportTemplates": [
          {
            "id": "RPT-032",
            "templateId": null,
            "createdAt": "2023-02-02T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "CONSUMER PROTECTION",
            "divisionCode": "ABC-BR-07",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "trade",
            "templateFileName": "Vendor_Procurement_Audit_Template_v2.docx",
            "submittedByName": "Shamma Al Suwaidi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-033",
            "templateId": null,
            "createdAt": "2023-02-03T00:00:00.000Z",
            "companyId": "abc-broadcast",
            "divisionName": "CONSUMER PROTECTION",
            "divisionCode": "ABC-BR-07",
            "templateName": "IT Security Controls Audit Template",
            "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
            "industryType": "trade",
            "templateFileName": "IT_Security_Controls_Audit_Template_v2.docx",
            "submittedByName": "Rakan Al Nuaimi",
            "submittedByRole": "IT Auditor",
            "status": "inactive",
            "isUsed": false
          }
        ]
      }
    ]
  }
];

export const REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES: ReportTemplateStaticCompany[] =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? LULU_EXCHANGE_REPORT_TEMPLATE_COMPANIES
  : DAR_EXCHANGE_REPORT_TEMPLATE_COMPANIES;


/** Flattened view over the tree above — what list/report-template-list.component.ts actually renders/filters. */
export const REPORT_TEMPLATES_FLAT: ReportTemplateRecord[] = REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES.flatMap(c =>
  c.divisions.flatMap(b => b.reportTemplates),
);

/**
 * Adds a freshly-created report template into the shared static data — pushed
 * into both the authoritative nested tree (`division.reportTemplates`) and the
 * derived `REPORT_TEMPLATES_FLAT` array (a one-time flatMap snapshot, not a
 * live view, so it needs its own push to pick up the new record immediately).
 * Mirrors `upsertStaticRfi` in rfi-static-data.ts.
 */
export function upsertStaticReportTemplate(
  companyId: string,
  divisionCode: string,
  fields: Omit<ReportTemplateRecord, 'companyId' | 'divisionCode' | 'divisionName' | 'submittedByName' | 'submittedByRole' | 'isUsed' | 'createdAt'>,
  // Supplied by the caller (a component, since this is a plain module and
  // can't inject CompanyDataService itself) when companyId/divisionCode belongs
  // to a company/division that has no wrapper node here yet - e.g. one created
  // via the Organization/Divisions module after this file was authored. Without
  // this, the write used to silently drop (same bug class already fixed for
  // upsertStaticDivision/upsertStaticSubDivision/upsertStaticScope/upsertStaticRfi).
  companyMeta?: { companyName: string; tag: string; color: string },
  divisionMeta?: { divisionName: string },
): ReportTemplateRecord | undefined {
  let company = REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    if (!companyMeta) return undefined;
    company = { id: companyId, companyName: companyMeta.companyName, tag: companyMeta.tag, color: companyMeta.color, divisions: [] };
    REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES.push(company);
  }

  let division = company.divisions.find(b => b.divisionCode === divisionCode);
  if (!division) {
    if (!divisionMeta) return undefined;
    division = { divisionCode, divisionName: divisionMeta.divisionName, industryType: '', reportTemplates: [] };
    company.divisions.push(division);
  }

  const record: ReportTemplateRecord = {
    ...fields,
    companyId,
    divisionCode,
    divisionName: division.divisionName,
    createdAt: new Date().toISOString(),
    submittedByName: REPORT_TEMPLATE_NEW_SUBMITTER.Name,
    submittedByRole: REPORT_TEMPLATE_NEW_SUBMITTER.Role,
    isUsed: false,
  };
  division.reportTemplates.push(record);
  REPORT_TEMPLATES_FLAT.push(record);
  return record;
}

export const REPORT_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
