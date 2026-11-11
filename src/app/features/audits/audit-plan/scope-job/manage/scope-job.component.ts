import {
  Component,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { SelectModule }      from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabsModule }        from 'primeng/tabs';
import { TextareaModule }    from 'primeng/textarea';
import { DatePickerModule }  from 'primeng/datepicker';
import { ToastModule }       from 'primeng/toast';
import { TooltipModule }     from 'primeng/tooltip';
import { TagModule }         from 'primeng/tag';
import { MessageService }    from 'primeng/api';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  ScopeJob,
  JobStatus,
  AuditFrequency,
  ModeOfAudit,
} from '../list/scope-job-list.component';
import {
  ScopeTask,
  TaskStatus,
  TaskPriority,
  generateTasksForJob,
} from '../profile/scope-job-profile.component';

import { StatusUpdateDrawerComponent, StatusUpdateDrawerData, StatusUpdateResult } from '../com/scope-job-status-update/scope-job-status-update.component';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  ScopeJobStatusUpdateTargets,
  ScopeTaskPriorities,
  ScopeTaskStatuses,
  SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE,
  type ScopeJobControlRating,
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MINUTE,
  SCOPE_JOB_DRAWER,
  SCOPE_JOB_FIELD_LIMITS,
  SCOPE_JOB_PAGER_MAX_FULL_PAGES,
  SCOPE_JOB_TASK_PAGE_SIZE,
  SCOPE_TASK_ID_INFIX,
  SCOPE_TASK_ID_PAD_LENGTH,
} from '../constants/scope-job.constants';
import {
  SCOPE_JOB_CHECKLIST_ITEM_OPTIONS,
  SCOPE_JOB_CONTROL_RATING_ICONS,
  SCOPE_JOB_CONTROL_RATING_LABELS,
  SCOPE_JOB_CONTROL_RATING_OPTIONS,
  SCOPE_JOB_FREQUENCY_LABELS,
  SCOPE_JOB_MODE_OF_AUDIT_LABELS,
  SCOPE_JOB_MODE_OF_AUDIT_OPTIONS,
  SCOPE_JOB_PERSON_NAMES,
  SCOPE_JOB_PERSON_OPTIONS,
  SCOPE_JOB_STATUS_LABELS,
  SCOPE_JOB_STATUS_OPTIONS,
  SCOPE_TASK_PRIORITY_LABELS,
  SCOPE_TASK_PRIORITY_OPTIONS,
  SCOPE_TASK_STATUS_ICONS,
  SCOPE_TASK_STATUS_LABELS,
  SCOPE_TASK_STATUS_OPTIONS,
} from '../constants/scope-job-labels.constants';
import {
  SCOPE_JOB_ACTIVE_LABELS,
  SCOPE_JOB_TASK_FORM_LABELS,
  SCOPE_JOB_TASK_FORM_TITLES,
  SCOPE_JOB_TOAST_MESSAGES,
  pluralize,
  taskAddedMessage,
  taskStatusUpdatedMessage,
  taskTitleLengthMessage,
  taskUpdatedMessage,
} from '../constants/scope-job-messages.constants';


// ── Drawer data ───────────────────────────────────────────────────────────────
export interface EditScopeJobDrawerData {
  job:    ScopeJob;
  tasks?: EditableTask[];
}

// ── Extended task model ───────────────────────────────────────────────────────
export type ControlRating = ScopeJobControlRating;

export interface EditableTask extends ScopeTask {
  objective?:      string;
  checklistItems?: string[];
  startDate?:      Date;
  endDate?:        Date;
  controlRating?:  ControlRating;
  observations?:   string;
  isNew?:          boolean;   // true only for tasks added in this edit session
}

