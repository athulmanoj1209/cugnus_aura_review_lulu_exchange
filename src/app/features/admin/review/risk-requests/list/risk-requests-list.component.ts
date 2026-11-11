import {
  Component, computed, inject, signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AddRiskComponent, AddRiskDrawerData } from '@/app/features/audits/audit-plan/risk/manage/risk.component';
import { FilterModalComponent, FilterOption } from '@/app/shared/components/filter-modal/filter-modal.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
// Shared master risk list — the Risk Register (risk-register-list.
// component.ts) is the single source of truth for every risk. This page no
// longer keeps its own separate mock queue; it derives the pending-
// approvals list directly from whichever risks are currently marked
// "open" in the register, via the shared `risksStore` signal.
import { risksStore, toPendingRisk, PendingRisk } from '@/app/features/audits/audit-plan/risk/risk-shared-data';

// Client-mode aware org data — same switch used by risk-register-list.
// component.ts. When CLIENT_MODE_VALUE is 'internal-audit', the Company /
// Division / Sub-Division filter options are drawn from the single-company
// "DAR Exchange" *-indi-org static seed files instead of ORG_STATIC_DATA's
// multi-company audit-firm roster.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';

/* re-export so existing imports of PendingRisk from this file keep working */
export type { PendingRisk };

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-risk-pending-approvals',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, FormsModule,
    ButtonModule, InputTextModule, TooltipModule,
    FilterModalComponent, PaginationBarComponent,

    DrawIconComponent,],
  templateUrl: './risk-requests-list.component.html',
  styleUrl: './risk-requests-list.component.scss',
})
export class RiskPendingApprovalsComponent {
  private readonly drawer = inject(RightDrawerService);

  /**
   * Shows exactly the risks currently marked "open" in the Risk Register's
   * shared store — derived, not a separate copy, so this queue can never
   * drift out of sync with the register (creating, editing or
   * deactivating a risk there is reflected here immediately).
   */
  readonly items = computed<PendingRisk[]>(() =>
    risksStore()
      .filter(r => r.status === 'open')
      .map(toPendingRisk),
  );

  readonly viewMode = signal<'grid' | 'list'>('grid');
  readonly search   = signal('');

  // ── Pagination ─────────────────────────────────────────────────────────────
  readonly pageSize    = signal(8);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = [8, 25, 50, 100];

  // ── Filter state (multi-select arrays) ────────────────────────────────────
  readonly filterCategories    = signal<string[]>([]);
  readonly filterRatings       = signal<string[]>([]);
  readonly filterCompanies     = signal<string[]>([]);
  readonly filterDivisions     = signal<string[]>([]);
  readonly filterSubDivisions  = signal<string[]>([]);
  readonly filterSubmittedBys  = signal<string[]>([]);

