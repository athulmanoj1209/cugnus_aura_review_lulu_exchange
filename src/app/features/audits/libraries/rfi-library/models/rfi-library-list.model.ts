import type { RfiLibraryCategories, RfiLibraryPriorities, RfiLibraryStatuses } from '../constants/rfi-library.constants';

export type RfiPriority = typeof RfiLibraryPriorities[keyof typeof RfiLibraryPriorities];

export type RfiLibraryStatus = typeof RfiLibraryStatuses[keyof typeof RfiLibraryStatuses];

export type RfiCategory = typeof RfiLibraryCategories[keyof typeof RfiLibraryCategories];

export interface RfiLibraryItem {
  id: string;
  /** Company id, division code, and sub-division name — same values used by
   * audit-scope-static-data.ts's company → division → sub-division cascade. */
  company: string;
  division: string;
  subDivision: string;
  /** Stamped on add/edit: true when filed under a sub-division, false when directly under the division. */
  hasSubDivision?: boolean;
  title: string;
  description: string;
  category: RfiCategory;
  priority: RfiPriority;
  tags: string[];
  questions?: string[];
  scopeId?: string | null;
  scopeTitle?: string;
  subScopeId?: string;
  subScopeTitle?: string;
  status: RfiLibraryStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;
  createdAt: string;
}
