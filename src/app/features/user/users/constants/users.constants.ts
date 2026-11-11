import type { UserRole, UserStatus } from '../services/users.service';

/** Roles supported by the user-management feature. */
export const UserRoles = {
  Admin: 'admin',
  Manager: 'manager',
  Auditor: 'auditor',
  Viewer: 'viewer'
} as const;
export type UsersRole = (typeof UserRoles)[keyof typeof UserRoles];

/** Account statuses used by the user list and profile. */
export const UserStatuses = {
  Active: 'active',
  Pending: 'pending',
  Suspended: 'suspended',
  Deleted: 'deleted'
} as const;
export type UsersStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const UsersViewModes = {
  Grid: 'grid',
  List: 'list'
} as const;
export type UsersViewMode = (typeof UsersViewModes)[keyof typeof UsersViewModes];

export const USERS_SORT_OPTIONS = {
  NameAscending: 'name_asc',
  NameDescending: 'name_desc',
  RecentlyAdded: 'recent',
  LastLogin: 'last_login'
} as const;
export type UsersSortOption = (typeof USERS_SORT_OPTIONS)[keyof typeof USERS_SORT_OPTIONS];

export const USERS_PAGE_SIZE = 10;
export const USERS_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];
export const USERS_DEFAULT_STATUS: UserStatus = UserStatuses.Active;
export const USERS_DEFAULT_ROLE: UserRole = UserRoles.Viewer;

export const USERS_ROLES: UserRole[] = ['admin', 'manager', 'auditor', 'viewer'];
export const USERS_STATUSES: UserStatus[] = ['active', 'pending', 'suspended', 'deleted'];

export const USERS_EXPERTISE_OPTIONS = ['AML', 'IT', 'Treasury', 'Finance', 'HR', 'Operations'] as const;
export const USERS_LOCATION_OPTIONS = [
  'Dubai HQ',
  'Abu Dhabi Branch',
  'Sharjah Office',
  'Riyadh Branch',
  'Doha Office',
  'Muscat Office',
  'Manama Office',
  'Remote'
] as const;

