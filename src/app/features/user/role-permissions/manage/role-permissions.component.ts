import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { forkJoin } from 'rxjs';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';

import {
  RolePermissionsService,
  CreateRolePayload,
  SavePermissionsPayload,
} from '../services/role-permissions.service';

/* ── Models ──────────────────────────────────────────────────────────────── */

export interface PermType {
  key: string;
  label: string;
  isCore: boolean;
}

export type Perm = Record<string, boolean>;

export interface ModulePerms {
  module: string;
  icon: string;
  perms: Perm;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  isSystem: boolean;
  modules: ModulePerms[];
}

/* ── Helper ──────────────────────────────────────────────────────────────── */

function cloneModules(src: ModulePerms[]): ModulePerms[] {
  return src.map(m => ({ ...m, perms: { ...m.perms } }));
}

function withInternalAuditRoles(roles: UserRole[]): UserRole[] {
  if (
    CLIENT_MODE_VALUE !== 'internal-audit' ||
    roles.some(role => role.name.toLowerCase() === 'assistant manager-audit')
  ) {
    return roles;
  }

  const permissionSource =
    roles.find(role => role.name.toLowerCase() === 'auditor') ??
    roles.find(role => /audit/i.test(role.name)) ??
    roles.at(-1);

  const assistantManagerAudit: UserRole = {
    id: 'assistant-manager-audit',
    name: 'Assistant Manager-Audit',
    description: $localize`:@@user.rolePermission.assistantManagerAuditDescription:Supports the Audit Manager in planning, supervising, reviewing, and reporting internal audit engagements.`,
    userCount: 0,
    color: '#0f766e',
    isSystem: false,
    modules: cloneModules(permissionSource?.modules ?? []),
  };

  return [...roles, assistantManagerAudit];
}

/* ── Component ───────────────────────────────────────────────────────────── */

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [
    BackButtonComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
  
    DrawIconComponent,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss'],
})
export class RolePermissionsComponent implements OnInit {

  private readonly svc        = inject(RolePermissionsService);
  private readonly destroyRef = inject(DestroyRef);

  /* ── Remote state ──────────────────────────────────────────────────── */

  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  /* ── App state ─────────────────────────────────────────────────────── */

  readonly permTypes  = signal<PermType[]>([]);
  readonly roles      = signal<UserRole[]>([]);
  readonly selectedId = signal<string>('');
  readonly isDirty    = signal(false);
  readonly savedId    = signal<string | null>(null);
  readonly grantAllLabel = $localize`:@@user.rolePermission.grantAll:Grant all`;
  readonly revokeAllLabel = $localize`:@@user.rolePermission.revokeAll:Revoke all`;
  readonly addRoleTitle = $localize`:@@user.rolePermission.addRoleTitle:Add New Role`;
  readonly deleteRoleTitle = $localize`:@@user.rolePermission.deleteRoleTitle:Delete Role`;
  readonly addPermissionTypeTitle = $localize`:@@user.rolePermission.addPermissionTypeTitle:Add Permission Type`;
  readonly loadRolesError = $localize`:@@user.rolePermission.loadRolesError:Failed to load roles. Please try again.`;
  readonly createRoleError = $localize`:@@user.rolePermission.createRoleError:Failed to create role.`;
  readonly deleteRoleError = $localize`:@@user.rolePermission.deleteRoleError:Failed to delete role.`;
  readonly addPermissionTypeError = $localize`:@@user.rolePermission.addPermissionTypeError:Failed to add permission type.`;
  readonly removePermissionTypeError = $localize`:@@user.rolePermission.removePermissionTypeError:Failed to remove permission type.`;
  readonly savePermissionsError = $localize`:@@user.rolePermission.savePermissionsError:Failed to save permissions.`;

  readonly selectedRole = computed(() =>
    this.roles().find(r => r.id === this.selectedId()) ?? null,
  );

  readonly allGranted = computed(() => {
    const role = this.selectedRole();
    if (!role) return false;
    const keys = this.permTypes().map(pt => pt.key);
    return role.modules.every(m => keys.every(k => m.perms[k]));
  });

