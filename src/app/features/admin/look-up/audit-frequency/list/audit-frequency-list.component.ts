import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { AuditFrequencyComponent } from '../manage/audit-frequency.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { AuditFrequencyItem } from '../models/audit-frequency-list.model';
import type { FrequencyEntry } from '../models/audit-frequency.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { AuditFrequencyModes, AuditFrequencySortDirections, AuditFrequencyStatuses, AUDIT_FREQUENCY_PAGE_SIZE } from '../constants/audit-frequency.constants';

@Component({
  selector: 'app-audit-frequency-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, AuditFrequencyComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './audit-frequency-list.component.html',
  styleUrl: './audit-frequency-list.component.scss',
})
export class AuditFrequencyListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = AuditFrequencyModes.Add;
  editingItem: FrequencyEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: AuditFrequencyItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = AUDIT_FREQUENCY_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = AuditFrequencySortDirections.Asc;

  readonly activeLabel = $localize`:@@common.active:Active`;
  readonly inactiveLabel = $localize`:@@common.inactive:Inactive`;
  readonly viewLabel = $localize`:@@common.view:View`;
  readonly editLabel = $localize`:@@common.edit:Edit`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly entityLabel = $localize`:@@admin.auditFrequency.entityLabel:audit frequencies`;
  readonly detailsSubtitle = $localize`:@@admin.auditFrequency.details:Audit Frequency Details`;

  auditFrequencies: AuditFrequencyItem[] = [
    { id: 1,  name: 'Daily',           description: 'Audit is performed every day, typically for high-risk or highly regulated operational activities.',           createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'Weekly',          description: 'Audit is conducted on a weekly basis to review short-cycle operational or financial transactions.',           createdOn: '2026-01-10', status: 'active' },
    { id: 3,  name: 'Bi-Weekly',       description: 'Audit performed every two weeks, balancing oversight needs with operational capacity.',                       createdOn: '2026-01-14', status: 'active' },
    { id: 4,  name: 'Monthly',         description: 'Standard monthly audit cycle covering recurring financial, compliance, or operational processes.',            createdOn: '2026-01-18', status: 'active' },
    { id: 5,  name: 'Quarterly',       description: 'Audit conducted every three months, aligned with financial reporting and management review cycles.',          createdOn: '2026-01-22', status: 'active' },
    { id: 6,  name: 'Semi-Annual',     description: 'Audit performed twice per year, providing mid-year and year-end assurance to stakeholders.',                  createdOn: '2026-02-05', status: 'active' },
    { id: 7,  name: 'Annual',          description: 'Yearly audit covering the full scope of operations, risk, and controls across the organisation.',             createdOn: '2026-02-10', status: 'active' },
    { id: 8,  name: 'Bi-Annual',       description: 'Audit scheduled every two years for lower-risk areas with stable control environments.',                     createdOn: '2026-02-15', status: 'active' },
    { id: 9,  name: 'Continuous',      description: 'Ongoing audit activity using automated monitoring tools to provide real-time assurance.',                    createdOn: '2026-02-20', status: 'active' },
    { id: 10, name: 'Ad-hoc',          description: 'Unscheduled audit triggered by a specific event, risk indicator, or management request.',                    createdOn: '2026-03-01', status: 'active' },
    { id: 11, name: 'Rolling',         description: 'Audit performed on a rotating basis across departments or processes throughout the year.',                    createdOn: '2026-03-06', status: 'active' },
    { id: 12, name: 'Project-Based',   description: 'Audit tied to the lifecycle of a specific project, initiative, or system implementation.',                   createdOn: '2026-03-12', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.auditFrequencies.find(f => f.id === id)?.status === AuditFrequencyStatuses.Inactive;
  }

  get filteredFrequencies(): AuditFrequencyItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.auditFrequencies;
    return this.auditFrequencies.filter(f => f.name.toLowerCase().includes(q));
  }

  get pagedFrequencies(): AuditFrequencyItem[] {
    const field = this.sortField;
    const sorted = field
      ? [...this.filteredFrequencies].sort((a, b) => {
          const dir = this.sortDir === AuditFrequencySortDirections.Asc ? 1 : -1;
          return a[field] > b[field] ? dir : a[field] < b[field] ? -dir : 0;
        })
      : this.filteredFrequencies;
    const start = this.currentPage * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === AuditFrequencySortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = AuditFrequencySortDirections.Asc;
    }
  }

  onSearch(): void {
    this.currentPage = 0;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onRowsChange(rows: number): void {
    this.pageSize = rows;
    this.currentPage = 0;
  }

  openAddDialog(): void {
    this.dialogMode = AuditFrequencyModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewFrequency(item: AuditFrequencyItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editFrequency(item: AuditFrequencyItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = AuditFrequencyModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: AuditFrequencyItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.auditFrequencies = this.auditFrequencies.map(f => f.id === id ? { ...f, status: f.status === AuditFrequencyStatuses.Active ? 'inactive' : 'active' } : f);
    this.closeConfirm();
  }

  onFrequenciesSubmitted(entries: FrequencyEntry[]): void {
    if (this.dialogMode === AuditFrequencyModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.auditFrequencies = this.auditFrequencies.map(f =>
        f.id === this.editingId ? { ...f, name: updated.name, description: updated.description, status: updated.status } : f
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.auditFrequencies.reduce((max, f) => Math.max(max, f.id), 0);
      const toAdd: AuditFrequencyItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.auditFrequencies = [...toAdd, ...this.auditFrequencies];
    }
    this.showAddDialog = false;
    this.dialogMode = AuditFrequencyModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = AuditFrequencyModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
