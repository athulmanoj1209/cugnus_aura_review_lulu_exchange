// Shapes of the static report-template seed trees (report-template-static-data.ts,
// report-template-static-ind.data.ts, report-template-static-xyz-broadcast.data.ts).

import type { ReportTemplateStatuses } from '../constants/report-template.constants';

export type ReportTemplateStatus = typeof ReportTemplateStatuses[keyof typeof ReportTemplateStatuses];

export interface ReportTemplateRecord {
  id: string;
  /** Backend-issued numeric id from POST /Audit/upload-template - null for every
   *  pre-seeded static record here (they were never actually uploaded), set from
   *  the SSE "Completed" notification's templateId for a real created template -
   *  see emitCreatedTemplate() in manage/report-template.component.ts. */
  templateId: number | null;
  companyId: string;
  divisionName: string;
  divisionCode: string;
  templateName: string;
  templateDescription: string;
  industryType: string;
  templateFileName: string;
  /** ISO timestamp — drives newest-first ordering in list/report-template-list.component.ts. */
  createdAt: string;
  submittedByName: string;
  submittedByRole: string;
  status: ReportTemplateStatus;
  isUsed: boolean;
}

export interface ReportTemplateStaticDivision {
  divisionCode: string;
  divisionName: string;
  /** Real-world sector this division operates in — drives Industry Type auto-fill. */
  industryType: string;
  reportTemplates: ReportTemplateRecord[];
}

export interface ReportTemplateStaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  divisions: ReportTemplateStaticDivision[];
}

export interface CompanyLookupEntry {
  id: string;
  label: string;
  tag: string;
  color: string;
}
