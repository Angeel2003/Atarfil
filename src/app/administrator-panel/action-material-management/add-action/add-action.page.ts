import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.page.html',
  styleUrls: ['./add-action.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput]
})
export class AddActionPage implements OnInit {
  accion = {
    nombre: '',
    descripcion: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {

    this.accion.nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
    this.accion.descripcion = (<HTMLInputElement>document.getElementById('descripcion')).value;

    // Verificar que se hayan seleccionado los valores
    if (this.accion.nombre.trim() === "" || this.accion.descripcion.trim() === "") {
      alert('Por favor, complete los campos necesarios');
      return;
    }

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/acciones`, this.accion).toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Acción creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/action-material-management']);
    } catch (error: any) {
      console.error('Error al crear acción:', error);
  
      let errorMessage = 'No se pudo crear la acción. Inténtalo de nuevo.';
  
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
