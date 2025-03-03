import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  styleUrls: ['./incidents.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonLabel]
})
export class IncidentsPage implements ViewWillEnter {
  incidents: any[] = [];
  private apiUrl = 'http://localhost:3000/incidencias';

  constructor(private router: Router, private http: HttpClient) { }

  ionViewWillEnter() {
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

}
