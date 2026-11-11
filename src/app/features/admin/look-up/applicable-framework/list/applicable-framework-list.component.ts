import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ApplicableFrameworkComponent } from '../manage/applicable-framework.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';
import type { ApplicableFrameworkItem } from '../models/applicable-framework-list.model';
import type { FrameworkEntry } from '../models/applicable-framework.model';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { ApplicableFrameworkModes, ApplicableFrameworkSortDirections, ApplicableFrameworkStatuses, APPLICABLE_FRAMEWORK_PAGE_SIZE } from '../constants/applicable-framework.constants';

@Component({
  selector: 'app-applicable-framework-list',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, ApplicableFrameworkComponent, LookupViewDialogComponent, ConfirmActionDialogComponent, PaginationBarComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './applicable-framework-list.component.html',
  styleUrl: './applicable-framework-list.component.scss',
})
export class ApplicableFrameworkListComponent {
  showAddDialog = false;
  dialogMode: 'add' | 'edit' = ApplicableFrameworkModes.Add;
  editingItem: FrameworkEntry | null = null;
  editingId: number | null = null;

  showViewDialog = false;
  viewingItem: ApplicableFrameworkItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  searchQuery = '';
  pageSize = APPLICABLE_FRAMEWORK_PAGE_SIZE;
  currentPage = 0;

  sortField: 'name' | 'createdOn' | null = null;
  sortDir: 'asc' | 'desc' = ApplicableFrameworkSortDirections.Asc;

  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly applicableFrameworkDetailsLabel = $localize`:@@admin.applicableFramework.details:Applicable Framework Details`;
  readonly activateActionLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateActionLabel = $localize`:@@common.deactivate:Deactivate`;

