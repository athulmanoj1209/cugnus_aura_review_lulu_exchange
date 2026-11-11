import { Company, OrgStatus } from "./models/company.model";


/**
 * Seed data for CompanyDataService when CLIENT_MODE is 'internal-audit' —
 * a single company record (the org performing its own internal audit),
 * as opposed to company-static-data.ts's multi-company audit-firm seed.
 * Same shape/helpers as company-static-data.ts; only the mock data differs.
 */
export const XYZ_BROADCAST_COMPANIES_SEED: Company[] = [
  {
    "id": "xyz-broadcast",
    "companyName": "XYZ Broadcast",
    "tag": "XYZ",
    "color": "#6a1b9a",
    "industry": "media-broadcasting",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "info@xyzbroadcast.example",
    "phone": "+971 4 111 1111",
    "orgStatus": "approved",
    "submittedBy": "Sarah Thomas"
  }
];

export const ORG_STATUS_OPTIONS: { label: string; value: OrgStatus }[] = [
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved', value: 'approved' },
];
