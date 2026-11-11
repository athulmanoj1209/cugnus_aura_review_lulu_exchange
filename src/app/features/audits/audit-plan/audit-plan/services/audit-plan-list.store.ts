import { Injectable, signal } from '@angular/core';
import { AuditPlan, MOCK_PLANS } from '../com/audit-plan-data';

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
}
