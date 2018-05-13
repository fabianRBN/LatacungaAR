import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Http ,HttpModule} from '@angular/http';
import { Atractivo } from '../../models/atractivo.model';
import { Imagenes } from '../../models/imagenes.model';

@Injectable()
export class AtractivoService {

  constructor(public afDatabase: AngularFireDatabase) { }


  crearAtrativo(atractivo: Atractivo) {

    return this.afDatabase.object('atractivo/'+atractivo.id).set({
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
  obtenerUsuarioPorKey(key: string): AngularFireList<Atractivo[]> {
    return this.afDatabase.list('atractivo/', ref =>
      ref.orderByKey().equalTo(key)
    );

  }

  cargarImagenes(idAtractivo: string, imagen: Imagenes){
    return this.afDatabase.list('atractivo/'+idAtractivo+'/galeria').push({
        titulo: imagen.titulo,
        imagenURL: imagen.imagenURL
      
    });
  }
}
