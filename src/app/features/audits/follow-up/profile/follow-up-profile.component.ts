import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DRAWER_DATA, DrawerRef } from '../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { AuditFollowupPlan, FindingSeverity, PlanStatus } from '@/app/features/audits/audit-execution/findings/services/audit-finding.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

export interface FollowupDetailDrawerData {
  plan: AuditFollowupPlan;
}

@Component({
  selector: 'app-followup-detail',
  imports: [CommonModule, ButtonModule, TagModule, TooltipModule, DrawIconComponent],
  templateUrl: './follow-up-profile.component.html',
  styleUrl: './follow-up-profile.component.scss',
})
export class FollowupDetailComponent {
  private readonly drawerRef  = inject(DrawerRef);
  readonly plan = (inject(DRAWER_DATA, { optional: true }) as FollowupDetailDrawerData).plan;

  onClose(): void {
    this.drawerRef.close(null);
  }

  severityLabel(s: FindingSeverity): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  statusLabel(s: PlanStatus): string {
    switch (s) {
      case 'in-progress': return 'In Progress';
      case 'on-hold':     return 'On Hold';
      default:            return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  /** Returns number of days between start and end date */
  get durationDays(): number {
    const ms = this.plan.endDate.getTime() - this.plan.startDate.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  /** Days remaining until end date (negative = overdue) */
  get daysRemaining(): number {
    const ms = this.plan.endDate.getTime() - Date.now();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  get isOverdue(): boolean {
    return this.daysRemaining < 0 && this.plan.status !== 'completed';
  }

  /** Progress percentage based on elapsed time between start and end */
  get timeProgress(): number {
    const total   = this.plan.endDate.getTime() - this.plan.startDate.getTime();
    const elapsed = Date.now() - this.plan.startDate.getTime();
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }
}