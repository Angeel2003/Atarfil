import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subtask-detail',
  templateUrl: './subtask-detail.page.html',
  styleUrls: ['./subtask-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonBackButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea]
})
export class SubtaskDetailPage implements OnInit {
  subtarea: any = {};
  tarea: any = {};
  incidencia: any = {
    tipo_actuacion: '',
    material_necesario: '',
    hora_inicio: '',
    hora_fin: '',
    otros: ''
  };
  horaInicio: string = '';
  horaFin: string = '';

  private apiUrl = 'http://localhost:3000';

  constructor(private navCtrl: NavController, private http: HttpClient, private router: Router, private alertCtrl: AlertController) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.subtarea = nav.extras.state['subtarea'];
      this.tarea = nav.extras.state['tarea'];
    }
  }

  ngOnInit() {
    this.horaInicio = this.getFormattedTime();
    this.incidencia.hora_inicio = this.horaInicio;
  }

  // Función para obtener la hora en formato HH:MM:SS
  private getFormattedTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  async marcarComoCompletado() {
    this.horaFin = this.getFormattedTime();
    this.subtarea.estado = 'completado';
    this.incidencia.hora_fin = this.horaFin;
    await this.actualizarEstado();
  }

  async marcarComoEnPausa() {
    this.subtarea.estado = 'en-pausa';
    await this.actualizarEstado();
  }

  async actualizarEstado() {
    this.router.navigate(['/periodic-task-detail'], { state: { tarea: this.tarea } });
  }

}
