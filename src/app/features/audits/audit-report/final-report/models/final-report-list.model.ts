import type { AuditType, ReportPeriod, ReportStatus, ReportTemplateInfo } from './final-report-static-data.model';

// Shape of the flat list entries reports-lists.ts builds from the static seed trees.

export interface AuditReportEntry {
  id: string;
  companyId: string;
  divisionName: string;
  divisionCode: string;
  /** ISO timestamp — drives newest-first ordering (see applyFilters()). */
  createdAt: string;
  reportTitle: string;
  auditType: AuditType;
  status: ReportStatus;
  createdDate: string;
  updatedDate: string;
  leadAuditor: string;
  reportPeriod: ReportPeriod;
  /** Specific instance within reportPeriod - 'Q1'..'Q4', 'M1'..'M12', 'H1'/'H2', or '' for yearly. */
  periodZone: string;
  /** Who first published this report. */
  publishedByName: string;
  publishedByRole: string;
  /** Who this report is assigned to for review. */
  reviewerName: string;
  reviewerRole: string;
  /** The template this report was generated from - see report-template/list/report-template-list.component.ts. */
  template: ReportTemplateInfo;
}
