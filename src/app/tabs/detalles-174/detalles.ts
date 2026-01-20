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
} from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Comercializador } from '../../enums/comercializador';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { TipoTecnologiasBasadaEnInversores, TipoTecnologiasEolica, TipoTecnologiasNoBasadaEnInversores } from '../../enums/tipoTecnologia';
import { Notes } from '../../enums/notes';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-detalles',
  imports: [CommonModule, AccordionModule, FontAwesomeModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './detalles.html',
  styleUrl: './detalles.css',
})
export class Detalles {
  @Input() request: any;
  activeFormIndex: string = '0';

  faNext = faForward;
  faArrowLeft = faArrowLeft;
  faRightFromBracket = faRightFromBracket;
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight;
  faCancel = faXmark;
  faCheck = faCheck;
  faCog = faCog;

  notes = Notes;

  //Insumos
  lstIdTypes: Array<any> = [];
  lstProjectClasification: Array<any> = [];
  lstIdentificationType: Array<any> = [];
  lstDepartments: Array<any> = [];
  lstTowns: Array<any> = [];
  lstAllTowns: Array<any> = [];
  lstClientType: Array<any> = [];
  lstTechnologyType: Array<any> = [];
  lstWindTurbineType: Array<any> = [];
  lstComercializadores: Array<any> = [];

  lstFilesToUpLoad: Array<any> = [];

  lstSocioeconomicStratum: Array<any> = [];

  lstYesOrNot: Array<any> = [
    { description: 'SI', value: true },
    { description: 'NO', value: false },
  ];
  filteredTowns: any[] = [];
  datosGenerales: any

  filter$ = new Subject<string>();

  enumsTecnologyTypes = {
    TipoTecnologiasBasadaEnInversores: TipoTecnologiasBasadaEnInversores,
    TipoTecnologiasEolica: TipoTecnologiasEolica,
    TipoTecnologiasNoBasadaEnInversores: TipoTecnologiasNoBasadaEnInversores,
  };

  canDeliverSurplusesNetwork: boolean = false;
  isAnotherTechnologyTypeSelected: boolean = false;
  multipleTechSelected: boolean = false;
  lstDeliverSurplusesNetwork: Array<string> = ['AGPE', 'AGGE'];
  minDate: string = '';
  workingDays: number = 15;
  comercializador = Comercializador
  form!: FormGroup;

  constructor(private fb: FormBuilder, private storageService:StorageService){
    this.setForm();
  }

  ngOnInit(): void {
    this.datosGenerales = this.storageService.read('datosGenCreg')
    this.setMinPreviewDate();   
    setTimeout(() => {
      this.getData();
    });
  }

  esDispositivoMovil(): boolean {
    return window.innerWidth <= 768;
  }

