import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonLabel, IonListHeader, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-operator-panel',
  templateUrl: './operator-panel.page.html',
  styleUrls: ['./operator-panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonLabel, IonListHeader, IonCard, IonCardContent]
})
export class OperatorPanelPage implements OnInit {
  usuario: any;
  lugar: string = '';
  tareas_periodicas: any[] = [];
  tareas_urgentes: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {

    addIcons({
          logOutOutline
    })

    this.router.events.subscribe(() => {
      this.loadTareas();
    });
  }

  ngOnInit() {
    const navigationUser = this.router.getCurrentNavigation();
    if (navigationUser?.extras.state && navigationUser.extras.state['usuario']) {
      this.usuario = navigationUser.extras.state['usuario'];
    } else {
      console.error('No se recibió el usuario en NavigationExtras.');
    }

    const navigationPlace = this.router.getCurrentNavigation();
    if (navigationPlace?.extras.state && navigationPlace.extras.state['lugar']) {
      this.lugar = navigationPlace.extras.state['lugar'];
    } else {
      console.error('No se recibió el lugar en NavigationExtras.');
    }

    this.loadTareas();
  }

  loadTareas() {
    // Obtener tareas periodicas
    this.http.get<any[]>(`${this.apiUrl}/tareas-a-realizar`).subscribe({
      next: (data) => {
        this.tareas_periodicas = data;
      },
      error: (err) => {
        console.error('Error al cargar tareas periódicas:', err);
      }
    });

    // Obtener tareas urgentes del operador
    this.http.get<any[]>(`${this.apiUrl}/tareas-urgentes/${this.usuario.id}`).subscribe({
      next: (data) => {
        this.tareas_urgentes = data.map(tarea => {
          const fecha = new Date(tarea.fecha);
          const [hours, minutes, seconds] = tarea.hora.split(':').map(Number);
          const fechaCompleta = new Date(fecha);
          fechaCompleta.setHours(hours, minutes, seconds || 0);
          return { ...tarea, fechaCompleta };
        });
      },
      error: (err) => {
        console.error('Error al cargar tareas urgentes:', err);
      }
    });
  }

  verTareaUrgente(tarea: any) {
    this.router.navigate(['/urgent-task-detail'], { state: { tarea } });
  }

  verTareaPeriodica(tarea: any) {
    this.router.navigate(['/periodic-task-detail'], { state: { tarea } });
  }

  goToCreateTask() {
    this.router.navigate(['/create-task']);
  }
  
  goToManuals() {
    this.router.navigate(['/manuals']);
  }

  exit() {
    this.router.navigate(['/home']);
  }
  
}
