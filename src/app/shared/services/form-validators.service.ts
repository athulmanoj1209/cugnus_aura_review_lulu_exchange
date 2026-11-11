import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom reactive-form validators reused across the app.
 * Each validator returns `null` when the value is valid (or empty —
 * required-ness is handled separately by Validators.required).
 */

/* ----------------------------------------------------------------------
 * URL — accepts values with or without protocol (https:// optional).
 * -------------------------------------------------------------------- */
export const urlValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string | null = control.value;
  if (!value) return null;

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    // Require at least a dot in the hostname (rules out "https://abc")
    return /\.[a-z]{2,}$/i.test(url.hostname) ? null : { url: true };
  } catch {
    return { url: true };
  }
};

/* ----------------------------------------------------------------------
 * Phone — international-friendly. Accepts digits, spaces, dashes,
 * parens, and an optional leading +. Requires at least 7 digits.
 * -------------------------------------------------------------------- */
export const phoneValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string | null = control.value;
  if (!value) return null;

  const cleaned = value.replace(/[^\d]/g, '');
  if (cleaned.length < 7 || cleaned.length > 15) return { phone: true };
  return /^[+]?[\d\s\-()]+$/.test(value) ? null : { phone: true };
};

/* ----------------------------------------------------------------------
 * Date must not be in the future (e.g., Date of Incorporation).
 * -------------------------------------------------------------------- */
export const notFutureDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return { invalidDate: true };

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return date <= endOfToday ? null : { notFutureDate: true };
};

/* ----------------------------------------------------------------------
 * Date must be in the future (e.g., License Expiry).
 * -------------------------------------------------------------------- */
export const futureDateValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return { invalidDate: true };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return date >= startOfToday ? null : { futureDate: true };
};

/* ----------------------------------------------------------------------
 * Integer (no decimals). Allows positive and negative.
 * -------------------------------------------------------------------- */
export const integerValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') return null;
  return Number.isInteger(Number(value)) ? null : { integer: true };
};

export const textValidator: ValidatorFn =(
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
 
    const regex = /^[a-zA-Z\s.'-]+$/;

    return regex.test(value)
      ? null
      : { text: true };
  };

/* ----------------------------------------------------------------------
 * Maps validator error keys → human-readable messages.
 * Used by the AddCompanyModal's getError() helper.
 * -------------------------------------------------------------------- */
// export const ERROR_MESSAGES: Record<string, (err?: any) => string> = {
export const ERROR_MESSAGES: Record<string, (err?: any, fieldName?: string) => string> = {
   required: (_, fieldName) => `${fieldName || 'This field'} is required`,
     email: () => 'Enter a valid email address',
  minlength: (e) => `Minimum ${e.requiredLength} characters`,
  maxlength: (e) => `Maximum ${e.requiredLength} characters`,
  min: (e) => `Minimum value is ${e.min}`,
  max: (e) => `Maximum value is ${e.max}`,
  pattern: () => 'Invalid format',
  url: () => 'Enter a valid URL',
  phone: () => 'Enter a valid phone number',
  invalidDate: () => 'Invalid date',
  notFutureDate: () => 'Date cannot be in the future',
  futureDate: () => 'Date must be in the future',
  integer: () => 'Must be a whole number',
  text:()=>'Allowed only letters',
   usernameMinLength: () => 'Username must be at least 8 characters',
  usernameAlpha:     () => 'Username must contain at least one letter',
  usernameNumber:    () => 'Username must contain at least one number',
  usernameSpecial:   () => 'Username must contain at least one special character',
  passwordMinLength: () => 'Password must be at least 8 characters',
  passwordAlpha:     () => 'Password must contain at least one letter',
  passwordNumber:    () => 'Password must contain at least one number',
  passwordSpecial:   () => 'Password must contain at least one special character',
  mismatch:          () => 'Passwords do not match',

};

/** Pick the first validation error and translate it to a user-facing string. */
// export function firstErrorMessage(errors: ValidationErrors | null): string | null {
//   if (!errors) return null;
//   for (const key of Object.keys(errors)) {
//     const fn = ERROR_MESSAGES[key];
//     if (fn) return fn(errors[key]);
//   }
//   return 'Invalid value';
// }

export function firstErrorMessage(
  errors: ValidationErrors | null,
  fieldName?: string,
): string | null {
  if (!errors) return null;

  for (const key of Object.keys(errors)) {
    const fn = ERROR_MESSAGES[key];
    if (fn) return fn(errors[key], fieldName);
  }

  return 'Invalid value';
}
export const usernameValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string | null = control.value;
  if (!value) return null;
 
  const errors: ValidationErrors = {};
 
  if (value.length < 8)              errors['usernameMinLength']  = true;
  if (!/[A-Za-z]/.test(value))       errors['usernameAlpha']      = true;
  if (!/[0-9]/.test(value))          errors['usernameNumber']     = true;
  if (!/[^A-Za-z0-9]/.test(value))   errors['usernameSpecial']    = true;
 
  return Object.keys(errors).length ? errors : null;
};
export const passwordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string | null = control.value;
  if (!value) return null;
 
  const errors: ValidationErrors = {};
 
  if (value.length < 8)              errors['passwordMinLength']  = true;
  if (!/[A-Za-z]/.test(value))       errors['passwordAlpha']      = true;
  if (!/[0-9]/.test(value))          errors['passwordNumber']     = true;
  if (!/[^A-Za-z0-9]/.test(value))   errors['passwordSpecial']    = true;
 
  return Object.keys(errors).length ? errors : null;
};
export function matchOtherControl(otherKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;
    const other = control.parent.get(otherKey);
    if (!other) return null;
    if (control.value === '' || control.value === null || control.value === undefined) return null;
    return control.value === other.value ? null : { mismatch: true };
  };
}

