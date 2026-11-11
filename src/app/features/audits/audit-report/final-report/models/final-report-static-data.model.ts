// Shapes of the static audit-report seed trees (reports-lists-static-data.ts,
// report-lists-static-indi-org-data.ts, report-lists-static-xyz-broadcast.data.ts).

import type { AuditTypes, ReportPeriods, ReportStatuses } from '../constants/final-report.constants';
import type { ReportTemplateStatus } from '@/app/features/audits/audit-report/report-template/models/report-template-static-data.model';

export type AuditType = typeof AuditTypes[keyof typeof AuditTypes];
export type ReportPeriod = typeof ReportPeriods[keyof typeof ReportPeriods];
export type ReportStatus = typeof ReportStatuses[keyof typeof ReportStatuses];

export interface ReportTemplateInfo {
  /** Backend-issued numeric id from POST /Audit/upload-template - null for every
   *  pre-seeded static record here (they were never actually uploaded). Mirrors
   *  ReportTemplateRecord.templateId in report-template/models/report-template-static-data.model.ts. */
  templateId: number | null;
  templateName: string;
  templateDescription: string;
  industryType: string;
  templateFileName: string;
  submittedByName: string;
  submittedByRole: string;
  status: ReportTemplateStatus;
}

export interface AuditReportRecord {
  companyId: string;
  divisionName: string;
  divisionCode: string;
  /** ISO timestamp — drives newest-first ordering in reports-lists.ts. */
  createdAt: string;
  reportTitle: string;
  auditType: AuditType;
  status: ReportStatus;
  createdDate: string;
  updatedDate: string;
  leadAuditor: string;
  reportPeriod: ReportPeriod;
  publishedByName: string;
  publishedByRole: string;
  reviewerName: string;
  reviewerRole: string;
  template: ReportTemplateInfo;
}

export interface ReportsListStaticDivision {
  divisionCode: string;
  divisionName: string;
  /** Real-world sector this division operates in. */
  industryType: string;
  auditReports: AuditReportRecord[];
}

export interface ReportsListStaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  divisions: ReportsListStaticDivision[];
}

export interface CompanyLookupEntry {
  id: string;
  label: string;
  tag: string;
  color: string;
}
