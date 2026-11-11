import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CLIENT_MODE_VALUE } from '@/app/core/config/client-mode';
import { ORG_STATIC_DATA_INTERNAL_AUDIT } from '@/app/features/audits/Org-data-internal-audit';

/* ============================================================
 *  Models
 * ============================================================ */

export type UserRole = 'admin' | 'manager' | 'auditor' | 'viewer';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'deleted';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  company?: string;
  division?: string;
  subDivision?: string;
  avatarUrl?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  twoFactorEnabled?: boolean;
  /** Set when the user is soft-deleted (status moves to 'deleted'). */
  deletedAt?: Date;

  // ---- Extended profile fields ---------------------------------
  /** Job title — display title separate from the platform role. */
  designation?: string;
  /** Corporate identifier (often the HR system bridge). */
  employeeId?: string;
  /** Date the user joined the organisation. */
  joiningDate?: Date;
  /** Office location / branch — "Dubai HQ", "Riyadh Branch", etc. */
  location?: string;
  /** Audit areas of expertise — same enum used by audit team members. */
  expertise?: string[];

  // ---- Reporting hierarchy -------------------------------------
  /** Id of the user this person reports to (manager). */
  reportsToId?: string;


  /**
   * Optional denormalised manager block — populated by the caller
   * (list page) before opening the profile drawer. Saves the profile
   * component from having to do its own lookup.
   */
  reportsTo?: {
    id: string;
    fullName: string;
    designation?: string;
    avatarUrl?: string;
  };
}

/** Payload from the Add/Edit User form. */
export interface UserFormModel {
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  subDivision?: string;
  status: UserStatus;
  twoFactorEnabled: boolean;
  sendInvitation?: boolean;

  // ---- Extended profile fields ---------------------------------
  designation?: string;
  employeeId?: string;
  joiningDate?: Date | null;
  location?: string;
  expertise?: string[];
  reportsToId?: string | null;
  username?:string | null;
  password?:string | null;
  company?:string | null;
  division?:string | null;
}

