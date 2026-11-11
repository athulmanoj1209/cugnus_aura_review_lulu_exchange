/* ── Dropdown options, display labels, icons & colours for risk values ──
 * The label maps used by the list/profile/import screens are derived from
 * the dropdown options below, so a code always resolves to the same text
 * the user picked in the Add/Edit Risk form.
 */

import type {
  ControlEffectiveness,
  ResidualLevel,
  RiskStatus,
  RiskType,
} from '../models/risk.model';
import {
  RiskControlEffectiveness,
  RiskFilterKeys,
  RiskResidualLevels,
  RiskSortDirections,
  RiskStatuses,
  RiskTypes,
  RISK_SCALE_VALUES,
  type RiskFilterKey,
  type RiskSortDirection,
} from './risk.constants';

export interface RiskOption<T = string> {
  label: string;
  value: T;
}

const toLabelMap = <T extends string>(options: RiskOption<T>[]): Record<T, string> =>
  Object.fromEntries(options.map(o => [o.value, o.label])) as Record<T, string>;

/* ── Dropdown options ─────────────────────────────────────────────────── */

export const RISK_TYPE_OPTIONS: RiskOption<RiskType>[] = [
  { label: 'Strategic',    value: RiskTypes.Strategic    },
  { label: 'Operational',  value: RiskTypes.Operational  },
  { label: 'Financial',    value: RiskTypes.Financial    },
  { label: 'Compliance',   value: RiskTypes.Compliance   },
  { label: 'IT',           value: RiskTypes.IT           },
  { label: 'AML / CFT',    value: RiskTypes.AmlCft       },
  { label: 'Reputational', value: RiskTypes.Reputational },
  { label: 'Other',        value: RiskTypes.Other        },
];

/** Risk Level filter (highest first). */
export const RISK_RESIDUAL_LEVEL_OPTIONS: RiskOption<ResidualLevel>[] = [
  { label: 'High',   value: RiskResidualLevels.High   },
  { label: 'Medium', value: RiskResidualLevels.Medium },
  { label: 'Low',    value: RiskResidualLevels.Low    },
];

/** Status filter on the Risk Register (includes deactivated risks). */
export const RISK_STATUS_OPTIONS: RiskOption<RiskStatus>[] = [
  { label: 'Open',        value: RiskStatuses.Open        },
  { label: 'Monitored',   value: RiskStatuses.Monitored   },
  { label: 'Closed',      value: RiskStatuses.Closed      },
  { label: 'Deactivated', value: RiskStatuses.Deactivated },
];

/** Statuses a user can pick on the Add/Edit Risk form. */
export const RISK_FORM_STATUS_OPTIONS: RiskOption<RiskStatus>[] =
  RISK_STATUS_OPTIONS.filter(o => o.value !== RiskStatuses.Deactivated);

export const RISK_CONTROL_EFFECTIVENESS_OPTIONS: RiskOption<ControlEffectiveness>[] = [
  { label: 'Strong',   value: RiskControlEffectiveness.Strong   },
  { label: 'Moderate', value: RiskControlEffectiveness.Moderate },
  { label: 'Weak',     value: RiskControlEffectiveness.Weak     },
];

/** Impact / Likelihood dropdowns (1–5). */
export const RISK_SCALE_OPTIONS: RiskOption<number>[] =
  RISK_SCALE_VALUES.map(n => ({ label: String(n), value: n }));

export const RISK_OWNER_OPTIONS: RiskOption[] = [
  { label: 'Finance Manager',    value: 'Finance Manager'    },
  { label: 'IT Manager',         value: 'IT Manager'         },
  { label: 'HR Director',        value: 'HR Director'        },
  { label: 'Compliance Officer', value: 'Compliance Officer' },
  { label: 'IT Security Lead',   value: 'IT Security Lead'   },
  { label: 'COO',                value: 'COO'                },
  { label: 'CISO',               value: 'CISO'               },
];

/* ── Label maps (code → display text) ─────────────────────────────────── */

export const RISK_TYPE_LABELS = toLabelMap(RISK_TYPE_OPTIONS);

export const RISK_STATUS_LABELS = toLabelMap(RISK_STATUS_OPTIONS);

export const RISK_CONTROL_EFFECTIVENESS_LABELS = toLabelMap(RISK_CONTROL_EFFECTIVENESS_OPTIONS);

/**
 * Risk.riskType → Risk Approvals' "category" label. The two lists don't
 * share an enum, so this is a best-effort mapping; 'aml_cft' has no
 * dedicated category on the approvals side so it's folded into
 * 'Compliance', and 'other' falls back to 'Operational'.
 */
