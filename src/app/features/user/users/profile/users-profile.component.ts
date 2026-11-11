import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { User, UserRole, UserStatus } from '@/app/features/user/users/services/users.service';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/** Close-result emitted when used in drawer mode. */
export type UserProfileAction =
  | { kind: 'edit'; userId: string }
  | { kind: 'delete'; userId: string }
  | { kind: 'reset-password'; userId: string }
  | { kind: 'toggle-status'; userId: string; nextStatus: UserStatus }
  | { kind: 'resend-invitation'; userId: string };

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DatePipe, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.scss'],
})
export class UserProfileComponent {

  /** Drawer mode wiring (optional — falls back to @Input). */
  private readonly drawerRef = inject(DrawerRef, { optional: true }) as
    | DrawerRef<UserProfileAction | null, User>
    | null;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as User | null;

  private readonly _user = signal<User | null>(this.drawerData);
  readonly twoFactorEnabledLabel = $localize`:@@common.enabled:Enabled`;
  readonly twoFactorDisabledLabel = $localize`:@@common.disabled:Disabled`;

  @Input() set user(value: User | null | undefined) {
    if (value) this._user.set(value);
  }
  get user(): User | null { return this._user(); }

  /** Embedded-page outputs. */
  @Output() readonly closed              = new EventEmitter<void>();
  @Output() readonly edit                = new EventEmitter<User>();
  @Output() readonly delete              = new EventEmitter<User>();
  @Output() readonly toggleStatus        = new EventEmitter<User>();
  @Output() readonly resendInvitation    = new EventEmitter<User>();
  @Output() readonly resetPassword       = new EventEmitter<User>();

  /* ---------------- Derived ---------------- */
  readonly u = computed(() => this._user());

  readonly initials = computed(() => {
    const name = this._user()?.fullName ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join('');
  });

  readonly statusInfo = computed<{ label: string; tier: string }>(() => {
    const s = this._user()?.status ?? 'active';
    return {
      label: STATUS_LABEL[s],
      tier:  s,
    };
  });

  readonly roleLabel = computed(() => {
    const r = this._user()?.role;
    return r ? ROLE_LABEL[r] : '';
  });

  /** "2 days ago" friendly relative time for lastLoginAt. */
  readonly lastLoginRelative = computed<string>(() => {
    const ts = this._user()?.lastLoginAt;
    if (!ts) return $localize`:@@common.never:Never`;
    const date = ts instanceof Date ? ts : new Date(ts);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
    if (minutes < 1) return $localize`:@@common.justNow:Just now`;
    if (minutes < 60) return $localize`:@@user.profile.minutesAgo:${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)  return hours === 1 ? $localize`:@@user.profile.hourAgo:${hours} hour ago` : $localize`:@@user.profile.hoursAgo:${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? $localize`:@@user.profile.dayAgo:${days} day ago` : $localize`:@@user.profile.daysAgo:${days} days ago`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? $localize`:@@user.profile.weekAgo:${weeks} week ago` : $localize`:@@user.profile.weeksAgo:${weeks} weeks ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12)  return months === 1 ? $localize`:@@user.profile.monthAgo:${months} month ago` : $localize`:@@user.profile.monthsAgo:${months} months ago`;
    const years = Math.floor(months / 12);
    return years === 1 ? $localize`:@@user.profile.yearAgo:${years} year ago` : $localize`:@@user.profile.yearsAgo:${years} years ago`;
  });

  /* ---------------- Tiny UI state --------------------- */
  readonly copiedField = signal<'email' | 'phone' | null>(null);

  async copy(field: 'email' | 'phone', value?: string): Promise<void> {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch { /* ignore */ }
    this.copiedField.set(field);
    setTimeout(() => {
      if (this.copiedField() === field) this.copiedField.set(null);
    }, 1200);
  }

  /* ---------------- Actions --------------------------- */


 

  onClose(): void {
    this.closed.emit();
    this.drawerRef?.close(null);
  }

  /** Avatar fallback to initials if the image fails to load. */
  onAvatarError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img) img.style.display = 'none';
  }
}

/* ============================================================
 *  Display dictionaries
 * ============================================================ */
const ROLE_LABEL: Record<UserRole, string> = {
  admin: $localize`:@@common.administrator:Administrator`,
  manager: $localize`:@@common.manager:Manager`,
  auditor: $localize`:@@common.auditor:Auditor`,
  viewer: $localize`:@@common.viewer:Viewer`,
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: $localize`:@@common.active:Active`,
  pending: $localize`:@@common.pendingInvitation:Pending Invitation`,
  suspended: $localize`:@@common.suspended:Suspended`,
  deleted: $localize`:@@common.deleted:Deleted`,
};
