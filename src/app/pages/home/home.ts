import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Solicitud } from '../solicitud/solicitud';
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
    { name: 'Dosquebradas', code: '2' },
  ];

  ciudad!: string;
  numeroSolicitud!: string;
  mostrarDialog: boolean =  true;

  constructor(private router: Router, private solicitudService: SolicitudService, private storageService:StorageService) {
    this.cargarSolicitud();
  }

  buscar() {
    if (!this.numeroSolicitud || !this.ciudad) return;

    this.mostrarDialog = false;

    this.router.navigate([
      '/solicitud',
      this.numeroSolicitud,
      this.ciudad
    ]);
  }

  cargarSolicitud() {
    this.solicitudService.getDatosGeneralesCreg174().subscribe({
      next: (data) => {
        this.storageService.save('datosGenCreg174',data)
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

}