export const RISK_TYPE_CATEGORY_LABELS: Record<RiskType, string> = {
  strategic: 'Strategic',
  operational: 'Operational',
  financial: 'Financial',
  compliance: 'Compliance',
  it: 'IT / Cyber',
  aml_cft: 'Compliance',
  reputational: 'Reputational',
  other: 'Operational',
};

export const RISK_DEFAULT_CATEGORY_LABEL = 'Operational';

/** Heat-map Y axis (impact 1–5). */
export const RISK_IMPACT_LABELS: Record<number, string> = {
  5: 'Catastrophic', 4: 'Major', 3: 'Moderate', 2: 'Minor', 1: 'Negligible',
};

/** Heat-map X axis (likelihood 1–5). */
export const RISK_LIKELIHOOD_LABELS: Record<number, string> = {
  1: 'Rare', 2: 'Unlikely', 3: 'Possible', 4: 'Likely', 5: 'Almost Certain',
};

/** Prefix of each active-filter chip on the Risk Register. */
export const RISK_FILTER_CHIP_LABELS: Record<RiskFilterKey, string> = {
  [RiskFilterKeys.Companies]: 'Company',
  [RiskFilterKeys.Branches]: 'Division',
  [RiskFilterKeys.Depts]: 'Dept',
  [RiskFilterKeys.Types]: 'Type',
  [RiskFilterKeys.Levels]: 'Level',
  [RiskFilterKeys.Statuses]: 'Status',
  [RiskFilterKeys.Owners]: 'Owner',
};

/* ── Icons ────────────────────────────────────────────────────────────── */

export const RISK_RESIDUAL_LEVEL_ICONS: Record<ResidualLevel, string> = {
  high: 'pi-arrow-up',
  medium: 'pi-minus',
  low: 'pi-arrow-down',
};

export const RISK_SORT_ICONS: Record<RiskSortDirection, string> = {
  [RiskSortDirections.Asc]: 'pi-arrow-up',
  [RiskSortDirections.Desc]: 'pi-arrow-down',
};

/** File-type icon of a supporting document, by extension. */
export const RISK_FILE_ICONS = {
  Pdf: 'pi-file-pdf',
  Word: 'pi-file-word',
  Excel: 'pi-file-excel',
  Default: 'pi-file',
} as const;

export const RISK_WORD_EXTENSIONS = ['doc', 'docx'];
export const RISK_EXCEL_EXTENSIONS = ['xls', 'xlsx'];

/** Icon for a supporting document's file name. */
export function riskFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return RISK_FILE_ICONS.Pdf;
  if (RISK_WORD_EXTENSIONS.includes(ext)) return RISK_FILE_ICONS.Word;
  if (RISK_EXCEL_EXTENSIONS.includes(ext)) return RISK_FILE_ICONS.Excel;
  return RISK_FILE_ICONS.Default;
}

/* ── Colours ──────────────────────────────────────────────────────────── */

/** Text colour of a score, by the level it falls in. */
export const RISK_LEVEL_COLORS: Record<ResidualLevel, string> = {
  high: '#dc2626',
  medium: '#ca8a04',
  low: '#16a34a',
};

/** Heat-map export (canvas) colours. */
export const RISK_HEATMAP_CANVAS_COLORS = {
  Cell: { high: '#fca5a5', medium: '#fef08a', low: '#bbf7d0' } as Record<ResidualLevel, string>,
  CellBorder: { high: '#f87171', medium: '#fde047', low: '#86efac' } as Record<ResidualLevel, string>,
  Dot: { open: '#dc2626', monitored: '#ca8a04', closed: '#16a34a', deactivated: '#94a3b8' } as Record<RiskStatus, string>,
  DotFallback: '#94a3b8',
} as const;

/* ── Import template ──────────────────────────────────────────────────── */

export const RISK_IMPORT_TEMPLATE_HEADERS: string[] = [
  'Risk Title*', 'Risk Type*', 'Description*', 'Sub-Division*',
  'Impact (1-5)*', 'Likelihood (1-5)*', 'Key Controls',
  'Control Effectiveness (strong/moderate/weak)*', 'Owner*',
  'Status (open/monitored/closed)',
];

export const RISK_IMPORT_TEMPLATE_EXAMPLE: string[] = [
  'Unreconciled GL entries', 'financial',
  'GL accounts not reconciled on time', 'Finance',
  '4', '4', 'Monthly reconciliation policy',
  'moderate', 'Finance Manager', 'open',
];
