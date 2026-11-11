import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RiskCategoryComponent } from '../manage/risk-category.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import type { CategoryEntry } from '../models/risk-category.model';
import type { RiskCategoryItem } from '../models/risk-category-list.model';

import { RiskCategoryModes, RiskCategorySortDirections, RiskCategoryStatuses, RISK_CATEGORY_PAGE_SIZE } from '../constants/risk-category.constants';

@Component({
  selector: 'app-risk-category-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, RiskCategoryComponent,ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './risk-category-list.component.html',
  styleUrl: './risk-category-list.component.scss',
})
export class RiskCategoryListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = RiskCategoryModes.Add;
  editingItem: CategoryEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: RiskCategoryItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = RISK_CATEGORY_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = RiskCategorySortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly noDescriptionLabel = $localize`:@@common.noDescriptionProvided:No description provided.`;

  statusLabel(status: string): string {
    return status === RiskCategoryStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  riskCategories: RiskCategoryItem[] = [
    { id: 1,  name: 'Financial Risk',             description: 'Risks arising from financial transactions, market exposure, credit, liquidity, and capital management.',                                  createdOn: '2026-01-06', status: 'active' },
    { id: 2,  name: 'Operational Risk',            description: 'Risks from inadequate or failed internal processes, human error, systems failures, or external events.',                                 createdOn: '2026-01-09', status: 'active' },
    { id: 3,  name: 'Compliance Risk',             description: 'Risks associated with violations of laws, regulations, codes of conduct, or organisational standards.',                                  createdOn: '2026-01-13', status: 'active' },
    { id: 4,  name: 'Strategic Risk',              description: 'Risks that affect the ability to achieve long-term business objectives and strategic goals.',                                            createdOn: '2026-01-17', status: 'active' },
    { id: 5,  name: 'Reputational Risk',           description: 'Risks that could damage the organisation\'s public image, stakeholder trust, or brand value.',                                          createdOn: '2026-01-21', status: 'active' },
    { id: 6,  name: 'Information Technology Risk', description: 'Risks related to IT infrastructure, cybersecurity, data integrity, and system availability.',                                           createdOn: '2026-01-28', status: 'active' },
    { id: 7,  name: 'Human Resources Risk',        description: 'Risks arising from workforce management, talent retention, misconduct, and labour relations.',                                           createdOn: '2026-02-04', status: 'active' },
    { id: 8,  name: 'Legal Risk',                  description: 'Risks from litigation, contractual disputes, intellectual property issues, and legal liability.',                                       createdOn: '2026-02-09', status: 'active' },
    { id: 9,  name: 'Environmental Risk',          description: 'Risks related to environmental impact, sustainability obligations, and regulatory environmental standards.',                             createdOn: '2026-02-14', status: 'active' },
    { id: 10, name: 'Market Risk',                 description: 'Risks from fluctuations in market prices, interest rates, exchange rates, and commodity prices.',                                       createdOn: '2026-02-20', status: 'active' },
    { id: 11, name: 'Credit Risk',                 description: 'Risks that a borrower or counterparty will fail to meet their financial obligations as agreed.',                                        createdOn: '2026-02-26', status: 'active' },
    { id: 12, name: 'Fraud Risk',                  description: 'Risks of intentional deception, misrepresentation, or misappropriation of assets by internal or external parties.',                    createdOn: '2026-03-04', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.riskCategories.find(c => c.id === id)?.status === RiskCategoryStatuses.Inactive;
  }

  get filteredCategories(): RiskCategoryItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.riskCategories;
    return this.riskCategories.filter(c => c.name.toLowerCase().includes(q));
  }

  get sortedCategories(): RiskCategoryItem[] {
    const list = [...this.filteredCategories];
    const field = this.sortField;
    if (!field) return list;
    return list.sort((a, b) => {
      const cmp = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortDir === RiskCategorySortDirections.Asc ? cmp : -cmp;
    });
  }

  get pagedCategories(): RiskCategoryItem[] {
    const start = this.currentPage * this.pageSize;
    return this.sortedCategories.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === RiskCategorySortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = RiskCategorySortDirections.Asc;
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
    this.dialogMode = RiskCategoryModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewCategory(item: RiskCategoryItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editCategory(item: RiskCategoryItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = RiskCategoryModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: RiskCategoryItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.riskCategories = this.riskCategories.map(c => c.id === id ? { ...c, status: c.status === RiskCategoryStatuses.Active ? 'inactive' : 'active' } : c);
    this.closeConfirm();
  }

  onCategoriesSubmitted(entries: CategoryEntry[]): void {
    if (this.dialogMode === RiskCategoryModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.riskCategories = this.riskCategories.map(c =>
        c.id === this.editingId ? { ...c, name: updated.name, description: updated.description, status: updated.status } : c
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.riskCategories.reduce((max, c) => Math.max(max, c.id), 0);
      const toAdd: RiskCategoryItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.riskCategories = [...toAdd, ...this.riskCategories];
    }
    this.showAddDialog = false;
    this.dialogMode = RiskCategoryModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = RiskCategoryModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
