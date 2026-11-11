import type {
  ScopeTypes,
  ScopeAuditFrequencies,
  ScopeModesOfAudit,
  ScopeSamplingMethodologies,
  ScopeRiskRatings,
  ScopeRecordStatuses,
  ScopeWorkflowStatuses,
  ScopeTaskStatuses,
} from '../constants/scope.constants';

/** Minimal company display fields, supplied by the caller (which has access to
 *  `CompanyDataService`) so a company that exists there but has never had a
 *  scope added yet can get a fresh wrapper here instead of silently dropping
 *  the scope. */
export interface CompanyMeta {
  companyName: string;
  tag?: string;
  color?: string;
}

export type ScopeType = typeof ScopeTypes[keyof typeof ScopeTypes];
export type AuditFrequency = typeof ScopeAuditFrequencies[keyof typeof ScopeAuditFrequencies];
export type ModeOfAudit = typeof ScopeModesOfAudit[keyof typeof ScopeModesOfAudit];
export type SamplingMethodology = typeof ScopeSamplingMethodologies[keyof typeof ScopeSamplingMethodologies];
export type ScopeRiskRating = typeof ScopeRiskRatings[keyof typeof ScopeRiskRatings];
/** Drives the Activate/Deactivate action — independent of `workflowStatus` below. */
export type ScopeRecordStatus = typeof ScopeRecordStatuses[keyof typeof ScopeRecordStatuses];
/** Drives the list's status badge (Not Started/Planned/In Progress/Overdue/Completed). */
export type ScopeStatus = typeof ScopeWorkflowStatuses[keyof typeof ScopeWorkflowStatuses];
/** Drives a task's status badge in the Sub-Scope profile drawer / scope-task list. */
export type TaskStatus = typeof ScopeTaskStatuses[keyof typeof ScopeTaskStatuses];

/**
 * A task associated with a scope or sub-scope (`StaticScope.tasks`) — the shape
 * mirrors `scope-task.component.ts`'s task form value (plus `id`/`status`, which that
 * form doesn't manage as form controls the same way) so tasks round-trip
 * losslessly between the static data and the Add/Edit Audit Scope drawer's
 * Tasks tab.
 */
export interface ScopeTask {
  id: string;
  taskName: string;
  status: TaskStatus;
  objective?: string;
  checklistItems?: string[];
  assignedAuditor?: string;
  startDate?: string;
  endDate?: string;
  controlRating?: string;
  riskPriority?: string;
  tags?: string[];
  description?: string;
}

export interface StaticScope {
  id: string;
  company: string;
  divisionCode: string;
  /** null for a division-level scope (one that sits directly under its division, not under a sub-division). */
  subDivisionName: string | null;
  /**
   * Stamped on add/edit: true when filed under a sub-division, false when filed
   * directly under the division. Absent on seed records (placement decides).
   */
  hasSubDivision?: boolean;
  /**
   * Division-level scopes: the `subDivisionCode`s (sub-division-static-data.ts)
   * of the division's sub-divisions, linking the scope to them.
   * Sub-division scopes: null — their sub-division is `subDivisionName`.
   */
  subDivisionsInfo: string[] | null;
  /** null = top-level scope; set = sub-scope of the scope with this id. */
  parentScopeId: string | null;
  /** `AuditPlan.id` (audit-plan-data.ts) the scope belongs to — its period bounds the scope's start/end dates. Absent on seed records. */
  auditPlanId?: string | null;
  scopeName: string;
  scopeType: ScopeType;
  linkedSubDivisions: string[];
  auditFrequency: AuditFrequency;
  modeOfAudit: ModeOfAudit;
  samplingMethodology: SamplingMethodology;
  samplingSize: number;
  startDate: string;
  endDate: string;
  assignedAuditors: string[];
  assignedReviewers: string[];
  objective?: string;
  justificationForSampling?: string;
  estimatedHours?: number | null;
  hourlyRate?: number | null;
  riskReferenceId?: string;
  riskRating?: ScopeRiskRating | null;
  completionNote?: string;
  status: ScopeRecordStatus;
  workflowStatus?: ScopeStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;
  /** ISO timestamp — drives the list's newest-first sort. Stamped by `upsertStaticScope`. */
  createdAt: string;
  tasks?: ScopeTask[];
}

export interface StaticSubDivision {
  subDivisionName: string;
  company: string;
  divisionCode: string;
  scopes: StaticScope[];
}

export interface StaticDivision {
  divisionCode: string;
  divisionName: string;
  /** Mirrors the division module's `hasSubDivision` (division-static-data.ts). */
  hasSubDivision: boolean;
  company: string;
  /** Division-level scopes/sub-scopes (`subDivisionName: null`) — same flat parent/child layout as a sub-division's `scopes`. */
  scopes: StaticScope[];
  subDivisions: StaticSubDivision[];
}

export interface StaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  divisions: StaticDivision[];
}

/* Seed-row shapes used by audit-scope-static-xyz-org.data.ts to build the
 * XYZ Broadcast scope records. */

export interface XyzTaskSeed {
  taskName: string;
  description: string;
}

export interface XyzSubScopeSeed {
  name: string;
  objective: string;
  tasks?: XyzTaskSeed[];
  workflowStatus?: ScopeStatus;
}

export interface XyzScopeSubDivisionSeed {
  code: string;
  name: string;
  riskRating: 'high' | 'medium';
  auditFrequency: 'monthly' | 'quarterly';
  scopeName: string;
  workflowStatus: ScopeStatus;
  subScopes: XyzSubScopeSeed[];
}
