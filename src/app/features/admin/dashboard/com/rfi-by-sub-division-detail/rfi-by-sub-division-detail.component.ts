import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { LayoutService } from '@/app/layout/service/layout.service';

/* Same relative path RfiDetailDrawer uses for these two tokens — adjust if
 * this component ends up in a different folder than rfi-detail-drawer. */
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { RfiBySubDivisionDetailData, RfiRow, RfiSortMode, RfiUnitPage } from '@/app/features/admin/dashboard/models/dashboard-rfi.model';

/** RFIs that sit exactly on this page's unit. */
export function rfiRowsOnPage<T extends { division?: string; subDivision: string }>(rows: T[], page: RfiUnitPage): T[] {
  return rows.filter(r => r.division === page.division && (r.subDivision || null) === page.subDivision);
}

const PRIORITY_RANK: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

/* Same 4 status colors used in the RFI Status Distribution pie chart and the
 * p-tag severities in the main table, so a status reads the same everywhere. */
const STATUS_COLORS: Record<string, string> = {
  Open: '#3b82f6',
  Overdue: '#ef4444',
  Escalated: '#f59e0b',
  Closed: '#22c55e',
};

/**
 * Full "RFIs by Division / Sub-Division" breakdown — same drill-down pattern
 * as FindingsBySubDivisionDetailComponent on the Audit Findings page: one
 * unit per page (division-level pages first, then sub-divisions — same split
 * as the overview chart's toggle), and the chart on that page breaks the unit's
 * RFIs down by ORGANIZATION (x-axis) and STATUS (grouped Open/Overdue/
 * Escalated/Closed bars), while the table below lists every individual RFI
 * with its organization attached. Drawn straight from the same `records`
 * list backing the main table, so it can never disagree with it.
 *
 * Opened from RfiTabComponent as a right-side drawer when the user clicks the
 * "RFIs by Sub-Division" chart on the main page.
 */
