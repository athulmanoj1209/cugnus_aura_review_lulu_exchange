import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  ClientDashboardDetailDrawerComponent,
  DashboardDetailDrawerData,
} from '../../com/client-dashboard-detail/client-dashboard-detail.component';
import { ScopeItem, ScopeStats } from '../../models/client-dashboard.model';

/** Which unit the Scope summary list groups by. */
type UnitView = 'division' | 'subDivision';

@Component({
  selector: 'app-client-scope-tab',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, ProgressBarModule, TooltipModule, DrawIconComponent],
  templateUrl: './client-scope-tab.component.html',
  styleUrls: ['./client-scope-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientScopeTabComponent {
  @Input() isCfo = true;
  @Input() scopes: ScopeItem[] = [];
  /** Computed by the parent, which also derives its scope KPIs from it. */
  @Input() scopeStats: ScopeStats = { total: 0, completed: 0, onTrack: 0, atRisk: 0, avgProgress: 0 };

  /** A scope stat card was clicked — `status` is the scope-summary filter to open with, if any. */
  @Output() openScopeSummary = new EventEmitter<string | undefined>();

  // The Scope summary shows only its first PREVIEW_COUNT items; "View all" opens
  // ClientDashboardDetailDrawerComponent, which lists every item with pagination.
  readonly PREVIEW_COUNT = 5;

  readonly myScopeLabel = $localize`:@@client.clientDashboard.myScope:My scope`;
  readonly divisionViewLabel = $localize`:@@client.clientDashboard.divisionView:Division`;
  readonly subDivisionViewLabel = $localize`:@@client.clientDashboard.subDivisionView:Sub-Division`;
  readonly scopeSummaryLabel = $localize`:@@client.clientDashboard.scopeSummary:Scope summary — all`;
  readonly itSecurityAssessmentLabel = $localize`:@@client.clientDashboard.itSecurityAssessment:IT Security Assessment`;
  readonly scopeItemsLabel = $localize`:@@client.clientDashboard.scopeItems:scope items`;
  readonly progressLabel = $localize`:@@common.progress:Progress`;
  readonly scopeLabel = $localize`:@@common.scope:Scope`;
  readonly divisionLabel = $localize`:@@client.clientDashboard.divisionLower:division`
  readonly subDivisionLabel = $localize`:@@client.clientDashboard.subDivisionLower:sub-division`;
  readonly divisionsLabel = $localize`:@@common.divisions:divisions`;
  readonly subDivisionsLabel = $localize`:@@common.subDivisions:sub-divisions`;
  readonly statusLabel = $localize`:@@common.status:Status`;
  readonly viewAllLabel = $localize`:@@common.viewAll:View all`;

  readonly unitViews: { key: UnitView; label: string }[] = [
    { key: 'division', label: this.divisionViewLabel },
    { key: 'subDivision', label: this.subDivisionViewLabel },
  ];

  readonly scopeSeverity: Record<string, 'danger' | 'warn' | 'success' | 'info' | 'secondary'> = {
    'On track': 'success',
    'In progress': 'info',
    'At risk': 'warn',
    Delayed: 'danger',
    Completed: 'success',
    'Not started': 'danger',
    Pending: 'warn',
    // Without these, a scope tagged Overdue/Planned would render its p-tag with no severity at
    // all (blank styling) instead of a colour matching audit-scope-summary.component.ts's own.
    Overdue: 'danger',
    Planned: 'secondary',
  };

  readonly progressColor: Record<string, string> = {
    'On track': '#1D9E75',
    'In progress': '#378ADD',
    'At risk': '#EF9F27',
    Delayed: '#E24B4A',
    Completed: '#1D9E75',
    'Not started': '#E24B4A',
    Pending: '#EF9F27',
    // Same reasoning as scopeSeverity above: without these the progress bar for an
    // Overdue/Planned scope would fall back to the CSS default (--bar-color unset).
    Overdue: '#E24B4A',
    Planned: '#94a3b8',
  };

  scopeListView: UnitView = 'subDivision';

  private readonly drawer = inject(RightDrawerService);

  /** The Scope summary list: CFO view splits it by the toggle; the Sub-Division Head
   *  view keeps its own (already sub-division-scoped) list. */
  get listedScopes(): ScopeItem[] {
    if (!this.isCfo) return this.scopes;
    return this.scopes.filter(s => !!s.divisionLevel === (this.scopeListView === 'division'));
  }

  /** The Scope summary card's preview — the first few of `listedScopes`. */
  get previewScopes(): ScopeItem[] {
    return this.listedScopes.slice(0, this.PREVIEW_COUNT);
  }

  setScopeListView(view: UnitView): void {
    this.scopeListView = view;
  }

  openScopesDetail(): void {
    const cfo = this.isCfo;
    const plural = this.scopeListView === 'division' ? 'divisions' : 'sub-divisions';
    this.drawer.open<void, DashboardDetailDrawerData>(ClientDashboardDetailDrawerComponent, {
      width: '820px',
      data: {
        title: cfo ? `${this.scopeSummaryLabel} ${plural}` : `${this.myScopeLabel} — ${this.itSecurityAssessmentLabel}`,
        subtitle: `${this.listedScopes.length} ${this.scopeItemsLabel}`,
        entityLabel: this.scopeItemsLabel,
        // Progress per scope, each bar in its status colour (same palette as the card's progress bars).
        chart: {
          labelKey: 'name',
          horizontal: true,
          percent: true,
          series: [{ key: 'progress', label: this.progressLabel, color: '#378ADD' }],
          colorBy: { key: 'status', colors: this.progressColor },
        },
        columns: [
          { key: 'name', label: this.scopeLabel },
          ...(cfo && this.scopeListView === 'subDivision' ? [{ key: 'subDivision', label: this.subDivisionLabel }] : []),
          ...(cfo ? [{ key: 'division', label: this.divisionLabel }] : []),
          { key: 'progress', label: this.progressLabel, numeric: true, percent: true, },
          { key: 'status', label: this.statusLabel, tag: true, },
        ],
        rows: this.listedScopes.map(s => ({
          name: s.name,
          subDivision: s.ownSubDivision ?? s.subDivision ?? '—',
          division: s.division ?? '—',
          progress: s.progress,
          status: s.status,
        })),
        tagSeverity: this.scopeSeverity,
      },
    });
  }
}
