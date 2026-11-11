import { Company, OrgStatus } from "./models/company.model";


/**
 * Seed data for CompanyDataService — company-level records only (no
 * branch/department detail). This is the initial in-memory content of the
 * global company store; swap the assignment below for an HTTP call later
 * without touching the service's public API.
 *
 * `typeOfEntity` / `countryOfIncorporation` / `regionEmirate` / `city` /
 * `email` / `phone` are placeholder profile data (all 8 companies are
 * UAE-based LLCs here) so the Companies list shows a populated Location
 * and Primary Contact out of the box. Replace them with real values via
 * the Edit Company form as each client's actual details come in.
 */
export const COMPANIES_SEED: Company[] = [
  {
    "id": "al-noor-jewellery",
    "companyName": "Al Noor Jewellery Group",
    "tag": "ANJ",
    "color": "#b8860b",
    "industry": "jewelry",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "info@alnoorjewellery.ae",
    "phone": "+971 4 255 1000",
    "orgStatus": "approved",
    "submittedBy": "Yousef Al Marri"
  },
  {
    "id": "zumurrud-diamonds",
    "companyName": "Zumurrud Diamonds LLC",
    "tag": "ZUM",
    "color": "#0e9488",
    "industry": "jewelry",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "AUH",
    "city": "Abu Dhabi",
    "email": "contact@zumurruddiamonds.ae",
    "phone": "+971 2 555 2000",
    "orgStatus": "approved",
    "submittedBy": "Layla Hassan"
  },
  {
    "id": "falcon-gulf-jewellery",
    "companyName": "Falcon Gulf Jewellery Trading",
    "tag": "FGJ",
    "color": "#a13d63",
    "industry": "jewelry",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "SHJ",
    "city": "Sharjah",
    "email": "info@falcongulfjewellery.ae",
    "phone": "+971 6 555 3000",
    "orgStatus": "approved",
    "submittedBy": "Khalid Al Shamsi"
  },
  {
    "id": "marwa-gold-gems",
    "companyName": "Marwa Gold & Gems",
    "tag": "MGG",
    "color": "#c98a1a",
    "industry": "jewelry",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "hello@marwagoldgems.ae",
    "phone": "+971 4 555 4000",
    "orgStatus": "approved",
    "submittedBy": "Noura Al Blooshi"
  },
  {
    "id": "kanz-al-emarat",
    "companyName": "Kanz Al Emarat Jewellery",
    "tag": "KAE",
    "color": "#7a1ac4",
    "industry": "jewelry",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "AJM",
    "city": "Ajman",
    "email": "info@kanzalemarat.ae",
    "phone": "+971 6 555 5000",
    "orgStatus": "pending_review",
    "submittedBy": "Fatima Al Zaabi",
    "submittedDate": "2026-08-05",
    "dueDate": "2026-08-19"
  },
  {
    "id": "desert-rose-retail",
    "companyName": "Desert Rose Retail Group",
    "tag": "DRR",
    "color": "#1a9dc4",
    "industry": "other",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "DXB",
    "city": "Dubai",
    "email": "contact@desertroseretail.ae",
    "phone": "+971 4 555 6000",
    "orgStatus": "approved",
    "submittedBy": "Rashid Al Nuaimi"
  },
  {
    "id": "gulf-horizon-logistics",
    "companyName": "Gulf Horizon Logistics",
    "tag": "GHL",
    "color": "#4a4a4a",
    "industry": "other",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "JEA",
    "city": "Jebel Ali",
    "email": "info@gulfhorizonlogistics.ae",
    "phone": "+971 4 555 7000",
    "orgStatus": "rejected",
    "submittedBy": "Omar Al Suwaidi",
    "submittedDate": "2026-07-22",
    "dueDate": null
  },
  {
    "id": "al-waha-construction",
    "companyName": "Al Waha Construction & Contracting",
    "tag": "AWC",
    "color": "#8a5a1a",
    "industry": "other",
    "typeOfEntity": "LLC",
    "countryOfIncorporation": "AE",
    "regionEmirate": "RAK",
    "city": "Ras Al Khaimah",
    "email": "info@alwahaconstruction.ae",
    "phone": "+971 7 555 8000",
    "orgStatus": "approved",
    "submittedBy": "Maryam Al Kaabi"
  }
];

export const ORG_STATUS_OPTIONS: { label: string; value: OrgStatus }[] = [
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Approved', value: 'approved' },
];