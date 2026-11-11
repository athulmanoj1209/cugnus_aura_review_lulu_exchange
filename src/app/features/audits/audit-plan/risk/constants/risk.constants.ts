/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (risk-shared-data.ts, risk-shared-xyz-data.ts)
 * stay assignable to the derived types in models/risk.model.ts.
 */

export const RiskTypes = {
  Strategic: 'strategic',
  Operational: 'operational',
  Financial: 'financial',
  Compliance: 'compliance',
  IT: 'it',
  AmlCft: 'aml_cft',
  Reputational: 'reputational',
  Other: 'other',
} as const;

export const RiskControlEffectiveness = {
  Strong: 'strong',
  Moderate: 'moderate',
  Weak: 'weak',
} as const;

export const RiskStatuses = {
  Open: 'open',
  Monitored: 'monitored',
  Closed: 'closed',
  Deactivated: 'deactivated',
} as const;

export const RiskResidualLevels = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

/** List / grid / heat-map toggle on the Risk Register page. */
export const RiskViewModes = {
  List: 'list',
  Grid: 'grid',
  Heatmap: 'heatmap',
} as const;
export type RiskViewMode = typeof RiskViewModes[keyof typeof RiskViewModes];

/** Sortable columns of the Risk Register list view. */
export const RiskSortColumns = {
  Id: 'id',
  Title: 'title',
  RiskType: 'riskType',
  InherentScore: 'inherentScore',
  ResidualLevel: 'residualLevel',
  Status: 'status',
  DateIdentified: 'dateIdentified',
} as const;
export type RiskSortColumn = typeof RiskSortColumns[keyof typeof RiskSortColumns];

export const RiskSortDirections = {
  Asc: 'asc',
  Desc: 'desc',
} as const;
export type RiskSortDirection = typeof RiskSortDirections[keyof typeof RiskSortDirections];

/** Keys of the active-filter chips on the Risk Register page. */
export const RiskFilterKeys = {
  Companies: 'companies',
  Branches: 'branches',
  Depts: 'depts',
  Types: 'types',
  Levels: 'levels',
  Statuses: 'statuses',
  Owners: 'owners',
} as const;
export type RiskFilterKey = typeof RiskFilterKeys[keyof typeof RiskFilterKeys];

/** `mode` passed in the drawer data of the Add/Edit/Review risk drawer. */
export const RiskDrawerModes = {
  Create: 'create',
  Edit: 'edit',
  Approve: 'approve',
} as const;
export type RiskDrawerMode = typeof RiskDrawerModes[keyof typeof RiskDrawerModes];

export const RiskApprovalActions = {
  Approve: 'approve',
  Reject: 'reject',
} as const;
export type RiskApprovalAction = typeof RiskApprovalActions[keyof typeof RiskApprovalActions];

/** Activate / deactivate action shown in the Risk Register confirmation dialog. */
export const RiskBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type RiskBlockAction = typeof RiskBlockActions[keyof typeof RiskBlockActions];

/** Steps of the Import Risks dialog. */
export const RiskImportSteps = {
  Upload: 'upload',
  Preview: 'preview',
} as const;
export type RiskImportStep = typeof RiskImportSteps[keyof typeof RiskImportSteps];

/** Export formats of the risk heat map. */
export const RiskExportFormats = {
  Pdf: 'pdf',
  Png: 'png',
} as const;
export type RiskExportFormat = typeof RiskExportFormats[keyof typeof RiskExportFormats];

/* ── Scoring ──────────────────────────────────────────────────────────── */

/** Impact / likelihood are scored on this 1–5 scale. */
export const RISK_SCALE_MIN = 1;
export const RISK_SCALE_MAX = 5;
export const RISK_SCALE_VALUES: number[] = [1, 2, 3, 4, 5];

/** Highest possible score (impact × likelihood). */
export const RISK_MAX_SCORE = RISK_SCALE_MAX * RISK_SCALE_MAX;

/** Points knocked off the inherent score per control effectiveness. */
export const RISK_EFFECTIVENESS_ADJUSTMENT = {
  strong: 6,
  moderate: 3,
  weak: 0,
} as const;

/** Lowest residual score a risk can be reduced to. */
export const RISK_MIN_RESIDUAL_SCORE = 1;

/** Upper bound (inclusive) of each residual band; anything above MediumMax is high. */
export const RISK_LEVEL_THRESHOLDS = {
  LowMax: 6,
  MediumMax: 14,
} as const;

/* ── Configuration ────────────────────────────────────────────────────── */

export const RISK_DRAWER = {
  FormWidth: '800px',
  ProfileWidth: '720px',
} as const;

export const RISK_CONFIRM_DIALOG_WIDTH = '420px';

export const RISK_IMPORT_DIALOG_WIDTH = {
  Upload: '560px',
  Preview: '900px',
} as const;

export const RISK_LIST_PAGE_SIZE = 8;

export const RISK_PAGE_SIZE_OPTIONS: number[] = [8, 25, 50, 100];

/** Length limits for the risk form controls. */
export const RISK_FIELD_LIMITS = {
  TitleMax: 200,
  DescriptionMax: 1000,
  KeyControlsMax: 1000,
} as const;

/** "Risk Register" supporting documents upload on the risk form. */
export const RISK_DOCUMENT_UPLOAD = {
  Accept: '.pdf,.doc,.docx,.xls,.xlsx',
  MaxFileSizeBytes: 50 * 1024 * 1024,
} as const;

/** File upload of the Import Risks dialog. */
export const RISK_IMPORT_UPLOAD = {
  Accept: '.csv,.xlsx,.xls',
  MaxFileSizeBytes: 10 * 1024 * 1024,
} as const;

/** Import-row error chips longer than this are truncated (full text in the tooltip). */
export const RISK_IMPORT_ERROR_CHIP_MAX_LENGTH = 30;

export const RISK_IMPORT_TEMPLATE_FILE_NAME = 'risk_import_template.csv';

export const RISK_HEATMAP_PNG_FILE_NAME = 'risk-heatmap.png';

/** Prefix + zero-padded number of generated risk ids (RSK-001). */
export const RISK_ID_PREFIX = 'RSK-';
export const RISK_ID_PAD_LENGTH = 3;

/** Company / division given to a risk saved without one. */
export const RISK_DEFAULT_COMPANY = 'Cygnus Aura';
export const RISK_DEFAULT_DIVISION = 'Dubai HQ';

/** Shown in place of a missing value. */
export const RISK_EMPTY_VALUE = '—';
