import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import {
  ScopeTaskRfiSources,
  ScopeTaskStatuses,
  SCOPE_TASK_ID_PREFIX,
  SCOPE_TASK_NAME_MAX_LENGTH,
  SCOPE_TASK_NAME_MIN_LENGTH,
  SCOPE_TASK_OBJECTIVE_MAX_LENGTH,
} from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_TASK_AUDITOR_OPTIONS,
  SCOPE_TASK_CHECKLIST_OPTIONS,
  SCOPE_TASK_CONTROL_RATING_OPTIONS,
  SCOPE_TASK_DEFAULT_STATUS_LABEL,
  SCOPE_TASK_RFI_LIBRARY_OPTIONS,
  SCOPE_TASK_RFI_SOURCE_OPTIONS,
  SCOPE_TASK_RISK_PRIORITY_OPTIONS,
  SCOPE_TASK_STATUS_OPTIONS,
  SCOPE_TASK_TYPE_OPTIONS,
} from '@/app/features/audits/audit-plan/scope/constants/scope-labels.constants';
import {
  SCOPE_INVALID_FIELD_MESSAGE,
  SCOPE_TASK_ERROR_MESSAGES,
  SCOPE_TASK_NOTICES,
} from '@/app/features/audits/audit-plan/scope/constants/scope-messages.constants';

@Component({
  selector: 'app-scope-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    SelectButtonModule,
    MultiSelectModule,
    TabsModule,
    TextareaModule,
    DatePickerModule,
    FileUploadModule,
    ToastModule,
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './scope-task.component.html',
  styleUrl: './scope-task.component.scss',
})
export class ScopeTaskComponent implements OnInit, OnChanges, OnDestroy {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() taskSaved = new EventEmitter<Record<string, unknown>>();

  /** Existing tasks to seed the list with (e.g. when editing a scope that already has tasks). */
  @Input() initialTasks: Record<string, unknown>[] = [];

  /** The parent scope's timeframe — a task's start/end must fall inside it (whole days). */
  @Input() scopeStartDate: Date | string | null = null;
  @Input() scopeEndDate: Date | string | null = null;

  /**
   * Scope bounds as whole days (start from 00:00, end through 23:59), bound to
   * the date pickers' [minDate]/[maxDate]. Fields refreshed in ngOnChanges, not
   * getters — a new Date per change-detection pass breaks p-datepicker's month
   * navigation.
   */
  scopeMinDate: Date | null = null;
  scopeMaxDate: Date | null = null;

  taskForm!: FormGroup;
  submitted = false;
  tasks: Record<string, unknown>[] = [];
  editingTaskIndex: number | null = null;

  taskStatusOptions = SCOPE_TASK_STATUS_OPTIONS;

  // ── SelectButton option sets ───────────────────────────────────────────────
  taskTypeOptions = SCOPE_TASK_TYPE_OPTIONS;

  rfiSourceOptions = SCOPE_TASK_RFI_SOURCE_OPTIONS;

  controlRatingOptions = SCOPE_TASK_CONTROL_RATING_OPTIONS;

  riskPriorityOptions = SCOPE_TASK_RISK_PRIORITY_OPTIONS;

  // ── Dropdown / multiselect option sets ────────────────────────────────────
  checklistOptions = SCOPE_TASK_CHECKLIST_OPTIONS;

  rfiLibraryOptions = SCOPE_TASK_RFI_LIBRARY_OPTIONS;

  auditorOptions = SCOPE_TASK_AUDITOR_OPTIONS;

  taskFormErrorMessages = SCOPE_TASK_ERROR_MESSAGES;

  // Exposed for the template.
  readonly ScopeTaskRfiSources = ScopeTaskRfiSources;
  readonly SCOPE_TASK_OBJECTIVE_MAX_LENGTH = SCOPE_TASK_OBJECTIVE_MAX_LENGTH;

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.buildTaskForm();
    // 'add' mode: the caller passes no initialTasks, so this starts empty —
    // a freshly-created scope always begins with a clean task list.
    // 'edit' mode: seeded with that scope's existing tasks. Cloned so edits
    // to `this.tasks` never mutate the caller's array directly until submit.
    this.tasks = this.initialTasks.map(t => ({ ...t }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['scopeStartDate'] && !changes['scopeEndDate']) return;
    const min = this.scopeStartDate ? new Date(this.scopeStartDate) : null;
    const max = this.scopeEndDate ? new Date(this.scopeEndDate) : null;
    min?.setHours(0, 0, 0, 0);
    max?.setHours(23, 59, 59, 999);
    this.scopeMinDate = min && !isNaN(min.getTime()) ? min : null;
    this.scopeMaxDate = max && !isNaN(max.getTime()) ? max : null;
    // The scope's dates changed — re-check the task being entered against them.
    this.taskForm?.updateValueAndValidity();
  }

  get f() {
    return this.taskForm.controls;
  }

  ngOnDestroy(): void { }

  // ── Form builder ───────────────────────────────────────────────────────────
  private buildTaskForm(): void {
    this.taskForm = this.fb.group(
      {
        taskName: ['', [Validators.required, Validators.minLength(SCOPE_TASK_NAME_MIN_LENGTH), Validators.maxLength(SCOPE_TASK_NAME_MAX_LENGTH)]],
        status: [ScopeTaskStatuses.NotStarted, Validators.required],
        objective: ['', Validators.maxLength(SCOPE_TASK_OBJECTIVE_MAX_LENGTH)],
        checklistItems: [[]],
        assignedAuditor: [null, Validators.required],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        controlRating: ['', Validators.required],
        riskPriority: ['', Validators.required],
        tags: [[]],
        description: [''],
      },
      { validators: this.taskDateRangeValidator.bind(this) },
    );
  }

