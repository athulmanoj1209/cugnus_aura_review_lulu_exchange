import type { StaticCompany, StaticScope, ScopeTask, ScopeStatus, ScopeType } from './models/scope-static-data.model';

/* ── Lulu International Exchange ──────────────────────────────────────────
 * Audit-scope seed used when INTERNAL_AUDIT_CLIENT_KEY_VALUE is
 * 'lulu-exchange'. Same structure as the DAR Exchange seed in
 * audit-scope-static-indi-org.data.ts:
 *  - one functional scope per sub-division (or per division when the
 *    division has no sub-divisions — RISK DEPT, FRAUD DEPT), and
 *  - the richly-detailed block under BRANCH OPERATIONS / Branch 2:
 *    AML/CFT Compliance (SC-8500) with 3 sub-scopes + tasks, plus the
 *    Operations, Quality Check (TMS) and Consumer Protection top scopes.
 *
 * Division / sub-division codes and names match division-lulu-exchange.data.ts
 * and sub-division-lulu-exchange.data.ts:
 *   IT DEPT (LULU-BR-14)           -> SOFTWARE, HARDWARE, CYBER SECURITY
 *   RISK DEPT (LULU-BR-06)         -> no sub-divisions
 *   FRAUD DEPT (LULU-BR-05)        -> no sub-divisions
 *   BRANCH OPERATIONS (LULU-BR-12) -> Branch 1, Branch 2
 * ──────────────────────────────────────────────────────────────────────── */

type Freq = 'quarterly' | 'annually' | 'monthly';
type Level = 'low' | 'medium' | 'high';
/** [id, taskName, objective, riskPriority] */
type TaskRow = [string, string, string, Level];

const LULU_COMPANY_ID = 'lulu-international-exchange';
const LULU_COMPANY_NAME = 'Lulu International Exchange';
const LULU_AUDITORS = ['bob', 'emma'];
const LULU_REVIEWERS = ['frank-chen'];
const LULU_PERIOD_START = '2026-01-15';
const LULU_PERIOD_END = '2026-03-31';
const LULU_SUBMITTED_BY = 'Rajeev Nanda';
const LULU_SUBMITTED_DATE = '2026-01-10';
const LULU_CREATED_AT = '2026-01-10T09:00:00.000Z';

const DIV_IT = 'LULU-BR-14';
const DIV_RISK = 'LULU-BR-06';
const DIV_FRAUD = 'LULU-BR-05';
const DIV_BRANCH_OPS = 'LULU-BR-12';
const BRANCH_2 = 'Branch 2';

function makeLuluTasks(rows: TaskRow[]): ScopeTask[] {
  return rows.map(([id, taskName, objective, riskPriority]) => ({
    id,
    taskName,
    status: 'not-started',
    objective,
    checklistItems: [],
    assignedAuditor: LULU_AUDITORS[0],
    startDate: LULU_PERIOD_START,
    endDate: LULU_PERIOD_END,
    controlRating: '',
    riskPriority,
    tags: ['aml-cft'],
    description: objective,
  }));
}

/**
 * Base scope record. `subDivisionName: null` makes it a division-level scope
 * (used for RISK DEPT / FRAUD DEPT, which have no sub-divisions).
 */
