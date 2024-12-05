import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programacion } from '../../models/Programacion';// Modelo para Programacion
import { TokenService } from '../inicioSesion/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  private baseUrl = 'http://localhost:8090/api/v1/programacion'; // URL base para programación

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Obtener todas las programaciones
  getAllProgramaciones(): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}`, { headers }) : new Observable();
  }

  // Obtener una programación por su ID
  getProgramacionById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}/${id}`, { headers }) : new Observable();
  }

  // Crear una nueva programación
  createProgramacion(programacion: Programacion): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post<any>(`${this.baseUrl}`, programacion, { headers }) : new Observable();
  }

  // Actualizar una programación existente
  updateProgramacion(id: number, programacion: Programacion): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.put<any>(`${this.baseUrl}/${id}`, programacion, { headers }) : new Observable();
  }

  // Eliminar una programación
  deleteProgramacion(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.delete(`${this.baseUrl}/${id}`, { headers }) : new Observable();
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
