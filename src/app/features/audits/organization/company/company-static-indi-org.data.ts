import { INTERNAL_AUDIT_CLIENT_KEY_VALUE } from "@/app/core/config/client-mode";
import { Company, OrgStatus } from "./models/company.model";
import { XYZ_BROADCAST_COMPANIES_SEED } from "./company-static-xyz-broadcast.data";
import { LULU_EXCHANGE_COMPANIES_SEED } from "./company-lulu-exchange.data";


/**
 * Seed data for CompanyDataService when CLIENT_MODE is 'internal-audit' —
 * a single company record (the org performing its own internal audit),
 * as opposed to company-static-data.ts's multi-company audit-firm seed.
 * Same shape/helpers as company-static-data.ts; only the mock data differs.
 */
export const DAR_EXCHANGE_COMPANIES_SEED: Company[] = [
  {
    "id": "abc-broadcast",
    "companyName": "ABC Broadcast",
    "tag": "ABC",
    "color": "#0b6e75",
    "industry": "financial-services",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "info@abcbroadcast.example",
    "phone": "+971 4 000 0000",
    "orgStatus": "approved",
    "submittedBy": "Rajeev Nanda"
  }
];

export const COMPANIES_SEED =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? XYZ_BROADCAST_COMPANIES_SEED
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? LULU_EXCHANGE_COMPANIES_SEED
  : DAR_EXCHANGE_COMPANIES_SEED;

export const ORG_STATUS_OPTIONS: { label: string; value: OrgStatus }[] = [
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved', value: 'approved' },
];
