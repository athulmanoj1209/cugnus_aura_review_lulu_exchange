import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CompanyDataService } from '@/app/shared/components/services/company-data.service';
import { CLIENT_MODE } from '@/app/core/config/client-mode';
import { AUDIT_PLAN_QUERY_PARAMS, AUDIT_PLAN_ROUTES } from '../../constants/audit-plan.constants';


@Component({
  selector: 'app-audit-plan-selector',
  standalone: true,
  imports: [BackButtonComponent, CommonModule, FormsModule, SelectModule, ButtonModule, TooltipModule, DrawIconComponent],
  templateUrl: './audit-plan-selector.component.html',
  styleUrl:    './audit-plan-selector.component.scss',
})
export class AuditPlanSelectorComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly companyDataService = inject(CompanyDataService);
  private readonly clientMode = inject(CLIENT_MODE);

  /**
   * Reactive company list, sourced from CompanyDataService rather than a
   * local hardcoded list. CompanyDataService already seeds itself from
   * company-static-indi-org.data.ts (single company) when CLIENT_MODE is
   * 'internal-audit', or company-static-data.ts (multi-company) otherwise —
   * so in internal-audit mode this screen shows just DAR Exchange as the
   * only chip/dropdown option (still clickable, no auto-redirect).
   */
  readonly companies = this.companyDataService.companies;

  readonly dropdownOptions = computed(() =>
    this.companies().map(c => ({ label: c.companyName, value: c.id })),
  );

  /** Handy in the template if you want to tweak copy/layout for the single-company case. */
  readonly isInternalAudit = computed(() => this.clientMode === 'internal-audit');

  selected = signal<string | null>(null);

  selectCompany(id: string): void {
    this.selected.set(id);
    this.navigate(id);
  }

  onDropdownChange(id: string | null): void {
    if (id) this.navigate(id);
  }

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  goToPlanList(): void {
    this.router.navigate([AUDIT_PLAN_ROUTES.PlanList]);
  }

  private navigate(id: string): void {
    const company = this.companyDataService.getById(id);
    this.router.navigate([AUDIT_PLAN_ROUTES.Plan], {
      queryParams: {
        [AUDIT_PLAN_QUERY_PARAMS.Company]:     id,
        [AUDIT_PLAN_QUERY_PARAMS.CompanyName]: company?.companyName ?? '',
      },
    });
  }
}