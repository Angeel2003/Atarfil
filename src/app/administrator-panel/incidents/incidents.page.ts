import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonListHeader, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  styleUrls: ['./incidents.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonLabel, IonListHeader, IonCard, IonCardContent]
})
export class IncidentsPage implements ViewWillEnter {
  incidents: any[] = [];
  completedTasks: any[] = [];
  private apiUrl = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) { }

  ionViewWillEnter() {
    this.loadIncidencias();
    this.loadCompletedTasks();
  }

  loadIncidencias() {
    this.http.get<any[]>(`${this.apiUrl}/incidencias`).subscribe({
      next: (data) => {
        this.incidents = data;
      },
      error: (err) => {
        console.error('Error al cargar incidencias:', err);
      }
    });
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

  goToAddUrgentTask() {
    this.router.navigate(['/add-urgent-task']);
  }

  goToAddPeriodicTask() {
    this.router.navigate(['/add-periodic-task']);
  }

  goIncident(id: number) {
    const navigationExtras: NavigationExtras = {
          state: {
            incident: this.incidents.find(inc => inc.id === id)
          }
        };
        this.router.navigate(['/incident-detail'], navigationExtras);
  }

  goCompletedTask(id: number) {
    const navigationExtras: NavigationExtras = {
          state: {
            task: this.completedTasks.find(inc => inc.id === id)
          }
        };
        this.router.navigate(['/completed-task-detail'], navigationExtras);
  }

}
