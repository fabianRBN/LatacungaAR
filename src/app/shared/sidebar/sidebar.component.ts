import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/service.index';
import { AuthService } from '../../services/auth/auth.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  public email:string;
  public nombre:string;
  public photoUrl:string ;
  
  public usuario = new Usuario(); 
  constructor(
    public authService:AuthService,
    public _sidebar: SidebarService,
    public usuarioService: UsuarioService) {


   }

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
