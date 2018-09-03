import { Observable } from 'rxjs/Observable';
import { Servicio } from '../../models/servicio.model';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class ServicioService {
  constructor(private afDatabase: AngularFireDatabase) {}

  crearServicio(servicio: Servicio) {
    return this.afDatabase.object('servicio/' + servicio.key).set({
      nombre: servicio.nombre,
      alias: servicio.alias,
      tipoDeActividad: servicio.tipoDeActividad,
      subTipoDeActividad: servicio.subTipoDeActividad,
      categoria: servicio.categoria,
      direccion: servicio.direccion,
      contacto: servicio.contacto,
      correo: servicio.correo,
      web: servicio.web,
      facebookPage: servicio.facebookPage,
      posicion: servicio.posicion,
      horario: servicio.horario,
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
      alias: servicio.alias,
      tipoDeActividad: servicio.tipoDeActividad,
      subTipoDeActividad: servicio.subTipoDeActividad,
      categoria: servicio.categoria,
      direccion: servicio.direccion,
      contacto: servicio.contacto,
      correo: servicio.correo,
      web: servicio.web,
      facebookPage: servicio.facebookPage,
      posicion: servicio.posicion,
      horario: servicio.horario,
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

  listadeServicios() {
    return this.afDatabase.list('servicio/');
  }
}
