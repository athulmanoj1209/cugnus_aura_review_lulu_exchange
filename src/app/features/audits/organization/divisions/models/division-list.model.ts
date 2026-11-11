export interface DivisionRFIQuestionnaireDoc { name: string; url: string; description?: string; }

export interface DivisionRFI {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  ownerValue: string;
  ownerLabel: string;
  status: 'pending' | 'completed' | 'overdue' | 'under-review' | 'reopened';
  response?: DivisionRFIResponse | null;
  questionnaire?: Array<{
    question: string;
    answer?: string;
    dueDate?: string | null;
    questionDocs?: DivisionRFIQuestionnaireDoc[];
    answerDocs?: DivisionRFIQuestionnaireDoc[];
  }>;
  responseHistory?: DivisionRFIHistoryEntry[];
}

export interface DivisionRFIResponse {
  responseText: string;
  explanationNotes?: string;
  responseDocs: { name: string; url: string; description: string }[];
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
  submittedAt?: string;
  rejectedAt?: string;
}

export interface DivisionRFIHistoryEntry {
  responseText: string;
  explanationNotes?: string;
  responseDocs: { name: string; url: string; description: string }[];
  questionnaire: {
    question: string;
    answer?: string;
    questionDocs?: DivisionRFIQuestionnaireDoc[];
    answerDocs?: DivisionRFIQuestionnaireDoc[];
  }[];
  submittedAt: string;
  rejectedAt: string;
  rejectionReason: string;
}

export interface AuditPlanSubScope {
  subScopeName: string;
  subScopeType: string;
  rfis?: DivisionRFI[];
}

export interface AuditPlanScope {
  scopeName: string;
  scopeType: string;
  subDivisionName: string;
  auditFrequency: string;
  modeOfAudit: string;
  status: 'in-progress' | 'completed' | 'overdue' | 'pending';
  progress: number;
  rfis?: DivisionRFI[];
  subScopes?: AuditPlanSubScope[];
}

export interface AuditPlan {
  planId: string;
  planName: string;
  status: 'draft' | 'in-review' | 'approved' | 'active' | 'completed' | 'deactivated';
  auditFrequency: string;
  startDate: string;
  endDate: string;
  planOwner: string;
  objectives: string;
  totalBudget: string;
  auditScopes?: AuditPlanScope[];
}

export interface SubScope {
  subScopeName: string;
  subScopeType: string;
  linkedSubDivisions: string[];
  auditFrequency: string;
  modeOfAudit: string;
  samplingMethodology: string;
  samplingSize: number;
  startDate: string;
  endDate: string;
  assignedAuditors: string[];
  assignedReviewers?: string[];
  parentScope?: string | null;
  objective?: string;
  justificationForSampling?: string;
  estimatedHours?: number | null;
  hourlyRate?: number | null;
  riskReferenceId?: string;
  riskRating?: string | null;
  completionNote?: string;
  rfis?: DivisionRFI[];
}

export interface Scope {
  scopeName: string;
  scopeType: string;
  linkedSubDivisions: string[];
  auditFrequency: string;
  modeOfAudit: string;
  samplingMethodology: string;
  samplingSize: number;
  startDate: string;
  endDate: string;
  assignedAuditors: string[];
  assignedReviewers?: string[];
  objective?: string;
  justificationForSampling?: string;
  estimatedHours?: number | null;
  hourlyRate?: number | null;
  riskReferenceId?: string;
  riskRating?: string | null;
  completionNote?: string;
  subScopes?: SubScope[];
  rfis?: DivisionRFI[];
}

export interface SubDivision {
  subDivisionCode?: string;
  subDivisionName: string;
  subDivisionType?: string;
  company: string;
  parentSubDivisions: string[];
  status: string;
  auditStatus?: string;
  riskRating: string;
  riskStatus: string;
  primaryContactPerson: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  subDivisionHead: string | null;
  numberOfEmployees: number | null;
  operationalSince: string | null;
  scopes?: Scope[];
}

export interface Division {
  company: string;
  divisionName: string;
  divisionCode: string;
  divisionType: string;
  departmentType?: string | null;
  parentDivision: string | null;
  status: string;
  currency?: string;
  licenseNumber: string;
  licenseAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  taxRegistrationNumber: string;
  commercialRegistrationNumber: string;
  legalEntityName: string;
  country: string;
  emirateState: string;
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
  riskRating: string;
  riskStatus: string;
  auditStatus: string;
  lastAuditDate: string;
  nextAuditDueDate: string;
  sectorActivity: string;
  parentNode: string;
  subDivisionHead: string | null;
  numberOfEmployees: number | null;
  operationalSince: string;
  subDivisions: SubDivision[];
  auditPlans?: AuditPlan[];
  tradeLicenseFile: { name: string; url: string };
  vatCertificateFile: { name: string; url: string };
  orgDocumentsFile: { name: string; url: string };
}

export interface Company {
  id: string;
  companyName: string;
  tradeLegalRegNumber?: string | null;
  dateOfIncorporation?: string | null;
  countryOfIncorporation?: string | null;
  regionEmirate?: string | null;
  city?: string | null;
  industrySector?: string | null;
  typeOfEntity?: string | null;
  ownershipType?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
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
  numberOfDepartmentsLocations?: number | null;
  fiscalYearStart?: string | null;
  treasuryFunctionsPresent?: boolean | null;
  cashHandlingInvolved?: boolean | null;
  riskRating?: string | null;
  riskOwner?: string | null;
  lastAuditDate?: string | null;
  nextPlannedAuditCycle?: string | null;
  residualRiskScore?: number | null;
  riskNotes?: string | null;
  viewType?: string | null;
  divisions: Division[];
}

// ─── Personnel profile types ────────────────────────────────────────────────
export interface PersonnelProfile {
  id: string;
  displayName: string;
  role: string;
  experienceYears: number;
  expertise: string[];
  workload: number;
  totalAudits?: number;
  completedAudits?: number;
}

export interface ReviewerProfile extends PersonnelProfile {
  totalReviews: number;
  completedReviews: number;
}
