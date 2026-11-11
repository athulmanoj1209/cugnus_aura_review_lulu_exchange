import type { RfiLibraryStaticCompany, XyzRfiLibrarySeed } from './models/rfi-library-static-data.model';
import type { RfiLibraryItem, RfiLibraryStatus } from './models/rfi-library-list.model';

/* ── XYZ Broadcast ────────────────────────────────────────────────────────
 * One RFI library item per RFI ID in the Media Company Internal Audit plan
 * (RFI-BO-001 .. RFI-TP-001, 48 items), each linked to its scope/sub-scope
 * in scope-library-static-xyz-org.data.ts (sl-201..sl-227 /
 * ssl-201..ssl-247) — same company/division/sub-division roster as that file.
 * ──────────────────────────────────────────────────────────────────────── */

const XYZ_BROADCAST_RFI_LIBRARY_COMPANY: RfiLibraryStaticCompany = {
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

export const XYZ_BROADCAST_RFI_LIBRARY_COMPANIES: RfiLibraryStaticCompany[] = [XYZ_BROADCAST_RFI_LIBRARY_COMPANY];

const XYZ_RFI_LIBRARY_SEEDS: XyzRfiLibrarySeed[] = [
  // ── Broadcasting / Television Operations ─ Broadcasting Operations (sl-201)
  { id: 'rfi-201', subDivision: 'Broadcasting / Television Operations', scopeId: 'sl-201', scopeTitle: 'Broadcasting Operations', subScopeId: 'ssl-201', subScopeTitle: 'Transmission & Playout',
    title: 'Broadcast Schedules, Playout Logs and Schedule Changes',
    description: 'Please provide approved TV broadcast schedules, playout logs, exception logs and evidence of schedule changes for the selected audit period.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Broadcast Schedule', 'Playout', 'Change Control'],
    questions: [
      'Please provide the approved daily broadcast schedules for the audit period.',
      'Please provide as-run playout logs exported from the automation system.',
      'How are deviations between the approved schedule and actual playout identified and reviewed?',
      'Are late schedule changes supported by an approved change request?',
    ] },
  { id: 'rfi-202', subDivision: 'Broadcasting / Television Operations', scopeId: 'sl-201', scopeTitle: 'Broadcasting Operations', subScopeId: 'ssl-201', subScopeTitle: 'Transmission & Playout',
    title: 'Broadcast Downtime / Incident Register and Root-Cause Analysis',
    description: 'Please provide the broadcast downtime/incident register, root-cause analysis reports, corrective actions and closure evidence for the audit period.',
    category: 'Evidence & Document Requests', priority: 'critical', tags: ['Outage', 'Incident', 'Root Cause'],
    questions: [
      'Please provide the broadcast downtime/incident register for the audit period.',
      'Was a root-cause analysis prepared for every Severity 1 and Severity 2 incident?',
      'Please share corrective action trackers and closure evidence.',
      'Does the incident register reconcile to NOC monitoring alarms?',
    ] },
  { id: 'rfi-203', subDivision: 'Broadcasting / Television Operations', scopeId: 'sl-201', scopeTitle: 'Broadcasting Operations', subScopeId: 'ssl-202', subScopeTitle: 'Studio & Control Room Access',
    title: 'Studio, Master Control Room and Broadcast System Access Lists',
    description: 'Please provide current user/access lists for studios, master control rooms and critical broadcast systems, including recent access review evidence.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Physical Access', 'Logical Access', 'Access Review'],
    questions: [
      'Please provide the current access card listing for studios and master control rooms.',
      'Please provide user access listings for playout, automation and newsroom systems.',
      'When was the last access review performed and who approved it?',
      'Are leavers\' cards and accounts disabled on their last working day?',
    ] },

  // ── Radio Operations ─ Radio Operations (sl-202)
  { id: 'rfi-204', subDivision: 'Radio Operations', scopeId: 'sl-202', scopeTitle: 'Radio Operations', subScopeId: 'ssl-203', subScopeTitle: 'Programming & Scheduling',
    title: 'Radio Programme Schedules, Change Requests and Transmission Logs',
    description: 'Please provide approved radio programme schedules, change requests, approvals and transmission logs for selected dates.',
    category: 'Process & Control Walkthroughs', priority: 'high', tags: ['Radio', 'Programming', 'Scheduling'],
    questions: [
      'Please provide approved radio programme schedules for the selected dates.',
      'Please share programme change requests and their approvals.',
      'Do transmission logs agree to the approved schedules?',
      'Who is authorised to approve last-minute programme changes?',
    ] },
  { id: 'rfi-205', subDivision: 'Radio Operations', scopeId: 'sl-202', scopeTitle: 'Radio Operations', subScopeId: 'ssl-204', subScopeTitle: 'Transmission & Equipment',
    title: 'Radio Transmission Equipment, Maintenance and Failover Testing',
    description: 'Please provide radio transmission equipment inventory, preventive maintenance schedules, breakdown records and backup/failover test results.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Transmission', 'Maintenance', 'Failover'],
    questions: [
      'Please provide the radio transmission equipment inventory.',
      'Please share preventive maintenance schedules and completion records.',
      'Please provide breakdown records for the audit period.',
      'When were backup/failover arrangements last tested and what were the results?',
    ] },

  // ── Newspaper / Publishing ─ Newspaper & Publishing (sl-203)
  { id: 'rfi-206', subDivision: 'Newspaper / Publishing', scopeId: 'sl-203', scopeTitle: 'Newspaper & Publishing', subScopeId: 'ssl-205', subScopeTitle: 'Editorial-to-Publication Workflow',
    title: 'Published Article Sample with Drafts, Approvals and Corrections',
    description: 'Please provide a sample of published articles with draft versions, editorial review comments, approvals, publication timestamps and correction history, if any.',
    category: 'Process & Control Walkthroughs', priority: 'medium', tags: ['Editorial', 'CMS Workflow', 'Publication'],
    questions: [
      'Please provide draft versions and editorial review comments for the sampled articles.',
      'Please share CMS approval history with timestamps for each sampled article.',
      'Were any articles published before final approval?',
      'Please provide correction history for the sampled articles, if any.',
    ] },
  { id: 'rfi-207', subDivision: 'Newspaper / Publishing', scopeId: 'sl-203', scopeTitle: 'Newspaper & Publishing', subScopeId: 'ssl-206', subScopeTitle: 'Print Production & Distribution',
    title: 'Print Runs, Distributor Statements and Circulation Reconciliation',
    description: 'Please provide print run reports, distributor statements, delivery records, returns/unsold reports and monthly circulation reconciliation for the audit period.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Print', 'Circulation', 'Reconciliation'],
    questions: [
      'Please provide printer run reports for the audit period.',
      'Please share distributor statements, delivery records and returns notes.',
      'Please provide monthly circulation reconciliations with variance commentary.',
      'How are variances between printed and accounted-for copies investigated?',
    ] },

  // ── Editorial / Newsroom ─ Editorial Governance & Newsroom (sl-204)
  { id: 'rfi-208', subDivision: 'Editorial / Newsroom', scopeId: 'sl-204', scopeTitle: 'Editorial Governance & Newsroom', subScopeId: 'ssl-207', subScopeTitle: 'Editorial Approval',
    title: 'Editorial Approval Matrix and High-Impact News Approvals',
    description: 'Please provide the editorial approval matrix/policy and evidence of approvals for a sample of high-impact news items across TV, radio, print and digital channels.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Editorial Policy', 'Approval Matrix', 'News'],
    questions: [
      'Please provide the current editorial approval matrix/policy.',
      'Please share approval evidence for the sampled high-impact news items.',
      'Is the approval matrix applied consistently across TV, radio, print and digital?',
      'How are approvals handled for breaking news outside office hours?',
    ] },
  { id: 'rfi-209', subDivision: 'Editorial / Newsroom', scopeId: 'sl-204', scopeTitle: 'Editorial Governance & Newsroom', subScopeId: 'ssl-208', subScopeTitle: 'Fact Checking & Source Verification',
    title: 'Fact-Checking Guidelines and Source-Verification Records',
    description: 'Please provide fact-checking guidelines, source-verification requirements and supporting records for selected published or broadcast stories.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Fact Checking', 'Sources', 'Verification'],
    questions: [
      'Please provide the fact-checking guidelines in force during the audit period.',
      'What are the minimum source-verification requirements before publication?',
      'Please share verification records for the selected stories.',
      'How are anonymous sources approved and documented?',
    ] },
  { id: 'rfi-210', subDivision: 'Editorial / Newsroom', scopeId: 'sl-204', scopeTitle: 'Editorial Governance & Newsroom', subScopeId: 'ssl-209', subScopeTitle: 'Corrections & Retractions',
    title: 'Corrections and Retractions Register',
    description: 'Please provide the corrections/retractions register, related approvals, publication evidence and management review records for the audit period.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Corrections', 'Retractions', 'Register'],
    questions: [
      'Please provide the corrections/retractions register for the audit period.',
      'Who approved each correction or retraction?',
      'Please share publication evidence for each correction notice.',
      'Is the register reviewed by management and how often?',
    ] },

  // ── Content Compliance / Editorial Governance ─ Content Governance & Compliance (sl-205)
  { id: 'rfi-211', subDivision: 'Content Compliance / Editorial Governance', scopeId: 'sl-205', scopeTitle: 'Content Governance & Compliance', subScopeId: 'ssl-210', subScopeTitle: 'Content Review',
    title: 'Content Review Checklists and Compliance Approvals',
    description: 'Please provide content review checklists, compliance approvals and evidence for selected TV programmes, radio segments, articles and digital posts.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Content Standards', 'Compliance Review', 'Checklist'],
    questions: [
      'Please provide the content review checklists used during the audit period.',
      'Please share compliance approval evidence for the selected content items.',
      'Which internal standards and media requirements does the checklist cover?',
      'How are content items that fail review escalated?',
    ] },
  { id: 'rfi-212', subDivision: 'Content Compliance / Editorial Governance', scopeId: 'sl-205', scopeTitle: 'Content Governance & Compliance', subScopeId: 'ssl-211', subScopeTitle: 'Complaints Handling',
    title: 'Content Complaints Register and Investigation Records',
    description: 'Please provide the content complaints register, investigation records, escalation evidence, responses and closure approvals for the audit period.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Complaints', 'Regulator', 'Escalation'],
    questions: [
      'Please provide the content complaints register for the audit period.',
      'Please share investigation records and responses for the sampled complaints.',
      'Which complaints were escalated to the regulator or senior management?',
      'Were complaints closed within the defined timelines?',
    ] },

  // ── Content Acquisition / Legal ─ Content Rights & Intellectual Property (sl-206)
  { id: 'rfi-213', subDivision: 'Content Acquisition / Legal', scopeId: 'sl-206', scopeTitle: 'Content Rights & Intellectual Property', subScopeId: 'ssl-212', subScopeTitle: 'Licensing & Usage Rights',
    title: 'Content Rights Register and Licence Agreements',
    description: 'Please provide the content rights register and underlying licence agreements for selected programmes, music, images, footage and third-party content.',
    category: 'Evidence & Document Requests', priority: 'critical', tags: ['Content Rights', 'Licensing', 'IP'],
    questions: [
      'Please provide the content rights register.',
      'Please share licence agreements for the selected programmes, music, images and footage.',
      'Does the rights register reconcile to executed licence agreements?',
      'How is usage checked against licence terms before airing or publishing?',
    ] },
  { id: 'rfi-214', subDivision: 'Content Acquisition / Legal', scopeId: 'sl-206', scopeTitle: 'Content Rights & Intellectual Property', subScopeId: 'ssl-213', subScopeTitle: 'Licence Expiry & Restrictions',
    title: 'Licence Expiry, Territorial and Platform Restriction Controls',
    description: 'Please provide licence expiry reports, territorial/platform restrictions, renewal alerts and examples of controls preventing unauthorized use.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Licence Expiry', 'Territory', 'Platform'],
    questions: [
      'Please provide licence expiry reports for the audit period.',
      'How are territorial and platform restrictions enforced in the scheduling and OTT systems?',
      'Please share examples of renewal alerts raised.',
      'Was any content used beyond its permitted terms during the period?',
    ] },

  // ── Commercial / Advertising Sales ─ Advertising & Commercial Revenue (sl-207)
  { id: 'rfi-215', subDivision: 'Commercial / Advertising Sales', scopeId: 'sl-207', scopeTitle: 'Advertising & Commercial Revenue', subScopeId: 'ssl-214', subScopeTitle: 'Ad Booking to Broadcast/Publication',
    title: 'Ad Booking Orders, Proof-of-Airing and Invoices',
    description: 'Please provide advertising booking orders, contracts, schedules, proof-of-airing/publication, invoices and collection status for selected samples across TV, radio, print and digital.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Advertising', 'Proof of Airing', 'Billing'],
    questions: [
      'Please provide booking orders and contracts for the selected samples.',
      'Please share proof-of-airing/publication for each sample.',
      'Please provide invoices and collection status for each sample.',
      'How are make-goods for pre-empted spots recorded and billed?',
    ] },
  { id: 'rfi-216', subDivision: 'Commercial / Advertising Sales', scopeId: 'sl-207', scopeTitle: 'Advertising & Commercial Revenue', subScopeId: 'ssl-215', subScopeTitle: 'Rate Cards & Discounts',
    title: 'Rate Cards, Discount Authority Matrix and Transaction Listing',
    description: 'Please provide approved rate cards, discount authority matrix, exception approvals and a transaction listing with customer, gross rate, discount and net value.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Rate Card', 'Discounts', 'Authority Matrix'],
    questions: [
      'Please provide the approved rate cards in force during the audit period.',
      'Please share the discount authority matrix.',
      'Please provide approvals for discounts above tier limits.',
      'Please provide a transaction listing with customer, gross rate, discount and net value.',
    ] },
  { id: 'rfi-217', subDivision: 'Commercial / Advertising Sales', scopeId: 'sl-207', scopeTitle: 'Advertising & Commercial Revenue', subScopeId: 'ssl-216', subScopeTitle: 'Revenue Completeness',
    title: 'Full Broadcast/Publication Logs and Advertising Billing Data',
    description: 'Please provide full broadcast/publication logs and advertising billing data for the same period to support completeness reconciliation.',
    category: 'System & IT Logic Inquiries', priority: 'critical', tags: ['Revenue Leakage', 'Completeness', 'Reconciliation'],
    questions: [
      'Please provide full as-run/publication logs with booking references.',
      'Please provide advertising billing data for the same period.',
      'Is there a month-end control matching aired spots to billed spots?',
      'How are bonus spots, barter and make-goods identified in billing data?',
    ] },

  // ── Commercial / Partnerships ─ Sponsorship & Commercial Partnerships (sl-208)
  { id: 'rfi-218', subDivision: 'Commercial / Partnerships', scopeId: 'sl-208', scopeTitle: 'Sponsorship & Commercial Partnerships', subScopeId: 'ssl-217', subScopeTitle: 'Contractual Obligations',
    title: 'Sponsorship Agreements, Deliverables Trackers and Invoices',
    description: 'Please provide sponsorship agreements, deliverables trackers, evidence of delivered benefits, invoices and outstanding obligations for selected arrangements.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Sponsorship', 'Deliverables', 'Contracts'],
    questions: [
      'Please provide signed sponsorship agreements for the selected arrangements.',
      'Please share deliverables trackers with proof of delivered benefits.',
      'Please provide invoices raised under each arrangement.',
      'How are undelivered benefits and outstanding obligations settled?',
    ] },

  // ── Circulation / Subscription ─ Subscription & Circulation (sl-209)
  { id: 'rfi-219', subDivision: 'Circulation / Subscription', scopeId: 'sl-209', scopeTitle: 'Subscription & Circulation', subScopeId: 'ssl-218', subScopeTitle: 'Subscription Revenue',
    title: 'Subscriber Master Data, Invoices and Cancellations',
    description: 'Please provide active subscriber master data, subscription plans, invoices, receipts, complimentary subscriptions and cancellation reports.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Subscription', 'Billing', 'Complimentary'],
    questions: [
      'Please provide active subscriber master data and subscription plans.',
      'Please share invoices and receipts for the audit period.',
      'Who approves complimentary subscriptions and how are they tracked?',
      'Please provide cancellation reports and refund approvals.',
    ] },

  // ── Digital Media / Technology ─ Digital Media & OTT Platforms (sl-210)
  { id: 'rfi-220', subDivision: 'Digital Media / Technology', scopeId: 'sl-210', scopeTitle: 'Digital Media & OTT Platforms', subScopeId: 'ssl-219', subScopeTitle: 'Publishing Access',
    title: 'CMS, Website, App and Streaming Platform Access Listings',
    description: 'Please provide current user access listings for CMS, website, mobile app and streaming platforms, including roles, privileges and recent access review evidence.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['CMS', 'OTT', 'Privileged Access'],
    questions: [
      'Please provide user access listings with roles for CMS, website, app and streaming platforms.',
      'Which users hold publishing or admin privileges?',
      'Please share the most recent access review evidence.',
      'Are shared or generic accounts in use on any platform?',
    ] },
  { id: 'rfi-221', subDivision: 'Digital Media / Technology', scopeId: 'sl-210', scopeTitle: 'Digital Media & OTT Platforms', subScopeId: 'ssl-220', subScopeTitle: 'Availability & Change Management',
    title: 'Digital Platform Uptime, Incidents and Change Records',
    description: 'Please provide digital platform uptime reports, incident records, change requests, release approvals, testing evidence and emergency change logs.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Uptime', 'Change Management', 'Releases'],
    questions: [
      'Please provide uptime reports for the digital platforms.',
      'Please share incident records for outages during the audit period.',
      'Please provide change requests, release approvals and testing evidence for major releases.',
      'Please provide the emergency change log with retrospective approvals.',
    ] },

  // ── Digital / Corporate Communications ─ Social Media Governance (sl-211)
  { id: 'rfi-222', subDivision: 'Digital / Corporate Communications', scopeId: 'sl-211', scopeTitle: 'Social Media Governance', subScopeId: 'ssl-221', subScopeTitle: 'Account Security',
    title: 'Official Social Media Account Inventory and MFA Status',
    description: 'Please provide the inventory of official social media accounts, account owners, administrators, MFA status and latest access review evidence.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Social Media', 'MFA', 'Account Security'],
    questions: [
      'Please provide the inventory of official social media accounts and owners.',
      'Who holds administrator access on each account?',
      'Is MFA enabled on every official account?',
      'Please share the latest access review evidence.',
    ] },
  { id: 'rfi-223', subDivision: 'Digital / Corporate Communications', scopeId: 'sl-211', scopeTitle: 'Social Media Governance', subScopeId: 'ssl-222', subScopeTitle: 'Posting & Approval',
    title: 'Social Media Governance Policy and Post Approvals',
    description: 'Please provide social media governance policy and approval evidence for selected corporate/high-impact posts during the audit period.',
    category: 'Policy & Compliance Verification', priority: 'medium', tags: ['Social Media Policy', 'Approvals', 'Posts'],
    questions: [
      'Please provide the social media governance policy.',
      'Please share approval evidence for the selected high-impact posts.',
      'Which post types require senior approval before publishing?',
      'How are unauthorized or erroneous posts removed and reported?',
    ] },

  // ── Information Technology / Information Security ─ Cybersecurity (sl-212)
  { id: 'rfi-224', subDivision: 'Information Technology / Information Security', scopeId: 'sl-212', scopeTitle: 'Cybersecurity', subScopeId: 'ssl-223', subScopeTitle: 'Identity & Access Management',
    title: 'Privileged Users, Joiner/Mover/Leaver Records and Access Reviews',
    description: 'Please provide privileged-user listings, joiner/mover/leaver records and latest access review results for critical broadcast, newsroom and corporate systems.',
    category: 'System & IT Logic Inquiries', priority: 'critical', tags: ['IAM', 'Privileged Access', 'JML'],
    questions: [
      'Please provide privileged-user listings for critical broadcast, newsroom and corporate systems.',
      'Please share joiner/mover/leaver records for the audit period.',
      'Please provide the latest access review results and remediation.',
      'How are HR leaver records reconciled with active accounts?',
    ] },
  { id: 'rfi-225', subDivision: 'Information Technology / Information Security', scopeId: 'sl-212', scopeTitle: 'Cybersecurity', subScopeId: 'ssl-224', subScopeTitle: 'Vulnerability & Incident Management',
    title: 'Vulnerability Assessments, Remediation Tracker and Cyber Incidents',
    description: 'Please provide latest vulnerability assessment reports, remediation tracker, cybersecurity incident register, root-cause analysis and closure evidence.',
    category: 'Evidence & Document Requests', priority: 'critical', tags: ['Vulnerability', 'Cyber Incident', 'Remediation'],
    questions: [
      'Please provide the latest vulnerability assessment reports.',
      'Please share the remediation tracker with ageing of open items.',
      'Please provide the cybersecurity incident register and RCAs.',
      'Were critical vulnerabilities remediated within the defined SLA?',
    ] },

  // ── Business Continuity / IT / Operations ─ Business Continuity & Disaster Recovery (sl-213)
  { id: 'rfi-226', subDivision: 'Business Continuity / IT / Operations', scopeId: 'sl-213', scopeTitle: 'Business Continuity & Disaster Recovery', subScopeId: 'ssl-225', subScopeTitle: 'Broadcast Continuity',
    title: 'TV/Radio BCP, Alternate Site Arrangements and Continuity Tests',
    description: 'Please provide BCP documents for TV/radio operations, alternate site/studio arrangements, latest continuity test reports, issues and remediation actions.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['BCP', 'Alternate Site', 'Continuity Test'],
    questions: [
      'Please provide the BCP documents for TV and radio operations.',
      'Please share alternate site/studio arrangements and readiness evidence.',
      'Please provide the latest continuity test reports.',
      'Were issues from the last test remediated?',
    ] },
  { id: 'rfi-227', subDivision: 'Business Continuity / IT / Operations', scopeId: 'sl-213', scopeTitle: 'Business Continuity & Disaster Recovery', subScopeId: 'ssl-226', subScopeTitle: 'IT Disaster Recovery',
    title: 'DR Plans, RTO/RPO and Restoration Testing',
    description: 'Please provide DR plans, critical system list, approved RTO/RPO, latest DR test results and backup restoration test evidence.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Disaster Recovery', 'RTO/RPO', 'Backup'],
    questions: [
      'Please provide the DR plans and the critical system list.',
      'Please share approved RTO/RPO for each critical system.',
      'Please provide the latest DR test results.',
      'Please provide backup restoration test evidence.',
    ] },

  // ── Operations / Asset Management ─ Media Asset Management (sl-214)
  { id: 'rfi-228', subDivision: 'Operations / Asset Management', scopeId: 'sl-214', scopeTitle: 'Media Asset Management', subScopeId: 'ssl-227', subScopeTitle: 'Asset Custody',
    title: 'Fixed / Media Asset Register',
    description: 'Please provide the fixed/media asset register including asset tag, description, location, custodian, acquisition date, status and last verification date.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Asset Register', 'Custody', 'Verification'],
    questions: [
      'Please provide the fixed/media asset register.',
      'When was the last physical verification performed?',
      'How are assets issued to crews for outside broadcasts tracked?',
      'How are missing or damaged assets reported and approved for write-off?',
    ] },
  { id: 'rfi-229', subDivision: 'Operations / Asset Management', scopeId: 'sl-214', scopeTitle: 'Media Asset Management', subScopeId: 'ssl-228', subScopeTitle: 'Maintenance & Disposal',
    title: 'Asset Maintenance Schedules and Disposal Approvals',
    description: 'Please provide maintenance schedules, service records, obsolete asset list, disposal approvals and disposal certificates for the audit period.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Maintenance', 'Disposal', 'Obsolete Assets'],
    questions: [
      'Please provide maintenance schedules and service records.',
      'Please share the obsolete asset list.',
      'Please provide disposal approvals and certificates.',
      'How are disposal proceeds recorded?',
    ] },

  // ── Content Production ─ Production Management (sl-215)
  { id: 'rfi-230', subDivision: 'Content Production', scopeId: 'sl-215', scopeTitle: 'Production Management', subScopeId: 'ssl-229', subScopeTitle: 'Production Budgeting',
    title: 'Production Budgets, Actual Costs and Variance Analysis',
    description: 'Please provide approved production budgets, actual cost reports, variance analysis and approvals for selected programmes/productions.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Production Budget', 'Variance', 'Cost Control'],
    questions: [
      'Please provide approved budgets for the selected productions.',
      'Please share actual cost reports for the same productions.',
      'Please provide variance analysis and approvals for overruns.',
      'Who approves budget revisions during production?',
    ] },
  { id: 'rfi-231', subDivision: 'Content Production', scopeId: 'sl-215', scopeTitle: 'Production Management', subScopeId: 'ssl-230', subScopeTitle: 'External Crew & Vendors',
    title: 'Freelancer, Crew and Production Vendor Contracts and Payments',
    description: 'Please provide contracts, engagement approvals, attendance/deliverables, invoices and payment records for selected freelancers, crew members and production vendors.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Freelancers', 'Crew', 'Vendors'],
    questions: [
      'Please provide contracts and engagement approvals for the selected freelancers and vendors.',
      'Please share attendance or deliverables evidence.',
      'Please provide invoices and payment records.',
      'Are rates paid consistent with the approved rate schedule?',
    ] },

  // ── Finance ─ Finance & Financial Reporting (sl-216)
  { id: 'rfi-232', subDivision: 'Finance', scopeId: 'sl-216', scopeTitle: 'Finance & Financial Reporting', subScopeId: 'ssl-231', subScopeTitle: 'Revenue & Receivables',
    title: 'Revenue GL Detail, Customer Ageing, Credit Notes and Write-offs',
    description: 'Please provide revenue GL details, customer ageing, credit notes, write-offs and monthly revenue reconciliation for the audit period.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Revenue', 'Receivables', 'Credit Notes'],
    questions: [
      'Please provide revenue GL detail for the audit period.',
      'Please share the customer ageing report.',
      'Please provide credit notes and write-offs with approvals.',
      'Please provide monthly revenue reconciliations with reviewer sign-off.',
    ] },
  { id: 'rfi-233', subDivision: 'Finance', scopeId: 'sl-216', scopeTitle: 'Finance & Financial Reporting', subScopeId: 'ssl-232', subScopeTitle: 'General Ledger & Close',
    title: 'Month-End Close Checklists, Reconciliations and Manual Journals',
    description: 'Please provide month-end close checklists, key account reconciliations, manual journal listing and supporting approvals for selected months.',
    category: 'Process & Control Walkthroughs', priority: 'high', tags: ['Month-End Close', 'Reconciliations', 'Journals'],
    questions: [
      'Please provide signed month-end close checklists for the selected months.',
      'Please share key account reconciliations with review evidence.',
      'Please provide the full manual journal listing with approvals.',
      'Is maker-checker enforced for manual journals in the ERP?',
    ] },

  // ── Procurement / Supply Chain ─ Procurement & Vendor Management (sl-217)
  { id: 'rfi-234', subDivision: 'Procurement / Supply Chain', scopeId: 'sl-217', scopeTitle: 'Procurement & Vendor Management', subScopeId: 'ssl-233', subScopeTitle: 'Sourcing & Tendering',
    title: 'Procurement Policy, Tender Records and Approvals',
    description: 'Please provide procurement policy, tender/quotation records, bid evaluations, approvals, POs and contracts for selected procurements.',
    category: 'Policy & Compliance Verification', priority: 'medium', tags: ['Procurement', 'Tendering', 'Bid Evaluation'],
    questions: [
      'Please provide the procurement policy.',
      'Please share tender/quotation records and bid evaluations for the selected procurements.',
      'Please provide approvals, POs and contracts.',
      'Were any single-source procurements justified and approved?',
    ] },
  { id: 'rfi-235', subDivision: 'Procurement / Supply Chain', scopeId: 'sl-217', scopeTitle: 'Procurement & Vendor Management', subScopeId: 'ssl-234', subScopeTitle: 'Vendor Due Diligence',
    title: 'Vendor Master, Onboarding and Due Diligence Records',
    description: 'Please provide vendor master data, onboarding forms, due diligence, conflict declarations and approval records for vendors added during the audit period.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Vendor Master', 'Due Diligence', 'Conflict of Interest'],
    questions: [
      'Please provide vendor master data for vendors added during the period.',
      'Please share onboarding forms and due diligence records.',
      'Please provide conflict-of-interest declarations.',
      'Who approves vendor master changes such as bank details?',
    ] },

  // ── Legal / Contract Management ─ Contract Management (sl-218)
  { id: 'rfi-236', subDivision: 'Legal / Contract Management', scopeId: 'sl-218', scopeTitle: 'Contract Management', subScopeId: 'ssl-235', subScopeTitle: 'Contract Lifecycle',
    title: 'Contract Register and Executed Agreements',
    description: 'Please provide the complete contract register showing owner, type, value, start/end dates, renewal terms and status, together with selected executed agreements.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Contract Register', 'Renewals', 'Obligations'],
    questions: [
      'Please provide the complete contract register.',
      'Please share the selected executed agreements.',
      'How are upcoming expiries and renewals monitored?',
      'Were any contracts operating after expiry during the period?',
    ] },

  // ── Human Resources ─ Human Resources & Payroll (sl-219)
  { id: 'rfi-237', subDivision: 'Human Resources', scopeId: 'sl-219', scopeTitle: 'Human Resources & Payroll', subScopeId: 'ssl-236', subScopeTitle: 'Payroll & Allowances',
    title: 'Payroll Register, Salary Changes and Allowances',
    description: 'Please provide payroll register, employee master, salary change approvals, overtime/allowance details and bank transfer summary for selected months.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Payroll', 'Allowances', 'Salary Changes'],
    questions: [
      'Please provide the payroll register and employee master for the selected months.',
      'Please share salary change approvals.',
      'Please provide overtime and allowance details with approvals.',
      'Does the bank transfer summary reconcile to net payroll?',
    ] },
  { id: 'rfi-238', subDivision: 'Human Resources', scopeId: 'sl-219', scopeTitle: 'Human Resources & Payroll', subScopeId: 'ssl-237', subScopeTitle: 'Freelancers & Talent',
    title: 'Freelancer / Talent Master List, Contracts and Payments',
    description: 'Please provide freelancer/talent master list, contracts, approved rates, deliverable/attendance evidence and payments for selected individuals.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Talent', 'Presenters', 'Freelancers'],
    questions: [
      'Please provide the freelancer/talent master list.',
      'Please share contracts and approved rates for the selected individuals.',
      'Please provide deliverable or attendance evidence.',
      'Please provide payment records for the selected individuals.',
    ] },

  // ── Legal / Compliance ─ Legal & Regulatory Compliance (sl-220)
  { id: 'rfi-239', subDivision: 'Legal / Compliance', scopeId: 'sl-220', scopeTitle: 'Legal & Regulatory Compliance', subScopeId: 'ssl-238', subScopeTitle: 'Licences & Regulatory Obligations',
    title: 'Regulatory Obligations Register, Licences and Submissions',
    description: 'Please provide the regulatory obligations register, active licences/permits, renewal calendar and evidence of material regulatory submissions for the audit period.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Regulatory', 'Licences', 'Submissions'],
    questions: [
      'Please provide the regulatory obligations register.',
      'Please share active broadcasting/publishing licences and permits.',
      'Please provide the licence renewal calendar.',
      'Please provide evidence of material regulatory submissions.',
    ] },

  // ── Information Governance / Compliance ─ Data Privacy & Information Governance (sl-221)
  { id: 'rfi-240', subDivision: 'Information Governance / Compliance', scopeId: 'sl-221', scopeTitle: 'Data Privacy & Information Governance', subScopeId: 'ssl-239', subScopeTitle: 'Personal Data Handling',
    title: 'Personal Data Inventory, Retention Schedule and Data-Sharing Agreements',
    description: 'Please provide the personal data inventory/processing register, retention schedule, key privacy procedures and selected data-sharing agreements.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Data Privacy', 'Retention', 'Data Sharing'],
    questions: [
      'Please provide the personal data inventory/processing register.',
      'Please share the data retention schedule.',
      'Please provide key privacy procedures.',
      'Please provide selected data-sharing agreements with third parties.',
    ] },

  // ── Records / Archive Management ─ Records & Media Archive Management (sl-222)
  { id: 'rfi-241', subDivision: 'Records / Archive Management', scopeId: 'sl-222', scopeTitle: 'Records & Media Archive Management', subScopeId: 'ssl-240', subScopeTitle: 'Archive Completeness & Retrieval',
    title: 'Media Archive Inventory, Access Rights and Retrieval Logs',
    description: 'Please provide the media archive inventory, retention rules, access rights and retrieval logs for selected archived content.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Archive', 'Retrieval', 'Metadata'],
    questions: [
      'Please provide the media archive inventory.',
      'Please share archive retention rules.',
      'Please provide access rights to the archive.',
      'Please provide retrieval logs for the selected archived content.',
    ] },

  // ── Corporate Communications / Brand Protection ─ Reputation & Brand Risk (sl-223)
  { id: 'rfi-242', subDivision: 'Corporate Communications / Brand Protection', scopeId: 'sl-223', scopeTitle: 'Reputation & Brand Risk', subScopeId: 'ssl-241', subScopeTitle: 'Negative Media & Brand Monitoring',
    title: 'Negative-Media / Brand Monitoring Reports and Escalations',
    description: 'Please provide negative-media/brand monitoring reports, alert logs, escalation records, incident responses and closure evidence for the audit period.',
    category: 'Evidence & Document Requests', priority: 'high', tags: ['Brand Monitoring', 'Negative Media', 'Crisis Response'],
    questions: [
      'Please provide negative-media/brand monitoring reports.',
      'Please share alert logs and escalation records.',
      'Please provide incident responses and closure evidence.',
      'How are impersonation accounts reported and taken down?',
    ] },

  // ── Risk / Internal Control / Finance ─ Fraud Risk Management (sl-224)
  { id: 'rfi-243', subDivision: 'Risk / Internal Control / Finance', scopeId: 'sl-224', scopeTitle: 'Fraud Risk Management', subScopeId: 'ssl-242', subScopeTitle: 'Fraud Risk Assessment',
    title: 'Fraud Risk Assessment, Control Matrix and Whistleblowing Cases',
    description: 'Please provide the latest fraud risk assessment, fraud control matrix, whistleblowing cases and investigation summary for the audit period.',
    category: 'Policy & Compliance Verification', priority: 'high', tags: ['Fraud Risk', 'Whistleblowing', 'Control Matrix'],
    questions: [
      'Please provide the latest fraud risk assessment.',
      'Please share the fraud control matrix.',
      'Please provide whistleblowing cases received during the period.',
      'Please provide the investigation summary and outcomes.',
    ] },
  { id: 'rfi-244', subDivision: 'Risk / Internal Control / Finance', scopeId: 'sl-224', scopeTitle: 'Fraud Risk Management', subScopeId: 'ssl-243', subScopeTitle: 'Revenue & Vendor Analytics',
    title: 'Vendor, Payment, Discount and Credit Note Data for Analytics',
    description: 'Please provide vendor master, payment transactions, advertising discounts, credit notes and write-offs in Excel format for analytics.',
    category: 'System & IT Logic Inquiries', priority: 'high', tags: ['Data Analytics', 'Duplicate Payments', 'Discounts'],
    questions: [
      'Please provide the vendor master in Excel format.',
      'Please provide payment transactions for the audit period.',
      'Please provide advertising discounts, credit notes and write-offs.',
      'Please confirm the extraction parameters and system source for each file.',
    ] },

  // ── Corporate Governance / Board Secretariat ─ Corporate Governance (sl-225)
  { id: 'rfi-245', subDivision: 'Corporate Governance / Board Secretariat', scopeId: 'sl-225', scopeTitle: 'Corporate Governance', subScopeId: 'ssl-244', subScopeTitle: 'Delegation & Committees',
    title: 'Delegation of Authority, Committee Charters and Minutes',
    description: 'Please provide current delegation of authority, committee charters, selected meeting minutes, action trackers and conflict-of-interest declarations.',
    category: 'Policy & Compliance Verification', priority: 'medium', tags: ['DoA', 'Committees', 'Governance'],
    questions: [
      'Please provide the current delegation of authority.',
      'Please share committee charters.',
      'Please provide selected meeting minutes and action trackers.',
      'Please provide conflict-of-interest declarations for board and committee members.',
    ] },

  // ── Risk Management ─ Enterprise Risk Management (sl-226)
  { id: 'rfi-246', subDivision: 'Risk Management', scopeId: 'sl-226', scopeTitle: 'Enterprise Risk Management', subScopeId: 'ssl-245', subScopeTitle: 'Risk Register & KRIs',
    title: 'Enterprise Risk Register, KRI Library and Breach Reports',
    description: 'Please provide the latest enterprise risk register, KRI library, threshold definitions, breach/near-breach reports and mitigation action tracker.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Risk Register', 'KRI', 'Mitigation'],
    questions: [
      'Please provide the latest enterprise risk register.',
      'Please share the KRI library and threshold definitions.',
      'Please provide breach/near-breach reports.',
      'Please provide the mitigation action tracker.',
    ] },
  { id: 'rfi-247', subDivision: 'Risk Management', scopeId: 'sl-226', scopeTitle: 'Enterprise Risk Management', subScopeId: 'ssl-246', subScopeTitle: 'Risk Assessment & Controls',
    title: 'Risk Assessment Methodology and Control Effectiveness Evidence',
    description: 'Please provide risk assessment methodology, scoring criteria, selected risk assessments, mapped controls and evidence supporting control effectiveness ratings.',
    category: 'Process & Control Walkthroughs', priority: 'medium', tags: ['Risk Methodology', 'Scoring', 'Control Effectiveness'],
    questions: [
      'Please provide the risk assessment methodology and scoring criteria.',
      'Please share the selected risk assessments.',
      'Please provide mapped controls for each assessed risk.',
      'Please provide evidence supporting control effectiveness ratings.',
    ] },

  // ── Procurement / Risk / Vendor Management ─ Third-Party & Outsourcing Risk (sl-227)
  { id: 'rfi-248', subDivision: 'Procurement / Risk / Vendor Management', scopeId: 'sl-227', scopeTitle: 'Third-Party & Outsourcing Risk', subScopeId: 'ssl-247', subScopeTitle: 'Critical Third Parties',
    title: 'Critical Third-Party Register, SLAs and Performance Reviews',
    description: 'Please provide the critical third-party register, due diligence, contracts/SLAs, performance reviews, cybersecurity clauses and business continuity requirements.',
    category: 'Evidence & Document Requests', priority: 'medium', tags: ['Third Party', 'SLA', 'Outsourcing'],
    questions: [
      'Please provide the critical third-party register.',
      'Please share due diligence and contracts/SLAs for critical third parties.',
      'Please provide performance reviews for the audit period.',
      'Do contracts include cybersecurity and business continuity requirements?',
    ] },
];

