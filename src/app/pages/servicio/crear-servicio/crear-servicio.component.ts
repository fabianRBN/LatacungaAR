import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService, AuthService } from '../../../services/service.index';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Georeferencia } from './../../../models/georeferencia.model';
import { Servicio } from './../../../models/servicio.model';
import { Horario } from '../../../models/horario.model';
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
  private horario = new Horario();

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
  public agenciadeViajesArray: string[] = ['', 'Agencia de Viaje'];
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
  public transporteTuristicoArray: string[] = ['', 'Transporte terrestre'];

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
  private inputSiempreAbiertoSubcription: Subscription;
  private inputLunesSubscription: Subscription;
  private inputMartesSubscription: Subscription;
  private inputMiercolesSubscription: Subscription;
  private inputJuevesSubscription: Subscription;
  private inputViernesSubscription: Subscription;
  private inputSabadoSubscription: Subscription;
  private inputDomingoSubscription: Subscription;

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.crearFormulario();
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
    this.inputSiempreAbiertoSubcription.unsubscribe();
    this.inputLunesSubscription.unsubscribe();
    this.inputMartesSubscription.unsubscribe();
    this.inputMiercolesSubscription.unsubscribe();
    this.inputJuevesSubscription.unsubscribe();
    this.inputViernesSubscription.unsubscribe();
    this.inputSabadoSubscription.unsubscribe();
    this.inputDomingoSubscription.unsubscribe();
    if (this.modoEdicion) {
      this.servicioSubscription.unsubscribe();
    }
  }

  guardarServicio() {
    if (!this.frmRegistro.invalid) {
      this.georeferencia.lat = this.marcador.lat;
      this.georeferencia.lng = this.marcador.lng;
      this.obtenerHorarioDeFormulario();
      this.servicio.nombre = this.frmRegistro.value.nombre;
      this.servicio.alias = this.frmRegistro.value.alias;
      this.servicio.categoria = this.frmRegistro.value.categoria;
      this.servicio.tipoDeActividad = this.frmRegistro.value.tipoDeActividad;
      this.servicio.direccion = this.frmRegistro.value.direccion;
      this.servicio.posicion = this.georeferencia;
      this.servicio.contacto = this.frmRegistro.value.contacto || 'Ninguno';
      this.servicio.correo = this.frmRegistro.value.correo || 'Ninguno';
      this.servicio.web = this.frmRegistro.value.web || 'Ninguno';
      this.servicio.facebookPage =
        this.frmRegistro.value.facebookPage || 'Ninguno';
      this.servicio.horario = this.horario;
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
      console.error('Formulario invalido');
    }
  }

  // ====================================================
  // Funciones para manejar el Horario
  // ====================================================
  // Establecer los valores del horario
  obtenerHorarioDeFormulario() {
    this.horario.siempreAbierto = this.frmRegistro.value.siempreAbierto;
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

  // ====================================================
  // Funciones para manejar el Formulario
  // ====================================================
  // Crear el formulario
  crearFormulario() {
    this.frmRegistro = this.formBuilder.group({
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      categoria: ['', [Validators.required, ValidateDropdown]],
      tipoDeActividad: ['', [Validators.required, ValidateDropdown]],
      direccion: ['', [Validators.required]],
      contacto: [''],
      correo: [''],
      web: [''],
      facebookPage: [''],
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
      longitud: ['', Validators.required]
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
    this.inputLatSubcription = this.frmRegistro.controls[
      'latitud'
    ].valueChanges.subscribe(value => {
      this.marcador.lat = value;
    });
    this.inputLngSubcription = this.frmRegistro.controls[
      'longitud'
    ].valueChanges.subscribe(value => {
      this.marcador.lng = value;
    });
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
  }

  // Llenar el formulario con valores del servicio
  formValue(servicio: Servicio) {
    this.frmRegistro.setValue({
      nombre: servicio.nombre,
      alias: servicio.alias,
      categoria: servicio.categoria,
      tipoDeActividad: servicio.tipoDeActividad,
      direccion: servicio.direccion,
      contacto: servicio.contacto || 'Ninguna',
      correo: servicio.correo || 'Ninguna',
      web: servicio.web || 'Ninguna',
      facebookPage: servicio.facebookPage || 'Ninguna',
      siempreAbierto: servicio.horario.siempreAbierto,
      lunesAbierto: servicio.horario.Lunes.abierto,
      lunesHoraInicio: servicio.horario.Lunes.horaInicio || '00:00',
      lunesHoraFinal: servicio.horario.Lunes.horaSalida || '00:00',
      martesAbierto: servicio.horario.Martes.abierto,
      martesHoraInicio: servicio.horario.Martes.horaInicio || '00:00',
      martesHoraFinal: servicio.horario.Martes.horaSalida || '00:00',
      miercolesAbierto: servicio.horario.Miercoles.abierto,
      miercolesHoraInicio: servicio.horario.Miercoles.horaInicio || '00:00',
      miercolesHoraFinal: servicio.horario.Miercoles.horaSalida || '00:00',
      juevesAbierto: servicio.horario.Jueves.abierto,
      juevesHoraInicio: servicio.horario.Jueves.horaInicio || '00:00',
      juevesHoraFinal: servicio.horario.Jueves.horaSalida || '00:00',
      viernesAbierto: servicio.horario.Viernes.abierto,
      viernesHoraInicio: servicio.horario.Viernes.horaInicio || '00:00',
      viernesHoraFinal: servicio.horario.Viernes.horaSalida || '00:00',
      sabadoAbierto: servicio.horario.Sabado.abierto,
      sabadoHoraInicio: servicio.horario.Sabado.horaInicio || '00:00',
      sabadoHoraFinal: servicio.horario.Sabado.horaSalida || '00:00',
      domingoAbierto: servicio.horario.Domingo.abierto,
      domingoHoraInicio: servicio.horario.Domingo.horaInicio || '00:00',
      domingoHoraFinal: servicio.horario.Domingo.horaSalida || '00:00',
      latitud: servicio.posicion.lat,
      longitud: servicio.posicion.lng
    });
    this.cambioDeTipoDeActividad();
    this.servicio = servicio;
  }
  // Limpiar los campos del formulario
  limpiarElementos() {
    this.frmRegistro.reset();
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
    } else if (this.frmRegistro.controls['categoria'].value === 'Alojamiento') {
      this.tipodeActivdad = this.alojamientoArray;
    } else if (
      this.frmRegistro.controls['categoria'].value === 'Comidas y bebidas'
    ) {
      this.tipodeActivdad = this.comidaBebidasArray;
    } else if (
      this.frmRegistro.controls['categoria'].value ===
      'Recreación, diversión, esparcimiento'
    ) {
      this.tipodeActivdad = this.recreacionDiversionArray;
    } else if (
      this.frmRegistro.controls['categoria'].value === 'Transporte turístico'
    ) {
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
