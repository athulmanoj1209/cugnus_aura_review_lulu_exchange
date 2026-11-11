import { Company, OrgStatus } from "./models/company.model";


/**
 * Seed data for CompanyDataService when CLIENT_MODE is 'internal-audit' and
 * INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a single company record
 * (the org performing its own internal audit). Same shape/fields as the DAR
 * Exchange seed in company-static-indi-org.data.ts; only the org identity differs.
 */
export const LULU_EXCHANGE_COMPANIES_SEED: Company[] = [
  {
    "id": "lulu-international-exchange",
    "companyName": "Lulu International Exchange",
    "tag": "LULU",
    "color": "#0b6e75",
    "industry": "financial-services",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "info@luluexchange.example",
    "phone": "+971 4 000 0000",
    "orgStatus": "approved",
    "submittedBy": "Rajeev Nanda"
  }
];

export const ORG_STATUS_OPTIONS: { label: string; value: OrgStatus }[] = [
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved', value: 'approved' },
];
