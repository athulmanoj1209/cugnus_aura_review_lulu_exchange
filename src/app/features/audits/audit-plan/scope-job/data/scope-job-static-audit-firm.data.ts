// Scope-job seed for 'audit-firm' client mode (multi-company demo roster) —
// used whenever CLIENT_MODE_VALUE !== 'internal-audit'.

import { ScopeJobStatuses, ScopeJobFrequencies, ScopeTaskStatuses } from '../constants/scope-job.constants';
import type { ScopeTask } from '../../scope-task/models/scope-task.model';
import type { ScopeJob } from '../models/scope-job.model';
import { daysFromToday, generateJobs } from './scope-job-generator';

const TEAM_JOB_ID = 'SJ-501';

/** One hand-written seed task; endDate = dueDate, same as generated / form-saved tasks. */
function teamTask(
  n: number, title: string, description: string, priority: ScopeTask['priority'],
  assignedTo: string, status: ScopeTask['status'], startOffset: number, dueOffset: number,
  controlRating: NonNullable<ScopeTask['controlRating']>,
): ScopeTask {
  const checklistItems = ['Verify authorization controls', 'Review access logs', 'Check segregation of duties'];
  const checklistStatuses: NonNullable<ScopeTask['checklistStatuses']> =
    status === ScopeTaskStatuses.Open       ? ['pending', 'pending', 'pending'] :
    status === ScopeTaskStatuses.InProgress ? ['completed', 'in_progress', 'pending'] :
    status === ScopeTaskStatuses.Overdue    ? ['completed', 'completed', 'failed'] :
                                              ['completed', 'completed', 'completed'];
  const dueDate = daysFromToday(dueOffset);
  return {
    id: `${TEAM_JOB_ID}-T${String(n).padStart(2, '0')}`,
    title,
    objective: `Complete the ${title.toLowerCase()} activities for this scope job.`,
    description,
    assignedTo,
    startDate: daysFromToday(startOffset),
    dueDate,
    endDate: dueDate,
    status,
    priority,
    checklistItems,
    checklistStatuses,
    controlRating,
    tags: [`${priority[0].toUpperCase()}${priority.slice(1)} Risk`, n % 2 ? 'Core Control' : 'Evidence Review'],
  };
}

/**
 * Current-cycle scope job for the auditor team (alice / carol / david / emma).
 * Its tasks are dated relative to today so the Team Overview tab always has
 * open / in-progress tasks, tasks due today, and tasks in every Task Aging
 * bucket — the team's other jobs are all in past 2025 periods.
 */
const TEAM_CURRENT_CYCLE_JOB: ScopeJob = {
  id: TEAM_JOB_ID,
  title: 'Procurement & Inventory Controls — Current Cycle',
  scopeId: 'SC-006',
  scopeName: 'Procurement & Inventory Controls',
  company: 'Gulf Horizon Logistics',
  division: 'Jebel Ali Free Zone HQ',
  subDivision: 'Procurement & Supply Chain',
  auditFrequency: ScopeJobFrequencies.Monthly,
  modeOfAudit: 'full',
  periodLabel: 'Current Cycle',
  periodStart: daysFromToday(-45),
  periodEnd: daysFromToday(30),
  assignedAuditors: ['alice', 'carol', 'david', 'emma'],
  assignedReviewers: ['henry'],
  status: ScopeJobStatuses.InProgress,
  createdDate: daysFromToday(-45),
  isActive: true,
  objective: 'Assess procurement, goods-receipt and inventory controls for the current cycle, from purchase requisition through stock count.',
  subscopes: ['Purchase Requisitions', 'Goods Receipt', 'Inventory Counts'],
  seedTasks: [
    teamTask(1, 'Planning & Scoping', 'Define audit scope, objectives, and risk areas for the period.', 'high', 'alice', ScopeTaskStatuses.Open, -2, 10, 'moderate'),
    teamTask(2, 'Risk Assessment', 'Identify and evaluate inherent and control risks.', 'high', 'carol', ScopeTaskStatuses.Open, -5, 0, 'moderate'),
    teamTask(3, 'Control Walkthrough', 'Walk through key internal controls with process owners.', 'medium', 'emma', ScopeTaskStatuses.InProgress, -3, 0, 'strong'),
    teamTask(4, 'Fieldwork Execution', 'Perform substantive testing and evidence collection.', 'high', 'david', ScopeTaskStatuses.InProgress, -10, 0, 'weak'),
    teamTask(5, 'Evidence Documentation', 'Document all working papers and audit evidence in the repository.', 'medium', 'emma', ScopeTaskStatuses.Open, -12, 5, 'moderate'),
    teamTask(6, 'Control Testing', 'Test design and operating effectiveness of selected controls.', 'medium', 'alice', ScopeTaskStatuses.InProgress, -20, 3, 'moderate'),
    teamTask(7, 'Draft Report Preparation', 'Prepare draft findings, recommendations, and management responses.', 'medium', 'carol', ScopeTaskStatuses.Open, -25, 7, 'strong'),
    teamTask(8, 'Management Review', 'Obtain management sign-off on draft findings and action plans.', 'low', 'david', ScopeTaskStatuses.Overdue, -40, -5, 'weak'),
    teamTask(9, 'Follow-up & Closure', 'Track implementation of management action plans and close findings.', 'low', 'emma', ScopeTaskStatuses.Completed, -35, -10, 'strong'),
  ],
};

