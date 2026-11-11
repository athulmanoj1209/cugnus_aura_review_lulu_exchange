import type { StaticCompany, StaticScope, ScopeTask, ScopeStatus, ScopeType } from './models/scope-static-data.model';
import { INTERNAL_AUDIT_CLIENT_KEY_VALUE } from '@/app/core/config/client-mode';
import { XYZ_BROADCAST_SCOPE_COMPANIES } from './audit-scope-static-xyz-org.data';
import { LULU_EXCHANGE_SCOPE_COMPANIES } from './audit-scope-static-lulu-org.data';

//const 'abc-broadcast' = 'abc-broadcast';
//const 'ABC-BR-12' = 'ABC-BR-15';
//const 'BRANCH 2' = 'ABC Broadcast';
const AUDITORS = ['bob', 'emma'];
const REVIEWERS = ['frank-chen'];
const PERIOD_START = '2026-01-15';
const PERIOD_END = '2026-03-31';
const SUBMITTED_BY = 'Rajeev Nanda';
const CREATED_AT = '2026-01-10T09:00:00.000Z';

function makeTask(
  id: string,
  taskName: string,
  objective: string,
  riskPriority: 'low' | 'medium' | 'high',
): ScopeTask {
  return {
    id,
    taskName,
    status: 'not-started',
    objective,
    checklistItems: [],
    assignedAuditor: AUDITORS[0],
    startDate: PERIOD_START,
    endDate: PERIOD_END,
    controlRating: '',
    riskPriority,
    tags: ['aml-cft'],
    description: objective,
  };
}

/**
 * A scope or sub-scope record. `parentScopeId: null` makes it a TOP-LEVEL
 * scope (one per additional Scope of Work table — Operations and Other
 * Sub-Divisions; Quality Check — TMS and Sanction Screening; Consumer
 * Protection and Market Conduct — each a sibling of SC-5000, not nested
 * under it); a non-null `parentScopeId` (e.g. 'SC-5000') makes it a
 * SUB-SCOPE of that scope — used only under AML/CFT Compliance, to group
 * its 33 tasks into 3 thematic sub-scopes. Either way, that scope/sub-scope
 * owns its own checklist bullets as tasks in its `tasks[]`.
 */
function makeScope(
  id: string,
  parentScopeId: string | null,
  scopeName: string,
  objective: string,
  auditFrequency: 'quarterly' | 'annually' | 'monthly',
  riskRating: 'low' | 'medium' | 'high',
  tasks: ScopeTask[],workflowStatus:ScopeStatus | undefined,
): StaticScope {
  return {
    id,
    company: 'abc-broadcast',
    divisionCode: 'ABC-BR-12',
    subDivisionName: 'BRANCH 2',
    subDivisionsInfo: null,
    parentScopeId,
    scopeName,
    scopeType: 'functional',
    linkedSubDivisions: ['BRANCH 2'],
    auditFrequency,
    modeOfAudit: 'full',
    samplingMethodology: 'risk-based',
    samplingSize: 15,
    startDate: PERIOD_START,
    endDate: PERIOD_END,
    assignedAuditors: AUDITORS,
    assignedReviewers: REVIEWERS,
    objective,
    justificationForSampling: '',
    estimatedHours: 80,
    hourlyRate: 75,
    riskReferenceId: `RR-${id.replace('SC-', '')}`,
    riskRating,
    completionNote: '',
    status: 'active',
    workflowStatus: workflowStatus,
    submittedBy: SUBMITTED_BY,
    submittedDate: '2026-01-10',
    dueDate: PERIOD_END,
    createdAt: CREATED_AT,
    tasks,
  };
}

/** Top-level scope (sibling of SC-5000, parentScopeId: null). */
function makeTopScope(
  id: string,
  scopeName: string,
  objective: string,
  auditFrequency: 'quarterly' | 'annually' | 'monthly',
  riskRating: 'low' | 'medium' | 'high',
  tasks: ScopeTask[],
): StaticScope {
  return makeScope(id, null, scopeName, objective, auditFrequency, riskRating, tasks,'Approved');
}

