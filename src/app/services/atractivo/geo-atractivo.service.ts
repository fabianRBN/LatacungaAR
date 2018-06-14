import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import * as GeoFire from 'geofire';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class GeoAtractivoService {

  dbRef:any;
  geoFire:any;

  hits = new BehaviorSubject([]);
  constructor(private db : AngularFireDatabase) {

    this.dbRef = this.db.list('atractivoGeo/');
    this.geoFire = new GeoFire(this.dbRef.query.ref);

   }

  setLocation(key:string , coords: Array<number>){
      this.geoFire.set(key,coords)
        .then(_ => console.log('location update'))
        .catch(error => console.log(error))
  }

  borrarGeoAtractivo(key: string) {
      this.db.list('atractivoGeo/').remove(key);
  }

}
