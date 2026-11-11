// Final Report (Reports Lists) seed used when CLIENT_MODE_VALUE is
// 'internal-audit' and INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a
// single organisation (Lulu International Exchange) auditing itself. Same
// ReportsListStaticCompany shape as the DAR Exchange seed
// (DAR_EXCHANGE_REPORTS_LIST_COMPANIES in report-lists-static-indi-org-data.ts);
// the 20 audit reports (titles, types, statuses, dates, auditors, publishers,
// reviewers, linked template) are copied from it unchanged, only re-homed onto
// Lulu's divisions. Division codes/names match division-lulu-exchange.data.ts and
// report-template-static-lulu-exchange.data.ts, so a report's division cascades
// to the same Lulu template options.
//
// DAR -> Lulu division mapping (same rule as the Lulu report-template seed):
//   IT (ABC-BR-14)   -> IT DEPT (LULU-BR-14)
//   RISK (ABC-BR-06) -> RISK DEPT (LULU-BR-06)
//   AML (ABC-BR-05)  -> FRAUD DEPT (LULU-BR-05)
//   OPS (ABC-BR-12)  -> BRANCH OPERATIONS (LULU-BR-12)
//   HR Dept (ABC-BR-04), Finance (ABC-BR-03), CONSUMER PROTECTION (ABC-BR-07)
//     have no Lulu counterpart -> BRANCH OPERATIONS (LULU-BR-12)

import type { AuditReportRecord, ReportsListStaticCompany } from './models/final-report-static-data.model';

const LULU = 'lulu-international-exchange';

type ReportSeed = Omit<AuditReportRecord, 'companyId' | 'divisionCode' | 'divisionName'>;

/** Stamps the Lulu company/division onto reports copied from the DAR seed. */
const inDivision = (divisionCode: string, divisionName: string) =>
  (reports: ReportSeed[]): AuditReportRecord[] =>
    reports.map(r => ({ ...r, companyId: LULU, divisionCode, divisionName }));

const inItDept = inDivision('LULU-BR-14', 'IT DEPT');
const inRiskDept = inDivision('LULU-BR-06', 'RISK DEPT');
const inFraudDept = inDivision('LULU-BR-05', 'FRAUD DEPT');
const inBranchOps = inDivision('LULU-BR-12', 'BRANCH OPERATIONS');

