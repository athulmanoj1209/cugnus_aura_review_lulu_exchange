import { Component, Input, Output, EventEmitter, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-modal',
  imports: [CommonModule, FormsModule, MultiSelectModule, DrawIconComponent],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss',
})
export class FilterModalComponent {
  private readonly elRef = inject(ElementRef);

  // ── Options ──────────────────────────────────────────────────────────────
  @Input() typeOptions: FilterOption[] = [];
  @Input() yearOptions: FilterOption[] = [];
  @Input() riskOptions: FilterOption[] = [];
  @Input() statusOptions: FilterOption[] = [];
  @Input() companyOptions: FilterOption[] = [];
  @Input() divisionOptions: FilterOption[] = [];
  @Input() subDivisionOptions: FilterOption[] = [];
  @Input() submittedByOptions: FilterOption[] = [];
  @Input() createdByOptions: FilterOption[] = [];
  @Input() scopeOptions: FilterOption[] = [];
  @Input() subScopeOptions: FilterOption[] = [];
  @Input() periodZoneOptions: FilterOption[] = [];

  // ── Selected values ───────────────────────────────────────────────────────
  @Input() selectedTypes: string[] = [];
  @Input() selectedYears: string[] = [];
  @Input() selectedRisks: string[] = [];
  @Input() selectedStatuses: string[] = [];
  @Input() selectedCompanies: string[] = [];
  @Input() selectedDivisions: string[] = [];
  @Input() selectedSubDivisions: string[] = [];
  @Input() selectedSubmittedBys: string[] = [];
  @Input() selectedCreatedBys: string[] = [];
  @Input() selectedScopes: string[] = [];
  @Input() selectedSubScopes: string[] = [];
  @Input() selectedPeriodZones: string[] = [];

  // ── Labels & visibility flags ─────────────────────────────────────────────
  /** Label for the first (type) field. Default: 'TYPE'. Override e.g. 'CATEGORY'. */
  @Input() typeLabel = 'TYPE';
  /** Label for the Year field. Default: 'YEAR'. */
  @Input() yearLabel = 'YEAR';
  /** Label for the Submitted By field. Default: 'SUBMITTED BY'. Override e.g. 'CREATED BY'. */
  @Input() submittedByLabel = 'SUBMITTED BY';
  /** Show the Risk field. Default true. */
  @Input() showRisk = true;
  /** Show the Year field. Default false. */
  @Input() showYear = false;
  /** Show the type field. Default true. */
  @Input() showType = true;
  /** Show the Sub-Division field. Default true (existing screens keep it). */
  @Input() showSubDivision = true;
  /** When set, the Sub-Division field is disabled and this text is shown under it
   *  (e.g. the selected division has no sub-divisions). Default null. */
  @Input() subDivisionDisabledMessage: string | null = null;
  /** Disable the Sub-Division field (e.g. the selected Division has no sub-divisions). Default false. */
  @Input() disableSubDivision = false;
  /** Show the Submitted By field. Default false. */
  @Input() showSubmittedBy = false;
  /** Show the Created By field (own row). Default false. */
  @Input() showCreatedBy = false;
  @Input() showScope = false;
  @Input() showSubScope = false;
  /** Show the Period Zone field (e.g. specific month/quarter/half within a report period). Default false. */
  @Input() showPeriodZone = false;
  /** Label for the Period Zone field. Default: 'PERIOD'. */
  @Input() periodZoneLabel = 'PERIOD';
  /** Show the Status field. Default true (existing screens keep it, subject to the risk+submittedBy crowding rule below). */
  @Input() showStatus = true;

  /**
 * Visual order of the main-grid fields, by key: 'type' | 'year' | 'periodZone' | 'risk' |
 * 'status' | 'submittedBy' | 'company' | 'division' | 'sub-division'. Keys not listed keep their
 * default source-order position. Leave empty (default) to keep the original field order - this
 * only reorders the screen that sets it (via CSS grid `order`), other screens are unaffected.
 */
  @Input() fieldOrder: string[] = [];


  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() typesChange = new EventEmitter<string[]>();
  @Output() yearsChange = new EventEmitter<string[]>();
  @Output() risksChange = new EventEmitter<string[]>();
  @Output() statusesChange = new EventEmitter<string[]>();
  @Output() companiesChange = new EventEmitter<string[]>();
  @Output() divisionsChange = new EventEmitter<string[]>();
  @Output() subDivisionsChange = new EventEmitter<string[]>();
  @Output() submittedBysChange = new EventEmitter<string[]>();
  @Output() createdBysChange = new EventEmitter<string[]>();
  @Output() scopesChange = new EventEmitter<string[]>();
  @Output() subScopesChange = new EventEmitter<string[]>();
  @Output() filtersCleared = new EventEmitter<void>();
  @Output() periodZonesChange = new EventEmitter<string[]>();

  showFilters = signal(false);

  /**
   * Status is shown unless BOTH Risk and Submitted By are shown (preserves the
   * original layout, where those two configs crowded Status out of the grid).
   */
  get statusVisible(): boolean {
    return !(this.showRisk && this.showSubmittedBy);
  }

  get activeFilterCount(): number {
    const arrays: string[][] = [
      this.selectedTypes, this.selectedCompanies, this.selectedDivisions,
    ];
    if (this.showSubDivision && !this.disableSubDivision) arrays.push(this.selectedSubDivisions);
    if (this.showYear) arrays.push(this.selectedYears);
    if (this.showRisk) arrays.push(this.selectedRisks);
    if (this.statusVisible) arrays.push(this.selectedStatuses);
    if (this.showSubmittedBy) arrays.push(this.selectedSubmittedBys);
    if (this.showCreatedBy) arrays.push(this.selectedCreatedBys);
    if (this.showScope) arrays.push(this.selectedScopes);
    if (this.showSubScope) arrays.push(this.selectedSubScopes);
    return arrays.filter(a => a.length > 0).length;
  }

  toggleFilters(): void { this.showFilters.update(v => !v); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.showFilters() && !this.elRef.nativeElement.contains(e.target)) {
      this.showFilters.set(false);
    }
  }
}