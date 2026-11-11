import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { Observation, RiskRating, ObservationStatus } from '../list/observation-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { OBSERVATION_STATUS_LABELS, RISK_RATING_LABELS } from '../constants/observation-labels.constants';

export interface ObservationDetailDrawerData { observation: Observation; }

@Component({
  selector: 'app-observation-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, DrawIconComponent],
  templateUrl: './observation-profile.component.html',
  styleUrl: './observation-profile.component.scss',
})
export class ObservationProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  readonly obs = (inject(DRAWER_DATA, { optional: true }) as ObservationDetailDrawerData).observation;

  onClose() { this.drawerRef.close(null); }

  riskLabel(r: RiskRating): string {
    const labels: Record<RiskRating, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };

    return labels[r];
  }

  statusLabel(s: ObservationStatus): string {
    const labels: Record<ObservationStatus, string> = {
      draft: $localize`:@@audit.observations.statusDraft:Draft`,
      submitted: $localize`:@@audit.observations.statusSubmitted:Submitted`,
      reviewed: $localize`:@@audit.observations.statusReviewed:Reviewed`,
      approved: $localize`:@@audit.observations.statusApproved:Approved`,
    };

    return labels[s];
  }
}