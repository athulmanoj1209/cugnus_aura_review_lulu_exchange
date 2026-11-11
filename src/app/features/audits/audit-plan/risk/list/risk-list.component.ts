import {
  Component, computed, inject, OnInit, signal, ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Popover, PopoverModule } from 'primeng/popover';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AddRiskComponent, AddRiskDrawerData, RiskFormModel } from '../manage/risk.component';
import { RiskDetailComponent, RiskDetailDrawerData } from '../profile/risk-profile.component';
import { RiskHeatmapComponent } from '../com/risk-heatmap/risk-heatmap.component';
import { ImportRiskComponent } from '../com/import-risk/import-risk.component';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import {
  Risk, RiskType, RiskFile, ControlEffectiveness, RiskStatus, ResidualLevel,
  calcInherent, calcResidualScore, calcResidualLevel,
} from '../models/risk.model';
import { DialogModule } from 'primeng/dialog';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
// Shared master risk list — the Risk Register is the source of truth for
// every risk in the system. Risk Approvals (risk-approval-pending-list.
// component.ts) reads this same signal and derives its queue from whatever
// is currently marked "open" here, so the two pages can never drift apart.
import { risksStore } from '@/app/features/audits/audit-plan/risk/risk-shared-data';

// ─────────────────────────────────────────────────────────────────────────
// Company / Division / Sub-Division filter options come from the shared
// static org directory (same source as the sibling list pages) instead of
// being scraped off the risk records, so the filters always offer the full
// canonical list. ORG_STATIC_DATA_INTERNAL_AUDIT (built from the
// *-static-indi-org seed files) is used in 'internal-audit' client mode,
// otherwise the multi-company ORG_STATIC_DATA roster — see `orgData` below.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import {
  RiskBlockActions,
  RiskDrawerModes,
  RiskFilterKeys,
  RiskResidualLevels,
  RiskSortColumns,
  RiskSortDirections,
  RiskStatuses,
  RiskViewModes,
  type RiskFilterKey,
  type RiskSortColumn,
  type RiskSortDirection,
  type RiskViewMode,
  RISK_CONFIRM_DIALOG_WIDTH,
  RISK_DEFAULT_COMPANY,
  RISK_DEFAULT_DIVISION,
  RISK_DRAWER,
  RISK_ID_PAD_LENGTH,
  RISK_ID_PREFIX,
  RISK_LIST_PAGE_SIZE,
  RISK_PAGE_SIZE_OPTIONS,
  RISK_SCALE_MIN,
} from '../constants/risk.constants';
import {
  RISK_CONTROL_EFFECTIVENESS_LABELS,
  RISK_FILTER_CHIP_LABELS,
  RISK_LEVEL_COLORS,
  RISK_RESIDUAL_LEVEL_ICONS,
  RISK_RESIDUAL_LEVEL_OPTIONS,
  RISK_SORT_ICONS,
  RISK_STATUS_LABELS,
  RISK_STATUS_OPTIONS,
  RISK_TYPE_LABELS,
  RISK_TYPE_OPTIONS,
} from '../constants/risk-labels.constants';
import {
  RISK_BLOCK_CONFIRM_LABELS,
  RISK_SEARCH_PLACEHOLDER,
  RISK_SUB_DIVISION_PLACEHOLDERS,
} from '../constants/risk-messages.constants';

/* re-export so existing imports from this file keep working */
export type { Risk, RiskType, RiskFile, ControlEffectiveness, RiskStatus, ResidualLevel };
export { calcInherent, calcResidualScore, calcResidualLevel };

type SortCol = RiskSortColumn;
type SortDir = RiskSortDirection;

/** Sort weight of each residual level (low → high). */
const RESIDUAL_LEVEL_RANK: Record<ResidualLevel, number> = { low: 1, medium: 2, high: 3 };

/* ── Component ───────────────────────────────────────────────────── */
@Component({
  selector: 'app-risk-register-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, SelectModule, MultiSelectModule,
    TooltipModule, PopoverModule,
    RiskHeatmapComponent, ImportRiskComponent, DialogModule,
    PaginationBarComponent,

    DrawIconComponent,],
  templateUrl: './risk-list.component.html',
  styleUrl: './risk-list.component.scss',
})
export class RiskRegisterListComponent implements OnInit {
  @ViewChild(ImportRiskComponent) importDialog!: ImportRiskComponent;
  @ViewChild('filterPanel') filterPanel!: Popover;