function makeLuluScope(opts: {
  id: string;
  divisionCode: string;
  subDivisionName: string | null;
  parentScopeId?: string | null;
  scopeName: string;
  scopeType?: ScopeType;
  objective: string;
  auditFrequency: Freq;
  riskRating: Level;
  workflowStatus: ScopeStatus;
  estimatedHours?: number;
  samplingSize?: number;
  tasks?: ScopeTask[];
}): StaticScope {
  return {
    id: opts.id,
    company: LULU_COMPANY_ID,
    divisionCode: opts.divisionCode,
    subDivisionName: opts.subDivisionName,
    subDivisionsInfo: opts.subDivisionName === null ? [] : null,
    parentScopeId: opts.parentScopeId ?? null,
    scopeName: opts.scopeName,
    scopeType: opts.scopeType ?? 'functional',
    linkedSubDivisions: opts.subDivisionName ? [opts.subDivisionName] : [],
    auditFrequency: opts.auditFrequency,
    modeOfAudit: 'full',
    samplingMethodology: 'risk-based',
    samplingSize: opts.samplingSize ?? 15,
    startDate: LULU_PERIOD_START,
    endDate: LULU_PERIOD_END,
    assignedAuditors: LULU_AUDITORS,
    assignedReviewers: LULU_REVIEWERS,
    objective: opts.objective,
    justificationForSampling: '',
    estimatedHours: opts.estimatedHours ?? 40,
    hourlyRate: 75,
    riskReferenceId: `RR-${opts.id.replace('SC-', '')}`,
    riskRating: opts.riskRating,
    completionNote: '',
    status: 'active',
    workflowStatus: opts.workflowStatus,
    submittedBy: LULU_SUBMITTED_BY,
    submittedDate: LULU_SUBMITTED_DATE,
    dueDate: LULU_PERIOD_END,
    createdAt: LULU_CREATED_AT,
    tasks: opts.tasks ?? [],
  };
}

/** One functional scope for a sub-division (or a division with no sub-divisions). */
function makeLuluUnitScope(
  id: string,
  divisionCode: string,
  subDivisionName: string | null,
  unitLabel: string,
  scopeName: string,
  auditFrequency: Freq,
  riskRating: Level,
  workflowStatus: ScopeStatus,
): StaticScope {
  return makeLuluScope({
    id, divisionCode, subDivisionName, scopeName, auditFrequency, riskRating, workflowStatus,
    objective: `Evaluate ${scopeName.toLowerCase()} controls and compliance for the ${unitLabel} ${subDivisionName ? 'sub-division' : 'division'}.`,
  });
}

const LULU_UNIT_SCOPES = {
  software: [
    makeLuluUnitScope('SC-8001', DIV_IT, 'SOFTWARE', 'SOFTWARE', 'Information Technology / Software Applications', 'quarterly', 'high', 'In Progress'),
  ],
  hardware: [
    makeLuluUnitScope('SC-8002', DIV_IT, 'HARDWARE', 'HARDWARE', 'IT Infrastructure / Hardware & Data Centre', 'annually', 'medium', 'Approved'),
  ],
  cyberSecurity: [
    makeLuluUnitScope('SC-8003', DIV_IT, 'CYBER SECURITY', 'CYBER SECURITY', 'Cybersecurity / Information Security', 'quarterly', 'high', 'Pending Review'),
    makeLuluUnitScope('SC-8004', DIV_IT, 'CYBER SECURITY', 'CYBER SECURITY', 'Cybersecurity / Access & Identity Management', 'quarterly', 'high', 'Approved'),
  ],
  risk: [
    makeLuluUnitScope('SC-8101', DIV_RISK, null, 'RISK DEPT', 'Risk Management / Business Continuity', 'monthly', 'high', 'Approved'),
  ],
  fraud: [
    makeLuluUnitScope('SC-8201', DIV_FRAUD, null, 'FRAUD DEPT', 'Fraud Risk Management / Anti-Fraud Controls', 'quarterly', 'high', 'Approved'),
  ],
  branch1: [
    makeLuluUnitScope('SC-8301', DIV_BRANCH_OPS, 'Branch 1', 'Branch 1', 'Administration / Outsourcing of Functions', 'quarterly', 'medium', 'Overdue'),
    makeLuluUnitScope('SC-8302', DIV_BRANCH_OPS, 'Branch 1', 'Branch 1', 'Branch Operations / Cash Handling & Teller Controls', 'quarterly', 'medium', 'Approved'),
  ],
  branch2: [
    makeLuluUnitScope('SC-8401', DIV_BRANCH_OPS, BRANCH_2, 'Branch 2', 'Branch Operations / Operational Controls', 'annually', 'high', 'In Progress'),
  ],
};

/* ── AML/CFT Compliance (SC-8500) — 3 sub-scopes ─────────────────────────── */

