import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-select-place',
  templateUrl: './select-place.page.html',
  styleUrls: ['./select-place.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonButtons, IonBackButton, IonButton, IonIcon, IonItem, IonSelect,IonSelectOption]
})
export class SelectPlacePage implements OnInit {
  lugares: string[] = ['Granada', 'Dubai'];
  selectedLocation: string = '';
  usuario: any;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['usuario']) {
      this.usuario = navigation.extras.state['usuario'];
    } else {
      console.error('No se recibió el usuario en NavigationExtras.');
    }
  }

  onSelect() {
    // Verificar que se haya seleccionado un valor
    if (!this.selectedLocation || this.selectedLocation.trim() === "") {
      alert('Por favor, seleccione un lugar de operación.');
      return;
    }

    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        lugar: this.selectedLocation
      }
    };
    this.router.navigate(['/operator-panel'], navigationExtras);
  }
}
