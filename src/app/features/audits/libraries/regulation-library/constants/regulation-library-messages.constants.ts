/* ── User-facing text for the regulation library module ───────────────── */

export const REGULATION_TOAST_MESSAGES = {
  Created: 'New regulation has been successfully added.',
  Updated: ' Regulation details have been successfully updated.',
} as const;

/** PrimeNG confirm dialog shown when activating / deactivating a regulation. */
export const regulationActiveConfirmDialog = (activating: boolean, reference: string) => ({
  message: `Are you sure you want to <strong>${activating ? 'activate' : 'deactivate'} ${reference}</strong>?`,
  header: 'Confirmation',
  icon: 'pi pi-exclamation-triangle',
  acceptLabel: activating ? '✓ Yes, Activate' : '✓ Yes, Deactivate',
  rejectLabel: '✕ No',
  acceptButtonStyleClass: activating
    ? 'confirm-btn confirm-btn--accept confirm-btn--success'
    : 'confirm-btn confirm-btn--accept confirm-btn--danger',
  rejectButtonStyleClass: 'confirm-btn confirm-btn--reject',
});

/** Activate / deactivate tooltips on the list and grid. */
export const REGULATION_ACTIVE_LABELS = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;

export const filtersButtonLabel = (count: number): string => (count > 0 ? `Filters (${count})` : 'Filters');

export const linkedItemsTooltip = (count: number): string => `${count} linked item(s)`;

export const REGULATION_SUB_DIVISION_FILTER_PLACEHOLDERS = {
  All: 'All Sub-Divisions',
  None: 'No sub-divisions for this division',
} as const;

export const REGULATION_FORM_PLACEHOLDERS = {
  Division: 'Select division',
  CompanyFirst: 'Select a company first',
  SubDivision: 'Select sub-division',
  DivisionFirst: 'Select a division first',
  NoSubDivisions: 'No sub-divisions for this division',
} as const;

/** Validation messages of the Add / Edit drawer (errorMsg()). */
export const REGULATION_FORM_ERRORS = {
  Required: 'This field is required.',
  Pattern: 'Use letters, numbers, / - and . (e.g. CBUAE/BSD/2022/001).',
  Invalid: 'Invalid value.',
  TagsRequired: 'At least one tag is required.',
} as const;

export const minLengthMessage = (length: number): string => `Minimum ${length} characters.`;

export const fileTooLargeMessage = (maxMB: number): string => `File exceeds ${maxMB} MB limit.`;

export const fileSizeLabel = (value: number, unit: 'KB' | 'MB'): string => `${value.toFixed(1)} ${unit}`;

/** Detail page placeholders. */
export const REGULATION_NOT_AVAILABLE = 'N/A';
export const REGULATION_FALLBACK_TITLE = 'Regulation Details';
