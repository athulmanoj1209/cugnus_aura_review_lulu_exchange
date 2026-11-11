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
import { LayoutService } from '@/app/layout/service/layout.service';
import { AgingAnalysisDetailData, AgingBucket, AgingFindingRow, FindingSortMode } from '@/app/features/admin/dashboard/models/dashboard-finding.model';

const SEVERITY_RANK: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

/**
 * Full "Aging Analysis" breakdown — same drill-down pattern as the other
 * detail drawers, paginated by age bucket instead of department. Page 1
 * shows every finding whose age falls in the first bucket (e.g. "< 30
 * days"); paging moves to the next bucket. Each page drills into the
 * ACTUAL findings from that bucket (drawn from the same `findings` list
 * backing the main table), not just a total count.
 *
 * Opened from AuditFindingsTabComponent as a right-side drawer when the user
 * clicks the "Aging Analysis" chart on the main page.
 */
@Component({
  selector: 'app-aging-analysis-detail',
  standalone: true,
  imports: [CommonModule, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aging-analysis-detail.component.html',
  styleUrls: ['./aging-analysis-detail.component.scss'],
})
export class AgingAnalysisDetailComponent {

  private readonly drawerRef = inject(DrawerRef);
  readonly data = inject(DRAWER_DATA) as AgingAnalysisDetailData;

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

  /** Which age-bucket "page" we're on — this is the whole pagination model. */
  bucketIndex = 0;
  sort: FindingSortMode = 'age';
  search = '';

  /* Same 8-color identity palette used in the Audits by Department / Risk
   * Rating detail drawers — assigned by each company's fixed position in
   * `data.companies`, not by its on-screen rank, so an organization's color
   * stays the same across every bucket page. */
  private readonly palette = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
  private readonly orgColor = new Map<string, string>(
    this.data.companies.map((company, i) => [company, this.palette[i % this.palette.length]]),
  );

  colorFor(company: string): string {
    return this.orgColor.get(company) ?? '#94a3b8';
  }

  /** Display-only label for a finding's severity key (row.severityClass).
   *  Falls back to the caller-supplied `fallback` for unknown keys. */
  severityLabel(severityClass: string, fallback: string): string {
    switch (severityClass) {
      case 'critical': return $localize`:@@dashboard.agingDetail.severityCritical:Critical`;
      case 'high':     return $localize`:@@dashboard.agingDetail.severityHigh:High`;
      case 'medium':   return $localize`:@@dashboard.agingDetail.severityMedium:Medium`;
      case 'low':      return $localize`:@@dashboard.agingDetail.severityLow:Low`;
      default:         return fallback;
    }
  }

  /** Display-only label for a finding's status key (row.statusClass).
   *  Falls back to the caller-supplied `fallback` for unknown keys. */
  statusLabel(statusClass: string, fallback: string): string {
    switch (statusClass) {
      case 'open':        return $localize`:@@dashboard.agingDetail.statusOpen:Open`;
      case 'in-progress': return $localize`:@@dashboard.agingDetail.statusInProgress:In Progress`;
      case 'responded':   return $localize`:@@dashboard.agingDetail.statusResponded:Responded`;
      case 'verified':    return $localize`:@@dashboard.agingDetail.statusVerified:Verified`;
      case 'closed':      return $localize`:@@dashboard.agingDetail.statusClosed:Closed`;
      case 'escalated':   return $localize`:@@dashboard.agingDetail.statusEscalated:Escalated`;
      case 'overdue':     return $localize`:@@dashboard.agingDetail.statusOverdue:Overdue`;
      case 'rejected':    return $localize`:@@dashboard.agingDetail.statusRejected:Rejected`;
      default:            return fallback;
    }
  }

  get currentBucket(): AgingBucket {
    return this.data.buckets[this.bucketIndex];
  }

  get totalPages(): number {
    return this.data.buckets.length;
  }

  get isFirstPage(): boolean {
    return this.bucketIndex === 0;
  }

  get isLastPage(): boolean {
    return this.bucketIndex === this.totalPages - 1;
  }

  private inBucket(f: AgingFindingRow, bucket: AgingBucket): boolean {
    return f.ageDays >= bucket.min && (bucket.max === null || f.ageDays <= bucket.max);
  }

  private findingsInCurrentBucket(): AgingFindingRow[] {
    const bucket = this.currentBucket;
    return this.data.findings.filter(f => this.inBucket(f, bucket));
  }

  get totalInBucket(): number {
    return this.findingsInCurrentBucket().length;
  }

  /** Every finding in the current bucket, filtered + sorted. */
  get rows(): AgingFindingRow[] {
    let list = this.findingsInCurrentBucket();

    const q = this.search.trim().toLowerCase();
    if (q) {
      list = list.filter(f =>
        f.finding.toLowerCase().includes(q) ||
        f.company.toLowerCase().includes(q) ||
        f.scope.toLowerCase().includes(q) ||
        f.subDivision.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (this.sort === 'age') return b.ageDays - a.ageDays;
      if (this.sort === 'severity') return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      if (this.sort === 'company') return a.company.localeCompare(b.company);
      return a.finding.localeCompare(b.finding);
    });
  }

  /** Companies with at least one finding in the current bucket, in the same
   * fixed order as `data.companies` (so identity colors and left-to-right
   * order both stay stable across pages). */
  get companiesInCurrentBucket(): string[] {
    const present = new Set(this.findingsInCurrentBucket().map(f => f.company));
    return this.data.companies.filter(c => present.has(c));
  }

  private orgCountsInCurrentBucket(): { company: string; count: number }[] {
    const bucketFindings = this.findingsInCurrentBucket();
    return this.companiesInCurrentBucket.map(company => ({
      company,
      count: bucketFindings.filter(f => f.company === company).length,
    }));
  }

  private get maxOrgCountInCurrentBucket(): number {
    const counts = this.orgCountsInCurrentBucket().map(c => c.count);
    return counts.length ? Math.max(...counts) : 0;
  }

  /** The org (or orgs) with the most findings in this bucket get a dark
   * outline instead of a different fill color — same "leader" convention
   * used in the Audits by Department / Risk Rating detail drawers. */
  isTopOrg(_company: string, count: number): boolean {
    return count > 0 && count === this.maxOrgCountInCurrentBucket;
  }

  /** Chart grows wider as more companies appear on this page, same rule used
   * in the other detail drawers, so bars never get crushed together. */
  get chartMinWidthPx(): number {
    return Math.max(420, this.companiesInCurrentBucket.length * 90);
  }

  get showScrollHint(): boolean {
    return this.companiesInCurrentBucket.length > 6;
  }

  get chartData() {
    const counts = this.orgCountsInCurrentBucket();
    return {
      labels: counts.map(c => c.company),
      datasets: [{
        label: this.currentBucket.label,
        data: counts.map(c => c.count),
        backgroundColor: counts.map(c => this.colorFor(c.company)),
        borderRadius: 4,
      }],
    };
  }

  readonly barOptions = computed(() => {
    const c = this.themeColors();
    return {
      plugins: {
        legend: { display: false }, // color already identifies the organization, same as Audits by Department
        tooltip: {
          backgroundColor: c.surfaceCard,
          titleColor: c.text,
          bodyColor: c.text,
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: (item: any) => item.parsed.y === 1
              ? $localize`:@@dashboard.agingDetail.tooltipFindingOne:${item.parsed.y}:count: finding`
              : $localize`:@@dashboard.agingDetail.tooltipFindingOther:${item.parsed.y}:count: findings`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: c.surfaceBorder }, ticks: { font: { size: 11 }, precision: 0 } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
      datasets: {
        bar: {
          barPercentage: 0.4,
          categoryPercentage: 0.35,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  });

  goToBucket(index: number): void {
    this.bucketIndex = index;
    this.scrollActiveTabIntoView();
  }

  prevBucket(): void {
    if (!this.isFirstPage) this.bucketIndex -= 1;
    this.scrollActiveTabIntoView();
  }

  nextBucket(): void {
    if (!this.isLastPage) this.bucketIndex += 1;
    this.scrollActiveTabIntoView();
  }

  /** Brings the active tab into view when the tab strip is too narrow to show them all at once. */
  private scrollActiveTabIntoView(): void {
    this.tabButtons?.get(this.bucketIndex)?.nativeElement.scrollIntoView({
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