import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import {
  Risk, RiskType, ControlEffectiveness, RiskStatus, RiskFile,
} from '../models/risk.model';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { RISK_EMPTY_VALUE, RISK_MAX_SCORE } from '../constants/risk.constants';
import {
  RISK_CONTROL_EFFECTIVENESS_LABELS,
  RISK_RESIDUAL_LEVEL_ICONS,
  RISK_STATUS_LABELS,
  RISK_TYPE_LABELS,
  riskFileIcon,
} from '../constants/risk-labels.constants';

export interface RiskDetailDrawerData { risk: Risk; }

@Component({
  selector: 'app-risk-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DrawIconComponent],
  templateUrl: './risk-profile.component.html',
  styleUrl: './risk-profile.component.scss',
})
export class RiskDetailComponent {
  private readonly drawerRef     = inject(DrawerRef);
  private readonly downloader    = inject(FileDownloadService);
  private readonly clientMode    = inject(CLIENT_MODE, { optional: true });
  private readonly companyData   = inject(CompanyDataService);
  readonly risk = (inject(DRAWER_DATA, { optional: true }) as RiskDetailDrawerData).risk;

  onClose() { this.drawerRef.close(null); }

  /**
   * Company name to display. In 'internal-audit' mode there's only ever
   * one company (the org auditing itself), so pull the live name from
   * CompanyDataService — the single source of truth — instead of trusting
   * whatever free-text `risk.company` happens to hold. In 'audit-firm'
   * mode risks span many client companies, so `risk.company` stays as-is.
   */
  get companyName(): string {
    if (this.clientMode === 'internal-audit') {
      return this.companyData.all[0]?.companyName ?? this.risk.company ?? RISK_EMPTY_VALUE;
    }
    return this.risk.company ?? RISK_EMPTY_VALUE;
  }

  /** DAR Exchange's divisions, used to resolve division name in 'internal-audit' mode. */
  private readonly darDivisions =
    DIVISION_INDI_ORG_COMPANIES.find(c => c.id === 'dar-exchange')?.divisions ?? [];

  /** DAR Exchange's canonical sub-division records, used to resolve sub-division name in 'internal-audit' mode. */
  private readonly darSubDivisionDivisions =
    SUB_DIVISION_INDI_ORG_COMPANIES.find(c => c.id === 'dar-exchange')?.divisions ?? [];

  /**
   * Division name to display. In 'internal-audit' mode there's one DAR
   * Exchange org structure to draw from, so show its first division's name
   * instead of trusting whatever free-text `risk.division` holds. In
   * 'audit-firm' mode, `risk.division` stays as-is.
   */
  get divisionName(): string {
    if (this.clientMode === 'internal-audit') {
      return this.darDivisions[0]?.divisionName ?? this.risk.division ?? RISK_EMPTY_VALUE;
    }
    return this.risk.division || RISK_EMPTY_VALUE;
  }

  /**
   * Sub-division name to display. In 'internal-audit' mode, show the first
   * division's first sub-division name from the dedicated sub-division seed
   * (sub-division-static-indi-org.data.ts) instead of trusting whatever
   * free-text `risk.subDivision` holds. In 'audit-firm' mode, `risk.subDivision`
   * stays as-is.
   */
  get subDivisionName(): string {
    if (this.clientMode === 'internal-audit') {
      return this.darSubDivisionDivisions[0]?.subDivisions?.[0]?.subDivisionName ?? this.risk.subDivision ?? RISK_EMPTY_VALUE;
    }
    return this.risk.subDivision || RISK_EMPTY_VALUE;
  }

  readonly riskTypeLabels: Record<RiskType, string> = RISK_TYPE_LABELS;

  readonly ceLabels: Record<ControlEffectiveness, string> = RISK_CONTROL_EFFECTIVENESS_LABELS;

  // Exposed for the template.
  readonly residualLevelIcons = RISK_RESIDUAL_LEVEL_ICONS;
  readonly maxScore           = RISK_MAX_SCORE;

  statusLabel(s: RiskStatus): string {
    return RISK_STATUS_LABELS[s] ?? s;
  }

  get scoreBarWidth(): number {
    return Math.min(100, (this.risk.inherentScore / RISK_MAX_SCORE) * 100);
  }

  get residualBarWidth(): number {
    return Math.min(100, (this.risk.residualScore / RISK_MAX_SCORE) * 100);
  }

  /** total linked scopes + findings + observations (stat card + section badge) */
  get linkedTotal(): number {
    return (this.risk.linkedScopes?.length ?? 0)
      + (this.risk.linkedFindings?.length ?? 0)
      + (this.risk.linkedObservations?.length ?? 0);
  }

  downloadFile(f: RiskFile): void {
    const src = f.file ?? f.url;
    if (src) this.downloader.download(src, f.name);
  }

  canDownload(f: RiskFile): boolean { return !!(f.url || f.file); }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024, s = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
  }

  fileIcon(name: string): string {
    return riskFileIcon(name);
  }
}