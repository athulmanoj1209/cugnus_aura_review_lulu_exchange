import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { ScopeLibraryComponent } from '@/app/features/audits/libraries/scope-library/manage/scope-library.component';
import { ScopeLibraryProfileComponent } from '@/app/features/audits/libraries/scope-library/profile/scope-library-profile.component';
import type { ScopeLibraryDrawerData, ScopeLibraryDrawerResult, ScopeLibraryProfileDrawerData } from '../models/scope-library.model';
import type { RiskCategory, ScopeLibraryItem } from '../models/scope-library-list.model';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { FilterModalComponent } from '@/app/shared/components/filter-modal/filter-modal.component';
import {  DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { divisionAllowsSubDivisions, noSubDivisionMessage } from '@/app/shared/utils/no-sub-division-message';
import { MOCK_SCOPE_LIBRARY, upsertScopeLibraryItem, editScopeLibraryItem } from '../scope-library-static-data';
import { DivisionStatuses } from '@/app/features/audits/organization/divisions/constants/division.constants';
import { SubDivisionStatuses } from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_LIBRARY_DRAWER,
  SCOPE_LIBRARY_OBJECTIVE_TRUNCATE,
  SCOPE_LIBRARY_PAGE_SIZE,
  ScopeLibraryDrawerModes,
  ScopeLibraryViewModes,
  type ScopeLibraryViewMode,
} from '../constants/scope-library.constants';
import {
  SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY,
  SCOPE_LIBRARY_RISK_CATEGORY_SEVERITY,
  SCOPE_LIBRARY_STATUS_LABELS,
  SCOPE_LIBRARY_STATUS_SEVERITY,
  type ScopeLibraryTagSeverity,
} from '../constants/scope-library-labels.constants';

