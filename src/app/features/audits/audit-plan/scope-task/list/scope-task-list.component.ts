import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Popover, PopoverModule } from 'primeng/popover';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { ScopeTaskProfileComponent } from '../profile/scope-task-profile.component';
import { AUDITOR_REGISTRY, MOCK_SCOPE_JOBS } from '../../scope-job/list/scope-job-list.component';
import { generateTasksForJob } from '../../scope-job/profile/scope-job-profile.component';
import { SCOPE_JOB_CONTROL_RATING_LABELS, SCOPE_TASK_DASHBOARD_STATUS_LABELS, SCOPE_TASK_PRIORITY_LABELS, SCOPE_TASK_STATUS_ICONS } from '../constants/scope-task-labels.constants';
import { SCOPE_TASK_LIST_PAGE_SIZE, SCOPE_TASK_PAGE_SIZE_OPTIONS } from '../constants/scope-task.constants';
import type { ChecklistItemStatus, ScopeTask, TaskSortKey } from '../models/scope-task.model';

export interface TeamAuditWorkload {
    auditId: string;
    auditName: string;
    assignedTeamMembers: number;
    teamScopeCount: number;
    teamTaskCount: number;
    completedTaskCount: number;
    completionPercentage: number;
}

export interface TeamTaskAgeBucket {
    label: string;
    minDays: number;
    maxDays: number | null;
    taskCount: number;
}

export function getAllScopeTasks() {
    return MOCK_SCOPE_JOBS.flatMap(job => generateTasksForJob(job).map(task => ({
        ...task,
        startDate: task.startDate ?? task.dueDate,
        endDate: task.endDate ?? task.dueDate,
        checklistItems: task.checklistItems ?? [],
        checklistStatuses: task.checklistStatuses ?? [],
        controlRating: task.controlRating ?? 'moderate',
        tags: task.tags ?? [],
        company: job.company,
        division: job.division,
        subDivision: job.subDivision,
        scopeId: job.scopeId,
        scopeName: job.scopeName,
        scopeJobId: job.id,
        scopeJobTitle: job.title,
    })));
}

export function countTasksForAuditor(auditorId: string, bucket: string): number {
    const tasks = getAllScopeTasks().filter(task => task.assignedTo === auditorId);

    if (bucket === 'due-today') {
        const today = new Date();
        return tasks.filter(task =>
            task.status !== 'completed' &&
            task.dueDate.getFullYear() === today.getFullYear() &&
            task.dueDate.getMonth() === today.getMonth() &&
            task.dueDate.getDate() === today.getDate()
        ).length;
    }

    return tasks.filter(task => task.status === bucket).length;
}

export function countTasksForTeam(auditorIds: readonly string[], bucket: string): number {
    const team = new Set(auditorIds);
    const tasks = getAllScopeTasks();
    const today = new Date();
    return new Set(tasks.filter(task => {
        const matchesBucket = bucket === 'due-today'
            ? task.status !== 'completed' && task.dueDate.getFullYear() === today.getFullYear() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getDate() === today.getDate()
            : task.status === bucket;
        return team.has(task.assignedTo) && matchesBucket;
    }).map(task => task.id)).size;
}

export function getTeamTaskStatusCounts(auditorIds: readonly string[]) {
    const team = new Set(auditorIds);
    const tasks = getAllScopeTasks().filter(task => team.has(task.assignedTo));
    const today = new Date();
    const dueToday = (task: typeof tasks[number]) => task.status !== 'completed' && task.dueDate.getFullYear() === today.getFullYear() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getDate() === today.getDate();

    return {
        open: tasks.filter(task => task.status === 'open').length,
        inProgress: tasks.filter(task => task.status === 'in_progress').length,
        completed: tasks.filter(task => task.status === 'completed').length,
        overdue: tasks.filter(task => task.status === 'overdue').length,
        dueToday: tasks.filter(dueToday).length,
    };
}

export function getTeamAuditWorkload(auditorIds: readonly string[]): TeamAuditWorkload[] {
    const team = new Set(auditorIds);
    const tasks = getAllScopeTasks().filter(task => team.has(task.assignedTo));
    const grouped = new Map<string, typeof tasks>();

    for (const task of tasks) {
        const auditTasks = grouped.get(task.scopeJobId) ?? [];
        auditTasks.push(task);
        grouped.set(task.scopeJobId, auditTasks);
    }

    return [...grouped.entries()]
        .map(([auditId, auditTasks]) => {
            const completedTaskCount = auditTasks.filter(task => task.status === 'completed').length;
            return {
                auditId,
                auditName: auditTasks[0]?.scopeJobTitle ?? auditId,
                assignedTeamMembers: new Set(auditTasks.map(task => task.assignedTo)).size,
                teamScopeCount: new Set(auditTasks.map(task => task.scopeId)).size,
                teamTaskCount: auditTasks.length,
                completedTaskCount,
                completionPercentage: auditTasks.length ? Math.round(completedTaskCount / auditTasks.length * 100) : 0,
            };
        })
        .sort((a, b) => b.teamTaskCount - a.teamTaskCount);
}

