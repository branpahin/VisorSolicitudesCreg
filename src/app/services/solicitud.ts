import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = environment.apiUrl;
  private getSolicitudes = 'api/Solicitudes174/GetById';
  private getDatosGenerales= 'api/Solicitudes174/GetDatosGenerales';

  constructor(private http: HttpClient) {}

  getSolicitud(radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getSolicitudes+'?Id='+radicado+'&Empresa='+ciudad);
  }

  getDatosGeneralesCreg174(): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getDatosGenerales);
  }
  
}
