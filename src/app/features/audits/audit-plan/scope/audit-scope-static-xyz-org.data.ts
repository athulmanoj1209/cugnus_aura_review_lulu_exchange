import type { StaticCompany, StaticScope, ScopeTask, ScopeStatus, XyzScopeSubDivisionSeed } from './models/scope-static-data.model';

/* ── XYZ Broadcast ────────────────────────────────────────────────────────
 * One top-level scope per department (the sheet's own Audit Scope), each
 * with its real sub-scope(s) nested as child StaticScope records
 * (parentScopeId), carrying that sub-scope's own Audit Objective from the
 * source sheet — mirroring the SC-5000/SC-5001..5003 parent/child pattern
 * DAR Exchange uses for its one richly-detailed department, but applied
 * uniformly across all 27 XYZ Broadcast departments.
 * ──────────────────────────────────────────────────────────────────────── */

const XYZ_AUDITORS = ['bob', 'emma'];
const XYZ_REVIEWERS = ['frank-chen'];
const XYZ_PERIOD_START = '2026-02-01';
const XYZ_PERIOD_END = '2026-04-30';
const XYZ_SUBMITTED_BY = 'Karim Aziz';
const XYZ_CREATED_AT = '2026-02-01T09:00:00.000Z';

const XYZ_SCOPE_SUB_DIVISIONS: XyzScopeSubDivisionSeed[] = [
  { code: 'D01', name: 'Broadcasting / Television Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Broadcasting Operations', workflowStatus: 'In Progress', subScopes: [
    { name: 'Transmission & Playout', objective: 'Assess reliability and control over broadcast transmission and playout.', workflowStatus: 'In Progress', tasks: [
      { taskName: 'Broadcast Schedule Compliance Testing', description: 'Review approved TV broadcast schedules, playout controls and test selected programmes against approved schedules.' },
      { taskName: 'Broadcast Outage & Root-Cause Review', description: 'Review broadcast outages, interruptions and root-cause analysis.' },
    ]},
    { name: 'Studio & Control Room Access', objective: 'Ensure physical and logical access is appropriately controlled.', workflowStatus: 'Not Started', tasks: [
      { taskName: 'Studio & Control Room Access Review', description: 'Review access rights to studios, master control rooms and critical broadcasting systems.' },
    ]},
  ]},
  // { code: 'D02', name: 'Radio Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Radio Operations', subScopes: [
  //   { name: 'Programming & Scheduling', objective: 'Ensure radio programming is properly approved and executed.' },
  //   { name: 'Transmission & Equipment', objective: 'Assess radio transmission continuity and equipment reliability.' },
  // ]},
  { code: 'D03', name: 'Newspaper / Publishing', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Newspaper & Publishing', workflowStatus: 'Pending Review', subScopes: [
    { name: 'Editorial-to-Publication Workflow', objective: 'Ensure published content follows approved editorial workflow.', workflowStatus: 'Pending Review', tasks: [
      { taskName: 'Editorial Workflow Trace Testing', description: 'Trace selected articles from draft through editorial review, approval and publication.' },
    ]},
    { name: 'Print Production & Distribution', objective: 'Assess controls over printing, circulation and returns.', workflowStatus: 'Planned', tasks: [
      { taskName: 'Print Quantity Reconciliation', description: 'Reconcile print quantities to distributed, returned and unsold copies.' },
    ]},
  ]},
  // { code: 'D04', name: 'Editorial / Newsroom', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Editorial Governance & Newsroom', subScopes: [
  //   { name: 'Editorial Approval', objective: 'Ensure content is reviewed and approved before release.' },
  //   { name: 'Fact Checking & Source Verification', objective: 'Assess whether facts and sources are appropriately verified.' },
  //   { name: 'Corrections & Retractions', objective: 'Assess governance over corrections and retractions.' },
  // ]},
  // { code: 'D05', name: 'Content Compliance / Editorial Governance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Content Governance & Compliance', subScopes: [
  //   { name: 'Content Review', objective: 'Ensure media content is reviewed against applicable internal and regulatory requirements.' },
  //   { name: 'Complaints Handling', objective: 'Assess handling of public/regulatory complaints about content.' },
  // ]},
  // { code: 'D06', name: 'Content Acquisition / Legal', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Content Rights & Intellectual Property', subScopes: [
  //   { name: 'Licensing & Usage Rights', objective: 'Ensure content is used within valid rights and licence terms.' },
  //   { name: 'Licence Expiry & Restrictions', objective: 'Assess monitoring of expiry, territory and platform restrictions.' },
  // ]},
  { code: 'D07', name: 'Commercial / Advertising Sales', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Advertising & Commercial Revenue', workflowStatus: 'Approved', subScopes: [
    { name: 'Ad Booking to Broadcast/Publication', objective: 'Ensure all booked advertising is accurately delivered and billed.', workflowStatus: 'Approved', tasks: [
      { taskName: 'Ad Booking-to-Billing Reconciliation', description: 'Reconcile selected ad bookings to airing/publication evidence and invoices.' },
    ]},
    { name: 'Rate Cards & Discounts', objective: 'Assess authorization of rates, discounts and overrides.', workflowStatus: 'In Progress', tasks: [
      { taskName: 'Rate Card & Discount Authorization Testing', description: 'Test selected transactions against approved rate cards and discount matrix.' },
    ]},
    { name: 'Revenue Completeness', objective: 'Identify unbilled or delayed billing for delivered advertisements.', workflowStatus: 'Overdue', tasks: [
      { taskName: 'Broadcast/Publication Log-to-Billing Reconciliation', description: 'Reconcile broadcast/publication logs to billing records.' },
    ]},
  ]},
  { code: 'D08', name: 'Commercial / Partnerships', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Sponsorship & Commercial Partnerships', workflowStatus: 'Approved', subScopes: [
    { name: 'Contractual Obligations', objective: 'Ensure sponsorship commitments are delivered and billed according to contract.', workflowStatus: 'Completed', tasks: [
      { taskName: 'Sponsorship Contract & Delivery Review', description: 'Review selected sponsorship contracts and delivery evidence.' },
    ]},
  ]},
  // { code: 'D09', name: 'Circulation / Subscription', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Subscription & Circulation', subScopes: [
  //   { name: 'Subscription Revenue', objective: 'Assess accuracy and completeness of subscription billing.' },
  // ]},
  // { code: 'D10', name: 'Digital Media / Technology', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Digital Media & OTT Platforms', subScopes: [
  //   { name: 'Publishing Access', objective: 'Ensure only authorized users can publish or modify digital content.' },
  //   { name: 'Availability & Change Management', objective: 'Assess platform resilience and controlled changes.' },
  // ]},
  // { code: 'D11', name: 'Digital / Corporate Communications', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Social Media Governance', subScopes: [
  //   { name: 'Account Security', objective: 'Protect official social accounts from unauthorized access.' },
  //   { name: 'Posting & Approval', objective: 'Ensure sensitive posts follow defined approvals.' },
  // ]},
  // { code: 'D12', name: 'Information Technology / Information Security', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Cybersecurity', subScopes: [
  //   { name: 'Identity & Access Management', objective: 'Ensure access to critical media and corporate systems is appropriate.' },
  //   { name: 'Vulnerability & Incident Management', objective: 'Assess vulnerability remediation and cyber incident response.' },
  // ]},
  // { code: 'D13', name: 'Business Continuity / IT / Operations', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Business Continuity & Disaster Recovery', subScopes: [
  //   { name: 'Broadcast Continuity', objective: 'Ensure TV/radio services can continue during disruption.' },
  //   { name: 'IT Disaster Recovery', objective: 'Assess recoverability of critical systems and data.' },
  // ]},
  // { code: 'D14', name: 'Operations / Asset Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Media Asset Management', subScopes: [
  //   { name: 'Asset Custody', objective: 'Ensure media equipment is recorded, safeguarded and traceable.' },
  //   { name: 'Maintenance & Disposal', objective: 'Assess maintenance and disposal controls.' },
  // ]},
  // { code: 'D15', name: 'Content Production', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Production Management', subScopes: [
  //   { name: 'Production Budgeting', objective: 'Ensure productions operate within approved budgets.' },
  //   { name: 'External Crew & Vendors', objective: 'Assess payments and contracting for external production resources.' },
  // ]},
  { code: 'D16', name: 'Finance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Finance & Financial Reporting', workflowStatus: 'Overdue', subScopes: [
    { name: 'Revenue & Receivables', objective: 'Assess accuracy, completeness and collection of media revenue.', workflowStatus: 'Overdue', tasks: [
      { taskName: 'Revenue Recognition & Receivables Review', description: 'Review revenue recognition, receivables ageing and credit notes.' },
    ]},
    { name: 'General Ledger & Close', objective: 'Assess period-end financial reporting controls.', workflowStatus: 'Rejected', tasks: [
      { taskName: 'Period-End Close Controls Review', description: 'Review key reconciliations, journals and close checklist.' },
    ]},
  ]},
  // { code: 'D17', name: 'Procurement / Supply Chain', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Procurement & Vendor Management', subScopes: [
  //   { name: 'Sourcing & Tendering', objective: 'Ensure procurement is competitive and authorized.' },
  //   { name: 'Vendor Due Diligence', objective: 'Assess vendor onboarding and conflict checks.' },
  // ]},
  // { code: 'D18', name: 'Legal / Contract Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Contract Management', subScopes: [
  //   { name: 'Contract Lifecycle', objective: 'Ensure contracts are approved, monitored and renewed on time.' },
  // ]},
  // { code: 'D19', name: 'Human Resources', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Human Resources & Payroll', subScopes: [
  //   { name: 'Payroll & Allowances', objective: 'Assess payroll accuracy and authorization.' },
  //   { name: 'Freelancers & Talent', objective: 'Assess governance over presenters, journalists, freelancers and temporary crew.' },
  // ]},
  // { code: 'D20', name: 'Legal / Compliance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Legal & Regulatory Compliance', subScopes: [
  //   { name: 'Licences & Regulatory Obligations', objective: 'Ensure regulatory obligations and licences are tracked and fulfilled.' },
  // ]},
  // { code: 'D21', name: 'Information Governance / Compliance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Data Privacy & Information Governance', subScopes: [
  //   { name: 'Personal Data Handling', objective: 'Assess protection and lawful handling of personal data.' },
  // ]},
  // { code: 'D22', name: 'Records / Archive Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Records & Media Archive Management', subScopes: [
  //   { name: 'Archive Completeness & Retrieval', objective: 'Ensure media archives are complete, protected and retrievable.' },
  // ]},
  // { code: 'D23', name: 'Corporate Communications / Brand Protection', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Reputation & Brand Risk', subScopes: [
  //   { name: 'Negative Media & Brand Monitoring', objective: 'Assess monitoring and response to reputational threats.' },
  // ]},
  // { code: 'D24', name: 'Risk / Internal Control / Finance', riskRating: 'high', auditFrequency: 'monthly', scopeName: 'Fraud Risk Management', subScopes: [
  //   { name: 'Fraud Risk Assessment', objective: 'Assess identification and monitoring of fraud risks.' },
  //   { name: 'Revenue & Vendor Analytics', objective: 'Identify unusual transactions and potential fraud indicators.' },
  // ]},
  // { code: 'D25', name: 'Corporate Governance / Board Secretariat', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Corporate Governance', subScopes: [
  //   { name: 'Delegation & Committees', objective: 'Assess governance, authority and oversight structures.' },
  // ]},
  // { code: 'D26', name: 'Risk Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Enterprise Risk Management', subScopes: [
  //   { name: 'Risk Register & KRIs', objective: 'Assess completeness and effectiveness of enterprise risk monitoring.' },
  //   { name: 'Risk Assessment & Controls', objective: 'Assess risk scoring and control effectiveness methodology.' },
  // ]},
  // { code: 'D27', name: 'Procurement / Risk / Vendor Management', riskRating: 'medium', auditFrequency: 'quarterly', scopeName: 'Third-Party & Outsourcing Risk', subScopes: [
  //   { name: 'Critical Third Parties', objective: 'Assess risks arising from critical outsourced services and partners.' },
  // ]},
];

