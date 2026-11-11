// Reports Lists static data for the XYZ Broadcast internal-audit client —
// same shape, fields and helpers as report-lists-static-indi-org-data.ts
// (the ABC Broadcast seed); only the org data differs.
//
// Uses the exact same company/division identity space as
// report-template-static-xyz-broadcast.data.ts (company `xyz-broadcast`,
// division XYZ-BR-01 "Dubai") so a report's company/division always cascades to
// the same real template options, and every report's embedded `template`
// is a verbatim copy of one of that file's templates (RPT-201..RPT-210).
// Report titles follow the XYZ audit scopes/sub-scopes in
// audit-scope-static-xyz-org.data.ts.

import type { AuditReportRecord, ReportsListStaticCompany, CompanyLookupEntry } from './models/final-report-static-data.model';

export const REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES: ReportsListStaticCompany[] = [
  {
    "id": "xyz-broadcast",
    "companyName": "XYZ Broadcast",
    "tag": "XYZ",
    "color": "#6a1b9a",
    "divisions": [
      {
        "divisionCode": "XYZ-BR-01",
        "divisionName": "Dubai",
        "industryType": "technology",
        "auditReports": [
          {
            "createdAt": "2026-03-02T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Broadcast Transmission & Playout Audit - Q1 2026",
            "auditType": "internal",
            "status": "approved",
            "createdDate": "2026-03-02",
            "updatedDate": "2026-04-14",
            "leadAuditor": "Karim Aziz",
            "reportPeriod": "quarterly",
            "publishedByName": "Rana Khoury",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Broadcast Operations Audit Template",
              "templateDescription": "Audit report on TV/radio transmission and playout reliability, schedule compliance, outage root-cause management and studio/master control room access controls.",
              "industryType": "technology",
              "templateFileName": "Broadcast_Operations_Audit_Template.docx",
              "submittedByName": "Karim Aziz",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-05-06T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Studio & Master Control Room Access Review 2026",
            "auditType": "internal",
            "status": "draft",
            "createdDate": "2026-05-06",
            "updatedDate": "2026-05-21",
            "leadAuditor": "Yousuf Rahman",
            "reportPeriod": "half_yearly",
            "publishedByName": "Rana Khoury",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Nadia Haddad",
            "reviewerRole": "Head of Internal Audit",
            "template": {
              "templateId": null,
              "templateName": "Broadcast Operations Audit Template",
              "templateDescription": "Audit report on TV/radio transmission and playout reliability, schedule compliance, outage root-cause management and studio/master control room access controls.",
              "industryType": "technology",
              "templateFileName": "Broadcast_Operations_Audit_Template.docx",
              "submittedByName": "Karim Aziz",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-04-08T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Editorial-to-Publication Workflow Review 2026",
            "auditType": "internal",
            "status": "in_review",
            "createdDate": "2026-04-08",
            "updatedDate": "2026-05-27",
            "leadAuditor": "Farah Idris",
            "reportPeriod": "half_yearly",
            "publishedByName": "Samir Nasser",
            "publishedByRole": "Publishing Audit Associate",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Publishing & Circulation Audit Template",
              "templateDescription": "Audit report on the editorial-to-publication workflow, print production controls, distributor returns and monthly circulation reconciliation.",
              "industryType": "technology",
              "templateFileName": "Publishing_Circulation_Audit_Template.docx",
              "submittedByName": "Farah Idris",
              "submittedByRole": "Internal Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-04-20T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Print Production & Circulation Reconciliation - Q1 2026",
            "auditType": "financial",
            "status": "reopened",
            "createdDate": "2026-04-20",
            "updatedDate": "2026-06-09",
            "leadAuditor": "Farah Idris",
            "reportPeriod": "quarterly",
            "publishedByName": "Samir Nasser",
            "publishedByRole": "Publishing Audit Associate",
            "reviewerName": "Nadia Haddad",
            "reviewerRole": "Head of Internal Audit",
            "template": {
              "templateId": null,
              "templateName": "Publishing & Circulation Audit Template",
              "templateDescription": "Audit report on the editorial-to-publication workflow, print production controls, distributor returns and monthly circulation reconciliation.",
              "industryType": "technology",
              "templateFileName": "Publishing_Circulation_Audit_Template.docx",
              "submittedByName": "Farah Idris",
              "submittedByRole": "Internal Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-03-16T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Advertising Booking-to-Billing Assurance - Q1 2026",
            "auditType": "financial",
            "status": "approved",
            "createdDate": "2026-03-16",
            "updatedDate": "2026-04-28",
            "leadAuditor": "Sultan Al Mazrouei",
            "reportPeriod": "quarterly",
            "publishedByName": "Lina Barakat",
            "publishedByRole": "Revenue Assurance Associate",
            "reviewerName": "Nadia Haddad",
            "reviewerRole": "Head of Internal Audit",
            "template": {
              "templateId": null,
              "templateName": "Advertising Revenue Assurance Template",
              "templateDescription": "Revenue assurance report reconciling ad bookings to proof-of-airing and invoices, testing rate card and discount authorisation, and quantifying unbilled airtime.",
              "industryType": "technology",
              "templateFileName": "Advertising_Revenue_Assurance_Template.docx",
              "submittedByName": "Sultan Al Mazrouei",
              "submittedByRole": "Audit Manager",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-05-18T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Rate Card & Discount Authorisation Review 2026",
            "auditType": "internal",
            "status": "reopened",
            "createdDate": "2026-05-18",
            "updatedDate": "2026-07-02",
            "leadAuditor": "Karim Aziz",
            "reportPeriod": "half_yearly",
            "publishedByName": "Lina Barakat",
            "publishedByRole": "Revenue Assurance Associate",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Advertising Revenue Assurance Template",
              "templateDescription": "Revenue assurance report reconciling ad bookings to proof-of-airing and invoices, testing rate card and discount authorisation, and quantifying unbilled airtime.",
              "industryType": "technology",
              "templateFileName": "Advertising_Revenue_Assurance_Template.docx",
              "submittedByName": "Sultan Al Mazrouei",
              "submittedByRole": "Audit Manager",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-08-10T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Advertising Revenue Completeness Review - Q3 2026",
            "auditType": "financial",
            "status": "draft",
            "createdDate": "2026-08-10",
            "updatedDate": "2026-08-10",
            "leadAuditor": "Omar Khalil",
            "reportPeriod": "quarterly",
            "publishedByName": "Lina Barakat",
            "publishedByRole": "Revenue Assurance Associate",
            "reviewerName": "Nadia Haddad",
            "reviewerRole": "Head of Internal Audit",
            "template": {
              "templateId": null,
              "templateName": "Advertising Revenue Assurance Template",
              "templateDescription": "Revenue assurance report reconciling ad bookings to proof-of-airing and invoices, testing rate card and discount authorisation, and quantifying unbilled airtime.",
              "industryType": "technology",
              "templateFileName": "Advertising_Revenue_Assurance_Template.docx",
              "submittedByName": "Sultan Al Mazrouei",
              "submittedByRole": "Audit Manager",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-04-02T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Sponsorship Contractual Obligations Review 2026",
            "auditType": "external",
            "status": "approved",
            "createdDate": "2026-04-02",
            "updatedDate": "2026-05-12",
            "leadAuditor": "Yousuf Rahman",
            "reportPeriod": "yearly",
            "publishedByName": "Dina Aboud",
            "publishedByRole": "Partnerships Audit Associate",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Sponsorship & Partnerships Review Template",
              "templateDescription": "Review report on sponsorship contract approvals, delivery of contracted sponsor benefits, billing accuracy and outstanding obligations.",
              "industryType": "technology",
              "templateFileName": "Sponsorship_Partnerships_Review_Template.docx",
              "submittedByName": "Yousuf Rahman",
              "submittedByRole": "Senior Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-06-03T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Revenue & Receivables Audit - Q2 2026",
            "auditType": "financial",
            "status": "in_review",
            "createdDate": "2026-06-03",
            "updatedDate": "2026-07-20",
            "leadAuditor": "Omar Khalil",
            "reportPeriod": "quarterly",
            "publishedByName": "Fadi Jaber",
            "publishedByRole": "Finance Audit Associate",
            "reviewerName": "Nadia Haddad",
            "reviewerRole": "Head of Internal Audit",
            "template": {
              "templateId": null,
              "templateName": "Financial Reporting & Close Audit Template",
              "templateDescription": "Audit report on revenue recognition, receivables ageing, credit notes, key account reconciliations, manual journals and the month-end close process.",
              "industryType": "technology",
              "templateFileName": "Financial_Reporting_Close_Audit_Template.docx",
              "submittedByName": "Omar Khalil",
              "submittedByRole": "Finance Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-06-22T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "General Ledger & Month-End Close Review 2026",
            "auditType": "financial",
            "status": "reopened",
            "createdDate": "2026-06-22",
            "updatedDate": "2026-08-24",
            "leadAuditor": "Omar Khalil",
            "reportPeriod": "monthly",
            "publishedByName": "Fadi Jaber",
            "publishedByRole": "Finance Audit Associate",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Financial Reporting & Close Audit Template",
              "templateDescription": "Audit report on revenue recognition, receivables ageing, credit notes, key account reconciliations, manual journals and the month-end close process.",
              "industryType": "technology",
              "templateFileName": "Financial_Reporting_Close_Audit_Template.docx",
              "submittedByName": "Omar Khalil",
              "submittedByRole": "Finance Auditor",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-07-06T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Internal Audit Summary - H1 2026",
            "auditType": "internal",
            "status": "approved",
            "createdDate": "2026-07-06",
            "updatedDate": "2026-07-30",
            "leadAuditor": "Nadia Haddad",
            "reportPeriod": "half_yearly",
            "publishedByName": "Rana Khoury",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Media Internal Audit Summary Template",
              "templateDescription": "Standard summary report covering audit scope, key findings, risk ratings, management responses and agreed action plans for media-company internal audit engagements.",
              "industryType": "technology",
              "templateFileName": "XYZ_IA_Summary_Report_Template_v2.docx",
              "submittedByName": "Nadia Haddad",
              "submittedByRole": "Head of Internal Audit",
              "status": "active"
            }
          },
          {
            "createdAt": "2026-09-07T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "reportTitle": "Audit Committee Quarterly Report - Q3 2026",
            "auditType": "internal",
            "status": "in_review",
            "createdDate": "2026-09-07",
            "updatedDate": "2026-09-21",
            "leadAuditor": "Nadia Haddad",
            "reportPeriod": "quarterly",
            "publishedByName": "Rana Khoury",
            "publishedByRole": "Audit Coordinator",
            "reviewerName": "Sultan Al Mazrouei",
            "reviewerRole": "Senior Reviewer",
            "template": {
              "templateId": null,
              "templateName": "Audit Committee Quarterly Report Template",
              "templateDescription": "Quarterly report to the Audit Committee summarising audit plan progress, significant findings, overdue management actions and emerging media-sector risks.",
              "industryType": "technology",
              "templateFileName": "Audit_Committee_Quarterly_Report_Template.docx",
              "submittedByName": "Nadia Haddad",
              "submittedByRole": "Head of Internal Audit",
              "status": "active"
            }
          }
        ]
      }
    ]
  }
];


/** Flattened view over the tree above — the raw seed reports-lists.ts stamps ids/periodZone onto. */
export const RAW_AUDIT_REPORTS_FLAT: AuditReportRecord[] = REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES.flatMap(c =>
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
  const division = REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES
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

export const REPORTS_LIST_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORTS_LIST_STATIC_XYZ_BROADCAST_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