/* ============================================================
 *  Service
 *
 *  Mock now, HTTP later. Each method has the swap-in equivalent
 *  commented above it. Component callers don't change.
 * ============================================================ */

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly http = inject(HttpClient);

  /**
   * Single in-memory store. We use a signal so list/page views that
   * derive from it via toSignal() (or direct read) react to mutations
   * without us having to manage a Subject manually.
   */
  private readonly _users = signal<User[]>(seedUsers(MOCK_USERS));

  /* ---------------- Reads ---------------- */

  /**
   * Returns the non-deleted users. Pass `{ includeDeleted: true }` to
   * include soft-deleted records (e.g. for a Trash view).
   */
  getAll(opts: { includeDeleted?: boolean } = {}): Observable<User[]> {
    // -------- PROD --------
    // return this.http.get<User[]>(
    //   `/api/users${opts.includeDeleted ? '?includeDeleted=true' : ''}`);
    // ----------------------
    const list = opts.includeDeleted
      ? this._users()
      : this._users().filter(u => u.status !== 'deleted');
    return of(list).pipe(delay(150));
  }

  getById(id: string): Observable<User | null> {
    // -------- PROD --------
    // return this.http.get<User>(`/api/users/${id}`);
    // ----------------------
    const found = this._users().find(u => u.id === id);
    if (!found) return throwError(() => new Error(`User ${id} not found`));
    return of(found).pipe(delay(150));
  }

  /* ---------------- Writes ---------------- */

  create(form: UserFormModel): Observable<User> {
    // -------- PROD --------
    // return this.http.post<User>('/api/users', stripNulls(form));
    // ----------------------
    const clean = stripNulls(form);
    const user: User = {
      id: crypto.randomUUID(),
      fullName:         clean.fullName,
      email:            clean.email,
      phone:            clean.phone,
      role:             clean.role,
      status:           clean.status,
      company:          clean.company,
      division:         clean.division,
      subDivision:      clean.subDivision,
      twoFactorEnabled: !!clean.twoFactorEnabled,
      avatarUrl:        DEFAULT_AVATAR,
      createdAt:        new Date(),

      // ---- extended fields ----
      designation:      clean.designation,
      employeeId:       clean.employeeId,
      joiningDate:      clean.joiningDate,
      location:         clean.location,
      expertise:        clean.expertise,
      reportsToId:      clean.reportsToId,
    };
    this._users.update(list => [user, ...list]);
    return of(user).pipe(delay(150));
  }

  update(id: string, patch: Partial<UserFormModel>): Observable<User> {
    // -------- PROD --------
    // return this.http.patch<User>(`/api/users/${id}`, stripNulls(patch));
    // ----------------------
    const clean = stripNulls(patch);
    let updated: User | undefined;
    this._users.update(list =>
      list.map(u => {
        if (u.id !== id) return u;
        updated = { ...u, ...clean };
        return updated;
      }),
    );
    if (!updated) return throwError(() => new Error(`User ${id} not found`));
    return of(updated).pipe(delay(150));
  }

  /**
   * Soft delete — moves the user to status:'deleted' and records the
   * deletedAt timestamp. Reversible via restore(id).
   */
  delete(id: string): Observable<void> {
    // -------- PROD --------
    // return this.http.delete<void>(`/api/users/${id}`);  // backend handles soft vs hard
    // ----------------------
    this._users.update(list =>
      list.map(u =>
        u.id === id
          ? { ...u, status: 'deleted', deletedAt: new Date() }
          : u,
      ),
    );
    return of(undefined).pipe(delay(150));
  }

  restore(id: string): Observable<User> {
    // -------- PROD --------
    // return this.http.post<User>(`/api/users/${id}/restore`, {});
    // ----------------------
    let restored: User | undefined;
    this._users.update(list =>
      list.map(u => {
        if (u.id !== id) return u;
        restored = { ...u, status: 'active', deletedAt: undefined };
        return restored;
      }),
    );
    if (!restored) return throwError(() => new Error(`User ${id} not found`));
    return of(restored).pipe(delay(150));
  }

  /** Convenience method — flip a user's status to active or suspended. */
  setStatus(id: string, status: UserStatus): Observable<User> {
    return this.update(id, { status });
  }

  /* ---------------- Invitation flow ---------------- */

  /**
   * Triggers (re-)sending an invitation email. In the mock this is a
   * no-op; the real endpoint would generate a one-time setup link.
   */
  sendInvitation(id: string): Observable<void> {
    // -------- PROD --------
    // return this.http.post<void>(`/api/users/${id}/invitations`, {});
    // ----------------------
    console.info('[mock] invitation sent to user', id);
    return of(undefined).pipe(delay(200));
  }
}

/* ============================================================
 *  Helpers
 * ============================================================ */

/**
 * Strip `null` values from the form payload before merging into the
 * domain model. Angular form controls hold `null` after a reset, but
 * the User type only allows `undefined` for optional fields — so
 * `{ ...user, ...patch }` will fail type-check when patch contains
 * nulls. This collapses those nulls into undefined at both runtime
 * and the type level.
 *
 * NB: a `null` here means "the user cleared this field", which on the
 * domain side translates to "field not set". If you ever need to
 * distinguish "cleared" from "not provided" (e.g. for PATCH semantics
 * against an HTTP backend), swap this for an explicit map and send
 * `null` to the API instead.
 */
type WithoutNulls<T> = { [K in keyof T]: Exclude<T[K], null> };

function stripNulls<T extends object>(obj: T): WithoutNulls<T> {
  const out = {} as WithoutNulls<T>;
  (Object.keys(obj) as (keyof T)[]).forEach(k => {
    const v = obj[k];
    out[k] = (v === null ? undefined : v) as WithoutNulls<T>[typeof k];
  });
  return out;
}

/* ============================================================
 *  Mock dataset
 * ============================================================ */

const AV = (n: string) =>
  `images/avatars/default-avatar.jpg`;
const DEFAULT_AVATAR = AV('images/avatars/default-avatar.jpg');

