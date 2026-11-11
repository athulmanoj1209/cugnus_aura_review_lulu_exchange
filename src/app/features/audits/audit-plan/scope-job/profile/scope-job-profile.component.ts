import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

import {
  ScopeJob,
  AuditorProfile, ReviewerProfile,
  AUDITOR_REGISTRY, REVIEWER_REGISTRY,
  MOCK_SCOPE_JOBS,
} from '../list/scope-job-list.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  ScopeJobStatuses,
  ScopeTaskStatuses,
  type ScopeJobControlRating,
  SubScopeRisks,
  type ScopeTaskPriority,
  type ScopeTaskStatus,
  type SubScopeRisk as SubScopeRiskValue,
  MS_PER_DAY,
  SCOPE_JOB_DATE_LOCALE,
  SCOPE_JOB_MOCK_TASK_COUNT,
  SCOPE_JOB_PAGER_MAX_FULL_PAGES,
  SCOPE_JOB_PERSON_PAGE_SIZE,
  SCOPE_JOB_TASK_PAGE_SIZE,
  SCOPE_TASK_ID_INFIX,
  SCOPE_TASK_ID_PAD_LENGTH,
  SUBSCOPE_DEFAULT_CATEGORY,
} from '../constants/scope-job.constants';
import {
  SCOPE_JOB_DEFAULT_ROLES,
  SCOPE_JOB_CHECKLIST_ITEM_OPTIONS,
  SCOPE_JOB_CONTROL_RATING_OPTIONS,
  SCOPE_JOB_FREQUENCY_LABELS,
  SCOPE_JOB_MODE_OF_AUDIT_LABELS,
  SCOPE_JOB_STATUS_LABELS,
  SCOPE_TASK_DASHBOARD_STATUS_LABELS,
  SCOPE_TASK_PRIORITY_LABELS,
  SCOPE_TASK_STATUS_ICONS,
  SCOPE_TASK_STATUS_LABELS,
  SCOPE_TASK_TEMPLATES,
  SUBSCOPE_RISK_LABELS,
} from '../constants/scope-job-labels.constants';
import { SCOPE_TASK_DUE_LABELS } from '../constants/scope-job-messages.constants';

export interface ScopeJobProfileDrawerData {
  job: ScopeJob;
}

// ── Task types ───────────────────────────────────────────────────────────────
export type TaskStatus   = ScopeTaskStatus;
export type TaskPriority = ScopeTaskPriority;

export interface ScopeTask {
  id:          string;
  title:       string;
  objective?:  string;
  description: string;
  assignedTo:  string;
  dueDate:     Date;
  startDate?:  Date;
  endDate?:    Date;
  status:      TaskStatus;
  priority:    TaskPriority;
  checklistItems?: string[];
  checklistStatuses?: ('pending' | 'in_progress' | 'completed' | 'failed' | 'not_applicable')[];
  controlRating?: ScopeJobControlRating;
  tags?: string[];
}

/* ── Re-export types so the template can reference them ── */
export type { AuditorProfile, ReviewerProfile };

// ── Sub-scope display types ───────────────────────────────────────────────────
export type SubScopeRisk = SubScopeRiskValue;

export interface SubScopeItem {
  name:     string;
  category: string;
  risk:     SubScopeRisk;
}