  private readonly drawer     = inject(RightDrawerService);
  private readonly downloader = inject(FileDownloadService);
  private readonly router     = inject(Router);
  private readonly location   = inject(Location);

  // Shared with Risk Approvals — see risk-shared-data.ts.
  readonly risks    = risksStore;
  readonly viewMode = signal<RiskViewMode>(RiskViewModes.Grid);

  // Exposed for the template.
  readonly RiskViewModes         = RiskViewModes;
  readonly RiskSortColumns       = RiskSortColumns;
  readonly RiskStatuses          = RiskStatuses;
  readonly RiskBlockActions      = RiskBlockActions;
  readonly residualLevelIcons    = RISK_RESIDUAL_LEVEL_ICONS;
  readonly blockConfirmLabels    = RISK_BLOCK_CONFIRM_LABELS;
  readonly subDivisionPlaceholders = RISK_SUB_DIVISION_PLACEHOLDERS;
  readonly searchPlaceholder     = RISK_SEARCH_PLACEHOLDER;
  readonly confirmDialogWidth    = RISK_CONFIRM_DIALOG_WIDTH;

  /** True when this build is running in single-company "internal audit" mode. */
  readonly isInternalAuditMode = CLIENT_MODE_VALUE === 'internal-audit';

  /* ── Filters ── */
  readonly searchQuery       = signal('');
  readonly selectedCompanies = signal<string[]>([]);
  readonly selectedBranches  = signal<string[]>([]);
  readonly selectedTypes     = signal<RiskType[]>([]);
  readonly selectedDepts     = signal<string[]>([]);
  readonly selectedLevels    = signal<ResidualLevel[]>([]);
  readonly selectedStatuses  = signal<RiskStatus[]>([]);
  readonly selectedOwners    = signal<string[]>([]);

  /* ── Sort ── */
  readonly sortCol = signal<SortCol | null>(RiskSortColumns.InherentScore);
  readonly sortDir = signal<SortDir>(RiskSortDirections.Desc);

  /* ── Pagination ── */
  readonly pageSize    = signal(RISK_LIST_PAGE_SIZE);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = RISK_PAGE_SIZE_OPTIONS;

  /* ── Filter options ── */
  readonly riskTypeOptions      = RISK_TYPE_OPTIONS;

  readonly residualLevelOptions = RISK_RESIDUAL_LEVEL_OPTIONS;

  readonly statusOptions        = RISK_STATUS_OPTIONS;

  /** Org directory for the current client mode — source of the org filters below. */
  readonly orgData = this.isInternalAuditMode ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA;

  /** The selected companies, or every company when none is selected. */
  private scopedCompanies(names: string[]) {
    return names.length ? this.orgData.filter(c => names.includes(c.companyName)) : this.orgData;
  }

