import { InjectionToken } from '@angular/core';
import { Observable, Subject, firstValueFrom } from 'rxjs';

/**
 * Token used by drawer content components to receive the
 * `data` payload passed in `RightDrawerService.open(...)`.
 *
 * Inside a drawer content component:
 *
 *   constructor(@Inject(DRAWER_DATA) public data: MyData) {}
 *
 *   // or with inject():
 *   readonly data = inject(DRAWER_DATA) as MyData;
 */
export const DRAWER_DATA = new InjectionToken<unknown>('DRAWER_DATA');

/**
 * Handle returned from `RightDrawerService.open(...)`.
 * Inject this into your drawer content component to close
 * the drawer (optionally returning a value to the opener).
 */
export class DrawerRef<R = unknown, D = unknown> {
  private readonly closedSubject = new Subject<R | null>();

  /** Subscribe-style notification of close. */
  readonly afterClosed$: Observable<R | null> = this.closedSubject.asObservable();

  /** Await-style notification of close. */
  readonly afterClosed: Promise<R | null>;

  private settled = false;

  constructor(public readonly data: D | null = null) {
    this.afterClosed = firstValueFrom(this.afterClosed$);
  }

  /** Close the drawer, optionally passing a result back to the opener. */
  close(result: R | null = null): void {
    if (this.settled) return;
    this.settled = true;
    this.closedSubject.next(result);
    this.closedSubject.complete();
  }

  /** Has the drawer already been closed? */
  get isClosed(): boolean {
    return this.settled;
  }
}