import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = environment.apiUrl;
  private getSolicitudes174 = 'api/Solicitudes174/GetById';
  private getSolicitudes075 = 'api/Solicitudes075/GetById';
  private getDatosGenerales174= 'api/Solicitudes174/GetDatosGenerales';
  private getDatosGenerales075= 'api/Solicitudes075/GetDatosGenerales';
  private getDepartamento= 'api/Departamento/GetDepartamentos';
  private getCiudad= 'api/Ciudad/GetDptoCiudad';
  private postDownload= 'api/Files/DownloadFile';
  private getFactibilidadSolicitudes075 = 'api/Solicitudes075Factibilidad/GetById';
  private getDisenoSolicitudes075 = 'api/Solicitudes075Disenio/GetById';
  private getReciboTecnicoSolicitudes075 = 'api/Solicitudes075ReciboTecnico/GetById';

  constructor(private http: HttpClient) {}

  getSolicitud174(radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getSolicitudes174+'?Id='+radicado+'&Empresa='+ciudad);
  }

  getSolicitud075(radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getSolicitudes075+'?Id='+radicado+'&Empresa='+ciudad);
  }

  getFactibilidadSolicitud075(id:number, radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getFactibilidadSolicitudes075+'?Id='+id+'&Numero_Radicado='+radicado+'&Empresa='+ciudad);
  }

  getDisenoSolicitud075(id:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getDisenoSolicitudes075+'?Id='+id);
  }

  getReciboTecnicoSolicitud075(id:number, radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getReciboTecnicoSolicitudes075+'?Id='+id+'&Numero_Radicado='+radicado+'&Empresa='+ciudad);
  }

  getDatosGeneralesCreg174(): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getDatosGenerales174);
  }

  getDatosGeneralesCreg075(): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getDatosGenerales075);
  }

  getDepartamentos(): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getDepartamento);
  }

  getCiudades(departamento:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getCiudad+"?CodDepartamento="+departamento);
  }

  postDownloadFile(data:any): Observable<any> {
    const APIREST = `${this.apiUrl}${this.postDownload}`;

    return this.http.post(APIREST, data,{
      responseType: 'blob'
    });
  }
  
}
