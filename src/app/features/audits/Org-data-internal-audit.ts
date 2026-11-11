/**
 * ============================================================================
 *  Internal-audit-mode Company -> Branch -> Department -> Scope -> Sub-scope
 *  directory — same OrgCompany/OrgBranch/OrgDepartment/OrgDeptScope/
 *  OrgSubScope/OrgTask shape as ORG_STATIC_DATA (company-org-data.ts), built
 *  from the DAR Exchange / XYZ Broadcast single-org seed files
 *  (company/department/audit-scope *-static-indi-org.data.ts).
 *
 *  Company/Branch/Department listing (names, codes, contact info, ...) is
 *  sourced from department-static-indi-org.data.ts's DEPARTMENT_INDI_ORG_COMPANIES
 *  — the same file the Departments module itself reads from — so this
 *  adapter's department list can never drift from what the Departments list
 *  page actually shows (it previously read branch-static-indi-org.data.ts's
 *  own inline department list instead, which had gone stale/out of sync for
 *  XYZ Broadcast: department-static-indi-org.data.ts had trimmed its XYZ
 *  roster down to 5 real departments while the branch file still listed all
 *  27 draft ones). Each department's Scope -> Sub-scope -> Task detail still
 *  comes from audit-scope-static-indi-org.data.ts's SCOPE_INDI_ORG_COMPANIES
 *  (richer than department-static-indi-org.data.ts's own `scopes` preview —
 *  it carries tasks), matched by branchCode::departmentName.
 *
 *  Any page that reads ORG_STATIC_DATA can switch to
 *  ORG_STATIC_DATA_INTERNAL_AUDIT when CLIENT_MODE is 'internal-audit'
 *  without any other code changes — see findings-list.component.ts's
 *  `orgData` computed for the pattern (same CLIENT_MODE ? … : … switch
 *  CompanyDataService already uses for COMPANIES_SEED).
 * ============================================================================
 */

import type {
  OrgCompany,
  OrgDivision,
  OrgSubDivision,
  OrgSubDivisionScope,
  OrgSubScope,
  OrgTask,
  SubDivisionType,
  EntityStatus,
  RiskRating,
  RiskStatus,
  SubScopeType,
  ScopeType,
} from './organization/company/company-org-data';

import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import type { StaticScope, ScopeTask } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import { COMPANIES_SEED } from './organization/company/company-static-indi-org.data';

/**
 * company-org-data.ts's DepartmentType union has no exact 'compliance' /
 * 'consumer-protection' option (unlike department-static-data.ts's, the
 * source type of DEPARTMENT_INDI_ORG_COMPANIES below), so those two map to
 * their closest available literal here; every other DepartmentType value is
 * shared by both unions and passes through unchanged.
 */
const DEPARTMENT_TYPE_FALLBACK: Partial<Record<string, SubDivisionType>> = {
  'consumer-protection': 'customer-service',
  'compliance': 'legal-compliance',
};
function toOrgDepartmentType(type: string): SubDivisionType {
  return (DEPARTMENT_TYPE_FALLBACK[type] ?? type) as SubDivisionType;
}

function toOrgTasks(tasks: ScopeTask[] | undefined): OrgTask[] | undefined {
  if (!tasks?.length) return undefined;
  return tasks.map(t => ({ taskCode: t.id ?? '', taskName: t.taskName ?? '' }));
}

/**
 * Builds a department's OrgDeptScope[] from its flat StaticScope[] list — a
 * scope with parentScopeId: null/undefined is top-level; one whose
 * parentScopeId matches a top-level scope's id becomes that scope's
 * sub-scope (used only under BRANCH 2's AML/CFT Compliance scope, SC-5000,
 * which has 3 sub-scopes; every other department has a single top-level
 * scope with no sub-scopes).
 */
function toOrgDeptScopes(scopes: StaticScope[]): OrgSubDivisionScope[] {
  return scopes
    .filter(s => !s.parentScopeId)
    .map((s): OrgSubDivisionScope => {
      const subScopes: OrgSubScope[] = scopes
        .filter(sub => sub.parentScopeId === s.id)
        .map(sub => ({
          subScopeName: sub.scopeName,
          // StaticScope has no substantive/controls distinction of its own
          // — defaulted, since these AML/CFT sub-scopes are closer to
          // substantive testing than pure control-design review.
          subScopeType: 'substantive' as SubScopeType,
          auditFrequency: sub.auditFrequency ?? 'annually',
          // sub.riskRating (ScopeRiskRating) is nullable/optional in the
          // source type — default to 'medium' when not set.
          riskRating: (sub.riskRating ?? 'medium') as RiskRating,
          tasks: toOrgTasks(sub.tasks),
        }));
      return {
        scopeName: s.scopeName,
        scopeType: s.scopeType as ScopeType,
        auditFrequency: s.auditFrequency ?? 'annually',
        // s.riskRating (ScopeRiskRating) is nullable/optional in the source
        // type — default to 'medium' when not set.
        riskRating: (s.riskRating ?? 'medium') as RiskRating,
        subScopes: subScopes.length ? subScopes : undefined,
        tasks: toOrgTasks(s.tasks),
      };
    });
}

