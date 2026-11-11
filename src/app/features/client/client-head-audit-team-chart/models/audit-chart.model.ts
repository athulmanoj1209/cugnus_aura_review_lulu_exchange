import { TreeNode } from 'primeng/api';

// NOTE: same placeholder import paths as the CFO / Sub-Division Head chart
// components — adjust to wherever these actually live in your project.
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';

/* ============================================================
 *  Role & tier types
 * ============================================================ */

export type AuditRole =
'CAE'
  | 'CFO'
  | 'SubDivisionHead'
  | 'AuditManager'
  | 'SeniorAuditor'
  | 'StaffAuditor';

export type RiskTier = 'critical' | 'high' | 'medium' | 'low';

/* ============================================================
 *  Core member interface
 * ============================================================ */

export interface AuditMember {
  id: string;
  name: string;
  title: string;
  role: AuditRole;
  /** null on root nodes that span all divisions (e.g. CFO). */
  division: string | null;
  /** null on root nodes. */
  subDivision: string | null;
  /** null on nodes that don't belong to a single scope. */
  scope: string | null;
  experience: number;
  expertise: string[];
  workloadPct: number;
  avatarUrl?: string;
  badge?: { label: string; tier: RiskTier };
  /** True on synthetic placeholder nodes (e.g. the DeptHead view root banner). */
  isVirtual?: boolean;
}

export type AuditTreeNode = TreeNode<AuditMember>;

export interface SelectOption<T = string | null> {
  label: string;
  value: T;
}

/* ============================================================
 *  Pure tree helpers
 * ============================================================ */

export function cloneTree(tree: AuditTreeNode[]): AuditTreeNode[] {
  const cloneNode = (n: AuditTreeNode): AuditTreeNode => ({
    ...n,
    data: n.data ? { ...n.data } : undefined,
    children: (n.children ?? []).map(cloneNode),
  });
  return tree.map(cloneNode);
}

export function findNode(tree: AuditTreeNode[], id: string): AuditTreeNode | null {
  for (const n of tree) {
    if (n.data?.id === id) return n;
    const found = findNode(n.children ?? [], id);
    if (found) return found;
  }
  return null;
}

export function findParent(
  tree: AuditTreeNode[],
  id: string,
  parent: AuditTreeNode | null = null,
): AuditTreeNode | null {
  for (const n of tree) {
    if (n.data?.id === id) return parent;
    const found = findParent(n.children ?? [], id, n);
    if (found) return found;
  }
  return null;
}

/* ============================================================
 *  Internal-audit (DAR Exchange) static-data wiring
 *
 *  When CLIENT_MODE_VALUE is 'internal-audit', the mock tree below is
 *  built from the DAR Exchange division/subDivision/scope static seed data
 *  instead of the hardcoded audit-firm tree, so that the division/
 *  subDivision/scope filters in CfoAuditTeamChartComponent and
 *  DeptHeadAuditTeamChartComponent (which already source their dropdown
 *  option lists from those same seed files) actually find matching
 *  members instead of an empty result.
 * ============================================================ */

export const IS_INTERNAL_AUDIT = CLIENT_MODE_VALUE === 'internal-audit';

interface IndiOrgCombo {
  divisionCode: string;
  subDivisionName: string;
  scopeName: string;
  riskRating: 'low' | 'medium' | 'high';
}

/** Some seed-file scopes carry a nullable/wider risk-rating type — collapse
 *  that down to the 3 tiers this mock tree actually branches on, defaulting
 *  to 'medium' when a scope doesn't specify one. */
function normalizeRisk(risk: unknown): 'low' | 'medium' | 'high' {
  return risk === 'low' || risk === 'medium' || risk === 'high' ? risk : 'medium';
}

/** One entry per (division, subDivision, top-level scope) — the same set of
 *  combinations CfoAuditTeamChartComponent's scope dropdown offers. Sub-scopes
 *  (parentScopeId set, e.g. the 3 AML/CFT sub-scopes under SC-5000) are
 *  grouping-only and excluded, matching that dropdown's filtering. */
