import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Ciudades } from '../../models/ciudades'; // Asegúrate de que este modelo esté definido.
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class CiudadesService {
  private baseUrl = 'http://localhost:8090/api/v1/ciudades'; // URL base para las ciudades

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  // Obtener todas las ciudades
  getAllCiudades(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}`, { headers });
  }

  // Buscar ciudades por nombre
  buscarPorNombre(nombre: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/buscar/${nombre}`, { headers });
  }

  // Obtener una ciudad por ID
  getCiudadPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear una nueva ciudad
  createCiudad(ciudad: Ciudades): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.post(`${this.baseUrl}`, ciudad, { headers });
  }

  // Actualizar una ciudad existente
  updateCiudad(id: number, ciudad: Ciudades): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.put(`${this.baseUrl}/${id}`, ciudad, { headers });
  }

  // Eliminar una ciudad
  deleteCiudad(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  // Obtener encabezados de autorización con el token
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
}
