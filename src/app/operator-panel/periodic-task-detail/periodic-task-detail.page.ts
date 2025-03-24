import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonCheckbox } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-periodic-task-detail',
  templateUrl: './periodic-task-detail.page.html',
  styleUrls: ['./periodic-task-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonCheckbox]
})
export class PeriodicTaskDetailPage implements OnInit {
  tarea: any;
  private apiUrl = environment.apiUrl + '/tareas-a-realizar';

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

  verDetallesSubtarea(subtarea: any, zona: any) {
    this.router.navigate(['/subtask-detail'], { state: { subtarea, tarea: this.tarea, zona } });
  }
  
  async completarTarea() {
    const haySubtareasNoIniciadas = this.tarea.zonas.some((zona: any) =>
      zona.subtareas.some((sub: any) => sub.estado === 'no-iniciada')
    );
  
    if (haySubtareasNoIniciadas) {
      const alerta = await this.alertController.create({
        header: 'Tarea incompleta',
        message: 'No puedes terminar la tarea hasta que todas las subtareas estén revisadas o pausadas.',
        buttons: ['Entendido']
      });
      await alerta.present();
      return;
    }
  
    // Confirmación final
    const confirmacion = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Has completado todas las subtareas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Completar',
          handler: async () => {
            try {
              await this.http.request('DELETE', `${this.apiUrl}/${this.tarea.tarea_realizar_id}`, { body: { tarea: this.tarea } }).toPromise();

              const exito = await this.alertController.create({
                header: 'Éxito',
                message: 'Tarea completada correctamente.',
                buttons: ['OK']
              });
              await exito.present();
  
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
  
    await confirmacion.present();
  }  
}
