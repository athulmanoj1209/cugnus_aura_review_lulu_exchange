/* ── User-facing text for the risk module ─────────────────────────────── */

export const RISK_TOAST_MESSAGES = {
  Added: 'New risk has been successfully added.',
  Updated: 'Risk details have been successfully updated.',
  Approved: 'Risk has been successfully approved.',
  ApprovedTitle: 'Risk Approved',
  Rejected: 'Risk has been rejected.',
  RejectedTitle: 'Risk Rejected',
} as const;

export const RISK_CONFIRM_DIALOGS = {
  Approve: {
    title: 'Confirm Approval',
    message: 'Are you sure you want to approve this risk? This action cannot be undone.',
    confirmLabel: 'Yes, Approve',
  },
  Reject: {
    title: 'Confirm Rejection',
    message: 'Are you sure you want to reject this risk? The submitter will be notified.',
    confirmLabel: 'Yes, Reject',
  },
} as const;

/** Confirm button of the Risk Register's activate / deactivate dialog. */
export const RISK_BLOCK_CONFIRM_LABELS = {
  Activate: 'Yes, Activate',
  Deactivate: 'Yes, Deactivate',
} as const;

export const RISK_DRAWER_TITLES = {
  Review: 'Review Risk',
  Edit: 'Edit Risk',
  Add: 'Add Risk',
} as const;

export const RISK_DRAWER_SUBTITLES = {
  Review: 'Edit risk details, add your notes and approve or reject',
  Edit: 'Update risk details and recalculate scores',
  Add: 'Create a new risk record in the register',
} as const;

export const RISK_SUBMIT_LABELS = {
  Edit: 'Save Changes',
  Add: 'ADD RISK',
} as const;

/** Placeholders of the Sub-Division dropdown (form + filter). */
export const RISK_SUB_DIVISION_PLACEHOLDERS = {
  All: 'All sub-divisions',
  Select: 'Select sub-division',
  None: 'No sub-divisions for this division',
} as const;

export const RISK_SEARCH_PLACEHOLDER = 'Search by ID, title or owner…';

/* ── Import Risks dialog ──────────────────────────────────────────────── */

export const RISK_IMPORT_SUBTITLES = {
  Upload: 'Upload a CSV or Excel file to bulk-import risks',
  Preview: 'Review and confirm imported data',
} as const;

export const RISK_IMPORT_PARSE_ERRORS = {
  UnsupportedFile: 'Unsupported file type. Please upload a .csv or .xlsx file.',
  ReadFailed: 'Could not read file.',
  NoDataRows: 'File has no data rows. Download the template and fill in at least one row.',
  NoSpreadsheetRows: 'Spreadsheet has no data rows.',
  SheetJsMissing: 'SheetJS (xlsx) library not found. Please use a CSV file or install the xlsx package: npm i xlsx',
  ExcelParseFailed: 'Failed to parse Excel file. Please use the CSV template instead.',
} as const;

export const RISK_IMPORT_ROW_ERRORS = {
  TitleRequired: 'Risk Title is required',
  DescriptionRequired: 'Description is required',
  SubDivisionRequired: 'Sub-Division is required',
  OwnerRequired: 'Owner is required',
  ImpactRange: 'Impact must be 1–5',
  LikelihoodRange: 'Likelihood must be 1–5',
} as const;

export const invalidRiskTypeMessage = (value: string, allowed: readonly string[]): string =>
  `Risk Type "${value}" is invalid. Use: ${allowed.join(', ')}`;

export const invalidControlEffectivenessMessage = (value: string, allowed: readonly string[]): string =>
  `Control Effectiveness "${value}" is invalid. Use: ${allowed.join(', ')}`;

export const invalidRiskStatusMessage = (value: string, allowed: readonly string[]): string =>
  `Status "${value}" is invalid. Use: ${allowed.join(', ')}`;

export const RISK_IMPORTING_LABEL = 'Importing…';

export const importRisksLabel = (count: number): string =>
  `Import ${count} Risk${count !== 1 ? 's' : ''}`;

/* ── Heat map ─────────────────────────────────────────────────────────── */

export const RISK_HEATMAP_MESSAGES = {
  ExportTitle: 'Risk Heat Map',
  Exporting: 'Exporting…',
  PopupBlocked: 'Please allow pop-ups to export PDF.',
  ImageLoadFailed: 'Image failed to load.',
} as const;

export const risksPlottedLabel = (count: number): string =>
  `${count} risk${count !== 1 ? 's' : ''} plotted`;

export const heatCellTooltip = (impact: number, likelihood: number, score: number): string =>
  `Impact ${impact} × Likelihood ${likelihood} = ${score}`;
