import { Injectable } from '@angular/core';

/**
 * AES-GCM encrypted payload.
 *
 * Ciphertext and tag are kept separate purely for backend interop
 * (some Java/.NET stacks expect them split). If your backend uses the
 * Web Crypto convention where the tag is appended to the ciphertext,
 * you can concatenate them before sending and skip the split entirely.
 */
export interface EncryptedPayload {
  iv: string;         // base64 (standard or URL-safe)
  ciphertext: string; // base64
  tag: string;        // base64, always 16 bytes (128-bit auth tag)
}

/** Options for encrypt/decrypt. */
export interface CryptoOptions {
  /**
   * Optional Additional Authenticated Data. Not encrypted, but bound to
   * the ciphertext by the auth tag. Must be identical on decrypt or
   * authentication fails.
   *
   * Typed as `Uint8Array<ArrayBuffer>` (not just `Uint8Array`) for
   * compatibility with TypeScript 5.7+'s generic TypedArray types and
   * Web Crypto's `BufferSource`.
   */
  additionalData?: Uint8Array<ArrayBuffer>;
}

/** Thrown when decryption fails (tampering, wrong key, wrong IV, etc.). */
export class DecryptionError extends Error {
  constructor(message = 'Decryption failed: data may be tampered or key/IV mismatch.') {
    super(message);
    this.name = 'DecryptionError';
  }
}

@Injectable({ providedIn: 'root' })
export class CryptoService {
  // NIST SP 800-38D recommendations for AES-GCM.
  private static readonly IV_LENGTH_BYTES = 12;            // 96-bit IV
  private static readonly TAG_LENGTH_BITS = 128;           // strongest auth tag
  private static readonly TAG_LENGTH_BYTES = 16;
  private static readonly VALID_KEY_LENGTHS = [16, 24, 32]; // AES-128/192/256

  private readonly enc = new TextEncoder();
  // `fatal: true` makes the decoder throw on invalid UTF-8, so we notice
  // if somehow we got a successful-looking decrypt but corrupted bytes.
  private readonly dec = new TextDecoder('utf-8', { fatal: true });

