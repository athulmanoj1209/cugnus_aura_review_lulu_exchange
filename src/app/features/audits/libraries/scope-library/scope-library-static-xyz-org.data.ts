import type { ScopeLibraryStaticCompany, XyzLibrarySubDivisionSeed } from './models/scope-library-static-data.model';
import type { ScopeLibraryItem, ScopeLibraryStatus } from './models/scope-library-list.model';

/* ── XYZ Broadcast ────────────────────────────────────────────────────────
 * One top-level "scope" library item per sub-division (the sheet's Audit
 * Scope) plus one "subscope" item per real sub-scope, mirroring the
 * ABC Broadcast sl-001/ssl-001/ssl-002 parent/child pattern uniformly
 * across all 27 sub-divisions.
 * ──────────────────────────────────────────────────────────────────────── */

const XYZ_BROADCAST_SCOPE_LIBRARY_COMPANY: ScopeLibraryStaticCompany = {
  id: 'xyz-broadcast',
  companyName: 'XYZ Broadcast',
  divisions: [
    {
      divisionCode: 'XYZ-BR-01',
      divisionName: 'Dubai',
      hasSubDivision: true,
      subDivisions: [
        'Broadcasting / Television Operations', 'Radio Operations', 'Newspaper / Publishing', 'Editorial / Newsroom',
        'Content Compliance / Editorial Governance', 'Content Acquisition / Legal', 'Commercial / Advertising Sales',
        'Commercial / Partnerships', 'Circulation / Subscription', 'Digital Media / Technology',
        'Digital / Corporate Communications', 'Information Technology / Information Security',
        'Business Continuity / IT / Operations', 'Operations / Asset Management', 'Content Production', 'Finance',
        'Procurement / Supply Chain', 'Legal / Contract Management', 'Human Resources', 'Legal / Compliance',
        'Information Governance / Compliance', 'Records / Archive Management',
        'Corporate Communications / Brand Protection', 'Risk / Internal Control / Finance',
        'Corporate Governance / Board Secretariat', 'Risk Management', 'Procurement / Risk / Vendor Management',
      ],
    },
  ],
};

export const XYZ_BROADCAST_SCOPE_LIBRARY_COMPANIES: ScopeLibraryStaticCompany[] = [XYZ_BROADCAST_SCOPE_LIBRARY_COMPANY];

