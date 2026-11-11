export type ScopeType = 'subDivisional' | 'functional' | 'independent';
export type AuditFrequency = 'quarterly' | 'annually' | 'monthly';
export type ModeOfAudit = 'full' | 'limited' | 'thematic' | 'follow-up' | 'continuous';
export type SamplingMethodology = 'random' | 'risk-based' | 'judgmental';
export type ScopeRiskRating = 'low' | 'medium' | 'high';
/** Drives the Activate/Deactivate action — independent of `workflowStatus` below. */
export type ScopeRecordStatus = 'active' | 'inactive';
/** Drives the list's status badge (Not Started/Planned/In Progress/Overdue/Completed). */
export type ScopeStatus = 'Not Started' | 'Planned' | 'In Progress' | 'Overdue' | 'Completed';
/** Drives a task's status badge. */
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';

export type DivisionStatus = 'active' | 'inactive';
export type DivisionType =
  | 'head_office' | 'division' | 'representative_office'
  | 'warehouse' | 'factory' | 'project_office' | 'subsidiary';
export type DivisionCountry = 'ae' | 'sa' | 'bh' | 'kw';
export type DivisionEmirateState =
  | 'dubai' | 'abudhabi' | 'sharjah' | 'fujairah' | 'rak' | 'ajman' | 'ummalquwain' | 'khorfakkan'
  | 'riyadh' | 'makkah' | 'eastern' | 'tabuk' | 'madinah'
  | 'capital' | 'southern' | 'muharraq' | 'central' | 'northern'
  | 'hawalli' | 'jahra' | 'ahmadi' | 'farwaniya' | 'mubarak';
export type RiskRating = 'low' | 'medium' | 'high';
export type RiskStatus = 'open' | 'monitored' | 'closed';
export type AuditStatus = 'not_planned' | 'planned' | 'in_progress' | 'completed';
export type SectorActivity =
  | 'professional_services' | 'financial_services' | 'retail' | 'manufacturing'
  | 'technology' | 'healthcare' | 'construction' | 'real_estate';
export type CompanyIndustry = 'jewelry' | 'other';
export type CompanyRecordStatus = 'active' | 'inactive';
export type SubDivisionStatus = 'active' | 'inactive' | 'archived' | 'pending';
export type SubDivisionType =
  | 'finance' | 'human-resources' | 'information-technology' | 'operations'
  | 'legal-compliance' | 'internal-audit' | 'risk-management' | 'marketing-communications'
  | 'procurement-supply-chain' | 'customer-service' | 'executive-management' | 'administration';

export interface DocFile {
  name: string;
  url: string;
}

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
  observations?: string;
}

export interface StaticScope {
  id: string;
  company: string;
  divisionCode: string;
  subDivisionName: string;
  /** null = top-level scope; set = sub-scope of the scope with this id. */
  parentScopeId: string | null;
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
  /** ISO timestamp — drives the list's newest-first sort. Stamped by `upsertStaticScope`. */
  createdAt: string;
  tasks?: ScopeTask[];
}

export interface StaticSubDivision {
  subDivisionCode: string;
  subDivisionName: string;
  subDivisionType: SubDivisionType;
  company: string;
  divisionCode: string;
  status: SubDivisionStatus;
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
  /** Flat — NOT nested; sub-scopes are sibling `StaticScope` records with `parentScopeId` set. */
  scopes: StaticScope[];
  /** ISO timestamp — drives newest-first sort. Stamped by `upsertStaticSubDivision`. */
  createdAt: string;
}

export interface StaticDivision {
  divisionCode: string;
  divisionName: string;
  company: string;
  divisionType: DivisionType;
  status: DivisionStatus;
  currency: string;
  numberOfEmployees: number | null;
  operationalSince: string | null;
  licenseNumber: string;
  licenseAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  taxRegistrationNumber: string;
  commercialRegistrationNumber: string;
  divisionTimezone: string;
  legalEntityName: string;
  country: DivisionCountry;
  emirateState: DivisionEmirateState;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  gpsCoordinates: string;
  divisionManager: string;
  primaryContactPerson: string;
  contactEmail: string;
  contactPhone: string;
  alternatePhone: string;
  riskRating: RiskRating;
  riskStatus: RiskStatus;
  auditStatus: AuditStatus;
  lastAuditDate: string;
  nextAuditDueDate: string;
  sectorActivity: SectorActivity;
  parentDivision: string | null;
  parentNode: string | null;
  subDivisions: StaticSubDivision[];
  tradeLicenseFile: DocFile;
  vatCertificateFile: DocFile;
  orgDocumentsFile: DocFile;
  /** ISO timestamp — drives newest-first sort. Stamped by `upsertStaticDivision`. */
  createdAt: string;
}

export interface StaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  industry: CompanyIndustry;
  status: CompanyRecordStatus;
  entityType?: string | null;
  industrySector?: string | null;
  ownershipType?: string | null;
  countryOfIncorporation?: string | null;
  regionEmirate?: string | null;
  city?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  tradeLegalRegNumber?: string | null;
  dateOfIncorporation?: string | null;
  parentCompany?: string | null;
  groupAffiliation?: string | null;
  notes?: string | null;
  isRegulated?: boolean | null;
  regIndustry?: string | null;
  regulatoryLicenseNumber?: string | null;
  licenseExpiryDate?: string | null;
  regulatoryNotes?: string | null;
  currencyAccount?: string | null;
  annualTurnoverBracket?: string | null;
  numberOfEmployees?: number | null;
  numberOfSubDivisionsLocations?: number | null;
  fiscalYearStart?: string | null;
  treasuryFunctionsPresent?: boolean | null;
  cashHandlingInvolved?: boolean | null;
  riskRating?: string | null;
  riskOwner?: string | null;
  lastAuditDate?: string | null;
  nextPlannedAuditCycle?: string | null;
  residualRiskScore?: number | null;
  riskNotes?: string | null;
  sectorActivity?: SectorActivity;
  /** ISO timestamp — drives newest-first sort where applicable. */
  createdAt: string;
  divisions: StaticDivision[];
}

export type CompanyEditableFields = Omit<StaticCompany, 'id' | 'divisions' | 'createdAt'>;

export type DivisionEditableFields = Omit<StaticDivision, 'divisionCode' | 'sub-divisions' | 'createdAt'>;

export type SubDivisionEditableFields = Omit<StaticSubDivision, 'subDivisionCode' | 'scopes' | 'createdAt'>;
