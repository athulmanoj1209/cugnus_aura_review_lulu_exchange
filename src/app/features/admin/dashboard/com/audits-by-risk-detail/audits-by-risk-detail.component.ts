import {
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
import { AuditSortMode, RiskDetailData } from '@/app/features/admin/dashboard/models/dashboard-audit.model';

/* TODO: point these two imports at the real paths in your project.
 * Based on right-drawer.service.ts, drawer-ref.ts lives at '@/app/shared/components/drawer-ref'
 * relative to that service — adjust relative to wherever this component ends up. */


/**
 * Full "Risk Rating Distribution" breakdown — the same drill-down pattern as
 * AuditsByDepartmentDetailComponent, just paginated by risk level instead of
 * department. Page 1 shows every company's audit count for the first risk
 * level (e.g. Critical); paging moves to the next risk level, still showing
 * every company. One page = one single-series chart (one bar per company),
 * which stays readable regardless of how many companies exist, instead of a
 * stacked bar with one crowded segment per company per risk level.
 *
 * Opened from AuditOverviewTabComponent as a right-side drawer when the user
 * clicks the (necessarily truncated) preview chart on the overview page.
 */
@Component({
  selector: 'app-audits-by-risk-detail',
  standalone: true,
  imports: [CommonModule, ChartModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audits-by-risk-detail.component.html',
  styleUrls: ['./audits-by-risk-detail.component.scss'],
})
export class AuditsByRiskDetailComponent {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as RiskDetailData;

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

  /** Which risk-level "page" we're on — this is the whole pagination model. */
  riskIndex = 0;
  sort: AuditSortMode = 'count';
  search = '';

  /* Each ORGANIZATION gets its own fixed color, assigned by its position in
   * `data.orgBreakdown` (the order the API/caller provides) — not by where
   * it happens to land after sorting or filtering. That's what makes a
   * company's bar the same color on every risk-level page and in every sort
   * order, instead of colors reshuffling every time the rows change.
   *
   * Same validated 8-hue set used in the Audits by Department detail view,
   * so an organization's color stays consistent across both drill-downs.
   * With more than 8 companies, colors start repeating (`i % palette.length`) —
   * see the note in audits-by-department-detail.component.ts for mitigation
   * options if your real org count regularly runs past 8. */
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

  get currentRiskLevel(): string {
    return this.data.riskLevels[this.riskIndex];
  }

  /** Display-only translation of the current risk-level key. */
  get currentRiskLabel(): string {
    return this.riskLabel(this.currentRiskLevel);
  }

  /** Display-only translation of a risk-level key ('High' / 'Medium' / 'Low'). */
  riskLabel(risk: string): string {
    switch (risk) {
      case 'Critical': return $localize`:@@common.critical:Critical`;
      case 'High':     return $localize`:@@common.high:High`;
      case 'Medium':   return $localize`:@@common.medium:Medium`;
      case 'Low':      return $localize`:@@common.low:Low`;
      default:         return risk;
    }
  }

  get totalPages(): number {
    return this.data.riskLevels.length;
  }

  get isFirstPage(): boolean {
    return this.riskIndex === 0;
  }

  get isLastPage(): boolean {
    return this.riskIndex === this.totalPages - 1;
  }

  /** Every company's count for the current risk level, filtered + sorted. */
  get rows(): CompanyRow[] {
    const ri = this.riskIndex;
    let list: CompanyRow[] = this.data.orgBreakdown.map(o => ({ org: o.org, count: o.counts[ri] ?? 0 }));

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

  get totalForRisk(): number {
    return this.rows.reduce((sum, r) => sum + r.count, 0);
  }

  /** Widens the chart instead of crushing bars when a risk level has many companies. */
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
        label: this.currentRiskLabel,
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
            label: (item: any) => $localize`:@@dashboard.auditsByRisk.tooltipAudits:${item.parsed.y}:count: audits`,
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

  /** Is this the (or a tied) top-count company for the current risk level? */
  isTop(row: CompanyRow): boolean {
    return row.count === this.maxCount && this.maxCount > 0;
  }

  goToRisk(index: number): void {
    this.riskIndex = index;
    this.scrollActiveTabIntoView();
  }

  prevRisk(): void {
    if (!this.isFirstPage) this.riskIndex -= 1;
    this.scrollActiveTabIntoView();
  }

  nextRisk(): void {
    if (!this.isLastPage) this.riskIndex += 1;
    this.scrollActiveTabIntoView();
  }

  /** Brings the active tab into view when the tab strip is too narrow to show them all at once. */
  private scrollActiveTabIntoView(): void {
    this.tabButtons?.get(this.riskIndex)?.nativeElement.scrollIntoView({
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