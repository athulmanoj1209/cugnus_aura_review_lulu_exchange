import {
  Component, computed, HostListener, inject, OnInit, signal,
} from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { ObservationComponent, AddObservationDrawerData, AddObservationResult } from '../manage/observation.component';
import { ObservationProfileComponent, ObservationDetailDrawerData } from '../profile/observation-profile.component';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { ORG_STATIC_DATA } from '../../../organization/company/company-org-data';
import { COMPANIES_SEED } from '../../../organization/company/company-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
// Temporary, client-only bridge into the Pending Approvals queue (see
// execution-approval-list.component.ts) — adjust this relative path if that
// component lives somewhere else in your tree; it's assumed to be a sibling
// folder of this one, same as add-observation/.
import { addPendingItem, PendingItem } from '@/app/features/admin/review/execution-requests/list/execution-requests-list.component';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import {
  OBSERVATION_CURRENT_USER_NAME,
  OBSERVATION_DATE_FORMAT_OPTIONS,
  OBSERVATION_DATE_LOCALE,
  OBSERVATION_DEFAULT_STATUS,
  OBSERVATION_DRAWER_WIDTH,
  OBSERVATION_ID_PAD_LENGTH,
  OBSERVATION_ID_PREFIX,
  OBSERVATION_LIST_PAGE_SIZE,
  OBSERVATION_PENDING_ITEM_DEFAULTS,
  OBSERVATION_QUERY_PARAMS,
  OBSERVATION_RISK_BAND_RATINGS,
  ObservationBlockActions,
  ObservationDrawerModes,
  ObservationRiskBands,
  ObservationSortColumns,
  ObservationSortDirections,
  ObservationViewModes,
  RISK_RATING_RANK,
  RiskRatings,
  type ObservationBlockAction,
  type ObservationRiskBand,
  type ObservationSortColumn,
  type ObservationSortDirection,
  type ObservationStatus,
  type ObservationViewMode,
  type RiskRating,
} from '../constants/observation.constants';
import {
  AUDITOR_OBSERVATION_STATUS_LABELS,
  OBSERVATION_ACTIVE_ICONS,
  OBSERVATION_SORT_ICONS,
  OBSERVATION_STATUS_LABELS,
  OBSERVATION_STATUS_OPTIONS,
  RISK_RATING_LABELS,
  RISK_RATING_OPTIONS,
} from '../constants/observation-labels.constants';
import {
  OBSERVATION_ACTIVE_LABELS,
  OBSERVATION_NO_RESULTS,
  OBSERVATION_SUB_DIVISION_FILTER_PLACEHOLDERS,
  pageRangeLabel,
} from '../constants/observation-messages.constants';

// Company/Division/Sub-Division filter options below come from the shared
// company-org-data.ts file (the same common Company -> Division -> Sub-Division
// static data used by the Add Member modal, Members list, Companies list,
// Add Risk drawer, Risk Register, Scope Jobs and Evidence Repository
// filters) instead of being scraped off whatever values happen to appear
// on MOCK — so the filter always offers the full canonical list. Division
// narrows to the selected Company's divisions and Sub-Division narrows to
// the selected Company+Division's sub-divisions, same cascading behaviour as
// those other pages. Adjust the '@/app/data/company-org-data' path if
// that file lives elsewhere.
//
// In 'internal-audit' mode, Division/Sub-Division instead come from the
// DAR Exchange division/sub-division catalog (division-static-indi-org.data.ts
// / sub-division-static-indi-org.data.ts) rather than company-org-data.ts —
// see the CLIENT_MODE_VALUE check inside divisionOptions/subDivisionOptions
// below.
//
// Observation.company / Observation.division / Observation.subDivision are
// plain display-name strings (not ids/codes), so the option *values* here
// are the company/division/sub-division *names* themselves. The 12 seed MOCK
// records below have been aligned to real companies/divisions/sub-divisions
// from company-org-data.ts (they previously used unrelated placeholder
// names like 'Crowe UAE' / 'Dubai' / 'Finance', which never matched
// anything and would have made these filters show zero records too).
//
// The Scope filter (scopeOptions below) is still *computed* by scraping
// distinct values off this.observations() — same mechanism as the Evidence
// Repository list's Scope filter — but the 12 seed records' scope/subscope
// values have now been remapped from generic audit-category placeholders
// ('Internal Audit'/'Financial Controls', 'External Audit'/'Tax Audit', ...)
// to real per-sub-division Scope/Sub-scope names taken from each record's
// (already-aligned) company/division/sub-division in company-org-data.ts (e.g.
// OBS-005's AML vendor-screening finding now sits under Al Waha Construction
// & Contracting / Legal & Governance's real 'AML/CFT Compliance Review' →
// 'Walkthrough Testing' scope/sub-scope, not an invented category). So the
// filter's option list is populated with real, cross-checked scope names,
// even though the computed function itself doesn't call ORG_STATIC_DATA
// directly.
//
// The "+ New Observation" / Edit drawer (ObservationComponent) is now
// wired the same way (Company/Division/Sub-Division cascading, plus the fully
// cascading Company→Division→Sub-Division→Scope→Sub-scope picker, like Add
// Evidence's drawer already had). Its option *values* are the same
// company/division/sub-division/scope/subscope *names* used here, so the old
// COMPANY_LABELS/DIVISION_LABELS/SUBDIVISION_LABELS code-translation layer
// (crowe_uae -> 'Crowe UAE', dubai -> 'Dubai', ...) that used to bridge
// between its local codes and these display names is gone — openAdd() and
// openEdit() below now pass company/division/subDivision/scope/subscope
// straight through instead of translating.



/* ── Model ─────────────────────────────────────────────────────── */
// Value sets live in ../constants; re-exported so existing importers keep working.
export type { ObservationStatus, RiskRating } from '../constants/observation.constants';

export interface Observation {
  id: string;
  title: string;
  description: string;
  riskRating: RiskRating;
  scope: string;
  subscope: string;
  taskId: string;
  findingTitle: string;
  evidenceIds: string[];
  status: ObservationStatus;
  auditor: string;
  createdDate: Date;
  company: string;
  division: string;
  subDivision: string;
  isActive?: boolean;
}

interface FilterDraft {
  riskRating:  string;
  status:      string;
  scope:       string;
  company:     string;
  division:    string[];
  subDivision: string[];
  auditor:     string;
}

type SortColumn = ObservationSortColumn;
type SortDir    = ObservationSortDirection;

