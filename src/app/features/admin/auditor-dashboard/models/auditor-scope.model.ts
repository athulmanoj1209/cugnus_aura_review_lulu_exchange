import type { ScopeStatus } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';

export interface ScopeSummaryCard {
  label: string;
  value: string;
  icon: string;
  cardClass: string;
  /** Exact ScopeStatus to filter by when clicked; omitted for the "Total Scopes" card. */
  status?: ScopeStatus;
}
