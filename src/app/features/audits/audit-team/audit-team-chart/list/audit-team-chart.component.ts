import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

// PrimeNG
import { OrganizationChartModule } from 'primeng/organizationchart';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';

// Angular CDK – drag & drop
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';

// Adjust this import path to match your project layout
import { RightDrawerService } from '@/app/shared/components/right-drawer-host/services/right-drawer.service';
import {
  AddMemberModalComponent,
  AddMemberResult,
  ExistingMember,
  Expertise,
  NewMemberFormModel,
  ALL_EXPERTISE,
} from '../../audit-team-member/manage/member.component';
import { MemberProfileAction, MemberProfileComponent, MemberProfileData } from '../../audit-team-member/profile/member-profile.component';
import { DialogModule } from 'primeng/dialog';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import {
  AuditRoles,
  AuditTeamBlockActions,
  AuditTeamChartViewModes,
  AuditTeamMemberDrawerModes,
  RiskTiers,
  WorkloadTiers,
  type AuditRole,
  type AuditTeamChartViewMode,
  type RiskTier,
  type WorkloadTier,
  AUDIT_TEAM_CHART_DRAWER,
  AUDIT_TEAM_CHART_SEARCH_DEBOUNCE_MS,
  DEFAULT_MEMBER_AVATAR_URL,
  NODE_CARD_PAN_HIGHLIGHT_CLASS,
  NODE_CARD_SELECTOR,
  PAN_IGNORE_SELECTOR,
  WORKLOAD_THRESHOLDS,
} from '../constants/audit-team-chart.constants';
import {
  AUDIT_TEAM_BLOCK_CONFIRM_LABELS,
  AUDIT_TEAM_REGION_OPTIONS,
  DESIGNATION_CODE_BY_TITLE,
  DESIGNATION_LABEL_BY_CODE,
} from '../constants/audit-team-chart-labels.constants';

/* ============================================================
 *  Models
 * ============================================================ */

export type { AuditRole, RiskTier };

export interface AuditMember {
  id: string;
  name: string;
  title: string;              // Display title — e.g. "CAE", "Audit Manager"
  role: AuditRole;            // Logical role used for validation
  experience: number;         // Years of experience
  expertise: string[];        // e.g. ['Finance', 'Operations']
  workloadPct: number;        // 0-100
  region?: string;            // For region/country filter
  avatarUrl?: string;
  badge?: {
    label: string;            // "M", "H", "L", etc.
    tier: RiskTier;
  };
  blocked?: boolean;
}
export interface AuditMember {
  id: string;
  name: string;
  title: string;              // Display title — e.g. "CAE", "Audit Manager"
  role: AuditRole;            // Logical role used for validation
  experience: number;         // Years of experience
  expertise: string[];        // e.g. ['Finance', 'Operations']
  workloadPct: number;        // 0-100
  region?: string;            // For region/country filter
  avatarUrl?: string;
  badge?: {
    label: string;            // "M", "H", "L", etc.
    tier: RiskTier;
  };
  blocked?: boolean;
}

/** Convenience alias — every node in the org chart wraps an AuditMember. */
export type AuditTreeNode = TreeNode<AuditMember>;

/** One row of the flattened, depth-aware "list" view. */
export interface TreeListRow {
  member: AuditMember;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
}

type ViewMode = AuditTeamChartViewMode;

@Component({
  selector: 'app-audit-team-chart',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    OrganizationChartModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,DialogModule
  , DrawIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './audit-team-chart.component.html',
  styleUrls: ['./audit-team-chart.component.scss'],
})


