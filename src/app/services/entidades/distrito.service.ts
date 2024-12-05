import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Distrito } from '../../models/Distrito';  // Asegúrate de que el modelo esté correctamente importado.
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class DistritoService {

  private baseUrl = 'http://localhost:8090/api/v1/distritos'; // URL base para los distritos

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  // Obtener todos los distritos
  getAllDistritos(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}`, { headers });
  }

  // Buscar distrito por nombre
  buscarPorNombre(nombre: string): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/buscar/${nombre}`, { headers });
  }

  // Obtener un distrito por ID
  getDistritoPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear un nuevo distrito
  createDistrito(distrito: Distrito): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.post(`${this.baseUrl}`, distrito, { headers });
  }

  // Actualizar un distrito existente
  updateDistrito(id: number, distrito: Distrito): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.put(`${this.baseUrl}/${id}`, distrito, { headers });
  }

  // Eliminar un distrito
  deleteDistrito(id: number): Observable<any> {
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
