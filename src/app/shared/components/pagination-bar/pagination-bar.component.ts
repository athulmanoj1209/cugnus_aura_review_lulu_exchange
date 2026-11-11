import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-pagination-bar',
  imports: [CommonModule, PaginatorModule],
  templateUrl: './pagination-bar.component.html',
  styleUrl: './pagination-bar.component.scss',
})
export class PaginationBarComponent {
  @Input() pageSize = 10;
  @Input() totalRecords = 0;
  /** Zero-based current page index. */
  @Input() currentPage = 0;
  /** Noun shown in "Showing X to Y of Z <entityLabel>". Default: 'entries'. */
  @Input() entityLabel = 'entries';
  @Input() rowsPerPageOptions: number[] = [6, 10, 15, 20];
  /** Show the "Showing X to Y of Z entries" label. Default true - set false if the page already shows its own count elsewhere. */
  @Input() showLabel = true;

  /** Emits the new zero-based page index. */
  @Output() pageChange = new EventEmitter<number>();
  /** Emits the newly selected rows-per-page value when the user changes it. */
  @Output() rowsChange = new EventEmitter<number>();

  get startRecord(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalRecords);
  }

  /**
   * PrimeNG's paginator only shows a selected value in the rows-per-page dropdown when
   * `pageSize` is one of these options - if a page's initial pageSize isn't in its own
   * rowsPerPageOptions list (e.g. pageSize=6 with the default [5,10,15,20]), the dropdown
   * renders blank. Fold the current pageSize in so it's always selectable.
   */
  get effectiveRowsPerPageOptions(): number[] {
    // An empty array intentionally hides the dropdown (e.g. rfi-management) - leave it alone.
    if (this.rowsPerPageOptions.length === 0) return this.rowsPerPageOptions;
    if (this.rowsPerPageOptions.includes(this.pageSize)) return this.rowsPerPageOptions;
    return [...this.rowsPerPageOptions, this.pageSize].sort((a, b) => a - b);
  }

  onPageChange(event: PaginatorState): void {
    const rows = event.rows ?? this.pageSize;
    if (rows !== this.pageSize) {
      this.rowsChange.emit(rows);
    }
    this.pageChange.emit(event.page ?? 0);
  }
}
