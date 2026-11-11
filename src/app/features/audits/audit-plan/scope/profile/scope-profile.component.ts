import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { AUDITOR_PROFILES, REVIEWER_PROFILES } from '@/app/features/audits/organization/divisions/list/division-list.component';
import type { Scope, SubScope, PersonnelProfile, ReviewerProfile } from '@/app/features/audits/organization/divisions/models/division-list.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { AssigneesPanelComponent } from '@/app/shared/components/assignees-panel/assignees-panel.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { resolveScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import type { ScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import type { ScopeProfileDrawerData } from '@/app/features/audits/audit-plan/scope/models/scope.model';
import { findAuditPlanForScope, periodLabel } from '@/app/features/audits/audit-plan/audit-plan/com/audit-plan-data';
import { ScopeRiskRatings, SCOPE_SUBSCOPE_PAGE_SIZE } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_AUDIT_FREQUENCY_LABELS,
  SCOPE_MODE_OF_AUDIT_LABELS,
  SCOPE_RISK_RATING_LABELS,
  SCOPE_SAMPLING_METHODOLOGY_LABELS,
  SCOPE_TYPE_LABELS,
} from '@/app/features/audits/audit-plan/scope/constants/scope-labels.constants';

@Component({
  selector: 'app-scope-profile',
  standalone: true,
  imports: [CommonModule, TagModule, TooltipModule, ButtonModule, ChipModule, DividerModule, ProgressBarModule, PaginatorModule, IconFieldModule, InputIconModule, InputTextModule, AssigneesPanelComponent, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scope-profile.component.html',
  styleUrls: ['./scope-profile.component.scss'],
})
export class ScopeProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as ScopeProfileDrawerData | null;

  private readonly _scope = signal<Scope | null>(this.data?.scope ?? null);
  private readonly _subscope = signal<SubScope | null>(this.data?.subscope ?? null);
  private readonly _parentName = signal(this.data?.parentName ?? '');

  readonly isSubscopeMode = computed(() => !!this._subscope());

  readonly displayName = computed(() =>
    this._subscope()?.subScopeName ?? this._scope()?.scopeName ?? ''
  );

  readonly displayType = computed(() =>
    this._subscope()?.subScopeType ?? this._scope()?.scopeType ?? ''
  );

  readonly displayAuditFrequency = computed(() =>
    this._subscope()?.auditFrequency ?? this._scope()?.auditFrequency ?? ''
  );

  readonly displayModeOfAudit = computed(() =>
    this._subscope()?.modeOfAudit ?? this._scope()?.modeOfAudit ?? ''
  );

  readonly displaySamplingMethodology = computed(() =>
    this._subscope()?.samplingMethodology ?? this._scope()?.samplingMethodology ?? ''
  );

  readonly displaySamplingSize = computed(() =>
    this._subscope()?.samplingSize ?? this._scope()?.samplingSize ?? null
  );

  readonly displayStartDate = computed(() =>
    this._subscope()?.startDate ?? this._scope()?.startDate ?? ''
  );

  readonly displayEndDate = computed(() =>
    this._subscope()?.endDate ?? this._scope()?.endDate ?? ''
  );

  readonly displayAssignedAuditors = computed<PersonnelProfile[]>(() => {
    const ids = this._subscope()?.assignedAuditors ?? this._scope()?.assignedAuditors ?? [];
    return ids.map(id => AUDITOR_PROFILES[id]).filter((p): p is PersonnelProfile => !!p);
  });

  readonly displayAssignedReviewers = computed<ReviewerProfile[]>(() => {
    const ids = this._subscope()?.assignedReviewers ?? this._scope()?.assignedReviewers ?? [];
    return ids.map(id => REVIEWER_PROFILES[id]).filter((p): p is ReviewerProfile => !!p);
  });

  readonly displayLinkedSubDivisions = computed(() =>
    this._subscope()?.linkedSubDivisions ?? this._scope()?.linkedSubDivisions ?? []
  );

  readonly displayObjective = computed(() =>
    this._subscope()?.objective ?? this._scope()?.objective ?? ''
  );

  readonly displayEstimatedHours = computed(() =>
    this._subscope()?.estimatedHours ?? this._scope()?.estimatedHours ?? null
  );

  readonly displayHourlyRate = computed(() =>
    this._subscope()?.hourlyRate ?? this._scope()?.hourlyRate ?? null
  );

  readonly displayRiskRating = computed(() =>
    this._subscope()?.riskRating ?? this._scope()?.riskRating ?? ''
  );

  readonly displayRiskRefId = computed(() =>
    this._subscope()?.riskReferenceId ?? this._scope()?.riskReferenceId ?? ''
  );

  readonly displayCompletionNote = computed(() =>
    this._subscope()?.completionNote ?? this._scope()?.completionNote ?? ''
  );

  readonly displayJustification = computed(() =>
    this._subscope()?.justificationForSampling ?? this._scope()?.justificationForSampling ?? ''
  );

  /** Company / division / sub-division labels from the record's own company/divisionCode/
   *  subDivisionName (static scope shape); sub-division is '—' when the parent division
   *  has no sub-divisions. Null when the caller's record carries no org fields. */
  readonly orgLabels = computed<ScopeOrgLabels | null>(() => {
    const rec = (this._subscope() ?? this._scope()) as unknown as
      { company?: string; divisionCode?: string; subDivisionName?: string | null } | null;
    if (!rec?.company && !rec?.divisionCode) return null;
    return resolveScopeOrgLabels(rec.company, rec.divisionCode, rec.subDivisionName);
  });

  /** The audit plan (audit-plan-data.ts) the record belongs to — its own
   *  `auditPlanId`, else matched on its company/division/sub-division. */
  readonly auditPlan = computed<{ name: string; period: string } | null>(() => {
    const rec = (this._subscope() ?? this._scope()) as unknown as
      { auditPlanId?: string | null; subDivisionName?: string | null } | null;
    const org = this.orgLabels();
    if (!rec || !org) return null;
    const plan = findAuditPlanForScope(rec.auditPlanId, org.companyName, org.divisionName, rec.subDivisionName);
    return plan ? { name: plan.planName, period: periodLabel(plan) } : null;
  });

  readonly subScopes = computed(() => this._scope()?.subScopes ?? []);

  readonly parentName$ = computed(() => this._parentName());

  readonly parentScopeName = computed(() => this._subscope()?.parentScope ?? this._parentName());

  readonly computedBudget = computed(() => {
    const hours = this.displayEstimatedHours();
    const rate = this.displayHourlyRate();
    if (hours == null || rate == null) return null;
    return hours * rate;
  });

  readonly durationDays = computed<number | null>(() => {
    const s = this.displayStartDate();
    const e = this.displayEndDate();
    if (!s || !e) return null;
    const start = new Date(s);
    const end = new Date(e);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (24 * 3600 * 1000)));
  });

  // ─── Sub-scope search & pagination ───────────────────
  readonly SUBSCOPE_PAGE_SIZE = SCOPE_SUBSCOPE_PAGE_SIZE;

  private readonly _subscopeSearch = signal('');
  private readonly _subscopeFirst  = signal(0);

  readonly filteredSubScopes = computed(() => {
    const q = this._subscopeSearch().toLowerCase().trim();
    const list = this.subScopes();
    return q ? list.filter(ss => ss.subScopeName.toLowerCase().includes(q)) : list;
  });

  readonly pagedSubScopes = computed(() =>
    this.filteredSubScopes().slice(this._subscopeFirst(), this._subscopeFirst() + this.SUBSCOPE_PAGE_SIZE)
  );

  getSubscopeSearch(): string { return this._subscopeSearch(); }
  setSubscopeSearch(q: string): void { this._subscopeSearch.set(q); this._subscopeFirst.set(0); }
  getSubscopeFirst(): number { return this._subscopeFirst(); }
  onSubscopePageChange(event: { first?: number }): void { this._subscopeFirst.set(event.first ?? 0); }

  onHide(): void {
    this.drawerRef.close(null);
  }

  scopeTypeLabel(t?: string): string {
    return SCOPE_TYPE_LABELS[t ?? ''] ?? (t ?? '—');
  }

  auditFrequencyLabel(f?: string): string {
    return SCOPE_AUDIT_FREQUENCY_LABELS[f ?? ''] ?? (f ?? '—');
  }

  modeOfAuditLabel(m?: string): string {
    return SCOPE_MODE_OF_AUDIT_LABELS[m ?? ''] ?? (m ?? '—');
  }

  methodologyLabel(m?: string): string {
    return SCOPE_SAMPLING_METHODOLOGY_LABELS[m ?? ''] ?? (m ?? '—');
  }

  riskSeverity(r?: string | null): 'success' | 'warn' | 'danger' | 'secondary' {
    return r === ScopeRiskRatings.Low ? 'success'
      : r === ScopeRiskRatings.Medium ? 'warn'
      : r === ScopeRiskRatings.High ? 'danger'
      : 'secondary';
  }

  riskLabel(r?: string | null): string {
    return SCOPE_RISK_RATING_LABELS[r ?? ''] ?? (r ?? '—');
  }
}
