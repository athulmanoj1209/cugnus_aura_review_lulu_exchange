import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import {
  NotificationSenderTypes,
  NotificationViewModes,
  type NotificationPortalRole,
  type NotificationSenderRole,
  type NotificationSenderType,
  type NotificationStatus,
  type NotificationViewMode,
  NOTIFICATION_DEFAULT_USER_ROLE,
  NOTIFICATION_DELETE_ACTION,
  NOTIFICATION_MESSAGE_PREVIEW_LENGTH,
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_PAGE_SIZE_OPTIONS,
  NOTIFICATION_TRUNCATE_SUFFIX,
  NOTIFICATION_VIEW_DIALOG_WIDTH,
} from '../constants/notifications.constants';
import {
  NOTIFICATION_PORTAL_VIEW_LABELS,
  NOTIFICATION_SYSTEM_BADGE_LABEL,
} from '../constants/notifications-labels.constants';
import {
  NOTIFICATION_EMPTY_STATE,
  NOTIFICATION_SEARCH_PLACEHOLDER,
} from '../constants/notifications-messages.constants';

export type PortalRole = NotificationPortalRole;

export interface NotificationItem {
  id: number;
  subject: string;
  message: string;
  sender: string;
  senderType: NotificationSenderType;
  /** Role of the person who sent this notification: Department Head (client side) or Audit Head (auditor side). Not set for system-generated notifications. */
  senderRole?: NotificationSenderRole;
  /** Which portal this notification belongs to. */
  audience?: PortalRole;
  dateTime: string;
  status: NotificationStatus;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
      id: 1,
      subject: 'Audit Plan Approved',
      message: 'The annual internal audit plan for FY 2026 has been reviewed and formally approved by the Audit Committee. All scheduled audit engagements are now active. Audit teams should proceed with planning activities for their assigned engagements as per the approved timeline.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'auditor',
      dateTime: '2026-06-28 09:15',
      status: 'active',
    },
    {
      id: 2,
      subject: 'Risk Assessment Pending Review',
      message: 'The risk assessment document for the IT General Controls audit engagement has been completed and submitted for your review. The assessment identifies 14 key risk areas including access management, change control, and business continuity. Please review and approve to proceed to fieldwork.',
      sender: 'Sarah Mitchell',
      senderType: 'user',
      senderRole: 'Audit Head',
      audience: 'auditor',
      dateTime: '2026-06-28 10:30',
      status: 'active',
    },
    {
      id: 3,
      subject: 'Control Testing Deadline Reminder',
      message: 'This is an automated reminder that the Q2 control testing completion deadline is in 5 business days (July 3, 2026). A total of 23 controls are still pending testing across 4 audit engagements. Auditors are requested to update their workpapers and notify their supervisors of any blockers.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'auditor',
      dateTime: '2026-06-27 08:00',
      status: 'active',
    },
    {
      id: 4,
      subject: 'Audit Findings Report Submitted',
      message: 'The audit findings report for the Revenue Recognition and Financial Reporting engagement has been submitted for management review. The report includes 3 high-priority findings and 5 medium-priority observations. Management responses are requested within 10 business days per audit policy.',
      sender: 'James Carter',
      senderType: 'user',
      senderRole: 'Department Head',
      audience: 'client',
      dateTime: '2026-06-27 14:45',
      status: 'active',
    },
    {
      id: 5,
      subject: 'New Audit Engagement Assigned',
      message: 'You have been assigned as the lead auditor for the Procurement and Vendor Management Controls review scheduled for Q3 2026. The engagement scope covers vendor onboarding, contract compliance, and purchase order authorization controls. Please acknowledge this assignment and initiate the planning phase.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'auditor',
      dateTime: '2026-06-26 11:20',
      status: 'active',
    },
    {
      id: 6,
      subject: 'Supporting Documents Required',
      message: 'Additional supporting documentation is required to complete the Fixed Assets and Capital Expenditure audit. The asset register reconciliation for Q1 2026 and the capitalization policy approval documents are outstanding. Please upload the required documents to the audit workpaper repository by June 30.',
      sender: 'Priya Nair',
      senderType: 'user',
      senderRole: 'Department Head',
      audience: 'client',
      dateTime: '2026-06-26 09:00',
      status: 'active',
    },
    {
      id: 7,
      subject: 'Compliance Assessment Overdue',
      message: 'The Anti-Money Laundering (AML) and Know Your Customer (KYC) compliance assessment was due on June 25, 2026 and is currently 3 days overdue. The compliance team has been notified. If not completed within 48 hours, the matter will be escalated to the Chief Compliance Officer per regulatory policy.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'client',
      dateTime: '2026-06-28 07:30',
      status: 'active',
    },
    {
      id: 8,
      subject: 'Audit Committee Meeting Scheduled',
      message: 'The Audit Committee quarterly meeting has been scheduled for July 10, 2026 at 10:00 AM. The agenda includes presentation of Q2 internal audit results, status update on prior period findings, and approval of the updated risk-based audit plan. All audit managers are required to attend and submit their presentations by July 7.',
      sender: 'Michael Ross',
      senderType: 'user',
      senderRole: 'Department Head',
      audience: 'client',
      dateTime: '2026-06-25 15:00',
      status: 'active',
    },
    {
      id: 9,
      subject: 'Engagement Scope Updated',
      message: 'The scope of the Treasury Operations and Cash Management audit engagement has been updated following the preliminary risk assessment. The revised scope now includes foreign exchange transaction controls and intercompany settlement processes. The audit timeline has been extended by 2 weeks to accommodate the expanded scope.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'auditor',
      dateTime: '2026-06-25 10:10',
      status: 'inactive',
    },
    {
      id: 10,
      subject: 'Evidence Request – Logical Access Controls',
      message: 'As part of the IT General Controls audit, we require evidence of the quarterly user access review conducted for the ERP system. Please provide the access review sign-off documentation, list of privileged users, and any exceptions identified during the review period January – March 2026.',
      sender: 'Laura Bennett',
      senderType: 'user',
      senderRole: 'Audit Head',
      audience: 'auditor',
      dateTime: '2026-06-24 13:30',
      status: 'active',
    },
    {
      id: 11,
      subject: 'High-Risk Finding Identified',
      message: 'A critical segregation of duties (SoD) conflict has been detected in the accounts payable processing workflow. The same user role has authority to both create vendors and approve payments, creating a significant fraud risk. An immediate remediation plan is required. Refer to Finding ID: AUDIT-2026-047 for full details.',
      sender: 'Cygnus Aura',
      senderType: 'system',
      audience: 'auditor',
      dateTime: '2026-06-23 16:00',
      status: 'inactive',
    },
    {
      id: 12,
      subject: 'Quarterly Review Report Ready',
      message: 'The Q2 2026 internal audit quarterly review report has been finalized and is ready for distribution to senior management and the Audit Committee. The report summarizes completed engagements, open findings status, key performance indicators, and rolling 12-month audit plan coverage.',
      sender: 'David Okafor',
      senderType: 'user',
      senderRole: 'Department Head',
      audience: 'client',
      dateTime: '2026-06-22 11:00',
      status: 'active',
    },
];

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule, TooltipModule, DialogModule, TagModule, ConfirmActionDialogComponent, DrawIconComponent, BackButtonComponent],
  templateUrl: './notifications.components.html',
  styleUrl: './notifications.components.scss',
})
export class Notifications {
  // ── Role simulation ────────────────────────────────────────────────────────
  // Hardcoded for now — replace with the logged-in user's actual portal role from the auth/session service.
  // Uncomment one to simulate the respective view: 'client' shows notifications sent by Department Heads,
  // 'auditor' shows notifications sent by Audit Heads.
  userRole: PortalRole = NOTIFICATION_DEFAULT_USER_ROLE;
  // userRole: PortalRole = NotificationPortalRoles.Client;

