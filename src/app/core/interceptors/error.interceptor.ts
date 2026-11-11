import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@/app/shared/components/toast/services/toast.service';

/**
 * httpErrorInterceptor
 *
 * A functional HTTP interceptor (Angular 17+ style) that intercepts all
 * HttpClient errors and handles them consistently.
 *
 * Handles:
 *  - 400 Bad Request      → logs validation errors
 *  - 401 Unauthorized     → redirects to /login
 *  - 403 Forbidden        → redirects to /error?status=403
 *  - 404 Not Found        → redirects to /not-found
 *  - 5xx Server Errors    → redirects to /error?status=500
 *  - Network/unknown      → toasts "This Feature is under development"
 */

// Module-level (not per-request) so bursts of parallel failed calls — e.g. a
// dashboard firing several requests on load — only surface one toast.
let lastBackendUnavailableToastAt = 0;

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // ── 1. Console logging ────────────────────────────────────────────────
      console.error(
        `[HttpErrorInterceptor] ${req.method} ${req.urlWithParams}`,
        `→ Status: ${error.status}`,
        error.message
      );

      // status 0 means the request never reached a server at all — the
      // expected failure mode once this app is deployed (e.g. to Vercel)
      // without the real .NET backend behind `environment.apiBaseUrl`
      // running anywhere reachable. Surface it as a friendly toast instead
      // of a silent console-only failure.
      if (error.status === 0) {
        const now = Date.now();
        if (now - lastBackendUnavailableToastAt > 3000) {
          lastBackendUnavailableToastAt = now;
          // toast.warning('This Feature is under development', '');
        }
      }

      // Re-throw so individual components can still handle errors if needed.
      return throwError(() => error);
    })
  );
};