import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditorAssignment, AuditorUser } from '@/app/features/audits/audit-execution/auditor-assignment/manage/auditor-assignment.component';
import { AUDITOR_ASSIGNMENT_API, type AssignmentType } from '../constants/auditor-assignment.constants';



export interface CreateAssignmentPayload {
  scope: string;
  type: AssignmentType;
  auditorId: number;
}

@Injectable({ providedIn: 'root' })
export class AuditorAssignmentService {
  private readonly base      = AUDITOR_ASSIGNMENT_API.Assignments;
  private readonly usersBase = AUDITOR_ASSIGNMENT_API.Users;

  constructor(private http: HttpClient) {}

  /** GET all available auditor users (for dropdowns) */
  getAuditors(): Observable<AuditorUser[]> {
    return this.http.get<AuditorUser[]>(`${this.usersBase}/${AUDITOR_ASSIGNMENT_API.AuditorsPath}`);
  }

  /** GET all existing assignments for a scope (returns flat list with type field) */
  getByScope(scope: string): Observable<AuditorAssignment[]> {
    return this.http.get<AuditorAssignment[]>(`${this.base}`, { params: { scope } });
  }

  /** POST create a new preparer or reviewer assignment */
  create(payload: CreateAssignmentPayload): Observable<AuditorAssignment> {
    return this.http.post<AuditorAssignment>(`${this.base}`, payload);
  }

  /** DELETE an existing assignment */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}