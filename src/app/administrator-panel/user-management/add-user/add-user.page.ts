import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {
    this.usuario.nombreCompleto = (<HTMLInputElement>document.getElementById('nombreCompleto')).value;

    // try {
    //   const response = await this.http.post<any>(`${this.apiUrl}/usuarios`, this.usuario).toPromise();

    //   const alert = await this.alertController.create({
    //     header: 'Éxito',
    //     message: 'Usuario creado correctamente',
    //     buttons: ['OK']
    //   });
    //   await alert.present();

    //   // Después de crear el usuario, se puede navegar a la página de gestión de usuarios
    //   this.router.navigate(['/user-management']);
    // } catch (error) {
    //   console.error('Error al crear usuario:', error);
    //   const alert = await this.alertController.create({
    //     header: 'Error',
    //     message: 'No se pudo crear el usuario. Inténtalo de nuevo.',
    //     buttons: ['OK']
    //   });
    //   await alert.present();
    // }
  }

}
