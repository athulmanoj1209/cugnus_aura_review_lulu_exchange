import type { DivisionType } from '@/app/features/audits/organization/divisions/models/division-static-data.model';
import type {
  SubDivisionStatuses,
  SubDivisionAuditStatuses,
  SubDivisionRiskRatings,
  SubDivisionRiskStatuses,
  SubDivisionCompanyIndustries,
} from '../constants/sub-division.constants';

/** Minimal company display fields, supplied by the caller (which has access to
 *  `CompanyDataService`) so a company that exists there but has never had a
 *  sub-division added yet can get a fresh wrapper here instead of silently
 *  dropping the sub-division. */
export interface CompanyMeta {
  companyName: string;
  tag?: string;
  color?: string;
  industry?: string;
}

export type SubDivisionStatus = typeof SubDivisionStatuses[keyof typeof SubDivisionStatuses];
// The sub-division's own approval-workflow status, kept separate from its
// active/inactive lifecycle `status` — mirrors division-static-data.ts's
// `AuditStatus` split (see `StaticDivision.auditStatus`).
export type SubDivisionAuditStatus = typeof SubDivisionAuditStatuses[keyof typeof SubDivisionAuditStatuses];
export type RiskRating = typeof SubDivisionRiskRatings[keyof typeof SubDivisionRiskRatings];
export type RiskStatus = typeof SubDivisionRiskStatuses[keyof typeof SubDivisionRiskStatuses];
export type CompanyIndustry = typeof SubDivisionCompanyIndustries[keyof typeof SubDivisionCompanyIndustries];
export type ScopeType = 'subDivisional' | 'functional' | 'independent';
export type AuditFrequency = 'quarterly' | 'annually' | 'monthly';
export type SubDivisionType =
  | 'finance' | 'human-resources' | 'information-technology' | 'operations'
  | 'legal-compliance' | 'internal-audit' | 'risk-management' | 'marketing-communications'
  | 'procurement-supply-chain' | 'customer-service' | 'executive-management' | 'administration' | 'consumer-protection' | 'compliance' | 'Not Applicable'  ;

export interface StaticSubScope {
  subScopeName: string;
  subScopeType: string;
  auditFrequency: AuditFrequency;
  riskRating: RiskRating;
}

export interface StaticScope {
  scopeName: string;
  scopeType: ScopeType;
  auditFrequency: AuditFrequency;
  riskRating: RiskRating;
  subScopes?: StaticSubScope[];
}

export interface StaticSubDivision {
  subDivisionCode: string;
  subDivisionName: string;
  subDivisionType: DivisionType;
  /** Only set when `subDivisionType` is 'department' — same rule as the division form. */
  departmentType: SubDivisionType | null;
  company: string;
  status: SubDivisionStatus;
  auditStatus: SubDivisionAuditStatus;
  submittedBy?: string;
  submittedDate?: string;
  dueDate?: string | null;
  riskRating: RiskRating;
  riskStatus: RiskStatus;
  primaryContactPerson: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  subDivisionHead: string | null;
  numberOfEmployees: number | null;
  operationalSince: string | null;
  parentSubDivisions: string[];
  scopes?: StaticScope[];
  /** ISO timestamp — drives the list's newest-first sort. Stamped by `upsertStaticSubDivision`. */
  createdAt: string;
}

export interface StaticDivision {
  divisionCode: string;
  divisionName: string;
  hasSubDivision: boolean;
  subDivisions: StaticSubDivision[];
  /** Division-level scopes — only for divisions with no sub-divisions (`hasSubDivision: false`). */
  scopes?: StaticScope[];
}

export interface StaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  industry: CompanyIndustry;
  divisions: StaticDivision[];
}

/** The subset of `StaticSubDivision` fields the Add/Edit SubDivision form actually edits. */
export type SubDivisionEditableFields = Pick<
  StaticSubDivision,
  | 'subDivisionCode' | 'subDivisionName' | 'subDivisionType' | 'departmentType' | 'company' | 'status'
  | 'submittedBy' | 'submittedDate' | 'dueDate'
  | 'riskRating' | 'riskStatus' | 'primaryContactPerson' | 'contactEmail' | 'contactPhone'
  | 'description' | 'subDivisionHead' | 'numberOfEmployees' | 'operationalSince'
> & { divisionCode: string };
