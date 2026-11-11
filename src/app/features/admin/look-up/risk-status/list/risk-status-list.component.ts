import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RiskStatusComponent } from '../manage/risk-status.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { RiskStatusItem } from '../models/risk-status-list.model';
import type { StatusEntry } from '../models/risk-status.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { RiskStatusModes, RiskStatusSortDirections, RiskStatusStatuses, RISK_STATUS_PAGE_SIZE } from '../constants/risk-status.constants';

@Component({
  selector: 'app-risk-status-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, RiskStatusComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './risk-status-list.component.html',
  styleUrl: './risk-status-list.component.scss',
})
export class RiskStatusListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = RiskStatusModes.Add;
  editingItem: StatusEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: RiskStatusItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = RISK_STATUS_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = RiskStatusSortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  statusLabel(status: string): string {
    return status === RiskStatusStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  riskStatuses: RiskStatusItem[] = [
    { id: 1,  name: 'Open',            description: 'Risk has been identified and logged but no mitigation action has been taken yet.',                                    createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'In Progress',     description: 'Mitigation or remediation actions are actively being implemented for this risk.',                                     createdOn: '2026-01-10', status: 'active' },
    { id: 3,  name: 'Mitigated',       description: 'Controls have been applied and the risk has been reduced to an acceptable level.',                                    createdOn: '2026-01-14', status: 'active' },
    { id: 4,  name: 'Accepted',        description: 'Risk has been formally accepted by management with documented justification.',                                        createdOn: '2026-01-18', status: 'active' },
    { id: 5,  name: 'Closed',          description: 'Risk is no longer active and has been fully resolved or is no longer applicable.',                                   createdOn: '2026-01-22', status: 'active' },
    { id: 6,  name: 'Escalated',       description: 'Risk has been escalated to senior management or the audit committee for review.',                                     createdOn: '2026-02-03', status: 'active' },
    { id: 7,  name: 'Deferred',        description: 'Mitigation action has been postponed to a future period with documented approval.',                                   createdOn: '2026-02-07', status: 'active' },
    { id: 8,  name: 'Under Review',    description: 'Risk is currently being assessed or re-evaluated by the audit team.',                                                createdOn: '2026-02-12', status: 'active' },
    { id: 9,  name: 'Pending Approval',description: 'Proposed mitigation plan is awaiting formal sign-off from the relevant authority.',                                   createdOn: '2026-02-18', status: 'active' },
    { id: 10, name: 'Overdue',         description: 'Remediation deadline has passed without completion of the required action.',                                          createdOn: '2026-02-25', status: 'active' },
    { id: 11, name: 'Transferred',     description: 'Risk has been transferred to a third party such as an insurer or outsourcing partner.',                               createdOn: '2026-03-02', status: 'active' },
    { id: 12, name: 'Monitored',       description: 'Risk is within acceptable limits and is being tracked through regular monitoring activities.',                        createdOn: '2026-03-08', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.riskStatuses.find(s => s.id === id)?.status === RiskStatusStatuses.Inactive;
  }

  get filteredStatuses(): RiskStatusItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    let result = !q ? this.riskStatuses : this.riskStatuses.filter(s => s.name.toLowerCase().includes(q));
    if (this.sortField) {
      const field = this.sortField;
      const dir = this.sortDir === RiskStatusSortDirections.Asc ? 1 : -1;
      result = [...result].sort((a, b) => a[field].localeCompare(b[field]) * dir);
    }
    return result;
  }

  get pagedStatuses(): RiskStatusItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredStatuses.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === RiskStatusSortDirections.Asc ? RiskStatusSortDirections.Desc : RiskStatusSortDirections.Asc;
    } else {
      this.sortField = field;
      this.sortDir = RiskStatusSortDirections.Asc;
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
    this.dialogMode = RiskStatusModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewStatus(item: RiskStatusItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editStatus(item: RiskStatusItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = RiskStatusModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: RiskStatusItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.riskStatuses = this.riskStatuses.map(s => s.id === id ? { ...s, status: s.status === RiskStatusStatuses.Active ? RiskStatusStatuses.Inactive : RiskStatusStatuses.Active } : s);
    this.closeConfirm();
  }

  onStatusesSubmitted(entries: StatusEntry[]): void {
    if (this.dialogMode === RiskStatusModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.riskStatuses = this.riskStatuses.map(s =>
        s.id === this.editingId ? { ...s, name: updated.name, description: updated.description, status: updated.status } : s
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.riskStatuses.reduce((max, s) => Math.max(max, s.id), 0);
      const toAdd: RiskStatusItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.riskStatuses = [...toAdd, ...this.riskStatuses];
    }
    this.showAddDialog = false;
    this.dialogMode = RiskStatusModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = RiskStatusModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
