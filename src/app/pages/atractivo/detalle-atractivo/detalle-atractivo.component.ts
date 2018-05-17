import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AtractivoService } from '../../../services/atractivo/atractivo.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Atractivo } from '../../../models/atractivo.model';
import { MouseEvent } from "@agm/core";
import { Imagenes } from '../../../models/imagenes.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/usuario.model';
@Component({
  selector: 'app-detalle-atractivo',
  templateUrl: './detalle-atractivo.component.html',
  styleUrls: ['./detalle-atractivo.component.css']
})
export class DetalleAtractivoComponent implements OnInit {

    // google maps zoom level
    zoom: number = 18;
    public test = "ejemplo";
    // initial center position for the map
    lat: number = -0.9356373;
    lng: number = -78.6118114;

  markers: marker = {
    lat: 51.673858,
    lng: 7.815982,
    draggable: false
  };
  private usuario = new Usuario();
  private atractivoSubscription: Subscription;
  private usuarioSubscription: Subscription;
  public atractivoList: Observable<any>;
  public imagenesList: Observable<any>;
  public atractivo: Atractivo;
  public estilo: string[] = ['First slide','Second slide','Third slide','Fourth slide','Fifth slide','Sixth slide'];

  public idAtractivo: string;
  constructor( 
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private atractivoService: AtractivoService,
    private usuraioService: UsuarioService
  ) { }

  //====================================================
  //         Evento al dar click al markador
  //====================================================
  
  //====================================================
  //         Evento al darle click al mapa
  //====================================================

  //====================================================
  //         Evento al mover un marcador de google maps
  //====================================================
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  ngOnInit() {
    const imgTemp: Imagenes[]= [];
    let imagenTemp = new Imagenes();
    this.atractivo = new Atractivo();
    this.idAtractivo = this.activatedRoute.snapshot.paramMap.get('id');
    this.atractivoList = this.atractivoService.obtenerAtractivoPorKey(this.idAtractivo).snapshotChanges();
    this.atractivoSubscription = this.atractivoList.map(item => {

      const key = item[0].payload.key;
      const datos = {key, ...item[0].payload.val()};

      return datos;
    }).subscribe(item => {
      this.atractivo = item as Atractivo;
      Object.keys(item.galeria).forEach( key => {
        imagenTemp = (item.galeria[key] as Imagenes);
        imagenTemp.key = key;
        imgTemp.push(imagenTemp);
        });
      this.atractivo.galeria = imgTemp;
      
  

      this.markers = {
        lat: this.atractivo.posicion.lat,
        lng: this.atractivo.posicion.lng,

        draggable: false
      };
      
      this.consultarCreador(this.atractivo.creadorUid);
  });


  }

  ngOnDestroy(){
    this.atractivoSubscription.unsubscribe();
    this.usuarioSubscription.unsubscribe();
  }

  consultarCreador(key : string){
    this.usuarioSubscription = this.usuraioService.obtenerUsuarioPorKey(key).snapshotChanges()
    .map(item=>{
      const key = item[0].payload.key;
      const datos = {key, ...item[0].payload.val()};

      return datos;
      })
      .subscribe(value=>{
        this.usuario = (value as Usuario)
      });
  }
}
// interfaz para marcadores.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