const TASKS_POLICY_GOVERNANCE = makeLuluTasks([
  ['TSK-8501', 'AML Policy Effectiveness', 'Evaluation of the effectiveness of the AML Policy in line with the risk identified and the procedures followed at the Exchange House.', 'high'],
  ['TSK-8502', 'CO/ACO Appointment Process', 'Review of the appointment process of the Compliance Officer (CO) and Assistant Compliance Officer (ACO).', 'high'],
  ['TSK-8506', 'Compliance Committee Formation & Functioning', 'Review of the formation and functioning of the Compliance Committee.', 'medium'],
  ['TSK-8507', 'Front-Line Executive Training Effectiveness', 'Effectiveness of training given to the front-line executives.', 'medium'],
  ['TSK-8508', 'CPD Training Completion (Compliance Staff)', 'CPD training completion level of compliance sub-division staff.', 'medium'],
  ['TSK-8509', 'Staff & Senior Management Training', 'Staff Training & senior management training.', 'medium'],
  ['TSK-8513', 'Ancillary Services Review', 'Review of the Ancillary services offered by the Exchange.', 'medium'],
  ['TSK-8514', 'Training Adequacy & Escalation Procedures', 'Effectiveness of training given to the front-line executives and remedial training — assessing adequacy, comprehensiveness, accuracy of materials, training schedule, attendance tracking and escalation procedures for lack of attendance.', 'medium'],
  ['TSK-8517', 'Record Retention', 'Record Retention.', 'medium'],
  ['TSK-8518', 'Internal Policy Effectiveness & Adequacy Testing', 'Test the effectiveness and adequacy of the internal policies.', 'high'],
  ['TSK-8525', 'Regulatory Findings Implementation', 'Changes adopted by the compliance function in line with the latest regulatory findings.', 'medium'],
  ['TSK-8526', 'Regulatory Expectations & Industry Standards Implementation', 'Implementation of Regulatory Expectations & Industry standards of the AML/CFT compliance function.', 'high'],
  ['TSK-8528', 'Gap Analysis Process Review', 'Review of the Gap Analysis process.', 'medium'],
]);

const TASKS_MONITORING_SCREENING = makeLuluTasks([
  ['TSK-8503', 'Transaction Monitoring Function Effectiveness', 'Evaluation of the effectiveness of the Transaction Monitoring Function.', 'high'],
  ['TSK-8504', 'TFS Compliance & Screening Control', 'Review of the TFS Compliance and Screening control with reference to the customers for all the permitted activities, vendors & other related parties.', 'high'],
  ['TSK-8510', 'KYC Norms Compliance', 'KYC norms followed.', 'high'],
  ['TSK-8512', 'STR/ISTR Quality Review', 'Quality of STRs and ISTRs raised.', 'high'],
  ['TSK-8515', 'Customer & Correspondent Onboarding Procedure', 'Review of customer and related correspondent onboarding procedure.', 'high'],
  ['TSK-8516', 'Automated Risk Assessment Review', 'Review of the automated risk assessment incorporated in the system.', 'high'],
  ['TSK-8519', 'Risk Monitoring Effectiveness', 'Effectiveness of Risk Monitoring.', 'high'],
  ['TSK-8520', 'List Management Review', 'Review of List Management, List selection, Sourcing of lists, list of maintenance, etc.', 'high'],
  ['TSK-8521', 'New Technologies Risk Parameters', 'Review of new technologies risk parameters.', 'medium'],
  ['TSK-8522', 'Client & Third-Party Risk Assessment', 'Review of the Client Risk assessment and Third-party risk management, and ML/FT business risk assessment.', 'high'],
  ['TSK-8523', 'AML/CFT Mitigation Measures & CDD Controls', 'AML/CFT mitigation measures, and CDD policies, procedures, and controls.', 'high'],
  ['TSK-8524', 'Control Measures Assessment', 'Control measures assessment.', 'high'],
  ['TSK-8529', 'SAR/STR Process Review', 'Review of Suspicious Activity/Transaction Report (SAR/STR) process, including alert clearing process and ageing/backlog management.', 'high'],
  ['TSK-8530', 'Sanction Screening Coverage & Disposal', 'Review of Sanction Screening coverage, results, and disposal.', 'high'],
  ['TSK-8531', 'High-Risk Jurisdictions List Verification', 'Regular verification and review of the list of High-Risk Jurisdictions subject to a Call for Action (Blacklist) and jurisdictions under Increased Monitoring (Grey List) (Notice Number 1636/2023).', 'high'],
  ['TSK-8532', 'Case Management & STR System Review', 'Review of case management and STR systems, including an evaluation of the research and referral of unusual transactions, and a review of policies, procedures and processes for referring unusual or suspicious activity from all business lines to the personnel responsible for investigating unusual activity.', 'medium'],
  ['TSK-8533', 'Data Accuracy & Integrity Review', 'Review of the accuracy/integrity of the data provided.', 'medium'],
]);

