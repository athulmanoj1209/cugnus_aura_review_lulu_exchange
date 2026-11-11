import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHelperService } from '@/app/core/services/api-client.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private apiUrl :string = environment.apiBaseUrl;

  constructor(private http: HttpClient,private api: ApiHelperService) {}

  // POST - Upload file
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.uploadFile(`${this.apiUrl}/upload`, formData);
  }

  // GET - Download/fetch file
  getFile(filename: string): Observable<Blob> {
    return this.api.downloadFile(`${this.apiUrl}/file/${filename}`);
  }
}