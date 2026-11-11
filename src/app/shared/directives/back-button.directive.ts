import { Directive, HostListener, Input } from '@angular/core';
import { NavigationHistoryService, NavigationTarget } from '../services/navigation-history.service';

/**
 * Makes any element act as a "Back" control.
 *
 *  - `backTo` set       → always navigates to that route.
 *  - `backTo` not set   → goes back in browser history; if there is no in-app
 *                         history, navigates to `backFallback` (or the parent route).
 *
 * Usage:
 *   <button btn-back>Back</button>
 *   <button btn-back backTo="/audits/libraries/regulations">Back</button>
 *   <button btn-back [backFallback]="['/audits/findings']">Back</button>
 */
@Directive({
  selector: '[btn-back]',
  standalone: true
})
export class BackButtonDirective {
  /** Explicit destination. When set, history is ignored. */
  @Input() backTo?: NavigationTarget;

  /** Where to go when there is no in-app history to go back to. */
  @Input() backFallback?: NavigationTarget;

  constructor(private navigation: NavigationHistoryService) {}

  @HostListener('click')
  async onClick(): Promise<void> {
    try {
      if (this.backTo) {
        await this.navigation.navigate(this.backTo);
      } else {
        await this.navigation.back(this.backFallback);
      }
    }
    catch (ex) {
      console.error('BackButtonDirective navigation failed', ex);
    }
  }
}