const TASKS_REPORTING_OVERSIGHT = makeLuluTasks([
  ['TSK-8505', 'Compliance Team Reporting Review', 'Analyzing reports prepared by the Compliance Team.', 'medium'],
  ['TSK-8511', 'System Effectiveness', 'System effectiveness.', 'medium'],
  ['TSK-8527', 'Management Oversight & Governance Reporting', 'Review of Management Oversight & Governance covering comprehensive reporting on all key areas.', 'medium'],
]);

const LULU_AML_CFT_SCOPE: StaticScope = makeLuluScope({
  id: 'SC-8500',
  divisionCode: DIV_BRANCH_OPS,
  subDivisionName: BRANCH_2,
  scopeName: 'AML/CFT Compliance',
  scopeType: 'subDivisional',
  objective: `Evaluate the design and operating effectiveness of ${LULU_COMPANY_NAME}'s AML/CFT compliance function against CBUAE expectations and the risk identified at the Exchange House.`,
  auditFrequency: 'quarterly',
  riskRating: 'high',
  workflowStatus: 'Not Started',
  estimatedHours: 240,
  samplingSize: 25,
});

const LULU_SUB_SCOPES_AML_CFT: StaticScope[] = [
  makeLuluScope({
    id: 'SC-8501', parentScopeId: 'SC-8500', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Policy, Governance & Training',
    objective: `Evaluate ${LULU_COMPANY_NAME}'s AML policy, compliance governance structures, and staff/management training within the AML/CFT function.`,
    auditFrequency: 'annually', riskRating: 'high', workflowStatus: 'Overdue',
    estimatedHours: 80, tasks: TASKS_POLICY_GOVERNANCE,
  }),
  makeLuluScope({
    id: 'SC-8502', parentScopeId: 'SC-8500', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Transaction Monitoring, Screening & Risk Assessment',
    objective: 'Assess the Transaction Monitoring function, TFS/sanction screening, KYC/CDD, and client/third-party risk assessment processes.',
    auditFrequency: 'quarterly', riskRating: 'high', workflowStatus: 'In Progress',
    estimatedHours: 80, tasks: TASKS_MONITORING_SCREENING,
  }),
  makeLuluScope({
    id: 'SC-8503', parentScopeId: 'SC-8500', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Compliance Reporting & Oversight',
    objective: 'Review compliance reporting quality and management oversight of the AML/CFT function.',
    auditFrequency: 'quarterly', riskRating: 'medium', workflowStatus: 'Completed',
    estimatedHours: 80, tasks: TASKS_REPORTING_OVERSIGHT,
  }),
];

/* ── Other top-level scopes under Branch 2 ───────────────────────────────── */

