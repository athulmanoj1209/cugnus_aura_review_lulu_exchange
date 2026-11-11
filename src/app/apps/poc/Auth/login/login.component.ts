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
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';

import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { UserService } from '@/app/features/user/users/services/users.service';
import { firstErrorMessage } from '@/app/shared/services/form-validators.service';

/* ============================================================
 *  Cygnus Audit — Login page
 *
 *  Wire-up:
 *
 *    {
 *      path: 'login',
 *      loadComponent: () =>
 *        import('./app/Admin/login/login.component')
 *          .then(c => c.LoginComponent),
 *      data: { breadcrumb: 'sign in' }
 *    }
 *
 *  On successful sign-in we navigate to /dashboard. Adjust the
 *  `nextRoute` constant below to match your app's landing route.
 * ============================================================ */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
   
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    AuthLayoutComponent,
  
    DrawIconComponent,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  private readonly router      = inject(Router);
  private readonly userService = inject(UserService);
  private readonly fb          = inject(FormBuilder);
  private readonly destroyRef  = inject(DestroyRef);

  /** Where to land after a successful sign-in. */
  private readonly nextRoute = '/dashboard';

  /** UI state. */
  readonly submitting  = signal(false);
  readonly serverError = signal<string | null>(null);

  /* ---------------- Form ----------------
   * Note: we don't enforce the strong-password rules on the *login*
   * form. Existing users may have older passwords; only registration
   * and reset-password forms should apply the strength check.
   */
  readonly form = this.fb.group({
    name:       ['', [Validators.required, Validators.maxLength(150)]],
    password:   ['', [Validators.required]],
    rememberMe: [true],
  });

  /* ---------------- Error helpers ---------------- */

  getError(path: string): string | null {
    const ctrl = this.form.get(path);
    if (!ctrl || !ctrl.touched) return null;
    return firstErrorMessage(ctrl.errors);
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

    const raw = this.form.getRawValue();
    const credentials = {
      name:       raw.name!.trim(),
      password:   raw.password!,
      rememberMe: !!raw.rememberMe,
    };

    this.submitting.set(true);
    this.serverError.set(null);

    // this.userService.signIn(credentials)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: () => {
    //       this.submitting.set(false);
    //       this.router.navigateByUrl(this.nextRoute);
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
    if (msg.includes('invalid')) return 'Invalid name or password. Please try again.';
    if (msg.includes('required')) return 'Please fill in both fields.';
    return 'Something went wrong. Please try again.';
  }
}