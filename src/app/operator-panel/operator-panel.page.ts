import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operator-panel',
  templateUrl: './operator-panel.page.html',
  styleUrls: ['./operator-panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon]
})
export class OperatorPanelPage implements OnInit {
  usuario: any;
  lugar: string = '';
  zona: string = '';

  constructor(private router: Router) { }

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

    const navigationZone = this.router.getCurrentNavigation();
    if (navigationZone?.extras.state && navigationZone.extras.state['zona']) {
      this.zona = navigationZone.extras.state['zona'];
    } else {
      console.error('No se recibió el lugar en NavigationExtras.');
    }
  }

}
