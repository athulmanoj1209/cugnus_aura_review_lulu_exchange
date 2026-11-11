/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (rfi-static-data.ts / rfi-static-indi.data.ts /
 * rfi-static-xyz-broadcast.data.ts) stay assignable to the derived types in
 * models/rfi-static-data.model.ts and models/rfi-list.model.ts.
 */

/** An RFI's workflow status — drives the list's status badge and the drawers' tabs/actions. */
export const RfiStatuses = {
  Pending: 'pending',
  Completed: 'completed',
  Overdue: 'overdue',
  UnderReview: 'under-review',
  Reopened: 'reopened',
} as const;

/** Drives the Activate/Deactivate action — independent of the workflow status. */
export const RfiRecordStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

/** Status of the client's response to an RFI. */
export const RfiResponseStatuses = {
  Pending: 'pending',
  Accepted: 'accepted',
  Rejected: 'rejected',
} as const;

/** Who the Add/View RFI drawers and the questionnaire render for (`currentUser`). */
export const RfiViewerRoles = {
  Auditor: 'auditor',
} as const;

/** Grid / list toggle on the RFI listing page. */
export const RfiViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type RfiViewMode = typeof RfiViewModes[keyof typeof RfiViewModes];

/** "Create New RFI" vs "From RFI Library" on the Add RFI form. */
export const RfiSources = {
  Fresh: 'fresh',
  Library: 'library',
} as const;
export type RfiSource = typeof RfiSources[keyof typeof RfiSources];

/* ── Listing deep-link query params ───────────────────────────────────── */

export const RFI_LIST_QUERY_PARAMS = {
  Status: 'status',
  AuditorId: 'auditorId',
  OpenAdd: 'openAdd',
} as const;

/** `?openAdd=` value set by the "Send RFI" quick action. */
export const RFI_OPEN_ADD_TRUE = 'true';

/* ── Configuration ────────────────────────────────────────────────────── */

export const RFI_DRAWER = {
  FormWidth: '700px',
  ProfileWidth: '850px',
  StyleClass: 'rfi-drawer rounded-tl-[35px] rounded-bl-[35px]',
  /** Panel the resize handle resizes. */
  PanelSelector: '.rfi-drawer',
  /** Initial width inside the drawers (resize handle state). */
  InitialWidth: '680px',
  ResizeMinWidth: 300,
  ResizeMaxWidth: 1200,
} as const;

export const RFI_LIST_PAGE_SIZE = 6;

/** Starting ids for the synthetic filter-option records built in rfi-list.component.ts. */
export const RFI_FILTER_OPTION_ID_SEEDS = {
  SubDivision: 100,
  SubDivisionScope: 200,
  SubDivisionSubScope: 300,
  Scope: 500,
  SubScope: 700,
} as const;

export const RFI_TITLE_MIN_LENGTH = 10;
export const RFI_TITLE_MAX_LENGTH = 500;
export const RFI_DESCRIPTION_MIN_LENGTH = 10;
export const RFI_DESCRIPTION_MAX_LENGTH = 500;

/** Tabs of the Add RFI drawer. */
export const RFI_FORM_TABS = {
  Details: 0,
  Questionnaire: 1,
} as const;

export const RFI_DOCUMENT_UPLOAD = {
  MaxFileSizeMb: 50,
  AllowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as string[],
} as const;

/** Fallback company badge colour when a self-created RFI company wrapper has none. */
export const RFI_DEFAULT_COMPANY_COLOR = '#102e70';

/** Length of the fallback company tag derived from the company id. */
export const RFI_COMPANY_TAG_LENGTH = 3;

/* ── Backend-served reference documents (View RFI / client RFI drawers) ── */

export const RFI_UPLOADS_BASE_URL = 'http://localhost:5251/uploads/';

export const RFI_REFERENCE_DOCS = {
  AuditTheory: {
    name: 'Audit_Theory_BRD.docx',
    url: RFI_UPLOADS_BASE_URL + 'Audit_Theory_BRD.docx',
  },
  AuraBrd: {
    name: 'Cygnus_AURA_BRD 12 JAN 2026.docx',
    url: RFI_UPLOADS_BASE_URL + 'Cygnus_AURA_BRD 12 JAN 2026.docx',
  },
} as const;

/* ── Questionnaire (com/questionare-section) ──────────────────────────── */

/** Excel import/export layout for the questionnaire table. */
export const RFI_QUESTIONNAIRE_EXCEL = {
  /** Lower-cased header names matched on import. */
  QuestionHeader: 'questions',
  AnswerHeader: 'answers',
  DueDateHeaders: ['due date', 'duedate', 'due_date', 'due-date'] as string[],
  /** Column headers written on export. */
  ExportColumns: {
    Index: '#',
    Question: 'Questions',
    Answer: 'Answers',
    DueDate: 'Due Date',
  },
  SheetName: 'Questionnaire',
  MimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  ExportFilePrefix: 'questionnaire_',
  ExportFileExtension: '.xlsx',
} as const;

/** p-toast lifetimes (ms) on the questionnaire. */
export const RFI_QUESTIONNAIRE_TOAST_LIFE = {
  Short: 4000,
  Long: 5000,
} as const;
