import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonCheckbox } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-periodic-task-detail',
  templateUrl: './periodic-task-detail.page.html',
  styleUrls: ['./periodic-task-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonCheckbox]
})
export class PeriodicTaskDetailPage implements OnInit {
  tarea: any;
  private apiUrl = 'http://localhost:3000/tareas-a-realizar';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({
      checkmarkCircle,
      closeCircle
    })
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['tarea']) {
      this.tarea = navigation.extras.state['tarea'];
  
      this.tarea.zonas.forEach((zona: any) => {
        zona.subtareas = zona.subtareas.map((subtarea: any) => ({
          nombre: subtarea,
          estado: subtarea.estado || 'no-iniciada'
        }));
      });
    } else {
      console.error('No se recibió la tarea.');
      this.router.navigate(['/operator-panel']);
    }
  }  

  verDetallesSubtarea(subtarea: any) {
    this.router.navigate(['/subtask-detail'], { state: { subtarea, tarea: this.tarea } });
  }
  

  async completarTarea() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Has completado todas las subtareas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Completar',
          handler: async () => {
            try {
              await this.http.delete(`${this.apiUrl}/${this.tarea.id}`).toPromise();
              
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'Tarea completada correctamente',
                buttons: ['OK']
              });
              await successAlert.present();

              this.router.navigate(['/operator-panel']);
            } catch (error) {
              console.error('Error al completar la tarea:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo completar la tarea. Inténtalo de nuevo.',
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
