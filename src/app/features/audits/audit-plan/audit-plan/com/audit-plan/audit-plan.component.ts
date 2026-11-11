import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { planTitle, planYear } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import { AuditPlanListStore } from '@/app/features/audits/audit-plan/audit-plan/services/audit-plan-list.store';

import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuditPlanStore } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan.store';
import { FREQ_LABELS, Frequency, InstanceStatus, MONTHS, PlanView, STATUS_META } from '@/app/features/audits/audit-plan/audit-plan/models/audit-plan.model';

import { MonthCalendarComponent } from '@/app/features/audits/audit-plan/audit-plan/com/month-calendar/month-calendar.component';
import { SubDivisionViewComponent } from '@/app/features/audits/audit-plan/audit-plan/com/department-view/department-view.component';
import { ScopeDetailComponent } from '@/app/features/audits/audit-plan/audit-plan/com/scope-detail/scope-detail.component';
import { ExecutionLogComponent } from '@/app/features/audits/audit-plan/audit-plan/com/execution-log/execution-log.component';

import { AnnualOverviewComponent } from '@/app/features/audits/audit-plan/audit-plan/com/annual-overview/annual-overview.component';
import { InstanceDialogComponent } from '@/app/features/audits/audit-plan/audit-plan/com/audit-details-by-scope/audit-details-by-scope.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { ScopeJobStatuses, type ScopeJobStatus } from '../../../scope-job/constants/scope-job.constants';
import {
  AUDIT_PLAN_DARK_THEME_STORAGE_KEY,
  AUDIT_PLAN_DEFAULT_INITIALS,
  AUDIT_PLAN_INITIALS_WORD_COUNT,
  AUDIT_PLAN_QUERY_PARAMS,
  AUDIT_PLAN_ROUTES,
  AUDIT_PLAN_SEARCH_DEBOUNCE_MS,
  AUDIT_PLAN_STORAGE_FLAG,
  PlanViews,
  ScopeManagementStatuses,
  type ScopeManagementStatus,
} from '../../constants/audit-plan.constants';
import { PLAN_LEVEL_TABS } from '../../constants/audit-plan-labels.constants';
import { auditPlanHeaderLabel } from '../../constants/audit-plan-messages.constants';


interface LevelTab { id: PlanView; num: number; label: string; }

