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
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { LayoutService } from '@/app/layout/service/layout.service';
import { CompanyRow } from '@/app/features/admin/dashboard/models/dashboard-common.model';
import { AuditSortMode, AuditUnitPage, SubdivisionDetailData } from '@/app/features/admin/dashboard/models/dashboard-audit.model';

/* TODO: point these two imports at the real paths in your project.
 * Based on right-drawer.service.ts, drawer-ref.ts lives at '@/app/shared/components/drawer-ref'
 * relative to that service — adjust relative to wherever this component ends up. */


/**
 * Full "Audits by Division / Sub-Division" breakdown. Pagination here is BY
 * UNIT, split the same way as the overview chart's toggle: first a page per
 * division audited as a whole (no sub-divisions), then a page per
 * sub-division — each audit appears on exactly one page, and every page
 * still shows every company. This
 * keeps each page a single-series chart (one bar per company) that stays
 * readable even with a dozen-plus companies, instead of a grouped chart
 * with one crowded cluster of bars per sub-division.
 *
 * Opened from AuditOverviewTabComponent as a right-side drawer when the user
 * clicks the (necessarily truncated) preview chart on the overview page.
 */
@Component({
  selector: 'app-audits-by-subdivision-detail',
  standalone: true,
  imports: [CommonModule, ChartModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audits-by-subdivision-detail.component.html',
  styleUrls: ['./audits-by-subdivision-detail.component.scss'],
})
export class AuditsBySubDivisionDetailComponent implements AfterViewInit {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as SubdivisionDetailData;

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
  sort: AuditSortMode = 'count';
  search = '';

  /* Each ORGANIZATION gets its own fixed color, assigned by its position in
   * `data.orgBreakdown` (the order the API/caller provides) — not by where
   * it happens to land after sorting or filtering. That's what makes a
   * company's bar the same color on every sub-division page and in every
   * sort order, instead of colors reshuffling every time the rows change.
   *
   * This validated 8-hue set is colorblind-safe for adjacent bars (worst
   * adjacent CVD ΔE ~9 in both light/dark). With today's 8 mock companies
   * every one gets a distinct hue. If your real org count regularly runs
   * past 8, colors will start repeating (`i % PALETTE.length`) — at that
   * point consider a "top N + Other" grouping, a texture/pattern overlay,
   * or leaning on the x-axis labels (already direct-labeled) rather than
   * adding more hues, since a 9th+ generated hue stops being reliably
   * distinguishable. */
  private readonly palette = [
    '#2a78d6', // blue
    '#eb6834', // orange
    '#1baf7a', // aqua
    '#eda100', // yellow
    '#e87ba4', // magenta
    '#008300', // green
    '#4a3aa7', // violet
    '#e34948', // red
  ];

  private readonly orgColor = new Map<string, string>(
    this.data.orgBreakdown.map((o, i) => [o.org, this.palette[i % this.palette.length]]),
  );

  readonly divisionCount = this.data.pages.filter(p => p.kind === 'division').length;
  readonly subDivisionCount = this.data.pages.length - this.divisionCount;

  get currentPage(): AuditUnitPage {
    return this.data.pages[this.subdivisionIndex];
  }

  /** "Division" / "Sub-Division" — what the current page is. */
  get unitLabel(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@common.division:Division`
      : $localize`:@@common.subDivision:Sub-Division`;
  }

  get prevUnitAriaLabel(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@dashboard.auditsBySubDivision.previousDivisionAriaLabel:Previous division`
      : $localize`:@@dashboard.auditsBySubDivision.previousSubDivisionAriaLabel:Previous sub-division`;
  }

  get nextUnitAriaLabel(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@dashboard.auditsBySubDivision.nextDivisionAriaLabel:Next division`
      : $localize`:@@dashboard.auditsBySubDivision.nextSubDivisionAriaLabel:Next sub-division`;
  }

  get filterPlaceholder(): string {
    return this.currentPage.kind === 'division'
      ? $localize`:@@dashboard.auditsBySubDivision.filterDivisionPlaceholder:Filter companies in this division`
      : $localize`:@@dashboard.auditsBySubDivision.filterSubDivisionPlaceholder:Filter companies in this sub-division`;
  }

  /** Tab tooltip: "Division" or "Sub-division of <parent division>". */
  pageTitle(page: AuditUnitPage): string {
    return page.kind === 'division'
      ? $localize`:@@dashboard.auditsBySubDivision.tabTitleDivision:Division`
      : $localize`:@@dashboard.auditsBySubDivision.tabTitleSubDivisionOf:Sub-division of ${page.division}:division:`;
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

  /** Every company's count for the current sub-division, filtered + sorted. */
  get rows(): CompanyRow[] {
    const si = this.subdivisionIndex;
    let list: CompanyRow[] = this.data.orgBreakdown.map(o => ({ org: o.org, count: o.counts[si] ?? 0 }));

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(r => r.org.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) =>
      this.sort === 'count'
        ? (b.count - a.count) || a.org.localeCompare(b.org)
        : a.org.localeCompare(b.org),
    );
  }

  get maxCount(): number {
    return this.rows.reduce((m, r) => Math.max(m, r.count), 0);
  }

  get totalForSubdivision(): number {
    return this.rows.reduce((sum, r) => sum + r.count, 0);
  }

  /** Widens the chart instead of crushing bars when a sub-division has many companies. */
  get chartMinWidthPx(): number {
    return Math.max(560, this.rows.length * 46);
  }

  get showScrollHint(): boolean {
    return this.rows.length > 12;
  }

  get chartData() {
    const rows = this.rows;
    return {
      labels: rows.map(r => r.org),
      datasets: [{
        label: this.currentPage.name,
        data: rows.map(r => r.count),
        backgroundColor: rows.map(r => this.colorFor(r.org)),
        borderRadius: 4,
      }],
    };
  }

  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
    plugins: {
      legend: { display: false }, // single series named in the title — no legend needed
      tooltip: {
        backgroundColor: c.surfaceCard,
        titleColor: c.text,
        bodyColor: c.text,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          // values lead, labels follow — company name is already the tooltip title
          label: (item: any) => $localize`:@@dashboard.auditsBySubDivision.tooltipAudits:${item.parsed.y}:count: audits`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, precision: 0 } },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
    datasets: {
      bar: {
        barPercentage: 0.55,
        categoryPercentage: 0.45,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    };
  });

  /** The fixed color for this organization — same value everywhere it's used. */
  colorFor(org: string): string {
    return this.orgColor.get(org) ?? '#94a3b8';
  }

  /** Is this the (or a tied) top-count company for the current sub-division? */
  isTop(row: CompanyRow): boolean {
    return row.count === this.maxCount && this.maxCount > 0;
  }

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

  setSort(mode: AuditSortMode): void {
    this.sort = mode;
  }

  onSearchChange(value: string): void {
    this.search = value;
  }

  close(): void {
    this.drawerRef.close();
  }
}