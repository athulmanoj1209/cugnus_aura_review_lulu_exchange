import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/app/environments/environment';
import { ApiHelperService } from '@/app/core/services/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  //private apiUrl = 'https://your-api-url.com/audits';
  private apiUrl: string = environment.apiBaseUrl;

  constructor(private http: HttpClient,private api: ApiHelperService) {}

  saveAuditService(payload: any): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.post<any>('users', payload, { showLoader: true })
  }
  uploadAuditFiles(formData: FormData): Observable<any>{
    console.log('In Service layer : call upload API');
    return this.api.postFile<any>('Uploads/single', formData, { showLoader: true })
  }
getProducts(): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.get<any>('Products')
  }
  saveProduct(payload: any): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.post<any>('Products', payload, { showLoader: true })
  }
  modifyProduct(payload: any,id: string): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.put<any>('Products/'+id, payload, { showLoader: true })
  }
  patchProduct(payload: any,id: string): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.patch<any>('Products/'+id, payload, { showLoader: true })
  }
  removeProduct(id: string): Observable<any> {
    console.log('In Service layer : call API');
   // return this.http.post<any>(this.apiUrl, payload);
   return this.api.delete<any>('Products/'+id, { showLoader: true })
  }
}