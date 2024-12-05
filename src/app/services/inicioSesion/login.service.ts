import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8090/auth/login'
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any>{
    const loginData = { username, password };
    return this.http.post(`${this.baseUrl}`, loginData);
  }
}
