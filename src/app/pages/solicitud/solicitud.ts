import { ChangeDetectorRef, Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Detalles } from '../../tabs/detalles/detalles';
import { Anexos } from '../../tabs/anexos/anexos';
import { SolicitudService } from '../../services/solicitud';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Historial } from '../../tabs/historial/historial';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-solicitud',
  imports: [
    CommonModule,
    ToastModule,
    TabsModule,
    Detalles,
    Anexos,
    Historial
  ],
  providers: [MessageService],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud {

  solicitud: any
  mostrar:boolean=false
  radicado!: string;
  ciudad!: string;

  constructor(private solicitudService: SolicitudService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, 
    private router: Router , private messageService:MessageService ){}

  ngOnInit(): void {
    this.radicado = this.route.snapshot.paramMap.get('radicado')!;
    this.ciudad = this.route.snapshot.paramMap.get('ciudad')!;
    this.cargarSolicitud();
  }

  cargarSolicitud() {
    this.solicitudService.getSolicitud(this.radicado, this.ciudad).subscribe({
      next: (data) => {
        this.solicitud = data.data;
        console.log('Solicitud:', this.solicitud);
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error || 'No fue posible cargar la solicitud'
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000); // espera 3 segundos

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      }
    });
  }

  volverHome() {
    this.router.navigate(['/']);
  }
}
