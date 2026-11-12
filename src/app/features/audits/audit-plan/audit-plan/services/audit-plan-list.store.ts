import { Injectable, signal } from '@angular/core';
import { AuditPlan, MOCK_PLANS } from '../com/audit-plan-data';
import { AuditPlanHeader } from '../models/audit-plan.model';
import { planDivisionSource } from '../manage/audit-plan.component';
import {
  AUDIT_PLAN_ID_PAD_LENGTH,
  AUDIT_PLAN_ID_PREFIX,
  AuditPlanStatuses,
} from '../constants/audit-plan.constants';

/**
 * App-wide source of the Audit Plan list's rows.
 *
 * The plan list page used to keep its rows in a component-local signal, so
 * plans created / edited / (de)activated there were invisible to every other
 * page. Both the list and the Audit Plan page (its plan dropdown + data) now
 * read and write this one signal, so the Audit Plan page always shows exactly
 * what the list shows.
 *
 * Seeded from MOCK_PLANS; swap the seed for an API load when the backend is ready.
 */
@Injectable({ providedIn: 'root' })
export class AuditPlanListStore {
  readonly plans = signal<AuditPlan[]>(MOCK_PLANS);

  getById(id: string | null | undefined): AuditPlan | undefined {
    return id ? this.plans().find(p => p.id === id) : undefined;
  }

  /**
   * Create a new Draft plan from the Add Audit Plan drawer result and put it at
   * the top of the list. Shared by the plan list page and the plan selector so
   * both create plans the same way. Returns the new plan.
   */
  createFromHeader(header: AuditPlanHeader): AuditPlan {
    const plan: AuditPlan = {
      ...this.fromHeader(header),
      id: this.nextPlanId(),
      status: AuditPlanStatuses.Draft,
      subDivisions: [],
    };
    this.plans.update(list => [plan, ...list]);
    return plan;
  }

  /** Drawer result → list row header fields (names resolved back from the org roster). */
  fromHeader(h: AuditPlanHeader): Pick<AuditPlan, 'planName' | 'organizationName' | 'divisionName' | 'startDate' | 'endDate'> {
    const company  = planDivisionSource().find(c => c.id === h.companyId);
    const division = company?.divisions.find(d => d.divisionCode === h.divisionCode);
    return {
      planName:         h.planName,
      organizationName: company?.companyName ?? '',
      divisionName:     division?.divisionName ?? '',
      startDate:        h.periodFrom,
      endDate:          h.periodTo,
    };
  }

  private nextPlanId(): string {
    const max = this.plans().reduce((m, p) => {
      const n = p.id.startsWith(AUDIT_PLAN_ID_PREFIX) ? Number(p.id.slice(AUDIT_PLAN_ID_PREFIX.length)) : Number(p.id);
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);
    return `${AUDIT_PLAN_ID_PREFIX}${String(max + 1).padStart(AUDIT_PLAN_ID_PAD_LENGTH, '0')}`;
  }
}
