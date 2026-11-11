/**
 * Domain models for the audit description picker.
 *
 * Hierarchy: Scope -> Job -> DescriptionType -> DescriptionItem
 * Only the leaf DescriptionItem is truly selectable; parent tri-state
 * selection is derived automatically by PrimeNG's checkbox tree.
 */

import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { IND_ORG_MOCK_SCOPES } from './audit-description-ind-org.model';

/** The kind of description a user starts by choosing. */
export type DescriptionKind =
  | 'scopeRemarks'
  | 'completionNotes'
  | 'scopeJobCompletionNotes'
  | 'evidenceNotes'
  | 'findings'
  | 'observations'
  | 'recommendations'
  | 'workingPapers';

export interface DescriptionKindOption {
  value: DescriptionKind;
  label: string;
  icon?: string;
}

/** Node "level" used for template + styling decisions. */
export type NodeLevel = 'scope' | 'job' | 'type' | 'item';

/** A single description entry (leaf). */
export interface DescriptionItem {
  id: string;
  /** Short heading shown in bold. */
  title: string;
  /** Longer body text; collapsed with a "View more" toggle when lengthy. */
  description?: string;
  updatedAt?: string;
  author?: string;
}

/** A type category (Findings, Evidence notes, Recommendations, ...) under a job. */
export interface DescriptionTypeGroup {
  id: string;
  kind: DescriptionKind;
  label: string;
  items: DescriptionItem[];
}

/** A job under a scope. */
export interface AuditJob {
  id: string;
  name: string;
  types: DescriptionTypeGroup[];
}

/** A scope containing many jobs. */
export interface AuditScope {
  id: string;
  name: string;
  jobs: AuditJob[];
}

/** Extra data carried on every TreeNode so the template can style by level. */
export interface NodeData {
  level: NodeLevel;
  kind?: DescriptionKind;
  /** For item nodes: the raw description. */
  item?: DescriptionItem;
  /** Rollup count shown on badges (children count). */
  count?: number;
  /** Secondary line shown under the title (e.g. "3 types · 6 descriptions"). */
  subtitle?: string;
  /** Human label for the type/kind, used on item pills. */
  kindLabel?: string;
}

/** A single tinted summary tile shown at the top of the picker. */
export interface StatTile {
  label: string;
  value: number;
  tone: 'slate' | 'green' | 'amber' | 'indigo' | 'blue';
}

/** One flat selected row (scope/job/type context + the item). */
export interface SelectedDescription {
  scopeId: string;
  scopeName: string;
  jobId: string;
  jobName: string;
  typeId: string;
  kind: DescriptionKind;
  typeLabel: string;
  item: DescriptionItem;
}

/** Selected items grouped under their type. */
export interface SelectedTypeGroup {
  typeId: string;
  kind: DescriptionKind;
  typeLabel: string;
  items: DescriptionItem[];
}

/** Selected types grouped under their job. */
export interface SelectedJobGroup {
  jobId: string;
  jobName: string;
  types: SelectedTypeGroup[];
}

/** Selected jobs grouped under their scope. */
export interface SelectedScopeGroup {
  scopeId: string;
  scopeName: string;
  jobs: SelectedJobGroup[];
}

/** Full JSON payload emitted on confirm. */
export interface AuditDescriptionSelection {
  totalSelected: number;
  scopes: SelectedScopeGroup[];
  /** Flat list of every selected row, for convenience. */
  flat: SelectedDescription[];
}

/**
 * Mock data: multiple scopes, each with multiple jobs,
 * each job carrying several type categories with description items.
 * This is the audit-firm (multi-company) variant — used unless CLIENT_MODE_VALUE
 * is 'internal-audit', in which case `MOCK_SCOPES` below reads from
 * `audit-description-ind-org.ts` instead, mirroring the same switch
 * `AUDIT_SCOPE_STATIC_COMPANIES` does in audit-scope-static-data.ts.
 */
