import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService, AuthService } from '../../../services/service.index';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Georeferencia } from './../../../models/georeferencia.model';
import { Servicio } from './../../../models/servicio.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidateDropdown } from '../../../validators/dropdownValidator';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.css']
})
export class CrearServicioComponent implements OnInit, OnDestroy {
  // Variables y objeto Servicio - georeferencia
  private keyServicio: string;
  public servicio = new Servicio();
  private servicioEditable = new Servicio();
  public georeferencia = new Georeferencia();

  // Variables del formulario y validación
  public frmRegistro: FormGroup;
  public categorias: string[] = [
    '',
    'Agencia de viajes',
    'Alojamiento',
    'Comidas y bebidas',
    'Recreación, diversión, esparcimiento',
    'Transporte turístico'
  ];
  public tipodeActivdad: string[];
  public agenciadeViajesArray: string[] = [
    '',
    'Agencia de Viaje'
  ];
  public alojamientoArray: string[] = [
    '',
    'Cabaña',
    'Complejo vacacional',
    'Hostal',
    'Hostal residencia',
    'Hosteria',
    'Hotel',
    'Hotel residencia',
    'Motel',
    'Pension',
    'Refugio'
  ];
  public comidaBebidasArray: string[] = [
    '',
    'Bar',
    'Cafeteria',
    'Fuente de Soda',
    'Restaurante'
  ];
  public recreacionDiversionArray: string[] = [
    '',
    'Discoteca',
    'Sala de recepciones y banquetes',
    'Termas y balnearios'
  ];
  public transporteTuristicoArray: string[] = [
    '',
    'Transporte terrestre'
  ];

  // Variables de Google Maps
  public zoom = 17; // google maps zoom level
  public lat = -0.9356373;
  public lng = -78.6118114; // initial center position for the map
  marcador: Marker = {
    lat: 51.673858,
    lng: 7.815982,
    label: 'A',
    draggable: true
  };

