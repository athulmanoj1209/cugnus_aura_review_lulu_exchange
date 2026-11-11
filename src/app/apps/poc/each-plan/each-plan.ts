import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { AddAuditPlan } from "@/app/apps/poc/each-plan/add-audit-plan/add-audit-plan";
import { ScopeAuditPlanComponent } from '@/app/shared/components/scope-audit-plan/scope-audit-plan.component';
import { ScheduledScopeLists } from './scheduled-scope-lists/scheduled-scope-lists';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
 
export interface RiskItem {
  label: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
}
 
export interface ScopeItem {
  title: string;
  status: 'In Progress' | 'Completed' | 'Overdue' | 'Pending';
  progress: number;
}
 
export interface PlanDetail {
  label: string;
  value: string;
}

@Component({
  selector: 'app-each-plan',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ProgressBarModule,
    PaginatorModule,
    TooltipModule,
    DividerModule,
    AddAuditPlan,
    ScopeAuditPlanComponent,
    ScheduledScopeLists
  , DrawIconComponent],
  templateUrl: './each-plan.html',
  styleUrl: './each-plan.scss',
})
export class EachPlan {

   drawerVisible = false;
    searchQuery = '';
    activeTabIndex: number | undefined | string = 0;
   
    planObjective =
      'Comprehensive review of high-risk areas including finance, IT security, and compliance processes. Focus on control effectiveness and regulatory adherence.';
   
    planDetails: PlanDetail[] = [
      { label: 'Audit Frequency', value: 'Quarterly' },
      { label: 'Reporting Frequency', value: 'Monthly' },
      { label: 'Created', value: 'Dec 15, 2025' },
      { label: 'Last Updated', value: 'Jan 5, 2026' },
    ];
   
    riskItems: RiskItem[] = [
      { label: 'Financial reporting accuracy', level: 'High' },
      { label: 'Data breach vulnerability', level: 'Critical' },
      { label: 'Regulatory compliance gaps', level: 'High' },
      { label: 'Employee data privacy', level: 'Medium' },
      { label: 'Operational efficiency', level: 'Medium' },
    ];
   
    scopeItems: ScopeItem[] = [
      { title: 'Financial Controls Review Q1', status: 'In Progress', progress: 65 },
      { title: 'IT Security Assessment', status: 'In Progress', progress: 65 },
      { title: 'HR Compliance Check', status: 'Completed', progress: 100 },
      { title: 'Regulatory Compliance Audit', status: 'Overdue', progress: 40 },
    ];
  
    statCards: any[] = [
      {
        title: '1 overdue scope',
        value: '1',
        subtitle: 'Require immediate attention',
        icon: 'pi pi-exclamation-triangle',
        iconBg: '#fff3cd',
      },
      {
        title: 'Plan Period',
        value: 'Q1 2026',
        subtitle: 'Jan 1, 2026 – Mar 31, 2026',
        icon: 'pi pi-calendar',
        iconBg: '#e8f4fd',
      },
      {
        title: 'Total Scopes',
        value: '5',
        subtitle: '1 completed',
        icon: 'pi pi-list',
        iconBg: '#d4edda',
        badge: { label: '5', color: '#2ab57d' },
      },
      {
        title: 'Total Budget',
        value: '$145,000',
        subtitle: 'Approved budget',
        icon: 'pi pi-dollar',
        iconBg: '#e8f4fd',
      },
      {
        title: 'Departments',
        value: '5',
        subtitle: 'Departments in scope',
        icon: 'pi pi-sitemap',
        iconBg: '#f0e8fd',
      },
      {
        title: 'Completion',
        value: '60%',
        subtitle: 'Overall progress',
        icon: 'pi pi-chart-pie',
        iconBg: '#e8f4fd',
      },
    ];
   
    // Pagination
    totalRecords = 12;
    rows = 10;
    first = 0;
   
    tabs = ['Overview', 'Scopes', 'Schedule', 'Departments'];
   
    Math = Math;
   
    ngOnInit(): void {}
   
    getRiskSeverityClass(level: string): string {
      const map: Record<string, string> = {
        Critical: 'risk-critical',
        High: 'risk-high',
        Medium: 'risk-medium',
        Low: 'risk-low',
      };
      return map[level] ?? 'risk-low';
    }
   
    getStatusClass(status: string): string {
      const map: Record<string, string> = {
        'In Progress': 'status-in-progress',
        Completed: 'status-completed',
        Overdue: 'status-overdue',
        Pending: 'status-pending',
      };
      return map[status] ?? '';
    }
   
    getProgressColor(status: string): string {
      const map: Record<string, string> = {
        'In Progress': '#1f58c7',
        Completed: '#2ab57d',
        Overdue: '#d72424',
        Pending: '#ffc107',
      };
      return map[status] ?? '#1f58c7';
    }
   
    onPageChange(event: any): void {
      this.first = event.first;
      this.rows = event.rows;
    }
  
    onAddAuditPlan(): void {
      this.drawerVisible = true;
      console.log("drawer visible: ", this.drawerVisible);
    }
  
    visibilityChange(): void {
      this.drawerVisible = false;
    }
  
}