const TASKS_OPERATIONS = makeLuluTasks([
  ['TSK-8601', 'System Internal Controls Adequacy', 'Examination and evaluation of the adequacy and effectiveness of system internal controls.', 'medium'],
  ['TSK-8602', 'Exchange Business Risk Identification', 'Identify the potential risk of the exchange business.', 'high'],
  ['TSK-8603', 'Operations Effectiveness & Efficacy', 'Review and evaluate the effectiveness and efficacy of operations.', 'medium'],
  ['TSK-8604', 'Information Security (IT) Controls', 'Evaluation of information security (IT) controls.', 'high'],
  ['TSK-8605', 'System Controls vs. Policy & SOP Compliance', 'Adequacy of system controls established to ensure compliance with policy and Standard Operating Procedures.', 'medium'],
  ['TSK-8606', 'Resource Use — Economy, Efficacy, Effectiveness', 'Evaluate the use of resources with regard to economy, efficacy, and effectiveness.', 'medium'],
  ['TSK-8607', 'Management Policy Adherence', 'The management policies including AML policies, HR policies, and other related policies are adherent at all levels of the organization.', 'medium'],
  ['TSK-8608', 'Liquidity & Capital Adequacy', 'Evaluation of the liquidity and capital adequacy of the organization.', 'high'],
  ['TSK-8609', 'Physical Cash Holding Reconciliation', 'Physical cash holding at the division is tallied with the system reports.', 'high'],
  ['TSK-8610', 'IT Controls — Antivirus & Firewalls', 'IT controls such as Antivirus, Firewalls are implemented and are functioning.', 'high'],
  ['TSK-8611', 'SubDivisional SOPs In Place & Followed', 'Standard operating procedures for every sub-division are in place, updated and followed at all levels.', 'medium'],
  ['TSK-8612', 'CBUAE Expectations & Accounting Ratio Analysis', 'CBUAE expectation & Accounting principles ratio analysis.', 'medium'],
  ['TSK-8613', 'Fixed Asset Register', 'Fixed asset register is in place and is updated.', 'low'],
  ['TSK-8614', 'Anti-Fraud Framework & Counterfeit Currency Controls', 'Review of the Anti-Fraud Framework and counterfeit-currency controls.', 'high'],
  ['TSK-8615', 'Enterprise Risk Management Framework', 'Enterprise Risk Management Framework.', 'high'],
  ['TSK-8616', 'Treasury — FX, Cash & Liquidity Management', 'Review of the treasury sub-division and its foreign exchange management, cash management and liquidity management.', 'high'],
  ['TSK-8617', 'Budget Evaluation', 'Evaluating the budget prepared.', 'medium'],
  ['TSK-8618', 'HR Dept Functions & KPIs', 'Review of the HR sub-division and its functions, Employee key performance indicators.', 'medium'],
  ['TSK-8619', 'Financial Statement Analysis', 'Reviewing the Financial statements prepared and conducting an analysis based on previous results, market standards and adherence to compliance.', 'medium'],
  ['TSK-8620', 'Disaster Recovery & Business Continuity Management', 'Disaster recovery & business continuity management.', 'high'],
  ['TSK-8621', 'Emiratization & Empowerment', 'Review of Emiratization & empowerment.', 'medium'],
  ['TSK-8622', 'Job Rotation Management', 'Review of the Job Rotation Management.', 'medium'],
  ['TSK-8623', 'Special Product Matrix Compliance', 'Review of compliance to Special product matrix.', 'medium'],
]);

