import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-administrator-panel',
  templateUrl: './administrator-panel.page.html',
  styleUrls: ['./administrator-panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon]
})
export class AdministratorPanelPage implements OnInit {
  usuario: any;

  constructor(private router: Router) {
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
  }

  exit() {
    this.router.navigate(['/home']);
  }

}
