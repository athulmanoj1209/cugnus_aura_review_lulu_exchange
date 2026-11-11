import type { AuditTeamMember } from '../models/audit-team.model';

export const 

AUDIT_TEAM = {
    leadId: 'alice',
    members: [
        {
            id: 'bob',
            name: 'Bob Smith',
            role: 'Senior Auditor',
            initials: 'BS',
            designation: 'Senior Auditor',
            status: 'active',
        },
        {
            id: 'alice',
            name: 'Alice Johnson',
            role: 'Audit Lead',
            initials: 'AJ',
            designation: 'Audit Lead',
            status: 'active',
        },
        {
            id: 'carol',
            name: 'Carol White',
            role: 'Audit Manager',
            initials: 'CW',
            designation: 'Audit Manager',
            status: 'active',
        },
        {
            id: 'david',
            name: 'David Lee',
            role: 'Audit Specialist',
            initials: 'DL',
            designation: 'Audit Specialist',
            status: 'active',
        },
        {
            id: 'emma',
            name: 'Emma Davis',
            role: 'Compliance Auditor',
            initials: 'ED',
            designation: 'Compliance Auditor',
            status: 'active',
        },
    ] satisfies readonly AuditTeamMember[],
} as const;

export function getAuditTeamMembers(): readonly AuditTeamMember[] {
    return AUDIT_TEAM.members;
}

export function getAuditTeamMember(id: string): AuditTeamMember | undefined {
    return AUDIT_TEAM.members.find(member => member.id === id);
}
