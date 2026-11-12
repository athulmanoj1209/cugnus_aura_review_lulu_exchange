import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RfiTabComponent } from '../tabs/rfi-tab/rfi-tab.component';
import { ComplianceTabComponent } from '../tabs/compliance-tab/compliance-tab.component';
import { AuditOverviewTabComponent } from '../tabs/audit-overview-tab/audit-overview-tab.component';
import { AuditFindingsTabComponent } from '../tabs/audit-findings-tab/audit-findings-tab.component';
import { AuditStaffPerformanceTabComponent } from '@/app/features/admin/dashboard/tabs/audit-staff-performance-tab/audit-staff-performance-tab.component';

const DEFAULT_TAB = 'audit-overview';

@Component({
  selector: 'app-dashboard-main',
  imports: [NgClass, RfiTabComponent, ComplianceTabComponent,AuditOverviewTabComponent,
    AuditFindingsTabComponent,
    AuditStaffPerformanceTabComponent],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMain {
  tabs = [
    { id: 'audit-overview',    label: $localize`:@@dashboard.main.tabAuditOverview:Audit Overview`,       icon: 'pi pi-table' },
    { id: 'findings',          label: $localize`:@@dashboard.main.tabFindings:Findings`,                  icon: 'pi pi-exclamation-circle' },
    { id: 'rfi',               label: $localize`:@@dashboard.main.tabRfi:RFI`,                            icon: 'pi pi-file' },
    { id: 'staff-performance', label: $localize`:@@dashboard.main.tabStaffPerformance:Staff Performance`, icon: 'pi pi-users' },
    { id: 'compliance',        label: $localize`:@@dashboard.main.tabCompliance:Compliance`,              icon: 'pi pi-shield' },
  ];

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Restored from `?tab=` so Back from a counter-card drill-down returns to the same tab. */
  activeTab: string = this.resolveTab(this.route.snapshot.queryParamMap.get('tab'));

  selectTab(id: string): void {
    if (this.activeTab === id) return;
    this.activeTab = id;
    // replaceUrl: tab switches update the current history entry instead of stacking Back steps.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: id },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private resolveTab(tab: string | null): string {
    return this.tabs.some(t => t.id === tab) ? tab! : DEFAULT_TAB;
  }
}
