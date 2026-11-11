import { EncryptionConfig } from "../core/models/encryption.model";

export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:44338/api',

encryption: <EncryptionConfig>{
    encryptionenabled: true,
    decryptionenabled:true,
    urlPrefixes: ['/api/v1/Products'],
    aesKeyBase64: 'q83vV6Xc1k2Z7lP4mYt9sQ2xW8rJ0nF5uK3aD6bH9cE=',
  },
  };