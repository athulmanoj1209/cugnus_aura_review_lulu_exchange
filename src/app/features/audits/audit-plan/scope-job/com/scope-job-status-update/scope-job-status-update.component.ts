import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { TextareaModule }  from 'primeng/textarea';
import { ToastModule }     from 'primeng/toast';
import { TooltipModule }   from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService }  from 'primeng/api';

import {
  ScopeJob,
  JobStatus,
  AuditFrequency,
} from '../../list/scope-job-list.component';
import {
  ScopeTask,
  TaskStatus,
  TaskPriority,
} from '../../profile/scope-job-profile.component';
import { DRAWER_DATA, DrawerRef } from '../../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  ScopeJobStatuses,
  ScopeJobStatusUpdateTargets,
  ScopeTaskStatuses,
  SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE,
  type ScopeJobControlRating,
  type ScopeJobOverallRating,
  type ScopeJobStatusUpdateTarget,
  MS_PER_DAY,
  SCOPE_JOB_DEFAULT_AUDITOR_ID,
  SCOPE_JOB_FIELD_LIMITS,
} from '../../constants/scope-job.constants';
import {
  SCOPE_JOB_CONTROL_RATING_ICONS,
  SCOPE_JOB_CONTROL_RATING_LABELS,
  SCOPE_JOB_DEFAULT_ROLES,
  SCOPE_JOB_FREQUENCY_LABELS,
  SCOPE_JOB_MODE_OF_AUDIT_LABELS,
  SCOPE_JOB_OVERALL_RATING_OPTIONS,
  SCOPE_JOB_PERSON_NAMES,
  SCOPE_JOB_STATUS_LABELS,
  SCOPE_JOB_STATUS_UPDATE_OPTIONS,
  SCOPE_TASK_PRIORITY_LABELS,
  SCOPE_TASK_STATUS_LABELS,
  SCOPE_TASK_STATUS_UPDATE_OPTIONS,
  type ScopeJobCardOption,
} from '../../constants/scope-job-labels.constants';
import {
  SCOPE_JOB_STATUS_UPDATE_ERRORS,
  SCOPE_JOB_STATUS_UPDATE_LABELS,
  SCOPE_JOB_TOAST_MESSAGES,
  SCOPE_JOB_UNKNOWN_TASK_TITLE,
  maxCharactersMessage,
  minTimeSpentMessage,
  pluralize,
  statusUpdatedMessage,
} from '../../constants/scope-job-messages.constants';

// ── Types ─────────────────────────────────────────────────────────────────────
export type SuTarget        = ScopeJobStatusUpdateTarget;
export type SuControlRating = ScopeJobControlRating;
export type OverallRating   = ScopeJobOverallRating;

export interface StatusUpdateTask extends ScopeTask {
  objective?:      string;
  controlRating?:  SuControlRating;
  checklistItems?: string[];
  startDate?:      Date;
  endDate?:        Date;
  observations?:   string;
}

export interface StatusUpdateDrawerData {
  target:  SuTarget;
  job:     ScopeJob;
  task?:   StatusUpdateTask;   // required when target === 'task'
  tasks?:  StatusUpdateTask[]; // for job target — task progress section
}

// Shared option shape — keeps statusOptions getter from returning a union type
export type StatusOption = ScopeJobCardOption;

export interface StatusUpdateResult {
  type:             typeof SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE;
  target:           SuTarget;
  status:           string;
  note:             string;
  auditOverview?:   string;
  timeSpentHours?:  number;
  overallRating?:   OverallRating;
  jobId?:           string;
  taskId?:          string;
}

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector:    'app-status-update-drawer',
  standalone:  true,
  imports: [
    CommonModule, ReactiveFormsModule,
    ButtonModule, TextareaModule, ToastModule, TooltipModule, InputTextModule,
  
    DrawIconComponent,],
  providers:   [MessageService],
  templateUrl: './scope-job-status-update.component.html',
  styleUrl:    './scope-job-status-update.component.scss',
})
export class StatusUpdateDrawerComponent implements OnInit {
  private readonly drawerRef = inject(DrawerRef);
  readonly         data      = inject(DRAWER_DATA, { optional: true }) as StatusUpdateDrawerData;
  private readonly fb        = inject(FormBuilder);
  private readonly msgSvc    = inject(MessageService);

