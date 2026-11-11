/* ── Value sets ───────────────────────────────────────────────────────────
 * RFI statuses / record statuses / upload rules / reference docs are owned by
 * the RFI module — import them from
 * '@/app/features/audits/audit-execution/rfi/constants/rfi.constants'.
 */

/** Admin (CFO, pooled) vs Sub-Division Head role switch on the client RFI list. */
export const RfiClientUserRoles = {
  SubDivision: 'subDivision',
  Cfo: 'cfo',
} as const;
export type RfiClientUserRole = typeof RfiClientUserRoles[keyof typeof RfiClientUserRoles];

/** Which head the client page is simulating — a whole division or a single sub-division. */
export const RfiClientHeadKinds = {
  Division: 'division',
  SubDivision: 'subDivision',
} as const;
export type RfiClientHeadKind = typeof RfiClientHeadKinds[keyof typeof RfiClientHeadKinds];

/** Grid / list toggle on the client RFI listing page. */
export const RfiClientViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type RfiClientViewMode = typeof RfiClientViewModes[keyof typeof RfiClientViewModes];

/** State of the Response tab on the client RFI drawer. */
export const RfiClientResponseModes = {
  View: 'view',
  Edit: 'edit',
  New: 'new',
  Resubmit: 'resubmit',
} as const;
export type RfiClientResponseMode = typeof RfiClientResponseModes[keyof typeof RfiClientResponseModes];

/**
 * Client-only status value handled by the drawer's badge helpers. Not part of
 * RfiStatuses — no RFI currently carries it.
 */
export const RFI_CLIENT_IN_PROGRESS_STATUS = 'in-progress';

/* ── Listing deep-link query params ───────────────────────────────────── */

export const RFI_CLIENT_LIST_QUERY_PARAMS = {
  Role: 'role',
  SubDivision: 'sub-division',
  Division: 'division',
  Status: 'status',
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const RFI_CLIENT_DRAWER = {
  Width: '850px',
  StyleClass: 'rfi-client-drawer rounded-tl-[35px] rounded-bl-[35px]',
  /** Panel the resize handle resizes. */
  PanelSelector: '.rfi-client-drawer',
} as const;

export const RFI_CLIENT_LIST_PAGE_SIZE = 6;

/** Tabs of the client RFI drawer. */
export const RFI_CLIENT_TABS = {
  ViewRfi: 0,
  Response: 1,
  Questionnaire: 2,
  ResponseHistory: 3,
} as const;
