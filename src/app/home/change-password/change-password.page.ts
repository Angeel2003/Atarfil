import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem } from '@ionic/angular/standalone';

import { mailOutline, eyeOff, eye, lockClosedOutline, printOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem],
})
export class ChangePasswordPage implements OnInit {
  private passwordVisible = false;
  usuarioId!: string;
  
  constructor(private loginService: LoginService, private router: Router) {
    addIcons({
      mailOutline,
      eyeOff,
      lockClosedOutline,
      eye
    })
  }

  ngOnInit() {
    // Por ejemplo, obtenemos el usuarioId desde el estado de navegación:
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['usuarioId']) {
      this.usuarioId = navigation.extras.state['usuarioId'];
    } else {
      console.error('No se recibió el usuarioId');
    }
  }

  toggleChangePasswordVisibility() {
    const passwordInput = document.getElementById('change-password') as HTMLInputElement;
    var toggleIconName = (<HTMLInputElement>document.getElementById('toggleChangePassword'));

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

  toggleChangeRepeatPasswordVisibility() {
    const passwordInput = document.getElementById('repeat-password') as HTMLInputElement;
    var toggleIconName = (<HTMLInputElement>document.getElementById('toggleRepeatPassword'));

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

  onSubmit(){
    const password = (<HTMLInputElement>document.getElementById('change-password')).value;
    const repeatPassword = (<HTMLInputElement>document.getElementById('repeat-password')).value;
    
    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    this.loginService.updatePassword(this.usuarioId, password).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error actualizando contraseña:', error);
        alert('Hubo un error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
      }
    });
  }
}