/** Build a full audit-scope record from a sub-division's compact `scopes` entry. */
function makeSubDivisionScope(
  id: string,
  divisionCode: string,
  subDivisionName: string,
  scopeName: string,
  scopeType: ScopeType,
  auditFrequency: 'quarterly' | 'annually' | 'monthly',
  riskRating: 'low' | 'medium' | 'high',workflowStatus:ScopeStatus | undefined
): StaticScope {
  return {
    id, company: 'abc-broadcast', divisionCode, subDivisionName, subDivisionsInfo: null,
    parentScopeId: null, scopeName, scopeType,
    linkedSubDivisions: [subDivisionName], auditFrequency,
    modeOfAudit: 'full', samplingMethodology: 'risk-based', samplingSize: 15,
    startDate: PERIOD_START, endDate: PERIOD_END,
    assignedAuditors: AUDITORS, assignedReviewers: REVIEWERS,
    objective: `Evaluate ${scopeName.toLowerCase()} controls and compliance for the ${subDivisionName} sub-division.`,
    justificationForSampling: '', estimatedHours: 40, hourlyRate: 75,
    riskReferenceId: `RR-${id.replace('SC-', '')}`, riskRating,
    completionNote: '', status: 'active', workflowStatus: workflowStatus,
    submittedBy: SUBMITTED_BY, submittedDate: '2026-01-10',
    dueDate: PERIOD_END, createdAt: CREATED_AT, tasks: [],
  };
}

const SUB_DIVISION_SCOPES = {
  hr: [
    makeSubDivisionScope('SC-6001', 'ABC-BR-04', 'HR Dept', 'Human Resources / Emiratization', 'functional', 'annually', 'medium','Overdue'),
    makeSubDivisionScope('SC-6002', 'ABC-BR-07', 'HR Dept', 'Human Resources Operations / Cash Handling & Teller Controls', 'functional', 'quarterly', 'medium','Approved'),

  ],
  finance: [
    makeSubDivisionScope('SC-6101', 'ABC-BR-03', 'Finance', 'Accounts / Audit / Unclaimed Funds', 'functional', 'annually', 'medium','Completed'),
  makeSubDivisionScope('SC-6102', 'ABC-BR-04', 'Finance', 'Branch Operations / Cash Handling & Teller Controls', 'functional', 'quarterly', 'medium','Approved'),
  ],
  it: [
    makeSubDivisionScope('SC-6201', 'ABC-BR-14', 'IT', 'Information Technology / Cybersecurity', 'functional', 'annually', 'high','In Progress'),
  ],
  branch1: [
    makeSubDivisionScope('SC-6301', 'ABC-BR-12', 'BRANCH 1', 'Administration / Outsourcing of Functions', 'functional', 'quarterly', 'medium','Pending Review'),
    makeSubDivisionScope('SC-6302', 'ABC-BR-12', 'BRANCH 1', 'Branch Operations / Cash Handling & Teller Controls', 'functional', 'quarterly', 'medium','Approved'),
  ],
  branch2: [
    makeSubDivisionScope('SC-6401', 'ABC-BR-12', 'BRANCH 2', 'Branch Operations / Operational Controls', 'functional', 'annually', 'high','In Progress'),
  ],
  aml: [
    makeSubDivisionScope('SC-6501', 'ABC-BR-05', 'AML', 'AML / CFT Compliance', 'functional', 'quarterly', 'high','Approved'),
  ],
  risk: [
    makeSubDivisionScope('SC-6601', 'ABC-BR-06', 'RISK', 'Risk Management / Business Continuity', 'functional', 'monthly', 'high','Completed'),
  ],
  consumerProtection: [
    makeSubDivisionScope('SC-6701', 'ABC-BR-07', 'CONSUMER PROTECTION', 'Consumer Protection / Market Conduct', 'functional', 'monthly', 'medium','Approved'),
  ],
};

/**
 * The AML/CFT Compliance table's 33 checklist bullets, grouped into 3
 * thematic sub-scopes of SC-5000 (rather than sitting flat on SC-5000
 * itself — SC-5000 carries no tasks directly; see SUB_SCOPES_AML_CFT
 * below). Two items are best-effort completions of text cut off in the
 * source screenshots:
 *  - TSK-5032 "Case Management & STR System Review" — completed from the
 *    later, unabridged screenshot.
 *  - TSK-5033 "Data Accuracy & Integrity Review" — the bullet was cropped to
 *    "...ccuracy/integrity of the data provided."; read here as "Review of
 *    the accuracy/integrity of the data provided." Confirm against the
 *    source document if available.
 * A further bullet after TSK-5033 (ending "...anagement") was cut off across
 * a page break and isn't legible enough to include — add it separately if
 * you have the full text.
 */
