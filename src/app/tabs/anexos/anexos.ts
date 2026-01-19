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
  faFile
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-anexos',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './anexos.html',
  styleUrl: './anexos.css',
})
export class Anexos {

  @Input() documentos : any[] = []

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

  getIcon(ext: string): IconDefinition {
    if (!ext) return this.icons['default'];

    const cleanExt = ext.replace('.', '').toLowerCase();
    return this.icons[cleanExt] ?? this.icons['default'];
  }

}