const INDI_ORG_COMBOS: IndiOrgCombo[] = SCOPE_INDI_ORG_COMPANIES.flatMap(company =>
  company.divisions.flatMap(division =>
    division.subDivisions.flatMap(sub =>
      sub.scopes
        .filter(scope => !scope.parentScopeId)
        .map(scope => ({
          divisionCode: division.divisionCode,
          subDivisionName: sub.subDivisionName,
          scopeName: scope.scopeName,
          riskRating: normalizeRisk(scope.riskRating),
        })),
    ),
  ),
);

/** "Human Resources / Emiratization" → ['Human Resources', 'Emiratization']. */
function scopeExpertise(scopeName: string): string[] {
  return scopeName.split('/').map(part => part.trim()).filter(Boolean);
}

function riskWorkload(risk: 'low' | 'medium' | 'high', offset: number): number {
  const base = risk === 'high' ? 82 : risk === 'medium' ? 62 : 42;
  return Math.min(98, base + (offset % 4) * 3);
}

const INDI_ORG_MANAGER_NAMES = [
  'Rajeev Nanda', 'Fatima Al Zaabi', 'Arjun Menon', 'Layla Hassan',
  'Priya Sebastian', 'Mohammed Shafi', 'Jaison George', 'Bob Fernandes',
];
const INDI_ORG_SENIOR_NAMES = [
  'Emma Whitfield', 'Karim Nasser', 'Sara Devi', 'Noah Abed',
  'Meera Krishnan', 'Yusuf Ali', 'Hana Osei', 'Ravi Menon',
  'Zainab Qureshi', 'Daniel Wu', 'Aiza Farooq', 'Tariq Suleiman',
];
const INDI_ORG_STAFF_NAMES = [
  'Frank Chen', 'Aliyah Rahman', 'Chen Wei', 'Nadia Farouk',
  'Oliver Grant', 'Salma Idris', 'Vikram Rao', 'Grace Odom',
  'Ismail Haroun', 'Priyanka Nair', 'Ahmed Fathy', 'Lin Mei',
];

/** DAR Exchange mock tree — CAE root, one Audit Manager per division/subDivision/
 *  top-level-scope combination (mirrors the audit-firm tree's manager-per-scope
 *  shape), each with one Senior Auditor and one Staff Auditor beneath. */
function buildInternalAuditMockTree(): AuditTreeNode {
  const node = (
    data: AuditMember,
    children: AuditTreeNode[] = [],
  ): AuditTreeNode => ({ data, expanded: true, children });

  const managers = INDI_ORG_COMBOS.map((combo, i) => {
    const expertise = scopeExpertise(combo.scopeName);
    const tier: RiskTier = combo.riskRating;

    return node(
      {
        id: `mgr-indi-${i}`,
        name: INDI_ORG_MANAGER_NAMES[i % INDI_ORG_MANAGER_NAMES.length],
        title: 'Audit Manager',
        role: 'AuditManager',
        division: combo.divisionCode,
        subDivision: combo.subDivisionName,
        scope: combo.scopeName,
        experience: 9 + (i % 6),
        expertise: expertise.length ? expertise : [combo.subDivisionName],
        workloadPct: riskWorkload(combo.riskRating, i),
        avatarUrl: 'images/avatars/default-avatar.jpg',
        badge: { label: tier === 'high' ? 'H' : tier === 'medium' ? 'M' : 'L', tier },
      },
      [
        node(
          {
            id: `sr-indi-${i}`,
            name: INDI_ORG_SENIOR_NAMES[i % INDI_ORG_SENIOR_NAMES.length],
            title: 'Senior Auditor',
            role: 'SeniorAuditor',
            division: combo.divisionCode,
            subDivision: combo.subDivisionName,
            scope: combo.scopeName,
            experience: 5 + (i % 5),
            expertise: expertise.length ? [expertise[0]] : [combo.subDivisionName],
            workloadPct: riskWorkload(combo.riskRating, i + 1),
            avatarUrl: 'images/avatars/default-avatar.jpg',
            badge: { label: 'S', tier: tier === 'high' ? 'medium' : 'low' },
          },
          [
            node({
              id: `st-indi-${i}`,
              name: INDI_ORG_STAFF_NAMES[i % INDI_ORG_STAFF_NAMES.length],
              title: 'Staff Auditor',
              role: 'StaffAuditor',
              division: combo.divisionCode,
              subDivision: combo.subDivisionName,
              scope: combo.scopeName,
              experience: 1 + (i % 4),
              expertise: [combo.subDivisionName],
              workloadPct: riskWorkload(combo.riskRating, i + 2),
              avatarUrl: 'images/avatars/default-avatar.jpg',
              badge: { label: 'A', tier: 'low' },
            }),
          ],
        ),
      ],
    );
  });

  return node(
    {
      id: 'cae-1', name: 'Aisha Al Suwaidi', title: 'Chief Audit Executive',
      role: 'CAE', division: null, subDivision: null, scope: null,
      experience: 18, expertise: ['Governance', 'Risk', 'Compliance'],
      workloadPct: 65, avatarUrl: 'images/avatars/default-avatar.jpg',
      badge: { label: 'C', tier: 'critical' },
    },
    managers,
  );
}

