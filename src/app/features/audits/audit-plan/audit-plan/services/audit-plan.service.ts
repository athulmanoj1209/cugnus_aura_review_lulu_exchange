import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AUDIT_PLAN_MOCK, Department } from '../models/audit-plan.model';
import { AUDIT_SCOPE_STATIC_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import { mapPlansToSubDivisions, mapStaticCompanyToSubDivisions } from '../com/audit-plan-scope-adapter';
import { AuditPlanListStore } from './audit-plan-list.store';
import { CompanyDataService } from '../../../../../shared/components/services/company-data.service';
import { CLIENT_MODE_VALUE } from '../../../../../core/config/client-mode';
import { AUDIT_PLAN_MOCK_LATENCY_MS } from '../constants/audit-plan.constants';


/* ------------------------------------------------------------------
 * Legacy mock plans — the fallback for every company id that doesn't have
 * a real, adapter-backed audit plan. These ids ('crowe-uae', 'crowe-ksa',
 * ...) are from the old hardcoded audit-plan-selector company list and no
 * longer match any real company id, since the selector now sources
 * companies from CompanyDataService (real ids like 'dar-exchange',
 * 'al-noor-jewellery', etc).
 *
 * getPlan() below only takes the real-company/adapter path under
 * CLIENT_MODE_VALUE === 'internal-audit' — the one mode where
 * AUDIT_SCOPE_STATIC_COMPANIES (→ SCOPE_INDI_ORG_COMPANIES) and
 * MOCK_SCOPE_JOBS (→ DAR_EXCHANGE_SCOPE_JOBS, generated from those same
 * companies' Approved scopes) actually agree on scope ids. In every other
 * client mode, AUDIT_SCOPE_STATIC_COMPANIES resolves to the multi-company
 * AUDIT_FIRM_SCOPE_COMPANIES roster, but MOCK_SCOPE_JOBS stays the small
 * hardcoded AUDIT_FIRM_SCOPE_JOBS list (unrelated scope ids) — routing
 * those companies through the adapter filters every one of their scopes
 * out for lack of a matching job, so the Audit Plan pages show nothing.
 * Keeping this gate mode-specific means every other client mode keeps
 * showing exactly the legacy/mock data it always did.
 *
 * Replace this whole file's mock path with the real API call when the
 * backend is ready — see getPlan() below.
 * ------------------------------------------------------------------ */
const pick = (...deptIds: string[]): Department[] =>
  AUDIT_PLAN_MOCK.filter(d => deptIds.includes(d.id));

const LEGACY_PLAN_BY_COMPANY: Record<string, Department[]> = {
  'crowe-uae':       AUDIT_PLAN_MOCK,                 // head office — full plan
  'crowe-ksa':       pick('fin', 'aml', 'ops'),
  'crowe-bahrain':   pick('fin', 'it'),
  'crowe-kuwait':    pick('aml', 'ops'),
  'crowe-qatar':     pick('fin', 'ops'),
  'crowe-oman':      pick('it', 'ops'),
  'crowe-egypt':     pick('fin', 'aml'),
  'crowe-jordan':    pick('aml', 'it'),
  'crowe-lebanon':   pick('fin'),
  'crowe-india':     AUDIT_PLAN_MOCK,
  'crowe-pakistan':  pick('fin', 'it', 'ops'),
  'crowe-singapore': pick('aml', 'it', 'ops'),
};

/**
 * Data access for the audit plan.
 *
 * Currently mock-backed. To wire the real API, replace the body of
 * getPlan() with:
 *
 *   return this.http.get<Department[]>(`${API}/audit-plan`,
 *     { params: { year, ...(companyId ? { companyId } : {}) } });
 *
 * and inject HttpClient. Nothing else in the feature changes —
 * the store only consumes this Observable.
 */
@Injectable({ providedIn: 'root' })
export class AuditPlanService {
  private readonly companyData = inject(CompanyDataService);
  /** the Audit Plan list's rows — a picked plan's data is read from here */
  private readonly planList = inject(AuditPlanListStore);

  /** One aggregated payload per fiscal year & company. */
  getPlan(year: number, companyId?: string, planId?: string): Observable<Department[]> {
    void year; // used by the real API call

    // A specific audit plan picked from the plan dropdown — show only that
    // plan's sub-divisions/scopes, whatever the client mode.
    const plan = this.planList.getById(planId);
    if (plan) {
      return of(mapPlansToSubDivisions([plan], companyId ?? plan.id))
        .pipe(delay(AUDIT_PLAN_MOCK_LATENCY_MS));
    }

    // Only 'internal-audit' has a job source (DAR_EXCHANGE_SCOPE_JOBS) that
    // actually matches AUDIT_SCOPE_STATIC_COMPANIES's scopes by id — every
    // other client mode falls straight through to the legacy/mock data below,
    // same as it always has.
    const realCompany = companyId && CLIENT_MODE_VALUE === 'internal-audit'
      ? AUDIT_SCOPE_STATIC_COMPANIES.find(c => c.id === companyId)
      : undefined;

    // 'audit-firm': a known company's overview is built from the plan list's
    // own mock plans for that company, so division-level plans (hasSubDivision:
    // false) show as division lanes here too. A company with no plans gets none.
    const firmCompany = companyId && CLIENT_MODE_VALUE === 'audit-firm'
      ? this.companyData.getById(companyId)
      : undefined;

    const data = realCompany
      ? mapStaticCompanyToSubDivisions(realCompany)
      : firmCompany
        ? mapPlansToSubDivisions(this.planList.plans().filter(p => p.organizationName === firmCompany.companyName), firmCompany.id)
        : (companyId && LEGACY_PLAN_BY_COMPANY[companyId]) || AUDIT_PLAN_MOCK;

    return of(data).pipe(delay(AUDIT_PLAN_MOCK_LATENCY_MS)); // simulate latency
  }
}