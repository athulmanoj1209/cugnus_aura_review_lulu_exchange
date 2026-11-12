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
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import { AUDIT_PLAN_DRAWER_WIDTH, AUDIT_PLAN_QUERY_PARAMS, AUDIT_PLAN_ROUTES } from '../../constants/audit-plan.constants';
import { AuditPlanFormComponent } from '../../manage/audit-plan.component';
import { AuditPlanHeader } from '../../models/audit-plan.model';
import { AuditPlanListStore } from '../../services/audit-plan-list.store';


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
  private readonly drawer = inject(RightDrawerService);
  private readonly planStore = inject(AuditPlanListStore);

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

  /**
   * Open the Add Audit Plan drawer right here (same form as the list page).
   * On save the plan is added to the shared list store and the user lands on
   * the new plan's dashboard, so a first-time user never has to detour
   * through the list page.
   */
  openCreate(): void {
    const ref = this.drawer.open(AuditPlanFormComponent, { data: null, width: AUDIT_PLAN_DRAWER_WIDTH });
    ref.afterClosed.then((raw: unknown) => {
      const result = raw as AuditPlanHeader | null | undefined;
      if (!result) return;

      const plan = this.planStore.createFromHeader(result);
      // The dashboard matches plans by company name; resolve the selector's
      // company id by that name (the form's roster can use different ids).
      const company = this.companies().find(c => c.companyName === plan.organizationName);
      this.navigate(company?.id ?? result.companyId, plan.organizationName, plan.id);
    });
  }

  private navigate(id: string, companyName?: string, planId?: string): void {
    const company = this.companyDataService.getById(id);
    this.router.navigate([AUDIT_PLAN_ROUTES.Plan], {
      queryParams: {
        [AUDIT_PLAN_QUERY_PARAMS.Company]:     id,
        [AUDIT_PLAN_QUERY_PARAMS.CompanyName]: companyName ?? company?.companyName ?? '',
        ...(planId ? { [AUDIT_PLAN_QUERY_PARAMS.Plan]: planId } : {}),
      },
    });
  }
}