export class AuditTeamChartComponent {

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly drawer = inject(RightDrawerService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  // NgZone lets the high-frequency mousemove handler used for hand-scrolling
  // (grab-to-pan) run outside Angular's change detection — see onChartMouseDown.
  private readonly zone = inject(NgZone);

  /** The scrollable org-chart viewport, referenced from the template via #chartWrap. */
  private readonly chartWrapRef = viewChild<ElementRef<HTMLDivElement>>('chartWrap');

  readonly exitPanModeLabel = $localize`:@@audit.auditTeam.exitPanMode:Exit pan mode`;
  readonly panModeLabel = $localize`:@@audit.auditTeam.panMode:Pan mode`;
  readonly collapseLabel = $localize`:@@common.collapse:Collapse`;
  readonly expandLabel = $localize`:@@common.expand:Expand`;
  readonly activateLabel = $localize`:@@common.activate:Activate`;
  readonly deactivateLabel = $localize`:@@common.deactivate:Deactivate`;

  experienceShortLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYearExperienceShort:${years}:years: yr exp.`
      : $localize`:@@audit.auditTeam.yearsExperienceShort:${years}:years: yrs exp.`;
  }

  experienceLabel(years: number): string {
    return years === 1
      ? $localize`:@@audit.auditTeam.oneYear:${years}:years: year`
      : $localize`:@@audit.auditTeam.years:${years}:years: years`;
  }

  confirmationMessage(): string {
    const name = this.confirmationTarget()?.name ?? '';

    return this.confirmationAction() === AuditTeamBlockActions.Deactivate
      ? $localize`:@@audit.auditTeam.confirmDeactivate:Are you sure you want to deactivate ${name}:name:?`
      : $localize`:@@audit.auditTeam.confirmActivate:Are you sure you want to activate ${name}:name:?`;
  }

  constructor() {
    // Safety net: release any pan listeners still attached if the component
    // is destroyed mid-gesture (e.g. navigating away while panning).
    this.destroyRef.onDestroy(() => this.onPanEnd());
  }

  /** Navigate to the previous page; fall back to home on a deep link. */
  goBack(): void {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/']);
  }

  /* ---------------- Filters ---------------- */
  readonly filters = this.fb.group({
    search: [''],
    region: [null as string | null],
  });

  private readonly filtersSignal = toSignal(
    this.filters.valueChanges.pipe(
      debounceTime(AUDIT_TEAM_CHART_SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(
        (a, b) => a.search === b.search && a.region === b.region,
      ),
      startWith(this.filters.value),
    ),
    { initialValue: this.filters.value },
  );

  readonly regionOptions = AUDIT_TEAM_REGION_OPTIONS;

  // Exposed for the template.
  readonly AuditRoles = AuditRoles;
  readonly AuditTeamChartViewModes = AuditTeamChartViewModes;
  readonly AuditTeamBlockActions = AuditTeamBlockActions;
  readonly blockConfirmLabels = AUDIT_TEAM_BLOCK_CONFIRM_LABELS;

  /* ---------------- View mode -------------- */
  readonly viewMode = signal<ViewMode>(AuditTeamChartViewModes.Chart);
  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  /* ---------------- Pan mode (grab-to-pan) --
   * Lets the user click-drag empty chart space to scroll instead of relying
   * on scrollbars/trackpad — same behaviour as the CFO Audit Team Chart. */
  readonly panModeEnabled = signal<boolean>(false);
  readonly isPanning = signal<boolean>(false);

  private panStartX = 0;
  private panStartY = 0;
  private panScrollLeft = 0;
  private panScrollTop = 0;
  private panHighlightedEl: HTMLElement | null = null;

  /** Whichever element actually owns vertical scrolling for the chart —
   *  resolved fresh on every pan start since layout can change (expand/
   *  collapse all resizes the chart). `null` means the document itself
   *  should be panned. */
  private panVerticalTarget: HTMLElement | null = null;

  private readonly onPanMoveBound = (e: MouseEvent) => this.onPanMove(e);
  private readonly onPanEndBound = () => this.onPanEnd();

  /** Toggles Pan Mode on/off from the header hand-icon button. */
  togglePanMode(): void {
    this.panModeEnabled.update(v => !v);
    if (!this.panModeEnabled()) this.clearPanHighlight();
  }

  /** Blocks native image/text drag-out while Pan Mode is active — it would otherwise fight with drag-to-scroll. */
  onChartDragStart(event: DragEvent): void {
    if (this.panModeEnabled()) event.preventDefault();
  }

  /**
   * Starts a pan gesture. Ignores clicks on interactive controls — buttons,
   * the region select, and the org chart's own expand/collapse togglers —
   * so they still work as expected. Card dragging (cdkDrag) is disabled
   * while Pan Mode is on, so a mousedown that starts on a card is safe to
   * treat as the start of a pan too.
   */
  onChartMouseDown(event: MouseEvent): void {
    if (!this.panModeEnabled() || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest(PAN_IGNORE_SELECTOR)) return;

    const el = this.chartWrapRef()?.nativeElement;
    if (!el) return;

    event.preventDefault();

    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panScrollLeft = el.scrollLeft;

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
   * Walks up from #chartWrap to find whichever element has vertical overflow
   * scrolling enabled (overflow-y: auto/scroll) AND content taller than its
   * box — the element whose scrollTop actually needs to move for vertical
   * hand-panning to have any visible effect. Returns null when no such
   * ancestor exists, meaning the document itself should be panned.
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
    const hit = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const card = hit?.closest(NODE_CARD_SELECTOR) as HTMLElement | null;
    if (card === this.panHighlightedEl) return;

    this.panHighlightedEl?.classList.remove(NODE_CARD_PAN_HIGHLIGHT_CLASS);
    card?.classList.add(NODE_CARD_PAN_HIGHLIGHT_CLASS);
    this.panHighlightedEl = card;
  }

  private clearPanHighlight(): void {
    this.panHighlightedEl?.classList.remove(NODE_CARD_PAN_HIGHLIGHT_CLASS);
    this.panHighlightedEl = null;
  }

  /* ---------------- Tree state ------------- */
  /** Source of truth for the org tree (root is the CAE). */
  readonly tree = signal<AuditTreeNode[]>([this.buildMockTree()]);

  /** Currently-dragged member id (used to highlight valid drop targets). */
  readonly draggingId = signal<string | null>(null);

  /** Currently-selected node id (for inspection / future detail drawer). */
  readonly selectedId = signal<string | null>(null);

  /** Visible tree — applies search + region filters non-destructively. */
  readonly visibleTree = computed<AuditTreeNode[]>(() => {
    const f = this.filtersSignal();
    const search = (f?.search ?? '').toLowerCase().trim();
    const region = f?.region ?? null;

    const root = this.tree()[0];
    if (!root) return [];

    if (!search && !region) return [root];

    const filterFn = (n: AuditTreeNode): AuditTreeNode | null => {
      const data = n.data!;
      const selfMatches =
        (!search ||
          data.name.toLowerCase().includes(search) ||
          data.title.toLowerCase().includes(search) ||
          data.expertise.some(x => x.toLowerCase().includes(search))) &&
        (!region || data.region === region);

      const matchedChildren = (n.children ?? [])
        .map(filterFn)
        .filter((c): c is AuditTreeNode => c !== null);

      if (selfMatches || matchedChildren.length > 0) {
        return { ...n, expanded: true, children: matchedChildren };
      }
      return null;
    };

    const filteredRoot = filterFn(root);
    return filteredRoot ? [filteredRoot] : [];
  });

  /** Flat list of all members, regardless of collapse state — used by the DnD "Link Existing" parent picker. */
  readonly flatMembers = computed<AuditMember[]>(() => {
    const out: AuditMember[] = [];
    const walk = (n: AuditTreeNode) => {
      if (n.data) out.push(n.data);
      (n.children ?? []).forEach(walk);
    };
    this.tree().forEach(walk);
    return out;
  });

  /**
   * Flattened, depth-aware, collapse-aware rows for the hierarchical "list" view.
   * Mirrors the chart's parent → child → sub-child structure: a row's children
   * are only emitted while that row is expanded, so collapsing a node hides its
   * whole subtree the same way it does in the org chart.
   */
  readonly flatVisibleRows = computed<TreeListRow[]>(() => {
    const out: TreeListRow[] = [];
    const walk = (n: AuditTreeNode, depth: number) => {
      if (!n.data) return;
      const children = n.children ?? [];
      const expanded = n.expanded !== false;
      out.push({ member: n.data, depth, hasChildren: children.length > 0, expanded });
      if (expanded) children.forEach(c => walk(c, depth + 1));
    };
    this.visibleTree().forEach(n => walk(n, 0));
    return out;
  });

  /* ---------------- Drag & drop ------------ */

  onDragStart(memberId: string): void {
    this.draggingId.set(memberId);
  }

  onDragEnd(): void {
    this.draggingId.set(null);
  }

  /**
   * Called when the user drops the dragged member onto a target node card.
   * Re-parents the dragged member (and its descendants) under the target.
   */
  onDropOnNode(targetMemberId: string, event: CdkDragDrop<unknown>): void {
    const sourceId = event.item.data as string;
    this.draggingId.set(null);

    if (!sourceId || sourceId === targetMemberId) return;

    this.tree.update(tree => {
      const next = cloneTree(tree);
      const sourceParent = findParent(next, sourceId);
      const source = findNode(next, sourceId);
      const target = findNode(next, targetMemberId);

      if (!source || !target) return tree;
      if (source.data!.role === AuditRoles.CAE) return tree;
      if (containsId(source, targetMemberId)) return tree;

      if (sourceParent) {
        sourceParent.children = (sourceParent.children ?? [])
          .filter(c => c.data!.id !== sourceId);
      }

      target.children = [...(target.children ?? []), source];
      target.expanded = true;
      return next;
    });
  }

  /* ---------------- Card actions ----------- */

  onSelect(member: AuditMember): void {
    this.selectedId.set(member.id);
  }

   async viewMember(member: AuditMember, ev: Event): Promise<void> {
    ev.stopPropagation();

    const ref = this.drawer.open<MemberProfileAction, MemberProfileData>(
      MemberProfileComponent,
      {
        //ariaLabel: `Profile of ${member.name}`,
        width: AUDIT_TEAM_CHART_DRAWER.ProfileWidth,
        data: this.auditMemberToProfile(member),
      },
    );

    await ref.afterClosed;
    
   
  }

  /**
   * Open the AddMemberModal in EDIT mode for a node in the chart.
   * Passes the existing AuditMember mapped to NewMemberFormModel,
   * then writes the user's changes back into the tree on close.
   */
  async editMember(member: AuditMember, ev: Event): Promise<void> {
    ev.stopPropagation();

    const ref = this.drawer.open<AddMemberResult>(AddMemberModalComponent, {
      //ariaLabel: `Edit ${member.name}`,
      width: AUDIT_TEAM_CHART_DRAWER.MemberFormWidth,
      data: {
        existing: this.auditMemberToFormModel(member),
        members: this.toExistingMemberDtos(),
        mode: AuditTeamMemberDrawerModes.Edit,
      },
    });

    const result = await ref.afterClosed;
    // Edit flow only accepts 'create'-mode submissions (the form payload).
    if (!result || result.mode !== 'create') return;

    // Patch the tree in place
    this.tree.update(tree => {
      const next = cloneTree(tree);
      const node = findNode(next, member.id);
      if (node?.data) {
        const f = result.member;
        node.data = {
          ...node.data,
          name:       f.fullName ?? node.data.name,
          title:      this.designationLabelFromCode(f.designation ?? '') || node.data.title,
          experience: f.yearsOfExperience ?? node.data.experience,
          expertise:  f.expertise?.length ? f.expertise : node.data.expertise,
        };
      }
      return next;
    });
  }

  //toggleBlocked(member: AuditMember, ev: Event): void {
     toggleBlocked(member: AuditMember): void {
   // ev.stopPropagation();
    this.tree.update(tree => {
      const next = cloneTree(tree);
      const n = findNode(next, member.id);
      if (n?.data) n.data = { ...n.data, blocked: !n.data.blocked };
      return next;
    });
  }
 // ---------------- Block / Unblock confirmation ----------------
  readonly displayConfirmation = signal(false);
  private readonly pendingMember = signal<AuditMember | null>(null);

  /** Label for the confirm button — "Block" or "Unblock". */
  readonly confirmationAction = computed(() =>
    this.pendingMember()?.blocked ? AuditTeamBlockActions.Activate : AuditTeamBlockActions.Deactivate,
  );

  /** Name shown in the confirmation question. */
  readonly confirmationTarget = computed(() => this.pendingMember());

  openConfirmation(member: AuditMember): void {
    this.pendingMember.set(member);
    this.displayConfirmation.set(true);
  }

  closeConfirmation(): void {
    this.displayConfirmation.set(false);
    this.pendingMember.set(null);
  }

  confirmToggleBlocked(): void {
    const m = this.pendingMember();
    if (m) this.toggleBlocked(m);
    this.closeConfirmation();
  }
  /** Show this node's subtree only (focus mode). */
  focusOnSubtree(member: AuditMember, ev: Event): void {
    ev.stopPropagation();
    const root = findNode(this.tree(), member.id);
    if (!root) return;
    this.tree.update(t => {
      const cloned = cloneTree([root]);
      cloned[0].expanded = true;
      return cloned.length ? cloned : t;
    });
  }

  /* ---------------- Expand/collapse -------- */

  toggleAll(expand: boolean): void {
    this.tree.update(tree => {
      const next = cloneTree(tree);
      const walk = (n: AuditTreeNode) => {
        n.expanded = expand;
        (n.children ?? []).forEach(walk);
      };
      next.forEach(walk);
      return next;
    });
  }

  /** Expand/collapse a single node's subtree in the "list" view. */
  toggleNode(memberId: string, ev: Event): void {
    ev.stopPropagation();
    this.tree.update(tree => {
      const next = cloneTree(tree);
      const n = findNode(next, memberId);
      if (n) n.expanded = !(n.expanded !== false);
      return next;
    });
  }
private auditMemberToProfile(member: AuditMember): MemberProfileData {
    // Use the live tree (not the filtered one) so reporting context is
    // always accurate, even when a search is in effect.
    const tree = this.tree();
    const parent = findParent(tree, member.id);
    const self   = findNode(tree, member.id);

    const regionLabel = this.regionOptions.find(o => o.value === member.region)?.label;

    return {
      id:                 member.id,
      name:               member.name,
      title:              member.title,
      avatarUrl:          member.avatarUrl,
      subDivision:         undefined,                // not on AuditMember
      region:             regionLabel ?? member.region,
      yearsOfExperience:  member.experience,
      expertise:          member.expertise,
      workloadPct:        member.workloadPct,
      blocked:            !!member.blocked,

      // Email / phone / Teams aren't on AuditMember today. If you add them
      // to AuditMember, plumb them through here.
      email:              undefined,
      phone:              undefined,
      teamsZoomId:        undefined,

      // Reporting context from the tree
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
    };
  }
  /* ============================================================
   *  AuditMember ↔ NewMemberFormModel mapping
   * ============================================================ */

  /** AuditMember → Partial<NewMemberFormModel> for the edit drawer. */
  private auditMemberToFormModel(member: AuditMember): Partial<NewMemberFormModel> {
    // Drop expertise values the modal doesn't recognise (it's a closed enum)
    const expertise = (member.expertise ?? []).filter(
      (e): e is Expertise => (ALL_EXPERTISE as readonly string[]).includes(e),
    );

    return {
      fullName:          member.name,
      designation:       this.designationCodeFromTitle(member.title),
      yearsOfExperience: member.experience,
      expertise,
      // email/phone/etc. are not on AuditMember — leave undefined so the form
      // shows them as empty placeholders.
    };
  }

  /** Build the "Link Existing" picker payload from the current tree. */
  private toExistingMemberDtos(): ExistingMember[] {
    return this.flatMembers().map(m => ({
      id: m.id,
      name: m.name,
      designation: m.title,
      yearsOfExperience: m.experience,
      expertise: m.expertise.join(', '),
      workloadPct: m.workloadPct,
      avatarUrl: m.avatarUrl,
    }));
  }

  /** Display title (Audit Manager) → select code (audit-manager). */
  private designationCodeFromTitle(title: string): string {
    return DESIGNATION_CODE_BY_TITLE[title] ?? '';
  }

  /** Select code (audit-manager) → display title (Audit Manager). */
  private designationLabelFromCode(code: string): string {
    return DESIGNATION_LABEL_BY_CODE[code] ?? code;
  }

  /* ---------------- Helpers for template --- */

  tierClass(tier?: RiskTier): string {
    return tier ? `tier-${tier}` : '';
  }

  workloadTier(pct: number): WorkloadTier {
    if (pct >= WORKLOAD_THRESHOLDS.High) return WorkloadTiers.High;
    if (pct >= WORKLOAD_THRESHOLDS.Mid) return WorkloadTiers.Mid;
    return WorkloadTiers.Low;
  }

  isValidDropTarget(targetId: string): boolean {
    const draggingId = this.draggingId();
    if (!draggingId) return false;
    if (draggingId === targetId) return false;
    const draggedNode = findNode(this.tree(), draggingId);
    if (!draggedNode) return false;
    return !containsId(draggedNode, targetId);
  }

  trackById = (_: number, m: AuditMember) => m.id;

  trackByRow = (_: number, row: TreeListRow) => row.member.id;

  /* ---------------- Mock tree -------------- */

  private buildMockTree(): AuditTreeNode {
    const m = (data: AuditMember, children: AuditTreeNode[] = []): AuditTreeNode => ({
      data,
      expanded: true,
      children,
    });

    return m(
      {
        id: 'cae-1',
        name: 'Sarah Johnson',
        title: 'CAE',
        role: AuditRoles.CAE,
        experience: 15,
        expertise: ['Finance', 'Operations'],
        workloadPct: 85,
        region: 'AE',
        avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
        badge: { label: 'C', tier: RiskTiers.Critical },
      },
      [
        m(
          {
            id: 'mgr-1',
            name: 'Michael Chen',
            title: 'Audit Manager',
            role: AuditRoles.AuditManager,
            experience: 15,
            expertise: ['Finance', 'Operations'],
            workloadPct: 80,
            region: 'AE',
            avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
            badge: { label: 'M', tier: RiskTiers.Medium },
          },
          [
            m({
              id: 'sr-1', name: 'Ioni Bowcher', title: 'Senior Auditor',
              role: AuditRoles.SeniorAuditor, experience: 8,
              expertise: ['AML', 'Treasury'], workloadPct: 70, region: 'AE',
              avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
              badge: { label: 'S', tier: RiskTiers.Low },
            }, [
              m({
                id: 'st-1', name: 'Xu Xuefeng', title: 'Staff Auditor',
                role: AuditRoles.StaffAuditor, experience: 3,
                expertise: ['Finance'], workloadPct: 40, region: 'AE',
                avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
                badge: { label: 'A', tier: RiskTiers.Low },
              }),
            ]),
          ],
        ),
        m(
          {
            id: 'mgr-2',
            name: 'Anna Fali',
            title: 'Audit Manager',
            role: AuditRoles.AuditManager,
            experience: 15,
            expertise: ['Finance', 'Operations'],
            workloadPct: 95,
            region: 'AE',
            avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
            badge: { label: 'H', tier: RiskTiers.High },
          },
          [
            m({
              id: 'sr-2', name: 'Bernardo Dominic', title: 'Senior Auditor',
              role: AuditRoles.SeniorAuditor, experience: 9,
              expertise: ['IT', 'Operations'], workloadPct: 60, region: 'AE',
              avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
              badge: { label: 'S', tier: RiskTiers.Medium },
            }),
          ],
        ),
        m(
          {
            id: 'mgr-3',
            name: 'Stephen Shaw',
            title: 'Audit Manager',
            role: AuditRoles.AuditManager,
            experience: 15,
            expertise: ['Finance', 'Operations'],
            workloadPct: 65,
            region: 'SA',
            avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
            badge: { label: 'L', tier: RiskTiers.Low },
          },
          [
            m({
              id: 'sr-3', name: 'Asiya Javayant', title: 'Senior Auditor',
              role: AuditRoles.SeniorAuditor, experience: 7,
              expertise: ['HR'], workloadPct: 55, region: 'SA',
              avatarUrl: DEFAULT_MEMBER_AVATAR_URL,
              badge: { label: 'S', tier: RiskTiers.Low },
            }),
          ],
        ),
      ],
    );
  }
}
 
/* ============================================================
 *  Tree helpers (pure)
 * ============================================================ */

function cloneTree(tree: AuditTreeNode[]): AuditTreeNode[] {
  const cloneNode = (n: AuditTreeNode): AuditTreeNode => ({
    ...n,
    data: n.data ? { ...n.data } : undefined,
    children: (n.children ?? []).map(cloneNode),
  });
  return tree.map(cloneNode);
}

function findNode(
  tree: AuditTreeNode[],
  id: string,
): AuditTreeNode | null {
  for (const n of tree) {
    if (n.data?.id === id) return n;
    const inChild = findNode(n.children ?? [], id);
    if (inChild) return inChild;
  }
  return null;
}

function findParent(
  tree: AuditTreeNode[],
  id: string,
  parent: AuditTreeNode | null = null,
): AuditTreeNode | null {
  for (const n of tree) {
    if (n.data?.id === id) return parent;
    const inChild = findParent(n.children ?? [], id, n);
    if (inChild) return inChild;
  }
  return null;
}

function containsId(root: AuditTreeNode, id: string): boolean {
  if (root.data?.id === id) return true;
  return (root.children ?? []).some(c => containsId(c, id));
}