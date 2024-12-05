import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Departamento } from '../../models/departamento';
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  private baseUrl = 'http://localhost:8090/api/v1/departamentos'; // URL base para los departamentos

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {}

  // Obtener todos los departamentos
  getAllDepartamentos(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}`, { headers });
  }

  // Obtener un departamento por ID
  getDepartamentoPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  // Crear un nuevo departamento
  createDepartamento(departamento: Departamento): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.post(`${this.baseUrl}`, departamento, { headers });
  }

  // Actualizar un departamento existente
  updateDepartamento(id: number, departamento: Departamento): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) return new Observable();

    return this.http.put(`${this.baseUrl}/${id}`, departamento, { headers });
  }

  // Eliminar un departamento
  deleteDepartamento(id: number): Observable<any> {
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
