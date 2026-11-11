import { Component, Input, LOCALE_ID, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CurrentAuditor } from '@/app/features/admin/auditor-dashboard/models/current-auditor.model';
import { getAllEnrichedRfis } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import {
  countWorkingPapersForAuditorByStatus,
  getWorkingPapersForAuditor,
  AuditorWorkingPaperRow,
} from '@/app/features/audits/audit-execution/working-papers/list/working-papers-list.component';
import { WorkingPapersProfileComponent, WorkingPaperDetailDrawerData } from '@/app/features/audits/audit-execution/working-papers/profile/working-papers-profile.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { DonutStatusChartComponent, DonutLegendItem } from '@/app/shared/components/donut-status-chart/donut-status-chart.component';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { RfiKpiCard, RfiListRow, RfiStatus, WpSummaryCard } from '@/app/features/admin/auditor-dashboard/models/auditor-rfi-working-paper.model';
import { RfiStatuses } from '@/app/features/audits/audit-execution/rfi/constants/rfi.constants';
import {
  AUDITOR_DASHBOARD_DATE_FORMAT,
  AUDITOR_DASHBOARD_DEFAULT_AUDITOR,
  AUDITOR_DASHBOARD_DRAWER_WIDTHS,
  AUDITOR_DASHBOARD_EMPTY_VALUE,
  AUDITOR_DASHBOARD_PAGE_SIZES,
  AUDITOR_DASHBOARD_QUERY_PARAMS as QP,
  AUDITOR_DASHBOARD_ROUTES,
  AUDITOR_RFI_NO_DIGITS,
  AUDITOR_RFI_NO_PREFIX,
  AuditorWorkingPaperStatuses,
} from '../../constants/auditor-dashboard.constants';
import {
  DASHBOARD_COLORS,
  DASHBOARD_DEFAULT_SEVERITY,
  REVIEWER_STATUS_SEVERITY,
  RFI_LIST_STATUS_LABELS,
  RFI_LIST_STATUS_SEVERITY,
  WORKING_PAPER_STATUS_SEVERITY,
  type DashboardTagSeverity,
} from '../../constants/auditor-dashboard-labels.constants';

/** RFI List status labels — also the keys rfiStatusLabel() translates. */
const L = RFI_LIST_STATUS_LABELS;

@Component({
  selector: 'app-auditor-working-papers-rfis-tab',
  imports: [NgClass, ChartModule, TableModule, TagModule, ButtonModule, TooltipModule, DrawIconComponent, DonutStatusChartComponent],
  templateUrl: './auditor-working-papers-rfis-tab.component.html',
  styleUrl: './auditor-working-papers-rfis-tab.component.scss',
})
export class AuditorWorkingPapersRfisTabComponent implements OnInit {

  @Input() currentAuditor: CurrentAuditor = AUDITOR_DASHBOARD_DEFAULT_AUDITOR;

  private readonly router = inject(Router);
  private readonly drawer = inject(RightDrawerService);

  readonly PAGE_SIZE = AUDITOR_DASHBOARD_PAGE_SIZES.Default;

  /** Target route for the RFI management screen. */
  private readonly RFI_ROUTE = AUDITOR_DASHBOARD_ROUTES.ManageRfi;

  /** Target route for the working-paper list screen. */
  private readonly WP_ROUTE = AUDITOR_DASHBOARD_ROUTES.WorkingPapers;
  private readonly locale = inject(LOCALE_ID);

  /**
   * `status` maps each card to the closest working-paper list filter value:
   *  • Total Working Papers → no status (all working papers for this auditor)
   *  • Draft                → draft
   *  • Submitted            → under_review (submitted for review)
   *  • Returned             → reopened
   *  • Approved             → approved
   */

  readonly rfiResponseLegend: DonutLegendItem[] = [
    { label: $localize`:@@common.responded:Responded`, value: this.countRfis(RfiStatuses.UnderReview), color: DASHBOARD_COLORS.Green },
    { label: $localize`:@@common.pending:Pending`,   value: this.countRfis(RfiStatuses.Pending), color: DASHBOARD_COLORS.Slate },
    { label: $localize`:@@common.overdue:Overdue`,   value: this.countRfis(RfiStatuses.Overdue), color: DASHBOARD_COLORS.Red },
    { label: $localize`:@@common.reopened:Reopened`,  value: this.countRfis(RfiStatuses.Reopened), color: DASHBOARD_COLORS.Amber },
    { label: $localize`:@@common.closed:Closed`,    value: this.countRfis(RfiStatuses.Completed), color: DASHBOARD_COLORS.Blue },
  ];