const TASKS_QUALITY_CHECK_TMS = makeLuluTasks([
  ['TSK-8701', 'TMS & Sanction Screening Governance', 'Verify that a proper governance has been applied to the TMS and Sanction Screening Alert Management Function.', 'high'],
  ['TSK-8702', 'Regulatory Guidance & Best Practice Adherence', 'Adherence to the regulatory guidance and best industry practice.', 'high'],
  ['TSK-8703', 'Organisation Policy & Procedure Adherence', 'Adherence to the Organisation policy and procedures.', 'high'],
  ['TSK-8704', 'Alert Evaluation & Disposal Quality', 'Evaluating the quality and accuracy of evaluation of the alerts and alerts disposals.', 'high'],
  ['TSK-8705', 'Transaction Monitoring Rule Quality & Rationale', 'Evaluating the quality of the transaction monitoring rules and the rationale behind each rule.', 'high'],
  ['TSK-8706', 'Alert Turnaround Time', 'Evaluation of the turnaround time from alert generation to alert disposal.', 'high'],
  ['TSK-8707', 'Comments & Investigation Reliability', 'Evaluating the reliability of comments and investigation.', 'medium'],
  ['TSK-8708', 'Manpower Allocation vs. Alert Volume', 'Evaluating the manpower allocation against the number of alerts.', 'medium'],
  ['TSK-8709', 'Follow-Up & Documentation Cross-Matching', 'Evaluating the follow-ups done by the compliance team and the documentation on the alerts and cross matching the reliability of comments and investigation.', 'medium'],
  ['TSK-8710', 'Escalation & Alert Disposal Mechanism', 'Escalations and alert disposal mechanism.', 'high'],
  ['TSK-8711', 'STR/ISTR/SAR & Red-Flag Identification', 'STR/ ISTR/ SAR & potential redflags identification.', 'high'],
  ['TSK-8712', 'Control Measures Effectiveness', 'Evaluation the effectiveness of control measures.', 'high'],
  ['TSK-8713', 'TMS Parameter Effectiveness', 'Evaluating the effectiveness and functioning of current TMS parameters.', 'high'],
  ['TSK-8714', 'Sanction Parameter Effectiveness', 'Evaluating the effectiveness and functioning of current sanction parameters.', 'high'],
  ['TSK-8715', 'Outcome Analysis & MIS Reporting', 'Review of Outcome Analysis and Management Information System Reporting.', 'medium'],
  ['TSK-8716', 'TMS & Sanction Screening Quality Review', 'Quality review for the Transaction Monitoring and the sanction screening.', 'high'],
  ['TSK-8717', 'Risk-Based TMS Rules Review', 'Review of Risk based rules in the Transaction Monitoring System for alert monitoring.', 'high'],
  ['TSK-8718', 'Rule Definition & Pre/Post-Implementation Testing', 'Review of Rule definition and Pre and post implementation testing.', 'high'],
  ['TSK-8719', 'Screening Coverage & Percentage Check', 'Review of Screening coverage and percentage check.', 'high'],
]);

const TASKS_CONSUMER_PROTECTION = makeLuluTasks([
  ['TSK-8801', 'Access-to-Information Controls & Security', 'Review of the controls & security of access to information.', 'high'],
  ['TSK-8802', 'Policy & Procedures Review', 'Review of the policy and procedures.', 'medium'],
  ['TSK-8803', 'Complaint Management Function Review', 'Review of compliant Management function.', 'medium'],
  ['TSK-8804', 'Division Sales Technique Evaluation', 'Evaluating the sales technique by the employees in the divisions.', 'medium'],
  ['TSK-8805', 'Product & Service Knowledge Evaluation', 'Evaluating the product and service knowledge of employees in divisions.', 'medium'],
  ['TSK-8806', 'Service Delivery & Customer Service Compliance', 'Review of the compliance towards the services provided & customer service.', 'medium'],
  ['TSK-8807', 'Key Fact Statements, Advertising & Disclosures', 'Review of the key fact statements, advertisement, public releases & other disclosures.', 'high'],
  ['TSK-8808', 'Anti-Discrimination & Accessibility Controls', 'Evaluating the anti-discrimination controls & service efficiency on illiterate or challenged customers.', 'high'],
  ['TSK-8809', 'Consumer Protection Regulation Implementation', 'Evaluating the effectiveness of the implementation of consumer protection regulations & standards in the organization & the in-house policies.', 'high'],
  ['TSK-8810', 'Product/Service/Pricing CP Standards Review', 'Review of product, service, pricing, and other related area in compliance to CP standards.', 'medium'],
  ['TSK-8811', 'Conduct Risk Framework Review', 'Review of conduct risk framework.', 'high'],
  ['TSK-8812', 'Returned Funds by Correspondent Banks', 'Review the report for the returned funds by Correspondent banks.', 'medium'],
  ['TSK-8813', 'Governance & Management Supervision Efficiency', 'Efficiency of governance & management supervision.', 'medium'],
  ['TSK-8814', 'Reporting & Follow-Ups Review', 'Review of reporting & Follow-ups.', 'medium'],
  ['TSK-8815', 'Fit & Proper Check (Employees/Vendors)', 'Assessment of the fit & proper check conducted for the employees/Vendor.', 'high'],
  ['TSK-8816', 'Training & Development Programs Review', 'Review of training & development programs.', 'medium'],
  ['TSK-8817', 'Abusive Sales Practice Controls', 'Review of the controls on abusive sales practices such as the volume and type of Consumer Complaints, abnormal sales variance, and trends, results of audit/compliance review, etc.', 'high'],
]);

