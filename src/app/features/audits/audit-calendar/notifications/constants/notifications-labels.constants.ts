/* ── Display labels for notification values ──────────────────────────── */

import type { NotificationPortalRole } from './notifications.constants';

/** Badge next to the page title showing which portal is being viewed. */
export const NOTIFICATION_PORTAL_VIEW_LABELS: Record<NotificationPortalRole, string> = {
  client: 'Client View',
  auditor: 'Auditor View',
};

/** Badge shown on system-generated notifications. */
export const NOTIFICATION_SYSTEM_BADGE_LABEL = 'System';
