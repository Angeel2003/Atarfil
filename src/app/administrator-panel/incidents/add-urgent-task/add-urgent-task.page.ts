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
    usuario_asignado: '',
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
    this.tarea_urgente.usuario_asignado = (<HTMLInputElement>document.getElementById('usuario_asignado')).value;
    this.tarea_urgente.tarea_a_asignar = (<HTMLInputElement>document.getElementById('tarea_a_asignar')).value;
    this.tarea_urgente.fecha = (<HTMLInputElement>document.getElementById('fecha')).value;
    this.tarea_urgente.hora = (<HTMLInputElement>document.getElementById('hora')).value;

    // Verificar que se hayan seleccionado los valores
    if (this.tarea_urgente.usuario_asignado === "" || this.tarea_urgente.tarea_a_asignar.trim() === ""
        || this.tarea_urgente.fecha.trim() === "" || this.tarea_urgente.hora.trim() === "") {
      alert('Por favor, complete los campos necesarios');
      return;
    }

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/tareas-urgentes`, this.tarea_urgente).toPromise();

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tarea urgente creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/incidents']);
    } catch (error) {
      console.error('Error al crear tarea urgente:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo crear la tarea urgente. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
