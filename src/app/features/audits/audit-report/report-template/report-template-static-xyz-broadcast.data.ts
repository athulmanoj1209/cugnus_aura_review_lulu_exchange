// Report Templates static data for the XYZ Broadcast internal-audit client —
// same shape, fields and helpers as report-template-static-ind.data.ts
// (the DAR Exchange / ABC Broadcast seed); only the org data differs.
//
// Company/division identity matches the other XYZ Broadcast seeds
// (Admin/company-static-xyz-broadcast.data.ts, divisions/division-static-xyz-
// broadcast.data.ts): company `xyz-broadcast`, single division XYZ-BR-01
// "Dubai" (sector `technology`). Templates are media-company specific and
// line up with the XYZ audit scopes (Broadcasting, Publishing, Advertising,
// Sponsorship, Finance) plus division-wide summary/committee templates.
// final-report/report-lists-static-xyz-broadcast.data.ts embeds these same
// templates on its report records.

import type { ReportTemplateRecord, ReportTemplateStaticCompany, CompanyLookupEntry } from './models/report-template-static-data.model';
import { REPORT_TEMPLATE_NEW_SUBMITTER } from './constants/report-template.constants';

export const REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES: ReportTemplateStaticCompany[] = [
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
        "reportTemplates": [
          {
            "id": "RPT-201",
            "templateId": null,
            "createdAt": "2026-01-12T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Media Internal Audit Summary Template",
            "templateDescription": "Standard summary report covering audit scope, key findings, risk ratings, management responses and agreed action plans for media-company internal audit engagements.",
            "industryType": "technology",
            "templateFileName": "XYZ_IA_Summary_Report_Template_v2.docx",
            "submittedByName": "Nadia Haddad",
            "submittedByRole": "Head of Internal Audit",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-202",
            "templateId": null,
            "createdAt": "2026-01-14T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Broadcast Operations Audit Template",
            "templateDescription": "Audit report on TV/radio transmission and playout reliability, schedule compliance, outage root-cause management and studio/master control room access controls.",
            "industryType": "technology",
            "templateFileName": "Broadcast_Operations_Audit_Template.docx",
            "submittedByName": "Karim Aziz",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-203",
            "templateId": null,
            "createdAt": "2026-01-19T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Publishing & Circulation Audit Template",
            "templateDescription": "Audit report on the editorial-to-publication workflow, print production controls, distributor returns and monthly circulation reconciliation.",
            "industryType": "technology",
            "templateFileName": "Publishing_Circulation_Audit_Template.docx",
            "submittedByName": "Farah Idris",
            "submittedByRole": "Internal Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-204",
            "templateId": null,
            "createdAt": "2026-01-22T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Advertising Revenue Assurance Template",
            "templateDescription": "Revenue assurance report reconciling ad bookings to proof-of-airing and invoices, testing rate card and discount authorisation, and quantifying unbilled airtime.",
            "industryType": "technology",
            "templateFileName": "Advertising_Revenue_Assurance_Template.docx",
            "submittedByName": "Sultan Al Mazrouei",
            "submittedByRole": "Audit Manager",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-205",
            "templateId": null,
            "createdAt": "2026-01-27T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Sponsorship & Partnerships Review Template",
            "templateDescription": "Review report on sponsorship contract approvals, delivery of contracted sponsor benefits, billing accuracy and outstanding obligations.",
            "industryType": "technology",
            "templateFileName": "Sponsorship_Partnerships_Review_Template.docx",
            "submittedByName": "Yousuf Rahman",
            "submittedByRole": "Senior Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-206",
            "templateId": null,
            "createdAt": "2026-02-02T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Financial Reporting & Close Audit Template",
            "templateDescription": "Audit report on revenue recognition, receivables ageing, credit notes, key account reconciliations, manual journals and the month-end close process.",
            "industryType": "technology",
            "templateFileName": "Financial_Reporting_Close_Audit_Template.docx",
            "submittedByName": "Omar Khalil",
            "submittedByRole": "Finance Auditor",
            "status": "active",
            "isUsed": true
          },
          {
            "id": "RPT-207",
            "templateId": null,
            "createdAt": "2026-02-09T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Content Rights & Compliance Audit Template",
            "templateDescription": "Audit report on content licensing, licence expiry and territorial restrictions, content standards review and complaints handling.",
            "industryType": "technology",
            "templateFileName": "Content_Rights_Compliance_Audit_Template.docx",
            "submittedByName": "Hana Saeed",
            "submittedByRole": "Compliance Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-208",
            "templateId": null,
            "createdAt": "2026-02-16T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Cybersecurity & IT General Controls Template",
            "templateDescription": "Audit report on identity and access management, vulnerability remediation, cyber incident response and change management across broadcast, newsroom and corporate systems.",
            "industryType": "technology",
            "templateFileName": "Cybersecurity_ITGC_Audit_Template.docx",
            "submittedByName": "Tariq Mansour",
            "submittedByRole": "IT Auditor",
            "status": "active",
            "isUsed": false
          },
          {
            "id": "RPT-209",
            "templateId": null,
            "createdAt": "2026-02-23T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Business Continuity Readiness Template",
            "templateDescription": "Readiness report on TV/radio continuity plans, alternate studio arrangements, DR testing and RTO/RPO achievement.",
            "industryType": "technology",
            "templateFileName": "Business_Continuity_Readiness_Template_v1.docx",
            "submittedByName": "Tariq Mansour",
            "submittedByRole": "IT Auditor",
            "status": "inactive",
            "isUsed": false
          },
          {
            "id": "RPT-210",
            "templateId": null,
            "createdAt": "2026-03-02T00:00:00.000Z",
            "companyId": "xyz-broadcast",
            "divisionName": "Dubai",
            "divisionCode": "XYZ-BR-01",
            "templateName": "Audit Committee Quarterly Report Template",
            "templateDescription": "Quarterly report to the Audit Committee summarising audit plan progress, significant findings, overdue management actions and emerging media-sector risks.",
            "industryType": "technology",
            "templateFileName": "Audit_Committee_Quarterly_Report_Template.docx",
            "submittedByName": "Nadia Haddad",
            "submittedByRole": "Head of Internal Audit",
            "status": "active",
            "isUsed": true
          }
        ]
      }
    ]
  }
];


/** Flattened view over the tree above — what list/report-template-list.component.ts actually renders/filters. */
export const REPORT_TEMPLATES_FLAT: ReportTemplateRecord[] = REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES.flatMap(c =>
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
  // via the Organization/Divisions module after this file was authored.
  companyMeta?: { companyName: string; tag: string; color: string },
  divisionMeta?: { divisionName: string },
): ReportTemplateRecord | undefined {
  let company = REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    if (!companyMeta) return undefined;
    company = { id: companyId, companyName: companyMeta.companyName, tag: companyMeta.tag, color: companyMeta.color, divisions: [] };
    REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES.push(company);
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

export const REPORT_COMPANY_LOOKUP: CompanyLookupEntry[] = REPORT_TEMPLATE_STATIC_XYZ_BROADCAST_COMPANIES.map(c => ({
  id: c.id,
  label: c.companyName,
  tag: c.tag,
  color: c.color,
}));
