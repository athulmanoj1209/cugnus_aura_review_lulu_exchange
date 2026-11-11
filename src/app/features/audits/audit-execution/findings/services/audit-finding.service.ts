import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EscalationTiers } from '../constants/findings.constants';
import type { EscalationTier, FindingSeverity, FindingStatus, PlanStatus } from '../constants/findings.constants';

/* ============================================================
 *  Models
 *  Value sets live in ../constants; re-exported so existing importers keep working.
 * ============================================================ */

export type { FindingSeverity, FindingStatus, PlanStatus } from '../constants/findings.constants';

export interface FindingOwner {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

/** One row in the Status History tab — every status change is appended. */
export interface StatusHistoryEntry {
  status: FindingStatus;
  timestamp: Date;
  updatedBy: string;
  note?: string;
}

/** One escalation event — surfaces on the Escalation tab. */
export interface EscalationEntry {
  /** Role shown in the red chip on the entry header, e.g. "Audit Manager". */
  toRole: string;
  /** Person escalated to, e.g. "Michael Chen". */
  toPerson: string;
  timestamp: Date;
  daysOverdue?: number;
  message?: string;
}

/** One uploaded evidence file attached to a finding. */
export interface EvidenceFile {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  /** Size in bytes (server-derived). */
  fileSize?: number;
  /** Extension only, lowercased ("pdf", "xlsx", "png"). */
  fileType?: string;
  uploadedBy: string;
  uploadedAt: Date;
  /** URL to download / view the file. */
  fileUrl: string;
}

/** An audit follow-up plan — the engagement that contains findings. */
export interface AuditFollowupPlan {
  /** Display id ("AP-2026-001"). */
  id: string;
  title: string;
  department: string;
  /** Overall severity rating of the plan. */
  severity: FindingSeverity;
  status: PlanStatus;
  startDate: Date;
  endDate: Date;
  description:string;
}

/** A row in the static "Escalation Policy" rule list. */
export interface EscalationPolicyRule {
  /** Trigger pill label, e.g. "T-5", "T-1", "+2". */
  trigger: string;
  /** Pill color tier. */
  tier: EscalationTier;
  description: string;
}

export interface AuditFinding {
  /** Display id ("F1", "F2", …). */
  id: string;
  title: string;
  subDivision: string;
  severity: FindingSeverity;
  status: FindingStatus;
  dueDate: Date;
  /** Set when status === 'overdue' or 'escalated' (server-derived). */
  daysOverdue?: number;
  /** Findings that have re-appeared in subsequent audit cycles. */
  isRepeated?: boolean;
  /**
   * The id of the previous occurrence — set by the system when a finding
   * is marked as repeated. The Repeated chip on the dashboard links here.
   */
  previousOccurrenceId?: string;
  /**
   * True when the system has auto-escalated this finding (typically when
   * a repeated finding goes overdue, or when SLA breach + repeated co-occur).
   * Drives the "auto-flagged" treatment on the Repeated chip.
   */
  flaggedForEscalation?: boolean;
  /** Estimated financial impact in AED/USD — drives the
   *  "Repeated Findings" KPI card on the right sidebar. */
  financialImpact?: number;
  owner: FindingOwner;

  /* ---- Detail-view fields (populated lazily on the /:id call) ---- */

  /** Long-form description shown on the detail page. */
  description?: string;
  /** Remediation instruction shown on the detail page. */
  requiredAction?: string;
  /** Department / team accountable for closing the finding. */
  responsibleOwner?: string;
  /** Auditor who raised the finding (separate from `owner`). */
  assignedAuditor?: FindingOwner;
  /** Engagement / audit scope this finding was raised against. */
  linkedScope?: string;
  /** Estimated residual risk after the remediation lands. */
  residualRisk?: FindingSeverity;
  /** When the finding was first recorded. */
  createdAt?: Date;
  /** Tab counter — evidence files attached. */
  evidenceCount?: number;
  /** Tab counter — number of escalations on this finding. */
  escalationCount?: number;

