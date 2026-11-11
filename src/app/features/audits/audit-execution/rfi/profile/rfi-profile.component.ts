import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmDialogService } from '@/app/shared/components/confirm-action-dialog/services/confirm-dialog.service';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { QuestionareSection } from '@/app/features/audits/audit-execution/rfi/com/questionare-section/questionare-section.component';
import type { EnrichedRFI } from '@/app/features/audits/audit-execution/rfi/models/rfi-list.model';
import type { RfiProfileDrawerData, StaticDoc } from '@/app/features/audits/audit-execution/rfi/models/rfi.model';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';
import { acceptStaticRfiResponse, rejectStaticRfiResponse } from '@/app/features/audits/audit-execution/rfi/rfi-static-data';
import { resolveScopeOrgLabels, type ScopeOrgLabels } from '@/app/shared/utils/no-sub-division-message';
import { RFI_DRAWER, RFI_REFERENCE_DOCS, RfiStatuses, RfiViewerRoles } from '../constants/rfi.constants';
import {
  RFI_RESPONSE_STATUS_DEFAULT_LABEL,
  RFI_RESPONSE_STATUS_DEFAULT_SEVERITY,
  RFI_RESPONSE_STATUS_LABELS,
  RFI_RESPONSE_STATUS_SEVERITY,
  RFI_STATUS_DEFAULT_LABEL,
  RFI_STATUS_DEFAULT_SEVERITY,
  RFI_STATUS_LABELS,
  RFI_STATUS_SEVERITY,
  RFI_TAB_LABELS,
  RFI_REFERENCE_DOC_DESCRIPTIONS,
  type TagSeverity,
} from '../constants/rfi-labels.constants';
import {
  RFI_CONFIRM_DIALOGS,
  RFI_PROFILE_NOTICES,
  RFI_TOAST_MESSAGES,
} from '../constants/rfi-messages.constants';

@Component({
  selector: 'app-rfi-profile',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TabsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    DividerModule,
    MessageModule,
    PanelModule,
    TagModule,
    TextareaModule,
    ToastModule,
    TooltipModule,
    DialogModule,
    QuestionareSection,
  ],
  providers: [MessageService],
  templateUrl: './rfi-profile.component.html',
  styleUrl: './rfi-profile.component.scss',
})
export class RfiProfileComponent implements OnDestroy {
  private readonly drawerRef = inject(DrawerRef);
  private readonly confirmSvc = inject(ConfirmDialogService);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as RfiProfileDrawerData | null;

  private readonly toast = inject(ToastService);

  readonly noAnswerProvidedLabel = $localize`:@@audit.rfi.noAnswerProvided:No answer provided`;

  rfiBasisLevelLabel(hasSubDivision: boolean): string {
    return hasSubDivision
      ? $localize`:@@audit.rfi.subDivisionLevel:Sub-Division level`
      : $localize`:@@audit.rfi.divisionLevel:Division level`;
  }

  questionCountLabel(count: number): string {
    return count === 1
      ? $localize`:@@audit.rfi.oneQuestion:${count}:count: Question`
      : $localize`:@@audit.rfi.questionsCount:${count}:count: Questions`;
  }

  responseHistoryMessage(count: number): string {
    return count === 1
      ? $localize`:@@audit.rfi.onePreviousResponse:This RFI has ${count}:count: previous response that was rejected before the current submission.`
      : $localize`:@@audit.rfi.previousResponses:This RFI has ${count}:count: previous responses that were rejected before the current submission.`;
  }

  responseNumberLabel(number: number): string {
    return $localize`:@@audit.rfi.responseNumber:Response #${number}:number:`;
  }

  questionNumberLabel(number: number): string {
    return $localize`:@@audit.rfi.questionNumber:Q${number}:number:`;
  }

  // ── RFI being viewed — always set for this component ───────────────────────
  rfi: EnrichedRFI | null = this.data?.rfi ?? null;

  /** Live company / division / sub-division labels — `rfi.company` is only the company id. */
  get org(): ScopeOrgLabels | null {
    return this.rfi
      ? resolveScopeOrgLabels(this.rfi.company, this.rfi.divisionCode, this.rfi.subDivisionLabel)
      : null;
  }

  // ── Current user — drives auditor vs client rendering ─────────────────────
  currentUser: string = this.data?.currentUser ?? RfiViewerRoles.Auditor;

  readonly RfiStatuses = RfiStatuses;

  statusSeverity(status: string): TagSeverity {
    return RFI_STATUS_SEVERITY[status] ?? RFI_STATUS_DEFAULT_SEVERITY;
  }

  statusLabel(status: string): string {
    return RFI_STATUS_LABELS[status] ?? RFI_STATUS_DEFAULT_LABEL;
  }

  // Label for tab 0
  get tab1Label(): string {
    return RFI_TAB_LABELS.View;
  }

  activeTabIndex: string | number | undefined = 0;
  drawerWidth: string = RFI_DRAWER.InitialWidth;
  showRejectInput = false;
  rejectReason = '';
  private readonly boundOnResize = (event: MouseEvent) => this.onResize(event);
  private readonly boundOnResizeEnd = () => this.onResizeEnd();
  private subs = new Subscription();

