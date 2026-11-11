/* ── Display labels, tag severities & form options for RFI values ────────
 * Text is kept exactly as it was inline in the components.
 */

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

/* ── Workflow status ──────────────────────────────────────────────────── */

export const RFI_STATUS_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'Pending',      value: 'pending' },
  { label: 'Overdue',      value: 'overdue' },
  { label: 'Under Review', value: 'under-review' },
  { label: 'Completed',    value: 'completed' },
  { label: 'Reopened',     value: 'reopened' },
];

/** Status badge colour. Anything not listed (Pending) uses RFI_STATUS_DEFAULT_SEVERITY. */
export const RFI_STATUS_SEVERITY: Record<string, TagSeverity> = {
  'completed': 'success',
  'under-review': 'secondary',
  'overdue': 'danger',
  'reopened': 'danger',
};
export const RFI_STATUS_DEFAULT_SEVERITY: TagSeverity = 'warn';

/** Status badge text. Anything not listed uses RFI_STATUS_DEFAULT_LABEL. */
export const RFI_STATUS_LABELS: Record<string, string> = {
  'completed': 'Completed',
  'under-review': 'Under Review',
  'overdue': 'Overdue',
  'reopened': 'Reopened',
};
export const RFI_STATUS_DEFAULT_LABEL = 'Pending';

/* ── Client response status ───────────────────────────────────────────── */

/** Response badge colour. Anything not listed (pending) uses RFI_RESPONSE_STATUS_DEFAULT_SEVERITY. */
export const RFI_RESPONSE_STATUS_SEVERITY: Record<string, TagSeverity> = {
  accepted: 'success',
  rejected: 'danger',
};
export const RFI_RESPONSE_STATUS_DEFAULT_SEVERITY: TagSeverity = 'info';

export const RFI_RESPONSE_STATUS_LABELS: Record<string, string> = {
  accepted: 'Accepted',
  rejected: 'Rejected',
};
export const RFI_RESPONSE_STATUS_DEFAULT_LABEL = 'Pending Review';

/* ── Listing KPI cards ────────────────────────────────────────────────── */

export const RFI_KPI_CARDS = {
  Total:       { label: 'Total RFIs',   icon: 'pi pi-folder-open',        accent: '' },
  Pending:     { label: 'Pending',      icon: 'pi pi-clock',              accent: 'warning' },
  Overdue:     { label: 'Overdue',      icon: 'pi pi-exclamation-circle', accent: 'danger' },
  UnderReview: { label: 'Under Review', icon: 'pi pi-eye',                accent: 'muted' },
  Completed:   { label: 'Completed',    icon: 'pi pi-check-circle',       accent: 'success' },
  Reopened:    { label: 'Reopened',     icon: 'pi pi-refresh',            accent: 'warning' },
} as const;

/* ── Add RFI form ─────────────────────────────────────────────────────── */

export const RFI_SOURCE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Create New RFI', value: 'fresh' },
  { label: 'From RFI Library', value: 'library' },
];

/** Mock RFI owner list — replace with the real client users when wired up. */
export const RFI_OWNER_OPTIONS: { label: string; value: string }[] = [
  { label: 'John Mathew', value: 'john-mathew' },
  { label: 'Akhil Raj', value: 'akhil-raj' },
  { label: 'Sneha Nair', value: 'sneha-nair' },
  { label: 'Fathima Noor', value: 'fathima-noor' },
];

/** Label of the first tab on each drawer. */
export const RFI_TAB_LABELS = {
  Add: 'New RFI',
  View: 'View RFI',
} as const;
export const RFI_REFERENCE_DOC_DESCRIPTIONS = { AuditTheory: 'Business Requirements Document detailing audit theory and engagement methodology', AuraBrd: 'Cygnus AURA platform Business Requirements Document — January 2026 release baseline' } as const;
export const RFI_FILTER_CHIP_LABELS = { companies: 'Company', divisions: 'Division', subDivisions: 'Dept', scopes: 'Scope', subScopes: 'Sub-Scope', owners: 'Owner', statuses: 'Status' } as const;