  // ── Cross-field validator ──────────────────────────────────────────────────
  // End after start, and the whole task inside the scope's timeframe.
  private taskDateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    const errors: ValidationErrors = {};
    if (start && end && new Date(end) <= new Date(start)) {
      errors['endBeforeStart'] = true;
    }
    if (start && this.scopeMinDate && new Date(start) < this.scopeMinDate) {
      errors['startBeforeScopeStart'] = true;
    }
    if (end && this.scopeMaxDate && new Date(end) > this.scopeMaxDate) {
      errors['endAfterScopeEnd'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);

    if (!control || !control.errors) return '';

    const errors = control.errors;
    const firstErrorKey = Object.keys(errors)[0];

    return this.taskFormErrorMessages[controlName]?.[firstErrorKey] || SCOPE_INVALID_FIELD_MESSAGE;
  }

  // ── Computed getters ───────────────────────────────────────────────────────
  get taskObjectiveLength(): number {
    return this.taskForm?.get('objective')?.value?.length ?? 0;
  }

  get isNewRfi(): boolean {
    return this.taskForm?.get('rfiSource')?.value === ScopeTaskRfiSources.New;
  }

  get isLibraryRfi(): boolean {
    return this.taskForm?.get('rfiSource')?.value === ScopeTaskRfiSources.Library;
  }

  get controlRatingValue(): string {
    return this.taskForm?.get('controlRating')?.value ?? '';
  }

  get taskTypeValue(): string {
    return this.taskForm?.get('taskType')?.value ?? '';
  }

  getRiskPriority(task: any): string {
  return String(task.riskPriority);
}

  taskStatusLabel(task: any): string {
    return this.taskStatusOptions.find(o => o.value === task?.status)?.label ?? SCOPE_TASK_DEFAULT_STATUS_LABEL;
  }

  // ── Validation helper ──────────────────────────────────────────────────────
  isTaskInvalid(field: string): boolean {
    const ctrl = this.taskForm?.get(field);
    return !!(ctrl && ctrl.invalid && (this.submitted || ctrl.touched));
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  onAddTask(): void {
    this.submitted = true;
    this.taskForm.markAllAsTouched();

    if (this.taskForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: SCOPE_TASK_NOTICES.ValidationSummary,
        detail: SCOPE_TASK_NOTICES.FixBeforeAdding,
      });
      return;
    }

    // Store dates as 'YYYY-MM-DD' strings (matching the static-data
    // convention) rather than the datepicker's raw Date object, so a task's
    // date shape is the same whether it was just created or loaded from data.
    const value = {
      ...this.taskForm.value,
      startDate: this.formatDate(this.taskForm.value['startDate']),
      endDate: this.formatDate(this.taskForm.value['endDate']),
    };

    if (this.editingTaskIndex !== null) {
      // Preserve the existing id — the form doesn't manage it as a control.
      const id = this.tasks[this.editingTaskIndex]['id'];
      this.tasks[this.editingTaskIndex] = { id, ...value };
      this.messageService.add({
        severity: 'success',
        summary: SCOPE_TASK_NOTICES.UpdatedSummary,
        detail: SCOPE_TASK_NOTICES.updated(this.taskForm.value['taskName']),
      });
      this.editingTaskIndex = null;
    } else {
      this.tasks.push({ id: this.generateTaskId(), ...value });
      this.messageService.add({
        severity: 'success',
        summary: SCOPE_TASK_NOTICES.AddedSummary,
        detail: SCOPE_TASK_NOTICES.added(this.taskForm.value['taskName']),
      });
    }

    this.resetForm();
  }

  private formatDate(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  }

  onEditTask(index: number): void {
    this.editingTaskIndex = index;
    const task = this.tasks[index];
    // The stored dates are 'YYYY-MM-DD' strings — the p-datepicker controls
    // need real Date objects to show the existing value when editing.
    this.taskForm.patchValue({
      ...task,
      startDate: task['startDate'] ? new Date(task['startDate'] as string) : null,
      endDate: task['endDate'] ? new Date(task['endDate'] as string) : null,
    });
    this.tagsList = [...((task['tags'] as string[]) || [])];
    this.submitted = false;
  }

  onClearTask(): void {
    this.editingTaskIndex = null;
    this.resetForm();
  }

  /** Client-side id for a brand-new task — unique enough at this scale, no server round-trip needed. */
  private generateTaskId(): string {
    return SCOPE_TASK_ID_PREFIX + Date.now().toString(36).toUpperCase();
  }

  removeTask(index: number): void {
    if (this.editingTaskIndex === index) {
      this.editingTaskIndex = null;
      this.resetForm();
    } else if (this.editingTaskIndex !== null && this.editingTaskIndex > index) {
      this.editingTaskIndex--;
    }
    this.tasks.splice(index, 1);
  }

  // ── Tags ───────────────────────────────────────────────────────────────────
  tagsList: string[] = [];

  onAddTag(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.tagsList.includes(value)) {
      this.tagsList.push(value);
      this.taskForm.get('tags')?.setValue([...this.tagsList]);
    }
    input.value = '';
    input.focus();
  }

  removeTagChip(index: number): void {
    this.tagsList.splice(index, 1);
    this.taskForm.get('tags')?.setValue([...this.tagsList]);
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  private resetForm(): void {
    this.submitted = false;
    this.tagsList = [];
    this.buildTaskForm();
  }
}