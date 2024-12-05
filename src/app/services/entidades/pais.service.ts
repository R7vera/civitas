import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Pais } from '../../models/pais';
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private baseUrl = 'http://localhost:8090/api/v1/paises'; // URL base para las categorías

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  // Obtener todas las categorías
  getAllPaises(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable(); // Retorna un observable vacío si no hay token

    return this.http.get(`${this.baseUrl}`, { headers });
  }

  // Obtener una categoría por ID
  getPaisPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear una nueva categoría
  createPais(pais: Pais): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.post(`${this.baseUrl}`, pais, { headers });
  }

  // Actualizar una categoría existente
  updatePais(id: number, pais: Pais): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.put(`${this.baseUrl}/${id}`, pais, { headers });
  }

  // Eliminar una categoría
  deletePais(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  // Obtener encabezados de autorización con el token
  private getAuthHeaders(): HttpHeaders | null {
    const token = this.tokenService.getToken();

    if (!token) {
      this.tokenService.logout();
      return null; // Redirige al login si no hay token
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