  setForm() {
    this.form = this.fb.group({
      /** Tipo Generación */
      empresa: [],
      codTipoGeneracion: [-1, [Validators.required, Validators.min(0)]],
      codClasificacionProyecto: [-1, [Validators.required, Validators.min(0)]],
      entregaExcedentes: [true, []],
      ORInstalaActivos: [undefined, [Validators.required]],
      fechaPrevistaOper: [undefined, [Validators.required]],
      /**Información Cliente */
      codComercializador: [undefined, [Validators.required]],
      nombreOtroComercializador: ['', []],
      codCuentaCliente: [, []],
      codigoSic: [, []],
      nombreCliente: ['', [Validators.required]],
      codTipoIdentificacionCliente: [
        -1,
        [Validators.required, Validators.min(0)],
      ],
      numeroIdentificacionCliente: ['', [Validators.required]],
      codDepartamentoCliente: [-1, [Validators.required, Validators.min(0)]],
      codMunicipioCliente: [-1, [Validators.required, Validators.min(0)]],
      barrioCliente: ['', []],
      direccionCliente: ['', [Validators.required]],
      telefonoCliente: [, [Validators.required, Validators.minLength(10)]],
      emailCliente: ['', [Validators.required, Validators.email]],
      codTipoCliente: [-1, [Validators.required, Validators.min(0)]],
      otroTipoCliente: [''],
      codEstratoCliente: [-1, []],
      /** Información Inmueble */
      direccionInmueble: ['', [Validators.required]],
      codMunicipioInmueble: [-1, [Validators.required, Validators.min(0)]],
      corregimientoInmueble: [''],
      veredaInmueble: [''],
      numeroPosteTransformador: ['', [Validators.required]],
      ubicacionGeoWGS: ['', [Validators.required]],
      /** Tipo de tecnología utilizada */
      otroTipoTecnologia: [''],
      capacidadPorTecnologia: [''],
      cuentaConAlmacenamientoEnergia: [
        undefined,
        [Validators.required, Validators.min(0)],
      ],
      capacidadEnKw: [],
      capacidadEnKwh: [],
      otroAlmacenamientoEnergia: [false],
      sistemaBasadoInversores: [
        undefined,
        [Validators.required, Validators.min(0)],
      ],
      sistemaBasadoMaquinasSincronicas: [
        undefined,
        [Validators.required, Validators.min(0)],
      ],
      sistemaBasadoMaquinasNoSincronicas: [
        undefined,
        [Validators.required, Validators.min(0)],
      ],
      otroSistema: [''],
      /** Información de la tecnología de generación de energía (aplica para generación basada en inversores) */
      potenciaPorPanel: [],
      numeroDePaneles: [],
      poseeReleDeFlujoInverso: [],
      capacidadDCInversor: [],
      potenciaTotalACInversor: [],
      voltajeSalidaInversor: [],
      voltajeEntradaInversor: [],
      numeroInversores: [],
      numeroFases: [],
      cuentaControlCentralPlanta: [],
      fabricanteInversores: [],
      modeloInversores: [''],
      cumpleEstandarUL1741_2010: [undefined],
      versionEstandarUL1741_2010: [''],
      cumpleEstandarIEC61727_2004: [undefined],
      versionEstandarIEC61727_2004: [''],
      transfoPotNominalInv: [],
      transfoImpedanciaCcInv: [],
      transfoGrupoConexInv: [''],
      notaTecnoInversores: [],
      /**Información de la tecnología de generación de energía NO basada en inversores  */
      fabricanteGenerador: [''],
      modeloGenerador: [''],
      voltajeGenerador: [''],
      potenciaNominal: [],
      factorPotencia: [],
      numeroFasesNoBasadaEnInversores: [],
      transfoPotNominal: [],
      transfoImpedanciaCc: [],
      transfoGrupoConex: [''],
      descripcionElementos: [],
      cumpleEstandarIEEE1547_2003: [undefined],
      anioIeee1547: [],
      notaTecnoNoInversores: [],
      /** Información de la tecnología de generación de energía eólica */
      fabricanteAerogenerador: [''],
      modeloAerogenerador: [],
      voltajeAc: [],
      potenciaNominalEol: [],
      numAerogeneradores: [],
      codTipoAerogenerador: [],
      cuentaConControlCentralPlanta: [undefined],
      transfoPotNominalEol: [],
      transfoImpedanciaCcEol: [],
      transfoGrupoConexEol: [''],
      descripcionElementosEol: [],
      cumpleEstandarIEEE1547_2003_Eolica: [undefined],
      anioIeee1547_Eolica: [],
      /**Datos Puntos de Conexión */
      capacidadNominalOInstalada: [
        ,
        [Validators.required, Validators.min(1), Validators.max(999999)],
      ],
      potenciaMaximaDeclarada: [
        ,
        [Validators.required, Validators.max(4999)],
      ],
      nivelTension: [
        ,
        [Validators.required, Validators.max(999999)],
      ],
      codTransformador: ['', [Validators.required]],
      codSubestacion: ['', [Validators.required]],
      /** Protección Anti-isla */
      proteccionAntiIslaInstalada: [undefined, [Validators.required]],
      proteccionAntiIslaNoInstaladaDescripcion: [undefined],
      /**Información Sistema de Medición */
      clienteSuministraraMedidor: [undefined, [Validators.required]],
      medidorTienePerfilHorario: [undefined, [Validators.required]],
      medidorBidireccional: [undefined, [Validators.required]],
      //observaciones
      observaciones: [''],
      //firma
      isDigitalSignature: [false],
      //terminos y condiciones
      terminosYCondiciones: [
        false,
        [Validators.required, Validators.requiredTrue],
      ],
      AutorizaGastosSuperaLimites: [false],
      }
    );
 
    this.form.get('codClasificacionProyecto')?.valueChanges.subscribe(() => {
      this.form.get('capacidadNominalOInstalada')?.updateValueAndValidity();
    });
  }