  // ── Static backend documents ───────────────────────────────────────────────
  staticDocs: StaticDoc[] = this.getDefaultStaticDocs();

  private getDefaultStaticDocs(): StaticDoc[] {
    return [
      { ...RFI_REFERENCE_DOCS.AuditTheory, description: RFI_REFERENCE_DOC_DESCRIPTIONS.AuditTheory },
      { ...RFI_REFERENCE_DOCS.AuraBrd, description: RFI_REFERENCE_DOC_DESCRIPTIONS.AuraBrd },
    ];
  }

  // ── Response status helpers ────────────────────────────────────────────────
  responseSeverity(status: string): TagSeverity {
    return RFI_RESPONSE_STATUS_SEVERITY[status] ?? RFI_RESPONSE_STATUS_DEFAULT_SEVERITY;
  }

  responseStatusLabel(status: string): string {
    return RFI_RESPONSE_STATUS_LABELS[status] ?? RFI_RESPONSE_STATUS_DEFAULT_LABEL;
  }

  constructor(private messageService: MessageService) {}

  // ── Open / Download static doc ─────────────────────────────────────────────
  // These docs are served by the real backend (`http://localhost:5251/uploads/...`),
  // not through HttpClient, so the global error interceptor can't catch a failure
  // here — check reachability ourselves before opening/downloading.
  private async isDocReachable(url: string): Promise<boolean> {
    try {
      await fetch(url, { method: 'HEAD' });
      return true;
    } catch {
      return false;
    }
  }

  async openDoc(url: string): Promise<void> {
    if (!(await this.isDocReachable(url))) {
      this.toast.warning(RFI_TOAST_MESSAGES.FeatureUnderDevelopment, '');
      return;
    }
    window.open(url, '_blank');
  }

  async downloadDoc(doc: StaticDoc): Promise<void> {
    if (!(await this.isDocReachable(doc.url))) {
      this.toast.warning(RFI_TOAST_MESSAGES.FeatureUnderDevelopment, '');
      return;
    }
    const a = document.createElement('a');
    a.href = doc.url;
    a.download = doc.name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Auditor accept / reject ────────────────────────────────────────────────
  async onAcceptRfi(): Promise<void> {
    const ok = await this.confirmSvc.confirm({
      ...RFI_CONFIRM_DIALOGS.Accept,
      action: 'approve',
    });
    if (!ok) return;
    if (this.rfi) {
      acceptStaticRfiResponse(this.rfi.id);
    }
    this.onClose();
    this.toast.success(RFI_TOAST_MESSAGES.Accepted, RFI_TOAST_MESSAGES.AcceptedTitle);
    this.resetForm();
  }

  onRejectRfi(): void {
    this.showRejectInput = true;
  }

  async onSubmitReject(): Promise<void> {
    if (!this.rejectReason.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: RFI_PROFILE_NOTICES.ReasonRequiredSummary,
        detail: RFI_PROFILE_NOTICES.ReasonRequired,
      });
      return;
    }

    const ok = await this.confirmSvc.confirm({
      title: RFI_CONFIRM_DIALOGS.Reject.title,
      message: RFI_CONFIRM_DIALOGS.Reject.message(this.rejectReason),
      action: 'reject',
      confirmLabel: RFI_CONFIRM_DIALOGS.Reject.confirmLabel,
      cancelLabel: RFI_CONFIRM_DIALOGS.Reject.cancelLabel,
    });
    if (!ok) return;
    if (this.rfi) {
      rejectStaticRfiResponse(this.rfi.id, this.rejectReason);
    }
    this.onClose();
    this.toast.error(RFI_TOAST_MESSAGES.rejected(this.rejectReason), RFI_TOAST_MESSAGES.RejectedTitle);
    this.rejectReason = '';
    this.showRejectInput = false;
    this.resetForm();
  }

  onCancelReject(): void {
    this.showRejectInput = false;
    this.rejectReason = '';
  }

  private resetForm(): void {
    this.showRejectInput = false;
    this.rejectReason = '';

    this.subs.unsubscribe();
    this.subs = new Subscription();

    this.staticDocs = this.getDefaultStaticDocs();
  }

  onClose(): void {
    this.drawerRef.close(null);
  }

  onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    document.addEventListener('mousemove', this.boundOnResize);
    document.addEventListener('mouseup', this.boundOnResizeEnd);
  }

  private onResize(event: MouseEvent): void {
    const newWidth = window.innerWidth - event.clientX;
    if (newWidth >= RFI_DRAWER.ResizeMinWidth && newWidth <= RFI_DRAWER.ResizeMaxWidth) {
      this.drawerWidth = `${newWidth}px`;
      const panel = document.querySelector(RFI_DRAWER.PanelSelector) as HTMLElement | null;
      if (panel) panel.style.width = this.drawerWidth;
    }
  }

  private onResizeEnd(): void {
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundOnResizeEnd);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    document.removeEventListener('mousemove', this.boundOnResize);
    document.removeEventListener('mouseup', this.boundOnResizeEnd);
  }
}
