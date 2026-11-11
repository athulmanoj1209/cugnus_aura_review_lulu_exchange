import type { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import type {
  ScopeLibraryFrameworks,
  ScopeLibraryRiskCategories,
  ScopeLibraryStatuses,
} from '../constants/scope-library.constants';

export type RiskCategory = typeof ScopeLibraryRiskCategories[keyof typeof ScopeLibraryRiskCategories];

export type Framework = typeof ScopeLibraryFrameworks[keyof typeof ScopeLibraryFrameworks];
export type ScopeLevel = typeof ScopeLevels[keyof typeof ScopeLevels];
export type ScopeLibraryStatus = typeof ScopeLibraryStatuses[keyof typeof ScopeLibraryStatuses];

export interface ScopeLibraryItem {
  id: string;
  /** Company id, division code, and sub-division name — same values used by
   * audit-scope-static-data.ts's company → division → sub-division cascade. */
  company: string;
  division: string;
  subDivision: string;
  /** Stamped on add/edit: true when filed under a sub-division, false when directly under the division. */
  hasSubDivision?: boolean;
  title: string;
  objective: string;
  scopeLevel: ScopeLevel;
  parentScopeId?: string;
  parentScopeTitle?: string;
  subScopes?: { id: string; title: string }[];
  riskCategory: RiskCategory;
  applicableFrameworks: Framework[];
  status: ScopeLibraryStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;
  createdAt: string;
}
