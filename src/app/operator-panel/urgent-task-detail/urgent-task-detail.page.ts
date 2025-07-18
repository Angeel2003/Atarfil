import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-urgent-task-detail',
  templateUrl: './urgent-task-detail.page.html',
  styleUrls: ['./urgent-task-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonCard, IonCardHeader, IonCardContent, IonCardTitle]
})
export class UrgentTaskDetailPage implements OnInit {
  tarea: any;
  private apiUrl = environment.apiUrl + '/tareas-urgentes';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['tarea']) {
      this.tarea = navigation.extras.state['tarea'];

      if (typeof this.tarea.fecha === 'string') {
        this.tarea.fecha = new Date(this.tarea.fecha);
      }

      if (typeof this.tarea.hora === 'string') {
        const [hours, minutes, seconds] = this.tarea.hora.split(':').map(Number);
        this.tarea.fechaCompleta = new Date(this.tarea.fecha); // Clonamos la fecha
        this.tarea.fechaCompleta.setHours(hours, minutes, seconds || 0);
      }
    } else {
      console.error('No se recibió la tarea.');
      this.router.navigate(['/operator-panel']);
    }
  }

  async confirmNotification() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres marcar esta tarea como completada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Completar',
          handler: async () => {
            try {
              await this.http.patch(`${this.apiUrl}/${this.tarea.id}/completar`, {}).toPromise();
              
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Tarea marcada como completada',
                buttons: ['OK']
              });
              await successAlert.present();
  
              this.router.navigate(['/operator-panel']);
            } catch (error) {
              console.error('Error al marcar la tarea como completada:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo marcar la tarea. Inténtalo de nuevo.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }  
}
