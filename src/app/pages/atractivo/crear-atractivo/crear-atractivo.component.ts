import { Component, OnInit, OnDestroy } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Atractivo } from '../../../models/atractivo.model';
import { Georeferencia } from '../../../models/georeferencia.model';
import { Imagenes } from '../../../models/imagenes.model';
import {
  AtractivoService,
  ArchivoService,
  AuthService
} from '../../../services/service.index';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ValidateDropdown } from '../../../validators/dropdownValidator';
import {
  NgbModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import 'sweetalert';
import { Horario } from '../../../models/horario.model';
@Component({
  selector: 'app-crear-atractivo',
  templateUrl: './crear-atractivo.component.html',
  styleUrls: ['./crear-atractivo.component.css'],

})
export class CrearAtractivoComponent implements OnInit, OnDestroy {
  
  model;

  // google maps zoom level
  zoom = 17;

  // initial center position for the map
  lat = -0.9356373;
  lng = -78.6118114;

  // Variables para el cargar imagenes temp y finales
  public labelImagen: string;
  public imagenaSubir = false;
  public imagenTemp: string;
  public archivo: File;
  public imgTemporales: Imagen[] = [];
  public marcadorActivado = true;
  public tituloImagen: string;
  public tituloImagenenEdicion: string;
  public descripcionImagen: string;
  public descripcionImagenEdicion:string;
  public tipoImagenEdicion: string;
  public tipoImagen: string;

  // variables y  objeto Atractivo - georeferencia
  public atractivo = new Atractivo();
  public atractivoEditable = new Atractivo();
  public georeferencia = new Georeferencia();
  public imagenes = new Imagenes();
  public categoriaAtractivos: string[] = [
    '-- Seleccione --',
    'Manifestaciones Culturales',
    'Sitios Naturales'
  ];
  public tipoAtractivo: string[] = [
    '-- Seleccione --',
    'Históricas',
    'Etnográficas',
    'Realizaciones técnicas y científicas'
  ];
  public subtipoAtractivo: string[] = [
    '-- Seleccione --',
    'Arquitectura Religiosa',
    'Arquitectura Civil',
    'Cuevas',
    'Museo',
    'Museos históricos',
    'Obras Técnicas',
    'Sectores Históricos',
    'Manifestaciones Religiosas, Tradiciones y Creencias Populares '
  ];


  public numeroArchivos = 0;
  public numeroArchivosSubidos = 0;
  public date = new Date();

  public spiner = false;
  // Variables para validar campos
  frmRegistro: FormGroup;


  public idAtractivo: string;
  public modoedicion = false;

  private atractivoSubscription: Subscription;
  private usuarioSubscription: Subscription;
  private inputLatSubcription: Subscription;
  private inputLngSubcription: Subscription;
  public atractivoList: Observable<any>;

  // Variables de Horarios
  private authSubscription: Subscription;
  private inputSiempreAbiertoSubcription: Subscription;
  private inputLunesSubscription: Subscription;
  private inputMartesSubscription: Subscription;
  private inputMiercolesSubscription: Subscription;
  private inputJuevesSubscription: Subscription;
  private inputViernesSubscription: Subscription;
  private inputSabadoSubscription: Subscription;
  private inputDomingoSubscription: Subscription;
  private horario = new Horario();


  // Variables para enviar al modal
  modalRef: NgbModalRef;
  public imagenaEditar = new Imagenes();
  // ===================================================
  //         Posicion inicial del mapa de google maps
  // ===================================================
  public camera: MapCamera = {
    lat: -0.93368927,
    lng: -78.61496687,
    zoom: 16
  };

  markers: Marker = {
    lat: 51.673858,
    lng: 7.815982,
    label: 'A',
    draggable: true
  };
   // Switch
   public checkAR = false;
   public check360 = true;

  constructor(
    public atractivoService: AtractivoService,
    public archivoService: ArchivoService,
    public authService: AuthService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    // private geo:GeoAtractivoService
  ) {
    this.frmRegistro = this.fb.group({
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      categoria: ['', [Validators.required, ValidateDropdown]],
      tipo: ['', [Validators.required, ValidateDropdown]],
      subtipo: ['', [Validators.required, ValidateDropdown]],
      direccion: ['', Validators.required],
      permisos:[''],
      usoActual:['', Validators.required],
      impactoPositivo:[''],
      impactoNegativo:[''],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      siempreAbierto: [false],
      lunesAbierto: [false],
      lunesHoraInicio: ['00:00'],
      lunesHoraFinal: ['00:00'],
      martesAbierto: [false],
      martesHoraInicio: ['00:00'],
      martesHoraFinal: ['00:00'],
      miercolesAbierto: [false],
      miercolesHoraInicio: ['00:00'],
      miercolesHoraFinal: ['00:00'],
      juevesAbierto: [false],
      juevesHoraInicio: ['00:00'],
      juevesHoraFinal: ['00:00'],
      viernesAbierto: [false],
      viernesHoraInicio: ['00:00'],
      viernesHoraFinal: ['00:00'],
      sabadoAbierto: [false],
      sabadoHoraInicio: ['00:00'],
      sabadoHoraFinal: ['00:00'],
      domingoAbierto: [false],
      domingoHoraInicio: ['00:00'],
      domingoHoraFinal: ['00:00'],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      observacion: ['']
    });
    this.frmRegistro.controls['lunesHoraInicio'].disable();
    this.frmRegistro.controls['lunesHoraFinal'].disable();
    this.frmRegistro.controls['martesHoraInicio'].disable();
    this.frmRegistro.controls['martesHoraFinal'].disable();
    this.frmRegistro.controls['miercolesHoraInicio'].disable();
    this.frmRegistro.controls['miercolesHoraFinal'].disable();
    this.frmRegistro.controls['juevesHoraInicio'].disable();
    this.frmRegistro.controls['juevesHoraFinal'].disable();
    this.frmRegistro.controls['viernesHoraInicio'].disable();
    this.frmRegistro.controls['viernesHoraFinal'].disable();
    this.frmRegistro.controls['sabadoHoraInicio'].disable();
    this.frmRegistro.controls['sabadoHoraFinal'].disable();
    this.frmRegistro.controls['domingoHoraInicio'].disable();
    this.frmRegistro.controls['domingoHoraFinal'].disable();


    this.inputSiempreAbiertoSubcription = this.frmRegistro.controls[
      'siempreAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['lunesAbierto'].setValue(false);
      this.frmRegistro.controls['martesAbierto'].setValue(false);
      this.frmRegistro.controls['miercolesAbierto'].setValue(false);
      this.frmRegistro.controls['juevesAbierto'].setValue(false);
      this.frmRegistro.controls['viernesAbierto'].setValue(false);
      this.frmRegistro.controls['sabadoAbierto'].setValue(false);
      this.frmRegistro.controls['domingoAbierto'].setValue(false);
      if (value) {
        this.frmRegistro.controls['lunesAbierto'].disable();
        this.frmRegistro.controls['martesAbierto'].disable();
        this.frmRegistro.controls['miercolesAbierto'].disable();
        this.frmRegistro.controls['juevesAbierto'].disable();
        this.frmRegistro.controls['viernesAbierto'].disable();
        this.frmRegistro.controls['sabadoAbierto'].disable();
        this.frmRegistro.controls['domingoAbierto'].disable();
      } else {
        this.frmRegistro.controls['lunesAbierto'].enable();
        this.frmRegistro.controls['martesAbierto'].enable();
        this.frmRegistro.controls['miercolesAbierto'].enable();
        this.frmRegistro.controls['juevesAbierto'].enable();
        this.frmRegistro.controls['viernesAbierto'].enable();
        this.frmRegistro.controls['sabadoAbierto'].enable();
        this.frmRegistro.controls['domingoAbierto'].enable();
      }
    });
    this.inputLunesSubscription = this.frmRegistro.controls[
      'lunesAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['lunesHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['lunesHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['lunesHoraInicio'].enable();
        this.frmRegistro.controls['lunesHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['lunesHoraInicio'].disable();
        this.frmRegistro.controls['lunesHoraFinal'].disable();
      }
    });
    this.inputMartesSubscription = this.frmRegistro.controls[
      'martesAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['martesHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['martesHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['martesHoraInicio'].enable();
        this.frmRegistro.controls['martesHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['martesHoraInicio'].disable();
        this.frmRegistro.controls['martesHoraFinal'].disable();
      }
    });
    this.inputMiercolesSubscription = this.frmRegistro.controls[
      'miercolesAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['miercolesHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['miercolesHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['miercolesHoraInicio'].enable();
        this.frmRegistro.controls['miercolesHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['miercolesHoraInicio'].disable();
        this.frmRegistro.controls['miercolesHoraFinal'].disable();
      }
    });
    this.inputJuevesSubscription = this.frmRegistro.controls[
      'juevesAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['juevesHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['juevesHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['juevesHoraInicio'].enable();
        this.frmRegistro.controls['juevesHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['juevesHoraInicio'].disable();
        this.frmRegistro.controls['juevesHoraFinal'].disable();
      }
    });
    this.inputViernesSubscription = this.frmRegistro.controls[
      'viernesAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['viernesHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['viernesHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['viernesHoraInicio'].enable();
        this.frmRegistro.controls['viernesHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['viernesHoraInicio'].disable();
        this.frmRegistro.controls['viernesHoraFinal'].disable();
      }
    });
    this.inputSabadoSubscription = this.frmRegistro.controls[
      'sabadoAbierto'
    ].valueChanges.subscribe(value => {
      this.frmRegistro.controls['sabadoHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['sabadoHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['sabadoHoraInicio'].enable();
        this.frmRegistro.controls['sabadoHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['sabadoHoraInicio'].disable();
        this.frmRegistro.controls['sabadoHoraFinal'].disable();
      }
    });
    this.inputDomingoSubscription = this.frmRegistro.controls[
      'domingoAbierto'
    ].valueChanges.subscribe(value => {
      this.obtenerHorarioDeFormulario();
      this.frmRegistro.controls['domingoHoraInicio'].setValue('00:00');
      this.frmRegistro.controls['domingoHoraFinal'].setValue('00:00');
      if (value) {
        this.frmRegistro.controls['domingoHoraInicio'].enable();
        this.frmRegistro.controls['domingoHoraFinal'].enable();
      } else {
        this.frmRegistro.controls['domingoHoraInicio'].disable();
        this.frmRegistro.controls['domingoHoraFinal'].disable();
      }
    });

    this.inputLatSubcription = this.frmRegistro.controls['latitud'].valueChanges.subscribe( value => {
      this.markers.lat = value;
    });
    this.inputLngSubcription = this.frmRegistro.controls['longitud'].valueChanges.subscribe( value => {
      this.markers.lng = value;
    });
  }


  obtenerHorarioDeFormulario() {
    this.horario.siempreAbierto = this.frmRegistro.value.siempreAbierto || false;
    this.horario.Lunes = {
      abierto: this.frmRegistro.value.lunesAbierto || false,
      horaInicio: this.frmRegistro.value.lunesHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.lunesHoraFinal || '00:00',
    };
    this.horario.Martes = {
      abierto: this.frmRegistro.value.martesAbierto || false,
      horaInicio: this.frmRegistro.value.martesHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.martesHoraFinal || '00:00'
    };
    this.horario.Miercoles = {
      abierto: this.frmRegistro.value.miercolesAbierto || false,
      horaInicio: this.frmRegistro.value.miercolesHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.miercolesHoraFinal || '00:00'
    };
    this.horario.Jueves = {
      abierto: this.frmRegistro.value.juevesAbierto || false,
      horaInicio: this.frmRegistro.value.juevesHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.juevesHoraFinal || '00:00'
    };
    this.horario.Viernes = {
      abierto: this.frmRegistro.value.viernesAbierto || false,
      horaInicio: this.frmRegistro.value.viernesHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.viernesHoraFinal || '00:00'
    };
    this.horario.Sabado = {
      abierto: this.frmRegistro.value.sabadoAbierto || false,
      horaInicio: this.frmRegistro.value.sabadoHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.sabadoHoraFinal || '00:00'
    };
    this.horario.Domingo = {
      abierto: this.frmRegistro.value.domingoAbierto || false,
      horaInicio: this.frmRegistro.value.domingoHoraInicio || '00:00',
      horaSalida: this.frmRegistro.value.domingoHoraFinal || '00:00'
    };
  }

  formValue(atractivo: Atractivo) {
    this.frmRegistro.setValue({
      nombre: atractivo.nombre,
      alias: atractivo.alias,
      direccion: atractivo.direccion,
      permisos:atractivo.permisos || 'Ninguno',
      usoActual:atractivo.usoActual || 'Ninguno',
      impactoPositivo:atractivo.impactoPositivo || 'Ninguno',
      impactoNegativo:atractivo.impactoNegativo || 'Ninguno',
      descripcion: atractivo.descripcion,
      categoria: atractivo.categoria,
      tipo: atractivo.tipo || '',
      subtipo: atractivo.subtipo || '',
      observacion: atractivo.observacion || 'ninguna',
      siempreAbierto: atractivo.horario.siempreAbierto || false,
      lunesAbierto: atractivo.horario.Lunes.abierto,
      lunesHoraInicio: atractivo.horario.Lunes.horaInicio || '00:00',
      lunesHoraFinal: atractivo.horario.Lunes.horaSalida || '00:00',
      martesAbierto: atractivo.horario.Martes.abierto,
      martesHoraInicio: atractivo.horario.Martes.horaInicio || '00:00',
      martesHoraFinal: atractivo.horario.Martes.horaSalida || '00:00',
      miercolesAbierto: atractivo.horario.Miercoles.abierto,
      miercolesHoraInicio: atractivo.horario.Miercoles.horaInicio || '00:00',
      miercolesHoraFinal: atractivo.horario.Miercoles.horaSalida || '00:00',
      juevesAbierto: atractivo.horario.Jueves.abierto,
      juevesHoraInicio: atractivo.horario.Jueves.horaInicio || '00:00',
      juevesHoraFinal: atractivo.horario.Jueves.horaSalida || '00:00',
      viernesAbierto: atractivo.horario.Viernes.abierto,
      viernesHoraInicio: atractivo.horario.Viernes.horaInicio || '00:00',
      viernesHoraFinal: atractivo.horario.Viernes.horaSalida || '00:00',
      sabadoAbierto: atractivo.horario.Sabado.abierto,
      sabadoHoraInicio: atractivo.horario.Sabado.horaInicio || '00:00',
      sabadoHoraFinal: atractivo.horario.Sabado.horaSalida || '00:00',
      domingoAbierto: atractivo.horario.Domingo.abierto,
      domingoHoraInicio: atractivo.horario.Domingo.horaInicio || '00:00',
      domingoHoraFinal: atractivo.horario.Domingo.horaSalida || '00:00',
      latitud: this.atractivoEditable.posicion.lat,
      longitud: this.atractivoEditable.posicion.lng,
    });

    this.atractivo = this.atractivoEditable;
  }

  // ===================================================
  //         Evento al dar click al markador
  // ===================================================
  clickedMarker() {
    console.log(
      `clicked the marker: lat  ${this.markers.lat}  & lng ${this.markers.lng}`
    );
  }

  // ===================================================
  //         Evento al darle click al mapa
  // ===================================================
  mapClicked($event: MouseEvent) {
    this.markers = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    };
    this.frmRegistro.controls['latitud'].setValue($event.coords.lat);
    this.frmRegistro.controls['longitud'].setValue($event.coords.lng);
    // }else{
    //   swal("Mensaje","Arrastre el marcador para colocar en una nueva posicion","error")
    // }
  }
  // ===================================================
  //         Evento al mover un marcador de google maps
  // ===================================================
  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  cordenadasMapa() {
    this.markers = {
      lat: this.frmRegistro.value.latitud,
      lng: this.frmRegistro.value.longitud,
      draggable: true
    };
  }

//   geoFireAtractivo(atractivoKey: string,lat:number, lng: number ){
//   this.geo.setLocation(atractivoKey , [lat, lng ]);
// }

  ngOnInit() {
    this.usuarioSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.atractivo.creadorUid = auth.uid;
      }
    });
    this.idAtractivo = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idAtractivo) {
      this.modoedicion = true;
      let imagenTemp = new Imagenes();
      this.atractivoList = this.atractivoService
        .obtenerAtractivoPorKey(this.idAtractivo)
        .snapshotChanges();
      this.atractivoSubscription = this.atractivoList
        .map(item => {
          const key = item[0].payload.key;
          const datos = { key, ...item[0].payload.val() };
          return datos;
        })
        .subscribe(item => {
          const imgTemp: Imagenes[] = [];
          this.atractivoEditable = item as Atractivo;
          this.atractivoEditable.galeriaObject = item.galeria;
          // Recopilacion de todas la imagenes de galeria
          Object.keys(item.galeria).forEach(key => {
            imagenTemp = item.galeria[key] as Imagenes;
            imagenTemp.key = key;
            imgTemp.push(imagenTemp);
          });
          this.atractivoEditable.galeria = imgTemp;


          // Validacion para ctualizar el horario en atractivos que no cuenten con horario
          if (item.horario) {
              this.horario = item.horario as Horario;
          } else {
            this.obtenerHorarioDeFormulario();
            this.atractivoEditable.horario = this.horario;
          }

          this.markers = {
            lat: this.atractivoEditable.posicion.lat,
            lng: this.atractivoEditable.posicion.lng,
            draggable: false
          };
          this.camera.lat = this.atractivoEditable.posicion.lat;
          this.camera.lng = this.atractivoEditable.posicion.lng;
          this.formValue(this.atractivoEditable);
        });
    } else {
      this.obtenerHorarioDeFormulario();
    }
  }

  ngOnDestroy(): void {
    this.usuarioSubscription.unsubscribe();
    this.inputLatSubcription.unsubscribe();
    this.inputLngSubcription.unsubscribe();
    this.inputSiempreAbiertoSubcription.unsubscribe();
    this.inputLunesSubscription.unsubscribe();
    this.inputMartesSubscription.unsubscribe();
    this.inputMiercolesSubscription.unsubscribe();
    this.inputJuevesSubscription.unsubscribe();
    this.inputViernesSubscription.unsubscribe();
    this.inputSabadoSubscription.unsubscribe();
    this.inputDomingoSubscription.unsubscribe();
    if (this.modoedicion) {
      this.atractivoSubscription.unsubscribe();
    }
  }

  // ===================================================
  //         Funcion para cargar imagenes temporales
  // ===================================================
  selecionarArchivo(archivos: FileList) {
    this.archivo = archivos.item(0);
    if (this.archivo.type.indexOf('image') < 0) {
      swal(
        'Solo Imagenes',
        'El archivo seleccionado no es una Imagen',
        'error'
      );
      return;
    }

    this.labelImagen = this.archivo.name;

    // Vista previa de imagen
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(this.archivo);
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }
  // ===================================================
  //         Agragar imagenes a un array temporal
  // ===================================================
  agregatImagentemp() {
    if (this.tituloImagen === undefined || this.tituloImagen === '') {
      swal('Alerta', 'Se requiere un titulo para la imagen', 'info');
    } else if (this.tipoImagen === undefined || this.tipoImagen === '') {
      swal('Alerta', 'Se requiere un deleccionar un tipo para la imagen', 'info');
    } else {
      this.imgTemporales.push({
        titulo: this.tituloImagen,
        tipo: this.tipoImagen,
        descripcion:this.descripcionImagen || '',
        imagenTemp: this.imagenTemp,
        archivo: this.archivo,
        progreso: 0
      });
      this.numeroArchivos++;
      this.tituloImagen = '';
      this.tipoImagen = '';
      this.descripcionImagen= '';
      this.imagenTemp = null;
      this.labelImagen = '';
    }
  }

  // ===================================================
  //         Funcion para eliminar un elemento temporal
  // ===================================================
  eliminarImagenTemporal(dato: number) {
    this.imgTemporales.splice(dato, 1);
  }

  // ===================================================
  //         Funcion para guardar atractivo
  // ===================================================
  guardarAtractivo() {
    if (!this.frmRegistro.invalid) {
      this.georeferencia.lat = this.markers.lat;
      this.georeferencia.lng = this.markers.lng;
      this.obtenerHorarioDeFormulario();
      this.atractivo.nombre = this.frmRegistro.value.nombre;
      this.atractivo.horario = this.horario;
      this.atractivo.alias = this.frmRegistro.value.alias;
      this.atractivo.direccion = this.frmRegistro.value.direccion;
      this.atractivo.permisos = this.frmRegistro.value.permisos;
      this.atractivo.usoActual = this.frmRegistro.value.usoActual;
      this.atractivo.impactoPositivo = this.frmRegistro.value.impactoPositivo;
      this.atractivo.impactoNegativo = this.frmRegistro.value.impactoNegativo;
      this.atractivo.descripcion = this.frmRegistro.value.descripcion;
      this.atractivo.categoria = this.frmRegistro.value.categoria;
      this.atractivo.tipo = this.frmRegistro.value.tipo;
      this.atractivo.subtipo = this.frmRegistro.value.subtipo;
      this.atractivo.observacion =
        this.frmRegistro.value.observacion || 'Ninguna';
      this.atractivo.posicion = this.georeferencia;
      if (this.modoedicion) {
        this.atractivo.key = this.idAtractivo;
        this.atractivoService.actualizarActractivo(this.atractivo);

        if (this.imgTemporales.length > 0) {
          this.guardarImagenes();
        } else {
          this.mensajedeConfirmacion('actualizado');
        }
      } else if (this.imgTemporales.length <= 0) {
        swal(
          'Alerta',
          'Para registrar un atractivo se requiere un Imgen por lo minimo'
        );
      } else {
        this.atractivo.rating = 0;
        this.atractivo.key = this.atractivoService.obtenertKey();
        this.atractivoService.crearAtrativo(this.atractivo);
        // this.geoFireAtractivo(this.atractivo.key, this.atractivo.posicion.lat , this.atractivo.posicion.lng);
        this.spiner = true;
        this.guardarImagenes();
      }
    } else {
      swal('Error', 'Se deben completar los campos requeridos', 'error');
    }
  }

  // ===================================================
  //         Editar Imagen
  // ===================================================

  editarImagen() {
    this.imagenaEditar.titulo = this.tituloImagenenEdicion;
    this.imagenaEditar.descripcion = this.descripcionImagenEdicion ||'';
    this.imagenaEditar.tipo = this.tipoImagenEdicion ||'';
    if (this.imagenTemp) {
      const imagenNueva: Imagen = {
        titulo: this.tituloImagenenEdicion,
        descripcion:this.descripcionImagenEdicion,
        tipo:this.tipoImagenEdicion,
        imagenTemp: this.imagenTemp,
        archivo: this.archivo,
        progreso: 0
      };

      this.archivoService
        .borrarArchivo(this.imagenaEditar.pathURL)
        .then(relv => {
          console.log('archivo eliminado');
        })
        .catch(err => {
          if (err.code !== 'storage/object-not-found') {
            console.log(err);
          }
        });

      this.subirImagen(this.imagenaEditar);
    }

    this.atractivoService.actualizarImagenes(
      this.atractivo.key,
      this.imagenaEditar
    );

    this.cerrarModal();
  }
  // ===================================================
  //         Cargar Imagenes al servidor
  // ===================================================
  // Se cargan una coleccion de imagenes
  guardarImagenes() {
    this.numeroArchivosSubidos = 0;

    this.imgTemporales.forEach((imgTem, index) => {
      this.guardarImgen(imgTem, index);
    });
  }
  // se carga una unica imagen(Usada para modificar una imagen en especifico)
  guardarImgen(imgTem: Imagen, index: number) {
    let progreso = 0;
    if (imgTem.archivo != null) {
      const ubicacion =
        'imagenes/atractivos/' +
        this.atractivo.key +
        '-' +
        index +
        '' +
        this.date.getMilliseconds();
      // Borrar la imagen anterior
      this.archivoService.borrarArchivo(ubicacion).catch(err => {
        if (err.code !== 'storage/object-not-found') {
          console.log(err);
        }
      });

      const sp = null;
      const uploadTask = this.archivoService.subirArchivo(
        imgTem.archivo,
        ubicacion
      );

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          progreso = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.imgTemporales[index].progreso = progreso;
        },
        error => {
          console.log('error:' + error);
        },
        () => {
          if (progreso >= 100) {
            this.imagenes.imagenURL = uploadTask.snapshot.downloadURL;
            this.imagenes.titulo =
              this.imgTemporales[index].titulo || 'Imagen ' + index;
            this.imagenes.pathURL =
              'imagenes/atractivos/' +
              this.atractivo.key +
              '-' +
              index +
              '' +
              this.date.getMilliseconds().toString();
            this.imagenes.descripcion = this.imgTemporales[index].descripcion || '';
            this.imagenes.tipo = this.imgTemporales[index].tipo || '';
            this.numeroArchivosSubidos++;
            if (
              this.imagenes.imagenURL &&
              this.imagenes.pathURL &&
              this.imagenes.titulo
            ) {
              console.log('Imagen completa');
            }

            this.atractivoService.cargarImagenes(
              this.atractivo.key,
              this.imagenes
            );
          }
          if (this.numeroArchivosSubidos >= this.numeroArchivos) {
            if (this.modoedicion) {
              this.mensajedeConfirmacion('actualizado');
            } else {
              this.mensajedeConfirmacion('registrado');
            }

            this.limpiarElementos();
          }
        }
      );
    }
  }

  mensajedeConfirmacion(mensaje: string) {
    swal('', 'Atractivo: ' + this.atractivo.nombre + ' ' + mensaje, 'success');
    this.spiner = false;
  }

  subirImagen(imagenes: Imagenes) {
    // Subir imagen
    const ubicacion =
      'imagenes/atractivos/' +
      this.atractivo.key +
      '-' +
      this.date.getMilliseconds();
    this.archivoService
      .subirArchivo(this.archivo, ubicacion)
      .then(res => {
        imagenes.imagenURL = res.downloadURL;
        imagenes.pathURL = ubicacion;

        // console.log(imagenes.titulo);
        // console.log(imagenes.key);
        this.atractivoService.actualizarImagenes(this.atractivo.key, imagenes);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // =================================================

  limpiarElementos() {
    this.frmRegistro.reset();

    this.imgTemporales = [];
    this.numeroArchivos = 0;
    this.numeroArchivosSubidos = 0;
  }

  eliminarImagenAtractivo(imagenKey: string, imagenURl: string) {
    this.atractivoService
      .borrarImagenAtractivo(imagenKey, this.atractivo.key)
      .then(res => {
        this.archivoService.borrarArchivo(imagenURl);
      })
      .catch(err => {
        console.error(err);
      });
  }

  // ===================================================
  //         Modal imagenes
  // ===================================================

  mostraModal(modelId, img: Imagenes) {
    this.imagenTemp = null;
    this.tituloImagenenEdicion = img.titulo;
    this.descripcionImagenEdicion = img.descripcion || '';
    this.tipoImagenEdicion = img.tipo || 'Atractivo';
    this.imagenaEditar.titulo = img.titulo;
    this.imagenaEditar.descripcion = img.descripcion || '';
    this.imagenaEditar.tipo = img.tipo || '';
    this.imagenaEditar.pathURL = img.pathURL;
    this.imagenaEditar.imagenURL = img.imagenURL;
    this.imagenaEditar.key = img.key ||'';
    
    this.modalRef = this.modalService.open(modelId, { centered: true });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.labelImagen = '';
    this.modalRef.close();
  }

}

// ===================================================
//         Interfaces
// ===================================================
// Interfaz para imagenes temporales
interface Imagen {
  titulo: string;
  tipo:string;
  descripcion:string;
  imagenTemp: any;
  archivo: File;
  progreso: number;
}

// interfaz para marcadores.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

// interfaz para la camara del mapa
interface MapCamera {
  lat: number;
  lng: number;
  zoom: number;
}
