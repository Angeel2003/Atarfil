import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.page.html',
  styleUrls: ['./add-material.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput]
})
export class AddMaterialPage implements OnInit {
  material = {
    nombre: '',
    descripcion: '',
    codigo: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {

    this.material.nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
    this.material.descripcion = (<HTMLInputElement>document.getElementById('descripcion')).value;
    this.material.codigo = (<HTMLInputElement>document.getElementById('codigo')).value;

    // Verificar que se hayan seleccionado los valores
    if (this.material.nombre.trim() === "" || this.material.descripcion.trim() === "" || this.material.codigo.trim() === "") {
      alert('Por favor, complete los campos necesarios');
      return;
    }

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/materiales`, this.material).toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Material creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/action-material-management']);
    } catch (error: any) {
      console.error('Error al crear material:', error);
  
      let errorMessage = 'No se pudo crear el material. Inténtalo de nuevo.';
  
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