@Component({
  selector: 'app-audit-plan',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuditPlanStore], // isolated state per page instance
  imports: [
    ReactiveFormsModule, FormsModule, ButtonModule, MultiSelectModule, InputTextModule,
    IconFieldModule, InputIconModule, SkeletonModule, SelectModule,
    AnnualOverviewComponent, MonthCalendarComponent, SubDivisionViewComponent,
    ScopeDetailComponent, ExecutionLogComponent, InstanceDialogComponent,
  
    DrawIconComponent, BackButtonComponent,],
  templateUrl: './audit-plan.component.html',
  styleUrl: './audit-plan.component.scss',
})
export class AuditPlanComponent implements OnInit {
  readonly store = inject(AuditPlanStore);
  /** the Audit Plan list's rows — source of the plan dropdown */
  private readonly planList = inject(AuditPlanListStore);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);
  private readonly location    = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /** NOTE: adjust to the real route paths where these pages are registered. */
  private readonly scopeRoute = AUDIT_PLAN_ROUTES.ScopeManagement;
  private readonly jobRoute   = AUDIT_PLAN_ROUTES.ScopeJobs;

  /* ── Template constants ── */
  readonly PlanViews               = PlanViews;
  readonly ScopeManagementStatuses = ScopeManagementStatuses;
  readonly ScopeJobStatuses        = ScopeJobStatuses;

  /** Dark theme toggle — scoped to this page only (see `host` binding above).
      Remembered per-browser so it stays on when the user comes back, but it
      never touches any app-wide theme state. Guards on `typeof localStorage`
      so this stays safe if the app is ever rendered with SSR. */
  private readonly darkThemeStorageKey = AUDIT_PLAN_DARK_THEME_STORAGE_KEY;
  readonly darkMode = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem(this.darkThemeStorageKey) === AUDIT_PLAN_STORAGE_FLAG.On
  );

  toggleDarkMode(): void {
    this.darkMode.update(v => !v);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.darkThemeStorageKey, this.darkMode() ? AUDIT_PLAN_STORAGE_FLAG.On : AUDIT_PLAN_STORAGE_FLAG.Off);
    }
  }

  /** Company name passed in from the selector page's query params
      (?companyName=...). Drives the top-bar label in place of a hardcoded
      product/company name. Falls back to a generic label when the page is
      opened without one (e.g. direct nav, refresh losing query params). */
  readonly companyName = signal<string>('');

  /** Top-bar label: "<Company> · Audit Platform", or just "Audit Platform"
      when no company name is available. */
  readonly headerLabel = computed(() => auditPlanHeaderLabel(this.companyName().trim()));

  /** Two-letter glyph shown next to the top-bar label, derived from the
      company name's initials (first letters of up to its first two words). */
  readonly companyInitials = computed(() => {
    const words = this.companyName().trim().split(/\s+/).filter(Boolean);
    const initials = words.slice(0, AUDIT_PLAN_INITIALS_WORD_COUNT).map(w => w[0]!.toUpperCase()).join('');
    return initials || AUDIT_PLAN_DEFAULT_INITIALS;
  });

  readonly tabs: LevelTab[] = PLAN_LEVEL_TABS;
  readonly months = MONTHS;

  readonly freqOptions = (Object.entries(FREQ_LABELS) as [Frequency, string][])
    .map(([value, label]) => ({ value, label }));
  readonly statusOptions = (Object.entries(STATUS_META) as [InstanceStatus, { label: string }][])
    .map(([value, meta]) => ({ value, label: meta.label }));

  /** typed reactive filter form — multi-select filters hold arrays */
  readonly filterForm = this.fb.nonNullable.group({
    subDivision: [[] as string[]],
    freq: [[] as Frequency[]],
    status: [[] as InstanceStatus[]],
    search: '',
  });

  ngOnInit(): void {
    // ── Company pre-selection from selector page ─────────────────────────
    const companyId   = this.route.snapshot.queryParamMap.get(AUDIT_PLAN_QUERY_PARAMS.Company) ?? undefined;
    const companyName = this.route.snapshot.queryParamMap.get(AUDIT_PLAN_QUERY_PARAMS.CompanyName);
    const planId      = this.route.snapshot.queryParamMap.get(AUDIT_PLAN_QUERY_PARAMS.Plan);

    if (companyName) this.companyName.set(companyName);

    // Pick the plan from the URL (refresh/deep link) or default to the
    // first plan in the dropdown (oldest year), so the page always matches it.
    const plans = this.companyPlans();
    const plan  = plans.find(p => p.id === planId) ?? plans[0];

    // Load data for the selected plan (store forwards it to the API).
    // No plan for this company → falls back to the company-wide data.
    if (plan) this.store.planId.set(plan.id);
    this.store.loadYear(plan ? planYear(plan) : this.store.year(), companyId);

    /* Multi-select filters are committed on PANEL CLOSE (commitFilters below),
       NOT per click — applying per click re-renders the page under the open
       overlay, which makes PrimeNG close it after every selection.
       Only the search box streams live (debounced). */
    this.filterForm.controls.search.valueChanges
      .pipe(debounceTime(AUDIT_PLAN_SEARCH_DEBOUNCE_MS), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(v => this.store.setFilter({ search: v }));
  }

  /** Apply the three multi-select filters in one shot (panel close / clear).
      PrimeNG's showClear writes NULL into the control (even on nonNullable
      groups) — normalise to [] or the filter code crashes on .length. */
  commitFilters(): void {
    const { subDivision, freq, status } = this.filterForm.getRawValue();
    this.store.setFilter({
      dept: subDivision ?? [],
      freq: freq ?? [],
      status: status ?? [],
    });
  }

  /** The current company's audit plans (from the plan list), oldest year first (ascending). */
  readonly companyPlans = computed(() => {
    const name = this.companyName().trim();
    return this.planList.plans()
      .filter(p => p.isActive !== false && p.organizationName === name)
      .sort((a, b) => planYear(a) - planYear(b) || planTitle(a).localeCompare(planTitle(b)));
  });

  /** Top-bar plan dropdown options — replaces the old FY year switch. */
  readonly planOptions = computed(() =>
    this.companyPlans().map(p => ({ label: planTitle(p), value: p.id })));

  /** Plan dropdown change → reload the page with that plan's data. */
  onPlanChange(planId: string | null): void {
    const plan = this.companyPlans().find(p => p.id === planId);
    if (!plan) return;
    this.store.loadPlan(plan.id, planYear(plan));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [AUDIT_PLAN_QUERY_PARAMS.Plan]: plan.id },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  tabIndex(view: PlanView): number {
    return this.tabs.findIndex(t => t.id === view);
  }

  /** Scope-level KPI — delegates to the store's real computed. */
  readonly scopeKpis = this.store.scopeStats;

  /**
   * Navigate to Audit Scope Management, optionally pre-selecting a status.
   * Passing no status opens the list unfiltered (used by the "Total" card).
   */
  goToScopeManagement(status?: ScopeManagementStatus): void {
    this.router.navigate([this.scopeRoute], {
      queryParams: status ? { [AUDIT_PLAN_QUERY_PARAMS.Status]: status } : {},
    });
  }

  /**
   * Navigate to the Scope Job list, optionally pre-selecting a job status.
   * Passing no status opens the list unfiltered (used by the "Total Jobs" card).
   */
  goToScopeJobs(status?: ScopeJobStatus): void {
    this.router.navigate([this.jobRoute], {
      queryParams: status ? { [AUDIT_PLAN_QUERY_PARAMS.Status]: status } : {},
    });
  }
}