const TASKS_POLICY_GOVERNANCE: ScopeTask[] = [
  makeTask('TSK-5001', 'AML Policy Effectiveness',
    'Evaluation of the effectiveness of the AML Policy in line with the risk identified and the procedures followed at the Exchange House.',
    'high'),
  makeTask('TSK-5002', 'CO/ACO Appointment Process',
    'Review of the appointment process of the Compliance Officer (CO) and Assistant Compliance Officer (ACO).',
    'high'),
  makeTask('TSK-5006', 'Compliance Committee Formation & Functioning',
    'Review of the formation and functioning of the Compliance Committee.',
    'medium'),
  makeTask('TSK-5007', 'Front-Line Executive Training Effectiveness',
    'Effectiveness of training given to the front-line executives.',
    'medium'),
  makeTask('TSK-5008', 'CPD Training Completion (Compliance Staff)',
    'CPD training completion level of compliance sub-division staff.',
    'medium'),
  makeTask('TSK-5009', 'Staff & Senior Management Training',
    'Staff Training & senior management training.',
    'medium'),
  makeTask('TSK-5013', 'Ancillary Services Review',
    'Review of the Ancillary services offered by the Exchange.',
    'medium'),
  makeTask('TSK-5014', 'Training Adequacy & Escalation Procedures',
    'Effectiveness of training given to the front-line executives and remedial training — assessing adequacy, comprehensiveness, accuracy of materials, training schedule, attendance tracking and escalation procedures for lack of attendance.',
    'medium'),
  makeTask('TSK-5017', 'Record Retention',
    'Record Retention.',
    'medium'),
  makeTask('TSK-5018', 'Internal Policy Effectiveness & Adequacy Testing',
    'Test the effectiveness and adequacy of the internal policies.',
    'high'),
  makeTask('TSK-5025', 'Regulatory Findings Implementation',
    'Changes adopted by the compliance function in line with the latest regulatory findings.',
    'medium'),
  makeTask('TSK-5026', 'Regulatory Expectations & Industry Standards Implementation',
    'Implementation of Regulatory Expectations & Industry standards of the AML/CFT compliance function.',
    'high'),
  makeTask('TSK-5028', 'Gap Analysis Process Review',
    'Review of the Gap Analysis process.',
    'medium'),
];

const TASKS_MONITORING_SCREENING: ScopeTask[] = [
  makeTask('TSK-5003', 'Transaction Monitoring Function Effectiveness',
    'Evaluation of the effectiveness of the Transaction Monitoring Function.',
    'high'),
  makeTask('TSK-5004', 'TFS Compliance & Screening Control',
    'Review of the TFS Compliance and Screening control with reference to the customers for all the permitted activities, vendors & other related parties.',
    'high'),
  makeTask('TSK-5010', 'KYC Norms Compliance',
    'KYC norms followed.',
    'high'),
  makeTask('TSK-5012', 'STR/ISTR Quality Review',
    'Quality of STRs and ISTRs raised.',
    'high'),
  makeTask('TSK-5015', 'Customer & Correspondent Onboarding Procedure',
    'Review of customer and related correspondent onboarding procedure.',
    'high'),
  makeTask('TSK-5016', 'Automated Risk Assessment Review',
    'Review of the automated risk assessment incorporated in the system.',
    'high'),
  makeTask('TSK-5019', 'Risk Monitoring Effectiveness',
    'Effectiveness of Risk Monitoring.',
    'high'),
  makeTask('TSK-5020', 'List Management Review',
    'Review of List Management, List selection, Sourcing of lists, list of maintenance, etc.',
    'high'),
  makeTask('TSK-5021', 'New Technologies Risk Parameters',
    'Review of new technologies risk parameters.',
    'medium'),
  makeTask('TSK-5022', 'Client & Third-Party Risk Assessment',
    'Review of the Client Risk assessment and Third-party risk management, and ML/FT business risk assessment.',
    'high'),
  makeTask('TSK-5023', 'AML/CFT Mitigation Measures & CDD Controls',
    'AML/CFT mitigation measures, and CDD policies, procedures, and controls.',
    'high'),
  makeTask('TSK-5024', 'Control Measures Assessment',
    'Control measures assessment.',
    'high'),
  makeTask('TSK-5029', 'SAR/STR Process Review',
    'Review of Suspicious Activity/Transaction Report (SAR/STR) process, including alert clearing process and ageing/backlog management.',
    'high'),
  makeTask('TSK-5030', 'Sanction Screening Coverage & Disposal',
    'Review of Sanction Screening coverage, results, and disposal.',
    'high'),
  makeTask('TSK-5031', 'High-Risk Jurisdictions List Verification',
    'Regular verification and review of the list of High-Risk Jurisdictions subject to a Call for Action (Blacklist) and jurisdictions under Increased Monitoring (Grey List) (Notice Number 1636/2023).',
    'high'),
  makeTask('TSK-5032', 'Case Management & STR System Review',
    'Review of case management and STR systems, including an evaluation of the research and referral of unusual transactions, and a review of policies, procedures and processes for referring unusual or suspicious activity from all business lines to the personnel responsible for investigating unusual activity.',
    'medium'),
  makeTask('TSK-5033', 'Data Accuracy & Integrity Review',
    'Review of the accuracy/integrity of the data provided.',
    'medium'),
];

