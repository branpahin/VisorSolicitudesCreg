import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faForward,
  faRightFromBracket,
  faAnglesLeft,
  faAnglesRight,
  faCheck,
  faXmark,
  faCog,
  faDeleteLeft,
  faSave,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Comercializador } from '../../enums/comercializador';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { TipoTecnologiasBasadaEnInversores, TipoTecnologiasEolica, TipoTecnologiasNoBasadaEnInversores } from '../../enums/tipoTecnologia';
import { Notes } from '../../enums/notes';
import { StorageService } from '../../services/storage.service';
import { SolicitudService } from '../../services/solicitud';

@Component({
  selector: 'app-detalles',
  imports: [CommonModule, AccordionModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {
  @Input() request: any;
  activeFormIndex: string = '0';

  faDeleteLeft = faDeleteLeft;
  faSave = faSave;
  faNext = faForward;
  faArrowLeft = faArrowLeft;
  faRightFromBracket = faRightFromBracket;
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight;
  faCancel = faXmark;
  faCheck = faCheck;
  faCog = faCog;
  faDownload = faDownload;

  //Insumos
  lstIdTypes: Array<any> = [];
  lstTypePeople: Array<any> = [];
  lstIdTypeDocument: Array<any> = [];
  lstDepartments: Array<any> = [];
  lstTowns: Array<any> = [];
  lstTownsSubscriber: Array<any> = [];
  lstTypeZona: Array<any> = [];
  lstTownsSite: Array<any> = [];
  lstExistingProject: Array<any> = [];
  lstTypeUse: Array<any> = [];
  lstSocioEconomicStratum: Array<any> = [];
  lstIndustrialEconomicActivity: Array<any> = [];
  lstTypeRequest: Array<any> = [];
  lstTypeServiceRequested: Array<any> = [];
  lstTypeRequestedVoltageLevel: Array<any> = [];
  lstSolServicioConexionParameter: Array<any> = [];
  lstProjectClasification: Array<any> = [];
  lstTechnologyType: Array<any> = [];
  lstFilesToUpLoad: Array<any> = [];
  lstfileToUploadFromSignature: Array<any> = [];
  lstTypeLoadClass: Array<any> = [];

  form: FormGroup = new FormGroup({
    tipoConexion: new FormControl(undefined),
    datosSolicitante: new FormControl(undefined),
  }, { updateOn: 'blur' });

  datosGenerales: any
  listadoDetalleCuentas: Array<any> = [];

  codeDepartamento: string = '';
  codeDepartamentoSubscriber: string = '';
  codeDepartamentoSite: string = '';


  propietarioPredioSi: boolean = false;
  propietarioPredioNo: boolean = false;
  isApplicantOuwner: boolean = false;


  constructor(private fb: FormBuilder, private storageService:StorageService, private solicitudService: SolicitudService,){
    this.setForm();
  }

  ngOnInit(): void {

    this.datosGenerales = this.storageService.read('datosGenCreg')
    setTimeout(() => {
      this.getData();   // 👈 se ejecuta después del primer render
    });
    
  }

  setForm() {
    this.form = this.fb.group({
      empresa: [],
      tipoConexion: [undefined, [Validators.required]],
      datosSolicitante: [undefined],
      nombreCliente: ['', [Validators.required]],
      tipoPersona: [-1, [Validators.required, Validators.min(0)]],
      tipoDocumento: [-1, [Validators.required, Validators.min(0)]],
      numeroDocumento: ['', [Validators.required]],
      direccionCorrespondencia: ['', [Validators.required]],
      codDeparment: [-1, [Validators.required, Validators.min(0)]],
      municipioSolicitante: [-1, [Validators.required, Validators.min(0)]],
      celular: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      fijo: ['', [Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      autorizaNotificacionMedianteCorreoElectronico: [-1, [Validators.required, Validators.min(0)]],
      propietarioPredio: [-1, [Validators.required, Validators.min(0)]],
      descripcionPredio: [''],
      nombreRazonSocial: ['', [Validators.required]],
      tipoPersonaSuscriptor: [-1, [Validators.required, Validators.min(0)]],
      tipoDocumentoSuscriptor: [-1, [Validators.required, Validators.min(0)]],
      numeroDocumentoSuscriptor: ['', [Validators.required]],
      direccionCorrespondenciaSuscriptor: ['', [Validators.required]],
      codeDepartamentoSubscriber: [-1, [Validators.required, Validators.min(0)]],
      municipioSubscriber: [-1, [Validators.required, Validators.min(0)]],
      celularSuscriptor: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      fijoSuscriptor: ['', [Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      correoElectronicoSuscriptor: ['', [Validators.required, Validators.email]],
      autorizaNotificacionMedianteCorreoElectronicoSuscriptor: [-1, [Validators.required, Validators.min(0)]],
      zona: [-1, [Validators.required, Validators.min(0)]],
      localidad: ['', [Validators.required]],
      codeDepartamentoSite: [-1, [Validators.required, Validators.min(0)]],
      municipioPredio: [-1, [Validators.required, Validators.min(0)]],
      direccionDelPredio: ['', [Validators.required]],
      edificacionExistenteOproyecto: [-1, [Validators.required, Validators.min(0)]],
      descripcion: '',
      tipodeUso: [-1, [Validators.required, Validators.min(0)]],
      cualTipoUso: '',
      estratoSocioeconomico: [0, [Validators.required, Validators.min(0)]],
      actividadEconomicaIndustrialCIIU: [-1, [Validators.required, Validators.min(0)]],
      hayRedElectricaCercanaAlPredio: [-1, [Validators.required, Validators.min(0)]],
      distanciaActualDelPredioALaRedMasCercana: ['', [Validators.required]],
      numeroDeTransformador: ['', [Validators.required]],
      Nodo: ['', [Validators.required]],
      Circuito: ['', [Validators.required]],
      nombreDelProyecto: ['', [Validators.required]],
      tipoSolicitudServicio: [-1, [Validators.required, Validators.min(0)]],
      tipoDeServicioSolicitado: [-1, [Validators.required, Validators.min(0)]],
      numeroSolicitud: '',
      cualTipoServicio: [''],
      cargaKva: ['', [Validators.required]],
      cargaMaximaRequeridakVA: ['', [Validators.required]],
      nivelDeTensionSolicitado: [-1, [Validators.required, Validators.min(0)]],
      proyectoSistemaGeneracion: [-1, [Validators.required, Validators.min(0)]],
      fechaEstimadaDeEntradaOperacion: [-1, [Validators.required, Validators.min(0)]],
      filesToUpload: this.fb.control(null),
      // observaciones: ['', [Validators.required]],
      observaciones: '',
      numeroIdentificacionNIU: null,
      Long: null,
      Lat: null,
      altura: null,
      tipoCarga: null,
      claseCarga: null,
      valorCantidad: [0, [Validators.required, Validators.min(1)]],
      contador: null,
      matriculaInmobiliaria: '',
      //firma
      isDigitalSignature: [false],
      terminosYCondiciones: [
        false,
        [Validators.required, Validators.requiredTrue],
      ],
      //firmaSuscriptor
      isDigitalSignatureSuscriptor: [false],
      // terminosYCondicionesSuscriptor: [
      //   false,
      //   [Validators.required, Validators.requiredTrue],
      // ],

    }, { updateOn: 'change' });
  }

  formDataValidate(item: string): string {
    const field = this.form.get(item);

    if (field) {
      return field.invalid && (field.dirty || field.touched)
        ? 'is-invalid validation-errors'
        : 'validation-success';
    }

    return '';
  }

  getData() {
      // this.onSelectTownsSite();
      // this.onSelectIdDeparment();
      // this.onSelectDepartamentIdSubscriber();
          this.lstIdTypes =this.datosGenerales.data.listadoTipoConexion;
          this.lstProjectClasification = this.datosGenerales.data.listadoTipoProyecto;

          this.lstFilesToUpLoad = this.datosGenerales.data.listadoDocumentosXformularios
            ? this.datosGenerales.data.listadoDocumentosXformularios
            : [];

          this.lstTypePeople = this.datosGenerales.data.listadoTipoPersona;
          this.lstTypeZona = this.datosGenerales.data.listadoTipoZona;
          this.lstTypeUse = this.datosGenerales.data.listadoTipoCliente;
          this.lstSocioEconomicStratum = this.datosGenerales.data.listadoEstratoSocioeconomico;
          this.lstIndustrialEconomicActivity = this.datosGenerales.data.listadoActividadEconomica;
          this.lstTypeRequest = this.datosGenerales.data.listadoTipoSolicitudServicio;
          this.lstTypeServiceRequested = this.datosGenerales.data.listadoTipoServicio;
          this.lstTypeRequestedVoltageLevel = this.datosGenerales.data.listadoTipoTension;
          this.lstIdTypeDocument = this.datosGenerales.data.listadoTipoIdentificacion;
          this.lstExistingProject = this.datosGenerales.data.listadoTipoConstruccion;
          this.lstTypeLoadClass = this.datosGenerales.data.listadoTipoClaseCarga;

          for (let index = 0; index < this.lstTechnologyType.length; index++) {
            this.lstTechnologyType[index].selected = false;
          }

          if (this.request) {
            this.setRequestData();
          }
    this.getDepartments();
    //this.getInitialParameters();
  }

  setRequestData() {
    this.form.patchValue({
      tipoConexion: this.request.codTipoConexion,
    });

    const nombreCliente = this.request.creg075Solicitantes[0].nombre;
    const tipoPersona = this.request.creg075Solicitantes[0].codTipoPersona;
    console.log("tipoPersona: ",this.request.creg075Solicitantes[0])
    const observaciones = this.request.observacionesSolicitante;
    const tipoDocumento = this.request.creg075Solicitantes[0].codTipoDocumento;
    const numeroDocumento = this.request.creg075Solicitantes[0].numeroDocumento;
    const direccionCorrespondencia = this.request.creg075Solicitantes[0].direccion;
    const codDeparment = this.request.creg075Solicitantes[0].codDepartamento;
    const municipioSolicitante = this.request.creg075Solicitantes[0].codMunicipio;
    const celular = this.request.creg075Solicitantes[0].celular;
    const fijo = this.request.creg075Solicitantes[0].telefono;
    const correoElectronico = this.request.creg075Solicitantes[0].email;
    const autorizaNotificacionMedianteCorreoElectronico = this.request.creg075Solicitantes[0].autorizacionNotifEmail;
    const propietarioPredio = this.request.creg075Solicitantes[0].esSolicitantePropietario;

    this.form.controls['nombreCliente'].setValue(nombreCliente);
    this.form.controls['tipoPersona'].setValue(tipoPersona);
    this.form.controls['observaciones'].setValue(observaciones);
    this.form.controls['tipoDocumento'].setValue(tipoDocumento);
    this.form.controls['numeroDocumento'].setValue(numeroDocumento);
    this.form.controls['direccionCorrespondencia'].setValue(direccionCorrespondencia);
    this.form.controls['codDeparment'].setValue(codDeparment);
    this.onSelectIdDeparment();
    this.form.controls['municipioSolicitante'].setValue(municipioSolicitante);
    this.form.controls['celular'].setValue(celular);
    this.form.controls['fijo'].setValue(fijo);
    this.form.controls['correoElectronico'].setValue(correoElectronico);
    this.form.controls['autorizaNotificacionMedianteCorreoElectronico'].setValue(autorizaNotificacionMedianteCorreoElectronico);
    this.form.controls['propietarioPredio'].setValue(propietarioPredio);

    //Suscriptor
    const suscriptorData = this.request.creg075Suscriptors;
    this.form.controls['nombreRazonSocial'].setValue(suscriptorData.nombre);
    this.form.controls['tipoPersonaSuscriptor'].setValue(suscriptorData.codTipoPersona);
    this.form.controls['tipoDocumentoSuscriptor'].setValue(suscriptorData.codTipoDocumento);
    this.form.controls['numeroDocumentoSuscriptor'].setValue(suscriptorData.numeroDocumento);
    this.form.controls['direccionCorrespondenciaSuscriptor'].setValue(suscriptorData.direccion);
    this.form.controls['codeDepartamentoSubscriber'].setValue(suscriptorData.codDepartamento);
    this.onSelectDepartamentIdSubscriber();
    this.form.controls['municipioSubscriber'].setValue(suscriptorData.codMunicipio);
    this.form.controls['celularSuscriptor'].setValue(suscriptorData.celular);
    this.form.controls['fijoSuscriptor'].setValue(suscriptorData.telefono);
    this.form.controls['correoElectronicoSuscriptor'].setValue(suscriptorData.email);
    this.form.controls['autorizaNotificacionMedianteCorreoElectronicoSuscriptor'].setValue(suscriptorData.autorizacionNotificacionEmail);
    this.form.controls['isDigitalSignatureSuscriptor'].setValue(suscriptorData.info === '1|0|0');
    //Predio
    const predioData = this.request.creg075Predios;
    this.form.controls['zona'].setValue(predioData.codZona);
    this.form.controls['numeroIdentificacionNIU'].setValue(predioData.identificacionCliente);
    this.form.controls['localidad'].setValue(predioData.localidad);
    this.form.controls['codeDepartamentoSite'].setValue(predioData.codDepartamento);
    this.onSelectTownsSite();
    this.form.controls['municipioPredio'].setValue(predioData.codMunicipio);
    this.form.controls['direccionDelPredio'].setValue(predioData.direccionPredio);
    this.form.controls['Long'].setValue(predioData.ubicacionLong);
    this.form.controls['Lat'].setValue(predioData.ubicacionLat);
    this.form.controls['altura'].setValue(predioData.ubicacionH);
    this.form.controls['descripcionPredio'].setValue(predioData.descripcionPredio);
    this.form.controls['edificacionExistenteOproyecto'].setValue(predioData.codTipoConstruccion);
    this.form.controls['matriculaInmobiliaria'].setValue(predioData.matriculaInmobiliaria);
    //Tpo de uso estrato y act económica.
    const req = this.request;
    this.form.controls['tipodeUso'].setValue(req['codTipoUso']);
    this.form.controls['estratoSocioeconomico'].setValue(req['codEstrato']);
    this.form.controls['actividadEconomicaIndustrialCIIU'].setValue(req['codActividadEconomica']);
    //Red Cercana, distancia, elemento cercano
    this.form.controls['hayRedElectricaCercanaAlPredio'].setValue(req['existeRed']);
    this.form.controls['distanciaActualDelPredioALaRedMasCercana'].setValue(req['distanciaRed']);
    this.form.controls['numeroDeTransformador'].setValue(req['transformador']);
    this.form.controls['Nodo'].setValue(req['nodo']);
    this.form.controls['Circuito'].setValue(req['circuito']);
    //Detalle del servicio
    // Detalle del Servicio
    const detalleData = this.request.creg075Detalles;

    this.form.controls['nombreDelProyecto'].setValue(detalleData.nombreProyecto);
    this.form.controls['tipoSolicitudServicio'].setValue(detalleData.codTipoSolicitud);
    this.form.controls['numeroSolicitud'].setValue(detalleData.numeroSolicitud);
    this.form.controls['tipoDeServicioSolicitado'].setValue(detalleData.codTipoSSolicitud);
    this.form.controls['cualTipoServicio'].setValue(detalleData.otroTipoServicioSolicitud);
    this.form.controls['cargaKva'].setValue(detalleData.cargaExistente);
    this.form.controls['cargaMaximaRequeridakVA'].setValue(detalleData.cargaMaximaRequerida);
    this.form.controls['nivelDeTensionSolicitado'].setValue(detalleData.codTension);
    this.form.controls['proyectoSistemaGeneracion'].setValue(detalleData.sistemaGeneracion);


    // Parse fecha
    const fecha = new Date(detalleData.fechaOperacion);

    // Formatear
    const formattedDate = fecha.getFullYear() + '-' +
      (fecha.getMonth() + 1).toString().padStart(2, '0') + '-' +
      fecha.getDate().toString().padStart(2, '0');

    // Asignar al control
    this.form.controls['fechaEstimadaDeEntradaOperacion'].setValue(formattedDate);
    /* this.form.controls.fechaEstimadaDeEntradaOperacion.setValue(detalleData.fechaEstimadaEntradaOperacion); */

    // Detalle de cuentas
    const cuentasData = this.request.creg075DetallesCuentas;

    this.pintarCuentasExistentes(cuentasData);
    this.form.disable();
  }

  getDepartments() {
    this.solicitudService.getDepartamentos().subscribe({
      next: (data) => {
        this.lstDepartments=data.data
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

  onSelectIdDeparment() {
    this.codeDepartamento = this.form.get('codDeparment')?.value;
    this.getTowns();
  }

  onSelectTownsSite() {
    this.codeDepartamentoSite = this.form.get('codeDepartamentoSite')?.value;
    this.getTownsSite();
  }

  onSelectDepartamentIdSubscriber() {
    this.codeDepartamentoSubscriber = this.form.get(
      'codeDepartamentoSubscriber'
    )?.value;
    this.getTownsSubscriber();
  }

  getTowns() {

    this.solicitudService.getCiudades(this.codeDepartamento).subscribe({
      next: (data) => {
        this.lstTowns = data.data;
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

  getTownsSubscriber() {
    this.solicitudService.getCiudades(this.codeDepartamentoSubscriber).subscribe({
      next: (data) => {
        this.lstTownsSubscriber = data.data;
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

  getTownsSite() {
    this.solicitudService.getCiudades(this.codeDepartamentoSite).subscribe({
      next: (data) => {
        this.lstTownsSite = data.data;
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
      }
    });
  }

  pintarCuentasExistentes(cuentasData: any[]) {
    this.listadoDetalleCuentas = cuentasData.map(cuenta => {
      return {
        codTipoCarga: cuenta.codTipoCarga,
        codTipoClaseCarga: cuenta.codTipoClaseCarga,
        ValorCarga: cuenta.valorCarga
      };
    });
  }

  onChange(event: Event) {
    const propietarioPredio = this.form.get('propietarioPredio')?.value;

    if (propietarioPredio === 'true') {
      this.propietarioPredioSi = true;
      this.propietarioPredioNo = false;
      this.isApplicantOuwner = true;
      this.copyApplicantToSuscriptor();
    } else if (propietarioPredio === 'false') {
      this.isApplicantOuwner = false;
      this.propietarioPredioNo = true;
      this.propietarioPredioSi = false;
    } else {
      this.propietarioPredioNo = false;
      this.propietarioPredioSi = false;
    }
  }

  copyApplicantToSuscriptor() {
    const datos = this.form.value;
    const requiredFields = ['nombreCliente', 'tipoPersona', 'tipoDocumento', 'numeroDocumento',
      'direccionCorrespondencia', 'codDeparment', 'municipioSolicitante', 'celular', 'correoElectronico',
      'autorizaNotificacionMedianteCorreoElectronico', 'propietarioPredio'];

    if (requiredFields.every(field => datos[field])) {
      const controls = this.form.controls;
      controls['nombreRazonSocial'].setValue(datos.nombreCliente);
      controls['tipoPersonaSuscriptor'].setValue(datos.tipoPersona);
      controls['tipoDocumentoSuscriptor'].setValue(datos.tipoDocumento);
      controls['numeroDocumentoSuscriptor'].setValue(datos.numeroDocumento);
      controls['direccionCorrespondenciaSuscriptor'].setValue(datos.direccionCorrespondencia);
      controls['codeDepartamentoSubscriber'].setValue(this.codeDepartamento);
      this.onSelectDepartamentIdSubscriber();
      controls['municipioSubscriber'].setValue(datos.municipioSolicitante);
      controls['celularSuscriptor'].setValue(datos.celular);
      controls['fijoSuscriptor'].setValue(datos.fijo);
      controls['correoElectronicoSuscriptor'].setValue(datos.correoElectronico);
      controls['fijoSuscriptor'].setValue(datos.fijo);
      controls['autorizaNotificacionMedianteCorreoElectronicoSuscriptor'].setValue(datos.autorizaNotificacionMedianteCorreoElectronico);
    } 
  }

  getDetalleCarga(tipoCarga: number, claseCarga: number) {
    return this.listadoDetalleCuentas.reduce((total, detalleCuenta) => {
      if (detalleCuenta.codTipoCarga == tipoCarga &&
        detalleCuenta.codTipoClaseCarga == claseCarga) {
        total = total + detalleCuenta?.ValorCarga || 0;
      }

      return total;
    }, 0);
  }

  getTotalPorClase(claseCarga: number): number {
    return this.lstTypeUse.reduce((total, tipoCarga) => {
      return total + this.getDetalleCarga(tipoCarga.id, claseCarga);
    }, 0);
  }

  getTotalGeneral(): number {
    return this.lstTypeUse.reduce((total, tipoCarga) => {
      return total + this.getTotalPorClase(tipoCarga.id);
    }, 0);
  }

}
