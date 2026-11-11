// Self-contained company -> division -> sub-division static data for the Audit
// Scope Library module (manage/scope-library.component.ts) -- like
// sub-division-static-data.ts / division-static-data.ts elsewhere, this is an
// independently-authored copy of the same 8 companies / divisions /
// sub-divisions used across the app (see
// audit-plan/scope/audit-scope-static-data.ts).
//
// The option-list helpers below read the REAL sources (division-static-data.ts /
// sub-division-static-data.ts) rather than this file's own company/division
// arrays, so a division/sub-division added via those other pages is selectable
// here immediately.

import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { SCOPE_LIBRARY_INDI_ORG_COMPANIES, MOCK_SCOPE_LIBRARY_INDI_ORG } from './scope-library-static-indi-org.data';
import type { ScopeLibraryItem, ScopeLibraryStatus } from './models/scope-library-list.model';
import type { ScopeLibraryStaticCompany } from './models/scope-library-static-data.model';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import { SCOPE_LIBRARY_ID_PREFIX } from './constants/scope-library.constants';

const AUDIT_FIRM_SCOPE_LIBRARY_COMPANIES: ScopeLibraryStaticCompany[] = [
  {
    id: "al-noor-jewellery",
    companyName: "Al Noor Jewellery Group",
    divisions: [
      {
        divisionCode: "ANJ-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Retail Operations", "Finance & Accounts"],
      },
      {
        divisionCode: "ANJ-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Inventory & Warehouse", "Compliance & AML", "Human Resources"],
      },
      {
        divisionCode: "ANJ-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Human Resources", "IT & Systems"],
      },
    ],
  },
  {
    id: "zumurrud-diamonds",
    companyName: "Zumurrud Diamonds LLC",
    divisions: [
      {
        divisionCode: "ZUM-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Compliance & AML", "Human Resources"],
      },
      {
        divisionCode: "ZUM-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["IT & Systems", "Procurement", "Quality Assurance"],
      },
      {
        divisionCode: "ZUM-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Quality Assurance", "Logistics"],
      },
    ],
  },
  {
    id: "falcon-gulf-jewellery",
    companyName: "Falcon Gulf Jewellery Trading",
    divisions: [
      {
        divisionCode: "FGJ-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Procurement", "Quality Assurance"],
      },
      {
        divisionCode: "FGJ-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Logistics", "Customer Service", "Retail Operations"],
      },
      {
        divisionCode: "FGJ-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Retail Operations", "Finance & Accounts"],
      },
    ],
  },
  {
    id: "marwa-gold-gems",
    companyName: "Marwa Gold & Gems",
    divisions: [
      {
        divisionCode: "MGG-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Customer Service", "Retail Operations"],
      },
      {
        divisionCode: "MGG-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Finance & Accounts", "Inventory & Warehouse", "Compliance & AML"],
      },
      {
        divisionCode: "MGG-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Compliance & AML", "Human Resources"],
      },
    ],
  },
  {
    id: "kanz-al-emarat",
    companyName: "Kanz Al Emarat Jewellery",
    divisions: [
      {
        divisionCode: "KAE-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Inventory & Warehouse", "Compliance & AML"],
      },
      {
        divisionCode: "KAE-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Human Resources", "IT & Systems", "Procurement"],
      },
      {
        divisionCode: "KAE-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Procurement", "Quality Assurance"],
      },
    ],
  },
  {
    id: "desert-rose-retail",
    companyName: "Desert Rose Retail Group",
    divisions: [
      {
        divisionCode: "DRR-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["IT & Systems", "Procurement"],
      },
      {
        divisionCode: "DRR-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Quality Assurance", "Logistics", "Customer Service"],
      },
      {
        divisionCode: "DRR-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Customer Service", "Retail Operations"],
      },
    ],
  },
  {
    id: "gulf-horizon-logistics",
    companyName: "Gulf Horizon Logistics",
    divisions: [
      {
        divisionCode: "GHL-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Logistics", "Customer Service"],
      },
      {
        divisionCode: "GHL-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Retail Operations", "Finance & Accounts", "Inventory & Warehouse"],
      },
      {
        divisionCode: "GHL-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["Inventory & Warehouse", "Compliance & AML"],
      },
    ],
  },
  {
    id: "al-waha-construction",
    companyName: "Al Waha Construction & Contracting",
    divisions: [
      {
        divisionCode: "AWC-BR-01",
        divisionName: "Dubai Division",
        subDivisions: ["Finance & Accounts", "Inventory & Warehouse"],
      },
      {
        divisionCode: "AWC-BR-02",
        divisionName: "Abu Dhabi Division",
        subDivisions: ["Compliance & AML", "Human Resources", "IT & Systems"],
      },
      {
        divisionCode: "AWC-BR-03",
        divisionName: "Sharjah Division",
        subDivisions: ["IT & Systems", "Procurement"],
      },
    ],
  },
];

