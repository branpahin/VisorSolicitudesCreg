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

@Component({
  selector: 'app-diseno',
  imports: [CommonModule, AccordionModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './diseno.html',
  styleUrl: './diseno.css',
})
export class Diseno {
   private urlGetProfiles: string = 'Perfil/SearchAllCreg075';
  private urlGetDatosInicialesDiseno: string = 'SolServicioConexionDisenio/GetDatosInicialesDisenio';
  private urlUpdateRequestStatus: string = 'SolServicioConexion/UpdateStatus';
  private urlGetComments: string = 'SolServicioConexionComentario/GetByRequestId?Id={id}';
  private requestId: number = -1;
  private listadoDocumentosXFormulario: Array<any> = [];
  private urlGetDocumentosXformulario: string = 'DocumentosXformulario/GetAll';
  private urlGetDisenioById: string = 'SolServicioConexionDisenio/GetById?Id={id}';

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
  // lstStatus = FormCreg075Status;

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
  lstTypeLoadClass: Array<any> = [];
  lstTipoDocumento: Array<any> = [];

  lstotherAnexos: Array<any> = [];
  lstDocumentosTecnicos: Array<any> = [];
  lstDocumentosFirma: Array<any> = [];

  //Formulario
  activeFormIndex: string = '0';

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
  title: string = 'Formato solicitud del servicio';
  subTitle: string = 'Antes de diligenciar el formulario es importante conocer el tipo de conexión que requieres. Te recordamos que:';

  // actions = AccionesCreg075;
  // @ViewChild('formTabsItem') tabsItem: Accordion;
  lstAttachmentFilesToUpload: Array<any> = [];
  lstSignatureFiles: Array<any> = [];
  requestFactibilidad: any;

  signaturePropietario: string =' ';
  signatureFilePropietario: any = {
    id: 0,
    descripcion: 'Firma del cliente',
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

  //Firma Solicitante
  signatureName: string = 'firma_digital.png';
  isSignaturePropietarioModalVisible: boolean = false;
  isSignatureIngenieroModalVisible: boolean = false;
  isSignatureObservacionesModalVisible: boolean = false;
  requestDisenio: any;


  constructor(private route: ActivatedRoute,
    private storageService: StorageService,
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    private elementRef: ElementRef){
    this.setForm();
  }

 ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = this.storageService.read('id')
      if (id) {
        this.requestId = Number(id);
        this.form.disable();
        this.getDataDiseno(this.requestId);
        this.getInitialParameters();
        // if (this.requestDisenio) {
        //   this.getInitialParameters();
        //   this.setRequestData();
        // }
        // else {
        //   this.getDataDisenio();
        // }
      }
    });
  }

  setForm() {
    this.form = this.fb.group({
      numeroSolicitud: null,
      numeroFactibilidad: null,
      nombreProyecto: ['', [Validators.required]],
      tipoDocumento: [-1, [Validators.required, Validators.min(0)]],
      nombreConstructora: null,
      nit: [null,Validators.required],
      nombreIngeniero: ['', [Validators.required]],
      cedulaIngeniero: ['', [Validators.required]],
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
    }, { updateOn: 'change' });
  }

  getInitialParametersDiseno() {
    // this.httpService.Get(this.urlGetDatosInicialesDiseno).subscribe((res) => {
    //   this.lstFilesToUpLoad = res.data.documentosRequeridosAnexos ? res.data.documentosRequeridosAnexos : [];
    //   this.lstTipoDocumento = res.data.documentosQuePresenta;
    //   this.lstDocumentosFirma = res.data.documentosAnexos;
    //   this.setAnexos();
    //   this.setSignatures();
    // });
  }
  
  setAnexos() {
    this.lstAttachmentFilesToUpload = this.lstFilesToUpLoad.map(f => ({
      id: f.idDocumentoXFormulario,
      descripcion: f.nombre,
      archivo: [] as any[],
      requerido: f.requiered,
      limitLoad: f.limitLoad > 0 ? f.limitLoad : 10485760
    }));
  }

  getDataDiseno(id : number) {
    this.solicitudService.getDisenoSolicitud075(id).subscribe({
      next: (data) => {
        this.requestDisenio = data.data;
        this.setRequestData();
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

  setSignatures() {
    this.lstSignatureFiles = this.lstDocumentosFirma.map(f => ({
      id: f.idDocumentoXFormulario,
      descripcion: f.nombre,
      archivo: [] as any[],
      requerido: f.requiered,
      limitLoad: f.limitLoad > 0 ? f.limitLoad : 10485760
    }));

    this.lstSignatureFiles.forEach((file) => {
      switch (file.id) {
        case 56:
          this.signatureIngenieroFile = file;
          break;
        case 57:
          this.signatureFilePropietario = file;
          break;
        case 58:
          this.signatureObservacionesFile = file;
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

  setTabsEvents() {
    // if (this.tabsItem) {
    //   this.tabsItem.onOpen.subscribe((event) => {
    //     const tabActiva = event.index;
    //   });
    // }
  }

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

  getDataDisenio() {
    // const url = this.urlGetDisenioById.replace('{id}', this.requestId.toString());
    // this.httpService.Get(url).subscribe((resp) => {
    //   if (resp.status == 200 && resp.data) {
    //     this.requestDisenio = resp.data;
    //     this.setRequestData();
    //   }
    // });

    // this.getInitialParameters();
  }

  getInitialParameters() {
    const res = this.storageService.read('datosGenCreg')
    console.log("data: ",res)
    this.lstTypePeople = res.data.listadoTipoPersona;
        this.lstTypeZona = res.data.listadoTipoZona;
        this.lstTypeUse = res.data.listadoTipoCliente;
        this.lstSocioEconomicStratum = res.data.listadoEstratoSocioeconomico;
        this.lstIndustrialEconomicActivity = res.data.listadoActividadEconomica;
        this.lstTypeRequest = res.data.listadoTipoSolicitudServicio;
        this.lstTypeServiceRequested = res.data.listadoTipoServicio;
        this.lstTypeRequestedVoltageLevel = res.data.listadoTipoTension;
        this.lstIdTypeDocument = res.data.listadoTipoIdentificacion;
        this.lstExistingProject = res.data.listadoTipoConstruccion;
        this.lstTipoProyecto = res.data.listadoTipoProyecto;
        this.lstTypeLoadClass = res.data.listadoTipoClaseCarga;

        for (let index = 0; index < this.lstTipoProyecto.length; index++) {
          this.lstTipoProyecto[index].selected = false;
        }
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

    //     for (let index = 0; index < this.lstTipoProyecto.length; index++) {
    //       this.lstTipoProyecto[index].selected = false;
    //     }
    //   });
  }

  setRequestData() {
    this.form.controls['numeroSolicitud'].setValue(this.reference);
    this.form.controls['numeroFactibilidad'].setValue(this.reference);
    console.log("this.requestDisenio:", this.requestDisenio)
    this.form.controls['nombreProyecto'].setValue(this.requestDisenio?.nombreProyecto);
    this.form.controls['tipoDocumento'].setValue(this.requestDisenio?.tipoDocumento);
    this.form.controls['nombreConstructora'].setValue(this.requestDisenio?.nombreConstructora);
    this.form.controls['nit'].setValue(this.requestDisenio?.nit);
    this.form.controls['nombreFirma'].setValue(this.requestDisenio?.nombreObservaciones);
    this.form.controls['cedulaFirma'].setValue(this.requestDisenio?.cedulaObservaciones);

    this.requestDisenio?.creg075DisenioActor.forEach((element: any) => {
      if (element.tipoActor == 0) {
        this.form.controls['nombreIngeniero'].setValue(element.nombre);
        this.form.controls['cedulaIngeniero'].setValue(element.cedula);
        this.form.controls['telefonoIngeniero'].setValue(element.telefono);
        this.form.controls['emailIngeniero'].setValue(element.correo);
      } else if (element.tipoActor == 1) {
        this.form.controls['nombrePropietario'].setValue(element.nombre);
        this.form.controls['cedulaPropietario'].setValue(element.cedula);
        this.form.controls['telefonoPropietario'].setValue(element.telefono);
        this.form.controls['emailPropietario'].setValue(element.correo);
      }
    });
  }

  getRequestComments() {
    // const endpoint = this.urlGetComments.replace('{id}', this.requestId.toString());
    // this.httpService.Get(endpoint).subscribe((resp) => {
    //   if (resp.status == 200 && resp.data) {
    //     this.setComments(resp.data);
    //   }
    // });
  }

  setComments(data: Array<any>) {
    this.lstComments = [];
    data.forEach((c) => {
      const comment: any = {
        id: c.id,
        nombre: c.codUsuarioNavigation.usrNombres,
        apellido: c.codUsuarioNavigation.usrApellidos,
        codPerfil: c.codPerfil,
        codComentario: c.CodSolServicioConexionComentario ? c.CodSolServicioConexionComentario : null,
        codUsuario: c.codEstadoSolicitud,
        tituloComentario: c.tituloComentario,
        descripcionComentario: c.descripcionComentario,
        fechaRegistro: c.fechaRegistro,
        isGestor: c.isGestor,
        anexos: null,
        anexoXDescarga: null
      };
      this.lstComments.push(comment);
    });
  }

  onUpdateComments() {
    this.getDataDisenio();
  }

  onReturn() {
    // this.router.navigate(['/conexiones/solicitudes'])
  }

  onChangeStatus() {
    this.getDataDisenio();
  }

  limpiarSelectores() {
    this.form.patchValue({
      tipoCarga: null,
      claseCarga: null,
      valorCantidad: null
    });
  }

  onRequiredFileValidate(): boolean {
    const filesToSetData = this.lstAttachmentFilesToUpload.filter(f =>
      f.requerido && (f.archivo == undefined || f.archivo == null || (f.archivo && f.archivo.length == 0))
    );

    return filesToSetData.length == 0;
  }

  onRequiredSignatureValidate(file: any): boolean {
    return Boolean(file?.archivo?.length);
  }


  addSignature(body: FormData, file: any) {
    if (file && file.archivo) {
      const fileToUpload = this.generateFileToUpload(file);

      if (fileToUpload) {
        body.append('Files', fileToUpload);
      }
    }
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

  /**Errores */
  //Mostrar errores
  // showError(message: string) {
  //   const optionsSweet: SweetAlertOptions = {
  //     title: '',
  //     text: message,
  //     icon: 'warning',
  //     confirmButtonText: 'Ok',
  //   };

  //   Swal.fire(optionsSweet).then((_) => { });
  // }

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

  validateForm(): boolean {
    return true;
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

  generateFileToUpload(file: any): File | undefined {
    if (file && file.archivo && file.archivo.length != 0) {
      const fileName = file.id + '-' + file.archivo[0].name;

      return new File([file.archivo[0]], fileName, {
        type: file.archivo[0].type,
      });
    }

    return undefined;
  }
}