  form!: FormGroup;
  submitted = false;

  // ── Status option tables ──────────────────────────────────────────────────
  readonly jobStatusOptions: StatusOption[] = SCOPE_JOB_STATUS_UPDATE_OPTIONS;

  readonly taskStatusOptions: StatusOption[] = SCOPE_TASK_STATUS_UPDATE_OPTIONS;

  get statusOptions(): StatusOption[] {
    return this.isJobTarget ? this.jobStatusOptions : this.taskStatusOptions;
  }

  readonly overallRatingOptions: ScopeJobCardOption<OverallRating>[] = SCOPE_JOB_OVERALL_RATING_OPTIONS;

  // Exposed for the template.
  readonly ScopeTaskStatuses = ScopeTaskStatuses;
  readonly fieldLimits       = SCOPE_JOB_FIELD_LIMITS;
  readonly errors            = SCOPE_JOB_STATUS_UPDATE_ERRORS;
  readonly unknownTaskTitle  = SCOPE_JOB_UNKNOWN_TASK_TITLE;
  readonly auditorRole       = SCOPE_JOB_DEFAULT_ROLES.Auditor;
  readonly noteMaxMessage          = maxCharactersMessage(SCOPE_JOB_FIELD_LIMITS.StatusNoteMax);
  readonly auditOverviewMaxMessage = maxCharactersMessage(SCOPE_JOB_FIELD_LIMITS.AuditOverviewMax);
  readonly minTimeSpentMessage     = minTimeSpentMessage(SCOPE_JOB_FIELD_LIMITS.TimeSpentHoursMin);
  readonly pluralize         = pluralize;

  /** True when updating a job (vs a single task). */
  get isJobTarget(): boolean { return this.data?.target === ScopeJobStatusUpdateTargets.Job; }

  /** Header chip / submit copy for the current target. */
  get targetLabels() {
    return this.isJobTarget ? SCOPE_JOB_STATUS_UPDATE_LABELS.Job : SCOPE_JOB_STATUS_UPDATE_LABELS.Task;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const initial = this.isJobTarget
      ? this.data.job.status
      : (this.data?.task?.status ?? ScopeTaskStatuses.Open);

    this.form = this.fb.group({
      status:          [initial, Validators.required],
      note:            ['', [Validators.required, Validators.maxLength(SCOPE_JOB_FIELD_LIMITS.StatusNoteMax)]],
      auditOverview:   ['', Validators.maxLength(SCOPE_JOB_FIELD_LIMITS.AuditOverviewMax)],
      timeSpentHours:  [null as number | null],
      overallRating:   ['' as string],
    });

    // Set initial validator state, then keep in sync with status changes
    this._syncCompletionValidators(initial);
    this.form.get('status')!.valueChanges.subscribe(v => this._syncCompletionValidators(v));
  }

  private _syncCompletionValidators(status: string): void {
    // Job and task statuses share the 'completed' value.
    const isCompleted = status === ScopeJobStatuses.Completed;
    const { AuditOverviewMax, TimeSpentHoursMin, TimeSpentHoursMax } = SCOPE_JOB_FIELD_LIMITS;

    const overviewCtrl = this.form.get('auditOverview')!;
    overviewCtrl.setValidators(
      isCompleted ? [Validators.required, Validators.maxLength(AuditOverviewMax)] : [Validators.maxLength(AuditOverviewMax)],
    );
    overviewCtrl.updateValueAndValidity({ emitEvent: false });

    const timeCtrl = this.form.get('timeSpentHours')!;
    timeCtrl.setValidators(
      isCompleted ? [Validators.required, Validators.min(TimeSpentHoursMin), Validators.max(TimeSpentHoursMax)] : null,
    );
    timeCtrl.updateValueAndValidity({ emitEvent: false });

    const ratingCtrl = this.form.get('overallRating')!;
    ratingCtrl.setValidators(isCompleted ? [Validators.required] : null);
    ratingCtrl.updateValueAndValidity({ emitEvent: false });
  }

