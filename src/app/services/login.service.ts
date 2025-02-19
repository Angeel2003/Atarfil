import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // URL de tu endpoint de login en el backend
  private loginUrl = 'http://localhost:3000/api/login';
  private updatePasswordUrl = 'http://localhost:3000/api/update-password';

  constructor(private http: HttpClient) { }

  // Método para realizar el login
  login(email: string, password: string): Observable<any> {
    const payload = {
      correo_electronico: email,
      password: password
    };

    return this.http.post<any>(this.loginUrl, payload);
  }

  updatePassword(usuarioId: string, newPassword: string): Observable<any> {
    const payload = {
      usuarioId,
      newPassword };

    return this.http.post<any>(this.updatePasswordUrl, payload);
  }
}