// The single company seeded for the active internal-audit org (DAR Exchange,
// XYZ Broadcast, ...) — see INTERNAL_AUDIT_CLIENT_KEY_VALUE in client-mode.ts.
const INTERNAL_AUDIT_COMPANY_NAME = COMPANIES_SEED[0]?.companyName ?? '';

const observationCompanyName = (company: string): string =>
  CLIENT_MODE_VALUE === 'internal-audit' ? INTERNAL_AUDIT_COMPANY_NAME : company;

// Division -> sub-division names, sourced from the real per-org sub-division
// catalog (sub-division-static-indi-org.data.ts) rather than scraped off the
// mock observations below, so the Sub-Division filter always offers the full
// canonical list for the active internal-audit org (DAR Exchange / XYZ
// Broadcast), same reasoning as INTERNAL_AUDIT_COMPANY_NAME above.
// Divisions flagged `hasSubDivision: false` are skipped, so their sub-divisions
// are never offered.
const INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION = new Map<string, string[]>(
  SUB_DIVISION_INDI_ORG_COMPANIES.flatMap(c =>
    c.divisions
      .filter(dv => dv.hasSubDivision !== false)
      .map(dv => [dv.divisionName, dv.subDivisions.map(sd => sd.subDivisionName)] as [string, string[]]),
  ),
);
const INTERNAL_AUDIT_SUB_DIVISION_NAMES = Array.from(
  new Set(Array.from(INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION.values()).flat()),
).sort((a, b) => a.localeCompare(b));

/**
 * Whether the Sub-Division filter applies for the given Company/Division
 * selection — false only when at least one division is selected and every
 * selected division is flagged `hasSubDivision: false` in the same catalog
 * the Division options come from (DIVISION_INDI_ORG_COMPANIES in
 * 'internal-audit' mode, else ORG_STATIC_DATA narrowed to the selected
 * company). Unknown divisions count as having sub-divisions.
 */
function divisionSelectionHasSubDivisions(companyName: string, divisionNames: string[]): boolean {
  if (!divisionNames.length) return true;
  const divisions: { divisionName: string; hasSubDivision?: boolean }[] = CLIENT_MODE_VALUE === 'internal-audit'
    ? DIVISION_INDI_ORG_COMPANIES.flatMap(c => c.divisions)
    : ORG_STATIC_DATA
        .filter(c => !companyName || c.companyName === companyName)
        .flatMap(c => c.divisions);
  return divisionNames.some(name => {
    const matches = divisions.filter(d => d.divisionName === name);
    return !matches.length || matches.some(d => d.hasSubDivision !== false);
  });
}

// Top-level scope names only (parentScopeId: null) — sub-scopes live in the
// Observation.subscope field, not Observation.scope (see
// internalAuditOrgFields()/flattenScopeCombos() below), so the Scope filter
// should only ever offer values that can actually appear there. Sourced from
// the real per-org audit-scope catalog (audit-scope-static-indi-org.data.ts)
// rather than scraped off the mock observations, so it's the full canonical
// list for the active internal-audit org, not just whatever the 16 mock
// records happen to cover.
const INTERNAL_AUDIT_SCOPE_NAMES = Array.from(
  new Set(
    SCOPE_INDI_ORG_COMPANIES.flatMap(c =>
      c.divisions.flatMap(dv => dv.subDivisions.flatMap(sd =>
        sd.scopes.filter(s => s.parentScopeId === null).map(s => s.scopeName),
      )),
    ),
  ),
).sort((a, b) => a.localeCompare(b));

interface OrgScopeCombo {
  divisionName: string;
  subDivisionName: string;
  scope: string;
  subscope: string;
}

/**
 * Flattens a StaticCompany[] audit-scope catalog (DAR Exchange / XYZ
 * Broadcast — see audit-scope-static-indi-org.data.ts) into one
 * {division, sub-division, scope, subscope} combo per real top-level
 * scope/sub-scope pair — a top-level scope with no children (parentScopeId
 * pointing to it) yields one combo with subscope: '' (e.g. HR Dept's
 * 'Human Resources / Emiratization'); one with children (e.g. AML/CFT
 * Compliance's 3 sub-scopes) yields one combo per child instead.
 */
function flattenScopeCombos(companies: typeof SCOPE_INDI_ORG_COMPANIES): OrgScopeCombo[] {
  const combos: OrgScopeCombo[] = [];
  companies.forEach(company => company.divisions.forEach(division => division.subDivisions.forEach(subDivision => {
    subDivision.scopes.filter(s => s.parentScopeId === null).forEach(top => {
      const subScopes = subDivision.scopes.filter(s => s.parentScopeId === top.id);
      if (subScopes.length === 0) {
        combos.push({ divisionName: division.divisionName, subDivisionName: subDivision.subDivisionName, scope: top.scopeName, subscope: '' });
      } else {
        subScopes.forEach(sub => combos.push({
          divisionName: division.divisionName, subDivisionName: subDivision.subDivisionName,
          scope: top.scopeName, subscope: sub.scopeName,
        }));
      }
    });
  })));
  return combos;
}

/**
 * In 'internal-audit' mode, the mock observations below get their
 * company/division/sub-division/scope/subscope overwritten (see
 * internalAuditOrgFields() and the observations signal further down) with
 * real combos cycled from the active org's audit-scope catalog
 * (SCOPE_INDI_ORG_COMPANIES) instead of the hardcoded 'audit-firm' values
 * baked into each MOCK record below, which belong to an unrelated
 * multi-company placeholder org and don't exist in either DAR Exchange's or
 * XYZ Broadcast's real sub-division/scope catalog. In 'audit-firm' mode the
 * MOCK records' own company/division/sub-division/scope/subscope values are
 * used as-is (already aligned to company-org-data.ts — see the long comment
 * near the top of this file).
 */
const INTERNAL_AUDIT_SCOPE_COMBOS: OrgScopeCombo[] =
  CLIENT_MODE_VALUE === 'internal-audit' ? flattenScopeCombos(SCOPE_INDI_ORG_COMPANIES) : [];

function internalAuditOrgFields(index: number, o: Observation): Pick<Observation, 'company' | 'division' | 'subDivision' | 'scope' | 'subscope'> {
  if (CLIENT_MODE_VALUE !== 'internal-audit' || INTERNAL_AUDIT_SCOPE_COMBOS.length === 0) {
    return { company: o.company, division: o.division, subDivision: o.subDivision, scope: o.scope, subscope: o.subscope };
  }
  const combo = INTERNAL_AUDIT_SCOPE_COMBOS[index % INTERNAL_AUDIT_SCOPE_COMBOS.length];
  return {
    company: INTERNAL_AUDIT_COMPANY_NAME,
    division: combo.divisionName,
    subDivision: combo.subDivisionName,
    scope: combo.scope,
    subscope: combo.subscope,
  };
}

