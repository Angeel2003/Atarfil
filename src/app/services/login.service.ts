import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // URL de tu endpoint de login en el backend
  private loginUrl = environment.apiUrl + 'api/login';
  private updatePasswordUrl = environment.apiUrl + 'api/update-password';

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
