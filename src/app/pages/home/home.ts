import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    InputOtpModule,
    Toast
],
  providers: [MessageService],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @ViewChildren('inputRef') inputs!: QueryList<ElementRef>;

  logo: string = 'assets/eep/logoEEP_dynamic.svg';

  ciudades = [
    { name: 'Pereira', code: '1' },
    { name: 'Cartago', code: '2' },
  ];

  cregs = [
    { name: 'Autogeneración', code: '2' },
    { name: 'Servicio', code: '1' },
  ];

  ciudad!: string;
  creg!: string;
  numeroSolicitud!: string;
 
  displayCodigoDialog: boolean = false;
  correoEnviado: string = '';
  codigo: string = '';
  mostrarDialog: boolean =  true;
  cargando: boolean = false;

  constructor(private router: Router, private solicitudService: SolicitudService, private messageService:MessageService, 
    private cd: ChangeDetectorRef,
    private storageService:StorageService) {
  }

  buscar() {
    if (!this.numeroSolicitud || !this.ciudad) return;
    this.cargando = true;
    this.mostrarDialog = false;

    const datos = {
      id:this.numeroSolicitud,
      empresa: this.ciudad,
      tipoSolicitud: this.creg
    }
    this.codigoVerificacion(datos);

    // if(this.creg=='1'){
    //   this.cargarSolicitud174();
    // }else{
    //   this.cargarSolicitud075();
    // }
  }

  limpiarCodigo(valor: string) {
    this.codigo = (valor || '').replace(/\D/g, '');
  }

  cerrarDialog() {
    this.displayCodigoDialog = false;
    this.cargando = false;
    this.cd.detectChanges();
    this.codigo = '';
  }

  validarCodigo() {
    const data = {
      id:this.numeroSolicitud,
      codigo:this.codigo,
      email: this.correoEnviado 
    }
    this.solicitudService.postVerificarCodigo(data).subscribe({
      next: (resp) => {
        const token = resp.headers.get('Authorization'); 
        // o resp.headers.get('token')
        // depende cómo lo mande tu backend

        console.log('Token recibido:', token);

        if (token) {
          localStorage.setItem('auth_token', token);
        }

        this.displayCodigoDialog = false;
        this.cd.detectChanges();
        if(this.creg=='2'){
          this.cargarSolicitud174();
        }else{
          this.cargarSolicitud075();
        }
   
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
        });
        this.cargando = false;
      }
    });
  }

  codigoVerificacion(data:any) {
    this.solicitudService.postCodigoVerificacion(data).subscribe({
      next: (resp) => {

        this.correoEnviado = resp?.data?.email;
        this.displayCodigoDialog  = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
        });
        this.cargando = false;
      }
    });
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