  /** Timeline shown on the History tab. */
  statusHistory?: StatusHistoryEntry[];
  /** Events shown on the Escalation tab. */
  escalations?: EscalationEntry[];
  /** Files attached on the Evidence tab. */
  evidence?: EvidenceFile[];
}

/* ============================================================
 *  Org-wide static config (read elsewhere too — keep here so
 *  consumers don't have to know where it lives).
 * ============================================================ */

export const ESCALATION_POLICY: EscalationPolicyRule[] = [
  { trigger: 'T-5', tier: EscalationTiers.Reminder, description: 'SLA reminder sent 5 days before due date' },
  { trigger: 'T-1', tier: EscalationTiers.Reminder, description: 'SLA reminder sent 1 day before due date' },
  { trigger: '+2',  tier: EscalationTiers.Warning,  description: 'Escalated to Department Head 2 days after due date' },
  { trigger: '+5',  tier: EscalationTiers.Alert,    description: 'Escalated to Audit Manager 5 days after due date' },
  { trigger: '+7',  tier: EscalationTiers.Alert,    description: 'Escalated to CAE 7 days after due date (option to escalate to Board/Audit Committee)' },
];

/** Pre-computed counters that the page renders in the top KPI cards. */
export interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

/* ============================================================
 *  Service
 *
 *  Mock now, HTTP later. Method signatures match the eventual
 *  REST shape; component callers never change.
 * ============================================================ */

@Injectable({ providedIn: 'root' })
export class AuditFindingService {

  private readonly http = inject(HttpClient);

  private readonly _findings = signal<AuditFinding[]>([...MOCK_FINDINGS]);

  /** All findings for the current branch / time window. */
  getAll(): Observable<AuditFinding[]> {
    // -------- PROD --------
    // return this.http.get<AuditFinding[]>('/api/audit-findings');
    // ----------------------
    return of(this._findings()).pipe(delay(150));
  }

  /** One finding by id — used by the eye-icon "view" action. */
  getById(id: string): Observable<AuditFinding | null> {
    // -------- PROD --------
    // return this.http.get<AuditFinding>(`/api/audit-findings/${id}`);
    // ----------------------
    const found = this._findings().find(f => f.id === id) ?? null;
    return of(found).pipe(delay(120));
  }

  /* ---------------- Follow-up plans (Overview tab) ---------------- */

  /** All follow-up plans for the dashboard's Overview tab. */
  getAllPlans(): Observable<AuditFollowupPlan[]> {
    // -------- PROD --------
    // return this.http.get<AuditFollowupPlan[]>('/api/audit-followup-plans');
    // ----------------------
    return of([...MOCK_PLANS]).pipe(delay(150));
  }

