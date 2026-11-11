// Scope Library seed used when CLIENT_MODE_VALUE is 'internal-audit' and
// INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a single organisation
// (Lulu International Exchange) auditing itself. Same ScopeLibraryStaticCompany /
// ScopeLibraryItem shapes as the DAR Exchange seed in
// scope-library-static-indi-org.data.ts; the 70 library items (sl-001..040 +
// ssl-001..030 — titles, objectives, risk categories, frameworks, status pattern)
// are copied from it unchanged, only re-homed onto Lulu's roster.
//
// Roster matches division-lulu-exchange.data.ts / sub-division-lulu-exchange.data.ts:
//   IT DEPT (LULU-BR-14)           -> SOFTWARE / HARDWARE / CYBER SECURITY
//   RISK DEPT (LULU-BR-06)         -> no sub-divisions (division-level items)
//   FRAUD DEPT (LULU-BR-05)        -> no sub-divisions (division-level items)
//   BRANCH OPERATIONS (LULU-BR-12) -> Branch 1 / Branch 2
//
// DAR -> Lulu mapping (same as rfi-static-lulu-exchange.data.ts):
//   IT (ABC-BR-14 / IT)                 -> LULU-BR-14 / CYBER SECURITY
//   OPS (ABC-BR-12 / BRANCH 1, BRANCH 2) -> LULU-BR-12 / Branch 1, Branch 2
//   AML (ABC-BR-05)                     -> LULU-BR-05 FRAUD DEPT, division-level
//   RISK (ABC-BR-06)                    -> LULU-BR-06 RISK DEPT, division-level
//   Finance (ABC-BR-03), HR Dept (ABC-BR-04), CONSUMER PROTECTION (ABC-BR-07)
//     have no Lulu counterpart        -> LULU-BR-12 / Branch 2
// Division-level items carry `subDivision: ''` + `hasSubDivision: false`
// (same stamp addScopeLibraryItem applies).

import type { ScopeLibraryStaticCompany } from './models/scope-library-static-data.model';
import type { ScopeLibraryItem, ScopeLibraryStatus } from './models/scope-library-list.model';

const LULU = 'lulu-international-exchange';
const IT = 'LULU-BR-14';
const RISK = 'LULU-BR-06';
const FRAUD = 'LULU-BR-05';
const OPS = 'LULU-BR-12';
const CYBER = 'CYBER SECURITY';
const BRANCH_1 = 'Branch 1';
const BRANCH_2 = 'Branch 2';

export const LULU_EXCHANGE_SCOPE_LIBRARY_COMPANIES: ScopeLibraryStaticCompany[] = [
  {
    id: LULU,
    companyName: 'Lulu International Exchange',
    divisions: [
      { divisionCode: IT, divisionName: 'IT DEPT', hasSubDivision: true, subDivisions: ['SOFTWARE', 'HARDWARE', CYBER] },
      { divisionCode: RISK, divisionName: 'RISK DEPT', hasSubDivision: false, subDivisions: [] },
      { divisionCode: FRAUD, divisionName: 'FRAUD DEPT', hasSubDivision: false, subDivisions: [] },
      { divisionCode: OPS, divisionName: 'BRANCH OPERATIONS', hasSubDivision: true, subDivisions: [BRANCH_1, BRANCH_2] },
    ],
  },
];

/** Placement helpers — `at(division, subDivision)` for sub-division items, `atDivision(division)` for division-level ones. */
const at = (division: string, subDivision: string) => ({ company: LULU, division, subDivision, hasSubDivision: true });
const atDivision = (division: string) => ({ company: LULU, division, subDivision: '', hasSubDivision: false });

