import { InjectionToken } from '@angular/core';

/**
 * Which kind of client this build is running for — decides which static
 * seed file each *-data.service.ts reads its mock data from (e.g. the
 * multi-company audit-firm seed vs. the single-company internal-audit
 * seed). Set via the CLIENT_MODE provider in app.config.ts.
 */
export type ClientMode = 'audit-firm' | 'internal-audit';

/**
 * The active mode. Comment/uncomment before startup to switch clients.
 *
 * Read directly by the static seed files (branch-static-data.ts and friends),
 * which are plain module-level arrays evaluated at import time — long before
 * Angular's DI providers run, so they cannot inject CLIENT_MODE. app.config.ts
 * provides the token from this same constant, keeping one place to toggle.
 */
 //export const CLIENT_MODE_VALUE: ClientMode = 'audit-firm';
export const CLIENT_MODE_VALUE: ClientMode = 'internal-audit';

export const CLIENT_MODE = new InjectionToken<ClientMode>('CLIENT_MODE');

/**
 * Which internal-audit org is active, when CLIENT_MODE_VALUE is
 * 'internal-audit' — there can be more than one single-org seed (DAR
 * Exchange, XYZ Broadcast, ...). Ignored entirely in 'audit-firm' mode.
 * Read directly by the same *-indi-org.data.ts seed files as
 * CLIENT_MODE_VALUE, for the same import-time-evaluation reason.
 */
//export type InternalAuditClientKey = 'dar-exchange' | 'xyz-broadcast' | 'lulu-exchange';
export type InternalAuditClientKey = 'dar-exchange' | 'xyz-broadcast' | 'lulu-exchange';

  //export const INTERNAL_AUDIT_CLIENT_KEY_VALUE: InternalAuditClientKey = 'dar-exchange';
// export const INTERNAL_AUDIT_CLIENT_KEY_VALUE: InternalAuditClientKey = 'xyz-broadcast';
 export const INTERNAL_AUDIT_CLIENT_KEY_VALUE: InternalAuditClientKey = 'lulu-exchange';
