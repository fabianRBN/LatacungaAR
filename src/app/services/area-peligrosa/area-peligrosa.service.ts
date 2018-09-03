import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import {Area_peligrosa} from '../../models/area_peligrosa.model';

@Injectable()
export class AreaPeligrosaService {


  constructor(public afDatabase: AngularFireDatabase) { }

  
  crearAtrativo(area: Area_peligrosa) {

    return this.afDatabase.object('areaPeligrosa/' + area.key).set({
      key: area.key,
      nombre: area.nombre,
      latitud: area.latitud,
      longitud: area.longitud,
      radio: area.radio
    });
  }

  listadeAreasPeligrosas(){
    
    return this.afDatabase.list('areaPeligrosa/');

  }
 

}
