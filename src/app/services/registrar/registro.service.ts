import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private baseUrl = 'http://localhost:8090/auth/registrar';
  constructor(private http: HttpClient) { }
  createUsuario(usuario: Usuario): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, usuario);
  }
}