// Tasks are auto-generated with the same generateTasksForJob() the profile drawer uses.

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-edit-scope-job',
  standalone:  true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, SelectModule, MultiSelectModule,
    TabsModule, TextareaModule, DatePickerModule, ToastModule,
    TooltipModule, TagModule,
  
    DrawIconComponent,],
  providers:   [MessageService],
  templateUrl: './scope-job.component.html',
  styleUrl:    './scope-job.component.scss',
})
export class EditScopeJobComponent implements OnInit, OnDestroy {
  private readonly drawerRef = inject(DrawerRef);
  private readonly data      = inject(DRAWER_DATA, { optional: true }) as EditScopeJobDrawerData | null;
  private readonly drawer    = inject(RightDrawerService);
  private subs = new Subscription();

  job!:  ScopeJob;
  tasks: EditableTask[] = [];

  activeTabIndex = 0;
  submitted      = false;

  // ── Task panel state ──────────────────────────────────────────────────────
  showAddTaskForm  = false;
  addTaskSubmitted = false;
  editingTaskId:  string | null = null;
  addTaskForm!:   FormGroup;

  // ── Task pagination ────────────────────────────────────────────────────────
  readonly taskPageSize = SCOPE_JOB_TASK_PAGE_SIZE;
  taskPage = 0;

  get pagedTasks(): EditableTask[] {
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

  /** Page numbers to display, with -1 as an ellipsis placeholder */
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

  // ── Form ──────────────────────────────────────────────────────────────────
  jobForm!: FormGroup;

  // ── Static options ────────────────────────────────────────────────────────
  readonly statusOptions        = SCOPE_JOB_STATUS_OPTIONS;

  readonly modeOfAuditOptions   = SCOPE_JOB_MODE_OF_AUDIT_OPTIONS;

  readonly auditorOptions       = SCOPE_JOB_PERSON_OPTIONS;
  readonly reviewerOptions      = SCOPE_JOB_PERSON_OPTIONS;

  readonly taskStatusOptions    = SCOPE_TASK_STATUS_OPTIONS;

  readonly taskPriorityOptions  = SCOPE_TASK_PRIORITY_OPTIONS;

  readonly controlRatingOptions = SCOPE_JOB_CONTROL_RATING_OPTIONS;

  readonly checklistItemOptions = SCOPE_JOB_CHECKLIST_ITEM_OPTIONS;

  // Exposed for the template.
  readonly ScopeTaskStatuses = ScopeTaskStatuses;
  readonly fieldLimits       = SCOPE_JOB_FIELD_LIMITS;
  readonly activeLabels      = SCOPE_JOB_ACTIVE_LABELS;
  readonly taskFormLabels    = SCOPE_JOB_TASK_FORM_LABELS;
  readonly taskTitleError    = taskTitleLengthMessage(SCOPE_JOB_FIELD_LIMITS.TaskTitleMin, SCOPE_JOB_FIELD_LIMITS.TaskTitleMax);
  readonly pluralize         = pluralize;

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit(): void {
    this.job   = this.data?.job   ?? MOCK_JOB;
    this.tasks = this.data?.tasks ?? generateTasksForJob(this.job);
    this.buildJobForm();
    this.buildAddTaskForm();
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // ── Getters ───────────────────────────────────────────────────────────────
  get f()  { return this.jobForm.controls; }
  get tf() { return this.addTaskForm.controls; }

  // ── Display helpers ───────────────────────────────────────────────────────
  auditorName(id: string): string     { return SCOPE_JOB_PERSON_NAMES[id] ?? id; }
  auditorInitials(id: string): string {
    return this.auditorName(id).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  statusLabel(s: JobStatus): string {
    return SCOPE_JOB_STATUS_LABELS[s] ?? s;
  }

  frequencyLabel(f: AuditFrequency): string {
    return SCOPE_JOB_FREQUENCY_LABELS[f] ?? f;
  }

  modeLabel(m: string): string {
    return SCOPE_JOB_MODE_OF_AUDIT_LABELS[m as ModeOfAudit] ?? m;
  }

  taskStatusLabel(s: TaskStatus): string {
    return SCOPE_TASK_STATUS_LABELS[s] ?? s;
  }

  taskStatusIcon(s: TaskStatus): string {
    return SCOPE_TASK_STATUS_ICONS[s] ?? '';
  }

  taskPriorityLabel(p: TaskPriority): string {
    return SCOPE_TASK_PRIORITY_LABELS[p] ?? p;
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.jobForm.get(name);
    return !!ctrl && ctrl.invalid && (this.submitted || ctrl.touched);
  }

  isTaskFieldInvalid(name: string): boolean {
    const ctrl = this.addTaskForm.get(name);
    return !!ctrl && ctrl.invalid && (this.addTaskSubmitted || ctrl.touched);
  }

  get durationDays(): number {
    const ms = this.job.periodEnd.getTime() - this.job.periodStart.getTime();
    return Math.round(ms / MS_PER_DAY) + 1;
  }

  // ── Task duration (Start ↔ End Date & Time) ───────────────────────
  /** Raw ms between the task's start and end date-time, or null if either is unset */
  private get taskDurationMs(): number | null {
    const s = this.addTaskForm?.get('startDate')?.value;
    const e = this.addTaskForm?.get('endDate')?.value;
    if (!s || !e) return null;
    return new Date(e).getTime() - new Date(s).getTime();
  }

  /** True when both dates are set and end is after start */
  get taskDurationValid(): boolean {
    const ms = this.taskDurationMs;
    return ms !== null && ms > 0;
  }

  /** True when both dates are set but end is not after start */
  get taskDurationInvalid(): boolean {
    const ms = this.taskDurationMs;
    return ms !== null && ms <= 0;
  }

  get taskDurationDays(): number {
    const ms = this.taskDurationMs;
    return ms && ms > 0 ? Math.floor(ms / MS_PER_DAY) : 0;
  }

  get taskDurationHours(): number {
    const ms = this.taskDurationMs;
    return ms && ms > 0 ? Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR) : 0;
  }

  get taskDurationMinutes(): number {
    const ms = this.taskDurationMs;
    return ms && ms > 0 ? Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE) : 0;
  }

  /** Compact chip label, e.g. "1d 22h" or "3h 30m" */
  get taskDurationShort(): string {
    const d = this.taskDurationDays, h = this.taskDurationHours, m = this.taskDurationMinutes;
    const parts: string[] = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m && !d) parts.push(`${m}m`);   // only show minutes for sub-day spans
    return parts.length ? parts.join(' ') : '0h';
  }

