/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s, matching the divisions /
 * sub-divisions modules. Types in models/client-org-chart-list.model.ts
 * are derived from these.
 */

/**
 * Node types in the org chart / list tree.
 * 'spacer' is chart-view only: the "Division Scopes" card holding a division's own scopes.
 * 'divisionScopes' is list-view only: the "Division Scopes" group row holding them.
 */
export const OrgNodeTypes = {
  Company: 'company',
  Division: 'division',
  SubDivision: 'subDivision',
  Scope: 'scope',
  SubScope: 'subscope',
  Spacer: 'spacer',
  DivisionScopes: 'divisionScopes',
} as const;

export const OrgChartViewModes = {
  Chart: 'chart',
  List: 'list',
} as const;

/** Active/inactive status shared by division, sub-division and scope records shown on the chart. */
export const OrgNodeStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type OrgNodeStatus = typeof OrgNodeStatuses[keyof typeof OrgNodeStatuses];

/** Risk rating shown on division / sub-division / scope cards. */
export const OrgRiskRatings = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

/* ── Node ids ─────────────────────────────────────────────────────────────
 * Node ids are built as `divisionCode::subDivisionName::scopeName::subScopeName`;
 * the number of parts tells which level a node is (see isBlocked).
 */
export const ORG_NODE_ID_SEPARATOR = '::';

/**
 * Stands in for the sub-division name in a division-level scope's node id
 * (`DIV001::#division::Scope A`), so scope/sub-scope ids keep the same
 * 3/4-part shape that isBlocked / getScopeByNodeId etc. rely on.
 */
export const DIVISION_SCOPE_SEGMENT = '#division';

/** Id suffix of the invisible placeholder card inside a "Division Scopes" spacer. */
export const ORG_SPACER_PLACEHOLDER_SEGMENT = 'placeholder';

/**
 * Values for that invisible placeholder sub-division card. It is never shown —
 * it only exists so the spacer card takes the same size as a real sub-division card.
 */
export const ORG_SPACER_PLACEHOLDER_VALUES = {
  status: 'active',
  riskRating: 'medium',
  riskStatus: 'monitored',
  numberOfEmployees: 0,
} as const;

/* ── CSS classes / selectors used from code ───────────────────────────── */

export const ORG_SPACER_NODE_CLASS = 'org-spacer-node';
export const ORG_NODE_CARD_SELECTOR = '.node-card';
export const ORG_NODE_CARD_PAN_HIGHLIGHT_CLASS = 'node-card--pan-highlight';
/** Clicks on these don't start a pan, so node actions & the org-chart toggler still work. */
export const ORG_PAN_IGNORE_SELECTOR = 'button, input, a, .p-select, .p-multiselect, .p-node-toggler';

export const ORG_COMPANY_ICON = 'pi pi-building';

/* ── Drawers opened from the chart ─────────────────────────────────────── */

export const ORG_CHART_DRAWER = {
  CompanyWidth: '769px',
  FormWidth: '700px',
  ProfileWidth: '720px',
  /** The chart view opens the sub-division profile narrower, with its own class. */
  SubDivisionProfileChartWidth: '700px',
  StyleClass: 'rounded-tl-[35px] rounded-bl-[35px]',
  SubDivisionProfileChartStyleClass: 'dept-profile-drawer rounded-tl-[35px] rounded-bl-[35px]',
} as const;

/* ── Zoom ─────────────────────────────────────────────────────────────── */

export const ORG_CHART_ZOOM = {
  Initial: 0.56,
  Reset: 1,
  Min: 0.25,
  Max: 3,
  Step: 0.1,
} as const;

/** Fallback company badge colour when the company has none. */
export const ORG_CHART_DEFAULT_COMPANY_COLOR = '#102e70';
