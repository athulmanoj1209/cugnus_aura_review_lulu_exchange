import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuditPlanStore, CalendarChipVM, CalendarDayVM } from '../audit-plan.store';
import { FREQ_COLOR, FREQ_LABELS, MONTHS, STATUS_META } from '../../models/audit-plan.model';
import { ScopeJobDrawerService } from '../../../scope-job/services/scope-job.service';
import { CALENDAR_MAX_CHIPS, PlanViews } from '../../constants/audit-plan.constants';
import { DAY_OF_WEEK_LABELS, STATUS_MARK_FALLBACK } from '../../constants/audit-plan-labels.constants';
import {
  CALENDAR_SHOW_LESS,
  calendarMoreLabel,
  runBadgeLabel,
  runLongLabel,
} from '../../constants/audit-plan-messages.constants';

@Component({
  selector: 'ap-month-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TooltipModule],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent {
  readonly store = inject(AuditPlanStore);
  readonly months = MONTHS;
  readonly dow = DAY_OF_WEEK_LABELS;
  readonly meta = STATUS_META;
  readonly freqColor = FREQ_COLOR;
  readonly freqLabels = FREQ_LABELS;
  readonly PlanViews = PlanViews;
  readonly markFallback = STATUS_MARK_FALLBACK;
  readonly showLessLabel = CALENDAR_SHOW_LESS;
  readonly moreLabel = calendarMoreLabel;
  readonly runBadgeLabel = runBadgeLabel;

  /* ---- day overflow handling ---- */
  readonly maxChips = CALENDAR_MAX_CHIPS;
  readonly expandedDays = signal<ReadonlySet<number>>(new Set());

  visibleChips(cell: CalendarDayVM): CalendarChipVM[] {
    if (cell.day === null) return [];
    return this.expandedDays().has(cell.day) ? cell.chips : cell.chips.slice(0, this.maxChips);
  }

  toggleDay(day: number): void {
    this.expandedDays.update(set => {
      const next = new Set(set);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  shift(delta: number): void {
    this.store.shiftMonth(delta);
    this.expandedDays.set(new Set()); // collapse when the month changes
  }

  /** hover: sub-division · scope · status (plus run & frequency context) */
  tooltipOf(chip: CalendarChipVM): string {
    const run = chip.run !== null
      ? ` · ${runLongLabel(chip.scope.freq)} ${chip.run}/${chip.totalRuns}` : '';
    return `${chip.subDivisionName} · ${chip.scope.name} (${chip.scope.code})`
      + ` · ${STATUS_META[chip.status].label}${run} · ${FREQ_LABELS[chip.scope.freq]}`;
  }

  private readonly jobDrawer = inject(ScopeJobDrawerService);

  /** click: open the scope-job profile drawer for this job */
  openChip(chip: CalendarChipVM): void {
    this.jobDrawer.openFromPlan({
      deptName: chip.subDivisionName,
      scope: chip.scope,
      job: chip.job,
      monthIndex: this.store.currentMonth(),
      year: this.store.year(),
      status: chip.status,
      run: chip.run ?? undefined,
    });
  }
}