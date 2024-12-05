import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenkey = 'authToken'
  private dataUser = 'dataUser'
  private expKey = 'tokenExpiration';
  constructor(private router: Router) { }

  // Método para obtener el token almacenado
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenkey);
    }
    return null;
  }
  // Método para Insertar o Actualizar el token
  setToken(token: string) {
    if (typeof window !== 'undefined') {
      return localStorage.setItem(this.tokenkey, token);
    }
    return null;
  }

  getExpirationDate(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.expKey);
    }
    return null;
  }

  setExpiirationDate(expKey: string){
    if (typeof window !== 'undefined') {
      return localStorage.setItem(this.expKey, expKey);
    }
    return null;
  }


  // Método para Obtener el Usuario
  getUsuario(): Usuario | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.dataUser);
      return userData ? JSON.parse(userData) : null;  // Parseamos el string a un objeto Usuario
    }
    return null;
  }
  // Método para Insertar o Actualizar el Usuario
  setUsuario(usuario: Usuario) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.dataUser, JSON.stringify(usuario));  // Guardamos el objeto como string
    }
  }

  // Método para eliminar el token - Usuario y realizar logout
  logout() {
    localStorage.removeItem(this.tokenkey);
    localStorage.removeItem(this.dataUser); 
    localStorage.removeItem(this.expKey);
  
    this.router.navigate(['/login']);
  }

  isTokenExpired(): boolean {
    const expirationDate = this.getExpirationDate();
    if (expirationDate) {
      const currentDate = new Date();
      const expDate = new Date(expirationDate);
      return currentDate > expDate; // Si la fecha actual es posterior a la fecha de expiración, el token ha expirado
    }
    return true; // Si no hay fecha de expiración, consideramos que el token ha expirado
  }
  
  logoutIfExpired() {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }
}
