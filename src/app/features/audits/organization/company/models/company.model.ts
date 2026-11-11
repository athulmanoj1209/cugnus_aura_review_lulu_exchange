/**
 * Shared company data model — the single shape for company records across
 * the app. Anything that needs company data should inject
 * `CompanyDataService` (see company-data.service.ts) rather than importing
 * a local copy, so every screen reads and writes the same in-memory store.
 */

import type { CompanyOrgStatuses, CompanyRiskRatings } from '../constants/company.constants';

export type RiskRating = typeof CompanyRiskRatings[keyof typeof CompanyRiskRatings];

export type OrgStatus = typeof CompanyOrgStatuses[keyof typeof CompanyOrgStatuses];

/**
 * A company record.
 *
 * `id`, `companyName`, `tag`, `color`, `industry` come straight from the
 * seed data. Everything below that block is optional — it's only
 * populated once a company has been through the Add/Edit Company form
 * (see AddCompanyModalComponent's `CompanyFormModel`). Existing consumers
 * (e.g. the profile drawer mapping in CompaniesListComponent) keep
 * compiling and simply see `undefined` for these until then.
 */
export interface Company {
  id: string;
  companyName: string;
  tag?: string;
  color?: string;
  industry?: string;

  /** List-view state (block/unblock), kept on the shared record so it's
   *  visible to every component reading from the store, not just the
   *  list page. */
  blocked?: boolean;

  /** Approval workflow state for the company's profile submission. */
  orgStatus?: OrgStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;

  // ---- Extended profile fields (from the Add/Edit Company form) --------
  // Types below are inferred from AddCompanyModalComponent's template
  // (p-datepicker -> Date | null, p-inputNumber -> number | null,
  // p-select/pInputText -> string) plus the one field we've confirmed
  // directly from a compiler error against the real CompanyFormModel
  // (residualRiskScore: number | null). If you still see TS2322s after
  // this, the real CompanyFormModel disagrees with one of these guesses —
  // share that interface and I'll align exactly instead of guessing.
  typeOfEntity?: string;
  industrySector?: string;
  ownershipType?: string;
  countryOfIncorporation?: string;
  regionEmirate?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  tradeLegalRegNumber?: string;
  dateOfIncorporation?: Date | null;
  parentCompany?: string;
  groupAffiliation?: string;
  notes?: string;
  isRegulated?: boolean;
  regIndustry?: string;
  regulatoryLicenseNumber?: string;
  licenseExpiryDate?: Date | null;
  regulatoryNotes?: string;
  currencyAccount?: string;
  annualTurnoverBracket?: string;
  numberOfEmployees?: number | null;
  numberOfSubDivisionsLocations?: number | null;
  fiscalYearStart?: string;
  treasuryFunctionsPresent?: boolean;
  cashHandlingInvolved?: boolean;
  riskRating?: RiskRating | string;
  riskOwner?: string;
  lastAuditDate?: Date | null;
  nextPlannedAuditCycle?: string;
  residualRiskScore?: number | null;
  riskNotes?: string;
}