export const AUDIT_FIRM_SCOPE_JOBS: ScopeJob[] = [
  // Monthly scope: Jan–Dec 2026 → 12 jobs (spans past, current, and future periods
  // so pending / in-progress / completed / overdue all occur relative to today)
  ...generateJobs(
    'SC-001', 'Financial Controls Review',
    'Al Noor Jewellery Group', 'Deira Gold Souk Flagship', 'Retail Operations',
    'monthly', 'full',
    new Date('2026-01-01'), new Date('2026-12-31'),
    ['fatima', 'arjun', 'bob'], ['karim'],
    'SJ', 1,
    'Assess the design and operating effectiveness of key financial controls across revenue, expenditure, and payroll cycles to ensure accuracy and completeness of financial reporting.',
    ['Revenue Cycle Controls', 'Expenditure & AP Controls', 'Payroll Verification', 'Journal Entry Review', 'Bank Reconciliation'],
  ),

  // Quarterly scope: Jan–Dec 2025 → 4 jobs
  ...generateJobs(
    'SC-002', 'IT Security Baseline',
    'Zumurrud Diamonds LLC', 'Dubai Design District Studio', 'Design & Merchandising',
    'quarterly', 'thematic',
    new Date('2025-01-01'), new Date('2025-12-31'),
    ['carol'], ['frank'],
    'SJ', 101,
    'Evaluate the adequacy of IT general controls including access management, change management, and incident response to safeguard organisational data and systems.',
    ['Access Management', 'Change Management', 'Incident Response', 'Data Backup & Recovery'],
  ),

  // Annual scope: 2025–2027 → 3 jobs
  ...generateJobs(
    'SC-003', 'HR Compliance Audit',
    'Falcon Gulf Jewellery Trading', 'Al Ain Branch', 'Finance & Accounting',
    'annually', 'limited',
    new Date('2025-01-01'), new Date('2027-12-31'),
    ['fatima', 'bob'], ['noura'],
    'SJ', 201,
    'Review HR policies, recruitment practices, and employee lifecycle processes to verify compliance with UAE Labour Law and internal HR governance standards.',
    ['Recruitment & Onboarding', 'Leave & Attendance', 'Performance Management', 'Termination Procedures'],
  ),

  // Monthly scope: Jan–Jun 2025 → 6 jobs
  ...generateJobs(
    'SC-004', 'AML / CFT Monitoring',
    'Marwa Gold & Gems', 'Ajman Central Souk', 'Retail Operations',
    'monthly', 'continuous',
    new Date('2025-01-01'), new Date('2025-06-30'),
    ['alice', 'carol'], ['henry'],
    'SJ', 301,
    'Monitor transactional patterns and client due diligence processes to ensure compliance with AML/CFT regulations and SAMA guidelines, and identify suspicious activity indicators.',
    ['Customer Due Diligence (CDD)', 'Transaction Monitoring', 'Suspicious Activity Reporting', 'Sanctions Screening'],
  ),

  // Quarterly scope: 2026 → 4 jobs
  ...generateJobs(
    'SC-005', 'Operational Risk Register Review',
    'Kanz Al Emarat Jewellery', 'Ras Al Khaimah Showroom', 'Retail Operations',
    'quarterly', 'follow-up',
    new Date('2026-01-01'), new Date('2026-12-31'),
    ['miguel', 'bob', 'priya'], ['karim', 'james'],
    'SJ', 401,
    'Follow up on prior-period operational risk findings to verify management action plan implementation and assess residual risk levels across key business processes.',
    ['Action Plan Tracking', 'Residual Risk Assessment', 'Control Remediation', 'Risk Register Update'],
  ),

  TEAM_CURRENT_CYCLE_JOB,
];
