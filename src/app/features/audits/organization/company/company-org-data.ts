/**
 * ============================================================================
 *  Common organization static data
 * ============================================================================
 *  Single source of truth for the Company -> Division -> Sub-Division directory
 *  used across the app (Add Member modal, Companies/Divisions/Sub-Divisions
 *  pages, filters, etc). Import ORG_STATIC_DATA or the helper functions
 *  below instead of hardcoding local copies of companies/divisions/
 *  sub-divisions in individual components.
 *
 *  Source: consolidated from the "static_data_in_departments" mock dataset,
 *  which is the only one of the three original mock files that already
 *  nests Company -> Division -> Sub-Division with stable codes
 *  (divisionCode / subDivisionCode), making it the natural shape for
 *  cascading dropdowns (Company -> Division -> Sub-Division).
 *
 *  NOTE ON DATA RECONCILIATION:
 *  The other two legacy mock files —
 *    - company_data_in_branches.txt (richer branch/division metadata:
 *      license, address, branchType, risk, etc., keyed by branch codes like
 *      "ANJ-BR-01")
 *    - static_data_in_scope.txt (audit scope/task data, keyed by branch
 *      codes like "ANJ-DXB-01" but different department/sub-division names)
 *  were generated independently and do NOT share division codes or
 *  sub-division names 1:1 with this dataset. They were intentionally NOT
 *  merged in here to avoid inventing/guessing data. When those pages move
 *  off mock data (or get a real API), align their division/sub-division
 *  codes to the codes in this file so every page reads from one consistent
 *  Company/Division/Sub-Division directory.
 *
 *  NOTE ON NAMING: this file's own field/type names were renamed from
 *  Branch/Department to Division/Sub-Division (the `id`/`*Code` values,
 *  which are still branch-code-shaped strings like "ANJ-DXB-01", were left
 *  as-is). `ScopeType`'s 'departmental' value was intentionally left
 *  unchanged — it describes an audit scope's breadth (functional /
 *  departmental / independent), not this org directory's hierarchy, and
 *  other pages (Scope Jobs, etc.) not covered by this change may still
 *  compare against the literal string 'departmental'.
 * ============================================================================
 */

export type Industry = 'jewelry' | 'other' | (string & {});

export type SubDivisionType =
  | 'finance'
  | 'human-resources'
  | 'information-technology'
  | 'operations'
  | 'legal-compliance'
  | 'internal-audit'
  | 'risk-management'
  | 'marketing-communications'
  | 'procurement-supply-chain'
  | 'customer-service'
  | 'executive-management'
  | 'administration';

export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type RiskRating = 'low' | 'medium' | 'high';
export type RiskStatus = 'open' | 'monitored' | 'closed';
export type ScopeType = 'functional' | 'departmental' | 'independent';
export type SubScopeType = 'substantive' | 'controls';
export type AuditFrequency = 'quarterly' | 'annually' | 'monthly';

/** A single audit task belonging to a Scope or Sub-scope (see `tasks` below). */
export interface OrgTask {
  taskCode: string;
  taskName: string;
}

export interface OrgSubScope {
  subScopeName: string;
  subScopeType: SubScopeType;
  auditFrequency: AuditFrequency;
  riskRating: RiskRating;
  /** Tasks specific to this sub-scope — takes priority over the parent scope's `tasks` when set. */
  tasks?: OrgTask[];
}

export interface OrgSubDivisionScope {
  scopeName: string;
  scopeType: ScopeType;
  auditFrequency: AuditFrequency;
  riskRating: RiskRating;
  subScopes?: OrgSubScope[];
  /** Tasks for this scope — used to populate the Task dropdown when no sub-scope (or a sub-scope with no tasks of its own) is selected. */
  tasks?: OrgTask[];
}

export interface OrgSubDivision {
  subDivisionCode: string;
  subDivisionName: string;
  subDivisionType: SubDivisionType;
  company: string;
  status: EntityStatus;
  riskRating: RiskRating;
  riskStatus: RiskStatus;
  primaryContactPerson: string | null;
  contactEmail: string;
  contactPhone: string;
  description: string;
  subDivisionHead: string | null;
  numberOfEmployees: number;
  operationalSince: string;
  parentSubDivisions: string[];
  scopes: OrgSubDivisionScope[];
  createdAt: string;
}

