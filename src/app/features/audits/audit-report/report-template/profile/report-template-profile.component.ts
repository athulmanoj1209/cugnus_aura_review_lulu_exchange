import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import type { ReportTemplate } from '@/app/features/audits/audit-report/report-template/models/report-template-list.model';
import type { ReportTemplateProfileDrawerData } from '@/app/features/audits/audit-report/report-template/models/report-template.model';
import { AUDIT_REPORTS } from '@/app/features/audits/audit-report/final-report/list/final-report-list.component';
import type { AuditReportEntry } from '@/app/features/audits/audit-report/final-report/models/final-report-list.model';
import type { ReportStatus } from '@/app/features/audits/audit-report/final-report/models/final-report-static-data.model';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  REPORT_TEMPLATE_DEFAULT_COMPANY_COLOR,
  REPORT_TEMPLATE_DEFAULT_FILE_NAME,
  REPORT_TEMPLATE_LINKED_REPORTS_PAGE_SIZE,
  REPORT_TEMPLATE_SAMPLE_FILE_URL,
} from '../constants/report-template.constants';
import {
  REPORT_EMPTY_LABEL,
  REPORT_INDUSTRY_LABELS,
  REPORT_PROFILE_COMPANY_COLORS,
  REPORT_PROFILE_COMPANY_LABELS,
  REPORT_TEMPLATE_STATUS_LABELS,
  REPORT_TEMPLATE_STATUS_SEVERITY,
} from '../constants/report-template-labels.constants';
import {
  REPORT_STATUS_DEFAULT_SEVERITY,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_SEVERITY,
  type ReportStatusSeverity,
} from '@/app/features/audits/audit-report/final-report/constants/final-report-labels.constants';

@Component({
  selector: 'app-report-template-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    TooltipModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
  
    DrawIconComponent,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-template-profile.component.html',
  styleUrls: ['./report-template-profile.component.scss'],
})
export class ReportTemplateProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  private readonly downloader = inject(FileDownloadService);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as ReportTemplateProfileDrawerData | null;

  private readonly _template = signal<ReportTemplate | null>(this.data?.template ?? null);
  readonly t = computed(() => this._template());

  readonly inUseLabel = $localize`:@@audit.reportTemplate.inUse:In Use`;
  readonly availableLabel = $localize`:@@audit.reportTemplate.available:Available`;
  readonly noGeneratedReportsLabel = $localize`:@@audit.reportTemplate.noGeneratedReports:No reports have been generated from this template yet.`;
  readonly noReportsMatchSearchLabel = $localize`:@@audit.reportTemplate.noReportsMatchSearch:No reports match your search.`;

  /** Every report in the system generated from this template. */
  readonly linkedReports = computed<AuditReportEntry[]>(() => {
    const tpl = this._template();
    if (!tpl) return [];
    return AUDIT_REPORTS.filter(r => r.template?.templateName === tpl.templateName && r.companyId === tpl.companyId);
  });

  // ─── Linked-reports search & pagination ───────────────
  readonly REPORTS_PAGE_SIZE = REPORT_TEMPLATE_LINKED_REPORTS_PAGE_SIZE;
  readonly TEMPLATE_STATUS_LABELS = REPORT_TEMPLATE_STATUS_LABELS;
  readonly TEMPLATE_STATUS_SEVERITY = REPORT_TEMPLATE_STATUS_SEVERITY;

  private readonly _reportSearch = signal('');
  private readonly _reportsFirst = signal(0);

  readonly filteredReports = computed(() => {
    const q = this._reportSearch().toLowerCase().trim();
    const list = this.linkedReports();
    return q ? list.filter(r => r.reportTitle.toLowerCase().includes(q)) : list;
  });

  readonly pagedReports = computed(() =>
    this.filteredReports().slice(this._reportsFirst(), this._reportsFirst() + this.REPORTS_PAGE_SIZE)
  );

  getReportSearch(): string { return this._reportSearch(); }
  setReportSearch(q: string): void { this._reportSearch.set(q); this._reportsFirst.set(0); }
  getReportsFirst(): number { return this._reportsFirst(); }
  onReportsPageChange(event: { first?: number }): void { this._reportsFirst.set(event.first ?? 0); }

  onHide(): void {
    this.drawerRef.close(null);
  }

  downloadTemplateFile(): void {
    const tpl = this.t();
    if (!tpl) return;
    this.downloader.download(REPORT_TEMPLATE_SAMPLE_FILE_URL, tpl.templateFileName || REPORT_TEMPLATE_DEFAULT_FILE_NAME);
  }

  getCompanyLabel(id?: string): string {
    return REPORT_PROFILE_COMPANY_LABELS[id ?? ''] ?? (id ?? REPORT_EMPTY_LABEL);
  }

  getCompanyColor(id?: string): string {
    return REPORT_PROFILE_COMPANY_COLORS[id ?? ''] ?? REPORT_TEMPLATE_DEFAULT_COMPANY_COLOR;
  }

  industryLabel(val?: string): string {
    if (!val) return REPORT_EMPTY_LABEL;
    return REPORT_INDUSTRY_LABELS[val] ?? val;
  }

  statusLabel(s?: ReportStatus): string {
    return s ? REPORT_STATUS_LABELS[s] : REPORT_EMPTY_LABEL;
  }

  statusSeverity(s?: ReportStatus): ReportStatusSeverity {
    return s ? REPORT_STATUS_SEVERITY[s] : REPORT_STATUS_DEFAULT_SEVERITY;
  }
}
