import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.page.html',
  styleUrls: ['./select-zone.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonButtons, IonButton, IonIcon, IonItem, IonSelect,IonSelectOption]
})
export class SelectZonePage implements OnInit {
  zonas: string[] = ['Aljibe', 'M5'];
  selectedZone: string = '';
  usuario: any;
  lugar: string = '';

  constructor(private router: Router) {
    addIcons({
      logOutOutline
    })
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
  }

  onSelect() {
    // Verificar que se haya seleccionado un valor
    if (!this.selectedZone || this.selectedZone.trim() === "") {
      alert('Por favor, seleccione una zona de operación.');
      return;
    }

    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        lugar: this.lugar,
        zona: this.selectedZone
      }
    };
    this.router.navigate(['/operator-panel'], navigationExtras);
  }

  exit() {
    this.router.navigate(['/home']);
  }
}