  get objectiveLength(): number { return this.addTaskForm.get('objective')?.value?.length ?? 0; }
  get completionNoteLength(): number { return this.jobForm.get('completionNote')?.value?.length ?? 0; }

  get isEditingTask(): boolean { return this.editingTaskId !== null; }
  get taskFormTitle(): string  { return this.isEditingTask ? SCOPE_JOB_TASK_FORM_TITLES.Edit : SCOPE_JOB_TASK_FORM_TITLES.New; }

  controlRatingLabel(r: ControlRating): string {
    return SCOPE_JOB_CONTROL_RATING_LABELS[r] ?? r;
  }

  controlRatingIcon(r: ControlRating): string {
    return SCOPE_JOB_CONTROL_RATING_ICONS[r] ?? '';
  }

  get taskCounts() {
    return this.tasks.reduce(
      (a, t) => {
        if      (t.status === ScopeTaskStatuses.Completed)  a.completed++;
        else if (t.status === ScopeTaskStatuses.InProgress) a.inProgress++;
        else if (t.status === ScopeTaskStatuses.Overdue)    a.overdue++;
        else                                 a.open++;
        return a;
      },
      { completed: 0, inProgress: 0, open: 0, overdue: 0 },
    );
  }

  get taskCompletionPct(): number {
    return this.tasks.length
      ? Math.round((this.taskCounts.completed / this.tasks.length) * 100)
      : 0;
  }

  // ── Form builders ─────────────────────────────────────────────────────────
  private buildJobForm(): void {
    this.jobForm = this.fb.group(
      {
        status:            [this.job.status,            Validators.required],
        modeOfAudit:       [this.job.modeOfAudit,       Validators.required],
        assignedAuditors:  [this.job.assignedAuditors,  Validators.required],
        assignedReviewers: [this.job.assignedReviewers, Validators.required],
        periodStart:       [this.job.periodStart,       Validators.required],
        periodEnd:         [this.job.periodEnd,         Validators.required],
        completionNote:    ['', Validators.maxLength(SCOPE_JOB_FIELD_LIMITS.CompletionNoteMax)],
      },
      { validators: this.dateRangeValidator },
    );
  }

