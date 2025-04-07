import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSearchbar, IonModal, IonList, IonCheckbox } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subtask-detail',
  templateUrl: './subtask-detail.page.html',
  styleUrls: ['./subtask-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonBackButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSearchbar, IonModal, IonList, IonCheckbox]
})
export class SubtaskDetailPage implements OnInit {
  subtarea: any = {};
  tarea: any = {};
  zona: any;
  incidencia: any = {
    tipo_actuacion: [] as string[],
    material_necesario: [] as string[],
    hora_inicio: [] as string[],
    hora_fin: '',
    otros: ''
  };

  horaInicio: string = '';
  horaFin: string = '';
  esEditable: boolean = true;
  
  materiales: any[] = [];
  filtroMaterial: string = '';
  modalAbiertoMaterial: boolean = false;

  acciones: any[] = [];
  filtroAccion: string = '';
  modalAbiertoAccion: boolean = false;

  private apiUrl = environment.apiUrl;

  constructor(private navCtrl: NavController, private http: HttpClient, private router: Router, private alertCtrl: AlertController) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {
      this.subtarea = nav.extras.state['subtarea'];
      this.tarea = nav.extras.state['tarea'];
      this.zona = nav.extras.state['zona'];

      if (this.subtarea.incidencia) {
        this.incidencia = { ...this.subtarea.incidencia };
      }

      if (this.subtarea.estado === 'completado') {
        this.esEditable = false;
      }
    }
  }

  ngOnInit() {
    if (!Array.isArray(this.incidencia.hora_inicio)) {
      this.incidencia.hora_inicio = [];
    }

    if (this.incidencia.hora_inicio.length === 0) {
      const horaActual = this.getFormattedTime();
      this.incidencia.hora_inicio.push(horaActual);
    }

    // Mostrar siempre la primera hora (aunque luego se agreguen más)
    this.horaInicio = this.incidencia.hora_inicio[0];

    // Cargar acciones desde la API
    this.http.get<any[]>(`${this.apiUrl}/acciones`).subscribe({
      next: (data) => this.acciones = data,
      error: (err) => console.error('Error al cargar acciones:', err)
    });

    // Cargar materiales desde la API
    this.http.get<any[]>(`${this.apiUrl}/materiales`).subscribe({
      next: (data) => this.materiales = data,
      error: (err) => console.error('Error al cargar materiales:', err)
    });
  }

  // Función para obtener la hora en formato HH:MM:SS
  private getFormattedTime(): string {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  accionesFiltradas() {
    const filtro = this.filtroAccion.toLowerCase();
    return this.acciones.filter(mat =>
      mat.nombre.toLowerCase().includes(filtro)
    );
  }

  materialesFiltrados() {
    const filtro = this.filtroMaterial.toLowerCase();
    return this.materiales.filter(mat =>
      mat.nombre.toLowerCase().includes(filtro)
    );
  }

  abrirModalAcciones() {
    this.modalAbiertoAccion = true;
  }

  cerrarModalAcciones() {
    this.modalAbiertoAccion = false;
  }

  abrirModalMateriales() {
    this.modalAbiertoMaterial = true;
  }

  cerrarModalMateriales() {
    this.modalAbiertoMaterial = false;
  }

  estaSeleccionadoAccion(nombre: string): boolean {
    return this.incidencia.tipo_actuacion.includes(nombre);
  }

  estaSeleccionadoMaterial(nombre: string): boolean {
    return this.incidencia.material_necesario.includes(nombre);
  }

  toggleAccion(nombre: string) {
    const index = this.incidencia.tipo_actuacion.indexOf(nombre);
    if (index > -1) {
      this.incidencia.tipo_actuacion.splice(index, 1);
    } else {
      this.incidencia.tipo_actuacion.push(nombre);
    }
  }

  toggleMaterial(nombre: string) {
    const index = this.incidencia.material_necesario.indexOf(nombre);
    if (index > -1) {
      this.incidencia.material_necesario.splice(index, 1);
    } else {
      this.incidencia.material_necesario.push(nombre);
    }
  }

  confirmarSeleccionAccion() {
    this.cerrarModalAcciones();
  }

  confirmarSeleccionMaterial() {
    this.cerrarModalMateriales();
  }

  async marcarComoCompletado() {
    if (this.incidencia.tipo_actuacion.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Aviso',
        message: 'Debes ingresar un "Tipo de Actuación" para registrar la tarea.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.horaFin = this.getFormattedTime();
    this.subtarea.estado = 'completado';
    this.incidencia.hora_fin = this.horaFin;

    this.subtarea.incidencia = { ...this.incidencia };
    this.esEditable = false;

    await this.actualizarEstado();
  }

  async marcarComoEnPausa() {
    if (this.incidencia.tipo_actuacion.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Aviso',
        message: 'Debes ingresar un "Tipo de Actuación" para registrar la tarea.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.subtarea.estado = 'en-pausa';

    this.subtarea.incidencia = { ...this.incidencia };

    try {
      const config: any = await this.http.get(`${this.apiUrl}/config/incidencia-en-pausa`).toPromise();

      if (config.habilitado) {
        await this.http.post(`${this.apiUrl}/incidencias`, {
          area: this.tarea.area,
          zona: this.zona,
          subzona: this.subtarea.nombre,
          tipo_actuacion: this.incidencia.tipo_actuacion,
          material_necesario: this.incidencia.material_necesario || null,
          hora_inicio: this.incidencia.hora_inicio[0],
          hora_fin: this.getFormattedTime(),
          otros: this.incidencia.otros || null
        }).toPromise();
    
        const successAlert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Incidencia creada correctamente.',
          buttons: ['OK']
        });
        await successAlert.present();
      }
    } catch (error) {
      console.error('Error al registrar la incidencia:', error);
      const errorAlert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se pudo registrar la incidencia. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }

    await this.actualizarEstado();
  }

  reanudarTarea() {
    const nuevaHora = this.getFormattedTime();
    this.incidencia.hora_inicio.push(nuevaHora);
    this.horaInicio = this.incidencia.hora_inicio[0];
    this.subtarea.estado = 'no-iniciada';
    this.esEditable = true;
  }  

  async actualizarEstado() {
    this.router.navigate(['/periodic-task-detail'], { state: { tarea: this.tarea } });
  }

}