  // ── Getters ───────────────────────────────────────────────────────────────
  get noteLength(): number          { return this.form.get('note')?.value?.length ?? 0; }
  get auditOverviewLength(): number { return this.form.get('auditOverview')?.value?.length ?? 0; }
  get currentAuditorId(): string    { return this.data?.job?.assignedAuditors?.[0] ?? SCOPE_JOB_DEFAULT_AUDITOR_ID; }
  get isCompletedStatus(): boolean  { return this.form.get('status')?.value === ScopeJobStatuses.Completed; }

  isStatusSelected(val: string): boolean { return this.form.get('status')?.value === val; }
  isRatingSelected(val: string): boolean { return this.form.get('overallRating')?.value === val; }

  setStatus(val: string): void {
    this.form.patchValue({ status: val });
    this.form.get('status')?.markAsTouched();
  }

  setRating(val: string): void {
    this.form.patchValue({ overallRating: val });
    this.form.get('overallRating')?.markAsTouched();
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!ctrl && ctrl.invalid && (this.submitted || ctrl.touched);
  }

  // ── Display helpers ───────────────────────────────────────────────────────
  auditorName(id: string): string { return SCOPE_JOB_PERSON_NAMES[id] ?? id; }

  auditorInitials(id: string): string {
    return this.auditorName(id).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  statusLabel(s: JobStatus): string {
    return SCOPE_JOB_STATUS_LABELS[s] ?? s;
  }

  taskStatusLabel(s: TaskStatus): string {
    return SCOPE_TASK_STATUS_LABELS[s] ?? s;
  }

  frequencyLabel(f: AuditFrequency): string {
    return SCOPE_JOB_FREQUENCY_LABELS[f] ?? f;
  }

  modeLabel(m: string): string {
    return SCOPE_JOB_MODE_OF_AUDIT_LABELS[m as keyof typeof SCOPE_JOB_MODE_OF_AUDIT_LABELS] ?? m;
  }

  priorityLabel(p: TaskPriority): string { return SCOPE_TASK_PRIORITY_LABELS[p] ?? p; }

  crLabel(r: SuControlRating): string {
    return SCOPE_JOB_CONTROL_RATING_LABELS[r] ?? r;
  }

  crIcon(r: SuControlRating): string {
    return SCOPE_JOB_CONTROL_RATING_ICONS[r] ?? '';
  }

  get durationDays(): number {
    const ms = this.data.job.periodEnd.getTime() - this.data.job.periodStart.getTime();
    return Math.round(ms / MS_PER_DAY) + 1;
  }

  get taskCounts() {
    const tasks = this.data?.tasks ?? [];
    return tasks.reduce(
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

  get completionPct(): number {
    const tasks = this.data?.tasks ?? [];
    return tasks.length ? Math.round((this.taskCounts.completed / tasks.length) * 100) : 0;
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  onUpdate(): void {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { status, note, auditOverview, timeSpentHours, overallRating } = this.form.value;
    const isJob = this.isJobTarget;

    const result: StatusUpdateResult = {
      type:            SCOPE_JOB_STATUS_UPDATE_RESULT_TYPE,
      target:          this.data.target,
      status,
      note,
      auditOverview:   auditOverview   || undefined,
      timeSpentHours:  timeSpentHours  ?? undefined,
      overallRating:   (overallRating  || undefined) as OverallRating | undefined,
      jobId:           isJob ? this.data.job.id : undefined,
      taskId:          isJob ? undefined : this.data.task?.id,
    };

    this.msgSvc.add({
      severity: 'success',
      summary:  SCOPE_JOB_TOAST_MESSAGES.StatusUpdatedTitle,
      detail:   statusUpdatedMessage(this.targetLabels.Target, isJob ? this.statusLabel(status) : this.taskStatusLabel(status)),
    });

    this.drawerRef.close(result);
  }

  onCancel(): void { this.drawerRef.close(null); }
}