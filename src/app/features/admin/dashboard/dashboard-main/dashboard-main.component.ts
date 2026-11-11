import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RfiTabComponent } from '../tabs/rfi-tab/rfi-tab.component';
import { ComplianceTabComponent } from '../tabs/compliance-tab/compliance-tab.component';
import { AuditOverviewTabComponent } from '../tabs/audit-overview-tab/audit-overview-tab.component';
import { AuditFindingsTabComponent } from '../tabs/audit-findings-tab/audit-findings-tab.component';
import { AuditStaffPerformanceTabComponent } from '@/app/features/admin/dashboard/tabs/audit-staff-performance-tab/audit-staff-performance-tab.component';

@Component({
  selector: 'app-dashboard-main',
  imports: [NgClass, RfiTabComponent, ComplianceTabComponent,AuditOverviewTabComponent,
    AuditFindingsTabComponent,
    AuditStaffPerformanceTabComponent],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMain {
  activeTab = 'audit-overview';

  tabs = [
    { id: 'audit-overview',    label: $localize`:@@dashboard.main.tabAuditOverview:Audit Overview`,       icon: 'pi pi-table' },
    { id: 'findings',          label: $localize`:@@dashboard.main.tabFindings:Findings`,                  icon: 'pi pi-exclamation-circle' },
    { id: 'rfi',               label: $localize`:@@dashboard.main.tabRfi:RFI`,                            icon: 'pi pi-file' },
    { id: 'staff-performance', label: $localize`:@@dashboard.main.tabStaffPerformance:Staff Performance`, icon: 'pi pi-users' },
    { id: 'compliance',        label: $localize`:@@dashboard.main.tabCompliance:Compliance`,              icon: 'pi pi-shield' },
  ];
}
