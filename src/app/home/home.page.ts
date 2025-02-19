import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem } from '@ionic/angular/standalone';
import { mailOutline, eyeOff, eye, lockClosedOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem],
})
export class HomePage implements OnInit{
  private passwordVisible = false;
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {
    addIcons({
      mailOutline,
      eyeOff,
      lockClosedOutline,
      eye
    })
  }

  ngOnInit() {
  }

  toggleLoginPasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    var toggleIconName = (<HTMLInputElement>document.getElementById('togglePassword'));

    if (!this.passwordVisible) {
      passwordInput.type = 'text';
      toggleIconName.name = 'eye';
      this.passwordVisible = true;
    } else {
      passwordInput.type = 'password';
      toggleIconName.name = 'eye-off';
      this.passwordVisible = false;
    }
  }

  vaciarCampos() {
    (document.getElementById('emailLogin') as HTMLInputElement).value = '';
    (document.getElementById('password') as HTMLInputElement).value = '';
  }

  onSubmit() {
    const email = (<HTMLInputElement>document.getElementById('emailLogin')).value;
    const password = (<HTMLInputElement>document.getElementById('password')).value;
  
    // Llamar al servicio de login
    this.loginService.login(email, password).subscribe({
      next: (response) => {
        if (response.setPassword) {
          const navigationExtras: NavigationExtras = {
            state: {
              usuarioId: response.usuarioId,
              message: response.message,
              email: email
            }
          };
          this.router.navigate(['/change-password'], navigationExtras);
          this.vaciarCampos();
        } else {
          // Login exitoso: verificar el tipo de usuario
          const navigationExtras: NavigationExtras = {
            state: {
              usuario: response.usuario
            }
          };

          if (response.usuario && response.usuario.tipo_usuario) {
            if (response.usuario.tipo_usuario === 'operador') {
              this.router.navigate(['/select-place'], navigationExtras);
              this.vaciarCampos();
            } else if (response.usuario.tipo_usuario === 'administrador') {
              this.router.navigate(['/administrator-panel'], navigationExtras);
              this.vaciarCampos();
            } else {
              console.error('Tipo de usuario desconocido:', response.usuario.tipo_usuario);
              alert('Tipo de usuario no reconocido.');
            }
          } else {
            console.error('Respuesta de login sin usuario o tipo_usuario.');
            alert('Error de autenticación.');
          }
        }
      },
      error: (error) => {
        console.error('Error de autenticación:', error);
        alert('Error de autenticación. Por favor, revisa tus credenciales.');
      }
    });
  }
}
