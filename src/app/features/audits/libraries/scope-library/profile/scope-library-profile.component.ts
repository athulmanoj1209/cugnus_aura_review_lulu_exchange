import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

import type {
  ScopeLibraryItem,
  RiskCategory,
} from '@/app/features/audits/libraries/scope-library/models/scope-library-list.model';
import type { ScopeLibraryProfileDrawerData } from '@/app/features/audits/libraries/scope-library/models/scope-library.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { ScopeLevels } from '@/app/features/audits/audit-plan/scope/constants/scope.constants';
import {
  SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY,
  SCOPE_LIBRARY_RISK_CATEGORY_SEVERITY,
  type ScopeLibraryTagSeverity,
} from '../constants/scope-library-labels.constants';

@Component({
  selector: 'app-scope-library-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, DividerModule, DrawIconComponent],
  templateUrl: './scope-library-profile.component.html',
  styleUrl: './scope-library-profile.component.scss',
})
export class ScopeLibraryProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as ScopeLibraryProfileDrawerData | null;

  scopeItem: ScopeLibraryItem | null = this.data?.scopeItem ?? null;

  readonly ScopeLevels = ScopeLevels;

  readonly riskCategorySeverity = SCOPE_LIBRARY_RISK_CATEGORY_SEVERITY;

  getRiskSeverity(cat: RiskCategory): ScopeLibraryTagSeverity {
    return this.riskCategorySeverity[cat] ?? SCOPE_LIBRARY_RISK_CATEGORY_DEFAULT_SEVERITY;
  }

  onProfileClose() {
    this.drawerRef.close(null);
  }

}
