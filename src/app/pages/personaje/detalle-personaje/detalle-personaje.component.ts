import { Imagenes } from '../../../models/imagenes.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Personaje } from '../../../models/personaje.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import {
  PersonajeService,
  UsuarioService
} from '../../../services/service.index';

@Component({
  selector: 'app-detalle-personaje',
  templateUrl: './detalle-personaje.component.html',
  styleUrls: ['./detalle-personaje.component.css']
})
export class DetallePersonajeComponent implements OnInit, OnDestroy {
  // Variables y objeto Servicio - usuario
  public usuario = new Usuario();
  public personaje: Personaje;
  private keyServicio: string;

  // Variables y objeto Imagen
  public estilo: string[] = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];

  // Variables del componente
  private usuarioSubscription: Subscription;
  private personajeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private personajeService: PersonajeService,
    private usuraioService: UsuarioService
  ) {}

  ngOnInit() {
    const imagenesTemporales: Imagenes[] = [];
    let imagenTemporal: Imagenes;
    this.personaje = new Personaje();
    this.keyServicio = this.activatedRoute.snapshot.paramMap.get('id');
    this.personajeSubscription = this.personajeService
      .obtenerPersonajePorKey(this.keyServicio)
      .snapshotChanges()
      .map(item => {
        const key = item[0].payload.key;
        const datos = { key, ...item[0].payload.val() };
        return datos;
      })
      .subscribe(item => {
        this.personaje = item as Personaje;
        Object.keys(item.galeria).forEach(key => {
          imagenTemporal = item.galeria[key] as Imagenes;
          imagenTemporal.key = key;
          imagenesTemporales.push(imagenTemporal);
        });
        this.personaje.galeria = imagenesTemporales;
        this.consultarCreador(this.personaje.creadorUid);
      });
  }

  ngOnDestroy() {
    this.personajeSubscription.unsubscribe();
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
      .subscribe(item => {
        this.usuario = item as Usuario;
      });
  }
}
