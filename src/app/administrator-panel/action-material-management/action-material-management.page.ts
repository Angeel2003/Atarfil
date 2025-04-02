import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonList, IonItem, IonLabel, IonListHeader } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';

import { trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-action-material-management',
  templateUrl: './action-material-management.page.html',
  styleUrls: ['./action-material-management.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonList, IonItem, IonLabel, IonListHeader]
})
export class ActionMaterialManagementPage implements ViewWillEnter {
  actions: any[] = [];
  materials: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({
      trash
    })
  }
  
  ionViewWillEnter() {
    this.loadActions();
    this.loadMaterials();
  }

  // Método para obtener la lista de acciones desde el backend
  loadActions() {
    this.http.get<any[]>(`${this.apiUrl}/acciones`).subscribe({
      next: (data) => {
        this.actions = data;
      },
      error: (err) => {
        console.error('Error al cargar acciones:', err);
      }
    });
  }

  // Método para obtener la lista de materiales desde el backend
  loadMaterials() {
    this.http.get<any[]>(`${this.apiUrl}/materiales`).subscribe({
      next: (data) => {
        this.materials = data;
      },
      error: (err) => {
        console.error('Error al cargar materiales:', err);
      }
    });
  }

  goToAddAction() {
    this.router.navigate(['/add-action']);
  }

  goToAddMaterial() {
    this.router.navigate(['/add-material']);
  }

  // Muestra una ventana de confirmación para eliminar la accion
  async confirmDeleteAction(action: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar la accion ${action.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteAction(action.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // Muestra una ventana de confirmación para eliminar el material
  async confirmDeleteMaterial(material: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar el material ${material.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteMaterial(material.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // Eliminar la accion mediante el endpoint DELETE
  deleteAction(actionId: number) {
    this.http.delete(`${this.apiUrl}/acciones/${actionId}`).subscribe({
      next: (response) => {
        // Actualiza la lista de acciones local eliminando la accion borrada
        this.actions = this.actions.filter(u => u.id !== actionId);
      },
      error: (err) => {
        console.error('Error al eliminar accion:', err);
      }
    });
  }

  // Eliminar el material mediante el endpoint DELETE
  deleteMaterial(materialId: number) {
    this.http.delete(`${this.apiUrl}/materiales/${materialId}`).subscribe({
      next: (response) => {
        // Actualiza la lista de materiales local eliminando el material borrado
        this.materials = this.materials.filter(u => u.id !== materialId);
      },
      error: (err) => {
        console.error('Error al eliminar material:', err);
      }
    });
  }

}
