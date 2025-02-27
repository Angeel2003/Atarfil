import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-periodic-task',
  templateUrl: './add-periodic-task.page.html',
  styleUrls: ['./add-periodic-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AddPeriodicTaskPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