  /** Every company in the org directory. Values are company names (matching `r.company`). */
  readonly companyOptions = computed(() =>
    this.orgData
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /** Divisions of the selected companies (or all). Values are division names (matching `r.division`). */
  readonly branchOptions = computed(() => {
    const set = new Set(
      this.scopedCompanies(this.selectedCompanies()).flatMap(c => c.divisions.map(d => d.divisionName)),
    );
    return Array.from(set).sort().map(b => ({ label: b, value: b }));
  });

  /**
   * Sub-Divisions of the selected companies + divisions (or all). Divisions
   * flagged `hasSubDivision: false` contribute none. Values are sub-division
   * names (matching `r.subDivision`).
   */
  readonly deptOptions = computed(() => {
    const branches = this.selectedBranches();
    const set = new Set(
      this.scopedCompanies(this.selectedCompanies())
        .flatMap(c => c.divisions)
        .filter(d => d.hasSubDivision !== false)
        .filter(d => !branches.length || branches.includes(d.divisionName))
        .flatMap(d => d.subDivisions.map(sd => sd.subDivisionName)),
    );
    return Array.from(set).sort().map(d => ({ label: d, value: d }));
  });

  /**
   * False only when at least one Division is selected and every selected
   * Division is flagged `hasSubDivision: false` — the Sub-Division field is
   * then hidden (and its selection ignored). Unknown divisions count as
   * having sub-divisions.
   */
  readonly subDivisionFilterVisible = computed(() => {
    const branches = this.selectedBranches();
    if (!branches.length) return true;
    const divisions = this.scopedCompanies(this.selectedCompanies()).flatMap(c => c.divisions);
    return branches.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  readonly ownerOptions = computed(() => {
    const set = new Set(this.risks().map(r => r.owner).filter(Boolean));
    return Array.from(set).sort().map(o => ({ label: o, value: o }));
  });

  /* ── Active filter count + chips ── */
  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedCompanies().length)  n++;
    if (this.selectedBranches().length)   n++;
    if (this.selectedDepts().length)      n++;
    if (this.selectedTypes().length)      n++;
    if (this.selectedLevels().length)     n++;
    if (this.selectedStatuses().length)   n++;
    if (this.selectedOwners().length)     n++;
    return n;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: RiskFilterKey; label: string }[] = [];
    const add = (key: RiskFilterKey, count: number) => {
      if (count) chips.push({ key, label: `${RISK_FILTER_CHIP_LABELS[key]}: ${count}` });
    };
    add(RiskFilterKeys.Companies, this.selectedCompanies().length);
    add(RiskFilterKeys.Branches,  this.selectedBranches().length);
    add(RiskFilterKeys.Depts,     this.selectedDepts().length);
    add(RiskFilterKeys.Types,     this.selectedTypes().length);
    add(RiskFilterKeys.Levels,    this.selectedLevels().length);
    add(RiskFilterKeys.Statuses,  this.selectedStatuses().length);
    add(RiskFilterKeys.Owners,    this.selectedOwners().length);
    return chips;
  });

  removeFilter(key: RiskFilterKey): void {
    switch (key) {
      case RiskFilterKeys.Companies: this.selectedCompanies.set([]); this.selectedBranches.set([]); this.selectedDepts.set([]); break;
      case RiskFilterKeys.Branches:  this.selectedBranches.set([]);  this.selectedDepts.set([]); break;
      case RiskFilterKeys.Depts:     this.selectedDepts.set([]);     break;
      case RiskFilterKeys.Types:     this.selectedTypes.set([]);     break;
      case RiskFilterKeys.Levels:    this.selectedLevels.set([]);    break;
      case RiskFilterKeys.Statuses:  this.selectedStatuses.set([]);  break;
      case RiskFilterKeys.Owners:    this.selectedOwners.set([]);    break;
    }
    this.currentPage.set(1);
  }

  /* ── Derived ── */
  readonly filtered = computed(() => {
    let list = this.risks().filter(r => r.status !== RiskStatuses.Deactivated ||
      this.selectedStatuses().includes(RiskStatuses.Deactivated));

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(r =>
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q),
    );

    const co = this.selectedCompanies();
    if (co.length) list = list.filter(r => co.includes(r.company));

    const br = this.selectedBranches();
    if (br.length) list = list.filter(r => br.includes(r.division));

    const t = this.selectedTypes();
    if (t.length) list = list.filter(r => t.includes(r.riskType));

    const d = this.selectedDepts();
    // Ignored while the Sub-Division field is hidden, so it can't stay applied.
    if (d.length && this.subDivisionFilterVisible()) list = list.filter(r => d.includes(r.subDivision));

    const l = this.selectedLevels();
    if (l.length) list = list.filter(r => l.includes(r.residualLevel));

    const s = this.selectedStatuses();
    if (s.length) list = list.filter(r => s.includes(r.status));

    const ow = this.selectedOwners();
    if (ow.length) list = list.filter(r => ow.includes(r.owner));

    const col = this.sortCol();
    if (col) {
      const dir = this.sortDir() === RiskSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sv(a, col), bv = this.sv(b, col);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const p    = Math.min(this.currentPage(), max);
    return all.slice((p - 1) * size, p * size);
  });

  readonly hasFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedCompanies().length ||
    !!this.selectedBranches().length ||
    !!this.selectedTypes().length ||
    !!this.selectedDepts().length ||
    !!this.selectedLevels().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedOwners().length,
  );

  /**
   * Severity-wise KPI strip: Total + one count per residual level
   * (High/Medium/Low). Derived from `filtered()` so the cards mirror
   * whatever search/filters are currently applied to the table/grid below.
   */
  readonly kpis = computed(() => {
    const all = this.filtered();
    return {
      total:  all.length,
      high:   all.filter(r => r.residualLevel === RiskResidualLevels.High).length,
      medium: all.filter(r => r.residualLevel === RiskResidualLevels.Medium).length,
      low:    all.filter(r => r.residualLevel === RiskResidualLevels.Low).length,
    };
  });

  ngOnInit(): void { /* load from service */ }

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /* ── Filter handlers ── */
  onSearch(q: string)          { this.searchQuery.set(q);              this.currentPage.set(1); }
  onCompanies(v: string[])     { this.selectedCompanies.set(v ?? []);  this.selectedBranches.set([]); this.selectedDepts.set([]); this.currentPage.set(1); }
  onBranches(v: string[])      { this.selectedBranches.set(v ?? []);   this.selectedDepts.set([]);    this.currentPage.set(1); }
  onTypes(v: RiskType[])       { this.selectedTypes.set(v ?? []);      this.currentPage.set(1); }
  onDepts(v: string[])         { this.selectedDepts.set(v ?? []);      this.currentPage.set(1); }
  onLevels(v: ResidualLevel[]) { this.selectedLevels.set(v ?? []);     this.currentPage.set(1); }
  onStatuses(v: RiskStatus[])  { this.selectedStatuses.set(v ?? []);   this.currentPage.set(1); }
  onOwners(v: string[])        { this.selectedOwners.set(v ?? []);     this.currentPage.set(1); }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCompanies.set([]); this.selectedBranches.set([]);
    this.selectedTypes.set([]);     this.selectedDepts.set([]);
    this.selectedLevels.set([]);    this.selectedStatuses.set([]);
    this.selectedOwners.set([]);
    this.currentPage.set(1);
  }

  /* ── Sort ── */
  onSort(col: SortCol) {
    this.sortCol() === col
      ? this.sortDir.update(d => d === RiskSortDirections.Asc ? RiskSortDirections.Desc : RiskSortDirections.Asc)
      : (this.sortCol.set(col), this.sortDir.set(RiskSortDirections.Asc));
  }
  sortIcon(col: SortCol) {
    return this.sortCol() !== col ? '' : RISK_SORT_ICONS[this.sortDir()];
  }
  private sv(r: Risk, col: SortCol): string | number {
    switch (col) {
      case RiskSortColumns.Id:             return parseInt(r.id.replace(/\D/g,''), 10) || 0;
      case RiskSortColumns.Title:          return r.title.toLowerCase();
      case RiskSortColumns.RiskType:       return r.riskType;
      case RiskSortColumns.InherentScore:  return r.inherentScore;
      case RiskSortColumns.ResidualLevel:  return RESIDUAL_LEVEL_RANK[r.residualLevel];
      case RiskSortColumns.Status:         return r.status;
      case RiskSortColumns.DateIdentified: return r.dateIdentified.getTime();
    }
  }

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

  setView(m: RiskViewMode) { this.viewMode.set(m); }

  openImport(): void { this.importDialog.open(); }

  onImported(newRisks: Partial<Risk>[]): void {
    this.risks.update(existing => [...existing, ...(newRisks as Risk[])]);
  }

  /* ── Uploaded register documents → RiskFile[] (keeps blobs downloadable) ── */
  private toRiskFiles(docs: File[] | undefined): RiskFile[] {
    return (docs ?? []).map(f => ({ name: f.name, size: f.size, file: f }));
  }

  /**
   * AddRiskResult.form may arrive as the plain model OR as the FormGroup
   * itself (depending on how add-risk closes the drawer) — normalise both.
   */
  private normalizeForm(input: unknown): RiskFormModel {
    const maybeGroup = input as { getRawValue?: () => unknown };
    const raw = typeof maybeGroup?.getRawValue === 'function'
      ? maybeGroup.getRawValue()
      : input;
    return raw as RiskFormModel;
  }

  /** Build a full Risk from the add-risk form. */
  private buildRisk(id: string, f: RiskFormModel, existingFiles: RiskFile[] = []): Risk {
    const impact     = f.impact ?? RISK_SCALE_MIN;
    const likelihood = f.likelihood ?? RISK_SCALE_MIN;
    const inherent   = calcInherent(impact, likelihood);
    const residual   = calcResidualScore(inherent, f.controlEffectiveness);
    return {
      id,
      riskType: f.riskType,
      title: f.title,
      description: f.description,
      company: f.company || RISK_DEFAULT_COMPANY,
      division: f.division || RISK_DEFAULT_DIVISION,
      subDivision: f.subDivision,
      impact, likelihood,
      inherentScore: inherent,
      keyControls: f.keyControls,
      controlEffectiveness: f.controlEffectiveness,
      residualScore: residual,
      residualLevel: calcResidualLevel(residual),
      owner: f.owner,
      dateIdentified: f.dateIdentified ?? new Date(),
      lastUpdated: new Date(),
      status: f.status,
      linkedScopes: [], linkedFindings: [], linkedObservations: [],
      // already-persisted files survive; newly uploaded documents are appended
      supportingFiles: [...existingFiles.filter(x => x.url), ...this.toRiskFiles(f.documents)],
    };
  }

  private nextId(): string {
    const max = this.risks().reduce((m, r) =>
      Math.max(m, parseInt(r.id.replace(/\D/g, ''), 10) || 0), 0);
    return `${RISK_ID_PREFIX}${String(max + 1).padStart(RISK_ID_PAD_LENGTH, '0')}`;
  }

  async openAdd(): Promise<void> {
    const ref = this.drawer.open<AddRiskComponent, AddRiskDrawerData>(
      AddRiskComponent, { width: RISK_DRAWER.FormWidth, data: { mode: RiskDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (result) {
      const newRisk = this.buildRisk(this.nextId(), this.normalizeForm(result.form));
      // `risks` is the shared store that Risk Approvals also reads, so a
      // newly-created risk with status 'open' shows up in the approvals
      // queue immediately — no separate "push to approvals" step needed.
      this.risks.update(list => [newRisk, ...list]);
      this.currentPage.set(1);
    }
  }

  async openEdit(r: Risk): Promise<void> {
    const ref = this.drawer.open<AddRiskComponent, AddRiskDrawerData>(
      AddRiskComponent, {
        width: RISK_DRAWER.FormWidth,
        data: { mode: RiskDrawerModes.Edit, existing: {
          id: r.id, riskType: r.riskType, title: r.title, description: r.description,
          subDivision: r.subDivision, impact: r.impact, likelihood: r.likelihood,
          keyControls: r.keyControls, controlEffectiveness: r.controlEffectiveness,
          owner: r.owner, dateIdentified: r.dateIdentified, status: r.status,
          company: r.company, division: r.division,
        }},
      },
    );
    const result = await ref.afterClosed;
    if (result) {
      const updated = this.buildRisk(r.id, this.normalizeForm(result.form), r.supportingFiles);
      // keep the original identification date on edit
      updated.dateIdentified = r.dateIdentified;
      this.risks.update(list => list.map(x => (x.id === r.id ? updated : x)));
    }
  }

  openView(r: Risk): void {
    this.drawer.open<RiskDetailComponent, RiskDetailDrawerData>(
      RiskDetailComponent, { width: RISK_DRAWER.ProfileWidth, data: { risk: r } },
    );
  }

  downloadFile(f: RiskFile): void {
    const src = f.file ?? f.url;
    if (src) this.downloader.download(src, f.name);
  }

  /* ── Labels ── */
  riskTypeLabel(t: RiskType): string {
    return RISK_TYPE_LABELS[t] ?? t;
  }
  statusLabel(s: RiskStatus): string {
    return RISK_STATUS_LABELS[s] ?? s;
  }
  ceLabel(ce: ControlEffectiveness): string {
    return RISK_CONTROL_EFFECTIVENESS_LABELS[ce] ?? ce;
  }
  scoreColor(score: number): string {
    return RISK_LEVEL_COLORS[calcResidualLevel(score)];
  }

  trackById = (_: number, r: Risk) => r.id;

  readonly displayConfirmation = signal(false);
  private readonly pendingRisk = signal<Risk | null>(null);

  /** True label for the confirm button — "Activate" or "Deactivate". */
  readonly confirmationAction = computed(() =>
    this.pendingRisk()?.status ? RiskBlockActions.Activate : RiskBlockActions.Deactivate,
  );

  readonly confirmationTarget = computed(() => this.pendingRisk());

  openConfirmation(risk: Risk): void {
    this.pendingRisk.set(risk);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.pendingRisk.set(null);
  }

  /** Called when the user clicks "Yes" — toggles, then closes. */
  confirmToggleBlocked(): void {
    const c = this.pendingRisk();
    if (c) this.toggleBlocked(c);
    this.closeConfirmation();
  }

  toggleBlocked(risk: Risk): void {
    this.risks.update(list =>
      list.map(c => (c.id === risk.id ? { ...c, blocked: !c.status } : c)),
    );
  }
}