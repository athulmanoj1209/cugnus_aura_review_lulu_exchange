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

import { CLIENT_MODE_VALUE } from "@/app/core/config/client-mode";
import { StaticCompany } from "@/app/features/audits/organization/divisions/models/division-static-data.model";
import { REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES } from "./report-template-static-ind.data";
import type { ReportTemplateRecord, ReportTemplateStaticCompany, CompanyLookupEntry } from "./models/report-template-static-data.model";
import { REPORT_TEMPLATE_NEW_SUBMITTER } from "./constants/report-template.constants";

export const REPORT_TEMPLATE_STATIC_AUDIT_FIRM_COMPANIES: ReportTemplateStaticCompany[] = [
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
        "reportTemplates": [
          {
            "id": "RPT-001",
            "templateId": null,
            "createdAt": "2023-01-02T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "professional_services",
            "templateFileName": "Fixed_Assets_Verification_Template.docx",
            "submittedByName": "Layla Al Suwaidi",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-023",
            "templateId": null,
            "createdAt": "2023-01-24T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ANJ-BR-01",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "professional_services",
            "templateFileName": "Vendor_Procurement_Audit_Template.docx",
            "submittedByName": "Hamdan Al Shamsi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "banking",
        "reportTemplates": [
          {
            "id": "RPT-003",
            "templateId": null,
            "createdAt": "2023-01-04T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
            "templateName": "AML Audit Findings Template",
            "templateDescription": "Findings report documenting anti-money laundering control gaps and corrective actions.",
            "industryType": "banking",
            "templateFileName": "AML_Audit_Findings_Template.docx",
            "submittedByName": "Fatima Al Zaabi",
            "submittedByRole": "Risk Analyst",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-024",
            "templateId": null,
            "createdAt": "2023-01-25T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Abu Dhabi Representative Office",
            "divisionCode": "ANJ-BR-02",
            "templateName": "IT Security Controls Audit Template",
            "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
            "industryType": "banking",
            "templateFileName": "IT_Security_Controls_Audit_Template.docx",
            "submittedByName": "Rashid Al Mazrouei",
            "submittedByRole": "IT Auditor",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "retail",
        "reportTemplates": [
          {
            "id": "RPT-005",
            "templateId": null,
            "createdAt": "2023-01-06T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
            "templateName": "Inventory & Stock Audit Template",
            "templateDescription": "Audit report covering stock counts, valuation accuracy, and inventory control effectiveness.",
            "industryType": "retail",
            "templateFileName": "Inventory_Stock_Audit_Template.docx",
            "submittedByName": "Yousef Al Hammadi",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-013",
            "templateId": null,
            "createdAt": "2023-01-14T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Sharjah Warehouse",
            "divisionCode": "ANJ-BR-03",
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
        "divisionCode": "ANJ-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "manufacturing",
        "reportTemplates": [
          {
            "id": "RPT-015",
            "templateId": null,
            "createdAt": "2023-01-16T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Fujairah Factory",
            "divisionCode": "ANJ-BR-04",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Fujairah Factory",
            "divisionCode": "ANJ-BR-04",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Fujairah Factory",
            "divisionCode": "ANJ-BR-04",
            "templateName": "Internal Controls Assessment Template",
            "templateDescription": "Assessment report evaluating the design and operating effectiveness of key internal controls.",
            "industryType": "manufacturing",
            "templateFileName": "Internal_Controls_Assessment_Template.docx",
            "submittedByName": "Marwan Al Ameri",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-030",
            "templateId": null,
            "createdAt": "2023-01-31T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Fujairah Factory",
            "divisionCode": "ANJ-BR-04",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "manufacturing",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template_v2.docx",
            "submittedByName": "Hessa Al Neyadi",
            "submittedByRole": "Compliance Auditor",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ANJ-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "technology",
        "reportTemplates": [
          {
            "id": "RPT-016",
            "templateId": null,
            "createdAt": "2023-01-17T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Ras Al Khaimah Project Office",
            "divisionCode": "ANJ-BR-05",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Ras Al Khaimah Project Office",
            "divisionCode": "ANJ-BR-05",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "trade",
            "templateFileName": "Fixed_Assets_Verification_Template_v2.docx",
            "submittedByName": "Obaid Al Zaabi",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-032",
            "templateId": null,
            "createdAt": "2023-02-02T00:00:00.000Z",
            "companyId": "al-noor-jewellery",
            "divisionName": "Ras Al Khaimah Project Office",
            "divisionCode": "ANJ-BR-05",
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
            "companyId": "al-noor-jewellery",
            "divisionName": "Ras Al Khaimah Project Office",
            "divisionCode": "ANJ-BR-05",
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
      },
      {
        "divisionCode": "ANJ-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "ANJ-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "ANJ-BR-08",
        "divisionName": "Khorfakkan Representative Office",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "ANJ-BR-09",
        "divisionName": "Riyadh Warehouse",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "ANJ-BR-10",
        "divisionName": "Manama Factory",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "ANJ-BR-11",
        "divisionName": "Hawalli Project Office",
        "industryType": "retail",
        "reportTemplates": []
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
        "reportTemplates": [
          {
            "id": "RPT-006",
            "templateId": null,
            "createdAt": "2023-01-07T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "templateName": "Project Cost Audit Template",
            "templateDescription": "Report assessing project cost control, budget variance, and contractor billing accuracy.",
            "industryType": "construction",
            "templateFileName": "Project_Cost_Audit_Template_v2.docx",
            "submittedByName": "Faisal Al Otaibi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-007",
            "templateId": null,
            "createdAt": "2023-01-08T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "templateName": "Site Safety Compliance Template",
            "templateDescription": "Compliance report reviewing site safety practices against occupational health standards.",
            "industryType": "construction",
            "templateFileName": "Site_Safety_Compliance_Template.docx",
            "submittedByName": "Nasser Al Qahtani",
            "submittedByRole": "Site Safety Officer",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-034",
            "templateId": null,
            "createdAt": "2023-02-04T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "templateName": "Financial Statement Audit Template",
            "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
            "industryType": "construction",
            "templateFileName": "Financial_Statement_Audit_Template_KSA.docx",
            "submittedByName": "Bandar Al Otaibi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-035",
            "templateId": null,
            "createdAt": "2023-02-05T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Dubai Head Office",
            "divisionCode": "ZUM-BR-01",
            "templateName": "Related Party Transactions Review Template",
            "templateDescription": "Review report examining disclosure and pricing of related party transactions for regulatory alignment.",
            "industryType": "construction",
            "templateFileName": "Related_Party_Transactions_Review_Template_KSA.docx",
            "submittedByName": "Lujain Al Harbi",
            "submittedByRole": "Audit Manager",
            "status": "active",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-02",
        "divisionName": "Abu Dhabi Division",
        "industryType": "technology",
        "reportTemplates": [
          {
            "id": "RPT-008",
            "templateId": null,
            "createdAt": "2023-01-09T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Abu Dhabi Division",
            "divisionCode": "ZUM-BR-02",
            "templateName": "Patient Data Governance Audit Template",
            "templateDescription": "Audit report examining patient data handling, access controls, and privacy governance.",
            "industryType": "healthcare",
            "templateFileName": "Patient_Data_Governance_Template.docx",
            "submittedByName": "Huda Al Ghamdi",
            "submittedByRole": "Compliance Officer",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-014",
            "templateId": null,
            "createdAt": "2023-01-15T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Abu Dhabi Division",
            "divisionCode": "ZUM-BR-02",
            "templateName": "Manufacturing Process Audit Template",
            "templateDescription": "Audit report covering production quality control, waste management, and process efficiency.",
            "industryType": "manufacturing",
            "templateFileName": "Manufacturing_Process_Audit_Template.docx",
            "submittedByName": "Reem Al Qahtani",
            "submittedByRole": "Quality Assurance Lead",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-036",
            "templateId": null,
            "createdAt": "2023-02-06T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Abu Dhabi Division",
            "divisionCode": "ZUM-BR-02",
            "templateName": "Tax Compliance Review Template",
            "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
            "industryType": "healthcare",
            "templateFileName": "Tax_Compliance_Review_Template_KSA.docx",
            "submittedByName": "Rana Al Ghamdi",
            "submittedByRole": "Tax Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-037",
            "templateId": null,
            "createdAt": "2023-02-07T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Abu Dhabi Division",
            "divisionCode": "ZUM-BR-02",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "healthcare",
            "templateFileName": "Vendor_Procurement_Audit_Template_KSA.docx",
            "submittedByName": "Fahad Al Zahrani",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-03",
        "divisionName": "Sharjah Representative Office",
        "industryType": "healthcare",
        "reportTemplates": [
          {
            "id": "RPT-017",
            "templateId": null,
            "createdAt": "2023-01-18T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Sharjah Representative Office",
            "divisionCode": "ZUM-BR-03",
            "templateName": "Oil & Gas Operations Audit Template",
            "templateDescription": "Audit report examining operational controls, safety compliance, and asset integrity in oil and gas operations.",
            "industryType": "energy",
            "templateFileName": "Oil_Gas_Operations_Audit_Template.docx",
            "submittedByName": "Turki Al Dosari",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-038",
            "templateId": null,
            "createdAt": "2023-02-08T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Sharjah Representative Office",
            "divisionCode": "ZUM-BR-03",
            "templateName": "Internal Controls Assessment Template",
            "templateDescription": "Assessment report evaluating the design and operating effectiveness of key internal controls.",
            "industryType": "energy",
            "templateFileName": "Internal_Controls_Assessment_Template_KSA.docx",
            "submittedByName": "Majid Al Qahtani",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-039",
            "templateId": null,
            "createdAt": "2023-02-09T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Sharjah Representative Office",
            "divisionCode": "ZUM-BR-03",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "energy",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template_KSA.docx",
            "submittedByName": "Dana Al Shehri",
            "submittedByRole": "Compliance Auditor",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-040",
            "templateId": null,
            "createdAt": "2023-02-10T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Sharjah Representative Office",
            "divisionCode": "ZUM-BR-03",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "energy",
            "templateFileName": "Fixed_Assets_Verification_Template_KSA.docx",
            "submittedByName": "Saud Al Dosari",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-04",
        "divisionName": "Fujairah Warehouse",
        "industryType": "construction",
        "reportTemplates": [
          {
            "id": "RPT-018",
            "templateId": null,
            "createdAt": "2023-01-19T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Fujairah Warehouse",
            "divisionCode": "ZUM-BR-04",
            "templateName": "Hospitality Revenue Assurance Template",
            "templateDescription": "Report reviewing revenue recognition, occupancy billing accuracy, and guest services controls for hospitality operations.",
            "industryType": "hospitality",
            "templateFileName": "Hospitality_Revenue_Assurance_Template.docx",
            "submittedByName": "Amal Al Harbi",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-041",
            "templateId": null,
            "createdAt": "2023-02-11T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Fujairah Warehouse",
            "divisionCode": "ZUM-BR-04",
            "templateName": "Financial Statement Audit Template",
            "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
            "industryType": "hospitality",
            "templateFileName": "Financial_Statement_Audit_Template_Mecca.docx",
            "submittedByName": "Haifa Al Amri",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-042",
            "templateId": null,
            "createdAt": "2023-02-12T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Fujairah Warehouse",
            "divisionCode": "ZUM-BR-04",
            "templateName": "IT Security Controls Audit Template",
            "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
            "industryType": "hospitality",
            "templateFileName": "IT_Security_Controls_Audit_Template_Mecca.docx",
            "submittedByName": "Naif Al Malki",
            "submittedByRole": "IT Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-043",
            "templateId": null,
            "createdAt": "2023-02-13T00:00:00.000Z",
            "companyId": "zumurrud-diamonds",
            "divisionName": "Fujairah Warehouse",
            "divisionCode": "ZUM-BR-04",
            "templateName": "Related Party Transactions Review Template",
            "templateDescription": "Review report examining disclosure and pricing of related party transactions for regulatory alignment.",
            "industryType": "hospitality",
            "templateFileName": "Related_Party_Transactions_Review_Template_Mecca.docx",
            "submittedByName": "Wafa Al Ghamdi",
            "submittedByRole": "Audit Manager",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "ZUM-BR-05",
        "divisionName": "Ras Al Khaimah Factory",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "ZUM-BR-06",
        "divisionName": "Ajman Project Office",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "ZUM-BR-07",
        "divisionName": "Umm Al Quwain Subsidiary",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "ZUM-BR-08",
        "divisionName": "Jeddah Division",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "ZUM-BR-09",
        "divisionName": "Riffa Representative Office",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "ZUM-BR-10",
        "divisionName": "Jahra Warehouse",
        "industryType": "technology",
        "reportTemplates": []
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
        "reportTemplates": [
          {
            "id": "RPT-009",
            "templateId": null,
            "createdAt": "2023-01-10T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "templateName": "Basel III Capital Adequacy Template",
            "templateDescription": "Report evaluating capital adequacy ratios and Basel III regulatory alignment.",
            "industryType": "banking",
            "templateFileName": "Basel_III_Capital_Adequacy_Template.docx",
            "submittedByName": "Khalid Al Khalifa",
            "submittedByRole": "Audit Manager",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-010",
            "templateId": null,
            "createdAt": "2023-01-11T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "templateName": "Liquidity Risk Template",
            "templateDescription": "Report analyzing liquidity coverage, funding stability, and cash flow stress scenarios.",
            "industryType": "banking",
            "templateFileName": "Liquidity_Risk_Report_Template.docx",
            "submittedByName": "Layla Al Dosari",
            "submittedByRole": "Risk Analyst",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-044",
            "templateId": null,
            "createdAt": "2023-02-14T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "templateName": "Tax Compliance Review Template",
            "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
            "industryType": "banking",
            "templateFileName": "Tax_Compliance_Review_Template_BHR.docx",
            "submittedByName": "Ali Al Khalifa",
            "submittedByRole": "Tax Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-045",
            "templateId": null,
            "createdAt": "2023-02-15T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Dubai Head Office",
            "divisionCode": "FGJ-BR-01",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "banking",
            "templateFileName": "Vendor_Procurement_Audit_Template_BHR.docx",
            "submittedByName": "Mona Al Mannai",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "FGJ-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "industryType": "construction",
        "reportTemplates": [
          {
            "id": "RPT-019",
            "templateId": null,
            "createdAt": "2023-01-20T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "FGJ-BR-02",
            "templateName": "Insurance Claims Audit Template",
            "templateDescription": "Audit report assessing claims processing accuracy, reserve adequacy, and fraud control effectiveness.",
            "industryType": "insurance",
            "templateFileName": "Insurance_Claims_Audit_Template.docx",
            "submittedByName": "Yusuf Al Sayed",
            "submittedByRole": "Audit Manager",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-046",
            "templateId": null,
            "createdAt": "2023-02-16T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "FGJ-BR-02",
            "templateName": "Internal Controls Assessment Template",
            "templateDescription": "Assessment report evaluating the design and operating effectiveness of key internal controls.",
            "industryType": "insurance",
            "templateFileName": "Internal_Controls_Assessment_Template_BHR.docx",
            "submittedByName": "Huda Al Zayani",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-047",
            "templateId": null,
            "createdAt": "2023-02-17T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "FGJ-BR-02",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "insurance",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template_BHR.docx",
            "submittedByName": "Isa Al Ansari",
            "submittedByRole": "Compliance Auditor",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-048",
            "templateId": null,
            "createdAt": "2023-02-18T00:00:00.000Z",
            "companyId": "falcon-gulf-jewellery",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "FGJ-BR-02",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "insurance",
            "templateFileName": "Fixed_Assets_Verification_Template_BHR.docx",
            "submittedByName": "Zainab Al Dosari",
            "submittedByRole": "Audit Associate",
            "status": "active",
            "isUsed": true
          }
        ]
      },
      {
        "divisionCode": "FGJ-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-04",
        "divisionName": "Fujairah Division",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-05",
        "divisionName": "Ras Al Khaimah Representative Office",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-06",
        "divisionName": "Ajman Warehouse",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-07",
        "divisionName": "Umm Al Quwain Factory",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-08",
        "divisionName": "Khorfakkan Project Office",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-09",
        "divisionName": "Dubai Subsidiary",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-10",
        "divisionName": "Dammam Division",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-11",
        "divisionName": "Muharraq Representative Office",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "FGJ-BR-12",
        "divisionName": "Ahmadi Warehouse",
        "industryType": "professional_services",
        "reportTemplates": []
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
        "reportTemplates": [
          {
            "id": "RPT-011",
            "templateId": null,
            "createdAt": "2023-01-12T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "templateName": "IT General Controls Audit Template",
            "templateDescription": "Audit report reviewing access management, change control, and IT operations governance.",
            "industryType": "technology",
            "templateFileName": "ITGC_Audit_Report_Template_v2.docx",
            "submittedByName": "Abdullah Al Sabah",
            "submittedByRole": "IT Audit Lead",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-012",
            "templateId": null,
            "createdAt": "2023-01-13T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "templateName": "Cybersecurity Risk Assessment Template",
            "templateDescription": "Assessment report identifying cybersecurity vulnerabilities and mitigation priorities.",
            "industryType": "technology",
            "templateFileName": "Cybersecurity_Risk_Assessment_Template.docx",
            "submittedByName": "Noura Al Mutairi",
            "submittedByRole": "Security Analyst",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-049",
            "templateId": null,
            "createdAt": "2023-02-19T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "templateName": "Financial Statement Audit Template",
            "templateDescription": "Audit report expressing an opinion on the fairness and accuracy of annual financial statements.",
            "industryType": "technology",
            "templateFileName": "Financial_Statement_Audit_Template_KWT.docx",
            "submittedByName": "Meshal Al Enezi",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-050",
            "templateId": null,
            "createdAt": "2023-02-20T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Dubai Head Office",
            "divisionCode": "MGG-BR-01",
            "templateName": "Related Party Transactions Review Template",
            "templateDescription": "Review report examining disclosure and pricing of related party transactions for regulatory alignment.",
            "industryType": "technology",
            "templateFileName": "Related_Party_Transactions_Review_Template_KWT.docx",
            "submittedByName": "Shaikha Al Sabah",
            "submittedByRole": "Audit Manager",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-02",
        "divisionName": "Abu Dhabi Project Office",
        "industryType": "retail",
        "reportTemplates": [
          {
            "id": "RPT-020",
            "templateId": null,
            "createdAt": "2023-01-21T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "MGG-BR-02",
            "templateName": "Retail Chain Inventory Audit Template",
            "templateDescription": "Audit report covering multi-outlet inventory reconciliation, shrinkage analysis, and stock control procedures.",
            "industryType": "retail",
            "templateFileName": "Retail_Chain_Inventory_Audit_Template.docx",
            "submittedByName": "Fajer Al Rashidi",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-051",
            "templateId": null,
            "createdAt": "2023-02-21T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "MGG-BR-02",
            "templateName": "Tax Compliance Review Template",
            "templateDescription": "Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.",
            "industryType": "retail",
            "templateFileName": "Tax_Compliance_Review_Template_KWT.docx",
            "submittedByName": "Bader Al Mutairi",
            "submittedByRole": "Tax Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-052",
            "templateId": null,
            "createdAt": "2023-02-22T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "MGG-BR-02",
            "templateName": "IT Security Controls Audit Template",
            "templateDescription": "Audit report assessing access controls, network security, and data protection safeguards.",
            "industryType": "retail",
            "templateFileName": "IT_Security_Controls_Audit_Template_KWT.docx",
            "submittedByName": "Farah Al Ajmi",
            "submittedByRole": "IT Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-053",
            "templateId": null,
            "createdAt": "2023-02-23T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Abu Dhabi Project Office",
            "divisionCode": "MGG-BR-02",
            "templateName": "Internal Controls Assessment Template",
            "templateDescription": "Assessment report evaluating the design and operating effectiveness of key internal controls.",
            "industryType": "retail",
            "templateFileName": "Internal_Controls_Assessment_Template_KWT.docx",
            "submittedByName": "Yousef Al Rashidi",
            "submittedByRole": "Internal Auditor",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-03",
        "divisionName": "Sharjah Subsidiary",
        "industryType": "manufacturing",
        "reportTemplates": [
          {
            "id": "RPT-021",
            "templateId": null,
            "createdAt": "2023-01-22T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Sharjah Subsidiary",
            "divisionCode": "MGG-BR-03",
            "templateName": "Petrochemical Safety Compliance Template",
            "templateDescription": "Compliance report reviewing occupational safety standards and hazardous materials handling in petrochemical facilities.",
            "industryType": "energy",
            "templateFileName": "Petrochemical_Safety_Compliance_Template.docx",
            "submittedByName": "Salem Al Ajmi",
            "submittedByRole": "Site Safety Officer",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-054",
            "templateId": null,
            "createdAt": "2023-02-24T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Sharjah Subsidiary",
            "divisionCode": "MGG-BR-03",
            "templateName": "Vendor & Procurement Audit Template",
            "templateDescription": "Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.",
            "industryType": "energy",
            "templateFileName": "Vendor_Procurement_Audit_Template_KWT.docx",
            "submittedByName": "Ghanim Al Sabah",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-055",
            "templateId": null,
            "createdAt": "2023-02-25T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Sharjah Subsidiary",
            "divisionCode": "MGG-BR-03",
            "templateName": "HR & Payroll Compliance Audit Template",
            "templateDescription": "Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.",
            "industryType": "energy",
            "templateFileName": "HR_Payroll_Compliance_Audit_Template_Ahmadi.docx",
            "submittedByName": "Reem Al Enezi",
            "submittedByRole": "Compliance Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-056",
            "templateId": null,
            "createdAt": "2023-02-26T00:00:00.000Z",
            "companyId": "marwa-gold-gems",
            "divisionName": "Sharjah Subsidiary",
            "divisionCode": "MGG-BR-03",
            "templateName": "Fixed Assets Verification Template",
            "templateDescription": "Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.",
            "industryType": "energy",
            "templateFileName": "Fixed_Assets_Verification_Template_Ahmadi.docx",
            "submittedByName": "Talal Al Ajmi",
            "submittedByRole": "Audit Associate",
            "status": "inactive",
            "isUsed": false
          }
        ]
      },
      {
        "divisionCode": "MGG-BR-04",
        "divisionName": "Fujairah Division",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-05",
        "divisionName": "Ras Al Khaimah Representative Office",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-06",
        "divisionName": "Ajman Warehouse",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-07",
        "divisionName": "Umm Al Quwain Factory",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-08",
        "divisionName": "Tabuk Project Office",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-09",
        "divisionName": "Isa Town Subsidiary",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "MGG-BR-10",
        "divisionName": "Farwaniya Division",
        "industryType": "retail",
        "reportTemplates": []
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
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-02",
        "divisionName": "Abu Dhabi Warehouse",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-03",
        "divisionName": "Sharjah Factory",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-04",
        "divisionName": "Fujairah Project Office",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-05",
        "divisionName": "Ras Al Khaimah Subsidiary",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-06",
        "divisionName": "Ajman Division",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-07",
        "divisionName": "Umm Al Quwain Representative Office",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-08",
        "divisionName": "Khorfakkan Warehouse",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-09",
        "divisionName": "Madinah Factory",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-10",
        "divisionName": "Hamad Town Project Office",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "KAE-BR-11",
        "divisionName": "Mubarak Al-Kabeer Subsidiary",
        "industryType": "healthcare",
        "reportTemplates": []
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
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-08",
        "divisionName": "Khorfakkan Representative Office",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-09",
        "divisionName": "Dubai Warehouse",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-10",
        "divisionName": "Riyadh Factory",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-11",
        "divisionName": "Manama Project Office",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "DRR-BR-12",
        "divisionName": "Hawalli Subsidiary",
        "industryType": "banking",
        "reportTemplates": []
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
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-02",
        "divisionName": "Abu Dhabi Representative Office",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-03",
        "divisionName": "Sharjah Warehouse",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-04",
        "divisionName": "Fujairah Factory",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-05",
        "divisionName": "Ras Al Khaimah Project Office",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-06",
        "divisionName": "Ajman Subsidiary",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-07",
        "divisionName": "Umm Al Quwain Division",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-08",
        "divisionName": "Jeddah Representative Office",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-09",
        "divisionName": "Riffa Warehouse",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "GHL-BR-10",
        "divisionName": "Jahra Factory",
        "industryType": "manufacturing",
        "reportTemplates": []
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
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-02",
        "divisionName": "Abu Dhabi Subsidiary",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-03",
        "divisionName": "Sharjah Division",
        "industryType": "construction",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-04",
        "divisionName": "Fujairah Representative Office",
        "industryType": "real_estate",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-05",
        "divisionName": "Ras Al Khaimah Warehouse",
        "industryType": "professional_services",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-06",
        "divisionName": "Ajman Factory",
        "industryType": "banking",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-07",
        "divisionName": "Umm Al Quwain Project Office",
        "industryType": "retail",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-08",
        "divisionName": "Khorfakkan Subsidiary",
        "industryType": "manufacturing",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-09",
        "divisionName": "Dammam Division",
        "industryType": "technology",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-10",
        "divisionName": "Muharraq Representative Office",
        "industryType": "healthcare",
        "reportTemplates": []
      },
      {
        "divisionCode": "AWC-BR-11",
        "divisionName": "Ahmadi Warehouse",
        "industryType": "construction",
        "reportTemplates": []
      }
    ]
  }
];

export const REPORT_TEMPLATE_STATIC_COMPANIES: ReportTemplateStaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? REPORT_TEMPLATE_STATIC_INDI_ORG_COMPANIES
    : REPORT_TEMPLATE_STATIC_AUDIT_FIRM_COMPANIES;




/** Flattened view over the tree above — what list/report-template-list.component.ts actually renders/filters. */
export const REPORT_TEMPLATES_FLAT: ReportTemplateRecord[] = REPORT_TEMPLATE_STATIC_COMPANIES.flatMap(c =>
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
  let company = REPORT_TEMPLATE_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    if (!companyMeta) return undefined;
    company = { id: companyId, companyName: companyMeta.companyName, tag: companyMeta.tag, color: companyMeta.color, divisions: [] };
    REPORT_TEMPLATE_STATIC_COMPANIES.push(company);
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

export const REPORT_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORT_TEMPLATE_STATIC_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