  constructor() {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error(
        'Web Crypto API is not available. This service requires a secure context (HTTPS or localhost).'
      );
    }
  }

  // ------------------------- base64 helpers -------------------------

  private toBase64(bytes: Uint8Array): string {
    // Chunked to avoid "Maximum call stack size exceeded" on large inputs
    // and faster than per-byte string concatenation.
    const CHUNK = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode.apply(
        null,
        bytes.subarray(i, i + CHUNK) as unknown as number[]
      );
    }
    return btoa(binary);
  }

  private fromBase64(b64: string): Uint8Array<ArrayBuffer> {
    if (typeof b64 !== 'string' || b64.length === 0) {
      throw new Error('Invalid base64 input: expected non-empty string.');
    }
    // Accept URL-safe base64 transparently.
    const normalised = b64.replace(/-/g, '+').replace(/_/g, '/');
    let binary: string;
    try {
      binary = atob(normalised);
    } catch {
      throw new Error('Invalid base64 input: malformed encoding.');
    }
    // Explicit ArrayBuffer backing so the result satisfies BufferSource
    // under TypeScript 5.7+'s generic TypedArray types.
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // ------------------------- key handling -------------------------

  /**
   * Import a raw AES key from base64. Key must be 16, 24, or 32 bytes
   * (AES-128, AES-192, or AES-256).
   *
   * SECURITY: The key is imported as non-extractable. Never log, persist,
   * or transmit the raw key material from the client. Prefer fetching a
   * per-session key over TLS from your backend.
   */
  async importAesKey(base64Key: string): Promise<CryptoKey> {
    const keyBytes = this.fromBase64(base64Key);

    if (!CryptoService.VALID_KEY_LENGTHS.includes(keyBytes.length)) {
      throw new Error(
        `Invalid AES key length: ${keyBytes.length} bytes. ` +
        `Expected 16, 24, or 32 bytes for AES-128/192/256.`
      );
    }



    return crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      /* extractable */ false,
      ['encrypt', 'decrypt']
    );
  }

  /** Generate a fresh, non-extractable AES-256 key. */
  async generateAesKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      /* extractable */ false,
      ['encrypt', 'decrypt']
    );
  }

  // ------------------------- encrypt / decrypt -------------------------

  async encrypt(
    cryptoKey: CryptoKey,
    plaintext: string,
    options: CryptoOptions = {}
  ): Promise<EncryptedPayload> {
    if (typeof plaintext !== 'string') {
      throw new TypeError('plaintext must be a string.');
    }

    // CRITICAL: a fresh random IV per encryption. Reusing an IV with the
    // same key catastrophically breaks AES-GCM confidentiality.
    // Explicit ArrayBuffer backing so `iv` is `Uint8Array<ArrayBuffer>`
    // (required by BufferSource in TypeScript 5.7+).
    const iv = crypto.getRandomValues(
      new Uint8Array(new ArrayBuffer(CryptoService.IV_LENGTH_BYTES))
    );

    // Only include additionalData if it was actually provided. Chrome
    // rejects `additionalData: undefined` as "Not a BufferSource".
    const algorithm: AesGcmParams = {
      name: 'AES-GCM',
      iv,
      tagLength: CryptoService.TAG_LENGTH_BITS,
      ...(options.additionalData
        ? { additionalData: options.additionalData }
        : {}),
    };

    const encrypted = new Uint8Array(
      await crypto.subtle.encrypt(
        algorithm,
        cryptoKey,
        this.enc.encode(plaintext)
      )
    );

    // Web Crypto returns ciphertext || tag.
    const tagStart = encrypted.length - CryptoService.TAG_LENGTH_BYTES;
    const ciphertext = encrypted.subarray(0, tagStart);
    const tag = encrypted.subarray(tagStart);

    return {
      iv: this.toBase64(iv),
      ciphertext: this.toBase64(ciphertext),
      tag: this.toBase64(tag),
    };
  }

  async decrypt(
    cryptoKey: CryptoKey,
    payload: EncryptedPayload,
    options: CryptoOptions = {}
  ): Promise<string> {
    this.validatePayload(payload);

    const iv = this.fromBase64(payload.iv);
    const ciphertext = this.fromBase64(payload.ciphertext);
    const tag = this.fromBase64(payload.tag);

    if (iv.length !== CryptoService.IV_LENGTH_BYTES) {
      throw new Error(
        `Invalid IV length: ${iv.length} bytes. Expected ${CryptoService.IV_LENGTH_BYTES}.`
      );
    }
    if (tag.length !== CryptoService.TAG_LENGTH_BYTES) {
      throw new Error(
        `Invalid auth tag length: ${tag.length} bytes. Expected ${CryptoService.TAG_LENGTH_BYTES}.`
      );
    }

    // Recombine ciphertext || tag as Web Crypto expects.
    // Explicit ArrayBuffer backing for TS 5.7+ BufferSource compatibility.
    const combined = new Uint8Array(new ArrayBuffer(ciphertext.length + tag.length));
    combined.set(ciphertext, 0);
    combined.set(tag, ciphertext.length);

    // Samer eason as in encrypt(): omit additionalData when not provided.
    const algorithm: AesGcmParams = {
      name: 'AES-GCM',
      iv,
      tagLength: CryptoService.TAG_LENGTH_BITS,
      ...(options.additionalData
        ? { additionalData: options.additionalData }
        : {}),
    };

    let plaintextBuffer: ArrayBuffer;
    try {
      plaintextBuffer = await crypto.subtle.decrypt(
        algorithm,
        cryptoKey,
        combined
      );
    } catch {
      // Swallow the underlying DOMException. Callers should not be able
      // to distinguish "wrong key" from "tampered ciphertext" — both are
      // just authentication failures.
      throw new DecryptionError();
    }

    try {
      return this.dec.decode(plaintextBuffer);
    } catch {
      throw new DecryptionError('Decryption succeeded but plaintext was not valid UTF-8.');
    }
  }

  private validatePayload(payload: EncryptedPayload): void {
    if (
      !payload ||
      typeof payload.iv !== 'string' ||
      typeof payload.ciphertext !== 'string' ||
      typeof payload.tag !== 'string'
    ) {
      throw new Error(
        'Invalid EncryptedPayload: must have string fields iv, ciphertext, and tag.'
      );
    }
  }

  async getCryptoKey(): Promise<CryptoKey> {
    const base64Key = "u7Y9kF2xQpL8vZ3nC6sR1WmJtH4eXy0bKq9dU5aN8cM=";
    const keyBytes = this.fromBase64(base64Key);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes as BufferSource,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
    return cryptoKey;
  }

}

