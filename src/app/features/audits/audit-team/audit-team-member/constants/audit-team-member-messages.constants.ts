/* ── User-facing text for the audit team member module ────────────────── */

export const MEMBER_TOAST_MESSAGES = {
  Added: $localize`:@@audit.auditTeam.memberAdded:New member has been successfully added.`,
  Updated: $localize`:@@audit.auditTeam.memberUpdated:Member details have been successfully updated.`,
  Linked: $localize`:@@audit.auditTeam.memberLinked:Existing member has been successfully linked.`,
  LinkedTitle: $localize`:@@audit.auditTeam.memberLinkedTitle:Member Linked`,
} as const;

export const MEMBER_DRAWER_TITLES = {
  Edit: $localize`:@@audit.auditTeam.editMember:Edit Member`,
  Link: $localize`:@@audit.auditTeam.linkExistingTeamMember:Link Existing Team Member`,
  Create: $localize`:@@audit.auditTeam.memberProfile:Member Profile`,
} as const;

export const MEMBER_DRAWER_SUBTITLES = {
  Edit: $localize`:@@audit.auditTeam.updateMemberDetails:Update member details`,
  Link: $localize`:@@audit.auditTeam.selectMemberToLinkSubtitle:Select a team member to link as a shared resource`,
  Create: $localize`:@@audit.auditTeam.registerNewMember:Register a new Member`,
} as const;

export const MEMBER_SUBMIT_LABELS = {
  Edit: $localize`:@@audit.auditTeam.saveChanges:Save changes`,
  Add: $localize`:@@audit.auditTeam.addMemberUppercase:ADD MEMBER`,
} as const;

/** Text of an active-filter chip, e.g. "Company: 2". */
export const memberFilterChipLabel = (prefix: string, count: number): string => $localize`:@@audit.auditTeam.memberFilterChip:${prefix}:prefix:: ${count}:count:`;
