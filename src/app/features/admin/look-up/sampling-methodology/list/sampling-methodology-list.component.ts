import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SamplingMethodologyComponent } from '../manage/sampling-methodology.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { SamplingMethodologyItem } from '../models/sampling-methodology-list.model';
import type { SamplingMethodologyEntry } from '../models/sampling-methodology.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { SamplingMethodologyModes, SamplingMethodologySortDirections, SamplingMethodologyStatuses, SAMPLING_METHODOLOGY_PAGE_SIZE } from '../constants/sampling-methodology.constants';

@Component({
  selector: 'app-sampling-methodology-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, SamplingMethodologyComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './sampling-methodology-list.component.html',
  styleUrl: './sampling-methodology-list.component.scss',
})
export class SamplingMethodologyListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = SamplingMethodologyModes.Add;
  editingItem: SamplingMethodologyEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: SamplingMethodologyItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = SAMPLING_METHODOLOGY_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = SamplingMethodologySortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  statusLabel(status: string): string {
    return status === SamplingMethodologyStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  samplingMethodologies: SamplingMethodologyItem[] = [
    { id: 1,  name: 'Random Sampling',        description: 'Every item in the population has an equal chance of selection, ensuring an unbiased representative sample.',      createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'Systematic Sampling',    description: 'Items are selected at fixed intervals from an ordered list, providing structured coverage of the population.',    createdOn: '2026-01-12', status: 'active' },
    { id: 3,  name: 'Stratified Sampling',    description: 'Population is divided into subgroups and samples are drawn from each stratum to ensure proportional representation.', createdOn: '2026-01-16', status: 'active' },
    { id: 4,  name: 'Judgmental Sampling',    description: 'Auditor selects specific items based on professional judgement, focusing on high-risk or high-value transactions.',  createdOn: '2026-01-20', status: 'active' },
    { id: 5,  name: 'Monetary Unit Sampling', description: 'Selection probability is proportional to the monetary value of each item, emphasising larger transactions.',        createdOn: '2026-01-25', status: 'active' },
    { id: 6,  name: 'Cluster Sampling',       description: 'Population is divided into clusters and entire clusters are randomly selected for examination.',                     createdOn: '2026-02-03', status: 'active' },
    { id: 7,  name: 'Block Sampling',         description: 'A contiguous block of items (e.g., consecutive transactions) is selected for detailed testing.',                    createdOn: '2026-02-08', status: 'active' },
    { id: 8,  name: 'Haphazard Sampling',     description: 'Items are selected without a structured approach, approximating random selection without formal methodology.',       createdOn: '2026-02-13', status: 'active' },
    { id: 9,  name: 'Attribute Sampling',     description: 'Used to estimate the rate of occurrence of specific characteristics or control deviations within a population.',    createdOn: '2026-02-18', status: 'active' },
    { id: 10, name: 'Variable Sampling',      description: 'Statistical method used to estimate the total value or amount of a population based on a measured sample.',         createdOn: '2026-02-25', status: 'active' },
    { id: 11, name: 'Discovery Sampling',     description: 'Designed to detect at least one occurrence of a critical error or irregularity within the population.',             createdOn: '2026-03-03', status: 'active' },
    { id: 12, name: 'Stop-or-Go Sampling',    description: 'Sequential sampling technique that stops testing early if sufficient evidence of control effectiveness is found.',   createdOn: '2026-03-10', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.samplingMethodologies.find(s => s.id === id)?.status === SamplingMethodologyStatuses.Inactive;
  }

  get filteredMethodologies(): SamplingMethodologyItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    const base = !q ? this.samplingMethodologies : this.samplingMethodologies.filter(s => s.name.toLowerCase().includes(q));
    if (!this.sortField) return base;
    const field = this.sortField;
    const dir = this.sortDir === SamplingMethodologySortDirections.Asc ? 1 : -1;
    return [...base].sort((a, b) => a[field] < b[field] ? -1 * dir : a[field] > b[field] ? 1 * dir : 0);
  }

  get pagedMethodologies(): SamplingMethodologyItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredMethodologies.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === SamplingMethodologySortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = SamplingMethodologySortDirections.Asc;
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
    this.dialogMode = SamplingMethodologyModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewMethodology(item: SamplingMethodologyItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editMethodology(item: SamplingMethodologyItem): void {
    this.editingItem = { name: item.name, description: item.description, status: item.status };
    this.editingId = item.id;
    this.dialogMode = SamplingMethodologyModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: SamplingMethodologyItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.samplingMethodologies = this.samplingMethodologies.map(s => s.id === id ? { ...s, status: s.status === SamplingMethodologyStatuses.Active ? 'inactive' : 'active' } : s);
    this.closeConfirm();
  }

  onMethodologiesSubmitted(entries: SamplingMethodologyEntry[]): void {
    if (this.dialogMode === SamplingMethodologyModes.Edit && this.editingId !== null) {
      const updated = entries[0];
      this.samplingMethodologies = this.samplingMethodologies.map(s =>
        s.id === this.editingId ? { ...s, name: updated.name, description: updated.description, status: updated.status } : s
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.samplingMethodologies.reduce((max, s) => Math.max(max, s.id), 0);
      const toAdd: SamplingMethodologyItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, description: e.description, createdOn: today, status: e.status,
      }));
      this.samplingMethodologies = [...toAdd, ...this.samplingMethodologies];
    }
    this.showAddDialog = false;
    this.dialogMode = SamplingMethodologyModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = SamplingMethodologyModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
