import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-detalles',
  imports: [CommonModule, AccordionModule],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {
  @Input() solicitud: any;
}
