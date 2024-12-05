import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chofer } from '../../models/chofer';
import { TipoLicencia } from '../../models/tipoLicencia'; // Modelo para TipoLicencia.
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private baseUrl = 'http://localhost:8090/api/v1/choferes'; // URL base para choferes

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Obtener todos los choferes
  getAllChoferes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}`, { headers }) : new Observable();
  }

  // Obtener todos los tipos de licencia
  getAllTiposLicencia(): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}/tipolicencia`, { headers }) : new Observable();
  }

  // Crear un nuevo chofer
  createChofer(chofer: Chofer): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post<any>(`${this.baseUrl}`, chofer, { headers }) : new Observable();
  }

  // Actualizar un chofer existente
  updateChofer(id: number, chofer: Chofer): Observable<Chofer> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.put<Chofer>(`${this.baseUrl}/${id}`, chofer, { headers }) : new Observable();
  }

  // Eliminar un chofer
  deleteChofer(id: number): Observable<any> {
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
