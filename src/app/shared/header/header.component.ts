import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { auth } from 'firebase/app';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  public email:string;
  public nombre:string;
  public photoUrl:string;
  public usuario = new Usuario();

  constructor(
    public authService: AuthService,
    public usuarioService: UsuarioService
  ) { }

  ngOnInit() {

    this.authService.getAuth().subscribe(
      auth => {
        if(auth){

          this.email = auth.email;
          this.nombre = auth.displayName;
          this.photoUrl = auth.photoURL;
         
     
        }
      }
    )

  }

  onclickLogou(){
    this.authService.logout();
  }

}
