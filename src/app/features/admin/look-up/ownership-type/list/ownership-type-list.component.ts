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

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmActionDialogComponent } from '@/app/shared/components/confirm-action-dialog/com/confirm-action-dialog.component';
import { OwnershipTypeFormComponent } from '../manage/ownership-type.component';
import { MOCK_OWNERSHIP_TYPES, OwnershipType } from '@/app/features/admin/look-up/ownership-type/models/ownership-type.model';
import { PaginationBarComponent } from '@/app/shared/components/pagination-bar/pagination-bar.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { LookupViewDialogComponent } from '@/app/shared/components/lookup-view-dialog/lookup-view-dialog.component';


@Component({
  selector: 'app-ownership-type-list',
  standalone: true,
  imports: [
    ConfirmActionDialogComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    LookupViewDialogComponent,
    OwnershipTypeFormComponent,
    PaginationBarComponent,
  
    DrawIconComponent,],
  providers: [MessageService],
  templateUrl: './ownership-type-list.component.html',
  styleUrls: ['./ownership-type-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnershipTypeListComponent implements OnInit {

  private readonly messageService = inject(MessageService);

  // ── List state ────────────────────────────────────────────────────────────
  items        = signal<OwnershipType[]>([]);
  searchQuery  = signal('');
  sortField   = signal<string>('name');
  sortDir     = signal<'asc' | 'desc'>('asc');

  // ── Pagination ─────────────────────────────────────────────────────────────
  readonly pageSize    = signal(10);
  readonly currentPage = signal(1);

  /** Options for the "items per page" dropdown in the pagination footer. */
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  readonly viewLabel = $localize`:@@common.view:View`;
  readonly editLabel = $localize`:@@common.edit:Edit`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  statusLabel(isActive: boolean): string {
    return isActive ? $localize`:@@common.active:Active` : $localize`:@@common.inactive:Inactive`;
  }

  private updatedMessage(name: string): string {
    return $localize`:@@admin.ownershipType.updated:"${name}" updated.`;
  }

  private addedMessage(name: string): string {
    return $localize`:@@admin.ownershipType.added:"${name}" added.`;
  }

  private multipleAddedMessage(count: number): string {
    return $localize`:@@admin.ownershipType.multipleAdded:${count} ownership types added.`;
  }

  private activatedMessage(name: string): string {
    return $localize`:@@admin.ownershipType.activated:"${name}" activated.`;
  }

  private deactivatedMessage(name: string): string {
    return $localize`:@@admin.ownershipType.deactivated:"${name}" deactivated.`;
  }

  // ── Add / Edit dialog ─────────────────────────────────────────────────────
  showForm    = signal(false);
  editingItem = signal<OwnershipType | null>(null);

  // ── View dialog ───────────────────────────────────────────────────────────
  showView  = signal(false);
  viewItem  = signal<OwnershipType | null>(null);

  // ── Confirmation dialog ───────────────────────────────────────────────────
  displayConfirmation  = signal(false);
  confirmationAction   = signal<'Activate' | 'Deactivate'>('Deactivate');
  confirmationTarget   = signal<OwnershipType | null>(null);


  readonly filtered = computed(() => {
    let list = [...this.items()];
    const q = this.searchQuery().toLowerCase().trim();

    if (q) {
      list = list.filter(
        i => i.name.toLowerCase().includes(q) ||
             i.code?.toLowerCase().includes(q) ||
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
    this.items.set(MOCK_OWNERSHIP_TYPES);
  }

  // ── Add / Edit ────────────────────────────────────────────────────────────

  openAdd(): void {
    this.editingItem.set(null);
    this.showForm.set(true);
  }

  openEdit(item: OwnershipType, e: MouseEvent): void {
    e.stopPropagation();
    this.editingItem.set(item);
    this.showForm.set(true);
  }

  onFormSave(results: OwnershipType[]): void {
    if (this.editingItem()) {
      const result = results[0];
      this.items.update(list => list.map(i => i.id === result.id ? result : i));
      //this.messageService.add({ severity: 'success', summary: $localize`:@@common.updated:Updated`, detail: this.updatedMessage(result.name) });
    } else {
      this.items.update(list => [...results, ...list]);
      const detail = results.length === 1
        ? this.addedMessage(results[0].name)
        : this.multipleAddedMessage(results.length);
     // this.messageService.add({ severity: 'success', summary: $localize`:@@common.created:Created`, detail });
    }
    this.showForm.set(false);
  }

  onFormClose(): void { this.showForm.set(false); }

  // ── View ──────────────────────────────────────────────────────────────────

  openView(item: OwnershipType, e: MouseEvent): void {
    e.stopPropagation();
    this.viewItem.set(item);
    this.showView.set(true);
  }

  closeView(): void { this.showView.set(false); }

  // ── Activate / Deactivate ─────────────────────────────────────────────────

  promptToggle(item: OwnershipType, e: MouseEvent): void {
    e.stopPropagation();
    this.confirmationTarget.set(item);
    this.confirmationAction.set(item.isActive ? 'Deactivate' : 'Activate');
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void { this.displayConfirmation.set(false); }

  confirmToggleBlocked(): void {
    const target = this.confirmationTarget();
    if (!target) return;
    const updated: OwnershipType = { ...target, isActive: !target.isActive, updatedAt: new Date() };
    this.items.update(list => list.map(i => i.id === updated.id ? updated : i));
    const label = updated.isActive ? $localize`:@@common.activated:Activated` : $localize`:@@common.deactivated:Deactivated`;
    this.messageService.add({ severity: 'success', summary: label, detail: updated.isActive ? this.activatedMessage(updated.name) : this.deactivatedMessage(updated.name) });
    this.displayConfirmation.set(false);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  onSearch(val: string): void                { this.searchQuery.set(val); this.currentPage.set(1); }
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