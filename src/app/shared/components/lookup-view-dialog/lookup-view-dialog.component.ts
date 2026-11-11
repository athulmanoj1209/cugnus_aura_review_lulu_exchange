import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/*
  Read-only "view details" dialog shared by the admin look-up list pages.

    <app-lookup-view-dialog
      [(visible)]="showViewDialog"
      icon="pi pi-shield"
      [title]="item.name"
      subtitle="Risk Rating Details"
      [active]="item.status === 'active'"
      [description]="item.description"
      [createdOn]="item.createdOn" />

  Extra rows can be projected: default content renders above the description,
  content marked `lvdAfter` renders below the Created On row. Styles are not
  encapsulated so projected markup can reuse the `lvd-*` row classes
  (lvd-section-label, lvd-footer-row, lvd-footer-label, lvd-footer-value).
*/
@Component({
  selector: 'app-lookup-view-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, DrawIconComponent],
  templateUrl: './lookup-view-dialog.component.html',
  styleUrls:   ['./lookup-view-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupViewDialogComponent {
  readonly visible = model(false);

  readonly icon     = input('pi pi-info-circle');
  readonly title    = input('');
  readonly subtitle = input('');
  readonly active   = input(true);
  readonly width    = input('480px');

  readonly description     = input<string | null | undefined>('');
  /** Hide the description card when a module projects its own body instead. */
  readonly showDescription = input(true);
  readonly createdOn       = input<string | null | undefined>('');

  close(): void {
    this.visible.set(false);
  }
}