const RAW_RFI_LIBRARY_XYZ: Omit<RfiLibraryItem, 'status' | 'createdAt'>[] = XYZ_RFI_LIBRARY_SEEDS.map(seed => ({
  ...seed,
  company: 'xyz-broadcast',
  division: 'XYZ-BR-01',
}));

const APPROVED_RFI_SUBMITTERS_XYZ = ['Karim Aziz', 'Nadia Haddad', 'Sultan Al Mazrouei', 'Farah Idris', 'Yousuf Rahman'];

export const MOCK_RFI_LIBRARY_XYZ: RfiLibraryItem[] = RAW_RFI_LIBRARY_XYZ.map((item, i) => ({
  ...item,
  status: (i % 14 === 0 ? 'pending_review' : i % 11 === 0 ? 'rejected' : 'approved') as RfiLibraryStatus,
  createdAt: `2026-${String((i % 8) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}T09:00:00.000Z`,
  submittedBy: i % 14 === 0
    ? 'Omar Khalil'
    : (i % 11 === 0 && i % 14 !== 0)
      ? 'Hana Saeed'
      : APPROVED_RFI_SUBMITTERS_XYZ[i % APPROVED_RFI_SUBMITTERS_XYZ.length],
  ...(i % 14 === 0 ? { submittedDate: '2026-09-15', dueDate: '2026-10-06' } : {}),
  ...(i % 11 === 0 && i % 14 !== 0 ? { submittedDate: '2026-09-08', dueDate: null } : {}),
}));