export function getTeamTaskAging(auditorIds: readonly string[], today = new Date()): TeamTaskAgeBucket[] {
    const team = new Set(auditorIds);
    const dayMs = 24 * 60 * 60 * 1000;
    const buckets: TeamTaskAgeBucket[] = [
        { label: '0–7 days', minDays: 0, maxDays: 7, taskCount: 0 },
        { label: '8–14 days', minDays: 8, maxDays: 14, taskCount: 0 },
        { label: '15–30 days', minDays: 15, maxDays: 30, taskCount: 0 },
        { label: 'More than 30 days', minDays: 31, maxDays: null, taskCount: 0 },
    ];

    getAllScopeTasks()
        .filter(task => team.has(task.assignedTo) && task.status !== 'completed')
        .forEach(task => {
            const ageStart = task.startDate ?? task.dueDate;
            const ageInDays = Math.max(0, Math.floor((today.getTime() - ageStart.getTime()) / dayMs));
            const bucket = buckets.find(item => ageInDays >= item.minDays && (item.maxDays === null || ageInDays <= item.maxDays));
            if (bucket) bucket.taskCount += 1;
        });

    return buckets;
}


@Component({
    selector: 'app-scope-task-list',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, InputTextModule, MultiSelectModule, PopoverModule, DialogModule, PanelModule, DividerModule, ChipModule, TagModule, TooltipModule, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
    templateUrl: './scope-task-list.component.html',
    styleUrl: './scope-task-list.component.scss'
})
export class ScopeTaskListComponent {
    @ViewChild('filterPanel') filterPanel!: Popover;
    private readonly drawer = inject(RightDrawerService);
    private readonly route = inject(ActivatedRoute);
    readonly tasks = getAllScopeTasks();
    readonly searchQuery = signal('');
    readonly selectedCompanies = signal<string[]>([]);
    readonly selectedDivisions = signal<string[]>([]);
    readonly selectedSubDivisions = signal<string[]>([]);
    readonly selectedScopes = signal<string[]>([]);
    readonly selectedScopeJobs = signal<string[]>([]);
    readonly selectedTaskStatuses = signal<string[]>([]);
    readonly selectedAuditor = signal<string | null>(null);
    readonly selectedAuditors = signal<string[]>([]);
    readonly taskStatusFilterOptions = [
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Due Today', value: 'due-today' },
    ];
    readonly companyFilterOptions = computed(() => this.optionsFromJobs('company'));
    readonly divisionFilterOptions = computed(() => this.optionsFromJobs('division', this.matchingJobs(this.selectedCompanies())));
    readonly subDivisionFilterOptions = computed(() => this.optionsFromJobs('subDivision', this.matchingJobs(this.selectedCompanies(), this.selectedDivisions())));
    readonly scopeFilterOptions = computed(() => { const jobs = this.matchingJobs(this.selectedCompanies(), this.selectedDivisions(), this.selectedSubDivisions()); return [...new Map(jobs.map(job => [job.scopeId, job.scopeName])).entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ label: `${value} — ${label}`, value })); });
    readonly scopeJobFilterOptions = computed(() => { const selectedScopes = this.selectedScopes(); return this.matchingJobs(this.selectedCompanies(), this.selectedDivisions(), this.selectedSubDivisions()).filter(job => !selectedScopes.length || selectedScopes.includes(job.scopeId)).map(job => ({ label: `${job.id} — ${job.title}`, value: job.id })).sort((a, b) => a.label.localeCompare(b.label)); });
    readonly activeFilterCount = computed(() => [this.selectedCompanies(), this.selectedDivisions(), this.selectedSubDivisions(), this.selectedScopes(), this.selectedScopeJobs(), this.selectedTaskStatuses()].filter(v => v.length).length);
    readonly hasActiveFilters = computed(() => !!this.searchQuery().trim() || this.activeFilterCount() > 0);
    readonly activeFilterChips = computed(() => {
        const filters: Array<[string, string[]]> = [
            ['Company', this.selectedCompanies()], ['Division', this.selectedDivisions()], ['Sub-Division', this.selectedSubDivisions()], ['Scope', this.selectedScopes()], ['Scope Job', this.selectedScopeJobs()], ['Task Status', this.selectedTaskStatuses()],
        ];
        return filters.filter(([, values]) => values.length).map(([label, values]) => ({ label: `${label}: ${values.length}`, key: label }));
    });
    readonly filteredTasks = computed(() => {
        const q = this.searchQuery().trim().toLowerCase();
        const companies = this.selectedCompanies(), divisions = this.selectedDivisions(), subDivisions = this.selectedSubDivisions(), scopes = this.selectedScopes(), jobs = this.selectedScopeJobs(), statuses = this.selectedTaskStatuses(), auditor = this.selectedAuditor(), auditors = this.selectedAuditors();
        return this.tasks.filter(task =>
            (!q || [task.id, task.title, task.company, task.division, task.subDivision ?? '', task.scopeName, task.scopeJobTitle].some(v => v.toLowerCase().includes(q))) &&
            ((!auditor && !auditors.length) || (auditor ? task.assignedTo === auditor : auditors.includes(task.assignedTo))) &&
            (!companies.length || companies.includes(task.company)) &&
            (!divisions.length || divisions.includes(task.division)) &&
            (!subDivisions.length || (task.subDivision !== null && subDivisions.includes(task.subDivision))) &&
            (!scopes.length || scopes.includes(task.scopeId)) &&
            (!jobs.length || jobs.includes(task.scopeJobId)) &&
            (!statuses.length || statuses.some(status => status === 'due-today' ? this.isDueToday(task) : task.status === status)),
        );
    });
    readonly filteredSortedTasks = computed(() => this.sortTasks(this.filteredTasks()));
    readonly pageSize = signal(SCOPE_TASK_LIST_PAGE_SIZE);
    readonly currentPage = signal(1);
    readonly pageSizeOptions = SCOPE_TASK_PAGE_SIZE_OPTIONS;
    readonly paginatedTasks = computed(() => {
        const tasks = this.filteredSortedTasks();
        const size = this.pageSize();
        const page = Math.min(this.currentPage(), Math.max(1, Math.ceil(tasks.length / size)));
        return tasks.slice((page - 1) * size, page * size);
    });
    readonly statusLabels = SCOPE_TASK_DASHBOARD_STATUS_LABELS;
    readonly statusIcons = SCOPE_TASK_STATUS_ICONS;
    readonly checklistStatusLabels: Record<ChecklistItemStatus, string> = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', failed: 'Failed', not_applicable: 'Not Applicable' };
    readonly checklistStatusIcons: Record<ChecklistItemStatus, string> = { pending: 'pi pi-circle', in_progress: 'pi pi-spin pi-spinner', completed: 'pi pi-check-circle', failed: 'pi pi-times-circle', not_applicable: 'pi pi-minus-circle' };
    readonly priorityLabels = SCOPE_TASK_PRIORITY_LABELS;
    readonly controlRatingLabels = SCOPE_JOB_CONTROL_RATING_LABELS;
    selectedTask: ScopeTask | null = null;
    checklistVisible = false;
    selectedTags: string[] = [];
    tagsVisible = false;
    readonly sortKey = signal<TaskSortKey>('id');
    readonly sortDirection = signal<'asc' | 'desc'>('asc');

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.selectedAuditor.set(params.get('auditorId'));
            this.selectedAuditors.set((params.get('teamAuditorIds') ?? '').split(',').filter(Boolean));
            const status = params.get('status');
            this.selectedTaskStatuses.set(status ? status.split(',').filter(Boolean) : []);
            this.currentPage.set(1);
        });
    }

    get sortedTasks() {
        return this.sortTasks(this.tasks);
    }

    private sortTasks(tasks: typeof this.tasks) { return [...tasks].sort((a, b) => {
        const left = this.sortValue(a, this.sortKey()), right = this.sortValue(b, this.sortKey());
        const result = left < right ? -1 : left > right ? 1 : 0;
        return this.sortDirection() === 'asc' ? result : -result;
    }); }

    private optionsFor(field: string, valueField = field) {
        const values = new Map<string, string>();
        this.tasks.forEach((task: any) => { const value = task[field]; if (value) values.set(String(task[valueField]), String(value)); });
        return [...values.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([value, label]) => ({ value, label }));
    }

    private isDueToday(task: typeof this.tasks[number]): boolean {
        const today = new Date();
        return task.status !== 'completed' && task.dueDate.getFullYear() === today.getFullYear() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getDate() === today.getDate();
    }

    private matchingJobs(companies: string[], divisions: string[] = [], subDivisions: string[] = []) { return MOCK_SCOPE_JOBS.filter(job => (!companies.length || companies.includes(job.company)) && (!divisions.length || divisions.includes(job.division)) && (!subDivisions.length || (job.subDivision !== null && subDivisions.includes(job.subDivision)))); }

    private optionsFromJobs(field: 'company' | 'division' | 'subDivision', jobs = MOCK_SCOPE_JOBS) {
        const values = new Set<string>();
        jobs.forEach(job => { const value = job[field]; if (value) values.add(value); });
        return [...values].sort((a, b) => a.localeCompare(b)).map(value => ({ label: value, value }));
    }

    onSearchChange(value: string): void { this.searchQuery.set(value); this.currentPage.set(1); }
    onCompaniesChange(values: string[] | null): void { this.selectedCompanies.set(values ?? []); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); this.currentPage.set(1); }
    onDivisionsChange(values: string[] | null): void { this.selectedDivisions.set(values ?? []); this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); this.currentPage.set(1); }
    onSubDivisionsChange(values: string[] | null): void { this.selectedSubDivisions.set(values ?? []); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); this.currentPage.set(1); }
    onScopesChange(values: string[] | null): void { this.selectedScopes.set(values ?? []); this.selectedScopeJobs.set([]); this.currentPage.set(1); }
    onScopeJobsChange(values: string[] | null): void { this.selectedScopeJobs.set(values ?? []); this.currentPage.set(1); }
    onTaskStatusesChange(values: string[] | null): void { this.selectedTaskStatuses.set(values ?? []); this.currentPage.set(1); }
    clearFilters(): void { this.searchQuery.set(''); this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); this.selectedTaskStatuses.set([]); this.currentPage.set(1); }
    removeFilter(key: string): void { switch (key) { case 'Company': this.selectedCompanies.set([]); this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); break; case 'Division': this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); break; case 'Sub-Division': this.selectedSubDivisions.set([]); this.selectedScopes.set([]); this.selectedScopeJobs.set([]); break; case 'Scope': this.selectedScopes.set([]); this.selectedScopeJobs.set([]); break; case 'Scope Job': this.selectedScopeJobs.set([]); break; case 'Task Status': this.selectedTaskStatuses.set([]); break; } this.currentPage.set(1); }
    onPageChange(page: number): void { this.currentPage.set(page + 1); }
    onPageSizeChange(size: number): void { this.pageSize.set(size); this.currentPage.set(1); }

    auditorName(id: string): string { return AUDITOR_REGISTRY[id]?.name ?? id; }
    showChecklist(task: ScopeTask): void { this.selectedTask = task; this.checklistVisible = true; }
    hideChecklist(): void { this.checklistVisible = false; this.selectedTask = null; }
    checklistStatus(task: ScopeTask, index: number): ChecklistItemStatus { return task.checklistStatuses?.[index] ?? (task.status === 'completed' ? 'completed' : task.status === 'in_progress' && index === 0 ? 'in_progress' : 'pending'); }
    showTags(task: ScopeTask): void { this.selectedTags = task.tags ?? []; this.tagsVisible = true; }
    showDetails(task: ScopeTask): void {
        this.drawer.open(ScopeTaskProfileComponent, {
            width: '720px',
            styleClass: 'scope-task-profile-drawer',
            data: { task },
        });
    }

    sortBy(key: TaskSortKey): void {
        if (this.sortKey() === key) {
            this.sortDirection.update(direction => direction === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortKey.set(key);
            this.sortDirection.set('asc');
        }
        this.currentPage.set(1);
    }

    sortIconFor(key: TaskSortKey): string {
        if (this.sortKey() !== key) return 'pi pi-sort-alt';
        return this.sortDirection() === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down';
    }

    private sortValue(task: any, key: TaskSortKey): string | number {
        switch (key) {
            case 'checklist': return task.checklistItems.length;
            case 'auditor': return this.auditorName(task.assignedTo).toLowerCase();
            case 'timeframe': return task.startDate.getTime();
            case 'tags': return task.tags.join(',').toLowerCase();
            case 'status': return String((this.statusLabels as any)[task.status] ?? task.status);
            case 'controlRating': return String((this.controlRatingLabels as any)[task.controlRating] ?? task.controlRating);
            case 'priority': return String((this.priorityLabels as any)[task.priority] ?? task.priority);
            case 'title': return task.title.toLowerCase();
            default: return task.id;
        }
    }
}
