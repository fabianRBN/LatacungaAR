import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Cliente } from '../../models/cliente.model';

@Injectable()
export class ClienteService {
  constructor(public afDatabase: AngularFireDatabase) {}

  obtenerClientePorKey(key: string): AngularFireList<Cliente[]> {
    return this.afDatabase.list('cliente/', ref =>
      ref.orderByKey().equalTo(key)
    );
  }

  obtenerClientesPorPersonajeID(personajeID: string) {
    return this.afDatabase.list('cliente/', ref =>
      ref.orderByChild('personajeID').equalTo(personajeID)
    );
  }

  actualizarPersonajeID(clienteKey: string, personajeID: string) {
    return this.afDatabase.list('cliente/').update(clienteKey, {
      personajeID: personajeID
    });
  }

  datosCliente(clienteKey: string){
    return this.afDatabase.object('cliente/'+clienteKey+'/');
  }
}
