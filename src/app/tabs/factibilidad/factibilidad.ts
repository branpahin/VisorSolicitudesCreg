import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Accordion, AccordionModule } from 'primeng/accordion';
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
  faDownload,
  faReply,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Comercializador } from '../../enums/comercializador';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { TipoTecnologiasBasadaEnInversores, TipoTecnologiasEolica, TipoTecnologiasNoBasadaEnInversores } from '../../enums/tipoTecnologia';
import { Notes } from '../../enums/notes';
import { StorageService } from '../../services/storage.service';
import { SolicitudService } from '../../services/solicitud';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factibilidad',
  imports: [CommonModule, AccordionModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './factibilidad.html',
  styleUrl: './factibilidad.css',
})
export class Factibilidad {
  @Input() request: any;
  activeFormIndex: string = '0';

  faCog = faCog;
  faReply = faReply;
  faDeleteLeft = faDeleteLeft;
  faSave = faSave;
  faEdit = faPencilAlt;
  faAnglesRight = faAnglesRight;
  faAnglesLeft = faAnglesLeft;

  form: FormGroup = new FormGroup({
    tipoConexion: new FormControl(undefined),
  }, { updateOn: 'blur' });


  isCliente: boolean = false;

  /**Insumos */
  lstComments: Array<any> = [];
  lstProfiles: Array<any> = [];
  lstAttachmentDiseno: Array<any> = [];
  lstAttachmentRecepcion: Array<any> = [];
  lstAttachmentFactibilidad: Array<any> = [];
  lstAttachmentSeguimientoObra: Array<any> = [];
  lstAttachmentRecibo: Array<any> = [];

  fechaActual = new Date();

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
  lstTipoProyecto: Array<any> = [];
  lstTypeLoadClass: Array<any> = [];

  lstotherAnexos: Array<any> = [];
  lstDocumentosTecnicos: Array<any> = [];

  //Formulario

  listadoDetalleCuentas: Array<any> = [];
  showSi = false;
  showNo = true;
  minDate: string = '';
  radicado!: string;
  ciudad!: string;
  cronogramaCargaFile: any = {
    id: 0,
    descripcion: 'Cronograma de cargas aprobado',
    archivo: [],
    requerido: true,
  };

  isApplicantOuwner = false;
  multipleProjectTypeSelected: boolean = false;
  multipleDocsTecnicosSelected: boolean = false;

  //Titulo Formulario
  title: string = 'Formato solicitud del servicio';
  subTitle: string = 'Antes de diligenciar el formulario es importante conocer el tipo de conexión que requieres. Te recordamos que:';

  // @ViewChild('formTabsItem') tabsItem: Accordion;
  othersFilesToUpload: Array<any> = [];
  requestFactibilidad: any;
  hasFactibilidad: boolean = false;


  constructor(private route: ActivatedRoute,
    private storageService: StorageService,
    private solicitudService: SolicitudService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef){
    this.setForm();
  }

