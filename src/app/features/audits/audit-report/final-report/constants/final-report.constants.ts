/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (reports-lists-static-*.ts) stay assignable to
 * the derived types in models/final-report-static-data.model.ts.
 */

export const ReportStatuses = {
  Draft: 'draft',
  Reopened: 'reopened',
  InReview: 'in_review',
  Approved: 'approved',
} as const;

export const AuditTypes = {
  Internal: 'internal',
  External: 'external',
  Financial: 'financial',
  Safety: 'safety',
} as const;

export const ReportPeriods = {
  Monthly: 'monthly',
  Quarterly: 'quarterly',
  HalfYearly: 'half_yearly',
  Yearly: 'yearly',
} as const;

/** Mode the Add/Edit report drawer opens in. */
export const FinalReportDrawerModes = {
  Add: 'add',
  Edit: 'edit',
} as const;
export type FinalReportDrawerMode = typeof FinalReportDrawerModes[keyof typeof FinalReportDrawerModes];

/** Grid / list toggle on the report listing page. */
export const FinalReportViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type FinalReportViewMode = typeof FinalReportViewModes[keyof typeof FinalReportViewModes];

/* ── Period zones ('M1'..'M12', 'Q1'..'Q4', 'H1'/'H2', 'Y2025') ─────────── */

export const PERIOD_ZONE_PREFIXES = {
  Month: 'M',
  Quarter: 'Q',
  Half: 'H',
  Year: 'Y',
} as const;

export const PERIOD_ZONE_QUARTERS: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
export const PERIOD_ZONE_HALVES: string[] = ['H1', 'H2'];
export const PERIOD_ZONE_FIRST_HALF = 'H1';
export const PERIOD_ZONE_SECOND_HALF = 'H2';

/** Months before this index (0-based) fall in H1. */
export const PERIOD_ZONE_HALF_YEAR_MONTHS = 6;
export const PERIOD_ZONE_QUARTER_MONTHS = 3;

export const MONTH_SHORT_NAMES: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ── Configuration ────────────────────────────────────────────────────── */

export const FINAL_REPORT_PAGE_SIZE = 6;

export const FINAL_REPORT_DRAWER = {
  FormWidth: '700px',
  ProfileWidth: '760px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
  ProfileStyleClass: 'rounded-tl-[35px] rounded-bl-[35px] final-report-profile-drawer',
} as const;

/** Report ids look like `AUD-<division code>-<year>-<random 4 digits>`. */
export const FINAL_REPORT_ID_PREFIX = 'AUD-';
export const FINAL_REPORT_ID_RANDOM = {
  Min: 1000,
  Range: 9000,
} as const;

/** Placeholder report id the editor opens when the chosen template was never uploaded to the backend. */
export const FINAL_REPORT_PLACEHOLDER_REPORT_ID = 540;

/** Fallback company badge colour when the company has none. */
export const FINAL_REPORT_DEFAULT_COMPANY_COLOR = '#102e70';

/** Values stamped on a report created from the Add Report drawer. */
export const FINAL_REPORT_NEW_REPORT_DEFAULTS = {
  PublishedByRole: $localize`:@@audit.auditReport.reportPublisher:Report Publisher`,
  ReviewerName: $localize`:@@audit.auditReport.unassigned:Unassigned`,
  ReviewerRole: $localize`:@@audit.auditReport.pendingAssignment:Pending Assignment`,
  /** Used when no template was picked. */
  FallbackTemplateFileName: '—',
  FallbackTemplateSubmitterRole: $localize`:@@audit.auditReport.leadAuditor:Lead Auditor`,
} as const;

/** Placeholder source used until generated report files are served per-report by the backend. */
export const FINAL_REPORT_SAMPLE_REPORT_FILE_URL =
  `assets/data/org-static-data/dar-exchange/${encodeURIComponent('ABC Broadcast - IA  Draft H1_2025 1.0-Report.docx')}`;

/** Placeholder template file opened from the report profile drawer. */
export const FINAL_REPORT_SAMPLE_TEMPLATE_FILE_URL =
  `assets/data/org-static-data/dar-exchange/${encodeURIComponent('Dar-Exchange - IA  Draft H1_2025 1.0-Template.docx')}`;

/** Download name when a report has no title (".docx" is appended). */
export const FINAL_REPORT_DEFAULT_FILE_NAME = 'report-file';
export const FINAL_REPORT_FILE_EXTENSION = '.docx';

/** Milliseconds in a day — for the profile drawer's duration. */
export const MS_PER_DAY = 24 * 3600 * 1000;
