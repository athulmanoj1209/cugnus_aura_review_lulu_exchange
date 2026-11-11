import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { AuditPlanStore } from '../audit-plan.store';
import { FREQ_LABELS, InstanceStatus, MONTHS, STATUS_META } from '../../models/audit-plan.model';
import { InstanceStatuses, PlanViews } from '../../constants/audit-plan.constants';
import { STATUS_BG_VARS, STATUS_BORDER_VARS } from '../../constants/audit-plan-labels.constants';
import { NOT_SCHEDULED_SUFFIX } from '../../constants/audit-plan-messages.constants';

@Component({
  selector: 'ap-department-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccordionModule, ProgressBarModule, TooltipModule],
  templateUrl: './department-view.component.html',
  styleUrl: './department-view.component.scss',
})
export class SubDivisionViewComponent {
  readonly store = inject(AuditPlanStore);
  readonly months = MONTHS;
  readonly meta = STATUS_META;
  readonly freqLabels = FREQ_LABELS;
  readonly PlanViews = PlanViews;
  readonly notScheduledSuffix = NOT_SCHEDULED_SUFFIX;

  /** status palette for the mini-calendar (inline styles — no specificity issues).
   *  References the st-x-bg theme tokens (declared on the audit-plan shell host)
   *  so these stay theme-reactive instead of being frozen to a fixed light palette. */
  readonly lightBg = STATUS_BG_VARS;
  readonly lightBd = STATUS_BORDER_VARS;

  /** sub-division cards enriched with per-scope status + completion % */
  readonly cards = computed(() =>
    this.store.subDivisionCards().map(card => ({
      ...card,
      rows: card.scopes.map(scope => {
        const m = scope.months.filter((x): x is InstanceStatus => x !== null);
        const total = m.length;
        const done = m.filter(x => x === InstanceStatuses.Completed).length;
        const status: InstanceStatus =
          m.includes(InstanceStatuses.Overdue) ? InstanceStatuses.Overdue
          : m.includes(InstanceStatuses.InProgress) ? InstanceStatuses.InProgress
          : total > 0 && done === total ? InstanceStatuses.Completed
          : InstanceStatuses.Planned;
        return { scope, status, pct: total ? Math.round((done / total) * 100) : 0 };
      }),
    })));
}