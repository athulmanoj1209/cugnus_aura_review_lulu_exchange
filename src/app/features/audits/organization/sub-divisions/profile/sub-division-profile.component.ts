import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TreeModule, TreeNodeExpandEvent, TreeNodeCollapseEvent } from 'primeng/tree';
import { PaginatorModule } from 'primeng/paginator';
import { TreeNode } from 'primeng/api';

import {
  AUDITOR_PROFILES,
  REVIEWER_PROFILES,
} from '@/app/features/audits/organization/divisions/list/division-list.component';
import type { ProfileSubDivision, AuditorInfo, ReviewerInfo, FlatScopeItem, SubDivisionProfileDrawerData } from '@/app/features/audits/organization/sub-divisions/models/sub-division.model';
import { DIVISION_TYPE_OPTIONS } from '@/app/features/audits/organization/divisions/division-static-data';
import { DrawerRef, DRAWER_DATA } from '@/app/shared/components/right-drawer-host/helper/drawer-ref';
import { AssigneesPanelComponent } from '@/app/shared/components/assignees-panel/assignees-panel.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  SubDivisionRiskRatings,
  SubDivisionScopeNodeTypes,
  SubDivisionStatuses,
  SUB_DIVISION_PROFILE_DRAWER_CLASS,
  SUB_DIVISION_PROFILE_RESIZE,
  SUB_DIVISION_SCOPE_PAGE_SIZE,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division.constants';
import {
  SUB_DIVISION_AUDIT_FREQUENCY_LABELS,
  SUB_DIVISION_AUDIT_FREQUENCY_SEVERITY,
  SUB_DIVISION_AUDIT_STATUS_LABELS,
  SUB_DIVISION_AUDIT_STATUS_SEVERITY,
  SUB_DIVISION_DEPARTMENT_TYPE_LABELS,
  SUB_DIVISION_RISK_RATING_LABELS,
  SUB_DIVISION_RISK_STATUS_LABELS,
  SUB_DIVISION_SCOPE_TYPE_LABELS,
  SUB_DIVISION_STATUS_LABELS,
} from '@/app/features/audits/organization/sub-divisions/constants/sub-division-labels.constants';

