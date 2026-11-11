import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event } from "@angular/router";
import { Location } from "@angular/common";
import { filter } from 'rxjs/operators';

/** A route to navigate to: a URL string or a router commands array. */
export type NavigationTarget = string | unknown[];

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  /** In-app URLs visited, oldest first; the last entry is the current page. */
  protected history: string[] = [];

  /** What started the navigation in progress — 'popstate' means browser back/forward (or location.back()). */
  private lastTrigger: NavigationStart['navigationTrigger'];

  constructor(
    protected router: Router,
    protected location: Location,
  ) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationStart | NavigationEnd =>
        event instanceof NavigationStart || event instanceof NavigationEnd)
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.lastTrigger = event.navigationTrigger;
      } else {
        this.record(event.urlAfterRedirects);
      }
    });
  }

  /**
   * Goes back to the previous in-app page. When there is none (deep link /
   * new tab / refresh), navigates to `fallback` instead of leaving the app.
   */
  async back(fallback: NavigationTarget = '/'): Promise<void> {
    // More than one entry means there is an in-app page behind the current one.
    // location.back() fires a popstate navigation, and record() removes the
    // current page from the array, so nothing is popped here.
    if (this.history.length > 1) {
      this.location.back();
      return;
    }
    await this.navigate(fallback);
  }

  /** Navigates to a string URL or a router commands array. */
  navigate(target: NavigationTarget): Promise<boolean> {
    return Array.isArray(target)
      ? this.router.navigate(target)
      : this.router.navigateByUrl(target);
  }

  /**
   * True only when the previous history entry belongs to this app.
   * Angular stores an incrementing `navigationId` in each history entry's
   * state; the first in-app page has id 1. `window.history.length` can't be
   * used because it also counts entries from other sites.
   */
  hasInAppHistory(): boolean {
    const state = this.location.getState() as { navigationId?: number } | null;
    return (state?.navigationId ?? 1) > 1;
  }

  

  private record(url: string): void {
    const previous = this.history[this.history.length - 2];

    // Going back (our back button or the browser's): the page we landed on is
    // the one before the current entry, so drop the current entry instead of
    // pushing the previous URL again (which would duplicate it).
    if (this.lastTrigger === 'popstate' && previous === url) {
      this.history.pop();
      return;
    }

    // Same URL navigated again (e.g. clicking the active menu item) — don't duplicate.
    if (this.history[this.history.length - 1] === url) return;

    this.history.push(url);
  }
}
