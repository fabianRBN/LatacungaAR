import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Http, HttpModule } from '@angular/http';
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/zip";
import { Atractivo } from '../../models/atractivo.model';
import { Imagenes } from '../../models/imagenes.model';

@Injectable()
export class AtractivoService {

  constructor(public afDatabase: AngularFireDatabase) { }


  crearAtrativo(atractivo: Atractivo) {

    return this.afDatabase.object('atractivo/' + atractivo.key).set({
      nombre: atractivo.nombre,
      alias: atractivo.alias,
      categoria: atractivo.categoria,
      tipo: atractivo.tipo,
      subtipo:atractivo.subtipo,
      direccion: atractivo.direccion,
      permisos:atractivo.permisos,
      usoActual: atractivo.usoActual,
      impactoPositivo: atractivo.impactoPositivo,
      impactoNegativo: atractivo.impactoNegativo,
      descripcion: atractivo.descripcion,
      observacio: atractivo.observacion,
      posicion: atractivo.posicion,
      creadorUid: atractivo.creadorUid,
      horario: atractivo.horario,
      rating: atractivo.rating
    });
  }

  obtenertKey() {
    return this.afDatabase.database.ref('atractivo/').push().key;
  }

  obtenerAtractivoPorKey(key: string): AngularFireList<Atractivo[]> {
    return this.afDatabase.list('atractivo/', ref =>
      ref.orderByKey().equalTo(key)
    );

  }

  cargarImagenes(idAtractivo: string, imagen: Imagenes) {
    return this.afDatabase.list('atractivo/' + idAtractivo + '/galeria').push({
      titulo: imagen.titulo,
      imagenURL: imagen.imagenURL,
      pathURL: imagen.pathURL,
      descripcion: imagen.descripcion,
      tipo: imagen.tipo
    });
  }
  cargarImagenes360(idAtractivo: string, imagen: Imagenes) {
    if(imagen!= null){
      return this.afDatabase.object('atractivo/' + idAtractivo + '/imagen360').set({
        imagenURL: imagen.imagenURL,
        pathURL: imagen.pathURL
      });
    }else{
      return this.afDatabase.object('atractivo/' + idAtractivo + '/imagen360').set(null);
    }
    
  }

  setfuncionAR(idAtractivo: string, funcionAR:boolean){
    return  this.afDatabase.object('atractivo/' + idAtractivo ).update({
        funcionAR: funcionAR
    });
  }

  actualizarActractivo(atractivo: Atractivo) {

    return this.afDatabase.list('atractivo/').set(atractivo.key, {
      nombre: atractivo.nombre,
      alias: atractivo.alias,
      categoria: atractivo.categoria,
      tipo: atractivo.tipo,
      subtipo:atractivo.subtipo,
      direccion: atractivo.direccion,
      permisos:atractivo.permisos,
      usoActual: atractivo.usoActual,
      impactoPositivo: atractivo.impactoPositivo,
      impactoNegativo: atractivo.impactoNegativo,
      descripcion: atractivo.descripcion,
      observacio: atractivo.observacion,
      posicion: atractivo.posicion,
      creadorUid: atractivo.creadorUid,
      galeria: atractivo.galeriaObject,
      horario: atractivo.horario,
      rating: atractivo.rating
    });
  }

  actualizarImagenes(idAtractivo: string, imagen: Imagenes) {
    return this.afDatabase.list('atractivo/' + idAtractivo + '/galeria').set(imagen.key, {
      titulo: imagen.titulo,
      imagenURL: imagen.imagenURL,
      pathURL: imagen.pathURL,
      descripcion: imagen.descripcion,
      tipo: imagen.tipo
    });
  }


  listarAtractivos(start, end, tipo, filtro) {
    if(tipo === "rating"){
        
      if(filtro > 0)
     {   return this.afDatabase
        .list('/atractivo', ref =>
          ref
            .orderByChild(tipo)
            .equalTo(Number(filtro))
            
        )
        .snapshotChanges();}
        else{
          return this.afDatabase
        .list('/atractivo', ref =>
          ref
            .orderByChild(tipo)
            
        )
        .snapshotChanges();
        }
    }

    return Observable.zip(start, end).switchMap(valor => {
      if (valor[0] == null || valor[0] === '') {
        return this.afDatabase
          .list('/atractivo', ref => ref.orderByChild(tipo))
          .snapshotChanges();
      } else {
        return this.afDatabase
          .list('/atractivo', ref =>
            ref
              .orderByChild(tipo)
              .startAt(valor[0])
              .endAt(valor[1])
          )
          .snapshotChanges();
      }
    });
  }
  borrarAtractivo(key: string) {
    return this.afDatabase.list('atractivo').remove(key);
  }

  borrarImagenAtractivo(key: string, keyAtractivo: string) {
    return this.afDatabase.list('atractivo/' + keyAtractivo + '/galeria').remove(key);
  }

  listadeAtractivos(){
    
      return this.afDatabase.list('atractivo/');
    
  
  }
  visitasAtractivo(idAtractivo:string){
    
    return this.afDatabase.list('historial/'+idAtractivo+'/');
  }

  visitasAtractivoCliente(idAtractivo:string, idCliente:string){
    return this.afDatabase.list('historial/'+idAtractivo+'/'+idCliente+'/');
  }
}
