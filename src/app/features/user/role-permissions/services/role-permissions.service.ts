import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { UserRole, PermType, ModulePerms, Perm } from '../manage/role-permissions.component';

/* ── Payload types ───────────────────────────────────────────────────────── */

export interface CreateRolePayload {
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  modules: ModulePerms[];
}

export interface SavePermissionsPayload {
  modules: { module: string; perms: Record<string, boolean> }[];
}

export interface AddPermTypePayload {
  key: string;
  label: string;
}

/*
 * ── Expected .NET Web API contract ────────────────────────────────────────
 *
 * GET    /api/roles                  → UserRole[]
 * POST   /api/roles                  → UserRole        (CreateRolePayload)
 * DELETE /api/roles/{id}             → 204
 * PUT    /api/roles/{id}/perms       → 204             (SavePermissionsPayload)
 *
 * GET    /api/perm-types             → PermType[]
 * POST   /api/perm-types             → PermType        (AddPermTypePayload)
 * DELETE /api/perm-types/{key}       → 204
 * ─────────────────────────────────────────────────────────────────────────
 */

/* ══════════════════════════════════════════════════════════════════════════
 *  MOCK DATA — set USE_MOCK = false when your .NET API is ready
 * ══════════════════════════════════════════════════════════════════════════ */

const USE_MOCK = true;

/* ── Permission types ───────────────────────────────────────────────────── */

const MOCK_PERM_TYPES: PermType[] = [
  { key: 'view',        label: 'View',        isCore: true  },
  { key: 'create',      label: 'Create',      isCore: true  },
  { key: 'edit',        label: 'Edit',        isCore: true  },
  { key: 'delete',      label: 'Delete',      isCore: true  },
  { key: 'preparer',    label: 'Preparer',    isCore: false },
  { key: 'reviewer_l1', label: 'Reviewer L1', isCore: false },
  { key: 'reviewer_l2', label: 'Reviewer L2', isCore: false },
  { key: 'reviewer_l3', label: 'Reviewer L3', isCore: false },
];

const ALL_KEYS = MOCK_PERM_TYPES.map(pt => pt.key);

function p(...trueKeys: string[]): Perm {
  return Object.fromEntries(ALL_KEYS.map(k => [k, trueKeys.includes(k)]));
}
function FULL(): Perm { return Object.fromEntries(ALL_KEYS.map(k => [k, true])); }
function NONE(): Perm { return Object.fromEntries(ALL_KEYS.map(k => [k, false])); }

function makeModules(
  dash: Perm, audits: Perm, findings: Perm,
  rfi: Perm, staff: Perm, compliance: Perm,
  reports: Perm, settings: Perm,
): ModulePerms[] {
  return [
    { module: 'Dashboard',        icon: 'pi pi-home',               perms: dash       },
    { module: 'Audits',           icon: 'pi pi-file-check',         perms: audits     },
    { module: 'Findings',         icon: 'pi pi-exclamation-circle', perms: findings   },
    { module: 'RFI',              icon: 'pi pi-file',               perms: rfi        },
    { module: 'Staff Management', icon: 'pi pi-users',              perms: staff      },
    { module: 'Compliance',       icon: 'pi pi-shield',             perms: compliance },
    { module: 'Reports',          icon: 'pi pi-chart-bar',          perms: reports    },
    { module: 'Settings',         icon: 'pi pi-cog',                perms: settings   },
  ];
}

