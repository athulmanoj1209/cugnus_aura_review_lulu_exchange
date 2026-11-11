import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { EvidenceComponent, AddEvidenceDrawerData, AddEvidenceResult } from '../manage/evidence.component';
// Temporary, client-only bridge into the Pending Approvals queue (see
// execution-approval-list.component.ts) — adjust this relative path if that
// component lives somewhere else in your tree; it's assumed to be a sibling
// folder of this one, same as add-evidence/.
import { addPendingItem, PendingItem } from '@/app/features/admin/review/execution-requests/list/execution-requests-list.component';
import { EvidenceProfileComponent, EvidenceDetailDrawerData } from '../profile/evidence-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
// Same CLIENT_MODE_VALUE constant the other static seed files (e.g.
// branch-static-data.ts) read at module-eval time — adjust this relative
// path to wherever client-mode.ts actually lives in your tree.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// The internal-audit org-structure seed files (same family as
// client-mode.ts's sibling seeds) — used below to source the Company /
// Division / Sub-Division / Scope filter *options* from the active client's
// org structure when CLIENT_MODE_VALUE is 'internal-audit'.
import { COMPANIES_SEED } from '@/app/features/audits/organization/company/company-static-indi-org.data';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
// Shared Company -> Division -> Sub-Division -> Scope directory (same source
// observation-list uses) for the filter options when CLIENT_MODE_VALUE is NOT
// 'internal-audit'.
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import {
  EVIDENCE_CURRENT_USER_NAME,
  EVIDENCE_DATE_FORMAT_OPTIONS,
  EVIDENCE_DATE_LOCALE,
  EVIDENCE_DEFAULT_REVIEW_STATUS,
  EVIDENCE_DEFAULT_RISK,
  EVIDENCE_DRAWER_WIDTH,
  EVIDENCE_FILE_PREVIEW_COUNT,
  EVIDENCE_FILE_SIZE_BASE,
  EVIDENCE_FILE_SIZE_UNITS,
  EVIDENCE_ID_PAD_LENGTH,
  EVIDENCE_ID_PREFIX,
  EVIDENCE_LIST_PAGE_SIZE,
  EVIDENCE_PAGE_SIZE_OPTIONS,
  EVIDENCE_PENDING_ITEM_DEFAULTS,
  EVIDENCE_QUERY_PARAMS,
  EvidenceBlockActions,
  EvidenceDrawerModes,
  EvidenceFilterKeys,
  EvidenceReviewStatuses,
  EvidenceSortColumns,
  EvidenceSortDirections,
  EvidenceViewModes,
  type EvidenceBlockAction,
  type EvidenceFilterKey,
  type EvidenceReviewStatus,
  type EvidenceSortColumn,
  type EvidenceSortDirection,
  type EvidenceType,
  type EvidenceViewMode,
} from '../constants/evidence.constants';
import {
  EVIDENCE_FILE_ICON_DEFAULT,
  EVIDENCE_FILE_ICONS,
  EVIDENCE_FILTER_CHIP_LABELS,
  EVIDENCE_REVIEW_STATUS_LABELS,
  EVIDENCE_SORT_ICONS,
  EVIDENCE_TASK_TITLES,
  EVIDENCE_TYPE_DASHBOARD_LABELS,
  EVIDENCE_TYPE_LABELS,
  EVIDENCE_TYPE_OPTIONS,
} from '../constants/evidence-labels.constants';
import {
  EVIDENCE_SUB_DIVISION_PLACEHOLDERS,
  filterChipLabel,
  taskFilterOptionLabel,
} from '../constants/evidence-messages.constants';
import type { Evidence, EvidenceFile } from '../models/evidence.model';
import { EVIDENCE_SEED } from '../data/evidence-static.data';

// Re-exported so existing consumers importing them from this file keep working.
export type { EvidenceReviewStatus, EvidenceType } from '../constants/evidence.constants';


/* ── Model & seed data ─────────────────────────────────────────────────────
 * The Evidence model and the per-client seed rows live in ../data/.
 * evidence-static.data.ts picks the active client's rows (EVIDENCE_SEED)
 * from CLIENT_MODE_VALUE / INTERNAL_AUDIT_CLIENT_KEY_VALUE. ── */

// Re-exported so existing consumers importing them from this file keep working.
export type { Evidence, EvidenceFile } from '../models/evidence.model';

const IS_INTERNAL_AUDIT_CLIENT = CLIENT_MODE_VALUE === 'internal-audit';

