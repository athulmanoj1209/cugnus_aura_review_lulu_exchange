import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

export interface ScopeAssignment {
  name: string;
  type: 'scope' | 'subscope';
  parentScope?: string;
  startDate: string;
  endDate: string;
}

export interface EngagerPerson {
  id: string;
  displayName: string;
  role: string;
  experienceYears: number;
  expertise: string[];
  workload: number;
  completedCount: number;
  totalCount: number;
  scopeItems?: ScopeAssignment[];
}

export type EngagerVariant = 'auditor' | 'reviewer';

@Component({
  selector: 'app-preparer-reviewer',
  standalone: true,
  imports: [
    CommonModule,
    TagModule,
    ProgressBarModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  
    DrawIconComponent,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preparer-reviewer.component.html',
  styleUrls: ['./preparer-reviewer.component.scss'],
})
export class PreparerReviewerComponent {
  private readonly _variant           = signal<EngagerVariant>('auditor');
  private readonly _title             = signal('');
  private readonly _subtitle          = signal('');
  private readonly _persons           = signal<EngagerPerson[]>([]);
  private readonly _showScopeExpansion = signal(false);
  private readonly _scopeHint         = signal('');

  @Input() set variant(v: EngagerVariant)           { this._variant.set(v); }
  @Input() set title(v: string)                      { this._title.set(v); }
  @Input() set subtitle(v: string)                   { this._subtitle.set(v); }
  @Input() set persons(v: EngagerPerson[])           { this._persons.set(v ?? []); }
  @Input() set showScopeExpansion(v: boolean)        { this._showScopeExpansion.set(v); }
  @Input() set scopeHint(v: string)                  { this._scopeHint.set(v); }

  readonly isReviewer           = computed(() => this._variant() === 'reviewer');
  readonly title$               = computed(() => this._title());
  readonly subtitle$            = computed(() => this._subtitle());
  readonly persons$             = computed(() => this._persons());
  readonly showScopeExpansion$  = computed(() => this._showScopeExpansion());
  readonly resolvedScopeHint    = computed(() =>
    this._scopeHint() || (this.isReviewer()
      ? 'Scopes & Sub-scopes under review'
      : 'Scopes & Sub-scopes assigned')
  );

  // ─── Block open/close ─────────────────────────────────────
  private readonly _blockOpen = signal(false);
  readonly blockOpen = computed(() => this._blockOpen());
  toggleBlock(): void { this._blockOpen.update(v => !v); }

  // ─── Card expand / collapse ────────────────────────────────
  private readonly _expandedCards = signal<Set<string>>(new Set());

  toggleCard(id: string): void {
    const s = new Set(this._expandedCards());
    s.has(id) ? s.delete(id) : s.add(id);
    this._expandedCards.set(s);
  }
  isCardExpanded(id: string): boolean { return this._expandedCards().has(id); }

  onCardHeadClick(id: string): void {
    if (this._showScopeExpansion()) this.toggleCard(id);
  }

  // ─── Per-card scope search & pagination ───────────────────
  readonly PAGE_SIZE = 4;
  private readonly _cardSearches = signal<Map<string, string>>(new Map());
  private readonly _cardFirsts   = signal<Map<string, number>>(new Map());

  getCardSearch(id: string): string { return this._cardSearches().get(id) ?? ''; }
  setCardSearch(id: string, query: string): void {
    const sm = new Map(this._cardSearches()); sm.set(id, query); this._cardSearches.set(sm);
    const fm = new Map(this._cardFirsts());   fm.set(id, 0);     this._cardFirsts.set(fm);
  }
  getCardFirst(id: string): number { return this._cardFirsts().get(id) ?? 0; }
  onCardPageChange(id: string, event: { first?: number }): void {
    const m = new Map(this._cardFirsts()); m.set(id, event.first ?? 0); this._cardFirsts.set(m);
  }

  filteredCardItems(person: EngagerPerson): ScopeAssignment[] {
    const q = this.getCardSearch(person.id).toLowerCase().trim();
    const items = person.scopeItems ?? [];
    return q
      ? items.filter(i =>
          i.name.toLowerCase().includes(q) || (i.parentScope?.toLowerCase().includes(q) ?? false)
        )
      : items;
  }
  pagedCardItems(person: EngagerPerson): ScopeAssignment[] {
    const first = this.getCardFirst(person.id);
    return this.filteredCardItems(person).slice(first, first + this.PAGE_SIZE);
  }

  // ─── List search & pagination ─────────────────────────────
  readonly PERSON_PAGE_SIZE = 3;
  private readonly _listSearch = signal('');
  private readonly _listFirst  = signal(0);

  readonly filteredPersonsList = computed<EngagerPerson[]>(() => {
    const q = this._listSearch().toLowerCase().trim();
    const list = this._persons();
    return q
      ? list.filter(p =>
          p.displayName.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
        )
      : list;
  });

  readonly pagedPersonsList = computed<EngagerPerson[]>(() =>
    this.filteredPersonsList().slice(this._listFirst(), this._listFirst() + this.PERSON_PAGE_SIZE)
  );

  getListSearch(): string { return this._listSearch(); }
  setListSearch(q: string): void { this._listSearch.set(q); this._listFirst.set(0); }
  getListFirst(): number { return this._listFirst(); }
  onListPageChange(event: { first?: number }): void { this._listFirst.set(event.first ?? 0); }

  workloadClass(val: number): string {
    return val <= 40 ? 'low' : val <= 70 ? 'medium' : 'high';
  }
}