  setRequestData() {

    // this.isWaiting = true;

    //Tipo Generación
    this.form.controls['codTipoGeneracion'].setValue(
      this.request.cregTipoGeneracion.id
    );
    this.onSelectType();
    this.form.controls['codClasificacionProyecto'].setValue(
      this.request.cregClasificacionProyecto.id
    );
    this.form.controls['entregaExcedentes'].setValue(
      this.request.entregaExcedentes
    );

    this.form.controls['ORInstalaActivos'].setValue(
      this.request.orinstalaActivos
    );

    this.form.controls['fechaPrevistaOper'].setValue(
      this.request.fechaPrevistaOper.split('T')[0]
    );
    //Información Cliente
    const codComercializador = Comercializador.Empresa == this.request.codComercializador ? this.request.codComercializador : 0;

    this.form.controls['codComercializador'].setValue(codComercializador);

    // this.onChangeComercializador();

    this.form.controls['nombreOtroComercializador'].setValue(
      this.request.nombreOtroComercializador
    );
    this.form.controls['codCuentaCliente'].setValue(this.request.codCuentaCliente);
    this.form.controls['codigoSic'].setValue(
      this.request.codigoSic ? this.request.codigoSic : '0'
    );
    this.form.controls['nombreCliente'].setValue(this.request.nombreCliente);
    this.form.controls['codTipoIdentificacionCliente'].setValue(
      this.request.cregTipoIdentificacion.id
    );
    this.form.controls['numeroIdentificacionCliente'].setValue(
      this.request.numeroIdentificacion
    );
    this.form.controls['codDepartamentoCliente'].setValue(
      this.request.codDepartamentoCliente
    );
    //this.onSelectDepartment();
    this.form.controls['codMunicipioCliente'].setValue(
      this.request.cregCiudad.id
    );

    this.onChangeTowns();

    this.form.controls['barrioCliente'].setValue(this.request.barrioCliente);
    this.form.controls['direccionCliente'].setValue(this.request.direccion);
    this.form.controls['telefonoCliente'].setValue(this.request.telefonoCliente);
    this.form.controls['emailCliente'].setValue(this.request.emailCliente);
    this.form.controls['codTipoCliente'].setValue(this.request.codTipoCliente);
    this.form.controls['otroTipoCliente'].setValue(this.request.otroTipoCliente);
    this.form.controls['codEstratoCliente'].setValue(
      this.request.codEstratoCliente
    );

    //Información Inmueble
    if (this.request.creg174Inmueble) {
      this.form.controls['direccionInmueble'].setValue(
        this.request.creg174Inmueble.direccion
      );
      this.form.controls['codMunicipioInmueble'].setValue(
        this.request.creg174Inmueble.municipio
      );
      this.form.controls['corregimientoInmueble'].setValue(
        this.request.creg174Inmueble.corregimiento
      );
      this.form.controls['veredaInmueble'].setValue(
        this.request.creg174Inmueble.vereda
      );
      this.form.controls['numeroPosteTransformador'].setValue(
        this.request.creg174Inmueble.numeroPosteTransformador
      );

      this.form.controls['ubicacionGeoWGS'].setValue(
        this.request.creg174Inmueble.ubicacionGeowgs
      );
    }

    //Tipo Tecnología Utilizada

    const lstTecnUtilizada: Array<any> = this.request.creg174TecnUtilizada;

    if (lstTecnUtilizada && lstTecnUtilizada.length > 0) {
      console.log("this.lstTechnologyType: ",this.lstTechnologyType)
      console.log("this.lstTecnUtilizada: ",lstTecnUtilizada)
      for (let i = 0; i < this.lstTechnologyType.length; i++) {
        let selected: boolean = false;

        const validate = lstTecnUtilizada.find(
          (tu) => tu.cod174Autogen == this.lstTechnologyType[i].id
        );

        if (validate) {
          selected = true;
          this.onCheckTechnologyType(null, i, selected);
          break
        }
      }

      this.form.controls['otroTipoTecnologia'].setValue(
        this.request.creg174Tecnologia.otroTipoTecnologia
      );
      this.form.controls['capacidadPorTecnologia'].setValue(
        this.request.creg174Tecnologia.capacidadKwPorTecnologia
      );
      this.form.controls['cuentaConAlmacenamientoEnergia'].setValue(
        this.request.creg174Tecnologia.almacenamientoEnergia
      );
      this.form.controls['capacidadEnKw'].setValue(
        this.request.creg174Tecnologia.capacidadKw
      );
      this.form.controls['capacidadEnKwh'].setValue(
        this.request.creg174Tecnologia.capacidadKwh
      );
      //this.form.controls.otroAlmacenamientoEnergia.setValue(this.request.solConexionAutogenTecnologia.);
      this.form.controls['sistemaBasadoInversores'].setValue(
        this.request.creg174Tecnologia.basadoInversores
      );
      this.form.controls['sistemaBasadoMaquinasSincronicas'].setValue(
        this.request.creg174Tecnologia.basadoMaqSincronicas
      );
      this.form.controls['sistemaBasadoMaquinasNoSincronicas'].setValue(
        this.request.creg174Tecnologia.basadoMaqAsincronicas
      );
      this.form.controls['otroSistema'].setValue(
        this.request.creg174Tecnologia.otraTecnologiaBase
      );
    }

    //Información de la tecnología de generación de energía (aplica para generación basada en inversores)

    if (this.request.solConexionAutogenBasadaInv) {
      this.form.controls['potenciaPorPanel'].setValue(
        this.request.solConexionAutogenBasadaInv.potenciaPanel
      );
      this.form.controls['numeroDePaneles'].setValue(
        this.request.solConexionAutogenBasadaInv.numPaneles
      );
      this.form.controls['poseeReleDeFlujoInverso'].setValue(
        this.request.solConexionAutogenBasadaInv.poseeRele
      );
      this.form.controls['capacidadDCInversor'].setValue(
        this.request.solConexionAutogenBasadaInv.capacidadDc
      );
      this.form.controls['potenciaTotalACInversor'].setValue(
        this.request.solConexionAutogenBasadaInv.potTotalAc
      );
      this.form.controls['voltajeSalidaInversor'].setValue(
        this.request.solConexionAutogenBasadaInv.voltSalInv
      );
      this.form.controls['voltajeEntradaInversor'].setValue(
        this.request.solConexionAutogenBasadaInv.voltEntInv
      );
      this.form.controls['numeroInversores'].setValue(
        this.request.solConexionAutogenBasadaInv.numInversores
      );
      this.form.controls['numeroFases'].setValue(
        this.request.solConexionAutogenBasadaInv.numFases
      );
      this.form.controls['cuentaControlCentralPlanta'].setValue(
        this.request.solConexionAutogenBasadaInv.poseePpc
      );
      this.form.controls['fabricanteInversores'].setValue(
        this.request.solConexionAutogenBasadaInv.fabricanteInv
      );
      this.form.controls['modeloInversores'].setValue(
        this.request.solConexionAutogenBasadaInv.modeloInv
      );
      this.form.controls['cumpleEstandarUL1741_2010'].setValue(
        this.request.solConexionAutogenBasadaInv.cumpleUl1741
      );
      this.form.controls['versionEstandarUL1741_2010'].setValue(
        this.request.solConexionAutogenBasadaInv?.anioIec61727
      );
      this.form.controls['cumpleEstandarIEC61727_2004'].setValue(
        this.request.solConexionAutogenBasadaInv.cumpleIec61727
      );
      this.form.controls['versionEstandarIEC61727_2004'].setValue(
        this.request.solConexionAutogenBasadaInv?.anioIec61727
      );
      this.form.controls['transfoPotNominalInv'].setValue(
        this.request.solConexionAutogenBasadaInv.transfoPotNominal
      );
      this.form.controls['transfoImpedanciaCcInv'].setValue(
        this.request.solConexionAutogenBasadaInv.transfoImpedanciaCc
      );
      this.form.controls['transfoGrupoConexInv'].setValue(
        this.request.solConexionAutogenBasadaInv.transfoGrupoConex
      );
      this.form.controls['notaTecnoInversores'].setValue(
        this.request.solConexionAutogenBasadaInv.descripcionElementos
      );
    }

    //Información de la tecnología de generación de energía NO basada en inversores

    if (this.request.solConexionAutogenNoBasadaInv) {
      this.form.controls['fabricanteGenerador'].setValue(
        this.request.solConexionAutogenNoBasadaInv.fabricanteGenerador
      );
      this.form.controls['modeloGenerador'].setValue(
        this.request.solConexionAutogenNoBasadaInv.modeloGenerador
      );
      this.form.controls['voltajeGenerador'].setValue(
        this.request.solConexionAutogenNoBasadaInv.voltajeGenerador
      );
      this.form.controls['potenciaNominal'].setValue(
        this.request.solConexionAutogenNoBasadaInv.potenciaNominal
      );
      this.form.controls['factorPotencia'].setValue(
        this.request.solConexionAutogenNoBasadaInv.factorPotencia
      );
      this.form.controls['numeroFasesNoBasadaEnInversores'].setValue(
        this.request.solConexionAutogenNoBasadaInv.numeroFases
      );
      this.form.controls['transfoPotNominal'].setValue(
        this.request.solConexionAutogenNoBasadaInv.transfoPotNominal
      );
      this.form.controls['transfoImpedanciaCc'].setValue(
        this.request.solConexionAutogenNoBasadaInv.transfoImpedanciaCc
      );
      this.form.controls['transfoGrupoConex'].setValue(
        this.request.solConexionAutogenNoBasadaInv.transfoGrupoConex
      );
      this.form.controls['descripcionElementos'].setValue(
        this.request.solConexionAutogenNoBasadaInv.descripcionElementos
      );
      this.form.controls['cumpleEstandarIEEE1547_2003'].setValue(
        this.request.solConexionAutogenNoBasadaInv.cumpleIeee1547
      );
      this.form.controls['anioIeee1547'].setValue(
        this.request.solConexionAutogenNoBasadaInv.anioIeee1547
      );

    }

    //this.form.controls.notaTecnoNoInversores.setValue(this.request.solConexionAutogenNoBasadaInv);
    // Información de la tecnología de generación de energía eólica
    if (this.request.solConexionAutogenInfoEolica) {
      this.form.controls['fabricanteAerogenerador'].setValue(
        this.request.solConexionAutogenInfoEolica.fabricanteAerogenerador
      );
      this.form.controls['modeloAerogenerador'].setValue(
        this.request.solConexionAutogenInfoEolica.fabricanteAerogenerador
      );
      this.form.controls['voltajeAc'].setValue(
        this.request.solConexionAutogenInfoEolica.voltajeAc
      );
      this.form.controls['potenciaNominalEol'].setValue(
        this.request.solConexionAutogenInfoEolica.potenciaNominal
      );
      this.form.controls['numAerogeneradores'].setValue(
        this.request.solConexionAutogenInfoEolica.numAerogeneradores
      );
      this.form.controls['codTipoAerogenerador'].setValue(
        this.request.solConexionAutogenInfoEolica.codTipoAerogenerador
      );
      this.form.controls['cuentaConControlCentralPlanta'].setValue(
        this.request.solConexionAutogenInfoEolica.poseePpc
      );
      this.form.controls['transfoPotNominalEol'].setValue(
        this.request.solConexionAutogenInfoEolica.transfoPotNominal
      );
      this.form.controls['transfoImpedanciaCcEol'].setValue(
        this.request.solConexionAutogenInfoEolica.transfoImpedanciaCc
      );
      this.form.controls['transfoGrupoConexEol'].setValue(
        this.request.solConexionAutogenInfoEolica.transfoGrupoConex
      );
      this.form.controls['descripcionElementosEol'].setValue(
        this.request.solConexionAutogenInfoEolica.descripcionElementos
      );
      this.form.controls['cumpleEstandarIEEE1547_2003_Eolica'].setValue(
        this.request.solConexionAutogenInfoEolica.cumpleIeee1547
      );
      this.form.controls['anioIeee1547_Eolica'].setValue(
        this.request.solConexionAutogenInfoEolica.anioIeee1547
      );
    }

    //Datos Punto Conexión
    this.form.controls['capacidadNominalOInstalada'].setValue(
      this.request.capacidadNominal
    );
    this.form.controls['potenciaMaximaDeclarada'].setValue(
      this.request.potenciaMaximaDeclarada
    );
    this.form.controls['nivelTension'].setValue(this.request.nivelTension);
    this.form.controls['codTransformador'].setValue(
      this.request.codTransformador
    );
    this.form.controls['codSubestacion'].setValue(
      this.request.codSubestacion
    );

    //Protección Anti Isla
    this.form.controls['proteccionAntiIslaInstalada'].setValue(
      this.request.protAntiIslaFuncionProteccion
    );
    this.form.controls['proteccionAntiIslaNoInstaladaDescripcion'].setValue(
      this.request.protAntiIslaDescFuncionAntiIsla
    );

    //Información Sistema de Medición
    this.form.controls['clienteSuministraraMedidor'].setValue(
      this.request.clienteSuministraMedidor
    );
    this.form.controls['medidorTienePerfilHorario'].setValue(
      this.request.medidorPerfilHorario
    );
    this.form.controls['medidorBidireccional'].setValue(
      this.request.medidorBidireccional
    );

    //observaciones
    this.form.controls['observaciones'].setValue(this.request.observaciones);

    this.form.disable();

    // this.isWaiting = false;
  }

