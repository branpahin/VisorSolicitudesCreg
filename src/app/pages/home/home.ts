import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Solicitud } from '../solicitud-174/solicitud';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud';
import { StorageService } from '../../services/storage.service';
import { Toast } from "primeng/toast";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    Toast
],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  logo: string = 'assets/eep/logoEEP_dynamic.svg';

  ciudades = [
    { name: 'Pereira', code: '1' },
    { name: 'Cartago', code: '2' },
  ];

  cregs = [
    { name: 'Autogeneración', code: '1' },
    { name: 'Servicio', code: '2' },
  ];

  ciudad!: string;
  creg!: string;
  numeroSolicitud!: string;
  mostrarDialog: boolean =  true;
  cargando: boolean = false;

  constructor(private router: Router, private solicitudService: SolicitudService, private messageService:MessageService, private storageService:StorageService) {
  }

  buscar() {
    if (!this.numeroSolicitud || !this.ciudad) return;
    this.cargando = true;
    this.mostrarDialog = false;

    if(this.creg=='1'){
      this.cargarSolicitud174();
    }else{
      this.cargarSolicitud075();
    }
    
  }

  cargarSolicitud174() {
    this.solicitudService.getDatosGeneralesCreg174().subscribe({
      next: (data) => {
        this.storageService.save('datosGenCreg',data);
        this.cargando = false;
        this.router.navigate([
          '/solicitud174',
          this.numeroSolicitud,
          this.ciudad
        ]);
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
        });
      }
    });
  }

  cargarSolicitud075() {
    this.solicitudService.getDatosGeneralesCreg075().subscribe({
      next: (data) => {
        this.storageService.save('datosGenCreg',data);
        this.cargando = false;
        this.router.navigate([
          '/solicitud075',
          this.numeroSolicitud,
          this.ciudad
        ]);
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
        });
      }
    });
  }

}