const LULU_OTHER_TOP_SCOPES: StaticScope[] = [
  makeLuluScope({
    id: 'SC-8600', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Operations and Other subDivisions',
    objective: `Evaluate the adequacy and effectiveness of ${LULU_COMPANY_NAME}'s operational controls, resource management, and departmental compliance across Operations, Finance, HR, Treasury, and IT.`,
    auditFrequency: 'annually', riskRating: 'medium', workflowStatus: 'Approved',
    estimatedHours: 80, tasks: TASKS_OPERATIONS,
  }),
  makeLuluScope({
    id: 'SC-8700', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Quality Check — Transaction Monitoring and Sanction Screening Alert Management',
    objective: `Assess the governance, quality, and effectiveness of ${LULU_COMPANY_NAME}'s Transaction Monitoring System and Sanction Screening alert management function.`,
    auditFrequency: 'quarterly', riskRating: 'high', workflowStatus: 'Approved',
    estimatedHours: 80, tasks: TASKS_QUALITY_CHECK_TMS,
  }),
  makeLuluScope({
    id: 'SC-8800', divisionCode: DIV_BRANCH_OPS, subDivisionName: BRANCH_2,
    scopeName: 'Consumer Protection and Market Conduct',
    objective: `Review ${LULU_COMPANY_NAME}'s adherence to consumer protection regulations and market conduct standards across sales practices, disclosures, and complaint handling.`,
    auditFrequency: 'quarterly', riskRating: 'high', workflowStatus: 'Approved',
    estimatedHours: 80, tasks: TASKS_CONSUMER_PROTECTION,
  }),
];

export const LULU_EXCHANGE_SCOPE_COMPANIES: StaticCompany[] = [
  {
    id: LULU_COMPANY_ID,
    companyName: LULU_COMPANY_NAME,
    tag: 'LULU',
    color: '#0b6e75',
    divisions: [
      {
        divisionCode: DIV_IT,
        divisionName: 'IT DEPT',
        hasSubDivision: true,
        company: LULU_COMPANY_ID,
        scopes: [],
        subDivisions: [
          { subDivisionName: 'SOFTWARE', company: LULU_COMPANY_ID, divisionCode: DIV_IT, scopes: LULU_UNIT_SCOPES.software },
          { subDivisionName: 'HARDWARE', company: LULU_COMPANY_ID, divisionCode: DIV_IT, scopes: LULU_UNIT_SCOPES.hardware },
          { subDivisionName: 'CYBER SECURITY', company: LULU_COMPANY_ID, divisionCode: DIV_IT, scopes: LULU_UNIT_SCOPES.cyberSecurity },
        ],
      },
      {
        divisionCode: DIV_RISK,
        divisionName: 'RISK DEPT',
        hasSubDivision: false,
        company: LULU_COMPANY_ID,
        scopes: LULU_UNIT_SCOPES.risk,
        subDivisions: [],
      },
      {
        divisionCode: DIV_FRAUD,
        divisionName: 'FRAUD DEPT',
        hasSubDivision: false,
        company: LULU_COMPANY_ID,
        scopes: LULU_UNIT_SCOPES.fraud,
        subDivisions: [],
      },
      {
        divisionCode: DIV_BRANCH_OPS,
        divisionName: 'BRANCH OPERATIONS',
        hasSubDivision: true,
        company: LULU_COMPANY_ID,
        scopes: [],
        subDivisions: [
          { subDivisionName: 'Branch 1', company: LULU_COMPANY_ID, divisionCode: DIV_BRANCH_OPS, scopes: LULU_UNIT_SCOPES.branch1 },
          {
            subDivisionName: BRANCH_2,
            company: LULU_COMPANY_ID,
            divisionCode: DIV_BRANCH_OPS,
            scopes: [
              ...LULU_UNIT_SCOPES.branch2,
              LULU_AML_CFT_SCOPE,
              ...LULU_SUB_SCOPES_AML_CFT,
              ...LULU_OTHER_TOP_SCOPES,
            ],
          },
        ],
      },
    ],
  },
];