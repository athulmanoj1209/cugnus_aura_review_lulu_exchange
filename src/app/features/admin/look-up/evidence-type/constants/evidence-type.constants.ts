export const EvidenceTypeStatuses = { Active: 'active', Inactive: 'inactive' } as const;
export type EvidenceTypeStatus = typeof EvidenceTypeStatuses[keyof typeof EvidenceTypeStatuses];
export const EvidenceTypeModes = { Add: 'add', Edit: 'edit' } as const;
export type EvidenceTypeMode = typeof EvidenceTypeModes[keyof typeof EvidenceTypeModes];
export const EVIDENCE_TYPE_PAGE_SIZE = 10;
export const EVIDENCE_TYPE_NAME_MAX_LENGTH = 100;
export const EVIDENCE_TYPE_DESCRIPTION_MAX_LENGTH = 500;
