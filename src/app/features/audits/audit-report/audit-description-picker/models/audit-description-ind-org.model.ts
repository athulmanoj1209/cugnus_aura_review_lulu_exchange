/**
 * Mock data for the audit description picker — internal-audit ('DAR Exchange')
 * client mode. Mirrors `audit-description.ts`'s `MOCK_SCOPES` shape, but the
 * scope names/ids are taken from the real internal-audit scope roster in
 * `audit-plan/scope/audit-scope-static-indi-org.data.ts` (the same 12
 * top-level scopes: AML/CFT Compliance's 3 real sub-scopes, the other 3
 * "additional Scope of Work" tables, and the 8 single-department scopes).
 * Job names and findings for the 4 scopes that carry real task lists in that
 * file (AML/CFT Compliance, Operations and Other Departments, Quality Check —
 * TMS, Consumer Protection and Market Conduct) are drawn from those real task
 * titles; the 8 department scopes have no task list there, so their jobs are
 * written to fit the department's stated objective instead.
 */

import type { AuditScope } from './audit-description.model';

export const IND_ORG_MOCK_SCOPES: AuditScope[] = [
  {
    id: 'ind-sc-1',
    name: 'AML/CFT Compliance',
    jobs: [
      {
        id: 'ind-jb-1',
        name: 'Policy, Governance & Training',
        types: [
          {
            id: 'ind-n-1', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-1', title: 'AML policy walkthrough completed with the Compliance Officer', updatedAt: '2 days ago', author: 'Bob' },
            ],
          },
          {
            id: 'ind-t-1', kind: 'findings', label: 'Findings',
            items: [
              {
                id: 'ind-d-1', title: 'AML policy not fully aligned to identified risk',
                description: 'The AML Policy has not been updated to reflect the entity\'s latest risk identification exercise, so several procedures followed at the Exchange House are not covered by the current policy wording.',
                updatedAt: '2 days ago', author: 'Bob',
              },
              {
                id: 'ind-d-2', title: 'Internal policy adequacy testing gaps',
                description: 'Testing of the effectiveness and adequacy of internal policies identified two policies (customer offboarding, high-risk client review) without a defined review cycle.',
                updatedAt: '4 days ago', author: 'Bob',
              },
            ],
          },
          {
            id: 'ind-t-2', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-3', title: 'Record retention schedule reviewed', description: 'Reviewed the record retention register against CBUAE minimum retention requirements for customer due diligence files.', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-3', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-4', title: 'Formalise the Gap Analysis process into a recurring exercise', description: 'The Gap Analysis process should be run on a fixed annual cycle, with findings tracked to closure by the Compliance Committee rather than performed ad hoc.', updatedAt: '1 day ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-2',
        name: 'Transaction Monitoring, Screening & Risk Assessment',
        types: [
          {
            id: 'ind-n-2', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-2', title: 'TMS parameter export obtained directly from the system administrator', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-4', kind: 'findings', label: 'Findings',
            items: [
              {
                id: 'ind-d-5', title: 'Transaction Monitoring Function effectiveness not fully evidenced',
                description: 'Evaluation of the Transaction Monitoring Function found alert disposition rationale was documented for only 14 of 20 sampled alerts.',
                updatedAt: '6 days ago', author: 'Bob',
              },
              {
                id: 'ind-d-6', title: 'High-risk jurisdictions list not verified on a fixed schedule',
                description: 'The list of High-Risk Jurisdictions subject to a Call for Action (Blacklist) and jurisdictions under Increased Monitoring (Grey List) is updated only when a team member notices a change, rather than on a scheduled basis per Notice 1636/2023.',
                updatedAt: '1 week ago',
              },
            ],
          },
          {
            id: 'ind-t-5', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-7', title: 'Customer and correspondent onboarding files sampled', description: 'Sampled 10 customer onboarding files and traced KYC/CDD documentation to the onboarding procedure checklist.', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-6', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-8', title: 'Automate sanction screening coverage reporting', description: 'Sanction screening coverage and disposal results should be reported automatically from the screening system rather than compiled manually each month.', updatedAt: '5 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-3',
        name: 'Compliance Reporting & Oversight',
        types: [
          {
            id: 'ind-n-3', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-3', title: 'Compliance Committee minutes obtained for the review period', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-7', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-9', title: 'Compliance team reports lack a consistent format', description: 'Reports prepared by the Compliance Team varied in structure month to month, making trend analysis by senior management difficult.', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-8', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-10', title: 'System effectiveness walkthrough performed', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-9', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-11', title: 'Standardise the management oversight reporting template', description: 'A single reporting template covering all key AML/CFT areas should be adopted for governance reporting to improve management oversight visibility.', updatedAt: '1 day ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-2',
    name: 'Operations and Other Departments',
    jobs: [
      {
        id: 'ind-jb-4',
        name: 'IT & Information Security Controls',
        types: [
          {
            id: 'ind-n-4', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-4', title: 'IT controls checklist completed with the IT department', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-10', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-12', title: 'Antivirus definitions not consistently up to date', description: 'Evaluation of information security (IT) controls found 3 of 15 sampled workstations running antivirus definitions more than 30 days out of date.', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-11', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-13', title: 'System controls vs. SOP compliance sample reviewed', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-12', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-14', title: 'Formalise disaster recovery testing on a fixed cycle', description: 'Disaster recovery and business continuity management procedures should be tested at least annually, with results reported to senior management.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-5',
        name: 'Treasury & Financial Controls',
        types: [
          {
            id: 'ind-n-5', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-5', title: 'Fixed asset register obtained from Finance', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-13', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-15', title: 'Physical cash holding not reconciled to system reports weekly', description: 'Physical cash holding at the branch was reconciled to system reports monthly rather than on the weekly basis expected by the treasury procedure.', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-14', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-16', title: 'Fixed asset register agreed to a sample of physical assets', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-15', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-17', title: 'Tighten the budget evaluation cycle', description: 'Budget evaluation should move from an annual to a quarterly cycle to catch liquidity and capital adequacy variances earlier.', updatedAt: '3 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-3',
    name: 'Quality Check — Transaction Monitoring and Sanction Screening Alert Management',
    jobs: [
      {
        id: 'ind-jb-6',
        name: 'Alert Management Quality Review',
        types: [
          {
            id: 'ind-n-6', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-6', title: 'Alert disposition sample pulled from the TMS for the quarter', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-16', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-18', title: 'Alert evaluation quality inconsistent across analysts', description: 'Evaluating the quality and accuracy of alert evaluation and disposal found noticeably different levels of investigation depth between two analysts handling the same alert type.', updatedAt: '5 days ago' },
              { id: 'ind-d-19', title: 'Alert turnaround time exceeds internal SLA', description: 'Average turnaround time from alert generation to disposal was 9 days against an internal target of 5 days for high-risk alerts.', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-17', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-20', title: 'Follow-up documentation cross-matched for sampled alerts', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-18', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-21', title: 'Reassess manpower allocation against alert volume', description: 'Manpower allocated to alert disposal should be reassessed against current alert volume before the next quarter to bring turnaround time back within SLA.', updatedAt: '4 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-7',
        name: 'TMS & Sanction Parameter Effectiveness',
        types: [
          {
            id: 'ind-n-7', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-7', title: 'Current TMS and sanction parameter configuration exported for review', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-19', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-22', title: 'Sanction parameters not updated after last list refresh', description: 'Current sanction parameters had not been re-tuned following the most recent watchlist refresh, risking reduced screening effectiveness.', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-20', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-23', title: 'Screening coverage percentage recalculated and agreed', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-21', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-24', title: 'Introduce pre/post-implementation testing for rule changes', description: 'Every TMS rule definition change should go through documented pre- and post-implementation testing before being promoted to production.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-4',
    name: 'Consumer Protection and Market Conduct',
    jobs: [
      {
        id: 'ind-jb-8',
        name: 'Complaint Handling & Sales Conduct',
        types: [
          {
            id: 'ind-n-8', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-8', title: 'Complaints register obtained for the review period', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-22', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-25', title: 'Complaint management function response times not tracked', description: 'The complaint management function does not log time-to-resolution, so compliance with the complaint-handling policy\'s response window cannot be evidenced.', updatedAt: '3 days ago' },
              { id: 'ind-d-26', title: 'Branch sales technique inconsistent with disclosure requirements', description: 'Two of five branches observed did not consistently walk customers through the key fact statement before completing a transaction.', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-23', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-27', title: 'Service delivery compliance sample reviewed across branches', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-24', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-28', title: 'Monitor abusive sales practice indicators centrally', description: 'Volume and type of consumer complaints, abnormal sales variance, and trend data should be monitored centrally rather than left to individual branch managers.', updatedAt: '2 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-9',
        name: 'Disclosures & Regulatory Compliance',
        types: [
          {
            id: 'ind-n-9', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-9', title: 'Sample of customer-facing disclosures collected from branches', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-25', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-29', title: 'Key fact statements not consistently version-controlled', description: 'Review of the key fact statements, advertisements, and other disclosures found branches using two different template versions concurrently.', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-26', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-30', title: 'Access-to-information controls tested for a sample of requests', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-27', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-31', title: 'Review the conduct risk framework annually', description: 'The conduct risk framework should be formally reviewed on an annual cycle and signed off by the Compliance Committee.', updatedAt: '5 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-5',
    name: 'Human Resources / Emiratization',
    jobs: [
      {
        id: 'ind-jb-10',
        name: 'Emiratization Quota Compliance',
        types: [
          {
            id: 'ind-n-10', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-10', title: 'Emiratization headcount report obtained from HR', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-28', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-32', title: 'Emiratization quota tracking not reconciled monthly', description: 'The Emiratization headcount tracker maintained by HR was last reconciled to the MOHRE portal two months prior to the review date.', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-29', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-33', title: 'UAE national employee records sampled and agreed to MOHRE filings', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-30', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-34', title: 'Reconcile Emiratization tracker to MOHRE monthly', description: 'HR should reconcile the internal Emiratization tracker to the MOHRE portal on a monthly basis rather than reactively before renewal deadlines.', updatedAt: '3 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-11',
        name: 'HR Policy & Recruitment Controls',
        types: [
          {
            id: 'ind-n-11', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-11', title: 'Sample of new-hire files obtained from HR', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-31', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-35', title: 'Offer letters missing manager sign-off for 2 of 10 sampled hires', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-32', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-36', title: 'New-hire onboarding checklist traced for sampled employees', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-33', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-37', title: 'Enforce manager sign-off before offer issuance', description: 'The recruitment workflow should block offer-letter issuance until line-manager sign-off is captured in the HR system.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-6',
    name: 'Accounts / Audit / Unclaimed Funds',
    jobs: [
      {
        id: 'ind-jb-12',
        name: 'Unclaimed Funds Reconciliation',
        types: [
          {
            id: 'ind-n-12', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-12', title: 'Unclaimed funds register obtained from Finance', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-34', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-38', title: 'Unclaimed funds register not aged consistently', description: 'The unclaimed funds register did not consistently apply the entity\'s ageing bands, understating the balance due for regulatory escheatment in the current period.', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-35', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-39', title: 'Unclaimed funds register agreed to the general ledger control account', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-36', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-40', title: 'Automate unclaimed funds ageing calculation', description: 'Ageing of unclaimed funds should be calculated automatically from transaction date rather than updated manually each quarter.', updatedAt: '1 day ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-13',
        name: 'Accounts Payable & Internal Audit Trail',
        types: [
          {
            id: 'ind-n-13', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-13', title: 'Accounts payable ledger extracted for the period', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-37', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-41', title: 'Payment approval trail incomplete for 3 sampled invoices', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-38', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-42', title: 'Invoice approval workflow traced in the finance system', updatedAt: '5 days ago' },
            ],
          },
          {
            id: 'ind-t-39', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-43', title: 'Require system-enforced approval before payment release', description: 'The finance system should block payment release until every required approval step is logged, removing reliance on manual sign-off sheets.', updatedAt: '4 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-7',
    name: 'Information Technology / Cybersecurity',
    jobs: [
      {
        id: 'ind-jb-14',
        name: 'Cybersecurity Controls Review',
        types: [
          {
            id: 'ind-n-14', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-14', title: 'Vulnerability scan report obtained from IT', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-40', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-44', title: 'Critical vulnerabilities open beyond the remediation SLA', description: 'The latest vulnerability scan showed 2 critical findings open for more than 30 days against a 14-day internal remediation SLA.', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-41', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-45', title: 'Firewall rule set reviewed against the change log', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-42', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-46', title: 'Enforce the 14-day critical vulnerability SLA', description: 'Critical vulnerabilities should be escalated to the CIO automatically once the 14-day remediation SLA is breached.', updatedAt: '2 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-15',
        name: 'IT Access Management & Change Control',
        types: [
          {
            id: 'ind-n-15', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-15', title: 'User access review evidence obtained for the core banking system', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-43', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-47', title: 'Two former employees retained system access after exit', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-44', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-48', title: 'Change request tickets sampled and traced to approvals', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-45', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-49', title: 'Link access revocation to the HR exit workflow', description: 'System access revocation should trigger automatically from the HR exit workflow rather than depend on a manual IT ticket.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-8',
    name: 'Administration / Outsourcing of Functions',
    jobs: [
      {
        id: 'ind-jb-16',
        name: 'Outsourced Vendor Oversight',
        types: [
          {
            id: 'ind-n-16', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-16', title: 'Outsourcing register obtained from Administration', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-46', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-50', title: 'Outsourcing register missing renewal dates for 2 vendors', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-47', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-51', title: 'Vendor due-diligence files sampled for outsourced functions', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-48', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-52', title: 'Add renewal-date alerts to the outsourcing register', description: 'The outsourcing register should trigger an alert 60 days before each vendor contract renewal date.', updatedAt: '3 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-17',
        name: 'Administrative Records & Controls',
        types: [
          {
            id: 'ind-n-17', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-17', title: 'Administrative records sample pulled for Branch 1', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-49', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-53', title: 'Administrative filing not consistently digitised', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-50', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-54', title: 'Filing index cross-checked against the physical archive', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-51', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-55', title: 'Digitise administrative records on receipt', description: 'Administrative documents should be scanned and indexed at the point of receipt rather than batched for periodic digitisation.', updatedAt: '5 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-9',
    name: 'Branch Operations / Operational Controls',
    jobs: [
      {
        id: 'ind-jb-18',
        name: 'Cash Handling & Till Reconciliation',
        types: [
          {
            id: 'ind-n-18', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-18', title: 'Till reconciliation sheets obtained for Branch 2', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-52', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-56', title: 'Till variance not investigated same-day', description: 'A till variance of AED 340 on one shift was carried forward two days before being investigated and cleared.', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-53', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-57', title: 'Till reconciliation sheets agreed to the daily cash count', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 'ind-t-54', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-58', title: 'Require same-day sign-off on till variances', description: 'Any till variance should require branch-manager sign-off before the end of the same shift, not a later date.', updatedAt: '1 day ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-19',
        name: 'Branch Compliance Checks',
        types: [
          {
            id: 'ind-n-19', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-19', title: 'Branch compliance checklist completed for the period', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-55', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-59', title: 'Branch operational checklist not signed weekly as required', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-56', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-60', title: 'Weekly operational checklist sampled for four weeks', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 'ind-t-57', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-61', title: 'Move the branch checklist onto a tracked digital form', description: 'The weekly branch operational checklist should move to a digital form that records completion and sign-off automatically.', updatedAt: '5 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-10',
    name: 'AML / CFT Compliance',
    jobs: [
      {
        id: 'ind-jb-20',
        name: 'Departmental AML Risk Assessment',
        types: [
          {
            id: 'ind-n-20', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-20', title: 'Departmental risk assessment obtained from the AML team', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-58', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-62', title: 'Departmental risk assessment not refreshed within the annual cycle', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-59', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-63', title: 'Risk rating methodology walkthrough performed with the AML team', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-60', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-64', title: 'Set a fixed refresh date for the departmental risk assessment', description: 'The AML department risk assessment should carry a fixed annual refresh date tracked by the Compliance Committee.', updatedAt: '2 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-21',
        name: 'Sanctions Screening Oversight',
        types: [
          {
            id: 'ind-n-21', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-21', title: 'Sanctions screening log obtained for the period', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-61', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-65', title: 'Escalated sanctions hits not logged with a decision rationale', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-62', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-66', title: 'Sample of escalated sanctions hits reviewed for disposition', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-63', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-67', title: 'Require a documented rationale on every escalated hit', description: 'Every escalated sanctions hit should carry a documented decision rationale before closure, reviewed by a second compliance officer.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-11',
    name: 'Risk Management / Business Continuity',
    jobs: [
      {
        id: 'ind-jb-22',
        name: 'Business Continuity Plan Testing',
        types: [
          {
            id: 'ind-n-22', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-22', title: 'Latest BCP test report obtained from the Risk team', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-64', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-68', title: 'Business continuity plan not tested within the last 12 months', description: 'The most recent full business continuity test on file predates the current review period by over a year.', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-65', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-69', title: 'BCP test artefacts reviewed for the prior exercise', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 'ind-t-66', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-70', title: 'Schedule an annual BCP test with board reporting', description: 'A full business continuity test should be scheduled annually, with results reported to the board risk committee.', updatedAt: '3 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-23',
        name: 'Enterprise Risk Register Review',
        types: [
          {
            id: 'ind-n-23', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-23', title: 'Enterprise risk register extract obtained for the period', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-67', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-71', title: 'Several risk register entries have no assigned owner', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-68', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-72', title: 'Risk register entries sampled and traced to mitigation plans', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-69', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-73', title: 'Assign a named owner to every risk register entry', description: 'Every entry in the enterprise risk register should carry a named owner accountable for the mitigation plan and its review date.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ind-sc-12',
    name: 'Consumer Protection / Market Conduct',
    jobs: [
      {
        id: 'ind-jb-24',
        name: 'Customer Complaint Escalation Review',
        types: [
          {
            id: 'ind-n-24', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-24', title: 'Escalated complaint log obtained from the department', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-70', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-74', title: 'Escalated complaints not tracked to final resolution date', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-71', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-75', title: 'Sample of escalated complaints traced to resolution correspondence', updatedAt: '3 days ago' },
            ],
          },
          {
            id: 'ind-t-72', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-76', title: 'Log a resolution date against every escalated complaint', description: 'Every escalated complaint should have a logged resolution date and outcome, reviewed monthly by the department head.', updatedAt: '2 days ago' },
            ],
          },
        ],
      },
      {
        id: 'ind-jb-25',
        name: 'Market Conduct Policy Adherence',
        types: [
          {
            id: 'ind-n-25', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'ind-sn-25', title: 'Market conduct policy acknowledgement records obtained', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-73', kind: 'findings', label: 'Findings',
            items: [
              { id: 'ind-d-77', title: 'Policy acknowledgement not on file for all frontline staff', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-74', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'ind-d-78', title: 'Frontline staff roster cross-checked against acknowledgement records', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 'ind-t-75', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'ind-d-79', title: 'Make policy acknowledgement a system-enforced onboarding step', description: 'Market conduct policy acknowledgement should be a mandatory, system-tracked step in the new-hire onboarding workflow.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
    ],
  },
];
