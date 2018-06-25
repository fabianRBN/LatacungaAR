import { Observable } from 'rxjs/Observable';
import { Imagenes } from './../../models/imagenes.model';
import { Personaje } from './../../models/personaje.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class PersonajeService {
  constructor(public afDatabase: AngularFireDatabase) {}

  crearPersonaje(personaje: Personaje) {
    return this.afDatabase.object('personaje/' + personaje.key).set({
      nombre: personaje.nombre,
      descripcion: personaje.descripcion,
      creadorUid: personaje.creadorUid,
    });
  }

  obtenerKey() {
    return this.afDatabase.database.ref('personaje/').push().key;
  }

  obtenerPersonajePorKey(key: string): AngularFireList<Personaje[]> {
    return this.afDatabase.list('personaje/', ref =>
      ref.orderByKey().equalTo(key)
    );
  }

  cargarImagenes(keyPersonaje: string, imagen: Imagenes) {
    return this.afDatabase.list('personaje/' + keyPersonaje + '/galeria').push({
      titulo: imagen.titulo,
      imagenURL: imagen.imagenURL,
      pathURL: imagen.pathURL
    });
  }

  actualizarPersonaje(personaje: Personaje) {
    return this.afDatabase.list('personaje/').set(personaje.key, {
      nombre: personaje.nombre,
      descripcion: personaje.descripcion,
      creadorUid: personaje.creadorUid,
      galeria: personaje.galeriaObject
    });
  }

  actualizarImagenes(keyPersonaje: string, imagen: Imagenes) {
    return this.afDatabase
      .list('personaje/' + keyPersonaje + '/galeria')
      .set(imagen.key, {
        titulo: imagen.titulo,
        imagenURL: imagen.imagenURL,
        pathURL: imagen.pathURL
      });
  }

  listarPersonajes(start, end) {
    return Observable.zip(start, end).switchMap(valor => {
      if (valor[0] == null || valor[0] === '') {
        return this.afDatabase
          .list('/personaje', ref => ref.orderByChild('nombre'))
          .snapshotChanges();
      } else {
        return this.afDatabase
          .list('/personaje', ref =>
            ref
              .orderByChild('nombre')
              .startAt(valor[0])
              .endAt(valor[1])
          )
          .snapshotChanges();
      }
    });
  }

  borrarPersonaje(key: string) {
    return this.afDatabase.list('personaje').remove(key);
  }

  borrarImagenPersonaje(key: string, keyPersonaje: string) {
    return this.afDatabase.list('personaje/' + keyPersonaje + '/galeria').remove(key);
  }
}
