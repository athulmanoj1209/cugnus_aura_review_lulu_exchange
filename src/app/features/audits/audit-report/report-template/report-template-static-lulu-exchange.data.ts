// Report Template seed used when CLIENT_MODE_VALUE is 'internal-audit' and
// INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a single organisation
// (Lulu International Exchange) auditing itself. Same ReportTemplateStaticCompany
// shape as the DAR Exchange seed (DAR_EXCHANGE_REPORT_TEMPLATE_COMPANIES in
// report-template-static-ind.data.ts); the 20 templates (ids, names,
// descriptions, file names, submitters, statuses, createdAt) are copied from it
// unchanged, only re-homed onto Lulu's divisions (division-lulu-exchange.data.ts).
//
// DAR -> Lulu division mapping (same rule as the Lulu RFI / library seeds):
//   IT (ABC-BR-14)   -> IT DEPT (LULU-BR-14)
//   RISK (ABC-BR-06) -> RISK DEPT (LULU-BR-06)
//   AML (ABC-BR-05)  -> FRAUD DEPT (LULU-BR-05)
//   OPS (ABC-BR-12)  -> BRANCH OPERATIONS (LULU-BR-12)
//   HR Dept (ABC-BR-04), Finance (ABC-BR-03), CONSUMER PROTECTION (ABC-BR-07)
//     have no Lulu counterpart -> BRANCH OPERATIONS (LULU-BR-12)

import type { ReportTemplateRecord, ReportTemplateStaticCompany } from './models/report-template-static-data.model';

const LULU = 'lulu-international-exchange';

type TemplateSeed = Omit<ReportTemplateRecord, 'companyId' | 'divisionCode' | 'divisionName'>;

/** Stamps the Lulu company/division onto templates copied from the DAR seed. */
const inDivision = (divisionCode: string, divisionName: string) =>
  (templates: TemplateSeed[]): ReportTemplateRecord[] =>
    templates.map(t => ({ ...t, companyId: LULU, divisionCode, divisionName }));

const inItDept = inDivision('LULU-BR-14', 'IT DEPT');
const inRiskDept = inDivision('LULU-BR-06', 'RISK DEPT');
const inFraudDept = inDivision('LULU-BR-05', 'FRAUD DEPT');
const inBranchOps = inDivision('LULU-BR-12', 'BRANCH OPERATIONS');

