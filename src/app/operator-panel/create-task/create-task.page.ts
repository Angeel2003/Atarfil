import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea]
})
export class CreateTaskPage implements OnInit {
  tarea = {
    tipo_actuacion: '',
    hora_inicio: '',
    hora_fin: '',
    fecha: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
  }

  async onSubmit() {
    this.tarea.tipo_actuacion = (<HTMLInputElement>document.getElementById('tipo_actuacion')).value;
    this.tarea.hora_inicio = (<HTMLInputElement>document.getElementById('hora_inicio')).value;
  
    if (this.tarea.tipo_actuacion.trim() === "" || this.tarea.hora_inicio.trim() === "") {
      alert('Por favor, complete los campos necesarios');
      return;
    }
  
    // Añadir automáticamente hora de fin y fecha actual
    const ahora = new Date();
    this.tarea.hora_fin = ahora.toTimeString().split(' ')[0];
    this.tarea.fecha = ahora.toISOString().split('T')[0];
  
    try {
      const response = await this.http.post<any>(`${this.apiUrl}/tareas_completadas`, this.tarea).toPromise();
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tarea creada correctamente',
        buttons: ['OK']
      });
      await alert.present();
  
      this.router.navigate(['/operator-panel']);
    } catch (error: any) {
      console.error('Error al crear tarea:', error);
  
      let errorMessage = 'No se pudo crear la tarea. Inténtalo de nuevo.';
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
