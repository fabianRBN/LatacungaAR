import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Http ,HttpModule} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Atractivo } from '../../models/atractivo.model';
import { Imagenes } from '../../models/imagenes.model';

@Injectable()
export class AtractivoService {

  constructor(public afDatabase: AngularFireDatabase) { }


  crearAtrativo(atractivo: Atractivo) {

    return this.afDatabase.object('atractivo/'+atractivo.key).set({
      nombre: atractivo.nombre,
      categoria: atractivo.categoria,
      descripcion: atractivo.descripcion,
      observacio: atractivo.observacion,
      posicion: atractivo.posicion,
      creadorUid: atractivo.creadorUid
    });
  }
  obtenertKey(){
    return this.afDatabase.database.ref('atractivo/').push().key;
  }

  obtenerAtractivoPorKey(key: string): AngularFireList<Atractivo[]> {
    return this.afDatabase.list('atractivo/', ref =>
      ref.orderByKey().equalTo(key)
    );

  }

  cargarImagenes(idAtractivo: string, imagen: Imagenes){
    return this.afDatabase.list('atractivo/'+idAtractivo+'/galeria').push({
        titulo: imagen.titulo,
        imagenURL: imagen.imagenURL,
        pathURL: imagen.pathimg
      
    });
  }

  
  listarAtractivos(start, end) {
    return Observable.zip(start, end).switchMap(valor => {
      if (valor[0] == null || valor[0] === '') {
        return this.afDatabase
          .list('/atractivo', ref => ref.orderByChild('nombre'))
          .snapshotChanges();
      } else {
        return this.afDatabase
          .list('/atractivo', ref =>
            ref
              .orderByChild('nombre')
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
}
