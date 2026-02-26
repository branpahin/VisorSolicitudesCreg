import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
import { Tabs, TabList, TabPanel, Tab } from "primeng/tabs";

@Component({
  selector: 'app-recibo_tecnico',
  imports: [CommonModule, AccordionModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgSelectModule, Tabs, TabList, TabPanel, Tab],
  templateUrl: './recibo_tecnico.html',
  styleUrl: './recibo_tecnico.css',
})
export class ReciboTecnico {
   private urlGetReciboTecnico: string = 'SolServicioConexionReciboTecnico/GetById?Id={id}';
  private urlGetProfiles: string = 'Perfil/SearchAllCreg075';
  private urlGetDatosInicialesReciboTecnico: string = 'SolServicioConexionReciboTecnico/GetDatosInicialesReciboTenico';
  private requestId: number = -1;

  //Iconos
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
  @Input() request: any;
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
  lstPersonaAutoriza: Array<any> = [];
  lstSolConexion: Array<any> = [];

  lstTypeLoadClass: Array<any> = [];
  lstTipoDocumento: Array<any> = [];

  lstotherAnexos: Array<any> = [];
  lstDocumentosTecnicos: Array<any> = [];
  lstDocumentosOtrosAnexos: Array<any> = [];

  //Formulario
  activeFormIndex: string = '0';
  radicado!: string;
  ciudad!: string;

  listadoDetalleCuentas: Array<any> = [];
  showSi = false;
  showNo = true;
  minDate: string = '';
  cronogramaCargaFile: any = {
    id: 0,
    descripcion: 'Cronograma de cargas aprobado',
    archivo: [],
    requerido: true,
  };

  // validation_messages = ValidationMessages;
  multipleProjectTypeSelected: boolean = false;
  multipleDocsTecnicosSelected: boolean = false;

  //Titulo Formulario
  title: string = 'Formato solicitud de recibo técnico';
  subTitle: string = 'Antes de diligenciar el formulario es importante conocer el tipo de conexión que requieres. Te recordamos que:';

  // @ViewChild('formTabsItem') tabsItem: Accordion;
  lstAttachmentFilesDocsLegales: Array<any> = [];
  lstSignatureFiles: Array<any> = [];
  requestFactibilidad: any;

  signaturePropietario: string = '';
  signatureFilePropietario: any = {
    id: 0,
    descripcion: 'Firma del propietario',
    archivo: [],
    requerido: true,
  };

  signatureIngeniero: string = '';
  signatureIngenieroFile: any = {
    id: 0,
    descripcion: 'Firma del cliente',
    archivo: [],
    requerido: true,
  };

  signatureObservaciones: string = '';
  signatureObservacionesFile: any = {
    id: 0,
    descripcion: 'Firma del cliente',
    archivo: [],
    requerido: true,
  };

  resumenCuentaFile: any = {
    id: 0,
    descripcion: 'Resumen de cuentas o detalle de las localizaciones',
    archivo: [],
    requerido: false,
  };

  anexosFile: any = {
    id: 0,
    descripcion: 'Anexos',
    archivo: [],
    requerido: false,
  };

  //Firma Solicitante
  signatureName: string = 'firma_digital.png';
  isSignaturePropietarioModalVisible: boolean = false;
  isSignatureIngenieroModalVisible: boolean = false;
  isSignatureObservacionesModalVisible: boolean = false;
  requestReciboTecnico: any;

