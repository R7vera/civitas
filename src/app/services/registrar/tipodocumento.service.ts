import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private baseUrl = 'http://localhost:8090/auth/tipoDocumento'; // Cambia la URL base si es necesario

  constructor(private http: HttpClient) {}

  getTiposDocumentos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
