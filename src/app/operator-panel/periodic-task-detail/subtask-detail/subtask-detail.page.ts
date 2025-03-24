import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  zona: any;
  incidencia: any = {
    tipo_actuacion: '',
    material_necesario: '',
    hora_inicio: '',
    hora_fin: '',
    otros: ''
  };
  horaInicio: string = '';
  horaFin: string = '';
  esEditable: boolean = true;

  private apiUrl = environment.apiUrl;

  constructor(private navCtrl: NavController, private http: HttpClient, private router: Router, private alertCtrl: AlertController) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.subtarea = nav.extras.state['subtarea'];
      this.tarea = nav.extras.state['tarea'];
      this.zona = nav.extras.state['zona'];

      if (this.subtarea.incidencia) {
        this.incidencia = { ...this.subtarea.incidencia };
      }

      if (this.subtarea.estado === 'completado' || this.subtarea.estado === 'en-pausa') {
        this.esEditable = false;
      }
    }
  }

  ngOnInit() {
    if (!this.incidencia.hora_inicio) {
      this.horaInicio = this.getFormattedTime();
      this.incidencia.hora_inicio = this.horaInicio;
    }
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

    this.subtarea.incidencia = { ...this.incidencia };
    this.esEditable = false;

    await this.actualizarEstado();
  }

  async marcarComoEnPausa() {
    if (!this.incidencia.tipo_actuacion.trim()) {
      const alert = await this.alertCtrl.create({
        header: 'Aviso',
        message: 'Debes ingresar un "Tipo de Actuación" para registrar la incidencia.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.subtarea.estado = 'en-pausa';

    this.subtarea.incidencia = { ...this.incidencia };
    this.esEditable = false;

    try {
      await this.http.post(`${this.apiUrl}/incidencias`, {
        area: this.tarea.area,
        zona: this.zona,
        subzona: this.subtarea.nombre,
        tipo_actuacion: this.incidencia.tipo_actuacion,
        material_necesario: this.incidencia.material_necesario || null,
        hora_inicio: this.incidencia.hora_inicio,
        hora_fin: this.getFormattedTime(),
        otros: this.incidencia.otros || null
      }).toPromise();
  
      const successAlert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Incidencia creada correctamente.',
        buttons: ['OK']
      });
      await successAlert.present();
  
    } catch (error) {
      console.error('Error al registrar la incidencia:', error);
      const errorAlert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo registrar la incidencia. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }

    await this.actualizarEstado();
  }

  async actualizarEstado() {
    this.router.navigate(['/periodic-task-detail'], { state: { tarea: this.tarea } });
  }

}
