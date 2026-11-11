/** Shape of `environment.encryption`. */
export interface EncryptionConfig {
  /** Master switch. When false, the interceptor passes through. */
  encryptionenabled: boolean;
  decryptionenabled: boolean;
  /** URL prefixes that should be encrypted. Anything else passes through. */
  urlPrefixes: string[];

  /**
   * Base64-encoded 32-byte AES key. MUST match the .NET API's Encryption:KeyBase64.
   *
   * WARNING: this value ships in the JS bundle. Anyone who downloads your site
   * can extract it. Use this design only when that tradeoff is acceptable
   * (internal apps, intranet, server-to-server, etc.).
   */
  aesKeyBase64: string;
}
