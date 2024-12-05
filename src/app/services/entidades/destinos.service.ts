import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Destinos } from '../../models/destinos';
import { TokenService } from '../inicioSesion/token.service';

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  private baseUrl = 'http://localhost:8090/api/v1/destinos'; // URL base para las ciudades

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) { }
  getAllDestinos(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}`, { headers });
  }
  crearDestinos(destino: Destinos): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.post(`${this.baseUrl}`, destino, { headers });
  }
  deteleDestino(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders | null {
    const token = this.tokenService.getToken();

    if (!token) {
      this.tokenService.logout();
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  updateDestinos(id: number, destino: Destinos): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.put(`${this.baseUrl}/${id}`, destino, { headers });
  }
}