  get wpSummaryCards(): WpSummaryCard[] {
    const name = this.currentAuditor.name;
    const S = AuditorWorkingPaperStatuses;
    return [
      { label: $localize`:@@admin.auditorWorkingPapersRfis.totalWorkingPapers:Total Working Papers`, value: String(countWorkingPapersForAuditorByStatus(name, null)),           icon: 'pi pi-file',         cardClass: '' },
      { label: $localize`:@@common.draft:Draft`,                value: String(countWorkingPapersForAuditorByStatus(name, S.Draft)),       icon: 'pi pi-pencil',       cardClass: '',              status: S.Draft },
      { label: $localize`:@@common.submitted:Submitted`,            value: String(countWorkingPapersForAuditorByStatus(name, S.UnderReview)), icon: 'pi pi-send',         cardClass: 'stat--info',    status: S.UnderReview },
      { label: $localize`:@@common.returned:Returned`,             value: String(countWorkingPapersForAuditorByStatus(name, S.Reopened)),    icon: 'pi pi-undo',         cardClass: 'stat--warning', status: S.Reopened },
      { label: $localize`:@@common.approved:Approved`,             value: String(countWorkingPapersForAuditorByStatus(name, S.Approved)),    icon: 'pi pi-check-circle', cardClass: 'stat--success', status: S.Approved },
    ];
  }

  /**
   * `status` maps each card to the closest RFI management filter value:
   *  • RFIs Sent        → no status (all RFIs for this auditor)
   *  • RFIs Responded   → under-review (client responded, awaiting auditor review)
   *  • Pending Responses→ pending
   *  • Overdue RFIs     → overdue
   *  • Reopened RFIs    → reopened
   *  • Closed RFIs      → completed
   */
  get rfiKpiCards(): RfiKpiCard[] {
    return [
      { label: $localize`:@@admin.auditorWorkingPapersRfis.rfisSent:RFIs Sent`,         value: String(this.countRfis(null)),           icon: 'pi pi-send',                 cardClass: '' },
      { label: $localize`:@@admin.auditorWorkingPapersRfis.rfisResponded:RFIs Responded`,    value: String(this.countRfis(RfiStatuses.UnderReview)), icon: 'pi pi-reply',                cardClass: 'stat--success', status: RfiStatuses.UnderReview },
      { label: $localize`:@@admin.auditorWorkingPapersRfis.pendingResponses:Pending Responses`, value: String(this.countRfis(RfiStatuses.Pending)),     icon: 'pi pi-clock',                cardClass: 'stat--warning', status: RfiStatuses.Pending },
      { label: $localize`:@@admin.auditorWorkingPapersRfis.overdueRfis:Overdue RFIs`,      value: String(this.countRfis(RfiStatuses.Overdue)),     icon: 'pi pi-exclamation-triangle', cardClass: 'stat--danger',  status: RfiStatuses.Overdue },
      { label: $localize`:@@admin.auditorWorkingPapersRfis.reopenedRfis:Reopened RFIs`,     value: String(this.countRfis(RfiStatuses.Reopened)),    icon: 'pi pi-refresh',              cardClass: 'stat--orange',  status: RfiStatuses.Reopened },
      { label: $localize`:@@admin.auditorWorkingPapersRfis.closedRfis:Closed RFIs`,       value: String(this.countRfis(RfiStatuses.Completed)),   icon: 'pi pi-times-circle',         cardClass: '',              status: RfiStatuses.Completed },
    ];
  }

  /** Every RFI assigned to this auditor, matching an exact status when given (null = all). */
  private countRfis(status: RfiStatus | null): number {
    const id = this.currentAuditor.id;
    return getAllEnrichedRfis().filter(r => r.auditorIds?.includes(id) && (status === null || r.status === status)).length;
  }

  rfiResponseChartData: any;
  rfiResponseChartOptions: any;