  frameworks: ApplicableFrameworkItem[] = [
    { id: 1,  name: 'ISO 31000:2018 – Risk Management',                   code: 'ISO-31000',    description: 'International standard providing principles, a framework and a process for managing risk in any type of organisation.',                                     version: '2018',         issuingAuthority: 'International Organization for Standardization', createdOn: '2026-01-08', status: 'active' },
    { id: 2,  name: 'ISO/IEC 27001:2022 – Information Security',           code: 'ISO-27001',    description: 'International standard specifying requirements for establishing, implementing, maintaining and continually improving an information security management system.', version: '2022',         issuingAuthority: 'International Organization for Standardization', createdOn: '2026-01-10', status: 'active' },
    { id: 3,  name: 'COSO Internal Control – Integrated Framework',        code: 'COSO-IC',      description: 'Provides a common definition of internal control and a framework for evaluating the effectiveness of internal control systems.',                             version: '2013',         issuingAuthority: 'Committee of Sponsoring Organizations of the Treadway Commission', createdOn: '2026-01-14', status: 'active' },
    { id: 4,  name: 'IIA International Professional Practices Framework',  code: 'IIA-IPPF',     description: 'The conceptual framework that organises authoritative guidance issued by the Institute of Internal Auditors.',                                                version: '2017',         issuingAuthority: 'Institute of Internal Auditors', createdOn: '2026-01-18', status: 'active' },
    { id: 5,  name: 'COBIT 2019 – Governance of Enterprise IT',            code: 'COBIT-2019',   description: 'A framework for the governance and management of enterprise information and technology, providing tools to bridge control requirements, technical issues and business risks.', version: '2019',         issuingAuthority: 'ISACA', createdOn: '2026-01-22', status: 'active' },
    { id: 6,  name: 'NIST Cybersecurity Framework',                        code: 'NIST-CSF',     description: 'Voluntary guidance based on existing standards, guidelines and practices for organisations to better manage and reduce cybersecurity risk.',                  version: '2.0',          issuingAuthority: 'National Institute of Standards and Technology', createdOn: '2026-02-03', status: 'active' },
    { id: 7,  name: 'Sarbanes-Oxley Act',                                  code: 'SOX',          description: 'U.S. federal law mandating certain practices in financial record keeping and reporting for corporations, with key internal control requirements under Section 404.', version: 'Section 404',  issuingAuthority: 'U.S. Congress', createdOn: '2026-02-07', status: 'active' },
    { id: 8,  name: 'Basel III – Banking Supervision Accord',              code: 'BASEL-III',    description: 'An international regulatory framework for banks, developed in response to the deficiencies in financial regulation revealed by the financial crisis of 2007–08.',  version: 'III',          issuingAuthority: 'Basel Committee on Banking Supervision', createdOn: '2026-02-12', status: 'active' },
    { id: 9,  name: 'GDPR – General Data Protection Regulation',           code: 'GDPR',         description: 'European Union regulation on data protection and privacy applicable to all entities processing personal data of EU residents, regardless of location.',           version: '2018',         issuingAuthority: 'European Parliament and Council of the EU', createdOn: '2026-02-18', status: 'active' },
    { id: 10, name: 'PCI DSS – Payment Card Industry Data Security',       code: 'PCI-DSS',      description: 'A set of security standards designed to ensure all companies that accept, process, store or transmit credit card information maintain a secure environment.',    version: '4.0',          issuingAuthority: 'PCI Security Standards Council', createdOn: '2026-02-25', status: 'active' },
    { id: 11, name: 'IFRS – International Financial Reporting Standards',  code: 'IFRS',         description: 'Accounting standards issued by the IASB that specify how transactions and other events should be reported in financial statements.',                           version: '2024 Edition', issuingAuthority: 'International Accounting Standards Board', createdOn: '2026-03-03', status: 'active' },
    { id: 12, name: 'US GAAP – Generally Accepted Accounting Principles',  code: 'US-GAAP',      description: 'The standard framework of guidelines for financial accounting used in the United States, established by the Financial Accounting Standards Board.',             version: '2024 Edition', issuingAuthority: 'Financial Accounting Standards Board', createdOn: '2026-03-10', status: 'active' },
  ];

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + '…' : (text || '');
  }

  isBlocked(id: number): boolean {
    return this.frameworks.find(f => f.id === id)?.status === ApplicableFrameworkStatuses.Inactive;
  }

  statusLabel(status: string): string {
    return status === ApplicableFrameworkStatuses.Active ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  get filteredFrameworks(): ApplicableFrameworkItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    let list = !q ? this.frameworks : this.frameworks.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.issuingAuthority.toLowerCase().includes(q)
    );
    if (this.sortField) {
      const field = this.sortField;
      const dir = this.sortDir === ApplicableFrameworkSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * dir);
    }
    return list;
  }

  get pagedFrameworks(): ApplicableFrameworkItem[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredFrameworks.slice(start, start + this.pageSize);
  }

  toggleSort(field: 'name' | 'createdOn'): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === ApplicableFrameworkSortDirections.Asc ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = ApplicableFrameworkSortDirections.Asc;
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
    this.dialogMode = ApplicableFrameworkModes.Add;
    this.editingItem = null;
    this.editingId = null;
    this.showAddDialog = true;
  }

  viewFramework(item: ApplicableFrameworkItem): void { this.viewingItem = item; this.showViewDialog = true; }

  editFramework(item: ApplicableFrameworkItem): void {
    this.editingItem = { name: item.name, code: item.code, description: item.description, version: item.version, issuingAuthority: item.issuingAuthority, status: item.status };
    this.editingId = item.id;
    this.dialogMode = ApplicableFrameworkModes.Edit;
    this.showAddDialog = true;
  }

  openConfirm(item: ApplicableFrameworkItem): void { this.confirmTarget = { id: item.id, name: item.name }; this.showConfirmDialog = true; }
  closeConfirm(): void { this.showConfirmDialog = false; this.confirmTarget = null; }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    const id = this.confirmTarget.id;
    this.frameworks = this.frameworks.map(f => f.id === id ? { ...f, status: f.status === ApplicableFrameworkStatuses.Active ? 'inactive' : 'active' } : f);
    this.closeConfirm();
  }

  onFrameworksSubmitted(entries: FrameworkEntry[]): void {
    if (this.dialogMode === ApplicableFrameworkModes.Edit && this.editingId !== null) {
      const u = entries[0];
      this.frameworks = this.frameworks.map(f =>
        f.id === this.editingId ? { ...f, name: u.name, code: u.code, description: u.description, version: u.version, issuingAuthority: u.issuingAuthority, status: u.status } : f
      );
      this.editingId = null;
    } else {
      const today = new Date().toISOString().split('T')[0];
      const maxId = this.frameworks.reduce((max, f) => Math.max(max, f.id), 0);
      const toAdd: ApplicableFrameworkItem[] = entries.map((e, i) => ({
        id: maxId + i + 1, name: e.name, code: e.code, description: e.description,
        version: e.version, issuingAuthority: e.issuingAuthority, createdOn: today, status: e.status,
      }));
      this.frameworks = [...toAdd, ...this.frameworks];
    }
    this.showAddDialog = false;
    this.dialogMode = ApplicableFrameworkModes.Add;
    this.editingItem = null;
  }

  onDialogCancelled(): void {
    this.showAddDialog = false;
    this.dialogMode = ApplicableFrameworkModes.Add;
    this.editingItem = null;
    this.editingId = null;
  }
}
