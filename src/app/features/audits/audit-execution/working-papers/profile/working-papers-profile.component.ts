import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DRAWER_DATA, DrawerRef } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';

import { FileDownloadService } from '@/app/shared/services/file-download.service';
import { RiskLevel, WorkingPaper, WorkingPaperFile, WorkingPaperStatus, WorkingPaperType } from '../list/working-papers-list.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { WORKING_PAPER_FILE_SIZE_BASE, WORKING_PAPER_FILE_SIZE_UNITS } from '../constants/working-papers.constants';
import {
  RISK_LEVEL_LABELS,
  WORKING_PAPER_FILE_ICON_DEFAULT,
  WORKING_PAPER_FILE_ICONS,
  WORKING_PAPER_STATUS_LABELS,
  WORKING_PAPER_TYPE_LABELS,
} from '../constants/working-papers-labels.constants';
import { WORKING_PAPER_EMPTY_VALUE } from '../constants/working-papers-messages.constants';

export interface WorkingPaperDetailDrawerData {
  workingPaper: WorkingPaper;
}

@Component({
  selector: 'app-working-papers-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DrawIconComponent],
  templateUrl: './working-papers-profile.component.html',
  styleUrl: './working-papers-profile.component.scss',
})
export class WorkingPapersProfileComponent {
  private readonly drawerRef  = inject(DrawerRef);
  private readonly downloader = inject(FileDownloadService);
  private readonly clientMode = inject(CLIENT_MODE);
  private readonly companyService = inject(CompanyDataService);
  readonly wp = (inject(DRAWER_DATA, { optional: true }) as WorkingPaperDetailDrawerData).workingPaper;

  readonly clickToDownloadLabel = $localize`:@@audit.workingPapers.clickToDownload:Click to download`;

  filesAttachedLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.workingPapers.oneFileAttached:File Attached`
      : $localize`:@@audit.workingPapers.filesAttached:Files Attached`;
  }

  filesSizeLabel(count: number, totalSize: number): string {
    const size = this.formatFileSize(totalSize);

    return count === 1
      ? $localize`:@@audit.workingPapers.fileWithSize:${count}:count: file · ${size}:size:`
      : $localize`:@@audit.workingPapers.filesWithSize:${count}:count: files · ${size}:size:`;
  }

  /** Company/Branch/Department are only shown for internal-audit clients. */
  get isInternalAudit(): boolean {
    return this.clientMode === 'internal-audit';
  }

  /**
   * In internal-audit mode there's always exactly one company (the org
   * auditing itself), seeded from company-static-indi-org.data.ts via
   * CompanyDataService — so the name is read from there rather than from
   * wp.company.
   */
  get companyName(): string {
    if (this.isInternalAudit) {
      return this.companyService.all[0]?.companyName ?? this.wp.company ?? WORKING_PAPER_EMPTY_VALUE;
    }
    return this.wp.company ?? WORKING_PAPER_EMPTY_VALUE;
  }

  onClose(): void { this.drawerRef.close(null); }

  formatFileSize(bytes: number): string {
    if (!bytes) return `0 ${WORKING_PAPER_FILE_SIZE_UNITS[0]}`;
    const k = WORKING_PAPER_FILE_SIZE_BASE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${WORKING_PAPER_FILE_SIZE_UNITS[i]}`;
  }

  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    return WORKING_PAPER_FILE_ICONS[ext] ?? WORKING_PAPER_FILE_ICON_DEFAULT;
  }

  get totalSize(): number {
    return this.wp.files.reduce((sum, f) => sum + f.size, 0);
  }

  downloadFile(f: WorkingPaperFile): void {
    const source = f.file ?? f.url;
    if (source) this.downloader.download(source, f.name);
  }

  canDownload(f: WorkingPaperFile): boolean {
    return !!(f.url || f.file);
  }

  /* ── Label maps ── */
  typeLabel(t: WorkingPaperType): string {
    const map: Record<WorkingPaperType, string> = {
      lead_schedule: $localize`:@@audit.workingPapers.leadSchedule:Lead Schedule`,
      test_of_controls: $localize`:@@audit.workingPapers.testOfControls:Test of Controls`,
      substantive_test: $localize`:@@audit.workingPapers.substantiveTest:Substantive Test`,
      analytical_review: $localize`:@@audit.workingPapers.analyticalReview:Analytical Review`,
      reconciliation: $localize`:@@audit.workingPapers.reconciliation:Reconciliation`,
      memo: $localize`:@@audit.workingPapers.memorandum:Memorandum`,
      confirmation: $localize`:@@audit.workingPapers.confirmation:Confirmation`,
      other: $localize`:@@common.other:Other`,
    };
    return map[t] ?? t;
  }

  statusLabel(s: WorkingPaperStatus): string {
    const map: Record<WorkingPaperStatus, string> = {
      draft: $localize`:@@audit.workingPapers.draft:Draft`,
      in_progress: $localize`:@@audit.workingPapers.inProgress:In Progress`,
      prepared: $localize`:@@audit.workingPapers.prepared:Prepared`,
      under_review: $localize`:@@audit.workingPapers.underReview:Under Review`,
      reviewed: $localize`:@@audit.workingPapers.reviewed:Reviewed`,
      approved: $localize`:@@audit.workingPapers.approved:Approved`,
      reopened: $localize`:@@audit.workingPapers.reopened:Reopened`,
    };
    return map[s] ?? s;
  }

  riskLabel(r: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };
    return map[r] ?? r;
  }

  assertionLabel(assertion: string): string {
    const map: Record<string, string> = {
      'Existence': $localize`:@@audit.workingPapers.assertionExistence:Existence`,
      'Occurrence': $localize`:@@audit.workingPapers.assertionOccurrence:Occurrence`,
      'Completeness': $localize`:@@audit.workingPapers.assertionCompleteness:Completeness`,
      'Accuracy': $localize`:@@audit.workingPapers.assertionAccuracy:Accuracy`,
      'Valuation': $localize`:@@audit.workingPapers.assertionValuation:Valuation`,
      'Rights & Obligations': $localize`:@@audit.workingPapers.assertionRightsObligations:Rights & Obligations`,
      'Cut-off': $localize`:@@audit.workingPapers.assertionCutOff:Cut-off`,
      'Classification': $localize`:@@audit.workingPapers.assertionClassification:Classification`,
      'Presentation & Disclosure': $localize`:@@audit.workingPapers.assertionPresentationDisclosure:Presentation & Disclosure`,
    };

    return map[assertion] ?? assertion;
  }
}