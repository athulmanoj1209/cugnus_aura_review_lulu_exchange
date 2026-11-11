import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { AuditScope } from '@/app/shared/components/scope-audit-plan/scope-audit-plan.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

function endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end   = group.get('endDate')?.value;
  if (start && end && new Date(end) <= new Date(start)) {
    return { endBeforeStart: true };
  }
  return null;
}

@Component({
  selector: 'app-scheduled-scope-lists',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DrawerModule,
    DialogModule,
    TooltipModule,
    MultiSelectModule,
    DatePickerModule,
    InputNumberModule,
    FileUploadModule,
    TextareaModule,
  
    DrawIconComponent,],
  providers: [MessageService],
  templateUrl: './scheduled-scope-lists.html',
  styleUrl: './scheduled-scope-lists.scss',
})
export class ScheduledScopeLists implements OnInit, OnDestroy {

  // ── Drawer state ──────────────────────────────────────────────────────────
  drawerVisible   = false;
  selectedScope: AuditScope | null = null;
  scopeForm!: FormGroup;
  evidenceFiles:  File[] = [];

  // ── Auditor dialog state ──────────────────────────────────────────────────
  auditorDialogVisible = false;
  auditorDialogName    = '';
  auditorDialogList:   string[] = [];

  private sub = new Subscription();