@Component({
  selector: 'app-scope-library-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    DialogModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,
    FilterModalComponent,
    DrawIconComponent,
    BackButtonComponent
  ],
  templateUrl: './scope-library-list.component.html',
  styleUrl: './scope-library-list.component.scss',
})
export class ScopeLibraryListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly companyDataService = inject(CompanyDataService);

  /* ── View mode ─── */
  readonly ScopeLibraryViewModes = ScopeLibraryViewModes;
  readonly ScopeLevels = ScopeLevels;
  readonly OBJECTIVE_TRUNCATE = SCOPE_LIBRARY_OBJECTIVE_TRUNCATE;

  viewMode: ScopeLibraryViewMode = ScopeLibraryViewModes.Grid;

  /* ── Filter / page state ─── */
  searchQuery = '';
  selectedCompanies: string[] = [];
  selectedDivisions: string[] = [];
  selectedSubDivisions: string[] = [];
  selectedScopes: string[] = [];
  currentPage = 0;
  PAGE_SIZE = SCOPE_LIBRARY_PAGE_SIZE;

  /* ── Filter options — same real sources as the RFI Management Library page ─── */
  get companyOptions() {
    return this.companyDataService.all
      .filter(c => !c.blocked)
      .map(c => ({ label: c.companyName, value: c.id }));
  }

  /** The REAL division list (division-static-data.ts). Excludes deactivated
   *  divisions (own status inactive, or parent company blocked). */
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
          if (d.status !== SubDivisionStatuses.Active || seen.has(d.subDivisionName)) continue;
          seen.add(d.subDivisionName);
          opts.push({ label: d.subDivisionName, value: d.subDivisionName });
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
    this.applyFilters();
  }

  onDivisionsChange(divisions: string[]): void {
    this.selectedDivisions = divisions;
    if (this.subDivisionDisabledMessage) this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.applyFilters();
  }

  onSubDivisionsChange(subDivisions: string[]): void {
    this.selectedSubDivisions = subDivisions;
    this.selectedScopes = [];
    this.applyFilters();
  }

  /** Top-level library scopes (by title) — a sub-scope matches via its parent scope's title.
   *  Narrowed by the org selection: selected sub-divisions' scopes; else every scope
   *  (division-level + sub-division) under the selected divisions; else the selected
   *  companies' scopes; else all. */
  get scopeOptions() {
    const companies = this.selectedCompanies;
    const divisions = this.selectedDivisions;
    const subDivisions = this.selectedSubDivisions;
    const seen = new Set<string>();
    return this.scopeLibraryItems
      .filter(s => s.scopeLevel === ScopeLevels.Scope && this.isUnderValidSubDivision(s))
      .filter(s => !companies.length || companies.includes(s.company))
      .filter(s => !divisions.length || divisions.includes(s.division))
      .filter(s => !subDivisions.length || (!!s.subDivision && subDivisions.includes(s.subDivision)))
      .filter(s => !seen.has(s.title) && !!seen.add(s.title))
      .map(s => ({ label: s.title, value: s.title }));
  }

  /* ── Data ─── */
  get scopeLibraryItems(): ScopeLibraryItem[] {
    return [...MOCK_SCOPE_LIBRARY].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  }
  filteredItems: ScopeLibraryItem[] = [];
  pagedItems: ScopeLibraryItem[] = [];

  /* ── Risk category severity map ─── */
  readonly riskCategorySeverity = SCOPE_LIBRARY_RISK_CATEGORY_SEVERITY;

  /* ── Status severity / label maps ─── */
  readonly scopeLibraryStatusSeverity = SCOPE_LIBRARY_STATUS_SEVERITY;
  readonly scopeLibraryStatusLabel = SCOPE_LIBRARY_STATUS_LABELS;

  ngOnInit(): void {
    this.applyFilters();
  }

  /* ── View mode ─── */
  setViewMode(mode: ScopeLibraryViewMode): void {
    this.viewMode = mode;
  }

  /* ── Actions ─── */
  async onAddScope(): Promise<void> {
    const ref = this.drawer.open(ScopeLibraryComponent, {
      width: SCOPE_LIBRARY_DRAWER.FormWidth,
      styleClass: SCOPE_LIBRARY_DRAWER.StyleClass,
      data: { mode: ScopeLibraryDrawerModes.Add, allScopes: this.scopeLibraryItems } as ScopeLibraryDrawerData,
    });
    const result = await ref.afterClosed as ScopeLibraryDrawerResult | undefined;
    if (result?.saved) {
      upsertScopeLibraryItem(result.saved);
      this.applyFilters();
    }
  }

  viewScope(item: ScopeLibraryItem): void {
    this.drawer.open(ScopeLibraryProfileComponent, {
      width: SCOPE_LIBRARY_DRAWER.ProfileWidth,
      styleClass: SCOPE_LIBRARY_DRAWER.StyleClass,
      data: { scopeItem: item } as ScopeLibraryProfileDrawerData,
    });
  }

  async editScope(item: ScopeLibraryItem): Promise<void> {
    const ref = this.drawer.open(ScopeLibraryComponent, {
      width: SCOPE_LIBRARY_DRAWER.FormWidth,
      styleClass: SCOPE_LIBRARY_DRAWER.StyleClass,
      data: { mode: ScopeLibraryDrawerModes.Edit, scopeItem: { ...item }, allScopes: this.scopeLibraryItems } as ScopeLibraryDrawerData,
    });
    const result = await ref.afterClosed as ScopeLibraryDrawerResult | undefined;
    if (result?.saved) {
      editScopeLibraryItem(result.saved.id, result.saved);
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
    this.filteredItems = this.scopeLibraryItems.filter(item => {
      if (q && !item.title.toLowerCase().includes(q) &&
          !item.objective.toLowerCase().includes(q) &&
          !item.riskCategory.toLowerCase().includes(q)) return false;
      if (!this.isUnderValidSubDivision(item)) return false;
      if (this.selectedCompanies.length && !this.selectedCompanies.includes(item.company)) return false;
      if (this.selectedDivisions.length && !this.selectedDivisions.includes(item.division)) return false;
      // Division-level items (no sub-division) never match a sub-division filter.
      if (this.selectedSubDivisions.length && !(item.subDivision && this.selectedSubDivisions.includes(item.subDivision))) return false;
      if (this.selectedScopes.length) {
        const scopeTitle = item.scopeLevel === ScopeLevels.Scope ? item.title : item.parentScopeTitle;
        if (!scopeTitle || !this.selectedScopes.includes(scopeTitle)) return false;
      }
      return true;
    });
    this.currentPage = 0;
    this.updatePage();
  }

  /** False for items filed under a sub-division of a division that has no
   *  sub-divisions (leftover seed records), and for division-level items under a
   *  division that has sub-divisions — unless the item was explicitly added at
   *  division level (`hasSubDivision: false`). Hidden from the list. */
  private isUnderValidSubDivision(item: ScopeLibraryItem): boolean {
    return item.subDivision
      ? divisionAllowsSubDivisions(item.division, item.company)
      : !divisionAllowsSubDivisions(item.division, item.company) || item.hasSubDivision === false;
  }

  clearFilters(): void {
    this.selectedCompanies = [];
    this.selectedDivisions = [];
    this.selectedSubDivisions = [];
    this.selectedScopes = [];
    this.applyFilters();
  }

  private updatePage(): void {
    const start = this.currentPage * this.PAGE_SIZE;
    this.pagedItems = this.filteredItems.slice(start, start + this.PAGE_SIZE);
  }

  /* ── Display helpers ─── */
  getRiskSeverity(cat: RiskCategory): ScopeLibraryTagSeverity {
    return this.riskCategorySeverity[cat] ?? SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY;
  }

  truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }

}
