import { Component, Input } from '@angular/core';

/**
 * Renders a PrimeIcon-equivalent as an inline SVG that "draws" itself in
 * (stroke-dashoffset animation) whenever an ancestor matching one of the
 * hover-root selectors in `src/assets/_draw-icon.scss` is hovered. Visible
 * by default; hover replays the draw-in via a CSS keyframe animation.
 *
 * `icon` accepts the same string already stored on models (e.g. 'pi pi-eye'),
 * so call sites only swap the element — no data changes. Unmapped icons
 * fall back to rendering the PrimeIcon font glyph.
 */
@Component({
  selector: 'app-draw-icon',
  standalone: true,
  templateUrl: './draw-icon.component.html',
})
export class DrawIconComponent {
  @Input() icon = '';
  @Input() size = 15;
}
