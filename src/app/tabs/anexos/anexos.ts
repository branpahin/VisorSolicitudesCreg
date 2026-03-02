import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';

import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileArchive,
  faFileImage,
  faFileLines,
  faFile,
  faDownload,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { SolicitudService } from '../../services/solicitud';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-anexos',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './anexos.html',
  styleUrl: './anexos.css',
})
export class Anexos {

  @Input() documentos : any[] = []
  faDownload=faDownload
  faEye=faEye
  icons: Record<string, IconDefinition> = {
    pdf: faFilePdf,
    doc: faFileWord,
    docx: faFileWord,
    xls: faFileExcel,
    xlsx: faFileExcel,
    rar: faFileArchive,
    zip: faFileArchive,
    png: faFileImage,
    jpg: faFileImage,
    jpeg: faFileImage,
    txt: faFileLines,
    default: faFile
  };

  constructor(private solicitudService: SolicitudService, private messageService:MessageService ){
    
  }

  getIcon(ext: string): IconDefinition {
    if (!ext) return this.icons['default'];

    const cleanExt = ext.replace('.', '').toLowerCase();
    return this.icons[cleanExt] ?? this.icons['default'];
  }

  descargar(doc:any){
    const data = {
      url:doc.urlDocument,
      nombreArchivo: doc.nameDocument
    }
    this.solicitudService.postDownloadFile(data).subscribe({
      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.nameDocument}${doc.extDocument}`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando Excel', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error.data[0].error || 'No fue posible cargar la solicitud'
        });
      }
    });
  }

  verArchivo(doc: any) {
    if (doc?.urlDocument) {
      window.open(doc.urlDocument, '_blank');
    }
  }

}
