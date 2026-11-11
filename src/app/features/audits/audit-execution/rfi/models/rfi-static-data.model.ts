// Shapes of the static RFI seed trees (rfi/rfi-static-data.ts,
// rfi-static-indi.data.ts, rfi-static-xyz-broadcast.data.ts) and of the flat
// enriched list built from them by getAllEnrichedRfis().

import type { RfiRecordStatuses, RfiResponseStatuses, RfiStatuses } from '../constants/rfi.constants';

/** Minimal company display fields, supplied by the caller (which has access to
 *  `CompanyDataService`) so a company that exists there but has never had an
 *  RFI added yet can get a fresh wrapper here instead of silently dropping it. */
export interface CompanyMeta {
  companyName: string;
  tag?: string;
  color?: string;
}

export type RfiStatus = typeof RfiStatuses[keyof typeof RfiStatuses];
/** Drives the Activate/Deactivate action — independent of `status` above. */
export type RfiRecordStatus = typeof RfiRecordStatuses[keyof typeof RfiRecordStatuses];
export type RfiResponseStatus = typeof RfiResponseStatuses[keyof typeof RfiResponseStatuses];

export interface RfiDoc {
  name: string;
  url: string;
  description: string;
}

export interface RfiResponse {
  responseText: string;
  explanationNotes?: string;
  responseDocs: RfiDoc[];
  status: RfiResponseStatus;
  rejectionReason?: string;
  submittedAt?: string;
  rejectedAt?: string;
}

export interface RfiHistoryEntry {
  responseText: string;
  explanationNotes?: string;
  responseDocs: RfiDoc[];
  questionnaire: {
    question: string;
    answer?: string;
    questionDocs?: RfiDoc[];
    answerDocs?: RfiDoc[];
  }[];
  submittedAt: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface RfiQuestionnaireItem {
  question: string;
  answer?: string;
  dueDate?: string | null;
  questionDocs?: RfiDoc[];
  answerDocs?: RfiDoc[];
}

export interface StaticRfi {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  ownerValue: string;
  ownerLabel: string;
  status: RfiStatus;
  response?: RfiResponse | null;
  questionnaire?: RfiQuestionnaireItem[];
  responseHistory?: RfiHistoryEntry[];
  auditorIds?: string[];
  /**
   * Stamped by `upsertStaticRfi`: true when filed under a sub-division, false when
   * filed directly under the division. Absent on seed records (placement decides).
   */
  hasSubDivision?: boolean;
  /** ISO timestamp — drives the list's newest-first sort. Stamped by `upsertStaticRfi`. */
  createdAt: string;
  /** Drives the list's Activate/Deactivate action — independent of `status`. */
  recordStatus: RfiRecordStatus;
}

export interface RfiStaticScope {
  id: string;
  company: string;
  divisionCode: string;
  /** null for a division-level scope (one that sits directly under its division, not under a sub-division). */
  subDivisionName: string | null;
  /** null = top-level scope; set = sub-scope of the scope with this id. */
  parentScopeId: string | null;
  scopeName: string;
  rfis: StaticRfi[];
}

export interface RfiStaticSubDivision {
  subDivisionName: string;
  company: string;
  divisionCode: string;
  scopes: RfiStaticScope[];
}

export interface RfiStaticDivision {
  divisionCode: string;
  divisionName: string;
  hasSubDivision: boolean;
  company: string;
  /** Division-level scopes/sub-scopes (`subDivisionName: null`) and their RFIs — same flat parent/child layout as a sub-division's `scopes`. */
  scopes: RfiStaticScope[];
  subDivisions: RfiStaticSubDivision[];
}

export interface RfiStaticCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  divisions: RfiStaticDivision[];
}

/** One row of the flat, enriched RFI list (getAllEnrichedRfis) used by the auditor and client RFI views. */
export interface EnrichedStaticRfi {
  id: number;
  subDivisionValue: string;
  subDivisionLabel: string;
  scopeValue: string | null;
  scopeLabel: string | null;
  subScopeValue: string | null;
  subScopeLabel: string | null;
  title: string;
  description: string;
  dueDate: Date;
  ownerValue: string;
  ownerLabel: string;
  status: RfiStatus;
  response?: RfiResponse | null;
  auditorId?: string;
  auditorIds?: string[];
  questionnaire?: RfiQuestionnaireItem[];
  responseHistory?: RfiHistoryEntry[];
  company: string;
  divisionCode: string;
  divisionName: string;
  /** The RFI's own `hasSubDivision` stamp (absent on seed records) — see StaticRfi. */
  hasSubDivision?: boolean;
  /** Drives the list's newest-first sort in rfi-list.component.ts / rfi-client-list.component.ts. */
  createdAt: Date;
  /** Drives the Activate/Deactivate action in rfi-list.component.ts / rfi-client-list.component.ts. */
  recordStatus: RfiRecordStatus;
}
