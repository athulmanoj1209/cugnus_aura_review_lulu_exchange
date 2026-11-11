import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { AuditModeComponent } from '../manage/audit-mode.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { AuditModeItem } from '../models/audit-mode-list.model';
import type { AuditModeEntry } from '../models/audit-mode.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { AuditModeModes, AuditModeSortDirections, AuditModeStatuses, AUDIT_MODE_PAGE_SIZE } from '../constants/audit-mode.constants';

@Component({
  selector: 'app-audit-mode-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, AuditModeComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './audit-mode-list.component.html',
  styleUrl: './audit-mode-list.component.scss',
})
export class AuditModeListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = AuditModeModes.Add;
  editingItem: AuditModeEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: AuditModeItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = AUDIT_MODE_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = AuditModeSortDirections.Asc;

  readonly newAuditModeLabel =
    $localize`:@@admin.auditMode.newAuditMode:+ New Audit Mode`;

  readonly viewLabel =
    $localize`:@@common.view:View`;

  readonly editLabel =
    $localize`:@@common.edit:Edit`;

  readonly activateLabel =
    $localize`:@@common.activate:Activate`;

  readonly deactivateLabel =
    $localize`:@@common.deactivate:Deactivate`;

  readonly detailsSubtitle =
    $localize`:@@admin.auditMode.details:Audit Mode Details`;

  auditModes: AuditModeItem[] = [
    { id: 1,  name: 'On-Site',          description: 'Auditors physically visit the auditees premises to review records, interview staff, and observe processes.',  createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'Remote',           description: 'Audit is conducted entirely off-site using digital tools, video conferencing, and secure document sharing.',   createdOn: '2026-01-12', status: 'active' },
    { id: 3,  name: 'Hybrid',           description: 'Combination of on-site visits and remote procedures, optimising coverage while reducing travel cost.',          createdOn: '2026-01-16', status: 'active' },
    { id: 4,  name: 'Desk Review',      description: 'Audit based solely on documentation submitted by the auditee, without any physical or virtual interaction.',   createdOn: '2026-01-20', status: 'active' },
    { id: 5,  name: 'Field Audit',      description: 'Inspection conducted at operational locations such as warehouses, branches, or project sites.',                 createdOn: '2026-01-25', status: 'active' },
    { id: 6,  name: 'Continuous',       description: 'Automated, real-time monitoring of transactions and controls integrated into business systems.',                createdOn: '2026-02-03', status: 'active' },
    { id: 7,  name: 'Joint Audit',      description: 'Audit executed collaboratively by internal and external auditors or multiple regulatory bodies simultaneously.', createdOn: '2026-02-08', status: 'active' },
    { id: 8,  name: 'Follow-up',        description: 'Post-audit engagement to verify that previously raised findings and recommendations have been resolved.',        createdOn: '2026-02-13', status: 'active' },
    { id: 9,  name: 'Flash Audit',      description: 'Short, unannounced audit focused on a narrow scope to quickly assess a specific risk or control.',              createdOn: '2026-02-18', status: 'active' },
    { id: 10, name: 'Thematic Audit',   description: 'Cross-departmental review targeting a single theme or risk area across the entire organisation.',               createdOn: '2026-02-25', status: 'active' },
    { id: 11, name: 'Self-Assessment',  description: 'Management-led review where the auditee evaluates its own controls using a structured audit methodology.',     createdOn: '2026-03-03', status: 'active' },
    { id: 12, name: 'Regulatory',       description: 'Audit mandated by an external regulatory authority to assess compliance with applicable laws and standards.',   createdOn: '2026-03-10', status: 'active' },
  ];

  statusLabel(status: 'active' | 'inactive'): string {
    return status === AuditModeStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.auditModes.find(m => m.id === id)?.status === AuditModeStatuses.Inactive;
  }

  get filteredModes(): AuditModeItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.auditModes;
    return this.auditModes.filter(m => m.name.toLowerCase().includes(q));
  }

  get pagedModes(): AuditModeItem[] {
    const field = this.sortField;
    const sorted = field
      ? [...this.filteredModes].sort((a, b) => {
          const dir = this.sortDir === AuditModeSortDirections.Asc ? 1 : -1;
          return a[field] > b[field] ? dir : a[field] < b[field] ? -dir : 0;
        })
      : this.filteredModes;
    const start = this.currentPage * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === AuditModeSortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = AuditModeSortDirections.Asc;
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
    this.dialogMode = AuditModeModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewMode(item: AuditModeItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editMode(item: AuditModeItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = AuditModeModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: AuditModeItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.auditModes = this.auditModes.map(m => m.id === id ? { ...m, status: m.status === AuditModeStatuses.Active ? 'inactive' : 'active' } : m);
    this.closeConfirm();
  }

  onModesSubmitted(entries: AuditModeEntry[]): void {
    if (this.dialogMode === AuditModeModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.auditModes = this.auditModes.map(m =>
        m.id === this.editingId ? { ...m, name: updated.name, description: updated.description, status: updated.status } : m
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.auditModes.reduce((max, m) => Math.max(max, m.id), 0);
      const toAdd: AuditModeItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.auditModes = [...toAdd, ...this.auditModes];
    }
    this.showAddDialog = false;
    this.dialogMode = AuditModeModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = AuditModeModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
