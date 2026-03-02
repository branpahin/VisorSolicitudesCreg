import { ChangeDetectorRef, Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Anexos } from '../../tabs/anexos/anexos';
import { SolicitudService } from '../../services/solicitud';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Historial } from '../../tabs/historial/historial';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Detalles } from '../../tabs/detalles-075/detalles';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Factibilidad } from "../../tabs/factibilidad/factibilidad";
import { Diseno } from '../../tabs/diseno/diseno';
import { ReciboTecnico } from '../../tabs/recibo_tecnico/recibo_tecnico';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-solicitud',
  imports: [
    CommonModule,
    ToastModule,
    TabsModule,
    Detalles,
    Anexos,
    Historial,
    FontAwesomeModule,
    Factibilidad,
    Diseno,
    ReciboTecnico
],
  providers: [MessageService],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud075 {

  solicitud: any
  mostrar:boolean=false
  radicado!: string;
  ciudad!: string;

  faCaretLeft=faCaretLeft

  constructor(private solicitudService: SolicitudService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, 
    private router: Router , private messageService:MessageService, private storageService:StorageService ){}

  ngOnInit(): void {
    this.radicado = this.route.snapshot.paramMap.get('radicado')!;
    this.ciudad = this.route.snapshot.paramMap.get('ciudad')!;
    this.cargarSolicitud();
  }

  cargarSolicitud() {
    this.solicitudService.getSolicitud075(this.radicado, this.ciudad).subscribe({
      next: (data) => {
        this.solicitud = data.data;
        this.storageService.save('id',this.solicitud.id)
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
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