/**
 * The live company/division/sub-division roster every consumer imports. Which
 * seed backs it depends on CLIENT_MODE_VALUE: the multi-company audit-firm
 * roster above, or the single-org DAR Exchange seed in
 * scope-library-static-indi-org.data.ts. Mirrors
 * SUB-DIVISION_STATIC_COMPANIES's switch in sub-division-static-data.ts.
 */
export const SCOPE_LIBRARY_STATIC_COMPANIES: ScopeLibraryStaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? SCOPE_LIBRARY_INDI_ORG_COMPANIES
    : AUDIT_FIRM_SCOPE_LIBRARY_COMPANIES;

/** Reads the REAL division list (division-static-data.ts) — not this file's own
 *  company/division array — so a division added via divisions.ts's Add Division
 *  flow is selectable here immediately. Excludes deactivated divisions (own
 *  status inactive, or parent company blocked) unless it's the division
 *  currently selected on the form being edited. */
export function scopeLibraryDivisionOptionsForCompany(
  companyId: string | null | undefined,
  opts?: { companyBlocked?: boolean; includeDivisionCode?: string | null },
): { label: string; value: string }[] {
  const company = DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) return [];
  return company.divisions
    .filter(b => (b.status === DivisionStatuses.Active && !opts?.companyBlocked) || b.divisionCode === opts?.includeDivisionCode)
    .map(b => ({ label: b.divisionName, value: b.divisionCode }));
}

/** Reads the REAL sub-division list (sub-division-static-data.ts) — not this
 *  file's own division array. Excludes deactivated sub-divisions (own status)
 *  unless it's the sub-division currently selected on the form being edited. */
export function scopeLibrarySubDivisionOptionsForDivision(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
  opts?: { includeSubDivisionName?: string | null },
): { label: string; value: string }[] {
  const division = SUB_DIVISION_STATIC_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode);
  if (!division) return [];
  return division.subDivisions
    .filter(d => d.status === SubDivisionStatuses.Active || d.subDivisionName === opts?.includeSubDivisionName)
    .map(d => ({ label: d.subDivisionName, value: d.subDivisionName }));
}

/* ── Mock scope library items — moved here from list/scope-library-list.component.ts so the
 * component reads its data the same way every other module does (data in
 * *-static-data.ts, component imports it). ────────────────────────────── */

