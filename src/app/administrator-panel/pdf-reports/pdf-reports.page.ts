import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { cloudDownloadOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-pdf-reports',
  templateUrl: './pdf-reports.page.html',
  styleUrls: ['./pdf-reports.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel]
})
export class PdfReportsPage implements ViewWillEnter {
  reports: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private alertController: AlertController) {
    addIcons({
      cloudDownloadOutline
    })
  }
  
  ionViewWillEnter() {
    this.loadReports();
  }

  // Método para obtener la lista de reportes desde el backend
  loadReports() {
    this.http.get<any[]>(`${this.apiUrl}/reportes-pdf`).subscribe({
      next: (data) => {
        this.reports = data;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
      }
    });
  }

  downloadReport(report: any) {
    const fileName = report.nombre_archivo;
    const url = `${this.apiUrl}/reportes/${fileName}`;
  
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(a.href);
    }, error => {
      console.error('Error al descargar el PDF:', error);
    });
  }

}
