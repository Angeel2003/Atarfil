import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel]
})
export class UserManagementPage implements ViewWillEnter {
  users: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({
      trash
    })
  }
  
  ionViewWillEnter() {
    this.loadUsers();
  }

  // Método para obtener la lista de usuarios desde el backend
  loadUsers() {
    this.http.get<any[]>(`${this.apiUrl}/usuarios`).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  goToAddUser() {
    this.router.navigate(['/add-user']);
  }

  // Muestra una ventana de confirmación para eliminar al usuario
  async confirmDelete(user: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar al usuario ${user.nombre_completo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteUser(user.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // Eliminar el usuario mediante el endpoint DELETE
  deleteUser(userId: number) {
    this.http.delete(`${this.apiUrl}/usuarios/${userId}`).subscribe({
      next: (response) => {
        // Actualiza la lista de usuarios local eliminando el usuario borrado
        this.users = this.users.filter(u => u.id !== userId);
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
      }
    });
  }
}
