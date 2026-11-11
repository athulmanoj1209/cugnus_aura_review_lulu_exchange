import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { EncryptedPayload } from '../models/encrypted-payload.model';
import { EncryptionService } from '../services/encryption.service';

/**
 * Direction-independent encryption interceptor.
 *
 * encryptionenabled  →  encrypts outgoing request bodies (POST/PUT/PATCH only)
 * decryptionenabled  →  decrypts incoming response bodies that look encrypted
 *
 * Both flags must match the server's DecryptRequest / EncryptResponse settings.
 *
 * Register it last in `withInterceptors([...])` so it runs closest to the network.
 */
//const BodyMethods = new Set(['POST', 'PUT', 'PATCH']);

export const encryptionInterceptor: HttpInterceptorFn = (req, next) => {
  const crypto = inject(EncryptionService);
  const cfg = environment.encryption;

  // URL not in scope → middleware doesn't touch it on either side. Pure passthrough.
  if (!shouldEncrypt(req.url, cfg.urlPrefixes)) {
    return next(req);
  }
  if (req.body instanceof FormData) {
    return next(req);
  }

  const willEncryptRequest = cfg.encryptionenabled;
  const willDecryptResponse = cfg.decryptionenabled;

  // Build the outbound stream — either encrypt the body first, or send as-is.
  const outbound$: Observable<HttpEvent<unknown>> = willEncryptRequest
    ? from(crypto.encrypt(req.body ?? {})).pipe(
        mergeMap((encryptedBody) => {
          const encryptedReq = req.clone({
            body: encryptedBody,
            headers: req.headers.set('Content-Type', 'application/json'),
          });
          return next(encryptedReq);
        }),
      )
    : next(req);

  // Build the inbound stream — either decrypt the response, or pass it through.
  return willDecryptResponse ? decryptResponseStream(outbound$, crypto) : outbound$;
};

function decryptResponseStream(
  stream: Observable<HttpEvent<unknown>>,
  crypto: EncryptionService,
): Observable<HttpEvent<unknown>> {
  return stream.pipe(
    mergeMap(async (event) => {
      if (!(event instanceof HttpResponse)) return event;

      const body = event.body;
      // Skip empty bodies (204, 304) and plain bodies (e.g. 4xx error strings).
      if (
        !body ||
        typeof body !== 'object' ||
        !('iv' in body) ||
        !('ciphertext' in body) ||
        !('Tag' in body)
      ) {
        return event;
      }

      const decrypted = await crypto.decrypt(body as EncryptedPayload);
      return event.clone({ body: decrypted });
    }),
  );
}

function shouldEncrypt(url: string, prefixes: string[]): boolean {
  const path = url.replace(/^https?:\/\/[^/]+/, '');
  return prefixes.some((p) => path.startsWith(p));
}