/* Template snapshots referenced by the reports (same values as the DAR seed). */
const TPL_IA_SUMMARY = {
  templateId: null, templateName: 'Internal Audit Summary Template',
  templateDescription: 'Standard summary report covering scope, findings, and recommendations for internal audit engagements.',
  industryType: 'professional_services', templateFileName: 'IA_Summary_Report_Template_v3.docx',
  submittedByName: 'Ahmed Al Farsi', submittedByRole: 'Senior Auditor', status: 'active',
} as const;
const TPL_HR_PAYROLL = {
  templateId: null, templateName: 'HR & Payroll Compliance Audit Template',
  templateDescription: 'Audit report examining payroll processing accuracy, leave entitlements, and labor law compliance.',
  industryType: 'banking', templateFileName: 'HR_Payroll_Compliance_Audit_Template.docx',
  submittedByName: 'Salma Al Dhaheri', submittedByRole: 'Compliance Auditor', status: 'active',
} as const;
const TPL_VENDOR = {
  templateId: null, templateName: 'Vendor & Procurement Audit Template',
  templateDescription: 'Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.',
  industryType: 'professional_services', templateFileName: 'Vendor_Procurement_Audit_Template.docx',
  submittedByName: 'Hamdan Al Shamsi', submittedByRole: 'Senior Auditor', status: 'active',
} as const;
const TPL_VENDOR_V2 = {
  templateId: null, templateName: 'Vendor & Procurement Audit Template',
  templateDescription: 'Audit report reviewing vendor selection controls, procurement approvals, and contract compliance.',
  industryType: 'trade', templateFileName: 'Vendor_Procurement_Audit_Template_v2.docx',
  submittedByName: 'Shamma Al Suwaidi', submittedByRole: 'Senior Auditor', status: 'active',
} as const;
const TPL_REG_RISK = {
  templateId: null, templateName: 'Regulatory Risk Assessment Template',
  templateDescription: 'Assessment report evaluating regulatory risk exposure across banking operations and controls.',
  industryType: 'banking', templateFileName: 'Regulatory_Risk_Assessment_v1.docx',
  submittedByName: 'Omar Khalid', submittedByRole: 'Compliance Officer', status: 'active',
} as const;
const TPL_FIN_STATEMENT = {
  templateId: null, templateName: 'Financial Statement Audit Template',
  templateDescription: 'Audit report expressing an opinion on the fairness and accuracy of annual financial statements.',
  industryType: 'manufacturing', templateFileName: 'Financial_Statement_Audit_Template.docx',
  submittedByName: 'Noora Al Kaabi', submittedByRole: 'Senior Auditor', status: 'active',
} as const;
const TPL_IT_SECURITY = {
  templateId: null, templateName: 'IT Security Controls Audit Template',
  templateDescription: 'Audit report assessing access controls, network security, and data protection safeguards.',
  industryType: 'banking', templateFileName: 'IT_Security_Controls_Audit_Template.docx',
  submittedByName: 'Rashid Al Mazrouei', submittedByRole: 'IT Auditor', status: 'active',
} as const;
const TPL_RETAIL_SALES = {
  templateId: null, templateName: 'Retail Sales Reconciliation Template',
  templateDescription: 'Reconciliation report matching point-of-sale records against ledger entries and cash deposits.',
  industryType: 'retail', templateFileName: 'Retail_Sales_Reconciliation_Template.docx',
  submittedByName: 'Mariam Al Suwaidi', submittedByRole: 'Senior Auditor', status: 'active',
} as const;
const TPL_TAX = {
  templateId: null, templateName: 'Tax Compliance Review Template',
  templateDescription: 'Review report assessing VAT filing accuracy, tax registration status, and regulatory compliance.',
  industryType: 'retail', templateFileName: 'Tax_Compliance_Review_Template.docx',
  submittedByName: 'Aysha Al Marzooqi', submittedByRole: 'Tax Auditor', status: 'active',
} as const;
const TPL_ENVIRONMENTAL = {
  templateId: null, templateName: 'Environmental Compliance Audit Template',
  templateDescription: 'Compliance report evaluating environmental controls, waste handling, and emissions monitoring practices.',
  industryType: 'manufacturing', templateFileName: 'Environmental_Compliance_Audit_Template.docx',
  submittedByName: 'Khalid Al Ameri', submittedByRole: 'Environmental Auditor', status: 'active',
} as const;
const TPL_FREE_ZONE = {
  templateId: null, templateName: 'Free Zone Trade Compliance Template',
  templateDescription: 'Audit report reviewing free zone trade licensing, customs compliance, and import-export documentation.',
  industryType: 'trade', templateFileName: 'Free_Zone_Trade_Compliance_Template.docx',
  submittedByName: 'Mariam Al Nuaimi', submittedByRole: 'Trade Compliance Auditor', status: 'active',
} as const;
const TPL_FIXED_ASSETS_V2 = {
  templateId: null, templateName: 'Fixed Assets Verification Template',
  templateDescription: 'Audit report verifying physical existence, valuation, and depreciation accuracy of fixed assets.',
  industryType: 'trade', templateFileName: 'Fixed_Assets_Verification_Template_v2.docx',
  submittedByName: 'Obaid Al Zaabi', submittedByRole: 'Audit Associate', status: 'active',
} as const;

