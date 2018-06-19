import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Comentario } from '../../models/comentario.model';


@Injectable()
export class ComentariosService {

  constructor(public afDatabase: AngularFireDatabase ) { }

  crearComentario(comentario: Comentario) {

    return this.afDatabase.object('atractivo/' + comentario.key).set({
      calificacion: comentario.calificacion,
      contenido: comentario.contenido,
      fecha: comentario.fecha,
      uidUsuario: comentario.uidUsuario
    });
  }

  obtenerComentariosDeAtractivosPorKey(key: string): AngularFireList<Comentario[]> {
    return this.afDatabase.list('comentario/'+key );

  }

}
