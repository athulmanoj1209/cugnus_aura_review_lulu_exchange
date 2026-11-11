/* ── User-facing text for the reassign-auditors module ────────────────── */

import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from './reassign-auditors.constants';

export const REASSIGN_TOAST_MESSAGES = {
  Reassigned: 'Successfully reassigned task(s) ',
} as const;

export const reassignConfirmDialog = (count: number, fromAuditor: string | undefined) => ({
  title: 'Confirm Reassignments',
  message: `Apply ${count} reassignment(s) from ${fromAuditor}? Affected auditors will be notified.`,
  action: 'approve' as const,
  confirmLabel: 'Yes, Apply',
});

export const REASSIGN_PLACEHOLDERS = {
  Auditor: 'Select an auditor…',
  SearchAuditor: 'Search auditor…',
  Search: 'Search…',
  SearchWorkload: 'Search scope or job…',
  BulkTarget: 'Reassign to…',
  BulkFrom: 'From *',
  BulkTo: 'To *',
  PickTarget: 'Choose auditor…',
  PickDate: 'Select date & time',
  Reason: 'Add a reason for all (optional)',
} as const;

export const REASSIGN_PICKER_HINTS = {
  Required: 'Auditor and full period (from & to) are required',
} as const;

export const stagedHint = (count: number): string =>
  `Staged ${count > 1 ? count + ' jobs' : 'this job'} · applied on Confirm`;

export const APPLYING_LABEL = 'Applying…';

export const confirmReassignmentsLabel = (count: number): string =>
  `Confirm reassignment${count === 1 ? '' : 's'}`;

export const SOME_JOBS_STAGED = 'Some jobs staged';

/** Shown when a staged date is open-ended. */
export const OPEN_DATE_LABEL = '—';

/** Fallback names for seed records missing one. */
export const companyFallbackName = (id: number): string => `Company ${id}`;
export const divisionFallbackName = (id: number): string => `Division ${id}`;
export const subDivisionFallbackName = (divisionCode: string): string => `Sub-division (${divisionCode})`;

/** Audit-firm mock job name: `<scope> – <sub-division>`. */
export const mockJobName = (scopeLabel: string, subDivisionName: string): string => `${scopeLabel} – ${subDivisionName}`;

/** Internal-audit job name suffix for a frequency occurrence, e.g. " – Q2". */
export const jobOccurrenceSuffix = (label: string): string => ` – ${label}`;

/**
 * Compact period label, e.g. "1d 22h" or "3h 30m" — minutes only for
 * sub-day spans; "0h" when the span is empty or negative.
 */
export function formatDurationShort(ms: number | null): string {
  if (ms == null || ms <= 0) return '0h';
  const d = Math.floor(ms / MS_PER_DAY);
  const h = Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR);
  const m = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m && !d) parts.push(`${m}m`);
  return parts.length ? parts.join(' ') : '0h';
}