  private buildAddTaskForm(): void {
    this.addTaskForm = this.fb.group({
      title:          ['', [
        Validators.required,
        Validators.minLength(SCOPE_JOB_FIELD_LIMITS.TaskTitleMin),
        Validators.maxLength(SCOPE_JOB_FIELD_LIMITS.TaskTitleMax),
      ]],
      objective:      ['', Validators.maxLength(SCOPE_JOB_FIELD_LIMITS.TaskObjectiveMax)],
      checklistItems: [[]],
      assignedTo:     [null, Validators.required],
      startDate:      [null, Validators.required],
      endDate:        [null, Validators.required],
      controlRating:  ['',   Validators.required],
      observations:   [''],
      priority:       [ScopeTaskPriorities.Medium, Validators.required],
      status:         [ScopeTaskStatuses.Open,     Validators.required],
    });
  }

  private dateRangeValidator(g: AbstractControl): ValidationErrors | null {
    const s = g.get('periodStart')?.value;
    const e = g.get('periodEnd')?.value;
    if (s && e && new Date(e) <= new Date(s)) return { dateRangeInvalid: true };
    return null;
  }

  // ── Job form actions ──────────────────────────────────────────────────────
  onSave(): void {
    this.submitted = true;
    this.jobForm.markAllAsTouched();

    if (this.jobForm.invalid) {
      this.activeTabIndex = 0;
      this.messageService.add({ severity: 'error', summary: SCOPE_JOB_TOAST_MESSAGES.ValidationErrorTitle, detail: SCOPE_JOB_TOAST_MESSAGES.ValidationError });
      return;
    }

    const payload: Partial<ScopeJob> = { ...this.job, ...this.jobForm.value };
    console.log('[EditScopeJob] Save payload:', payload);
    this.messageService.add({ severity: 'success', summary: SCOPE_JOB_TOAST_MESSAGES.SavedTitle, detail: SCOPE_JOB_TOAST_MESSAGES.Saved });
    this.drawerRef.close(payload);
  }

  onCancel(): void { this.drawerRef.close(null); }

  // ── Task actions ──────────────────────────────────────────────────────────
  private readonly TASK_FORM_DEFAULTS = {
    priority: ScopeTaskPriorities.Medium, status: ScopeTaskStatuses.Open, checklistItems: [], controlRating: '',
  };

  toggleAddTaskForm(): void {
    this.showAddTaskForm = !this.showAddTaskForm;
    if (this.showAddTaskForm) {
      this.editingTaskId    = null;
      this.addTaskSubmitted = false;
      this.addTaskForm.reset(this.TASK_FORM_DEFAULTS);
    } else {
      this.editingTaskId = null;
    }
  }

  editTask(task: EditableTask): void {
    this.editingTaskId    = task.id;
    this.showAddTaskForm  = true;
    this.addTaskSubmitted = false;
    this.addTaskForm.reset(this.TASK_FORM_DEFAULTS);
    this.addTaskForm.patchValue({
      title:          task.title,
      objective:      task.objective      ?? task.description ?? '',
      checklistItems: task.checklistItems ?? [],
      assignedTo:     task.assignedTo,
      startDate:      task.startDate      ?? task.dueDate,
      endDate:        task.endDate        ?? task.dueDate,
      controlRating:  task.controlRating  ?? '',
      observations:   task.observations   ?? '',
      priority:       task.priority,
      status:         task.status,
    });
  }

  setControlRating(rating: ControlRating): void {
    this.addTaskForm.patchValue({ controlRating: rating });
    this.addTaskForm.get('controlRating')?.markAsTouched();
  }

