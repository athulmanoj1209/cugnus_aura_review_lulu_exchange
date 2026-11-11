import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

import {
  AuditFinding,
  AuditFindingService,
  ESCALATION_POLICY,
  FindingSeverity,
  FindingStatus,
} from '@/app/features/audits/audit-execution/findings/services/audit-finding.service';
import {
  FINDING_FILE_SIZE_BASE,
  FINDING_QUERY_PARAMS,
  FINDINGS_LIST_ROUTE,
  FindingDetailTabs,
  type FindingDetailTab,
} from '../constants/findings.constants';
import {
  FINDING_EVIDENCE_ICON_DEFAULT,
  FINDING_EVIDENCE_ICONS,
  FINDING_SEVERITY_LABELS,
  FINDING_STATUS_LABELS,
} from '../constants/findings-labels.constants';
import { FINDING_EMPTY_VALUE } from '../constants/findings-messages.constants';

type DetailTab = FindingDetailTab;

/* ============================================================
 *  Finding Detail — routable page
 *
 *  Wire-up:
 *
 *    {
 *      path: 'follow-up-audit/:id',
 *      loadComponent: () =>
 *        import('./app/Admin/follow-up-audit/finding-detail.component')
 *          .then(c => c.FindingDetailComponent),
 *      data: { breadcrumb: 'Finding Detail' }
 *    }
 *
 *  The list page navigates here via router.navigate(['/follow-up-audit', f.id]).
 * ============================================================ */

@Component({
  selector: 'app-finding-detail',
  standalone: true,
  imports: [CommonModule, DatePipe,TooltipModule, DrawIconComponent, BackButtonComponent],
  templateUrl: './findings-detail.component.html',
  styleUrls: ['./findings-detail.component.scss'],
})
export class FindingDetailComponent implements OnInit {
 
  private readonly route      = inject(ActivatedRoute);
  private readonly service    = inject(AuditFindingService);
  private readonly destroyRef = inject(DestroyRef);
 
  readonly finding   = signal<AuditFinding | null>(null);
  readonly loading   = signal(true);
  readonly notFound  = signal(false);
  readonly tab       = signal<DetailTab>(FindingDetailTabs.Overview);
  readonly Tabs      = FindingDetailTabs;

  /** Org-wide policy rules (static — same for every finding). */
  readonly policy = ESCALATION_POLICY;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get(FINDING_QUERY_PARAMS.Id) ?? '';
    if (!id) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }
 
    this.service.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(f => {
        this.loading.set(false);
        if (f) this.finding.set(f);
        else this.notFound.set(true);
      });
  }
 
  /* ---------------- Navigation ---------------- */
 
  /** Path to the list page — used by the back button when there is no
      browser history (deep link). Change this if your list route differs. */
  protected readonly listRoute = FINDINGS_LIST_ROUTE;

  severityWithLabel(severity: FindingSeverity): string {
    const label = this.severityLabel(severity);

    return $localize`:@@audit.findings.severityValue:${label}:severity: Severity`;
  }

  uploadedByLabel(name: string): string {
    return $localize`:@@audit.findings.uploadedByName:Uploaded by ${name}:name:`;
  }

  updatedByLabel(name: string): string {
    return $localize`:@@audit.findings.updatedByName:Updated by ${name}:name:`;
  }

  escalatedToLabel(name: string): string {
    return $localize`:@@audit.findings.escalatedToName:Escalated to ${name}:name:`;
  }

  evidenceTabLabel(count: number): string {
    return $localize`:@@audit.findings.evidenceTab:Evidence (${count}:count:)`;
  }

  escalationTabLabel(count: number): string {
    return $localize`:@@audit.findings.escalationTab:Escalation (${count}:count:)`;
  }

  daysOverdueLabel(days: number): string {
    return days === 1
      ? $localize`:@@audit.findings.dayOverdue:${days}:days: day overdue`
      : $localize`:@@audit.findings.daysOverdue:${days}:days: days overdue`;
  }
 
  setTab(t: DetailTab): void {
    this.tab.set(t);
  }
 
  /* ---------------- Display helpers ---------------- */
 
  severityLabel(s: FindingSeverity | undefined): string {
    if (!s) return '';
    const map: Record<FindingSeverity, string> = {
      critical: $localize`:@@common.critical:Critical`,
      high: $localize`:@@common.high:High`,
      medium: $localize`:@@common.medium:Medium`,
      low: $localize`:@@common.low:Low`,
    };
    return map[s];
  }

  statusLabel(s: FindingStatus): string {
    const map: Record<FindingStatus, string> = {
      open: $localize`:@@common.open:Open`,
      'in-progress': $localize`:@@audit.findings.inProgress:In Progress`,
      responded: $localize`:@@audit.findings.responded:Responded`,
      verified: $localize`:@@audit.findings.verified:Verified`,
      closed: $localize`:@@common.closed:Closed`,
      overdue: $localize`:@@common.overdue:Overdue`,
      escalated: $localize`:@@audit.findings.escalated:Escalated`,
      rejected: $localize`:@@common.rejected:Rejected`,
    };
    return map[s];
  }
 
  /* ---------------- Evidence display helpers ---------------- */
 
  /** Pretty file size — "1.2 MB", "640 KB". */
  formatFileSize(bytes?: number): string {
    if (!bytes && bytes !== 0) return FINDING_EMPTY_VALUE;
    const k = FINDING_FILE_SIZE_BASE;
    if (bytes < k)            return `${bytes} B`;
    const kb = bytes / k;
    if (kb < k)               return `${kb.toFixed(1)} KB`;
    return `${(kb / k).toFixed(1)} MB`;
  }

  /** PrimeIcon class for a given file extension. */
  iconForFile(fileType?: string): string {
    return FINDING_EVIDENCE_ICONS[fileType?.toLowerCase() ?? ''] ?? FINDING_EVIDENCE_ICON_DEFAULT;
  }
}