export interface OrgDivision {
  divisionCode: string;
  divisionName: string;
  hasSubDivision?: boolean;
  /** Division-level scopes — used instead of a sub-division's scopes when `hasSubDivision` is false. */
  scopes?: OrgSubDivisionScope[];
  subDivisions: OrgSubDivision[];
}

export interface OrgCompany {
  id: string;
  companyName: string;
  tag: string;
  color: string;
  industry: Industry;
  divisions: OrgDivision[];
}

export interface OrgOption {
  label: string;
  value: string;
}

/** The full Company -> Division -> Sub-Division directory. */
export const ORG_STATIC_DATA: OrgCompany[] = [
  {
    "id": "al-noor-jewellery",
    "companyName": "Al Noor Jewellery Group",
    "tag": "ANJ",
    "color": "#b8860b",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "ANJ-DXB-01",
        "divisionName": "Deira Gold Souk Flagship",
        "hasSubDivision": true,
        "scopes": [
          {
            "scopeName": "Financial Statement Audit",
            "scopeType": "functional",
            "auditFrequency": "quarterly",
            "riskRating": "low",
            "subScopes": [
              {
                "subScopeName": "Cash & Bank Testing",
                "subScopeType": "substantive",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-CBT-1",
                    "taskName": "Confirm bank balances directly with banks"
                  },
                  {
                    "taskCode": "TSK-CBT-2",
                    "taskName": "Test bank reconciliation preparation"
                  },
                  {
                    "taskCode": "TSK-CBT-3",
                    "taskName": "Review outstanding cheque listings"
                  },
                  {
                    "taskCode": "TSK-CBT-4",
                    "taskName": "Verify petty cash count and controls"
                  }
                ]
              }
            ],
            "tasks": [
              {
                "taskCode": "TSK-FSA-1",
                "taskName": "Review general ledger reconciliations"
              },
              {
                "taskCode": "TSK-FSA-2",
                "taskName": "Test revenue cut-off procedures"
              },
              {
                "taskCode": "TSK-FSA-3",
                "taskName": "Confirm bank balances with third parties"
              },
              {
                "taskCode": "TSK-FSA-4",
                "taskName": "Vouch significant journal entries"
              },
              {
                "taskCode": "TSK-FSA-5",
                "taskName": "Review disclosure checklist compliance"
              }
            ]
          }
        ],
        "subDivisions": [
          {
            "subDivisionCode": "ANJ-DXB-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "finance",
            "company": "al-noor-jewellery",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.operations@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551000",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 8,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-23T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-DXB-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "human-resources",
            "company": "al-noor-jewellery",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "gold.diamond.sourcing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551037",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 13,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-23T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-DXB-01-D3",
            "subDivisionName": "Hallmarking & Certification",
            "subDivisionType": "information-technology",
            "company": "al-noor-jewellery",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "hallmarking.certification@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551074",
            "description": "Hallmarking & Certification sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 18,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-24T02:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-DXB-01-D4",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "operations",
            "company": "al-noor-jewellery",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551111",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 23,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-24T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-DXB-01-D5",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "legal-compliance",
            "company": "al-noor-jewellery",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "finance.accounting@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551148",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 28,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-24T14:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "ANJ-SHJ-01",
        "divisionName": "Sharjah Showroom",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ANJ-SHJ-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "internal-audit",
            "company": "al-noor-jewellery",
            "status": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.operations@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551185",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 33,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-24T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ANJ-SHJ-01-D2",
            "subDivisionName": "Loss Prevention & Security",
            "subDivisionType": "risk-management",
            "company": "al-noor-jewellery",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "loss.prevention.security@al-noor-jewellery.com",
            "contactPhone": "+971-4-2551222",
            "description": "Loss Prevention & Security sub-division, responsible for day-to-day operations and controls at al-noor-jewellery.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 38,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "zumurrud-diamonds",
    "companyName": "Zumurrud Diamonds LLC",
    "tag": "ZUM",
    "color": "#0e9488",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "ZUM-DXB-01",
        "divisionName": "Dubai Design District Studio",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "ZUM-DXB-01-D1",
            "subDivisionName": "Design & Merchandising",
            "subDivisionType": "marketing-communications",
            "company": "zumurrud-diamonds",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "design.merchandising@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551259",
            "description": "Design & Merchandising sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 43,
            "operationalSince": "2017-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T08:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-DXB-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "procurement-supply-chain",
            "company": "zumurrud-diamonds",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "gold.diamond.sourcing@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551296",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 48,
            "operationalSince": "2018-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T14:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-DXB-01-D3",
            "subDivisionName": "E-Commerce",
            "subDivisionType": "customer-service",
            "company": "zumurrud-diamonds",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "e.commerce@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551333",
            "description": "E-Commerce sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": null,
            "numberOfEmployees": 53,
            "operationalSince": "2019-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-25T20:00:00.000Z"
          },
          {
            "subDivisionCode": "ZUM-DXB-01-D4",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "executive-management",
            "company": "zumurrud-diamonds",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "finance.accounting@zumurrud-diamonds.com",
            "contactPhone": "+971-4-2551370",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at zumurrud-diamonds.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 58,
            "operationalSince": "2020-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "falcon-gulf-jewellery",
    "companyName": "Falcon Gulf Jewellery Trading",
    "tag": "FGJ",
    "color": "#a13d63",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "FGJ-AUH-01",
        "divisionName": "Abu Dhabi Corniche Showroom",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "FGJ-AUH-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "administration",
            "company": "falcon-gulf-jewellery",
            "status": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "retail.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551407",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 63,
            "operationalSince": "2021-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T08:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-AUH-01-D2",
            "subDivisionName": "Showroom Operations",
            "subDivisionType": "finance",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "showroom.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551444",
            "description": "Showroom Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 8,
            "operationalSince": "2022-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T14:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-AUH-01-D3",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "human-resources",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "inventory.warehousing@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551481",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 13,
            "operationalSince": "2023-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-26T20:00:00.000Z"
          }
        ]
      },
      {
        "divisionCode": "FGJ-AAN-01",
        "divisionName": "Al Ain Branch",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "FGJ-AAN-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "information-technology",
            "company": "falcon-gulf-jewellery",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-001",
            "contactEmail": "retail.operations@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551518",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 18,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-27T02:00:00.000Z"
          },
          {
            "subDivisionCode": "FGJ-AAN-01-D2",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "operations",
            "company": "falcon-gulf-jewellery",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-002",
            "contactEmail": "finance.accounting@falcon-gulf-jewellery.com",
            "contactPhone": "+971-4-2551555",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at falcon-gulf-jewellery.",
            "subDivisionHead": null,
            "numberOfEmployees": 23,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-27T08:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "marwa-gold-gems",
    "companyName": "Marwa Gold & Gems",
    "tag": "MGG",
    "color": "#c98a1a",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "MGG-AJM-01",
        "divisionName": "Ajman Central Souk",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "MGG-AJM-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "legal-compliance",
            "company": "marwa-gold-gems",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-003",
            "contactEmail": "retail.operations@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551592",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 28,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-27T14:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-AJM-01-D2",
            "subDivisionName": "Hallmarking & Certification",
            "subDivisionType": "internal-audit",
            "company": "marwa-gold-gems",
            "status": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-004",
            "contactEmail": "hallmarking.certification@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551629",
            "description": "Hallmarking & Certification sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 33,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-27T20:00:00.000Z"
          },
          {
            "subDivisionCode": "MGG-AJM-01-D3",
            "subDivisionName": "Human Resources",
            "subDivisionType": "risk-management",
            "company": "marwa-gold-gems",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-005",
            "contactEmail": "human.resources@marwa-gold-gems.com",
            "contactPhone": "+971-4-2551666",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at marwa-gold-gems.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 38,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "kanz-al-emarat",
    "companyName": "Kanz Al Emarat Jewellery",
    "tag": "KAE",
    "color": "#7a1ac4",
    "industry": "jewelry",
    "divisions": [
      {
        "divisionCode": "KAE-RAK-01",
        "divisionName": "Ras Al Khaimah Showroom",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "KAE-RAK-01-D1",
            "subDivisionName": "Retail Operations",
            "subDivisionType": "marketing-communications",
            "company": "kanz-al-emarat",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-006",
            "contactEmail": "retail.operations@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551703",
            "description": "Retail Operations sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 43,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T08:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-RAK-01-D2",
            "subDivisionName": "Gold & Diamond Sourcing",
            "subDivisionType": "procurement-supply-chain",
            "company": "kanz-al-emarat",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-007",
            "contactEmail": "gold.diamond.sourcing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551740",
            "description": "Gold & Diamond Sourcing sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 48,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T14:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-RAK-01-D3",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "customer-service",
            "company": "kanz-al-emarat",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-001",
            "contactEmail": "finance.accounting@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551777",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 53,
            "operationalSince": "2017-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-28T20:00:00.000Z"
          },
          {
            "subDivisionCode": "KAE-RAK-01-D4",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "executive-management",
            "company": "kanz-al-emarat",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-002",
            "contactEmail": "inventory.warehousing@kanz-al-emarat.com",
            "contactPhone": "+971-4-2551814",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at kanz-al-emarat.",
            "subDivisionHead": null,
            "numberOfEmployees": 58,
            "operationalSince": "2018-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "desert-rose-retail",
    "companyName": "Desert Rose Retail Group",
    "tag": "DRR",
    "color": "#1a9dc4",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "DRR-DXB-01",
        "divisionName": "Dubai Mall Flagship",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "DRR-DXB-01-D1",
            "subDivisionName": "Sales & Marketing",
            "subDivisionType": "administration",
            "company": "desert-rose-retail",
            "status": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-003",
            "contactEmail": "sales.marketing@desert-rose-retail.com",
            "contactPhone": "+971-4-2551851",
            "description": "Sales & Marketing sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 63,
            "operationalSince": "2019-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T08:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-DXB-01-D2",
            "subDivisionName": "Inventory & Warehousing",
            "subDivisionType": "finance",
            "company": "desert-rose-retail",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-004",
            "contactEmail": "inventory.warehousing@desert-rose-retail.com",
            "contactPhone": "+971-4-2551888",
            "description": "Inventory & Warehousing sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 8,
            "operationalSince": "2020-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "annually",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T14:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-DXB-01-D3",
            "subDivisionName": "Customer Service",
            "subDivisionType": "human-resources",
            "company": "desert-rose-retail",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-005",
            "contactEmail": "customer.service@desert-rose-retail.com",
            "contactPhone": "+971-4-2551925",
            "description": "Customer Service sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": null,
            "numberOfEmployees": 13,
            "operationalSince": "2021-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              },
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-29T20:00:00.000Z"
          },
          {
            "subDivisionCode": "DRR-DXB-01-D4",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "information-technology",
            "company": "desert-rose-retail",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-006",
            "contactEmail": "finance.accounting@desert-rose-retail.com",
            "contactPhone": "+971-4-2551962",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at desert-rose-retail.",
            "subDivisionHead": "user-005",
            "numberOfEmployees": 18,
            "operationalSince": "2022-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Payroll Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Sampling & Substantive Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-SST-1",
                        "taskName": "Select statistical sample for testing"
                      },
                      {
                        "taskCode": "TSK-SST-2",
                        "taskName": "Perform substantive analytical procedures"
                      },
                      {
                        "taskCode": "TSK-SST-3",
                        "taskName": "Test sampled items for accuracy"
                      },
                      {
                        "taskCode": "TSK-SST-4",
                        "taskName": "Extrapolate and evaluate sample results"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-PAY-1",
                    "taskName": "Test payroll calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-PAY-2",
                    "taskName": "Review new hire and termination processing"
                  },
                  {
                    "taskCode": "TSK-PAY-3",
                    "taskName": "Verify overtime approval controls"
                  },
                  {
                    "taskCode": "TSK-PAY-4",
                    "taskName": "Reconcile payroll to general ledger"
                  },
                  {
                    "taskCode": "TSK-PAY-5",
                    "taskName": "Review statutory deduction compliance"
                  }
                ]
              },
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              },
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-30T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "gulf-horizon-logistics",
    "companyName": "Gulf Horizon Logistics",
    "tag": "GHL",
    "color": "#4a4a4a",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "GHL-JAFZ-01",
        "divisionName": "Jebel Ali Free Zone HQ",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "GHL-JAFZ-01-D1",
            "subDivisionName": "Operations",
            "subDivisionType": "operations",
            "company": "gulf-horizon-logistics",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-007",
            "contactEmail": "operations@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2551999",
            "description": "Operations sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-006",
            "numberOfEmployees": 23,
            "operationalSince": "2023-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Revenue Recognition Review",
                "scopeType": "departmental",
                "auditFrequency": "monthly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-REV-1",
                    "taskName": "Test revenue recognition timing"
                  },
                  {
                    "taskCode": "TSK-REV-2",
                    "taskName": "Review contract modification treatment"
                  },
                  {
                    "taskCode": "TSK-REV-3",
                    "taskName": "Verify discount and rebate accounting"
                  },
                  {
                    "taskCode": "TSK-REV-4",
                    "taskName": "Assess variable consideration estimates"
                  },
                  {
                    "taskCode": "TSK-REV-5",
                    "taskName": "Review credit note approval process"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-30T08:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-JAFZ-01-D2",
            "subDivisionName": "Procurement & Supply Chain",
            "subDivisionType": "legal-compliance",
            "company": "gulf-horizon-logistics",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-001",
            "contactEmail": "procurement.supply.chain@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552036",
            "description": "Procurement & Supply Chain sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-007",
            "numberOfEmployees": 28,
            "operationalSince": "2010-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Fixed Assets Verification",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Control Design Assessment",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-CDA-1",
                        "taskName": "Evaluate control design against risk"
                      },
                      {
                        "taskCode": "TSK-CDA-2",
                        "taskName": "Assess preventive vs detective control mix"
                      },
                      {
                        "taskCode": "TSK-CDA-3",
                        "taskName": "Review control ownership and accountability"
                      },
                      {
                        "taskCode": "TSK-CDA-4",
                        "taskName": "Benchmark controls against best practice"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FAV-1",
                    "taskName": "Perform physical verification of assets"
                  },
                  {
                    "taskCode": "TSK-FAV-2",
                    "taskName": "Test depreciation calculation accuracy"
                  },
                  {
                    "taskCode": "TSK-FAV-3",
                    "taskName": "Review capitalization vs expense classification"
                  },
                  {
                    "taskCode": "TSK-FAV-4",
                    "taskName": "Verify asset disposal documentation"
                  },
                  {
                    "taskCode": "TSK-FAV-5",
                    "taskName": "Reconcile fixed asset register to GL"
                  }
                ]
              },
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-30T14:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-JAFZ-01-D3",
            "subDivisionName": "Information Technology",
            "subDivisionType": "internal-audit",
            "company": "gulf-horizon-logistics",
            "status": "archived",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-002",
            "contactEmail": "information.technology@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552073",
            "description": "Information Technology sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": null,
            "numberOfEmployees": 33,
            "operationalSince": "2011-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Related Party Transactions Review",
                "scopeType": "independent",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-RPT-1",
                    "taskName": "Identify related party relationships"
                  },
                  {
                    "taskCode": "TSK-RPT-2",
                    "taskName": "Test arm's length pricing evidence"
                  },
                  {
                    "taskCode": "TSK-RPT-3",
                    "taskName": "Review related party disclosure completeness"
                  },
                  {
                    "taskCode": "TSK-RPT-4",
                    "taskName": "Verify board approval of related party deals"
                  },
                  {
                    "taskCode": "TSK-RPT-5",
                    "taskName": "Assess related party loan terms"
                  }
                ]
              },
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              },
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-30T20:00:00.000Z"
          },
          {
            "subDivisionCode": "GHL-JAFZ-01-D4",
            "subDivisionName": "Human Resources",
            "subDivisionType": "risk-management",
            "company": "gulf-horizon-logistics",
            "status": "active",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-003",
            "contactEmail": "human.resources@gulf-horizon-logistics.com",
            "contactPhone": "+971-4-2552110",
            "description": "Human Resources sub-division, responsible for day-to-day operations and controls at gulf-horizon-logistics.",
            "subDivisionHead": "user-001",
            "numberOfEmployees": 38,
            "operationalSince": "2012-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Financial Statement Audit",
                "scopeType": "functional",
                "auditFrequency": "annually",
                "riskRating": "low",
                "subScopes": [
                  {
                    "subScopeName": "Cash & Bank Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "medium",
                    "tasks": [
                      {
                        "taskCode": "TSK-CBT-1",
                        "taskName": "Confirm bank balances directly with banks"
                      },
                      {
                        "taskCode": "TSK-CBT-2",
                        "taskName": "Test bank reconciliation preparation"
                      },
                      {
                        "taskCode": "TSK-CBT-3",
                        "taskName": "Review outstanding cheque listings"
                      },
                      {
                        "taskCode": "TSK-CBT-4",
                        "taskName": "Verify petty cash count and controls"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-FSA-1",
                    "taskName": "Review general ledger reconciliations"
                  },
                  {
                    "taskCode": "TSK-FSA-2",
                    "taskName": "Test revenue cut-off procedures"
                  },
                  {
                    "taskCode": "TSK-FSA-3",
                    "taskName": "Confirm bank balances with third parties"
                  },
                  {
                    "taskCode": "TSK-FSA-4",
                    "taskName": "Vouch significant journal entries"
                  },
                  {
                    "taskCode": "TSK-FSA-5",
                    "taskName": "Review disclosure checklist compliance"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T02:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": "al-waha-construction",
    "companyName": "Al Waha Construction & Contracting",
    "tag": "AWC",
    "color": "#8a5a1a",
    "industry": "other",
    "divisions": [
      {
        "divisionCode": "AWC-DXB-01",
        "divisionName": "Dubai Investment Park Office",
        "hasSubDivision": true,
        "subDivisions": [
          {
            "subDivisionCode": "AWC-DXB-01-D1",
            "subDivisionName": "Operations",
            "subDivisionType": "marketing-communications",
            "company": "al-waha-construction",
            "status": "active",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-004",
            "contactEmail": "operations@al-waha-construction.com",
            "contactPhone": "+971-4-2552147",
            "description": "Operations sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-002",
            "numberOfEmployees": 43,
            "operationalSince": "2013-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Internal Controls Review",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "medium",
                "tasks": [
                  {
                    "taskCode": "TSK-ICR-1",
                    "taskName": "Walkthrough of key financial controls"
                  },
                  {
                    "taskCode": "TSK-ICR-2",
                    "taskName": "Test operating effectiveness of controls"
                  },
                  {
                    "taskCode": "TSK-ICR-3",
                    "taskName": "Evaluate segregation of duties"
                  },
                  {
                    "taskCode": "TSK-ICR-4",
                    "taskName": "Review control self-assessment results"
                  },
                  {
                    "taskCode": "TSK-ICR-5",
                    "taskName": "Document control deficiencies"
                  }
                ]
              },
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T08:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-DXB-01-D2",
            "subDivisionName": "Legal & Governance",
            "subDivisionType": "procurement-supply-chain",
            "company": "al-waha-construction",
            "status": "active",
            "riskRating": "high",
            "riskStatus": "closed",
            "primaryContactPerson": "user-005",
            "contactEmail": "legal.governance@al-waha-construction.com",
            "contactPhone": "+971-4-2552184",
            "description": "Legal & Governance sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": null,
            "numberOfEmployees": 48,
            "operationalSince": "2014-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "AML/CFT Compliance Review",
                "scopeType": "departmental",
                "auditFrequency": "quarterly",
                "riskRating": "high",
                "subScopes": [
                  {
                    "subScopeName": "Walkthrough Testing",
                    "subScopeType": "controls",
                    "auditFrequency": "annually",
                    "riskRating": "low",
                    "tasks": [
                      {
                        "taskCode": "TSK-WKT-1",
                        "taskName": "Trace a sample transaction end-to-end"
                      },
                      {
                        "taskCode": "TSK-WKT-2",
                        "taskName": "Interview process owners on control operation"
                      },
                      {
                        "taskCode": "TSK-WKT-3",
                        "taskName": "Document process flow and control points"
                      },
                      {
                        "taskCode": "TSK-WKT-4",
                        "taskName": "Identify gaps versus documented procedures"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-AML-1",
                    "taskName": "Review customer due diligence files"
                  },
                  {
                    "taskCode": "TSK-AML-2",
                    "taskName": "Test transaction monitoring alerts"
                  },
                  {
                    "taskCode": "TSK-AML-3",
                    "taskName": "Assess suspicious activity report filings"
                  },
                  {
                    "taskCode": "TSK-AML-4",
                    "taskName": "Review sanctions screening process"
                  },
                  {
                    "taskCode": "TSK-AML-5",
                    "taskName": "Evaluate AML training completion records"
                  }
                ]
              },
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              },
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T14:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-DXB-01-D3",
            "subDivisionName": "Finance & Accounting",
            "subDivisionType": "customer-service",
            "company": "al-waha-construction",
            "status": "inactive",
            "riskRating": "low",
            "riskStatus": "open",
            "primaryContactPerson": "user-006",
            "contactEmail": "finance.accounting@al-waha-construction.com",
            "contactPhone": "+971-4-2552221",
            "description": "Finance & Accounting sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-003",
            "numberOfEmployees": 53,
            "operationalSince": "2015-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "IT General Controls Audit",
                "scopeType": "functional",
                "auditFrequency": "quarterly",
                "riskRating": "low",
                "tasks": [
                  {
                    "taskCode": "TSK-ITG-1",
                    "taskName": "Review user access provisioning"
                  },
                  {
                    "taskCode": "TSK-ITG-2",
                    "taskName": "Test change management process"
                  },
                  {
                    "taskCode": "TSK-ITG-3",
                    "taskName": "Evaluate backup and recovery procedures"
                  },
                  {
                    "taskCode": "TSK-ITG-4",
                    "taskName": "Review system security configurations"
                  },
                  {
                    "taskCode": "TSK-ITG-5",
                    "taskName": "Assess IT incident response logs"
                  }
                ]
              }
            ],
            "createdAt": "2026-05-31T20:00:00.000Z"
          },
          {
            "subDivisionCode": "AWC-DXB-01-D4",
            "subDivisionName": "Quality Assurance",
            "subDivisionType": "executive-management",
            "company": "al-waha-construction",
            "status": "pending",
            "riskRating": "medium",
            "riskStatus": "monitored",
            "primaryContactPerson": "user-007",
            "contactEmail": "quality.assurance@al-waha-construction.com",
            "contactPhone": "+971-4-2552258",
            "description": "Quality Assurance sub-division, responsible for day-to-day operations and controls at al-waha-construction.",
            "subDivisionHead": "user-004",
            "numberOfEmployees": 58,
            "operationalSince": "2016-01-01",
            "parentSubDivisions": [],
            "scopes": [
              {
                "scopeName": "Inventory Verification",
                "scopeType": "independent",
                "auditFrequency": "annually",
                "riskRating": "medium",
                "subScopes": [
                  {
                    "subScopeName": "Data Analytics Testing",
                    "subScopeType": "substantive",
                    "auditFrequency": "quarterly",
                    "riskRating": "high",
                    "tasks": [
                      {
                        "taskCode": "TSK-DAT-1",
                        "taskName": "Run full-population exception analytics"
                      },
                      {
                        "taskCode": "TSK-DAT-2",
                        "taskName": "Identify duplicate payment patterns"
                      },
                      {
                        "taskCode": "TSK-DAT-3",
                        "taskName": "Test Benford's law on transaction amounts"
                      },
                      {
                        "taskCode": "TSK-DAT-4",
                        "taskName": "Visualize outliers for follow-up review"
                      }
                    ]
                  }
                ],
                "tasks": [
                  {
                    "taskCode": "TSK-INV-1",
                    "taskName": "Observe physical inventory count"
                  },
                  {
                    "taskCode": "TSK-INV-2",
                    "taskName": "Test inventory valuation methodology"
                  },
                  {
                    "taskCode": "TSK-INV-3",
                    "taskName": "Review slow-moving and obsolete stock"
                  },
                  {
                    "taskCode": "TSK-INV-4",
                    "taskName": "Reconcile perpetual inventory records"
                  },
                  {
                    "taskCode": "TSK-INV-5",
                    "taskName": "Verify inventory in transit"
                  }
                ]
              },
              {
                "scopeName": "Procurement Audit",
                "scopeType": "functional",
                "auditFrequency": "monthly",
                "riskRating": "high",
                "tasks": [
                  {
                    "taskCode": "TSK-PRC-1",
                    "taskName": "Review vendor onboarding controls"
                  },
                  {
                    "taskCode": "TSK-PRC-2",
                    "taskName": "Test purchase order approval workflow"
                  },
                  {
                    "taskCode": "TSK-PRC-3",
                    "taskName": "Verify three-way match compliance"
                  },
                  {
                    "taskCode": "TSK-PRC-4",
                    "taskName": "Assess vendor master data accuracy"
                  },
                  {
                    "taskCode": "TSK-PRC-5",
                    "taskName": "Review contract renewal procedures"
                  }
                ]
              }
            ],
            "createdAt": "2026-06-01T02:00:00.000Z"
          }
        ]
      }
    ]
  }
];

