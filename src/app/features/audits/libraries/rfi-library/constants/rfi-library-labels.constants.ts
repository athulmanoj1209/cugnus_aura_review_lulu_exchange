/* ── Display labels, tag severities & form options for RFI library values ─
 * Text is kept exactly as it was inline in the components.
 */

import type { RfiCategory, RfiPriority } from '../models/rfi-library-list.model';

export type RfiLibraryTagSeverity = 'success' | 'info' | 'warn' | 'danger';

/** Priority badge colour. Unknown priorities use RFI_LIBRARY_PRIORITY_DEFAULT_SEVERITY. */
export const RFI_LIBRARY_PRIORITY_SEVERITY: Record<string, RfiLibraryTagSeverity> = {
  low: 'success',
  medium: 'info',
  high: 'warn',
  critical: 'danger',
};
export const RFI_LIBRARY_PRIORITY_DEFAULT_SEVERITY: RfiLibraryTagSeverity = 'info';

export const RFI_LIBRARY_STATUS_SEVERITY: Record<string, 'success' | 'warn' | 'danger'> = {
  pending_review: 'warn',
  approved: 'success',
  rejected: 'danger',
};

export const RFI_LIBRARY_STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

/* ── Add/Edit drawer ──────────────────────────────────────────────────── */

export const RFI_LIBRARY_PRIORITY_OPTIONS: { label: string; value: RfiPriority; icon: string }[] = [
  { label: 'Low', value: 'low', icon: 'pi-arrow-down' },
  { label: 'Medium', value: 'medium', icon: 'pi-minus' },
  { label: 'High', value: 'high', icon: 'pi-arrow-up' },
  { label: 'Critical', value: 'critical', icon: 'pi-exclamation-triangle' },
];

export const RFI_LIBRARY_CATEGORY_OPTIONS: { label: string; value: RfiCategory; icon: string }[] = [
  { label: 'Evidence & Document Requests', value: 'Evidence & Document Requests', icon: 'pi-file' },
  { label: 'Process & Control Walkthroughs', value: 'Process & Control Walkthroughs', icon: 'pi-sitemap' },
  { label: 'Policy & Compliance Verification', value: 'Policy & Compliance Verification', icon: 'pi-shield' },
  { label: 'System & IT Logic Inquiries', value: 'System & IT Logic Inquiries', icon: 'pi-desktop' },
];

export const RFI_LIBRARY_DRAWER_TITLES = { add: 'Add RFI Library', edit: 'Edit RFI Library' } as const;
