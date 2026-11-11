import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { environment } from '@/app/environments/environment';
import { withCaller } from '@/app/core/http/logging-context';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  showLoader?: boolean;
  withAuthentication?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiHelperService {
  private baseUrl: string = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private buildHeaders(options?: RequestOptions): HttpHeaders {
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (options?.withAuthentication !== false) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    if (options?.headers) {
      headers = { ...headers, ...options.headers };
    }

    return new HttpHeaders(headers);
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }
    return httpParams;
  }

  // ─── Public HTTP Methods ───────────────────────────────────────────────────

  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
       return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.buildHeaders(options),
        params: this.buildParams(options?.params),
      })
      .pipe(
        //map((response) => response),
        //catchError((err) => this.handleError(err)),
        finalize(() => {
                 })
      );
  }

  post<T>(endpoint: string, body: any, options?: RequestOptions): Observable<T> {
   
       return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.buildHeaders(options),
        params: this.buildParams(options?.params),
      })
      .pipe(
        // map((response) => response),
        //catchError((err) => this.handleError(err)),
        finalize(() => {
                })
      );
  }

  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
       return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.buildHeaders(options),
        params: this.buildParams(options?.params),
      })
      .pipe(
        //map((response) => response),
        //catchError((err) => this.handleError(err)),
        finalize(() => {
                })
      );
  }

  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
        return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.buildHeaders(options),
        params: this.buildParams(options?.params),
      })
      .pipe(
       // map((response) => response),
       // catchError((err) => this.handleError(err)),
        finalize(() => {
                })
      );
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
       return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.buildHeaders(options),
        params: this.buildParams(options?.params), context: withCaller({ method: 'saveInvoice', page: 'InvoiceEditPage' }),
      })
      .pipe(
       // map((response) => response),
       // catchError((err) => this.handleError(err)),
        finalize(() => {
      })
      );
  }

  postFile<T>(endpoint: string, formData: FormData, options?: RequestOptions): Observable<T> {
   
    // For file uploads, let the browser set Content-Type (with boundary)
    const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, formData, { headers })
      .pipe(
       // catchError((err) => this.handleError(err)),
        finalize(() => {
        })
      );
  }
   
}