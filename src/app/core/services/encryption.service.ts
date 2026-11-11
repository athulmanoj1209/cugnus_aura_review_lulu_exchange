import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EncryptedPayload } from '../models/encrypted-payload.model';

/**
 * Pure AES-256-GCM with a pre-shared key. Algorithm parameters match the .NET
 * PayloadEncryptionService exactly. Buffer types are pinned to ArrayBuffer
 * (not ArrayBufferLike) for TypeScript 5.7+ compatibility with Web Crypto.
 */
@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private static readonly IV_BYTES = 12;
  private static readonly TAG_BITS = 128;

  private keyPromise?: Promise<CryptoKey>;

  async encrypt<T>(value: T): Promise<EncryptedPayload> {
    const key = await this.getKey();
    const iv = randomBytes(EncryptionService.IV_BYTES);
    const plaintext = utf8(JSON.stringify(value));

    const sealed = new Uint8Array(await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: EncryptionService.TAG_BITS }, key, plaintext));

    const tagBytes = EncryptionService.TAG_BITS / 8;
    const splitAt = sealed.byteLength - tagBytes;
    return {
      iv: toBase64(iv),
      ciphertext: toBase64(sealed.subarray(0, splitAt)),
      Tag: toBase64(sealed.subarray(splitAt)),
    };
  }

  async decrypt<T>(payload: EncryptedPayload): Promise<T> {
    const key = await this.getKey();
    const iv  = fromBase64(payload.iv);
    const ct  = fromBase64(payload.ciphertext);
    const tag = fromBase64(payload.Tag);

    const sealed = new Uint8Array(new ArrayBuffer(ct.byteLength + tag.byteLength));
    sealed.set(ct, 0);
    sealed.set(tag, ct.byteLength);

    const pt = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: EncryptionService.TAG_BITS }, key, sealed);
    return JSON.parse(new TextDecoder().decode(pt)) as T;
  }

  private getKey(): Promise<CryptoKey> {
    return (this.keyPromise ??= importAesKey(environment.encryption.aesKeyBase64));
  }
}

async function importAesKey(base64: string): Promise<CryptoKey> {
  const raw = fromBase64(base64);
  if (raw.byteLength !== 32) {
    throw new Error(`aesKeyBase64 must decode to 32 bytes, got ${raw.byteLength}.`);
  }
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

// ---------- buffer helpers (pinned to ArrayBuffer) ----------

function randomBytes(n: number): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(n));
  crypto.getRandomValues(out);
  return out;
}

function utf8(s: string): Uint8Array<ArrayBuffer> {
  const encoded = new TextEncoder().encode(s);
  // TextEncoder returns Uint8Array<ArrayBufferLike>; copy into a fresh ArrayBuffer.
  const out = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  out.set(encoded);
  return out;
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}