  setForm() {
    this.form = this.fb.group({
      fechaRespuestaFactibilidad: [undefined, [Validators.required]],
      fechaVigenciaFactibilidad: [undefined, [Validators.required]],
      docTecnicos: null,
      tipoCarga: null,
      claseCarga: null,
      valorCantidad: null,
      numeroDocumentoSuscriptor: ['', [Validators.required]],
      tipoSolicitudServicio: [-1, [Validators.required, Validators.min(0)]],
      cargaMaximaAprobada: ['', [Validators.required]],
      cargaKva: ['', [Validators.required]],
      nivelDeTensionAprobado: [-1, [Validators.required, Validators.min(0)]],
      Long: ['', [Validators.required]],
      Lat: ['', [Validators.required]],
      altura: null,
      metro: null,
      numeroSolicitud: null,
      numeroFactibilidad: null,
      nombreProyecto: ['', [Validators.required]],
      observacionesUno: ['', [Validators.required]],
      gestionadoPor: ['', [Validators.required]],
      vigenciaFactibilidad: ['', [Validators.required]],
      nombreCircuitoBT: null,
      numeroCircuitoBT: null,
      nombreCircuitoMT: ['', [Validators.required]],
      numeroCircuitoMT: ['', [Validators.required]],
      distanciaPuntoConexion: ['', [Validators.required]],
      numeroNodo: ['', [Validators.required]],
      nivelCortocircuitoMonofasico: ['', [Validators.required]],
      nivelCortocircuitoTrifasico: ['', [Validators.required]],
      subestacionPotencia: ['', [Validators.required]],
      transformadorDistribucion: null
    }, { updateOn: 'change' });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.radicado = this.route.snapshot.paramMap.get('radicado')!;
      this.ciudad = this.route.snapshot.paramMap.get('ciudad')!;
      const id = this.storageService.read('id')
      if (id) {
        this.form.disable();
        this.getDataFactibilidad(id);
        this.getInitialParametersFactibilidad();
        this.getInitialParameters();
      }
    });
  }

  // setTabsEvents() {
  //   if (this.tabsItem) {
  //     this.tabsItem.onOpen.subscribe((event) => {
  //       const tabActiva = event.index;
  //     });
  //   }
  // }

  get reference(): string {
    let reference: string = '';

    if (this.request && this.request.numeroRadicado) {
      reference = this.request.numeroRadicado;
    }

    return reference;
  }

  get lstHistoric(): Array<any> {
    if (this.request && this.request.pasosPorEtapaSolServicioConexion) {
      return this.request.pasosPorEtapaSolServicioConexion;
    }
    return [];
  }

  onActiveIndexChange(event: any) {
    this.activeFormIndex = event;
  }

  // getDataFactibilidad() {
  //   // const url = this.urlGetFactibilidadxId.replace('{id}', this.requestId.toString());

  //   // this.httpService.Get(url)
  //   //   .pipe(
  //   //     filter((resp) => resp.status === 200 && resp.data),
  //   //     tap((resp) => this.requestFactibilidad = resp.data),
  //   //     catchError((error) => {
  //   //       this.requestFactibilidad = {};
  //   //       return of(error);
  //   //     })
  //   //   )
  //   //   .subscribe(() => { this.getInitialParameters(); });
  // }

  getDataFactibilidad(id : number) {
    this.solicitudService.getFactibilidadSolicitud075(id,this.radicado, this.ciudad).subscribe({
      next: (data) => {
        this.requestFactibilidad = data.data;
        this.setRequestData();
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.error('Error al cargar solicitud', err);
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: err?.error || 'No fue posible cargar la solicitud'
        // });

        // setTimeout(() => {
        //   this.router.navigate(['/']);
        // }, 3000); // espera 3 segundos

        // setTimeout(() => {
        //   this.router.navigate(['/']);
        // }, 3000);
      }
    });
  }

  getInitialParametersFactibilidad() {
    // this.httpService.Get(this.urlGetDatosInicialesFactibilidad).subscribe((res) => {
    //   this.lstFilesToUpLoad = res.data.documentosAnexos ? res.data.documentosAnexos : [];
    //   this.lstDocumentosTecnicos = res.data.documentosRequeridosAnexos ? res.data.documentosRequeridosAnexos : [];
    // });
    
  }

  getInitialParameters() {
    const res = this.storageService.read('datosGenCreg')
    console.log("data: ",res)
    this.lstTypeRequest = res.data.listadoTipoSolicitudServicio;
    this.lstTypePeople = res.data.listadoTipoPersona;
    this.lstTypeZona = res.data.listadoTipoZona;
    this.lstTypeUse = res.data.listadoTipoCliente;
    this.lstSocioEconomicStratum = res.data.listadoEstratoSocioeconomico;
    this.lstIndustrialEconomicActivity = res.data.listadoActividadEconomica;
    this.lstTypeServiceRequested = res.data.listadoTipoServicio;
    this.lstTypeRequestedVoltageLevel = res.data.listadoTipoTension;
    this.lstIdTypeDocument = res.data.listadoTipoIdentificacion;
    this.lstExistingProject = res.data.listadoTipoConstruccion;
    this.lstTipoProyecto = res.data.listadoTipoProyecto;
    this.lstTypeLoadClass = res.data.listadoTipoClaseCarga;
    // this.httpService.Get('SolServicioConexion/GetInitialParams')
    //   .subscribe((res) => {
    //     this.lstTypePeople = res.data.listadoTipoPersona;
    //     this.lstTypeZona = res.data.listadoTipoZona;
    //     this.lstTypeUse = res.data.listadoTipoCliente;
    //     this.lstSocioEconomicStratum = res.data.listadoEstratoSocioeconomico;
    //     this.lstIndustrialEconomicActivity = res.data.listadoActividadEconomica;
    //     this.lstTypeRequest = res.data.listadoTipoSolicitudServicio;
    //     this.lstTypeServiceRequested = res.data.listadoTipoServicio;
    //     this.lstTypeRequestedVoltageLevel = res.data.listadoTipoTension;
    //     this.lstIdTypeDocument = res.data.listadoTipoIdentificacion;
    //     this.lstExistingProject = res.data.listadoTipoConstruccion;
    //     this.lstTipoProyecto = res.data.listadoTipoProyecto;

    //     this.lstTypeLoadClass = res.data.listadoTipoClaseCarga;

    //     this.setRequestData();
    //   });
  }

  setRequestData() {
    // Detalle del Servicio
    const detalleData = this.request.creg075Detalles;

    this.form.controls['numeroSolicitud'].setValue(this.reference);
    this.form.controls['numeroFactibilidad'].setValue(this.reference);
    this.form.controls['fechaRespuestaFactibilidad'].setValue(new Date().toISOString().split('T')[0]);
    this.form.controls['vigenciaFactibilidad'].setValue(12);
    this.form.controls['tipoSolicitudServicio'].setValue(detalleData.codTipoSolicitud);
    this.form.controls['cargaMaximaAprobada'].setValue(detalleData.cargaMaximaRequerida);
    this.form.controls['cargaKva'].setValue(detalleData.cargaExistente);
    this.form.controls['nivelDeTensionAprobado'].setValue(detalleData.codTension);

    // Detalle de cuentas
    const cuentasData = this.request.creg075DetallesCuentas;
    this.pintarCuentasExistentes(cuentasData);
    this.form.controls['transformadorDistribucion'].setValue("No aplica");

    const factibilidadData = this.requestFactibilidad;

    const dataObservaciones = factibilidadData.creg075FactibilidadObs;

    // if (factibilidadData && factibilidadData.id !== 0) {
    if (factibilidadData) {
      this.hasFactibilidad = true;

      const fechaRespFactibilidad = factibilidadData.fechaRespuestaFactibilidad;
      const fechaFactibilidad = factibilidadData.fechaFactibilidad;
      console.log("factibilidadData: ",factibilidadData)
      const fechaRespuestaFactibilidadFinal = fechaRespFactibilidad && fechaRespFactibilidad !== '0001-01-01T00:00:00'
        ? fechaRespFactibilidad.split('T')[0]
        : new Date().toISOString().split('T')[0];

      this.form.controls['fechaRespuestaFactibilidad'].setValue(fechaRespuestaFactibilidadFinal);
      this.form.controls['vigenciaFactibilidad'].setValue(factibilidadData.vigenciaFactibilidad);
      this.form.controls['tipoSolicitudServicio'].setValue(factibilidadData.codTipoSolicitud);
      this.form.controls['cargaMaximaAprobada'].setValue(factibilidadData.cargaAprobada);
      this.form.controls['cargaKva'].setValue(factibilidadData.cargaExistente);
      this.form.controls['nivelDeTensionAprobado'].setValue(factibilidadData.codigoNivelAprobacion);

      factibilidadData.creg075FactibilidadProye.forEach((tipoProyecto: any) => {
        const proyecto = this.lstTipoProyecto.find((x: any) => x.id === tipoProyecto.codTipoProyecto)
        if (proyecto)
          proyecto.selected = true;
      });

      this.form.controls['nombreCircuitoBT'].setValue(factibilidadData.nombreCircuitoBt);
      this.form.controls['numeroCircuitoBT'].setValue(factibilidadData.numeroCircuitoBt);
      this.form.controls['nombreCircuitoMT'].setValue(factibilidadData.nombreCircuitoMt);
      this.form.controls['numeroCircuitoMT'].setValue(factibilidadData.numeroCircuitoMt);
      this.form.controls['subestacionPotencia'].setValue(factibilidadData.subEstacionPotencia);
      this.form.controls['distanciaPuntoConexion'].setValue(factibilidadData.distanciaPuntoConexion);
      this.form.controls['nivelCortocircuitoTrifasico'].setValue(factibilidadData.nivelCortocircuitoTrifasico);
      this.form.controls['nivelCortocircuitoMonofasico'].setValue(factibilidadData.nivelCortocircuitoMonofasico);

      console.log("fechaFactibilidad: ",fechaFactibilidad)
      const fechaFactibilidadFinal = fechaFactibilidad && fechaFactibilidad !== '0001-01-01T00:00:00'
        ? fechaFactibilidad.split('T')[0]
        : new Date().toISOString().split('T')[0];

      this.form.controls['fechaVigenciaFactibilidad'].setValue(fechaFactibilidadFinal);
      this.form.controls['numeroNodo'].setValue(factibilidadData.numeroNodo);
      this.form.controls['Long'].setValue(factibilidadData.geoReferenciaLongitud);
      this.form.controls['Lat'].setValue(factibilidadData.geoReferenciaLatitud);
      this.form.controls['altura'].setValue(factibilidadData.geoReferenciaH);

      this.pintarCuentasExistentes(factibilidadData.creg075FactibilidadDetCuen);

      this.lstDocumentosTecnicos.forEach((doc) => {
        if (factibilidadData.creg075FactibilidadDocu.find(
          (x: any) => x.codDocumentosXFormulario === doc.idDocumentoXFormulario)
        ) {
          doc.selected = true;
        }
      });

      this.form.controls['observacionesUno'].setValue(dataObservaciones.observacion || '');
      this.form.controls['nombreProyecto'].setValue(dataObservaciones.nombreProyecto);
      this.form.controls['gestionadoPor'].setValue(dataObservaciones.gestionadoPor);
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

  pintarCuentasExistentes(cuentasData: any[]) {
    this.listadoDetalleCuentas = cuentasData.map(cuenta => {
      return {
        codTipoCarga: cuenta.codTipoCarga,
        codTipoClaseCarga: cuenta.codTipoClaseCarga,
        ValorCarga: cuenta.valorCarga
      };
    });
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

  nextItem(isNext: boolean) {
    this.activeFormIndex = isNext
      ? String(Number(this.activeFormIndex) + 1)
      : String(Number(this.activeFormIndex) - 1);
  }

  setValidation(field: string, header: string) {
    if (field && field.length > 0) {
      const element = this.elementRef.nativeElement.querySelector('#' + field);
      if (element) {
        element.focus();
      }
    }

    // const index = this.tabsItem.tabs.findIndex((t) => t.header == header);
    // this.activeFormIndex = String(index == -1 ? 0 : index);
  }

  updateItemRequiredValidator(
    isClean: boolean,
    item: string,
    min: number | undefined
  ) {
    if (this.form.get(item)) {
      const validator = isClean == true ? null : [Validators.required];

      if (validator && min != null) {
        validator.push(Validators.min(min));
      }

      this.form.get(item)?.setValidators(validator);
      this.form.get(item)?.updateValueAndValidity();
    }
  }
}