/** Generate deterministic mock tasks for a given job */
export function generateTasksForJob(job: ScopeJob): ScopeTask[] {
  if (job.seedTasks) return job.seedTasks;
  const seed  = job.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const count = SCOPE_JOB_MOCK_TASK_COUNT.Min + (seed % SCOPE_JOB_MOCK_TASK_COUNT.Variants);  // 4, 5, or 6
  const templates = SCOPE_TASK_TEMPLATES.slice(0, count);

  const start  = job.periodStart.getTime();
  const end    = job.periodEnd.getTime();
  const span   = (end - start) / (count + 1);
  const now    = Date.now();

  return templates.map((t, i) => {
    const startDate   = new Date(start + span * i);
    const dueDate     = new Date(start + span * (i + 1));
    const isPast      = dueDate.getTime() < now;
    const auditors    = job.assignedAuditors;
    const assignedTo  = auditors[i % auditors.length];

    let status: TaskStatus;
    if (job.status === ScopeJobStatuses.Pending) {
      status = ScopeTaskStatuses.Open;
    } else if (job.status === ScopeJobStatuses.Completed) {
      status = ScopeTaskStatuses.Completed;
    } else if (isPast) {
      status = i < count - 2
        ? ScopeTaskStatuses.Completed
        : (job.status === ScopeJobStatuses.Overdue ? ScopeTaskStatuses.Overdue : ScopeTaskStatuses.Completed);
    } else {
      status = i === count - (count > SCOPE_JOB_MOCK_TASK_COUNT.Min ? 2 : 1) ? ScopeTaskStatuses.InProgress : ScopeTaskStatuses.Open;
    }

    return {
      id:          `${job.id}${SCOPE_TASK_ID_INFIX}${String(i + 1).padStart(SCOPE_TASK_ID_PAD_LENGTH, '0')}`,
      title:       t.title,
      objective:   `Complete the ${t.title.toLowerCase()} activities for this scope job.`,
      description: t.description,
      assignedTo,
      dueDate,
      startDate,
      endDate: dueDate,
      status,
      priority:    t.priority,
      checklistItems: SCOPE_JOB_CHECKLIST_ITEM_OPTIONS
        .slice(0, 2 + ((seed + i) % 3))
        .map(item => item.label),
      checklistStatuses: getChecklistStatuses(status, 2 + ((seed + i) % 3), seed + i),
      controlRating: SCOPE_JOB_CONTROL_RATING_OPTIONS[(seed + i) % SCOPE_JOB_CONTROL_RATING_OPTIONS.length].value,
      tags: [
        `${t.priority[0].toUpperCase()}${t.priority.slice(1)} Risk`,
        i % 2 === 0 ? 'Core Control' : 'Evidence Review',
      ],
    };
  });
}

function getChecklistStatuses(taskStatus: TaskStatus, itemCount: number, seed: number): ('pending' | 'in_progress' | 'completed' | 'failed' | 'not_applicable')[] {
  if (taskStatus === ScopeTaskStatuses.Open) return Array(itemCount).fill('pending');
  if (taskStatus === ScopeTaskStatuses.InProgress) return Array.from({ length: itemCount }, (_, index) => index === 0 ? 'completed' : index === 1 ? 'in_progress' : 'pending');
  if (taskStatus === ScopeTaskStatuses.Overdue) return Array.from({ length: itemCount }, (_, index) => index < Math.max(1, itemCount - 1) ? 'completed' : 'failed');
  return Array.from({ length: itemCount }, (_, index) => index === itemCount - 1 && seed % 3 === 0 ? 'not_applicable' : index === itemCount - 2 && seed % 4 === 0 ? 'failed' : 'completed');
}

/**
 * Count of generated tasks (across every scope job) assigned to the given
 * auditor in the given bucket — a specific TaskStatus, or 'due-today'.
 * Used by both the auditor overview KPI cards and the Task Status chart,
 * so both always report the exact same numbers for the same status.
 */
export function countTasksForAuditor(auditorId: string, bucket: TaskStatus | 'due-today'): number {
  const tasks = MOCK_SCOPE_JOBS.flatMap(generateTasksForJob).filter(t => t.assignedTo === auditorId);

  if (bucket === 'due-today') {
    const today = new Date();
    return tasks.filter(t =>
      t.status !== ScopeTaskStatuses.Completed &&
      t.dueDate.getFullYear() === today.getFullYear() &&
      t.dueDate.getMonth() === today.getMonth() &&
      t.dueDate.getDate() === today.getDate(),
    ).length;
  }

  return tasks.filter(t => t.status === bucket).length;
}