  // Computed once in ngOnInit (not as getters) — a getter bound directly to
  // p-table's [value] re-runs and returns a brand-new array of brand-new
  // row objects on every change-detection cycle, which makes the table
  // tear down and rebuild its rows constantly and can drop a real click on
  // the "view" button mid-render.
  workingPapers: AuditorWorkingPaperRow[] = [];
  rfiList: RfiListRow[] = [];

  ngOnInit(): void {
    this.workingPapers = getWorkingPapersForAuditor(this.currentAuditor.name);

    const id = this.currentAuditor.id;
    this.rfiList = getAllEnrichedRfis()
      .filter(r => r.auditorIds?.includes(id))
      .map(r => ({
        rfiNo: `${AUDITOR_RFI_NO_PREFIX}${String(r.id).padStart(AUDITOR_RFI_NO_DIGITS, '0')}`,
        audit: r.subDivisionLabel,
        scope: r.subScopeLabel ?? r.scopeLabel ?? AUDITOR_DASHBOARD_EMPTY_VALUE,
        subDivision: r.subDivisionLabel,
        dueDate: r.dueDate.toLocaleDateString(this.locale, AUDITOR_DASHBOARD_DATE_FORMAT),
        status: L[r.status],
      }));
  }

  /**
   * Drill into the working-paper list, pre-filtered to the card's status
   * (if any) and scoped to the current auditor.
   */
  goToWorkingPapers(card: WpSummaryCard): void {
    this.router.navigate([this.WP_ROUTE], {
      queryParams: {
        ...(card.status ? { [QP.Status]: card.status } : {}),
        [QP.AuditorId]: this.currentAuditor.name,
      },
    });
  }

  openWorkingPaperDrawer(row: AuditorWorkingPaperRow): void {
    this.drawer.open<WorkingPapersProfileComponent, WorkingPaperDetailDrawerData>(
      WorkingPapersProfileComponent,
      { width: AUDITOR_DASHBOARD_DRAWER_WIDTHS.WorkingPaper, data: { workingPaper: row.detail } },
    );
  }

  goToRfis(card: RfiKpiCard): void {
    this.router.navigate([this.RFI_ROUTE], {
      queryParams: {
        ...(card.status ? { [QP.Status]: card.status } : {}),
        [QP.AuditorId]: this.currentAuditor.id,
      },
    });
  }


  getWpStatusSeverity(status: string): DashboardTagSeverity {
    return WORKING_PAPER_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getReviewerStatusSeverity(status: string): DashboardTagSeverity {
    return REVIEWER_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  getRfiStatusSeverity(status: string): DashboardTagSeverity {
    return RFI_LIST_STATUS_SEVERITY[status] ?? DASHBOARD_DEFAULT_SEVERITY;
  }

  isAlertRfi(status: string): boolean {
    return status === L.overdue;
  }

  rfiStatusLabel(status: string): string {
    switch (status) {
      case L.pending:
        return $localize`:@@admin.auditorWorkingPapersRfis.pendingClient:Pending Client`;
      case L['under-review']:
        return $localize`:@@admin.auditorWorkingPapersRfis.clientResponded:Client Responded`;
      case L.overdue:
        return $localize`:@@common.overdue:Overdue`;
      case L.completed:
        return $localize`:@@common.closed:Closed`;
      case L.reopened:
        return $localize`:@@common.reopened:Reopened`;
      default:
        return status;
    }
  }
  
  wpStatusLabel(status: string): string {
    switch (status) {
      case 'Draft':
        return $localize`:@@common.draft:Draft`;
      case 'In Progress':
        return $localize`:@@common.inProgress:In Progress`;
      case 'Submitted':
        return $localize`:@@common.submitted:Submitted`;
      case 'Returned':
        return $localize`:@@common.returned:Returned`;
      case 'Approved':
        return $localize`:@@common.approved:Approved`;
      default:
        return status;
    }
  }

  reviewerStatusLabel(status: string): string {
    switch (status) {
      case 'Approved':
        return $localize`:@@common.approved:Approved`;
      case 'Under Review':
        return $localize`:@@common.underReview:Under Review`;
      case 'Pending':
        return $localize`:@@common.pending:Pending`;
      case 'Returned':
        return $localize`:@@common.returned:Returned`;
      default:
        return status;
    }
  }
}
