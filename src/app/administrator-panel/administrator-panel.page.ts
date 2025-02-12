import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-administrator-panel',
  templateUrl: './administrator-panel.page.html',
  styleUrls: ['./administrator-panel.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton, IonIcon]
})
export class AdministratorPanelPage implements OnInit {

  constructor(private router: Router) {
    addIcons({
      logOutOutline
    })
  }

  ngOnInit() {
  }

  exit() {
    this.router.navigate(['/home']);
  }

}