const RAW_SCOPE_LIBRARY_LULU: Omit<ScopeLibraryItem, 'status' | 'createdAt'>[] = [
  {
    id: 'sl-001', ...at(IT, CYBER),
    title: 'User Access Review',
    objective: 'Evaluate and validate user access rights to ensure the principle of least privilege is enforced across all systems.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-001', title: 'Privileged Access Review' }, { id: 'ssl-002', title: 'Dormant Account Review' }],
    riskCategory: 'Access Management', applicableFrameworks: ['COBIT', 'ISO 27001', 'SOX'],
  },
  {
    id: 'ssl-001', ...at(IT, CYBER),
    title: 'Privileged Access Review',
    objective: 'Assess privileged user accounts and administrative access to critical systems and databases.',
    scopeLevel: 'subscope', parentScopeId: 'sl-001', parentScopeTitle: 'User Access Review',
    riskCategory: 'Access Management', applicableFrameworks: ['ISO 27001', 'COBIT'],
  },
  {
    id: 'ssl-002', ...at(IT, CYBER),
    title: 'Dormant Account Review',
    objective: 'Identify and remediate inactive user accounts that have not been accessed within the defined inactivity period.',
    scopeLevel: 'subscope', parentScopeId: 'sl-001', parentScopeTitle: 'User Access Review',
    riskCategory: 'Access Management', applicableFrameworks: ['ISO 27001', 'SOX'],
  },
  {
    id: 'sl-002', ...at(IT, CYBER),
    title: 'Change Management Audit',
    objective: 'Review the change management process to ensure all system changes are authorized, tested, and properly documented.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-003', title: 'Emergency Change Review' }, { id: 'ssl-004', title: 'Standard Change Review' }],
    riskCategory: 'Change Management', applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'ssl-003', ...at(IT, CYBER),
    title: 'Emergency Change Review',
    objective: 'Assess emergency changes to IT systems to verify they follow accelerated approval processes and are properly documented.',
    scopeLevel: 'subscope', parentScopeId: 'sl-002', parentScopeTitle: 'Change Management Audit',
    riskCategory: 'Change Management', applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'ssl-004', ...at(IT, CYBER),
    title: 'Standard Change Review',
    objective: 'Assess standard and normal system changes to confirm approval, testing, documentation, and post-implementation validation.',
    scopeLevel: 'subscope', parentScopeId: 'sl-002', parentScopeTitle: 'Change Management Audit',
    riskCategory: 'Change Management', applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-003', ...at(OPS, BRANCH_1),
    title: 'Vendor Risk Assessment',
    objective: 'Evaluate third-party vendor relationships to assess risks related to data security, compliance, and service continuity.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-005', title: 'Third-Party Compliance Review' }, { id: 'ssl-006', title: 'Vendor Contract Compliance' }],
    riskCategory: 'Vendor Risk', applicableFrameworks: ['ISO 27001', 'NIST', 'PCI DSS'],
  },
  {
    id: 'ssl-005', ...at(OPS, BRANCH_1),
    title: 'Third-Party Compliance Review',
    objective: 'Verify that third-party vendors comply with contractual security requirements and applicable regulations.',
    scopeLevel: 'subscope', parentScopeId: 'sl-003', parentScopeTitle: 'Vendor Risk Assessment',
    riskCategory: 'Vendor Risk', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-006', ...at(OPS, BRANCH_1),
    title: 'Vendor Contract Compliance',
    objective: 'Review vendor contracts to ensure they include appropriate security, privacy, and compliance clauses.',
    scopeLevel: 'subscope', parentScopeId: 'sl-003', parentScopeTitle: 'Vendor Risk Assessment',
    riskCategory: 'Vendor Risk', applicableFrameworks: ['ISO 27001', 'PCI DSS'],
  },
  {
    id: 'sl-004', ...at(OPS, BRANCH_2),
    title: 'Financial Reporting Controls',
    objective: 'Assess controls over financial reporting processes to ensure accuracy, completeness, and compliance with accounting standards.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-007', title: 'Revenue Recognition Review' }, { id: 'ssl-008', title: 'Journal Entry Review' }],
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-007', ...at(OPS, BRANCH_2),
    title: 'Revenue Recognition Review',
    objective: 'Evaluate revenue recognition policies and procedures for compliance with applicable accounting standards.',
    scopeLevel: 'subscope', parentScopeId: 'sl-004', parentScopeTitle: 'Financial Reporting Controls',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-008', ...at(OPS, BRANCH_2),
    title: 'Journal Entry Review',
    objective: 'Review manual and automated journal entries to verify authorization, supporting documentation, and proper accounting treatment.',
    scopeLevel: 'subscope', parentScopeId: 'sl-004', parentScopeTitle: 'Financial Reporting Controls',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-005', ...at(IT, CYBER),
    title: 'IT General Controls Review',
    objective: 'Assess IT general controls including logical access, change management, and computer operations to ensure system reliability.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-009', title: 'Backup and Recovery Review' }, { id: 'ssl-010', title: 'IT Operations Monitoring Review' }],
    riskCategory: 'IT General Controls', applicableFrameworks: ['COBIT', 'ISO 27001', 'SOX'],
  },
  {
    id: 'ssl-009', ...at(IT, CYBER),
    title: 'Backup and Recovery Review',
    objective: 'Assess backup schedules, backup completion monitoring, recovery testing, and restoration evidence for critical systems.',
    scopeLevel: 'subscope', parentScopeId: 'sl-005', parentScopeTitle: 'IT General Controls Review',
    riskCategory: 'IT General Controls', applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'ssl-010', ...at(IT, CYBER),
    title: 'IT Operations Monitoring Review',
    objective: 'Evaluate IT operations monitoring activities including job monitoring, incident tracking, escalation, and resolution controls.',
    scopeLevel: 'subscope', parentScopeId: 'sl-005', parentScopeTitle: 'IT General Controls Review',
    riskCategory: 'IT General Controls', applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-006', ...atDivision(FRAUD),
    title: 'Data Privacy Compliance',
    objective: 'Evaluate data privacy policies, procedures, and controls to ensure compliance with applicable privacy regulations and standards.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-011', title: 'Consent Management Review' }, { id: 'ssl-012', title: 'Data Subject Request Review' }],
    riskCategory: 'Data Privacy', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-011', ...atDivision(FRAUD),
    title: 'Consent Management Review',
    objective: 'Review how consent is captured, stored, withdrawn, and evidenced for personal data processing activities.',
    scopeLevel: 'subscope', parentScopeId: 'sl-006', parentScopeTitle: 'Data Privacy Compliance',
    riskCategory: 'Data Privacy', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-012', ...atDivision(FRAUD),
    title: 'Data Subject Request Review',
    objective: 'Assess whether data subject requests are logged, verified, processed, and responded to within required timelines.',
    scopeLevel: 'subscope', parentScopeId: 'sl-006', parentScopeTitle: 'Data Privacy Compliance',
    riskCategory: 'Data Privacy', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-007', ...atDivision(FRAUD),
    title: 'Business Continuity Assessment',
    objective: 'Review business continuity and disaster recovery plans to ensure the organization can maintain operations during disruptions.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-013', title: 'Business Impact Analysis Review' }, { id: 'ssl-014', title: 'Disaster Recovery Testing Review' }],
    riskCategory: 'Business Continuity', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-013', ...atDivision(FRAUD),
    title: 'Business Impact Analysis Review',
    objective: 'Review business impact analysis documentation, critical process identification, recovery objectives, and dependency mapping.',
    scopeLevel: 'subscope', parentScopeId: 'sl-007', parentScopeTitle: 'Business Continuity Assessment',
    riskCategory: 'Business Continuity', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-014', ...atDivision(FRAUD),
    title: 'Disaster Recovery Testing Review',
    objective: 'Assess disaster recovery test plans, test execution results, recovery time achievement, and remediation of test issues.',
    scopeLevel: 'subscope', parentScopeId: 'sl-007', parentScopeTitle: 'Business Continuity Assessment',
    riskCategory: 'Business Continuity', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-008', ...atDivision(FRAUD),
    title: 'Fraud Risk Assessment',
    objective: 'Identify and assess fraud risks within key business processes and evaluate the effectiveness of anti-fraud controls.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-015', title: 'Fraud Incident Review' }, { id: 'ssl-016', title: 'Anti-Fraud Control Review' }],
    riskCategory: 'Fraud Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-015', ...atDivision(FRAUD),
    title: 'Fraud Incident Review',
    objective: 'Review fraud incident records, investigation reports, root cause analysis, and corrective action tracking.',
    scopeLevel: 'subscope', parentScopeId: 'sl-008', parentScopeTitle: 'Fraud Risk Assessment',
    riskCategory: 'Fraud Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-016', ...atDivision(FRAUD),
    title: 'Anti-Fraud Control Review',
    objective: 'Evaluate preventive and detective anti-fraud controls including segregation of duties, approvals, monitoring, and escalation.',
    scopeLevel: 'subscope', parentScopeId: 'sl-008', parentScopeTitle: 'Fraud Risk Assessment',
    riskCategory: 'Fraud Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-009', ...atDivision(RISK),
    title: 'Operational Risk Review',
    objective: 'Assess operational processes and controls to identify risks that could impact business operations, efficiency, and compliance.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-017', title: 'Operational Incident Review' }, { id: 'ssl-018', title: 'SOP Compliance Review' }],
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'ssl-017', ...atDivision(RISK),
    title: 'Operational Incident Review',
    objective: 'Review operational incident logs, severity classification, corrective actions, and recurring issue analysis.',
    scopeLevel: 'subscope', parentScopeId: 'sl-009', parentScopeTitle: 'Operational Risk Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'ssl-018', ...atDivision(RISK),
    title: 'SOP Compliance Review',
    objective: 'Assess adherence to approved standard operating procedures and review exceptions, deviations, and management approvals.',
    scopeLevel: 'subscope', parentScopeId: 'sl-009', parentScopeTitle: 'Operational Risk Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'sl-010', ...atDivision(FRAUD),
    title: 'Compliance Framework Review',
    objective: "Evaluate the organization's compliance management framework to ensure adherence to applicable laws, regulations, and standards.",
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-019', title: 'Compliance Obligation Review' }, { id: 'ssl-020', title: 'Policy Exception Review' }],
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COBIT', 'COSO', 'SOX', 'NIST'],
  },
  {
    id: 'ssl-019', ...atDivision(FRAUD),
    title: 'Compliance Obligation Review',
    objective: 'Review regulatory and compliance obligation registers, assigned ownership, monitoring frequency, and evidence of compliance.',
    scopeLevel: 'subscope', parentScopeId: 'sl-010', parentScopeTitle: 'Compliance Framework Review',
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COBIT', 'COSO', 'SOX', 'NIST'],
  },
  {
    id: 'ssl-020', ...atDivision(FRAUD),
    title: 'Policy Exception Review',
    objective: 'Review policy exception records, approvals, expiry dates, escalation, and closure of exceptions.',
    scopeLevel: 'subscope', parentScopeId: 'sl-010', parentScopeTitle: 'Compliance Framework Review',
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COBIT', 'COSO', 'SOX'],
  },
  {
    id: 'sl-011', ...at(OPS, BRANCH_2),
    title: 'Accounts Payable Controls Review',
    objective: 'Assess accounts payable controls to ensure vendor invoices are authorized, accurately recorded, and paid in accordance with policy.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-021', title: 'Invoice Approval Review' }, { id: 'ssl-022', title: 'Duplicate Payment Review' }],
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-021', ...at(OPS, BRANCH_2),
    title: 'Invoice Approval Review',
    objective: 'Review invoice approval workflows, authority limits, supporting documentation, and exception handling.',
    scopeLevel: 'subscope', parentScopeId: 'sl-011', parentScopeTitle: 'Accounts Payable Controls Review',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-022', ...at(OPS, BRANCH_2),
    title: 'Duplicate Payment Review',
    objective: 'Assess controls for detecting and preventing duplicate supplier invoices, duplicate payments, and vendor payment errors.',
    scopeLevel: 'subscope', parentScopeId: 'sl-011', parentScopeTitle: 'Accounts Payable Controls Review',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-012', ...at(OPS, BRANCH_2),
    title: 'Accounts Receivable Controls Review',
    objective: 'Assess accounts receivable controls including billing, collections, credit limits, ageing, and impairment review.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-023', title: 'Customer Ageing Review' }, { id: 'ssl-024', title: 'Credit Note Review' }],
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-023', ...at(OPS, BRANCH_2),
    title: 'Customer Ageing Review',
    objective: 'Review overdue customer balances, collection actions, ageing categories, and allowance for doubtful debts.',
    scopeLevel: 'subscope', parentScopeId: 'sl-012', parentScopeTitle: 'Accounts Receivable Controls Review',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-024', ...at(OPS, BRANCH_2),
    title: 'Credit Note Review',
    objective: 'Review credit note approval, supporting justification, financial impact, and compliance with delegation of authority.',
    scopeLevel: 'subscope', parentScopeId: 'sl-012', parentScopeTitle: 'Accounts Receivable Controls Review',
    riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-013', ...at(OPS, BRANCH_2),
    title: 'Fixed Asset Management Review',
    objective: 'Assess controls over fixed asset acquisition, capitalization, depreciation, physical verification, and disposal.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-025', title: 'Physical Asset Verification' }, { id: 'ssl-026', title: 'Asset Disposal Review' }],
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-025', ...at(OPS, BRANCH_2),
    title: 'Physical Asset Verification',
    objective: 'Verify physical existence, tagging, location, and condition of fixed assets against the fixed asset register.',
    scopeLevel: 'subscope', parentScopeId: 'sl-013', parentScopeTitle: 'Fixed Asset Management Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-026', ...at(OPS, BRANCH_2),
    title: 'Asset Disposal Review',
    objective: 'Review asset disposals, approval evidence, accounting treatment, and supporting disposal documentation.',
    scopeLevel: 'subscope', parentScopeId: 'sl-013', parentScopeTitle: 'Fixed Asset Management Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-014', ...at(OPS, BRANCH_2),
    title: 'VAT Compliance Review',
    objective: 'Assess VAT filing, tax invoice compliance, input tax recovery, output tax reporting, and reconciliation to accounting records.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-027', title: 'Input Tax Credit Review' }, { id: 'ssl-028', title: 'Output VAT Reconciliation' }],
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-027', ...at(OPS, BRANCH_2),
    title: 'Input Tax Credit Review',
    objective: 'Review input tax credit claims to ensure valid tax invoices, eligibility, and reconciliation to VAT filings.',
    scopeLevel: 'subscope', parentScopeId: 'sl-014', parentScopeTitle: 'VAT Compliance Review',
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-028', ...at(OPS, BRANCH_2),
    title: 'Output VAT Reconciliation',
    objective: 'Review output VAT reconciliation between sales records, tax returns, and general ledger balances.',
    scopeLevel: 'subscope', parentScopeId: 'sl-014', parentScopeTitle: 'VAT Compliance Review',
    riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-015', ...at(OPS, BRANCH_2),
    title: 'Payroll Controls Review',
    objective: 'Assess payroll processing controls including employee master data, salary changes, benefits, deductions, and payroll reconciliation.',
    scopeLevel: 'scope',
    subScopes: [{ id: 'ssl-029', title: 'Payroll Master Data Review' }, { id: 'ssl-030', title: 'Overtime and Allowance Review' }],
    riskCategory: 'Operational Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-029', ...at(OPS, BRANCH_2),
    title: 'Payroll Master Data Review',
    objective: 'Review payroll master data changes, approval evidence, employee bank account changes, and HR-payroll reconciliation.',
    scopeLevel: 'subscope', parentScopeId: 'sl-015', parentScopeTitle: 'Payroll Controls Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-030', ...at(OPS, BRANCH_2),
    title: 'Overtime and Allowance Review',
    objective: 'Review overtime, allowance, and benefit payments to ensure approval, accuracy, and alignment with HR policy.',
    scopeLevel: 'subscope', parentScopeId: 'sl-015', parentScopeTitle: 'Payroll Controls Review',
    riskCategory: 'Operational Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-016', ...at(OPS, BRANCH_1),
    title: 'Procurement Process Review',
    objective: 'Assess procurement controls including purchase requisitions, purchase orders, vendor selection, approvals, and policy compliance.',
    scopeLevel: 'scope', riskCategory: 'Vendor Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-017', ...at(OPS, BRANCH_1),
    title: 'Contract Management Review',
    objective: 'Evaluate contract creation, legal review, approval, renewal tracking, storage, and compliance with contractual obligations.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'sl-018', ...at(IT, CYBER),
    title: 'Information Security Governance Review',
    objective: 'Assess information security governance, policies, roles, responsibilities, risk reporting, and management oversight.',
    scopeLevel: 'scope', riskCategory: 'IT General Controls', applicableFrameworks: ['ISO 27001', 'NIST', 'COBIT'],
  },
  {
    id: 'sl-019', ...at(IT, CYBER),
    title: 'Cybersecurity Controls Review',
    objective: 'Evaluate cybersecurity controls including vulnerability management, endpoint protection, monitoring, and incident response.',
    scopeLevel: 'scope', riskCategory: 'IT General Controls', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-020', ...atDivision(RISK),
    title: 'Incident Management Review',
    objective: 'Assess incident logging, classification, escalation, resolution, root cause analysis, and management reporting.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'sl-021', ...atDivision(FRAUD),
    title: 'Risk Management Framework Review',
    objective: 'Evaluate enterprise risk management governance, risk registers, risk appetite, control mapping, and action tracking.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-022', ...at(OPS, BRANCH_1),
    title: 'Delegation of Authority Review',
    objective: 'Assess approval authority matrices, transaction limits, exception approvals, and compliance with delegated authority requirements.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-023', ...atDivision(FRAUD),
    title: 'Corporate Governance Review',
    objective: 'Review board governance, committee oversight, meeting minutes, resolutions, conflicts of interest, and action tracking.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-024', ...atDivision(FRAUD),
    title: 'AML Controls Review',
    objective: 'Assess anti-money laundering controls including KYC, screening, transaction monitoring, STR escalation, and governance.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['NIST', 'ISO 27001'],
  },
  {
    id: 'sl-025', ...at(OPS, BRANCH_2),
    title: 'Client Onboarding Review',
    objective: 'Evaluate client onboarding controls including documentation, risk assessment, approvals, engagement setup, and compliance checks.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-026', ...at(OPS, BRANCH_2),
    title: 'Treasury Management Review',
    objective: 'Assess treasury controls over bank accounts, cash forecasting, fund transfers, liquidity management, and approvals.',
    scopeLevel: 'scope', riskCategory: 'Financial Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-027', ...at(OPS, BRANCH_2),
    title: 'Bank Reconciliation Review',
    objective: 'Review bank reconciliation controls including preparation, review, reconciling items, clearance, and management sign-off.',
    scopeLevel: 'scope', riskCategory: 'Financial Risk', applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-028', ...at(OPS, BRANCH_2),
    title: 'Inventory Management Review',
    objective: 'Assess inventory controls including stock counts, adjustments, valuation, obsolete stock, and reconciliation to accounting records.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-029', ...atDivision(RISK),
    title: 'Project Management Controls Review',
    objective: 'Evaluate project governance, budgets, milestones, change requests, risk logs, approvals, and closure documentation.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['COSO', 'COBIT'],
  },
  {
    id: 'sl-030', ...at(OPS, BRANCH_2),
    title: 'Health and Safety Compliance Review',
    objective: 'Assess workplace health and safety controls including incident reporting, inspections, PPE, training, and regulatory compliance.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['COBIT', 'COSO'],
  },
  {
    id: 'sl-031', ...atDivision(RISK),
    title: 'Quality Management Review',
    objective: 'Evaluate quality control procedures, inspection evidence, non-conformance tracking, corrective actions, and management reporting.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-032', ...at(OPS, BRANCH_2),
    title: 'Budgeting and Forecasting Review',
    objective: 'Assess budget preparation, forecasting assumptions, approvals, variance analysis, and management reporting controls.',
    scopeLevel: 'scope', riskCategory: 'Financial Risk', applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-033', ...atDivision(FRAUD),
    title: 'Regulatory Reporting Review',
    objective: 'Evaluate regulatory reporting controls to ensure reports are   accurate, complete, reviewed, and submitted within required timelines.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['COSO', 'SOX', 'COBIT'],
  },
  {
    id: 'sl-034', ...atDivision(FRAUD),
    title: 'Records Management Review',
    objective: 'Assess records management controls including document retention, archival, retrieval, destruction, and access restrictions.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-035', ...at(OPS, BRANCH_2),
    title: 'Physical Security Review',
    objective: 'Evaluate physical security controls including facility access, visitor management, CCTV monitoring, and restricted area controls.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-036', ...at(IT, CYBER),
    title: 'Cloud Security Review',
    objective: 'Assess cloud governance, identity controls, configuration management, logging, encryption, and compliance monitoring.',
    scopeLevel: 'scope', riskCategory: 'IT General Controls', applicableFrameworks: ['ISO 27001', 'NIST', 'COBIT'],
  },
  {
    id: 'sl-037', ...at(IT, CYBER),
    title: 'Application Controls Review',
    objective: 'Evaluate application controls including input validation, processing controls, interface controls, approvals, and audit trails.',
    scopeLevel: 'scope', riskCategory: 'IT General Controls', applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-038', ...at(IT, CYBER),
    title: 'Data Governance Review',
    objective: 'Assess data governance controls including data ownership, classification, quality, lineage, access, and stewardship.',
    scopeLevel: 'scope', riskCategory: 'Data Privacy', applicableFrameworks: ['COBIT', 'ISO 27001', 'NIST'],
  },
  {
    id: 'sl-039', ...at(OPS, BRANCH_2),
    title: 'Training and Awareness Review',
    objective: 'Evaluate mandatory training programs, awareness campaigns, completion tracking, escalation, and employee acknowledgements.',
    scopeLevel: 'scope', riskCategory: 'Operational Risk', applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-040', ...atDivision(FRAUD),
    title: 'Policy Management Review',
    objective: 'Assess policy governance including policy ownership, review cycles, approvals, communication, exceptions, and attestation tracking.',
    scopeLevel: 'scope', riskCategory: 'Compliance Risk', applicableFrameworks: ['COBIT', 'COSO', 'ISO 27001'],
  },
];