const XYZ_SCOPE_LIBRARY_SEEDS: XyzLibrarySubDivisionSeed[] = [
  { subDivision: 'Broadcasting / Television Operations', scopeTitle: 'Broadcasting Operations', riskCategory: 'Operational Risk', frameworks: ['COSO', 'ISO 27001'], subScopes: [
    { name: 'Transmission & Playout', objective: 'Assess reliability and control over broadcast transmission and playout.' },
    { name: 'Studio & Control Room Access', objective: 'Ensure physical and logical access is appropriately controlled.' },
  ]},
  { subDivision: 'Radio Operations', scopeTitle: 'Radio Operations', riskCategory: 'Operational Risk', frameworks: ['COSO', 'ISO 27001'], subScopes: [
    { name: 'Programming & Scheduling', objective: 'Ensure radio programming is properly approved and executed.' },
    { name: 'Transmission & Equipment', objective: 'Assess radio transmission continuity and equipment reliability.' },
  ]},
  { subDivision: 'Newspaper / Publishing', scopeTitle: 'Newspaper & Publishing', riskCategory: 'Operational Risk', frameworks: ['COSO'], subScopes: [
    { name: 'Editorial-to-Publication Workflow', objective: 'Ensure published content follows approved editorial workflow.' },
    { name: 'Print Production & Distribution', objective: 'Assess controls over printing, circulation and returns.' },
  ]},
  { subDivision: 'Editorial / Newsroom', scopeTitle: 'Editorial Governance & Newsroom', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Editorial Approval', objective: 'Ensure content is reviewed and approved before release.' },
    { name: 'Fact Checking & Source Verification', objective: 'Assess whether facts and sources are appropriately verified.' },
    { name: 'Corrections & Retractions', objective: 'Assess governance over corrections and retractions.' },
  ]},
  { subDivision: 'Content Compliance / Editorial Governance', scopeTitle: 'Content Governance & Compliance', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Content Review', objective: 'Ensure media content is reviewed against applicable internal and regulatory requirements.' },
    { name: 'Complaints Handling', objective: 'Assess handling of public/regulatory complaints about content.' },
  ]},
  { subDivision: 'Content Acquisition / Legal', scopeTitle: 'Content Rights & Intellectual Property', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Licensing & Usage Rights', objective: 'Ensure content is used within valid rights and licence terms.' },
    { name: 'Licence Expiry & Restrictions', objective: 'Assess monitoring of expiry, territory and platform restrictions.' },
  ]},
  { subDivision: 'Commercial / Advertising Sales', scopeTitle: 'Advertising & Commercial Revenue', riskCategory: 'Financial Risk', frameworks: ['SOX', 'COSO'], subScopes: [
    { name: 'Ad Booking to Broadcast/Publication', objective: 'Ensure all booked advertising is accurately delivered and billed.' },
    { name: 'Rate Cards & Discounts', objective: 'Assess authorization of rates, discounts and overrides.' },
    { name: 'Revenue Completeness', objective: 'Identify unbilled or delayed billing for delivered advertisements.' },
  ]},
  { subDivision: 'Commercial / Partnerships', scopeTitle: 'Sponsorship & Commercial Partnerships', riskCategory: 'Financial Risk', frameworks: ['SOX', 'COSO'], subScopes: [
    { name: 'Contractual Obligations', objective: 'Ensure sponsorship commitments are delivered and billed according to contract.' },
  ]},
  { subDivision: 'Circulation / Subscription', scopeTitle: 'Subscription & Circulation', riskCategory: 'Financial Risk', frameworks: ['SOX', 'COSO'], subScopes: [
    { name: 'Subscription Revenue', objective: 'Assess accuracy and completeness of subscription billing.' },
  ]},
  { subDivision: 'Digital Media / Technology', scopeTitle: 'Digital Media & OTT Platforms', riskCategory: 'IT General Controls', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Publishing Access', objective: 'Ensure only authorized users can publish or modify digital content.' },
    { name: 'Availability & Change Management', objective: 'Assess platform resilience and controlled changes.' },
  ]},
  { subDivision: 'Digital / Corporate Communications', scopeTitle: 'Social Media Governance', riskCategory: 'Access Management', frameworks: ['ISO 27001', 'COBIT'], subScopes: [
    { name: 'Account Security', objective: 'Protect official social accounts from unauthorized access.' },
    { name: 'Posting & Approval', objective: 'Ensure sensitive posts follow defined approvals.' },
  ]},
  { subDivision: 'Information Technology / Information Security', scopeTitle: 'Cybersecurity', riskCategory: 'IT General Controls', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Identity & Access Management', objective: 'Ensure access to critical media and corporate systems is appropriate.' },
    { name: 'Vulnerability & Incident Management', objective: 'Assess vulnerability remediation and cyber incident response.' },
  ]},
  { subDivision: 'Business Continuity / IT / Operations', scopeTitle: 'Business Continuity & Disaster Recovery', riskCategory: 'Business Continuity', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Broadcast Continuity', objective: 'Ensure TV/radio services can continue during disruption.' },
    { name: 'IT Disaster Recovery', objective: 'Assess recoverability of critical systems and data.' },
  ]},
  { subDivision: 'Operations / Asset Management', scopeTitle: 'Media Asset Management', riskCategory: 'Operational Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Asset Custody', objective: 'Ensure media equipment is recorded, safeguarded and traceable.' },
    { name: 'Maintenance & Disposal', objective: 'Assess maintenance and disposal controls.' },
  ]},
  { subDivision: 'Content Production', scopeTitle: 'Production Management', riskCategory: 'Operational Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Production Budgeting', objective: 'Ensure productions operate within approved budgets.' },
    { name: 'External Crew & Vendors', objective: 'Assess payments and contracting for external production resources.' },
  ]},
  { subDivision: 'Finance', scopeTitle: 'Finance & Financial Reporting', riskCategory: 'Financial Risk', frameworks: ['SOX', 'COSO'], subScopes: [
    { name: 'Revenue & Receivables', objective: 'Assess accuracy, completeness and collection of media revenue.' },
    { name: 'General Ledger & Close', objective: 'Assess period-end financial reporting controls.' },
  ]},
  { subDivision: 'Procurement / Supply Chain', scopeTitle: 'Procurement & Vendor Management', riskCategory: 'Vendor Risk', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Sourcing & Tendering', objective: 'Ensure procurement is competitive and authorized.' },
    { name: 'Vendor Due Diligence', objective: 'Assess vendor onboarding and conflict checks.' },
  ]},
  { subDivision: 'Legal / Contract Management', scopeTitle: 'Contract Management', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'ISO 27001'], subScopes: [
    { name: 'Contract Lifecycle', objective: 'Ensure contracts are approved, monitored and renewed on time.' },
  ]},
  { subDivision: 'Human Resources', scopeTitle: 'Human Resources & Payroll', riskCategory: 'Operational Risk', frameworks: ['SOX', 'COSO'], subScopes: [
    { name: 'Payroll & Allowances', objective: 'Assess payroll accuracy and authorization.' },
    { name: 'Freelancers & Talent', objective: 'Assess governance over presenters, journalists, freelancers and temporary crew.' },
  ]},
  { subDivision: 'Legal / Compliance', scopeTitle: 'Legal & Regulatory Compliance', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'SOX', 'COBIT'], subScopes: [
    { name: 'Licences & Regulatory Obligations', objective: 'Ensure regulatory obligations and licences are tracked and fulfilled.' },
  ]},
  { subDivision: 'Information Governance / Compliance', scopeTitle: 'Data Privacy & Information Governance', riskCategory: 'Data Privacy', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Personal Data Handling', objective: 'Assess protection and lawful handling of personal data.' },
  ]},
  { subDivision: 'Records / Archive Management', scopeTitle: 'Records & Media Archive Management', riskCategory: 'Operational Risk', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Archive Completeness & Retrieval', objective: 'Ensure media archives are complete, protected and retrievable.' },
  ]},
  { subDivision: 'Corporate Communications / Brand Protection', scopeTitle: 'Reputation & Brand Risk', riskCategory: 'Operational Risk', frameworks: ['COSO'], subScopes: [
    { name: 'Negative Media & Brand Monitoring', objective: 'Assess monitoring and response to reputational threats.' },
  ]},
  { subDivision: 'Risk / Internal Control / Finance', scopeTitle: 'Fraud Risk Management', riskCategory: 'Fraud Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Fraud Risk Assessment', objective: 'Assess identification and monitoring of fraud risks.' },
    { name: 'Revenue & Vendor Analytics', objective: 'Identify unusual transactions and potential fraud indicators.' },
  ]},
  { subDivision: 'Corporate Governance / Board Secretariat', scopeTitle: 'Corporate Governance', riskCategory: 'Compliance Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Delegation & Committees', objective: 'Assess governance, authority and oversight structures.' },
  ]},
  { subDivision: 'Risk Management', scopeTitle: 'Enterprise Risk Management', riskCategory: 'Operational Risk', frameworks: ['COSO', 'SOX'], subScopes: [
    { name: 'Risk Register & KRIs', objective: 'Assess completeness and effectiveness of enterprise risk monitoring.' },
    { name: 'Risk Assessment & Controls', objective: 'Assess risk scoring and control effectiveness methodology.' },
  ]},
  { subDivision: 'Procurement / Risk / Vendor Management', scopeTitle: 'Third-Party & Outsourcing Risk', riskCategory: 'Vendor Risk', frameworks: ['ISO 27001', 'NIST'], subScopes: [
    { name: 'Critical Third Parties', objective: 'Assess risks arising from critical outsourced services and partners.' },
  ]},
];

