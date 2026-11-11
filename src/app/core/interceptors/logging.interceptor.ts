import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../../shared/services/logger.service';
import { CALLER_INFO } from '../http/logging-context';
import { Router } from '@angular/router';

/**
 * Functional HTTP interceptor — logs every failed HTTP call to the LoggerService.
 * Designed for use with `provideHttpClient(withInterceptors([...]))`.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LoggerService);
    const router = inject(Router);
    const userId = logger.getUserId();
    // Never log the log-shipping call itself — prevents infinite loops.
    if (req.url.endsWith('/logs')) return next(req);

    const started = Date.now();
    const caller = req.context.get(CALLER_INFO);
    // const page = caller.page ?? router.url;   
    const page = null; //need to pass pageid from local storage
    const method = caller.method ?? 'unknown';

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            const ms = Date.now() - started;
            logger.error(
                `HTTP ${err.status} ${err.statusText || ''} ${req.method} ${req.urlWithParams} (${ms}ms)`,
                1,
                '',
                JSON.stringify({ userId, requestBody: safe(req.body), responseBody: safe(err.error), }), page, method
            );
            return throwError(() => err);
        })
    );
};

function safe(v: unknown): unknown {
    try { JSON.stringify(v); return v; } catch { return '[unserialisable]'; }
}