/**
 * branchCode::departmentName -> that department's StaticScope[], from the
 * audit-scope indi-org seed (richer than branch-indi-org's own inline
 * `scopes` — it carries tasks and the AML/CFT scope's 3 sub-scopes).
 */
const SCOPES_BY_DEPT_KEY = new Map<string, StaticScope[]>();
for (const company of SCOPE_INDI_ORG_COMPANIES) {
  for (const branch of company.divisions) {
    for (const dept of branch.subDivisions) {
      SCOPES_BY_DEPT_KEY.set(`${branch.divisionCode}::${dept.subDivisionName}`, dept.scopes);
    }
  }
}

/**
 * companyName here is sourced from COMPANIES_SEED (company-static-indi-org.data.ts
 * — the same seed CompanyDataService reads, matched by id) rather than this
 * department seed's own `companyName` field, so a finding's company always
 * agrees with what the Company module actually shows for the active org
 * instead of the two seed files silently drifting apart.
 */
const COMPANY_NAME_BY_ID = new Map(COMPANIES_SEED.map(c => [c.id, c.companyName]));

export const ORG_STATIC_DATA_INTERNAL_AUDIT: OrgCompany[] = SUB_DIVISION_INDI_ORG_COMPANIES.map(company => ({
  id: company.id,
  companyName: COMPANY_NAME_BY_ID.get(company.id) ?? company.companyName,
  tag: company.tag,
  color: company.color,
  industry: company.industry,
  divisions: company.divisions.map((division : any): OrgDivision => ({
    divisionCode: division.divisionCode,
    divisionName: division.divisionName,
    hasSubDivision: division.hasSubDivision,
    subDivisions: division.subDivisions.map((dept : any): OrgSubDivision => {
      const key = `${division.divisionCode}::${dept.subDivisionName}`;
      const scopes = SCOPES_BY_DEPT_KEY.get(key) ?? [];
      return {
        subDivisionCode: dept.subDivisionCode,
        subDivisionName: dept.subDivisionName,
        subDivisionType: toOrgDepartmentType(dept.departmentType),
        company: dept.company,
        status: (dept.status ?? 'active') as EntityStatus,
        riskRating: (dept.riskRating ?? 'medium') as RiskRating,
        riskStatus: (dept.riskStatus ?? 'open') as RiskStatus,
        primaryContactPerson: dept.primaryContactPerson ?? null,
        contactEmail: dept.contactEmail ?? '',
        contactPhone: dept.contactPhone ?? '',
        description: dept.description ?? '',
        subDivisionHead: dept.subDivisionHead ?? null,
        // dept.numberOfEmployees / dept.operationalSince are nullable in the
        // source StaticDepartment type — default when not set.
        numberOfEmployees: dept.numberOfEmployees ?? 0,
        operationalSince: dept.operationalSince ?? '',
        parentSubDivisions: dept.parentSubDivisions ?? [],
        scopes: toOrgDeptScopes(scopes),
        createdAt: dept.createdAt,
      };
    }),
  })),
}));
/* ── Mock-record org assignment ────────────────────────────────────────
 * Every real {company, branch, department, scope, subscope} combo in the
 * active internal-audit org — one per sub-scope, or one per scope when it
 * has none. `internalAuditOrgFieldsFor(key)` picks one deterministically
 * from a record's id, so the same mock record (e.g. working paper A-100)
 * lands on the same org values on every page that seeds it (Working
 * Papers list + Working Paper Review queue) — and every value exists in
 * the drawers' Company/Branch/Department/Scope/Sub-scope selects. */
export interface InternalAuditOrgFields {
  company: string;
  branch: string;
  department: string;
  scope: string;
  subscope: string;
}

export const INTERNAL_AUDIT_ORG_COMBOS: InternalAuditOrgFields[] =
  ORG_STATIC_DATA_INTERNAL_AUDIT.flatMap(c => c.divisions.flatMap(b => b.subDivisions.flatMap(d => {
    const base = { company: c.companyName, branch: b.divisionName, department: d.subDivisionName };
    if (!d.scopes?.length) return [{ ...base, scope: '', subscope: '' }];
    return d.scopes.flatMap(sc => sc.subScopes?.length
      ? sc.subScopes.map(sub => ({ ...base, scope: sc.scopeName, subscope: sub.subScopeName }))
      : [{ ...base, scope: sc.scopeName, subscope: '' }]);
  })));

export function internalAuditOrgFieldsFor(key: string): InternalAuditOrgFields | undefined {
  if (!INTERNAL_AUDIT_ORG_COMBOS.length) return undefined;
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return INTERNAL_AUDIT_ORG_COMBOS[hash % INTERNAL_AUDIT_ORG_COMBOS.length];
}