/* ── Mock data ──────────────────────────────────────────────────── */
const MOCK: Observation[] = [
  {
    id: 'OBS-001',
    title: 'Lack of segregation of duties in payment approval',
    description: 'The same individual has authority to both create and approve payments in the ERP system, creating a significant risk of fraudulent disbursements. No compensating control (such as an automated exception report or dual-sign-off rule) is in place. During testing, 14 transactions totalling AED 2.3 million were found to have been approved by their own initiator. Immediate remediation is required: roles should be split and a monthly reconciliation report should be introduced.',
    riskRating: 'critical',
    scope: 'Procurement Audit',
    subscope: '',
    taskId: 'TSK-001', findingTitle: 'Segregation of duties gap',
    evidenceIds: ['EV-001', 'EV-006', 'EV-010'],
    status: 'submitted', auditor: 'Athul Manoj',
    createdDate: new Date('2025-03-10'),
    company: 'Al Noor Jewellery Group', division: 'Deira Gold Souk Flagship', subDivision: 'Finance & Accounting',
    isActive: true,
  },
  {
    id: 'OBS-002',
    title: 'User access rights not reviewed for over 12 months',
    description: 'Quarterly user access reviews mandated by the Information Security Policy have not been performed. A total of 47 active accounts belong to employees who have left the organisation or changed roles. Three of these accounts still hold elevated administrator privileges. The absence of a formal joiner-mover-leaver process exposes the company to insider-threat and data-exfiltration risk. Recommendation: implement a quarterly certification process using the IAM module already licensed.',
    riskRating: 'high',
    scope: 'Internal Controls Review',
    subscope: '',
    taskId: 'TSK-002', findingTitle: 'Stale user accounts with active privileges',
    evidenceIds: ['EV-002', 'EV-007'],
    status: 'reviewed', auditor: 'Sara Ahmed',
    createdDate: new Date('2025-03-15'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    isActive: true,
  },
  {
    id: 'OBS-003',
    title: 'HR policy document not updated following 2024 regulatory amendments',
    description: 'The employee handbook and HR policy manual were last revised in January 2023. Subsequent UAE Labour Law amendments (effective February 2024) introduced mandatory provisions on remote-work entitlements, parental leave, and end-of-service gratuity calculations that are not reflected in the current documentation. During staff interviews, four HR officers were unaware of the updated parental-leave entitlement. Non-compliance exposes the firm to regulatory penalties and potential employment disputes.',
    riskRating: 'medium',
    scope: 'Fixed Assets Verification',
    subscope: 'Control Design Assessment',
    taskId: 'TSK-003', findingTitle: 'Outdated HR policy documentation',
    evidenceIds: ['EV-003', 'EV-008'],
    status: 'approved', auditor: 'John Smith',
    createdDate: new Date('2025-03-20'),
    company: 'Marwa Gold & Gems', division: 'Ajman Central Souk', subDivision: 'Human Resources',
    isActive: true,
  },
  {
    id: 'OBS-004',
    title: 'Critical security patches deployed 45+ days beyond SLA',
    description: 'The IT patch management policy requires critical and high-severity patches to be applied within 14 days of vendor release. Testing of 32 servers and 120 workstations found that the average deployment lag for critical patches during Q1 2025 was 48 days, with the worst case reaching 91 days. Five servers remain unpatched for CVE-2024-21762 (CVSS 9.8). Delayed patching significantly increases the attack surface and violates the group\'s ISO 27001 control objectives.',
    riskRating: 'high',
    scope: 'Related Party Transactions Review',
    subscope: '',
    taskId: 'TSK-005', findingTitle: 'Patch management SLA breaches',
    evidenceIds: ['EV-005', 'EV-009', 'EV-011'],
    status: 'draft', auditor: 'Athul Manoj',
    createdDate: new Date('2025-04-01'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    isActive: true,
  },
  {
    id: 'OBS-005',
    title: 'Vendor contracts missing AML screening and renewal clauses',
    description: 'A sample of 20 vendor contracts reviewed against the AML/CFT policy revealed that 12 contracts do not include mandatory sanctions-screening provisions or automatic annual renewal triggers. Two of these vendors are categorised as high-risk due to operating in flagged jurisdictions. Under the CBUAE AML guidelines, all third-party relationships must be subject to ongoing due-diligence, including screening against HM Treasury, OFAC, and UN sanctions lists. Immediate contract addenda are required.',
    riskRating: 'low',
    scope: 'AML/CFT Compliance Review',
    subscope: 'Walkthrough Testing',
    taskId: 'TSK-004', findingTitle: 'Incomplete vendor AML/CFT clauses',
    evidenceIds: ['EV-004'],
    status: 'submitted', auditor: 'Meenu AM',
    createdDate: new Date('2025-04-05'),
    company: 'Al Waha Construction & Contracting', division: 'Dubai Investment Park Office', subDivision: 'Legal & Governance',
    isActive: true,
  },
  {
    id: 'OBS-006',
    title: 'No documented business continuity plan for core treasury operations',
    description: 'An assessment of the operational risk framework found that no formal Business Continuity Plan (BCP) exists for the treasury function, which processes an average of AED 85 million in transactions daily. The organisation last tested a BCP scenario in 2021. Three critical single points of failure were identified: sole dependency on one treasury dealer, a single Bloomberg terminal, and a single banking relationship for same-day settlement. Any disruption could result in material financial loss and reputational damage.',
    riskRating: 'critical',
    scope: 'Revenue Recognition Review',
    subscope: '',
    taskId: 'TSK-004', findingTitle: 'Absence of treasury BCP',
    evidenceIds: ['EV-006', 'EV-010', 'EV-012'],
    status: 'approved', auditor: 'Ivan Magalhaes',
    createdDate: new Date('2025-02-18'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Operations',
    isActive: false,
  },
  {
    id: 'OBS-007',
    title: 'Personal data retained beyond legally mandated retention periods',
    description: 'A data privacy audit of the CRM and HR systems identified 9,400 customer records and 640 former-employee records that have been retained beyond the applicable UAE PDPL retention limits (5 years for customer data, 2 years post-employment for HR data). No automated data-purge schedule exists. The absence of a retention and disposal procedure creates exposure to regulatory penalties under the UAE Federal Decree-Law No. 45 of 2021 and potential reputational risk from a data breach involving outdated personal information.',
    riskRating: 'medium',
    scope: 'Related Party Transactions Review',
    subscope: '',
    taskId: 'TSK-003', findingTitle: 'Data retention policy non-compliance',
    evidenceIds: ['EV-003', 'EV-007'],
    status: 'reviewed', auditor: 'Priya Nair',
    createdDate: new Date('2025-04-12'),
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio', subDivision: 'E-Commerce',
    isActive: true,
  },
  {
    id: 'OBS-008',
    title: 'Transfer pricing documentation incomplete for intercompany transactions',
    description: 'A review of the tax audit file revealed that intercompany transfer pricing documentation does not comply with OECD guidelines for 8 out of 15 transactions tested. Local file documentation is missing functional analyses and benchmarking studies for management fees charged by the parent entity. The aggregate value of undocumented intercompany transactions in FY2024 is USD 12.4 million. Non-compliance with the UAE Corporate Tax Law transfer-pricing rules could result in adjustments and penalties during a tax authority examination.',
    riskRating: 'high',
    scope: 'Financial Statement Audit',
    subscope: 'Cash & Bank Testing',
    taskId: 'TSK-001', findingTitle: 'Transfer pricing documentation gaps',
    evidenceIds: ['EV-001', 'EV-008', 'EV-011'],
    status: 'submitted', auditor: 'Ravi Shankar',
    createdDate: new Date('2025-04-20'),
    company: 'Zumurrud Diamonds LLC', division: 'Dubai Design District Studio', subDivision: 'Finance & Accounting',
    isActive: true,
  },
  {
    id: 'OBS-009',
    title: 'Operational KPIs not monitored or reported at department level',
    description: 'An operational review of three business units (Procurement, Logistics, and Customer Service) found that department-level KPIs defined in the annual operating plan are not being tracked or reported. No dashboards, balanced scorecards, or exception reports exist below the executive level. As a result, performance deviations are identified only at the end of each quarter during management review, significantly reducing the ability to take corrective action in time. A management information framework should be established within 90 days.',
    riskRating: 'low',
    scope: 'Procurement Audit',
    subscope: '',
    taskId: 'TSK-003', findingTitle: 'Missing departmental performance monitoring',
    evidenceIds: ['EV-003'],
    status: 'draft', auditor: 'Meenu AM',
    createdDate: new Date('2025-05-02'),
    company: 'Desert Rose Retail Group', division: 'Dubai Mall Flagship', subDivision: 'Sales & Marketing',
    isActive: false,
  },
  {
    id: 'OBS-010',
    title: 'Credit concentration risk exceeds board-approved limits',
    description: 'An analysis of the loan book as at 31 March 2025 reveals that 38% of the total credit portfolio is exposed to a single industry sector (real estate), against a board-approved maximum concentration limit of 25%. Additionally, the top 5 borrowers account for 52% of total credit exposure, exceeding the individual-borrower limit of 10% of capital base for two counterparties. Breaching concentration limits without board waiver violates the credit risk policy and CBUAE prudential norms and must be escalated to the ALCO immediately.',
    riskRating: 'critical',
    scope: 'Internal Controls Review',
    subscope: '',
    taskId: 'TSK-002', findingTitle: 'Credit concentration limit breach',
    evidenceIds: ['EV-002', 'EV-006', 'EV-010', 'EV-012'],
    status: 'reviewed', auditor: 'Omar Al Farsi',
    createdDate: new Date('2025-04-28'),
    company: 'Kanz Al Emarat Jewellery', division: 'Ras Al Khaimah Showroom', subDivision: 'Finance & Accounting',
    isActive: true,
  },
  {
    id: 'OBS-011',
    title: 'Health and safety incident reporting process not consistently followed',
    description: 'A review of health and safety records across three operational sites found that only 34% of workplace incidents were formally reported within the required 24-hour window. Interviews with site supervisors revealed limited awareness of the mandatory reporting procedure introduced in the Q3 2024 policy update. Seven near-miss events in the past 6 months were not logged in the incident management system. Failure to report incidents may violate UAE Ministerial Resolution No. 32 of 1982 and exposes the firm to regulatory inspection findings and insurance invalidation.',
    riskRating: 'medium',
    scope: 'Payroll Audit',
    subscope: 'Sampling & Substantive Testing',
    taskId: 'TSK-003', findingTitle: 'HSE incident under-reporting',
    evidenceIds: ['EV-003', 'EV-009'],
    status: 'submitted', auditor: 'Layla Hassan',
    createdDate: new Date('2025-05-08'),
    company: 'Falcon Gulf Jewellery Trading', division: 'Al Ain Branch', subDivision: 'Retail Operations',
    isActive: true,
  },
  {
    id: 'OBS-012',
    title: 'IT disaster recovery runbooks outdated and untested since 2022',
    description: 'The IT disaster recovery (DR) runbooks for 11 critical business applications have not been updated since December 2022 and have not been subject to a full failover test since Q4 2022. Infrastructure changes in 2023–2024 (cloud migration, new firewall architecture, updated VLAN topology) are not reflected in the current documentation. During a tabletop exercise conducted as part of this audit, the DR team was unable to complete the recovery sequence for the core banking platform within the RTO of 4 hours. Runbooks must be updated and a live failover test scheduled within Q3 2025.',
    riskRating: 'low',
    scope: 'Financial Statement Audit',
    subscope: 'Cash & Bank Testing',
    taskId: 'TSK-005', findingTitle: 'DR runbooks stale and untested',
    evidenceIds: ['EV-005', 'EV-011'],
    status: 'approved', auditor: 'Ivan Magalhaes',
    createdDate: new Date('2025-05-14'),
    company: 'Gulf Horizon Logistics', division: 'Jebel Ali Free Zone HQ', subDivision: 'Information Technology',
    isActive: true,
  },
  {
    id: 'OBS-013',
    title: 'Purchase order approvals exceed delegated authority',
    description: 'Testing of a sample of high-value purchase orders found 3 instances where approval was granted above the delegated authority limit for that approver level. The purchase order approval matrix has not been updated to reflect the current authorisation policy. Recommend re-issuing the matrix and requiring re-training of approvers.',
    riskRating: 'high',
    scope: 'Procurement',
    subscope: 'Purchase Order Controls',
    taskId: 'TSK-056', findingTitle: 'Purchase orders approved above authorisation limit',
    evidenceIds: ['EV-017'],
    status: 'draft', auditor: 'Bob Smith',
    createdDate: new Date('2026-06-30'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'Procurement',
    isActive: true,
  },
  {
    id: 'OBS-014',
    title: 'Orphaned privileged IT accounts identified',
    description: 'Sample testing of privileged account listings identified 3 accounts belonging to employees who left the organisation more than 60 days prior, still holding active elevated access. No automated deprovisioning trigger exists for privileged roles.',
    riskRating: 'critical',
    scope: 'IT Controls',
    subscope: 'IT General Controls',
    taskId: 'TSK-052', findingTitle: 'Orphaned accounts identified',
    evidenceIds: ['EV-014'],
    status: 'submitted', auditor: 'Bob Smith',
    createdDate: new Date('2026-06-12'),
    company: 'Crowe KSA', division: 'Riyadh', subDivision: 'IT',
    isActive: true,
  },
  {
    id: 'OBS-015',
    title: 'Fixed asset capitalisation policy applied inconsistently',
    description: 'Two of the fixed asset additions sampled were expensed rather than capitalised, inconsistent with the documented capitalisation threshold policy. Reviewed with the Finance team; a correcting journal has been proposed.',
    riskRating: 'medium',
    scope: 'Fixed Assets',
    subscope: 'Financial Controls',
    taskId: 'TSK-053', findingTitle: 'Capitalisation policy applied inconsistently',
    evidenceIds: ['EV-015'],
    status: 'reviewed', auditor: 'Bob Smith',
    createdDate: new Date('2026-06-16'),
    company: 'Crowe UAE', division: 'Dubai', subDivision: 'External Audit',
    isActive: true,
  },
  {
    id: 'OBS-016',
    title: 'Expense claim documentation gaps within tolerance',
    description: 'Of the 40 expense claims sampled, 2 had minor documentation gaps (missing itemised receipts under AED 200). Both fall within the policy\'s de-minimis tolerance and are not considered material. No further action required.',
    riskRating: 'low',
    scope: 'Expense Management',
    subscope: 'Operational Review',
    taskId: 'TSK-055', findingTitle: 'Minor policy deviations in travel claims',
    evidenceIds: ['EV-016'],
    status: 'approved', auditor: 'Bob Smith',
    createdDate: new Date('2026-06-26'),
    company: 'Crowe UAE', division: 'Abu Dhabi', subDivision: 'Finance',
    isActive: true,
  },
];

// MOCK with company/division/sub-division/scope/subscope overridden per
// internalAuditOrgFields() above — the single source every consumer below
// (the observations signal, and the auditor-execution tab's summary/table
// helpers) reads from, so they all reflect the same real org data.
const ORG_MOCK: Observation[] = MOCK.map((o, i) => ({ ...o, ...internalAuditOrgFields(i, o) }));

const EMPTY_DRAFT = (): FilterDraft => ({
  riskRating: '', status: '', scope: '', company: '', division: [], subDivision: [], auditor: '',
});

// NOTE: ObservationComponent's Company/Division/Sub-Division (and now
// Scope/Subscope) options are sourced from the shared company-org-data.ts
// file too (see observation.component.ts), using the same
// company/division/sub-division *names* as this list — so the old
// COMPANY_LABELS/DIVISION_LABELS/SUBDIVISION_LABELS code-translation lookup
// that used to live here (crowe_uae -> 'Crowe UAE', dubai -> 'Dubai', ...)
// is gone. openAdd()/openEdit() below now pass company/division/subDivision
// straight through instead of translating codes ↔ labels.

/** Display label for the auditor-execution tab's Observations summary cards/table, per real ObservationStatus. */
const OBSERVATION_STATUS_DISPLAY = AUDITOR_OBSERVATION_STATUS_LABELS;

function observationRiskLabel(risk: RiskRating): 'Critical' | 'High' | 'Medium' | 'Low' {
  return RISK_RATING_LABELS[risk];
}

/** True when the rating falls in the band ('High' folds critical + high; 'Medium' is exact). */
function inRiskBand(risk: RiskRating, band: ObservationRiskBand): boolean {
  return OBSERVATION_RISK_BAND_RATINGS[band].includes(risk);
}

/** Count of observations raised by the given auditor, matching an exact display status (null = total). */
export function countObservationsForAuditorByDisplayStatus(auditorName: string, displayStatus: string | null): number {
  return ORG_MOCK.filter(o =>
    o.auditor === auditorName &&
    (displayStatus === null || OBSERVATION_STATUS_DISPLAY[o.status] === displayStatus),
  ).length;
}

/** Count of observations raised by the given auditor at/above ('High') or exactly at ('Medium') the given risk band. */
export function countObservationsForAuditorByRiskBand(auditorName: string, band: ObservationRiskBand): number {
  return ORG_MOCK.filter(o => o.auditor === auditorName && inRiskBand(o.riskRating, band)).length;
}

function formatObservationDate(d: Date): string {
  return new Date(d).toLocaleDateString(OBSERVATION_DATE_LOCALE, OBSERVATION_DATE_FORMAT_OPTIONS);
}

/**
 * Every observation raised by the given auditor, shaped for the
 * auditor-execution tab's "My Observations" table.
 */
export function getObservationsForAuditor(auditorName: string): {
  observation: string; audit: string; scope: string; riskRating: string; status: string; createdDate: string;
  detail: Observation;
}[] {
  return ORG_MOCK
    .filter(o => o.auditor === auditorName)
    .map(o => ({
      observation: o.title,
      audit: o.subDivision,
      scope: o.scope,
      riskRating: observationRiskLabel(o.riskRating),
      status: OBSERVATION_STATUS_DISPLAY[o.status],
      createdDate: formatObservationDate(o.createdDate),
      detail: o,
    }));
}

/* ── Component ──────────────────────────────────────────────────── */
@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule, DatePipe, FormsModule,
    ButtonModule, InputTextModule, MultiSelectModule,
    PaginatorModule, TooltipModule,
    ConfirmActionDialogComponent,DrawIconComponent
  ],
  templateUrl: './observation-list.component.html',
  styleUrl: './observation-list.component.scss',
})
export class ObservationListComponent implements OnInit {
  private readonly drawer = inject(RightDrawerService);
  private readonly route  = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly location = inject(Location);

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /** Scope to a specific auditor (from the auditor-execution "My Observations" cards) — matches `auditor` exactly. */
  readonly auditorIdFilter = signal<string | null>(null);
  /** Scope to a specific display status ('Open'/'Under Review'/'Resolved') — folds draft+submitted into 'Open'. */
  readonly displayStatusFilter = signal<string | null>(null);
  /** Scope to a risk band ('High' folds critical+high; 'Medium' is exact) — from the "High/Medium Risk" cards. */
  readonly riskBandFilter = signal<ObservationRiskBand | null>(null);

  readonly observations = signal<Observation[]>(ORG_MOCK);
  readonly viewMode     = signal<ObservationViewMode>(ObservationViewModes.Grid);

  /* ── Template constants ────────────────────────────────────────── */
  readonly ObservationViewModes    = ObservationViewModes;
  readonly ObservationSortColumns  = ObservationSortColumns;
  readonly RiskRatings             = RiskRatings;
  readonly activeLabels            = OBSERVATION_ACTIVE_LABELS;
  readonly activeIcons             = OBSERVATION_ACTIVE_ICONS;
  readonly subDivisionPlaceholders = OBSERVATION_SUB_DIVISION_FILTER_PLACEHOLDERS;
  readonly showFilter   = signal(false);

  readonly searchQuery   = signal('');
  readonly activeFilters = signal<FilterDraft>(EMPTY_DRAFT());

  // A signal (rather than a plain mutated object) so divisionOptions/
  // subDivisionOptions below can react live as the user picks a
  // Company/Division in the still-open filter panel, same cascading
  // behaviour as the Company/Division/Sub-Division filters on the other
  // list pages.
  readonly draft = signal<FilterDraft>(EMPTY_DRAFT());

  readonly sortColumn    = signal<SortColumn | null>(ObservationSortColumns.CreatedDate);
  readonly sortDirection = signal<SortDir>(ObservationSortDirections.Desc);
  readonly pageSize      = OBSERVATION_LIST_PAGE_SIZE;
  readonly currentPage   = signal(1);

  /* ── Confirm dialog ────────────────────────────────────────────── */
  readonly displayConfirmation  = signal(false);
  readonly confirmationAction   = signal<ObservationBlockAction>(ObservationBlockActions.Deactivate);
  readonly confirmationTarget   = signal<Observation | null>(null);

  readonly allSubDivisionsLabel = $localize`:@@audit.observations.allSubDivisions:All sub-divisions`;
  readonly noSubDivisionsLabel = $localize`:@@audit.observations.noSubDivisionsForDivision:No sub-divisions for this division`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly activateObservationLabel = $localize`:@@audit.observations.activateObservation:Activate observation`;
  readonly deactivateObservationLabel = $localize`:@@audit.observations.deactivateObservation:Deactivate observation`;

  readonly ratingOptions = [
    { label: $localize`:@@common.critical:Critical`, value: 'critical' },
    { label: $localize`:@@common.high:High`, value: 'high' },
    { label: $localize`:@@common.medium:Medium`, value: 'medium' },
    { label: $localize`:@@common.low:Low`, value: 'low' },
  ];

  readonly statusOptions = [
    { label: $localize`:@@audit.observations.statusDraft:Draft`, value: 'draft' },
    { label: $localize`:@@audit.observations.statusSubmitted:Submitted`, value: 'submitted' },
    { label: $localize`:@@audit.observations.statusReviewed:Reviewed`, value: 'reviewed' },
    { label: $localize`:@@audit.observations.statusApproved:Approved`, value: 'approved' },
  ];

  readonly scopeOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      return INTERNAL_AUDIT_SCOPE_NAMES.map(s => ({ label: s, value: s }));
    }
    const set = new Set(this.observations().map(o => o.scope));
    return Array.from(set).sort().map(s => ({ label: s, value: s }));
  });

  // Company/Division/Sub-Division options come from the shared company-org-data.ts
  // file (see comment near the import above) rather than being scraped off
  // this.observations() — so the filter always offers the full canonical list,
  // not just whatever happens to appear in the current seed data. Division and
  // Sub-Division cascade off whatever is currently picked in the (still-open)
  // filter panel's draft signal, same as the other list pages.
  readonly companyOptions = computed(() =>
    CLIENT_MODE_VALUE === 'internal-audit'
      ? [{ label: INTERNAL_AUDIT_COMPANY_NAME, value: INTERNAL_AUDIT_COMPANY_NAME }]
      : ORG_STATIC_DATA
          .map(c => ({ label: c.companyName, value: c.companyName }))
          .sort((a, b) => a.label.localeCompare(b.label)),
  );

  readonly divisionOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      // Internal-audit mode: divisions come straight from the DAR Exchange
      // division catalog (division-static-indi-org.data.ts), not from
      // whatever happens to appear on the seeded observations — so the
      // filter always offers the full canonical division list.
      const names = new Set<string>();
      DIVISION_INDI_ORG_COMPANIES.forEach(c => c.divisions.forEach(d => names.add(d.divisionName)));
      return Array.from(names).filter(Boolean).sort((a, b) => a.localeCompare(b)).map(n => ({ label: n, value: n }));
    }

    const companyName = this.draft().company;
    const companies = companyName
      ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
      : ORG_STATIC_DATA;
    const names = new Set<string>();
    companies.forEach(c => c.divisions.forEach(dv => names.add(dv.divisionName)));
    return Array.from(names).sort((a, b) => a.localeCompare(b)).map(n => ({ label: n, value: n }));
  });

  readonly subDivisionOptions = computed(() => {
    if (CLIENT_MODE_VALUE === 'internal-audit') {
      const divisionNames = this.draft().division;
      const names = divisionNames.length
        ? divisionNames.flatMap(name => INTERNAL_AUDIT_SUB_DIVISIONS_BY_DIVISION.get(name) ?? [])
        : INTERNAL_AUDIT_SUB_DIVISION_NAMES;
      return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b)).map(n => ({ label: n, value: n }));
    }

    const companyName   = this.draft().company;
    const divisionNames = this.draft().division;
    const companies = companyName
      ? ORG_STATIC_DATA.filter(c => c.companyName === companyName)
      : ORG_STATIC_DATA;
    const names = new Set<string>();
    companies.forEach(c =>
      c.divisions
        // Divisions flagged `hasSubDivision: false` contribute no sub-divisions.
        .filter(dv => dv.hasSubDivision !== false)
        .filter(dv => !divisionNames.length || divisionNames.includes(dv.divisionName))
        .forEach(dv => dv.subDivisions.forEach(sd => names.add(sd.subDivisionName))),
    );
    return Array.from(names).sort((a, b) => a.localeCompare(b)).map(n => ({ label: n, value: n }));
  });

  /** Disabled when every selected division in the draft is flagged `hasSubDivision: false`. */
  readonly subDivisionFilterVisible = computed(() =>
    divisionSelectionHasSubDivisions(this.draft().company, this.draft().division),
  );
  readonly auditorOptions = computed(() =>
    [...new Set(this.observations().map(o => o.auditor))].sort().map(v => ({ label: v, value: v })),
  );

  readonly filtered = computed(() => {
    let list = this.observations();
    const q  = this.searchQuery().trim().toLowerCase();
    const af = this.activeFilters();

    if (q) list = list.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      o.taskId.toLowerCase().includes(q),
    );
    if (af.riskRating)  list = list.filter(o => o.riskRating  === af.riskRating);
    if (af.status)      list = list.filter(o => o.status      === af.status);
    if (af.scope)       list = list.filter(o => o.scope       === af.scope);
    if (af.company)      list = list.filter(o => o.company     === af.company);
    if (af.division.length) list = list.filter(o => af.division.includes(o.division));
    // Ignored when the applied divisions have no sub-divisions so a stale selection can't apply.
    if (af.subDivision.length && divisionSelectionHasSubDivisions(af.company, af.division))
      list = list.filter(o => af.subDivision.includes(o.subDivision));
    if (af.auditor)      list = list.filter(o => o.auditor     === af.auditor);

    const auditorId = this.auditorIdFilter();
    if (auditorId) list = list.filter(o => o.auditor === auditorId);

    const displayStatus = this.displayStatusFilter();
    if (displayStatus) list = list.filter(o => OBSERVATION_STATUS_DISPLAY[o.status] === displayStatus);

    const riskBand = this.riskBandFilter();
    if (riskBand) list = list.filter(o => inRiskBand(o.riskRating, riskBand));

    const col = this.sortColumn();
    if (col) {
      const dir = this.sortDirection() === ObservationSortDirections.Asc ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = this.sortVal(a, col), bv = this.sortVal(b, col);
        return av < bv ? -dir : av > bv ? dir : 0;
      });
    }
    return list;
  });

  readonly paginated = computed(() => {
    const all = this.filtered();
    const max = Math.max(1, Math.ceil(all.length / this.pageSize));
    const p   = Math.min(this.currentPage(), max);
    return all.slice((p - 1) * this.pageSize, p * this.pageSize);
  });

  readonly pageLabel = computed(() => {
    const total = this.filtered().length;
    if (!total) { return $localize`:@@common.noResults:No results`; }
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return $localize`:@@audit.observations.paginationLabel:Showing ${start}:start:–${end}:end: of ${total}:total:`;
  });

  readonly hasFilters = computed(() => {
    const af = this.activeFilters();
    return !!this.searchQuery().trim() ||
      !!af.riskRating || !!af.status || !!af.scope ||
      !!af.company || !!af.division.length || !!af.subDivision.length || !!af.auditor;
  });

  /**
   * Pre-applies filters when navigated from a dashboard card, e.g.
   * /observationlist?status=Under%20Review&auditorId=Bob%20Smith
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const auditorId = params.get(OBSERVATION_QUERY_PARAMS.AuditorId);
      const status = params.get(OBSERVATION_QUERY_PARAMS.Status);
      const riskBand = params.get(OBSERVATION_QUERY_PARAMS.RiskBand);
      this.auditorIdFilter.set(auditorId);
      this.displayStatusFilter.set(status);
      this.riskBandFilter.set(
        (Object.values(ObservationRiskBands) as string[]).includes(riskBand ?? '') ? riskBand as ObservationRiskBand : null,
      );
      if (auditorId || status || riskBand) this.currentPage.set(1);
    });
  }

  /* ── Filter panel ─────────────────────────────────────────────── */
  toggleFilter(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.showFilter()) this.draft.set({ ...this.activeFilters() });
    this.showFilter.update(v => !v);
  }

  onFilterPanelClick(e: MouseEvent): void { e.stopPropagation(); }

  // Generic draft field setter for the filter panel's plain fields
  // (riskRating, status, scope, auditor) that don't have downstream
  // cascading dependents.
  setDraft<K extends keyof FilterDraft>(key: K, value: FilterDraft[K]): void {
    this.draft.update(d => ({ ...d, [key]: value }));
  }

  // Company/Division have cascading dependents (Division depends on Company;
  // Sub-Division depends on both), so changing either clears whatever
  // downstream selection is no longer valid — same cascading behaviour as
  // the Company/Division/Sub-Division dropdowns on the other list pages.
  onDraftCompanyChange(value: string): void {
    this.draft.update(d => ({ ...d, company: value, division: [], subDivision: [] }));
  }

  onDraftDivisionChange(value: string[]): void {
    this.draft.update(d => ({ ...d, division: value ?? [], subDivision: [] }));
  }

  applyFilters(): void {
    const d = this.draft();
    // Drop sub-divisions left over from before the Sub-Division filter was disabled.
    this.activeFilters.set(this.subDivisionFilterVisible() ? { ...d } : { ...d, subDivision: [] });
    this.currentPage.set(1);
    this.showFilter.set(false);
  }

  resetFilters(): void {
    this.draft.set(EMPTY_DRAFT());
    this.activeFilters.set(EMPTY_DRAFT());
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.showFilter.set(false);
  }

  clearAll(): void { this.resetFilters(); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    // The Division/Sub-Division multiselect overlays are appended to <body>,
    // so clicks inside them (or on options they re-render away) must not
    // close the filter panel.
    const target = e.target as HTMLElement | null;
    if (target && (!target.isConnected || target.closest('.p-multiselect-overlay, .p-overlay'))) return;
    this.showFilter.set(false);
  }

  /* ── Search / sort / page ─────────────────────────────────────── */
  onSearch(q: string): void { this.searchQuery.set(q); this.currentPage.set(1); }

  onSort(col: SortColumn): void {
    this.sortColumn() === col
      ? this.sortDirection.update(d =>
          d === ObservationSortDirections.Asc ? ObservationSortDirections.Desc : ObservationSortDirections.Asc)
      : (this.sortColumn.set(col), this.sortDirection.set(ObservationSortDirections.Asc));
  }
  sortIcon(col: SortColumn): string {
    return this.sortColumn() !== col ? OBSERVATION_SORT_ICONS.Unsorted : OBSERVATION_SORT_ICONS[this.sortDirection()];
  }
  private sortVal(o: Observation, col: SortColumn): string | number {
    switch (col) {
      case ObservationSortColumns.Id:          return parseInt(o.id.replace(/\D/g, ''), 10) || 0;
      case ObservationSortColumns.Title:       return o.title.toLowerCase();
      case ObservationSortColumns.RiskRating:  return RISK_RATING_RANK[o.riskRating];
      case ObservationSortColumns.Scope:       return o.scope.toLowerCase();
      case ObservationSortColumns.Status:      return o.status;
      case ObservationSortColumns.CreatedDate: return o.createdDate.getTime();
    }
  }

  onPageChange(ev: PaginatorState): void {
    if (ev.page !== undefined) this.currentPage.set(ev.page + 1);
  }
  setView(m: ObservationViewMode): void { this.viewMode.set(m); }

  /* ── Drawer actions ───────────────────────────────────────────── */

  /** Next sequential OBS-### id based on the highest one currently in the list. */
  private nextObservationId(): string {
    const max = this.observations().reduce((m, o) => {
      const n = parseInt(o.id.replace(/\D/g, ''), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    return `${OBSERVATION_ID_PREFIX}${(max + 1).toString().padStart(OBSERVATION_ID_PAD_LENGTH, '0')}`;
  }

  async openAdd(): Promise<void> {
    const ref = this.drawer.open<AddObservationResult, AddObservationDrawerData>(
      ObservationComponent, { width: OBSERVATION_DRAWER_WIDTH, data: { mode: ObservationDrawerModes.Create } },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const f = result.form;
    const newObservation: Observation = {
      id: this.nextObservationId(),
      title: f.title,
      description: f.description,
      riskRating: f.riskRating,
      scope: f.scope,
      subscope: f.subscope,
      taskId: f.taskId,
      findingTitle: '',
      evidenceIds: f.evidenceIds ?? [],
      status: f.status ?? OBSERVATION_DEFAULT_STATUS,
      auditor: OBSERVATION_CURRENT_USER_NAME,
      createdDate: new Date(),
      company: observationCompanyName(f.company ?? ''),
      division: f.division ?? '',
      subDivision: f.subDivision ?? '',
      isActive: true,
    };

    // New entries appear first so they're immediately visible.
    this.observations.update(list => [newObservation, ...list]);
    this.currentPage.set(1);

    // Temporary bridge: also surface this freshly submitted observation in
    // the Pending Approvals queue, awaiting review — the two lists are
    // still separate mock stores, so this just mirrors the essentials
    // across. Unlike Evidence, Observation already collects a real risk
    // rating, so it carries straight through instead of defaulting.
    const pendingItem: PendingItem = {
      id: newObservation.id,
      type: OBSERVATION_PENDING_ITEM_DEFAULTS.Type,
      status: OBSERVATION_PENDING_ITEM_DEFAULTS.Status,
      riskRating: newObservation.riskRating,
      title: newObservation.title,
      description: newObservation.description ?? '',
      submittedBy: newObservation.auditor,
      submittedDate: newObservation.createdDate,
      company: newObservation.company ?? '',
      division: newObservation.division ?? '',
      subDivision: newObservation.subDivision ?? '',
    };
    addPendingItem(pendingItem);
  }

  async openEdit(o: Observation): Promise<void> {
    const ref = this.drawer.open<AddObservationResult, AddObservationDrawerData>(
      ObservationComponent, {
        width: OBSERVATION_DRAWER_WIDTH,
        data: {
          mode: ObservationDrawerModes.Edit,
          // company/division/subDivision are listed before scope/
          // subscope/taskId here on purpose: ObservationComponent's
          // FormGroup.patchValue() applies each key of this object in the
          // object's own property order, and its cascade-reset
          // subscriptions (company change clears division/subDivision/
          // scope/subscope, subDivision change clears scope/subscope, etc.)
          // fire as each key is patched. Listing a dependency after its
          // dependent field would let the reset fire *after* the real
          // value was set, silently blanking it — same bug already fixed
          // once for evidence-list.component.ts's openEdit().
          existing: {
            id: o.id,
            company: o.company,
            division: o.division,
            subDivision: o.subDivision,
            scope: o.scope,
            subscope: o.subscope,
            taskId: o.taskId,
            title: o.title, description: o.description,
            riskRating: o.riskRating, evidenceIds: o.evidenceIds, status: o.status,
          },
        },
      },
    );
    const result = await ref.afterClosed;
    if (!result) return;

    const f = result.form;
    this.observations.update(list =>
      list.map(item => item.id !== o.id ? item : {
        ...item,
        title: f.title,
        description: f.description,
        riskRating: f.riskRating,
        scope: f.scope,
        subscope: f.subscope,
        taskId: f.taskId,
        evidenceIds: f.evidenceIds ?? item.evidenceIds,
        status: f.status ?? item.status,
        company: observationCompanyName(f.company ?? item.company),
        division: f.division ?? item.division,
        subDivision: f.subDivision === null ? '' : (f.subDivision ?? item.subDivision),
      }),
    );
  }

  openView(o: Observation): void {
    this.drawer.open<ObservationProfileComponent, ObservationDetailDrawerData>(
      ObservationProfileComponent, { width: OBSERVATION_DRAWER_WIDTH, data: { observation: o } },
    );
  }

  /* ── Confirm dialog ───────────────────────────────────────────── */
  openConfirmation(o: Observation): void {
    this.confirmationAction.set(o.isActive !== false ? ObservationBlockActions.Deactivate : ObservationBlockActions.Activate);
    this.confirmationTarget.set(o);
    this.displayConfirmation.set(true);
  }

  confirmToggleBlocked(): void {
    const target = this.confirmationTarget();
    if (!target) return;
    this.observations.update(list =>
      list.map(o => o.id === target.id ? { ...o, isActive: !o.isActive } : o),
    );
    this.closeConfirmation();
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.confirmationTarget.set(null);
  }

  /* ── Labels ───────────────────────────────────────────────────── */
  riskLabel(r: RiskRating): string {
    const labels: Record<RiskRating, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };

    return labels[r];
  }
  statusLabel(s: ObservationStatus): string {
    const labels: Record<ObservationStatus, string> = {
      draft: $localize`:@@audit.observations.statusDraft:Draft`,
      submitted: $localize`:@@audit.observations.statusSubmitted:Submitted`,
      reviewed: $localize`:@@audit.observations.statusReviewed:Reviewed`,
      approved: $localize`:@@audit.observations.statusApproved:Approved`,
    };

    return labels[s];
  }

  trackById = (_: number, o: Observation) => o.id;
}