  /** Severity counts for the top KPI row. */
  getSeverityCounts(): Observable<SeverityCounts> {
    // -------- PROD --------
    // return this.http.get<SeverityCounts>('/api/audit-findings/severity-counts');
    // ----------------------
    const counts: SeverityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    this._findings().forEach(f => counts[f.severity]++);
    return of(counts).pipe(delay(80));
  }
}

/* ============================================================
 *  Mock dataset — mirrors the screenshot row-for-row
 * ============================================================ */

const AV = (n: string) =>
  `images/avatars/default-avatar.jpg`;

const D = (iso: string) => new Date(iso);

const SARAH:    FindingOwner = { id: 'u1', fullName: 'Sarah Johnson',   avatarUrl: AV('amyelsner')     };
const DAVID:    FindingOwner = { id: 'u2', fullName: 'David Kim',        avatarUrl: AV('asiyajavayant') };
const JESSICA:  FindingOwner = { id: 'u3', fullName: 'Jessica Brown',    avatarUrl: AV('xuxuefeng')     };
const ROBERT:   FindingOwner = { id: 'u4', fullName: 'Robert Taylor',    avatarUrl: AV('ionibowcher')   };
const AMANDA:   FindingOwner = { id: 'u5', fullName: 'Amanda White',     avatarUrl: AV('annafali')      };
const EMILY:    FindingOwner = { id: 'u6', fullName: 'Emily Rodriguez',  avatarUrl: AV('stephenshaw')   };

const MOCK_FINDINGS: AuditFinding[] = [
  { id: 'F1',  title: 'Inadequate segregation of duties in payment processing', subDivision: 'Finance', severity: 'critical', status: 'overdue', dueDate: D('2026-02-15'), daysOverdue: 0, owner: SARAH,
    description: 'The finance department lacks proper segregation of duties for payment approvals. A single individual can initiate, approve, and process payments without secondary review.',
    requiredAction: 'Implement dual approval system for all payments exceeding $10,000 and segregate payment initiation and approval roles.',
    responsibleOwner: 'Finance',
    assignedAuditor: EMILY,
    linkedScope: 'Financial Controls Review Q1',
    residualRisk: 'high',
    createdAt: new Date('2026-01-10T16:00:00'),
    evidenceCount: 2,
    escalationCount: 1,
    statusHistory: [
      { status: 'open',    timestamp: new Date('2026-01-10T16:00:00'), updatedBy: 'Emily Rodriguez',
        note: 'Finding documented during Financial Controls Review' },
      { status: 'overdue', timestamp: new Date('2026-02-16T16:00:00'), updatedBy: 'Emily Rodriguez',
        note: 'Finding documented during Financial Controls Review' },
    ],
    escalations: [
      { toRole: 'Audit Manager', toPerson: 'Michael Chen',
        timestamp: new Date('2026-02-17T16:00:00'), daysOverdue: 2,
        message: 'Finding is 2 days overdue without response' },
    ],
    evidence: [
      { id: 'ev-1',
        title: 'Payment Approval Matrix Q1 2026',
        description: 'Current single-signer approval workflow for all payment categories above $5,000.',
        fileName: 'approval-matrix.pdf',
        fileType: 'pdf',
        fileSize: 245_678,
        uploadedBy: 'Emily Rodriguez',
        uploadedAt: new Date('2026-01-12T10:30:00'),
        // data: URL so the Download button works in dev without a backend
        fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJfbk/N8KMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA2MDAgODAwXT4+CmVuZG9iago=' },
      { id: 'ev-2',
        title: 'Process walkthrough notes',
        description: 'Interview notes with the Finance team detailing the lack of secondary review process.',
        fileName: 'process-notes.txt',
        fileType: 'txt',
        fileSize: 8_734,
        uploadedBy: 'Emily Rodriguez',
        uploadedAt: new Date('2026-01-13T14:15:00'),
        fileUrl: 'data:text/plain;charset=utf-8,Process%20walkthrough%20notes%20-%20sample%20evidence%20file' },
    ] },
  { id: 'F2',  title: 'Firewall configuration vulnerabilities',      subDivision: 'IT Security',     severity: 'critical', status: 'in-progress', dueDate: D('2026-02-28'),                 owner: DAVID,
    description: 'Network perimeter firewalls contain 47 outdated rules from 2022, including 8 broad "any-any" allow rules. Periodic rule review has not been performed for over 18 months. Outbound traffic to high-risk regions is not restricted.',
    requiredAction: 'Conduct a full firewall rule review. Remove unused and overly-permissive rules. Implement geo-restrictions for outbound traffic to sanctioned regions. Establish a quarterly rule-review cadence.',
    responsibleOwner: 'IT Security',
    assignedAuditor: EMILY,
    linkedScope: 'IT General Controls Review Q1',
    residualRisk: 'medium',
    createdAt: new Date('2026-01-08T09:30:00'),
    evidenceCount: 1, escalationCount: 0,
    statusHistory: [
      { status: 'open',        timestamp: new Date('2026-01-08T09:30:00'),
        updatedBy: 'Emily Rodriguez',
        note: 'Vulnerability identified during network architecture review.' },
      { status: 'in-progress', timestamp: new Date('2026-02-05T11:00:00'),
        updatedBy: 'David Kim',
        note: 'IT Security team began the firewall rule audit.' },
    ],
    evidence: [
      { id: 'ev-f2-1', title: 'Firewall rule export — current snapshot',
        description: 'Sanitised export of the current ruleset for review and remediation tracking.',
        fileName: 'firewall-rules-snapshot.txt', fileType: 'txt', fileSize: 41_280,
        uploadedBy: 'David Kim', uploadedAt: new Date('2026-02-05T12:00:00'),
        fileUrl: 'data:text/plain;charset=utf-8,Firewall%20rule%20export%20-%20mock%20file' },
    ] },
  { id: 'F3',  title: 'Vendor payment approval process not documented', subDivision: 'Procurement',  severity: 'high',     status: 'responded',   dueDate: D('2026-03-30'),                 owner: JESSICA,
    description: 'Vendor payment approval thresholds and roles are currently managed through informal email approvals. No formal approval matrix exists, leading to inconsistencies between branches and potential override of controls.',
    requiredAction: 'Document an approval matrix specifying thresholds, required approvers, and SLA. Obtain CFO sign-off. Embed the approval workflow inside the ERP system to enforce it automatically.',
    responsibleOwner: 'Procurement',
    assignedAuditor: JESSICA,
    linkedScope: 'Procurement Controls Audit Q1',
    residualRisk: 'low',
    createdAt: new Date('2026-01-20T11:00:00'),
    evidenceCount: 0, escalationCount: 0,
    statusHistory: [
      { status: 'open',        timestamp: new Date('2026-01-20T11:00:00'),
        updatedBy: 'Jessica Brown',
        note: 'Identified during procurement walkthrough.' },
      { status: 'in-progress', timestamp: new Date('2026-02-01T09:45:00'),
        updatedBy: 'Jessica Brown',
        note: 'Procurement team drafted the approval matrix.' },
      { status: 'responded',   timestamp: new Date('2026-02-25T15:20:00'),
        updatedBy: 'Jessica Brown',
        note: 'Draft approval matrix submitted to CFO for sign-off.' },
    ] },
  { id: 'F4',  title: 'Employee background verification gaps',       subDivision: 'Human Resources', severity: 'medium',   status: 'verified',    dueDate: D('2026-03-15'),                 owner: ROBERT,
    description: 'Sample testing of 50 new hires from Q4 2025 identified 6 employees (12%) with incomplete background-verification documentation. Three of these had IT access credentials issued prior to verification completion.',
    requiredAction: 'Implement a system-enforced gate preventing IT credential issuance until HR confirms background verification is complete. Backfill checks for the 6 identified employees.',
    responsibleOwner: 'Human Resources',
    assignedAuditor: ROBERT,
    linkedScope: 'HR & Onboarding Audit Q4 2025',
    residualRisk: 'low',
    createdAt: new Date('2026-01-15T14:00:00'),
    evidenceCount: 2, escalationCount: 0,
    statusHistory: [
      { status: 'open',        timestamp: new Date('2026-01-15T14:00:00'),
        updatedBy: 'Robert Taylor',
        note: 'Gaps identified during HR sample testing.' },
      { status: 'in-progress', timestamp: new Date('2026-02-01T10:00:00'),
        updatedBy: 'Robert Taylor',
        note: 'HR implementing the system gate.' },
      { status: 'responded',   timestamp: new Date('2026-02-28T16:30:00'),
        updatedBy: 'Robert Taylor',
        note: 'Backfill checks completed; system gate live in production.' },
      { status: 'verified',    timestamp: new Date('2026-03-10T11:00:00'),
        updatedBy: 'Robert Taylor',
        note: 'Re-test sample passed without exceptions.' },
    ],
    evidence: [
      { id: 'ev-f4-1', title: 'Background Verification Policy v2.1',
        description: 'Updated policy document covering the new pre-credentialing gate.',
        fileName: 'bgv-policy-v2.1.pdf', fileType: 'pdf', fileSize: 187_440,
        uploadedBy: 'Robert Taylor', uploadedAt: new Date('2026-02-28T16:45:00'),
        fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJSDigJ0=' },
      { id: 'ev-f4-2', title: 'Re-test sample results',
        description: '20-employee re-test sample. No exceptions identified.',
        fileName: 'retest-results.txt', fileType: 'txt', fileSize: 12_640,
        uploadedBy: 'Robert Taylor', uploadedAt: new Date('2026-03-10T11:10:00'),
        fileUrl: 'data:text/plain;charset=utf-8,20%20records%20checked%20-%200%20exceptions' },
    ] },
  { id: 'F5',  title: 'Regulatory reporting deadline missed',         subDivision: 'Compliance',     severity: 'high',     status: 'closed',      dueDate: D('2026-02-01'),                 owner: AMANDA,
    description: 'The Q4 2025 regulatory filing was submitted to the Central Bank 3 business days after the statutory deadline, due to a manual oversight in the deadline-tracking calendar.',
    requiredAction: 'Implement automated calendar reminders 7 and 3 days before each filing deadline. Designate a backup reviewer. Document the escalation path.',
    responsibleOwner: 'Compliance',
    assignedAuditor: AMANDA,
    linkedScope: 'Regulatory Reporting Audit Q4 2025',
    residualRisk: 'low',
    createdAt: new Date('2025-12-15T10:00:00'),
    evidenceCount: 1, escalationCount: 0,
    statusHistory: [
      { status: 'open',        timestamp: new Date('2025-12-15T10:00:00'),
        updatedBy: 'Amanda White', note: 'Missed deadline identified during post-filing review.' },
      { status: 'in-progress', timestamp: new Date('2026-01-05T09:30:00'),
        updatedBy: 'Amanda White', note: 'Compliance team designing the automated calendar.' },
      { status: 'verified',    timestamp: new Date('2026-01-25T14:00:00'),
        updatedBy: 'Amanda White', note: 'Automation deployed and tested for the upcoming Q1 filing.' },
      { status: 'closed',      timestamp: new Date('2026-02-01T17:00:00'),
        updatedBy: 'Amanda White', note: 'Remediation accepted by the Audit Committee.' },
    ],
    evidence: [
      { id: 'ev-f5-1', title: 'Audit Committee acceptance letter',
        description: 'Signed acceptance of the remediation by the Audit Committee chair.',
        fileName: 'acceptance-letter.pdf', fileType: 'pdf', fileSize: 95_120,
        uploadedBy: 'Amanda White', uploadedAt: new Date('2026-02-01T17:15:00'),
        fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJSDigJ0=' },
    ] },
  { id: 'F6',  title: 'Journal entry approval controls inadequate',  subDivision: 'Finance',         severity: 'high',     status: 'escalated',   dueDate: D('2026-01-25'), daysOverdue: 3, owner: SARAH, isRepeated: true,  previousOccurrenceId: 'F-Q3-2025-018', flaggedForEscalation: true, financialImpact: 145_000,
    description: 'Recurrence of the Q3 2025 finding (F-Q3-2025-018): manual journal entries exceeding $50,000 are not consistently routed through the required dual-approval workflow. 14 instances identified across Q1 2026.',
    requiredAction: 'Strengthen the ERP workflow rules to enforce dual approval for JEs above $50k. Train Finance staff. Conduct a monthly review of approval logs.',
    responsibleOwner: 'Finance',
    assignedAuditor: SARAH,
    linkedScope: 'Financial Controls Review Q1',
    residualRisk: 'high',
    createdAt: new Date('2026-01-05T08:00:00'),
    evidenceCount: 0, escalationCount: 1,
    statusHistory: [
      { status: 'open',      timestamp: new Date('2026-01-05T08:00:00'),
        updatedBy: 'Sarah Johnson',
        note: 'Recurring finding from Q3 2025 audit. Linked to F-Q3-2025-018.' },
      { status: 'escalated', timestamp: new Date('2026-01-28T16:00:00'),
        updatedBy: 'System',
        note: 'Auto-escalated: repeated finding and SLA breach (3 days overdue).' },
    ],
    escalations: [
      { toRole: 'Audit Manager', toPerson: 'Michael Chen',
        timestamp: new Date('2026-01-28T16:00:00'), daysOverdue: 3,
        message: 'Repeated finding from a previous audit cycle. Auto-escalation triggered.' },
    ] },
  { id: 'F7',  title: 'Inefficient inventory management process',    subDivision: 'Operations',      severity: 'medium',   status: 'open',        dueDate: D('2026-02-28'),                 owner: DAVID,
    description: 'Inventory counts are conducted only quarterly. Spot checks revealed an 8% variance between physical and recorded stock. No barcode scanning or cycle counting is in place.',
    requiredAction: 'Implement weekly cycle counts. Deploy barcode scanning for receiving and dispatch. Reconcile variances within 48 hours.',
    responsibleOwner: 'Operations',
    assignedAuditor: DAVID,
    linkedScope: 'Operations Process Review Q1',
    residualRisk: 'low',
    createdAt: new Date('2026-01-22T13:30:00'),
    evidenceCount: 0, escalationCount: 0,
    statusHistory: [
      { status: 'open', timestamp: new Date('2026-01-22T13:30:00'),
        updatedBy: 'David Kim',
        note: 'Variance identified during quarterly inventory count.' },
    ] },
  { id: 'F8',  title: 'Weak password policy enforcement',            subDivision: 'IT Security',     severity: 'critical', status: 'rejected',    dueDate: D('2026-02-20'),                 owner: DAVID,
    description: 'Password complexity and rotation rules are not enforced on 4 legacy systems (HR portal, vendor portal, archive system, intranet). Users can set 6-character passwords with no expiry.',
    requiredAction: 'Migrate authentication of the 4 legacy systems to corporate SSO. Where migration is not feasible within Q1, implement compensating controls (MFA, account monitoring).',
    responsibleOwner: 'IT Security',
    assignedAuditor: DAVID,
    linkedScope: 'Cybersecurity Assessment Q1',
    residualRisk: 'critical',
    createdAt: new Date('2026-01-12T10:30:00'),
    evidenceCount: 0, escalationCount: 0,
    statusHistory: [
      { status: 'open',        timestamp: new Date('2026-01-12T10:30:00'),
        updatedBy: 'David Kim', note: 'Identified during password audit.' },
      { status: 'in-progress', timestamp: new Date('2026-02-01T09:15:00'),
        updatedBy: 'David Kim', note: 'IT investigating SSO migration timeline.' },
      { status: 'rejected',    timestamp: new Date('2026-02-18T15:00:00'),
        updatedBy: 'David Kim',
        note: 'Proposed remediation rejected: migration not feasible in Q1; compensating controls insufficient.' },
    ] },
  { id: 'F9',  title: 'Journal entry approval controls inadequate',  subDivision: 'Finance',         severity: 'high',     status: 'escalated',   dueDate: D('2026-01-25'), daysOverdue: 3, owner: SARAH, isRepeated: true,  previousOccurrenceId: 'F6', flaggedForEscalation: true,
    description: 'Continuation of the JE approval gap identified in F6, surfaced during the February sample test. 9 additional instances of single-approval JEs above the $50k threshold.',
    requiredAction: 'Same remediation as F6: enforce dual approval in the ERP workflow, train staff, monthly approval-log reviews.',
    responsibleOwner: 'Finance',
    assignedAuditor: SARAH,
    linkedScope: 'Financial Controls Review Q1',
    residualRisk: 'high',
    createdAt: new Date('2026-01-10T08:30:00'),
    evidenceCount: 0, escalationCount: 1,
    statusHistory: [
      { status: 'open',      timestamp: new Date('2026-01-10T08:30:00'),
        updatedBy: 'Sarah Johnson',
        note: 'Continuation of F6. Logged as a separate occurrence in the new sample window.' },
      { status: 'escalated', timestamp: new Date('2026-01-28T16:05:00'),
        updatedBy: 'System',
        note: 'Auto-escalated: repeated finding chain + SLA breach.' },
    ],
    escalations: [
      { toRole: 'Audit Manager', toPerson: 'Michael Chen',
        timestamp: new Date('2026-01-28T16:05:00'), daysOverdue: 3,
        message: 'Recurring JE approval gap. Chain reference: F-Q3-2025-018 → F6 → F9.' },
    ] },
  { id: 'F10', title: 'Inadequate segregation of duties in payment', subDivision: 'Finance',         severity: 'critical', status: 'overdue',     dueDate: D('2026-02-15'), daysOverdue: 0, owner: SARAH,
    description: 'At the branch-payment authorisation layer, the same user can both authorise a payment and verify the beneficiary record, defeating the intended segregation-of-duties control.',
    requiredAction: 'Reassign the beneficiary-verification role to the Accounts Payable team. Add a system check that blocks authorisation when authoriser_id equals beneficiary_verifier_id.',
    responsibleOwner: 'Finance',
    assignedAuditor: SARAH,
    linkedScope: 'Financial Controls Review Q1',
    residualRisk: 'high',
    createdAt: new Date('2026-01-12T09:00:00'),
    evidenceCount: 0, escalationCount: 0,
    statusHistory: [
      { status: 'open',    timestamp: new Date('2026-01-12T09:00:00'),
        updatedBy: 'Sarah Johnson', note: 'Identified at branch payment authorisation layer.' },
      { status: 'overdue', timestamp: new Date('2026-02-15T17:00:00'),
        updatedBy: 'System',         note: 'Status auto-updated to Overdue — no response from owner.' },
    ] },
  { id: 'F11', title: 'Journal entry approval controls inadequate',  subDivision: 'Finance',         severity: 'high',     status: 'escalated',   dueDate: D('2026-01-25'), daysOverdue: 3, owner: SARAH, isRepeated: true,  previousOccurrenceId: 'F9', flaggedForEscalation: true,
    description: 'Third occurrence in Q1 of the JE approval gap. A different cost-centre showed the same pattern, suggesting the workflow change has not propagated.',
    requiredAction: 'Verify ERP workflow rules are active for all cost-centres. Run a one-off reconciliation across Q1 JEs above $50k.',
    responsibleOwner: 'Finance',
    assignedAuditor: SARAH,
    linkedScope: 'Financial Controls Review Q1',
    residualRisk: 'high',
    createdAt: new Date('2026-01-18T11:00:00'),
    evidenceCount: 0, escalationCount: 1,
    statusHistory: [
      { status: 'open',      timestamp: new Date('2026-01-18T11:00:00'),
        updatedBy: 'Sarah Johnson',
        note: 'Third recurrence in Q1; new cost-centre affected.' },
      { status: 'escalated', timestamp: new Date('2026-01-28T16:10:00'),
        updatedBy: 'System',
        note: 'Auto-escalated: repeated finding chain F6 → F9 → F11.' },
    ],
    escalations: [
      { toRole: 'Audit Manager', toPerson: 'Michael Chen',
        timestamp: new Date('2026-01-28T16:10:00'), daysOverdue: 3,
        message: 'Pattern is spreading across cost-centres; CFO awareness recommended.' },
    ] },
  { id: 'F12', title: 'Inefficient inventory management process',    subDivision: 'Operations',      severity: 'medium',   status: 'open',        dueDate: D('2026-02-28'),                 owner: DAVID,
    description: 'Companion finding to F7, focused on the warehouse-receiving leg. Goods are signed for on paper, with system entry happening up to 5 days later; no GR-IR reconciliation in place.',
    requiredAction: 'Roll out handheld scanners at the receiving dock. Mandate same-day system entry. Stand up a weekly GR-IR reconciliation report.',
    responsibleOwner: 'Operations',
    assignedAuditor: DAVID,
    linkedScope: 'Operations Process Review Q1',
    residualRisk: 'medium',
    createdAt: new Date('2026-01-25T15:00:00'),
    evidenceCount: 0, escalationCount: 0,
    statusHistory: [
      { status: 'open', timestamp: new Date('2026-01-25T15:00:00'),
        updatedBy: 'David Kim',
        note: 'Identified during the warehouse walkthrough; companion to F7.' },
    ] },
];

/* ============================================================
 *  Follow-up plans mock dataset (Overview tab)
 * ============================================================ */

const MOCK_PLANS: AuditFollowupPlan[] = [
  { id: 'AP-2026-001', title: 'Q1 Financial Controls Follow-up',
    department: 'Finance',         severity: 'critical', status: 'in-progress',
    startDate: D('2026-01-05'),    endDate: D('2026-03-31') ,description:''},

  { id: 'AP-2026-002', title: 'IT Security Quarterly Review',
    department: 'IT Security',     severity: 'critical', status: 'in-progress',
    startDate: D('2026-01-10'),    endDate: D('2026-03-30'),description:'' },

  { id: 'AP-2026-003', title: 'Procurement Controls Audit',
    department: 'Procurement',     severity: 'high',     status: 'completed',
    startDate: D('2026-01-15'),    endDate: D('2026-02-28') ,description:''},

  { id: 'AP-2026-004', title: 'HR Onboarding Process Review',
    department: 'Human Resources', severity: 'medium',   status: 'completed',
    startDate: D('2026-01-20'),    endDate: D('2026-03-15') ,description:''},

  { id: 'AP-2026-005', title: 'Regulatory Reporting Q4 2025',
    department: 'Compliance',      severity: 'high',     status: 'completed',
    startDate: D('2025-12-01'),    endDate: D('2026-02-01') ,description:''},

  { id: 'AP-2026-006', title: 'Operations Process Audit',
    department: 'Operations',      severity: 'medium',   status: 'in-progress',
    startDate: D('2026-02-01'),    endDate: D('2026-03-30') ,description:''},

  { id: 'AP-2026-007', title: 'Cybersecurity Posture Assessment',
    department: 'IT Security',     severity: 'critical', status: 'draft',
    startDate: D('2026-02-15'),    endDate: D('2026-04-30') ,description:''},

  { id: 'AP-2026-008', title: 'Risk Management Framework Review',
    department: 'Risk',            severity: 'high',     status: 'on-hold',
    startDate: D('2026-01-01'),    endDate: D('2026-03-31') ,description:''},
];