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
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { LayoutService } from '@/app/layout/service/layout.service';
import { getFindingUnit } from '@/app/features/audits/audit-execution/findings/audit-finding-data';
import { FindingSortMode, FindingUnitPage, FindingsBySubdivisionDetailData, SubdivisionFindingRow } from '@/app/features/admin/dashboard/models/dashboard-finding.model';

const SEVERITY_RANK: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

/**
 * Full "Findings by Division / Sub-Division" breakdown — same drill-down pattern as
 * AuditsBySubDivisionDetailComponent on the overview page: one division or sub-division per
 * page, and the chart on that page breaks the unit's findings down by
 * COMPANY (x-axis) and STATUS (stacked Open/Overdue/Closed segments), while
 * the table below lists every individual finding with its company attached.
 * That's the three dimensions this view now covers — division / sub-division (the page),
 * company, and status — drawn straight from the same `findings` list
 * backing the main table, so it can never disagree with it.
 *
 * Opened from AuditFindingsTabComponent as a right-side drawer when the user
 * clicks the "Findings by Sub-Division" chart on the main page.
 */
@Component({
  selector: 'app-findings-by-subdivision-detail',
  standalone: true,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './findings-by-subdivision-detail.component.html',
  styleUrls: ['./findings-by-subdivision-detail.component.scss'],
})
export class FindingsBySubdivisionDetailComponent implements AfterViewInit {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as FindingsBySubdivisionDetailData;

  private readonly layoutService = inject(LayoutService);

  /** Re-reads the app's CSS theme variables whenever dark mode toggles, so
   *  Chart.js configs below (which can't consume `var(--...)` directly)
   *  stay in sync instead of baking in light-mode-only hex at load time. */
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
  subdivisionIndex = this.data.startIndex ?? 0;
  sort: FindingSortMode = 'age';
  search = '';

  /* Status colors match the main "Findings by Sub-Division" grouped chart
   * (findingsByOrgData in audit-findings-tab.component.ts) so the same status
   * always reads as the same color everywhere on the page. */
  private readonly statusColors: Record<string, string> = {
    open: '#FFC000',
    overdue: '#FF5050',
    closed: '#70AD47',
  };

  readonly divisionCount = this.data.pages.filter(p => p.kind === 'division').length;
  readonly subDivisionCount = this.data.pages.length - this.divisionCount;

  get currentPage(): FindingUnitPage {
    return this.data.pages[this.subdivisionIndex];
  }