const TASKS_REPORTING_OVERSIGHT: ScopeTask[] = [
  makeTask('TSK-5005', 'Compliance Team Reporting Review',
    'Analyzing reports prepared by the Compliance Team.',
    'medium'),
  makeTask('TSK-5011', 'System Effectiveness',
    'System effectiveness.',
    'medium'),
  makeTask('TSK-5027', 'Management Oversight & Governance Reporting',
    'Review of Management Oversight & Governance covering comprehensive reporting on all key areas.',
    'medium'),
];

/** The 3 sub-scopes of SC-5000 (AML/CFT Compliance) — parentScopeId: 'SC-5000'. */
const SUB_SCOPES_AML_CFT: StaticScope[] = [
  makeScope('SC-5001', 'SC-5000', 'Policy, Governance & Training',
    'Evaluate ABC Broadcast\'s AML policy, compliance governance structures, and staff/management training within the AML/CFT function.',
    'annually', 'high', TASKS_POLICY_GOVERNANCE,'Overdue'),
  makeScope('SC-5002', 'SC-5000', 'Transaction Monitoring, Screening & Risk Assessment',
    'Assess the Transaction Monitoring function, TFS/sanction screening, KYC/CDD, and client/third-party risk assessment processes.',
    'quarterly', 'high', TASKS_MONITORING_SCREENING,'In Progress'),
  makeScope('SC-5003', 'SC-5000', 'Compliance Reporting & Oversight',
    'Review compliance reporting quality and management oversight of the AML/CFT function.',
    'quarterly', 'medium', TASKS_REPORTING_OVERSIGHT,'Completed'),
];

/**
 * "Operations and Other Sub-Divisions" table — 23 items (the original 17 plus
 * 6 more this later screenshot reveals: HR/KPIs, financial statement
 * analysis, disaster recovery/BCM, Emiratization, job rotation, and the
 * special product matrix).
 */