const RAW_SCOPE_LIBRARY_AUDIT_FIRM: Omit<ScopeLibraryItem, 'status' | 'createdAt'>[] = [
  {
    id: 'sl-001',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'User Access Review',
    objective: 'Evaluate and validate user access rights to ensure the principle of least privilege is enforced across all systems.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-001', title: 'Privileged Access Review' },
      { id: 'ssl-002', title: 'Dormant Account Review' },
    ],
    riskCategory: 'Access Management',
    applicableFrameworks: ['COBIT', 'ISO 27001', 'SOX'],
  },
  {
    id: 'ssl-001',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Privileged Access Review',
    objective: 'Assess privileged user accounts and administrative access to critical systems and databases.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-001',
    parentScopeTitle: 'User Access Review',
    riskCategory: 'Access Management',
    applicableFrameworks: ['ISO 27001', 'COBIT'],
  },
  {
    id: 'ssl-002',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Dormant Account Review',
    objective: 'Identify and remediate inactive user accounts that have not been accessed within the defined inactivity period.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-001',
    parentScopeTitle: 'User Access Review',
    riskCategory: 'Access Management',
    applicableFrameworks: ['ISO 27001', 'SOX'],
  },
  {
    id: 'sl-002',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Change Management Audit',
    objective: 'Review the change management process to ensure all system changes are authorized, tested, and properly documented.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-003', title: 'Emergency Change Review' },
      { id: 'ssl-004', title: 'Standard Change Review' },
    ],
    riskCategory: 'Change Management',
    applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'ssl-003',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Emergency Change Review',
    objective: 'Assess emergency changes to IT systems to verify they follow accelerated approval processes and are properly documented.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-002',
    parentScopeTitle: 'Change Management Audit',
    riskCategory: 'Change Management',
    applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'ssl-004',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Standard Change Review',
    objective: 'Assess standard and normal system changes to confirm approval, testing, documentation, and post-implementation validation.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-002',
    parentScopeTitle: 'Change Management Audit',
    riskCategory: 'Change Management',
    applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-003',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Vendor Risk Assessment',
    objective: 'Evaluate third-party vendor relationships to assess risks related to data security, compliance, and service continuity.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-005', title: 'Third-Party Compliance Review' },
      { id: 'ssl-006', title: 'Vendor Contract Compliance' },
    ],
    riskCategory: 'Vendor Risk',
    applicableFrameworks: ['ISO 27001', 'NIST', 'PCI DSS'],
  },
  {
    id: 'ssl-005',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Third-Party Compliance Review',
    objective: 'Verify that third-party vendors comply with contractual security requirements and applicable regulations.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-003',
    parentScopeTitle: 'Vendor Risk Assessment',
    riskCategory: 'Vendor Risk',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-006',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Vendor Contract Compliance',
    objective: 'Review vendor contracts to ensure they include appropriate security, privacy, and compliance clauses.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-003',
    parentScopeTitle: 'Vendor Risk Assessment',
    riskCategory: 'Vendor Risk',
    applicableFrameworks: ['ISO 27001', 'PCI DSS'],
  },
  {
    id: 'sl-004',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Financial Reporting Controls',
    objective: 'Assess controls over financial reporting processes to ensure accuracy, completeness, and compliance with accounting standards.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-007', title: 'Revenue Recognition Review' },
      { id: 'ssl-008', title: 'Journal Entry Review' },
    ],
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-007',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Revenue Recognition Review',
    objective: 'Evaluate revenue recognition policies and procedures for compliance with applicable accounting standards.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-004',
    parentScopeTitle: 'Financial Reporting Controls',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-008',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Journal Entry Review',
    objective: 'Review manual and automated journal entries to verify authorization, supporting documentation, and proper accounting treatment.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-004',
    parentScopeTitle: 'Financial Reporting Controls',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-005',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'IT General Controls Review',
    objective: 'Assess IT general controls including logical access, change management, and computer operations to ensure system reliability.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-009', title: 'Backup and Recovery Review' },
      { id: 'ssl-010', title: 'IT Operations Monitoring Review' },
    ],
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['COBIT', 'ISO 27001', 'SOX'],
  },
  {
    id: 'ssl-009',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Backup and Recovery Review',
    objective: 'Assess backup schedules, backup completion monitoring, recovery testing, and restoration evidence for critical systems.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-005',
    parentScopeTitle: 'IT General Controls Review',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'ssl-010',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'IT Operations Monitoring Review',
    objective: 'Evaluate IT operations monitoring activities including job monitoring, incident tracking, escalation, and resolution controls.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-005',
    parentScopeTitle: 'IT General Controls Review',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-006',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Data Privacy Compliance',
    objective: 'Evaluate data privacy policies, procedures, and controls to ensure compliance with applicable privacy regulations and standards.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-011', title: 'Consent Management Review' },
      { id: 'ssl-012', title: 'Data Subject Request Review' },
    ],
    riskCategory: 'Data Privacy',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-011',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Consent Management Review',
    objective: 'Review how consent is captured, stored, withdrawn, and evidenced for personal data processing activities.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-006',
    parentScopeTitle: 'Data Privacy Compliance',
    riskCategory: 'Data Privacy',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-012',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Data Subject Request Review',
    objective: 'Assess whether data subject requests are logged, verified, processed, and responded to within required timelines.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-006',
    parentScopeTitle: 'Data Privacy Compliance',
    riskCategory: 'Data Privacy',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-007',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Business Continuity Assessment',
    objective: 'Review business continuity and disaster recovery plans to ensure the organization can maintain operations during disruptions.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-013', title: 'Business Impact Analysis Review' },
      { id: 'ssl-014', title: 'Disaster Recovery Testing Review' },
    ],
    riskCategory: 'Business Continuity',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-013',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Business Impact Analysis Review',
    objective: 'Review business impact analysis documentation, critical process identification, recovery objectives, and dependency mapping.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-007',
    parentScopeTitle: 'Business Continuity Assessment',
    riskCategory: 'Business Continuity',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'ssl-014',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Disaster Recovery Testing Review',
    objective: 'Assess disaster recovery test plans, test execution results, recovery time achievement, and remediation of test issues.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-007',
    parentScopeTitle: 'Business Continuity Assessment',
    riskCategory: 'Business Continuity',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-008',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Fraud Risk Assessment',
    objective: 'Identify and assess fraud risks within key business processes and evaluate the effectiveness of anti-fraud controls.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-015', title: 'Fraud Incident Review' },
      { id: 'ssl-016', title: 'Anti-Fraud Control Review' },
    ],
    riskCategory: 'Fraud Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-015',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Fraud Incident Review',
    objective: 'Review fraud incident records, investigation reports, root cause analysis, and corrective action tracking.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-008',
    parentScopeTitle: 'Fraud Risk Assessment',
    riskCategory: 'Fraud Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-016',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Anti-Fraud Control Review',
    objective: 'Evaluate preventive and detective anti-fraud controls including segregation of duties, approvals, monitoring, and escalation.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-008',
    parentScopeTitle: 'Fraud Risk Assessment',
    riskCategory: 'Fraud Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-009',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'Operational Risk Review',
    objective: 'Assess operational processes and controls to identify risks that could impact business operations, efficiency, and compliance.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-017', title: 'Operational Incident Review' },
      { id: 'ssl-018', title: 'SOP Compliance Review' },
    ],
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'ssl-017',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'Operational Incident Review',
    objective: 'Review operational incident logs, severity classification, corrective actions, and recurring issue analysis.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-009',
    parentScopeTitle: 'Operational Risk Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'ssl-018',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'SOP Compliance Review',
    objective: 'Assess adherence to approved standard operating procedures and review exceptions, deviations, and management approvals.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-009',
    parentScopeTitle: 'Operational Risk Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'sl-010',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Compliance Framework Review',
    objective: 'Evaluate the organization\'s compliance management framework to ensure adherence to applicable laws, regulations, and standards.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-019', title: 'Compliance Obligation Review' },
      { id: 'ssl-020', title: 'Policy Exception Review' },
    ],
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COBIT', 'COSO', 'SOX', 'NIST'],
  },
  {
    id: 'ssl-019',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Compliance Obligation Review',
    objective: 'Review regulatory and compliance obligation registers, assigned ownership, monitoring frequency, and evidence of compliance.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-010',
    parentScopeTitle: 'Compliance Framework Review',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COBIT', 'COSO', 'SOX', 'NIST'],
  },
  {
    id: 'ssl-020',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Policy Exception Review',
    objective: 'Review policy exception records, approvals, expiry dates, escalation, and closure of exceptions.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-010',
    parentScopeTitle: 'Compliance Framework Review',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COBIT', 'COSO', 'SOX'],
  },
  {
    id: 'sl-011',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Accounts Payable Controls Review',
    objective: 'Assess accounts payable controls to ensure vendor invoices are authorized, accurately recorded, and paid in accordance with policy.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-021', title: 'Invoice Approval Review' },
      { id: 'ssl-022', title: 'Duplicate Payment Review' },
    ],
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-021',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Invoice Approval Review',
    objective: 'Review invoice approval workflows, authority limits, supporting documentation, and exception handling.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-011',
    parentScopeTitle: 'Accounts Payable Controls Review',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-022',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Duplicate Payment Review',
    objective: 'Assess controls for detecting and preventing duplicate supplier invoices, duplicate payments, and vendor payment errors.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-011',
    parentScopeTitle: 'Accounts Payable Controls Review',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-012',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Accounts Receivable Controls Review',
    objective: 'Assess accounts receivable controls including billing, collections, credit limits, ageing, and impairment review.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-023', title: 'Customer Ageing Review' },
      { id: 'ssl-024', title: 'Credit Note Review' },
    ],
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-023',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Customer Ageing Review',
    objective: 'Review overdue customer balances, collection actions, ageing categories, and allowance for doubtful debts.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-012',
    parentScopeTitle: 'Accounts Receivable Controls Review',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-024',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Credit Note Review',
    objective: 'Review credit note approval, supporting justification, financial impact, and compliance with delegation of authority.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-012',
    parentScopeTitle: 'Accounts Receivable Controls Review',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-013',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Fixed Asset Management Review',
    objective: 'Assess controls over fixed asset acquisition, capitalization, depreciation, physical verification, and disposal.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-025', title: 'Physical Asset Verification' },
      { id: 'ssl-026', title: 'Asset Disposal Review' },
    ],
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-025',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Physical Asset Verification',
    objective: 'Verify physical existence, tagging, location, and condition of fixed assets against the fixed asset register.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-013',
    parentScopeTitle: 'Fixed Asset Management Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-026',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Asset Disposal Review',
    objective: 'Review asset disposals, approval evidence, accounting treatment, and supporting disposal documentation.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-013',
    parentScopeTitle: 'Fixed Asset Management Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-014',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'VAT Compliance Review',
    objective: 'Assess VAT filing, tax invoice compliance, input tax recovery, output tax reporting, and reconciliation to accounting records.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-027', title: 'Input Tax Credit Review' },
      { id: 'ssl-028', title: 'Output VAT Reconciliation' },
    ],
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-027',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Input Tax Credit Review',
    objective: 'Review input tax credit claims to ensure valid tax invoices, eligibility, and reconciliation to VAT filings.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-014',
    parentScopeTitle: 'VAT Compliance Review',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'ssl-028',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Output VAT Reconciliation',
    objective: 'Review output VAT reconciliation between sales records, tax returns, and general ledger balances.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-014',
    parentScopeTitle: 'VAT Compliance Review',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-015',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Payroll Controls Review',
    objective: 'Assess payroll processing controls including employee master data, salary changes, benefits, deductions, and payroll reconciliation.',
    scopeLevel: 'scope',
    subScopes: [
      { id: 'ssl-029', title: 'Payroll Master Data Review' },
      { id: 'ssl-030', title: 'Overtime and Allowance Review' },
    ],
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-029',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Payroll Master Data Review',
    objective: 'Review payroll master data changes, approval evidence, employee bank account changes, and HR-payroll reconciliation.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-015',
    parentScopeTitle: 'Payroll Controls Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'ssl-030',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Overtime and Allowance Review',
    objective: 'Review overtime, allowance, and benefit payments to ensure approval, accuracy, and alignment with HR policy.',
    scopeLevel: 'subscope',
    parentScopeId: 'sl-015',
    parentScopeTitle: 'Payroll Controls Review',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-016',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Procurement Process Review',
    objective: 'Assess procurement controls including purchase requisitions, purchase orders, vendor selection, approvals, and policy compliance.',
    scopeLevel: 'scope',
    riskCategory: 'Vendor Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-017',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Contract Management Review',
    objective: 'Evaluate contract creation, legal review, approval, renewal tracking, storage, and compliance with contractual obligations.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'ISO 27001'],
  },
  {
    id: 'sl-018',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Information Security Governance Review',
    objective: 'Assess information security governance, policies, roles, responsibilities, risk reporting, and management oversight.',
    scopeLevel: 'scope',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['ISO 27001', 'NIST', 'COBIT'],
  },
  {
    id: 'sl-019',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Cybersecurity Controls Review',
    objective: 'Evaluate cybersecurity controls including vulnerability management, endpoint protection, monitoring, and incident response.',
    scopeLevel: 'scope',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-020',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'Incident Management Review',
    objective: 'Assess incident logging, classification, escalation, resolution, root cause analysis, and management reporting.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COBIT', 'ISO 27001'],
  },
  {
    id: 'sl-021',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Risk Management Framework Review',
    objective: 'Evaluate enterprise risk management governance, risk registers, risk appetite, control mapping, and action tracking.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-022',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Delegation of Authority Review',
    objective: 'Assess approval authority matrices, transaction limits, exception approvals, and compliance with delegated authority requirements.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-023',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Corporate Governance Review',
    objective: 'Review board governance, committee oversight, meeting minutes, resolutions, conflicts of interest, and action tracking.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-024',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'AML Controls Review',
    objective: 'Assess anti-money laundering controls including KYC, screening, transaction monitoring, STR escalation, and governance.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['NIST', 'ISO 27001'],
  },
  {
    id: 'sl-025',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-02',
    subDivision: 'Customer Service',
    title: 'Client Onboarding Review',
    objective: 'Evaluate client onboarding controls including documentation, risk assessment, approvals, engagement setup, and compliance checks.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-026',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Treasury Management Review',
    objective: 'Assess treasury controls over bank accounts, cash forecasting, fund transfers, liquidity management, and approvals.',
    scopeLevel: 'scope',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-027',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Bank Reconciliation Review',
    objective: 'Review bank reconciliation controls including preparation, review, reconciling items, clearance, and management sign-off.',
    scopeLevel: 'scope',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['SOX', 'COSO'],
  },
  {
    id: 'sl-028',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Inventory & Warehouse',
    title: 'Inventory Management Review',
    objective: 'Assess inventory controls including stock counts, adjustments, valuation, obsolete stock, and reconciliation to accounting records.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-029',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'Project Management Controls Review',
    objective: 'Evaluate project governance, budgets, milestones, change requests, risk logs, approvals, and closure documentation.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COSO', 'COBIT'],
  },
  {
    id: 'sl-030',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Human Resources',
    title: 'Health and Safety Compliance Review',
    objective: 'Assess workplace health and safety controls including incident reporting, inspections, PPE, training, and regulatory compliance.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['COBIT', 'COSO'],
  },
  {
    id: 'sl-031',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Quality Assurance',
    title: 'Quality Management Review',
    objective: 'Evaluate quality control procedures, inspection evidence, non-conformance tracking, corrective actions, and management reporting.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-032',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Budgeting and Forecasting Review',
    objective: 'Assess budget preparation, forecasting assumptions, approvals, variance analysis, and management reporting controls.',
    scopeLevel: 'scope',
    riskCategory: 'Financial Risk',
    applicableFrameworks: ['COSO', 'SOX'],
  },
  {
    id: 'sl-033',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Regulatory Reporting Review',
    objective: 'Evaluate regulatory reporting controls to ensure reports are   accurate, complete, reviewed, and submitted within required timelines.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COSO', 'SOX', 'COBIT'],
  },
  {
    id: 'sl-034',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Records Management Review',
    objective: 'Assess records management controls including document retention, archival, retrieval, destruction, and access restrictions.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-035',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Retail Operations',
    title: 'Physical Security Review',
    objective: 'Evaluate physical security controls including facility access, visitor management, CCTV monitoring, and restricted area controls.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['ISO 27001', 'NIST'],
  },
  {
    id: 'sl-036',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Cloud Security Review',
    objective: 'Assess cloud governance, identity controls, configuration management, logging, encryption, and compliance monitoring.',
    scopeLevel: 'scope',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['ISO 27001', 'NIST', 'COBIT'],
  },
  {
    id: 'sl-037',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Application Controls Review',
    objective: 'Evaluate application controls including input validation, processing controls, interface controls, approvals, and audit trails.',
    scopeLevel: 'scope',
    riskCategory: 'IT General Controls',
    applicableFrameworks: ['COBIT', 'SOX'],
  },
  {
    id: 'sl-038',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Data Governance Review',
    objective: 'Assess data governance controls including data ownership, classification, quality, lineage, access, and stewardship.',
    scopeLevel: 'scope',
    riskCategory: 'Data Privacy',
    applicableFrameworks: ['COBIT', 'ISO 27001', 'NIST'],
  },
  {
    id: 'sl-039',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Human Resources',
    title: 'Training and Awareness Review',
    objective: 'Evaluate mandatory training programs, awareness campaigns, completion tracking, escalation, and employee acknowledgements.',
    scopeLevel: 'scope',
    riskCategory: 'Operational Risk',
    applicableFrameworks: ['ISO 27001', 'COSO'],
  },
  {
    id: 'sl-040',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Policy Management Review',
    objective: 'Assess policy governance including policy ownership, review cycles, approvals, communication, exceptions, and attestation tracking.',
    scopeLevel: 'scope',
    riskCategory: 'Compliance Risk',
    applicableFrameworks: ['COBIT', 'COSO', 'ISO 27001'],
  },
];

