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
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  MemberCopyFields,
  MemberWorkloadTiers,
  type MemberCopyField,
  type MemberWorkloadTier,
  MEMBER_COPY_FEEDBACK_MS,
  MEMBER_WORKLOAD_THRESHOLDS,
} from '../constants/audit-team-member.constants';

/* ============================================================
 *  Shape of the profile data this component can render.
 *  Designed as a superset so you can map AuditMember / Member /
 *  raw API responses into it without losing information.
 * ============================================================ */

export interface MemberProfileData {
  id: string;
  name: string;
  title: string;                      // e.g. "Audit Manager", "CAE"
  avatarUrl?: string;

  /** Optional sub-line under the name. */
  subDivision?: string;
  region?: string;

  yearsOfExperience?: number;
  expertise?: string[];               // ['AML', 'Finance', ...]

  email?: string;
  phone?: string;
  teamsZoomId?: string;

  assignedSubDivisions?: string[];

  hourlyCostRate?: number;
  assignedHours?: number;
  totalCapacityHours?: number;
  workloadPct?: number;               // 0–100; derived if missing

  /** Optional reporting context for an org-chart drilldown. */
  reportsTo?: { id: string; name: string; title: string; avatarUrl?: string };
  directReports?: Array<{ id: string; name: string; title: string; avatarUrl?: string }>;

  blocked?: boolean;
  joinedAt?: Date;
}

/** Optional close-result type emitted via the drawer. */
export type MemberProfileAction =
  | { kind: 'edit'; memberId: string }
  | { kind: 'toggle-block'; memberId: string; nextBlocked: boolean }
  | { kind: 'message'; memberId: string };

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent {

  /**
   * The two consumption modes:
   * 1) **Drawer mode** — injected via DrawerRef + DRAWER_DATA
   *    (use `RightDrawerService.open(MemberProfileComponent, { data })`).
   * 2) **Embed/page mode** — pass [member] as an @Input.
   */
  private readonly drawerRef = inject(DrawerRef, { optional: true }) as
    | DrawerRef<MemberProfileAction | null, MemberProfileData>
    | null;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as
    | MemberProfileData
    | null;

  /** Internal state — either fed from @Input or from DRAWER_DATA. */
  private readonly _member = signal<MemberProfileData | null>(this.drawerData);

  @Input() set member(value: MemberProfileData | null | undefined) {
    if (value) this._member.set(value);
  }
  get member(): MemberProfileData | null {
    return this._member();
  }

  /** Emit when used as an embedded page component. */
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly edit = new EventEmitter<MemberProfileData>();
  @Output() readonly toggleBlocked = new EventEmitter<MemberProfileData>();
  @Output() readonly message = new EventEmitter<MemberProfileData>();

  /* ---------------- Derived view-model ---------------- */
  readonly m = computed(() => this._member());

  readonly activeLabel = $localize`:@@common.active:Active`;
  readonly blockedLabel = $localize`:@@audit.auditTeam.blocked:Blocked`;

  hourlyRateLabel(rate: number): string {
    return $localize`:@@audit.auditTeam.hourlyRateValue:$${rate}:rate:/hr`;
  }

  hoursLabel(hours: number): string {
    return $localize`:@@audit.auditTeam.hoursValue:${hours}:hours: hrs`;
  }

  experienceYearsLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYearShort:${years}:years: yr`
      : $localize`:@@audit.auditTeam.yearsShort:${years}:years: yrs`;
  }

  hourlyCostLabel(rate: number): string {
    return $localize`:@@audit.auditTeam.hourlyCostValue:$${rate}:rate: / hour`;
  }

  readonly workload = computed(() => {
    const data = this._member();
    if (!data) return 0;
    if (typeof data.workloadPct === 'number') return clamp(data.workloadPct, 0, 100);
    if (data.totalCapacityHours && data.assignedHours != null) {
      return clamp(Math.round((data.assignedHours / data.totalCapacityHours) * 100), 0, 100);
    }
    return 0;
  });

  readonly workloadTier = computed<MemberWorkloadTier>(() => {
    const p = this.workload();
    if (p >= MEMBER_WORKLOAD_THRESHOLDS.High) return MemberWorkloadTiers.High;
    if (p >= MEMBER_WORKLOAD_THRESHOLDS.Mid) return MemberWorkloadTiers.Mid;
    return MemberWorkloadTiers.Low;
  });

  readonly initials = computed(() => {
    const name = this._member()?.name ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join('');
  });

  /* ---------------- Tiny UI state --------------------- */
  readonly copiedField = signal<MemberCopyField | null>(null);

  // Exposed for the template.
  readonly MemberCopyFields = MemberCopyFields;

  async copy(field: MemberCopyField, value?: string): Promise<void> {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API can fail in non-secure contexts — silently ignore
    }
    this.copiedField.set(field);
    setTimeout(() => {
      if (this.copiedField() === field) this.copiedField.set(null);
    }, MEMBER_COPY_FEEDBACK_MS);
  }

  /* ---------------- Actions --------------------------- */

  

 
 

  onClose(): void {
    this.closed.emit();
    this.drawerRef?.close(null);
  }

  /* ---------------- Avatar fallback ------------------- */
  onAvatarError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img) img.style.display = 'none';
  }

  trackById = (_: number, x: { id: string }) => x.id;
}

/* ---------------- Helpers ---------------- */

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}