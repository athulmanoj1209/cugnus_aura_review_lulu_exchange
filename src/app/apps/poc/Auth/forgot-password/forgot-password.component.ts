import {
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG modules (v18+)
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { firstErrorMessage } from '@/app/shared/services/form-validators.service';
import { UserService } from '@/app/features/user/users/services/users.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';

/* ============================================================
 *  Forgot Password — standalone routable page
 *
 *  Wire-up:
 *
 *    {
 *      path: 'forgot-password',
 *      loadComponent: () =>
 *        import('./app/Admin/forgot-password/forgot-password.component')
 *          .then(c => c.ForgotPasswordComponent),
 *      data: { breadcrumb: 'forgot password' }
 *    }
 *
 *  Security note: the success message intentionally does NOT confirm
 *  whether the email exists in the system. This avoids leaking which
 *  addresses are registered. The same screen is shown for any input.
 * ============================================================ */

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,AuthLayoutComponent
  , DrawIconComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {

  private readonly router      = inject(Router);
  private readonly userService = inject(UserService);
  private readonly fb          = inject(FormBuilder);
  private readonly destroyRef  = inject(DestroyRef);

  /** UI state. */
  readonly submitting  = signal(false);
  readonly sent        = signal(false);
  readonly sentToEmail = signal<string | null>(null);
  readonly serverError = signal<string | null>(null);

  /* ---------------- Form ---------------- */
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
  });

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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.controls.email.value!.trim();

    this.submitting.set(true);
    this.serverError.set(null);

    // this.userService.requestPasswordReset(email)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this.submitting.set(false);
    //       this.sentToEmail.set(email);
    //       this.sent.set(true);
    //     },
    //     error: () => {
    //       // Generic message — never confirm or deny account existence.
    //       this.submitting.set(false);
    //       this.serverError.set('Something went wrong. Please try again.');
    //     },
    //   });
  }

  /** Switch back to the form so the user can re-submit (typo fix, etc.). */
  tryAgain(): void {
    this.sent.set(false);
    this.serverError.set(null);
    // Keep the email value; users almost always re-submit the same address.
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}