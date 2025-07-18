import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect]
})
export class AddUserPage implements OnInit {
  usuario = {
    nombreCompleto: '',
    correo: '',
    telefono: '',
    tipoUsuario: '',
    idioma: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {
    // Expresiónes regulares
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+\d+$/;

    this.usuario.nombreCompleto = (<HTMLInputElement>document.getElementById('nombreCompleto')).value;
    this.usuario.correo = (<HTMLInputElement>document.getElementById('correo')).value;
    this.usuario.telefono = (<HTMLInputElement>document.getElementById('telefono')).value;
    this.usuario.tipoUsuario = (<HTMLInputElement>document.getElementById('tipoUsuario')).value;
    this.usuario.idioma = (<HTMLInputElement>document.getElementById('idioma')).value;

    if (!emailRegex.test(this.usuario.correo)) {
      alert("El correo no es válido");
      return;
    }

    if (this.usuario.telefono.trim() !== "" && !phoneRegex.test(this.usuario.telefono)) {
      alert("El número de teléfono no es válido");
      return;
    }

    // Verificar que se hayan seleccionado los valores
    if (this.usuario.nombreCompleto.trim() === "") {
      alert('Por favor, complete los campos necesarios');
      return;
    }

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/usuarios`, this.usuario).toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Usuario creado correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/user-management']);
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
  
      let errorMessage = 'No se pudo crear el usuario. Inténtalo de nuevo.';
  
      // Si el error viene del servidor y es un 400, mostrar mensaje personalizado
      if (error.status === 400 && error.error?.error) {
        errorMessage = error.error.error;
      }
  
      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
