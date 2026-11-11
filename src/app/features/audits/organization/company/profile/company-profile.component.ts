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

import { DrawerRef, DRAWER_DATA } from '../../../../../shared/components/right-drawer-host/helper/drawer-ref';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/* ============================================================
 *  Shape of the company profile this component can render.
 *  Designed as a superset of the audit-domain fields collected
 *  by AddCompanyModalComponent so it can be hydrated directly
 *  from CompanyFormModel + a few derived fields.
 * ============================================================ */
export interface CompanyProfileData {
  id: string;

  // ---- Identity --------------------------------------------------
  name: string;
  logoUrl?: string;
  entityType?: string;             // LLC / PJSC / Free Zone Entity
  industry?: string;               // "Financial Services"
  ownershipType?: string;          // "Private", "Public", ...
  blocked?: boolean;

  // ---- Location / contact ---------------------------------------
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;

  // ---- Registration ---------------------------------------------
  tradeLegalRegNumber?: string;
  dateOfIncorporation?: Date | string;
  parentCompany?: string;
  groupAffiliation?: string;
  notes?: string;

  // ---- Regulatory -----------------------------------------------
  isRegulated?: boolean;
  regIndustry?: string;
  regulatoryLicenseNumber?: string;
  licenseExpiryDate?: Date | string;
  regulatoryNotes?: string;

  // ---- Financial & Operational ----------------------------------
  currencyAccount?: string;
  annualTurnoverBracket?: string;
  numberOfEmployees?: number;
  numberOfSubDivisionsLocations?: number;
  fiscalYearStart?: string;
  treasuryFunctionsPresent?: boolean;
  cashHandlingInvolved?: boolean;

  // ---- Risk & Audit ---------------------------------------------
  riskRating?: 'low' | 'medium' | 'high' | 'critical' | string;
  riskOwner?: string;
  lastAuditDate?: Date | string;
  nextPlannedAuditCycle?: string;
  residualRiskScore?: number;      // 0–10
  riskNotes?: string;

  // ---- Primary contact (optional) -------------------------------
  primaryContact?: {
    name: string;
    role?: string;
    phone?: string;
    avatarUrl?: string;
  };
}

/** Close-result emitted when used in drawer mode. */
//export type CompanyProfileAction =
 // | { kind: 'edit'; companyId: string }
  //| { kind: 'toggle-block'; companyId: string; nextBlocked: boolean }
  //| { kind: 'visit-website'; companyId: string; url: string };

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent {

  /** Drawer mode wiring (optional — falls back to @Input). */
  private readonly drawerRef = inject(DrawerRef, { optional: true }) as
    |DrawerRef<CompanyProfileData>
    | null;
  private readonly drawerData = inject(DRAWER_DATA, { optional: true }) as
    | CompanyProfileData
    | null;

  private readonly _company = signal<CompanyProfileData | null>(this.drawerData);

  @Input() set company(value: CompanyProfileData | null | undefined) {
    if (value) this._company.set(value);
  }
  get company(): CompanyProfileData | null { return this._company(); }

  /** Output bindings for embedded-page mode. */
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly edit = new EventEmitter<CompanyProfileData>();
  @Output() readonly toggleBlocked = new EventEmitter<CompanyProfileData>();

  readonly c = computed(() => this._company());

  /** Derived: "X years" since incorporation, or null. */
  readonly yearsInBusiness = computed<number | null>(() => {
    const d = this._company()?.dateOfIncorporation;
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    const diff = Date.now() - date.getTime();
    return Math.max(0, Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
  });

  /** Derived: "in N days / N days ago" for license expiry. */
  readonly licenseExpiryInfo = computed<{
    label: string;
    tone: 'ok' | 'warn' | 'expired';
  } | null>(() => {
    const d = this._company()?.licenseExpiryDate;
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return null;
    const days = Math.floor((date.getTime() - Date.now()) / (24 * 3600 * 1000));
    if (days < 0)  return { label: `Expired ${Math.abs(days)} days ago`, tone: 'expired' };
    if (days < 60) return { label: `Expires in ${days} days`,           tone: 'warn'    };
    return { label: `Expires in ${days} days`, tone: 'ok' };
  });

  /** Capitalised risk rating with a tier class. */
  readonly riskBadge = computed<{ label: string; tier: string } | null>(() => {
    const r = this._company()?.riskRating;
    if (!r) return null;
    const tier = r.toLowerCase();
    return {
      label: tier.charAt(0).toUpperCase() + tier.slice(1),
      tier,
    };
  });

  /** Two-letter initials fallback when no logo URL is supplied. */
  readonly initials = computed(() => {
    const name = this._company()?.name ?? '';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join('');
  });

  /* ---------------- Tiny UI state --------------------- */
  readonly copiedField = signal<'email' | 'phone' | 'website' | 'reg' | null>(null);

  async copy(field: 'email' | 'phone' | 'website' | 'reg', value?: string): Promise<void> {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch { /* ignore */ }
    this.copiedField.set(field);
    setTimeout(() => {
      if (this.copiedField() === field) this.copiedField.set(null);
    }, 1200);
  }

  
 

  onClose(): void {
    this.closed.emit();
    this.drawerRef?.close(null);
  }

  /* ---------------- Helpers --------------------------- */

  /** Build a safe-to-display URL — prepends https:// if scheme missing. */
  normalizeUrl(url?: string): string {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  onLogoError(ev: Event): void {
    const img = ev.target as HTMLImageElement;
    if (img) img.style.display = 'none';
  }
}