  constructor(private route: ActivatedRoute,
    private storageService: StorageService,
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private elementRef: ElementRef){
    this.setForm();
  }

 ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.radicado = this.route.snapshot.paramMap.get('radicado')!;
      this.ciudad = this.route.snapshot.paramMap.get('ciudad')!;
      const id = this.storageService.read('id')
      if (id) {
        this.requestId = Number(id);
        this.getInitialParametersReciboTecnico();
        this.getDataReciboTecnico(this.requestId);
        this.form.disable();
      }
    });
  }

  setForm() {
    this.form = this.fb.group({
      fechaSolicitud: [undefined, [Validators.required]],
      numeroSolicitud: null,
      mediooficina: ['', [Validators.required]],
      numeroFactibilidad: ['', [Validators.required]],
      tipoSolicitudServicio: [-1, [Validators.required, Validators.min(0)]],
      tipoProyecto: null,
      nombreProyecto: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      comercializador: ['', [Validators.required]],
      matriculaInmobiliaria: null,
      clienteActivo: null,
      personaAutoriza: [-1, [Validators.required, Validators.min(0)]],
      solicitudConexion: [-1, [Validators.required, Validators.min(0)]],
      etapaProyecto: null,
      nombreConstructora: null,
      nit: [null,Validators.required],
      nombreIngeniero: ['', [Validators.required]],
      cedulaIngeniero: ['', [Validators.required]],
      matriculaProfesional: ['', [Validators.required]],
      telefonoIngeniero: ['', [Validators.required]],
      emailIngeniero: ['', [Validators.required]],
      nombrePropietario: ['', [Validators.required]],
      cedulaPropietario: ['', [Validators.required]],
      telefonoPropietario: ['', [Validators.required]],
      emailPropietario: ['', [Validators.required]],
      nombreFirma: ['', [Validators.required]],
      cedulaFirma: ['', [Validators.required]],
      isDigitalSignaturePropietario: [false],
      isDigitalSignatureIngeniero: [false],
      isDigitalSignatureObservaciones: [false],
      observaciones: ['', [Validators.required]],
    }, { updateOn: 'change' });
  }

  getDataReciboTecnico(id : number) {
    this.solicitudService.getReciboTecnicoSolicitud075(id, this.radicado, this.ciudad).subscribe({
      next: (data) => {
        this.requestReciboTecnico = data.data;
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

  getInitialParametersReciboTecnico() {
    const res = this.storageService.read('datosGenCreg')
    console.log("data: ",res)
    this.lstTypeRequest = res.data.listadoTipoSolicitudRecibo;
    this.lstPersonaAutoriza = res.data.listadoPersonaAutorizaRecibo;
    this.lstSolConexion = res.data.listadoTipoCompletitud;
    this.lstTipoProyecto = res.data.listadoTipoProyecto;
    // this.httpService.Get(this.urlGetDatosInicialesReciboTecnico).subscribe((res) => {
    //   this.lstDocumentosOtrosAnexos = res.data.documentosAnexos;
    //   this.lstTipoProyecto = res.data.tiposProyectos;
    //   for (let index = 0; index < this.lstTipoProyecto.length; index++) {
    //     this.lstTipoProyecto[index].selected = false;
    //   }
    //   this.lstTypeRequest = res.data.tiposSolicitud;
    //   this.lstPersonaAutoriza = res.data.personasAutorizaRecibo;
    //   this.lstSolConexion = res.data.tipoCompletitud;
    //   this.lstFilesToUpLoad = res.data.documentosRequeridosAnexos ? res.data.documentosRequeridosAnexos : [];
    //   this.setAnexosDocsLegales();
    //   this.setOtrosAnexos();
    //   this.getDataReciboTecnico();
    // });
  }

  setAnexosDocsLegales() {
    this.lstAttachmentFilesDocsLegales = this.lstFilesToUpLoad.map(f => ({
      id: f.idDocumentoXFormulario,
      descripcion: f.nombre,
      archivo: [] as any[],
      requerido: f.requiered,
    }));
  }

  setOtrosAnexos() {
    var otrosAnexos = this.lstDocumentosOtrosAnexos.map(f => ({
      id: f.idDocumentoXFormulario,
      descripcion: f.nombre,
      archivo: [] as any[],
      requerido: f.requiered,
    }));

    otrosAnexos.forEach((file) => {
      switch (file.id) {
        case 81:
          this.signatureIngenieroFile = file;
          break;
        case 82:
          this.signatureFilePropietario = file;
          break;
        case 79:
          this.resumenCuentaFile = file;
          break;
        case 80:
          this.anexosFile = file;
          break;
      }
    });
  }

  get isDigitalSignaturePropietario() {
    return this.yesOrNotValidate('isDigitalSignaturePropietario');
  }

  get isDigitalSignatureIngeniero() {
    return this.yesOrNotValidate('isDigitalSignatureIngeniero');
  }

  get isDigitalSignatureObservaciones() {
    return this.yesOrNotValidate('isDigitalSignatureObservaciones');
  }

  yesOrNotValidate(formControlName: string): boolean {
    const data = this.form.get(formControlName);

    if (data) {
      return data.value == true || data.value == 'true' ? true : false;
    }
    return false;
  }

  onChangeDigitalSignaturePropietario() {
    if (this.isDigitalSignaturePropietario) {
      this.signaturePropietario = '';
    }

    this.signatureFilePropietario.archivo = [];
  }

  onGetDigitalSignaturePropietario(signature: string) {
    this.signaturePropietario = signature;
    this.isSignaturePropietarioModalVisible = false;
  }

  onGetDigitalSignatureFilePropietario(signatureFile: File) {
    if (signatureFile) {
      this.signatureFilePropietario.archivo = [signatureFile];
    }

    this.isSignaturePropietarioModalVisible = false;
  }

  onCleanSirnaturePropietario() {
    this.signaturePropietario = '';
    this.signatureFilePropietario.archivo = [];
  }

  onCancelSignatureModalPropietario() {
    this.isSignaturePropietarioModalVisible = false;
  }

  onChangeDigitalSignatureIngeniero() {
    if (this.isDigitalSignatureIngeniero) {
      this.signatureIngeniero = '';
    }

    this.signatureIngenieroFile.archivo = [];
  }

  onGetDigitalSignatureIngeniero(signature: string) {
    this.signatureIngeniero = signature;
    this.isSignatureIngenieroModalVisible = false;
  }

  onGetDigitalSignatureFileIngeniero(signatureFile: File) {
    if (signatureFile) {
      this.signatureIngenieroFile.archivo = [signatureFile];
    }

    this.isSignatureIngenieroModalVisible = false;
  }

  onCleanSirnatureIngeniero() {
    this.signatureIngeniero = '';
    this.signatureIngenieroFile.archivo = [];
  }

  onCancelSignatureIngenieroModal() {
    this.isSignatureIngenieroModalVisible = false;
  }

  onChangeDigitalSignatureObservaciones() {
    if (this.isDigitalSignatureObservaciones) {
      this.signatureObservaciones = '';
    }

    this.signatureObservacionesFile.archivo = [];
  }

  onGetDigitalSignatureObservaciones(signature: string) {
    this.signatureObservaciones = signature;
    this.isSignatureObservacionesModalVisible = false;
  }

  onGetDigitalSignatureFileObservaciones(signatureFile: File) {
    if (signatureFile) {
      this.signatureObservacionesFile.archivo = [signatureFile];
    }

    this.isSignatureObservacionesModalVisible = false;
  }

  onCleanSirnatureObservaciones() {
    this.signatureObservaciones = '';
    this.signatureObservacionesFile.archivo = [];
  }

  onCancelSignatureObservacionesModal() {
    this.isSignatureObservacionesModalVisible = false;
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

  getProfiles() {
    // const userLogin = this.storageService.read(USER_STORAGE_DATA);
    // const clientUser = VariablesEntorno.GetClienteUser();
    // if (clientUser != userLogin.usrNombreTipoUsuario) {
    //   this.httpService.Get(this.urlGetProfiles).subscribe((resp) => {
    //     if (resp.status == 200 && resp.data) {
    //       this.lstProfiles = resp.data;
    //     }
    //   });
    // }
  }

  // getDataReciboTecnico() {
  //   // if (!this.requestReciboTecnico) {
  //   //   const url = this.urlGetReciboTecnico.replace('{id}', this.requestId.toString());
  //   //   this.httpService.Get(url).subscribe((resp) => {
  //   //     if (resp.status == 200 && resp.data) {
  //   //       this.requestReciboTecnico = resp.data;
  //   //     }
  //   //   });
  //   // }

  //   // this.getInitialParameters();
  // }

  getInitialParameters() {
    // this.httpService.Get('SolServicioConexion/GetInitialParams')
    //   .subscribe((res) => {
    //     this.lstTypePeople = res.data.listadoTipoPersona;
    //     this.lstTypeZona = res.data.listadoTipoZona;
    //     this.lstTypeUse = res.data.listadoTipoCliente;
    //     this.lstSocioEconomicStratum = res.data.listadoEstratoSocioeconomico;
    //     this.lstIndustrialEconomicActivity = res.data.listadoActividadEconomica;
    //     this.lstTypeServiceRequested = res.data.listadoTipoServicio;
    //     this.lstTypeRequestedVoltageLevel = res.data.listadoTipoTension;
    //     this.lstIdTypeDocument = res.data.listadoTipoIdentificacion;
    //     this.lstExistingProject = res.data.listadoTipoConstruccion;
    //     this.lstTypeLoadClass = res.data.listadoTipoClaseCarga;
    //   });
  }

  isChecked(id: any, tipoProyectos: any[]): boolean {
    return (tipoProyectos?.find(x => x == id))
  }

  // onUpdateComments() {
  //   this.getDataReciboTecnico();
  // }

  // onChangeStatus() {
  //   this.getDataReciboTecnico();
  // }

  limpiarSelectores() {
    this.form.patchValue({
      tipoCarga: null,
      claseCarga: null,
      valorCantidad: null
    });
  }


  onRequiredFileValidate(): boolean {
    const filesToSetData = this.lstAttachmentFilesDocsLegales.filter(f =>
      f.requerido && (f.archivo == undefined || f.archivo == null || (f.archivo && f.archivo.length == 0))
    );

    return filesToSetData.length == 0;
  }

  onRequiredSignatureValidate(file: any): boolean {
    return Boolean(file?.archivo?.length);
  }

  nextItem(isNext: boolean) {
    this.activeFormIndex = isNext
      ? String(Number(this.activeFormIndex) + 1)
      : String(Number(this.activeFormIndex) - 1);
  }

  onCheckProjectType(event: any, index: number, withRequest: boolean | null) {
    let selected: boolean = false;

    if (event && !withRequest) {
      selected = event.target.checked;
    }
    else if (withRequest) {
      selected = withRequest;
    }

    this.lstTipoProyecto[index].selected = selected;
    this.multipleProjectTypeSelected = this.lstTipoProyecto.filter((data) => data.selected === true).length > 1 ? true : false;
  }

  get validateProjectType(): boolean {
    return this.lstTipoProyecto.filter((t) => t.selected).length > 0 ? true : false;
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
}
