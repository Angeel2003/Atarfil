import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-urgent-task',
  templateUrl: './add-urgent-task.page.html',
  styleUrls: ['./add-urgent-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect, IonTextarea]
})
export class AddUrgentTaskPage implements OnInit {
  tarea_urgente = {
    usuario_asignado: [] as number[],
    tarea_a_asignar: '',
    fecha: '',
    hora: ''
  };

  usuarios: any[] = [];

  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.http.get<any[]>(`${this.apiUrl}/usuarios-operadores`).subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al obtener operadores:', err);
      }
    });
  }

  async onSubmit() {
    if (this.tarea_urgente.usuario_asignado.length === 0 || this.tarea_urgente.tarea_a_asignar.trim() === "" ||
    this.tarea_urgente.fecha.trim() === "" || this.tarea_urgente.hora.trim() === "") {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const dataToSend = {
      ...this.tarea_urgente,
      usuario_asignado: JSON.stringify(this.tarea_urgente.usuario_asignado)
    };

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/tareas-urgentes`, dataToSend).toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tarea urgente creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.tarea_urgente = {
        usuario_asignado: [],
        tarea_a_asignar: '',
        fecha: '',
        hora: ''
      };

      this.router.navigate(['/incidents']);
    } catch (error: any) {
      console.error('Error al crear tarea urgente:', error);

      let errorMessage = 'No se pudo crear la tarea urgente. Inténtalo de nuevo.';

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