/* Same status / createdAt / submitter pattern as MOCK_SCOPE_LIBRARY_DAR_EXCHANGE
 * (item order is identical, so every item gets the same status as in DAR). */
const APPROVED_SCOPE_SUBMITTERS_LULU = ['Yousef Al Marri', 'Layla Hassan', 'Khalid Al Shamsi', 'Noura Al Blooshi', 'Rashid Al Nuaimi'];

export const MOCK_SCOPE_LIBRARY_LULU: ScopeLibraryItem[] = RAW_SCOPE_LIBRARY_LULU.map((item, i) => ({
  ...item,
  status: (i % 12 === 0 ? 'pending_review' : i % 17 === 0 ? 'rejected' : 'approved') as ScopeLibraryStatus,
  createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}T09:00:00.000Z`,
  submittedBy: i % 12 === 0
    ? 'Aisha Al Mansoori'
    : i % 17 === 0
      ? 'Omar Al Suwaidi'
      : APPROVED_SCOPE_SUBMITTERS_LULU[i % APPROVED_SCOPE_SUBMITTERS_LULU.length],
  ...(i % 12 === 0 ? { submittedDate: '2026-07-20', dueDate: '2026-08-10' } : {}),
  ...(i % 17 === 0 ? { submittedDate: '2026-07-15', dueDate: null } : {}),
}));
