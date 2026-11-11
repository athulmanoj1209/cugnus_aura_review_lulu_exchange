import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DepartmentTypeComponent } from '../manage/department-type.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { DepartmentTypeItem } from '../models/department-type-list.model';
import type { DepartmentTypeEntry } from '../models/department-type.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { DepartmentTypeModes, DepartmentTypeSortDirections, DepartmentTypeStatuses, DEPARTMENT_TYPE_PAGE_SIZE } from '../constants/department-type.constants';

@Component({
  selector: 'app-department-type-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, DepartmentTypeComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './department-type-list.component.html',
  styleUrl: './department-type-list.component.scss',
})
export class DepartmentTypeListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = DepartmentTypeModes.Add;
  editingItem: DepartmentTypeEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: DepartmentTypeItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = DEPARTMENT_TYPE_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = DepartmentTypeSortDirections.Asc;

  readonly newDepartmentTypeLabel = $localize`:@@admin.departmentType.newDepartmentType:+ New Department Type`;
  readonly viewLabel = $localize`:@@common.view:View`;
  readonly editLabel = $localize`:@@common.edit:Edit`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly detailsSubtitle = $localize`:@@admin.departmentType.details:Department Type Details`;

  departmentTypes: DepartmentTypeItem[] = [
    { id: 1,  name: 'Finance',                    description: 'Responsible for financial planning, budgeting, accounting, and reporting across the organization.',                                   createdOn: '2026-01-10', status: 'active' },
    { id: 2,  name: 'Human Resources',             description: 'Manages recruitment, employee relations, payroll, benefits administration, and organizational development.',                          createdOn: '2026-01-12', status: 'active' },
    { id: 3,  name: 'Information Technology',      description: 'Oversees technology infrastructure, software systems, cybersecurity, and digital transformation initiatives.',                        createdOn: '2026-01-15', status: 'active' },
    { id: 4,  name: 'Operations',                  description: 'Handles day-to-day business operations, process management, and service delivery across all functions.',                             createdOn: '2026-01-20', status: 'active' },
    { id: 5,  name: 'Legal & Compliance',          description: 'Ensures adherence to applicable laws, regulations, and internal policies while managing legal risk and contracts.',                  createdOn: '2026-02-01', status: 'active' },
    { id: 6,  name: 'Internal Audit',              description: 'Provides independent assurance on governance, risk management, and internal control effectiveness.',                                 createdOn: '2026-02-05', status: 'active' },
    { id: 7,  name: 'Risk Management',             description: 'Identifies, assesses, and monitors enterprise-wide risks to support informed decision-making and risk mitigation.',                  createdOn: '2026-02-10', status: 'active' },
    { id: 8,  name: 'Marketing & Communications',  description: 'Manages brand strategy, marketing campaigns, public relations, and internal and external communications.',                           createdOn: '2026-02-15', status: 'active' },
    { id: 9,  name: 'Procurement & Supply Chain',  description: 'Responsible for sourcing, vendor management, contract negotiation, and supply chain optimization.',                                 createdOn: '2026-02-20', status: 'active' },
    { id: 10, name: 'Customer Service',            description: 'Manages client relationships, handles inquiries and complaints, and ensures a high standard of customer satisfaction.',             createdOn: '2026-03-01', status: 'active' },
    { id: 11, name: 'Executive Management',        description: 'Senior leadership responsible for strategic direction, corporate governance, and overall organizational performance.',               createdOn: '2026-03-05', status: 'active' },
    { id: 12, name: 'Administration',              description: 'Provides administrative support services including office management, records management, and facilities coordination.',             createdOn: '2026-03-10', status: 'active' },
  ];

statusLabel(status: 'active' | 'inactive'): string {
  return status === DepartmentTypeStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
}

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.departmentTypes.find(d => d.id === id)?.status === DepartmentTypeStatuses.Inactive;
  }

  get filteredTypes(): DepartmentTypeItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    let list = !q ? this.departmentTypes : this.departmentTypes.filter(d => d.name.toLowerCase().includes(q));
    if (this.sortField) {
      const field = this.sortField;
      const dir = this.sortDir === DepartmentTypeSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * dir);
    }
    return list;
  }

  get pagedTypes(): DepartmentTypeItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredTypes.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === DepartmentTypeSortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = DepartmentTypeSortDirections.Asc;
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
    this.dialogMode = DepartmentTypeModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewType(item: DepartmentTypeItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editType(item: DepartmentTypeItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = DepartmentTypeModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: DepartmentTypeItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.departmentTypes = this.departmentTypes.map(d => d.id === id ? { ...d, status: d.status === DepartmentTypeStatuses.Active ? 'inactive' : 'active' } : d);
    this.closeConfirm();
  }

  onSubmitted(entries: DepartmentTypeEntry[]): void {
    if (this.dialogMode === DepartmentTypeModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.departmentTypes = this.departmentTypes.map(d =>
        d.id === this.editingId ? { ...d, name: updated.name, description: updated.description, status: updated.status } : d
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.departmentTypes.reduce((max, d) => Math.max(max, d.id), 0);
      const toAdd: DepartmentTypeItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.departmentTypes = [...toAdd, ...this.departmentTypes];
    }
    this.showAddDialog = false;
    this.dialogMode = DepartmentTypeModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = DepartmentTypeModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