function makeXyzScope(
  id: string,
  parentScopeId: string | null,
  scopeName: string,
  objective: string,
  auditFrequency: 'quarterly' | 'annually' | 'monthly',
  riskRating: 'low' | 'medium' | 'high',
  workflowStatus: ScopeStatus,
): StaticScope {
  return {
    id,
    company: 'xyz-broadcast',
    divisionCode: 'XYZ-BR-01',
    subDivisionName: '',
    subDivisionsInfo: null,
    parentScopeId,
    scopeName,
    scopeType: 'subDivisional',
    linkedSubDivisions: [],
    auditFrequency,
    modeOfAudit: 'full',
    samplingMethodology: 'risk-based',
    samplingSize: 15,
    startDate: XYZ_PERIOD_START,
    endDate: XYZ_PERIOD_END,
    assignedAuditors: XYZ_AUDITORS,
    assignedReviewers: XYZ_REVIEWERS,
    objective,
    justificationForSampling: '',
    estimatedHours: 40,
    hourlyRate: 75,
    riskReferenceId: `RR-${id.replace('SC-', '')}`,
    riskRating,
    completionNote: '',
    status: 'active',
    workflowStatus,
    submittedBy: XYZ_SUBMITTED_BY,
    submittedDate: '2026-02-01',
    dueDate: XYZ_PERIOD_END,
    createdAt: XYZ_CREATED_AT,
    tasks: [],
  };
}

