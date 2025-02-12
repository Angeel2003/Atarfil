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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSelect() {
    const place = (<HTMLInputElement>document.getElementById('placeSelected')).value;

    // Enviar los datos del perfil
    const navigationExtras: NavigationExtras = {
      state: {
        place: place
      }
    };
    this.router.navigate(['/select-zone'], navigationExtras);
  }
}
