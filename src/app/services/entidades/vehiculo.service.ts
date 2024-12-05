import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../models/vehiculo';// Modelo para Vehiculo
import { TipoVehiculo } from '../../models/TipoVehiculo'; // Modelo para TipoVehiculo
import { TokenService } from '../inicioSesion/token.service';
@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private baseUrl = 'http://localhost:8090/api/v1/vehiculos'; // URL base para vehículos

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  // Obtener todos los vehículos
  getAllVehiculos(): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}`, { headers }) : new Observable();
  }

  // Obtener todos los tipos de vehículos
  getAllTiposVehiculo(): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.get<any>(`${this.baseUrl}/tipovehiculo`, { headers }) : new Observable();
  }

  // Crear un nuevo vehículo
  createVehiculo(vehiculo: Vehiculo): Observable<any> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.post<any>(`${this.baseUrl}`, vehiculo, { headers }) : new Observable();
  }

  // Actualizar un vehículo existente
  updateVehiculo(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    const headers = this.getAuthHeaders();
    return headers ? this.http.put<Vehiculo>(`${this.baseUrl}/${id}`, vehiculo, { headers }) : new Observable();
  }

  // Eliminar un vehículo
  deleteVehiculo(id: number): Observable<any> {
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
