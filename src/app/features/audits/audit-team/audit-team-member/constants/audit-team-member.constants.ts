/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * by callers and mock data stay assignable to the derived types below.
 */

/** A single area of expertise the member can flag. */
export const Expertises = {
  AML: 'AML',
  IT: 'IT',
  Treasury: 'Treasury',
  Finance: 'Finance',
  HR: 'HR',
  Operations: 'Operations',
} as const;
export type Expertise = typeof Expertises[keyof typeof Expertises];

export const ALL_EXPERTISE: Expertise[] = Object.values(Expertises);

/** Mode the Add/Edit member drawer is opened in. */
export const MemberFormModes = {
  Create: 'create',
  Edit: 'edit',
} as const;
export type MemberFormMode = typeof MemberFormModes[keyof typeof MemberFormModes];

/** `mode` of the result returned when the member drawer closes. */
export const MemberResultModes = {
  Create: 'create',
  Link: 'link',
} as const;

/** `type` passed in the drawer data / `viewType` form control of the member drawer. */
export const MemberDrawerTypes = {
  View: 'View',
  Edit: 'Edit',
} as const;

/** Tabs of the member drawer (PrimeNG v18 Tabs use string values). */
export const MemberFormTabs = {
  Create: '0',
  Link: '1',
} as const;

/** Grid / list toggle on the members listing page. */
export const MemberViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type MemberViewMode = typeof MemberViewModes[keyof typeof MemberViewModes];

/** Sort options on the members listing page. */
export const MemberSortOptions = {
  NameAsc: 'name_asc',
  NameDesc: 'name_desc',
  Recent: 'recent',
  Experience: 'experience',
  Workload: 'workload',
} as const;
export type MemberSortOption = typeof MemberSortOptions[keyof typeof MemberSortOptions];

/** Block / unblock action shown in the listing's confirmation dialog. */
export const MemberBlockActions = {
  Activate: 'Activate',
  Deactivate: 'Deactivate',
} as const;
export type MemberBlockAction = typeof MemberBlockActions[keyof typeof MemberBlockActions];

/** Keys of the active-filter chips on the members listing page. */
export const MemberFilterKeys = {
  Companies: 'companies',
  Divisions: 'divisions',
  SubDivisions: 'subDivisions',
  Designations: 'designations',
} as const;
export type MemberFilterKey = typeof MemberFilterKeys[keyof typeof MemberFilterKeys];

/** Fields on the member profile that have a copy-to-clipboard button. */
export const MemberCopyFields = {
  Email: 'email',
  Phone: 'phone',
} as const;
export type MemberCopyField = typeof MemberCopyFields[keyof typeof MemberCopyFields];

/** Tier of the workload bar on cards, rows and the profile. */
export const MemberWorkloadTiers = {
  Low: 'low',
  Mid: 'mid',
  High: 'high',
} as const;
export type MemberWorkloadTier = typeof MemberWorkloadTiers[keyof typeof MemberWorkloadTiers];

/* ── Configuration ────────────────────────────────────────────────────── */

export const MEMBER_DRAWER = {
  FormWidth: '769px',
  ProfileWidth: '760px',
} as const;

export const MEMBER_LIST_PAGE_SIZE = 10;

export const MEMBER_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

export const MEMBER_SEARCH_DEBOUNCE_MS = 200;

/** Debounce for the search box on the "Link Existing" tab. */
export const MEMBER_LINK_SEARCH_DEBOUNCE_MS = 150;

/** Delay before the drawer closes after linking an existing member (lets the toast show). */
export const MEMBER_LINK_CLOSE_DELAY_MS = 1500;

/** How long the "copied" tick stays on a profile field. */
export const MEMBER_COPY_FEEDBACK_MS = 1200;

/** Length / range limits for the member form controls. */
export const MEMBER_FIELD_LIMITS = {
  FullNameMin: 2,
  FullNameMax: 150,
  YearsOfExperienceMin: 0,
  YearsOfExperienceMax: 99,
  EmailMax: 200,
  TeamsZoomIdMax: 200,
  HourlyCostRateMin: 0,
  HourlyCostRateMax: 100_000,
  HoursMin: 0,
  HoursMax: 10_000,
} as const;

/** Workload % at or above which the bar shows the given tier. */
export const MEMBER_WORKLOAD_THRESHOLDS = {
  High: 80,
  Mid: 50,
} as const;

/** Fallback avatar when a member's image fails to load. */
export const MEMBER_DEFAULT_AVATAR_URL =
  'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png';

/** Local placeholder avatar used by the mock members. */
export const MEMBER_PLACEHOLDER_AVATAR_URL = 'images/avatars/default-avatar.jpg';

/** Name given to a member saved without one. */
export const MEMBER_DEFAULT_NAME = 'Untitled member';
