/* ── Display labels, tag severities & form options for audit reports ─────
 * Text is kept exactly as it was inline in the components.
 */

import type { SelectOption } from '@/app/shared/models/select-option.model';
import type { AuditType, ReportPeriod, ReportStatus } from '../models/final-report-static-data.model';

export type ReportStatusSeverity = 'secondary' | 'warn' | 'info' | 'success';

export const AUDIT_TYPE_LABELS: Record<AuditType, string> = {
  internal: $localize`:@@audit.auditReport.auditTypeInternal:Internal`,
  external: $localize`:@@audit.auditReport.auditTypeExternal:External`,
  financial: $localize`:@@audit.auditReport.auditTypeFinancial:Financial`,
  safety: $localize`:@@audit.auditReport.auditTypeSafety:Safety`,
};

export const REPORT_PERIOD_LABELS: Record<ReportPeriod, string> = {
  monthly: $localize`:@@audit.auditReport.monthly:Monthly`,
  quarterly: $localize`:@@audit.auditReport.quarterly:Quarterly`,
  half_yearly: $localize`:@@audit.auditReport.halfYearly:Half Yearly`,
  yearly: $localize`:@@audit.auditReport.yearly:Yearly`,
};

/** Report status badge text (also used by the report-template profile drawer). */
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  draft: $localize`:@@common.draft:Draft`,
  reopened: $localize`:@@audit.auditReport.reopened:Reopened`,
  in_review: $localize`:@@audit.auditReport.inReview:In Review`,
  approved: $localize`:@@common.approved:Approved`,
};

export const REPORT_STATUS_SEVERITY: Record<ReportStatus, ReportStatusSeverity> = {
  draft: 'secondary',
  reopened: 'warn',
  in_review: 'info',
  approved: 'success',
};
export const REPORT_STATUS_DEFAULT_SEVERITY: ReportStatusSeverity = 'secondary';

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const AUDIT_TYPE_OPTIONS: SelectOption[] = [
  { label: $localize`:@@audit.auditReport.auditTypeInternal:Internal`, value: 'internal' },
  { label: $localize`:@@audit.auditReport.auditTypeExternal:External`, value: 'external' },
  { label: $localize`:@@audit.auditReport.auditTypeFinancial:Financial`, value: 'financial' },
  { label: $localize`:@@audit.auditReport.auditTypeSafety:Safety`, value: 'safety' },
];

/** Report period options — Add/Edit drawer and listing filter. */
export const REPORT_PERIOD_OPTIONS: SelectOption[] = [
  { label: $localize`:@@audit.auditReport.monthly:Monthly`, value: 'monthly' },
  { label: $localize`:@@audit.auditReport.quarterly:Quarterly`, value: 'quarterly' },
  { label: $localize`:@@audit.auditReport.halfYearly:Half Yearly`, value: 'half_yearly' },
  { label: $localize`:@@audit.auditReport.yearly:Yearly`, value: 'yearly' },
];

/** 'M3 · Mar' style label for a month period zone. */
export const monthPeriodZoneLabel = (zone: string, monthName: string): string => `${zone} · ${monthName}`;

export const finalReportTitle = (auditTypeLabel: string, divisionName: string): string => $localize`:@@audit.auditReport.finalReportTitle:${auditTypeLabel}:auditType: Audit Report - ${divisionName}:division:`;
export const finalReportFallbackTemplateName = (auditTypeLabel: string): string => $localize`:@@audit.auditReport.fallbackTemplateName:${auditTypeLabel}:auditType: Report Template`;
export const FINAL_REPORT_NO_TEMPLATE_DESCRIPTION = $localize`:@@audit.auditReport.noTemplateDescription:No template selected when this report was created.`;
