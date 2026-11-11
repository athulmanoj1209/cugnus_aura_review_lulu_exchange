import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, startWith } from 'rxjs';

import { OrganizationChartModule } from 'primeng/organizationchart';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';


import {
  AuditMember,
  AuditTreeNode,
  SelectOption,
  buildMockAuditTree,
  findNode,
  findParent,
} from '../../client-head-audit-team-chart/models/audit-chart.model';
import { MemberProfileAction, MemberProfileComponent, MemberProfileData } from '@/app/features/audits/audit-team/audit-team-member/profile/member-profile.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

// NOTE: adjust these 4 import paths to wherever these files actually live in
// your project — same seed files used by the CFO Audit Team Chart component.
import { CLIENT_MODE_VALUE, INTERNAL_AUDIT_CLIENT_KEY_VALUE } from '@/app/core/config/client-mode';
import { DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/divisions/division-static-indi-org.data';
import { SUB_DIVISION_INDI_ORG_COMPANIES } from '@/app/features/audits/organization/sub-divisions/sub-division-static-indi-org.data';
import { SCOPE_INDI_ORG_COMPANIES } from '@/app/features/audits/audit-plan/scope/audit-scope-static-indi-org.data';

/* ------------------------------------------------------------------ */
/*  Sub-Division Head Audit Team Chart                                  */
/*  Shows the full CAE root + only the managers/staff under the         */
/*  sub-division head's own division + sub-division.                    */
/*  Scope is the only user-controlled filter.                           */
/*                                                                      */
/*  Inputs (provided by parent from auth service in production):        */
/*    fixedDivision    — e.g. 'DXB'                                     */
/*    fixedSubDivision — e.g. 'Finance'                                 */
/*                                                                      */
/*  Client-mode aware: when CLIENT_MODE_VALUE is 'internal-audit',      */
/*  fixedDivision/fixedSubDivision default to a real DAR Exchange       */
/*  division/sub-division pair (DXB/AUH/RUH don't exist in that data    */
/*  set), the division chip is labeled from the static division seed    */
/*  file, and the scope dropdown is loaded from the static scope seed   */
/*  file for that division + sub-division instead of the mock audit     */
/*  tree.                                                                */
/* ------------------------------------------------------------------ */

type ViewMode = 'chart' | 'list';

/** One row of the flattened, depth-aware "list" view (root CAE excluded). */
interface SubDivisionTreeListRow {
  member: AuditMember;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

/** Is this build running for the DAR Exchange "internal audit" client? Decided once at
 *  module load, same as the seed files themselves (see client-mode.ts). */
const IS_INTERNAL_AUDIT = CLIENT_MODE_VALUE === 'internal-audit';

interface IndiOrgDivisionEntry {
  divisionCode: string;
  divisionName: string;
}
interface IndiOrgScopeEntry {
  divisionCode: string;
  subDivisionName: string;
  scopeName: string;
}

/** Division code → name lookup for internal-audit, e.g. 'ABC-BR-03' → 'Finance'. */
const INDI_ORG_DIVISIONS: IndiOrgDivisionEntry[] = DIVISION_INDI_ORG_COMPANIES.flatMap(company =>
  company.divisions.map(division => ({ divisionCode: division.divisionCode, divisionName: division.divisionName })),
);

/** Flattened division → subDivision → top-level scope for internal-audit. Sub-scopes
 *  (entries with a non-null parentScopeId, e.g. the 3 AML/CFT sub-scopes under
 *  SC-5000) are grouping-only and left out of the filter list. */
const INDI_ORG_SCOPES: IndiOrgScopeEntry[] = SCOPE_INDI_ORG_COMPANIES.flatMap(company =>
  company.divisions.flatMap(division =>
    division.subDivisions.flatMap(sub =>
      sub.scopes
        .filter(scope => !scope.parentScopeId)
        .map(scope => ({
          divisionCode: division.divisionCode,
          subDivisionName: sub.subDivisionName,
          scopeName: scope.scopeName,
        })),
    ),
  ),
);

/** Demo division/sub-division pair for internal-audit — 'DXB'/'Finance' don't exist in
 *  either single-org data set, so this picks a real division+sub-division instead, one
 *  per org since division codes differ between them (DAR Exchange: ABC-BR-03, Lulu Exchange: LULU-BR-12, XYZ
 *  Broadcast: XYZ-BR-01). In production these two inputs come from the signed-in
 *  sub-division head's own division/sub-division via the auth service. */
const INDI_ORG_DEFAULT_DIVISION =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'xyz-broadcast' ? 'XYZ-BR-01'
  : INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? 'LULU-BR-12'   // BRANCH OPERATIONS
  : 'ABC-BR-03';                                                         // DAR Exchange — Finance
/** Lulu Exchange has no 'Finance' sub-division — use Branch 2, which carries most of its scopes. */
const INDI_ORG_DEFAULT_SUB_DIVISION =
  INTERNAL_AUDIT_CLIENT_KEY_VALUE === 'lulu-exchange' ? 'Branch 2' : 'Finance';

@Component({
  selector: 'app-dept-head-audit-team-chart',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    OrganizationChartModule,
    SelectModule,
    ButtonModule,
    TooltipModule,

    DrawIconComponent,],
  templateUrl: './dept-head-audit-team-chart.component.html',
  styleUrl: './dept-head-audit-team-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeptHeadAuditTeamChartComponent {

  /* ── DI ─────────────────────────────────────────────────────────── */
  private readonly fb     = inject(FormBuilder);
  private readonly drawer = inject(RightDrawerService);

  // NgZone lets the high-frequency mousemove handler used for hand-scrolling
  // (grab-to-pan) run outside Angular's change detection — see onChartMouseDown.
  private readonly zone   = inject(NgZone);

  /** The scrollable org-chart viewport, referenced from the template via #chartWrap. */
  private readonly chartWrapRef = viewChild<ElementRef<HTMLDivElement>>('chartWrap');

  /* ── Inputs from parent (auth-context values) ────────────────────── */
  /** Division code the sub-division head belongs to. Default is a demo value — a real
   *  DAR Exchange division code when running in internal-audit mode. */
  readonly fixedDivision     = input<string>(IS_INTERNAL_AUDIT ? INDI_ORG_DEFAULT_DIVISION : 'DXB');
  /** Sub-division the sub-division head manages. Default is a demo value. */
  readonly fixedSubDivision = input<string>(IS_INTERNAL_AUDIT ? INDI_ORG_DEFAULT_SUB_DIVISION : 'Finance');

  /* ── Raw data ────────────────────────────────────────────────────── */
  /** In production replace with an injected service call. */
  private readonly rootNode: AuditTreeNode = buildMockAuditTree();

  /** Signal wrapping the full tree — used for tree-context lookups in viewMember. */
  readonly tree = signal<AuditTreeNode[]>([this.rootNode]);

  /* ── View mode ───────────────────────────────────────────────────── */
  readonly viewMode = signal<ViewMode>('chart');
  readonly exitPanModeLabel = $localize`:@@client.auditTeamChart.exitPanMode:Exit Pan Mode`;
  readonly panModeLabel = $localize`:@@client.auditTeamChart.panMode:Pan Mode`;
  readonly collapseLabel = $localize`:@@common.collapse:Collapse`;
  readonly expandLabel = $localize`:@@common.expand:Expand`;
  readonly allScopesLabel = $localize`:@@client.auditTeamChart.allScopes:All Scopes`;

  setViewMode(m: ViewMode): void { this.viewMode.set(m); }

  /* ── Zoom ────────────────────────────────────────────────────────── */
  private readonly MIN_ZOOM  = 0.25;
  private readonly MAX_ZOOM  = 3;
  private readonly ZOOM_STEP = 0.1;

  readonly zoomLevel = signal<number>(0.7);

  zoomIn():    void { this.zoomLevel.update(z => Math.min(+(z + this.ZOOM_STEP).toFixed(2), this.MAX_ZOOM)); }
  zoomOut():   void { this.zoomLevel.update(z => Math.max(+(z - this.ZOOM_STEP).toFixed(2), this.MIN_ZOOM)); }
  resetZoom(): void { this.zoomLevel.set(0.6); }

  onChartWheel(event: WheelEvent): void {
    if (!event.ctrlKey) return;
    event.preventDefault();
    event.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }

  /* ── Grab-to-pan (hand-scroll) ────────────────────────────────────
   * Lets the user click-drag empty chart space to scroll instead of
   * relying on scrollbars, same behavior as the client org chart. */

  readonly panModeEnabled = signal<boolean>(false);
  readonly isPanning      = signal<boolean>(false);

  private panStartX = 0;
  private panStartY = 0;
  private panScrollLeft = 0;
  private panScrollTop  = 0;
  private panHighlightedEl: HTMLElement | null = null;

  /** Whichever element actually owns vertical scrolling for the chart —
   *  #chartWrap itself if it's tall/overflow-bound enough to scroll on its
   *  own, otherwise the nearest scrollable ancestor. `null` means nothing
   *  in between scrolls, so the document/window should be panned instead.
   *  Resolved fresh on every pan start since layout can change (zoom,
   *  filters, expand/collapse all resize the chart). */
  private panVerticalTarget: HTMLElement | null = null;

  private readonly onPanMoveBound = (e: MouseEvent) => this.onPanMove(e);
  private readonly onPanEndBound  = () => this.onPanEnd();

  /** Toggles Pan Mode on/off from the header hand-icon button. */
  togglePanMode(): void {
    this.panModeEnabled.update(v => !v);
    if (!this.panModeEnabled()) this.clearPanHighlight();
  }

  /** Blocks native image/text drag-out while Pan Mode is active — it would otherwise fight with drag-to-scroll. */
  onChartDragStart(event: DragEvent): void {
    if (this.panModeEnabled()) event.preventDefault();
  }

  /** Starts a pan gesture. Ignores clicks on interactive controls so the selects and node toggler still work. */
  onChartMouseDown(event: MouseEvent): void {
    if (!this.panModeEnabled() || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('button, input, a, .p-select, .p-node-toggler')) return;

    const el = this.chartWrapRef()?.nativeElement;
    if (!el) return;

    event.preventDefault();

    this.panStartX     = event.clientX;
    this.panStartY     = event.clientY;
    this.panScrollLeft = el.scrollLeft;

    // #chartWrap only ever grows tall enough to actually overflow (and thus
    // scroll) horizontally on its own — vertically it just expands (see
    // min-height: 60vh in the SCSS with no bound) and an ancestor, or the
    // page itself, ends up owning the scroll instead. Setting el.scrollTop
    // on an element with nothing to scroll is a no-op, which is exactly why
    // vertical hand-panning did nothing before. Find whoever really owns
    // the vertical scroll so panning can drive it.
    this.panVerticalTarget = this.findVerticalScrollTarget(el);
    this.panScrollTop = this.panVerticalTarget
      ? this.panVerticalTarget.scrollTop
      : (document.scrollingElement?.scrollTop ?? window.scrollY);
    this.isPanning.set(true);

    // High-frequency mousemove only touches raw DOM (scroll offset + a class
    // toggle), so run the drag outside Angular's zone to avoid needless
    // change detection on every pointer move.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onPanMoveBound);
      window.addEventListener('mouseup', this.onPanEndBound);
      window.addEventListener('mouseleave', this.onPanEndBound);
    });
  }

  private onPanMove(event: MouseEvent): void {
    const el = this.chartWrapRef()?.nativeElement;
    if (!el) return;

    const dx = event.clientX - this.panStartX;
    const dy = event.clientY - this.panStartY;
    el.scrollLeft = this.panScrollLeft - dx;

    const newTop = this.panScrollTop - dy;
    if (this.panVerticalTarget) {
      this.panVerticalTarget.scrollTop = newTop;
    } else if (document.scrollingElement) {
      document.scrollingElement.scrollTop = newTop;
    } else {
      window.scrollTo(window.scrollX, newTop);
    }

    this.updatePanHighlight(event.clientX, event.clientY);
  }

  private onPanEnd(): void {
    window.removeEventListener('mousemove', this.onPanMoveBound);
    window.removeEventListener('mouseup', this.onPanEndBound);
    window.removeEventListener('mouseleave', this.onPanEndBound);
    this.clearPanHighlight();
    this.panVerticalTarget = null;
    this.zone.run(() => this.isPanning.set(false));
  }

  /**
   * Walks up from #chartWrap to find whichever element has vertical
   * overflow scrolling enabled (overflow-y: auto/scroll) AND content taller
   * than its box — i.e. the element whose scrollTop actually needs to move
   * for vertical hand-panning to have any visible effect. Returns null when
   * no such ancestor exists, meaning the document itself should be panned.
   */
  private findVerticalScrollTarget(start: HTMLElement): HTMLElement | null {
    let node: HTMLElement | null = start;
    while (node && node !== document.documentElement && node !== document.body) {
      const style = getComputedStyle(node);
      const canScrollY =
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight;
      if (canScrollY) return node;
      node = node.parentElement;
    }
    return null;
  }

  /** Highlights whichever node card the hand icon is currently travelling over. */
  private updatePanHighlight(clientX: number, clientY: number): void {
    const hit  = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const card = hit?.closest('.node-card') as HTMLElement | null;
    if (card === this.panHighlightedEl) return;

    this.panHighlightedEl?.classList.remove('node-card--pan-highlight');
    card?.classList.add('node-card--pan-highlight');
    this.panHighlightedEl = card;
  }

  private clearPanHighlight(): void {
    this.panHighlightedEl?.classList.remove('node-card--pan-highlight');
    this.panHighlightedEl = null;
  }

  /* ── Scope-only filter form ──────────────────────────────────────── */
  readonly filters = this.fb.group({
    scope: [null as string | null],
  });

  /** Scope form value as a signal. */
  private readonly formSignal = toSignal(
    this.filters.valueChanges.pipe(
      debounceTime(150),
      startWith(this.filters.getRawValue()),
    ),
    { initialValue: this.filters.getRawValue() },
  );

  /**
   * Combined filter signal: fixed division + sub-division from inputs,
   * user-selected scope from the form.
   */
  private readonly filtersSignal = computed(() => ({
    division:     this.fixedDivision(),
    subDivision: this.fixedSubDivision(),
    scope:      this.formSignal().scope,
  }));

  /* ── Scope options — derived from live data for this sub-division ─── */
  /** Internal-audit client → scopes loaded from the static scope seed file for
   *  this division + sub-division. Audit-firm client → derived from the mock tree. */
  readonly scopeOptions = computed<SelectOption[]>(() => {
    const division = this.fixedDivision();
    const sub   = this.fixedSubDivision();

    if (IS_INTERNAL_AUDIT) {
      const scopes = INDI_ORG_SCOPES
        .filter(s => s.divisionCode === division && s.subDivisionName === sub)
        .map(s => s.scopeName);

      return [
        { label: this.allScopesLabel, value: null },
        ...[...new Set(scopes)].sort().map(s => ({ label: s, value: s })),
      ];
    }

    const children = this.rootNode.children ?? [];

    const scopes = [
      ...new Set(
        children
          .filter(c =>
            c.data?.division === division &&
            c.data?.subDivision === sub &&
            c.data?.scope,
          )
          .map(c => c.data!.scope as string),
      ),
    ];

    return [
      { label: 'All Scopes', value: null },
      ...scopes.sort().map(s => ({ label: this.formatScope(s), value: s })),
    ];
  });

  /* ── Visible tree ────────────────────────────────────────────────── */
  /**
   * Returns the real CAE root with its children filtered to the
   * sub-division head's division + sub-division (+ optional scope).
   */
  readonly visibleTree = computed<AuditTreeNode[]>(() => {
    const { division, subDivision, scope } = this.filtersSignal();

    // Deep-clone so PrimeNG detects the new reference
    const root = JSON.parse(JSON.stringify(this.rootNode)) as AuditTreeNode;

    if (!division && !subDivision && !scope) return [root];

    // Filter direct children (managers) that match all active filters
    root.children = (root.children ?? []).filter(child => {
      const d = child.data!;
      return (
        (!division     || d.division     === division) &&
        (!subDivision || d.subDivision === subDivision) &&
        (!scope      || d.scope      === scope)
      );
    });

    // If all children removed, return empty so empty state shows
    if (!root.children.length) return [];

    return [root];
  });

  /* ── Flat members (exclude CAE root) ────────────────────────────── */
  readonly flatMembers = computed<AuditMember[]>(() => {
    const tree = this.visibleTree();
    if (!tree.length) return [];
    const out: AuditMember[] = [];
    const walk = (nodes: AuditTreeNode[]) => {
      for (const n of nodes) {
        if (n.data) out.push(n.data);
        walk(n.children ?? []);
      }
    };
    // Start from children — skip root CAE node in list view
    walk(tree[0].children ?? []);
    return out;
  });

  /** Node ids collapsed in the "list" view (independent of the chart's own expand state). */
  readonly collapsedIds = signal<Set<string>>(new Set());

  /**
   * Flattened, depth-aware, collapse-aware rows for the hierarchical "list" view.
   * Mirrors the Audit Team Chart page's list view: manager → senior auditor →
   * staff auditor, indented by depth, with each row's subtree collapsible.
   * Root CAE node is excluded, same as `flatMembers`.
   */
  readonly flatVisibleRows = computed<SubDivisionTreeListRow[]>(() => {
    const tree = this.visibleTree();
    if (!tree.length) return [];
    const collapsed = this.collapsedIds();
    const out: SubDivisionTreeListRow[] = [];
    const walk = (nodes: AuditTreeNode[], depth: number) => {
      for (const n of nodes) {
        if (!n.data) continue;
        const children = n.children ?? [];
        const hasChildren = children.length > 0;
        const expanded = !collapsed.has(n.data.id);
        out.push({ member: n.data, depth, hasChildren, expanded });
        if (hasChildren && expanded) walk(children, depth + 1);
      }
    };
    walk(tree[0].children ?? [], 0);
    return out;
  });

  /* ── Active filter count (scope only) ───────────────────────────── */
  readonly activeFilterCount = computed<number>(() =>
    this.filtersSignal().scope ? 1 : 0,
  );

  /* ── Computed subtitle (avoids template apostrophe issues) ───────── */
  readonly pageSubtitle = computed<string>(() => {
    const subDivision = this.fixedSubDivision();
    return $localize`:@@client.auditTeamChart.pageSubtitle:Viewing ${subDivision} sub-division's audit team hierarchy. Filter by scope to narrow results.`;
  });

  /* ── Clear scope filter ──────────────────────────────────────────── */
  clearFilters(): void {
    this.filters.reset({ scope: null });
  }

  /* ── Expand / collapse all ───────────────────────────────────────── */
  toggleAll(expand: boolean): void {
    const walk = (nodes: AuditTreeNode[]) => {
      for (const n of nodes) {
        n.expanded = expand;
        walk(n.children ?? []);
      }
    };
    walk(this.visibleTree());

    // Keep the "list" view's collapse state (a dedicated signal, since the
    // chart's own `node.expanded` mutation above doesn't reactively notify it)
    // in sync with the same Expand All / Collapse All buttons.
    if (expand) {
      this.collapsedIds.set(new Set());
    } else {
      const ids = new Set<string>();
      const collect = (nodes: AuditTreeNode[]) => {
        for (const n of nodes) {
          if (n.data && (n.children ?? []).length > 0) ids.add(n.data.id);
          collect(n.children ?? []);
        }
      };
      collect(this.visibleTree());
      this.collapsedIds.set(ids);
    }
  }

  /** Expand/collapse a single node's subtree in the "list" view. */
  toggleNode(memberId: string, ev: Event): void {
    ev.stopPropagation();
    this.collapsedIds.update(ids => {
      const next = new Set(ids);
      next.has(memberId) ? next.delete(memberId) : next.add(memberId);
      return next;
    });
  }

  /* ── View member profile (right drawer) ─────────────────────────── */
  async viewMember(member: AuditMember, ev: Event): Promise<void> {
    ev.stopPropagation();

    const tree   = this.tree();
    const parent = findParent(tree, member.id);
    const self   = findNode(tree, member.id);

    const ref = this.drawer.open<MemberProfileAction, MemberProfileData>(
      MemberProfileComponent,
      {
        width: '760px',
        data: {
          id:                member.id,
          name:              member.name,
          title:             member.title,
          avatarUrl:         member.avatarUrl,
          subDivision:        member.subDivision ?? undefined,
          yearsOfExperience: member.experience,
          expertise:         member.expertise,
          workloadPct:       member.workloadPct,
          reportsTo: parent?.data
            ? {
                id:        parent.data.id,
                name:      parent.data.name,
                title:     parent.data.title,
                avatarUrl: parent.data.avatarUrl,
              }
            : undefined,
          directReports: (self?.children ?? [])
            .map(c => c.data!)
            .filter(Boolean)
            .map(c => ({
              id:        c.id,
              name:      c.name,
              title:     c.title,
              avatarUrl: c.avatarUrl,
            })),
        } satisfies MemberProfileData,
      },
    );

    await ref.afterClosed;
  }

  /* ── Helpers ─────────────────────────────────────────────────────── */
  trackById(_: number, m: AuditMember): string { return m.id; }

  trackByRow(_: number, row: SubDivisionTreeListRow): string { return row.member.id; }

  workloadTier(pct: number): 'low' | 'mid' | 'high' {
    if (pct >= 90) return 'high';
    if (pct >= 70) return 'mid';
    return 'low';
  }

  tierClass(tier: string): string { return `tier-${tier}`; }

  /** Internal-audit client → looked up from the static division seed file.
   *  Audit-firm client → the original hardcoded DXB/AUH/RUH map. */
  divisionLabel(code: string): string {
    if (IS_INTERNAL_AUDIT) {
      return INDI_ORG_DIVISIONS.find(b => b.divisionCode === code)?.divisionName ?? code;
    }

    const map: Record<string, string> = {
      DXB: $localize`:@@client.auditTeamChart.divisionDubai:Dubai (DXB)`,
      AUH: $localize`:@@client.auditTeamChart.divisionAbuDhabi:Abu Dhabi (AUH)`,
      RUH: $localize`:@@client.auditTeamChart.divisionRiyadh:Riyadh (RUH)`,
    };
    return map[code] ?? code;
  }

  scopeLabel(scope: string | null): string {
    return scope ? this.formatScope(scope) : '';
  }

  private formatScope(s: string): string {
    return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}