  get validProjectClasification(): Array<any> {
    return this.lstProjectClasification.filter((c) => c.valid);
  }

  onSelectType() {
    const generationTypeId = this.form.get('codTipoGeneracion')?.value;

    if (generationTypeId) {
      const documentType = this.lstIdTypes.find(
        (d) => d.id == generationTypeId
      );

      if (documentType) {
        this.lstProjectClasification.forEach((c) => {
          c.valid = c.descripcion.includes(documentType.abreviatura);
        });

        this.form.controls['codClasificacionProyecto'].reset();

        this.canDeliverSurplusesNetwork = this.lstDeliverSurplusesNetwork.find(
          (d) => d == documentType.abreviatura
        )
          ? true
          : false;
      } else {
        this.canDeliverSurplusesNetwork = false;
      }
      
      this.form.get('entregaExcedentes')?.setValue(true);


      this.onValidateProjectClassification();

    }
  }

  onValidateProjectClassification() {

    const validClasfications = this.lstProjectClasification.filter(
      (c) => c.valid == true
    );
    const nClasifications = validClasfications.length;

    if (nClasifications == 1) {
      this.form.controls['codClasificacionProyecto'].setValue(
        validClasfications[0].id
      );
      // this.onRequiredFileValidate();
    } else {
      this.form.controls['codClasificacionProyecto'].reset();
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

  setMinPreviewDate() {
    let dateToSet = new Date();

    let minDays = this.workingDays;

    while (minDays > 0) {
      dateToSet.setDate(dateToSet.getDate() + 1);

      if (dateToSet.getDay() !== 0 && dateToSet.getDay() !== 6) {
        minDays--;
      }
    }

    this.minDate = dateToSet.toISOString().split('T')[0];
  }

  onChangeTowns() {
    const departmentForm = this.form.get('codDepartamentoCliente');
    const townForm = this.form.get('codMunicipioCliente');

    if (departmentForm && townForm) {
      const town = this.lstAllTowns.find((t) => t.id === townForm.value);
      if (town) {
        this.form.get('codDepartamentoCliente')?.setValue(town.codDepartamento);
      }
    }
  }

  filterTowns(searchTerm?: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredTowns = [...this.lstAllTowns];
    } else {
      const term = searchTerm.toLowerCase().trim();
      this.filteredTowns = this.lstAllTowns.filter(town =>
        town.nombreCompleto.toLowerCase().includes(term) ||
        town.nombreCiudad.toLowerCase().includes(term) ||
        town.codDepartamento.toLowerCase().includes(term)
      );
    }
  }

  onSearch(event: { term: string }) {
    this.filter$.next(event.term);
  }

  getData() {
    this.lstIdTypes = this.datosGenerales.data.listadoTipoGeneracion;
    this.lstProjectClasification = this.datosGenerales.data.listadoClasificacionProyecto;
    this.lstIdentificationType = this.datosGenerales.data.listadoTipoIdentificacion;
    this.lstDepartments = this.datosGenerales.data.listadoDepartamento;
    this.lstAllTowns = this.datosGenerales.data.listadoCiudad;
    this.lstClientType = this.datosGenerales.data.listadoTipoCliente;
    this.lstSocioeconomicStratum = this.datosGenerales.data.listadoEstratoSocioeconomico;
    this.lstTechnologyType = this.datosGenerales.data.listadoTipoTecnologia;
    this.lstWindTurbineType = this.datosGenerales.data.listadoTipoAerogenerador;
    this.lstComercializadores = this.datosGenerales.data.listadoComercializador;
    this.lstFilesToUpLoad = this.datosGenerales.data.listadoDocumentosXformularios
      ? this.datosGenerales.data.listadoDocumentosXformularios
      : [];

    this.lstAllTowns = this.lstAllTowns.map(town => ({
      ...town,
      nombreCompleto: `${town.codDepartamento.replace('-S', '').replace('-N', '')} - ${town.nombreCiudad}`
    }));
    this.filteredTowns = [...this.lstAllTowns]; // ¡IMPORTANTE!

    for (let index = 0; index < this.lstTechnologyType.length; index++) {
      this.lstTechnologyType[index].selected = false;
    }

    this.lstProjectClasification.forEach((c) => (c.valid = true));

    if (this.request) {
      this.setRequestData();
    }
      
  }

  onCheckTechnologyType(
    event: any,
    index: number,
    withRequest: boolean | null
  ) {
    this.lstTechnologyType.forEach((t, i) => {
      t.selected = i === index;
    });

    const selectedTechnology = this.lstTechnologyType[index];
    const isOtro = selectedTechnology.descripcion.toLowerCase() === 'otro';

    this.isAnotherTechnologyTypeSelected = isOtro;

    if (!isOtro) {
      this.form.get('otroTipoTecnologia')?.reset();
      this.form.get('otroTipoTecnologia')?.clearValidators();
      this.form.get('otroTipoTecnologia')?.updateValueAndValidity();
    }

    this.multipleTechSelected = false;

    this.form.get('capacidadPorTecnologia')?.reset();
    this.form.get('capacidadPorTecnologia')?.clearValidators();
    this.form.get('capacidadPorTecnologia')?.updateValueAndValidity();
  }

  onAnotherEnergyStorageChange(event: any) {
    this.form.controls['otroAlmacenamientoEnergia'].setValue(event.target.checked);
  }

  get sistemaBasadoInversores(): boolean {
    const lstInversores = this.enumsTecnologyTypes.TipoTecnologiasBasadaEnInversores;
    const lstFilters = this.lstTechnologyType.filter(t => t.id == lstInversores.Solar_FotovoltaicaFV && t.selected);

    return (lstFilters && lstFilters.length) > 0 ? true : false;
  }

  onStandardChanges(standard: string, version: string) {
    const validate = this.yesOrNotValidate(standard);
    this.updateItemRequiredValidator(!validate, version, 1900);
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

  yesOrNotValidate(formControlName: string): boolean {
    const data = this.form.get(formControlName);

    if (data) {
      return data.value == true || data.value == 'true' ? true : false;
    }
    return false;
  }

  get nonInverterBasedPowerGenerationTechnology(): boolean {

    const lstNoInversores = this.enumsTecnologyTypes.TipoTecnologiasNoBasadaEnInversores;
    const lstFilters = this.lstTechnologyType.filter(t => (t.id == lstNoInversores.Biomasa ||
      t.id == lstNoInversores.Cogeneracion ||
      t.id == lstNoInversores.Gas ||
      t.id == lstNoInversores.Hidrqulico ||
      t.id == lstNoInversores.Otro
    ) && t.selected);

    const validate = (lstFilters && lstFilters.length) > 0 ? true : false;
    this.updateSystemBasedNotInvestorsValidator(validate);

    return validate;
  }

  updateSystemBasedNotInvestorsValidator(validate: boolean) {
    this.updateItemRequiredValidator(
      !validate,
      'fabricanteGenerador',
      undefined
    );
    this.updateItemRequiredValidator(!validate, 'modeloGenerador', undefined);
    this.updateItemRequiredValidator(!validate, 'voltajeGenerador', undefined);
    this.updateItemRequiredValidator(!validate, 'potenciaNominal', undefined);
    this.updateItemRequiredValidator(!validate, 'factorPotencia', undefined);
    this.updateItemRequiredValidator(
      !validate,
      'numeroFasesNoBasadaEnInversores',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'cumpleEstandarIEEE1547_2003',
      undefined
    );

    if (!validate) {
      this.updateItemRequiredValidator(!validate, 'anioIeee1547', undefined);
    }
  }

  get windPowerGenerationTechnology(): boolean {
    const lstNoInversores = this.enumsTecnologyTypes.TipoTecnologiasEolica;
    const lstFilters = this.lstTechnologyType.filter(t => (t.id == lstNoInversores.Eólica) && t.selected);

    const validate = (lstFilters && lstFilters.length) > 0 ? true : false;

    this.updateWindPowerValidator(validate);

    return validate;
  }

  updateWindPowerValidator(validate: boolean) {
    this.updateItemRequiredValidator(
      !validate,
      'fabricanteAerogenerador',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'modeloAerogenerador',
      undefined
    );
    this.updateItemRequiredValidator(!validate, 'voltajeAc', undefined);
    this.updateItemRequiredValidator(
      !validate,
      'potenciaNominalEol',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'numAerogeneradores',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'codTipoAerogenerador',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'cuentaConControlCentralPlanta',
      undefined
    );
    this.updateItemRequiredValidator(
      !validate,
      'cumpleEstandarIEEE1547_2003_Eolica',
      undefined
    );

    if (!validate) {
      this.updateItemRequiredValidator(
        !validate,
        'anioIeee1547_Eolica',
        undefined
      );
    }
  }
}
