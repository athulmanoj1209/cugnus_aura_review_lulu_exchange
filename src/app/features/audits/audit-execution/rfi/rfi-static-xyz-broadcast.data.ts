// Self-contained static RFI data for the XYZ Broadcast internal-audit client —
// same shape, helpers and field set as rfi-static-indi.data.ts (the ABC
// Broadcast internal-audit seed); only the org data differs.
//
// The company/division/sub-division/scope skeleton mirrors the XYZ Broadcast seeds:
//   - company:       Admin/company-static-xyz-broadcast.data.ts (xyz-broadcast)
//   - division:      apps/divisions/division-static-xyz-broadcast.data.ts (XYZ-BR-01 Dubai)
//   - sub-divisions: apps/sub-divisions/sub-division-static-xyz-broadcast.data.ts (5 sub-divisions)
//   - scopes:        audit-plan/scope/audit-scope-static-xyz-org.data.ts
//                    (one top-level scope per sub-division — SC-70NN — with its
//                    sub-scopes SC-70NN-S1.. as flat sibling records keyed by
//                    `parentScopeId`)
//
// RFIs hang off the sub-scopes, one per RFI ID from the Media Company Internal
// Audit plan (RFI-BO-001 .. RFI-FI-002) whose sub-scope is active in the scope
// seed. Top-level scopes carry `rfis: []` so getAllEnrichedRfis() can resolve
// each sub-scope's parent label. Statuses span all 5 `RfiStatus` values;
// 3 of the 4 completed RFIs carry a rejected-round response history, and every
// reopened RFI's history includes the round that was rejected.
//
// Company/division/sub-division/scope OPTION LISTS below read the REAL sources
// (division-static-data.ts / sub-division-static-data.ts / audit-scope-static-data.ts)
// rather than this file's own wrapper arrays, exactly as rfi-static-indi.data.ts does.

import { DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-data';
import { SUB_DIVISION_STATIC_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { AUDIT_SCOPE_STATIC_COMPANIES, findStaticScopeById, findStaticScopeByLibraryId } from '@/app/features/audits/audit-plan/scope/audit-scope-static-data';
import type { StaticScope } from '@/app/features/audits/audit-plan/scope/models/scope-static-data.model';
import {
  RFI_COMPANY_TAG_LENGTH,
  RFI_DEFAULT_COMPANY_COLOR,
  RfiRecordStatuses,
  RfiResponseStatuses,
  RfiStatuses,
} from './constants/rfi.constants';
import type {
  CompanyMeta,
  RfiRecordStatus,
  RfiDoc,
  RfiHistoryEntry,
  StaticRfi,
  RfiStaticScope,
  RfiStaticCompany,
  EnrichedStaticRfi,
} from '@/app/features/audits/audit-execution/rfi/models/rfi-static-data.model';

/**
 * Same company/division/sub-division/scope roster as the XYZ Broadcast seeds
 * (1 company — XYZ Broadcast — 1 division "Dubai", 5 sub-divisions, 5 top-level
 * scopes and their 10 sub-scopes, same ids/names as
 * audit-scope-static-xyz-org.data.ts).
 */
export const RFI_STATIC_XYZ_BROADCAST_COMPANIES: RfiStaticCompany[] = [
  {
    "id": "xyz-broadcast",
    "companyName": "XYZ Broadcast",
    "tag": "XYZ",
    "color": "#6a1b9a",
    "divisions": [
      {
        "divisionCode": "XYZ-BR-01",
        "divisionName": "Dubai",
        "hasSubDivision": true,
        "company": "xyz-broadcast",
        "scopes": [],
        "subDivisions": [
          /* ── D01 Broadcasting / Television Operations ─────────────────── */
          {
            "subDivisionName": "Broadcasting / Television Operations",
            "company": "xyz-broadcast",
            "divisionCode": "XYZ-BR-01",
            "scopes": [
              {
                "id": "SC-7001",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Broadcasting / Television Operations",
                "parentScopeId": null,
                "scopeName": "Broadcasting Operations",
                "rfis": []
              },
              {
                "id": "SC-7001-S1",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Broadcasting / Television Operations",
                "parentScopeId": "SC-7001",
                "scopeName": "Transmission & Playout",
                "rfis": [
                  // RFI-BO-001 — completed, with one rejected round in history
                  {
                    "id": 101,
                    "title": "Broadcast Schedules, Playout Logs and Schedule Changes",
                    "description": "Please provide approved TV broadcast schedules, playout logs, exception logs and evidence of schedule changes for the selected audit period.",
                    "dueDate": "2026-07-15",
                    "ownerValue": "rashid-al-hammadi",
                    "ownerLabel": "Rashid Al Hammadi",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Are daily broadcast schedules formally approved by the Head of Programming before transmission?",
                        "answer": "Yes. Each day's schedule is approved in the scheduling system by the Head of Programming by 18:00 on D-1; the approval audit trail for the sample period is included in the export.",
                        "dueDate": "2026-07-15"
                      },
                      {
                        "question": "How are deviations between the approved schedule and actual playout identified and investigated?",
                        "answer": "Master Control runs an automated as-run vs. schedule comparison every night. Deviations over 60 seconds are logged in the exception log with a cause code and reviewed by the Transmission Manager the following morning.",
                        "dueDate": "2026-07-15"
                      },
                      {
                        "question": "Are last-minute schedule changes (within 24 hours of airing) supported by an approved change request?",
                        "answer": "Yes. All 23 late changes in the audit period have a change request with dual approval (Programming + Transmission). Two breaking-news overrides were approved retrospectively under the emergency procedure, evidenced in the attached register.",
                        "dueDate": "2026-07-15"
                      }
                    ],
                    "auditorIds": ["alice", "bob"],
                    "createdAt": "2026-06-02T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached are the approved daily broadcast schedules for February–April 2026, the full as-run playout logs from the automation system, the exception log with cause codes, and the schedule change request register including the two emergency overrides.",
                      "explanationNotes": "Playout logs are exported directly from the playout automation server and are read-only. The exception log now includes the Transmission Manager's review sign-off for every entry, as requested in the previous round.",
                      "responseDocs": [
                        {
                          "name": "Approved_Broadcast_Schedules_Feb-Apr2026.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Approved daily TV broadcast schedules with approval trail"
                        },
                        {
                          "name": "Playout_AsRun_Logs_Feb-Apr2026.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "As-run playout logs exported from the automation system"
                        },
                        {
                          "name": "Schedule_Change_Register_and_Exceptions.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Schedule change requests, approvals and exception log with review sign-off"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-07-10"
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached are the approved broadcast schedules and playout logs for the audit period.",
                        "explanationNotes": "Exception log to follow once Master Control completes its monthly extraction.",
                        "responseDocs": [
                          {
                            "name": "Broadcast_Schedules_Feb-Apr2026.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Broadcast schedules for the audit period"
                          },
                          {
                            "name": "Playout_Logs_Feb-Apr2026.xlsx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Playout logs for the audit period"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Are daily broadcast schedules formally approved by the Head of Programming before transmission?",
                            "answer": "Yes, schedules are approved before transmission."
                          },
                          {
                            "question": "How are deviations between the approved schedule and actual playout identified and investigated?",
                            "answer": "Deviations are reviewed by Master Control."
                          },
                          {
                            "question": "Are last-minute schedule changes (within 24 hours of airing) supported by an approved change request?",
                            "answer": "Yes."
                          }
                        ],
                        "submittedAt": "2026-06-24",
                        "rejectedAt": "2026-06-30",
                        "rejectionReason": "The exception log and schedule change evidence were not provided, and the schedules do not show who approved them or when. Please provide the approval trail, the exception log with review evidence, and the change request register, then resubmit."
                      }
                    ]
                  },
                  // RFI-BO-002 — under review, resubmitted after one rejected round
                  {
                    "id": 102,
                    "title": "Broadcast Downtime / Incident Register and Root-Cause Analysis",
                    "description": "Please provide the broadcast downtime/incident register, root-cause analysis reports, corrective actions and closure evidence for the audit period.",
                    "dueDate": "2026-09-30",
                    "ownerValue": "rashid-al-hammadi",
                    "ownerLabel": "Rashid Al Hammadi",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Is every on-air interruption above the defined threshold logged in the incident register?",
                        "answer": "Yes. The threshold is any loss of picture or sound over 10 seconds. The register lists 14 incidents for the period and reconciles to the NOC monitoring alarms export attached.",
                        "dueDate": "2026-09-30"
                      },
                      {
                        "question": "Is a root-cause analysis prepared for every Severity 1 and Severity 2 incident?",
                        "answer": "RCAs were completed for all 5 Sev-1/Sev-2 incidents; each RCA is signed off by the Chief Engineer and linked in the register.",
                        "dueDate": "2026-09-30"
                      },
                      {
                        "question": "Are corrective actions tracked to closure with evidence?",
                        "answer": "Corrective actions are tracked in the engineering action tracker. 11 of 12 are closed with evidence; the remaining one (UPS replacement in Studio B) is scheduled for October 2026 with an approved interim workaround.",
                        "dueDate": "2026-09-30"
                      }
                    ],
                    "auditorIds": ["carol", "david", "bob"],
                    "createdAt": "2026-07-20T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Resubmitting with the complete incident register reconciled to NOC monitoring alarms, all five signed RCA reports, and the corrective action tracker with closure evidence.",
                      "explanationNotes": "The two incidents missing from the first submission were logged against the radio NOC queue in error; they have been moved to the TV register and the reconciliation is attached.",
                      "responseDocs": [
                        {
                          "name": "Broadcast_Incident_Register_FY2026.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Downtime/incident register reconciled to NOC alarms"
                        },
                        {
                          "name": "RCA_Reports_Sev1-Sev2.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Signed root-cause analysis reports for Sev-1/Sev-2 incidents"
                        },
                        {
                          "name": "Engineering_Corrective_Action_Tracker.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Corrective actions with owners, due dates and closure evidence"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-09-18"
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached is the broadcast incident register for the audit period along with the RCA reports.",
                        "explanationNotes": "Corrective action tracker is maintained by Engineering and will be shared separately.",
                        "responseDocs": [
                          {
                            "name": "Incident_Register_FY2026.xlsx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Incident register for the audit period"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Is every on-air interruption above the defined threshold logged in the incident register?",
                            "answer": "Yes, all incidents are logged."
                          },
                          {
                            "question": "Is a root-cause analysis prepared for every Severity 1 and Severity 2 incident?",
                            "answer": "Yes."
                          },
                          {
                            "question": "Are corrective actions tracked to closure with evidence?",
                            "answer": "Engineering tracks corrective actions."
                          }
                        ],
                        "submittedAt": "2026-08-20",
                        "rejectedAt": "2026-08-28",
                        "rejectionReason": "The register lists 12 incidents but NOC monitoring shows 14 alarms above threshold, RCA reports were not attached, and no corrective action evidence was provided. Please reconcile the register, attach the RCAs and the action tracker, then resubmit."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "SC-7001-S2",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Broadcasting / Television Operations",
                "parentScopeId": "SC-7001",
                "scopeName": "Studio & Control Room Access",
                "rfis": [
                  // RFI-BO-003 — pending
                  {
                    "id": 103,
                    "title": "Studio, Master Control Room and Broadcast System Access Lists",
                    "description": "Please provide current user/access lists for studios, master control rooms and critical broadcast systems, including recent access review evidence.",
                    "dueDate": "2026-10-15",
                    "ownerValue": "rashid-al-hammadi",
                    "ownerLabel": "Rashid Al Hammadi",
                    "status": "pending",
                    "questionnaire": [
                      {
                        "question": "Who owns and approves physical access to studios and the master control room?",
                        "dueDate": "2026-10-15"
                      },
                      {
                        "question": "When was the last user access review performed for playout, automation and newsroom systems?",
                        "dueDate": "2026-10-15"
                      },
                      {
                        "question": "Are leavers' access cards and system accounts disabled on their last working day?",
                        "dueDate": "2026-10-15"
                      }
                    ],
                    "auditorIds": ["emma", "felix", "bob"],
                    "createdAt": "2026-09-10T08:00:00.000Z",
                    "recordStatus": "active"
                  }
                ]
              }
            ]
          },
          /* ── D03 Newspaper / Publishing ──────────────────────────────── */
          {
            "subDivisionName": "Newspaper / Publishing",
            "company": "xyz-broadcast",
            "divisionCode": "XYZ-BR-01",
            "scopes": [
              {
                "id": "SC-7003",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Newspaper / Publishing",
                "parentScopeId": null,
                "scopeName": "Newspaper & Publishing",
                "rfis": []
              },
              {
                "id": "SC-7003-S1",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Newspaper / Publishing",
                "parentScopeId": "SC-7003",
                "scopeName": "Editorial-to-Publication Workflow",
                "rfis": [
                  // RFI-NP-001 — completed, with two rejected rounds in history
                  {
                    "id": 104,
                    "title": "Published Article Sample with Drafts, Editorial Approvals and Corrections",
                    "description": "Please provide a sample of published articles with draft versions, editorial review comments, approvals, publication timestamps and correction history, if any.",
                    "dueDate": "2026-06-30",
                    "ownerValue": "layla-haddad",
                    "ownerLabel": "Layla Haddad",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Does every published article pass through sub-editor review and section editor approval in the CMS?",
                        "answer": "Yes. The CMS workflow enforces Draft → Sub-edit → Section Editor Approval → Publish; an article cannot be published without the approval state. Workflow history for all 25 sampled articles is attached.",
                        "dueDate": "2026-06-30"
                      },
                      {
                        "question": "Are publication timestamps later than the final approval timestamp for all sampled articles?",
                        "answer": "Yes for 24 of 25. One article was published 4 minutes before approval during a CMS outage; it was approved retrospectively by the Managing Editor and is documented in the attached exception memo.",
                        "dueDate": "2026-06-30"
                      },
                      {
                        "question": "Were corrections to published articles logged and approved?",
                        "answer": "Three of the sampled articles were corrected after publication. Each correction is in the corrections log with the approving editor, reason and correction notice text.",
                        "dueDate": "2026-06-30"
                      }
                    ],
                    "auditorIds": ["grace", "henry"],
                    "createdAt": "2026-05-12T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached is the full evidence pack for the 25 sampled articles: draft versions, sub-editor comments, CMS approval history with timestamps, publication timestamps, and the corrections log extract, plus an exception memo for the one out-of-sequence publication.",
                      "explanationNotes": "CMS workflow history exports are system-generated PDFs. The sample list matches the auditor's selection sheet exactly (article IDs cross-referenced in tab 1 of the index).",
                      "responseDocs": [
                        {
                          "name": "Article_Sample_Evidence_Pack.zip",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Drafts, review comments and CMS workflow history for 25 sampled articles"
                        },
                        {
                          "name": "Article_Sample_Index.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Index mapping auditor's sample to evidence, with approval and publication timestamps"
                        },
                        {
                          "name": "Corrections_Log_Extract_and_Exception_Memo.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Corrections log extract and Managing Editor exception memo"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-06-26"
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached are the published versions of the sampled articles.",
                        "explanationNotes": "Drafts are retained in the CMS and can be viewed on request.",
                        "responseDocs": [
                          {
                            "name": "Published_Articles_Sample.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Published versions of sampled articles"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Does every published article pass through sub-editor review and section editor approval in the CMS?",
                            "answer": "Yes."
                          },
                          {
                            "question": "Are publication timestamps later than the final approval timestamp for all sampled articles?",
                            "answer": "Yes."
                          },
                          {
                            "question": "Were corrections to published articles logged and approved?",
                            "answer": "Corrections are handled by the desk."
                          }
                        ],
                        "submittedAt": "2026-05-28",
                        "rejectedAt": "2026-06-03",
                        "rejectionReason": "Only final published versions were provided. The request requires drafts, review comments, approval evidence and timestamps. Please provide the CMS workflow history for each sampled article."
                      },
                      {
                        "responseText": "Attached are the CMS workflow history exports and drafts for the sampled articles.",
                        "explanationNotes": "Corrections log is being extracted by the Standards desk.",
                        "responseDocs": [
                          {
                            "name": "CMS_Workflow_History_Sample.zip",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "CMS workflow history and drafts for sampled articles"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Does every published article pass through sub-editor review and section editor approval in the CMS?",
                            "answer": "Yes. The CMS workflow enforces sub-edit and section editor approval before publishing."
                          },
                          {
                            "question": "Are publication timestamps later than the final approval timestamp for all sampled articles?",
                            "answer": "Yes, based on the workflow history."
                          },
                          {
                            "question": "Were corrections to published articles logged and approved?",
                            "answer": "To follow with the corrections log."
                          }
                        ],
                        "submittedAt": "2026-06-12",
                        "rejectedAt": "2026-06-18",
                        "rejectionReason": "Article ART-2026-0417 shows publication before approval and no explanation was given; 4 of the 25 sampled articles are missing; the corrections log was not provided. Please complete the sample, explain the exception and attach the corrections log."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "SC-7003-S2",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Newspaper / Publishing",
                "parentScopeId": "SC-7003",
                "scopeName": "Print Production & Distribution",
                "rfis": [
                  // RFI-NP-002 — under review, first submission
                  {
                    "id": 105,
                    "title": "Print Runs, Distributor Statements and Circulation Reconciliation",
                    "description": "Please provide print run reports, distributor statements, delivery records, returns/unsold reports and monthly circulation reconciliation for the audit period.",
                    "dueDate": "2026-10-05",
                    "ownerValue": "layla-haddad",
                    "ownerLabel": "Layla Haddad",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Is a monthly reconciliation performed between print quantities and distributed, returned and unsold copies?",
                        "answer": "Yes. The Circulation Controller prepares the reconciliation by the 7th working day of each month; it is reviewed by the Publishing Finance Manager. Reconciliations for February–April are attached.",
                        "dueDate": "2026-10-05"
                      },
                      {
                        "question": "How are variances between printed and accounted-for copies investigated?",
                        "answer": "Variances above 0.5% of the print run are investigated with the printer and distributor. March showed a 0.8% variance, traced to a damaged pallet claim that was credited by the printer (credit note attached).",
                        "dueDate": "2026-10-05"
                      },
                      {
                        "question": "Are distributor returns physically verified before credit is issued?",
                        "answer": "Returns are counted at the warehouse by the circulation team and signed by the distributor's driver; credit is issued only against the signed returns note.",
                        "dueDate": "2026-10-05"
                      }
                    ],
                    "auditorIds": ["irene", "james"],
                    "createdAt": "2026-08-03T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached are the printer's run reports, distributor statements, delivery notes, signed returns notes, unsold copy reports and the monthly circulation reconciliations for February–April 2026.",
                      "explanationNotes": "The March variance of 0.8% is explained in the reconciliation commentary and supported by the printer's credit note CN-PR-2026-031.",
                      "responseDocs": [
                        {
                          "name": "Print_Run_Reports_Feb-Apr2026.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Printer run reports for the audit period"
                        },
                        {
                          "name": "Distributor_Statements_and_Returns.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Distributor statements, delivery notes and signed returns notes"
                        },
                        {
                          "name": "Monthly_Circulation_Reconciliation.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Monthly print-to-distribution reconciliation with variance commentary"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-09-20"
                    }
                  }
                ]
              }
            ]
          },
          /* ── D07 Commercial / Advertising Sales ──────────────────────── */
          {
            "subDivisionName": "Commercial / Advertising Sales",
            "company": "xyz-broadcast",
            "divisionCode": "XYZ-BR-01",
            "scopes": [
              {
                "id": "SC-7007",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Advertising Sales",
                "parentScopeId": null,
                "scopeName": "Advertising & Commercial Revenue",
                "rfis": []
              },
              {
                "id": "SC-7007-S1",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Advertising Sales",
                "parentScopeId": "SC-7007",
                "scopeName": "Ad Booking to Broadcast/Publication",
                "rfis": [
                  // RFI-AR-001 — completed, accepted on first submission
                  {
                    "id": 106,
                    "title": "Ad Booking Orders, Proof-of-Airing and Invoices for Selected Samples",
                    "description": "Please provide advertising booking orders, contracts, schedules, proof-of-airing/publication, invoices and collection status for selected samples across TV, radio, print and digital.",
                    "dueDate": "2026-05-20",
                    "ownerValue": "faisal-qureshi",
                    "ownerLabel": "Faisal Qureshi",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Is every sampled booking supported by a signed insertion order or contract?",
                        "answer": "Yes. All 30 sampled bookings have a signed insertion order; 12 are also covered by annual agency contracts, which are attached.",
                        "dueDate": "2026-05-20"
                      },
                      {
                        "question": "Does proof-of-airing/publication agree to the booked schedule for each sample?",
                        "answer": "Yes. As-run certificates (TV/radio), tear sheets (print) and ad-server delivery reports (digital) agree to the booked spots/impressions. Two TV spots were make-goods for pre-empted airings and are flagged in the index.",
                        "dueDate": "2026-05-20"
                      },
                      {
                        "question": "Were invoices raised in the month of airing/publication and what is their collection status?",
                        "answer": "All 30 invoices were raised in the airing month. 27 are collected in full; 3 are within agreed 60-day credit terms and not yet due.",
                        "dueDate": "2026-05-20"
                      }
                    ],
                    "auditorIds": ["karen", "liam"],
                    "createdAt": "2026-04-06T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached is the booking-to-cash evidence pack for all 30 sampled advertising bookings across TV, radio, print and digital: insertion orders and contracts, booked schedules, proof-of-airing/publication, invoices and receipts.",
                      "explanationNotes": "The index workbook maps each sample to its evidence and notes the two make-good spots and the three open invoices within terms.",
                      "responseDocs": [
                        {
                          "name": "Ad_Booking_Sample_Index.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Sample index with booking, airing, invoice and collection references"
                        },
                        {
                          "name": "Insertion_Orders_and_Contracts.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Signed insertion orders and agency contracts"
                        },
                        {
                          "name": "Proof_of_Airing_and_Publication.zip",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "As-run certificates, tear sheets and ad-server delivery reports"
                        },
                        {
                          "name": "Invoices_and_Receipts.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Invoices and collection evidence for sampled bookings"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-05-14"
                    }
                  }
                ]
              },
              {
                "id": "SC-7007-S2",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Advertising Sales",
                "parentScopeId": "SC-7007",
                "scopeName": "Rate Cards & Discounts",
                "rfis": [
                  // RFI-AR-002 — reopened, current response rejected
                  {
                    "id": 107,
                    "title": "Rate Cards, Discount Authority Matrix and Transaction Listing",
                    "description": "Please provide approved rate cards, discount authority matrix, exception approvals and a transaction listing with customer, gross rate, discount and net value.",
                    "dueDate": "2026-08-31",
                    "ownerValue": "faisal-qureshi",
                    "ownerLabel": "Faisal Qureshi",
                    "status": "reopened",
                    "questionnaire": [
                      {
                        "question": "Were the rate cards in force during the audit period approved by the CCO and CFO?",
                        "answer": "The 2026 rate card was approved by the CCO on 15 December 2025. CFO approval is recorded in the Commercial Committee minutes.",
                        "dueDate": "2026-08-31"
                      },
                      {
                        "question": "Do discounts above each sales tier's limit have documented approval from the next authority level?",
                        "answer": "Discounts above tier limits are approved by the Sales Director via email.",
                        "dueDate": "2026-08-31"
                      },
                      {
                        "question": "Does the transaction listing include all advertising revenue transactions for the period?",
                        "answer": "The listing is extracted from the ad-sales system for TV and radio.",
                        "dueDate": "2026-08-31"
                      }
                    ],
                    "auditorIds": ["mia", "alice"],
                    "createdAt": "2026-07-01T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached are the 2026 rate cards, the discount authority matrix, the exception approval emails and the advertising transaction listing for the period.",
                      "explanationNotes": "The transaction listing is extracted from the ad-sales system and includes gross rate, discount % and net value per booking.",
                      "responseDocs": [
                        {
                          "name": "Rate_Card_2026_Approved.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Approved 2026 advertising rate cards"
                        },
                        {
                          "name": "Discount_Authority_Matrix.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Discount authority limits by sales tier"
                        },
                        {
                          "name": "Ad_Transaction_Listing_Feb-Apr2026.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Transaction listing with customer, gross rate, discount and net value"
                        }
                      ],
                      "status": "rejected",
                      "submittedAt": "2026-08-19",
                      "rejectedAt": "2026-09-02",
                      "rejectionReason": "The transaction listing excludes print and digital bookings and does not reconcile to advertising revenue in the GL. 9 transactions exceed the tier discount limit but only 4 approval emails were provided. Please provide a complete listing reconciled to the GL, approvals for all 9 exceptions, and the Commercial Committee minutes evidencing CFO approval of the rate card."
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached are the 2026 rate cards, the discount authority matrix, the exception approval emails and the advertising transaction listing for the period.",
                        "explanationNotes": "The transaction listing is extracted from the ad-sales system and includes gross rate, discount % and net value per booking.",
                        "responseDocs": [
                          {
                            "name": "Rate_Card_2026_Approved.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Approved 2026 advertising rate cards"
                          },
                          {
                            "name": "Discount_Authority_Matrix.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Discount authority limits by sales tier"
                          },
                          {
                            "name": "Ad_Transaction_Listing_Feb-Apr2026.xlsx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Transaction listing with customer, gross rate, discount and net value"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Were the rate cards in force during the audit period approved by the CCO and CFO?",
                            "answer": "The 2026 rate card was approved by the CCO on 15 December 2025. CFO approval is recorded in the Commercial Committee minutes."
                          },
                          {
                            "question": "Do discounts above each sales tier's limit have documented approval from the next authority level?",
                            "answer": "Discounts above tier limits are approved by the Sales Director via email."
                          },
                          {
                            "question": "Does the transaction listing include all advertising revenue transactions for the period?",
                            "answer": "The listing is extracted from the ad-sales system for TV and radio."
                          }
                        ],
                        "submittedAt": "2026-08-19",
                        "rejectedAt": "2026-09-02",
                        "rejectionReason": "The transaction listing excludes print and digital bookings and does not reconcile to advertising revenue in the GL. 9 transactions exceed the tier discount limit but only 4 approval emails were provided. Please provide a complete listing reconciled to the GL, approvals for all 9 exceptions, and the Commercial Committee minutes evidencing CFO approval of the rate card."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "SC-7007-S3",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Advertising Sales",
                "parentScopeId": "SC-7007",
                "scopeName": "Revenue Completeness",
                "rfis": [
                  // RFI-AR-003 — overdue, no response yet
                  {
                    "id": 108,
                    "title": "Full Broadcast/Publication Logs and Advertising Billing Data",
                    "description": "Please provide full broadcast/publication logs and advertising billing data for the same period to support completeness reconciliation.",
                    "dueDate": "2026-09-10",
                    "ownerValue": "faisal-qureshi",
                    "ownerLabel": "Faisal Qureshi",
                    "status": "overdue",
                    "questionnaire": [
                      {
                        "question": "Can the as-run logs for TV and radio be exported with the booking reference for each commercial spot?",
                        "dueDate": "2026-09-10"
                      },
                      {
                        "question": "Is there an existing month-end control that matches aired spots to billed spots?",
                        "dueDate": "2026-09-10"
                      },
                      {
                        "question": "How are unbilled make-goods, bonus spots and barter airtime identified in the billing data?",
                        "dueDate": "2026-09-10"
                      }
                    ],
                    "auditorIds": ["bob", "carol"],
                    "createdAt": "2026-07-15T08:00:00.000Z",
                    "recordStatus": "active"
                  }
                ]
              }
            ]
          },
          /* ── D08 Commercial / Partnerships ───────────────────────────── */
          {
            "subDivisionName": "Commercial / Partnerships",
            "company": "xyz-broadcast",
            "divisionCode": "XYZ-BR-01",
            "scopes": [
              {
                "id": "SC-7008",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Partnerships",
                "parentScopeId": null,
                "scopeName": "Sponsorship & Commercial Partnerships",
                "rfis": []
              },
              {
                "id": "SC-7008-S1",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Commercial / Partnerships",
                "parentScopeId": "SC-7008",
                "scopeName": "Contractual Obligations",
                "rfis": [
                  // RFI-SP-001 — completed, with one rejected round in history
                  {
                    "id": 109,
                    "title": "Sponsorship Agreements, Deliverables Trackers and Invoices",
                    "description": "Please provide sponsorship agreements, deliverables trackers, evidence of delivered benefits, invoices and outstanding obligations for selected arrangements.",
                    "dueDate": "2026-06-20",
                    "ownerValue": "mariam-al-suwaidi",
                    "ownerLabel": "Mariam Al Suwaidi",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Is each sponsorship arrangement supported by a signed agreement approved per the delegation of authority?",
                        "answer": "Yes. All 8 selected sponsorships have signed agreements; the 3 above AED 1m were approved by the CEO as required by the DoA. Approval evidence is attached.",
                        "dueDate": "2026-06-20"
                      },
                      {
                        "question": "Are contracted sponsor benefits tracked and evidenced as delivered?",
                        "answer": "Each sponsorship has a deliverables tracker listing on-air mentions, billboards, branded segments and digital posts, with proof of delivery (as-run logs, screenshots, post links). Delivery rate for the sample is 97%.",
                        "dueDate": "2026-06-20"
                      },
                      {
                        "question": "How are undelivered benefits and outstanding obligations managed?",
                        "answer": "Shortfalls are agreed with the sponsor as make-goods or credit notes. Two shortfalls in the sample were settled by make-good airtime in May 2026, agreed in writing with the sponsors.",
                        "dueDate": "2026-06-20"
                      }
                    ],
                    "auditorIds": ["david", "emma"],
                    "createdAt": "2026-05-04T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached are the signed sponsorship agreements and DoA approvals for the 8 selected arrangements, the deliverables trackers with proof of delivery, invoices, and the outstanding obligations schedule including the make-good agreements.",
                      "explanationNotes": "Deliverables trackers have been updated to show the proof-of-delivery reference for every line item, as requested in the previous review.",
                      "responseDocs": [
                        {
                          "name": "Sponsorship_Agreements_and_Approvals.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Signed sponsorship agreements with DoA approvals"
                        },
                        {
                          "name": "Sponsorship_Deliverables_Trackers.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Deliverables trackers with proof-of-delivery references"
                        },
                        {
                          "name": "Sponsorship_Invoices_and_Obligations.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Invoices, outstanding obligations and make-good agreements"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-06-17"
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached are the sponsorship agreements and invoices for the selected arrangements.",
                        "explanationNotes": "Deliverables are tracked by the partnerships team.",
                        "responseDocs": [
                          {
                            "name": "Sponsorship_Agreements.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Sponsorship agreements for selected arrangements"
                          },
                          {
                            "name": "Sponsorship_Invoices.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Sponsorship invoices"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Is each sponsorship arrangement supported by a signed agreement approved per the delegation of authority?",
                            "answer": "Yes, all agreements are signed."
                          },
                          {
                            "question": "Are contracted sponsor benefits tracked and evidenced as delivered?",
                            "answer": "Yes, the partnerships team tracks delivery."
                          },
                          {
                            "question": "How are undelivered benefits and outstanding obligations managed?",
                            "answer": "Handled with the sponsor as needed."
                          }
                        ],
                        "submittedAt": "2026-06-01",
                        "rejectedAt": "2026-06-08",
                        "rejectionReason": "No deliverables trackers or proof of delivered benefits were provided, and DoA approval for the three sponsorships above AED 1m is not evidenced. Please provide trackers with proof of delivery, the DoA approvals and the outstanding obligations schedule."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          /* ── D16 Finance ─────────────────────────────────────────────── */
          {
            "subDivisionName": "Finance",
            "company": "xyz-broadcast",
            "divisionCode": "XYZ-BR-01",
            "scopes": [
              {
                "id": "SC-7016",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Finance",
                "parentScopeId": null,
                "scopeName": "Finance & Financial Reporting",
                "rfis": []
              },
              {
                "id": "SC-7016-S1",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Finance",
                "parentScopeId": "SC-7016",
                "scopeName": "Revenue & Receivables",
                "rfis": [
                  // RFI-FI-001 — overdue, no response yet
                  {
                    "id": 110,
                    "title": "Revenue GL Detail, Customer Ageing, Credit Notes and Write-offs",
                    "description": "Please provide revenue GL details, customer ageing, credit notes, write-offs and monthly revenue reconciliation for the audit period.",
                    "dueDate": "2026-09-15",
                    "ownerValue": "daniel-fernandes",
                    "ownerLabel": "Daniel Fernandes",
                    "status": "overdue",
                    "questionnaire": [
                      {
                        "question": "Is the revenue sub-ledger reconciled to the GL monthly, and who reviews the reconciliation?",
                        "dueDate": "2026-09-15"
                      },
                      {
                        "question": "What is the approval limit for issuing credit notes, and are credit notes above the limit approved by the CFO?",
                        "dueDate": "2026-09-15"
                      },
                      {
                        "question": "Were any receivables written off during the period and were they approved per the DoA?",
                        "dueDate": "2026-09-15"
                      }
                    ],
                    "auditorIds": ["felix", "grace"],
                    "createdAt": "2026-07-27T08:00:00.000Z",
                    "recordStatus": "active"
                  }
                ]
              },
              {
                "id": "SC-7016-S2",
                "company": "xyz-broadcast",
                "divisionCode": "XYZ-BR-01",
                "subDivisionName": "Finance",
                "parentScopeId": "SC-7016",
                "scopeName": "General Ledger & Close",
                "rfis": [
                  // RFI-FI-002 — reopened, two rejected rounds in history
                  {
                    "id": 111,
                    "title": "Month-End Close Checklists, Key Reconciliations and Manual Journals",
                    "description": "Please provide month-end close checklists, key account reconciliations, manual journal listing and supporting approvals for selected months.",
                    "dueDate": "2026-08-20",
                    "ownerValue": "daniel-fernandes",
                    "ownerLabel": "Daniel Fernandes",
                    "status": "reopened",
                    "questionnaire": [
                      {
                        "question": "Is the month-end close checklist completed and signed off by the Financial Controller each month?",
                        "answer": "Yes. Checklists for February, March and April 2026 are signed off by the Financial Controller; March was signed 2 days after the close deadline due to the audit fee accrual review.",
                        "dueDate": "2026-08-20"
                      },
                      {
                        "question": "Are key balance sheet reconciliations prepared and independently reviewed within 10 working days of month-end?",
                        "answer": "Bank, receivables, payables, accruals and prepayments reconciliations are prepared by the accountants and reviewed by the Financial Controller. Review dates are shown on each reconciliation.",
                        "dueDate": "2026-08-20"
                      },
                      {
                        "question": "Are manual journals above AED 50,000 approved by someone other than the preparer?",
                        "answer": "Yes. The ERP enforces maker-checker for manual journals; journals above AED 50,000 require Financial Controller approval.",
                        "dueDate": "2026-08-20"
                      }
                    ],
                    "auditorIds": ["henry", "irene"],
                    "createdAt": "2026-06-15T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Attached are the signed close checklists for February–April 2026, the key balance sheet reconciliations with reviewer sign-off, and the manual journal listing with ERP approval history.",
                      "explanationNotes": "Reconciliations have been re-exported with the reviewer name and review date visible. The manual journal listing is the full ERP extract, not filtered.",
                      "responseDocs": [
                        {
                          "name": "Month_End_Close_Checklists_Feb-Apr2026.pdf",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Signed month-end close checklists"
                        },
                        {
                          "name": "Key_Account_Reconciliations_Feb-Apr2026.zip",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Key balance sheet reconciliations with reviewer sign-off"
                        },
                        {
                          "name": "Manual_Journal_Listing_with_Approvals.xlsx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Full manual journal listing with ERP maker-checker history"
                        }
                      ],
                      "status": "rejected",
                      "submittedAt": "2026-08-12",
                      "rejectedAt": "2026-08-21",
                      "rejectionReason": "The accruals reconciliation for March was reviewed 19 working days after month-end and no explanation was given. Journal JV-2026-0388 (AED 240,000) was prepared and approved by the same user through a delegated ERP role. Please explain both exceptions, provide the ERP role assignment report for the approver, and resubmit."
                    },
                    "responseHistory": [
                      {
                        "responseText": "Attached are the month-end close checklists and the manual journal listing for the selected months.",
                        "explanationNotes": "Reconciliations are stored on the finance shared drive and will be provided on request.",
                        "responseDocs": [
                          {
                            "name": "Close_Checklists_Feb-Apr2026.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Month-end close checklists"
                          },
                          {
                            "name": "Manual_Journals_Over_50k.xlsx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Manual journals above AED 50,000"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Is the month-end close checklist completed and signed off by the Financial Controller each month?",
                            "answer": "Yes."
                          },
                          {
                            "question": "Are key balance sheet reconciliations prepared and independently reviewed within 10 working days of month-end?",
                            "answer": "Yes, reconciliations are prepared monthly."
                          },
                          {
                            "question": "Are manual journals above AED 50,000 approved by someone other than the preparer?",
                            "answer": "Yes."
                          }
                        ],
                        "submittedAt": "2026-07-22",
                        "rejectedAt": "2026-07-29",
                        "rejectionReason": "Key account reconciliations were not provided and the journal listing was filtered to journals above AED 50,000, so completeness cannot be tested. Please provide the reconciliations with review evidence and the full, unfiltered manual journal listing with approval history."
                      },
                      {
                        "responseText": "Attached are the signed close checklists for February–April 2026, the key balance sheet reconciliations with reviewer sign-off, and the manual journal listing with ERP approval history.",
                        "explanationNotes": "Reconciliations have been re-exported with the reviewer name and review date visible. The manual journal listing is the full ERP extract, not filtered.",
                        "responseDocs": [
                          {
                            "name": "Month_End_Close_Checklists_Feb-Apr2026.pdf",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Signed month-end close checklists"
                          },
                          {
                            "name": "Key_Account_Reconciliations_Feb-Apr2026.zip",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Key balance sheet reconciliations with reviewer sign-off"
                          },
                          {
                            "name": "Manual_Journal_Listing_with_Approvals.xlsx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Full manual journal listing with ERP maker-checker history"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Is the month-end close checklist completed and signed off by the Financial Controller each month?",
                            "answer": "Yes. Checklists for February, March and April 2026 are signed off by the Financial Controller; March was signed 2 days after the close deadline due to the audit fee accrual review."
                          },
                          {
                            "question": "Are key balance sheet reconciliations prepared and independently reviewed within 10 working days of month-end?",
                            "answer": "Bank, receivables, payables, accruals and prepayments reconciliations are prepared by the accountants and reviewed by the Financial Controller. Review dates are shown on each reconciliation."
                          },
                          {
                            "question": "Are manual journals above AED 50,000 approved by someone other than the preparer?",
                            "answer": "Yes. The ERP enforces maker-checker for manual journals; journals above AED 50,000 require Financial Controller approval."
                          }
                        ],
                        "submittedAt": "2026-08-12",
                        "rejectedAt": "2026-08-21",
                        "rejectionReason": "The accruals reconciliation for March was reviewed 19 working days after month-end and no explanation was given. Journal JV-2026-0388 (AED 240,000) was prepared and approved by the same user through a delegated ERP role. Please explain both exceptions, provide the ERP role assignment report for the approver, and resubmit."
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];


/* ── Option-list helpers (same as rfi-static-indi.data.ts, against this
 * file's own RFI_STATIC_XYZ_BROADCAST_COMPANIES) ── */

/** Reads the REAL division list (division-static-data.ts) — not this file's own
 *  RFI-grouping wrapper array — so a division added via divisions.ts's Add
 *  Division flow is selectable here immediately, even before it has any RFIs. */
export function rfiDivisionOptionsForCompany(companyId: string | null | undefined): { label: string; value: string }[] {
  const company = DIVISION_STATIC_COMPANIES.find(c => c.id === companyId);
  if (!company) return [];
  return company.divisions.map(b => ({ label: b.divisionName, value: b.divisionCode }));
}

/** Reads the REAL sub-division list (sub-division-static-data.ts) — not this
 *  file's own RFI-grouping wrapper array. */
export function rfiSubDivisionOptionsForDivision(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
): { label: string; value: string }[] {
  const division = SUB_DIVISION_STATIC_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode);
  if (!division) return [];
  return division.subDivisions.map(d => ({ label: d.subDivisionName, value: d.subDivisionName }));
}

/** Reads the REAL scope list (audit-scope-static-data.ts) — not this file's
 *  own RFI-grouping wrapper array — so a scope added via audit-scope-
 *  management.ts's Add Scope flow is selectable here immediately, even
 *  before an RFI has been attached to it. */
export function rfiTopLevelScopeOptionsForSubDivision(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
  subDivisionName: string | null | undefined,
): { label: string; value: string }[] {
  const dept = AUDIT_SCOPE_STATIC_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode)?.subDivisions
    .find(d => d.subDivisionName === subDivisionName);
  if (!dept) return [];
  return dept.scopes
    .filter(s => s.parentScopeId === null)
    .map(s => ({ label: s.scopeName, value: s.id }));
}

/** Flat search across every company/division/sub-division for a scope or sub-scope by id. */
export function findRfiStaticScopeById(id: string | null | undefined): RfiStaticScope | undefined {
  if (!id) return undefined;
  for (const company of RFI_STATIC_XYZ_BROADCAST_COMPANIES) {
    for (const division of company.divisions) {
      for (const dept of division.subDivisions) {
        const scope = dept.scopes.find(s => s.id === id);
        if (scope) return scope;
      }
    }
  }
  return undefined;
}

/** All sub-scopes (flat sibling records with parentScopeId === parentId) of a
 *  top-level scope — reads the REAL scope list (audit-scope-static-data.ts),
 *  not this file's own RFI-grouping wrapper array. */
export function rfiSubScopesOf(parentId: string | null | undefined): StaticScope[] {
  if (!parentId) return [];
  const result: StaticScope[] = [];
  for (const company of AUDIT_SCOPE_STATIC_COMPANIES) {
    for (const division of company.divisions) {
      for (const dept of division.subDivisions) {
        for (const scope of dept.scopes) {
          if (scope.parentScopeId === parentId) result.push(scope);
        }
      }
    }
  }
  return result;
}

/**
 * Finds a scope/sub-scope's `id` by its (company, division, sub-division, name)
 * — used to resolve an already-stored RFI's `scopeValue`/`subScopeValue`
 * (names) back into the form-control ids the Add/Edit RFI drawer's
 * cascading dropdowns key off. `parentId` narrows to a specific top-level
 * scope's sub-scopes; omit it to search top-level scopes.
 */
export function findRfiScopeIdByName(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
  subDivisionName: string | null | undefined,
  scopeName: string | null | undefined,
  parentId: string | null = null,
): string | null {
  if (!scopeName) return null;
  const dept = RFI_STATIC_XYZ_BROADCAST_COMPANIES
    .find(c => c.id === companyId)?.divisions
    .find(b => b.divisionCode === divisionCode)?.subDivisions
    .find(d => d.subDivisionName === subDivisionName);
  if (!dept) return null;
  const match = dept.scopes.find(s => s.scopeName === scopeName && s.parentScopeId === parentId);
  return match?.id ?? null;
}

/* ── Mutation ─────────────────────────────────────────────────────────────
 * No backend behind this page — the Add RFI drawer (manage/rfi.component.ts) writes
 * straight into this in-memory tree so both rfi-list.component.html and
 * rfi-client-list.component.html (both read via getAllEnrichedRfis() below)
 * reflect a newly-added RFI immediately, with no page reload.
 */

function nextStaticRfiId(): number {
  let max = 0;
  for (const company of RFI_STATIC_XYZ_BROADCAST_COMPANIES) {
    for (const division of company.divisions) {
      for (const dept of division.subDivisions) {
        for (const scope of dept.scopes) {
          for (const rfi of scope.rfis) {
            if (rfi.id > max) max = rfi.id;
          }
        }
      }
    }
  }
  return max + 1;
}

/**
 * Adds a brand-new RFI under the given company/division/sub-division, on the
 * scope with `scopeId` — or, when `subScopeId` is given, on that sub-scope
 * instead (a sub-scope's own `rfis[]` is what `getAllEnrichedRfis` reads to
 * populate `subScopeValue`/`subScopeLabel`). Always stamps a fresh
 * globally-unique `id` and forces `status: 'pending'`, ignoring whatever the
 * caller passed for either — a brand-new RFI is always pending review.
 */
export function upsertStaticRfi(
  companyId: string,
  divisionCode: string,
  subDivisionName: string,
  scopeId: string | null,
  subScopeId: string | null,
  fields: Omit<StaticRfi, 'id' | 'status' | 'createdAt' | 'recordStatus'>,
  companyMeta?: CompanyMeta,
  /** true when scopeId/subScopeId are Scope Library ids (Add RFI "From RFI Library" mode). */
  fromLibrary = false,
): StaticRfi | undefined {
  const targetScopeId = subScopeId ?? scopeId;
  if (!targetScopeId) return undefined;

  // Resolve the target scope's real name/parent from the REAL scope source
  // (audit-scope-static-data.ts), so a wrapper self-created below carries a
  // correct label instead of a placeholder. Library ids don't exist in that
  // source, so they're resolved by name instead.
  const realScope = fromLibrary
    ? findStaticScopeByLibraryId(targetScopeId)
    : findStaticScopeById(targetScopeId);
  if (!realScope) return undefined;

  let company = RFI_STATIC_XYZ_BROADCAST_COMPANIES.find(c => c.id === companyId);
  if (!company) {
    company = {
      id: companyId,
      companyName: companyMeta?.companyName ?? companyId,
      tag: companyMeta?.tag ?? companyId.slice(0, RFI_COMPANY_TAG_LENGTH).toUpperCase(),
      color: companyMeta?.color ?? RFI_DEFAULT_COMPANY_COLOR,
      divisions: [],
    };
    RFI_STATIC_XYZ_BROADCAST_COMPANIES.push(company);
  }
  let division = company.divisions.find(b => b.divisionCode === divisionCode);
  if (!division) {
    const realDivision = DIVISION_STATIC_COMPANIES
      .find(c => c.id === companyId)?.divisions
      .find(d => d.divisionCode === divisionCode);
    division = { divisionCode, divisionName: realDivision?.divisionName ?? divisionCode, hasSubDivision: realDivision?.hasSubDivision ?? false, company: companyId, scopes: [], subDivisions: [] };
    company.divisions.push(division);
  }
  let dept = division.subDivisions.find(d => d.subDivisionName === subDivisionName);
  if (!dept) {
    dept = { subDivisionName, company: companyId, divisionCode, scopes: [] };
    division.subDivisions.push(dept);
  }
  let targetScope = dept.scopes.find(s => s.id === realScope.id);
  if (!targetScope) {
    targetScope = {
      id: realScope.id,
      company: companyId,
      divisionCode,
      subDivisionName,
      parentScopeId: realScope.parentScopeId,
      scopeName: realScope.scopeName,
      rfis: [],
    };
    dept.scopes.push(targetScope);
  }

  const rfi: StaticRfi = {
    ...fields,
    id: nextStaticRfiId(),
    status: RfiStatuses.Pending,
    createdAt: new Date().toISOString(),
    recordStatus: RfiRecordStatuses.Active,
  };
  targetScope.rfis.push(rfi);
  return rfi;
}

/** Flips an RFI's Activate/Deactivate flag — independent of its workflow `status`. */
export function setStaticRfiStatus(rfiId: number, recordStatus: RfiRecordStatus): void {
  const rfi = findStaticRfiById(rfiId);
  if (rfi) rfi.recordStatus = recordStatus;
}

/** Flat search across every company/division/sub-division/scope for an RFI by id. */
function findStaticRfiById(id: number): StaticRfi | undefined {
  for (const company of RFI_STATIC_XYZ_BROADCAST_COMPANIES) {
    for (const division of company.divisions) {
      for (const dept of division.subDivisions) {
        for (const scope of dept.scopes) {
          const rfi = scope.rfis.find(r => r.id === id);
          if (rfi) return rfi;
        }
      }
    }
  }
  return undefined;
}

/**
 * Records the client's response (and questionnaire answers, matched to the
 * RFI's existing questions by position) against an existing RFI, and moves
 * it into `'under-review'` so the auditor sees it awaiting a decision.
 * Called by rfi-client.component.ts's `onSubmitResponse()` — both
 * rfi-list.component.html and rfi-client-list.component.html read the same
 * tree via `getAllEnrichedRfis()`, so the change is visible immediately on
 * both sides, no page reload needed.
 *
 * (On the resubmit-after-rejection path, the *previous* rejected response
 * was already archived onto `responseHistory` by `rejectStaticRfiResponse`
 * at the moment the auditor rejected it — not here — so this always just
 * overwrites `response` with the newly-submitted one.)
 */
export function submitStaticRfiResponse(
  rfiId: number,
  response: { responseText: string; explanationNotes?: string; responseDocs: RfiDoc[]; submittedAt: string },
  questionnaireAnswers: { answer?: string }[] = [],
): StaticRfi | undefined {
  const rfi = findStaticRfiById(rfiId);
  if (!rfi) return undefined;

  rfi.status = RfiStatuses.UnderReview;
  rfi.response = { ...response, status: RfiResponseStatuses.Pending };

  if (rfi.questionnaire?.length && questionnaireAnswers.length) {
    rfi.questionnaire = rfi.questionnaire.map((q, i) => ({
      ...q,
      answer: questionnaireAnswers[i]?.answer ?? q.answer,
    }));
  }

  return rfi;
}

/**
 * Auditor accepts the client's under-review response — moves the RFI to
 * `'completed'` and marks the current response `'accepted'`.
 */
export function acceptStaticRfiResponse(rfiId: number): StaticRfi | undefined {
  const rfi = findStaticRfiById(rfiId);
  if (!rfi || !rfi.response) return undefined;

  rfi.status = RfiStatuses.Completed;
  rfi.response = { ...rfi.response, status: RfiResponseStatuses.Accepted };
  return rfi;
}

/**
 * Auditor rejects the client's under-review response — moves the RFI to
 * `'reopened'`, marks the current response `'rejected'` (stamping
 * `rejectedAt`/`rejectionReason` on it so the client's "Rejection Reason
 * from Auditor" panel can read it directly off `rfi.response`), and
 * archives a snapshot of that rejected round — the response text/docs plus
 * the questionnaire answers as they stood at rejection time — onto
 * `responseHistory`, so it shows up in the Response History tab right away
 * (not only after the client eventually resubmits).
 */
export function rejectStaticRfiResponse(rfiId: number, rejectionReason: string): StaticRfi | undefined {
  const rfi = findStaticRfiById(rfiId);
  if (!rfi || !rfi.response) return undefined;

  const rejectedAt = new Date().toISOString();
  rfi.status = RfiStatuses.Reopened;
  rfi.response = { ...rfi.response, status: RfiResponseStatuses.Rejected, rejectedAt, rejectionReason };

  const historyEntry: RfiHistoryEntry = {
    responseText: rfi.response.responseText,
    explanationNotes: rfi.response.explanationNotes,
    responseDocs: rfi.response.responseDocs,
    questionnaire: (rfi.questionnaire ?? []).map(q => ({ question: q.question, answer: q.answer })),
    submittedAt: rfi.response.submittedAt ?? rejectedAt,
    rejectedAt,
    rejectionReason,
  };
  rfi.responseHistory = [...(rfi.responseHistory ?? []), historyEntry];

  return rfi;
}

/* ── Flat, enriched RFI list — single source of truth for both the auditor
 * view (rfi-list.component.ts) and the client view (rfi-client-list.component.ts). */

export function getAllEnrichedRfis(): EnrichedStaticRfi[] {
  const result: EnrichedStaticRfi[] = [];
  for (const company of RFI_STATIC_XYZ_BROADCAST_COMPANIES) {
    for (const division of company.divisions) {
      for (const dept of division.subDivisions) {
        for (const scope of dept.scopes) {
          const isSubScope = scope.parentScopeId !== null;
          const parent = isSubScope
            ? dept.scopes.find(s => s.id === scope.parentScopeId)
            : undefined;

          for (const rfi of scope.rfis) {
            result.push({
              id: rfi.id,
              subDivisionValue: dept.subDivisionName,
              subDivisionLabel: dept.subDivisionName,
              scopeValue: isSubScope ? (parent?.scopeName ?? null) : scope.scopeName,
              scopeLabel: isSubScope ? (parent?.scopeName ?? null) : scope.scopeName,
              subScopeValue: isSubScope ? scope.scopeName : null,
              subScopeLabel: isSubScope ? scope.scopeName : null,
              title: rfi.title,
              description: rfi.description,
              dueDate: new Date(rfi.dueDate),
              ownerValue: rfi.ownerValue,
              ownerLabel: rfi.ownerLabel,
              status: rfi.status,
              response: rfi.response ?? null,
              auditorIds: rfi.auditorIds,
              questionnaire: rfi.questionnaire ?? [],
              responseHistory: rfi.responseHistory ?? [],
              company: company.id,
              divisionCode: division.divisionCode,
              divisionName: division.divisionName,
              createdAt: new Date(rfi.createdAt),
              recordStatus: rfi.recordStatus,
            });
          }
        }
      }
    }
  }
  return result;
}
