import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { RiskRatingComponent } from '../manage/risk-rating.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { RiskRatingItem } from '../models/risk-rating-list.model';
import type { RatingEntry } from '../models/risk-rating.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { RiskRatingModes, RiskRatingSortDirections, RiskRatingStatuses, RISK_RATING_PAGE_SIZE } from '../constants/risk-rating.constants';

@Component({
  selector: 'app-risk-rating-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, RiskRatingComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './risk-rating-list.component.html',
  styleUrl: './risk-rating-list.component.scss',
})
export class RiskRatingListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = RiskRatingModes.Add;
  editingItem: RatingEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: RiskRatingItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = RISK_RATING_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = RiskRatingSortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  statusLabel(status: string): string {
    return status === RiskRatingStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  riskRatings: RiskRatingItem[] = [
    { id: 1,  name: 'Critical',        description: 'Represents the highest level of risk requiring immediate action and escalation to senior management.',    createdOn: '2026-01-10', status: 'active' },
    { id: 2,  name: 'High',            description: 'Significant risk that requires prompt attention and mitigation plans within 30 days.',                     createdOn: '2026-01-12', status: 'active' },
    { id: 3,  name: 'Medium-High',     description: 'Elevated risk that needs to be addressed within the quarter with documented action plans.',                 createdOn: '2026-01-15', status: 'active' },
    { id: 4,  name: 'Medium',          description: 'Moderate risk level that should be monitored and mitigated within the audit cycle.',                        createdOn: '2026-01-20', status: 'active' },
    { id: 5,  name: 'Medium-Low',      description: 'Below average risk that can be managed through standard control procedures.',                               createdOn: '2026-02-01', status: 'active' },
    { id: 6,  name: 'Low',             description: 'Minor risk with minimal impact that can be addressed through routine monitoring.',                           createdOn: '2026-02-05', status: 'active' },
    { id: 7,  name: 'Negligible',      description: 'Insignificant risk level with no material impact on business operations.',                                  createdOn: '2026-02-10', status: 'active' },
    { id: 8,  name: 'Inherent Risk',   description: 'Risk existing before any controls or mitigating actions are applied to the process.',                       createdOn: '2026-02-15', status: 'active' },
    { id: 9,  name: 'Residual Risk',   description: 'Remaining risk after all existing controls and mitigation measures have been applied.',                      createdOn: '2026-02-20', status: 'active' },
    { id: 10, name: 'Control Risk',    description: 'Risk that arises from the possibility that internal controls may fail to detect or prevent errors.',         createdOn: '2026-03-01', status: 'active' },
    { id: 11, name: 'Compliance Risk', description: 'Risk of legal or regulatory sanctions resulting from failure to comply with laws and regulations.',          createdOn: '2026-03-05', status: 'active' },
    { id: 12, name: 'Operational Risk',description: 'Risk of loss resulting from inadequate or failed internal processes, people, and systems.',                 createdOn: '2026-03-10', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.riskRatings.find(r => r.id === id)?.status === RiskRatingStatuses.Inactive;
  }

  get filteredRatings(): RiskRatingItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    let result = !q ? this.riskRatings : this.riskRatings.filter(r => r.name.toLowerCase().includes(q));
    if (this.sortField) {
      const field = this.sortField;
      const dir = this.sortDir === RiskRatingSortDirections.Asc ? 1 : -1;
      result = [...result].sort((a, b) => a[field].localeCompare(b[field]) * dir);
    }
    return result;
  }

  get pagedRatings(): RiskRatingItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredRatings.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === RiskRatingSortDirections.Asc ? RiskRatingSortDirections.Desc : RiskRatingSortDirections.Asc;
    } else {
      this.sortField = field;
      this.sortDir = RiskRatingSortDirections.Asc;
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
    this.dialogMode = RiskRatingModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewRating(item: RiskRatingItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editRating(item: RiskRatingItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = RiskRatingModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: RiskRatingItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.riskRatings = this.riskRatings.map(r => r.id === id ? { ...r, status: r.status === RiskRatingStatuses.Active ? RiskRatingStatuses.Inactive : RiskRatingStatuses.Active } : r);
    this.closeConfirm();
  }

  onRatingsSubmitted(entries: RatingEntry[]): void {
    if (this.dialogMode === RiskRatingModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.riskRatings = this.riskRatings.map(r =>
        r.id === this.editingId ? { ...r, name: updated.name, description: updated.description, status: updated.status } : r
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.riskRatings.reduce((max, r) => Math.max(max, r.id), 0);
      const toAdd: RiskRatingItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.riskRatings = [...toAdd, ...this.riskRatings];
    }
    this.showAddDialog = false;
    this.dialogMode = RiskRatingModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = RiskRatingModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