  /** "Division" / "Sub-Division" — what the current page is. */
  get unitLabel(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@common.division:Division`
      : $localize`:@@common.subDivision:Sub-Division`;
  }

  /** Tooltip for a pager tab. */
  pageTabTitle(page: FindingUnitPage): string {
    return page.kind === 'division'
      ? $localize`:@@dashboard.findingsBySubDivision.tabTitleDivision:Division`
      : $localize`:@@dashboard.findingsBySubDivision.tabTitleSubDivisionOf:Sub-division of ${page.division}:division:`;
  }

  /* ── Display labels (i18n) — display only; sorting/class lookups keep the raw values ── */

  private readonly severityDisplayLabels: Record<string, string> = {
    critical: $localize`:@@common.critical:Critical`,
    high: $localize`:@@common.high:High`,
    medium: $localize`:@@common.medium:Medium`,
    low: $localize`:@@common.low:Low`,
  };

  private readonly statusDisplayLabels: Record<string, string> = {
    open: $localize`:@@common.open:Open`,
    overdue: $localize`:@@common.overdue:Overdue`,
    'in-progress': $localize`:@@common.inProgress:In Progress`,
    responded: $localize`:@@common.responded:Responded`,
    verified: $localize`:@@common.verified:Verified`,
    closed: $localize`:@@common.closed:Closed`,
    escalated: $localize`:@@common.escalated:Escalated`,
    rejected: $localize`:@@common.rejected:Rejected`,
  };

  severityDisplay(row: SubdivisionFindingRow): string {
    return this.severityDisplayLabels[row.severityClass] ?? row.severity;
  }

  statusDisplay(row: SubdivisionFindingRow): string {
    return this.statusDisplayLabels[row.statusClass] ?? row.status;
  }

  get totalPages(): number {
    return this.data.pages.length;
  }

  get isFirstPage(): boolean {
    return this.subdivisionIndex === 0;
  }

  get isLastPage(): boolean {
    return this.subdivisionIndex === this.totalPages - 1;
  }

  /** Findings that sit exactly on the current page's unit (see `getFindingUnit`). */
  private findingsInCurrentSubdivision(): SubdivisionFindingRow[] {
    const page = this.currentPage;
    return this.data.findings.filter(f => {
      const unit = getFindingUnit(f);
      return unit.division === page.division && unit.subDivision === page.subDivision;
    });
  }

  get totalInSubdivision(): number {
    return this.findingsInCurrentSubdivision().length;
  }

  /** Every finding in the current sub-division, filtered + sorted. */
  get rows(): SubdivisionFindingRow[] {
    let list = this.findingsInCurrentSubdivision();

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(f =>
        f.finding.toLowerCase().includes(q) ||
        f.scope.toLowerCase().includes(q) ||
        f.company.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (this.sort === 'age') return b.ageDays - a.ageDays;
      if (this.sort === 'severity') return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      if (this.sort === 'company') return a.company.localeCompare(b.company) || b.ageDays - a.ageDays;
      return a.finding.localeCompare(b.finding);
    });
  }

  /** Companies that actually have a finding in the current sub-division, kept
   *  in the canonical `data.companies` order so a company's x-axis position
   *  stays stable across sub-division pages instead of reshuffling. */
  get companiesInCurrentSubdivision(): string[] {
    const present = new Set(this.findingsInCurrentSubdivision().map(f => f.company));
    return this.data.companies.filter(c => present.has(c));
  }

  /** Widens the chart instead of crushing bars when a sub-division has many companies. */
  get chartMinWidthPx(): number {
    return Math.max(480, this.companiesInCurrentSubdivision.length * 70);
  }

  get showScrollHint(): boolean {
    return this.companiesInCurrentSubdivision.length > 8;
  }

  /** Company × status counts, computed straight from `findings` — kept
   *  independent of the overview chart's own (separately-sourced, still-mock)
   *  numbers so this drawer's chart and table can never disagree with
   *  each other. */
  get chartData() {
    const companies = this.companiesInCurrentSubdivision;
    const subdivisionFindings = this.findingsInCurrentSubdivision();
    const countFor = (company: string, statusClass: string) =>
      subdivisionFindings.filter(f => f.company === company && f.statusClass === statusClass).length;

    /* maxBarThickness/categoryPercentage keep bars from ballooning out when
     * a sub-division page has only 1-2 companies inside this wide drawer —
     * same spacing rule as the main "Findings by Sub-Division" preview chart. */
    return {
      labels: companies,
      datasets: [
        { label: this.statusDisplayLabels['open'],    data: companies.map(c => countFor(c, 'open')),    backgroundColor: this.statusColors['open'],    borderRadius: 4, maxBarThickness: 56, categoryPercentage: 0.35, barPercentage: 0.4 },
        { label: this.statusDisplayLabels['overdue'], data: companies.map(c => countFor(c, 'overdue')), backgroundColor: this.statusColors['overdue'], borderRadius: 4, maxBarThickness: 56, categoryPercentage: 0.35, barPercentage: 0.4 },
        { label: this.statusDisplayLabels['closed'],  data: companies.map(c => countFor(c, 'closed')),  backgroundColor: this.statusColors['closed'],  borderRadius: 4, maxBarThickness: 56, categoryPercentage: 0.35, barPercentage: 0.4 },
      ],
    };
  }

  /** Grouped (not stacked) — matches the main "Findings by Sub-Division"
   *  preview chart: each company gets 3 side-by-side bars, one per status,
   *  instead of one stacked bar per company. Grouped makes the exact count
   *  for each status readable at a glance instead of requiring a hover to
   *  read a segment sitting on top of another. */
  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        legend: {
          display: true, // 3 status series now share the chart — legend distinguishes them
          position: 'bottom' as const,
          labels: { boxWidth: 10, font: { size: 11 }, padding: 12, color: c.textSecondary },
        },
        tooltip: {
          backgroundColor: c.surfaceCard,
          titleColor: c.text,
          bodyColor: c.text,
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: (item: any) => $localize`:@@dashboard.findingsBySubDivision.tooltipFindings:${item.dataset.label}:series:: ${item.parsed.y}:count: findings`,
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

  /** The drawer can open on a later page (see `startIndex`) — show its tab. */
  ngAfterViewInit(): void {
    this.scrollActiveTabIntoView();
  }

  goToSubdivision(index: number): void {
    this.subdivisionIndex = index;
    this.scrollActiveTabIntoView();
  }

  prevSubdivision(): void {
    if (!this.isFirstPage) this.subdivisionIndex -= 1;
    this.scrollActiveTabIntoView();
  }

  nextSubdivision(): void {
    if (!this.isLastPage) this.subdivisionIndex += 1;
    this.scrollActiveTabIntoView();
  }

  /** Brings the active tab into view when the tab strip is too narrow to show them all at once. */
  private scrollActiveTabIntoView(): void {
    this.tabButtons?.get(this.subdivisionIndex)?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }

  setSort(mode: FindingSortMode): void {
    this.sort = mode;
  }

  onSearchChange(value: string): void {
    this.search = value;
  }

  close(): void {
    this.drawerRef.close();
  }
}