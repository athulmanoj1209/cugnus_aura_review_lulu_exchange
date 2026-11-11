import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

import type { RfiLibraryItem, RfiPriority } from '@/app/features/audits/libraries/rfi-library/models/rfi-library-list.model';
import type { RfiLibraryProfileDrawerData } from '@/app/features/audits/libraries/rfi-library/models/rfi-library.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  RFI_LIBRARY_PRIORITY_DEFAULT_SEVERITY,
  RFI_LIBRARY_PRIORITY_SEVERITY,
  type RfiLibraryTagSeverity,
} from '../constants/rfi-library-labels.constants';

@Component({
  selector: 'app-rfi-library-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, DividerModule, DrawIconComponent],
  templateUrl: './rfi-library-profile.component.html',
  styleUrl: './rfi-library-profile.component.scss',
})
export class RfiLibraryProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as RfiLibraryProfileDrawerData | null;

  rfiItem: RfiLibraryItem | null = this.data?.rfiItem ?? null;

  readonly prioritySeverity = RFI_LIBRARY_PRIORITY_SEVERITY;

  getPrioritySeverity(p: RfiPriority): RfiLibraryTagSeverity {
    return this.prioritySeverity[p] ?? RFI_LIBRARY_PRIORITY_DEFAULT_SEVERITY;
  }

  onClose(): void {
    this.drawerRef.close(null);
  }
}
