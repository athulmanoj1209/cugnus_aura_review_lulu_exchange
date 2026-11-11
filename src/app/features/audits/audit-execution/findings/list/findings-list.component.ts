import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
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
import { Popover, PopoverModule } from 'primeng/popover';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import {
  AuditFinding,
  FindingSeverity,
  FindingStatus,
} from '@/app/features/audits/audit-execution/findings/services/audit-finding.service';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  FindingsComponent,
  AddFindingDrawerData,
  AddFindingResult,
} from '../manage/findings.component';
import {
  FindingsProfileComponent,
  FindingProfileData,
} from '../profile/findings-profile.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { ORG_STATIC_DATA } from '@/app/features/audits/organization/company/company-org-data';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { RichAuditFinding, MOCK_FINDINGS, isOpenFinding, findingAgeDays } from '@/app/features/audits/audit-execution/findings/audit-finding-data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import * as XLSX from 'xlsx';
import {
  CRITICAL_HIGH_SEVERITIES,
  FINDING_AGING_DAYS,
  FINDING_CURRENT_USER_OWNER,
  FINDING_DATE_LOCALE,
  FINDING_DEFAULT_SEVERITY,
  FINDING_DRAWER_WIDTH,
  FINDING_DUE_DATE_FORMAT_OPTIONS,
  FINDING_ID_PAD_LENGTH,
  FINDING_ID_PREFIX,
  FINDING_INITIALS_WORD_COUNT,
  FINDING_LIST_PAGE_SIZE,
  FINDING_OPEN_ADD_FLAG,
  FINDING_PAGE_SIZE_OPTIONS,
  FINDING_QUERY_PARAMS,
  FINDING_SEVERITY_RANK,
  FINDING_VIEW_PRESETS,
  FindingBlockActions,
  FindingDrawerModes,
  FindingFilterKeys,
  FindingSeverities,
  FindingSortColumns,
  FindingSortDirections,
  FindingStatuses,
  FindingViewModes,
  OVERDUE_STATUSES,
  type FindingBlockAction,
  type FindingFilterKey,
  type FindingSortColumn,
  type FindingSortDirection,
  type FindingViewMode,
} from '../constants/findings.constants';
import {
  AUDITOR_FINDING_STATUS_LABELS,
  FINDING_ACTIVE_ICONS,
  FINDING_FILTER_CHIP_LABELS,
  FINDING_LOADING_ICON,
  FINDING_RISK_LABELS,
  FINDING_RISK_VALUES,
  FINDING_SEVERITY_COLORS,
  FINDING_SEVERITY_LABELS,
  FINDING_SEVERITY_OPTIONS,
  FINDING_SEVERITY_RISK_LABELS,
  FINDING_SORT_ICONS,
  FINDING_STATUS_LABELS,
  FINDING_STATUS_OPTIONS,
  FINDING_VIEW_ICON,
} from '../constants/findings-labels.constants';
import {
  FINDING_ACTIVE_LABELS,
  FINDING_EMPTY_VALUE,
  FINDING_SUB_DIVISION_FILTER_PLACEHOLDERS,
  NO_OVERDUE_FINDINGS,
  REPEATED_FINDING_TOOLTIP,
  dueOnLabel,
  dueRangeLabel,
  filterChipLabel,
  previousOccurrenceTooltip,
} from '../constants/findings-messages.constants';

// Company/Division/Sub-Division/Scope/Sub-scope filter options below come
// from the shared company-org-data.ts file (the same common Company ->
// Division -> Sub-Division -> Scope -> Sub-scope static data used by the
// Add Member modal, Members list, Companies list, Add Risk drawer, Risk
// Register, Scope Jobs, Evidence Repository and Observations filters)
// instead of being scraped off whatever values happen to appear on
// MOCK_FINDINGS — so the filter always offers the full canonical list.
// Division narrows to the selected Company(ies)' divisions, Sub-Division
// narrows to the selected Company(ies)+Division(s)' sub-divisions, Scope
// narrows to the selected .../Sub-Division(s)' scopes, and Sub-scope
// narrows to the selected .../Scope(s)' sub-scopes — same cascading
// behaviour as those other pages' multi-select filters.
//
// CLIENT_MODE support: when CLIENT_MODE is 'internal-audit' these filters
// (and the Add/Edit Finding drawer's cascading picker, once it's wired the
// same way) read from ORG_STATIC_DATA_INTERNAL_AUDIT — the DAR Exchange
// single-org seed built from company/division/audit-scope
// *-static-indi-org.data.ts — instead of the multi-company ORG_STATIC_DATA
// roster, exactly the same CLIENT_MODE ? … : … pattern CompanyDataService
// already uses. See `orgData` below.
// Adjust the '@/app/data/company-org-data' and
// '@/app/data/org-data-internal-audit.adapter' paths if those files live
// elsewhere.
//
// AuditFinding.company / .branch / .department / .scope / .subscope are
// plain display-name strings (not ids/codes), so the option *values* here
// are the company/division/sub-division/scope/subscope *names* themselves
// (the underlying data fields are still called .branch and .department —
// only the filter's own labels/variables have been renamed to Division and
// Sub-Division here; renaming the AuditFinding fields themselves would
// touch audit-finding.service.ts, which isn't part of this component). The
// 12 seed MOCK_FINDINGS records below have been aligned to real
// companies/divisions/sub-divisions from company-org-data.ts — they
// previously used unrelated placeholder names ('Crowe UAE'/'Crowe Oman'/
// 'Crowe Saudi Arabia'/'Crowe Qatar' with divisions like 'Dubai'/'Muscat'/
// 'Riyadh'/'Doha', and generic sub-division labels like 'Finance'/'IT
// Security'/'Treasury' that don't exist in company-org-data.ts under those
// exact names), which never matched anything and would have made these
// filters show zero records too.
//
// The "+ New Finding" drawer (FindingsComponent) is now wired the same
// way (Company/Division/Sub-Division cascading, plus the fully cascading
// Company→Division→Sub-Division→Scope→Sub-scope picker, like Add
// Evidence's and Add Observation's drawers already had). Its option
// *values* are the same company/division/sub-division/scope/subscope
// *names* used here, so the old COMPANY_LABELS/BRANCH_LABELS/
// DEPARTMENT_LABELS/SCOPE_LABELS/SUBSCOPE_LABELS code-translation lookup
// that used to bridge between its local codes (crowe_uae, dubai,
// internal_audit, ...) and these display names is gone — onAddFinding()
// and onEditFinding() below now pass company/branch/department/scope/
// subscope straight through instead of translating (still named branch/
// department on the FindingsComponent's own form contract). Risk isn't
// part of company-org-data.ts, so RISK_LABELS/RISK_VALUES stay as a local
// code ↔ label lookup, unchanged.


type SortColumn = FindingSortColumn;
type SortDir    = FindingSortDirection;
type ViewMode   = FindingViewMode;

export interface EditFindingPayload {
  finding: AuditFinding;
  existing: {
    id:          string;
    title:       string;
    severity?:   string;
    subDivision?: string;
    status:      string;
    dueDate?:    Date | null;
  };
}

