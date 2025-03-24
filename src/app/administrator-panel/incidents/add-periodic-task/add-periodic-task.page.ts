import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonIcon, AlertController, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { addIcons } from 'ionicons';
import { trash, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-add-periodic-task',
  templateUrl: './add-periodic-task.page.html',
  styleUrls: ['./add-periodic-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonSelectOption, IonInput, IonSelect]
})
export class AddPeriodicTaskPage implements OnInit {
  tarea: {
    area: string;
    inspeccion: string;
    periodicidad: string;
    zonas: { nombre: string; subtareas: string[] }[];
    subtareas: string[]; // Subtareas generales si no hay zonas
  } = {
    area: '',
    inspeccion: '',
    periodicidad: '',
    zonas: [],
    subtareas: []
  };

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) {
    addIcons({
      trash,
      closeCircle
    })
  }

  ngOnInit() {
  }

  agregarZona() {
    this.tarea.zonas.push({ nombre: '', subtareas: [] });
  }

  eliminarZona(index: number) {
    this.tarea.zonas.splice(index, 1);
  }

  agregarSubtarea(zonaIndex: number) {
    this.tarea.zonas[zonaIndex].subtareas.push('');
  }

  eliminarSubtarea(zonaIndex: number, subtareaIndex: number) {
    this.tarea.zonas[zonaIndex].subtareas.splice(subtareaIndex, 1);
  }

  agregarSubtareaGeneral() {
    this.tarea.subtareas.push('');
  }

  eliminarSubtareaGeneral(index: number) {
    this.tarea.subtareas.splice(index, 1);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  // Enviar el formulario
  async onSubmit() {
    // Verificar que los campos obligatorios estén completos
    if (!this.tarea.area.trim() || !this.tarea.periodicidad.trim()) {
      alert('El campo "Área" y "Periodicidad" son obligatorios.');
      return;
    }

    // Verificar que no haya zonas o subtarea vacías
    this.tarea.zonas.forEach(zona => {
      zona.nombre = zona.nombre.trim();
      zona.subtareas = zona.subtareas.map(subtareas => subtareas.trim()).filter(subtarea => subtarea !== '');
    });

    this.tarea.subtareas = this.tarea.subtareas.map(subtareas => subtareas.trim()).filter(subtarea => subtarea !== '');

    // Validar que si hay una zona, tenga al menos una subzona
    for (let zona of this.tarea.zonas) {
      if (zona.nombre === '') {
        alert('No puede haber zonas sin nombre.');
        return;
      }
      if (zona.subtareas.length === 0) {
        alert(`La zona "${zona.nombre}" debe tener al menos una subtarea.`);
        return;
      }
    }

    // Si no hay zonas, al menos debe haber una subtarea en "General"
    if (this.tarea.zonas.length === 0 && this.tarea.subtareas.length === 0) {
      alert('Debe haber al menos una subtarea en la sección General.');
      return;
    }

    // Convertir los datos al formato JSONB para PostgreSQL
    let dataToSend = {
      area: this.tarea.area.trim(),
      inspeccion: this.tarea.inspeccion.trim() || null,
      periodicidad: this.tarea.periodicidad,
      zonas: this.tarea.zonas.length > 0 ? this.tarea.zonas : [{ nombre: "General", subtareas: this.tarea.subtareas }]
    };

    console.log('Enviando Tarea Periódica:', dataToSend);

    try {
      const response = await this.http.post<any>(`${this.apiUrl}/tareas-periodicas`, dataToSend).toPromise();
  
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Tarea periódica creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.tarea = {
        area: '',
        inspeccion: '',
        periodicidad: '',
        zonas: [],
        subtareas: []
      };
  
      this.router.navigate(['/incidents']);
    } catch (error) {
      console.error('Error al crear tarea periódica:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo crear la tarea periódica. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
