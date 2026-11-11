import { Injectable, inject, signal } from '@angular/core';
import { Company, OrgStatus } from '../../../features/audits/organization/company/models/company.model';
import { COMPANIES_SEED as AUDIT_FIRM_COMPANIES_SEED } from '../../../features/audits/organization/company/company-static-data';
import { COMPANIES_SEED as INTERNAL_AUDIT_COMPANIES_SEED } from '../../../features/audits/organization/company/company-static-indi-org.data';
import { deactivateAllDivisionsForCompany } from '@/app/features/audits/organization/divisions/division-static-data';
import { CLIENT_MODE } from '../../../core/config/client-mode';


/**
 * Global, app-wide source of truth for company data.
 *
 * Inject this wherever company data is needed — the companies list, the
 * profile drawer, the Add/Edit Company modal, etc. — instead of importing
 * the seed data directly. Because it's `providedIn: 'root'`, every
 * injector gets the same singleton instance, so an edit made from one
 * screen (e.g. blocking a company from the list) is immediately visible
 * everywhere else that reads from this service.
 */
@Injectable({ providedIn: 'root' })
export class CompanyDataService {
  private readonly clientMode = inject(CLIENT_MODE);
  private readonly _companies = signal<Company[]>(
    this.clientMode === 'internal-audit' ? INTERNAL_AUDIT_COMPANIES_SEED : AUDIT_FIRM_COMPANIES_SEED,
  );

  /** Reactive, read-only view of every company. Use in computed()/effect(). */
  readonly companies = this._companies.asReadonly();

  /** Non-reactive snapshot, handy outside a reactive context. */
  get all(): Company[] {
    return this._companies();
  }

  getById(id: string): Company | undefined {
    return this._companies().find(c => c.id === id);
  }

  /** Whether the given company is currently deactivated (blocked). */
  isCompanyBlocked(companyId: string): boolean {
    return this.getById(companyId)?.blocked ?? false;
  }

  /** Add a brand-new company to the store (e.g. from the Add Company form). */
  add(company: Company): void {
    this._companies.update(list => [company, ...list]);
  }

  /** Merge a partial update into an existing company by id. */
  update(id: string, patch: Partial<Company>): void {
    this._companies.update(list =>
      list.map(c => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  /**
   * Flip a company's blocked/active state. Deactivating a company (blocked
   * false -> true) also forces every one of its branches to inactive —
   * company is the one level where deactivating cascades down; branch,
   * department, scope and sub-scope activate/deactivate all stay fully
   * independent of each other, unchanged. Reactivating a company does NOT
   * auto-reactivate its branches.
   */
  toggleBlocked(id: string): void {
    const wasBlocked = this._companies().find(c => c.id === id)?.blocked ?? false;
    this._companies.update(list =>
      list.map(c => (c.id === id ? { ...c, blocked: !c.blocked } : c)),
    );
    if (!wasBlocked) {
      deactivateAllDivisionsForCompany(id);
    }
  }

  /** Set a company's approval workflow status. */
  setOrgStatus(id: string, orgStatus: OrgStatus): void {
    this.update(id, { orgStatus });
  }

  remove(id: string): void {
    this._companies.update(list => list.filter(c => c.id !== id));
  }
}