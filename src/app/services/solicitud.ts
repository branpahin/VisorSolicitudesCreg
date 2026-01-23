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

  constructor(private http: HttpClient) {}

  getSolicitud174(radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getSolicitudes174+'?Id='+radicado+'&Empresa='+ciudad);
  }

  getSolicitud075(radicado:string, ciudad:string): Observable<any> {
    return this.http.get<any>(this.apiUrl+this.getSolicitudes075+'?Id='+radicado+'&Empresa='+ciudad);
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

  
}
