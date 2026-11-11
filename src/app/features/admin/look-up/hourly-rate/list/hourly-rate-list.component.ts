import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { HourlyRateComponent } from '../manage/hourly-rate.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { HourlyRateItem } from '../models/hourly-rate-list.model';
import type { HourlyRateEntry } from '../models/hourly-rate.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { HourlyRateModes, HourlyRateSortDirections, HourlyRateStatuses, HOURLY_RATE_PAGE_SIZE } from '../constants/hourly-rate.constants';

@Component({
  selector: 'app-hourly-rate-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, HourlyRateComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './hourly-rate-list.component.html',
  styleUrl: './hourly-rate-list.component.scss',
})
export class HourlyRateListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = HourlyRateModes.Add;
  editingItem: HourlyRateEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: HourlyRateItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = HOURLY_RATE_PAGE_SIZE;
  currentPage = 0;

  sortField: 'rate' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = HourlyRateSortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly perHourShortLabel = $localize`:@@admin.hourlyRate.perHourShort:/ hr`;

  hourlyRates: HourlyRateItem[] = [
    { id: 1,  rate: 110, createdOn: '2026-01-08', status: 'active' },
    { id: 2,  rate: 140, createdOn: '2026-01-10', status: 'active' },
    { id: 3,  rate: 175, createdOn: '2026-01-14', status: 'active' },
    { id: 4,  rate: 180, createdOn: '2026-01-18', status: 'active' },
    { id: 5,  rate: 195, createdOn: '2026-01-22', status: 'active' },
    { id: 6,  rate: 210, createdOn: '2026-02-03', status: 'active' },
    { id: 7,  rate: 220, createdOn: '2026-02-07', status: 'active' },
    { id: 8,  rate: 245, createdOn: '2026-02-12', status: 'active' },
    { id: 9,  rate: 265, createdOn: '2026-02-18', status: 'active' },
    { id: 10, rate: 290, createdOn: '2026-02-25', status: 'active' },
    { id: 11, rate: 350, createdOn: '2026-03-03', status: 'active' },
    { id: 12, rate: 400, createdOn: '2026-03-10', status: 'active' },
  ];

  statusLabel(status: 'active' | 'inactive'): string {
    return status === HourlyRateStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  isBlocked(id: number): boolean {
    return this.hourlyRates.find(r => r.id === id)?.status === HourlyRateStatuses.Inactive;
  }

  get filteredRates(): HourlyRateItem[] {
    const q = this.searchQuery.trim();
    const base = !q ? this.hourlyRates : this.hourlyRates.filter(r => String(r.rate).includes(q));
    if (!this.sortField) return base;
    const field = this.sortField;
    const dir = this.sortDir === HourlyRateSortDirections.Asc ? 1 : -1;
    return [...base].sort((a, b) => a[field] < b[field] ? -1 * dir : a[field] > b[field] ? 1 * dir : 0);
  }

  get pagedRates(): HourlyRateItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredRates.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'rate' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === HourlyRateSortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = HourlyRateSortDirections.Asc;
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
    this.dialogMode = HourlyRateModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewRate(item: HourlyRateItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editRate(item: HourlyRateItem): void {
    this.editingItem = { rate: item.rate, status: item.status };
    this.editingId = item.id;
    this.dialogMode = HourlyRateModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: HourlyRateItem): void { this.confirmTarget = { id: item.id, name: `$ ${item.rate} ${this.perHourShortLabel}` }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.hourlyRates = this.hourlyRates.map(r => r.id === id ? { ...r, status: r.status === HourlyRateStatuses.Active ? 'inactive' : 'active' } : r);
    this.closeConfirm();
  }

  onRatesSubmitted(entries: HourlyRateEntry[]): void {
    if (this.dialogMode === HourlyRateModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.hourlyRates = this.hourlyRates.map(r =>
        r.id === this.editingId ? { ...r, rate: updated.rate, status: updated.status } : r
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.hourlyRates.reduce((max, r) => Math.max(max, r.id), 0);
      const toAdd: HourlyRateItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, rate: e.rate, createdOn: today, status: e.status,
      }));
      this.hourlyRates = [...toAdd, ...this.hourlyRates];
    }
    this.showAddDialog = false;
    this.dialogMode = HourlyRateModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = HourlyRateModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