const days = (n: number) => new Date(Date.now() - n * 24 * 3600 * 1000);

const MOCK_USERS: User[] = [
  {
    id: 'u1', fullName: 'Sarah Johnson', email: 'sarah.j@cygnus.ae',
    phone: '+971 50 110 0022', role: 'admin', status: 'active',
    subDivision: 'Executive', avatarUrl: DEFAULT_AVATAR,
    lastLoginAt: days(0), createdAt: days(820), twoFactorEnabled: true,
    designation: 'Chief Audit Executive', employeeId: 'EMP-001',
    joiningDate: days(820), location: 'Dubai HQ',
    expertise: ['Finance', 'Operations', 'Treasury'],
    // root of the org tree — no reportsToId
  },
  {
    id: 'u2', fullName: 'Michael Chen', email: 'michael.chen@cygnus.ae',
    phone: '+971 55 222 3344', role: 'manager', status: 'active',
    subDivision: 'Audit', avatarUrl: DEFAULT_AVATAR,
    lastLoginAt: days(1), createdAt: days(540), twoFactorEnabled: true,
    designation: 'Audit Manager', employeeId: 'EMP-002',
    joiningDate: days(540), location: 'Dubai HQ',
    expertise: ['AML', 'Treasury'], reportsToId: 'u1',
  },
  {
    id: 'u3', fullName: 'Amy Elsner', email: 'amy.elsner@cygnus.ae',
    phone: '+971 50 333 4455', role: 'manager', status: 'active',
    subDivision: 'Risk', avatarUrl: DEFAULT_AVATAR,
    lastLoginAt: days(2), createdAt: days(420), twoFactorEnabled: true,
    designation: 'Risk Manager', employeeId: 'EMP-003',
    joiningDate: days(420), location: 'Dubai HQ',
    expertise: ['Finance', 'HR'], reportsToId: 'u1',
  },
  {
    id: 'u4', fullName: 'Ioni Bowcher', email: 'ioni.b@cygnus.ae',
    phone: '+971 56 411 5566', role: 'auditor', status: 'active',
    subDivision: 'Audit', avatarUrl: AV('ionibowcher'),
    lastLoginAt: days(3), createdAt: days(310), twoFactorEnabled: false,
    designation: 'Senior Auditor', employeeId: 'EMP-004',
    joiningDate: days(310), location: 'Dubai HQ',
    expertise: ['AML', 'Treasury'], reportsToId: 'u2',
  },
  {
    id: 'u5', fullName: 'Asiya Javayant', email: 'asiya.j@cygnus.ae',
    phone: '+971 55 999 8877', role: 'auditor', status: 'active',
    subDivision: 'Audit', avatarUrl: AV('asiyajavayant'),
    lastLoginAt: days(5), createdAt: days(260), twoFactorEnabled: false,
    designation: 'Auditor', employeeId: 'EMP-005',
    joiningDate: days(260), location: 'Abu Dhabi Branch',
    expertise: ['IT', 'Operations'], reportsToId: 'u2',
  },
  {
    id: 'u6', fullName: 'Bernardo Dominic', email: 'bernardo.d@cygnus.ae',
    role: 'auditor', status: 'pending', avatarUrl: AV('bernardodominic'),
    createdAt: days(3), twoFactorEnabled: true,
    designation: 'Auditor', employeeId: 'EMP-006',
    location: 'Dubai HQ',
    expertise: ['IT'], reportsToId: 'u2',
  },
  {
    id: 'u7', fullName: 'Xu Xuefeng', email: 'xu.x@cygnus.ae',
    phone: '+971 55 100 2030', role: 'auditor', status: 'active',
    subDivision: 'IT Audit', avatarUrl: AV('xuxuefeng'),
    lastLoginAt: days(7), createdAt: days(180), twoFactorEnabled: false,
    designation: 'IT Auditor', employeeId: 'EMP-007',
    joiningDate: days(180), location: 'Dubai HQ',
    expertise: ['IT'], reportsToId: 'u3',
  },
  {
    id: 'u8', fullName: 'Stephen Shaw', email: 'stephen.s@cygnus.ae',
    phone: '+966 50 555 6677', role: 'viewer', status: 'active',
    subDivision: 'Compliance', avatarUrl: AV('stephenshaw'),
    lastLoginAt: days(14), createdAt: days(120), twoFactorEnabled: false,
    designation: 'Compliance Analyst', employeeId: 'EMP-008',
    joiningDate: days(120), location: 'Riyadh Branch',
    expertise: ['Finance'], reportsToId: 'u3',
  },
  {
    id: 'u9', fullName: 'Anna Fali', email: 'anna.f@cygnus.ae',
    phone: '+974 33 220 1100', role: 'viewer', status: 'suspended',
    subDivision: 'External', avatarUrl: AV('annafali'),
    lastLoginAt: days(90), createdAt: days(220), twoFactorEnabled: false,
    designation: 'External Auditor', employeeId: 'EMP-009',
    joiningDate: days(220), location: 'Doha Office',
    expertise: ['HR'], reportsToId: 'u3',
  },
  {
    id: 'u10', fullName: 'Elwin Sharvill', email: 'elwin.s@cygnus.ae',
    role: 'viewer', status: 'pending', avatarUrl: AV('elwinsharvill'),
    createdAt: days(1), twoFactorEnabled: false,
    designation: 'Junior Auditor', employeeId: 'EMP-010',
    location: 'Dubai HQ',
    expertise: ['Operations'], reportsToId: 'u2',
  },
  {
    id: 'u11', fullName: 'Ivan Magalhaes', email: 'ivan.m@cygnus.ae',
    phone: '+968 92 113 2233', role: 'auditor', status: 'active',
    subDivision: 'Audit', avatarUrl: AV('ivanmagalhaes'),
    lastLoginAt: days(4), createdAt: days(95), twoFactorEnabled: true,
    designation: 'Auditor', employeeId: 'EMP-011',
    joiningDate: days(95), location: 'Muscat Office',
    expertise: ['IT', 'Operations'], reportsToId: 'u12',
  },
  {
    id: 'u12', fullName: 'Onyama Limba', email: 'onyama.l@cygnus.ae',
    phone: '+966 54 322 1100', role: 'manager', status: 'active',
    subDivision: 'Audit', avatarUrl: AV('onyamalimba'),
    lastLoginAt: days(2), createdAt: days(60), twoFactorEnabled: true,
    designation: 'Senior Audit Manager', employeeId: 'EMP-012',
    joiningDate: days(60), location: 'Riyadh Branch',
    expertise: ['AML', 'Treasury', 'HR'], reportsToId: 'u1',
  },
];
/* ── Internal-audit mode ──────────────────────────────────────────────
 * MOCK_USERS' generic sub-divisions ('Executive', 'Audit', 'Risk', ...)
 * and missing company/division don't exist in the internal-audit org, so
 * the Users list's Company/Division/Sub-division filters and the Add/Edit
 * User drawer never matched them. Cycle each user through the ACTIVE
 * internal-audit org's real company → division → sub-division combos from
 * the static org file — same approach as member-list.component.ts. */
const INTERNAL_AUDIT_USER_ORG_COMBOS: Pick<User, 'company' | 'division' | 'subDivision'>[] =
  CLIENT_MODE_VALUE !== 'internal-audit' ? [] :
  ORG_STATIC_DATA_INTERNAL_AUDIT.flatMap(c => c.divisions.flatMap(b => b.subDivisions.map(d => ({
    company: c.companyName, division: b.divisionName, subDivision: d.subDivisionName,
  }))));

function seedUsers(users: User[]): User[] {
  if (!INTERNAL_AUDIT_USER_ORG_COMBOS.length) return [...users];
  return users.map((u, i) => ({ ...u, ...INTERNAL_AUDIT_USER_ORG_COMBOS[i % INTERNAL_AUDIT_USER_ORG_COMBOS.length] }));
}