/* ============================================================
 *  Lookup helpers — use these from components instead of
 *  re-implementing the same .find()/.flatMap() logic everywhere.
 * ============================================================ */

export function getCompany(companyId: string | null | undefined): OrgCompany | undefined {
  if (!companyId) return undefined;
  return ORG_STATIC_DATA.find(c => c.id === companyId);
}

export function getDivisionsForCompany(companyId: string | null | undefined): OrgDivision[] {
  return getCompany(companyId)?.divisions ?? [];
}

export function getDivision(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
): OrgDivision | undefined {
  if (!divisionCode) return undefined;
  return getDivisionsForCompany(companyId).find(b => b.divisionCode === divisionCode);
}

export function getSubDivisionsForDivision(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
): OrgSubDivision[] {
  return getDivision(companyId, divisionCode)?.subDivisions ?? [];
}

/** All sub-divisions for a company, across every division (e.g. when no division is selected yet). */
export function getSubDivisionsForCompany(companyId: string | null | undefined): OrgSubDivision[] {
  return getDivisionsForCompany(companyId).flatMap(b => b.subDivisions);
}

export function toCompanyOptions(): OrgOption[] {
  return ORG_STATIC_DATA
    .map(c => ({ label: c.companyName, value: c.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function toDivisionOptions(companyId: string | null | undefined): OrgOption[] {
  return getDivisionsForCompany(companyId)
    .map(b => ({ label: b.divisionName, value: b.divisionCode }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function toSubDivisionOptions(
  companyId: string | null | undefined,
  divisionCode: string | null | undefined,
): OrgOption[] {
  return getSubDivisionsForDivision(companyId, divisionCode)
    .map(d => ({ label: d.subDivisionName, value: d.subDivisionCode }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Anything that carries scopes — a sub-division, or a division with no sub-divisions. */
export type ScopeSource = { scopes?: OrgSubDivisionScope[] };

/**
 * The Scope record within `subDivision.scopes` matching `scopeName`, or
 * undefined. Scope names repeat across sub-divisions (there's a fixed set of
 * ~10 scope templates reused company-wide), so this is a plain name lookup
 * scoped to whichever sub-division the caller already resolved.
 */
export function getScope(
  subDivision: ScopeSource | null | undefined,
  scopeName: string | null | undefined,
): OrgSubDivisionScope | undefined {
  if (!scopeName) return undefined;
  return subDivision?.scopes?.find(s => s.scopeName === scopeName);
}

/**
 * The Sub-scope record within `scope.subScopes` matching `subScopeName`, or
 * undefined.
 */
export function getSubScope(
  scope: OrgSubDivisionScope | null | undefined,
  subScopeName: string | null | undefined,
): OrgSubScope | undefined {
  if (!subScopeName) return undefined;
  return scope?.subScopes?.find(s => s.subScopeName === subScopeName);
}

/**
 * Tasks for the Task dropdown given the selected Scope (and, when picked, a
 * more specific Sub-scope). A Sub-scope's own `tasks` take priority when
 * present; otherwise this falls back to the parent Scope's `tasks`. Returns
 * [] when the sub-division/scope hasn't been resolved yet.
 */
export function getTasksForSelection(
  subDivision: ScopeSource | null | undefined,
  scopeName: string | null | undefined,
  subScopeName: string | null | undefined,
): OrgTask[] {
  const scope = getScope(subDivision, scopeName);
  const subScope = getSubScope(scope, subScopeName);
  if (subScope?.tasks?.length) return subScope.tasks;
  return scope?.tasks ?? [];
}

export function toTaskOptions(
  subDivision: ScopeSource | null | undefined,
  scopeName: string | null | undefined,
  subScopeName: string | null | undefined,
): OrgOption[] {
  return getTasksForSelection(subDivision, scopeName, subScopeName)
    .map(t => ({ label: `${t.taskCode} — ${t.taskName}`, value: t.taskCode }));
}