  readonly allGrantedIndeterminate = computed(() => {
    const role = this.selectedRole();
    if (!role) return false;
    const keys    = this.permTypes().map(pt => pt.key);
    const total   = role.modules.length * keys.length;
    const granted = role.modules.reduce(
      (sum, m) => sum + keys.filter(k => m.perms[k]).length, 0,
    );
    return granted > 0 && granted < total;
  });

  /* ── Init ──────────────────────────────────────────────────────────── */

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      roles:     this.svc.getRoles(),
      permTypes: this.svc.getPermTypes(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ roles, permTypes }) => {
          const availableRoles = withInternalAuditRoles(roles);
          this.roles.set(availableRoles);
          this.permTypes.set(permTypes);
          this.selectedId.set(availableRoles[0]?.id ?? '');
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.loadRolesError);
          this.loading.set(false);
        },
      });
  }

  /* ── Add Role dialog ────────────────────────────────────────────────── */

  readonly showAddDialog = signal(false);
  newName        = '';
  newDescription = '';
  newCloneFrom: string | null = null;

  get cloneOptions() {
    return this.roles().map(r => ({ label: r.name, value: r.id }));
  }

  openAddDialog(): void {
    this.newName = '';
    this.newDescription = '';
    this.newCloneFrom = null;
    this.showAddDialog.set(true);
  }

  confirmAdd(): void {
    if (!this.newName.trim()) return;

    const src = this.newCloneFrom
      ? this.roles().find(r => r.id === this.newCloneFrom)
      : this.roles().at(-1);

    const modules = cloneModules(src?.modules ?? []).map(m => {
      const perms: Perm = { ...m.perms };
      this.permTypes().forEach(pt => {
        if (!(pt.key in perms)) perms[pt.key] = false;
      });
      return { ...m, perms };
    });

    const payload: CreateRolePayload = {
      name: this.newName.trim(),
      description: this.newDescription.trim(),
      color: '#475569',
      isSystem: false,
      modules,
    };

    this.loading.set(true);
    this.svc.createRole(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.roles.update(rs => [...rs, created]);
          this.selectedId.set(created.id);
          this.isDirty.set(false);
          this.showAddDialog.set(false);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.createRoleError);
          this.loading.set(false);
        },
      });
  }

  /* ── Delete confirm dialog ──────────────────────────────────────────── */

  readonly showDeleteConfirm = signal(false);
  private pendingDeleteId: string | null = null;

  openDeleteConfirm(id: string, ev: Event): void {
    ev.stopPropagation();
    this.pendingDeleteId = id;
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId;
    if (!id) return;

    this.loading.set(true);
    this.svc.deleteRole(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.roles.update(rs => rs.filter(r => r.id !== id));
          if (this.selectedId() === id) {
            this.selectedId.set(this.roles()[0]?.id ?? '');
          }
          this.isDirty.set(false);
          this.showDeleteConfirm.set(false);
          this.pendingDeleteId = null;
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.deleteRoleError);
          this.loading.set(false);
        },
      });
  }

  get pendingDeleteName(): string {
    return this.roles().find(r => r.id === this.pendingDeleteId)?.name ?? '';
  }

  /* ── Add Permission Type dialog ─────────────────────────────────────── */

  readonly showAddPermDialog = signal(false);
  newPermLabel = '';

  openAddPermDialog(): void {
    this.newPermLabel = '';
    this.showAddPermDialog.set(true);
  }

  confirmAddPerm(): void {
    const label = this.newPermLabel.trim();
    if (!label) return;

    const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (!key || this.permTypes().some(pt => pt.key === key)) return;

    this.loading.set(true);
    this.svc.addPermType({ key, label })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.permTypes.update(pts => [...pts, created]);
          // Add the new column to every role's modules (default false)
          this.roles.update(rs =>
            rs.map(r => ({
              ...r,
              modules: r.modules.map(m => ({
                ...m,
                perms: { ...m.perms, [created.key]: false },
              })),
            })),
          );
          this.newPermLabel = '';
          this.showAddPermDialog.set(false);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.addPermissionTypeError);
          this.loading.set(false);
        },
      });
  }

  removePermType(key: string): void {
    this.loading.set(true);
    this.svc.removePermType(key)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.permTypes.update(pts => pts.filter(pt => pt.key !== key));
          this.roles.update(rs =>
            rs.map(r => ({
              ...r,
              modules: r.modules.map(m => {
                const { [key]: _removed, ...rest } = m.perms;
                return { ...m, perms: rest };
              }),
            })),
          );
          this.isDirty.set(true);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.removePermissionTypeError);
          this.loading.set(false);
        },
      });
  }

  /* ── Local permission toggles (saved explicitly) ────────────────────── */

  selectRole(id: string): void {
    if (this.isDirty()) this.isDirty.set(false);
    this.selectedId.set(id);
  }

  togglePerm(moduleIdx: number, key: string): void {
    this.roles.update(rs =>
      rs.map(r => {
        if (r.id !== this.selectedId()) return r;
        const modules = cloneModules(r.modules);
        modules[moduleIdx].perms[key] = !modules[moduleIdx].perms[key];
        // Enforce: enabling create/edit/delete also enables view
        if (['create', 'edit', 'delete'].includes(key) && modules[moduleIdx].perms[key]) {
          modules[moduleIdx].perms['view'] = true;
        }
        return { ...r, modules };
      }),
    );
    this.isDirty.set(true);
  }

  allSelected(m: ModulePerms): boolean {
    const keys = this.permTypes().map(pt => pt.key);
    return keys.every(k => m.perms[k]);
  }

  isIndeterminate(m: ModulePerms): boolean {
    const keys  = this.permTypes().map(pt => pt.key);
    const count = keys.filter(k => m.perms[k]).length;
    return count > 0 && count < keys.length;
  }

  toggleAll(moduleIdx: number): void {
    this.roles.update(rs =>
      rs.map(r => {
        if (r.id !== this.selectedId()) return r;
        const modules = cloneModules(r.modules);
        const keys    = this.permTypes().map(pt => pt.key);
        const target  = !keys.every(k => modules[moduleIdx].perms[k]);
        keys.forEach(k => (modules[moduleIdx].perms[k] = target));
        return { ...r, modules };
      }),
    );
    this.isDirty.set(true);
  }

  grantAll(grant: boolean): void {
    this.roles.update(rs =>
      rs.map(r => {
        if (r.id !== this.selectedId()) return r;
        const modules = cloneModules(r.modules);
        const keys    = this.permTypes().map(pt => pt.key);
        modules.forEach(m => keys.forEach(k => (m.perms[k] = grant)));
        return { ...r, modules };
      }),
    );
    this.isDirty.set(true);
  }

  /** Persist the current permissions matrix to the API. */
  savePermissions(): void {
    const role = this.selectedRole();
    if (!role) return;

    const payload: SavePermissionsPayload = {
      modules: role.modules.map(m => ({ module: m.module, perms: m.perms })),
    };

    this.loading.set(true);
    this.svc.savePermissions(role.id, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isDirty.set(false);
          this.savedId.set(role.id);
          this.loading.set(false);
          setTimeout(() => this.savedId.set(null), 2000);
        },
        error: () => {
          this.error.set(this.savePermissionsError);
          this.loading.set(false);
        },
      });
  }

  /* ── Helpers ────────────────────────────────────────────────────────── */

  permCount(role: UserRole): number {
    const keys = this.permTypes().map(pt => pt.key);
    return role.modules.reduce(
      (sum, m) => sum + keys.filter(k => m.perms[k]).length,
      0,
    );
  }

  totalPossiblePerms(role: UserRole): number {
    return role.modules.length * this.permTypes().length;
  }

  initials(name: string): string {
    const words = name.trim().split(/\s+/);
    return words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  }

  dismissError(): void { this.error.set(null); }
  retryLoad():    void { this.loadData(); }

  trackById     = (_: number, r: UserRole)    => r.id;
  trackByModule = (_: number, m: ModulePerms) => m.module;
  trackByKey    = (_: number, pt: PermType)   => pt.key;
}