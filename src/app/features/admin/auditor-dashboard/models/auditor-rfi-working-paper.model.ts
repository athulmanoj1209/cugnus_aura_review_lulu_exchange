import type { WorkingPaperStatus } from '@/app/features/audits/audit-execution/working-papers/list/working-papers-list.component';

/** RFI statuses understood by the RFI management screen — owned by the RFI module. */
export type { RfiStatus } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';
import type { RfiStatus } from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';

/** An RFI dashboard KPI card that drills into the RFI management list. */
export interface RfiKpiCard {
  label: string;
  value: string;
  icon: string;
  cardClass: string;
  /** Status to pre-filter the RFI list by. Omit for "all" (e.g. RFIs Sent). */
  status?: RfiStatus;
}

/** A working-paper summary card that drills into the working-paper list. */
export interface WpSummaryCard {
  label: string;
  value: string;
  icon: string;
  cardClass: string;
  /** Status to pre-filter the working-paper list by. Omit for "all" (e.g. Total). */
  status?: WorkingPaperStatus;
}

/** An RFI, shaped for the "RFI List" table. */
export interface RfiListRow {
  rfiNo: string; audit: string; scope: string; subDivision: string; dueDate: string; status: string;
}
