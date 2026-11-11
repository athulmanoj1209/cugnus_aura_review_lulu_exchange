import type { EnrichedStaticRfi } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';

export interface RfiDetail {
  id: string;
  description: string;
  subDivision: string;
  /** Division the RFI belongs to — with `subDivision` ('' for a division-level
   *  RFI), places it on the "RFIs / SLA Compliance by …" charts. */
  division?: string;
  /** Organization the RFI was sent to — powers the "RFIs by Sub-Division"
   *  organization breakdown chart and its detail drawer. */
  company: string;
  status: 'Overdue' | 'Escalated' | 'Open' | 'Closed';
  dueDate: string;
  responseDate: string;
  sla: 'Breach' | 'Met';
  // Drawer-specific fields
  priority: 'High' | 'Medium' | 'Low';
  submittedBy: string;
  submissionDate: string;
  assignedTo: string;
  category: string;
  slaTargetDays: number;
  escalationReason?: string;
  escalatedTo?: string;
  notes?: string;
}

export interface RfiDetailDrawerData {
  rfi: RfiDetail;
}

export type CanonicalRfiStatus = EnrichedStaticRfi['status'];
export type DashboardRfiRow = Omit<RfiDetail, 'status'> & { status: CanonicalRfiStatus };

/** Where an RFI sits: on a division itself (a division-level scope) or on
 *  one sub-division of a division. */
export interface RfiUnit {
  division: string;
  /** null for a division-level unit. */
  subDivision: string | null;
}

export interface RfiRow {
  id: string;
  description: string;
  /** '' for a division-level RFI. */
  subDivision: string;
  division?: string;
  company: string;
  status: string;
  dueDate: string;
  responseDate: string;
  sla: string;
  priority: string;
}

/** One drawer page: a division's division-level RFIs, or one sub-division's
 *  RFIs. Shared by the RFI and SLA sub-division detail drawers. */
export interface RfiUnitPage {
  name: string;
  kind: 'division' | 'subDivision';
  division: string;
  /** The sub-division the page covers; null on a division page. */
  subDivision: string | null;
}

/** Payload handed to the RFI sub-division drawer via `RightDrawerService.open(..., { data })`. */
export interface RfiBySubDivisionDetailData {
  /** Division-level pages first, then sub-division pages. */
  pages: RfiUnitPage[];
  /** Page to open on; defaults to the first. */
  startIndex?: number;
  /** Canonical company list/order — kept separate from `records` so a
   *  company's position stays stable even on a sub-division page where that
   *  company has zero RFIs. */
  companies: string[];
  records: RfiRow[];
}

export type RfiSortMode = 'due' | 'priority' | 'company' | 'alpha';

export interface SlaRfiRow {
  /** '' for a division-level RFI. */
  subDivision: string;
  division?: string;
  company: string;
  sla: string; // 'Breach' | 'Met'
}

/** Payload handed to the SLA sub-division drawer via `RightDrawerService.open(..., { data })`. */
export interface SlaBySubDivisionDetailData {
  /** Division-level pages first, then sub-division pages. */
  pages: RfiUnitPage[];
  /** Page to open on; defaults to the first. */
  startIndex?: number;
  /** Canonical company list/order — kept separate from `records` so a
   *  company's position stays stable even on a sub-division page where that
   *  company has no RFIs at all. */
  companies: string[];
  records: SlaRfiRow[];
}

export interface OrgSlaStat {
  company: string;
  total: number;
  met: number;
  breach: number;
  compliance: number;
  /** False when the organization has zero RFIs in this sub-division — its
   *  `compliance` is a meaningless 0 in that case, not an actual breach. */
  hasData: boolean;
}

export type SlaSortMode = 'compliance' | 'volume' | 'alpha';
