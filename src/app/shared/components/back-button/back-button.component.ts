import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonDirective } from '@/app/shared/directives/back-button.directive';
import { NavigationTarget } from '@/app/shared/services/navigation-history.service';

export type BackButtonVariant = 'default' | 'on-dark';

/**
 * Square arrow "Back" button used in page headers.
 * Navigation is handled by `BackButtonDirective` (`btn-back`).
 *
 * Behaviour:
 *  - `to` set      → always navigates to that route (e.g. a detail page that
 *                    should return to its list).
 *  - `to` not set  → goes back in browser history (preserves the previous
 *                    page's filters/scroll); if there is no history (deep link,
 *                    new tab) it navigates to `fallback` instead.
 *
 * Usage:
 *   <app-back-button></app-back-button>
 *   <app-back-button to="/audits/libraries/regulations" label="Back to Library"></app-back-button>
 *   <app-back-button variant="on-dark"></app-back-button>   (on dark/brand backgrounds)
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [DrawIconComponent, TooltipModule, BackButtonDirective],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  /** Explicit destination. When set, history is ignored. */
  @Input() to?: NavigationTarget;

  /** Where to go when there is no browser history to go back to. */
  @Input() fallback: NavigationTarget = '/';

  /** Accessible name (also used as the tooltip when `tooltip` is true). */
  @Input() label = $localize`:@@common.back:Back`;

  /** Show `label` as a hover tooltip. */
  @Input() tooltip = false;

  /** Visual style — use 'on-dark' on brand-coloured / dark headers. */
  @Input() variant: BackButtonVariant = 'default';
}
