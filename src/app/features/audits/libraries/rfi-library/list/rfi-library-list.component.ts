import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { FilterModalComponent } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';

import { RfiLibraryComponent } from '@/app/features/audits/libraries/rfi-library/manage/rfi-library.component';
import { RfiLibraryProfileComponent } from '@/app/features/audits/libraries/rfi-library/profile/rfi-library-profile.component';
import type { RfiLibraryDrawerData, RfiLibraryDrawerResult, RfiLibraryProfileDrawerData } from '../models/rfi-library.model';
import type { RfiLibraryItem } from '../models/rfi-library-list.model';
import { MOCK_SCOPE_LIBRARY } from '@/app/features/audits/libraries/scope-library/scope-library-static-data';
import type { ScopeLibraryItem } from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { divisionAllowsSubDivisions, noSubDivisionMessage } from '@/app/shared/utils/no-sub-division-message';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { MOCK_RFI_LIBRARY, upsertRfiLibraryItem, editRfiLibraryItem } from '../rfi-library-static-data';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  RFI_LIBRARY_DESCRIPTION_TRUNCATE,
  RFI_LIBRARY_DRAWER,
  RFI_LIBRARY_PAGE_SIZE,
  RfiLibraryDrawerModes,
  RfiLibraryViewModes,
  type RfiLibraryViewMode,
} from '../constants/rfi-library.constants';
import {
  RFI_LIBRARY_PRIORITY_SEVERITY,
  RFI_LIBRARY_STATUS_LABELS,
  RFI_LIBRARY_STATUS_SEVERITY,
} from '../constants/rfi-library-labels.constants';