export const LULU_EXCHANGE_REPORTS_LIST_COMPANIES: ReportsListStaticCompany[] = [
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
        auditReports: inItDept([
          {
            createdAt: '2023-01-05T00:00:00.000Z', reportTitle: 'Inventory & Stock Audit',
            auditType: 'internal', status: 'approved', createdDate: '2025-02-10', updatedDate: '2025-03-05',
            leadAuditor: 'Emma Clarke', reportPeriod: 'monthly',
            publishedByName: 'Noor Al Shamsi', publishedByRole: 'Audit Associate',
            reviewerName: 'Helen Park', reviewerRole: 'Senior Reviewer',
            template: TPL_HR_PAYROLL,
          },
          {
            createdAt: '2023-01-06T00:00:00.000Z', reportTitle: 'Retail Sales Reconciliation',
            auditType: 'financial', status: 'in_review', createdDate: '2025-05-01', updatedDate: '2025-05-14',
            leadAuditor: 'Felix Rahman', reportPeriod: 'monthly',
            publishedByName: 'Khalifa Al Falasi', publishedByRole: 'Audit Associate',
            reviewerName: 'Lisa Kim', reviewerRole: 'Senior Reviewer',
            template: TPL_IT_SECURITY,
          },
          {
            createdAt: '2023-01-16T00:00:00.000Z', reportTitle: 'IT Security Posture Assessment 2026',
            auditType: 'external', status: 'in_review', createdDate: '2026-03-05', updatedDate: '2026-03-22',
            leadAuditor: 'Marcus Webb', reportPeriod: 'half_yearly',
            publishedByName: 'Reem Al Falasi', publishedByRole: 'IT Audit Associate',
            reviewerName: 'Sven Lindqvist', reviewerRole: 'Senior Reviewer',
            template: TPL_IT_SECURITY,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-06',
        divisionName: 'RISK DEPT',
        industryType: 'financial_services',
        auditReports: inRiskDept([
          {
            createdAt: '2023-01-11T00:00:00.000Z', reportTitle: 'Liquidity Risk Report',
            auditType: 'financial', status: 'reopened', createdDate: '2024-12-01', updatedDate: '2025-01-15',
            leadAuditor: 'Karen Osei', reportPeriod: 'quarterly',
            publishedByName: 'Noor Al Ansari', publishedByRole: 'Risk Associate',
            reviewerName: 'Rachel Wu', reviewerRole: 'Senior QA Reviewer',
            template: TPL_FREE_ZONE,
          },
          {
            createdAt: '2023-01-12T00:00:00.000Z', reportTitle: 'IT General Controls Audit',
            auditType: 'internal', status: 'in_review', createdDate: '2025-02-14', updatedDate: '2025-03-01',
            leadAuditor: 'Liam Chen', reportPeriod: 'monthly',
            publishedByName: 'Dana Al Rashidi', publishedByRole: 'IT Audit Associate',
            reviewerName: 'Nina Costa', reviewerRole: 'QA Specialist',
            template: TPL_FIXED_ASSETS_V2,
          },
          {
            createdAt: '2023-01-19T00:00:00.000Z', reportTitle: 'Enterprise Risk Management Review 2026',
            auditType: 'internal', status: 'approved', createdDate: '2026-05-12', updatedDate: '2026-06-01',
            leadAuditor: 'Petra Nowak', reportPeriod: 'yearly',
            publishedByName: 'Khalid Al Suwaidi', publishedByRole: 'Risk Associate',
            reviewerName: 'Amina Toure', reviewerRole: 'Senior QA Reviewer',
            template: TPL_FIXED_ASSETS_V2,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-05',
        divisionName: 'FRAUD DEPT',
        industryType: 'financial_services',
        auditReports: inFraudDept([
          {
            createdAt: '2023-01-09T00:00:00.000Z', reportTitle: 'Patient Data Governance Audit',
            auditType: 'internal', status: 'in_review', createdDate: '2025-03-18', updatedDate: '2025-04-02',
            leadAuditor: 'Irene Torres', reportPeriod: 'half_yearly',
            publishedByName: 'Lama Al Zahrani', publishedByRole: 'Compliance Associate',
            reviewerName: 'Julia Ahmed', reviewerRole: 'Quality Reviewer',
            template: TPL_ENVIRONMENTAL,
          },
          {
            createdAt: '2023-01-10T00:00:00.000Z', reportTitle: 'Basel III Capital Adequacy Report',
            auditType: 'financial', status: 'approved', createdDate: '2025-01-08', updatedDate: '2025-02-01',
            leadAuditor: 'James Malik', reportPeriod: 'yearly',
            publishedByName: 'Fahad Al Mannai', publishedByRole: 'Audit Coordinator',
            reviewerName: 'Michael Rao', reviewerRole: 'Compliance Manager',
            template: TPL_FIN_STATEMENT,
          },
          {
            createdAt: '2023-01-18T00:00:00.000Z', reportTitle: 'Sanctions Screening Effectiveness Review 2026',
            auditType: 'financial', status: 'in_review', createdDate: '2026-02-20', updatedDate: '2026-03-10',
            leadAuditor: 'Noura Al Hosani', reportPeriod: 'half_yearly',
            publishedByName: 'Bilal Rahman', publishedByRole: 'Compliance Associate',
            reviewerName: 'Layla Nasser', reviewerRole: 'Compliance Reviewer',
            template: TPL_REG_RISK,
          },
        ]),
      },
      {
        divisionCode: 'LULU-BR-12',
        divisionName: 'BRANCH OPERATIONS',
        industryType: 'financial_services',
        auditReports: inBranchOps([
          // From DAR OPS (ABC-BR-12)
          {
            createdAt: '2023-01-07T00:00:00.000Z', reportTitle: 'Project Cost Audit',
            auditType: 'financial', status: 'approved', createdDate: '2025-01-20', updatedDate: '2025-02-25',
            leadAuditor: 'Grace Kim', reportPeriod: 'quarterly',
            publishedByName: 'Sultan Al Harbi', publishedByRole: 'Audit Coordinator',
            reviewerName: 'Kevin Tan', reviewerRole: 'Audit Supervisor',
            template: TPL_RETAIL_SALES,
          },
          {
            createdAt: '2023-01-08T00:00:00.000Z', reportTitle: 'Site Safety Compliance Report',
            auditType: 'safety', status: 'draft', createdDate: '2025-04-10', updatedDate: '2025-04-10',
            leadAuditor: 'Henry Patel', reportPeriod: 'yearly',
            publishedByName: 'Bandar Al Shehri', publishedByRole: 'Safety Coordinator',
            reviewerName: 'Omar Sheikh', reviewerRole: 'Risk Reviewer',
            template: TPL_TAX,
          },
          {
            createdAt: '2023-01-17T00:00:00.000Z', reportTitle: 'Vendor Due Diligence Audit 2026',
            auditType: 'internal', status: 'draft', createdDate: '2026-04-01', updatedDate: '2026-04-01',
            leadAuditor: 'Ziad Mansour', reportPeriod: 'quarterly',
            publishedByName: 'Fatima Al Qassimi', publishedByRole: 'Audit Associate',
            reviewerName: 'Diego Alvarez', reviewerRole: 'Audit Supervisor',
            template: TPL_VENDOR,
          },
          // Re-homed from DAR HR Dept (ABC-BR-04)
          {
            createdAt: '2023-01-01T00:00:00.000Z', reportTitle: 'Internal Audit Summary - Q1 2025',
            auditType: 'internal', status: 'approved', createdDate: '2025-01-05', updatedDate: '2025-02-10',
            leadAuditor: 'Alice Johnson', reportPeriod: 'quarterly',
            publishedByName: 'Mona Al Bloushi', publishedByRole: 'Audit Coordinator',
            reviewerName: 'Eve Martinez', reviewerRole: 'Quality Reviewer',
            template: TPL_IA_SUMMARY,
          },
          {
            createdAt: '2023-01-02T00:00:00.000Z', reportTitle: 'Regulatory Compliance Review',
            auditType: 'external', status: 'in_review', createdDate: '2025-04-02', updatedDate: '2025-04-18',
            leadAuditor: 'Bob Smith', reportPeriod: 'half_yearly',
            publishedByName: 'Rashid Al Marri', publishedByRole: 'Compliance Associate',
            reviewerName: 'Frank Chen', reviewerRole: 'Senior Reviewer',
            template: TPL_IA_SUMMARY,
          },
          {
            createdAt: '2023-01-14T00:00:00.000Z', reportTitle: 'HR Policy & Payroll Compliance Review 2026',
            auditType: 'internal', status: 'draft', createdDate: '2026-01-15', updatedDate: '2026-02-02',
            leadAuditor: 'Sara Al Naqbi', reportPeriod: 'quarterly',
            publishedByName: 'Huda Al Marri', publishedByRole: 'HR Audit Associate',
            reviewerName: 'Talal Yousef', reviewerRole: 'Senior Reviewer',
            template: TPL_HR_PAYROLL,
          },
          // Re-homed from DAR Finance (ABC-BR-03)
          {
            createdAt: '2023-01-03T00:00:00.000Z', reportTitle: 'Regulatory Risk Assessment',
            auditType: 'financial', status: 'draft', createdDate: '2025-03-01', updatedDate: '2025-03-01',
            leadAuditor: 'Carol White', reportPeriod: 'yearly',
            publishedByName: 'Aisha Al Nuaimi', publishedByRole: 'Risk Associate',
            reviewerName: 'Ivan Rossi', reviewerRole: 'Risk Reviewer',
            template: TPL_VENDOR,
          },
          {
            createdAt: '2023-01-04T00:00:00.000Z', reportTitle: 'AML Findings Report',
            auditType: 'financial', status: 'reopened', createdDate: '2024-11-15', updatedDate: '2025-01-22',
            leadAuditor: 'David Lee', reportPeriod: 'half_yearly',
            publishedByName: 'Saeed Al Kaabi', publishedByRole: 'Compliance Associate',
            reviewerName: 'George Hassan', reviewerRole: 'Compliance Reviewer',
            template: TPL_REG_RISK,
          },
          {
            createdAt: '2023-01-15T00:00:00.000Z', reportTitle: 'Annual AML Compliance Audit 2026',
            auditType: 'financial', status: 'approved', createdDate: '2026-02-10', updatedDate: '2026-03-05',
            leadAuditor: 'Yara Haddad', reportPeriod: 'yearly',
            publishedByName: 'Salim Al Kindi', publishedByRole: 'Compliance Associate',
            reviewerName: 'Nabil Farouk', reviewerRole: 'Compliance Reviewer',
            template: TPL_FIN_STATEMENT,
          },
          // Re-homed from DAR CONSUMER PROTECTION (ABC-BR-07)
          {
            createdAt: '2023-01-13T00:00:00.000Z', reportTitle: 'Cybersecurity Risk Assessment',
            auditType: 'external', status: 'draft', createdDate: '2025-05-05', updatedDate: '2025-05-05',
            leadAuditor: 'Mia Santos', reportPeriod: 'quarterly',
            publishedByName: 'Yousef Al Ajmi', publishedByRole: 'Security Associate',
            reviewerName: 'Priya Nair', reviewerRole: 'Audit Reviewer',
            template: TPL_VENDOR_V2,
          },
          {
            createdAt: '2023-01-20T00:00:00.000Z', reportTitle: 'Customer Complaints Handling Audit 2026',
            auditType: 'external', status: 'draft', createdDate: '2026-06-18', updatedDate: '2026-06-18',
            leadAuditor: 'Farah Idris', reportPeriod: 'monthly',
            publishedByName: 'Waleed Al Amiri', publishedByRole: 'Consumer Protection Associate',
            reviewerName: 'Grace Effiong', reviewerRole: 'Audit Reviewer',
            template: TPL_VENDOR_V2,
          },
        ]),
      },
    ],
  },
];
