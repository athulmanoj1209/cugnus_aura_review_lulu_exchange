import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DRAWER_DATA, DrawerRef } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  FINDING_FILE_SIZE_BASE,
  FINDING_FILE_SIZE_UNITS,
  FINDING_INITIALS_WORD_COUNT,
  type FindingSeverity,
} from '../constants/findings.constants';
import {
  FINDING_DOCUMENT_ICON_DEFAULT,
  FINDING_DOCUMENT_ICONS,
  FINDING_SEVERITY_LABELS,
  FINDING_STATUS_LABELS,
} from '../constants/findings-labels.constants';
import { FINDING_EMPTY_VALUE } from '../constants/findings-messages.constants';

/** Fallback label for a value not in a label map: capitalise the first letter. */
const capitalise = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export interface FindingDocument {
  name: string;
  size: number;   // bytes
  url?: string;
}

export interface FindingProfileData {
  id: string;
  title: string;
  severity: FindingSeverity;
  status: string;
  division?: string;
  scope?: string;
  subscope?: string;
  taskId?: string;
  company?: string;
  subDivision?: string;
  risk?: string;
  dueDate?: Date;
  createdAt?: Date;
  owner: { fullName: string; avatarUrl?: string; id?: string };
  description?: string;
  observationIds?: string[];
  documents?: FindingDocument[];
  financialImpact?: number;
  isRepeated?: boolean;
  flaggedForEscalation?: boolean;
  daysOverdue?: number;
}

@Component({
  selector: 'app-findings-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, ButtonModule, TooltipModule, DrawIconComponent],
  templateUrl: './findings-profile.component.html',
  styleUrls: ['./findings-profile.component.scss'],
})
export class FindingsProfileComponent {

  private readonly drawerRef = inject(DrawerRef) as DrawerRef<void, FindingProfileData>;

  /** Finding data injected by the drawer service */
  readonly f: FindingProfileData = inject(DRAWER_DATA) as FindingProfileData;

  /* ── Actions ────────────────────────────────────────────────── */
  close(): void { this.drawerRef.close(); }

  onDownload(doc: FindingDocument): void {
    if (doc.url) window.open(doc.url, '_blank');
  }

  /* ── Computed helpers ───────────────────────────────────────── */
  get totalFileSize(): number {
    return (this.f.documents ?? []).reduce((s, d) => s + d.size, 0);
  }

  filesSizeLabel(count: number, totalSize: number): string {
    const size = this.formatFileSize(totalSize);

    return count === 1
      ? $localize`:@@audit.findings.fileWithSize:${count}:count: file · ${size}:size:`
      : $localize`:@@audit.findings.filesWithSize:${count}:count: files · ${size}:size:`;
  }

  downloadFileLabel(name: string): string {
    return $localize`:@@audit.findings.downloadFileName:Download ${name}:fileName:`;
  }

  daysOverdueLabel(days: number): string {
    return $localize`:@@audit.findings.daysOverdueShort:${days}:days:d overdue`;
  }

  severityLabel(s: FindingProfileData['severity']): string {
    const labels: Record<FindingProfileData['severity'], string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };

    return labels[s] ?? '—';
  }

  statusLabel(s: string): string {
    const labels: Record<string, string> = {
      open: $localize`:@@common.open:Open`,
      'in-progress': $localize`:@@audit.findings.inProgress:In Progress`,
      responded: $localize`:@@audit.findings.responded:Responded`,
      verified: $localize`:@@audit.findings.verified:Verified`,
      closed: $localize`:@@common.closed:Closed`,
      overdue: $localize`:@@common.overdue:Overdue`,
      escalated: $localize`:@@audit.findings.escalated:Escalated`,
      rejected: $localize`:@@common.rejected:Rejected`,
    };

    return labels[s] ?? s ?? '—';
  }

  initials(name: string): string {
    return (name ?? '')
      .split(/\s+/)
      .map(p => p[0])
      .slice(0, FINDING_INITIALS_WORD_COUNT)
      .join('')
      .toUpperCase();
  }

  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return FINDING_DOCUMENT_ICONS[ext] ?? FINDING_DOCUMENT_ICON_DEFAULT;
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${FINDING_FILE_SIZE_UNITS[0]}`;
    const k = FINDING_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${FINDING_FILE_SIZE_UNITS[i]}`;
  }
}