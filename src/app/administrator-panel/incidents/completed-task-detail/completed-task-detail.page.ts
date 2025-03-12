import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, IonButton, IonBackButton, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-completed-task-detail',
  templateUrl: './completed-task-detail.page.html',
  styleUrls: ['./completed-task-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonBackButton, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class CompletedTaskDetailPage implements OnInit {
  completedTasks: any[] = [];
  task: any;
  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['task']) {
      this.task = navigation.extras.state['task'];
    } else {
      console.error('No se recibió la tarea en NavigationExtras.');
    }

    this.loadCompletedTasks();
  }

  loadCompletedTasks() {
    this.http.get<any[]>(`${this.apiUrl}/tareas-urgentes-completadas`).subscribe({
      next: (data) => {
        this.completedTasks = data.map(tarea => {
          const fecha = new Date(tarea.fecha);
          const [hours, minutes, seconds] = tarea.hora.split(':').map(Number);
          const fechaCompleta = new Date(fecha);
          fechaCompleta.setHours(hours, minutes, seconds || 0);
          return { ...tarea, fechaCompleta };
        });
      },
      error: (err) => {
        console.error('Error al cargar tareas completadas:', err);
      }
    });
  }

  // Muestra una ventana de confirmación para eliminar la tarea
  async confirmDelete(task: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar la tarea?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteTask(task);
          }
        }
      ]
    });
    await alert.present();
  }

  // Eliminar la incidencia mediante el endpoint DELETE
  deleteTask(taskId: number) {
    this.http.delete(`${this.apiUrl}/tareas-urgentes-completadas/${taskId}`).subscribe({
      next: (response) => {
        // Eliminar la tarea urgente completada de la lista
        this.completedTasks = this.completedTasks.filter(task => task.id !== taskId);
        this.router.navigate(['/incidents']);
      },
      error: (err) => {
        console.error('Error al eliminar la tarea urgente:', err);
      }
    });
  }  
}
