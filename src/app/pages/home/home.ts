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

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule],
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

  constructor(private router: Router, private solicitudService: SolicitudService, private storageService:StorageService) {
  }

  buscar() {
    if (!this.numeroSolicitud || !this.ciudad) return;

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
        this.storageService.save('datosGenCreg',data)
        this.router.navigate([
          '/solicitud174',
          this.numeroSolicitud,
          this.ciudad
        ]);
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

  cargarSolicitud075() {
    this.solicitudService.getDatosGeneralesCreg075().subscribe({
      next: (data) => {
        this.storageService.save('datosGenCreg',data)
          this.router.navigate([
          '/solicitud075',
          this.numeroSolicitud,
          this.ciudad
        ]);
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

}