/* ============================================================
 *  Shared mock tree
 *  Both components call this; in production replace with a
 *  service call that returns the same AuditTreeNode shape.
 * ============================================================ */

export function buildMockAuditTree(): AuditTreeNode {
  return IS_INTERNAL_AUDIT ? buildInternalAuditMockTree() : buildAuditFirmMockTree();
}

function buildAuditFirmMockTree(): AuditTreeNode {
  const node = (
    data: AuditMember,
    children: AuditTreeNode[] = [],
  ): AuditTreeNode => ({ data, expanded: true, children });

  return node(
    {
      id: 'cfo-1', name: 'Sarah Al-Rashidi', title: 'CAE',
      role: 'CAE', division: null, subDivision: null, scope: null,
      experience: 20, expertise: ['Finance', 'Strategy', 'Governance'],
      workloadPct: 70, avatarUrl: 'images/avatars/default-avatar.jpg',
      badge: { label: 'C', tier: 'critical' },
    },
    [
      // ── DXB · Finance · Annual Audit ────────────────────────────────
      node({
        id: 'mgr-dxb-fin-1', name: 'Michael Chen', title: 'Audit Manager',
        role: 'AuditManager', division: 'DXB', subDivision: 'Finance', scope: 'annual-audit',
        experience: 12, expertise: ['Finance', 'IFRS'], workloadPct: 80,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'M', tier: 'medium' },
      }, [
        node({
          id: 'sr-dxb-fin-1', name: 'Ioni Bowcher', title: 'Senior Auditor',
          role: 'SeniorAuditor', division: 'DXB', subDivision: 'Finance', scope: 'annual-audit',
          experience: 8, expertise: ['IFRS', 'Treasury'], workloadPct: 70,
          avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'low' },
        }, [
          node({ id: 'st-dxb-fin-1', name: 'Xu Xuefeng', title: 'Staff Auditor', role: 'StaffAuditor', division: 'DXB', subDivision: 'Finance', scope: 'annual-audit', experience: 3, expertise: ['Finance'], workloadPct: 45, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'A', tier: 'low' } }),
          node({ id: 'st-dxb-fin-2', name: 'Maya Hassan', title: 'Staff Auditor', role: 'StaffAuditor', division: 'DXB', subDivision: 'Finance', scope: 'annual-audit', experience: 2, expertise: ['Finance'], workloadPct: 50, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'A', tier: 'low' } }),
        ]),
      ]),

      // ── DXB · Finance · Quarterly Review ────────────────────────────
      node({
        id: 'mgr-dxb-fin-2', name: 'Priya Sharma', title: 'Audit Manager',
        role: 'AuditManager', division: 'DXB', subDivision: 'Finance', scope: 'quarterly-review',
        experience: 10, expertise: ['Finance', 'Tax'], workloadPct: 75,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'M', tier: 'medium' },
      }, [
        node({ id: 'sr-dxb-fin-2', name: 'Omar Khalid', title: 'Senior Auditor', role: 'SeniorAuditor', division: 'DXB', subDivision: 'Finance', scope: 'quarterly-review', experience: 6, expertise: ['Tax', 'Zakat'], workloadPct: 60, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'low' } }),
      ]),

      // ── DXB · Operations · Process Audit ────────────────────────────
      node({
        id: 'mgr-dxb-ops-1', name: 'Anna Fali', title: 'Audit Manager',
        role: 'AuditManager', division: 'DXB', subDivision: 'Operations', scope: 'process-audit',
        experience: 11, expertise: ['Operations', 'Supply Chain'], workloadPct: 95,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'M', tier: 'medium' },
      }, [
        node({ id: 'sr-dxb-ops-1', name: 'Bernardo Dominic', title: 'Senior Auditor', role: 'SeniorAuditor', division: 'DXB', subDivision: 'Operations', scope: 'process-audit', experience: 7, expertise: ['IT', 'Operations'], workloadPct: 60, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'low' } }),
      ]),

      // ── AUH · Finance · Quarterly Review ────────────────────────────
      node({
        id: 'mgr-auh-fin-1', name: 'Stephen Shaw', title: 'Audit Manager',
        role: 'AuditManager', division: 'AUH', subDivision: 'Finance', scope: 'quarterly-review',
        experience: 13, expertise: ['Finance', 'Derivatives'], workloadPct: 65,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'M', tier: 'medium' },
      }, [
        node({ id: 'sr-auh-fin-1', name: 'Asiya Javayant', title: 'Senior Auditor', role: 'SeniorAuditor', division: 'AUH', subDivision: 'Finance', scope: 'quarterly-review', experience: 7, expertise: ['Finance'], workloadPct: 55, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'low' } }),
      ]),

      // ── AUH · Compliance · AML Audit ────────────────────────────────
      node({
        id: 'mgr-auh-cmp-1', name: 'Layla Al-Nasser', title: 'Audit Manager',
        role: 'AuditManager', division: 'AUH', subDivision: 'Compliance', scope: 'aml-audit',
        experience: 9, expertise: ['AML', 'Regulatory'], workloadPct: 85,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'H', tier: 'high' },
      }, [
        node({ id: 'sr-auh-cmp-1', name: 'David Kim', title: 'Senior Auditor', role: 'SeniorAuditor', division: 'AUH', subDivision: 'Compliance', scope: 'aml-audit', experience: 5, expertise: ['AML', 'KYC'], workloadPct: 75, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'medium' } }),
      ]),

      // ── RUH · Treasury · Annual Audit ───────────────────────────────
      node({
        id: 'mgr-ruh-trs-1', name: 'Rashid Al-Mansoori', title: 'Audit Manager',
        role: 'AuditManager', division: 'RUH', subDivision: 'Treasury', scope: 'annual-audit',
        experience: 10, expertise: ['Treasury', 'Cash Management'], workloadPct: 72,
        avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'M', tier: 'medium' },
      }, [
        node({ id: 'sr-ruh-trs-1', name: 'Fatima Al-Zahra', title: 'Senior Auditor', role: 'SeniorAuditor', division: 'RUH', subDivision: 'Treasury', scope: 'annual-audit', experience: 6, expertise: ['Treasury', 'FX'], workloadPct: 65, avatarUrl: 'images/avatars/default-avatar.jpg', badge: { label: 'S', tier: 'low' } }),
      ]),
    ],
  );
}