import { inject, Injectable } from '@angular/core';
import { CryptoService } from '@/app/core/utils/crypto.util';

export enum LocalStoragekeys {
  UserData = 'UserData',
  UserAccessToken = 'UserAccessToken',
  UserSessionExpiration = 'UserSessionExpiration'
}

@Injectable({
  providedIn: 'root',
})
export class Localstorage {

  cryptoService = inject(CryptoService);

  async setItem(key: LocalStoragekeys, value: any) {

    if (key === LocalStoragekeys.UserSessionExpiration) {
      localStorage.setItem(key, value);
      return;
    } else {
      const cryptoKey = await this.cryptoService.getCryptoKey();
      const encryptedPayload = await this.cryptoService.encrypt(cryptoKey, JSON.stringify(value));
      localStorage.setItem(key, JSON.stringify(encryptedPayload));
    }
  }

  async getItem(key: LocalStoragekeys): Promise<any> {
    const item = localStorage.getItem(key);
    if (!item) return null;
    if (key === LocalStoragekeys.UserSessionExpiration) {
      return item;
    } else {
      const cryptoKey = await this.cryptoService.getCryptoKey();
      const decryptedpayload = await this.cryptoService.decrypt(cryptoKey, JSON.parse(item));
      return JSON.parse(JSON.parse(decryptedpayload));
    }
  }

  removeItem(key: LocalStoragekeys) {
    localStorage.removeItem(key);
  }

}
