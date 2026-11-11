import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawerModule } from 'primeng/drawer';

import { DrawerRef, DRAWER_DATA } from '../helper/drawer-ref';
import {
  DrawerConfig,
  RightDrawerService,
} from '../services/right-drawer.service';

interface PendingOpen {
  component: Type<unknown>;
  config: DrawerConfig<unknown>;
  ref: DrawerRef;
}

/**
 * Global host that opens any component as a right-side PrimeNG drawer.
 *
 *   <app-right-drawer-host></app-right-drawer-host>
 *
 * Mount it once in AppComponent. Open from anywhere via RightDrawerService.
 *
 * Implementation notes
 * --------------------
 * `p-drawer` renders its content lazily (only when `visible` flips to true),
 * so `@ViewChild('vc')` is undefined right after we call open(). We solve
 * this by deferring `createComponent` with `setTimeout(0)` — which runs in
 * the next macrotask, AFTER the change-detection cycle that mounted the
 * drawer content. `(onShow)` is a fallback in case the first attempt misses.
 */
@Component({
  selector: 'app-right-drawer-host',
  standalone: true,
  imports: [CommonModule, DrawerModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <p-drawer
      [visible]="visible()"
      (visibleChange)="onVisibleChange($event)"
      (onShow)="onDrawerShow()"
      (onHide)="onDrawerHide()"
      position="right"
      [modal]="true"
      [dismissible]="dismissible()"
      [showCloseIcon]="true"
      [blockScroll]="true"
      [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'"
      [styleClass]="drawerStyleClass()"
      [style]="drawerStyle()"
    >
      
      <div class="right-drawer-canvas">
        <ng-container #vc></ng-container>
      </div>
    </p-drawer>
  `,
  styleUrls: ['./right-drawer-host.component.scss'],
})
export class RightDrawerHostComponent implements OnInit, OnDestroy {

  @ViewChild('vc', { read: ViewContainerRef, static: false })
  vc?: ViewContainerRef;

  private readonly service = inject(RightDrawerService);
  private readonly parentInjector = inject(Injector);

  // ---------------- Reactive state ----------------
  readonly visible = signal(false);
  /** When null, the responsive Tailwind classes (w-full sm:w-25rem) control width. */
  readonly width = signal<string | null>(null);
  readonly dismissible = signal(true);
  readonly styleClass = signal<string>('');

  /** Final styleClass string passed to p-drawer */
  readonly drawerStyleClass = computed(
    () => `right-drawer w-full sm:w-25rem ${this.styleClass()}`.trim(),
  );

  /** Style object — only sets inline width when the caller specified one. */
  readonly drawerStyle = computed(() =>
    this.width() ? { width: this.width()! } : {},
  );

  private currentRef: DrawerRef | null = null;
  private pendingOpen: PendingOpen | null = null;

  // ---------------- Lifecycle ----------------
  ngOnInit(): void {
    this.service._registerHost(this);
  }

  ngOnDestroy(): void {
    this.service._unregisterHost(this);
  }

  // ---------------- Called by RightDrawerService ----------------
  openDrawer<R, D>(
    component: Type<unknown>,
    config: DrawerConfig<D>,
  ): DrawerRef<R, D> {
    // Close any open drawer first
    if (this.currentRef && !this.currentRef.isClosed) {
      this.currentRef.close(null);
    }
    this.vc?.clear();

    // Apply config to signals so the template re-renders with new chrome
    this.width.set(config.width ?? null);
    this.dismissible.set(config.dismissible !== false);
    this.styleClass.set(config.styleClass ?? '');

    const ref = new DrawerRef<R, D>(config.data ?? null);
    this.pendingOpen = {
      component,
      config: config as DrawerConfig<unknown>,
      ref: ref as DrawerRef,
    };

    // Subscribe to ref close once
    ref.afterClosed$.subscribe(() => {
      // Just flip visible; p-drawer's onHide event handles the rest.
      this.visible.set(false);
    });

    if (this.visible()) {
      // Drawer is already open — content swap on the next tick.
      setTimeout(() => this.attachPending(), 0);
    } else {
      this.visible.set(true);
      // Try to attach as soon as the drawer's content is in the DOM.
      // setTimeout(0) fires after the change-detection cycle that
      // creates p-drawer's content.
      setTimeout(() => this.attachPending(), 0);
    }

    return ref;
  }

  closeCurrent(): void {
    this.currentRef?.close(null);
  }

  // ---------------- p-drawer events ----------------
  /** Fires once the drawer's open animation finishes — fallback attach point. */
  onDrawerShow(): void {
    this.attachPending();
  }

  /** Fires once the drawer is fully hidden. */
  onDrawerHide(): void {
    if (this.currentRef && !this.currentRef.isClosed) {
      this.currentRef.close(null);
    }
    this.vc?.clear();
    this.currentRef = null;
    this.pendingOpen = null;
  }

  onVisibleChange(visible: boolean): void {
    // Keep our signal in sync if PrimeNG closes the drawer internally
    // (X button, mask click, escape).
    if (!visible && this.visible()) {
      this.visible.set(false);
    }
  }

  // ---------------- Internal ----------------
  private attachPending(): void {
    if (!this.pendingOpen) return;
    if (!this.vc) return; // wait for onShow

    const { component, config, ref } = this.pendingOpen;
    this.pendingOpen = null;

    this.vc.clear();

    const injector = Injector.create({
      parent: this.parentInjector,
      providers: [
        { provide: DrawerRef, useValue: ref },
        { provide: DRAWER_DATA, useValue: config.data ?? null },
      ],
    });

    this.vc.createComponent(component, { injector });
    this.currentRef = ref;
  }
}