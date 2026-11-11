import type { RegulationAuthority, RegulationStatus, RegulationType } from '../constants/regulation-library.constants';

// Value sets live in ../constants; re-exported so existing importers keep working.
export type { RegulationAuthority, RegulationStatus, RegulationType } from '../constants/regulation-library.constants';

export interface Regulation {
  id: string;
  authority: RegulationAuthority;
  type: RegulationType;
  status: RegulationStatus;
  title: string;
  reference: string;
  description: string;
  effectiveDate: string;
  amendedDate?: string;
  region: string;
  linkedItems: number;
  tags: string[];
}

export const MOCK_REGULATIONS: Regulation[] = [
  {
    id: '1',
    authority: 'CBUAE',
    type: 'Regulation',
    status: 'Current',
    title: 'Anti-Money Laundering and Combating the Financing of Terrorism Guidelines',
    reference: 'CBUAE/BSD/2022/001',
    description:
      'Comprehensive guidelines for financial institutions on implementing AML/CFT controls, customer due diligence, transaction monitoring, and reporting suspicious activities in accordance with UAE federal laws and FATF recommendations.',
    effectiveDate: '2022-01-15',
    amendedDate: '2024-06-30',
    region: 'UAE',
    linkedItems: 3,
    tags: ['AML', 'CFT', 'KYC', 'CDD', 'Suspicious Activity', 'FATF'],
  },
  {
    id: '2',
    authority: 'DFSA',
    type: 'Guidance',
    status: 'Current',
    title: 'Client Money and Assets Guidance',
    reference: 'DFSA-CMA-G-2024',
    description:
      'Guidance on segregation, protection, and handling of client money and assets by authorized firms, including trust arrangements, reconciliation requirements, and permitted activities.',
    effectiveDate: '2024-02-15',
    region: 'UAE',
    linkedItems: 2,
    tags: ['Client Money', 'Client Assets', 'Segregation', 'Trust', 'Protection'],
  },
  {
    id: '3',
    authority: 'DFSA',
    type: 'Regulation Book',
    status: 'Current',
    title: 'Conduct of Business Rulebook',
    reference: 'DFSA-COB',
    description:
      'Rules and guidance for authorized firms conducting financial services in or from the Dubai International Financial Centre, covering client classification, conduct standards, conflicts of interest, and fair treatment of clients.',
    effectiveDate: '2021-03-01',
    amendedDate: '2025-01-10',
    region: 'UAE',
    linkedItems: 2,
    tags: ['COB', 'Client Assets', 'Best Execution', 'Suitability', 'DIFC'],
  },
  {
    id: '4',
    authority: 'CBUAE',
    type: 'Standard',
    status: 'Current',
    title: 'Consumer Protection Standards for Financial Services',
    reference: 'CBUAE/CP/2021/008',
    description:
      'Standards ensuring fair treatment of consumers by financial institutions, covering product disclosure, complaints handling, data privacy, responsible lending, and vulnerable customer protection.',
    effectiveDate: '2021-08-01',
    amendedDate: '2023-12-15',
    region: 'UAE',
    linkedItems: 1,
    tags: ['Consumer Protection', 'Fair Treatment', 'Complaints', 'Data Privacy', 'Responsible Lending'],
  },
  {
    id: '5',
    authority: 'ADGM',
    type: 'Standard',
    status: 'Current',
    title: 'Corporate Governance Code',
    reference: 'ADGM-CGC-2023',
    description:
      'Code establishing principles and standards for corporate governance applicable to public companies registered in the Abu Dhabi Global Market, including board composition, director duties, shareholder rights, and disclosure requirements.',
    effectiveDate: '2023-07-01',
    region: 'UAE',
    linkedItems: 1,
    tags: ['Corporate Governance', 'Board', 'Disclosure', 'Shareholders'],
  },
  {
    id: '6',
    authority: 'CBUAE',
    type: 'Regulation',
    status: 'Current',
    title: 'Stored Value Facilities Regulation',
    reference: 'CBUAE/SVF/2020/003',
    description:
      'Regulatory framework governing the issuance and operation of stored value facilities, including e-wallets and prepaid cards in the UAE, covering licensing, capital requirements, and consumer safeguards.',
    effectiveDate: '2020-09-01',
    amendedDate: '2023-03-20',
    region: 'UAE',
    linkedItems: 2,
    tags: ['SVF', 'E-Wallet', 'Prepaid', 'Licensing', 'Fintech'],
  },
  {
    id: '7',
    authority: 'DFSA',
    type: 'Regulation',
    status: 'Current',
    title: 'Markets Rules',
    reference: 'DFSA-MKT',
    description:
      'Rules governing the operation of financial markets in the DIFC, including market abuse prevention, disclosure obligations, listing requirements, and trading conduct.',
    effectiveDate: '2019-05-01',
    amendedDate: '2024-11-01',
    region: 'UAE',
    linkedItems: 4,
    tags: ['Markets', 'Market Abuse', 'Listing', 'DIFC', 'Disclosure'],
  },
  {
    id: '8',
    authority: 'ADGM',
    type: 'Guidance',
    status: 'Current',
    title: 'Digital Assets Framework',
    reference: 'ADGM-DAF-2023',
    description:
      'Comprehensive regulatory framework for the regulation of digital assets and virtual asset service providers operating within the Abu Dhabi Global Market.',
    effectiveDate: '2023-01-01',
    region: 'UAE',
    linkedItems: 3,
    tags: ['Digital Assets', 'Crypto', 'VASP', 'Blockchain', 'Virtual Assets'],
  },
  {
    id: '9',
    authority: 'CBUAE',
    type: 'Regulation',
    status: 'Superseded',
    title: 'Mortgage Finance Regulations',
    reference: 'CBUAE/MFR/2013/001',
    description:
      'Regulations governing mortgage lending by banks and finance companies in the UAE, including loan-to-value limits, debt burden ratios, and disclosure requirements for mortgage products.',
    effectiveDate: '2013-10-30',
    amendedDate: '2021-06-15',
    region: 'UAE',
    linkedItems: 1,
    tags: ['Mortgage', 'LTV', 'Lending', 'Real Estate'],
  },
  {
    id: '10',
    authority: 'DFSA',
    type: 'Standard',
    status: 'Current',
    title: 'Anti-Money Laundering Module',
    reference: 'DFSA-AML',
    description:
      'AML and counter-terrorist financing rules applicable to DIFC-registered firms, aligned with FATF recommendations and UAE Federal Law requirements.',
    effectiveDate: '2020-01-01',
    amendedDate: '2024-04-01',
    region: 'UAE',
    linkedItems: 5,
    tags: ['AML', 'CTF', 'FATF', 'DIFC', 'Compliance'],
  },
  {
    id: '11',
    authority: 'ADGM',
    type: 'Regulation',
    status: 'Current',
    title: 'Financial Services and Markets Regulations',
    reference: 'ADGM-FSMR-2015',
    description:
      'Primary regulatory legislation for financial services and markets in the Abu Dhabi Global Market, establishing the framework for authorization, supervision, and enforcement.',
    effectiveDate: '2015-12-01',
    amendedDate: '2024-09-01',
    region: 'UAE',
    linkedItems: 6,
    tags: ['FSMR', 'Authorization', 'Supervision', 'ADGM', 'Financial Services'],
  },
  {
    id: '12',
    authority: 'CBUAE',
    type: 'Guidance',
    status: 'Draft',
    title: 'Open Banking Framework',
    reference: 'CBUAE/OBF/2024/DRAFT',
    description:
      'Draft framework establishing standards for open banking APIs, data sharing between licensed financial institutions, and third-party provider access to customer financial data.',
    effectiveDate: '2024-12-01',
    region: 'UAE',
    linkedItems: 0,
    tags: ['Open Banking', 'API', 'Data Sharing', 'PSD2', 'Fintech'],
  },
];