import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { AuditNotification, ReportItem } from '../../models/client-dashboard.model';

// Placeholder source used until report files are served per-report by the backend.
const SAMPLE_REPORT_FILE_URL =
  `assets/data/org-static-data/dar-exchange/${encodeURIComponent('ABC Broadcast - IA  Draft H1_2025 1.0-Report.docx')}`;

@Component({
  selector: 'app-client-notifications-reports-tab',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, BadgeModule, ButtonModule, TooltipModule, DialogModule, DrawIconComponent],
  templateUrl: './client-notifications-reports-tab.component.html',
  styleUrls: ['./client-notifications-reports-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNotificationsReportsTabComponent {
  @Input() notifications: AuditNotification[] = [];
  @Input() reports: ReportItem[] = [];

  readonly DESCRIPTION_TRUNCATE_LENGTH = 80;
  readonly finalLabel = $localize`:@@common.final:Final`;
  readonly draftLabel = $localize`:@@common.draft:Draft`;

  readonly notifIcon: Record<string, string> = {
    danger: 'pi pi-exclamation-circle',
    warn: 'pi pi-exclamation-triangle',
    info: 'pi pi-info-circle',
    secondary: 'pi pi-check-circle',
  };

  // ── Notification modal ───────────────────────────────────────────────────
  notifDialogVisible = false;
  selectedNotif: AuditNotification | null = null;

  private readonly downloader = inject(FileDownloadService);

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  isTruncated(description: string): boolean {
    return description.length > this.DESCRIPTION_TRUNCATE_LENGTH;
  }

  truncate(description: string): string {
    return this.isTruncated(description)
      ? description.slice(0, this.DESCRIPTION_TRUNCATE_LENGTH).trimEnd() + '…'
      : description;
  }

  /** Marks the notification read (mutates the shared object, so the parent's unread
   *  badge updates too) and opens its detail dialog. */
  openNotif(notif: AuditNotification): void {
    notif.read = true;
    this.selectedNotif = notif;
    this.notifDialogVisible = true;
  }

  closeNotifDialog(): void {
    this.notifDialogVisible = false;
    this.selectedNotif = null;
  }

  downloadReport(report: ReportItem): void {
    this.downloader.download(SAMPLE_REPORT_FILE_URL, `${report.name}.docx`);
  }
}
