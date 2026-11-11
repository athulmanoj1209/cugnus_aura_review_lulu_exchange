import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { inject, Signal } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, from, switchMap, take, tap, throwError } from 'rxjs';
import { clearCredentials, setCredentials } from '@/app/state/auth/auth.action';
import { selectAccessToken } from '@/app/state/auth/auth.selector';
import { Router } from '@angular/router';
import { clearUserDetails } from '@/app/state/user/user.action';
import { Localstorage, LocalStoragekeys } from '@/app/shared/services/localstorage.service';
import { AuthService } from '../services/auth.service';


function addTokenHeader(request: HttpRequest<any>, token: string | null) {
  return request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + token),
  });
}

const isRefreshing$ = new BehaviorSubject<boolean>(false);

const urlsToInclude = ["Audit/auditor-register", "Audit/auditor-login", "Audit/resetpassword-notauth", "Audit/Refresh", "AdminAuth/logout", "data/customers", "public/demo/data/icons.json", "/demo/data/members.json", "Audit/get-transactions", "Audit/get-auditor-details", "Audit/check-session", "Audit/check-session" ];

const canInterceptorUsedWithUrl = (requestUrl: string): boolean => {
  const urlAfterPart: string = 'api/';
  const position: number = requestUrl.indexOf(urlAfterPart);
  if (position > 0) {
    const partAfterApiAndurl: string = requestUrl.substring(position + urlAfterPart.length);
    for (let url of urlsToInclude) {
      if (new RegExp(url).test(partAfterApiAndurl)) {
        return false;
      }
    }
  }
  return true;
}


export const globalRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);
  const localStorage = inject(Localstorage);
  const accessToken: Signal<string | null> = store.selectSignal(selectAccessToken);

  if (!canInterceptorUsedWithUrl(req.url)) {
    return next(req);
  }

  return from(authService.decryptAndVerifyAccessToken(accessToken() || '')).pipe(
    switchMap(decryptedToken =>
      next(addTokenHeader(req, decryptedToken)).pipe(
        catchError((error) => {
          const isError = error instanceof HttpErrorResponse;
          const isError401 = error.status === 401;

          if (isError && isError401) {
            if (error?.error?.message === "session_conflict") {
              http.post(`${environment.apiBaseUrl}/Audit/clear-session`, {}, { withCredentials: true }).subscribe({
                next: (response) => {
                  console.log("Session cleared successfully:", response);
                  store.dispatch(clearCredentials());
                  store.dispatch(clearUserDetails());
                  localStorage.removeItem(LocalStoragekeys.UserAccessToken);
                  router.navigate(['/auth/session-conflict']);
                },
                error: (err) => {
                  console.error("Failed to clear session:", err);
                }
              });
              throw error;
            }
            isRefreshing$.pipe(take(1)).subscribe((isRefreshing) => { console.log('isRefreshing:', isRefreshing) });
            if (!isRefreshing$.getValue()) {
              isRefreshing$.next(true);
              return http.get<any>(`${environment.apiBaseUrl}/Audit/Refresh`, { withCredentials: true }).pipe(
                tap((response: any) => {
                  isRefreshing$.next(false);
                  store.dispatch(setCredentials({ accessToken: response?.accessToken }));
                }),
                switchMap((response: any) => {
                  return from(authService.decryptAndVerifyAccessToken(response?.accessToken)).pipe(
                    switchMap(decryptedToken => next(addTokenHeader(req, decryptedToken)))
                  );
                }),
                catchError((err) => {
                  store.dispatch(clearCredentials());
                  store.dispatch(clearUserDetails());
                  localStorage.removeItem(LocalStoragekeys.UserAccessToken);
                  if (err?.error?.refresh_error === "session_conflict") {
                    http.post(`${environment.apiBaseUrl}/Audit/clear-session`, {}, { withCredentials: true }).subscribe({
                      next: (response) => {
                        console.log("Session cleared successfully:", response);
                        store.dispatch(clearCredentials());
                        store.dispatch(clearUserDetails());
                        localStorage.removeItem(LocalStoragekeys.UserAccessToken);
                        localStorage.removeItem(LocalStoragekeys.UserSessionExpiration);
                        router.navigate(['/auth/session-conflict']);
                      },
                      error: (err) => {
                        console.error("Failed to clear session:", err);
                      }
                    });
                    return throwError(() => error);
                  }
                  return throwError(() => err);
                }),
                finalize(() => {
                  isRefreshing$.next(false);
                })
              );
            }
            // Another request already triggered a refresh — wait for it to finish,
            // then decrypt the newly stored token and retry.
            return isRefreshing$.pipe(
              filter((is) => !is),
              take(1),
              switchMap(() =>
                from(authService.decryptAndVerifyAccessToken(accessToken() || '')).pipe(
                  switchMap(newDecryptedToken => next(addTokenHeader(req, newDecryptedToken)))
                )
              )
            );
          }
          throw error;
        })
      )
    )
  );
}
