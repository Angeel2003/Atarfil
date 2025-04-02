import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrator-panel',
  templateUrl: './administrator-panel.page.html',
  styleUrls: ['./administrator-panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonToggle]
})
export class AdministratorPanelPage implements OnInit {
  usuario: any;
  incidenciasHabilitadas: boolean = true;
  
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {
    addIcons({
      logOutOutline
    })
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['usuario']) {
      this.usuario = navigation.extras.state['usuario'];
    } else {
      console.error('No se recibió el usuario en NavigationExtras.');
    }

    this.http.get<any>(`${this.apiUrl}/config/incidencia-en-pausa`).subscribe(data => {
      this.incidenciasHabilitadas = data.habilitado;
    });
  }

  actualizarConfig() {
    this.http.patch(`${this.apiUrl}/config/incidencia-en-pausa`, {
      habilitado: this.incidenciasHabilitadas
    }).subscribe();
  }

  goToUserManagement() {
    this.router.navigate(['/user-management']);
  }

  goToActionMaterialManagement() {
    this.router.navigate(['/action-material-management']);
  }

  goToIncidents() {
    this.router.navigate(['/incidents']);
  }

  goToPDFReports() {
    this.router.navigate(['/pdf-reports']);
  }

  exit() {
    this.router.navigate(['/home']);
  }

}