const RAW_SCOPE_LIBRARY_XYZ: Omit<ScopeLibraryItem, 'status' | 'createdAt'>[] = [];
let xyzSubScopeCounter = 0;
XYZ_SCOPE_LIBRARY_SEEDS.forEach((seed, i) => {
  const scopeId = `sl-2${String(i + 1).padStart(2, '0')}`;
  const subScopeStubs = seed.subScopes.map(sub => {
    xyzSubScopeCounter += 1;
    return { id: `ssl-2${String(xyzSubScopeCounter).padStart(2, '0')}`, title: sub.name };
  });
  RAW_SCOPE_LIBRARY_XYZ.push({
    id: scopeId,
    company: 'xyz-broadcast',
    division: 'XYZ-BR-01',
    subDivision: seed.subDivision,
    title: seed.scopeTitle,
    objective: `Evaluate ${seed.scopeTitle.toLowerCase()} controls for the ${seed.subDivision} sub-division.`,
    scopeLevel: 'scope',
    subScopes: subScopeStubs,
    riskCategory: seed.riskCategory,
    applicableFrameworks: seed.frameworks,
  });
  seed.subScopes.forEach((sub, j) => {
    RAW_SCOPE_LIBRARY_XYZ.push({
      id: subScopeStubs[j].id,
      company: 'xyz-broadcast',
      division: 'XYZ-BR-01',
      subDivision: seed.subDivision,
      title: sub.name,
      objective: sub.objective,
      scopeLevel: 'subscope',
      parentScopeId: scopeId,
      parentScopeTitle: seed.scopeTitle,
      riskCategory: seed.riskCategory,
      applicableFrameworks: seed.frameworks,
    });
  });
});

const APPROVED_SCOPE_SUBMITTERS_XYZ = ['Karim Aziz', 'Nadia Haddad', 'Sultan Al Mazrouei', 'Farah Idris', 'Yousuf Rahman'];

export const MOCK_SCOPE_LIBRARY_XYZ: ScopeLibraryItem[] = RAW_SCOPE_LIBRARY_XYZ.map((item, i) => ({
  ...item,
  status: 'approved' as ScopeLibraryStatus,
  createdAt: `2026-02-${String((i % 27) + 1).padStart(2, '0')}T09:00:00.000Z`,
  submittedBy: APPROVED_SCOPE_SUBMITTERS_XYZ[i % APPROVED_SCOPE_SUBMITTERS_XYZ.length],
}));
