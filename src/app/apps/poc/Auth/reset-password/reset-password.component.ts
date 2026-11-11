import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG modules (v18+)
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import {
  firstErrorMessage,
  passwordValidator,
  matchOtherControl,
} from '@/app/shared/services/form-validators.service';
import { UserService } from '@/app/features/user/users/services/users.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/* ============================================================
 *  Reset Password — standalone routable page
 *
 *  Wire-up:
 *
 *    {
 *      path: 'reset-password',
 *      loadComponent: () =>
 *        import('./app/Admin/reset-password/reset-password-page.component')
 *          .then(c => c.ResetPasswordPageComponent),
 *      data: { breadcrumb: 'reset password' }
 *    }
 *
 *  Expected URL shape (delivered in the reset email):
 *    /reset-password?token=abc123&email=user@example.com
 *
 *  No token in the URL → an inline "invalid link" card is shown with
 *  a CTA back to sign-in (we don't redirect — users should see why).
 * ============================================================ */

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,AuthLayoutComponent
  , DrawIconComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordPageComponent implements OnInit {

  private readonly route       = inject(ActivatedRoute);
  private readonly router      = inject(Router);
  private readonly userService = inject(UserService);
  private readonly fb          = inject(FormBuilder);
  private readonly destroyRef  = inject(DestroyRef);

  /** Pulled from the URL on init. */
  readonly token = signal<string | null>(null);
  readonly email = signal<string | null>(null);

  /** UI state. */
  readonly submitting  = signal(false);
  readonly serverError = signal<string | null>(null);

  /* ---------------- Form ---------------- */
  readonly form = this.fb.group({
    newPassword:     ['', [Validators.required, passwordValidator]],
    confirmPassword: ['', [Validators.required, matchOtherControl('newPassword')]],
  });

  /* ---------------- Header copy ---------------- */

  get headerSubtitle(): string {
     return 'Set a new password for your account';
    // const email = this.email();
    // return email
    //   ? `Set a new password for ${email}`
    //   : 'Set a new password for your account';
  }

  /* ---------------- Lifecycle ---------------- */

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.token.set(params['token'] ?? null);
    this.email.set(params['email'] ?? null);

    // Re-validate confirm whenever the new password changes,
    // so the mismatch error clears as soon as values align.
    this.form.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.form.controls.confirmPassword.updateValueAndValidity({ emitEvent: false });
      });
  }

  /* ---------------- Error helpers ---------------- */

getError(path: string,field : string  | undefined): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors,field);
  }
  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  /* ---------------- Actions ---------------- */

  onCancel(): void {
    this.router.navigate(['auth/login'], { replaceUrl: true });
  }

  goToLogin(): void {
    this.router.navigate(['auth/login'], { replaceUrl: true });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const token = this.token();
    if (!token) {
      this.serverError.set('Reset link is missing or invalid.');
      return;
    }

    const newPassword = this.form.controls.newPassword.value!;

    this.submitting.set(true);
    this.serverError.set(null);

    // this.userService.resetPasswordWithToken(token, newPassword)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this.submitting.set(false);
    //       this.router.navigate(['/login'], {
    //         queryParams: { reset: 'success' },
    //         replaceUrl: true,
    //       });
    //     },
    //     error: (err) => {
    //       this.submitting.set(false);
    //       this.serverError.set(this.messageFor(err));
    //     },
    //   });
  }

  /** Map a thrown error onto a user-facing message. */
  private messageFor(err: unknown): string {
    const msg = (err as Error | undefined)?.message?.toLowerCase() ?? '';
    if (msg.includes('expired')) return 'This reset link has expired. Please request a new one.';
    if (msg.includes('invalid')) return 'This reset link is invalid. Please request a new one.';
    return 'Something went wrong. Please try again.';
  }
}