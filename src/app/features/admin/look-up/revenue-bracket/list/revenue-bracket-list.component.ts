import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { RevenueBracket, MOCK_REVENUE_BRACKETS } from '@/app/features/admin/look-up/revenue-bracket/models/revenue-bracket.model';
import { RevenueBracketFormComponent } from '../manage/revenue-bracket.component';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';

@Component({
  selector: 'app-revenue-bracket-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule, LookupViewDialogComponent,
    ToastModule,
    RevenueBracketFormComponent,
    PaginationBarComponent,
  
    DrawIconComponent,],
  providers: [ConfirmationService, MessageService],
  templateUrl: './revenue-bracket-list.component.html',
  styleUrls: ['./revenue-bracket-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueBracketListComponent implements OnInit {

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService      = inject(MessageService);

  items        = signal<RevenueBracket[]>([]);
  searchQuery  = signal('');
  sortField    = signal<string>('name');
  sortDir      = signal<'asc' | 'desc'>('asc');

  // ── Pagination ─────────────────────────────────────────────────────────────
  readonly pageSize    = signal(10);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];
  readonly yesDeactivateLabel = $localize`:@@common.yesDeactivate:Yes, Deactivate`;
  readonly yesActivateLabel = $localize`:@@common.yesActivate:Yes, Activate`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;
  readonly activatedLabel = $localize`:@@common.activated:Activated`;
  readonly deactivatedLabel = $localize`:@@common.deactivated:Deactivated`;
  readonly deletedLabel = $localize`:@@common.deleted:Deleted`;
  readonly deleteLabel = $localize`:@@common.delete:Delete`;
  readonly cancelLabel = $localize`:@@common.cancel:Cancel`;

  showDialog  = signal(false);
  editingItem = signal<RevenueBracket | null>(null);

  showView  = signal(false);
  viewItem  = signal<RevenueBracket | null>(null);

  displayConfirmation = signal(false);
  confirmationAction  = signal<'Activate' | 'Deactivate'>('Deactivate');
  confirmationTarget  = signal<RevenueBracket | null>(null);

  confirmationMessage(): string {
    const name = this.confirmationTarget()?.name ?? '';

    return this.confirmationAction() === 'Deactivate'
      ? $localize`:@@admin.revenueBracket.deactivateConfirmation:Are you sure you want to deactivate "${name}"?`
      : $localize`:@@admin.revenueBracket.activateConfirmation:Are you sure you want to activate "${name}"?`;
  }

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  private activatedMessage(name: string): string {
    return $localize`:@@admin.revenueBracket.activatedMessage:"${name}" activated.`;
  }

  private deactivatedMessage(name: string): string {
    return $localize`:@@admin.revenueBracket.deactivatedMessage:"${name}" deactivated.`;
  }

  private deleteConfirmationMessage(name: string): string {
    return $localize`:@@admin.revenueBracket.deleteConfirmation:Delete "${name}"? This cannot be undone.`;
  }

  private removedMessage(name: string): string {
    return $localize`:@@admin.revenueBracket.removed:"${name}" removed.`;
  }

  readonly filtered = computed(() => {
    let list = [...this.items()];
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(
        i => i.name.toLowerCase().includes(q) ||
             i.description?.toLowerCase().includes(q)
      );
    }
    const field = this.sortField();
    const dir   = this.sortDir() === 'asc' ? 1 : -1;
    list.sort((a: any, b: any) => {
      if (field === 'createdAt') return dir * (+new Date(a.createdAt) - +new Date(b.createdAt));
      return dir * String(a.name).localeCompare(String(b.name));
    });
    return list;
  });

  /** The current page slice. */
  readonly paginated = computed(() => {
    const all  = this.filtered();
    const size = this.pageSize();
    const max  = Math.max(1, Math.ceil(all.length / size));
    const page = Math.min(this.currentPage(), max);
    return all.slice((page - 1) * size, page * size);
  });

  ngOnInit(): void {
    this.items.set(MOCK_REVENUE_BRACKETS);
  }

  // ── Add / Edit ────────────────────────────────────────────────────────────

  openAdd(): void {
    this.editingItem.set(null);
    this.showDialog.set(true);
  }

  openEdit(item: RevenueBracket, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    this.editingItem.set(item);
    this.showDialog.set(true);
  }

  onFormSave(results: RevenueBracket[]): void {
    if (this.editingItem()) {
      const result = results[0];
      this.items.update(list => list.map(i => i.id === result.id ? result : i));
      //this.messageService.add({ severity: 'success', summary: 'Updated', detail: `"${result.name}" updated.` });
    } else {
      this.items.update(list => [...results, ...list]);
      const detail = results.length === 1
        ? `"${results[0].name}" added.`
        : `${results.length} revenue brackets added.`;
   //   this.messageService.add({ severity: 'success', summary: 'Created', detail });
    }
    this.showDialog.set(false);
  }

  onFormClose(): void { this.showDialog.set(false); }

  // ── View ──────────────────────────────────────────────────────────────────

  openView(item: RevenueBracket, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    this.viewItem.set(item);
    this.showView.set(true);
  }

  closeView(): void { this.showView.set(false); }

  // ── Activate / Deactivate ─────────────────────────────────────────────────

  promptToggle(item: RevenueBracket, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    this.confirmationTarget.set(item);
    this.confirmationAction.set(item.isActive ? 'Deactivate' : 'Activate');
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void { this.displayConfirmation.set(false); }

  confirmToggleBlocked(): void {
    const target = this.confirmationTarget();
    if (!target) return;
    const updated: RevenueBracket = { ...target, isActive: !target.isActive, updatedAt: new Date() };
    this.items.update(list => list.map(i => i.id === updated.id ? updated : i));
    const summary = updated.isActive ? this.activatedLabel : this.deactivatedLabel;
    const detail = updated.isActive ? this.activatedMessage(updated.name) : this.deactivatedMessage(updated.name);
    this.messageService.add({ severity: 'success', summary, detail });
    this.displayConfirmation.set(false);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  confirmDelete(item: RevenueBracket, domEvent: MouseEvent): void {
    domEvent.stopPropagation();
    this.confirmationService.confirm({
      target:                  domEvent.target as EventTarget,
      message: this.deleteConfirmationMessage(item.name),
      icon:                    'pi pi-exclamation-triangle',
      acceptButtonStyleClass:  'p-button-danger p-button-sm',
      rejectButtonStyleClass:  'p-button-text p-button-sm',
      acceptLabel: this.deleteLabel,
      rejectLabel: this.cancelLabel,
      accept: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        this.messageService.add({ severity: 'info', summary: this.deletedLabel, detail: this.removedMessage(item.name) });
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  onSearch(val: string): void { this.searchQuery.set(val); this.currentPage.set(1); }

  toggleSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  /** <app-pagination-bar> emits a zero-based page index. */
  onPageChange(page: number): void {
    this.currentPage.set(page + 1);
  }

  /** Called when the "items per page" dropdown changes. Resets to page 1
   *  so the visible slice stays consistent with the new page size. */
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }
}