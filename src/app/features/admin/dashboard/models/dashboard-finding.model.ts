import type { FindingRowLike } from '@/app/features/audits/audit-execution/findings/audit-finding-data';

/** Dashboard findings row — derived from `MOCK_FINDINGS` via `toFindingRow`. */
export type FindingRow = FindingRowLike;

export interface AgingFindingRow {
  id: string;
  finding: string;
  company: string;
  scope: string;
  subDivision: string;
  severity: string;
  severityClass: string;
  status: string;
  statusClass: string;
  dueDate: string;
  ageDays: number;
  repeated: boolean;
}

export interface AgingBucket {
  label: string;
  /** Inclusive lower bound, in days. */
  min: number;
  /** Inclusive upper bound, in days — null means no upper bound. */
  max: number | null;
}

/** Payload handed to the aging detail drawer via `RightDrawerService.open(..., { data })`. */
export interface AgingAnalysisDetailData {
  buckets: AgingBucket[];
  /** Canonical organization list/order — same array passed to the Audits by
   * Department / Risk Rating detail drawers, so identity colors line up. */
  companies: string[];
  findings: AgingFindingRow[];
}

export interface SubdivisionFindingRow {
  id: string;
  finding: string;
  company: string;
  scope: string;
  division?: string;
  subDivision: string;
  severity: string;
  severityClass: string;
  status: string;
  statusClass: string;
  dueDate: string;
  ageDays: number;
  repeated: boolean;
}

/** One drawer page: a division's division-level findings, or one sub-division's findings. */
export interface FindingUnitPage {
  name: string;
  kind: 'division' | 'subDivision';
  division: string;
  /** The sub-division the page covers; null on a division page. */
  subDivision: string | null;
}

/** Payload handed to the findings sub-division drawer via `RightDrawerService.open(..., { data })`. */
export interface FindingsBySubdivisionDetailData {
  /** Division-level pages first, then sub-division pages. */
  pages: FindingUnitPage[];
  /** Page to open on; defaults to the first. */
  startIndex?: number;
  /** Canonical company list/order — kept separate from `findings` so a
   *  company's position (and therefore anything keyed off it) stays stable
   *  even on a sub-division page where that company has zero findings. */
  companies: string[];
  findings: SubdivisionFindingRow[];
}

export type FindingSortMode = 'age' | 'severity' | 'company' | 'alpha';
