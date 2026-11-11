import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, SimpleChange, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
 
// ── Interfaces ────────────────────────────────────────────────────────────────
// ── Interfaces ────────────────────────────────────────────────────────────────
export interface AuditScope {
  id: string;
  parentScope:              string | null;
  scopeName:                string;
  scopeType:                string;
  linkedDepartments:        string[];
  auditFrequency:           string;
  modeOfAudit:              string;
  objective:                string;
  startDate:                Date;
  endDate:                  Date;
  assignedAuditors:         string[];
  hourlyRate:               number | null;
  estimatedHours:           number | null;
  samplingMethodology:      string;
  samplingSize:             number | null;
  justificationForSampling: string;
  riskReferenceId:          string;
  riskRating:               string;
  completionNote:           string;
  status:                   string;
}
 
// ── Cross-field validator ─────────────────────────────────────────────────────
function endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end   = group.get('endDate')?.value;
  if (start && end && new Date(end) <= new Date(start)) {
    return { endBeforeStart: true };
  }
  return null;
}

@Component({
  selector: 'app-scope-audit-plan',
  imports: [CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ToastModule,
  ConfirmDialogModule,
  ButtonModule,
  InputTextModule,
  SelectModule,
  TableModule,
  DrawerModule,
  DialogModule,
  TabsModule,
  TooltipModule,
  MultiSelectModule,
  DatePickerModule,
  InputNumberModule,
  FileUploadModule,
  TextareaModule,
    DrawIconComponent,],
  providers: [MessageService, ConfirmationService],
  templateUrl: './scope-audit-plan.component.html',
  styleUrl: './scope-audit-plan.component.scss',
})
export class ScopeAuditPlanComponent implements OnInit, OnDestroy {
  // ── Drawer state ─────────────────────────────────────────────────────────────
  // ── Pagination inputs from parent ─────────────────────────────────────────
  /** Page index (0-based), passed in from parent paginator */
  @Input() pageIndex = 0;
  /** Rows per page */
  @Input() pageSize  = 10;

  // ── Auditor dialog state ──────────────────────────────────────────────────
  auditorDialogVisible  = false;
  auditorDialogName     = '';
  auditorDialogList:    string[] = [];

  // ── Drawer state ──────────────────────────────────────────────────────────
  drawerVisible = false;
  /** 'view' | 'edit' — no 'add' mode in this component */
  drawerMode: 'view' | 'edit' = 'view';
  editingId: string | null = null;
 
  get isViewMode(): boolean { return this.drawerMode === 'view'; }

  scopeForm!: FormGroup;
 
  // ── Evidence ──────────────────────────────────────────────────────────────
  evidenceFiles: File[] = [];
 