const MOCK_ROLES: UserRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access — all modules, all actions.',
    userCount: 2,
    color: '#7c3aed',
    isSystem: true,
    modules: makeModules(FULL(), FULL(), FULL(), FULL(), FULL(), FULL(), FULL(), FULL()),
  },
  {
    id: 'audit-manager',
    name: 'Audit Manager',
    description: 'Manages audits, reviews findings and oversees team.',
    userCount: 5,
    color: '#1d4ed8',
    isSystem: false,
    modules: makeModules(
      p('view'),
      p('view', 'create', 'edit', 'delete', 'reviewer_l1', 'reviewer_l2'),
      p('view', 'create', 'edit', 'reviewer_l1', 'reviewer_l2'),
      p('view', 'create', 'edit', 'reviewer_l1'),
      p('view', 'create', 'edit'),
      p('view'),
      p('view'),
      NONE(),
    ),
  },
  {
    id: 'senior-auditor',
    name: 'Senior Auditor',
    description: 'Creates and edits audits and findings.',
    userCount: 8,
    color: '#0891b2',
    isSystem: false,
    modules: makeModules(
      p('view'),
      p('view', 'create', 'edit', 'preparer', 'reviewer_l1'),
      p('view', 'create', 'edit', 'preparer', 'reviewer_l1'),
      p('view', 'create', 'preparer'),
      p('view'),
      p('view'),
      p('view'),
      NONE(),
    ),
  },
  {
    id: 'staff-auditor',
    name: 'Staff Auditor',
    description: 'Executes assigned audit tasks and logs findings.',
    userCount: 14,
    color: '#059669',
    isSystem: false,
    modules: makeModules(
      p('view'),
      p('view', 'edit', 'preparer'),
      p('view', 'create', 'edit', 'preparer'),
      p('view'),
      p('view'),
      p('view'),
      p('view'),
      NONE(),
    ),
  },
  {
    id: 'read-only',
    name: 'Read Only',
    description: 'View-only access across all permitted modules.',
    userCount: 6,
    color: '#64748b',
    isSystem: false,
    modules: makeModules(
      p('view'), p('view'), p('view'), p('view'),
      p('view'), p('view'), p('view'), NONE(),
    ),
  },
];

/* ── In-memory store (only used when USE_MOCK = true) ────────────────────── */

let _roles     = MOCK_ROLES.map(r => ({ ...r, modules: r.modules.map(m => ({ ...m, perms: { ...m.perms } })) }));
let _permTypes = [...MOCK_PERM_TYPES];

/* ── Service ─────────────────────────────────────────────────────────────── */

@Injectable({ providedIn: 'root' })
export class RolePermissionsService {

  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  /* ── Roles ────────────────────────────────────────────────────────────── */

  getRoles(): Observable<UserRole[]> {
    if (USE_MOCK) return of([..._roles]).pipe(delay(300));
    return this.http.get<UserRole[]>(`${this.base}/roles`);
  }

  createRole(payload: CreateRolePayload): Observable<UserRole> {
    if (USE_MOCK) {
      const created: UserRole = {
        ...payload,
        id: 'role-' + Date.now(),
        userCount: 0,
      };
      _roles = [..._roles, created];
      return of(created).pipe(delay(200));
    }
    return this.http.post<UserRole>(`${this.base}/roles`, payload);
  }

  deleteRole(id: string): Observable<void> {
    if (USE_MOCK) {
      _roles = _roles.filter(r => r.id !== id);
      return of(undefined).pipe(delay(200));
    }
    return this.http.delete<void>(`${this.base}/roles/${id}`);
  }

  savePermissions(roleId: string, payload: SavePermissionsPayload): Observable<void> {
    if (USE_MOCK) {
      _roles = _roles.map(r =>
        r.id !== roleId ? r : {
          ...r,
          modules: r.modules.map(m => {
            const updated = payload.modules.find(p => p.module === m.module);
            return updated ? { ...m, perms: { ...updated.perms } } : m;
          }),
        },
      );
      return of(undefined).pipe(delay(300));
    }
    return this.http.put<void>(`${this.base}/roles/${roleId}/perms`, payload);
  }

  /* ── Permission types ─────────────────────────────────────────────────── */

  getPermTypes(): Observable<PermType[]> {
    if (USE_MOCK) return of([..._permTypes]).pipe(delay(300));
    return this.http.get<PermType[]>(`${this.base}/perm-types`);
  }

  addPermType(payload: AddPermTypePayload): Observable<PermType> {
    if (USE_MOCK) {
      const created: PermType = { ...payload, isCore: false };
      _permTypes = [..._permTypes, created];
      return of(created).pipe(delay(200));
    }
    return this.http.post<PermType>(`${this.base}/perm-types`, payload);
  }

  removePermType(key: string): Observable<void> {
    if (USE_MOCK) {
      _permTypes = _permTypes.filter(pt => pt.key !== key);
      return of(undefined).pipe(delay(200));
    }
    return this.http.delete<void>(`${this.base}/perm-types/${key}`);
  }
}