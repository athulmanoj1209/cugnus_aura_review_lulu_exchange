/* ── Value sets ───────────────────────────────────────────────────────────
 * `as const` objects instead of TS `enum`s so the plain string literals used
 * throughout the seed data (MOCK_NOTIFICATIONS) stay assignable to the
 * derived types on NotificationItem.
 */

/** Portal a notification belongs to / the portal the current user is in. */
export const NotificationPortalRoles = {
  Client: 'client',
  Auditor: 'auditor',
} as const;
export type NotificationPortalRole = typeof NotificationPortalRoles[keyof typeof NotificationPortalRoles];

export const NotificationSenderTypes = {
  User: 'user',
  System: 'system',
} as const;
export type NotificationSenderType = typeof NotificationSenderTypes[keyof typeof NotificationSenderTypes];

/** Role of the person who sent a user notification. */
export const NotificationSenderRoles = {
  DepartmentHead: 'Department Head',
  AuditHead: 'Audit Head',
} as const;
export type NotificationSenderRole = typeof NotificationSenderRoles[keyof typeof NotificationSenderRoles];

export const NotificationStatuses = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
export type NotificationStatus = typeof NotificationStatuses[keyof typeof NotificationStatuses];

/** Grid / list toggle on the notifications page. */
export const NotificationViewModes = {
  Grid: 'grid',
  List: 'list',
} as const;
export type NotificationViewMode = typeof NotificationViewModes[keyof typeof NotificationViewModes];

/* ── Configuration ────────────────────────────────────────────────────── */

/** Portal simulated until the role comes from the auth/session service. */
export const NOTIFICATION_DEFAULT_USER_ROLE: NotificationPortalRole = NotificationPortalRoles.Auditor;

export const NOTIFICATION_PAGE_SIZE = 10;

export const NOTIFICATION_PAGE_SIZE_OPTIONS: number[] = [10, 25, 50];

/** Characters of the message shown before it is truncated, per view. */
export const NOTIFICATION_MESSAGE_PREVIEW_LENGTH = {
  List: 110,
  Grid: 130,
} as const;

export const NOTIFICATION_TRUNCATE_SUFFIX = '…';

export const NOTIFICATION_VIEW_DIALOG_WIDTH = '560px';

/** Action passed to the shared confirm dialog when deleting a notification. */
export const NOTIFICATION_DELETE_ACTION = 'Delete';
