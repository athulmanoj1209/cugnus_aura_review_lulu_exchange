import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { SCOPE_JOB_CONTROL_RATING_LABELS, SCOPE_TASK_DASHBOARD_STATUS_LABELS, SCOPE_TASK_PRIORITY_LABELS } from '../constants/scope-task-labels.constants';
import { AUDITOR_REGISTRY } from '../../scope-job/list/scope-job-list.component';
import type { ScopeTask } from '../models/scope-task.model';

import type { ScopeTaskProfileDrawerData } from '../models/scope-task.model';

@Component({
    selector: 'app-scope-task-profile',
    standalone: true,
    imports: [CommonModule, DatePipe, ButtonModule, ChipModule, DividerModule, TagModule, DrawIconComponent],
    templateUrl: './scope-task-profile.component.html',
    styleUrl: './scope-task-profile.component.scss',
})
export class ScopeTaskProfileComponent {
    private readonly drawerRef = inject(DrawerRef);
    protected readonly data = inject(DRAWER_DATA) as ScopeTaskProfileDrawerData;
    readonly task = this.data.task;
    readonly statusLabels = SCOPE_TASK_DASHBOARD_STATUS_LABELS;
    readonly controlRatingLabels = SCOPE_JOB_CONTROL_RATING_LABELS;
    readonly priorityLabels = SCOPE_TASK_PRIORITY_LABELS;

    auditorName(id: string): string { return AUDITOR_REGISTRY[id]?.name ?? id; }
    close(): void { this.drawerRef.close(null); }
}