  onSaveTask(): void {
    this.addTaskSubmitted = true;
    this.addTaskForm.markAllAsTouched();
    if (this.addTaskForm.invalid) return;

    const v = this.addTaskForm.value;

    if (this.editingTaskId) {
      this.tasks = this.tasks.map(t =>
        t.id === this.editingTaskId
          ? { ...t,
              title:          v.title,
              objective:      v.objective,
              description:    v.objective ?? '',
              checklistItems: v.checklistItems,
              assignedTo:     v.assignedTo,
              startDate:      v.startDate ? new Date(v.startDate) : undefined,
              endDate:        v.endDate   ? new Date(v.endDate)   : undefined,
              dueDate:        v.endDate   ? new Date(v.endDate)   : t.dueDate,
              controlRating:  v.controlRating,
              observations:   v.observations,
              priority:       v.priority,
              status:         v.status,
            } as EditableTask
          : t,
      );
      this.messageService.add({ severity: 'success', summary: SCOPE_JOB_TOAST_MESSAGES.TaskUpdatedTitle, detail: taskUpdatedMessage(v.title) });
    } else {
      const newTask: EditableTask = {
        id:             `${this.job.id}${SCOPE_TASK_ID_INFIX}${String(this.tasks.length + 1).padStart(SCOPE_TASK_ID_PAD_LENGTH, '0')}`,
        title:          v.title,
        description:    v.objective ?? '',
        objective:      v.objective,
        checklistItems: v.checklistItems ?? [],
        assignedTo:     v.assignedTo,
        startDate:      v.startDate ? new Date(v.startDate) : undefined,
        endDate:        v.endDate   ? new Date(v.endDate)   : undefined,
        dueDate:        v.endDate   ? new Date(v.endDate)   : new Date(),
        controlRating:  v.controlRating,
        observations:   v.observations,
        priority:       v.priority,
        status:         v.status,
        isNew:          true,
      };
      this.tasks = [newTask, ...this.tasks];
      this.taskPage = 0;   // new task goes to front — jump to first page
      this.messageService.add({ severity: 'success', summary: SCOPE_JOB_TOAST_MESSAGES.TaskAddedTitle, detail: taskAddedMessage(newTask.title) });
    }

    this.showAddTaskForm  = false;
    this.editingTaskId    = null;
    this.addTaskSubmitted = false;
    this.addTaskForm.reset(this.TASK_FORM_DEFAULTS);
  }

  // Opens the dedicated StatusUpdateDrawer for a single task (with required note)
  async openTaskStatusUpdate(task: EditableTask): Promise<void> {
    const ref = this.drawer.open<StatusUpdateDrawerComponent, StatusUpdateDrawerData>(
      StatusUpdateDrawerComponent, {
        ...SCOPE_JOB_DRAWER.TaskStatusUpdate,
        data: {
          target: ScopeJobStatusUpdateTargets.Task,
          job:    this.job,
          task:   task as StatusUpdateDrawerData['task'],
        },
      },
    );

    const result = await ref.afterClosed as StatusUpdateResult | null;
    if (result?.type === SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE && result.taskId && result.status) {
      this.tasks = this.tasks.map(t =>
        t.id === result.taskId ? { ...t, status: result.status as TaskStatus } : t,
      );
      this.messageService.add({
        severity: 'success',
        summary:  SCOPE_JOB_TOAST_MESSAGES.TaskUpdatedTitle,
        detail:   taskStatusUpdatedMessage(result.status),
      });
    }
  }

  updateTaskStatus(task: EditableTask, status: TaskStatus): void {
    task.status = status;
    this.tasks  = [...this.tasks];
  }

  removeTask(taskId: string): void {
    if (this.editingTaskId === taskId) { this.showAddTaskForm = false; this.editingTaskId = null; }
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    // Clamp page if it's now beyond the last page
    const maxPage = Math.max(0, this.taskPageCount - 1);
    if (this.taskPage > maxPage) this.taskPage = maxPage;
    this.messageService.add({ severity: 'info', summary: SCOPE_JOB_TOAST_MESSAGES.TaskRemovedTitle, detail: SCOPE_JOB_TOAST_MESSAGES.TaskRemoved });
  }
}

// ── Fallback mock ─────────────────────────────────────────────────────────────
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
};