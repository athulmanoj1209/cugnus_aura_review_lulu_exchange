import { Injectable, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpContext, HttpContextToken } from '@angular/common/http';
import { environment } from '../../environments/environment';

// ----- Types -----

/** Skip logging interceptor for requests carrying this context flag. */
export const SKIP_LOGGING = new HttpContextToken<boolean>(() => false);

export enum LogLevel {
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  Fatal = 5,
  Verbose = 6,
}

export enum SourceOfLog {
  Frontend = 1,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: SourceOfLog;
  url?: string;
  userAgent?: string;
  stackTrace?: string | null;
  additionalData?: Record<string, unknown> | null;
  userId?: string | null;
  sessionId?: string | null;
  pageId?: number | null;
  method?: string | null;
}

interface LogBatch {
  batchId: string;       // idempotency key
  entries: LogEntry[];
}

// ----- Service -----

@Injectable({ providedIn: 'root' })
export class LoggerService implements OnDestroy {
  private readonly endpoint = `${environment.apiBaseUrl}/v1/Logs`;
  private readonly FLUSH_INTERVAL_MS = 5000;
  private readonly BATCH_SIZE = 20;
  private readonly MAX_BUFFER = 500;             // hard cap to avoid runaway memory
  private readonly BEACON_MAX_BYTES = 60 * 1024; // stay under the 64 KB sendBeacon limit

  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private isFlushing = false;
  private currentUserId: string | null = null;
  private sessionId: string;
  private cachedUserAgent: string | null = null;

  // Stored references so we can remove them in ngOnDestroy.
  private readonly onBeforeUnload = () => this.flushSync();
  private readonly onVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      this.flushSync();
    }
  };
  private readonly onPageHide = () => this.flushSync();

  private readonly isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.sessionId = this.generateId();

    if (!this.isBrowser) return; // SSR: skip browser-only setup

    this.cachedUserAgent = navigator.userAgent;
    this.flushTimer = setInterval(() => this.flush(), this.FLUSH_INTERVAL_MS);
    window.addEventListener('beforeunload', this.onBeforeUnload);
    window.addEventListener('pagehide', this.onPageHide);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.isBrowser) {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      window.removeEventListener('pagehide', this.onPageHide);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
    // Best-effort final flush.
    this.flushSync();
  }

  // -------- User identity --------

  /** Call after login; pass null after logout. */
  setUserId(userId: string | null): void {
    this.currentUserId = userId;
  }

  getUserId(): string | null {
    return this.currentUserId;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // -------- Public API --------

  debug(message: string, source?: SourceOfLog, extra?: Record<string, unknown>, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Debug, message, source, extra, null, pageId, method);
  }

  info(message: string, source?: SourceOfLog, extra?: any, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Information, message, source, extra, null, pageId, method);
  }

  warn(message: string, source?: SourceOfLog, extra?: any, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Warning, message, source, extra, null, pageId, method);
  }

  error(message: string, source?: SourceOfLog, stack?: string | null, extra?: any, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Error, message, source, extra, stack ?? null, pageId, method);
  }

  fatal(message: string, source?: SourceOfLog, stack?: string | null, extra?: any, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Fatal, message, source, extra, stack ?? null, pageId, method);
  }

  activity(message: string, source?: SourceOfLog, extra?: any, pageId?: number | null, method?: string): void {
    this.push(LogLevel.Verbose, message, source, extra, null, pageId, method);
  }

  // -------- Internals --------

  private push(
    level: LogLevel,
    message: string,
    source?: SourceOfLog,
    additionalData?: Record<string, unknown>,
    stackTrace?: string | null,
    pageId?: number | null,
    method?: string | null,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      url: this.safeUrl(),
      userAgent: this.cachedUserAgent ?? undefined,
      stackTrace: stackTrace ?? null,
      additionalData: this.sanitize(additionalData),
      userId: this.currentUserId,
      sessionId: this.sessionId,
      pageId: pageId ?? null,
      method: method ?? null,
    };

    // Drop oldest entries if the buffer exceeds the hard cap.
    if (this.buffer.length >= this.MAX_BUFFER) {
      this.buffer.splice(0, this.buffer.length - this.MAX_BUFFER + 1);
    }
    this.buffer.push(entry);

    if (this.buffer.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  /** Async flush via HttpClient. Safe to call concurrently — re-entry guarded. */
  flush(): void {
    if (this.isFlushing || this.buffer.length === 0) return;

    this.isFlushing = true;
    const batch: LogBatch = {
      batchId: this.generateId(),
      entries: this.buffer.splice(0),
    };

    const headers = new HttpHeaders({ 'X-Batch-Id': batch.batchId });
    const context = new HttpContext().set(SKIP_LOGGING, true); // prevent interceptor recursion

    // this.http.post(this.endpoint, batch.entries, { headers, context }).subscribe({
    //   next: () => {
    //     this.isFlushing = false;
    //   },
    //   error: () => {
    //     // Restore at the front so order is roughly preserved.
    //     // Cap to MAX_BUFFER to avoid unbounded growth on persistent failure.
    //     const restored = [...batch.entries, ...this.buffer].slice(-this.MAX_BUFFER);
    //     this.buffer = restored;
    //     this.isFlushing = false;
    //   },
    // });
  }

  /** Synchronous flush during page unload. Uses sendBeacon. */
  private flushSync(): void {
    if (!this.isBrowser || this.buffer.length === 0) return;

    try {
      let entries = this.buffer;
      let payload = JSON.stringify(entries);

      // sendBeacon has a ~64 KB limit. Trim oldest entries until we fit.
      while (this.byteLength(payload) > this.BEACON_MAX_BYTES && entries.length > 1) {
        entries = entries.slice(Math.ceil(entries.length / 2));
        payload = JSON.stringify(entries);
      }

      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon(this.endpoint, blob);
      if (ok) {
        this.buffer = [];
      }
      // If !ok, keep the buffer so a future flush() can retry.
    } catch {
      /* page is unloading — nothing more we can do */
    }
  }

  // -------- Helpers --------

  private safeUrl(): string | undefined {
    if (!this.isBrowser) return undefined;
    try {
      const u = new URL(window.location.href);
      // Strip query and hash to avoid leaking tokens / PII.
      return `${u.origin}${u.pathname}`;
    } catch {
      return undefined;
    }
  }

  private sanitize(data?: Record<string, unknown>): Record<string, unknown> | null {
    if (data == null) return null;
    try {
      // Round-trip through JSON to drop functions, undefined, and to
      // surface circular references early (caught below).
      return JSON.parse(JSON.stringify(data));
    } catch {
      return { _sanitizeError: 'Value could not be serialized' };
    }
  }

  private byteLength(s: string): number {
    return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}