@Component({
  selector: 'app-sub-division-profile',
  standalone: true,
  imports: [CommonModule, TagModule, TooltipModule, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TreeModule, PaginatorModule, AssigneesPanelComponent, DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sub-division-profile.component.html',
  styleUrls: ['./sub-division-profile.component.scss'],
})
export class SubDivisionProfileComponent {
  private readonly drawerRef = inject(DrawerRef);
  protected readonly data = inject(DRAWER_DATA, { optional: true }) as SubDivisionProfileDrawerData | null;

  // Exposed for the template.
  readonly SubDivisionStatuses = SubDivisionStatuses;
  readonly SubDivisionScopeNodeTypes = SubDivisionScopeNodeTypes;
  readonly subDivisionStatusLabels = SUB_DIVISION_STATUS_LABELS;

  private readonly _subDivision = signal<ProfileSubDivision | null>(this.data?.subDivision ?? null);
  private readonly _divisionName = signal(this.data?.divisionName ?? '');

  readonly d = computed(() => this._subDivision());
  readonly divisionName$ = computed(() => this._divisionName());

  // ─── Computed signals ────────────────────────────────────────────
  readonly yearsOperational = computed<number | null>(() => {
    const s = this._subDivision()?.operationalSince;
    if (!s) return null;
    const date = new Date(s);
    if (isNaN(date.getTime())) return null;
    return Math.max(0, Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000)));
  });

  readonly scopeCount = computed(() => this._subDivision()?.scopes?.length ?? 0);

  readonly assignedAuditors = computed<AuditorInfo[]>(() => {
    const subDivision = this._subDivision();
    if (!subDivision?.scopes?.length) return [];
    const map = new Map<string, AuditorInfo>();

    for (const scope of subDivision.scopes) {
      for (const id of scope.assignedAuditors ?? []) {
        const profile = AUDITOR_PROFILES[id];
        if (!profile) continue;
        if (!map.has(id)) map.set(id, { ...profile, assignedItems: [] });
        map.get(id)!.assignedItems.push({
          name: scope.scopeName, type: SubDivisionScopeNodeTypes.Scope,
          startDate: scope.startDate, endDate: scope.endDate,
        });
      }
      for (const ss of scope.subScopes ?? []) {
        for (const id of ss.assignedAuditors ?? []) {
          const profile = AUDITOR_PROFILES[id];
          if (!profile) continue;
          if (!map.has(id)) map.set(id, { ...profile, assignedItems: [] });
          map.get(id)!.assignedItems.push({
            name: ss.subScopeName, type: SubDivisionScopeNodeTypes.SubScope,
            parentScope: scope.scopeName,
            startDate: ss.startDate, endDate: ss.endDate,
          });
        }
      }
    }
    return Array.from(map.values());
  });

  readonly assignedReviewers = computed<ReviewerInfo[]>(() => {
    const subDivision = this._subDivision();
    if (!subDivision?.scopes?.length) return [];
    const map = new Map<string, ReviewerInfo>();

    for (const scope of subDivision.scopes) {
      for (const id of scope.assignedReviewers ?? []) {
        const profile = REVIEWER_PROFILES[id];
        if (!profile) continue;
        if (!map.has(id)) map.set(id, { ...profile, reviewItems: [] });
        map.get(id)!.reviewItems.push({
          name: scope.scopeName, type: SubDivisionScopeNodeTypes.Scope,
          startDate: scope.startDate, endDate: scope.endDate,
        });
      }
      for (const ss of scope.subScopes ?? []) {
        for (const id of ss.assignedReviewers ?? []) {
          const profile = REVIEWER_PROFILES[id];
          if (!profile) continue;
          if (!map.has(id)) map.set(id, { ...profile, reviewItems: [] });
          map.get(id)!.reviewItems.push({
            name: ss.subScopeName, type: SubDivisionScopeNodeTypes.SubScope,
            parentScope: scope.scopeName,
            startDate: ss.startDate, endDate: ss.endDate,
          });
        }
      }
    }
    return Array.from(map.values());
  });

  // ─── Audit scopes tree + search + pagination ──────────────
  readonly SCOPE_PAGE_SIZE = SUB_DIVISION_SCOPE_PAGE_SIZE;
  private readonly _scopeSearch       = signal('');
  private readonly _scopeFirst        = signal(0);
  private readonly _scopeExpandedKeys = signal<Set<string>>(new Set());

  readonly scopeTree = computed<TreeNode<FlatScopeItem>[]>(() => {
    const subDivision = this._subDivision();
    if (!subDivision?.scopes?.length) return [];
    const q = this._scopeSearch().toLowerCase().trim();
    const expKeys = this._scopeExpandedKeys();
    const nodes: TreeNode<FlatScopeItem>[] = [];

    for (const scope of subDivision.scopes) {
      const sKey = scope.scopeName;
      const scopeMatches = !q || scope.scopeName.toLowerCase().includes(q);
      const subScopes = q
        ? scopeMatches
          ? (scope.subScopes ?? [])
          : (scope.subScopes ?? []).filter(ss => ss.subScopeName.toLowerCase().includes(q))
        : (scope.subScopes ?? []);

      if (!q || scopeMatches || subScopes.length > 0) {
        nodes.push({
          key: sKey,
          expanded: q ? subScopes.length > 0 : expKeys.has(sKey),
          data: {
            name: scope.scopeName,
            type: SubDivisionScopeNodeTypes.Scope,
            scopeType: scope.scopeType,
            auditFrequency: scope.auditFrequency,
            riskRating: scope.riskRating ?? undefined,
            subScopeCount: scope.subScopes?.length ?? 0,
          },
          children: subScopes.map(ss => ({
            key: `${sKey}::${ss.subScopeName}`,
            leaf: true,
            data: {
              name: ss.subScopeName,
              type: SubDivisionScopeNodeTypes.SubScope,
              parentScopeName: scope.scopeName,
              auditFrequency: ss.auditFrequency,
              riskRating: ss.riskRating ?? undefined,
            },
            children: [],
          })),
        });
      }
    }
    return nodes;
  });

  readonly pagedScopeTree = computed(() =>
    this.scopeTree().slice(this._scopeFirst(), this._scopeFirst() + this.SCOPE_PAGE_SIZE)
  );

  getScopeSearch(): string { return this._scopeSearch(); }
  setScopeSearch(q: string): void { this._scopeSearch.set(q); this._scopeFirst.set(0); }
  getScopeFirst(): number { return this._scopeFirst(); }
  onScopeTreePageChange(event: { first?: number }): void { this._scopeFirst.set(event.first ?? 0); }

  onScopeNodeExpand(event: TreeNodeExpandEvent): void {
    const key = event.node.key;
    if (key) this._scopeExpandedKeys.update(s => new Set([...s, key]));
  }

  onScopeNodeCollapse(event: TreeNodeCollapseEvent): void {
    const key = event.node.key;
    if (key) this._scopeExpandedKeys.update(s => { const n = new Set(s); n.delete(key); return n; });
  }

  // ─── Resize ──────────────────────────────────────────────────────
  private isResizing = false;

  onResizeStart(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onResize(event: MouseEvent): void {
    if (!this.isResizing) return;
    const newWidth = window.innerWidth - event.clientX;
    if (newWidth >= SUB_DIVISION_PROFILE_RESIZE.MinWidth && newWidth <= SUB_DIVISION_PROFILE_RESIZE.MaxWidth) {
      const panel = document.querySelector(`.${SUB_DIVISION_PROFILE_DRAWER_CLASS}`) as HTMLElement | null;
      if (panel) panel.style.width = `${newWidth}px`;
    }
  }

  @HostListener('document:mouseup')
  onResizeEnd(): void {
    this.isResizing = false;
  }

  // ─── Existing helpers ────────────────────────────────────────────
  onHide(): void { this.drawerRef.close(null); }

  riskSeverity(r?: string): 'success' | 'warn' | 'danger' | 'secondary' {
    return r === SubDivisionRiskRatings.Low ? 'success'
      : r === SubDivisionRiskRatings.Medium ? 'warn'
      : r === SubDivisionRiskRatings.High ? 'danger'
      : 'secondary';
  }

  riskLabel(r?: string): string {
    return SUB_DIVISION_RISK_RATING_LABELS[r ?? ''] ?? (r ?? '—');
  }

  riskStatusLabel(s?: string): string {
    return SUB_DIVISION_RISK_STATUS_LABELS[s ?? ''] ?? (s ?? '—');
  }

  statusSeverity(s?: string): 'success' | 'secondary' {
    return s === SubDivisionStatuses.Active ? 'success' : 'secondary';
  }

  auditStatusLabel(s?: string): string {
    return SUB_DIVISION_AUDIT_STATUS_LABELS[s ?? ''] ?? (s ?? '—');
  }

  auditStatusSeverity(s?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    return SUB_DIVISION_AUDIT_STATUS_SEVERITY[s ?? ''] ?? 'secondary';
  }

  scopeTypeLabel(t?: string): string {
    return SUB_DIVISION_SCOPE_TYPE_LABELS[t ?? ''] ?? (t ?? '—');
  }

  auditFreqLabel(f?: string): string {
    return SUB_DIVISION_AUDIT_FREQUENCY_LABELS[f ?? ''] ?? (f ?? '—');
  }

  divisionTypeLabel(t?: string | null): string {
    return DIVISION_TYPE_OPTIONS.find(o => o.value === t)?.label ?? (t || '—');
  }

  departmentTypeLabel(t?: string | null): string {
    return SUB_DIVISION_DEPARTMENT_TYPE_LABELS[t ?? ''] ?? (t || '—');
  }

  auditFreqSeverity(f?: string): 'success' | 'info' | 'warn' | 'secondary' {
    return (SUB_DIVISION_AUDIT_FREQUENCY_SEVERITY[f ?? ''] ?? 'secondary') as 'success' | 'info' | 'warn' | 'secondary';
  }
}