function makeXyzTask(id: string, taskName: string, description: string, riskPriority: 'low' | 'medium' | 'high'): ScopeTask {
  return {
    id,
    taskName,
    status: 'not-started',
    objective: description,
    checklistItems: [],
    assignedAuditor: XYZ_AUDITORS[0],
    startDate: XYZ_PERIOD_START,
    endDate: XYZ_PERIOD_END,
    controlRating: '',
    riskPriority,
    tags: [],
    description,
  };
}

function makeXyzSubDivisionScopes(seed: XyzScopeSubDivisionSeed): StaticScope[] {
  const topId = `SC-70${String(Number(seed.code.slice(1))).padStart(2, '0')}`;
  const topScope = makeXyzScope(topId, null, seed.scopeName,
    `Evaluate ${seed.scopeName.toLowerCase()} controls for the ${seed.name} department.`,
    seed.auditFrequency, seed.riskRating, seed.workflowStatus);
  topScope.subDivisionName = seed.name;
  topScope.linkedSubDivisions = [seed.name];
  const subScopes = seed.subScopes.map((sub, i) => {
    const subId = `${topId}-S${i + 1}`;
    const subScope = makeXyzScope(subId, topId, sub.name, sub.objective, seed.auditFrequency, seed.riskRating,
      sub.workflowStatus ?? seed.workflowStatus);
    subScope.subDivisionName = seed.name;
    subScope.linkedSubDivisions = [seed.name];
    subScope.tasks = (sub.tasks ?? []).map((task, j) =>
      makeXyzTask(`${subId}-T${j + 1}`, task.taskName, task.description, seed.riskRating));
    return subScope;
  });
  return [topScope, ...subScopes];
}

export const XYZ_BROADCAST_SCOPE_COMPANIES: StaticCompany[] = [
  {
    id: 'xyz-broadcast',
    companyName: 'XYZ Broadcast',
    tag: 'XYZ',
    color: '#a6373d',
    divisions: [
      {
        divisionCode: 'XYZ-BR-01',
        divisionName: 'Dubai',
        hasSubDivision: true,
        company: 'xyz-broadcast',
        scopes: [],
        subDivisions: XYZ_SCOPE_SUB_DIVISIONS.map(seed => ({
          subDivisionName: seed.name,
          company: 'xyz-broadcast',
          divisionCode: 'XYZ-BR-01',
          scopes: makeXyzSubDivisionScopes(seed),
        })),
      },
    ],
  },
];