  // ── Static data ───────────────────────────────────────────────────────────
  scopes: AuditScope[] = [
    {
      id: 'SC-001',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'departmental',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3', 'auditor-4'],
      hourlyRate: 100,
      estimatedHours: 120,
      samplingMethodology: 'risk-based',
      samplingSize: 50,
      justificationForSampling: '',
      riskReferenceId: 'RR-001',
      riskRating: 'high',
      completionNote: '',
      status: 'Financial Audit 2026 Q1',
    },
    {
      id: 'SC-002',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'functional',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3'],
      hourlyRate: 75,
      estimatedHours: 80,
      samplingMethodology: 'random',
      samplingSize: 30,
      justificationForSampling: '',
      riskReferenceId: 'RR-002',
      riskRating: 'medium',
      completionNote: '',
      status: 'Financial Audit 2026 Q1',
    },
    {
      id: 'SC-003',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'independent',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-2', 'auditor-3', 'auditor-4'],
      hourlyRate: 150,
      estimatedHours: 60,
      samplingMethodology: 'judgmental',
      samplingSize: 20,
      justificationForSampling: 'Targeting highest-risk transactions.',
      riskReferenceId: 'RR-003',
      riskRating: 'low',
      completionNote: '',
      status: 'Financial Audit 2026 Q1',
    },
    {
      id: 'SC-004',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'departmental',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-1', 'auditor-3'],
      hourlyRate: 50,
      estimatedHours: 200,
      samplingMethodology: 'random',
      samplingSize: 100,
      justificationForSampling: '',
      riskReferenceId: 'RR-004',
      riskRating: 'medium',
      completionNote: '',
      status: 'Financial Audit 2026 Q1',
    },
    {
      id: 'SC-005',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'functional',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-2', 'auditor-4'],
      hourlyRate: 100,
      estimatedHours: 90,
      samplingMethodology: 'risk-based',
      samplingSize: 40,
      justificationForSampling: '',
      riskReferenceId: 'RR-005',
      riskRating: 'high',
      completionNote: '',
      status: 'Financial Audit 2026 Q1',
    },
    {
      id: 'SC-006',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'departmental',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Comprehensive review of financial controls and reporting processes',
      startDate: new Date('2026-01-16'),
      endDate:   new Date('2026-03-16'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3'],
      hourlyRate: 75,
      estimatedHours: 110,
      samplingMethodology: 'random',
      samplingSize: 55,
      justificationForSampling: '',
      riskReferenceId: 'RR-006',
      riskRating: 'low',
      completionNote: 'Pending sign-off.',
      status: 'Financial Audit 2026 Q1',
    },
  ];
 
  /** Slice of scopes shown on current page */
  get pagedScopes(): AuditScope[] {
    const start = this.pageIndex * this.pageSize;
    return this.scopes.slice(start, start + this.pageSize);
  }
 
  /** Total record count — used by parent paginator */
  get totalRecords(): number { return this.scopes.length; }
 
  // ── Option arrays ─────────────────────────────────────────────────────────
  departmentOptions = [
    { label: 'Finance',    value: 'finance' },
    { label: 'IT',         value: 'it' },
    { label: 'HR',         value: 'hr' },
    { label: 'Operations', value: 'operations' },
    { label: 'Legal',      value: 'legal' },
    { label: 'Compliance', value: 'compliance' },
  ];
 
  scopeTypeOptions = [
    { label: 'Departmental', value: 'departmental' },
    { label: 'Functional',   value: 'functional' },
    { label: 'Independent',  value: 'independent' },
  ];
 
  auditFrequencyOptions = [
    { label: 'Monthly',     value: 'monthly' },
    { label: 'Quarterly',   value: 'quarterly' },
    { label: 'Semi-Annual', value: 'semi-annual' },
    { label: 'Annually',    value: 'annually' },
  ];
 
  modeOfAuditOptions = [
    { label: 'Full',     value: 'Full' },
    { label: 'Limited',  value: 'Limited' },
    { label: 'Thematic', value: 'Thematic' },
    { label: 'Issue',    value: 'Issue' },
  ];
 
  auditorOptions = [
    { label: 'Alice Johnson',  value: 'auditor-1' },
    { label: 'Bob Smith',      value: 'auditor-2' },
    { label: 'Carol Williams', value: 'auditor-3' },
    { label: 'David Brown',    value: 'auditor-4' },
  ];
 
  hourlyRateOptions = [
    { label: '$50/hr',  value: 50  },
    { label: '$75/hr',  value: 75  },
    { label: '$100/hr', value: 100 },
    { label: '$150/hr', value: 150 },
  ];
 
  methodologyOptions = [
    { label: 'Random',     value: 'random' },
    { label: 'Risk-based', value: 'risk-based' },
    { label: 'Judgmental', value: 'judgmental' },
  ];
 
  riskRatingOptions = [
    { label: 'Low',    value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High',   value: 'high' },
  ];
 
  statusOptions = [
    { label: 'Planning',  value: 'Planning' },
    { label: 'Active',    value: 'Active' },
    { label: 'On Hold',   value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];
 
  get availableScopeOptions() {
    return this.scopes
      .filter(s => s.id !== this.editingId)
      .map(s => ({ label: `${s.id} – ${s.scopeName}`, value: s.id }));
  }
 
  private sub = new Subscription();
 
  get f()               { return this.scopeForm.controls; }
  get objectiveLength() { return (this.f['objective'].value as string)?.length ?? 0; }
  get isJudgmental()    { return this.f['samplingMethodology'].value === 'judgmental'; }
 
  get computedBudget(): string {
    const rate  = this.f['hourlyRate'].value as number | null;
    const hours = this.f['estimatedHours'].value as number | null;
    if (rate && hours) {
      return `$${(rate * hours).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    return '';
  }
 
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}
 
  ngOnInit(): void    { this.buildForm(); }
  ngOnDestroy(): void { this.sub.unsubscribe(); }
 
  ngOnChanges(changes: SimpleChange): void {
    // pageIndex/pageSize changes propagate automatically via getter
  }
 
  // ── Form Builder ──────────────────────────────────────────────────────────
  private buildForm(): void {
    this.scopeForm = this.fb.group(
      {
        parentScope:               [null],
        scopeName:                 ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
        scopeType:                 [null, Validators.required],
        linkedDepartments:         [[], Validators.required],
        auditFrequency:            [null, Validators.required],
        modeOfAudit:               [null, Validators.required],
        objective:                 ['', Validators.maxLength(500)],
        startDate:                 [null, Validators.required],
        endDate:                   [null, Validators.required],
        assignedAuditors:          [[], Validators.required],
        hourlyRate:                [null],
        estimatedHours:            [null, Validators.min(1)],
        samplingMethodology:       [null, Validators.required],
        samplingSize:              [null, [Validators.required, Validators.min(1)]],
        justificationForSampling:  [''],
        riskReferenceId:           [''],
        riskRating:                [null],
        completionNote:            [''],
        status:                    ['Planning'],
      },
      { validators: endAfterStartValidator },
    );
 
    this.sub.add(
      this.f['samplingMethodology'].valueChanges.subscribe(val => {
        const ctrl = this.f['justificationForSampling'];
        if (val === 'judgmental') {
          ctrl.setValidators([Validators.required, Validators.minLength(10)]);
        } else {
          ctrl.clearValidators();
          ctrl.setValue('');
        }
        ctrl.updateValueAndValidity();
      }),
    );
  }
 
  // ── Validation helpers ────────────────────────────────────────────────────
  isFieldInvalid(field: string): boolean {
    const ctrl = this.f[field];
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }
 
  getErrorMessage(field: string): string {
    const ctrl = this.f[field];
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])  return `${this.fieldLabel(field)} is required.`;
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters required.`;
    if (ctrl.errors['maxlength']) return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters allowed.`;
    if (ctrl.errors['min'])       return `Value must be at least ${ctrl.errors['min'].min}.`;
    return 'Invalid value.';
  }
 
  private fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      scopeName:               'Scope Name',
      scopeType:               'Scope Type',
      linkedDepartments:       'Linked Department(s)',
      auditFrequency:          'Audit Frequency',
      modeOfAudit:             'Mode of Audit',
      startDate:               'Start Date',
      endDate:                 'End Date',
      assignedAuditors:        'Assigned Auditor(s)',
      estimatedHours:          'Estimated Hours',
      samplingMethodology:     'Methodology',
      samplingSize:            'Sampling Size',
      justificationForSampling:'Justification',
    };
    return labels[field] ?? field;
  }
 
  // ── Display helpers ───────────────────────────────────────────────────────
  getDeptLabel(value: string): string {
    return this.departmentOptions.find(o => o.value === value)?.label ?? value;
  }
 
  getAuditorLabel(value: string): string {
    return this.auditorOptions.find(o => o.value === value)?.label ?? value;
  }
 
  getAuditorInitials(value: string): string {
    const name = this.getAuditorLabel(value);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
 
  getScopeTypeLabel(value: string): string {
    return this.scopeTypeOptions.find(o => o.value === value)?.label ?? value;
  }

  // ── Auditor dialog ────────────────────────────────────────────────────────
  openAuditorDialog(scope: AuditScope): void {
    this.auditorDialogName    = scope.scopeName;
    this.auditorDialogList    = scope.assignedAuditors;
    this.auditorDialogVisible = true;
  }
 
  // ── Evidence helpers ──────────────────────────────────────────────────────
  onEvidenceSelect(event: { files: File[] }): void {
    this.evidenceFiles = [...this.evidenceFiles, ...event.files];
  }
 
  removeEvidence(index: number): void {
    this.evidenceFiles.splice(index, 1);
  }
 
  formatFileSize(bytes: number): string {
    if (bytes < 1024)          return `${bytes} B`;
    if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
 
  // ── Drawer: View ─────────────────────────────────────────────────────────
  openViewDrawer(scope: AuditScope): void {
    this.drawerMode    = 'view';
    this.editingId     = scope.id;
    this.evidenceFiles = [];
    this.patchForm(scope);
    this.scopeForm.disable();
    this.drawerVisible = true;
  }
 
  // ── Drawer: Edit ─────────────────────────────────────────────────────────
  openEditDrawer(scope: AuditScope): void {
    this.drawerMode    = 'edit';
    this.editingId     = scope.id;
    this.evidenceFiles = [];
    this.patchForm(scope);
    this.scopeForm.enable();
    this.drawerVisible = true;
  }
 
  switchToEdit(): void {
    this.drawerMode = 'edit';
    this.scopeForm.enable();
  }
 
  private patchForm(scope: AuditScope): void {
    this.scopeForm.patchValue({
      parentScope:               scope.parentScope,
      scopeName:                 scope.scopeName,
      scopeType:                 scope.scopeType,
      linkedDepartments:         scope.linkedDepartments,
      auditFrequency:            scope.auditFrequency,
      modeOfAudit:               scope.modeOfAudit,
      objective:                 scope.objective,
      startDate:                 scope.startDate,
      endDate:                   scope.endDate,
      assignedAuditors:          scope.assignedAuditors,
      hourlyRate:                scope.hourlyRate,
      estimatedHours:            scope.estimatedHours,
      samplingMethodology:       scope.samplingMethodology,
      samplingSize:              scope.samplingSize,
      justificationForSampling:  scope.justificationForSampling,
      riskReferenceId:           scope.riskReferenceId,
      riskRating:                scope.riskRating,
      completionNote:            scope.completionNote,
      status:                    scope.status,
    });
  }
 
  // ── Drawer: Close ─────────────────────────────────────────────────────────
  onDrawerClose(): void {
    this.drawerVisible = false;
    this.scopeForm.reset();
    this.evidenceFiles = [];
    this.editingId     = null;
  }
 
  // ── Save (Edit only) ──────────────────────────────────────────────────────
  onSubmit(): void {
    this.scopeForm.markAllAsTouched();
 
    if (this.scopeForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }
 
    const raw = this.scopeForm.getRawValue();
    this.scopes = this.scopes.map(s =>
      s.id === this.editingId ? { ...s, ...raw } : s,
    );
 
    this.messageService.add({
      severity: 'success',
      summary: 'Scope Updated',
      detail: `"${raw.scopeName}" has been updated successfully.`,
    });
 
    this.onDrawerClose();
  }
 
  // ── Delete ────────────────────────────────────────────────────────────────
  confirmDelete(scope: AuditScope): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove <strong>${scope.scopeName}</strong>?`,
      header: 'Remove Scope',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.scopes = this.scopes.filter(s => s.id !== scope.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Removed',
          detail: `"${scope.scopeName}" has been removed.`,
        });
      },
    });
  }
}