export interface AuditorTaskRow {
  task: string;
  scope: string;
  priority: string;
  status: string;
  dueDate: string;
}

function formatTaskDueDate(d: Date): string {
  const startOfDay = (x: Date) => { const c = new Date(x); c.setHours(0, 0, 0, 0); return c.getTime(); };
  const today = startOfDay(new Date());
  const tomorrow = today + MS_PER_DAY;
  const due = startOfDay(d);
  if (due === today) return SCOPE_TASK_DUE_LABELS.Today;
  if (due === tomorrow) return SCOPE_TASK_DUE_LABELS.Tomorrow;
  return d.toLocaleDateString(SCOPE_JOB_DATE_LOCALE, { day: 'numeric', month: 'short' });
}

/**
 * Every generated task assigned to the given auditor, shaped for the
 * auditor-my-audits-scopes tab's "My Tasks" table.
 */
export function getTaskRowsForAuditor(auditorId: string): AuditorTaskRow[] {
  return MOCK_SCOPE_JOBS.flatMap(job =>
    generateTasksForJob(job)
      .filter(t => t.assignedTo === auditorId)
      .map(t => ({
        task: t.title,
        scope: job.scopeName,
        // 'critical' is shown as 'High' on the dashboard.
        priority: t.priority === 'critical' ? SCOPE_TASK_PRIORITY_LABELS.high : SCOPE_TASK_PRIORITY_LABELS[t.priority],
        status: SCOPE_TASK_DASHBOARD_STATUS_LABELS[t.status],
        dueDate: formatTaskDueDate(t.dueDate),
      })),
  );
}