// RichAuditFinding and MOCK_FINDINGS now live in finding-data.ts — shared
// with audit-findings-tab.component.ts (the Findings dashboard), so the two
// pages can never disagree about what a finding is or how many of them
// exist. See that file's doc comment for why this used to be a second,
// disconnected mock dataset here.
//
// The auditor-aggregation helpers below (countOpenFindingsForAuditor,
// countFindingsForAuditorByDisplayStatus, countHighRiskFindingsForAuditor,
// getFindingsForAuditor) stayed here rather than moving to
// audit-finding-data.ts — auditor-overview-tab.component.ts and auditor-execution-tab.component.ts both
// import them from this component file, so they need to keep being
// exported from here.

/** Count of open findings assigned to the given auditor id — used by the auditor overview KPI card. */
export function countOpenFindingsForAuditor(auditorId: string): number {
  return MOCK_FINDINGS.filter(f => f.status === FindingStatuses.Open && f.assignedAuditor?.id === auditorId).length;
}

export function countOpenFindingsForTeam(auditorIds: readonly string[]): number {
  const team = new Set(auditorIds);
  return new Set(MOCK_FINDINGS.filter(f => f.status === FindingStatuses.Open && f.assignedAuditor && team.has(f.assignedAuditor.id)).map(f => f.id)).size;
}

/** Count of repeated findings (`isRepeated`) assigned to the given auditor — auditor overview KPI card. */
export function countRepeatedFindingsForAuditor(auditorId: string): number {
  return MOCK_FINDINGS.filter(f => f.isRepeated && f.assignedAuditor?.id === auditorId).length;
}

/** Count of repeated findings (`isRepeated`) across the whole team — team overview KPI card. */
export function countRepeatedFindingsForTeam(auditorIds: readonly string[]): number {
  return getFindingsForTeam(auditorIds).filter(f => f.isRepeated).length;
}

/** Every finding assigned to any of the given team auditors — the team as a whole, not per auditor. */
function getFindingsForTeam(auditorIds: readonly string[]): RichAuditFinding[] {
  const team = new Set(auditorIds);
  return MOCK_FINDINGS.filter(f => f.assignedAuditor && team.has(f.assignedAuditor.id));
}

export interface TeamFindingCount {
  label: string;
  count: number;
}

/** Team's findings per severity, Critical → Low. */
export function getTeamFindingSeverityCounts(auditorIds: readonly string[]): (TeamFindingCount & { severity: FindingSeverity })[] {
  const findings = getFindingsForTeam(auditorIds);
  return [FindingSeverities.Critical, FindingSeverities.High, FindingSeverities.Medium, FindingSeverities.Low].map(severity => ({
    severity,
    label: FINDING_SEVERITY_LABELS[severity],
    count: findings.filter(f => f.severity === severity).length,
  }));
}

/**
 * Team's findings per actual finding status (one bar each, in
 * FINDING_STATUS_OPTIONS order), plus a trailing "Repeated" bar — findings
 * flagged `isRepeated`. Repeated is a flag, not a status, so those findings
 * are also counted in their status bar.
 */
export function getTeamFindingStatusCounts(auditorIds: readonly string[]): (TeamFindingCount & { key: string })[] {
  const findings = getFindingsForTeam(auditorIds);
  return [
    ...FINDING_STATUS_OPTIONS.map(option => ({
      key: option.value as string,
      label: option.label,
      count: findings.filter(f => f.status === option.value).length,
    })),
    { key: 'repeated', label: 'Repeated', count: findings.filter(f => f.isRepeated).length },
  ];
}

/** Age buckets of the team-overview "Findings Aging" chart. */
export const TEAM_FINDING_AGING_BUCKETS: { key: string; label: string; minDays: number; maxDays: number | null }[] = [
  { key: 'fresh', label: '0–7 days', minDays: 0, maxDays: 7 },
  { key: 'recent', label: '8–30 days', minDays: 8, maxDays: 30 },
  { key: 'aging', label: '31–60 days', minDays: 31, maxDays: 60 },
  { key: 'stale', label: '60+ days', minDays: 61, maxDays: null },
];

/** Team's not-yet-closed findings (anything but closed/rejected) bucketed by age. */
export function getTeamFindingAging(auditorIds: readonly string[], now: Date = new Date()): (TeamFindingCount & { key: string })[] {
  const ages = getFindingsForTeam(auditorIds).filter(isOpenFinding).map(f => findingAgeDays(f, now));
  return TEAM_FINDING_AGING_BUCKETS.map(bucket => ({
    key: bucket.key,
    label: bucket.label,
    count: ages.filter(age => age >= bucket.minDays && (bucket.maxDays === null || age <= bucket.maxDays)).length,
  }));
}

/** Display label for the auditor-execution tab's Findings summary cards/table, per real FindingStatus. */
const FINDING_STATUS_DISPLAY = AUDITOR_FINDING_STATUS_LABELS;

function findingRiskLabel(severity: FindingSeverity): 'High' | 'Medium' | 'Low' {
  return FINDING_SEVERITY_RISK_LABELS[severity];
}

/** Count of findings assigned to the auditor, matching an exact display status (null = total). */
export function countFindingsForAuditorByDisplayStatus(auditorId: string, displayStatus: string | null): number {
  return MOCK_FINDINGS.filter(f =>
    f.assignedAuditor?.id === auditorId &&
    (displayStatus === null || FINDING_STATUS_DISPLAY[f.status] === displayStatus),
  ).length;
}

/** Count of high/critical-severity findings assigned to the auditor. */
export function countHighRiskFindingsForAuditor(auditorId: string): number {
  return MOCK_FINDINGS.filter(f => f.assignedAuditor?.id === auditorId && CRITICAL_HIGH_SEVERITIES.includes(f.severity)).length;
}

/**
 * Every finding assigned to the given auditor, shaped for the
 * auditor-execution tab's "My Findings" table.
 */
export function getFindingsForAuditor(auditorId: string): {
  finding: string; audit: string; scope: string; risk: string; status: string; owner: string;
  detail: FindingProfileData;
}[] {
  return MOCK_FINDINGS
    .filter(f => f.assignedAuditor?.id === auditorId)
    .map(f => {
      const rich = f as RichAuditFinding;
      return {
        finding: rich.title,
        audit: rich.subDivision,
        scope: rich.scope ?? FINDING_EMPTY_VALUE,
        risk: findingRiskLabel(rich.severity),
        status: FINDING_STATUS_DISPLAY[rich.status],
        owner: rich.owner?.fullName ?? FINDING_EMPTY_VALUE,
        detail: {
          id: rich.id, title: rich.title, severity: rich.severity, status: rich.status,
          subDivision: rich.subDivision, scope: rich.scope, subscope: rich.subscope,
          taskId: rich.taskId, company: rich.company, division: rich.division, risk: rich.risk,
          dueDate: rich.dueDate, createdAt: rich.createdAt, owner: rich.owner,
          description: rich.description, observationIds: rich.observationIds,
          documents: rich.documents, financialImpact: rich.financialImpact,
          isRepeated: rich.isRepeated, flaggedForEscalation: rich.flaggedForEscalation,
          daysOverdue: rich.daysOverdue,
        },
      };
    });
}
// RichAuditFinding and MOCK_FINDINGS now live in finding-data.ts — shared
// with audit-findings-tab.component.ts (the Findings dashboard), so the two
// pages can never disagree about what a finding is or how many of them
// exist. See that file's doc comment for why this used to be a second,
// disconnected mock dataset here.