const AUDIT_FIRM_MOCK_SCOPES: AuditScope[] = [
  {
    id: 'sc-1',
    name: 'Revenue recognition',
    jobs: [
      {
        id: 'jb-1',
        name: 'Cut-off testing',
        types: [
          {
            id: 'n-1', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'sn-1', title: 'Testing performed remotely with client finance team', description: 'All cut-off procedures were carried out over a shared screen session with the client’s finance team due to the remote engagement setup for this period.', updatedAt: '2 days ago', author: 'A. Manoj' },
            ],
          },
          {
            id: 't-1', kind: 'findings', label: 'Findings',
            items: [
              {
                id: 'd-1', title: 'Cut-off error on 3 invoices near year-end',
                description: 'Three invoices totalling AED 182,400 were recorded in the current period although the related goods were dispatched after year-end. This overstates revenue and receivables for the period under audit and indicates the cut-off controls around dispatch documentation are not operating effectively during the year-end close window.',
                updatedAt: '2 days ago', author: 'A. Manoj',
              },
              {
                id: 'd-2', title: 'Revenue booked before delivery confirmed',
                description: 'Revenue recognition occurred at the point of invoice generation rather than on confirmation of delivery, contrary to the entity’s stated accounting policy.',
                updatedAt: '5 days ago', author: 'A. Manoj',
              },
            ],
          },
          {
            id: 't-2', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'd-3', title: 'Signed delivery notes reviewed for the period', description: 'Reviewed a sample of signed delivery notes and matched them to the sales invoices and dispatch log.', updatedAt: '3 days ago' },
              { id: 'd-4', title: 'Sales ledger reconciled to GL', updatedAt: '3 days ago' },
              { id: 'd-5', title: 'Sampled 25 invoices around period end', description: 'Selected 25 invoices spanning the two weeks either side of the period end to test cut-off.', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 't-3', kind: 'recommendations', label: 'Recommendations',
            items: [
              {
                id: 'd-6', title: 'Introduce a cut-off checklist for the last week of the period',
                description: 'Management should implement a formal cut-off checklist covering dispatch confirmation, delivery-note sign-off, and invoice dating for the final week of each reporting period, reviewed by the finance manager before close.',
                updatedAt: '1 day ago',
              },
            ],
          },
          {
            id: 't-wp-1', kind: 'workingPapers', label: 'Working paper notes',
            items: [
              {
                id: 'd-wp-1', title: 'WP-08 — Cut-off testing schedule',
                description: 'Cross-referenced the cut-off testing schedule (WP-08) to the sample selection and dispatch log; tick marks and review notes cleared by the senior on the current-year file.',
                updatedAt: '2 days ago', author: 'A. Manoj',
              },
              {
                id: 'd-wp-2', title: 'WP-08a — Prior-year points carried forward', description: 'Prior-year cut-off points reviewed and carried forward; two remain open pending client response.',
                updatedAt: '3 days ago',
              },
            ],
          },
        ],
      },
      {
        id: 'jb-2',
        name: 'Sample review',
        types: [
          {
            id: 'n-2', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'sn-2', title: 'Sample size agreed with engagement manager', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 't-4', kind: 'observations', label: 'Observations',
            items: [
              { id: 'd-7', title: 'No exceptions in sampled batch B', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 't-5', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'd-8', title: 'Sampling methodology documented in WP-12', updatedAt: '6 days ago' },
            ],
          },
          {
            id: 't-wp-2', kind: 'workingPapers', label: 'Working paper notes',
            items: [
              { id: 'd-wp-3', title: 'WP-12 — Sampling methodology working paper', description: 'Reviewed WP-12 setting out the sampling basis, population and confidence level; agreed the parameters to the audit plan.', updatedAt: '6 days ago' },
            ],
          },
        ],
      },
      {
        id: 'jb-3',
        name: 'Reconciliation',
        types: [
          {
            id: 'n-3', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'sn-3', title: 'Reconciliation schedule provided by client on request', updatedAt: '2 days ago' },
            ],
          },
          {
            id: 't-6', kind: 'findings', label: 'Findings',
            items: [
              { id: 'd-9', title: 'Unreconciled difference of AED 4,200 in deferred revenue', description: 'The deferred revenue schedule did not agree to the general ledger by AED 4,200; the difference was not investigated or cleared before close.', updatedAt: '2 days ago' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sc-2',
    name: 'Payroll controls',
    jobs: [
      {
        id: 'jb-4',
        name: 'Overtime approvals',
        types: [
          {
            id: 'n-4', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'sn-4', title: 'Payroll data extracted directly from the HR system', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 't-7', kind: 'findings', label: 'Findings',
            items: [
              { id: 'd-10', title: 'Overtime hours not matched to approvals', description: 'For 6 of 20 employees sampled, overtime hours paid could not be traced to an approved overtime request, indicating a breakdown in the authorisation control.', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 't-8', kind: 'recommendations', label: 'Recommendations',
            items: [
              { id: 'd-11', title: 'Require line-manager sign-off before payroll cut-off', updatedAt: '1 week ago' },
            ],
          },
          {
            id: 't-wp-3', kind: 'workingPapers', label: 'Working paper notes',
            items: [
              { id: 'd-wp-4', title: 'WP-21 — Overtime approval testing', description: 'Documented the sample of 20 employees, the approval evidence obtained, and the 6 exceptions noted on the overtime testing working paper WP-21.', updatedAt: '1 week ago', author: 'A. Manoj' },
            ],
          },
        ],
      },
      {
        id: 'jb-5',
        name: 'Starters and leavers',
        types: [
          {
            id: 'n-5', kind: 'scopeJobCompletionNotes', label: 'Job completion notes',
            items: [
              { id: 'sn-5', title: 'Joiner and leaver lists reconciled to the payroll register', updatedAt: '4 days ago' },
            ],
          },
          {
            id: 't-9', kind: 'evidenceNotes', label: 'Evidence notes',
            items: [
              { id: 'd-12', title: 'HR joiner forms traced for 10 new hires', description: 'Traced 10 new-hire records to signed HR joiner forms and confirmed the pay rates agreed to the approved offer letters.', updatedAt: '4 days ago' },
            ],
          },
        ],
      },
    ],
  },
];

export const MOCK_SCOPES: AuditScope[] = CLIENT_MODE_VALUE === 'internal-audit' ? IND_ORG_MOCK_SCOPES : AUDIT_FIRM_MOCK_SCOPES;