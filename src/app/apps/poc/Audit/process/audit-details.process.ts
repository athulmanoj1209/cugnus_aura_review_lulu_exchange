import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditService } from '../../../../features/audits/audit-plan/audit-plan/services/audit-details.services';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditProcess {
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private audit: AuditService) {}
  saveAudit(payload: any): Observable<any> {
    console.log('In Process layer : call Service Method');
    return this.audit.saveAuditService(payload);
  }
  uploadAuditFiles(formData: FormData): Observable<any> {
    console.log('In Process layer : call Service Method');
    return this.audit.uploadAuditFiles(formData);
  }
  getProducts(): Observable<any> {
    console.log('In Process layer(getProducts) : call Service Method');
    return this.audit.getProducts();
  }
  saveProduct(payload: any): Observable<any> {
    console.log('In Process layer saveProduct : call Service Method');
    return this.audit.saveProduct(payload);
  }
  modifyProduct(payload: any,id: string): Observable<any> {
    console.log('In Process layer modifyProduct : call Service Method');
    return this.audit.modifyProduct(payload,id);
  }
  patchProduct(payload: any,id: string): Observable<any> {
    console.log('In Process layer patchProduct: call Service Method');
    return this.audit.patchProduct(payload,id);
  }
  removeProduct(id: string): Observable<any> {
    console.log('In Process layer removeProduct : call Service Method');
    return this.audit.removeProduct(id);
  }
}