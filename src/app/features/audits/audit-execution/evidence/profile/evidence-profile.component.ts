import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { Evidence, EvidenceFile, EvidenceType } from '../list/evidence-list.component';
import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { EVIDENCE_FILE_SIZE_BASE, EVIDENCE_FILE_SIZE_UNITS } from '../constants/evidence.constants';
import {
  EVIDENCE_FILE_ICON_DEFAULT,
  EVIDENCE_FILE_ICONS,
  EVIDENCE_TYPE_LABELS,
} from '../constants/evidence-labels.constants';

export interface EvidenceDetailDrawerData {
  evidence: Evidence;
}

@Component({
  selector: 'app-evidence-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DrawIconComponent],
  templateUrl: './evidence-profile.component.html',
  styleUrl: './evidence-profile.component.scss',
})
export class EvidenceProfileComponent {
  private readonly drawerRef   = inject(DrawerRef);
  private readonly downloader  = inject(FileDownloadService);
  readonly ev = (inject(DRAWER_DATA, { optional: true }) as EvidenceDetailDrawerData).evidence;

  readonly clickToDownloadLabel = $localize`:@@audit.evidence.clickToDownload:Click to download`;

  onClose(): void { this.drawerRef.close(null); }

  filesAttachedLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.evidence.fileAttached:File Attached`
      : $localize`:@@audit.evidence.filesAttached:Files Attached`;
  }

  fileCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.evidence.fileCount:${count}:count: file`
      : $localize`:@@audit.evidence.filesCount:${count}:count: files`;
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${EVIDENCE_FILE_SIZE_UNITS[0]}`;
    const k = EVIDENCE_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${EVIDENCE_FILE_SIZE_UNITS[i]}`;
  }

  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return EVIDENCE_FILE_ICONS[ext] ?? EVIDENCE_FILE_ICON_DEFAULT;
  }

  get totalSize(): number {
    return this.ev.files.reduce((sum, f) => sum + f.size, 0);
  }

  downloadFile(f: EvidenceFile): void {
    const source = f.file ?? f.url;
    if (source) this.downloader.download(source, f.name);
  }

  canDownload(f: EvidenceFile): boolean {
    return !!(f.url || f.file);
  }

  evidenceTypeLabel(t: EvidenceType): string {
    const map: Record<EvidenceType, string> = {
      document: $localize`:@@audit.evidence.typeDocument:Document`,
      screenshot: $localize`:@@audit.evidence.typeScreenshot:Screenshot`,
      interview_notes: $localize`:@@audit.evidence.typeInterviewNotes:Interview Notes`,
      system_log: $localize`:@@audit.evidence.typeSystemLog:System Log`,
      email: $localize`:@@audit.evidence.typeEmail:Email`,
      physical_inspection: $localize`:@@audit.evidence.typePhysicalInspection:Physical Inspection`,
      other: $localize`:@@audit.evidence.typeOther:Other`,
    };
    return map[t] ?? t;
  }
}