  // ── Static options ────────────────────────────────────────────────────────
  readonly categoryOptions: FilterOption[] = [
    { label: $localize`:@@admin.riskRequests.operational:Operational`, value: 'Operational' },
    { label: $localize`:@@admin.riskRequests.financial:Financial`, value: 'Financial' },
    { label: $localize`:@@admin.riskRequests.compliance:Compliance`, value: 'Compliance' },
    { label: $localize`:@@admin.riskRequests.strategic:Strategic`, value: 'Strategic' },
    { label: $localize`:@@admin.riskRequests.itCyber:IT / Cyber`, value: 'IT / Cyber' },
    { label: $localize`:@@admin.riskRequests.reputational:Reputational`, value: 'Reputational' },
    { label: $localize`:@@admin.riskRequests.legal:Legal`, value: 'Legal' }
  ];
  readonly ratingOptions: FilterOption[] = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' }
  ];

  /** True when this build is running in single-company "internal audit" mode. */
  readonly isInternalAuditMode = CLIENT_MODE_VALUE === 'internal-audit';

  /**
   * Company filter options.
   *
   * Internal-audit mode: every company defined in COMPANIES_SEED
   * (company-static-indi-org.data.ts) — the full single-company org
   * directory, not just the multi-company audit-firm roster.
   *
   * Audit-firm mode (unchanged): sourced from company-org-data.ts — the
   * same shared static-data file every other Company filter/drawer in the
   * app reads from. Value is the company's display NAME (matching
   * PendingRisk.company).
   */
  readonly companyOptions = computed<FilterOption[]>(() => {
    if (this.isInternalAuditMode) {
      return COMPANIES_SEED
        .map(c => ({ label: c.companyName, value: c.companyName }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return ORG_STATIC_DATA
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  /**
   * Division narrows to whatever Companies are currently checked in the
   * Filters modal (all divisions, across every company, when none are
   * checked yet).
   *
   * Internal-audit mode: pulled from DIVISION_INDI_ORG_COMPANIES
   * (division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly divisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : DIVISION_INDI_ORG_COMPANIES;
      const names = new Set(companies.flatMap(c => c.divisions).map(dv => dv.divisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ORG_STATIC_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const names = new Set(companies.flatMap(c => c.divisions).map(dv => dv.divisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * Sub-division narrows to whatever Companies/Divisions are currently
   * checked.
   *
   * Internal-audit mode: pulled from SUB_DIVISION_INDI_ORG_COMPANIES
   * (sub-division-static-indi-org.data.ts) instead of company-org-data.ts.
   */
  readonly subDivisionOptions = computed<FilterOption[]>(() => {
    const selectedCompanies = this.filterCompanies();
    const selectedDivisions = this.filterDivisions();

    if (this.isInternalAuditMode) {
      const companies = selectedCompanies.length
        ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => selectedCompanies.includes(c.companyName))
        : SUB_DIVISION_INDI_ORG_COMPANIES;
      const divisions = companies.flatMap(c => c.divisions)
        .filter(dv => dv.hasSubDivision !== false)
        .filter(dv => !selectedDivisions.length || selectedDivisions.includes(dv.divisionName));
      const names = new Set(divisions.flatMap(dv => dv.subDivisions).map(sd => sd.subDivisionName));
      return [...names].sort().map(v => ({ label: v, value: v }));
    }

    const companies = selectedCompanies.length
      ? ORG_STATIC_DATA.filter(c => selectedCompanies.includes(c.companyName))
      : ORG_STATIC_DATA;
    const divisions = companies.flatMap(c => c.divisions)
      .filter(dv => dv.hasSubDivision !== false)
      .filter(dv => !selectedDivisions.length || selectedDivisions.includes(dv.divisionName));
    const names = new Set(divisions.flatMap(dv => dv.subDivisions).map(sd => sd.subDivisionName));
    return [...names].sort().map(v => ({ label: v, value: v }));
  });

  /**
   * Sub-Division is disabled only when every selected Division (looked up in
   * the selected Companies, or all companies) is flagged hasSubDivision:false.
   * Such divisions still carry a subDivisions array in the seed data, so it
   * must not be offered. Unknown divisions count as having sub-divisions.
   */
  readonly subDivisionEnabled = computed<boolean>(() => {
    const selectedDivisions = this.filterDivisions();
    if (!selectedDivisions.length) return true;
    const selectedCompanies = this.filterCompanies();
    const source: { companyName: string; divisions: { divisionName: string; hasSubDivision?: boolean }[] }[] =
      this.isInternalAuditMode ? SUB_DIVISION_INDI_ORG_COMPANIES : ORG_STATIC_DATA;
    const companies = selectedCompanies.length
      ? source.filter(c => selectedCompanies.includes(c.companyName))
      : source;
    const divisions = companies.flatMap(c => c.divisions);
    return selectedDivisions.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  // ── Dynamic options ───────────────────────────────────────────────────────
  readonly submitterOptions = computed<FilterOption[]>(() =>
    [...new Set(this.items().map(i => i.submittedBy))].sort()
      .map(v => ({ label: v, value: v }))
  );

  // ── Stats ─────────────────────────────────────────────────────────────────
  readonly stats = computed(() => {
    const all = this.items();
    return {
      total:    all.length,
      critical: all.filter(i => i.riskRating === 'critical').length,
      high:     all.filter(i => i.riskRating === 'high').length,
      medium:   all.filter(i => i.riskRating === 'medium').length,
      low:      all.filter(i => i.riskRating === 'low').length,
    };
  });

  // ── Filtered list ─────────────────────────────────────────────────────────
  readonly filtered = computed(() => {
    let list = this.items();
    const q = this.search().trim().toLowerCase();
    if (q) list = list.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.submittedBy.toLowerCase().includes(q),
    );
    const categories    = this.filterCategories();
    const ratings       = this.filterRatings();
    const companies     = this.filterCompanies();
    const divisions     = this.filterDivisions();
    const subDivisions  = this.subDivisionEnabled() ? this.filterSubDivisions() : [];
    const submittedBys  = this.filterSubmittedBys();

    if (categories.length)   list = list.filter(i => categories.includes(i.category));
    if (ratings.length)      list = list.filter(i => ratings.includes(i.riskRating));
    if (companies.length)    list = list.filter(i => companies.includes(i.company));
    if (divisions.length)    list = list.filter(i => divisions.includes(i.division));
    if (subDivisions.length) list = list.filter(i => subDivisions.includes(i.subDivision));
    if (submittedBys.length) list = list.filter(i => submittedBys.includes(i.submittedBy));
    return list;
  });

  readonly hasFilters = computed(() =>
    !!this.search().trim() ||
    this.filterCategories().length > 0 ||
    this.filterRatings().length > 0 ||
    this.filterCompanies().length > 0 ||
    this.filterDivisions().length > 0 ||
    this.filterSubDivisions().length > 0 ||
    this.filterSubmittedBys().length > 0
  );

  /** The current page slice. */
  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * size, page * size);
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  onSearch(q: string): void { this.search.set(q); this.currentPage.set(1); }

  onCategoriesChange(v: string[])    { this.filterCategories.set(v ?? []);    this.currentPage.set(1); }
  onRatingsChange(v: string[])       { this.filterRatings.set(v ?? []);       this.currentPage.set(1); }
  onCompaniesChange(v: string[])     { this.filterCompanies.set(v ?? []);     this.currentPage.set(1); }
  onDivisionsChange(v: string[])     { this.filterDivisions.set(v ?? []);     this.currentPage.set(1); }
  onSubDivisionsChange(v: string[])  { this.filterSubDivisions.set(v ?? []);  this.currentPage.set(1); }
  onSubmittedBysChange(v: string[])  { this.filterSubmittedBys.set(v ?? []);  this.currentPage.set(1); }

  /** <app-pagination-bar> emits a zero-based page index. */
  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  /** Called when the "items per page" dropdown changes. Resets to page 1
   *  so the visible slice stays consistent with the new page size. */
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  clearAll(): void {
    this.search.set('');
    this.filterCategories.set([]);
    this.filterRatings.set([]);
    this.filterCompanies.set([]);
    this.filterDivisions.set([]);
    this.filterSubDivisions.set([]);
    this.filterSubmittedBys.set([]);
    this.currentPage.set(1);
  }

  openDetail(item: PendingRisk): void {
    // Seed the drawer from the full register risk (not the flattened
    // PendingRisk) so company/division/sub-division and the real scores prefill.
    const risk = risksStore().find(r => r.id === item.id);
    this.drawer.open<AddRiskComponent, AddRiskDrawerData>(
      AddRiskComponent, {
        width: '800px',
        data: { mode: 'approve', existing: {
          id: '', riskType: 'financial', title: item.title, description: item.description,
          subDivision: item.subDivision, impact: 1, likelihood: 2,
          keyControls: '', controlEffectiveness: 'strong',
          owner: item.submittedBy, status: 'monitored',
        }},
      },
    );
  }

  /* ── Helpers ──────────────────────────────────────────────────── */
  ratingLabel(value: string): string {
    const map: Record<string, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
      pending: $localize`:@@common.pending:Pending`,
      approved: $localize`:@@common.approved:Approved`,
      rejected: $localize`:@@common.rejected:Rejected`,
    };

    return map[value] ?? value;
  }
  categoryIcon(cat: string): string {
    const map: Record<string, string> = {
      'Operational': 'pi-cog', 'Financial': 'pi-dollar', 'Compliance': 'pi-check-square',
      'Strategic': 'pi-chart-line', 'IT / Cyber': 'pi-shield', 'Reputational': 'pi-star',
      'Legal': 'pi-book',
    };
    return map[cat] ?? 'pi-exclamation-circle';
  }
  trackById = (_: number, i: PendingRisk) => i.id;
  categoryLabel(category: string): string {
    const map: Record<string, string> = {
      Operational: $localize`:@@admin.riskRequests.operational:Operational`,
      Financial: $localize`:@@admin.riskRequests.financial:Financial`,
      Compliance: $localize`:@@admin.riskRequests.compliance:Compliance`,
      Strategic: $localize`:@@admin.riskRequests.strategic:Strategic`,
      'IT / Cyber': $localize`:@@admin.riskRequests.itCyber:IT / Cyber`,
      Reputational: $localize`:@@admin.riskRequests.reputational:Reputational`,
      Legal: $localize`:@@admin.riskRequests.legal:Legal`,
    };

    return map[category] ?? category;
  }
}