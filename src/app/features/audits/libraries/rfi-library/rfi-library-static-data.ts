// Self-contained company -> division -> sub-division static data for the RFI
// Library module (manage/rfi-library.component.ts) -- like
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
import { RFI_LIBRARY_INDI_ORG_COMPANIES, MOCK_RFI_LIBRARY_INDI_ORG } from './rfi-library-static-indi-org.data';
import type { RfiLibraryItem, RfiLibraryStatus } from './models/rfi-library-list.model';
import type { RfiLibraryStaticCompany } from './models/rfi-library-static-data.model';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import { RFI_LIBRARY_ID_PREFIX } from './constants/rfi-library.constants';

const AUDIT_FIRM_RFI_LIBRARY_COMPANIES: RfiLibraryStaticCompany[] = [
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
 * rfi-library-static-indi-org.data.ts. Mirrors SUB-DIVISION_STATIC_COMPANIES's
 * switch in sub-division-static-data.ts.
 */
export const RFI_LIBRARY_STATIC_COMPANIES: RfiLibraryStaticCompany[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? RFI_LIBRARY_INDI_ORG_COMPANIES
    : AUDIT_FIRM_RFI_LIBRARY_COMPANIES;

/** Reads the REAL division list (division-static-data.ts) — not this file's own
 *  company/division array — so a division added via divisions.ts's Add Division
 *  flow is selectable here immediately. Excludes deactivated divisions (own
 *  status inactive, or parent company blocked) unless it's the division
 *  currently selected on the form being edited. */
export function rfiLibraryDivisionOptionsForCompany(
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
export function rfiLibrarySubDivisionOptionsForDivision(
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

/* ── Mock RFI library items -- moved here from list/rfi-library-list.component.ts so the
 * component reads its data the same way every other module does (data in
 * *-static-data.ts, component imports it). ------------------------------- */

const RAW_RFI_LIBRARY_AUDIT_FIRM: Omit<RfiLibraryItem, 'status' | 'createdAt'>[] = [
  {
    id: 'rfi-007',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Privileged User Access Listing',
    description: 'Request for privileged user access listing, approvals, and periodic review evidence.',
    category: 'Evidence & Document Requests',
    priority: 'critical',
    tags: ['Privileged Access', 'User Listing', 'Review'],
    questions: [
      'Please provide the current list of privileged users across all critical systems.',
      'Who approved privileged access for each user?',
      'When was the last privileged access review performed?',
      'Were any inappropriate privileged accounts identified and removed?',
    ],
    scopeId: 'sl-001',
    scopeTitle: 'User Access Review',
    subScopeId: 'ssl-001',
    subScopeTitle: 'Privileged Access Review',
  },
  {
    id: 'rfi-008',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'User Access Termination Evidence',
    description: 'Request for evidence that user access is removed promptly after employee exit or role change.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['User Access', 'Termination', 'HR'],
    questions: [
      'Please provide the list of employees terminated during the audit period.',
      'Was system access removed for all terminated employees on time?',
      'Please share access removal tickets or workflow approvals.',
      'How are HR termination records reconciled with active system users?',
    ],
    scopeId: 'sl-001',
    scopeTitle: 'User Access Review',
  },
  {
    id: 'rfi-009',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Periodic Access Review Evidence',
    description: 'Request for quarterly or periodic user access certification evidence.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Access Review', 'Certification', 'Quarterly'],
    questions: [
      'Please provide completed access review certifications for the audit period.',
      'Who reviewed and approved the access certifications?',
      'Were access exceptions identified during the review?',
      'Please provide evidence of remediation for identified exceptions.',
    ],
    scopeId: 'sl-001',
    scopeTitle: 'User Access Review',
  },
  {
    id: 'rfi-010',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Emergency Access Usage Log',
    description: 'Request for emergency or break-glass access usage logs and approval evidence.',
    category: 'System & IT Logic Inquiries',
    priority: 'high',
    tags: ['Emergency Access', 'Break Glass', 'Log'],
    questions: [
      'Please provide all emergency access usage logs for the audit period.',
      'Was emergency access approved before or after usage?',
      'Are emergency access activities independently reviewed?',
      'Were any unauthorized emergency access events identified?',
    ],
    scopeId: 'sl-001',
    scopeTitle: 'User Access Review',
    subScopeId: 'ssl-001',
    subScopeTitle: 'Privileged Access Review',
  },
  {
    id: 'rfi-011',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Production Change Approval Evidence',
    description: 'Request for production change approvals, testing results, and deployment records.',
    category: 'Process & Control Walkthroughs',
    priority: 'high',
    tags: ['Change Management', 'Production', 'Approval'],
    questions: [
      'Please provide production change requests implemented during the audit period.',
      'Were all changes approved before deployment?',
      'Is testing evidence available for each production change?',
      'Were business owners involved in UAT approval?',
    ],
    scopeId: 'sl-002',
    scopeTitle: 'Change Management Audit',
  },
  {
    id: 'rfi-012',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Emergency Change Ratification',
    description: 'Request for emergency change records and post-implementation approval evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'medium',
    tags: ['Emergency Change', 'Ratification', 'Approval'],
    questions: [
      'Please provide all emergency changes raised during the audit period.',
      'Were emergency changes ratified after implementation?',
      'Who reviewed the emergency change impact?',
      'Were emergency changes later converted into standard change records?',
    ],
    scopeId: 'sl-002',
    scopeTitle: 'Change Management Audit',
  },
  {
    id: 'rfi-013',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Change Failure and Rollback Analysis',
    description: 'Request for failed change records, rollback evidence, and root cause analysis.',
    category: 'System & IT Logic Inquiries',
    priority: 'medium',
    tags: ['Rollback', 'Failed Change', 'RCA'],
    questions: [
      'Please provide details of failed changes during the audit period.',
      'Were rollback plans executed successfully?',
      'Was root cause analysis performed for failed changes?',
      'Were lessons learned documented and tracked?',
    ],
    scopeId: 'sl-002',
    scopeTitle: 'Change Management Audit',
  },
  {
    id: 'rfi-014',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Vendor Onboarding Due Diligence',
    description: 'Request for vendor onboarding documentation, due diligence checks, and approvals.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Vendor', 'Onboarding', 'Due Diligence'],
    questions: [
      'Please provide vendor onboarding forms for new vendors added during the audit period.',
      'Were sanctions and background checks completed before onboarding?',
      'Who approved the vendor onboarding?',
      'Are vendor risk ratings assigned and reviewed periodically?',
    ],
    scopeId: 'sl-003',
    scopeTitle: 'Vendor Risk Assessment',
  },
  {
    id: 'rfi-015',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Third-Party Risk Assessment Reports',
    description: 'Request for third-party risk assessment reports and remediation tracking.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['Third Party', 'Risk Assessment', 'Vendor'],
    questions: [
      'Please provide third-party risk assessment reports for high-risk vendors.',
      'How often are vendor risk assessments refreshed?',
      'Were any high-risk findings identified?',
      'Please provide remediation status for vendor risk findings.',
    ],
    scopeId: 'sl-003',
    scopeTitle: 'Vendor Risk Assessment',
  },
  {
    id: 'rfi-016',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Vendor Performance Review Evidence',
    description: 'Request for vendor performance monitoring reports and SLA review evidence.',
    category: 'Process & Control Walkthroughs',
    priority: 'medium',
    tags: ['Vendor Performance', 'SLA', 'Monitoring'],
    questions: [
      'Please provide vendor SLA performance reports for the audit period.',
      'Are SLA breaches tracked and escalated?',
      'Who reviews vendor performance reports?',
      'Were penalties or corrective actions applied for SLA breaches?',
    ],
    scopeId: 'sl-003',
    scopeTitle: 'Vendor Risk Assessment',
  },
  {
    id: 'rfi-017',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'General Ledger Reconciliation Evidence',
    description: 'Request for general ledger reconciliation schedules and approval evidence.',
    category: 'Evidence & Document Requests',
    priority: 'critical',
    tags: ['GL', 'Reconciliation', 'Finance'],
    questions: [
      'Please provide monthly general ledger reconciliation schedules.',
      'Are reconciliations reviewed and approved by finance management?',
      'Were unreconciled differences identified during the period?',
      'Please provide evidence of clearance for reconciling items.',
    ],
    scopeId: 'sl-004',
    scopeTitle: 'Financial Reporting Controls',
  },
  {
    id: 'rfi-018',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Journal Entry Approval Listing',
    description: 'Request for manual journal entries, supporting documents, and approval workflow evidence.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Journal Entry', 'Approval', 'Finance'],
    questions: [
      'Please provide manual journal entries posted during the audit period.',
      'Were all journal entries supported by appropriate documentation?',
      'Who reviewed and approved manual journal entries?',
      'Were unusual or late journal entries separately reviewed?',
    ],
    scopeId: 'sl-004',
    scopeTitle: 'Financial Reporting Controls',
  },
  {
    id: 'rfi-019',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Revenue Contract Review',
    description: 'Request for customer contracts, billing milestones, and revenue recognition assessment.',
    category: 'Policy & Compliance Verification',
    priority: 'critical',
    tags: ['Revenue', 'Contract', 'IFRS'],
    questions: [
      'Please provide major customer contracts active during the audit period.',
      'How are performance obligations identified and documented?',
      'Are billing milestones aligned with revenue recognition?',
      'Were any revenue adjustments posted during period-end closing?',
    ],
    scopeId: 'sl-004',
    scopeTitle: 'Financial Reporting Controls',
    subScopeId: 'ssl-007',
    subScopeTitle: 'Revenue Recognition Review',
  },
  {
    id: 'rfi-020',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Month-End Close Checklist',
    description: 'Request for month-end close checklist, sign-offs, and closing timetable evidence.',
    category: 'Process & Control Walkthroughs',
    priority: 'medium',
    tags: ['Month End', 'Close', 'Checklist'],
    questions: [
      'Please provide month-end close checklists for the audit period.',
      'Were all close activities completed within the defined timeline?',
      'Who reviewed and signed off the close checklist?',
      'Were any late close activities escalated to management?',
    ],
    scopeId: 'sl-004',
    scopeTitle: 'Financial Reporting Controls',
  },
  {
    id: 'rfi-021',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Server Inventory and Ownership',
    description: 'Request for server inventory, ownership details, and criticality classification.',
    category: 'System & IT Logic Inquiries',
    priority: 'medium',
    tags: ['Server', 'Inventory', 'Ownership'],
    questions: [
      'Please provide the latest server inventory.',
      'Are business owners assigned to each critical server?',
      'How is server criticality determined?',
      'Are decommissioned servers removed from the inventory promptly?',
    ],
    scopeId: 'sl-005',
    scopeTitle: 'IT General Controls Review',
  },
  {
    id: 'rfi-022',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Backup Configuration and Restoration Evidence',
    description: 'Request for backup schedules, restoration test results, and backup failure logs.',
    category: 'System & IT Logic Inquiries',
    priority: 'high',
    tags: ['Backup', 'Restore', 'ITGC'],
    questions: [
      'Please provide backup schedules for critical systems.',
      'Were backup jobs completed successfully during the audit period?',
      'Please provide evidence of backup restoration testing.',
      'How are backup failures investigated and resolved?',
    ],
    scopeId: 'sl-005',
    scopeTitle: 'IT General Controls Review',
  },
  {
    id: 'rfi-023',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Incident Management Tickets',
    description: 'Request for incident tickets, severity classification, resolution timelines, and root cause evidence.',
    category: 'Process & Control Walkthroughs',
    priority: 'medium',
    tags: ['Incident', 'Ticket', 'ITSM'],
    questions: [
      'Please provide incident tickets logged during the audit period.',
      'How are incidents classified by severity?',
      'Were high-severity incidents resolved within SLA?',
      'Was root cause analysis performed for recurring incidents?',
    ],
    scopeId: 'sl-005',
    scopeTitle: 'IT General Controls Review',
  },
  {
    id: 'rfi-024',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-03',
    subDivision: 'IT & Systems',
    title: 'Patch Management Compliance Report',
    description: 'Request for patch deployment reports, exceptions, and vulnerability remediation evidence.',
    category: 'System & IT Logic Inquiries',
    priority: 'high',
    tags: ['Patch', 'Vulnerability', 'Compliance'],
    questions: [
      'Please provide patch compliance reports for critical servers.',
      'Are critical patches deployed within policy timelines?',
      'Were any patch exceptions approved by management?',
      'How are failed patch deployments remediated?',
    ],
    scopeId: 'sl-005',
    scopeTitle: 'IT General Controls Review',
  },
  {
    id: 'rfi-025',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Data Retention Schedule',
    description: 'Request for data retention schedule, deletion controls, and archival evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'medium',
    tags: ['Data Retention', 'Privacy', 'Deletion'],
    questions: [
      'Please provide the approved data retention schedule.',
      'How are expired records identified for deletion or archival?',
      'Who approves exceptions to retention timelines?',
      'Is deletion evidence retained for audit purposes?',
    ],
    scopeId: 'sl-006',
    scopeTitle: 'Data Privacy Compliance',
  },
  {
    id: 'rfi-026',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Data Subject Request Register',
    description: 'Request for data subject access request register and response tracking evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['DSAR', 'Privacy', 'Register'],
    questions: [
      'Please provide the register of data subject requests received during the audit period.',
      'Were all requests responded to within regulatory timelines?',
      'How is identity verified before responding to requests?',
      'Were any requests rejected or escalated to legal?',
    ],
    scopeId: 'sl-006',
    scopeTitle: 'Data Privacy Compliance',
  },
  {
    id: 'rfi-027',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Privacy Breach Incident Records',
    description: 'Request for privacy breach logs, investigation reports, and notification evidence.',
    category: 'Evidence & Document Requests',
    priority: 'critical',
    tags: ['Privacy Breach', 'Incident', 'Notification'],
    questions: [
      'Please provide privacy breach incidents recorded during the audit period.',
      'Were breaches assessed for regulatory notification requirements?',
      'Were affected individuals notified where required?',
      'Please share corrective actions taken after each breach.',
    ],
    scopeId: 'sl-006',
    scopeTitle: 'Data Privacy Compliance',
  },
  {
    id: 'rfi-028',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Accounts Payable Aging Report',
    description: 'Request for AP aging report, overdue payable analysis, and supplier reconciliation evidence.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['AP', 'Aging', 'Supplier'],
    questions: [
      'Please provide the AP aging report as of period end.',
      'Are overdue supplier balances reviewed by finance management?',
      'Were any debit balances or unusual supplier balances identified?',
      'Please provide reconciliation evidence for key suppliers.',
    ],
    scopeId: 'sl-011',
    scopeTitle: 'Accounts Payable Controls Review',
  },
  {
    id: 'rfi-029',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Duplicate Payment Review',
    description: 'Request for duplicate payment analysis and recovery evidence.',
    category: 'System & IT Logic Inquiries',
    priority: 'high',
    tags: ['Duplicate Payment', 'AP', 'Control'],
    questions: [
      'Please provide duplicate payment exception reports.',
      'What automated controls prevent duplicate invoice processing?',
      'Were duplicate payments identified during the audit period?',
      'Please provide recovery evidence for duplicate payments, if any.',
    ],
    scopeId: 'sl-011',
    scopeTitle: 'Accounts Payable Controls Review',
  },
  {
    id: 'rfi-030',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Purchase Order Matching Evidence',
    description: 'Request for three-way matching evidence between purchase orders, goods receipts, and invoices.',
    category: 'Process & Control Walkthroughs',
    priority: 'medium',
    tags: ['PO', 'Three Way Match', 'Procurement'],
    questions: [
      'Please provide sample transactions showing three-way match evidence.',
      'Are invoices blocked if purchase order or goods receipt details do not match?',
      'Who approves matching exceptions?',
      'Were any manual overrides performed during the audit period?',
    ],
    scopeId: 'sl-011',
    scopeTitle: 'Accounts Payable Controls Review',
  },
  {
    id: 'rfi-031',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Accounts Receivable Aging Report',
    description: 'Request for AR aging report, collection status, and impairment assessment.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['AR', 'Aging', 'Collections'],
    questions: [
      'Please provide the AR aging report as of period end.',
      'Are overdue customer balances reviewed regularly?',
      'What collection actions were taken for balances over 90 days?',
      'How is allowance for doubtful debts calculated?',
    ],
    scopeId: 'sl-012',
    scopeTitle: 'Accounts Receivable Controls Review',
  },
  {
    id: 'rfi-032',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Customer Credit Limit Review',
    description: 'Request for customer credit limits, approvals, and exception reports.',
    category: 'Policy & Compliance Verification',
    priority: 'medium',
    tags: ['Credit Limit', 'Customer', 'AR'],
    questions: [
      'Please provide customer credit limit master data.',
      'Who approves new or revised customer credit limits?',
      'Were any customers allowed to exceed credit limits?',
      'Please provide exception approval evidence for limit breaches.',
    ],
    scopeId: 'sl-012',
    scopeTitle: 'Accounts Receivable Controls Review',
  },
  {
    id: 'rfi-033',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Credit Note Approval Evidence',
    description: 'Request for credit note listing, approval workflow, and supporting documents.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Credit Note', 'Approval', 'Revenue'],
    questions: [
      'Please provide all credit notes issued during the audit period.',
      'Were credit notes approved according to authority limits?',
      'What supporting documents are required before issuing credit notes?',
      'Were unusual or high-value credit notes independently reviewed?',
    ],
    scopeId: 'sl-012',
    scopeTitle: 'Accounts Receivable Controls Review',
  },
  {
    id: 'rfi-034',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Fixed Asset Register',
    description: 'Request for fixed asset register, additions, disposals, and depreciation records.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Fixed Asset', 'Register', 'Depreciation'],
    questions: [
      'Please provide the complete fixed asset register.',
      'Were asset additions supported by approved purchase documents?',
      'How is depreciation calculated and reviewed?',
      'Were asset disposals approved by management?',
    ],
    scopeId: 'sl-013',
    scopeTitle: 'Fixed Asset Management Review',
  },
  {
    id: 'rfi-035',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Physical Asset Verification Results',
    description: 'Request for physical asset verification reports and discrepancy resolution evidence.',
    category: 'Process & Control Walkthroughs',
    priority: 'medium',
    tags: ['Physical Verification', 'Asset', 'Inventory'],
    questions: [
      'Please provide the latest physical asset verification report.',
      'Were discrepancies identified between physical assets and the register?',
      'Who investigated and approved adjustments?',
      'Are asset tags applied to all movable assets?',
    ],
    scopeId: 'sl-013',
    scopeTitle: 'Fixed Asset Management Review',
  },
  {
    id: 'rfi-036',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Asset Disposal Approval Records',
    description: 'Request for asset disposal records, approvals, and accounting treatment evidence.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Asset Disposal', 'Approval', 'Finance'],
    questions: [
      'Please provide asset disposals recorded during the audit period.',
      'Were disposals approved before removal from records?',
      'Were gains or losses on disposal calculated correctly?',
      'Is disposal evidence retained with finance records?',
    ],
    scopeId: 'sl-013',
    scopeTitle: 'Fixed Asset Management Review',
  },
  {
    id: 'rfi-037',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'VAT Return Filing Evidence',
    description: 'Request for VAT return filings, payment confirmations, and supporting schedules.',
    category: 'Policy & Compliance Verification',
    priority: 'critical',
    tags: ['VAT', 'Filing', 'Tax'],
    questions: [
      'Please provide VAT returns filed during the audit period.',
      'Were VAT returns filed within statutory deadlines?',
      'Please share VAT payment confirmation evidence.',
      'Were VAT return amounts reconciled to the general ledger?',
    ],
    scopeId: 'sl-014',
    scopeTitle: 'VAT Compliance Review',
  },
  {
    id: 'rfi-038',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Input Tax Credit Support',
    description: 'Request for input tax credit reconciliation and supporting supplier tax invoices.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Input Tax', 'VAT', 'Invoice'],
    questions: [
      'Please provide input tax credit reconciliation for the audit period.',
      'Are all claimed input credits supported by valid tax invoices?',
      'Were blocked or ineligible credits excluded from returns?',
      'Who reviewed and approved the reconciliation?',
    ],
    scopeId: 'sl-014',
    scopeTitle: 'VAT Compliance Review',
  },
  {
    id: 'rfi-039',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Output VAT Reconciliation',
    description: 'Request for output VAT reconciliation between sales records, VAT returns, and general ledger.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Output VAT', 'Sales', 'Reconciliation'],
    questions: [
      'Please provide output VAT reconciliation for the audit period.',
      'Are taxable, exempt, and zero-rated sales separately identified?',
      'Were differences between sales ledger and VAT returns investigated?',
      'Please provide management approval of the final reconciliation.',
    ],
    scopeId: 'sl-014',
    scopeTitle: 'VAT Compliance Review',
  },
  {
    id: 'rfi-040',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Payroll Register and Salary Changes',
    description: 'Request for payroll register, salary change approvals, and monthly payroll reconciliation.',
    category: 'Evidence & Document Requests',
    priority: 'high',
    tags: ['Payroll', 'Salary', 'HR'],
    questions: [
      'Please provide monthly payroll registers for the audit period.',
      'Were salary changes approved before payroll processing?',
      'Is payroll reconciled to the general ledger monthly?',
      'Were terminated employees removed from payroll on time?',
    ],
    scopeId: 'sl-015',
    scopeTitle: 'Payroll Controls Review',
  },
  {
    id: 'rfi-041',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Employee Master Data Listing',
    description: 'Request for employee master data, active employee listing, and HR approval evidence.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Employee Master', 'HR', 'Payroll'],
    questions: [
      'Please provide the active employee master data listing.',
      'Who is authorized to update employee master data?',
      'Were changes to bank accounts independently verified?',
      'How are HR records reconciled with payroll records?',
    ],
    scopeId: 'sl-015',
    scopeTitle: 'Payroll Controls Review',
  },
  {
    id: 'rfi-042',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-01',
    subDivision: 'Finance & Accounting',
    title: 'Overtime and Allowance Approval',
    description: 'Request for overtime, allowance, and benefit approval records.',
    category: 'Policy & Compliance Verification',
    priority: 'medium',
    tags: ['Overtime', 'Allowance', 'Approval'],
    questions: [
      'Please provide overtime and allowance payments during the audit period.',
      'Were overtime hours approved before payment?',
      'Are allowances supported by employment contracts or HR policy?',
      'Were exceptional payments reviewed by management?',
    ],
    scopeId: 'sl-015',
    scopeTitle: 'Payroll Controls Review',
  },
  {
    id: 'rfi-043',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-02',
    subDivision: 'Customer Service',
    title: 'Employee Onboarding File Review',
    description: 'Request for employee onboarding files, signed contracts, and background check evidence.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Onboarding', 'Employee File', 'HR'],
    questions: [
      'Please provide onboarding files for employees hired during the audit period.',
      'Are signed employment contracts available for all new joiners?',
      'Were background checks completed before joining?',
      'Is onboarding checklist completion reviewed by HR?',
    ],
    scopeId: 'sl-025',
    scopeTitle: 'Client Onboarding Review',
  },
  {
    id: 'rfi-044',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Human Resources',
    title: 'Training Completion Records',
    description: 'Request for mandatory training completion records and escalation evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'low',
    tags: ['Training', 'HR', 'Compliance'],
    questions: [
      'Please provide mandatory training completion reports.',
      'Which trainings are mandatory for new joiners?',
      'Were overdue trainings escalated to line managers?',
      'How is training completion tracked and reported?',
    ],
    scopeId: 'sl-039',
    scopeTitle: 'Training and Awareness Review',
  },
  {
    id: 'rfi-045',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Procurement Policy Compliance',
    description: 'Request for procurement policy, purchase requisitions, and approval compliance evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['Procurement', 'Policy', 'Approval'],
    questions: [
      'Please provide the current procurement policy.',
      'Were purchase requisitions approved before purchase orders were issued?',
      'Were competitive quotations obtained where required?',
      'Were policy exceptions approved and documented?',
    ],
    scopeId: 'sl-016',
    scopeTitle: 'Procurement Process Review',
  },
  {
    id: 'rfi-046',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Tender Evaluation Records',
    description: 'Request for tender evaluation documents, vendor scoring, and award approvals.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Tender', 'Evaluation', 'Vendor Selection'],
    questions: [
      'Please provide tender evaluation records for selected procurements.',
      'Were vendor evaluation criteria defined before bid opening?',
      'Who approved the final vendor selection?',
      'Were conflicts of interest declared by evaluation committee members?',
    ],
    scopeId: 'sl-016',
    scopeTitle: 'Procurement Process Review',
  },
  {
    id: 'rfi-047',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Purchase Order Exception Report',
    description: 'Request for purchase order exceptions, retrospective approvals, and override evidence.',
    category: 'System & IT Logic Inquiries',
    priority: 'medium',
    tags: ['PO Exception', 'Override', 'Procurement'],
    questions: [
      'Please provide purchase order exception reports for the audit period.',
      'Were any purchase orders created after invoice receipt?',
      'Who approved retrospective purchase orders?',
      'Are system controls in place to prevent unauthorized PO changes?',
    ],
    scopeId: 'sl-016',
    scopeTitle: 'Procurement Process Review',
  },
  {
    id: 'rfi-048',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Contract Renewal Tracker',
    description: 'Request for contract renewal tracker, expiry monitoring, and renewal approval evidence.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Contract', 'Renewal', 'Legal'],
    questions: [
      'Please provide the contract renewal tracker.',
      'Are contract expiry dates monitored by the legal or procurement team?',
      'Were contracts renewed before expiry?',
      'Who approves contract renewal or extension?',
    ],
    scopeId: 'sl-017',
    scopeTitle: 'Contract Management Review',
  },
  {
    id: 'rfi-049',
    company: 'falcon-gulf-jewellery',
    division: 'FGJ-BR-01',
    subDivision: 'Procurement',
    title: 'Legal Review Evidence for Contracts',
    description: 'Request for legal review comments, contract approval workflow, and signed agreements.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['Legal Review', 'Contract', 'Approval'],
    questions: [
      'Please provide contracts executed during the audit period.',
      'Was legal review completed before contract signing?',
      'Were deviations from standard contract terms approved?',
      'Are fully signed copies stored in the contract repository?',
    ],
    scopeId: 'sl-017',
    scopeTitle: 'Contract Management Review',
  },
  {
    id: 'rfi-050',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Regulatory Obligation Register',
    description: 'Request for regulatory obligation register, compliance ownership, and monitoring evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'critical',
    tags: ['Regulatory', 'Obligation', 'Compliance'],
    questions: [
      'Please provide the regulatory obligation register.',
      'Are owners assigned for each regulatory obligation?',
      'How frequently is compliance status reviewed?',
      'Were any regulatory breaches identified during the audit period?',
    ],
    scopeId: 'sl-010',
    scopeTitle: 'Compliance Framework Review',
  },
  {
    id: 'rfi-051',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Compliance Monitoring Plan',
    description: 'Request for compliance monitoring plan, completed reviews, and issue tracking.',
    category: 'Process & Control Walkthroughs',
    priority: 'high',
    tags: ['Compliance Monitoring', 'Plan', 'Issues'],
    questions: [
      'Please provide the annual compliance monitoring plan.',
      'Were planned compliance reviews completed on time?',
      'Please share issue logs from compliance monitoring reviews.',
      'How are compliance findings tracked to closure?',
    ],
    scopeId: 'sl-010',
    scopeTitle: 'Compliance Framework Review',
  },
  {
    id: 'rfi-052',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Policy Exception Register',
    description: 'Request for policy exception register, approvals, expiry dates, and remediation status.',
    category: 'Evidence & Document Requests',
    priority: 'medium',
    tags: ['Policy Exception', 'Approval', 'Compliance'],
    questions: [
      'Please provide the policy exception register.',
      'Were all exceptions approved by authorized personnel?',
      'Are exception expiry dates monitored?',
      'Were expired exceptions closed or re-approved?',
    ],
    scopeId: 'sl-010',
    scopeTitle: 'Compliance Framework Review',
  },
  {
    id: 'rfi-053',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'KYC File Review',
    description: 'Request for client KYC files, risk ratings, screening evidence, and approval records.',
    category: 'Evidence & Document Requests',
    priority: 'critical',
    tags: ['KYC', 'AML', 'Client'],
    questions: [
      'Please provide selected client KYC files for review.',
      'Are customer risk ratings documented and approved?',
      'Was sanctions screening performed before onboarding?',
      'Were enhanced due diligence procedures applied for high-risk clients?',
    ],
    scopeId: 'sl-024',
    scopeTitle: 'AML Controls Review',
  },
  {
    id: 'rfi-054',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Transaction Monitoring Alerts',
    description: 'Request for transaction monitoring alerts, investigation notes, and closure approvals.',
    category: 'System & IT Logic Inquiries',
    priority: 'critical',
    tags: ['Transaction Monitoring', 'AML', 'Alerts'],
    questions: [
      'Please provide transaction monitoring alerts generated during the audit period.',
      'Were alerts investigated within defined timelines?',
      'Who approved alert closure?',
      'Were suspicious alerts escalated for STR assessment?',
    ],
    scopeId: 'sl-024',
    scopeTitle: 'AML Controls Review',
  },
  {
    id: 'rfi-055',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Suspicious Transaction Report Filing Evidence',
    description: 'Request for STR filing records, investigation evidence, and regulatory submission confirmation.',
    category: 'Policy & Compliance Verification',
    priority: 'critical',
    tags: ['STR', 'AML', 'Regulatory Filing'],
    questions: [
      'Please provide STRs filed during the audit period.',
      'Were STR investigations documented adequately?',
      'Were STRs filed within regulatory timelines?',
      'Please provide confirmation of regulatory submission.',
    ],
    scopeId: 'sl-024',
    scopeTitle: 'AML Controls Review',
  },
  {
    id: 'rfi-056',
    company: 'al-noor-jewellery',
    division: 'ANJ-BR-02',
    subDivision: 'Compliance & AML',
    title: 'Client Risk Rating Methodology',
    description: 'Request for client risk rating methodology, scoring criteria, and periodic review evidence.',
    category: 'Policy & Compliance Verification',
    priority: 'high',
    tags: ['Risk Rating', 'Client', 'AML'],
    questions: [
      'Please provide the approved client risk rating methodology.',
      'What factors are considered in customer risk scoring?',
      'How often are client risk ratings refreshed?',
      'Were risk rating overrides approved and documented?',
    ],
    scopeId: 'sl-024',
    scopeTitle: 'AML Controls Review',
  },
];

