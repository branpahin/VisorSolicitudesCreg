import { ChangeDetectorRef, Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Detalles } from '../../tabs/detalles/detalles';
import { Anexos } from '../../tabs/anexos/anexos';
import { SolicitudService } from '../../services/solicitud';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  imports: [
    CommonModule,
    TabsModule,
    Detalles,
    Anexos,
  ],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css',
})
export class Solicitud {

  solicitud: any
  mostrar:boolean=false
  radicado!: string;
  ciudad!: string;

  constructor(private solicitudService: SolicitudService, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private router: Router){}

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
      }
    });
  }

  volverHome() {
    this.router.navigate(['/']);
  }
}