@Component({
  selector: 'app-rfi-library-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    ConfirmActionDialogComponent,
    FilterModalComponent,
    PaginationBarComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './rfi-library-list.component.html',
  styleUrl: './rfi-library-list.component.scss',
})
export class RfiLibraryListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  /* ── View mode ─── */
  readonly RfiLibraryViewModes = RfiLibraryViewModes;
  readonly DESCRIPTION_TRUNCATE = RFI_LIBRARY_DESCRIPTION_TRUNCATE;

  viewMode: RfiLibraryViewMode = RfiLibraryViewModes.Grid;

  /* ── Filter / page state ─── */
  searchQuery = '';
  selectedCompanies: string[] = [];
  selectedDivisions: string[] = [];
  selectedSubDivisions: string[] = [];
  selectedScopes: string[] = [];
  selectedSubScopes: string[] = [];
  currentPage = 0;
  PAGE_SIZE = RFI_LIBRARY_PAGE_SIZE;

  get companyOptions() {
    return this.companyDataService.all
      .filter(c => !c.blocked)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  /** The REAL division list (division-static-data.ts) — not this file's own
   *  company/division array — so a division added via divisions.ts's Add Division
   *  flow appears here immediately. Excludes deactivated divisions (own
   *  status inactive, or parent company blocked). */
  get divisionOptions() {
    const seen = new Set<string>();
    return DIVISION_STATIC_COMPANIES
      .filter(c => !this.companyDataService.isCompanyBlocked(c.id))
      .flatMap(c => c.divisions)
      .filter(b => b.status === DivisionStatuses.Active)
      .filter(b => {
        if (seen.has(b.divisionCode)) return false;
        seen.add(b.divisionCode);
        return true;
      })
      .map(b => ({ label: b.divisionName, value: b.divisionCode }));
  }

  /** The REAL sub-division list (sub-division-static-data.ts). Excludes
   *  deactivated sub-divisions (own status only). */
  get subDivisionOptions() {
    const seen = new Set<string>();
    const opts: { label: string; value: string }[] = [];
    for (const c of SUB_DIVISION_STATIC_COMPANIES) {
      for (const b of c.divisions) {
        if (!divisionAllowsSubDivisions(b.divisionCode, c.id)) continue;
        for (const d of b.subDivisions) {
          if (d.status !== SubDivisionStatuses.Active) continue;
          if (!seen.has(d.subDivisionName)) {
            seen.add(d.subDivisionName);
            opts.push({ label: d.subDivisionName, value: d.subDivisionName });
          }
        }
      }
    }
    return opts;
  }

  /** Set when the selected divisions have no sub-divisions — disables the Sub-Division filter. */
  get subDivisionDisabledMessage(): string | null {
    return noSubDivisionMessage(this.selectedDivisions);
  }

  onCompaniesChange(companies: string[]): void {
    this.selectedCompanies = companies;
    this.selectedScopes = [];
    this.selectedSubScopes = [];
    this.applyFilters();
  }

  onDivisionsChange(divisions: string[]): void {
    this.selectedDivisions = divisions;
    if (this.subDivisionDisabledMessage) this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.selectedSubScopes = [];
    this.applyFilters();
  }

  onSubDivisionsChange(subDivisions: string[]): void {
    this.selectedSubDivisions = subDivisions;
    this.selectedScopes = [];
    this.selectedSubScopes = [];
    this.applyFilters();
  }

  onScopesChange(scopes: string[]): void {
    this.selectedScopes = scopes;
    this.selectedSubScopes = [];
    this.applyFilters();
  }

  /** True when an item sits under the selected company / division / sub-division.
   *  Division-level items (no sub-division) never match a sub-division selection, and
   *  items under a sub-division of a division that has no sub-divisions (leftover seed
   *  records) never match at all. */
  private matchesOrgSelection(item: { company: string; division: string; subDivision: string }): boolean {
    if (item.subDivision && !divisionAllowsSubDivisions(item.division, item.company)) return false;
    if (this.selectedCompanies.length && !this.selectedCompanies.includes(item.company)) return false;
    if (this.selectedDivisions.length && !this.selectedDivisions.includes(item.division)) return false;
    if (this.selectedSubDivisions.length && !(item.subDivision && this.selectedSubDivisions.includes(item.subDivision))) return false;
    return true;
  }

  /** Library scopes narrowed by the org selection: selected sub-divisions' scopes; else
   *  every scope (division-level + sub-division) under the selected divisions; else the
   *  selected companies' scopes; else all. */
  get scopeOptions() {
    const seen = new Set<string>();
    return this.availableScopes
      .filter(s => s.scopeLevel === ScopeLevels.Scope && this.matchesOrgSelection(s))
      .filter(s => !seen.has(s.title) && !!seen.add(s.title))
      .map(s => ({ label: s.title, value: s.title }));
  }

  /** Sub-scopes under the listed scopes (or under the selected scopes, when any). */
  get subScopeOptions() {
    const parents = this.selectedScopes.length
      ? this.selectedScopes
      : this.scopeOptions.map(o => o.value);
    const seen = new Set<string>();
    return this.availableScopes
      .filter(s => s.scopeLevel === ScopeLevels.SubScope && this.matchesOrgSelection(s))
      .filter(s => !!s.parentScopeTitle && parents.includes(s.parentScopeTitle))
      .filter(s => !seen.has(s.title) && !!seen.add(s.title))
      .map(s => ({ label: s.title, value: s.title }));
  }

  /* ── Data ─── */
  get rfiLibraryItems(): RfiLibraryItem[] {
    return [...MOCK_RFI_LIBRARY].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }
  availableScopes: ScopeLibraryItem[] = [...MOCK_SCOPE_LIBRARY];
  filteredItems: RfiLibraryItem[] = [];
  pagedItems: RfiLibraryItem[] = [];

  readonly prioritySeverity = RFI_LIBRARY_PRIORITY_SEVERITY;

  readonly rfiLibraryStatusSeverity = RFI_LIBRARY_STATUS_SEVERITY;

  readonly rfiLibraryStatusLabel = RFI_LIBRARY_STATUS_LABELS;

  ngOnInit(): void {
    this.applyFilters();
  }

  /* ── View ─── */
  setViewMode(mode: RfiLibraryViewMode): void {
    this.viewMode = mode;
  }

  /* ── Actions ─── */
  async onAddRfi(): Promise<void> {
    const ref = this.drawer.open(RfiLibraryComponent, {
      width: RFI_LIBRARY_DRAWER.FormWidth,
      styleClass: RFI_LIBRARY_DRAWER.StyleClass,
      data: { mode: RfiLibraryDrawerModes.Add, allScopes: this.availableScopes } as RfiLibraryDrawerData,
    });
    const result = await ref.afterClosed as RfiLibraryDrawerResult | undefined;
    if (result?.saved) {
      upsertRfiLibraryItem(result.saved);
      this.applyFilters();
    }
  }

  viewRfi(item: RfiLibraryItem): void {
    this.drawer.open(RfiLibraryProfileComponent, {
      width: RFI_LIBRARY_DRAWER.ProfileWidth,
      styleClass: RFI_LIBRARY_DRAWER.StyleClass,
      data: { rfiItem: item } as RfiLibraryProfileDrawerData,
    });
  }

  async editRfi(item: RfiLibraryItem): Promise<void> {
    const ref = this.drawer.open(RfiLibraryComponent, {
      width: RFI_LIBRARY_DRAWER.FormWidth,
      styleClass: RFI_LIBRARY_DRAWER.StyleClass,
      data: { mode: RfiLibraryDrawerModes.Edit, rfiItem: item, allScopes: this.availableScopes } as RfiLibraryDrawerData,
    });
    const result = await ref.afterClosed as RfiLibraryDrawerResult | undefined;
    if (result?.saved) {
      editRfiLibraryItem(result.saved.id, result.saved);
      this.applyFilters();
    }
  }

  /* ── Deactivate / activate ──────────────────────────────────────────────── */
  blockedIds = new Set<string>();
  showConfirmDialog = false;
  confirmTarget: { id: string; name: string } | null = null;

  isBlocked(id: string): boolean {
    return this.blockedIds.has(id);
  }

  openConfirm(id: string, name: string): void {
    this.confirmTarget = { id, name };
    this.showConfirmDialog = true;
  }

  closeConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmTarget = null;
  }

  confirmToggle(): void {
    if (!this.confirmTarget) return;
    if (this.blockedIds.has(this.confirmTarget.id)) {
      this.blockedIds.delete(this.confirmTarget.id);
    } else {
      this.blockedIds.add(this.confirmTarget.id);
    }
    this.closeConfirm();
  }

  /* ── Filters / pagination ─── */
  onSearch(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }

  onRowsChange(rows: number): void {
    this.PAGE_SIZE = rows;
    this.currentPage = 0;
    this.updatePage();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredItems = this.rfiLibraryItems.filter(item => {
      if (q &&
        !item.title.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q) &&
        !item.tags.some(t => t.toLowerCase().includes(q))) return false;
      if (!this.matchesOrgSelection(item)) return false;
      // Skip division-level items under a division that has sub-divisions — unless the
      // item was explicitly added at division level (`hasSubDivision: false`).
      if (!item.subDivision && divisionAllowsSubDivisions(item.division, item.company) && item.hasSubDivision !== false) return false;
      if (this.selectedScopes.length && !(item.scopeTitle && this.selectedScopes.includes(item.scopeTitle))) return false;
      if (this.selectedSubScopes.length && !(item.subScopeTitle && this.selectedSubScopes.includes(item.subScopeTitle))) return false;
      return true;
    });
    this.currentPage = 0;
    this.updatePage();
  }

  clearFilters(): void {
    this.selectedCompanies = [];
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.selectedSubScopes = [];
    this.applyFilters();
  }

  private updatePage(): void {
    const start = this.currentPage * this.PAGE_SIZE;
    this.pagedItems = this.filteredItems.slice(start, start + this.PAGE_SIZE);
  }

  truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }
}
