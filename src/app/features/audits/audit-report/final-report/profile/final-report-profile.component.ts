import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import type { AuditReportEntry } from '@/app/features/audits/audit-report/final-report/models/final-report-list.model';
import type { AuditType, ReportPeriod, ReportStatus } from '@/app/features/audits/audit-report/final-report/models/final-report-static-data.model';
import type { FinalReportProfileDrawerData } from '@/app/features/audits/audit-report/final-report/models/final-report.model';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import {
  REPORT_EMPTY_LABEL,
  REPORT_INDUSTRY_LABELS,
  REPORT_PROFILE_COMPANY_COLORS,
  REPORT_PROFILE_COMPANY_LABELS,
  REPORT_TEMPLATE_STATUS_LABELS,
  REPORT_TEMPLATE_STATUS_SEVERITY,
} from '@/app/features/audits/audit-report/report-template/constants/report-template-labels.constants';
import { REPORT_TEMPLATE_DEFAULT_FILE_NAME } from '@/app/features/audits/audit-report/report-template/constants/report-template.constants';
import {
  FINAL_REPORT_DEFAULT_COMPANY_COLOR,
  FINAL_REPORT_DEFAULT_FILE_NAME,
  FINAL_REPORT_FILE_EXTENSION,
  FINAL_REPORT_SAMPLE_REPORT_FILE_URL,
  FINAL_REPORT_SAMPLE_TEMPLATE_FILE_URL,
  MONTH_SHORT_NAMES,
  MS_PER_DAY,
  PERIOD_ZONE_PREFIXES,
} from '../constants/final-report.constants';
import {
  AUDIT_TYPE_LABELS,
  REPORT_PERIOD_LABELS,
  REPORT_STATUS_DEFAULT_SEVERITY,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_SEVERITY,
  monthPeriodZoneLabel,
  type ReportStatusSeverity,
} from '../constants/final-report-labels.constants';

@Component({
  selector: 'app-final-report-profile',
  standalone: true,
  imports: [CommonModule, TagModule, TooltipModule, ButtonModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './final-report-profile.component.html',
  styleUrls: ['./final-report-profile.component.scss'],
})
export class FinalReportProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  private readonly downloader = inject(FileDownloadService);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as FinalReportProfileDrawerData | null;

  private readonly _report = signal<AuditReportEntry | null>(this.data?.report ?? null);
  readonly r = computed(() => this._report());

  readonly durationDays = computed<number | null>(() => {
    const report = this._report();
    if (!report) return null;
    const created = new Date(report.createdDate).getTime();
    const updated = new Date(report.updatedDate).getTime();
    if (isNaN(created) || isNaN(updated)) return null;
    return Math.max(0, Math.round((updated - created) / MS_PER_DAY));
  });

  readonly TEMPLATE_STATUS_LABELS = REPORT_TEMPLATE_STATUS_LABELS;
  readonly TEMPLATE_STATUS_SEVERITY = REPORT_TEMPLATE_STATUS_SEVERITY;

  onHide(): void {
    this.drawerRef.close(null);
  }

  getCompanyLabel(id?: string): string {
    return REPORT_PROFILE_COMPANY_LABELS[id ?? ''] ?? (id ?? REPORT_EMPTY_LABEL);
  }

  getCompanyColor(id?: string): string {
    return REPORT_PROFILE_COMPANY_COLORS[id ?? ''] ?? FINAL_REPORT_DEFAULT_COMPANY_COLOR;
  }

  auditTypeLabel(t?: AuditType): string {
    return t ? AUDIT_TYPE_LABELS[t] : REPORT_EMPTY_LABEL;
  }

  reportPeriodLabel(p?: ReportPeriod): string {
    return p ? REPORT_PERIOD_LABELS[p] : REPORT_EMPTY_LABEL;
  }

  statusLabel(s?: ReportStatus): string {
    return s ? REPORT_STATUS_LABELS[s] : REPORT_EMPTY_LABEL;
  }

  statusSeverity(s?: ReportStatus): ReportStatusSeverity {
    return s ? REPORT_STATUS_SEVERITY[s] : REPORT_STATUS_DEFAULT_SEVERITY;
  }

  /** Turns a raw periodZone code ('Q1', 'M3', 'H1') into a readable label. */
  periodZoneLabel(zone?: string): string {
    if (!zone) return '';
    if (zone.startsWith(PERIOD_ZONE_PREFIXES.Month)) {
      const idx = parseInt(zone.slice(1), 10) - 1;
      return MONTH_SHORT_NAMES[idx] ? monthPeriodZoneLabel(zone, MONTH_SHORT_NAMES[idx]) : zone;
    }
    return zone;
  }

  industryLabel(val?: string): string {
    if (!val) return REPORT_EMPTY_LABEL;
    return REPORT_INDUSTRY_LABELS[val] ?? val;
  }

  openTemplateFile(fileName: string): void {
    this.downloader.download(FINAL_REPORT_SAMPLE_TEMPLATE_FILE_URL, fileName || REPORT_TEMPLATE_DEFAULT_FILE_NAME);
  }

  downloadReportFile(): void {
    const report = this.r();
    this.downloader.download(
      FINAL_REPORT_SAMPLE_REPORT_FILE_URL,
      `${report?.reportTitle || FINAL_REPORT_DEFAULT_FILE_NAME}${FINAL_REPORT_FILE_EXTENSION}`,
    );
  }
}