const TASKS_OPERATIONS: ScopeTask[] = [
  makeTask('TSK-5101', 'System Internal Controls Adequacy',
    'Examination and evaluation of the adequacy and effectiveness of system internal controls.', 'medium'),
  makeTask('TSK-5102', 'Exchange Business Risk Identification',
    'Identify the potential risk of the exchange business.', 'high'),
  makeTask('TSK-5103', 'Operations Effectiveness & Efficacy',
    'Review and evaluate the effectiveness and efficacy of operations.', 'medium'),
  makeTask('TSK-5104', 'Information Security (IT) Controls',
    'Evaluation of information security (IT) controls.', 'high'),
  makeTask('TSK-5105', 'System Controls vs. Policy & SOP Compliance',
    'Adequacy of system controls established to ensure compliance with policy and Standard Operating Procedures.', 'medium'),
  makeTask('TSK-5106', 'Resource Use — Economy, Efficacy, Effectiveness',
    'Evaluate the use of resources with regard to economy, efficacy, and effectiveness.', 'medium'),
  makeTask('TSK-5107', 'Management Policy Adherence',
    'The management policies including AML policies, HR policies, and other related policies are adherent at all levels of the organization.', 'medium'),
  makeTask('TSK-5108', 'Liquidity & Capital Adequacy',
    'Evaluation of the liquidity and capital adequacy of the organization.', 'high'),
  makeTask('TSK-5109', 'Physical Cash Holding Reconciliation',
    'Physical cash holding at the division is tallied with the system reports.', 'high'),
  makeTask('TSK-5110', 'IT Controls — Antivirus & Firewalls',
    'IT controls such as Antivirus, Firewalls are implemented and are functioning.', 'high'),
  makeTask('TSK-5111', 'SubDivisional SOPs In Place & Followed',
    'Standard operating procedures for every sub-division are in place, updated and followed at all levels.', 'medium'),
  makeTask('TSK-5112', 'CBUAE Expectations & Accounting Ratio Analysis',
    'CBUAE expectation & Accounting principles ratio analysis.', 'medium'),
  makeTask('TSK-5113', 'Fixed Asset Register',
    'Fixed asset register is in place and is updated.', 'low'),
  makeTask('TSK-5114', 'Anti-Fraud Framework & Counterfeit Currency Controls',
    'Review of the Anti-Fraud Framework and counterfeit-currency controls.', 'high'),
  makeTask('TSK-5115', 'Enterprise Risk Management Framework',
    'Enterprise Risk Management Framework.', 'high'),
  makeTask('TSK-5116', 'Treasury — FX, Cash & Liquidity Management',
    'Review of the treasury sub-division and its foreign exchange management, cash management and liquidity management.', 'high'),
  makeTask('TSK-5117', 'Budget Evaluation',
    'Evaluating the budget prepared.', 'medium'),
  makeTask('TSK-5118', 'HR Dept Functions & KPIs',
    'Review of the HR sub-division and its functions, Employee key performance indicators.', 'medium'),
  makeTask('TSK-5119', 'Financial Statement Analysis',
    'Reviewing the Financial statements prepared and conducting an analysis based on previous results, market standards and adherence to compliance.', 'medium'),
  makeTask('TSK-5120', 'Disaster Recovery & Business Continuity Management',
    'Disaster recovery & business continuity management.', 'high'),
  makeTask('TSK-5121', 'Emiratization & Empowerment',
    'Review of Emiratization & empowerment.', 'medium'),
  makeTask('TSK-5122', 'Job Rotation Management',
    'Review of the Job Rotation Management.', 'medium'),
  makeTask('TSK-5123', 'Special Product Matrix Compliance',
    'Review of compliance to Special product matrix.', 'medium'),
];

/** "Quality check and review of the Transaction Monitoring and Sanction Screening Alert Management" table — 19 items. */
const TASKS_QUALITY_CHECK_TMS: ScopeTask[] = [
  makeTask('TSK-5201', 'TMS & Sanction Screening Governance',
    'Verify that a proper governance has been applied to the TMS and Sanction Screening Alert Management Function.', 'high'),
  makeTask('TSK-5202', 'Regulatory Guidance & Best Practice Adherence',
    'Adherence to the regulatory guidance and best industry practice.', 'high'),
  makeTask('TSK-5203', 'Organisation Policy & Procedure Adherence',
    'Adherence to the Organisation policy and procedures.', 'high'),
  makeTask('TSK-5204', 'Alert Evaluation & Disposal Quality',
    'Evaluating the quality and accuracy of evaluation of the alerts and alerts disposals.', 'high'),
  makeTask('TSK-5205', 'Transaction Monitoring Rule Quality & Rationale',
    'Evaluating the quality of the transaction monitoring rules and the rationale behind each rule.', 'high'),
  makeTask('TSK-5206', 'Alert Turnaround Time',
    'Evaluation of the turnaround time from alert generation to alert disposal.', 'high'),
  makeTask('TSK-5207', 'Comments & Investigation Reliability',
    'Evaluating the reliability of comments and investigation.', 'medium'),
  makeTask('TSK-5208', 'Manpower Allocation vs. Alert Volume',
    'Evaluating the manpower allocation against the number of alerts.', 'medium'),
  makeTask('TSK-5209', 'Follow-Up & Documentation Cross-Matching',
    'Evaluating the follow-ups done by the compliance team and the documentation on the alerts and cross matching the reliability of comments and investigation.', 'medium'),
  makeTask('TSK-5210', 'Escalation & Alert Disposal Mechanism',
    'Escalations and alert disposal mechanism.', 'high'),
  makeTask('TSK-5211', 'STR/ISTR/SAR & Red-Flag Identification',
    'STR/ ISTR/ SAR & potential redflags identification.', 'high'),
  makeTask('TSK-5212', 'Control Measures Effectiveness',
    'Evaluation the effectiveness of control measures.', 'high'),
  makeTask('TSK-5213', 'TMS Parameter Effectiveness',
    'Evaluating the effectiveness and functioning of current TMS parameters.', 'high'),
  makeTask('TSK-5214', 'Sanction Parameter Effectiveness',
    'Evaluating the effectiveness and functioning of current sanction parameters.', 'high'),
  makeTask('TSK-5215', 'Outcome Analysis & MIS Reporting',
    'Review of Outcome Analysis and Management Information System Reporting.', 'medium'),
  makeTask('TSK-5216', 'TMS & Sanction Screening Quality Review',
    'Quality review for the Transaction Monitoring and the sanction screening.', 'high'),
  makeTask('TSK-5217', 'Risk-Based TMS Rules Review',
    'Review of Risk based rules in the Transaction Monitoring System for alert monitoring.', 'high'),
  makeTask('TSK-5218', 'Rule Definition & Pre/Post-Implementation Testing',
    'Review of Rule definition and Pre and post implementation testing.', 'high'),
  makeTask('TSK-5219', 'Screening Coverage & Percentage Check',
    'Review of Screening coverage and percentage check.', 'high'),
];

