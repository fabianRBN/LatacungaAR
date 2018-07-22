import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from './../../../models/servicio.model';
import { Subscription } from 'rxjs/Subscription';
import { Usuario } from './../../../models/usuario.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ServicioService,
  UsuarioService
} from '../../../services/service.index';
import { Horario } from '../../../models/horario.model';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css']
})
export class DetalleServicioComponent implements OnInit, OnDestroy {
  // Variables de Google Maps
  public camera: MapCamera = {
    lat: -0.93368927,
    lng: -78.61496687,
    zoom: 16
  };
  private marcadorActivado = true;
  marcador: Marker = {
    lat: 51.673858,
    lng: 7.815982,
    draggable: false
  };

  // Variables y objeto Servicio - georeferencia - usuario
  public usuario = new Usuario();
  public servicio: Servicio;
  public horarioNoDefinido: boolean;
  private keyServicio: string;

  // Variables del componente
  private usuarioSubscription: Subscription;
  private servicioSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private servicioService: ServicioService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.servicio = new Servicio();
    this.keyServicio = this.activatedRoute.snapshot.paramMap.get('id');
    this.servicioSubscription = this.servicioService
      .obtenerServicioPorKey(this.keyServicio)
      .snapshotChanges()
      .map(item => {
        const key = item[0].payload.key;
        const datos = { key, ...item[0].payload.val() };
        return datos;
      })
      .subscribe(item => {
        this.servicio = item as Servicio;
        this.marcador.lat = this.servicio.posicion.lat;
        this.marcador.lng = this.servicio.posicion.lng;
        this.camera.lat = this.marcador.lat;
        this.camera.lng = this.marcador.lng;
        this.consultarCreador(this.servicio.creadorUid);
        this.verificarHorario(this.servicio.horario);
      });
  }

  ngOnDestroy() {
    this.servicioSubscription.unsubscribe();
    this.usuarioSubscription.unsubscribe();
  }

  consultarCreador(key: string) {
    this.usuarioSubscription = this.usuarioService
      .obtenerUsuarioPorKey(key)
      .snapshotChanges()
      .map(item => {
        const keyUsuario = item[0].payload.key;
        const datos = { keyUsuario, ...item[0].payload.val() };
        return datos;
      })
      .subscribe(value => {
        this.usuario = value as Usuario;
      });
  }

  verificarHorario(horario: Horario) {
    if (!horario.siempreAbierto) {
      if (
        !horario.Lunes.abierto &&
        !horario.Martes.abierto &&
        !horario.Miercoles.abierto &&
        !horario.Jueves.abierto &&
        !horario.Viernes.abierto &&
        !horario.Sabado.abierto &&
        !horario.Domingo.abierto
      ) {
        this.horarioNoDefinido = true;
      }
    }
    this.horarioNoDefinido = false;
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

interface MapCamera {
  lat: number;
  lng: number;
  zoom: number;
}
