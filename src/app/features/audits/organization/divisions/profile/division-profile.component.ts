import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

import type { Division } from '@/app/features/audits/organization/divisions/models/division-list.model';
import type { DivisionProfileDrawerData } from '@/app/features/audits/organization/divisions/models/division.model';
import { SUB_DIVISION_TYPE_OPTIONS } from '@/app/features/audits/organization/sub-divisions/sub-division-static-data';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  DivisionAuditStatuses,
  DivisionRiskRatings,
  DivisionStatuses,
  LicenseExpiryTones,
  type LicenseExpiryTone,
  LICENSE_EXPIRY_WARN_DAYS,
} from '@/app/features/audits/organization/divisions/constants/division.constants';
import {
  DIVISION_AUDIT_STATUS_LABELS,
  DIVISION_AUDIT_STATUS_SEVERITY,
  DIVISION_COUNTRY_SHORT_LABELS,
  DIVISION_EMIRATE_LABELS,
  DIVISION_RISK_RATING_LABELS,
  DIVISION_RISK_STATUS_LABELS,
  DIVISION_SECTOR_LABELS,
  DIVISION_STATUS_LABELS,
  DIVISION_TYPE_SHORT_LABELS,
} from '@/app/features/audits/organization/divisions/constants/division-labels.constants';

@Component({
  selector: 'app-division-profile',
  standalone: true,
  imports: [CommonModule, TagModule, TooltipModule, ButtonModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './division-profile.component.html',
  styleUrls: ['./division-profile.component.scss'],
})
export class DivisionProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as DivisionProfileDrawerData | null;

  // Exposed for the template.
  readonly DivisionStatuses = DivisionStatuses;
  readonly LicenseExpiryTones = LicenseExpiryTones;
  readonly divisionStatusLabels = DIVISION_STATUS_LABELS;

  private readonly _division = signal<Division | null>(this.data?.division ?? null);

  readonly b = computed(() => this._division());

  readonly yearsOperational = computed<number | null>(() => {
    const d = this._division()?.operationalSince;
    if (!d) return null;
    const date = new Date(d);
    if (isNaN(date.getTime())) return null;
    return Math.max(0, Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000)));
  });

  readonly licenseExpiryInfo = computed<{ label: string; tone: LicenseExpiryTone } | null>(() => {
    const d = this._division()?.licenseExpiryDate;
    if (!d) return null;
    const date = new Date(d);
    if (isNaN(date.getTime())) return null;
    const days = Math.floor((date.getTime() - Date.now()) / (24 * 3600 * 1000));
    if (days < 0) return { label: `Expired ${Math.abs(days)} days ago`, tone: LicenseExpiryTones.Expired };
    if (days < LICENSE_EXPIRY_WARN_DAYS) return { label: `Expires in ${days} days`, tone: LicenseExpiryTones.Warn };
    return { label: `Expires in ${days} days`, tone: LicenseExpiryTones.Ok };
  });

  onHide(): void {
    this.drawerRef.close(null);
  }

  divisionTypeLabel(t?: string): string {
    return DIVISION_TYPE_SHORT_LABELS[t ?? ''] ?? (t ?? '—');
  }

  departmentTypeLabel(t?: string | null): string {
    return SUB_DIVISION_TYPE_OPTIONS.find(o => o.value === t)?.label ?? (t ?? '—');
  }

  countryLabel(c?: string): string {
    return DIVISION_COUNTRY_SHORT_LABELS[c ?? ''] ?? (c?.toUpperCase() ?? '—');
  }

  emirateLabel(e?: string): string {
    return DIVISION_EMIRATE_LABELS[e ?? ''] ?? (e ?? '—');
  }

  riskSeverity(r?: string): 'success' | 'warn' | 'danger' | 'secondary' {
    return r === DivisionRiskRatings.Low ? 'success'
      : r === DivisionRiskRatings.Medium ? 'warn'
      : r === DivisionRiskRatings.High ? 'danger'
      : 'secondary';
  }

  riskLabel(r?: string): string {
    return DIVISION_RISK_RATING_LABELS[r ?? ''] ?? (r ?? '—');
  }

  /** Only the four planning statuses get a label here; any other value falls back to the raw value (unchanged behaviour). */
  auditLabel(s?: string): string {
    return this.isPlanningAuditStatus(s) ? DIVISION_AUDIT_STATUS_LABELS[s!] : (s ?? '—');
  }

  auditSeverity(s?: string): 'success' | 'info' | 'warn' | 'secondary' {
    return this.isPlanningAuditStatus(s)
      ? DIVISION_AUDIT_STATUS_SEVERITY[s!] as 'success' | 'info' | 'warn' | 'secondary'
      : 'secondary';
  }

  private isPlanningAuditStatus(s?: string): boolean {
    return s === DivisionAuditStatuses.Completed || s === DivisionAuditStatuses.InProgress
      || s === DivisionAuditStatuses.Planned || s === DivisionAuditStatuses.NotPlanned;
  }

  sectorLabel(s?: string): string {
    return DIVISION_SECTOR_LABELS[s ?? ''] ?? (s?.replace(/_/g, ' ') ?? '—');
  }

  riskStatusLabel(s?: string): string {
    return DIVISION_RISK_STATUS_LABELS[s ?? ''] ?? (s ?? '—');
  }

  subDivisionStatusSeverity(s?: string): 'success' | 'secondary' {
    return s === DivisionStatuses.Active ? 'success' : 'secondary';
  }
}
