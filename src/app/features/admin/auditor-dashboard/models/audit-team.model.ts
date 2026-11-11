export type AuditTeamMemberStatus = 'active' | 'pending';

export interface AuditTeamMember {
    id: string;
    name: string;
    role: string;
    initials: string;
    designation: string;
    status: AuditTeamMemberStatus;
}