export const LULU_EXCHANGE_REPORT_TEMPLATE_COMPANIES: ReportTemplateStaticCompany[] = [
  {
    id: LULU,
    companyName: 'Lulu International Exchange',
    tag: 'LULU',
    color: '#0b6e75',
    divisions: [
      {
        divisionCode: 'LULU-BR-14',
        divisionName: 'IT DEPT',
        industryType: 'financial_services',
        reportTemplates: inItDept([
          {
            id: 'RPT-024', templateId: null, createdAt: '2023-01-25T00:00:00.000Z',
            templateName: 'HR & Payroll Compliance Audit Template',
            templateDescription: 'Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.',
            industryType: 'banking', templateFileName: 'HR_Payroll_Compliance_Audit_Template.docx',
            submittedByName: 'Salma Al Dhaheri', submittedByRole: 'Compliance Auditor', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-025', templateId: null, createdAt: '2023-01-26T00:00:00.000Z',
            templateName: 'IT Security Controls Audit Template',
            templateDescription: 'Audit report assessing access controls, network security, and data protection safeguards.',
            industryType: 'banking', templateFileName: 'IT_Security_Controls_Audit_Template.docx',
            submittedByName: 'Rashid Al Mazrouei', submittedByRole: 'IT Auditor', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-005', templateId: null, createdAt: '2023-01-06T00:00:00.000Z',
            templateName: 'Inventory & Stock Audit Template',
            templateDescription: 'Audit report covering stock counts, valuation accuracy, and inventory control effectiveness.',
            industryType: 'retail', templateFileName: 'Inventory_Stock_Audit_Template.docx',
            submittedByName: 'Yousef Al Hammadi', submittedByRole: 'Internal Auditor', status: 'active', isUsed: true,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-06',
        divisionName: 'RISK DEPT',
        industryType: 'financial_services',
        reportTemplates: inRiskDept([
          {
            id: 'RPT-030', templateId: null, createdAt: '2023-01-31T00:00:00.000Z',
            templateName: 'HR & Payroll Compliance Audit Template',
            templateDescription: 'Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.',
            industryType: 'manufacturing', templateFileName: 'HR_Payroll_Compliance_Audit_Template_v2.docx',
            submittedByName: 'Hessa Al Neyadi', submittedByRole: 'Compliance Auditor', status: 'inactive', isUsed: false,
          },
          {
            id: 'RPT-016', templateId: null, createdAt: '2023-01-17T00:00:00.000Z',
            templateName: 'Free Zone Trade Compliance Template',
            templateDescription: 'Audit report reviewing free zone trade licensing, customs compliance, and import-export documentation.',
            industryType: 'trade', templateFileName: 'Free_Zone_Trade_Compliance_Template.docx',
            submittedByName: 'Mariam Al Nuaimi', submittedByRole: 'Trade Compliance Auditor', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-031', templateId: null, createdAt: '2023-02-01T00:00:00.000Z',
            templateName: 'Fixed Assets Verification Template',
            templateDescription: 'Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.',
            industryType: 'trade', templateFileName: 'Fixed_Assets_Verification_Template_v2.docx',
            submittedByName: 'Obaid Al Zaabi', submittedByRole: 'Audit Associate', status: 'active', isUsed: true,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-05',
        divisionName: 'FRAUD DEPT',
        industryType: 'financial_services',
        reportTemplates: inFraudDept([
          {
            id: 'RPT-015', templateId: null, createdAt: '2023-01-16T00:00:00.000Z',
            templateName: 'Environmental Compliance Audit Template',
            templateDescription: 'Compliance report evaluating environmental controls, waste handling, and emissions monitoring practices.',
            industryType: 'manufacturing', templateFileName: 'Environmental_Compliance_Audit_Template.docx',
            submittedByName: 'Khalid Al Ameri', submittedByRole: 'Environmental Auditor', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-028', templateId: null, createdAt: '2023-01-29T00:00:00.000Z',
            templateName: 'Financial Statement Audit Template',
            templateDescription: 'Audit report expressing an opinion on the fairness and accuracy of annual financial statements.',
            industryType: 'manufacturing', templateFileName: 'Financial_Statement_Audit_Template.docx',
            submittedByName: 'Noora Al Kaabi', submittedByRole: 'Senior Auditor', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-029', templateId: null, createdAt: '2023-01-30T00:00:00.000Z',
            templateName: 'Internal Controls Assessment Template',
            templateDescription: 'Assessment report evaluating the design and operating effectiveness of key internal controls.',
            industryType: 'manufacturing', templateFileName: 'Internal_Controls_Assessment_Template.docx',
            submittedByName: 'Marwan Al Ameri', submittedByRole: 'Internal Auditor', status: 'active', isUsed: false,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-12',
        divisionName: 'BRANCH OPERATIONS',
        industryType: 'financial_services',
        reportTemplates: inBranchOps([
          // From DAR OPS (ABC-BR-12)
          {
            id: 'RPT-013', templateId: null, createdAt: '2023-01-14T00:00:00.000Z',
            templateName: 'Retail Sales Reconciliation Template',
            templateDescription: 'Reconciliation report matching point-of-sale records against ledger entries and cash deposits.',
            industryType: 'retail', templateFileName: 'Retail_Sales_Reconciliation_Template.docx',
            submittedByName: 'Mariam Al Suwaidi', submittedByRole: 'Senior Auditor', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-026', templateId: null, createdAt: '2023-01-27T00:00:00.000Z',
            templateName: 'Tax Compliance Review Template',
            templateDescription: 'Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.',
            industryType: 'retail', templateFileName: 'Tax_Compliance_Review_Template.docx',
            submittedByName: 'Aysha Al Marzooqi', submittedByRole: 'Tax Auditor', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-027', templateId: null, createdAt: '2023-01-28T00:00:00.000Z',
            templateName: 'Related Party Transactions Review Template',
            templateDescription: 'Review report examining disclosure and pricing of related party transactions for regulatory alignment.',
            industryType: 'retail', templateFileName: 'Related_Party_Transactions_Review_Template.docx',
            submittedByName: 'Sultan Al Kaabi', submittedByRole: 'Audit Manager', status: 'inactive', isUsed: false,
          },
          // Re-homed from DAR HR Dept (ABC-BR-04)
          {
            id: 'RPT-001', templateId: null, createdAt: '2023-01-02T00:00:00.000Z',
            templateName: 'Internal Audit Summary Template',
            templateDescription: 'Standard summary report covering scope, findings, and recommendations for internal audit engagements.',
            industryType: 'professional_services', templateFileName: 'IA_Summary_Report_Template_v3.docx',
            submittedByName: 'Ahmed Al Farsi', submittedByRole: 'Senior Auditor', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-002', templateId: null, createdAt: '2023-01-03T00:00:00.000Z',
            templateName: 'Quarterly Compliance Template',
            templateDescription: 'Quarterly compliance status report tracking regulatory obligations and remediation progress.',
            industryType: 'professional_services', templateFileName: 'Quarterly_Compliance_Template_v2.docx',
            submittedByName: 'Sara Al Mansoori', submittedByRole: 'Audit Manager', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-022', templateId: null, createdAt: '2023-01-23T00:00:00.000Z',
            templateName: 'Fixed Assets Verification Template',
            templateDescription: 'Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.',
            industryType: 'professional_services', templateFileName: 'Fixed_Assets_Verification_Template.docx',
            submittedByName: 'Layla Al Suwaidi', submittedByRole: 'Audit Associate', status: 'active', isUsed: false,
          },
          // Re-homed from DAR Finance (ABC-BR-03)
          {
            id: 'RPT-023', templateId: null, createdAt: '2023-01-24T00:00:00.000Z',
            templateName: 'Vendor & Procurement Audit Template',
            templateDescription: 'Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.',
            industryType: 'professional_services', templateFileName: 'Vendor_Procurement_Audit_Template.docx',
            submittedByName: 'Hamdan Al Shamsi', submittedByRole: 'Senior Auditor', status: 'active', isUsed: true,
          },
          {
            id: 'RPT-003', templateId: null, createdAt: '2023-01-04T00:00:00.000Z',
            templateName: 'Regulatory Risk Assessment Template',
            templateDescription: 'Assessment report evaluating regulatory risk exposure across banking operations and controls.',
            industryType: 'banking', templateFileName: 'Regulatory_Risk_Assessment_v1.docx',
            submittedByName: 'Omar Khalid', submittedByRole: 'Compliance Officer', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-004', templateId: null, createdAt: '2023-01-05T00:00:00.000Z',
            templateName: 'AML Audit Findings Template',
            templateDescription: 'Findings report documenting anti-money laundering control gaps and corrective actions.',
            industryType: 'banking', templateFileName: 'AML_Audit_Findings_Template.docx',
            submittedByName: 'Fatima Al Zaabi', submittedByRole: 'Risk Analyst', status: 'inactive', isUsed: false,
          },
          // Re-homed from DAR CONSUMER PROTECTION (ABC-BR-07)
          {
            id: 'RPT-032', templateId: null, createdAt: '2023-02-02T00:00:00.000Z',
            templateName: 'Vendor & Procurement Audit Template',
            templateDescription: 'Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.',
            industryType: 'trade', templateFileName: 'Vendor_Procurement_Audit_Template_v2.docx',
            submittedByName: 'Shamma Al Suwaidi', submittedByRole: 'Senior Auditor', status: 'active', isUsed: false,
          },
          {
            id: 'RPT-033', templateId: null, createdAt: '2023-02-03T00:00:00.000Z',
            templateName: 'IT Security Controls Audit Template',
            templateDescription: 'Audit report assessing access controls, network security, and data protection safeguards.',
            industryType: 'trade', templateFileName: 'IT_Security_Controls_Audit_Template_v2.docx',
            submittedByName: 'Rakan Al Nuaimi', submittedByRole: 'IT Auditor', status: 'inactive', isUsed: false,
          },
        ]),
      },
    ],
  },
];
