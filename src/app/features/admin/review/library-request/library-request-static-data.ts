// Live data for the Library Requests page (list/library-request-list.component.ts) -- derived
// directly from the real MOCK_SCOPE_LIBRARY / MOCK_RFI_LIBRARY records
// (scope-library-static-data.ts / rfi-library-static-data.ts) instead of a separate
// hand-authored array. An item shows up here for as long as its own `status`
// field is one of the 3 approval-workflow values below; approving/rejecting
// a request writes `status` back onto that same real record, so the change
// is visible on the Audit Scope Library / RFI Management Library pages too,
// not just in this queue. `scopePayload`/`rfiPayload` carry the exact
// ScopeLibraryItem / RfiLibraryItem record, already the shape the Add Scope
// Library / Add RFI Library drawers know how to read.

import type { ScopeLibraryItem } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { RfiLibraryItem } from '@/app/features/audits/libraries/rfi-library/models/rfi-library-list.model';
import { SCOPE_LIBRARY_STATIC_COMPANIES } from '@/app/features/audits/libraries/scope-library/scope-library-static-data';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import { divisionAllowsSubDivisions } from '@/app/shared/utils/no-sub-division-message';
import type { LibRequestRecord } from './models/library-request.model';
import {
  LIB_REQUEST_DEFAULT_RISK,
  LIB_REQUEST_EMPTY_VALUE,
  LIB_REQUEST_WORKFLOW_STATUSES,
  LibRequestTypes,
} from './constants/library-request.constants';
import { LIB_REQUEST_RISK_BY_CATEGORY } from './constants/library-request-labels.constants';

const EMPTY = LIB_REQUEST_EMPTY_VALUE;

function resolveCompanyName(companyId: string): string {
  return SCOPE_LIBRARY_STATIC_COMPANIES.find(c => c.id === companyId)?.companyName ?? companyId;
}

function resolveDivisionName(companyId: string, divisionCode: string): string {
  const company = SCOPE_LIBRARY_STATIC_COMPANIES.find(c => c.id === companyId);
  return company?.divisions.find(b => b.divisionCode === divisionCode)?.divisionName ?? divisionCode;
}

/** False for items filed under a sub-division of a division that has no
 *  sub-divisions (leftover seed records) — kept out of the queue. */
function isUnderValidSubDivision(item: { company: string; division: string; subDivision: string }): boolean {
  return !item.subDivision || divisionAllowsSubDivisions(item.division, item.company);
}

/**
 * Builds the Library Requests queue by filtering the real scope-library and
 * RFI-library records for the ones currently in an approval-workflow state.
 */
export function deriveLibraryRequests(scopeLibrary: ScopeLibraryItem[], rfiLibrary: RfiLibraryItem[]): LibRequestRecord[] {
  const records: LibRequestRecord[] = [];

  for (const item of scopeLibrary) {
    if (!LIB_REQUEST_WORKFLOW_STATUSES.includes(item.status)) continue;
    if (!isUnderValidSubDivision(item)) continue;
    const parent = item.parentScopeId ? scopeLibrary.find(s => s.id === item.parentScopeId) : undefined;
    records.push({
      id: item.id,
      name: item.title,
      type: item.scopeLevel === ScopeLevels.SubScope ? LibRequestTypes.Subscope : LibRequestTypes.Scope,
      company: resolveCompanyName(item.company),
      division: resolveDivisionName(item.company, item.division),
      subDivision: item.subDivision,
      category: item.riskCategory,
      risk: LIB_REQUEST_RISK_BY_CATEGORY[item.riskCategory] ?? LIB_REQUEST_DEFAULT_RISK,
      status: item.status,
      submittedBy: item.submittedBy ?? EMPTY,
      submittedDate: item.submittedDate ?? EMPTY,
      parentEntity: parent ? `${parent.title} (${parent.id})` : (item.parentScopeTitle ? `${item.parentScopeTitle} (${item.parentScopeId})` : EMPTY),
      scopePayload: item,
    });
  }

  for (const item of rfiLibrary) {
    if (!LIB_REQUEST_WORKFLOW_STATUSES.includes(item.status)) continue;
    if (!isUnderValidSubDivision(item)) continue;
    records.push({
      id: item.id,
      name: item.title,
      type: LibRequestTypes.Rfi,
      company: resolveCompanyName(item.company),
      division: resolveDivisionName(item.company, item.division),
      subDivision: item.subDivision,
      category: item.category,
      risk: item.priority,
      status: item.status,
      submittedBy: item.submittedBy ?? EMPTY,
      submittedDate: item.submittedDate ?? EMPTY,
      parentEntity: item.scopeTitle ? `${item.scopeTitle} (${item.scopeId})` : (item.subScopeTitle ? `${item.subScopeTitle} (${item.subScopeId})` : EMPTY),
      rfiPayload: item,
    });
  }

  return records;
}
