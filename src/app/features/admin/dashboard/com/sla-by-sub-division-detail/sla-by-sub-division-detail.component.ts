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

/* Same relative path RfiDetailDrawer uses for these two tokens — adjust if
 * this component ends up in a different folder than rfi-detail-drawer. */
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { LayoutService } from '@/app/layout/service/layout.service';
import { rfiRowsOnPage } from '../rfi-by-sub-division-detail/rfi-by-sub-division-detail.component';
import { OrgSlaStat, RfiUnitPage, SlaBySubDivisionDetailData, SlaRfiRow, SlaSortMode } from '@/app/features/admin/dashboard/models/dashboard-rfi.model';

/**
 * Full "SLA Compliance by Division / Sub-Division" breakdown — same drill-down
 * pattern (and same pages: division-level units first, then sub-divisions) as
 * RfiBySubDivisionDetailComponent: one unit per page. Unlike that chart
 * (which breaks a sub-division down by status), this one breaks it down by
 * organization's SLA COMPLIANCE % — the metric that chart already tracked,
 * just moved from a per-sub-division bar to a per-organization one so it's
 * clear which organization is driving a sub-division's compliance number.
 * Drawn straight from the same `records` list backing the main table, so it
 * can never disagree with it.
 *
 * Opened from RfiTabComponent as a right-side drawer when the user clicks the
 * "SLA Compliance by Sub-Division" chart on the main page.
 */
@Component({
  selector: 'app-sla-by-sub-division-detail',
  standalone: true,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sla-by-sub-division-detail.component.html',
  styleUrls: ['./sla-by-sub-division-detail.component.scss'],
})
export class SlaBySubDivisionDetailComponent implements AfterViewInit {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as SlaBySubDivisionDetailData;

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
  sort: SlaSortMode = 'compliance';
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
      ? $localize`:@@dashboard.slaBySubDivision.tabTitleDivision:Division`
      : $localize`:@@dashboard.slaBySubDivision.tabTitleSubDivisionOf:Sub-division of ${page.division}:division:`;
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

  private recordsInCurrentDept(): SlaRfiRow[] {
    return rfiRowsOnPage(this.data.records, this.currentPage);
  }

  get totalInDept(): number {
    return this.recordsInCurrentDept().length;
  }

  /** Every organization, always — even ones with zero RFIs in the current
   *  sub-division — so a sub-division like HR (where only one company happens
   *  to have RFIs today) still shows the full company roster instead of
   *  silently dropping everyone else. Kept in the canonical `data.companies`
   *  order so a company's x-axis position stays stable across pages. */
  get companiesInCurrentDept(): string[] {
    return this.data.companies;
  }

  private orgStatsInCurrentDept(): OrgSlaStat[] {
    const deptRecords = this.recordsInCurrentDept();
    return this.companiesInCurrentDept.map(company => {
      const orgRecords = deptRecords.filter(r => r.company === company);
      const met = orgRecords.filter(r => r.sla === 'Met').length;
      const breach = orgRecords.length - met;
      return {
        company,
        total: orgRecords.length,
        met,
        breach,
        compliance: orgRecords.length ? Math.round((met / orgRecords.length) * 100) : 0,
        hasData: orgRecords.length > 0,
      };
    });
  }

  /** Every organization's SLA stats for the current sub-division, filtered + sorted. */
  get rows(): OrgSlaStat[] {
    let list = this.orgStatsInCurrentDept();

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(r => r.company.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      if (this.sort === 'compliance') {
        // Organizations with no RFIs aren't "worst" — they're not measured
        // at all — so they always sort after every organization with real data.
        if (a.hasData !== b.hasData) return a.hasData ? -1 : 1;
        return a.compliance - b.compliance;
      }
      if (this.sort === 'volume') return b.total - a.total;
      return a.company.localeCompare(b.company);
    });
  }

  /** Widens the chart instead of crushing bars when a sub-division has many companies. */
  get chartMinWidthPx(): number {
    return Math.max(420, this.companiesInCurrentDept.length * 80);
  }

  get showScrollHint(): boolean {
    return this.companiesInCurrentDept.length > 8;
  }

  get chartData() {
    const stats = this.orgStatsInCurrentDept();
    return {
      labels: stats.map(s => s.company),
      datasets: [{
        label: $localize`:@@dashboard.slaBySubDivision.slaCompliancePercent:SLA Compliance %`,
        // No-data organizations render as a flat, uncolored 0 bar — grey,
        // not red, so "no RFIs here" never reads as "this org is failing".
        data: stats.map(s => s.hasData ? s.compliance : 0),
        backgroundColor: stats.map(s => !s.hasData ? '#e5e7eb' : (s.compliance === 100 ? '#22c55e' : '#ef4444')),
        maxBarThickness: 56,
        categoryPercentage: 0.45,
        barPercentage: 0.55,
        borderRadius: 4,
      }],
    };
  }

  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
    plugins: {
      legend: { display: false }, // color already tells pass/fail — no legend needed
      tooltip: {
        backgroundColor: c.surfaceCard,
        titleColor: c.text,
        bodyColor: c.text,
        borderColor: c.surfaceBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          // Looked up lazily (not baked into `chartData`) so this always
          // reflects whichever sub-division page is currently showing.
          label: (item: any) => {
            const stat = this.orgStatsInCurrentDept()[item.dataIndex];
            if (stat && !stat.hasData) {
              return this.currentPage.kind === 'division'
                ? $localize`:@@dashboard.slaBySubDivision.tooltipNoRfisDivision:No RFIs in this division`
                : $localize`:@@dashboard.slaBySubDivision.tooltipNoRfisSubDivision:No RFIs in this sub-division`;
            }
            return $localize`:@@dashboard.slaBySubDivision.tooltipCompliant:${item.parsed.y}:percent:% compliant`;
          },
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        beginAtZero: true, max: 100,
        ticks: { callback: (v: any) => v + '%', font: { size: 11 } },
        grid: { color: c.surfaceBorder },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    };
  });

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

  setSort(mode: SlaSortMode): void {
    this.sort = mode;
  }

  onSearchChange(value: string): void {
    this.search = value;
  }

  close(): void {
    this.drawerRef.close();
  }
}
