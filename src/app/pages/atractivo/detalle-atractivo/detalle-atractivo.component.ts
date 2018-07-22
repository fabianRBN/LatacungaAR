import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AtractivoService } from '../../../services/atractivo/atractivo.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Atractivo } from '../../../models/atractivo.model';
import { MouseEvent } from '@agm/core';
import { Imagenes } from '../../../models/imagenes.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { Horario } from '../../../models/horario.model';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-atractivo',
  templateUrl: './detalle-atractivo.component.html',
  styleUrls: ['./detalle-atractivo.component.css']
})
export class DetalleAtractivoComponent implements OnInit, OnDestroy {
  public camera: MapCamera = {
    lat: -0.93368927,
    lng: -78.61496687,
    zoom: 16
  };
  markers: Marker = {
    lat: 51.673858,
    lng: 7.815982,
    draggable: false
  };
  public usuario = new Usuario();
  private atractivoSubscription: Subscription;
  private usuarioSubscription: Subscription;
  public atractivoList: Observable<any>;
  public imagenesList: Observable<any>;
  public atractivo: Atractivo;
  public estilo: string[] = ['First slide','Second slide','Third slide','Fourth slide','Fifth slide','Sixth slide'];
  public horario = new Horario();
  public horarioEntrada: string[] = ["","","","","","",""];
  public horarioSalida: string[] = ["","","","","","",""];
  public idAtractivo: string;
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private atractivoService: AtractivoService,
    private usuraioService: UsuarioService,
    public config: NgbRatingConfig
  ) { 
    config.max = 5;
    config.readonly = true;
  }

  // ====================================================
  //         Evento al dar click al markador
  // ====================================================

  // ====================================================
  //         Evento al darle click al mapa
  // ====================================================

  // ====================================================
  //         Evento al mover un marcador de google maps
  // ====================================================
  markerDragEnd(m: Marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  ngOnInit() {
    const imgTemp: Imagenes[] = [];
    let imagenTemp = new Imagenes();
    this.atractivo = new Atractivo();
    this.idAtractivo = this.activatedRoute.snapshot.paramMap.get('id');
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
        this.atractivo = item as Atractivo;
        Object.keys(item.galeria).forEach(key => {
          imagenTemp = item.galeria[key] as Imagenes;
          imagenTemp.key = key;
          imgTemp.push(imagenTemp);
        });
      this.atractivo.galeria = imgTemp;
      this.horario = item.horario as Horario;
      this.horarioEntrada[0] = this.horario.Lunes.horaInicio;
      this.horarioEntrada[1] = this.horario.Martes.horaInicio;
      this.horarioEntrada[2] = this.horario.Miercoles.horaInicio;
      this.horarioEntrada[3] = this.horario.Jueves.horaInicio;
      this.horarioEntrada[4] = this.horario.Viernes.horaInicio;
      this.horarioEntrada[5] = this.horario.Sabado.horaInicio;
      this.horarioEntrada[6] = this.horario.Domingo.horaInicio;

      this.horarioSalida[0] = this.horario.Lunes.horaSalida;
      this.horarioSalida[1] = this.horario.Martes.horaSalida;
      this.horarioSalida[2] = this.horario.Miercoles.horaSalida;
      this.horarioSalida[3] = this.horario.Jueves.horaSalida;
      this.horarioSalida[4] = this.horario.Viernes.horaSalida;
      this.horarioSalida[5] = this.horario.Sabado.horaSalida;
      this.horarioSalida[6] = this.horario.Domingo.horaSalida;
      this.markers = {
        lat: this.atractivo.posicion.lat,
        lng: this.atractivo.posicion.lng,

        draggable: false
      };
      
      this.consultarCreador(this.atractivo.creadorUid);
  });


  }

  ngOnDestroy() {
    this.atractivoSubscription.unsubscribe();
    this.usuarioSubscription.unsubscribe();
  }

  consultarCreador(keyUsuario: string) {
    this.usuarioSubscription = this.usuraioService
      .obtenerUsuarioPorKey(keyUsuario)
      .snapshotChanges()
      .map(item => {
        const key = item[0].payload.key;
        const datos = { key, ...item[0].payload.val() };
        return datos;
      })
      .subscribe(value => {
        this.usuario = value as Usuario;
      });
  }

  editarAtractivo() {}
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
