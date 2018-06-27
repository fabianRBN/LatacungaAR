import { Observable } from 'rxjs/Observable';
import { Servicio } from './../../models/servicio.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class ServicioService {
  constructor(private afDatabase: AngularFireDatabase) {}

  crearServicio(servicio: Servicio) {
    return this.afDatabase.object('servicio/' + servicio.key).set({
      nombre: servicio.nombre,
      categoria: servicio.categoria,
      tipoDeActividad: servicio.tipoDeActividad,
      direccion: servicio.direccion,
      posicion: servicio.posicion,
      contacto: servicio.contacto,
      web: servicio.web,
      alias: servicio.alias,
      creadorUid: servicio.creadorUid
    });
  }

  obtenerKey() {
    return this.afDatabase.database.ref('servicio/').push().key;
  }

  obtenerServicioPorKey(key: string): AngularFireList<Servicio[]> {
    return this.afDatabase.list('servicio/', ref =>
      ref.orderByKey().equalTo(key)
    );
  }

  actualizarServicio(servicio: Servicio) {
    return this.afDatabase.list('servicio/').set(servicio.key, {
      nombre: servicio.nombre,
      categoria: servicio.categoria,
      tipoDeActividad: servicio.tipoDeActividad,
      direccion: servicio.direccion,
      posicion: servicio.posicion,
      contacto: servicio.contacto,
      web: servicio.web,
      alias: servicio.alias,
      creadorUid: servicio.creadorUid
    });
  }

  listarServicios(star, end, valorDeOrden) {
    return Observable.zip(star, end).switchMap(valor => {
      if (valor[0] == null || valor[0] === '') {
        return this.afDatabase
          .list('servicio/', ref => ref.orderByChild(valorDeOrden))
          .snapshotChanges();
      } else {
        return this.afDatabase
          .list('servicio/', ref =>
            ref
              .orderByChild(valorDeOrden)
              .startAt(valor[0])
              .endAt(valor[1])
          )
          .snapshotChanges();
      }
    });
  }

  borrarServicio(key: string) {
    return this.afDatabase.list('servicio/').remove(key);
  }
  listadeServicios(){
    
    return this.afDatabase.list('servicio/');
  

}
}
