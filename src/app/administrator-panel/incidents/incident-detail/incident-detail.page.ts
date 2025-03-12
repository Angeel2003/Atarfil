import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, IonButton, IonButtons, IonBackButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-incident-detail',
  templateUrl: './incident-detail.page.html',
  styleUrls: ['./incident-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent]
})
export class IncidentDetailPage implements OnInit {
  incidents: any[] = [];
  incident: any;
  private apiUrl = 'http://localhost:3000/incidencias';

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['incident']) {
      this.incident = navigation.extras.state['incident'];
    } else {
      console.error('No se recibió el incidente en NavigationExtras.');
    }

    this.loadIncidencias();
  }

  loadIncidencias() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.incidents = data;
      },
      error: (err) => {
        console.error('Error al cargar incidencias:', err);
      }
    });
  }

  goToAddUrgentTask() {
    this.router.navigate(['/add-urgent-task']);
  }

  // Muestra una ventana de confirmación para eliminar la incidencia
  async confirmDelete(incident: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar la incidencia?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteIncident(incident.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // Eliminar la incidencia mediante el endpoint DELETE
  deleteIncident(incidentId: number) {
    this.http.delete(`${this.apiUrl}/${incidentId}`).subscribe({
      next: (response) => {
        this.incidents = this.incidents.filter(u => u.id !== incidentId);
        this.router.navigate(['/incidents']);
      },
      error: (err) => {
        console.error('Error al eliminar incidencia:', err);
      }
    });
  }
}
