// RFI seed used when CLIENT_MODE_VALUE is 'internal-audit' and
// INTERNAL_AUDIT_CLIENT_KEY_VALUE is 'lulu-exchange' — a single organisation
// (Lulu International Exchange) auditing itself. Same RfiStaticCompany shape as
// the DAR Exchange seed (DAR_EXCHANGE_RFI_COMPANIES in rfi-static-indi.data.ts);
// the RFI content (ids, titles, questionnaires, responses, history) is copied
// from it unchanged, only re-homed onto Lulu's scopes.
//
// Company/division/sub-division/scope ids and names match
// audit-scope-static-lulu-org.data.ts (and division-lulu-exchange.data.ts /
// sub-division-lulu-exchange.data.ts):
//   IT DEPT (LULU-BR-14)           -> SOFTWARE SC-8001, HARDWARE SC-8002, CYBER SECURITY SC-8003
//   RISK DEPT (LULU-BR-06)         -> division-level SC-8101 (subDivisionName: null)
//   FRAUD DEPT (LULU-BR-05)        -> division-level SC-8201 (subDivisionName: null)
//   BRANCH OPERATIONS (LULU-BR-12) -> Branch 1 SC-8301; Branch 2 SC-8401, SC-8500
//                                     (+ sub-scopes SC-8501..8503), SC-8600, SC-8700, SC-8800
//
// DAR -> Lulu scope mapping:
//   SC-6201 IT/Cybersecurity -> SC-8003 | SC-6301 -> SC-8301 | SC-6401 -> SC-8401
//   SC-5000..5003 -> SC-8500..8503 | SC-5100 -> SC-8600 | SC-5200 -> SC-8700 | SC-5300 -> SC-8800
//   SC-6601 RISK -> SC-8101 | SC-6501 AML/CFT -> SC-8201
//   No Lulu counterpart, re-homed: HR SC-6001 + Finance SC-6101 -> SC-8600
//   (Operations and Other subDivisions); Consumer Protection SC-6701 -> SC-8800.
//   SOFTWARE / HARDWARE carry no RFIs.

import type { RfiStaticCompany } from './models/rfi-static-data.model';

