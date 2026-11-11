/** Permission keys available in the role-permission matrix. */
export const RolePermissionTypes = {
  View: 'view',
  Create: 'create',
  Edit: 'edit',
  Delete: 'delete',
  Preparer: 'preparer',
  ReviewerL1: 'reviewer_l1',
  ReviewerL2: 'reviewer_l2',
  ReviewerL3: 'reviewer_l3'
} as const;
export type RolePermissionType = (typeof RolePermissionTypes)[keyof typeof RolePermissionTypes];

export const ROLE_PERMISSION_CORE_TYPES: RolePermissionType[] = [
  RolePermissionTypes.View,
  RolePermissionTypes.Create,
  RolePermissionTypes.Edit,
  RolePermissionTypes.Delete
];

export const ROLE_PERMISSION_CUSTOM_TYPES: RolePermissionType[] = [
  RolePermissionTypes.Preparer,
  RolePermissionTypes.ReviewerL1,
  RolePermissionTypes.ReviewerL2,
  RolePermissionTypes.ReviewerL3
];

export const ROLE_PERMISSION_API_ENDPOINTS = {
  Roles: '/api/roles',
  PermissionTypes: '/api/perm-types'
} as const;

export const ROLE_PERMISSION_DEFAULTS = {
  UseMockData: true,
  NewRoleColor: '#378ADD',
  NewRoleIsSystem: false
} as const;

export const ROLE_PERMISSION_MODULES = [
  'Dashboard',
  'Audits',
  'Findings',
  'RFI',
  'Staff',
  'Compliance',
  'Reports',
  'Settings'
] as const;

