import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.page.html',
  styleUrls: ['./select-zone.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonButtons, IonBackButton, IonButton, IonIcon, IonItem, IonSelect,IonSelectOption]
})
export class SelectZonePage implements OnInit {
  zonas: string[] = ['Aljibe', 'M5'];
  selectedZone: string = '';

  constructor(private router: Router) {
    addIcons({
      logOutOutline
    })
  }

  ngOnInit() {
  }

  onSelect() {
    const zone = (<HTMLInputElement>document.getElementById('zoneSelected')).value;

    // Enviar los datos del perfil
    const navigationExtras: NavigationExtras = {
      state: {
        zone: zone
      }
    };
    this.router.navigate(['/administrator-panel'], navigationExtras);
  }

  exit() {
    this.router.navigate(['/home']);
  }
}