/* ── Lookups: map FindingsComponent's option "values" ↔ the display
   "labels" stored on finding records — NOTE: only RISK_LABELS/RISK_VALUES
   remain. FindingsComponent's Company/Division/Sub-Division/Scope/Subscope
   options are now sourced from company-org-data.ts too (see
   findings.component.ts), using the same company/division/sub-division/
   scope/subscope *names* as this list, so the old COMPANY_LABELS/
   BRANCH_LABELS/DEPARTMENT_LABELS/SCOPE_LABELS/SUBSCOPE_LABELS
   code-translation lookups that used to bridge between its local codes and
   these display names are gone — onAddFinding()/onEditFinding() below now
   pass company/division/subDivision/scope/subscope straight through instead
   of translating (named division/subDivision on the underlying
   AuditFinding/form contract). Risk isn't part of company-org-data.ts, so
   it stays a code ↔ label lookup (FINDING_RISK_OPTIONS in the labels constants). ── */
const RISK_LABELS = FINDING_RISK_LABELS;
const RISK_VALUES = FINDING_RISK_VALUES;

@Component({
  selector: 'app-findings-tab',
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
    PopoverModule,
    DialogModule,
    ToastModule,
    PaginationBarComponent,
    DrawIconComponent
  ],
  providers: [MessageService],
  templateUrl: './findings-list.component.html',
  styleUrls: ['./findings-list.component.scss'],
})
export class FindingsListComponent implements OnInit {

  @ViewChild('findingsPanel') findingsPanel!: Popover;

  private readonly drawer = inject(RightDrawerService);
  private readonly route  = inject(ActivatedRoute);
  private readonly clientMode = inject(CLIENT_MODE);
  private readonly messageService = inject(MessageService);
  private readonly router   = inject(Router);
  private readonly location = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /* ── Inputs ──────────────────────────────────────────────── */
  readonly findings  = input<AuditFinding[]>([]);
  readonly loadingId = input<string | null>(null);

  /* ── Outputs ─────────────────────────────────────────────── */
  readonly viewFinding        = output<AuditFinding>();
  readonly viewPrevOccurrence = output<AuditFinding>();
  readonly editFinding        = output<EditFindingPayload>();
  readonly toggleActive       = output<{ finding: AuditFinding; active: boolean }>();
  readonly addFinding         = output<void>();
  readonly exportPdf          = output<void>();
  readonly exportExcel        = output<void>();

  /* ── Internal data ───────────────────────────────────────── */
  private readonly _findings = signal<RichAuditFinding[]>([]);

  readonly deactivatedIds = signal<Set<string>>(new Set());

  /* ── Profile dialog state ────────────────────────────────── */
  readonly selectedFinding = signal<FindingProfileData | null>(null);
  readonly profileVisible  = signal(false);
  readonly importDrawerVisible = signal(false);
  readonly importFile = signal<File | null>(null);
  readonly importError = signal('');
  readonly importSuccess = signal('');
  readonly isDraggingImportFile = signal(false);

  /* ── View mode ───────────────────────────────────────────── */
  readonly viewMode = signal<ViewMode>(FindingViewModes.Grid);

  /* ── Template constants ──────────────────────────────────── */
  readonly FindingViewModes        = FindingViewModes;
  readonly FindingSortColumns      = FindingSortColumns;
  readonly FindingBlockActions     = FindingBlockActions;
  readonly activeLabels            = FINDING_ACTIVE_LABELS;
  readonly activeIcons             = FINDING_ACTIVE_ICONS;
  readonly loadingIcon             = FINDING_LOADING_ICON;
  readonly viewIcon                = FINDING_VIEW_ICON;
  readonly subDivisionPlaceholders = FINDING_SUB_DIVISION_FILTER_PLACEHOLDERS;
  readonly repeatedTooltip         = REPEATED_FINDING_TOOLTIP;
  readonly previousOccurrenceTooltip = previousOccurrenceTooltip;

  /* ── Filter state ────────────────────────────────────────── */
  readonly searchQuery          = signal('');
  readonly selectedSeverities   = signal<FindingSeverity[]>([]);
  readonly selectedStatuses     = signal<FindingStatus[]>([]);
  readonly selectedSubdivisions = signal<string[]>([]);
  readonly selectedCompanies    = signal<string[]>([]);
  readonly selectedDivisions    = signal<string[]>([]);
  readonly selectedScopes       = signal<string[]>([]);
  readonly selectedSubscopes    = signal<string[]>([]);
  readonly selectedAuditors     = signal<string[]>([]);
  /** Scope to a specific assigned auditor id (from the overview "Open Findings" card). */
  readonly auditorIdFilter     = signal<string | null>(null);
  readonly teamAuditorIds      = signal<string[]>([]);
  readonly dateRange           = signal<(Date | null)[] | null>(null);
  /** Set when arriving from the dashboard "Repeated Findings" card. */
  readonly repeatedOnly        = signal(false);

  /* ── Sort state ──────────────────────────────────────────── */
  readonly sortColumn    = signal<SortColumn | null>(FindingSortColumns.DueDate);
  readonly sortDirection = signal<SortDir>(FindingSortDirections.Asc);

  /* ── Pagination ──────────────────────────────────────────── */
  readonly pageSize    = signal(FINDING_LIST_PAGE_SIZE);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = FINDING_PAGE_SIZE_OPTIONS;
  readonly confirmPending = signal<{
    finding: AuditFinding;
    action:  FindingBlockAction;
  } | null>(null);