  // ── Static data ───────────────────────────────────────────────────────────
  scopes: AuditScope[] = [
    {
      id: 'SC-S001',
      parentScope: null,
      scopeName: 'Financial Controls Review Q1',
      scopeType: 'departmental',
      linkedDepartments: ['finance'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Full',
      objective: 'Comprehensive review of financial controls, reporting processes, and internal audit procedures to ensure accuracy and compliance.',
      startDate: new Date('2026-01-05'),
      endDate:   new Date('2026-02-28'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3', 'auditor-4'],
      hourlyRate: 100,
      estimatedHours: 120,
      samplingMethodology: 'risk-based',
      samplingSize: 50,
      justificationForSampling: '',
      riskReferenceId: 'RR-001',
      riskRating: 'high',
      completionNote: '',
      status: 'Active',
    },
    {
      id: 'SC-S002',
      parentScope: null,
      scopeName: 'IT Security Assessment',
      scopeType: 'functional',
      linkedDepartments: ['it'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Thematic',
      objective: 'Evaluation of IT security controls, vulnerability management, and data protection measures across all systems.',
      startDate: new Date('2026-01-20'),
      endDate:   new Date('2026-03-15'),
      assignedAuditors: ['auditor-2', 'auditor-3', 'auditor-4'],
      hourlyRate: 150,
      estimatedHours: 80,
      samplingMethodology: 'risk-based',
      samplingSize: 30,
      justificationForSampling: '',
      riskReferenceId: 'RR-002',
      riskRating: 'high',
      completionNote: '',
      status: 'Active',
    },
    {
      id: 'SC-S003',
      parentScope: null,
      scopeName: 'Procurement Process Audit',
      scopeType: 'departmental',
      linkedDepartments: ['operations'],
      auditFrequency: 'quarterly',
      modeOfAudit: 'Issue',
      objective: 'Review of procurement policies, vendor selection, contract management, and spend compliance.',
      startDate: new Date('2026-03-01'),
      endDate:   new Date('2026-04-15'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3'],
      hourlyRate: 75,
      estimatedHours: 90,
      samplingMethodology: 'random',
      samplingSize: 40,
      justificationForSampling: '',
      riskReferenceId: 'RR-003',
      riskRating: 'medium',
      completionNote: '',
      status: 'Planning',
    },
    {
      id: 'SC-S004',
      parentScope: null,
      scopeName: 'Compliance Review Session',
      scopeType: 'functional',
      linkedDepartments: ['compliance', 'legal'],
      auditFrequency: 'semi-annual',
      modeOfAudit: 'Limited',
      objective: 'Assessment of regulatory compliance adherence and effectiveness of the policy governance framework.',
      startDate: new Date('2026-03-15'),
      endDate:   new Date('2026-04-30'),
      assignedAuditors: ['auditor-1', 'auditor-3', 'auditor-4'],
      hourlyRate: 100,
      estimatedHours: 60,
      samplingMethodology: 'judgmental',
      samplingSize: 25,
      justificationForSampling: 'Targeting highest-risk compliance areas for focused review based on prior findings.',
      riskReferenceId: 'RR-004',
      riskRating: 'high',
      completionNote: '',
      status: 'Planning',
    },
    {
      id: 'SC-S005',
      parentScope: null,
      scopeName: 'HR Policy & Procedures Review',
      scopeType: 'independent',
      linkedDepartments: ['hr'],
      auditFrequency: 'semi-annual',
      modeOfAudit: 'Full',
      objective: 'Review of HR policies, employee data privacy controls, onboarding procedures, and compliance with labour regulations.',
      startDate: new Date('2026-04-01'),
      endDate:   new Date('2026-05-20'),
      assignedAuditors: ['auditor-2', 'auditor-4'],
      hourlyRate: 75,
      estimatedHours: 50,
      samplingMethodology: 'random',
      samplingSize: 20,
      justificationForSampling: '',
      riskReferenceId: 'RR-005',
      riskRating: 'medium',
      completionNote: '',
      status: 'Planning',
    },
    {
      id: 'SC-S006',
      parentScope: null,
      scopeName: 'Operations Efficiency Audit',
      scopeType: 'departmental',
      linkedDepartments: ['operations', 'finance'],
      auditFrequency: 'annually',
      modeOfAudit: 'Thematic',
      objective: 'Assessment of operational processes, resource utilisation, cost management efficiency, and cross-department alignment.',
      startDate: new Date('2026-04-20'),
      endDate:   new Date('2026-06-10'),
      assignedAuditors: ['auditor-1', 'auditor-2', 'auditor-3', 'auditor-4'],
      hourlyRate: 100,
      estimatedHours: 150,
      samplingMethodology: 'risk-based',
      samplingSize: 60,
      justificationForSampling: '',
      riskReferenceId: 'RR-006',
      riskRating: 'low',
      completionNote: '',
      status: 'Planning',
    },
  ];

  /** Scopes sorted ascending by startDate (earliest first) */
  get sortedScopes(): AuditScope[] {
    return [...this.scopes].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  // ── Option arrays (mirrors scope-audit-plan) ──────────────────────────────
  departmentOptions = [
    { label: 'Finance',    value: 'finance'    },
    { label: 'IT',         value: 'it'         },
    { label: 'HR',         value: 'hr'         },
    { label: 'Operations', value: 'operations' },
    { label: 'Legal',      value: 'legal'      },
    { label: 'Compliance', value: 'compliance' },
  ];

  scopeTypeOptions = [
    { label: 'Departmental', value: 'departmental' },
    { label: 'Functional',   value: 'functional'   },
    { label: 'Independent',  value: 'independent'  },
  ];

  auditFrequencyOptions = [
    { label: 'Monthly',     value: 'monthly'     },
    { label: 'Quarterly',   value: 'quarterly'   },
    { label: 'Semi-Annual', value: 'semi-annual' },
    { label: 'Annually',    value: 'annually'    },
  ];

  modeOfAuditOptions = [
    { label: 'Full',     value: 'Full'     },
    { label: 'Limited',  value: 'Limited'  },
    { label: 'Thematic', value: 'Thematic' },
    { label: 'Issue',    value: 'Issue'    },
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
    { label: 'Random',     value: 'random'     },
    { label: 'Risk-based', value: 'risk-based' },
    { label: 'Judgmental', value: 'judgmental' },
  ];

  riskRatingOptions = [
    { label: 'Low',    value: 'low'    },
    { label: 'Medium', value: 'medium' },
    { label: 'High',   value: 'high'   },
  ];

  statusOptions = [
    { label: 'Planning',  value: 'Planning'  },
    { label: 'Active',    value: 'Active'    },
    { label: 'On Hold',   value: 'On Hold'   },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  get availableScopeOptions() {
    return this.scopes.map(s => ({ label: `${s.id} – ${s.scopeName}`, value: s.id }));
  }

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
  ) {}

  ngOnInit(): void    { this.buildForm(); }
  ngOnDestroy(): void { this.sub.unsubscribe(); }

  // ── Form builder ──────────────────────────────────────────────────────────
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

  getDurationDays(scope: AuditScope): number {
    return Math.ceil((scope.endDate.getTime() - scope.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  getScopeIcon(scopeType: string): string {
    const map: Record<string, string> = {
      departmental: 'pi-building',
      functional:   'pi-briefcase',
      independent:  'pi-chart-pie',
    };
    return map[scopeType] ?? 'pi-circle';
  }

  // ── Auditor dialog ────────────────────────────────────────────────────────
  openAuditorDialog(scope: AuditScope): void {
    this.auditorDialogName    = scope.scopeName;
    this.auditorDialogList    = scope.assignedAuditors;
    this.auditorDialogVisible = true;
  }

  // ── View drawer ───────────────────────────────────────────────────────────
  openViewDrawer(scope: AuditScope): void {
    this.selectedScope = scope;
    this.evidenceFiles = [];
    this.patchForm(scope);
    this.scopeForm.disable();
    this.drawerVisible = true;
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

  onDrawerClose(): void {
    this.drawerVisible = false;
    this.scopeForm.reset();
    this.evidenceFiles  = [];
    this.selectedScope  = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024)          return `${bytes} B`;
    if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  exportPdf(): void {
    this.messageService.add({ severity: 'info', summary: 'Export', detail: 'PDF export coming soon.' });
  }

  exportExcel(): void {
    this.messageService.add({ severity: 'info', summary: 'Export', detail: 'Excel export coming soon.' });
  }
}
