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
  @ViewChildren('codigoInput') inputs!: QueryList<ElementRef>;

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
  codigo: string[] = ['', '', '', '', '', ''];
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

  moverSiguiente(event: any, index: number) {
    const input = event.target;
    if (input.value.length === 1 && input.nextElementSibling) {
      input.nextElementSibling.focus();
    }
  }

  cerrarDialog() {
    this.displayCodigoDialog = false;
    this.codigo = ['', '', '', '', '', ''];
  }

  manejarTecla(event: KeyboardEvent, index: number) {

    const key = event.key;

    // Permitir combinaciones Ctrl o Cmd (copiar, pegar, cortar)
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Permitir teclas especiales
    const teclasPermitidas = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab'
    ];

    if (teclasPermitidas.includes(key)) {

      // Si es Backspace y está vacío → ir al anterior
      if (key === 'Backspace' && !this.codigo[index] && index > 0) {
        this.focusInput(index - 1);
      }

      return;
    }

    // Permitir solo números
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (!/^\d$/.test(value)) {
      this.codigo[index] = '';
      return;
    }

    if (index < this.codigo.length - 1) {
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') || '';
    const numeros = pastedData.replace(/\D/g, '').slice(0, 6);

    numeros.split('').forEach((num, i) => {
      this.codigo[i] = num;
    });

    const nextIndex = numeros.length < 6 ? numeros.length : 5;
    this.focusInput(nextIndex);
  }

  focusInput(index: number) {
    const inputArray = this.inputs.toArray();
    if (inputArray[index]) {
      inputArray[index].nativeElement.focus();
    }
  }

  validarCodigo() {
    const codigoCompleto = this.codigo.join('');
    console.log("Código ingresado:", codigoCompleto);
    const data = {
      id:this.numeroSolicitud,
      codigo:codigoCompleto,
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
      }
    });
  }

  codigoVerificacion(data:any) {
    this.solicitudService.postCodigoVerificacion(data).subscribe({
      next: (resp) => {
        console.log("data: ", resp);

        this.correoEnviado = resp?.data?.email; // ajusta según tu respuesta real
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
