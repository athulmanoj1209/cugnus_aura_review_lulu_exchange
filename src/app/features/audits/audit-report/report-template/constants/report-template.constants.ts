/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (report-template-static-*.ts) stay assignable to
 * the derived types in models/report-template-static-data.model.ts.
 */

export const ReportTemplateStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

/** Mode the Add/Edit report template dialog opens in. */
export const ReportTemplateDialogModes = {
  Create: 'create',
  Edit: 'edit',
} as const;
export type ReportTemplateDialogMode = typeof ReportTemplateDialogModes[keyof typeof ReportTemplateDialogModes];

/** Step the Add dialog is on: the form, or the upload/parse progress view. */
export const ReportTemplateUploadPhases = {
  Form: 'form',
  Processing: 'processing',
} as const;
export type ReportTemplateUploadPhase = typeof ReportTemplateUploadPhases[keyof typeof ReportTemplateUploadPhases];

/** Mirrors the backend enum AURA.Program.ParsingStatus — sent as a plain number. */
export const ParsingStatus = {
  InProgress: 1,
  Completed: 2,
  Failed: 3,
} as const;

/** Grid / list toggle on the report template listing page. */
export const ReportTemplateViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type ReportTemplateViewMode = typeof ReportTemplateViewModes[keyof typeof ReportTemplateViewModes];

/* ── Backend upload contract ──────────────────────────────────────────── */

/** POST endpoint (appended to environment.apiBaseUrl). */
export const REPORT_TEMPLATE_UPLOAD_PATH = '/Audit/upload-template';

/** Status the upload endpoint returns once the file is queued for parsing. */
export const REPORT_TEMPLATE_UPLOAD_ACCEPTED_STATUS = 202;

/** SSE event name the parse progress is pushed on. */
export const REPORT_TEMPLATE_SSE_EVENT = 'notifications';

/** multipart/form-data field names the upload endpoint expects. */
export const REPORT_TEMPLATE_UPLOAD_FIELDS = {
  File: 'File',
  CompanyId: 'CompanyId',
  DivisionCode: 'DivisionCode',
  TemplateName: 'TemplateName',
  TemplateDescription: 'TemplateDescription',
  IndustryType: 'IndustryType',
  IsActive: 'IsActive',
} as const;

/** Report editor page — opened with `?id=<backend templateId>` (also used by final-report). */
export const REPORT_EDITOR_ROUTE = '/apps/add-report';

/* ── Configuration ────────────────────────────────────────────────────── */

export const REPORT_TEMPLATE_PAGE_SIZE = 6;

/** Linked reports per page on the template profile drawer. */
export const REPORT_TEMPLATE_LINKED_REPORTS_PAGE_SIZE = 4;

/** Add/Edit dialog width — widened while the uploaded template is being parsed. */
export const REPORT_TEMPLATE_DIALOG_WIDTH = {
  Default: 'min(760px, 95vw)',
  Processing: '900px',
} as const;

export const REPORT_TEMPLATE_PROFILE_DRAWER = {
  Width: '820px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px] report-template-profile-drawer',
} as const;

/** Only Word templates can be uploaded. */
export const REPORT_TEMPLATE_FILE_EXTENSION = '.docx';

/** Upload size limit for a template file (20 MB). */
export const REPORT_TEMPLATE_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

/** Simulated delay (ms) of the "is this template in use?" check before unlocking the file. */
export const REPORT_TEMPLATE_USAGE_CHECK_DELAY_MS = 400;

/** Id given to a template created via upload: `RPT-<backend templateId>`. */
export const REPORT_TEMPLATE_ID_PREFIX = 'RPT-';

/** Fallback company badge colour when the company has none. */
export const REPORT_TEMPLATE_DEFAULT_COMPANY_COLOR = '#102e70';

/** Submitter stamped on a template created in this session (no auth user wired yet). */
export const REPORT_TEMPLATE_NEW_SUBMITTER = {
  Name: 'Current User',
  Role: 'Auditor',
} as const;

/** Placeholder source used until template files are uploaded/served per-template by the backend. */
export const REPORT_TEMPLATE_SAMPLE_FILE_URL =
  `assets/data/org-static-data/dar-exchange/${encodeURIComponent('ABC Broadcast - IA  Draft H1_2025 1.0-Template.docx')}`;

/** Download name when a template has no file name. */
export const REPORT_TEMPLATE_DEFAULT_FILE_NAME = 'template-file.docx';
