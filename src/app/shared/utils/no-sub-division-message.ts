import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';

/**
 * Message for a disabled Sub-Division filter: returns a label when divisions
 * are selected and none of them has sub-divisions (live `hasSubDivision` from
 * division-static-data.ts), otherwise null. Selected values may be division
 * codes or division names, since filter pages key divisions by either.
 */
export function noSubDivisionMessage(selectedDivisions: string[] | null | undefined): string | null {
  if (!selectedDivisions?.length) return null;
  const matched = DIVISION_STATIC_COMPANIES
    .flatMap(c => c.divisions)
    .filter(b => selectedDivisions.includes(b.divisionCode) || selectedDivisions.includes(b.divisionName));
  if (!matched.length || matched.some(b => b.hasSubDivision)) return null;
  return selectedDivisions.length === 1
    ? `${matched[0].divisionName} has no sub-divisions`
    : 'Selected divisions have no sub-divisions';
}

/** Display labels for a scope's company / division / sub-division. */
export interface ScopeOrgLabels {
  companyName: string;
  divisionName: string;
  /** The scope's sub-division — or 'Not Applicable' when the parent division has no sub-divisions
   *  (`hasSubDivision: false`) or the scope sits directly under the division. */
  subDivisionName: string;
  /** True when `subDivisionName` is a real sub-division (sub-division-level record). */
  hasSubDivision: boolean;
}

/**
 * Resolves a scope's company / division / sub-division labels from the live division
 * data (division-static-data.ts), falling back to the raw ids when not found.
 */
export function resolveScopeOrgLabels(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
  subDivisionName: string | null | undefined,
): ScopeOrgLabels {
  const company = DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  const division = company?.divisions.find(b => b.divisionCode === divisionCode)
    ?? DIVISION_STATIC_COMPANIES.flatMap(c => c.divisions).find(b => b.divisionCode === divisionCode);
  const allowsSub = division ? division.hasSubDivision : true;
  const hasSubDivision = allowsSub && !!subDivisionName;
  return {
    companyName: company?.companyName ?? companyId ?? '—',
    divisionName: division?.divisionName ?? divisionCode ?? '—',
    subDivisionName: hasSubDivision ? subDivisionName! : 'Not Applicable',
    hasSubDivision,
  };
}

/**
 * False when the live division (division-static-data.ts) has `hasSubDivision: false`,
 * so sub-division records still left under it in other seeds (scopes, RFIs, library
 * items) should be ignored. Unknown divisions return true (nothing to hide).
 * `division` may be a division code or name; `companyId` narrows the match when given.
 */
export function divisionAllowsSubDivisions(division: string, companyId?: string): boolean {
  const match = DIVISION_STATIC_COMPANIES
    .filter(c => !companyId || c.id === companyId)
    .flatMap(c => c.divisions)
    .find(b => b.divisionCode === division || b.divisionName === division);
  return match ? match.hasSubDivision : true;
}
