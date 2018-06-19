import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Cliente } from '../../models/cliente.model';


@Injectable()
export class ClienteService {

  constructor(public afDatabase: AngularFireDatabase) { }

  obtenerClientePorKey(key: string):AngularFireList<Cliente[]> {
    return this.afDatabase.list('cliente/', ref =>
      ref.orderByKey().equalTo(key)
    );
  }

}