@Component({
  selector: 'app-scope-job-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, TagModule, TooltipModule, ButtonModule, DrawIconComponent],
  templateUrl: './scope-job-profile.component.html',
  styleUrl:    './scope-job-profile.component.scss',
})
export class ScopeJobProfileComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data    = inject(DRAWER_DATA, { optional: true }) as ScopeJobProfileDrawerData | null;

  job!:   ScopeJob;
  tasks:  ScopeTask[] = [];

  // ── Hero helpers ───────────────────────────────────────────────────────────
  /** big initials block in the gradient header (from the scope name) */
  get scopeInitials(): string {
    return this.job.scopeName
      .split(/\s+/)
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /** total team members for the stat card / Team section count */
  get teamSize(): number {
    return (this.job.assignedAuditors?.length ?? 0) + (this.job.assignedReviewers?.length ?? 0);
  }

  // Exposed for the template.
  readonly ScopeJobStatuses  = ScopeJobStatuses;
  readonly ScopeTaskStatuses = ScopeTaskStatuses;
  readonly defaultRoles      = SCOPE_JOB_DEFAULT_ROLES;

  // ── Task pagination ────────────────────────────────────────────────────────
  readonly taskPageSize = SCOPE_JOB_TASK_PAGE_SIZE;
  taskPage = 0;

  get pagedTasks(): ScopeTask[] {
    const start = this.taskPage * this.taskPageSize;
    return this.tasks.slice(start, start + this.taskPageSize);
  }

  get taskPageCount(): number {
    return Math.max(1, Math.ceil(this.tasks.length / this.taskPageSize));
  }

  get taskPageRange(): string {
    const start = this.taskPage * this.taskPageSize + 1;
    const end   = Math.min((this.taskPage + 1) * this.taskPageSize, this.tasks.length);
    return `${start}–${end}`;
  }

  /** Page numbers to show; -1 = ellipsis placeholder */
  get visiblePages(): number[] {
    const total = this.taskPageCount;
    const cur   = this.taskPage;
    if (total <= SCOPE_JOB_PAGER_MAX_FULL_PAGES) return Array.from({ length: total }, (_, i) => i);
    const set = new Set<number>();
    set.add(0); set.add(total - 1);
    for (let i = Math.max(0, cur - 1); i <= Math.min(total - 1, cur + 1); i++) set.add(i);
    const sorted = Array.from(set).sort((a, b) => a - b);
    const result: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(-1);
      result.push(sorted[i]);
    }
    return result;
  }

  prevTaskPage(): void { if (this.taskPage > 0) this.taskPage--; }
  nextTaskPage(): void { if (this.taskPage < this.taskPageCount - 1) this.taskPage++; }
  goToTaskPage(n: number): void { this.taskPage = n; }

  // ── Personnel expand / collapse ────────────────────────────────────────────
  auditorsExpanded  = false;
  reviewersExpanded = false;

  toggleAuditors(): void  { this.auditorsExpanded  = !this.auditorsExpanded; }
  toggleReviewers(): void { this.reviewersExpanded = !this.reviewersExpanded; }

  // ── Personnel pagination ───────────────────────────────────────────────────
  readonly personPageSize = SCOPE_JOB_PERSON_PAGE_SIZE;
  auditorPage  = 0;
  reviewerPage = 0;

  get pagedAuditors(): string[] {
    const start = this.auditorPage * this.personPageSize;
    return this.job.assignedAuditors.slice(start, start + this.personPageSize);
  }

  get auditorPageCount(): number {
    return Math.max(1, Math.ceil(this.job.assignedAuditors.length / this.personPageSize));
  }

  get auditorPages(): number[] {
    return Array.from({ length: this.auditorPageCount }, (_, i) => i);
  }

  get auditorPageRange(): string {
    const start = this.auditorPage * this.personPageSize + 1;
    const end   = Math.min((this.auditorPage + 1) * this.personPageSize, this.job.assignedAuditors.length);
    return `${start}–${end}`;
  }

  prevAuditorPage(): void { if (this.auditorPage > 0) this.auditorPage--; }
  nextAuditorPage(): void { if (this.auditorPage < this.auditorPageCount - 1) this.auditorPage++; }
  goToAuditorPage(n: number): void { this.auditorPage = n; }

  get pagedReviewers(): string[] {
    const start = this.reviewerPage * this.personPageSize;
    return this.job.assignedReviewers.slice(start, start + this.personPageSize);
  }

  get reviewerPageCount(): number {
    return Math.max(1, Math.ceil(this.job.assignedReviewers.length / this.personPageSize));
  }

  get reviewerPages(): number[] {
    return Array.from({ length: this.reviewerPageCount }, (_, i) => i);
  }

  get reviewerPageRange(): string {
    const start = this.reviewerPage * this.personPageSize + 1;
    const end   = Math.min((this.reviewerPage + 1) * this.personPageSize, this.job.assignedReviewers.length);
    return `${start}–${end}`;
  }

  prevReviewerPage(): void { if (this.reviewerPage > 0) this.reviewerPage--; }
  nextReviewerPage(): void { if (this.reviewerPage < this.reviewerPageCount - 1) this.reviewerPage++; }
  goToReviewerPage(n: number): void { this.reviewerPage = n; }

  // ── Sub-scopes ─────────────────────────────────────────────────────────────
  subscopeQuery = '';

  onSubscopeSearch(e: Event): void {
    this.subscopeQuery = (e.target as HTMLInputElement).value;
  }

  /** Deterministic mock risk level derived from the sub-scope name */
  private subscopeRisk(name: string): SubScopeRisk {
    const seed = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const risks = Object.values(SubScopeRisks);
    return risks[seed % risks.length];
  }

  get subscopeItems(): SubScopeItem[] {
    return (this.job.subscopes ?? []).map(name => ({
      name,
      category: SUBSCOPE_DEFAULT_CATEGORY,
      risk: this.subscopeRisk(name),
    }));
  }

  get filteredSubscopes(): SubScopeItem[] {
    const q = this.subscopeQuery.trim().toLowerCase();
    if (!q) return this.subscopeItems;
    return this.subscopeItems.filter(s => s.name.toLowerCase().includes(q));
  }

  riskLabel(r: SubScopeRisk): string {
    return SUBSCOPE_RISK_LABELS[r];
  }

  ngOnInit(): void {
    this.job   = this.data?.job ?? MOCK_JOB;
    this.tasks = generateTasksForJob(this.job);
  }

  // ── Job display helpers ──────────────────────────────────────────────────

  get statusLabel(): string {
    return SCOPE_JOB_STATUS_LABELS[this.job.status];
  }

  get frequencyLabel(): string {
    return SCOPE_JOB_FREQUENCY_LABELS[this.job.auditFrequency];
  }

  get modeLabel(): string {
    return SCOPE_JOB_MODE_OF_AUDIT_LABELS[this.job.modeOfAudit] ?? this.job.modeOfAudit;
  }

  get durationDays(): number {
    const ms = this.job.periodEnd.getTime() - this.job.periodStart.getTime();
    return Math.round(ms / MS_PER_DAY) + 1;
  }

  get progressPct(): number {
    const now   = Date.now();
    const start = this.job.periodStart.getTime();
    const end   = this.job.periodEnd.getTime();
    if (now <= start) return 0;
    if (now >= end)   return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  // ── Task helpers ─────────────────────────────────────────────────────────

  taskStatusLabel(s: TaskStatus): string {
    return SCOPE_TASK_STATUS_LABELS[s];
  }

  taskStatusIcon(s: TaskStatus): string {
    return SCOPE_TASK_STATUS_ICONS[s];
  }

  taskPriorityLabel(p: TaskPriority): string {
    return SCOPE_TASK_PRIORITY_LABELS[p];
  }

  get taskCounts(): { completed: number; inProgress: number; open: number; overdue: number } {
    return this.tasks.reduce(
      (acc, t) => {
        if (t.status === ScopeTaskStatuses.Completed)        acc.completed++;
        else if (t.status === ScopeTaskStatuses.InProgress) acc.inProgress++;
        else if (t.status === ScopeTaskStatuses.Overdue)    acc.overdue++;
        else                                 acc.open++;
        return acc;
      },
      { completed: 0, inProgress: 0, open: 0, overdue: 0 },
    );
  }

  get taskCompletionPct(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.taskCounts.completed / this.tasks.length) * 100);
  }

  // ── Shared helpers ───────────────────────────────────────────────────────

  auditorProfile(id: string): AuditorProfile | undefined {
    return AUDITOR_REGISTRY[id];
  }

  reviewerProfile(id: string): ReviewerProfile | undefined {
    return REVIEWER_REGISTRY[id];
  }

  auditorName(id: string): string {
    return AUDITOR_REGISTRY[id]?.name ?? REVIEWER_REGISTRY[id]?.name ?? id;
  }

  auditorInitials(id: string): string {
    return AUDITOR_REGISTRY[id]?.initials
      ?? REVIEWER_REGISTRY[id]?.initials
      ?? id.replace(/\./g, '').slice(0, 2).toUpperCase();
  }

  onClose(): void {
    this.drawerRef.close(null);
  }
}

/* ── Fallback mock ── */
const MOCK_JOB: ScopeJob = {
  id:                'SJ-004',
  title:             'Financial Controls Review — Apr 2025',
  scopeId:           'SC-001',
  scopeName:         'Financial Controls Review',
  company:           'Crowe UAE',
  division:          'Dubai',
  subDivision:       'Internal Audit',
  auditFrequency:    'monthly',
  modeOfAudit:       'full',
  periodLabel:       'Apr 2025',
  periodStart:       new Date('2025-04-01'),
  periodEnd:         new Date('2025-04-30'),
  assignedAuditors:  ['alice', 'bob'],
  assignedReviewers: ['emma'],
  status:            'in_progress',
  createdDate:       new Date('2025-01-01'),
  isActive:          true,
  objective:         'Assess the design and operating effectiveness of key financial controls across revenue, expenditure, and payroll cycles to ensure accuracy and completeness of financial reporting.',
  subscopes:         ['Revenue Cycle Controls', 'Expenditure & AP Controls', 'Payroll Verification', 'Journal Entry Review'],
};
