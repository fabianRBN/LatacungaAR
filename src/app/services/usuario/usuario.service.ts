import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Http ,HttpModule} from '@angular/http'


@Injectable()
export class UsuarioService {

  public usuario = new Usuario();
  constructor(public afDatabase: AngularFireDatabase) { }

  crearUsuario(usuario: Usuario) {

    return this.afDatabase.object('usuario/'+ usuario.id).set({
      nombre: usuario.nombre,
      email: usuario.email,
      photoURL: usuario.photoURL,
      
    });
  }
  obtenerUsuarioPorKey(key: string): AngularFireList<Usuario[]> {
    return this.afDatabase.list('usuario/', ref =>
      ref.orderByKey().equalTo(key)
    );

  }

  registroUsuario(usuario: Usuario){
    var consulta = this.afDatabase.list('usuario/', ref =>ref.orderByKey().equalTo(usuario.id)).snapshotChanges()
      .subscribe(item => {
       if(item.length > 0){

        consulta.unsubscribe();

       }else{
         
        this.crearUsuario(usuario);
        this.usuario = usuario;
        consulta.unsubscribe();
        
       }
        
      });

   
  }


}
