import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem } from '@ionic/angular/standalone';

import { mailOutline, eyeOff, eye, lockClosedOutline, printOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput, IonItem],
})
export class ChangePasswordPage implements OnInit {
  private passwordVisible = false;
  
    constructor(private router: Router) {
      addIcons({
        mailOutline,
        eyeOff,
        lockClosedOutline,
        eye
      })
    }
  
    ngOnInit() {
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
      const password = (<HTMLInputElement>document.getElementById('password')).value;
      const repeatPassword = (<HTMLInputElement>document.getElementById('repeat-password')).value;
        const contrasena = { password: password, repeatPassword: repeatPassword };
    
      // Enviar los datos del perfil
      const navigationExtras: NavigationExtras = {
        state: {
          contrasena: contrasena
        }
      };
      this.router.navigate(['/select-place'], navigationExtras);
    }
}