/**
 * "Consumer Protection and Market Conduct" table — 17 unique items. The
 * source screenshot repeats 4 bullets (anti-discrimination controls,
 * consumer-protection regulation implementation, product/service/pricing
 * review, and conduct risk framework) a second time — likely a two-column
 * OCR/layout artifact — so those duplicates are collapsed here.
 */
const TASKS_CONSUMER_PROTECTION: ScopeTask[] = [
  makeTask('TSK-5301', 'Access-to-Information Controls & Security',
    'Review of the controls & security of access to information.', 'high'),
  makeTask('TSK-5302', 'Policy & Procedures Review',
    'Review of the policy and procedures.', 'medium'),
  makeTask('TSK-5303', 'Complaint Management Function Review',
    'Review of compliant Management function.', 'medium'),
  makeTask('TSK-5304', 'Division Sales Technique Evaluation',
    'Evaluating the sales technique by the employees in the divisions.', 'medium'),
  makeTask('TSK-5305', 'Product & Service Knowledge Evaluation',
    'Evaluating the product and service knowledge of employees in divisions.', 'medium'),
  makeTask('TSK-5306', 'Service Delivery & Customer Service Compliance',
    'Review of the compliance towards the services provided & customer service.', 'medium'),
  makeTask('TSK-5307', 'Key Fact Statements, Advertising & Disclosures',
    'Review of the key fact statements, advertisement, public releases & other disclosures.', 'high'),
  makeTask('TSK-5308', 'Anti-Discrimination & Accessibility Controls',
    'Evaluating the anti-discrimination controls & service efficiency on illiterate or challenged customers.', 'high'),
  makeTask('TSK-5309', 'Consumer Protection Regulation Implementation',
    'Evaluating the effectiveness of the implementation of consumer protection regulations & standards in the organization & the in-house policies.', 'high'),
  makeTask('TSK-5310', 'Product/Service/Pricing CP Standards Review',
    'Review of product, service, pricing, and other related area in compliance to CP standards.', 'medium'),
  makeTask('TSK-5311', 'Conduct Risk Framework Review',
    'Review of conduct risk framework.', 'high'),
  makeTask('TSK-5312', 'Returned Funds by Correspondent Banks',
    'Review the report for the returned funds by Correspondent banks.', 'medium'),
  makeTask('TSK-5313', 'Governance & Management Supervision Efficiency',
    'Efficiency of governance & management supervision.', 'medium'),
  makeTask('TSK-5314', 'Reporting & Follow-Ups Review',
    'Review of reporting & Follow-ups.', 'medium'),
  makeTask('TSK-5315', 'Fit & Proper Check (Employees/Vendors)',
    'Assessment of the fit & proper check conducted for the employees/Vendor.', 'high'),
  makeTask('TSK-5316', 'Training & Development Programs Review',
    'Review of training & development programs.', 'medium'),
  makeTask('TSK-5317', 'Abusive Sales Practice Controls',
    'Review of the controls on abusive sales practices such as the volume and type of Consumer Complaints, abnormal sales variance, and trends, results of audit/compliance review, etc.', 'high'),
];

