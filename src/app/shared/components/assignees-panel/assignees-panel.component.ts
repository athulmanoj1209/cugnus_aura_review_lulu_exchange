import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

import {
  PreparerReviewerComponent,
  EngagerPerson,
  ScopeAssignment,
} from '../preparer-reviewer/preparer-reviewer.component';

export type { ScopeAssignment };

export interface AssigneesPanelAuditor {
  id: string;
  displayName: string;
  role: string;
  experienceYears: number;
  expertise: string[];
  workload: number;
  completedAudits?: number;
  totalAudits?: number;
  assignedItems?: ScopeAssignment[];
}

export interface AssigneesPanelReviewer {
  id: string;
  displayName: string;
  role: string;
  experienceYears: number;
  expertise: string[];
  workload: number;
  completedReviews: number;
  totalReviews: number;
  reviewItems?: ScopeAssignment[];
}

@Component({
  selector: 'app-assignees-panel',
  standalone: true,
  imports: [CommonModule, DividerModule, PreparerReviewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignees-panel.component.html',
  styleUrls: ['./assignees-panel.component.scss'],
})
export class AssigneesPanelComponent {
  private readonly _auditors           = signal<AssigneesPanelAuditor[]>([]);
  private readonly _reviewers          = signal<AssigneesPanelReviewer[]>([]);
  private readonly _showScopeExpansion = signal(false);
  private readonly _auditorSubtitle    = signal('Auditors responsible for scopes in this department');
  private readonly _reviewerSubtitle   = signal('Assigned reviewers for scopes in this department');

  @Input() set auditors(v: AssigneesPanelAuditor[])   { this._auditors.set(v ?? []); }
  @Input() set reviewers(v: AssigneesPanelReviewer[]) { this._reviewers.set(v ?? []); }
  @Input() set showScopeExpansion(v: boolean)         { this._showScopeExpansion.set(v); }
  @Input() set auditorSubtitle(v: string)             { this._auditorSubtitle.set(v); }
  @Input() set reviewerSubtitle(v: string)            { this._reviewerSubtitle.set(v); }

  readonly auditors$           = computed(() => this._auditors());
  readonly reviewers$          = computed(() => this._reviewers());
  readonly showScopeExpansion$ = computed(() => this._showScopeExpansion());
  readonly auditorSubtitle$    = computed(() => this._auditorSubtitle());
  readonly reviewerSubtitle$   = computed(() => this._reviewerSubtitle());

  readonly auditorPersons = computed<EngagerPerson[]>(() =>
    this._auditors().map(a => ({
      id: a.id,
      displayName: a.displayName,
      role: a.role,
      experienceYears: a.experienceYears,
      expertise: a.expertise,
      workload: a.workload,
      completedCount: a.completedAudits ?? 0,
      totalCount: a.totalAudits ?? 0,
      scopeItems: a.assignedItems,
    }))
  );

  readonly reviewerPersons = computed<EngagerPerson[]>(() =>
    this._reviewers().map(r => ({
      id: r.id,
      displayName: r.displayName,
      role: r.role,
      experienceYears: r.experienceYears,
      expertise: r.expertise,
      workload: r.workload,
      completedCount: r.completedReviews,
      totalCount: r.totalReviews,
      scopeItems: r.reviewItems,
    }))
  );
}
