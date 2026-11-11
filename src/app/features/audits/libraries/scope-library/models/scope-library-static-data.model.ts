import type { RiskCategory, Framework } from './scope-library-list.model';

export interface ScopeLibraryStaticDivision {
  divisionCode: string;
  divisionName: string;
  /** Mirrors the division module's `hasSubDivision` (division-static-data.ts). */
  hasSubDivision?: boolean;
  subDivisions: string[];
}

export interface ScopeLibraryStaticCompany {
  id: string;
  companyName: string;
  divisions: ScopeLibraryStaticDivision[];
}

/* Seed-row shapes used by scope-library-static-xyz-org.data.ts to build the
 * XYZ Broadcast scope library items. */

export interface XyzLibrarySubScopeSeed { name: string; objective: string; }

export interface XyzLibrarySubDivisionSeed {
  subDivision: string;
  scopeTitle: string;
  riskCategory: RiskCategory;
  frameworks: Framework[];
  subScopes: XyzLibrarySubScopeSeed[];
}