  readonly allSubDivisionsLabel = $localize`:@@audit.findings.allSubDivisions:All sub-divisions`;
  readonly noSubDivisionsLabel = $localize`:@@audit.findings.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly activateFindingLabel = $localize`:@@audit.findings.activateFinding:Activate finding`;
  readonly deactivateFindingLabel = $localize`:@@audit.findings.deactivateFinding:Deactivate finding`;
  readonly activateConfirmationLabel = $localize`:@@audit.findings.activateConfirmation:Activate confirmation`;
  readonly deactivateConfirmationLabel = $localize`:@@audit.findings.deactivateConfirmation:Deactivate confirmation`;
  readonly yesDeactivateLabel = $localize`:@@audit.findings.yesDeactivate:Yes, Deactivate`;
  readonly yesActivateLabel = $localize`:@@audit.findings.yesActivate:Yes, Activate`;

  findingsCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.findings.findingCount:${count}:count: finding`
      : $localize`:@@audit.findings.findingsCount:${count}:count: findings`;
  }

  daysOverdueLabel(days: number | undefined): string {
    if (days === undefined) {
      return '';
    }

    return days === 1
      ? $localize`:@@audit.findings.dayOverdueShort:${days}:days:d overdue`
      : $localize`:@@audit.findings.daysOverdueShort:${days}:days:d overdue`;
  }

  repeatedFindingTitle(previousOccurrenceId?: string): string {
    return previousOccurrenceId
      ? $localize`:@@audit.findings.previousFinding:Previous: ${previousOccurrenceId}:findingId:`
      : $localize`:@@audit.findings.repeatedFinding:Repeated Finding`;
  }

  completedCountLabel(count: number): string {
    return $localize`:@@audit.findings.completedCount:${count}:count: completed`;
  }

  repeatedFindingCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.findings.repeatedFindingCount:${count}:count: repeated finding`
      : $localize`:@@audit.findings.repeatedFindingsCount:${count}:count: repeated findings`;
  }

  toggleConfirmationMessage(action: 'activate' | 'deactivate', findingId: string): string {
    return action === 'deactivate'
      ? $localize`:@@audit.findings.deactivateConfirmationMessage:Are you sure you want to deactivate ${findingId}:findingId:?`
      : $localize`:@@audit.findings.activateConfirmationMessage:Are you sure you want to activate ${findingId}:findingId:?`;
  }

  /* ── Static filter options ───────────────────────────────── */
  readonly severityFilterOptions: { label: string; value: FindingSeverity }[] = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];

  readonly statusFilterOptions: { label: string; value: FindingStatus }[] = [
    { label: $localize`:@@common.open:Open`, value: 'open' },
    { label: $localize`:@@audit.findings.inProgress:In Progress`, value: 'in-progress' },
    { label: $localize`:@@audit.findings.responded:Responded`, value: 'responded' },
    { label: $localize`:@@audit.findings.verified:Verified`, value: 'verified' },
    { label: $localize`:@@common.closed:Closed`, value: 'closed' },
    { label: $localize`:@@common.overdue:Overdue`, value: 'overdue' },
    { label: $localize`:@@audit.findings.escalated:Escalated`, value: 'escalated' },
    { label: $localize`:@@common.rejected:Rejected`, value: 'rejected' },
  ];

  /* ── Dynamic filter options ──────────────────────────────── */

  /**
   * Active Company -> Division -> Sub-Division -> Scope -> Sub-scope
   * directory to build the filters below from — ORG_STATIC_DATA_INTERNAL_AUDIT
   * (the DAR Exchange single-org seed) when CLIENT_MODE is 'internal-audit',
   * otherwise the existing multi-company ORG_STATIC_DATA roster. Same
   * CLIENT_MODE ? … : … pattern CompanyDataService already uses, so this
   * list — and the Add/Edit Finding drawer, once it reads from here too —
   * automatically reflects whichever client mode the build is running in.
   */
  readonly orgData = computed(() =>
    this.clientMode === 'internal-audit' ? ORG_STATIC_DATA_INTERNAL_AUDIT : ORG_STATIC_DATA,
  );

  /**
   * Every company in the active org directory (see `orgData` above),
   * instead of scraping distinct values off this._findings() — so the
   * filter always offers the full canonical list, not just whatever
   * happens to appear in the current data. The option value is the company
   * *name* (AuditFinding.company is a plain display string, not an id) so
   * it lines up 1:1 with `f.company`.
   */
  readonly companyFilterOptions = computed(() =>
    this.orgData()
      .map(c => ({ label: c.companyName, value: c.companyName }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  /**
   * Divisions for the selected companies (or every company, if none are
   * selected yet), sourced from the active org directory. Values are
   * division *names* (matching `f.branch`), not division codes.
   */
  readonly divisionFilterOptions = computed(() => {
    const companyNames = this.selectedCompanies();
    const companies = companyNames.length
      ? this.orgData().filter(c => companyNames.includes(c.companyName))
      : this.orgData();

    const names = new Set<string>();
    companies.forEach(c => c.divisions.forEach(d => names.add(d.divisionName)));

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ label: name, value: name }));
  });

  /**
   * Sub-Divisions for the selected companies + divisions (or every division
   * under those companies, if no division is selected yet), sourced from
   * the active org directory. Values are sub-division *names* (matching
   * `f.subDivision`), not sub-division codes.
   */
  readonly subdivisionFilterOptions = computed(() => {
    const companyNames  = this.selectedCompanies();
    const divisionNames = this.selectedDivisions();
    const companies = companyNames.length
      ? this.orgData().filter(c => companyNames.includes(c.companyName))
      : this.orgData();

    const names = new Set<string>();
    companies.forEach(c =>
      c.divisions
        // Divisions flagged `hasSubDivision: false` contribute no sub-divisions.
        .filter(d => d.hasSubDivision !== false)
        .filter(d => !divisionNames.length || divisionNames.includes(d.divisionName))
        .forEach(d => d.subDivisions.forEach(sd => names.add(sd.subDivisionName))),
    );

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ label: name, value: name }));
  });

  /**
   * Whether the Sub-Division filter is shown — false only when at least one
   * division is selected and every selected division (looked up in the
   * active org directory, within the selected companies) is flagged
   * `hasSubDivision: false`. Unknown divisions count as having sub-divisions.
   */
  readonly subDivisionFilterVisible = computed(() => {
    const companyNames  = this.selectedCompanies();
    const divisionNames = this.selectedDivisions();
    if (!divisionNames.length) return true;
    const companies = companyNames.length
      ? this.orgData().filter(c => companyNames.includes(c.companyName))
      : this.orgData();
    const divisions = companies.flatMap(c => c.divisions);
    return divisionNames.some(name => {
      const matches = divisions.filter(d => d.divisionName === name);
      return !matches.length || matches.some(d => d.hasSubDivision !== false);
    });
  });

  /**
   * Scopes for the selected companies + divisions + sub-divisions (or every
   * sub-division under those, if none is selected yet), sourced from the
   * active org directory. Values are scope *names* (matching `f.scope`).
   */
  readonly scopeFilterOptions = computed(() => {
    const companyNames     = this.selectedCompanies();
    const divisionNames    = this.selectedDivisions();
    const subdivisionNames = this.selectedSubdivisions();
    const companies = companyNames.length
      ? this.orgData().filter(c => companyNames.includes(c.companyName))
      : this.orgData();

    const names = new Set<string>();
    companies.forEach(c =>
      c.divisions
        .filter(d => !divisionNames.length || divisionNames.includes(d.divisionName))
        .forEach(d =>
          d.subDivisions
            .filter(sd => !subdivisionNames.length || subdivisionNames.includes(sd.subDivisionName))
            .forEach(sd => sd.scopes.forEach(s => names.add(s.scopeName))),
        ),
    );

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ label: name, value: name }));
  });

  /**
   * Sub-scopes for the selected companies + divisions + sub-divisions +
   * scopes (or every scope under those, if none is selected yet), sourced
   * from the active org directory. Values are sub-scope *names* (matching
   * `f.subscope`).
   */
  readonly subscopeFilterOptions = computed(() => {
    const companyNames     = this.selectedCompanies();
    const divisionNames    = this.selectedDivisions();
    const subdivisionNames = this.selectedSubdivisions();
    const scopeNames       = this.selectedScopes();
    const companies = companyNames.length
      ? this.orgData().filter(c => companyNames.includes(c.companyName))
      : this.orgData();

    const names = new Set<string>();
    companies.forEach(c =>
      c.divisions
        .filter(d => !divisionNames.length || divisionNames.includes(d.divisionName))
        .forEach(d =>
          d.subDivisions
            .filter(sd => !subdivisionNames.length || subdivisionNames.includes(sd.subDivisionName))
            .forEach(sd =>
              sd.scopes
                .filter(s => !scopeNames.length || scopeNames.includes(s.scopeName))
                .forEach(s => (s.subScopes ?? []).forEach(sub => names.add(sub.subScopeName))),
            ),
        ),
    );

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({ label: name, value: name }));
  });

  readonly auditorFilterOptions = computed(() =>
    Array.from(new Set(
      this._findings().map(f => f.owner?.fullName).filter(Boolean) as string[],
    )).sort().map(v => ({ label: v, value: v })),
  );

  /* ── Filtered + sorted findings ──────────────────────────── */
  readonly filteredFindings = computed(() => {
    let list = this._findings() as RichAuditFinding[];

    const q = this.searchQuery().trim().toLowerCase();
    if (q) list = list.filter(f =>
      f.id.toLowerCase().includes(q) || f.title.toLowerCase().includes(q));

    const sevs = this.selectedSeverities();
    if (sevs.length) list = list.filter(f => sevs.includes(f.severity));

    const stats = this.selectedStatuses();
    if (stats.length) list = list.filter(f => stats.includes(f.status));

    const subdivisions = this.selectedSubdivisions();
    // Ignored while the Sub-Division filter is hidden so a stale selection can't apply.
    if (subdivisions.length && this.subDivisionFilterVisible())
      list = list.filter(f => subdivisions.includes(f.subDivision));

    const companies = this.selectedCompanies();
    if (companies.length)
      list = list.filter(f => f.company && companies.includes(f.company!));

    const divisions = this.selectedDivisions();
    if (divisions.length)
      list = list.filter(f => f.division && divisions.includes(f.division!));

    const scopes = this.selectedScopes();
    if (scopes.length)
      list = list.filter(f => f.scope && scopes.includes(f.scope!));

    const subscopes = this.selectedSubscopes();
    if (subscopes.length)
      list = list.filter(f => f.subscope && subscopes.includes(f.subscope!));

    const auditors = this.selectedAuditors();
    if (auditors.length)
      list = list.filter(f => f.owner?.fullName && auditors.includes(f.owner.fullName));

    const aId = this.auditorIdFilter();
    if (aId) list = list.filter(f => f.assignedAuditor?.id === aId);
    else if (this.teamAuditorIds().length) list = list.filter(f => !!f.assignedAuditor && this.teamAuditorIds().includes(f.assignedAuditor.id));

    if (this.repeatedOnly()) list = list.filter(f => f.isRepeated);

    const range = this.dateRange();
    if (range?.[0] || range?.[1]) {
      const from = range[0]?.getTime();
      const to   = range[1]?.getTime();
      list = list.filter(f => {
        const due = f.dueDate.getTime();
        if (from !== undefined && due < from) return false;
        if (to   !== undefined && due > to)   return false;
        return true;
      });
    }

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === FindingSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortValue(a, col);
        const bv = this.sortValue(b, col);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }

    return list;
  });

  readonly paginatedFindings = computed(() => {
    const all = this.filteredFindings();
    const size = this.pageSize();
    const maxPage = Math.max(1, Math.ceil(all.length / size));
    const page    = Math.min(this.currentPage(), maxPage);
    const start   = (page - 1) * size;
    return all.slice(start, start + size);
  });

  /* ── Filter metadata ─────────────────────────────────────── */
  readonly hasActiveFilters = computed(() =>
    !!this.searchQuery().trim() ||
    !!this.selectedSeverities().length ||
    !!this.selectedStatuses().length ||
    !!this.selectedSubdivisions().length ||
    !!this.selectedCompanies().length ||
    !!this.selectedDivisions().length ||
    !!this.selectedScopes().length ||
    !!this.selectedSubscopes().length ||
    !!this.selectedAuditors().length ||
    this.repeatedOnly() ||
    !!(this.dateRange()?.[0] || this.dateRange()?.[1]),
  );

  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedSeverities().length)   n++;
    if (this.selectedStatuses().length)     n++;
    if (this.selectedSubdivisions().length) n++;
    if (this.selectedCompanies().length)    n++;
    if (this.selectedDivisions().length)    n++;
    if (this.selectedScopes().length)       n++;
    if (this.selectedSubscopes().length)    n++;
    if (this.selectedAuditors().length)     n++;
    if (this.repeatedOnly())                n++;
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) n++;
    return n;
  });

  readonly activeFilterChips = computed(() => {
    const chips: { key: FindingFilterKey; label: string }[] = [];
    const push = (key: FindingFilterKey, count?: number) => chips.push({
      key,
      label: count === undefined ? FINDING_FILTER_CHIP_LABELS[key] : filterChipLabel(FINDING_FILTER_CHIP_LABELS[key], count),
    });
    if (this.selectedSeverities().length)   push(FindingFilterKeys.Severities,   this.selectedSeverities().length);
    if (this.selectedStatuses().length)     push(FindingFilterKeys.Statuses,     this.selectedStatuses().length);
    if (this.selectedSubdivisions().length) push(FindingFilterKeys.Subdivisions, this.selectedSubdivisions().length);
    if (this.selectedCompanies().length)    push(FindingFilterKeys.Companies,    this.selectedCompanies().length);
    if (this.selectedDivisions().length)    push(FindingFilterKeys.Divisions,    this.selectedDivisions().length);
    if (this.selectedScopes().length)       push(FindingFilterKeys.Scopes,       this.selectedScopes().length);
    if (this.selectedSubscopes().length)    push(FindingFilterKeys.Subscopes,    this.selectedSubscopes().length);
    if (this.selectedAuditors().length)     push(FindingFilterKeys.Auditors,     this.selectedAuditors().length);
    if (this.repeatedOnly())                push(FindingFilterKeys.Repeated);
    if (this.dateRange()?.[0] || this.dateRange()?.[1]) push(FindingFilterKeys.Date);
    return chips;
  });

  /* ── KPI / side stats ────────────────────────────────────── */
  readonly counts = computed(() => {
    const list = this.filteredFindings();
    return {
      critical: list.filter(f => f.severity === FindingSeverities.Critical).length,
      high:     list.filter(f => f.severity === FindingSeverities.High).length,
      medium:   list.filter(f => f.severity === FindingSeverities.Medium).length,
      low:      list.filter(f => f.severity === FindingSeverities.Low).length,
    };
  });

  /**
   * Every side-card number below is derived from the SAME `filteredFindings()`
   * list, each with its own explicit predicate, so a card's value can only
   * ever be what its label says it is. Previously "Open Findings" and
   * "Overdue" both bound to this computed's `overdueCount` (there was no
   * `openCount` at all), and "Repeated Findings" summed `financialImpact`
   * across every finding instead of just the repeated ones — both fixed
   * here. `verifyDataIntegrity()` below re-checks a couple of invariants on
   * every recompute so a future edit that reintroduces a mismatch like that
   * gets flagged in the console instead of shipping a silently wrong card.
   */
  readonly sideStats = computed(() => {
    const list         = this.filteredFindings();
    // Broad "open" — everything not closed/rejected (see `isOpenFinding` in
    // finding-data.ts) — so this card includes in-progress/responded/
    // verified/overdue/escalated findings, not just the literal 'open'
    // status. `closed` is defined as its exact complement so the two always
    // add up to `totalCount` (checked in `verifyDataIntegrity()` below).
    const open         = list.filter(isOpenFinding).length;
    const closed       = list.length - open;
    const overdueList  = list.filter(f => OVERDUE_STATUSES.includes(f.status));
    const repeatedList = list.filter(f => f.isRepeated);
    return {
      openCount:        open,
      closedCount:      closed,
      totalCount:       list.length,
      repeatedCount:    repeatedList.length,
      previousOccurrenceCount: repeatedList.filter(f => !!f.previousOccurrenceId).length,
      repeatedImpact:   repeatedList.reduce((s, f) => s + (f.financialImpact ?? 0), 0),
      criticalHigh:     list.filter(f => CRITICAL_HIGH_SEVERITIES.includes(f.severity)).length,
      aged30:           list.filter(f => (f.daysOverdue ?? 0) > 0 && (f.daysOverdue ?? 0) < FINDING_AGING_DAYS).length,
      overdueCount:     overdueList.length,
      overdueDateRange: this.formatDueRange(overdueList),
    };
  });

  /** "Due {date}" / "Due {min} – {max}" for the Overdue card's sub-line —
   *  replaces the old hardcoded "Jan 1 – Mar 31, 2026" placeholder, which
   *  didn't correspond to any real filter or to the mock findings' actual
   *  due dates. */
  private formatDueRange(list: RichAuditFinding[]): string {
    if (!list.length) return $localize`:@@audit.findings.noOverdueFindings:No overdue findings`;
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    const times = list.map(f => f.dueDate.getTime());
    const min = new Date(Math.min(...times));
    const max = new Date(Math.max(...times));
    if (min.getTime() === max.getTime()) {
      const dueDate = fmt(min);
      return $localize`:@@audit.findings.dueSingleDate:Due ${dueDate}:date:`;
    }
    const fromDate = fmt(min);
    const toDate = fmt(max);
    return $localize`:@@audit.findings.dueDateRangeValue:Due ${fromDate}:fromDate: – ${toDate}:toDate:`;
  }

  constructor() {
    // Re-validates the summary-card math every time the underlying data or
    // filters change. This is a safety net, not a fix by itself — see
    // `verifyDataIntegrity()`'s doc comment for what it actually checks.
    effect(() => this.verifyDataIntegrity());
  }

  openImportDrawer(): void {
    this.importError.set('');
    this.importSuccess.set('');
    this.importDrawerVisible.set(true);
  }

  closeImportDrawer(): void {
    this.importDrawerVisible.set(false);
    this.importFile.set(null);
    this.importError.set('');
    this.importSuccess.set('');
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setImportFile(input.files?.[0] ?? null);
    input.value = '';
  }

  onImportFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingImportFile.set(false);
    this.setImportFile(event.dataTransfer?.files?.[0] ?? null);
  }

  private setImportFile(file: File | null): void {
    this.importError.set('');
    if (!file) return;
    const validExtension = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!validExtension) {
      this.importFile.set(null);
      this.importError.set('Please choose a CSV or Excel file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.importFile.set(null);
      this.importError.set('The file must be 10 MB or smaller.');
      return;
    }
    this.importFile.set(file);
  }

  uploadImportedFindings(): void {
    const file = this.importFile();
    if (!file) {
      this.importError.set('Choose a file before uploading.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
        if (!rows.length) { this.importError.set('The file contains no findings.'); return; }
        const value = (row: Record<string, unknown>, ...names: string[]) => {
          const key = Object.keys(row).find(k => names.includes(k.replace(/\*/g, '').trim().toLowerCase()));
          return key ? String(row[key] ?? '').trim() : '';
        };
        const imported = rows.map((row, index) => ({
          id: `FND-IMP-${Date.now()}-${index + 1}`,
          title: value(row, 'finding title'),
          subDivision: value(row, 'sub-division', 'subdivision'),
          company: value(row, 'company'),
          division: value(row, 'division'),
          scope: value(row, 'scope'),
          subscope: value(row, 'sub-scope', 'subscope'),
          linkedScope: value(row, 'audit plan'),
          taskId: value(row, 'task', 'audit plan'),
          description: value(row, 'description'),
          severity: 'medium' as FindingSeverity,
          status: 'open' as FindingStatus,
          dueDate: new Date(),
          createdAt: new Date(),
          owner: { fullName: 'Unassigned', avatarUrl: '', id: 'unassigned' },
        }));
        this._findings.update(current => [...imported as RichAuditFinding[], ...current]);
        this.messageService.add({ severity: 'success', summary: 'Import successful', detail: `${imported.length} finding(s) added to the list.` });
        this.closeImportDrawer();
      } catch { this.importError.set('Unable to read the Excel file.'); }
    };
    reader.readAsArrayBuffer(file);
  }

  importFileSize(file: File): string {
    return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }

  /** Downloads the blank workbook used by the bulk findings importer. */
  downloadImportTemplate(): void {
    const headers = [[
      'Finding Title*',
      'Finding Type*',
      'Company*',
      'Division*',
      'Sub-Division*',
      'Scope*',
      'Sub-Scope',
      'Audit Plan*',
      'Description*',
    ]];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    worksheet['!cols'] = headers[0].map(header => ({ wch: Math.max(header.length + 2, 18) }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Findings');
    XLSX.writeFile(workbook, 'findings-import-template.xlsx');
  }

  /* ── Lifecycle ───────────────────────────────────────────── */
  ngOnInit(): void {
    const provided = this.findings();
    this._findings.set(provided.length ? (provided as RichAuditFinding[]) : MOCK_FINDINGS);
    this.applyViewFromQuery();
  }

  /**
   * Dev-time guard for the KPI cards: `counts()` and `sideStats()` each
   * reduce `filteredFindings()` down with their own predicates, so it's
   * possible for one of those reduces to quietly stop matching what its
   * card actually claims to show (that's exactly how "Open Findings" ended
   * up displaying the Overdue count, and "Repeated Findings" ended up
   * summing the financial impact of every finding instead of just the
   * repeated ones). This re-derives a few invariants that must always hold
   * and warns loudly in the console the moment one doesn't, so the next
   * regression like that is caught during development instead of shipping
   * a summary card that silently disagrees with the table underneath it.
   */
  private verifyDataIntegrity(): void {
    const list = this.filteredFindings();
    const c    = this.counts();
    const s    = this.sideStats();

    const severitySum = c.critical + c.high + c.medium + c.low;
    if (severitySum !== list.length) {
      console.warn(
        `[FindingsList] Severity KPI cards sum to ${severitySum} but ${list.length} findings are shown ` +
        `— a finding is missing a recognised severity value.`,
      );
    }

    const totalImpact = list.reduce((sum, f) => sum + (f.financialImpact ?? 0), 0);
    if (s.repeatedImpact > totalImpact) {
      console.warn(
        `[FindingsList] "Repeated Findings" financial impact (${s.repeatedImpact}) exceeds the total ` +
        `financial impact of all findings shown (${totalImpact}) — it should only ever be a subset.`,
      );
    }

    if (s.openCount > list.length || s.closedCount > list.length ||
        s.overdueCount > list.length || s.repeatedCount > list.length) {
      console.warn('[FindingsList] A side-stat count exceeds the number of findings currently shown.');
    }

    if (s.totalCount !== list.length) {
      console.warn(
        `[FindingsList] sideStats().totalCount (${s.totalCount}) doesn't match filteredFindings().length (${list.length}).`,
      );
    }

    if (s.openCount + s.closedCount !== s.totalCount) {
      console.warn(
        `[FindingsList] "Open" (${s.openCount}) + "Closed" (${s.closedCount}) doesn't add up to the total ` +
        `(${s.totalCount}) — every finding should be counted as exactly one or the other.`,
      );
    }
  }

  /**
   * Pre-applies filters when navigated from a dashboard KPI card
   * (e.g. /findings?view=overdue).
   */
  private applyViewFromQuery(): void {
    this.route.queryParamMap.subscribe(params => {
      this.auditorIdFilter.set(params.get(FINDING_QUERY_PARAMS.AuditorId));
      this.teamAuditorIds.set((params.get('teamAuditorIds') ?? '').split(',').filter(Boolean));

      // Landed here from the auditor overview's "Raise Finding" quick
      // action — open the Add Finding drawer straight away.
      if (params.get(FINDING_QUERY_PARAMS.OpenAdd) === FINDING_OPEN_ADD_FLAG) {
        this.onAddFinding();
      }

      const view = params.get(FINDING_QUERY_PARAMS.View);
      if (!view) return;

      // reset before applying so each drill-down starts clean
      this.selectedSeverities.set([]);
      this.selectedStatuses.set([]);
      this.repeatedOnly.set(false);

      // Each preset (FINDING_VIEW_PRESETS) lists the statuses / severities /
      // repeated flag its dashboard card drills into; unknown views apply nothing.
      const preset = FINDING_VIEW_PRESETS[view];
      if (preset?.statuses)     this.selectedStatuses.set([...preset.statuses]);
      if (preset?.severities)   this.selectedSeverities.set([...preset.severities]);
      if (preset?.repeatedOnly) this.repeatedOnly.set(true);
      this.currentPage.set(1);
    });
  }

  /* ── View mode ───────────────────────────────────────────── */
  setViewMode(m: ViewMode): void { this.viewMode.set(m); }

  /* ── Filter handlers ─────────────────────────────────────── */
  onSearchChange(q: string): void                    { this.searchQuery.set(q);              this.currentPage.set(1); }
  onSeveritiesChange(v: FindingSeverity[]): void     { this.selectedSeverities.set(v ?? []);  this.currentPage.set(1); }
  onStatusesChange(v: FindingStatus[]): void         { this.selectedStatuses.set(v ?? []);    this.currentPage.set(1); }
  onDateRangeChange(r: (Date | null)[] | null): void { this.dateRange.set(r);                 this.currentPage.set(1); }

  // Division/Sub-Division/Scope/Sub-scope now cascade off Company/Division/
  // Sub-Division/Scope respectively (see divisionFilterOptions/
  // subdivisionFilterOptions/scopeFilterOptions/subscopeFilterOptions
  // above, sourced from `orgData()`), so changing an upstream selection
  // clears whatever downstream selection is no longer valid — same
  // cascading reset behaviour as the Evidence Repository list's
  // Company/Division/Sub-Division filters.
  onCompaniesChange(v: string[]): void {
    this.selectedCompanies.set(v ?? []);
    this.selectedDivisions.set([]);
    this.selectedSubdivisions.set([]);
    this.selectedScopes.set([]);
    this.selectedSubscopes.set([]);
    this.currentPage.set(1);
  }
  onDivisionsChange(v: string[]): void {
    this.selectedDivisions.set(v ?? []);
    this.selectedSubdivisions.set([]);
    this.selectedScopes.set([]);
    this.selectedSubscopes.set([]);
    this.currentPage.set(1);
  }
  onSubdivisionsChange(v: string[]): void {
    this.selectedSubdivisions.set(v ?? []);
    this.selectedScopes.set([]);
    this.selectedSubscopes.set([]);
    this.currentPage.set(1);
  }
  onScopesChange(v: string[]): void {
    this.selectedScopes.set(v ?? []);
    this.selectedSubscopes.set([]);
    this.currentPage.set(1);
  }
  onSubscopesChange(v: string[]): void { this.selectedSubscopes.set(v ?? []); this.currentPage.set(1); }
  onAuditorsChange(v: string[]): void { this.selectedAuditors.set(v ?? []); this.currentPage.set(1); }

  removeFilter(key: FindingFilterKey): void {
    switch (key) {
      case FindingFilterKeys.Severities:   this.selectedSeverities.set([]);   break;
      case FindingFilterKeys.Statuses:     this.selectedStatuses.set([]);     break;
      case FindingFilterKeys.Subdivisions: this.selectedSubdivisions.set([]); this.selectedScopes.set([]); this.selectedSubscopes.set([]); break;
      case FindingFilterKeys.Companies:    this.selectedCompanies.set([]);    this.selectedDivisions.set([]); this.selectedSubdivisions.set([]); this.selectedScopes.set([]); this.selectedSubscopes.set([]); break;
      case FindingFilterKeys.Divisions:    this.selectedDivisions.set([]);    this.selectedSubdivisions.set([]); this.selectedScopes.set([]); this.selectedSubscopes.set([]); break;
      case FindingFilterKeys.Scopes:       this.selectedScopes.set([]);       this.selectedSubscopes.set([]); break;
      case FindingFilterKeys.Subscopes:    this.selectedSubscopes.set([]);    break;
      case FindingFilterKeys.Auditors:     this.selectedAuditors.set([]);     break;
      case FindingFilterKeys.Repeated:     this.repeatedOnly.set(false);      break;
      case FindingFilterKeys.Date:         this.dateRange.set(null);          break;
    }
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedSeverities.set([]);
    this.selectedStatuses.set([]);
    this.selectedSubdivisions.set([]);
    this.selectedCompanies.set([]);
    this.selectedDivisions.set([]);
    this.selectedScopes.set([]);
    this.selectedSubscopes.set([]);
    this.selectedAuditors.set([]);
    this.repeatedOnly.set(false);
    this.dateRange.set(null);
    this.currentPage.set(1);
  }

  /* ── Sort handlers ───────────────────────────────────────── */
  onSort(col: SortColumn): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d =>
        d === FindingSortDirections.Asc ? FindingSortDirections.Desc : FindingSortDirections.Asc);
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set(FindingSortDirections.Asc);
    }
  }

  sortIconFor(col: SortColumn): string {
    if (this.sortColumn() !== col) return FINDING_SORT_ICONS.Unsorted;
    return FINDING_SORT_ICONS[this.sortDirection()];
  }

  private sortValue(f: AuditFinding, col: SortColumn): string | number {
    switch (col) {
      case FindingSortColumns.Id:          return parseInt(f.id.replace(/\D/g, ''), 10) || 0;
      case FindingSortColumns.Title:       return f.title.toLowerCase();
      case FindingSortColumns.Subdivision: return f.subDivision.toLowerCase();
      case FindingSortColumns.Severity:    return FINDING_SEVERITY_RANK[f.severity];
      case FindingSortColumns.Status:      return f.status;
      case FindingSortColumns.DueDate:     return f.dueDate.getTime();
      case FindingSortColumns.Owner:       return f.owner.fullName.toLowerCase();
    }
  }

  /* ── Pagination ──────────────────────────────────────────── */
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

  /* ── Actions ─────────────────────────────────────────────── */

  /** Opens the profile dialog for a finding */
  onViewFinding(f: AuditFinding): void {
    const rich = f as RichAuditFinding;

    const profileData: FindingProfileData = {
      id:                   rich.id,
      title:                rich.title,
      severity:             rich.severity,
      status:               rich.status,
      subDivision:           rich.subDivision,
      scope:                rich.scope,
      subscope:             rich.subscope,
      taskId:               rich.taskId,
      company:              rich.company,
      division:               rich.division,
      risk:                 rich.risk,
      dueDate:              rich.dueDate,
      createdAt:            rich.createdAt,
      owner:                rich.owner,
      description:          rich.description,
      observationIds:       rich.observationIds,
      documents:            rich.documents,
      financialImpact:      rich.financialImpact,
      isRepeated:           rich.isRepeated,
      flaggedForEscalation: rich.flaggedForEscalation,
      daysOverdue:          rich.daysOverdue,
    };

    this.drawer.open<FindingsProfileComponent, FindingProfileData>(
      FindingsProfileComponent,
      { width: FINDING_DRAWER_WIDTH.Profile, data: profileData },
    );

    this.viewFinding.emit(f);
  }

  viewPreviousOccurrence(f: AuditFinding): void { this.viewPrevOccurrence.emit(f); }
  onExportPdf(): void                           { this.exportPdf.emit(); }
  onExportExcel(): void                         { this.exportExcel.emit(); }

  /** Next sequential FND-### id based on the highest one currently in the list. */
  private nextFindingId(): string {
    const max = this._findings().reduce((m, f) => {
      const n = parseInt(f.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    return `${FINDING_ID_PREFIX}${(max + 1).toString().padStart(FINDING_ID_PAD_LENGTH, '0')}`;
  }

  async onAddFinding(): Promise<void> {
    const ref = this.drawer.open<AddFindingResult, AddFindingDrawerData>(
      FindingsComponent,
      { width: FINDING_DRAWER_WIDTH.Form, data: { mode: FindingDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const f = result.form;
    const newFinding: RichAuditFinding = {
      id: this.nextFindingId(),
      title: f.title,
      subDivision: f.subdivision ?? '',
      severity: (f.severity as FindingSeverity) ?? FINDING_DEFAULT_SEVERITY,
      // No Status control exists in this form — every submission defaults
      // to 'Open'. New findings start as 'open'; see onEditFinding for why
      // status is never overwritten there.
      status: FindingStatuses.Open,
      dueDate: f.dueDate ?? new Date(),
      daysOverdue: undefined,
      flaggedForEscalation: false,
      isRepeated: !!f.isRepeated,
      previousOccurrenceId: undefined,
      financialImpact: 0,
      owner: { ...FINDING_CURRENT_USER_OWNER },
      company: f.company,
      division: f.division,
      scope: f.scope,
      subscope: f.subscope,
      taskId: f.taskId,
      risk: RISK_LABELS[f.risk ?? ''] ?? f.risk,
      createdAt: new Date(),
      description: f.description,
      observationIds: f.observationIds ?? [],
      documents: (f.documents ?? []).map(file => ({ name: file.name, size: file.size })),
    };

    // New entries appear first so they're immediately visible.
    this._findings.update(list => [newFinding, ...list]);
    this.currentPage.set(1);
    this.addFinding.emit();
  }

  async onEditFinding(f: AuditFinding): Promise<void> {
    const rich = f as RichAuditFinding;
    const ref = this.drawer.open<AddFindingResult, AddFindingDrawerData>(
      FindingsComponent,
      {
        width: FINDING_DRAWER_WIDTH.Form,
        data: {
          mode: FindingDrawerModes.Edit,
          // company/branch/department (Company/Division/Sub-Division) are
          // listed before scope/subscope/taskId here on purpose:
          // FindingsComponent's FormGroup.patchValue() applies each key
          // of this object in the object's own property order, and its
          // cascade-reset subscriptions (company change clears
          // branch/department/scope/subscope i.e. Division/Sub-Division/
          // Scope/Sub-scope, department change clears scope/subscope,
          // etc.) fire as each key is patched. Listing a dependency after
          // its dependent field would let the reset fire *after* the real
          // value was set, silently blanking it — same bug already fixed
          // once for evidence-list.component.ts's openEdit().
          existing: {
            id:             f.id,
            company:        rich.company ?? '',
            division:         rich.division ?? '',
            subdivision:     f.subDivision ?? '',
            scope:          rich.scope ?? '',
            subscope:       rich.subscope ?? '',
            taskId:         rich.taskId ?? '',
            title:          f.title,
            severity:       f.severity,
            status:         f.status as any,
            dueDate:        f.dueDate,
            risk:           RISK_VALUES[rich.risk ?? ''] ?? '',
            observationIds: rich.observationIds ?? [],
            description:    rich.description ?? '',
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const r = result.form;
    this._findings.update(list =>
      list.map(item => item.id !== f.id ? item : {
        ...item,
        title: r.title,
        severity: (r.severity as FindingSeverity) ?? item.severity,
        subDivision: r.subdivision === null ? '' : (r.subdivision ?? item.subDivision),
        scope: r.scope ?? item.scope,
        subscope: r.subscope ?? item.subscope,
        taskId: r.taskId ?? item.taskId,
        risk: RISK_LABELS[r.risk ?? ''] ?? item.risk,
        company: r.company ?? item.company,
        division: r.division ?? item.division,
        description: r.description,
        observationIds: r.observationIds ?? item.observationIds,
        // status intentionally left untouched: the form has no Status
        // control, so every submission defaults to 'Open' — applying it
        // here would silently reset every edited finding back to Open.
      }),
    );

    this.editFinding.emit({
      finding: f,
      existing: {
        id:         f.id,
        title:      r.title,
        severity:   r.severity,
        subDivision: r.subdivision === null ? '' : (r.subdivision ?? f.subDivision),
        status:     f.status,
        dueDate:    f.dueDate,
      },
    });
  }

  isActive(id: string): boolean {
    return !this.deactivatedIds().has(id);
  }

  onToggleActive(f: AuditFinding): void {
    this.confirmPending.set({
      finding: f,
      action:  this.isActive(f.id) ? FindingBlockActions.Deactivate : FindingBlockActions.Activate,
    });
  }

  confirmToggle(): void {
    const pending = this.confirmPending();
    if (!pending) return;
    const { finding, action } = pending;
    const current = new Set(this.deactivatedIds());
    if (action === FindingBlockActions.Deactivate) {
      current.add(finding.id);
    } else {
      current.delete(finding.id);
    }
    this.deactivatedIds.set(current);
    this.toggleActive.emit({ finding, active: action === FindingBlockActions.Activate });
    this.confirmPending.set(null);
  }

  cancelToggle(): void {
    this.confirmPending.set(null);
  }

  /* ── Display helpers ─────────────────────────────────────── */
  severityLabel(s: FindingSeverity): string {
    const map: Record<FindingSeverity, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };
    return map[s];
  }

  statusLabel(s: FindingStatus): string {
    const map: Record<FindingStatus, string> = {
      open: $localize`:@@common.open:Open`,
      'in-progress': $localize`:@@audit.findings.inProgress:In Progress`,
      responded: $localize`:@@audit.findings.responded:Responded`,
      verified: $localize`:@@audit.findings.verified:Verified`,
      closed: $localize`:@@common.closed:Closed`,
      overdue: $localize`:@@common.overdue:Overdue`,
      escalated: $localize`:@@audit.findings.escalated:Escalated`,
      rejected: $localize`:@@common.rejected:Rejected`,
    };

    return map[s];
  }

  initials(name: string): string {
    return name.split(/\s+/).map(p => p[0]).slice(0, FINDING_INITIALS_WORD_COUNT).join('').toUpperCase();
  }

  severityColor(s: FindingSeverity): string {
    return FINDING_SEVERITY_COLORS[s];
  }

  trackById = (_: number, f: AuditFinding) => f.id;
}