  viewMode: NotificationViewMode = NotificationViewModes.List;
  searchQuery = '';
  pageSize = NOTIFICATION_PAGE_SIZE;

  // Exposed for the template.
  readonly NotificationViewModes   = NotificationViewModes;
  readonly NotificationSenderTypes = NotificationSenderTypes;
  readonly pageSizeOptions         = NOTIFICATION_PAGE_SIZE_OPTIONS;
  readonly previewLength           = NOTIFICATION_MESSAGE_PREVIEW_LENGTH;
  readonly viewDialogWidth         = NOTIFICATION_VIEW_DIALOG_WIDTH;
  readonly deleteAction            = NOTIFICATION_DELETE_ACTION;
  readonly portalViewLabels        = NOTIFICATION_PORTAL_VIEW_LABELS;
  readonly systemBadgeLabel        = NOTIFICATION_SYSTEM_BADGE_LABEL;
  readonly emptyState              = NOTIFICATION_EMPTY_STATE;
  readonly searchPlaceholder       = NOTIFICATION_SEARCH_PLACEHOLDER;

  showViewDialog = false;
  viewingItem: NotificationItem | null = null;

  showConfirmDialog = false;
  confirmTarget: { id: number; name: string } | null = null;

  notifications: NotificationItem[] = MOCK_NOTIFICATIONS;

  senderRoleLabel(role: NotificationItem['senderRole']): string {
    if (!role) return '';

    const map: Record<NonNullable<NotificationItem['senderRole']>, string> = {
      'Department Head': $localize`:@@audit.notification.departmentHead:Department Head`,
      'Audit Head': $localize`:@@audit.notification.auditHead:Audit Head`,
    };
    return map[role];
  }

  get filteredNotifications(): NotificationItem[] {
    const q = this.searchQuery.toLowerCase().trim();
    const list = this.notifications
      .filter(n => n.audience === this.userRole)
      .filter(n => !q ||
        n.subject.toLowerCase().includes(q) ||
        n.sender.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      );
    return list.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
  }

  truncate(text: string, max: number): string {
    return text && text.length > max ? text.substring(0, max) + NOTIFICATION_TRUNCATE_SUFFIX : (text || '');
  }

  initials(sender: string): string {
    return sender.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  viewNotification(item: NotificationItem): void {
    this.viewingItem = item;
    this.showViewDialog = true;
  }

  openConfirm(item: NotificationItem): void {
    this.confirmTarget = { id: item.id, name: item.subject };
    this.showConfirmDialog = true;
  }

  closeConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmTarget = null;
  }

  confirmDelete(): void {
    if (!this.confirmTarget) return;
    this.notifications = this.notifications.filter(n => n.id !== this.confirmTarget!.id);
    this.closeConfirm();
  }
}
