/** Validation messages for the applicable-framework form. */
export const APPLICABLE_FRAMEWORK_ERROR_MESSAGES = {
  name: { required: 'Framework name is required.', minlength: 'Minimum 2 characters required.' },
  code: { required: 'Code is required.', pattern: 'Code must contain only uppercase letters, numbers, and hyphens.' },
  version: { required: 'Version is required.', pattern: 'Version must be a valid version format.' },
  authority: { required: 'Issuing authority is required.' },
} as const;
