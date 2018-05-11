import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class ArchivoService {



  storageRef;

  constructor() {
    this.storageRef = firebase.storage().ref();
  }

  obtenerReferencia(ubicacion: string) {
    return this.storageRef.child(ubicacion);
  }

  subirArchivo(archivo: File, ubicacion: string) {
    return this.storageRef.child(ubicacion).put(archivo);
  }

  borrarArchivo(ubicacion: string) {
    return this.storageRef.child(ubicacion).delete();
}
}
