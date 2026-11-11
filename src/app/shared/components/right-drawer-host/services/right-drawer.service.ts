import { Injectable, Type } from '@angular/core';

import { DrawerRef } from '../helper/drawer-ref';
import type { RightDrawerHostComponent } from '../../right-drawer-host/com/right-drawer-host.component';

/**
 * Config you can pass when opening a drawer.
 */
export interface DrawerConfig<D = unknown> {
  /** Width of the drawer (any CSS length). Defaults to 25rem.
   *  When omitted, the responsive Tailwind classes `w-full sm:w-25rem`
   *  from styleClass take over. */
  width?: string;

  /** Payload injected into the content component via DRAWER_DATA. */
  data?: D;

  /** Allow clicking the dark mask / pressing ESC to dismiss? Defaults to true. */
  dismissible?: boolean;

  /** Extra CSS class applied to the drawer's root element. */
  styleClass?: string;
}

/**
 * Open any component as a right-side drawer.
 *
 * Step 1 — mount once, anywhere globally (typically AppComponent):
 *
 *   <app-right-drawer-host></app-right-drawer-host>
 *
 * Step 2 — open from anywhere:
 *
 *   const ref = this.drawer.open(AddCompanyModalComponent, {
 *     width: '720px',
 *     data: { editingCompany: someExisting },
 *   });
 *   const result = await ref.afterClosed;
 */
@Injectable({ providedIn: 'root' })
export class RightDrawerService {
  private host: RightDrawerHostComponent | null = null;

  /** Internal — called by the host component on init. */
  _registerHost(host: RightDrawerHostComponent): void {
    this.host = host;
  }

  /** Internal — called by the host component on destroy. */
  _unregisterHost(host: RightDrawerHostComponent): void {
    if (this.host === host) this.host = null;
  }

  /**
   * Open the given component inside a right-side drawer.
   * Returns a `DrawerRef` whose `afterClosed` resolves with
   * the value the content component passed to `ref.close(value)`,
   * or `null` if the user dismissed the drawer.
   */
  open<R = unknown, D = unknown>(
    component: Type<unknown>,
    config: DrawerConfig<D> = {},
  ): DrawerRef<R, D> {
    if (!this.host) {
      throw new Error(
        '[RightDrawerService] No host found. Place <app-right-drawer-host /> ' +
        'in your AppComponent template (once, globally).',
      );
    }
    return this.host.openDrawer<R, D>(component, config);
  }

  /** Close the currently-open drawer (if any). */
  closeAll(): void {
    this.host?.closeCurrent();
  }
}