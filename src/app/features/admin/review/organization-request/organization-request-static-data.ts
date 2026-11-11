// Live data for the Organization Requests page (list/organization-request-list.component.ts) --
// derived directly from the real Company / Division / Sub-Division records
// (company-static-data.ts via CompanyDataService, division-static-data.ts,
// sub-division-static-data.ts) instead of a separate hand-authored array.
// A record shows up here for as long as its own approval-workflow status
// field (orgStatus / auditStatus / status) is one of the 3 workflow values
// below; approving/rejecting a request writes the status back onto that
// same real record, so the change is visible everywhere the record is
// shown, not just in this queue.

import type { Company } from '@/app/features/audits/organization/company/models/company.model';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { divisionAllowsSubDivisions } from '@/app/shared/utils/no-sub-division-message';
import type { OrgRequestRecord, OrgRequestStatus, RiskLevel } from './models/organization-request.model';
import {
  ORG_REQUEST_DEFAULT_RISK,
  ORG_REQUEST_EMPTY_VALUE,
  ORG_REQUEST_WORKFLOW_STATUSES,
  OrgRequestTypes,
} from './constants/organization-request.constants';

const WORKFLOW_STATUSES = new Set<string>(ORG_REQUEST_WORKFLOW_STATUSES);
const EMPTY = ORG_REQUEST_EMPTY_VALUE;

/**
 * Builds the Organization Requests queue by filtering the real company/
 * division/sub-division records for the ones currently in an approval-workflow
 * state. `companies` is passed in (rather than imported directly) because
 * CompanyDataService holds the live, edited copies — the seed array never
 * changes in place.
 */
export function deriveOrganizationRequests(companies: Company[]): OrgRequestRecord[] {
  const records: OrgRequestRecord[] = [];

  for (const company of companies) {
    if (!company.orgStatus || !WORKFLOW_STATUSES.has(company.orgStatus)) continue;
    records.push({
      id: company.id,
      name: company.companyName,
      type: OrgRequestTypes.Company,
      company: company.companyName,
      division: EMPTY,
      subDivision: EMPTY,
      risk: (company.riskRating as RiskLevel) ?? ORG_REQUEST_DEFAULT_RISK,
      status: company.orgStatus,
      submittedBy: company.submittedBy ?? EMPTY,
      submittedDate: company.submittedDate ?? EMPTY,
      location: [company.city, company.countryOfIncorporation].filter(Boolean).join(', ') || EMPTY,
      parentEntity: EMPTY,
      companyPayload: { ...company } as unknown as Record<string, unknown>,
    });
  }

  for (const company of DIVISION_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      if (!WORKFLOW_STATUSES.has(division.auditStatus)) continue;
      records.push({
        id: division.divisionCode,
        name: division.divisionName,
        type: OrgRequestTypes.Division,
        company: company.companyName,
        division: division.divisionName,
        subDivision: EMPTY,
        risk: division.riskRating,
        status: division.auditStatus as OrgRequestStatus,
        submittedBy: division.submittedBy ?? EMPTY,
        submittedDate: division.submittedDate ?? EMPTY,
        location: `${division.city}, ${division.country}`,
        parentEntity: company.companyName,
        divisionPayload: { ...division } as unknown as Record<string, unknown>,
      });
    }
  }

  for (const company of SUB_DIVISION_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      // Skip leftover sub-division records under a division that has no sub-divisions.
      if (!divisionAllowsSubDivisions(division.divisionCode, company.id)) continue;
      for (const dept of division.subDivisions) {
        if (!WORKFLOW_STATUSES.has(dept.auditStatus)) continue;
        records.push({
          id: dept.subDivisionCode,
          name: dept.subDivisionName,
          type: OrgRequestTypes.SubDivision,
          company: company.companyName,
          division: division.divisionName,
          subDivision: dept.subDivisionName,
          risk: dept.riskRating,
          status: dept.auditStatus as OrgRequestStatus,
          submittedBy: dept.submittedBy ?? EMPTY,
          submittedDate: dept.submittedDate ?? EMPTY,
          location: division.divisionName,
          parentEntity: `${division.divisionName} (${dept.subDivisionCode})`,
          subDivisionPayload: { ...dept, divisionCode: division.divisionCode } as unknown as Record<string, unknown>,
        });
      }
    }
  }

  return records;
}