// Rotating pool of submitters for items that land in the default "approved"
// bucket below (i.e. every item that isn't one of the two special
// pending_review/rejected indices, which keep their own hand-picked names).
const APPROVED_RFI_SUBMITTERS = ['Maryam Al Kaabi', 'Yousef Al Marri', 'Layla Hassan', 'Noura Al Blooshi', 'Rashid Al Nuaimi'];

const MOCK_RFI_LIBRARY_AUDIT_FIRM: RfiLibraryItem[] = RAW_RFI_LIBRARY_AUDIT_FIRM.map((item, i) => ({
  ...item,
  status: (i % 14 === 0 ? 'pending_review' : i % 11 === 0 ? 'rejected' : 'approved') as RfiLibraryStatus,
  createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}T09:00:00.000Z`,
  submittedBy: i % 14 === 0
    ? 'Fatima Al Zaabi'
    : (i % 11 === 0 && i % 14 !== 0)
      ? 'Khalid Al Nuaimi'
      : APPROVED_RFI_SUBMITTERS[i % APPROVED_RFI_SUBMITTERS.length],
  ...(i % 14 === 0 ? { submittedDate: '2026-07-22', dueDate: '2026-08-12' } : {}),
  ...(i % 11 === 0 && i % 14 !== 0 ? { submittedDate: '2026-07-18', dueDate: null } : {}),
}));

/**
 * The live RFI library every consumer imports. Which seed backs it depends
 * on CLIENT_MODE_VALUE: the multi-company audit-firm list above, or the
 * single-org DAR Exchange list in rfi-library-static-indi-org.data.ts.
 * Mirrors RFI_LIBRARY_STATIC_COMPANIES's switch above.
 */
export const MOCK_RFI_LIBRARY: RfiLibraryItem[] =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? MOCK_RFI_LIBRARY_INDI_ORG
    : MOCK_RFI_LIBRARY_AUDIT_FIRM;

export function upsertRfiLibraryItem(item: Omit<RfiLibraryItem, 'id' | 'createdAt'> & { id?: string }): RfiLibraryItem {
  // Filed under the sub-division when one was picked, else directly under the division.
  const saved: RfiLibraryItem = { ...item, subDivision: item.subDivision || '', hasSubDivision: !!item.subDivision, id: item.id ?? `${RFI_LIBRARY_ID_PREFIX}${Date.now()}`, createdAt: new Date().toISOString() } as RfiLibraryItem;
  MOCK_RFI_LIBRARY.unshift(saved);
  return saved;
}
export function editRfiLibraryItem(id: string, updates: Partial<RfiLibraryItem>): void {
  const idx = MOCK_RFI_LIBRARY.findIndex(r => r.id === id);
  if (idx < 0) return;
  const merged: RfiLibraryItem = { ...MOCK_RFI_LIBRARY[idx], ...updates, id };
  if (updates.subDivision !== undefined) merged.hasSubDivision = !!updates.subDivision;
  MOCK_RFI_LIBRARY[idx] = merged;
}
export function setRfiLibraryStatus(id: string, status: RfiLibraryStatus): void {
  editRfiLibraryItem(id, { status });
}
