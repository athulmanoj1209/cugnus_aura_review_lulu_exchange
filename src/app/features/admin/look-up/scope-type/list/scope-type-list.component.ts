import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ScopeTypeComponent } from '../manage/scope-type.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { ScopeTypeItem } from '../models/scope-type-list.model';
import type { ScopeTypeEntry } from '../models/scope-type.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { ScopeTypeModes, ScopeTypeSortDirections, ScopeTypeStatuses, SCOPE_TYPE_PAGE_SIZE } from '../constants/scope-type.constants';

@Component({
  selector: 'app-scope-type-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, ScopeTypeComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './scope-type-list.component.html',
  styleUrl: './scope-type-list.component.scss',
})
export class ScopeTypeListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = ScopeTypeModes.Add;
  editingItem: ScopeTypeEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: ScopeTypeItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = SCOPE_TYPE_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = ScopeTypeSortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  statusLabel(status: string): string {
    return status === ScopeTypeStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  scopeTypes: ScopeTypeItem[] = [
    { id: 1,  name: 'Full Scope',          description: 'Audit covers all processes, systems, and controls within the defined entity or function.',                     createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'Limited Scope',       description: 'Audit is restricted to specific areas, transactions, or time periods as agreed with management.',              createdOn: '2026-01-12', status: 'active' },
    { id: 3,  name: 'Entity-Wide',         description: 'Review spans the entire organisation, assessing governance, strategy, and enterprise-level risk management.',  createdOn: '2026-01-16', status: 'active' },
    { id: 4,  name: 'Process-Level',       description: 'Audit focuses on a single end-to-end business process such as procure-to-pay or order-to-cash.',               createdOn: '2026-01-20', status: 'active' },
    { id: 5,  name: 'System-Level',        description: 'Review targets a specific IT system, application, or technology infrastructure component.',                    createdOn: '2026-01-25', status: 'active' },
    { id: 6,  name: 'Departmental',        description: 'Audit is scoped to one department, business unit, or organisational function.',                                createdOn: '2026-02-03', status: 'active' },
    { id: 7,  name: 'Project-Specific',    description: 'Scope is limited to a defined project, capital investment, or programme initiative.',                          createdOn: '2026-02-08', status: 'active' },
    { id: 8,  name: 'Compliance',          description: 'Audit verifies adherence to specific laws, regulations, policies, or contractual obligations.',                createdOn: '2026-02-13', status: 'active' },
    { id: 9,  name: 'Thematic',            description: 'Cross-cutting review of a single theme or risk (e.g. data privacy) across multiple departments.',              createdOn: '2026-02-18', status: 'active' },
    { id: 10, name: 'Preliminary',         description: 'Initial scoping review conducted before the main audit to identify key risk areas and resource requirements.',  createdOn: '2026-02-25', status: 'active' },
    { id: 11, name: 'Follow-up',           description: 'Scope limited to validating management remediation actions arising from a prior audit engagement.',             createdOn: '2026-03-03', status: 'active' },
    { id: 12, name: 'Regulatory',          description: 'Scope determined by an external regulatory authority specifying mandatory areas for examination.',              createdOn: '2026-03-10', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.scopeTypes.find(s => s.id === id)?.status === ScopeTypeStatuses.Inactive;
  }

  get filteredScopeTypes(): ScopeTypeItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.scopeTypes;
    return this.scopeTypes.filter(s => s.name.toLowerCase().includes(q));
  }

  get pagedScopeTypes(): ScopeTypeItem[] {
    const field = this.sortField;
    const sorted = field
      ? [...this.filteredScopeTypes].sort((a, b) => {
          const dir = this.sortDir === ScopeTypeSortDirections.Asc ? 1 : -1;
          return a[field] > b[field] ? dir : a[field] < b[field] ? -dir : 0;
        })
      : this.filteredScopeTypes;
    const start = this.currentPage * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === ScopeTypeSortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = ScopeTypeSortDirections.Asc;
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
    this.dialogMode = ScopeTypeModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewScopeType(item: ScopeTypeItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editScopeType(item: ScopeTypeItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = ScopeTypeModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: ScopeTypeItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.scopeTypes = this.scopeTypes.map(s => s.id === id ? { ...s, status: s.status === ScopeTypeStatuses.Active ? 'inactive' : 'active' } : s);
    this.closeConfirm();
  }

  onScopeTypesSubmitted(entries: ScopeTypeEntry[]): void {
    if (this.dialogMode === ScopeTypeModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.scopeTypes = this.scopeTypes.map(s =>
        s.id === this.editingId ? { ...s, name: updated.name, description: updated.description, status: updated.status } : s
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.scopeTypes.reduce((max, s) => Math.max(max, s.id), 0);
      const toAdd: ScopeTypeItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.scopeTypes = [...toAdd, ...this.scopeTypes];
    }
    this.showAddDialog = false;
    this.dialogMode = ScopeTypeModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = ScopeTypeModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