const OTHER_TOP_SCOPES: StaticScope[] = [
  makeTopScope('SC-5100', 'Operations and Other subDivisions',
    'Evaluate the adequacy and effectiveness of ABC Broadcast\'s operational controls, resource management, and departmental compliance across Operations, Finance, HR, Treasury, and IT.',
    'annually', 'medium', TASKS_OPERATIONS),
  makeTopScope('SC-5200', 'Quality Check — Transaction Monitoring and Sanction Screening Alert Management',
    'Assess the governance, quality, and effectiveness of ABC Broadcast\'s Transaction Monitoring System and Sanction Screening alert management function.',
    'quarterly', 'high', TASKS_QUALITY_CHECK_TMS),
  makeTopScope('SC-5300', 'Consumer Protection and Market Conduct',
    'Review ABC Broadcast\'s adherence to consumer protection regulations and market conduct standards across sales practices, disclosures, and complaint handling.',
    'quarterly', 'high', TASKS_CONSUMER_PROTECTION),
];


export const DAR_EXCHANGE_SCOPE_COMPANIES: StaticCompany[] = [
  {
    id: 'abc-broadcast',
    companyName: 'ABC Broadcast',
    tag: 'ABC',
    color: '#0b6e75',
    divisions: [
      {
        divisionCode: 'ABC-BR-04',
        divisionName: 'HR Dept',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'HR Dept',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-04',
            scopes: SUB_DIVISION_SCOPES.hr,
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-03',
        divisionName: 'Finance',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'Finance',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-03',
            scopes: SUB_DIVISION_SCOPES.finance,
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-14',
        divisionName: 'IT',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'IT',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-14',
            scopes: SUB_DIVISION_SCOPES.it,
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-12',
        divisionName: 'OPS',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'BRANCH 1',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-12',
            scopes: SUB_DIVISION_SCOPES.branch1,
          },
          {
            subDivisionName: 'BRANCH 2',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-12',
            scopes: [
              ...SUB_DIVISION_SCOPES.branch2,
              {
                id: 'SC-5000',
                company: 'abc-broadcast',
                divisionCode: 'ABC-BR-12',
                subDivisionName: 'BRANCH 2',
                subDivisionsInfo: null,
                parentScopeId: null,
                scopeName: 'AML/CFT Compliance',
                scopeType: 'subDivisional',
                linkedSubDivisions: ['BRANCH 2'],
                auditFrequency: 'quarterly',
                modeOfAudit: 'full',
                samplingMethodology: 'risk-based',
                samplingSize: 25,
                startDate: PERIOD_START,
                endDate: PERIOD_END,
                assignedAuditors: AUDITORS,
                assignedReviewers: REVIEWERS,
                objective:
                  'Evaluate the design and operating effectiveness of ABC Broadcast\'s AML/CFT compliance function against CBUAE expectations and the risk identified at the Exchange House.',
                justificationForSampling: '',
                estimatedHours: 240,
                hourlyRate: 75,
                riskReferenceId: 'RR-5000',
                riskRating: 'high',
                completionNote: '',
                status: 'active',
                workflowStatus: 'Not Started',
                submittedBy: SUBMITTED_BY,
                submittedDate: '2026-01-10',
                dueDate: PERIOD_END,
                createdAt: CREATED_AT,
                tasks: [],
              },
              ...SUB_SCOPES_AML_CFT,
              ...OTHER_TOP_SCOPES,
            ],
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-05',
        divisionName: 'AML',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'AML',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-05',
            scopes: SUB_DIVISION_SCOPES.aml,
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-06',
        divisionName: 'RISK',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'RISK',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-06',
            scopes: SUB_DIVISION_SCOPES.risk,
          },
        ],
      },
      {
        divisionCode: 'ABC-BR-07',
        divisionName: 'CONSUMER PROTECTION',
        hasSubDivision: true,
        company: 'abc-broadcast',
        scopes: [],
        subDivisions: [
          {
            subDivisionName: 'CONSUMER PROTECTION',
            company: 'abc-broadcast',
            divisionCode: 'ABC-BR-07',
            scopes: SUB_DIVISION_SCOPES.consumerProtection,
          },
        ],
      },
    ],
  },
];



export const SCOPE_INDI_ORG_COMPANIES: StaticCompany[] =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? XYZ_BROADCAST_SCOPE_COMPANIES
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? LULU_EXCHANGE_SCOPE_COMPANIES
  : DAR_EXCHANGE_SCOPE_COMPANIES;