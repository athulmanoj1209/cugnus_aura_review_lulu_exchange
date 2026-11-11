import type { ScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import type { ScopeStatus } from './scope-static-data.model';
import type { ScopeLevel } from '../constants/scope.constants';

export interface EnrichedScope {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  timePeriod: string;
  auditors: string;
  /** Individual auditor names, used by the auditor filter. */
  auditorNames: string[];
  /** Individual auditor ids, used when deep-linking by auditor id. */
  auditorIds?: string[];
  /** Individual reviewer ids — a deep-linked auditorId also matches here ("assigned auditors or reviewers"). */
  reviewerIds?: string[];
  budget: string;
  model: string;
  subScopeCount?: number;
  rfiCount?: number;
  company: string;
  divisionCode: string;
  divisionName: string;
  /** null for a division-level scope. */
  subDivisionName: string | null;
  /** Company / division / sub-division display labels (sub-division '—' when n/a). */
  org: ScopeOrgLabels;
  scopeLevel: ScopeLevel;
  parentScopeName?: string;
  /** Title / period of the audit plan (audit-plan-data.ts) the scope belongs to — unset when it has none. */
  auditPlanName?: string;
  auditPlanPeriod?: string;
  /* Used by the "High-Risk / Not Started" quick filter (from the dashboard card). */
  riskRating?: 'Critical' | 'High' | 'Medium' | 'Low';
  started?: boolean;
  status?: ScopeStatus;
  /** ISO timestamp — the list is sorted newest-first by this field. */
  createdAt: string;
}

export interface AuditorScopeRow {
  scope: string;
  audit: string;
  parentScopeName?: string;
  priority: string;
  status: ScopeStatus;
  progress: number;
  dueDate: string;
  scopeLevel: ScopeLevel;
}