  // Variables del componente
  public modoEdicion = false;
  public spiner = false;
  private servicioSubscription: Subscription;
  private authSubscription: Subscription;
  private inputLatSubcription: Subscription;
  private inputLngSubcription: Subscription;

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.frmRegistro = this.formBuilder.group({
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      categoria: ['', [Validators.required, ValidateDropdown]],
      tipoDeActividad: ['', [Validators.required, ValidateDropdown]],
      direccion: ['', [Validators.required]],
      contacto: [''],
      web: [''],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required]
    });
    this.inputLatSubcription = this.frmRegistro.controls['latitud'].valueChanges.subscribe( value => {
      this.marcador.lat = value;
    });
    this.inputLngSubcription = this.frmRegistro.controls['longitud'].valueChanges.subscribe( value => {
      this.marcador.lng = value;
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.servicio.creadorUid = auth.uid;
      }
    });
    this.cambioDeTipoDeActividad();
    this.keyServicio = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.keyServicio) {
      this.modoEdicion = true;
      this.servicioSubscription = this.servicioService
        .obtenerServicioPorKey(this.keyServicio)
        .snapshotChanges()
        .map(item => {
          const key = item[0].payload.key;
          const datos = { key, ...item[0].payload.val() };
          return datos;
        })
        .subscribe(item => {
          this.servicioEditable = item as Servicio;
          this.marcador.lat = this.servicioEditable.posicion.lat;
          this.marcador.lng = this.servicioEditable.posicion.lng;
          this.lat = this.servicioEditable.posicion.lat;
          this.lng = this.servicioEditable.posicion.lng;
          this.formValue(this.servicioEditable);
        });
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    this.inputLatSubcription.unsubscribe();
    this.inputLngSubcription.unsubscribe();
    if (this.modoEdicion) {
      this.servicioSubscription.unsubscribe();
    }
  }

  guardarServicio() {
    if (!this.frmRegistro.invalid) {
      this.georeferencia.lat = this.marcador.lat;
      this.georeferencia.lng = this.marcador.lng;
      this.servicio.nombre = this.frmRegistro.value.nombre;
      this.servicio.alias = this.frmRegistro.value.alias;
      this.servicio.categoria = this.frmRegistro.value.categoria;
      this.servicio.tipoDeActividad = this.frmRegistro.value.tipoDeActividad;
      this.servicio.direccion = this.frmRegistro.value.direccion;
      this.servicio.posicion = this.georeferencia;
      this.servicio.contacto = this.frmRegistro.value.contacto || 'Niguno';
      this.servicio.web = this.frmRegistro.value.web || 'Niguno';
      if (this.modoEdicion) {
        this.servicio.key = this.keyServicio;
        this.servicioService
          .actualizarServicio(this.servicio)
          .then(res => {
              this.mensajedeConfirmacion('actualizado');
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.servicio.key = this.servicioService.obtenerKey();
        this.servicioService
          .crearServicio(this.servicio)
          .then(res => {
            this.mensajedeConfirmacion('registrado');
          })
          .catch(err => {
            console.error(err);
          });
      }
    } else {
      console.error('NADA PASO');
    }
  }

  // ====================================================
  // Funciones para manejar el Formulario
  // ====================================================
  // Llenar el formulario con valores
  formValue(servicio: Servicio) {
    this.frmRegistro.setValue({
      nombre: servicio.nombre,
      alias: servicio.alias,
      categoria: servicio.categoria,
      tipoDeActividad: servicio.tipoDeActividad,
      direccion: servicio.direccion,
      contacto: servicio.contacto || 'Ninguna',
      web: servicio.web || 'Ninguna',
      latitud: servicio.posicion.lat,
      longitud: servicio.posicion.lng
    });
    this.cambioDeTipoDeActividad();
    this.servicio = servicio;
  }
  // Limpiar los campos del formulario
  limpiarElementos() {
    this.frmRegistro.setValue({
      nombre: '',
      alias: '',
      categoria: '',
      tipoDeActividad: '',
      direccion: '',
      contacto: '',
      web: '',
      latitud: '',
      longitud: ''
    });
  }

  // Enviar mensaje de confirmación
  mensajedeConfirmacion(mensaje: string) {
    swal(
      '',
      'Servicio: ' + this.servicio.nombre + ' ' + mensaje,
      'success'
    ).then(result => {
      if (this.modoEdicion) {
        this.router.navigate(['/detalle-servicio', this.servicio.key]);
      } else {
        this.limpiarElementos();
      }
    });
    this.spiner = false;
  }

  // Poner la lista correcta del tipo de actividad
  cambioDeTipoDeActividad() {
    if (this.frmRegistro.controls['categoria'].value === 'Agencia de viajes') {
      this.tipodeActivdad = this.agenciadeViajesArray;
    } else if (this.frmRegistro.controls['categoria'].value  === 'Alojamiento') {
      this.tipodeActivdad = this.alojamientoArray;
    } else if (this.frmRegistro.controls['categoria'].value  === 'Comidas y bebidas') {
      this.tipodeActivdad = this.comidaBebidasArray;
    } else if (this.frmRegistro.controls['categoria'].value  === 'Recreación, diversión, esparcimiento') {
      this.tipodeActivdad = this.recreacionDiversionArray;
    } else if (this.frmRegistro.controls['categoria'].value  === 'Transporte turístico') {
      this.tipodeActivdad = this.transporteTuristicoArray;
    } else {
      this.tipodeActivdad = this.agenciadeViajesArray.concat(
        this.alojamientoArray,
        this.comidaBebidasArray,
        this.recreacionDiversionArray,
        this.transporteTuristicoArray
      );
    }
  }

  // ====================================================
  // Funciones para manejar Google Maps
  // ====================================================
  // Evento al dar click al marcador
  clickedMarker() {
    console.log(
      `clicked the marker: lat  ${this.marcador.lat}  & lng ${
      this.marcador.lng
      }`
    );
  }

  // Evento al dar click al mapa
  mapClicked($event: MouseEvent) {
    this.marcador.lat = $event.coords.lat;
    this.marcador.lng = $event.coords.lng;
    this.marcador.draggable = true;
    this.frmRegistro.controls['latitud'].setValue($event.coords.lat);
    this.frmRegistro.controls['longitud'].setValue($event.coords.lng);
  }

  // Evento al mover el marcador del mapa
  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
}

// ====================================================
// Interfaces
// ====================================================
// Interfaz para marcadores.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
