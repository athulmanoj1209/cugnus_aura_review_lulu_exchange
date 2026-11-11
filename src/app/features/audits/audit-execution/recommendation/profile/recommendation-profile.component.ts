import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { Recommendation, RecommendationPriority, RecommendationStatus } from '../list/recommendation-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { MS_PER_DAY, isRecommendationOverdue } from '../constants/recommendation.constants';
import {
  RECOMMENDATION_DUE_STAT_CLASSES,
  RECOMMENDATION_PRIORITY_LABELS,
  RECOMMENDATION_STATUS_LABELS,
} from '../constants/recommendation-labels.constants';
import { RECOMMENDATION_DUE_LABELS, daysLabel, overdueByLabel } from '../constants/recommendation-messages.constants';

export interface RecommendationDetailDrawerData { recommendation: Recommendation; }

@Component({
  selector: 'app-recommendation-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, DrawIconComponent],
  templateUrl: './recommendation-profile.component.html',
  styleUrl: './recommendation-profile.component.scss',
})
export class RecommendationProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  readonly rec = (inject(DRAWER_DATA, { optional: true }) as RecommendationDetailDrawerData).recommendation;

  /* ── Template constants ── */
  readonly dueLabels      = RECOMMENDATION_DUE_LABELS;
  readonly dueStatClasses = RECOMMENDATION_DUE_STAT_CLASSES;
  readonly daysLabel      = daysLabel;
  readonly overdueByLabel = overdueByLabel;

  onClose() { this.drawerRef.close(null); }

  assignedToLabel(name: string): string {
    return $localize`:@@audit.recommendations.assignedToName:Assigned to ${name}:name:`;
  }

  duePeriodLabel(): string {
    return this.isOverdue
      ? $localize`:@@audit.recommendations.overdueByDaysShort:Overdue by ${-this.daysUntilDue}:count:d`
      : $localize`:@@audit.recommendations.daysRemainingShort:${this.daysUntilDue}:count:d`;
  }

  get dueStatusLabel(): string {
    return this.isOverdue
      ? $localize`:@@audit.recommendations.pastDue:Past Due`
      : $localize`:@@audit.recommendations.daysRemaining:Days Remaining`;
  }

  overdueMessage(): string {
    const days = -this.daysUntilDue;

    return days === 1
      ? $localize`:@@audit.recommendations.overdueOneDay:This recommendation is overdue by ${days}:count: day.`
      : $localize`:@@audit.recommendations.overdueDays:This recommendation is overdue by ${days}:count: days.`;
  }

  remainingValueLabel(): string {
    return this.isOverdue
      ? $localize`:@@audit.recommendations.overdue:Overdue`
      : $localize`:@@audit.recommendations.daysShort:${this.daysUntilDue}:count:d`;
  }

  priorityLabel(p: RecommendationPriority): string {
    const labels: Record<RecommendationPriority, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };

    return labels[p];
  }

  statusLabel(s: RecommendationStatus): string {
    const labels: Record<RecommendationStatus, string> = {
      open: $localize`:@@common.open:Open`,
      'in-progress': $localize`:@@common.inProgress:In Progress`,
      implemented: $localize`:@@audit.recommendations.statusImplemented:Implemented`,
      verified: $localize`:@@audit.recommendations.statusVerified:Verified`,
      closed: $localize`:@@common.closed:Closed`,
    };

    return labels[s];
  }

  get isOverdue(): boolean {
    return isRecommendationOverdue(this.rec);
  }

  get daysUntilDue(): number {
    return Math.ceil((this.rec.dueDate.getTime() - Date.now()) / MS_PER_DAY);
  }
}