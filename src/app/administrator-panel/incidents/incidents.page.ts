import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  styleUrls: ['./incidents.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonLabel]
})
export class IncidentsPage implements OnInit {
  incidents: any[] = [];
  private apiUrl = 'http://localhost:3000/incidencias';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
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

}