// Rotating pool of submitters for items that land in the default "approved"
// bucket below (i.e. every item that isn't one of the two special
// pending_review/rejected indices, which keep their own hand-picked names).
const APPROVED_SCOPE_SUBMITTERS = ['Yousef Al Marri', 'Layla Hassan', 'Khalid Al Shamsi', 'Noura Al Blooshi', 'Rashid Al Nuaimi'];

const MOCK_SCOPE_LIBRARY_AUDIT_FIRM: ScopeLibraryItem[] = RAW_SCOPE_LIBRARY_AUDIT_FIRM.map((item, i) => ({
  ...item,
  status: (i % 12 === 0 ? 'pending_review' : i % 17 === 0 ? 'rejected' : 'approved') as ScopeLibraryStatus,
  createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}T09:00:00.000Z`,
  submittedBy: i % 12 === 0
    ? 'Aisha Al Mansoori'
    : i % 17 === 0
      ? 'Omar Al Suwaidi'
      : APPROVED_SCOPE_SUBMITTERS[i % APPROVED_SCOPE_SUBMITTERS.length],
  ...(i % 12 === 0 ? { submittedDate: '2026-07-20', dueDate: '2026-08-10' } : {}),
  ...(i % 17 === 0 ? { submittedDate: '2026-07-15', dueDate: null } : {}),
}));

/**
 * The live scope library every consumer imports. Which seed backs it depends
 * on CLIENT_MODE_VALUE: the multi-company audit-firm list above, or the
 * single-org DAR Exchange list in scope-library-static-indi-org.data.ts.
 * Mirrors SCOPE_LIBRARY_STATIC_COMPANIES's switch above.
 */
export const MOCK_SCOPE_LIBRARY: ScopeLibraryItem[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? MOCK_SCOPE_LIBRARY_INDI_ORG
    : MOCK_SCOPE_LIBRARY_AUDIT_FIRM;

export function upsertScopeLibraryItem(item: Omit<ScopeLibraryItem, 'id' | 'createdAt'> & { id?: string }): ScopeLibraryItem {
  // Filed under the sub-division when one was picked, else directly under the division.
  const saved: ScopeLibraryItem = { ...item, subDivision: item.subDivision || '', hasSubDivision: !!item.subDivision, id: item.id ?? `${SCOPE_LIBRARY_ID_PREFIX}${Date.now()}`, createdAt: new Date().toISOString() } as ScopeLibraryItem;
  MOCK_SCOPE_LIBRARY.unshift(saved);
  return saved;
}
export function editScopeLibraryItem(id: string, updates: Partial<ScopeLibraryItem>): void {
  const idx = MOCK_SCOPE_LIBRARY.findIndex(s => s.id === id);
  if (idx < 0) return;
  const merged: ScopeLibraryItem = { ...MOCK_SCOPE_LIBRARY[idx], ...updates, id };
  if (updates.subDivision !== undefined) merged.hasSubDivision = !!updates.subDivision;
  MOCK_SCOPE_LIBRARY[idx] = merged;
}
export function setScopeLibraryStatus(id: string, status: ScopeLibraryStatus): void {
  editScopeLibraryItem(id, { status });
}