export const LULU_EXCHANGE_RFI_COMPANIES: RfiStaticCompany[] = [
  {
    "id": "lulu-international-exchange",
    "companyName": "Lulu International Exchange",
    "tag": "LULU",
    "color": "#0b6e75",
    "divisions": [
      {
        "divisionCode": "LULU-BR-14",
        "divisionName": "IT DEPT",
        "hasSubDivision": true,
        "company": "lulu-international-exchange",
        "scopes": [],
        "subDivisions": [
          {
            "subDivisionName": "SOFTWARE",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-14",
            "scopes": [
              {
                "id": "SC-8001",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-14",
                "subDivisionName": "SOFTWARE",
                "parentScopeId": null,
                "scopeName": "Information Technology / Software Applications",
                "rfis": []
              }
            ]
          },
          {
            "subDivisionName": "HARDWARE",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-14",
            "scopes": [
              {
                "id": "SC-8002",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-14",
                "subDivisionName": "HARDWARE",
                "parentScopeId": null,
                "scopeName": "IT Infrastructure / Hardware & Data Centre",
                "rfis": []
              }
            ]
          },
          {
            "subDivisionName": "CYBER SECURITY",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-14",
            "scopes": [
              {
                "id": "SC-8003",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-14",
                "subDivisionName": "CYBER SECURITY",
                "parentScopeId": null,
                "scopeName": "Cybersecurity / Information Security",
                "rfis": [
                  {
                    "id": 106,
                    "title": "Reports/checks demonstrating customer and transaction data mapping to TMS and screening systems",
                    "description": "Provide reports or checks demonstrating that customer and transaction data is correctly and completely mapped into the Transaction Monitoring System (TMS) and sanction screening system.",
                    "dueDate": "2026-07-14",
                    "ownerValue": "aisha-farooq",
                    "ownerLabel": "Aisha Farooq",
                    "status": "pending",
                    "questionnaire": [
                      {
                        "question": "Are all customer and transaction data fields mapped without loss or truncation?",
                        "dueDate": "2026-07-14"
                      },
                      {
                        "question": "How frequently is the data mapping reconciliation performed?",
                        "dueDate": "2026-07-14"
                      }
                    ],
                    "auditorIds": [
                      "karen",
                      "liam"
                    ],
                    "createdAt": "2026-02-14T08:00:00.000Z",
                    "recordStatus": "active"
                  },
                  {
                    "id": 107,
                    "title": "Independent Validation of TMS following system changes",
                    "description": "Submit the independent validation report performed on the Transaction Monitoring System (TMS) following any system changes or rule updates during the audit period.",
                    "dueDate": "2026-07-20",
                    "ownerValue": "aisha-farooq",
                    "ownerLabel": "Aisha Farooq",
                    "status": "overdue",
                    "questionnaire": [
                      {
                        "question": "Was the validation performed by an independent party?",
                        "dueDate": "2026-07-20"
                      },
                      {
                        "question": "Were all identified validation findings remediated and closed?",
                        "dueDate": "2026-07-20"
                      }
                    ],
                    "auditorIds": [
                      "mia",
                      "alice"
                    ],
                    "createdAt": "2026-02-20T08:00:00.000Z",
                    "recordStatus": "active"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "divisionCode": "LULU-BR-06",
        "divisionName": "RISK DEPT",
        "hasSubDivision": false,
        "company": "lulu-international-exchange",
        "scopes": [
          {
            "id": "SC-8101",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-06",
            "subDivisionName": null,
            "parentScopeId": null,
            "scopeName": "Risk Management / Business Continuity",
            "rfis": [
              {
                "id": 115,
                "title": "ML/TF/PF Risk Assessment Methodology",
                "description": "Provide the documented Money Laundering/Terrorist Financing/Proliferation Financing (ML/TF/PF) risk assessment methodology defining the financial-crime risk-assessment approach.",
                "dueDate": "2026-09-06",
                "ownerValue": "omar-saleh",
                "ownerLabel": "Omar Saleh",
                "status": "reopened",
                "questionnaire": [
                  {
                    "question": "Does the methodology cover all required risk factors (customer, product, channel, geography)?",
                    "answer": "Confirmed and documented: does the methodology cover all required risk factors (customer, product, channel, geography) — supporting evidence attached.",
                    "dueDate": "2026-09-06"
                  },
                  {
                    "question": "When was the methodology last formally reviewed and approved?",
                    "answer": "Confirmed and documented: when was the methodology last formally reviewed and approved — supporting evidence attached.",
                    "dueDate": "2026-09-06"
                  }
                ],
                "auditorIds": [
                  "carol",
                  "david"
                ],
                "createdAt": "2026-04-09T08:00:00.000Z",
                "recordStatus": "active",
                "response": {
                  "responseText": "ML/TF/PF Risk Assessment Methodology — response prepared with supporting evidence pack, explanations, and sign-off.",
                  "explanationNotes": "Resubmission in progress following the auditor's rejection feedback.",
                  "responseDocs": [
                    {
                      "name": "ml_tf_pf_risk_assessment_methodology_evidence.docx",
                      "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                      "description": "Supporting evidence for: ML/TF/PF Risk Assessment Methodology"
                    }
                  ],
                  "status": "rejected",
                  "submittedAt": "2026-07-08",
                  "rejectedAt": "2026-07-18",
                  "rejectionReason": "The submitted evidence for \"ML/TF/PF Risk Assessment Methodology\" is incomplete — please provide the missing supporting documents and a full explanation of any exceptions noted, then resubmit."
                },
                "responseHistory": [
                  {
                    "responseText": "ML/TF/PF Risk Assessment Methodology — initial response submitted with partial evidence.",
                    "explanationNotes": "Some supporting documents were still being collected at time of initial submission.",
                    "responseDocs": [
                      {
                        "name": "ml_tf_pf_risk_assessment_methodology_initial.docx",
                        "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                        "description": "Initial (partial) evidence for: ML/TF/PF Risk Assessment Methodology"
                      }
                    ],
                    "questionnaire": [
                      {
                        "question": "Does the methodology cover all required risk factors (customer, product, channel, geography)?",
                        "answer": "Confirmed and documented: does the methodology cover all required risk factors (customer, product, channel, geography) — supporting evidence attached."
                      },
                      {
                        "question": "When was the methodology last formally reviewed and approved?",
                        "answer": "Confirmed and documented: when was the methodology last formally reviewed and approved — supporting evidence attached."
                      }
                    ],
                    "submittedAt": "2026-06-28",
                    "rejectedAt": "2026-07-18",
                    "rejectionReason": "The initial submission for \"ML/TF/PF Risk Assessment Methodology\" was missing key supporting documents. Please provide complete evidence and resubmit."
                  }
                ]
              },
              {
                "id": 116,
                "title": "ML/TF/PF Risk Assessment Report",
                "description": "Provide the latest ML/TF/PF Risk Assessment Report documenting the risks identified and assessed for the exchange house.",
                "dueDate": "2026-09-12",
                "ownerValue": "omar-saleh",
                "ownerLabel": "Omar Saleh",
                "status": "pending",
                "questionnaire": [
                  {
                    "question": "Are all identified risks rated using the approved methodology?",
                    "dueDate": "2026-09-12"
                  },
                  {
                    "question": "Were the assessment results presented to senior management or the Board?",
                    "dueDate": "2026-09-12"
                  }
                ],
                "auditorIds": [
                  "emma",
                  "felix"
                ],
                "createdAt": "2026-04-15T08:00:00.000Z",
                "recordStatus": "active"
              }
            ]
          }
        ],
        "subDivisions": []
      },
      {
        "divisionCode": "LULU-BR-05",
        "divisionName": "FRAUD DEPT",
        "hasSubDivision": false,
        "company": "lulu-international-exchange",
        "scopes": [
          {
            "id": "SC-8201",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-05",
            "subDivisionName": null,
            "parentScopeId": null,
            "scopeName": "Fraud Risk Management / Anti-Fraud Controls",
            "rfis": [
              {
                "id": 112,
                "title": "AML/CFT/CPF Policy Manual",
                "description": "Provide the current, board-approved AML/CFT/CPF Policy Manual as the core AML governance document for the exchange house.",
                "dueDate": "2026-08-19",
                "ownerValue": "yusuf-al-blooshi",
                "ownerLabel": "Yusuf Al Blooshi",
                "status": "overdue",
                "questionnaire": [
                  {
                    "question": "Is the manual approved by the Board or its delegated committee?",
                    "dueDate": "2026-08-19"
                  },
                  {
                    "question": "Does the manual reflect the latest CBUAE regulatory requirements?",
                    "dueDate": "2026-08-19"
                  }
                ],
                "auditorIds": [
                  "james",
                  "karen"
                ],
                "createdAt": "2026-03-22T08:00:00.000Z",
                "recordStatus": "active"
              },
              {
                "id": 113,
                "title": "All AML Rules and Parameters, including status, frequency and risk category",
                "description": "Provide the complete listing of AML transaction-monitoring rules and parameters, including each rule's active/inactive status, run frequency, and assigned risk category.",
                "dueDate": "2026-08-25",
                "ownerValue": "yusuf-al-blooshi",
                "ownerLabel": "Yusuf Al Blooshi",
                "status": "completed",
                "questionnaire": [
                  {
                    "question": "Are inactive rules formally documented with a rationale?",
                    "answer": "Confirmed and documented: are inactive rules formally documented with a rationale — supporting evidence attached.",
                    "dueDate": "2026-08-25"
                  },
                  {
                    "question": "Is there a defined process for adding or amending rule parameters?",
                    "answer": "Confirmed and documented: is there a defined process for adding or amending rule parameters — supporting evidence attached.",
                    "dueDate": "2026-08-25"
                  }
                ],
                "auditorIds": [
                  "liam",
                  "mia"
                ],
                "createdAt": "2026-03-28T08:00:00.000Z",
                "recordStatus": "active",
                "response": {
                  "responseText": "All AML Rules and Parameters, including status, frequency and risk category — response prepared with supporting evidence pack, explanations, and sign-off.",
                  "explanationNotes": "Response reviewed and accepted; no further action required.",
                  "responseDocs": [
                    {
                      "name": "all_aml_rules_and_parameters_including_status_frequency_and__evidence.docx",
                      "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                      "description": "Supporting evidence for: All AML Rules and Parameters, including status, frequency and risk category"
                    }
                  ],
                  "status": "accepted",
                  "submittedAt": "2026-06-26"
                }
              }
            ]
          }
        ],
        "subDivisions": []
      },
      {
        "divisionCode": "LULU-BR-12",
        "divisionName": "BRANCH OPERATIONS",
        "hasSubDivision": true,
        "company": "lulu-international-exchange",
        "scopes": [],
        "subDivisions": [
          {
            "subDivisionName": "Branch 1",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-12",
            "scopes": [
              {
                "id": "SC-8301",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 1",
                "parentScopeId": null,
                "scopeName": "Administration / Outsourcing of Functions",
                "rfis": [
                  {
                    "id": 108,
                    "title": "List of Rejected Transactions with reasons for rejection",
                    "description": "Provide the listing of all rejected transactions during the audit period, together with the documented reason for rejection for each.",
                    "dueDate": "2026-07-26",
                    "ownerValue": "hassan-youssef",
                    "ownerLabel": "Hassan Youssef",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Are rejection reasons consistently categorized and logged?",
                        "answer": "Confirmed and documented: are rejection reasons consistently categorized and logged — supporting evidence attached.",
                        "dueDate": "2026-07-26"
                      },
                      {
                        "question": "Is there evidence of follow-up action on repeated rejections from the same customer?",
                        "answer": "Confirmed and documented: is there evidence of follow-up action on repeated rejections from the same customer — supporting evidence attached.",
                        "dueDate": "2026-07-26"
                      }
                    ],
                    "auditorIds": [
                      "bob",
                      "carol"
                    ],
                    "createdAt": "2026-02-26T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "List of Rejected Transactions with reasons for rejection — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Response reviewed and accepted; no further action required.",
                      "responseDocs": [
                        {
                          "name": "list_of_rejected_transactions_with_reasons_for_rejection_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: List of Rejected Transactions with reasons for rejection"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-05-27"
                    },
                    "responseHistory": [
                      {
                        "responseText": "List of Rejected Transactions with reasons for rejection — initial response submitted with partial evidence.",
                        "explanationNotes": "Some supporting documents were still being collected at time of initial submission.",
                        "responseDocs": [
                          {
                            "name": "list_of_rejected_transactions_with_reasons_for_rejection_initial.docx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Initial (partial) evidence for: List of Rejected Transactions with reasons for rejection"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Are rejection reasons consistently categorized and logged?",
                            "answer": "Confirmed and documented: are rejection reasons consistently categorized and logged — supporting evidence attached."
                          },
                          {
                            "question": "Is there evidence of follow-up action on repeated rejections from the same customer?",
                            "answer": "Confirmed and documented: is there evidence of follow-up action on repeated rejections from the same customer — supporting evidence attached."
                          }
                        ],
                        "submittedAt": "2026-05-14",
                        "rejectedAt": "2026-05-20",
                        "rejectionReason": "The initial submission for \"List of Rejected Transactions with reasons for rejection\" was missing key supporting documents. Please provide complete evidence and resubmit."
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "subDivisionName": "Branch 2",
            "company": "lulu-international-exchange",
            "divisionCode": "LULU-BR-12",
            "scopes": [
              {
                "id": "SC-8401",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": null,
                "scopeName": "Branch Operations / Operational Controls",
                "rfis": [
                  {
                    "id": 109,
                    "title": "List of Foreign-Currency Sale and Purchase Transactions",
                    "description": "Provide the division-level listing of foreign-currency sale and purchase transactions processed during the audit period as operational transaction-processing evidence.",
                    "dueDate": "2026-08-01",
                    "ownerValue": "priya-menon",
                    "ownerLabel": "Priya Menon",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Does the division listing reconcile to the head-office consolidated FX register?",
                        "answer": "Confirmed and documented: does the division listing reconcile to the head-office consolidated FX register — supporting evidence attached.",
                        "dueDate": "2026-08-01"
                      },
                      {
                        "question": "Are dual-authorization controls evidenced for transactions above the threshold?",
                        "answer": "Confirmed and documented: are dual-authorization controls evidenced for transactions above the threshold — supporting evidence attached.",
                        "dueDate": "2026-08-01"
                      }
                    ],
                    "auditorIds": [
                      "david",
                      "emma"
                    ],
                    "createdAt": "2026-03-04T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "List of Foreign-Currency Sale and Purchase Transactions — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Submitted response is currently awaiting auditor validation.",
                      "responseDocs": [
                        {
                          "name": "list_of_foreign_currency_sale_and_purchase_transactions_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: List of Foreign-Currency Sale and Purchase Transactions"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-06-02"
                    }
                  },
                  {
                    "id": 110,
                    "title": "Transaction Voucher Sample",
                    "description": "Provide a sample of transaction vouchers evidencing frontline transaction execution, including teller sign-off and customer acknowledgement.",
                    "dueDate": "2026-08-07",
                    "ownerValue": "priya-menon",
                    "ownerLabel": "Priya Menon",
                    "status": "reopened",
                    "questionnaire": [
                      {
                        "question": "Are all sampled vouchers fully completed and signed off?",
                        "answer": "Confirmed and documented: are all sampled vouchers fully completed and signed off — supporting evidence attached.",
                        "dueDate": "2026-08-07"
                      },
                      {
                        "question": "Is there evidence of supervisory review on high-value vouchers?",
                        "answer": "Confirmed and documented: is there evidence of supervisory review on high-value vouchers — supporting evidence attached.",
                        "dueDate": "2026-08-07"
                      }
                    ],
                    "auditorIds": [
                      "felix",
                      "grace"
                    ],
                    "createdAt": "2026-03-10T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Transaction Voucher Sample — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Resubmission in progress following the auditor's rejection feedback.",
                      "responseDocs": [
                        {
                          "name": "transaction_voucher_sample_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Transaction Voucher Sample"
                        }
                      ],
                      "status": "rejected",
                      "submittedAt": "2026-06-08",
                      "rejectedAt": "2026-06-18",
                      "rejectionReason": "The submitted evidence for \"Transaction Voucher Sample\" is incomplete — please provide the missing supporting documents and a full explanation of any exceptions noted, then resubmit."
                    },
                    "responseHistory": [
                      {
                        "responseText": "Transaction Voucher Sample — initial response submitted with partial evidence.",
                        "explanationNotes": "Some supporting documents were still being collected at time of initial submission.",
                        "responseDocs": [
                          {
                            "name": "transaction_voucher_sample_initial.docx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Initial (partial) evidence for: Transaction Voucher Sample"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Are all sampled vouchers fully completed and signed off?",
                            "answer": "Confirmed and documented: are all sampled vouchers fully completed and signed off — supporting evidence attached."
                          },
                          {
                            "question": "Is there evidence of supervisory review on high-value vouchers?",
                            "answer": "Confirmed and documented: is there evidence of supervisory review on high-value vouchers — supporting evidence attached."
                          }
                        ],
                        "submittedAt": "2026-05-29",
                        "rejectedAt": "2026-06-18",
                        "rejectionReason": "The initial submission for \"Transaction Voucher Sample\" was missing key supporting documents. Please provide complete evidence and resubmit."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "SC-8500",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": null,
                "scopeName": "AML/CFT Compliance",
                "rfis": [
                  {
                    "id": 114,
                    "title": "Statistical Report of STRs/SARs filed, including reasons for reporting",
                    "description": "Provide the statistical report of Suspicious Transaction/Activity Reports (STRs/SARs) filed during the audit period, including the reason for reporting in each case.",
                    "dueDate": "2026-08-31",
                    "ownerValue": "yusuf-al-blooshi",
                    "ownerLabel": "Yusuf Al Blooshi",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Were all STRs/SARs filed within the regulatory reporting timeline?",
                        "answer": "Confirmed and documented: were all STRs/SARs filed within the regulatory reporting timeline — supporting evidence attached.",
                        "dueDate": "2026-08-31"
                      },
                      {
                        "question": "Is there a documented escalation trail from alert to filing decision?",
                        "answer": "Confirmed and documented: is there a documented escalation trail from alert to filing decision — supporting evidence attached.",
                        "dueDate": "2026-08-31"
                      }
                    ],
                    "auditorIds": [
                      "alice",
                      "bob"
                    ],
                    "createdAt": "2026-04-03T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Statistical Report of STRs/SARs filed, including reasons for reporting — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Submitted response is currently awaiting auditor validation.",
                      "responseDocs": [
                        {
                          "name": "statistical_report_of_strs_sars_filed_including_reasons_for__evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Statistical Report of STRs/SARs filed, including reasons for reporting"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-07-02"
                    }
                  }
                ]
              },
              {
                "id": "SC-8501",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": "SC-8500",
                "scopeName": "Policy, Governance & Training",
                "rfis": []
              },
              {
                "id": "SC-8502",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": "SC-8500",
                "scopeName": "Transaction Monitoring, Screening & Risk Assessment",
                "rfis": [
                  {
                    "id": 111,
                    "title": "All AML Rules and Parameters, including status, frequency and risk category",
                    "description": "Provide the full listing of AML transaction-monitoring rules and parameters applied at division level, including each rule's status, run frequency, and associated risk category.",
                    "dueDate": "2026-08-13",
                    "ownerValue": "priya-menon",
                    "ownerLabel": "Priya Menon",
                    "status": "pending",
                    "questionnaire": [
                      {
                        "question": "Are all active rules formally approved and version-controlled?",
                        "dueDate": "2026-08-13"
                      },
                      {
                        "question": "Is rule effectiveness reviewed on a periodic basis?",
                        "dueDate": "2026-08-13"
                      }
                    ],
                    "auditorIds": [
                      "henry",
                      "irene"
                    ],
                    "createdAt": "2026-03-16T08:00:00.000Z",
                    "recordStatus": "active"
                  }
                ]
              },
              {
                "id": "SC-8503",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": "SC-8500",
                "scopeName": "Compliance Reporting & Oversight",
                "rfis": []
              },
              {
                "id": "SC-8600",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": null,
                "scopeName": "Operations and Other subDivisions",
                "rfis": [
                  {
                    "id": 101,
                    "title": "HR Policy",
                    "description": "Provide the current HR Policy document, approved by management, covering recruitment, leave, disciplinary action, and Emiratization commitments.",
                    "dueDate": "2026-06-14",
                    "ownerValue": "sara-al-mazrouei",
                    "ownerLabel": "Sara Al Mazrouei",
                    "status": "pending",
                    "questionnaire": [
                      {
                        "question": "Is the HR Policy formally approved and version-controlled?",
                        "dueDate": "2026-06-14"
                      },
                      {
                        "question": "Does the policy cover Emiratization quota commitments?",
                        "dueDate": "2026-06-14"
                      }
                    ],
                    "auditorIds": [
                      "alice",
                      "bob"
                    ],
                    "createdAt": "2026-01-15T08:00:00.000Z",
                    "recordStatus": "active"
                  },
                  {
                    "id": 102,
                    "title": "HR Dept Structure",
                    "description": "Submit the HR Dept organization chart showing reporting lines, headcount by function, and key role responsibilities.",
                    "dueDate": "2026-06-20",
                    "ownerValue": "sara-al-mazrouei",
                    "ownerLabel": "Sara Al Mazrouei",
                    "status": "overdue",
                    "questionnaire": [
                      {
                        "question": "Is the org chart current as of the audit period?",
                        "dueDate": "2026-06-20"
                      },
                      {
                        "question": "Are reporting lines free of conflicting dual reporting?",
                        "dueDate": "2026-06-20"
                      }
                    ],
                    "auditorIds": [
                      "carol",
                      "david"
                    ],
                    "createdAt": "2026-01-21T08:00:00.000Z",
                    "recordStatus": "active"
                  },
                  {
                    "id": 103,
                    "title": "Employee List with designation, nationality, profession and joining date",
                    "description": "Provide the full employee master listing including designation, nationality, licensed profession, and joining date for all active staff during the audit period.",
                    "dueDate": "2026-06-26",
                    "ownerValue": "sara-al-mazrouei",
                    "ownerLabel": "Sara Al Mazrouei",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Does the listing reconcile to the payroll headcount?",
                        "answer": "Confirmed and documented: does the listing reconcile to the payroll headcount — supporting evidence attached.",
                        "dueDate": "2026-06-26"
                      },
                      {
                        "question": "Are all licensed professions current and validly registered?",
                        "answer": "Confirmed and documented: are all licensed professions current and validly registered — supporting evidence attached.",
                        "dueDate": "2026-06-26"
                      }
                    ],
                    "auditorIds": [
                      "emma",
                      "felix"
                    ],
                    "createdAt": "2026-01-27T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Employee List with designation, nationality, profession and joining date — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Response reviewed and accepted; no further action required.",
                      "responseDocs": [
                        {
                          "name": "employee_list_with_designation_nationality_profession_and_jo_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Employee List with designation, nationality, profession and joining date"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-04-27"
                    }
                  },
                  {
                    "id": 104,
                    "title": "Chief Accountant/CFO CV and Job Description",
                    "description": "Provide the Chief Accountant/CFO's current CV and formal job description, evidencing qualification and scope of authority over the finance function.",
                    "dueDate": "2026-07-02",
                    "ownerValue": "khalid-rahman",
                    "ownerLabel": "Khalid Rahman",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Does the CV evidence the required professional qualification?",
                        "answer": "Confirmed and documented: does the CV evidence the required professional qualification — supporting evidence attached.",
                        "dueDate": "2026-07-02"
                      },
                      {
                        "question": "Is the job description formally signed off by senior management?",
                        "answer": "Confirmed and documented: is the job description formally signed off by senior management — supporting evidence attached.",
                        "dueDate": "2026-07-02"
                      }
                    ],
                    "auditorIds": [
                      "grace",
                      "henry"
                    ],
                    "createdAt": "2026-02-02T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Chief Accountant/CFO CV and Job Description — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Submitted response is currently awaiting auditor validation.",
                      "responseDocs": [
                        {
                          "name": "chief_accountant_cfo_cv_and_job_description_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Chief Accountant/CFO CV and Job Description"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-05-03"
                    }
                  },
                  {
                    "id": 105,
                    "title": "Schedule of Fees",
                    "description": "Submit the current Schedule of Fees applicable to customers, including any recent revisions and the approval trail for each change.",
                    "dueDate": "2026-07-08",
                    "ownerValue": "khalid-rahman",
                    "ownerLabel": "Khalid Rahman",
                    "status": "reopened",
                    "questionnaire": [
                      {
                        "question": "Is the published fee schedule consistent with the approved schedule on file?",
                        "answer": "Confirmed and documented: is the published fee schedule consistent with the approved schedule on file — supporting evidence attached.",
                        "dueDate": "2026-07-08"
                      },
                      {
                        "question": "Were all fee changes approved prior to implementation?",
                        "answer": "Confirmed and documented: were all fee changes approved prior to implementation — supporting evidence attached.",
                        "dueDate": "2026-07-08"
                      }
                    ],
                    "auditorIds": [
                      "irene",
                      "james"
                    ],
                    "createdAt": "2026-02-08T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Schedule of Fees — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Resubmission in progress following the auditor's rejection feedback.",
                      "responseDocs": [
                        {
                          "name": "schedule_of_fees_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Schedule of Fees"
                        }
                      ],
                      "status": "rejected",
                      "submittedAt": "2026-05-09",
                      "rejectedAt": "2026-05-19",
                      "rejectionReason": "The submitted evidence for \"Schedule of Fees\" is incomplete — please provide the missing supporting documents and a full explanation of any exceptions noted, then resubmit."
                    },
                    "responseHistory": [
                      {
                        "responseText": "Schedule of Fees — initial response submitted with partial evidence.",
                        "explanationNotes": "Some supporting documents were still being collected at time of initial submission.",
                        "responseDocs": [
                          {
                            "name": "schedule_of_fees_initial.docx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Initial (partial) evidence for: Schedule of Fees"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Is the published fee schedule consistent with the approved schedule on file?",
                            "answer": "Confirmed and documented: is the published fee schedule consistent with the approved schedule on file — supporting evidence attached."
                          },
                          {
                            "question": "Were all fee changes approved prior to implementation?",
                            "answer": "Confirmed and documented: were all fee changes approved prior to implementation — supporting evidence attached."
                          }
                        ],
                        "submittedAt": "2026-04-29",
                        "rejectedAt": "2026-05-19",
                        "rejectionReason": "The initial submission for \"Schedule of Fees\" was missing key supporting documents. Please provide complete evidence and resubmit."
                      }
                    ]
                  }
                ]
              },
              {
                "id": "SC-8700",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": null,
                "scopeName": "Quality Check — Transaction Monitoring and Sanction Screening Alert Management",
                "rfis": []
              },
              {
                "id": "SC-8800",
                "company": "lulu-international-exchange",
                "divisionCode": "LULU-BR-12",
                "subDivisionName": "Branch 2",
                "parentScopeId": null,
                "scopeName": "Consumer Protection and Market Conduct",
                "rfis": [
                  {
                    "id": 117,
                    "title": "All disclosure documents for customers",
                    "description": "Provide all customer-facing disclosure documents in use during the audit period, supporting transparency and fair customer treatment.",
                    "dueDate": "2026-09-18",
                    "ownerValue": "noora-al-kaabi",
                    "ownerLabel": "Noora Al Kaabi",
                    "status": "overdue",
                    "questionnaire": [
                      {
                        "question": "Are disclosure documents available in all languages required by regulation?",
                        "dueDate": "2026-09-18"
                      },
                      {
                        "question": "Is there evidence customers acknowledge receipt of disclosures?",
                        "dueDate": "2026-09-18"
                      }
                    ],
                    "auditorIds": [
                      "grace",
                      "henry"
                    ],
                    "createdAt": "2026-04-21T08:00:00.000Z",
                    "recordStatus": "active"
                  },
                  {
                    "id": 118,
                    "title": "Complaint Analysis Report",
                    "description": "Provide the Complaint Analysis Report evaluating customer complaints received during the audit period and identifying any recurring issues.",
                    "dueDate": "2026-09-24",
                    "ownerValue": "noora-al-kaabi",
                    "ownerLabel": "Noora Al Kaabi",
                    "status": "completed",
                    "questionnaire": [
                      {
                        "question": "Does the report identify root causes for recurring complaint categories?",
                        "answer": "Confirmed and documented: does the report identify root causes for recurring complaint categories — supporting evidence attached.",
                        "dueDate": "2026-09-24"
                      },
                      {
                        "question": "Were corrective actions tracked to closure?",
                        "answer": "Confirmed and documented: were corrective actions tracked to closure — supporting evidence attached.",
                        "dueDate": "2026-09-24"
                      }
                    ],
                    "auditorIds": [
                      "irene",
                      "james"
                    ],
                    "createdAt": "2026-04-27T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Complaint Analysis Report — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Response reviewed and accepted; no further action required.",
                      "responseDocs": [
                        {
                          "name": "complaint_analysis_report_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Complaint Analysis Report"
                        }
                      ],
                      "status": "accepted",
                      "submittedAt": "2026-07-26"
                    },
                    "responseHistory": [
                      {
                        "responseText": "Complaint Analysis Report — initial response submitted with partial evidence.",
                        "explanationNotes": "Some supporting documents were still being collected at time of initial submission.",
                        "responseDocs": [
                          {
                            "name": "complaint_analysis_report_initial.docx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Initial (partial) evidence for: Complaint Analysis Report"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Does the report identify root causes for recurring complaint categories?",
                            "answer": "Confirmed and documented: does the report identify root causes for recurring complaint categories — supporting evidence attached."
                          },
                          {
                            "question": "Were corrective actions tracked to closure?",
                            "answer": "Confirmed and documented: were corrective actions tracked to closure — supporting evidence attached."
                          }
                        ],
                        "submittedAt": "2026-06-28",
                        "rejectedAt": "2026-07-03",
                        "rejectionReason": "The initial submission for \"Complaint Analysis Report\" was missing key supporting documents. Please provide complete evidence and resubmit."
                      },
                      {
                        "responseText": "Complaint Analysis Report — response prepared with supporting evidence pack, explanations, and sign-off.",
                        "explanationNotes": "Resubmission in progress following the auditor's rejection feedback.",
                        "responseDocs": [
                          {
                            "name": "complaint_analysis_report_resubmission.docx",
                            "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                            "description": "Supporting evidence for: Complaint Analysis Report"
                          }
                        ],
                        "questionnaire": [
                          {
                            "question": "Does the report identify root causes for recurring complaint categories?",
                            "answer": "Confirmed and documented: does the report identify root causes for recurring complaint categories — supporting evidence attached."
                          },
                          {
                            "question": "Were corrective actions tracked to closure?",
                            "answer": "Confirmed and documented: were corrective actions tracked to closure — supporting evidence attached."
                          }
                        ],
                        "submittedAt": "2026-07-13",
                        "rejectedAt": "2026-07-19",
                        "rejectionReason": "The resubmitted evidence for \"Complaint Analysis Report\" is incomplete — please provide the missing supporting documents and a full explanation of any exceptions noted, then resubmit."
                      }
                    ]
                  },
                  {
                    "id": 119,
                    "title": "Complaint Management Policy and Procedure",
                    "description": "Provide the Complaint Management Policy and Procedure defining how customer complaints are handled and escalated.",
                    "dueDate": "2026-09-30",
                    "ownerValue": "noora-al-kaabi",
                    "ownerLabel": "Noora Al Kaabi",
                    "status": "under-review",
                    "questionnaire": [
                      {
                        "question": "Does the policy define clear escalation timelines by complaint severity?",
                        "answer": "Confirmed and documented: does the policy define clear escalation timelines by complaint severity — supporting evidence attached.",
                        "dueDate": "2026-09-30"
                      },
                      {
                        "question": "Is the policy reviewed periodically against regulatory requirements?",
                        "answer": "Confirmed and documented: is the policy reviewed periodically against regulatory requirements — supporting evidence attached.",
                        "dueDate": "2026-09-30"
                      }
                    ],
                    "auditorIds": [
                      "karen",
                      "liam"
                    ],
                    "createdAt": "2026-05-03T08:00:00.000Z",
                    "recordStatus": "active",
                    "response": {
                      "responseText": "Complaint Management Policy and Procedure — response prepared with supporting evidence pack, explanations, and sign-off.",
                      "explanationNotes": "Submitted response is currently awaiting auditor validation.",
                      "responseDocs": [
                        {
                          "name": "complaint_management_policy_and_procedure_evidence.docx",
                          "url": "http://localhost:5251/uploads/Audit_Theory_BRD.docx",
                          "description": "Supporting evidence for: Complaint Management Policy and Procedure"
                        }
                      ],
                      "status": "pending",
                      "submittedAt": "2026-08-01"
                    }
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