/* ── Internal-audit org filter sources ────────────────────────────────────
 * When CLIENT_MODE_VALUE is 'internal-audit', the Company / Division /
 * Sub-Division / Scope filter dropdowns below are populated from the active
 * client's org structure in the *-indi-org.data.ts seed files. In
 * 'audit-firm' mode they come from company-org-data.ts instead.
 *
 * Each client's EVIDENCE_SEED rows (../data/evidence-static-<client>.data.ts)
 * carry company/branch/department/scope values taken from those same seeds,
 * so picking a filter option matches real rows rather than coming up empty. ── */

function uniqueSorted(values: (string | undefined | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

const ORG_COMPANY_NAMES = COMPANIES_SEED.map(c => c.companyName);

/** All Division (branch) names in the DAR org seed, optionally scoped to a set of company names. */
function orgDivisionNames(companyFilter: string[]): string[] {
  const companies = companyFilter.length
    ? DIVISION_INDI_ORG_COMPANIES.filter(c => companyFilter.includes(c.companyName))
    :DIVISION_INDI_ORG_COMPANIES;
  return uniqueSorted(companies.flatMap(c => c.divisions.map(b => b.divisionName)));
}

/** All Sub-Division (department) names in the DAR org seed, optionally scoped to company + division names. */
function orgSubDivisionNames(companyFilter: string[], divisionFilter: string[]): string[] {
  const companies = companyFilter.length
    ? SUB_DIVISION_INDI_ORG_COMPANIES.filter(c => companyFilter.includes(c.companyName))
    : SUB_DIVISION_INDI_ORG_COMPANIES;
  // Divisions flagged `hasSubDivision: false` contribute no sub-divisions.
  const branches = companies
    .flatMap(c => c.divisions)
    .filter(b => b.hasSubDivision !== false)
    .filter(b => !divisionFilter.length || divisionFilter.includes(b.divisionName));
  return uniqueSorted(branches.flatMap(b => b.subDivisions.map((d: { subDivisionName: string }) => d.subDivisionName)));
}

/** True unless at least one division is selected and every selected division is
 *  flagged `hasSubDivision: false`. Names not found in `divisions` count as having sub-divisions. */
function selectionHasSubDivisions(
  divisions: { divisionName: string; hasSubDivision?: boolean }[],
  divisionFilter: string[],
): boolean {
  if (!divisionFilter.length) return true;
  return divisionFilter.some(name => {
    const matches = divisions.filter(d => d.divisionName === name);
    return !matches.length || matches.some(d => d.hasSubDivision !== false);
  });
}

/** Whether the Sub-Division filter applies to the selected divisions in the DAR org seed. */
function orgSubDivisionFilterVisible(companyFilter: string[], divisionFilter: string[]): boolean {
  const companies = companyFilter.length
    ? DIVISION_INDI_ORG_COMPANIES.filter(c => companyFilter.includes(c.companyName))
    : DIVISION_INDI_ORG_COMPANIES;
  return selectionHasSubDivisions(companies.flatMap(c => c.divisions), divisionFilter);
}

/** Companies in company-org-data.ts, narrowed to the selected company names. */
function orgStaticCompanies(companyFilter: string[]) {
  return ORG_STATIC_DATA.filter(c => !companyFilter.length || companyFilter.includes(c.companyName));
}

/** Divisions in company-org-data.ts, narrowed to the selected company + division names. */
function orgStaticDivisions(companyFilter: string[], divisionFilter: string[]) {
  return orgStaticCompanies(companyFilter)
    .flatMap(c => c.divisions)
    .filter(d => !divisionFilter.length || divisionFilter.includes(d.divisionName));
}

/** All Company names in company-org-data.ts. */
function staticCompanyNames(): string[] {
  return uniqueSorted(ORG_STATIC_DATA.map(c => c.companyName));
}

/** All Division names in company-org-data.ts, optionally scoped to a set of company names. */
function staticDivisionNames(companyFilter: string[]): string[] {
  return uniqueSorted(orgStaticDivisions(companyFilter, []).map(d => d.divisionName));
}

/** All Sub-Division names in company-org-data.ts, optionally scoped to company + division names. */
function staticSubDivisionNames(companyFilter: string[], divisionFilter: string[]): string[] {
  return uniqueSorted(
    orgStaticDivisions(companyFilter, divisionFilter)
      .filter(d => d.hasSubDivision !== false)
      .flatMap(d => d.subDivisions.map(sd => sd.subDivisionName)),
  );
}

/** Whether the Sub-Division filter applies to the selected divisions in company-org-data.ts. */
function staticSubDivisionFilterVisible(companyFilter: string[], divisionFilter: string[]): boolean {
  return selectionHasSubDivisions(orgStaticDivisions(companyFilter, []), divisionFilter);
}

/** All Scope names in company-org-data.ts, optionally scoped to company + division +
 *  sub-division names. Division-level scopes (divisions with `hasSubDivision: false`)
 *  are included only while no Sub-Division is selected, since they don't sit under one. */
function staticScopeNames(companyFilter: string[], divisionFilter: string[], subDivisionFilter: string[]): string[] {
  const divisions = orgStaticDivisions(companyFilter, divisionFilter);
  const subDivisionScopes = divisions
    .flatMap(d => d.subDivisions)
    .filter(sd => !subDivisionFilter.length || subDivisionFilter.includes(sd.subDivisionName))
    .flatMap(sd => sd.scopes);
  const divisionScopes = subDivisionFilter.length ? [] : divisions.flatMap(d => d.scopes ?? []);
  return uniqueSorted([...divisionScopes, ...subDivisionScopes].map(s => s.scopeName));
}

/** All top-level audit-scope names in the DAR org seed, optionally scoped to company + division + sub-division names. */
function orgScopeNames(companyFilter: string[], divisionFilter: string[], subDivisionFilter: string[]): string[] {
  const companies = companyFilter.length
    ? SCOPE_INDI_ORG_COMPANIES.filter(c => companyFilter.includes(c.companyName))
    : SCOPE_INDI_ORG_COMPANIES;
  const branches = companies
    .flatMap(c => c.divisions)
    .filter(b => !divisionFilter.length || divisionFilter.includes(b.divisionName));
  const departments = branches
    .flatMap(b => b.subDivisions)
    .filter(d => !subDivisionFilter.length || subDivisionFilter.includes(d.subDivisionName));
  // Only top-level scopes (parentScopeId === null) — sub-scopes back the
  // Evidence.subscope field, which has no filter control of its own yet.
  return uniqueSorted(
    departments.flatMap(d => d.scopes.filter(s => s.parentScopeId === null).map(s => s.scopeName)),
  );
}

/* ── Lookups ───────────────────────────────────────────────────────────────
   EvidenceComponent's Company/Division/Sub-Division fields (renamed
   there from Branch/Department) read from the same company-org-data.ts
   file as this page's filters and use the real company/branch/department
   *names* as their option values directly, so no code<->label translation
   is needed for those three fields — the old COMPANY_LABELS/BRANCH_LABELS/
   DEPARTMENT_LABELS maps (which assumed EvidenceComponent emitted coded
   values like 'crowe_uae'/'dubai'/'internal_audit') have been removed.
   EvidenceComponent's own form fields are named division/subDivision
   (not branch/department), so f.company/f.division/f.subDivision are
   mapped onto Evidence.company/Evidence.branch/Evidence.department below,
   and the same mapping runs in reverse (e.company/e.branch/e.department ->
   company/division/subDivision) when seeding the edit drawer. EVIDENCE_TASK_TITLES
   is unrelated to that and is kept as-is. ── */

function formatEvidenceDate(d: Date): string {
  return new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Count of evidence items uploaded by the given name, matching an exact display status (null = total). */
export function countEvidenceForAuditorByStatus(auditorName: string, displayStatus: string | null): number {
  return EVIDENCE_SEED.filter(e =>
    e.uploadedBy === auditorName &&
    (displayStatus === null || (EVIDENCE_REVIEW_STATUS_LABELS[e.status ?? EVIDENCE_DEFAULT_REVIEW_STATUS]) === displayStatus),
  ).length;
}

/**
 * Every evidence item uploaded by the given name, shaped for the
 * auditor-execution tab's "My Evidences" table.
 */
export function getEvidenceForAuditor(auditorName: string): {
  evidence: string; scope: string; type: string; risk: string; status: string; dueDate: string;
  detail: Evidence;
}[] {
  return EVIDENCE_SEED
    .filter(e => e.uploadedBy === auditorName)
    .map(e => ({
      evidence: e.title,
      scope: e.scope,
      type: EVIDENCE_TYPE_DASHBOARD_LABELS[e.evidenceType],
      risk: e.risk ?? EVIDENCE_DEFAULT_RISK,
      status: EVIDENCE_REVIEW_STATUS_LABELS[e.status ?? EVIDENCE_DEFAULT_REVIEW_STATUS],
      dueDate: formatEvidenceDate(e.createdDate),
      detail: e,
    }));
}

/* ── Component ──────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-evidence-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    TooltipModule,
    TagModule,
    PopoverModule,
    ConfirmActionDialogComponent,
    PaginationBarComponent,
  
    DrawIconComponent,],
  templateUrl: './evidence-list.component.html',
  styleUrl: './evidence-list.component.scss',
})
export class EvidenceListComponent implements OnInit {
  @ViewChild('filterPanel') filterPanel!: Popover;
  @ViewChild('filesPopover') filesPopover!: Popover;

  private readonly drawer     = inject(RightDrawerService);
  private readonly downloader = inject(FileDownloadService);

  /* ── Data ── */
  readonly evidence = signal<Evidence[]>(EVIDENCE_SEED);

  /* ── View mode ── */
  readonly viewMode = signal<EvidenceViewMode>(EvidenceViewModes.Grid);

  /* ── Template constants ── */
  readonly EvidenceViewModes       = EvidenceViewModes;
  readonly EvidenceSortColumns     = EvidenceSortColumns;
  readonly EvidenceBlockActions    = EvidenceBlockActions;
  readonly subDivisionPlaceholders = EVIDENCE_SUB_DIVISION_PLACEHOLDERS;
  readonly filePreviewCount        = EVIDENCE_FILE_PREVIEW_COUNT;

  /* ── Filters ── */
  readonly searchQuery         = signal('');
  readonly selectedFindings    = signal<string[]>([]);
  readonly selectedTypes       = signal<EvidenceType[]>([]);
  readonly selectedScopes      = signal<string[]>([]);
  readonly selectedTasks       = signal<string[]>([]);
  readonly selectedCompanies    = signal<string[]>([]);
  /** "Division" in the UI (renamed from Branch). */
  readonly selectedDivisions    = signal<string[]>([]);
  /** "Sub-Division" in the UI (renamed from Department). */
  readonly selectedSubDivisions = signal<string[]>([]);
  readonly selectedAuditors     = signal<string[]>([]);
  readonly dateRange           = signal<(Date | null)[] | null>(null);
  /** Scope to a specific review-workflow status (from the auditor-execution "My Evidences" cards). */
  readonly statusFilter        = signal<EvidenceReviewStatus | null>(null);

  /* ── Sort ── */
  readonly sortColumn    = signal<EvidenceSortColumn | null>(EvidenceSortColumns.CreatedDate);
  readonly sortDirection = signal<EvidenceSortDirection>(EvidenceSortDirections.Desc);

  /* ── Pagination ── */
  readonly pageSize    = signal(EVIDENCE_LIST_PAGE_SIZE);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = EVIDENCE_PAGE_SIZE_OPTIONS;

  /* ── Files popover ── */
  readonly moreFilesEvidence = signal<Evidence | null>(null);

  /* ── Confirmation dialog ── */
  readonly displayConfirmation = signal(false);
  readonly confirmationAction  = signal<EvidenceBlockAction>(EvidenceBlockActions.Deactivate);
  private readonly pendingEvidence = signal<Evidence | null>(null);
  readonly confirmationTarget  = this.pendingEvidence;

  readonly allSubDivisionsLabel = $localize`:@@audit.evidence.allSubDivisions:All sub-divisions`;
  readonly noSubDivisionsLabel = $localize`:@@audit.evidence.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  /* ── Filter options ── */
  readonly evidenceTypeOptions: { label: string; value: EvidenceType }[] = [
    { label: $localize`:@@audit.evidence.typeDocument:Document`, value: 'document' },
    { label: $localize`:@@audit.evidence.typeScreenshot:Screenshot`, value: 'screenshot' },
    { label: $localize`:@@audit.evidence.typeInterviewNotes:Interview Notes`, value: 'interview_notes' },
    { label: $localize`:@@audit.evidence.typeSystemLog:System Log`, value: 'system_log' },
    { label: $localize`:@@audit.evidence.typeEmail:Email`, value: 'email' },
    { label: $localize`:@@audit.evidence.typePhysicalInspection:Physical Inspection`, value: 'physical_inspection' },
    { label: $localize`:@@audit.evidence.typeOther:Other`, value: 'other' },
  ];

  fileDownloadTooltip(fileName: string, size: number): string {
    const fileSize = this.formatFileSize(size);

    return $localize`:@@audit.evidence.fileDownloadTooltip:${fileName}:fileName: · ${fileSize}:fileSize: — click to download`;
  }

  fileDownloadSimpleTooltip(fileName: string): string {
    return $localize`:@@audit.evidence.fileDownloadSimpleTooltip:${fileName}:fileName: — click to download`;
  }

  readonly scopeFilterOptions = computed(() => {
    if (IS_INTERNAL_AUDIT_CLIENT) {
      return orgScopeNames(this.selectedCompanies(), this.selectedDivisions(), this.selectedSubDivisions())
        .map(s => ({ label: s, value: s }));
    }
    return staticScopeNames(this.selectedCompanies(), this.selectedDivisions(), this.selectedSubDivisions())
      .map(s => ({ label: s, value: s }));
  });

  readonly taskFilterOptions = computed(() => {
    const map = new Map<string, string>();
    this.evidence().forEach(e => map.set(e.taskId, e.taskTitle));
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, label]) => ({ label: taskFilterOptionLabel(value, label), value }));
  });

  readonly companyFilterOptions = computed(() => {
    if (IS_INTERNAL_AUDIT_CLIENT) {
      return uniqueSorted(ORG_COMPANY_NAMES).map(v => ({ label: v, value: v }));
    }
    return staticCompanyNames().map(v => ({ label: v, value: v }));
  });

  /** "Division" filter options (renamed from Branch). */
  readonly divisionFilterOptions = computed(() => {
    if (IS_INTERNAL_AUDIT_CLIENT) {
      return orgDivisionNames(this.selectedCompanies()).map(v => ({ label: v, value: v }));
    }
    return staticDivisionNames(this.selectedCompanies()).map(v => ({ label: v, value: v }));
  });

  /** "Sub-Division" filter options (renamed from Department). */
  readonly subDivisionFilterOptions = computed(() => {
    if (IS_INTERNAL_AUDIT_CLIENT) {
      return orgSubDivisionNames(this.selectedCompanies(), this.selectedDivisions()).map(v => ({ label: v, value: v }));
    }
    return staticSubDivisionNames(this.selectedCompanies(), this.selectedDivisions()).map(v => ({ label: v, value: v }));
  });

  /** Hidden when every selected division is flagged `hasSubDivision: false`. */
  readonly subDivisionFilterVisible = computed(() => {
    if (IS_INTERNAL_AUDIT_CLIENT) {
      return orgSubDivisionFilterVisible(this.selectedCompanies(), this.selectedDivisions());
    }
    return staticSubDivisionFilterVisible(this.selectedCompanies(), this.selectedDivisions());
  });

  readonly auditorFilterOptions = computed(() => {
    const set = new Set(this.evidence().map(e => e.uploadedBy).filter(Boolean) as string[]);
    return Array.from(set).sort().map(v => ({ label: v, value: v }));
  });

  /* ── Active filter count & chips ── */
  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedTypes().length)       count++;
    if (this.selectedScopes().length)      count++;
    if (this.selectedTasks().length)       count++;
    if (this.selectedCompanies().length)    count++;
    if (this.selectedDivisions().length)    count++;
    if (this.selectedSubDivisions().length) count++;
    if (this.selectedAuditors().length)     count++;
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) count++;
    return count;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: EvidenceFilterKey; label: string }[] = [];
    const typeCount = this.selectedTypes().length;
    if (typeCount) { chips.push({ key: 'types', label: $localize`:@@audit.evidence.filterTypeCount:Type: ${typeCount}:count:` }); }
    const scopeCount = this.selectedScopes().length;
    if (scopeCount) { chips.push({ key: 'scopes', label: $localize`:@@audit.evidence.filterScopeCount:Scope: ${scopeCount}:count:` });}
    const taskCount = this.selectedTasks().length;
    if (taskCount) { chips.push({ key: 'tasks', label: $localize`:@@audit.evidence.filterTaskCount:Task: ${taskCount}:count:` }); }
    const companyCount = this.selectedCompanies().length;
    if (companyCount) { chips.push({ key: 'companies', label: $localize`:@@audit.evidence.filterCompanyCount:Company: ${companyCount}:count:` }); }
    const divisionCount = this.selectedDivisions().length;
    if (divisionCount) { chips.push({ key: 'divisions', label: $localize`:@@audit.evidence.filterDivisionCount:Division: ${divisionCount}:count:` }); }
    const subDivisionCount = this.selectedSubDivisions().length;
    if (subDivisionCount) { chips.push({ key: 'subdivisions', label: $localize`:@@audit.evidence.filterSubDivisionCount:Sub-Division: ${subDivisionCount}:count:` }); }
    const auditorCount = this.selectedAuditors().length;
    if (auditorCount) { chips.push({ key: 'auditors', label: $localize`:@@audit.evidence.filterAuditorCount:Auditor: ${auditorCount}:count:` }); }
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) { chips.push({ key: 'date', label: $localize`:@@audit.evidence.dateRange:Date range` }); }
    return chips;
  });

  removeFilter(key: EvidenceFilterKey): void {
    switch (key) {
      case EvidenceFilterKeys.Types:        this.selectedTypes.set([]);       break;
      case EvidenceFilterKeys.Scopes:       this.selectedScopes.set([]);      break;
      case EvidenceFilterKeys.Tasks:        this.selectedTasks.set([]);       break;
      case EvidenceFilterKeys.Companies:    this.selectedCompanies.set([]);    this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); break;
      case EvidenceFilterKeys.Divisions:    this.selectedDivisions.set([]);    this.selectedSubDivisions.set([]); break;
      case EvidenceFilterKeys.SubDivisions: this.selectedSubDivisions.set([]); break;
      case EvidenceFilterKeys.Auditors:     this.selectedAuditors.set([]);     break;
      case EvidenceFilterKeys.Date:         this.dateRange.set(null);         break;
    }
    this.currentPage.set(1);
  }

  /* ── Derived: filtered + sorted list ── */
  readonly filtered = computed(() => {
    let list = this.evidence();

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(e =>
      e.id.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      (e.findingId ?? '').toLowerCase().includes(q),
    );

    const findings = this.selectedFindings();
    if (findings.length) list = list.filter(e => !!e.findingId && findings.includes(e.findingId));

    const types = this.selectedTypes();
    if (types.length) list = list.filter(e => types.includes(e.evidenceType));

    const scopes = this.selectedScopes();
    if (scopes.length) list = list.filter(e => scopes.includes(e.scope));

    const tasks = this.selectedTasks();
    if (tasks.length) list = list.filter(e => tasks.includes(e.taskId));

    const companies = this.selectedCompanies();
    if (companies.length) list = list.filter(e => e.company && companies.includes(e.company));

    const divisions = this.selectedDivisions();
    if (divisions.length) list = list.filter(e => e.branch && divisions.includes(e.branch));

    const subDivisions = this.selectedSubDivisions();
    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    if (subDivisions.length && this.subDivisionFilterVisible()) list = list.filter(e => e.department && subDivisions.includes(e.department));

    const auditors = this.selectedAuditors();
    if (auditors.length) list = list.filter(e => e.uploadedBy && auditors.includes(e.uploadedBy));

    const status = this.statusFilter();
    if (status) list = list.filter(e => (e.status ?? EVIDENCE_DEFAULT_REVIEW_STATUS) === status);

    const range = this.dateRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to   = range[1]?.getTime();
      list = list.filter(e => {
        const t = e.createdDate.getTime();
        if (from !== undefined && t < from) return false;
        if (to   !== undefined && t > to)   return false;
        return true;
      });
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === EvidenceSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortValue(a, col);
        const bv = this.sortValue(b, col);
        if (av < bv) return -1 * dir;
        if (av > bv) return  1 * dir;
        return 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * size, page * size);
  });

  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedFindings().length ||
    !!this.selectedTypes().length ||
    !!this.selectedScopes().length ||
    !!this.selectedTasks().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedSubDivisions().length ||
    !!this.selectedAuditors().length ||
    !!(this.dateRange()?.[0] || this.dateRange()?.[1]),
  );

  private readonly route    = inject(ActivatedRoute);

  /**
   * Pre-applies filters when navigated from a dashboard card, e.g.
   * /evidencelist?status=under_review&auditorId=Bob%20Smith
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const auditorId = params.get(EVIDENCE_QUERY_PARAMS.AuditorId);
      const status = params.get(EVIDENCE_QUERY_PARAMS.Status) as EvidenceReviewStatus | null;
      if (auditorId) this.selectedAuditors.set([auditorId]);
      this.statusFilter.set(
        status && (Object.values(EvidenceReviewStatuses) as EvidenceReviewStatus[]).includes(status)
          ? status
          : null,
      );
      if (auditorId || status) this.currentPage.set(1);
    });
  }

  /* ── Filter handlers ── */
  onSearchChange(q: string)                    { this.searchQuery.set(q);              this.currentPage.set(1); }
  onFindingsChange(v: string[])                { this.selectedFindings.set(v ?? []);   this.currentPage.set(1); }
  onTypesChange(v: EvidenceType[])             { this.selectedTypes.set(v ?? []);      this.currentPage.set(1); }
  onScopesChange(v: string[])                  { this.selectedScopes.set(v ?? []);     this.currentPage.set(1); }
  onTasksChange(v: string[])                   { this.selectedTasks.set(v ?? []);      this.currentPage.set(1); }
  onCompaniesChange(v: string[])               { this.selectedCompanies.set(v ?? []);   this.selectedDivisions.set([]); this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  /** Division filter (renamed from Branch). */
  onDivisionsChange(v: string[])               { this.selectedDivisions.set(v ?? []);   this.selectedSubDivisions.set([]); this.currentPage.set(1); }
  /** Sub-Division filter (renamed from Department). */
  onSubDivisionsChange(v: string[])            { this.selectedSubDivisions.set(v ?? []); this.currentPage.set(1); }
  onAuditorsChange(v: string[])                { this.selectedAuditors.set(v ?? []);    this.currentPage.set(1); }
  onDateRangeChange(r: (Date | null)[] | null) { this.dateRange.set(r);                this.currentPage.set(1); }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedFindings.set([]);
    this.selectedTypes.set([]);
    this.selectedScopes.set([]);
    this.selectedTasks.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedSubDivisions.set([]);
    this.selectedAuditors.set([]);
    this.dateRange.set(null);
    this.currentPage.set(1);
  }

  /* ── Sort ── */
  onSort(col: EvidenceSortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d =>
        d === EvidenceSortDirections.Asc ? EvidenceSortDirections.Desc : EvidenceSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set(EvidenceSortDirections.Asc);
    }
  }
  sortIconFor(col: EvidenceSortColumn): string {
    if (this.sortColumn() !== col) return EVIDENCE_SORT_ICONS.Unsorted;
    return EVIDENCE_SORT_ICONS[this.sortDirection()];
  }
  private sortValue(e: Evidence, col: EvidenceSortColumn): string | number {
    switch (col) {
      case EvidenceSortColumns.Id:           return parseInt(e.id.replace(/\D/g, ''), 10) || 0;
      case EvidenceSortColumns.Title:        return e.title.toLowerCase();
      case EvidenceSortColumns.EvidenceType: return e.evidenceType;
      case EvidenceSortColumns.Scope:        return e.scope.toLowerCase();
      case EvidenceSortColumns.FindingId:    return (e.findingId ?? '').toLowerCase();
      case EvidenceSortColumns.CreatedDate:  return e.createdDate.getTime();
      case EvidenceSortColumns.Files:        return e.files.length;
    }
  }

  evidenceTypeLabel(t: EvidenceType): string {
    return EVIDENCE_TYPE_LABELS[t] ?? t;
  }

  /* ── Pagination ── */
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

  setViewMode(m: EvidenceViewMode): void { this.viewMode.set(m); }

  /* ── Actions ── */
  async openAdd(): Promise<void> {
    const ref = this.drawer.open<AddEvidenceResult, AddEvidenceDrawerData>(
      EvidenceComponent,
      { width: EVIDENCE_DRAWER_WIDTH, data: { mode: EvidenceDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (result) this.addEvidenceFromResult(result);
  }

  async openEdit(e: Evidence): Promise<void> {
    const ref = this.drawer.open<AddEvidenceResult, AddEvidenceDrawerData>(
      EvidenceComponent,
      {
        width: EVIDENCE_DRAWER_WIDTH,
        data: {
          mode: EvidenceDrawerModes.Edit,
          // company/division/subDivision/scope/subscope/taskId are included so
          // the drawer's cascading dropdowns pre-fill correctly (see the
          // ordering note on EvidenceComponent.ngOnInit) — previously only
          // title/description were passed, so every other field re-opened blank.
          // EvidenceComponent's form fields are named division/subDivision
          // (renamed from branch/department there), so Evidence.branch /
          // Evidence.department are mapped onto those keys here.
          existing: {
            id: e.id,
            title: e.title,
            description: e.description,
            evidenceType: e.evidenceType,
            company: e.company,
            division: e.branch,
            subDivision: e.department,
            scope: e.scope,
            subscope: e.subscope,
            taskId: e.taskId,
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (result) this.updateEvidenceFromResult(e.id, result);
  }

  /**
   * Turns the Add Evidence drawer's raw form result into a full `Evidence`
   * record and puts it straight into the list — previously this just
   * console.info'd the result, so a newly added item never actually showed
   * up anywhere. Prepending plus resetting to page 1 means it's visible
   * immediately regardless of the current sort column (the default sort is
   * Created ↓, which already puts it first on its own).
   */
  private addEvidenceFromResult(result: AddEvidenceResult): void {
    const form = result.form;
    const newEvidence: Evidence = {
      id: this.nextEvidenceId(),
      title: form.title,
      evidenceType: form.evidenceType as EvidenceType,
      scope: form.scope,
      subscope: form.subscope,
      taskId: form.taskId,
      taskTitle: EVIDENCE_TASK_TITLES[form.taskId] ?? '',
      createdDate: new Date(),
      files: this.toEvidenceFiles(form.documents),
      description: form.description,
      uploadedBy: EVIDENCE_CURRENT_USER_NAME,
      company: form.company,
      // EvidenceComponent's form fields are division/subDivision
      // (renamed from branch/department there) — mapped back onto
      // Evidence.branch/Evidence.department here.
      branch: form.division,
      department: form.subDivision ?? undefined,
      isActive: true,
      status: EvidenceReviewStatuses.Uploaded,
    };
    this.evidence.update(list => [newEvidence, ...list]);
    this.currentPage.set(1);

    // Temporary bridge: also surface this freshly submitted evidence in the
    // Pending Approvals queue, awaiting review — the two lists are still
    // separate mock stores, so this just mirrors the essentials across.
    // Risk rating defaults to 'medium' since Add Evidence doesn't collect
    // one yet; adjust here once it does.
    const pendingItem: PendingItem = {
      id: newEvidence.id,
      type: EVIDENCE_PENDING_ITEM_DEFAULTS.Type,
      status: EVIDENCE_PENDING_ITEM_DEFAULTS.Status,
      riskRating: EVIDENCE_PENDING_ITEM_DEFAULTS.RiskRating,
      title: newEvidence.title,
      description: newEvidence.description ?? '',
      submittedBy: EVIDENCE_CURRENT_USER_NAME,
      submittedDate: newEvidence.createdDate,
      company: newEvidence.company ?? '',
      division: newEvidence.branch ?? '',
      subDivision: newEvidence.department ?? '',
    };
    addPendingItem(pendingItem);
  }

  /** Applies an edit-drawer result back onto the matching record in the list. */
  private updateEvidenceFromResult(id: string, result: AddEvidenceResult): void {
    const form = result.form;
    const newFiles = this.toEvidenceFiles(form.documents);
    this.evidence.update(list => list.map(c => c.id !== id ? c : {
      ...c,
      title: form.title,
      evidenceType: form.evidenceType as EvidenceType,
      scope: form.scope,
      subscope: form.subscope,
      taskId: form.taskId,
      taskTitle: EVIDENCE_TASK_TITLES[form.taskId] ?? c.taskTitle,
      description: form.description,
      company: form.company,
      // EvidenceComponent's form fields are division/subDivision
      // (renamed from branch/department there) — mapped back onto
      // Evidence.branch/Evidence.department here.
      branch: form.division,
      department: form.subDivision ?? undefined,
      // Keep the existing files unless the user actually attached new ones
      // in the edit drawer (the drawer doesn't currently show previously
      // uploaded files back to the user, so an empty selection here just
      // means "didn't touch the attachments").
      files: newFiles.length ? newFiles : c.files,
    }));
  }

  private toEvidenceFiles(documents?: File[]): EvidenceFile[] {
    return (documents ?? []).map(f => ({ name: f.name, size: f.size, file: f }));
  }

  /** Next sequential EV-### id, based on the highest numeric id currently in the list. */
  private nextEvidenceId(): string {
    const max = this.evidence().reduce(
      (m, e) => Math.max(m, parseInt(e.id.replace(/\D/g, ''), 10) || 0), 0,
    );
    return `${EVIDENCE_ID_PREFIX}${String(max + 1).padStart(EVIDENCE_ID_PAD_LENGTH, '0')}`;
  }

  openView(e: Evidence): void {
    this.drawer.open<EvidenceProfileComponent, EvidenceDetailDrawerData>(
      EvidenceProfileComponent,
      { width: EVIDENCE_DRAWER_WIDTH, data: { evidence: e } },
    );
  }

  /* ── Activate / Deactivate ── */
  openConfirmation(evidence: Evidence): void {
    this.pendingEvidence.set(evidence);
    this.confirmationAction.set(evidence.isActive ? EvidenceBlockActions.Deactivate : EvidenceBlockActions.Activate);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.pendingEvidence.set(null);
  }

  confirmToggleBlocked(): void {
    const e = this.pendingEvidence();
    if (e) {
      this.evidence.update(list =>
        list.map(c => c.id === e.id ? { ...c, isActive: !c.isActive } : c)
      );
    }
    this.closeConfirmation();
  }

  /* ── Files popover ── */
  showMoreFiles(e: Evidence, event: MouseEvent): void {
    this.moreFilesEvidence.set(e);
    this.filesPopover.toggle(event);
  }

  /* ── Helpers ── */
  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${EVIDENCE_FILE_SIZE_UNITS[0]}`;
    const k = EVIDENCE_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${EVIDENCE_FILE_SIZE_UNITS[i]}`;
  }

  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return EVIDENCE_FILE_ICONS[ext] ?? EVIDENCE_FILE_ICON_DEFAULT;
  }

  downloadFile(f: EvidenceFile): void {
    const source = f.file ?? f.url;
    if (source) this.downloader.download(source, f.name);
  }

  trackById = (_: number, e: Evidence) => e.id;
}