@Component({
  selector: 'app-rfi-by-sub-division-detail',
  standalone: true,
  imports: [CommonModule, ChartModule, TagModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rfi-by-sub-division-detail.component.html',
  styleUrls: ['./rfi-by-sub-division-detail.component.scss'],
})
export class RfiBySubDivisionDetailComponent implements AfterViewInit {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as RfiBySubDivisionDetailData;

  private readonly layoutService = inject(LayoutService);

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in a single theme's hex at load time. */
  private readonly themeColors = computed(() => {
    this.layoutService.layoutConfig().darkTheme;
    const ds = getComputedStyle(document.documentElement);
    return {
      surfaceCard: ds.getPropertyValue('--surface-card').trim() || '#ffffff',
      surfaceBorder: ds.getPropertyValue('--surface-border').trim() || '#e2e8f0',
      text: ds.getPropertyValue('--text-color').trim() || '#0f172a',
      textSecondary: ds.getPropertyValue('--text-color-secondary').trim() || '#64748b',
    };
  });

  @ViewChildren('tabBtn') private readonly tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  /** Which sub-division "page" we're on — this is the whole pagination model. */
  deptIndex = this.data.startIndex ?? 0;
  sort: RfiSortMode = 'due';
  search = '';

  readonly divisionCount = this.data.pages.filter(p => p.kind === 'division').length;
  readonly subDivisionCount = this.data.pages.length - this.divisionCount;

  get currentPage(): RfiUnitPage {
    return this.data.pages[this.deptIndex];
  }

  /** "Division" / "Sub-Division" — what the current page is. */
  get unitLabel(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@common.division:Division`
      : $localize`:@@common.subDivision:Sub-Division`;
  }

  /** Tooltip for a pager tab. */
  pageTabTitle(page: RfiUnitPage): string {
    return page.kind === 'division'
      ? $localize`:@@dashboard.rfiBySubDivision.tabTitleDivision:Division`
      : $localize`:@@dashboard.rfiBySubDivision.tabTitleSubDivisionOf:Sub-division of ${page.division}:division:`;
  }

  /** Display text for an RFI status (severity/colour lookups stay keyed on the raw value). */
  statusText(status: string): string {
    switch (status) {
      case 'Open': return $localize`:@@common.open:Open`;
      case 'Overdue': return $localize`:@@common.overdue:Overdue`;
      case 'Escalated': return $localize`:@@common.escalated:Escalated`;
      case 'Closed': return $localize`:@@common.closed:Closed`;
      default: return status;
    }
  }

  /** Display text for a priority. */
  priorityText(priority: string): string {
    switch (priority) {
      case 'High': return $localize`:@@common.high:High`;
      case 'Medium': return $localize`:@@common.medium:Medium`;
      case 'Low': return $localize`:@@common.low:Low`;
      default: return priority;
    }
  }

  get totalPages(): number {
    return this.data.pages.length;
  }

  get isFirstPage(): boolean {
    return this.deptIndex === 0;
  }

  get isLastPage(): boolean {
    return this.deptIndex === this.totalPages - 1;
  }

  private recordsInCurrentDept(): RfiRow[] {
    return rfiRowsOnPage(this.data.records, this.currentPage);
  }

  get totalInDept(): number {
    return this.recordsInCurrentDept().length;
  }

  /** Every RFI in the current sub-division, filtered + sorted. */
  get rows(): RfiRow[] {
    let list = this.recordsInCurrentDept();

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.description.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (this.sort === 'due') return a.dueDate.localeCompare(b.dueDate);
      if (this.sort === 'priority') return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (this.sort === 'company') return a.company.localeCompare(b.company) || a.dueDate.localeCompare(b.dueDate);
      return a.description.localeCompare(b.description);
    });
  }

  /** Every organization, always — even ones with zero RFIs in the current
   *  sub-division — so a sub-division like HR (where only one company happens
   *  to have RFIs today) still shows the full company roster instead of
   *  silently dropping everyone else. Kept in the canonical `data.companies`
   *  order so a company's x-axis position stays stable across pages. */
  get companiesInCurrentDept(): string[] {
    return this.data.companies;
  }

  /** Widens the chart instead of crushing bars when a sub-division has many companies. */
  get chartMinWidthPx(): number {
    return Math.max(480, this.companiesInCurrentDept.length * 70);
  }

  get showScrollHint(): boolean {
    return this.companiesInCurrentDept.length > 8;
  }

  /** Company × status counts, computed straight from `records` — kept
   *  independent of the overview chart's own numbers so this drawer's chart
   *  and table can never disagree with each other. */
  get chartData() {
    const companies = this.companiesInCurrentDept;
    const deptRecords = this.recordsInCurrentDept();
    const countFor = (company: string, status: string) =>
      deptRecords.filter(r => r.company === company && r.status === status).length;

    const barSpacing = { maxBarThickness: 56, categoryPercentage: 0.7, barPercentage: 0.8, borderRadius: 4 };

    return {
      labels: companies,
      datasets: [
        { label: this.statusText('Open'),      data: companies.map(c => countFor(c, 'Open')),      backgroundColor: STATUS_COLORS['Open'],      ...barSpacing },
        { label: this.statusText('Overdue'),   data: companies.map(c => countFor(c, 'Overdue')),   backgroundColor: STATUS_COLORS['Overdue'],   ...barSpacing },
        { label: this.statusText('Escalated'), data: companies.map(c => countFor(c, 'Escalated')), backgroundColor: STATUS_COLORS['Escalated'], ...barSpacing },
        { label: this.statusText('Closed'),    data: companies.map(c => countFor(c, 'Closed')),    backgroundColor: STATUS_COLORS['Closed'],    ...barSpacing },
      ],
    };
  }

  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, padding: 12, color: c.textSecondary },
      },
      tooltip: {
        backgroundColor: c.surfaceCard,
        titleColor: c.text,
        bodyColor: c.text,
        borderColor: c.surfaceBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (item: any) => {
            const status = item.dataset.label;
            const count = item.parsed.y;
            return count === 1
              ? $localize`:@@dashboard.rfiBySubDivision.tooltipOne:${status}:status:: 1 RFI`
              : $localize`:@@dashboard.rfiBySubDivision.tooltipMany:${status}:status:: ${count}:count: RFIs`;
          },
        },
      },
    },
    scales: {
      x: { stacked: false, grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { stacked: false, beginAtZero: true, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, precision: 0 } },
    },
    responsive: true,
    maintainAspectRatio: false,
    };
  });

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      Overdue: 'danger', Escalated: 'warn', Open: 'info', Closed: 'success',
    };
    return map[status] ?? 'secondary';
  }

  /** The drawer can open on a later page (see `startIndex`) — show its tab. */
  ngAfterViewInit(): void {
    this.scrollActiveTabIntoView();
  }

  goToDept(index: number): void {
    this.deptIndex = index;
    this.scrollActiveTabIntoView();
  }

  prevDept(): void {
    if (!this.isFirstPage) this.deptIndex -= 1;
    this.scrollActiveTabIntoView();
  }

  nextDept(): void {
    if (!this.isLastPage) this.deptIndex += 1;
    this.scrollActiveTabIntoView();
  }

  /** Brings the active tab into view when the tab strip is too narrow to show them all at once. */
  private scrollActiveTabIntoView(): void {
    this.tabButtons?.get(this.deptIndex)?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }

  setSort(mode: RfiSortMode): void {
    this.sort = mode;
  }

  onSearchChange(value: string): void {
    this.search = value;
  }

  close(): void {
    this.drawerRef.close();
  }
}
